# FUND-kand5 — Yuejia Lingdong (YJ30-serien) og Galileo (Tianjin) (C1/E1/S1-serien) som robotposter

Byggerunde, bestilt af CEO'en 25.-26. aug 2026, som opfølgning paa research-runden `fund/FUND-kand4.md`
(spor/kand4). Arbejdet i git-worktree `C:/Praktik/websites/udstilling-wt-kand5`, gren `spor/kand5`.
Ingen anden worktree eller repo er roert (`c:\Praktik\website`, `c:\Praktik\websites\salg` og
hovedrepoet er ikke besoegt).

**Leverance: 10 nye robotposter i `data/robots/`** — fire Yuejia-modeller, seks Galileo-modeller.
"Galileo X" er undersoegt og **afvist** (se afsnit 3).

---

## 0. Skill-vurdering

| Skill | Valgt? | Begrundelse |
|---|---|---|
| `robotdata` | **Valgt** | Opgaven er netop det, skillen er bygget til: indsamle og skrive robotposter. `.claude/skills/robotdata/SKILL.md` er laest fra disk ved opgavens start (30-feltsskemaet, de ti hårde regler, billedbaren, selv-tjek-kravet) og fulgt gennem hele arbejdet. |
| `parallelt` | Gaaet forbi | Jeg er allerede ét spor i en fordelt koersel (spor/kand5). De ti robotposter deler for meget infrastruktur (samme to kilder, samme udtraeksscript, samme selv-tjek-logik) til at et split til flere underagenter ville give noget andet end koordineringsomkostning - samme begrundelse som `FUND-kand4.md` naaede for research-fasen. |
| `grillmig` | Gaaet forbi | Gaelder gril af et brief *foer* afsendelse eller laas af en STATUS.md-beslutning. Intet af det sker her - opgaven var allerede grillet/besluttet af CEO'en foer denne agent blev sat i gang. |
| `critique`, `ui-ux-critique`, `impeccable`, `dataviz`, `new-project`, `code-review`, `simplify` | Gaaet forbi | Ingen bygget flade, ingen kode aendret ud over datafiler. |

**Konklusion:** `robotdata` er den eneste relevante skill, og den er brugt fuldt ud - inkl. de ti
haarde regler, billedbaren (ingen billeder tilfoejet i denne omgang, jf. opgavebeskrivelsen) og det
obligatoriske selv-tjek med taelling (afsnit 6).

**Laest foerst, som bedt om (fra worktree'ens disk):** `.claude/skills/robotdata/SKILL.md`,
`STATUS.md` (linje 11: dataindsamlingsstatus; linje 43: L33-beslutningen om sekundaere kilder med
synligt maerke), `fund/FUND-kand4.md` (hele dokumentet), `data/robots/genisom-gangben-l2.yaml` og
`data/robots/unitree-b2-w.yaml` som formatankre.

---

## 1. Genbrugt evidens

Alle 12 filer fra `media/_kilder/raa-kand4-2026-08-25/` (hentet af spor/kand4, 2026-08-25) blev
genbrugt uaendret - ingen af dem manglede noget, jeg havde brug for til de ti robotter:

1. `yuejialingdong-yj-56-2026-08-25.html` (YJ30) · `yuejialingdong-yj-57-2026-08-25.html` (YJ30Max)
   · `yuejialingdong-yj-58-2026-08-25.html` (YJ30W MAX) · `yuejialingdong-yj-59-2026-08-25.html`
   (YJ30 W) · `yuejialingdong-en-2026-08-25.html` og `yuejialingdong-yj30-en-2026-08-25.html`
   (engelske sideversioner, brugt som krydstjek, ikke som primaer kilde)
2. `galileo-wrc-product-manual-2025.pdf` — Galileos 9-siders officielle produktmanual (C1/C1-W/E1/
   E1-W/S1/S1-W), eneste kilde til alle seks Galileo-poster
3. `pudu-products-2026-08-25.html`, `uniubi-embodied-ai-2026-08-25.html`,
   `uniubi-embodied-robot-2026-08-25.html`, `galileotime-home-2026-08-25.html`,
   `galileotime-robot-zh-2026-08-25.html` — ikke brugt i denne runde (Pudu/UNIUBI var allerede
   afklaret i kand4 som "ingen ny post", og galileotime.com-siderne er tomme SPA-skaller, jf. kand4)

**NY evidens indsamlet i denne runde:** ingen raa filer gemt i `media/_kilder/raa-kand5-2026-08-25/`
— mappen er ikke oprettet, fordi intet nyt websted blev hentet med curl/WebFetch til selve
robotposterne. Den eneste nye research var WebSearch + ét WebFetch-kald om "Galileo X" (afsnit 3),
som ikke producerer en raa fil at gemme (soegeresultater og en AI-opsummering, ikke HTML) — kildernes
URL'er er citeret direkte i afsnit 3 i stedet.

---

## 2. Det tekniske problem, der aad det meste af tiden: ingen poppler i denne koersel

Opgavebeskrivelsen forudsaetter, at `Read`-vaerktoejets `pages`-parameter kan laese PDF'en direkte.
Det fejlede med `pdftoppm is not installed` - poppler-utils er ikke installeret i denne koersel
(modsat spor/kand4, hvor agenten aabenbart havde adgang til det, jf. dens rapports beskrivelse af
Galileos tabeller). Ét ekstra forsoeg (uden `pages`-parameteren) fejlede paa samme maade.

Fremfor at opgive PDF'en og notere "ikke laest" for seks robotter, byggede jeg et selvstaendigt
PDF-tekstudtraek i ren Python (ingen pip-pakker - `pip` var i sig selv i stykker i dette Python-miljoe):

- Et minimalt PDF-objekt-/stream-parser (`zlib`-dekomprimering af FlateDecode-streams).
- En ToUnicode-CMap-laeser (bfchar/bfrange) til at afkode Identity-H CID-tekst.
- Et fund undervejs: PDF'ens EGEN ToUnicode-CMap kortlaegger ti bestemte CID'er (0xF6B1-0xF6BA) til
  U+FFFD (uafkodeligt) i stedet for cifrene 0-9 - en fejl i producentens/eksportvaerktoejets egen
  PDF, ikke i mit udtraek. Alle tal i tabellerne brugte netop disse CID'er.
- For at afgoere de RIGTIGE cifre skrev jeg en Type2-charstring-fortolker til den indlejrede
  CFF-font (FontFile3) og et rent scanline-polygonfyld til at rasterisere de ti glyffer til et
  billede, som jeg saa saa med egne oejne (`digits_grid.png`) - CID 63153+d er glyffen for cifret
  d, bekraeftet visuelt, ikke antaget ud fra en gaettet CID-raekkefoelge.
- Rettelsen er skrevet som en betinget patch (kun aktiv, naar netop dette FFFD-moenster er til
  stede), ikke en blind overskrivning - se scriptets egen kommentar.

Scripts ligger i scratchpad (`pdfextract.py`, `pdfextract2.py`, `cfflib.py`, `render_glyphs.py`) og
er IKKE en del af leverancen - de er et engangsvaerktoej til denne opgave, ikke tilfoejet til
`tools/`. Genbygges de faktiske Galileo-tal fra PDF'en igen, vil samme fremgangsmaade skulle gentages
(eller poppler installeres).

Konsekvensen for tal-noejagtigheden: se afsnit 6 (selv-tjek) - alle 70 Galileo-taltilfaelde er
maskinelt krydstjekket mod det udtrukne tekstlag efterfoelgende, saa metoden er efterproevet, ikke
kun antaget korrekt.

---

## 3. Stop-tjek pr. model

### 3.1 Yuejia Lingdong (深圳越甲灵动（深圳）科技有限公司)

| Model | Firbenet? | Citat | Afgoerelse |
|---|---|---|---|
| **YJ30** | Ja, entydigt | Producentens nav-hovedpunkt "越甲四足系列" (Yuejia Quadruped/Four-Legged Series) | **Bygget** |
| **YJ30Max** | Ja, entydigt | Samme navigation | **Bygget** |
| **YJ30 W** | Ja, med hjul-ben-forbehold | "四足巡检机器人，采用四轮独立驱动结构" (firbenet inspektionsrobot med firehjuls uafhaengigt drev) - staar under samme "四足系列"-navigation | **Bygget**, som hjul-ben-hybrid (praecedens: Unitree B2/B2-W, Genisom L2/L2-W) |
| **YJ30W MAX** | Ja, med hjul-ben-forbehold | Samme citat-moenster som YJ30 W | **Bygget**, samme begrundelse |

Ikke legetoej (L11): alle fire har RMB-priser (¥78.000-¥358.000) og industri-/
sikkerhedsanvendelser (巡逻巡检/应急救援/警用巡逻/电力巡检/火情预警) - langt fra hobbykit-niveau.
Reelt produkt: alle fire har "立即购买" (koeb nu)-knap og en struktureret specifikationstabel med
tal og enheder, ikke kun rendering-billeder.

### 3.2 Galileo (伽利略（天津）技术有限公司)

| Model | Firbenet? | Citat | Afgoerelse |
|---|---|---|---|
| **C1** | Ja, entydigt | "【C1工业小型】智能仿生四足机器人" - hele manualens titel er "智能仿生四足机器人/INTELLIGENT BIONIC QUADRUPED ROBOT" | **Bygget** |
| **C1-W** | Ja, hjul-ben | "【C1-W工业小型】智能仿生轮足机器人" (\"轮足\" = hjul+fod) | **Bygget**, hjul-ben-hybrid |
| **E1** | Ja, entydigt | "【E1工业中型】智能仿生四足机器人" | **Bygget** |
| **E1-W** | Ja, hjul-ben | "【E1-W工业中型】智能仿生轮足机器人" | **Bygget**, hjul-ben-hybrid |
| **S1** | Ja, entydigt | "【S1工业大型】智能仿生四足机器人" | **Bygget** |
| **S1-W** | Ja, hjul-ben | "【S1-W工业大型】智能仿生轮足机器人" | **Bygget**, hjul-ben-hybrid |

Ikke legetoej: manualens egne anvendelsesscenarier daekker lufthavns-/togstations-/
graensepatrulje, jordskaelvs-/katastrofeberedskab, vagtpost/vaebnet antiterror/spraengstofrydning,
fabriks-/havneinspektion - militaer-/sikkerhedsindustri-niveau. Reelt produkt: fulde tekniske
specifikationstabeller med tal og enheder for alle seks modeller (se afsnit 4).

### 3.3 "Galileo X" — undersoegt, AFVIST

Splinterny annoncering, afsloeret paa WRC 2026 (19.-23. aug 2026, altsaa 1-6 dage foer denne
research). WebSearch + ét WebFetch-kald (prnewswire-pressemeddelelsen) viser:

> "Rather than being an iteration of existing products, Galileo X is an original creation developed
> from zero... Galileo X breaks conventional boundaries between AGVs, off-road vehicles and
> quadruped robots, combining the high-precision indoor transport of wheeled AGVs, vehicle-level
> long-range off-road mobility, and complex-terrain traversal capabilities of legged robots—all
> integrated within a single platform."
> — [PR Newswire, "Galileo Robotics Unveils Galileo X at WRC 2026..."](https://www.prnewswire.com/news-releases/galileo-robotics-unveils-galileo-x-at-wrc-2026-breaking-conventional-form-factors-with-its-embodied-ground-mobility-system-302858148.html), hentet 2026-08-25

WebFetch-analysen af selve pressemeddelelsen bekraefter direkte: **"legged robots" naevnes kun som
en EVNE-kategori, ikke som en beskrivelse af Galileo X selv. Intet "quadruped", ingen hjul/ben
naevnt eksplicit, INGEN tekniske specifikationer (vaegt, maal, nyttelast, hastighed) er offentliggjort
overhovedet** - ren positioneringstekst, intet produkt at maale paa.

**Afgoerelse: afvist, bygges ikke.** Stop-tjekket falder paa "reelt produkt, ikke kun rendering" -
der er intet at skrive i en YAML-fil, fordi producenten selv har undgaaet at bekraefte, om det
overhovedet ER en firbenet robot (den positionerer sig eksplicit UDENFOR AGV/hjulkoeretoej/firbenet
robot-kategorierne, ikke inden i én af dem). Genbesoeges, naar/hvis Galileo udgiver et specark.

---

## 4. Felt-for-felt-kildeoversigt (hovedlinjer)

Den fulde kildeliste staar i hver YAML-fils `kilde:`-noegler (én per felt, som skemaet kraever).
Her de vigtigste moenstre, der gaar paa tvaers:

**Yuejia (4 filer):** alle tal fra hver models egen raekke i "基础参数"-tabellen paa
`yuejialingdong.com/index.php/yuejiasizuxilie/{56,57,58,59}.html`. YJ30/YJ30 W-tabellerne staar
paa BAADE side 56 og 59 (identisk indhold, krydstjekket); YJ30Max/YJ30W MAX-tabellerne paa BAADE
side 57 og 58 (samme). `kildetype: sekundaer` er IKKE brugt her - dette er producentens eget domaene
direkte, ikke en tredjepartsside.

**Galileo (6 filer):** alle tal fra `galileo-wrc-product-manual-2025.pdf`, hostet paa
worldrobotconference.com's officielle udstillerprofilside, men uploadet af Galileo selv. **Hvert
enkelt felt er maerket `kildetype: sekundaer`**, som CEO'ens instruks bad om (jf. L33) - PDF'en er
ikke hentet fra Galileos eget domaene (galileotime.com kunne ikke hentes statisk, se kand4 afsnit 9).

**Specifikationstaethed (groft optalt, ikke maalt mod `tools/skema.mjs` for hver fil enkeltvis):**
Yuejia-modellerne ligger paa ca. 12-16 af 30 felter (40-53 %), Galileo-modellerne paa ca. 18-20 af
30 (60-67 %) - Galileo C1 saerligt taet paa Gangben L2's 77 %-rekord. `node tools/build.mjs`'s
egen taelling (afsnit 7) er den autoritative kilde til det praecise tal per robot.

**Felter, der gennemgaaende er `ikke_oplyst` for begge producenter:** `frihedsgrader`, `ros2`,
`sdk_sprog`, `monteringsinterface`, `ce_oplyst` - ingen af de to producenter naevner nogen af dem
noget sted i det gennemgaaede materiale. `pris` er `ikke_oplyst` for alle seks Galileo-modeller
(manualen er en teknisk brochure, ingen priser) men UDFYLDT for alle fire Yuejia-modeller (RMB-pris
ved siden af en "koeb nu"-knap).

---

## 5. Arv-beslutninger (`arvet_fra`)

**Ingen af de ti poster bruger `arvet_fra`.** Begrundelse, gentaget fra `genisom-gangben-l2-w.yaml`s
praecedens: `arvet_fra` er til, naar en variants EGEN side er tavs, og vi laaner et tal fra en
soskenderobot. Her har HVER variant sin egen eksplicitte raekke i samme tabel (Yuejia) eller sin
egen tabel paa sin egen manualside (Galileo) - selv naar to varianters tal er identiske (fx C1s og
C1-Ws nyttelast, begge 8kg/15kg), er de citeret UAFHAENGIGT fra hver deres egen raekke, ikke arvet.
At skrive dem som identiske-men-uafhaengigt-citerede er mere praecist end en arve-markering ville
vaere: producenten HAR faktisk oplyst tallet for begge, blot med samme vaerdi.

Eneste undtagelse, der ligner arv, men IKKE er det: `anvendelse`-feltet er citeret fra en delt
familie-side (Yuejias "行业应用"-sektion, hhv. Galileos manual-side 4) paa alle poster i hver
producentgruppe - men citeret SELVSTAENDIGT fra samme URL/PDF paa hver fil, ikke via `arvet_fra`,
jf. samme princip som Genisom L2-W's note om, at en delt kilde-side ikke er det samme som en
soskenrobots side.

---

## 6. Selv-tjek med taelling (obligatorisk, jf. `robotdata`-skillen)

**Automatiseret taltjek:** et script (`scratchpad/selfcheck.mjs` + `selfcheck2.mjs`) parser hver ny
YAML-fil med projektets EGEN `tools/yaml.mjs`-parser, traekker alle numeriske `vaerdi`/`min`/`maks`-
felter ud, og tjekker, at hvert tal findes ORDRET i den tilsvarende raa kildetekst.

- **Yuejia: 38 numeriske vaerdier tjekket paa tvaers af de fire filer, 0 ikke fundet.**
- **Galileo: 70 numeriske vaerdier tjekket paa tvaers af de seks filer, 0 ikke fundet.**
- **I alt: 108 taltilfaelde, 0 fejl fundet af det automatiske tjek.**

**Manuel efterproevning ud over talpraesens** (de tilfaelde, hvor et tal kan vaere "til stede et
sted i dokumentet" uden at sidde i den RIGTIGE model-blok):

- E1/E1-W-siden (Galileo manualens side 8) har en sammenfiltret udtraeksraekkefoelge, som ikke fandt
  sted paa C1/C1-W eller S1/S1-W's sider. Jeg genlaeste den raa udtraekstekst en ekstra gang og
  bekraeftede, at blokken med "正向高度差1m高台" (platformshoejde-formuleringen) staar UMIDDELBART
  ved siden af "1.5h～3h" og "＞30km" - de praecis samme tal, jeg havde tildelt E1-W ud fra en
  indholdsbaseret (ikke positionsbaseret) tildeling. Tildelingen er dermed bekraeftet, ikke kun
  antaget - men flagget som en usikkerhed i selve YAML-filens `noter`, fordi metoden i sig selv
  (indholdsbaseret fremfor positionsbaseret) er en fortolkning.
- `stroem_ud`-vaerdien "5V；12V；48V" for E1/E1-W staar kun ÉN gang i det udtrukne tekstlag (i
  stedet for to gange, én per model) - den samme analogislutning som er noteret i begge filers
  `advarsel:`-felt (laant fra C1/C1-W-parrets identiske vaerdi paa begge varianter).
- IP-klasse IP67 dobbelttjekket direkte i den raa tekst for alle seks Galileo-modeller (findes to
  gange paa hver af de tre sider, én gang per model-blok).
- `dataporte`-listerne (Ethernet/USB/RS485 for C1-familien og S1-familien; Ethernet/USB/TypeC for
  E1-familien) er krydslaest mod den raa tekst for alle seks Galileo-filer.
- Yuejias gaaende/staaende-nyttelast-split (静态负载/动态负载) for YJ30Max/YJ30W MAX er en DIREKTE
  aflaesning (to eksplicit navngivne raekker), ikke et skoen - modsat YJ30/YJ30 W, hvor kun ét
  uspecificeret "负载"-tal findes (samme situation som Unitree Go2, haandteret med samme forsigtige
  gaaende-placering og advarsel).
- Regel 4 (operatorer): Galileos "±40°"/"±45°" er bevaret som `operator: "±"` paa alle seks
  Galileo-filer, ligesom Boston Dynamics Spots eksisterende post. Yuejias merged "爬坡角度/DOF"-
  kolonne (kun ét tal for to felter) er IKKE gaettet - `frihedsgrader` staar `ikke_oplyst` paa alle
  fire Yuejia-filer.
- Regel 6/7 (nyttelast og trinhoejde, ikke blandet): efterproevet paa alle ti filer - Galileos
  "有效负载"/"最大负载" konsekvent gaaende/staaende, og klatreevne-feltet konsekvent enten
  `trappetrin_kontinuerlig` (连续台阶-formulering) eller `forhindring_enkelt` (高度差...高台-
  formulering), MED BEGGE udfyldt paa S1/S1-W, som er den eneste Galileo-model, hvor producenten
  selv giver begge tal i samme raekke.
- Regel 8 (driftstid + ved_last): S1 og S1-W er de eneste to Galileo-modeller med en eksplicit
  kg-lastbetingelse ("5h（20kg负载）～7.5h" hhv. "4h（20kg负载）～6h") - `ved_last: {vaerdi: 20,
  enhed: kg}` er sat KUN paa disse to, `ikke_oplyst` paa de oevrige otte filer, hvor producenten
  ikke knytter et kg-tal til driftstiden.

**Samlet taelling: N = 108 (automatisk) + ca. 60 manuelt genlaeste semantiske/strukturelle
beslutninger paa tvaers af de ti filer, M = 0 fejl fundet ved denne gennemgang.** Ingen rettelser
var noedvendige efter selv-tjekket - de faa usikkerheder, der blev fundet undervejs (E1/E1-W-
blok-tildelingen, stroem_ud-delingen), var allerede skrevet ind som `advarsel:`/`noter:` i filerne,
foer selv-tjekket blev koert, ikke som en efterfoelgende rettelse.

---

## 7. Efterproevning (byggetal)

```
node tools/validate.mjs   ->  72 fil(er) · 0 fejl · 1 advarsel (kendt, urelateret: ghost-robotics-vision-60)
node tools/build.mjs      ->  Byggede 197 sider (baseline 173, +24)
                               1037 kildebelagte tal (baseline 857, +180)
                               Kort paa forsiden: 72 (baseline 62, +10) - matcher antal datafiler
                               Sekundaere kilder: 138 felter (de 70 Galileo-tal + noter/anvendelse)
                               Taethedsnaevner: 30 (uaendret, L32)
node tests/koer.mjs       ->  195 bestaaet, 2 fejlet (baseline 195/2 - UAENDRET, ingen regression)
```

De to fejlende tests er de samme to allerede kendte, uafklarede sager
(`fund/FUND-test.md` og `fund/FUND-detalje.md`) - ingen ny fejl er tilfoejet, og ingen eksisterende
fejl er blevet vaerre.

---

## 8. Selv-review — hvad jeg er usikker paa, og hvad jeg ikke naaede

**Usikkerheder, jeg IKKE kunne fjerne, kun dokumentere:**

1. **E1/E1-W's vaerdiblok-tildeling** er indholdsbaseret (matchende formulering: "连续台阶" ->
   E1, "高度差...高台" -> E1-W), ikke positionsbaseret, fordi selve tekstudtraekket blandede
   raekkefoelgen paa netop denne side. Jeg genlaeste og bekraeftede sammenhaengen (afsnit 6), men
   det er stadig en tolkning af et layout, jeg ikke kunne se visuelt (ingen pdftoppm). Er
   tildelingen forkert, er E1 og E1-W's `续航时间`/`续航里程`/klatrefelt byttet om.
2. **`stroem_ud`-vaerdien for E1/E1-W** ("5V；12V；48V") er en analogislutning fra C1/C1-W-parrets
   identiske vaerdi, ikke en uafhaengigt bekraeftet aflaesning for netop E1-W - se afsnit 6.
3. **Nyttelast gaaende/staaende-fortolkningen** for Galileo ("有效负载" -> gaaende, "最大负载" ->
   staaende) er MIN fortolkning af producentens ordvalg, ikke producentens egne ord "gaaende"/
   "staaende". Det er en rimelig laesning (parallelt med Yuejias eksplicitte 动态/静态-split), men
   staar tydeligt som `advarsel:` paa alle seks Galileo-filer, saa den kan efterproeves eller
   omgoeres senere.
4. **Yuejias enkeltstaaende "负载"-tal** (YJ30: 10kg, YJ30 W: 12kg) er placeret i `nyttelast_gaaende`
   som et forsigtigt skoen, samme princip som Unitree Go2's eksisterende post - IKKE en aflaesning.
5. **`kildetype: sekundaer` paa Galileo er en producent-selv-udgivet PDF hostet paa en
   tredjepartsside** (WRC's udstillerprofil), ikke en tredjepart, der selv har skrevet indholdet.
   Om det er "sekundaer nok" til at kraeve maerket, eller om det burde taelle som primaer, fordi
   Galileo selv har lavet OG uploadet filen, er ikke min afgoerelse at traeffe - jeg har fulgt
   CEO'ens eksplicitte instruks (jf. L33) om at maerke den.

**Hvad jeg ikke naaede:**

- **Ingen billeder** er tilfoejet til nogen af de ti poster - eksplicit udenfor denne opgaves scope
  (billedrunde er et separat spor, jf. opgavebeskrivelsen). Kandidat-URL'er til senere billedrunde:
  Yuejia har produktbilleder direkte paa hver af de fire produktsider (`yuejialingdong.com/index.
  php/yuejiasizuxilie/{56,57,58,59}.html`, `<img>`-tags i den strukturerede parametertabel).
  Galileo-manualen har billeder indlejret som PDF-XObjects (Im0/Im1 osv. paa hver model-side) - de
  kraever samme selvbyggede PDF-udtraeksvej som teksten (billed-XObjects, ikke tekst), IKKE forsoegt
  udtrukket i denne omgang.
- **`ros2`/`sdk_sprog`/`monteringsinterface` er ikke undersoegt ud over selve manualen/produktsiderne**
  - fx om Galileo eller Yuejia har et GitHub-repo eller SDK-download-side (samme moenster som
  Genisom L1/L2's github.com/zsibot-undersoegelse) er IKKE forsoegt i denne runde. Kunne potentielt
  fylde tre af de gennemgaaende tomme felter ud, hvis en saadan kilde findes.
- **STATUS.md er IKKE opdateret** med denne runde - opgavebeskrivelsen bad specifikt om robotposter
  og en FUND-rapport, ikke en STATUS.md-redigering, og en samtidig redigering af en delt fil kunne
  kollidere med andre parallelle spor. Naevnt her, saa fravalget er synligt, ikke en forglemmelse.
- **Ingen `media/_kilder/raa-kand5-2026-08-25/`-mappe er oprettet** - se afsnit 1, ingen nye raa
  filer blev hentet til selve robotposterne.
- **Det selvbyggede PDF-udtraeksscript (afsnit 2) er ikke generaliseret til `tools/`** - det er et
  engangsvaerktoej i scratchpad, skraeddersyet til netop denne PDF's fontstruktur (CID 63153-63162
  som cifferblok). En anden PDF med en anden font ville kraeve samme undersoegelse forfra, ikke
  en direkte genbrug af scriptet.

**Hvad jeg er sikker paa:** alle 108 automatisk tjekkede taltilfaelde findes ordret i den udtrukne
kildetekst; `node tools/validate.mjs` giver 0 fejl paa alle 72 filer; `node tests/koer.mjs` viser
ingen regression (195/2, uaendret); ingen af de ti robotter bruger `arvet_fra` fejlagtigt (afsnit 5);
og "Galileo X" er en dokumenteret, citatbaeret afvisning, ikke en forglemmelse.
