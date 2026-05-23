"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { sectionReveal, VIEW_ONCE, REDUCED_MOTION_FALLBACK } from "@/lib/animations";

// Drop-in scroll-reveal wrapper for body sections.
// Replaces the ad-hoc <motion.div initial=... whileInView=...> we'd otherwise repeat 20+ times.
export default function RevealSection({
  children,
  className,
  as = "section",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "article" | "header" | "footer";
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const variants = reduce ? REDUCED_MOTION_FALLBACK : sectionReveal;
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={VIEW_ONCE}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </MotionTag>
  );
}
