import type { Metadata } from "next";

import { display } from "../font";
import Progress from "../Progress";
import WeddingCalEmbed from "./WeddingCalEmbed";
import "../wedding.css";
import "../flow.css";

export const metadata: Metadata = {
  title: "Pick your time · Wedding Look Audit with Sanobar Samir",
  description:
    "Two steps to lock your Wedding Look Audit with celebrity stylist Sanobar Samir: pick your slot, then send her a DM on Instagram.",
};

/* [CONFIRM] Same handle as /book. */
const IG_HANDLE = "styledbysanobar";
const IG_URL = `https://instagram.com/${IG_HANDLE}`;

/* Mirrors /book: one job, get both steps done. */
export default function WeddingBookPage() {
  return (
    <main className={`wl wc-page ${display.variable}`}>
      <Progress step={2} />

      <div className="wb-wrap">
        <div className="wb-head">
          <p className="wc-eyebrow">Your slot is confirmed</p>
          <h1 className="wb-h1">
            Two steps and you are <em>in.</em>
          </h1>
        </div>

        <section className="wc-card wb-step" id="cal">
          <header className="wb-step-head">
            <span className="wb-step-n" aria-hidden="true">1</span>
            <span>
              <span className="wc-eyebrow">Required · Pick your slot</span>
              <h2 className="wb-step-title">Book your Wedding Look Audit</h2>
            </span>
          </header>
          <WeddingCalEmbed />
        </section>

        <section className="wc-card wb-step">
          <header className="wb-step-head">
            <span className="wb-step-n" aria-hidden="true">2</span>
            <span>
              <span className="wc-eyebrow">Required · Instagram</span>
              <h2 className="wb-step-title">Follow Sanobar and send one DM</h2>
            </span>
          </header>
          <div className="wb-ig">
            <figure className="wb-ig-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/ig_photo.jpg" alt="Sanobar Samir" />
              <figcaption>@{IG_HANDLE}</figcaption>
            </figure>
            <div className="wb-ig-copy">
              <p>
                Follow <b>@{IG_HANDLE}</b> and send her the message <b className="wb-dm">&ldquo;I have booked&rdquo;</b>.
                This confirms your commitment, only those who DM keep their call.
              </p>
              <a className="wc-btn wb-ig-btn" href={IG_URL} target="_blank" rel="noopener noreferrer">
                Follow and send the DM
                <svg viewBox="0 0 28 12" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M1 6h25M21 1.5 26 6l-5 4.5" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <section className="wc-card wb-crit">
          <p className="wc-eyebrow wb-crit-label">Critical · read this</p>
          <ul className="wb-crit-list">
            <li>
              <b>No slot booked, no call.</b> Unbooked slots are released to the next person on the list within 24 hours.
            </li>
            <li>
              <b>No Instagram DM, your slot is dropped.</b> Sanobar only works with people who are serious. The DM proves
              you are committed.
            </li>
          </ul>
        </section>
      </div>

      <footer className="wb-foot">The Dulha Edit, by Sanobar Samir.</footer>
    </main>
  );
}
