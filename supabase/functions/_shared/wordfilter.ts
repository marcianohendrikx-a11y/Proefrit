// Woordfilter en woordenlijsten voor de serverfuncties (gegenereerd door gen8.py; zelfde regels als de app).
// Basis: LDNOOBW (CC BY 4.0), opgeschoond en aangevuld. Gecodeerd zodat de lijst niet leesbaar in de code staat.
const RULES: Record<string, string[]> = JSON.parse(atob("eyJjIjogWyJrYW5rZXIiLCAia2Vua2VyIiwgImthbmthaCIsICJ0eWZ1cyIsICJ0aWVmdXMiLCAidHlmZXMiLCAidGllZmVzIiwgImNob2xlcmEiLCAia29sZXJlIiwgIm5ldWsiLCAiZnVjayIsICJnb2R2ZXJkb20iLCAic29kZW1pZXRlciIsICJrbG9vdHphayIsICJrbG9vdGhvbW1lbCIsICJrbG9vdHZpb29sIiwgImN1bnQiLCAibW90aGVyZiIsICJhc3Nob2xlIiwgInRlcmluZ2xpamVyIiwgImthbmtlcmxpamVyIl0sICJwIjogWyJ0ZXJpbmciLCAia3V0IiwgImtsb3RlIiwgImtsb3RlbiIsICJrbGVyZSIsICJwb2trZSEiLCAicGxldXJpcyIsICJsdWwiLCAic2xldCIsICJob2VyZW4iLCAic2hpdCIsICJiaXRjaCIsICJ3aG9yZSIsICJyZXRhcmQiLCAiZGViaWVsIiwgIm1vbmdvb2wiLCAiZ29kdmVyIiwgInNjaGlqdCIsICJzdHJvbnQiLCAiZmFnZ290ISIsICJ3YW5rZXIiLCAiYmFzdGFyZCIsICJodWZ0ZXIiLCAiemFra2Vud2Fzc2VyIiwgInJlZXRyaWRkZXIiLCAicnVraG9uZCIsICJtYXRlbm5hYWllciIsICJkcm9vZ2tsb290IiwgImJlZmJvcnN0ZWwiLCAiYmVmZmVuIiwgImZsYW1vZXMiLCAiZ2VpbG5lZWYiLCAiZ3JlcHBlbGRlbCIsICJ0ZW1laWVyIiwgIm5pa2tlciIsICJzcGxlZXRvb2ciXSwgInMiOiBbImxpamVyIiwgImx1bCIsICJrdXQiLCAiaG9lciIsICJ0ZWVmIiwgIndpamYiLCAibmVnZXIhIl0sICJ3IjogWyJob2VyIiwgImthbmthIiwgImVpa2VsIiwgImVpa2VscyIsICJzbm9sIiwgInRlZWYiLCAid2lqZiIsICJ3aWp2ZW4iLCAia2xvam8iLCAiZHJvbCIsICJuZWdlciEiLCAibmVnZXJzISIsICJuaWdnZXIhIiwgIm5pZ2dlcnMhIiwgIm5pZ2dhISIsICJuaWdnYXMhIiwgImZsaWtrZXIiLCAiZmxpa2tlcnMiLCAidGJjIiwgImFpZHMiLCAic2x1dCIsICJzbHV0cyIsICJmYWchIiwgInR3YXQiLCAia2tyISJdLCAiZSI6IFsia2xlcmVuIiwgImtsZXJlbmthc3QiLCAia3V0dGVyIiwgImx1bGxhYnkiLCAibHVsbGlnIiwgInNoaXRha2UiLCAic2hpaXRha2UiXSwgIngiOiBbIlxcYmtyaWpnIChkZXxoZXR8ZWVufG58dCk/ID8ocGVzdHxwbGV1cmlzfGtvbGVyZXxrbGVyZXx0ZXJpbmd8dHlmdXN8a2Fua2VyfGNob2xlcmF8cG9ra2VufHRiY3xhaWRzfHRha2tlKVxcYiIsICJcXGIoZ2F8dmFsKSAodG9jaCApP2Rvb2RcXGIiLCAiXFxiaG9vcCBkYXQgamUgKGRvb2RnYWF0fHN0ZXJmdHxkb29kIGdhYXQpXFxiIiwgIlxcYmlrIG1hYWsgamUgYWZcXGIiLCAiXFxia2sgPyhhdXRvfGJha3xkaW5nfHpvb2kpXFxiIl19"));
export const TAGS = new Set<string>(["Sportief", "Fijn stuurgevoel", "Direct sturend", "Licht sturend", "Wendbaar", "Stabiel op de snelweg", "Goede wegligging", "Veel grip", "Weinig carrosseriehelling", "Neutraal weggedrag", "Kleine draaicirkel", "Makkelijk te parkeren", "Goed zicht rondom", "Sterke remmen", "Goed doseerbare remmen", "Fijne handbak", "Soepele automaat", "Snel schakelende automaat", "Goede tractie", "Sterk op sneeuw", "Goede vierwielaandrijving", "Volwassen rijgedrag", "Hard geveerd", "Te zacht geveerd", "Veel carrosseriehelling", "Vaag stuurgevoel", "Zwaar sturend", "Grote draaicirkel", "Onrustig op de snelweg", "Gevoelig voor zijwind", "Weinig grip", "Slecht zicht naar achteren", "Dikke A-stijlen", "Lastig parkeren", "Schokkerige automaat", "Trage automaat", "Vage versnellingsbak", "Sponzig rempedaal", "Stuitert op slechte wegen", "Snel", "Krachtig", "Veel koppel", "Trekt goed op", "Pittig", "Soepele motor", "Directe gasrespons", "Goede tussenacceleratie", "Fijn motorgeluid", "Mooi uitlaatgeluid", "Stille motor", "Sterk trekvermogen", "Traag", "Te weinig vermogen", "Luid", "Brult bij optrekken", "Turbogat", "Trillingen", "Ruwe motor", "Nep-motorgeluid", "Dorstig", "Hoog verbruik op de snelweg", "Comfortabel", "Stil", "Weinig windgeruis", "Weinig bandengeruis", "Soepel geveerd", "Goede stoelen", "Goede zithouding", "Veel zijdelingse steun", "Stoelverwarming", "Stoelventilatie", "Massagestoelen", "Stuurverwarming", "Goede airco", "Ontspannen op lange ritten", "Fijne armsteun", "Veel windgeruis", "Veel bandengeruis", "Krappe stoelen", "Harde stoelen", "Slechte zithouding", "Weinig zijdelingse steun", "Vermoeiend op lange ritten", "Zwakke airco", "Mooi interieur", "Goede afwerking", "Degelijke materialen", "Zachte materialen", "Veel opbergvakken", "Panoramadak", "Sfeerverlichting", "Logische bediening", "Fysieke knoppen", "Duidelijk dashboard", "Head-up display", "Groot scherm", "Snel infotainment", "Apple CarPlay", "Android Auto", "Draadloos laden", "Goed geluidssysteem", "Goede spraakbediening", "Goedkope materialen", "Veel hard plastic", "Rammelt", "Kraakt", "Matige afwerking", "Onhandig infotainment", "Traag infotainment", "Alles via het scherm", "Onhandige touchknoppen", "Krasgevoelig pianolak", "Weinig opbergruimte", "Onduidelijke menu’s", "Storende piepjes", "Ruim", "Veel beenruimte achter", "Veel hoofdruimte", "Grote kofferbak", "Vlakke laadvloer", "Lage tildrempel", "Neerklapbare achterbank", "Makkelijk instappen", "Handige isofix", "Zeven zitplaatsen", "Ruime laadbak", "Elektrische achterklep", "Trekhaak", "Krap achterin", "Weinig hoofdruimte", "Weinig beenruimte achter", "Kleine kofferbak", "Hoge tildrempel", "Lastig instappen", "Onhandige achterklep", "Zuinig", "Goede prijs", "Waardevast", "Goedkoop in onderhoud", "Betrouwbaar", "Lange garantie", "Lage bijtelling", "Lage wegenbelasting", "Veel standaarduitrusting", "Goedkoop rijden op LPG", "Prijzig", "Duur in onderhoud", "Dure opties", "Hoge bijtelling", "Snel waardeverlies", "Weinig standaarduitrusting", "Storingsgevoelig", "Dure banden", "Snel laden", "Veel bereik", "Betrouwbare bereikindicatie", "Goede laadplanner", "Eenpedaalsrijden", "Sterke regeneratie", "Warmtepomp", "Vlot voorverwarmen", "Bidirectioneel laden", "Stil elektrisch rijden", "Traag laden", "Weinig bereik", "Minder bereik in de winter", "Optimistische bereikindicatie", "Geen warmtepomp", "Laadpoort op onhandige plek", "Zwakke regeneratie", "Veilig gevoel", "Goede rijhulpsystemen", "Goede adaptieve cruisecontrol", "Rustige rijstrookassistent", "Goede achteruitrijcamera", "360-gradencamera", "Parkeersensoren rondom", "Goede koplampen", "Matrix-ledverlichting", "Dodehoekwaarschuwing", "Automatisch inparkeren", "Overgevoelige rijhulpsystemen", "Nerveuze rijstrookassistent", "Spookremmen", "Matige koplampen", "Assistenten lastig uit te zetten", "Mooi design", "Sportief uiterlijk", "Opvallend", "Tijdloos", "Mooie kleur", "Mooie velgen", "Stoer", "Elegant", "Saai design", "Kwetsbare lak"]);

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
