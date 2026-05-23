import { Suspense } from "react";
import HotelCatalog from "@/components/HotelCatalog";
import getHotels from "@/libs/getHotels";
import { SkeletonHotelGrid } from "@/components/shared/Skeletons";
import PageShell, { PageHeader } from "@/components/layout/PageShell";

export const metadata = {
  title: "Hotels · Hotel Booking",
  description: "Browse handpicked partner hotels with real-time availability.",
};

export default function HotelPage() {
  const hotels = getHotels();
  return (
    <PageShell wide>
      <PageHeader
        eyebrow="Our Catalogue"
        title={
          <>
            Every hotel.{" "}
            <span className="bg-gradient-to-r from-[#f5d78e] via-[#dcb771] to-[#c5a059] bg-clip-text text-transparent">
              One booking.
            </span>
          </>
        }
        description="Click a hotel to view rooms, check live availability, and reserve in under a minute."
      />
      <Suspense fallback={<SkeletonHotelGrid count={6} />}>
        <HotelCatalog hotelsJson={hotels} />
      </Suspense>
    </PageShell>
  );
}
