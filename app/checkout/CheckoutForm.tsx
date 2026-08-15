"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

import { track, OFFER } from "../lib/fbq";

/* The consultation fee step.

   Collects the three details Meta matches on, opens Razorpay, verifies the
   signature server side, then sends the payer to /book to pick a slot.

   Event ladder on this page, deliberately two rungs:

     AddToCart        page load. They arrived at the fee page, nothing more.
     InitiateCheckout the Razorpay sheet is actually opening, which means the
                      form validated and the order exists.

   These were previously the same event: InitiateCheckout fired on mount, so
   every arrival counted as a started checkout. Meta optimised toward the
   cheapest people who would let a page load, which is exactly what it delivered.

   Purchase is NOT fired from here. The Razorpay webhook owns that event, so a
   UPI payer who finishes inside their bank app and never comes back is still
   counted. See app/api/webhooks/razorpay/route.ts. */

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const CHECKOUT_JS = "https://checkout.razorpay.com/v1/checkout.js";

/* The three pointers under the CTA. One padlock, one card, one shield, drawn on
   the same 24 grid at the same stroke so the row reads as one system. */
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

type Fields = { name: string; email: string; phone: string };

export default function CheckoutForm({
  amountLabel,
  testimonial,
}: {
  amountLabel: string;
  /* One short quote, rendered between the fields and the button. Omitted
     entirely when empty, so the page never ships a hollow proof slot. */
  testimonial?: { quote: string; name: string };
}) {
  const [f, setF] = useState<Fields>({ name: "", email: "", phone: "" });
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState("");
  const [sdkReady, setSdkReady] = useState(false);

  /* The sticky bar is the same submit button, shown only once the real one has
     scrolled out of view. Two visible copies of one CTA reads as a bug, so the
     inline button owns the viewport whenever it is in it. */
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const el = btnRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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

  /* Soft mid funnel signal: they reached the fee page. No checkout has started
     yet, so this is AddToCart. Guarded because React runs mount effects twice
     under StrictMode in dev. */
  const cartFired = useRef(false);
  useEffect(() => {
    if (cartFired.current) return;
    cartFired.current = true;
    track("AddToCart", { ...OFFER });
  }, []);

  /* Fired once per page when the Razorpay sheet opens. Once, not per click, so
     a dismiss-and-retry cannot inflate the number the way the old mount-effect
     version did. */
  const checkoutFired = useRef(false);

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

      /* The real checkout start: form valid, order created, sheet about to open. */
      if (!checkoutFired.current) {
        checkoutFired.current = true;
        track("InitiateCheckout", { ...OFFER });
      }

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

      {/* Last thing read before the button: one voice, not a wall. */}
      {testimonial ? (
        <figure className="co-quote">
          <blockquote className="co-quote-t">{testimonial.quote}</blockquote>
          <figcaption className="co-quote-n">{testimonial.name}</figcaption>
        </figure>
      ) : null}

      {/* The only line between the fields and the button. No refund promise
          here: that one is parked until the policy is confirmed. */}
      <p className="co-reschedule">
        <svg
          className="co-reschedule-ic"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3.2" y="5" width="17.6" height="16" rx="2" />
          <path d="M3.2 9.6h17.6M8 3.2v3.6M16 3.2v3.6" />
          <path d="M12 12.6v3l2 1.2" />
        </svg>
        Reschedule up to 24 hours before your slot.
      </p>

      <button className="co-btn" type="submit" disabled={busy} ref={btnRef}>
        {busy ? "Opening payment" : `Pay ${amountLabel} & Book My Slot`}
        {busy ? null : (
          <span className="arrow" aria-hidden="true">
            &rarr;
          </span>
        )}
      </button>

      {/* Sticky twin. Same form, same submit, so validation and the Razorpay
          open path are shared rather than duplicated. */}
      <div className={`co-sticky${stuck ? " is-on" : ""}`} aria-hidden={!stuck}>
        <button className="co-btn co-btn--sticky" type="submit" disabled={busy} tabIndex={stuck ? 0 : -1}>
          {busy ? "Opening payment" : `Pay ${amountLabel} & Book My Slot`}
          {busy ? null : (
            <span className="arrow" aria-hidden="true">
              &rarr;
            </span>
          )}
        </button>
      </div>

      {/* Three trust pointers under the CTA. Same icon box and same stroke on
          all three so they read as one row, not three decisions. */}
      <ul className="co-assurance">
        {ASSURANCES.map((a) => (
          <li className="co-assurance-i" key={a.label}>
            <svg
              className="co-assurance-ic"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {a.icon}
            </svg>
            {a.label}
          </li>
        ))}
      </ul>
    </form>
  );
}
