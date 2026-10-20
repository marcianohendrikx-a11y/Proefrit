const FUEL={B:'Benzine',D:'Diesel',H:'Hybride',E:'Elektrisch',W:'Waterstof',G:'LPG',N:'CNG'};
const FUELS=['Benzine','Diesel','Hybride','Plug-in hybride','Elektrisch','LPG','CNG','Waterstof'];
const CATS=[['rij','Rijgedrag'],['comfort','Comfort'],['motor','Motor & geluid'],['ruimte','Ruimte'],['prijs','Prijs/kwaliteit']];
const RIDES=['Proefrit bij dealer','Huurauto','Van een kennis','Eigen auto'];

/* Catalogus: Model|bouwjaar van-tot (2026 = nog in productie)|versies (label~brandstof) of alleen brandstofletters.
   B benzine, D diesel, H hybride (incl. plug-in), E elektrisch. Prototypedata: zie het advies in het gesprek voor een volledige bron. */
const RAW={
'Abarth':`500|2008-2026|1.4 T-Jet 135 pk~B;595 Competizione 180 pk~B;500e 155 pk~E
124 Spider|2016-2019|B`,
'Alfa Romeo':`MiTo|2008-2018|BD
Giulietta|2010-2020|1.4 TB 120 pk~B;1.75 TBi Quadrifoglio 240 pk~B;2.0 JTDm 150 pk~D
Giulia|2016-2026|2.0 Turbo 200 pk~B;2.9 V6 Quadrifoglio 510 pk~B;2.2 JTDm 190 pk~D
Stelvio|2017-2026|2.0 Turbo 280 pk~B;2.2 JTDm 210 pk~D;2.9 V6 Quadrifoglio 510 pk~B
Tonale|2022-2026|1.5 Hybrid 160 pk~H;1.3 PHEV 280 pk~H;1.6 JTDm 130 pk~D
Junior|2024-2026|1.2 Hybrid 136 pk~H;Elettrica 156 pk~E
159|2006-2011|BD
147|2006-2010|BD
Brera|2006-2010|BD
4C|2013-2020|B`,
'Alpine':`A110|2017-2026|B
A290|2024-2026|E`,
'Aston Martin':`Vantage|2006-2026|B
DB9|2006-2016|B
DB11|2016-2023|B
DBS|2007-2024|B
DBX|2020-2026|B
Rapide|2010-2020|B
Vanquish|2012-2018|B`,
'Audi':`A1|2010-2026|1.0 TFSI 95 pk~B;1.5 TFSI 150 pk~B;1.6 TDI 116 pk~D
A3|2006-2026|1.0 TFSI 110 pk~B;1.5 TFSI 150 pk~B;2.0 TDI 150 pk~D;40 TFSI e 204 pk~H
A4|2006-2026|1.4 TFSI 150 pk~B;2.0 TFSI 190 pk~B;2.0 TDI 190 pk~D
A5|2007-2026|2.0 TFSI 190 pk~B;2.0 TDI 190 pk~D;3.0 TDI 286 pk~D
A6|2006-2026|2.0 TFSI 245 pk~B;2.0 TDI 204 pk~D;3.0 TDI 286 pk~D;55 TFSI e 367 pk~H
A7|2010-2026|BDH
A8|2006-2026|BDH
Q2|2016-2026|BD
Q3|2011-2026|BDH
Q4 e-tron|2021-2026|E
Q5|2008-2026|2.0 TFSI 252 pk~B;2.0 TDI 204 pk~D;50 TFSI e 299 pk~H
Q6 e-tron|2024-2026|E
Q7|2006-2026|3.0 TDI 286 pk~D;3.0 TFSI 340 pk~B;60 TFSI e 456 pk~H
Q8|2018-2026|BDH
e-tron|2018-2023|E
e-tron GT|2021-2026|E
TT|2006-2023|2.0 TFSI 230 pk~B;TT RS 400 pk~B;2.0 TDI 184 pk~D
R8|2007-2023|4.2 V8~B;5.2 V10~B
RS 3|2011-2026|2.5 TFSI 400 pk~B
RS 6 Avant|2013-2026|4.0 TFSI V8 600 pk~B`,
'Bentley':`Continental GT|2006-2026|B
Bentayga|2016-2026|BDH
Flying Spur|2006-2026|BH`,
'BMW':`1-serie|2006-2026|116i 109 pk~B;118i 136 pk~B;M135i 306 pk~B;118d 150 pk~D
2-serie|2014-2026|BDH
3-serie|2006-2026|318i 156 pk~B;320i 184 pk~B;M340i 374 pk~B;320d 190 pk~D;330e 292 pk~H
4-serie|2013-2026|BDH
5-serie|2006-2026|520i 184 pk~B;530i 252 pk~B;520d 190 pk~D;530e 292 pk~H
6-serie|2006-2018|BD
7-serie|2006-2026|BDHE
8-serie|2018-2026|BD
X1|2009-2026|sDrive18i 136 pk~B;sDrive18d 150 pk~D;xDrive25e 220 pk~H;iX1 xDrive30~E
X2|2018-2026|BDH
X3|2006-2026|BDH
X4|2014-2025|BD
X5|2006-2026|xDrive40i 340 pk~B;xDrive30d 286 pk~D;xDrive45e 394 pk~H;M50i 530 pk~B;X5 M Competition 625 pk~B
X6|2008-2026|BD
X7|2019-2026|BDH
XM|2022-2026|H
Z4|2009-2026|sDrive20i 197 pk~B;M40i 340 pk~B
i3|2013-2022|42 kWh~E;120 Ah met range extender~H
i4|2021-2026|E
i5|2023-2026|E
i7|2022-2026|E
iX|2021-2026|xDrive40 326 pk~E;xDrive50 523 pk~E
iX3|2020-2026|E`,
'Bugatti':`Veyron|2006-2015|B
Chiron|2016-2024|B`,
'BYD':`Atto 3|2022-2026|E
Atto 2|2024-2026|E
Dolphin|2023-2026|E
Dolphin Surf|2025-2026|E
Seal|2023-2026|E
Seal U DM-i|2024-2026|H
Han|2020-2026|E
Sealion 7|2024-2026|E`,
'Cadillac':`Escalade|2006-2026|B
CTS|2006-2019|B
ATS|2013-2019|B
XT5|2016-2026|B
Lyriq|2022-2026|E`,
'Chevrolet':`Spark|2010-2022|B
Aveo|2006-2020|BD
Cruze|2009-2019|BD
Captiva|2006-2018|BD
Camaro|2010-2024|2.0 Turbo 275 pk~B;6.2 V8 SS 455 pk~B;ZL1 650 pk~B
Corvette|2006-2026|6.2 V8 C7 466 pk~B;6.2 V8 C8 495 pk~B;Z06 5.5 V8 670 pk~B;E-Ray 655 pk~H
Silverado 1500|2006-2026|5.3 V8~B;6.2 V8~B;3.0 Duramax~D;Silverado EV~E
Tahoe|2006-2026|5.3 V8~B;6.2 V8~B
Suburban|2006-2026|B
Equinox|2006-2026|B
Blazer|2019-2026|B
Colorado|2012-2026|BD
Bolt EV|2017-2023|E
Volt|2011-2019|H`,
'Chrysler':`300C|2006-2023|3.6 V6~B;5.7 HEMI V8~B;3.0 CRD~D
Voyager|2006-2023|BDH
PT Cruiser|2006-2010|BD
Sebring|2007-2010|BD
Pacifica|2017-2026|H`,
'Citroën':`C1|2006-2021|B
C3|2006-2026|1.2 PureTech 83 pk~B;1.2 PureTech 110 pk~B;1.5 BlueHDi~D;ë-C3 113 pk~E
C3 Aircross|2017-2026|BD
C3 Picasso|2009-2017|BD
C4|2006-2026|BDE
C4 Cactus|2014-2020|BD
C5|2008-2017|BD
C5 Aircross|2018-2026|BDH
C5 X|2021-2026|BH
C8|2006-2014|BD
Berlingo|2008-2026|BDE
Grand C4 Picasso|2006-2022|BD
C-Zero|2010-2020|E
Ami|2020-2026|E`,
'Cupra':`Born|2021-2026|58 kWh 204 pk~E;77 kWh 231 pk~E
Formentor|2020-2026|1.5 TSI 150 pk~B;2.0 TSI VZ 310 pk~B;1.4 e-Hybrid 204 pk~H
Leon|2020-2026|1.5 TSI 150 pk~B;2.0 TSI VZ 300 pk~B;1.4 e-Hybrid 245 pk~H
Ateca|2018-2026|B
Tavascan|2024-2026|E
Terramar|2024-2026|BH`,
'Dacia':`Sandero|2008-2026|1.0 TCe 90 pk~B;1.0 TCe 100 ECO-G (LPG)~G
Duster|2010-2026|1.0 TCe 100 pk~B;1.3 TCe 130 pk~B;1.5 dCi 115 pk~D;1.6 Hybrid 140 pk~H
Logan|2006-2021|BD
Jogger|2022-2026|1.0 TCe 110 pk~B;1.6 Hybrid 140 pk~H
Lodgy|2012-2022|BD
Dokker|2012-2021|BD
Spring|2021-2026|E
Bigster|2025-2026|BH`,
'Daihatsu':`Cuore|2006-2013|B
Sirion|2006-2022|B
Terios|2006-2017|B`,
'Dodge':`Challenger|2008-2023|3.6 V6 305 pk~B;5.7 HEMI R/T 375 pk~B;6.4 HEMI Scat Pack 485 pk~B;6.2 Hellcat 717 pk~B;Demon 840 pk~B
Charger|2006-2023|3.6 V6~B;5.7 HEMI~B;6.4 HEMI Scat Pack~B;6.2 Hellcat~B
Durango|2011-2026|3.6 V6~B;5.7 HEMI~B;6.4 SRT 392~B;SRT Hellcat 710 pk~B
Journey|2008-2020|BD
Nitro|2007-2011|BD
Caliber|2006-2012|BD
Viper|2006-2017|8.3 V10~B;8.4 V10~B
Ram 1500|2006-2010|3.7 V6~B;4.7 V8~B;5.7 HEMI V8~B`,
'DS':`DS 3|2010-2026|BDE
DS 4|2011-2026|BDH
DS 5|2011-2018|BDH
DS 7|2018-2026|BDH
DS 9|2020-2026|BH`,
'Ferrari':`F430|2006-2009|B
599 GTB|2006-2012|B
California|2008-2017|B
458 Italia|2009-2015|B
FF|2011-2016|B
488 GTB|2015-2019|B
812|2017-2024|B
Portofino|2017-2023|B
F8 Tributo|2019-2023|B
Roma|2020-2026|B
SF90 Stradale|2019-2026|H
296 GTB|2022-2026|H
Purosangue|2022-2026|B
12Cilindri|2024-2026|B
LaFerrari|2013-2016|H`,
'Fiat':`500|2007-2026|0.9 TwinAir 85 pk~B;1.2 69 pk~B;1.0 Hybrid 70 pk~H
500e|2013-2026|24 kWh~E;42 kWh 118 pk~E
500X|2015-2026|BD
500L|2012-2022|BD
600|2023-2026|1.2 Hybrid 100 pk~H;600e 156 pk~E
Panda|2006-2026|0.9 TwinAir~B;1.2 69 pk~B;1.0 Hybrid 70 pk~H;1.3 MultiJet~D
Punto|2006-2018|BD
Tipo|2016-2026|1.0 T3 100 pk~B;1.4 T-Jet~B;1.6 MultiJet~D
Bravo|2007-2014|BD
Doblò|2006-2026|BD
Qubo|2008-2021|BD
Sedici|2006-2014|BD
Freemont|2011-2016|D
124 Spider|2016-2020|B`,
'Ford':`Fiesta|2006-2023|1.0 EcoBoost 100 pk~B;1.0 EcoBoost 125 pk~B;ST 200 pk~B;1.5 TDCi~D
Focus|2006-2025|1.0 EcoBoost 125 pk~B;1.5 EcoBoost 150 pk~B;ST 280 pk~B;RS 350 pk~B;1.5 EcoBlue~D
Mondeo|2006-2022|BDH
Ka|2008-2020|B
B-Max|2012-2017|B
C-Max|2007-2019|BD
S-Max|2006-2023|BDH
Galaxy|2006-2023|BDH
Kuga|2008-2026|1.5 EcoBoost 150 pk~B;2.0 EcoBlue~D;2.5 FHEV 190 pk~H;2.5 PHEV 225 pk~H
Puma|2019-2026|1.0 EcoBoost mHEV 125 pk~H;ST 200 pk~B;Gen-E 168 pk~E
EcoSport|2013-2023|B
Edge|2015-2023|D
Explorer|2006-2026|3.5 V6~B;3.0 EcoBoost PHEV 457 pk~H;Explorer Electric~E
Mustang|2006-2026|2.3 EcoBoost 317 pk~B;5.0 V8 GT 450 pk~B;Shelby GT500 760 pk~B
Mustang Mach-E|2021-2026|Standard Range~E;Extended Range~E;GT~E
F-150|2006-2026|2.7 EcoBoost~B;3.5 EcoBoost~B;5.0 V8~B;3.0 Power Stroke diesel~D;PowerBoost Hybrid~H;F-150 Lightning~E
Ranger|2006-2026|2.0 EcoBlue 170 pk~D;3.0 V6 EcoBlue 240 pk~D;2.3 EcoBoost~B;Raptor 3.0 EcoBoost~B;PHEV~H
Bronco|2021-2026|2.3 EcoBoost~B;2.7 EcoBoost~B
Capri|2024-2026|E`,
'Genesis':`G70|2018-2026|BD
G80|2017-2026|BDE
G90|2017-2026|B
GV60|2022-2026|E
GV70|2021-2026|BDE
GV80|2020-2026|BD`,
'GMC':`Sierra|2006-2026|5.3 V8~B;6.2 V8~B;3.0 Duramax~D;Sierra EV~E
Yukon|2006-2026|B
Hummer EV|2022-2026|E`,
'Honda':`Civic|2006-2026|1.0 VTEC Turbo 129 pk~B;1.5 VTEC Turbo 182 pk~B;Type R 329 pk~B;2.0 e:HEV 184 pk~H;1.6 i-DTEC~D
Jazz|2006-2026|1.3 i-VTEC~B;1.5 e:HEV 109 pk~H
CR-V|2006-2026|1.5 VTEC Turbo~B;2.0 i-MMD hybride~H;2.2 i-DTEC~D
HR-V|2015-2026|1.5 i-VTEC~B;1.5 e:HEV~H
ZR-V|2023-2026|H
Accord|2006-2023|BDH
Honda e|2020-2023|E
e:Ny1|2023-2026|E
Insight|2009-2014|H
CR-Z|2010-2016|H
FR-V|2006-2009|BD
S2000|2006-2009|B
NSX|2016-2022|H
Prelude|2025-2026|H`,
'Hyundai':`i10|2008-2026|1.0 67 pk~B;1.2 84 pk~B
i20|2008-2026|1.0 T-GDI 100 pk~B;1.0 T-GDI 120 pk~B;N 204 pk~B;1.4 CRDi~D
i30|2007-2026|1.0 T-GDI 120 pk~B;1.5 T-GDI 160 pk~B;N 280 pk~B;1.6 CRDi~D
i40|2011-2019|BD
ix20|2010-2019|BD
ix35|2010-2015|BD
Getz|2006-2011|BD
Matrix|2006-2010|BD
Veloster|2012-2022|B
Genesis Coupe|2008-2016|B
Bayon|2021-2026|BH
Kona|2017-2026|1.0 T-GDI~B;1.6 GDi HEV 141 pk~H;Electric 39 kWh~E;Electric 64 kWh 204 pk~E
Inster|2024-2026|E
Tucson|2006-2026|1.6 T-GDI 150 pk~B;1.6 T-GDI HEV 230 pk~H;1.6 T-GDI PHEV 265 pk~H;1.7 CRDi~D
Santa Fe|2006-2026|BDH
Staria|2021-2026|D
Ioniq|2016-2022|HEV~H;PHEV~H;Electric~E
Ioniq 5|2021-2026|58 kWh 170 pk~E;77 kWh 229 pk~E;77 kWh 325 pk AWD~E;N 650 pk~E
Ioniq 6|2022-2026|53 kWh~E;77 kWh~E;77 kWh AWD 325 pk~E
Ioniq 9|2025-2026|E`,
'Infiniti':`Q30|2015-2019|BD
Q50|2014-2023|BDH
QX70|2008-2017|BD`,
'Isuzu':`D-Max|2012-2026|D`,
'Jaguar':`XE|2015-2024|BD
XF|2008-2024|BD
XJ|2006-2019|BD
XK|2006-2014|B
F-Pace|2016-2026|BDH
E-Pace|2017-2026|BDH
I-Pace|2018-2024|E
F-Type|2013-2024|2.0 Turbo 300 pk~B;3.0 V6~B;5.0 V8 R 575 pk~B`,
'Jeep':`Wrangler|2007-2026|2.0 Turbo 272 pk~B;3.6 V6 Pentastar~B;2.2 MultiJet~D;4xe PHEV 380 pk~H
Grand Cherokee|2006-2026|3.6 V6~B;5.7 HEMI V8~B;3.0 CRD~D;4xe PHEV~H
Renegade|2014-2026|1.0 T3~B;1.3 T4~B;1.6 MultiJet~D;4xe PHEV~H
Compass|2007-2026|1.3 T4 130 pk~B;1.6 MultiJet~D;4xe PHEV 240 pk~H
Cherokee|2014-2023|BD
Avenger|2023-2026|1.2 Turbo 100 pk~B;1.2 e-Hybrid 100 pk~H;Elektrisch 54 kWh~E
Gladiator|2020-2026|3.6 V6~B;3.0 EcoDiesel~D
Patriot|2007-2017|BD
Commander|2006-2010|BD`,
'Kia':`Picanto|2006-2026|1.0 67 pk~B;1.2 84 pk~B
Rio|2006-2026|1.0 T-GDI 100 pk~B;1.2 84 pk~B;1.4 CRDi~D
Ceed|2007-2026|1.0 T-GDi 120 pk~B;1.5 T-GDi 160 pk~B;1.6 CRDi~D;PHEV 141 pk~H
ProCeed|2019-2026|1.5 T-GDi~B;GT 204 pk~B
XCeed|2019-2026|1.0 T-GDi~B;PHEV 141 pk~H
Stonic|2017-2026|1.0 T-GDi 100 pk~B;1.0 T-GDi mHEV 120 pk~H
Niro|2016-2026|1.6 GDi HEV~H;1.6 GDi PHEV~H;Niro EV 64 kWh~E
Sportage|2006-2026|1.6 T-GDi 150 pk~B;1.6 T-GDi HEV 230 pk~H;1.6 T-GDi PHEV 265 pk~H;1.6 CRDi~D
Sorento|2006-2026|2.2 CRDi~D;1.6 T-GDi HEV~H;1.6 T-GDi PHEV 265 pk~H;3.5 V6~B
Soul|2009-2026|1.6 GDi~B;1.6 CRDi~D;Soul EV 64 kWh~E
Stinger|2017-2023|2.0 T-GDi 255 pk~B;3.3 V6 T-GDi 370 pk~B;2.2 CRDi~D
Optima|2012-2020|BDH
Carens|2006-2019|BD
Venga|2010-2019|BD
Carnival|2006-2026|2.2 CRDi~D;1.6 HEV~H
EV3|2024-2026|E
EV6|2021-2026|58 kWh~E;77 kWh RWD 229 pk~E;77 kWh AWD 325 pk~E;GT 585 pk~E
EV9|2023-2026|E`,
'Lamborghini':`Gallardo|2006-2013|B
Murciélago|2006-2010|B
Aventador|2011-2022|B
Huracán|2014-2024|B
Urus|2018-2026|4.0 V8~B;Urus SE PHEV 800 pk~H
Revuelto|2023-2026|H
Temerario|2024-2026|H`,
'Lancia':`Ypsilon|2006-2026|1.2 69 pk~B;1.0 Hybrid 70 pk~H;Ypsilon Elettrica~E
Delta|2008-2014|BD`,
'Land Rover':`Defender|2020-2026|P300 2.0~B;P400 3.0 MHEV~B;P525 5.0 V8~B;D250 3.0~D;P400e PHEV~H
Defender (oud)|2006-2016|2.2 TDCi~D;2.4 TDCi~D
Discovery|2006-2026|3.0 TDV6~D;3.0 Td6~D;3.0 Si6~B
Discovery Sport|2014-2026|BDH
Freelander|2006-2014|2.2 TD4~D;2.2 SD4~D;3.2 i6~B
Range Rover|2006-2026|3.0 TDV6~D;3.0 D350~D;4.4 SDV8~D;5.0 V8 Supercharged~B;P440e PHEV~H
Range Rover Sport|2006-2026|3.0 TDV6~D;3.0 D300~D;5.0 V8 SC 510 pk~B;P440e PHEV~H
Range Rover Evoque|2011-2026|2.0 Si4~B;2.0 TD4~D;P300e PHEV~H
Range Rover Velar|2017-2026|BDH`,
'Lexus':`CT|2011-2022|H
IS|2006-2026|IS 250~B;IS 220d~D;IS 300h~H;IS 500 F Sport 481 pk~B
ES|2018-2026|H
GS|2006-2020|BH
LS|2006-2026|BH
NX|2014-2026|NX 200t~B;NX 300h~H;NX 450h+ PHEV~H
RX|2006-2026|RX 350~B;RX 450h~H;RX 500h~H;RX 450h+ PHEV~H
UX|2018-2026|UX 200~B;UX 250h~H;UX 300e~E
LBX|2023-2026|H
RC|2014-2025|BH
LC|2017-2026|LC 500 V8~B;LC 500h~H
RZ|2023-2026|E
GX|2006-2026|B
LX|2006-2026|B
LFA|2010-2012|B`,
'Lincoln':`Navigator|2006-2026|B
Aviator|2019-2026|BH`,
'Lotus':`Elise|2006-2021|B
Exige|2006-2021|B
Evora|2009-2021|B
Emira|2022-2026|B
Eletre|2023-2026|E`,
'Lynk & Co':`01|2021-2026|H
02|2022-2026|E`,
'Maserati':`Quattroporte|2006-2023|BD
Ghibli|2013-2023|3.0 V6~B;3.0 V6 Diesel~D;Hybrid 330 pk~H
Levante|2016-2023|BD
GranTurismo|2007-2026|V8~B;V6 Nettuno~B;Folgore~E
GranCabrio|2010-2026|B
MC20|2021-2026|B
Grecale|2022-2026|2.0 Hybrid 300 pk~H;3.0 V6 Trofeo~B;Folgore~E`,
'Mazda':`Mazda2|2007-2026|1.5 Skyactiv-G 75 pk~B;1.5 Skyactiv-G 90 pk~B;Hybrid 116 pk~H
Mazda3|2006-2026|2.0 Skyactiv-G 122 pk~B;2.0 Skyactiv-X 186 pk~B;1.5 Skyactiv-D~D
Mazda5|2006-2010|BD
Mazda6|2006-2024|2.0 Skyactiv-G 165 pk~B;2.5 Skyactiv-G 194 pk~B;2.2 Skyactiv-D 150 pk~D
CX-3|2015-2021|BD
CX-30|2019-2026|2.0 e-Skyactiv G 122 pk~B;Skyactiv-X 186 pk~B;1.8 Skyactiv-D~D
CX-5|2012-2026|2.0 Skyactiv-G 165 pk~B;2.5 Skyactiv-G 194 pk~B;2.2 Skyactiv-D 150 pk~D
CX-60|2022-2026|PHEV 327 pk~H;3.3 Skyactiv-D 200 pk~D
CX-7|2007-2012|BD
CX-90|2023-2026|PHEV~H;3.3 Skyactiv-D~D
MX-5|2006-2026|1.8 MZR 126 pk~B;1.5 Skyactiv-G 132 pk~B;2.0 Skyactiv-G 184 pk~B
MX-30|2020-2026|35.5 kWh EV~E;R-EV~H
RX-8|2006-2012|1.3 Renesis 231 pk~B`,
'McLaren':`MP4-12C|2011-2014|B
570S|2015-2021|B
720S|2017-2023|B
GT|2019-2024|B
Artura|2021-2026|H`,
'Mercedes-Benz':`A-Klasse|2006-2026|A 180 136 pk~B;A 200 163 pk~B;A 35 AMG 306 pk~B;A 45 S AMG 421 pk~B;A 180 d~D;A 250 e PHEV~H
B-Klasse|2006-2026|B 180~B;B 200 d~D;B 250 e PHEV~H;B-Klasse Electric Drive~E
C-Klasse|2006-2026|C 180 156 pk~B;C 200 204 pk~B;C 220 d~D;C 300 e PHEV~H;C 63 AMG V8~B
E-Klasse|2006-2026|E 200~B;E 220 d~D;E 300 e PHEV~H;E 400 d~D;E 63 AMG~B
S-Klasse|2006-2026|S 350 d~D;S 450 L~B;S 500~B;S 580 e PHEV~H
CLA|2013-2026|CLA 180~B;CLA 220 d~D;CLA 250 e PHEV~H;CLA 45 AMG~B
CLS|2006-2023|BDH
CLK|2006-2010|BD
GLA|2014-2026|BDH
GLB|2019-2026|BDH
GLC|2015-2026|GLC 200~B;GLC 220 d~D;GLC 300 de PHEV~H;GLC 63 AMG~B
GLE|2015-2026|GLE 350 d~D;GLE 450~B;GLE 350 de PHEV~H;GLE 63 AMG~B
GLK|2008-2015|BD
GLS|2016-2026|BD
G-Klasse|2006-2026|G 350 d~D;G 500~B;G 63 AMG 585 pk~B
M-Klasse|2006-2015|ML 350 CDI~D;ML 350~B;ML 63 AMG~B
R-Klasse|2006-2013|BD
SLK|2006-2016|BD
SL|2006-2026|B
AMG GT|2015-2026|B
SLS AMG|2010-2014|B
V-Klasse|2014-2026|D
EQA|2021-2026|E
EQB|2021-2026|E
EQC|2019-2023|E
EQE|2022-2026|E
EQS|2021-2026|E`,
'MG':`MG3|2011-2026|1.5 VTi~B;1.5 Hybrid+ 195 pk~H
ZS|2017-2026|1.0 T-GDI~B;1.5 VTi~B;ZS EV 51 kWh~E;ZS EV 72 kWh~E
HS|2019-2026|1.5 T-GDI~B;PHEV 258 pk~H
MG4|2022-2026|Standard 51 kWh~E;Long Range 64 kWh~E;77 kWh~E;XPower 435 pk~E
MG5|2020-2026|E
Marvel R|2021-2025|E
Cyberster|2024-2026|E`,
'Mini':`Cooper|2006-2026|Cooper 1.5 136 pk~B;Cooper S 2.0 192 pk~B;John Cooper Works 231 pk~B;Cooper D~D;Cooper SE~E
Clubman|2007-2024|BD
Countryman|2010-2026|Cooper~B;Cooper D~D;Cooper SE ALL4 PHEV~H;Countryman E~E
Cabrio|2006-2026|B
Paceman|2013-2016|BD
Aceman|2024-2026|E`,
'Mitsubishi':`Space Star|2013-2026|1.0 71 pk~B;1.2 80 pk~B
ASX|2010-2026|1.6 MIVEC~B;1.8 DI-D~D;1.6 HEV~H
Outlander|2006-2026|2.0 MIVEC~B;2.2 DI-D~D;2.4 PHEV~H
Eclipse Cross|2018-2026|1.5 T-MIVEC~B;2.4 PHEV~H
Colt|2006-2012|BD
Lancer|2006-2017|BD
Lancer Evolution|2006-2015|2.0 Turbo 295 pk~B
L200|2006-2026|D
Pajero|2006-2021|D
i-MiEV|2010-2020|E`,
'Nissan':`Micra|2006-2026|1.0 IG-T 92 pk~B;1.2 80 pk~B;Micra EV~E
Note|2006-2018|BD
Pulsar|2014-2018|BD
Juke|2010-2026|1.0 DIG-T 114 pk~B;1.6 Hybrid~H;1.5 dCi~D
Qashqai|2007-2026|1.3 DIG-T 140 pk~B;1.3 DIG-T 158 pk~B;e-Power 190 pk~H;1.5 dCi~D
X-Trail|2007-2026|1.3 DIG-T~B;1.6 dCi~D;e-Power 213 pk~H
Murano|2006-2018|B
Pathfinder|2006-2026|BD
Patrol|2006-2026|BD
Navara|2006-2026|D
Leaf|2011-2026|24 kWh~E;40 kWh~E;62 kWh e+~E
Ariya|2022-2026|63 kWh~E;87 kWh~E;87 kWh e-4ORCE~E
350Z|2006-2009|B
370Z|2009-2020|B
Z|2023-2026|B
GT-R|2007-2024|3.8 V6 biturbo~B`,
'Opel':`Corsa|2006-2026|1.2 75 pk~B;1.2 Turbo 100 pk~B;1.2 Turbo 130 pk~B;1.3 CDTI~D;Corsa-e 136 pk~E
Astra|2006-2026|1.2 Turbo 110 pk~B;1.4 Turbo 150 pk~B;1.6 CDTI~D;Plug-in Hybrid 180 pk~H;Astra Electric 156 pk~E
Insignia|2008-2022|BD
Mokka|2012-2026|1.2 Turbo~B;1.4 Turbo~B;Mokka Electric~E
Crossland|2017-2024|BD
Grandland|2017-2026|1.2 Turbo~B;1.5 BlueHDi~D;1.6 Turbo Hybrid4~H;Grandland Electric~E
Frontera|2024-2026|1.2 Hybrid~H;Frontera Electric~E
Adam|2013-2019|B
Karl|2015-2019|B
Agila|2006-2014|B
Zafira|2006-2019|BD
Meriva|2006-2017|BD
Antara|2006-2015|D
Cascada|2013-2019|BD
Combo|2006-2026|BD
Ampera|2011-2015|H
Rocks Electric|2021-2026|E`,
'Peugeot':`107|2006-2014|B
108|2014-2021|B
207|2006-2014|BD
208|2012-2026|1.2 PureTech 75 pk~B;1.2 PureTech 100 pk~B;1.2 PureTech 130 pk~B;1.5 BlueHDi~D;e-208 136 pk~E
2008|2013-2026|1.2 PureTech~B;1.5 BlueHDi~D;e-2008~E
308|2007-2026|1.2 PureTech 130 pk~B;1.6 THP 205 pk GTi~B;1.5 BlueHDi~D;1.6 PHEV 180 pk~H;e-308~E
407|2006-2011|BD
408|2022-2026|BH
508|2011-2026|BDH
RCZ|2010-2015|BD
3008|2009-2026|1.2 PureTech 130 pk~B;1.5 BlueHDi~D;1.6 PHEV Hybrid4~H;E-3008~E
5008|2009-2026|BDH
Partner|2008-2026|BDE
Rifter|2018-2026|BDE
Traveller|2016-2026|DE
iOn|2010-2020|E`,
'Polestar':`1|2019-2021|H
2|2020-2026|Standard Range~E;Long Range~E;Long Range Dual Motor~E
3|2023-2026|E
4|2023-2026|E`,
'Porsche':`911|2006-2026|Carrera 385 pk~B;Carrera S~B;Carrera 4 GTS~B;GT3~B;Turbo S~B;Carrera GTS T-Hybrid~H
718 Boxster|2006-2026|2.0 Turbo 300 pk~B;S 350 pk~B;GTS 4.0 400 pk~B
718 Cayman|2006-2026|2.0 Turbo 300 pk~B;GTS 4.0 400 pk~B;GT4 RS~B
Cayenne|2006-2026|3.0 V6~B;3.0 Diesel~D;E-Hybrid~H;Turbo V8~B
Macan|2014-2026|2.0 Turbo~B;S~B;GTS~B;Macan Electric~E
Panamera|2009-2026|4~B;Diesel~D;4 E-Hybrid~H;Turbo S~B
Taycan|2019-2026|4S~E;GTS~E;Turbo S~E
918 Spyder|2013-2015|H`,
'Ram':`1500|2011-2026|3.6 Pentastar V6~B;5.7 HEMI V8~B;3.0 EcoDiesel V6~D;3.0 Hurricane Turbo~B;6.2 TRX Supercharged V8~B
2500|2011-2026|6.4 HEMI V8~B;6.7 Cummins turbodiesel~D
3500|2011-2026|6.4 HEMI V8~B;6.7 Cummins turbodiesel~D`,
'Renault':`Twingo|2007-2026|1.0 SCe 75 pk~B;0.9 TCe 90 pk~B;Twingo Electric~E
Twizy|2012-2023|E
Clio|2006-2026|1.0 TCe 90 pk~B;1.3 TCe 130 pk~B;E-Tech Full Hybrid 145 pk~H;1.5 dCi~D;RS 200 pk~B
Captur|2013-2026|1.0 TCe 100 pk~B;1.3 TCe 140 pk~B;1.5 dCi~D;E-Tech Plug-in 160 pk~H
Megane|2006-2023|1.2 TCe 130 pk~B;1.3 TCe 140 pk~B;1.5 dCi~D;RS 280 pk~B;E-Tech Plug-in 160 pk~H
Megane E-Tech|2022-2026|40 kWh~E;60 kWh~E
Scenic|2006-2026|1.3 TCe~B;1.5 dCi~D;E-Tech Electric 87 kWh~E
Kadjar|2015-2022|BD
Arkana|2021-2026|1.3 TCe 140 pk~B;E-Tech Hybrid 145 pk~H
Austral|2022-2026|1.2 Mild Hybrid~H;E-Tech Full Hybrid 200 pk~H
Rafale|2024-2026|H
Symbioz|2024-2026|H
Zoe|2012-2024|22 kWh~E;41 kWh~E;52 kWh~E
Talisman|2015-2022|BD
Laguna|2006-2015|BD
Kangoo|2008-2026|BDE
Espace|2006-2026|BDH
Koleos|2008-2026|BD
Fluence|2010-2016|BD
Modus|2006-2012|BD
Wind|2010-2013|B
Renault 5 E-Tech|2024-2026|40 kWh~E;52 kWh~E
Renault 4 E-Tech|2025-2026|E`,
'Rolls-Royce':`Phantom|2006-2026|B
Ghost|2010-2026|B
Dawn|2016-2023|B
Wraith|2013-2023|B
Cullinan|2018-2026|B
Spectre|2023-2026|E`,
'Saab':`9-3|2006-2012|BD
9-5|2006-2012|BD`,
'Seat':`Ibiza|2006-2026|1.0 MPI 80 pk~B;1.0 TSI 95 pk~B;1.0 TSI 110 pk~B;1.5 TSI FR 150 pk~B;1.6 TDI~D
Leon|2006-2026|1.0 TSI 110 pk~B;1.5 TSI 150 pk~B;2.0 TSI Cupra 300 pk~B;2.0 TDI 150 pk~D;1.4 e-Hybrid~H
Arona|2017-2026|1.0 TSI 95 pk~B;1.0 TSI 110 pk~B;1.5 TSI 150 pk~B
Ateca|2016-2026|1.0 TSI~B;1.5 TSI~B;2.0 TDI~D
Tarraco|2018-2026|BDH
Altea|2006-2015|BD
Mii|2011-2021|1.0 60 pk~B;1.0 75 pk~B;Mii Electric 83 pk~E
Toledo|2006-2019|BD
Alhambra|2006-2020|BD
Exeo|2008-2013|BD`,
'Škoda':`Fabia|2006-2026|1.0 MPI 80 pk~B;1.0 TSI 95 pk~B;1.0 TSI 110 pk~B;1.4 TDI~D
Octavia|2006-2026|1.0 TSI 110 pk~B;1.4 TSI 150 pk~B;1.5 TSI 150 pk~B;2.0 TSI RS 245 pk~B;2.0 TDI 150 pk~D;1.4 iV PHEV 204 pk~H
Superb|2008-2026|1.4 TSI 150 pk~B;2.0 TSI 280 pk~B;2.0 TDI 150 pk~D;1.4 iV PHEV 218 pk~H
Scala|2019-2026|B
Kamiq|2019-2026|1.0 TSI 95 pk~B;1.0 TSI 110 pk~B;1.5 TSI 150 pk~B
Karoq|2017-2026|1.0 TSI~B;1.5 TSI~B;2.0 TDI~D
Kodiaq|2016-2026|1.5 TSI 150 pk~B;2.0 TSI 190 pk~B;2.0 TDI~D;PHEV 204 pk~H
Rapid|2012-2019|BD
Citigo|2011-2019|B
Yeti|2009-2017|BD
Roomster|2006-2015|BD
Enyaq|2020-2026|60 kWh~E;80 kWh~E;85 kWh~E;RS 340 pk~E
Elroq|2024-2026|E`,
'Smart':`Fortwo|2006-2026|0.9 turbo 90 pk~B;1.0 71 pk~B;EQ fortwo~E
Forfour|2006-2021|BE
#1|2023-2026|E
#3|2024-2026|E`,
'SsangYong':`Tivoli|2015-2026|BD
Korando|2011-2026|BDE
Torres|2023-2026|BE
Rexton|2006-2026|D
Musso|2018-2026|D
Kyron|2006-2014|D`,
'Subaru':`Impreza|2006-2026|1.6i~B;2.0i 150 pk~B;2.0 e-Boxer 150 pk~H
WRX|2014-2026|STI 2.5 300 pk~B;2.4 Turbo 275 pk~B
Forester|2006-2026|2.0i~B;2.0D~D;2.0 e-Boxer 150 pk~H
Outback|2006-2026|2.5i~B;2.0D~D
XV|2012-2022|1.6i~B;2.0i~B;e-Boxer~H
Crosstrek|2023-2026|B
Legacy|2006-2020|BD
BRZ|2012-2026|2.0 200 pk~B;2.4 231 pk~B
Levorg|2015-2026|1.6 GT~B
Solterra|2022-2026|E`,
'Suzuki':`Swift|2006-2026|1.2 Dualjet 90 pk~B;1.2 Mild Hybrid 83 pk~H;1.4 Boosterjet Sport 140 pk~B;1.3 DDiS~D
Ignis|2016-2026|1.2 Dualjet~B;1.2 Hybrid 83 pk~H
Vitara|2015-2026|1.0 Boosterjet~B;1.4 Boosterjet 140 pk~B;1.5 Hybrid 102 pk~H;1.6 DDiS~D
S-Cross|2013-2026|1.0 Boosterjet~B;1.4 Boosterjet 129 pk~B;1.5 Hybrid 116 pk~H
Jimny|2006-2026|1.3 85 pk~B;1.5 102 pk AllGrip~B
Baleno|2016-2023|B
Celerio|2014-2026|B
Splash|2008-2015|BD
Alto|2009-2015|B
SX4|2006-2014|BD
Grand Vitara|2006-2015|BD
Kizashi|2010-2016|B
Swace|2020-2026|H
Across|2020-2026|H
e Vitara|2025-2026|E`,
'Tesla':`Roadster|2008-2012|E
Model S|2012-2026|60D~E;75D~E;100D~E;Long Range~E;Plaid~E
Model X|2015-2026|E
Model 3|2018-2026|Standard Range Plus~E;Long Range AWD~E;Performance~E;Highland RWD~E;Highland Long Range~E
Model Y|2020-2026|Standard~E;Long Range RWD~E;Long Range AWD~E;Performance~E
Cybertruck|2023-2026|E`,
'Toyota':`Aygo|2006-2022|1.0 VVT-i 69 pk~B;1.0 x-shift~B
Aygo X|2022-2026|1.0 VVT-i 72 pk~B
iQ|2009-2015|B
Yaris|2006-2026|1.0 VVT-i 72 pk~B;1.33 VVT-i 100 pk~B;1.5 Hybrid 116 pk~H;1.5 Hybrid 130 pk~H;GR Yaris 261 pk~B
Yaris Cross|2021-2026|1.5 Hybrid 116 pk~H;1.5 Hybrid 130 pk~H
Urban Cruiser|2020-2026|1.5 Hybrid 116 pk~H;Urban Cruiser EV~E
Auris|2006-2018|1.2 T~B;1.4 D-4D~D;1.8 Hybrid~H
Corolla|2006-2026|1.2 Turbo 116 pk~B;1.8 Hybrid 122 pk~H;2.0 Hybrid 196 pk~H;GR Corolla 304 pk~B
Avensis|2006-2018|BD
Camry|2006-2026|2.5 Hybrid~H;3.5 V6~B
Verso|2009-2018|BD
Prius|2006-2026|1.8 Hybrid~H;Plug-in~H;2.0 Hybrid 196 pk~H
Prius+|2012-2017|H
C-HR|2016-2026|1.2 Turbo~B;1.8 Hybrid 122 pk~H;2.0 Hybrid 184 pk~H;PHEV~H
RAV4|2006-2026|2.0 VVT-i~B;2.2 D-4D~D;2.5 Hybrid 222 pk~H;2.5 PHEV 306 pk~H
Highlander|2020-2026|H
Land Cruiser|2006-2026|2.8 D-4D~D;3.0 D-4D~D;4.0 V6~B
Hilux|2006-2026|2.4 D-4D 150 pk~D;2.8 D-4D 204 pk~D;3.0 D-4D 171 pk~D
Tundra|2007-2026|5.7 V8~B;3.4 i-Force Max hybride 437 pk~H
Proace City|2020-2026|DE
GT86|2012-2021|B
GR86|2022-2026|B
Supra|2019-2026|2.0 Turbo 258 pk~B;3.0 Turbo 340 pk~B;3.0 Turbo 387 pk~B
bZ4X|2022-2026|E`,
'Volkswagen':`Up!|2011-2023|1.0 MPI 60 pk~B;1.0 TSI 90 pk~B;e-Up! 83 pk~E
Fox|2006-2011|B
Polo|2006-2026|1.0 MPI 80 pk~B;1.0 TSI 95 pk~B;2.0 TSI GTI 207 pk~B;1.6 TDI 95 pk~D
Golf|2006-2026|1.0 TSI 110 pk~B;1.5 eTSI 130 pk~B;2.0 TSI GTI 245 pk~B;2.0 TSI R 320 pk~B;2.0 TDI 150 pk~D;1.4 TSI GTE 245 pk~H;e-Golf 136 pk~E
Jetta|2006-2018|BD
Scirocco|2008-2017|1.4 TSI 160 pk~B;2.0 TSI 210 pk~B;2.0 TDI 140 pk~D
Beetle|2011-2019|BD
Eos|2006-2015|BD
Passat|2006-2023|1.4 TSI 150 pk~B;2.0 TDI 150 pk~D;1.4 TSI GTE 218 pk~H
CC|2008-2017|BD
Arteon|2017-2024|2.0 TSI 190 pk~B;2.0 TDI 200 pk~D;eHybrid 218 pk~H
Phaeton|2006-2016|BD
Taigo|2021-2026|B
T-Cross|2019-2026|B
T-Roc|2017-2026|1.0 TSI 110 pk~B;1.5 TSI 150 pk~B;2.0 TDI 150 pk~D;T-Roc R 300 pk~B
Tiguan|2007-2026|1.4 TSI 150 pk~B;2.0 TSI 190 pk~B;2.0 TDI 150 pk~D;eHybrid 245 pk~H
Touareg|2006-2023|3.0 V6 TDI 286 pk~D;3.0 V6 TSI 340 pk~B;eHybrid 381 pk~H
Touran|2006-2026|BD
Sharan|2006-2022|BD
Caddy|2006-2026|BD
Amarok|2010-2022|D
ID.3|2020-2026|Pure 45 kWh~E;Pro 58 kWh~E;Pro S 77 kWh~E
ID.4|2021-2026|Pure 52 kWh~E;Pro 77 kWh~E;GTX 299 pk~E
ID.5|2022-2026|E
ID.7|2023-2026|Pro 77 kWh~E;Pro S 86 kWh~E
ID. Buzz|2022-2026|E`,
'Volvo':`C30|2007-2013|BD
C40|2022-2026|Recharge Single Motor~E;Recharge Twin~E
C70|2006-2013|BD
S40|2006-2012|BD
V50|2006-2012|BD
V40|2012-2019|BD
S60|2010-2026|T5~B;D4~D;T6 Recharge PHEV~H
V60|2010-2026|T4~B;D4~D;B4 mild hybrid~H;T6 Recharge PHEV~H
S80|2006-2016|BD
V70|2006-2016|BD
XC70|2007-2016|T6~B;D4~D
S90|2016-2026|BDH
V90|2016-2026|BDH
XC40|2018-2026|T3 163 pk~B;D3~D;B4 mild hybrid~H;T5 Recharge PHEV~H;Recharge Single Motor 231 pk~E;Recharge Twin 408 pk~E
XC60|2008-2026|T5~B;D4~D;B5 mild hybrid~H;T6 Recharge PHEV~H
XC90|2006-2026|T5~B;T6~B;D5~D;B5 mild hybrid~H;T8 Recharge PHEV 455 pk~H
EX30|2023-2026|Single Motor~E;Single Motor Extended Range~E;Twin Motor Performance~E
EX90|2023-2026|E
ES90|2025-2026|E`,
'Xpeng':`G6|2023-2026|E
G9|2023-2026|E`
};

