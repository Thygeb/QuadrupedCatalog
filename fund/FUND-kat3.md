# FUND — `spor/kat3`, katalogets filterflade, 3. sep 2026

**Skills:** `spor` (virkede). `impeccable` **kaldt fra worktreen — virkede**; `context.mjs` kørt,
`reference/layout.md` + `typeset.md` læst. **Fravalgt:** `frontend-design` (ingen ny flade),
`ui-ux-critique`/`impeccable critique` (bygge en godkendt plan, ikke dømme), `fejljagt` (intet
uventet tal overlevede kontrollinjen), `robotdata` (0 ændringer i `data/robots/`). **MODE: Operate.**

**Grundmåling, første kommando:** validate → **77 filer, 0 fejl, 1 advarsel**, identisk med briefets.
Worktreen manglede `.env` og alle 610 fabrikantfotos; uden dem gav validate **76 fejl** (R18). Kopieret
ind *før* grundmålingen — ellers havde jeg rapporteret en afvigelse, der ikke var min.

**Valgt løsning:** J2's og J3's mål ligger i `generator.css`, **som jeg ikke ejer** — alt er derfor
skrevet som højere-specificitets-overskrivninger i `system.css` under `.udtraek` (mønstret fandtes
i forvejen: `summary.facet__navn::after`). **Fravalgt:** at redigere `generator.css`. Målt urørt,
ligesom `sammenligning.js`, `robot.mjs` og `data/robots/`.

**Konfidens: høj på alle seks punkter** — hver har en genkørbar kommando *og* en kontrafaktisk linje.
J1/J2/J3's før-tal er målt ved at **stashe ændringen, bygge om og måle igen**: havde reglerne ikke
ramt, ville jeg have fået 0/0, 10 grader og 109/326 tilbage. Punkt 5's no-JS-kørsel ville have vist
77 for alle tre valg, hvis lagene ikke blev genereret; punkt 6's md5 ville have afveget, hvis
klassen levede (positive kontroller 18 og 84). **Ingen injiceret CSS** — alt er byg-og-genindlæs.

**Punkt 5 er bevist begge veje.** Uden JavaScript (`javaScriptEnabled:false`, `data-levende` =
`false` i alle fire kørsler): intet filter **77**, ja **2**, nej **1**, ikke oplyst **74**. Med
JavaScript: **2 / 1 / 74**, og sidens egen tæller sagde det samme. Hård begrænsning 5 er opfyldt
**i formen** — `rk` (fyldt), `rk rk--nej` (kontur med skråstreg), `rk rk--uoplyst` (stiplet,
støvblæk, efter en stiplet linje) — set på skærmbillede, ikke antaget.

**Set med egne øjne:** `.udtraek` før, efter J2, efter J3, til slut, plus den åbne CE-facet — læst
med Read. Serveren (egen port 8132) er **lukket og efterprøvet død**: ingen LISTENING, intet svar.

## Seks steder hvor briefet eller planen ikke holdt

1. **CE-fordelingen er 2 / 1 / 74, ikke 2 / 2 / 73.** Kun **én** robot har `vaerdi: false`
   (`xiaomi-cyberdog-2`). Efterprøvet tre veje. Briefets eget punkt 4 citerer "74 of 77" og modsiger
   dets punkt 5; kilden er **L55's grundmåling fra 31. aug**, som er forældet.
2. **`ce_oplyst` er ikke det eneste certificeringsfelt** — skemaet har **fire**. `fcc_oplyst` 75 ×
   ikke oplyst + 2; `ul_oplyst` og `ccc_oplyst` 77 × ikke oplyst. Kun CE har mere end én tilstand,
   så JPK's afgrænsning er den eneste mulige.
3. **Punkt 4's acceptkriterium kan ikke nå 0.** Briefets løse grep gav **fire** filer; de to ekstra
   er en **kildebelagt note i MAB Honey Badger 5's robotdata**, som skal blive stående. Målt med
   subjektet i mønstret er sætningen 2 → 0. **Det korrekte tal for briefets grep er 2.**
4. **`.filtre` lever også i `generator.css`:** 7 selektordele i 6 regler, som briefet ikke nævnte og
   jeg ikke må røre. Klassen er 0 i hele `dist/`, så de er lige så døde. **Skal fjernes af det spor,
   der ejer filen** — noteret i koden, hvor mine 11 stod.
5. **Planens J3-acceptkriterium modsiger sig selv:** det kræver "åben facet uændret 389,5 px", men
   dens egen regel fjerner 16 px polstring, som den åbne tilstand også bærer. Målt **373,5 px**.
6. **Planens J2-tabel undertalte.** Den tilskrev 11 px alene `.facet__navn` og 13 px alene `.antal`;
   panelet bærer også `.skala__ord` på 11 og `.t-mikro`/`.url` på 13. Planens fem navngivne
   rettelser ville have efterladt **seks** grader — ikke dens eget "≤ 4".

## Usikkerheder

- **`tests/koer.mjs` er IKKE kørt** (briefet forbød det uden varsel). Punkt 4+5 fjerner tre
  i18n-nøgler og ændrer en fjerde; `tests/dele/14` vogter døde i18n-nøgler, og `tests/dele/09`
  nævner `eu_pointe` i en kommentar. **Orkestratoren bør køre suiten før flet.**
- **`.reserveret{,__ord,__note}` er nu død CSS i `generator.css`** (3 regler) — markuppen er væk,
  men filen er ikke min.
- **CE-facettens "nej"-tekst brækker om på to linjer** i en `facet--s3`-kolonne. Læsbart, men langt.
  Ikke ændret: L70's frys siger, at fund noteres, og ny UX-tekst er JPK's.

## Målingerne — før → efter, byggede sider, 1440 px / `/en/`

| | før | efter |
|---|---|---|
| **1 · J1** synlig luft over/under søgefeltet | 0 / 0 px | **24 / 24 px** |
| input-gulv (berøring / iOS-zoom) | 45 / 16 px | **45 / 16 px** (urørt) |
| **2 · J2** skriftgrader i `.udtraek`, 1440 og 390 px | 10 og 10 | **3 og 3** (2 synlige: 14, 12) |
| `font-size`-værdier i de to stilark | 53 | **53** — ingen ny indført |
| **3 · J3** lukket facet · `.facetter__net` | 109/108 · 326 px | **77/76 · 230 px** (−29,4 %) |
| `summary.facet__navn` min-height · åben facet | 44 · 389,5 px | **44** (urørt) · 373,5 px |
| **4** `eu_pointe` på byggede sider | 2 | **0** |
| **5** CE-facettens tre tællere | pladsholder | **2 / 1 / 74** = 77 |
| **6** `.filtre`-selektorer i `system.css` | 11 | **0**, fladen pixel-identisk |
| validate · build | 77/0/1 · 216 sider | **77/0/1 · 216 sider** |

## Nye fælder og opdagelser

- **Mit eget måleapparat løj først, og kontrollinjen fangede det.** `previousElementSibling` på
  `.sog` er `.udtraek__greb`, som er `display:none` og derfor har rect 0,0 — den gav **1145,53 px
  "luft"** over et felt, der stødte direkte op mod sin nabo. Rettet til nærmeste **synlige**
  søskende, hvorefter den gav 0, præcis som planen uafhængigt havde målt. **Et forkert mål gav et
  fuldstændig plausibelt tal**, og kun den skrevne forventning afslørede det.
- **`indexOf('data-facetgruppe="ce"')` rammer den genererede CSS, ikke markuppen.** `hovedStil()`
  udsender `[data-facetgruppe="ce"] [data-facet-aktiv]` i sidens `<style>`, som står **før**
  `<body>`. Mit første udtræk printede derfor anvendelses-facettens rækker og så helt rigtigt ud.
  Søg på `<details ... data-facetgruppe="ce"`. Samme familie som `split()`-fælden i CLAUDE.md.
- **`Get-NetTCPConnection` gav tomt for en port, der beviseligt lyttede.** Et måleapparat, der lyver;
  `/c/Windows/System32/NETSTAT.EXE -ano` var kontrollen og fandt PID'en. `netstat` og
  `powershell.exe` er ikke på PATH i Git Bash. Og **`taskkill //PID` fejler** (MSYS gør `//` til en
  sti): brug `MSYS_NO_PATHCONV=1 /c/Windows/System32/taskkill.exe /PID <n> /F`.
- **Et byte-identisk md5 på et skærmbillede er et billigt, hårdt bevis for "pixel-uændret".** Tre
  flader × før/efter; punkt 6's påstand er dermed målt frem for hævdet.
- **`assets/katalog.js` behøvede ingen ændring.** Den bygger sin facetliste ved at læse
  `lag-*`-klasser ud af DOM'en og opdagede CE-facetten af sig selv. Generisk maskineri betaler sig:
  facetten fik chips, gruppemærke, tællinger og no-JS-regler uden en linje ny mekanik.
- **`system.css` loader FØR `generator.css`.** Enhver overskrivning derfra kræver højere
  specificitet, ikke senere placering — en fælde, fordi "min fil står sidst i mappen" føles omvendt.

## Punkter i briefet, jeg ikke nåede

- **Ingen.** Alle seks er bygget, målt og committet hver for sig — **7 commits**, fordi punkt 2 fik
  en ekstra: min egen efterprøvning fandt mobilens `.udtraek__greb` (11,5 px/.15em) uden for
  typeskalaen, så panelet stod på 3 grader ved 1440 og 4 ved 390. Nu 3 begge steder.
- **Fravalgt bevidst:** de tre øvrige reserveklasser (`kort-navn`, `gitter`, `stribe--kompakt`) er
  alle 0 i `dist/`, men **ingen af dem betjener filterfladen**, så briefets betingelse for at røre
  dem er ikke opfyldt. De står urørt.
