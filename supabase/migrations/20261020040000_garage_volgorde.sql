-- Garage op het profiel: zelf de volgorde van de groepen kiezen (rijd ik nu, gereden, gehad, droomauto's)
-- en de volgorde van de auto's binnen een groep.
alter table public.profiles add column if not exists garage_order text[] not null default '{}'
  check (garage_order <@ array['nu', 'gereden', 'gehad', 'droom']::text[] and cardinality(garage_order) <= 4);
alter table public.garage_items add column if not exists position int not null default 0;
grant update (position) on public.garage_items to authenticated;

-- Profielkaart: dezelfde kolommen als eerst, met de groepsvolgorde erachter.
create or replace view public.profile_cards as
  select p.id, p.username, p.avatar_url, p.bio, p.interests, p.created_at,
         case when p.share_age then public.age_band(p.birth_year) end as age_band,
         case when p.share_city then p.city end as city,
         case when p.share_experience then p.license_since end as license_since,
         case when p.share_experience then p.km_year end as km_year,
         p.chat_requests,
         p.garage_order
  from public.profiles p
  where p.public_profile or auth.role() = 'authenticated';
grant select on public.profile_cards to anon, authenticated;
grant insert (position) on public.garage_items to authenticated;
