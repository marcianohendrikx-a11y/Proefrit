# Genereert de woordenlijsten (kenmerken, interesses, woordfilter) voor de app en de backend uit één bron,
# zodat app, serverfuncties en database precies dezelfde lijsten gebruiken.
# Gebruik: python3 scripts/gen-wordlists.py   (pas de lijsten hieronder aan en draai opnieuw; daarna vocab.sql opnieuw laden)
import json, base64, re, os, unicodedata

S = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(S)

# ---------- Kenmerken ('Wat viel op?'): categorie, positief, negatief ----------
TAGS = [
 ("Rijgedrag",
  ["Sportief","Fijn stuurgevoel","Direct sturend","Licht sturend","Wendbaar","Stabiel op de snelweg","Goede wegligging","Veel grip",
   "Weinig carrosseriehelling","Neutraal weggedrag","Kleine draaicirkel","Makkelijk te parkeren","Goed zicht rondom","Sterke remmen",
   "Goed doseerbare remmen","Fijne handbak","Soepele automaat","Snel schakelende automaat","Goede tractie","Sterk op sneeuw",
   "Goede vierwielaandrijving","Volwassen rijgedrag"],
  ["Hard geveerd","Te zacht geveerd","Veel carrosseriehelling","Vaag stuurgevoel","Zwaar sturend","Grote draaicirkel","Onrustig op de snelweg",
   "Gevoelig voor zijwind","Weinig grip","Slecht zicht naar achteren","Dikke A-stijlen","Lastig parkeren","Schokkerige automaat",
   "Trage automaat","Vage versnellingsbak","Sponzig rempedaal","Stuitert op slechte wegen"]),
 ("Motor en prestaties",
  ["Snel","Krachtig","Veel koppel","Trekt goed op","Pittig","Soepele motor","Directe gasrespons","Goede tussenacceleratie",
   "Fijn motorgeluid","Mooi uitlaatgeluid","Stille motor","Sterk trekvermogen"],
  ["Traag","Te weinig vermogen","Luid","Brult bij optrekken","Turbogat","Trillingen","Ruwe motor","Nep-motorgeluid","Dorstig",
   "Hoog verbruik op de snelweg"]),
 ("Comfort",
  ["Comfortabel","Stil","Weinig windgeruis","Weinig bandengeruis","Soepel geveerd","Goede stoelen","Goede zithouding",
   "Veel zijdelingse steun","Stoelverwarming","Stoelventilatie","Massagestoelen","Stuurverwarming","Goede airco",
   "Ontspannen op lange ritten","Fijne armsteun"],
  ["Veel windgeruis","Veel bandengeruis","Krappe stoelen","Harde stoelen","Slechte zithouding","Weinig zijdelingse steun",
   "Vermoeiend op lange ritten","Zwakke airco"]),
 ("Interieur en bediening",
  ["Mooi interieur","Goede afwerking","Degelijke materialen","Zachte materialen","Veel opbergvakken","Panoramadak","Sfeerverlichting",
   "Logische bediening","Fysieke knoppen","Duidelijk dashboard","Head-up display","Groot scherm","Snel infotainment","Apple CarPlay",
   "Android Auto","Draadloos laden","Goed geluidssysteem","Goede spraakbediening"],
  ["Goedkope materialen","Veel hard plastic","Rammelt","Kraakt","Matige afwerking","Onhandig infotainment","Traag infotainment",
   "Alles via het scherm","Onhandige touchknoppen","Krasgevoelig pianolak","Weinig opbergruimte","Onduidelijke menu’s","Storende piepjes"]),
 ("Ruimte en praktisch",
  ["Ruim","Veel beenruimte achter","Veel hoofdruimte","Grote kofferbak","Vlakke laadvloer","Lage tildrempel","Neerklapbare achterbank",
   "Makkelijk instappen","Handige isofix","Zeven zitplaatsen","Ruime laadbak","Elektrische achterklep","Trekhaak"],
  ["Krap achterin","Weinig hoofdruimte","Weinig beenruimte achter","Kleine kofferbak","Hoge tildrempel","Lastig instappen",
   "Onhandige achterklep"]),
 ("Kosten",
  ["Zuinig","Goede prijs","Waardevast","Goedkoop in onderhoud","Betrouwbaar","Lange garantie","Lage bijtelling","Lage wegenbelasting",
   "Veel standaarduitrusting","Goedkoop rijden op LPG"],
  ["Prijzig","Duur in onderhoud","Dure opties","Hoge bijtelling","Snel waardeverlies","Weinig standaarduitrusting","Storingsgevoelig",
   "Dure banden"]),
 ("Elektrisch rijden",
  ["Snel laden","Veel bereik","Betrouwbare bereikindicatie","Goede laadplanner","Eenpedaalsrijden","Sterke regeneratie","Warmtepomp",
   "Vlot voorverwarmen","Bidirectioneel laden","Stil elektrisch rijden"],
  ["Traag laden","Weinig bereik","Minder bereik in de winter","Optimistische bereikindicatie","Geen warmtepomp",
   "Laadpoort op onhandige plek","Zwakke regeneratie"]),
 ("Veiligheid en hulpsystemen",
  ["Veilig gevoel","Goede rijhulpsystemen","Goede adaptieve cruisecontrol","Rustige rijstrookassistent","Goede achteruitrijcamera",
   "360-gradencamera","Parkeersensoren rondom","Goede koplampen","Matrix-ledverlichting","Dodehoekwaarschuwing","Automatisch inparkeren"],
  ["Overgevoelige rijhulpsystemen","Nerveuze rijstrookassistent","Spookremmen","Matige koplampen","Assistenten lastig uit te zetten"]),
 ("Uiterlijk",
  ["Mooi design","Sportief uiterlijk","Opvallend","Tijdloos","Mooie kleur","Mooie velgen","Stoer","Elegant"],
  ["Saai design","Kwetsbare lak"]),
]

# ---------- Interesses ('Waar hou je van?') ----------
INTERESTS = [
 ("Rijden en gebruik", ["Sportief rijden","Rustig cruisen","Lange afstanden","Woon-werkverkeer","Stad","Weekendritjes","Roadtrips",
   "Bergpassen rijden","Gezin & ruimte","Hond mee in de auto","Caravan & trekken","Aanhanger trekken","Kamperen met de auto",
   "Lease & zakelijk","Deelauto’s","Zuinig"]),
 ("Aandrijving en techniek", ["Elektrisch","Hybride","Plug-in hybride","Waterstof","Diesel","Benzine","LPG","CNG","Handgeschakeld",
   "Automaat","Vierwielaandrijving","Achterwielaandrijving","V8-motoren","Zescilinders","Turbomotoren","Laadpalen en laden",
   "Rijhulpsystemen","Autonoom rijden","Infotainment","Aerodynamica","Motortechniek"]),
 ("Soorten auto’s", ["Hatchbacks","Sedans","Stationwagens","SUV’s","Terreinwagens","Pick-ups","Coupés","Cabrio’s","Roadsters","MPV’s",
   "Busjes","Stadsautootjes","Sportwagens","Supercars","Hypercars","Muscle cars","Hot hatches","Luxe auto’s","Klassiekers","Oldtimers",
   "Youngtimers","Restomods","Amerikaanse auto’s","Japanse auto’s","Duitse auto’s","Italiaanse auto’s","Franse auto’s","Britse auto’s",
   "Zweedse auto’s","Koreaanse auto’s","Chinese auto’s","JDM"]),
 ("Hobby en sport", ["Tuning","Track days","Autosport","Formule 1","Rally","Driften","Karten","Dragracing","Endurance en Le Mans",
   "Autoshows","Autotreffens","Cars and coffee","Sleutelen","Restaureren","Detailing","Wrappen","Car audio","Modelauto’s",
   "Autofotografie","Simracing","Autogeschiedenis","Offroad & 4x4","Overlanding"]),
]
# Zoekwoorden die naar een kenmerk of interesse leiden (alias -> termen)
ALIASES = {
 "laag verbruik":["Zuinig"],"economisch":["Zuinig"],"verbruik":["Zuinig","Dorstig","Hoog verbruik op de snelweg"],
 "4x4":["Goede vierwielaandrijving","Offroad & 4x4","Vierwielaandrijving"],"awd":["Goede vierwielaandrijving","Vierwielaandrijving"],
 "acc":["Goede adaptieve cruisecontrol"],"hud":["Head-up display"],"lawaai":["Luid","Veel windgeruis","Veel bandengeruis"],
 "herrie":["Luid"],"bagage":["Grote kofferbak","Kleine kofferbak"],"kofferruimte":["Grote kofferbak","Kleine kofferbak"],
 "actieradius":["Veel bereik","Weinig bereik"],"range":["Veel bereik","Weinig bereik"],"snelladen":["Snel laden","Traag laden"],
 "ev":["Elektrisch","Stil elektrisch rijden"],"phev":["Plug-in hybride"],"f1":["Formule 1"],"gti":["Hot hatches"],
 "oldtimer":["Oldtimers"],"camper":["Kamperen met de auto"],"aanhangwagen":["Aanhanger trekken"],"caravan":["Caravan & trekken"],
 "geluid":["Fijn motorgeluid","Mooi uitlaatgeluid","Goed geluidssysteem","Luid"],"versnellingsbak":["Fijne handbak","Vage versnellingsbak"],
 "dsg":["Snel schakelende automaat","Schokkerige automaat"],"cvt":["Brult bij optrekken","Soepele automaat"],
 "led":["Matrix-ledverlichting","Goede koplampen"],"camera":["Goede achteruitrijcamera","360-gradencamera"],
 "stoelen":["Goede stoelen","Krappe stoelen","Harde stoelen"],"kinderzitje":["Handige isofix"],"trekken":["Sterk trekvermogen","Caravan & trekken","Aanhanger trekken"],
}

# ---------- Woordfilter ----------
# Basis: LDNOOBW (CC BY 4.0), alleen de woorden die in een auto-app ondubbelzinnig scheldwoord of grof zijn.
# Niet overgenomen omdat ze gewone autowoorden zijn of vaak onschuldig: remsporen, asbak, toeter, beurt, matje, standje,
# spuiten, pijpen, pot, paal, gat, bekken, poot, zuigen, stootje, naakt, schatje, griet, muts, nicht, pik, balen, reutelen.
# Aangevuld met Nederlandse ziektes als scheldwoord, varianten, beledigingen en bedreigingen.
# Modus: w = heel woord, p = begin van een woord, s = eind van een woord, c = ergens in een woord,
#        e = uitzonderingen (woorden die met deze letters beginnen zijn nooit fout), x = zinsdelen (regex).
# Een '!' achter een term = alleen exact, niet na het samenvoegen van dubbele letters (anders botst 'nigger' met 'Niger').
WF = {
 "c": ["kanker","kenker","kankah","tyfus","tiefus","tyfes","tiefes","cholera","kolere","neuk","fuck","godverdom","sodemieter",
       "klootzak","kloothommel","klootviool","cunt","motherf","asshole","teringlijer","kankerlijer"],
 "p": ["tering","kut","klote","kloten","klere","pokke!","pleuris","lul","slet","hoeren","shit","bitch","whore","retard","debiel",
       "mongool","godver","schijt","stront","faggot!","wanker","bastard","hufter","zakkenwasser","reetridder","rukhond","matennaaier",
       "droogkloot","befborstel","beffen","flamoes","geilneef","greppeldel","temeier","nikker","spleetoog"],
 "s": ["lijer","lul","kut","hoer","teef","wijf","neger!"],
 "w": ["hoer","kanka","eikel","eikels","snol","teef","wijf","wijven","klojo","drol","neger!","negers!","nigger!","niggers!",
       "nigga!","niggas!","flikker","flikkers","tbc","aids","slut","sluts","fag!","twat","kkr!"],
 "e": ["kleren","klerenkast","kutter","lullaby","lullig","shitake","shiitake"],
 "x": [r"\bkrijg (de|het|een|n|t)? ?(pest|pleuris|kolere|klere|tering|tyfus|kanker|cholera|pokken|tbc|aids|takke)\b",
       r"\b(ga|val) (toch )?dood\b", r"\bhoop dat je (doodgaat|sterft|dood gaat)\b", r"\bik maak je af\b", r"\bkk ?(auto|bak|ding|zooi)\b"],
}
# Een paar woorden zijn in Nederland ook gewoon een naam of plaats (Dick, Niger); die staan er daarom niet of alleen exact in.

def norm_term(t):
    return t.lower()

data = {"c":WF["c"],"p":WF["p"],"s":WF["s"],"w":WF["w"],"e":WF["e"],"x":WF["x"]}
enc = base64.b64encode(json.dumps(data, ensure_ascii=True).encode()).decode()

tag_groups = [{"g":g,"pos":p,"neg":n} for g,p,n in TAGS]
int_groups = [{"g":g,"t":t} for g,t in INTERESTS]
all_tags = [t for g,p,n in TAGS for t in p+n]
assert len(all_tags)==len(set(all_tags)), [t for t in all_tags if all_tags.count(t)>1]
all_int = [t for g,t in INTERESTS for t in t]
assert len(all_int)==len(set(all_int)), [t for t in all_int if all_int.count(t)>1]
for a,ts in ALIASES.items():
    for t in ts: assert t in all_tags or t in all_int, (a,t)
print("kenmerken:",len(all_tags),"(positief",sum(len(p) for g,p,n in TAGS),", negatief",sum(len(n) for g,p,n in TAGS),")  interesses:",len(all_int),"+ merken")

js = "/* ===== Woordenlijsten (gegenereerd door gen8.py): kenmerken, interesses, zoekwoorden ===== */\n"
js += "const TAG_GROUPS=" + json.dumps(tag_groups, ensure_ascii=False) + ";\n"
js += "const INTEREST_GROUPS=" + json.dumps(int_groups, ensure_ascii=False) + ";\n"
js += "const VOCAB_ALIASES=" + json.dumps(ALIASES, ensure_ascii=False) + ";\n"
js += "/* Woordfilter: basis LDNOOBW (CC BY 4.0), opgeschoond en aangevuld; gecodeerd zodat de lijst niet leesbaar in de pagina staat. */\n"
js += "const WF_RULES=JSON.parse(atob('" + enc + "'));\n"
open(os.path.join(ROOT,'web','vocab.js'),'w').write(js)

# ---------- backend ----------
A = ROOT
def lit(s): return "'" + s.replace("'","''") + "'"
sql = "-- Woordenlijsten voor Proefrit (gegenereerd door gen8.py). Kenmerken, interesses en het woordfilter.\n"
sql += "-- Woordfilter op basis van LDNOOBW (CC BY 4.0), opgeschoond voor een auto-app en aangevuld.\nbegin;\n"
sql += "delete from public.vocab;\ninsert into public.vocab (term, kind, grp, neg) values\n"
rows = []
for g,p,n in TAGS:
    rows += [f"({lit(t)},'tag',{lit(g)},false)" for t in p] + [f"({lit(t)},'tag',{lit(g)},true)" for t in n]
for g,t in INTERESTS:
    rows += [f"({lit(x)},'interest',{lit(g)},false)" for x in t]
sql += ",\n".join(rows) + ";\n"
sql += "-- Merken mogen ook als interesse.\ninsert into public.vocab (term, kind, grp, neg) select distinct brand, 'interest', 'Merken', false from public.cars where source = 'catalogus' on conflict do nothing;\n"
sql += "delete from public.banned_terms;\ninsert into public.banned_terms (term, mode, exact) values\n"
brow = []
for mode in "cpswe":
    for t in WF[mode]:
        ex = t.endswith('!'); t2 = t.rstrip('!')
        brow.append(f"({lit(t2)},'{mode}',{'true' if ex else 'false'})")
for t in WF["x"]:
    brow.append(f"({lit(t)},'x',false)")
sql += ",\n".join(brow) + "\non conflict do nothing;\ncommit;\n"
open(os.path.join(A,'supabase','seed','vocab.sql'),'w').write(sql)

ts = "// Woordfilter en woordenlijsten voor de serverfuncties (gegenereerd door gen8.py; zelfde regels als de app).\n"
ts += "// Basis: LDNOOBW (CC BY 4.0), opgeschoond en aangevuld. Gecodeerd zodat de lijst niet leesbaar in de code staat.\n"
ts += "const RULES: Record<string, string[]> = JSON.parse(atob(\"" + enc + "\"));\n"
ts += "export const TAGS = new Set<string>(" + json.dumps(all_tags, ensure_ascii=False) + ");\n"
ts += open(os.path.join(S,'wf_core.ts')).read()
open(os.path.join(A,'supabase','functions','_shared','wordfilter.ts'),'w').write(ts)
print("ok")
