// ===========================================
// src/libs/getUserProfile.ts
// GET /api/v1/auth/me
// - ส่ง Bearer token → ได้ข้อมูล user กลับมา (name, tel, email, role)
// - ใช้ใน authOptions.ts ตอน login เพื่อดึง profile
// - โครงสร้างเดียวกับเว็บ Venue เดิม (getUserProfile.ts) แต่เปลี่ยน URL
// - ตรงกับ Backend controllers/auth.js > exports.getMe
// ===========================================

export default async function getUserProfile(token: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/auth/me`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get user profile");
  }

  return await response.json();
}
