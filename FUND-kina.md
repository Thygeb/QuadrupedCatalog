# FUND-kina — publicerede specifikationer for kinesiske firbenede robotter

Indsamlet 19. august 2026 af en researchagent. **Trin 5-forarbejde** til [PLAN.md](PLAN.md);
der er ikke skrevet kode, og der er ikke oprettet YAML-filer. Dette dokument er råmaterialet
og skal læses sammen med [DATAMODEL.md](DATAMODEL.md), hvis 29-feltsskema det bruger.

**Skill-vurdering (regel 0 i [CLAUDE.md](CLAUDE.md)):** kørt `ls C:/Users/thyge/.claude/skills/`
→ `critique`, `impeccable`, `ui-ux-critique`, plus plugin-skills i systemoversigten.
**Valgt: ingen skill.** Opgaven er webresearch og talindsamling til en markdown-fil.
Gik forbi: `impeccable` (former design og IA — der er intet at forme her), `ui-ux-critique`
og `critique` (vurderer noget bygget; intet er bygget), `dataviz` (relevant når tætheden skal
tegnes, men jeg producerer ingen grafik), `new-project` (scaffolding — først når vi koder),
`code-review`/`simplify` (ingen kode). Samme fordeling som PLAN.md's egen skill-tabel.

---

## 0. Læs det her først — tre ting, der ændrer, hvordan tallene skal bruges

### 0.1 Tæthedstallene her kan ikke sammenlignes med trin 1's uden en korrektion

DATAMODEL.md siger **Unitree B2 = 14 / 29 felter = 48 %**. Jeg talte den samme robot fra den
samme side (`https://www.unitree.com/b2`, hentet 19. aug 2026) og fik **18 udfyldte felter**.

Forskellen er ikke kilden — det er optællingsmetoden, og trin 1's metode er ikke skrevet ned
detaljeret nok til at kunne genkøres. **D4 i DATAMODEL.md er stadig åben** ("tæller et felt som
udfyldt, når producenten oplyser type men ikke model?"), og svaret flytter tallet på hver eneste
post. Indtil D4 er lukket, er 48 % og mine 62 % **to forskellige målinger af samme robot**.

Jeg har derfor gjort min egen regel mekanisk og skrevet den i afsnit 1. Brug den, eller lås D4
og lad mig tælle om — men bland ikke de to sæt tal i én tabel.

### 0.2 Feltlisten i DATAMODEL.md summerer ikke til 29

Gruppeoverskrifterne siger 10 + 5 + 6 + 3 + 5 = 29. Men **Fysik-gruppen opremser 12 felter**,
ikke 10:

> egenvægt · mål stående · mål sammenfoldet · frihedsgrader · nyttelast gående ·
> nyttelast stående · maks. hastighed · maks. hældning · forhindring enkelt ·
> trappetrin kontinuerlig · IP-klasse · driftstemperatur fra/til

Summen af den faktiske liste er **31**, ikke 29. Overskriften "(10)" er sandsynligvis fra før
splittene i F1 og F2 og blev ikke opdateret. **Nævneren i sidens hovedtal er altså i øjeblikket
tvetydig.** Jeg rapporterer begge: `n/31` (min opremsede liste, revideerbar) og `n/29`
(nævneren opgaven bad om). De står side om side i tabellen i afsnit 3.

### 0.3 Én faktuel rettelse til opgavebeskrivelsen

Opgaven skrev *"DeepRobotics (Hangzhou Yushu / 云深处)"*. Det er to forskellige firmaer:

- **宇树科技 / Hangzhou Yushu Technology = Unitree.** `unitree.com`
- **杭州云深处科技 / Hangzhou Yunshenchu = DEEP Robotics.** `deeprobotics.cn`,
  produktserien hedder 绝影 (Jueying) og 山猫 (Lynx).

De er konkurrenter i samme by. Blandes navnene i datamodellen, kollapser to producentprofiler
til én.

---

## 1. Metode

**Kilder.** Producenternes egne produktsider, hentet 19. august 2026. Hvor jeg har brugt noget
andet, står ordet **SEKUNDÆR** ved tallet. Ingen tal er hentet fra forhandlere eller databaser
uden den markering.

**Sprogversion.** Hvor jeg har læst den kinesiske side, står `[CN]`; ellers er tallet fra den
engelske. Se afsnit 5.2 for hvad forskellen viste.

**Operator og interval bevares.** `> 40 kg` er ikke `40 kg`. `20~25 cm` er ikke `22,5 cm`.
`≈ 60 kg` er ikke `60 kg`. Producentens forbehold er producentens, ikke vores.

**Optællingsregel (den mekaniske del af tætheden).** Et felt tæller som udfyldt når:

1. producenten oplyser en værdi **med enhed** på sin egen side, eller en eksplicit ja/nej for
   et boolsk felt, **og**
2. værdien kan lægges i netop det felt uden at vi omregner eller fortolker.

Konsekvenser, som er valg og ikke naturlove — de skal bekræftes eller vendes:

- **`batteri Wh` tæller kun, når Wh er trykt.** `8000mAh` + `28V~33.6V` gør det ikke: uden en
  nominel spænding er Wh vores udregning, ikke producentens tal. Det koster Go2, Go2-W,
  Aliengo, MagicDog-W og AlphaDog C500 ét felt hver.
- **LiDAR tæller som udfyldt ved type alene** (`3D LiDAR ×1`). Det er den løse af de to
  D4-muligheder. Under den stramme regel (model kræves) mister **hver eneste robot i dette
  dokument** det felt — ingen kinesisk producent oplyser LiDAR-model. Det er i sig selv svaret
  på D4: den stramme regel gør feltet konstant og dermed værdiløst som skelnen.
- **`driftstid` tæller, selv når lastbetingelsen mangler** — men bærer da `ved_last: ikke
  oplyst`, jf. F3 i DATAMODEL.md. Feltet er udfyldt; sammenligneligheden er det ikke.
- **Strøm ind tæller ikke som strøm ud.** Lynx M20's "72V power input" og Mini's "Power input
  12V" er ikke `strøm ud V/W pr. port`.
- **Nul kinesiske producenter oplyser noget som helst** i gruppen *Kommercielt og EU* ud over
  pris på tre modeller. `tilgængelig i EU`, `CE oplyst`, `servicepunkt i EU` og `leveringstid`
  er tomme på 26 af 26 poster. Se afsnit 5.1.

**29-feltslisten som jeg har talt den** (identitetsfelterne tæller ikke med, jf. DATAMODEL.md):

| # | Felt | # | Felt |
|---|---|---|---|
| F1 | egenvægt | F17 | dockingstation |
| F2 | mål stående L×B×H | F18 | LiDAR (type/model) |
| F3 | mål sammenfoldet L×B×H | F19 | kameraer |
| F4 | frihedsgrader | F20 | onboard compute |
| F5 | nyttelast gående | F21 | ROS 2 |
| F6 | nyttelast stående | F22 | SDK-sprog |
| F7 | maks. hastighed | F23 | autonominiveau |
| F8 | maks. hældning | F24 | monteringsinterface |
| F9 | forhindring enkelt | F25 | strøm ud V/W pr. port |
| F10 | trappetrin kontinuerlig | F26 | dataporte |
| F11 | IP-klasse | F27 | vejledende pris |
| F12 | driftstemperatur fra/til | F28 | tilgængelig i EU |
| F13 | batteri Wh | F29 | CE oplyst |
| F14 | driftstid + ved_last | F30 | servicepunkt i EU |
| F15 | hot-swap | F31 | leveringstid |
| F16 | ladetid | | |

---

## 2. Posterne

Alle hentedatoer er **2026-08-19**. Feltnumre henviser til listen ovenfor. `—` betyder
**ikke oplyst** på producentens side; det betyder ikke nul og ikke nej.

### 2.1 Unitree Robotics — 宇树科技 (Hangzhou Yushu Technology), Hangzhou

Producentland: Kina. URL-mønster: `https://www.unitree.com/<model>`. Firbenede modeller i
forsidens navigation 19. aug 2026: As2, As2-W, Go2, Go2-W, Go1, A1 (forbruger/uddannelse);
B2, B2-W, A2, A2-W, B1, AlienGo (industri).

#### Unitree B2 — `https://www.unitree.com/b2`

| # | Felt | Værdi som trykt | Note |
|---|---|---|---|
| F1 | egenvægt | `≈ 60kg` (batteri inkl.) | operator ≈ |
| F2 | mål stående | `≈ 1098mm×450mm×645mm` | |
| F3 | mål sammenfoldet | `≈ 880mm×460mm×330mm` | etiket "Lying Prone" |
| F4 | frihedsgrader | — | |
| F5 | nyttelast gående | `> 40kg` | operator > |
| F6 | nyttelast stående | `≥ 120kg` | operator ≥ |
| F7 | maks. hastighed | `> 6m/s` | |
| F8 | maks. hældning | `> 45°` | |
| F9 | forhindring enkelt | `Max 40cm` | "Max Obstacle Crossing" |
| F10 | trappetrin kontinuerlig | `Stairs of 20~25cm` | interval bevares |
| F11 | IP-klasse | `IP67` | |
| F12 | driftstemperatur | `-20℃ ~ 55℃` | |
| F13 | batteri | `45Ah(2250Wh)，voltage 58V` | |
| F14 | driftstid | `Walking without load > 5h ... mileage > 20km`; `Walking with 20kg load > 4h ... > 15km` | tre tal på siden, se note |
| F15 | hot-swap | — | shop-siden: "Quick-change plug-in system" (**SEKUNDÆR**) |
| F16 | ladetid | — | |
| F17 | dockingstation | — | shop-siden: "optional autonomous charging" (**SEKUNDÆR**) |
| F18 | LiDAR | `3D LiDAR ×1` | type, ingen model |
| F19 | kameraer | `Depth camera ×2 + Optical camera ×2` | |
| F20 | compute | `Intel Core i5 (Platform Function), Intel Core i7 (User Development)` | |
| F21–F24 | ROS 2 / SDK / autonomi / montering | — | |
| F25 | strøm ud | `12V×4 5V×1 24V×4 BAT×1` | |
| F26 | dataporte | `1000M-Base-Ethernet×4 USB3.0×4` | |
| F27 | pris | — | se advarsel |
| F28–F31 | EU-gruppen | — | |

**Udfyldt: 18.** 18/31 = **58 %** · 18/29 = **62 %**.

> **Advarsel F14 (bekræfter F3 i DATAMODEL.md).** Siden trykker *tre* udholdenhedstal: `> 5h`
> uden last, `> 4h` med 20 kg last, og separat `Battery life 4-6h` uden lastangivelse. `4-6h`
> kan ikke bruges — den mangler betingelsen og modsiger de to andre.
>
> **Advarsel F27 — pladsholderpris.** `https://shop.unitree.com/products/unitree-b2` viser
> `$100,000.00 USD` og i samme løb `Contact us for the real price`. Det er ikke en pris, og
> **samme beløb står på A2**. Det må ikke ind i prisfeltet. Siden siger desuden både "Ready to
> ship" og "This product is unavailable".

#### Unitree B2-W — `https://www.unitree.com/b2-w`

| # | Felt | Værdi som trykt |
|---|---|---|
| F1 | egenvægt | `≈85kg` (batteri inkl.) |
| F2 | mål stående | `≈ 1098mm×550mm×758mm` |
| F3 | mål sammenfoldet | `≈ 950mm×550mm×450mm` |
| F5 | nyttelast gående | `> 40kg` |
| F6 | nyttelast stående | `120kg` |
| F7 | maks. hastighed | `15km/h` |
| F8 | maks. hældning | `> 45°` |
| F9 | forhindring enkelt | `40cm in forward direction` |
| F10 | trappetrin kontinuerlig | `Stairs of 20~25cm` |
| F11 | IP-klasse | `IP67` |
| F12 | driftstemperatur | `−20℃ ~ 55℃` |
| F13 | batteri | `>2kwh, voltage 58V` |
| F20 | compute | `Intel Core i5 (Platform Function), Intel Core i7 (User Development)` |

Øvrige felter —. **Udfyldt: 13.** 13/31 = **42 %** · 13/29 = **45 %**.

> **F14 findes ikke som tid.** B2-W oplyser kun rækkevidde: `Maximum endurance of 25km with
> 40kg load` og `≈30km` uden last. Timer er ikke trykt. **Rækkevidde er ikke et felt i skemaet**
> — og B2-W er den eneste af de 26 poster, hvor det er den eneste udholdenhedsoplysning.
> Uden et rækkeviddefelt taber vi den helt.
>
> **F7 står i km/h, ikke m/s.** Alle andre Unitree-modeller står i m/s. 15 km/h er 4,17 m/s,
> men den omregning er vores. Enheden gemmes som trykt.
>
> B2-W oplyser hjuldata (`Wheel Diameter 225mm`, `Wheel Speed 50rad/s`, `Wheel Torque 40 N.m`),
> som skemaet ikke har felter til. Hjulbenede modeller er en stor del af feltet — overvej en
> gruppe.

#### Unitree A2 — `https://www.unitree.com/A2`

| # | Felt | Værdi som trykt | Note |
|---|---|---|---|
| F1 | egenvægt | `About 42kg` m. batteri / `About 35kg` uden | begge trykt |
| F2 | mål stående | `820mm x 440mm x 570mm` | |
| F3 | mål sammenfoldet | `720mm x 550mm x 220mm` | |
| F4 | frihedsgrader | `12` | |
| F5 | nyttelast gående | `About 25kg (Ideally, it can reach approximately 35 kg.)` | se advarsel |
| F6 | nyttelast stående | `About 100kg` | |
| F7 | maks. hastighed | `0–3.7 m/s (Up to ~5 m/s)` | |
| F8 | maks. hældning | `About 45°` | |
| F9 | forhindring enkelt | `Max Step Height: 30cm` | se advarsel |
| F10 | trappetrin kontinuerlig | uafklaret | se advarsel |
| F11 | IP-klasse | `IP56` (A2) / `IP56–IP67 (Core components rated IP67)` (A2-PRO) | |
| F12 | driftstemperatur | `-20℃～55℃` | |
| F13 | batteri | `9000mAh（453.6Wh）` enkelt / `18000mAh（907.2Wh）` dobbelt; `50.4V` | |
| F14 | driftstid | `>5 hours continuous walking, approx. 20km` (uden last); `>3 hours continuous walking, approx. 12.5km` ved 25 kg | |
| F15 | hot-swap | — | shop-siden: "Hot-swappable dual battery system" (**SEKUNDÆR**) |
| F18 | LiDAR | `LiDAR × 1` (A2) / `LiDAR × 2` (A2-PRO) | type, ingen model |
| F19 | kameraer | `HD Camera × 1` | |
| F25 | strøm ud | `Power Output: 12V / 24V / BAT` | |
| F26 | dataporte | `RS485 x 2, CAN x 2, Gigabit Ethernet x 2, USB3.0-TypeC x 4` | |

Øvrige —. **Udfyldt: 17.** 17/31 = **55 %** · 17/29 = **59 %**.

> **Advarsel F5 — "ideelt" er ikke en specifikation.** `About 25kg (Ideally, it can reach
> approximately 35 kg.)` er to tal i ét felt, hvor det høje er ubetinget. Gem 25 med operator
> `≈` og lad parentesen stå som citat. **Rangér aldrig på 35.**
>
> **Advarsel F9/F10 — A2's to højdetal kan ikke mappes sikkert.** Siden trykker `Max Step
> Height: 30cm` **og** `Max Climb Height: About 0.5～1m`. På B2 hedder det tilsvarende par
> `Max Obstacle Crossing 40cm` og `Ditch Jumping Width 0.5~1.2m` — hvilket antyder, at A2's
> "Max Climb Height 0.5～1m" i virkeligheden er **grøftespring målt i bredde**, ikke en højde.
> Mappes den som højde, får A2 en forhindringsevne på op til en meter. Feltet forbliver
> uafklaret. Det er F2-fælden fra DATAMODEL.md, én gang til.
>
> **A2 er IP56, B2 er IP67.** Samme producent, samme år, to klasser fra hinanden.

#### Unitree A2-W — `https://www.unitree.com/A2-W`

| # | Felt | Værdi som trykt |
|---|---|---|
| F1 | egenvægt | `About 52kg` m. batteri / `About 45kg` uden |
| F2 | mål stående | `900mm x 440mm x 625mm` |
| F3 | mål sammenfoldet | `930mm x 685mm x 210mm` |
| F5 | nyttelast gående | `About 25kg (Ideally, it can reach approximately 35 kg.)` |
| F6 | nyttelast stående | `About 100kg` |
| F7 | maks. hastighed | `0–3 m/s (Up to ~ 6 m/s)` |
| F8 | maks. hældning | `About 45°` |
| F9 | forhindring enkelt | `Max Step Height: 30cm` |
| F11 | IP-klasse | `IP56` |
| F12 | driftstemperatur | `-20℃～55℃` |
| F13 | batteri | `18000mAh（907.2Wh）`, `50.4V` |
| F14 | driftstid | `>3.5 hours continuous walking, approx. 35km` (uden last); `>1.5 hours continuous walking, approx. 15km` ved 25 kg |
| F18 | LiDAR | `LiDAR × 2` |
| F19 | kameraer | `HD Camera × 1` |
| F20 | compute | `8-Core high-performance CPU + Intel Core i7` |
| F25 | strøm ud | `12V/24V/BAT` |
| F26 | dataporte | `RS485 x 2, CAN x 2, Gigabit Ethernet x 2, USB3.0-TypeC x 4` |

Dæk: `Diameter：190mm；Width：51mm`. Motorer `16`. Ledmoment `About 180 N.m`. Øvrige —.
Motorantallet er motorer, ikke frihedsgrader; F4 forbliver —.
**Udfyldt: 17.** 17/31 = **55 %** · 17/29 = **59 %**.

> **Hjul koster tid, ikke rækkevidde.** A2-W: `>3.5h / ~35km`. A2: `>5h / ~20km`. Hjulversionen
> kører **75 % længere på 30 % kortere tid**. Det er et af de mest brugbare tal i hele
> indsamlingen — og det kræver, at både tid og rækkevidde er felter.

#### Unitree As2 — `https://www.unitree.com/As2`

| # | Felt | Værdi som trykt |
|---|---|---|
| F1 | egenvægt | `Approx. 20 kg` (m. batteri) |
| F2 | mål stående | `720mm x 378mm x 457mm` |
| F3 | mål sammenfoldet | `776mm x 378mm x 233mm` |
| F4 | frihedsgrader | `12` |
| F5 | nyttelast gående | `With 15kg loaded` (As2 X/EDU) |
| F6 | nyttelast stående | `Approx. 65kg` |
| F7 | maks. hastighed | `0~3.7m/s (Up to ~5 m/s)` |
| F8 | maks. hældning | `Approx. 40°` |
| F10 | trappetrin kontinuerlig | `25cm` (etiket: stair climbing) |
| F11 | IP-klasse | `IP54` |
| F12 | driftstemperatur | `-20℃ ～ 55℃` |
| F13 | batteri | `648Wh (15,000mAh)` |
| F14 | driftstid | `~4 hours continuous walking, approx. 20km` (uden last); `With 15kg loaded, >2.5 hours continuous walking, approx. 13km` |
| F18 | LiDAR | `Industrial-grade 64~128-line LiDAR` |
| F19 | kameraer | `HD Camera` |
| F20 | compute | `8-Core high-performance CPU` |
| F26 | dataporte | `Gigabit Ethernet x 1`, `SBUS x 1` |

Ledmoment (As2 X) `Approx. 95 N·m`. Øvrige —.
**Udfyldt: 17.** 17/31 = **55 %** · 17/29 = **59 %**.

> **As2 stod ikke i opgavens liste.** Den ligger mellem Go2 (15 kg) og A2 (42 kg) og er ny nok
> til at mangle i de fleste eksisterende oversigter. As2-W eksisterer også; **jeg nåede den ikke.**
>
> `64~128-line LiDAR` er et interval over *hardwarekonfiguration*, ikke over en måling. Det
> betyder formentlig "flere varianter", ikke "et sted imellem". Et intervalfelt vil vise det
> forkert — se D3 i DATAMODEL.md.
>
> **IP54.** Laveste tæthedsklasse blandt Unitrees industrimodeller. Ikke udendørs i dansk vejr.

#### Unitree Go2 — `https://www.unitree.com/go2`

Fire varianter på samme side: **AIR · PRO · X · EDU**.

| # | Felt | AIR | PRO | X | EDU |
|---|---|---|---|---|---|
| F1 | egenvægt | `About 15kg` | ← | ← | ← |
| F2 | mål stående | `70cm x 31cm x 40cm` | ← | ← | ← |
| F3 | mål sammenfoldet | `76cm x 31cm x 20cm` (crouching) | ← | ← | ← |
| F5 | nyttelast gående | `≈7kg (MAX ~ 10kg)` | `≈8kg (MAX ~ 10kg)` | `≈8kg (MAX ~ 12kg)` | `≈8kg (MAX ~ 12kg)` |
| F7 | maks. hastighed | `0 ~ 2.5m/s` | `0 ~ 3.5m/s` | `0 ~ 3.7m/s (MAX ~ 5m/s)` | `0 ~ 3.7m/s (MAX ~ 5m/s)` |
| F9 | forhindring enkelt | `About 15cm` | `About 16cm` | `About 16cm` | `About 16cm` |
| F8 | maks. hældning | `30°` | `40°` | `40°` | `40°` |
| F14 | driftstid | `About 1-2h` | `About 1-2h` | `About 1-2h` | `About 2-4h` |
| F18 | LiDAR | `Super-wide-angle 4D LiDAR` | ← | ← | ← |
| F19 | kameraer | `HD Wide-angle Camera` | ← | ← | ← |
| F20 | compute | — | `8-core High-performance CPU` | ← | ← |
| F27 | pris | `$1600` | `$2800` | `$4500` | `Contact your sales expert` |

Batteri `8000mAh` (AIR/PRO/X), `15000mAh` (EDU). Spænding `28V~33.6V`. Maks. effekt
`About 3000W`. Materiale `Aluminium alloy + High strength engineering plastic`. Ledmoment
`About 45N.m` (PRO/X/EDU). Garanti 6/12/12/12 måneder. Priserne står som
`Price（Tax and freight excluded）`. Øvrige felter —.

**Udfyldt (PRO som reference): 12.** 12/31 = **39 %** · 12/29 = **41 %**.

> **Advarsel F9 — etiketten hedder `Max Climb Drop Height`.** Ikke "obstacle", ikke "stair".
> "Drop" peger mod nedstigning. Vi ved ikke, om 16 cm er en enkelt forhindring op, et fald ned
> eller en kontinuerlig trappe. Jeg har talt den som F9, fordi det er en højde på en forhindring
> — **men mappingen er et gæt og skal markeres på posten.** Go2 er den mest solgte model i
> feltet; en forkert mapping her rammer flest læsere.
>
> **Advarsel F13 — Wh er ikke trykt.** `8000mAh` med `28V~33.6V` giver 224–269 Wh afhængigt af
> hvilken spænding man vælger. Spredning på 20 %. Vi regner det ikke.
>
> **F4:** siden trykker `Knee Joint Motors: 12 set`. "Knæledsmotorer: 12" er ikke "frihedsgrader:
> 12", selv om tallet formentlig er det samme. Ikke talt.
>
> **Go2 X er ny.** Opgaven bad om Air/Pro/Edu; der er nu også en **X** mellem Pro og Edu til
> `$4500`.

#### Unitree Go2-W — `https://www.unitree.com/go2-w`

| # | Felt | Værdi som trykt |
|---|---|---|
| F1 | egenvægt | `About 18kg` (m. batteri) |
| F2 | mål stående | `70cm x 43cm x 50cm` |
| F5 | nyttelast gående | `≈8kg（MAX ~ 12kg）` |
| F7 | maks. hastighed | `0~2.5m/s` |
| F8 | maks. hældning | `35°` |
| F9 | forhindring enkelt | `Max Climb Drop Height: ＜ 70cm` |
| F14 | driftstid | `1.5-3h` (last ikke oplyst) |
| F18 | LiDAR | `Super-wide-angle 3D LIDAR` |
| F19 | kameraer | `HD Wide-angle Camera` |
| F20 | compute | `8-core High-performance CPU` |

Batteri `15000mAh`, `33.6V`. Dæk `7 Inch Pneumatic Tire`. Motorer `16`. Ledmoment
`About 45N.m`. Øvrige —. **Udfyldt: 10.** 10/31 = **32 %** · 10/29 = **34 %**.

> **`＜ 70cm` på en robot, der selv er 50 cm høj.** Samme etiket som Go2's `About 16cm`, men
> 4,4 gange værdien og nu med operator `<`. En "maksimal klatre-faldhøjde" under 70 cm på en
> 50 cm høj maskine læses mest sandsynligt som **nedstigning**, ikke opstigning. Endnu et
> argument for, at Unitrees højdeetiketter ikke kan mappes uden manualen.
>
> Go2's LiDAR hedder `4D`, Go2-W's hedder `3D`. Samme producent, samme generation. Enten er det
> forskellig hardware, eller også er den ene etiket marketing. **Vi gengiver strengen, ikke
> vores tolkning af den.**

#### Unitree B1 — `https://www.unitree.com/b1`

| # | Felt | Værdi som trykt |
|---|---|---|
| F1 | egenvægt | `About 50kg` (batteriet alene `About 5kg`) |
| F2 | mål stående | `1126*467*636mm` |
| F3 | mål sammenfoldet | `1202*467*297mm` |
| F5 | nyttelast gående | `20kg` |
| F6 | nyttelast stående | `80kg` |
| F10 | trappetrin kontinuerlig | `Maximum stair height: 20cm` |
| F11 | IP-klasse | `IP68 Waterproof` |
| F12 | driftstemperatur | `-5℃ - 45℃` |
| F13 | batteri | `18000mAh`, `51.8V`, `932.4Wh` |
| F14 | driftstid | stående `5h`; `Continuous walking without load 2h` |
| F16 | ladetid | `1-2h` |
| F19 | kameraer | `Intel RealSense D430*5` |
| F20 | compute | `Intel i5-1135G7`; `XavierNX *3` |
| F26 | dataporte | `Gigabit Interface*7/RS485*4/USB*5/CAN*4` |

Øvrige —. **Udfyldt: 14.** 14/31 = **45 %** · 14/29 = **48 %**.

> **Krydstjek af B1's batteri går op.** `18000mAh × 51.8V = 932,4Wh`. Producentens tre tal er
> indbyrdes konsistente. Det er den eneste post i indsamlingen, hvor det kan efterprøves — alle
> andre oplyser enten Wh eller mAh, ikke begge dele plus spænding.
>
> **B1 er den eneste kinesiske robot her med IP68 — og den eneste, der går i stå ved -5 °C.**
> B2 og A2 går til `-20℃`. For en dansk udendørskøber **vender de to tal rangeringen**: IP68
> lyder bedst, men `-5℃` som nedre grænse gør maskinen ubrugelig en stor del af året. Det er
> nøjagtig det, EU-kolonnen og driftstemperaturfilteret skal fange.
>
> **Ingen hastighed er trykt.** En industrirobot uden hastighedsangivelse. F7 = —.
>
> **Status kan ikke afgøres.** Siden markerer ikke B1 som udgået og ligger i navigationen under
> industri, men B2 har overtaget positionen. Samme problem på AlienGo, Go1 og A1. Se afsnit 5.3.

#### Unitree AlienGo — `https://www.unitree.com/aliengo`

| # | Felt | Værdi som trykt |
|---|---|---|
| F1 | egenvægt | `21.5kg ±1kg` |
| F2 | mål stående | `0.65*0.31*0.6m` |
| F3 | mål sammenfoldet | `0.60*0.31*0.15m` |
| F4 | frihedsgrader | `12` |
| F5 | nyttelast gående | `13kg` |
| F7 | maks. hastighed | `>1.5m/s` |
| F8 | maks. hældning | `≤25°` |
| F14 | driftstid | `2.5-4.6h` (last ikke oplyst) |
| F18 | LiDAR | `Lidar: Single or Multi-line (optional)` |
| F19 | kameraer | `Depth Camera (2), Visual Odometer Camera (1)` |
| F25 | strøm ud | `5V, 12V, 19V, BAT(24V~30V)` |
| F26 | dataporte | `EtherNetx2, USB3.0x2, USB 2.0x1, 485 port x1` |

Batteri `12600mAh` (spænding ikke trykt → F13 = —). OS `Ubuntu (Movement Control);
Ubuntu-ROS (Environment Sensing)`. Fodsensorer `4`. Øvrige —.
**Udfyldt: 12.** 12/31 = **39 %** · 12/29 = **41 %**.

> **`±1kg` er en tolerance, ikke en operator.** Skemaets `operator` kan `>`, `≥`, `≈`, `~`.
> Det kan ikke `±`. Enten får feltet en tolerance, eller også taber vi den.
>
> **F21 er tæt på — og tæller ikke.** Siden nævner `Ubuntu-ROS`, ikke ROS **2**. Forskellen er
> reel for en integrator (ROS 1 er end-of-life). Vi må ikke opgradere producentens ord.
>
> **`≤25°`.** Eneste post i indsamlingen med en øvre hældningsgrænse under 30°.

#### Unitree Go1 — `https://www.unitree.com/go1`

| # | Felt | AIR | PRO | EDU |
|---|---|---|---|---|
| F1 | egenvægt | `12 kg` | ← | ← |
| F3 | mål sammenfoldet | `0.588 x 0.22 x 0.29 m` | ← | ← |
| F5 | nyttelast gående | `≈3-5 kg (limit ~10 kg)` | ← | ← |
| F7 | maks. hastighed | `0-2.5 m/s` | `0-3.5 m/s` | `0-3.7 m/s (limit ~5 m/s)` |
| F27 | pris | `$2,700` | `$3,500` | `Contact sales` |

Ledbevægelse `Body: -49~49°, Thigh: -39~257°, Shank: -161~-51°`. `12 silver alloy precision
joint motors`. `SSS Sensors: 1 pair / 5 pair / 5 pair`. Lader `24V, 4A` / `24V, 6A`.
Ingen ståhøjde trykt → F2 = —. Øvrige —.
**Udfyldt: 5.** 5/31 = **16 %** · 5/29 = **17 %**.

> **Go1 Air koster mere end Go2 Air.** `$2,700` mod Go2 AIR's `$1600` — for en ældre og svagere
> robot. Enten er Go1-prisen ikke vedligeholdt, eller også er Go1 reelt udgået og prisen
> historisk. **Et prisfelt uden en dato på selve prisen er et fejlfelt.** `hentet` er ikke det
> samme som "prisen gælder pr.".

#### Unitree A1 og As2-W — **ikke indsamlet**

Begge findes i forsidens navigation (`/A1`, `/As2-W`). Nåede dem ikke; se afsnit 6.

---

### 2.2 DEEP Robotics — 杭州云深处科技 (Hangzhou Yunshenchu), Hangzhou

Produktserier: **绝影 / Jueying** (Lite3, X20, X30) og **山猫 / Lynx** (M20, S10).
Engelsk katalog: `https://deeprobotics.cn/en/index/…`. Kinesisk: `/robot/index/…`.

**Sprogforskel fundet:** X20 (`绝影X20`) ligger **kun** i den kinesiske navigation
(`/robot/index/product.html`). Den engelske navigation viser Lite3, X30, Lynx M20 og Lynx S10.
Læser man kun den engelske side, findes X20 ikke. `[CN]` nedenfor.

Alle DEEP Robotics-sider bærer forbeholdet: *"All parameters are laboratory data, operating in
real environment may have differences"* / *"实际运行环境下或有偏差"*. **Det er en producent, der
selv siger, at tallene er laboratorietal.** Ingen anden producent i indsamlingen gør det.

#### DEEP Robotics Lynx M20 — `https://deeprobotics.cn/en/index/lynx.html`

| # | Felt | Værdi som trykt |
|---|---|---|
| F1 | egenvægt | `Weight (Incl. Battery): 35kg` |
| F2 | mål stående | `820mm×430mm × 570mm` |
| F5 | nyttelast gående | `Payload Capacity: 15kg` |
| F6 | nyttelast stående | `Max. Load Capacity: 50kg` |
| F7 | maks. hastighed | `Lab-Tested Max. Speed: 5m/s`; `Operating Max. Speed: 2m/s` |
| F8 | maks. hældning | `Max. Slope: 45°` |
| F9 | forhindring enkelt | `Max. Single-Step Height: 80cm` |
| F10 | trappetrin kontinuerlig | `Max. Continuous Stair Height: 25cm` |
| F11 | IP-klasse | `Protection Rating: IP66` |
| F12 | driftstemperatur | `-20℃~55℃` |
| F14 | driftstid | `Unloaded Endurance/Range: 3h/15km`; `Loaded Endurance/Range (15kg): 2.5h/12km` |
| F16 | ladetid | `Charging Time (Single Battery): 1.5h` |
| F18 | LiDAR | `LiDAR ×2 (96line, 360°×90°, ~860000pts/s)` |
| F19 | kameraer | `Wide-Angle Cameras ×2` |
| F20 | compute | `Dual octa-core 64-bit industrial processors (16GB+128GB)×2` |
| F26 | dataporte | `Gigabit Ethernet` |

`Electrical Ports: 72V power input` er strøm **ind**, ikke ud → F25 = —. Øvrige —.
**Udfyldt: 16.** 16/31 = **52 %** · 16/29 = **55 %**.

> **Lynx M20 er indsamlingens bedste post — og det eneste sted, F2-splittet står trykt hos
> producenten selv.** `Max. Single-Step Height: 80cm` og `Max. Continuous Stair Height: 25cm`
> er to felter med to etiketter på samme side. Forholdet er **3,2×**. Havde vi kun taget det
> høje tal, ville M20 have slået enhver anden robot i feltet på forhindringshøjde. På det
> sammenlignelige tal, 25 cm, ligger den under Boston Dynamics Spots 30 cm.
>
> **Den skelner også mellem laboratorie- og driftshastighed**: `5m/s` mod `2m/s`. Faktor 2,5.
> Alle andre producenter oplyser ét hastighedstal, og **vi ved ikke hvilket af de to det er.**
> Det er formentlig indsamlingens vigtigste enkeltfund for sammenligningens gyldighed: DEEP
> Robotics viser, at forskellen findes, og dermed at de andres ene tal er utolket.
>
> **F5/F6-etiketterne er ikke Unitrees.** `Payload Capacity 15kg` mod `Max. Load Capacity 50kg`.
> Om "Max. Load" er *stående* last (som Unitrees ≥120 kg) eller en absolut mekanisk grænse,
> **står der ikke.** Jeg har lagt den i F6 fordi den strukturelt spiller samme rolle, men det er
> en tolkning og skal markeres.

#### DEEP Robotics X30 / X30 Pro — `https://deeprobotics.cn/en/index/product3.html` og `[CN] /robot/index/product3.html`

| # | Felt | X30 | X30 Pro |
|---|---|---|---|
| F1 | egenvægt | `56kg (battery included)` | `59kg (battery included)` |
| F2 | mål stående | `1000*695*470(mm)` | `1000*715*470(mm)` |
| F7 | maks. hastighed | `≥4m/s` | `≥4m/s` |
| F8 | maks. hældning | `≤45°` | `≤45°` |
| F10 | trin/forhindring | `≥20CM` | `≥20CM` |
| F11 | IP-klasse | `IP67` | `IP67` |
| F12 | driftstemperatur | `-20°~55°` | `-20°~55°` |
| F14 | driftstid | `2.5-4h`, rækkevidde `≥10km`, last ikke oplyst | ← |
| F25 | strøm ud | `Output power supply (72V BAT)` | `Output power supply (5V 12V 24V)` |
| F26 | dataporte | `Ethernet` | `USB2.0 USB3.0 Ethernet WiFi` |

Øvrige —. **Udfyldt: 10.** 10/31 = **32 %** · 10/29 = **34 %**.

> **X30 oplyser ingen nyttelast.** Det er DEEP Robotics' industrielle flagskib, markedsført til
> el-nettet, tunneler og miner — og feltet `nyttelast` findes ikke på siden. Til sammenligning
> oplyser X20, den *ældre* model, `持续作业负载 20kg`. Det ser ud som om producenten er holdt op
> med at oplyse tallet. **Det er præcis den slags, specifikationstætheden skal kunne straffe.**
>
> **Advarsel F9/F10 — én etiket til to felter.** `Step/Obstacle Height: ≥20CM` /
> `台阶/障碍物高度 ≥20CM`. Producenten slår de to felter, vi netop har adskilt, sammen til ét.
> Vi kan ikke splitte det. Jeg har lagt det i **F10** (den kontinuerlige, den strengeste
> tolkning), fordi det er den, sammenligninger bruger — men det er et valg, ikke en aflæsning.
> **Alternativet ville have givet X30 en fordel, den ikke har dokumenteret.**
>
> **`≥20CM` med enheden i versaler.** Alle andre felter på siden bruger små bogstaver. En
> normaliserende importør vil rette det stiltiende; det skal han ikke.
>
> Den kinesiske og den engelske X30-side har **de samme felter og de samme tal.** Ingen forskel.

#### DEEP Robotics X20 — `[CN] https://www.deeprobotics.cn/robot/index/product.html`

| # | Felt | Værdi som trykt |
|---|---|---|
| F1 | egenvægt | `整机重量 53kg` |
| F2 | mål stående | `站立尺寸 950mm × 470mm × 700mm` |
| F5 | nyttelast gående | `持续作业负载 20kg` |
| F7 | maks. hastighed | `最大速度 ≥4m/s` |
| F8 | maks. hældning | `最大爬坡角度 ≥30°` |
| F10 | trin/forhindring | `台阶/障碍物高度 ≥20cm` |
| F11 | IP-klasse | `防护等级 IP66` |
| F14 | driftstid | `续航时间 2-4h`, `续航里程 15km`, last ikke oplyst |

Øvrige —. **Udfyldt: 8.** 8/31 = **26 %** · 8/29 = **28 %**.

> **X20 findes kun på kinesisk.** Den er ude af den engelske navigation. En læser, der kun
> læser engelsk, tror den er udgået. Vi kan ikke afgøre, om den er det. **Selve
> sprogasymmetrien er et datapunkt** og hører i producentprofilen, ikke kun i robotposten.
>
> `≥30°` mod X30's `≤45°`: X20 bruger operator **≥** på hældning, X30 bruger **≤**. Samme
> producent, samme felt, modsat ulighedstegn. Det ene læses "mindst 30°", det andet "højst 45°".
> **Vi gengiver begge som trykt og retter ikke.**

#### DEEP Robotics Lite3 — `https://deeprobotics.cn/en/index/product1.html`, `[CN] /robot/index/product1.html`

Fire varianter: **Basic · Venture · Pro · LiDAR** (基础版 · 探索版 · 专业版 · 激光版).

| # | Felt | Basic | Venture | Pro | LiDAR |
|---|---|---|---|---|---|
| F1 | egenvægt | `12kg` | `12.2kg` | `12.9kg` | `13.5kg` (m. batteri) |
| F2 | mål stående | `610×370×406mm` | `610×370×445mm` | `610×370×450mm` | `610×370×496mm` |
| F5 | nyttelast gående | `5kg` | `4.5kg` | `4kg` | `2.5kg` |
| F8 | maks. hældning | `40°` | ← | ← | ← |
| F10 | trappetrin kontinuerlig | `18cm` / `连续楼梯高度 18cm` | ← | ← | ← |
| F14 | driftstid | `1.5h~2h`, rækkevidde `5km` | `4km` | `3.4km` | `2.7km` |
| F23 | autonominiveau | stop/følg | + fremadrettet undvigelse | ← | + `Auto Navigation` |
| F25 | strøm ud | — | `24V/12V/5V` | ← | ← |
| F26 | dataporte | — | `Ethernet×2` | `USB 3.0; HDMI; Ethernet` | ← |

Øvrige —. **Udfyldt (LiDAR-version): 10.** 10/31 = **32 %** · 10/29 = **34 %**.

> **Den kinesiske etiket er skarpere end den engelske.** EN siger `Stair Height: 18cm`. CN siger
> `连续楼梯高度 18cm` — *kontinuerlig* trappehøjde. **Det er F2-feltet direkte, og kun den
> kinesiske side siger hvilket af de to felter tallet hører i.** Læser man kun engelsk, må man
> gætte. Det er indsamlingens klareste bevis for, at kinesiske originalsider skal læses.
>
> **Nyttelasten falder, når udstyret stiger.** 5 kg → 2,5 kg fra Basic til LiDAR. Producenten
> trækker sensorvægten fra nyttelasten. Det er ærligt og sjældent — men det betyder, at en
> "Lite3"-post i kataloget **ikke findes**: varianterne er fire forskellige robotter på det
> felt, der filtreres mest på.
>
> **Ingen hastighed, ingen IP-klasse, ingen driftstemperatur, ingen batterikapacitet, ingen
> frihedsgrader** på nogen af de fire varianter, på nogen af de to sprog.

#### DEEP Robotics Lynx S10 — `https://deeprobotics.cn/en/index/lynxs10.html`

| # | Felt | Værdi som trykt |
|---|---|---|
| F1 | egenvægt | `≤20 kg (including battery)` |
| F7 | maks. hastighed | `flat-ground top speed of 8 m/s` |
| F9 | forhindring enkelt | `obstacles up to 50 cm high` |
| F11 | IP-klasse | `IP66` |
| F12 | driftstemperatur | `-20°C to 55°C` |

Øvrige —. **Udfyldt: 5.** 5/31 = **16 %** · 5/29 = **17 %**.

> **S10 er en lanceringsside, ikke et datablad.** Fem felter. Tallene står i løbende
> markedsføringstekst, ikke i en tabel — `weighs ≤20 kg`, `reaches a flat-ground top speed of
> 8 m/s`. **Et tal i en sætning er sværere at datere og lettere at ændre uden spor** end et tal
> i en tabel. Det bør markeres på posten.
>
> `≤20 kg` er en operator på egenvægt. Det er første gang jeg ser en producent sætte en *øvre*
> grænse på sin egen robots vægt — det er reelt en lovning, ikke en måling.

#### DEEP Robotics Mini — `https://www.deeprobotics.cn/en/index/product2.html`

Ældre side, stadig online. `Weight 23kg`, `700mm × 400mm × 500mm`, `Max. load 10kg`,
`Endurance 40min`, `Max. speed & slope 3.3m/s; 30°`, `Perception processor Intel Core i7`,
`CPU NIVIDIA Jetson Xavier NX`, `Comm interface WIFI / USB / BLUETOOTH`, `Power input 12V`.

**Udfyldt: 8.** 8/31 = **26 %** · 8/29 = **28 %**.

> **Siden indeholder en åbenlys fejl: `Battery capacity | 10kg`.** Batterikapacitet i kilogram.
> Feltet er ubrugeligt og tælles ikke. Sandsynligvis er `Max. load 10kg` kopieret ind i den
> forkerte række. **Det er nøjagtig F4-situationen fra DATAMODEL.md (Spots 110 mm mod 43,3 in):
> kilden tager fejl, og krydstjekket fanger det.** Her er der ingen imperial kolonne at
> krydstjekke mod — det var enhedens *type*, der afslørede den. **Validatoren skal derfor også
> tjekke, at enheden passer til feltet**, ikke kun at der *er* en enhed.
>
> Producenten staver `NIVIDIA`. Vi citerer stavefejlen, hvis vi citerer strengen.
> `Max. speed & slope` er to felter i én række med semikolon imellem.

---

### 2.3 MagicLab — 魔法原子, Wujiang/Suzhou

Katalog: `https://www.magiclab.top/en/`. Firbenede: **MagicDog**, **MagicDog-W**,
**MagicDog Y1**, **Magic Panda**. Detaljerede specifikationer henvises desuden til
`https://support.magiclab.top/`.

#### MagicLab MagicDog Y1 — `https://www.magiclab.top/en/dog-y`

| # | Felt | Værdi som trykt |
|---|---|---|
| F1 | egenvægt | `70Kg (with Battery)` |
| F2 | mål stående | `1050mm×458mm×810mm` |
| F5 | nyttelast gående | `Dynamic Payload: 45kg` |
| F6 | nyttelast stående | `Maximum Payload: 150kg` |
| F7 | maks. hastighed | `Maximum Speed: 6m/s` |
| F8 | maks. hældning | `Maximum Slope Angle: ≥45°` |
| F9 | forhindring enkelt | `Maximum Climbing Height: ≥60cm` |
| F11 | IP-klasse | `Ingress Protection Rating: IP67` |
| F12 | driftstemperatur | `-20℃ to 55℃` |
| F13 | batteri | `45Ah (2400Wh), Voltage 54V` |
| F14 | driftstid | `4–6h ( >4 h continuous walking with 20 kg load )` |
| F18 | LiDAR | `3D LiDAR ×1` |
| F19 | kameraer | `Depth Cameras ×2 + Optical Cameras ×2` |
| F20 | compute | `8-Core High-Performance CPU`; udvidelse `High-Performance Computing Module (157 TOPS)` |
| F25 | strøm ud | `(24V+485 output)×4`, `(12V output+EthNet)×3` |
| F26 | dataporte | `USB3.0×4`, `EthCat x 1`, EthNet |

Øvrige —. **Udfyldt: 16.** 16/31 = **52 %** · 16/29 = **55 %**.

> **Y1's datablad er strukturelt næsten identisk med Unitree B2's.** Sammenlign felt for felt:
>
> | Felt | Unitree B2 | MagicDog Y1 |
> |---|---|---|
> | batteri | `45Ah(2250Wh)` 58V | `45Ah (2400Wh)` 54V |
> | maks. hastighed | `> 6m/s` | `6m/s` |
> | IP | `IP67` | `IP67` |
> | temperatur | `-20℃ ~ 55℃` | `-20℃ to 55℃` |
> | sensorpakke | `3D LiDAR ×1 + Depth ×2 + Optical ×2` | `3D LiDAR ×1 + Depth Cameras ×2 + Optical Cameras ×2` |
> | nyttelast gående | `> 40kg` | `45kg` |
> | nyttelast stående | `≥ 120kg` | `150kg` |
>
> Samme felter, samme rækkefølge, samme sensorstreng — og hvert af Y1's tal ligger lige over
> B2's. **Det kan være ens hardware fra ens underleverandører, og det kan være et datablad
> skrevet med et andet datablad ved siden af.** Vi kan ikke afgøre det, og vi skal ikke påstå
> det. Men **kataloget skal kunne vise den slags sammenfald**, for en køber, der ser de to
> poster ved siden af hinanden, opdager det selv — og vil vide, at vi også gjorde.
>
> **Advarsel F14 — `45Ah (2400Wh)` ved `54V` går ikke op.** 45 Ah × 54 V = **2430 Wh**, ikke
> 2400. Afvigelsen er 1,2 % og kan være afrunding, men den skal noteres. B2's `45Ah × 58V =
> 2610Wh` mod trykte `2250Wh` går **ikke** op — 16 % fra. Ingen af de to producenter oplyser,
> hvilken spænding Wh-tallet er regnet ved. **Konklusion: Ah og V kan ikke bruges til at
> krydstjekke Wh.** Kun Unitree B1 gik op (18000mAh × 51,8V = 932,4Wh).
>
> **Advarsel F9 — `Maximum Climbing Height ≥60cm`** er igen én etiket, hvor vi har to felter.
> Talt som F9. Y1 har ingen kontinuerlig trappeangivelse.

#### MagicLab MagicDog / MagicDog Pro — `https://www.magiclab.top/en/dog`

| # | Felt | Værdi som trykt |
|---|---|---|
| F1 | egenvægt | `15.8kg` — **net weight excluding battery** |
| F2 | mål stående | `670*350*560mm` |
| F3 | mål sammenfoldet | `720*440*290mm` (lying) |
| F4 | frihedsgrader | `13` |
| F5 | nyttelast gående | `≈5kg (Max. ≈10kg)` |
| F7 | maks. hastighed | `3.0m/s` |
| F8 | maks. hældning | `40°` |
| F9 | forhindring enkelt | `15cm` (maximum obstacle height) |
| F13 | batteri | `29.6V 8200mAh 240.7W` |
| F14 | driftstid | `1.5-3.0h` (last ikke oplyst) |
| F18 | LiDAR | `2D LiDAR` |
| F19 | kameraer | `Dual Camera + Depth Camera + 4K HD Camera + Fisheye Camera` |
| F20 | compute | `8-Core High-Performance CPU` |

Spænding `22V-36V`, maks. effekt `3200W`, ledmoment `Approx. 37.5N·m`, mikrofonarray,
ultralyd. Øvrige —. **Udfyldt: 13.** 13/31 = **42 %** · 13/29 = **45 %**.

> **Advarsel F1 — vægten er uden batteri.** `15.8kg` er `net weight (excluding battery)`.
> Alle Unitree- og DEEP Robotics-vægte i dette dokument er **med** batteri. **Sammenlignes de
> direkte, ser MagicDog lettere ud, end den er** — og `nyttelast ÷ egenvægt` (det beregnede
> felt i PLAN.md afsnit 4) bliver systematisk for højt. Skemaet mangler et
> `vægt_inkl_batteri: ja/nej`, ellers er nyttelastforholdet forkert på hver post, hvor
> producenten regner anderledes.
>
> **Advarsel F13 — `240.7W` er den forkerte enhed.** Watt er effekt, ikke energi; feltet skal
> være Wh. `29.6V × 8.2Ah = 242,7Wh` — også et andet tal end de trykte 240,7. Vi retter ikke;
> vi noterer begge dele. **Anden enhedsfejl i indsamlingen** (den første var DEEP Robotics
> Minis batteri i kilogram). To ud af 26 poster har en trykt enhedsfejl.

#### MagicLab MagicDog-W — `https://www.magiclab.top/en/dog-w`

| # | Felt | Værdi som trykt |
|---|---|---|
| F1 | egenvægt | `22.5 kg (with battery)` |
| F2 | mål stående | `670*350*650mm` |
| F3 | mål sammenfoldet | `720*500*290mm` (prone) |
| F5 | nyttelast gående | `Maximum 10 kg` |
| F7 | maks. hastighed | `0-3 m/s` |
| F8 | maks. hældning | `≤ 40°` |
| F9 | forhindring enkelt | `Minimum obstacle clearance height: ＜ 60 cm` |
| F12 | driftstemperatur | `−5° ~ 40°` |
| F14 | driftstid | `2-4 h`; standby `Up to 8 hours (tested)` |
| F18 | LiDAR | `2D LiDAR` |
| F19 | kameraer | `Dual Camera + Depth Camera + 4K HD Camera + Fisheye Camera` |
| F20 | compute | `6TOPS` |

Motorer `16+1 (Head Motor)`, ledmoment `37.5 N·m`, hoveddrejning `≥ 100°`, batteri
`8200 mAh, Rated Voltage: 29.6 V` (Wh ikke trykt → F13 = —), ansigtsudtryk `24`. Øvrige —.
**Udfyldt: 12.** 12/31 = **39 %** · 12/29 = **41 %**.

> **`Minimum obstacle clearance height: ＜ 60 cm`.** "Minimum … mindre end" er selvmodsigende
> som specifikation. Sammen med Unitree Go2-W's `Max Climb Drop Height ＜ 70cm` er det andet
> tilfælde, hvor en hjulbenet robot får et højdetal med operator `<` og en uklar etiket.
> **Hypotese, ikke konklusion:** feltet beskriver formentlig frihøjde ved nedstigning, ikke
> forhindringshøjde ved opstigning. Skal afklares før nogen sammenligning bruger det.
>
> **F4:** EN-siden oplyser motorantal (`16+1`), ikke frihedsgrader. En kinesisk sekundærkilde
> angiver 13 DoF for MagicDog-W (**SEKUNDÆR**, ikke talt).
>
> **`−5° ~ 40°` uden enhed på graderne.** Celsius er underforstået. En streng parser vil fejle;
> det er den korrekte opførsel.

#### MagicLab Magic Panda — **ikke indsamlet.** Findes som `/en/panda`.

---

### 2.4 Weilan — 蔚蓝科技 / 南京蔚蓝智能科技, Nanjing

Katalog: `https://www.weilan.com/en/en/robots.html`. Serier: **AlphaDog C** (C500, C501),
**AlphaDog E** (E300, E400L), **BabyAlpha**.

#### Weilan AlphaDog C500 / C501 — `https://www.weilan.com/en/en/alphadogc.html`

| # | Felt | C500 | C501 |
|---|---|---|---|
| F1 | egenvægt | `24 kg` | `24.3 kg` |
| F2 | mål stående | `76×40×45 cm` | ← |
| F5 | nyttelast gående | `Payload: Up to 3 kg` | ← |
| F7 | maks. hastighed | `Speed: Up to 1.5 m/s`; `Max. Safe Speed: 3.0 m/s` | ← |
| F8 | maks. hældning | `Gradeability: Max. 20°` | ← |
| F12 | driftstemperatur | `0°C–35°C` | ← |
| F14 | driftstid | `Average Duration: Up to 5.7h`; `Continuous Walking: Up to 3.3h`; `Standing: Up to 8h`; `Standby: Up to 18h` | ← |
| F20 | compute | `CPU: ARM 64 bit`; `Hard Drive: 32 GB` | ← |

Batteri `23Ah Lithium` (spænding ikke trykt → F13 = —). OS `Linux + ROS` (ikke ROS 2 →
F21 = —). Kropsbevægelse `Roll ±30°, Pitch ±30°, Yaw ±60°`. Øvrige —.
**Udfyldt: 8.** 8/31 = **26 %** · 8/29 = **28 %**.

> **`0°C–35°C` er indsamlingens smalleste driftstemperatur og den eneste, der ikke går under
> frysepunktet.** For en dansk køber er det en diskvalifikator udendørs, hele vinteren.
> Nedre driftstemperatur er allerede et filter i PLAN.md afsnit 6; **det her er beviset for, at
> det filter skiller feltet.**
>
> **Fire udholdenhedstal, ingen lastbetingelse på nogen af dem.** `5.7h` gennemsnit, `3.3h`
> gående, `8h` stående, `18h` standby. Skemaet har ét driftstidsfelt med `ved_last`. Her er der
> brug for **tilstand** (gående / stående / standby) som en dimension ved siden af last.
> DATAMODEL.md's F3 løste last; den løste ikke tilstand.
>
> **`Max. Safe Speed 3.0 m/s` mod `Speed Up to 1.5 m/s`.** Endnu et to-hastighedstal, som DEEP
> Robotics' M20. **To ud af 26 poster oplyser to hastigheder. De øvrige 24 oplyser ét — og vi
> ved ikke hvilket.**
>
> **C100 og C200 findes ikke længere.** Opgaven bad om AlphaDog-serien; sekundære kilder og
> ældre omtaler nævner C100 (16 900 CNY) og C200 (86 900 CNY). Producentens nuværende C-side
> viser kun **C500** og **C501**. Prisene fra de gamle modeller må **ikke** overføres.

#### Weilan AlphaDog E300 / E400L — `https://www.weilan.com/en/en/alphadoge.html`

**Nul specifikationer publiceret.** Siden viser produktnavn, billede og "Enterprise Version
Available". Ingen vægt, ingen mål, ingen hastighed, intet batteri, ingen sensorer.

**Udfyldt: 0.** 0/31 = **0 %** · 0/29 = **0 %**.

> **Det er den vigtigste post i afsnittet, netop fordi den er tom.** Weilans *industrimodeller*
> — dem en driftschef ville overveje — har lavere specifikationstæthed end deres legetøj.
> En 0 %-post beviser, at rangeringen på åbenhed virker: den kan ikke spilles uden at udgive
> data, og her er der ingen at spille med.
>
> Det stiller også et designspørgsmål: **hvordan ser en post ud, hvor 29 af 29 felter er
> "ikke oplyst"?** DATAMODEL.md's fund om tomme felter som førsteklasses tilstand gælder her i
> ekstrem form. Hvis posten ser ødelagt ud, har vi bygget forkert.

#### Weilan BabyAlpha — **ikke indsamlet.** Hjemmerobot; scope-spørgsmål, se afsnit 5.4.

---

### 2.5 Xiaomi — 小米, Beijing

#### Xiaomi CyberDog 2 (铁蛋2) — `https://www.mi.com/cyberdog2` og `/cyberdog2/specs`

**Udfyldt fra primærkilde: 0.** 0/31 = **0 %** · 0/29 = **0 %**.

Det er ikke, fordi Xiaomi ikke oplyser noget. Det er, fordi **oplysningerne ikke findes som
tekst**. Hvad jeg konstaterede 19. aug 2026:

1. Produktsiden findes og svarer HTTP 200 **kun med en browser-user-agent**. Uden en svarer
   `mi.com` HTTP 403. Vores hentere kan altså ikke automatisk følge posten.
2. Der findes en dedikeret parameterside, `https://www.mi.com/cyberdog2/specs`, som siden selv
   linker til under navnet `参数页`.
3. **Parametersiden indeholder ingen søgbare tal.** Jeg søgte i den rå HTML efter `8.9`,
   `36.7`, `1.6m/s`, `12999` og `自由度` — nul træffere. Specifikationerne er udgivet som
   **billeder**.
4. Sidens egen JSON-blok siger:
   `"product_info":{"product_id":"19079","name":"CyberDog 2 仿生四足机器人","price":"0",
   "is_enable":false}`. **`is_enable: false` og `price: 0`** — produktet er ikke købbart på
   mi.com på indsamlingsdagen.

Sekundære kilder angiver `8.9 kg`, `højde 36.7 cm`, `12 DoF`, `1.6 m/s`, `nyttelast 1 kg`,
`~1,5 t driftstid`, `19 sensorer`, `NVIDIA Jetson Xavier NX`, `12 999 CNY`
(**SEKUNDÆR**, ikke talt, ikke verificeret mod producenten).

> **Tre konsekvenser, som rækker langt ud over Xiaomi.**
>
> **(a) "Ikke oplyst" og "ikke tilgængelig for os" er ikke det samme.** CLAUDE.md kræver, at
> *ikke oplyst*, *nej* og *0* ser forskellige ud. CyberDog 2 tilføjer en fjerde tilstand:
> **producenten oplyser det, men i et format vi ikke kan citere.** Skrives den som "ikke
> oplyst", lyver posten om Xiaomi.
>
> **(b) Specifikationer i billeder kan ikke vedligeholdes af os.** Vedligeholdsmodellen i
> PLAN.md afsnit 11 hviler på, at et tal kan hentes igen om tolv måneder. Det kan Xiaomis ikke.
>
> **(c) `is_enable:false` er et statussignal, vi kan læse mekanisk** — og det er stærkere end
> noget en produktside skriver i prosa. Overvej om `status` skal kunne kildes til den slags.

---

### 2.6 LimX Dynamics — Shenzhen

#### LimX Dynamics W1 — **ikke i producentens katalog 19. aug 2026**

Jeg gennemgik `https://www.limxdynamics.com/en` og `https://www.limxdynamics.com/`
(kinesisk). Produktlisten er: **Luna**, **Oli** (humanoider), **TRON 1**, **TRON 2**
(tobenede/multiform), plus software (COSA, VGM, DreamActor, FluxVLA).

**Der er ingen firbenet robot i kataloget.** W1 findes ikke som produktside på nogen af de to
sprogversioner. Den er kun dokumenteret gennem virksomhedens egne pressemeddelelser og
Medium-opslag fra 2024 (**SEKUNDÆR**), der ikke indeholder et specifikationsark — det eneste
tal, der går igen, er `5.98 m/s` og en tobenet ståhøjde på `152 cm`.

**Udfyldt: 0.** 0/31 = **0 %** · 0/29 = **0 %**.

> **Opgaven bad om LimX Dynamics som firbensproducent. Det er de ikke længere.** W1 var en
> demonstrator; virksomheden er gået til humanoider og tobenede. **Det er selv et fund, og det
> hører i producentprofilen** (`/producenter/limx-dynamics/`): en producent kan forlade feltet,
> og et katalog uden den oplysning sender købere efter en robot, ingen sælger.
>
> Det rejser et skemaspørgsmål: `status` har i dag *i produktion / annonceret / udgået*. W1 er
> ingen af delene — den er **aldrig markedsført som produkt**. Overvej en femte tilstand:
> *demonstrator / ikke kommercialiseret*.

---

### 2.7 Producenter identificeret, men ikke indsamlet

Fundet undervejs. Ingen af dem har jeg åbnet et specifikationsark på; **de står her som
arbejdsliste, ikke som data.**

| Producent | Kinesisk navn | Modeller nævnt | Hvorfor ikke indsamlet |
|---|---|---|---|
| Dreame | 追觅科技 | Eame One (1./2. gen.) | Fundet sent; ingen produktside åbnet |
| Yobotics | 山东友宝特智能机器人 | to-, fire- og sekssbenede | Modelnavne ikke fastslået |
| XPeng / Pengxing | 鹏行智能 | robothest ("小白龙") | Konceptdemo; formentlig intet datablad |
| Hiwonder | 幻尔科技 | PuppyPi, PuppyPi Pro, MechDog | Undervisningskit — scope, se 5.4 |
| Yahboom | 亚博智能 | DOGZILLA S1/S2 | Undervisningskit — scope |
| Petoi | (Shenzhen) | Bittle X, Nybble | Undervisningskit — scope |
| Elephant Robotics | 大象机器人 | MechDog, metaDog | Undervisningskit — scope |

Kinesiske kilder nævner desuden flere navne i oversigter over "top 10 firbensmærker".
**Jeg har bevidst ikke skrevet dem ned**: navnene kom gennem maskinoversatte
søgeresultatsammendrag, hvor mindst én oversættelse var påviseligt forkert (`云深处` blev
gengivet som "Cloudminds", hvilket er et **andet** firma, 达闼). **En producentliste bygget på
maskinoversatte sammendrag ville plante fejlnavne i kataloget, som er meget svære at fjerne
igen.** De skal findes fra kinesiske primærkilder.
