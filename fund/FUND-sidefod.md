# FUND-sidefod — sidefoden, der ikke fandtes

## Før og efter

| | Før (main `1437838`) | Efter (`59b03b2`) |
|---|---|---|
| `<footer` i `dist/` | **0 af 216 sider** | **214 af 216** |
| Hvad foden bar | **intet — der var ingen fod** | 4 linjer: forhandlerforbeholdet · kildeløftet · "ingen cookies, intet fra tredjepart" · UDGIVET AF KEYRESEARCH + link til Om os |
| Fodens højde | **0 px** | **323 px** ved 1440 · **387 px** ved 390 (robotside) |
| Katalogsidens slutning | teksten stopper brat | mørk gunmetalplade lukker siden |
| 404-siden ved 1440×900 | 866 px, lys bund til kanten | 900 px, foden ligger i bunden |
| Nye i18n-nøgler | — | 2 (`fod_kildeloefte`, `fod_udgiver`) + 1 kommentarnøgle. 393 nøgler i hver fil, 0 i utakt |

**De to uden fod er `dist/index.html` og `dist/404.html`** — de sprogneutrale
rodsider. `renderRod()`s egen kommentar siger hvorfor: *"kan derfor IKKE bruge
skal() (som kræver et sprog)"*. Fodens tekst er oversat. **Beslutning til JPK:**
skal dørsiderne have en tosproget fod? Ikke udført. De sprog**specifikke**
404-sider (`dist/da/404.html`, `dist/en/404.html`) har foden.

## Briefets to påstande, begge afkræftet

1. ***"Footeren trykker 'Ingen tredjepartskald. Ingen cookies.' på hver side"***
   (Å54). **Nej.** `grep -rl "tredjepartskald" dist` → **0**;
   `git log --all -S'tredjepartskald' -- data/i18n/ tools/skabelon/` → **0
   commits**. Strengen har aldrig stået i en bygget side — den er en
   **CSS-kommentar** i `system.css:16`, og `assets/*.css` kopieres råt til
   `dist/`. Sætningen fandtes derimod færdig i i18n som `om_ikke_spor` og er nu
   fodens tredje linje, ordret.
2. **Foden var ikke glemt — den blev fjernet i går.** `a6c8681` / `8ab82f6`
   (`spor/uifix` punkt 7), på JPK's ord med tabet forelagt. Han omgør i dag sin
   egen beslutning; det er hans at omgøre, men det skal stå.

## Valgt og fravalgt

- **Valgt:** foden i `skal()` i `side.mjs` + ét nyt afsnit 17 i bunden af
  `system.css` (diffen er **én hunk, 0 slettede linjer**). 3 af 4 sætninger er
  genbrug af eksisterende nøgler — hård begrænsning 2 anvendt på en fod. Ingen
  adresse, intet telefonnummer, ingen "© 2026", ingen sociale links.
- **Fravalgt, imod briefet: sprogskifteren.** JPK fjernede DA/EN-knappen 2. sep
  (*"Desuden skal DA/ENG knappen væk"*) med prisen forelagt; `side.mjs`'
  kommentar siger *"REJS DEN IKKE IGEN"*, og L82 gør siden engelsk alene i fase
  4. `hreflang` i `<head>` er urørt. **Sig til, hvis den alligevel skal ind.**
- **Fravalgt: udgavestemplet flyttet til foden.** *"Udgave 2026-08-26"* regnes af
  robotdata (`katalog.mjs:873`), som `skal()` ikke får; en flytning kræver en ny
  parameter gennem `build.mjs`. Beslutning, ikke rettelse. **Ikke udført.**

## Målinger

| Måling | Tal | Konfidens |
|---|---|---|
| `node tools/validate.mjs` | 77 filer · 0 fejl · 1 advarsel (= før) | **høj** — uændret; en R18-fejl ville betyde manglende billeder |
| `node tools/build.mjs` | 216 sider · 1111/0 (= før) | **høj** — samme tal som grundmålingen |
| `grep -rl "<footer" dist --include=*.html \| wc -l` | 0 → **214** | **høj** — uden skabelonen ville tallet være 0, ikke 214 |
| `node tools/linktjek.mjs` | 0 døde · 50 producentsider · 0 unåede | **høj** — et forkert `op`-præfiks ville give 214 døde links |
| Kontrast, WCAG-formel, med læseretning | `--paafod` **PÅ** `--fod` **12,72:1** · `--paafod2` **PÅ** `--fod` **5,94:1** · `--accent` **PÅ** `--fod` **9,19:1** | **høj** — alle tre reproducerede DESIGN.md på 2. decimal. Kontrol: samme accent som tekst på lys bund er **1,38:1** |
| Bundbaren mod foden, 3 robotter valgt, scrollet til bund | `.sidefod__ramme` padding-bottom **32 → 104 px** · luft til mærkelinjen **58 px** (1440) / **35 px** (390) | **høj** — uden `:has()`-reglen blev padding 32 px og baren dækkede 14 px af mærkelinjen ved 1440 |
| Testsuiten, kørt i **egen** tmp-mappe | main-tilstand **1691/8** → med sporet **1684/15**. Sum 1699 begge gange | **høj** — de 8 er arvede (certificeringsfacet + død CSS); de 7 nye er alle "foden er væk"-assertions |

## 7 assertions skal vendes — jeg har IKKE rørt dem (`spor/testvend` ejer `tests/dele/`)

| Sted | Nu | Skal blive |
|---|---|---|
| `tests/dele/13-billedramme.mjs:113` | `!forsideHTML.includes('Vi er ikke forhandler')` | `forsideHTML.includes(...)` — linjen står igen, i foden |
| `tests/dele/42-om-os.mjs:174` | `forekomster === 1` | `forekomster === 2` — Om os' egen + fodens. Vagten bliver **stærkere**: 42.4's `<main>`-afgrænsning betyder noget igen |
| `tests/dele/51-fejl404.mjs:117` | `!sider[s].includes(T.ingen_forhandler)` | `sider[s].includes(...)` |
| `tests/dele/53-robotsidens-flader.mjs:173` | `... !== 0` | `... !== 1` — præcis én gang pr. robotside. Genindfører 53.11's oprindelige formål: ingen dublet |

De to `.revert`-beviser i 53 er rene strengprøver og består uændret.
## Åbne fund, ikke rettet (designfrysen: fund noteres)

1. **Om os viser nu `om_ikke_spor` to gange** — i `<main>` og i foden, ~500 px
   fra hinanden på samme skærm; samme gælder forhandlerlinjen. Iboende i en fod,
   der bærer sidens løfter, på den ene side der handler om løfterne. Fodens link
   får `aria-current="page"` dér; dubletten står.
2. **Bundbaren og foden er samme gunmetal** og smelter sammen ved 390 px; barens
   `box-shadow:0 -1px 0 rgba(0,0,0,.2)` ses ikke mod `--fod`. `spor/barplan` ejer den.
3. **To CSS-kommentarer er forældet af mit arbejde**, begge i fremmede afsnit:
   `system.css:2955` (*"sidefoden … er fjernet"*, `spor/doedcss2`) og `:2485`
   (*"Bjælken dækker IKKE sidefoden"* — nu sand, men reglen bag den ligger i
   **mit** afsnit 17, ikke ved baren).
4. **`en/sammenligning/` blev 16 px højere** af flex-kolonnen (en margen, der før
   kollapsede mellem `main` og fod). 2 af 216 sider, mere luft over foden.

## Nye fælder og opdagelser

- **En CSS-kommentar kan bære en påstand, ingen regel holder.** `.klaebebar`s
  kommentar sagde *"Bjælken dækker IKKE sidefoden"*. Den var sand, fordi foden
  var 96 px høj — ikke fordi noget håndhævede den. Da foden forsvandt, blev
  påstanden falsk **uden at nogen kode ændrede sig**, og Å136 målte 89 px dækket
  indhold. Kommentaren blev derefter stående som dokumentation for en garanti,
  der ikke fandtes.
- **En testsuite kan køres uden at røre den delte tmp-mappe.** `tests/koer.mjs`
  importerer hver `tests/dele/*.mjs` med én `ctx` — et 50-liniers script i
  scratchpad kan gøre det samme med sin **egen** `tmp`. Det gav mig hele suitens
  tal (1691/8 mod 1684/15) uden at kollidere med `spor/testvend`, og uden at
  gætte hvilke assertions der faldt. **Briefets forbud gjaldt kommandoen, ikke
  målingen.**
- **`git diff | grep -c "^@@ -299[0-9]"` er et forkert bevis for "kun tilføjelser".**
  En ren appendering giver hunken `@@ -2994,0 +2995,152 @@` — den *matcher*
  mønsteret. Beviset er `-2994,**0**`: nul slettede linjer. Min kontrollinje
  forudsagde 0 og fik 1, og kun kontrollen fangede, at spørgsmålet var forkert
  stillet.
- **`waitUntil:'domcontentloaded'` gav en fuldstændig plausibel sidehøjde på 562 px**
  mod den rigtige 900. Ingenting så forkert ud — kun at tallet modsagde nabosidens.
  Med `networkidle` 900/900 to gange. Et måleapparat, der læser før CSS'en er i
  kraft, lyver med et pænt tal.
- **`repeat(auto-fit, minmax(34ch, 1fr))` lavede et tredje spor på 0 px** og
  efterlod 95 px død plads inde i hvert af de to fyldte, fordi afsnittets egen
  `max-width:54ch` er smallere end sporet. Fladen så rigtig ud på et skærmbillede;
  først `getComputedStyle().gridTemplateColumns` viste `566,7px 566,75px 0px`.
- **`ch` på en gitterbeholder er ikke samme mål som `ch` på dens barn.**
  Enheden opløses mod elementets egen `font-size`; gitteret arver `body`s 17 px,
  afsnittet sætter 15 px. Målet hører på det element, teksten faktisk sættes i.
- **Skills:** `spor` kaldt (lykkedes), `impeccable` kaldt fra worktreen —
  **lykkedes**, og `context.mjs` kørt derfra; `layout`, `typeset` og
  `craft-floor` læst fra `C:/Users/thyge/.claude/skills/impeccable/reference/`.
  `fejljagt` **ikke** kaldt som skill — de to måleafvigelser (562 px, `@@`-greppet)
  blev fanget af kontrollinjen i samme øjeblik og krævede ingen rodårsagsjagt.
  Gik forbi: `frontend-design` (ingen ny visuel verden — foden bygges i TYPESKILT,
  som er låst), `robotdata` (rører ingen robotpost), `flet` (kun orkestratoren
  fletter), `grillmig` (ude af det obligatoriske workflow, og opgaven er JPK's
  direkte ord).
- **Designfrysen (L70):** foden er ikke en designrettelse af en eksisterende
  flade, men en flade JPK udtrykkeligt har bestilt i dag. Fundene ovenfor er
  noteret, ikke rettet — undtagen de to, der er **mine egne defekter** (foden
  fløj på korte sider, spalternes døde plads).

## Punkter i briefet, jeg ikke nåede

- **Sprogskifte i foden** — bevidst fravalgt, ikke glemt. Se *Valgt og fravalgt*.
  Det er en beslutning til JPK, ikke en udeladelse.
- **De 7 testassertions er ikke rettet** — `tests/dele/` er `spor/testvend`s.
  Den nøjagtige vending af hver står ovenfor; de kan sættes ind uden at gætte.
- **`node tests/koer.mjs` er ikke kørt** — forbudt i briefet. Tallene ovenfor er
  fra min egen isolerede kørsel af de samme filer.
- **De to sprogneutrale rodsider har ingen fod.** Kræver en beslutning om
  tosproget indhold på en dørside.
