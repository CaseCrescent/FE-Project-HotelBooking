// ===========================================
// src/libs/isValidImageUrl.ts
// ตรวจสอบว่า URL รูปภาพถูกต้องหรือไม่
// - รองรับ: https/http URL, local path (/img/...), base64 DataURL
// - ป้องกัน URL ที่ขาด :// หรือ domain ผิดรูป (เกิดจาก sanitizer bug เดิม)
// ===========================================

export function isValidImageUrl(url?: string | null): boolean {
  if (!url) return false;
  if (url.startsWith("data:")) return true;  // base64 DataURL
  if (url.startsWith("/")) return true;       // local path
  if (!url.includes("://")) return false;     // corrupted URL (missing //)
  try {
    const u = new URL(url);
    return (u.protocol === "https:" || u.protocol === "http:") && u.hostname.includes(".");
  } catch {
    return false;
  }
}
