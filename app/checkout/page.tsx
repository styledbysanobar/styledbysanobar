import type { Metadata } from "next";

import { amountRupeesLabel } from "../lib/razorpay";
import CheckoutForm from "./CheckoutForm";

export const metadata: Metadata = {
  title: "Confirm your consultation · Instant Image Upgrade with Sanobar Samir",
  description:
    "Confirm your one to one Instant Image Upgrade consultation with celebrity stylist Sanobar Samir, then pick your slot.",
};

/* The fee page sits between the landing page and /book. The funnel already did
   the selling, so this step only has to feel worth paying for and safe to pay.
   Premium here is voice and restraint, not scale: an itemised ledger, one lit
   figure, and the payment marks on cream tiles. The page opens straight on the
   progress rail, no wordmark bar and no trust strip above it. */

/* Read at request time so a price change in env needs no rebuild. */
export const dynamic = "force-dynamic";

const INCLUDED: { n: string; t: string; d: string }[] = [
  {
    n: "01",
    t: "30 minutes, 1:1 with Bollywood Celebrity Stylist",
    d: "With Sanobar herself. No assistant, no junior stylist.",
  },
  {
    n: "02",
    t: "She Reads You Properly",
    d: "Your proportions, your colouring, and the rooms you actually walk into.",
  },
  {
    n: "03",
    t: "You Leave Knowing What to Change",
    d: "The one or two quiet things working against your image today.",
  },
];

export default function CheckoutPage() {
  const rupees = `₹${amountRupeesLabel()}`;

  return (
    <main className="co-page">
      <nav className="bk-progress" aria-label="Booking progress">
        <span className="bk-step active">
          <span className="bk-step-n">1</span>
          Confirm your seat
        </span>
        <span className="bk-rail" aria-hidden="true" />
        <span className="bk-step">
          <span className="bk-step-n">2</span>
          Pick your time
        </span>
        <span className="bk-rail" aria-hidden="true" />
        <span className="bk-step">
          <span className="bk-step-n">3</span>
          Confirmed
        </span>
      </nav>

      <div className="co-wrap">
        <div className="co-head">
          <span className="sec-eyebrow co-eyebrow">One step left</span>
          <h1 className="co-h1">
            Confirm your <em>consultation</em>
          </h1>
          <p className="co-sub">
            Sanobar takes only 8 consultations a week. The {rupees} holds your seat, so it goes to someone
            who will actually turn up.
          </p>
        </div>

        <div className="co-grid">
          {/* what is being paid for */}
          <section className="co-panel" aria-label="Order summary">
            <span className="co-corner tl" aria-hidden="true" />
            <span className="co-corner tr" aria-hidden="true" />
            <span className="co-corner bl" aria-hidden="true" />
            <span className="co-corner br" aria-hidden="true" />

            <p className="co-panel-label">What you are confirming</p>

            <h2 className="co-item">Instant Image Upgrade consultation</h2>

            <ol className="co-included">
              {INCLUDED.map((i) => (
                <li className="co-included-row" key={i.n}>
                  <span className="co-included-n">{i.n}</span>
                  <span className="co-included-body">
                    <span className="co-included-t">{i.t}</span>
                    <span className="co-included-d">{i.d}</span>
                  </span>
                </li>
              ))}
            </ol>

            <div className="co-total">
              <span className="co-total-l">Payable now</span>
              <span className="co-total-v">{rupees}</span>
            </div>

            <ul className="co-assure">
              <li>
                <span className="co-assure-tick" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 10.5l4 4 8-9" />
                  </svg>
                </span>
                A private read of your image, not a sales call
              </li>
              <li>
                <span className="co-assure-tick" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 10.5l4 4 8-9" />
                  </svg>
                </span>
                Free reschedule up to 24 hours before your slot
              </li>
            </ul>
          </section>

          {/* the payment */}
          <section className="co-panel co-panel--pay" aria-label="Your details">
            <span className="co-corner tl" aria-hidden="true" />
            <span className="co-corner tr" aria-hidden="true" />
            <span className="co-corner bl" aria-hidden="true" />
            <span className="co-corner br" aria-hidden="true" />

            <p className="co-panel-label">Your details</p>
            <p className="co-panel-sub">This is where your confirmation and the call link are sent.</p>

            <CheckoutForm amountLabel={rupees} />
          </section>
        </div>

        <p className="co-back">
          <a href="/">Back to the page</a>
        </p>
      </div>
    </main>
  );
}
