# FUND-f2vaern — spor/f2-vaern

**Regel 0:** overvejede `supabase`, `fejljagt`, `robotdata` — ingen passer. Dette
spor genbruger kun eksisterende eksporterede funktioner (ingen ny Supabase-
interaktion, ingen ukendt måletal at jage, ingen robotpost). **Ingen skill
brugt** — mekanisk Node-tooling efter et fuldt specificeret brief.

## Valgt/fravalgt

- **Punkt 1 (værn):** valgt at genbruge `db/fase2-tjek.mjs`s `hentRobotter()`/
  `danskAlle()` via dynamisk import (samme mønster som `db/eksporter.mjs`s
  `traekValidateTal`) — fravalgt subproces+regex-parsing (D7/L30-lærdommen).
- **Den ene beslutning briefet overlod:** **`--alligevel` KRÆVER `--uden-commit`**
  (afvist alternativ: lade `--alligevel` committe, blot med en advarsel i
  commit-beskeden). Begrundelse: en advarsel i en commit-besked forhindrer
  intet — filerne under `data/robots/` ville stadig blive halvt engelske og
  committet. Kun at KRÆVE `--uden-commit` gør faren strukturelt umulig via
  ét-kommando-vejen; et ægte forsætligt commit af halvt oversat data kræver nu
  et bevidst, manuelt skridt uden om `hentbyg.mjs`.
- **Punkt 2:** fulgte briefets triage præcist (billeder.mjs L500+507,
  eksporter.mjs L603+605, maal-f2.mjs L11 — L118/L8/L17 urørte).

## Konfidens pr. punkt

- **Punkt 1: Høj.** `node db/hentbyg.mjs --uden-commit --uden-byg` (genkørbar,
  ingen `--alligevel`) → `HENTBYG STOPPET: 788 af 890 advarsler...`, exit 1,
  `data/robots/` uændret (`git status --short data/robots` tomt før/efter).
  Var værnet forkert (fx altid ja), ville denne kommando have kørt eksporten
  og skrevet 77 filer i `data/robots/` — `git status` ville IKKE være tomt.
- **Punkt 2: Høj.** `grep -n 'process\.exit(' <fil> | grep -vE ':\s*(\*|//|/\*)' | wc -l`
  gav billeder=1, maal-f2=2, eksporter=0 (matcher acceptkriteriet). Var
  rettelsen ikke lavet, ville tallene stadig være 3/3/2. `node --check` ren på
  alle tre. `fund/maal-f2.mjs` uden argument → exit 1; med gyldigt `robot_id`
  (2182) → exit 0, tal identiske med git-versionen FØR rettelsen (sammenlignet
  direkte). `db/eksporter.mjs --fra-db --ud=db/.tmp/eksport-test-f2vaern`
  (ALDRIG `data/robots/`) → exit 0, 77 filer, mappen slettet igen bagefter.
- **Punkt 3: Høj.** `node tests/koer.mjs` → **1658 bestået, 0 fejlet**
  (1644 grundmåling + 14 nye). Var en assertion forkert, ville "fejlet" > 0.

## Usikkerheder

- **Punkt 2's L500 i `db/billeder.mjs`:** ved gennemlæsning kan denne linje
  (main()'s "ukendt flag"-fallback) faktisk IKKE nås efter et fetch i samme
  kørsel — alle andre grene i if-kæden returnerer, før L500 kan nås. Briefets
  triage kalder den "efter fetch"; rettelsen er lavet alligevel (harmløs, og
  acceptkriteriets endelige optælling kræver den), men jeg kan ikke bekræfte
  briefets specifikke begrundelse for netop DEN linje.
- **`--alligevel` kunne ikke afprøves end-to-end som den fulde CLI-kommando**
  (`node db/hentbyg.mjs --alligevel --uden-commit`), fordi trin 1 ubetinget
  kalder `eksporter.mjs --fra-db --ud=data/robots` — og `data/` er eksplicit
  uden for mit filejerskab. Verificeret i stedet ved at kalde `koerVaern()`
  direkte med RIGTIG, levende DB-måling (788/890) og se den blokere, og med
  `--alligevel`+`--uden-commit` se den slippe igennem UDEN at kalde målingen
  — samme kodesti, samme rigtige data, men uden at røre `data/robots/`.
- **`fund/maal-f2.mjs`s nye fejlgren (L11, `throw` i stedet for `process.exit`)**
  er ikke dækket af nogen af briefets to eksplicitte exitkode-tests (de rammer
  L17/success-stien) — den er `node --check`-ren og logisk gennemgået, men
  ikke selv kørt mod et ægte HTTP-fejlsvar.

## Nye fælder og opdagelser

**Punkt 1's eget værn indførte en NY exit-127-risiko, som briefet ikke kunne
have set:** før mit spor kaldte `db/hentbyg.mjs` aldrig `fetch()` i sin egen
proces (kun via `execFileSync`-underprocesser). Værnet importerer nu
`db/fase2-tjek.mjs`, som kalder et ægte `fetch()` i SAMME proces — dermed
arver `hentbyg.mjs`s egen `main().then((k) => process.exit(k))` (linje
246-252, FØR mine ændringer) præcis den samme fare, punkt 2 er sendt for at
lukke andre steder. Rettet defensivt i samme commit som punkt 1 (samme
`process.exitCode`-mønster), så punkt 1 ikke selv genindfører den fare, punkt
2 lukker. Dette var IKKE i briefets filliste over "tre ægte steder" — den
liste var korrekt, DA den blev målt (før værnet fandtes).

**`db/fase2-tjek.mjs`s `--dansk`-tal ændrede sig midt i sporet** (890/795 i
briefet → 890/788 ved min kørsel), fordi fire fase 2-spor oversætter databasen
samtidig med dette spor. Forventet, ikke en fejl — men et konkret eksempel på,
hvorfor værnets besked selv MÅLER tallet i stedet for at citere et fast tal.

**Windows-filstier i en dynamisk `import()` kræver `file://`-præfiks** — et
almindeligt `node -e "import('C:/...')"` fejler med
`ERR_UNSUPPORTED_ESM_URL_SCHEME`. Ramte dette under egen-verifikation af
punkt 1 (scratchpad-scriptet), ikke i selve leverancen (alle produktions-
importer i `db/`-filerne brugte allerede `file://${...}`-mønsteret).

## Punkter i briefet, jeg ikke nåede

Ingen. Alle tre punkter, grundmålingen og filejerskabets grænser er
overholdt.

## Målingerne

- Grundmåling: validate 77/0/1 · build 216 sider, 1111/0 · tests 1644/0 ·
  HEAD `a3c501d` — alle fire matchede orkestratorens tal præcist.
- Slutmåling: validate 77/0/1 · build 216 sider, 1111/0 (uændret) · tests
  **1658/0** (1644 + 14 nye, 0 fejlet).
- `grep -c 'fase2-tjek' db/hentbyg.mjs`: **6** (krav ≥1).
- `grep -n 'process\.exit(' <fil> | grep -vE ':\s*(\*|//|/\*)' | wc -l`:
  billeder.mjs **1** (kun L118) · maal-f2.mjs **2** (kun L8/L17) ·
  eksporter.mjs **0**.
- Fire commits: `ce65a3f` (punkt 1) · `f6333f7` (punkt 2) · `34cecfe`
  (punkt 3) · `5636b43` (BRIEF-filen tilføjet til git).
