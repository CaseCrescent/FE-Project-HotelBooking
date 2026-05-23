import type { ReactNode } from "react";

// Diagonal gold-light sweep that crosses the card on hover.
// Pure CSS: a positioned overlay with a linear-gradient + translateX transition.
// No JS, no per-frame work — the wrapper just establishes the hover group and the
// overlay does the animation. Respects prefers-reduced-motion via globals.css
// (the @media block already kills transitions on shimmer-overlay; this is similar.)
//
// Visual: subtle 70%-translucent gold-light band, ~30% width, slides diagonally
// from top-left to bottom-right in 800ms. The hover region is the wrapper itself,
// so the sweep fires once per pointer-enter and resets on leave.
export default function CardShine({
  children,
  className = "",
  intensity = 0.18,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number; // 0–1 alpha of the gold band
}) {
  return (
    <div
      className={`group/shine relative isolate overflow-hidden rounded-2xl ${className}`}
    >
      {children}
      {/* Sweep overlay — sits above content, ignores pointer events.
          Fires on hover AND keyboard focus-within so tabbing through cards still feels alive.
          motion-reduce variant kills the transition for users who prefer reduced motion. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full opacity-0 group-hover/shine:translate-x-full group-hover/shine:opacity-100 group-focus-within/shine:translate-x-full group-focus-within/shine:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.22,0.9,0.32,1)] motion-reduce:transition-none motion-reduce:opacity-0 will-change-transform"
        style={{
          background: `linear-gradient(115deg, transparent 35%, rgba(245,215,142,${intensity}) 50%, transparent 65%)`,
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
