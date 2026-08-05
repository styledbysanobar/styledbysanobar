/* Razorpay helpers.

   This funnel talks to Razorpay's REST API directly with fetch rather than
   pulling in the SDK, so the project keeps its two-dependency footprint (next +
   react) and nothing new has to be installed. Order creation is one POST and
   signature checking is one HMAC, so the SDK would not be earning its place.

   The charged amount lives in ONE place, the env var below, and the server reads
   it directly. It is never taken from the request body, so a crafted request
   cannot open checkout at a lower price and still be let through to /book. */

export const RAZORPAY_ORDERS_URL = "https://api.razorpay.com/v1/orders";

/** The consultation fee in paise. Single source of truth for the whole funnel:
 *  the checkout page displays it and the order route charges it. */
export function amountPaise(): number {
  const raw = process.env.NEXT_PUBLIC_CHECKOUT_AMOUNT_PAISE;
  const n = Number(raw);
  /* A missing or malformed value must not silently become a different price, so
     fall back to the intended 9700 (Rs 97) and make it visible in the log. */
  if (!Number.isFinite(n) || n <= 0) {
    if (raw !== undefined) {
      console.warn(`[razorpay] NEXT_PUBLIC_CHECKOUT_AMOUNT_PAISE invalid (${raw}), using 9700`);
    }
    return 9700;
  }
  return Math.round(n);
}

/** Rupee figure for display, e.g. 9700 -> "97". Whole rupees when it divides
 *  cleanly, two decimals when it does not, so 9750 reads "97.50" not "97.5". */
export function amountRupeesLabel(paise = amountPaise()): string {
  const rupees = paise / 100;
  return Number.isInteger(rupees) ? String(rupees) : rupees.toFixed(2);
}

export function basicAuthHeader(): string | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
}
