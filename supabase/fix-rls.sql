-- Fix "new row violates row-level security policy"
-- Run in Supabase Dashboard → SQL → New query

-- ========== public.room_images ==========
alter table public.room_images enable row level security;

drop policy if exists "Authenticated users can insert own room images" on public.room_images;
drop policy if exists "Authenticated users can update own room images" on public.room_images;
drop policy if exists "Anyone can read room images" on public.room_images;

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

-- ========== storage.objects (bucket: room_images) ==========
insert into storage.buckets (id, name, public)
values ('room_images', 'room_images', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Authenticated users can upload to own folder" on storage.objects;
drop policy if exists "Authenticated users can update own uploads" on storage.objects;
drop policy if exists "Authenticated users can delete own uploads" on storage.objects;
drop policy if exists "Public read for room image files" on storage.objects;

create policy "Authenticated users can upload to own folder"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'room_images'
    and auth.uid()::text = (storage.foldername (name))[1]
  );

create policy "Authenticated users can update own uploads"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'room_images'
    and auth.uid()::text = (storage.foldername (name))[1]
  );

create policy "Authenticated users can delete own uploads"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'room_images'
    and auth.uid()::text = (storage.foldername (name))[1]
  );

create policy "Public read for room image files"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'room_images');
