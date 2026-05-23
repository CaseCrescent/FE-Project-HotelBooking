import { extractError } from "./extractError";

export default async function createReview(
  token: string,
  hotelId: string,
  score: number,
  comment: string
) {
  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/hotels/${hotelId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ score, comment }),
  });
  if (!res.ok) throw new Error(await extractError(res, "Could not post review"));
  return res.json();
}
