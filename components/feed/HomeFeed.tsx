"use client";

import { useEffect, useState, useMemo } from "react";
import { FeedCard } from "@/components/feed/FeedCard";
import TagFilterBar from "@/components/TagFilterBar";
import { fetchRoomImagesWithLikes } from "@/lib/likes";
import { supabase } from "@/lib/supabase";
import { useTags } from "@/hooks/useTags";
import type { RoomImageWithLikes } from "@/types/room-image";
import type { Tag } from "@/types/tag";

type PostWithTags = RoomImageWithLikes & { tags: Tag[] };

const SKELETON_HEIGHTS = [
  "h-44",
  "h-64",
  "h-52",
  "h-72",
  "h-48",
  "h-60",
  "h-56",
  "h-64",
  "h-52",
  "h-72",
] as const;

export function HomeFeed() {
  const [posts, setPosts] = useState<PostWithTags[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const { styleTags, roomTags } = useTags();

  useEffect(() => {
    let cancelled = false;

    async function loadPosts() {
      const result = await fetchRoomImagesWithLikes();

      if (cancelled) return;

      if ("error" in result) {
        setError(result.error);
        setPosts([]);
        setLoading(false);
        return;
      }

      const imageIds = result.data.map((p) => p.id);
      const tagsByImage: Record<string, Tag[]> = {};

      if (imageIds.length > 0) {
        const { data: tagRows } = await supabase
          .from("room_image_tags")
          .select("room_image_id, room_style_tags(*)")
          .in("room_image_id", imageIds);

        if (tagRows) {
          for (const row of tagRows) {
            const tag = row.room_style_tags?.[0] as Tag;

            if (!tagsByImage[row.room_image_id]) {
              tagsByImage[row.room_image_id] = [];
            }

            if (tag) {
              tagsByImage[row.room_image_id].push(tag);
            }
          }
        }
      }

      if (!cancelled) {
        setError(null);
        setPosts(
          result.data.map((p) => ({
            ...p,
            tags: tagsByImage[p.id] ?? [],
          }))
        );
        setLoading(false);
      }
    }

    loadPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    if (selectedTagIds.length === 0) return posts;

    return posts.filter((post) =>
      selectedTagIds.every((tagId) =>
        post.tags.some((tag) => tag.id === tagId)
      )
    );
  }, [posts, selectedTagIds]);

  if (loading) {
    return (
      <div
        aria-busy="true"
        aria-label="Loading feed"
        className="rm-masonry columns-2 gap-x-4 sm:columns-3 sm:gap-x-5 lg:columns-4 xl:columns-5"
      >
        {SKELETON_HEIGHTS.map((height, index) => (
          <div
            key={index}
            className="rm-feed-item mb-4 break-inside-avoid overflow-hidden rounded-[1.25rem] bg-stone-200/60 ring-1 ring-stone-900/[0.03] sm:mb-5 dark:bg-stone-800/60"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <div
              className={`${height} animate-pulse bg-gradient-to-br from-stone-200 via-stone-100 to-stone-200 dark:from-stone-800 dark:via-stone-700 dark:to-stone-800`}
            />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p
        role="alert"
        className="rounded-2xl border border-red-200/80 bg-red-50/80 px-5 py-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200"
      >
        Could not load the feed: {error}
      </p>
    );
  }

  return (
    <>
      <TagFilterBar
        styleTags={styleTags}
        roomTags={roomTags}
        selected={selectedTagIds}
        onChange={setSelectedTagIds}
      />

      {filteredPosts.length === 0 && posts.length > 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-stone-300/70 bg-white/40 px-6 py-20 text-center dark:border-stone-700/80 dark:bg-stone-900/20">
          <p className="text-xl font-medium tracking-tight text-stone-800 dark:text-stone-100">
            No rooms match these filters
          </p>
          <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">
            Try removing a tag or{" "}
            <button
              onClick={() => setSelectedTagIds([])}
              className="underline underline-offset-2 hover:text-stone-700 dark:hover:text-stone-300"
            >
              clear all
            </button>
            .
          </p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-stone-300/70 bg-white/40 px-6 py-20 text-center backdrop-blur-sm dark:border-stone-700/80 dark:bg-stone-900/20">
          <p className="text-xl font-medium tracking-tight text-stone-800 dark:text-stone-100">
            Your feed is waiting
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-500 dark:text-stone-400">
            Be the first to share a room. Upload a photo to start the collection.
          </p>
        </div>
      ) : (
        <div
          className="rm-masonry columns-2 gap-x-4 sm:columns-3 sm:gap-x-5 lg:columns-4 xl:columns-5"
          aria-label="Room inspiration feed"
        >
          {filteredPosts.map((post, index) => (
            <FeedCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}
    </>
  );
}