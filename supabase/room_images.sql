-- room_images table for RoomMuse
-- Run in Supabase Dashboard → SQL → New query

create table if not exists public.room_images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  image_url text not null,
  category text not null,
  created_at timestamptz not null default now()
);

create index if not exists room_images_user_id_idx on public.room_images (user_id);
create index if not exists room_images_created_at_idx on public.room_images (created_at desc);

alter table public.room_images enable row level security;

create policy "Authenticated users can insert own room images"
  on public.room_images
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Authenticated users can update own room images"
  on public.room_images
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Anyone can read room images"
  on public.room_images
  for select
  to anon, authenticated
  using (true);
