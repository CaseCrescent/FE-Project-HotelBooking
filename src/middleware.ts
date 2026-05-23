// ===========================================
// middleware.ts
// Route Protection Middleware
// - ป้องกัน route ที่ต้อง login ก่อนเข้าถึง
// - /admin/* เฉพาะ role=admin เท่านั้น
// - /booking, /mybooking ต้อง login ก่อน
// - ใช้ NextAuth getToken() เพื่อตรวจ session
// Note: /booking (wizard) ไม่ถูก gate ในไฟล์นี้ — ถูก gate ที่ปุ่ม Confirm ในหน้าเอง
// เพื่อให้ guest browse wizard ได้ก่อน login (callbackUrl ส่งกลับมาที่ /booking)
// ===========================================

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const LOGGED_IN_REQUIRED = ["/mybooking", "/profile"];
const ADMIN_REQUIRED = ["/admin"];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname, search } = request.nextUrl;

  const needsLogin = LOGGED_IN_REQUIRED.some((r) => pathname === r || pathname.startsWith(`${r}/`));
  if (needsLogin && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  const needsAdmin = ADMIN_REQUIRED.some((r) => pathname === r || pathname.startsWith(`${r}/`));
  if (needsAdmin) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }
    if ((token as { role?: string }).role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/mybooking/:path*", "/admin/:path*", "/profile/:path*"],
};
