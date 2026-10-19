// Foto van een rijder insturen voor de autopagina. Twee stappen, zodat de server nooit een
// onbewerkte foto bewaart en zelf geen beeldbewerking hoeft te doen:
//  1. mode "check":  de app stuurt de verkleinde foto. Claude beoordeelt hem en geeft de kaders van
//     leesbare kentekens terug. Er wordt niets bewaard.
//  2. mode "submit": de app stuurt de versie waarin die kaders onherkenbaar zijn gemaakt. Claude
//     controleert opnieuw (geen leesbaar kenteken, geen personen). Pas dan bewaren we hem in de
//     privé-map 'submissions' met status 'pending', tot een beheerder hem goedkeurt.
import { admin, b64ToBytes, cors, currentUser, json, sha256hex } from "../_shared/common.ts";
import { checkCarPhoto, photoVerdict } from "../_shared/photo.ts";

const TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 2_500_000, MAX_PENDING = 10, MAX_PER_HOUR = 20;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Alleen POST" }, 405);
  const user = await currentUser(req);
  if (!user) return json({ error: "Log in om een foto in te sturen." }, 401);
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return json({ error: "Ongeldige invoer" }, 400); }

  const mode = b.mode === "submit" ? "submit" : "check";
  const type = String(b.media_type ?? "image/jpeg");
  if (!TYPES.has(type)) return json({ error: "Kies een foto als JPG, PNG of WebP." }, 400);
  const image = String(b.image ?? "");
  const bytes = b64ToBytes(image);
  if (!bytes.length) return json({ error: "Er is geen foto meegestuurd." }, 400);
  if (bytes.length > MAX_BYTES) return json({ error: "De foto is te groot. Kies een kleinere foto." }, 413);
  const w = Number(b.width), h = Number(b.height);
  if (!Number.isInteger(w) || !Number.isInteger(h) || w < 200 || h < 200 || w > 4000 || h > 4000) return json({ error: "De foto heeft een ongeldig formaat." }, 400);

  const db = admin();
  const { data: car } = await db.from("cars").select("id,brand,model").eq("id", String(b.car_id ?? "")).maybeSingle();
  if (!car) return json({ error: "Kies een auto uit de lijst." }, 400);
  const carName = `${car.brand} ${car.model}`;

  // Elke controle kost een aanroep bij Claude: maximaal 20 per uur per gebruiker.
  const since = new Date(Date.now() - 3_600_000).toISOString();
  const { count: recent } = await db.from("photo_attempts").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", since);
  if ((recent ?? 0) >= MAX_PER_HOUR) return json({ error: "Je hebt het afgelopen uur al veel foto's gecontroleerd. Probeer het later opnieuw." }, 429);
  await db.from("photo_attempts").insert({ user_id: user.id });

  if (mode === "check") {
    const chk = await checkCarPhoto(image, type, carName, w, h, false);
    const v = photoVerdict(chk, carName, false);
    if (v.reject) return json({ reject: v.reject });
    return json({ auto: v.auto, ok: v.ok, notes: v.notes, plates: chk?.plates ?? [] });
  }

  // submit
  const { count: pending } = await db.from("photo_submissions").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "pending");
  if ((pending ?? 0) >= MAX_PENDING) return json({ error: `Je hebt al ${MAX_PENDING} foto's die op keuring wachten. Wacht tot die zijn bekeken.` }, 429);
  const hash = await sha256hex(bytes);
  const { data: dup } = await db.from("photo_submissions").select("id").eq("user_id", user.id).eq("image_hash", hash).maybeSingle();
  if (dup) return json({ error: "Deze foto heb je al ingestuurd." }, 409);

  const chk = await checkCarPhoto(image, type, carName, w, h, true);
  const v = photoVerdict(chk, carName, true);
  if (v.reject) return json({ reject: v.reject });
  // De eerste controle mag 'twijfel' hebben gegeven; de app geeft dat door.
  const auto = b.auto === "twijfel" && v.auto === "ok" ? "twijfel" : v.auto;

  const id = crypto.randomUUID();
  const ext = type === "image/png" ? "png" : type === "image/webp" ? "webp" : "jpg";
  const path = `${user.id}/${id}.${ext}`;
  const up = await db.storage.from("submissions").upload(path, bytes, { contentType: type, upsert: false });
  if (up.error) return json({ error: "Opslaan lukte niet. Probeer het later opnieuw." }, 500);
  const reviewId = typeof b.review_id === "string" && /^[0-9a-f-]{36}$/.test(b.review_id) ? b.review_id : null;
  const { error } = await db.from("photo_submissions").insert({
    id, user_id: user.id, car_id: car.id, review_id: reviewId, storage_path: path,
    width: w, height: h, image_hash: hash, auto_verdict: auto, ai_check: chk,
  });
  if (error) { await db.storage.from("submissions").remove([path]); return json({ error: "Opslaan lukte niet. Probeer het later opnieuw." }, 500); }
  return json({ id, status: "pending", ok: v.ok, notes: v.notes });
});
