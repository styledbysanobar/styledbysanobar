import crypto from "node:crypto";

import { OFFER, purchaseEventId, sendCapiEvent } from "../../../lib/metaCapi";

/* Razorpay webhook -> Meta Conversions API Purchase.

   This is the server to server authority for the paid step, the twin of the
   Cal.com webhook that sends Lead for a booked consultation. Razorpay POSTs here
   when a payment is captured, so it lands whether or not the payer came back to
   the site. That matters most for UPI: those payers finish inside their bank app
   and a large share never return to the tab, so a browser-side Purchase would
   quietly miss them.

   Because Purchase is sent from here and nowhere else, there is no browser copy
   to deduplicate against. The event_id is still derived from the Razorpay payment
   id, so a redelivered webhook collapses into one conversion instead of two.

   The funnel now reports two events on the same pixel:
     Purchase  paid the consultation fee   (this route)
     Lead      booked the consultation     (app/api/webhooks/cal/route.ts)
   Optimise campaigns on Purchase.

   Razorpay setup: Dashboard -> Settings -> Webhooks -> Add New Webhook
     URL      https://<domain>/api/webhooks/razorpay
     Event    payment.captured
     Secret   RAZORPAY_WEBHOOK_SECRET */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FUNNEL_KIND = "sanobar_consult";
/* At or under Rs 1 is a test payment. It is logged but never sent to Meta, so
   QA runs cannot pollute the dataset the campaigns optimise on. */
const TEST_MAX_PAISE = 100;

/** Constant-time compare so the signature check cannot be timed. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/** Razorpay sometimes returns notes as [] rather than {} when none were set. */
function readNotes(notes: unknown): Record<string, string> {
  if (!notes || typeof notes !== "object" || Array.isArray(notes)) return {};
  const out: Record<string, string> = {};
  Object.entries(notes as Record<string, unknown>).forEach(([k, v]) => {
    if (typeof v === "string") out[k] = v;
  });
  return out;
}

/** Split a single name field into the first and last names Meta wants. Falls
 *  back gracefully: a one word name simply has no last name. */
function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
}

export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[rzp-webhook] missing RAZORPAY_WEBHOOK_SECRET");
    return Response.json({ error: "not configured" }, { status: 500 });
  }

  /* The HMAC is over the exact bytes Razorpay sent, so read the raw body before
     any JSON parsing. */
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");

  if (!signature || !safeEqual(signature, expected)) {
    console.warn("[rzp-webhook] rejected: bad signature");
    return Response.json({ error: "invalid signature" }, { status: 401 });
  }

  let body: any;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  /* Only a captured payment is a conversion. Authorised, failed and refunded are
     not, and would inflate the number if they were let through. */
  if (body?.event !== "payment.captured") {
    return Response.json({ ok: true, skipped: body?.event ?? "unknown" });
  }

  const payment = body?.payload?.payment?.entity;
  if (!payment?.id) {
    console.warn("[rzp-webhook] payment.captured with no payment entity");
    return Response.json({ ok: true, skipped: "no entity" });
  }
  const paymentId: string = payment.id;

  /* Funnel gate. Razorpay delivers every captured payment on the account to this
     URL, so anything not created by our checkout is ignored. */
  const notes = readNotes(payment.notes);
  if (notes.kind !== FUNNEL_KIND) {
    return Response.json({ ok: true, skipped: "other funnel", kind: notes.kind ?? "" });
  }

  const rawAmount = typeof payment.amount === "string" ? parseInt(payment.amount, 10) : payment.amount;
  const paise = Number.isFinite(rawAmount) && rawAmount > 0 ? Number(rawAmount) : 0;
  const value = paise / 100;
  const currency = typeof payment.currency === "string" && payment.currency ? payment.currency : "INR";

  if (paise <= TEST_MAX_PAISE) {
    console.log(`[rzp-webhook] ${paymentId} is a test payment (${paise} paise), Purchase not sent`);
    return Response.json({ ok: true, skipped: "test payment", paymentId });
  }

  const { firstName, lastName } = splitName(notes.name ?? "");

  try {
    const sent = await sendCapiEvent({
      eventName: "Purchase",
      eventId: purchaseEventId(paymentId),
      /* payment.created_at is a Unix timestamp in seconds. */
      eventTimeMs: payment.created_at ? payment.created_at * 1000 : Date.now(),
      eventSourceUrl: process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`
        : undefined,
      person: {
        email: notes.email,
        phone: notes.phone,
        firstName,
        lastName,
        countryCode: "in",
        fbc: notes.fbc,
        fbp: notes.fbp,
        clientIp: notes.ip,
        clientUserAgent: notes.ua,
      },
      customData: {
        ...OFFER,
        value,
        currency,
        payment_id: paymentId,
        payment_method: typeof payment.method === "string" ? payment.method : undefined,
        utm_source: notes.utm_source || undefined,
        utm_medium: notes.utm_medium || undefined,
        utm_campaign: notes.utm_campaign || undefined,
        utm_content: notes.utm_content || undefined,
        utm_term: notes.utm_term || undefined,
        fbclid: notes.fbclid || undefined,
      },
    });

    if (!sent.ok) {
      /* Log loudly but still 200 back to Razorpay. A non-2xx makes Razorpay retry
         the same payment for hours, and a retry storm on a Meta side error helps
         nobody. */
      console.error("[rzp-webhook] CAPI rejected", JSON.stringify(sent));
      return Response.json({ ok: false, capi: sent }, { status: 200 });
    }

    console.log(`[rzp-webhook] Purchase sent ${paymentId} value ${value} ${currency}`);
    return Response.json({ ok: true, event_id: purchaseEventId(paymentId) });
  } catch (err) {
    console.error("[rzp-webhook] CAPI request failed", err);
    return Response.json({ ok: false }, { status: 200 });
  }
}

/* A GET confirms the route deployed and the env is wired, without revealing values. */
export async function GET() {
  return Response.json({
    route: "razorpay -> meta capi purchase",
    configured: Boolean(
      process.env.RAZORPAY_WEBHOOK_SECRET &&
        process.env.META_PIXEL_ID &&
        process.env.META_CAPI_ACCESS_TOKEN
    ),
  });
}
