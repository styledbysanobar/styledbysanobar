"use client";

import { useEffect, useRef } from "react";

/* Phones: always on (CSS). Desktop: slides in past the hero, away at the finale. */
export default function WeddingSticky({ href, label }: { href: string; label: string }) {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bar.current;
    const start = document.querySelector<HTMLElement>("[data-sticky-start]");
    const stop = document.querySelector<HTMLElement>("[data-sticky-stop]");
    if (!el || !start || !stop || !("IntersectionObserver" in window)) return;
    let past = false;
    let atEnd = false;
    const sync = () => el.classList.toggle("is-on", past && !atEnd);
    const startIo = new IntersectionObserver(([e]) => {
      past = !e.isIntersecting && e.boundingClientRect.top < 0;
      sync();
    });
    const stopIo = new IntersectionObserver(
      ([e]) => {
        atEnd = e.isIntersecting;
        sync();
      },
      { rootMargin: "0px 0px -40% 0px" }
    );
    startIo.observe(start);
    stopIo.observe(stop);
    return () => {
      startIo.disconnect();
      stopIo.disconnect();
    };
  }, []);

  return (
    <div className="wl-sticky" ref={bar}>
      <span className="wl-sticky-scarce">
        <span className="wl-sticky-dot" aria-hidden="true" />
        Only 3 grooms a month
      </span>
      <a className="wl-sticky-btn" href={href}>
        {label}
        <svg viewBox="0 0 28 12" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M1 6h25M21 1.5 26 6l-5 4.5" />
        </svg>
      </a>
    </div>
  );
}
