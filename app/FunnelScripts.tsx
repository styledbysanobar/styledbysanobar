"use client";

import { useEffect } from "react";

/* High-ticket single-page funnel: reveal-on-scroll (fail-open) + a sticky book
   bar that appears once the hero is scrolled past and hides again at the finale
   so it never doubles a visible CTA. Pure progressive enhancement: with JS off,
   all content is visible and the sticky bar simply never shows. */
export default function FunnelScripts() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.classList.add("js");

    // reveal-on-scroll
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window && !reduce) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io?.unobserve(e.target);
            }
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
      );
      targets.forEach((t) => io!.observe(t));
    } else {
      targets.forEach((t) => t.classList.add("in"));
    }

    /* count-up on the stat rail (C7: count-ups reward arrival).
       Reads the number out of the existing markup, so "10+" keeps its plus and
       nothing has to be duplicated in a data attribute. Eases out so it
       decelerates into the final figure rather than stopping dead. */
    let statIo: IntersectionObserver | null = null;
    const frames: number[] = [];
    if (!reduce && "IntersectionObserver" in window) {
      statIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            const el = e.target as HTMLElement;
            statIo?.unobserve(el);
            const raw = el.textContent ?? "";
            const m = raw.match(/\d+/);
            if (!m) return;
            const target = Number(m[0]);
            const at = raw.indexOf(m[0]);
            const prefix = raw.slice(0, at);
            const suffix = raw.slice(at + m[0].length);
            const started = performance.now();
            const tick = (now: number) => {
              const p = Math.min(1, (now - started) / 1100);
              const eased = 1 - Math.pow(1 - p, 3);
              el.textContent = prefix + Math.round(target * eased) + suffix;
              if (p < 1) frames.push(requestAnimationFrame(tick));
            };
            frames.push(requestAnimationFrame(tick));
          });
        },
        { threshold: 0.5 }
      );
      document.querySelectorAll<HTMLElement>(".hi-stat-n").forEach((n) => statIo!.observe(n));
    }

    // sticky book bar: on between the hero sentinel and the finale sentinel
    const bar = document.querySelector<HTMLElement>(".hi-sticky");
    const heroEnd = document.querySelector<HTMLElement>("[data-sticky-start]");
    const finale = document.querySelector<HTMLElement>("[data-sticky-stop]");
    let past = false;
    let atEnd = false;
    const sync = () => {
      if (!bar) return;
      bar.classList.toggle("is-on", past && !atEnd);
    };
    let heroIo: IntersectionObserver | null = null;
    let endIo: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window && bar) {
      if (heroEnd) {
        heroIo = new IntersectionObserver(
          ([e]) => { past = !e.isIntersecting && e.boundingClientRect.top < 0; sync(); },
          { threshold: 0 }
        );
        heroIo.observe(heroEnd);
      }
      if (finale) {
        endIo = new IntersectionObserver(
          ([e]) => { atEnd = e.isIntersecting; sync(); },
          { rootMargin: "0px 0px -40% 0px" }
        );
        endIo.observe(finale);
      }
    }

    return () => {
      io?.disconnect();
      heroIo?.disconnect();
      endIo?.disconnect();
      statIo?.disconnect();
      frames.forEach((f) => cancelAnimationFrame(f));
    };
  }, []);

  return null;
}
