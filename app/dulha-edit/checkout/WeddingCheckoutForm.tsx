"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

import { trackCustom, WEDDING_OFFER } from "../../lib/fbq";

/* Same flow as app/checkout/CheckoutForm.tsx, on the Dulha Edit's custom events:

     WeddingAddToCart         page load
     WeddingInitiateCheckout  the Razorpay sheet is opening (form valid, order made)

   WeddingPurchase is sent only by the Razorpay webhook, so UPI payers who never
   return to the tab are still counted. */

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const CHECKOUT_JS = "https://checkout.razorpay.com/v1/checkout.js";
const BOOK_PATH = "/dulha-edit/book";

const ASSURANCES: { label: string; icon: ReactNode }[] = [
  {
    label: "Secure checkout",
    icon: (
      <>
        <rect x="4" y="10.5" width="16" height="9.5" rx="1.6" />
        <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
      </>
    ),
  },
  {
    label: "Razorpay verified",
    icon: (
      <>
        <rect x="2.5" y="5" width="19" height="14" rx="2" />
        <path d="M2.5 9.8h19" />
        <path d="M6.5 14.6h3.5" />
      </>
    ),
  },
  {
    label: "256 bit SSL secured",
    icon: (
      <>
        <path d="M12 2.8l7.5 3v5.6c0 4.3-3.1 7.8-7.5 9.8-4.4-2-7.5-5.5-7.5-9.8V5.8z" />
        <path d="M8.9 12.1l2.1 2.1 4.1-4.2" />
      </>
    ),
  },
];

/* India first, then where most NRI grooms book from. */
const COUNTRY_CODES: [string, string, string][] = [
  ["IN", "🇮🇳", "91"],
  ["AE", "🇦🇪", "971"],
  ["US", "🇺🇸", "1"],
  ["GB", "🇬🇧", "44"],
  ["CA", "🇨🇦", "1"],
  ["AU", "🇦🇺", "61"],
  ["SG", "🇸🇬", "65"],
  ["SA", "🇸🇦", "966"],
  ["QA", "🇶🇦", "974"],
  ["KW", "🇰🇼", "965"],
  ["OM", "🇴🇲", "968"],
  ["BH", "🇧🇭", "973"],
  ["NZ", "🇳🇿", "64"],
  ["MY", "🇲🇾", "60"],
  ["HK", "🇭🇰", "852"],
  ["DE", "🇩🇪", "49"],
  ["FR", "🇫🇷", "33"],
  ["NL", "🇳🇱", "31"],
  ["IE", "🇮🇪", "353"],
  ["CH", "🇨🇭", "41"],
  ["IT", "🇮🇹", "39"],
  ["ZA", "🇿🇦", "27"],
  ["KE", "🇰🇪", "254"],
  ["MU", "🇲🇺", "230"],
  ["NP", "🇳🇵", "977"],
  ["BD", "🇧🇩", "880"],
  ["LK", "🇱🇰", "94"],
  ["JP", "🇯🇵", "81"],
];

type Fields = { name: string; email: string; country: string; phone: string };

const Arrow = () => (
  <svg viewBox="0 0 28 12" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 6h25M21 1.5 26 6l-5 4.5" />
  </svg>
);

export default function WeddingCheckoutForm({ amountLabel }: { amountLabel: string }) {
  const [f, setF] = useState<Fields>({ name: "", email: "", country: "IN", phone: "" });
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState("");
  const [sdkReady, setSdkReady] = useState(false);

  /* The sticky twin shows only once the real button has scrolled out of view. */
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const el = btnRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (window.Razorpay) {
      setSdkReady(true);
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CHECKOUT_JS}"]`);
    if (existing) {
      existing.addEventListener("load", () => setSdkReady(true));
      return;
    }
    const s = document.createElement("script");
    s.src = CHECKOUT_JS;
    s.async = true;
    s.onload = () => setSdkReady(true);
    s.onerror = () => setFailed("Payment could not load. Check your connection and try again.");
    document.body.appendChild(s);
  }, []);

  /* Guarded because StrictMode runs mount effects twice in dev. */
  const cartFired = useRef(false);
  useEffect(() => {
    if (cartFired.current) return;
    cartFired.current = true;
    trackCustom("WeddingAddToCart", { ...WEDDING_OFFER });
  }, []);

  const checkoutFired = useRef(false);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim());
  const dial = COUNTRY_CODES.find(([iso]) => iso === f.country)?.[2] ?? "91";
  /* A leading 0 is the domestic trunk prefix, never part of the international number. */
  const national = f.phone.replace(/\D/g, "").replace(/^0+/, "");
  const phoneOk = dial === "91" ? national.length === 10 : national.length >= 6 && national.length <= 14;
  const nameOk = f.name.trim().length > 1;
  const valid = nameOk && emailOk && phoneOk;

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setFailed("");
    if (!valid || busy) return;
    if (!sdkReady) {
      setFailed("Payment is still loading. Give it a second and try again.");
      return;
    }
    setBusy(true);

    const q = new URLSearchParams(window.location.search);
    const phone = `${dial}${national}`;

    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          funnel: "wedding",
          name: f.name.trim(),
          email: f.email.trim(),
          phone,
          fbclid: q.get("fbclid") ?? "",
          utm: {
            source: q.get("utm_source") ?? "",
            medium: q.get("utm_medium") ?? "",
            campaign: q.get("utm_campaign") ?? "",
            content: q.get("utm_content") ?? "",
            term: q.get("utm_term") ?? "",
          },
        }),
      });
      const order = await res.json();
      if (!res.ok || !order?.orderId) {
        setBusy(false);
        setFailed("Could not start the payment. Please try again.");
        return;
      }

      const qs = q.toString();
      const bookHref = qs ? `${BOOK_PATH}?${qs}` : BOOK_PATH;

      const rzp = new window.Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: "Sanobar Samir",
        description: "Wedding Look Audit",
        prefill: { name: f.name.trim(), email: f.email.trim(), contact: phone },
        theme: { color: "#4E1015" },
        modal: {
          ondismiss: () => setBusy(false),
        },
        handler: async (r: any) => {
          try {
            const v = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                orderId: r.razorpay_order_id,
                paymentId: r.razorpay_payment_id,
                signature: r.razorpay_signature,
              }),
            });
            const out = await v.json();
            if (out?.ok) {
              window.location.href = bookHref;
            } else {
              setBusy(false);
              setFailed("We could not confirm that payment. Please contact us before paying again.");
            }
          } catch {
            setBusy(false);
            setFailed("We could not confirm that payment. Please contact us before paying again.");
          }
        },
      });

      rzp.on("payment.failed", () => {
        setBusy(false);
        setFailed("That payment did not go through. Please try again.");
      });

      if (!checkoutFired.current) {
        checkoutFired.current = true;
        trackCustom("WeddingInitiateCheckout", { ...WEDDING_OFFER });
      }

      rzp.open();
    } catch {
      setBusy(false);
      setFailed("Could not start the payment. Please try again.");
    }
  };

  const bad = (ok: boolean) => touched && !ok;
  const label = busy ? "Opening payment" : `Pay ${amountLabel} & Book My Slot`;

  return (
    <form className="wc-form" onSubmit={pay} noValidate>
      <div className="wc-field">
        <label className="wc-label" htmlFor="wc-name">
          Your name
        </label>
        <input
          id="wc-name"
          className={`wc-input${bad(nameOk) ? " is-bad" : ""}`}
          type="text"
          autoComplete="name"
          placeholder="Full name"
          value={f.name}
          onChange={set("name")}
        />
      </div>

      <div className="wc-field">
        <label className="wc-label" htmlFor="wc-email">
          Email
        </label>
        <input
          id="wc-email"
          className={`wc-input${bad(emailOk) ? " is-bad" : ""}`}
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          value={f.email}
          onChange={set("email")}
        />
      </div>

      <div className="wc-field">
        <label className="wc-label" htmlFor="wc-phone">
          WhatsApp number
        </label>
        <div className={`wc-phone${bad(phoneOk) ? " is-bad" : ""}`}>
          <span className="wc-cc">
            <span className="wc-cc-face" aria-hidden="true">
              {COUNTRY_CODES.find(([iso]) => iso === f.country)?.[1]} +{dial}
            </span>
            <select
              className="wc-cc-select"
              aria-label="Country code"
              autoComplete="tel-country-code"
              value={f.country}
              onChange={(e) => setF((s) => ({ ...s, country: e.target.value }))}
            >
              {COUNTRY_CODES.map(([iso, flag, code]) => (
                <option key={iso} value={iso}>
                  {flag} {iso} +{code}
                </option>
              ))}
            </select>
          </span>
          <input
            id="wc-phone"
            className="wc-input"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder={dial === "91" ? "98XXX XXXXX" : "Phone number"}
            value={f.phone}
            onChange={set("phone")}
          />
        </div>
      </div>

      {touched && !valid ? (
        <p className="wc-error">Please add your name, a working email and a valid WhatsApp number.</p>
      ) : null}
      {failed ? <p className="wc-error">{failed}</p> : null}

      <p className="wc-reschedule">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3.2" y="5" width="17.6" height="16" rx="2" />
          <path d="M3.2 9.6h17.6M8 3.2v3.6M16 3.2v3.6" />
          <path d="M12 12.6v3l2 1.2" />
        </svg>
        Reschedule up to 24 hours before your slot.
      </p>

      <button className="wc-btn" type="submit" disabled={busy} ref={btnRef}>
        {label}
        {busy ? null : <Arrow />}
      </button>

      <div className={`wc-sticky${stuck ? " is-on" : ""}`} aria-hidden={!stuck}>
        <button className="wc-btn" type="submit" disabled={busy} tabIndex={stuck ? 0 : -1}>
          {label}
          {busy ? null : <Arrow />}
        </button>
      </div>

      <ul className="wc-assurance">
        {ASSURANCES.map((a) => (
          <li key={a.label}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {a.icon}
            </svg>
            {a.label}
          </li>
        ))}
      </ul>
    </form>
  );
}
