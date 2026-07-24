"use client";

import { useCallback, useEffect, useState } from "react";

/* The testimonial wall: two rows of poster cards scrolling in opposite
   directions, each opening its clip in a lightbox.

   The posters are NOT raw video frames. They are designed 4:3 cards, already on
   brand (oxblood, gold, the display serif) and each already carries its own
   title and a drawn play button. So the card here stays deliberately quiet: a
   hairline mat and a hover lift, and no second play button overlaid on top of
   the one in the artwork. The poster IS the exhibit (R7). */

const R2 = "https://pub-60b8d4c073fc4c4fa8d2e1cdcb1dba92.r2.dev";

/* Poster file and video file share the same id by convention:
   /images/testimonials/opt/<id>.webp  ->  <R2>/<id>.MP4 */
const CLIPS: string[] = [
  "IMG_9796", "IMG_9806", "IMG_9808", "IMG_9824", "IMG_9828", "IMG_9831",
  "IMG_9833", "IMG_9835", "IMG_9865", "IMG_9866", "IMG_9900", "IMG_9928",
  "IMG_9929", "IMG_9939", "IMG_9954", "IMG_9990", "IMG_9993", "IMG_9995",
  "IMG_9996", "IMG_9997", "IMG_9998", "IMG_9999",
];

/* Each poster is built on a background colour, and two of the same colour must
   never sit side by side in a row. Anything not listed here has no dominant
   colour and can go anywhere, so those act as natural separators. */
const COLOUR: Record<string, string> = {};
(
  [
    ["yellow", ["9808", "9831", "9900", "9929", "9939", "9866", "9998"]],
    ["red", ["9928", "9995", "9997"]],
    ["blue", ["9996", "9833", "9796"]],
    ["sky", ["9806", "9954", "9865"]],
  ] as [string, string[]][]
).forEach(([c, ids]) => ids.forEach((i) => (COLOUR[`IMG_${i}`] = c)));

/* Deal the clips into two rows, alternating which row each colour group starts
   with so both rows stay level AND no single row inherits most of one colour.
   Yellow is the tight one at seven of twenty-two. */
function deal(): [string[], string[]] {
  const rows: [string[], string[]] = [[], []];
  let start = 0;
  ["yellow", "red", "blue", "sky"].forEach((c) => {
    CLIPS.filter((id) => COLOUR[id] === c).forEach((id, n) => rows[(start + n) % 2].push(id));
    start ^= 1;
  });
  CLIPS.filter((id) => !COLOUR[id]).forEach((id, n) => rows[n % 2].push(id));
  return rows;
}

/* Order a row so no two same-colour cards touch. The row is treated as CIRCULAR
   because the marquee loops: the last card sits next to the first one, and a
   clash there is just as visible as one in the middle.
   Greedy, always placing the colour with the most left to place, which is what
   keeps yellow from bunching up at one end. */
function arrange(items: string[]): string[] {
  const pool = [...items];
  const out: string[] = [];
  let prev: string | undefined;
  while (pool.length) {
    const count: Record<string, number> = {};
    pool.forEach((x) => {
      const k = COLOUR[x] ?? `_free_${x}`;
      count[k] = (count[k] ?? 0) + 1;
    });
    let cands = pool.filter((x) => !COLOUR[x] || COLOUR[x] !== prev);
    if (!cands.length) cands = [...pool];
    /* the final card must also differ from the first one (the wrap) */
    if (pool.length === 1 && COLOUR[pool[0]] && COLOUR[pool[0]] === COLOUR[out[0]]) {
      for (let k = out.length - 2; k > 0; k--) {
        const nxt = k + 1 < out.length ? out[k + 1] : out[0];
        if (COLOUR[out[k]] !== COLOUR[pool[0]] && COLOUR[out[k - 1]] !== COLOUR[pool[0]] &&
            COLOUR[nxt] !== COLOUR[pool[0]]) {
          out.splice(k, 0, pool.pop() as string);
          return out;
        }
      }
    }
    const pick = cands.reduce((best, x) => {
      const kx = COLOUR[x] ?? `_free_${x}`;
      const kb = COLOUR[best] ?? `_free_${best}`;
      if (count[kx] !== count[kb]) return count[kx] > count[kb] ? x : best;
      return x > best ? x : best; // deterministic tie-break, so SSR and client agree
    }, cands[0]);
    out.push(pick);
    pool.splice(pool.indexOf(pick), 1);
    prev = COLOUR[pick];
  }
  return out;
}

const [DEALT_A, DEALT_B] = deal();
const ROW_A = arrange(DEALT_A);
const ROW_B = arrange(DEALT_B);

function Card({ id, onOpen }: { id: string; onOpen: (id: string) => void }) {
  return (
    <button type="button" className="tw-card" onClick={() => onOpen(id)}
            aria-label="Play this consultation clip">
      <img
        className="tw-card-img"
        src={`/images/testimonials/opt/${id}.webp`}
        alt=""
        loading="lazy"
        decoding="async"
        width={720}
        height={540}
      />
      <span className="tw-card-scrim" aria-hidden="true" />
      <span className="tw-play" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.2v13.6L19 12z" /></svg>
      </span>
      <span className="tw-card-ring" aria-hidden="true" />
    </button>
  );
}

/* A row is rendered TWICE end to end. The animation travels exactly -50%, so the
   second copy lands where the first began and the loop is seamless with no jump. */
function Row({ ids, dir, onOpen }: { ids: string[]; dir: "l" | "r"; onOpen: (id: string) => void }) {
  return (
    <div className={`tw-row tw-row--${dir}`}>
      <div className="tw-track">
        {[...ids, ...ids].map((id, i) => (
          <Card key={`${id}-${i}`} id={id} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [open, setOpen] = useState<string | null>(null);

  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (!open) return;
    /* scroll-locked while the lightbox is up (R7), restored exactly on close */
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <>
      <div className="tw-wall">
        <Row ids={ROW_A} dir="l" onOpen={setOpen} />
        <Row ids={ROW_B} dir="r" onOpen={setOpen} />
      </div>

      {open && (
        <div className="tw-lightbox" role="dialog" aria-modal="true" onClick={close}>
          <button type="button" className="tw-close" onClick={close} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          {/* stop the click on the player itself from closing the dialog */}
          <div className="tw-player" onClick={(e) => e.stopPropagation()}>
            <video
              key={open}
              className="tw-video"
              src={`${R2}/${open}.MP4`}
              poster={`/images/testimonials/opt/${open}.webp`}
              controls
              autoPlay
              playsInline
              preload="metadata"
            />
          </div>
        </div>
      )}
    </>
  );
}
