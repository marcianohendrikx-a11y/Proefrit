/* ===== Gasversies af fabriek (LPG / CNG), toegevoegd aan bestaande modellen ===== */
const GAS={
 'Dacia|Duster':'1.0 TCe 100 ECO-G (LPG)~G','Dacia|Jogger':'1.0 TCe 100 ECO-G (LPG)~G',
 'Renault|Clio':'1.0 TCe 100 LPG~G','Renault|Captur':'1.0 TCe 100 LPG~G',
 'Fiat|Panda':'0.9 TwinAir Natural Power (CNG)~N','Fiat|Punto':'1.4 Natural Power (CNG)~N',
 'Opel|Astra':'1.4 LPG ecoFLEX~G','Opel|Zafira':'1.6 CNG ecoFLEX Turbo~N','Opel|Mokka':'1.4 Turbo LPG~G',
 'Volkswagen|Up!':'1.0 eco up! (CNG)~N','Volkswagen|Polo':'1.0 TGI 90 pk (CNG)~N','Volkswagen|Golf':'1.5 TGI 130 pk (CNG)~N',
 'Volkswagen|Caddy':'1.4 TGI (CNG)~N','Volkswagen|Touran':'1.4 TSI EcoFuel (CNG)~N','Volkswagen|Passat':'1.4 TSI EcoFuel (CNG)~N',
 'Seat|Ibiza':'1.0 TGI 90 pk (CNG)~N','Seat|Leon':'1.5 TGI 130 pk (CNG)~N','Seat|Arona':'1.0 TGI 90 pk (CNG)~N','Seat|Mii':'1.0 Ecofuel 68 pk (CNG)~N',
 'Škoda|Citigo':'1.0 G-TEC (CNG)~N','Škoda|Octavia':'1.5 G-TEC 130 pk (CNG)~N','Škoda|Scala':'1.0 G-TEC 90 pk (CNG)~N','Škoda|Kamiq':'1.0 G-TEC 90 pk (CNG)~N',
 'Audi|A3':'30 g-tron 131 pk (CNG)~N','Audi|A4':'40 g-tron 170 pk (CNG)~N','Audi|A5':'40 g-tron 170 pk (CNG)~N',
 'Mercedes-Benz|B-Klasse':'B 200 Natural Gas Drive (CNG)~N','Mercedes-Benz|E-Klasse':'E 200 NGT (CNG)~N'
};

/* ===== Merkplaatjes: eigen ontwerp per merk (landcode zoals op een kenteken + symbool). Geen echte logo's. ===== */
const BRANDMETA={
 'Abarth':['I','Ab'],'Aiways':['CN','Ai'],'Alfa Romeo':['I','AR'],'Alpina':['D','Ap'],'Alpine':['F','Al'],'Aston Martin':['UK','AM'],
 'Audi':['D','Au'],'BMW':['D','BMW'],'BYD':['CN','BYD'],'Bentley':['UK','Be'],'Bugatti':['F','Bu'],'Cadillac':['USA','Ca'],
 'Chevrolet':['USA','Ch'],'Chrysler':['USA','Cr'],'Citroën':['F','Ci'],'Cupra':['E','Cu'],'DS':['F','DS'],'Dacia':['RO','Da'],
 'Daihatsu':['J','Dh'],'Dodge':['USA','Do'],'Ferrari':['I','Fe'],'Fiat':['I','Fi'],'Fisker':['USA','Fk'],'Ford':['USA','Fo'],
 'GMC':['USA','GMC'],'Genesis':['ROK','Gn'],'Honda':['J','Ho'],'Hyundai':['ROK','Hy'],'INEOS':['UK','In'],'Infiniti':['J','If'],
 'Isuzu':['J','Is'],'Jaguar':['UK','Ja'],'Jeep':['USA','Je'],'Kia':['ROK','Ki'],'Lada':['RUS','Ld'],'Lamborghini':['I','La'],
 'Lancia':['I','Ln'],'Land Rover':['UK','LR'],'Leapmotor':['CN','Lp'],'Lexus':['J','Lx'],'Lincoln':['USA','Li'],'Lotus':['UK','Lo'],
 'Lucid':['USA','Lu'],'Lynk & Co':['CN','LC'],'MG':['CN','MG'],'Maserati':['I','Ms'],'Mazda':['J','Mz'],'McLaren':['UK','Mc'],
 'Mercedes-Benz':['D','MB'],'Mini':['UK','Mn'],'Mitsubishi':['J','Mt'],'NIO':['CN','NIO'],'Nissan':['J','Ni'],'ORA':['CN','ORA'],
 'Opel':['D','Op'],'Peugeot':['F','Pe'],'Polestar':['S','Ps'],'Porsche':['D','Po'],'Ram':['USA','Ra'],'Renault':['F','Re'],
 'Rivian':['USA','Ri'],'Rolls-Royce':['UK','RR'],'Saab':['S','Sa'],'Seat':['E','Se'],'Smart':['D','Sm'],'SsangYong':['ROK','Sy'],
 'Subaru':['J','Su'],'Suzuki':['J','Sz'],'Tesla':['USA','Te'],'Toyota':['J','To'],'VinFast':['VN','Vf'],'Volkswagen':['D','VW'],
 'Volvo':['S','Vo'],'Xpeng':['CN','Xp'],'Zeekr':['CN','Ze'],'Škoda':['CZ','Šk'],
 'DAF':['NL','DAF'],'Spyker':['NL','Sp'],'Donkervoort':['NL','Dk'],'Lightyear':['NL','Ly'],'Trabant':['DDR','Tb'],'Wartburg':['DDR','Wb'],
 'Simca':['F','Si'],'Talbot':['F','Tl'],'Matra':['F','Ma'],'Austin':['UK','As'],'Austin-Healey':['UK','AH'],'Morris':['UK','Mo'],'Triumph':['UK','Tr'],
 'Rover':['UK','Ro'],'Hillman':['UK','Hi'],'Sunbeam':['UK','Sb'],'Jensen':['UK','Jn'],'AC':['UK','AC'],'Morgan':['UK','Mr'],'Caterham':['UK','Ct'],'TVR':['UK','TVR'],
 'Daewoo':['ROK','Dw'],'Datsun':['J','Dt'],'NSU':['D','NSU'],'Borgward':['D','Bw'],'Messerschmitt':['D','Mm'],'Autobianchi':['I','AB'],'De Tomaso':['I','DT'],
 'DeLorean':['USA','DMC'],'Maybach':['D','My'],'Moskvitsj':['RUS','Mk'],'FSO':['PL','FSO'],'Zastava':['YU','Za'],'Proton':['MAL','Pr'],'Tata':['IND','Tt'],
 'Mahindra':['IND','Mh'],'Great Wall':['CN','GW'],'Omoda':['CN','Om'],'Jaecoo':['CN','Jc'],'Aixam':['F','Ax'],'Ligier':['F','Lg'],'Microcar':['F','Mi'],
 'Acura':['J','Ac'],'Buick':['USA','Bk'],'Eagle':['USA','Ea'],'Geo':['USA','Ge'],'Mercury':['USA','Me'],'Oldsmobile':['USA','Ol'],'Panoz':['USA','Pz'],
 'Plymouth':['USA','Pl'],'Pontiac':['USA','Pt'],'Saturn':['USA','St'],'Scion':['J','Sc']
};
const COUNTRY={D:'Duitsland',F:'Frankrijk',I:'Italië',UK:'Verenigd Koninkrijk',USA:'Verenigde Staten',J:'Japan',ROK:'Zuid-Korea',CN:'China',S:'Zweden',E:'Spanje',CZ:'Tsjechië',RO:'Roemenië',RUS:'Rusland',VN:'Vietnam',NL:'Nederland',DDR:'Oost-Duitsland',PL:'Polen',YU:'Joegoslavië',MAL:'Maleisië',IND:'India'};
const EMB_COLORS=['#0b3f93','#9c2a2a','#1f6b4f','#5b3d8f','#b3561a','#24566e','#7a2e5a','#3b4a5c','#86680e','#2e5e2a','#6b2f1e','#1d5a9c'];
/* Plek voor echte logo's: vul per merk een afbeelding in zodra er toestemming of een licentie is (bijv. 'BMW':'logos/bmw.svg').
   Leeg = het eigen merkplaatje hieronder. */
const LOGOS={};
function emblem(brand,size){
  if(LOGOS[brand])return `<span class="emb logo${size?' '+size:''}" aria-hidden="true"><img src="${LOGOS[brand]}" alt=""></span>`;
  const m=BRANDMETA[brand]||['',String(brand).slice(0,2)],i=Object.keys(BRANDMETA).indexOf(brand);
  const col=EMB_COLORS[(i<0?0:i)%EMB_COLORS.length];
  return `<span class="emb${size?' '+size:''}${m[1].length>2?' e3':''}" style="--ec:${col}" aria-hidden="true"><i>${m[0]}</i><b>${m[1]}</b></span>`;
}

/* ===== Carrosserie per model (H = hatchback als niets anders is opgegeven) ===== */
const BODYMAP={
'Abarth':'R:124 Spider','Aiways':'U:U5,U6',
'Alfa Romeo':'S:Giulia,159,Giulia Quadrifoglio;U:Stelvio,Tonale,Junior,Stelvio Quadrifoglio;C:Brera,4C',
'Alpina':'S:B3,B5,B7,D3,D5;C:B4;U:XB7','Alpine':'C:A110',
'Aston Martin':'C:Vantage,DB9,DB11,DBS,Vanquish;U:DBX;S:Rapide',
'Audi':'S:A4,A6,A7,A8,S4,S6,RS 7,e-tron GT;C:A5,S5,RS 5,TT,TT RS,R8;U:Q2,Q3,Q4 e-tron,Q5,Q6 e-tron,Q7,Q8,e-tron,SQ5,SQ7,SQ8,RS Q3,RS Q8;W:RS 6 Avant,RS 4 Avant,RS 6 Avant (C6)',
'BMW':'S:3-serie,5-serie,7-serie,i4,i5,i7,M3,M5,M340i,M550i,i4 M50;C:2-serie,4-serie,6-serie,8-serie,M2,M4,M6,M8,1M Coupé,M240i,M440i;U:X1,X2,X3,X4,X5,X6,X7,XM,iX,iX3,X3 M,X4 M,X5 M,X6 M;R:Z4,Z4 M',
'BYD':'U:Atto 3,Atto 2,Seal U DM-i,Sealion 7;S:Seal,Han','Bentley':'C:Continental GT;U:Bentayga;S:Flying Spur','Bugatti':'C:Veyron,Chiron',
'Cadillac':'U:Escalade,XT5,Lyriq;S:CTS,ATS,CTS-V,ATS-V,CT5-V',
'Chevrolet':'S:Cruze;U:Captiva,Tahoe,Suburban,Equinox,Blazer;C:Camaro,Corvette;P:Silverado 1500,Colorado,Silverado 2500HD',
'Chrysler':'S:300C,Sebring;M:Voyager,Pacifica',
'Citroën':'U:C3 Aircross,C5 Aircross;M:C3 Picasso,C8,Berlingo,Grand C4 Picasso;S:C5;W:C5 X;K:C-Zero,Ami',
'Cupra':'U:Formentor,Ateca,Tavascan,Terramar','DS':'U:DS 7;S:DS 9',
'Dacia':'U:Duster,Bigster;S:Logan;W:Jogger;M:Lodgy,Dokker','Daihatsu':'K:Cuore;U:Terios',
'Dodge':'C:Challenger,Viper;S:Charger;U:Durango,Journey,Nitro;P:Ram 1500,Ram 2500 (2006-2010)',
'Ferrari':'C:F430,599 GTB,458 Italia,FF,488 GTB,812,F8 Tributo,Roma,SF90 Stradale,296 GTB,12Cilindri,LaFerrari;R:California,Portofino;U:Purosangue',
'Fiat':'U:500X,600,Sedici,Freemont;M:500L,Doblò,Qubo;R:124 Spider','Fisker':'U:Ocean',
'Ford':'S:Mondeo;M:B-Max,C-Max,S-Max,Galaxy;U:Kuga,Puma,EcoSport,Edge,Explorer,Mustang Mach-E,Capri;C:Mustang,Mustang Shelby GT350,Mustang Mach 1,GT;P:F-150,Ranger,F-250,F-350;X:Bronco',
'GMC':'P:Sierra,Hummer EV,Sierra 2500HD;U:Yukon;X:Hummer H2,Hummer H3',
'Genesis':'S:G70,G80,G90;U:GV60,GV70,GV80',
'Honda':'U:CR-V,HR-V,ZR-V,e:Ny1;S:Accord;C:CR-Z,NSX,Prelude;M:FR-V;R:S2000',
'Hyundai':'S:i40,Ioniq 6;M:ix20,Matrix;U:ix35,Bayon,Kona,Tucson,Santa Fe,Ioniq 5,Ioniq 9,Kona N,Nexo;C:Veloster,Genesis Coupe,Veloster N;V:Staria',
'INEOS':'X:Grenadier','Infiniti':'S:Q50;U:QX70','Isuzu':'P:D-Max',
'Jaguar':'S:XE,XF,XJ,XFR,XJR;C:XK,F-Type;U:F-Pace,E-Pace,I-Pace',
'Jeep':'X:Wrangler,Commander;U:Grand Cherokee,Renegade,Compass,Cherokee,Avenger,Patriot,Grand Cherokee SRT;P:Gladiator',
'Kia':'W:ProCeed;U:XCeed,Stonic,Niro,Sportage,Sorento,Soul,EV3,EV6,EV9;S:Stinger,Optima;M:Carens,Venga,Carnival',
'Lada':'X:Niva','Lamborghini':'C:Gallardo,Murciélago,Aventador,Huracán,Revuelto,Temerario;U:Urus',
'Land Rover':'X:Defender,Defender (oud),Discovery;U:Discovery Sport,Freelander,Range Rover,Range Rover Sport,Range Rover Evoque,Range Rover Velar',
'Leapmotor':'U:C10','Lexus':'S:IS,ES,GS,LS,IS F,GS F;U:NX,RX,UX,LBX,RZ,LX;C:RC,LC,LFA,RC F;X:GX',
'Lincoln':'U:Navigator,Aviator','Lotus':'R:Elise;C:Exige,Evora,Emira;U:Eletre','Lucid':'S:Air','Lynk & Co':'U:01,02',
'MG':'U:ZS,HS,Marvel R;W:MG5;R:Cyberster',
'Maserati':'S:Quattroporte,Ghibli;U:Levante,Grecale;C:GranTurismo,MC20;R:GranCabrio',
'Mazda':'M:Mazda5;S:Mazda6;U:CX-3,CX-30,CX-5,CX-60,CX-7,CX-90,MX-30;R:MX-5;C:RX-8',
'McLaren':'C:MP4-12C,570S,720S,GT,Artura',
'Mercedes-Benz':'M:B-Klasse,R-Klasse;S:C-Klasse,E-Klasse,S-Klasse,CLA,CLS,EQE,EQS,CLA 45 AMG,C 63 AMG,E 63 AMG,CLS 63 AMG,S 63 AMG,AMG GT 4-Door;C:CLK,AMG GT,SLS AMG,CLK 63 AMG,SLR McLaren,AMG ONE;U:GLA,GLB,GLC,GLE,GLK,GLS,M-Klasse,EQA,EQB,EQC,GLA 45 AMG,GLE 63 AMG,GLC 63 AMG,GLS 63 AMG;X:G-Klasse,G 63 AMG;R:SLK,SL,SL 63 AMG;V:V-Klasse',
'Mini':'W:Clubman;U:Countryman,Paceman,Aceman;R:Cabrio',
'Mitsubishi':'U:ASX,Outlander,Eclipse Cross;S:Lancer,Lancer Evolution;P:L200;X:Pajero;K:i-MiEV',
'NIO':'S:ET5,ET7;U:EL7',
'Nissan':'U:Juke,Qashqai,X-Trail,Murano,Pathfinder,Ariya;X:Patrol;P:Navara;C:350Z,370Z,Z,GT-R',
'Opel':'S:Insignia,Insignia OPC;U:Mokka,Crossland,Grandland,Frontera,Antara;M:Zafira,Meriva,Combo;R:Cascada;K:Rocks Electric',
'Peugeot':'U:2008,3008,5008;S:407,408,508;C:RCZ;M:Partner,Rifter;V:Traveller;K:iOn',
'Polestar':'C:1;S:2;U:3,4',
'Porsche':'C:911,718 Cayman,911 GT3,911 Turbo,718 Cayman GT4;R:718 Boxster,918 Spyder;U:Cayenne,Macan;S:Panamera,Taycan',
'Ram':'P:1500,2500,3500',
'Renault':'U:Captur,Megane E-Tech,Kadjar,Arkana,Austral,Rafale,Symbioz,Koleos,Renault 4 E-Tech;M:Scenic,Kangoo,Espace,Modus;S:Talisman,Laguna,Fluence;R:Wind;K:Twizy',
'Rivian':'P:R1T;U:R1S','Rolls-Royce':'S:Phantom,Ghost;R:Dawn;C:Wraith,Spectre;U:Cullinan','Saab':'S:9-3,9-5',
'Seat':'U:Arona,Ateca,Tarraco;M:Altea,Alhambra;S:Toledo,Exeo','Smart':'K:Fortwo;U:#1,#3',
'SsangYong':'U:Tivoli,Korando,Torres,Rexton,Kyron;P:Musso',
'Subaru':'S:WRX,Legacy,WRX STI;U:Forester,XV,Crosstrek,Solterra;W:Outback,Levorg;C:BRZ',
'Suzuki':'U:Vitara,S-Cross,Grand Vitara,Across,e Vitara;X:Jimny;S:Kizashi;W:Swace',
'Tesla':'R:Roadster;S:Model S,Model 3;U:Model X,Model Y;P:Cybertruck',
'Toyota':'K:iQ;U:Yaris Cross,Urban Cruiser,C-HR,RAV4,Highlander,bZ4X,Sequoia;S:Avensis,Camry,Mirai;M:Verso,Prius+,Proace City;X:Land Cruiser,4Runner,Land Cruiser Prado;P:Hilux,Tundra,Tacoma;C:GT86,GR86,Supra',
'VinFast':'U:VF 3,VF 8,VF 9',
'Volkswagen':'S:Jetta,CC,Arteon,Phaeton,ID.7,Arteon R;C:Scirocco,Beetle,Scirocco R;R:Eos;W:Passat,Passat R36;U:Taigo,T-Cross,T-Roc,Tiguan,Touareg,ID.4,ID.5,Tiguan R;M:Touran,Sharan,Caddy;P:Amarok;V:ID. Buzz',
'Volvo':'U:C40,XC40,XC60,XC90,EX30,EX90;R:C70;S:S40,S60,S80,S90,ES90;W:V50,V60,V70,XC70,V90',
'Xpeng':'U:G6,G9','Zeekr':'W:001;U:X,7X',
'Škoda':'S:Octavia,Superb,Rapid,Octavia RS;U:Kamiq,Karoq,Kodiaq,Yeti,Enyaq,Elroq,Kodiaq RS;M:Roomster'
};
const BODY_OF={};
Object.keys(BODYMAP).forEach(b=>BODYMAP[b].split(';').filter(Boolean).forEach(g=>{const k=g.indexOf(':'),code=g.slice(0,k),list=g.slice(k+1);list.split(',').forEach(m=>BODY_OF[b+'|'+m]=code)}));
const bodyOf=c=>BODY_OF[c.id]||c.body||'H';
const BODY_NAME={H:'Hatchback',S:'Sedan',W:'Stationwagen',U:'SUV',X:'Terreinwagen',C:'Coupé',R:'Cabrio of roadster',M:'MPV',P:'Pick-up',V:'Bus',K:'Stadsautootje'};

/* Algemene zijaanzichten per carrosserietype (geen specifiek model), op schaal van echte auto's (ongeveer 44 px per meter,
   grond op y = 96). u = bovenlijn van voor-onder tot achter-onder, g = ramen, w = wielposities, r = wielstraal,
   cy = wielhart, bot = onderkant dorpel, f = koplamp, t = achterlicht, belt = onderkant ramen. */
const CARDEF={
 H:{u:'M29 87.5C26 86 25 80 25.5 75C26 70 26 66 28 64.5C31 62.5 40 61.5 52 60.5C66 59 79 56.5 88 53.8C98 45 107 37 118 33.6C134 30.8 165 30.5 183 32.2C191 33 196 35.5 199.5 39.5L207 51C210 55 212.5 59 213 64L213.5 82C213.5 85.5 212 87.5 209 87.5',
    g:'M93 53.3C101 46 108 40 118.5 36.8L140 36L140 53.3ZM145 36L182 35.5C188 35.9 192 38 195 41.5L200.5 52.8L145 53.3Z',
    w:[65,181],r:14.3,cy:81.7,bot:87.5,f:[36.5,63.5],t:[208,56],belt:53.3,doors:[87,142.5,170],grips:[128,160],mir:[92,53],xf:25,xr:213.5},
 S:{u:'M18.5 87.5C15.5 86 14.5 80 15 75C15.5 70 15.5 66 17.5 64.5C20.5 62.5 30 61.5 42 60.6C58 59.2 72 57 82 54.5C93 45.5 103 37.5 115 34.2C131 31.4 152 31.3 165 33C176 34.6 185 41 193 50.5C201 51.2 212 52 219 53.2C222.5 54 224 57 224.3 62L224.5 82C224.5 85.5 223 87.5 220 87.5',
    g:'M87 54C96 46.5 104 40.5 115.5 37.3L140 36.6L140 54ZM145 36.6L163 36.2C171 37 179 42 186 50L188 54L145 54Z',
    w:[56,180],r:15,cy:81,bot:87.5,f:[25.5,63.5],t:[219,57],belt:54,doors:[84,142.5,170],grips:[128,158],mir:[86,53.5],xf:15,xr:224.5},
 W:{u:'M15 87.5C12 86 11 80 11.5 75C12 70 12 66 14 64.5C17 62.5 27 61.5 39 60.6C55 59.2 70 57 80 54.5C91 45 101 36.5 113 32.8C135 29.5 180 29.2 206 30.2C213 30.6 217 33 219.5 38L224.5 52C226.5 56 228 59 228.3 63L228.5 82C228.5 85.5 227 87.5 224 87.5',
    g:'M85 54C94 46 102 39.5 113.5 35.8L138 35.2L138 54ZM143 35.2L174 34.8L174 54L143 54ZM179 34.8L205 34.4C210 34.5 213 36.3 214.5 39.5L219 53L179 54Z',
    w:[54,179],r:15,cy:81,bot:87.5,f:[22.5,63.5],t:[223,56],belt:54,doors:[82,140.5,176],grips:[126,163],mir:[84,53.5],xf:11.5,xr:228.5},
 U:{u:'M23 85.5C20 84 19 78 19.5 72C20 66 20 60 22.5 57.5C26 55.5 36 54.5 48 53.6C62 52.4 74 50.5 84 47.8C95 38 104 29.5 116 25.2C134 22 166 21.6 190 22.8C198 23.2 203 25.5 206 30L212 44C214.5 49 219.5 52 219.8 58L220 80C220 83.5 218.5 85.5 215.5 85.5',
    g:'M89 47.5C98 39 106 31.8 116.5 28.3L141 27.6L141 47.5ZM146 27.6L187 26.8C193 26.9 197 28.8 199.5 32.5L205 46.5L146 47.5Z',
    w:[60.5,178.5],r:15.8,cy:80.2,bot:85.5,f:[30.5,57.5],t:[214,50],belt:47.5,doors:[86,143.5,173],grips:[130,161],mir:[88,47],xf:19.5,xr:220,clad:1},
 X:{u:'M15 84.5C12 83 11 76 11.5 68C12 60 12.5 54 15 51.5C18 49.6 26 49 38 48.4L72 46.5C78 37 84 26 89 19.5C91 17 94 16 99 15.8L216 15.8C221 15.8 223 18 223.5 22L227.5 60C228.2 66 228.5 72 228.5 80C228.5 83 227 84.5 224 84.5',
    g:'M77 45C82 37 86.5 28 90.5 22.5C92 20.3 94 19.6 97.5 19.6L127 19.6L127 45ZM132 19.6L170 19.6L170 45L132 45ZM175 19.6L214 19.6C217.5 19.6 218.8 21.2 219 24L221 45L175 45Z',
    w:[52,175],r:17.4,cy:78.6,bot:84.5,f:[21.5,53],t:[224,50],belt:45,doors:[80,129.5,172],grips:[116,158],mir:[78,44.5],xf:11.5,xr:228.5,clad:1},
 C:{u:'M18 87.5C15 86 14 80 14.5 75.5C15 71 15 67.5 17 66C20 64 30 63 42 62.2C60 60.8 76 58.6 88 55.8C100 46 112 39 126 36.2C140 33.8 156 34 167 36.5C180 39.5 194 47 205 52.5C212 53.6 219 54.6 222.5 56.5C224.5 58 225 61 225 65L225 82C225 85.5 223.5 87.5 220.5 87.5',
    g:'M94 55.3C104 47.3 114 41.5 126.5 39.2L150 38.8L150 55.3ZM155 38.8L163 39.4C172 41.4 181 46 190 52.5L191.5 55.3L155 55.3Z',
    w:[52,177],r:15,cy:81,bot:87.5,f:[24.5,65.5],t:[220,58.5],belt:55.3,doors:[88,152],grips:[139],mir:[93,55],xf:14.5,xr:225},
 R:{u:'M37 88C34 86.5 33 81 33.5 76.5C34 72 34.5 68.5 37 67C40 65.2 49 64.4 60 63.6C76 62.4 88 61 98 59.2L104 59L186 58.5C196 58.6 202 60 204.5 62.5C205.8 64 206 67 206 71L206 83C206 86.5 204.5 88 201.5 88',
    extra:'M148 59C148 51 151.5 48.5 156 48.5C160.5 48.5 163 51 163 59Z',
    g:'M98 59.2L112 45.8L116.5 46.4L104 59Z',
    w:[67,169],r:14,cy:82,bot:88,f:[44.5,65.5],t:[201,62],belt:59,doors:[101,148],grips:[134],mir:[104,58.5],xf:33.5,xr:206},
 M:{u:'M23.5 87C20.5 85.5 19.5 79 20 74C20.5 69 20.5 65 22.5 63C25.5 61 35 60 46 59C56 58 64 56 72 52.5C84 41 96 30 108 25.2C112 23.8 116 23.2 122 23.1L202 23.5C208 23.6 211.5 26 213 31L217 52C218.8 56 219.4 60 219.5 65L219.5 81.5C219.5 85 218 87 215 87',
    g:'M77 51C87 41.5 97 33 108.5 28.2C111.5 27 115 26.6 119 26.6L134 26.6L134 51ZM139 26.6L174 26.6L174 51L139 51ZM179 26.6L201 26.8C205.5 26.9 207.8 28.8 208.8 32L212.5 50.5L179 51Z',
    w:[60.5,183.5],r:14.8,cy:81.2,bot:87,f:[29.5,61.5],t:[214.5,55],belt:51,doors:[80,136.5,176],grips:[122,163],mir:[79,50.5],xf:20,xr:219.5},
 P:{u:'M11 85C8 83.5 7 76 7.5 68C8 60 8.5 54 11 51.2C14 49.2 22 48.6 34 48L66 46.2C73 37 80 28 86 23C88 21.4 91 20.6 96 20.5L140 20.5C144 20.5 146 22.5 146.6 26.5L148 45.5L229 45.5C231 45.5 232 46.5 232 48.5L232 82C232 84 231 85 229 85',
    g:'M71 45C77.5 37.5 83.5 30.5 88.5 26.2C90.2 24.8 92.5 24.2 95.5 24.2L115 24.2L115 45ZM120 24.2L139 24.2C141.5 24.2 142.5 25.6 142.8 28.2L143.8 45L120 45Z',
    w:[47,177],r:16.4,cy:79.6,bot:85,f:[15.5,53],t:[229,51],belt:45,doors:[74,117.5,148],grips:[104,135],mir:[72,44.5],xf:7.5,xr:232,clad:1},
 V:{u:'M19.5 86C16.5 84.5 15.5 76 16 68C16.5 60 17.5 53 20.5 49C24 45 30 42.5 37 40.5C42 32 47 22 52 15.5C54.5 12.5 58 11.2 64 11.1L214 11.1C219.5 11.1 222 13.5 222.4 18L223.3 66C223.5 72 223.5 77 223.5 82C223.5 84.5 222 86 219 86',
    g:'M40 40.5C45 32.5 49.5 24 54 18.6C55.6 16.6 58 15.3 62 15.2L92 15.2L92 40.5ZM97 15.2L150 15.2L150 40.5L97 40.5ZM155 15.2L214 15.2C216.4 15.2 217.4 16.6 217.6 19L218.2 40.5L155 40.5Z',
    w:[52.5,184],r:15.5,cy:80.5,bot:86,f:[25.5,50.5],t:[221,54],belt:40.5,doors:[70,152],grips:[139],mir:[42,40.5],xf:16,xr:223.5},
 K:{u:'M44 88.5C41 87 40 81 40.5 76C41 71 41.5 67 44 65C47 63 54 62 62 60.8C70 59.6 76 57.6 82 54.6C91 44 99 36 109 32.4C114 30.8 120 30.4 128 30.4L170 30.8C178 31.2 183 33.5 186 38.5L195 55C197.5 59 198.8 63 199 68L199 83.5C199 87 197.5 88.5 194.5 88.5',
    g:'M87 54C95 44.5 101.5 38 109.5 35C113.5 33.8 118 33.6 123 33.6L140 33.6L140 54ZM145 33.6L168 33.9C174.5 34.2 178 36.2 180.5 40.5L187 53.5L145 54Z',
    w:[67.5,174],r:13,cy:83,bot:88.5,f:[51.5,63.5],t:[194.5,58.5],belt:54,doors:[85,142.5],grips:[129],mir:[86,53.5],xf:40.5,xr:199}
};
/* Wieluitsparing: boog boven het wiel tot aan de dorpel */
const archOf=(s,wx,extra)=>{const R=s.r+3+(extra||0),dy=s.bot-s.cy,dx=Math.sqrt(Math.max(0,R*R-dy*dy));return {R,dx,x1:wx+dx,x2:wx-dx}};
const SHAPES={};
Object.entries(CARDEF).forEach(([k,s])=>{
  const [wf,wr]=s.w,af=archOf(s,wf),ar=archOf(s,wr);
  const d=`${s.u}L${ar.x1.toFixed(2)} ${s.bot}A${ar.R} ${ar.R} 0 1 0 ${ar.x2.toFixed(2)} ${s.bot}L${af.x1.toFixed(2)} ${s.bot}A${af.R} ${af.R} 0 1 0 ${af.x2.toFixed(2)} ${s.bot}Z${s.extra||''}`;
  SHAPES[k]={...s,d};
});
const SHAPEX=SHAPES;
const PAINTS=['#e6e9ed','#1d2128','#8b939d','#2b5a9f','#a7262c','#35614a','#c8ccd2','#566070','#17496f','#b5621f'];
const hashStr=s=>{let h=7;for(const ch of String(s))h=(h*31+ch.charCodeAt(0))|0;return Math.abs(h)};
const shadeHex=(hex,f)=>{const n=parseInt(hex.slice(1),16),ch=[n>>16,(n>>8)&255,n&255].map(v=>Math.round(f>=0?v+(255-v)*f:v*(1+f)));return '#'+ch.map(v=>Math.max(0,Math.min(255,v)).toString(16).padStart(2,'0')).join('')};
/* Gedeelde verlopen en uitsnedes, één keer in de pagina (niet display:none, anders tekent de browser ze niet) */
(function carDefs(){
  const paint=PAINTS.map((p,i)=>`<linearGradient id="cg${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shadeHex(p,.42)}"/><stop offset=".38" stop-color="${shadeHex(p,.08)}"/><stop offset=".52" stop-color="${p}"/><stop offset=".56" stop-color="${shadeHex(p,-.14)}"/><stop offset="1" stop-color="${shadeHex(p,-.45)}"/></linearGradient>`).join('');
  const clips=Object.entries(SHAPES).map(([k,s])=>`<clipPath id="cpb-${k}"><path d="${s.d}"/></clipPath><clipPath id="cpg-${k}"><path d="${s.g}"/></clipPath>`).join('');
  const html=`<svg width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" focusable="false"><defs>${paint}
  <linearGradient id="glassg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#6c7f92"/><stop offset=".45" stop-color="#26323e"/><stop offset="1" stop-color="#0c1117"/></linearGradient>
  <radialGradient id="tireg"><stop offset=".6" stop-color="#30353b"/><stop offset=".86" stop-color="#181b1f"/><stop offset="1" stop-color="#090a0c"/></radialGradient>
  <radialGradient id="rimg" cx=".38" cy=".32" r=".85"><stop offset="0" stop-color="#f6f8fa"/><stop offset=".5" stop-color="#b9c1ca"/><stop offset="1" stop-color="#5f6872"/></radialGradient>
  <radialGradient id="shad" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset=".6" stop-color="#000" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  <linearGradient id="lampg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#e3ecf5"/><stop offset="1" stop-color="#9fb1c4"/></linearGradient>
  <linearGradient id="tailg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6b6f"/><stop offset=".5" stop-color="#d0242c"/><stop offset="1" stop-color="#7c0f15"/></linearGradient>
  <linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".34"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <linearGradient id="refl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  ${clips}</defs></svg>`;
  document.body.insertAdjacentHTML('afterbegin',html);
})();
/* Velg met vijf spaken: de openingen tussen de spaken tonen de remschijf */
function rimWindows(cx,cy,r){
  const r1=r*.27,r2=r*.6,P=(rad,a)=>`${(cx+rad*Math.cos(a)).toFixed(2)} ${(cy+rad*Math.sin(a)).toFixed(2)}`;
  let d='';
  for(let k=0;k<5;k++){
    const a0=(k*72-90+11)*Math.PI/180,a1=(k*72-90+61)*Math.PI/180;
    d+=`M${P(r1,a0)}L${P(r2,a0)}A${r2.toFixed(2)} ${r2.toFixed(2)} 0 0 1 ${P(r2,a1)}L${P(r1,a1)}A${r1.toFixed(2)} ${r1.toFixed(2)} 0 0 0 ${P(r1,a0)}Z`;
  }
  return d;
}
function carSvg(car,cls){
  const code=bodyOf(car),s=SHAPES[code],x=s,pi=hashStr(car.id)%PAINTS.length;
  const ground=s.cy+s.r,[fx,fy]=s.f,[tx,ty]=s.t,[mx,my]=s.mir;
  const wheel=wx=>`<g><circle cx="${wx}" cy="${s.cy}" r="${s.r}" fill="url(#tireg)"/><circle cx="${wx}" cy="${s.cy}" r="${(s.r-1.3).toFixed(1)}" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="1"/>
    <circle cx="${wx}" cy="${s.cy}" r="${(s.r*.68).toFixed(2)}" fill="url(#rimg)" stroke="#4b535c" stroke-width=".5"/>
    <path d="${rimWindows(wx,s.cy,s.r*1.03)}" fill="#30363d"/>
    <circle cx="${wx}" cy="${s.cy}" r="${(s.r*.17).toFixed(2)}" fill="#9aa3ad" stroke="#d9dfe5" stroke-width=".5"/><circle cx="${wx}" cy="${s.cy}" r="${(s.r*.06).toFixed(2)}" fill="#2b3036"/></g>`;
  const well=wx=>{const a=archOf(s,wx);return `<path d="M${a.x1.toFixed(2)} ${s.bot}A${a.R} ${a.R} 0 1 0 ${a.x2.toFixed(2)} ${s.bot}Z" fill="#0b0d10"/>`};
  const clad=wx=>{const a=archOf(s,wx,1.6);return `<path d="M${a.x1.toFixed(2)} ${s.bot}A${a.R} ${a.R} 0 1 0 ${a.x2.toFixed(2)} ${s.bot}" fill="none" stroke="#1c1f23" stroke-width="4.2"/>`};
  const seam=dx=>`<path d="M${dx} ${x.belt+1}V${x.bot-4}" stroke="rgba(0,0,0,.34)" stroke-width=".7"/><path d="M${dx+.7} ${x.belt+1}V${x.bot-4}" stroke="rgba(255,255,255,.14)" stroke-width=".5"/>`;
  const grip=gx=>`<rect x="${gx-5}" y="${x.belt+5}" width="10" height="2.2" rx="1.1" fill="rgba(0,0,0,.38)"/><rect x="${gx-4.5}" y="${x.belt+5}" width="9" height=".7" rx=".35" fill="rgba(255,255,255,.35)"/>`;
  return `<svg class="carsvg${cls?' '+cls:''}" viewBox="0 0 240 104" role="img" aria-label="Illustratie: ${BODY_NAME[code].toLowerCase()}">
  <ellipse cx="${(x.xf+x.xr)/2}" cy="${ground}" rx="${(x.xr-x.xf)/2+4}" ry="6" fill="url(#shad)"/>
  ${s.w.map(well).join('')}
  <path d="${s.d}" fill="url(#cg${pi})" stroke="rgba(0,0,0,.38)" stroke-width=".8"/>
  <g clip-path="url(#cpb-${code})">
    <rect x="0" y="${x.belt+1.2}" width="240" height="9" fill="url(#sheen)"/>
    <rect x="0" y="${x.belt+1}" width="240" height="1.1" fill="rgba(255,255,255,.42)"/>
    <rect x="0" y="${x.bot-9}" width="240" height="12" fill="rgba(0,0,0,.24)"/>
    <rect x="0" y="${x.bot-9.6}" width="240" height=".7" fill="rgba(255,255,255,.18)"/>
    ${s.clad?s.w.map(clad).join('')+`<rect x="0" y="${x.bot-5}" width="240" height="8" fill="#1c1f23" opacity=".8"/>`:''}
    ${x.doors.map(seam).join('')}${x.grips.map(grip).join('')}
    <rect x="${x.xf-2}" y="${x.bot-12}" width="16" height="4.5" rx="2.2" fill="rgba(0,0,0,.5)"/>
    <rect x="${x.xr-10}" y="${x.bot-10}" width="9" height="2" rx="1" fill="#8f1b22"/>
  </g>
  <path d="${s.g}" fill="url(#glassg)" stroke="rgba(0,0,0,.55)" stroke-width=".8"/>
  <g clip-path="url(#cpg-${code})"><rect x="40" y="0" width="34" height="104" fill="url(#refl)" transform="skewX(-28)"/><rect x="104" y="0" width="16" height="104" fill="url(#refl)" transform="skewX(-28)"/></g>
  <path d="M${mx} ${my-1}l7.5-1.6q2.3-.3 2.6 2l.2 2.3q0 1.8-1.8 1.8h-7.7q-1.4 0-1.4-1.4z" fill="url(#cg${pi})" stroke="rgba(0,0,0,.45)" stroke-width=".6"/>
  <path d="M${fx-7} ${fy-.6}Q${fx-6} ${fy-2.8} ${fx-2} ${fy-3}L${fx+9} ${fy-3.8}Q${fx+10.5} ${fy-3.6} ${fx+9.6} ${fy-2}L${fx+7.5} ${fy+.6}Q${fx+6.6} ${fy+1.6} ${fx+4.5} ${fy+1.7}L${fx-5.5} ${fy+2}Q${fx-7.4} ${fy+1.8} ${fx-7} ${fy-.6}Z" fill="url(#lampg)" stroke="rgba(0,0,0,.45)" stroke-width=".6"/>
  <path d="M${fx-5} ${fy+.9}L${fx+6} ${fy+.3}" stroke="#fff" stroke-width="1" stroke-linecap="round"/><circle cx="${fx+2}" cy="${fy-1.2}" r="1.3" fill="#fff" opacity=".9"/>
  <path d="M${tx-9} ${ty-1.6}L${tx+1.5} ${ty-2.8}Q${tx+3} ${ty-2.8} ${tx+3} ${ty-1.2}L${tx+3} ${ty+1.4}Q${tx+3} ${ty+2.6} ${tx+1.6} ${ty+2.6}L${tx-8} ${ty+2}Q${tx-9.5} ${ty+1.8} ${tx-9} ${ty-1.6}Z" fill="url(#tailg)" stroke="rgba(0,0,0,.45)" stroke-width=".5"/>
  <path d="M${tx-7.5} ${ty-.7}L${tx+1.6} ${ty-1.6}" stroke="rgba(255,255,255,.5)" stroke-width=".8" stroke-linecap="round"/>
  ${s.w.map(wheel).join('')}</svg>`;
}

