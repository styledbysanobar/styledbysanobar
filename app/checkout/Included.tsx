"use client";

import { useEffect, useState } from "react";

/* The "What's included" ledger.

   On a phone it is a collapsed disclosure: the selling is already done on the
   landing page, so this is here to answer a doubt, not to re-pitch, and every
   line it costs is a line between the reader and the button.

   On desktop the ledger sits in the left column beside the form, where there is
   room for it, so it is always open and the control furniture disappears: no
   chevron, no pointer cursor, nothing to click.

   Why JavaScript rather than a media query: <details> hides its own children
   through UA behaviour that CSS cannot reliably override across engines, so the
   `open` attribute itself has to be driven. It renders closed on the server and
   opens on hydration, which is one frame on desktop and correct on mobile. */

const DESKTOP = "(min-width: 900px)";

type Item = { n: string; t: string; d: string };

export default function Included({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const apply = () => {
      setLocked(mq.matches);
      setOpen(mq.matches);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <details className={`co-inc${locked ? " is-locked" : ""}`} open={open}>
      {/* The offer name lives here rather than on a heading line of its own.
          Someone who clicked through on "Celebrity Image Audit" needs to see it
          once or the page flickers as the wrong destination, and the button
          label does not carry it. Costs no extra line. */}
      <summary
        className="co-inc-sum"
        onClick={(e) => {
          /* on desktop the panel is not a control, so the click does nothing */
          if (locked) {
            e.preventDefault();
            return;
          }
          e.preventDefault();
          setOpen((o) => !o);
        }}
      >
        <span className="co-sec-lbl">
          <svg
            className="co-sec-ic"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 12v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9" />
            <path d="M2.6 7.6h18.8v4.4H2.6z" />
            <path d="M12 7.6V22" />
            <path d="M12 7.6H7.6a2.5 2.5 0 0 1 0-5C11 2.6 12 7.6 12 7.6z" />
            <path d="M12 7.6h4.4a2.5 2.5 0 0 0 0-5C13 2.6 12 7.6 12 7.6z" />
          </svg>
          What&rsquo;s included in your Celebrity Image Audit
        </span>
        <svg
          className="co-inc-chev"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>

      <ol className="co-included">
        {items.map((i) => (
          <li className="co-included-row" key={i.n}>
            <span className="co-included-n">{i.n}</span>
            <span className="co-included-body">
              <span className="co-included-t">{i.t}</span>
              <span className="co-included-d">{i.d}</span>
            </span>
          </li>
        ))}
      </ol>
    </details>
  );
}
