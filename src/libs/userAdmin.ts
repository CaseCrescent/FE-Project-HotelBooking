import { extractError } from "./extractError";

type AdminVerb = "ban" | "unban" | "promote" | "demote";

async function adminAction(token: string, userId: string, verb: AdminVerb) {
  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/users/${userId}/${verb}`, {
    method: "PATCH",
    headers: { authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await extractError(res, `Could not ${verb} user`));
  return res.json();
}

export const banUser = (token: string, id: string) => adminAction(token, id, "ban");
export const unbanUser = (token: string, id: string) => adminAction(token, id, "unban");
export const promoteUser = (token: string, id: string) => adminAction(token, id, "promote");
export const demoteUser = (token: string, id: string) => adminAction(token, id, "demote");
