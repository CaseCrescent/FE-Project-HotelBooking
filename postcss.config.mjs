// ===========================================
// postcss.config.mjs
// PostCSS Configuration
// - ใช้ @tailwindcss/postcss สำหรับ Tailwind CSS v4
// - โครงสร้างเดียวกับเว็บ Venue เดิม
// ===========================================

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
