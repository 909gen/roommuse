-- Likes for room images (run in Supabase SQL Editor)

create table if not exists public.room_image_likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  room_image_id uuid not null references public.room_images (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, room_image_id)
);

create index if not exists room_image_likes_room_image_id_idx
  on public.room_image_likes (room_image_id);

create index if not exists room_image_likes_user_id_idx
  on public.room_image_likes (user_id);

alter table public.room_image_likes enable row level security;

drop policy if exists "Anyone can read likes" on public.room_image_likes;
drop policy if exists "Users can insert own likes" on public.room_image_likes;
drop policy if exists "Users can delete own likes" on public.room_image_likes;

create policy "Anyone can read likes"
  on public.room_image_likes
  for select
  to anon, authenticated
  using (true);

create policy "Users can insert own likes"
  on public.room_image_likes
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete own likes"
  on public.room_image_likes
  for delete
  to authenticated
  using (auth.uid() = user_id);
