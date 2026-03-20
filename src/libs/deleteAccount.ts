// ===========================================
// src/libs/deleteAccount.ts
// DELETE /api/v1/auth/delete
// - ลบ account ของ user ที่ login อยู่ (Extra Credit)
// - ตรงกับ Backend controllers/auth.js > exports.deleteMe
//   ที่ใช้ findByIdAndDelete(req.user.id)
//   return { success: true, message: 'Account deleted successfully' }
// ===========================================

export default async function deleteAccount(token: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/auth/delete`,
    {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete account");
  }

  return data;
}
