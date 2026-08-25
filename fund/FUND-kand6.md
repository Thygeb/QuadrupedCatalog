# FUND-kand6 — Addverb Trakr 5/20, NEURA quadruped, GENISOM Tongchui M1 Pro/Ultra

Spor: `spor/kand6`, worktree `C:\Praktik\websites\udstilling-wt-kand6`. Opgave fra orkestratoren
25. aug 2026: byg katalogposter for fem forhaandsvurderede kø-kandidater fra tre producenter.

---

## Skill-vurdering (regel 0)

| Skill | Valgt? | Begrundelse |
|---|---|---|
| `robotdata` | **Valgt**, læst fra disk | Opgaven er præcis det, skillen bærer: 30-feltsskemaet (L32-udgaven), de ti hårde regler, stopprøven, billedbaren, det obligatoriske selv-tjek. Læst direkte fra `.claude/skills/robotdata/SKILL.md` i denne worktree (ikke via `Skill`-værktøjet), som instrueret i briefet — bekræftet at worktree'ens kopi er den gældende (30 felter, nævner udledt af `FELTNAVNE.length`, billedbaren tilføjet 24. aug). |
| `parallelt` | Gået forbi | Jeg er allerede ét udpeget spor i en fordelt kørsel. Fem modeller fra tre producenter, hvoraf to par (Trakr 5/20, M1 Pro/Ultra) deler samme kilde-URL og samme opdagelsesproces (Addverb-fanefejlen, GENISOM's fælles techParamsData) — at splitte yderligere ville enten kræve at to agenter læste samme rå-HTML uafhængigt (dobbeltarbejde) eller risikere modstridende domme om de samme tvetydigheder (fx Trakr 20-fanens upålidelige data, NEURA-databladets PDF-udtrækning). Én sammenhængende gennemgang holder de tværgående fund (Addverb-fanefejlen, GENISOM-arvereglen) konsistente på tværs af søskendeposter. |
| `grillmig` | Gået forbi | Intet agentbrief sendes videre herfra, og ingen åben STATUS.md-beslutning låses af mig. |
| `impeccable`, `ui-ux-critique`, `critique`, `dataviz` | Gået forbi | Ingen bygget UI eller grafik at kritisere/visualisere — ren dataindsamling. |
| `new-project`, `code-review`, `simplify` | Gået forbi | Ingen kode skrives eller ændres, kun YAML-data og råt kildearkiv. |

**Konklusion:** `robotdata` er den rigtige og eneste relevante skill.

---

## Læst før arbejdet, som instrueret

`.claude/skills/robotdata/SKILL.md`, `STATUS.md` (L11 scope-udelukkelse, L21/L33 kildetyperegler,
D10/D11), `fund/FUND-kandglobal.md` (Addverb+NEURA-forarbejdet med URL'er), `fund/FUND-genisom.md`
(M1-variantens fundsted), samt formatankrene `data/robots/genisom-tongchui-m1.yaml`,
`data/robots/keybotic-keyper.yaml` og `data/robots/unitree-b2-w.yaml`.

---

## Stopprøver pr. model, med citat

### 1. Addverb Trakr 5 — BESTÅET

- **Firbenet:** "Trakr | Quadruped Robot for Surveillance & Inspection" (sidetitel); "Our quadruped
  robot is engineered to conquer complex industrial terrain." — https://addverb.ai/trakr, hentet
  2026-08-25.
- **Reelt produkt, ikke legetøj/hobbykit:** dedikeret produktside med fuld specifikationstabel,
  "DOWNLOAD BROCHURE", separat "DEV PORTAL", blogartikel om lancering på Addverbs eget
  BotValley-anlæg dækket af India Today. Addverb er en etableret, velfinansieret indisk
  robotikvirksomhed (Noida) — bekræftet på addverb.com's egne presseartikler.

### 2. Addverb Trakr 20 — BESTÅET (samme grundlag som Trakr 5, samme side)

Se addverb-trakr-5.yaml's stopprøve — samme produktside, samme quadruped-sprog. Broedtekst for
netop denne fane: "Trakr 20 is the heavy-duty quadruped. 20 kg carry, rock-steady under load."

### 3. NEURA Quadruped — BESTÅET, med et vigtigt fund undervejs

- **Firbenet:** "Meet NEURA Quadruped. Four-legged explorer robot." + FAQ: "Its four-legged design
  enables navigation through rough terrain, stairs, and obstacles that traditional wheeled systems
  cannot handle." — https://neura-robotics.com/product/quadruped-reservation/, hentet 2026-08-25.
  **Adskilt fra MiPA** (NEURAs anden robot, allerede bekræftet hjuldrevet af `FUND-kandglobal.md`).
- **Reelt produkt på egen side, ikke kun CES-presse (den skarpeste del af stopprøven):**
  `fund/FUND-kandglobal.md` (24. aug 2026) besøgte netop denne URL og konkluderede "Nej — kun pris
  publiceret". Denne gennemgang (25. aug 2026) fandt på SAMME URL både en udfyldt "At A
  Glance"-specifikationstabel og et link til en officiel PDF-datablad
  (`neurarobotics.px.media/plk/NP/QuadrupedDatasheet.pdf`, dateret "V1 / 01.01.2026", copyright
  NEURA Robotics GmbH) — begge dele NEURAs eget materiale, ikke pressedækning. Status sat til
  `annonceret`, ikke `i_produktion`, fordi databladet selv skriver "Currently in development".

### 4. GENISOM Tongchui M1 Pro — BESTÅET (samme grundlag som basisudgaven M1)

Egen fane i M1's `techParamsData`-JSON (id 226, classname "铜锤 M1 Pro"), samme sides
meta-keywords ("四足机器人,机器狗"), ingen humanoid-sprog. Fysisk forskellig fra basisudgaven
(10mm højere) og med reelt nye funktioner (UWB-/laser-visuel målfølging, talekommunikation,
optagelse/broadcast) — en reel opgradering, ikke bare en omdøbning.

### 5. GENISOM Tongchui M1 Ultra — BESTÅET (samme grundlag)

Egen fane (id 227, "铜锤 M1 Ultra"). Helt anden kameraopstilling (4x fiskeøje + 2x forlæns
stereokamera til 720° rundtomsyn, mod Pro/basis' 2x bredvinkelkamera) og anden compute (6-kernet
128 TOPS mod 8-kernet 100 TOPS) — en reel produktforskel, ikke en fejl i udtrækningen (efterprøvet
byte-for-byte mod rå HTML).

---

## Leverance

| Model | Slug | Fil |
|---|---|---|
| Addverb Trakr 5 | `addverb-trakr-5` | `data/robots/addverb-trakr-5.yaml` |
| Addverb Trakr 20 | `addverb-trakr-20` | `data/robots/addverb-trakr-20.yaml` |
| NEURA Quadruped | `neura-quadruped` | `data/robots/neura-quadruped.yaml` |
| GENISOM Tongchui M1 Pro | `genisom-tongchui-m1-pro` | `data/robots/genisom-tongchui-m1-pro.yaml` |
| GENISOM Tongchui M1 Ultra | `genisom-tongchui-m1-ultra` | `data/robots/genisom-tongchui-m1-ultra.yaml` |

Ingen afvisninger i denne runde — alle fem navngivne kandidater bestod stopprøven.

---

## Felt-for-felt-kildeoversigt

### Addverb Trakr 5 — 17 af 30 felter udfyldt (57 %)

Primærkilde `https://addverb.ai/trakr` (Framer-bygget SPA, men den statiske HTML indeholder den
fulde tekst — bekræftet ved node-baseret tekstudtrækning). Udfyldt: egenvægt (18 kg, inkl.
batteri), højde (280 mm), frihedsgrader (12, fra blogindlægget "12 actuators" — sekundær kilde,
korreleret til denne variant via matchende 90-min/5kg-tal), nyttelast_gående (5 kg, vores tolkning
af et ukvalificeret "PAYLOAD"), hastighed (1,5 m/s), hældning (30°, operator "≤" fra prosa), trap-
petrin_kontinuerlig (12 cm — modsagt af sidens egen prosa på 17 cm, dokumenteret ikke rettet), IP67
(tilvalg), temp_min/maks (5-45°C), driftstid (1,5 t), ladetid (1,5 t), dockingstation (ja), lidar
("3D LiDAR"), kameraer ("HD bredvinkelkamera"), compute (I7 + Jetson Orin), autonominiveau.
Ikke oplyst (13 felter): længde, bredde, nyttelast_stående, forhindring_enkelt, batteri_wh,
hot_swap, ros2, sdk_sprog, monteringsinterface, strøm_ud, dataporte, pris, ce_oplyst.

### Addverb Trakr 20 — 1 af 30 felter udfyldt (3 %)

**Det centrale fund i dette spor:** siden har en fane-vælger for "TRAKR 5"/"TRAKR 20", men den
statisk hentede HTML for Trakr 20-fanen gengiver MECHANICAL-gruppens tal identisk med Trakr 5
(18 kg, 280 mm, "PAYLOAD: 5 KG") — mens sidens EGEN broedtekst for samme fane siger "20 kg carry".
Otte af ni specifikationsgrupper (MOBILITY, ACTUATION, COMPUTE, COMMUNICATION, SENSORS,
ENVIRONMENT, CHARGING, OPTIONAL) står helt uden værdier for denne fane. Vurderet som en
overførselsfejl i sidens Framer-fanekomponent, ikke ægte Trakr 20-data — bekræftet uafhængigt af
WebFetch's egen opsummering ("the complete TRAKR 20 specification table is not provided").
**Eneste udfyldte felt:** nyttelast_gående (20 kg), fordi DETTE tal — modsat resten af blokken —
har uafhængig bekræftelse fra et helt andet Addverb-domæne: pressemeddelelsen på addverb.com
(citat af medstifter Bir Singh: "The Trakr 2.0, a quadruped robot, is capable of carrying up to
20 kg"). ELECTRICAL-gruppens afvigende tal (48V/8Ah/2t mod Trakr 5's 24V/10Ah/1,5t) er BEVIDST
IKKE brugt, fordi de mangler samme uafhængige bekræftelse, og blokken beviseligt indeholder mindst
ét forkert tal (payload).

### NEURA Quadruped — 11 af 30 felter udfyldt (37 %)

Primærkilde-side (`neura-robotics.com/product/quadruped-reservation/`) for ros2, sdk_sprog og
pris; officiel PDF-datablad (`kildetype: sekundaer`) for de resterende tal: egenvægt (60 kg / 132
lbs), højde (620 mm / 24,4"), nyttelast_gående (22 kg / 48,5 lbs — vores tolkning af et
ukvalificeret "Payload"), hastighed (12 km/t / 7,5 mph), trappetrin_kontinuerlig (15 cm — vores
tolkning af "Step Height"), driftstid (6 t, ingen lastbetingelse), kameraer (kvalitativ 360°-
beskrivelse). PDF'en havde ingen udtrækbare tekstlag (glyffer tegnet som vektorstier) — almindelig
node+zlib-udtrækning fejlede; `pdftotext -layout` (poppler-utils, findes via Git Bash på denne
maskine) løste det. Ikke oplyst (19 felter): længde, bredde, frihedsgrader, nyttelast_stående,
hældning, forhindring_enkelt, ip_klasse, temp_min/maks, batteri_wh, hot_swap, ladetid,
dockingstation, lidar, compute, monteringsinterface, strøm_ud, dataporte, ce_oplyst.

### GENISOM Tongchui M1 Pro — 22 af 30 felter udfyldt (73 %, målt med `node tools/validate.mjs --taethed`)

Egen `techParamsData`-blok (id 226/497-502) på M1's fælles side. Udfyldt: egenvægt (41 kg), læng-
de/bredde/højde (930×480×595mm), frihedsgrader (12), nyttelast_gående (30 kg), hastighed (6 m/s),
hældning (45°), forhindring_enkelt (80 cm, fra sidens delte marketingkort — samme kilde som
basisudgaven bruger), trappetrin_kontinuerlig (25 cm, fra egen datablok), IP67, temp_min/maks
(-20/55°C), driftstid (3,5-5 t), hot_swap (ja), ladetid (<2 t), dockingstation (ja), lidar,
kameraer, compute (8-kernet, 100 TOPS), autonominiveau, dataporte (9 navngivne porte). Ikke oplyst
(8 felter): nyttelast_stående, batteri_wh (kun V+Ah, ikke omregnet), ros2, sdk_sprog (ikke
genundersøgt i denne session, se usikkerheder), monteringsinterface, strøm_ud, pris, ce_oplyst.

### GENISOM Tongchui M1 Ultra — 22 af 30 felter udfyldt (73 %, målt med `node tools/validate.mjs --taethed`)

Egen `techParamsData`-blok (id 227/504-509). Samme mål/vægt/nyttelast/hastighed/hældning/trappetrin
som M1 Pro, men HELT ANDEN kameraopstilling (4x fiskeøje + 2x stereokamera, 720° rundtomsyn) og
ANDEN compute (6-kernet, 128 TOPS). Bemærkelsesværdigt: Ultras egen funktionsliste har INGEN
"自主导航" (selvstændig navigation)-linje — til stede som tilvalg på basisudgaven og som standard
på M1 Pro, men fraværende her. Dokumenteret som fundet i kilden, ikke antaget udeladt af os.

**Samlet:** 930 kildebelagte tal i det byggede katalog efter dette spor (baseline 857, +73), 187
sider (baseline 173, +14), 67 kort på forsiden (baseline 62, +5).

---

## Arvebeslutninger

**Ingen af de fem poster bruger `arvet_fra`.** Begrundelse, ens for begge par:

- **Addverb Trakr 5/20** deler samme `anvendelse`-citat fra samme side ("Industries where we make
  a difference") — det er den SAMME primærkilde begge varianter bor på, ikke en slutning lånt fra
  en anden robots side. `arvet_fra` ville forudsætte, at den ene variants egen side var tavs og
  lånte den andens ord; det er den ikke.
- **GENISOM M1 Pro/Ultra** deler samme `anvendelse`-citat fra M1's side ("下一个应用场景，它已提前就位")
  af samme grund — præcis samme princip som allerede etableret på GENISOM Gangben L2-W/L2-W Ultra
  i kataloget (læst som formatanker for denne beslutning).
- Skemaet har desuden ingen `arvet_fra`-mekanisme for de tekniske `felter:` (kun for
  `anvendelse`, jf. R17) — hvert teknisk tal er citeret direkte fra sin egen variants datablok,
  aldrig kopieret fra en søskendepost, heller ikke hvor tallene tilfældigvis er identiske (fx
  M1 Pro og M1 Ultras identiske mål — begge har egne kildehenvisninger, ikke en kopi af hinanden).

**To forskellige kilde-pålidelighedsdomme for et lignende problem, med begrundet forskel:**
Addverb Trakr 20's fanetabel og GENISOM's delte marketingkort (forhindring_enkelt, dataporte-tal)
er begge "sidebredt indhold uden for den aktive fanes egen datablok" — men jeg behandlede dem
forskelligt. GENISOM-tallene blev INKLUDERET (fordi basisudgaven M1, som jeg blev bedt om at
efterligne, allerede havde truffet den afgørelse for netop denne type sidebredt marketingtal).
Addverb Trakr 20's tabel blev EKSKLUDERET (fordi den indeholder et BEVISELIGT forkert tal —
"PAYLOAD: 5 KG" i en fane, hvis egen overskrift lover 20 kg — hvilket gør resten af blokken
mistænkelig på en måde, GENISOM's marketingkort ikke er). Dette er dokumenteret udførligt i begge
filers `noter:`, så en anden læser kan vurdere, om skellet er rigtigt sat.

---

## Usikkerheder (selv-review)

1. **sdk_sprog på M1 Pro/Ultra er IKKE selvstændigt genundersøgt i denne session.** Basisudgaven
   M1's post dokumenterer en udtømmende GitHub-undersøgelse (repoet `genisom_robot_sdk` binder sig
   ikke til noget produktnavn). Jeg har overført DENNE konklusion til Pro/Ultra uden en frisk
   GitHub-læsning for netop dem — det er en rimelig antagelse (samme producent, samme
   SDK-økosystem), men det er en antagelse, ikke en måling. Markeret eksplicit i begge filers
   `noter:` og på selve feltet.
2. **Trakr 20's ELECTRICAL-tal (48V/8Ah/2t) blev udeladt — det kunne være den forkerte side at
   fejle på.** De tre tal DANNER en intern konsistent historie (anderledes spænding, kapacitet OG
   løbetid, alle tre ændret sammen), hvilket kunne tyde på, at netop denne gruppe reelt blev
   ombundet til Trakr 20-fanen, selvom MECHANICAL-gruppen ved siden af ikke blev det. Jeg valgte
   den strengeste fortolkning (udelad alt uden uafhængig bekræftelse), men en mindre konservativ
   læser kunne forsvarligt inkludere dem med en tilsvarende advarsel.
3. **NEURA-databladets "V1 / 01.01.2026"-dato er mistænkeligt rund** — kan være en skabelondato
   snarere end en reel udgivelsesdato. Ikke undersøgt yderligere; brugt som `hentet`-dato er den
   dag, JEG hentede filen (2026-08-25), ikke PDF'ens interne version-dato.
4. **Addverb "Construction"→industri og "Education and Research"→(forskning_udvikling +
   forbruger_uddannelse)-mapningen er en fortolkning**, ikke en direkte oversættelse — skemaets
   syv anvendelseskategorier har ingen egen byggekategori, og "Events and Entertinment" [sic]
   passer slet ikke ind i nogen af de syv. Dokumenteret i `anvendelse.note`, men en anden læser
   kunne forsvarligt lande på andre kategorier for de samme to producentord.
5. **Mit første udkast af denne rapport skrev GENISOM-tætheden som "20 af 30 (67 %)" for både
   M1 Pro og M1 Ultra — talt i hovedet, ikke målt.** `node tools/validate.mjs --taethed` gav det
   rigtige tal, 22/30 = 73 % for begge, da rapporten blev efterprøvet mod værktøjet i stedet for
   min egen optælling (jeg havde overset, at `hot_swap`, `dockingstation` og `driftstid`'s
   `min`/`maks`-form også tæller som udfyldt i tællerlogikken). Rettet inden aflevering — nævnt
   her, fordi CLAUDE.md's regel "mål frem for at skøn" netop advarer mod denne fejltype, og en
   selvopdaget og rettet fejl er mere retvisende end en, der bare forsvinder ubemærket.
6. **Jeg dokumenterede Addverbs torque/ROM-lignende supplerende data (MAX TORQUE, RANGE OF
   MOTION) i `noter:`, men gjorde IKKE det samme for GENISOM Pro/Ultras tilsvarende
   ledparameter-sektion (关节运动空间, 高性能轮毂电机, 最大关节扭矩) — en mindre asymmetri i
   dokumentationsgrundighed på tværs af de fem filer, opdaget under selv-tjekket. Ingen af de to
   sæt har en skemaplads, så det påvirker ikke feltdata, kun hvor meget supplerende kontekst der
   er skrevet ned.
7. **Billeder:** ingen `billede:`-blokke er tilføjet, som instrueret. Kandidat-URL'er fundet, men
   IKKE vurderet med øjne efter billedbaren:

   | Model | Kandidat-URL |
   |---|---|
   | Addverb Trakr (begge varianter) | `https://framerusercontent.com/assets/WsktmnTCdvo2kcBDjyCDVfUjDAk.png` (og-billede, sandsynligvis heltmaskine-hero — ikke besøgt/bekræftet) |
   | NEURA Quadruped | Ingen direkte billed-URL fundet i den hentede reservationsside-HTML eller PDF (databladet indeholder et vektorgrafik-billede, ikke en linkbar URL) |
   | GENISOM M1 Pro | `https://qiniu.mfdemo.cn/zhishen/2026/05/25/PF8uUVal8d7yf.webp` (techParams-ikon) |
   | GENISOM M1 Ultra | `https://qiniu.mfdemo.cn/zhishen/2026/05/25/77cbr4Bf5XmLC.webp` (techParams-ikon) |

**Hvad jeg ikke nåede:** en frisk GitHub-undersøgelse for GENISOM Pro/Ultras sdk_sprog (punkt 1);
at forsøge at finde Addverbs brochure-PDF (knappen "DOWNLOAD BROCHURE" har intet synligt href i
den statiske HTML — kunne kræve JS-udførelse for at afsløre, som ikke var til rådighed); at
vurdere billedkandidater med øjne (bevidst udeladt, som instrueret).

---

## Efterprøvning

```
node tools/validate.mjs   -> 67 fil(er) - 0 fejl - 1 advarsel (præeksisterende, Ghost Robotics
                              Vision 60, urørt af mig — identisk med kendt baseline)
node tools/build.mjs      -> Byggede 187 sider (baseline 173, +14). Kort på forsiden: 67
                              (baseline 62, +5, "skal være lig 67" — bekræftet lig).
                              Kildemærker: 930 tal med kilde, 0 uden (baseline 857, +73).
                              Sekundære kilder: 19 felter (op fra tidligere niveau — NEURA-PDF'en
                              og Addverbs pressemeddelelse bidrager til stigningen).
                              SPÆRRING S1 uændret — INGEN billede-blokke tilføjet, som instrueret.
node tests/koer.mjs       -> 195 bestået / 2 fejlet — IDENTISK med kendt baseline. De to fejl er
                              præeksisterende og dokumenterede (interval-midtpunkt,
                              kategori-rækkefølge) — urelateret til dette spor.
```

## Selv-tjek (obligatorisk), felt for felt, med tælling

Hver af de 30 skemafelter på alle fem poster er gennemgået mod den gemte rå kilde (HTML-tekst-
udtræk, pretty-printet JSON, eller `pdftotext`-udskrift) én ekstra gang efter skrivning, inkl. et
byte-niveau-genlæs af GENISOM-JSON'en direkte i rå HTML for de mest kritiske tal (vægt, mål,
compute for M1 Pro/Ultra).

| Post | Felter efterprøvet | Fejl fundet |
|---|---|---|
| Addverb Trakr 5 | 30 | 0 |
| Addverb Trakr 20 | 30 | 0 |
| NEURA Quadruped | 30 | 0 |
| GENISOM Tongchui M1 Pro | 30 | 0 |
| GENISOM Tongchui M1 Ultra | 30 | 0 |
| **I alt** | **150** | **0** |

Plus `anvendelse`-blok pr. post (5 blokke, citat+oversættelse/fortolkning genlæst): 0 fejl.
Særligt kontrolleret: operatorer bevaret (regel 4 — "≤" til "<=", "<" bevaret på NEURA/M1's ladetid),
nyttelast ikke blandet (regel 6 — alle fem poster har `nyttelast_staaende: ikke_oplyst` eksplicit,
intet gættet), trinhøjde ikke blandet (regel 7 — forhindring_enkelt/trappetrin_kontinuerlig holdt
adskilt på alle fem, inkl. bevidst `ikke_oplyst` hvor kun ét ukvalificeret step-tal fandtes),
driftstid har lastbetingelse eller `ikke_oplyst` (regel 8 — alle fem bærer `ved_last: ikke_oplyst`
med forklarende advarsel, ingen gættede kg-koblinger).

**Nul fundne fejl i denne runde** — men se Usikkerheder ovenfor for de punkter, der er
fortolkninger snarere end aflæsninger, og som en anden læser kunne forsvarligt afgøre anderledes.
