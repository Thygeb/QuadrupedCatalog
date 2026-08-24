# KILDEKORT B — Ghost Robotics, Rainbow Robotics, Kawasaki

Kortlægning og efterprøvning af 12 råfiler i `media/_kilder/raa-vest-2026-08-19/`.
Opgaven er 100 % læsning. Intet i repoet er ændret. Intet råmateriale er kopieret ud af mappen.

Skrevet 2026-08-19.

---

## Regel 0 — skill-vurdering

**Valgt: `robotdata`, læst direkte fra disk** (`.claude/skills/robotdata/SKILL.md`) i stedet for
via Skill-værktøjet. Jeg kaldte den ikke som slash-kommando; jeg læste `SKILL.md` med `cat` og
fulgte den derfra. Det skriver jeg eksplicit, fordi CLAUDE.md kræver, at et stille fallback ikke
forveksles med at skillen kørte. Skillen bærer de ti hårde regler, og især **regel 2** (hvert tal
skal have kilde), **regel 3** (producentens egen side er primærkilden), **regel 4** (bevar
operatoren) og det **obligatoriske selv-tjek med tælling** — som er præcis det, denne opgave er.

Læst forinden, i den rækkefølge opgaven bad om: `CLAUDE.md`, `DATAMODEL.md`,
`media/_kilder/LÆSMIG.md`, `fund/FUND-vest.md` afsnit 4, 5, 6, 11 samt `## Kilder`.

**Gik forbi, med begrundelse:**

| Skill | Hvorfor ikke |
|---|---|
| `parallelt` | Bærer worktree-opsætning og prompt-tjekliste for at *dele* arbejde ud. Jeg er selv den udstationerede agent i ét spor og deler ikke videre |
| `impeccable` | Design- og IA-planlægning. Der er ingen grænseflade i denne opgave |
| `ui-ux-critique` / `critique` | Vurderer noget bygget. Der er ikke bygget noget |
| `dataviz` | Relevant når tætheden skal *vises*. Her efterprøves den |
| `new-project`, `code-review`, `simplify`, `run` | Ingen kode skrives, ingen app køres |
| `artifact-design` m.fl. | Output er en rapportfil i scratchpad, ikke en publiceret side |

Værktøj brugt: `grep`, `sed -n`, `awk` samt mappens **egne** to hjælpescripts —
`x.js` (HTML→tekst) og `pdf.js` (PDF→tekst). Begge er skrevet af en tidligere agent og er
**genbrugt, ikke genopfundet**, som opgaven bad om. Ingen råfil er læst i sin helhed ind i
konteksten.

---

## 1. Kildekort — hvad de 12 filer er

`URL` er, hvad der kan læses **ud af filens eget indhold** (canonical-tag, `og:url`,
`data-wf-domain`, absolutte links). Hvor der ikke findes et sådant felt, står det.

### Ghost Robotics (5 filer)

| Fil | Hvad det er | URL fra filens indhold | Brugbar som bevis? | Bærer hvilken FUND-vest-påstand |
|---|---|---|---|---|
| `ghost_v60.html` (222 KB) | **Produktside**, Vision 60. Webflow, `Last Published: Tue Jul 14 2026`. `<title>Vision 60 \| Ghost Robotics</title>` | Intet canonical/og:url. `data-wf-domain="www.ghostrobotics.io"`, `data-wf-page="67c6c6f454ec09a8c8901cf6"`. Indhold + K6 i FUND-vest ⇒ `https://www.ghostrobotics.io/vision-60` | **Ja.** Fuld specifikationstabel server-renderet i HTML — 21 felt/værdi-par | **K6.** Hele afsnit 4 |
| `v60.txt` (9,8 KB) | **Tekstudtræk af `ghost_v60.html`.** Bevist: `node x.js ghost_v60.html` giver 211 linjer, `diff` mod `v60.txt` er **tom** | arver K6 | Ja — det er arbejdskopien | Alle citater i afsnit 4 |
| `ghost_spec.pdf` (807 KB) | **Datablad.** `©2024 Ghost Robotics`, `Sales@ghostrobotics.io`, `www.ghostrobotics.io`. Samme specifikationstabel som produktsiden + fem afsnit brødtekst | Strengen `SPECSHEET` findes **ikke** i PDF'ens klartekst. Men `ghost_v60.html` har `href="https://cdn.prod.website-files.com/67b418349cd29a4f7829b4a5/6805d36620e2aad6e552bb0d_SPECSHEET_V3.3%20Black%2005-06-24%20(1)_1736981609615.pdf"` — **K7-URL'en er bekræftet som direkte download fra K6** | Ja. `pdf.js` giver 5,4 KB tekst (kerning-spredt, læsbar) | **K7.** Afsnit 4, kolonnen "Kilde" |
| `ghost_home.html` (152 KB) | **Forside.** `<title>Ghost Robotics \| Robots That Feel the World</title>`, `data-wf-page="67b418359cd29a4f7829b521"` | `data-wf-domain="www.ghostrobotics.io"` ⇒ `https://www.ghostrobotics.io/` | Ja — som **navigationsbevis**. Ingen specifikationstabel | **K24.** Afsnit 5: "Navigationen på K24 indeholder præcis ét produktlink" |
| `ghost_s40.html` (73 KB) | **Webflow-sidens generiske 404-side.** `<title>Not Found</title>`, `og:title="Not Found"`, brødtekst `Page Not Found` + `The Vision 60 is designed to go nearly everywhere. Unfortunately, this page isn't one of those places. Please recalibrate the URL you are trying to reach.` `data-wf-page="67b418359cd29a4f7829b523"` | Ingen. **Filen indeholder ikke den URL, der blev spurgt på** | **Nej** til tal. **Ja** som bevis for, at der ingen produktside er | Afsnit 5: "svarer HTTP 404" |

### Rainbow Robotics (6 filer)

| Fil | Hvad det er | URL fra filens indhold | Brugbar som bevis? | Bærer hvilken FUND-vest-påstand |
|---|---|---|---|---|
| `rbq10.html` (587 KB) | **Produktside**, RBQ-10. WordPress + Rank Math. `og:updated_time 2026-08-14T07:41:54` | `<link rel="canonical" href="https://rainbow-robotics.com/en/products/rbq-10/">` — **identisk med K12** | **Ja.** Både resumé-blokken og specifikationstabellen er server-renderet | **K12.** Hele afsnit 6 |
| `rbq10.txt` (12,8 KB) | **Tekstudtræk af `rbq10.html`.** Bevist: `diff` mod `node x.js rbq10.html` er **tom** | arver K12 | Ja | Alle K12-citater |
| `rbq.html` (515 KB) | **Produktoversigt** (navigation), ikke en robotside. `<title>Products \| Rainbow Robotics</title>` | `<link rel="canonical" href="https://rainbow-robotics.com/en/products/">` — **står IKKE i FUND-vests kildetabel K1-K24** | Nej til tal. Ja til firma-/sortimentsfakta (footer med hovedkvarter) | Ingen direkte. **Modbeviser dog "Daejeon", se fejl F5** |
| `rbq.txt` (8,1 KB) | **Tekstudtræk af `rbq.html`.** `diff` tom | arver ovenstående | som ovenfor | som ovenfor |
| `rbqgh.html` (122 KB) | **Dokumentationssidens forside**, VitePress v1.6.4, base `/RBQ/`. Server-renderet skal — kun 56 tekstlinjer, resten er JS | Intet canonical. Men brødteksten indeholder `Read https://rainbowrobotics.github.io/RBQ/llms-full.txt` ⇒ **`https://rainbowrobotics.github.io/RBQ/` = K13-roden** | **Delvist.** For tynd til specifikationer; bærer `RBQ SDK (C/C++)` ×2, `RBQ SDK (ROS2)` ×2, `ROS 2 Humble integration` | **K13.** Afsnit 6 felt 21-22 |
| `rbq_llms.txt` (390 KB) | **Producentens egen `llms-full.txt`** — hele manualen samlet i én fil. Egen header: `# RBQ Documentation — Complete Text`, `Site: https://rainbowrobotics.github.io/RBQ/`, `Pages included: 104`. **104 `SOURCE:`-linjer**, hver med den fulde URL på siden, den kom fra | `https://rainbowrobotics.github.io/RBQ/llms-full.txt` — **linket fra `rbqgh.html`, altså producentens eget** | **Ja, den stærkeste kilde i sættet.** Rå HTML-tabeller er bevaret i teksten | **K13.** Alle fire undersider FUND-vest navngiver, findes: `guides/add-on/specifications` (l. 168), `manual/hardware/specification` (l. 3303), `manual/product-descriptions/general-specification` (l. 4723), `manual/related-products/battery` (l. 4825) |

### Kawasaki (1 fil)

| Fil | Hvad det er | URL fra filens indhold | Brugbar som bevis? | Bærer hvilken FUND-vest-påstand |
|---|---|---|---|---|
| `kawasaki.html` (113 KB) | **Forsiden** af Kawasaki Robotics, Americas/English. WordPress. `dataLayer` siger `"is_front_page":true`, `"slug":"frontpage"`, `"modified":"2026-07-01"` | `<link rel="canonical" href="https://kawasakirobotics.com/">` og `og:url` samme. **Står IKKE i kildetabellen K1-K24** | Kun som negativt bevis, og kun for forsiden | Afsnit 11: "Ingen produktside med specifikationer på `kawasakirobotics.com`" |

---

## 2. Særopgaven: er Spirit 40 påstanden rigtig?

**FUND-vest afsnit 5 påstår:** `https://www.ghostrobotics.io/spirit-40` svarer HTTP 404, og
navigationen på K24 indeholder præcis ét produktlink, `/vision-60`.

### `ghost_s40.html` er en 404-side, ikke en produktside

Søgeudtryk og fund:

- `grep -o "<title>[^<]*</title>" ghost_s40.html` → `<title>Not Found</title>`
- `og:title` og `twitter:title` er begge `content="Not Found"`
- `node x.js ghost_s40.html` giver som eneste sideindhold under navigationen:
  > `Page Not Found`
  > `The Vision 60 is designed to go nearly everywhere. Unfortunately, this page isn't one of
  > those places. Please recalibrate the URL you are trying to reach.`
  > `Back to home`
- Ingen specifikationstabel, intet felt, intet tal. Sidens `data-wf-page` er
  `67b418359cd29a4f7829b523` — et **andet** side-id end forsiden (`…b521`) og Vision 60
  (`67c6c6f454ec09a8c8901cf6`). Det er Webflow-sidens generiske 404-skabelon.

**Delvist bekræftet — men ikke helt, og forskellen er værd at kende.** Filen beviser, at det, der
kom retur, var Webflows *ikke fundet*-side. Filen indeholder **ingen HTTP-header**, og den
indeholder **ikke den URL, der blev anmodet om**. Så råfilen kan ikke i sig selv bevise
(a) at statuskoden var 404 frem for 200, eller (b) at det var `/spirit-40`, der blev hentet.
Den kan kun bevise, at siden er sidens 404-skabelon.

**Understøttende bevis, som gør påstanden solid alligevel:**
`grep -ril "spirit-40\|spirit 40\|Spirit40"` over **hele** `raa-vest-2026-08-19/` (58 filer)
giver **nul** filer. `grep -ioc "spirit"` på `ghost_home.html`, `ghost_s40.html`,
`ghost_v60.html` og `v60.txt` giver **0, 0, 0, 0**. Ghost Robotics omtaler ikke Spirit 40 nogen
steder i det indsamlede materiale.

### Navigationen: ét produktlink

Fuld href-optælling på `ghost_home.html` (alle `href="…"`, filtreret for assets og eksterne):

```
9x  /vision-60          <- eneste produkt
4x  /defense            3x  /             3x  /news        3x  /contact-us
4x  /commercial         2x  /events       1x  /enterprise  1x  /education
1x  /military-applications  1x  /public-safety  1x  /law-enforcement
1x  /industrial-applications  1x  /construction-applications
1x  /about-us  1x  /our-philosophy  1x  /careers  1x  /case-studies
3 stk. /case-studies/<artikel>   1x  /privacy-policy
```

Ingen `/spirit-40`. Ingen anden robot. Menuen `Enterprise` udfolder præcis ét punkt: `Vision 60`.
De øvrige er brancher (`/defense`, `/commercial`) og anvendelser, ikke produkter.

**Påstanden holder.** Formuleringen bør dog strammes fra "svarer HTTP 404" til noget, filen kan
bære, fx: *"leverer producentens generiske 'Page Not Found'-side; ingen produktside findes, og
Spirit 40 nævnes ikke ét sted på ghostrobotics.io"*.

---

## 3. Efterprøvning med tælling

39 påstande slået op ordret. Kolonnen **Søgt** er det udtryk, der fandt strengen.

### Ghost Robotics — Vision 60 (afsnit 4)

| # | FUND-vest påstår | Fundet i | Søgt | Status |
|---|---|---|---|---|
| 1 | punktliste `Speed: up to 2.5 meters/second (5.6 miles/hour)` | `v60.txt:64` | `grep -n "2.5 meters/second"` | **OK, ordret** |
| 2 | tabel `Standard walk 0.9m/s (2 mph). Up to 1.2m/s (2.7 mph) fast-walk; and 2.4m/s (4.9 mph; working towards 3.0m/s 6.7 mph) sprint` | `v60.txt:151` + `ghost_spec.pdf` | `grep -n "2.4m/s"` | **OK, ordret, i begge** |
| 3 | `Tare: 51kg (112 lbs)` | `v60.txt:159` + PDF | `grep -n "Tare"` | **OK, ordret** |
| 4 | `-40º to 55º C (-40º to 131º F)` | `v60.txt:145` + PDF | `grep -n "\-40"` | **OK, ordret** |
| 5 | `US ECCN: EAR-99 \| 8479.50.00.00 Industrial Robots (No ITAR restrictions)` | `v60.txt:155` + PDF | `grep -n "EAR-99"` | **OK, ordret** |
| 6 | **Ingen Wh nogen steder** | — | `grep -in "wh\b\|watt"` på `v60.txt` → 0 hits. PDF-tekst uden mellemrum: eneste `Wh`-træf er inde i ordet `When` | **OK, bekræftet negativt** |
| 7 | `3.15 hours of continuous walking at 0.9 m/s`, `21 hours of standby time (sensors, compute, radio on)`, `10km (terrain and payload dependent)` | `v60.txt:147` | `grep -F` | **OK** |
| 8 | punktlisten skriver `3+ hours` | `v60.txt:59` `Extreme Endurance, 3+ hours of continuous walking or 20+ hours standby` | `grep -F "3+ hours"` | **OK** |
| 9 | mål 950 / 570 / 685 / 419 mm med tommer | `v60.txt:157` | `grep -F "Overall length: 950mm (37.5in)"` m.fl., alle 1 træf | **OK** |
| 10 | `10 kg (22 lbs) payload weight`, `User-selectable payload compensation mode` | `v60.txt` | `grep -F`, 1+1 træf | **OK** |
| 11 | `3 Degrees of Freedom per leg, 12-Motor back-drivable drive-train` | `v60.txt` | `grep -F`, 1 træf | **OK** |
| 12 | `NVIDIA® Xavier 32GB RAM w/ 16 channel GMSL2, 2TB NVMe SSD` | `v60.txt` | `grep -F`, 1 træf | **OK** |
| 13 | `3 x Ethernet, 1 x USB 3.1, 6 x GMSL2` | `v60.txt` | `grep -F`, 1 træf | **OK** |
| 14 | K7 = `SPECSHEET_V3.3 …` på `cdn.prod.website-files.com/67b418349cd29a4f7829b4a5/`, direkte download fra K6 | `ghost_v60.html` | `grep -o 'href="[^"]*\.pdf[^"]*"'` | **OK** — fuld URL gengivet i afsnit 1 |
| 15 | K7 uddyber `submerged in up to 1 meter of water for up to 30 minutes` | `ghost_spec.pdf` | `pdf.js` + læsning | **OK** |
| 16 | felt 18: `Integrated Sensors` indeholder ingen LiDAR; `3D lidar-based SLAM` under Mission Control | `v60.txt` | `grep -F "3D lidar-based SLAM"` 1 træf; `Integrated Sensors`-rækken er `5 x RGB … 4 x D435 depth sensors … RTK GPS` | **OK** |
| 17 | felt 25 citat `power: 12V regulated & unregulated 32-42V` | — | `grep -Fc "power: 12V regulated"` → **0**. `grep -Fc "power:12V regulated"` → **1** | **FEJL F4** (se nedenfor) |
| 18 | felt 17 dockingstation: *"Findes kun i databladet, ikke på produktsiden"*, kilde kun `K7` | `v60.txt:184-185` `Wireless Charge Kit` / `Wireless charging station for persistent 24x7 operation` | `grep -n "Wireless Charge Kit"`; bekræftet i rå HTML: `grep -oc "Wireless charging station for persistent" ghost_v60.html` → **1** | **FEJL F1** |
| 19 | felt 21+22 (ROS 2, SDK) kildeangivet **kun** `K7` | `v60.txt:180-183` `Low-level \| High-Level \| Mission Control API` / `C/C++, ROS, ROS2, MAVLink Compatible, Zeno, ATAK, JSON Mission` / `Simulator` / `Bullet Physics-based, Windows, Linux, Mac`. Rå HTML: `grep -oc "MAVLink Compatible" ghost_v60.html` → **1** | | **FEJL F2** |
| 20 | "uden K7 mangler ROS 2, SDK og dockingstation, og tallet falder til 16/29 = 55,2 %" | følger af #18-19 | | **FEJL F3** |
| 21 | Ghost Robotics, **Philadelphia**, USA | — | `grep -ioc "philadelphia"` på `ghost_home.html`, `ghost_v60.html`, `v60.txt` → **0, 0, 0**. `grep -io "Pennsylvania\|, PA [0-9]\{5\}\|address[^<]*"` → tomt | **FEJL F6** |

**Aritmetikken i afsnit 4 er efterregnet med `node` og holder hele vejen:**
51 kg = 112,44 lb (siden: 112) · 2,4 m/s = **5,37** mph (siden: 4,9 — forkert) · 4,9 mph = **2,19**
m/s · 0,9 m/s = 2,01 mph OK · 1,2 m/s = 2,68 mph OK · 3,0 m/s = 6,71 mph OK · 2,5 m/s = 5,59 mph
(siden: 5,6 OK) · −40 °C = −40 °F, 55 °C = 131 °F OK · 419 mm = 16,50 in OK.
FUND-vests konklusion om, at **kun sprintparret** er forkert, er korrekt.
*(Sidebemærkning: 950 mm = 37,40 in, siden skriver 37,5in — 0,27 % afvigelse, under enhver
rimelig tolerance. Ikke en fejl, men det viser, at en procenttolerance skal sættes ≥ 0,5 %.)*

### Ghost Robotics — Spirit 40 (afsnit 5)

| # | FUND-vest påstår | Fundet i | Søgt | Status |
|---|---|---|---|---|
| 22 | `/spirit-40` svarer HTTP 404 | `ghost_s40.html` | `<title>Not Found</title>`, `Page Not Found` | **Delvist OK** — se afsnit 2. Indholdet er 404-siden; statuskoden er ikke gemt |
| 23 | navigationen på K24 har præcis ét produktlink, `/vision-60` | `ghost_home.html` | fuld href-optælling, node-script | **OK** |
| 24 | (implicit) ingen Spirit-omtale | hele mappen | `grep -ril "spirit-40\|spirit 40\|Spirit40" .` → 0 filer | **OK** |

### Rainbow Robotics — RBQ-10 (afsnit 6)

| # | FUND-vest påstår | Fundet i | Søgt | Status |
|---|---|---|---|---|
| 25 | resumé `Walking 6 km/h, running 14 km/h` | `rbq10.txt:152` | `grep -n "km/h"` | **OK, ordret** |
| 26 | tabel `9 km/h (up to 14 km/h in running mode)` | `rbq10.txt:210` **og** `rbq_llms.txt:4749` (`<td>9&nbsp;km/h (up to 14&nbsp;km/h in running mode)</td>`) | `grep -n "running mode"` | **OK — modsigelsen er ægte og står på samme side** |
| 27 | resumé `Slope 45%, step height 20 cm` | `rbq10.txt:156` | `grep -in "step height"` | **OK, ordret** |
| 28 | tabel `Stairs and steps: up to 25 cm` | `rbq10.txt:214` | `grep -in "Stairs and steps"` | **OK — 20 mod 25 cm bekræftet** |
| 29 | K12 `4K PTZ camera and thermal camera` | `rbq10.txt:228` | `grep -Fc` → 1 | **OK, ordret** |
| 30 | K13 `2 MP 32x zoom PTZ camera and thermal camera` | `rbq_llms.txt:4798` `<td>2&nbsp;MP 32x&nbsp;zoom PTZ camera and thermal camera</td>` | `grep -in "32x"` | **OK** — kun `&nbsp;` skiller fra FUND-vests gengivelse. Manualen uddyber `Up to 1920x1080 (1/2.8" 2 MP CMOS)`, `Optical Zoom 32x (4.44 ~ 142.6 mm)` (l. 5047-5049). **4K ≈ 8,29 MP mod 2 MP — modsigelsen er ægte** |
| 31 | `18Ah (9Ah x2) / 907Wh` | `rbq_llms.txt:4848` | `grep -n "907"` | **OK, ordret** |
| 32 | `Nominal Voltage 50.4V` | `rbq_llms.txt:4851-4852` | `grep -in "nominal voltage"` | **OK.** Efterregnet: 18 × 50,4 = **907,2 Wh** — producentens tal går op |
| 33 | `Battery Weight 6.2kg (3.1kg x2)` | `rbq_llms.txt:4843-4844` | `grep -in "battery weight"` | **OK, ordret** |
| 34 | `Longitudinal slope: 45%` · `Lateral slope: 20%` | `rbq10.txt:214` + `rbq_llms.txt` (general-specification) | `grep -in "slope"` | **OK.** 45 % = **24,23°** — FUND-vests advarsel mod stiltiende omregning er korrekt |
| 35 | `1h (20 to 80%)` | `rbq_llms.txt:4868` | `grep -in "20 to 80"` | **OK, ordret** |
| 36 | ledspecifikation `40/40/50 Nm`, `104/104/140 Nm`, `14.4/14.4/11.15 rad/s` | `rbq_llms.txt:3303+` (`manual/hardware/specification.html`) | `grep -n "11.15"` + udskrift af tabellen | **OK, alle ni tal ordret.** Kolonnerne hedder `Hip Roll Joint`, `Hip Pitch Joint`, `Knee Joint` |
| 37 | felt 4 `12 joints` — 3 pr. ben (hofte-rul, hofte-nik, knæ) | `rbq_llms.txt:6837, 6840, 7447, 7450` | `grep -in "12 joint"` | **SVAG, se F7.** Strengen står kun i **SDK-API-dokumentationen** (`Joint position and velocity (12 joints)`), ikke i nogen specifikationstabel. `grep -i "degrees of freedom\|freedom"` giver **0** træf i hele `rbq_llms.txt` |
| 38 | felt 24 `Top rail (slot) + spring nuts` med udtrykkelig 15 kg-advarsel | `rbq_llms.txt:183` + `:205` `Exceeding the 15 kg payload limit or mounting mass far from the body center can destabilize walking…` | `grep -n -B2 -A2 "15 kg"` | **OK, ordret** |
| 39 | felt 17 dokning: ArUco-markør inden for 5 m | `rbq_llms.txt:480` `The distance between the docking station and the robot must be within 5 meters, and the front or rear camera must be able to recognize ArUco markers…` | `grep -in "ArUco"` (4 træf) | **OK, ordret** |
| 40 | Rainbow Robotics, **Daejeon**, Sydkorea | — | `grep -in "daejeon"` på **alle seks** Rainbow-filer → **0 træf**. Producentens egen footer, `rbq10.txt:300` og `rbq.txt`: `(30141) 8, Jipyeongjungang 3-ro, Jipyeon-dong, **Sejong-si**, Republic of Korea` | **FEJL F5** |

Øvrige K12-felter kontrolleret ordret med `grep -Fc` (alle 1 træf, alle på de linjer der er
angivet): `98 × 43 × 62 cm (L × W × H)` :206 · `42kg` :208 · `15 kg` :212 ·
`2 hours (up to 4 hours)` :216 · `IP54` :218 ·
`Swappable / Separate charging / Automatic charging support` :220 ·
`IMU (RGB + Depth) ×2 Depth ×4 3D LiDAR (optional)` :222 · `54 V, 12 V, CAN (1 ch), Gigabit LAN ×3`
:226 · `Wireless Charging Station` :233 · `ROS 2, DDS integration` (2 træf).
K13's `Weight (with battery) / 42 kg` bekræftet på `rbq_llms.txt:4744`.

### Kawasaki (afsnit 11)

| # | FUND-vest påstår | Fundet i | Søgt | Status |
|---|---|---|---|---|
| 41 | Ingen produktside med specifikationer for RHP Bex på `kawasakirobotics.com` | `kawasaki.html` | `grep -ioc "bex"` → **0**. `grep -io "RHP[ _-]*[A-Za-z]*\|quadruped\|four-legged\|Robust Humanoid"` → **tomt** | **Bekræftet for forsiden — men se F8** |

---

## 4. Fejl og afvigelser fundet — 8 stk.

### F1 (alvorlig) — dockingstationen står også på produktsiden

Afsnit 4, felt 17, note: *"Findes kun i databladet, ikke på produktsiden."* Kilde angivet: **K7**.

Den står på produktsiden. `v60.txt:184-185`:

```
Wireless Charge Kit
Wireless charging station for persistent 24x7 operation
```

Kontrolleret direkte i rå HTML for at udelukke en artefakt fra `x.js`:
`grep -oc "Wireless charging station for persistent" ghost_v60.html` → **1**.

**Ret til:** kilde `K6, K7`, og slet noten.

### F2 (alvorlig) — ROS 2 og SDK står også på produktsiden

Afsnit 4, felt 21 og 22 er kildeangivet **kun** `K7`. `v60.txt:180-183`:

```
Low-level | High-Level | Mission Control API
C/C++, ROS, ROS2, MAVLink Compatible, Zeno, ATAK, JSON Mission
Simulator
Bullet Physics-based, Windows, Linux, Mac
```

`grep -oc "MAVLink Compatible" ghost_v60.html` → **1**. Den er i DOM'en, ikke bag en download.

### F3 (alvorlig, følgefejl af F1+F2) — kontrafaktisk tæthedstal holder ikke

Afsnit 4: *"uden K7 mangler ROS 2, SDK og dockingstation, og tallet falder til 16/29 = 55,2 %."*

Alle tre felter er dokumenteret på K6 alene. Det er **ikke** godtgjort, at tætheden falder til 16.
Konklusionen *"Igen er databladet forskellen"* er dermed uunderbygget for Vision 60. Selve
hovedtallet **19/31** er derimod ikke berørt — det er kun det kontrafaktiske tal, der falder.

Bemærk: K7 er stadig eneste kilde til `submerged in up to 1 meter of water for up to 30 minutes`
og til brødtekst om blind mode, rækkevidde (`up to 6.0 miles on a single charge`) og åben
arkitektur. Databladet er altså ikke overflødigt — det er bare ikke forskellen på de tre felter.

### F4 (mindre) — indsat mellemrum i et ordret citat

Afsnit 4, felt 25: FUND-vest skriver `power: 12V regulated & unregulated 32-42V`.
Producenten skriver `power:12V regulated & unregulated 32-42V` — **uden** mellemrum, både i
`v60.txt` og i PDF'ens tekst (`po w er:12V r egulated`, kerning-spredt).
`grep -Fc "power: 12V regulated"` → 0. `grep -Fc "power:12V regulated"` → 1.

Trivielt i sig selv. Ikke trivielt som mønster: kolonnen hedder *"Værdi som producenten skriver"*,
og det er samme klasse af stille normalisering, som regel 4 i `robotdata` forbyder for operatorer.

*(Samme klasse, ikke talt som selvstændig fejl: felt 19 gengives `4 x D435 depth sensors, dual
antenna RTK GPS`; kilden har `4 x D435 depth sensors ,  dual antenna RTK GPS`.)*

### F5 (alvorlig) — "Daejeon" står ingen steder; producenten skriver Sejong

Afsnit 6-hovedet: *"Producent: Rainbow Robotics, **Daejeon**, Sydkorea."*

`grep -in "daejeon"` på `rbq.txt`, `rbq10.txt`, `rbq_llms.txt`, `rbq.html`, `rbq10.html`,
`rbqgh.html` → **nul træf i alle seks**. Producentens egen sidefod (`rbq10.txt:300`, samme i
`rbq.txt`) angiver:

> `Headquarters` · `(30141) 8, Jipyeongjungang 3-ro, Jipyeon-dong, Sejong-si, Republic of Korea`
> · `Tel. +82-44-860-9600`

Postnummer 30141 og områdenummer 044 er begge Sejong. Rainbow Robotics **udsprang** af KAIST i
Daejeon, så det er ikke grebet ud af luften — men det er ikke, hvad kilden siger, og det er ikke
mærket som sekundær viden. Under `robotdata` regel 1 og 2 er det en oplysning uden kilde.

### F6 (alvorlig, samme klasse som F5) — "Philadelphia" står ingen steder

Afsnit 4-hovedet: *"Producent: Ghost Robotics, **Philadelphia**, USA."*
`grep -ioc "philadelphia"` på `ghost_home.html`, `ghost_v60.html`, `v60.txt` → **0, 0, 0**.
Ingen postadresse overhovedet i `ghost_home.html` — sidefoden har kun *"Get In Touch"*.
Databladet har `Sales@ghostrobotics.io` og `www.ghostrobotics.io`, ingen adresse.

F5 og F6 er den samme fejl to gange: **producentens hjemby er skrevet ind fra hukommelsen** i et
dokument, hvis egen indledning lover *"Alt herunder er producentoplyst … intet er gættet."*
`producentland`/hjemby er ganske vist et identitetsfelt, vi selv skriver, og tæller ikke i
tætheden — men netop derfor bør det have sin egen kildemarkering, ellers arver posten en
præcision, indsamlingen ikke har.

### F7 (mindre) — RBQ-10's "12 joints" kommer fra SDK-dokumentationen, ikke fra en specifikation

Afsnit 6, felt 4: `12 joints` — 3 pr. ben (hofte-rul, hofte-nik, knæ), kilde `K13`.

Strengen findes kun i SDK-afsnittene: `rbq_llms.txt:6837` og `:7447`
`| Subscribe | rt/rbq/leg_joint | LegJointInfo_ | Joint position and velocity (12 joints) |`,
og `:6840`/`:7450` `Claim ownership of all 12 joints`. Det er en API-beskrivelse.
`grep -i "degrees of freedom\|freedom"` → **0 træf** i hele manualen.

Tallet er højst sandsynligt rigtigt, og udledningen "3 pr. ben" følger af `manual/hardware/
specification`-tabellens tre ledtyper. Men **producenten oplyser ikke frihedsgrader som
specifikation** — vi udleder dem. Under D4/tællereglen bør feltet enten mærkes som udledt eller
tælles anderledes. Vision 60 har til sammenligning det ordret: `3 Degrees of Freedom per leg`.

### F8 (metodisk) — Kawasaki-konklusionen hviler på én side, og kilden er ikke registreret

To ting:

1. **`kawasakirobotics.com` optræder slet ikke i kildetabellen K1-K24.** Afsnit 11's konklusion
   har altså ingen kildenøgle, selv om råfilen findes. Under regel 2 er det et hul.
2. **Beviset er forsiden alene.** `kawasaki.html` er `is_front_page: true`. Forsiden linker til
   seks produktindgange, som **ingen af dem er hentet**: `/products/`, `/products-robots/`,
   `/products-controllers/`, `/products-others/`, `/products/k-addon/`,
   `/products/retired-models/`. Forsiden nævner ikke en eneste konkret robotmodel, så at Bex
   mangler dér, er svagt bevis for, at der ikke findes en Bex-side andre steder på domænet.

Desuden: FUND-vest skriver, at *"Bex er en forskningsplatform under `Robust Humanoid Platform`"* —
den formulering findes ikke i `kawasaki.html` (`grep -io "Robust Humanoid"` → tomt) og er ikke
kildeangivet. Påstanden om 100 kg bæreevne er derimod korrekt mærket som presse og ikke
indsamlet.

**Forslag:** enten hent `/products-robots/` og `/products/retired-models/` og gentag søgningen,
eller nedton til *"ikke fundet i produktnavigationen på forsiden 2026-08-19"*.

---

**Efterprøvet 41 påstande i 12 råfiler, fandt 8 fejl.**

Fordelt: afsnit 4 (Vision 60) 21 påstande → 5 fejl (F1, F2, F3, F4, F6) ·
afsnit 5 (Spirit 40) 3 påstande → 0 fejl, 1 formuleringsforbehold ·
afsnit 6 (RBQ-10) 16 påstande → 2 fejl (F5, F7) ·
afsnit 11 (Kawasaki) 1 påstand → 1 metodisk fejl (F8).

Ingen af de fire "producenten modsiger sig selv"-påstande, som opgaven bad mig prioritere,
er forkerte. **Alle fire holder ordret**, og de er de bedst dokumenterede påstande i
hele afsnit 4-6:

| Modsigelse | Lav værdi | Høj værdi | Begge bekræftet |
|---|---|---|---|
| Vision 60 hastighed | tabel `2.4m/s (4.9 mph)` | punktliste `2.5 m/s (5.6 mph)` | `v60.txt:151` og `:64` |
| Vision 60 mph-parret | `4.9 mph` | 2,4 m/s = 5,37 mph | efterregnet |
| RBQ-10 ganghastighed | resumé `6 km/h` | tabel `9 km/h` | `rbq10.txt:152` og `:210` |
| RBQ-10 trinhøjde | resumé `20 cm` | tabel `25 cm` | `rbq10.txt:156` og `:214` |
| RBQ-10 PTZ | K13 `2 MP 32x` | K12 `4K` (≈ 8,29 MP) | `rbq_llms.txt:4798` og `rbq10.txt:228` |

---

## 5. To kilder, der findes og ikke er indsamlet

Ikke fejl, men huller nogen bør beslutte om:

1. **Ghost Robotics' Mission Control-PDF.** `ghost_v60.html` har et **andet** direkte
   PDF-download ud over K7:
   `…/6821bc7f0a28f69e33d60eeb_Mission%20Control%20-%20Ghost%20Robotics_….pdf`.
   Ikke hentet, ikke i kildetabellen. Kan indeholde autonomi- og softwarefelter (felt 21-23).
2. **Rainbow Robotics' "RBQ Series Catalog".** `rbq10.html:2855` har
   `href="https://rainbow-robotics.com/wp-admin/admin-post.php?action=rainbow_download_file&file=798a7450-…"`
   med attributten `data-rainbow-gate-file` — altså **gated**, KOR og ENG. Ikke hentet.
   Det styrker i øvrigt FUND-vests egen pointe: manualen er åben, kataloget er ikke.

---

## 6. Selv-review — hvad jeg er usikker på

**Filer jeg ikke kunne identificere fuldt ud:** ingen af de 12. Alle tolv har enten et
canonical-tag, et `og:url`, et `data-wf-domain`, eller — for de fire `.txt`-udtræk — et
**bit-identisk `diff`** mod `node x.js <html>`, hvilket knytter dem entydigt sammen:

```
v60.txt   == x.js(ghost_v60.html)
rbq.txt   == x.js(rbq.html)
rbq10.txt == x.js(rbq10.html)
```

`rbq_llms.txt` er den eneste `.txt`, der **ikke** er et udtræk af en søsterfil — den er hentet
selvstændigt fra `https://rainbowrobotics.github.io/RBQ/llms-full.txt`, som `rbqgh.html`
udtrykkeligt linker til i sin egen brødtekst.

**Det jeg ikke kan afgøre fra råfilerne:**

1. **Statuskoden på `/spirit-40`.** Ingen HTTP-header er gemt, og filen indeholder ikke den
   anmodede URL. Jeg kan bevise 404-*siden*, ikke 404-*svaret*. Skal det lukkes helt, skal der
   gemmes et `curl -I`-output eller filnavnet skal bære URL'en. Det er i øvrigt et argument for
   `LÆSMIG.md`'s egen navnekonvention `<producent>-<model>-<hvad>-<hentedato>.<ext>`, som **ingen
   af de 58 filer i mappen følger** — `ghost_s40.html`, `rbq.html`, `x.txt`, `1101b7e2.html`
   fortæller ikke, hvad der blev hentet hvorfra hvornår.
2. **Om Ghost-specifikationstabellen på K6 er synlig for et menneske.** Strengene er i DOM'en, og
   det er nok til F1-F3. Men jeg har ikke kunnet se, om tabellen ligger bag en fane eller et
   accordion. Det ændrer ikke, at K6 *indeholder* felterne — men hvis nogen vil skrive "står på
   produktsiden", er det værd at se efter med øjnene.
3. **Om `ghost_spec.pdf` er komplet udtrukket.** `pdf.js` gav 5,4 KB tekst fra en 807 KB PDF.
   Resten er billeder og fonte, hvilket passer på et to-siders marketing-datablad — og hele
   specifikationstabellen kom med. Men et tal i en **billed**-tabel ville jeg have overset. Det
   berører især felt 13 (`ingen Wh`): jeg har bevist, at Wh ikke er i PDF'ens *tekstlag*.
4. **F7's rigtighed.** Jeg er sikker på, at `12 joints` kun står i SDK-dokumentationen, og at
   "degrees of freedom" ikke står nogen steder. Jeg er **ikke** sikker på, om det gør feltet
   ubrugeligt eller blot skal mærkes — det er en beslutning om D4, ikke et fund.
5. **Om F5/F6 skal regnes som fejl.** Hjemby er et identitetsfelt, vi selv skriver. Jeg har talt
   dem som fejl, fordi FUND-vests egen indledning lover, at intet er gættet. Det kan
   argumenteres ned til "manglende kildemarkering". Beslutningen er ikke min.

**Hvad jeg ikke nåede / sprang over bevidst:**

- Jeg har **kun** efterprøvet afsnit 4, 5, 6 og 11. De øvrige 46 filer i mappen er urørte, ud over
  ét `grep -ril "spirit"` på tværs af hele mappen.
- Jeg har **ikke** genberegnet tæthedstallene 19/31 og 21/31 felt for felt. Jeg har efterprøvet de
  enkelte feltværdier, ikke tællingen af, hvor mange der er udfyldte. F3 rører kun det
  kontrafaktiske tal 16/29.
- Jeg har **ikke** hentet noget fra nettet. Alt er læst fra mappen, som opgaven krævede.
- Ingen fil i repoet er ændret, flyttet eller slettet. Ingen commit. Alle midlertidige udtræk
  ligger i scratchpad-mappen, ikke i repoet, og intet råmateriale er kopieret ud af
  `media/_kilder/`.
