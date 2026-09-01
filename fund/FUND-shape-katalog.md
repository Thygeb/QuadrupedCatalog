# FUND-shape-katalog — designplan for katalogsiden

**Spor:** `spor/shape` · **Dato:** 1. sep 2026 · **Skill:** `impeccable shape`, mode `Operate`
**Type:** refinement, ikke redesign.

Alle tal er målt af sporet selv på `dist/` bygget fra `spor/shape` (main-HEAD `ddbf9ad`), serveret
på port 8165, verificeret mod disken med md5 før første tal blev brugt. Målescripts ligger i
sessionens scratchpad (`shape-geometri.mjs`, `shape-brug2.mjs`, `shape-skrift.mjs`,
`shape-type.mjs`) — uden for repoet, jf. løftet om en afhængighedsfri generator.

> **Læs §1 først.** Opslaget i STATUS.md ændrede planen efter første udkast. Katalogsidens åbning
> er ikke et frit designvalg — den er bestilt af JPK for to dage siden og låst af fem tests. §1.4
> bærer desuden en **rettelse af min egen måling**: jeg påstod først, at åbningens acceptkriterium
> var brudt. Målt om med den rigtige målestok er det **opfyldt**, og overbevisende. Det flytter §5
> fra et byggeforslag til et beslutningsoplæg — og fra "ryd op efter en fejl" til "her er den næste
> beslutning, som den forrige gjorde synlig".

---

## 0. Grundmåling

```
tools/validate.mjs   77 filer · 0 fejl · 1 advarsel  (ghost-robotics-vision-60, R9 — laa der i forvejen)
tools/build.mjs      218 sider · 1110 tal med kilde, 0 uden
tests/koer.mjs       1434 bestaaet, 0 fejlet
```

De 1434 er det tal, ethvert spor i §7 skal måle mod — og §7's Spor 1 er det eneste, der lovligt
må ændre det, fordi det vender assertions om i stedet for at slette dem.

**Afvigelse fra briefet:** briefet siger 213 sider. Faktisk **218**. Ikke en fejl — kataloget er
vokset. Nævnt, fordi et hårdkodet sidetal i et fremtidigt acceptkriterium bliver forkert igen ved
næste robot (D7/L30-fælden).

---

## 1. Det, opslaget i STATUS.md ændrede

CLAUDE.md's regel — *slå altid efter i Lukket-tabellen, før noget bygges, og afkort aldrig den
søgning* — blev kørt som `grep -n -i "nyeste\|aabning\|seneste udgivelses\|net--seneste" STATUS.md`
uden `head`. Den gav fire poster, og de omskriver planen.

### 1.1 Briefets retningsangivelse er forældet

Briefet siger *"D15 låste paletten og skrifterne"* og *"L40 valgte retningen INSTRUMENT"*.

**Begge er omgjort.** Å61/**L54**, besluttet af JPK 31. aug 2026, ordret:
*"HELE UI'ET REDESIGNES, og både D15 og L40 er omgjort … JPK fik D15 og L40 vist og valgte
'alt falder — palette, skrifter, retning' … de gamle verdener (VITRINE/**INSTRUMENT**/REGISTER) er
**anti-reference**, ikke genbrugsmateriale."*

Den gældende retning er **TYPESKILT** (L57, godkendt 31. aug; Å90: *"hele sitet står i
TYPESKILT-retningen"*). Manifestet er `retninger/nyverden/MANIFEST.md`.

**Betydningen for planen er begrænset og skal siges præcist:** briefets *liste* over farver og
skrifter er **rigtig** — Eloxgrå `#E8EBED`, Gunmetal `#22262A`, Afmærkningsgul `#F2C400`, Støvgrå
`#9AA3A9`, Støv-blæk `#5F686F`, Saira Semi Condensed og Literata er nøjagtigt TYPESKILTs palette.
Kun *attributionen* er forældet. Forbuddet mod at foreslå nye farver og skrifter står derfor
uændret, og ingen post her rører dem. Men **"INSTRUMENT" må ikke citeres som retning i et
byggebrief** — det er nu anti-reference, og en agent, der læser briefet ordret, bygger mod en
verden, projektet har forladt.

### 1.2 TYPESKILTs egen tese styrer filterblokken

> *"**Filtret er ikke et sidepanel. Det er pladen, kataloget er boltet på.** … Derfor ligger
> filtret som en fuldbredde plade **i første skærm**, ikke i en venstreskinne. Det er ikke et
> redskab ved siden af indholdet; det **er** indholdet, indtil læseren har valgt."*
> — `retninger/nyverden/MANIFEST.md`

To ting følger:

1. **Venstreskinnen er udelukket af retningen**, ikke kun af min måling. Det fravalg i §3 er
   dermed ikke mit — det er truffet.
2. **Pladen skal ligge i første skærm.** Målt i dag: filterpladen begynder ved **y = 858** (1440 px)
   og **y = 1470** (390 px). Ved 390 px ligger den 1,7 skærmhøjder nede. **Retningens egen tese er
   ikke opfyldt på den byggede side.**

Retningen afviser desuden udtrykkeligt *"SaaS-filterskuffen med bløde pill-chips"*. Ethvert
forslag om filterets form skal derfor formuleres i pladens sprog — stansede felter og riller — og
ikke som chips i en skuffe. §3 er skrevet om efter det.

### 1.3 Åbningssektionen er besluttet af JPK — to gange, inden for to dage

| Post | Dato | Hvad JPK besluttede |
|---|---|---|
| **Å73** | 31. aug | *"**UDVIDET samme dag med en LANDING/HERO-SEKTION, bestilt af JPK:** øverst på katalogsiden, over filtret … med præsentation af de seneste modeller."* |
| **L69** | 1. sep | *"h1 bliver **'Nyeste i kataloget'** (den navngiver i dag ikke sin egen sektion)"* — afgjort i popup |

Sektionen er altså **ikke** et uovervejet levn. Den er bestilt, og dens overskrift er valgt
personligt af JPK i går. **Et forslag om at fjerne den er et forslag om at omgøre en beslutning,
der er to dage gammel** — præcis den dyreste fejl, CLAUDE.md advarer imod.

Den er desuden **låst af fem tests**, som koder beslutningerne:

| Test | Låser |
|---|---|
| `tests/dele/35-typeskilt-katalog.mjs:171` (35.18) | *"aabningen findes og er sat af robotkort"* — kræver `class="aabning__krop` med `<article class="kort kort--seneste">` |
| 35.19 · 35.20 | åbningen skal sige, hvor mange der oplyser et årstal, og nævne de 32, der ikke gør |
| `tests/dele/48-katalogets-flader.mjs:67-71` (48.1, 48.2) | `h1.aabning__titel` skal ordret være `i18n.katalog_seneste_titel` |

Per projektreglen *"Ret assertions, slet dem ikke"* kan ingen af dem slettes — de skal vendes om,
og det kræver en ny beslutning først.

### 1.4 D20: betingelsen er OPFYLDT — og en rettelse af min egen første måling

**D20** (`STATUS.md:116`) er ordret mit spors spørgsmål:

> **"skal katalogsiden åbne med robotterne i stedet for betjeningen?"**
> Rejst af `impeccable critique` 28. aug 2026. **Målt grundlag: første `.kort` begynder ved
> y = 993 px ved 1440×900 og y = 1820 px ved 390** — *"hhv. én og to fulde skærme af betjening før
> den første genstand: **44 betjeningselementer**."*

Å73 gav heroen en udtrykkelig betingelse: *"heroen må ikke gøre tallet værre."*

**Rettelse af mit eget første udkast.** Jeg skrev først, at betingelsen var brudt — med tallene
1582 px og 2908 px. **Det var forkert.** Jeg målte første kort i *hovedgitteret* og holdt det op
mod D20's tal for *første kort på siden*. To forskellige størrelser, sammenlignet som om de var én.
Det er nøjagtigt den fejl, projektets egen regel advarer imod: et måleapparat skal valideres mod et
kendt svar, før dets tal bruges i et fund. Målt om, med D20's egen målestok:

| D20's målestok | 28. aug | **Målt nu** | Ændring |
|---|---:|---:|---:|
| Første `.kort` på siden, 1440 px | 993 px | **317 px** | **−676 px** |
| Første `.kort` på siden, 390 px | 1820 px | **500 px** | **−1320 px** |
| Betjeningselementer før første kort | 44 | **8** (alle navlinks) | **−36** |

> **Heroen opfyldte sin betingelse, og den gjorde det overbevisende.** Kataloget åbner i dag med
> robotter i stedet for betjening, ved begge bredder. JPK's beslutning virkede efter hensigten.

Genkør med `node <scratchpad>/shape-d20.mjs http://localhost:<port>/da/robotter/ 1440` (og `390`).
*Kontrafaktisk:* var heroen ikke der, ville `foersteKortPaaSiden` være lig
`foersteKortIGitteret` — 1582 og 2908.

### 1.5 Den omkostning, D20's målestok ikke kan se

Men målestokken måler "hvornår ser hun en robot", ikke "hvornår kan hun begynde at arbejde". Og
der er dukket en omkostning op, som D20 ikke havde et tal for:

| | 1440 px | 390 px |
|---|---:|---:|
| Første kort på siden (D20's tal) | 317 | 500 |
| **Første kort i det filtrerbare katalog** | **1582** | **2908** |
| Betjeningselementer før det filtrerbare katalog | **81** | 82 |

*(De 81 tæller heroens egne kortlinks og sammenlign-knapper med — det er ikke 81 filtre. Tallet
skal læses som "ting at komme forbi", ikke som betjeningsbyrde i D20's forstand.)*

**De ni robotter, der nu møder hende først, er de eneste ni på siden, der ikke adlyder filteret**
(målt i §5.2, P1). D20's spørgsmål havde to led — *se* feltet, og derefter kunne *handle* på det.
Det første led er løst. Det andet er rykket længere væk, og løsningen på det første er grunden.

> **Det er ikke en fejl i beslutningen. Det er den næste beslutning, som den første gjorde synlig.**

Derfor er §5 skrevet som et beslutningsoplæg til JPK, ikke som et byggespor — og derfor er alle tre
veje i §5.3 formet, så D20's gevinst (317 / 500 px) **bevares**.

**Én omstændighed forklarer, hvorfor netop denne del blev svær.** Å73 siger det selv:
*"**Compen har INGEN aabning, saa formen er** … sporet fortolker her, hvor det ellers har en
kontrakt."* Åbningen er det eneste element på fladen, som TYPESKILT aldrig tegnede. Alt andet blev
bygget mod en comp; denne blev fortolket.

### 1.6 En utilsigtet konflikt, jeg ikke kan afgøre

D15 og L44 siger begge, at sorteringskontrollen skal være *"tæthed/vægt/alfabetisk — **aldrig
'nyeste'**"*. Den byggede side har `<input value="dato">` = **"Udgivelsesår, nyeste først"**.

L54 omgjorde D15 i sin helhed (*"alt falder"*), og JPK bestilte derefter selv en sektion om *"de
seneste modeller"* — så "nyeste" er i praksis sanktioneret af den nyere og mere specifikke
beslutning. Men **"aldrig nyeste" er aldrig udtrykkeligt trukket tilbage for sorteringskontrollen.**
Jeg kan ikke afgøre, om det er en bevidst følge af L54 eller en overset rest. **Forelæg det for
JPK sammen med §5** — det er ét spørgsmål, og det koster ingenting at stille.

---

## 2. Opgaven, den besøgende faktisk har

### De tre kandidater

| | Opgave | Hvem, ifølge PRODUCT.md |
|---|---|---|
| **A** | Finde ÉN robot, hvis navn man kender | Teknisk indkøber (sekundær) |
| **B** | Indsnævre til et krav — nyttelast, IP, pris | Teknisk indkøber (sekundær) |
| **C** | Orientere sig i feltet uden mål | Nysgerrig fagperson (**primær**, L31) |

Den naive læsning er "C vinder, fordi C's persona er primær". Den er forkert, og det er planens
vigtigste enkeltbeslutning at sige hvorfor.

PRODUCT.md's succeskriterium for den primære læser er ikke "browse". Det er ordret: *"kan på få
minutter få et retvisende billede af feltet — hvor mange producenter, hvilke typer robotter, hvad
de kan"*. **Det er ikke en tredje komponent. Det er det ufiltrerede gitter af 77 kort, set som det
ligger.** C kræver ingen egen sektion — den er fladens hviletilstand.

D20 formulerer den samme indsigt fra den anden side, og skarpere end jeg gjorde i første udkast:

> *"fladen er bygget **Operate**, men **L31 gjorde den nysgerrige fagperson primær**, og hun
> ankommer **Read** — uden modelnavn, **uden at kunne bruge ét eneste af de 30 filtre, før hun har
> set, hvad feltet består af**."*

Det er en dokumenteret konflikt med mit eget brief, som siger *"Fladens MODE er Operate"*. Begge
er sande: fladen **er** Operate, og den primære besøgende **ankommer** Read. De to forliges ikke ved
at vælge en mode, men ved at bemærke, at de peger samme vej: **hun skal se robotterne, før
betjeningen kan bruges** — og robotterne er gitteret.

### Den valgte prioritet

> **B er layoutets drivende opgave. C er fladens standardtilstand og kræver ingen egen sektion.
> A løses af ét felt, ikke af et layout.**

- **B er den eneste af de tre, der kræver interaktion**, og derfor den eneste, hvor afstanden
  mellem betjening og virkning er et layoutproblem. A og C er læseopgaver — de tåler afstand. B
  går i stykker ved afstand, og den er i stykker i dag (§3).
- **B er det, sitet er unikt bygget til.** 1.110 kildebelagte tal og "ikke oplyst" som filtrerbar
  tilstand findes for B's skyld. PRODUCT.md: *"derfor skal 'ikke oplyst' være en synlig og
  filtrerbar tilstand … uanset hvilken af de to læsere der ser den."*
- **A er den billigste at indfri og den dårligst indfriede.** Søgefeltet ligger på y = 1069
  (1440) og y = 1851 (390). Ét greb lukker A helt.

**Fravalgt:** C som layoutdriver (ville bevare en redaktionel indgang oven på kataloget — den
findes allerede på `/da/`). A som layoutdriver (ville gøre fladen til et søgefelt med en liste
under, og kaste de 1.110 tal væk).

**Prisen ved prioriteten:** den nysgerrige fagperson mister en kurateret indgang. §5 betaler den
tilbage — funktionen består, formen ændres.

---

## 3. Filterpladen — svaret på 109 px-spørgsmålet

### 3.1 Hvorfor "mindre polstring" og "større tekst" begge er forkerte svar

Begge er rigtige isoleret set og løser ingenting: 24 → 16 px sparer 144 px af 326, og etiketten fra
11 → 13 px æder det meste igen. Man ender med samme form, lidt strammere.

**Formen er problemet.** En sammenfoldet filtergruppe er en **kontrol**, og den bærer ét ord. Sitet
har allerede et kontrolsprog med målt højde: søgefeltet 44 px, `<summary>` 44 px, `.udtraek__greb`
44 px. En kontrol med ét ord skal have en kontrols højde, ikke et korts. **109 px er et kort.**

### 3.2 Men højden er ikke den dyre fejl

| | `.facetter__net` | `section.resultat` begynder |
|---|---:|---:|
| Alle grupper lukkede | 326 px | y = 1460 |
| **Én gruppe åbnet** ("Anvendelse") | **607 px** | **y = 1740** |

Cellen vokser fra 109 til **390 px**, og resultatet flytter **280 px længere ned** i samme øjeblik,
den besøgende gør det, hun kom for. Tælleren — den eneste kvittering — er en **14 px høj, 99 px
bred** overskrift, der efter åbningen står på y = 2046, mens filteret, der lige blev sat, står på
y = 1610: **436 px fra hinanden, begge under folden.**

> **I Operate-mode er det fladens definerende fejl: betjening og virkning kan ikke ses samtidig.**

### 3.3 Forslag F1 — pladen beholder sine stansede felter, men de bliver felter, ikke kort

**Formuleret i TYPESKILTs eget sprog, ikke som en SaaS-filterskuffe (som retningen afviser).**

**Hvad der ændres.** De ni `<details>` holder op med at være celler i et 4-kolonners kortgitter og
bliver **stansede felter på én række i pladen** — samme fuldbredde-plade, samme riller, samme
gunmetal på elox. Hver `<summary>` beholder sine 44 px og sin `+`/`−`-markør. Panelet, den åbner,
lægger sig som et **indfældet felt oven på pladen** — `position:absolute` i feltets egen kontekst —
i stedet for at være et flow-element, der skubber kataloget væk.

Tre konsekvenser, et byggebrief skal bære:

1. `.plade__krop` har `overflow:hidden` (`assets/generator.css:1261`). **Et overlejrende panel
   klippes af den.** Reglen skal ændres for filterbeholderen. `impeccable`s Operate-reference
   nævner præcis den fælde ved navn: *"An absolutely positioned dropdown inside an overflow:hidden
   ancestor gets clipped."*
2. **P0 er urørt.** `<details>`/`<summary>` **er** den JavaScript-fri popover. Filtrering forbliver
   ren CSS med `:has()`. Intet i forslaget gør en filtrering afhængig af JavaScript.
3. Ved 390 px ombryder rækken til 3–4 rækker à 44 px (~150–190 px) mod dagens **835 px**.

**Hvad det koster læseren, hvis vi ikke gør det.** Hun kan ikke se, om hendes afkrydsning virkede,
uden at rulle — og hver ny afkrydsning flytter svaret længere væk, så det bliver værre, jo mere hun
arbejder.

**Hvordan man måler, at det virkede.**
```
node <scratchpad>/shape-geometri.mjs http://localhost:<port>/da/robotter/ 1440
```
Færdig, når `facetter__net.h ≤ 96` med alt lukket (fra 326) **og** `resultat.top` er **uændret**,
når én gruppe åbnes (i dag 1460 → 1740). **Det andet kriterium er det vigtige** — det første kan
snydes med polstring alene.
*Ekstra kriterium fra retningen (§1.2):* pladen skal begynde i første skærm — `plade.top < 844`
ved 390 px (i dag **1470**). Det kriterium kan først opfyldes, når §5 er afgjort.

### 3.4 Forslag F2 — tælleren følger med

**Hvad der ændres.** `h2.resultat__titel` bliver fladens ene tydelige kvittering og **klæber**,
mens pladen er i brug.

Mekanismen findes og er efterprøvet: `.klaebebar` (`position:fixed`, 50 px) blev målt i drift efter
at have valgt to robotter — den viste `"As2 · As2-W  Åbn sammenligningen  Ryd udvalget"`. Den skal
ikke opfindes, kun bære et tal mere. **L67 gav den til sammenligningsudvalget; at give den
resultattallet er en udvidelse af en truffet beslutning — forelæg den, byg den ikke uspurgt.**

**Hvad det koster læseren, hvis vi ikke gør det.** Kvitteringen for hendes eneste handling er
usynlig 436 px væk.

**Hvordan man måler.** Sæt et filter ved 1440 px: tælleren skal have `top i viewport < 900` uanset
rulleposition. I dag `taellerY = 2046` absolut, ude af syne.

### 3.5 Fravalgt: venstreskinnen

Filtre i en klæbende venstrekolonne ville løse samvisningen strukturelt og er den mest oplagte
Operate-form. **Fravalgt af retningen, ikke af mig:** TYPESKILTs tese siger ordret *"ikke i en
venstreskinne"*. Dertil kommer to målte omkostninger: gitteret mister ~350 px bredde (5 kort­kolonner
falder til 4 ved 1440 px), og mobilen kræver alligevel en anden form — man bygger to i stedet for én.

---

## 4. Typografisk hierarki på fladen

### 4.1 Målt

**20 unikke skriftgrader ved 1440 px, 21 ved 390 px** (briefets 55 er stilarkenes tal; fladens eget
er det brugbare). Fordelingen er sagen:

| Spænd | Trin | Noder |
|---|---:|---|
| 52 · 44 · 34 · 27 · 25 px | 5 | **1 node hver** — fem displaygrader, hver brugt præcis én gang |
| 17 px | 1 | 97 |
| **15 → 8 px** | **14** | 15 · 14,5 · 14 · 13,5 · 13 · 12,5 · 12 · 11,5 · 11 · 10,5 · 10 · 9,52 · 9,5 · 8 |

**Fjorten grader på syv pixels.** 13,5 mod 13 mod 12,5 mod 12 kan ikke skelnes, så trinene bærer
ingen betydning og koster kun sammenhæng. I den anden ende har hver overskrift sin egen størrelse.

**Brud på projektets eget skriftgulv.** DESIGN.md: *"10,5 px er skriftgulvet i hele systemet."*
Å60 melder desuden "skriftgulv 8 px" som flettet. Målt i dag: 10 px (3 noder), 9,52 px (`.enhed`),
**9,5 px (92 noder** — `.kort__saml-ord "Sammenlign"`, `.kort__mrk "Annonceret"`**)** og **8 px**
(`.kildemaerke` — kildebogstaverne A/B, `assets/system.css:725`). Gulvet står altså på 8, ikke 10,5.

### 4.2 Forslag T1 — seks trin

`impeccable`s Operate-reference: *"Tighter scale ratio. 1.125–1.2 between steps is typical."* Med 20
grader er problemet dog antallet, ikke forholdet. Seks trin, forhold ~1,25, og **fem af de seks
værdier findes allerede** — kun 21 er ny:

| Trin | Rolle på katalogsiden | Erstatter |
|---:|---|---|
| **34** | Sidens ene `h1` | 52 · 44 · 34 |
| **27** | Sektionsoverskrift (der er to) | 27 · 25 |
| **21** | Tælleren — fladens kvittering (F2) | *ny* |
| **17** | Kortnavn og brødtekst | 17 |
| **13** | Metadata, prosa, tællinger | 15 · 14,5 · 14 · 13,5 · 13 · 12,5 |
| **11** | Etiketter, versaler, kontrolnavne | 12 · 11,5 · 11 · 10,5 · 10 · 9,5 |

**Én navngiven undtagelse:** `.kildemaerke` er en **superskrift**, ikke tekst i skalaen —
`font-size:max(8px,.34em)`. Den forbliver en superskrift, men gulvet hæves fra 8 til **10 px**. At
tvinge den ind i skalaen ville gøre et fodnotemærke lige så stort som etiketten, det hænger på.

**Risiko, briefet skal kende:** 9,5 → 11 px gør `"SAMMENLIGN"` og `"ANNONCERET"` bredere på hvert
kort (92 noder). Kortet er 269,6 px bredt ved 1440 og **178,5 px ved 390**. **Mål ombrydningen ved
390 px, før trinnet lukkes** — det er dér, det knækker, hvis det knækker.

**Hvad det koster læseren, hvis vi ikke gør det.** Skriftgraden holder op med at være et signal:
hun kan ikke aflæse, hvad der er etiket og hvad der er værdi, og må læse ordene for at finde ud af
det. På en flade med 1.110 tal er det forskellen på at skimme og at læse.

**Hvordan man måler.** `shape-type.mjs`. Færdig, når den lister **≤ 7 grader** ved både 1440 og
390 px (seks trin + superskriften), mod 20/21 i dag.

### 4.3 Forslag T2 — luk skriftmigreringen

**Målt (FUND, briefet ikke kendte).** `--sans` er stadig
`"Manrope lokal", Manrope, "Segoe UI Variable Text", …`, og Manrope har intet `@font-face` mere.
Canvas-bredden af samme teststreng:

| Kandidat | Bredde |
|---|---:|
| **Som deklareret (`--sans`)** | **223,81** |
| Segoe UI Variable Text | **223,81** ← |
| SairaSemiCondensed | 207,31 |
| Literata | 233,31 |
| system-ui | 226,54 |

`document.fonts` indeholder præcis to familier: SairaSemiCondensed og Literata. **Alt på `--sans`
— herunder `body` (17 px, 97 noder) og `.t-h2` (34 px, "Sådan læses tallene") — renderes i
styresystemets skrift** og ser derfor anderledes ud på macOS end på Windows.

Det er **ikke** et brud på TYPESKILT: begge retningens skrifter er i drift. Det er en **uafsluttet
migrering** — `system.css:147` erkender den selv (*"'Manrope lokal' har intet @font-face-modstykke
længere … falder derfor bare videre i stakken"*) og kalder den *"en gyldig, uskadt CSS-tilstand"*.
Målingen siger noget andet: den er gyldig, men ikke uskadt, fordi den gør en Operate-flades
vigtigste dyd — konsistens — afhængig af den besøgendes styresystem.

**Hvad der ændres.** `--sans` peges på en projektskrift. **Dette er ikke et forslag om en ny
skrift** — kandidaterne er TYPESKILTs to, begge allerede selvhostede. Valget mellem Saira (én
familie, som Operate-referencen anbefaler) og Literata (hvor prosaen allerede står) er en
identitetsbeslutning og **hører til JPK, ikke til et spor**.

**Hvad det koster læseren, hvis vi ikke gør det.** Hun ser en anden side end den, der blev
designet, hvis hun ikke sidder på Windows.

**Hvordan man måler.** `shape-skrift.mjs`. Færdig, når `body`s `breddeSomDeklareret` er lig
`breddeSomSaira` (207,31) eller `breddeSomLiterata` (233,31) — i dag 223,81 = Segoe.

---

## 5. Rækkefølgen på fladen — beslutningsoplæg, ikke byggespor

### 5.1 Sådan ligger den i dag

| Landmark | y (1440) | y (390) |
|---|---:|---:|
| `h1` "Nyeste i kataloget" | 109 | 148 |
| `section.aabning` slut | 858 | **1470** |
| `input#sog-katalog` | **1069** | **1851** |
| `.facetter__net` | 1134 | 1895 |
| `h2` "74 robotter …" (14 px høj) | 1518 | 2754 |
| **Første kort i det filtrerbare katalog** | **1582** | **2908** |

Til sammenligning: **første kort på siden overhovedet** (heroens) ligger på **317 / 500** — det er
D20's tal, og det er godt (§1.4). Rækkefølgens problem er ikke, hvornår hun ser en robot. Det er,
hvornår hun når de robotter, hun kan *gøre noget ved*: **3,4 skærmhøjder** ved 390 px, og
**2,2 skærmhøjder** før søgefeltet.

### 5.2 De tre målte problemer

**P1 — åbningen filtrerer aldrig med.** Målt ved at tælle synlige kort i `.net--seneste` og `.net`
hver for sig:

| Tilstand | "Nyeste" | Gitteret | Tælleren |
|---|---:|---:|---|
| Uden filter | **9** | 74 | "74 robotter i standardvisningen" |
| `+ Inspektion` | **9** | 40 | "40 robotter …" |
| Søgning `"spot"` | **9** | **1** | "1 robot …" |

Efter en søgning på "spot" er fladens fold **visuelt identisk** med før søgningen — ni kort, hvoraf
intet er et træf — mens det ene rigtige træf ligger på **y = 1863**. To kortgitre med samme
kortdesign, hvor det ene adlyder filteret og det andet ikke, læses som en fejl.
*Kontrafaktisk:* adlød blokken filteret, ville 9 falde i mindst én tilstand. Det gør det i ingen.

**P2 — det filtrerbare katalog er rykket to skærme ned, mens D20's tal blev bedre.** Se §1.4–1.5.
Heroen løste "hvornår ser hun en robot" (993 → 317 og 1820 → 500) og skabte samtidig afstanden til
"hvornår kan hun handle" (1582 / **2908**). **Begge dele er sande på én gang**, og en plan, der kun
nævner det ene, er ubrugelig: fjerner man heroen for at lukke P2, mister man den gevinst, JPK
bestilte den for. Derfor er alle tre veje i §5.3 formet, så 317/500 bevares.

**P3 — sektionen duplikerer en kontrol, der allerede findes.** `<input value="dato">` =
*"Udgivelsesår, nyeste først"* står i sorteringen. Åbningen gør det samme 700 px højere oppe, og
dårligere: den kan ikke slås fra, den ignorerer filteret, og den viser kun den seneste **årgang**
frem for en ordning. Dens eget grundlag er tyndt, og noten siger det: *"Udgivelsesår er oplyst for
45 af 77 modeller."* Fladen åbner på en akse, der mangler for **42 %** af kataloget.

### 5.3 Tre veje, rangeret — JPK vælger

**Alle tre bevarer heroens gevinst: første kort på siden bliver ved med at ligge på ~317 / ~500 px.**
Ingen af dem foreslår at fjerne åbningen. De adskiller sig i, hvad de koster, og hvad de rører ved.

> **Vej 1 — de ni kort bliver gitterets egen første række (anbefalet).**
> Åbningen holder op med at være et *andet* gitter og bliver **kataloget selv, sorteret nyest
> først** — samme kort, samme filterkæde, ét gitter. Fladen åbner stadig med robotter (D20 bevaret,
> og faktisk bedre: de kort, hun ser først, er nu kort hun kan filtrere), og de 77 begynder dér,
> hvor de ni gør.
> *Løser:* P1 (der er kun ét gitter at filtrere), P2 (afstanden til det filtrerbare katalog
> forsvinder, fordi de er samme ting), P3 (ingen duplikering).
> *Koster:* tests 35.18–35.20 og 48.1–48.2 skal **vendes om**, ikke slettes. Og L69's h1-ordlyd
> skal genbesøges: *"Nyeste i kataloget"* navngiver en sortering frem for en sektion, når sektionen
> og kataloget er blevet ét. **Det er spørgsmålet til JPK**, og det er hans egen beslutning fra i går.

> **Vej 2 — åbningen bliver som egen sektion, men skrumper og adlyder filteret.**
> Sektionen beholdes, men som en stribe frem for et 541 px højt gitter — fx tre kort i én række.
> Den kobles på samme `:has()`-kæde som gitteret, så den filtrerer med.
> *Løser:* P1 helt, P2 delvist.
> *Koster:* P3 består — duplikeringen af sorteringskontrollen bliver stående. Og en "nyeste"-stribe,
> der filtreres ned til nul kort, kræver en tom tilstand, som ingen har designet. Det er ny
> designgæld, ikke afviklet gæld.

> **Vej 3 — rækkefølgen står; kun §3 og §4 bygges.**
> Fuldt gyldigt valg — §3 og §4 er de to største enkeltløft og er ikke spærret af noget.
> *Koster:* P1 består, og den er den, der ligner en fejl for en besøgende. **Skriv da P1 ind i
> STATUS.md som en kendt og accepteret adfærd**, så næste agent ikke bruger en runde på at
> "opdage" den igen. Det er den eneste vej, der kræver en handling, selv om man vælger ikke at
> ændre noget.

### 5.4 Forslag R2 — søgefeltet op (uafhængigt af de tre veje)

**Hvad der ændres.** `input#sog-katalog` flyttes ud af `section.plade` og op under `h1`, over
filterpladen. Bemærk til briefets faktatjek: **søgefeltet ligger i dag INDE i filterblokken**,
mellem dens overskrift (y = 890) og cellegitteret (y = 1134) — ikke efter blokken, som briefet
antager. Det gør flytningen billigere, ikke dyrere.

**Hvad det koster læseren, hvis vi ikke gør det.** Den besøgende, der kom med et modelnavn — den
hyppigste ankomst for den sekundære læser — skal rulle 2,2 skærmhøjder på telefon for at finde det
ene felt, hun havde brug for.

**Hvordan man måler.** `soegefelt.top < 500` ved 1440 (i dag 1069) og `< 844` ved 390 (i dag 1851).

**Dette forslag er ikke spærret af nogen beslutning** og kan bygges uanset hvilken vej §5.3 tager.

---

## 6. Hvad der IKKE skal ændres

Set på, målt, og bevaret med vilje. Uden dette afsnit kan man ikke se forskel på "overvejet og
beholdt" og "ikke kigget på".

| Bevares | Hvorfor — målt eller besluttet |
|---|---|
| **TYPESKILTs palette og skrifter** | Låst af L54/L57. Ingen post her foreslår en farve eller en skriftfamilie. T2 vælger mellem de to, der allerede er i drift |
| **Filtret som fuldbredde plade** | Retningens egen tese. Venstreskinnen er fravalgt af den, ikke af mig (§3.5) |
| **P0 — filtrering i ren CSS med `:has()`** | Efterprøvet: filtrering virker uden JavaScript; `katalog.js` tilføjer kun søgning og levende tællinger. **F1 rører den ikke** — `<details>` er den JS-fri popover |
| **`.klaebebar`** | Målt i drift: `position:fixed`, 50 px, viste `"As2 · As2-W"` + "Åbn sammenligningen" + "Ryd udvalget" efter to valg. Fladens bedste Operate-affordance. F2 **genbruger** den |
| **Tællernes ordlyd** | "41 af 77", "74 robotter i standardvisningen" — hver tæller siger selv, hvad den tæller. Målt korrekt gennem fire tilstande: 74 → 40 → 21 → 1. **Kun størrelse og placering ændres, aldrig ordene** |
| **Kortenes opbygning** | Navn under billedet, producent over. `beskaaretOver25pct: 0`, `vandretOverloeb: 0` ved både 1440 og 390. Kortet er sundt |
| **De fem sorteringsvalg** | Alfabetisk, udgivelsesår, pris, nyttelast, hastighed — plus noten om ECB-kursen. Vej 1 gør "udgivelsesår" vigtigere, ikke anderledes. (Men se §1.5) |
| **De tre datatilstande** (hård begrænsning 5) | Ikke rørt af nogen post. T1 ændrer grader, ikke flader eller mærker |
| **Berøringsgulvet 44 px** | `<summary>` 44 px, søgefelt 44 px. F1 **bygger på** de 44 px — skærer aldrig i dem |
| **Al faktisk tekst** | Refinement, ikke redesign. Ingen post omskriver en påstand, et tal eller en kilde |
| **`assets/filter.js`** | Død kode (74 linjer, indlæses af ingen — L50). Uden for planens ærinde; nævnt, så næste læser ikke tror, den blev overset |

---

## 7. Byggerækkefølge — tre spor plus ét beslutningspunkt

Ordnet efter betydning for den besøgendes opgave, ikke efter byggelethed. **Ingen to spor ejer
samme fil.**

### Beslutningspunkt B0 — før noget sendes

Ikke et spor. Tre spørgsmål til JPK, som §5 og §4.3 rejser:

1. **Hvilken af §5.3's tre veje?** Tallene på bordet: heroen opfyldte D20 (993 → **317**,
   1820 → **500**), og det filtrerbare katalog ligger på **1582 / 2908**. Vej 1 er den eneste, der
   holder begge tal, og den koster L69's h1-ordlyd.
2. **Må `.klaebebar` bære resultattallet?** (F2, §3.4 — en udvidelse af L67.)
3. **`--sans` → Saira eller Literata?** (§4.3)
4. **Gælder "aldrig nyeste" (D15/L44) stadig for sorteringskontrollen?** (§1.6)

Spor 1 kan ikke skrives som brief, før spørgsmål 1 er besvaret. Spørgsmål 2 spærrer kun F2, ikke F1.

### Spor 1 — `orden` · størst virkning, spærret af B0

| Ejer | |
|---|---|
| `tools/skabelon/katalog.mjs` | sidens struktur (`aabning` bygges fra linje 1327) |
| `assets/generator.css` | **kun** `.aabning*`-reglerne (~linje 1254–1297) |
| `tests/dele/35-*`, `tests/dele/48-*` | **assertions vendes om, aldrig slettet** |
| `data/i18n/da.json`, `en.json` | kun hvis en streng skal genbruges |

**Færdig, når** alle fire holder samtidig — mål med `shape-d20.mjs` og `shape-brug2.mjs`:

1. `foersteKortPaaSiden` **≤ 317** (1440) og **≤ 500** (390) — heroens gevinst må ikke tabes.
2. `foersteKortIGitteret` **< 900** (1440) og **< 844** (390) — i dag 1582 / 2908.
3. `senesteSynlige` falder, når der filtreres (i dag 9/9/9 gennem tre tilstande) — eller er 0,
   hvis Vej 1 vælges og de ni er blevet til gitterets egen første række.
4. `build.mjs` 0 fejl og 1110 tal med kilde; `tests/koer.mjs` grønt med **omvendte** assertions,
   ikke færre. Antallet må gerne ændre sig fra 1434 — det må retningen på en assertion ikke.

R2 (søgefeltet op) kan lægges i dette spor **eller** sendes alene, hvis B0 trækker ud — det er
ikke spærret.

### Spor 2 — `filterplade` (F1 + F2) · fladens definerende fejl

| Ejer | |
|---|---|
| `assets/generator.css` | `.facet*`, `.facetter__net`, `.plade__krop` (**`overflow:hidden`, linje 1261**) |
| `assets/system.css` | `summary.facet__navn`-blokken (~linje 1954–2035) |
| `assets/katalog.js` | **kun** `.klaebebar`-afsnittet, hvis F2 vælges |

**Færdig, når** `facetter__net.h ≤ 96` med alt lukket, **og** `resultat.top` er uændret ved åbning
af én gruppe (i dag 1460 → 1740), **og** filtrering stadig virker med JavaScript slået fra.

*Ikke spærret af B0* — kan sendes med det samme.

### Spor 3 — `skala` (T1) · fladens læsbarhed

| Ejer | |
|---|---|
| `assets/system.css` | typografireglerne — **ikke** `summary.facet__navn`-blokken (Spor 2 ejer den) |
| `assets/generator.css` | `font-size` i `.kort*` |

**Færdig, når** `shape-type.mjs` viser ≤ 7 grader ved både 1440 og 390 px, og `.kort__saml-ord`
ikke ombryder ved 390 px.

**Skal ligge EFTER Spor 2** — begge rører `assets/system.css`. Aldrig samtidig.

### Spor 4 — `rum` (rytmen) · oprydning, ikke oplevelse

**Målt:** 110 unikke padding-værdier · 221 erklæringer · 96 (43 %) med `var(--rN)` · 125 uden ·
72 unikke rå værdier.
*Metode, så tallet kan genskabes:*
`grep -ohE "padding[a-z-]*:[^;}]+" assets/system.css assets/generator.css`, værdien efter kolon,
mellemrum fjernet, shorthand talt som **én** værdi. (Briefets 89/81/48 er lavere, fordi det
formentlig tæller ét stilark eller kun enkeltværdier — metoden stod ikke i briefet, så jeg kan ikke
afgøre hvilken.)

**Forslag:** katalogsiden bruger **fire** af de ni trin — `--r2` (8), `--r4` (16), `--r5` (24),
`--r7` (48). `--r1`/`--r3` er deltrinene, der producerer 8/9/12/13-driften; `--r6`/`--r8`/`--r9` er
sidestørrelser, som en tæt Operate-flade ikke skal bruge — den 797 px høje åbning er præcis, hvad
r8/r9-tænkning frembringer.

| Ejer | `assets/generator.css` + `assets/system.css` — **kun** `padding`/`gap`/`margin` |

**Færdig, når** 0 rå px-værdier står i katalogfladens egne selektorer, og sidehøjden er uændret ± 5 %.

*Sidst,* fordi gevinsten er vedligeholdelse frem for oplevelse, og fordi de tre foregående flytter
de tal, det skal rydde op i.

### Samlet

```
B0 (JPK: tre spoergsmaal)
 │
 ├─► Spor 1 orden      (katalog.mjs + .aabning-CSS + tests 35/48)   ← spaerret af B0
 │
 └─► Spor 2 filterplade ──► Spor 3 skala ──► Spor 4 rum
     (generator.css +        (system.css      (padding/gap
      system.css facet +      typografi)       i begge ark)
      katalog.js)
```

Spor 1 kan køre parallelt med Spor 2 (disjunkte filer). Spor 2 og 3 må **aldrig** køre parallelt.
R2 kan sendes alene når som helst.

---

## 8. Smagssager — forslag uden en pris, jeg kan skrive

Briefets regel: kan jeg ikke skrive, hvad det koster læseren, hører forslaget hjemme her.

- **`.saml-taeller` og `.klaebebar` viser det samme samtidig.** Målt efter to valg: den statiske
  siger *"2 valgt til sammenligning"*, den klæbende *"As2 · As2-W"*. Sandsynligvis er den statiske
  no-JS-udgaven, og så er dubletten korrekt og bevidst — jeg kunne ikke afgøre det uden at læse mere
  JS, end sporet havde ærinde i.
- **Gitterets `gap: 1px`.** Kortene støder næsten sammen. Formentlig TYPESKILTs riller udført med
  vilje; jeg har ingen måling, der siger, det skader nogen.
- **Navigationen ved 390 px.** "Om os" står delvis uden for skærmen på skærmbilledet, men
  `vandretOverloeb` måler **0** — rækken ruller vandret som tiltænkt. Nævnt, fordi det *ser* ud som
  en fejl på et skud og ikke er det.

---

## 9. Antagelser og huller

`impeccable shape`s Fase 1 er et interview, og der var ingen at spørge. Skillens regel for den
situation: *"When no human or structured answer mechanism exists, mark assumptions plainly, return
the brief, and stop."*

1. **At PRODUCT.md's "retvisende billede af feltet" opfyldes af det ufiltrerede gitter.** Det er
   §2's kernebeslutning. Den kan omgøres uden at rive resten ned — men så falder Vej 1 i §5.3.
2. **At `.klaebebar` må bære et tal mere** (F2). L67 gav den til sammenligningsudvalget. En
   udvidelse af en truffet beslutning er JPK's kald, ikke et spors — derfor står den i B0.
3. **Ikke efterprøvet:** om `sort-dato` ("nyeste først") blev udtrykkeligt sanktioneret efter D15/L44.
   Jeg fandt ingen post, der trækker "aldrig nyeste" tilbage, og ingen, der bekræfter den efter L54.
   **Det er et hul i min søgning, ikke nødvendigvis i historikken.** Se §1.6.
4. **Ikke målt:** kontrastforholdene i den nye skala. T1 ændrer kun grader, ikke farver, så
   forholdene burde være urørte — men "burde" er ikke en måling, og en 9,5 → 11 px-hævning ændrer
   fladeandelen, som projektet måler kontrast på.
5. **Ikke efterprøvet:** om F1's overlejrende panel kan holde 44 px berøringsmål på alle ni grupper
   ved 390 px, hvor pladen er 358 px bred. Nyttelast og pris er skalaer, ikke lister, og de er de
   to, der har mindst plads. Det skal måles i sporet, ikke antages her.

**Metodenote til den vigtigste rettelse.** §1.4's fejl — at sammenligne "første kort i gitteret"
med D20's "første kort på siden" — blev fanget, fordi tallet så for godt ud til at være sandt:
en 59 %-forværring på et punkt, et Opus-designspor havde fået som udtrykkelig betingelse, er
usandsynligt. Det var værd at bruge én kørsel på at måle D20's egen størrelse, og resultatet vendte
konklusionen 180 grader. **Havde jeg ikke gjort det, ville planens overskrift have været en
anklage mod et spor, der gjorde sit arbejde rigtigt.**
