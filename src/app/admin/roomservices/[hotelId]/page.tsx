import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getHotel from "@/libs/getHotel";
import getRoomServices from "@/libs/getRoomServices";
import PageShell, { PageHeader } from "@/components/layout/PageShell";
import AdminRoomServicePanel from "@/components/admin/AdminRoomServicePanel";

export const metadata = { title: "Manage Services · Admin" };
export const dynamic = "force-dynamic";

export default async function AdminRoomServicesPerHotel({
  params,
}: {
  params: Promise<{ hotelId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") redirect("/");
  const { hotelId } = await params;

  const [hotelRes, servicesRes] = await Promise.all([
    getHotel(hotelId),
    getRoomServices(hotelId, { includeInactive: true, token: session.user.token }).catch(() => ({
      data: [],
    })),
  ]);
  const hotel = hotelRes?.data;
  if (!hotel) {
    return (
      <PageShell narrow>
        <p className="text-white text-center text-sm">Hotel not found.</p>
      </PageShell>
    );
  }

  return (
    <PageShell wide>
      <PageHeader
        eyebrow={hotel.name}
        title="Manage services"
        description="Add, edit, or deactivate the services guests can pick at booking time."
      />
      <Link
        href="/admin/roomservices"
        className="inline-block text-gold text-xs uppercase tracking-widest mb-6 hover:text-[#f5d78e]"
      >
        ← All hotels
      </Link>
      <AdminRoomServicePanel hotelId={hotelId} initialServices={servicesRes.data || []} />
    </PageShell>
  );
}
