-- Fix unlike not persisting (RLS delete policy)
-- Run in Supabase SQL Editor

alter table public.room_image_likes enable row level security;

drop policy if exists "Users can delete own likes" on public.room_image_likes;

create policy "Users can delete own likes"
  on public.room_image_likes
  for delete
  to authenticated
  using (auth.uid() = user_id);

grant select, insert, delete on public.room_image_likes to authenticated;
grant select on public.room_image_likes to anon;
