import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getHotel from "@/libs/getHotel";
import getReviews from "@/libs/getReviews";
import HotelDetailClient from "./HotelDetailClient";
import AvailabilityStrip from "@/components/hotel/AvailabilityStrip";
import HotelMap from "@/components/hotel/HotelMap";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewForm from "@/components/reviews/ReviewForm";
import RevealSection from "@/components/motion/RevealSection";
import { isValidImageUrl } from "@/libs/isValidImageUrl";

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ hid: string }>;
}) {
  const { hid } = await params;
  const [hotelDetail, reviewsRes, session] = await Promise.all([
    getHotel(hid),
    getReviews(hid).catch(() => ({ success: false, count: 0, data: [] })),
    getServerSession(authOptions),
  ]);
  const hotel = hotelDetail.data;
  const reviews = reviewsRes?.data ?? [];
  const currentUserId = session?.user?._id;
  const isAdmin = session?.user?.role === "admin";
  const isLoggedIn = !!session?.user?.token;
  const ownReview = currentUserId
    ? reviews.find((r) => {
        const uid = typeof r.user === "object" && r.user ? r.user._id : r.user;
        return uid === currentUserId;
      })
    : undefined;

  if (!hotel) {
    return (
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6">
        <div className="glass-card-gold p-10 text-center max-w-md">
          <h1 className="text-white text-xl font-bold">Hotel not found</h1>
          <Link href="/hotel" className="inline-block mt-4 text-gold hover:text-[#f5d78e] text-sm">
            ← Back to all hotels
          </Link>
        </div>
      </main>
    );
  }

  const defaults = ["/img/hotel.jpg", "/img/hotel2.jpg", "/img/hotel3.jpg"];
  const idx =
    hotel.name.split("").reduce((s: number, c: string) => s + c.charCodeAt(0), 0) % defaults.length;
  const heroImg = isValidImageUrl(hotel.picture) ? hotel.picture! : defaults[idx];

  return (
    <main className="min-h-[calc(100vh-64px)] pb-20 md:pb-28">
      {/* Hero banner */}
      <section className="relative w-full h-[42vh] min-h-[300px] max-h-[480px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroImg} alt={hotel.name} className="absolute inset-0 w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(12,10,22,0.35) 0%, rgba(12,10,22,0.95) 100%)",
          }}
        />
        <div className="relative z-10 max-w-[1200px] mx-auto h-full px-6 md:px-10 lg:px-12 flex flex-col justify-end pb-10">
          <Link
            href="/hotel"
            className="text-white/55 hover:text-white text-xs tracking-widest uppercase mb-3"
          >
            ← All hotels
          </Link>
          <div className="text-[11px] tracking-[0.32em] uppercase text-gold mb-2">Partner hotel</div>
          <h1 className="text-white font-bold leading-tight tracking-tight text-3xl md:text-5xl lg:text-6xl">
            {hotel.name}
          </h1>
          <p className="mt-2 text-white/70 text-sm md:text-base max-w-2xl">{hotel.address}</p>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-12 mt-10 md:mt-14 grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-10">
        {/* Main column */}
        <div className="flex flex-col gap-6 lg:gap-8 min-w-0">
          <RevealSection as="div" className="glass-card p-6 md:p-8">
            <div className="text-[11px] tracking-[0.32em] uppercase text-gold mb-3">About</div>
            <HotelDetailClient
              hotelId={hotel._id}
              hotelName={hotel.name}
              apiRating={hotel.rating}
              apiDescription={hotel.description}
            />
            <p className="mt-4 text-white/70 text-base leading-relaxed">
              {hotel.description ||
                "A curated partner property. Real-time availability shown below — pick a date and proceed to the booking wizard to confirm."}
            </p>
          </RevealSection>

          <RevealSection as="div" className="glass-card p-6 md:p-8">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <h2 className="text-white font-bold text-lg md:text-xl">Availability — next 10 days</h2>
              <span className="text-[11px] uppercase tracking-widest text-white/40">
                Live · updates every 25s
              </span>
            </div>
            <AvailabilityStrip hotelId={hotel._id} />
            <p className="mt-4 text-white/40 text-xs">
              Green = open · Amber = scarce · Red = fully booked
            </p>
          </RevealSection>

          <RevealSection as="div">
            <HotelMap address={hotel.address} name={hotel.name} />
          </RevealSection>

          {/* Reviews */}
          <RevealSection className="flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="text-[11px] tracking-[0.32em] uppercase text-gold mb-1">Guest reviews</div>
                <h2 className="text-white font-bold text-lg md:text-xl">
                  {reviews.length > 0
                    ? `${reviews.length} ${reviews.length === 1 ? "review" : "reviews"}`
                    : "No reviews yet"}
                </h2>
              </div>
              {hotel.rating != null && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#dcb771]/12 border border-[#dcb771]/30">
                  <span className="text-[#f5d78e] text-base leading-none">★</span>
                  <span className="text-white font-bold tabular-nums">{Number(hotel.rating).toFixed(1)}</span>
                  <span className="text-white/50 text-[11px] uppercase tracking-widest">avg</span>
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <ReviewForm
                hotelId={hotel._id}
                existing={
                  ownReview
                    ? { _id: ownReview._id, score: ownReview.score, comment: ownReview.comment }
                    : null
                }
              />
            ) : (
              <div className="glass-card p-5 text-center">
                <p className="text-white/55 text-sm">
                  <Link href={`/login?callbackUrl=/hotel/${hotel._id}`} className="text-gold hover:text-[#f5d78e]">
                    Sign in
                  </Link>{" "}
                  to leave a review.
                </p>
              </div>
            )}

            <ReviewList
              reviews={reviews}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              isLoggedIn={isLoggedIn}
            />
          </RevealSection>
        </div>

        {/* Sticky booking aside */}
        <aside className="lg:sticky lg:top-[80px] self-start">
          <div className="glass-card-gold p-6 md:p-7">
            <div className="text-[11px] tracking-[0.32em] uppercase text-gold mb-3">Book this hotel</div>
            <p className="text-white/70 text-sm mb-6 leading-relaxed">
              Reserve up to 3 nights. Cancel any time. Confirmation receipt issued instantly.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <InfoChip label="Telephone" value={hotel.tel} />
              <InfoChip label="Address" value={hotel.address} />
            </div>

            <Link
              href={`/booking?hotel=${hotel._id}`}
              className="block w-full text-center px-6 py-4 rounded-full gradient-gold text-[#1a1730] font-bold tracking-widest text-xs uppercase shadow-elegant hover:-translate-y-0.5 transition-transform"
            >
              Continue to booking
            </Link>
            <Link
              href="/hotel"
              className="mt-3 block w-full text-center px-6 py-3 rounded-full border border-white/15 text-white/80 text-xs tracking-widest uppercase font-semibold hover:bg-white/[0.04] transition-colors"
            >
              Browse other hotels
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 min-w-0">
      <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{label}</div>
      <div className="text-white/90 text-xs truncate">{value}</div>
    </div>
  );
}
