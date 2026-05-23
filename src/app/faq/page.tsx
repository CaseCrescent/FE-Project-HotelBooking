import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import InfoPageLayout from "@/components/info/InfoPageLayout";
import FaqTabs from "@/components/info/Faq/FaqTabs";

export const metadata = { title: "FAQ · Hotel Booking" };

export default async function FaqPage() {
  const session = await getServerSession(authOptions);
  // Public FAQ has only two tabs. Admin questions live on the /admin dashboard
  // so moderation / cascade / ban semantics are never exposed to non-admin visitors.
  const role: "guest" | "user" = session?.user?.token ? "user" : "guest";
  const isAdmin = session?.user?.role === "admin";

  return (
    <InfoPageLayout
      eyebrow="Help centre"
      title={
        <>
          Answers, in{" "}
          <span className="bg-gradient-to-r from-[#f5d78e] via-[#dcb771] to-[#c5a059] bg-clip-text text-transparent">
            seconds.
          </span>
        </>
      }
      description="Pick the tab that matches your flow. Logged-in users land on their tab automatically."
    >
      <FaqTabs initialRole={role} />
      {isAdmin && (
        <p className="text-white/45 text-xs text-center mt-2">
          Looking for moderation, services, or user-management answers? Those live on the{" "}
          <a href="/admin" className="text-gold hover:text-[#f5d78e]">admin dashboard</a>.
        </p>
      )}
    </InfoPageLayout>
  );
}
