// ===========================================
// src/libs/getBookings.ts
// GET /api/v1/bookings
// - ดึง bookings (ต้อง login — ส่ง Bearer token)
// - user role = "user" → เห็นเฉพาะ booking ของตัวเอง
// - user role = "admin" → เห็น booking ทั้งหมดของทุกคน
// - ไฟล์ใหม่ที่เว็บ Venue ไม่มี (Venue เก็บใน Redux ไม่เรียก API)
// - ตรงกับ Backend controllers/bookings.js > exports.getBookings
//   ที่ return { success, count, data: [...bookings] }
//   โดย populate hotel ให้ได้ { name, address, tel }
// ===========================================

export default async function getBookings(token: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/bookings`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
      // ไม่ cache เพื่อให้เห็นข้อมูลล่าสุดเสมอ
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch bookings");
  }

  return await response.json();
}
