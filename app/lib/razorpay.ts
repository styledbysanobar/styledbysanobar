/* Razorpay helpers.

   This funnel talks to Razorpay's REST API directly with fetch rather than
   pulling in the SDK, so the project keeps its two-dependency footprint (next +
   react) and nothing new has to be installed. Order creation is one POST and
   signature checking is one HMAC, so the SDK would not be earning its place.

   The charged amount lives in ONE place, ./price, and the server reads it from
   there. It is never taken from the request body, so a crafted request cannot
   open checkout at a lower price and still be let through to /book. */

/* Re-exported so the order route keeps its single import line, and so there is
   still exactly one name for the amount no matter which module you reach for. */
export { amountPaise, amountRupeesLabel, weddingAmountPaise } from "./price";

export const RAZORPAY_ORDERS_URL = "https://api.razorpay.com/v1/orders";

export function basicAuthHeader(): string | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
}
