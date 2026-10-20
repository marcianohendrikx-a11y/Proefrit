/* Extra modellen: sportversies (M, AMG, RS, GTI, Type R, N, GR enzovoort), pick-ups en nieuwe merken. */
const ADD={
'BMW':`M2|2016-2026|M2 (F87) 370 pk~B;M2 Competition (F87) 410 pk~B;M2 CS (F87) 450 pk~B;M2 (G87) 460 pk~B
M3|2007-2026|M3 (E90/E92/E93) V8 420 pk~B;M3 (F80) 431 pk~B;M3 Competition (F80) 450 pk~B;M3 CS (F80) 460 pk~B;M3 (G80) 480 pk~B;M3 Competition (G80) 510 pk~B;M3 Touring (G81) 510 pk~B;M3 CS (G80) 550 pk~B
M4|2014-2026|M4 (F82) 431 pk~B;M4 Competition (F82) 450 pk~B;M4 GTS (F82) 500 pk~B;M4 CS (F82) 460 pk~B;M4 (G82) 480 pk~B;M4 Competition (G82) 510 pk~B;M4 CSL (G82) 550 pk~B;M4 CS (G82) 550 pk~B
M5|2006-2026|M5 (E60) V10 507 pk~B;M5 (F10) 560 pk~B;M5 Competition (F10) 575 pk~B;M5 (F90) 600 pk~B;M5 Competition (F90) 625 pk~B;M5 CS (F90) 635 pk~B;M5 (G90) PHEV 727 pk~H
M6|2006-2018|M6 (E63/E64) V10 507 pk~B;M6 (F12/F13) 560 pk~B;M6 Competition (F12/F13) 600 pk~B
M8|2019-2025|M8 600 pk~B;M8 Competition 625 pk~B
X3 M|2019-2024|X3 M (F97) 480 pk~B;X3 M Competition (F97) 510 pk~B
X4 M|2019-2021|X4 M (F98) 480 pk~B;X4 M Competition (F98) 510 pk~B
X5 M|2009-2026|X5 M (E70) 555 pk~B;X5 M (F85) 575 pk~B;X5 M (F95) 600 pk~B;X5 M Competition (F95) 625 pk~B
X6 M|2010-2026|X6 M (E71) 555 pk~B;X6 M (F86) 575 pk~B;X6 M (F96) 600 pk~B;X6 M Competition (F96) 625 pk~B
1M Coupé|2011-2012|1M Coupé 340 pk~B
Z4 M|2006-2008|Z4 M Coupé / Roadster 343 pk~B
M240i|2016-2026|M240i 340 pk~B;M240i xDrive 374 pk~B
M340i|2019-2026|M340i xDrive 374 pk~B
M440i|2020-2026|M440i xDrive 374 pk~B
M550i|2017-2026|M550i xDrive 462 pk~B;M550i xDrive 530 pk~B
i4 M50|2022-2026|M50 xDrive 544 pk~E`,
'Alpina':`B3|2006-2019|B
B4|2013-2021|B
B5|2006-2023|B
B7|2009-2022|B
D3|2008-2019|D
D5|2010-2023|D
XB7|2020-2026|B`,
'Mercedes-Benz':`A 35 AMG|2018-2026|A 35 AMG 306 pk~B
A 45 AMG|2013-2026|A 45 AMG (W176) 360 pk~B;A 45 AMG (W176) 381 pk~B;A 45 S AMG (W177) 421 pk~B
CLA 45 AMG|2013-2026|CLA 45 AMG 360 pk~B;CLA 45 AMG 381 pk~B;CLA 45 S AMG 421 pk~B
GLA 45 AMG|2014-2026|GLA 45 AMG 360 pk~B;GLA 45 AMG 381 pk~B;GLA 45 S AMG 421 pk~B
C 63 AMG|2007-2026|C 63 AMG (W204) 457 pk~B;C 63 S AMG (W204) 487 pk~B;C 63 AMG (W205) 476 pk~B;C 63 S AMG (W205) 510 pk~B;C 63 S E Performance PHEV 680 pk~H
E 63 AMG|2006-2026|E 63 AMG (W211) 514 pk~B;E 63 AMG (W212) 525 pk~B;E 63 S AMG (W212) 557 pk~B;E 63 AMG (W213) 571 pk~B;E 63 S AMG (W213) 612 pk~B
CLS 63 AMG|2006-2018|CLS 63 AMG (W219) 514 pk~B;CLS 63 AMG (C218) 525 pk~B;CLS 63 S AMG (C218) 557 pk~B
S 63 AMG|2006-2026|S 63 AMG (W221) 525 pk~B;S 63 AMG (W222) 585 pk~B;S 63 S E Performance PHEV 802 pk~H
SL 63 AMG|2006-2026|SL 63 AMG (R230) 525 pk~B;SL 63 AMG (R231) 585 pk~B;SL 63 AMG (R232) 585 pk~B
G 63 AMG|2012-2026|G 63 AMG 544 pk~B;G 63 AMG 585 pk~B
GLE 63 AMG|2015-2026|GLE 63 S AMG 585 pk~B
GLC 63 AMG|2018-2026|GLC 63 S AMG 510 pk~B;GLC 63 S E Performance PHEV 680 pk~H
GLS 63 AMG|2016-2026|GLS 63 AMG 585 pk~B
AMG GT 4-Door|2018-2026|AMG GT 63 S 639 pk~B;AMG GT 63 S E Performance PHEV 843 pk~H
CLK 63 AMG|2006-2010|CLK 63 AMG 481 pk~B;CLK 63 AMG Black Series 507 pk~B
SLR McLaren|2006-2009|SLR McLaren 626 pk~B
AMG ONE|2022-2023|1.6 V6 hybride 1063 pk~H`,
'Audi':`S1|2014-2018|S1 2.0 TFSI 231 pk~B
S3|2006-2026|S3 (8P) 265 pk~B;S3 (8V) 300 pk~B;S3 (8Y) 310 pk~B
S4|2006-2026|S4 (B7) 4.2 V8 344 pk~B;S4 (B8) 3.0 TFSI 333 pk~B;S4 (B9) 3.0 TFSI 354 pk~B;S4 (B9) 3.0 TDI 347 pk~D
S5|2007-2026|S5 (B8) 3.0 TFSI 333 pk~B;S5 (B9) 3.0 TFSI 354 pk~B;S5 (B9) 3.0 TDI 347 pk~D
S6|2006-2026|S6 (C6) 5.2 V10 435 pk~B;S6 (C7) 4.0 TFSI 420 pk~B;S6 (C8) 3.0 TDI 349 pk~D
SQ5|2013-2026|SQ5 3.0 TDI 313 pk~D;SQ5 3.0 TFSI 354 pk~B;SQ5 3.0 TDI 341 pk~D
SQ7|2016-2026|SQ7 4.0 TDI 435 pk~D;SQ7 4.0 TFSI 507 pk~B
SQ8|2019-2026|SQ8 4.0 TDI 435 pk~D;SQ8 4.0 TFSI 507 pk~B
RS 4 Avant|2006-2025|RS 4 (B7) 420 pk~B;RS 4 (B8) 450 pk~B;RS 4 (B9) 450 pk~B
RS 5|2010-2026|RS 5 (B8) 450 pk~B;RS 5 (B9) 450 pk~B
RS 6 Avant (C6)|2008-2010|RS 6 5.0 V10 580 pk~B
RS 7|2013-2026|RS 7 560 pk~B;RS 7 performance 605 pk~B;RS 7 (C8) 600 pk~B
RS Q3|2013-2026|RS Q3 340 pk~B;RS Q3 performance 367 pk~B;RS Q3 400 pk~B
RS Q8|2020-2026|RS Q8 600 pk~B
TT RS|2009-2023|TT RS 340 pk~B;TT RS 360 pk~B;TT RS 400 pk~B`,
'Volkswagen':`Golf GTI|2006-2026|GTI (Mk5) 200 pk~B;GTI (Mk6) 210 pk~B;GTI (Mk7) 220 pk~B;GTI Performance (Mk7) 230 pk~B;GTI Clubsport (Mk7) 265 pk~B;GTI (Mk8) 245 pk~B;GTI Clubsport (Mk8) 300 pk~B
Golf R|2006-2026|Golf R32 (Mk5) 250 pk~B;Golf R (Mk6) 270 pk~B;Golf R (Mk7) 300 pk~B;Golf R (Mk7) 310 pk~B;Golf R (Mk8) 320 pk~B
Golf GTD|2009-2026|GTD (Mk6) 170 pk~D;GTD (Mk7) 184 pk~D;GTD (Mk8) 200 pk~D
Golf GTE|2014-2026|1.4 TSI GTE 204 pk~H;1.4 TSI GTE 245 pk~H
Polo GTI|2010-2026|1.4 TSI GTI 180 pk~B;1.8 TSI GTI 192 pk~B;2.0 TSI GTI 200 pk~B
Up! GTI|2018-2020|1.0 TSI GTI 115 pk~B
Scirocco R|2009-2017|2.0 TSI R 265 pk~B
Arteon R|2020-2024|2.0 TSI R 320 pk~B
Tiguan R|2021-2026|2.0 TSI R 320 pk~B
Passat R36|2008-2010|3.6 V6 R36 300 pk~B`,
'Porsche':`911 GT3|2006-2026|GT3 (997) 415 pk~B;GT3 (997.2) 435 pk~B;GT3 (991) 475 pk~B;GT3 (991.2) 500 pk~B;GT3 (992) 510 pk~B
911 Turbo|2006-2026|Turbo (997) 480 pk~B;Turbo S (997) 530 pk~B;Turbo (991) 520 pk~B;Turbo S (991) 560 pk~B;Turbo (992) 580 pk~B;Turbo S (992) 650 pk~B
718 Cayman GT4|2015-2026|GT4 (981) 385 pk~B;GT4 (718) 420 pk~B;GT4 RS 500 pk~B`,
'Ford':`Focus ST|2006-2025|ST (Mk2) 225 pk~B;ST (Mk3) 250 pk~B;ST (Mk4) 280 pk~B
Focus RS|2009-2018|RS (Mk2) 305 pk~B;RS (Mk3) 350 pk~B
Fiesta ST|2006-2023|ST (Mk6) 150 pk~B;ST (Mk7) 182 pk~B;ST200 (Mk7) 200 pk~B;ST (Mk8) 200 pk~B
Mustang Shelby GT350|2015-2020|5.2 V8 GT350 526 pk~B
Mustang Mach 1|2021-2023|5.0 V8 Mach 1 480 pk~B
F-250|2006-2026|6.8 V10~B;6.2 V8~B;7.3 V8~B;6.4 Power Stroke diesel~D;6.7 Power Stroke diesel~D
F-350|2006-2026|6.8 V10~B;6.2 V8~B;7.3 V8~B;6.4 Power Stroke diesel~D;6.7 Power Stroke diesel~D
GT|2005-2022|5.4 V8 supercharged 550 pk~B;3.5 V6 EcoBoost 647 pk~B`,
'Chevrolet':`Silverado 2500HD|2006-2026|6.0 V8~B;6.6 V8~B;6.6 Duramax diesel~D`,
'GMC':`Sierra 2500HD|2006-2026|6.0 V8~B;6.6 V8~B;6.6 Duramax diesel~D
Hummer H2|2006-2009|6.0 V8~B;6.2 V8~B
Hummer H3|2006-2010|3.7 5-cilinder~B;5.3 V8~B`,
'Dodge':`Ram 2500 (2006-2010)|2006-2010|5.7 HEMI V8~B;5.9 Cummins turbodiesel~D;6.7 Cummins turbodiesel~D`,
'Cadillac':`CTS-V|2009-2019|6.2 V8 556 pk~B;6.2 V8 649 pk~B
ATS-V|2016-2019|3.6 V6 464 pk~B
CT5-V|2020-2026|3.0 V6 360 pk~B;CT5-V Blackwing 6.2 V8 668 pk~B`,
'Jeep':`Grand Cherokee SRT|2006-2021|SRT8 6.1 V8 425 pk~B;SRT 6.4 V8 468 pk~B;Trackhawk 6.2 V8 710 pk~B`,
'Honda':`Civic Type R|2007-2026|Type R (FN2) 2.0 i-VTEC 201 pk~B;Type R (FK2) 310 pk~B;Type R (FK8) 320 pk~B;Type R (FL5) 329 pk~B`,
'Hyundai':`i30 N|2017-2026|2.0 T-GDI N 250 pk~B;2.0 T-GDI N Performance 275 pk~B;2.0 T-GDI N 280 pk~B
i20 N|2021-2026|1.6 T-GDI N 204 pk~B
Kona N|2021-2026|2.0 T-GDI N 280 pk~B
Veloster N|2018-2022|2.0 T-GDI N 275 pk~B
Nexo|2018-2026|W`,
'Toyota':`GR Yaris|2020-2026|1.6 Turbo 261 pk~B;1.6 Turbo 280 pk~B
GR Corolla|2022-2026|1.6 Turbo 304 pk~B
Tacoma|2006-2026|2.7 4-cilinder~B;4.0 V6~B;3.5 V6~B;2.4 Turbo 278 pk~B;2.4 i-FORCE MAX hybride~H
Sequoia|2006-2026|5.7 V8~B;3.4 i-FORCE MAX hybride 437 pk~H
4Runner|2006-2026|4.0 V6~B
Land Cruiser Prado|2006-2023|2.8 D-4D~D;4.0 V6~B
Mirai|2015-2026|W`,
'Renault':`Megane RS|2006-2023|RS (Mk2) 225 pk~B;RS (Mk3) 250 pk~B;RS (Mk3) 265 pk~B;RS Trophy-R (Mk3) 275 pk~B;RS (Mk4) 280 pk~B;RS Trophy (Mk4) 300 pk~B
Clio RS|2006-2019|RS (Mk3) 197 pk~B;RS (Mk4) 200 pk~B;RS Trophy (Mk4) 220 pk~B
Twingo RS|2008-2013|1.6 RS 133 pk~B`,
'Seat':`Leon Cupra|2007-2018|Cupra (Mk2) 240 pk~B;Cupra R (Mk2) 265 pk~B;Cupra (Mk3) 265 pk~B;Cupra (Mk3) 290 pk~B;Cupra (Mk3) 300 pk~B;Cupra R (Mk3) 310 pk~B
Ibiza Cupra|2006-2017|1.4 TSI Cupra 180 pk~B;1.8 TSI Cupra 192 pk~B`,
'Opel':`Astra OPC|2006-2018|Astra OPC (H) 240 pk~B;Astra OPC (J) 280 pk~B
Corsa OPC|2007-2018|Corsa OPC (D) 192 pk~B;Corsa OPC Nürburgring (D) 207 pk~B;Corsa OPC (E) 207 pk~B
Insignia OPC|2009-2017|2.8 V6 Turbo OPC 325 pk~B`,
'Mini':`John Cooper Works|2008-2026|JCW (R56) 211 pk~B;JCW (F56) 231 pk~B;JCW (F56) 306 pk GP~B;JCW Electric 258 pk~E`,
'Škoda':`Octavia RS|2006-2026|2.0 TFSI RS 200 pk~B;2.0 TSI RS 220 pk~B;2.0 TSI RS 245 pk~B;2.0 TDI RS 184 pk~D;1.4 iV PHEV RS 245 pk~H
Kodiaq RS|2018-2023|2.0 TSI RS 245 pk~B;2.0 BiTDI RS 240 pk~D`,
'Alfa Romeo':`Giulia Quadrifoglio|2016-2026|2.9 V6 Quadrifoglio 510 pk~B
Stelvio Quadrifoglio|2017-2026|2.9 V6 Quadrifoglio 510 pk~B
147 GTA|2006-2010|3.2 V6 GTA 250 pk~B`,
'Subaru':`WRX STI|2006-2021|WRX STI 2.5 Turbo 300 pk~B;WRX STI 2.5 Turbo 308 pk~B`,
'Lexus':`IS F|2008-2014|5.0 V8 423 pk~B
RC F|2014-2026|5.0 V8 477 pk~B
GS F|2016-2020|5.0 V8 477 pk~B`,
'Jaguar':`XFR|2009-2015|5.0 V8 SC XFR 510 pk~B;5.0 V8 SC XFR-S 550 pk~B
XJR|2006-2019|4.2 V8 SC 400 pk~B;5.0 V8 SC 510 pk~B;5.0 V8 SC 550 pk~B`,
'Suzuki':`Swift Sport|2006-2026|1.6 Sport 125 pk~B;1.6 Sport 136 pk~B;1.4 Boosterjet Sport 140 pk~B;1.4 Boosterjet Sport Hybrid 129 pk~H`,
'Lucid':`Air|2021-2026|E`,
'Rivian':`R1T|2022-2026|E
R1S|2022-2026|E`,
'Zeekr':`001|2023-2026|E
X|2024-2026|E
7X|2025-2026|E`,
'NIO':`ET5|2022-2026|E
ET7|2022-2026|E
EL7|2024-2026|E`,
'Leapmotor':`T03|2021-2026|E
C10|2024-2026|E`,
'ORA':`Funky Cat|2023-2026|E`,
'VinFast':`VF 3|2024-2026|E
VF 8|2023-2026|E
VF 9|2023-2026|E`,
'Aiways':`U5|2020-2023|E
U6|2022-2023|E`,
'Lada':`Niva|2006-2026|B`,
'INEOS':`Grenadier|2023-2026|3.0 Turbo benzine 286 pk~B;3.0 Turbo diesel 249 pk~D`,
'Fisker':`Ocean|2023-2024|E`
};
Object.keys(ADD).forEach(b=>{RAW[b]=(RAW[b]?RAW[b]+'\n':'')+ADD[b]});

