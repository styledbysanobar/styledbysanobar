/* The consultation fee.

   ONE definition for the whole funnel: the landing page copy, the checkout
   label, and the amount Razorpay is actually told to charge all resolve from
   here. Nothing anywhere else may write the number down.

   That rule exists because the two halves used to disagree. The fee lived in
   the env var and reached the checkout and the order route, but the landing
   page had "Rs 97" typed into it in six places, so changing the env var moved
   the charge and left the copy advertising the old price. A page that promises
   one number and charges another is the single worst drift a funnel can have,
   and it is invisible until a buyer sees the Razorpay sheet.

   This module deliberately holds NO secrets, so it is safe to import from a
   page. The Razorpay keys stay in ./razorpay. */

/* The fallback. A missing or malformed env var must not silently become a
   DIFFERENT price, so it lands on the intended one and says so in the log.
   Keep this in step with NEXT_PUBLIC_CHECKOUT_AMOUNT_PAISE — it is the only
   other place the number is written, and it is the value production falls back
   to if the variable is ever dropped from Vercel. */
export const FALLBACK_PAISE = 19700; // Rs 197

/** The consultation fee in paise. */
export function amountPaise(): number {
  const raw = process.env.NEXT_PUBLIC_CHECKOUT_AMOUNT_PAISE;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) {
    if (raw !== undefined) {
      console.warn(
        `[price] NEXT_PUBLIC_CHECKOUT_AMOUNT_PAISE invalid (${raw}), using ${FALLBACK_PAISE}`,
      );
    }
    return FALLBACK_PAISE;
  }
  return Math.round(n);
}

/** Rupee figure for display, e.g. 19700 -> "197". Whole rupees when it divides
 *  cleanly, two decimals when it does not, so 19750 reads "197.50" not "197.5". */
export function amountRupeesLabel(paise = amountPaise()): string {
  const rupees = paise / 100;
  return Number.isInteger(rupees) ? String(rupees) : rupees.toFixed(2);
}

/** The fee as the copy writes it. Every "Rs 197" on the page is this constant.
 *
 *  A plain const, not a hook or a fetch: NEXT_PUBLIC_ values are inlined at
 *  BUILD time, so this is a literal in the output and costs nothing at runtime.
 *  The flip side is that changing the variable on Vercel needs a redeploy to
 *  take effect — editing it in the dashboard alone will not move the page. */
export const PRICE_LABEL = `₹${amountRupeesLabel()}`;

/* The Dulha Edit's Wedding Look Audit fee. Its own variable, so moving the
   Instant Image fee never moves this one. */
export const WEDDING_FALLBACK_PAISE = 19700; // Rs 197

export function weddingAmountPaise(): number {
  const n = Number(process.env.NEXT_PUBLIC_WEDDING_AMOUNT_PAISE);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : WEDDING_FALLBACK_PAISE;
}

export const WEDDING_PRICE_LABEL = `₹${amountRupeesLabel(weddingAmountPaise())}`;
