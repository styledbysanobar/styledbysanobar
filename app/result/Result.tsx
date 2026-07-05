"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { QuizResult } from "../quiz/quizData";
import { buildView, type ResultView } from "./resultData";

/* THE RESULT PAGE (Model B): diagnosis SHOWN, prescription GATED behind the free
   call. Structure + copy from result-page-copy-v2.md; dynamic slots filled from
   the quiz outputs via buildView(). [PENDING SANOBAR] = real assets still to land:
   testimonial videos, cleared logos, the Calendly link + weekly capacity number. */

const BOOK_HREF = "#book"; // [PENDING SANOBAR] real Calendly link

/* dotted body-shape glyph per shape (interim until the real figure art lands). */
const SHAPE_GLYPH: Record<string, React.ReactNode> = {
  "Triangle": <polygon points="100,120 62,204 138,204" strokeDasharray="2 7" />,
  "Inverted Triangle": <polygon points="62,116 138,116 100,200" strokeDasharray="2 7" />,
  "Hourglass": <polygon points="66,116 134,116 104,160 134,200 66,200 96,160" strokeDasharray="2 7" />,
  "Rectangle": <rect x="70" y="118" width="60" height="86" strokeDasharray="2 7" />,
  "Oval": <ellipse cx="100" cy="160" rx="42" ry="54" strokeDasharray="2 7" />,
};

/* the three feature line-icons: hanger, ruler, star (colour via currentColor). */
const FEATURE_ICONS: React.ReactNode[] = [
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5.4a1.7 1.7 0 1 1 1.7 1.7c-.95 0-1.7.75-1.7 1.7v.3" />
      <path d="M4 16.6 12 11l8 5.6" />
      <path d="M4 16.6h16" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="9.2" width="18" height="5.6" />
      <path d="M7 9.2v2M10.5 9.2v2.8M14 9.2v2M17.5 9.2v2.8" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3.6l2.4 4.9 5.4.7-3.9 3.7.95 5.4L12 15.9 7.2 18.3l.95-5.4L4.2 9.2l5.4-.7z" />
    </svg>
  ),
];

/* [04] credibility stats. 15+ and 100+ confirmed by Atul; clients count still PLACEHOLDER. */
const CRED_STATS: { n: string; l: string }[] = [
  { n: "10+", l: "Years in fashion" },
  { n: "100+", l: "Campaigns, films & shoots" },
  { n: "200+", l: "Styling appointments at Broadway" },
];
/* [04] brand logos she has worked with (real files, standardised names; no Pepsi). */
const CRED_LOGOS: { name: string; src: string; scale?: number }[] = [
  { name: "Kotak Mahindra", src: "/images/logos/kotak.svg" },
  { name: "Oppo", src: "/images/logos/oppo.png" },
  { name: "Tanishq", src: "/images/logos/tanishq.webp" },
  { name: "American Tourister", src: "/images/logos/american-tourister.svg" },
  { name: "Parachute", src: "/images/logos/parachute.jpg" },
  { name: "Santoor", src: "/images/logos/santoor.png", scale: 1.62 },
  { name: "Whisper", src: "/images/logos/whisper.png", scale: 1.3 },
  { name: "Myntra", src: "/images/logos/myntra.png" },
  { name: "Livspace", src: "/images/logos/livspace.png", scale: 1.55 },
  { name: "Future Group", src: "/images/logos/future-group.png" },
  { name: "Roxx", src: "/images/logos/roxx.jpeg" },
  { name: "Truhair", src: "/images/logos/truhair.webp" },
];

/* [05] testimonial section — featured clip + consultation-clip carousel (video assets pending). */
const TESTI_FEATURED = { title: "The colour read", dur: "0:32" };
const TESTI_CLIPS: { title: string; dur: string }[] = [
  { title: "Body shape read", dur: "0:41" },
  { title: "The wardrobe edit", dur: "0:35" },
  { title: "Colour draping", dur: "0:28" },
  { title: "The first look", dur: "0:24" },
  { title: "Personal shopping", dur: "0:38" },
];

/* [06] the gate — have (closed diagnosis) vs get (gated prescription); lead + gold-italic accent + icon per row. */
const GATE_HAVE: { lead: string; accent: string }[] = [
  { lead: "Your", accent: "body shape" },
  { lead: "Your", accent: "perception gap" },
  { lead: "Your", accent: "image diagnosis" },
  { lead: "The", accent: "reason why" },
];
const GATE_GET: { lead: string; accent: string }[] = [
  { lead: "Your own", accent: "styling strategy" },
  { lead: "A personal", accent: "wardrobe plan" },
  { lead: "Exactly", accent: "what suits you" },
  { lead: "A clear", accent: "next step" },
];
const GATE_HAVE_ICONS: React.ReactNode[] = [
  (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3.4a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4Z" /><path d="M9.5 8.4h5l-1.3 4.2 1.6 7.6h-5.6l1.6-7.6z" /></svg>),
  (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="2.8" /></svg>),
  (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="4" width="14" height="17" rx="1.4" /><path d="M9 4V3h6v1" /><path d="M8.5 9h7M8.5 12.5h7M8.5 16h4" /></svg>),
  (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"><path d="M9.2 9a2.8 2.8 0 1 1 3.8 2.6c-.9.4-1.5 1.1-1.5 2.1v.4" /><circle cx="11.5" cy="18" r=".6" fill="currentColor" /></svg>),
];
const GATE_GET_ICONS: React.ReactNode[] = [
  (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></svg>),
  (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 5.4a1.7 1.7 0 1 1 1.7 1.7c-.95 0-1.7.75-1.7 1.7v.3" /><path d="M4 16.6 12 11l8 5.6" /><path d="M4 16.6h16" /></svg>),
  (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3.4a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4Z" /><path d="M9.5 8.4h5l-1.3 4.2 1.6 7.6h-5.6l1.6-7.6z" /></svg>),
  (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M8 12.4l2.6 2.6L16 9.5" /></svg>),
];

/* [07] the Presence Blueprint — process (title + NO-BRAINER micro-desc + icon), deliverables, grid. */
const BLUEPRINT_STEPS: { title: string; desc: string }[] = [
  { title: "Understand where you are today", desc: "Sanobar learns your work, your lifestyle and where you feel stuck." },
  { title: "Read your proportions and your colouring", desc: "She maps your body shape and the shades that genuinely suit you." },
  { title: "Pinpoint what is holding your image back", desc: "The one or two things quietly working against how you look." },
  { title: "Build your personal Presence Blueprint", desc: "A styling plan made only for you, never a template." },
  { title: "Walk away knowing exactly what to wear next", desc: "Clear direction you can use for your very next event." },
];
const BLUEPRINT_STEP_ICONS: React.ReactNode[] = [
  (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></svg>),
  (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="8" rx="1.4" /><path d="M7 8v3M10.5 8v4M14 8v3M17.5 8v4" /></svg>),
  (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="2.8" /></svg>),
  (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 5.4a1.7 1.7 0 1 1 1.7 1.7c-.95 0-1.7.75-1.7 1.7v.3" /><path d="M4 16.6 12 11l8 5.6" /><path d="M4 16.6h16" /></svg>),
  (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="3.5" width="14" height="17" rx="1.4" /><path d="M8.5 8h1M8.5 12h1M8.5 16h1M12 8h3.5M12 12h3.5M12 16h3.5" /></svg>),
];
const BLUEPRINT_LEAVE: { title: string; desc: string }[] = [
  { title: "Signature outfit direction for your body", desc: "The cuts and shapes that consistently work on your build." },
  { title: "A wardrobe plan you can actually use", desc: "What to keep, what to add, and what to let go." },
  { title: "Clarity on what to buy, and what to stop buying", desc: "No more expensive pieces sitting unworn in your cupboard." },
  { title: "A clear next step, instead of guessing before every event", desc: "Dress with confidence, instead of doubting yourself every morning." },
];
const BLUEPRINT_LEAVE_ICONS: React.ReactNode[] = [
  (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3.4a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4Z" /><path d="M9.5 8.4h5l-1.3 4.2 1.6 7.6h-5.6l1.6-7.6z" /></svg>),
  (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></svg>),
  (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h7l9 9-7 7-9-9z" /><circle cx="8.2" cy="8.2" r="1.1" /></svg>),
  (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 6.5c-1.6-1.3-3.6-2-6-2v13c2.4 0 4.4.7 6 2M12 6.5c1.6-1.3 3.6-2 6-2v13c-2.4 0-4.4.7-6 2M12 6.5v13" /></svg>),
];
const BOOK_GRID: { label: string; body: React.ReactNode }[] = [
  { label: "Cost", body: <>Your consultation is <span className="r-pending">[PENDING SANOBAR: complimentary / by private application]</span>. The first conversation is about you, not a sales pitch.</> },
  { label: "Time", body: <>A calm, unhurried consultation, <span className="r-pending">[PENDING SANOBAR: exact length]</span>. Long enough to send you home with real answers.</> },
  { label: "Preparation", body: <>Nothing to prepare. Come exactly as you are; Sanobar reads the rest.</> },
  { label: "Pressure", body: <>Sanobar takes only <span className="r-pending">[PENDING SANOBAR: N]</span> a week, guiding each one herself, the same eye behind the actors and campaigns you admire. No pressure, just an honest answer on whether it is right for you.</> },
];

/* the big names (celebrities, brands, films) — bolded in the primary dark colour wherever they appear. */
const BIG_NAMES = [
  "Martin Garrix", "Shah Rukh Khan", "Deepika Padukone", "Alia Bhatt", "Kriti Sanon",
  "Jim Sarbh", "Pankaj Tripathi", "Ajay Devgn", "Huma Qureshi", "Madhuri Dixit",
  "Virat Kohli", "Anushka Sharma", "Arijit Singh",
  "American Tourister", "Parachute", "Gangubai Kathiawadi", "Mimi",
];
function highlightNames(text: string): React.ReactNode {
  const escaped = [...BIG_NAMES].sort((a, b) => b.length - a.length).map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "g");
  return text.split(re).map((part, i) => (BIG_NAMES.includes(part) ? <strong className="rc-name" key={i}>{part}</strong> : part));
}
/* [04] track-record — NO-BRAINER 4-part arc: Films -> Brands -> Broadway -> Now you. */
const CRED_TRACK: { head: string; body: string }[] = [
  { head: "It all started in films", body: "Co-styled on film sets featuring Deepika Padukone, Alia Bhatt, Kriti Sanon, Jim Sarbh, Pankaj Tripathi, Ajay Devgn, Huma Qureshi & Madhuri Dixit, across blockbusters like Gangubai Kathiawadi and Mimi." },
  { head: "Then came the big brands", body: "Launched 100+ brand campaigns for names like American Tourister and Parachute, and shoots featuring Virat Kohli, Anushka Sharma and Arijit Singh." },
  { head: "A national first", body: "Launched India's first nationwide personal-shopper program, running on her own diagnostic system, fully booked out in 15 days." },
  { head: "And now, you", body: "And now that same system is reading you, through the very quiz you just finished." },
];
const CRED_TRACK_ICONS: React.ReactNode[] = [
  (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7.5" width="18" height="12.5" /><circle cx="12" cy="13.7" r="3.1" /><path d="M8.5 7.5 10 5h4l1.5 2.5" /></svg>),
  (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></svg>),
  (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 20.5h16" /><path d="M5.5 20.5V10.5l6.5-4 6.5 4v10" /><path d="M10 20.5v-5h4v5" /></svg>),
  (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></svg>),
];

/* line-icons for the three diagnosis pointers (one per read dimension). */
const READ_ICONS: Record<string, React.ReactNode> = {
  dress: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4.4a1.7 1.7 0 1 1 1.7 1.7c-.9 0-1.7.7-1.7 1.7v.4" />
      <path d="M3.5 17.5 12 11l8.5 6.5" />
      <path d="M3.5 17.5h17" />
    </svg>
  ),
  pain: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4 3 19.5h18L12 4z" />
      <path d="M12 10v4" />
      <path d="M12 16.6v.4" />
    </svg>
  ),
  world: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 8.5h16v10H4z" />
      <path d="M9 8.5V6.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5v2" />
      <path d="M4 13h16" />
    </svg>
  ),
};

export default function Result() {
  const [r, setR] = useState<QuizResult | null>(null);
  const [v, setV] = useState<ResultView | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("iiu_result");
      if (raw) {
        const parsed = JSON.parse(raw) as QuizResult;
        setR(parsed);
        setV(buildView(parsed));
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  if (ready && (!r || !v)) {
    return (
      <main className="r-empty">
        <span className="sec-eyebrow">Your read</span>
        <h1 className="r-empty-h">We could not find your answers.</h1>
        <p>Take the 2-minute quiz and your read appears here.</p>
        <Link className="cta-btn" href="/quiz">Take the quiz <span className="arrow">&rarr;</span></Link>
      </main>
    );
  }
  if (!v) return <main className="r-empty" aria-busy="true" />;

  // A plain 0..100 bar so a sub-50 score reads as obviously low (a 28 fills only
  // ~a quarter of the track). One shaded RANGE marks where most successful people
  // land (all of it under 50), with a legend swatch instead of confusing ticks.
  const gaugePct = Math.max(0, Math.min(100, v.score));
  const ZONE_LO = 25; // where most successful people cluster, all sub-50
  const ZONE_HI = 50;

  return (
    <main className="result">
      {/* ===== [1] THE SCORE REVEAL — the payoff, the first thing they see =====
         The score IS the centrepiece, now uncluttered (headline + reassurance
         cut). The number is the headline: a giant Space Grotesk numeral on the
         flat oxblood peak, with the band name as its deliberate display caption.
         The gauge is a plain 0-100 bar, so a sub-50 score reads as visibly low.
         The twist is the single
         open-loop beat beneath the peak. Then the page drops to cream. */}
      <section className="r-band r-band--dark r-hero">
        <div className="r-inner r-inner--wide">
          <span className="sec-eyebrow r-hero-eyebrow">Your result · built from your 7 answers</span>

          <div className="r-score">
            <span className="r-score-label">Presence Score</span>
            <div className="r-score-n">
              <b>{v.score}</b>
              <i>/ 100</i>
            </div>
            <span className="r-score-band">{v.band}</span>

            <div className="r-gauge" aria-hidden="true">
              <span className="r-gauge-range" style={{ left: `${ZONE_LO}%`, width: `${ZONE_HI - ZONE_LO}%` }}>
                <span className="r-gauge-range-label">Where most successful people land</span>
              </span>
              <span className="r-gauge-track" />
              <span className="r-gauge-fill" style={{ width: `${gaugePct}%` }} />
              <span className="r-gauge-mark" style={{ left: `${gaugePct}%` }}>
                <span className="r-gauge-you">You</span>
              </span>
            </div>
            <div className="r-gauge-scale" aria-hidden="true">
              <span>0</span>
              <span>100</span>
            </div>

            <p className="r-score-para">{v.bandPara}</p>
          </div>

          <p className="r-twist">
            People who score 90 are not better looking or richer than you. They simply make better styling
            decisions. That is the whole gap. And it is probably much smaller than you think.
          </p>
        </div>
      </section>

      {/* ===== [4] CURRENT -> GOAL IMAGE TYPE ===== */}
      <section className="r-band">
        <div className="r-inner">
          <header className="r-head">
            <span className="r-index" aria-hidden="true">01</span>
            <span className="sec-eyebrow">Your image type</span>
            <h2 className="r-h2">Two versions of you</h2>
            <p className="r-sub">From your answers: the person people see today, and the person your success already makes you.</p>
          </header>
          <div className="r-types">
            <div className="r-type">
              <span className="r-type-eyebrow">How people see you today</span>
              <span className="r-type-name">{v.currentType}</span>
              <p className="r-type-tag">{v.currentBeat1}</p>
              <p className="r-type-body">{v.currentBeat2}</p>
            </div>
            <div className="r-arrow" aria-hidden="true">&rarr;</div>
            <div className="r-type r-type--goal">
              <span className="r-type-eyebrow">How you should be seen</span>
              <span className="r-type-name">{v.goalType}</span>
              <p className="r-type-tag">{v.goalTagline}</p>
              <p className="r-type-body">{v.goalForward}</p>
            </div>
          </div>
          <div className="r-have">
            <p className="r-have-text"><span className="r-have-key">What you already have:</span> {v.goalHave}</p>
          </div>
        </div>
      </section>

      {/* ===== [5] THE PERCEPTION GAP ===== */}
      <section className="r-band">
        <div className="r-inner">
          <header className="r-head">
            <span className="r-index" aria-hidden="true">02</span>
            <span className="sec-eyebrow">Your perception gap</span>
            <h2 className="r-h2">What people decide before you speak</h2>
            <p className="r-sub">People judge your level in the first few seconds, before you say a word. Here is what they decide about you right now.</p>
          </header>
          <div className="r-panels">
            <div className="r-panel">
              <span className="r-panel-eyebrow">What your image signals today</span>
              <span className="r-panel-head">{v.perc.todayHead}</span>
              <p className="r-panel-body">{v.perc.todayBody}</p>
            </div>
            <div className="r-gap" aria-hidden="true"><span className="r-gap-label">the gap</span></div>
            <div className="r-panel r-panel--dark">
              <span className="r-panel-eyebrow">What it should signal</span>
              <span className="r-panel-head">{v.perc.shouldHead}</span>
              <p className="r-panel-body">{v.perc.shouldBody}</p>
            </div>
          </div>
          {v.reads.length > 0 && (
            <div className="r-reads">
              <span className="r-reads-label">What your answers revealed to us</span>
              <div className="r-reads-grid">
                {v.reads.map((r) => (
                  <div className="r-read" key={r.key}>
                    <span className="r-read-icon">{READ_ICONS[r.key]}</span>
                    <span className="r-read-title">{r.title}</span>
                    <p className="r-read-body">{r.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <svg
            className="r-quote"
            viewBox="0 0 847 681"
            fill="currentColor"
            aria-hidden="true"
            style={{
              display: "block",
              overflow: "visible",
              width: "clamp(50px,5.8vw,76px)",
              height: "clamp(40px,4.7vw,61px)",
              color: "#B8893E",
              margin: "clamp(56px,10vh,118px) auto clamp(10px,1.6vh,18px)",
            }}
          >
            <path d="M 694 102 686 102 660 109 615 126 570 151 542 172 515 198 490 229 470 262 453 303 442 347 438 386 440 433 449 475 462 505 471 520 483 535 508 555 540 570 573 577 606 578 634 574 660 566 691 549 712 530 724 514 737 487 744 450 743 418 737 386 729 366 719 350 701 331 690 323 673 314 652 307 635 304 604 304 590 306 564 314 541 327 519 349 517 347 524 308 532 283 546 254 568 223 591 200 628 174 663 157 704 144 712 137 713 127 707 111 701 105 Z M 358 102 350 102 334 106 290 121 250 141 213 166 175 202 158 223 138 254 119 296 110 326 105 352 102 381 103 426 109 463 121 496 139 526 164 550 193 566 219 574 249 578 271 578 293 575 321 567 353 550 379 526 393 505 401 486 407 457 408 433 405 405 400 384 391 363 382 349 367 333 352 322 332 312 311 306 298 304 260 305 233 312 214 321 201 330 183 349 181 348 188 307 200 273 220 238 239 215 266 191 292 174 340 152 368 144 375 138 377 129 373 115 366 106 Z" />
          </svg>
          <p className="r-blame">
            This was never about discipline or taste. Nobody ever sat down, looked at your body, your work and
            how you want to be seen, and showed you the few changes that fix it for someone like you. That one
            missing piece is the only reason your image sits behind the rest of you. It is not a flaw in you.
            It is just something no one ever taught you.
          </p>
          <div className="r-cost">
            <span className="r-cost-lead">What that gap quietly costs you</span>
            <ol className="r-cost-steps">
              <li className="r-cost-step">
                <span className="r-cost-n">01</span>
                <p className="r-cost-line">You keep proving yourself when your appearance should already be doing part of that work.</p>
              </li>
              <li className="r-cost-step">
                <span className="r-cost-n">02</span>
                <p className="r-cost-line">You get remembered for what you said, not who you are.</p>
              </li>
              <li className="r-cost-step">
                <span className="r-cost-n">03</span>
                <p className="r-cost-line">You walk into important rooms already one step behind.</p>
              </li>
            </ol>
            <p className="r-cost-foot">None of it feels big on its own. Over years, it shapes a career.</p>
          </div>
        </div>
      </section>

      {/* ===== [3] PROOF (editorial: portrait + info blocks + quote + note) ===== */}
      <section className="r-band r-proof" data-reveal aria-label="The proof this is possible">
        <div className="r-inner">
          <header className="r-head">
            <span className="r-index" aria-hidden="true">03</span>
            <span className="sec-eyebrow">The proof this is possible</span>
            <h2 className="r-h2">Your build was made to be dressed</h2>
            <p className="r-sub">Your shape is not a problem to fix. It is just a set of proportions, and any proportions can be dressed beautifully.</p>
          </header>
          <div className="rp-grid">
            <figure className="rp-portrait" aria-hidden="true">
              <span className="rp-corner tl" /><span className="rp-corner tr" />
              <span className="rp-corner bl" /><span className="rp-corner br" />
              <span className="rp-art">
                <svg viewBox="0 0 200 300" fill="none" stroke="#B8893E" strokeWidth={1.4} strokeLinejoin="round">
                  {SHAPE_GLYPH[v.bodyShape] ?? SHAPE_GLYPH["Inverted Triangle"]}
                </svg>
              </span>
              <span className="rp-meta">
                <span className="rp-name">{v.actor}</span>
                <span className="rp-type">{v.bodyShape} Body Type</span>
                <span className="rp-pending">Image pending</span>
              </span>
            </figure>

            <div className="rp-info">
              <span className="rp-info-eyebrow">You share the same body type as</span>
              <h3 className="rp-info-name">{v.actor}</h3>
              <span className="rp-info-shape">{v.bodyShape} Shape</span>
              <p className="rp-intro">{v.pairIntro}</p>
              <ol className="rp-features">
                {v.pairFeatures.map((f, i) => (
                  <li className="rp-feature" key={i}>
                    <span className="rp-fic">{FEATURE_ICONS[i]}</span>
                    <div className="rp-ftext">
                      <h4>{f.head}</h4>
                      <p>{f.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <blockquote className="rp-quote">
            <span className="rp-quote-mark" aria-hidden="true">&ldquo;</span>
            <p>{v.pairQuote}</p>
            <span className="rp-quote-line" aria-hidden="true" />
          </blockquote>
        </div>
      </section>

      {/* ===== [4] THE PERSON BEHIND YOUR RESULT (credibility, editorial) ===== */}
      <section className="r-band r-cred" data-reveal aria-label="The person behind your result">
        <div className="r-inner">
          {/* top: portrait + stats  |  headline + lead */}
          <div className="rc-top">
            <figure className="rc-portrait">
              <img className="rc-portrait-img" src="/images/IMG_2730.PNG" alt="Sanobar Samir" />
              <span className="rc-portrait-scrim" aria-hidden="true" />
              <span className="rc-corner tl" aria-hidden="true" /><span className="rc-corner tr" aria-hidden="true" />
              <span className="rc-corner bl" aria-hidden="true" /><span className="rc-corner br" aria-hidden="true" />
              <div className="rc-portrait-head">
                <span className="rc-index" aria-hidden="true">04</span>
                <span className="rc-eyebrow">The person behind your result</span>
              </div>
              <div className="rc-stats">
                {CRED_STATS.map((s) => (
                  <div className="rc-stat" key={s.l}>
                    <span className="rc-stat-n">{s.n}</span>
                    <span className="rc-stat-l">{s.l}</span>
                  </div>
                ))}
              </div>
              <figcaption className="rc-portrait-cap">Sanobar Samir<i>Celebrity stylist</i></figcaption>
            </figure>
            <div className="rc-right">
              <h2 className="rc-title">From Bhansali&rsquo;s sets to India&rsquo;s leading actors. Now that eye is on <em>your image</em>.</h2>
              <span className="rc-rule" aria-hidden="true" />
              <p className="rc-lead">The read you just received came from Sanobar Samir, one of the eyes behind how India&rsquo;s biggest names appear on screen. Across 10+ years she has personally styled leading actors and worked on films and campaigns that featured {highlightNames("Martin Garrix, Shah Rukh Khan, Deepika Padukone, Alia Bhatt, Kriti Sanon, Jim Sarbh, Pankaj Tripathi, Ajay Devgn, Huma Qureshi & Madhuri Dixit")}. That same eye is now on you, and on your image.</p>
            </div>
          </div>

          {/* track record */}
          <div className="rc-track">
            <span className="rc-track-label">A track record that speaks for itself</span>
            <ol className="rc-steps">
              {CRED_TRACK.map((t, i) => (
                <li className="rc-step" key={i}>
                  <span className="rc-step-ic" aria-hidden="true">{CRED_TRACK_ICONS[i]}</span>
                  <div className="rc-step-body">
                    <span className="rc-step-n">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="rc-step-h">{t.head}</h3>
                    <p className="rc-step-p">{highlightNames(t.body)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* campaigns — constantly running slider */}
          <div className="rc-logos-wrap">
            <span className="r-authority-eyebrow">Brands she has worked with</span>
            <div className="rc-marquee">
              <div className="rc-marquee-track">
                {Array.from({ length: 6 }).flatMap((_, g) =>
                  CRED_LOGOS.map((l, i) => (
                    <span className="r-logo" key={`${g}-${i}`} aria-hidden={g >= 3}>
                      <img className="r-logo-img" src={l.src} alt={l.name} style={{ "--logo-scale": l.scale ?? 1 } as React.CSSProperties} />
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ===== [05] CLIENT RESULTS — featured clip + consultation-clip carousel ===== */}
      <section className="r-band r-testi" data-reveal aria-label="People who stood where you stand">
        <div className="r-inner">

          <header className="rt-head">
            <span className="r-index" aria-hidden="true">05</span>
            <span className="sec-eyebrow">People who stood where you stand</span>
            <h2 className="r-h2">Accomplished, and finally <em>seen</em></h2>
            <p className="rt-sub">Every person here was already successful. The only thing missing was an image that matched. Watch how a room read them before, and how it reads them now.</p>
          </header>

          <figure className="rt-featured">
            <span className="rt-featured-media" aria-hidden="true" />
            <button type="button" className="rt-play rt-play--lg" aria-label={`Play ${TESTI_FEATURED.title}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6L19 12z" /></svg>
            </button>
            <figcaption className="rt-featured-cap">
              <span className="rt-featured-eyebrow">Featured<span className="rt-cap-rule" aria-hidden="true" /></span>
              <span className="rt-featured-title">{TESTI_FEATURED.title}</span>
              <span className="rt-featured-dur">{TESTI_FEATURED.dur}</span>
            </figcaption>
          </figure>

          <div className="rt-band-label"><span>Inside a Presence consultation</span></div>

          <ul className="rt-carousel">
            {TESTI_CLIPS.map((c, i) => (
              <li className="rt-card" key={i}>
                <figure className="rt-card-media" aria-hidden="true">
                  <button type="button" className="rt-play" aria-label={`Play ${c.title}`}>
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6L19 12z" /></svg>
                  </button>
                </figure>
                <div className="rt-card-meta">
                  <h3 className="rt-card-title">{c.title}</h3>
                  <span className="rt-card-dur">{c.dur}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="rt-dots" aria-hidden="true">
            {Array.from({ length: TESTI_CLIPS.length + 1 }).map((_, i) => (
              <span className={"rt-dot" + (i === 0 ? " is-on" : "")} key={i} />
            ))}
          </div>

          <p className="rt-closing">Real moments from real consultations. No scripts, no actors, just people <em>seeing themselves differently</em>.</p>
        </div>

        <div className="rt-final">
          <div className="r-inner rt-final-inner">
            <span className="rt-final-ic" aria-hidden="true">
              <svg viewBox="0 0 32 44" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4c1.7 0 2.7 1.4 2.7 3.1 0 1-.6 1.9-.6 2.8 0 1.6 2.4 3 3.4 6.3.6 2 .8 4-5.5 4s-6.1-2-5.5-4c1-3.3 3.4-4.7 3.4-6.3 0-.9-.6-1.8-.6-2.8C13.3 5.4 14.3 4 16 4Z" />
                <path d="M16 20.2V34" /><path d="M10 34h12" /><path d="M16 34l-5 6h10z" />
              </svg>
            </span>
            <span className="rt-final-rule" aria-hidden="true" />
            <p className="rt-final-text">The same system behind celebrities and national campaigns is now on <em>your life</em>.</p>
          </div>
        </div>
      </section>

      {/* ===== [6C] EMOTIONAL PEAK — "you already built the success" =====
         The exhale, not the push: deepest --stage surface, left-set, one hairline,
         a larger/lighter non-uppercase headline. Deliberately distinct from the
         finale CTA (centered, brighter, button) so the page has one pause + one peak. */}
      <section className="r-band r-band--dark r-peak">
        <div className="r-inner">
          <span className="sec-eyebrow r-hero-eyebrow">The part you already finished</span>
          <span className="r-peak-rule" aria-hidden="true" />
          <h2 className="r-peak-h">You already built the <em>success</em>.</h2>
          <p className="r-peak-sub">
            Your image just hasn&rsquo;t caught up, and at the wedding or the boardroom, that is what people
            notice first.
          </p>
        </div>
      </section>

      {/* ===== [06] THE GATE — have (closed diagnosis) vs get (gated prescription) ===== */}
      <section className="r-band r-gate" data-reveal aria-label="Why this is where the quiz stops">
        <div className="r-inner">
          <header className="r-head">
            <span className="r-index" aria-hidden="true">06</span>
            <span className="sec-eyebrow">Why this is where the quiz stops</span>
            <h2 className="r-h2">Knowing the gap <em>won&rsquo;t close it</em></h2>
            <p className="r-sub">This page can show you what is happening. Fixing it has to be built around you, your body, your life, your rooms.</p>
          </header>

          <div className="rg-compare">
            <div className="rg-col">
              <span className="rg-col-eyebrow">This page gave you</span>
              <ul className="rg-list">
                {GATE_HAVE.map((r, i) => (
                  <li key={i}>
                    <span className="rg-ic" aria-hidden="true">{GATE_HAVE_ICONS[i]}</span>
                    <span className="rg-row-t">{r.lead} <em>{r.accent}</em></span>
                  </li>
                ))}
              </ul>
            </div>
            <span className="rg-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
            </span>
            <div className="rg-col rg-col--dark">
              <span className="rg-col-eyebrow">Your consultation gives you</span>
              <ul className="rg-list">
                {GATE_GET.map((r, i) => (
                  <li key={i}>
                    <span className="rg-ic" aria-hidden="true">{GATE_GET_ICONS[i]}</span>
                    <span className="rg-row-t">{r.lead} <em>{r.accent}</em></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="rg-coda">The diagnosis is complete. The blueprint is <em>personal</em>.</p>
          <span className="rg-coda-mark" aria-hidden="true" />
        </div>
      </section>

      {/* ===== [07] WHAT HAPPENS NEXT — portrait header + journey + deliverables + before-you-book ===== */}
      <section className="r-band r-blueprint" data-reveal aria-label="What happens next">
        <div className="r-inner r-inner--wide">

          {/* header: text left, portrait right */}
          <div className="bp-top">
            <div className="bp-head">
              <span className="r-index" aria-hidden="true">07</span>
              <span className="sec-eyebrow">What happens next</span>
              <span className="bp-head-rule" aria-hidden="true" />
              <h2 className="r-h2">Your <em>Presence Blueprint</em></h2>
              <p className="r-sub">A one-to-one consultation with Sanobar, built around your body, your wardrobe, and how you want to be seen at every occasion that matters.</p>
            </div>
            <figure className="bp-portrait">
              <img className="bp-portrait-img" src="/images/IMG_2726.PNG" alt="Sanobar Samir" />
            </figure>
          </div>

          {/* (a) the journey — 01 to 05, icon + title + micro-desc */}
          <div className="bp-band-label"><span>Here is exactly what happens</span></div>
          <div className="bp-steps-box">
            <ol className="bp-steps">
              {BLUEPRINT_STEPS.map((s, i) => (
                <li className="bp-step" key={i}>
                  <span className="bp-step-ic" aria-hidden="true">{BLUEPRINT_STEP_ICONS[i]}</span>
                  <div className="bp-step-body">
                    <span className="bp-step-n">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="bp-step-t">{s.title}</h3>
                    <p className="bp-step-d">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* (b) the outcomes — deliverable set */}
          <div className="bp-band-label"><span>You&rsquo;ll leave with</span></div>
          <ul className="bp-leave">
            {BLUEPRINT_LEAVE.map((d, i) => (
              <li className="bp-leave-item" key={i}>
                <span className="bp-leave-ic" aria-hidden="true">{BLUEPRINT_LEAVE_ICONS[i]}</span>
                <h4 className="bp-leave-t">{d.title}</h4>
                <p className="bp-leave-d">{d.desc}</p>
              </li>
            ))}
          </ul>

          {/* (c) the four costs — before you book */}
          <div className="bp-band-label"><span>Before you book</span></div>
          <div className="bp-grid">
            {BOOK_GRID.map((c, i) => (
              <div className="bp-cell" key={i}>
                <span className="bp-cell-label">{c.label}</span>
                <p className="bp-cell-body">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== [9] CTA + REASSURANCE (the premium peak) ===== */}
      <section className="r-band r-band--dark r-finale">
        <div className="r-inner">
          <span className="sec-eyebrow r-hero-eyebrow">The gap closes here</span>
          <h2 className="r-finale-h">At the next wedding, the next meeting, be the one they <em>remember</em>.</h2>
          <p className="r-finale-sub">
            One consultation, and how people see you finally matches what you have built.
          </p>
          <a className="cta-btn" href={BOOK_HREF}><span className="r-pending">[PENDING SANOBAR: Book / Apply for]</span> your consultation <span className="arrow">&rarr;</span></a>
          <span className="r-finale-micro"><span className="r-pending">[PENDING SANOBAR: complimentary / by application]</span> · only <span className="r-pending">[PENDING SANOBAR: N]</span> consultations each week</span>
          <div className="r-colophon">Your image should be as thought through as everything else you have built.<br />The Presence Blueprint, by Sanobar Samir.</div>
        </div>
      </section>
    </main>
  );
}
