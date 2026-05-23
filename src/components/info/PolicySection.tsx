import type { ReactNode } from "react";

// Section block for policy pages — eyebrow + heading + body in a glass card.
export default function PolicySection({
  number,
  title,
  children,
}: {
  number?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="glass-card p-6 md:p-8">
      <header className="flex items-baseline gap-3 mb-4">
        {number && (
          <span className="text-gold-light text-xs font-bold tracking-widest tabular-nums">
            {number}
          </span>
        )}
        <h2 className="text-white text-lg md:text-xl font-bold tracking-tight">{title}</h2>
      </header>
      <div className="text-white/70 text-sm md:text-base leading-relaxed prose-info">
        {children}
      </div>
    </section>
  );
}
