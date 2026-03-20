// ===========================================
// src/app/profile/page.tsx
// User Profile Page (Protected — ต้อง login)
// - ดึงข้อมูล user จาก NextAuth session (name, email, tel, role)
// - แสดง avatar อักษรย่อ + info card + action buttons
// - middleware.ts ป้องกัน: ต้อง login ก่อนเข้าหน้านี้
// - Extra Credit Feature
// ===========================================

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Link from "next/link";
import DeleteAccountButton from "./DeleteAccountButton";

// Helper: แสดงแถว label + value
function ProfileRow({
  icon,
  label,
  value,
  last,
}: {
  icon: string;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      style={{
        paddingBottom: last ? "0" : "18px",
        marginBottom: last ? "0" : "18px",
        borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
        <span style={{ fontSize: "14px" }}>{icon}</span>
        <span
          style={{
            fontSize: "10px",
            color: "rgba(255,255,255,0.3)",
            fontWeight: "700",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>
      <p style={{ color: "#e5e7eb", fontSize: "15px", paddingLeft: "22px", wordBreak: "break-all" }}>
        {value}
      </p>
    </div>
  );
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  // middleware.ts ควรจับได้แล้ว แต่ป้องกันไว้อีกชั้น
  if (!session?.user) {
    return (
      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "#0d0b1a",
          paddingTop: "120px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <h1 style={{ color: "white", fontSize: "20px" }}>Please sign in.</h1>
      </main>
    );
  }

  const { name, email, tel, role } = session.user;

  // สร้างอักษรย่อ 1-2 ตัวจากชื่อ (e.g. "John Doe" → "JD")
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isAdmin = role === "admin";

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0d0b1a",
        paddingTop: "120px",
        paddingBottom: "64px",
        paddingLeft: "16px",
        paddingRight: "16px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "460px" }}>

        {/* ===== Avatar + Name + Role Badge ===== */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          {/* Avatar circle — gradient gold */}
          <div
            style={{
              width: "84px",
              height: "84px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #dcb771 0%, #c5a059 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: "30px",
              fontWeight: "700",
              color: "#12102a",
              boxShadow: "0 8px 32px rgba(220,183,113,0.3)",
            }}
          >
            {initials}
          </div>

          {/* Name */}
          <h1
            style={{
              color: "#e5e7eb",
              fontSize: "22px",
              fontWeight: "700",
              marginBottom: "10px",
            }}
          >
            {name}
          </h1>

          {/* Role badge */}
          <span
            style={{
              display: "inline-block",
              padding: "5px 16px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              background: isAdmin
                ? "rgba(220,183,113,0.12)"
                : "rgba(255,255,255,0.05)",
              color: isAdmin ? "#dcb771" : "#9ca3af",
              border: `1px solid ${isAdmin ? "rgba(220,183,113,0.3)" : "rgba(255,255,255,0.1)"}`,
            }}
          >
            {isAdmin ? "✦ Admin" : "User"}
          </span>
        </div>

        {/* ===== Account Info Card ===== */}
        <div
          style={{
            backgroundColor: "#1a1730",
            borderRadius: "16px",
            padding: "28px 28px 10px",
            border: "1px solid rgba(220,183,113,0.08)",
            marginBottom: "16px",
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.25)",
              fontSize: "10px",
              fontWeight: "700",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "22px",
            }}
          >
            Account Information
          </p>

          <ProfileRow icon="👤" label="Full Name" value={name} />
          <ProfileRow icon="📧" label="Email" value={email} />
          <ProfileRow icon="📞" label="Telephone" value={tel} last />
        </div>

        {/* ===== Action Buttons ===== */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* View Bookings — Gold, lifts on hover */}
          <Link
            href="/mybooking"
            className="block text-center font-bold no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(220,183,113,0.4)] active:translate-y-0"
            style={{
              padding: "14px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #dcb771 0%, #c5a059 100%)",
              color: "#12102a",
              fontSize: "15px",
              boxShadow: "0 4px 20px rgba(220,183,113,0.2)",
            }}
          >
            View My Bookings
          </Link>

          {/* Sign Out — outlined, visible border */}
          <a
            href="/api/auth/signout"
            className="block text-center no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-white/30 hover:text-white/90 hover:bg-white/[0.05]"
            style={{
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.65)",
              fontSize: "15px",
              fontWeight: "500",
            }}
          >
            Sign Out
          </a>

          {/* Delete Account — Danger (Client Component) */}
          <DeleteAccountButton />
        </div>

      </div>
    </main>
  );
}