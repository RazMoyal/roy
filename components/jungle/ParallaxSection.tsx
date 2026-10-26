"use client";

import { useEffect, useRef } from "react";

type ParallaxSectionProps = React.ComponentProps<"section"> & {
  /**
   * "top" (default): --parallax counts px scrolled past the section's top,
   * for a section that starts at the top of the page. "center": px between
   * the section's center and the viewport's, negative while it is below —
   * for sections further down the page.
   */
  origin?: "top" | "center";
};

/**
 * A <section> that exposes its scroll position as the CSS variable
 * --parallax (in px). Layers inside move by `var(--parallax) * var(--depth)`
 * (see .parallax-layer in globals.css). Updates are batched per animation
 * frame and skipped while off-screen or when the visitor prefers reduced
 * motion.
 */
export function ParallaxSection({ origin = "top", ...props }: ParallaxSectionProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const value =
        origin === "top"
          ? Math.max(0, -rect.top)
          : window.innerHeight / 2 - (rect.top + rect.height / 2);
      el.style.setProperty("--parallax", `${Math.round(value)}px`);
    };
    const onScroll = () => {
      if (!frame && !reduced.matches) frame = requestAnimationFrame(update);
    };

    if (!reduced.matches) update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [origin]);

  return <section ref={ref} {...props} />;
}
