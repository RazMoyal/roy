"use client";

import { useEffect, useRef } from "react";

let observer: IntersectionObserver | null = null;

/** One observer shared by every Reveal on the page. */
function sharedObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.removeAttribute("data-reveal-pending");
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );
  return observer;
}

type RevealProps = React.ComponentProps<"div"> & {
  /** Stagger in ms, for items revealed together. */
  delay?: number;
};

/**
 * Fades and lifts its content in the first time it scrolls into view
 * (styles: [data-reveal] in globals.css). Content renders visible; only
 * once script runs is anything still below the fold hidden to await its
 * reveal — so a slow or failed script never hides content, and nothing
 * already on screen flickers. Skipped when the visitor prefers reduced
 * motion.
 */
export function Reveal({ delay = 0, style, ...props }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    el.setAttribute("data-reveal-pending", "");
    const o = sharedObserver();
    o.observe(el);
    return () => {
      o.unobserve(el);
      el.removeAttribute("data-reveal-pending");
    };
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      style={{ ...style, "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      {...props}
    />
  );
}
