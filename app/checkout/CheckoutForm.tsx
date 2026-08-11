"use client";

import { useEffect, useState } from "react";

import { track, OFFER } from "../lib/fbq";

/* The consultation fee step.

   Collects the three details Meta matches on, opens Razorpay, verifies the
   signature server side, then sends the payer to /book to pick a slot.

   Purchase is NOT fired from here. The Razorpay webhook owns that event, so a
   UPI payer who finishes inside their bank app and never comes back is still
   counted. See app/api/webhooks/razorpay/route.ts. */

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const CHECKOUT_JS = "https://checkout.razorpay.com/v1/checkout.js";

/* The methods Razorpay actually presents for this account, shown as the real
   brand marks rather than a sentence of names. Net banking has no single mark,
   so it gets a line icon and a label instead. */
const MARKS: { src: string; alt: string }[] = [
  { src: "/assets/payments/visa.svg", alt: "Visa" },
  { src: "/assets/payments/rupay.svg", alt: "RuPay" },
  { src: "/assets/payments/upi.svg", alt: "UPI" },
  { src: "/assets/payments/amex.svg", alt: "American Express" },
];

type Fields = { name: string; email: string; phone: string };

export default function CheckoutForm({ amountLabel }: { amountLabel: string }) {
  const [f, setF] = useState<Fields>({ name: "", email: "", phone: "" });
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState("");
  const [sdkReady, setSdkReady] = useState(false);

  /* Load Razorpay's checkout script once. Kept here rather than in the layout so
     it only loads on the page that needs it. */
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

  /* Mid funnel signal: reaching the fee page is a real intent step, and it is the
     browser event that pairs with the server side Purchase. */
  useEffect(() => {
    track("InitiateCheckout", { ...OFFER });
  }, []);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim());
  const phoneOk = f.phone.replace(/\D/g, "").length >= 10;
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
    const digits = f.phone.replace(/\D/g, "");
    const phone = digits.length > 10 ? digits : `91${digits}`;

    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
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

      /* Carry the campaign query string into /book so attribution survives the
         rest of the funnel. */
      const qs = q.toString();
      const bookHref = qs ? `/book?${qs}` : "/book";

      const rzp = new window.Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: "Sanobar Samir",
        description: "Celebrity Image Audit",
        prefill: { name: f.name.trim(), email: f.email.trim(), contact: phone },
        theme: { color: "#260000" },
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

      rzp.open();
    } catch {
      setBusy(false);
      setFailed("Could not start the payment. Please try again.");
    }
  };

  const bad = (ok: boolean) => touched && !ok;

  return (
    <form className="co-form" onSubmit={pay} noValidate>
      <div className="co-field">
        <label className="co-label" htmlFor="co-name">
          Your name
        </label>
        <input
          id="co-name"
          className={`co-input${bad(nameOk) ? " is-bad" : ""}`}
          type="text"
          autoComplete="name"
          placeholder="Full name"
          value={f.name}
          onChange={set("name")}
        />
      </div>

      <div className="co-field">
        <label className="co-label" htmlFor="co-email">
          Email
        </label>
        <input
          id="co-email"
          className={`co-input${bad(emailOk) ? " is-bad" : ""}`}
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={f.email}
          onChange={set("email")}
        />
      </div>

      <div className="co-field">
        <label className="co-label" htmlFor="co-phone">
          WhatsApp number
        </label>
        <input
          id="co-phone"
          className={`co-input${bad(phoneOk) ? " is-bad" : ""}`}
          type="tel"
          autoComplete="tel"
          placeholder="+91 98XXX XXXXX"
          value={f.phone}
          onChange={set("phone")}
        />
      </div>

      {touched && !valid ? (
        <p className="co-error">Please add your name, a working email and a 10 digit number.</p>
      ) : null}
      {failed ? <p className="co-error">{failed}</p> : null}

      <button className="co-btn" type="submit" disabled={busy}>
        {busy ? "Opening payment" : `Pay ${amountLabel} and pick your slot`}
        {busy ? null : (
          <span className="arrow" aria-hidden="true">
            &rarr;
          </span>
        )}
      </button>

      {/* Payment marks ride on cream tiles so the coloured brand logos stay
          legible against the dark stage. The brand frames them, it never
          recolours them. */}
      <div className="co-methods">
        <span className="co-methods-label">Pay securely with</span>
        <ul className="co-marks">
          {MARKS.map((m) => (
            <li className="co-mark" key={m.alt}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.src} alt={m.alt} height={16} />
            </li>
          ))}
          <li className="co-mark co-mark--text">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9.5L12 4l9 5.5" />
              <path d="M5 9.5v9M19 9.5v9M9 9.5v9M15 9.5v9" />
              <path d="M3 20.5h18" />
            </svg>
            Net banking
          </li>
        </ul>
      </div>

      <p className="co-secure">
        <span className="co-lock" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="11" width="16" height="9" rx="1" />
            <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
          </svg>
        </span>
        Secured by Razorpay. Your details stay between you and Sanobar.
      </p>
    </form>
  );
}
