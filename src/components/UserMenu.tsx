"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { HOUSE_EASE } from "@/lib/animations";

interface UserMenuProps {
  name: string;
  role: string;
}

export default function UserMenu({ name, role }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const initials = (name || "?")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isAdmin = role === "admin";

  return (
    <div ref={wrapRef} className="relative h-full flex items-center">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Open account menu, ${name}`}
        className="flex items-center gap-2 px-1 py-1 rounded-full group"
      >
        <span className="hidden sm:inline text-sm font-medium text-white/75 group-hover:text-white max-w-[120px] truncate">
          {name}
        </span>
        <span className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center font-bold text-[#1a1730] text-sm shadow-soft transition-transform group-hover:scale-105">
          {initials}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: HOUSE_EASE }}
            className="absolute right-0 top-[58px] w-64 rounded-2xl border border-white/[0.08] overflow-hidden shadow-deep"
            style={{
              background: "linear-gradient(180deg, rgba(28, 24, 56, 0.96) 0%, rgba(22, 19, 42, 0.98) 100%)",
              backdropFilter: "blur(18px)",
            }}
            role="menu"
          >
            <div className="p-4 border-b border-white/[0.06] flex items-center gap-3">
              <span className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center font-bold text-[#1a1730] text-sm">
                {initials}
              </span>
              <div className="min-w-0">
                <div className="text-white text-sm font-bold truncate">{name}</div>
                <div className="text-[10px] uppercase tracking-widest text-gold mt-0.5">
                  {isAdmin ? "Admin" : "Member"}
                </div>
              </div>
            </div>

            <nav className="p-2 flex flex-col gap-0.5">
              <MenuLink href="/profile" onClick={() => setOpen(false)}>Profile</MenuLink>
              {!isAdmin && (
                <MenuLink href="/mybooking" onClick={() => setOpen(false)}>My bookings</MenuLink>
              )}
              {isAdmin && (
                <>
                  <MenuLink href="/admin/hotels" onClick={() => setOpen(false)}>Manage hotels</MenuLink>
                  <MenuLink href="/admin/bookings" onClick={() => setOpen(false)}>Manage bookings</MenuLink>
                </>
              )}
              <MenuLink href="/find" onClick={() => setOpen(false)}>Find earliest room</MenuLink>
            </nav>

            <div className="p-2 border-t border-white/[0.06]">
              <a
                href="/api/auth/signout"
                className="block w-full text-center px-4 py-2.5 rounded-lg border border-red-500/30 bg-red-500/[0.06] text-red-300 text-xs uppercase tracking-widest font-bold hover:bg-red-500/15 hover:border-red-500/60 transition-colors"
                role="menuitem"
              >
                Sign out
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      role="menuitem"
      className="block px-3 py-2 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/[0.05] transition-colors"
    >
      {children}
    </Link>
  );
}
