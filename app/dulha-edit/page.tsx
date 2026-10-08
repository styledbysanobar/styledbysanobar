import type { Metadata } from "next";

import { WEDDING_PRICE_LABEL as PRICE_LABEL } from "../lib/price";
import { display } from "./font";
import WeddingSticky from "./WeddingSticky";
import "./wedding.css";

export const metadata: Metadata = {
  title: "The Dulha Edit · Wedding styling for grooms by Sanobar Samir",
  description:
    "Your wedding is weeks away. In a private 30-minute Wedding Look Audit, celebrity stylist Sanobar Samir maps your timeline and tells you honestly what's still possible.",
};

/* The wedding funnel's own fee step. Never /checkout: that page fires the
   Instant Image Upgrade's standard events. */
const BOOK_HREF = "/dulha-edit/checkout";

const Icon = ({ children, fill = false }: { children: React.ReactNode; fill?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={fill ? "currentColor" : "none"}
    stroke={fill ? "none" : "currentColor"}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

/* Six-petal flower, used in dividers and the about eyebrow. */
const Flower = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1} aria-hidden="true">
    {Array.from({ length: 6 }).map((_, i) => (
      <ellipse key={i} cx="10" cy="5.2" rx="2.4" ry="4.2" transform={`rotate(${i * 60} 10 10)`} />
    ))}
    <circle cx="10" cy="10" r="1.6" fill="currentColor" />
  </svg>
);

/* line, diamond (or flower), line */
const Divider = ({ className = "", flower = false }: { className?: string; flower?: boolean }) => (
  <span className={`wl-divider ${className}`} aria-hidden="true">
    <span className="wl-divider-line" />
    {flower ? (
      <Flower className="wl-divider-flower" />
    ) : (
      <svg viewBox="0 0 20 10" fill="none" stroke="currentColor" strokeWidth={1}>
        <path d="M10 1.5 14 5l-4 3.5L6 5z" />
        <circle cx="2.5" cy="5" r=".9" fill="currentColor" />
        <circle cx="17.5" cy="5" r=".9" fill="currentColor" />
      </svg>
    )}
    <span className="wl-divider-line" />
  </span>
);

const AUDIT: { icon: React.ReactNode; text: string }[] = [
  {
    icon: (
      <Icon>
        <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
        <path d="M3.5 9.5h17M8 3v4M16 3v4" />
        <path d="M7.5 13h2M11 13h2M14.5 13h2M7.5 16.5h2M11 16.5h2" />
      </Icon>
    ),
    text: "Your wedding timeline mapped backwards",
  },
  {
    icon: (
      <Icon>
        <path d="M12 7.6a1.7 1.7 0 1 1 1.4 2.7c-.8.1-1.4.7-1.4 1.4" />
        <path d="M12 11.7 3.5 17.8h17z" />
      </Icon>
    ),
    text: "Which of your looks can still go custom, and what should be ready-to-wear",
  },
  {
    icon: (
      <Icon fill>
        <path d="m12 3.6 2.5 5.3 5.8.7-4.3 4 1.1 5.7L12 16.5l-5.1 2.8L8 13.6l-4.3-4 5.8-.7z" />
      </Icon>
    ),
    text: "A celebrity stylist's first direction for your looks, from haldi to reception",
  },
  {
    icon: (
      <Icon fill>
        <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-1.2 12.6-3.5-3.5 1.4-1.4 2.1 2.1 4.8-4.8 1.4 1.4z" />
      </Icon>
    ),
    text: "A straight answer on whether the Dulha Edit is right for your wedding",
  },
];

const TRUST: { icon: React.ReactNode; lines: [string, string] }[] = [
  {
    icon: (
      <Icon>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </Icon>
    ),
    lines: ["One-on-one", "with a Celebrity Stylist"],
  },
  {
    icon: (
      <Icon>
        <path d="M6.5 4h11L21 9l-9 11L3 9z" />
        <path d="M3 9h18M9.5 4 8 9l4 11M14.5 4 16 9l-4 11" />
      </Icon>
    ),
    lines: ["10+ Years Styling", "India's Biggest Names"],
  },
  {
    icon: (
      <Icon>
        <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
        <path d="M3.5 9.5h17M8 3v4M16 3v4" />
        <path d="M7.5 13h2M11 13h2M14.5 13h2M7.5 16.5h2M11 16.5h2" />
      </Icon>
    ),
    lines: ["On set for only", "3 grooms a month"],
  },
];

/* About section: content carried over word for word from the Instant Image
   Upgrade page (app/page.tsx, section [2]). */
const BIG_NAMES = [
  "Rajkummar Rao", "Parineeti Chopra", "Priyamani", "Sharvari Wagh", "Jyothi Yarraji",
  "Martin Garrix", "Shah Rukh Khan", "Deepika Padukone", "Alia Bhatt", "Kriti Sanon",
  "Jim Sarbh", "Pankaj Tripathi", "Ajay Devgn", "Huma Qureshi", "Madhuri Dixit",
  "Virat Kohli", "Anushka Sharma", "Arijit Singh",
  "Parachute", "Kotak Mahindra", "Oppo", "American Tourister", "Santoor",
  "Gangubai Kathiawadi", "Mimi",
];
function highlightNames(text: string): React.ReactNode {
  const escaped = [...BIG_NAMES].sort((a, b) => b.length - a.length).map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "g");
  return text.split(re).map((part, i) => (BIG_NAMES.includes(part) ? <strong key={i}>{part}</strong> : part));
}

const TRACK: { icon: React.ReactNode; head: string; body: string }[] = [
  {
    icon: (
      <Icon>
        <rect x="3.5" y="9.5" width="17" height="10.5" rx="1" />
        <path d="M3.5 9.5 19.2 5.2l-.9-3-15.6 4.3z" />
        <path d="m7.2 5.8 2.2 2.8M11.6 4.6l2.2 2.8M16 3.4l2.2 2.8" />
        <path d="M3.5 13h17" />
      </Icon>
    ),
    head: "It all started in films",
    body: "Co-styled on film sets featuring Deepika Padukone, Alia Bhatt, Kriti Sanon, Jim Sarbh, Pankaj Tripathi, Ajay Devgn, Huma Qureshi & Madhuri Dixit, across blockbusters like Gangubai Kathiawadi and Mimi.",
  },
  {
    icon: (
      <Icon>
        <path d="m12 3.6 2.5 5.3 5.8.7-4.3 4 1.1 5.7L12 16.5l-5.1 2.8L8 13.6l-4.3-4 5.8-.7z" />
      </Icon>
    ),
    head: "Then came the big brands",
    body: "Launched 100+ brand campaigns for names like American Tourister and Parachute, and shoots featuring Virat Kohli, Anushka Sharma and Arijit Singh.",
  },
  {
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.1 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.1-3.6-8.5S9.6 5.8 12 3.5z" />
      </Icon>
    ),
    head: "A national first",
    body: "Launched India's first nationwide personal-shopper program, running on her own diagnostic system, fully booked out in 15 days.",
  },
  {
    icon: (
      <Icon>
        <circle cx="12" cy="7" r="3" />
        <path d="M6 20a6 6 0 0 1 12 0" />
      </Icon>
    ),
    head: "And now, you",
    body: "And now that same system reads you, one to one, in a private 30-minute consultation.",
  },
];

/* Corner rosettes for the four track-record cards: public-domain (CC0) paisley
   mandalas from openclipart.org (ids 243541-243544), recoloured to gold. */
const CARD_MOTIFS = ["mandala-ring", "mandala-trefoil", "mandala-lace", "mandala-paisley"];

/* Problem section, card 1: photos cropped from the section's reference image. */
const VENDORS = [
  { label: "Venue", img: "s3-venue" },
  { label: "Caterer", img: "s3-caterer" },
  { label: "Decorator", img: "s3-decorator" },
  { label: "Photographer", img: "s3-photographer" },
  { label: "Baraat", img: "s3-baraat" },
];

/* Section 3, card 3. Garment icons: Hugeicons dress-03 and kurta-01 (MIT). */
const COMPARE = [
  {
    who: "Her",
    items: ["Designer", "Trials", "Fittings", "Makeup", "Months of planning"],
    icon: (
      <svg className="wl-vs-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m15 4l-3 2l-3-2c-.586.51-1.93 1.293-1.997 2.146c-.029.37.126.571.435.975C8.112 8.002 9 8.521 9 10h6c0-1.48.888-1.998 1.562-2.879c.31-.404.464-.606.434-.975C16.93 5.293 15.587 4.509 15 4M9 4V2m6 2V2m-5.5 8h5m3.5 9c2 0 3-2.173 3-2.173c-2.825-1.836-4.5-3.993-5.413-5.622c-.347-.62-.521-.93-.755-1.068C14.598 10 14.285 10 13.659 10H10.34c-.626 0-.939 0-1.173.137s-.408.447-.755 1.068C7.5 12.834 5.825 14.99 3 16.827C3 16.827 4 19 6 19" />
        <path d="M13.706 14c.34.796 1.815 2.671 3.435 4.31c.597.605.896.907.855 1.42c-.04.512-.29.683-.79 1.025C16.07 21.53 14.336 22 12 22s-4.07-.469-5.207-1.245c-.5-.342-.75-.513-.79-1.025c-.04-.513.259-.815.856-1.42c1.62-1.639 3.096-3.514 3.435-4.31" />
      </svg>
    ),
  },
  {
    who: "You",
    items: ["One store", "One afternoon", "Whatever's ready", "Never tested on camera"],
    icon: (
      <svg className="wl-vs-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17.549 15a99 99 0 0 1 .021 4.09c-.016 1.362-.024 2.044-.464 2.477c-.439.433-1.13.433-2.512.433H9.406c-1.382 0-2.073 0-2.512-.433s-.448-1.115-.464-2.478A99 99 0 0 1 6.451 15m11.098 0c-.104-3.21-.393-6.638-1.039-9m1.039 9h1.867c.765 0 1.147 0 1.384-.251c.238-.252.216-.617.172-1.349c-.239-4.027-1.338-7.241-2.245-9.118c-.266-.552-.4-.828-.727-1.104c-.328-.275-.685-.377-1.4-.58L14.506 2C14.004 3 13.002 3.5 12 3.5S9.996 3 9.494 2L7.4 2.597c-.715.204-1.072.306-1.4.581c-.327.276-.46.552-.727 1.104c-.907 1.877-2.006 5.091-2.245 9.119c-.044.73-.066 1.096.172 1.348c.237.251.62.251 1.384.251H6.45m0 0c.104-3.21.393-6.638 1.039-9M17.5 12h3m-17 0h3M12 4v5" />
      </svg>
    ),
  },
];

/* Rangoli badge behind the section 3 card numbers: seven concave edges, like the card corners. */
const Badge = ({ n }: { n: string }) => (
  <span className="wl-badge">
    <svg viewBox="-1 -1 54 54" fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinejoin="round" aria-hidden="true">
      <path transform="translate(0 1.04)" d="M26 5A24 24 0 0 0 42.42 12.91A24 24 0 0 0 46.47 30.67A24 24 0 0 0 35.11 44.92A24 24 0 0 0 16.89 44.92A24 24 0 0 0 5.53 30.67A24 24 0 0 0 9.58 12.91A24 24 0 0 0 26 5Z" />
    </svg>
    <span>{n}</span>
  </span>
);


/* "What happens in the Dulha Edit". Photos: free Unsplash licence. Icons:
   Hugeicons + Phosphor (MIT) in /images/wedding/icons, safa drawn in-house. */
const FUNCTIONS = ["haldi", "mehndi", "sangeet", "cocktail", "shaadi", "reception"];
const TESTS = [
  { img: "ed-move", label: "Move", text: "Dance. Sit. Get on the ghodi." },
  { img: "ed-camera", label: "Camera", text: "Shoot in venue light. Check every angle." },
  { img: "ed-coordinate", label: "Next to her", text: "Stand beside her look. Match the décor and family." },
];
const ON_THE_DAY: [string, string][] = [
  ["get-ready", "Get ready"], ["safa", "Safa"], ["sehra", "Sehra"], ["baraat", "Baraat"],
  ["varmala", "Varmala"], ["pheras", "Pheras"], ["reception", "Reception"],
];
const WIcon = ({ name }: { name: string }) => (
  <span className="wl-mi" style={{ "--ic": `url(/images/wedding/icons/${name}.svg)` } as React.CSSProperties} aria-hidden="true" />
);
const IconRow = ({ items }: { items: [string, string][] }) => (
  <ul className="wl-ed-icons">
    {items.map(([icon, label]) => (
      <li key={label}>
        <WIcon name={icon} />
        <span>{label}</span>
      </li>
    ))}
  </ul>
);
const CardFoot = ({ children }: { children: React.ReactNode }) => (
  <p className="wl-ed-foot">
    <Flower className="wl-ed-foot-flower" />
    {children}
  </p>
);

/* "What happens on the call": the 30-minute Wedding Look Audit agenda. */
const CALL_STEPS = [
  {
    tag: "Your wedding",
    icon: "call-wedding",
    title: "Every function, from haldi to reception",
    desc: "She asks about your dates, venues, family traditions and your bride's outfits.",
  },
  {
    tag: "Timeline",
    icon: "call-timeline",
    title: "What to do, and by when",
    desc: "She tells you what must happen this week, this month and before the day.",
  },
  {
    tag: "What's possible",
    icon: "call-possible",
    title: "What can be made in time, and what to buy readymade",
    desc: "She tells you which looks can still be made for you, and which to buy readymade.",
  },
  {
    tag: "Your plan",
    icon: "call-plan",
    title: "Her first ideas for your looks",
    desc: "You leave with Sanobar's first ideas for your looks, even if you don't go ahead.",
  },
  {
    tag: "Fit check",
    icon: "call-fit",
    title: "An honest answer",
    desc: "This is not a sales pitch. If the Dulha Edit is not right for you, Sanobar will tell you.",
  },
];

const WEDDING_FAQ: { q: string; a: string; open?: boolean }[] = [
  {
    q: "My first function is about 4 weeks away. Is that enough time?",
    a: "Yes, it is tight but workable. With 4 weeks, your looks are built mainly from ready-to-wear and quick-alteration pieces. On the call, Sanobar tells you honestly what can still go custom and what can't.",
    open: true,
  },
  { q: "What does the call cost?", a: "₹197 holds your 30-minute slot, and that is all the call costs." },
  {
    q: "Why isn't the Dulha Edit's price on this page?",
    a: "It depends on your wedding: how many functions, which city, and how many days Sanobar is on set. On the call, she tells you exactly what fits and what it costs.",
  },
  {
    q: "Are outfits and accessories included?",
    a: "No. You buy them directly, at whatever budget you choose. Sanobar's job is to make sure every rupee goes into pieces that fit, suit you and look right in photos.",
  },
  {
    q: "I already have a designer. Can Sanobar still help?",
    a: "Yes. She works alongside your designer, or your bride's, and still plans, tests and styles every look.",
  },
  {
    q: "Can I book this for him?",
    a: "Yes. A fiancée, sister, brother or parent can book the call. You can join it together.",
  },
  { q: "Our wedding is in another city.", a: "Sanobar travels for weddings. Travel and stay are planned on the call." },
  {
    q: "Can my father and brothers be styled too?",
    a: "Yes, as an add-on. They get looks from the same palette, so the family photos match. Sanobar covers it on the call.",
  },
];

export default function WeddingStylingPage() {
  return (
    <main className={`wl ${display.variable}`}>
      <section className="wl-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="wl-florals" src="/images/wedding/hero-florals-left.webp" alt="" aria-hidden="true" />

        {/* Right half on desktop; on mobile the column flattens and this slots in
            after the sub via flex order. */}
        <figure className="wl-scene">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/wedding/hero-scene.webp" alt="Sanobar Samir" width={800} height={805} />
        </figure>

        <div className="wl-col">
          <p className="wl-eyebrow">For grooms whose wedding is just weeks away</p>

          <h1 className="wl-h1">
            4 weeks to the wedding.
            <br />
            Every vendor is booked and paid.
            <br />
            <em>The groom&rsquo;s look hasn&rsquo;t even started.</em>
          </h1>

          <p className="wl-sub">
            Sanobar Samir has spent 10+ years styling leading actors and working on films and campaigns featuring{" "}
            <strong>Shah Rukh Khan, Deepika Padukone, Martin Garrix</strong> and many of India&rsquo;s biggest names.
          </p>
          <p className="wl-sub">
            With the Dulha Edit, she plans and sources every look of your wedding and styles you on the day, from
            haldi to reception. In a private 30-minute <strong>Wedding Look Audit</strong>, she maps your timeline and
            tells you honestly what&rsquo;s still possible.
          </p>

          <div className="wl-card">
            <p className="wl-card-title">Your 30-minute Wedding Look Audit</p>
            <Divider className="wl-card-rule" />
            <ul className="wl-items">
              {AUDIT.map((a) => (
                <li className="wl-item" key={a.text}>
                  <span className="wl-item-ic">{a.icon}</span>
                  <span className="wl-item-txt">{a.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <a className="wl-btn" href={BOOK_HREF}>
            Book your Wedding Look Audit ({PRICE_LABEL})
            <svg viewBox="0 0 28 12" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M1 6h25M21 1.5 26 6l-5 4.5" />
            </svg>
          </a>

          <ul className="wl-trust">
            {TRUST.map((t) => (
              <li className="wl-trust-i" key={t.lines[0]}>
                <span className="wl-trust-ic">{t.icon}</span>
                <span className="wl-trust-txt">
                  {t.lines[0]}
                  <br />
                  {t.lines[1]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <span data-sticky-start aria-hidden="true" />

      <section className="wl-why">
        <p className="wl-why-title">Why {PRICE_LABEL}?</p>
        <Divider className="wl-why-rule" />
        <p className="wl-why-txt">
          {PRICE_LABEL} holds your slot. Wedding dates cluster around the same muhurats,
          <br className="wl-br-desk" /> and Sanobar takes only 3 grooms a month, so your call time is blocked only for
          you.
        </p>
      </section>

      <section className="wl-about" aria-label="Who is doing this">
        <div className="wl-about-top">
          {/* Desktop paints the photo, frame, florals and diyas from about-plate.webp;
              this copy of the photo is for the stacked phone layout. */}
          <figure className="wl-about-portrait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/wedding/about-photo.webp" alt="Sanobar Samir" width={560} height={575} loading="lazy" />
          </figure>

          <div className="wl-about-copy">
            <p className="wl-eyebrow wl-eyebrow--flower">
              <Flower className="wl-eyebrow-flower" />
              The person behind your consultation
            </p>
            <h2 className="wl-h2">
              From Bhansali&rsquo;s sets to India&rsquo;s
              <br className="wl-br-desk" /> leading actors. Now that eye is
              <br className="wl-br-desk" /> on <em>your image.</em>
            </h2>
            <Divider className="wl-about-rule wl-divider--lead" flower />
            <p className="wl-about-lead">
              The eye reading your image belongs to Sanobar Samir, one of the most trusted and sought-after styling
              actors in the Indian film industry. With over 10+ years of experience, she has personally styled leading
              actors and worked on films and campaigns featuring{" "}
              <strong>Shah Rukh Khan, Deepika Padukone, Martin Garrix</strong> and many more of India&rsquo;s biggest
              names.
            </p>
            <p className="wl-about-lead">
              With her deep understanding of style, personality and energy, Sanobar brings a rare blend of fashion
              expertise and intuitive insight to help you see yourself the way the world sees you, and even better.
            </p>
          </div>
        </div>

        <div className="wl-track">
          <p className="wl-track-label">
            <span className="wl-track-arrow" aria-hidden="true" />
            A track record that speaks for itself
            <span className="wl-track-arrow wl-track-arrow--r" aria-hidden="true" />
          </p>
          <ol className="wl-steps">
            {TRACK.map((t, i) => (
              <li className="wl-step" key={t.head}>
                <span className="wl-step-ic">{t.icon}</span>
                <span className="wl-step-n">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="wl-step-h">{t.head}</h3>
                <p className="wl-step-p">{highlightNames(t.body)}</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="wl-step-floral" src={`/images/wedding/${CARD_MOTIFS[i]}.webp`} alt="" aria-hidden="true" loading="lazy" />
              </li>
            ))}
          </ol>
        </div>

        <div className="wl-close">
          <Divider className="wl-close-rule" />
          <p className="wl-close-line">
            If Bollywood&rsquo;s superstars trust her with how they look,
            <br />
            <em>imagine how she&rsquo;ll make you look.</em>
          </p>
          <Divider className="wl-close-rule" flower />
        </div>
      </section>

      <section className="wl-problem wl-s3" aria-label="Why the groom's look comes last">
        {/* phone-only small corner ornaments */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="wl-m-corner wl-m-corner--tl" src="/images/wedding/corner-s3.webp" alt="" aria-hidden="true" loading="lazy" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="wl-m-corner wl-m-corner--br" src="/images/wedding/corner-s3.webp" alt="" aria-hidden="true" loading="lazy" />
        {["tl", "tr", "bl", "br", "jasmine"].map((k) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={k} className={`wl-s4-decor wl-s4-${k}`} src={`/images/wedding/s4-${k}.webp`} alt="" aria-hidden="true" loading="lazy" />
        ))}

        <div className="wl-pb-head">
          <p className="wl-eyebrow wl-eyebrow--flower">
            <Flower className="wl-eyebrow-flower" />
            Why the groom&rsquo;s look comes last
          </p>
          <h2 className="wl-pb-h">
            You&rsquo;ve planned the wedding.
            <br />
            Your own look is still waiting.
            <br />
            <em>And now you&rsquo;re 4 weeks out.</em>
          </h2>
          <Divider className="wl-pb-rule" flower />
        </div>

        <ol className="wl-s3-cards">
          <li className="wl-s3-card">
            <div className="wl-s3-head">
              <Badge n="01" />
              <h3>Everything else came first</h3>
            </div>
            <p className="wl-s3-sub">The venue. The caterer. The decor. The guest list. It all got the attention.</p>
            <ul className="wl-s3-vendors">
              {VENDORS.map((v) => (
                <li key={v.label}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/images/wedding/${v.img}.webp`} alt="" width={107} height={74} loading="lazy" />
                  <span>{v.label}</span>
                </li>
              ))}
              <li className="wl-s3-note">
                <Flower className="wl-s3-note-flower" />
                <span>Every decision was yours.</span>
              </li>
            </ul>
          </li>

          <li className="wl-s3-card">
            <div className="wl-s3-head">
              <Badge n="02" />
              <h3>So your look kept moving</h3>
            </div>
            <p className="wl-s3-sub">Not because it didn&rsquo;t matter. Because everything else needed you first.</p>
            <div className="wl-cal">
              <span className="wl-cal-rings" aria-hidden="true">
                <i /><i /><i /><i />
              </span>
              <ol className="wl-cal-cols">
                {[
                  ["4 weeks ago", "Caterer tasting"],
                  ["3 weeks ago", "Decor walk-through"],
                  ["2 weeks ago", "Guest list, again"],
                ].map(([w, task]) => (
                  <li className="wl-cal-col" key={w}>
                    <span className="wl-cal-when">{w}</span>
                    <span className="wl-cal-task">{task}</span>
                    <span className="wl-cal-note"><s>Your look</s></span>
                  </li>
                ))}
                <li className="wl-cal-col wl-cal-col--now">
                  <span className="wl-cal-when">This week</span>
                  <span className="wl-cal-note">4 weeks to go. Nothing started yet.</span>
                </li>
              </ol>
              <Divider className="wl-cal-rule" flower />
            </div>
          </li>

          <li className="wl-s3-card">
            <div className="wl-s3-head">
              <Badge n="03" />
              <h3>And now it has to stand next to hers</h3>
            </div>
            <p className="wl-s3-sub">At the varmala, the pheras, and in every couple portrait.</p>
            <div className="wl-vs">
              {COMPARE.map((c) => (
                <div className="wl-vs-box" key={c.who}>
                  <div className="wl-vs-head">
                    <span>{c.who}</span>
                    {c.icon}
                  </div>
                  <ul className="wl-vs-list">
                    {c.items.map((it) => (
                      <li key={it}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
                          <path d="m7.5 12.5 3 3 6-7" />
                        </svg>
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </li>
        </ol>

        <div className="wl-pb-close">
          <p className="wl-pb-close-line">
            You get married once.
            <br />
            <em>The photos stay forever.</em>
          </p>
          <Divider className="wl-pb-close-rule" flower />
          <p className="wl-s3-bridge">4 weeks is tight. It&rsquo;s not too late, if you start this week.</p>
        </div>
      </section>

      <section className="wl-edit" aria-label="What happens in the Dulha Edit">
        {/* phone-only small corner ornaments */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="wl-m-corner wl-m-corner--tl" src="/images/wedding/corner-s4.webp" alt="" aria-hidden="true" loading="lazy" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="wl-m-corner wl-m-corner--br" src="/images/wedding/corner-s4.webp" alt="" aria-hidden="true" loading="lazy" />
        {/* Corner decor cut from the section's reference image (transparent, feathered). */}
        {["tl", "tr", "bl", "br", "jasmine"].map((k) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={k} className={`wl-s4-decor wl-s4-${k}`} src={`/images/wedding/s4-${k}.webp`} alt="" aria-hidden="true" loading="lazy" />
        ))}
        <div className="wl-pb-head">
          <p className="wl-eyebrow wl-eyebrow--flower">
            <Flower className="wl-eyebrow-flower" />
            What happens in the Dulha Edit
          </p>
          <h2 className="wl-pb-h">
            Every function planned.
            <br />
            Every look tested on camera.
            <br />
            <em>Sanobar with you on the day.</em>
          </h2>
          <p className="wl-edit-intro">
            Your look gets the same care as hers. Every function, haldi to reception. Done for you in 4 weeks.
          </p>
        </div>

        <ol className="wl-ed-cards">
          <li className="wl-ed-card">
            <div className="wl-ed-head">
              <span className="wl-pb-num">01</span>
              <div>
                <h3>Plan it.</h3>
                <p>Sanobar plans every look. You don&rsquo;t have to decide.</p>
              </div>
            </div>
            <ul className="wl-ed-fns">
              {FUNCTIONS.map((f) => (
                <li key={f}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/images/wedding/ed-${f}.webp`} alt="" width={260} height={260} loading="lazy" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <IconRow items={[["colours", "Your colours"], ["fit", "Your fit"], ["family", "Your family traditions"]]} />
            <CardFoot>One look for every function, matched to your bride.</CardFoot>
          </li>

          <li className="wl-ed-card">
            <div className="wl-ed-head">
              <span className="wl-pb-num">02</span>
              <div>
                <h3>Source it.</h3>
                <p>You only try what&rsquo;s already chosen for you.</p>
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="wl-ed-hero" src="/images/wedding/ed-source.webp" alt="A white embroidered sherwani with a red safa and dupatta" width={720} height={460} loading="lazy" />
            <IconRow items={[["outfits", "Outfits"], ["accessories", "Accessories"], ["varmala", "Varmala"], ["grooming", "Grooming"]]} />
            <CardFoot>Sanobar does the running around. You just show up.</CardFoot>
          </li>

          <li className="wl-ed-card">
            <div className="wl-ed-head">
              <span className="wl-pb-num">03</span>
              <div>
                <h3>Test it.</h3>
                <p>Nothing gets approved until it works on you.</p>
              </div>
            </div>
            <ul className="wl-ed-tests">
              {TESTS.map((t) => (
                <li key={t.label}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/images/wedding/${t.img}.webp`} alt="" width={260} height={340} loading="lazy" />
                  <span className="wl-ed-tests-label">{t.label}</span>
                  <span className="wl-ed-tests-text">{t.text}</span>
                </li>
              ))}
            </ul>
            <CardFoot>Tested on camera, so you look right next to her.</CardFoot>
          </li>

          <li className="wl-ed-card">
            <div className="wl-ed-head">
              <span className="wl-pb-num">04</span>
              <div>
                <h3>Style it.</h3>
                <p>You don&rsquo;t have to manage your outfit on the day.</p>
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="wl-ed-hero" src="/images/wedding/ed-style.webp" alt="A stylist adjusting a groom's outfit" width={720} height={460} loading="lazy" />
            <ul className="wl-ed-day">
              {ON_THE_DAY.map(([icon, label]) => (
                <li key={label}>
                  <WIcon name={icon} />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
            <CardFoot>Sanobar is with you till the last photo.</CardFoot>
          </li>
        </ol>

        <p className="wl-ed-close">
          Every part of your look is taken care of.
          <em>All you have to do is book your Wedding Look Audit today.</em>
        </p>

      </section>

      <section className="wl-call" aria-label="What happens on the call">
        {/* phone-only small corner ornaments */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="wl-m-corner wl-m-corner--tl" src="/images/wedding/corner-s5.webp" alt="" aria-hidden="true" loading="lazy" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="wl-m-corner wl-m-corner--br" src="/images/wedding/corner-s5.webp" alt="" aria-hidden="true" loading="lazy" />
        <div className="wl-pb-head">
          <p className="wl-eyebrow wl-eyebrow--flower">
            <Flower className="wl-eyebrow-flower" />
            Your 30-minute call
          </p>
          <h2 className="wl-pb-h wl-call-h">
            What Sanobar covers in your <em>Wedding Look Audit.</em>
          </h2>
          <Divider className="wl-pb-rule" flower />
          <p className="wl-edit-intro">
            30 minutes, one to one with Sanobar. Just bring your function dates and venues. Booking for him? You can
            book it on his behalf.
          </p>
        </div>

        <ol className="wl-call-steps">
          {CALL_STEPS.map((st, i) => (
            <li className="wl-call-step" key={st.tag}>
              <span className="wl-call-n">
                <WIcon name={st.icon} />
              </span>
              <div className="wl-call-body">
                <p className="wl-call-tag">
                  <span className="wl-call-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="wl-call-sep" aria-hidden="true" />
                  {st.tag}
                </p>
                <h3>{st.title}</h3>
                <p className="wl-call-desc">{st.desc}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="wl-ed-close">
          One 30-minute call with Sanobar.
          <em>A clear plan for your next 4 weeks.</em>
        </p>
      </section>

      <section className="wl-faq" aria-label="Questions grooms ask">
        <div className="wl-pb-head">
          <p className="wl-eyebrow wl-eyebrow--flower">
            <Flower className="wl-eyebrow-flower" />
            Questions grooms ask
          </p>
          <h2 className="wl-pb-h">
            Before you book your <em>Wedding Look Audit</em>
          </h2>
          <Divider className="wl-pb-rule" flower />
        </div>

        <div className="wl-faq-list">
          {WEDDING_FAQ.map((f) => (
            <details className="wl-faq-item" key={f.q} open={f.open}>
              <summary>
                <span>
                  {f.q}
                  {f.open ? <span className="wl-faq-most">Most asked</span> : null}
                </span>
                <svg className="wl-faq-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="wl-finale" aria-label="Book your Wedding Look Audit" data-sticky-stop>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="wl-finale-orn wl-finale-orn--l" src="/images/wedding/mandala-ring.webp" alt="" aria-hidden="true" loading="lazy" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="wl-finale-orn wl-finale-orn--r" src="/images/wedding/mandala-lace.webp" alt="" aria-hidden="true" loading="lazy" />
        <div className="wl-finale-inner">
          <Divider className="wl-finale-rule" flower />
          <h2 className="wl-finale-h">
            Your wedding is one take.
            <em>Let&rsquo;s get it right.</em>
          </h2>
          <a className="wl-btn wl-finale-btn" href={BOOK_HREF}>
            Book your Wedding Look Audit ({PRICE_LABEL})
            <svg viewBox="0 0 28 12" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M1 6h25M21 1.5 26 6l-5 4.5" />
            </svg>
          </a>
          <ul className="wl-trust wl-finale-trust">
            {TRUST.map((t) => (
              <li className="wl-trust-i" key={t.lines[0]}>
                <span className="wl-trust-ic">{t.icon}</span>
                <span className="wl-trust-txt">
                  {t.lines[0]}
                  <br />
                  {t.lines[1]}
                </span>
              </li>
            ))}
          </ul>
          <p className="wl-colophon">The Dulha Edit, by Sanobar Samir.</p>
        </div>
      </section>

      <WeddingSticky href={BOOK_HREF} label={`Book your Wedding Look Audit (${PRICE_LABEL})`} />
    </main>
  );
}
