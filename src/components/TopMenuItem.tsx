"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

// Nav item with a shared-layout active pill (layoutId="nav-active" morphs the
// highlight between routes). Subtle hover underline for inactive items.
export default function TopMenuItem({ title, pageRef }: { title: string; pageRef: string }) {
  const pathname = usePathname();
  const isActive = pathname === pageRef || pathname.startsWith(pageRef + "/");

  return (
    <Link
      href={pageRef}
      className="relative flex items-center px-3.5 py-2 rounded-full whitespace-nowrap group"
    >
      {isActive && (
        <motion.span
          layoutId="nav-active"
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(220, 183, 113, 0.18) 0%, rgba(220, 183, 113, 0.06) 100%)",
            border: "1px solid rgba(220, 183, 113, 0.35)",
            boxShadow: "0 0 24px rgba(220, 183, 113, 0.15)",
          }}
          transition={{ type: "spring", stiffness: 360, damping: 28 }}
        />
      )}
      <span
        className={`relative z-10 text-sm font-semibold tracking-wide transition-colors duration-200 ${
          isActive ? "text-[#dcb771]" : "text-white/65 group-hover:text-white"
        }`}
      >
        {title}
      </span>
      {!isActive && (
        <span className="absolute left-3.5 right-3.5 bottom-1 h-[2px] bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </Link>
  );
}
