// Alle personenauto's die ooit in Nederland op kenteken stonden, uit RDW Open Data (CC0).
// Telt per merk + handelsbenaming hoeveel voertuigen er zijn en in welke jaren ze voor het eerst
// op kenteken kwamen, en schrijft supabase/seed/rdw_models.sql. Dat bestand:
//   1. werkt de tabel rdw_models bij (koppelingen die een beheerder al heeft nagekeken blijven staan),
//   2. stelt voor elke nieuwe RDW-naam een model uit onze catalogus voor,
//   3. zet RDW-modellen zonder passend model, met minstens MIN_VEHICLES voertuigen, als nieuw model
//      in de catalogus (bron 'rdw'; brandstof volgt dan uit het kenteken bij de check-in).
//
// Gebruik:  node scripts/import-rdw.mjs [uitvoerbestand]
// Omgeving: RDW_APP_TOKEN (optioneel, hogere limieten), MIN_VEHICLES (standaard 50),
//           RDW_FIXTURE (pad naar een JSON-bestand met rijen, alleen voor tests zonder internet).
// Draait maandelijks via .github/workflows/import-rdw.yml.
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2] ?? path.join(path.dirname(new URL(import.meta.url).pathname), "..", "supabase", "seed", "rdw_models.sql");
const MIN = Math.max(1, Number(process.env.MIN_VEHICLES ?? 50));
const PAGE = 50000;
const URL_BASE = "https://opendata.rdw.nl/resource/m9d7-ebf2.json";

async function fetchPage(offset) {
  const q = new URLSearchParams({
    $select: "merk, handelsbenaming, min(datum_eerste_toelating) AS eerste, max(datum_eerste_toelating) AS laatste, count(*) AS aantal",
    $where: "voertuigsoort = 'Personenauto'",
    $group: "merk, handelsbenaming",
    $order: "merk, handelsbenaming",
    $limit: String(PAGE),
    $offset: String(offset),
  });
  const headers = { Accept: "application/json" };
  if (process.env.RDW_APP_TOKEN) headers["X-App-Token"] = process.env.RDW_APP_TOKEN;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(`${URL_BASE}?${q}`, { headers, signal: AbortSignal.timeout(180_000) }).catch((e) => ({ ok: false, status: 0, statusText: String(e) }));
    if (res.ok) return res.json();
    console.error(`RDW gaf ${res.status} ${res.statusText ?? ""} (poging ${attempt})`);
    await new Promise((r) => setTimeout(r, 5000 * attempt));
  }
  throw new Error("De RDW is niet bereikbaar. Probeer het later opnieuw.");
}

async function load() {
  if (process.env.RDW_FIXTURE) return JSON.parse(fs.readFileSync(process.env.RDW_FIXTURE, "utf8"));
  const all = [];
  for (let offset = 0; ; offset += PAGE) {
    const rows = await fetchPage(offset);
    all.push(...rows);
    console.error(`${all.length} RDW-modelnamen opgehaald`);
    if (rows.length < PAGE) break;
  }
  return all;
}

const year = (v) => { const m = String(v ?? "").match(/^(\d{4})/); return m ? Number(m[1]) : null; };
const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim().slice(0, 120);
const lit = (s) => (s == null ? "null" : `'${String(s).replace(/'/g, "''")}'`);

const rows = (await load())
  .map((r) => ({ brand: clean(r.merk), trade: clean(r.handelsbenaming), first: year(r.eerste), last: year(r.laatste), n: Number(r.aantal) || 0 }))
  .filter((r) => r.brand && r.trade && r.n > 0);

let sql = `set statement_timeout = 0;
-- RDW-modelnamen voor personenauto's (RDW Open Data, CC0). Gegenereerd door scripts/import-rdw.mjs op ${new Date().toISOString().slice(0, 10)}.
-- ${rows.length} combinaties van merk en handelsbenaming. Nieuwe modellen vanaf ${MIN} voertuigen.
begin;
create temp table rdw_in (brand text, trade_name text, first_year int, last_year int, vehicles int) on commit drop;
`;
for (let i = 0; i < rows.length; i += 1000) {
  sql += "insert into rdw_in values\n" + rows.slice(i, i + 1000).map((r) => `(${lit(r.brand)},${lit(r.trade)},${r.first ?? "null"},${r.last ?? "null"},${r.n})`).join(",\n") + ";\n";
}
sql += `
-- 1. Bijwerken; een nagekeken koppeling (match = 'zeker') blijft staan.
insert into public.rdw_models (brand, trade_name, first_year, last_year, vehicles)
  select brand, trade_name, min(first_year), max(last_year), sum(vehicles) from rdw_in group by brand, trade_name
on conflict (brand, trade_name) do update set first_year = excluded.first_year, last_year = excluded.last_year,
  vehicles = excluded.vehicles, updated_at = now();

-- 2. Voorstel: het langste model uit de catalogus waarmee de RDW-naam begint (ook met het merk ervoor),
--    of 'C 200' -> 'C-Klasse'. Namen worden één keer genormaliseerd en per merk vergeleken (snel, ook bij 100.000 namen).
create temp table rn on commit drop as
  select brand, trade_name, public.norm_name(brand) nb, public.norm_name(trade_name) nt,
         lower(substring(trade_name from '^([A-Za-z]{1,3}) ?[0-9]')) || ' klasse' as kl
  from public.rdw_models where match <> 'zeker';
create temp table cn on commit drop as
  select id, brand, model, public.norm_name(brand) nb, public.norm_name(model) nm from public.cars where source = 'catalogus';
create index on rn (nb);
create index on cn (nb);
analyze rn; analyze cn;
with m as (
  select distinct on (rn.brand, rn.trade_name) rn.brand, rn.trade_name, cn.id
  from rn join cn on cn.nb = rn.nb
  where rn.nt = cn.nm or rn.nt like cn.nm || ' %' or rn.nt = cn.nb || ' ' || cn.nm
     or rn.nt like cn.nb || ' ' || cn.nm || ' %' or cn.nm = rn.kl
  order by rn.brand, rn.trade_name, length(cn.model) desc)
update public.rdw_models r set car_id = m.id, match = 'voorstel' from m
where r.brand = m.brand and r.trade_name = m.trade_name and r.car_id is distinct from m.id;

-- 3. Nieuwe modellen voor RDW-namen zonder voorstel, met genoeg voertuigen. Bestaat het merk al,
--    dan krijgt het model diens schrijfwijze; anders hoofdletters zoals initcap ze zet.
create temp table bm on commit drop as
  select distinct on (public.norm_name(brand)) public.norm_name(brand) nb, brand from public.cars
  order by public.norm_name(brand), (source = 'catalogus') desc, brand;
create temp table nieuw on commit drop as
  select r.brand, r.trade_name, r.first_year, r.last_year,
         coalesce(bm.brand, initcap(r.brand)) || '|' || initcap(r.trade_name) as car_id,
         coalesce(bm.brand, initcap(r.brand)) as nice_brand
  from public.rdw_models r left join bm on bm.nb = public.norm_name(r.brand)
  where r.car_id is null and r.vehicles >= ${MIN} and r.first_year is not null;
with ins as (
  insert into public.cars (id, brand, model, year_from, year_to, body, fuels, source)
  select distinct on (n.car_id) n.car_id, n.nice_brand, initcap(n.trade_name), n.first_year,
         case when n.last_year >= extract(year from now())::int - 1 then extract(year from now())::int else coalesce(n.last_year, n.first_year) end,
         'H', '{}', 'rdw'
  from nieuw n order by n.car_id
  on conflict (id) do nothing
  returning id)
select count(*) as nieuwe_modellen from ins;
update public.rdw_models r set car_id = n.car_id, match = 'voorstel'
from nieuw n join public.cars c on c.id = n.car_id
where r.brand = n.brand and r.trade_name = n.trade_name and r.car_id is null;
commit;
`;
fs.writeFileSync(OUT, sql);
console.error(`Geschreven: ${OUT} (${rows.length} rijen, ${(sql.length / 1e6).toFixed(1)} MB)`);
