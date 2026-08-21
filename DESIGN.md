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
    fontSize: "clamp(31px, 4.6vw, 56px)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.032em"
  headline:
    fontFamily: "Manrope lokal, Manrope, Segoe UI Variable Text, system-ui, sans-serif"
    fontSize: "clamp(27px, 3.4vw, 42px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.028em"
  title:
    fontFamily: "Manrope lokal, Manrope, Segoe UI Variable Text, system-ui, sans-serif"
    fontSize: "clamp(22px, 2.4vw, 30px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.024em"
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

**Nøglekarakteristika:**

- Fire flader, ingen mørk tilstand: bund, panel, roligt indfelt, hul
- Én accentfarve, brugt til links, valgte filtre, kildemærker og oplyste ikoner
- Fotografiet fylder toppen af kortet; navnet står under det
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

- **Hero** (800, `clamp(31px, 4.6vw, 56px)`, 1,02, −0,032em): forsidens ene overskrift.
  Optræder én gang pr. side.
- **H1** (700, `clamp(27px, 3.4vw, 42px)`, 1,08, −0,028em): sidens titel, robottens navn
  på detaljesiden.
- **H2** (700, `clamp(22px, 2.4vw, 30px)`, 1,08, −0,024em): sektionshoveder.
- **H3** (700, 19px, −0,014em): gruppeoverskrift inde i et panel.
- **Brød** (400, 17px, 1,6, `blaek2`): løbende tekst. Sættes i højst 68ch.
- **Lille** (400, 15px, 1,55, `blaek2`): sekundær forklaring, feltnoter.
- **Mikro** (400, 13px, 1,5, `blaek3`): kortets fodnote, kildelisten.
- **Etiket** (mono, 500, 11,5px, +0,15em, versaler, `blaek3`): navngiver en datagruppe
  eller en enhed.
- **Figur** (mono, 700, 29px i striben / 20px kompakt, tabulære cifre): selve tallet.

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

Katalogets gitter er `repeat(auto-fill, minmax(310px, 1fr))` med 26 px lodret og 22 px
vandret mellemrum. Under 679 px falder det til én spalte.

**Brudpunkter** (systemet har fire, alle max-width): 1180 px, hvor nøgletalsstriben går
fra seks til tre spalter · 680 px, hvor den går til to · 679 px, hvor gitteret bliver
enkeltspaltet · 420 px, hvor det kompakte kort går til to spalter og ikonerne krymper.

Striben er systemets vanskeligste layout, fordi omkring halvdelen af dens celler er tomme
på en typisk robot. Cellerne beholder deres rækkefølge gennem alle brudpunkter, så
positionen bliver noget, læseren kan lære.

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
