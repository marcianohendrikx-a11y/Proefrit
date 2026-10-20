// Kenteken controleren bij een auto in je garage ('Rijd ik nu'). Zet plate_verified als het klopt.
import { admin, compareRdw, cors, currentUser, json, mappedCar, normPlate, rdwLookup, rdwName, type CarRow } from "../_shared/common.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Alleen POST" }, 405);
  const user = await currentUser(req);
  if (!user) return json({ error: "Log in eerst." }, 401);
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return json({ error: "Ongeldige invoer" }, 400); }
  const pn = normPlate(b.plate);
  if (!pn) return json({ error: "Dit lijkt geen Nederlands kenteken." }, 400);

  const db = admin();
  const { data: item } = await db.from("garage_items").select("id,user_id,car_id,fuel,status,year").eq("id", String(b.garage_item_id ?? "")).maybeSingle();
  if (!item || item.user_id !== user.id) return json({ error: "Auto niet gevonden in je garage." }, 404);
  if (item.status !== "nu") return json({ error: "Alleen een auto die je nu rijdt kun je met kenteken controleren." }, 400);
  const { data: carData } = await db.from("cars").select("id,brand,model,year_from,year_to,fuels").eq("id", item.car_id).single();
  const car = carData as CarRow;
  let rec;
  try { rec = await rdwLookup(pn.key); } catch { return json({ error: "De RDW is nu niet bereikbaar." }, 503); }
  if (!rec) return json({ verified: false, reason: "Kenteken niet gevonden bij de RDW." });
  const c = compareRdw(rec, car, item.fuel, await mappedCar(db, rec));
  if (!c.brand || !c.fuel) return json({ verified: false, reason: `Dit kenteken hoort bij een ${rdwName(rec)} (${rec.brandstoffen.join(" + ").toLowerCase()}).` }, 422);
  if (c.model !== "ja") return json({ verified: false, reason: "Merk klopt, maar het model konden we niet zeker koppelen." });
  await db.from("garage_items").update({ plate_verified: true, year: item.year ?? rec.jaar }).eq("id", item.id);
  return json({ verified: true, jaar: rec.jaar });
});
