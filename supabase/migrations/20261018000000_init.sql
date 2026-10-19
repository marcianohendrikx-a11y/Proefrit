-- =====================================================================
-- Proefrit: databaseschema voor Supabase (Postgres 15+)
-- Plak dit hele bestand in Supabase > SQL Editor en klik op Run.
-- Alles staat standaard dicht (Row Level Security); per tabel staat
-- hieronder precies wie wat mag lezen en schrijven.
-- =====================================================================
create extension if not exists pgcrypto;

-- ---------- Beheerders (jij) ----------
create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admins enable row level security;
create or replace function public.is_admin() returns boolean
  language sql stable security definer set search_path = public
  as $$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;
create policy admins_self on public.admins for select to authenticated using (user_id = auth.uid());

-- ---------- Catalogus ----------
create table public.cars (
  id text primary key,                 -- 'Merk|Model'
  brand text not null,
  model text not null,
  year_from int not null,
  year_to int not null,
  body text not null default 'H',      -- H S W U X C R M P V K
  fuels text[] not null default '{}',     -- leeg = brandstof volgt uit het kenteken (modellen uit de RDW-import)
  source text not null default 'catalogus' check (source in ('catalogus', 'rdw')),
  created_at timestamptz not null default now()
);
create index cars_brand_idx on public.cars (brand);
create table public.car_versions (
  id bigserial primary key,
  car_id text not null references public.cars(id) on delete cascade,
  label text not null,
  fuel text not null,
  unique (car_id, label, fuel)
);
alter table public.cars enable row level security;
alter table public.car_versions enable row level security;
create policy cars_read on public.cars for select to anon, authenticated using (true);
create policy versions_read on public.car_versions for select to anon, authenticated using (true);
create policy cars_admin on public.cars for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy versions_admin on public.car_versions for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Namen vergelijken zonder hoofdletters, accenten en leestekens ('ŠKODA' = 'Škoda', 'MERCEDES-BENZ' = 'Mercedes-Benz').
create or replace function public.norm_name(s text) returns text language sql immutable as $$
  select trim(regexp_replace(translate(lower(s), 'àáâäãåāčçćéèêëēěíìîïñńóòôöõøšśúùûüůýÿžźż', 'aaaaaaaccceeeeeeiiiinnoooooossuuuuuyyzzz'), '[^a-z0-9]+', ' ', 'g'))
$$;

-- Alle modelnamen die ooit in Nederland op kenteken stonden (RDW Open Data, CC0), gevuld door scripts/import-rdw.mjs.
-- car_id = het model in onze catalogus; match 'voorstel' komt van het script, 'zeker' zet een beheerder na controle.
create table public.rdw_models (
  brand text not null,
  trade_name text not null,
  first_year int,
  last_year int,
  vehicles int not null default 0,
  car_id text references public.cars(id) on delete set null,
  match text not null default 'geen' check (match in ('zeker', 'voorstel', 'geen')),
  updated_at timestamptz not null default now(),
  primary key (brand, trade_name)
);
create index rdw_models_car on public.rdw_models (car_id);
alter table public.rdw_models enable row level security;
create policy rdw_read on public.rdw_models for select to anon, authenticated using (true);
create policy rdw_admin on public.rdw_models for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Profielen ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username ~ '^[A-Za-z0-9_.-]{3,20}$'),
  birth_year int,
  city text check (char_length(city) <= 40),
  license_since text check (license_since ~ '^(geen|[0-9]{4})$'),
  km_year text check (km_year in ('<10','10-20','20-30','30+')),
  bio text check (char_length(bio) <= 160),
  interests text[] not null default '{}' check (cardinality(interests) <= 8),
  avatar_url text,
  -- wat deelt iemand? standaard alles op nee
  share_age boolean not null default false,
  share_city boolean not null default false,
  share_experience boolean not null default false,
  public_profile boolean not null default false,
  chat_requests boolean not null default true,
  onboarded boolean not null default false,
  created_at timestamptz not null default now()
);
create unique index profiles_username_lower on public.profiles (lower(username));

create or replace function public.profiles_validate() returns trigger language plpgsql as $$
begin
  if new.birth_year is null then
    raise exception 'Geboortejaar is verplicht';
  end if;
  if extract(year from now())::int - new.birth_year < 16 then
    raise exception 'Je moet minstens 16 jaar zijn';
  end if;
  if new.license_since ~ '^[0-9]{4}$' and new.license_since::int - new.birth_year < 16 then
    raise exception 'Rijbewijsjaar past niet bij het geboortejaar';
  end if;
  return new;
end $$;
create trigger profiles_validate before insert or update on public.profiles
  for each row execute function public.profiles_validate();

alter table public.profiles enable row level security;
create policy profiles_own_read on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy profiles_own_insert on public.profiles for insert to authenticated with check (id = auth.uid());
create policy profiles_own_update on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_own_delete on public.profiles for delete to authenticated using (id = auth.uid());

create or replace function public.age_band(by int) returns text language sql stable as $$
  select case
    when extract(year from now())::int - by < 18 then '16-17'
    when extract(year from now())::int - by < 25 then '18-24'
    when extract(year from now())::int - by < 35 then '25-34'
    when extract(year from now())::int - by < 45 then '35-44'
    when extract(year from now())::int - by < 55 then '45-54'
    when extract(year from now())::int - by < 65 then '55-64'
    else '65+' end $$;

-- Mag de huidige kijker dit profiel zien? (openbaar, of kijker is ingelogd)
create or replace function public.profile_visible(uid uuid) returns boolean
  language sql stable security definer set search_path = public
  as $$ select exists (select 1 from public.profiles p where p.id = uid and (p.public_profile or auth.role() = 'authenticated')) $$;

-- Naam en avatar zijn altijd zichtbaar (reviews zijn openbaar).
create view public.profile_names as
  select id, username, avatar_url from public.profiles;
-- Profielkaart: alleen wat iemand zelf deelt, en alleen als het profiel zichtbaar is.
create view public.profile_cards as
  select p.id, p.username, p.avatar_url, p.bio, p.interests, p.created_at,
         case when p.share_age then public.age_band(p.birth_year) end as age_band,
         case when p.share_city then p.city end as city,
         case when p.share_experience then p.license_since end as license_since,
         case when p.share_experience then p.km_year end as km_year,
         p.chat_requests
  from public.profiles p
  where p.public_profile or auth.role() = 'authenticated';
grant select on public.profile_names, public.profile_cards to anon, authenticated;

-- ---------- Garage ----------
create type public.garage_status as enum ('nu', 'gehad', 'droom');
create table public.garage_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  car_id text not null references public.cars(id),
  status public.garage_status not null,
  fuel text not null,
  version text,
  year int,
  tags text[] not null default '{}' check (cardinality(tags) <= 5),   -- 'wat valt op aan deze auto', uit de woordenlijst
  plate_verified boolean not null default false,   -- alleen de server zet dit
  created_at timestamptz not null default now()
);
create index garage_user_idx on public.garage_items (user_id);
create or replace function public.garage_limits() returns trigger language plpgsql as $$
begin
  if (select count(*) from public.garage_items where user_id = new.user_id) >= 12 then
    raise exception 'Je garage zit vol (12 auto''s)';
  end if;
  if new.status = 'droom' and (select count(*) from public.garage_items where user_id = new.user_id and status = 'droom') >= 4 then
    raise exception 'Maximaal 4 droomauto''s';
  end if;
  return new;
end $$;
create trigger garage_limits before insert on public.garage_items for each row execute function public.garage_limits();
alter table public.garage_items enable row level security;
create policy garage_read on public.garage_items for select to anon, authenticated using (user_id = auth.uid() or public.profile_visible(user_id));
create policy garage_insert on public.garage_items for insert to authenticated with check (user_id = auth.uid());
create policy garage_update on public.garage_items for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy garage_delete on public.garage_items for delete to authenticated using (user_id = auth.uid());
revoke insert, update on public.garage_items from anon, authenticated;
grant select on public.garage_items to anon, authenticated;
grant insert (user_id, car_id, status, fuel, version, year, tags) on public.garage_items to authenticated;
grant update (status, fuel, version, year, tags) on public.garage_items to authenticated;
grant delete on public.garage_items to authenticated;

-- ---------- Reviews (check-ins) ----------
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  car_id text not null references public.cars(id),
  fuel text not null,
  version text,
  ride_type text not null check (ride_type in ('Proefrit bij dealer','Huurauto','Van een kennis','Eigen auto')),
  ride_date date not null check (ride_date <= current_date),
  overall smallint not null check (overall between 1 and 5),
  score_drive smallint not null check (score_drive between 1 and 5),
  score_comfort smallint not null check (score_comfort between 1 and 5),
  score_engine smallint not null check (score_engine between 1 and 5),
  score_space smallint not null check (score_space between 1 and 5),
  score_value smallint not null check (score_value between 1 and 5),
  body text check (char_length(body) <= 500),
  tags text[] not null default '{}' check (cardinality(tags) <= 5),
  plate_verified boolean not null default false,   -- alleen de server zet dit
  photo_verified boolean not null default false,   -- alleen de server zet dit
  created_at timestamptz not null default now(),
  updated_at timestamptz
);
create index reviews_car_idx on public.reviews (car_id, created_at desc);
create index reviews_user_idx on public.reviews (user_id, created_at desc);
alter table public.reviews enable row level security;
create policy reviews_read on public.reviews for select to anon, authenticated using (true);
create policy reviews_update_own on public.reviews for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy reviews_delete_own on public.reviews for delete to authenticated using (user_id = auth.uid() or public.is_admin());
-- Nieuwe check-ins komen alleen binnen via de serverfunctie 'checkin' (die controleert kenteken en foto).
revoke insert, update on public.reviews from anon, authenticated;
grant select on public.reviews to anon, authenticated;
grant update (overall, score_drive, score_comfort, score_engine, score_space, score_value, body, tags) on public.reviews to authenticated;
grant delete on public.reviews to authenticated;

-- Alleen voor de server: gebruikte kentekens (als HMAC-code, nooit het kenteken zelf) en foto-codes.
create table public.plate_uses (
  id bigserial primary key,
  plate_hash text not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  car_id text not null references public.cars(id),
  ride_date date not null,
  review_id uuid references public.reviews(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (user_id, plate_hash, ride_date)
);
create index plate_uses_hash_idx on public.plate_uses (plate_hash);
create table public.photo_hashes (
  hash text primary key,
  user_id uuid references public.profiles(id) on delete set null,
  review_id uuid references public.reviews(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.plate_uses enable row level security;
alter table public.photo_hashes enable row level security;
-- geen policies: alleen de service role (serverfuncties) kan hierbij

-- ---------- Top! en reacties ----------
create table public.likes (
  review_id uuid not null references public.reviews(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (review_id, user_id)
);
alter table public.likes enable row level security;
create policy likes_read on public.likes for select to anon, authenticated using (true);
create policy likes_insert on public.likes for insert to authenticated with check (user_id = auth.uid());
create policy likes_delete on public.likes for delete to authenticated using (user_id = auth.uid());

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 300),
  created_at timestamptz not null default now()
);
create index comments_review_idx on public.comments (review_id, created_at);
alter table public.comments enable row level security;
create policy comments_read on public.comments for select to anon, authenticated using (true);
create policy comments_insert on public.comments for insert to authenticated with check (user_id = auth.uid());
create policy comments_delete on public.comments for delete to authenticated using (user_id = auth.uid() or public.is_admin());

-- ---------- Chat met akkoord ----------
create type public.convo_state as enum ('requested', 'active', 'declined', 'blocked');
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references public.profiles(id) on delete cascade,
  user_b uuid not null references public.profiles(id) on delete cascade,
  requested_by uuid not null references public.profiles(id) on delete cascade,
  state public.convo_state not null default 'requested',
  blocked_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (user_a <> user_b),
  check (requested_by in (user_a, user_b))
);
create unique index conversations_pair on public.conversations (least(user_a, user_b), greatest(user_a, user_b));
create table public.messages (
  id bigserial primary key,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);
create index messages_convo_idx on public.messages (conversation_id, created_at);

create or replace function public.accepts_chat(uid uuid) returns boolean
  language sql stable security definer set search_path = public
  as $$ select coalesce((select chat_requests from public.profiles where id = uid), false) $$;

-- Mag de ingelogde gebruiker nu een bericht sturen in dit gesprek?
-- Verzoek: alleen de aanvrager, en maar één bericht. Actief: beide deelnemers.
create or replace function public.can_send(conv uuid) returns boolean
  language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.conversations c
    where c.id = conv and auth.uid() in (c.user_a, c.user_b)
      and (c.state = 'active'
           or (c.state = 'requested' and c.requested_by = auth.uid()
               and not exists (select 1 from public.messages m where m.conversation_id = c.id)))
  ) $$;
create or replace function public.is_participant(conv uuid) returns boolean
  language sql stable security definer set search_path = public
  as $$ select exists (select 1 from public.conversations c where c.id = conv and auth.uid() in (c.user_a, c.user_b)) $$;

alter table public.conversations enable row level security;
alter table public.messages enable row level security;
create policy convo_read on public.conversations for select to authenticated using (auth.uid() in (user_a, user_b));
create policy convo_start on public.conversations for insert to authenticated
  with check (requested_by = auth.uid() and auth.uid() in (user_a, user_b) and state = 'requested'
              and public.accepts_chat(case when user_a = auth.uid() then user_b else user_a end));
create policy msg_read on public.messages for select to authenticated using (public.is_participant(conversation_id));
create policy msg_send on public.messages for insert to authenticated with check (sender_id = auth.uid() and public.can_send(conversation_id));
revoke update, delete on public.conversations from anon, authenticated;

-- Acties op een verzoek, alleen door de ontvanger (of blokkeren door een van beiden).
create or replace function public.respond_chat(conv uuid, action text) returns public.convo_state
  language plpgsql security definer set search_path = public as $$
declare c public.conversations; new_state public.convo_state;
begin
  select * into c from public.conversations where id = conv;
  if c.id is null or auth.uid() not in (c.user_a, c.user_b) then raise exception 'Gesprek niet gevonden'; end if;
  if action = 'accept' then
    if c.state <> 'requested' or c.requested_by = auth.uid() then raise exception 'Alleen de ontvanger kan akkoord geven'; end if;
    new_state := 'active';
  elsif action = 'decline' then
    if c.state <> 'requested' or c.requested_by = auth.uid() then raise exception 'Alleen de ontvanger kan weigeren'; end if;
    new_state := 'declined';
  elsif action = 'block' then
    new_state := 'blocked';
  else
    raise exception 'Onbekende actie';
  end if;
  update public.conversations set state = new_state, updated_at = now(),
         blocked_by = case when new_state = 'blocked' then auth.uid() else blocked_by end
   where id = conv;
  return new_state;
end $$;
revoke all on function public.respond_chat(uuid, text) from public, anon;
grant execute on function public.respond_chat(uuid, text) to authenticated;

-- ---------- Tickets (opmerkingen over de website) ----------
create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  user_id uuid references public.profiles(id) on delete set null,
  type text not null,
  message text not null check (char_length(message) between 10 and 1000),
  reply_email text check (char_length(reply_email) <= 120),
  page text,
  status text not null default 'Ontvangen' check (status in ('Ontvangen', 'In behandeling', 'Afgehandeld')),
  created_at timestamptz not null default now()
);
alter table public.tickets enable row level security;
create policy tickets_own on public.tickets for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy tickets_admin on public.tickets for update to authenticated using (public.is_admin()) with check (public.is_admin());
-- Nieuwe tickets komen binnen via de serverfunctie 'ticket' (die ook de e-mail verstuurt).

-- ---------- Foto's van rijders (pas zichtbaar na keuring) ----------
-- Insturen en keuren gaat alleen via de serverfuncties 'photo' en 'photo-moderate'.
-- Zo kan niemand de automatische voorkeuring overslaan of zelf een foto goedkeuren.
create type public.photo_status as enum ('pending', 'approved', 'rejected', 'removed');
create table public.photo_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  car_id text not null references public.cars(id),
  review_id uuid references public.reviews(id) on delete set null,
  storage_path text not null,                 -- privé map 'submissions'
  public_path text,                           -- map 'photos', pas na goedkeuring
  width int, height int,
  image_hash text not null,
  status public.photo_status not null default 'pending',
  auto_verdict text not null default 'onbekend' check (auto_verdict in ('ok', 'twijfel', 'onbekend')),
  ai_check jsonb,
  reason text,
  moderated_by uuid references public.profiles(id),
  moderated_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, image_hash)
);
create index photo_submissions_car on public.photo_submissions (car_id, status);
alter table public.photo_submissions enable row level security;
create policy photos_own_read on public.photo_submissions for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
revoke insert, update, delete on public.photo_submissions from anon, authenticated;

-- Pogingen tellen (elke controle kost een aanroep bij Claude). Alleen voor de serverfunctie.
create table public.photo_attempts (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.photo_attempts enable row level security;
revoke all on public.photo_attempts from anon, authenticated;

-- Goedgekeurde foto's per auto: alleen wat openbaar mag (geen privépad, geen voorkeuring).
create view public.car_photos as
  select s.id, s.car_id, s.public_path, s.width, s.height, s.moderated_at as approved_at, p.username
  from public.photo_submissions s join public.profiles p on p.id = s.user_id
  where s.status = 'approved';
grant select on public.car_photos to anon, authenticated;

-- ---------- Handige views ----------
-- Gemiddelden per auto: geverifieerd telt x2, deels geverifieerd x1,5.
create view public.car_stats as
  select car_id,
         count(*) as checkins,
         count(*) filter (where plate_verified and photo_verified) as verified,
         round(sum(overall * (1 + 0.5 * (plate_verified::int + photo_verified::int)))
               / sum(1 + 0.5 * (plate_verified::int + photo_verified::int)), 2) as weighted_avg
  from public.reviews group by car_id;
grant select on public.car_stats to anon, authenticated;

-- ---------- Woordenlijsten en woordfilter ----------
-- Kenmerken ('Wat viel op?') en interesses komen uit een vaste lijst, zodat alles goed gespeld is en over auto's gaat.
create table public.vocab (
  term text not null,
  kind text not null check (kind in ('tag', 'interest')),
  grp text not null,
  neg boolean not null default false,
  primary key (term, kind)
);
alter table public.vocab enable row level security;
create policy vocab_read on public.vocab for select to anon, authenticated using (true);
create policy vocab_admin on public.vocab for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Verboden woorden: alleen de database leest ze (geen toegang voor gebruikers). Gevuld door supabase/seed/vocab.sql.
-- mode: w = heel woord, p = begin van een woord, s = eind van een woord, c = ergens in een woord, e = uitzondering, x = zinsdeel (regex)
create table public.banned_terms (
  term text not null,
  mode text not null check (mode in ('w', 'p', 's', 'c', 'e', 'x')),
  exact boolean not null default false,   -- true = niet vergelijken na het samenvoegen van dubbele letters
  primary key (term, mode)
);
alter table public.banned_terms enable row level security;
revoke all on public.banned_terms from anon, authenticated;

-- Geeft het eerste verboden woord terug, of null. De app en de serverfuncties doen dezelfde controle (met nog een paar
-- extra trucs zoals 'k a n k e r'); dit is het vangnet voor alles wat rechtstreeks in de database komt.
create or replace function public.blocked_word(t text) returns text
  language plpgsql stable security definer set search_path = public as $$
declare s text; tok text; a text; b text; r record; flat text;
begin
  if t is null or btrim(t) = '' then return null; end if;
  s := translate(lower(t), 'àáâäãåāčçćéèêëēěíìîïñńóòôöõøšśúùûüůýÿžźż', 'aaaaaaaccceeeeeeiiiinnoooooøssuuuuuyyzzz');
  s := translate(s, '0134578@$€!|', 'oieastbaseii');
  flat := btrim(regexp_replace(s, '[^a-z]+', ' ', 'g'));
  for tok in select x from regexp_split_to_table(flat, ' ') x where length(x) >= 2 loop
    if exists (select 1 from banned_terms e where e.mode = 'e' and tok like e.term || '%') then continue; end if;
    a := regexp_replace(tok, '(.)\1{2,}', '\1\1', 'g');
    b := regexp_replace(tok, '(.)\1+', '\1', 'g');
    for r in select term, mode, exact, regexp_replace(term, '(.)\1+', '\1', 'g') as c from banned_terms where mode in ('w', 'p', 's', 'c') loop
      if (r.mode = 'w' and (a = r.term or (not r.exact and b = r.c)))
      or (r.mode = 'p' and (a like r.term || '%' or (not r.exact and b like r.c || '%')))
      or (r.mode = 's' and (a like '%' || r.term or (not r.exact and b like '%' || r.c)))
      or (r.mode = 'c' and (position(r.term in a) > 0 or (not r.exact and position(r.c in b) > 0))) then
        return tok;
      end if;
    end loop;
  end loop;
  for r in select term from banned_terms where mode = 'x' loop
    if flat ~ replace(r.term, '\b', '\y') then return r.term; end if;
  end loop;
  return null;
end $$;
revoke execute on function public.blocked_word(text) from anon, authenticated;

create or replace function public.check_words() returns trigger
  language plpgsql security definer set search_path = public as $$
declare f text; v text;
begin
  foreach f in array TG_ARGV loop
    execute format('select ($1).%I::text', f) into v using new;
    if public.blocked_word(v) is not null then
      raise exception 'Je tekst bevat een woord dat niet is toegestaan. Scheldwoorden en ziektes als scheldwoord horen niet op Proefrit.' using errcode = 'P0001';
    end if;
  end loop;
  return new;
end $$;
create trigger messages_words before insert or update on public.messages for each row execute function public.check_words('body');
create trigger comments_words before insert or update on public.comments for each row execute function public.check_words('body');
create trigger reviews_words before insert or update on public.reviews for each row execute function public.check_words('body');
create trigger profiles_words before insert or update on public.profiles for each row execute function public.check_words('username', 'bio', 'city');

create or replace function public.check_vocab() returns trigger
  language plpgsql security definer set search_path = public as $$
declare arr text[]; k text := TG_ARGV[1];
begin
  execute format('select ($1).%I', TG_ARGV[0]) into arr using new;
  if exists (select 1 from unnest(coalesce(arr, '{}')) x where not exists (select 1 from vocab v where v.term = x and v.kind = k)) then
    raise exception 'Kies kenmerken en interesses uit de lijst.' using errcode = 'P0001';
  end if;
  return new;
end $$;
create trigger reviews_vocab before insert or update of tags on public.reviews for each row execute function public.check_vocab('tags', 'tag');
create trigger garage_vocab before insert or update of tags on public.garage_items for each row execute function public.check_vocab('tags', 'tag');
create trigger profiles_vocab before insert or update of interests on public.profiles for each row execute function public.check_vocab('interests', 'interest');
