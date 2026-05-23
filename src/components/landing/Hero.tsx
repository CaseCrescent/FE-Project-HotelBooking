"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { HOUSE_EASE } from "@/lib/animations";

const COVERS = ["/img/cover.jpg", "/img/cover2.jpg", "/img/cover3.jpg", "/img/cover4.jpg"];
const AUTO_CYCLE_MS = 7000;
const WHEEL_DEBOUNCE_MS = 700;
const WHEEL_THRESHOLD = 32;

// Headline tokens — the third is the gold gradient. Edited as a unit so the gradient stays whole.
const HEADLINE: Array<{ text: string; gradient?: boolean }> = [
  { text: "Your" },
  { text: "perfect" },
  { text: "stay", gradient: true },
  { text: "awaits." },
];

const WORD_CONTAINER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const WORD_ITEM: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: HOUSE_EASE },
  },
};

// Time the body content waits before fading in: cover the entire headline stagger.
// 4 words × 0.12 staggerChildren + 0.55 duration + 0.15 delayChildren ≈ 1.18s — clamp to 0.85s
// for a snappier feel (body lands while the last word is still settling).
const BODY_DELAY_S = 0.85;

export default function Hero() {
  const { data: session } = useSession();
  const router = useRouter();
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
  const wheelLockRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-cycle (pauses if reduced motion is on)
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % COVERS.length), AUTO_CYCLE_MS);
    return () => clearInterval(t);
  }, [reduce, index]); // reset interval after manual change for momentum

  const next = () => setIndex((i) => (i + 1) % COVERS.length);
  const prev = () => setIndex((i) => (i - 1 + COVERS.length) % COVERS.length);

  // Click anywhere on the banner → next slide.
  // Skip clicks that originated from an interactive child (buttons, links).
  const handleBannerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("button, a, [data-no-cycle]")) return;
    next();
  };

  // Wheel-scroll over the hero cycles slides. We do NOT preventDefault — letting the
  // page scroll naturally past the hero is more important than scroll-jacking.
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - wheelLockRef.current < WHEEL_DEBOUNCE_MS) return;
    if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
    wheelLockRef.current = now;
    if (e.deltaY > 0) next();
    else prev();
  };

  return (
    <section
      className="relative w-full h-[calc(100vh-64px)] min-h-[560px] max-h-[900px] overflow-hidden cursor-pointer select-none"
      onClick={handleBannerClick}
      onWheel={handleWheel}
      role="button"
      tabIndex={0}
      aria-label="Hero banner. Click or scroll to change image."
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === " ") {
          e.preventDefault();
          next();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          prev();
        }
      }}
    >
      {/* Crossfading + Ken-Burns cover images.
          The active cover slowly scales 1.00 → 1.08 across its full 7s dwell.
          Keying the motion.div on `index` resets the zoom whenever the active slide changes,
          so each appearance starts from neutral instead of jumping. */}
      {COVERS.map((src, i) => {
        const isActive = i === index;
        return (
          <motion.div
            key={src}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 1.4, ease: HOUSE_EASE }}
          >
            <motion.div
              key={isActive ? `active-${index}` : `idle-${i}`}
              className="absolute inset-0"
              initial={{ scale: 1 }}
              animate={{ scale: !reduce && isActive ? 1.08 : 1 }}
              transition={{ duration: isActive ? AUTO_CYCLE_MS / 1000 : 0, ease: "linear" }}
            >
              <Image src={src} alt="" fill priority={i === 0} sizes="100vw" className="object-cover" />
            </motion.div>
          </motion.div>
        );
      })}

      {/* Gradient veils */}
      <div
        className="absolute inset-0 z-10"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, rgba(12,10,22,0.65) 0%, rgba(12,10,22,0.55) 40%, rgba(12,10,22,0.92) 100%)",
        }}
      />
      <div
        className="absolute inset-0 z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at 50% 110%, rgba(220,183,113,0.25), transparent 55%)",
        }}
      />

      {/* Content */}
      <div className="relative z-20 h-full max-w-[1200px] mx-auto px-6 md:px-10 lg:px-12 flex flex-col justify-center pointer-events-none">
        <div className="max-w-[760px] pointer-events-auto" data-no-cycle>
          {mounted && session?.user?.name && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: HOUSE_EASE }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full text-[11px] tracking-[0.25em] uppercase text-gold-light max-w-full"
              style={{
                background: "rgba(12, 10, 22, 0.7)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(220, 183, 113, 0.3)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#dcb771] pulse-gold flex-shrink-0" />
              <span className="truncate">Welcome back, {session.user.name}</span>
            </motion.div>
          )}

          {/* Headline — word-by-word reveal. Static fallback under prefers-reduced-motion
              keeps the entire phrase visible from frame 0 (no flash, no stagger). */}
          {reduce ? (
            <h1 className="text-white font-bold leading-[1.05] tracking-tight text-[44px] sm:text-[56px] md:text-[72px] lg:text-[88px]">
              Your perfect{" "}
              <span className="bg-gradient-to-r from-[#f5d78e] via-[#dcb771] to-[#c5a059] bg-clip-text text-transparent">
                stay
              </span>{" "}
              awaits.
            </h1>
          ) : (
            <motion.h1
              className="text-white font-bold leading-[1.05] tracking-tight text-[44px] sm:text-[56px] md:text-[72px] lg:text-[88px]"
              variants={WORD_CONTAINER}
              initial="hidden"
              animate="show"
              aria-label="Your perfect stay awaits."
            >
              {HEADLINE.map((w, i) => (
                <motion.span
                  key={i}
                  variants={WORD_ITEM}
                  className="inline-block"
                  style={{ marginRight: i < HEADLINE.length - 1 ? "0.25em" : 0, willChange: "transform, opacity" }}
                  aria-hidden
                >
                  {w.gradient ? (
                    <span className="bg-gradient-to-r from-[#f5d78e] via-[#dcb771] to-[#c5a059] bg-clip-text text-transparent">
                      {w.text}
                    </span>
                  ) : (
                    w.text
                  )}
                </motion.span>
              ))}
            </motion.h1>
          )}

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: HOUSE_EASE, delay: reduce ? 0 : BODY_DELAY_S }}
          >
            <p className="mt-6 max-w-[620px] text-white/70 text-base sm:text-lg leading-relaxed">
              A curated booking experience across handpicked partner hotels — real-time availability,
              transparent pricing, and a queue that respects your time.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <motion.button
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/hotel");
                }}
                className="px-8 py-4 rounded-full gradient-gold text-[#1a1730] text-sm font-bold tracking-[0.18em] uppercase shadow-elegant"
              >
                Explore Hotels
              </motion.button>
              <motion.button
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/find");
                }}
                className="px-8 py-4 rounded-full border border-white/30 bg-white/[0.04] text-white text-sm font-semibold tracking-[0.18em] uppercase backdrop-blur-md hover:bg-white/10"
              >
                Find Earliest Room
              </motion.button>
            </div>

            {/* Trust strip */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-white/45 text-xs tracking-widest uppercase">
              <div className="flex items-center gap-2"><span className="text-gold">●</span> Real-time availability</div>
              <div className="flex items-center gap-2"><span className="text-gold">●</span> No hidden fees</div>
              <div className="flex items-center gap-2"><span className="text-gold">●</span> Cancel any time</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* "Tap or scroll" hint — bottom-left, doesn't fight with text */}
      <div className="absolute bottom-10 left-6 md:left-12 hidden md:flex items-center gap-3 z-30 text-white/40 text-[11px] tracking-[0.32em] uppercase pointer-events-none">
        <span className="w-8 h-px bg-white/25" />
        Tap or scroll to change banner
      </div>

      {/* Slide pager — interactive, outside text content */}
      <div className="absolute bottom-10 right-12 hidden md:flex items-center gap-2 z-30" data-no-cycle>
        {COVERS.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setIndex(i);
            }}
            aria-label={`Show cover ${i + 1}`}
            className="group p-1"
          >
            <span
              className={`block h-[3px] rounded-full transition-all duration-500 ${i === index ? "w-10 bg-[#dcb771]" : "w-6 bg-white/30 group-hover:bg-white/60"}`}
            />
          </button>
        ))}
      </div>

      {/* Scroll-down chevron — clickable, animates */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          window.scrollTo({ top: window.innerHeight - 64, behavior: "smooth" });
        }}
        aria-label="Scroll to content"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 text-white/45 hover:text-white text-2xl float-y"
        data-no-cycle
      >
        ⌄
      </button>
    </section>
  );
}
