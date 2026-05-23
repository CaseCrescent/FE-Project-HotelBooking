import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getUsers from "@/libs/getUsers";
import PageShell, { PageHeader } from "@/components/layout/PageShell";
import AdminUsersTable from "@/components/admin/AdminUsersTable";

export const metadata = { title: "Users · Admin · Hotel Booking" };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") redirect("/");
  const currentUserId = session.user._id;

  let users: Awaited<ReturnType<typeof getUsers>>["data"] = [];
  let total = 0;
  let loadError: string | null = null;
  try {
    const res = await getUsers(session.user.token, { limit: 200 });
    users = res.data || [];
    total = res.total || users.length;
  } catch (e) {
    loadError = (e as Error).message;
  }

  return (
    <PageShell wide>
      <PageHeader
        eyebrow="Admin console"
        title="Users"
        description="Promote, demote, ban, or unban — banned users lose access immediately."
      />
      {loadError && (
        <div className="glass-card-gold p-4 mb-6">
          <p className="text-red-200 text-sm">Couldn't load users: {loadError}</p>
        </div>
      )}
      <p className="text-white/45 text-xs mb-4 uppercase tracking-widest">Total {total}</p>
      <AdminUsersTable users={users} currentUserId={currentUserId} />
    </PageShell>
  );
}
