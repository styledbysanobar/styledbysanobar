import type { Metadata } from "next";
import CalEmbed from "./CalEmbed";

export const metadata: Metadata = {
  title: "Pick your time · Celebrity Image Audit with Sanobar Samir",
  description:
    "Two steps to lock your Celebrity Image Audit with celebrity stylist Sanobar Samir: pick your slot, then send her a DM on Instagram.",
};

/* [CONFIRM] Sanobar's handle. A wrong one breaks step 2 silently. */
const IG_HANDLE = "styledbysanobar";
const IG_URL = `https://instagram.com/${IG_HANDLE}`;

/* The page after payment does ONE job: get both steps done. The funnel already
   sold the consultation, so the covers ledger, the FAQ and the scarcity block
   that used to live here are gone. Anything that is not step 1 or step 2 is
   something to read instead of something to do. */

export default function BookPage() {
  return (
    <main className="bk-page">
      <nav className="bk-progress" aria-label="Booking progress">
        <span className="bk-step done">
          <span className="bk-step-n">1</span>
          Seat confirmed
        </span>
        <span className="bk-rail" aria-hidden="true" />
        <span className="bk-step active">
          <span className="bk-step-n">2</span>
          Pick your time
        </span>
        <span className="bk-rail" aria-hidden="true" />
        <span className="bk-step">
          <span className="bk-step-n">3</span>
          Call booked
        </span>
      </nav>

      <div className="bk-wrap">
        <div className="bk-head">
          <span className="sec-eyebrow bk-eyebrow">Your seat is confirmed</span>
          <h1 className="bk-h1">
            Two steps and you are <em>in</em>
          </h1>
        </div>

        {/* 1 — book the slot */}
        <section className="bk-card bk-stepcard" id="cal">
          <header className="bk-stepcard-head">
            <span className="bk-stepnum" aria-hidden="true">1</span>
            <span className="bk-stepcard-titles">
              <span className="sec-eyebrow">Required · Pick your slot</span>
              <h2 className="bk-card-title">Book your Celebrity Image Audit</h2>
            </span>
          </header>
          <CalEmbed />
        </section>

        {/* 2 — the DM that holds the slot */}
        <section className="bk-card bk-stepcard">
          <header className="bk-stepcard-head">
            <span className="bk-stepnum" aria-hidden="true">2</span>
            <span className="bk-stepcard-titles">
              <span className="sec-eyebrow">Required · Instagram</span>
              <h2 className="bk-card-title">Follow Sanobar and send one DM</h2>
            </span>
          </header>
          <div className="bk-ig">
            <figure className="bk-ig-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/ig_photo.jpg" alt="Sanobar Samir" />
              <figcaption className="bk-ig-handle">@{IG_HANDLE}</figcaption>
            </figure>
            <div className="bk-ig-copy">
              <p className="bk-step-p">
                Follow <b>@{IG_HANDLE}</b> and send her the message{" "}
                <b className="bk-dm">&ldquo;I have booked&rdquo;</b>. This confirms your
                commitment, only those who DM keep their call.
              </p>
              <a className="bk-anchor" href={IG_URL} target="_blank" rel="noopener noreferrer">
                Follow and send the DM
                <span className="arrow" aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </section>

        {/* the one warning that makes step 2 happen */}
        <section className="bk-card bk-crit">
          <div className="bk-crit-head">
            <span className="bk-crit-ic" aria-hidden="true" />
            <span className="sec-eyebrow bk-crit-label">Critical · read this</span>
          </div>
          <ul className="bk-crit-list">
            <li>
              <b>No slot booked, no call.</b> Unbooked slots are released to the
              next person on the list within 24 hours.
            </li>
            <li>
              <b>No Instagram DM, your slot is dropped.</b> Sanobar only works
              with people who are serious. The DM proves you are committed.
            </li>
          </ul>
        </section>
      </div>

      <footer className="bk-foot">
        <span>The Instant Image Upgrade, by Sanobar Samir.</span>
      </footer>
    </main>
  );
}
