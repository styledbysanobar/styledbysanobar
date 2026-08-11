import type { Metadata } from "next";

import GoldRailDefs from "../GoldRailDefs";
import { amountRupeesLabel } from "../lib/razorpay";
import CheckoutForm from "./CheckoutForm";

export const metadata: Metadata = {
  title: "Confirm your Celebrity Image Audit · Sanobar Samir",
  description:
    "Confirm your private 30-minute Celebrity Image Audit with celebrity stylist Sanobar Samir, then pick your slot.",
};

/* The fee page sits between the landing page and /book. The funnel already did
   the selling, so this step only has to feel worth paying for and safe to pay.
   Premium here is voice and restraint, not scale: an itemised ledger, one lit
   figure, and the payment marks on cream tiles. The page opens straight on the
   progress rail, no wordmark bar and no trust strip above it. */

/* Read at request time so a price change in env needs no rebuild. */
export const dynamic = "force-dynamic";

/* The ledger. These are the four beats of the hero sub in COPY.md, itemised:
   "she studies your personal image, identifies exactly what is holding it back,
   shows you how to fix it, and tells you honestly if you are a right fit for her
   Instant Image Upgrade." Same words as the page that sold it, so nothing here
   is new information and nothing reads as a different offer. Short lines only:
   the selling is done, this page confirms and takes the payment. */
const INCLUDED: { n: string; t: string; d: string }[] = [
  {
    n: "01",
    t: "30 min audit with a Bollywood Celebrity Stylist",
    d: "One to one with Sanobar herself. No assistant, no junior stylist.",
  },
  {
    n: "02",
    t: "What is holding your image back",
    d: "The one or two quiet things working against how you look.",
  },
  {
    n: "03",
    t: "How to fix it",
    d: "The direction that closes the gap between your success and your image.",
  },
  {
    n: "04",
    t: "If you are right for the Instant Image Upgrade",
    d: "Your complete image transformation, done with her.",
  },
];

export default function CheckoutPage() {
  const rupees = `₹${amountRupeesLabel()}`;

  return (
    <main className="co-page">
      <GoldRailDefs />

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
          Call booked
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
            <p className="co-panel-label">What you are confirming</p>

            {/* the consultation is the Celebrity Image Audit. The Instant Image
                Upgrade is the paid programme it can lead to: two names, two
                things, kept distinct (COPY.md). */}
            <h2 className="co-item">Celebrity Image Audit</h2>

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
                {/* an "i", not a tick: this is the reschedule policy, a piece of
                    information, not another promise being made */}
                <span className="co-assure-ic" aria-hidden="true" />
                Free reschedule up to 24 hours before your slot
              </li>
            </ul>
          </section>

          {/* the payment */}
          <section className="co-panel co-panel--pay" aria-label="Your details">
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
