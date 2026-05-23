"use client";
import { motion, useScroll, useSpring } from "framer-motion";

// Thin gold bar that tracks how far the user has scrolled the page.
// Lives at top:0 with z-index 998 — the existing RouteProgress (z:999) briefly covers
// it during navigation, which is fine: navigation progress takes priority when active.
//
// Smoothed with useSpring so the bar glides instead of jittering at every scroll event.
// useSpring already snaps to its target instantly under prefers-reduced-motion (the
// bar still tracks scroll position — it just doesn't animate the transition between
// values), so no explicit reduced-motion guard is needed here.
export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.3,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{
        scaleX,
        transformOrigin: "0% 50%",
        background: "linear-gradient(90deg, #f5d78e, #dcb771, #c5a059)",
        boxShadow: "0 0 8px rgba(220, 183, 113, 0.45)",
      }}
      className="fixed top-0 left-0 right-0 h-[2px] z-[998] pointer-events-none"
    />
  );
}
