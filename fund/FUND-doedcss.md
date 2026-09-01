# FUND — spor/doedcss

## Skill-vurdering (Regel 0)

Ingen af projektets otte skills passer på selve fjernelsesarbejdet ("Ingen
designbeslutning" jf. briefet). `fejljagt` passer PRÆCIST på den investigation,
der opstod undervejs (mekanisme før rettelse, revert-bevis efter) — men jeg
kaldte aldrig selve Skill-værktøjet på den, jeg fulgte kun dens metode i
praksis. Det burde jeg have gjort eksplicit i det øjeblik test 16 først fejlede.
`grillmig`/`brief`/`parallelt`/`robotdata`/`flet`/`supabase*` er alle
fravalgt med begrundelse: intet af dem passer en allerede afsendt,
enkeltagent, ikke-design CSS-opgave.

## 1. Valgt løsning + fravalgt alternativ

**Valgt:** Fjernede 51 af de 66 klasser (101 CSS-regler), beholdt 15 med
dokumenteret begrundelse pr. klasse, trimmede 3 delte regler kirurgisk.
**Fravalgt:** At følge briefets "AEGTE DOEDE: 0" bogstaveligt — det ville
have krævet enten at bryde 8 allerede-bestående tests (hård regel: ret
assertionen, slet den aldrig) eller at redigere 4 testfiler uden for mit
filejerskab.

## 2. Konfidensniveau pr. punkt

- **Høj:** `node fund/maal-doede-klasser.mjs | grep AEGTE` giver i dag
  `DOEDE: 15` / `USTYLEDE: 26`. Genkørbar. Var arbejdet forkert, ville tallet
  enten være 0 (havde jeg fulgt briefet blindt — og 8 tests ville være røde)
  eller >15 (havde jeg overset endnu en testlås).
- **Høj:** `node tests/koer.mjs` giver `1481 bestået, 0 fejlet`. Genkørbar.
  Forkert arbejde ville vise <1479 (brudt test) eller stationært 1479 (min
  egen test 57 ikke talt med/ikke fundet).
- **Høj:** `diff -rq .tmp/dist-grund .tmp/dist-efter --exclude='*.css'` giver
  ingen forskel. Genkørbar (kræver egen grundmåling først). Forkert arbejde
  (rørt en skabelon) ville vise linjer.
- **Middel:** At de 15 beskyttede klasser er PRÆCIS de rigtige 15 — hver er
  krydstjekket mod mindst én af: en eksplicit testpåstand (6 stk.), en aktiv
  kaldt funktion med skema-gyldigt datafelt (4 stk.: billedmaerke, prik--klip
  via `billede.delt_med`; grund via manglende længde+højde; maerke--varianter
  via `post.varianter`), eller direkte JS-konstruktion i `assets/*.js` (3 stk.
  saml-*). Ikke browser-efterprøvet (kun kildelæsning + grep), derfor middel.

## 3. Usikkerheder mødt undervejs

Om `maerke--varianter` FAKTISK rammer katalogkortets `kunVaerdi`-gren for
mindst én af de 7 robotter med `varianter:` sat — jeg har ikke sporet hele
kaldekæden til bunds, kun bekræftet feltet findes og funktionen er reachable.
Samme forsigtighedsprincip som de tre andre datastyrede undtagelser gælder,
men denne ene er ikke lige så håndfast bevist som de øvrige.

## 4. Målingerne som tal

validate: 77/0/1 (uændret) · build: 216 sider, 1111/0 (uændret) ·
AEGTE DOEDE: 66 → 15 · AEGTE USTYLEDE: 26 → 26 (uændret) ·
CSS-linjer: 4251 → 3908 (−343) · tests: 1479/0 → 1481/0 ·
regler fuldt fjernet: 101 · regler kirurgisk trimmet: 3 (endte-tilstand;
6 blev rørt undervejs, 3 rullet helt tilbage igen sammen med stribe--kompakt)
· klasser beholdt: 15 af 66.

---

## Nye fælder og opdagelser (uden for de 60 linjer)

**Den centrale fælde: "0 i HTML + 0 i assets/\*.js" er IKKE bevis for død
kode.** Fire distinkte huller fundet under egen kontrol, alle uafhængigt
efterprøvet:

1. **Reachable-men-datastyret.** `tools/skabelon/side.mjs` har aktiv,
   kaldt kode for `billede.delt_med` (billedmaerke/prik--klip),
   manglende længde+højde (grund) og `post.varianter` (maerke--varianter).
   Alle fire har skema-gyldige felter (`tools/skema.mjs`), men 0 af de 77
   robotter rammer betingelsen i dag — undtagen varianter, hvor 7 filer
   HAR feltet sat, uden jeg kunne bevise det rammer katalog-grenen.
2. **Målescriptets egen bug.** `fund/maal-doede-klasser.mjs`s JS-detektor
   (linje 48) kræver et citationstegn/backtick UMIDDELBART før klassenavnet
   — den misser derfor enhver modifier-klasse, der står som klasse nr. TO i
   en `class="a b"`-streng. `saml-fotofelt--uoplyst`, `saml-raekke--tavs` og
   `saml-svar__m--tavs` konstrueres alle sådan i `assets/sammenligning.js`
   og blev fejlagtigt talt som døde. Jeg ejer ikke den fil og har ikke rettet
   bugen — kun dokumenteret den her og i test 57's kommentar.
3. **Testlåst, bevidst efterladt.** `tests/dele/14-afslutning-oprydning.mjs`
   (linje 85-91) siger ORDRET at `.kort-invit` renderes 0 gange, MEN at
   reglen og TO tilhørende testvagter bevidst står tilbage, fordi
   oprydningen også rammer testfil 16 og 31. Samme mønster ramte `.gitter`
   (test 16, `minmax(250px,1fr)`) og `.filtre` (test 31.8, den skjulte
   input-regel) — ingen af de to har en forklarende kommentar som 14's,
   de blev kun fundet, fordi tests/koer.mjs gav røde tal EFTER fjernelse.
   **Konsekvens: jeg fjernede og genoprettede `.gitter`/`.filtre` én gang
   midt i gruppe 5, fordi jeg ikke tjekkede tests/ FØR jeg kørte den
   mekaniske fjernelse — kun EFTER.** Det burde have været omvendt rækkefølge
   fra begyndelsen (test-afhængighed FØR fjernelse, ikke som facit-kontrol
   bagefter). Fejlen kostede to ekstra byg+test-runder, ingen tabt data.
4. **`hjaelp.stribe()` i side.mjs er selv død kode** (0 kaldesteder nogen
   steder, bekræftet med grep) — men dens CSS (`stribe--kompakt`) er
   ALLIGEVEL testlåst af to uafhængige testfiler (16 og 31), hvoraf 31.5
   låser den EKSAKTE selektortekst `.stribe--kompakt .v-tal--xxlang .num`.
   `panel--ro` deler samme (døde) funktion, men er IKKE testlåst — den er
   derfor korrekt fjernet, mens `stribe--kompakt` ikke er.

**Mindre fund:** `git status`/`git diff` viser lejlighedsvis `M
assets/generator.css` med en "LF vil blive erstattet af CRLF"-advarsel, selv
når filen er byte-identisk med HEAD (bekræftet med Node `Buffer.compare`).
Ren Windows/autocrlf-støj, ingen reel ændring — men forvirrende, hvis man
stoler blindt på `git status`.

**Briefets egne tal (178/173/5 for delte regler) holdt IKKE ved egen
kontrol:** jeg målte 187/181/6 med et selvskrevet script (se commit
67d027e). Afvigelsen var reel: generator.css har `.facetter__net
.facet--s3,.facet--s4,.facet--s5` to gange (to medieforespørgsler), ikke én.

## Punkter i briefet, jeg ikke nåede

- **Acceptkriterium 1 ("AEGTE DOEDE: 0") er ikke opfyldt** — bevidst, med
  fuld begrundelse ovenfor. Sluttilstand er 15, ikke 0.
- **Følge-spor er ikke oprettet, kun identificeret:** rediger
  `tests/dele/14-afslutning-oprydning.mjs` (fjern 5c's to sidste vagter),
  `tests/dele/16-instrumentkort.mjs` (fjern `.kort-navn`/`.gitter`-vagterne),
  derefter kan `kort-navn/-krop/-hoved/-billed/-invit` og `gitter` fjernes.
  Samme mønster for `stribe--kompakt` (test 16 + 31) og `filtre` (test 31.8),
  men her bør en menneskelig beslutning først afgøre, om komponenterne
  virkelig skal væk, eller om de er bevidst bevarede reserver.
- Jeg har ikke rettet regex-bugen i `fund/maal-doede-klasser.mjs` (linje 48)
  — den er uden for mit filejerskab, kun dokumenteret.
- `tests/.tmp-koersel` og `.tmp/dist-*` er ikke ryddet efter mig (permission
  denied på `rm -rf`) — begge er gitignorerede og ufarlige at lade stå, men
  reglen om disk-hygiejne er ikke fulgt til punkt og prikke.
