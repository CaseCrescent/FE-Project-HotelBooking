import { extractError } from "./extractError";

export interface UserAdminRow {
  _id: string;
  name: string;
  email: string;
  tel: string;
  role: "user" | "admin";
  banned: boolean;
  bannedAt: string | null;
  createdAt: string;
}

export default async function getUsers(
  token: string,
  opts?: { role?: "user" | "admin"; banned?: boolean; page?: number; limit?: number }
): Promise<{
  success: boolean;
  count: number;
  total: number;
  pagination: { page: number; limit: number; pages: number };
  data: UserAdminRow[];
}> {
  const qs = new URLSearchParams();
  if (opts?.role) qs.set("role", opts.role);
  if (opts?.banned !== undefined) qs.set("banned", String(opts.banned));
  if (opts?.page) qs.set("page", String(opts.page));
  if (opts?.limit) qs.set("limit", String(opts.limit));
  const url = `${process.env.BACKEND_URL}/api/v1/users${qs.toString() ? `?${qs}` : ""}`;
  const res = await fetch(url, {
    cache: "no-store",
    headers: { authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await extractError(res, "Could not load users"));
  return res.json();
}
