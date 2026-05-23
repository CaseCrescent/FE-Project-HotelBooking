"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { HOUSE_EASE } from "@/lib/animations";

interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

const STATS: Stat[] = [
  { value: 30, suffix: "+", label: "Partner hotels" },
  { value: 25, suffix: "s", label: "Live availability refresh" },
  { value: 3, suffix: " nights", label: "Max booking length" },
  { value: 100, suffix: "%", label: "Free cancellation" },
];

function AnimatedNumber({ to, durationMs = 1100 }: { to: number; durationMs?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, durationMs]);

  return <span ref={ref}>{n}</span>;
}

export default function StatStrip() {
  return (
    <section className="relative max-w-[1200px] mx-auto px-6 md:px-10 lg:px-12 py-14 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: HOUSE_EASE }}
        className="glass-card p-6 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6"
      >
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col items-start gap-2">
            <div className="text-[#dcb771] font-bold text-3xl md:text-5xl leading-none tracking-tight tabular-nums">
              {s.prefix}
              <AnimatedNumber to={s.value} />
              {s.suffix}
            </div>
            <div className="text-white/55 text-[11px] md:text-xs uppercase tracking-[0.18em]">
              {s.label}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
