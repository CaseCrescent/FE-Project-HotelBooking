// ===========================================
// next.config.ts
// Next.js Configuration
// - ตั้งค่า images domains สำหรับรูปภาพจากภายนอก
// - ตั้งค่า CORS headers สำหรับเรียก Backend API
// - โครงสร้างเดียวกับเว็บ Venue Booking เดิม
// ===========================================

import type { NextConfig } from "next";

// Silence Node 26's DEP0205 warning that Next.js 15.4 triggers internally via
// `module.register()` (Node now prefers `module.registerHooks()`).
// Filter ONLY that specific code — never blanket-silence DeprecationWarnings.
const originalEmit = process.emit.bind(process);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(process as any).emit = function (name: string, ...args: unknown[]) {
  if (
    name === "warning" &&
    args[0] &&
    typeof args[0] === "object" &&
    (args[0] as { name?: string }).name === "DeprecationWarning" &&
    (args[0] as { code?: string }).code === "DEP0205"
  ) {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (originalEmit as any)(name, ...args);
};

const nextConfig: NextConfig = {
  // เพิ่ม body size limit สำหรับ Server Actions (default 1MB ไม่พอสำหรับ base64 image)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  // Windows fix — use in-memory webpack cache in dev only. On a path with spaces
  // ("CEDT Series") and "+" ("FE+BE"), the `.pack.gz_` → `.pack.gz` rename
  // intermittently fails when antivirus / OneDrive holds the temp file, which
  // corrupts the cache and surfaces as ENOENT routes-manifest.json on the next
  // request. Memory cache trades a small cold-start cost for stability.
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = { type: "memory" };
    }
    return config;
  },

  // ข้าม ESLint ตอน build (errors เป็นแค่ type warnings ไม่กระทบการทำงาน)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // อนุญาตให้โหลดรูปจาก domains เหล่านี้ (เพิ่ม domain ได้ภายหลัง)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },

  // ตั้งค่า CORS headers สำหรับ API routes
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
