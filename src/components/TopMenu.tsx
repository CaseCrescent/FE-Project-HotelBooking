// ===========================================
// src/components/TopMenu.tsx
// Navigation Bar — v6 (Full Width + Safe Padding)
// ===========================================

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Link from "next/link";
import Image from "next/image";
import TopMenuItem from "./TopMenuItem";

export default async function TopMenu() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "admin";

  return (
    <nav
      // ⚠️ เอา max-w ออก ปล่อยให้เต็มจอ แล้วใช้ px-8 lg:px-16 เพื่อดันให้ห่างจากขอบจอพอสวยงาม
      className="fixed top-0 left-0 right-0 h-[64px] z-50 flex flex-row justify-between items-center w-full px-6 md:px-10 lg:px-16"
      style={{
        background: "linear-gradient(180deg, rgba(12, 10, 22, 0.98) 0%, rgba(18, 14, 30, 0.96) 100%)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(220, 183, 113, 0.06)",
      }}
    >
      {/* ===== ฝั่งซ้าย: Logo + Menu Groups ===== */}
      <div className="flex items-center h-full gap-3 md:gap-5 lg:gap-6">
        
        {/* Logo */}
        <Link href="/" className="h-full flex items-center">
          <div className="cursor-pointer hover:opacity-80 transition-opacity flex items-center h-full">
            <Image
              src="/img/logo.png"
              alt="logo"
              width={160}
              height={64}
              className="h-[50px] sm:h-[60px] w-auto object-contain"
            />
          </div>
        </Link>

        {/* เมนูต่างๆ */}
        <div className="hidden md:flex flex-row items-center h-full gap-1 lg:gap-2">
          <TopMenuItem title="Hotels" pageRef="/hotel" />
          
          {isAdmin ? (
            <>
              <span className="text-white/20 text-sm font-light mx-2">|</span>
              <TopMenuItem title="Manage Hotels" pageRef="/admin/hotels" />
              <span className="text-white/20 text-sm font-light mx-2">|</span>
              <TopMenuItem title="Manage Bookings" pageRef="/admin/bookings" />
            </>
          ) : session ? (
            <>
              <span className="text-white/20 text-sm font-light mx-2">|</span>
              <TopMenuItem title="My Bookings" pageRef="/mybooking" />
            </>
          ) : null}
        </div>
      </div>

      {/* ===== ฝั่งขวา: Auth & Actions ===== */}
      {/* mr-4 lg:mr-8 ขยับกลุ่มเมนูขวาออกจากขอบจอนิดนึง */}
      <div className="flex items-center h-full gap-4 sm:gap-5" style={{ marginRight: "clamp(12px, 1.5vw, 32px)" }}>
        {session ? (
          <>
            <Link
              href="/profile"
              className="relative text-sm text-white/80 font-medium hidden sm:block hover:text-[#dcb771] transition-colors duration-200 group"
            >
              {session.user?.name}
              <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-[#dcb771] rounded-full transition-all duration-200 group-hover:w-full" />
            </Link>

             {/* Book Now Button */}
            <Link href="/booking" className="flex items-center">
              <div className="flex justify-center items-center min-w-[65px] lg:min-w-[75px] min-h-[32px] lg:min-h-[36px] text-sm font-bold rounded-sm transition-all duration-300 cursor-pointer hover:-translate-y-0.5 shadow-[0_4px_15px_rgba(220,183,113,0.3)] bg-gradient-to-r from-[#e8c98c] to-[#dcb771] text-[#1a1730]">
                Book Now
              </div>
            </Link>

            {/* Sign-Out (ใช้ <a> เพื่อรีเฟรชหน้าตอนล็อกเอาต์) */}
            <a href="/api/auth/signout" className="h-full flex items-center relative group px-1 mx-1">
              <span className="text-sm font-semibold text-white/50 group-hover:text-white transition-all duration-200">
                Sign-Out
              </span>
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/30 rounded-t-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </>
        ) : (
          <>
            {/* Register */}
            <Link href="/register" className="h-full flex items-center relative group px-1 mx-1">
              <span className="text-sm font-semibold text-white/50 group-hover:text-white transition-all duration-200">
                Register
              </span>
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/30 rounded-t-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            {/* Sign-In */}
            <Link href="/login" className="h-full flex items-center relative group px-1 mx-1">
              <span className="text-sm font-bold text-[#dcb771] group-hover:text-[#f5d78e] transition-all duration-200">
                Sign-In
              </span>
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#dcb771] rounded-t-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}