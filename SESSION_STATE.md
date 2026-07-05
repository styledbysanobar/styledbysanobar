# sanobar-quiz · Session State (resume point)
### Updated 2026-06-30. Load this first to resume the BUILD.

## What this is
Sanobar Samir's premium styling quiz funnel, **"The Instant Image Upgrade."** Next.js 14 (App Router) at
`/workspace/sanobar-quiz`. Flow: **entry page** (`app/page.tsx`) -> **7-question quiz** (`/quiz`) -> **result page**
(`/result`, Model B: diagnosis SHOWN, prescription GATED behind a free call).
Run: `npm install && npm run dev` (NEVER self-run a dev server; Atul previews). Typecheck after every edit:
`cd /workspace/sanobar-quiz && npx tsc --noEmit` (must stay exit 0).
Audience: **BOTH men and women** (founders / execs / HNIs + homemakers). All copy is gender-inclusive (the quiz forks).

## Process (how we work this funnel) — UNCHANGED, still in force
- ALL persuasive copy goes THROUGH the `no-brainer` subagent (analyse + write/audit). Brief it with ONLY Atul's
  stated rules + source facts, NO invented constraints; apply its output VERBATIM; flag concerns, never silently edit.
  (See memory `feedback_dont_cage_the_agent`.)
- Section visual structure goes THROUGH the `shape` subagent; the `frontend-design` skill sets the aesthetic bar.
- Atul reacts on the live page; iterate fast, make design changes decisively (don't present option menus mid-iteration).

## Design direction (LOCKED)
- Concept: **"The Atelier Fitting, staged as a magazine cover."** Fashion-editorial, NOT a sales funnel. Persuasion
  via type scale, hairline rules, negative space. **Edge-everywhere: square frames, corner ticks, straight rules, near-
  zero border-radius. No circles/rounded boxes** (decided this session for the hanger/icon question).
- Palette (LOCKED): `--oxblood #260000` + `--cream #F0E5D8`, `--stage #180000` (deepest dark, the quiz ground). FLAT,
  **NO GRADIENTS ever**. A golden accent `#B8893E` is used sparingly (the "What you already have" bar + the reads accent).
- Type (LOCKED, luxury-house model): `--f-brand` = **Bodoni Moda**, masthead wordmark ONLY. `--f-display`/`--f-body`/
  `--f-mono` ALL = **Jost** (one geometric sans; hierarchy from case + tracking + weight + scale). Loaded via Google
  Fonts `<link>` in `app/layout.tsx`. Italics OFF. **NO em dashes anywhere** (reader copy AND ideally comments).
- CASE RULE: eyebrows + labels + SHORT titles + card titles + archetype names = UPPERCASE tracked; LONG descriptive
  headlines = SENTENCE case (`.h-sentence` modifier / SecHead `sentence` prop).
- LANGUAGE BAR (hard): plain, conversational, **Indian-premium not American-luxury**. A 28-year-old Indian founder must
  get every line on first read, on mobile. No metaphor, no literary/abstract phrasing, no invented jargon. Premium =
  clarity + restraint, not complexity. Kill phrases like "the room reads you as", "how you come across", "on sight".

## POSITIONING (LOCKED this session) — important
- Sanobar is a **personal STYLIST today** (NOT an "image strategist" yet). The funnel **SELLS STYLING, framed for the
  PERCEPTION outcome.** Mechanism = personal styling; outcome = being seen at the level of the success you already built.
  Lead with the outcome, deliver via styling. Do not over-abstract; own "stylist".
- **Brand hierarchy every section reinforces:** Belief = "you already built the success" -> Problem = your image hasn't
  caught up -> Mechanism = personal styling -> Method = The Instant Image Upgrade -> Outcome = Presence.
- **Central brand line (protect, never weaken):** "You already did the hard part" / "You already built the success."
- **Proprietary vocabulary (kept PLAIN):** Presence Score, Presence Consultation, Presence Blueprint. Deliberately did
  NOT coin abstract terms ("Presence Architecture" etc.) or "Presence Principles" (the word "principles" was on the
  plain-language avoid-list).
- HNI premium: no "free" in headlines (microcopy only); lead authority with celebrity-but-UNDERSTATED.

## Honesty tiering (Bollywood rule)
Tier-1 "dressed/styled" only: Rajkummar Rao, Parineeti Chopra, Priyamani, Sharvari Wagh, Jyothi Yarraji. Campaign films
(Head Stylist / Creative Head): Parachute, Kotak Mahindra, Oppo, American Tourister, Santoor. NEVER claim she "styled"
Gangubai/Mimi stars (costume craft only). Authority line on the result page is deliberately unnumbered until Sanobar
confirms real figures (`[CONFIRM SANOBAR]` flag in place).

## SCORING ENGINE — HARSH, RE-TUNED THIS SESSION (app/quiz/quizData.ts)
- **`presenceScore()` = base 62 minus NAMED deductions, clamped 22-48.** HARSH BY DESIGN: the ceiling is held BELOW 50
  on purpose (`Math.min(48, ...)`), so NO ONE reads "already fine, just a tweak". Even the best answers top out at 48.
- Deductions: `PAIN_DEDUCT` (Q2) + `CUR_DEDUCT` (Q3) + 5 (low-effort current + high goal gap) + 5 (shape by guesswork).
  Deduct range ~14-44 -> scores ~22-48. Anchor: CUR-CASUAL + PAIN-TRANSLATION + gap + guesswork = 34 deduct -> 28.
- **Bands (re-tuned to the new range):** Capable Gap <=32 / Near Miss 33-41 / Final Polish 42-48.
- Goal Image Type = archetype by SEGMENT per gender; Body Shape = Q4 mirror corrected by Q5 weight on Rectangle.
- The "current==goal -> Final Polish" edge rule still not implemented; sizes captured (now REQUIRED) but not yet used
  in shape refinement.

## THE QUIZ — REDESIGNED "THE ATELIER FITTING" (app/quiz/Quiz.tsx + the `/quiz` CSS block)
Floating Typeform card REPLACED by fixed editorial chrome on the `--stage` dark ground:
- **Masthead** (top, persistent): Bodoni "Sanobar Samir" wordmark + "THE INSTANT IMAGE UPGRADE" program line; its base
  hairline is the **progress fill** (`--prog`, scaleX = step/7).
- **Footer rail** (bottom, persistent): Back link (`.quiz-back--ghost` hidden on intake/handoff) + the **dossier index**
  (`Q.0X / 07` + a 7-tick rail, passed ticks lit, current tick taller).
- **Centre column** swaps per step with `quizRise`/`quizLeave` CSS motion (keyed remount).
- The fixed hairline "mirror-frame" border that wrapped the viewport was ADDED then **REMOVED** (it overlapped the
  masthead/rail and looked bad).
- **Intake (step 0)** = a numbered **consultation ledger** (`.intake-row`, ordinal + mono label): 01 **You are**
  (A man / A woman) · 02 Age · 03 Height · 04 Top size · 05 Waist. **ALL FIELDS NOW REQUIRED** (no "Optional" tags;
  "Begin the fitting" button disabled until gender+age+height+top+waist all set). Chips are near-square (2px radius),
  fill cream only when chosen. CTA inverts on hover like the entry page.
- **Questions (1-7)** = hairline-divided **ledger options** with a **RADIO single-select dot** on the left (role=
  radiogroup / role=radio / aria-checked) so it's unmistakably pick-one. Hover lights the left edge; auto-advance ~360ms.
- **Q3** all 5 options now carry gendered examples (`subMan`/`subWoman`). **Q4 (body shape)** = a grid of framed
  **silhouette plates** (`.quiz-plates`/`.quiz-sil`: hairline frame + corner ticks + mono shape-name caption). Real
  silhouette art is PENDING (ships as honest placeholder).
- **Handoff** = the score **"developing"** (`.quiz-develop`: a ghosted numeral wipes up + a hairline draws) for ~1.3s,
  then routes to `/result`. Reduced-motion routes instantly. All motion CSS-only, reduced-motion gated, fail-open.

## THE RESULT PAGE — FULLY REWRITTEN (copy ×4 rounds) + RESTRUCTURED (SHAPE) + EDITORIAL-REFINED
Files: `app/result/Result.tsx` (sections + inline copy), `app/result/resultData.ts` (variant libraries + `buildView`),
`app/result/page.tsx` (server wrapper). CSS in the `/result` block of `public/styles.css`.

**Copy journey (all via NO-BRAINER, applied verbatim):**
1. Conversion rebuild to the ChatGPT brief: stopped the page resolving curiosity early / leaking the prescription;
   leads with the harsh score; Model B gate held; emotional progression curiosity->validation->diagnosis->identity->
   escalation->hope->authority->consultation.
2. Strategic polish: elevated deliverables to perception outcomes; added the personalized "reads"; added the cost beat;
   removed "a consultation, not a sales call"; adopted the Presence vocabulary; story-continuing CTA.
3. Language polish: simpler/warmer Indian-premium, ~16-18% shorter, banned-word list enforced.
4. Targeted moments: tighter hero twist (open loop), more human cost line, stronger peak ending, more valuable
   consultation sub, outcome-first bullets, "Instant Image Upgrade" defined on first mention, finale line chosen from
   10 options -> **"You already built the success. Now let your image tell the same story."**

**Section order (LOCKED — do not reorder):** [1] Score reveal (dark) · [01] Two versions of you · [02] Perception gap ·
[03] Proof it's possible · [04] Client results · [PEAK] "You already built the success" (dark) · [05] The turn ·
[06] Your Presence Consultation · [09] Finale CTA (dark).

**Structural pass (SHAPE) + editorial refinement applied:**
- **Gauge:** a plain **0-100 bar** (not a zoomed range), fill to score + "You" marker, so a sub-50 score reads visibly
  low. A **"Where most successful people land" RANGE (25-50)** is a bracket floating ABOVE the bar (end ticks ~19px up,
  clear of the glowing dot), label captioned on top. Marker is the original glowing double-halo dot (kept by request).
- **[01] cards** rebuilt as a matched **two-beat** before/after: left "How people see you today" + right "How you should
  be seen". Both render eyebrow + name + Beat 1 (`r-type-tag`) + Beat 2 (`r-type-body`) with a SINGLE line-space gap
  (the old `margin:auto` bottom-push that caused "two line spaces" was removed). Left Beat 2 = fixed "Nothing you wear
  is wrong. It simply doesn't ..." (5 variants). Right Beat 1 = crisp per-archetype tagline ("The one who ..."); right
  Beat 2 = fixed `GOAL_FORWARD` = "Dressed in a way that makes your presence clear from the moment you walk in."
- **"What you already have"** line = a quiet golden left-accent bar (no box) + uppercase golden bold label + normal text.
  (Iterated: box was "overpowering", icon-in-square-box rejected, landed on the accent bar.)
- **[02] perception gap editorial refinement:** Today vs Should-Be cards kept, with deliberate spacing + ONE elegant
  full-height vertical divider (quiet "the gap" label set on it). The personalized **reads** are now **editorial stylist
  notes** (display face, generous whitespace, NO box/border/bullets — the earlier bordered/golden box was removed). The
  **blame paragraph** is the emotional hero (wider 30ch, line-height 1.5, big air above+below). The **cost** is broken
  into a quiet lead + 3 short editorial statements (split by a tiny centred hairline) + a quiet close (`.r-cost*`). The
  **turn** is lifted into the display face with big breathing room as the optimistic close.
- **[03] proof:** body-shape silhouette is a framed plate (corner ticks + caption + "plate pending"); the actor pairing
  is two SAME-shape plates ("You" = actor) with an "=" token (no licensed portrait needed — honest placeholder).
- **[PEAK]** "You already built the success" got its OWN distinct dark treatment (deepest `--stage`, left-set, one
  hairline, larger/lighter non-uppercase headline) so it no longer looks identical to the finale.
- **[06] costs** dissolved from a clinical Money/Time/Effort/Risk grid into 4 calm inline reassurance lines (`.r-assure`).

## LOGOS (AS SEEN ON / result authority) — partially real now
- Real SVGs FETCHED this session (via WebFetch returning SVG source; curl/DNS is blocked in this env): saved at
  `public/images/logos/kotak.svg` + `american-tourister.svg` (both validated well-formed). **OPPO, SANTOOR, PARACHUTE
  still PENDING** (Oppo has a clean Wikimedia SVG, fetch the same way; Santoor/Parachute have no clean source).
- Entry page (`app/page.tsx`): server-side `logoSrc()` does an `fs.existsSync` check and renders `<img>` if a logo file
  exists, else falls back to the mono wordmark, so the strip never breaks. Logos rendered grayscale @ ~72% opacity,
  full colour on hover (`.seen-logo-img`).

## ENTRY PAGE (app/page.tsx) — current state
6 sections, all CENTER-ALIGNED (Sections 3 & 4 use the `band-c` modifier; the about/colophon stays two-column under a
centered header). All copy ran through the NO-BRAINER Indian-reader audit (jargon stripped, "give off"/"the room"/etc.
killed). Hero kicker "You earned your success. People still can't see it on you." Locked headlines on S1/S2/S3/S4/footer
(see git/file). Honesty-tiered names. "40+ campaigns" appears twice (still to be confirmed by Sanobar).

## OPEN ITEMS — real assets Sanobar must supply (cannot be invented; all flagged in-page)
1. **5 body-shape silhouette line SVGs** (Triangle/Hourglass/Rectangle/Inverted/Oval; oxblood/cream line, 3:4,
   `currentColor`). ONE set lights up BOTH the quiz plates AND the result silhouette + pairing plates.
2. **Remaining logos:** oppo.svg, santoor.svg, parachute.svg into `public/images/logos/` (drop file or paste SVG source).
3. At least **one real client video** with a caption proving a BEFORE/AFTER perception shift (not "I liked the styling").
4. **Real weekly capacity number** for the finale scarcity line (currently "only a few each week"). Atul was undecided;
   recommendation on file = 5/week, tied to her real calendar (must be honoured to stay credible).
5. **Calendly link** (`BOOK_HREF = "#book"` in Result.tsx).
6. `[CONFIRM SANOBAR]` real experience years / campaign-film count for the authority line (else stays unnumbered).
7. **B&W imagery** for the entry page: landscape cover (3:2) + colophon portrait (4:5) into `public/images/`.
8. Confirm the **"40+ campaign films"** figure (entry page, twice).

## KNOWN OPEN COPY/DESIGN NOTES (flagged, not yet actioned)
- Hero **"90" twist**: "People who score 90 ..." implies a 90 is reachable while the quiz caps at 48. It's coherent as
  the post-work target, but flagged for Atul to decide (clarify, or change the number). NOT changed.
- Optional: shorten the [02] card eyebrows to literal "Today" / "Should be" for an even faster read (Atul to decide).
- Minor: stale/unused CSS may remain in styles.css (e.g. old `.flow`/`.ledger`); harmless, sweep if tidying.
