import crypto from "node:crypto";

/* Signature check for the consultation fee.

   This is ONLY the gate that lets a payer through to /book. It deliberately does
   not send Purchase to Meta: the Razorpay webhook is the single place that does
   that, so a UPI payer who never returns to the tab is still counted, and every
   payment produces exactly one Purchase rather than two that have to dedupe. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Constant-time compare so the signature check cannot be timed. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    console.error("[rzp-verify] missing RAZORPAY_KEY_SECRET");
    return Response.json({ ok: false, error: "not configured" }, { status: 500 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const { orderId, paymentId, signature } = body ?? {};
  if (!orderId || !paymentId || !signature) {
    return Response.json({ ok: false, error: "missing fields" }, { status: 400 });
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (!safeEqual(String(signature), expected)) {
    console.warn(`[rzp-verify] signature mismatch for ${paymentId}`);
    return Response.json({ ok: false, error: "verification failed" }, { status: 400 });
  }

  return Response.json({ ok: true, paymentId });
}
