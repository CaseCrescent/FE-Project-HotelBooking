import { extractError } from "./extractError";

export default async function deleteReview(token: string, reviewId: string) {
  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/reviews/${reviewId}`, {
    method: "DELETE",
    headers: { authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await extractError(res, "Could not delete review"));
  return res.json();
}
