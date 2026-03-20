// ===========================================
// src/app/hotel/[hid]/page.tsx
// Hotel Detail Page — แสดงรายละเอียด + ดาว + description + ปุ่ม Book
// Server Component — ไม่มี onMouseOver (ใช้ Tailwind hover)
// ⚠️ ใช้ inline style สำหรับ paddingTop + bg เพราะ Tailwind v4 JIT
//    ไม่ generate CSS สำหรับ class ใหม่ที่ยังไม่เคย build ไว้ก่อน
// ===========================================

import getHotel from "@/libs/getHotel";
import Link from "next/link";
import HotelDetailClient from "./HotelDetailClient";
import HotelDetailImage from "./HotelDetailImage";

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ hid: string }>;
}) {
  const { hid } = await params;
  const hotelDetail = await getHotel(hid);
  const hotel = hotelDetail.data;

  if (!hotel) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0d0b1a" }}>
        <h1 style={{ color: "white", fontSize: "20px" }}>Hotel not found</h1>
      </main>
    );
  }

  // รูปภาพ fallback deterministic จากชื่อโรงแรม
  const defaults = ["/img/hotel.jpg", "/img/hotel2.jpg", "/img/hotel3.jpg"];
  const idx = hotel.name.split("").reduce((s: number, c: string) => s + c.charCodeAt(0), 0) % defaults.length;
  const imgSrc = hotel.picture || defaults[idx];

  return (
    // ⚠️ ใช้ inline style แทน Tailwind pt-24 เพราะ JIT อาจไม่ generate class ใหม่
    // ธีมตรงกับ booking page: bg #0d0b1a, paddingTop 120px, centered content
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0d0b1a",
        paddingTop: "120px",
        paddingBottom: "64px",
        paddingLeft: "16px",
        paddingRight: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* ชื่อโรงแรม — gold heading เหมือน booking page */}
      <h1
        style={{
          color: "#dcb771",
          fontSize: "clamp(24px, 4vw, 36px)",
          fontWeight: "700",
          marginBottom: "32px",
          textAlign: "center",
          letterSpacing: "0.5px",
        }}
      >
        {hotel.name}
      </h1>

      {/* Card หลัก — ธีมเดียวกับ BookingForm cards */}
      {/* ⚠️ ใช้ flexDirection row เสมอ (desktop-first) เพราะ Tailwind responsive JIT อาจไม่ generate */}
      <div
        style={{
          width: "100%",
          maxWidth: "860px",
          backgroundColor: "#1a1730",
          borderRadius: "16px",
          border: "1px solid rgba(220, 183, 113, 0.08)",
          boxShadow: "0 16px 48px rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
        }}
      >
        {/* ===== ฝั่งซ้าย: รูปภาพ ===== */}
        <div
          style={{ width: "360px", minHeight: "300px", position: "relative", flexShrink: 0, overflow: "hidden" }}
        >
          <HotelDetailImage hotelId={hotel._id} hotelName={hotel.name} fallbackSrc={imgSrc} />
        </div>

        {/* ===== ฝั่งขวา: รายละเอียด ===== */}
        <div
          style={{
            flex: 1,
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            minWidth: 0,
          }}
        >
          {/* Stars + Description (Client Component อ่านจาก Redux) */}
          <HotelDetailClient hotelId={hotel._id} hotelName={hotel.name} />

          {/* Info rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <InfoRow label="Name" value={hotel.name} />
            <InfoRow label="Address" value={hotel.address} />
            <InfoRow label="Telephone" value={hotel.tel} />
          </div>

          {/* ปุ่ม Book This Hotel — สีเข้มบน gold เพื่อ contrast */}
          <Link
            href={`/booking?hotel=${hotel._id}`}
            style={{
              marginTop: "auto",
              display: "block",
              width: "100%",
              textAlign: "center",
              padding: "14px",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "15px",
              letterSpacing: "0.4px",
              background: "linear-gradient(135deg, #dcb771 0%, #c5a059 100%)",
              color: "#12102a", // ✅ ตัวหนังสือสีเข้ม contrast กับพื้น gold
              textDecoration: "none",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 20px rgba(220,183,113,0.25)",
            }}
            className="hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(220,183,113,0.4)]"
          >
            Book This Hotel
          </Link>
        </div>
      </div>
    </main>
  );
}

// ===========================================
// Helper: label + value row
// ===========================================
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>
        {label}
      </span>
      <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px", marginTop: "2px" }}>
        {value}
      </p>
    </div>
  );
}