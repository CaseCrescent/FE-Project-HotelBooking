import { SkeletonBookingGrid } from "@/components/shared/Skeletons";
import PageShell, { PageHeader } from "@/components/layout/PageShell";

export default function MyBookingLoading() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Your stays"
        title="Loading bookings…"
        description="Edit, cancel, or share any booking from one place."
      />
      <SkeletonBookingGrid count={4} />
    </PageShell>
  );
}
