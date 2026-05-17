"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { toggleRoomImageLike } from "@/lib/likes";

type LikeButtonProps = {
  roomImageId: string;
  initialCount: number;
  initialLiked: boolean;
};

export function LikeButton({
  roomImageId,
  initialCount,
  initialLiked,
}: LikeButtonProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLiked(initialLiked);
    setCount(initialCount);
  }, [initialLiked, initialCount, roomImageId]);

  async function handleClick() {
    if (pending || loading) {
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    setPending(true);
    setError(null);

    const previousLiked = liked;
    const previousCount = count;

    const result = await toggleRoomImageLike(
      roomImageId,
      previousLiked,
      user.id,
    );

    setPending(false);

    if ("error" in result) {
      setLiked(previousLiked);
      setCount(previousCount);
      setError(result.error);
      return;
    }

    setLiked(result.liked);
    setCount(result.likeCount);
  }

  return (
    <div className="pointer-events-auto absolute right-3 top-3 z-30 flex flex-col items-end gap-1 opacity-95 transition-opacity duration-300 group-hover:opacity-100">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-pressed={liked}
        aria-label={liked ? "Unlike" : "Like"}
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium backdrop-blur-md transition ${
          liked
            ? "bg-rose-500/90 text-white shadow-sm"
            : "bg-black/40 text-white hover:bg-black/55"
        } disabled:cursor-not-allowed disabled:opacity-70`}
      >
        <HeartIcon filled={liked} />
        <span>{count}</span>
      </button>
      {error ? (
        <span className="max-w-[10rem] rounded-md bg-black/70 px-2 py-1 text-[0.625rem] text-white">
          {error}
        </span>
      ) : !user && !loading ? (
        <Link
          href="/login"
          className="rounded-md bg-black/50 px-2 py-0.5 text-[0.625rem] text-white/90 hover:bg-black/70"
        >
          Sign in to like
        </Link>
      ) : null}
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  if (filled) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 fill-current"
        aria-hidden="true"
      >
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );
}
