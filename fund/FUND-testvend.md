# FUND-testvend.md

Skill valgt: `spor` (obligatorisk førstehandling, lykkedes fra worktree). `fejljagt`
kaldt til punkt 3. Ingen designskill valgt — kun test-/CSS-rettelser, designfrysen
respekteret (ingen visuel ændring, verificeret nedenfor).

## Før-og-efter

| Test | Før | Efter | Fladeændring? |
|---|---|---|---|
| 48.11 da/en | forventede 10/8 `<details>` | forventede 10/**9** (+2 revert) | Nej — kun tallet i testen rettet |
| 35.11 da/en | bevis "facet VÆK" | bevis "facet FINDES" (L89) (+2 revert) | Nej — facetten var allerede bygget af kat3 |
| 35.12 da/en | bevis "reserveret plads" | 3 delassertions (ja/nej/uoplyst) + 1 revert + 35.11c (L68-vagt) | Nej |
| 57.1 | 14 beskyttede, fandt 18 | 13 beskyttede, fandt 13 | **Ja, CSS fjernet — se nedenfor** |
| 31.8 | bevis `.filtre` i system.css | bevis `.rk__felt` i generator.css (+1 revert) | Nej — kun navn/fil skiftet |

**CSS fjernet fra `assets/generator.css` (57.1), 0 visuel ændring, bevist ved
`diff -rq` af en frisk byg før/efter minus generator.css selv (0 forskelle i
noget HTML — stærkere end md5, alle byte identiske):**

| Klasse | Regler/forekomster fjernet | Årsag |
|---|---|---|
| `reserveret`, `__ord`, `__note` | 3 regler + 1 token i delt liste | kat3 fjernede pladsholderens markup (L89), ejede ikke CSS |
| `stribe--fem` | 13 selektorhalvdele + 1 kommentar (14 i alt) | erstattet af `.stribe--seks` (spor/robot3) |
| `filtre` | 6 regler / 7 selektordele | kat3 fjernede system.css-delen, disse stod i generator.css |

Briefets "4 nye" dækkede reelt **5 klassenavne** af **2 uafhængige årsager** —
`filtre` hænger sammen med punkt 3 (31.8), ikke med `reserveret`/`stribe--fem`.

## Måling — grundlinje og slut

`node tools/validate.mjs` → 77/0/1 (uændret, matcher briefet).
`node tools/build.mjs` → 216 sider, 1111/0 (uændret, matcher briefet).
`node tests/koer.mjs`: **1691/8 (grund) → 1712/0 (slut)**, +13 assertions netto,
alle nye er revert-beviste.

## Konfidens pr. punkt

**Punkt 1 (48.11, 35.11, 35.12) — HØJ.** `node tests/koer.mjs` genkørbar, giver
1712/0. Kontrafaktisk: uden mine ændringer viser samme kommando 8 fejl
(dokumenteret trin for trin i commits e2e8535/bee9e59). 35.11/35.12 blev
stoppet og genstartet efter to orkestrator-beskeder (L55→L89-ophævelse) —
begge assertioner citerer nu L89, ikke L55, og laser L68 (data/robots/ 0
ændringer) som eget acceptkriterium.

**Punkt 2 (57.1) — HØJ.** `node tests/koer.mjs` + `diff -rq` af to friske byg
(commit c95abce vs. nuværende) på alt undtagen generator.css: 0 forskelle.
Kontrafaktisk: fjernes en levende regel ved en fejl, ville diff'en vise
HTML-forskelle — den gjorde det ikke i nogen af de tre iterationer, jeg lavede
undervejs (48.11-relateret CE-facet var allerede efterprøvet separat).

**Punkt 3 (31.8) — HØJ.** Fejljagt fulgt i to commits (63a375a diagnose,
d08cb2e rettelse). Bevis begge veje: med rettelsen 1712/0; `git stash` af
rettelsen alene → 31.8 fejler igen med samme fejlbesked (1710/1). Mekanismen
er citeret til kildecommit c7a3270 ("fladen pixel-identisk", md5-bevist af
kat3 selv) — ingen tilgængelighedsregression, kun et flyttet klassenavn.

## Filejerskab, faktisk rørt

`tests/dele/48-katalogets-flader.mjs`, `tests/dele/35-typeskilt-katalog.mjs`,
`tests/dele/57-doed-css.mjs`, `tests/dele/31-pudsning.mjs`, `assets/generator.css`.
`assets/system.css` **ikke** rørt (punkt 3 viste ingen regression, så kravet
for at røre den var ikke opfyldt). `data/robots/`, `data/i18n/`,
`tools/skabelon/*` alle 0 ændringer (`git diff --stat` bekræftet).

**48.11-mekanisme:** facetBlok() (`katalog.mjs:964`) sætter `data-facetgruppe`
UBETINGET på alle facetter inkl. CE — bekræftet af `katalog.js:351`. Testens
"certificering har bevidst ingen" var forkert efter kat3 åbnede facetten;
rettelsen gik i TESTEN.

**Miljø:** fabrikantfotos (610) + `.env` kopieret ind før grundmåling. Port
8134 ubrugt (al efterprøvning via `diff -rq`/`grep`). `tests/.tmp-koersel`
ryddet 7×, inkl. to hastende oprydninger efter orkestratorbeskeder om delt
diskplads (2,9 GB, tre samtidige spor).

---

## Nye fælder og opdagelser

1. **`.facet-tom`-dæmpningen har haft 0 effekt siden `.filtre` blev dræbt,
   uafhængigt af mit spor.** `assets/katalog.js:824` sætter stadig
   `classList.toggle('facet-tom', ...)`, men de to eneste CSS-regler, der
   nogensinde tegnede noget for den klasse, krævede `.filtre` som forælder
   (dræbt af kat3 i `system.css` FØR jeg rørte noget). Jeg fjernede blot de
   sidste to (allerede-uvirksomme) rester i `generator.css`. Ikke rettet —
   uden for filejerskabet og uden for briefets punkter, men værd at vide,
   hvis nogen undrer sig over hvorfor en tom facet ikke dæmpes visuelt.
2. **`assets/katalog.js:351-353`'s kommentar er forældet:** den beskriver
   "den reserverede certificeringsgruppe, som slet ingen afkrydsningsfelter
   har" — sandt før kat3, usandt nu (CE har 3 rigtige checkbokse). Ikke rettet,
   samme grund som ovenfor (fil uden for ejerskab, ren dokumentationsdrift).
3. **Tre samtidige sessioner/spor i samme repo denne dag** (kat3, en anden
   orkestratorsession, mit eget) gav to midtvejs-kurskorrektioner: STOP/GO på
   35.11-35.12 (L55→L89-ophævelsen landede på main midt i mit arbejde) og en
   ekstern bekræftelse af 48.11's 10/9-tal fra en tredje session — begge
   korrektioner var allerede dækket af mit eget arbejde på det tidspunkt de
   ankom, hvilket er en god krydsvalidering af, at min egen måling holdt.
4. **`grep -rl`/`grep -roh` mod `dist/*.css` er en fælde, jeg selv ramte
   først og rettede:** min første "0 forekomster i dist/"-kontrol for
   `stribe--fem` gav 14 træf, fordi `dist/generator.css` er en rå kopi af
   kildefilen (før min rettelse). Rettet ved at filtrere til kun `*.html`.

## Punkter i briefet, jeg ikke nåede

Ingen. Alle tre punkter (48.11, 57.1, 31.8) samt det oprindeligt stoppede og
siden frigivne 35.11/35.12 er gennemført, committet og efterprøvet.
`node tests/koer.mjs` → 1712 bestået, 0 fejlet.

