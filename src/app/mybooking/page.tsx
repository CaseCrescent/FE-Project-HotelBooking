// ===========================================
// src/app/mybooking/page.tsx
// Step 5: View Own Bookings (Protected — ต้อง login)
// - Fetch bookings จาก API (user เห็นเฉพาะของตัวเอง)
// - แสดงเป็น BookingList → BookingCard (พร้อม Edit/Delete)
// - ปรับจากเว็บ Venue เดิม (mybooking/page.tsx) โดย:
//   1. Fetch จาก API แทน Redux (Venue อ่านจาก Redux store)
//   2. ใช้ BookingList component ที่รับ data จาก props
// - middleware.ts ป้องกัน: ต้อง login ก่อนเข้าหน้านี้
// - Presentation Journey Step 5 (2 คะแนน)
// ===========================================

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getBookings from "@/libs/getBookings";
import BookingList from "@/components/BookingList";

export default async function MyBookingPage() {
  // ดึง session เพื่อเอา token (Server Component)
  const session = await getServerSession(authOptions);

  // ถ้าไม่มี session (middleware ควรจับได้แล้ว แต่เผื่อไว้)
  if (!session?.user?.token) {
    return (
      <main style={{ paddingTop: "100px", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
        <h1 style={{ color: "white", fontSize: "20px" }}>Please sign in to view your bookings.</h1>
      </main>
    );
  }

  // Fetch bookings จาก API (user เห็นเฉพาะของตัวเอง — ตรงกับ Backend logic)
  let bookings: any[] = [];
  try {
    const bookingsData = await getBookings(session.user.token);
    bookings = bookingsData.data || [];
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
  }

  return (
    <main
      style={{
        paddingTop: "80px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: "60px",
      }}
    >
      {/* หัวข้อ — สีทองเหมือนเว็บ Venue mybooking */}
      <h1
        style={{
          color: "#dcb771",
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "24px",
        }}
      >
        My Bookings
      </h1>

      <BookingList bookings={bookings} isAdmin={false} />
    </main>
  );
}
