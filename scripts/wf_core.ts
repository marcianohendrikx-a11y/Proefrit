
const LEET: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "8": "b", "@": "a", "$": "s", "€": "e", "!": "i", "|": "i" };
const strip = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const c2 = (s: string) => s.replace(/(.)\1{2,}/g, "$1$1");
const c1 = (s: string) => s.replace(/(.)\1+/g, "$1");
type Term = { w: string; c: string; ex: boolean };
const prep = (l: string[] = []): Term[] => l.map((t) => { const ex = t.endsWith("!"); const w = strip(t.replace(/!$/, "")); return { w, c: c1(w), ex }; });
const L = { c: prep(RULES.c), p: prep(RULES.p), s: prep(RULES.s), w: prep(RULES.w) };
const E = (RULES.e ?? []).map(strip);
const X = (RULES.x ?? []).map((x) => new RegExp(x));

function tokens(text: string) {
  let s = strip(String(text ?? ""));
  s = s.split(/\s+/).map((w) => (/[a-z]/.test(w) ? w.replace(/[0134578@$€!|]/g, (ch) => LEET[ch] ?? ch) : w)).join(" ");
  s = s.replace(/(^|[^a-z*])((?:[a-z*][\s.\-_+]+){2,}[a-z*])(?=$|[^a-z*])/g, (_m, a: string, b: string) => a + b.replace(/[\s.\-_+]+/g, ""));
  return { toks: s.split(/[^a-z*]+/).filter(Boolean), flat: s.replace(/[^a-z*]+/g, " ").trim() };
}
function hitToken(t: string): boolean {
  if (E.some((e) => t.startsWith(e))) return false;
  const a = c2(t), b = c1(t), star = t.includes("*");
  const eq = (x: string, term: string) => (star ? x.length === term.length && [...x].every((ch, i) => ch === "*" || ch === term[i]) : x === term);
  const sw = (x: string, term: string) => (star ? eq(x.slice(0, term.length), term) : x.startsWith(term));
  const ew = (x: string, term: string) => (star ? x.length >= term.length && eq(x.slice(-term.length), term) : x.endsWith(term));
  const inn = (x: string, term: string) => {
    if (!star) return x.includes(term);
    for (let i = 0; i + term.length <= x.length; i++) if (eq(x.slice(i, i + term.length), term)) return true;
    return false;
  };
  const test = (fn: (x: string, term: string) => boolean, list: Term[]) => list.some((o) => fn(a, o.w) || (!o.ex && fn(b, o.c)));
  return test(eq, L.w) || test(sw, L.p) || test(ew, L.s) || test(inn, L.c);
}
const mask = (w: string) => (w.length <= 2 ? w[0] + "*" : w[0] + "*".repeat(Math.max(1, w.length - 2)) + w[w.length - 1]);

/** Geeft het (gemaskeerde) verboden woord terug, of null als de tekst in orde is. */
export function blockedWord(text: unknown): string | null {
  if (typeof text !== "string" || !text.trim()) return null;
  const { toks, flat } = tokens(text);
  for (const t of toks) { if (t.replace(/\*/g, "").length < 2) continue; if (hitToken(t)) return mask(t); }
  for (const re of X) { const m = flat.match(re); if (m) return mask(m[0]); }
  return null;
}
