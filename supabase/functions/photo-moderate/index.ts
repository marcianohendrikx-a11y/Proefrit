// Fotokeuring, alleen voor beheerders (tabel 'admins').
//  list     wachtende foto's met een tijdelijke link (10 minuten) en de uitslag van de voorkeuring
//  approve  naar de openbare map 'photos' zetten; optioneel met een door de beheerder extra
//           afgeschermde versie (image), en de privé-kopie verwijderen
//  reject   met reden afkeuren en de privé-kopie verwijderen
//  remove   een eerder goedgekeurde foto weer offline halen
import { admin, b64ToBytes, cors, currentUser, json } from "../_shared/common.ts";

const REASONS = new Set(["Kenteken of persoon herkenbaar", "Niet de juiste auto", "Te onscherp of te donker", "Geen eigen foto", "Ongepast"]);
type Row = { id: string; user_id: string; car_id: string; storage_path: string; public_path: string | null; status: string; width: number | null; height: number | null; auto_verdict: string; ai_check: unknown; created_at: string };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Alleen POST" }, 405);
  const user = await currentUser(req);
  if (!user) return json({ error: "Log in als beheerder." }, 401);
  const db = admin();
  const { data: isAdmin } = await db.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!isAdmin) return json({ error: "Alleen voor beheerders." }, 403);
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return json({ error: "Ongeldige invoer" }, 400); }
  const action = String(b.action ?? "list");

  if (action === "list") {
    const { data, error } = await db.from("photo_submissions").select("*").eq("status", "pending").order("created_at").limit(50);
    if (error) return json({ error: "Laden lukte niet." }, 500);
    const rows = (data ?? []) as Row[];
    const ids = [...new Set(rows.map((r) => r.user_id))];
    const { data: names } = ids.length ? await db.from("profiles").select("id,username").in("id", ids) : { data: [] };
    const nameOf = Object.fromEntries(((names ?? []) as { id: string; username: string }[]).map((n) => [n.id, n.username]));
    const items = await Promise.all(rows.map(async (r) => {
      const { data: s } = await db.storage.from("submissions").createSignedUrl(r.storage_path, 600);
      return { id: r.id, car_id: r.car_id, username: nameOf[r.user_id] ?? "onbekend", url: s?.signedUrl ?? null, width: r.width, height: r.height, auto: r.auto_verdict, check: r.ai_check, created_at: r.created_at };
    }));
    return json({ items });
  }

  const id = String(b.id ?? "");
  const { data: rowData } = await db.from("photo_submissions").select("*").eq("id", id).maybeSingle();
  const row = rowData as Row | null;
  if (!row) return json({ error: "Deze foto bestaat niet (meer)." }, 404);
  const done = { moderated_by: user.id, moderated_at: new Date().toISOString() };

  if (action === "approve") {
    if (row.status !== "pending") return json({ error: "Deze foto is al gekeurd." }, 409);
    let bytes: Uint8Array;
    let type = "image/jpeg";
    if (typeof b.image === "string" && b.image) {
      bytes = b64ToBytes(b.image); // versie met extra afscherming door de beheerder
      if (!bytes.length || bytes.length > 2_500_000) return json({ error: "De aangepaste foto is ongeldig." }, 400);
    } else {
      const dl = await db.storage.from("submissions").download(row.storage_path);
      if (dl.error || !dl.data) return json({ error: "De foto kon niet worden geladen." }, 500);
      bytes = new Uint8Array(await dl.data.arrayBuffer());
      type = dl.data.type || type;
    }
    const pub = `${row.car_id.replace(/[^A-Za-z0-9._-]+/g, "_")}/${row.id}.jpg`;
    const up = await db.storage.from("photos").upload(pub, bytes, { contentType: type, upsert: true });
    if (up.error) return json({ error: "Publiceren lukte niet." }, 500);
    const { error } = await db.from("photo_submissions").update({ status: "approved", public_path: pub, reason: null, ...done }).eq("id", row.id);
    if (error) return json({ error: "Opslaan lukte niet." }, 500);
    await db.storage.from("submissions").remove([row.storage_path]);
    return json({ status: "approved", public_path: pub });
  }

  if (action === "reject") {
    if (row.status !== "pending") return json({ error: "Deze foto is al gekeurd." }, 409);
    const reason = REASONS.has(String(b.reason)) ? String(b.reason) : "Ongepast";
    const { error } = await db.from("photo_submissions").update({ status: "rejected", reason, ...done }).eq("id", row.id);
    if (error) return json({ error: "Opslaan lukte niet." }, 500);
    await db.storage.from("submissions").remove([row.storage_path]);
    return json({ status: "rejected" });
  }

  if (action === "remove") {
    if (row.status !== "approved" || !row.public_path) return json({ error: "Alleen goedgekeurde foto's kunnen offline worden gehaald." }, 409);
    await db.storage.from("photos").remove([row.public_path]);
    const { error } = await db.from("photo_submissions").update({ status: "removed", ...done }).eq("id", row.id);
    if (error) return json({ error: "Opslaan lukte niet." }, 500);
    return json({ status: "removed" });
  }
  return json({ error: "Onbekende actie." }, 400);
});
