// Kenteken opzoeken bij de RDW en de best passende auto uit de catalogus voorstellen
// (voor 'vul je kenteken in, wij vullen merk, model en brandstof in').
import { admin, allowedFuels, cors, currentUser, json, lc, normPlate, rdwLookup, type CarRow } from "../_shared/common.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Alleen POST" }, 405);
  const user = await currentUser(req);
  if (!user) return json({ error: "Log in om een kenteken op te zoeken." }, 401);
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return json({ error: "Ongeldige invoer" }, 400); }
  const pn = normPlate(b.plate);
  if (!pn) return json({ error: "Dit lijkt geen Nederlands kenteken." }, 400);

  let rec;
  try { rec = await rdwLookup(pn.key); } catch { return json({ error: "De RDW is nu niet bereikbaar." }, 503); }
  if (!rec) return json({ found: false });

  const db = admin();
  // 1. Koppeling uit de RDW-import (merk + handelsbenaming precies zoals de RDW ze schrijft).
  const { data: mapped } = await db.from("rdw_models").select("car_id").eq("brand", rec.merk).eq("trade_name", rec.handelsbenaming).not("car_id", "is", null).maybeSingle();
  let direct: CarRow | null = null;
  if (mapped?.car_id) {
    const { data } = await db.from("cars").select("id,brand,model,year_from,year_to,fuels").eq("id", mapped.car_id).maybeSingle();
    direct = (data as CarRow | null) ?? null;
  }
  // 2. Anders: zelf de best passende naam zoeken.
  const { data: cars } = await db.from("cars").select("id,brand,model,year_from,year_to,fuels").ilike("brand", rec.merk.replace(/[%_]/g, ""));
  let hb = lc(rec.handelsbenaming);
  const pool = (cars ?? []) as CarRow[];
  if (pool[0] && hb.startsWith(lc(pool[0].brand) + " ")) hb = hb.slice(lc(pool[0].brand).length + 1);
  const scored = pool.map((c) => {
    const cm = lc(c.model);
    let s = 0;
    if (cm === hb) s = 3; else if (hb.startsWith(cm + " ") || cm.startsWith(hb + " ")) s = 2; else if (hb.split(" ")[0] === cm.split(" ")[0]) s = 1;
    if (s && rec!.jaar && rec!.jaar >= c.year_from && rec!.jaar <= c.year_to) s += 0.5;
    return { c, s };
  }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s);
  const best = direct ?? scored[0]?.c ?? null;
  const allowed = allowedFuels(rec.brandstoffen);
  let fuel: string | null = null;
  if (best && best.fuels.length) {
    if (allowed.has("LPG")) fuel = best.fuels.includes("LPG") ? "LPG" : best.fuels.includes("Benzine") ? "LPG-ombouw" : null;
    else if (allowed.has("CNG") && best.fuels.includes("CNG")) fuel = "CNG";
    else fuel = best.fuels.find((f) => allowed.has(f)) ?? null;
  }
  return json({ found: true, merk: rec.merk, handelsbenaming: rec.handelsbenaming, jaar: rec.jaar, brandstoffen: rec.brandstoffen, match: best ? { car_id: best.id, fuel } : null });
});
