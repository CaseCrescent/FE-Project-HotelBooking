import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getHotels from "@/libs/getHotels";
import getRoomServices from "@/libs/getRoomServices";
import PageShell, { PageHeader } from "@/components/layout/PageShell";

export const metadata = { title: "Room Services · Admin · Hotel Booking" };
export const dynamic = "force-dynamic";

interface HotelLite {
  _id: string;
  name: string;
  address?: string;
}

export default async function AdminRoomServicesIndex() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") redirect("/");

  const hotelsRes = await getHotels(1, 50).catch(() => ({ data: [] }));
  const hotels = (hotelsRes.data || []) as HotelLite[];

  // For each hotel, fetch a count of services (active + inactive).
  const counts = await Promise.all(
    hotels.map((h) =>
      getRoomServices(h._id, { includeInactive: true, token: session.user.token })
        .then((res) => ({ id: h._id, count: res.count, active: res.data.filter((s) => s.active).length }))
        .catch(() => ({ id: h._id, count: 0, active: 0 }))
    )
  );
  const countMap = new Map(counts.map((c) => [c.id, c]));

  return (
    <PageShell wide>
      <PageHeader
        eyebrow="Admin console"
        title="Room services"
        description="Manage add-on services per hotel. Pick a hotel to edit its catalog."
      />
      {hotels.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <p className="text-white/55 text-sm">No hotels yet — add one first.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotels.map((h) => {
            const c = countMap.get(h._id) || { count: 0, active: 0 };
            return (
              <Link
                key={h._id}
                href={`/admin/roomservices/${h._id}`}
                className="glass-card p-5 hover:border-[#dcb771]/40 transition-colors group"
              >
                <div className="text-gold text-base font-bold truncate group-hover:text-[#f5d78e]">{h.name}</div>
                {h.address && <div className="text-white/45 text-xs mt-0.5 truncate">{h.address}</div>}
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-2xl font-bold text-white tabular-nums">{c.active}</span>
                  <span className="text-[10px] uppercase tracking-widest text-white/40">
                    active · {c.count} total
                  </span>
                </div>
                <span className="text-gold text-xs mt-3 inline-block tracking-widest uppercase font-bold">
                  Manage →
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
