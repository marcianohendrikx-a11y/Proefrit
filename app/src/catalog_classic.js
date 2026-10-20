/* ===== Klassiekers en oudere modellen (eigen samenstelling: modelnamen en productiejaren).
   Formaat: Model|van-tot|brandstoffen|carrosserie ===== */
const CLASSIC={
'Alfa Romeo':`Giulietta (1954)|1954-1965|B|S
Giulia (1962)|1962-1978|B|S
Spider|1966-2010|B|R
Alfasud|1972-1989|B|H
Alfetta|1972-1987|BD|S
Sprint|1976-1989|B|C
33|1983-1995|BD|H
75|1985-1992|BD|S
164|1987-1998|BD|S
SZ|1989-1991|B|C
155|1992-1998|BD|S
145|1994-2001|BD|H
146|1994-2001|BD|H
GTV|1995-2005|B|C
156|1997-2007|BD|S
166|1998-2007|BD|S
GT|2003-2010|BD|C
8C Competizione|2007-2010|B|C`,
'Audi':`50|1974-1978|B|H
80|1966-1996|BD|S
100|1968-1994|BD|S
200|1979-1991|B|S
Quattro|1980-1991|B|C
Coupé|1980-1996|B|C
90|1984-1991|B|S
V8|1988-1994|B|S
Cabriolet|1991-2000|B|R
RS 2 Avant|1994-1995|B|W
A2|1999-2005|BD|H
Allroad|2000-2005|BD|W`,
'BMW':`Isetta|1955-1962|B|K
700|1959-1965|B|S
Neue Klasse (1500-2000)|1962-1972|B|S
02-serie (2002)|1966-1977|B|S
3.0 CSL|1971-1975|B|C
M1|1978-1981|B|C
Z1|1989-1991|B|R
Z3|1995-2002|B|R
Z8|2000-2003|B|R
i8|2014-2020|i8 eDrive plug-in hybrid~H|C`,
'Bentley':`Turbo R|1985-1997|B|S
Azure|1995-2009|B|R
Arnage|1998-2009|B|S
Mulsanne|1980-2020|B|S
Brooklands|2008-2011|B|C`,
'Bugatti':`EB110|1991-1995|B|C
Divo|2018-2021|B|C`,
'Cadillac':`Fleetwood|1947-1996|B|S
DeVille|1949-2005|B|S
Eldorado|1953-2002|B|C
Seville|1975-2004|B|S
Allanté|1987-1993|B|R
SRX|2003-2016|B|U
XLR|2003-2009|B|R
STS|2004-2011|B|S
BLS|2006-2010|BD|S`,
'Chevrolet':`Bel Air|1950-1981|B|S
Impala|1958-2020|B|S
El Camino|1959-1987|B|P
Corvair|1960-1969|B|C
Nova|1962-1988|B|S
Chevelle|1964-1977|B|C
Malibu|1964-2024|B|S
Caprice|1965-1996|B|S
S-10|1982-2004|B|P
Astro|1985-2005|B|V
Express|1996-2026|BD|V
Avalanche|2001-2013|B|P
SSR|2003-2006|B|P
Kalos|2005-2008|B|H
Matiz|2005-2010|B|H
Lacetti|2005-2009|BD|H
Nubira|2005-2009|BD|S
HHR|2005-2011|B|W
Epica|2006-2011|BD|S
Orlando|2010-2015|BD|M
Trax|2012-2026|BD|U`,
'Chrysler':`300M|1998-2004|B|S
Stratus|1995-2006|B|S
Neon|1994-2005|B|S
Crossfire|2003-2008|B|C`,
'Citroën':`Traction Avant|1934-1957|B|S
H-bus (HY)|1947-1981|B|V
2CV|1948-1990|B|K
DS|1955-1975|B|S
ID|1957-1975|B|S
Ami (1961)|1961-1978|B|S
Dyane|1967-1983|B|H
Méhari|1968-1988|B|R
GS|1970-1986|B|S
SM|1970-1975|B|C
CX|1974-1991|BD|S
Visa|1978-1988|BD|H
GSA|1979-1986|B|H
BX|1982-1994|BD|H
LNA|1982-1986|B|K
AX|1986-1998|BD|H
XM|1989-2000|BD|S
ZX|1991-1998|BD|H
Xantia|1993-2001|BD|S
Jumper|1994-2026|DE|V
Evasion|1994-2002|BD|M
Jumpy|1995-2026|DE|V
Saxo|1996-2003|BD|H
Xsara|1997-2006|BD|H
Xsara Picasso|1999-2010|BD|M
C2|2003-2009|BD|H
C6|2005-2012|BD|S`,
'Dacia':`1300|1969-2004|B|S
Nova|1995-2000|B|H
Solenza|2003-2005|B|S`,
'Daihatsu':`Charade|1977-2013|BD|H
Domino|1980-1990|B|K
Rocky|1984-2002|BD|X
Feroza|1988-1998|B|X
Applause|1989-2000|B|H
Move|1995-2026|B|K
Gran Move|1996-2002|B|M
YRV|2000-2005|B|H
Copen|2002-2026|B|R
Materia|2006-2012|B|M
Trevis|2006-2011|B|K`,
'Dodge':`Coronet|1949-1976|B|S
Dart|1960-1976|B|S
Caravan|1984-2020|B|M
Dakota|1987-2011|B|P
Stealth|1991-1996|B|C
Avenger|1994-2014|B|S
Neon|1994-2005|B|S
Magnum|2004-2008|B|W`,
'Ferrari':`250 GT|1954-1964|B|C
Dino 246|1969-1974|B|C
308|1975-1985|B|C
400/412|1976-1989|B|C
Mondial|1980-1993|B|C
Testarossa|1984-1996|B|C
328|1985-1989|B|C
F40|1987-1992|B|C
348|1989-1995|B|C
456|1992-2003|B|C
F355|1994-1999|B|C
F50|1995-1997|B|C
550 Maranello|1996-2002|B|C
360|1999-2005|B|C
575M|2002-2006|B|C
Enzo|2002-2004|B|C
612 Scaglietti|2004-2011|B|C
GTC4Lusso|2016-2020|B|C
Daytona SP3|2022-2026|B|C`,
'Fiat':`500 (klassiek)|1957-1975|B|K
600 (klassiek)|1955-1969|B|K
124 Sport Spider|1966-1985|B|R
Dino|1966-1973|B|C
128|1969-1985|B|S
127|1971-1983|B|H
X1/9|1972-1989|B|R
126|1972-2000|B|K
132|1972-1981|B|S
131|1974-1984|BD|S
Fiorino|1977-2023|BD|V
Ritmo|1978-1988|BD|H
Ducato|1981-2026|DE|V
Uno|1983-1995|BD|H
Regata|1983-1990|BD|S
Croma|1985-2010|BD|S
Tempra|1990-1998|BD|S
Cinquecento|1991-1998|B|K
Coupé|1993-2000|B|C
Ulysse|1994-2010|BD|M
Brava|1995-2001|BD|H
Barchetta|1995-2005|B|R
Marea|1996-2002|BD|S
Palio|1996-2017|BD|H
Strada|1996-2026|BD|P
Seicento|1998-2010|B|K
Multipla|1998-2010|BD|M
Stilo|2001-2007|BD|H
Idea|2003-2012|BD|M
Fullback|2016-2019|D|P`,
'Ford':`Model T|1908-1927|B|S
Model A|1927-1931|B|S
Thunderbird|1955-2005|B|C
Anglia|1959-1968|B|S
Econoline|1961-2026|BD|V
Cortina|1962-1982|B|S
Transit|1965-2026|DEH|V
Capri (klassiek)|1969-1986|B|C
Escort|1968-2002|BD|H
Taunus|1970-1982|B|S
Granada|1972-1985|BD|S
Sierra|1982-1993|BD|S
Orion|1983-1993|BD|S
RS200|1984-1986|B|C
Scorpio|1985-1998|BD|S
Sierra RS Cosworth|1986-1992|B|S
Taurus|1986-2019|B|S
Probe|1988-1997|B|C
Crown Victoria|1992-2012|B|S
Escort RS Cosworth|1992-1996|B|H
Maverick (1993)|1993-1998|BD|U
Expedition|1996-2026|B|U
Puma (1997)|1997-2002|B|C
Cougar|1998-2002|B|C
Excursion|1999-2005|BD|U
Fusion|2002-2012|BD|H
Transit Connect|2002-2026|DE|V
StreetKa|2003-2005|B|R
Tourneo Custom|2012-2026|DEH|V`,
'GMC':`Hummer H1|1992-2006|BD|X`,
'Honda':`CRX|1983-1991|B|C
Integra|1985-2006|B|C
Legend|1985-2012|B|S
Concerto|1988-1994|B|H
Beat|1991-1996|B|R
Shuttle|1994-2000|B|M
Odyssey|1994-2026|B|M
Logo|1996-2001|B|H
Stream|2000-2014|BD|M
Pilot|2002-2026|B|U
Element|2003-2011|B|U
Ridgeline|2005-2026|B|P`,
'Hyundai':`Pony|1975-1990|B|H
Excel|1985-2000|B|H
Sonata|1985-2026|BH|S
Grandeur|1986-2026|BH|S
Elantra|1990-2026|BDH|S
Galloper|1991-2003|BD|X
Accent|1994-2026|BD|H
Coupé|1996-2009|B|C
Atos|1997-2008|B|H
H-1|1997-2021|D|V
Trajet|1999-2008|BD|M
Terracan|2001-2007|D|U`,
'Infiniti':`G|2002-2015|BD|S
M|2002-2013|BDH|S
FX|2003-2013|B|U
EX|2007-2013|BD|U`,
'Isuzu':`Gemini|1974-2000|B|S
Trooper|1981-2005|BD|X
Piazza|1981-1993|B|C
Rodeo|1988-2004|BD|P
VehiCROSS|1997-2001|B|U`,
'Jaguar':`XK120|1948-1954|B|R
Mk2|1959-1967|B|S
E-Type|1961-1975|B|C
XJS|1975-1996|B|C
XJ220|1992-1994|B|C
S-Type|1999-2008|BD|S
X-Type|2001-2009|BD|S`,
'Jeep':`Willys MB|1941-1945|B|X
CJ|1945-1986|B|X
Wagoneer|1963-1991|B|U
Comanche|1985-1992|B|P`,
'Kia':`Pride|1987-2000|B|H
Sephia|1992-2003|B|S
Clarus|1995-2001|B|S
Shuma|1997-2004|B|H
Retona|1998-2003|D|X
Joice|1999-2003|B|M
Magentis|2000-2010|BD|S
Cerato|2003-2026|BD|S
Opirus|2003-2011|B|S`,
'Lada':`2101-2107 (Zjigoeli)|1970-2012|B|S
Samara|1984-2013|B|H
110|1995-2009|B|S
Kalina|2004-2018|B|H
Granta|2011-2026|B|S
Vesta|2015-2026|B|S`,
'Lamborghini':`Miura|1966-1973|B|C
Espada|1968-1978|B|C
Urraco|1973-1979|B|C
Countach|1974-1990|B|C
Jalpa|1981-1988|B|C
LM002|1986-1993|B|X
Diablo|1990-2001|B|C`,
'Lancia':`Aurelia|1950-1958|B|S
Appia|1953-1963|B|S
Fulvia|1963-1976|B|C
Beta|1972-1984|B|S
Stratos|1973-1978|B|C
Gamma|1976-1984|B|S
Prisma|1982-1989|BD|S
037|1982-1983|B|C
Y10|1985-1995|B|K
Thema|1984-2014|BD|S
Dedra|1989-1999|BD|S
Kappa|1994-2001|BD|S
Zeta|1994-2002|BD|M
Lybra|1999-2005|BD|S
Thesis|2002-2009|BD|S
Phedra|2002-2010|BD|M
Musa|2004-2012|BD|M
Voyager|2011-2015|D|M`,
'Land Rover':`Series I, II en III|1948-1985|BD|X`,
'Lexus':`SC|1991-2010|B|C
HS|2009-2012|H|S`,
'Lotus':`Seven|1957-1972|B|R
Elan|1962-1995|B|R
Europa|1966-1975|B|C
Esprit|1976-2004|B|C
Emeya|2024-2026|E|S`,
'MG':`MGA|1955-1962|B|R
Midget|1961-1979|B|R
MGB|1962-1980|B|R
MG F / TF|1995-2011|B|R
ZR|2001-2005|BD|H
ZT|2001-2005|BD|S
MG6|2011-2016|BD|H`,
'Maserati':`Bora|1971-1978|B|C
Merak|1972-1983|B|C
Biturbo|1981-1994|B|C
Shamal|1990-1996|B|C
3200 GT|1998-2002|B|C
Spyder|2001-2007|B|R
Coupé|2002-2007|B|C
MC12|2004-2005|B|C`,
'Mazda':`B-serie|1961-2006|BD|P
929|1973-1997|B|S
323|1977-2003|BD|H
RX-7|1978-2002|B|C
626|1979-2002|BD|S
MX-6|1987-1997|B|C
121|1987-2003|B|H
MX-3|1991-1998|B|C
Xedos 6|1992-1999|B|S
Xedos 9|1993-2002|B|S
Demio|1996-2002|B|H
Premacy|1999-2005|BD|M
Tribute|2000-2011|B|U
BT-50|2006-2026|D|P
CX-9|2006-2023|B|U`,
'McLaren':`F1|1992-1998|B|C
P1|2013-2015|H|C
650S|2014-2017|B|C
Senna|2018-2019|B|C
750S|2023-2026|B|C`,
'Mercedes-Benz':`Ponton|1953-1962|BD|S
300 SL|1954-1963|B|C
Heckflosse|1959-1968|BD|S
Pagode (W113)|1963-1971|B|R
/8 (W114/W115)|1968-1976|BD|S
W123|1976-1986|BD|S
190 (W201)|1982-1993|BD|S
W124|1984-1995|BD|S
Sprinter|1995-2026|DE|V
Vito|1996-2026|DE|V
CLC|2008-2011|BD|C
Citan|2012-2026|DE|V
X-Klasse|2017-2020|D|P`,
'Mini':`Mini (klassiek)|1959-2000|B|K
Mini Moke|1964-1993|B|R`,
'Mitsubishi':`Galant|1969-2012|BD|S
Celeste|1975-1981|B|C
Sigma|1976-1996|B|S
Mirage|1978-2026|B|H
Starion|1982-1990|B|C
Space Wagon|1983-2004|BD|M
Eclipse|1989-2012|B|C
3000GT|1990-2000|B|C
Space Runner|1991-2002|B|M
Carisma|1995-2004|BD|S
Pajero Pinin|1999-2007|B|U
Grandis|2003-2011|BD|M`,
'Nissan':`Patrol (klassiek)|1951-1980|BD|X
Bluebird|1955-2001|BD|S
Silvia|1965-2002|B|C
Sunny|1966-2006|BD|S
Laurel|1968-2002|B|S
Skyline GT-R|1969-2002|B|C
Cherry|1970-1986|B|H
Stanza|1977-1992|B|S
Maxima|1981-2026|B|S
Prairie|1981-1998|B|M
Sentra|1982-2026|B|S
300ZX|1983-2000|B|C
Terrano|1986-2006|BD|U
200SX|1988-2002|B|C
100NX|1990-1996|B|C
Primera|1990-2007|BD|S
Serena|1991-2026|BD|M
Altima|1992-2026|B|S
Almera|1995-2006|BD|H
Frontier|1997-2026|BD|P
Cube|1998-2019|B|M
Xterra|1999-2015|B|U
Armada|2003-2026|B|U
Titan|2003-2024|BD|P
Pixo|2009-2013|B|H
NV200|2009-2021|DE|V`,
'Opel':`Olympia|1935-1970|B|S
Kapitän|1938-1970|B|S
Rekord|1953-1986|BD|S
Kadett|1962-1991|BD|H
Admiral|1964-1977|B|S
Diplomat|1964-1977|B|S
Commodore|1967-1982|B|S
GT|1968-1973|B|C
Ascona|1970-1988|BD|S
Manta|1970-1988|B|C
Monza|1977-1986|B|C
Senator|1978-1993|B|S
Omega|1986-2003|BD|S
Vectra|1988-2008|BD|S
Calibra|1989-1997|B|C
Tigra|1994-2009|B|C
Sintra|1996-1999|BD|M
Movano|1998-2026|DE|V
Speedster|2000-2005|B|R
Vivaro|2001-2026|DE|V
Signum|2003-2008|BD|H
GT (2007)|2007-2009|B|R`,
'Peugeot':`403|1955-1966|B|S
404|1960-1975|BD|S
204|1965-1976|B|S
504|1968-1983|BD|S
304|1969-1980|B|S
104|1972-1988|B|H
604|1975-1985|B|S
305|1977-1989|BD|S
505|1979-1992|BD|S
205|1983-1998|BD|H
309|1985-1993|BD|H
405|1987-1997|BD|S
605|1989-1999|BD|S
106|1991-2003|BD|H
306|1993-2002|BD|H
806|1994-2002|BD|M
Boxer|1994-2026|DE|V
406|1995-2004|BD|S
Expert|1995-2026|DE|V
206|1998-2012|BD|H
607|1999-2010|BD|S
307|2001-2008|BD|H
807|2002-2014|BD|M
1007|2004-2009|BD|H
4007|2007-2012|BD|U
Bipper|2008-2017|D|V`,
'Porsche':`356|1948-1965|B|C
912|1965-1969|B|C
914|1969-1976|B|R
924|1976-1988|B|C
928|1977-1995|B|C
944|1982-1991|B|C
959|1986-1993|B|C
968|1991-1995|B|C
Boxster|1996-2016|B|R
Carrera GT|2004-2007|B|R
Cayman|2005-2016|B|C`,
'Renault':`4CV|1947-1961|B|S
Dauphine|1956-1967|B|S
4|1961-1994|B|H
16|1965-1980|B|H
6|1968-1980|B|H
12|1969-1980|B|S
5|1972-1996|BD|H
20|1975-1984|BD|H
30|1975-1984|B|H
14|1976-1983|B|H
18|1978-1986|BD|S
Fuego|1980-1992|BD|C
Trafic|1980-2026|DE|V
Master|1980-2026|DE|V
R5 Turbo|1980-1986|B|H
9|1981-1989|BD|S
11|1981-1989|BD|H
25|1983-1992|BD|S
Express|1985-2000|BD|V
21|1986-1995|BD|S
19|1988-2000|BD|H
Safrane|1992-2000|BD|S
Spider|1996-1999|B|R
Clio V6|2001-2005|B|H
Avantime|2001-2003|BD|C
Vel Satis|2002-2009|BD|S`,
'Rolls-Royce':`Silver Cloud|1955-1966|B|S
Silver Shadow|1965-1980|B|S
Corniche|1971-1995|B|R
Silver Spirit|1980-1998|B|S
Silver Seraph|1998-2002|B|S`,
'Saab':`92|1949-1956|B|S
93|1955-1960|B|S
95|1959-1978|B|W
96|1960-1980|B|S
Sonett|1966-1974|B|C
99|1968-1984|B|S
900|1978-1998|B|H
9000|1984-1998|B|H
9-7X|2004-2008|B|U
9-2X|2004-2006|B|H`,
'Seat':`600|1957-1973|B|K
Fura|1981-1986|B|H
Ronda|1982-1986|B|H
Malaga|1985-1992|B|S
Marbella|1986-1998|B|K
Cordoba|1993-2009|BD|S
Inca|1995-2003|BD|V
Arosa|1997-2004|BD|H`,
'Smart':`Crossblade|2002-2003|B|R
Roadster|2003-2006|B|R`,
'SsangYong':`Rodius|2004-2019|D|M
Actyon|2005-2018|D|U`,
'Subaru':`Leone|1971-1994|B|S
Justy|1984-2011|B|H
XT|1985-1991|B|C
SVX|1991-1996|B|C
Vivio|1992-1998|B|K
Baja|2002-2006|B|P
Tribeca|2005-2014|B|U
Trezia|2011-2016|BD|M`,
'Suzuki':`Carry|1961-2026|B|V
SJ / Samurai|1981-2004|B|X
Cappuccino|1991-1998|B|R
X-90|1995-1998|B|U
Wagon R+|1997-2008|B|M
Liana|2001-2007|BD|H`,
'Toyota':`Crown|1955-2026|BH|S
Corona|1957-2001|B|S
2000GT|1967-1970|B|C
Hiace|1967-2026|BD|V
Celica|1970-2006|B|C
Carina|1970-2001|BD|S
Starlet|1973-1999|B|H
Cressida|1976-1992|B|S
Tercel|1978-1999|B|H
MR2|1984-2007|B|R
Previa|1990-2019|B|M
Paseo|1991-1999|B|C
Avalon|1994-2022|BH|S
Picnic|1996-2001|BD|M
Sienna|1997-2026|BH|M
Solara|1998-2008|B|C
Echo|1999-2005|B|H
Yaris Verso|1999-2005|BD|M
Corolla Verso|2001-2009|BD|M
Matrix|2002-2014|B|H
FJ Cruiser|2006-2022|B|X
Venza|2008-2026|BH|U
Proace|2013-2026|DE|V`,
'Volkswagen':`Kever|1938-2003|B|K
Transporter|1950-2026|BDE|V
Karmann Ghia|1955-1974|B|C
Type 3 (1500/1600)|1961-1973|B|S
412|1968-1974|B|S
K70|1970-1975|B|S
LT|1975-2006|BD|V
Derby|1977-1981|B|S
Iltis|1978-1988|B|X
Santana|1981-1984|B|S
Multivan|1985-2026|BDH|V
Corrado|1988-1995|B|C
Vento|1992-1998|BD|S
Bora|1998-2005|BD|S
Lupo|1998-2005|BD|H
Crafter|2006-2026|DE|V`,
'Volvo':`PV444/544|1944-1965|B|S
Amazon|1956-1970|B|S
P1800|1961-1973|B|C
140-serie|1966-1974|B|S
240|1974-1993|BD|S
260|1974-1982|B|S
66|1975-1980|B|S
340|1976-1991|BD|H
360|1982-1991|B|H
760|1982-1992|BD|S
740|1984-1992|BD|S
480|1986-1995|B|C
440|1987-1996|BD|H
460|1988-1996|BD|S
940|1990-1998|BD|S
960|1990-1998|B|S
850|1991-1997|BD|S
S70|1996-2000|BD|S`,
'Škoda':`1000 MB|1964-1969|B|S
105/120|1976-1990|B|S
Favorit|1987-1994|B|H
Forman|1991-1995|B|W
Felicia|1994-2001|BD|H`,
/* nieuwe merken: verdwenen, klassiek, Nederlands of klein */
'DAF':`600|1959-1963|B|S
750 / Daffodil|1961-1967|B|S
44|1966-1975|B|S
33|1967-1975|B|S
55|1968-1972|B|S
66|1972-1975|B|S`,
'Spyker':`C8|2000-2014|B|C
C12|2006-2009|B|C
C8 Preliator|2016-2020|B|C`,
'Donkervoort':`S7|1978-1984|B|R
D8|1993-2020|B|R
D8 GTO|2011-2020|B|R
F22|2022-2026|B|R`,
'Lightyear':`0|2022-2023|E|S`,
'Trabant':`P50|1957-1962|B|S
601|1964-1990|B|S
1.1|1990-1991|B|S`,
'Wartburg':`311|1956-1965|B|S
353|1966-1991|B|S`,
'Simca':`Aronde|1951-1964|B|S
1000|1961-1978|B|S
1300/1500|1963-1976|B|S
1100|1967-1982|B|H
1307/1308|1975-1979|B|H`,
'Talbot':`Horizon|1977-1985|BD|H
Solara|1980-1986|B|S
Tagora|1980-1984|B|S
Samba|1981-1986|B|H`,
'Matra':`Bagheera|1973-1980|B|C
Rancho|1977-1984|B|U
Murena|1980-1984|B|C`,
'Austin':`Mini|1959-1988|B|K
Maxi|1969-1981|B|H
Allegro|1973-1982|B|S
Metro|1980-1990|B|H
Maestro|1983-1994|BD|H
Montego|1984-1994|BD|S`,
'Austin-Healey':`100|1953-1956|B|R
Sprite|1958-1971|B|R
3000|1959-1967|B|R`,
'Morris':`Minor|1948-1971|B|S
Marina|1971-1980|B|S`,
'Triumph':`Herald|1959-1971|B|S
Spitfire|1962-1980|B|R
GT6|1966-1973|B|C
TR6|1968-1976|B|R
Stag|1970-1978|B|R
Dolomite|1972-1980|B|S
TR7|1975-1981|B|C
Acclaim|1981-1984|B|S`,
'Rover':`P6|1963-1977|B|S
SD1|1976-1986|B|H
200|1984-1999|BD|H
800|1986-1999|BD|S
100|1990-1998|BD|H
400|1990-1999|BD|H
600|1993-1999|BD|S
75|1998-2005|BD|S
25|1999-2005|BD|H
45|1999-2005|BD|H
CityRover|2003-2005|B|H
Streetwise|2003-2005|BD|H`,
'Hillman':`Minx|1932-1970|B|S
Imp|1963-1976|B|S
Avenger|1970-1981|B|S`,
'Sunbeam':`Alpine|1959-1968|B|R
Tiger|1964-1967|B|R`,
'Jensen':`Interceptor|1966-1976|B|C`,
'AC':`Cobra|1962-1967|B|R`,
'Morgan':`4/4|1936-2019|B|R
Plus 4|1950-2026|B|R
Aero 8|2001-2018|B|R
3 Wheeler / Super 3|2011-2026|B|R
Plus Six|2019-2026|B|R`,
'Caterham':`Seven|1973-2026|B|R`,
'TVR':`Griffith|1991-2002|B|R
Chimaera|1992-2003|B|R
Cerbera|1996-2003|B|C
Tuscan|1999-2006|B|C
Sagaris|2005-2006|B|C`,
'Daewoo':`Espero|1990-1999|B|S
Nexia|1994-1997|B|H
Lanos|1997-2002|B|H
Nubira|1997-2004|BD|S
Leganza|1997-2002|B|S
Matiz|1998-2008|B|H
Tacuma|2000-2004|B|M
Kalos|2002-2004|B|H
Evanda|2002-2004|B|S
Lacetti|2003-2004|BD|H`,
'Datsun':`Fairlady|1959-1970|B|R
240Z / 260Z / 280Z|1969-1978|B|C`,
'NSU':`Prinz|1958-1973|B|S
TT|1965-1972|B|S
Ro 80|1967-1977|B|S`,
'Borgward':`Isabella|1954-1961|B|S`,
'Messerschmitt':`KR200|1955-1964|B|K`,
'Autobianchi':`A112|1969-1986|B|H`,
'De Tomaso':`Pantera|1971-1992|B|C`,
'DeLorean':`DMC-12|1981-1983|B|C`,
'Maybach':`57 / 62|2002-2013|B|S`,
'Moskvitsj':`412|1967-1998|B|S`,
'FSO':`125p|1967-1991|B|S
Polonez|1978-2002|B|H`,
'Zastava':`Yugo Koral|1980-2008|B|H`,
'Proton':`Persona|1993-2026|B|S
Wira|1993-2009|B|S
Satria|1994-2005|B|H
Impian|2001-2009|B|S
Gen-2|2004-2012|B|H
Savvy|2005-2011|B|H`,
'Tata':`Indica|1998-2018|BD|H
Nano|2008-2018|B|K`,
'Mahindra':`Goa|2006-2015|D|U
XUV500|2011-2021|D|U`,
'Great Wall':`Hover|2005-2015|BD|U
Steed|2006-2018|D|P`,
'Omoda':`5|2024-2026|BE|U`,
'Jaecoo':`7|2024-2026|BH|U`,
'Aixam':`City|1997-2026|DE|K`,
'Ligier':`JS50|2013-2026|DE|K`,
'Microcar':`M.Go|2008-2026|D|K`
};

/* Bestaande modellen die al vóór 2006 bestonden: echt eerste productiejaar van de modelnaam */
const FROM={
 'Volkswagen|Golf':1974,'Volkswagen|Polo':1975,'Volkswagen|Passat':1973,'Volkswagen|Jetta':1979,'Volkswagen|Scirocco':1974,'Volkswagen|Beetle':1997,'Volkswagen|Touareg':2002,'Volkswagen|Touran':2003,'Volkswagen|Sharan':1995,'Volkswagen|Caddy':1980,'Volkswagen|Phaeton':2002,'Volkswagen|Golf GTI':1976,'Volkswagen|Golf GTD':1982,'Volkswagen|Polo GTI':1998,
 'Audi|A3':1996,'Audi|A4':1994,'Audi|A6':1994,'Audi|A8':1994,'Audi|TT':1998,'Audi|S3':1999,'Audi|S4':1991,'Audi|S6':1994,'Audi|RS 4 Avant':2000,'Audi|Q7':2005,
 'BMW|3-serie':1975,'BMW|5-serie':1972,'BMW|6-serie':1976,'BMW|7-serie':1977,'BMW|8-serie':1989,'BMW|1-serie':2004,'BMW|X5':1999,'BMW|X3':2003,'BMW|Z4':2002,'BMW|M3':1986,'BMW|M5':1984,'BMW|M6':1983,
 'Mercedes-Benz|C-Klasse':1993,'Mercedes-Benz|E-Klasse':1993,'Mercedes-Benz|S-Klasse':1972,'Mercedes-Benz|SL':1954,'Mercedes-Benz|SLK':1996,'Mercedes-Benz|CLK':1997,'Mercedes-Benz|A-Klasse':1997,'Mercedes-Benz|M-Klasse':1997,'Mercedes-Benz|G-Klasse':1979,'Mercedes-Benz|V-Klasse':1996,'Mercedes-Benz|CLS':2004,'Mercedes-Benz|B-Klasse':2005,
 'Opel|Corsa':1982,'Opel|Astra':1991,'Opel|Zafira':1999,'Opel|Meriva':2003,'Opel|Agila':2000,'Opel|Combo':1986,
 'Ford|Fiesta':1976,'Ford|Focus':1998,'Ford|Mondeo':1993,'Ford|Ka':1996,'Ford|Galaxy':1995,'Ford|Mustang':1964,'Ford|F-150':1975,'Ford|Explorer':1990,'Ford|Focus ST':2002,'Ford|Focus RS':2002,'Ford|Fiesta ST':2004,'Ford|C-Max':2003,'Ford|Ranger':1983,'Ford|GT':2004,
 'Renault|Clio':1990,'Renault|Twingo':1993,'Renault|Megane':1995,'Renault|Scenic':1996,'Renault|Laguna':1993,'Renault|Espace':1984,'Renault|Kangoo':1997,'Renault|Modus':2004,'Renault|Megane RS':2004,'Renault|Clio RS':1999,
 'Peugeot|107':2005,'Peugeot|407':2004,'Peugeot|Partner':1996,
 'Citroën|C1':2005,'Citroën|C3':2002,'Citroën|C4':2004,'Citroën|C5':2001,'Citroën|C8':2002,'Citroën|Berlingo':1996,
 'Fiat|Panda':1980,'Fiat|Punto':1993,'Fiat|Doblò':2000,
 'Toyota|Corolla':1966,'Toyota|Camry':1982,'Toyota|Yaris':1999,'Toyota|Aygo':2005,'Toyota|RAV4':1994,'Toyota|Land Cruiser':1951,'Toyota|Hilux':1968,'Toyota|Prius':1997,'Toyota|Avensis':1997,'Toyota|Supra':1978,'Toyota|Tacoma':1995,'Toyota|Tundra':1999,'Toyota|Sequoia':2000,'Toyota|4Runner':1984,'Toyota|Land Cruiser Prado':1990,'Toyota|Highlander':2000,
 'Honda|Civic':1972,'Honda|Accord':1976,'Honda|Jazz':2001,'Honda|CR-V':1995,'Honda|HR-V':1998,'Honda|S2000':1999,'Honda|NSX':1990,'Honda|Prelude':1978,'Honda|Insight':1999,'Honda|Civic Type R':1997,
 'Nissan|Micra':1982,'Nissan|Note':2004,'Nissan|X-Trail':2000,'Nissan|Murano':2002,'Nissan|Pathfinder':1985,'Nissan|Patrol':1980,'Nissan|Navara':1997,'Nissan|350Z':2002,
 'Mazda|Mazda2':2002,'Mazda|Mazda3':2003,'Mazda|Mazda6':2002,'Mazda|MX-5':1989,'Mazda|Mazda5':2005,'Mazda|RX-8':2003,
 'Mitsubishi|Colt':1978,'Mitsubishi|Lancer':1973,'Mitsubishi|Lancer Evolution':1992,'Mitsubishi|Pajero':1982,'Mitsubishi|L200':1978,'Mitsubishi|Outlander':2001,'Mitsubishi|Space Star':1998,
 'Subaru|Impreza':1992,'Subaru|Forester':1997,'Subaru|Outback':1994,'Subaru|Legacy':1989,'Subaru|WRX STI':1994,'Subaru|WRX':1992,
 'Suzuki|Swift':1983,'Suzuki|Vitara':1988,'Suzuki|Jimny':1998,'Suzuki|Grand Vitara':1998,'Suzuki|Alto':1979,'Suzuki|Ignis':2000,'Suzuki|Baleno':1995,
 'Hyundai|i10':2007,'Hyundai|Getz':2002,'Hyundai|Matrix':2001,'Hyundai|Santa Fe':2000,'Hyundai|Tucson':2004,
 'Kia|Picanto':2004,'Kia|Rio':2000,'Kia|Sorento':2002,'Kia|Sportage':1993,'Kia|Carens':1999,'Kia|Carnival':1998,'Kia|Optima':2000,
 'Volvo|V70':1996,'Volvo|S80':1998,'Volvo|XC90':2002,'Volvo|XC70':1997,'Volvo|S60':2000,'Volvo|V40':1995,'Volvo|S40':1995,'Volvo|C70':1996,'Volvo|V50':2004,
 'Saab|9-3':1998,'Saab|9-5':1997,'Škoda|Octavia':1996,'Škoda|Fabia':1999,'Škoda|Superb':2001,
 'Seat|Ibiza':1984,'Seat|Leon':1999,'Seat|Toledo':1991,'Seat|Alhambra':1996,'Seat|Altea':2004,
 'Porsche|911':1964,'Porsche|Cayenne':2002,'Porsche|911 GT3':1999,'Porsche|911 Turbo':1975,
 'Land Rover|Defender (oud)':1990,'Land Rover|Discovery':1989,'Land Rover|Freelander':1997,'Land Rover|Range Rover':1970,'Land Rover|Range Rover Sport':2005,
 'Jeep|Wrangler':1986,'Jeep|Grand Cherokee':1992,'Jeep|Cherokee':1974,
 'Chevrolet|Camaro':1967,'Chevrolet|Corvette':1953,'Chevrolet|Silverado 1500':1999,'Chevrolet|Tahoe':1995,'Chevrolet|Suburban':1935,'Chevrolet|Blazer':1969,'Chevrolet|Colorado':2004,
 'Dodge|Charger':1966,'Dodge|Challenger':1970,'Dodge|Viper':1992,'Dodge|Durango':1998,'Dodge|Ram 1500':1994,
 'Jaguar|XJ':1968,'Jaguar|XK':1996,'Alfa Romeo|147':2000,'Alfa Romeo|159':2005,'Alfa Romeo|Brera':2005,
 'Lexus|IS':1999,'Lexus|GS':1993,'Lexus|LS':1989,'Lexus|RX':1998,'Lexus|ES':1989,
 'Mini|Cooper':2001,'Mini|Cabrio':2004,'Smart|Fortwo':1998,'Smart|Forfour':2004,
 'Daihatsu|Cuore':1980,'Daihatsu|Sirion':1998,'Daihatsu|Terios':1997,'Lancia|Ypsilon':1995,'Lancia|Delta':1979,'Lada|Niva':1977,
 'Lamborghini|Gallardo':2003,'Lamborghini|Murciélago':2001,'Bentley|Continental GT':2003,'Rolls-Royce|Phantom':2003,
 'Aston Martin|Vantage':2005,'Aston Martin|DB9':2004,'Aston Martin|Vanquish':2001,'Lotus|Elise':1996,'Lotus|Exige':2000,
 'Dacia|Logan':2004,'Chrysler|Voyager':1988,'Chrysler|PT Cruiser':2000,'Chrysler|Sebring':1995,'Chrysler|300C':2004,
 'Cadillac|Escalade':1999,'Cadillac|CTS':2002,'Isuzu|D-Max':2002,'SsangYong|Rexton':2001,'SsangYong|Musso':1993,'SsangYong|Korando':1983,'Ferrari|F430':2004,
 'Pontiac|Firebird':1967,'Pontiac|Grand Prix':1962,'Pontiac|Bonneville':1957,'Pontiac|GTO':1964,'Pontiac|Grand Am':1973,'Pontiac|Sunbird':1976,'Pontiac|LeMans':1962,
 'Buick|LeSabre':1959,'Buick|Riviera':1963,'Buick|Century':1936,'Buick|Regal':1973,'Buick|Skylark':1953,'Buick|Park Avenue':1991,'Buick|Roadmaster':1936,
 'Mercury|Cougar':1967,'Mercury|Grand Marquis':1975,'Mercury|Sable':1986,'Mercury|Capri':1970,'Mercury|Topaz':1984,'Mercury|Tracer':1987,
 'Lincoln|Town Car':1981,'Lincoln|Continental':1939,'Chevrolet|Monte Carlo':1970,'Chevrolet|Cavalier':1982,'Chevrolet|Corsica':1987,'Chevrolet|Beretta':1987,'Chevrolet|Lumina':1990,
 'Chevrolet|1500':1988,'Chevrolet|2500':1988,'Chevrolet|3500':1988,'Chevrolet|G-Series':1964,'Chevrolet|Sportvan':1964,'GMC|1500':1988,'GMC|2500':1988,'GMC|3500':1988,'GMC|Jimmy':1970,'GMC|Safari':1985,'GMC|Sonoma':1991,'GMC|Vandura':1964,
 'Oldsmobile|88':1949,'Oldsmobile|98':1941,'Oldsmobile|Toronado':1966,'Oldsmobile|Cutlass Supreme':1966,'Oldsmobile|Cutlass Ciera':1982,'Oldsmobile|Custom Cruiser':1971,
 'Cadillac|Brougham':1987,'Chrysler|New Yorker':1940,'Chrysler|LeBaron':1977,'Chrysler|Imperial':1926,'Chrysler|Town & Country':1989,'Chrysler|Fifth Ave':1979,
 'Dodge|Shadow':1987,'Dodge|Spirit':1989,'Dodge|Dynasty':1988,'Dodge|Daytona':1984,'Dodge|Colt':1971,'Dodge|Monaco':1965,'Dodge|Ramcharger':1974,'Dodge|Ram 50':1979,
 'Plymouth|Voyager':1984,'Plymouth|Acclaim':1989,'Plymouth|Sundance':1987,'Plymouth|Laser':1990,'Plymouth|Colt':1971,'Ford|Tempo':1984,'Ford|Festiva':1986,'Ford|Aerostar':1986,
 'Acura|Integra':1986,'Acura|Legend':1986,'Mazda|MPV':1988,'Mazda|Protege':1990,'Mazda|Navajo':1991,'Mitsubishi|Precis':1987,'Mitsubishi|Diamante':1990,
 'Isuzu|Impulse':1983,'Isuzu|Stylus':1990,'Isuzu|Amigo':1989,'Eagle|Premier':1988,'Eagle|Summit':1989,'Eagle|Talon':1990,'Geo|Metro':1989,'Geo|Prizm':1989,'Geo|Storm':1990,'Geo|Tracker':1989,
 'Nissan|240SX':1989,'Nissan|NX':1991,'Infiniti|Q45':1990,'Hyundai|Scoupe':1990,'Saturn|S-Series':1990
};
