import type { RoomImageWithLikes } from "@/types/room-image";

export type UserProfile = {
  user_id: string;
  username: string;
  total_uploads: number;
  total_likes: number;
  uploads: RoomImageWithLikes[];
};
