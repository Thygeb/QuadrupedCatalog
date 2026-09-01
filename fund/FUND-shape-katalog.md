# FUND-shape-katalog — designplan for katalogsiden

**Spor:** `spor/shape` · **Dato:** 1. sep 2026 · **Skill:** `impeccable shape`, mode `Operate`
**Type:** refinement, ikke redesign. D15's palette og skrifter og L40's INSTRUMENT-retning er låst
og røres ikke af nogen post her.

Alle tal i dette dokument er målt af sporet selv på `dist/` bygget fra `spor/shape` (main-HEAD
`ddbf9ad`), serveret på port 8165, verificeret mod disken med md5 før første tal blev brugt.
Målescripts ligger i sessionens scratchpad (`shape-geometri.mjs`, `shape-brug2.mjs`,
`shape-skrift.mjs`) — uden for repoet, jf. løftet om en afhængighedsfri generator.

---

## 0. Grundmåling

```
tools/validate.mjs   77 filer · 0 fejl · 1 advarsel   (advarslen er ghost-robotics-vision-60,
                                                       R9-afvigelse — den lå der i forvejen)
tools/build.mjs      218 sider · 1110 tal med kilde, 0 uden
```

**Afvigelse fra briefet:** briefet siger "213 byggede sider". Det faktiske tal er **218**.
Ikke en fejl — kataloget er vokset. Nævnt her, fordi et hårdkodet sidetal i et fremtidigt
acceptkriterium ville blive forkert igen ved næste robot.

---

## 1. Opgaven, den besøgende faktisk har

### De tre kandidater

| | Opgave | Hvem, ifølge PRODUCT.md |
|---|---|---|
| **A** | Finde ÉN robot, hvis navn man kender | Teknisk indkøber (sekundær), ankommer fra en søgning på en model |
| **B** | Indsnævre til et krav — nyttelast, IP-klasse, pris | Teknisk indkøber (sekundær), "skal kunne afvise mange modeller hurtigt" |
| **C** | Orientere sig i feltet uden mål | Nysgerrig fagperson (**primær**), ankommer uden et modelnavn |

Den naive læsning er: C er den primære brugers opgave, altså vinder C. **Den læsning er forkert,
og det er planens vigtigste enkeltbeslutning at sige hvorfor.**

PRODUCT.md's succeskriterium for den primære læser er ikke "browse". Det er ordret: *"kan på få
minutter få et retvisende billede af feltet — hvor mange producenter, hvilke typer robotter, hvad
de kan"*. **Det er ikke en tredje flade. Det er det ufiltrerede gitter af 77 kort, set som det
ligger.** C kræver altså ingen egen komponent overhovedet — den er fladens hviletilstand.

### Den valgte prioritet

> **B er layoutets drivende opgave. C er fladens standardtilstand og kræver ingen egen sektion.
> A løses af ét felt, ikke af et layout.**

Begrundelsen er ikke en smagsdom om hvem der er vigtigst, men en strukturel forskel mellem de tre:

- **B er den eneste, der kræver interaktion**, og derfor den eneste, hvor afstanden mellem
  betjeningen og dens virkning er et layoutproblem. A og C er *læse*opgaver — de tåler afstand.
  B går i stykker ved afstand, og den er i stykker i dag (målt i §2).
- **B er det, sitet er unikt bygget til.** 1.110 kildebelagte tal og "ikke oplyst" som en
  filtrerbar tilstand findes for B's skyld. PRODUCT.md's Operating Context siger det direkte:
  *"derfor skal 'ikke oplyst' være en synlig og filtrerbar tilstand … uanset hvilken af de to
  læsere der ser den"*.
- **A er den billigste at indfri og den dårligst indfriede i dag.** Søgefeltet ligger på
  y = 1069 (1440 px) og y = 1851 (390 px). Ét greb — flyt det over folden — lukker A helt.

**Hvad prioriteten koster.** Den nysgerrige fagperson mister en kurateret "her er det nye"-indgang.
Det er en reel pris, og den betales i §5, hvor funktionen genopstår som en sortering på ét gitter
i stedet for et gitter nummer to.

**Fravalgt:** C som layoutdriver (ville bevare en redaktionel forside oven på kataloget — den
findes allerede på `/da/`, og en anden på `/da/robotter/` er den samme side to gange). A som
layoutdriver (ville gøre fladen til et søgefelt med en liste under — det kaster de 1.110 tal væk,
som er hele grunden til at siden findes).

---

## 2. Det, målingerne viser — udgangspunktet

### 2.1 Den lodrette orden ved 1440 px

| Landmark | y (top) | højde |
|---|---:|---:|
| `header.daek` | 0 | 61 |
| `section.aabning` — "Nyeste i kataloget" | 61 | **797** |
| `h1.aabning__titel` | 109 | 45 |
| `.net--seneste` (9 kort) | 317 | 541 |
| `section.plade` — "Filtrér kataloget" | 858 | **602** |
| `.plade__hoved` (titel + brødtekst) | 890 | 121 |
| `input#sog-katalog` — **søgefeltet** | 1090 | 44 |
| `.facetter__net` (de ni celler) | 1134 | **326** |
| `h2.resultat__titel` — "74 robotter …" | 1518 | **14** |
| `.net` — **første katalogkort** | **1582** | 4094 |

### 2.2 Samme flade ved 390 px

| Landmark | y (top) |
|---|---:|
| `section.aabning` | 108 → 1470 (**1362 px høj**) |
| `input#sog-katalog` | **1851** |
| `.facetter__net` | 1895 (835 px høj) |
| **første katalogkort** | **2908** |

**Det tal, planen hænger på:** på en 390 × 844-telefon skal den besøgende rulle **2908 px — 3,4
skærmhøjder — før hun ser den første af de 77 robotter**, og **1851 px (2,2 skærmhøjder) før hun
ser søgefeltet.** Ved 1440 px er tallene 1582 px og 1069 px.

### 2.3 Rettelser til briefets tal

Briefets målinger er efterprøvet. To skal justeres, én bekræftes helt:

| Briefet siger | Målt her | Kommentar |
|---|---|---|
| Filterblokkens højde **326 px** | `.facetter__net` = **326 px** ✓ · men hele `section.plade` = **602 px** | 326 er kun cellegitteret. Overskrift (121) + søgefelt (65) + luft lægger 276 px oveni. Det er de 602, den besøgende betaler |
| Celle 109 px × 9, polstring 24 px, summary 44 px, etiket 11 px / 1,87 px spor | **Bekræftet præcist**, alle fem tal | 7 celler på 109, 2 på 108 (nyttelast, pris) |
| Kolonnegrænser `{334, 668, 1337}` m.fl. | Målt venstrekanter `{44, 382, 720, 1058}`, højrekanter `{382, 720, 1058, 1396}` | Samme fænomen, anden nulpunkt. Gitteret er 4 kolonner à 338 px, **gap 0** — cellerne støder direkte op til hinanden |
| Rækkefølge: "filterblok → søgefelt" | **Søgefeltet ligger INDE i filterblokken**, mellem dens overskrift (y=890) og cellegitteret (y=1134) | Betyder noget for §5: søgefeltet kan flyttes ud uden at røre filtrene |
| 89 forskellige padding-værdier, 81 rå px, 48 token-erklæringer | **110 unikke værdier · 221 erklæringer · 96 med `var(--rN)` (43 %) · 125 uden** | Højere, fordi jeg tæller begge stilark og medregner shorthand-kombinationer (`var(--r4) var(--r5)` tælles som én værdi). Metoden står i §7 |
| 55 skriftstørrelser i stilarkene | På **denne flade, renderet**: **20 unikke ved 1440 px, 21 ved 390 px** | Fladens eget tal er det brugbare. Se §4 |
| 213 byggede sider | **218** | Kataloget er vokset |

### 2.4 To fund, briefet ikke kendte

**FUND 1 — "Nyeste i kataloget" filtrerer aldrig med.** Målt ved at tælle synlige kort i
`.net--seneste` og i `.net` hver for sig gennem tre tilstande:

| Tilstand | Kort i "Nyeste" | Kort i gitteret | Tælleren siger |
|---|---:|---:|---|
| Uden filter | **9** | 74 | "74 robotter i standardvisningen" |
| `+ Inspektion` | **9** | 40 | "40 robotter i standardvisningen" |
| Søgning `"spot"` | **9** | **1** | "1 robot i standardvisningen" |

Efter en søgning på "spot" viser fladens øverste 1470 px (390 px) **ni kort, hvoraf intet er et
træf**, mens det ene rigtige træf — Boston Dynamics Spot — ligger på **y = 1863**. Skærmbilledet
taget umiddelbart efter søgningen er visuelt **identisk** med skærmbilledet før: intet på folden
antyder, at der er søgt. To kortgitre med samme kortdesign på samme side, hvor det ene adlyder
filteret og det andet ikke gør, læses som en fejl — ikke som en redaktionel sektion.

*Kontrafaktisk:* adlød blokken filteret, ville tallet 9 falde i mindst én af de tre tilstande.
Det gør det ikke i nogen af dem.

**FUND 2 — sektionen duplikerer en kontrol, der allerede findes.** Gitteret har i forvejen
`<input type="radio" value="dato">` med etiketten **"Udgivelsesår, nyeste først"**. Hele den
797 px høje åbning gør altså det samme som en radioknap 700 px længere nede — og gør det
dårligere: den kan ikke slås fra, den ignorerer filteret, og den viser kun den *seneste årgang*
i stedet for en ordning. Sektionens egen note indrømmer grundlaget:
*"Udgivelsesår er oplyst for 45 af 77 modeller. De 32 øvrige oplyser intet årstal."*
Fladen åbner på en akse, der mangler for **42 %** af kataloget.

**FUND 3 — `--sans` opløses til styresystemets skrift.** `--sans` er stadig
`"Manrope lokal", Manrope, "Segoe UI Variable Text", …`, og Manrope har intet `@font-face` mere.
Målt med canvas-bredden af samme teststreng:

| Kandidat | Bredde |
|---|---:|
| **Som deklareret (`--sans`)** | **223,81** |
| Segoe UI Variable Text | **223,81** ← |
| SairaSemiCondensed | 207,31 |
| Literata | 233,31 |
| system-ui | 226,54 |

`document.fonts` indeholder præcis to familier: SairaSemiCondensed (400/500/600/700) og Literata.
Alt på `--sans` — herunder `body` (17 px, 97 noder) og `.t-h2` (34 px, "Sådan læses tallene") —
renderes altså i **styresystemets** skrift, ikke i en projektskrift, og ser derfor forskellig ud
på macOS og Windows. Det er ikke et brud på D15 (D15 låser Saira og Literata, og begge er i drift);
det er en **uafsluttet migrering**, som gør en Operate-flades vigtigste dyd — konsistens — afhængig
af besøgendes styresystem.

---

## 3. Filterblokkens form — svaret på 109 px-spørgsmålet

### Hvorfor "mindre polstring" og "større tekst" begge er forkerte svar

Begge er rigtige isoleret set og løser ingenting: 24 px → 16 px sparer 144 px af 326, og etiketten
fra 11 px → 13 px æder det meste igen. Man ender med den samme form, lidt strammere.

**Formen er problemet.** En sammenfoldet filtergruppe er en **kontrol**. Den bærer ét ord. Sitet
har allerede et kontrolsprog med en målt højde: søgefeltet er 44 px, `<summary>` er 44 px,
`.udtraek__greb` er 44 px. En kontrol, der bærer ét ord, skal have **en kontrols højde**, ikke et
korts. 109 px er et kort. Ni kort à 109 px for ni ord er en kortmetafor uden last — nøjagtigt som
briefet formulerer det.

Men det afgørende er ikke højden. Det er, at **det at åbne en gruppe skubber svaret længere væk**:

| | `.facetter__net` | `section.resultat` starter |
|---|---:|---:|
| Alle grupper lukkede | 326 px | y = 1460 |
| **Én gruppe åbnet** ("Anvendelse") | **607 px** | **y = 1740** |

Cellen vokser fra 109 til **390 px**, og resultatet flytter **280 px længere ned** i samme
øjeblik, den besøgende gør det, hun kom for. Og tælleren — den eneste kvittering for handlingen —
er en **14 px høj, 99 px bred** overskrift, der efter åbningen står på y = 2046, mens det filter,
der lige blev sat, står på y = 1610: **436 px fra hinanden, begge under folden.**

> **I Operate-mode er det fladens definerende fejl: betjening og virkning kan ikke ses samtidig.**

### Forslag F1 — filterlinjen (anbefalet)

**Hvad der ændres.** De ni `<details>` holder op med at være celler i et 4-kolonners kortgitter og
bliver **knapper på en ombrydende linje**. Hver `<summary>` beholder sine 44 px og sin
`+`/`−`-markør; panelet, den åbner, lægger sig som et **overlejrende felt under knappen** —
`position:absolute` i knappens egen kontekst — i stedet for at være et flow-element, der skubber.

Tre konsekvenser, som et byggebrief skal bære:

1. `.plade__krop` har i dag `overflow:hidden` (`assets/generator.css:1261`). **Et overlejrende
   panel bliver klippet af den.** Reglen skal ændres for filterbeholderen. Det er ikke en
   detalje — `impeccable`s Operate-reference nævner præcis denne fælde ved navn.
2. **P0 er urørt.** `<details>`/`<summary>` er den JavaScript-fri popover. Filtrering forbliver
   ren CSS med `:has()`. Intet i forslaget gør en filtrering afhængig af JavaScript.
3. Ved 390 px er en linje af ni knapper stadig en linje — den ombryder til 3–4 rækker à 44 px
   (~150–190 px) mod dagens 835 px.

**Hvad det koster læseren, hvis vi ikke gør det.** Hun kan ikke se, om hendes afkrydsning virkede,
uden at rulle — og hver ny afkrydsning flytter svaret længere væk, så det bliver værre, jo mere
hun arbejder.

**Sådan måles det.**
```
node <scratchpad>/shape-geometri.mjs http://localhost:<port>/da/robotter/ 1440
```
Færdig, når: `facetter__net.h ≤ 96` med alle grupper lukkede (fra 326), **og**
`resultat.top` er **uændret**, når én gruppe åbnes (i dag: 1460 → 1740).
Det andet kriterium er det vigtige — det første kan snydes med polstring alene.

### Forslag F2 — tælleren følger med

**Hvad der ændres.** `h2.resultat__titel` ("74 robotter i standardvisningen", i dag 14 px høj)
bliver den ene tydelige kvittering på fladen og **klæber**, mens filterlinjen er i brug.

Mekanismen findes allerede og er efterprøvet: `.klaebebar` (`position:fixed`, 50 px høj) blev
målt i drift efter at have valgt to robotter — den viste `"As2 · As2-W  Åbn sammenligningen
Ryd udvalget"`. Den skal ikke opfindes, den skal genbruges til et tal mere.

**Hvad det koster læseren, hvis vi ikke gør det.** Kvitteringen for hendes eneste handling er
usynlig 436 px væk.

**Sådan måles det.** Sæt et filter ved 1440 px og mål: tælleren skal have
`top i viewport < 900` uanset rulleposition. I dag: `taellerY = 2046` absolut, ude af syne.

### Fravalgt: venstreskinnen

Filtre i en klæbende venstrekolonne, resultater til højre, ville løse samvisningen *strukturelt* og
er den mest oplagte Operate-form. **Fravalgt af to grunde:** den koster gitteret ~350 px bredde
(5 kortkolonner falder til 4 på 1440 px), og den kræver alligevel en helt anden mobiludgave — så
man bygger to former i stedet for én. F1 + F2 giver den samme samvisning med ét design.

---

## 4. Typografisk hierarki på fladen

### Målt

**20 unikke skriftgrader ved 1440 px, 21 ved 390 px.** Fordelingen er det interessante:

| Spænd | Trin | Noder |
|---|---:|---|
| 52, 44, 34, 27, 25 px | 5 | **1 node hver** — fem displaygrader, hver brugt præcis én gang |
| 17 px | 1 | 97 |
| **15 → 8 px** | **14** | 15 · 14,5 · 14 · 13,5 · 13 · 12,5 · 12 · 11,5 · 11 · 10,5 · 10 · 9,52 · 9,5 · 8 |

**Fjorten grader på syv pixels.** 13,5 mod 13 mod 12,5 mod 12 er ikke et hierarki — læseren kan
ikke se forskel, så trinene bærer ingen betydning og koster kun sammenhæng. Og i den anden ende
har fem displaygrader én node hver: hver overskrift på fladen har sin egen størrelse.

To brud på projektets egne skrevne regler:
- **DESIGN.md siger: *"10,5 px er skriftgulvet i hele systemet."*** Målt: 10 px (3 noder),
  9,52 px (`.enhed`, enhedssuffikser), 9,5 px (92 noder — `.kort__saml-ord "Sammenlign"`,
  `.kort__mrk "Annonceret"`) og **8 px** (`.kildemaerke`, kildebogstaverne A/B).
- 8 px bæres af **kildemærket** — det element, der bærer sidens kerneløfte om at hvert tal har
  en kilde.

### Forslag T1 — seks trin

`impeccable`s Operate-reference: *"Tighter scale ratio. 1.125–1.2 between steps is typical."*
Med 20 grader er problemet dog ikke forholdet, det er antallet. Seks trin, forhold ~1,25, og
**fem af de seks værdier findes allerede på fladen** — kun 21 er ny:

| Trin | Rolle på katalogsiden | Erstatter |
|---:|---|---|
| **34** | Sidens ene `h1` | 52, 44, 34 |
| **27** | Sektionsoverskrift (der er to) | 27, 25 |
| **21** | Tælleren — fladens ene kvittering (§3, F2) | *ny* |
| **17** | Kortnavn og brødtekst | 17 |
| **13** | Metadata, prosa, tællinger i filtre | 15 · 14,5 · 14 · 13,5 · 13 · 12,5 |
| **11** | Etiketter, versaler, kontrolnavne | 12 · 11,5 · 11 · 10,5 · 10 · 9,5 |

**Én navngiven undtagelse:** `.kildemaerke` er en **superskrift**, ikke tekst i skalaen —
`font-size:max(8px,.34em)` (`assets/system.css:725`). Den skal blive en superskrift, men gulvet
hæves fra 8 til **10 px**. At tvinge den op i skalaen ville gøre et fodnotemærke lige så stort
som den etiket, det hænger på.

**Risiko, et byggebrief skal kende:** 9,5 → 11 px gør `"SAMMENLIGN"` og `"ANNONCERET"` bredere på
hvert kort (92 noder). Kortet er 269,6 px bredt ved 1440 px og 178,5 px ved 390 px. **Mål
ombrydningen ved 390 px, før trinnet lukkes** — det er dér, det knækker, hvis det knækker.

**Hvad det koster læseren, hvis vi ikke gør det.** Fjorten grader mellem 8 og 15 px betyder, at
skriftgraden holder op med at være et signal: hun kan ikke aflæse, hvad der er en etiket, og hvad
der er en værdi, og må læse ordene for at finde ud af det. På en flade med 1.110 tal er det
forskellen på at skimme og at læse.

**Sådan måles det.** Genkør `shape-type.mjs` (i scratchpad). Færdig, når den lister
**≤ 7 grader** ved både 1440 og 390 px (seks trin + superskriften), mod 20/21 i dag.

### Forslag T2 — luk skriftmigreringen

**Hvad der ændres.** `--sans` peges på en projektskrift i stedet for at falde igennem til
styresystemet (FUND 3). Dette er **ikke** et forslag om en ny skrift — D15's to skrifter er de
eneste kandidater, og begge er allerede selvhostede. Det er et valg mellem to eksisterende:
Saira til `body` (én familie, som Operate-referencen anbefaler) eller Literata, hvor prosaen
allerede står. **Valget hører til orkestratorens bord, ikke sporets** — det er en
identitetsbeslutning, ikke en oprydning.

**Hvad det koster læseren, hvis vi ikke gør det.** Hun ser en anden side end den, der blev
designet, hvis hun ikke sidder på Windows.

**Sådan måles det.** `shape-skrift.mjs`. Færdig, når `body`s `breddeSomDeklareret` er lig
`breddeSomSaira` (207,31) eller `breddeSomLiterata` (233,31) — i dag 223,81 = Segoe.

---

## 5. Rækkefølgen på fladen

### I dag

```
header → h1 "Nyeste i kataloget" (797 px, filtrerer aldrig med)
       → h2 "Filtrér kataloget" (602 px, heri søgefeltet på y=1090)
       → h2 "74 robotter …" (14 px høj)
       → gitteret (første kort y=1582)
```

`h1`'et er fladens største typografiske signal, og det navngiver **teaseren**, ikke kataloget.
En skærmlæser annoncerer siden som "Nyeste i kataloget". Siden, der svarer på *hvilke firbenede
robotter findes der*, hedder sig selv efter sin egen reklame.

### Forslag R1 — åbningssektionen udgår

**Hvad der ændres.** `section.aabning` fjernes som selvstændigt kortgitter.
- `h1` bliver **"Kataloget"** (`katalog_titel` findes allerede i i18n-laget).
- Sætningen *"77 robotter fra 8 lande. Hvert tal har en kilde og en hentedato…"* **bevares** og
  flyttes op under `h1`. Det er præcis den orientering, PRODUCT.md lover den primære læser
  ("hvor mange producenter, hvilke typer"), og den koster én linje i stedet for 797 px.
- **Funktionen "nyeste" går ikke tabt.** Den findes allerede som
  `<input value="dato">` — *"Udgivelsesår, nyeste først"*. Den bliver den eneste udgave, og den
  bliver bedre: den kan slås fra, og den adlyder filteret.
- `2026`-årstemplet (52 px, én node) forsvinder med sektionen.

**Hvad det koster læseren, hvis vi ikke gør det.** Hun ser ni robotter, der ikke er svar på det,
hun spurgte om, hver eneste gang hun filtrerer eller søger — og hun kan ikke slippe af med dem.

**Sådan måles det.** `shape-brug2.mjs`. Færdig, når `senesteSynlige` er **0 i alle tre
tilstande** (i dag 9/9/9), og `shape-geometri.mjs` viser at **første katalogkort** er over folden:
`< 900` ved 1440 px (i dag 1582) og `< 844` ved 390 px (i dag **2908**).

### Forslag R2 — søgefeltet ud af filterblokken og op

**Hvad der ændres.** `input#sog-katalog` flyttes ud af `section.plade` og placeres direkte under
`h1` — over filterlinjen. Det er ét felt, det løser opgave A alene, og det er i dag begravet
761 px (1440) / 1743 px (390) nede.

Rækkefølgen bliver:

```
header → h1 "Kataloget" + én orienterende linje
       → søgefelt          (opgave A)
       → filterlinje       (opgave B, §3 F1)
       → tælleren          (kvitteringen, §3 F2 — klæber)
       → gitteret          (opgave C, fladens hviletilstand)
```

**Hvad det koster læseren, hvis vi ikke gør det.** Den besøgende, der kom med et modelnavn —
den hyppigste ankomst for den sekundære læser ifølge PRODUCT.md — skal rulle to skærmhøjder
på telefon for at finde det ene felt, hun havde brug for.

**Sådan måles det.** `shape-geometri.mjs`: `soegefelt.top < 500` ved 1440 px (i dag 1090) og
`< 844` ved 390 px (i dag 1851).

---

## 6. Hvad der IKKE skal ændres

Set på, målt, og bevaret med vilje. Uden dette afsnit kan man ikke se forskel på "overvejet og
beholdt" og "ikke kigget på".

| Bevares | Hvorfor — målt |
|---|---|
| **Palette og skrifter (D15)** | Låst. Ingen post her foreslår en farve eller en skriftfamilie. T2 vælger mellem de to skrifter, der allerede er i drift |
| **INSTRUMENT-retningen (L40)** | Alle forslag går samme vej: færre streger, strammere gitter. Ingen glasmorfisme, grain, parallax eller inerti-scroll er foreslået noget sted |
| **P0 — filtrering i ren CSS med `:has()`** | Efterprøvet: filtrering virker uden JavaScript, og `assets/katalog.js` tilføjer kun søgning og levende tællinger. **F1 rører den ikke** — `<details>` er den JS-fri popover |
| **`.klaebebar`** | Målt i drift: `position:fixed`, 50 px, viste `"As2 · As2-W"` + "Åbn sammenligningen" + "Ryd udvalget" efter to valg. Det er fladens bedste Operate-affordance. F2 **genbruger** den, erstatter den ikke |
| **Tællernes ordlyd** | "41 af 77", "74 robotter i standardvisningen" — hver tæller siger selv hvad den tæller. Målt korrekt gennem fire tilstande: 74 → 40 → 21 → 1. **Kun deres størrelse og placering ændres, aldrig deres ord** |
| **Kortenes opbygning** | Navnet under billedet, producent over. `beskaaretOver25pct: 0` og `vandretOverloeb: 0` ved både 1440 og 390 px. Kortet er sundt |
| **Sorteringens fem valg** | Alfabetisk, udgivelsesår, pris, nyttelast, hastighed — plus noten om ECB-kursen på prissorteringen. R1 gør "udgivelsesår" vigtigere, ikke anderledes |
| **De tre datatilstande** (hård begrænsning 5) | Ikke rørt af nogen post. Skalaen i §4 ændrer grader, ikke flader eller mærker |
| **Berøringsgulvet på 44 px** | `<summary>` er 44 px, søgefeltet er 44 px. F1 **bygger på** de 44 px — den skærer aldrig i dem |
| **Al faktisk tekst** | Refinement, ikke redesign. Ingen post omskriver en påstand, et tal eller en kilde |
| **`assets/filter.js`** | Død kode (74 linjer, indlæses af ingen — L50). Ligger uden for denne plans ærinde; nævnt så næste læser ikke tror, den blev overset |

---

## 7. Byggerækkefølge — fire spor med adskilt filejerskab

Sporene er ordnet efter, hvad de betyder for den besøgendes opgave — ikke efter, hvor lette de er
at bygge. **Ingen to spor ejer den samme fil.**

### Spor 1 — `orden` (R1 + R2) · størst virkning, mindst risiko

Fjern åbningssektionen, flyt søgefeltet op, giv `h1` sidens rigtige navn.

| Ejer | |
|---|---|
| `tools/skabelon/katalog.mjs` | sidens struktur (`aabning`-blokken bygges på linje 1327 ff.) |
| `assets/generator.css` | **kun** `.aabning*`-reglerne (§ omkring linje 1254–1297) |
| `data/i18n/da.json`, `en.json` | **kun** hvis en streng skal genbruges; ingen nye tekster |

**Færdig, når** `senesteSynlige` = 0 i alle tre tilstande, første katalogkort < 900 px (1440) og
< 844 px (390), søgefelt < 500 px (1440) og < 844 px (390) — og `build.mjs` stadig giver
0 fejl og 1110 tal med kilde.

*Hvorfor først:* det er det eneste spor, der kan køres uden at nogen af de andre er færdige, og
det fjerner 797 px, som ellers ville gøre alle de andres målinger sværere at læse.

### Spor 2 — `filterlinje` (F1 + F2) · fladens definerende fejl

Ni celler bliver til en linje af kontroller med overlejrende paneler; tælleren klæber.

| Ejer | |
|---|---|
| `assets/generator.css` | `.facet*`, `.facetter__net`, `.plade__krop` (**`overflow:hidden`, linje 1261**) |
| `assets/system.css` | `summary.facet__navn`-blokken (linje ~1954–2035) |
| `assets/katalog.js` | **kun** `.klaebebar`-afsnittet, hvis tælleren skal klæbe |

**Færdig, når** `facetter__net.h ≤ 96` med alt lukket, **og** `resultat.top` er uændret ved
åbning af én gruppe (i dag 1460 → 1740), **og** filtrering stadig virker med JavaScript slået fra.

*Afhænger af Spor 1* — deler ikke filer med det, men måles lettere efter det.

### Spor 3 — `skala` (T1) · fladens læsbarhed

Tyve skriftgrader ned til seks plus én navngiven superskrift.

| Ejer | |
|---|---|
| `assets/system.css` | typografireglerne — **ikke** `summary.facet__navn`-blokken (Spor 2 ejer den) |
| `assets/generator.css` | `font-size` i `.kort*`, `.aabning*` udgår med Spor 1 |

**Færdig, når** `shape-type.mjs` viser ≤ 7 grader ved både 1440 og 390 px, og `.kort__saml-ord`
ikke ombryder ved 390 px.

*Skal ligge EFTER Spor 2*, fordi begge rører `assets/system.css`. Kør dem aldrig samtidig.

### Spor 4 — `rum` (rytmen) · oprydning, ikke oplevelse

**Målt:** 110 unikke padding-værdier · 221 erklæringer · 96 (43 %) med `var(--rN)` · 125 uden ·
72 unikke rå værdier.
*Metode:* `grep -ohE "padding[a-z-]*:[^;}]+" assets/system.css assets/generator.css`, værdien
efter kolon, mellemrum fjernet, shorthand talt som én værdi. Kør den kommando for at genskabe
tallene.

**Forslag:** katalogsiden bruger **fire** af de ni trin — `--r2` (8), `--r4` (16), `--r5` (24),
`--r7` (48). `--r1`/`--r3` er de deltrin, der producerer 8/9/12/13-driften; `--r6`/`--r8`/`--r9` er
sidestørrelser, som en tæt Operate-flade ikke skal bruge — den 797 px høje åbning er præcis, hvad
r8/r9-tænkning frembringer.

| Ejer | `assets/generator.css` og `assets/system.css` — **kun** `padding`/`gap`/`margin` |

**Færdig, når** 0 rå px-værdier står tilbage i katalogfladens egne selektorer, og
`shape-geometri.mjs` giver samme sidehøjde ± 5 %.

*Sidst,* fordi det er det eneste spor, hvis gevinst er vedligeholdelse frem for oplevelse — og
fordi de tre foregående flytter de tal, det skal rydde op i.

### Rækkefølgen samlet

```
Spor 1 orden  ──►  Spor 2 filterlinje  ──►  Spor 3 skala  ──►  Spor 4 rum
(katalog.mjs +     (generator.css +         (system.css        (padding/gap
 .aabning-CSS)      system.css facet-blok    typografi)         i begge ark)
                    + katalog.js)
```

Spor 2 og 3 må aldrig køre parallelt: begge skriver i `assets/system.css`.
Spor 1 kan køre parallelt med et hvilket som helst spor uden for kataloget.

---

## 8. Smagssager — forslag uden en pris, jeg kan skrive

Efter briefets regel: kan jeg ikke skrive, hvad det koster læseren, hører forslaget hjemme her og
ikke ovenfor.

- **`.saml-taeller` og `.klaebebar` viser det samme samtidig.** Målt efter to valg: den statiske
  siger *"2 valgt til sammenligning"*, den klæbende siger *"As2 · As2-W"*. To kvitteringer for
  samme handling. Sandsynligvis er den statiske no-JS-udgaven, og så er dubletten korrekt og
  bevidst — jeg kunne ikke afgøre det uden at læse mere JS, end sporet havde ærinde i.
- **Gitterets `gap: 1px`.** Kortene støder næsten sammen. Det er formentlig INSTRUMENT-retningen
  udført med vilje (færre streger, strammere gitter), og jeg har ingen måling, der siger, at det
  skader nogen.
- **Navigationen ombryder ikke ved 390 px** — "Om os" står delvis uden for skærmen i skærmbilledet,
  men `vandretOverloeb` måler 0, så rækken ruller vandret som tiltænkt. Nævnt, fordi det ser ud
  som en fejl på et skærmbillede og ikke er det.

---

## 9. Antagelser, jeg ikke kunne få bekræftet

`impeccable shape`s Fase 1 er et interview. Der var ingen at spørge — sporet kører uden en
menneskelig modpart. Skillens egen regel for den situation:
*"When no human or structured answer mechanism exists, mark assumptions plainly, return the brief,
and stop."* De antagelser, planen hviler på:

1. **At PRODUCT.md's "retvisende billede af feltet" opfyldes af det ufiltrerede gitter** og ikke
   kræver en kurateret indgang. Det er §1's kernebeslutning, og den kan omgøres uden at rive
   resten af planen ned — men så skal §5's R1 falde, og den bærer det største enkelttal (2908 px).
2. **At "Nyeste i kataloget" ikke er en truffet beslutning, jeg ikke har fundet.** Jeg har ikke
   gennemsøgt STATUS.md's Lukket-tabel for en post, der udtrykkeligt bestiller den sektion.
   **Det skal slås op, før Spor 1 sendes** — det er præcis Å55-fælden.
3. **At tælleren må klæbe.** L67 gav `.klaebebar` til sammenligningsudvalget. At give den et tal
   mere er en udvidelse af en truffet beslutning, ikke en ny — men det er JPK's kald.
