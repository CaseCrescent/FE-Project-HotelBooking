"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import FaqAccordion from "./FaqAccordion";
import { GUEST_FAQ, USER_FAQ } from "./faqContent";

// Public FAQ shows only Guest and User tabs. The Admin FAQ is rendered separately
// inside the /admin dashboard so its content (moderation rules, ban semantics,
// cascade behavior, etc.) is never exposed to non-admin visitors.
type Role = "guest" | "user";

const TABS: { key: Role; label: string; sub: string }[] = [
  { key: "guest", label: "Guest", sub: "Browsing & first booking" },
  { key: "user", label: "User", sub: "Managing bookings & reviews" },
];

const CONTENT: Record<Role, typeof GUEST_FAQ> = {
  guest: GUEST_FAQ,
  user: USER_FAQ,
};

export default function FaqTabs({ initialRole = "guest" }: { initialRole?: Role }) {
  const [active, setActive] = useState<Role>(initialRole);

  return (
    <div className="flex flex-col gap-6">
      {/* Tab strip */}
      <div className="relative flex flex-wrap gap-2 p-1.5 rounded-full glass-card">
        {TABS.map((t) => {
          const isActive = t.key === active;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActive(t.key)}
              className="relative flex-1 min-w-[120px] px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
              style={{ color: isActive ? "#1a1730" : "rgba(255,255,255,0.65)" }}
            >
              {isActive && (
                <motion.span
                  layoutId="faq-tab-pill"
                  className="absolute inset-0 rounded-full gradient-gold shadow-soft"
                  transition={{ type: "spring", stiffness: 360, damping: 30 }}
                  aria-hidden
                />
              )}
              <span className="relative z-10">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-label */}
      <p className="text-white/45 text-xs uppercase tracking-[0.32em] -mt-2">
        {TABS.find((t) => t.key === active)?.sub}
      </p>

      {/* Accordion */}
      <FaqAccordion items={CONTENT[active]} />
    </div>
  );
}
