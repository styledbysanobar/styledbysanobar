import type { Metadata } from "next";

import { WEDDING_PRICE_LABEL } from "../../lib/price";
import { display } from "../font";
import Progress from "../Progress";
import WeddingCheckoutForm from "./WeddingCheckoutForm";
import "../wedding.css";
import "../flow.css";

export const metadata: Metadata = {
  title: "Confirm your Wedding Look Audit · Sanobar Samir",
  description:
    "Confirm your private 30-minute Wedding Look Audit with celebrity stylist Sanobar Samir, then pick your slot.",
};

/* Same order as /checkout: who she is, the capacity, what the call covers, then
   the form. The lines in INCLUDED are the call steps from the landing page. */
const INCLUDED = [
  "Every function, from haldi to reception",
  "What to do, and by when",
  "What can be made in time, and what to buy readymade",
  "Her first ideas for your looks",
  "An honest answer on whether the Dulha Edit is right for you",
];

export default function WeddingCheckoutPage() {
  return (
    <main className={`wl wc-page ${display.variable}`}>
      <Progress step={1} />

      <div className="wc-wrap">
        <div className="wc-cols">
          <div className="wc-col">
            <header className="wc-card wc-id">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="wc-id-photo" src="/images/about_portrait.webp" alt="Sanobar Samir" width={168} height={168} />
              <div>
                <p className="wc-eyebrow">Your call is with</p>
                <h1 className="wc-id-name">Sanobar Samir</h1>
                <p className="wc-id-role">Bollywood Celebrity Stylist · 10+ years</p>
              </div>
              <p className="wc-id-cred">
                Co-styled in <strong>Gangubai Kathiawadi</strong>, <strong>Mimi</strong>, a{" "}
                <strong>Martin Garrix</strong> music video and 100+ campaigns for{" "}
                <strong>American Tourister</strong>, <strong>Parachute</strong> and many more.
              </p>
            </header>

            <p className="wc-live" aria-label="Availability">
              <span className="wc-live-dot" aria-hidden="true" />
              Sanobar takes only 3 grooms a month
            </p>

            <section className="wc-card wc-inc" aria-label="What your call covers">
              <p className="wc-eyebrow">Your 30-minute Wedding Look Audit</p>
              <ol className="wc-inc-list">
                {INCLUDED.map((t, i) => (
                  <li key={t}>
                    <span className="wc-inc-n">{String(i + 1).padStart(2, "0")}</span>
                    <span className="wc-inc-t">{t}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <div className="wc-col">
            <section className="wc-card wc-pay" aria-label="Your details">
              <div className="wc-pay-head">
                <p className="wc-pay-title">Your details</p>
                <p className="wc-pay-price">
                  {WEDDING_PRICE_LABEL}
                  <span>30-minute call</span>
                </p>
              </div>
              <p className="wc-pay-sub">
                Your confirmation and the call link are sent here. Booking for him? You can book it on his behalf.
              </p>
              <WeddingCheckoutForm amountLabel={WEDDING_PRICE_LABEL} />
            </section>
          </div>
        </div>

        <p className="wc-back">
          <a href="/dulha-edit">Back to the Dulha Edit</a>
        </p>
      </div>
    </main>
  );
}
