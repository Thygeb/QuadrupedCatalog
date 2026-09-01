# FUND — spor/document

**Skill:** `impeccable` med argument `document` kaldt via Skill-værktøjet fra
worktreen — **lykkedes** (ingen `Unknown skill`, indhold indlæst). Læste
derudover `C:/Users/thyge/.claude/skills/impeccable/reference/document.md` fra
disk via Read-værktøjet, fordi skillens routing-tabel selv kræver, at man
indlæser den ejende reference før arbejdet — ikke en fejl-fallback. Fravalgt:
ingen andre skills passer (opgaven er udtrækning fra kode, ikke designarbejde
under DESIGNFRYS L70).

**Grundmåling (før noget blev ændret), sammenlignet med briefets tabel:**
validate 77/0/1 advarsel (match) · build 216 sider/1111 kilder/0 uden (match)
· tests 1481/0 — **kun opnået efter jeg selv byggede `dist/` uden `--ud`**;
briefets litterale kommando (`--ud=.tmp/dist-grund`) efterlader `dist/` tomt,
og 12 tests + `fund/maal-doede-klasser.mjs` fejler/crasher på det. Se "Nye
fælder" · 9 ægte døde klasser (match) · DESIGN.md 870 linjer (match).

**1. Løsning:** ny frontmatter + krop skrevet direkte fra `assets/system.css`/
`generator.css`, formen genbrugt fra den gamle fil. **Fravalgt:** at rette den
gamle fil punkt for punkt — umuligt, fordi paletten er en anden generation
(ORBIT vs. TYPESKILT), ikke bare forkerte tal.

**2. Konfidens:**
- **Høj** — 16 af 16 farver stemmer: `node fund/maal-designmd.mjs` →
  `VAERDIER DER STEMMER: 16 af 16`. Var arbejdet forkert, ville tallet være
  under 16 (bekræftet: en deliberat corrumperet test gav 15 af 16).
- **Høj** — testen 58 låser resultatet og blev set fejle to måder først
  (corrupt farve → 58.2 FEJL; fjernet frontmatter → 58.1+58.2 FEJL), derefter
  genskrevet korrekt → `node tests/koer.mjs` giver **1487 bestået, 0 fejlet**.
- **Høj** — konfliktkontrol: `sed -n '/^## Konflikter/,/^## /p' DESIGN.md |
  grep -c 'nulstil\|4:3\|#E8EBED\|Manrope'` → **6** (krav ≥4).
- **Høj** — knap-sidetal: skrevet Node-script over `dist/` gav **146**
  sider med `.videre` (2 rene + 144 med `.videre--stille`), **2** med
  `.nulstil` — matcher briefets 146/144/2 præcist.
- **Middel** — typografi/spacing/component-værdier i frontmatter (32+3+11+42
  = 88 værdier ud over farverne) er læst direkte af de tilsvarende CSS-regler,
  men ikke efterprøvet med et automatisk script som farverne.
- **Middel** — kontrastberegningerne i Farver/Konflikter er regnet med WCAG's
  egen formel i et lille Node-script (ikke bare aflæst), og krydstjekket mod
  kildens egne tal (`blaek`-på-`accent` = 9,19, matchede præcist) — men ikke
  kørt gennem et uafhængigt bibliotek.
- **Lav** — "3 engangsknapper" (briefets tal) er ikke navngivet enkeltvis;
  jeg fandt kandidater (`.valg__fjern` m.fl.) uden at bekræfte antallet 3.

**3. Usikkerheder:** hvorvidt `## Konflikter` som ekstra, ikke-kanonisk
niende sektion (efter Do's/Don'ts) er den rette placering — spec'en tillader
det ("Unknown sections are preserved"), og den gamle fil havde selv en
tilsvarende hale, men jeg er ikke sikker på, at led 2 forventer den der.

**4. Målinger:** validate 77/0/1 · build 216/1111/0 · linktjek 0 døde ·
tests **1487/0** (var 1481, +6 fra test 58) · `git status --short` viser kun
`DESIGN.md` og `tests/dele/58-designmd.mjs` · DESIGN.md nu **593 linjer**
(var 870).

---

## Nye fælder og opdagelser

- **Briefets grundmåling-kommando bygger IKKE den `dist/` mappe, testene
  faktisk læser.** `node tools/build.mjs --ud=.tmp/dist-grund` lader
  `dist/` stå tom; `tests/dele/24-flade.mjs`, `27-kildeloefte.mjs` og
  `35-typeskilt-katalog.mjs` peger alle hårdkodet på `path.join(rod,'dist')`.
  Uden et ekstra `node tools/build.mjs` (uden `--ud`) fejler 12 tests og
  `fund/maal-doede-klasser.mjs` crasher med `ENOENT`. Værd at rette i
  fremtidige briefer.
- **Briefets tal "21 variabler" i `:root` er forkert — målt til 37**, ikke
  21 (16 farver + 3 skrifter + 9 r-trin + kant + maal + 3 rund + 2 skygge +
  2 bevægelse). Jeg brugte det MÅLTE tal (37), ikke briefets, jf.
  arbejdsgangens D7/L30-regel.
- **`--mono` bruges 62 gange, ikke 67** (talt med `grep -o "var(--mono)"`,
  ikke linjer — en linje-optælling ville overtælle).
- **`--sans` (Manrope) er ikke kun "3 eksplicitte regler" — den er sidens
  ARVE-STANDARD.** `body`, `h1`–`h4`, `.t-hero/.t-h1/.t-h2/.t-h3`,
  `.kort__navn` og `.typeskilt .robot-navn h1` (robotnavnets egen H1)
  sætter INGEN af dem deres egen `font-family` og arver derfor `--sans` —
  dvs. langt de fleste overskrifter og meget løbende tekst på sitet
  rammes i dag af en font uden fil. Kildens egen kommentar ved `.daek`
  siger det: *"sidens [skrift] er stadig --sans"*, ventende på en "runde 2".
- **`--accent` som forgrundsfarve fejler WCAG AA hårdt**: 1,38:1 mod bund,
  1,60:1 mod panel (krav 4,5:1) — men bruges alligevel i `a{color:
  var(--accent)}` (ALLE links), `.kildemaerke` og `.videre--stille`. Dette
  bekræfter CLAUDE.md's L70-fund uafhængigt (jeg regnede selv, fik samme
  1,38).
- **`--hegn` som betydningsbærende kant fejler WCAG 1.4.11**: 2,14–2,47:1
  mod kravet på 3,0:1 — en regression fra ORBIT (der klarede 3,32–3,68).
- **To radius-sprog lever side om side**: den tokeniserede 6/8/12-skala og
  en hårdkodet, ikke-tokeniseret 2px "stansning" (26 forekomster, talt).
- **`.stribe--kompakt`** (katalogkortets tidligere kompakte nøgletalsstribe,
  som ORBIT-udgaven af DESIGN.md beskrev udførligt) er en af de 9 kendte,
  beskyttede døde CSS-klasser fra `spor/doedcss` — 0 elementer i `dist/`
  bruger den i dag. Rørte den ikke, beskrev den blot som død.
- Forsiden (hero/yderpunkter/EU-fundet/formålsfilter) er **helt slettet**
  (L72, 1. sep) — `dist/da/index.html` er nu selve katalogsiden (0
  forekomster af "hero"). Den gamle DESIGN.md brugte ~250 linjer på disse
  komponenter som levende.

## Punkter i briefet, jeg ikke nåede

- **De "3 engangsknapper"** i knap-konflikten er ikke navngivet enkeltvis —
  jeg fandt kandidater (`.valg__fjern`, `.saml-taeller__gaa/__ryd`) uden at
  bekræfte det præcise antal eller om de er "engangs" i briefets forstand.
  Skrevet ind i DESIGN.md som en åben usikkerhed, ikke som et facit.
- **`.impeccable/design.json`-sidecaren**, som `document`-referencen beder om
  at regenerere sammen med DESIGN.md, er IKKE skrevet — den ligger uden for
  min filejerskab (briefets afsnit 4 nævner kun DESIGN.md, FUND-document.md,
  testfilen). Nævnes her, så det ikke forveksles med en forglemmelse.

## Konflikter jeg fandt, som ikke stod i briefet

1. **`--accent` som tekstfarve fejler WCAG AA** (1,38–1,60:1 mod krav 4,5:1),
   brugt i alle links, kildemærker og `.videre--stille`. Bekræfter L70 i
   CLAUDE.md uafhængigt.
2. **`--hegn` som betydningsbærende kant fejler WCAG 1.4.11** (2,14–2,47:1
   mod krav 3,0:1) — en regression fra ORBIT.
3. **To radius-systemer**: tokeniseret 6/8/12-skala vs. hårdkodet 2px
   "stansning" (26 forekomster), ingen regel for hvornår hvilken bruges.
4. **To kort-rammer i to filer**: `.kort`s grundregel (kant+radius+skygge)
   vs. `.net .kort` (katalogsiden), som nulstiller alle tre til 0/none.
5. *(Udvidelse af briefets egen konflikt 4, ikke helt ny):* `--sans` er ikke
   kun "3 regler" — den er sidens arve-standard for stort set alle
   overskrifter og meget brødtekst, inklusive robotnavnets H1.
