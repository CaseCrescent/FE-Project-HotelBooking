import { SkeletonHotelGrid } from "@/components/shared/Skeletons";
import PageShell, { PageHeader } from "@/components/layout/PageShell";

export default function HotelLoading() {
  return (
    <PageShell wide>
      <PageHeader
        eyebrow="Our Catalogue"
        title="Loading hotels…"
        description="Click a hotel to view rooms, check live availability, and reserve in under a minute."
      />
      <SkeletonHotelGrid count={6} />
    </PageShell>
  );
}
