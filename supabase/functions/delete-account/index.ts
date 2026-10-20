// Account verwijderen (recht op vergetelheid, AVG art. 17).
// Verwijdert foto's en profielfoto's uit de opslag, de eigen tickets en daarna het inlogaccount.
// Profiel, garage, check-ins, reacties, Top!'s, chats en ingestuurde foto's verdwijnen via 'on delete cascade'.
import { admin, cors, currentUser, json } from "../_shared/common.ts";

async function removeFolder(db: ReturnType<typeof admin>, bucket: string, folder: string) {
  for (let i = 0; i < 20; i++) {
    const { data } = await db.storage.from(bucket).list(folder, { limit: 100 });
    const paths = ((data ?? []) as { name: string }[]).filter((f) => f.name).map((f) => `${folder}/${f.name}`);
    if (!paths.length) return;
    await db.storage.from(bucket).remove(paths);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Alleen POST" }, 405);
  const user = await currentUser(req);
  if (!user) return json({ error: "Log eerst in." }, 401);
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return json({ error: "Ongeldige invoer" }, 400); }

  const db = admin();
  const { data: prof } = await db.from("profiles").select("username").eq("id", user.id).maybeSingle();
  const expected = prof?.username ?? "";
  if (expected && String(b.confirm ?? "").trim().toLowerCase() !== expected.toLowerCase()) {
    return json({ error: "Typ je gebruikersnaam precies over om te bevestigen." }, 400);
  }

  // Goedgekeurde foto's staan openbaar in 'photos' onder een map per auto.
  const { data: pubs } = await db.from("photo_submissions").select("public_path").eq("user_id", user.id).not("public_path", "is", null);
  const pubPaths = ((pubs ?? []) as { public_path: string | null }[]).map((p) => p.public_path as string).filter(Boolean);
  if (pubPaths.length) await db.storage.from("photos").remove(pubPaths);
  await removeFolder(db, "submissions", user.id);
  await removeFolder(db, "avatars", user.id);
  await db.from("tickets").delete().eq("user_id", user.id);

  const { error } = await db.auth.admin.deleteUser(user.id);
  if (error) return json({ error: "Verwijderen lukte niet. Probeer het later opnieuw of stuur een melding." }, 500);
  return json({ deleted: true });
});
