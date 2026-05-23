import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getReviews from "@/libs/getReviews";
import PageShell, { PageHeader } from "@/components/layout/PageShell";
import AdminReviewRow from "@/components/admin/AdminReviewRow";

export const metadata = { title: "Reviews · Admin · Hotel Booking" };
export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") redirect("/");

  let reviews: Awaited<ReturnType<typeof getReviews>>["data"] = [];
  let loadError: string | null = null;
  try {
    const res = await getReviews();
    reviews = res.data || [];
  } catch (e) {
    loadError = (e as Error).message;
  }

  return (
    <PageShell wide>
      <PageHeader
        eyebrow="Admin console"
        title="Moderate reviews"
        description="Delete spam or off-topic posts. Hotel ratings recompute automatically."
      />
      {loadError && (
        <div className="glass-card-gold p-4 mb-6">
          <p className="text-red-200 text-sm">Couldn't load reviews: {loadError}</p>
        </div>
      )}
      {reviews.length === 0 && !loadError ? (
        <div className="glass-card p-10 text-center">
          <p className="text-white/55 text-sm">No reviews to moderate.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((r) => (
            <AdminReviewRow key={r._id} review={r} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
