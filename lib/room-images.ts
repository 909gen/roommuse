import { supabase } from "@/lib/supabase";
import type { RoomImage, RoomImageInsert } from "@/types/room-image";

/** Должен совпадать с id бакета в Supabase → Storage */
export const ROOM_IMAGES_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET?.trim() || "room_images";

export const ROOM_IMAGE_CATEGORIES = [
  "Гостиная",
  "Спальня",
  "Кухня",
  "Ванная",
  "Столовая",
  "Кабинет",
  "Балкон / терраса",
  "Другое",
] as const;

export type RoomImageCategory = (typeof ROOM_IMAGE_CATEGORIES)[number];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return "Выберите изображение JPEG, PNG, WebP или GIF.";
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "Размер файла не должен превышать 10 МБ.";
  }

  return null;
}

function fileExtension(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && ["jpg", "jpeg", "png", "webp", "gif"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }

  const mimeMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };

  return mimeMap[file.type] ?? "jpg";
}

async function requireAuthUser(): Promise<{ userId: string } | { error: string }> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { error: "Войдите в аккаунт, чтобы загрузить изображение." };
  }

  return { userId: user.id };
}

export async function uploadRoomImageFile(
  file: File,
): Promise<{ imageUrl: string } | { error: string }> {
  const auth = await requireAuthUser();
  if ("error" in auth) {
    return auth;
  }

  const validationError = validateImageFile(file);
  if (validationError) {
    return { error: validationError };
  }

  const path = `${auth.userId}/${crypto.randomUUID()}.${fileExtension(file)}`;

  const { error: uploadError } = await supabase.storage
    .from(ROOM_IMAGES_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data } = supabase.storage.from(ROOM_IMAGES_BUCKET).getPublicUrl(path);

  return { imageUrl: data.publicUrl };
}

export async function fetchRoomImages(): Promise<
  { data: RoomImage[] } | { error: string }
> {
  const { data, error } = await supabase
    .from("room_images")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { data: (data ?? []) as RoomImage[] };
}

export async function saveRoomImage(
  payload: Omit<RoomImageInsert, "user_id">,
): Promise<{ data: RoomImage } | { error: string }> {
  const auth = await requireAuthUser();
  if ("error" in auth) {
    return auth;
  }

  const { data, error } = await supabase
    .from("room_images")
    .insert({
      ...payload,
      user_id: auth.userId,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data: data as RoomImage };
}
