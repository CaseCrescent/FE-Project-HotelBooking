import Link from "next/link";
import HotelCard from "./HotelCard";
import { Reveal, RevealItem } from "@/components/shared/Reveal";
import EmptyState from "@/components/shared/EmptyState";

interface HotelLite {
  _id: string;
  name: string;
  picture?: string | null;
  rating?: number | null;
  description?: string | null;
  pricePerNight?: number;
}

export default async function HotelCatalog({ hotelsJson }: { hotelsJson: Promise<{ success: boolean; data: HotelLite[] }> }) {
  const hotelJsonReady = await hotelsJson;

  if (!hotelJsonReady.success || !hotelJsonReady.data || hotelJsonReady.data.length === 0) {
    return (
      <EmptyState
        title="No hotels available right now"
        description="Check back soon, or follow the link below to be notified when partner inventory opens."
        ctaLabel="Notify me"
        ctaHref="/"
      />
    );
  }

  return (
    <>
      <div className="mb-8 flex items-center gap-3">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card-gold text-[11px] tracking-widest uppercase text-gold-light">
          <span className="w-1.5 h-1.5 rounded-full bg-[#dcb771] pulse-gold" />
          {hotelJsonReady.data.length} {hotelJsonReady.data.length === 1 ? "hotel" : "hotels"} available
        </span>
      </div>

      <Reveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {hotelJsonReady.data.map((hotel: HotelLite, index: number) => (
          <RevealItem key={hotel._id} className="flex justify-center">
            <Link href={`/hotel/${hotel._id}`} className="block w-full max-w-[360px]">
              <HotelCard
                hotelId={hotel._id}
                hotelName={hotel.name}
                imgSrc={hotel.picture || undefined}
                hotelRating={hotel.rating ?? null}
                hotelDescription={hotel.description ?? null}
                pricePerNight={hotel.pricePerNight}
                index={index}
              />
            </Link>
          </RevealItem>
        ))}
      </Reveal>
    </>
  );
}
