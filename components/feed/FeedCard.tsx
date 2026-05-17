"use client";

import { LikeButton } from "@/components/feed/LikeButton";
import TagPills from "@/components/TagPills";
import type { RoomImageWithLikes } from "@/types/room-image";
import type { Tag } from "@/types/tag";

type FeedCardProps = {
  post: RoomImageWithLikes & { tags?: Tag[] };
  index?: number;
};

export function FeedCard({ post, index = 0 }: FeedCardProps) {
  return (
    <article
      className="rm-feed-item group mb-4 break-inside-avoid sm:mb-5"
      style={{ animationDelay: `${Math.min(index * 60, 480)}ms` }}
    >
      <div className="relative overflow-hidden rounded-[1.25rem] bg-stone-200/80 shadow-[0_1px_2px_rgba(28,25,23,0.04),0_8px_24px_rgba(28,25,23,0.06)] ring-1 ring-stone-900/[0.04] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_4px_8px_rgba(28,25,23,0.04),0_20px_48px_rgba(28,25,23,0.14)] dark:bg-stone-800/80 dark:ring-white/[0.06] dark:hover:shadow-[0_20px_48px_rgba(0,0,0,0.4)]">

        {post.tags && post.tags.length > 0 && (
          <div className="absolute left-3 top-3 z-20 opacity-100 transition-opacity duration-300 group-hover:opacity-0 md:opacity-95">
            <TagPills tags={post.tags} />
          </div>
        )}

        <LikeButton
          roomImageId={post.id}
          initialCount={post.like_count}
          initialLiked={post.liked_by_user}
        />

        <div className="overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image_url}
            alt={post.title}
            loading="lazy"
            className="block w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.04]"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/25 to-stone-950/0 opacity-70 transition-opacity duration-500 group-hover:opacity-100 md:opacity-0"
          aria-hidden="true"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 pt-16 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] translate-y-0 group-hover:translate-y-0 md:translate-y-3 md:group-hover:translate-y-0">
          <h2 className="text-[0.9375rem] font-medium leading-snug tracking-tight text-white drop-shadow-sm sm:text-base">
            {post.title}
          </h2>
        </div>
      </div>
    </article>
  );
}