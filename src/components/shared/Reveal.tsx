"use client";
import { motion, type Variants } from "framer-motion";
import { reveal, stagger, VIEW_ONCE } from "@/lib/animations";
import type { ReactNode } from "react";

// One-shot scroll-reveal wrapper. Children that should stagger use <Reveal.Item>.
export function Reveal({
  children,
  variants,
  className,
  as = "div",
}: {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "ul";
}) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      variants={variants ?? stagger}
      initial="hidden"
      whileInView="show"
      viewport={VIEW_ONCE}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  variants,
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}) {
  return (
    <motion.div className={className} variants={variants ?? reveal}>
      {children}
    </motion.div>
  );
}
