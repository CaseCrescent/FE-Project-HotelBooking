// ===========================================
// src/app/booking/page.tsx
// Server Component: Fetch data & Layout Wrapper
// ===========================================

import getHotels from "@/libs/getHotels";
import BookingForm from "@/components/BookingForm";

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ hotel?: string }>;
}) {
  const params = await searchParams;
  const preSelectedHotelId = params.hotel || "";

  // ดึงข้อมูลโรงแรมจากฝั่ง Server เพื่อความรวดเร็ว
  const hotelsData = await getHotels();
  const hotels = hotelsData.data?.map((h: { _id: string; name: string; address: string }) => ({
    _id: h._id,
    name: h.name,
    address: h.address,
  })) || [];

  return (
    // ⚠️ ใช้ style={{ paddingTop: "120px" }} เพื่อบังคับดันลงมา 120px 100% หมดปัญหา Tailwind ไม่ยอมอัปเดต ⚠️
    <main 
      className="min-h-screen bg-[#0d0b1a] pb-20 px-6 flex justify-center"
      style={{ paddingTop: "120px" }}
    >
      <div className="w-full max-w-[900px]">
        
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-[#dcb771] text-3xl font-bold mb-2">
            Reserve a Room
          </h1>
          <p className="text-[#6b7280] text-sm">
            Fill in the details below to complete your booking.
          </p>
        </div >

        {/* ฟอร์มจองโรงแรม */}
        <div style={{ paddingTop: "22px" }}>
        <BookingForm mode="create" hotels={hotels} initialHotelId={preSelectedHotelId} />
        </div>
      </div>
    </main>
  );
}