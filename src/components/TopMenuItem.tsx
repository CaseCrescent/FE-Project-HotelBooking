// ===========================================
// src/components/TopMenuItem.tsx
// Reusable Nav Link — รองรับ active highlight
// ===========================================

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopMenuItem({ title, pageRef }: { title: string; pageRef: string }) {
  const pathname = usePathname();
  const isActive = pathname === pageRef || pathname.startsWith(pageRef + "/");

  return (
    <Link href={pageRef} className="h-full flex items-center relative group px-1 mx-1 sm:mx-2">
      <span
        className={`text-sm font-semibold transition-all duration-200 ${
          isActive ? "text-[#dcb771]" : "text-white/60 group-hover:text-white"
        }`}
      >
        {title}
      </span>
      
      {/* ขีดเส้นใต้สีทองเกาะขอบล่างสุดเมื่อ Active */}
      {isActive && (
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#dcb771] rounded-t-md" />
      )}
      
      {/* ขีดเส้นใต้สีเทาโผล่มาตอน Hover */}
      {!isActive && (
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/30 rounded-t-md opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </Link>
  );
}