import type { RoomImage, RoomImageWithLikes } from "@/types/room-image";

type RoomImageLikeRow = {
  room_image_id: string;
  user_id: string;
};

export function attachLikeStatsFromRows(
  images: RoomImage[],
  likes: RoomImageLikeRow[],
  currentUserId: string | null,
): RoomImageWithLikes[] {
  const countByImage = new Map<string, number>();
  const likedByUser = new Set<string>();

  for (const like of likes) {
    countByImage.set(
      like.room_image_id,
      (countByImage.get(like.room_image_id) ?? 0) + 1,
    );
    if (currentUserId && like.user_id === currentUserId) {
      likedByUser.add(like.room_image_id);
    }
  }

  return images.map((image) => ({
    ...image,
    like_count: countByImage.get(image.id) ?? 0,
    liked_by_user: likedByUser.has(image.id),
  }));
}
