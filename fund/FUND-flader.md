# FUND — `spor/flader`: syv impeccable-pas over alle fem flader

## Hvad der er ændret på skærmen

| # | Flade (MODE) | Element | Før | Efter |
|---|---|---|---|---|
| 1 | alle | rå px-afstande i CSS | **78** | **9** (6 i kode, 3 i kommentarer) |
| 1 | alle | `--r`-skalaen | 9 trin, 4 px granularitet | **13 trin**, 2 px fra 2–16 px |
| 2 | alle | skriftgrader (`--fs-`) | **21** | **20** (`--fs-display-tal` slettet) |
| 3 | Operate | søgefeltets ramme | `--hegn` **2,47 : 1** | `--hegn-baerende` **3,96 : 1** |
| 3 | Operate | enhedskontaktens spor | `--hegn` **2,14 : 1** | `--hegn-baerende` **3,43 : 1** |
| 4 | katalog (Operate) | sorteringsknapper | **32 px** høje, kant 1,56 : 1 | **44 px**, kant **3,96 : 1** |
| 5 | — | (ingen visuel ændring) | test 36.4 rød | 6 røde igen |
| 6 | katalog (Operate) | facetrækker (filtrene) | **34 px** høje | **44 px** (36 synlige, 0 under) |

Ingen ændring i farvepalet, skrifter, æra eller layoutstruktur. TYPESKILT står urørt.

## Acceptkriterierne

| AK | Krav | Resultat |
|---|---|---|
| 1 | 78 rå px ned til ≤ 10 | **9** ✔ · hver overlevende begrundet nedenfor |
| 2 | ≤ 21 `--fs-`-trin + opgørelse pr. flade | **20** ✔ · opgørelsen står i pas 2's commit |
| 3 | hver farveændring som `<fg> på <bg> = <tal>:1` | ✔ · 4 par, alle med kommando |
| 4 | hver flade præcis én af bolder/quieter | ✔ · 2 bolder, 3 quieter, ingen fik begge |
| 5 | ≥ 1817 beståede, præcis samme 6 røde | **1848 / 6** ✔ · de 6 er ordret de samme |
| 6 | `.v-nul`/`.v-nej`/`.v-ikke` visuelt forskellige | ✔ · opstillet før OG efter, 7 akser |

## De seks overlevende rå px (AK1)

`padding:1px` (5 steder) · `margin-bottom:1px` · `margin-top:1px` · `margin-left:1px`
— hårlinjer og optiske korrektioner under skalaens gulv.
`padding:9px` — `.sog input`, **målt** til at ramme 44 px-berøringsgulvet præcis.
`padding:2px` — `.stribe--kompakt .v-ikke`, hvis `2px 6px 3px` er en optisk
korrektion på en **datatilstands-chip** og derfor ikke røres.
De tre øvrige af de 9 står i **kommentarer**, ikke i kode.

## AK6 — de tre kritiske tilstande, målt i browseren før og efter

| | `.v-nul` | `.v-nej` | `.v-ikke` |
|---|---|---|---|
| grad | 17 px | 10,5 px | 11 px |
| vægt | 400 | 700 | 500 |
| versaler | nej | **JA** | nej |
| farve | `--blaek` | `--blaek` | `--blaek3` |
| flade | ingen | ingen | `--tom` |
| kant | ingen | ingen | **stiplet** |
| mærke 9×9 | **intet** | **udfyldt** | **stiplet** |

Syv akser. **Alle syv er identiske før og efter alle syv pas.** Målt på 8
kombinationer (2 bredder × 2 sprog × 2 flader): **0 kollisioner** mellem to
forskellige tilstande. `.v-nul` ligner `.v-tal` med vilje — DESIGN.md: *"NUL —
ET TAL."*

## Konfidens

| Punkt | Niveau | Bevis |
|---|---|---|
| AK1, AK2 | **høj** | genkørbart grep; var arbejdet forkert, ville tallene være 78 og 21 |
| AK3 kontrast | **høj** | apparatet valideret mod to kendte svar (12,72 og 4,48) før brug |
| AK5 tests | **høj** | `node tests/koer.mjs` → 1848/6; en syvende rød ville have vist sig |
| AK6 | **høj** | computed styles før/efter; sabotage-kørsel gav 5 og 2 røde |
| AK4 quieter = 0 ændringer | **middel** | målt mod DP3 og kontrast, men "ingen støj" er delvis en dom |
| producentsidens 31 % krom | **lav** | observeret, ikke afgjort |

## Usikkerheder

- **`quieter` gav nul ændringer på alle tre Read-flader.** Jeg mener det er
  rigtigt — DP3 bestås med 60–91 %, kontrasten er ren, og det eneste, der
  reelt var at dæmpe, var datatilstandene. Men det er en dom, ikke en måling.
- **Halvtrinnene `--r1h`/`--r2h`/`--r3h` er mit valg.** Briefet forbød "nye
  tokens uden for `--r`-skalaen". Jeg læser halvtrin som *inden i* skalaen
  (samme familie, samme aritmetik, de ni gamle urørte). Er den læsning forkert,
  er pas 1 det, der skal om — ikke resten.
- **Jeg har ikke kørt `impeccable`s `detect.mjs`.** Briefet dokumenterer, at
  den kører stille degraderet her (2 af 13 fund, nul CSS-regler). Jeg målte
  selv i browseren i stedet.
- `.enhedsskift` i topbaren står på 36 px. Bevidst sat af et andet spor
  ("strammet til dækkets lavere rækkehøjde"), så jeg meldte frem for at rette.

## Nye fælder og opdagelser

1. **Metrikken "78" var tre ting på én gang.** Den er whitespace-følsom
   (`padding: 10px` ≠ `padding:10px` → 19 dubletter), den tæller kun
   **første** værdi i en shorthand, og **den tæller kommentarer**. 78 rå =
   59 normaliseret = 19 forskellige tal = 13 reelle forekomster i kode.
2. **En CSS-kommentar, der citerer `selektor{…}`, kan knække en test — og
   værre: holde den falsk grøn.** Min pas-2-kommentar fik test 36.4 til at
   melde rødt på en korrekt regel, fordi testen tager *første* regex-træf på
   den rå fil. Samme kommentar indeholdt `.t-hero{…font-weight:700}`, som
   **matcher test 40's mønster** — testen ville have bestået uanset koden.
   Ført som **punkt 10 i DESIGN.md's `## Konflikter`**.
3. **`--rille` er IKKE en fejl — jeg tog fejl i pas 1's commit-besked.** Der
   står, at den bruges 2 gange og aldrig defineres. Begge forekomster er i
   **kommentarer**, som selv siger *"de findes ikke her"*. Rettelsen står her,
   fordi commit-beskeden ikke kan ændres.
4. **En var() kan ikke negeres med et bart minus.** Mit eget patch lavede
   `margin:0 -var(--r2)` — ugyldig CSS, der fejler **tavst**. Fanget i diffen,
   nu vogtet af test 82.4. `.rk__mrk`s `-7px` **ophæver** dens egen 7px
   padding, så de to skal flytte sig sammen.
5. **DESIGN.md's frontmatter var forældet for 5 af 21 skriftgrader** — og de
   var det **før** mit spor (målt mod main's egen `system.css`: 16 stemte, 5
   ikke). `--fs-robot` stod 54 px, den er 84. Rettet i commit 8.
6. **Under 44 px er ikke automatisk en fejl.** Fire elementer løser målet med
   `::after` eller en touch-media-query. `.rk__mrk` havde ingen af udvejene.
   Tabellen står nu i DESIGN.md, så næste spor ikke "retter" en løsning.
7. **`validate.mjs` henter nu fra databasen**, ikke fra YAML. Briefets
   grundmåling forudsatte det ikke, og `.env` var ikke nævnt blandt de
   gitignorerede filer, worktreen skal have. Uden den fejler kommandoen før
   den måler noget.
8. **`node.exe` kan ikke ESM-importere en bar `C:/`-sti** — den kræver
   `file:///C:/…`. Ny variant af den kendte MSYS/Windows-sti-fælde.

## Punkter i briefet, jeg ikke nåede

- **`impeccable document` blev ikke kaldt.** Jeg opdaterede DESIGN.md i hånden
  (commit 8), fordi kommandoen genererer filen fra koden og ville have
  overskrevet 1.628 linjers besluttet historik — filen advarer selv imod at
  slette løste konflikter. Målrettede redigeringer i stedet; sagt her, så det
  ikke forveksles med at kommandoen kørte.
- **`design`-skillens afsnitskort er nu forældet** af mine egne DESIGN.md-
  ændringer (Farver 428, Typografi 656, Komponenter 981, Konflikter 1374; filen
  er 1.628 linjer). Jeg ejer ikke `.claude/`, så kortet er **ikke** rettet.
- **Skærmbilleder:** før/efter i 1440 og 390 for alle fem flader ligger i
  `fund/skud-flader/` (22 filer). Jeg har set katalog, robotside, producentside,
  Om os og sammenligning med egne øjne — men ikke hvert enkelt af de 22.
- **`.forbehold`s hvilekant (`--linje`, 1,56 : 1)** er målt og ikke afgjort.
  Den er `cursor:help`, altså en grænsesag for systemreglen fra pas 3.

## Noter

- **`impeccable` blev indlæst fra `C:\Users\thyge\.claude\skills\impeccable`**
  (den globale), ikke projektkopien — Skill-værktøjet valgte selv. CLAUDE.md
  angiver dem som byte-identiske. `spor` og `design` blev kaldt normalt.
- Serveren på port **8171 er lukket**. Den blev valideret mod disken ved md5 —
  og kontrollen blev først bevisførende efter pas 1, hvor min `system.css`
  skiltes fra main's (`281c2ec…` mod `cfa13d9…`).
- **Ingen formatering.** For alle 8 commits gælder `git diff --shortstat` ==
  `git diff -w --shortstat`. Pas 1's 133 ændrede linjer er hver især en
  værdi→token-ombytning; de 14, der ikke bar en rå px i *første* værdi, er
  shorthands, `calc()` og selve skala-definitionen.
- **Filejerskab:** `git diff --name-only main...HEAD` viser `assets/system.css`,
  `assets/generator.css`, `tests/dele/82-fladernes-system.mjs`, `DESIGN.md` og
  `fund/`. **Nul af de 17 testfiler, `spor/sletning` ejer.** Testnummeret er
  **82**, ikke 71.
