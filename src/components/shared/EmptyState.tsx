"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { HOUSE_EASE } from "@/lib/animations";

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function EmptyState({ icon, title, description, ctaLabel, ctaHref }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: HOUSE_EASE }}
      className="glass-card-gold w-full max-w-[560px] mx-auto p-10 text-center"
    >
      <div className="text-5xl mb-5 inline-block float-y" aria-hidden>
        {icon ?? "✨"}
      </div>
      <h3 className="text-gold-light text-xl font-bold mb-2">{title}</h3>
      {description && <p className="text-[#9ca3af] text-sm leading-relaxed">{description}</p>}
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center gap-2 mt-6 px-6 py-3 rounded-full gradient-gold font-bold tracking-wide shadow-soft hover-lift"
        >
          {ctaLabel}
          <span aria-hidden>→</span>
        </Link>
      )}
    </motion.div>
  );
}
