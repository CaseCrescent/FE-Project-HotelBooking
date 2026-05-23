"use client";
import { motion } from "framer-motion";
import { reveal, stagger, VIEW_ONCE } from "@/lib/animations";

const FEATURES = [
  {
    icon: "⚡",
    title: "Real-time Availability",
    body: "See exactly what's bookable today across every partner hotel. No back-and-forth, no overbooking.",
  },
  {
    icon: "✦",
    title: "Editorial Curation",
    body: "Every hotel goes through a quality review before listing. Boutique, business, beachfront — only the good ones.",
  },
  {
    icon: "❀",
    title: "Frictionless Cancel",
    body: "Plans change. Cancel from your booking page in two clicks — no phone calls, no penalty drama.",
  },
  {
    icon: "✺",
    title: "Confirmation Receipt",
    body: "Every booking ships with a shareable, mobile-friendly receipt. Pass it to reception, family, or HR.",
  },
];

export default function Features() {
  return (
    <section className="relative max-w-[1200px] mx-auto px-6 md:px-10 lg:px-12 py-20 md:py-28">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={VIEW_ONCE}
        className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-start"
      >
        <motion.div variants={reveal} className="lg:sticky lg:top-[80px]">
          <div className="text-[11px] tracking-[0.32em] uppercase text-gold mb-4">Why book here</div>
          <h2 className="text-white text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight">
            Booking, designed like the{" "}
            <span className="bg-gradient-to-r from-[#f5d78e] via-[#dcb771] to-[#c5a059] bg-clip-text text-transparent">
              stay itself.
            </span>
          </h2>
          <p className="mt-6 text-white/55 max-w-[480px] leading-relaxed">
            The room is the destination — getting there should feel just as deliberate. We treat the
            booking interface as part of the experience.
          </p>
        </motion.div>

        <motion.div variants={stagger} className="grid sm:grid-cols-2 gap-4 md:gap-5">
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={reveal}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 270, damping: 22 }}
              className="glass-card p-6 hover-lift relative overflow-hidden group"
            >
              {/* Subtle gold accent on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "linear-gradient(90deg, transparent, #dcb771, transparent)" }}
              />
              <div className="text-[#dcb771] text-2xl mb-3" aria-hidden>
                {f.icon}
              </div>
              <h3 className="text-white font-bold mb-2 text-base">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
