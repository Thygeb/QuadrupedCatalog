# KILDEKORT C — Petoi og MangDang

18 råfiler i `c:\Praktik\websites\udstilling\media\_kilder\raa-vest-2026-08-19\`,
kortlagt og efterprøvet mod FUND-vest afsnit 9, 9b, 9c og 10.
Opgaven er 100 % læsning. Intet i repoet er ændret. Intet råmateriale er kopieret ud.

---

## Skill-vurdering (regel 0)

**Valgt: `robotdata`.** Den *kunne* kaldes — `Skill(robotdata)` returnerede skillen
normalt, ingen `Unknown skill`, så jeg læste den ikke som fallback fra disk. Den er den
rigtige, fordi opgaven er en efterprøvning af talpåstande mod primærkilder: den bærer de ti
hårde regler (særligt regel 4 om operatorer, regel 5 om intervaller, regel 9 om
metrisk/imperial og regel 10 om de tre tilstande) og det obligatoriske selv-tjek med
tælling. Regel 10 er præcis den, der fangede den dyreste fejl nedenfor.

Gik forbi, med begrundelse:

| Skill | Hvorfor ikke |
|---|---|
| `parallelt` | Bærer worktree-opsætning og prompt-tjekliste for at *starte* parallelt arbejde. Jeg **er** en af de parallelle agenter; skillen sætter ikke nye i gang, og opgaven er ren læsning uden skrivning, så ingen worktree er nødvendig |
| `impeccable`, `critique`, `ui-ux-critique` | Vurderer design/IA på noget bygget. Der er intet bygget |
| `dataviz` | Relevant når tætheden skal *vises*. Her skal den efterprøves |
| `new-project` | Scaffolding. Ingen kode skrives |
| `code-review`, `simplify` | Ingen kode |

---

## Del 1 — Hvad de 18 filer er

Alle Petoi-sider er Shopify. Kilde-URL er læst ud af `<link rel="canonical">` og
`<meta property="og:url">`, som er indbyrdes enige i alle filer. MangDang er også Shopify;
dér er der ingen `canonical` i mit grep-udtræk, men `og:url` står entydigt.

Fem af filerne bærer et Shopify-`__st`-objekt med `pageurl` og et epoch-stempel, hvilket
daterer hentningen uafhængigt af filsystemet: **2026-08-19 kl. 07:20:43 og 07:26:32 UTC.**
Det bekræfter FUND-vests `hentet: 2026-08-19`.

### Petoi — 11 filer

| Fil | Hvad | Kilde-URL (canonical + og:url) | K-nøgle | Brugbar som bevis |
|---|---|---|---|---|
| `petoi_spec.html` (370 KB) | Specifikationsside, Bittle X | `https://www.petoi.com/pages/bittle-x-robot-dog-with-arm-specifications` | **K14** | **Ja.** Fuld specifikationstabel som HTML-tekst. Bærer 12 af de 13 Bittle X-felter |
| `petoi_bittlex.html` (905 KB) | Produktside, Bittle X | `https://www.petoi.com/products/petoi-robot-dog-bittle-x-voice-controlled` | **K15** | **Ja.** FAQ + JSON-LD med seks varianter og USD-priser |
| `petoi_bittlex.txt` (12,7 KB) | Tekstudtræk af `petoi_bittlex.html` | (samme) | K15 | Ja. Renderet FAQ-tekst, lettere at citere fra end HTML'en |
| `bit1.html` (370 KB) | Specifikationsside, Bittle **v1** | `https://www.petoi.com/pages/bittle-robot-dog-specifications` | **K16** | **Ja.** Fuld specifikationstabel |
| `bit1.txt` (4,2 KB) | Tekstudtræk af `bit1.html` | (samme) | K16 | Ja |
| `petoi_bittle.html` (848 KB) | Produktside, Bittle **v1** | `https://www.petoi.com/products/petoi-bittle-robot-dog` | **K17** | **Ja.** FAQ (inkl. vandtæthed) + JSON-LD med fire varianter |
| `petoi_bittle.txt` (12,3 KB) | Tekstudtræk af `petoi_bittle.html` | (samme) | K17 | Ja |
| `nyq.html` (370 KB) | Specifikationsside, Nybble Q | `https://www.petoi.com/pages/robot-cat-nybble-q-technical-specifications` | **K18** | **Ja.** Fuld specifikationstabel |
| `nyq.txt` (4,4 KB) | Tekstudtræk af `nyq.html` | (samme) | K18 | Ja |
| `petoi_nybbleq.html` (758 KB) | Produktside, Nybble Q | `https://www.petoi.com/products/petoi-nybble-q-robot-cat` | **K19** | **Ja.** FAQ + JSON-LD med tre varianter. **Bemærk:** indeholder også kundeanmeldelser |
| `petoi_nybbleq.txt` (12,2 KB) | Tekstudtræk af `petoi_nybbleq.html` | (samme) | K19 | Ja, men se anmeldelsesfælden nedenfor |
| `petoi_home.html` (393 KB) | **Forside** | `https://www.petoi.com/` | **ingen K-nøgle** | Ja — men ingen påstand i FUND-vest citerer den. Den *bekræfter* dog tre priser ($319.00 / $289.00 / $435.00) og `Bittle Robot Dog(Final Stock)` i navigationen, og den er den eneste fil, der bærer Petois postadresse |
| `petoi_shop.html` (340 KB) | **404-side.** Ikke en shop | `https://www.petoi.com/404` | **ingen K-nøgle** | **Nej.** Se særafsnittet |

`bit1` og `nyq` er bekræftede kortnavne: `bit1.html` er Bittle v1's specifikationsside,
`nyq.html` er Nybble Q's. Navngivningen er uheldig, fordi `bit1`/`nyq` er *specifikations*sider
mens `petoi_bittle`/`petoi_nybbleq` er *produkt*sider — mønsteret er omvendt af, hvad
`petoi_spec.html` (= Bittle X' specifikationsside) antyder.

**Hul i indsamlingen:** der findes **ingen `petoi_spec.txt`**. K14 — den kilde flest
Bittle X-felter hviler på — er den eneste Petoi-side uden tekstudtræk. Jeg strippede den
selv med et engangsscript for at kunne læse den; den næste, der åbner mappen, har ikke
udtrækket.

### MangDang — 5 filer

| Fil | Hvad | Kilde-URL (`og:url`) | K-nøgle | Brugbar som bevis |
|---|---|---|---|---|
| `md_mp2.html` (314 KB) | Produktside, **Mini Pupper 2** | `https://mangdang.store/products/mp2` | **K20** | Delvist. Ingen specifikationstabel i tekst. Men JSON-LD bærer tre varianter med navn, pris og lagerstatus |
| `md_mp2.txt` (3,9 KB) | Tekstudtræk af `md_mp2.html` | (samme) | K20 | Delvist. **Viser kun `$649.00`** — de to andre priser er usynlige i tekstudtrækket |
| `md_mini-pupper.html` (306 KB) | Produktside, **Mini Pupper** (v1) | `https://mangdang.store/products/mini-pupper` | **K21** | Delvist, samme mønster. JSON-LD bærer tre varianter |
| `md_mini-pupper.txt` (4,3 KB) | Tekstudtræk af `md_mini-pupper.html` | (samme) | K21 | Delvist. **Viser kun `$649.00`** |
| `mangdang.html` (309 KB) | **Forside** | `https://mangdang.store/` | **ingen K-nøgle** | Næsten ikke. 1 954 byte tekst i alt — et produktgitter. Ingen specifikationer overhovedet |

---

## Del 2 — De tre filer på 339 709 byte

**Opgaven bad om at fastslå, om `petoi_shop.html` overhovedet er en Petoi-side. Svar: ja,
det er Petois eget domæne — men det er Petois 404-side.**

```
93e33f08ab46d00cf9afd1703c940f17  petoi_shop.html    339709 byte
768306a78d5a63ed362b43a9ce1e51b0  p_838e03.html      339709 byte
768306a78d5a63ed362b43a9ce1e51b0  s_9c6633.html      339709 byte
```

- **`p_838e03.html` og `s_9c6633.html` er byte-identiske.** Samme md5, samme
  Shopify-`reqid`. Det er **ét HTTP-svar gemt under to filnavne** — en ægte dublet.
- **`petoi_shop.html` er ikke en dublet af dem**, men den er den samme side hentet et
  andet tidspunkt. Alle tre har
  `<link rel="canonical" href="https://www.petoi.com/404">` og
  `var __st={… "pageurl":"www.petoi.com\/404" …}`.
  Den strippede tekst er: `404` / `Page not found` / `Continue shopping`.
- Forskellen mellem `petoi_shop.html` og `p_838e03.html` er **270 blokke, 6 688 byte, og
  filerne er lige lange.** Jeg gennemgik blokkene: de er Shopify-`reqid`/`u`-tokens
  (`f62e7cbe-…-1787124043` mod `929652b7-…-1787124392`) plus en ombytning af rækkefølgen på
  Shopify-app-blokke (`xo-gallery`, `simprosys-google-shopping-feed`, `inbox`). Ingen
  indholdsforskel. De to epoch-stempler er 2026-08-19 07:20:43 og 07:26:32 UTC — 349
  sekunder fra hinanden.

**Konsekvens:** tre af 58 råfiler (5 %) er den samme tomme 404-side. Ingen påstand i
FUND-vest hviler på nogen af dem — kildetabellen har **ingen** K-nøgle for en Petoi-shopside
(K23 er Boston Dynamics' shop). **Ingen skade sket**, men filnavnet `petoi_shop.html` lyver:
en senere læser, der åbner den for at finde priser, finder en 404 og kan tro, at Petoi ikke
har en shop.

---

## Del 3 — Efterprøvning, påstand for påstand

Metode: HTML strippet lokalt med et engangs-Python-script (fjerner `script`/`style`/
`noscript`/kommentarer, afkoder HTML-entiteter, NFKC-normaliserer). Alle citater er slået op
i **råfilen**, ikke i FUND-vest. Søgeudtryk og fil står ved hver linje.

### 9 — Bittle X

| # | Påstand i FUND-vest | Fil + søgeudtryk | Fundet ordret | Status |
|---|---|---|---|---|
| 1 | `269 - 353 grams(9.5 - 12.5oz)` | `petoi_spec.html`, strippet, felt `Robot weight` | `269 - 353 grams(9.5 - 12.5oz)` | ✅ |
| 2 | `190 x 153 x 107mm` | `petoi_spec.html`, felt `Standing robot dimensions` | `190 x 153 x 107mm(7.48 × 6.02 × 4.21 inches)` | ✅ inkl. etiketten |
| 3 | `9` frihedsgrader | `petoi_spec.html` `Number of joints powered by servos` → `9`; `petoi_bittlex.txt:348` | `Bittle X is a four-legged robot dog with 2 joints on each leg and 1 joint on its neck, so a total of 9 joints. It means Bittle X is a 9-degree-of-freedom(DOF) quadruped robot.` | ✅ |
| 4 | `A safe fast speed is 2 body lengths/second, or 40mm/second` | `petoi_bittlex.txt:350`, `grep -i "body length"` | `A safe fast speed is 2 body lengths/second, or 40mm/second. It could run 3-4 body length /second in experimental mode(not published).` | ✅ — **og FUND-vest citerer kun første halvdel.** Anden halvdel (`3-4 body length /second in experimental mode`) er et tredje hastighedstal på samme side |
| 5 | Faktor 9,5 mellem de to halvdele | Målt: 2 × 190 mm = 380 mm/s; 380 ÷ 40 = **9,5** | | ✅ regnestykket holder |
| 6 | `$319.00`, seks varianter `$319.00`-`$469.00` USD i strukturerede data | `petoi_bittlex.html`, JSON-LD `ProductGroup` + 6 × `Product` | `AggregateOffer` low 319.00 / high 469.00 USD; varianter 319 / 339 / 379 / 399 / 449 / 469 USD | ✅ præcist. Synlig sidepris er også `$319.00 USD` |
| 7 | Modsigelse: `A USB Type-C to USB cable is included` (K14) | `petoi_spec.html`, felt `Charging cable` | `A USB Type-C to USB cable is included.` | ✅ |
| 8 | mod FAQ'ens `does not include a charger but a Micro-USB to USB cable` (K15) | `petoi_bittlex.txt:332` | `The kit does not include a charger but a Micro-USB to USB cable. The battery can be charged with regular micro USB chargers.` | ✅ **Modsigelsen er ægte og står på producentens to sider om samme produkt** |
| 9 | `7.4V 1000mAh`, `Current typ./max. 2A/5A` | `petoi_spec.html` | ordret | ✅ |
| 10 | `1 hour` driftstid / `1-hour playtime` | `petoi_spec.html` `Battery life` → `1 hour`; `petoi_bittlex.txt:112` | `Interactive Play : 1-hour playtime with 35+ lifelike movements via mobile app or voice control.` | ✅ |
| 11 | `1.5 hours` ladetid, `Charger included: No`, lader `USB 5V 1A` | `petoi_spec.html` | ordret, alle tre | ✅ |
| 12 | `ESP32-WROOM-32D 520K SRAM 16MB QSPI Flash`, IMU `6-Axis MPU6050 or icm42670 depending on chip availability`, 12 PWM | `petoi_spec.html` | ordret; `PWM channels 12 (driving up to 12 PWM servos)` | ✅ |
| 13 | `1lb` nyttelast, uklart hvilken type | `petoi_bittlex.txt:344`, `grep -i carry` | `How much weight can Bittle X carry?` / `Bittle X can carry 1lb of weight .` | ✅ — og FUND-vests forbehold *"uklart hvilken type"* er korrekt: siden siger hverken gående eller stående |
| 14 | Dataporte `Grove 4`, `USB Type-C Port`, `Serial UART, I2C network, speaker, Bluetooth, WiFi` | `petoi_spec.html` | ordret | ✅ |
| 15 | C++ som SDK-sprog | `petoi_bittlex.txt:108` | `Fun Coding : Create behaviors with block-based coding, Python, or C++.` | ✅ men kilden er **kun K15**; K14 nævner C++ udelukkende i navigationen (`C++ Robotics Curriculum`) |
| 16 | IP-klasse blandt **"Ikke oplyst"** | `petoi_bittlex.txt:345-346` | `Is Bittle X waterproof?` / `No. But Bittle can walk in the shadow water area .` | ❌ **FEJL — se E1** |

### 9b — Bittle v1

| # | Påstand | Fil + søgeudtryk | Fundet ordret | Status |
|---|---|---|---|---|
| 17 | `Is Bittle waterproof? No. But Bittle can walk in the shadow water area.` | `petoi_bittle.txt:334-335`, `grep -i waterproof` | `Is Bittle waterproof?` / `No. But Bittle can walk in the shadow water area .` | ✅ **ordret fundet** (mellemrum før punktum, fordi sidste led er et link) |
| 18 | …og at det er **"eneste eksplicitte nej i hele indsamlingen"** | samme grep, kørt på alle 18 filer | Samme "No" står også på `petoi_bittlex.txt:346` | ❌ **FEJL — se E2** |
| 19 | `265g - 290g(9.3oz - 10.2oz)` | `bit1.txt`, felt `Weight` | ordret | ✅ |
| 20 | `200 x 110 x 110mm, 7.9 x 4.3 x 4.3inch` under etiketten `Dimensions` (ikke `Standing robot dimensions`) | `bit1.txt` | ordret, og etiketten er `Dimensions` | ✅ **FUND-vests forbehold om målemetode er velbegrundet** |
| 21 | `9` frihedsgrader | `petoi_bittle.txt:337` | `…a total of 9 joints. It means Bittle is a 9-degree-of-freedom(DOF) quadruped robot.` | ✅ |
| 22 | `1lb` | `petoi_bittle.txt:333` | `Bittle can carry 1lb of weight .` | ✅ |
| 23 | Hastighed, samme umulighed | `petoi_bittle.txt:339` | `A safe fast speed is 2 body lengths/second, or 40mm/second…` | ✅ ordret identisk med Bittle X-siden |
| 24 | Ladetid `2h` mod Bittle X' `1.5 hours` | `bit1.txt` `Charge time` → `2h`; `petoi_spec.html` → `1.5 hours` | ordret begge | ✅ forskellen er reel |
| 25 | `Micro-USB to USB cable included` | `bit1.txt`, felt `Charging cable` | ordret | ✅ — **bekræfter arve-hypotesen:** Bittle X' FAQ-tekst er ord for ord Bittle v1's kabeltekst |
| 26 | `NyBoard V1 - Arduino Uno-compatible`, `ATMega328P`, `6-Axis MPU6050`, `16` PWM, `7` RGB LED | `bit1.txt` | ordret, alle fem | ✅ |
| 27 | `$289.00` (billigste variant) | `petoi_bittle.html` JSON-LD | `289.00 USD` … men `availability: OutOfStock`. **Synlig sidepris er `$309.00 USD`** | ⚠️ **se S1** |
| 28 | `Bittle Robot Dog(Final Stock)` i navigationen | `grep -c "Final Stock"` på alle otte Petoi-filer | 4 forekomster i **hver** fil | ✅ |

### 9c — Nybble Q

| # | Påstand | Fil + søgeudtryk | Fundet ordret | Status |
|---|---|---|---|---|
| 29 | `403 to 433 grams(14.2 to 15.3 oz)` | `nyq.txt`, felt `Robot weight` | ordret | ✅ |
| 30 | `240 x 115 x 150mm(9.45 × 4.53 × 5.91 inches)` | `nyq.txt`, `Standing robot dimensions` | ordret | ✅ |
| 31 | `11` led | `nyq.txt` `Number of joints powered by servos` → `11`; `petoi_nybbleq.txt:306` | `Nybble Q is a four-legged robot cat featuring 2 joints per leg, 2 joints in the head, and 1 joint in the tail—totaling 11 joints. This makes it an 11-degree-of-freedom (DOF) quadruped robot.` | ✅ |
| 32 | `4MB QSPI Flash` mod Bittle X' `16MB` | `nyq.txt` → `ESP32-WROOM-32D 520K SRAM 4MB QSPI Flash`; `petoi_spec.html` → `…520K SRAM 16MB QSPI Flash` | ordret begge | ✅ **Fundet holder — samme kortnavn `Biboard`, fire gange forskellen i flash** |
| 33 | `$435.00`, varianter `$435.00` og `$515.00` | `petoi_nybbleq.html` JSON-LD | Tre `Product`: Cream/Lite 435.00 (InStock), Cream/Alloy 515.00, White/Lite 435.00 (OutOfStock). `AggregateOffer` 435-515 USD | ✅ prisværdierne er rigtige — **tre varianter på to prispunkter**, hvilket FUND-vests ordlyd ikke skelner |
| 34 | Ramme `3D-printed` | `nyq.txt`, `Frame material` | ordret | ✅ |
| 35 | Driftstid `1 hour` / ladetid `1.5 hours` | `nyq.txt` | ordret; produktsiden: `1-hour playtime` (`petoi_nybbleq.txt:111`) | ✅ |
| 36 | Nyttelast **ikke oplyst** for Nybble Q | `grep -i "carry\|payload\|lb"` på `petoi_nybbleq.txt` og `nyq.txt` | Ingen nyttelast-FAQ. Eneste træf er en kundeanmeldelse om vægtfordeling | ✅ korrekt fravalgt |
| 37 | Ingen IP-oplysning for Nybble Q | `grep -i waterproof` på begge Nybble Q-filer | **nul træf** | ✅ korrekt — her er `ikke oplyst` den rigtige tilstand |

### 10 — MangDang

| # | Påstand | Fil + søgeudtryk | Fundet | Status |
|---|---|---|---|---|
| 38 | Specifikationstabellen er et **billede**, ikke tekst | `grep -oiE '[0-9][0-9.,]*[ ]?(kg\|mm\|mAh\|cm\|grams?\|Wh\|DoF\|V)'` på alle tre MangDang-HTML-filer | **Ingen ægte specifikationstal.** De eneste træf er et produkt-handle (`ttl-serial-bus-servo3-5kg-cm-with-position-feedback`) og CSS-klassehashes (`…4cm…`, `…0Mm…`). Afsnittet `Specifications` efterfølges af `<img src="//mangdang.store/cdn/shop/files/quality_restoration_20260710144028392.jpg">` | ✅ **Bekræftet, og skarpere end FUND-vest skriver:** billedet har `alt=""` — **tom alt-tekst**, så end ikke en skærmlæser får tallene. Og det er **samme billedfil på begge produktsider** |
| 39 | `A detailed breakdown of hardware specs, module integration, and system performance across both generations` | `md_mp2.stripped`, `md_mini-pupper.stripped` | ordret på begge | ✅ |
| 40 | ROS2 nævnes | `md_mp2.txt`, `md_mini-pupper.txt` | `ROS2 Tech: Run SLAM and Navigation projects instantly.` og `Use ROS2 for simulation, SLAM, and navigation functions — technologies similar to those in self-driving systems, all ready to explore.` | ✅ ordret, på **begge** sider |
| 41 | Python nævnes | samme | `We provide simple forward kinematics sample code based on Mini Pupper here . Run it on Windows or Ubuntu with Python` | ✅ ordret |
| 42 | Mini Pupper 2-siden viser `$399.00`, `$604.00` og `$649.00` | `md_mp2.html`, `grep -oE '"price":[0-9]+'` + JSON-LD | `Pre-assembled Kit` 649.00 · `Legs Pre-assembled Kit` 604.00 · `Upgrade Kit+CM4102000` 399.00, alle USD, alle InStock | ✅ **helt præcist** |
| 43 | Mini Pupper: `$649.00` | `md_mini-pupper.html`, samme metode | `Pre-assembled Kit` 649.00 · `Legs Pre-assembled Kit` **604.00** · `GenAI Pre-assembled Kit` **669.00** (OutOfStock) | ❌ **FEJL — se E3** |
| 44 | `STL-06P Lidar module`, tidligere `LD06` | `mangdang.html` + `md_mini-pupper.html` | `STL-06P Lidar module` på mp2/forsiden; på Mini Pupper-siden: `We already tested some Lidar modules, such as PRLidar A1, YDLidar X2L, and LD06. For Mini Pupper, we refer to LD06 as it is smaller.` | ✅ |
| 45 | `Upgrade Kit+CM4102000` uden RAM/lager i tekst | `md_mp2` | ordret i variantnavn; ingen RAM- eller lagerangivelse nogen steder i tekst | ✅ |
| 46 | Kamera ikke inkluderet **"af hensyn til privatliv"**, `Raspberry Pi camera v2` | `md_mp2`, `md_mini-pupper` | mp2: `For potential security issues, the camera module is not included in our default package… you can choose a Raspberry Pi camera v2 module.` mini-pupper: `…you can choose a normal USB camera module or a Pi camera v2.` | ⚠️ **se S2** |
| 47 | Producenten oplyser næsten intet — tæthed 3/31 | Regnet efter: 3/29 = 10,3 %, 3/31 = 9,7 % | | ✅ aritmetikken holder |

### Krydstjek metrisk mod imperial (regel 9)

Jeg regnede alle FUND-vests krydstjek efter med `1 oz = 28,349523125 g`, `1 in = 25,4 mm`:

```
Bittle X   269 g -> 9,4887 oz  (siden: 9.5)     353 g -> 12,4517 oz (12.5)
Bittle X   190 mm -> 7,4803 in (7.48)  153 -> 6,0236 (6.02)  107 -> 4,2126 (4.21)
Nybble Q   403 g -> 14,2154 oz (14.2)  433 g -> 15,2736 oz (15.3)
Nybble Q   240 mm -> 9,4488 in (9.45)  115 -> 4,5276 (4.53)  150 -> 5,9055 (5.91)
Bittle v1  265 g -> 9,3476 oz (9.3)    290 g -> 10,2294 oz (10.2)
Bittle v1  200 mm -> 7,8740 in (7.9)   110 -> 4,3307 (4.3)
```

**Alle 15 krydstjek falder inden for producentens egen afrunding.** Ingen Petoi-side har en
Spot-agtig faktor-10-fejl. FUND-vests *"Alle tre krydstjek OK"* på Bittle X er efterprøvet
og korrekt.

### Tæthedsregnestykker efterprøvet

`12/29 = 41,4 %` ✅ · `12/31 = 38,7 %` ✅ · `13/29 = 44,8 %` ✅ · `13/31 = 41,9 %` ✅ ·
`10/29 = 34,5 %` ✅ · `10/31 = 32,3 %` ✅ · `3/29 = 10,3 %` ✅ · `3/31 = 9,7 %` ✅
Alle otte procenttal i mine fire afsnit er regnet rigtigt.

---

## Del 4 — Fejl og svage steder

### ❌ E1 — Bittle X mangler sin IP-tilstand. Tætheden er for lav

FUND-vest afsnit 9 lister **IP-klasse** blandt *"Ikke oplyst"*. Men K15 —
`petoi_bittlex.txt:345-346`, søgt med `grep -i waterproof` — siger:

> `Is Bittle X waterproof?`
> `No. But Bittle can walk in the shadow water area .`

Efter FUND-vests egen tælleregel (*"`nej` og `0` tæller som udfyldt"*) og efter `robotdata`
regel 10 er det en **udfyldt værdi med tilstanden `nej`**, ikke `ikke oplyst`.

**Konsekvens:** Bittle X er **13 udfyldte felter, ikke 12.**
Tæthed **13/29 = 44,8 %** og **13/31 = 41,9 %** — ikke 41,4 % / 38,7 %.

### ❌ E2 — "Eneste eksplicitte nej i hele indsamlingen" er forkert

Afsnit 9b kalder Bittle v1's `Is Bittle waterproof? No.` for
*"**Eneste eksplicitte nej i hele indsamlingen**"* og bygger videre:
*"Den **højeste** af Petoi-modellerne — udelukkende fordi den siger `nej` til vandtæthed."*

Begge dele falder med E1. `grep -i waterproof` kørt på **alle 18 filer** giver træf i
**to** filer, ikke én: `petoi_bittle.txt` (v1) **og** `petoi_bittlex.txt` (X). Sætningerne
er næsten ord for ord ens.

Det her er den dyreste af de tre, fordi den påstand er **hjørnestenen i projektets regel om
tre tilstande** — den bruges i FUND-vest som beviset for, at `nej` skal kunne skelnes fra
`ikke oplyst`. Beviset holder stadig (der *er* et eksplicit nej), men **tællingen bag det er
forkert, og rangeringen mellem Bittle v1 og Bittle X falder væk**: med rettelsen står de
begge på 13 felter.

Sidegevinst: at det samme nej står på begge sider er endnu et bevis for FUND-vests egen
konklusion om, at Bittle X' FAQ er arvet uændret fra Bittle v1. Bemærk at FAQ'en på
Bittle X-siden endda beholder ordet **"Bittle"** i svaret (`No. But **Bittle** can walk…`),
ikke "Bittle X".

### ❌ E3 — MangDang Mini Pupper har tre priser, ikke én

Afsnit 10 skriver: *"Mini Pupper `$649.00` USD; Mini Pupper 2-siden viser `$399.00`,
`$604.00` og `$649.00`."*

Mini Pupper 2-halvdelen er præcis. Mini Pupper-halvdelen er ikke.
`md_mini-pupper.html`, JSON-LD (`grep -oE '"price":[0-9]+'` + parse):

| Variant | Pris | Lager |
|---|---|---|
| Mini Pupper - Pre-assembled Kit | **$649.00** | InStock |
| Mini Pupper - Legs Pre-assembled Kit | **$604.00** | InStock |
| Mini Pupper - GenAI Pre-assembled Kit | **$669.00** | OutOfStock |

**$669.00 er den højeste pris på nogen af de to MangDang-sider** og mangler helt i
FUND-vest. Et prisinterval for MangDang er altså `$399.00-$669.00`, ikke `$399.00-$649.00`.

**Hvorfor fejlen opstod, og hvorfor den er lærerig:** `md_mini-pupper.txt` — tekstudtrækket
— viser **kun `$649.00`**, fordi Shopify kun renderer den valgte variants pris som synlig
tekst. De øvrige priser findes udelukkende i JSON-LD og i `"price":60400` /
`"price":66900`-blokke. **Læser man tekstudtrækket, ser en Shopify-produktside ud til at
have én pris.** Det gælder også Petoi: `petoi_bittle`-siden viser `$309.00` som synlig
tekst, mens fire varianter fra $289 til $349 ligger i JSON-LD.

### ⚠️ S1 — `$289.00` for Bittle v1 er den billigste, men den kan ikke købes

`petoi_bittle.html` JSON-LD: `289.00 USD` har `"availability": "OutOfStock"`. Den synlige
pris på den citerede side (K17) er **`$309.00 USD`**. `$289.00` optræder som synlig tekst
kun på **forsiden** (`petoi_home.html`) — en fil, der ikke har nogen K-nøgle i kildetabellen.

Påstanden er ikke *forkert* — den siger "billigste variant" — men den kan ikke efterprøves
fra den kilde, den er tilskrevet, uden at læse strukturerede data. Samme mønster på
Bittle X ($379-varianten er OutOfStock, men $319-basisvarianten er InStock, så tallet
holder dér).

**Til datamodellen:** `vejledende pris` bør bære en lagerstatus eller i det mindste en note
om, hvorvidt den citerede pris kan købes. Ellers viser kataloget en pris, køberen ikke kan få.

### ⚠️ S2 — "af hensyn til privatliv" står der ikke

FUND-vest: *"kamera som tilvalg (`Raspberry Pi camera v2`, **ikke inkluderet af hensyn til
privatliv**)"*. Siderne skriver `For potential security issues` — *sikkerhed*, ikke
*privatliv*. Og K21 (Mini Pupper) skriver ikke `Raspberry Pi camera v2`, men
`a normal USB camera module or a Pi camera v2`. Kun K20 (mp2) har den lange form.
Lille sag, men det er en parafrase i et dokument, der andre steder er strengt ordret.

### ⚠️ S3 — "Petoi LLC, USA" er rigtigt, men kilden er en anden end den citerede

Afsnit 9 belægger producentland med `© 2018-2026, Petoi LLC` (den streng står ordret i alle
otte Petoi-filer, kun med et mellemrum mere: `© 2018-2026 , Petoi LLC`). Men et
copyright-mærke fastslår ikke land. Det gør derimod `petoi_home.html`, der bærer
`"addressCountry": "US"`, `"addressRegion": "CA"` og `"streetAddress": "340 E Middlefield Rd"`
i strukturerede data. **Påstanden er rigtig; henvisningen er svagere end det bevis, der
faktisk ligger i mappen** — og beviset ligger i en fil uden K-nøgle.

### ⚠️ S4 — "Hvilken variant der er basis, fremgår ikke af teksten" er for pessimistisk

Det er sandt om den *synlige* tekst. Men JSON-LD navngiver hver variant med sin pris
(`Mini Pupper 2 - Upgrade Kit+CM4102000` → 399.00), og den synligt valgte variant på
`md_mp2` er `Pre-assembled Kit` til `$649.00`. Koblingen pris→variant **findes** i råfilen;
den findes bare ikke i tekstudtrækket.

### ⚠️ S5 — Fælde i råmaterialet: produktsiderne blander producent og kunder

`petoi_nybbleq.txt:276` er en **kundeanmeldelse**, ikke producenttekst, og den indeholder
tekniske påstande: *"The BiBoard V1 is a great improvement over the Nyboard… both the older
and newer cats using the same C++ code…"*. Alle tre Petoi-produktsider bærer sådanne
anmeldelser (`83 reviews`, `29 reviews`) i samme tekstudtræk som producentens egne FAQ-svar.

**Et `grep` på en Petoi `.txt` kan ramme en kunde og se ud som producenten.** Ingen af de
efterprøvede FUND-vest-felter er ramt af det — jeg tjekkede hver enkelt kildelinje — men
det bør stå som en advarsel til den næste, der indsamler fra en Shopify-produktside.

---

## Efterprøvet 47 påstande i 18 råfiler, fandt 3 fejl.

Fordelt: 38 bekræftet ordret · 3 fejl (E1, E2, E3) · 5 svage steder (S1-S5) ·
1 påstand skærpet i FUND-vests favør (billedets tomme `alt`).
De 18 filer er alle åbnet; 15 bar bevis for mindst én påstand, 3 (`petoi_shop.html`,
`mangdang.html`, `petoi_home.html`) bærer ingen citeret påstand — men `petoi_home.html`
er den eneste kilde til producentland og til `$289.00` som synlig tekst.

---

## Selv-review — hvad jeg er usikker på

**Filer jeg ikke kunne identificere: ingen.** Alle 18 har enten `canonical`, `og:url` eller
et Shopify-`__st.pageurl`, og alle 18 lod sig knytte til en model og en sidetype.

**Påstande jeg ikke kunne finde: ingen af de 47.** Men fire forbehold:

1. **`p_838e03.html` og `s_9c6633.html` hører til en anden agent.** Jeg fastslog kun deres
   md5 og canonical for at kunne afgøre min egen `petoi_shop.html`. Jeg har **ikke**
   efterprøvet, hvilke påstande der eventuelt hviler på dem — hvis nogen påstand i
   FUND-vest gør, er den bygget på en 404-side, og det bør en anden tjekke.
2. **Jeg har ikke åbnet specifikationsbilledet fra MangDang.** Jeg beviste, at der ikke er
   tal i teksten, og at afsnittet er et `<img>` med tom `alt` — men jeg har ikke hentet
   eller OCR'et billedet, så jeg kan ikke bekræfte, at det *indeholder* de tal, FUND-vest
   antager det gør. Filen ligger på MangDangs CDN, ikke i råmappen.
3. **Tælleregelen for E1 hviler på en fortolkning, jeg ikke selv har afgjort.** At
   `Is Bittle X waterproof? No.` udfylder feltet **IP-klasse** følger FUND-vests egen
   metode og `robotdata` regel 10, men "ikke vandtæt" er ikke en IP-kode. Er den rigtige
   beslutning, at `nej` til vandtæthed udfylder IP-feltet — eller skal det være et
   selvstændigt felt? Det er en beslutning for CEO'en, ikke for mig. **Men uanset hvad der
   besluttes, skal Bittle X og Bittle v1 behandles ens**, og det gør de ikke i dag.
   Sagt lige ud: hvis oplysningen tæller for v1, tæller den for X.
4. **Jeg har ikke efterprøvet FUND-vests sammenligninger på tværs af afsnit**, fx
   *"Bittle X ligger over ANYmal (37,9 %)"*. ANYmal er en anden agents felt. Bemærk dog, at
   E1 flytter Bittle X fra 38,7 % til 41,9 % på 31-nævneren, hvilket kun gør den
   sammenligning stærkere, ikke svagere.

**Hvad jeg sprang over:** jeg læste ikke `petoi_home.html`s eller `mangdang.html`s
fuldstændige HTML — kun strippet tekst, `og:url`, JSON-LD og målrettede `grep`. Der kan
ligge oplysninger i JavaScript-variabler, jeg ikke har set. Jeg strippede
`script`-elementer væk før tekstlæsning, netop for at undgå at forveksle kode med
sidetekst; prisværdierne hentede jeg derfor separat direkte fra JSON-LD i den rå HTML.

**Hvad der overraskede mig, og som jeg mener bør flyttes ind i metoden:** hverken
`petoi_shop.html`s 404-status eller MangDangs `$669.00`-variant kan ses i et tekstudtræk.
Begge dele kræver, at man kigger i den rå HTML. **Et tekstudtræk af en Shopify-side er ikke
en fuld gengivelse af siden — det er den valgte variants udsnit.** Hvis indsamlingen
fortsætter med `.txt`-filer som primær læsevej, vil den blive ved med at ramme netop den
slags fejl.
