// ===========================================
// src/libs/createBooking.ts
// POST /api/v1/hotels/:hotelId/bookings
// - สร้าง booking ใหม่ (ต้อง login — ส่ง Bearer token)
// - ส่ง { bookingDate, numOfNights } ใน body
// - Backend จะเพิ่ม hotel (จาก URL param) และ user (จาก token) ให้อัตโนมัติ
// - ไฟล์ใหม่ที่เว็บ Venue ไม่มี (Venue เก็บใน Redux ไม่เรียก API)
// - ตรงกับ Backend controllers/bookings.js > exports.addBooking
//   ที่ตรวจสอบ:
//   - hotel ต้องมีอยู่จริง (404 ถ้าไม่มี)
//   - numOfNights ต้อง ≤ 3 สำหรับ user (400 ถ้าเกิน)
// ===========================================

export default async function createBooking(
  token: string,
  hotelId: string,
  bookingDate: string,
  numOfNights: number
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/hotels/${hotelId}/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        bookingDate,
        numOfNights,
      }),
    }
  );

  // ดึง response body ไม่ว่าจะสำเร็จหรือไม่ เพื่อแสดง error message ได้
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create booking");
  }

  return data;
}
