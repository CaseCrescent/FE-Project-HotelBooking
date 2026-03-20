// ===========================================
// src/libs/deleteHotel.ts
// DELETE /api/v1/hotels/:id
// - ลบโรงแรม (เฉพาะ admin — ส่ง Bearer token)
// - Backend จะ cascade delete bookings ที่เกี่ยวข้องด้วย
//   (ตาม models/Hotel.js: HotelSchema.pre('deleteOne') → deleteMany bookings)
// - ไฟล์ใหม่สำหรับ admin hotel management
// - ตรงกับ Backend controllers/hotels.js > exports.deleteHotel
// ===========================================

export default async function deleteHotel(token: string, hotelId: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/hotels/${hotelId}`,
    {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete hotel");
  }

  return data;
}
