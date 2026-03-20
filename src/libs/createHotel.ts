// ===========================================
// src/libs/createHotel.ts
// POST /api/v1/hotels
// - สร้างโรงแรมใหม่ (เฉพาะ admin — ส่ง Bearer token)
// - ส่ง { name, address, tel } ใน body
// - ไฟล์ใหม่สำหรับ admin hotel management
// - ตรงกับ Backend controllers/hotels.js > exports.createHotel
//   ที่ตรวจสอบ:
//   - ต้องเป็น admin (routes/hotels.js: authorize('admin'))
//   - name ต้อง unique, ไม่เกิน 50 ตัวอักษร
//   - return { success: true, data: hotel }
// ===========================================

// ⚠️ Backend รับเฉพาะ name, address, tel — picture จัดการใน Redux frontend เท่านั้น
export default async function createHotel(
  token: string,
  name: string,
  address: string,
  tel: string
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/hotels`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, address, tel }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create hotel");
  }

  return data;
}
