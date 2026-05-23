// ===========================================
// next-auth.d.ts
// NextAuth Session Type Extension
// - ขยาย Session type ให้เก็บข้อมูล user ได้ครบ
// - โครงสร้างเดียวกับเว็บ Venue เดิม แต่เพิ่ม tel
// - token ที่ได้จาก Backend login จะถูกเก็บไว้ใน session
//   เพื่อใช้ใน Authorization header ทุกครั้งที่เรียก API
// ===========================================

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      name: string;
      email: string;
      tel: string;
      role: string; // "user" | "admin"
      token: string; // Bearer token จาก Backend
    };
  }
}
