-- Run if you previously created policies for bucket id "room-images"
-- but your bucket is named "room_images".

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
    and (storage.foldername (name))[1] = auth.uid()::text
  );

create policy "Authenticated users can update own uploads"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'room_images'
    and (storage.foldername (name))[1] = auth.uid()::text
  );

create policy "Authenticated users can delete own uploads"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'room_images'
    and (storage.foldername (name))[1] = auth.uid()::text
  );

create policy "Public read for room image files"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'room_images');
