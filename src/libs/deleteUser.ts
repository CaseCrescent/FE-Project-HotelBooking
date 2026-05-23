// ===========================================
// src/libs/deleteUser.ts
// DELETE /api/v1/users/:userId
// - ลบ user (admin only — Backend ต้อง verify admin role)
// - แตกต่างจาก deleteAccount ที่เป็น self-delete ที่ /auth/delete
// - Backend อาจ return 204 No Content จึง guard JSON.parse
// ===========================================

import { extractError } from "./extractError";

export default async function deleteUser(token: string, userId: string) {
  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/users/${userId}`, {
    method: "DELETE",
    headers: { authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(await extractError(res, "Could not delete user"));
  }

  // Backend may return 204 No Content — guard the JSON parse so we don't
  // throw "Unexpected end of JSON input" on a successful empty response.
  const text = await res.text();
  return text ? JSON.parse(text) : { success: true };
}
