// ===========================================
// src/providers/NextAuthProvider.tsx
// NextAuth Session Provider (Client Component)
// - ครอบ children ด้วย SessionProvider
// - ให้ทุก component ใช้ useSession() ได้
// - โครงสร้างเหมือนเว็บ Venue เดิมเป๊ะ (NextAuthProvider.tsx)
// ===========================================

"use client";
import { SessionProvider } from "next-auth/react";

export default function NextAuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}): React.ReactNode {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
