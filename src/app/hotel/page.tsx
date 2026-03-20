// ===========================================
// src/app/hotel/page.tsx
// Step 3: Hotels Listing
// - แสดงรายการโรงแรมทั้งหมด (public — ทุกคนเห็นได้)
// - ใช้ <Suspense> ครอบ HotelCatalog เพื่อแสดง loading
// - โครงสร้างเดียวกับเว็บ Venue เดิม (venue/page.tsx)
//   แต่เปลี่ยนจาก getVenues → getHotels
// - Presentation Journey Step 3 (1 คะแนน)
// ===========================================

import HotelCatalog from "@/components/HotelCatalog";
import getHotels from "@/libs/getHotels";
import { Suspense } from "react";
import { LinearProgress } from "@mui/material";

export default function HotelPage() {
  // ดึงข้อมูล API แบบ Server-Side (ได้ออกมาเป็น Promise — เหมือนเว็บ Venue)
  // ไม่ส่ง limit เพื่อแสดงจำนวนตามความเหมาะสม (Backend default = 25)
  const hotels = getHotels();

  return (
    <main
      style={{
        paddingTop: "60px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: "60px",
      }}
    >
      {/* หัวข้อ — สีทองเหมือนเว็บ Venue */}
      <h1
        style={{
          color: "#dcb771",
          fontSize: "36px",
          fontWeight: "bold",
          marginBottom: "8px",
        }}
      >
        Our Hotels
      </h1>

      {/* Suspense wrapper — แสดง loading ขณะรอ API (เหมือน Venue) */}
      <Suspense
        fallback={
          <div
            style={{
              color: "white",
              marginTop: "40px",
              width: "600px",
              textAlign: "center",
            }}
          >
            <p style={{ marginBottom: "15px", fontSize: "18px" }}>
              Loading Hotels...
            </p>
            <LinearProgress
              sx={{
                backgroundColor: "#555",
                "& .MuiLinearProgress-bar": { backgroundColor: "#dcb771" },
              }}
            />
          </div>
        }
      >
        <HotelCatalog hotelsJson={hotels} />
      </Suspense>
    </main>
  );
}
