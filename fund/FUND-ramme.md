# FUND — `spor/ramme`, testnr. 74: katalogets billedramme beskærer ikke længere (L78)

## Grundmåling (før ændring)
validate **77/0/1** · build **216 sider, 1111/0** · tests **1665/0** — alle tre
identiske med briefets tal.

## Valgt/fravalgt mekanisme

**Fravalgt: Option A** (briefets hovedhypotese) — `.net .billedled picture
{display:block;width:100%;height:100%}`, samme form som `.billedled--stor`
og `.saml-fotofelt`. **Målt at fejle** efter rigtig fil-ændring + frisk byg +
frisk sideindlæsning (ikke kun runtime-injektion): stadig **32/85 beskåret,
49,1 %** — uændret fra før. Reproduceret også med inline `style.setProperty
(..., 'important')` på selve `<picture>`-elementet, som heller ikke virkede.
Årsag, målt: `.net{display:grid}` har flere rækker af varierende højde;
`.billedled{display:grid;place-items:center}` gør billedet til et grid-item
med `align-items:center` (ikke stretch). I den opstilling resolver Chromium
IKKE et procent-højde-barns (`picture`) højde til den enkelte rækkes
størrelse, selvom `.billedled` selv har en definit højde (aspect-ratio:4/3).
De to eksisterende steder virker, fordi de IKKE ligger i en CSS-grid-række.

**Valgt: en tredje vej (B'), ikke briefets Option B.** `.net .billedled
{position:relative}` + `.net .billedled picture{display:block;position:
absolute;inset:0}`. Omgår grid-rækkens definithed helt: `inset:0` regner mod
`.billedled`s padding-box, ikke mod grid-tracksens størrelse. **Målt at
virke: 0/85 beskåret ved 1440 og 390 px.** Briefets Option B (flyt polstring
ud af img) blev ikke bygget separat, fordi den ikke retter mekanismen —
percenthøjden, ikke polstringen, var årsagen.

## Konfidens pr. punkt

1. **Høj** — 0/85 beskåret ved 1440 og 390 px. Kommando: `node
   maal-ramme-74.mjs http://localhost:8145/da/index.html 1440` (og 390) i
   `C:/Praktik/websites/maalevaerktoej`, isoleret Playwright. Genkørt 3 gange
   med identisk resultat. Kontrafaktisk: uden rettelsen giver samme kommando
   32/85, maxPct 49,1 — målt direkte via `git stash`/rebuild-sammenligning.
2. **Høj** — kort- og sidehøjde uændret. `node maal-hoejde-74.mjs ...` gav
   byte-identiske tal før/efter (1440: 269,86/286,13/6685 · 390:
   193,14/209,41/11653), målt med git stash på ægte for/efter-byg.
3. **Høj** — validate 77/0/1, build 216/1111/0, tests **1672/0** (1665 + 7
   nye, egne). Genkørbart: `node tools/validate.mjs`, `node tools/build.mjs`,
   `node tests/koer.mjs`. Kontrafaktisk: en forkert regel ville have givet
   72.x/74.x røde eller uændret 32/85 i test 74.
4. **Middel** — `object-fit:contain` uændret. `grep -c` gav **4**, ikke
   briefets "1" — se fælde nedenfor. `git diff --stat` viser 0 ændringer i
   `assets/system.css`, som beviser jeg ikke rørte den (høj for selve
   ejerskabskravet), men grep-tallet 4 er ikke et rent facit uden manuel
   inspektion af hvilke der er kommentarer.

## Usikkerheder
Ingen præcis spec-/Chromium-forklaring på hvorfor grid + place-items:center +
aspect-ratio-drevet højde ikke giver et "definit" barn her — kun reproducerbart
empirisk (inkl. med !important). Ikke testet i Firefox/Safari.

## Målinger
validate **77/0/1** · build **216 sider, 1111/0** · tests **1672/0** ·
beskæring 1440 px **0/85** (før 32/85, 49,1 %) · beskæring 390 px **0/85** ·
kort-/sidehøjde **uændret** · `git diff --name-only main...spor/ramme`: kun
`assets/generator.css`, `fund/BRIEF-ramme.md`, `tests/dele/74-rammebeskaering.mjs`.

## Nye fælder og opdagelser
- **Runtime-CSS-injektion (`addStyleTag`) på en allerede-loadet side gav
  INKONSISTENTE resultater** sammenlignet med en frisk fil-ændring + frisk
  byg + frisk sideload for PRÆCIS samme regel. Én kort (uden `--plade`)
  reagerede korrekt på injektion; en anden (`--plade`, i katalogets 77-kort
  grid) reagerede slet ikke, heller ikke med inline `!important`. Kun den
  ægte fil→byg→frisk-load-vej var pålidelig. **Mål aldrig en grid-relateret
  CSS-hypotese kun via runtime-injektion — byg og genindlæs.**
- **32 beskårne = nøjagtig 32 af 85 med klassen `billedled--plade`.** De 53
  øvrige kort har ALDRIG haft en fungerende `height:100%` på `<picture>`
  heller — men deres billeders naturlige (bredde-skalerede) højde er
  tilfældigvis ≤ rammens højde, så fejlen var usynlig der. `height:100%` har
  altså reelt aldrig virket for NOGEN af de 85 — kun 32 var høje nok til at
  det blev synligt som beskæring.
- **`grep -c 'object-fit:contain' assets/system.css` giver 4, ikke briefets
  "1".** De 3 ekstra er kommentarer (linje 1187, 1366, 1374), som selve
  reglen (linje 1168) er den eneste levende. Endnu et eksempel på CLAUDE.md's
  "et grep på en klasse tæller kommentarer med" — briefets tal var forkert,
  ikke mit arbejde (system.css er urørt, `git diff --stat` beviser det).

## Punkter i briefet, jeg ikke nåede
- Forslaget om at samle de nu TRE `picture`-regler (`.billedled--stor`,
  `.saml-fotofelt`, `.net .billedled`) til én er IKKE bygget, kun foreslået
  her, som briefet krævede. Bemærk: min løsning bruger en ANDEN mekanisme
  (position:absolute) end de to andre (width/height:100%), så en fælles
  regel ville kræve at de to andre også skifter mekanisme — det er en større
  systembeslutning end briefet lagde op til, og jeg har ikke vurderet om
  deres kontekst (ikke-grid) gør det unødvendigt for dem.
