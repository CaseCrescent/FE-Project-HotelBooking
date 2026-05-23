import getHotels from "@/libs/getHotels";
import BookingForm from "@/components/BookingForm";
import PageShell, { PageHeader } from "@/components/layout/PageShell";

type HotelLite = { _id: string; name: string; address: string; pricePerNight?: number };

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ hotel?: string; date?: string; nights?: string }>;
}) {
  const params = await searchParams;
  const hotelsData = await getHotels();
  const hotels: HotelLite[] =
    hotelsData.data?.map((h: HotelLite) => ({
      _id: h._id,
      name: h.name,
      address: h.address,
      pricePerNight: h.pricePerNight,
    })) || [];

  const prefilledNights = (() => {
    const n = Number(params.nights);
    if (!Number.isFinite(n)) return undefined;
    return Math.min(3, Math.max(1, Math.floor(n)));
  })();

  return (
    <PageShell>
      <PageHeader
        eyebrow="Booking wizard"
        title="Reserve in four steps."
        description="Hotel, dates, add-on services, review — sign-in is only required at the final confirm."
      />
      <BookingForm
        mode="create"
        hotels={hotels}
        initialHotelId={params.hotel || ""}
        prefilledDate={params.date}
        prefilledNights={prefilledNights}
      />
    </PageShell>
  );
}
