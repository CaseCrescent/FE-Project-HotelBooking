// ===========================================
// src/libs/getBooking.ts
// GET /api/v1/bookings/:id
// - ดึง booking เดียวตาม id (ต้อง login — ส่ง Bearer token)
// - ใช้ในหน้า edit booking เพื่อ pre-fill ข้อมูลเดิม
// - ไฟล์ใหม่ที่เว็บ Venue ไม่มี
// - ตรงกับ Backend controllers/bookings.js > exports.getBooking
//   ที่ return { success, data: { _id, bookingDate, numOfNights, user, hotel } }
//   โดย populate hotel ให้ได้ { name, address, tel }
// ===========================================

export default async function getBooking(token: string, id: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/bookings/${id}`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch booking");
  }

  return await response.json();
}
