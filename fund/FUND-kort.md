# FUND-kort: kataloget rettet — fire målte problemer plus banner og nav-tjek

Gren: `design/kort`, worktree `c:\Praktik\websites\udstilling-wt-kort`. 6 commits, alle
efterprøvet med `node tools/build.mjs` og `node tools/validate.mjs` undervejs (0 fejl hver
gang) og med Playwright ved 1440 og 360 px over alle 46 kort.

## Skill-vurdering

Obligatorisk første handling, jf. brief og CLAUDE.md.

- **Valgt: `impeccable` (harden).** Kaldt via `Skill`-værktøjet — den blev fundet og kørte
  (ingen "Unknown skill"). Kørte `node .claude/skills/impeccable/scripts/context.mjs
  --target tools/skabelon/side.mjs`, som bekræftede: ingen `surfaceBrief`, platform web,
  `hasVisualImplementation:false` (feltet er ikke pålideligt her, siden er allerede bygget —
  se nedenfor). Læste `reference/harden.md` og `reference/craft-floor.md` fra disk før
  kodeændringer, som skillens egen Setup-instruks kræver.
- **Valgt: `ui-ux-critique`.** Kaldt via `Skill`-værktøjet, kørte uden fejl. Bruges ikke til
  en fuld kritikrunde her (opgaven var retningsgivet af JPK's fire punkter, ikke en åben
  vurdering), men dens tjekliste (swap-test, konvention-vs-default) lå bag vurderingen af,
  om "*"-mærket er typografi (accepteret, samme familie som kildemærkets hævede bogstav) og
  ikke et ikon-substitut (ville være banlyst af craft-floor).
- **Gået forbi: `grillmig`.** Briefet var allerede konkret med målt færdighedskriterium; en
  grilning ville have gentaget arbejde, JPK allerede havde gjort ved at skrive tallene ind i
  briefet.
- **Gået forbi: `robotdata`/`parallelt`.** Ingen robotpost blev tilføjet eller ændret, og
  opgaven blev ikke delt på flere agenter (én sammenhængende kritisk flade, fem punkter der
  alle rører de samme to CSS-filer — at dele den ville have givet mergekonflikter, ikke
  hastighed).

DESIGN.md læst i sin helhed før noget blev ændret (designkontrakten), og opdateret til sidst
med en dateret changelog-post (se commit `8c9d7be`).

## De fem punkter — målt før/efter

Målemetode: Playwright, `chromium`, over alle **46 kort** på både `/da/` og `/en/`, ved
**1440 og 360 px**. "Fund" = tekstfragmenter der (a) klipper mod en forfaders
`overflow:hidden`, (b) bløder ind i nabocellen i striben, eller (c) overlapper et søskende-
element i samme `.v`-spann — kun *synlig* tekst tælles (`.kunskaerm` og skjulte forfædre
udelades). Scriptet ligger i `scratchpad/pw/maal-kort2.mjs`.

### 1. Spec-felter klippede tekst

| | 1440 px | 360 px |
|---|---|---|
| Før (`/da/`) | **284 fund** (KLIP+NABOKLIP) | 0 fund |
| Efter (`/da/`, `/en/`, forside + `/robotter/`) | **0 fund** | **0 fund** |

Ekstra kontrol ved 420/679/680/1180/1181 px: 0 fund alle steder, begge sprog.

To fejl lå oven i hinanden:

1. **For smal celle.** Den kompakte nøgletalsstribe brugte tre spalter over 420 px. Ved
   typisk kortbredde (310-360 px) gav det en krop på ~95-115 px — for smalt til
   `NYTTELAST`/`DRIFTSTID` i 10,5 px spatieret mono. Rettet: to spalter ved ALLE bredder,
   femte celle (IP) spænder hele sidste række.
2. **Skjult specificitetsfejl.** `.stribe .v` / `.stribe--kompakt .v` / `.raekke .v` /
   `td .v` satte figurens skriftstørrelse direkte på `.v`-elementet med to-klasses
   specificitet (0,0,2,0), som ALTID slog `.v-ikke`/`.v-billede`s `.46em` og `.v-nej`/
   `.v-ja`s `.62em` (kun én klasse, 0,0,1,0) — uanset rækkefølge i filen. Målt i Chromium:
   "ikke oplyst" i et kort stod ikke i 9,2 px, men fladt i 20 px, samme størrelse som tallet
   selv. Det er præcis den fejl, DESIGN.md's regel om de fire tilstande forbyder ("skal ikke
   dele skriftgrad"), og en medvirkende klipningsårsag. Rettet med tilsvarende to-klasses
   regler pr. kontekst, alle over 10,5 px-gulvet.

Filer: `assets/system.css` (§ kompakt stribe, ny § 14b), `assets/generator.css` (forældede
3+2-regler fjernet).

### 2. Advarsel-støj

| | Synlige "Advarsel"-ord | "*"-mærker | Kort med mindst ét forbehold |
|---|---|---|---|
| Før | **174** (af 181 forbehold, på 41/46 kort) | 0 | 41/46 |
| Efter | **0** | 139 | 41/46 (uændret — findbarheden er bevaret) |

Rettelsen fra 21. aug (den lange sætning → korte "Advarsel") er **ikke** rullet tilbage —
efterprøvet ved stikprøve på ét mærke: `title="lastbetingelse ikke oplyst"` og skærmlæser-
teksten er `"Advarsel: lastbetingelse ikke oplyst"`, begge uafkortede. Kun den altid-synlige
ordchip er skiftet til et lille hævet tegn ("*"), samme typografiske familie som
kildemærkets hævede bogstav (ikke et ikon-substitut — vurderet mod craft-floors forbud mod
"Unicode glyphs... standing in for an icon system": dette er en fodnote-konvention, ikke en
ikonerstatning).

Lastbetingelse og feltets eget `advarsel:` flettes desuden til ÉT mærke pr. værdi i stedet
for to ved siden af hinanden: 35 af de 139 mærker er sådanne flettede par (efterprøvet:
`title` indeholder " · " og begge dele af teksten). 174 − 35 = 139 stemmer.

Mærket blev også flyttet IND i værdiens `.v`-spann (var før en sideordnet node, som
column-reverse-layoutet løftede op OVER værdien som cellens mest synlige led — målt i
browseren før rettelsen).

Filer: `assets/system.css` (`.forbehold--tegn`), `tools/skabelon/side.mjs` (ny `fnote()`,
`tal()` får valgfri `forbehold`-parameter, `felt()`'s `kunVaerdi`-gren omskrevet).

**Kendt grænse (se "Hvad jeg ikke nåede" nedenfor):** denne rettelse virker kun på kort
bygget af `side.mjs`s egen `kort()`/`stribe()`/`felt()`. Producentsidens miniaturekort
(`tools/skabelon/producent.mjs`, forbudt fil) har sin egen parallelle implementering, der
kalder `robot.mjs`s `vaerdi()`/`forbehold()` — den viser stadig det gamle, fulde
"Advarsel"-ord. Efterprøvet ved stikprøve på `/da/producenter/anybotics/`: 1 synligt
"Advarsel"-ord fundet, sporet til `<abbr class="forbehold" title="...">Advarsel</abbr>`
inde i producentsidens egen `kompaktStribe()`.

### 3. Måltro-pladen lignede en renderingsfejl

Før: en hvid kasse i en stiplet grå ramme, med kun etiketten "LÆNGDE × HØJDE" under sig —
intet tal, intet der sagde "dette er en måling". Se
`scratchpad/pw/basis-da-1440-kort.png` (nederste venstre kort, tomme plader).

Efter: pladen har fået et titelfelt i samme sprog som et tegningsark — etiketten står
sammen med producentens egne tal, som skrevet i kilden (fx "562 mm × 481 mm", "610 mm ×
406 mm"), adskilt af en hårfin `--linje` og en `--panel-ro`-flade som eget LAG (ikke en
skygge — reglen om det ubevægelige hul står ved magt, pladen løftes stadig aldrig). To
små målestreger hænger ned fra kassens egne bund-hjørner (positioneret relativt til
`.kasse`, arver dermed `--bw` uden separat koordinatregning). Se
`scratchpad/pw/maalplade-kort-1440.png` og `maalplade-helekort-1440.png`.

Ingen robotsilhuet tegnet (separat assetopgave, urørt) og intet AI-genereret billede.

Verificeret: 10 `.titelfelt`-instanser i `dist/da/index.html`, 10 i `dist/en/index.html`,
alle med producentens egne mål. 0 klip/overlap efter ændringen (samme Playwright-sweep som
punkt 1 dækker `.maalplade`, da `aria-hidden` ikke er ekskluderet fra den visuelle scanning).

Filer: `assets/system.css` (`.maalplade .titelfelt`, `.kasse::before/::after`),
`tools/skabelon/side.mjs` (`tomPlade()` bygger titelfeltets etiket + `.tal`-span — ingen
ændring af funktionens signatur).

### 4. Topbanneret løj

Før (`da`): *"Siden viser ingen billeder fra producenterne. Vi har ingen skriftlig
tilladelse, ... Pladserne står tomme, indtil vi har egne fotografier..."* — usandt siden
b22da4f koblede 32 producentfotos på.

Efter: *"Siden viser producenternes egne billeder uden skriftlig tilladelse. Det er
tilladt, så længe siden kun findes lokalt. Siden må ikke publiceres, før tilladelserne er
indhentet, eller billederne er skiftet ud med egne fotografier og måltro silhuetter."*
Engelsk tilsvarende. Ordlyden følger S1/L26 i STATUS.md ordret på det juridiske punkt
("må ikke publiceres... før tilladelse... eller udskiftning").

Verificeret: `grep -c "ingen billeder" dist/da/index.html dist/en/index.html` → 0 og 0.

Filer: `data/i18n/da.json`, `data/i18n/en.json` (kun `billednote_tekst`-nøglen).

### 5. Gentagne fodnoter

Hvert af de 46 kort sluttede med 2-3 ens monospor-`<p>`-linjer i en lodret stak. Fodnoten er
nu ÉT løbende afsnit med et `<span class="led">` pr. oplysning, adskilt af mellemrum i
stedet for linjeskift. **Intet ord, kildetal eller forbehold er fjernet** — hvert led
beholder sit eget tegn (prik = oplysning, stiplet firkant = billedforbehold) og hele sin
tekst. De tre tilstande "ikke oplyst"/"nej"/"0" er uberørte (den regel ligger i
`.v-*`-klasserne, ikke i fodnoten, og er ikke rørt af denne ændring).

Se `scratchpad/pw/fodnote-efter-1440.png` og `-360.png`.

Filer: `assets/system.css` (`.kort-fod` fra flex-stak til løbende `<p>`),
`tools/skabelon/side.mjs` (`kort()` bygger fodnoten som leds i stedet for linjer).

### Sidehøjde, samlet effekt af 1+2+3+5 (banneret ændrer ikke højden nævneværdigt)

| | `/da/` 1440 px | `/da/` 360 px |
|---|---|---|
| Før | 12 625 px | 40 383 px* |
| Efter | **11 954 px** | **35 732 px** |

\* Første 360px-måling (før item 5's kompression) var 39 117-40 383 px afhængig af
måletidspunkt i forløbet; sidste tal efter alle fem punkter er 35 732 px — et fald på
~4 650 px / 11,5 %.

## Producenter-punktet i topnavigationen

**Ingen kodeændring nødvendig — allerede korrekt.** `tools/skabelon/side.mjs`s `skal()`-
funktion har haft `if (harProducenter) nav.push(['producenter/', t('nav_producenter')])`
siden den allerførste commit (`ace64b6`, 21. aug), uændret gennem alle commits frem til og
med `b22da4f` (min grens udgangspunkt). Flaget defaulter til `false`, og min gren har ikke
`tools/build.mjs` fra `906b78e` (den ligger i historikken bag min gren, ikke i min
arbejdskopi, jf. briefet).

Efterprøvet: `grep -c "nav_producenter\|Producenter" dist/da/index.html` → 0, samme for en
robotdetaljeside (`dist/da/robotter/anybotics-anymal/index.html`) — linket vises IKKE i min
gren, som forventet, og vil tændes automatisk uden dobbelt-rendering, når `906b78e`s
`build.mjs` flettes ind og begynder at sende `harProducenter:true`. `nav_producenter`-
nøglen findes allerede i begge sprogfiler ("Producenter" / "Manufacturers").

## Byg og validering

- `node tools/validate.mjs`: **0 fejl** (46 filer, 1 datavarsel om Ghost Robotics Vision 60,
  uændret før/efter mine ændringer — ikke relateret).
- `node tools/build.mjs`: kørt 6 gange undervejs, hver gang exit 0, 123 sider bygget.
- `tests/koer.mjs`: crasher stadig i afsnit 4 på manglende `dist/stil.css` — kendt, som
  briefet sagde, ignoreret. **To yderligere FEJL før krascher blev efterprøvet mod en
  midlertidig worktree ved `b22da4f`** (min grens startpunkt, fjernet igen efter brug):
  `"11 HTML-sider bygget (fandt 17)"` og legend-mærke-testen
  (`tilstand--ikke-oplyst`/`maerke--nul`) fejler **allerede ved udgangspunktet**, før nogen
  af mine ændringer — bekræftet identisk i den friske worktree. Én tredje FEJL
  (`"bygget taeller billedet i sin slutrapport"`) viste sig at være et miljøartefakt: min
  arbejdskopi har 32 utrackede, gitignorerede fabrikantfotos liggende lokalt i
  `assets/fotos/fabrikant/` (jf. `.gitignore`s L13-undtagelse), som en frisk `git worktree`
  ikke arver (kun 1 fil der) — testens forventede tal ("1") passer kun i et miljø uden disse
  lokale filer. Ingen af de tre er forårsaget af mine ændringer i `side.mjs`/CSS/i18n.

## Filer rørt (kun ejede filer)

```
DESIGN.md               33 linjer tilføjet (changelog)
assets/generator.css    16 linjer, netto -3 (forældede regler fjernet)
assets/system.css       104 linjer tilføjet/ændret
data/i18n/da.json       1 linje ændret (billednote_tekst)
data/i18n/en.json       1 linje ændret (billednote_tekst)
tools/skabelon/side.mjs 75 linjer tilføjet/ændret
```

Efterprøvet mekanisk: `git diff b22da4f..HEAD --stat` viser præcis disse 6 filer, ingen
andre. `git diff b22da4f..HEAD -- tools/skabelon/side.mjs | grep "function (billede|
tomPlade|billedledHTML|laesBillede|billedTekst)("` → 0 linjer — de fem forbudte
funktionssignaturer er urørte (kun deres kroppe/interne kald er ændret, hvor det var
nødvendigt: `tomPlade()`s krop bygger titelfeltet, men tager stadig `(robot, op, stor)`).

## Selv-tjek med tælling

Efterprøvet (ikke bare "ser rigtigt ud"):

- **13 automatiserede Playwright-sweeps** (klip/naboklip/overlap) over alle 46 kort:
  1440+360 px × {da,en} × {forside,`/robotter/`} = 8, plus 420/679/680/1180/1181 px = 5.
  **0 fund i samtlige 13 "efter"-sweeps.** 1 "før"-sweep (basis) viste 284 fund, hvilket
  bekræftede at fejlen var reel før rettelsen.
- **1 element manuelt inspiceret** for `title`/skærmlæsertekst på `.forbehold--tegn` —
  begge bar den fulde, uafkortede tekst.
- **1 forespørgsel** talte flettede mærker (35 af 139 med " · " i title) og bekræftede
  regnestykket 174 − 35 = 139.
- **20 `.titelfelt`-instanser** talt i de to sprogs forsider, alle med reelle tal.
- **2 sider grep'et** for "ingen billeder" (da+en index) → 0 og 0.
- **2 sider grep'et** for Producenter-nav-linket (index + én robotside) → 0 og 0, som
  forventet af flag-logikken.
- **1 robotdetaljeside** (`boston-dynamics-spot`) smoke-testet: loader (200), viser stadig
  10 almindelige `.forbehold`, 2 nye `.forbehold--tegn` og 21 uændrede `.advarsel`-afsnit —
  ingen af de tre typer er brudt af ændringen.
- **1 producentside** (`anybotics`) smoke-testet: 0 klip, men fandt den kendte grænse
  beskrevet under punkt 2 (producent.mjs's parallelle "Advarsel"-tekst).
- **Git-diff mod branchens udgangspunkt** efterprøvede: kun 6 ejede filer rørt (0 forbudte
  filer), 0 ændringer i de fem forbudte funktionssignaturer.
- **Test-suite-regression** efterprøvet mod en midlertidig baseline-worktree ved
  `b22da4f`: 3 af 3 pre-crash-fejl bekræftet allerede til stede eller miljøbetinget, 0
  regressioner sporet til mine ændringer.

**Fejl fundet under selv-tjek:** 0 i den leverede tilstand (alle fundne problemer — de 284
oprindelige klip, de 174 "Advarsel"-ord, den skjulte specificitetsfejl, producent.mjs's
parallelle sti — er enten rettet eller dokumenteret som kendt grænse nedenfor).

## Hvad jeg er usikker på / hvad jeg ikke nåede

- **Producentsidens miniaturekort viser stadig "Advarsel" fuldt ud.** `producent.mjs` er
  forbudt at ændre og har sin egen kortimplementering (`modelkort()`/`kompaktStribe()`),
  parallel til `side.mjs`s. Den arver mine CSS-rettelser (0 klip, bekræftet), men ikke
  markup-rettelsen for advarsel-mærket, fordi den kalder `robot.mjs`s `vaerdi()`/
  `forbehold()` i stedet for `side.mjs`s `felt()`/`fnote()`. Dette er ikke en regression —
  producentsiderne brugte allerede den gamle "Advarsel"-tekst før mine ændringer — men det
  betyder opgavens punkt 2 ikke er 100 % dækket site-wide, kun på de 46 kort `side.mjs`
  selv bygger (forside + `/robotter/`), som var brief'ets eksplicitte omfang ("kataloget").
  Bør fanges af det spor, der ejer `robot.mjs`/`producent.mjs`, når de fletter.
- **Målepladens titelfelt er kun efterprøvet visuelt ved 1440 px** (skærmbillede) og ved
  Playwright-klipsweepet (som dækker alle bredder mekanisk, men jeg har ikke selv set et
  360px-skærmbillede af titelfeltet specifikt — kun af hele kortet, hvor pladen er lille).
- **Kontrast er ikke re-målt med værktøj denne session** — jeg har lænet mig på DESIGN.md's
  allerede efterprøvede tal for `blaek3` (6,16/5,55 mod panel/bund, langt over AA) til
  `.forbehold--tegn` og `.maalplade .titelfelt`, som begge bruger eksisterende, allerede
  validerede tokens (`blaek3`, `blaek2`, `panel-ro`, `linje`, `hegn`). Jeg har ikke kørt et
  automatiseret kontrastscript på de nye elementer specifikt.
- **`tests/koer.mjs`s to andre pre-crash-fejl** ("11 HTML-sider bygget (fandt 17)" og
  legend-mærke-testen) er bekræftet præ-eksisterende, men jeg har ikke undersøgt HVAD der
  forårsager dem — kun at de ikke skyldes min gren. De hører til et andet spor.
- **Ikke testet:** tastaturnavigation til `.forbehold--tegn` (den er stadig et `<abbr>`,
  fokuserbar via `tabindex` er ikke sat eksplicit — samme som den oprindelige `.forbehold`,
  så ingen regression, men heller ikke forbedret).
