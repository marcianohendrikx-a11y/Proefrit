// Alle personenauto's die ooit in Nederland op kenteken stonden, uit RDW Open Data (CC0).
// Telt per merk + handelsbenaming hoeveel voertuigen er zijn en in welke jaren ze voor het eerst
// op kenteken kwamen, en schrijft supabase/seed/rdw_models.sql. Dat bestand:
//   1. werkt de tabel rdw_models bij (koppelingen die een beheerder al heeft nagekeken blijven staan),
//   2. stelt voor elke nieuwe RDW-naam een model uit onze catalogus voor,
//   3. zet RDW-modellen zonder passend model, met minstens MIN_VEHICLES voertuigen, als nieuw model
//      in de catalogus (bron 'rdw'; brandstof volgt dan uit het kenteken bij de check-in).
//
// Gebruik:  node scripts/import-rdw.mjs [uitvoerbestand]
// Omgeving: RDW_APP_TOKEN (optioneel, hogere limieten), MIN_VEHICLES (standaard 200),
//           RDW_FIXTURE (pad naar een JSON-bestand met rijen, alleen voor tests zonder internet).
// Draait maandelijks via .github/workflows/import-rdw.yml.
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2] ?? path.join(path.dirname(new URL(import.meta.url).pathname), "..", "supabase", "seed", "rdw_models.sql");
const MIN = Math.max(1, Number(process.env.MIN_VEHICLES ?? 200));
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

// RDW-schrijfwijzen van merken die in onze catalogus anders heten (genormaliseerd: kleine letters, zonder leestekens).
const BRAND_ALIAS = {
  "bmw i": "BMW", "bmw alpina": "Alpina", "mercedes amg": "Mercedes-Benz", "mercedes benz": "Mercedes-Benz", "daimler benz": "Mercedes-Benz",
  "tesla motors": "Tesla", "jaguar cars": "Jaguar", "jaguar land rover": "Jaguar", "de lorean": "DeLorean", "g m c": "GMC",
  "n s u": "NSU", "ds automobiles": "DS", "automobili lamborghini s": "Lamborghini", "automobili lamborghini": "Lamborghini",
  "micro compact car": "Smart", "micro compact car smart": "Smart", "mcc": "Smart", "lada vaz": "Lada", "vaz": "Lada",
  "kg mobility": "SsangYong", "lucid motors": "Lucid", "vw": "Volkswagen", "vw porsche": "Porsche", "alpine renault": "Alpine",
  "rolls royce motor cars": "Rolls-Royce", "aston martin lagonda": "Aston Martin", "great wall motor": "Great Wall",
  "range rover": "Land Rover", "landrover": "Land Rover", "citroen": "Citroën", "skoda": "Škoda", "chevrolet daewoo": "Chevrolet",
  "ford cng technik": "Ford", "ineos automotive": "INEOS", "lynk co": "Lynk & Co", "polestar automotive": "Polestar",
};
const normName = (s) => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

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
create temp table alias (nb text primary key, brand text) on commit drop;
insert into alias values ${Object.entries(BRAND_ALIAS).map(([k, v]) => `(${lit(k)},${lit(v)})`).join(",")};
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
  select r.brand, r.trade_name, coalesce(public.norm_name(a.brand), public.norm_name(r.brand)) nb, public.norm_name(r.trade_name) nt,
         lower(substring(r.trade_name from '^([A-Za-z]{1,3}) ?[0-9]')) || ' klasse' as kl,
         substring(public.norm_name(r.trade_name) from '^([1-8])[0-9]{2}') || ' serie' as bs,
         replace(regexp_replace(regexp_replace(public.norm_name(r.trade_name), '^(amg|alfa|peugot|cupra|vw) ', ''), ' (series|reihe)( |$)', ' serie\\2'), ' ', '') as ntc
  from public.rdw_models r left join alias a on a.nb = public.norm_name(r.brand) where r.match <> 'zeker';
create temp table cn on commit drop as
  select id, brand, model, public.norm_name(brand) nb, public.norm_name(model) nm, replace(public.norm_name(model), ' ', '') nmc from public.cars where source = 'catalogus';
create index on rn (nb);
create index on cn (nb);
analyze rn; analyze cn;
with m as (
  select distinct on (rn.brand, rn.trade_name) rn.brand, rn.trade_name, cn.id
  from rn join cn on cn.nb = rn.nb
  where rn.nt = cn.nm or rn.nt like cn.nm || ' %' or rn.nt = cn.nb || ' ' || cn.nm
     or rn.nt like cn.nb || ' ' || cn.nm || ' %' or cn.nm = rn.kl or cn.nm = rn.bs
     or (length(cn.nmc) >= 2 and (rn.ntc = cn.nmc or rn.ntc like cn.nmc || '%'))
  order by rn.brand, rn.trade_name, (rn.nt = cn.nm or rn.ntc = cn.nmc) desc, length(cn.model) desc)
update public.rdw_models r set car_id = m.id, match = 'voorstel' from m
where r.brand = m.brand and r.trade_name = m.trade_name and r.car_id is distinct from m.id;

-- 3. Nieuwe modellen voor RDW-namen zonder voorstel. Streng, want de RDW kent ook typecodes ('111011', '1j'),
--    campers, bestelversies en namen met motorvermogen. Alleen voor merken die al in de catalogus staan,
--    met minstens ${MIN} voertuigen en een gewone modelnaam.
create temp table bm on commit drop as
  select distinct on (public.norm_name(brand)) public.norm_name(brand) nb, brand from public.cars
  where source = 'catalogus' order by public.norm_name(brand), brand;
create temp table nieuw on commit drop as
  select r.brand, r.trade_name, r.first_year, r.last_year,
         bm.brand || '|' || initcap(r.trade_name) as car_id, bm.brand as nice_brand
  from public.rdw_models r
  join rn on rn.brand = r.brand and rn.trade_name = r.trade_name
  join bm on bm.nb = rn.nb
  where r.car_id is null and r.match <> 'zeker' and r.vehicles >= ${MIN} and r.first_year is not null
    and rn.nt ~ '[a-z]'                                   -- niet alleen cijfers
    and rn.nt !~ '^[0-9]+[a-z]+[0-9a-z]*( |$)'            -- geen typecodes zoals 1j, 7dw, 70x0b
    and rn.nt !~ '^[0-9]{4,}'                             -- geen typenummers zoals 171021
    and rn.trade_name !~ '^[^A-Za-z0-9]' and rn.trade_name !~ '[*?]'   -- geen tekens vooraan, geen sterretjes
    and rn.nt !~ '(kampeer|camper|camping|wohnmobil|reisemobil|motorhome|bestel|ambulance|lijkwagen|rouw|taxi|politie|brandweer)'
    and rn.nt !~ '[0-9] ?(kw|pk)( |$)|( |^)(tdi|tsi|cdi|hdi|dci|crdi|tdci|automatic|automaat|aut)( |$)'
    and rn.nt <> rn.nb and rn.nt not like rn.nb || ' %';
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
