import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Link from "next/link";
import Image from "next/image";
import TopMenuItem from "./TopMenuItem";
import UserMenu from "./UserMenu";

// Sticky 3-zone grid layout: [logo] [centered nav cluster] [right actions]
// Nav items use real horizontal padding + gap so they don't run together.
export default async function TopMenu() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "admin";

  return (
    <nav
      className="sticky top-0 left-0 right-0 h-[64px] z-50 w-full"
      style={{
        background: "linear-gradient(180deg, rgba(12, 10, 22, 0.94) 0%, rgba(18, 14, 30, 0.9) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(220, 183, 113, 0.08)",
      }}
    >
      <div className="h-full max-w-[1320px] mx-auto px-4 md:px-8 lg:px-12 grid grid-cols-[auto_1fr_auto] items-center gap-4">
        {/* Left — Logo */}
        <Link href="/" className="h-full flex items-center group" aria-label="Hotel Booking — Home">
          <Image
            src="/img/logo.png"
            alt="Hotel Booking"
            width={160}
            height={64}
            className="h-[40px] sm:h-[48px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04]"
          />
        </Link>

        {/* Centre — nav cluster (hidden on small) */}
        <div className="hidden md:flex flex-row items-center justify-center h-full gap-3 lg:gap-5">
          <TopMenuItem title="Hotels" pageRef="/hotel" />
          <TopMenuItem title="Find Earliest" pageRef="/find" />
          {isAdmin && (
            <>
              <span className="h-5 w-px bg-white/15 mx-2" aria-hidden />
              <TopMenuItem title="Console" pageRef="/admin" />
              <TopMenuItem title="Hotels" pageRef="/admin/hotels" />
              <TopMenuItem title="Bookings" pageRef="/admin/bookings" />
              <TopMenuItem title="Services" pageRef="/admin/roomservices" />
              <TopMenuItem title="Reviews" pageRef="/admin/reviews" />
              <TopMenuItem title="Users" pageRef="/admin/users" />
            </>
          )}
          {session && !isAdmin && (
            <>
              <span className="h-5 w-px bg-white/15 mx-2" aria-hidden />
              <TopMenuItem title="My Bookings" pageRef="/mybooking" />
            </>
          )}
        </div>

        {/* Right — Help + Book CTA + auth */}
        <div className="flex items-center justify-end h-full gap-2 sm:gap-3">
          <Link
            href="/faq"
            className="hidden md:inline-flex items-center justify-center h-full px-2 text-[11px] font-semibold uppercase tracking-widest text-white/55 hover:text-white transition-colors"
          >
            Help
          </Link>
          <Link
            href="/booking"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 hover:-translate-y-0.5 shadow-[0_4px_18px_rgba(220,183,113,0.32)] gradient-gold text-[#1a1730] whitespace-nowrap"
          >
            Book Now
          </Link>

          {session ? (
            <UserMenu name={session.user?.name || ""} role={session.user?.role || "user"} />
          ) : (
            <>
              <Link href="/register" className="hidden sm:flex items-center h-full px-2 group">
                <span className="text-sm font-semibold text-white/60 group-hover:text-white transition-colors">
                  Register
                </span>
              </Link>
              <Link href="/login" className="flex items-center h-full px-2 group">
                <span className="text-sm font-bold text-[#dcb771] group-hover:text-[#f5d78e] transition-colors">
                  Sign In
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
