// ===========================================
// src/components/BookingList.tsx
// Booking List (Client Component)
// - แสดงรายการ booking เป็น BookingCard หลายใบ
// - ปรับจากเว็บ Venue เดิม (BookingList.tsx) โดย:
//   1. รับ bookings จาก props (fetched จาก API) แทนที่จะอ่านจาก Redux
//   2. ใช้ BookingCard component แยก (Venue รวมทุกอย่างใน BookingList)
//   3. รองรับ isAdmin mode สำหรับ admin view
// - ใช้ในหน้า /mybooking (Step 5) และ /admin/bookings (Step 10)
// ===========================================

"use client";
import BookingCard from "./BookingCard";

export default function BookingList({
  bookings,
  isAdmin,
}: {
  bookings: any[]; // BookingItem[] จาก API (hotel populated)
  isAdmin?: boolean;
}) {
  // กรณีที่ยังไม่มี booking
  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-[#9ca3af] text-lg mt-10 text-center">
        {isAdmin ? "No bookings found." : "You have no bookings yet."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[800px]">
      {bookings.map((booking: any) => {
        // ดึงข้อมูล hotel (อาจเป็น populated object หรือ string)
        const hotelName =
          typeof booking.hotel === "object"
            ? booking.hotel.name
            : "Unknown Hotel";

        const hotelAddress =
          typeof booking.hotel === "object"
            ? booking.hotel.address
            : undefined;

        // ดึงชื่อ user (สำหรับ admin view)
        const userName =
          typeof booking.user === "object" ? booking.user.name : undefined;

        // กำหนด edit path ตาม mode
        const editPath = isAdmin
          ? `/admin/bookings/edit/${booking._id}`
          : `/mybooking/edit/${booking._id}`;

        return (
          <BookingCard
            key={booking._id}
            bookingId={booking._id}
            hotelName={hotelName}
            hotelAddress={hotelAddress}
            bookingDate={booking.bookingDate}
            numOfNights={booking.numOfNights}
            isAdmin={isAdmin}
            userName={userName}
            editPath={editPath}
          />
        );
      })}
    </div>
  );
}
