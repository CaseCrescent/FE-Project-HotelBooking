"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { reveal, stagger, VIEW_ONCE } from "@/lib/animations";

interface FooterLink {
  key: string;
  label: string;
  href: string;
}

const PRIMARY_LINKS: FooterLink[] = [
  { key: "hotels", label: "Hotels", href: "/hotel" },
  { key: "find", label: "Find Earliest", href: "/find" },
  { key: "book", label: "Book Now", href: "/booking" },
  { key: "faq", label: "FAQ", href: "/faq" },
];

const ACCOUNT_LINKS: FooterLink[] = [
  { key: "signin", label: "Sign In", href: "/login" },
  { key: "register", label: "Register", href: "/register" },
  { key: "mybookings", label: "My Bookings", href: "/mybooking" },
  { key: "profile", label: "Profile", href: "/profile" },
];

const COMPANY_LINKS: FooterLink[] = [
  { key: "about", label: "About", href: "/about" },
  { key: "contact", label: "Contact", href: "/contact" },
  { key: "refund", label: "Refund Policy", href: "/refund-policy" },
];

const LEGAL_LINKS: FooterLink[] = [
  { key: "privacy", label: "Privacy Policy", href: "/privacy" },
  { key: "terms", label: "Terms of Service", href: "/terms" },
  { key: "cookies", label: "Cookie Policy", href: "/cookies" },
];

export default function AppFooter() {
  return (
    <footer className="relative mt-auto">
      {/* Pre-footer CTA — centered, single column, no risk of clipping */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEW_ONCE}
        transition={{ duration: 0.55, ease: [0.22, 0.9, 0.32, 1] }}
        className="relative overflow-hidden gradient-gold"
      >
        <div className="shimmer-overlay" />
        <div className="relative z-10 max-w-[920px] mx-auto px-6 md:px-10 py-14 md:py-20 text-center">
          <div className="text-[11px] tracking-[0.32em] uppercase text-[#1a1730]/70 mb-4">
            Ready to stay?
          </div>
          <h2 className="text-[#1a1730] text-3xl md:text-5xl font-bold leading-tight max-w-2xl mx-auto">
            Pick a hotel. Pick a date.
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>We&apos;ll handle the rest.
          </h2>
          <p className="mt-5 text-[#1a1730]/75 text-sm md:text-base max-w-[560px] mx-auto">
            Real-time availability across every partner. Cancel any time. Confirmation receipt issued instantly.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/hotel"
              className="inline-flex items-center justify-center min-w-[180px] px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.18em] hover:-translate-y-0.5 transition-all shadow-deep"
              style={{ backgroundColor: "#1a1730", color: "#ffffff" }}
            >
              Browse hotels
            </Link>
            <Link
              href="/find"
              className="inline-flex items-center justify-center min-w-[180px] px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.18em] transition-colors"
              style={{ border: "2px solid #1a1730", color: "#1a1730", backgroundColor: "transparent" }}
            >
              Find earliest →
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Main footer */}
      <div
        className="border-t border-white/[0.05]"
        style={{
          background: "linear-gradient(180deg, rgba(12,10,22,0.92) 0%, rgba(8,6,16,1) 100%)",
        }}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEW_ONCE}
          className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-12 py-14 md:py-20 grid gap-10 md:gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]"
        >
          {/* Brand */}
          <motion.div variants={reveal} className="flex flex-col">
            <Link href="/" className="inline-flex items-center mb-5 group w-fit" aria-label="Hotel Booking — Home">
              <Image
                src="/img/logo.png"
                alt="Hotel Booking"
                width={140}
                height={56}
                className="h-[44px] w-auto object-contain group-hover:scale-[1.04] transition-transform"
              />
            </Link>
            <p className="text-white/55 text-sm leading-relaxed max-w-[340px]">
              A curated hotel booking aggregator. Real-time availability, transparent pricing, and a
              queue that respects your time.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <SocialIcon label="Email">@</SocialIcon>
              <SocialIcon label="Twitter">𝕏</SocialIcon>
              <SocialIcon label="Instagram">○</SocialIcon>
              <SocialIcon label="LINE">✉</SocialIcon>
            </div>
          </motion.div>

          <FooterColumn title="Explore" links={PRIMARY_LINKS} />
          <FooterColumn title="Account" links={ACCOUNT_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />
          <FooterColumn title="Legal" links={LEGAL_LINKS} />
        </motion.div>

        {/* Sub-footer */}
        <div className="border-t border-white/[0.04]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-white/40 text-xs">
              © {new Date().getFullYear()} Hotel Booking · Built for CEDT
            </p>
            <p className="text-white/40 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-gold" />
              All systems operational
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <motion.div variants={reveal}>
      <h3 className="text-[10px] uppercase tracking-[0.32em] text-gold mb-5">{title}</h3>
      <ul className="flex flex-col gap-3">
        {links.map((l) => (
          <li key={l.key}>
            <Link
              href={l.href}
              className="inline-block text-white/65 hover:text-white text-sm transition-colors hover:translate-x-0.5"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function SocialIcon({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/55 hover:text-gold hover:border-[#dcb771]/40 hover:bg-[rgba(220,183,113,0.05)] transition-colors"
    >
      <span aria-hidden className="text-sm leading-none">
        {children}
      </span>
    </button>
  );
}
