// ===========================================
// src/app/admin/bookings/page.tsx
// Step 10: Admin View All Bookings (Protected — admin only)
// - Fetch bookings จาก API (admin เห็นทั้งหมดของทุก user)
// - แสดงเป็น BookingList → BookingCard (isAdmin=true → แสดงชื่อ user ด้วย)
// - ใหม่: เว็บ Venue ไม่มี admin features
// - middleware.ts ป้องกัน: ต้องเป็น admin
// - Presentation Journey Step 10 (2 คะแนน)
// ===========================================

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getBookings from "@/libs/getBookings";
import BookingList from "@/components/BookingList";

export default async function AdminBookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.token || session.user.role !== "admin") {
    return (
      <main style={{ paddingTop: "100px", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
        <h1 style={{ color: "white", fontSize: "20px" }}>Admin access only.</h1>
      </main>
    );
  }

  // Fetch bookings ทั้งหมด (admin เห็นทุก booking — ตรงกับ Backend logic)
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
      <h1
        style={{
          color: "#dcb771",
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "8px",
        }}
      >
        Manage All Bookings
      </h1>

      <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "24px" }}>
        {bookings.length} booking{bookings.length !== 1 ? "s" : ""} total
      </p>

      <BookingList bookings={bookings} isAdmin={true} />
    </main>
  );
}
