# FUND — L32 implementeret: EU-kolonnen, tre af fire felter droppet

Udført 24. august 2026 i worktreen `udstilling-wt-l32`, gren `spor/l32`. Implementerer
den LÅSTE beslutning L32 i STATUS.md: `eu_tilgaengelig`, `eu_service` og `leveringstid`
fjernes fra skemaet og alle robotposter. `ce_oplyst` består. Nævneren i
specifikationstætheden går fra 33 til 30.

---

## Regel 0 — skill-vurdering

Skills registreres ved sessionsstart, og denne session kunne ikke kalde
`.claude/skills/robotdata` eller `.claude/skills/parallelt` ved navn — de blev **læst
fra disk** i stedet, som instrueret i briefen.

| Skill | Valg | Begrundelse |
|---|---|---|
| **`robotdata`** (`.claude/skills/robotdata/SKILL.md`) | **Læst fra disk og fulgt** | Bærer 33-feltsskemaet (nu 30), reglen om at nævneren udledes af `FELTNAVNE.length` og aldrig skrives som et tal, og selv-tjekket med tælling. Selve skillens egen tekst var én af filerne, der skulle rettes (33 → 30 hvor skemaet omtales) — den er både redskab og genstand her |
| **`parallelt`** (`.claude/skills/parallelt/SKILL.md`) | **Læst fra disk, men opgaven kørt som ét spor** | Worktree og gren var allerede oprettet af orkestratoren (`udstilling-wt-l32` / `spor/l32`), så opsætningsdelen af skillen var ikke min at gøre. Selve arbejdet — skema, skabeloner, 55 datafiler, i18n, metode, docs, tests — hænger sammen i én kæde (skabelonerne kan ikke rettes før skemaet er ændret, testen kan ikke vendes før metode.md siger 30, rapporten kan ikke skrives før alt andet er efterprøvet), og alle spor skriver i den samme lille filmængde. To agenter ville have skrevet oven i hinanden eller ventet på hinanden — hverken parallelt eller hurtigere |
| `impeccable`, `ui-ux-critique`, `critique` | Gik forbi | Ingen flade ændrer udseende ud over at én tabel bliver til én sætning på 12 sider — det er en direkte konsekvens af at et felt forsvinder fra skemaet, ikke en designbeslutning der skal vurderes for sig |
| `dataviz` | Gik forbi | Ingen graf eller diagram involveret |
| `code-review`, `simplify` | Gik forbi | Opgaven var en navngiven, låst beslutning der skulle udføres og efterprøves, ikke en åben vurdering af kodekvalitet |
| `grillmig` | Gik forbi | Beslutningen var allerede grillet og låst af JPK 24. aug 2026 (se STATUS.md L32: "Grillingens anbefaling var at parkere og probe først; JPK valgte drop med prisen på bordet") — grilningen hører til FØR L32 blev låst, ikke i implementeringen af den |

---

## Hvad blev fjernet

**Kode:**
- `tools/skema.mjs` — de tre feltdefinitioner fjernet fra `FELTER` (`ce_oplyst` bevaret,
  stadig i gruppen `'eu'`); `eu_tilgaengelig` fjernet fra `FILTER_FELTER`.
  `GRUPPER`-listen er urørt — `'eu'` har stadig et hjem, nu alene på `ce_oplyst`.
  Lineage-kommentaren ved `NAEVNER` fik en ny linje for L32, og en anden stedfunden
  "33 → 34"-hypotese i `anvendelse`-dokumentationen blev rettet til "30 → 31" (den var
  en live, nutidig påstand — ikke historik — og var blevet forkert af mit eget skift).
- `tools/skabelon/robot.mjs` — `EU_FELTER` trimmet til `['ce_oplyst']`; JSDoc over
  `euBlok()` opdateret. Blokken viser nu én række i stedet for fire, men beholder sin
  form (samme `.eu-blok`/`.raekker`-markup) — ingen redesign, kun data-drevet skrump.
- `tools/skabelon/producent.mjs` — `EU_FELTER` trimmet til `['ce_oplyst']` og **brugt**
  (ikke efterladt død): `ceOpgoerelse()` slår nu op via `EU_FELTER[0]` i stedet for at
  hardkode strengen to steder. `euKolonne()` (tabellen, fire felter × N modeller) er
  omdøbt og omskrevet til `euSaetning()` — én sætning pr. producentside, beregnet af
  `ceOpgoerelse()` og genbruger forsidens `eu_titel` / `forside_eu_tal` /
  `forside_eu_paastand`-nøgler og `.eu-fund-linje`/`.eu-fund-tal`-CSS-klasser i stedet
  for at opfinde en producent-specifik variant.
- `tests/koer.mjs` — linje 574 vendt: `'skemaet har 30 feltnoegler'`, `=== 30`.
  Kommentaren ved linje 609: `33/33` → `30/30`. Ingen test slettet.

**Data (55 filer i `data/robots/`, 3 filer i `tests/eksempel-robotter/`):** de tre linjer
`eu_tilgaengelig:`, `eu_service:`, `leveringstid:` fjernet fra hver fil. `ce_oplyst`
urørt i alle 58 filer.

**i18n (`data/i18n/da.json` + `en.json`, identisk i begge):**
- `felt_eu_tilgaengelig`, `felt_eu_service`, `felt_leveringstid` — kun brugt til de tre
  fjernede felter.
- `eu_tilgaengelig_ja`, `eu_tilgaengelig_nej` — navngivet efter det fjernede felt, og
  **allerede 0 steder brugt før L32** (grep i `tools/` gav ingen kaldesteder — `jaNej()`
  i `side.mjs` bruger altid det generiske `T.ja`/`tilstand_nej`, aldrig en feltspecifik
  nøgle). Dobbelt begrundet fjernelse.
- `eu_kolonne_titel`, `eu_kolonne_forklaring`, `eu_kolonne_tom`, `eu_ce_ingen`,
  `eu_ce_nogle` — **ud over den strengt fortolkede brief.** Disse fandtes for hele
  EU-*tabellen* (alle fire felter i én matrix), ikke kun for de tre fjernede felter i
  isolation. Da producentsidens tabel blev erstattet af én sætning (krævet af briefens
  punkt 2), blev disse nøgler reelt ubrugte. Jeg fjernede dem for at undgå at efterlade
  dødt i18n i en fil, hvor projektets egen konvention (se skema.mjs' note om den fjernede
  `silhuet`-nøgle) er at fjerne nøgler med nul brugere frem for at lade dem ligge. **Flag
  til gennemsyn:** dette er en fortolkning af "fjern nøgler der KUN fandtes for de tre
  felter" — de fandtes teknisk for *tabellen*, ikke kun for de tre felter isoleret.
  Efterprøvet med grep efter hver sletning: 0 kaldesteder tilbage i `tools/`, `tests/`,
  `indhold/`.
- `eu_titel`, `eu_forklaring`, `eu_ce_ja`, `eu_ce_nej`, `eu_ce_ikke_oplyst`, `eu_pointe`,
  `forside_eu_tal`, `forside_eu_paastand`, `felt_ce_oplyst` — **beholdt.** `eu_forklaring`
  fik sin ORDLYD rettet (nævnte tidligere "CE og tilgængelighed i EU"; nævner nu kun CE),
  fordi den stadig er i brug på robotsidens EU-blok og ellers ville tale om et felt, der
  ikke findes mere.
- Efter alle rettelser: da.json og en.json har **246 nøgler hver, 100 % parret** (0
  nøgler kun i den ene fil) — efterprøvet med et Node-script, ikke skønnet.

**Dokumentation:**
- `indhold/metode.md` — formlen `÷ 33` → `÷ 30`, feltlisten EU (4) → EU (1), ny
  rettelsesnote for 24. aug 2026 (samme stil som den eksisterende 21.-aug-note, ikke
  overskrevet). To illustrative tæthedstal i brødteksten (Xiaomi CyberDog 2 "17 af 33
  felter", ANYbotics ANYmal X "4 af 33 felter, 12 %") blev **genmålt, ikke kun
  omregnet** — se afsnittet *Genmåling* nedenfor.
- `.claude/skills/robotdata/SKILL.md` — frontmatter, feltliste og tæthedsformel rettet.
  Kalibreringstabellen ("Ligger en ny post markant over 67 %...") var **dobbelt stale**
  (både nævner 33→30 og datasæt 46→55 poster siden 21. aug) — se *Genmåling* nedenfor
  for hvorfor jeg gik ud over den bogstavelige "ret 33 til 30".
- `DATAMODEL.md` — samme mønster: "33 felter" → "30 felter", EU (4) → EU (1),
  `14+5+6+3+1+4=33` → `14+5+6+3+1+1=30`, ny rettelsesnote i samme stil som L30-noten
  der allerede stod der.

---

## Kildebelagte værdier, der ville være gået tabt (punkt 3 i briefen)

**Ingen.** Efterprøvet med et Node-script, der læser hver af de 55 YAML-filers rå tekst
linje for linje og leder efter `eu_tilgaengelig:`, `eu_service:` og `leveringstid:` i
enten skalarform eller blokform (nøgle efterfulgt af indrykkede `vaerdi:`/`kilde:`-linjer):

```
node scratch-check-l32.mjs   # midlertidigt script, slettet igen efter kørsel
→ Total non-scalar-ikke_oplyst findings: 0
```

Alle 55 × 3 = 165 forekomster var skalaren `ikke_oplyst`, uden undtagelse — ingen
`vaerdi:`/`kilde:`/`hentet:`-blok at miste. Det stemmer med STATUS.md L32's eget
grundlag ("0 af 46 robotter" — kataloget er vokset til 55 siden beslutningen blev
skrevet, men konklusionen holder på det fulde, nuværende datasæt). Der er derfor **ingen
tabel at vise** — det er selve fundet, ikke et udeladt punkt.

---

## Genmåling ud over den bogstavelige brief

To steder gik jeg fra en ren streng-substitution (33 → 30) til en faktisk genmåling,
fordi den mekaniske oversættelse ville have efterladt tal, der var forkerte på en anden
led:

1. **`indhold/metode.md`, to illustrative tæthedstal.** "17 af 33 felter" (CyberDog 2) og
   "4 af 33 felter, 12 %" (ANYmal X) står lige ved siden af den formel, jeg netop rettede
   til `÷ 30` — at lade dem stå med `33` ville skabe en selvmodsigelse i samme afsnit.
   Jeg beviste først, at tælleren (udfyldte felter) er **uændret** for enhver robot, fordi
   alle 55 poster havde alle tre fjernede felter som `ikke_oplyst` — kun nævneren
   flytter. Derefter kørte jeg `tools/validate.mjs`s egen `taethed()`-funktion direkte
   mod de to robotters faktiske, nuværende data: CyberDog 2 = 17/30 (uændret tæller,
   bekræftet), ANYmal X = 4/30 = 13 % (uændret tæller, procenten stiger fra 12 til 13).
   "Katalogets midterste post har 13" var allerede korrekt og krævede ingen rettelse —
   efterprøvet med samme script (median-tæller er også nævner-uafhængig).
2. **`.claude/skills/robotdata/SKILL.md`, kalibreringstabellen.** Denne er en **operativ**
   tabel, fremtidige data-agenter bruger til at vurdere, om en ny posts tæthed er
   mistænkeligt høj. Ved genmålingen fandt jeg, at kataloget er vokset fra 46 til 55
   poster siden 21. aug, og at den navngivne "højeste" (Ghost Vision 60, 67 %) **ikke
   længere er højest** — Genisom Gangben L2 ligger nu på 77 %, MOVENEW P1 på 73 %. Havde
   jeg kun oversat 67 % → et nyt tal på nævner 30, ville tabellen stadig pege forkert
   (guiden ville flagge en ægte, korrekt indtastet post som mistænkelig). Jeg genmålte
   direkte med `validate.mjs`s `taethed()` mod alle 55 aktuelle filer og skrev et nyt,
   dateret afsnit (24. aug, 55 poster, nævner 30) — og bevarede de to gamle snapshots
   (21. aug/33/46 og 19. aug/29) som citatblokke, samme mønster filen selv allerede
   brugte til den forrige overgang (CLAUDE.md: "ret assertions, slet dem ikke").

Dette er en fortolkning ud over ordlyden "ret 33 til 30" — flagges her til gennemsyn.
Alt andet (feltlister, formler, EU(4)→EU(1)) er den bogstavelige oversættelse, briefen
bad om.

---

## Ikke rørt, som instrueret

- `tools/taethed-unitree.mjs` — indeholder `'tilgaengelig_eu'`, `'servicepunkt_eu'` og
  `'leveringstid'` (før-omdøbnings-feltnavne, delvis anderledes stavet end de nuværende).
  Gammelt engangsscript, eksplicit undtaget i briefen. Urørt.
- `fund/` (bortset fra denne fil), `KRITIK-1-plan.md`, `PLAN.md`, `PRODUCT.md`,
  `STATUS.md`, `DESIGN.md`, `prototype/`, `indhold/RETTELSER.md` — urørt, efterprøvet
  med `git status --short | grep` (0 træf).
- `ce_oplyst` — rørt ingen steder ud over at blive **bevaret** ordret i alle 58 datafiler
  og alle skabeloner. Ingen kilde, `hentet`-dato eller `advarsel:` på et `ce_oplyst`-felt
  er ændret.

**DESIGN.md — forældede linjer, ikke rettet (senere dokumentationsrunde, som instrueret):**
- Linje 403–409: "EU-fundet"-afsnittet siger *"målt 24. aug 2026, at kun 2 af 46
  robotter..."* — tallet **46** er nu forældet (kataloget har 55 poster); selve
  forholdet (2 med `ce_oplyst: true`) er stadig korrekt og bekræftet i det byggede output
  (`dist/da/index.html`: "2 af 55"). Linjerne *"de tre øvrige EU-felter... fjernes fra
  skemaet i et senere spor og indgår ikke her"* er skrevet i FREMTID — det spor er nu
  netop gennemført, så formuleringen bør ændres til datid.
- Linje 713–715: samme mønster i changelog-afsnittet — *"læser udelukkende `ce_oplyst`
  (CEO, 24. aug, L32 STATUS.md — de tre andre EU-felter forlader skemaet i et senere
  spor)"* bør nu sige, at det spor er afsluttet.

---

## Efterprøvning (obligatorisk, med tælling)

**Grep, tre feltnavne over hele kildetræet:**
```
grep -rn "eu_tilgaengelig\|eu_service\|leveringstid" data/ tools/ tests/ assets/ indhold/
```
→ 9 træf tilbage, ALLE i tre kategorier, ingen af dem et brud:
  - 7 i mine egne forklarende lineage-/JSDoc-kommentarer (`tools/skema.mjs` ×2,
    `tools/skabelon/robot.mjs` ×2, `tools/skabelon/producent.mjs` ×2, `indhold/metode.md`
    ×2 — navngiver de fjernede felter for at dokumentere HVORFOR de er væk)
  - 1 i `tools/taethed-unitree.mjs` (eksplicit undtaget)
  - 1 i `indhold/RETTELSER.md` (eksplicit undtaget, egen ældre korrektionsrunde)
  - 0 i faktisk kaldt/eksekveret kode eller data uden for disse to undtagne filer.

**`node tools/validate.mjs`** → `55 fil(er) · 0 fejl · 1 advarsler`. Den ene advarsel
(Ghost Vision 60, R9, metrisk/imperial-afvigelse på hastighed) er urelateret til L32 og
fandtes før denne opgave.

**`node tools/build.mjs`** → `Byggede 155 sider.` `Taethedsnaevnere brugt: 30`.
`Kildemaerker: 739 tal med kilde, 0 uden.` Ingen `manglendeNoegler`-advarsel udskrevet —
dvs. ingen skabelon slår en fjernet i18n-nøgle op.

**`node tests/koer.mjs`** → **195 bestået, 2 fejlet** — nøjagtig udgangspunktet, ingen
regression. De to kendte røde (interval-midtpunkt, L27-rækkefølge) er uændrede og
usporet til denne opgave (`fund/FUND-test.md`, `fund/FUND-detalje.md`). Sektion 3b
("Naevneren (D7 / L30)") — kernen i denne opgave — består alle 7 delprøver, inklusive
"metode.md udgiver SAMME naevner som koden regner med".

**Bygget output, læst med øjnene (ikke kun grepet):**
- `dist/da/index.html` — EU-fundet: `<b class="eu-fund-tal">2 af 55</b><span>robotter i
  kataloget oplyser CE-mærkning fra producenten.</span>` — uændret sætning, opdateret tal.
- `dist/da/producenter/unitree-robotics/index.html` — EU-tabellen er væk. I dens sted:
  `<section class="sektion" aria-labelledby="eu-h"><h2>EU</h2><p class="eu-fund-linje">
  <b class="eu-fund-tal">0 af 13</b><span>robotter i kataloget oplyser CE-mærkning fra
  producenten.</span></p></section>` — ingen `<table>`, intet `eu-tabel`-element,
  bekræftet med grep over hele `dist/` (0 træf på `eu-tabel`/`tabelrum`/`eu-kolonne` i
  noget `.html`, kun i de urørte CSS-filer, hvor klasserne nu er ubrugte, men harmløse).
- `dist/da/robotter/unitree-b2/index.html` — EU-blokken viser nøjagtigt én række (`CE
  oplyst: ikke oplyst`), samme markup-form som før, forklaringsteksten nævner kun CE.
  Den sammenklappede "fulde skema"-sektion (`skema()`-funktionen, som er 100 % afledt af
  `skema.mjs` og aldrig rørt direkte) viste automatisk også kun én EU-række — bevis for,
  at "sandheden er skema.mjs" faktisk holder i praksis, ikke kun i kommentaren.

**Felt-for-felt-efterprøvning af datafilerne:** alle 55 `data/robots/*.yaml` + 3
`tests/eksempel-robotter/*.yaml` = 58 filer, alle 3 felter hver = **174 forekomster
efterprøvet, 0 fejl** (0 blokformer, 0 andre tilstande end `ikke_oplyst`, `ce_oplyst`
urørt i alle 58). Diff'et er minimalt: `git diff --stat` viser præcis 3 linjer fjernet
pr. datafil, intet andet rørt i nogen af dem.

---

## Selv-review

**Tælling:** 67 filer rørt (55 robotdata + 3 testfixtures + 9 kode-/i18n-/dokumentfiler:
`skema.mjs`, `robot.mjs`, `producent.mjs`, `koer.mjs`, `da.json`, `en.json`, `metode.md`,
`SKILL.md`, `DATAMODEL.md`). 174 forekomster af de tre feltnavne fjernet fra data (165 i
de 55 robotfiler + 9 i de 3 fixtures, som forudsagt i briefen). 10 i18n-nøgler fjernet (3
strengt felt-specifikke, 2 allerede-døde `_ja`/`_nej`-varianter, 5 tabel-specifikke ud
over den strenge fortolkning — se flag ovenfor). 1 test-assertion vendt (linje 574), 1
kommentar rettet (linje 609). 0 tests slettet. 30 felter efterprøvet mod `skema.mjs`
direkte (`FELTNAVNE.length === 30`, bekræftet af testen selv).

**Hvad jeg er usikker på:**
1. **De fem `eu_kolonne_*`/`eu_ce_ingen`/`eu_ce_nogle`-nøgler.** Jeg fjernede dem, fordi
   de blev reelt ubrugte som en KONSEKVENS af at erstatte producentsidens tabel med én
   sætning (krævet eksplicit af briefen), ikke fordi de var "kun for de tre felter" i
   isoleret forstand — de dækkede hele fire-felts-matrixen. Det er den fortolkning, jeg
   er mindst sikker på holder præcis den grænse, briefen trak. Hvis den er for bred, er
   rettelsen billig: tilføj de fem nøgler igen, de bruges bare ikke af nogen skabelon.
2. **Genmålingen i SKILL.md og metode.md** går ud over en ren "33 → 30"-substitution.
   Jeg besluttede at gøre det, fordi en mekanisk oversættelse ville have efterladt et
   kalibreringsværktøj (SKILL.md), der pegede forkert på ægte data — men det er mere
   arbejde end en streng læsning af briefen bad om, og en anden læser kunne rimeligt
   mene, at kun formlen og feltlisten skulle rettes, og at kalibreringstabellens
   forældelse (som reelt skyldes kataloget vækst fra 46→55 poster, IKKE L32 i sig selv)
   hører til en anden, separat opgave.
3. **`producent.mjs`s `EU_FELTER`-konstant** endte med at blive et array med ét element,
   der rent faktisk bruges (`EU_FELTER[0]` i `ceOpgoerelse()`) — jeg overvejede at fjerne
   konstanten helt, da tabellen forsvandt, men briefen navngav linjen eksplicit som en af
   dem der skulle "trimmes", så jeg beholdt den og fandt en ægte brug til den i stedet
   for at lade den stå ubrugt.
4. **DATAMODEL.md's og SKILL.md's nye "Rettet 24. aug 2026"-blokke** er skrevet i samme
   stil som de eksisterende L30-noter, men jeg har ikke bedt nogen bekræfte, at den stil
   er den rigtige for en L32-note specifikt — det er min efterligning af et eksisterende
   mønster, ikke en bekræftet konvention for netop denne slags rettelse.

**Hvad jeg sprang over:** en fuld gennemgang af `assets/*.css` for døde
`.eu-tabel`/`.tabelrum`/`.eu-tom`/`.eu-kolonne`-relaterede regler, der nu er ubrugte
efter producentsidens tabel forsvandt. De er harmløse (ingen HTML refererer dem længere,
bekræftet ovenfor), men jeg har ikke fjernet dem — CSS-oprydning stod ikke i briefens
filliste, og at gætte på, hvilke regler der er sikre at fjerne uden at bryde en anden
klasse med samme navn, hører bedre hjemme i en dedikeret CSS-gennemgang.
