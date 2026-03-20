// ===========================================
// src/components/Banner.tsx
// Hero Banner (Client Component)
// - แสดง hero image เต็มจอ + ข้อความ + CTA button
// - ปรับจากเว็บ Venue เดิม (Banner.tsx) โดย:
//   1. เปลี่ยนข้อความเป็น Hotel theme
//   2. ปุ่ม CTA → "Explore Hotels" ไปหน้า /hotel
//   3. แสดง Welcome + ชื่อ user (เหมือนเว็บ Venue + Car Rental)
//   4. ใช้ CSS gradient background แทนรูป (เผื่อยังไม่มีรูป)
//      → เมื่อมีรูป banner.jpg แค่ uncomment Image tag
// ===========================================

"use client";
import { useState, useEffect } from "react";
import styles from "./banner.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Banner() {
  const { data: session } = useSession();
  const router = useRouter();

  // ป้องกัน hydration mismatch (เหมือนเว็บ Venue)
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // รูป cover 4 รูป — คลิก banner เพื่อเปลี่ยนรูป (เหมือนเว็บ Venue เดิม)
  const covers = ["/img/cover.jpg", "/img/cover2.jpg", "/img/cover3.jpg", "/img/cover4.jpg"];
  const [index, setIndex] = useState(0);

  return (
    <div
      className={styles.banner}
      onClick={() => setIndex((index + 1) % covers.length)}
    >
      {/* ===== Background Image — วนรูป cover 4 รูป (เหมือนเว็บ Venue เดิม) ===== */}
      <Image
        src={covers[index]}
        alt="Hotel Banner"
        fill={true}
        priority
        className="object-cover cursor-pointer"
      />

      {/* ===== ข้อความตรงกลาง ===== */}
      <div className={styles.bannerText}>
        {/* Welcome message — แสดงเมื่อ login แล้ว (เหมือนเว็บ Venue + Car Rental) */}
        {isMounted && session ? (
          <div className="mb-6 text-[#dcb771] text-lg font-medium tracking-[0.1em] uppercase drop-shadow-lg animate-fade-in">
            Welcome, {session.user?.name}
          </div>
        ) : null}

        <h1>Your perfect stay awaits</h1>
        <h3>
          Discover handpicked hotels for every occasion. Whether it&#39;s a
          business trip, family vacation, or weekend getaway, we connect you
          to the perfect room.
        </h3>
      </div>

      {/* ===== CTA Button ===== */}
      {/* ดีไซน์เหมือนปุ่ม "Select Venue" ของเว็บ Venue เดิม */}
      <button
        className="absolute bottom-12 right-12 z-30 w-[230px] h-[60px] bg-gradient-to-br from-[#e8c98c] to-[#dcb771] border border-white/40 text-[#1a1730] text-[17px] font-bold uppercase tracking-widest rounded-full shadow-[0_8px_30px_rgba(220,183,113,0.3)] transition-all duration-500 ease-out hover:from-[#f5d78e] hover:to-[#e8c98c] hover:shadow-[0_12px_40px_rgba(220,183,113,0.6)] hover:-translate-y-1"
        onClick={(e) => {
          e.stopPropagation(); // กัน click ไม่ให้เปลี่ยนรูป banner
          router.push("/hotel");
        }}
      >
        Explore Hotels
      </button>
    </div>
  );
}
