/* Result-page libraries + view-model assembly.
   Grounded in build-libraries.md, the leadmagnet build spec (archetype + body-shape
   copy), and result-page-copy-v2.md (the Model B section copy). The quiz outputs
   (Presence Score + band, current type, goal archetype, body shape) select the
   blocks below. Copy is faithful to source where given; derived lines are marked. */

import { QUESTIONS, type Gender, type QuizResult } from "../quiz/quizData";

/* ---------- score-band reveal paragraph (3 bands) ---------- */
const BAND_PARA: Record<string, string> = {
  "The Capable Gap":
    "This is the score of someone who did the hard part, built the success, and never turned the same care onto how they are seen. The number is low for a reason. The gap is real, and right now it works against you.",
  "The Near Miss":
    "This is the most common range for successful people. You get some of it right by instinct. But instinct is not a system, and the missing part is exactly the part that decides how you are read in the first few seconds.",
  "The Final Polish":
    "Do not let this number fool you into thinking you are nearly there. You are not. You have the success, but your image is still read several levels below it, and that gap shows up in the rooms that matter most.",
};

/* ---------- perception gap, by GOAL family (signal today -> should signal) ---------- */
type Perc = { todayHead: string; todayBody: string; shouldHead: string; shouldBody: string };
const PERCEPTION: Record<string, Perc> = {
  AUTHORITY: {
    todayHead: "Capable and trusted. Easy to respect, easy to underestimate.",
    todayBody: "You walk into a meeting and people are not sure you are the senior one until you speak. You have had to prove your level instead of having it assumed. The respect comes, but it comes late, and you have felt yourself earning it in rooms where it should have been automatic.",
    shouldHead: "The senior person, before you say a word.",
    shouldBody: "People treat you as the most important person in the room from the moment you arrive. The authority arrives with you, so you stop having to prove it.",
  },
  ELEGANCE: {
    todayHead: "Polished and correct. Always right, rarely remembered.",
    todayBody: "You are never wrongly dressed, which is a real strength. But correct is not the same as memorable. You leave the event and a week later nobody quite remembers what you wore, or sometimes that you were there. Right is the floor. It was never meant to be the ceiling.",
    shouldHead: "Distinct. Composed. The one people remember.",
    shouldBody: "The same polish, now with one clear signature people remember you by. You stop being the person who looked nice and become the person they talk about later.",
  },
  MODERN: {
    todayHead: "Established and successful. Built for an earlier chapter.",
    todayBody: "Your image says you arrived, which is true. It just arrived a few years ago and stopped. People meet a version of you from an older chapter and respond to that, not to where you are now, and you feel the small gap every time.",
    shouldHead: "Modern. Sharp. Exactly of this moment.",
    shouldBody: "An image set to who you are today, so people respond to the current you straight away, not an old one.",
  },
  MAGNETIC: {
    todayHead: "Polished enough. Easy to place. Easy to forget.",
    todayBody: "You are capable and put-together, which is fine, and fine is the problem. Nothing about your image is unmistakably you, so you blend into the room instead of standing out in it. People place you quickly, and forget you just as quickly.",
    shouldHead: "Magnetic. Intentional. Impossible to overlook.",
    shouldBody: "An image that enters the room ahead of you and stays in people's memory long after you leave. You stop blending in and become the one they remember.",
  },
  EFFORTLESS: {
    todayHead: "Reliable and trusted. Dependable, not yet commanding.",
    todayBody: "People know they can count on you, and that has earned you a lot. But dependable is only one side of you. The stronger side, your presence, stays hidden, so you are the safe choice in the room rather than the commanding one, and you have noticed the difference.",
    shouldHead: "At ease. Sure of yourself. Clearly the senior one.",
    shouldBody: "The same trust, now carried with a presence that reads as the senior person in the room, not only the dependable one.",
  },
};

export function goalFamily(goalTag: string): keyof typeof PERCEPTION {
  const k = (goalTag || "").replace("GOAL-", "");
  return (["AUTHORITY", "ELEGANCE", "MODERN", "MAGNETIC", "EFFORTLESS"].includes(k) ? k : "MAGNETIC") as keyof typeof PERCEPTION;
}

/* ---------- body shape: read + goal + actor pairing (shown) ; rules GATED ---------- */
type Shape = {
  read: string; goalLine: string;
  actorMan: string; actorWoman: string;
  actorManShort?: string; actorWomanShort?: string; // shorter-frame pairing [PENDING SANOBAR]
  principle: string;
};
const SHAPE: Record<string, Shape> = {
  "Triangle": {
    read: "Your lower body carries more weight than your upper, and your waist is usually well defined. That waist is the single greatest asset this shape has, and most people with it never use it on purpose.",
    goalLine: "The whole job is balance, and there is a clear way to get it for your build. That method is what the call is for.",
    actorMan: "Ranbir Kapoor", actorWoman: "Janhvi Kapoor",
    principle: "keep the lower half clean and dark, build interest and structure up top, and mark the waist to pull the whole look together.",
  },
  "Hourglass": {
    read: "Your shoulders and hips sit in balance, with a clearly defined waist between them. This is the most naturally proportioned shape there is, which means your image has the least to fight and the most to gain.",
    goalLine: "The job is to follow the line you already have instead of hiding it. There is a clear way to do that for your proportions, and that is what the call covers.",
    actorMan: "Hrithik Roshan", actorWoman: "Deepika Padukone",
    principle: "follow the natural curve and keep the waist visible, with tailoring that traces the shape rather than boxing it out.",
  },
  "Rectangle": {
    read: "Your shoulders, waist and hips run in a fairly straight line, with little natural definition. That is a clean, versatile frame, and clothes can build almost any shape onto it.",
    goalLine: "The job is to create the shape the frame does not give you on its own. There is a clear way to do that for your build, and the call is where it gets mapped to you.",
    actorMan: "Shah Rukh Khan", actorWoman: "Aishwarya Rai Bachchan",
    principle: "build shape deliberately, structure at the shoulder, a suggested waist, and layers that add dimension.",
  },
  "Inverted Triangle": {
    read: "Your shoulders and upper body are the widest, strongest part of your frame. This is a genuinely powerful shape to have, and it already makes you look strong and present.",
    goalLine: "The whole job is to balance that strength so it reads as presence, not bulk. There is a clear way to do it for your proportions, and that is what the call is for.",
    actorMan: "Sidharth Malhotra", actorWoman: "Disha Patani",
    principle: "keep the top half plain, soften the shoulder line, and add visible weight low so the frame reads balanced.",
  },
  "Oval": {
    read: "Your midsection is the fullest part of your frame, and your real strengths are your shoulders and very often your legs. Most people with this shape hide the wrong part and lose the strong one.",
    goalLine: "The job is to lead the eye to your strengths and let the rest sit easy. There is a clear way to do that for your build, and the call is where it gets fitted to you.",
    actorMan: "Amitabh Bachchan", actorWoman: "Vidya Balan",
    principle: "work in long vertical lines, use the shoulder, show the legs, and let clothes skim the middle rather than grip it.",
  },
};

/* ---------- current image type copy (from Q3) — two beats so the left card mirrors
   the right card's [tagline + forward line] shape. Beat 1 = a short, specific read of
   how they dress. Beat 2 = a fixed ego-protect + gap line, identical opener across all
   five ("Nothing you wear is wrong. It simply doesn't ...") so the reassurance reads
   the same every time; only the gap clause changes. CUR-CASUAL is source-confirmed
   verbatim. Model B: this names the gap, never the fix. ---------- */
type CurrentCopy = { beat1: string; beat2: string };
const CURRENT_BODY: Record<string, CurrentCopy> = {
  "CUR-CLASSIC": {
    beat1: "You dress correctly, never out of place.",
    beat2: "Nothing you wear is wrong. It simply doesn't carry one signature that makes a look unmistakably yours.",
  },
  "CUR-CASUAL": {
    beat1: "You dress for the day, not for the room.",
    beat2: "Nothing you wear is wrong. It simply doesn't show people who you are before you speak.",
  },
  "CUR-TRENDY": {
    beat1: "You keep up with what is current, season after season.",
    beat2: "Nothing you wear is wrong. It simply doesn't settle into one look people recognise as yours.",
  },
  "CUR-MINIMAL": {
    beat1: "You keep it low-key on purpose, and there is taste in that.",
    beat2: "Nothing you wear is wrong. It simply doesn't speak up in the rooms where your image should.",
  },
  "CUR-INTERCHANGEABLE": {
    beat1: "Neat, decent, and a lot like everyone else in the room.",
    beat2: "Nothing you wear is wrong. It simply doesn't yet feel like you, so nothing makes you remembered.",
  },
};

/* The right card's forward line: a fixed, archetype-agnostic mirror of the left's
   "Nothing you wear is wrong ..." reassurance. Stays true for any gender, segment
   or archetype that fills the slot, and leaks no "how" (Model B gate). */
const GOAL_FORWARD = "Dressed in a way that makes your presence clear from the moment you walk in.";

/* ---------- goal archetype: what-you-have / next-move (leadmagnet Part 3) ---------- */
type ArchCopy = { have: string; next: string };
const ARCH: Record<string, ArchCopy> = {
  "The Authoritative Founder": { have: "A natural, earned authority that people feel before you speak.", next: "Make that authority intentional, so it shows up every time, not just on a good day." },
  "The Powerhouse": { have: "Deep skill and a track record nobody can argue with.", next: "Let your image show that skill on sight, so people see how capable you are from the first second." },
  "The Trusted Expert": { have: "Total, hard-won trust in a field where trust is everything.", next: "Refresh your image so it reads as current authority, not just long experience." },
  "The New Chapter": { have: "Self-awareness, momentum, and a rare clean slate to design your image on purpose.", next: "Build a look that belongs to the chapter you are entering: sharp, current and unmistakably you." },
  "The Public Figure": { have: "Real visibility and attention, the raw material most people never get.", next: "Turn an improvised look into one consistent signature, so your image builds with every appearance." },
  "The Magnetic Founder": { have: "A real achievement of your own and the decisiveness that built it.", next: "Give your image the same care you give your business, so the way you look speaks for you before you do." },
  "The Understated Elegant": { have: "A polished, current, well-judged image. The taste and the effort are clearly already there.", next: "Add the personal signature that turns a correct look into one that is recognisably yours." },
  "The Rising Presence": { have: "A life that has genuinely risen, with the access and the rooms to match.", next: "Bring your image up to the level of your life, so it looks easy, not like it is trying to catch up." },
  "The Creative Spirit": { have: "Genuine taste, courage and personality. The individuality is real and already yours.", next: "Find the one thread that turns your individuality into a signature people recognise." },
};

/* ---------- "how did they know that?" personalised reads (3 short lines) ----------
   Derived ONLY from real quiz answers so they are true, not a generic persona:
   one line keyed to the q3 current-dress tag, one to the q2 pain tag, one to the
   q1 segment. Each reframes the SAME instinct that built their success as the
   reason their image stopped evolving. Plain, gender-neutral, no method leaked. */
const READ_DRESS: Record<string, string> = {
  "CUR-CLASSIC": "You always dress correctly. That is exactly why your image plays it safe instead of saying anything about you.",
  "CUR-CASUAL": "You chose comfort so you could focus on the work. The career grew. The image never grew with it.",
  "CUR-TRENDY": "You keep up with what is current instead of owning one look. It keeps you fresh, and it is why your image shifts every season instead of saying one clear thing.",
  "CUR-MINIMAL": "You would rather not draw attention to what you wear. That restraint reads as taste, and it is why your image stays quiet in rooms where it should be talking for you.",
  "CUR-INTERCHANGEABLE": "You chose neat and decent over standing out. It kept things simple, and it is why your image looks like everyone else's, not like yours.",
};
const READ_PAIN: Record<string, string> = {
  "PAIN-COPYING": "Looks you admire never land the same on you. That is not your eye failing. Nobody ever matched them to your build.",
  "PAIN-FIT": "You have started avoiding shopping because nothing feels made for your body. Your body is not the problem. The advice was never built for your shape.",
  "PAIN-TRANSLATION": "You cannot tell on the hanger what will actually suit you. That is not a gap in your taste. Nobody ever gave you the rule for your shape.",
  "PAIN-INCOHERENCE": "A full wardrobe, and still nothing to wear. That is not a discipline problem. It is a wardrobe with no single plan holding it together.",
  "PAIN-INVISIBLE": "You have done well, but you do not see it in the mirror. That gap is the whole reason you are here, and it is the most fixable thing on this page.",
};
const READ_SEGMENT: Record<string, string> = {
  "SEG-FOUNDER": "Building the business always came first, and it should have. Your image is the one part that has not caught up.",
  "SEG-EXEC": "You put your attention on the team and the work, not on yourself. Right call. It is also why your image now sits a step behind your standing.",
  "SEG-PROFESSIONAL": "Doing the work well earned your seniority. Your image was never part of that effort, so it never kept up with your level.",
  "SEG-PUBLIC": "Being seen often, your image got improvised under pressure, again and again. It never settled into one look that works for you every time.",
  "SEG-HOMEMAKER": "You run a full life and put everyone in it first. That is why your own image quietly slipped down the list.",
  "SEG-REINVENTION": "You are stepping into a new phase. This is the rare moment your image can be designed on purpose, not carried over from an old chapter.",
};

const SEGMENT_PHRASE: Record<string, string> = {
  "SEG-FOUNDER": "a founder", "SEG-EXEC": "a senior executive", "SEG-PROFESSIONAL": "a senior professional",
  "SEG-PUBLIC": "someone often in the public eye", "SEG-HOMEMAKER": "someone with a full social life",
  "SEG-REINVENTION": "someone stepping into a new chapter",
};

const MIRROR_EYEBROW: Record<string, string> = {
  q1: "YOUR WORLD", q2: "WHAT FRUSTRATES YOU", q3: "HOW YOU DRESS TODAY", q4: "YOUR BUILD",
  q5: "WHERE WEIGHT SETTLES", q6: "THE REAL YOU", q7: "HOW YOU WANT TO BE SEEN",
};

/* label for a chosen tag, pulled from the quiz options (their own words) */
function labelFor(qid: string, tag: string): string {
  const q = QUESTIONS.find((x) => x.id === qid);
  const o = q?.options.find((op) => op.tag === tag);
  return o?.label ?? "";
}

export type ResultView = {
  score: number;
  band: string;
  bandPara: string;
  mirror: { eyebrow: string; line: string }[];
  currentType: string;
  currentBeat1: string;
  currentBeat2: string;
  goalType: string;
  goalTagline: string;
  goalForward: string;
  goalHave: string;
  goalNext: string;
  perc: Perc;
  reads: { key: string; title: string; body: string }[];
  bodyShape: string;
  shapeRead: string;
  shapeGoal: string;
  actor: string;
  actorOther: string;
  shapePrinciple: string;
  segmentPhrase: string;
  pairIntro: string;
  pairFeatures: { head: string; body: string }[];
  pairQuote: string;
};

/* height tier for the actor pairing: a short-framed reader should not be paired
   with a much taller star. The shorter-frame, shape-matched actor names are
   [PENDING SANOBAR] verification (asserting a star's height + shape is a
   credibility claim per the honesty rule), so until they are supplied the pairing
   falls back to the shape default. */
const SHORT_HEIGHTS = new Set(["Under 5'4", "5'4 to 5'7"]);
function heightTier(h?: string): "short" | "tall" {
  return h && SHORT_HEIGHTS.has(h) ? "short" : "tall";
}

/* body-shape pairing (Model B, GATED): a plain physical description per shape only.
   The actual styling rule is NEVER stated here; a fixed closing reserves it for the
   call. This is the mechanism working the reader toward the consultation. */
type PairCopy = { article: string; desc: string };
const SHAPE_PAIR: Record<string, PairCopy> = {
  "Inverted Triangle": { article: "an", desc: "broad and strong through the shoulders and chest, and slimmer through the hips and legs" },
  "Triangle": { article: "a", desc: "fuller through the hips and thighs, and slimmer through the shoulders and chest, with a naturally defined waist" },
  "Hourglass": { article: "an", desc: "evenly balanced between the shoulders and hips, with a clearly defined waist in the middle" },
  "Rectangle": { article: "a", desc: "fairly straight through the shoulders, waist and hips, with little natural curve" },
  "Oval": { article: "an", desc: "a little fuller through the middle, and strong through the shoulders and legs" },
};

export function buildView(r: QuizResult): ResultView {
  const g: Gender = r.intake.gender;
  const fam = goalFamily(r.tags.q7);
  const shape = SHAPE[r.bodyShape] ?? SHAPE["Inverted Triangle"];
  const order = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"];
  const short = heightTier(r.intake.height) === "short";
  const actor =
    g === "man"
      ? (short && shape.actorManShort) || shape.actorMan
      : (short && shape.actorWomanShort) || shape.actorWoman;
  const poss = g === "man" ? "his" : "her";
  const obj = g === "man" ? "him" : "her";
  const pair = SHAPE_PAIR[r.bodyShape] ?? SHAPE_PAIR["Inverted Triangle"];
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  // GATED editorial blocks (no rule stated): intro + three feature beats + a pull-quote.
  const pairIntro = `You and ${actor} have the same body proportions. ${cap(pair.desc)}.`;
  const pairFeatures = [
    { head: `This is not about looking like ${actor}.`, body: "It is only about body proportions." },
    { head: "Clothes solve the same problem on both bodies.", body: `That is why the styling principles that work for ${obj} will also work for you.` },
    { head: "Good style is not luck.", body: "It is knowing what works for your proportions, and once you do, getting dressed becomes predictable." },
  ];
  const pairQuote = `The goal isn't to dress like ${actor}. It's to use the same styling principles that make ${poss} proportions look balanced.`;
  return {
    pairIntro,
    pairFeatures,
    pairQuote,
    score: r.presenceScore,
    band: r.band,
    bandPara: BAND_PARA[r.band] ?? BAND_PARA["The Near Miss"],
    mirror: order
      .filter((q) => r.tags[q])
      .map((q) => ({ eyebrow: MIRROR_EYEBROW[q], line: labelFor(q, r.tags[q]) })),
    currentType: r.currentType,
    currentBeat1: (CURRENT_BODY[r.tags.q3] ?? CURRENT_BODY["CUR-CASUAL"]).beat1,
    currentBeat2: (CURRENT_BODY[r.tags.q3] ?? CURRENT_BODY["CUR-CASUAL"]).beat2,
    goalType: r.goalType,
    goalTagline: r.goalTagline,
    goalForward: GOAL_FORWARD,
    goalHave: ARCH[r.goalType]?.have ?? "",
    goalNext: ARCH[r.goalType]?.next ?? "",
    perc: PERCEPTION[fam],
    reads: [
      { key: "world", title: "Your world", body: READ_SEGMENT[r.tags.q1] },
      { key: "dress", title: "Your style", body: READ_DRESS[r.tags.q3] },
      { key: "pain", title: "Your frustration", body: READ_PAIN[r.tags.q2] },
    ].filter((x) => x.body),
    bodyShape: r.bodyShape,
    shapeRead: shape.read,
    shapeGoal: shape.goalLine,
    actor,
    actorOther: g === "man" ? shape.actorWoman : shape.actorMan,
    shapePrinciple: shape.principle,
    segmentPhrase: SEGMENT_PHRASE[r.tags.q1] ?? "someone in your position",
  };
}
