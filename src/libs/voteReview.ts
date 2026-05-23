import { extractError } from "./extractError";

export type VoteValue = "like" | "dislike" | null;

export default async function voteReview(
  token: string,
  reviewId: string,
  value: VoteValue
) {
  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/reviews/${reviewId}/vote`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ value }),
  });
  if (!res.ok) throw new Error(await extractError(res, "Could not vote on review"));
  return res.json();
}
