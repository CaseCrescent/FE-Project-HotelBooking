import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Link from "next/link";
import DeleteAccountButton from "./DeleteAccountButton";
import PageShell, { PageHeader } from "@/components/layout/PageShell";

export const metadata = { title: "Profile · Hotel Booking" };

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <PageShell narrow>
        <PageHeader eyebrow="Profile" title="Please sign in." align="center" />
        <div className="flex justify-center">
          <Link
            href="/login"
            className="inline-flex items-center px-7 py-3.5 rounded-full gradient-gold text-[#1a1730] font-bold tracking-widest text-xs uppercase shadow-soft"
          >
            Go to sign in
          </Link>
        </div>
      </PageShell>
    );
  }

  const { name, email, tel, role } = session.user;
  const initials = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const isAdmin = role === "admin";

  return (
    <PageShell narrow>
      <PageHeader eyebrow="Account" title="Your profile" align="center" />

      {/* Avatar + identity */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative">
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold text-[#1a1730] gradient-gold shadow-elegant float-y"
            aria-hidden
          >
            {initials}
          </div>
          {/* Outer gold ring */}
          <div
            className="absolute -inset-2 rounded-full pointer-events-none"
            style={{
              border: "1px solid rgba(220, 183, 113, 0.25)",
              boxShadow: "0 0 40px rgba(220, 183, 113, 0.15)",
            }}
          />
        </div>
        <h2 className="text-white text-2xl font-bold mt-6">{name}</h2>
        <span
          className={`mt-3 inline-block px-4 py-1 rounded-full text-[10px] font-bold tracking-[0.32em] uppercase border ${
            isAdmin
              ? "text-gold-light bg-[rgba(220,183,113,0.12)] border-[rgba(220,183,113,0.3)]"
              : "text-white/65 bg-white/[0.04] border-white/10"
          }`}
        >
          {isAdmin ? "✦ Admin" : "Member"}
        </span>
      </div>

      {/* Info card */}
      <div className="glass-card-gold p-6 md:p-7 mb-5">
        <div className="text-[10px] tracking-[0.32em] uppercase text-gold mb-5">Account info</div>
        <Row label="Full Name" value={name} />
        <Row label="Email" value={email} />
        <Row label="Telephone" value={tel || "—"} last />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {!isAdmin && (
          <Link
            href="/mybooking"
            className="rounded-xl p-4 border border-white/[0.08] bg-white/[0.02] hover:border-[#dcb771]/30 hover:bg-[rgba(220,183,113,0.04)] transition-colors group"
          >
            <div className="text-gold text-xl mb-1">📅</div>
            <div className="text-white font-bold text-sm">My Bookings</div>
            <div className="text-white/45 text-xs mt-0.5">View, edit, cancel</div>
          </Link>
        )}
        {isAdmin && (
          <>
            <Link
              href="/admin/hotels"
              className="rounded-xl p-4 border border-white/[0.08] bg-white/[0.02] hover:border-[#dcb771]/30 hover:bg-[rgba(220,183,113,0.04)] transition-colors"
            >
              <div className="text-gold text-xl mb-1">🏨</div>
              <div className="text-white font-bold text-sm">Manage Hotels</div>
              <div className="text-white/45 text-xs mt-0.5">Add, edit, delete</div>
            </Link>
            <Link
              href="/admin/bookings"
              className="rounded-xl p-4 border border-white/[0.08] bg-white/[0.02] hover:border-[#dcb771]/30 hover:bg-[rgba(220,183,113,0.04)] transition-colors"
            >
              <div className="text-gold text-xl mb-1">📋</div>
              <div className="text-white font-bold text-sm">All Bookings</div>
              <div className="text-white/45 text-xs mt-0.5">View, manage</div>
            </Link>
          </>
        )}
        <Link
          href="/find"
          className="rounded-xl p-4 border border-white/[0.08] bg-white/[0.02] hover:border-[#dcb771]/30 hover:bg-[rgba(220,183,113,0.04)] transition-colors"
        >
          <div className="text-gold text-xl mb-1">⚡</div>
          <div className="text-white font-bold text-sm">Find Earliest</div>
          <div className="text-white/45 text-xs mt-0.5">Soonest room</div>
        </Link>
      </div>

      {/* Sign-out / delete */}
      <div className="flex flex-col gap-3 mt-2">
        <a
          href="/api/auth/signout"
          className="block text-center px-6 py-3 rounded-full border border-white/15 text-white/70 text-xs tracking-widest uppercase font-semibold hover:bg-white/[0.04] transition-colors"
        >
          Sign Out
        </a>
        <DeleteAccountButton />
      </div>
    </PageShell>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-3 gap-3 ${last ? "" : "border-b border-white/[0.05]"}`}>
      <span className="text-white/45 text-[10px] uppercase tracking-widest flex-shrink-0">{label}</span>
      <span className="text-white/90 text-sm font-medium truncate text-right">{value}</span>
    </div>
  );
}
