// ===========================================
// src/libs/userLogIn.ts
// POST /api/v1/auth/login
// - รับ email + password → ส่งไป Backend → ได้ token กลับมา
// - ใช้ใน authOptions.ts ตอน NextAuth authorize
// - โครงสร้างเดียวกับเว็บ Venue เดิม (userLogIn.ts) แต่เปลี่ยน URL
// ===========================================

export default async function userLogIn(email: string, password: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to log in");
  }

  return await response.json();
}
