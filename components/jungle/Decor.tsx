import { LineLeaf } from "@/components/jungle/foliage";

type Side = "start" | "end";

type SectionLeavesProps = {
  /** Which side gets the larger sprig; the other gets a smaller one. */
  side?: Side;
};

/**
 * Faint gold line-art sprigs at the edges of a content section, drifting
 * slightly against the scroll. Place inside a ParallaxSection with
 * origin="center".
 */
export function SectionLeaves({ side = "start" }: SectionLeavesProps) {
  const big = side === "start" ? "right-0" : "left-0";
  const small = side === "start" ? "left-0" : "right-0";
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className={`parallax-layer absolute top-10 ${big} w-[min(38vw,300px)] opacity-35 sm:opacity-45`}
        style={{ "--depth": "-0.12" } as React.CSSProperties}
      >
        <div
          className={`sway ${side === "start" ? "origin-top-right" : "origin-top-left"}`}
          style={{ "--sway-duration": "14s", "--sway-angle": "1.5deg" } as React.CSSProperties}
        >
          <svg viewBox="0 0 300 260" className="h-auto w-full" overflow="visible">
            <g transform={side === "start" ? "" : "translate(300 0) scale(-1 1)"}>
              <path d="M310 -10Q240 60 225 170" fill="none" style={{ stroke: "var(--color-gold)" }} strokeWidth="1" />
              <LineLeaf transform="translate(300 0) rotate(128)" length={200} />
              <LineLeaf transform="translate(262 52) rotate(165)" length={120} />
              <LineLeaf transform="translate(244 96) rotate(112)" length={130} />
            </g>
          </svg>
        </div>
      </div>
      <div
        className={`parallax-layer absolute bottom-6 ${small} w-[min(26vw,190px)] opacity-25 max-sm:hidden`}
        style={{ "--depth": "0.1" } as React.CSSProperties}
      >
        <svg viewBox="0 0 200 200" className="h-auto w-full" overflow="visible">
          <g transform={side === "start" ? "" : "translate(200 0) scale(-1 1)"}>
            <LineLeaf transform="translate(-10 210) rotate(-55)" length={170} />
            <LineLeaf transform="translate(-10 205) rotate(-22)" length={110} />
          </g>
        </svg>
      </div>
    </div>
  );
}
