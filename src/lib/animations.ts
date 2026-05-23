// Centralized animation tokens — every page imports these.
// Don't inline cubic-bezier arrays in components; reuse HOUSE_EASE.
import type { Variants, Transition } from "framer-motion";

export const HOUSE_EASE: [number, number, number, number] = [0.22, 0.9, 0.32, 1];

export const VIEW_ONCE = { once: true, amount: 0.2 } as const;

export const pageEnter: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: HOUSE_EASE } },
};

export const reveal: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: HOUSE_EASE } },
};

export const revealFromLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: HOUSE_EASE } },
};

export const stagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

export const staggerFast: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04 },
  },
};

export const HOVER_LIFT: Transition = { type: "spring", stiffness: 270, damping: 22 };

export const FLOAT: Variants = {
  hidden: { y: 0 },
  show: {
    y: [0, -8, 0],
    transition: { duration: 6, repeat: Infinity, ease: HOUSE_EASE },
  },
};

export const SHIMMER_X: Variants = {
  hidden: { x: "-15%" },
  show: {
    x: "110%",
    transition: { duration: 6, repeat: Infinity, ease: "linear" },
  },
};

// Cinematic primitives — used by RevealSection / TiltCard / wizard slides.
// GPU-friendly (transform + opacity + filter).
export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: HOUSE_EASE },
  },
};

export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: HOUSE_EASE },
  },
};

// Wizard step transitions — replaces the old `x: 24 / -24, 0.28s` pattern.
export const slideIn: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: HOUSE_EASE } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.3, ease: HOUSE_EASE } },
};

// When prefers-reduced-motion is on, replace any cinematic variant with this no-op.
export const REDUCED_MOTION_FALLBACK: Variants = {
  hidden: { opacity: 1 },
  show: { opacity: 1 },
};
