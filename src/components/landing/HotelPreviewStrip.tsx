import Link from "next/link";
import getHotels from "@/libs/getHotels";
import HotelCard from "@/components/HotelCard";
import { Reveal, RevealItem } from "@/components/shared/Reveal";

interface HotelLite {
  _id: string;
  name: string;
  picture?: string | null;
  rating?: number | null;
  description?: string | null;
  pricePerNight?: number;
  address?: string;
}

export default async function HotelPreviewStrip() {
  const json = await getHotels(1, 6).catch(() => ({ success: false, data: [] }));
  const hotels: HotelLite[] = (json?.data ?? []).slice(0, 6);

  return (
    <section className="relative max-w-[1200px] mx-auto px-6 md:px-10 lg:px-12 py-20 md:py-28">
      <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <RevealItem>
          <div className="text-[11px] tracking-[0.32em] uppercase text-gold mb-3">Featured</div>
          <h2 className="text-white text-3xl md:text-5xl font-bold leading-tight">
            Stays that earn the{" "}
            <span className="bg-gradient-to-r from-[#f5d78e] via-[#dcb771] to-[#c5a059] bg-clip-text text-transparent">
              wishlist.
            </span>
          </h2>
        </RevealItem>
        <RevealItem>
          <Link
            href="/hotel"
            className="inline-flex items-center gap-2 text-gold hover:text-[#f5d78e] transition-colors text-sm font-bold tracking-widest uppercase group"
          >
            View all
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>
              →
            </span>
          </Link>
        </RevealItem>
      </Reveal>

      {hotels.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <p className="text-white/55">No hotels available right now.</p>
        </div>
      ) : (
        <Reveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel, i) => (
            <RevealItem key={hotel._id}>
              <Link href={`/hotel/${hotel._id}`} className="block h-full">
                <HotelCard
                  hotelId={hotel._id}
                  hotelName={hotel.name}
                  imgSrc={hotel.picture || undefined}
                  hotelRating={hotel.rating ?? null}
                  hotelDescription={hotel.description ?? null}
                  pricePerNight={hotel.pricePerNight}
                  index={i}
                />
              </Link>
            </RevealItem>
          ))}
        </Reveal>
      )}
    </section>
  );
}
