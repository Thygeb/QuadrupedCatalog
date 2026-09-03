# PLAN — katalogsidens flade

**Spor:** `spor/katalogplan`, 3. sep 2026. **Metode:** `impeccable shape` (L70).
**MODE: Operate** — den besøgende løser en opgave: at afvise de robotter, der ikke kan
bruges, og nå frem til de få, der kan. Ikke Read.

**Leverancen er en plan, ikke en rettelse.** Designfrysen (L70) gælder: intet herunder er
udført. Hvert forslag bærer et acceptkriterium, så det kan sendes videre som brief.

**Substitution, oplyst efter `impeccable shape`s egen regel:** skillen forlanger en
interviewrunde, før en plan skrives. Dette spor er en subagent uden `AskUserQuestion` og
uden anden struktureret spørgemekanisme — der findes ingen at spørge herinde. Jeg har
derfor brugt briefets låste krav som interviewets svar og **mærket hver antagelse, jeg
selv har lagt til**, med *(antagelse)*.

---

## 0. Fladen er både forside og katalog — og hvem der vinder

**Målt (1440 px, egen browser, dist bygget i denne worktree):**

| | |
|---|---|
| Sidehøjde | **6.685 px** |
| Øverste kant af søgefeltet | **y = 1.078 px** |
| Filtergitteret | y ≈ 1.144 → 1.470 (**326 px**) |
| Kort på fladen | **86** `.kort` — 77 unikke + **9** `kort--seneste` i `.net--seneste` |

Den besøgende scroller altså **en hel skærmhøjde**, før hun møder det første betjenings-
element, og bruger derefter 326 px på et panel, hvis ni titler fylder 17 px tekst hver.

**Begge læsere skal blive — men instrumentet vinder pladsen.** PRODUCT.md's primære læser
(den nysgerrige fagperson, ankommer *uden* modelnavn) har reelt brug for åbningen: den er
det eneste på siden, der siger, hvad feltet **er**, før man begynder at filtrere det. At
slette den ville tjene den sekundære læser og svigte den primære — præcis den ombytning,
L31 vendte tilbage.

Det, der er galt, er ikke at åbningen findes. Det er, at **den koster en skærmhøjde, og at
værktøjet derefter bruger 326 px på luft.** J1, J2 og J3 er symptomer på det samme.

**Forslag 0.1 — åbningen beholder sine ord og mister sit dublerede gitter.**
De 9 `kort--seneste` er ni af de samme 77 kort, vist igen ~1.000 px højere oppe; fladen
tegner 86 kort for at vise 77 robotter. Erstat stribens ni kort med åbningens tekst plus
**de tal, hun er ved at filtrere efter** — de står allerede på siden og er producentoplyste
optællinger, ikke nye tal: inspektion 41, forskning 34, sikkerhed 33, forsvar 30,
industri 30, forbruger 18, logistik 12, ikke oplyst 8.

> **Dette er planens eneste forslag, der ændrer indhold og ikke rytme.** Det skal
> godkendes for sig. Alt andet herunder rører kun afstand, størrelse og klasse.

**Mekanisk vagt, der gør det sikkert:** `tools/build.mjs:144` tæller strengen
`<article class="kort">` ordret og påstår (`:363`) ét kort pr. datafil. De ni bærer
`kort--seneste` som variant og tælles derfor **ikke** med — bygget rapporterede
"Kort i kataloget: 77" med alle 86 til stede. At fjerne de ni ændrer ikke tallet.

**Acceptkriterium 0.1:** `kort--seneste` 9 → 0 · `.kort` på kataloget 86 → 77 ·
`node tools/build.mjs` siger fortsat "Kort i kataloget (sprogroden): 77".

**Målsætning for 0 + J1–J3 tilsammen:** første betjeningselement over **y ≈ 700** ved
1440, filtergitteret **≤ 240 px**.

---

## J1 — polstringen omkring søgefeltet

**Reglen, briefet ikke kunne finde, hedder `.sog` — ikke `.soeg`, ikke `.search`.**
`system.css:1492` (`.sog`) og `system.css:1500` (`.sog input`). Briefets nul var et
forkert søgemønster, som formodet.

Feltet ligger i `<div class="sog" data-sog="katalog" hidden>` og afsløres af
`assets/katalog.js` — uden JavaScript findes søgningen ikke.

**Målt indeni (1440):** `font-size:16px` · `min-height:44px` · `padding:9px 14px` ·
faktisk højde **45 px** · etiket `.etiket` 11,5 px · `gap:6px`.

**Det afgørende fund: indersiden er allerede justeret af JPK selv.** Kommentaren
`system.css:1494–1499` skriver anledningen ordret — *"JPK 1. sep 2026: 'søge feltet og
teksten padding'"* — feltet var **50 px højt med 12 px lodret polstring** og blev bragt
ned på 16/9, fordi to gulve er ufravigelige: **44 px berøringsmål** og **16 px
skriftgrad** (under den zoomer iOS Safari selv ved fokus). 16 px + 9 px lander **lige på**
gulvet. Der er ingen luft tilbage indeni.

**Målt udenom: nul.** `.sog{margin:0;padding:0}`, og i browseren
`luft over søgefeltet = 0` og `luft fra søgefelt til facetgitter = 0`. Blokken støder
direkte op mod `<details>`-kanten over og facetgitteret under.

**Konklusion:** J1 er et **udvendigt** problem. Beder man om mindre polstring indeni,
brydes et gulv, JPK selv satte for to dage siden. Beder man om polstring *omkring*, er
der ingen at reducere — der er ingen.

**Forslag J1.1 — søgefeltet får sit eget bånd.** 24 px (`--r5`) over og under `.sog`
inde i `.udtraek`, så feltet læses som panelets første instrument frem for som et låg
svejset på facetgitteret. **Ingen ny streg** — facetgitterets første række har i dag ingen
overkant, og luften alene adskiller (L40: færre streger, ikke flere).

**Acceptkriterium J1.1:** luft over og under `.sog` begge **≥ 16 px** målt i browseren ·
`.sog input` højde fortsat 44–45 px · `font-size` fortsat 16 px.

---

## J2 — filtrenes skriftstørrelse

**Målt i det byggede filterpanel (`.udtraek`-undertræet, 1440, kun elementer med synlig
tekst): ti forskellige skriftgrader.**

| px | antal | eksempel |
|---|---|---|
| 17 | 119 | arvet body — `.rk__mrk`, containere |
| 14 | 39 | `.rk__navn` — **selve filterteksten** |
| 13,5 | 5 | `.chip__navn` |
| 13 | 82 | `.antal` — optællingerne |
| 12,5 | 2 | `.chip-fod` |
| 12 | 52 | `.deling`, `.d__tal` |
| 11,5 | 1 | `.etiket` (søgefeltets) |
| 11 | 16 | `.facet__navn` — **gruppetitlen** |
| 10,5 | 4 | `.facet__tal` |
| 10 | 11 | `.skala__ridse-tal` |

Til sammenligning: **53** forskellige `font-size`-værdier i de to stilark i dag
(`impeccable typeset` målte 55 den 1. sep — tallet er faldet med to, ikke steget).

**Retningen er ned for titlen — men den egentlige rettelse er færre trin, ikke et nyt.**

Begrundelsen ligger i MODE Operate. Det, hun læser for at vælge, er `.rk__navn` (14 px) og
dens tal (13 px). Gruppetitlen, som hun skal læse **først** for at vide, hvad gruppen er,
står på **11 px versaler med `letter-spacing:.17em`** (målt 1,87 px). **Hierarkiet er
vendt om:** etiketten, der orienterer, er mindre og dyrere at læse end de valg, den
introducerer.

**Forslag J2.1 — panelet får tre trin i stedet for ti:**

1. **Gruppetitel** `.facet__navn` 11 px → **12 px**, og sperring `.17em` → **`.09em`**.
   *Hvorfor `.09em`:* det er den værdi, `.typeskilt .maerke` allerede bruger — et
   eksisterende trin genbruges, i stedet for at et ellevte opfindes.
2. **Valgteksten** `.rk__navn` **14 px, uændret.** Den er læsestørrelsen, og den virker.
3. **Tal og undertekster** `.antal` (13) og `.facet__tal` (10,5) → begge **12 px**.
   10,5 px er systemets erklærede gulv, og en optælling er ikke en fodnote.
   `.chip__navn` 13,5 → **14** (slår sammen med valgteksten), `.skala__ridse-tal`
   10 → **12** (slår sammen med tallene).

**Nettoresultatet er færre størrelser, ikke flere** — det er hele pointen ved briefets
advarsel om "så er den 56". Ingen ny værdi indføres; fire eksisterende fjernes fra panelet.

**Acceptkriterium J2.1:** forskellige skriftgrader med synlig tekst i `.udtraek` **10 → ≤ 4**
(målt med samme script) · forskellige `font-size`-værdier i de to stilark **stiger ikke
over 53**.

---

## J3 — luften mellem filterteksterne

**Briefets mekanisme holder ikke i den tilstand, JPK ser. Målt strækning: 0 px.**

**Syv** af de ni facetter er 109 px, **de to nederste 108 px** — forskellen er præcis den
`border-bottom`, som `facet--sidste-raekke` fjerner på sidste række. Den **naturlige**
højde er 108 px i alle ni. Grid-strækningen forklarer altså **0 px**; de 109 er 108 plus
en ramme. Tallene er identiske ved 1440 og 1700, fordi indholdet er breddelåst — JPK's
~1.700 px-skærmbillede viser samme layout som 1440.

**Hvorfor hypotesen var rimelig og alligevel forkert:** strækningen er ægte — men kun når
en facet er **åben**. Målt: åbnes én facet, bliver den 389,5 px, og begge rækkefæller
bliver 389,5 px med. Panelets standardtilstand, sat af JPK 1. sep, er **alle ni foldet
sammen**, og det er den tilstand, skærmbilledet viser. Med alt lukket er der intet at
strække efter.

**Den faktiske nedbrydning af én lukket facet (målt, 1440):**

| Del | px | Kilde |
|---|---|---|
| `padding-top` | 24 | `.facetter__net .facet{padding:var(--r5)}` `generator.css:1297` |
| `summary` min-højde | **44** | `summary.facet__navn{min-height:44px}` `system.css:2219` |
| `margin-bottom` under titlen | 16 | `.facet__navn{margin:0 0 var(--r4)}` `generator.css:1305` |
| `padding-bottom` | 24 | samme regel som top |
| ramme | 1 | `border-bottom` — **fraværende** på de to nederste (`facet--sidste-raekke`) |
| **i alt** | **109** (108 nederst) | tekstens egen højde inde i summary: **17 px** |

**Titel-til-titel er 109 px. Tom luft mellem to filtertekster: 65 px.** Det er JPK's
observation, målt.

Tre af de fire tal kan bedømmes hver for sig:

- **44 px er låst.** Det er JPK's eget berøringsgulv, og `system.css:2211–2216` skriver
  hvorfor: uden egen `min-height` er `<summary>`s klikflade kun tekstlinjens 20 px, fordi
  `.facet__navn` **aldrig** arver højde fra facettens polstring — den ligger udenom. **Rør
  den ikke.**
- **De 16 px er dødvægt, når facetten er lukket.** Marginen findes for at skille titlen fra
  valgrækkerne — og når facetten er lukket, er der ingen rækker. Det er 16 px rent
  ingenting, ni gange.
- **De 2 × 24 px er panelets ydre rytme** og kan gå ét trin ned til `--r4` uden at røre et
  gulv.

**Forslag J3.1 — fjern den margin, der adskiller ingenting, og tag polstringen ét trin ned.**

```
.facetter__net .facet{padding:var(--r4)}                       /* 24 → 16 */
.facetter__net details.facet:not([open]) > .facet__navn{margin-bottom:0}
```

**Kontrafaktisk måling, udført ved at injicere præcis de to regler i browseren:**

| | før | efter |
|---|---|---|
| Lukket facet | 109 px | **77 px** |
| Hele `.facetter__net` | 326 px | **230 px** |

**96 px sparet, 29,4 %** — uden at røre de 44 px, uden at ændre én skriftgrad, og uden at
røre den åbne tilstand.

**Acceptkriterium J3.1:** lukket facet **≤ 80 px** · `.facetter__net` **≤ 240 px** ved 1440 ·
`summed min-height` på `summary.facet__navn` fortsat **44 px** · åben facet uændret 389,5 px.

---

## F1 — mærket og knappen

**Første rettelse: `.maerke` står ikke på kataloget.** Målt over alle 107 danske sider —
den eksakte klasse `maerke` / `maerke--*` findes på **77 robotsider og ingen andre
steder**. Kataloget bærer `kildemaerke` (142 stk., 8 px), som er en anden klasse.
**Konvergensen, F1 beskriver, er et robotside-problem**, og katalogets fladeplan er det
forkerte sted at rette den. Briefets tal (11 px/29 px) genfindes i
`.typeskilt .maerke` (`system.css:1810`: 11 px, versaler, `.09em`, 1 px kant,
`--hjoerne`) — de er rigtige, de står bare på en anden flade.

**Men kataloget har sin egen udgave af sygdommen, og den er værre. Målt:**

| Element | Grad/vægt | Versaler | Sperring | Kasse | Radius | Klikbar |
|---|---|---|---|---|---|---|
| `.knap--kant` | 12/600 | ja | 1,32 px | **inset 1 px** | 2 px | ja |
| `summary.facet__navn` | 11/700 | ja | 1,87 px | ingen | 0 px | ja |
| `.kort__saml` | 9,5/700 | ja | 1,235 px | ingen | 2 px | ja |
| `.sorter label` | 12,5/600 | nej | normal | ingen | 2 px | ja |
| `.chip__krop` | 17/400 | nej | normal | skygge | 2 px | ja |
| `.rk__mrk` | 17/400 | nej | normal | ingen | 2 px | ja |

**Seks kontroller, seks visuelle sprog — og den eneste med et rigtigt knapsignal
(`.knap--kant`, den eneste med kasse) er brugt på sidens mindst betydende handling.**
Målt: katalogets `.knap--kant` er `tomt__ryd`, højde 0, altså inde i den skjulte
tomme-resultat-tilstand. Knapprimitiven er til stede på fladen og **bruges reelt ikke**,
mens de seks kontroller, hun betjener hele tiden, hver ligner noget andet.

**Forslag F1.1 — en kontrolgrammatik, ikke en omstyling.** Kataloget har præcis tre slags
kontrol, og hver får én form:

| # | Slags | Form | Klasser i dag |
|---|---|---|---|
| 1 | **Handling** — gør noget nu | `.knap` + flade-variant. **Kasse.** Versaler, 12 px | `.knap--kant`, `.knap--tekst` |
| 2 | **Tilstandsvalg** — vælger noget, der bliver stående | Etiket + mærke. **Ingen kasse; mærket bærer tilstanden.** Læsestørrelse 14 px, almindelige bogstaver | `.rk__mrk`, `.chip__krop`, `.sorter label` |
| 3 | **Afsløring** — folder en gruppe ud | `summary` + `+`/`–`. Versaler 12 px, **ingen kasse** | `summary.facet__navn` |

Forvirringen, F1 navngiver, er at (2) og (3) i dag låner (1)'s versaler og sperring **uden**
at låne dens kasse, mens (1) intet låner igen. Grammatikken lukker det uden at opfinde en ny
komponent: den siger, hvilken af de tre hver eksisterende klasse tilhører, og hvad den
**ikke må låne**.

**Og den svarer på robotsidens F1 uden at rette den her:** `.maerke` er slet ikke en
kontrol — den er en fjerde ting, **oplysning**. Under grammatikken må en oplysning ikke
bære versaler + sperring + kasse samtidig, hvilket er præcis det sæt, den deler med
`.knap--kant` i dag. På robotsiden er rettelsen derfor at tage **kassen af mærket**, ikke
at ændre knappen. Det hører i robotsidens plan; det står her, så de to planer ikke
modsiger hinanden.

**Acceptkriterium F1.1:** hver klikbar klasse på kataloget kan navngives som 1, 2 eller 3 ·
ingen klasse i gruppe 2 eller 3 bærer både versaler, sperring **og** kasse.

---

## F2 — de ti kontroller uden for knapprimitiven

**Briefets tal er efterprøvet og korrekt: præcis ti, og sammensætningen passer.** Målt på
kataloget:

- **5 ×** bart `<label for="sort-…">` **helt uden klasse**, formet gennem `.sorter label`
  (12,5 px, vægt 600, radius 2 px; den valgte har `--accent` som baggrund).
- **5 ×** `<label class="chip__krop" for="f-eg-…">` om `.chip__felt`-afkrydsninger
  (17 px, radius 2 px, panelflade, skygge).

**De skal ikke ind i primitiven, og det er planens klareste nej.**

Grunden er den samme, som gjorde `.f-sort` forkert på L77's liste: **alle ti er
`<label>` for skjulte inputs.** De *gør* ikke noget — de vælger en tilstand, der bliver
stående, og som inputtets `:checked` afspejler. `.knap` er en handlingsprimitiv:
`min-height:44px`, versaler, `:active{translateY(1px)}` og et hover, der **fylder kassen
med afmærkningsgul**.

**Den målte kollision:** `.sorter label`s valgte baggrund er `rgb(242,196,0)` = `--accent`.
`.knap`s hover-baggrund er `var(--accent)`. **Foldes de ti ind i `.knap`, kommer et hover
over en ikke-valgt sortering til at se nøjagtig ud som den valgte.** Det er ikke en smags-
sag; det er en tilstand, der bliver ulæselig.

**Forslag F2.1 — de ti får deres egen navngivne primitiv (grammatikkens nr. 2), ikke `.knap`.**
Det er en sammenlægning fra **to anonyme udtryk til ét navngivet**, ikke fra ti til nul:

- `.sorter label` og `.chip__krop` lægges sammen i én klasse med ét sæt tokens: flade,
  mærke, valgt, fokus.
- De fem sorteringsetiketter får **en rigtig klasse** i stedet for at blive formet på tag
  gennem en efterkommer-selektor. Et bart `<label>` under `.sorter` er sidens eneste
  uklassede kontrol og kan ikke findes af nogen revision.
- **Fødes med flade-varianter fra dag ét.** Ellers gentages `.nulstil`-fejlen ordret:
  en kontrol skrevet til én flade, genbrugt på en anden, målt til 1,16 : 1.

**Regel, der følger med:** `--accent` markerer **valgt**, aldrig **hover**, på et
tilstandsvalg. Hover er panelfladen (`--bund`) — den adfærd, `.rk__mrk:hover` allerede har
(målt). Én eksisterende opførsel udvides til sine to søskende; intet nyt opfindes.

**Acceptkriterium F2.1:** uklassede `<label>` på kataloget **5 → 0** · klasser, der former
et tilstandsvalg, **2 → 1** · ingen tilstandsvalg-klasse har `--accent` som hover-baggrund.

---

## Enhedskontakten — låst krav, og briefets tal skal rettes

**Målt over de 107 danske sider:**

| | antal sider |
|---|---|
| `daek__enhed` (pladsen i topbaren) | **107 / 107** |
| `class="enhedsskift"` (**etiketten**) | **107 / 107** — kataloget iberegnet |
| `id="enhedsskift"` (**selve kontakten**) | **72** = 71 robotsider + sammenligningssiden |

**Topbaren bærer altså allerede kontakten på hver eneste side.** To ting stopper den på de
øvrige 35:

1. `<input type="checkbox" id="enhedsskift">` udsendes ikke (målt til stede på robotsider,
   fraværende på katalog, 404, Om og alle producentsider).
2. `system.css:2399` sætter `.daek__enhed{display:none}`, ophævet **kun** af
   `body:has(.robotside.typeskilt .enhedsskift__boks)` og
   `body:has(.sammenligning-app:not([hidden]) .enhedsskift__boks)` (`:2411–2412`) — to
   selektorer, der nævner robotsiden og sammenligningsappen ved navn.

> **Defekt, som designhullet har skjult: 35 sider udsender et
> `<label for="enhedsskift">`, der peger på et element, som ikke findes.** En forældreløs
> etiket-reference på en tredjedel af sitet. Uanset hvad der besluttes om kontakten, må
> forældreløsheden ikke overleve: enten kommer inputtet, eller også går etiketten.

Og JPK's præmis — *"lige nu lever den kun på sammenligningssiden"* — er lidt ved siden af:
den er levende på **72** sider. Det bør han kende, før kravet vejes.

**Hvad den skal gøre ved katalogets egne tal.** Målt: kataloget har **0**
`enhedsvis--metrisk` / `--imperial` (en robotside har 12). Kortene bærer
`kort__vaerdi--hastighed` **65**, `--nyttelast` **66**, `--pris` **11**, `--dato` **46**.
**To af fire er omregnelige:** hastighed (m/s → mph) og nyttelast (kg → lb) —
**131 værdier fordelt på kortene.** Pris er en valuta, ikke en enhed; dato er ingen af
delene.

**Forslag E.1 — tre regler:**

1. Kontakten tegnes, hvor siden har mindst én omregnelig værdi, og den omregner **alle**
   sidens omregnelige værdier. Ingen side, hvor kontakten flytter nogle tal og ikke andre.
2. På kataloget betyder det kortenes hastighed og nyttelast **og filterets egne
   skalaetiketter** (`.skala__ridse-tal`, målt 11 på siden). Et nyttelastfilter, der
   stadig siger kg, mens kortene siger lb, er værre end ingen kontakt.
3. På Om og 404 er der intet at omregne — dér tegnes den **ikke**, og etiket-markup'en
   fjernes med den, hvilket lukker forældreløsheden. Det er den ærlige læsning af "en fast
   del af topbaren": fast i **placering og opførsel**, ikke malet på sider, hvor den er en
   død kontrol. *(antagelse: JPK mener "altid samme sted, altid samme opførsel" og ikke
   "synlig på sider uden tal" — det er den eneste læsning, der ikke bryder Operate.)*

**Prisen, og derfor er dette en plan og ikke en lap.** Hård begrænsning 2's åbne punkt:
**11 af 77** robotter når prisspanden "Højst 15.000 USD" gennem en omregning, **vi** har
lavet (ECB's daglige referencekurs, `data/kurser.json`, kilden er linket på siden — målt).
En enhedskontakt lærer den besøgende, at tal på denne side kan **udtrykkes om**. I samme
øjeblik holder prisspandens herkomst op med at være en fodnote og bliver et spørgsmål,
kontakten selv inviterer til.

**Planen binder derfor de to sammen:** når kontakten kommer, får de 11 omregnede priser
den samme synlige behandling som kontaktens egne tal — et mærke, der siger **regnet**,
forskelligt fra **oplyst**. Hård begrænsning 5 kræver allerede, at tre tilstande ser
forskellige ud; dette er den fjerde tilstand, kataloget faktisk har og ikke viser.

**Acceptkriterium E.1:** `class="enhedsskift"` uden matchende `id="enhedsskift"` **35 → 0**
sider · `enhedsvis--*` på kataloget **0 → ≥ 131** · kontakten skifter alle fire
skalaetiketter i nyttelastfilteret.

---

## SYSTEMÆNDRING

**Hvilke ANDRE skærme hvert forslag rører, og hvad det koster dér.** Alle tal målt i
`dist/da` (107 sider) i denne worktree.

| Forslag | Rører | Andre skærme | Pris dér |
|---|---|---|---|
| 0.1 åbningsstriben | `kort--seneste` | kun kataloget (9 af 9) | ingen |
| J1.1 luft om `.sog` | `.sog` | `.sog` findes på **1 af 107** sider | ingen |
| J2.1 skriftskala | `.facet__navn`, `.facet__tal`, `.antal`, `.chip__navn` | `.facet` står **også** på sammenligningssiden, hvor grundreglen er `display:contents` | `.facet__navn` dér arver ændringen — **skal måles før flet**; `.antal` og `.facet__tal` er katalog-kun |
| J3.1 polstring + margin | `.facetter__net .facet` | selektoren er scopet til `.facetter__net`, som kun findes på kataloget | ingen |
| F1.1 kontrolgrammatik | `.knap`, `.maerke` | `.knap`: katalog + **70** robotsider + 404. `.maerke`: **77** robotsider | robotsiden skal have kassen af `.maerke` — hører i **robotsidens** plan, ikke denne |
| F2.1 tilstandsvalg | `.sorter label`, `.chip__krop` | begge kun kataloget | ingen — men primitiven skal fødes med flade-varianter |
| E.1 enhedskontakt | `.daek__enhed` (topbaren) | topbaren står på **107 / 107** | 35 sider mister et forældreløst `for=`; de 72 er uændrede |
| K.1 kortet | `.kort` | kataloget (86) + **25** producentundersider | se nedenfor |

### K.1 — kortbeslutningen, skrevet så den kan arves

**Målt arkitektur: der findes to kortimplementeringer i dag, og de er bevidste.**
`katalog.mjs:1137` skriver det ordret: katalogets kort er *"BEVIDST ikke hjaelp.kort()"*.

- `tools/skabelon/side.mjs:1827 kort()` — den fælles. **Kaldere i dag: præcis én**,
  `producent.mjs:251`.
- `tools/skabelon/katalog.mjs:1156 kortHTML()` — katalogets egen.

**Begrundelsen er forældet på et punkt, der afgør sagen.** Kommentaren siger, at den fælles
deles med *"forsiden og producentsiderne"*. **Forsiden blev slettet af L72** — `dist/da/index.html`
*er* kataloget. Den fælles funktion deles altså ikke længere; den har én kalder, og
indvendingen om *"en kontakt med to stillinger"* har mistet den anden stilling, der gjorde
den sand.

**Beslutning: ét kort, én implementering — og forskellen mellem flader er fratrækning,
ikke en komponent nummer to.**

- **Kortets opgave, ens på begge flader:** at lade den besøgende **afvise** en model uden
  at åbne den. Intet på kortet er der for at overtale; alt er der for at diskvalificere.
- **Obligatorisk, må aldrig udelades:** billedet (foto, måltro plade **eller** tom flade —
  alle tre er billedtilstande i `.billedled`), produktnavnet, producenten, og
  statusstemplet **når status ikke er "i produktion"** (`.kort__mrk`, målt 12 på kataloget).
- **Valgfrit, en flade må udelade det:** nøgletallene (`.kort__vaerdi--*`), hullerne
  (`.kort__savn--*`, målt **123** på kataloget — den synlige "ikke oplyst"-tilstand) og
  samleknappen (`.kort__saml`).
- **Hvad producentsiden må udelade, og hvorfor det er forsvarligt:** den bærer i dag kun
  `kort__mrk`, `kort__navn`, `kort__prod`, `kort__tekst` (målt). Det er legitimt — læseren
  har allerede valgt producenten, og de 25 sider indlæser **intet JavaScript**
  (`producent.mjs` sender `samling:false`, og kommentaren siger hvorfor), så en
  sammenlign-knap ville stå `hidden` for evigt.
- **Hvad ingen flade må gøre:** tilføje en handling, kataloget ikke har. Hård begrænsning 1
  — ingen købsknap, intet prisspørgsmål — og kortet er det mest sandsynlige sted, en sådan
  ville dukke op.
- **Den mekaniske vagt, der ikke må brydes:** `build.mjs:144` tæller `<article class="kort">`
  **ordret**. Enhver sammenlægning skal holde åbningstaggen byte-identisk, ellers fejler
  bygget med 86 mod 77. Det er en funktion, ikke en forhindring — behold den.

**Producentsidens plan arver dette kort med tal, huller og samleknap fratrukket, og har
intet kort at beslutte.**

---

## To fund fra 2. sep, som jeg har genmålt — begge tal skal rettes

**Bundbjælken.** Briefet: *"dækker 89 px indhold ved 390 px"*. **Målt: 44,1 px.**
`.klaebebar` er `position:fixed`, **44,1 px høj**, dækker 44,1 px af bunden, og
`body{padding-bottom:0px}` er bekræftet. Bjælken findes først, når noget er valgt (jeg
valgte to robotter for at fremkalde den). Manglen er ægte — indhold **bliver** dækket — men
tallet er 44,1, ikke 89. Hører i mobilpasset, ikke her.

**Hover-zoomen — og den strider mod en truffet beslutning.** Målt på katalogkortet:
`.billedled` har `overflow:hidden` og `object-fit:contain`; billedet er 269,59 px bredt i
en 269,59 px bred ramme → **0 % vandret slæk**, mens der er **8,96 % lodret slæk**.
`scale(1.024)` beskærer altså **vandret** (~1,2 % i hver side) og **ikke** lodret.
Briefets størrelsesorden er rigtig, aksen er ikke.

> **L78 besluttede ordret: "et produktfoto beskæres aldrig. 4:3 og `contain` overalt."**
> `system.css:1367` beskærer det på hover. Det er en levende modstrid med en truffet
> beslutning, ikke en smagssag — og den bør afgøres, ikke bare noteres.

---

## Åbne punkter, som en bygger ikke må opfinde selv

1. **Forslag 0.1 fjerner en synlig sektion.** Indholdsbeslutning — kræver JPK's ord.
2. **J2.1's virkning på sammenligningssiden er ikke målt.** `.facet__navn` findes dér.
   Måles før flet, ikke efter.
3. **Enhedskontakten på 404 og Om:** planen siger "ikke tegnet dér". Læser JPK sit eget
   krav som "synlig overalt", vinder hans læsning — men så skal inputtet også udsendes
   dér, ellers står den forældreløse etiket tilbage.
4. **"Regnet" mod "oplyst" som fjerde tilstand** er foreslået, ikke formgivet. Den rører
   hård begrænsning 5 og skal formgives sammen med de tre eksisterende, ikke ved siden af.
5. **L78-modstriden (hover-zoom)** er ikke min at afgøre.
