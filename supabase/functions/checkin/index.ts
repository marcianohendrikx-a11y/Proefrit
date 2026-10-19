// Nieuwe check-in plaatsen. Controleert kenteken (RDW) en foto (Claude) op de server,
// zodat niemand zelf 'geverifieerd' kan aanvinken.
import { admin, blockedWord, cors, currentUser, json, RIDES, TAGS, verifyProof, type CarRow, type Photo } from "../_shared/common.ts";

const score = (v: unknown) => Number.isInteger(v) && (v as number) >= 1 && (v as number) <= 5;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Alleen POST" }, 405);
  const user = await currentUser(req);
  if (!user) return json({ error: "Log in om een check-in te plaatsen." }, 401);
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return json({ error: "Ongeldige invoer" }, 400); }

  const db = admin();
  const { data: carData } = await db.from("cars").select("id,brand,model,year_from,year_to,fuels").eq("id", String(b.car_id ?? "")).maybeSingle();
  const car = carData as CarRow | null;
  if (!car) return json({ error: "Kies een auto uit de lijst." }, 400);
  const fuel = String(b.fuel ?? "");
  const ALL_FUELS = ["Benzine", "Diesel", "Hybride", "Plug-in hybride", "Elektrisch", "LPG", "LPG-ombouw", "CNG", "Waterstof"];
  const fuelOk = car.fuels.length ? car.fuels.includes(fuel) || (fuel === "LPG-ombouw" && car.fuels.includes("Benzine")) : ALL_FUELS.includes(fuel);
  if (!fuelOk) return json({ error: "Deze brandstof hoort niet bij deze auto." }, 400);
  const rideType = String(b.ride_type ?? "");
  if (!RIDES.has(rideType)) return json({ error: "Kies hoe je in de auto kwam." }, 400);
  const rideDate = String(b.ride_date ?? "");
  const today = new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(rideDate) || rideDate > today) return json({ error: "De ritdatum klopt niet." }, 400);
  const s = (b.scores ?? {}) as Record<string, unknown>;
  if (![b.overall, s.drive, s.comfort, s.engine, s.space, s.value].every(score)) return json({ error: "Geef alle scores van 1 tot 5." }, 400);
  const text = String(b.body ?? "").trim().slice(0, 500);
  const bw = blockedWord(text);
  if (bw) return json({ error: `Je review bevat een woord dat niet is toegestaan (${bw}). Scheldwoorden en ziektes als scheldwoord horen niet op Proefrit.` }, 400);
  const tags = Array.isArray(b.tags) ? (b.tags as unknown[]).map(String).filter((t) => TAGS.has(t)).slice(0, 5) : [];

  const proof = await verifyProof(db, user.id, car, fuel, rideDate, b.plate as string | null, b.photo as Photo | null);
  if (proof.hard.length) return json({ error: proof.hard[0], proof }, 422);

  const { data: review, error } = await db.from("reviews").insert({
    user_id: user.id, car_id: car.id, fuel, version: b.version ? String(b.version).slice(0, 80) : null,
    ride_type: rideType, ride_date: rideDate, overall: b.overall,
    score_drive: s.drive, score_comfort: s.comfort, score_engine: s.engine, score_space: s.space, score_value: s.value,
    body: text || null, tags, plate_verified: proof.vp, photo_verified: proof.vh,
  }).select().single();
  if (error) return json({ error: "Opslaan lukte niet. Probeer het opnieuw." }, 500);
  if (proof.vp) await db.from("plate_uses").insert({ plate_hash: proof.plateHash, user_id: user.id, car_id: car.id, ride_date: rideDate, review_id: review.id });
  if (proof.vh) await db.from("photo_hashes").insert({ hash: proof.photoHash, user_id: user.id, review_id: review.id });
  return json({ review, proof: { vp: proof.vp, vh: proof.vh, ok: proof.ok, soft: proof.soft } });
});
