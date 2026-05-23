import PageShell, { PageHeader } from "@/components/layout/PageShell";
import FindEarliestClient from "@/components/find/FindEarliestClient";

export const metadata = {
  title: "Find Earliest Room · Hotel Booking",
  description: "Find the earliest available room across every partner hotel for your trip length.",
};

export default function FindEarliestPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Smart finder"
        title="Earliest available room"
        description="Pick how many nights and how far ahead you can search — we'll find the closest open window across every partner."
      />
      <FindEarliestClient />
    </PageShell>
  );
}
