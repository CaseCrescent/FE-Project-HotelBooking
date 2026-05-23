import ReviewCard from "./ReviewCard";
import type { ReviewItem } from "@/libs/getReviews";

export default function ReviewList({
  reviews,
  currentUserId,
  isAdmin,
  isLoggedIn,
}: {
  reviews: ReviewItem[];
  currentUserId?: string;
  isAdmin: boolean;
  isLoggedIn: boolean;
}) {
  if (reviews.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-white/55 text-sm">No reviews yet — be the first to share your stay.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((r) => (
        <ReviewCard
          key={r._id}
          review={r}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
          isLoggedIn={isLoggedIn}
        />
      ))}
    </div>
  );
}
