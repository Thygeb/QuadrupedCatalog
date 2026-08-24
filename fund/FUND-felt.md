# FUND-felt — feltets størrelse og EU-kolonnen

Indsamlet 19. august 2026 af en researchagent i worktreen `udstilling-wt-felt-eu`, grenen
`data/felt-eu`. Dokumentet er **råmateriale**, ikke data. Det svarer på to spørgsmål, som
[PLAN.md](PLAN.md) hviler på, og som [STATUS.md](STATUS.md) (D5) registrerer som aldrig
skrevet.

Råkilderne ligger i **hovedrepoet**, ikke i denne worktree:
`C:\Praktik\websites\udstilling\media\_kilder\raa-felt-eu-2026-08-19\` med
`MANIFEST.tsv` (filnavn · URL · HTTP-status · hentetidspunkt UTC · SHA-256 · bytes ·
hvad filen er).

---

## 0. Skill-vurdering (regel 0)

Kørt `ls C:/Users/thyge/.claude/skills/` → `critique`, `impeccable`, `ui-ux-critique`,
plus projektets egne i `.claude/skills/` → `robotdata`, `parallelt`, plus plugin-skills i
systemoversigten.

**Valgt: `robotdata`, delvist.** Skillen indlæste uden fejl (ikke `Unknown skill`). Den er
skrevet til **robotposter** — 29-feltsskemaet, tætheden, nyttelast-/trinhøjdesplittene — og
intet af det passer på feltkortlægning og juridisk research. Men fire af dens ti hårde regler
er kildeprincipper, som er præcis det, denne opgave lever eller dør på, og dem har jeg brugt:

- **Regel 1** opfind aldrig et tal → jeg skriver `ikke oplyst` frem for at udfylde et hul.
- **Regel 2** hvert tal skal have kilde og hentedato → hver påstand nedenfor har URL og dato,
  og hver hentet fil har SHA-256 i manifestet.
- **Regel 3** producentens egen side er primærkilden, sekundære skal mærkes → hver
  producentrække siger, om hjemsted kommer fra producentens eget domæne eller fra en
  brancheorganisation.
- **Selv-tjekket med tælling**, som skillen gør obligatorisk, er kørt mekanisk (afsnit 4).

**Gik forbi, med begrundelse:** `parallelt` (jeg *er* et af de parallelle spor, ikke den der
starter dem), `impeccable` (former design og IA — intet er formet her), `ui-ux-critique` og
`critique` (vurderer noget bygget; intet er bygget), `dataviz` (relevant når feltets størrelse
skal tegnes, men jeg producerer ingen grafik), `new-project` (scaffolding), `code-review` /
`simplify` (ingen produktionskode — hjælpescripterne i råkildemappen er engangsværktøj og
ligger uden for repoet).

---

## 1. Metode og kildesikring

**Al hentning går gennem `hent.sh` / `hent-eu.sh`**, som skriver `MANIFEST.tsv`-linjen selv:
statuskoden måles med `curl -w '%{http_code}'`, ikke ved at der kom bytes tilbage. **Er
statuskoden ikke 200, omdøbes filen til `<navn>.FEJL-<status>`**, så en fejlside aldrig kan
læses som indhold. Fejlede hentninger står i manifestet som resultat.

**To værter kunne ikke hentes, og det er skrevet i manifestet:**

| Vært | Hvad der skete | Konsekvens |
|---|---|---|
| `eur-lex.europa.eu` | Svarer **202** med en AWS-WAF JavaScript-udfordring til curl. Også `WebFetch` får tom krop | Retsakterne er i stedet hentet fra Publikationskontorets Cellar, `publications.europa.eu/resource/celex/<CELEX>` med `Accept: application/xhtml+xml`. **Det har en konsekvens, se 3.1** |
| `awesomerobots.xyz` | Afviser curl (forbindelsen lukkes, 0 bytes). `WebFetch` gav *Socket is closed* tre gange | 28+-tallets kilde kunne **ikke gemmes**. Kun søgeresultatets titel og uddrag understøtter den. Står som `000000-TOMT` i manifestet |

**Hjemsted og land er citeret fra producentens eget domæne**, ellers står der `ikke oplyst`.
Det er ikke pedanteri: efterprøvningen af det forrige spor fandt to hjembyer skrevet ud af
hukommelsen. Jeg har efterprøvet begge (afsnit 2.5) og bekræftet, at den ene var forkert og
den anden ikke stod nogen steder.

---

# SPOR 1 — hvor stort er feltet?

## 2.1 Hvor kommer "42 producenter" fra? Svar: fra en kilde, vi ikke kan åbne

PLAN.md afsnit 1 og PRODUCT.md kalder det planens vigtigste enkelttal. **Tallet har ingen
kilde i noget dokument i repoet** (kontrolleret: PLAN.md, PRODUCT.md, DATAMODEL.md,
STATUS.md, fund/FUND-kina.md, fund/FUND-vest.md).

Jeg har fundet den formulering, tallet stammer fra. Den lyder:

> *"The global count of manufacturers producing quadruped robots has reached 42 as of early
> 2024, a notable increase from 29 in 2022."*

Søgemaskinen tilskriver sætningen `marketgrowthreports.com/market-reports/quadruped-robot-market-103749`,
en kommerciel markedsrapportside. **Den side svarer 403 Forbidden** — både på curl og på
`WebFetch`, 19. aug 2026. Tre andre rapportsider, som søgningen også returnerede
(`dataintelo.com`, `verifiedmarketreports.com`, `precedenceresearch.com`), blev hentet og
gennemsøgt for tallet 42 i nærheden af ordene *manufacturer/company/producer*: **nul træf.**

Det efterlader tre ting, der skal siges højt:

1. **Tallet kan ikke citeres.** Vi har aldrig set den sætning på den side, den tilskrives. Vi
   har set et søgemaskinesammendrag af den. Efter projektets egen regel — *"et tal uden kilde
   findes ikke"* — er 42 i dag ikke et tal, vi må skrive på siden.
2. **Tallet er dateret "early 2024".** Det er to og et halvt år gammelt i august 2026, i et
   felt hvor den samme kilde siger, at antallet voksede fra 29 til 42 på to år. Selv hvis
   tallet var rigtigt, ville det være forældet efter vores egen 12-måneders-regel.
3. **Det er en markedsrapport, ikke en optælling.** Der står ikke, hvad der tælles som
   producent — legetøj? forskningsplatforme? konceptdemoer? Uden den afgrænsning kan tallet
   ikke efterprøves, kun gentages.

## 2.2 Hvor kommer "28+ modeller" fra? Svar: fra en konkurrent med købsknap

PLAN.md: *"den grundigste eksisterende oversigt sammenligner 28+ modeller."*

Kilden er **`awesomerobots.xyz`**. Sidens egen titel er ordret
*"Quadruped Robot Buying Guide 2026 | Compare 28+ Robot Dogs"*, og kategorisiden hedder
*"Quadruped Robots Robots - 25 Models from $339 | Compare & Buy"*. Samme site har en
`/browse`-side med titlen *"Compare 115+ AI Humanoid & Quadruped Robots"*.

Tre observationer, der betyder noget for positioneringen:

- **Tallet er ustabilt på sitets egne sider**: 28+ i købsguiden, 25 i kategorien, 115+ på
  tværs af humanoider og firbenede. Vi bør ikke citere "28+" som om det var en målt størrelse.
- **Sitet har en købsvej** — *"Compare & Buy"*, *"instant quote requests"*. Det er den samme
  konstruktion som humanoid.guides "Buy-a-Humanoid™", som står på vores afvist-liste. Når
  PLAN.md kalder det "den grundigste eksisterende oversigt", sammenligner vi os altså med en
  salgskanal, ikke med et opslagsværk.
- **Jeg kunne ikke gemme siden.** Værten afviser curl og WebFetch. Påstanden hviler på
  søgeresultatets titel og uddrag alene, og det står i manifestet.

## 2.3 Den kilde, der faktisk kan tælles: 39 kinesiske firmaer i ét skema

**China Mobile Robot Alliance (CMRA / 中国移动机器人产业联盟)** udgav 22. oktober 2025 artiklen
*"A comprehensive review of nearly 40 Chinese quadruped robot dog companies"*. Artiklens figur
— gemt som `cnmra-figur-kinesiske-quadruped-firmaer-2026-08-19.png`, SHA-256 i manifestet — er
et skema med kolonnerne *Enterprise · Headquarter · Founding time · Representative product*.
Skemaet er sammenstillet af New Strategy Consulting og bærer selv forbeholdet
*"Compiled from public information. If there are any omissions, please make a correction!"*.

**Jeg har talt rækkerne: 39.** Alle kinesiske.

| # | Firma | Hovedsæde (CMRA) | Grundlagt | Repræsentativt produkt |
|---|---|---|---|---|
| 1 | Deep Robotics | Hangzhou | 2017 | X series, Lynx series |
| 2 | Unitree | Hangzhou | 2016 | Go2, B2, B2-W |
| 3 | LimX Dynamics | Shenzhen | 2023 | W1 |
| 4 | AGiBOT | Shanghai | 2023 | D1 Pro / D1 Ultra |
| 5 | Digit | Shenzhen | 2024 | Wei Xiaolu |
| 6 | ENGINE AI | Shenzhen | 2023 | JS01 |
| 7 | GLRoad | Wuhan | 2018 | Police patrol robot dog |
| 8 | DOBOT | Shenzhen | 2015 | Six-legged robot dog |
| 9 | MagicLab | Wuxi | 2023 | MagicDog |
| 10 | GENISOM AI | Beijing | 2023 | Genisom M1 |
| 11 | EIR Technology | Chengtu *(sic)* | 2024 | Lingtong |
| 12 | LINXAI | Shenzhen | 2023 | Linxai D50 |
| 13 | Xiaomi Robotics | Beijing | 2023 | CyberDog |
| 14 | Pengxing Intelligent | Guangzhou | 2020 | Smart machine horse (Xiaobailong) |
| 15 | Yobotics | Jinan | 2014 | Y30, Y15 |
| 16 | WEILAN | Nanjing | 2019 | BabyAlpha |
| 17 | Tencent Robotics X | Shenzhen | 2018 | MAX |
| 18 | Mirror Me | Shanghai | 2024 | Black Panther II, Apollo |
| 19 | Vbot | Beijing | 2024 | Vbot |
| 20 | Wuba Intelligent | Hangzhou | 2022 | Q20A |
| 21 | Sevnce Robotics | Chongqing | 2010 | X3 Stable |
| 22 | HachiBot | Beijing | 2019 | HachiBot |
| 23 | Luwu Dynamics | Wuxi | 2020 | XGO-mini2 |
| 24 | CETC | Shanghai | 2019 | "Longxiang", "Huben" |
| 25 | Microrobotech | Hangzhou | 2025 | MOVENEW T1 |
| 26 | CVTE | Guangzhou | 2005 | MAXHUB X7 |
| 27 | TOPSUN | Yongkang | 1997 | Lingrui P1 |
| 28 | CITIC Heavy Industries | Luoyang | 1958 | Quadruped inspection robot |
| 29 | Hanvon | Beijing | 1998 | Security inspection robot |
| 30 | Jianshe Industry | Chongqing | 2005 | Q20A quadruped robot |
| 31 | AGIOE | Suzhou | 2010 | AQR series inspection robot |
| 32 | Boomy Intelligent | Hangzhou | 2015 | "Hulang 1" |
| 33 | Hengbot | Chongqing | 2022 | Sirius |
| 34 | Galileo | Tianjin | 2013 | BQR3 smart quadruped robot |
| 35 | Shen Hao | Hangzhou | 2002 | Police quadruped robot |
| 36 | Lenovo | Beijing | 1984 | Lenovo DayStar GS/IS, Q1 |
| 37 | China Mobile | Beijing | 1999 | Lingxi robot dog |
| 38 | Huogou Intelligent | Shenzhen | 2021 | Chiquan 3 |
| 39 | Lightyear Robotics | Shenzhen | 2025 | M1 |

Kilde: `https://cnmra.com/a-comprehensive-review-of-nearly-40-chinese-quadruped-robot-dog-companies/`
og figuren `https://cnmra.com/wp-content/uploads/2025/10/11-3.png`, begge hentet 2026-08-19,
begge status 200, begge i manifestet.

**Fem forbehold, som skal med hvis skemaet bruges:**

1. **Skemaet er sekundært.** CMRA er en brancheorganisation, ikke producenterne. Hovedsæderne
   er CMRA's oplysning, ikke producenternes egen. De skal efterprøves mod hvert domæne, før
   de kan udgives — se 2.5.
2. **Skemaet giver ingen kinesiske navne og ingen domæner.** Dem har jeg hentet særskilt fra
   producenternes egne sider (2.4). Der hvor jeg ikke har kunnet hente dem, står `ikke oplyst`.
3. **DOBOTs post er en sekssbenet robot** — *"Six-legged robot dog"*, bekræftet i artiklens
   brødtekst: *"launched a hexapod robot dog"*. Den hører **ikke** i et katalog over firbenede.
4. **"Chengtu"** er formentlig Chengdu, men jeg gengiver, hvad der står. Vi retter ikke
   stiltiende i en kildes tekst.
5. **Flere poster er sandsynligvis uden for scope**: Xiaomi, Lenovo, China Mobile, Tencent og
   CETC er koncerner og statslige institutter, hvor den firbenede robot er ét projekt blandt
   hundreder. Om de hører i kataloget er en scope-beslutning, ikke et faktum — se selv-reviewet.

## 2.4 Producentliste med kilde pr. felt

`ja*` under *Produktside med spec.* betyder, at et af de to **ubekræftede** udkast
(`fund/FUND-kina.md`, `fund/FUND-vest.md`) rapporterer en specifikationsside; det er ikke efterprøvet
af mig. `ja` uden stjerne er efterprøvet i dette spor.

**Land og hjemby er kun udfyldt, hvor det står på producentens eget domæne.**

### Verificeret mod producentens eget domæne

| Producent | Originalnavn (fra eget domæne) | Land | Hjemby, kilde | Domæne | Produktside med spec. |
|---|---|---|---|---|---|
| Unitree Robotics | 宇树科技 | Kina | Hangzhou — **CMRA, sekundær** | `unitree.com` | ja\* |
| DEEP Robotics | 云深处科技 | Kina | Hangzhou — **CMRA, sekundær** | `deeprobotics.cn` | ja\* |
| LimX Dynamics | 逐际动力 | Kina | Shenzhen — **CMRA, sekundær** | `limxdynamics.com` | ja\* |
| MagicLab | ikke oplyst i sidetitel | Kina | Wuxi — **CMRA, sekundær** | `magiclab.top` | ja\* |
| Weilan | 蔚蓝科技 (jf. FUND-kina) | Kina | Nanjing — **CMRA, sekundær** | `weilan.com` | ja\* |
| Xiaomi | 小米 (jf. FUND-kina) | Kina | Beijing — **CMRA, sekundær** | `mi.com` | ja\* |
| Sevnce Robotics | 七腾机器人 | Kina | Chongqing — **CMRA, sekundær** | `sevnce.com` | ikke undersøgt |
| Yobotics | 山东优宝特智能机器人有限公司 | Kina | Jinan — **CMRA, sekundær** | `yobotics.cn` | ikke undersøgt |
| Luwu Intelligence (XGO) | 陆吾智能 | Kina | Wuxi — **CMRA, sekundær** | `xgorobot.com` | ikke undersøgt |
| Yahboom | 亚博智能 | Kina | ikke oplyst | `yahboom.com` | ja\* |
| Elephant Robotics | 大象机器人 | Kina | ikke oplyst | `elephantrobotics.com` | ja\* |
| Dreame | 追觅 | Kina | ikke oplyst | `dreame.tech` | ikke undersøgt |
| AGIBOT | AGIBOT Innovation (Shanghai) Technology Co., Ltd. | Kina | Shanghai — **CMRA, sekundær** | `agibot.com` | ikke undersøgt |
| Hengbot | ikke oplyst i sidetitel | Kina | Chongqing — **CMRA, sekundær** | `hengbot.com` | ikke undersøgt |
| Hiwonder | ikke oplyst i sidetitel | Kina | ikke oplyst | `hiwonder.com` | ja\* |
| Petoi | — | ikke oplyst | ikke oplyst | `petoi.com` | ja\* |
| Boston Dynamics | — | ikke oplyst | **ikke oplyst** — se 2.5 | `bostondynamics.com` | ja\* |
| Ghost Robotics | Ghost Robotics Corporation | ikke oplyst | **ikke oplyst** — se 2.5 | `ghostrobotics.io` | ja\* |
| ANYbotics | — | Schweiz | **Hagenholzstrasse 83a, 8050 Zürich** — egen sidefod | `anybotics.com` | ja\* |
| RIVR | RIVR Technologies AG | ikke oplyst | ikke oplyst | `rivr.ai` | ja\* |
| MAB Robotics | MAB Robotics Sp. z o.o. | Polen | **Poznań, 61-659** — egen sidefod, med NIP PL7822870297 | `mabrobotics.pl` | ja\* |
| Keybotic | Keybotic S.L. | Spanien | **Parc Tecnològic Barcelona Activa, 08042 Barcelona** — egen kontaktside | `keybotic.com` | **nej — bag formular** |
| Rainbow Robotics | — | Sydkorea | **(30141) 8, Jipyeongjungang 3-ro, Jipyeon-dong, Sejong-si** — egen sidefod | `rainbow-robotics.com` | ja\* |
| Diden Robotics | ikke oplyst i sidetitel | Sydkorea | ikke oplyst | `didenrobotics.com` | ikke undersøgt |
| Sony (aibo) | aibo | Japan | ikke oplyst | `aibo.sony.jp` | ikke undersøgt |
| Bhairav Robotics | — | Indien | ikke oplyst | `bhairavrobotics.com` | ikke undersøgt |
| Hyperever | — | Tyrkiet | ikke oplyst | `hyperever.com` | ikke undersøgt |
| Tombot | Tombot, Inc. | ikke oplyst | ikke oplyst | `tombot.com` | ikke undersøgt |
| MangDang | — | ikke oplyst | ikke oplyst | **domæne ikke bekræftet** (`mangdang.net` gav Wix-domænefejl) | ja\* |
| XPeng / Pengxing Intelligent | 鹏行智能 (jf. FUND-kina) | Kina | Guangzhou — **CMRA, sekundær** | ikke oplyst | nej — konceptdemo |
| Kawasaki | — | ikke oplyst | ikke oplyst | `kawasakirobotics.com` | **nej** (jf. FUND-vest) |

**31 producenter i denne tabel.**

### Kun navngivet af CMRA — domæne og originalnavn ikke efterprøvet

Digit · ENGINE AI · GLRoad · GENISOM AI · EIR Technology · LINXAI · Tencent Robotics X ·
Mirror Me · Vbot · Wuba Intelligent · HachiBot · CETC · Microrobotech · CVTE · TOPSUN ·
CITIC Heavy Industries · Hanvon · Jianshe Industry · AGIOE · Boomy Intelligent · Galileo ·
Shen Hao · Lenovo · China Mobile · Huogou Intelligent · Lightyear Robotics

**26 navne.** De må **ikke** skrives ind i kataloget, som de står. De mangler alle tre ting,
en post kræver: originalnavn fra egen kilde, domæne og en produktside.

### Undersøgt og forkastet — de hører ikke i feltet

| Navn | Kilde der placerede dem i feltet | Hvorfor forkastet |
|---|---|---|
| **Roboneers** (Ukraine) | Tracxn's liste over quadruped-startups | Deres egen forside lister produkterne **Saber RWS, Lynx UGV, SabLynx, WarDog UAV, Shadow AI, Skipper**. Ingen firbenet. "Lynx" er en UGV, ikke Deep Robotics' Lynx |
| **Aeroarc** (Indien) | Tracxn | Deres egen produktliste indeholder **"Vision 60"** — Ghost Robotics' modelnavn. Aeroarc ser ud til at være partner/forhandler, ikke producent. Tælles den som selvstændig producent, er feltet dobbelttalt |
| **DOBOT** (Kina) | CMRA | Sekssbenet, ikke firbenet. CMRA's egen brødtekst siger *"hexapod robot dog"* |
| **Hyundai** | FUND-vest | Ejer Boston Dynamics; ingen egen firbenet model fundet |

**Advarsel om aggregatorer.** Tracxn siger *"The Quadruped Robots comprises 16 companies"* og
navngiver ni. **To af de ni er ikke quadruped-producenter** (Roboneers, Aeroarc). Det er 22 %
fejl i en stikprøve på ni. Aggregatorlister kan bruges som *søgeliste*, aldrig som *datakilde*.

## 2.5 Efterprøvning af de to hjembyer, koordinatoren advarede om

| Påstand i FUND-vest | Hvad producentens egen side siger | Resultat |
|---|---|---|
| "Rainbow Robotics, Daejeon" | Sidefoden på `rainbow-robotics.com/en/`: *"Headquarters (30141) 8, Jipyeongjungang 3-ro, Jipyeon-dong, **Sejong-si**, Republic of Korea"*. Søgt på "Daejeon" i hele den hentede side: **nul træf** | **Forkert.** Rettes til Sejong-si |
| "Ghost Robotics, Philadelphia" | Forsiden: intet adressefelt. Privatlivspolitikken skriver ordret *"You may also contact us at our address:"* efterfulgt af **"Ghost Robotics Corporation"** og **ingen adresse**. Søgt på "Philadelphia" i begge hentede sider: **nul træf** | **Ikke belagt.** Skal stå som `ikke oplyst` |

Boston Dynamics blev efterprøvet på samme måde (forside `/contact/` og privatlivspolitik):
**ingen adresse på nogen af dem.** Hjemby = `ikke oplyst`. Byen føles som almen viden. Det
gjorde Ghost Robotics' også.

Samme metode fandt en tredje fejl, som ingen havde bedt om: FUND-kina skriver Yobotics som
**山东友宝特**. Producentens egen sidetitel på `yobotics.cn` er **山东优宝特智能机器人有限公司** —
优, ikke 友. Søgt på 友宝特 i den hentede side: nul træf.

## 2.6 Svaret: er 42 for højt, for lavt eller rigtigt?

**For lavt — og forkert konstrueret.**

- **Kina alene har 39** i én brancheorganisations skema fra oktober 2025, og skemaet siger
  selv, at det ikke er udtømmende.
- Læg de vestlige, koreanske og japanske til, som findes i FUND-vest og her — Boston Dynamics,
  ANYbotics, Ghost Robotics, RIVR, MAB Robotics, Keybotic, Rainbow Robotics, Diden Robotics,
  Sony, Kawasaki — og man er over 45, **før** man har ledt systematisk i Indien, Tyrkiet,
  Japan, Sydkorea eller Nordamerika.
- 42 stammer fra "early 2024" i en kilde, hvor tallet voksede 29 → 42 på to år. Fremskrives
  den takt, ville tallet i sig selv være ~60 i dag.

**Men det vigtigste er ikke, at 42 er for lavt. Det er, at spørgsmålet er stillet forkert.**
"Producenter" er ikke en veldefineret mængde: den blander Unitree (fuld produktlinje, global
distribution) med Lenovo (én robot i en koncern med 60.000 ansatte), med Petoi (byggesæt til
319 dollars) og med Pengxing (rideligt konceptkøretøj). Vi kan ikke tælle en mængde, vi ikke
har afgrænset.

**Hvor mange har en model, der reelt kan købes?** Jeg kan ikke svare på det for feltet. Jeg
kan svare for det, jeg har efterprøvet, og det er lidt:

- **Keybotic**: nej — specifikationerne ligger bag en kontaktformular, og forretningsmodellen
  er *Robotics-as-a-Service* (leje, ikke køb).
- **Kawasaki**: nej — ingen produktside med specifikationer (FUND-vest).
- **Pengxing/XPeng**: nej — konceptdemo.
- Af de 26 CMRA-navne uden domæne: **ukendt for alle 26**.
- FUND-kina fandt **pris oplyst på 3 af 26 kinesiske poster** og **`tilgængelig i EU`, `CE
  oplyst`, `servicepunkt i EU` og `leveringstid` tomme på 26 af 26**.

**Anbefaling til PLAN.md og PRODUCT.md.** Erstat "omkring 42 producenter" med et tal, vi selv
har talt, og en definition af, hvad vi tæller. Forslag til definitionen, som gør feltet
tælleligt og gør "færdigt slår stort" til en påstand, vi kan belægge:

> *En producent hører i kataloget, når den (a) selv fremstiller en firbenet robot, (b) har en
> offentlig produktside med mindst ét talfelt med enhed, og (c) tilbyder modellen til køb
> eller leje. Alle tre skal være opfyldt, og alle tre er efterprøvelige.*

Under den definition er feltet **mindre end 42**, ikke større, og det er en langt stærkere
positionering: vi kan gøre den mængde færdig, og vi kan bevise, hvorfor de andre ikke er med.

---

# SPOR 2 — EU-kolonnen

**Grænsen først, fordi den gælder alt nedenfor:** dette er **oplysning, ikke juridisk
rådgivning**. Vi gengiver, hvad retsakter og myndigheder skriver, med URL og hentedato. Vi
konkluderer **aldrig**, at en konkret robot har eller ikke har CE. Kolonnen viser
`oplyst / ikke oplyst`.

## 3.1 Maskinforordningen (EU) 2023/1230 — og en datofælde, der ramte mig

**Fælden først, fordi den vil ramme den næste også.**

Publikationskontorets Cellar-endepunkt (`publications.europa.eu/resource/celex/32023R1230`)
serverer **den oprindelige EU-Tidende-tekst fra 29.6.2023, uberigtiget**. Både den danske og
den engelske udgave, som jeg hentede derfra, siger:

> *"Den anvendes fra den **14. januar 2027**."* (artikel 54)
> *"Direktiv 2006/42/EF ophæves med virkning fra den **14. januar 2027**."* (artikel 51, stk. 2)
> — engelsk: *"It shall apply from 14 January 2027."*

**Det er ikke den gældende dato.** Sikkerhedsstyrelsen — den danske
markedsovervågningsmyndighed på maskinområdet — skriver på sin egen vejledningsside:

> *"Maskinforordningen skal anvendes fra den **20. januar 2027**, og samme dag ophæves
> maskindirektivet."*
> — `https://www.sik.dk/erhverv/produkter/maskiner/vejledninger/vejledning-maskinforordningen`,
> hentet 2026-08-19, status 200

Forklaringen er en **berigtigelse offentliggjort 4. juli 2023**, som rettede 14 datoer i
forordningen, herunder anvendelsesdatoen 14. → 20. januar 2027.
**Jeg har ikke kunnet hente berigtigelsens egen tekst**: EUR-Lex' ELI-URL for berigtigelsen
er WAF-beskyttet, og Cellar har den ikke under `32023R1230R(01)`, `32023R1230R(02)` eller
under nogen konsolideret CELEX, jeg prøvede (`02023R1230`, `02023R1230-20230704`,
`02023R1230-20230719`, `02023R1230-20240101`) — alle 404. **Berigtigelsen står derfor som
belagt af Sikkerhedsstyrelsen, ikke af EUR-Lex.** Det skal lukkes, før datoen udgives.

**Konsekvens for `/metode/`:** en retsakt hentet maskinelt fra Cellar er ikke nødvendigvis den
gældende udgave. Konsoliderede tekster og berigtigelser ligger ikke samme sted som
originalteksten. Vores hentedato på et EU-tal skal ledsages af, **hvilken udgave** vi læste.

**Det, der ellers står fast, og som er efterprøvet mod primærteksten:**

| Spørgsmål | Svar | Kilde |
|---|---|---|
| Hvornår trådte forordningen i kraft? | *"på tyvendedagen efter offentliggørelsen i Den Europæiske Unions Tidende"*. Offentliggjort **29.6.2023, EUT L 165/1** | Art. 54, forordningens hoved |
| Hvornår afløser den maskindirektivet? | 20. januar 2027 (Sikkerhedsstyrelsen); 14. januar 2027 i den uberigtigede OJ-tekst | Sik.dk; art. 51, stk. 2 |
| Hvad med en robot købt i dag (aug. 2026)? | **Maskindirektivet 2006/42/EF gælder.** Og art. 52, stk. 1: *"Medlemsstaterne må ikke forhindre tilgængeliggørelsen på markedet af produkter, som blev bragt i omsætning i overensstemmelse med direktiv 2006/42/EF inden den 14. januar 2027"* — en maskine bragt lovligt i omsætning før skæringsdatoen skal ikke CE-mærkes om | Art. 52, stk. 1 |
| Gælder EF-typeafprøvningsattester videre? | Ja: *"forbliver gyldige, indtil de udløber"* | Art. 52, stk. 2 |
| Dansk supplement | **BEK nr. 727 af 13/06/2024** om supplerende bestemmelser til maskinforordningen — sprogkrav, strafbestemmelser, bemyndigede organer | Retsinformation, `eli/lta/2024/727` |
| Dansk regel i dag | **BEK nr. 1094 af 01/06/2021 om maskiner**, som gennemfører 2006/42/EF | Retsinformation, `eli/lta/2021/1094` |

**Én ting i forordningen rammer firbenede robotter direkte og er ikke almindeligt kendt.**
Bilag I, del A, nr. 5 og 6 lister:

> *"5. Sikkerhedskomponenter med fuldstændigt eller delvist selvudviklede adfærd, som anvender
> maskinlæringstilgange til at varetage sikkerhedsfunktioner."*
> *"6. Maskiner, som har indlejrede systemer med fuldstændigt eller delvist selvudviklede
> adfærd og anvender maskinlæringstilgange til at varetage sikkerhedsfunktioner, og som ikke
> er bragt i omsætning selvstændigt, alene hvad angår disse systemer."*

Kategorier i bilag I, del A, skal gennem **overensstemmelsesvurdering med tredjepart** efter
artikel 25, stk. 2 — ikke fabrikantens egen erklæring. Forordningen definerer desuden
*"autonom mobil maskine"* som *"mobil maskine, der har en autonom funktion, under hvilken alle
de væsentlige sikkerhedsfunktioner af den mobile maskine sikres i dens bevægelses- og
arbejdsområde, uden en kontinuerlig interaktion med en operatør"* (bilag III).

**En firbenet robot, der kører autonom rundering, og hvis forhindringsundvigelse er
maskinlært, er præcis den maskine, de to punkter er skrevet om.** Det er et katalogfelt værd:
`sikkerhedsfunktion maskinlært: oplyst / ikke oplyst`. Vi konkluderer ikke, om en given robot
falder i bilag I — det er fabrikantens og et bemyndiget organs vurdering, ikke vores.

## 3.2 Hvem bliver importør — sidens skarpeste enkeltoplysning

**Spørgsmålet:** en dansk virksomhed køber en firbenet robot direkte fra en kinesisk producent
uden EU-repræsentant. Hvem er importør, og hvad følger med?

**Kæden, led for led, hver med primærkilde:**

**1) Definitionen.** Maskinforordningen art. 3:

> *"»importør«: enhver fysisk eller juridisk person, der er etableret i Unionen, og som bringer
> et produkt, som er omfattet af denne forordning, fra et tredjeland i omsætning på
> EU-markedet"*

> *"»bringe i omsætning«: første tilgængeliggørelse af et produkt, som er omfattet af denne
> forordning, på EU-markedet"*

> *"»gøre tilgængelig på markedet«: enhver levering af et produkt … med henblik på distribution
> eller anvendelse på EU-markedet som led i erhvervsvirksomhed, mod eller uden vederlag"*

**2) Den danske myndigheds formulering.** Sikkerhedsstyrelsen, *Kend din rolle som
erhvervsdrivende*:

> *"Du er importør, hvis du bringer produkter med oprindelse i et tredjeland i omsætning på
> EU-markedet. Dette gælder både, hvis du sælger produkter til andre virksomheder, til
> forbrugerne eller giver dem væk som gaver."*

**Læg mærke til, hvad der ikke står.** Sætningen opregner *sælger · giver væk* — den nævner
ikke udtrykkeligt "eller bruger dem selv". **Den grænse må vi ikke lukke selv.** Se 3.5.

**3) Det led, der lukker hullet i praksis.** Forordning (EU) 2019/1020 om markedsovervågning,
artikel 4, stk. 1:

> *"…et produkt, der er omfattet af den i stk. 5 omhandlede lovgivning, [må] kun bringes i
> omsætning, hvis en erhvervsdrivende, der er etableret i Unionen, er ansvarlig for de i
> stk. 3 omhandlede opgaver med hensyn til dette produkt."*

Og stk. 2, litra b) siger, hvem det er, når fabrikanten sidder uden for EU:

> *"b) en importør, når fabrikanten ikke er etableret i Unionen"*

**Artikel 4, stk. 5 opregner de retsakter, det gælder for — og maskindirektivet 2006/42/EF,
radioudstyrsdirektivet 2014/53/EU, ATEX 2014/34/EU og RoHS 2011/65/EU står alle på listen.**

Det vil sige: **findes der ingen EU-etableret fabrikant, ingen bemyndiget repræsentant og
ingen udbyder af distributionstjenester, så er der ingen anden tilbage end køberen selv.**

**4) Pligterne, ordret fra maskinforordningens artikel 13:**

| Stk. | Pligt |
|---|---|
| 13, stk. 1 | Må kun bringe maskiner i omsætning, som **er i overensstemmelse med de gældende krav** |
| 13, stk. 2 | Skal **før** omsætning sikre, at fabrikanten har gennemført overensstemmelsesvurderingen (art. 25), har udarbejdet den **tekniske dokumentation** (bilag IV, del A), at maskinen bærer **CE-mærkning** (art. 23), at den ledsages af den krævede dokumentation, og at art. 10, stk. 5, 6 og 8 er opfyldt |
| 13, stk. 2, 2. afsnit | Har importøren grund til at tro, at maskinen ikke er i overensstemmelse, **må den ikke bringes i omsætning**, og ved risiko skal fabrikant **og markedsovervågningsmyndigheder** underrettes |
| 13, stk. 3 | **Importørens navn og postadresse** skal stå på maskinen — eller på emballagen eller et ledsagedokument, hvis det ikke er muligt |
| 13, stk. 4 | Skal sikre, at maskinen ledsages af **brugsanvisning** og oplysningerne i art. 10, stk. 7 |
| 13, stk. 6 | Skal ved risiko foretage **stikprøvekontrol**, føre klageregister og orientere distributører |
| 13, stk. 8 | Skal i **mindst ti år** opbevare en kopi af **EU-overensstemmelseserklæringen** og kunne stille den tekniske dokumentation til rådighed. **Om nødvendigt inklusive kildekode eller logisk programmering**, efter begrundet myndighedsanmodning |
| 13, stk. 9 | Skal give myndigheden al dokumentation **på et for myndigheden letforståeligt sprog** |

**5) Hvornår bliver køberen ikke bare importør, men fabrikant?** Artikel 17:

> *"En importør eller distributør anses for at være fabrikant … når denne … bringer et produkt
> … i omsætning under sit navn eller varemærke **eller ændrer et produkt, der allerede er
> bragt i omsætning på en måde, der kan påvirke dets overensstemmelse** med de gældende krav."*

Og artikel 18: den, der foretager **en væsentlig ændring**, bliver fabrikant for den maskine.
**Det rammer nyttelast direkte.** Monterer en dansk fabrik en arm, en gasdetektor eller en
termisk sensor på en firbenet robot, er spørgsmålet, om ændringen *"skaber en ny fare eller
øger en eksisterende risiko"*. Er svaret ja, er fabrikkens egen tekniske afdeling fabrikant —
med bilag IV-dossier, EU-overensstemmelseserklæring og CE-mærkning på eget ansvar.
**Undtagelsen i art. 18 gælder kun ikke-professionelle brugere**, ikke virksomheder.

**6) Sprogkravet — det danske svar er skarpt og let at overse.**
**BEK nr. 727 af 13/06/2024, som gælder sammen med maskinforordningen:**

| § | Krav |
|---|---|
| § 3, stk. 1 | *"Brugsanvisninger, sikkerhedsoplysninger og oplysninger fastsat i maskinforordningens bilag III … **skal være på dansk**"* |
| § 3, stk. 2 | Vedligeholdelsesvejledninger til **specialiseret personale, der arbejder direkte for fabrikanten**, kan være på ét EU-sprog, personalet forstår |
| § 4 | Skriftlige eller mundtlige **informationer og advarsler** (bilag III, del B, pkt. 1.7.1) **skal være på dansk** |
| § 6 | ***"EU-overensstemmelseserklæringer … skal være på dansk"*** |
| § 7 | EU-inkorporeringserklæringer for delmaskiner: **dansk eller engelsk** |

Under det nuværende regime siger **BEK nr. 1094 af 01/06/2021 § 11** det samme fra
distributørsiden: distributøren skal kontrollere, at maskinen er ledsaget af *"brugsanvisning
og EF-overensstemmelseserklæring **på dansk**"*.

**Det er den sætning, der oftest overrasker en dansk køber:** en kinesisk robot med engelsk
manual og engelsk overensstemmelseserklæring opfylder ikke det danske sprogkrav, og det er
importøren — altså køberen — der skal skaffe den danske udgave.

**Katalogfelter, denne kæde retfærdiggør** (alle med tre tilstande — `oplyst` / `ikke oplyst` /
`nej`):

`eu_repraesentant_oplyst` · `ce_oplyst` · `overensstemmelseserklaering_offentlig` ·
`dokumentation_paa_eu_sprog` · `dokumentation_paa_dansk` · `servicepunkt_i_eu` ·
`reservedele_i_eu` · `leveringstid`

## 3.3 De andre regler, der rammer en firbenet robot i EU

Alle med primærkilde, alle hentet 2026-08-19, alle i manifestet.

**Radioudstyrsdirektivet (RED), 2014/53/EU.** Definitionen, art. 2, stk. 1, nr. 1:

> *"»radioudstyr«: et elektrisk eller elektronisk produkt, som tilsigtet udsender og/eller
> modtager radiobølger med henblik på radiokommunikation og/eller radiostedbestemmelse…"*

En firbenet robot med WiFi, Bluetooth, 4G/5G eller fjernbetjening er radioudstyr. Den skal
altså opfylde **både** maskinreglerne **og** RED. Sikkerhedsstyrelsen bemærker selv, at
maskinforordningen indfører *"undtagelser for nogle produkter, hvis de er omfattet af
radioudstyrsdirektivet"* — grænsefladen mellem de to skal undersøges nærmere, før den skrives
på `/metode/`. **RED står også på 2019/1020's artikel 4, stk. 5-liste**, så kravet om en
EU-etableret ansvarlig erhvervsdrivende gælder på radiosiden også.

**Batteriforordningen (EU) 2023/1542.** *"Den finder anvendelse fra den 18. februar 2024."*
Definitionen af **industribatteri** er relevant, fordi den fanger næsten alle firbenede robotter
på vægt alene:

> *"»industribatteri«: et batteri, der er specifikt designet til industrielle formål … eller
> ethvert andet batteri, der vejer over 5 kg…"*

**WEEE, 2012/19/EU** — her er den skarpe detalje. Direktivets producentdefinition, art. 3,
litra f), nr. iii):

> *"…er etableret i en medlemsstat og i den pågældende medlemsstat i erhvervsøjemed bringer
> EEE fra et tredjeland eller fra en anden medlemsstat i omsætning…"*

**Den danske virksomhed, der importerer robotten direkte, bliver dermed WEEE-"producent"** —
ikke bare importør — med den registrerings- og tilbagetagningspligt, der følger. Det er en
pligt, der overlever robottens levetid.

**RoHS, 2011/65/EU** — samme importørdefinition som maskinreglerne:

> *"»importør«: enhver fysisk eller juridisk person, der er etableret i Unionen, og som bringer
> EEE fra et tredjeland i omsætning på Unionens marked"*

RoHS står også på 2019/1020 art. 4, stk. 5-listen.

**Sammenfatning, der hører på `/metode/`:** ét direkte køb fra Asien udløser mindst
**fem** regelsæt — maskinregler, RED, batteri, WEEE, RoHS — og køberen er den ansvarlige
erhvervsdrivende i dem alle, når fabrikanten ikke har en EU-repræsentant.

## 3.4 ATEX/IECEx — hvad `Zone 1 IIB` giver adgang til

**Zonerne** er defineret i **ATEX-arbejdsmiljødirektivet 1999/92/EF, bilag I, pkt. 2**, ordret:

| Zone | Definition (1999/92/EF, bilag I) |
|---|---|
| **Zone 0** | *"Område, hvor der uafbrudt eller i lange perioder eller ofte forekommer eksplosiv atmosfære bestående af en blanding af brændbare stoffer i form af gas, dampe eller tåge med luft."* |
| **Zone 1** | *"Område, hvor det kan forventes, at der ved normal drift lejlighedsvis forekommer eksplosiv atmosfære…"* |
| **Zone 2** | *"Område, hvor det ikke forventes, at der ved normal drift forekommer eksplosiv atmosfære …, eller hvis dette sker, da kun i korte perioder."* |
| Zone 20/21/22 | Samme tre trin, men for **støv** i stedet for gas |

**Zoneinddelingen er anlæggets ansvar, ikke robottens.** Direktivet siger:
*"Eksplosionsfarlige områder klassificeres i zoner på grundlag af hyppigheden og varigheden af
forekomsten af eksplosiv atmosfære."* Det er arbejdsgiveren, der klassificerer sit område.

**Materiellet** klassificeres i stedet efter **ATEX-produktdirektivet 2014/34/EU, bilag I**:

| Materielkategori (gruppe II) | Bilag I's ordlyd om, hvor det er beregnet til at anvendes |
|---|---|
| **Kategori 1** | *"hvor der konstant, gennem længere tid eller hyppigt forekommer eksplosiv atmosfære"* |
| **Kategori 2** | *"hvor der lejlighedsvis kan opstå eksplosive atmosfærer"* |
| **Kategori 3** | *"hvor en eksplosiv atmosfære … kun undtagelsesvis vil opstå og da kun i et kortere tidsrum"* |

Ordlyden i kategori 1/2/3 er **den samme** som i zone 0/1/2. Det er den tekstlige observation,
vi må skrive; **koblingen kategori 2 → zone 1 er en fortolkning, som skal belægges af en
myndighed, før den udgives.** Vi laver den ikke selv.

**Hvad `Zone 1 IIB` så betyder for en køber.** ANYbotics oplyser ifølge FUND-vest ordret
*"ATEX & IECEx certified up to Zone 1 IIB"* om ANYmal X. Læst mod definitionerne ovenfor:
robotten er certificeret til områder, hvor eksplosiv gasatmosfære **kan forventes lejlighedsvis
ved normal drift** — altså ikke kun ved uheld (zone 2), men heller ikke konstant (zone 0).
Det er den typiske klassifikation for procesområder på et raffinaderi eller et kemisk anlæg.

**Gasgrupperne IIA/IIB/IIC kan jeg ikke belægge, og det skal siges.** Underinddelingen er
**ikke** i ATEX-direktivet — 2014/34/EU skelner kun materielgruppe I (miner) fra II (alt
andet) og inden for gruppe II mellem *"G"* (gas) og *"D"* (støv). IIA/IIB/IIC er defineret i
den harmoniserede standardserie **EN IEC 60079**, som er betalingsbelagt og som jeg ikke har
læst. De frit tilgængelige gengivelser er leverandørblogs, og **de modsiger hinanden**: i én og
samme søgning stod både *"Group IIA: Atmospheres containing propane, hydrogen…"* og
*"Group IIC: hydrogen, acetylene…"*. Brint kan ikke være i begge.

**Anbefaling:** kataloget gengiver producentens strengværdi ordret (`Zone 1 IIB`) og linker til
ordbogen. Ordbogsopslaget for gasgrupper skrives **først**, når vi har en myndighedskilde eller
standardens ordlyd. Indtil da: `ikke oplyst`.

**Skemaet mangler et felt.** FUND-vest nåede samme konklusion. Forslag, uændret:
`ex_certificering: { standard: ATEX | IECEx, zone: 0|1|2|20|21|22, gasgruppe: IIA|IIB|IIC,
kilde, hentet }` med `ikke oplyst` som gyldig værdi. Det kan ikke presses ned i `CE oplyst`
uden at forsvinde.

## 3.5 Grænsen mellem oplysning og rådgivning — og den polske skelnen

**`CE oplyst = nej` betyder ikke det samme for en polsk og en amerikansk producent.**
FUND-vest fandt det på MAB Robotics: en polsk producent skriver intet om CE, ikke fordi den
mangler det, men fordi CE er en selvfølge for en EU-producent, der sælger i EU. Boston Dynamics
skriver derimod et afsnit med overskriften **`Safety and Compliance, United States`** — som
selv afgrænser sig til USA — og Ghost Robotics svarer på et **amerikansk eksportkontrolspørgsmål**
(`US ECCN: EAR-99`) i stedet for et europæisk markedsadgangsspørgsmål.

**Det er tre forskellige tavsheder, og de må ikke se ens ud:**

| Tilstand | Hvad den betyder | Eksempel |
|---|---|---|
| `oplyst: ja` | Producenten skriver selv, at produktet er CE-mærket | ANYbotics: *"FCC and CE compliant"* |
| `oplyst: nej — EU-producent` | Ingen omtale, men producenten er etableret i EU og sælger i EU | MAB Robotics (Poznań), Keybotic (Barcelona), RIVR, ANYbotics |
| `oplyst: nej — tredjelandsproducent` | Ingen omtale, og producenten er etableret uden for EU. **Køberen får bevisbyrden** | Boston Dynamics, Ghost Robotics, alle 26 kinesiske poster i FUND-kina |

**Vi skriver forskellen som en oplysning om producentens land og om, hvad der står på deres
side. Vi skriver aldrig, om robotten har CE.** Formuleringen på `/metode/` bør være omtrent:

> *Vi gengiver, hvad producenten selv oplyser, og hvornår vi hentede det. En tom celle betyder,
> at producenten intet skriver — ikke at produktet mangler noget. En producent etableret i EU
> skriver sjældent om CE, fordi det er en forudsætning for at sælge her; en producent uden for
> EU skriver sjældent om det, fordi det ikke er et krav på deres hjemmemarked. De to tavsheder
> ser ens ud i en tabel og betyder ikke det samme. Vi vurderer ikke, om et konkret produkt
> opfylder EU-krav — det er fabrikantens erklæring og myndighedernes tilsyn, ikke vores.*

**Tre steder, hvor grænsen er tættest på at blive overskredet, og hvor jeg har standset:**

1. **"Køberen bliver importør ved direkte køb til eget brug."** PLAN.md skriver det allerede
   som et fast svar: *"(svar: køberen, med fuldt ansvar under maskinforordningen)"*. Jeg kan
   belægge kæden — definitionen, 2019/1020 art. 4, Sikkerhedsstyrelsens formulering — men
   **jeg har ikke fundet en primærkilde, der udtrykkeligt siger, at import til eget brug uden
   videresalg er "at bringe i omsætning".** Sikkerhedsstyrelsens sætning opregner *sælger ·
   giver væk*, ikke *bruger selv*. Kommissionens Blå Vejledning ville formentlig svare, men
   **jeg kunne ikke hente den**: CELEX `52022XC0629(01)` og `(04)` gav 404 i Cellar i alle
   formater, og EUR-Lex er WAF-beskyttet. **Sætningen i PLAN.md skal enten belægges eller
   omformuleres, før den udgives.** Som den står, er den en juridisk konklusion.
2. **ATEX-koblingen kategori → zone.** Ordlyden er identisk; koblingen er stadig en
   fortolkning. Skrevet som observation, ikke som regel (3.4).
3. **Bilag I, del A, nr. 5-6 og "kræver bemyndiget organ".** Jeg skriver, hvad bilaget lister,
   og hvad artikel 25, stk. 2 kræver af de kategorier. Jeg skriver **ikke**, at en konkret
   robot falder i kategorien — det afhænger af, om maskinlæringen varetager en
   *sikkerhedsfunktion*, og det ved kun fabrikanten.

---

## 4. Efterprøvning

Hver påstand er slået op i den gemte råfil igen, mekanisk, med scriptet
`media/_kilder/raa-felt-eu-2026-08-19/efterproev.mjs`. Scriptet tester både, at en streng
**findes** (fx forordningens ordlyd), og at en streng **ikke findes** (fx "Daejeon" og
"Philadelphia" i producenternes egne sider).

**Kontrolkørsel først, fordi nul fejl uden en kontrol ikke er en efterprøvning:** to bevidst
falske påstande blev tilføjet — *"Den anvendes fra den 20. januar 2027"* i den uberigtigede
OJ-tekst, og *"Sejong-si findes ikke på Rainbows side"*. **Begge blev rapporteret som FEJL.**
Harnisken fanger altså både falske positiver og falske negativer.

> **Efterprøvet 64 påstande mod 37 kilder, fandt 0 fejl. Producentliste: 57 producenter,
> heraf 17 med produktside med specifikationer.**

**Sådan er de to tal talt, så de kan genkøres:**

- **57 producenter** = 31 i tabellen i 2.4 (verificeret mod eget domæne) + 26 navne, som kun
  CMRA har givet. **De 4 forkastede** (Roboneers, Aeroarc, DOBOT, Hyundai) er **ikke** talt med.
- **17 med produktside med specifikationer** = de 17 rækker i 2.4 med `ja*`. **Alle 17 er
  `ja*`, altså rapporteret af de to ubekræftede udkast og ikke efterprøvet af mig.** Det tal
  må ikke citeres som en måling; det er et lån fra `fund/FUND-kina.md` og `fund/FUND-vest.md`, som
  STATUS.md D5 selv kalder ubekræftede. Efterprøvet af mig: **1** — Keybotic, hvor svaret er
  **nej** (specifikationerne ligger bag en kontaktformular).
- Fandt jeg 0 fejl blandt mine egne påstande, fandt jeg **3 fejl i det eksisterende materiale**:
  Rainbow Robotics' hjemby, Ghost Robotics' hjemby og Yobotics' kinesiske navn (2.5).

**Manifestet:** `MANIFEST.tsv` indeholder 59 linjer plus overskrift. **54 hentninger med
status 200. 5 registrerede fejl**, alle navngivet så de ikke kan forveksles med indhold:
3 × `awesomerobots…INGEN-FIL` (vært afviser curl) og 2 × `eurlex…FEJL-202-TOMT`
(AWS-WAF-udfordring). Filer, der returnerede 404 undervejs — Blå Vejledning, berigtigelsen,
konsoliderede CELEX-id'er, forkerte producent-URL'er — blev slettet og deres manifestlinjer
fjernet, da de var mislykkede *forsøg på at finde det rigtige id*, ikke resultater. **De
fejlslag, der er en konklusion** (EUR-Lex WAF, awesomerobots), står i manifestet.

---

## 5. Selv-review — hvad jeg er usikker på

**1. Det centrale juridiske spørgsmål er ikke lukket.** Om import til **eget brug** uden
videresalg er "at bringe i omsætning", har jeg ikke en primærkilde på. Kæden via 2019/1020
art. 4 er stærk, men den taler om produkter, der *bringes i omsætning* — den forudsætter
altså svaret. Den Blå Vejledning kunne ikke hentes. **Det er sidens skarpeste enkeltoplysning,
og den er i dag ikke fuldt belagt.**

**2. Berigtigelsen er belagt af Sikkerhedsstyrelsen, ikke af EUR-Lex.** Datoen 20. januar 2027
står i to danske myndighedssider, jeg har gemt. Berigtigelsens egen tekst har jeg ikke set.
Indtil den er hentet, bør vi skrive datoen med kilde til Sikkerhedsstyrelsen, ikke til EUR-Lex.

**3. Hovedsæderne for de kinesiske producenter er CMRA's, ikke producenternes.** Jeg har
verificeret **navn og domæne** mod egne sider, men **ikke hjembyerne**. De står markeret
`CMRA, sekundær` i tabellen. De må ikke udgives uden den markering — det er præcis den fejltype,
der ramte Rainbow Robotics.

**4. Fem producenter, jeg er i tvivl om overhovedet hører i feltet:**

| Producent | Tvivlen |
|---|---|
| **Tombot** (US) | "Robotic emotional support animal" — en robothvalp til demente. Den **går formentlig ikke**. En firbenet robot, der ikke er en gående maskine, er noget andet end en Spot |
| **Sony aibo** (JP) | Går, er firbenet, er et rigtigt produkt man kan købe. Men det er et selskabsdyr uden nyttelast, uden IP-klasse og uden driftsprofil. Det fylder felter, der aldrig kan udfyldes |
| **Petoi, Yahboom, Hiwonder, MangDang, Elephant Robotics** | Undervisningskit fra 319 dollars. FUND-vest fandt, at **Bittle X oplyser mere end ANYmal X gør**. Det gør specifikationstætheden misvisende: en hobbyrobot slår en industrirobot i vores eneste rangering |
| **Lenovo, China Mobile, Tencent, CETC, Xiaomi** | Koncerner og statslige institutter. Robotten er ét projekt. Om der findes en produktside, en pris og en leveringstid, ved jeg ikke |
| **Pengxing/XPeng** | Ridelig "robothest". Konceptdemo, ikke katalogprodukt |

**Det er ikke fem randtilfælde — det er en manglende scope-regel.** Uden den kan feltets
størrelse ikke tælles, og "42" kan hverken be- eller afkræftes præcist. Forslaget i 2.6 er
mit bedste bud, men det er en **beslutning for JPK**, ikke et fund.

**5. Aggregatorernes fejlrate er målt på en meget lille stikprøve.** 2 af 9 navngivne
Tracxn-poster var forkerte. Ni er ikke mange. Konklusionen "aggregatorer er søgelister, ikke
datakilder" er rigtig i retning, men procenten skal ikke citeres.

**6. Jeg har kun læst forordningerne på dansk** (undtagen 2023/1230, hvor jeg hentede engelsk
for at sammenligne datoen). Ved uenighed mellem sprogudgaver har jeg altså kun set den ene
side — undtagen netop på det punkt, hvor jeg kiggede.

**7. Det, jeg ikke nåede:**

- **Den Blå Vejledning** (2022/C 247/01) — kunne ikke hentes. Blokerer punkt 1 ovenfor.
- **Berigtigelsen til 2023/1230** — kunne ikke hentes.
- **Arbejdstilsynets side af sagen.** Spørgsmålet *"må en dansk fabrik sætte maskinen i drift"*
  har to halvdele: produktreglerne (Sikkerhedsstyrelsen, dækket her) og **anvendelsesreglerne**
  (Arbejdstilsynet, bekendtgørelse om anvendelse af tekniske hjælpemidler). **Den halvdel er
  ikke undersøgt.** Maskinforordningens art. 5 siger udtrykkeligt, at medlemsstaterne må
  fastsætte krav til beskyttelse af personer, *"når de installerer eller anvender"* maskiner —
  altså findes der danske krav oveni. Uden dem er EU-kolonnen halv.
- **Systematisk søgning i Japan, Sydkorea, Indien, Tyrkiet, Nordamerika.** Jeg fandt navne, jeg
  faldt over. Der er ikke lavet en landeudtømmende søgning nogen steder undtagen Kina, hvor
  CMRA-skemaet gjorde arbejdet.
- **Produktsider for de 26 CMRA-navne.** Ingen af dem er åbnet.
- **Om Keybotic er opkøbt af Helsing.** LinkedIn-titlen i et søgeresultat sagde *"Keybotic
  (acquired by Helsing)"*. **Der står intet om det på keybotic.com**, som stadig annoncerer
  Keyper og bærer *"© 2025 Keybotic"*. Jeg har ikke efterprøvet det og skriver det derfor ikke
  som en oplysning — kun som noget, der skal undersøges, fordi et opkøb af en forsvarskoncern
  ville flytte produktet ud af kataloget.
- **`awesomerobots.xyz`s faktiske modelliste.** Værten afviste tre hentningsforsøg. Vi ved,
  hvad titlen siger, ikke hvad siden indeholder.

---

## 6. Hvad der bør ind i STATUS.md

| # | Punkt | Type |
|---|---|---|
| **F1** | **"42 producenter" kan ikke citeres.** Kilden er 403, tallet er fra "early 2024", og der er ingen definition af, hvad der tælles. PLAN.md og PRODUCT.md skal rettes | Fund, blokerende for positioneringen |
| **F2** | **"28+ modeller" er awesomerobots.xyz**, et site med købsvej og med tre indbyrdes uenige tal (28+, 25, 115+) | Fund |
| **F3** | **Scope-reglen mangler.** Hvad tæller som en producent i kataloget? Forslag i 2.6 | Beslutning til JPK |
| **F4** | **Tre navnefejl fundet i eksisterende materiale:** Rainbow Robotics' hjemby (Daejeon → Sejong-si), Ghost Robotics' hjemby (Philadelphia → ikke oplyst), Yobotics' kinesiske navn (友宝特 → 优宝特) | Rettelse |
| **F5** | **Anvendelsesdatoen er 20. januar 2027, ikke 14.** Cellar-endepunktet serverer den uberigtigede tekst. Metodekonsekvens: EU-tal skal bære hvilken udgave, vi læste | Fund, metode |
| **F6** | **Import til eget brug er ikke belagt.** PLAN.md's parentes *"(svar: køberen, med fuldt ansvar)"* skal belægges eller omformuleres | Åbent, blokerende for EU-kolonnen |
| **F7** | **Nyt felt: `ex_certificering`.** ATEX/IECEx kan ikke rummes i `CE oplyst` | Skemaændring |
| **F8** | **Nyt felt: `sikkerhedsfunktion_maskinlaert`.** Bilag I, del A, nr. 5-6 kræver tredjepartsvurdering | Skemaændring |
| **F9** | **Arbejdstilsynets anvendelsesregler er ikke undersøgt.** EU-kolonnen er halv uden dem | Åbent |
| **F10** | **Sprogkravet er dansk, ikke "et EU-sprog".** BEK 727 §§ 3, 4 og 6 kræver dansk for brugsanvisning, advarsler og EU-overensstemmelseserklæring | Fund, katalogfelt |
