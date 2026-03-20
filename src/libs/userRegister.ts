// ===========================================
// src/libs/userRegister.ts
// POST /api/v1/auth/register
// - รับ name, tel, email, password → สร้าง user ใหม่
// - ไฟล์ใหม่ที่เว็บ Venue ไม่มี (Venue ไม่มีหน้า Register)
// - ตรงกับ Backend controllers/auth.js > exports.register
//   ที่รับ {name, tel, email, password, role} ใน req.body
// ===========================================

export default async function userRegister(
  name: string,
  tel: string,
  email: string,
  password: string
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        tel,
        email,
        password,
        // role ไม่ส่ง → Backend จะตั้งเป็น "user" by default
        // (ตาม models/User.js: default: 'user')
      }),
    }
  );

  if (!response.ok) {
    // ดึง error message จาก Backend เพื่อแสดงให้ user เห็น
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to register");
  }

  return await response.json();
}
