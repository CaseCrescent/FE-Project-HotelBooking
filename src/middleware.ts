// ===========================================
// middleware.ts
// Route Protection Middleware
// - ป้องกัน route ที่ต้อง login ก่อนเข้าถึง
// - /admin/* เฉพาะ role=admin เท่านั้น
// - /booking, /mybooking ต้อง login ก่อน
// - ใช้ NextAuth getToken() เพื่อตรวจ session
// ===========================================

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Routes ที่ต้อง login ก่อนเข้าถึง
  const protectedRoutes = ["/booking", "/mybooking", "/profile"];

  // Routes ที่เฉพาะ admin เท่านั้น
  const adminRoutes = ["/admin"];

  // ตรวจสอบ protected routes — ต้อง login ก่อน
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !token) {
    // ยังไม่ login → redirect ไปหน้า login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ตรวจสอบ admin routes — ต้องเป็น admin เท่านั้น
  const isAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isAdminRoute) {
    if (!token) {
      // ยังไม่ login → redirect ไปหน้า login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if ((token as any).role !== "admin") {
      // login แล้วแต่ไม่ใช่ admin → redirect ไปหน้าหลัก
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// กำหนดว่า middleware จะทำงานกับ routes ไหนบ้าง
export const config = {
  matcher: ["/booking/:path*", "/mybooking/:path*", "/admin/:path*", "/profile/:path*"],
};
