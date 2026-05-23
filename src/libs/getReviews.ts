import { extractError } from "./extractError";

export interface ReviewItem {
  _id: string;
  score: number;
  comment: string;
  user: { _id: string; name: string } | string | null;
  hotel: { _id: string; name?: string } | string;
  likes: string[];
  dislikes: string[];
  createdAt: string;
}

export default async function getReviews(hotelId?: string): Promise<{
  success: boolean;
  count: number;
  data: ReviewItem[];
}> {
  const url = hotelId
    ? `${process.env.BACKEND_URL}/api/v1/hotels/${hotelId}/reviews`
    : `${process.env.BACKEND_URL}/api/v1/reviews`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(await extractError(res, "Could not load reviews"));
  return res.json();
}
