# FUND-vest — publicerede specifikationer, vestlige firbenede robotter

Indsamlet 19. august 2026. Branch `data/vest`. Trin 5-forarbejde til [PLAN.md](PLAN.md),
efter skemaet i [DATAMODEL.md](DATAMODEL.md).

**Alt herunder er producentoplyst. Intet er målt af os, intet er omregnet uden at det står,
og intet er gættet.** Mangler en oplysning, står der `ikke oplyst`.

---

## Skill-vurdering

`ls C:/Users/thyge/.claude/skills/` gav `critique`, `impeccable`, `ui-ux-critique`; dertil
plugin-skills i systemets oversigt.

**Valgt: ingen skill.** Opgaven er webresearch og feltindsamling — ingen kode, ingen
grænseflade, intet at kritisere endnu.

Gik forbi, med begrundelse:

| Skill | Hvorfor ikke |
|---|---|
| `impeccable` | Design- og IA-planlægning. Allerede brugt til PLAN.md; siger intet om dataindsamling |
| `ui-ux-critique`, `critique` | Vurderer noget bygget. Der er ikke bygget noget |
| `dataviz` | Relevant når tætheden skal *vises*. Den skal først måles |
| `new-project` | Scaffolding. Der skrives ikke kode |
| `code-review`, `simplify` | Ingen kode |

Projektets egen CLAUDE.md-tabel bekræfter fravalget: ingen af de listede skills dækker
indsamlingsfasen.

---

## Metode

- **Kun producentens eget domæne**, plus datablade der ligger som direkte download fra
  producentens egen produktside (Boston Dynamics' PDF på `bostondynamics.com`, Ghost Robotics'
  datablad på deres Webflow-CDN, Rainbow Robotics' manual på deres egen GitHub Pages).
  Alt sådant er markeret i kildetabellen.
- **Ingen forhandlere, ingen anmeldelser, ingen robotdatabaser.** To sekundære kilder blev
  set undervejs (`adeptor.no` med et ANYmal X-datablad, `originofbots.com`) og **ikke brugt**.
- Sider blev hentet som rå HTML med `curl` og konverteret til tekst lokalt, så det, der står
  nedenfor, er sidens egen tekst — ikke en model, der har refereret den. To PDF'er blev
  dekomprimeret og tekstudtrukket lokalt.
- Hentedato for alt: **2026-08-19**.

### Tællereglen (D4 er stadig åben — her er den regel, jeg *faktisk* brugte)

Et felt tæller som udfyldt, når producenten på sin egen side angiver:

- et **tal med enhed**, eller
- en **eksplicit ikke-numerisk oplysning** for felter der ikke er tal (ROS 2, hot-swap,
  dockingstation, CE, monteringsinterface, SDK-sprog, autonominiveau).

`nej` og `0` tæller som udfyldt. `ikke oplyst` gør ikke. **Type uden model** (fx
`3D LiDAR ×1` uden fabrikat) tæller som udfyldt og er markeret `~` i tabellerne, så tallet
kan genberegnes uden dem.

### Nævneren er ikke 29 — den er 31

DATAMODEL.md's skema har grupperne **Fysik (10) · Energi (5) · Sensorik (6) · Nyttelast (3) ·
Kommercielt (5) = 29**. Men *Fysik*-gruppen opregner **12** felter, ikke 10: egenvægt · mål
stående · mål foldet · frihedsgrader · nyttelast gående · nyttelast stående · hastighed ·
hældning · forhindring enkelt · trappetrin kontinuerlig · IP-klasse · driftstemperatur.
Summen af de opregnede felter er derfor **31**.

Jeg har ikke rettet i skemaet. Jeg opgiver **begge** tætheder: `n/29` (så tallene kan holdes
op mod Spot 55 %, B2 48 %, ANYmal 28 %) og `n/31` (den ærlige nævner). **Punktet skal lukkes,
før tætheden bruges som rangering** — ellers er sidens hovedtal 6,5 % for højt.

---

## D2 er lukket: Spot er 1100 mm, og produktsiden har en tastefejl

**Spørgsmålet:** `bostondynamics.com/products/spot/` oplyser længde som `110mm (43.3 in)`.
43,3 tommer er 1100 mm. Mangler det metriske tal et nul, eller havde vores udtræk fejlet?

**Svaret: produktsiden har fejlen. Vores udtræk var korrekt.**

Beviskæden, i den rækkefølge den blev lagt:

1. **Rå HTML fra produktsiden**, hentet med `curl` og udtrukket lokalt uden model imellem.
   Cellen indeholder ordret `110mm (43.3 in)`.
2. **Typografien afslører den.** Alle andre rækker på siden har mellemrum foran enheden:
   `500 mm (19.7 in)`, `191 mm (7.5 in)`, `610 mm (24.0 in)`, `700 mm (27.6 in)`,
   `520 mm (20.5 in)`, `300 mm (11.8 in)`. Kun længderækken skriver `110mm`. Det er
   fingeraftrykket af en hånd, der har rettet i netop den celle.
3. **Boston Dynamics' eget datablad modsiger produktsiden.**
   `bostondynamics.com/wp-content/uploads/2020/10/spot-specifications.pdf`, mærket
   `Updated: 05/22/2024`, skriver i samme tabel:
   `DIMENSIONS Length = 1100 mm (43.3 in) Width = 500 mm (19.7 in)`.

**Konklusion til posten:** `laengde: 1100 mm (43.3 in)`, kilde = databladet.
Produktsidens `110mm` føres med som `advarsel` på posten, ikke som værdi. Vi retter ikke
stiltiende — vi noterer, at producenten modsiger sig selv, og hvilken af de to der er
konsistent med sin egen imperiale værdi.

**Krydstjekket virker.** 43,3 in × 25,4 = 1099,8 mm. Afvigelsen mod 110 mm er faktor 10 —
langt over enhver afrundingstolerance. En validator med den regel havde fanget det uden
menneskeøjne, og det er argumentet for at bygge den.

### Og der kom en fejl mere ud af det samme opslag

De to Boston Dynamics-kilder er **uenige om Spots vægt**:

| Kilde | Net Mass/Weight (Spot with battery) | Internt konsistent? |
|---|---|---|
| Produktsiden | `33.8 kg (74.5 lb)` | Ja — 33,8 kg = 74,52 lb |
| Databladet (opdateret 2024-05-22) | `32.7 kg (72.1 lbs)` | Ja — 32,7 kg = 72,09 lb |

Begge er interne konsistente. De er bare ikke enige. Forskellen er 1,1 kg. Ingen af dem
kan afvises ud fra tallet selv; **posten skal bære begge med hver sin kilde**, og
producenten skal spørges. Dette er ikke fanget af et metrisk/imperialt krydstjek — det
kræver, at samme felt hentes fra to af producentens egne kilder. Det er et argument for at
gøre `kilde` til en liste, ikke et enkeltfelt.

---

## Kilder

Alle hentet **2026-08-19**. Alle er producentens eget domæne, med de mærkede undtagelser.

| Nøgle | URL | Type |
|---|---|---|
| K1 | `https://bostondynamics.com/products/spot/` | Primær, produktside |
| K2 | `https://bostondynamics.com/wp-content/uploads/2020/10/spot-specifications.pdf` | Primær, producentens eget datablad, mærket `Updated: 05/22/2024` |
| K3 | `https://bostondynamics.com/products/spot/arm/` | Primær, produktside |
| K4 | `https://www.anybotics.com/robotics/anymal/` | Primær, produktside |
| K5 | `https://www.anybotics.com/robotics/anymal-x/` | Primær, produktside |
| K6 | `https://www.ghostrobotics.io/vision-60` | Primær, produktside |
| K7 | `SPECSHEET_V3.3 … .pdf` på `cdn.prod.website-files.com/67b418349cd29a4f7829b4a5/…`, mærket `©2024 Ghost Robotics` | Primær datablad, **direkte download fra K6**. Ligger på producentens Webflow-CDN, ikke på deres eget domæne — noteret, fordi URL'en kan dø |
| K8 | `https://www.rivr.ai/product` | Primær, produktside |
| K9 | `https://www.rivr.ai/` | Primær, forside |
| K10 | `https://www.mabrobotics.pl/honey-badger-5` | Primær, produktside |
| K11 | `https://www.mabrobotics.pl/honey-badger` | Primær, produktside |
| K12 | `https://rainbow-robotics.com/en/products/rbq-10/` | Primær, produktside |
| K13 | `https://rainbowrobotics.github.io/RBQ/` — undersider `manual/product-descriptions/general-specification`, `manual/related-products/battery`, `manual/hardware/specification`, `guides/add-on/specifications` | Primær, producentens egen brugermanual (GitHub Pages under `rainbowrobotics`) |
| K14 | `https://www.petoi.com/pages/bittle-x-robot-dog-with-arm-specifications` | Primær, specifikationsside |
| K15 | `https://www.petoi.com/products/petoi-robot-dog-bittle-x-voice-controlled` | Primær, produktside (FAQ + pris) |
| K16 | `https://www.petoi.com/pages/bittle-robot-dog-specifications` | Primær, specifikationsside |
| K17 | `https://www.petoi.com/products/petoi-bittle-robot-dog` | Primær, produktside |
| K18 | `https://www.petoi.com/pages/robot-cat-nybble-q-technical-specifications` | Primær, specifikationsside |
| K19 | `https://www.petoi.com/products/petoi-nybble-q-robot-cat` | Primær, produktside |
| K20 | `https://mangdang.store/products/mp2` | Primær, produktside |
| K21 | `https://mangdang.store/products/mini-pupper` | Primær, produktside |
| K22 | `https://www.anybotics.com/anymal-specifications-sheet/` | Primær, men **lukket** — ingen PDF-URL på siden, kun formular |
| K23 | `https://shop.bostondynamics.com/` | Primær, men **kun merchandise** — ingen robotpris |
| K24 | `https://www.ghostrobotics.io/` | Primær, navigation — bruges som bevis for hvad der *ikke* længere findes |

**Bevidst ikke brugt:** `adeptor.no` (forhandler, har et ANYmal X-datablad),
`originofbots.com`, `aparobot.com`, `uvt.us`, `farrwest.com` (forhandlere/databaser).
De dukkede op i søgninger og er fravalgt efter regel 3.

---

# 1. Boston Dynamics — Spot

**Producent:** Boston Dynamics, Waltham, Massachusetts, USA. Majoritetsejet af Hyundai Motor
Group (Sydkorea) — noteret, fordi `producentland` bliver tvetydigt for filteret
"producentland", og fordi det er den slags, en indkøber spørger til.
**Status:** i produktion. **Kilder:** K1 (produktside), K2 (databladet).

| # | Felt | Værdi som producenten skriver | Op. | Kilde | Note |
|---|---|---|---|---|---|
| 1 | egenvægt | `33.8 kg (74.5 lb)` / `32.7 kg (72.1 lbs)` | — | K1 / K2 | **Konflikt mellem to producentkilder**, se ovenfor |
| 2 | mål stående L×B×H | L `1100 mm (43.3 in)` · B `500 mm (19.7 in)` · H (gang, standard) `610 mm (24.0 in)` | — | K2 (L), K1+K2 (B, H) | K1 skriver L som `110mm (43.3 in)` — tastefejl, se D2. Højde findes i fire varianter: siddende `191 mm`, standard `610 mm`, maks `700 mm`, min `520 mm` |
| 3 | mål sammenfoldet | ikke oplyst | | | Kun siddehøjde `191 mm (7.5 in)` oplyses — ikke et L×B×H |
| 4 | frihedsgrader | ikke oplyst | | | Ikke på K1 eller K2. Armen oplyser 6 (K3), men det er et andet produkt |
| 5 | nyttelast gående | `14 kg (30.9 lbs)` — **uklart hvilken type** | — | K1, K2 | Står som `PAYLOAD MOUNTING · Max Weight`. Hverken gående eller stående nævnes. K2's brødtekst skriver samme tal som `up to 14 kg (30 lbs)` — 30 mod 30,9 lbs i **samme dokument** |
| 6 | nyttelast stående | ikke oplyst | | | |
| 7 | maks. hastighed | `1.6 m/s` | — | K1, K2 | |
| 8 | maks. hældning | `±30°` | ± | K1, K2 | Fortegnet er producentens |
| 9 | forhindring enkelt | `300 mm (11.8 in)` — **uklart hvilken type** | — | K1, K2 | Står som `Max Step Height`. Enkelt forhindring eller kontinuerlig trappegang fremgår ikke |
| 10 | trappetrin kontinuerlig | ikke oplyst | | | Se felt 9 |
| 11 | IP-klasse | `IP54` | — | K1, K2 | |
| 12 | driftstemperatur | `-20°C to 55°C` | — | K1, K2 | K2 tilføjer: `*Robot must be powered on at a minimum temperature of 0°C` |
| 13 | batteri Wh | `564 Wh` | — | K1, K2 | Batteriet vejer `5.2 kg (11.5 lbs)` |
| 14 | driftstid | `90 mins`, **ved_last: ikke oplyst** | — | K1, K2 | Fodnote: `*Runtime may vary depending on payloads and environmental factors`. Standby `180 mins` |
| 15 | hot-swap | ikke oplyst | | | Batteriet er aftageligt og specificeres separat, men hot-swap påstås ikke |
| 16 | ladetid | `60 mins` | — | K1, K2 | K2 tilføjer laderens egen tabel: 25 °C → 80 % på `50 min`, 100 % på `2 hrs`; 35 °C → `2.5 hrs` / `3.5 hrs` |
| 17 | dockingstation | Ja — Spot Dock, fuldt specificeret | — | K2 | `1140 × 414 × 403 mm`, `22.9 kg`, ind `90-277 VAC`, ud `58V at 12A`, `0°C to 35°C`, `cTUVus Certified to UL 1564 and CSA C22.2 No. 107.2` |
| 18 | LiDAR | ikke oplyst | | | Basisrobotten har stereokameraer, ikke LiDAR. `TERRAIN SENSING` er `360°`, rækkevidde `4 m (13 ft)`, `Lighting > 2 Lux` |
| 19 | kameraer ~ | `built-in stereo cameras`, `Horizontal Field of View 360°` | — | K1 | **Type uden antal eller model.** Tælles som udfyldt, markeret `~` |
| 20 | onboard compute | ikke oplyst | | | |
| 21 | ROS 2 | ikke oplyst | | | Ikke nævnt på K1 eller K2 |
| 22 | SDK-sprog | `Flexible API and Python SDK` | — | K2 | |
| 23 | autonominiveau | `Manual & Autonomous Operation`, `Object Avoidance`, `Stair & Complex Terrain Navigation`, autonome missioner startet fra dock | — | K1, K2 | Kvalitativt, ikke et niveau på en skala |
| 24 | monteringsinterface | `M5 T-slot rails` | — | K1, K2 | Monteringsfelt `850 mm (L) x 240 mm (W) x 270 mm (H)` |
| 25 | strøm ud V/W pr. port | `Unregulated DC 35-58.8V, 150W per port` | — | K1, K2 | Interval bevaret |
| 26 | dataporte | `DB25 (2 ports)`; `Gigabit Ethernet`; WiFi `2.4GHz / 5GHz b/g/n` | — | K1, K2 | |
| 27 | vejledende pris | ikke oplyst | | K23 | `shop.bostondynamics.com` sælger kasketter og plysfigurer, ikke robotter |
| 28 | tilgængelig i EU | ikke oplyst | | | |
| 29 | CE oplyst | **ikke oplyst — og det er selv en oplysning** | | K2 | Se nedenfor |
| 30 | servicepunkt i EU | ikke oplyst | | | |
| 31 | leveringstid | ikke oplyst | | | |

**Udfyldt: 18.** Tæthed **18/29 = 62,1 %**, **18/31 = 58,1 %**.
Uden de `~`-markerede: 17 → 58,6 % / 54,8 %.

**Op fra 55 % (16/29), og hele forskellen er én kilde.** De to nye felter er
`dockingstation` og `SDK-sprog`; begge står i K2, ikke på produktsiden. Regnet på K1 alene
lander jeg på 16 — samme tal som DATAMODEL.md. Det er både en bekræftelse af den gamle
måling og det klareste argument for D1: **producentens eget datablad flytter tætheden
6-7 procentpoint uden at koste troværdighed**, fordi det ligger på producentens eget domæne
og er dateret.

### CE på Spot: der står ingenting, og det står der tydeligt

Databladets afsnit hedder ordret **`Safety and Compliance, United States`** og indeholder:

- `Designed according to ISO 12100 for risk assessment and reduction methodology and IEC 60204-1 for electrical safety`
- `Emergency Stop meets ISO 13850`
- `EMC: FCC Part 15B`
- `Radio equipment: Incorporates a FCC Part 68 Certified radio system`
- `Laser product = Class 1 eye-safe per IEC 60825-1:2007 & 2014`

Ingen CE. Ingen EU-erklæring. Overskriften afgrænser selv hele afsnittet til USA.
For EU-kolonnen er det ikke et hul — det er et resultat. En dansk køber, der importerer
direkte, bliver selv importør under maskinforordningen, og producenten har på sin egen
dokumentation ikke påstået andet.

*Forbehold: Boston Dynamics sælger i Europa, så der findes med rimelig sandsynlighed
CE-dokumentation i deres `Information for Use`-dokument, som K2 henviser til. Vi har ikke
åbnet det, og feltet skal derfor stå som `ikke oplyst på produktside og datablad`, ikke som
`ingen CE`.*

## 1b. Boston Dynamics — Spot Arm (tilbehør, ikke en selvstændig robot)

| Felt | Værdi | Kilde |
|---|---|---|
| frihedsgrader | `6-degrees of freedom` | K3 |
| rækkevidde | `an almost one meter reach` | K3 |
| løft | `Lift up to 11kg` | K3 |
| træk | `drag up to 25kg` | K3 |
| gribersensorik | `time of flight (ToF)`, `inertial measurement unit (IMU)`, `4k RGB camera in the gripper` | K3 |

Ikke en katalogpost i sig selv. Hører til som `armoption` på Spot-posten — men bemærk, at
`Lift up to 11kg` er et **andet tal end robottens 14 kg nyttelast**, og at de to let
forveksles i en sammenligning.

## 1c. Spot Explorer / Spot Enterprise

**Findes ikke længere som adskilte produkter på producentens side.** K1 nævner hverken
`Explorer` eller `Enterprise` (én forekomst af strengen `Enterprise` i hele HTML-filen, og
den er ikke en produktvariant). Navnene lever videre hos forhandlere og i ældre
dokumentation. **Ingen post oprettes**, og hvis kataloget skal kunne besvare "hvad blev der
af Spot Explorer", hører det hjemme i en `forgænger`/`udgået`-note, ikke som en robot med
tomme felter.

---

# 2. ANYbotics — ANYmal (Generation D)

**Producent:** ANYbotics AG, Hagenholzstrasse 83a, 8050 Zürich, Schweiz (kontor også i San
Francisco). **Status:** i produktion. **Kilde:** K4.

| # | Felt | Værdi som producenten skriver | Op. | Kilde | Note |
|---|---|---|---|---|---|
| 1 | egenvægt | ikke oplyst | | | |
| 2 | mål stående | ikke oplyst | | | |
| 3 | mål sammenfoldet | ikke oplyst | | | |
| 4 | frihedsgrader | ikke oplyst | | | |
| 5 | nyttelast gående | `an additional 10 kg payload` — **uklart hvilken type** | — | K4 | Ordet "additional" er producentens |
| 6 | nyttelast stående | ikke oplyst | | | |
| 7 | maks. hastighed | `0.75 m/s - 2.46 ft/s` | — | K4 | Etiketten er `Normal walking speed`, **ikke maksimum**. 0,75 m/s = 2,46 ft/s — krydstjek OK |
| 8 | maks. hældning | ikke oplyst | | | |
| 9 | forhindring enkelt | ikke oplyst | | | |
| 10 | trappetrin kontinuerlig | ikke oplyst | | | `Safe on open grated stairs` — påstand uden tal |
| 11 | IP-klasse | `IP67` | — | K4 | |
| 12 | driftstemperatur | ikke oplyst | | | `-40–550°C` på siden er **termokameraets måleområde**, ikke robottens driftstemperatur. Let at forveksle ved maskinel udtrækning |
| 13 | batteri Wh | ikke oplyst | | | |
| 14 | driftstid | `90 min` — **ved_last: ikke oplyst** | — | K4 | Samme side skriver også `Walking range (90 - 120 min) per charge`. **To tal, samme side**: 90 og 90-120 |
| 15 | hot-swap | ikke oplyst | | | |
| 16 | ladetid | `100 min for 70% quick charge`; `3 h for full charge` | — | K4 | Begge bevares; ladetid er ikke ét tal her |
| 17 | dockingstation | Ja — `Automatic docking`, flere dockingstationer kan sættes op langs ruten | — | K4 | |
| 18 | LiDAR ~ | `360° Lidar` | — | K4 | Type uden model |
| 19 | kameraer | `6 depth cameras, and 2 optical tele-operation cameras`; zoomkamera `20× optical zoom`; termokamera; ultralydsmikrofon `0—384kHz`; spot `maximal 3790Im` | — | K4 | `3790Im` er sidens egen skrivemåde — næsten sikkert `3790 lm` (lumen) med stort i for l. **Gengives som skrevet, med advarsel** |
| 20 | onboard compute | `2× Intel i7 Core`, `8th gen. Intel 6-core processors` | — | K4 | Producentens egne to formuleringer om samme enhed |
| 21 | ROS 2 | ikke oplyst | | | |
| 22 | SDK-sprog | ikke oplyst | | | |
| 23 | autonominiveau | Autonome inspektionsmissioner; `AI-based mobility and autonomy`; automatisk docking ved lav batteristand | — | K4 | Kvalitativt |
| 24 | monteringsinterface | ikke oplyst | | | `Payload expandable` — uden interface |
| 25 | strøm ud | ikke oplyst | | | |
| 26 | dataporte | ikke oplyst | | | `Built-in WIFI & 4G/LTE` er forbindelse, ikke en port |
| 27 | vejledende pris | ikke oplyst | | | |
| 28 | tilgængelig i EU | ikke oplyst | | | Schweizisk producent; Schweiz er ikke EU. Adressen er hovedkontor, ikke en tilgængelighedserklæring |
| 29 | CE oplyst | **`FCC, CE and Anatel compliant`** | — | K4 | Se F6 i DATAMODEL.md — den holder |
| 30 | servicepunkt i EU | ikke oplyst | | | |
| 31 | leveringstid | ikke oplyst | | | |

**Udfyldt: 11.** Tæthed **11/29 = 37,9 %**, **11/31 = 35,5 %**.
Uden de `~`-markerede: 10 → 34,5 % / 32,3 %.

**Vigtigt: det er ikke 28 % længere, og der er ikke kommet nye data til.**
DATAMODEL.md talte 8/29 på samme side, samme dato. Jeg tæller 11. Forskellen er ikke
observationer, det er **tællereglen**: jeg tæller ladetid, dockingstation, onboard compute
og autonominiveau som udfyldte, fordi producenten oplyser dem eksplicit, om end ikke som
tal med SI-enhed. Dét er D4, og det er dyrere end det ser ud: **samme robot, samme kilde,
samme dag — 28 % eller 38 % alt efter en regel, der ikke er skrevet ned endnu.**
Tætheden kan ikke bruges som rangering, før reglen står fast og er offentliggjort på
`/metode/`.

**K22 (`anymal-specifications-sheet`) er en formular, ikke et dokument.** Der er ingen
PDF-URL på siden — den eneste PDF, der linkes fra hele domænet uden formular, er deres
etiske kodeks. Et komplet ANYmal-datablad findes altså, men kun mod kontaktoplysninger.
Det er en beslutning for `/metode/`: henter vi gated datablade, og hvordan daterer vi dem?

---

# 3. ANYbotics — ANYmal X

**Producent:** ANYbotics AG, Zürich, Schweiz. **Status:** i produktion. **Kilde:** K5.

**Producenten oplyser ingen tal.** Specifikationsafsnittet på produktsiden består af én
sætning: **`2026 ANYmal X specifications coming soon.`**

| # | Felt | Værdi som producenten skriver | Kilde | Note |
|---|---|---|---|---|
| 11 | IP-klasse | `IP67 : Water and dust ingress protection` | K5 | |
| 18 | LiDAR ~ | `Lidar Scanner` — `360° environment scanning` | K5 | Type uden model |
| 19 | kameraer | Zoomkamera `20x optical zoom`; termokamera `-10° to +400°C`; mikrofon; pan-tilt `+/- 90° vertical, +/- 165° horizontal` | K5 | Fortegnene er producentens |
| 23 | autonominiveau | `fully autonomous data gathering`; fjernstyring i zone | K5 | Kvalitativt |
| 29 | CE oplyst | `FCC and CE compliant`; `Complies with CE directives for industrial deployment` | K5 | |
| — | **Ex-certificering** | **`ATEX & IECEx certified up to Zone 1 IIB`**; `Certified for up to Zone 1 where inflammable gases are likely to occur`; `intrinsically safe` | K5 | **Findes ikke i det nuværende skema** |
| — | gassensor | Valgfri nyttelast, brandbare og giftige gasser | K5 | |

Alle øvrige 25 felter: **ikke oplyst**.

**Udfyldt: 5.** Tæthed **5/29 = 17,2 %**, **5/31 = 16,1 %**.
Uden de `~`-markerede: 4 → 13,8 % / 12,9 %.

**Det her er projektets bedste argument, og det ligner et nederlag.** Den robot i feltet,
der har den stærkeste europæiske certificering — ATEX og IECEx op til Zone 1 IIB, det
papir der afgør, om en maskine overhovedet må ind på et raffinaderi — har den næstlaveste
specifikationstæthed i hele indsamlingen. **Tæthed måler åbenhed, ikke egnethed**, og
ANYmal X er beviset på, at de to ikke er samme størrelse. Hvis kataloget sorterer på
tæthed som standard, lander den robot, en dansk procesindustri faktisk må købe, i bunden.
Det skal designet svare på — ikke ved at fifle med tallet, men ved at EU-kolonnen har
mindst lige så meget vægt i katalogvisningen som tætheden.

**Skemaet mangler et felt.** ATEX/IECEx-zoneklassifikation kan ikke skrives ind i nogen af
de 31 felter uden at blive kvalt i `CE oplyst`. Forslag: `ex_certificering` med
`{ standard: ATEX | IECEx, zone: 0|1|2, gasgruppe: IIA|IIB|IIC }` — og `ikke oplyst` som
førstegangsværdi for alle andre poster i kataloget.

---

# 4. Ghost Robotics — Vision 60 (Q-UGV)

**Producent:** Ghost Robotics, Philadelphia, USA. **Status:** i produktion.
**Kilder:** K6 (produktside), K7 (datablad, `SPECSHEET V3.3`, `©2024`, direkte download fra K6).

| # | Felt | Værdi som producenten skriver | Op. | Kilde | Note |
|---|---|---|---|---|---|
| 1 | egenvægt | `Tare: 51kg (112 lbs)` | — | K6, K7 | `Tare` = tom. 51 kg = 112,4 lb — OK |
| 2 | mål stående | `Overall length: 950mm (37.5in)` · `Overall width: 570mm (22.5in)` · `Overall height (standing): 685mm (27in)` | — | K6, K7 | Desuden `Body width: 250mm (10in)`, `Ride height: 419mm (16.5in)` |
| 3 | mål sammenfoldet | ikke oplyst | | | |
| 4 | frihedsgrader | `3 Degrees of Freedom per leg, 12-Motor back-drivable drive-train` | — | K6, K7 | 12 i alt. `capable of inverted operation` |
| 5 | nyttelast gående | `10 kg (22 lbs) payload weight` — **uklart hvilken type** | — | K6, K7 | `User-selectable payload compensation mode` |
| 6 | nyttelast stående | ikke oplyst | | | |
| 7 | maks. hastighed | `Standard walk 0.9m/s (2 mph). Up to 1.2m/s (2.7 mph) fast-walk; and 2.4m/s (4.9 mph; working towards 3.0m/s 6.7 mph) sprint` | — | K6, K7 | **To fejl i ét felt**, se nedenfor |
| 8 | maks. hældning | ikke oplyst | | | `climbs steep hills` — uden tal |
| 9 | forhindring enkelt | ikke oplyst | | | `Footstep planning over curbs and grated surfaces` — uden tal |
| 10 | trappetrin kontinuerlig | ikke oplyst | | | `Perception aided stair climbing` — uden tal |
| 11 | IP-klasse | `IP67` | — | K6, K7 | K7 uddyber: `submerged in up to 1 meter of water for up to 30 minutes` |
| 12 | driftstemperatur | `-40º to 55º C (-40º to 131º F)` | — | K6, K7 | Med forbehold: `Cold start not possible below -20ºC. Charging rate decreases above 40º C, no charging below 0º C` |
| 13 | batteri Wh | ikke oplyst | | | Ingen Wh nogen steder. **Vores beregnede felt `Wh pr. driftstime` kan ikke regnes for denne robot** |
| 14 | driftstid | `3.15 hours of continuous walking at 0.9 m/s` — **ved_last: ikke oplyst**, men **ved_hastighed: 0,9 m/s** | — | K6, K7 | Også `21 hours of standby time (sensors, compute, radio on)`, `10km (terrain and payload dependent)`. K6's punktliste skriver samme tal som `3+ hours` |
| 15 | hot-swap | `Quick-swap sub-assemblies within minutes (legs, battery, front & rear sensor heads)` | — | K6, K7 | "within minutes" er ikke hot-swap i drift — noteret som **delvist** |
| 16 | ladetid | `Standard battery charge time approx. 3 hours` | ≈ | K6, K7 | |
| 17 | dockingstation | Ja — `Wireless Charge Kit`, `Wireless charging station for persistent 24x7 operation` | — | K7 | Findes kun i databladet, ikke på produktsiden |
| 18 | LiDAR | ikke oplyst som basis | | K6 | `Integrated Sensors` indeholder ingen LiDAR. LiDAR findes som nyttelast (`Security Payload`), og `Mission Control` beskriver `3D lidar-based SLAM`. **Tælles ikke som basisspecifikation** |
| 19 | kameraer | `5 x RGB (1080p resolution), 4 x D435 depth sensors, dual antenna RTK GPS` | — | K6, K7 | Eneste post i indsamlingen med kameramodel (`D435`) |
| 20 | onboard compute | `NVIDIA® Xavier 32GB RAM w/ 16 channel GMSL2, 2TB NVMe SSD` | — | K6, K7 | |
| 21 | ROS 2 | `C/C++, ROS, ROS2, MAVLink Compatible, Zeno, ATAK, JSON Mission` | — | K7 | |
| 22 | SDK-sprog | Samme linje: `C/C++, ROS, ROS2`; `Low-level / High-Level / Mission Control API`; simulator `Bullet Physics-based, Windows, Linux, Mac` | — | K7 | |
| 23 | autonominiveau | `Perception Aided Mobility`; `Record-Playback`; `Mission Control`; kollisionsundgåelse for og bag | — | K6, K7 | Tre navngivne niveauer — den mest brugbare beskrivelse i hele indsamlingen |
| 24 | monteringsinterface | `T-slots, M5 tapped holes or 1913 MIL-STD rails, w/ optional body panels` | — | K6, K7 | |
| 25 | strøm ud V/W pr. port | `power: 12V regulated & unregulated 32-42V` | — | K6, K7 | **Volt oplyst, watt ikke.** Halvt felt — talt som udfyldt, se advarsel nedenfor |
| 26 | dataporte | `3 x Ethernet, 1 x USB 3.1, 6 x GMSL2` | — | K6, K7 | Radio: `2.4, 5.8 GHz Wi-Fi & 4G/LTE`, GigE-switch |
| 27 | vejledende pris | ikke oplyst | | | |
| 28 | tilgængelig i EU | ikke oplyst | | | |
| 29 | CE oplyst | **ikke oplyst.** I stedet: `US ECCN: EAR-99 | 8479.50.00.00 Industrial Robots (No ITAR restrictions)` | | K6, K7 | Feltet hedder `Export Control | HC`. Producenten svarer på et **amerikansk eksportspørgsmål**, ikke et europæisk markedsadgangsspørgsmål |
| 30 | servicepunkt i EU | ikke oplyst | | | |
| 31 | leveringstid | ikke oplyst | | | |

**Udfyldt: 19.** Tæthed **19/29 = 65,5 %**, **19/31 = 61,3 %**. Ingen `~`-markerede.

**Højest af de amerikanske, og den slår Spot.** Igen er databladet forskellen: uden K7
mangler ROS 2, SDK og dockingstation, og tallet falder til 16/29 = 55,2 %.

### To fejl i hastighedsfeltet, begge på producentens egen side

1. **Produktsiden modsiger sit eget datablad-afsnit.** Punktlisten øverst skriver
   `Speed: up to 2.5 meters/second (5.6 miles/hour)`. Specifikationstabellen længere nede på
   *samme side* skriver `2.4m/s` som sprint. 2,5 m/s = 5,59 mph — punktlisten er internt
   konsistent. Tabellen er ikke:
2. **`2.4m/s (4.9 mph)` går ikke op.** 2,4 m/s = 5,37 mph. 4,9 mph = 2,19 m/s. Alle andre
   par på linjen er rigtige: 0,9 m/s = 2,01 mph OK · 1,2 m/s = 2,68 mph OK · 3,0 m/s =
   6,71 mph OK. **Kun sprintparret er forkert**, og fejlen står i både K6 og K7.

Begge bevares som producenten skriver dem, med `advarsel`. Det er præcis den sag, F4 i
DATAMODEL.md forudsagde — og bemærk, at den her ikke blev fanget af en faktor-10-regel, men
af en **tolerance på nogle få procent**. Validatoren skal have en procenttolerance, ikke kun
en størrelsesordenstest.

### Advarsel om felt 25

`12V regulated & unregulated 32-42V` giver spænding, men ingen effekt. Spot giver
`35-58.8V, 150W per port`. **De to felter ser ens ud i en tabel og er det ikke.** Enten
skal `strøm ud` deles i `spaending_ud` og `effekt_ud`, eller også skal Ghosts felt vises
med synligt manglende watt. Ellers sammenligner katalogets kolonne to forskellige ting.

---

# 5. Ghost Robotics — Spirit 40

**Findes ikke længere på producentens side.** `https://www.ghostrobotics.io/spirit-40`
svarer **HTTP 404**. Navigationen på K24 indeholder præcis ét produktlink: `/vision-60`.

**Ingen felter indsamlet.** Der findes specifikationer hos forhandlere og i
tredjepartsdatabaser; **de er ikke hentet**, fordi de ikke kan dateres mod producenten og
ville give posten en falsk friskhed.

Det er en katalogbeslutning, ikke et datapunkt: **hvad gør vi ved robotter, producenten har
holdt op med at omtale?** Forslag: `status: udgået`, alle talfelter `ikke oplyst`, og en
synlig linje om, at producenten ikke længere publicerer specifikationer. Det er mere værd
for en indkøber end en afskrift fra en forhandler — og det er en oplysning, ingen anden
oversigt giver.

---

# 6. Rainbow Robotics — RBQ-10

**Producent:** Rainbow Robotics, Daejeon, Sydkorea. **Status:** i produktion.
**Kilder:** K12 (produktside), K13 (producentens egen brugermanual).

| # | Felt | Værdi som producenten skriver | Op. | Kilde | Note |
|---|---|---|---|---|---|
| 1 | egenvægt | `42 kg` | — | K12, K13 | K13 præciserer `Weight (with battery)` |
| 2 | mål stående | `98 × 43 × 62 cm (L × W × H)` | — | K12, K13 | |
| 3 | mål sammenfoldet | ikke oplyst | | | |
| 4 | frihedsgrader | `12 joints` — 3 pr. ben (hofte-rul, hofte-nik, knæ) | — | K13 | Ledspecifikation: nominelt moment `40 / 40 / 50 Nm`, maks `104 / 104 / 140 Nm`, maks vinkelhastighed `14.4 / 14.4 / 11.15 rad/s` |
| 5 | nyttelast gående | `Max Payload 15 kg` — **uklart hvilken type** | — | K12, K13 | K13: `Total mass of everything mounted on top of the robot` |
| 6 | nyttelast stående | ikke oplyst | | | |
| 7 | maks. hastighed | `9 km/h (up to 14 km/h in running mode)` | — | K12, K13 | **Modsiges af samme sides eget resumé**, se nedenfor |
| 8 | maks. hældning | `Longitudinal slope: 45%` · `Lateral slope: 20%` | — | K12, K13 | Oplyst i **procent**, ikke grader. 45 % = 24,2°. **Må ikke omregnes stiltiende** — Spots `±30°` og RBQ-10's `45 %` er ikke samme enhed |
| 9 | forhindring enkelt | ikke oplyst | | | |
| 10 | trappetrin kontinuerlig | `Stairs and steps: up to 25 cm` | — | K12, K13 | Sammenlignelig med Unitrees `20-25 cm` |
| 11 | IP-klasse | `IP54` | — | K12, K13 | |
| 12 | driftstemperatur | ikke oplyst | | | |
| 13 | batteri Wh | `18Ah (9Ah x2) / 907Wh`, `Nominal Voltage 50.4V`, `Battery Weight 6.2kg (3.1kg x2)` | — | K13 | Krydstjek: 18 Ah × 50,4 V = 907,2 Wh — **producentens eget tal går op** |
| 14 | driftstid | `2 hours (up to 4 hours)` — **ved_last: ikke oplyst** | — | K12, K13 | |
| 15 | hot-swap | `Swappable / Separate charging / Automatic charging support`; to batterier i basiskonfigurationen | — | K12, K13 | |
| 16 | ladetid | `1h (20 to 80%)` | — | K13 | Ladebetingelsen står **i** tallet — den eneste producent i indsamlingen, der gør det |
| 17 | dockingstation | Ja — `Wireless Charging Station` (tilvalg), automatisk opladning, ArUco-markørdokning inden for 5 m | — | K12, K13 | |
| 18 | LiDAR ~ | `3D LiDAR (optional)` | — | K12, K13 | Type uden model på specifikationssiden; **valgfri**, ikke basis |
| 19 | kameraer | `IMU`, `(RGB + Depth) ×2`, `Depth ×4`; tilvalg `2 MP 32x zoom PTZ camera and thermal camera` | — | K12, K13 | K12's produktside skriver tilvalget som `4K PTZ camera`, K13's manual som `2 MP 32x zoom PTZ` — **konflikt, se nedenfor** |
| 20 | onboard compute | ikke oplyst | | | Ikke i specifikationstabellen |
| 21 | ROS 2 | `ROS 2, DDS integration`; SDK-siden hedder `ROS 2 Humble integration` | — | K12, K13 | Versionen er navngivet — enestående i indsamlingen |
| 22 | SDK-sprog | `RBQ SDK (C/C++)` og `RBQ SDK (ROS2)`; API-niveauer `LV0` (ledniveau) og `LV1` (gang og positur) | — | K12, K13 | |
| 23 | autonominiveau | Patruljering ad forud definerede ruter, forhindringsundgåelse, autonom dokning ved lav batteristand, simulering før udrulning | — | K12, K13 | |
| 24 | monteringsinterface | `Top rail (slot) + spring nuts` | — | K13 | Med udtrykkelig advarsel om at overskride 15 kg |
| 25 | strøm ud | `54 V, 12 V` | — | K12, K13 | **Volt oplyst, watt ikke** — samme problem som Ghost |
| 26 | dataporte | `CAN (1 ch), Gigabit LAN ×3` | — | K12, K13 | Radio: `Wi-Fi / LTE (optional)` |
| 27 | vejledende pris | ikke oplyst | | | |
| 28 | tilgængelig i EU | ikke oplyst | | | |
| 29 | CE oplyst | ikke oplyst | | | **Ikke efterprøvet til bunds** — se review |
| 30 | servicepunkt i EU | ikke oplyst | | | |
| 31 | leveringstid | ikke oplyst | | | |

**Udfyldt: 21.** Tæthed **21/29 = 72,4 %**, **21/31 = 67,7 %**.
Uden de `~`-markerede: 20 → 69,0 % / 64,5 %.

**Højeste tæthed i hele indsamlingen — og det er en koreaner, ikke en amerikaner eller
europæer.** Hypotesen bag DATAMODEL.md's tre poler (billig/kinesisk, etableret/amerikansk,
industriel/europæisk) forudsagde ikke det her. Grunden er strukturel og værd at lære af:
Rainbow Robotics **udgiver hele brugermanualen offentligt** som en statisk side, inklusive
batteridata, ledmomenter, IMU-specifikationer og monteringsinterface. Ingen formular, ingen
login. De andre lægger det i en gated PDF eller slet ikke.

Det giver en test, kataloget kan bruge, og som ingen andre laver:
**publicerer producenten sin brugermanual åbent, ja/nej.** Det er billigt at måle, det er
umuligt at fifle med, og det korrelerer direkte med, hvor meget en indkøber kan vide før
købet.

### To interne modsigelser på RBQ-10-siden

1. **Hastighed.** Resuméet øverst på K12: `Maximum Walking Speed — Walking 6 km/h, running
   14 km/h`. Specifikationstabellen længere nede på samme side og i K13: `9 km/h (up to
   14 km/h in running mode)`. **6 mod 9 km/h for gang.**
2. **Trinhøjde.** Resuméet: `Operating Terrain — Slope 45%, step height 20 cm`.
   Specifikationstabellen: `Stairs and steps: up to 25 cm`. **20 mod 25 cm.**

I begge tilfælde er resuméet det lavere tal. Vi bruger **specifikationstabellen** som værdi
og fører resuméet med som `advarsel`. Ingen af de to kan afvises af os — vi kan kun vise,
at producenten skriver to ting.

3. **PTZ-kameraet.** K12: `4K PTZ camera and thermal camera`. K13: `2 MP 32x zoom PTZ camera
   and thermal camera`. 4K er ca. 8 MP, så `4K` og `2 MP` kan ikke begge passe. Tilvalg,
   ikke basis — men det ryger ind i en tabelkolonne, hvis vi ikke passer på.

---

# 7. MAB Robotics — Honey Badger 5.0

**Producent:** MAB Robotics Sp. z o.o., ul. Za Cytadelą 108, Poznań, Polen.
**EU-producent — den eneste i indsamlingen.** VAT `PL7822870297`.
**Status:** i produktion (afløser 4.0). **Kilde:** K10.

| # | Felt | Værdi som producenten skriver | Kilde | Note |
|---|---|---|---|---|
| 1 | egenvægt | `17 kg` | K10 | |
| 2 | mål stående | `50 x 30 x 13-50 cm` | K10 | **Højden er et interval** — 13-50 cm, altså liggende til fuldt strakt. Bevares som interval |
| 5 | nyttelast gående | `up to 5 kg` — **uklart hvilken type** | K10 | Operator `up to` bevares |
| 11 | IP-klasse | `IP66` | K10 | |
| 12 | driftstemperatur | `0-45°C` | K10 | |
| 14 | driftstid | `up to 2 hours` — **ved_last: ikke oplyst** | K10 | |

Øvrige felter: **ikke oplyst.** Bemærk dog:
`Communication: 5G Wi-Fi or Optic Fibre` · `Control device: PC/Remote controller` ·
`two onboard computers` (uden model) · `open architecture` (uden SDK-sprog eller ROS-version).

**Udfyldt: 6.** Tæthed **6/29 = 20,7 %**, **6/31 = 19,4 %**.

**EU-kolonnen får sit modeksempel her, og det er ubehageligt.** Den eneste EU-producent i
indsamlingen oplyser **intet** om CE på sin produktside — ikke fordi den ikke har det (en
polsk maskine solgt i EU skal have det), men fordi CE er så selvfølgeligt for en
EU-producent, at ingen skriver det. **`CE oplyst = nej` betyder derfor ikke det samme for
en polsk og en amerikansk producent.** Kolonnen må vise `oplyst / ikke oplyst`, aldrig
`har CE / har ikke CE` — ellers udgiver vi vores egen juridiske konklusion, og den har vi
ikke ret til at have.

## 7b. MAB Robotics — Honey Badger 4.0 (udgået)

**Status: udgået.** K11 skriver ordret:
`With the launch of the new version, sales of the Honey Badger 4.0 have officialy come to an
end.` og `Don't worry, we'll support your existing HB4.0 robot during the warranty period.`

| # | Felt | Værdi | Kilde |
|---|---|---|---|
| 1 | egenvægt | `12 kg` | K11 |
| 2 | mål stående | `60 x 40 x 15-50 cm` | K11 |
| 5 | nyttelast | `up to 4 kg` — uklart hvilken type | K11 |
| 11 | IP-klasse | `up to IP67` | K11 | Operatoren `up to` er producentens og skal bevares — det er ikke det samme som `IP67` |
| 12 | driftstemperatur | `0-40°C` | K11 |
| 14 | driftstid | `up to 2 hours` — ved_last: ikke oplyst | K11 |

**Udfyldt: 6.** Tæthed **6/29 = 20,7 %**, **6/31 = 19,4 %**.

**Generationsskiftet går den forkerte vej på to felter**, og det er værd at vise i
kataloget: 5.0 er **tungere** (17 mod 12 kg) og har **lavere tæthedsklasse** (IP66 mod
`up to IP67`) end 4.0, mens nyttelasten stiger (5 mod 4 kg) og driftstemperaturen udvides
(0-45 mod 0-40 °C). En `forgænger`-relation, der viser felt-for-felt-forskellen, ville
gøre præcis den slags synlig — og det er noget, ingen producent selv sætter op.

---

# 8. RIVR (tidligere Swiss-Mile) — RIVR ONE

**Producent:** RIVR Technologies AG, Schweiz (ETH Zürich-udspring). **Status:** i drift hos
kunder; robotten sælges tilsyneladende ikke som produkt, men som leveringstjeneste.
**Kilder:** K8, K9.

Hjul-ben-hybrid. Produktsiden er skrevet til logistikkøbere, ikke til ingeniører.

| # | Felt | Værdi som producenten skriver | Op. | Kilde | Note |
|---|---|---|---|---|---|
| 5 | nyttelast gående | `over 30 kg of parcels, groceries, and food` — **uklart hvilken type** | `over` | K8 | Operatoren bevares |
| 7 | maks. hastighed | `up to 14 km/h (8.7 mph)` | `up to` | K8, K9 | 14 km/h = 8,699 mph — krydstjek OK |
| 16 | ladetid | `recharges in just 2–3 hours` | — | K8 | Interval bevaret |

Alle øvrige 28 felter: **ikke oplyst.** Ingen vægt, ingen mål, ingen IP-klasse, ingen
batteristørrelse, ingen frihedsgrader, ingen driftstid i timer.

**Udfyldt: 3.** Tæthed **3/29 = 10,3 %**, **3/31 = 9,7 %**.

Uden for skemaet, men oplyst: `over 30 km of range` pr. opladning, og en påstand om
`5x the battery life and speed, with 10x the coverage of traditional legged robots` (K9,
teknologisiden) — en **sammenligning uden reference eller metode**, som vi ikke gengiver som
data.

**Bemærk et skemaproblem:** RIVR oplyser **rækkevidde i km**, ikke driftstid i timer. Vores
skema har `driftstid` som felt og `rækkevidde pr. opladning` som et *beregnet* felt
(hastighed × driftstid). Her er det omvendt: producenten oplyser resultatet og ikke
inputtet. Med `over 30 km` og `up to 14 km/h` ville vi kunne regne baglæns til ~2,1 timer —
**det gør vi ikke.** Det ville være et fabrikeret tal med to usikre operatorer ganget
sammen. `driftstid: ikke oplyst`, og `rækkevidde` skal kunne være et **oplyst** felt, ikke
kun et beregnet.

**RIVR TWO** er navngivet i navigationen på K8 uden nogen specifikationer. Ingen post.

---

# 9. Petoi — Bittle X

**Producent:** Petoi LLC, USA (`© 2018-2026, Petoi LLC`). **Klasse: hobby/uddannelse.**
**Status:** i produktion. **Kilder:** K14 (specifikationsside), K15 (produktside).

**Klassemarkering er påkrævet.** Bittle X vejer 269-353 gram. Vision 60 vejer 51 kg. De to
må aldrig stå i samme sorterede liste uden en synlig klasseskillelinje — en sortering på
nyttelast pr. egenvægt ville sætte Bittle X **øverst** i hele kataloget, og det ville være
teknisk korrekt og fuldstændig misvisende.

| # | Felt | Værdi som producenten skriver | Kilde | Note |
|---|---|---|---|---|
| 1 | egenvægt | `269 - 353 grams(9.5 - 12.5oz)` | K14 | **Interval** — afhænger af servotype (plast eller legering). 269 g = 9,49 oz OK · 353 g = 12,45 oz OK |
| 2 | mål stående | `190 x 153 x 107mm(7.48 × 6.02 × 4.21 inches)` | K14 | Etiket: `Standing robot dimensions`. Alle tre krydstjek OK |
| 4 | frihedsgrader | `9` — `2 joints on each leg and 1 joint on its neck` | K14, K15 | `Number of joints powered by servos: 9`; kortet leverer 12 PWM-kanaler |
| 5 | nyttelast gående | `1lb` — **uklart hvilken type** | K15 | **Kun imperialt.** Ingen metrisk værdi oplyst. 1 lb = 0,4536 kg, men det er vores omregning, ikke producentens |
| 7 | maks. hastighed | `A safe fast speed is 2 body lengths/second, or 40mm/second` | K15 | **Internt umuligt**, se nedenfor |
| 13 | batteri | `7.4V 1000mAh`, Li-ion, `Current typ./max. 2A/5A` | K14 | **Wh ikke oplyst.** 7,4 V × 1,0 Ah = 7,4 Wh, men det er vores udregning |
| 14 | driftstid | `1 hour` — **ved_last: ikke oplyst** | K14, K15 | `Battery life: 1 hour`; produktsiden: `1-hour playtime` |
| 16 | ladetid | `1.5 hours` | K14 | Lader `USB 5V 1A`, `Charger included: No` |
| 20 | onboard compute | `Biboard` — `ESP32-WROOM-32D 520K SRAM 16MB QSPI Flash`; IMU `6-Axis MPU6050 or icm42670 depending on chip availability` | K14 | Raspberry Pi kan monteres på sokkel |
| 22 | SDK-sprog | `Petoi Coding Blocks` (blokbaseret), `Arduino IDE`, `OpenCat Python API sending serial commands`, C++ | K14, K15 | Open source: `OpenCat` |
| 26 | dataporte | `Grove 4`, `USB Type-C Port`, `Serial UART, I2C network, speaker, Bluetooth, WiFi` | K14 | |
| 27 | vejledende pris | `$319.00` USD (billigste variant) | K15 | Seks varianter, `$319.00`-`$469.00` USD. Prisen står i sidens strukturerede data med valuta USD |

Ikke oplyst: mål sammenfoldet · nyttelast stående · hældning · forhindring · trappetrin ·
IP-klasse · driftstemperatur · hot-swap · dockingstation · LiDAR · kameraer (tilvalg, ikke
basis) · ROS 2 · autonominiveau · monteringsinterface · strøm ud · tilgængelig i EU · CE ·
servicepunkt i EU · leveringstid.

**Udfyldt: 12.** Tæthed **12/29 = 41,4 %**, **12/31 = 38,7 %**. Ingen `~`-markerede.

**En hobbyrobot til 319 dollars oplyser mere end en industrirobot til Zone 1.** Bittle X
ligger over ANYmal (37,9 %) og langt over ANYmal X (17,2 %). Det er den mest kontraintuitive
enkeltobservation i indsamlingen, og den er værd at vise frem, netop fordi tætheden **ikke**
måler kvalitet. En hobbyproducent, der sælger til gør-det-selv-folk, *skal* oplyse
kortmodellen og batterispændingen, ellers kan kunden ikke bruge produktet. En
industriproducent sælger gennem en sælger og et møde. **Tæthed måler forretningsmodel lige
så meget som åbenhed** — og det bør stå på `/metode/`, ellers læses tallet som en karakter.

### Hastighedsfeltet kan ikke passe, og robottens egne mål beviser det

K15 skriver: `A safe fast speed is 2 body lengths/second, or 40mm/second.`

K14 oplyser kropslængden: `190 x 153 x 107mm`. To kropslængder pr. sekund er altså
**380 mm/s**, ikke 40 mm/s. De to halvdele af producentens egen sætning afviger med
**faktor 9,5**, og det kan afgøres udelukkende med producentens egne tal fra producentens
egen anden side.

`40mm/second` er desuden usandsynligt i sig selv: det er 2,4 meter i minuttet.
Sandsynligvis skal der stå `40 cm/second` (= 400 mm/s ≈ 2 kropslængder/s). **Vi retter det
ikke.** Feltet får begge udsagn og en `advarsel`.

Det er også et **krydstjek, validatoren ikke kan lave endnu**: den sammenligner metrisk mod
imperial i samme felt. Den her fejl kræver, at `hastighed` holdes op mod `længde` — altså en
regel *på tværs af felter*. Værd at bygge; det er tredje gang i denne indsamling, at
producentens egne to tal modsiger hinanden.

### En modsigelse mere, på tværs af to Petoi-sider om samme produkt

- K14 (Bittle X-specifikation): `Charging cable — A USB Type-C to USB cable is included.`
- K15 (Bittle X-produktside, FAQ): `The kit does not include a charger but a Micro-USB to
  USB cable.`

K16 (Bittle v1, den ældre model) skriver `Micro-USB to USB cable included` og `Charge time
2h`. **FAQ-teksten på Bittle X-siden ser ud til at være arvet uændret fra Bittle v1.**
Lille sag, stor lære: **den samme producent kan have to sider om samme produkt, der ikke er
opdateret sammen.** Vores `kilde`-felt skal pege på den *specifikke* side, ikke på
producenten — ellers kan en fejl ikke spores tilbage.

## 9b. Petoi — Bittle (v1)

**Status:** `Bittle Robot Dog(Final Stock)` i producentens egen navigation — **på vej ud**.
**Kilder:** K16, K17.

| # | Felt | Værdi | Kilde | Note |
|---|---|---|---|---|
| 1 | egenvægt | `265g - 290g(9.3oz - 10.2oz)` | K16 | |
| 2 | mål stående | `200 x 110 x 110mm, 7.9 x 4.3 x 4.3inch` | K16 | Etiket `Dimensions`, ikke `Standing robot dimensions` som på X — **ikke sikkert samme målemetode** |
| 4 | frihedsgrader | `9` | K16, K17 | |
| 5 | nyttelast | `1lb` — uklart hvilken type | K17 | |
| 7 | maks. hastighed | `2 body lengths/second, or 40mm/second` | K17 | Samme umulighed som Bittle X |
| 11 | IP-klasse | **`nej`, ikke `ikke oplyst`** — `Is Bittle waterproof? No. But Bittle can walk in the shadow water area.` | K17 | **Eneste eksplicitte nej i hele indsamlingen.** Præcis den tredje tilstand, PLAN.md kræver kan skelnes |
| 13 | batteri | `7.4V 1000mAh`, `Current typ./max. 2A/5A` | K16 | |
| 14 | driftstid | `1 hour` — ved_last: ikke oplyst | K16 | |
| 16 | ladetid | `2h` | K16 | **Bittle X oplyser 1.5 hours** — forskellige modeller, forskellige tal, begge korrekte |
| 20 | onboard compute | `NyBoard V1 - Arduino Uno-compatible`, `ATMega328P`, IMU `6-Axis MPU6050`, `16` PWM-kanaler, `7` RGB LED | K16 | |
| 22 | SDK-sprog | `Petoi Coding Blocks`, `Arduino IDE`, `OpenCat Python API` | K16 | |
| 26 | dataporte | `Grove 4`, `Serial UART, I2C network, infrared receiver, buzzer`; Bluetooth og WiFi via dongle | K16 | |
| 27 | vejledende pris | `$289.00` USD (billigste variant) | K17 | |

**Udfyldt: 13.** Tæthed **13/29 = 44,8 %**, **13/31 = 41,9 %**.
Den **højeste** af Petoi-modellerne — udelukkende fordi den siger `nej` til vandtæthed.
Det er i sig selv et argument for at behandle `nej` som en udfyldt værdi: en producent, der
tør skrive nej, giver køberen mere end en, der tier.

## 9c. Petoi — Nybble Q

**Robotkat, firbenet.** Efterfølger til Nybble. **Kilder:** K18, K19.

| # | Felt | Værdi | Kilde | Note |
|---|---|---|---|---|
| 1 | egenvægt | `403 to 433 grams(14.2 to 15.3 oz)` | K18 | |
| 2 | mål stående | `240 x 115 x 150mm(9.45 × 4.53 × 5.91 inches)` | K18 | |
| 4 | frihedsgrader | `11` — `2 joints per leg, 2 joints in the head, and 1 joint in the tail—totaling 11 joints` | K18, K19 | |
| 13 | batteri | `7.4V 1000mAh`, `Current(typical/max) 2A/5A` | K18 | |
| 14 | driftstid | `1 hour` — ved_last: ikke oplyst | K18, K19 | |
| 16 | ladetid | `1.5 hours` | K18 | |
| 20 | onboard compute | `Biboard`, `ESP32-WROOM-32D 520K SRAM 4MB QSPI Flash` | K18 | **4MB flash mod 16MB på Bittle X** — samme kortnavn, forskellig konfiguration. En sammenligning på kortnavn alene ville skjule det |
| 22 | SDK-sprog | `Petoi Coding Blocks`, `Arduino IDE`, `OpenCat Python API` | K18, K19 | |
| 26 | dataporte | `Grove 4`, `USB Type-C Port`, `Serial UART, I2C network, buzzer`, indbygget Bluetooth og WiFi | K18 | |
| 27 | vejledende pris | `$435.00` USD (billigste variant) | K19 | Varianter `$435.00` og `$515.00` |
| — | ramme | `3D-printed` (Bittle X: `Plastic`) | K18 | Uden for skemaet |

**Nyttelast ikke oplyst** for Nybble Q — Bittle-siderne oplyser `1lb`, katsiden gør ikke.
**Udfyldt: 10.** Tæthed **10/29 = 34,5 %**, **10/31 = 32,3 %**.

---

# 10. MangDang — Mini Pupper og Mini Pupper 2

**Producent:** MangDang. **Klasse: hobby/uddannelse.** **Kilder:** K20, K21.

**Producenten oplyser næsten ingen tal i tekst.** Produktsiderne henviser til
`A detailed breakdown of hardware specs, module integration, and system performance across
both generations` — men **den tabel er et billede**, ikke tekst. Der findes ingen målbare
værdier for vægt, mål, batteri, frihedsgrader, hastighed eller driftstid i sidens tekst.
Det er efterprøvet både i rå HTML og gennem en rendering af siden.

| # | Felt | Værdi | Kilde | Note |
|---|---|---|---|---|
| 21 | ROS 2 | `Use ROS2 for simulation, SLAM, and navigation functions`; `ROS2 Tech: Run SLAM and Navigation projects instantly` | K20, K21 | |
| 22 | SDK-sprog | Python — `simple forward kinematics sample code ... Run it on Windows or Ubuntu with Python` | K20, K21 | |
| 27 | vejledende pris | Mini Pupper `$649.00` USD; Mini Pupper 2-siden viser `$399.00`, `$604.00` og `$649.00` | K20, K21 | **Hvilken variant der er basis, fremgår ikke af teksten.** Registreres som interval med advarsel |

Alle øvrige 28 felter: **ikke oplyst.**

**Udfyldt: 3.** Tæthed **3/29 = 10,3 %**, **3/31 = 9,7 %** — **laveste i indsamlingen.**

Oplyst uden tal: LiDAR som tilvalg (`STL-06P Lidar module`, tidligere `LD06`), kamera som
tilvalg (`Raspberry Pi camera v2`, ikke inkluderet af hensyn til privatliv),
Raspberry Pi CM4 nævnt i variantnavne (`Upgrade Kit+CM4102000`) uden RAM- eller
lagerangivelse i tekst.

**Fund til billedbeslutningen (Å3) og til `/metode/`:** en producent kan have alle sine
specifikationer offentligt tilgængelige og alligevel score 10 %, fordi de ligger i en PNG.
**Specifikationstæthed måler også, om producenten publicerer maskinlæsbart.** Det er en
reel egenskab ved en leverandør — et datablad, der kun findes som billede, kan ikke
indlæses i en indkøbsdatabase, ikke oversættes og ikke søges — men det er ikke det samme som
hemmelighedskræmmeri, og forskellen skal stå på metodesiden.

---

# 11. Undersøgt, men ingen post oprettet

| Producent og model | Land | Hvorfor ingen post |
|---|---|---|
| **Kawasaki — RHP Bex** | Japan | Firbenet hjul-ben-hybrid, som kan bæres af en rytter. **Ingen produktside med specifikationer** på `kawasakirobotics.com`. Bex er en forskningsplatform under `Robust Humanoid Platform`, ikke et katalogprodukt. Tal cirkulerer i pressen (fx en bæreevne på 100 kg), men **ikke fra Kawasaki selv** — ikke indsamlet |
| **Ghost Robotics — Spirit 40** | USA | 404 på producentens side, ikke i navigationen. Se afsnit 5 |
| **Boston Dynamics — Spot Explorer / Enterprise** | USA | Ikke længere adskilte produkter på producentens side. Se afsnit 1c |
| **RIVR TWO** | Schweiz | Navngivet i navigationen, ingen specifikationer |
| **Hyundai** | Sydkorea | Ejer Boston Dynamics; **ingen egen firbenet model** fundet. Hyundai Rotem har annonceret samarbejde med Rainbow Robotics om en flerbenet forsvarsrobot — annoncering, intet produkt, ingen specifikationer |
| **Honda** | Japan | Ingen firbenet model fundet |
| **Tekniker** | Spanien | Forskningscenter, ikke producent af en kommerciel firbenet robot. Ingen produktside fundet |

**Ikke nået i denne runde** — kandidater til næste: Unitree-forhandlede EU-varianter (hvis
de findes som selvstændige produkter med egen CE-erklæring), Deep Robotics EU-repræsentation
(kinesisk producent, men EU-kolonnen er stadig relevant), ETH-udspring ud over RIVR, og
universitetsafledte produkter fra Sydkorea og Japan ud over RBQ.
