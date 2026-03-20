// ===========================================
// src/libs/deleteBooking.ts
// DELETE /api/v1/bookings/:id
// - ลบ booking (ต้อง login — ส่ง Bearer token)
// - user ลบได้เฉพาะ booking ของตัวเอง
// - admin ลบได้ทุก booking
// - ไฟล์ใหม่ที่เว็บ Venue ไม่มี (Venue ลบใน Redux ไม่เรียก API)
// - ตรงกับ Backend controllers/bookings.js > exports.deleteBooking
//   ที่ตรวจสอบ:
//   - booking ต้องมีอยู่จริง (404 ถ้าไม่มี)
//   - ต้องเป็น owner หรือ admin (401 ถ้าไม่ใช่)
//   - สำเร็จ → return { success: true, data: {} }
// ===========================================

export default async function deleteBooking(token: string, bookingId: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/bookings/${bookingId}`,
    {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete booking");
  }

  return data;
}
