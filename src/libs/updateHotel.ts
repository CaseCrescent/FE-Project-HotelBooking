// ===========================================
// src/libs/updateHotel.ts
// PUT /api/v1/hotels/:id
// - แก้ไขข้อมูลโรงแรม (เฉพาะ admin — ส่ง Bearer token)
// - ส่ง { name, address, tel } ใน body (ส่งเฉพาะ field ที่แก้ก็ได้)
// - ไฟล์ใหม่สำหรับ admin hotel management
// - ตรงกับ Backend controllers/hotels.js > exports.updateHotel
//   ที่ใช้ findByIdAndUpdate พร้อม runValidators: true
// ===========================================

// ⚠️ Backend รับเฉพาะ name, address, tel — picture จัดการใน Redux frontend เท่านั้น
export default async function updateHotel(
  token: string,
  hotelId: string,
  name: string,
  address: string,
  tel: string
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/hotels/${hotelId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, address, tel }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update hotel");
  }

  return data;
}
