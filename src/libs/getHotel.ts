// ===========================================
// src/libs/getHotel.ts
// GET /api/v1/hotels/:id
// - ดึงรายละเอียดโรงแรมเฉพาะ 1 แห่ง (public, ไม่ต้อง login)
// - โครงสร้างเดียวกับเว็บ Venue เดิม (getVenue.ts) แต่เปลี่ยน URL
// - ตรงกับ Backend controllers/hotels.js > exports.getHotel
//   ที่ return { success, data: { _id, name, address, tel } }
// ===========================================

import { extractError } from "./extractError";

export default async function getHotel(id: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/hotels/${id}`,
    {
      next: { tags: ["hotels"] },
    }
  );

  if (!response.ok) {
    throw new Error(await extractError(response, "Could not load hotel"));
  }

  return await response.json();
}
// ===========================================