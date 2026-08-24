# FUND-kand3 — to nye poster: Keybotic Keyper (Spanien) og Bhairav Robotics Shvana (Indien)

Opgave stillet af CEO'en 24. aug 2026: byg katalogposter for de to topkandidater fra den globale
scanning i `fund/FUND-kandglobal.md`. Arbejdet i git-worktree
`C:\Praktik\websites\udstilling-wt-kand3`, gren `spor/kand3`. Ingen anden worktree eller repo er
rørt (`c:\Praktik\website`, `c:\Praktik\websites\salg` og hovedrepoet er ikke besøgt).

---

## 0. Skill-vurdering

| Skill | Valgt? | Begrundelse |
|---|---|---|
| `robotdata` | **Valgt** | Bærer 30-feltsskemaet (post-L32), de ti hårde regler og selv-tjekket med tælling. Opgaven ER dataindsamling til to robotposter. Kørte normalt via `Skill`-værktøjet ("Launching skill: robotdata"), intet `Unknown skill`, intet disk-fallback nødvendigt |
| `parallelt` | Gået forbi | Jeg *er* ét spor i en allerede fordelt kørsel (spor/kand3). Skillen bruges af den, der fordeler arbejde på tværs af spor, ikke af udførelsen inden i ét spor. To robotter fra to forskellige lande er i forvejen uafhængige researchopgaver, men at splitte dem til to underagenter ville lade to samtidige processer skrive rå kildefiler og en fælles MANIFEST.tsv i samme mappe uden nogen fordel — arbejdet er lige så hurtigt sekventielt |
| `grillmig` | Gået forbi | Gælder gril af et brief *før* det sendes, eller lås af en åben STATUS.md-beslutning. Mit brief er allerede givet og afsendt, og jeg låser ingen beslutning her |
| `critique`, `ui-ux-critique`, `impeccable`, `dataviz` | Gået forbi | Ingen bygget flade at vurdere, ingen sammenligningsgrafik |
| `new-project`, `code-review`, `simplify` | Gået forbi | Ingen generator- eller værktøjskode ændret — kun to datafiler og ét engangsscript til et manifest |

---

## 1. Facit

**2 leveret, 0 afvist.** Begge kandidater bestod stopprøven med et utvetydigt producentcitat.

| Robot | Slug | Status | Specifikationstæthed (nævner 30) |
|---|---|---|---|
| Keybotic Keyper | `keybotic-keyper` | i_produktion | 10/30 udfyldte felter = **33 %** |
| Bhairav Robotics Shvana | `bhairav-robotics-shvana` | annonceret | 5/30 udfyldte felter = **17 %** |

(Tællingen her er MASKINELT genereret — se afsnit 6 — ikke skønnet. Første håndoptælling i et
tidligere udkast af denne rapport landede forkert to gange (15/30 og 11/30) før den blev
efterprøvet med et lille script, der læser felterne direkte fra YAML'en. Den fejlvandring er
dokumenteret ærligt i afsnit 6, ikke rettet stiltiende. Nævneren er 30 jf. L32, ikke det ældre
33-tal `FUND-kandglobal.md` implicit arbejdede med. `node tools/build.mjs` viser derudover den
officielle bygge-taethed pr. sprog på siderne, som ikke er identisk med denne rå feltoptælling —
byggeriets tal inkluderer sprogspecifik visning og kan afvige med et par procentpoint.)

---

## 2. Stopprøve — citater

### Keybotic Keyper

- **Firbenet:** "Keyper is an autonomous **4-legged robot** designed to conduct industrial
  inspections" — https://keybotic.com/technology/, hentet 2026-08-24. Bekræftet igen i FAQ samme
  side: "Its **four legs**, agile structure, and robust design allow Keyper to access the same
  areas a human could get to, including stairs, steps, slopes, and unstable terrains such as
  gravel."
- **Reelt produkt, ikke legetøj/hobbykit:** 1. præmie i DARPA Robotics Challenge, en offentliggjort
  case study om reel drift hos en international kemivirksomhed ("Keybotic Automates Inspection
  Rounds for International Chemical Manufacturer", maj 2024), og en aktiv Robot-as-a-Service-model
  ("hire your own Keyper and start automating your inspections now") — alt fra
  https://keybotic.com/, hentet 2026-08-24.

### Bhairav Robotics Shvana

- **Firbenet:** "Bhairav Robotics unveils Bharat's first armed **quadruped** 'Shvana (श्वान)'" —
  https://bhairavrobotics.com/shvana-robot/, hentet 2026-08-24. Samme ord på forsiden: "Armed
  **Quadruped** UGV Made in India."
- **Reelt produkt, ikke legetøj/hobbykit — med forbehold:** udelukkende militær/industriel
  anvendelsestekst (Defence & Homeland Security, Industrial Environments), et team med 25+ års
  forsvarsindustrierfaring bag sig, intet forbruger- eller legetøjssprog noget sted. **Men** intet
  ord som "available now" eller "in production" findes på siden — se noten under status i afsnit 4.

---

## 3. Et fund, der opdaterer FUND-kandglobal.md

Den globale scanning konkluderede at Keybotics egen specside var "formularlåst", og at kun
presseformidlede tal (Uncrewed Systems, EU-Startups) var tilgængelige for Keyper. Det er korrekt
for de to sider, der hedder **"Product Brochure"** og **"Technical Specifications"** — begge
bekræftet formularlåste i dette spor (gemt i rå-mappen som bevis). **Men** en tredje side,
**`https://keybotic.com/technology/`**, som ikke blev besøgt i kandglobal-sporet, har et fuldt
"Specifications"-afsnit direkte på siden, uden formular — dimensioner, vægt, LiDAR-fuld
specifikation, kamerasæt, CPU-model, batteritider, ladetid. **Alle numeriske felter i
`keybotic-keyper.yaml` er hentet derfra, som primærkilde — ikke fra pressen.** Pressetallene
(2 m/s hastighed, 90 min drift, 40 min hurtiglader), som kandglobal-sporet citerede fra
Uncrewed Systems, er bevidst **ikke** brugt, fordi L21/L33 udelukker presseomtale som kilde, selv
når artiklen citerer virksomheden direkte — kun materiale fra producentens eget domæne tæller.
Konsekvensen: Keyper-posten mangler `hastighed` (ikke_oplyst), selvom et tal fandtes i pressen,
fordi det tal ikke findes på keybotic.com.

---

## 4. Felt-for-felt kildeoversigt

### Keybotic Keyper — udfyldte felter (10 af 30)

| Felt | Værdi | Kilde |
|---|---|---|
| egenvaegt | 43 kg | technology/, "Weight: 43kgs" |
| laengde | 60 cm | technology/, "Length: 60cm" |
| bredde | 95 cm | technology/, "Width: 95cm" (advarsel: større end længden — usædvanligt, ikke rettet) |
| hoejde | 35–75 cm (interval) | technology/, "Height: 60cm (min 35 max 75)" — 60cm-standardtallet kunne ikke stå ved siden af intervallet (R4 tillader kun ét), bevaret i advarslen |
| driftstid | 90–120 min, ved_last ikke_oplyst | technology/, "90/120 min battery run time" — ingen lastmærkning på de to tal |
| ladetid | 60 min | technology/, "60 min for full charge" |
| lidar | 32-kanals 3D LiDAR, 360°/90° FOV, 35 m, 1 cm præcision | technology/, "Lidar model: 32 channels" m.fl. |
| kameraer | 5 kameraer + Inspection Head (zoom/termisk/mikrofon/spot/højtaler) | technology/, "5 cameras" + "Inspection Head" |
| compute | Intel 1260P, 4P+8E, 16 tråde, 16GB RAM, 1TB M2 | technology/, "Computing"-afsnit |
| autonominiveau | GPS-fri 3D-navigation, hændelsesdetektion, flerrobot-koordinering | technology/, spredt over "Decision Making" + FAQ |
| anvendelse (identitet, tæller ikke i tæthed) | industri, inspektion, sikkerhed_overvaagning, forskning_udvikling | technology/ + home |

**Bevidst ikke_oplyst (20 felter), alle efterprøvet mod alle 5 hentede sider — intet fundet:**
frihedsgrader, nyttelast_gaaende, nyttelast_staaende, hastighed, haeldning, forhindring_enkelt,
trappetrin_kontinuerlig, ip_klasse, temp_min, temp_maks, batteri_wh, hot_swap, dockingstation,
ros2, sdk_sprog, monteringsinterface, stroem_ud, dataporte, pris (RaaS/custom, se advarsel), ce_oplyst.
10 udfyldt + 20 ikke_oplyst = 30, maskinelt optalt (afsnit 6).

### Bhairav Robotics Shvana — udfyldte felter (5 af 30)

| Felt | Værdi | Kilde |
|---|---|---|
| egenvaegt | 25 kg (minus payload) | shvana-robot/, "Weight: 25 kg (minus payload)" |
| nyttelast_gaaende | 10 kg | shvana-robot/, "Payload: 10 kg" |
| hastighed | 2–5 m/s, operator ~ | shvana-robot/, "Speed: ~2-5 m/sec" |
| driftstid | ~120 min, ved_last ikke_oplyst | shvana-robot/, "Endurance: ~120 mins" |
| autonominiveau | reinforcement learning + onboard compute, tilpasning til nye omgivelser | shvana-robot/, direkte citat |
| anvendelse (identitet) | forsvar_beredskab, industri, inspektion | shvana-robot/ |

**Bevidst ikke_oplyst (25 felter):** laengde, bredde, hoejde, frihedsgrader, nyttelast_staaende,
haeldning, forhindring_enkelt, trappetrin_kontinuerlig, ip_klasse, temp_min, temp_maks, batteri_wh,
hot_swap, ladetid, dockingstation, lidar, kameraer, compute, ros2, sdk_sprog, monteringsinterface,
stroem_ud, dataporte, pris, ce_oplyst. Siden er kort (40 linjer efter HTML-strip) og indeholder
reelt kun ét "Features"-afsnit med seks punkter — resten af skemaet er tomt, ikke overset.

To felter (kameraer, compute, monteringsinterface) blev **bevidst** sat til ikke_oplyst på trods af
at der findes relateret tekst på siden — se afsnit 5 for hvorfor teksten blev vurderet for tynd til
at tælle som et felt.

---

## 5. Grænsetilfælde, hvor jeg valgte ikke at udfylde et felt

- **Shvana / kameraer:** siden skriver kvalitativt at robotten er "packed with a suite of sensors
  that act like eyes and ears" og nævner "Vision based detection and recognition" som en evne —
  men navngiver intet kameratype/-antal/-model som **indbygget standardudstyr**. "high resolution
  RGB/thermal cameras" nævnes eksplicit kun som ét EKSEMPEL på en NYTTELAST, robotten *kan bære*
  ("A few payloads Shvana can carry include robotic arm, high resolution RGB/thermal cameras and
  specialized sensors") — altså tilbehør, ikke bekræftet indbygget udstyr. De to udsagn modsiger
  ikke hinanden, men afgør heller ikke spørgsmålet. Sat til ikke_oplyst frem for at gætte, samme
  princip som LiDAR-håndteringen i `data/robots/genisom-gangben-l2.yaml`.
- **Shvana / compute:** "onboard computational power" nævner intet chip-navn, kerneantal eller
  TOPS-tal. Teksten bærer ingen målbar oplysning ud over at der findes en computer ombord.
- **Shvana / monteringsinterface:** samme "payloads Shvana can carry"-liste som ovenfor, men uden
  monteringsstandard, boltmønster, spænding eller lastkapacitet for selve grænsefladen (til
  forskel fra fx Cyvet, hvor siden eksplicit oplyser "20kg industrial payload platform"). At
  genbruge nyttelast-teksten her ville kun gentage `nyttelast_gaaende` uden ny oplysning.
- **Keyper / hoejde:** producenten oplyser BÅDE et hovedtal (60cm) OG et interval (35–75cm).
  Validatoren (R4) tillader kun ét af `vaerdi` og `min`/`maks` på samme post. Jeg valgte intervallet,
  fordi det bærer mest information, og bevarede 60cm-tallet i `advarsel`-teksten i stedet for at
  lade det gå tabt. Dette er den ene fejl, validatoren fangede under byggeriet — se afsnit 6.
- **Keyper / frihedsgrader:** "Pan range: -150º/150º" og "Tilt range: -55º/45º" står under
  overskriften "Inspection Head" og beskriver kun dette 4kg-undermoduls bevægelse, ikke robottens
  samlede led/frihedsgrader. Ikke brugt til at udfylde feltet.
- **Keyper / dataporte og Shvana / dataporte:** begge sider beskriver robottens EGEN trådløse
  netværksforbindelse (Keyper: WiFi/Ethernet/4G LTE-standarder; Shvana: "Communication: LTE, RF") —
  ikke fysiske dataporte til tilbehør (som Genisom L2's USB3.0/M12-stik). Ingen af de to blev brugt
  til at udfylde `dataporte`. Dette er endnu et eksempel på D9's observation om skemahuller, ikke en
  fejl i denne posts håndtering.

---

## 6. Selv-tjek (obligatorisk, med tælling)

Hver af de 60 feltposter (30 × 2 robotter) er gennemgået felt for felt mod den gemte rå kilde
(txt-udtræk af HTML, ikke kun WebFetch-sammendrag) EFTER YAML-filerne var skrevet:

- **Keybotic Keyper: 30 felter efterprøvet.** 1 fejl fundet: `hoejde` var først skrevet med både
  `vaerdi: 60` og `min`/`maks` samtidig, hvilket validatoren fangede som R4-brud ("posten har
  begge vaerdi og min/maks — vælg én"). Rettet ved at fjerne `vaerdi` og bevare intervallet plus en
  advarsel med det tabte tal. 0 øvrige fejl — alle 10 udfyldte tal og de 20 `ikke_oplyst`-vurderinger
  holder ved genlæsning af `keybotic-technology.txt` og de fire øvrige gemte sider.
- **Bhairav Robotics Shvana: 30 felter efterprøvet, 0 fejl fundet.** Alle 5 udfyldte tal og alle 25
  `ikke_oplyst`-vurderinger holder ved genlæsning af `bhairav-shvana-robot.txt`.
- **I alt: 60 felter efterprøvet, 1 fejl fundet og rettet** (fanget af validatoren, ikke kun ved
  øjemål — det er selve pointen med at køre `validate.mjs` som del af selv-tjekket).
- Kontrolleret særligt: operatorer bevaret (Shvanas "~" på hastighed og driftstid; Keypers manglende
  operator, fordi kilden ikke havde et forbeholdstegn), nyttelast ikke blandet (begge robotters
  nyttelast er kun sat på `nyttelast_gaaende` med begrundelse, `nyttelast_staaende` er ikke_oplyst,
  ikke 0), trinhøjde ikke blandet (begge ikke_oplyst — intet tal at blande), driftstid har
  lastbetingelse ELLER eksplicit `ved_last: ikke_oplyst` (begge robotter mangler en klar
  lastmærkning på deres driftstidstal, og begge er derfor sat sådan i stedet for at gætte en
  sammenhæng mellem et separat nyttelasttal og driftstidstallet).

**Optællingen blev målt, ikke skønnet — efter to forkerte forsøg.** Et tidligt udkast af denne
rapport skrev "15 udfyldte felter" (50 %) i afsnit 1, og en efterfølgende håndoptælling af
tabellen i afsnit 4 gav "11" (37 %) — begge forkerte. Jeg skrev et lille script, der importerer
`tools/skema.mjs`s egen `FELTNAVNE`-liste og `normaliserRobot`, læser `keybotic-keyper.yaml`
direkte, og tæller hvor mange af de 30 feltnøgler der IKKE er en af de tre tilstande
(`ikke_oplyst`/`nej`/`kun_billede`). Resultatet: **10 udfyldte, 20 ikke_oplyst.** Afsnit 1 og 4 er
rettet til dette maskinelle tal. Bhairav Shvana-tallet (5/30) var korrekt fra første håndoptælling
og blev bekræftet af samme script uden ændring.

---

## 7. Efterprøvning (maskinel)

Kørt fra worktree-roden efter begge filer var skrevet:

- **`node tools/validate.mjs`** → `57 fil(er) · 0 fejl · 1 advarsler` (den ene advarsel er den
  kendte, urelaterede Ghost Vision 60-hastighedsadvarsel — baseline uændret).
- **`node tools/build.mjs`** → `Byggede 163 sider` (baseline 155 + 8 = 163, som forventet: 2 nye
  robotter × 2 sprog × 2 sidetyper). `754 tal med kilde, 0 uden` (baseline 739 → +15 kildebelagte
  tal fra de to nye poster). `Kort på forsiden: 57`, `Taethedsnaevnere brugt: 30`.
- **`node tests/koer.mjs`** → `195 bestaaet, 2 fejlet` — identisk med den opgivne baseline (de to
  fejl er kendte, ubeslægtede sager: intervalmidtpunkt-testen og L27-rækkefølgetesten, begge
  allerede dokumenteret i `fund/FUND-test.md`/`fund/FUND-detalje.md`). Ingen regression.

---

## 8. Rå kildemateriale

Gemt i `media/_kilder/raa-kand3-2026-08-24/` (gitignoreret, kopieres af orkestratoren ved flet):

| Fil | URL | HTTP | Indhold |
|---|---|---|---|
| `keybotic-home.html` | https://keybotic.com/ | 200 | Forside — trust-logoer, DARPA, RaaS-nav |
| `keybotic-technology.html` | https://keybotic.com/technology/ | 200 | **Hovedkilde** — den egentlige, ikke-formularlåste specifikationsside |
| `keybotic-product-brochure.html` | https://keybotic.com/product-brochure/ | 200 | Bekræftet formularlåst, intet data |
| `keybotic-technical-specifications.html` | https://keybotic.com/technical-specifications/ | 200 | Bekræftet formularlåst, intet data |
| `keybotic-about-us.html` | https://keybotic.com/about-us/ | 200 | Kilde til producentby (Barcelona) |
| `bhairav-home.html` | https://bhairavrobotics.com/ | 200 | Forside — "Made in India", produktoversigt |
| `bhairav-shvana-robot.html` | https://bhairavrobotics.com/shvana-robot/ | 200 | **Hovedkilde** — al Shvana-data |
| `bhairav-careers.html` | https://bhairavrobotics.com/careers/ | 200 | Kilde til producentby (Kakinada) |

Hver .html har en tilhørende .txt (HTML-strippet med `tools/strip-html.mjs`, brugt til den
faktiske felt-for-felt genlæsning i selv-tjekket) og `MANIFEST.tsv` (url, http-status,
hentet-UTC, sha256, bytes, indhold) genereret af et lille engangsscript,
`lav-manifest.mjs`, som også ligger i mappen.

---

## 9. Billedkandidater (ikke bedømt — separat spor)

Ingen `billede:`-blok i nogen af de to poster, som instrueret. Kandidat-URL'er fra producenternes
egne sider, ikke bedømt med øjne:

- **Keyper:** https://keybotic.com/wp-content/uploads/2023/12/keyper-robot-03opt.png og
  `.../keyper-robot-04opt.png` — helmaskine-studiofotos fra /technology/-siden.
- **Shvana:** https://bhairavrobotics.com/wp-content/uploads/sites/197/2025/08/Shvana-page-pic1.png
  og `.../Shvana-page-pic4.png` — produktfotos fra shvana-robot/-siden.

---

## 10. Selv-review — hvad jeg er usikker på

- **Keypers `status: i_produktion` er en fortolkning, ikke et citat.** Siden bruger intetsteds ord
  som "in production" eller "available now" — jeg har udledt det af DARPA-prisen, case studyen om
  en navngiven kunde og den aktive RaaS-model. Det er en rimelig læsning, men det er min
  kategorisering, ikke producentens egen. Dokumenteret i posten selv, ikke skjult.
- **Shvanas `status: annonceret` hviler på et fravær** (ingen kundecase, intet "in production"-ord)
  snarere end et positivt bevis for at det IKKE er i produktion. Samme forbehold, modsat retning —
  robotten kan faktisk være i produktion uden at siden siger det.
- **Keypers længde (60cm) < bredde (95cm)** er gengivet ordret, men jeg kan ikke forklare det. Min
  gæt — at "bredde" måske dækker benspredning under gang snarere end kroppens egen bredde — er en
  gætning fra mig, IKKE et producentcitat, og står kun som en mulig forklaring i en advarsel, ikke
  som en rettelse.
- **Shvanas nyttelast (10 kg) er placeret som "gående", ikke "stående"** ud fra konteksten
  ("carry... walk... to carry out required tasks"), men siden skelner reelt ikke selv mellem de to
  tilstande. Samme fortolkningsvalg er allerede brugt i `yufan-lingmao-cyvet.yaml`, så det er
  konsistent med resten af kataloget — men det er stadig en tolkning af en enkelt linje, ikke et
  eksplicit "gående vs. stående"-citat.
- **Jeg lavede to optællingsfejl i selve denne rapports løbende tekst** (afsnit 4's "15 felter" og
  facit-tabellens 50 %-tal i afsnit 1, begge rettet i afsnit 6) — YAML-filerne selv var korrekte og
  bestod validatoren første gang efter hoejde-rettelsen, men rapportteksten om dem var det ikke.
  Nævnt her, fordi CLAUDE.md's regel om at måle frem for at skønne gælder rapporten lige så meget
  som dataen.
- **Jeg nåede ikke** at hente Bhairav Robotics' `contact/`-side (fundet via søgning, ikke besøgt) —
  den kunne muligvis bekræfte adressen yderligere, men Kakinada er allerede bekræftet direkte fra
  producentens egen careers-side, så det vurderes ikke kritisk.
- **Jeg har ikke forsøgt at finde en PDF-udgave af Keybotics produktbrochure** uden om
  formular-gaten (fx via en søgemaskines cache eller en tredjeparts fil-delingsside) — det ville
  være et forsøg på at omgå producentens egen adgangsbegrænsning, hvilket jeg vurderede lå uden for
  opgavens ånd (kilden skal være det, producenten faktisk offentliggør, ikke det man kan omgå sig
  til).
