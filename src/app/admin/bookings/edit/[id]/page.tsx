// ===========================================
// src/app/admin/bookings/edit/[id]/page.tsx
// Step 11: Admin Edit Any Booking (Protected — admin only)
// - เหมือนหน้า user edit แต่ admin แก้ได้ทุก booking (ไม่จำกัด owner)
// - middleware.ts ป้องกัน: ต้องเป็น admin
// - Presentation Journey Step 11 (2 คะแนน)
// แก้: ส่ง hotels + initialHotelId ให้ BookingForm ให้ dropdown แสดงโรงแรมที่ถูกต้อง
// ===========================================

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getBooking from "@/libs/getBooking";
import getHotels from "@/libs/getHotels";
import BookingForm from "@/components/BookingForm";

export default async function AdminEditBookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.token || session.user.role !== "admin") {
    return (
      <main style={{ paddingTop: "120px", minHeight: "100vh", backgroundColor: "#0d0b1a", display: "flex", justifyContent: "center" }}>
        <h1 style={{ color: "white", fontSize: "20px" }}>Admin access only.</h1>
      </main>
    );
  }

  // Fetch booking และ hotels พร้อมกัน
  let booking: any = null;
  let hotels: { _id: string; name: string; address: string }[] = [];

  try {
    const [bookingData, hotelsData] = await Promise.all([
      getBooking(session.user.token, id),
      getHotels(),
    ]);
    booking = bookingData.data;
    hotels = hotelsData.data?.map((h: any) => ({
      _id: h._id,
      name: h.name,
      address: h.address,
    })) || [];
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }

  if (!booking) {
    return (
      <main style={{ paddingTop: "120px", minHeight: "100vh", backgroundColor: "#0d0b1a", display: "flex", justifyContent: "center" }}>
        <h1 style={{ color: "white", fontSize: "20px" }}>Booking not found.</h1>
      </main>
    );
  }

  const hotelName = typeof booking.hotel === "object" ? booking.hotel.name : "Unknown Hotel";
  // ดึง hotelId จาก booking.hotel (populated object หรือ string id)
  const hotelId = typeof booking.hotel === "object" ? booking.hotel._id : booking.hotel;

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0d0b1a",
        paddingTop: "120px",
        paddingBottom: "64px",
        paddingLeft: "24px",
        paddingRight: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          color: "#dcb771",
          fontSize: "clamp(22px, 3vw, 30px)",
          fontWeight: "700",
          marginBottom: "32px",
          textAlign: "center",
        }}
      >
        Edit Booking (Admin)
      </h1>

      {/* BookingForm edit mode — ส่ง hotels + initialHotelId เพื่อให้ dropdown ถูกต้อง */}
      <BookingForm
        mode="edit"
        hotels={hotels}
        initialHotelId={hotelId}
        initialData={{
          bookingId: booking._id,
          bookingDate: booking.bookingDate,
          numOfNights: booking.numOfNights,
          hotelName: hotelName,
        }}
      />
    </main>
  );
}