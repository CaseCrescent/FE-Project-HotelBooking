import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getHotels from "@/libs/getHotels";
import getBookings from "@/libs/getBookings";
import getReviews from "@/libs/getReviews";
import getUsers from "@/libs/getUsers";
import PageShell, { PageHeader } from "@/components/layout/PageShell";
import FaqAccordion from "@/components/info/Faq/FaqAccordion";
import { ADMIN_FAQ } from "@/components/info/Faq/faqContent";

export const metadata = { title: "Admin Console · Hotel Booking" };

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token || session.user.role !== "admin") {
    redirect("/");
  }
  const token = session.user.token;

  const [hotels, bookings, reviews, users] = await Promise.all([
    getHotels(1, 1).catch(() => ({ count: 0, data: [] })),
    getBookings(token).catch(() => ({ data: [] })),
    getReviews().catch(() => ({ count: 0, data: [] })),
    getUsers(token, { limit: 1 }).catch(() => ({ total: 0, data: [] })),
  ]);

  type BookingLite = {
    _id: string;
    bookingDate: string;
    status?: string;
    hotel?: { name?: string } | string;
    user?: { name?: string } | string;
  };
  type ReviewLite = {
    _id: string;
    score: number;
    comment?: string;
    user?: { name?: string } | string | null;
    hotel?: { name?: string } | string;
  };
  const allBookings: BookingLite[] = bookings.data || [];
  const counts: Record<string, number> = { confirmed: 0, cancelled: 0, completed: 0, checked_in: 0 };
  for (const b of allBookings) {
    const s = (b.status || "confirmed").toLowerCase();
    counts[s] = (counts[s] || 0) + 1;
  }

  const recentBookings = allBookings.slice(0, 5);
  const recentReviews: ReviewLite[] = (reviews.data || []).slice(0, 5);

  return (
    <PageShell wide>
      <PageHeader
        eyebrow="Admin console"
        title={
          <>
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-[#f5d78e] via-[#dcb771] to-[#c5a059] bg-clip-text text-transparent">
              {session.user.name?.split(" ")[0] || "Admin"}
            </span>
          </>
        }
        description="One panel for everything: hotels, bookings, reviews, services, users."
      />

      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-10">
        <KpiTile label="Hotels" value={hotels.count ?? hotels.data?.length ?? 0} href="/admin/hotels" accent />
        <KpiTile label="Bookings" value={allBookings.length} href="/admin/bookings" />
        <KpiTile label="Upcoming" value={counts.confirmed} />
        <KpiTile label="Checked-in" value={counts.checked_in} />
        <KpiTile label="Reviews" value={reviews.count ?? reviews.data?.length ?? 0} href="/admin/reviews" />
        <KpiTile label="Users" value={users.total ?? users.data?.length ?? 0} href="/admin/users" />
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent bookings */}
        <Panel title="Recent bookings" cta={{ label: "Manage all", href: "/admin/bookings" }}>
          {recentBookings.length === 0 ? (
            <EmptyRow text="No bookings yet" />
          ) : (
            <ul className="flex flex-col">
              {recentBookings.map((b) => {
                const hotelName = (typeof b.hotel === "object" && b.hotel?.name) || "Unknown hotel";
                const userName = (typeof b.user === "object" && b.user?.name) || "—";
                return (
                  <li key={b._id} className="flex items-center justify-between py-3 border-b border-white/[0.05] last:border-0">
                    <div className="min-w-0 flex-1 pr-3">
                      <div className="text-white text-sm font-semibold truncate">{hotelName}</div>
                      <div className="text-white/45 text-xs mt-0.5">{userName}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-white/70 text-xs">{new Date(b.bookingDate).toLocaleDateString()}</div>
                      <div className="text-[10px] uppercase tracking-widest text-gold/70 mt-0.5">{b.status || "confirmed"}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        {/* Recent reviews */}
        <Panel title="Recent reviews" cta={{ label: "Moderate", href: "/admin/reviews" }}>
          {recentReviews.length === 0 ? (
            <EmptyRow text="No reviews yet" />
          ) : (
            <ul className="flex flex-col">
              {recentReviews.map((r) => {
                const userName = (typeof r.user === "object" && r.user?.name) || "Guest";
                const hotelName = (typeof r.hotel === "object" && r.hotel?.name) || "Hotel";
                return (
                  <li key={r._id} className="py-3 border-b border-white/[0.05] last:border-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-white text-sm font-semibold truncate">
                          <span className="text-[#f5d78e]">{"★".repeat(r.score)}</span>{" "}
                          <span className="text-white/55">·</span> {userName}
                        </div>
                        <div className="text-white/45 text-xs mt-0.5 truncate">on {hotelName}</div>
                      </div>
                    </div>
                    {r.comment && (
                      <p className="text-white/65 text-xs mt-1 line-clamp-2">{r.comment}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>

      {/* Quick links */}
      <section className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
        <QuickLink href="/admin/hotels" label="Manage hotels" />
        <QuickLink href="/admin/roomservices" label="Room services" />
        <QuickLink href="/admin/users" label="Users" />
        <QuickLink href="/admin/reviews" label="Reviews" />
      </section>

      {/* Admin FAQ — kept here (not on public /faq) so moderation/cascade/ban
          semantics are never exposed to non-admin visitors. */}
      <section className="mt-12">
        <div className="mb-5">
          <div className="text-[11px] tracking-[0.32em] uppercase text-gold mb-2">Admin reference</div>
          <h2 className="text-white text-xl md:text-2xl font-bold">Operations & moderation FAQ</h2>
          <p className="text-white/55 text-sm mt-1">
            Internal answers for the admin role only. Public FAQ has no admin tab.
          </p>
        </div>
        <FaqAccordion items={ADMIN_FAQ} />
      </section>
    </PageShell>
  );
}

function KpiTile({
  label,
  value,
  href,
  accent,
}: {
  label: string;
  value: number;
  href?: string;
  accent?: boolean;
}) {
  const inner = (
    <div
      className={`rounded-2xl p-4 border transition-colors h-full ${
        accent
          ? "border-[#dcb771]/30 bg-[rgba(220,183,113,0.06)] hover:border-[#dcb771]/50"
          : "border-white/[0.06] bg-white/[0.02] hover:border-white/15"
      }`}
    >
      <div className="text-[10px] uppercase tracking-widest text-white/45">{label}</div>
      <div className={`text-2xl font-bold mt-1 tabular-nums ${accent ? "text-gold-light" : "text-white"}`}>
        {value}
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function Panel({
  title,
  cta,
  children,
}: {
  title: string;
  cta?: { label: string; href: string };
  children: React.ReactNode;
}) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-bold text-base">{title}</h2>
        {cta && (
          <Link
            href={cta.href}
            className="text-[11px] uppercase tracking-widest text-gold hover:text-[#f5d78e]"
          >
            {cta.label} →
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return <p className="text-white/45 text-sm py-6 text-center">{text}</p>;
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-4 text-center text-white/80 text-sm font-semibold uppercase tracking-widest hover:border-[#dcb771]/40 hover:text-gold transition-colors"
    >
      {label}
    </Link>
  );
}
