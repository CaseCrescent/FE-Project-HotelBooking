// ===========================================
// src/libs/createHotel.ts
// POST /api/v1/hotels
// - สร้าง hotel ใหม่ (ต้อง login เป็น admin — ส่ง Bearer token)
// - ส่ง { name, address, tel } เป็น required, { picture, rating, description } เป็น optional
// - optional fields จะถูก spread เข้า body เฉพาะเมื่อมีค่า (ไม่ส่ง key ที่ว่าง)
// - ตรงกับ Backend controllers/hotels.js > exports.createHotel
// ===========================================
*delete*
export default async function createHotel(
  token: string,
  name: string,
  address: string,
  tel: string,
  picture?: string,
  rating?: number,
  description?: string
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/hotels`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name, address, tel,
        ...(picture ? { picture } : {}),
        ...(rating ? { rating } : {}),
        ...(description ? { description } : {}),
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create hotel");
  }

  return data;
}
