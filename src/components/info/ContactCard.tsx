import Link from "next/link";
import type { ReactNode } from "react";

export default function ContactCard({
  icon,
  label,
  value,
  href,
  caption,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
  caption?: string;
}) {
  const inner = (
    <div className="glass-card p-5 md:p-6 h-full transition-colors hover:border-[#dcb771]/40 group">
      <div className="flex items-center gap-3 mb-3">
        <span
          aria-hidden
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
          style={{
            background: "linear-gradient(135deg, rgba(245,215,142,0.25), rgba(220,183,113,0.15))",
            color: "#f5d78e",
            border: "1px solid rgba(220,183,113,0.3)",
          }}
        >
          {icon}
        </span>
        <span className="text-[10px] uppercase tracking-[0.32em] text-gold">{label}</span>
      </div>
      <div className="text-white font-bold text-base md:text-lg break-words group-hover:text-[#f5d78e] transition-colors">
        {value}
      </div>
      {caption && <p className="text-white/45 text-xs mt-2">{caption}</p>}
    </div>
  );
  if (href) {
    const isExternal = /^(mailto:|tel:|https?:)/.test(href);
    return isExternal ? (
      <a href={href} className="block h-full" rel="noopener noreferrer">
        {inner}
      </a>
    ) : (
      <Link href={href} className="block h-full">
        {inner}
      </Link>
    );
  }
  return inner;
}
