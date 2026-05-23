"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { voteReviewAction } from "@/app/actions";

type Vote = "like" | "dislike" | null;

export default function LikeDislikeButtons({
  reviewId,
  initialLikes,
  initialDislikes,
  initialVote,
  isLoggedIn,
  showDislikeCount,
}: {
  reviewId: string;
  initialLikes: number;
  initialDislikes: number;
  initialVote: Vote;
  isLoggedIn: boolean;
  showDislikeCount: boolean;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [vote, setVote] = useState<Vote>(initialVote);
  const [pending, startTransition] = useTransition();

  const apply = (next: Vote) => {
    if (!isLoggedIn) {
      toast.error("Sign in to vote");
      return;
    }
    // Optimistic
    const prev = { likes, dislikes, vote };
    let nextLikes = likes;
    let nextDislikes = dislikes;
    if (vote === "like") nextLikes -= 1;
    if (vote === "dislike") nextDislikes -= 1;
    if (next === "like") nextLikes += 1;
    if (next === "dislike") nextDislikes += 1;
    setLikes(nextLikes);
    setDislikes(nextDislikes);
    setVote(next);

    startTransition(async () => {
      const res = await voteReviewAction(reviewId, next);
      if (!res.success) {
        // Roll back
        setLikes(prev.likes);
        setDislikes(prev.dislikes);
        setVote(prev.vote);
        toast.error(res.message || "Could not register vote");
      }
    });
  };

  const onLike = () => apply(vote === "like" ? null : "like");
  const onDislike = () => apply(vote === "dislike" ? null : "dislike");

  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={onLike}
        disabled={pending}
        title={isLoggedIn ? (vote === "like" ? "Remove like" : "Like") : "Sign in to vote"}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors disabled:opacity-60 ${
          vote === "like"
            ? "bg-[#dcb771]/20 text-[#f5d78e] border border-[#dcb771]/40"
            : "border border-white/10 text-white/55 hover:border-[#dcb771]/30 hover:text-white"
        }`}
      >
        <span aria-hidden>👍</span>
        <span className="tabular-nums">{likes}</span>
      </button>
      <button
        type="button"
        onClick={onDislike}
        disabled={pending}
        title={isLoggedIn ? (vote === "dislike" ? "Remove dislike" : "Dislike") : "Sign in to vote"}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors disabled:opacity-60 ${
          vote === "dislike"
            ? "bg-red-400/15 text-red-200 border border-red-400/40"
            : "border border-white/10 text-white/55 hover:border-red-400/30 hover:text-white"
        }`}
      >
        <span aria-hidden>👎</span>
        {showDislikeCount && <span className="tabular-nums">{dislikes}</span>}
      </button>
    </div>
  );
}
