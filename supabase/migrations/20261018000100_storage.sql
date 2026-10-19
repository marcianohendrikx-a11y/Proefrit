-- =====================================================================
-- Proefrit: opslag voor foto's van rijders (Supabase Storage)
-- Draai dit na het eerste bestand.
-- 'submissions' is privé: iedereen ziet alleen de eigen map en
-- alleen beheerders kunnen alles zien. 'photos' is openbaar leesbaar en
-- bevat alleen goedgekeurde foto's (met onherkenbaar gemaakt kenteken).
-- Verificatiefoto's van check-ins worden NIET opgeslagen.
-- =====================================================================
insert into storage.buckets (id, name, public) values ('submissions', 'submissions', false) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('photos', 'photos', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict (id) do nothing;

-- Uploaden in 'submissions' en 'photos' doen alleen de serverfuncties 'photo' en 'photo-moderate'
-- (met de service role), na de automatische voorkeuring. Daarom geen upload-regel voor gebruikers.
create policy "eigen inzendingen bekijken" on storage.objects for select to authenticated
  using (bucket_id = 'submissions' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));
create policy "eigen avatar" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "eigen avatar vervangen" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
