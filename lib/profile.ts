import { supabase } from "@/lib/supabase";
import { attachLikeStatsFromRows } from "@/lib/likes-utils";
import type { UserProfile } from "@/types/profile";
import type { RoomImage } from "@/types/room-image";

type ProfileRow = {
  id: string;
  username: string;
};

type LikeRow = {
  room_image_id: string;
  user_id: string;
};

function fallbackUsername(userId: string): string {
  return `user_${userId.slice(0, 8)}`;
}

export async function ensureCurrentUserProfile(): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) {
    return;
  }

  const emailLocal = user.email?.split("@")[0] ?? "";
  const base =
    emailLocal.toLowerCase().replace(/[^a-z0-9_]/g, "") ||
    `user_${user.id.slice(0, 8)}`;

  let username = base;
  let suffix = 0;

  while (suffix < 20) {
    const { error } = await supabase.from("profiles").insert({
      id: user.id,
      username,
    });

    if (!error) {
      return;
    }

    if (error.code === "23505" && error.message.includes("profiles_pkey")) {
      return;
    }

    if (error.code !== "23505") {
      return;
    }

    suffix += 1;
    username = `${base}${suffix}`;
  }
}

export async function fetchUserProfile(
  userId: string,
): Promise<{ data: UserProfile } | { error: string }> {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    return { error: profileError.message };
  }

  const { data: images, error: imagesError } = await supabase
    .from("room_images")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (imagesError) {
    return { error: imagesError.message };
  }

  const uploads = (images ?? []) as RoomImage[];
  const imageIds = uploads.map((image) => image.id);

  let likes: LikeRow[] = [];
  if (imageIds.length > 0) {
    const { data: likeRows, error: likesError } = await supabase
      .from("room_image_likes")
      .select("room_image_id, user_id")
      .in("room_image_id", imageIds);

    if (likesError) {
      return { error: likesError.message };
    }

    likes = (likeRows ?? []) as LikeRow[];
  }

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const uploadsWithLikes = attachLikeStatsFromRows(
    uploads,
    likes,
    currentUser?.id ?? null,
  );

  const totalLikes = likes.length;
  const profileRow = profile as ProfileRow | null;

  return {
    data: {
      user_id: userId,
      username: profileRow?.username ?? fallbackUsername(userId),
      total_uploads: uploads.length,
      total_likes: totalLikes,
      uploads: uploadsWithLikes,
    },
  };
}
