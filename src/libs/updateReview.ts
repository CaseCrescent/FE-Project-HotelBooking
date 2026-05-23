import { extractError } from "./extractError";

export default async function updateReview(
  token: string,
  reviewId: string,
  patch: { score?: number; comment?: string }
) {
  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/reviews/${reviewId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(await extractError(res, "Could not update review"));
  return res.json();
}
