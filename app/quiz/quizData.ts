/* The Instant Image Upgrade — quiz data + scoring.
   Source of truth: /workspace/sanobar-landing-page/sanobar-funnel-spec.md (the 7
   questions, hidden tags, gender fork). The four outputs (Presence Score, Current
   Image Type, Goal Image Type, Body Shape) feed the result page.
   NOTE: the archetype NAMES and the score WEIGHTS below are reasonable placeholders,
   tunable, to be reconciled with build-libraries.md when the result engine is built. */

export type Gender = "man" | "woman";

export type Opt = {
  tag: string;
  label: string;
  sub?: string;        // gender-neutral helper line
  subMan?: string;     // shown to men
  subWoman?: string;   // shown to women
  only?: Gender;       // option shown for one gender only (e.g. homemaker)
};

export type Question = {
  id: "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7";
  prompt: string;
  hint?: string;
  shape?: boolean;     // q4 renders silhouette slots
  options: Opt[];
};

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    prompt: "Which of these sounds most like you right now?",
    options: [
      { tag: "SEG-FOUNDER", label: "I run my own business" },
      { tag: "SEG-EXEC", label: "I lead a team at work" },
      { tag: "SEG-PROFESSIONAL", label: "I'm senior and experienced in my job" },
      { tag: "SEG-PUBLIC", label: "I'm often in the public eye, or on camera" },
      { tag: "SEG-HOMEMAKER", label: "I run my home and I'm active in my social circle", only: "woman" },
      { tag: "SEG-REINVENTION", label: "I'm starting a new phase in life" },
    ],
  },
  {
    id: "q2",
    prompt: "Be honest. Which one sounds most like you?",
    options: [
      { tag: "PAIN-COPYING", label: "I save looks I admire, but on me they never look the way they did on someone else" },
      { tag: "PAIN-FIT", label: "I've started avoiding shopping. Nothing ever seems made for my body" },
      { tag: "PAIN-TRANSLATION", label: "On the hanger it looks great, but I can't tell if it'll actually suit me" },
      { tag: "PAIN-INCOHERENCE", label: "My wardrobe is full, but most mornings I still have nothing to wear" },
      { tag: "PAIN-INVISIBLE", label: "I've done well in life, but I don't see that when I look in the mirror" },
    ],
  },
  {
    id: "q3",
    prompt: "On a normal day, how do you usually dress?",
    options: [
      { tag: "CUR-CLASSIC", label: "Formal and classic, the proper put-together look",
        subMan: "a sharp shirt and trousers",
        subWoman: "a formal dress, a pant suit, or a shirt with tailored trousers" },
      { tag: "CUR-CASUAL", label: "Casual and easy, whatever's comfortable",
        subMan: "jeans, t-shirts",
        subWoman: "jeans, a casual top, leggings or a kurti" },
      { tag: "CUR-TRENDY", label: "I follow the latest trends and like trying new styles",
        subMan: "new-season sneakers, bold prints, the latest cuts",
        subWoman: "co-ord sets, the latest cuts, statement prints" },
      { tag: "CUR-MINIMAL", label: "Low-key on purpose. I'd rather not draw attention to what I'm wearing",
        subMan: "plain solid colours, clean and simple, nothing flashy",
        subWoman: "plain solids, simple cuts, nothing flashy" },
      { tag: "CUR-INTERCHANGEABLE", label: "Neat and decent, but honestly a lot like everyone else",
        subMan: "a plain shirt, regular jeans, safe colours",
        subWoman: "a basic kurti or top, regular jeans, safe colours" },
    ],
  },
  {
    id: "q4",
    prompt: "Take a quick look in the mirror. Which one looks most like you?",
    hint: "Go by your overall shape, not your size.",
    shape: true,
    options: [
      { tag: "BS-HOURGLASS", label: "Shoulders and hips about the same width, waist clearly narrower" },
      { tag: "BS-RECTANGLE", label: "Shoulders, waist and hips all about the same width" },
      { tag: "BS-TRIANGLE", label: "Lower body wider than the upper body" },
      { tag: "BS-INVERTED", label: "Upper body wider than the lower body" },
      { tag: "BS-OVAL", label: "The belly is the widest part" },
    ],
  },
  {
    id: "q5",
    prompt: "When you put on a little weight, where does it show first?",
    options: [
      { tag: "WD-EVEN", label: "All over, evenly. It stays in proportion" },
      { tag: "WD-LOWER", label: "Hips, thighs and bottom first" },
      { tag: "WD-MIDDLE", label: "Around the belly first" },
      { tag: "WD-UPPER", label: "Face, chest and upper body first" },
    ],
  },
  {
    id: "q6",
    prompt: "Think of your comfort zone. What do you reach for when you want to feel your best?",
    options: [
      { tag: "TASTE-MINIMAL", label: "Clean and simple. Plain colours, no patterns, nothing extra" },
      { tag: "TASTE-CLASSIC", label: "A timeless staple that never dates",
        subMan: "a good shirt, simple tailoring",
        subWoman: "a classic saree, or a shirt and trousers with a blazer" },
      { tag: "TASTE-DISTINCTIVE", label: "Something with a bit of me in it. A colour, a detail, some personality" },
      { tag: "TASTE-RELAXED", label: "Comfort first. Soft, easy fabrics I can move and relax in" },
    ],
  },
  {
    id: "q7",
    prompt: "An evening that really matters. You check the mirror before leaving. What do you want people to see?",
    options: [
      { tag: "GOAL-AUTHORITY", label: "Someone in charge. Clearly the leader in the room" },
      { tag: "GOAL-MAGNETIC", label: "The one everyone remembers afterwards" },
      { tag: "GOAL-MODERN", label: "Stylish and modern, completely up to date" },
      { tag: "GOAL-ELEGANCE", label: "Elegant and timeless, never out of style" },
      { tag: "GOAL-EFFORTLESS", label: "Great, like I didn't even try" },
    ],
  },
];

/* helper: the gender-correct helper line for an option */
export function optSub(o: Opt, g: Gender): string | undefined {
  if (g === "man" && o.subMan) return o.subMan;
  if (g === "woman" && o.subWoman) return o.subWoman;
  return o.sub;
}

/* the options visible to this gender (filters gender-only options) */
export function visibleOptions(q: Question, g: Gender): Opt[] {
  return q.options.filter((o) => !o.only || o.only === g);
}

/* ============================================================
   THE ENGINE — grounded in build-libraries.md + the leadmagnet build spec
   ("instant image upgrade - quiz and leadmagnet for atul"). NOT placeholders.
   Question numbers below are OUR funnel-spec order (q3=current dress, q7=goal,
   q4=shape mirror, q5=weight, q6=taste); the spec's logic is mapped by TAG.
   ============================================================ */

/* ---------- Presence Score: base 62 minus NAMED deductions, clamp 22–48 ----------
   HARSH BY DESIGN. The ceiling is held BELOW 50 on purpose: no one should read
   their number as "already fine, just needs a tweak". Even the strongest answers
   land at 48, which reads as "not there yet". Q2 pain and Q3 current style carry
   the main deductions; a gap penalty if current is low-effort but goal is high; a
   shape penalty if the shape is being "dressed by guesswork". Deduct range is
   roughly 14–44, so scores spread across ~22–48. Anchor: CUR-CASUAL + PAIN-
   TRANSLATION + gap + guesswork = 34 deduct -> 28 (low "Capable Gap"). TUNABLE. */
const PAIN_DEDUCT: Record<string, number> = {
  "PAIN-COPYING": 18, "PAIN-INVISIBLE": 16, "PAIN-INCOHERENCE": 14, "PAIN-TRANSLATION": 12, "PAIN-FIT": 8,
};
const CUR_DEDUCT: Record<string, number> = {
  "CUR-INTERCHANGEABLE": 16, "CUR-MINIMAL": 13, "CUR-CASUAL": 12, "CUR-TRENDY": 8, "CUR-CLASSIC": 6,
};
const LOW_EFFORT = new Set(["CUR-CASUAL", "CUR-INTERCHANGEABLE", "CUR-MINIMAL", "CUR-TRENDY"]);
const HIGH_GOAL = new Set(["GOAL-AUTHORITY", "GOAL-MAGNETIC", "GOAL-MODERN"]);

function presenceScore(a: Answers): { score: number; band: string } {
  let deduct = 0;
  deduct += PAIN_DEDUCT[a.q2] ?? 0;                                  // Q2 pain
  deduct += CUR_DEDUCT[a.q3] ?? 0;                                   // Q3 current style
  if (LOW_EFFORT.has(a.q3) && HIGH_GOAL.has(a.q7)) deduct += 5;      // Q4-gap (current->goal)
  if (a.q3 === "CUR-INTERCHANGEABLE" || a.q2 === "PAIN-TRANSLATION") deduct += 5; // shape by guesswork
  const score = Math.max(22, Math.min(48, 62 - deduct));
  const band = score <= 32 ? "The Capable Gap" : score <= 41 ? "The Near Miss" : "The Final Polish";
  return { score, band };
}

/* ---------- Current Image Type (from Q3 current-dress tag) ----------
   Derived current-state names; "The Capable Casual" is the report's confirmed
   label for CUR-CASUAL, the rest follow its tone. */
const CURRENT_TYPE: Record<string, string> = {
  "CUR-CLASSIC": "The Polished Classic",
  "CUR-CASUAL": "The Capable Casual",
  "CUR-TRENDY": "The Trend-Led Dresser",
  "CUR-MINIMAL": "The Deliberate Minimalist",
  "CUR-INTERCHANGEABLE": "The Capable Default",
};

/* ---------- Goal Image Type: 5 archetypes per gender, selected by SEGMENT ----------
   (Q7 goal tag drives the perception-gap copy family; the archetype itself is
   segment-tuned, exactly per Part 3 of the build spec.) */
type Arch = { name: string; tagline: string };
const M: Record<string, Arch> = {
  founder: { name: "The Authoritative Founder", tagline: "The one a room reads as the boss before you speak." },
  exec: { name: "The Powerhouse", tagline: "The one who clearly built something serious." },
  professional: { name: "The Trusted Expert", tagline: "The one people trust with the call that matters." },
  reinvention: { name: "The New Chapter", tagline: "The one stepping into a sharper chapter." },
  public: { name: "The Public Figure", tagline: "The one who looks the part every time they are seen." },
};
const F: Record<string, Arch> = {
  founder: { name: "The Magnetic Founder", tagline: "The one who clearly built this herself." },
  elegant: { name: "The Understated Elegant", tagline: "The one who is put-together and unmistakably herself." },
  rising: { name: "The Rising Presence", tagline: "The one who has clearly moved up a level." },
  reinvention: { name: "The New Chapter", tagline: "The one stepping into a sharper chapter." },
  creative: { name: "The Creative Spirit", tagline: "The one with a look that is clearly her own." },
};

function goalArchetype(g: Gender, a: Answers): Arch {
  const seg = a.q1, taste = a.q6, cur = a.q3, pain = a.q2;
  if (g === "man") {
    if (seg === "SEG-FOUNDER") return M.founder;
    if (seg === "SEG-EXEC") return M.exec;
    if (seg === "SEG-PROFESSIONAL") return M.professional;
    if (seg === "SEG-REINVENTION") return M.reinvention;
    if (seg === "SEG-PUBLIC") return M.public;
    return M.exec;
  }
  // woman
  if (seg === "SEG-FOUNDER") return F.founder;
  if (seg === "SEG-REINVENTION") return F.reinvention;
  if (taste === "TASTE-DISTINCTIVE") return F.creative;
  if (seg === "SEG-PUBLIC") return F.rising;
  if (seg === "SEG-EXEC") return cur === "CUR-INTERCHANGEABLE" || pain === "PAIN-INVISIBLE" ? F.elegant : F.rising;
  if (seg === "SEG-PROFESSIONAL") return F.elegant;
  if (seg === "SEG-HOMEMAKER") return F.rising; // homemaker leans elegance/social presence
  return F.elegant;
}

/* ---------- Body Shape: Q4 (mirror) provisional, Q5 (weight) confirms/corrects ----------
   Per spec: WD-EVEN holds the mirror answer; on the ambiguous RECTANGLE, the
   weight signal resolves it (LOWER->Triangle, UPPER->Inverted, MIDDLE->Oval). */
const SHAPE_NAME: Record<string, string> = {
  "BS-HOURGLASS": "Hourglass", "BS-RECTANGLE": "Rectangle", "BS-TRIANGLE": "Triangle",
  "BS-INVERTED": "Inverted Triangle", "BS-OVAL": "Oval",
};
const WD_SHAPE: Record<string, string> = { "WD-LOWER": "BS-TRIANGLE", "WD-UPPER": "BS-INVERTED", "WD-MIDDLE": "BS-OVAL" };

function bodyShape(a: Answers): string {
  let bs = a.q4;
  if (a.q5 && a.q5 !== "WD-EVEN" && bs === "BS-RECTANGLE" && WD_SHAPE[a.q5]) bs = WD_SHAPE[a.q5];
  return SHAPE_NAME[bs] ?? "—";
}

export type Intake = { gender: Gender; age?: string; height?: string; topSize?: string; waist?: string };
export type Answers = Record<string, string>; // questionId -> tag

export type QuizResult = {
  presenceScore: number;
  band: string;
  currentType: string;
  goalType: string;
  goalTagline: string;
  bodyShape: string;
  segment: string;
  intake: Intake;
  tags: Answers;
};

export function scoreQuiz(intake: Intake, a: Answers): QuizResult {
  const { score, band } = presenceScore(a);
  const goal = goalArchetype(intake.gender, a);
  return {
    presenceScore: score,
    band,
    currentType: CURRENT_TYPE[a.q3] ?? "—",
    goalType: goal.name,
    goalTagline: goal.tagline,
    bodyShape: bodyShape(a),
    segment: a.q1 ?? "—",
    intake,
    tags: a,
  };
}
