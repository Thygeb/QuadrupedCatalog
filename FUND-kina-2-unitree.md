# FUND-kina-2 — Unitree Robotics, indsamlet om med gemte råkilder

Indsamlet 19. august 2026. Erstatter Unitree-delen af `FUND-kina.md`, som er
**ubekræftbar** (STATUS.md D6: råsiderne blev aldrig gemt).

**Denne indsamling er efterprøvelig.** 16 råsider ligger i hovedrepoet under
`media/_kilder/raa-kina-unitree-2026-08-19/` med `MANIFEST.tsv` ved siden af. Hvert tal
i dette dokument er søgt tilbage i den gemte fil — se afsnit 8.

---

## 1. Skill-vurdering

**Valgt: `robotdata`.** Kaldt med `/robotdata`, og den **indlæste normalt** — intet
`Unknown skill`, intet fallback fra disk. Den bærer de ti hårde regler, feltets YAML-form,
tællereglen og det obligatoriske selv-tjek, og hele opgaven er en robotpost-indsamling.

Gået forbi, med begrundelse:

| Skill | Hvorfor ikke |
|---|---|
| `parallelt` | Bærer worktree-opsætning og prompt-tjekliste for den, der **fordeler** arbejdet. Jeg er ét spor i en allerede opsat worktree; jeg fordeler ikke noget |
| `impeccable`, `critique`, `ui-ux-critique`, `frontend-design`, `design`, `dataviz` | Design- og IA-skills. Der er ikke bygget noget at kritisere; PLAN.md siger udtrykkeligt, at visuel retning kører **efter** dataindsamlingen |
| `new-project` | Scaffolding. Repoet findes, og der skrives ikke kode endnu |
| `code-review`, `simplify` | Generatoren findes ikke. De tre småscripts, jeg skrev i `tools/`, er engangsværktøj, ikke produktkode |
| `claude-api`, `android-*`, `ui-ux-pro-max:*` | Andre teknologier |

---

## 2. Råkilder — det, der manglede sidst

Alle 16 filer hentet med `curl` (HTTP 200 på alle 16, kontrolleret med
`-w '%{http_code}'`, ikke bare "der kom bytes"). **Ingen 404, 403 eller tomme sider**, og
derfor ingen fejlsider gemt under et navn, der lover indhold.

Gemt i **hovedrepoet**, ikke i worktreen:
`C:\Praktik\websites\udstilling\media\_kilder\raa-kina-unitree-2026-08-19\`

Navngivning efter `media/_kilder/LÆSMIG.md`: `<producent>-<model>-<hvad>-<hentedato>.<ext>`.

`MANIFEST.tsv` ligger i samme mappe, tabulatorsepareret, én linje pr. fil, med kolonnerne
**filnavn · kilde\_url · http\_status · hentet\_utc · sha256 · bytes · indhold · sprogversion**.

Om `hentet_utc`: det er filens mtime, som **er** downloadtidspunktet — filerne er skrevet
direkte af `curl -o` og ikke rørt siden. Jeg har ikke hentet dem om for at få et
"pænere" tidsstempel; det ville have givet et tidsstempel, der ikke passer til bytes.

| Fil (14 produktsider + 2 shopsider) | URL |
|---|---|
| `unitree-forside-nav-2026-08-19.html` | `https://www.unitree.com/` |
| `unitree-b2-produktside-2026-08-19.html` | `https://www.unitree.com/b2` |
| `unitree-b2-w-produktside-2026-08-19.html` | `https://www.unitree.com/b2-w` |
| `unitree-a2-produktside-2026-08-19.html` | `https://www.unitree.com/A2` |
| `unitree-a2-w-produktside-2026-08-19.html` | `https://www.unitree.com/A2-W` |
| `unitree-as2-produktside-2026-08-19.html` | `https://www.unitree.com/As2` |
| `unitree-as2-w-produktside-2026-08-19.html` | `https://www.unitree.com/As2-W` |
| `unitree-go2-produktside-2026-08-19.html` | `https://www.unitree.com/go2` |
| `unitree-go2-w-produktside-2026-08-19.html` | `https://www.unitree.com/go2-w` |
| `unitree-go1-produktside-2026-08-19.html` | `https://www.unitree.com/go1` |
| `unitree-b1-produktside-2026-08-19.html` | `https://www.unitree.com/b1` |
| `unitree-aliengo-produktside-2026-08-19.html` | `https://www.unitree.com/aliengo` |
| `unitree-a1-produktside-2026-08-19.html` | `https://www.unitree.com/A1` |
| `unitree-b1-16-produktside-2026-08-19.html` | `https://www.unitree.com/b1-16` (bevis for en **udelukkelse**, se 3) |
| `unitree-b2-shopside-2026-08-19.html` | `https://shop.unitree.com/products/unitree-b2` |
| `unitree-a2-shopside-2026-08-19.html` | `https://shop.unitree.com/products/unitree-a2` |

**Alle produktsider er server-renderede** (Nuxt med SSR), så hele specifikationstabellen
står i den gemte HTML. Det er værd at vide for næste indsamler: her er `curl` nok, og
ingen post i dette dokument mangler en gemt kilde.

---

## 3. Modelafgrænsning — hvad forsiden faktisk viser

Forsidens navigation blev læst i stedet for at antage listen. Firbenede robotter,
12 stk., og det er **præcis** de 12, opgaven nævnte:

`B2 · B2-W · A2 · A2-W · As2 · As2-W · Go2 · Go2-W · Go1 · B1 · AlienGo · A1`

**A1 og As2-W er nu indsamlet.** De manglede helt i `FUND-kina.md`.

**En kandidat blev udelukket.** Forsiden linker til `/b1-16`, og navnet ligner en
B1-variant. Siden blev hentet og læst: **B1-16 er en vandtæt ledmotor (IP68), en
komponent — ikke en robot.** Sidefoden på alle produktsider bekræfter det ved at føre
"Super Robot Waterproof Joints B1-16" under *Components* sammen med motorer og servoer,
mens de 12 ovenfor står under *Robot*. Siden er gemt, så udelukkelsen kan efterprøves i
stedet for at skulle tros.

Ikke-firbenede, som forsiden også fører, og som ikke hører til her: H2, H2 Plus, H1,
G1, R1 (humanoider), Z1, D1-T (arme), Dex1-1/2-5/3-1/5-1 (hænder), L1/L2 (LiDAR),
GO-M8010-6, IM6014, SV1-25, B1-16 (komponenter).

### Varianter er ikke modeller

Fem af de tolv sider er varianttabeller med flere kolonner. Det er ikke pynt — kolonnerne
er **forskellige maskiner**, og en post, der kun gemmer én kolonne, taber det meste:

| Model | Varianter på siden | Spænd, der ville gå tabt |
|---|---|---|
| Go2 | AIR · PRO · X · EDU | Pris $1600→$4500; hastighed 2,5→3,7 m/s |
| Go1 | Air · Pro · Edu | Pris $2700→$3500; nyttelast ≈4→≈6 kg |
| As2 | AIR · PRO · X · EDU | Stående last ~45→~65 kg; IP "/"→IP54 |
| As2-W | X · EDU | Kun ladestation og udvidelsesdok adskiller dem |
| A2 / A2-W | (base) · PRO | Sensor 1→2 LiDAR; IP56→IP56-IP67 |

---

## 4. Tællereglen — så en anden kan genregne det

STATUS.md **D7 er ikke lukket**: skemaets overskrifter siger 29, den opremsede feltliste
indeholder 31. Jeg træffer ikke beslutningen. Jeg opgiver **begge**, i to adskilte
tabeller, og her er reglen mekanisk nok til at kunne genkøres.

### 4.1 Nævneren

**31-listen** er DATAMODEL.md's feltliste efter F1 og F2:

- Fysik (12): egenvægt · mål stående · mål foldet · frihedsgrader · nyttelast gående ·
  nyttelast stående · maks. hastighed · maks. hældning · forhindring enkelt ·
  trappetrin kontinuerlig · IP-klasse · driftstemperatur
- Energi (5): batteri Wh · driftstid · hot-swap · ladetid · dockingstation
- Sensorik (6): LiDAR type og model · kameraer · onboard compute · ROS 2 · SDK-sprog ·
  autonominiveau
- Nyttelast (3): monteringsinterface · strøm ud · dataporte
- Kommercielt og EU (5): pris · tilgængelig i EU · CE oplyst · servicepunkt i EU ·
  leveringstid

**29-listen er den samme måling** med to sammenlægninger, og det er den eneste forskel:

```
n29 = n31
      − 1 hvis BÅDE nyttelast_gaaende OG nyttelast_staaende er udfyldt
      − 1 hvis BÅDE forhindring_enkelt OG trappetrin_kontinuerlig er udfyldt
```

Det følger af D7's egen forklaring: 29-listen havde nyttelast som ét felt og trinhøjde
som ét felt. Identitetsfelterne tæller ikke med i nogen af de to.

### 4.2 Hvornår tæller et felt som udfyldt

1. Producenten oplyser en **værdi med enhed** på sin egen side, og strengen står i den
   gemte råfil.
2. **D4 følges som skillen foreskriver:** type uden model tæller **ikke**. `3D LiDAR ×1`,
   `Industrial-grade 64~128-line LiDAR`, `Radar: 2D or 3D optional` er alle **ikke**
   udfyldt. Kun As2 AIR (`Unitree L2`) og Go2 (`4D LiDAR L2`) tæller — der står et
   modelnavn. Det er derfor `lidar_type_og_model` kun har dækning hos 2 af 12.
3. **Varianttabeller:** feltet tæller som udfyldt, hvis det er oplyst for **mindst én**
   variant. Begrundelsen er, at posten dækker modelfamilien; at As2 AIR ikke har
   ladestation er en variantforskel, ikke en manglende oplysning.
4. En eksplicit `/` i en variantkolonne, hvor andre kolonner har en værdi, læses som
   **"nej"** — ikke som "ikke oplyst". Det er regel 10, og det rammer kun As2 AIR's
   `Protection Rating /`.
5. **"Contact Sales" er ikke en pris.** Det tæller som ikke oplyst.
6. `strøm ud V/W pr. port` er talt som udfyldt, når **spændingen** er oplyst. Ingen af
   de tolv oplyser watt. Reglen er anvendt ens på alle tolv, så tallene er indbyrdes
   sammenlignelige — men feltet er reelt kun halvt oplyst hos alle. Det bør skrives ind
   i skemaet, hvis W skal kunne kræves.

### 4.3 To grænsetilfælde, jeg afgjorde konservativt — læs dem, hvis I vil genregne

Begge kunne være talt den anden vej. Jeg skriver dem frem, så nævneren ikke stille
kommer til at afhænge af mit skøn.

- **Frihedsgrader hos Go2, Go2-W og Go1.** Siderne skriver ikke "Degrees of Freedom",
  men `Aluminum knee joint motor 12 set` / `16` / `Silver alloy precision joint motor
  12 piece`. Jeg **talte dem med**, fordi AlienGos egen side bruger overskriften
  *"Degrees of Freedom (number of motors)"* og dermed viser, at Unitree selv sætter
  lighedstegn. Regner man strengere, falder Go2 til 13/31, Go2-W til 9/31, Go1 til 8/31.
- **ROS hos AlienGo.** Siden skriver `supports C/C++, ROS` og `Environment Sensing:
  Ubuntu-ROS`. Feltet hedder **ROS 2**, og versionen står der ikke. Jeg talte det
  **ikke** med som ROS 2 — at gøre det ville være at opfinde et versionsnummer. `ROS`
  uden version er ført som fund i stedet. Derfor har `ros2` nul dækning hos alle tolv.

---

## 5. Posterne

Alle tal som producenten skriver dem. Operatorer (`>`, `≥`, `≈`, `≤`, `<`, `~`) er
bevaret; intervaller er bevaret som intervaller. `—` betyder **ikke oplyst**.

### 5.1 B2 — `https://www.unitree.com/b2`

| Felt | Værdi | Bemærkning |
|---|---|---|
| egenvægt | **≈ 60 kg** | "Total weight (battery included)" |
| mål stående | **≈ 1098 × 450 × 645 mm** | |
| mål foldet | **≈ 880 × 460 × 330 mm** | "Lying Prone" |
| frihedsgrader | — | |
| nyttelast gående | **> 40 kg** | |
| nyttelast stående | **≥ 120 kg** | to forskellige operatorer på samme side |
| maks. hastighed | **> 6 m/s** | fodnote [1]: kun i særlige konfigurationer, i praksis hastighedsbegrænset |
| maks. hældning | **> 45°** | |
| forhindring enkelt | **40 cm** | "Climb up and down stairs of 40cm in forward direction"; toppen skriver "Obstacle crossing: Max 40cm" |
| trappetrin kontinuerlig | **20~25 cm** | interval bevaret |
| IP-klasse | **IP67** | |
| driftstemperatur | **-20 ℃ ~ 55 ℃** | |
| batteri | **2250 Wh** (45 Ah, 58 V) | se 6.1 — 45 × 58 = 2610, ikke 2250 |
| driftstid | **> 5 t uden last** (> 20 km) · **> 4 t ved 20 kg** (> 15 km) · **4-6 t** uden lastangivelse | tre tal på én side, se 6.3 |
| hot-swap | **ja** | "battery supports quick change" |
| ladetid | — | |
| dockingstation | **ja, tilvalg** | "supports autonomous charging solutions (optional)" |
| LiDAR | 3D LiDAR ×1 — **type uden model**, tæller ikke (D4) | |
| kameraer | **dybdekamera ×2 + optisk kamera ×2** | "varies with different configurations" |
| onboard compute | **Intel Core i5** (platform) / **i7** (udvikling); tilvalg **i7 eller Orin NX**, op til 3 enheder | |
| ROS 2 · SDK · autonominiveau | — | |
| monteringsinterface | — | |
| strøm ud | **12 V ×4 · 5 V ×1 · 24 V ×4 · BAT ×1** | ingen watt |
| dataporte | **1000M-Base-Ethernet ×4 · USB 3.0 ×4** | |
| pris | — | shop-tallet er en pladsholder, se 6.2 |
| EU-felterne (4) | — | |

Øvrige tal, som skemaet ikke har felter til: maks. ledmoment ≈ 360 N·m, længste spring
> 1,6 m, grøftespring 0,5~1,2 m.

### 5.2 B2-W — `https://www.unitree.com/b2-w`

| Felt | Værdi | Bemærkning |
|---|---|---|
| egenvægt | **≈ 85 kg** | inkl. batteri |
| mål stående | **≈ 1098 × 550 × 758 mm** | |
| mål foldet | **≈ 950 × 550 × 450 mm** | |
| frihedsgrader | — | hjulbenet, men antallet står ikke |
| nyttelast gående | **> 40 kg** | |
| nyttelast stående | **120 kg** | **uden operator** — B2 skriver ≥ 120 kg for samme tal, se 6.4 |
| maks. hastighed | **15 km/h** | fodnote [1]; eneste model opgivet i km/h |
| maks. hældning | **> 45°** | |
| forhindring enkelt | **40 cm** | |
| trappetrin kontinuerlig | **20~25 cm** | |
| IP-klasse | **IP67** | |
| driftstemperatur | **-20 ℃ ~ 55 ℃** | |
| batteri | **> 2 kWh** (58 V) | operator på selve kapaciteten |
| driftstid | **— (ingen timer oplyst)** | kun rækkevidde: 25 km ved 40 kg last, ≈ 30 km uden last. Se 6.5 |
| hot-swap · ladetid · docking | — | |
| LiDAR · kameraer | — | siden lister ingen sensorer |
| onboard compute | **Intel Core i5 / i7; tilvalg i7 eller Orin NX** | |
| strøm ud · dataporte | — | |
| pris · EU-felterne | — | |

Øvrige: hjuldiameter 225 mm, maks. hjulhastighed 50 rad/s, maks. hjulmoment 40 N·m.

### 5.3 A2 — `https://www.unitree.com/A2` (varianter: A2 · A2-PRO)

| Felt | A2 | A2-PRO |
|---|---|---|
| egenvægt | **≈ 42 kg** m. batteri (**≈ 35 kg** uden) | samme |
| mål stående | **820 × 440 × 570 mm** | samme |
| mål foldet | **720 × 550 × 220 mm** | samme |
| frihedsgrader | **12** | samme |
| nyttelast gående | **≈ 25 kg** ("ideelt ca. 35 kg") | samme |
| nyttelast stående | **≈ 100 kg** | samme |
| maks. hastighed | **0–3,7 m/s** (op til ~5 m/s) | samme |
| maks. hældning | **≈ 45°** | samme |
| forhindring enkelt | **≈ 0,5~1 m** ("Max Climb Height") | samme |
| trappetrin kontinuerlig | **30 cm** ("Stair Climbing Capability, Max Step Height") | samme |
| IP-klasse | **IP56** | **IP56–IP67** (kernekomponenter IP67) |
| driftstemperatur | **-20 ℃ ~ 55 ℃** | samme |
| batteri | **453,6 Wh** (9000 mAh) enkelt · **907,2 Wh** (18000 mAh) dobbelt, 50,4 V | samme |
| driftstid | **> 5 t uden last** (≈ 20 km) · **> 3 t ved 25 kg** (≈ 12,5 km) | samme |
| hot-swap | **ja** — "Dual slots, dual batteries", markedsføres som hot-swap | samme |
| ladetid · docking | — | — |
| LiDAR | **LiDAR ×1** — type uden model, tæller ikke | **LiDAR ×2** |
| kameraer | **HD-kamera ×1** | samme |
| onboard compute | **8-kernet CPU + Intel Core i7**; tilvalg udvidelsesdok | samme |
| ROS 2 · SDK · autonominiveau | — ("Secondary Development: Supported", uden sprog) | — |
| strøm ud | **12 V / 24 V / BAT** | samme |
| dataporte | **RS485 ×2 · CAN ×2 · Gigabit Ethernet ×2 · USB 3.0-TypeC ×4** | samme |
| pris | — ("Contact Sales") | — |
| EU-felterne | — | — |

Øvrige: ledmoment ≈ 180 N·m, forsyningsspænding 50,4 V, garanti 12 måneder,
bevægelsesområde pr. led opgivet i grader.

### 5.4 A2-W — `https://www.unitree.com/A2-W` (varianter: A2-W · A2-W PRO)

Identisk skema med A2. Kun de tal, der afviger:

| Felt | Værdi |
|---|---|
| egenvægt | **≈ 52 kg** m. batteri (**≈ 45 kg** uden) |
| mål stående | **900 × 440 × 625 mm** |
| mål foldet | **930 × 685 × 210 mm** |
| frihedsgrader | **16** |
| maks. hastighed | **0–3 m/s** (op til ~6 m/s) |
| driftstid | **> 3,5 t uden last** (≈ 35 km) · **> 1,5 t ved 25 kg** (≈ 15 km) |
| dæk | diameter **190 mm**, bredde **51 mm** |

Alt øvrigt — nyttelast ≈ 25/≈ 100 kg, hældning ≈ 45°, trin 30 cm, klatrehøjde ≈ 0,5~1 m,
IP56 / IP56–IP67, -20~55 ℃, 453,6/907,2 Wh, porte, strøm ud — er ordret det samme som A2.

**Bemærk:** A2-W er **hurtigere på spidsbelastning** (~6 mod ~5 m/s), men **langsommere
i drift** (0–3 mod 0–3,7 m/s), og har **under det halve** driftstid ved last
(> 1,5 t mod > 3 t) på **samme batteri**. Rækkevidden er til gengæld større
(≈ 35 mod ≈ 20 km ubelastet). Hjul køber km, ikke timer.

### 5.5 As2 — `https://www.unitree.com/As2` (varianter: AIR · PRO · X · EDU)

| Felt | AIR | PRO | X | EDU |
|---|---|---|---|---|
| egenvægt | **≈ 20 kg** | ← | ← | ← |
| mål stående | **720 × 378 × 457 mm** | ← | ← | ← |
| mål foldet | **776 × 378 × 233 mm** | ← | ← | ← |
| frihedsgrader | **12** | ← | ← | ← |
| nyttelast gående | **≈ 10 kg** | **≈ 13 kg** | **≈ 15 kg** | **≈ 15 kg** |
| nyttelast stående | **≈ 45 kg** | **≈ 55 kg** | **≈ 65 kg** | **≈ 65 kg** |
| maks. hastighed | **0~3,0 m/s** | **0~3,7 m/s** | **0~3,7** (op til ~5) | ← |
| maks. hældning | **≈ 30°** | **≈ 40°** | **≈ 40°** | **≈ 40°** |
| forhindring enkelt | **50 cm** — kun i brødtekst, se 6.6 | ← | ← | ← |
| trappetrin kontinuerlig | **20 cm** | **25 cm** | **25 cm** | **25 cm** |
| IP-klasse | **"/" = ingen** | **IP54** | **IP54** | **IP54** |
| driftstemperatur | **-20 ~ 50 ℃** | **-20 ~ 50 ℃** | **-20 ~ 55 ℃** | **-20 ~ 55 ℃** |
| batteri | 8000 mAh (**Wh ikke oplyst**) | 15000 mAh = **648 Wh** | ← | ← |
| driftstid ubelastet | **≈ 2 t** (≈ 10 km) | **≈ 4 t** (≈ 20 km) | ← | ← |
| driftstid belastet | **> 1,5 t ved 10 kg** (≈ 7 km) | **> 2,5 t ved 13 kg** (≈ 13 km) | **> 2,5 t ved 15 kg** (≈ 13 km) | ← |
| ladetid | — (kun oplader: 50,4 V 4 A / 7,4 A) | | | |
| dockingstation | **nej ("/")** | **nej** | **nej** | **ja** |
| LiDAR | **Unitree L2** — model! | 64~128-linje industri-LiDAR, **uden model** | ← | ← |
| kameraer | **HD-kamera** | ← | ← | ← |
| onboard compute | **8-kernet CPU** | ← | ← | + udvidelsesdok (Orin NX m.fl.) |
| SDK | — ("Secondary Development: Not Supported" for AIR/PRO, "Supported" for X/EDU) | | | |
| strøm ud | **— kun "BAT", ingen spænding** | | | |
| dataporte | **Gigabit Ethernet ×1 · SBUS ×1** | | | |
| pris | — ("Contact Sales" på alle fire) | | | |
| garanti | 6 mdr. | 12 mdr. | 12 mdr. | 12 mdr. |

**Hot-swap er ikke oplyst for As2** — ét litiumbatteri, ingen dobbeltbås som på A2.

### 5.6 As2-W — `https://www.unitree.com/As2-W` (varianter: X · EDU) — **ny post**

| Felt | Værdi |
|---|---|
| egenvægt | **≈ 25 kg** m. batteri |
| mål stående | **721 × 493 × 521 mm** |
| mål foldet | **768 × 602 × 211 mm** |
| frihedsgrader | **16** |
| nyttelast gående | **≈ 16 kg** |
| nyttelast stående | **≈ 150 kg** — **højeste stående last i hele Unitree-programmet**, på den næstletteste robot |
| maks. hastighed | **0~3,7 m/s** (maks. ≈ 6 m/s) |
| maks. hældning | **≈ 45°** |
| forhindring enkelt | **≈ 0,4 m ~ 0,8 m** ("Max Climb Height") |
| trappetrin kontinuerlig | **30 cm** |
| IP-klasse | **IP54** |
| driftstemperatur | **-20 ℃ ~ 55 ℃** |
| batteri | **648 Wh** (15000 mAh) — Wh kun i brødtekst, ikke i tabellen |
| driftstid | **≈ 3 t uden last** (≈ 30 km) · **> 2 t ved 16 kg** (≈ 25 km) — se 6.7, tallene strider mod siden selv |
| hot-swap · ladetid | — |
| dockingstation | **nej (X) · ja (EDU)** |
| LiDAR | 64~128-linje industri-LiDAR — type uden model, tæller ikke |
| kameraer | **HD-kamera** |
| onboard compute | **8-kernet CPU**; EDU + udvidelsesdok (Orin NX) |
| strøm ud | — (kun "BAT") |
| dataporte | **Gigabit Ethernet ×1 · SBUS ×1** |
| pris · EU-felterne | — |

Øvrige: ledmoment ≈ 95 N·m, dæk 7", garanti 12 mdr., udvidelsesmodul op til 150 TOPS.

### 5.7 Go2 — `https://www.unitree.com/go2` (varianter: AIR · PRO · X · EDU)

| Felt | AIR | PRO | X | EDU |
|---|---|---|---|---|
| egenvægt | **≈ 15 kg** | ← | ← | ← |
| mål stående | **70 × 31 × 40 cm** | ← | ← | ← |
| mål foldet | **76 × 31 × 20 cm** | ← | ← | ← |
| frihedsgrader | **12 ledmotorer** (se 4.3) | ← | ← | ← |
| **nyttelast (uspecificeret)** | **≈ 7 kg** (maks ~10) | **≈ 8 kg** (maks ~10) | **≈ 8 kg** (maks ~12) | ← |
| nyttelast stående | **— ikke oplyst** | | | |
| maks. hastighed | **0~2,5 m/s** | **0~3,5 m/s** | **0~3,7** (maks ~5) | ← |
| maks. hældning | **30°** | **40°** | **40°** | **40°** |
| **trin (uspecificeret)** | **≈ 15 cm** | **≈ 16 cm** | **≈ 16 cm** | **≈ 16 cm** |
| IP-klasse | **— ingen IP-klasse på hele siden** | | | |
| driftstemperatur | **— ikke oplyst** | | | |
| batteri | 8000 mAh, 28~33,6 V — **Wh ikke oplyst** | ← | ← | 15000 mAh |
| driftstid | **≈ 1-2 t** | **≈ 1-2 t** | **≈ 1-2 t** | **≈ 2-4 t** — **uden lastbetingelse** |
| dockingstation | nej | nej | **ja** | **ja** |
| LiDAR | **4D LiDAR L2** — model oplyst | ← | ← | ← |
| kameraer | **HD vidvinkel**; EDU + dybdekamera | | | |
| onboard compute | ○ | **8-kernet CPU** | ← | ← + Orin 40-100 TOPS |
| **pris** | **$1600** | **$2800** | **$4500** | "Contact your sales expert" |
| EU-felterne | — | | | |

**Go2 er den eneste af de tolv, hvor producenten trykker rigtige priser** (Go1 har dem
også, se 5.9). "Price（Tax and freight excluded）" — ekskl. skat og fragt, hvilket for en
dansk køber betyder, at tallet ikke er slutprisen.

### 5.8 Go2-W — `https://www.unitree.com/go2-w`

| Felt | Værdi |
|---|---|
| egenvægt | **≈ 18 kg** |
| mål stående | **70 × 43 × 50 cm** |
| mål foldet | **— ikke oplyst** |
| frihedsgrader | **16 ledmotorer** |
| nyttelast (uspecificeret) | **≈ 8 kg** (maks ~12 kg) |
| nyttelast stående | — |
| maks. hastighed | **0~2,5 m/s** |
| maks. hældning | **35°** |
| forhindring enkelt | **< 70 cm** — operator `<`, en **øvre** grænse, se 6.8 |
| trappetrin kontinuerlig | — |
| IP-klasse · driftstemperatur | **— ingen af delene** |
| batteri | 15000 mAh, 33,6 V — **Wh ikke oplyst** |
| driftstid | **1,5-3 t** — **uden lastbetingelse** |
| hot-swap · ladetid · docking | — |
| LiDAR | 3D LiDAR, ultravidvinkel — **uden model**, selv om Go2's side navngiver L2 |
| kameraer | **HD vidvinkel** |
| onboard compute | **8-kernet CPU**; udvidelsesmodul Orin NX m.fl. |
| strøm ud · dataporte | — |
| pris · EU-felterne | — |

Øvrige: 7" lufttryksdæk, ledmoment ≈ 45 N·m, garanti 12 mdr.

### 5.9 Go1 — `https://www.unitree.com/go1` (varianter: Air · Pro · Edu)

| Felt | Air | Pro | Edu |
|---|---|---|---|
| egenvægt | **12 kg** | ← | ← |
| mål stående | **— ikke oplyst** | | |
| mål foldet | **0,588 × 0,22 × 0,29 m** | ← | ← |
| frihedsgrader | **12 ledmotorer** | ← | ← |
| nyttelast (uspecificeret) | **≈ 4 kg** (grænse ~10) | **≈ 4 kg** (~10) | **≈ 6 kg** (~10) |
| maks. hastighed | **0~2,5 m/s** | **0~3,5 m/s** | **0~3,7** (grænse ~5) |
| maks. hældning · trin | **— ingen af delene** | | |
| IP-klasse · driftstemperatur | **— ingen af delene** | | |
| batteri | **"Battery: 1 piece"** — hverken mAh, V eller Wh | | |
| driftstid | **— intet tal på siden.** "Long Endurance" står som overskrift uden værdi | | |
| LiDAR | "Radar: 2D eller 3D, tilvalg" — **uden model** | | |
| kameraer | **1 par fiskeøje-binokulær dybde** | **5 par** | **5 par** |
| onboard compute | 1×(4×1,43 GHz, 128 kerner, 0,5 T) | 3× samme | 2 Nano + (1 Nano eller 1 NX) |
| **SDK-sprog** | — | — | **Python** ("Python Programming Interface") |
| **pris** | **$2700** | **$3500** | "Contact Sales" |
| EU-felterne | — | | |

Øvrige: ledmoment 23,70 N·m (krop/lår) og 35,55 N·m (knæ), garanti 6/12 mdr. kerne­dele.

### 5.10 B1 — `https://www.unitree.com/b1`

| Felt | Værdi | Bemærkning |
|---|---|---|
| egenvægt | **≈ 50 kg** inkl. batteri (batteri **≈ 5 kg**) | |
| mål stående | **1126 × 467 × 636 mm** | |
| mål foldet | **1202 × 467 × 297 mm** | foldet er **længere** end stående — plausibelt for udstrakte ben, men bemærkelsesværdigt |
| frihedsgrader | — | |
| nyttelast gående | **20 kg** | **uden operator**; siden tilføjer "anbefales at holde vægten inden for 20 kg" |
| nyttelast stående | **80 kg** | uden operator |
| maks. hastighed | **— ikke oplyst** | eneste industrimodel helt uden hastighedstal |
| maks. hældning | **— ikke oplyst** | |
| forhindring enkelt | — | |
| trappetrin kontinuerlig | **20 cm** | |
| IP-klasse | **IP68** — **kun i overskriftsteksten**, ikke i parametertabellen. Se 6.9 | |
| driftstemperatur | **— ikke oplyst for robotten.** Tabellen oplyser **batteriets** -5 ℃ – 45 ℃. Se 6.10 | |
| batteri | **932,4 Wh** (18000 mAh, 51,8 V), ladegrænse 58,8 V | **Regnestykket går op**: 18 × 51,8 = 932,4 |
| driftstid | **5 t stående** · **2 t gående uden last** | to forskellige tilstande, se 6.3 |
| hot-swap | — | |
| **ladetid** | **1-2 t** | **eneste model af de tolv med en ladetid** |
| dockingstation | — | |
| LiDAR | — | |
| kameraer | **Intel RealSense D430 ×5** | **model oplyst** |
| onboard compute | **Intel i5-1135G7** + **XavierNX ×3** | model oplyst, sjældent præcist |
| strøm ud | **12 V / 24 V** | |
| dataporte | **Gigabit ×7 · RS485 ×4 · USB ×5 · CAN ×4** | |
| pris · EU-felterne | — | |

### 5.11 AlienGo — `https://www.unitree.com/aliengo`

| Felt | Værdi | Bemærkning |
|---|---|---|
| egenvægt | **21,5 kg ± 1 kg** | **uden batteri** — se 6.11 |
| mål stående | **0,65 × 0,31 × 0,6 m** | |
| mål foldet | **0,60 × 0,31 × 0,15 m** | |
| frihedsgrader | **12** | eksplicit: "Degrees of Freedom (number of motors)" |
| nyttelast (uspecificeret) | **13 kg** | ét felt, "Load", uden angivelse af gående/stående |
| maks. hastighed | **> 1,5 m/s** | |
| maks. hældning | **≤ 25°** | **operator `≤`** — en øvre grænse, ikke en præstation, se 6.8 |
| forhindring · trappetrin | — | "Up and down steps, slopes, stairs" uden tal |
| IP-klasse | — | "Integrated Advanced Level of Protection" uden klasse |
| driftstemperatur | — | |
| batteri | 12600 mAh — **hverken spænding eller Wh** | kan ikke omregnes, og skal ikke |
| driftstid | **2,5-4,6 t** | **uden lastbetingelse** |
| LiDAR | "single or multi-line, tilvalg" — uden model | |
| kameraer | **dybdekamera ×2 + visuelt odometerkamera ×1**; 1280×720, min. dybde 0,11 m, synsfelt 163° | |
| onboard compute | — | "onboard PC" uden model |
| ROS 2 | — | siden skriver **"ROS"** uden version, se 4.3 |
| **SDK-sprog** | **C/C++, ROS** | |
| strøm ud | **5 V · 12 V · 19 V · BAT (24~30 V)** | |
| dataporte | **Ethernet ×2 · USB 3.0 ×2 · USB 2.0 ×1 · RS485 ×1** | |
| pris · EU-felterne | — | |

### 5.12 A1 — `https://www.unitree.com/A1` — **ny post**

**A1-siden er en ren marketingside uden parametertabel.** Det er ikke en fejl i
indsamlingen; siden har ingen. Konsekvensen er den laveste tæthed i hele materialet.

| Felt | Værdi |
|---|---|
| egenvægt | **— ordet "Weight" står ikke ét sted på siden** (negativkontrolleret, se 8) |
| mål stående · mål foldet | **— ingen af delene** |
| frihedsgrader | — |
| nyttelast (uspecificeret) | **5 kg** ("Effective Load") |
| maks. hastighed | **3,3 m/s (11,88 km/h)** — "maximum continuous running speed" |
| maks. hældning · trin | — |
| IP-klasse | — ("foden er vand- og støvtæt", uden klasse) |
| driftstemperatur | — |
| batteri | — |
| driftstid | **1-2,5 t** — **uden lastbetingelse** |
| LiDAR | "High-precision Lidar, tilvalg" — uden model |
| kameraer | **RealSense-dybdekamera** (0,3-10 m, 1080p, fejl < 2 % inden for 2 m) |
| onboard compute | — ("dual master control" uden model) |
| SDK-sprog | — ("up level, bottom level real-time API" uden sprog) |
| strøm ud | **5 V · 12 V · 19 V ud; 24 V ind** |
| dataporte | **HDMI ×2 · Ethernet ×2 · USB ×4** |
| pris · EU-felterne | — |

Øvrige: ledmoment 33,5 N·m (maks.), maks. ledhastighed 21 rad/s, 4 fodtrykssensorer.

---

## 6. Fund

### 6.1 B2's batteri går ikke op — og det er producentens tal, ikke vores

Siden skriver `Battery capacity 45Ah(2250Wh)，voltage 58V` i **samme sætning**.
45 × 58 = 2610 Wh. Det trykte tal er 2250 Wh. (2250 / 45 = 50 V, altså formentlig den
nominelle spænding; 58 V er formentlig ladegrænsen.)

**Afvigelsens størrelse afhænger af, hvad man dividerer med, og begge tal er rigtige:**

- (2610 − 2250) / **2250** = **16,0 %** — "det beregnede ligger 16 % over det trykte".
  Det er det tal, `FUND-kina.md` angav.
- (2610 − 2250) / **2610** = **13,8 %** — "det trykte ligger 13,8 % under det beregnede".

Jeg troede først, det gamle udkasts 16 % var en fejl. **Det er det ikke** — det er en
anden nævner. Jeg skriver det frem, fordi den slags "rettelse" er præcis den måde, et
forkert tal kan komme ind i et opslagsværk, der ellers gør alt rigtigt.

**Validatoren skal derfor fastlægge sin egen nævner**, ellers rapporterer den samme
uoverensstemmelse med to forskellige tal alt efter, hvem der skrev tjekket.

**Vi retter ikke.** Vi gemmer 2250 Wh som producentens tal og sætter en `advarsel:` på
feltet, præcis som DATAMODEL.md F4 foreskriver for Spot-længden.

Krydstjek af alle batterier, der oplyser nok til at kunne regnes efter:

| Model | Oplyst | Kontrolregning | Går op? |
|---|---|---|---|
| B1 | 18000 mAh · 51,8 V · **932,4 Wh** | 18 × 51,8 = 932,4 | **ja, præcist** |
| A2 / A2-W | 9000 mAh · 50,4 V · **453,6 Wh** | 9 × 50,4 = 453,6 | **ja, præcist** |
| A2 / A2-W dobbelt | 18000 mAh · **907,2 Wh** | 18 × 50,4 = 907,2 | **ja, præcist** |
| B2 | 45 Ah · 58 V · **2250 Wh** | 45 × 58 = 2610 | **nej, 13,8 % fra** |
| As2 / As2-W | 15000 mAh · **648 Wh** · 36~50,4 V | 15 × 43,2 = 648 | ja, ved 43,2 V nominel — som ligger inden for det oplyste spænd |

**Regn aldrig Wh ud for de øvrige.** Go2, Go2-W, Go1, AlienGo og As2's 8000 mAh-batteri
oplyser ikke nok, og B2 er beviset på, at mAh × V ikke er producentens eget tal.

### 6.2 Prisadvarslen holder — pladsholderen er bekræftet

Efterprøvet direkte i de gemte shopsider:

- `shop.unitree.com/products/unitree-b2` → `"price":10000000` (= **$100.000,00**)
- `shop.unitree.com/products/unitree-a2` → `"price":10000000` — **identisk beløb**
- Begge sider indeholder strengen **`Contact us for the real price`**

To forskellige robotter til nøjagtig samme runde beløb, med en tekst der eksplicit siger,
at det ikke er den rigtige pris. **Det er en pladsholder. Den holdes ude af prisfeltet.**

Det ændrer ikke, at Go2 og Go1 har **rigtige** priser på deres egne produktsider
($1600/$2800/$4500 og $2700/$3500). Skellet går mellem shop og produktside, ikke mellem
troværdige og utroværdige producenter.

### 6.3 Driftstid er tre forskellige størrelser hos samme producent

Feltet `driftstid` betyder ikke det samme på tværs af de ti modeller, der har det:

| Type | Modeller | Kan sammenlignes? |
|---|---|---|
| Tid **med** oplyst lastbetingelse | B2, A2, A2-W, As2, As2-W | ja, indbyrdes |
| Tid **uden** lastbetingelse | Go2, Go2-W, AlienGo, A1 | **nej** |
| Tid i en **anden tilstand** (stående) | B1 (5 t stående, 2 t gående) | kun den gående |
| **Ingen tid overhovedet**, kun km | B2-W | nej |
| **Intet tal** | Go1 | — |

B2 har oven i købet **tre** tal på én side: `> 5h uden last`, `> 4h ved 20 kg` og
`Battery life 4-6h` uden betingelse. DATAMODEL.md F3 forudsagde det på ét datapunkt;
her holder det på tolv.

**Uden `ved_last` er tallet ikke et tal.** Fire modeller kan derfor aldrig stå i samme
kolonne som B2 og A2, uanset hvor ens tallene ser ud.

### 6.4 Samme tal, forskellig operator — inden for samme produktfamilie

B2 skriver **`≥ 120kg`** stående last. B2-W skriver **`120kg`**, uden operator, for det
samme tal. Der er ingen forskel i den underliggende maskine, der forklarer det; det er
to sider skrevet af to hænder.

**Vi bevarer forskellen.** `operator: "≥"` på B2, tomt på B2-W. Ensretter vi, opfinder vi
enten et forbehold, producenten ikke har taget, eller fjerner et, den har taget.

Operatorer fundet på tværs af materialet — de er reglen, ikke undtagelsen:
`>` (B2, B2-W, A2, AlienGo), `≥` (B2), `≈`/`About`/`Approx.` (næsten alle),
`≤` (AlienGo), `<`/`＞` (Go2-W, B2-W), intervaller med `~` og `-` (overalt).

### 6.5 B2-W oplyser rækkevidde, men ikke driftstid

Alle andre modeller med en driftstid opgiver timer. B2-W opgiver **kun km**:
25 km ved 40 kg last, ≈ 30 km uden last. Negativkontrolleret: strengen `Nh`/`hours`
findes ikke i talsammenhæng på siden.

Det er værd at bemærke, fordi B2-W ellers ville se ud til at have en driftstid, hvis man
tog "Maximum endurance" for tid. Ordet *endurance* bærer her en afstand.

### 6.6 As2's forhindringshøjde findes kun i brødteksten

Tabellen har **ingen** "Max Climb Height"-række for As2 — i modsætning til A2, A2-W og
As2-W, der alle har en. De eneste 50 cm står i en marketingsætning:
*"with the ability to climb 50cm vertical platforms and 40° slopes"*.

Jeg har talt feltet som udfyldt, men **mærket det som prosa, ikke tabel**. Beslutter I,
at kun tabelværdier tæller, falder As2 fra 19/31 til 18/31.

### 6.7 As2-W modsiger sig selv om rækkevidde og forhindringshøjde

Fire steder på **samme side**, alle gemt i råfilen:

| Sted | Ubelastet | Belastet | Forhindring |
|---|---|---|---|
| Nøgletalskort | "Unloaded 3h+ (**>33 km**)" | "Loaded > 2h (**>16 km**)" | "**80 cm** steps" |
| Brødtekst | "cruising range exceeds **30 km**" | — | "obstacles up to **80 cm** high" |
| Parametertabel | "~3 hours, approx. **30 km**" | "16 kg, >2 hours, approx. **25 km**" | Stair Climbing **30 cm**; Max Climb Height **0,4~0,8 m** |

Belastet rækkevidde er **>16 km i kortet og ≈25 km i tabellen** — 56 % forskel, samme
side, samme dag. Og de 80 cm i kortet er den **øvre ende af et interval** (0,4~0,8 m) i
tabellen, præsenteret som ét tal.

**Jeg har brugt tabellen** og ført kortets tal som modstrid. Bruger man kortet, ser
As2-W bedre ud på forhindring og dårligere på rækkevidde.

Samme side har i øvrigt dæk med `Diameter：178mm； Radius：50mm`. En radius på 50 mm giver
en diameter på 100 mm, ikke 178. "Radius" er formentlig en fejloversættelse af "bredde"
(A2-W's side skriver netop `Width：51mm`). **Ikke rettet**, ført som fund.

### 6.8 To operatorer, der vender betydningen om

- **AlienGo: `Climbing Angle ≤25°`.** Alle andre skriver hældning som `> 45°` eller
  `≈ 45°` — en præstation. AlienGos `≤` er en **grænse**. Stiller man 25 mod 45 i samme
  kolonne, ser det ud som en dårligere robot; i virkeligheden er det en anden slags
  udsagn.
- **Go2-W: `Max Climb Drop Height ＜ 70cm`.** Igen en øvre grænse. Sammenlignet med B2's
  `40cm` uden operator ser Go2-W ud til at klare 75 % mere — men `< 70` betyder
  "ikke over 70", ikke "70".

**Uden `operator` i datamodellen bliver begge disse til blanke tal, og begge bliver
misvisende.** Det er den stærkeste bekræftelse af regel 4, jeg fandt.

### 6.9 B1's IP68 står ikke i tabellen

Overskriften siger `IP68 Waterproof, Industrial Level Heavy Loader`. Parametertabellen
har **ingen** IP-række. Jeg har talt feltet som udfyldt og mærket det som prosa.

Det gør B1 til den eneste model i materialet med IP68 — den højeste klasse hos Unitree —
på det svageste kildegrundlag.

### 6.10 B1's temperaturtal er batteriets, ikke robottens

Tabellens række hedder `Working Temperature` med underrækken **`Battery: -5℃ - 45℃`**.
Der er ingen række for robotten.

Stiller man -5~45 ℃ ved siden af B2's -20~55 ℃, ser B1 ud til at være en dårligere
maskine i kulde. **Det følger ikke af kilden** — kilden siger kun noget om batteriet, og
B2's tal kan i princippet også være batteribegrænset uden at sige det.

Jeg har talt `driftstemperatur` som **ikke oplyst** for B1 og ført batteriområdet som en
separat oplysning. Det koster B1 ét felt og er det ærlige valg.

### 6.11 AlienGos vægt er uden batteri — alle andres er med

AlienGo: `Weight (without battery) 21.5kg ±1kg`.
B2, B2-W, A2, A2-W, As2, As2-W, Go2, Go2-W, Go1: **med** batteri.
A2 og A2-W oplyser begge dele (35 uden / 42 med — batteriet vejer 7 kg).
B1 oplyser 50 kg med og batteriet til 5 kg separat.

Sættes AlienGos 21,5 kg i samme kolonne som Go2's 15 kg og As2's 20 kg, sammenligner vi
en robot uden batteri med to robotter med. **Feltet skal bære, om batteriet er med.**
Det er ikke i skemaet i dag.

### 6.12 Go2, Go2-W, Go1, AlienGo og A1 har kun ét nyttelastfelt

DATAMODEL.md F1 blev fundet på B2, der oplyser begge. Fem af tolv oplyser kun ét, og
**siden siger ikke hvilket**: Go2 og Go2-W skriver bare `Payload`, Go1 `Load`, AlienGo
`Load`, A1 `Effective Load`.

Jeg har ført dem som `nyttelast_gaaende` med et forbehold og ladt `nyttelast_staaende`
stå tom. Begrundelsen er konservativ: gående last er den, kataloget rangerer på
(L6/F1), og størrelsesordenen (4-8 kg på en 12-18 kg robot) svarer til gående last hos
dem, der oplyser begge — ikke til stående.

**Det er stadig en slutning, ikke en aflæsning.** Feltet bør bære et flag som
`kilde_praeciserer_ikke_type: true`, ellers ser fem poster ud, som om producenten har
svaret på et spørgsmål, den ikke har fået.

### 6.13 De to sider, der navngiver deres LiDAR, gør det uens

Go2 skriver `4D LiDAR L2`. As2 AIR skriver `Ultra-Wide-Angle LiDAR: Unitree L2`.
**Go2-W skriver `Super-wide-angle 3D LIDAR` uden model**, selv om den efter alt at
dømme bærer samme enhed som Go2. As2 PRO/X/EDU skriver `Industrial-grade 64~128-line
LiDAR` — en klasse, ikke en model.

Under D4's nuværende foreløbige regel ("type uden model tæller ikke") har feltet dækning
hos **2 af 12**. Vender D4 den anden vej, springer det til **9 af 12**, og alle ni posters
tæthed stiger med ét felt. **D4 er ikke et lille metodespørgsmål her.**

### 6.14 Syv felter har nul dækning hos alle tolv

Målt, ikke skønnet:

`ROS 2` · `autonominiveau` · `monteringsinterface` · `tilgængelig i EU` · `CE oplyst` ·
`servicepunkt i EU` · `leveringstid` — **0 af 12**.

Dertil `ladetid` **1 af 12** (kun B1) og `pris` **2 af 12** (Go2, Go1).

DATAMODEL.md F5 fandt seks felter med nul dækning på tre robotter. På tolv Unitree-poster
er billedet det samme eller værre: **hele "Kommercielt og EU"-gruppen på fem felter har
tilsammen 2 udfyldte celler ud af 60.** Ikke én af de tolv sider nævner CE.

Det er i sig selv sidens vigtigste EU-fund, og det er dokumenteret med gemte kilder:
**en dansk køber får intet at vide om CE, service eller leveringstid fra producenten.**

### 6.15 Oplyser Unitree meget — eller kun det flatterende?

Meget, faktisk. De nye industrimodeller (A2, A2-W, As2, As2-W) har de fyldigste tabeller
i materialet, med bevægelsesområde pr. led, lejetype, køling og garantiperiode — ting
ingen konkurrent oplyser.

**Men mønstret i det, der mangler, er ikke tilfældigt:**

- **Alle fire consumer-modeller (Go2, Go2-W, Go1, A1) mangler IP-klasse og
  driftstemperatur.** Industrimodellerne har begge dele. Det er præcis de to felter, der
  afgør, om en robot kan bruges udendørs i Danmark.
- **Wh oplyses kun, når regnestykket er pænt.** A2's 453,6 Wh og B1's 932,4 Wh går
  præcist op. Go2, Go2-W, Go1 og AlienGo oplyser kun mAh — og for tre af dem heller ikke
  spændingen. B2, der oplyser alt, er den ene, hvor det **ikke** går op.
- **Hastighed markedsføres i sin bedste form.** `> 6 m/s` står stort på B2's forside med
  fodnote [1] i småt: *"realized in special configurations, in practice there is a speed
  limit for security purposes."* Den driftsrelevante hastighed står ikke.
- **Nyttelast præsenteres med det største tal først.** B2's forside slår "Ultra Load"
  op med `≥ 120kg` stående over `> 40kg` gående. Det er ni gange, som F1 forudsagde.

---

## 7. Specifikationstæthed — begge nævnere, aldrig blandet

**Beregnet af `tools/taethed-unitree.mjs`, ikke i hånden.** Scriptet validerer
feltnavnene mod 31-listen og afviser dubletter.

### 7.1 På 31-listen (DATAMODEL.md efter F1 og F2)

| Model | Udfyldt | Tæthed |
|---|---|---|
| B2 | 19 / 31 | **61 %** |
| A2 | 19 / 31 | **61 %** |
| A2-W | 19 / 31 | **61 %** |
| As2 | 19 / 31 | **61 %** |
| As2-W | 18 / 31 | **58 %** |
| Go2 | 14 / 31 | **45 %** |
| B1 | 14 / 31 | **45 %** |
| B2-W | 13 / 31 | **42 %** |
| AlienGo | 12 / 31 | **39 %** |
| Go2-W | 10 / 31 | **32 %** |
| Go1 | 9 / 31 | **29 %** |
| A1 | 6 / 31 | **19 %** |
| **Gennemsnit** | **14,3 / 31** | **46 %** |

### 7.2 På 29-listen (PLAN.md's oprindelige nævner)

| Model | Udfyldt | Tæthed |
|---|---|---|
| B2 | 17 / 29 | **59 %** |
| A2 | 17 / 29 | **59 %** |
| A2-W | 17 / 29 | **59 %** |
| As2 | 17 / 29 | **59 %** |
| As2-W | 16 / 29 | **55 %** |
| Go2 | 14 / 29 | **48 %** |
| B1 | 13 / 29 | **45 %** |
| AlienGo | 12 / 29 | **41 %** |
| B2-W | 11 / 29 | **38 %** |
| Go2-W | 10 / 29 | **34 %** |
| Go1 | 9 / 29 | **31 %** |
| A1 | 6 / 29 | **21 %** |
| **Gennemsnit** | **13,3 / 29** | **46 %** |

### 7.3 Hvad de to tabeller viser, som ingen af dem viser alene

**Nævneren er ikke den eneste forskel — tælleren flytter sig også, og den flytter sig
skævt.**

Se Go2: **45 % på 31-listen, 48 % på 29-listen.** Tætheden **stiger**, når nævneren
bliver mindre, fordi Go2 kun oplyser ét nyttelasttal og ét trintal og derfor ikke mister
noget ved sammenlægningen. B2 oplyser begge og mister to felter: 61 % → 59 %.

**Splittene straffer de producenter, der oplyser mest.** Fire modeller (B2, A2, A2-W,
As2, As2-W) taber 2 felter ved sammenlægningen; fem taber 0. Det er ikke en
måleforskel — det er en artefakt af, hvordan nævneren blev valgt.

**Konsekvens for D7:** valget mellem 29 og 31 er ikke bare "ret et tal". Vælger I 31,
belønnes en producent, der splitter sine oplysninger. Vælger I 29, belønnes en, der
kun giver ét tal, fordi der ikke er noget at savne. **Anbefaling: lås 31**, fordi det er
det skema, data faktisk er indsamlet efter, og indfør i stedet, at et felt kan være
`ikke_relevant` adskilt fra `ikke oplyst` — ellers straffer 31-listen Go2 for et felt,
den aldrig kunne udfylde.

### 7.4 Hvorfor mine tal ikke er de gamle tal

DATAMODEL.md og STATUS.md har **B2 = 14/29 = 48 %**. Jeg måler **17/29 = 59 %** på
samme side samme dag. `FUND-kina.md` havde et tredje tal, **62 %**.

**Forskellen er ikke observation. Den er tælleregel**, og det er præcis den diagnose,
STATUS.md D7 allerede stiller. Mine 17 tæller bl.a. `hot-swap`, `dockingstation`,
`kameraer`, `strøm ud` og `dataporte` med — felter, hvor B2's side har en værdi, men
hvor det ikke fremgår af DATAMODEL.md, om den gamle optælling talte dem.

Den gamle regel er ikke skrevet ned og kan ikke rekonstrueres. **Mine tal skal derfor
ikke sammenlignes med de tre referencetal i STATUS.md** — kun med hinanden, og kun med
fremtidige målinger, der bruger reglen i afsnit 4.

`robotdata`-skillen advarer: *"Ligger en ny post markant over 55 %, er det sandsynligvis
en fejl — kontrollér, om sekundære kilder er sneget med ind uden mærkning."* Fire poster
ligger på 61 %. **Kontrolleret: der er ingen sekundære kilder i dette dokument.** Hver
eneste værdi kommer fra `unitree.com`s egne produktsider, gemt og manifesteret. Tærsklen
på 55 % er sat efter den gamle, uskrevne tælleregel og flytter med, når D7 lukkes.

---

## 8. Selv-tjek

Jeg har ikke læst posterne igennem og fundet dem rigtige. Jeg har bygget
`tools/efterproev-unitree.mjs`, som for hvert påstået tal **kører stripperen på den
gemte råfil igen** og søger strengen. Stripperen er en ren funktion af råfilen, så et
hit beviser, at strengen står i den fil, vi gemte 19. august.

```
Efterprøvet 200 felter over 12 modeller, fandt 0 fejl.
Negativkontrol: 10 påstande om "ikke oplyst", 0 holdt ikke.
```

**Der blev fundet én fejl undervejs**, og den var min: kontrolstrengen for Go2's
batteri (`standard （8000mAh)`) havde uens parenteser og ramte ikke. Rettet til den
faktiske streng, kørt om, 0 fejl. Fejlen lå i tjekket, ikke i posten — men den skal
stå her, for ellers ser 200/0 ud som om intet gik galt.

**Negativkontrollen** er den halvdel, en almindelig gennemlæsning ikke kan: den beviser,
at et felt jeg har skrevet "ikke oplyst" på, **virkelig ikke står på siden.** Alle ti
holdt:

| Påstand | Regex, der ikke måtte ramme |
|---|---|
| Go2 har ingen IP-klasse | `\bIP[0-9]{2}\b` |
| Go2 har ingen driftstemperatur | `Operating Temperature\|-20℃` |
| Go2-W har ingen IP-klasse | `\bIP[0-9]{2}\b` |
| Go1 har intet driftstidstal | driftstid + timetal |
| Go1 har ingen IP-klasse | `\bIP[0-9]{2}\b` |
| **A1 oplyser ingen vægt** | `Weight` — ordet står slet ikke på siden |
| B1 oplyser ingen maks. hastighed | `m/s\|km/h` |
| B1 oplyser ingen hældning | `Climb(ing)? Angle\|Slope` |
| B2-W oplyser ingen driftstid i timer | `\d\s*h(ours)?\b` |
| AlienGo har ingen IP-klasse | `\bIP[0-9]{2}\b` |

De fire kontroller, skillen udpeger, blev kørt særskilt:

- **Operatorer bevaret.** `≥ 120kg` (B2) er ikke skrevet som 120; `120kg` (B2-W) har
  ikke fået en operator, den ikke har. `≤25°` (AlienGo) og `＜ 70cm` (Go2-W) er begge
  søgt tilbage med operatoren i strengen — de ville have fejlet, hvis jeg havde tabt den.
- **Nyttelast ikke blandet.** De syv modeller med begge tal har dem i hvert sit felt
  (kontrolleret som to adskilte strenge). De fem med kun ét tal har `nyttelast_staaende`
  tom, ikke udfyldt med det gående tal.
- **Trinhøjde ikke blandet.** B2's `40cm` (enkelt) og `20~25cm` (kontinuerlig) er søgt
  som to forskellige strenge. As2-W's `30cm` (kontinuerlig) og `0,4~0,8 m` (enkelt)
  ligeså — og kortets modstridende `80 cm steps` er søgt separat for at dokumentere
  modstriden frem for at skjule den.
- **Driftstid har lastbetingelse.** Kontrolleret på alle ti med et driftstidstal. Fem
  har den (B2, A2, A2-W, As2, As2-W), fire har den ikke og er mærket sådan (Go2, Go2-W,
  AlienGo, A1), én er i en anden tilstand (B1). Kontrolstrengene for de fire uden
  lastbetingelse hedder bogstaveligt `driftstid uden lastbetingelse` i scriptet.

Kør selv:

```
node tools/efterproev-unitree.mjs      # 200 felter + 10 negativkontroller
node tools/taethed-unitree.mjs         # begge nævnere, feltdækning
```

Begge læser fra `C:\Praktik\websites\udstilling\media\_kilder\raa-kina-unitree-2026-08-19\`.
De virker kun, så længe råfilerne findes — hvilket er hele pointen med D6.

---

## 9. Selv-review — hvad jeg er usikker på

**1. Fem posters nyttelastfelt hviler på en slutning.** Se 6.12. Go2, Go2-W, Go1,
AlienGo og A1 skriver bare "Payload"/"Load". Jeg placerede tallet i `nyttelast_gaaende`.
Er slutningen forkert, er fem af tolv poster forkerte i det felt, kataloget rangerer
efter. **Det er den enkeltbeslutning i dokumentet, jeg har mindst dækning for.**

**2. Frihedsgrader hos Go2/Go2-W/Go1 er talt ud fra motorantal.** Se 4.3. Tre poster
mister ét felt hver, hvis I dømmer det for løst.

**3. "Max Climb Height" og "Max Climb Drop Height" er måske ikke samme felt.** Jeg
har ført begge som `forhindring_enkelt`. A2's `0,5~1 m` og Go2's `15 cm` bærer navne,
der ligner hinanden, men størrelsesordenen er 30-70 gange. Enten måler de noget
forskelligt, eller også er A2's tal noget helt tredje (springhøjde? platformhøjde?).
**Jeg kan ikke afgøre det fra siden.** Sammenligner kataloget dem, sammenligner det
måske æbler og pærer — men F2's regel redder os, fordi rangeringen kun bruger
`trappetrin_kontinuerlig`.

**4. Tal, der ser for pæne ud.** As2 og As2-W deler `648 Wh`, `95 N·m`, `15000 mAh`,
`36~50,4 V` og hele bevægelsesområdet. A2 og A2-W deler `453,6/907,2 Wh`, `180 N·m`,
`≈ 100 kg` stående, `≈ 25 kg` gående, `≈ 45°`, `30 cm` trin, `0,5~1 m` klatrehøjde og
samtlige porte. Det er sandsynligvis rigtigt — det er samme platform med og uden hjul.
Men det betyder, at **hjulvarianterne ikke er selvstændigt målte poster**; de er den
benede posts tal med fire tal ændret. En læser, der ser to næsten ens rækker, bør kunne
se hvorfor.

**5. Varianter foldet til én post overdriver tætheden.** Regel 3 i afsnit 4.2 tæller et
felt som udfyldt, hvis blot én variant har det. As2 får derfor `dockingstation` som
udfyldt, selv om kun EDU har den, og `LiDAR-model` som udfyldt, selv om kun AIR
navngiver den. **Vælger I én variant pr. post i stedet, falder As2 med mindst 2 felter.**

**6. `strøm ud` er talt på spænding alene.** Skemaet hedder "strøm ud V/W pr. port".
Ingen af tolv oplyser W. Feltet er reelt halvt udfyldt hos alle seks, der har det.

**7. Wh for As2/As2-W hviler på en brødtekst.** Tabellen giver kun mAh. De 648 Wh står i
marketingafsnittet. Regnestykket passer ved 43,2 V nominel, men **43,2 V står ikke på
siden** — det spænd, der står, er 36~50,4 V. Jeg har hverken regnet eller gættet;
648 Wh er producentens eget tal. Men det er ikke et tabeltal.

**8. B1's mål: foldet er længere end stående** (1202 mod 1126 mm). Jeg har ikke rettet
det og tror det er rigtigt (benene strækkes fremad), men det er ikke efterprøvet mod et
billede eller en tegning, og DATAMODEL.md F4 minder om, at kilder kan tage fejl med en
faktor.

**9. Sproget.** Alle sider er hentet i **en-US-versionen** (sidefod: "United States /
English"). Unitrees kinesiske sider kan indeholde andre eller flere tal. **Jeg har ikke
hentet dem**, og det er en reel begrænsning: fodnote [4] på As2-siden lyder "Only
supported for mainland China version", hvilket beviser, at versionerne adskiller sig.

**10. Jeg har ikke krydstjekket mod det gamle udkast.** Det var bevidst — `FUND-kina.md`
er ubekræftbar (D6), og at bruge den som facitliste ville føre dens ukendte fejl videre.
Konsekvensen er, at hvis det gamle udkast fangede noget, jeg har overset, er det tabt.

**11. Jeg tog fejl én gang undervejs, og det står i 6.1.** Jeg skrev først, at det gamle
udkasts "16 %" på B2-batteriet var forkert. Det var det ikke — det er samme afvigelse
regnet med en anden nævner. Rettet, før dokumentet blev afleveret, men det er værd at
huske: den fejl havde set ud som en forbedring i enhver gennemlæsning, der ikke regnede
begge brøker efter.

---

## 10. Hvad jeg ikke nåede, og hvad jeg sprang over

**Sprang bevidst over:**

- **Sekundære kilder.** D1 er ikke besluttet. Unitrees udviklerdokumentation
  (`support.unitree.com`, GitHub `unitreerobotics`) ville formentlig fylde `ROS 2`,
  `SDK-sprog` og `frihedsgrader` ud på flere modeller — men de ville skulle mærkes
  `kildetype: sekundaer`, og beslutningen om, hvorvidt de må tælle, ligger hos JPK.
  **Alle 12 poster er 100 % primærkilde.**
- **De kinesiske sider.** Se punkt 9 ovenfor.
- **Go2's og Go1's shopsider.** Jeg hentede kun shopsider for B2 og A2, fordi opgaven
  var at efterprøve pladsholderadvarslen, og den er bekræftet på begge. En bredere
  shop-gennemgang kunne vise, om nogen model har en **rigtig** shoppris.
- **De ikke-firbenede modeller.** H2, G1, R1, Z1, Dex-hænderne osv. hører ikke til
  kataloget.

**Nåede ikke:**

- **YAML-filer i `data/robots/`.** Opgaven bad om et fundsdokument, og CLAUDE.md siger,
  at der ikke skrives kode, før CEO'en siger til. De 12 poster er klar til at blive
  skrevet ud, men skemaet mangler stadig tre felter, materialet her viser behovet for:
  `vaegt_inkl_batteri: ja|nej` (6.11), `kilde_praeciserer_ikke_type` på nyttelast (6.12),
  og en måde at skelne varianter på (afsnit 3).
- **Foto- eller silhuetgrundlag.** Ikke min opgave, og Å3 er ikke besluttet. Intet
  billedmateriale er hentet ud over den HTML, siderne selv leverede — og **intet fra
  `media/_kilder/` må publiceres.**

**Værktøjsnote til næste indsamler:** fælden med `/tmp` i CLAUDE.md ramte mig. Et script
skrevet til `/tmp` fra Git Bash kunne ikke findes af node, som ledte i `C:\tmp`. Løsning:
læg altid scripts i projektmappen. De tre scripts i `tools/` er engangsværktøj til denne
indsamling, ikke produktkode.
