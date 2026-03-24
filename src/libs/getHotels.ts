// ===========================================
// src/libs/getHotels.ts
// GET /api/v1/hotels
// - ดึงรายการโรงแรมทั้งหมด (public, ไม่ต้อง login)
// - รองรับ pagination (?page=1&limit=8) ตาม Backend controllers/hotels.js
// - โครงสร้างเดียวกับเว็บ Venue เดิม (getVenues.ts)
//   แต่เปลี่ยน URL + เพิ่ม pagination params
// - ตรงกับ Backend controllers/hotels.js > exports.getHotels
//   ที่ return { success, count, pagination, data }
// ===========================================

export default async function getHotels(page?: number, limit?: number) {
  // สร้าง query string สำหรับ pagination
  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());

  const queryString = params.toString() ? `?${params.toString()}` : "";

  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/hotels${queryString}`,
    {
      // ไม่ cache เพื่อให้ได้ข้อมูลล่าสุดเสมอ (เผื่อ admin เพิ่ม/ลบ hotel)
      next: { tags: ["hotels"] },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch hotels");
  }

  return await response.json();
}
