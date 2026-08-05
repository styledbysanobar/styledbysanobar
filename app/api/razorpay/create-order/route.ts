import { amountPaise, basicAuthHeader, RAZORPAY_ORDERS_URL } from "../../../lib/razorpay";

/* Creates the Razorpay order for the consultation fee.

   The applicant's details and the Meta signals are packed into the order NOTES.
   The Razorpay webhook fires server to server and has no cookies, no headers and
   no session of its own, so whatever it will need later has to be snapshotted
   here, at order time. That is what lets a UPI payer who pays inside their bank
   app and never returns to the tab still produce a matched Purchase event.

   Razorpay note limits: at most 15 keys, each value at most 256 characters. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NOTE_MAX = 256;

/* Sentinel the webhook checks before doing anything. If this Razorpay account
   ever serves a second funnel, the webhook must be able to tell them apart. */
const FUNNEL_KIND = "sanobar_consult";

function truncate(value: string | undefined | null): string {
  if (!value) return "";
  return value.length > NOTE_MAX ? value.slice(0, NOTE_MAX) : value;
}

/* fbc is the click id. If the browser has no _fbc cookie yet (first visit from
   an ad, cookie not written before checkout) it can be reconstructed from the
   fbclid in the URL, which is what the client sends us. */
function readCookie(header: string | null, name: string): string {
  if (!header) return "";
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : "";
}

export async function POST(req: Request) {
  const auth = basicAuthHeader();
  if (!auth) {
    console.error("[create-order] missing RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET");
    return Response.json({ error: "not configured" }, { status: 500 });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    /* An empty body is fine, the notes just carry less. */
  }

  const cookieHeader = req.headers.get("cookie");
  const fbc = readCookie(cookieHeader, "_fbc") || body?.fbc || "";
  const fbp = readCookie(cookieHeader, "_fbp") || body?.fbp || "";
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "";
  const clientUserAgent = req.headers.get("user-agent") || "";

  /* The price is read from env on the server. The client is never asked. */
  const amount = amountPaise();

  const notes: Record<string, string> = {
    kind: FUNNEL_KIND,
    name: truncate(body?.name),
    email: truncate(body?.email),
    phone: truncate(body?.phone),
    fbc: truncate(fbc),
    fbp: truncate(fbp),
    fbclid: truncate(body?.fbclid),
    ip: truncate(clientIp),
    ua: truncate(clientUserAgent),
    utm_source: truncate(body?.utm?.source),
    utm_medium: truncate(body?.utm?.medium),
    utm_campaign: truncate(body?.utm?.campaign),
    utm_content: truncate(body?.utm?.content),
    utm_term: truncate(body?.utm?.term),
  };

  /* Receipt is capped at 40 characters by Razorpay. */
  const receipt = `sscon_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`.slice(0, 40);

  try {
    const res = await fetch(RAZORPAY_ORDERS_URL, {
      method: "POST",
      headers: { authorization: auth, "content-type": "application/json" },
      body: JSON.stringify({ amount, currency: "INR", receipt, notes }),
    });
    const order = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("[create-order] Razorpay rejected", res.status, JSON.stringify(order));
      return Response.json({ error: "could not start payment" }, { status: 502 });
    }

    return Response.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      /* The browser needs the key id to open checkout, and it gets it from here
         rather than from a NEXT_PUBLIC_ build-time value. One env var, no second
         copy that can drift out of sync with the secret it pairs with. */
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("[create-order] request failed", err);
    return Response.json({ error: "could not start payment" }, { status: 502 });
  }
}
