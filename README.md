# sanobar-quiz

Entry page for Sanobar Samir's premium styling quiz funnel, **The Instant Image Upgrade**.
Next.js 14 (App Router). Built to the SHAPE design direction: *"The Atelier Fitting,
staged as a magazine cover"*, fashion-editorial, deliberately not a TGO sales funnel.

```bash
npm install
npm run dev        # http://localhost:3000
```

## What's here
- `app/page.tsx` — the entry page, the 9 locked sections in order (copy = Variant A,
  from `/workspace/sanobar-landing-page/landing-page-copy.md`).
- `app/EntryScripts.tsx` — reveals (fail-open) + the fitting-room dim into the quiz.
- `app/quiz/page.tsx` — stub the dim lands on; first real question rises out of the dark.
- `public/styles.css` — the editorial skin (concept, type voices, spine, ledger, motion).

## The design in one line
Persuasion by type scale, rule-work and negative space, not conversion chrome. The one
click is a serif line that **underlines itself**, and clicking it **dims the room** before
the quiz fades up. Protect that signature above all else.

## Type stack (open + loadable now)
Display **Newsreader** · Body **Inter Tight** · Mono **JetBrains Mono**.
Upgrade path: the direction's first choice is **PP Editorial New** (licensed) for the
display/cover line. Drop its `.otf` in `public/fonts`, add an `@font-face`, and point
`--f-display` at it in `styles.css`. Everything else is built to swap.

## Open items (do not invent, confirm before live)
- **Image slots are wired (placeholders showing now):** two `<Frame>` slots, the cover
  portrait panel (`app/page.tsx`) and the colophon portrait. Each shows an honest labeled
  crop-frame, not a gradient. To fill: drop a B&W file in `public/images/` and pass `src`,
  e.g. `<Frame variant="cover" src="/images/sanobar-cover.jpg" ... />`. The image covers
  the placeholder, nothing else changes. The cover image is hidden on mobile to protect the fold.
- **AS SEEN ON:** currently honest category stand-ins (`AD CAMPAIGNS`, `BRAND FILMS`, ...).
  Swap for cleared monochrome logo SVGs; confirm clearance per the Bollywood-honesty rule.
- **Figures:** confirm "40+ brand campaign films" and "Head Stylist" are accurate.
- **Next build:** the full 7-question quiz (gender fork at intake, scoring) then the
  result page, whose editorial base (black / white / warm off-white, serif + sans) this
  page is already cohesive with.
# styledbysanobar
