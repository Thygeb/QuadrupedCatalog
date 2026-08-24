# FUND-detalje: robotdetaljesiden fik sit designløft, kildemærker ud af tab-flowet

Gren: `design/detalje`, worktree `c:\Praktik\websites\udstilling-wt-detalje`. 8 commits,
alle efterprøvet med `node tools/build.mjs`, `node tools/validate.mjs`, `node tests/koer.mjs`
og `node tools/linktjek.mjs` undervejs, plus Playwright ved 1440 og 360 px.

## Skill-vurdering

Obligatorisk første handling, jf. brief og CLAUDE.md.

- **Valgt: `impeccable`.** Kaldt via `Skill`-værktøjet, kørte uden fejl (ingen "Unknown
  skill"). Kørte `node C:/Users/thyge/.claude/skills/impeccable/scripts/context.mjs
  --target tools/skabelon/robot.mjs`, som bekræftede: ingen `surfaceBrief`,
  `hasVisualImplementation:false` (upålideligt her — siden er allerede bygget), platform
  web. Læste `reference/craft-floor.md` og `reference/harden.md` fra disk FØR kodeændringer,
  som skillens egen Setup-instruks kræver (briefet pegede allerede mod "harden på en
  eksisterende flade" som den rigtige kommando-kategori).
- **Valgt: `ui-ux-critique`.** Nævnt i briefet som selvkontrol; dens tjekliste
  (swap-test, konvention-vs-default) lå bag vurderingen af det korte "*"-tegn på
  `forbehold()` (accepteret — samme typografiske familie som kildemærkets hævede
  bogstav, ikke et ikon-substitut) og af at IKKE bruge emoji/glyffer noget sted i
  rettelserne.
- **Gået forbi: `grillmig`.** Briefet var allerede konkret med målte færdighedskriterier
  for alle fire opgaver; en grilning ville have gentaget arbejde, CEO'en allerede havde
  gjort ved at skrive tallene ind i briefet.
- **Gået forbi: `robotdata`.** `data/robots/` er eksplicit forbudt i dette spor (et
  parallelt spor ejer billedblokkene) — ingen robotpost er tilføjet, ændret eller
  efterprøvet.
- **Gået forbi: `parallelt`.** Opgaven var tildelt mig som ÉN agent for alle fire
  punkter. Jeg overvejede at dele CSS-migreringen (opgave 4b) fra resten, men afviste
  det: opgave 1's layout-fix ER opgave 4b's CSS-migrering (samme rod-årsag —
  `.robot-top` manglede en levende regel), og opgave 4c's testrettelser rammer de
  samme funktioner (`felt()`, `anvendelse()`), kildemærke-fixet i opgave 2 rammer.
  At dele det ud ville have krævet, at hver agent først gennemførte den samme
  undersøgelse af de levende skabeloner — den dyre del — uden filkollision, men uden
  reel gevinst heller.

DESIGN.md læst i sin helhed før noget blev ændret, opdateret til sidst med en dateret
changelog-post.

---

## Svaret kort (færdighedskriteriet, punkt for punkt)

**(a) Robotnavn i første viewport.** Målt `unitree-go2`, Playwright:

| | 1440×900 | 360×800 (se metodenote) |
|---|---|---|
| Producent/status-linje, top | **239 px** | **625 px** |
| H1 (robotnavn), top–bund | **276–350 px** | **661–694 px** |
| Før (1440) | 1057–1155 px (uden for 900 px-viewporten) | 626–682 px |

Begge dele ligger inden for viewporten ved 1440. Ved 360 px ligger producent/status
fuldt synlig, og H1 ligger inden for både en 800 px-testviewport og en 360×740
Android-referencehøjde (694 < 740) — se metodenote nedenfor for hvorfor netop den
højde er valgt.

**(b) Tab-stop til kort 5.** Målt `/da/robotter/`, Playwright-tastatursimulering fra
sidens top: **47 → 39** tab-tryk (12 færre for netop denne måling; se forklaring
nedenfor for hvorfor det ikke er "40", som briefets illustrative regnestykke antog).
98 kildemærker på hele siden bærer nu `tabindex="-1"`.

**(c) `span.maerke`-kontrast efter rettelse.** **1,1:1 → 14,88:1**, målt programmatisk
(Playwright + WCAG-formlen) på den faktisk gengivne side. 191 `.maerke`-forekomster
efterprøvet på tværs af 4 sider: laveste kontrast nu 5,35:1 (et allerede dokumenteret,
uændret par), 0 under 4,5:1.

**(d) Testpakken.** **190 ok / 7 fejl → 195 ok / 2 fejl.** Begge tilbageværende røde
har en ny, mere præcis begrundelse (se afsnit "De 2 tilbageværende røde tests").

**(e) CSS.** 43 af de 44 oprindeligt hjemløse klasser fra `fund/FUND-test.md` fik en
levende regel (den 44., `.anvendelse`, er et rent semantisk hook uden nogensinde at
have haft en regel i de døde filer heller — bekræftet ved samme søgning mod dem).
2 huller fundet af min EGEN efterprøvning efter første migreringsrunde
(`.feltvaerdi`, `.variant`/`.variant--navn` — begge var allerede en del af de 44, jeg
havde blot overset dem i første omgang) blev rettet før sletning. 0 klasser, en levende
skabelon rammer, mangler nu en regel — søgningen står i "CSS-migrering" nedenfor.
Begge døde filer (`assets/stil.css`, `assets/sider.css`, 544 linjer i alt) er slettet.

**(f) Regression.** 0 klippede etiketter (46 katalogkort × 1440/360 × da/en, streng
test). `node tools/validate.mjs`: 0 fejl. `node tools/linktjek.mjs`: 0 døde links.
Begge sprog bygger (125 sider). Én PRÆ-EKSISTERENDE (ikke introduceret af dette spor)
horisontal overløbsfejl fundet og rettet undervejs (se "Regressionssweep" nedenfor).

**(g) Skærmbilleder.** Se "Skærmbilleder" nedenfor for stier.

---

## Opgave 1: robotdetaljesidens designløft

### Rodårsagen var ikke layoutet i robot.mjs — det var CSS'en, der aldrig fandtes

robot.mjs skrev `<header class="robot-top"><figure class="robot-foto">…</figure>
<div class="robot-navn">…</div></header>` allerede fra sin første commit. Men
`.robot-top`, `.robot-foto`, `.robot-navn`, `.retur`, `.side`, `.skema`, `.eu-blok`,
`.stribe--fem` og mange flere klasser havde ALDRIG en regel i `system.css` eller
`generator.css` — kun i den aldrig-linkede `assets/sider.css` (dokumenteret i
`fund/FUND-test.md`, aldrig rettet). Uden en `grid-template-columns`-regel var
`.robot-top` et umarkeret blokelement: billedet (16:10, fuld rækkebredde) fyldte op
til 845 px i højden alene, og navnet blev skubbet ned under enhver rimelig
skærmhøjde. Det var derfor billedet "fortrængte" navnet, ikke at robot.mjs's egen
komposition var forkert.

Rettelsen (commit `6fa94cf`) er derfor primært en CSS-**migrering**, ikke en
omskrivning: `sider.css`'s allerede skrevne `.robot-top{display:grid;
grid-template-columns:minmax(0,7fr) minmax(280px,5fr)}` (≥900 px) er flyttet ind i
`generator.css`. Under 900 px, hvor kolonnerne stakkes, kom to selvstændige
narrow-width-rettelser til, begge målt:

1. **`.baand nav a`** fik mindre vandret luft under 420 px (`padding:0 10px;
   font-size:14px` mod `0 14px`/`15px`). Målt: nav'et gik fra 3 rækker til 1 ved
   360 px — **160 px → 114 px**, en besparelse på **46 px på ALLE sider**, ikke kun
   robotsiden (berøringsmålet 44 px er urørt).
2. **`.robot-foto .billedled--stor:not(.billedled--maal)`** fik `max-height:190px`
   under 900 px bredde. `:not(.billedled--maal)` holder måltro-pladen udenfor, fordi
   dens `--bw`/`--bh`-procenter er udregnet ud fra en fast 16:10-boks og ville blive
   forvredet af en håndregnet højde — kun rigtige fotografier beskæres
   (eksisterende `object-fit:cover` gør beskæringen, ingen ny mekanik).

### Advarselsbokse: fem åbne blokke → én foldet disclosure

Robotsidens nøgletalsstribe (fem felter: egenvægt, nyttelast, driftstid, hastighed,
IP-klasse) kunne hver bære en advarsel- eller variantboks under sig, alle udfoldet
som standard — målt på Boston Dynamics Spot: 3 af 5 felter havde en boks, hver en
venstrestillet blok med tom højrespalte ved siden af sig.

`robot.mjs`'s `stribe()`-funktion pakker dem nu i `<details class="stribe-under-fold">`
med en kort opsummering ("Afvigelser og varianter i nøgletallene (N)"), lukket som
standard. **Ingen tekst er fjernet** — hvert felts fulde advarsel og variant-liste står
uafkortet i `.stribe-under-krop`, kun standardtilstanden er ændret. Se skærmbillede
`detalje-skema-open.png` (åbnet, viser fuld tekst for to felter). De fire datatilstande
i selve striben (tal/nul/ja/nej/ikke-oplyst) er urørte af denne ændring.

### Highrespalten arbejder nu

Ved ≥900 px står producent/land/status, robotnavn, vægtklasse, anvendelsesmærker,
variantnavne og "Se alle modeller fra …"-linket alle i højrespalten, side om side
med billedet — ikke længere under det. Se `RAPPORT-efter-1440.png` mod
`RAPPORT-foer-1440.png`.

### Metodenote: hvorfor 360×740 og ikke 360×667

Ingen af DESIGN.md, PRODUCT.md eller briefet angiver en højde for "360 px" —
kun 1440 er parret med en dokumenteret højde (900, "Åbningens budget"). Jeg har
derfor selv valgt **360×740** (en almindelig Android-referencehøjde) som den
formelle parring, af samme logik som 1440 er parret med 900: en bredde uden en
skærmhøjde er ikke en fuld viewport-påstand. Ved den højde: H1-bund 694 px < 740 px,
komfortabel margen. Ved den mindste stadig almindelige telefon (iPhone SE, 667 px):
producent/status (626 px) er fuldt synlig, men H1's nederste kant (694 px) rækker
**27 px** ud over 667 — kun toppen af bogstaverne er synlig der. Jeg har IKKE presset
billedhøjden yderligere ned for at lukke den sidste margen: DESIGN.md's ledestjerne
("maskinen står frit på hvid plade") sætter en grænse for, hvor meget et fotografi må
beskæres for et layoutmål alene, og gevinsten (677→657 px ved endnu en
beskæringsrunde) stod ikke mål med tabet i billedets læsbarhed. Dette er skrevet
ærligt frem, ikke skjult: kravet er opfyldt ved den dokumenterede, begrundede
konvention (360×740), men ikke ved den mindste tænkelige telefon.

---

## Opgave 2: kildemærker ud af tab-rækkefølgen

### Målemetode

`scratchpad/pw/detalje-tabstop.mjs`: Playwright trykker `Tab` gentagne gange fra
sidens top og læser `document.activeElement` efter hvert tryk, indtil det fokuserede
element er (eller ligger inde i) det 5. `.kort`-element i DOM-rækkefølgen — samme
rækkefølge, en skærmlæser eller tastaturbruger møder dem i. Kørt mod `/da/robotter/`.

### Resultat: 47 → 39 (målt, ikke briefets illustrative overslag)

Briefets regnestykke ("46 kort × op til 4 mærker = de første 40 tab-tryk når ~5
kort") var et illustrativt loft, ikke en måling af DETTE datasæt. Den faktiske
fordeling: af de første 5 kort (sorteret efter vægtklasse, som katalogsiden gør) har
kort 1 og 4 slet ingen kildemærker (posten har kun én kilde — designsystemets egen
regel er, at bogstaver kun står på kortet, når der er mere end én), kort 2 og 3 har 4
hver, kort 5 har 3. Da robotnavnets link står FØR nøgletalsstriben i DOM'en (og
dermed før dens kildemærker), tælles kun kort 1–4's 8 kildemærker med i vejen til
kort 5's eget navnelink — kort 5's egne 3 kommer efter. **47 − 39 = 8**, nøjagtigt
kortlagt til de 8 kildemærker i kort 1–4 (efterprøvet ved separat optælling: `git
grep -c` på hvert korts `class="kildemaerke"`-forekomster).

Fixet i sig selv virker BREDERE end denne ene måling viser: hele siden
`/da/robotter/` bærer **98** kildemærker, og alle 98 har nu `tabindex="-1"`
(efterprøvet: `(html.match(/tabindex="-1"/g)||[]).length === 98`). Robotsidens egne
kildemærker (op til 33 felter × 1 hver) og producentsidens EU-tabel er ramt af
samme rettelse, fordi de alle kalder den samme `kildemaerke()`-funktion i side.mjs.

### Løsningen: `tabindex="-1"`, ikke et ikke-link

Overvejet og fravalgt: at gøre kildemærket til et rent visuelt tegn (`<span
aria-hidden>` eller `<abbr>` uden `href`), samme mønster som `forbehold--tegn`.
Fravalgt fordi det ville have fjernet en RIGTIG, brugbar navigationsmulighed (klik
direkte til kilden) for MUSE- og skærmlæserbrugere, ikke kun for
tastaturrækkefølgen — DESIGN.md beskriver eksplicit kildemærket som noget, "der
peger på kildelisten nedenfor".

`tabindex="-1"` løser præcis det, briefet efterspurgte, uden det tab: linket
forbliver et rigtigt `<a href>` (stadig klikbart, stadig i tilgængelighedstræet — en
skærmlæser, der læser sekventielt (browse mode), møder det stadig og kan aktivere
det), kun VEJEN dertil via sekventiel Tab-navigation er lukket. Det er den
etablerede WAI-ARIA-teknik for et sekundært link, der ikke skal konkurrere med
sidens primære indhold om tastefokus.

---

## Opgave 3: detektorfundene

### (a) `span.maerke` 1,1:1 — reel bug, fundet og rettet

**Root cause, sporet linje for linje:** `system.css`s `.billednote .maerke`-regel
(banner-badgen "BILLEDER") satte `color:var(--paafod)` (næsten hvid, beregnet til
14,88:1 mod den mørke `--fod`-baggrund) men **satte aldrig sin egen `background`**.
Den generiske `.maerke{background:var(--panel-ro)}`-regel længere nede i filen
(anvendelseskategoriernes badge) ramte derfor stadig `background`-egenskaben på
BILLEDER-badgen — cascade virker egenskab for egenskab, ikke regel for regel, så
`.billednote .maerke`s højere specificitet på `color` forhindrede intet i, at
`.maerke`s `background`-deklaration stadig vandt. Resultatet: næsten-hvid tekst
(paafod, #E6E9EE) på en næsten-hvid baggrund (panel-ro, #F7F8FA), **selvstændigt på
netop dette ene element** — ikke en fejl i en forfaders baggrund, som jeg først
antog og undersøgte (og afkræftede) via Playwright, før jeg fandt den rigtige linje.

**Rettelse:** én linje, `background:transparent` tilføjet til
`.billednote .maerke` (system.css). Badgen sidder nu direkte på billednotens egen
mørke bund, som resten af båndet.

**Efterprøvning:** målt 14,88:1 på `unitree-go2` (nøjagtig den værdi, kildens egen
kommentar allerede påstod for `--paafod` på `--fod`). Bredere sweep: 191
`.maerke`-forekomster på 4 sider (forside, katalog, en producentside, en robotside
på engelsk) — 0 under 4,5:1, laveste 5,35:1 (det allerede dokumenterede,
uændrede `blaek3`:`tom`-par for "ikke oplyst"-mærker).

### (b) `span.midlertidig` 10,5 px — kontraktens gulv, ikke en fejl

Målt ved 360 px (den smalleste ombrydning, hvor detektoren typisk rammer): **10,5 px
nøjagtigt**, ikke under. DESIGN.md er eksplicit: *"10,5 px er skriftgulvet i hele
systemet, også i den smalleste ombrydning."* Dette ER gulvet, ikke et hul under det.
Kontrast målt samtidig: **6,16:1** (`blaek3` på hvidt panel — samme værdi, DESIGN.md
allerede dokumenterer for det par), langt over AA's 4,5:1.

**Dom:** BEHOLDES uændret. Detektorens 11 px-tommelfingerregel taber eksplicit til
kontrakten her, præcis som briefet forudsagde — men det er kun fordi kontrakten selv
allerede har en begrundet, målt, dokumenteret 10,5 px-grænse med tilstrækkelig
kontrast, ikke fordi jeg har sænket et krav.

---

## Opgave 4: arv fra tidligere spor

### (a) producent.mjs's minikort — rettet ved kilden, ikke ved kaldestedet

`fund/FUND-kort.md` (et tidligere spor) fandt, at producent.mjs's minikort stadig
viste den fulde, altid-synlige "Advarsel"-ordchip, fordi producent.mjs kalder
robot.mjs's `vaerdi()`/`forbehold()` i stedet for side.mjs's `felt()`/`fnote()` (som
et andet spor allerede havde rettet for kataloget 24. aug).

Rettet i `robot.mjs`s `forbehold()`-funktion (den ENE funktion, begge sider går
igennem): fra `<abbr class="forbehold">Advarsel</abbr>` (altid synligt ord) til
samme hævede `*`-tegn, samme klasse (`forbehold--tegn`, allerede levende i
system.css), samme mønster som side.mjs's `fnote()`. Den fulde tekst ("Advarsel: …")
står stadig i `title` og i en skærmlæsertekst (`.kunskaerm`) — intet ord er fjernet,
kun den altid-synlige chip er skiftet til et tegn.

**producent.mjs er IKKE ændret for dette punkt** — det var netop pointen: fordi
begge sider kalder den samme funktion, arver producentsiderne rettelsen uden et
eget kaldested at røre. Efterprøvet: `dist/da/producenter/*/index.html` bærer nu
`class="forbehold forbehold--tegn"` på minikortenes forbehold, 0 forekomster af den
gamle, altid-synlige "Advarsel"-chip.

### (b) De 46 hjemløse CSS-selektorer

Metode (`scratchpad/detalje-css-verificer.mjs`): hver `class="…"`-streng i alle fem
skabeloner (`forside.mjs`, `katalog.mjs`, `robot.mjs`, `producent.mjs`, `side.mjs`)
udtrukket maskinelt og krydstjekket mod hver `.klasse`-selektor i `system.css` +
`generator.css`.

- **Migreret:** hele det anvendelige indhold af `assets/sider.css` (130
  regelblokke) er flyttet til `generator.css`, afsnit 9 (`.side`, `.retur`,
  `.robot-top`, `.robot-foto`, `.robot-navn`, `.stribe--fem`, `.stribe-under`,
  `.eu-blok`, `.produktside`, `.anvendelse-citat`, `.skema`, `.noter`, `.kilder`,
  `.producent-top`, `.eu-tabel`, `.prodliste` m.fl.).
- **To rettelser fra en ren kopiering:** `.advarsel` og `.v-tekst` er bevidst
  UDELADT (generator.css §4 definerer dem allerede med andre, LEVENDE værdier — at
  kopiere sider.css's udgaver ved siden af ville have genskabt præcis den
  dobbelt-definitions-fælde, DESIGN.md advarer imod for `stil.css`/`sider.css` selv).
  Det gamle `.arvet` er erstattet af `.anvendelse__arv` (BEM), fordi arve-markeringen
  nu bærer et navn og et link (se punkt 4c) i stedet for rå tekst.
- **To huller fundet af min EGEN efterprøvning** efter første migreringsrunde:
  `.feltvaerdi` (robot.mjs's `feltKrop()`/`stribe()` pakker hver værdi i den — uden
  regel sprang `.stribe .krop`s højdemål mellem celler med/uden kildemærke) og
  `.variant`/`.variant--navn` (robot.mjs's EGEN `varianter()`, en anden markup-form
  end den flade dt/dd-version, generator.css §4 allerede dækkede — de to
  sameksisterer nu via forskellig specificitet). Begge var allerede en del af de 44
  navngivne klasser i `fund/FUND-test.md`, jeg havde blot overset dem i første
  omgang; fundet ved samme maskinelle gennemgang, IKKE ved at læse listen igen.
- **Endeligt tjek:** 43 af 44 dækket automatisk; den 44. (`.anvendelse`, en bar
  `<section>`-klasse) har aldrig haft en regel i NOGEN af de to døde filer heller
  (efterprøvet med samme søgning mod dem) — den er et rent semantisk hook, ikke et
  hul.
- **Slettet:** `assets/stil.css` (254 linjer) og `assets/sider.css` (290 linjer),
  544 linjer i alt. Bekræftet ALDRIG i bygget: `ls dist/*.css` gav præcis
  `system.css`/`generator.css`, før og efter sletningen.

Playwright-efterprøvning: variant-chips (`unitree-go2`) og den foldede
`stribe-under` (`boston-dynamics-spot`) begge screenshottet med korrekt border,
baggrund og typografi — se "Skærmbilleder".

### (c) De 7 røde tests

| Test | Status | Hvad blev rettet |
|---|---|---|
| katalogtabellen markerer varianter | **RETTET** | `felt()` sætter `maerke--varianter` på kompakte stribeværdier med en `varianter`-blok |
| interval 18-25 kg kollapser ikke til midtpunkt | **RØD (uafklaret)** | Produktbeslutning, ikke en filfejl — se nedenfor |
| L27: samme kategorier, samme indeks (robots.json) | **RØD (uafklaret)** | Sporet til `build.mjs` (forbudt fil) — se nedenfor |
| L27: samme rækkefølge på siderne | **RETTET** | `anvendelse()` sorterer nu via `skema.mjs`s `sorterAnvendelse()` |
| Alle tre kategorier vises | **RETTET** | `anvendelseMaerker()`/`maerker()` sætter `anvendelse__maerke--<værdi>` (BEM) |
| Arven vises med navn og link | **RETTET** | Se nedenfor |
| Den arvede side siger "vores slutning" | **RETTET** | `anvendelse_forklaring_arvet` bruges, når `arvet_fra` er sat |

**Arve-funktionen (den mest indgribende rettelse):** `side.mjs`s `hjaelp.anvendelse()`
returnerede aldrig `arvet_fra`, selv om robot.mjs's egen kontraktkommentar
dokumenterede feltet — arve-blokken var derfor ALTID tom, uanset data. Rettet:
`anvendelse()` returnerer nu `arvet_fra`, og `robot.mjs`s `anvendelseBlok()` slår
moderen op i `ctx.robotter` (bygget giver hele robotlisten med i `ctx` — samme
"udvidelse ud over den låste kontrakt" som `ctx.billede` allerede er) og bygger et
rigtigt `<a href>` med moderens navn. Alle tre nødvendige i18n-nøgler
(`anvendelse_arvet_fra`, `anvendelse_arvet_forklaring`, `anvendelse_forklaring_arvet`
— sidstnævnte indeholder allerede "vores slutning") fandtes FØR dette spor i
`data/i18n/{da,en}.json`, forberedt men aldrig kaldt fra nogen skabelon.

**Testrettelse, ikke kravsænkning:** assertionens forventede href
(`href="../l-mor/"`) var en aldrig-efterprøvet antagelse om, hvordan `sti()`
opløser en robotside-til-robotside-henvisning. Målt direkte: den REELLE, allerede
grønne "Se alle modeller fra …"-test på samme side bruger samme mekanisme og
producerer `../../../da/producenter/…/` — den lange, absolut-fra-sprogroden form,
fordi `ctx.url.robot()` (som bygget altid leverer) vinder over `sti()`s korte
fallback. Testens streng er rettet til den MÅLTE, korrekte form
(`../../../da/robotter/l-mor/`), efterprøvet direkte i
`tests/.tmp-koersel/dist-klasse/`. Kravet — et rigtigt link, moderens rigtige navn —
er uændret og skærpet, ikke sænket.

### De 2 tilbageværende røde tests — hvorfor de IKKE er rettet

1. **"interval 18-25 kg kollapser ikke til sit midtpunkt"** — `side.mjs`s
   `vaegtIKg()` regner et interval som `(min+maks)/2` for at afgøre vægtklassen.
   18–25 kg bliver til 21,5 kg → `20_40`, selv om 18 kg reelt er `under_20`. At
   rette DETTE kræver en beslutning om, HVAD den korrekte regel skal være (nedre
   grænse? et "grænsetilfælde"-flag, den gamle model havde og som blev fjernet med
   vilje? noget tredje?) — ikke en bugfix i en linje. Jeg har ikke autoritet til at
   træffe den beslutning i dette spor, og en gættet regel kunne rette denne test
   forkert og skjule et rigtigt datafejlsignal senere. Står bevidst rød.
2. **"to filer med samme kategorier i modsat rækkefølge giver samme indeks (L27)"**
   — `robots.json`s `anvendelse.vaerdi` bygges IKKE af `hjaelp.anvendelse()` (som nu
   er rettet), men af en helt separat, uafhængig kopi af samme udregning direkte i
   `build.mjs` (L363-372: `(Array.isArray(a.vaerdi) ? a.vaerdi :
   [a.vaerdi]).map((v) => tilstandAf(v) ?? v)`, ingen sortering). `tools/build.mjs`
   er eksplicit forbudt i dette spor ("FORBUDT: … tools/build.mjs"). Roden er sporet
   til en konkret linje, ikke til ukendt territorium — men den linje ligger i en fil,
   jeg ikke må røre. Robotsidens EGEN visning af samme data ER rettet (se tabellen
   ovenfor) og er allerede grøn.

---

## Regressionssweep

`scratchpad/pw/detalje-regression.mjs`: alle 46 robotsider × 2 sprog × 2 bredder
(184 sidevisninger), `<details>` tvangsåbnet, scannet for horisontalt sideoverløb
(`document.documentElement.scrollWidth > clientWidth`) og for klip på
`.robot-top`/`.robot-navn`/`.skema`/`.stribe-under-fold`/`.eu-blok`/
`.varianter .variant`/`.anvendelse__arv`/`.robot-varianter`.

**Første kørsel:** 0 klip-fund, men 4 sider med horisontalt overløb
(`xiaomi-cyberdog-1`/`-2`, da+en, ved 360 px). Sporet til en rå URL uden mellemrum i
robottens `noter`-felt (dokumentation af en JS-bundle-kilde). Efterprøvet mod
grenens startpunkt (`cfe32a3`, midlertidig worktree): fejlen var **allerede der FØR
dette spor** (431 px scrollWidth mod 360 px klientbredde) — `.noter li` fik først en
regel med denne migrering og manglede blot `overflow-wrap:break-word`, samme
princip `.stribe .v` allerede bruger andetsteds i systemet.

**Rettet** (commit `c649b4e`). **Anden kørsel:** 0/184 med overløb, 0 klip-fund.

Katalogsiden (delt kode: `felt()`, `kildemaerke()`) efterprøvet separat ved 1440/360,
da/en, streng klip-test på `.v`/`.maerke`/stribens celler: **0 klip**.

---

## Byg, validering, test — de endelige tal

```
node tools/build.mjs      125 sider, 0 fejl (1 datavarsel, uændret, ikke relateret)
node tools/validate.mjs   46 fil(er) · 0 fejl · 1 advarsel (samme, uændret)
node tools/linktjek.mjs   3051 interne links · 0 døde · 0 uopnåede producentsider
node tests/koer.mjs       195 ok / 2 fejl (var 190 ok / 7 fejl)
```

---

## Skærmbilleder

Alle stier i `scratchpad/pw/` (session-scratchpad, ikke i repoet):

- `RAPPORT-foer-1440.png` / `RAPPORT-efter-1440.png` — robotsiden, 1440×900, før/efter
- `RAPPORT-foer-360.png` / `RAPPORT-efter-360.png` — robotsiden, 360×800, før/efter
- `detalje-skema-open.png` — den foldede `stribe-under-fold` åbnet, Boston Dynamics
  Spot, viser to felters fulde advarselstekst uafkortet
- `detalje-variant-chip2.png` — variant-chips ("AIR ca. 7 kg", "PRO ca. 8 kg") med
  border og baggrund efter `.variant`-CSS-rettelsen

---

## Selv-tjek med tælling

- **H1/producent/status-position** målt to gange (før min sidste ændringsrunde og
  efter), begge gange identisk (275,6/239,3 px ved 1440; 661,5/625,2 px ved 360) —
  ingen utilsigtet regression mellem de to målinger.
- **Tab-stop-tælling efterprøvet ved separat optælling**: 8 kildemærker talt i
  kort 1–4's HTML direkte (`class="kildemaerke"`-forekomster pr. kort), matcher
  præcis 47−39=8 fra den uafhængige Playwright-tastatursimulering.
- **98 kildemærker på `/da/robotter/`** talt to gange (regex-optælling af
  `class="kildemaerke`, og separat af `tabindex="-1"` co-forekomst) — samme tal
  begge veje.
- **191 `.maerke`-kontrastmålinger** kørt over 4 sider, alle med faktisk
  Playwright-gengivet farve (ikke token-par i teorien), 0 under 4,5:1.
- **43/44 CSS-klassers dækning** efterprøvet maskinelt mod den ENDELIGE
  `generator.css`+`system.css` efter alle commits, ikke mod en mellemtilstand.
- **184 sidevisninger** i regressionssweepet, kørt to gange (før og efter
  `.noter li`-rettelsen): 4 fund → 0 fund.
- **7 testnavne** gennemgået enkeltvis mod deres nye `ok`/`FEJL`-status i den
  endelige `node tests/koer.mjs`-kørsel — 5 grønne, 2 røde, matcher tabellen ovenfor.

**Fejl fundet under selv-tjek:** 2 — begge rettet undervejs, ikke efterladt: (1) den
manglende `overflow-wrap` på `.noter li` (fundet af regressionssweepet, rettet i
`c649b4e`), (2) `class="t-mikro anvendelse__arv"` i stedet for
`class="anvendelse__arv"` alene, som fik den første version af arve-testen til at
fejle på en regex, der kun matcher én ren klasse (fundet ved at køre testen isoleret
og undersøge dens boolean-nedbrydning felt for felt, rettet ved at give
`.anvendelse__arv` sin egen fulde typografi i stedet for at dele klasse med
`.t-mikro`).

---

## Selv-review — hvad jeg er usikker på, og hvad jeg ikke nåede

- **360×740-konventionen er min egen, ikke CEO'ens.** Jeg har begrundet valget
  (parallelt med 1440×900) og skrevet det tydeligt frem sammen med det ærlige
  modeksempel (iPhone SE, 667 px, hvor H1's underkant rækker 27 px for langt). Hvis
  CEO'en mener 360-målingen skal holde til den mindste telefon, ikke en
  Android-gennemsnitshøjde, er der 27 px tilbage at finde — sandsynligvis ved
  yderligere at komprimere `.robot-foto`s billedhøjde, på bekostning af DESIGN.md's
  ledestjerne om et ubeskåret fotografi. Jeg har bevidst IKKE presset det
  yderligere, fordi jeg ikke kan afveje "øget håndterbarhed på den absolut mindste
  telefon" mod "et mere beskåret fotografi" uden en redaktionel afgørelse, jeg ikke
  har mandat til.
- **Tab-stop-tallet (47→39) er lavere end briefets illustrative "op til 40".** Jeg
  har forklaret nøjagtigt hvorfor (DOM-rækkefølgen betyder, at kun kort 1-4's, ikke
  kort 5's egne, kildemærker tælles med til at NÅ kort 5) og bekræftet, at den
  bredere effekt (98 kildemærker på hele siden) er reel og stor — men hvis briefets
  "40" var en målt forventning og ikke et illustrativt loft, bør nogen efterprøve,
  om jeg har misforstået, hvilket "kort 5" der menes (fx det 5. SYNLIGE kort efter
  et andet filter-scenarie, ikke det 5. i den usorterede DOM).
- **De to røde tests kan i teorien allerede være kendt/planlagt af et andet spor.**
  Jeg har sporet begge til konkrete linjer i filer, jeg ikke ejer (side.mjs's
  vaegtIKg for den ene — ejet af MIG, faktisk, men blokeret af en produktbeslutning,
  ikke en filgrænse — og build.mjs for den anden). Jeg har ikke haft adgang til
  andre spors interne status ud over det, kildekodens egne kommentarer viser.
- **Jeg har ikke kørt en skærmlæser (NVDA/VoiceOver) manuelt** på `tabindex="-1"`-
  ændringen. Min påstand om, at et sekventielt læst indhold stadig når linket, er
  baseret på den dokumenterede ARIA/HTML-adfærd (tabindex="-1" fjerner kun fra
  SEKVENTIEL tastaturnavigation, ikke fra tilgængelighedstræet eller
  browse-mode-læsning), ikke på en faktisk assistive-teknologi-test — jeg har ikke
  værktøj til det i dette spor.
- **De 4 originale horisontale-overløbsfund var en overraskelse, ikke noget briefet
  nævnte.** Jeg fandt og rettede dem, fordi mit eget regressionssweep dækkede bredere
  end de eksplicit navngivne opgaver — men jeg har IKKE kørt tilsvarende sweeps for
  producentsiderne (kun robotsider + katalogsiden er dækket) eller for forsiden
  (uden for min ejerskab). Der KAN være tilsvarende, uopdagede overløbsfejl på
  producentsider, jeg ikke har set.
- **`.anvendelse__note`-klassen** (den ekstra forklarende linje under arve-linket,
  "Producenten skriver intet om denne udgave…") er min egen tilføjelse, ikke krævet
  af nogen test — den bruger en allerede eksisterende i18n-nøgle
  (`anvendelse_arvet_forklaring`), som ellers ville have stået ubrugt, men ingen
  test beviser, at den faktisk hjælper læseren. Et rigtigt bruger- eller
  kritikblik på hele arve-blokkens tekstmængde (tre afsnit: arv, forklaring,
  kilde) er ikke indhentet.
