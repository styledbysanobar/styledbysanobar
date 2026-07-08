import type { Metadata } from "next";
import CalEmbed from "./CalEmbed";

export const metadata: Metadata = {
  title: "Pick your time · Instant Image Upgrade with Sanobar Samir",
  description:
    "Your application is in. Choose a 30-minute one-to-one with celebrity stylist Sanobar Samir, and walk away knowing exactly what to change about your image.",
};

/* what the 30 minutes covers (kept short — the funnel already sells it). */
const COVERS: { n: string; t: string; d: string }[] = [
  { n: "01", t: "She reads where you are today", d: "Your work, the rooms you walk into, and how you want to be seen." },
  { n: "02", t: "She reads your proportions and colouring", d: "Your body shape and the shades that genuinely suit you, the way she reads it for the camera." },
  { n: "03", t: "She names what is holding your image back", d: "The one or two quiet things working against how you look, that no one ever pointed out." },
];

const FAQ: { q: string; a: string; open?: boolean }[] = [
  {
    q: "Is the call really with Sanobar herself?",
    open: true,
    a: "Yes. Every consultation is one to one with Sanobar. No assistant, no junior stylist. She reads your image personally, because that is the whole point.",
  },
  {
    q: "What if I need to move it?",
    a: "Free reschedule up to 24 hours before your slot, from the link in your confirmation email. Come when you can be fully present.",
  },
];

export default function BookPage() {
  return (
    <main className="bk-page">
      {/* status strip */}
      <header className="bk-strip">
        <span className="bk-strip-item ok">By private application</span>
        <span className="bk-strip-sep" aria-hidden="true">·</span>
        <span className="bk-strip-item">One to one with Sanobar</span>
        <span className="bk-strip-sep" aria-hidden="true">·</span>
        <span className="bk-strip-item">30 minutes</span>
      </header>

      {/* progress: pick a time -> confirmed */}
      <nav className="bk-progress" aria-label="Booking progress">
        <span className="bk-step active">
          <span className="bk-step-n">1</span>
          Pick your time
        </span>
        <span className="bk-rail" aria-hidden="true" />
        <span className="bk-step">
          <span className="bk-step-n">2</span>
          Confirmed
        </span>
      </nav>

      <div className="bk-wrap">
        {/* hero */}
        <div className="bk-head">
          <span className="sec-eyebrow bk-eyebrow">One step left</span>
          <h1 className="bk-h1">Pick your time. Then it begins.</h1>
          <p className="bk-sub">
            This is the one to one where Sanobar reads your image and shows you exactly what to change. Choose a slot below and it is yours.
          </p>
        </div>

        {/* calendar — rendered open, not wrapped in a card */}
        <section className="bk-cal-section">
          <header className="bk-card-head">
            <span className="sec-eyebrow">Choose a time</span>
            <h2 className="bk-card-title">A slot that suits you</h2>
            <p className="bk-card-sub">All times shown in your local zone.</p>
          </header>

          <CalEmbed />

          <ul className="bk-trust">
            <li><span className="bk-trust-ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>One to one, directly with Sanobar. Not a team member.</li>
            <li><span className="bk-trust-ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>Your meeting link lands in your inbox the moment you book.</li>
            <li><span className="bk-trust-ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>Free to reschedule, up to 24 hours before.</li>
          </ul>
        </section>

        {/* what the 30 minutes covers */}
        <section className="bk-card">
          <header className="bk-card-head">
            <span className="sec-eyebrow">What the 30 minutes covers</span>
            <h2 className="bk-card-title">A private read of your image</h2>
          </header>
          <ol className="bk-covers">
            {COVERS.map((c) => (
              <li className="bk-cover" key={c.n}>
                <span className="bk-cover-n" aria-hidden="true">{c.n}</span>
                <div className="bk-cover-body">
                  <h3 className="bk-cover-t">{c.t}</h3>
                  <p className="bk-cover-d">{c.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* don't drift — scarcity */}
        <section className="bk-card bk-noshow">
          <h2 className="bk-noshow-h">Sanobar takes only <em>8 consultations</em> a week.</h2>
          <p className="bk-noshow-p">
            The slot you pick is held for you. Leave it, and it goes to the next person on the list, and the next opening may be weeks away.
          </p>
          <p className="bk-noshow-p bk-noshow-strong">
            You are one step from the read that changes how every room sees you. Lock your time.
          </p>
          <a href="#cal" className="bk-anchor">
            Pick my time
            <span className="arrow" aria-hidden="true">&rarr;</span>
          </a>
        </section>

        {/* two quick questions */}
        <section className="bk-card">
          <header className="bk-card-head">
            <span className="sec-eyebrow">Before you book</span>
            <h2 className="bk-card-title">Two quick questions</h2>
          </header>
          <div className="bk-faq">
            {FAQ.map((f, i) => (
              <details className="bk-faq-item" key={i} open={f.open}>
                <summary className="bk-faq-q">
                  <span>{f.q}</span>
                  <span className="bk-faq-ic" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
                  </span>
                </summary>
                <div className="bk-faq-a"><p>{f.a}</p></div>
              </details>
            ))}
          </div>
        </section>
      </div>

      {/* bottom lock-in */}
      <div className="bk-lockin">
        <p className="bk-lockin-eyebrow">You are one step from the read.</p>
        <p className="bk-lockin-sub">One slot. 30 minutes with Sanobar. Then it begins.</p>
        <a href="#cal" className="bk-anchor">
          Take me to the calendar
          <span className="arrow" aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <footer className="bk-foot">
        <span>The Instant Image Upgrade, by Sanobar Samir.</span>
      </footer>
    </main>
  );
}
