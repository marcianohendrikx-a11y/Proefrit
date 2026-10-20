// Antwoord op een ticket (alleen beheerders). Het antwoord is altijd te zien in de app bij 'Jouw meldingen'.
// Is er een eigen afzenderadres ingesteld (FROM_EMAIL, kan pas met een eigen domein) en liet de melder een
// e-mailadres achter, dan gaat het antwoord ook per e-mail. Het adres van de beheerder komt nooit in die mail.
import { admin, cors, currentUser, json } from "../_shared/common.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Alleen POST" }, 405);
  const user = await currentUser(req);
  if (!user) return json({ error: "Log in als beheerder." }, 401);
  const db = admin();
  const { data: adm } = await db.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!adm) return json({ error: "Alleen voor beheerders." }, 403);
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return json({ error: "Ongeldige invoer" }, 400); }
  const reply = String(b.reply ?? "").trim();
  if (reply.length < 2 || reply.length > 2000) return json({ error: "Schrijf een antwoord van 2 tot 2000 tekens." }, 400);

  const { data: t } = await db.from("tickets").select("id,code,type,message,reply_email").eq("id", String(b.id ?? "")).maybeSingle();
  if (!t) return json({ error: "Dit ticket bestaat niet (meer)." }, 404);
  const { error } = await db.from("tickets").update({ reply, replied_at: new Date().toISOString(), status: "Afgehandeld" }).eq("id", t.id);
  if (error) return json({ error: "Opslaan lukte niet." }, 500);

  let emailed = false;
  const key = Deno.env.get("RESEND_API_KEY"), from = Deno.env.get("FROM_EMAIL");
  if (key && from && t.reply_email) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "User-Agent": "proefrit-ticket/1.0" },
      body: JSON.stringify({
        from, to: [t.reply_email],
        subject: `Antwoord op je melding ${t.code} bij Proefrit`,
        text: `Hoi,\n\nBedankt voor je melding bij Proefrit (${t.code}). Ons antwoord:\n\n${reply}\n\nJe schreef:\n${t.message}\n\nGroet,\nHet Proefrit-team`,
      }),
    });
    emailed = res.ok;
  }
  return json({ ok: true, emailed, can_email: !!(key && from) });
});
