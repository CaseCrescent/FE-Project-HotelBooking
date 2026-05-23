import { Suspense } from "react";
import Hero from "@/components/landing/Hero";
import StatStrip from "@/components/landing/StatStrip";
import Features from "@/components/landing/Features";
import HotelPreviewStrip from "@/components/landing/HotelPreviewStrip";
import { SkeletonHotelGrid } from "@/components/shared/Skeletons";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <StatStrip />
      <Features />
      <Suspense
        fallback={
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-12 py-16 md:py-24">
            <SkeletonHotelGrid count={6} />
          </div>
        }
      >
        <HotelPreviewStrip />
      </Suspense>
    </main>
  );
}
