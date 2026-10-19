// Proefrit: koppeling tussen de app en de backend (Supabase).
// De pagina laadt dit als module. URL en publieke sleutel komen uit config.js
// (de 'anon public' sleutel is bedoeld om openbaar te zijn; de echte beveiliging zit in de databaseregels).
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

export const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true } });
const uid = async () => (await sb.auth.getUser()).data.user?.id ?? null;
const fail = (error) => { if (error) throw new Error(error.message || "Er ging iets mis"); };

// ---------- Inloggen ----------
export const auth = {
  google: () => sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: location.origin } }),
  apple: () => sb.auth.signInWithOAuth({ provider: "apple", options: { redirectTo: location.origin } }),
  signUp: (email, password) => sb.auth.signUp({ email, password, options: { emailRedirectTo: location.origin } }),
  signIn: (email, password) => sb.auth.signInWithPassword({ email, password }),
  signOut: () => sb.auth.signOut(),
  onChange: (cb) => sb.auth.onAuthStateChange((_event, session) => cb(session?.user ?? null)),
  user: async () => (await sb.auth.getUser()).data.user ?? null,
};

// ---------- Profiel ----------
export const profiles = {
  mine: async () => { const id = await uid(); if (!id) return null; const { data, error } = await sb.from("profiles").select("*").eq("id", id).maybeSingle(); fail(error); return data; },
  create: async (p) => { const id = await uid(); const { data, error } = await sb.from("profiles").insert({ ...p, id }).select().single(); fail(error); return data; },
  update: async (patch) => { const id = await uid(); const { data, error } = await sb.from("profiles").update(patch).eq("id", id).select().single(); fail(error); return data; },
  card: async (username) => { const { data, error } = await sb.from("profile_cards").select("*").ilike("username", username).maybeSingle(); fail(error); return data; },
  names: async (ids) => {
    if (!ids.length) return {};
    const { data, error } = await sb.from("profile_names").select("id,username,avatar_url").in("id", [...new Set(ids)]); fail(error);
    return Object.fromEntries((data ?? []).map((p) => [p.id, p]));
  },
  usernameFree: async (name) => { const { count } = await sb.from("profile_names").select("id", { count: "exact", head: true }).ilike("username", name); return !count; },
};

// ---------- Catalogus (1.830+ modellen, in delen van 1000 opgehaald) ----------
export async function catalog() {
  const all = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb.from("cars").select("id,brand,model,year_from,year_to,body,fuels").order("id").range(from, from + 999); fail(error);
    all.push(...data); if (data.length < 1000) break;
  }
  const { data: versions, error } = await sb.from("car_versions").select("car_id,label,fuel").limit(10000); fail(error);
  return { cars: all, versions };
}

// ---------- Woordenlijsten: kenmerken ('Wat viel op?') en interesses, alleen deze woorden zijn toegestaan ----------
export async function vocab() {
  const { data, error } = await sb.from("vocab").select("term,kind,grp,neg").limit(5000); fail(error);
  return { tags: data.filter((v) => v.kind === "tag"), interests: data.filter((v) => v.kind === "interest") };
}

// ---------- Reviews ----------
async function withExtras(rows) {
  const ids = rows.map((r) => r.id);
  const [names, likes, comments] = await Promise.all([
    profiles.names(rows.map((r) => r.user_id)),
    ids.length ? sb.from("likes").select("review_id,user_id").in("review_id", ids) : { data: [] },
    ids.length ? sb.from("comments").select("id,review_id,user_id,body,created_at").in("review_id", ids).order("created_at") : { data: [] },
  ]);
  const me = await uid();
  return rows.map((r) => ({
    ...r,
    author: names[r.user_id] ?? null,
    likes: (likes.data ?? []).filter((l) => l.review_id === r.id).length,
    likedByMe: (likes.data ?? []).some((l) => l.review_id === r.id && l.user_id === me),
    comments: (comments.data ?? []).filter((c) => c.review_id === r.id),
  }));
}
export const reviews = {
  feed: async ({ limit = 30, before = null, verifiedOnly = false } = {}) => {
    let q = sb.from("reviews").select("*").order("created_at", { ascending: false }).limit(limit);
    if (before) q = q.lt("created_at", before);
    if (verifiedOnly) q = q.eq("plate_verified", true).eq("photo_verified", true);
    const { data, error } = await q; fail(error); return withExtras(data);
  },
  byCar: async (carId) => { const { data, error } = await sb.from("reviews").select("*").eq("car_id", carId).order("created_at", { ascending: false }); fail(error); return withExtras(data); },
  byUser: async (userId) => { const { data, error } = await sb.from("reviews").select("*").eq("user_id", userId).order("created_at", { ascending: false }); fail(error); return withExtras(data); },
  stats: async (carId) => { const { data } = await sb.from("car_stats").select("*").eq("car_id", carId).maybeSingle(); return data; },
  like: async (reviewId, on) => {
    const id = await uid();
    const { error } = on ? await sb.from("likes").insert({ review_id: reviewId, user_id: id }) : await sb.from("likes").delete().eq("review_id", reviewId).eq("user_id", id);
    fail(error);
  },
  comment: async (reviewId, body) => { const id = await uid(); const { error } = await sb.from("comments").insert({ review_id: reviewId, user_id: id, body }); fail(error); },
};

// Foto verkleinen (max 1600 px, JPEG) voordat hij naar de server gaat.
export async function photoPayload(file) {
  if (!file) return null;
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const s = Math.min(1, 1600 / Math.max(img.width, img.height));
    const c = document.createElement("canvas"); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return { data: c.toDataURL("image/jpeg", 0.85).split(",")[1], type: "image/jpeg", taken_at: file.lastModified };
  } finally { URL.revokeObjectURL(url); }
}

// Check-in en bewijs gaan via de server, die kenteken (RDW) en foto (Claude) controleert.
async function call(name, body) {
  const { data, error } = await sb.functions.invoke(name, { body });
  if (error) {
    let msg = error.message;
    try { const j = await error.context.json(); msg = j.error || msg; } catch { /* geen JSON */ }
    throw new Error(msg);
  }
  return data;
}
export const checkin = async (form, photoFile) => call("checkin", { ...form, photo: await photoPayload(photoFile) });
export const addProof = async (reviewId, plate, photoFile) => call("add-proof", { review_id: reviewId, plate, photo: await photoPayload(photoFile) });
export const rdwLookup = (plate) => call("rdw-lookup", { plate });
export const sendTicket = (t) => call("ticket", t);

// ---------- Garage ----------
export const garage = {
  of: async (userId) => { const { data, error } = await sb.from("garage_items").select("*").eq("user_id", userId).order("created_at"); fail(error); return data; },
  add: async (item) => { const id = await uid(); const { data, error } = await sb.from("garage_items").insert({ ...item, user_id: id }).select().single(); fail(error); return data; },
  remove: async (itemId) => { const { error } = await sb.from("garage_items").delete().eq("id", itemId); fail(error); },
  verifyPlate: (itemId, plate) => call("garage-plate", { garage_item_id: itemId, plate }),
};

// ---------- Chat met akkoord ----------
export const chat = {
  list: async () => { const { data, error } = await sb.from("conversations").select("*").order("updated_at", { ascending: false }); fail(error); return data; },
  messages: async (convId) => { const { data, error } = await sb.from("messages").select("*").eq("conversation_id", convId).order("created_at"); fail(error); return data; },
  /** Verzoek starten met precies één bericht. */
  request: async (otherUserId, firstMessage) => {
    const me = await uid();
    const { data: conv, error } = await sb.from("conversations").insert({ user_a: me, user_b: otherUserId, requested_by: me }).select().single(); fail(error);
    const { error: e2 } = await sb.from("messages").insert({ conversation_id: conv.id, sender_id: me, body: firstMessage }); fail(e2);
    return conv;
  },
  send: async (convId, body) => { const me = await uid(); const { error } = await sb.from("messages").insert({ conversation_id: convId, sender_id: me, body }); fail(error); },
  respond: async (convId, action /* 'accept' | 'decline' | 'block' */) => { const { data, error } = await sb.rpc("respond_chat", { conv: convId, action }); fail(error); return data; },
  live: (convId, onMessage) => sb.channel("conv-" + convId)
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${convId}` }, (p) => onMessage(p.new))
    .subscribe(),
};

// ---------- Foto's van rijders (pas zichtbaar na keuring) ----------
// Stap 1: de server laat Claude de foto beoordelen en geeft kaders van leesbare kentekens terug.
// Stap 2: de app maakt die kaders hier onherkenbaar en stuurt alleen die versie in.
// De server controleert dat opnieuw; daarna keurt een beheerder de foto.
const PH_MAX = 1280;
function scaled(img) {
  const s = Math.min(1, PH_MAX / Math.max(img.naturalWidth, img.naturalHeight));
  const c = document.createElement("canvas"); c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
  c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); return c;
}
/** Mozaïek over een kader (fracties van 0 tot 1). grow = kader ruim vergroten. */
export function mosaic(c, b, grow = true) {
  const W = c.width, H = c.height, cx = (b.x + b.w / 2) * W, cy = (b.y + b.h / 2) * H;
  const bw = grow ? Math.max(b.w * W * 1.6, W * 0.07) : b.w * W, bh = grow ? Math.max(b.h * H * 2.2, H * 0.05) : b.h * H;
  const x = Math.max(0, Math.round(cx - bw / 2)), y = Math.max(0, Math.round(cy - bh / 2));
  const w = Math.min(W - x, Math.round(bw)), h = Math.min(H - y, Math.round(bh)); if (w < 2 || h < 2) return;
  const blk = Math.max(6, Math.round(Math.min(w, h) / 3)), t = document.createElement("canvas");
  t.width = Math.max(1, Math.ceil(w / blk)); t.height = Math.max(1, Math.ceil(h / blk));
  t.getContext("2d").drawImage(c, x, y, w, h, 0, 0, t.width, t.height);
  const ctx = c.getContext("2d"); ctx.save(); ctx.imageSmoothingEnabled = false; ctx.drawImage(t, 0, 0, t.width, t.height, x, y, w, h); ctx.restore();
}
const jpeg = (c) => c.toDataURL("image/jpeg", 0.85).split(",")[1];

/** Controleren: geeft { reject } of { ok, notes, preview, send() } terug. Er wordt nog niets bewaard. */
export async function prepareCarPhoto(carId, file) {
  const url = URL.createObjectURL(file);
  let img;
  try { img = new Image(); img.src = url; await img.decode(); } finally { URL.revokeObjectURL(url); }
  const c = scaled(img);
  const first = await call("photo", { mode: "check", car_id: carId, image: jpeg(c), media_type: "image/jpeg", width: c.width, height: c.height });
  if (first.reject) return { reject: first.reject };
  (first.plates || []).forEach((b) => mosaic(c, b, true));
  const image = jpeg(c);
  return {
    ok: first.ok, notes: first.notes, preview: "data:image/jpeg;base64," + image,
    send: (reviewId = null) => call("photo", { mode: "submit", car_id: carId, image, media_type: "image/jpeg", width: c.width, height: c.height, auto: first.auto, review_id: reviewId }),
  };
}
export const carPhotos = async (carId) => {
  const { data, error } = await sb.from("car_photos").select("*").eq("car_id", carId).order("approved_at", { ascending: false }).limit(24); fail(error);
  return data.map((p) => ({ ...p, url: sb.storage.from("photos").getPublicUrl(p.public_path).data.publicUrl }));
};
export const myPhotoSubmissions = async () => {
  const id = await uid(); if (!id) return [];
  const { data, error } = await sb.from("photo_submissions").select("id,car_id,status,reason,created_at").eq("user_id", id).order("created_at", { ascending: false }); fail(error); return data;
};
// Alleen voor beheerders (de server controleert dat).
export const moderation = {
  list: async () => (await call("photo-moderate", { action: "list" })).items,
  approve: (id, editedImageBase64 = null) => call("photo-moderate", { action: "approve", id, image: editedImageBase64 }),
  reject: (id, reason) => call("photo-moderate", { action: "reject", id, reason }),
  remove: (id) => call("photo-moderate", { action: "remove", id }),
};
