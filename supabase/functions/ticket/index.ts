// Opmerking over de website: bewaart een ticket en stuurt een e-mail naar het supportadres.
// Het adres staat alleen in de geheime instelling SUPPORT_EMAIL, nooit in de app of in de code.
import { admin, cors, currentUser, json } from "../_shared/common.ts";

const TYPES = new Set(["Er werkt iets niet", "Idee voor een nieuwe functie", "Vraag", "Iets anders"]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Alleen POST" }, 405);
  const user = await currentUser(req); // mag ook zonder account
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return json({ error: "Ongeldige invoer" }, 400); }
  const type = TYPES.has(String(b.type)) ? String(b.type) : "Iets anders";
  const message = String(b.message ?? "").trim();
  if (message.length < 10 || message.length > 1000) return json({ error: "Beschrijf je opmerking in 10 tot 1000 tekens." }, 400);
  const reply = String(b.reply_email ?? "").trim().slice(0, 120);
  if (reply && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reply)) return json({ error: "Dit e-mailadres lijkt niet te kloppen." }, 400);
  const page = String(b.page ?? "").slice(0, 80);

  const db = admin();
  if (user) {
    const since = new Date(Date.now() - 3_600_000).toISOString();
    const { count } = await db.from("tickets").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", since);
    if ((count ?? 0) >= 5) return json({ error: "Je hebt het afgelopen uur al 5 meldingen gestuurd. Probeer het later opnieuw." }, 429);
  }
  const code = "PR-" + crypto.randomUUID().replace(/-/g, "").slice(0, 7).toUpperCase();
  const { error } = await db.from("tickets").insert({ code, user_id: user?.id ?? null, type, message, reply_email: reply || null, page });
  if (error) return json({ error: "Opslaan lukte niet." }, 500);

  const key = Deno.env.get("RESEND_API_KEY"), to = Deno.env.get("SUPPORT_EMAIL");
  let mailed = false;
  if (key && to) {
    let username = "gast";
    if (user) { const { data } = await db.from("profiles").select("username").eq("id", user.id).maybeSingle(); username = data?.username ?? "lid"; }
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "User-Agent": "proefrit-ticket/1.0" },
      body: JSON.stringify({
        from: Deno.env.get("FROM_EMAIL") ?? "Proefrit <onboarding@resend.dev>",
        to: [to],
        reply_to: reply || undefined,
        subject: `[Proefrit] ${code}: ${type}`,
        text: `Ticket ${code}\nType: ${type}\nVan: ${username}\nPagina: ${page || "-"}\nAntwoord naar: ${reply || "-"}\n\n${message}`,
      }),
    });
    mailed = res.ok;
  }
  return json({ code, mailed });
});
