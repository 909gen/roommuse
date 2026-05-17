import { attachLikeStatsFromRows } from "@/lib/likes-utils";
import { supabase } from "@/lib/supabase";
import type { RoomImage, RoomImageWithLikes } from "@/types/room-image";

type RoomImageLikeRow = {
  room_image_id: string;
  user_id: string;
};

async function requireAuthUserId(): Promise<
  { userId: string } | { error: string }
> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.user) {
    return { error: "Sign in to manage likes." };
  }

  return { userId: session.user.id };
}

export async function fetchRoomImagesWithLikes(): Promise<
  { data: RoomImageWithLikes[] } | { error: string }
> {
  const { data: images, error: imagesError } = await supabase
    .from("room_images")
    .select("*")
    .order("created_at", { ascending: false });

  if (imagesError) {
    return { error: imagesError.message };
  }

  const roomImages = (images ?? []) as RoomImage[];
  if (roomImages.length === 0) {
    return { data: [] };
  }

  const imageIds = roomImages.map((image) => image.id);
  const { data: likes, error: likesError } = await supabase
    .from("room_image_likes")
    .select("room_image_id, user_id")
    .in("room_image_id", imageIds);

  if (likesError) {
    return { error: likesError.message };
  }

  const auth = await requireAuthUserId();
  const currentUserId = "userId" in auth ? auth.userId : null;

  return {
    data: attachLikeStatsFromRows(
      roomImages,
      (likes ?? []) as RoomImageLikeRow[],
      currentUserId,
    ),
  };
}

export async function likeRoomImage(
  roomImageId: string,
  userId: string,
): Promise<{ liked: true } | { error: string }> {
  const { error } = await supabase.from("room_image_likes").insert({
    user_id: userId,
    room_image_id: roomImageId,
  });

  if (error) {
    if (error.code === "23505") {
      return { liked: true };
    }
    return { error: error.message };
  }

  return { liked: true };
}

export async function unlikeRoomImage(
  roomImageId: string,
  userId: string,
): Promise<{ liked: false } | { error: string }> {
  const { data, error } = await supabase
    .from("room_image_likes")
    .delete()
    .eq("room_image_id", roomImageId)
    .eq("user_id", userId)
    .select("id");

  if (error) {
    return { error: error.message };
  }

  if (!data?.length) {
    return {
      error:
        "Could not remove like. Check that delete policy exists on room_image_likes.",
    };
  }

  return { liked: false };
}

export async function getRoomImageLikeCount(
  roomImageId: string,
): Promise<{ count: number } | { error: string }> {
  const { count, error } = await supabase
    .from("room_image_likes")
    .select("id", { count: "exact", head: true })
    .eq("room_image_id", roomImageId);

  if (error) {
    return { error: error.message };
  }

  return { count: count ?? 0 };
}

export async function toggleRoomImageLike(
  roomImageId: string,
  currentlyLiked: boolean,
  userId: string,
): Promise<
  { liked: boolean; likeCount: number } | { error: string }
> {
  const result = currentlyLiked
    ? await unlikeRoomImage(roomImageId, userId)
    : await likeRoomImage(roomImageId, userId);

  if ("error" in result) {
    return result;
  }

  const countResult = await getRoomImageLikeCount(roomImageId);
  if ("error" in countResult) {
    return countResult;
  }

  return {
    liked: !currentlyLiked,
    likeCount: countResult.count,
  };
}
