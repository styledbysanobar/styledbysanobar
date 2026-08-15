import type { Metadata } from "next";

import GoldRailDefs from "../GoldRailDefs";
import { amountRupeesLabel } from "../lib/razorpay";
import CheckoutForm from "./CheckoutForm";
import Included from "./Included";

export const metadata: Metadata = {
  title: "Confirm your Celebrity Image Audit · Sanobar Samir",
  description:
    "Confirm your private 30-minute Celebrity Image Audit with celebrity stylist Sanobar Samir, then pick your slot.",
};

/* The fee page sits between the landing page and /book. The funnel already did
   the selling, so this step only has to feel worth paying for and safe to pay.
   Premium here is voice and restraint, not scale: one lit figure, one face, and
   the payment marks on cream tiles.

   The stack is conversion ordered and identical on phone and desktop, because a
   single column is what a fee page wants: who she is, why now, what it is and
   what it costs, the detail on demand, the fields, one voice, the button.
   Desktop earns width and air, not a second column that splits the eye. */

/* Capacity. She takes 8 audits a week and this is what is left of THIS week.
   Both numbers drive the meter and the headline, so there is one place to
   change. SEATS_LEFT is the loudest claim on the page: it has to be true on the
   day it is read. */
const SEATS_PER_WEEK = 8;
const SEATS_LEFT = 3;


/* One short testimonial, shown directly above the button.
   [PENDING SANOBAR] There is no consented TEXT quote anywhere in the project:
   section 05 of COPY.md is video clips only, and still carries its own pending
   flag. Nothing is invented here. Fill both fields and the block appears. */
const TESTIMONIAL: { quote: string; name: string } | undefined = undefined;

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
        {/* Two columns on desktop, one stack on a phone. LEFT holds everything
            that argues (who she is, what is left, what it includes), RIGHT holds
            only the form, so on a wide screen there is nothing to scroll past
            before the fields. */}
        <div className="co-cols">
          <div className="co-col co-col--a">
            {/* 1 · THE CREDIBILITY CARD. Four lines, no more. The eyebrow does
                the connecting, which is why there is no separate connector
                headline: page length is itself a conversion risk here. */}
            <header className="co-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="co-stylist-photo"
                src="/images/about_portrait.webp"
                alt="Sanobar Samir"
                width={168}
                height={168}
              />
              <div className="co-card-idbody">
                {/* The eyebrow runs straight into the name, so the two read as
                    one sentence: "Your call is with / Sanobar Samir". That is
                    the whole connecting job, done without announcing itself. */}
                <span className="sec-eyebrow co-stylist-eyebrow">Your call is with</span>
                <h1 className="co-stylist-name">Sanobar Samir</h1>
                <p className="co-card-role">Bollywood Celebrity Stylist · 10+ years</p>

                {/* The one credential line. It opens on the verb, because the
                    job she did is the claim, not the guest list.

                    Three DIFFERENT kinds of work (films, a music video, brand
                    campaigns) under one verb, which is what carries the
                    diversity. Every name is attached to the thing it was
                    actually in: an earlier version swept all three into
                    "campaigns" and put Shah Rukh Khan and Martin Garrix in the
                    wrong bucket.

                    "Co-styled" is the assisting-safe verb and it deliberately
                    UNDERSTATES the brand campaigns, which are her own work. Do
                    not upgrade it: one verb keeps this to a single line.

                    Emphasis sits on exactly five strings. Bold anything else and
                    the highlight stops working. */}
                <p className="co-card-cred">
                  Co-styled in <strong className="co-nm">Gangubai Kathiawadi</strong>,{" "}
                  <strong className="co-nm">Mimi</strong>, a{" "}
                  <strong className="co-nm">Martin Garrix</strong> music video and 100+ campaigns
                  for <strong className="co-nm">American Tourister</strong>,{" "}
                  <strong className="co-nm">Parachute</strong> and many more.
                </p>
              </div>
            </header>

            {/* 2 · URGENCY, one line. The fixed capacity on the left, the live
                count on the right behind a recording dot, so the second half
                reads as a status rather than as a claim. */}
            <p className="co-live" aria-label="Availability">
              <span className="co-live-cap">Only {SEATS_PER_WEEK} seats per week</span>
              <span className="co-live-bar" aria-hidden="true" />
              <span className="co-live-now">
                <span className="co-live-dot" aria-hidden="true" />
                {SEATS_LEFT} seats left
              </span>
            </p>

            {/* 4 · DETAIL. Collapsed disclosure on a phone, always open in the
                desktop left column where there is room for it. */}
            <Included items={INCLUDED} />
          </div>

          {/* RIGHT COLUMN on desktop: the form on its own, nothing above it to
              scroll past. On a phone this simply follows the left stack. */}
          <div className="co-col co-col--b">
            {/* 5 · FIELDS  6 · ONE VOICE  7 · BUTTON, all owned by the form so
                the sticky twin can share its validation. */}
            <section className="co-pay" aria-label="Your details">
              <p className="co-panel-label">Your details</p>
              <p className="co-panel-sub">
                This is where your confirmation and the call link are sent.
              </p>

              <CheckoutForm amountLabel={rupees} testimonial={TESTIMONIAL} />
            </section>
          </div>
        </div>

        {/* No closing strip: the three pointers under the CTA now carry the
            reassurance, and repeating Razorpay here only lengthened the page. */}
        <p className="co-back">
          <a href="/">Back to the page</a>
        </p>
      </div>
    </main>
  );
}
