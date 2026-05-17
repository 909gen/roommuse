export type RoomImage = {
  id: string;
  user_id: string;
  title: string;
  image_url: string;
  category: string;
  created_at: string;
};

export type RoomImageInsert = Pick<
  RoomImage,
  "user_id" | "title" | "image_url" | "category"
>;

export type RoomImageWithLikes = RoomImage & {
  like_count: number;
  liked_by_user: boolean;
};
