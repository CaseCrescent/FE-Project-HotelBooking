// ===========================================
// src/app/api/auth/[...nextauth]/route.ts
// NextAuth Route Handler
// - Export GET และ POST handler จาก NextAuth
// - โครงสร้างเหมือนเว็บ Venue เดิมเป๊ะ (route.ts)
// ===========================================

import NextAuth from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
