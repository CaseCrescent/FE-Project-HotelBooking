// Standardised page wrapper. Every page uses this so spacing is consistent.
// - `hero` removes the top padding (page starts flush)
// - `narrow` uses a tighter max-width (forms/auth)
// - `wide` opens the page up to 1320px

import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  hero?: boolean;
  narrow?: boolean;
  wide?: boolean;
  className?: string;
}

export default function PageShell({ children, hero = false, narrow = false, wide = false, className = "" }: PageShellProps) {
  const maxW = narrow ? "max-w-[560px]" : wide ? "max-w-[1320px]" : "max-w-[1200px]";
  const topPad = hero ? "" : "pt-10 md:pt-14";
  return (
    <main className={`min-h-[calc(100vh-64px)] ${topPad} pb-20 md:pb-28 ${className}`}>
      <div className={`${maxW} mx-auto px-6 md:px-10 lg:px-12`}>{children}</div>
    </main>
  );
}

interface PageHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function PageHeader({ eyebrow, title, description, align = "left", className = "" }: PageHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";
  return (
    <header className={`mb-10 md:mb-14 max-w-[760px] ${alignClass} ${className}`}>
      {eyebrow && <div className="text-[11px] tracking-[0.32em] uppercase text-gold mb-3">{eyebrow}</div>}
      <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight tracking-tight">{title}</h1>
      {description && <p className="text-white/55 mt-3 text-sm md:text-base leading-relaxed">{description}</p>}
    </header>
  );
}
