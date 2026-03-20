// ===========================================
// src/app/api/auth/[...nextauth]/authOptions.ts
// NextAuth Configuration
// - ใช้ CredentialsProvider (email + password)
// - เรียก Backend POST /api/v1/auth/login เพื่อรับ token
// - เก็บ token ไว้ใน JWT session เพื่อใช้ใน Authorization header
// - โครงสร้างเดียวกับเว็บ Venue เดิม (authOptions.ts)
//   แต่เปลี่ยน Backend URL เป็น Hotel Booking API
// ===========================================

import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import userLogIn from "@/libs/userLogIn";
import getUserProfile from "@/libs/getUserProfile";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      // ชื่อที่แสดงในหน้า sign-in (ไม่ใช้หน้า default เพราะสร้าง custom login)
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        if (!credentials) return null;

        try {
          // 1. เรียก Backend login → ได้ token กลับมา
          const loginResponse = await userLogIn(
            credentials.email,
            credentials.password
          );

          if (!loginResponse.success || !loginResponse.token) {
            return null;
          }

          // 2. ใช้ token ไปดึง profile user (เพื่อได้ name, role, tel, etc.)
          const profileResponse = await getUserProfile(loginResponse.token);

          if (!profileResponse.success) {
            return null;
          }

          // 3. Return user object → จะถูกเก็บใน JWT token
          return {
            id: profileResponse.data._id, // NextAuth ต้องการ id
            _id: profileResponse.data._id,
            name: profileResponse.data.name,
            email: profileResponse.data.email,
            tel: profileResponse.data.tel,
            role: profileResponse.data.role,
            token: loginResponse.token, // เก็บ Bearer token ไว้ใช้เรียก API
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],

  // ใช้ JWT strategy (ไม่ใช้ database session)
  session: { strategy: "jwt" },

  // Custom login page (ไม่ใช้ NextAuth default)
  pages: {
    signIn: "/login",
  },

  callbacks: {
    // เก็บข้อมูล user ทั้งหมดลงใน JWT token
    async jwt({ token, user }) {
      return { ...token, ...user };
    },

    // ส่งข้อมูลจาก JWT token → session (ให้ client ใช้ได้)
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
};
