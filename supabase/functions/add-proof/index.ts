// Bewijs (kenteken en/of foto) toevoegen aan een eigen check-in die nog niet geverifieerd is.
import { admin, cors, currentUser, json, verifyProof, type CarRow, type Photo } from "../_shared/common.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Alleen POST" }, 405);
  const user = await currentUser(req);
  if (!user) return json({ error: "Log in om bewijs toe te voegen." }, 401);
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return json({ error: "Ongeldige invoer" }, 400); }

  const db = admin();
  const { data: r } = await db.from("reviews").select("id,user_id,car_id,fuel,ride_date,plate_verified,photo_verified").eq("id", String(b.review_id ?? "")).maybeSingle();
  if (!r || r.user_id !== user.id) return json({ error: "Check-in niet gevonden." }, 404);
  const { data: carData } = await db.from("cars").select("id,brand,model,year_from,year_to,fuels").eq("id", r.car_id).single();
  const car = carData as CarRow;
  const proof = await verifyProof(db, user.id, car, r.fuel, r.ride_date, b.plate as string | null, b.photo as Photo | null);
  if (proof.hard.length) return json({ error: proof.hard[0], proof }, 422);
  if (!proof.vp && !proof.vh) return json({ error: "Er kon nog niets worden geverifieerd.", proof }, 422);

  const patch = { plate_verified: r.plate_verified || proof.vp, photo_verified: r.photo_verified || proof.vh };
  await db.from("reviews").update(patch).eq("id", r.id);
  if (proof.vp && !r.plate_verified) await db.from("plate_uses").insert({ plate_hash: proof.plateHash, user_id: user.id, car_id: r.car_id, ride_date: r.ride_date, review_id: r.id });
  if (proof.vh && !r.photo_verified) await db.from("photo_hashes").insert({ hash: proof.photoHash, user_id: user.id, review_id: r.id });
  return json({ ...patch, proof: { ok: proof.ok, soft: proof.soft } });
});
