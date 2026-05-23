"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HOUSE_EASE } from "@/lib/animations";
import type { FaqItem } from "./faqContent";

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.key ?? null);

  // Reset open question when items change (e.g. FaqTabs switches role).
  // Without this, the prior tab's open-key persists and matches nothing in the new list.
  useEffect(() => {
    setOpen(items[0]?.key ?? null);
  }, [items]);

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => {
        const isOpen = open === item.key;
        return (
          <li
            key={item.key}
            className={`glass-card overflow-hidden transition-colors ${
              isOpen ? "border-[#dcb771]/40" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : item.key)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 md:px-6 md:py-5 text-left group"
              aria-expanded={isOpen}
              aria-controls={`faq-${item.key}`}
            >
              <span className="text-white font-semibold text-sm md:text-base">
                {item.q}
              </span>
              <span
                aria-hidden
                className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-base leading-none transition-all ${
                  isOpen
                    ? "border-[#dcb771]/60 text-[#f5d78e] rotate-45"
                    : "border-white/15 text-white/60 group-hover:border-[#dcb771]/40 group-hover:text-gold"
                }`}
              >
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-${item.key}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: HOUSE_EASE }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 md:px-6 md:pb-6 text-white/65 text-sm md:text-[15px] leading-relaxed">
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
