---
name: Firbenede robotter (arbejdstitel — Å1 er ikke afgjort)
description: Et kildeangivet opslagsværk, hvor maskinen står frit på hvid plade og hullerne i vores viden har lige så meget form som tallene.
colors:
  bund: "#F2F3F5"
  panel: "#FFFFFF"
  panel-ro: "#F7F8FA"
  tom: "#EDEFF2"
  blaek: "#14161A"
  blaek2: "#4A515C"
  blaek3: "#5A626E"
  accent: "#0D5C86"
  accent-ro: "#E7F0F6"
  linje: "#E3E5E9"
  hegn: "#7C8695"
  fod: "#14161A"
  paafod: "#E6E9EE"
  paafod2: "#B9C0CA"
typography:
  display:
    fontFamily: "Manrope lokal, Manrope, Segoe UI Variable Text, system-ui, sans-serif"
    fontSize: "clamp(33px, 6.2vw, 76px)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Manrope lokal, Manrope, Segoe UI Variable Text, system-ui, sans-serif"
    fontSize: "clamp(27px, 3.6vw, 46px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Manrope lokal, Manrope, Segoe UI Variable Text, system-ui, sans-serif"
    fontSize: "clamp(23px, 2.8vw, 34px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.026em"
  body:
    fontFamily: "Manrope lokal, Manrope, Segoe UI Variable Text, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "-0.006em"
  label:
    fontFamily: "JetBrains Mono lokal, JetBrains Mono, Cascadia Mono, Consolas, monospace"
    fontSize: "11.5px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.15em"
  figur:
    fontFamily: "JetBrains Mono lokal, JetBrains Mono, Cascadia Mono, Consolas, monospace"
    fontSize: "29px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
    fontFeature: "tnum 1"
rounded:
  rund: "12px"
  rund-ind: "8px"
  rund-lille: "6px"
spacing:
  r1: "4px"
  r2: "8px"
  r3: "12px"
  r4: "16px"
  r5: "24px"
  r6: "32px"
  r7: "48px"
  r8: "64px"
  r9: "96px"
  kant: "clamp(16px, 3.4vw, 44px)"
components:
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.blaek}"
    rounded: "{rounded.rund}"
  kort:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.blaek}"
    rounded: "{rounded.rund}"
  videre:
    backgroundColor: "{colors.blaek}"
    textColor: "#FFFFFF"
    rounded: "{rounded.rund-ind}"
    padding: "0 18px"
    height: "46px"
  videre-hover:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
  videre-stille:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
    rounded: "{rounded.rund-ind}"
    padding: "0 16px"
    height: "46px"
  filter:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.blaek2}"
    rounded: "{rounded.rund-ind}"
    padding: "0 15px"
    height: "44px"
  filter-valgt:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
  sogefelt:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.blaek}"
    rounded: "{rounded.rund-ind}"
    padding: "12px 15px"
    height: "50px"
  vaerdi-tal:
    textColor: "{colors.blaek}"
    typography: "{typography.figur}"
  vaerdi-ikke:
    backgroundColor: "{colors.tom}"
    textColor: "{colors.blaek3}"
    rounded: "{rounded.rund-lille}"
    padding: "3px 9px 4px"
  maerke:
    backgroundColor: "{colors.panel-ro}"
    textColor: "{colors.blaek2}"
    rounded: "{rounded.rund-lille}"
    padding: "4px 10px 5px"
  billednote:
    backgroundColor: "{colors.fod}"
    textColor: "{colors.paafod}"
---

# Designsystem: Firbenede robotter

## Overblik

**Ledestjerne: "Udstillingssalen"**

Maskinen står frit på hvid plade, som en genstand i en montre. Fotografiet leder, og
grænsefladen træder tilbage bag det. Navnet ligger under billedet, aldrig hen over det —
et pålagt navnebånd dækkede i den forrige udgave 27,7 % af fotografiet og skar fødderne
af på 27 af 41 kort. Med navnet under billedet er tallet 0,0 %.

Stemningen er redaktionel stilhed. Systemet ligner en velsat opslagsbog snarere end en
produktside: typografien og hvidrummet bærer hierarkiet, kanter er hårfine, og der findes
kun én accentfarve. Ingen komponent tiltrækker opmærksomhed til sig selv. Personligheden
ligger i præcisionen — tabulære cifre, der flugter i kolonner, målte berøringsmål og
huller, der er formgivet lige så omhyggeligt som tallene.

Og hullerne er sagen. Halvdelen af nøgletallene mangler på en typisk robot, fordi
producenten ikke oplyser dem. Et katalog, der skjuler det, lyver. Derfor bliver cellen
stående med sit ikon og sin etiket, og kun figuren skiftes ud med et synligt hul — så
læseren lærer positionerne og kan se på tværs af robotter **hvad** der mangler, ikke bare
at noget mangler. Når en tom montre er lige så synlig som en fyldt, kan udstillingen
citeres.

Det gælder billedet lige så vel som tallet. Vi har ingen fotografier endnu — men vi har
mål, på 33 af de 46 robotter, og fra dem tegnes en **måleplade**: en kasse i fælles
målestok, der viser hvad vi ved om formen (længde og højde), uden at foregive at vide
resten. En tom, ensfarvet plade gentaget 46 gange var ikke et bevidst hul; det var en
fejlmeddelelse, der lignede en fejl. Se afsnittet *Måleplade* under Komponenter.

**Nøglekarakteristika:**

- Fire flader, ingen mørk tilstand: bund, panel, roligt indfelt, hul
- Én accentfarve, brugt til links, valgte filtre, kildemærker og oplyste ikoner
- Fotografiet fylder toppen af kortet; navnet står under det. Mangler fotografiet, men
  findes både længde og højde, tegnes en måleplade i stedet for en tom flade
- Fire datatilstande, der ikke deler skriftgrad, bogstavform, flade eller mærke
- Tal sættes i mono med tabulære cifre; sætninger sættes aldrig som tal
- 10,5 px er skriftgulvet i hele systemet, også i den smalleste ombrydning
- Ingen købsknap, ingen prisforespørgsel, ingen "featured" — formen findes ikke

## Farver

Paletten er næsten farveløs med vilje: fjorten toner, hvoraf tretten er grå eller sorte,
så den ene blå kan bære al betydning. Alle kontrastforhold nedenfor er målt 21. aug 2026
mod **begge** flader — hvidt panel og grå bund — fordi en tone, der kun er prøvet mod
hvid, falder, så snart den flyttes ud på sidens grund.

### Primær

- **Dyb havblå** (`#0D5C86`): links, valgte filtre, kildemærker, fokusring og ikoner i
  celler, der **er** oplyst. Målt 7,26 : hvid og 6,54 : bund. Hvid tekst på den giver
  7,26, hvilket gør den brugbar som fyldt knapflade.
- **Dyb havblå, rolig** (`#E7F0F6`): accentens hvilende flade. Et valgt filter i hvile,
  en EU-markering med et ja. Accenten på den giver 6,29.

### Neutral

- **Blæk** (`#14161A`): al primær tekst, overskrifter, tabelhovedets understregning og
  den eneste knapflade på sitet. 18,11 : hvid og 16,31 : bund.
- **Blæk 2** (`#4A515C`): brødtekst, feltnavne, sekundære etiketter. 8,01 og 7,21.
- **Blæk 3** (`#5A626E`): mikroskrift, versaletiketter, kildelisten, hullets ord.
  6,16 og 5,55. Den lyseste tone, systemet tillader til tekst.
- **Hegn** (`#7C8695`): **betydningsbærende** kant — stiplet hul, inputkant, ikon i en
  celle uden data. 3,68 : hvid, 3,32 : bund, 3,20 : hulfelt. Aldrig tekst.
- **Linje** (`#E3E5E9`): hårfin skillelinje. Rent dekorativ og bevidst under
  kontrastkravet, fordi den aldrig bærer betydning alene.
- **Bund** (`#F2F3F5`): sidens grund.
- **Panel** (`#FFFFFF`): den løftede flade — kort, striber, tabeller, båndet øverst.
- **Panel, roligt** (`#F7F8FA`): indfelt inde i et hvidt panel. Mærker, EU-markering,
  specifikationstæthed.
- **Tom** (`#EDEFF2`): fyldet bag "ikke oplyst". Systemets eneste flade, der betyder
  fravær.

### Mørk flade

- **Fod** (`#14161A`): billednoten øverst og sidefoden nederst.
- **På fod** (`#E6E9EE`): tekst på den mørke flade. 14,88.
- **På fod 2** (`#B9C0CA`): dæmpet tekst på den mørke flade. 9,88.

### Navngivne regler

**Reglen om de to flader.** Ingen tone godkendes på hvid alene. Hver eneste
tekstfarve måles mod både `panel` og `bund`, og hullets ord måles derudover mod `tom`.
CEO'ens forslag `#6B7280` blev målt til 4,35 mod bund og faldt på AA — `blaek3` er den
nærmeste tone, der klarer alle tre.

**Reglen om den ene stemme.** Der findes én accentfarve, og den betyder "her er noget
oplyst, og du kan gå videre herfra". Den bruges aldrig dekorativt, aldrig som
baggrundsstemning og aldrig til at gøre en overskrift pænere.

**Reglen om det farveløse hul.** Fravær har ingen farve. Et manglende tal er grå flade,
stiplet hegn og minuskler — aldrig rødt, aldrig gult, aldrig et advarselsikon. Rødt
læses som fejl, og at producenten ikke oplyser sin driftstid, er ikke en fejl.

## Typografi

**Displayskrift:** Manrope (lokal variabel woff2, med Segoe UI Variable Text og system-ui
som reserve)
**Brødskrift:** Manrope, samme fil
**Etiket- og talskrift:** JetBrains Mono (lokal variabel woff2, med Cascadia Mono og
Consolas som reserve)

**Karakter:** Ét sans-snit til alt, der læses som sprog, og ét mono-snit til alt, der
læses som data. Parret er ikke valgt for kontrastens skyld, men for at gøre en enkelt
skelnen synlig hele vejen igennem: mono betyder "det her er en måling". Manrope bærer den
stramme negative knibning uden at blive stiv; JetBrains Mono har ægte tabulære cifre, så
seks robotters vægte flugter lodret uden en tabel.

### Hierarki

Skalaen blev hævet 21. aug 2026 (designløftet). Den gamle gik 56 / 42 / 30 / 19 / 17 px og
lod forsiden flyde sammen: afstanden mellem hero og sektionshoved var kun 26 px, mellem
sektionshoved og kortnavn kun 8. Ved 1440 px er trinene nu 76 / 46 / 34 / 19 / 17 / 15 /
13 / 11,5 px — forhold 1,65, 1,35, 1,79, 1,12, 1,13, 1,15, 1,13 mellem naboled. Skriftgulvet
på 10,5 px er urørt af hævningen.

- **Hero** (800, `clamp(33px, 6.2vw, 76px)`, 0,98, −0,035em): forsidens ene overskrift.
  Optræder én gang pr. side.
- **H1** (700, `clamp(27px, 3.6vw, 46px)`, 1,08, −0,03em): sidens titel, robottens navn
  på detaljesiden.
- **H2** (700, `clamp(23px, 2.8vw, 34px)`, 1,08, −0,026em): sektionshoveder.
- **H3** (700, 19px, −0,014em): gruppeoverskrift inde i et panel.
- **Brød** (400, 17px, 1,6, `blaek2`): løbende tekst. Sættes i højst 68ch.
- **Lille** (400, 15px, 1,55, `blaek2`): sekundær forklaring, feltnoter.
- **Mikro** (400, 13px, 1,5, `blaek3`): kortets fodnote, kildelisten.
- **Etiket** (mono, 500, 11,5px, +0,15em, versaler, `blaek3`): navngiver en datagruppe
  eller en enhed.
- **Figur** (mono, 700, 29px i striben / 25px ved 680px / 20px kompakt, tabulære cifre):
  selve tallet.

**Sektionshovedets etiket** (21. aug 2026) fik sin egen linje over overskriften i stedet
for at dele dens grundlinje: `.sektion-hoved > .etiket{flex:1 0 100%}`. En etiket, der
deler linje med det, den navngiver, læses som en del af overskriften i stedet for som en
selvstændig etiket over den — samme fejl, reglen om versaletiketten i forvejen advarer
imod, bare i layoutet i stedet for i indholdet.

### Navngivne regler

**Reglen om versaletiketten.** Den spatierede versaletiket må kun navngive en datagruppe
eller en enhed. Den må **aldrig** stå som indholdstom optakt over en overskrift — ikke
"BYGGET TIL FREMTIDEN", ikke "VORES KATALOG". Det er inspirationskildens mest kopierede
manér og systemets tydeligste anti-reference.

**Reglen om mono.** Mono og fed hører til tal. En sætning sat i mono læses som et tal.
Tekstværdier — beregningsplatform, monteringsinterface — sættes derfor i brødskrift med
vægt 500, ikke i mono.

**Skriftgulvet.** 10,5 px er den mindste skriftgrad i systemet, og gulvet holdes også i
den smalleste ombrydning. Under det bliver en spatieret versaletiket ulæselig på en
telefon. Ved 420 px reduceres spatieringen i stedet for skriftgraden.

## Layout

Sidens indhold ligger i `.rum`: højst 1440 px bredt, centreret, med `clamp(16px, 3.4vw,
44px)` ydre luft. Brødtekst begrænses yderligere til 68ch, forklarende afsnit til 86ch og
kortets fodnote til 96ch.

Rummet måles i en ottetalsskala med ni trin: 4, 8, 12, 16, 24, 32, 48, 64 og 96 px.
Skalaen er komplet — nye afstande hentes fra den, ikke opfundet ved siden af.

Katalogets gitter er `repeat(auto-fill, minmax(310px, 1fr))` med 32 px lodret og 24 px
vandret mellemrum (`--r6`/`--r5` — hævet fra 26/22 px 21. aug 2026, som stod uden for
ottetalsskalaen). Under 679 px falder det til én spalte.

**Brudpunkter** (systemet har fire, alle max-width): 1180 px, hvor nøgletalsstriben går
fra seks til tre spalter, og hvor hero'ens to spalter (ord/vægtstige) falder til én under
1181 px · 680 px, hvor striben går til to, og hvor hero-ledens skrift falder fra 19 til
17 px · 679 px, hvor gitteret bliver enkeltspaltet · 420 px, hvor det kompakte kort går
til to spalter, ikonerne krymper, og vægtstigens fire trin går til to.

Striben er systemets vanskeligste layout, fordi omkring halvdelen af dens celler er tomme
på en typisk robot. Cellerne beholder deres rækkefølge gennem alle brudpunkter, så
positionen bliver noget, læseren kan lære. Forsidens vægtstige arver samme disciplin: dens
fjerde trin (vægt ikke oplyst) skifter aldrig plads med de tre andre.

Mellem sektionerne på forsiden er luften hævet til 96 px (`--r9`), med 48 px (`--r7`) til
den første sektion, som ligger tættere på hero'en, der selv har bundluft. 32 px mellem fire
ensartede afsnit i træk var for lidt til at læses som adskilte grupper.

## Dybde

Systemet er fladt i hvile. Der er to skygger, begge med både forskydning og blød sløring
og begge i blækkets egen tone — aldrig en farvet glorie. Panelet bærer den lette skygge
konstant som en bekræftelse af, at det ligger oven på bunden; kortet løfter til den tunge
kun ved hover eller `:focus-within`.

Hullet løftes aldrig. Hverken "ikke oplyst"-værdien, den tomme plade eller den nulstillede
stribe har skygge, og ingen af dem reagerer på hover. De er ikke en tilstand, der kan
forbedres ved at pege på dem.

### Skyggeordforråd

- **Båret** (`0 1px 2px rgba(20,22,26,.045), 0 10px 28px -18px rgba(20,22,26,.20)`):
  panel, kort, stribe, tabelramme i hvile.
- **Løftet** (`0 2px 4px rgba(20,22,26,.055), 0 18px 40px -20px rgba(20,22,26,.26)`):
  kun kortet, kun ved hover eller fokus.

### Navngivne regler

**Reglen om fladt i hvile.** Overflader er flade som udgangspunkt. Skygge optræder kun
som svar på en tilstand. Et element, der løfter sig uden at brugeren har gjort noget,
påstår en betydning, det ikke har.

**Reglen om det ubevægelige hul.** Den ene tilladte bevægelse i systemet er fotografiets
`scale(1.024)` ved hover. Hullerne rører sig ikke. Under `prefers-reduced-motion` falder
også fotografiets bevægelse bort.

## Former

Tre radier, og de betyder tre forskellige niveauer: 12 px til panelet, 8 px til et indfelt
inde i et panel, 6 px til en chip, et mærke eller et hul. Et element vælger sin radius
efter, hvor dybt det ligger, ikke efter hvor stort det er.

Kanten er systemets vigtigste formsprog, fordi den bærer betydning:

- **Fuldt optrukket, `linje`**: dekorativ skillelinje. Deler, uden at sige noget.
- **Fuldt optrukket, `hegn`**: en kant, læseren skal kunne se — inputfeltets ramme.
- **Stiplet, `hegn`**: fravær. Hullet, den tomme plade, det udgåede statusmærke, den
  midlertidige titel i båndet, sekundære kildemærker.
- **2 px fuldt optrukket, `blaek`**: tabelhovedets underkant. Den eneste kraftige linje.

Firkanten på 9 × 9 px er systemets signatur og optræder som mærke i fire varianter, der
kan skelnes uden farve: **udfyldt** (nej), **åben med fyldt kerne** (ja), **stiplet**
(ikke oplyst) og **halvt fyldt diagonalt** (kun vist på billede).

## Komponenter

### Hero'en og vægtstigen

Tilføjet 21. aug 2026. Hero'en var ren tekst på en hvid flade lige under det hvide bånd —
to hvide flader adskilt af én hårfin linje læses som ét bånd, ikke som en åbning. Den
ligger nu på sidens grå bund, og det hvide panel i den er vægtstigen: den eneste figur,
forsiden har.

- **Fladen:** `.hero` har ingen egen baggrund og arver `--bund`. Overskrift og lede
  (`.hero-ord`) ligger direkte på bunden; kun vægtstigen er et hvidt panel.
- **Vægtstigen** er ét maerke pr. robot med oplyst egenvægt, sat på en akse fra 0 til
  næste hele 20-kg-trin over den tungeste robot, med de to klassegrænser (20/40 kg) som
  korte tværstreger. Under aksen står de fire vægtklasser som **links** ned i deres egen
  sektion — stigen er dermed også sidens indholdsfortegnelse, og den virker uden
  JavaScript.
- **Ingen robot er navngivet.** Hverken maerket på aksen eller et trin fører til én
  bestemt maskine — det ville være en fremhævelse, og siden har ingen metode at
  anbefale efter (samme regel som forbyder én robot i selve hero'en).
- **Det fjerde trin** (vægt ikke oplyst) ligger uden for aksen, i hullets eget sprog:
  stiplet `hegn`-kant, `tom`-flade, dæmpet tekst. De robotter, der ikke kan placeres, bliver
  hverken gemt eller lagt i en klasse, de ikke hører til.
- **Layout:** to spalter (ord / stige) over 1180 px, stablet derunder. Aksestrimlen og
  dens tal er `aria-hidden` og forsvinder under 679 px — de fire trin bærer den samme
  oplysning i tal, aksen er kun en visualisering af den.

### Knapper

Systemet har **én** knapform, og den er navigation inde på sitet.

- **Form:** 8 px radius (`rund-ind`), mindst 46 px høj
- **Primær:** blækflade, hvid tekst, 18 px vandret luft, 15 px halvfed
- **Hover:** fladen skifter til dyb havblå. Ingen bevægelse, ingen skygge
- **Stille variant:** ingen flade, accentfarvet tekst, `hegn`-kant. Hover fylder med
  `accent-ro`
- **Fokus:** 3 px accentfarvet ring, 3 px forskudt — samme ring i hele systemet

**Der findes ingen købsknap, ingen demoknap og ingen prisforespørgsel.** Formen er ikke
fravalgt i skabelonerne; den er ikke defineret i systemet.

### Filtre og chips

- **Form:** 8 px radius, mindst 44 px høj, hårfin `linje`-kant på hvid flade
- **Hvile:** `blaek2`-tekst med et monospor antal i `blaek3`
- **Hover:** kanten skifter til `hegn`, teksten til fuld blæk
- **Valgt:** accentfyldt flade, hvid tekst, antallet i `accent-ro`
- **Tilstanden nås på tre måder** — `:checked`, `:target` og `aria-current` — så et
  filterlink fra forsiden også *ses* som valgt uden en linje JavaScript
- Selve afkrydsningsfeltet er skjult, men fokuserbart; fokusringen tegnes på etiketten

### Kort

Kortets orden er fast: **fotografi · ophav · navn · mærker · stribe · fodnote.**

- **Form:** 12 px radius, hårfin `linje`-kant, båret skygge, `overflow: hidden`
- **Billedled:** 16:10, hvid flade, underkant. Varianten `--plade` bruger `contain` med
  6–7 % luft til maskiner fotograferet fri på hvid og til de måltro silhuetter
- **Navn:** 22 px, −0,026em, **under** billedet. Navnets `::after` dækker hele kortet, så
  kortet er ét klikmål
- **Hover:** kanten lysner til `#CFD4DB`, skyggen løfter, fotografiet skalerer 1,024
- **Fodnote:** monospor 11 px øverst adskilt af en linje. Her står billedets sandhed — og
  kun den. Ingen pris, ingen knap. **Kortet har ingen dør ud af sitet**

### Måleplade

Tilføjet 21. aug 2026. Målt i `dist/da/index.html` før ændringen: 46 kort, 46 tomme
plader, ingen billedelementer — og sætningen "Vi har ikke selv fotograferet modellen" stod
92 gange, dobbelt op på hvert kort. Et gitter af 46 identiske grå kasser med stiplet kant
er ikke et gennemtænkt hul; det er den samme fejlmeddelelse gentaget 46 gange.

Løsningen er ikke et foto og ikke `assets/silhuetter/`s måltro tegninger (Å3, stadig ikke
besluttet) — det er en **kasse**, tegnet af de mål, vi allerede har kilde på.

- **Hvornår:** kun når robotten oplyser **både** længde og højde (31 af 46, plus 2 hvor
  højden er et interval). Mangler en af de to, vises den gamle `.intetfoto` uændret — 13
  robotter, ned fra 46.
- **Fælles målestok:** billedfeltets bredde svarer til 1900 mm på **alle** kort, uanset
  hvilken robot. To plader kan derfor sammenlignes med øjet. Det er samme princip, som
  `assets/silhuetter/LÆSMIG.md` selv beskriver: seks pressefotos, hver i sin egen vinkel og
  brændvidde, fortæller intet om størrelse; seks figurer i fælles målestok gør.
- **Kassen, ikke maskinen.** Omridset er et rektangel med et skarpt hjørne (ingen radius —
  formskalaen 12/8/6 px hører til komponenter, og en målt kasse er en tegning, ikke en
  komponent). Vi kender længden og højden; vi kender ikke formen, og vi gætter den ikke.
  Fyldet er `panel` (hvid), kanten `hegn` 1,5 px.
- **Nettet og gulvet:** et lodret gitter i `linje` (dekorativt, ét stip pr. 250 mm) og en
  vandret gulvlinje i `hegn` (betydningsbærende — den definerer "stående på gulvet"), så
  kassen læses som en genstand i et rum og ikke som et flydende rektangel.
- **Etiketten** navngiver de to mål ("LÆNGDE × HØJDE") i titelfeltet under gulvet, som på
  et tegningsark — samme regel som versaletiketten andre steder: den navngiver en
  datagruppe, den er ikke en indholdstom optakt.
- **Skærmlæseren** får den fulde sætning med tal og enhed, præcis som skrevet i kilden
  (`<span class="kunskaerm">`); den visuelle kasse er selv `aria-hidden`.
- **Fladen er stadig hullets** (`--tom`). Fotografiet mangler stadig — det, der er
  skiftet, er, at hullet nu har noget at vise frem. Pladen løfter sig ikke, skalerer ikke
  og reagerer ikke på hover, som reglen om det ubevægelige hul kræver.

### Felter

- **Form:** 8 px radius, `hegn`-kant, hvid flade, mindst 50 px høj, 16,5 px skrift
- **Pladsholder:** `blaek3` ved fuld opacitet
- **Fokus:** kanten skifter til accent, og fokusringen tegnes 1 px forskudt
- Søgefeltet er skjult, indtil JavaScript tænder det. Et felt, der intet gør, er en
  betjeningsflade uden funktion. Filtrene er der uanset

### Navigation

Båndet øverst er et hvidt panel med en underkant, mindst 60 px højt. Navnet står til
venstre med et **stiplet, midlertidigt mærke** under sig, fordi sidens navn ikke er
afgjort. Der er intet logo og intet ordmærke. Links er 15 px halvfede med mindst 44 px
berøringsmål; hover giver en rolig flade, og den aktuelle side markeres med accentfarve på
`accent-ro`.

### De fire datatilstande

Systemets kerne. **"Ikke oplyst", "nej", "0" og "kun vist på billede" er fire forskellige
ting**, og de deler hverken skriftgrad, bogstavform, flade eller mærke.

- **Tal:** eneste tilstand med stor, fed, mørk figur. Operatoren står foran i 0,72 em og
  dæmpet vægt, enheden bagefter i 0,56 em. `> 40 kg` er ikke det samme som `40 kg`
- **Nul:** sættes **præcis** som ethvert andet tal. Ingen dæmpning, ingen stiplet kant.
  Nul er en oplysning, producenten har givet
- **Nej:** et svar. Versaler, 0,62 em, spatieret 0,13em, fuld blæk, udfyldt firkant
- **Ja:** samme vægt som nej, åben firkant med fyldt kerne
- **Ikke oplyst:** et hul. Minuskler, 0,46 em, `blaek3` på `tom`, stiplet `hegn`-kant
- **Kun vist på billede:** kursiveret ord, halvt fyldt firkant, **ingen** dæmpet flade —
  oplysningen findes, den står bare ikke skrevet

### Kildemærket

Et hævet **bogstav** efter værdien, i accentfarve, 0,34 em, der peger på kildelisten
nedenfor. Bogstav og ikke tal, så det aldrig kan læses som en del af figuren.

Bogstavet er cirka 6 × 8 px, men bærer et usynligt `::before` på 24 × 24 px centreret om
sig, så WCAG 2.5.8 holdes uden at bogstavet vokser. På kortet løftes det til `z-index: 2`,
så navnets kortdækkende `::after` ikke stjæler klikket.

**Sekundær kilde** — producentens eget domæne, men ikke produktsiden — markeres med
stiplet hegn i `blaek3`, samme sprog som hullet.

### Nøgletalsstriben

Seks celler i et panel, hver med ikon, figur og etiket. `column-reverse` sætter figuren
øverst visuelt, mens DOM-rækkefølgen bliver etiket før værdi — den rækkefølge, en
skærmlæser skal have dem i.

Ikonets to tilstande bærer den samme oplysning som figuren: accent når cellen er oplyst,
`hegn` når den er tom. Når **ingen** af de seks er oplyst, ville seks huller være støj;
da erstattes hele striben af ét udsagn på hullets egen flade, og udsagnet siger hvorfor.

### Billednoten

En mørk stribe øverst på hver side, der bærer spærring S1: siden må ikke publiceres med
fabrikantbilleder uden skriftlig tilladelse. Den er **mørk, ikke rød**. Rødt læses som
fejl eller som salg; det her er en redaktionel oplysning, der skal ses hver gang og aldrig
kunne overses.

## Gør og lad være

### Gør

- **Gør** hullet lige så formgivet som tallet. Cellen bliver stående med ikon og etiket;
  kun figuren skiftes ud.
- **Gør** hver ny tone målt mod både `panel` og `bund`, og mod `tom` hvis den skal stå i
  et hul. Skriv målingen ind i kilden, som de fjorten eksisterende toner har den.
- **Gør** tal i mono med tabulære cifre, og bevar operatoren: `> 40 kg` og `20~25 cm` er
  værdier, ikke tal der skal renses.
- **Gør** versaletiketten funktionel. Den navngiver en datagruppe eller en enhed.
- **Gør** designændringer i `assets/*.css` og `tools/skabelon/*.mjs`. `dist/` er
  genereret og overskrives ved næste byg.
- **Gør** rummet fra ottetalsskalaen og radius efter dybde: 12 px panel, 8 px indfelt,
  6 px chip.
- **Gør** hver betjeningsflade brugbar uden JavaScript, eller skjul den til JS tænder den.

### Lad være

- **Lad være** med at give fravær farve. Ikke rødt, ikke gult, intet advarselsikon. At en
  producent ikke oplyser et tal, er ikke en fejl.
- **Lad være** med at sætte nul som et hul. Nul er et tal og sættes som ethvert andet.
- **Lad være** med at lægge navnet hen over fotografiet. Det er målt: 27,7 % afdækning og
  fødder skåret af på 27 af 41 kort.
- **Lad være** med at bruge versaletiketten som indholdstom optakt over en overskrift.
- **Lad være** med at indføre en knapform, der fører ud af sitet. Ingen købsknap, intet
  affiliate-link, ingen prisforespørgsel — heller ikke som "kontakt producenten".
- **Lad være** med at løfte, animere eller fremhæve et hul.
- **Lad være** med at sætte en sætning i mono. Mono betyder måling.
- **Lad være** med at gå under 10,5 px, heller ikke i den smalleste ombrydning. Reducér
  spatiering i stedet.
- **Lad være** med at bruge `assets/stil.css` eller `assets/sider.css`. De definerer
  `--blaek`, `--bund` og `--linje` med **andre** værdier end `system.css` og indgår ikke i
  bygget. Se noten nedenfor.
- **Lad være** med at tilføje en mørk tilstand uden at måle alle fjorten toner om.
  `system.css` har ingen, og den forladte `stil.css` har en, der ikke er efterprøvet.

---

**Note om to forældede filer.** `assets/stil.css` (14 tokens, med mørk tilstand) og
`assets/sider.css` er rester fra en tidligere runde. Bygget sender kun `system.css` og
`generator.css`; de to andre nævnes udelukkende i en forladt testmappe. De er farlige,
fordi de genbruger tokennavne med andre værdier — bliver en af dem hentet ind på en side,
skifter farverne uden en fejlmeddelelse.

*Skrevet 21. aug 2026 ud fra `assets/system.css` (547 linjer, 34 tokens) og
`assets/generator.css` (136 linjer). 16 kontrastpar genmålt: 0 under kravet, og alle 16
matcher de værdier, kommentarerne i kilden allerede påstod. 45 tokenfelter i denne fils
frontmatter krydstjekket mod `system.css`: 0 afvigelser.*

**Opdateret 21. aug 2026 (designløftet).** `assets/system.css` er nu 621 linjer,
`assets/generator.css` 243. Ændringen: forsidens hero fik en vægtstige (ny komponent), den
tomme plade fik en måleplade for de 33 robotter, der oplyser både længde og højde,
typografiskalaen for hero/H1/H2 blev hævet, gitterets mellemrum og sektionsluften flyttet
ind på ottetalsskalaen. 13 kontrastpar målt for de nye eller genanvendte flader — heraf 9
en efterprøvning af tal, DESIGN.md eller kildens kommentarer allerede påstod (alle 9
stemte: `blaek3`:`panel` 6,16 · `blaek3`:`bund` 5,55 · `hegn`:`tom` 3,20 · `hegn`:`panel`
3,68 · `hegn`:`bund` 3,32 · `blaek`:`panel` 18,11 · `blaek`:`bund` 16,31 · `blaek2`:`panel`
8,01 · `blaek2`:`bund` 7,21), og 4 reelt nye par uden noget tidligere tal at holde op imod
(`blaek3`:`tom` 5,35 · `hegn`:`accent-ro` 3,19 · `blaek`:`accent-ro` 15,69 · `linje`:`tom`
1,09, sidstnævnte dekorativ og uden krav). 0 af de 13 faldt under deres krav. Fire brudpunkter
efterprøvet ved CSS-sporing (ingen browser i værktøjskæden — samme metode, projektets
egne målescripts allerede bruger): 1180, 680, 679 og 420 px, alle uden overlap eller
mellemrum mellem forsidens nye regler og systemets eksisterende.

**Opdateret 24. aug 2026 (kataloghærdning, `fund/FUND-kort.md`).** Fire målte problemer på
kortgitteret rettet, alle efterprøvet med Playwright over alle 46 kort ved 1440 og 360 px:

- **Klippede etiketter (0 → verificeret 0).** Den kompakte nøgletalsstribe gik fra tre til
  to spalter ved alle bredder (var kun to under 420 px) — ved tre spalter var cellen for
  smal til "NYTTELAST"/"DRIFTSTID" (284 klip/naboklip målt ved 1440 px). Samtidig lå der en
  skjult fejl: `.stribe .v`/`.stribe--kompakt .v`/`.raekke .v`/`td .v` satte figurens
  skriftstørrelse direkte på `.v` med to-klasses specificitet, som *altid* slog
  `.v-ikke`/`.v-billede` (,46em) og `.v-nej`/`.v-ja` (,62em, kun én klasse) — "ikke oplyst"
  stod derfor fladt i tallets egen størrelse (20 px i et kort, ikke de tilsigtede ~9 px),
  hvilket både brød reglen om at tilstande aldrig deler skriftgrad med tal og bidrog til
  klipningen. Rettet med tilsvarende to-klasses regler pr. kontekst, alle over 10,5 px-gulvet.
- **Advarsel-støj (174 synlige ord → 0).** 174 af 181 forbeholdschips på forsiden viste
  ordet "Advarsel" på 41 af 46 kort. Den korte tekst fra 21. aug er *ikke* rullet tilbage —
  den ligger stadig fuldt ud i `title` og i en skærmlæsertekst — men den altid-synlige
  ordchip er skiftet til et lille hævet tegn ("*"), i samme typografiske familie som
  kildemærkets hævede bogstav. Ny komponent: `.forbehold--tegn`.
- **Måltro-pladen** fik et titelfelt: etiketten ("LÆNGDE × HØJDE") står nu sammen med
  producentens egne tal (fx "610 mm × 406 mm"), adskilt af en hårfin linje og en
  `--panel-ro`-flade som eget lag — ikke en skygge, så reglen om det ubevægelige hul står
  ved magt. To små målestreger hænger ned fra kassens egne bund-hjørner.
- **Kortets fodnote** samlet fra en stak af 2-3 monospor-linjer til ét løbende afsnit
  (`<span class="led">` pr. oplysning). Intet ord, kildetal eller forbehold er fjernet.

Sidehøjde på `/da/`-forsiden ved 1440 px: 12625 → 11954 px. Ingen af rettelserne rørte
`.v-tal`, `.v-nul`, `.v-nej`, `.v-ja`s farve- eller formsprog, og de fire datatilstande
forbliver adskilt efter reglen ovenfor.

Samtidig rettet (indhold, ikke system): `billednote_tekst` i `data/i18n/da.json` og
`en.json` påstod "ingen billeder fra producenterne" — usandt siden b22da4f koblede 32
producentfotos på. Ny tekst følger S1/L26 i STATUS.md uændret; komponentbeskrivelsen
ovenfor krævede ingen rettelse, den påstod aldrig noget om billedernes antal.
