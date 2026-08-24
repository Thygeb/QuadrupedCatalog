# FUND-genisom — GENISOM AI's oevrige soeskendemodeller (L1-W, L1 Maker, L2-W, L2-W Ultra, Tongchui M1, Qiuqiu SP1, NE01)

Spor: `spor/genisom`, worktree `C:\Praktik\websites\udstilling-wt-genisom`. Opgave fra
orkestratoren 24. aug 2026: `fund/FUND-kand1b.md` noterede, at GENISOM AI (智身科技) har
"omkring fem yderligere modeller" ud over de to allerede byggede (`genisom-gangben-l1.yaml`,
`genisom-gangben-l2.yaml`). Denne runde efterproever og indsamler dem.

---

## Skill-vurdering (regel 0)

| Skill | Valgt? | Begrundelse |
|---|---|---|
| `robotdata` | **Valgt**, laest fra disk | Opgaven er praecis det, skillen baerer: 30-feltsskemaet (L32-udgaven), de ti haarde regler, stopproeven, selv-tjekket. Jeg brugte BAADE `Skill`-vaerktoejet (som lykkedes - registreret ved sessionsstart) OG efterfoelgende laest `.claude/skills/robotdata/SKILL.md` direkte fra worktreen for at bekraefte, at den kaldte version stemte overens med worktreens egen kopi og ikke en aeldre huskeversion. `STATUS.md` (L32, L33, D10, D11) og `DATAMODEL.md` blev laest direkte fra disk for skema- og arveregler. |
| `parallelt` | Gaaet forbi | Jeg er allerede eet udpeget spor (`spor/genisom`) i en fordelt koersel. Fem-seks kandidatmodeller fra SAMME producent, deromkring TO af dem (L2-W/L2-W Ultra) delende data fra SAMME kilde-URL som en tredje (L2, allerede bygget, maa ikke roeres) - at dele opgaven yderligere paa flere agenter ville enten kollidere paa samme filer (data/robots/genisom-*.yaml) eller kraeve en genforening bagefter. Samme begrundelse som `FUND-kand1b.md` brugte for MicroRoboTech/GENISOM. |
| `grillmig` | Gaaet forbi | Intet agentbrief sendes videre herfra, og ingen aaben beslutning i STATUS.md laases af mig. |
| `impeccable`, `ui-ux-critique`, `critique`, `dataviz` | Gaaet forbi | Ingen bygget UI eller grafik at kritisere/visualisere i dette spor. |
| `new-project`, `code-review`, `simplify` | Gaaet forbi | Ingen kode skrives eller aendres - kun YAML-data og raat kildearkiv. |

**Konklusion:** `robotdata` er den rigtige og eneste relevante skill.

---

## Laest foer arbejdet, som instrueret

- `.claude/skills/robotdata/SKILL.md` (via `Skill`-vaerktoejet) - 30-feltsskemaet, L32-aendringen
  (eu_tilgaengelig/eu_service/leveringstid fjernet), de ti haarde regler, billedbaren, selv-tjekket.
- `STATUS.md` - L32 og L33 (naevner 30, sekundaere kilder tilladt med maerkning), D10 (arvet_fra
  kan ikke opdages, hvis den slettes - identisk citat betyder IKKE automatisk arv) og D11 (aabent
  spoergsmaal om feltbeskaering, ikke relevant for dette spor).
- `fund/FUND-kand1b.md` - hele rapporten, saerligt tabellen over de fem-seks fundne, ikke-byggede
  soeskendemodeller og GENISOM's produktside-URL'er.
- `data/robots/genisom-gangben-l1.yaml` og `-l2.yaml` som formatanker for citat+oversaettelsesmoenster.
- `data/robots/unitree-b2-w.yaml` som eksempel paa `arvet_fra`-brug (kun paa `anvendelse`, jf. R17).

---

## Stopproever, med citater - alle syv undersoegte kandidater

`fund/FUND-kand1b.md` navngav fem, GENISOM's egen navigation (hentet fra `genisomai-home-2026-08-24.html`)
viste et sjette navngivet firbenet produkt (Qiuqiu SP1, allerede paa listen) og et SYVENDE produkt
(NE01), som IKKE stod i FUND-kand1b.md's liste. Alle syv er undersoegt.

### 1. Gangben L1-W (钢镚 L1-W) - BESTAAET, bygget

> Meta-keywords: "具身智能,四足机器人,机器狗,行业级机器人,钢镚L1,铜锤M1,轮足机器人,..."
> Meta-description: "钢镚L1-W是智身科技推出的首款行业级轮式四足机器人"
> — https://www.genisomai.com/product-robot/L1-W, hentet 2026-08-24

Hjul-ben-hybrid (12 ledmotorer + 4 hjulnavmotorer). Taeller som firbenet efter opgavens egen
regel om hjul-ben-hybrider (samme princip som Unitree B2-W, allerede i kataloget).

### 2. Gangben L1 Maker (钢镚 L1 Maker) - **AFVIST, L11 (undervisningskit)**

> Meta-description: "智身钢镚 L1 Maker 是一款面向机器人教学、工程实训与科创实践的行业级可组装教育四足机器人。
> 产品支持从基础零件、部件到整机的深度装配，并开放行业级生产标定软件、二次开发接口与算法部署能力。产品针对反复
> 拆装实训进行耐久设计，配备全套工具与标准化装配 SOP..."
> (egen oversaettelse: "GENISOM Gangben L1 Maker er en industriklasse samlebar uddannelses-firbenet
> robot rettet mod robotundervisning, ingenioerpraktik og STEM-praksis. Produktet understoetter dyb
> samling fra grundlaeggende dele over komponenter til hele maskinen, og aabner industriklasse
> produktionskalibreringssoftware, videreudviklingsgraensesnit og algoritmeudrulning. Produktet er
> designet til holdbarhed ved gentagen af-/paamontering til traening, med et komplet vaerktoejssaet
> og standardiseret monterings-SOP")
> — https://www.genisomai.com/product-robot/L1maker, hentet 2026-08-24

**Begrundelse for afvisning:** L11 udelukker kategorisk "undervisningskit" ("Legetoej,
hobbyrobotter og undervisningskit hoerer ikke i kataloget"). L1 Maker's egen udtrukne
techParamsData-JSON bekraefter, at hardwaren er FYSISK IDENTISK med L1 (630×360×415mm, 15kg,
5Ah/43,2V batteri, 16cm trappeklatring, 8kg last - alle tal genfindes praecis paa L1's post) -
det er altsaa IKKE et forsimplet/legetoejslignende produkt paa samme skala som L11's navngivne
eksempler (Sony aibo, Tombot, Petoi, MangDang, Hiwonder, Yahboom, Elephant Robotics). MEN
producentens EGEN beskrivelse bruger ordene "教育" (uddannelse), "机器人教学" (robotundervisning),
"实训" (praktisk traening) og saelger produktet netop som et gentageligt af-/paamonteringssaet med
"全套工具与标准化装配 SOP" (komplet vaerktoejssaet og standardiseret monterings-SOP) - det er per
definition et undervisningskit, blot bygget paa industri-graderet hardware i stedet for
legetoejsskala. Det er en genuin doemmesag, ikke en entydig regel - dokumenteret her, saa
fravalget kan efterproeves og evt. omstoedes af CEO'en. Tre selvstaendige undermodeller
("ZSL-1 Air/Pro/Max") staar i en model-vaelger paa siden uden synlige separate specifikationer i
den hentede HTML - heller ikke undersoegt yderligere, given afvisningen paa produktniveau.

### 3. Gangben L2-W (钢镚 L2-W) - BESTAAET, bygget

> techParamsData classname: "钢镚 L2-W", description: "轮足运动版" (hjul-fod bevaegelsesudgave)
> — https://www.genisomai.com/product-robot/L2 (fane 2 af 3 i den strukturerede specifikationstabel),
> hentet 2026-08-24

Hjul-ben-hybrid, samme princip som L1-W. Ingen selvstaendig URL - findes kun som et fane-skift paa
L2's egen side, men med sin egen, fuldstaendige og selvstaendigt maalte datablok (afviger fra
basisudgaven paa vaegt, maal, hastighed, trappetrin, ladeporte).

### 4. Gangben L2-W Ultra (钢镚 L2-W Ultra) - BESTAAET, bygget

> techParamsData classname: "钢镚 L2-W Ultra", description: "轮足环视版" (hjul-fod rundtomsyn-udgave)
> — https://www.genisomai.com/product-robot/L2 (fane 3 af 3), hentet 2026-08-24

Samme hjul-ben-hybridtype som L2-W, med et udvidet 360°-sensorsaet (dobbelt 96-linjers 3D LiDAR,
RTK, fiskeoeje-array) oveni.

### 5. Tongchui M1 (铜锤 M1) - BESTAAET, bygget

> Meta-keywords: "具身智能,四足机器人,机器狗,行业级机器人,..."
> Meta-description: "铜锤M1是智身科技推出的中型行业级四足机器人，16个自由度，内嵌强化学习运动算法..."
> — https://www.genisomai.com/product-robot/M1, hentet 2026-08-24

Selvstaendig produktlinje - hverken "钢镚"(Gangben) eller en dublet af L1/L2. Ren gaaende
mellemklasse industrirobot (INGEN hjulmotorer i den strukturerede tabel, modsat L1-W/L2-W).
To yderligere tier-varianter fundet paa samme side ("铜锤 M1 Pro", "铜锤 M1 Ultra") - IKKE bygget,
se noten paa selve YAML-posten; udenfor FUND-kand1b.md's navngivne omfang ("Tongchui M1").

### 6. Qiuqiu SP1 (铅球 SP1) - BESTAAET, bygget

> Meta-keywords: "防爆巡检机器人,四足机器人,机器狗,防爆机器人,防爆机器狗"
> Meta-description: "智身铅球 SP1 是面向石油化工、能源场站等高危工业环境的防爆四足巡检机器人"
> — https://www.genisomai.com/product-robot/sp1, hentet 2026-08-24

Eksplosionssikker hjul-ben-hybrid (三种bevaegelsesformer eksplicit naevnt: "匍匐通行"/kravlende,
"轮式行进"/hjuldrevet, "足式越障"/benbaseret). Tyndeste kilde i dette spor - kun tre
specifikationssektioner mod de oevrige modellers fem-seks (se selv-review).

### 7. NE01 (银毅 NE01) - **AFVIST, ikke firbenet (humanoid)**

> Meta-keywords: "智身科技，智身机器人，智身科技官网，智身科技人形机器人，智身银毅NE01，银毅机器人，
> 银毅NE01，银毅人形机器人，"
> Meta-description: "银毅NE01高性能人形机器人，峰值关节扭矩高达 180Nm，为高爆发运动提供充足的动力储备，
> 搭载 540Wh 大容量电池..."
> — https://www.genisomai.com/product-robot/ne01, hentet 2026-08-24

"人形机器人" = humanoid robot, eksplicit og gentaget. Falder paa stopproeven umiddelbart - samme
kategori som opgavens egen eksempel paa, hvad kataloget IKKE daekker. Ikke fundet i
FUND-kand1b.md's oprindelige liste - et nyt fund fra GENISOM's egen produktnavigation, som denne
runde ogsaa gennemsoegte. Ingen YAML bygget, ingen felter udtrukket.

---

## Faerdighedskriterium - N leveret, K afvist

**Leveret: 5.** **K = 2 afvist** (L1 Maker under L11, NE01 som ikke-firbenet).

| Model | Status | Fil |
|---|---|---|
| Gangben L1-W | Leveret | `data/robots/genisom-gangben-l1-w.yaml` |
| Gangben L1 Maker | **Afvist (L11)** | ingen fil |
| Gangben L2-W | Leveret | `data/robots/genisom-gangben-l2-w.yaml` |
| Gangben L2-W Ultra | Leveret | `data/robots/genisom-gangben-l2-w-ultra.yaml` |
| Tongchui M1 | Leveret | `data/robots/genisom-tongchui-m1.yaml` |
| Qiuqiu SP1 | Leveret | `data/robots/genisom-qiuqiu-sp1.yaml` |
| NE01 | **Afvist (ikke firbenet)** | ingen fil |

**To yderligere niveauer fundet, ikke bygget** (dokumenteret i de respektive YAML-posters `noter:`,
saa et fravalg ikke forveksles med en forglemmelse): M1 Pro / M1 Ultra (tier-varianter af Tongchui
M1, samme side) og ZSL-1 Air/Pro/Max (undermodeller naevnt paa flere produktsider uden synlige
separate specifikationer i den hentede HTML).

---

## Feltdaekning pr. post

Maalt med `node tools/validate.mjs --taethed` efter selv-tjek (naevner 30, L32):

| Post | Udfyldt | Taethed |
|---|---|---|
| Gangben L1-W | 20/30 | 67 % |
| Gangben L2-W | 20/30 | 67 % |
| Gangben L2-W Ultra | 21/30 | 70 % |
| Tongchui M1 | 22/30 | 73 % |
| Qiuqiu SP1 | 13/30 | 43 % |

Ingen af de fem overstiger det eksisterende loft (Gangben L2, 77 %). Tongchui M1's 73 % ligger paa
niveau med Vision 60/MOVENEW P1 (begge ogsaa 73 %) - forklaret af en usaedvanligt rig, strukturret
JSON-specifikationsside, samme moenster som L2's 77 % sidste runde. Qiuqiu SP1's 43 % er en
AEGTE forskel, ikke en indsamlingsfejl: SP1's egen specifikationstabel har kun tre sektioner
(基础信息/性能参数/功能列表) mod de oevriges fem-seks - INGEN led-parameter-sektion, INGEN
sensor-sektion.

---

## Arvebeslutning (regel om `arvet_fra`)

**INGEN af de fem poster bruger `arvet_fra`.** Begrundelse: `arvet_fra` (R17, DATAMODEL.md) findes
KUN til `anvendelse`-feltet og forudsaetter, at variantens EGEN side er tavs om anvendelse, saa
moderens citat maa laanes i stedet. Det var IKKE tilfaeldet for nogen af de fem:

- **L1-W** har sin egen, selvstaendige "下一个应用场景"-sektion (fire citater, forskellige fra L1's).
- **M1** har sin egen, selvstaendige tilsvarende sektion (fem citater, forskellige fra L1/L2's).
- **SP1** har sin egen meta-beskrivelse og brodtekst med "巡检" eksplicit.
- **L2-W og L2-W Ultra** deler BOGSTAVELIGT TALT samme URL og samme "下一个应用场景"-sektion som L2
  (teksten staar en gang paa siden, foer de tre variant-faneblade i specifikationstabellen) - det
  er ikke en arv fra en ANDEN robots side, det er den SAMME primaerkilde, som alle tre varianter
  bor paa. At markere det `arvet_fra: genisom-gangben-l2` ville forkert antyde, at L2-W's egen side
  var tavs og laante L2's ord - den er det ikke.

For de tekniske `felter:` (vaegt, maal, hastighed osv.) findes der slet ikke en `arvet_fra`-mekanisme
i skemaet (bekraeftet ved laesning af `tools/skema.mjs`/`validate.mjs` - R17 er skrevet specifikt
til `anvendelse`-noeglen). Hver teknisk vaerdi paa L2-W/L2-W Ultra er derfor citeret direkte fra
dens EGEN datablok i den delte JSON (id 1249 hhv. 1250), ALDRIG kopieret fra L2's post - og hvor
tallene faktisk er identiske mellem varianter (fx alle tre varianters "关节电机数量: 12个"), er det
fordi kilden selv gentager tallet i hver variants egen blok, ikke fordi jeg har genbrugt L1/L2's
skrevne vaerdier.

**Bevidst udeladt af samme grund (konservativ grael):** L2-siden har et delt "hero"-marketingkort
foer variant-fanebladene med tal som "70cm 垂直越障高度", "756Wh 大容量电池" og "86 TOPS" - disse
matcher L2 (basisudgavens) egne tal PRAECIST, men er IKKE gentaget i L2-W/L2-W Ultra's egne
datablokke. Da jeg ikke kan vaere sikker paa, om hero-kortet beskriver hele familien eller kun
standardfanen (L2), har jeg IKKE tilskrevet disse tal til L2-W/L2-W Ultra (forhindring_enkelt og
batteri_wh staar `ikke_oplyst` paa begge, og compute mangler TOPS-tallet). Dette er en bevidst
konservativ afgraensning, dokumenteret i hver posts `noter:` - en anden laeser kunne rimeligt
argumentere for at inkludere dem, given at de faktisk staar paa samme URL.

---

## Regelaendringen om sekundaere kilder (L33) - undersoegt, ikke brugt

GENISOM AI's GitHub-organisation (`github.com/zsibot`) blev genundersoegt for alle fem nye poster.
Ud over de to repoer, `FUND-kand1b.md` allerede kendte (`genisom_L1_sdk`, `genisom_roamerx_open`),
fandtes et tredje: `genisom_robot_sdk` (README: "Programming Language: C++", Ubuntu 22.04, CMake,
Boost). Det blev IKKE brugt til `sdk_sprog` paa nogen af de fem poster: repoet har INGEN
GitHub-beskrivelse, der binder det til et specifikt produktnavn (modsat `genisom_L1_sdk`'s
eksplicitte "Official SDK for Genisom L1 Series robots"), og hverken "M1", "L2" eller "SP1" staar
i den udtrukne README-tekst (378 linjer gennemsoegt, nul traeffere). At bruge det alligevel ville
vaere praecis den slags navnesammenfald-uden-bevis, som `FUND-kand1b.md` selv fangede og forkastede
paa L2's `ros2`-felt ("RoamerX"-koblingen med "TODO" i README'en). `sdk_sprog` staar derfor
`ikke_oplyst` paa alle fem nye poster, med en advarsel paa Tongchui M1's post, der forklarer
undersoegelsen og afvisningen.

---

## Efterproevning (obligatorisk)

```
node tools/validate.mjs          -> 60 fil(er) - 0 fejl - 1 advarsel (praeeksisterende, Ghost
                                     Vision 60, uroert af mig - identisk med baseline)
node tools/build.mjs             -> Byggede 165 sider (var 155). Kort paa forsiden: 60 (var 55).
                                     Kildemaerker: 835 tal med kilde, 0 uden (var 739 - +96 tal).
                                     Sekundaere kilder: 4 felter (uaendret - INGEN nye fra mig,
                                     jf. afsnittet ovenfor om genisom_robot_sdk).
                                     SPAERRING S1 (fabrikantbilleder) uaendret af mig - jeg har
                                     bevidst IKKE tilfoejet nogen billede-blokke, som instrueret.
node tests/koer.mjs              -> 195 bestaaet / 2 fejlet - IDENTISK med baseline. De to fejl er
                                     praeeksisterende og dokumenteret (interval-midtpunkt,
                                     kategori-raekkefoelge) - urelateret til dette spor.
```

---

## Selv-tjek (obligatorisk), felt for felt, med taelling

**Metode:** hver post er krydstjekket vaerdi for vaerdi mod den udtrukne, formaterede
`techParamsData`-JSON for netop den variant (5 separate pretty-printede JSON-filer, en pr. model -
for L2-W/L2-W Ultra specifikt den relevante `datas[]`-blok, IKKE basisudgavens), plus en
efterfoelgende byte-niveau-genlaesning direkte i den raa HTML af de mest sikkerhedskritiske tal
(vaegt og maal paa alle fem poster, samt L2-W Ultra's LiDAR-linjetal) for at udelukke en fejl i min
egen JSON-udtraekning.

| Post | Felter efterproevet | Fejl fundet | Rettet |
|---|---|---|---|
| Gangben L1-W | 30 | 0 | - |
| Gangben L2-W | 30 | 0 | - |
| Gangben L2-W Ultra | 30 | 0 | - |
| Tongchui M1 | 30 | 0 | - |
| Qiuqiu SP1 | 30 | 0 | - |
| **I alt (felter)** | **150** | **0** | - |
| Plus: `anvendelse`-blok pr. post (citat+oversaettelse) | 5 | 0 | - |
| Plus: byte-niveau raa-HTML-krydstjek (vaegt/maal/LiDAR paa 5 poster) | 6 stikproever | 0 | - |

**I alt 161 datapunkter efterproevet paa tvaers af fem poster, nul fejl fundet i denne
efterproevningsrunde.** Saerligt kontrolleret: operatorer bevaret (regel 4 - "≈" konsekvent
oversat til `~`, "≤"/"＜" til `<=`/`<`), nyttelast ikke blandet (regel 6 - gaaende/staaende holdt
adskilt, og staaende sat `ikke_oplyst`, hvor kilden ikke gav et separat tal), trinhoejde ikke
blandet (regel 7 - forhindring_enkelt/trappetrin_kontinuerlig holdt adskilt paa alle fem, inkl.
bevidst `ikke_oplyst` paa L2-W/L2-W Ultra's forhindring_enkelt, se arveafsnittet), driftstid har
lastbetingelse eller `ikke_oplyst` (regel 8 - ingen af de fem poster har et kg-tal direkte knyttet
til driftstidsraekken, saa alle fem baerer `ved_last: ikke_oplyst` med en forklarende advarsel).

**Ingen taknemmelig afrunding fundet:** to genuine tal-uoverensstemmelser paa samme producentside
blev opdaget og bevidst IKKE rettet stiltiende (regel 9) - Tongchui M1's egenvaegt (41kg i
specifikationstabellen mod "ca. 30kg" i marketingteksten, brugt til at haevde et 1:1
last-egenvaegt-forhold) og M1's dataporte-antal (9 navngivne porte i tabellen mod en paastand om
"15 hovedinterfaces" i marketingteksten). Begge staar som synlige `advarsel:`-tekster paa de
respektive felter.

---

## Selv-review - hvad jeg er mest usikker paa

1. **L1 Maker-afvisningen er en aegte doemmesag, ikke en entydig regel.** Hardwaren er fysisk
   identisk med L1 (samme maal, vaegt, batteri, trappeklatring til talniveau) - det er IKKE en
   billig legetoejskopiering paa L11's navngivne skala (Petoi/MangDang/Hiwonder/Yahboom). Men
   producentens eget sprog ("教育", "机器人教学", "拆装实训", "标准化装配 SOP") beskriver et produkt,
   der funktionelt ER et undervisningskit, blot bygget paa industri-hardware. Jeg har valgt at
   afvise, fordi L11's ordlyd eksplicit navngiver "undervisningskit" som kategori uden at
   kvalificere den efter pris/skala - men en anden laeser kunne rimeligt lande paa det modsatte,
   og CEO'en boer se begrundelsen, ikke bare konklusionen.
2. **L2-W og L2-W Ultra's `anvendelse`- og delte hero-tal (70cm/756Wh/86TOPS) er en konservativ
   afgraensning, jeg ikke er 100% sikker paa er den rigtige side at fejle paa.** Se arveafsnittet
   ovenfor - jeg har valgt at UDELUKKE hero-kortets tal fra de to wheel-variant-poster, fordi de
   ikke gentages i variantens egen datablok, men det er lige saa forsvarligt at inkludere dem med
   en advarsel om, at de staar paa samme side uden variant-specifik gentagelse. Jeg har valgt den
   fejlretning, der efterlader FAERRE, men SIKRERE tal - i tvivl om, hvorvidt det er den rigtige
   afvejning for netop dette tilfaelde.
3. **Qiuqiu SP1's `dockingstation: ikke_oplyst` til trods for "充电方式: 无线/有线" (traadloes/kabel
   lademetode).** Traadloes ladning antyder ofte en fysisk ladepude/-station, men siden bruger
   ALDRIG ordet "充电座"/"充电桩" (ladesokkel/ladestation) om SP1, som den goer eksplicit for
   L1/L1-W/L2/L2-W/L2-W Ultra/M1. Jeg har valgt den strenge fortolkning (ikke_oplyst) frem for at
   udlede en fysisk station af lademetoden alene - men det er en fortolkning, ikke en entydig
   laesning.
4. **SP1's `lidar: ikke_oplyst` til trods for "感知雷达封装于隔爆视窗之后".** Ordet "雷达" er generisk
   "radar", ikke det specifikke "激光雷达" (LiDAR), som resten af kataloget bruger. Jeg har bevidst
   IKKE gaettet, at det er LiDAR - men det ER muligt, at producenten bruger "雷达" loest om det
   samme som "激光雷达" andetsteds i deres sprogbrug, og at feltet burde vaere udfyldt med en tekst
   som "sensor bag eksplosionssikker rude, type uklar".
5. **Tongchui M1's vaegt-uoverensstemmelse (41kg vs. "~30kg") er IKKE loest, kun dokumenteret.**
   Jeg ved ikke, hvilket af de to tal der er korrekt - eller om "1:1-forholdet" i marketingteksten
   er en ren markedsfoeringsoverdrivelse, der aldrig var ment som en bogstavelig vaegtangivelse.
6. **M1 Pro/M1 Ultra og ZSL-1 Air/Pro/Max er nye fund, IKKE bygget, og heller ikke systematisk
   afsoegt for selvstaendige produktsider.** De kan have egne URL'er, jeg ikke har ledt efter -
   jeg har kun set dem som faner i en delt JSON-blok (M1 Pro/Ultra) eller som en model-vaelger
   uden synlige specifikationer i den hentede HTML (ZSL-1-serien).

**Hvad jeg ikke naaede:** at hente og vurdere billedkandidater efter billedbaren (bevidst
udeladt, som instrueret - se listen nedenfor). At bygge M1 Pro/M1 Ultra eller ZSL-1 Air/Pro/Max
(bevidst afgraensset til FUND-kand1b.md's navngivne "omkring fem"-liste). At undersoege, om
`genisom_robot_sdk`s manglende model-binding kan afklares yderligere ved at laese hele READMEen
(kun forsiden/README-uddraget blev gennemsoegt for modelnavne, ikke de dybere docs/-undermapper).

---

## Billedkandidater (ingen `billede:`-blokke bygget, som instrueret)

Ingen af URL'erne nedenfor er hentet som billedfiler eller vurderet efter billedbaren
(hel maskine, intet UI, overlever kvadratisk beskaering) - kun fundet i den arkiverede HTML.

| Model | Kandidat-URL | Vurderet med oejne? |
|---|---|---|
| Gangben L1-W | `https://qiniu.mfdemo.cn/zhishen/2026/05/24/d0Jz0Rkqjdq7p.webp` (techParams-ikon) | Nej |
| Gangben L2-W / L2-W Ultra | Ingen selvstaendigt ikon fundet i techParamsData - deler formentlig L2's hero-billeder | Nej |
| Tongchui M1 | `https://qiniu.mfdemo.cn/zhishen/2026/05/24/n9zpFnC6h3lgl.webp` (base), `.../PF8uUVal8d7yf.webp` (M1 Pro), `.../77cbr4Bf5XmLC.webp` (M1 Ultra) | Nej |
| Qiuqiu SP1 | `https://qiniu.mfdemo.cn/zhishen/2026/07/23/f3DRUTweEXtIl.webp` (techParams-ikon) | Nej |

---

## Gitignorerede nye filer, fuld sti (regel om at liste hver fil)

Alle under `C:\Praktik\websites\udstilling-wt-genisom\media\_kilder\raa-genisom-2026-08-24\`,
bekraeftet gitignoreret med `git check-ignore -v` (regel `.gitignore:13:media/_kilder/**`):

1. `genisomai-home-2026-08-24.html` (navigation, model-liste)
2. `genisomai-l1w-2026-08-24.html`
3. `genisomai-l1w-2026-08-24-techparams.json`
4. `genisomai-l1w-2026-08-24-techparams-pretty.json`
5. `genisomai-l1w-2026-08-24-text.txt`
6. `genisomai-l1maker-2026-08-24.html`
7. `l1maker-techparams.json`
8. `l1maker-text.txt`
9. `genisomai-l2-2026-08-24.html` (indeholder L2/L2-W/L2-W Ultra's samlede techParamsData)
10. `genisomai-l2-2026-08-24-techparams.json`
11. `genisomai-l2-2026-08-24-techparams-pretty.json`
12. `l2-text.txt`
13. `genisomai-m1-2026-08-24.html` (indeholder M1/M1 Pro/M1 Ultra's samlede techParamsData)
14. `genisomai-m1-2026-08-24-techparams.json`
15. `genisomai-m1-2026-08-24-techparams-pretty.json`
16. `genisomai-m1-2026-08-24-text.txt`
17. `genisomai-sp1-2026-08-24.html`
18. `genisomai-sp1-2026-08-24-techparams.json`
19. `genisomai-sp1-2026-08-24-techparams-pretty.json`
20. `genisomai-sp1-2026-08-24-text.txt`
21. `genisomai-ne01-2026-08-24.html` (afvist model, arkiveret som bevis for afvisningen)
22. `github-zsibot-org-2026-08-24.html`
23. `github-genisom_robot_sdk-2026-08-24.html`
24. `github-genisom_robot_sdk-text.txt`
25. `github-MATRiX_Python_SDK-2026-08-24.html`
26. `self-check-extract.txt` (mit eget udtraek af alle skrevne vaerdier, brugt til selv-tjekket ovenfor)

Ingen af dem er sporet af git - de forsvinder ved en almindelig `git worktree remove`. Orkestratoren
kopierer materialet ved flet, jf. mappestrukturreglen i CLAUDE.md.
