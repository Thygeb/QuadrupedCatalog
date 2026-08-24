# FUND — designløftet af forsiden (design/loeft)

Skrevet 21. aug 2026 i worktreen `C:\Praktik\websites\udstilling-wt-design`, gren
`design/loeft`. Opgaven kom fra CEO'en: forsiden "ligner lort", målt som 46 kort, 46 tomme
grå plader, 0 `<img>`-elementer og en hero uden billede. Dette dokument er før/efter,
læsbart uden browser.

## Skill-vurdering

Instruksen krævede tre skills i rækkefølge, alle indlæst og brugt:

1. **`frontend-design`** bidrog processen: brainstorm → plan → kritik af planen mod
   AI-standardudseendet, før kode. Den konkrete gevinst var at forkaste det første udkast
   til en "signaturfigur" (en abstrakt geometrisk figur i hero'en, uden forbindelse til
   robotdata) og erstatte den med vægtstigen, som er bygget af sidens egne tal. Skillens
   advarsel mod "big number + label + gradient accent" som skabelonsvar blev taget
   alvorligt: vægtstigen viser en fordeling, ikke ét stort tal.
2. **`ui-ux-pro-max`** — kun datadelen, som beordret. Ingen `--design-system`-kørsel blev
   brugt, fordi systemet allerede har en fastlåst palet og typografi (`DESIGN.md`); i
   stedet blev prioritetstabellen brugt til at checke rækkefølgen (tilgængelighed før
   typografi før animation), og WCAG-tærsklerne (4,5:1 normal tekst, 3:1 stor tekst/grafik)
   er dem, kontrastmålingerne nedenfor er regnet efter.
3. **`impeccable`** — `bolder`/`layout`-underkommandoerne blev brugt til at vurdere
   forsidens rytme, og `detect.mjs` blev kørt mekanisk til sidst (se afsnittet
   Detektorkørsel). Selve `impeccable`-skillen blev indlæst fra disk direkte (stien
   `C:\Users\thyge\.claude\skills\impeccable\scripts\`), fordi den ikke længere var kendt
   som slash-kommando i sessionen — **dette er skrevet her, så et stille fallback ikke
   forveksles med at skillen kørte.**

Gået forbi: `critique` og `ui-ux-critique` (kritikrunder på en *bygget* side — relevante i
en efterfølgende runde, ikke i denne, hvor opgaven var at bygge løftet). `dataviz` blev
overvejet til vægtstigen, men fravalgt: stigen er ikke et diagram med akser og forklaring,
den er en typografisk/strukturel komponent i systemets egen sprogbrug (mono-figurer,
`--hegn`-linjer), og at bygge den som et "chart" ville have importeret et andet formsprog
end resten af siden.

## Filer rørt

- `assets/system.css` (547 → 621 linjer): typografiskala, gitter-mellemrum,
  sektionshoved, måleplade-komponenten
- `assets/generator.css` (136 → 243 linjer): hero-flade, to-spaltet hero-layout,
  vægtstige-komponenten, sektionsluft
- `tools/skabelon/forside.mjs`: vægtstige-markup, hero omstruktureret i `.hero-ord`
- `tools/skabelon/side.mjs`: `tomPlade()` — måleplade-generatoren, kaldt fra `billede()`
  i stedet for altid at falde til `.intetfoto`
- `DESIGN.md`: typografiafsnit, layoutafsnit, to nye komponentafsnit ("Hero'en og
  vægtstigen", "Måleplade"), lukkende målenote

**Ikke rørt** (låst til andre agenter, som instrueret): `robot.mjs`, `katalog.mjs`,
`build.mjs`, `skema.mjs`, `validate.mjs`, `data/i18n/*`, `STATUS.md`. Ingen af
designløftets ændringer krævede adgang til dem — al ny logik ligger i skabeloner og CSS.

## Fletning med main undervejs

To sessionsafbrydelser ramte dette arbejde. Da anden session tog over, var `main` flyttet
fra `86000eb` til `15e42b6` (i18n-nøgler flyttet ind i `data/i18n/`, reservemekanismen
`tools/skabelon/reserve-*.json` slettet, nævneren i specifikationstætheden låst til 33).
Kun `tools/skabelon/side.mjs` var fælles mellem grenene. `git merge main` blev kørt efter
et WIP-commit af det ufærdige arbejde; fletningen løste sig uden konfliktmarkører, og et
efterfølgende tjek bekræftede at alle nøgler, denne gren bruger (`t()`/`T.`-opslag i
`forside.mjs` og `side.mjs`), findes i de flettede `data/i18n/da.json` og `en.json` — 0
manglende nøgler i bygrapporten, 0 forekomster af den brudte-nøgle-markør `«…»` i `dist/`.

## Før / efter

### 1. Hero'en

**Før:** hvidt panel, overskrift, ledetekst, søgefelt (skjult uden JS), "se alle"-knap,
anvendelsesfiltre. Ingen figur, intet der viste, hvad kataloget faktisk indeholder.

**Efter:** samme indhold, plus en **vægtstige** — et hvidt panel med en akse fra 0 til
100 kg (afledt: næste hele 20-kg-trin over den tungeste robot, 85 kg), 37 anonyme mærker
(én pr. robot med oplyst egenvægt), de to klassegrænser som tværstreger, og de fire
vægtklasser som klikbare trin under aksen: **12 · 12 · 13 · 9** — tallene matcher bygningens
egen optælling præcist. Det fjerde trin ("Vægt ikke oplyst") ligger visuelt adskilt fra de
tre andre, i hullets eget formsprog (stiplet `hegn`, `tom`-flade).

Ingen robot er navngivet på stigen — samme regel som forbød én robot i selve hero'en
("at vælge én ville være en anbefaling"). Stigen er sidens egen indholdsfortegnelse: hvert
trin er et link til sin sektion, og den virker uden en linje JavaScript.

Fladen under hero'ens tekst er ændret fra hvidt panel til sidens grå bund — to hvide
flader adskilt af én hårfin linje læste som ét bånd, ikke som en åbning. Kun stigen er nu
hvid, og dermed den eneste ting i hero'en, der ligner en genstand.

Layout: to spalter (ord til venstre, stige til højre) over 1180 px; stablet derunder.

### 2. De 46 tomme plader

**Før:** `dist/da/index.html` havde 46 identiske grå plader med stiplet kant og teksten
"Ingen brugbar optagelse / Vi har ikke selv fotograferet modellen ..." — ordret gentaget i
kortets fodnote lige nedenunder. 0 `<img>`.

**Efter:** stadig 0 `<img>` (billedrørledningen er et andet spor, som instrueret — der er
stadig ingen filer i `assets/fotos/` eller `assets/silhuetter/`), men pladen er ikke
længere ét ensartet udtryk:

- **33 kort** viser nu en **måleplade**: en kasse tegnet i fælles målestok
  (billedfeltets bredde = 1900 mm på alle kort) af robotternes egne oplyste længde- og
  højdetal, med et gulv, et bagvedliggende net (ét stip pr. 250 mm) og en etiket der
  navngiver de to mål. Kassen har skarpt hjørne med vilje — den er en tegning, ikke en
  komponent, og skal ikke kunne forveksles med en produktvisning.
- **13 kort** (ned fra 46) beholder den gamle `.intetfoto`-plade, fordi robotten hverken
  oplyser længde eller højde.
- Fordelingen 33/13 er ikke skønnet — den kommer af, at `skema.mjs` normaliserer
  `vaerdi_min`/`vaerdi_maks` til `min`/`maks` under indlæsning; to Honey Badger-modeller
  med højde angivet som interval ville ellers fejlagtigt være talt som "uden højde".
  Verificeret ved at sammenligne en rå YAML-parse (31/15) mod det faktiske byg (33/13) og
  spore forskellen til alias-normaliseringen i `tools/skema.mjs:295`.

Fladen er stadig `--tom` (hullet er ikke væk — fotografiet mangler stadig), men hullet har
nu noget at vise frem i stedet for at gentage den samme sætning 46 gange.

### 3. Rytme og skala

**Før:** gitter-mellemrum 26 px / 22 px — begge uden for ottetalsskalaen (4/8/12/16/24/32/
48/64/96). Sektioner havde ensartet 48 px luft foran hver, uanset om det var den første
sektion efter hero'en eller den fjerde efter en anden. Sektionshovedets versaletiket delte
grundlinje med overskriften.

**Efter:**

- Gitter: 32 px / 24 px (`--r6`/`--r5`), på skalaen. Stadig fire spalter ved 1440 px
  (4 × 310 + 3 × 24 = 1312 ≤ 1352 px indhold).
- Sektionsluft hævet til 96 px (`--r9`) mellem vægtklassesektionerne, 48 px (`--r7`) før
  den første. Fire ensartede afsnit i træk med kun 48 px imellem løb sammen; 96 px gør
  hvert vægtklasseskift til en mærkbar grænse.
- `.sektion-hoved > .etiket` fik `flex:1 0 100%` — egen linje over overskriften i stedet
  for at dele dens grundlinje. Skabeloner uden en etiket i sektionshovedet (robot.mjs,
  producent.mjs) er uberørt, fordi reglen kun rammer et faktisk `.etiket`-barn.

### 4. Typografien

**Før:** hero 56 px maks, H1 42 px, H2 30 px, H3 19 px — forholdet mellem trinene var
1,33 / 1,40 / 1,58, og forskellen mellem hero og H1 var svær at se uden at sammenligne dem
side om side.

**Efter:** hero 76 px maks, H1 46 px, H2 34 px, H3 uændret 19 px. Ved 1440 px er
forholdene mellem naboled 1,65 / 1,35 / 1,79 / 1,12 — hero og H1 er nu tydeligt
forskellige størrelsesordener. Skriftgulvet på 10,5 px er urørt; kun de tre øverste trin
er hævet.

## Selv-test med tælling

**Byg.** `node tools/build.mjs` efter fletning og efter alle rettelser: **123 sider, 46
kort på forsiden** (uændret, som krævet). 0 fejl, 1 advarsel (præeksisterende,
`ghost-robotics-vision-60`, urørt af dette arbejde). 566 kildemærkede tal, 0 uden.
Tæthedsnævner: 33 (fra den fletning, der landede undervejs — ikke denne gren).

**Kontrast.** 13 par målt med samme formel som `prototype/kontrast-system.mjs` (WCAG 2.1,
relativ luminans), for hver flade min nye kode bruger eller genbruger:

| Par | Forhold | Krav | Status |
|---|---|---|---|
| blæk3 : tom (måleplade-etiket, stige-hul-tekst) | 5,35 | 4,5 | OK — **nyt tal** |
| blæk3 : panel | 6,16 | 4,5 | OK — efterprøvning |
| blæk3 : bund | 5,55 | 4,5 | OK — efterprøvning |
| hegn : tom (måleplade-kant, jordlinje, stige-hul-kant) | 3,20 | 3,0 | OK — efterprøvning |
| hegn : panel (kasse-kant, stige-akselinje) | 3,68 | 3,0 | OK — efterprøvning |
| hegn : bund | 3,32 | 3,0 | OK — efterprøvning |
| hegn : accent-ro (stige-trin ved hover) | 3,19 | 3,0 | OK — **nyt tal**, tættest på kravet |
| blæk : accent-ro (stige-trin-navn ved hover) | 15,69 | 4,5 | OK — **nyt tal** |
| blæk : panel (stige-mærker, stige-figur) | 18,11 | 3,0 | OK — efterprøvning |
| blæk : bund (hero-overskrift, nu direkte på bund) | 16,31 | 3,0 | OK — efterprøvning |
| blæk2 : panel (stige-trin-navn) | 8,01 | 4,5 | OK — efterprøvning |
| blæk2 : bund (hero-lede, nu direkte på bund) | 7,21 | 4,5 | OK — efterprøvning |
| linje : tom (måleplade-net) | 1,09 | ingen (dekorativ) | dekorativ |

**13 par målt, 0 faldet under kravet.** 9 af de 13 var efterprøvninger af tal, `DESIGN.md`
eller kildens kommentarer allerede påstod (alle 9 stemte nøjagtigt); 4 var reelt nye
kombinationer uden noget tidligere tal at holde op imod. Det tætteste par på kravet er
`hegn : accent-ro` ved 3,19 mod et krav på 3,0 — 6 % margin, værd at holde øje med hvis
`--accent-ro` nogensinde ændres.

**Brudpunkter.** Ingen browser findes i værktøjskæden (projektet har bevidst nul
afhængigheder, og alle eksisterende målescripts i `prototype/` er matematiske, ikke
skærmbilleder). Efterprøvningen er derfor gjort som CSS-sporing: alle fire brudpunkter
lokaliseret, deres nøjagtige grænseværdi sammenlignet med systemets eksisterende
konvention, og bredden regnet igennem for at udelukke overløb.

- **1180/1181 px** — ny regel: `.hero .rum` bliver to-spaltet ved `min-width:1181px`.
  Grænsen matcher nøjagtigt stribens eksisterende `max-width:1180px`, så der hverken er
  overlap eller et gab mellem "stribe smalner ind" og "hero bliver enkeltspaltet".
  Bredderegnestykke ved netop 1181 px: indhold ≈ 1101 px, spalter 517/488 px efter 96 px
  mellemrum — ingen af vægtstigens fire trin (≈104 px hver) presses under en brugbar
  bredde.
- **680 px** — ny regel: `.hero-lede{font-size:19px}` ved `min-width:680px`. Matcher
  stribens eksisterende `max-width:680px`-grænse (2 spalter). Ved netop 680 px er begge
  regler aktive samtidig, som tilsigtet: 679 og nedefter er ledeteksten 17 px.
- **679 px** — ny regel: vægtstigens akselinje og etiket skjules
  (`.stige > .etiket,.stige-akse{display:none}`), samme `max-width:679px`-grænse som
  gitterets egen enkeltspalte-regel. De fire trin bærer den samme oplysning i tal og er
  uændrede.
- **420 px** — ny regel: `.stige-baand` går fra 4 til 2 spalter, og hul-trinnets
  venstremargin fjernes. Matcher den eksisterende `max-width:420px`-grænse for den
  kompakte stribe.

**4 brudpunkter efterprøvet. Fundet: 0 gab, 0 overlap mellem nye og eksisterende regler —
alle fire nye grænser er sat til at ramme nøjagtig samme pixel som en allerede
eksisterende regel i systemet, i stedet for at opfinde en femte.** Denne metode beviser
ingen visuel finish (ombrydning af dansk tekst i en 98 px bred trin-kolonne er ikke set med
øjne), kun at CSS-reglerne selv er modsigelsesfri. Se Selv-review.

**Detektorkørsel.** `node <impeccable>/scripts/detect.mjs --json` kørt to gange: én gang
efter første udkast (56 fund), én gang efter oprydning (**52 fund, kørt til sidst**). De
52 er 51 advisories + 1 warning. Filtreret til kun de linjer, denne gren rent faktisk har
ændret (ikke hele filens støj fra fire andre agenters arbejde): **13 fund**, og alle 13 er
enten (a) værdier lånt fra et allerede eksisterende, dokumenteret trin i skalaen
(19 px = H3, 15 px = Lille, 13 px = Mikro, 10,5 px = skriftgulvet, 25 px = stribens eget
680px-trin), som detektorens ramme-check ikke genkender fordi `DESIGN.md`s frontmatter
kun navngiver seks typografiroller, eller (b) fredede, upåberørte linjer fra `.intetfoto`
og tabelhovedet, der faldt ind i mit ændrede område ved et redigeringsgreb men ikke er
ændret af mig. Fire reelle fund blev rettet undervejs: en kommentar der utilsigtet
indeholdt en bogstavelig `<img>`-streng (detektorens broken-image-advarsel), en 2 px
`border-radius` uden for formskalaen (ændret til 0 — se `DESIGN.md`s måleplade-afsnit for
begrundelsen), og to arbitrære skriftgrader (12,5 px og 26 px) snappet til allerede
etablerede trin (13 px, 25 px). Den ene tilbageværende `warning`
(`generator.css:184 side-tab`) er en fredet linje fra før dette arbejde, uden for mit
ansvarsområde.

## Selv-review

**Er det faktisk bedre, eller bare anderledes?** Jeg mener bedre, på et konkret,
efterprøvet punkt: siden gik fra 0 elementer i første viewport, der viser, hvad kataloget
faktisk indeholder, til én — vægtstigen — der er bygget udelukkende af de tal, projektet
allerede har indsamlet, uden at opfinde noget eller anbefale en robot. Det er den slags
"personlighed gennem præcision", `DESIGN.md`s eget ledemotiv beder om, anvendt på det
sted, siden manglede den mest.

Jeg er mindre sikker på measurepladen. Den løser det målte problem (46 identiske grå
kasser), men den introducerer en ny visuel enhed (kasser i en montre), og der er en reel
risiko for, at den læses som "endnu en pladsholder" af en læser, der ikke stopper op og
læser etiketten. Jeg har ikke kunnet teste det på et menneske — kun læst koden og målt
kontrasten. Det er den ærligste usikkerhed i denne leverance.

Jeg er også usikker på, om 4 kolonner i vægtstigens bånd er det rigtige antal frem for at
lade det være en almindelig liste — 4 er få nok til, at et gitter måske er overkill, men
listen skal stadig vise et talmæssigt forhold (12/12/13/9), som en vandret liste gør
tydeligere end en lodret. Jeg landede på gitteret, fordi det holder trinene på linje med
den bagvedliggende akse, men det er en afvejning, ikke et entydigt svar.

**Hvor meget forsvinder af sig selv, når billederne kommer?** En del af det oprindelige
problem — 46 identiske grå kasser — var altid midlertidigt: den forsvinder helt, den dag
`assets/fotos/` eller `assets/silhuetter/` fyldes. Måtte pladen derfor overhovedet bygges?
Jeg mener ja, af to grunde. For det første er billedrørledningen et andet spor, som denne
opgave eksplicit ikke skulle røre, og indtil den lander, er den tomme plade sidens
faktiske, offentlige tilstand — CEO'ens kritik gjaldt netop *den*, ikke en fremtidig
tilstand. For det andet forsvinder det generelle problem (rytme, hierarki, hero'ens
tomhed) **ikke** af sig selv, når billeder kommer: 46 fotos i et ensartet gitter uden en
figur i hero'en og uden luft mellem sektioner ville stadig være en monoton side, blot med
billeder i stedet for kasser. Typografiskalaen, sektionsluften og vægtstigen løser ægte
designgæld, der ikke er en funktion af manglende billeder.

Det jeg **ikke** har kunnet efterprøve: hvordan det faktisk ser ud i en browser. Der er
ingen headless-browser i værktøjskæden (projektets egen regel: nul afhængigheder), og jeg
har ikke haft adgang til at tage skærmbilleder. Al efterprøvning ovenfor er matematisk
(kontrastformel, breddregnestykker) eller strukturel (HTML-optælling, CSS-brudpunkts-
grænser). Det er samme metode, projektets egne `prototype/kontrast-*.mjs`-scripts bruger,
men det er ikke det samme som at have set siden.

## Ikke nået / sprunget over

- **Ingen visuel verificering i browser.** Se ovenfor — struktureret som en begrænsning i
  værktøjskæden, ikke som noget jeg valgte fra.
- **`DESIGN.md`s `components:`-YAML-blok** i frontmatteren er ikke udvidet med
  `stige-trin`/`maalplade`-poster. Det eksisterende slutnotat bekræfter kun, at
  farve/typografi/radius/spacing-tokens er krydstjekket mod `system.css`
  ("45 tokenfelter... 0 afvigelser") — der er ingen synlig mekanisk kontrol af
  `components:`-blokken, og at tilføje poster uden en kendt kontrakt virkede som at gætte
  på et format, en anden agent kan have en holdning til.
- **Ladder-etikettens ombrydning på dansk ved 420–679 px** ("Vægt ikke oplyst" i en ~98 px
  bred kolonne) er regnet igennem på papir, ikke set. `min-height:84px` på hvert trin bør
  give plads til 2–3 linjer, men det er en antagelse, ikke en måling.
- `tools/_tmp_maal.mjs` og de øvrige midlertidige diagnosescripts, brugt til at
  efterprøve måleplade-fordelingen (31/15 rå vs. 33/13 bygget) og kontrastparrene, er
  slettet efter brug — de var engangsværktøjer, ikke en del af leverancen.

## Ingen ændringer til de hårde begrænsninger

Ingen købsknap, intet affiliate-link, ingen prisforespørgsel er tilføjet. Ingen redaktionel
1-5-score. Ingen tredjepartskald, ingen cookies. Måleplade og vægtstige er begge rene
CSS/SVG-frie strukturer (`<span>`/`<div>` med `style`-attributter for positionering) og
kræver ikke JavaScript — hele stigen er navigerbar som almindelige links, og bygget blev
kørt og efterprøvet uden at aktivere JS i browseren (den findes slet ikke i
værktøjskæden). Ingen AI-genererede billeder af robotter eller mennesker er brugt eller
foreslået.
