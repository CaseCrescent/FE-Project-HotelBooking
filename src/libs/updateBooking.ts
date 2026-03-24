// ===========================================
// src/libs/updateBooking.ts
// PUT /api/v1/bookings/:id
// - แก้ไข booking (ต้อง login — ส่ง Bearer token)
// - user แก้ได้เฉพาะ booking ของตัวเอง
// - admin แก้ได้ทุก booking
// - ส่ง { bookingDate, numOfNights } ใน body
// - ไฟล์ใหม่ที่เว็บ Venue ไม่มี (Venue ไม่มีฟีเจอร์ Edit)
// - ตรงกับ Backend controllers/bookings.js > exports.updateBooking
//   ที่ตรวจสอบ:
//   - booking ต้องมีอยู่จริง (404 ถ้าไม่มี)
//   - ต้องเป็น owner หรือ admin (401 ถ้าไม่ใช่)
//   - numOfNights ต้อง ≤ 3 สำหรับ user (400 ถ้าเกิน)
// ===========================================

export default async function updateBooking(
  token: string,
  bookingId: string,
  bookingDate: string,
  numOfNights: number,
  hotelId?: string  // ส่ง hotel id ถ้าต้องการเปลี่ยนโรงแรม (admin ใช้)
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/bookings/${bookingId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        bookingDate,
        numOfNights,
        ...(hotelId ? { hotel: hotelId } : {}),
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update booking");
  }

  return data;
}
