---
name: Firbenede robotter (arbejdstitel — Å1 er ikke afgjort)
description: Et kildeangivet opslagsværk over verdens firbenede robotter, hvor hullerne i vores viden er lige så formgivet som tallene.
colors:
  bund: "#E8EBED"
  panel: "#FAFBFB"
  panel-ro: "#E8EBED"
  tom: "#E8EBED"
  blaek: "#22262A"
  blaek2: "#545C63"
  blaek3: "#5F686F"
  stoev-blaek: "#5F686F"
  accent: "#F2C400"
  accent-ro: "#E8EBED"
  linje: "#C6CCD1"
  hegn: "#9AA3A9"
  fod: "#22262A"
  paafod: "#E8EBED"
  paafod2: "#9AA3A9"
  stans: "#FFFFFF"
typography:
  display:
    fontFamily: "Manrope lokal, Manrope, Segoe UI Variable Text, Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(33px, 6.2vw, 76px)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Manrope lokal, Manrope, Segoe UI Variable Text, Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(27px, 3.6vw, 46px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Manrope lokal, Manrope, Segoe UI Variable Text, Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(23px, 2.8vw, 34px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.026em"
  body:
    fontFamily: "Manrope lokal, Manrope, Segoe UI Variable Text, Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "-0.006em"
  label:
    fontFamily: "SairaSemiCondensed, ui-sans-serif, system-ui, -apple-system, Segoe UI Variable Text, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "11.5px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.15em"
  figur:
    fontFamily: "SairaSemiCondensed, ui-sans-serif, system-ui, -apple-system, Segoe UI Variable Text, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontWeight: 700
    fontFeature: "tnum 1"
  manual:
    fontFamily: "Literata, Georgia, Times New Roman, serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.62
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
  maal: "68ch"
components:
  panel:
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
  nulstil:
    backgroundColor: "transparent"
    textColor: "{colors.blaek2}"
    rounded: "{rounded.rund-ind}"
    height: "44px"
  filter:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.blaek2}"
    rounded: "{rounded.rund-ind}"
    padding: "0 14px"
    height: "44px"
  filter-valgt:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
  sogefelt:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.blaek}"
    rounded: "{rounded.rund-ind}"
    padding: "9px 14px"
    height: "44px"
  vaerdi-tal:
    textColor: "{colors.blaek}"
    typography: "{typography.figur}"
  vaerdi-ikke:
    backgroundColor: "{colors.tom}"
    textColor: "{colors.blaek3}"
    rounded: "2px"
    padding: "1px 5px"
  maerke:
    backgroundColor: "{colors.panel-ro}"
    textColor: "{colors.blaek2}"
    rounded: "{rounded.rund-lille}"
  billednote:
    backgroundColor: "{colors.fod}"
    textColor: "{colors.paafod}"
---

# Designsystem: Firbenede robotter

## Overblik

**Ledestjerne: "Den eloxerede plade"**

Systemet hedder i koden **TYPESKILT** (`spor/fundament`, 31. aug 2026, L54/L57) og
afløste et lysere, blødere system ved navn ORBIT. Metaforen er en eloxeret
metalplade med stansede felter — ikke ORBIT-lysets bløde papirpanel. Layouttesen,
skrevet i kildens egne kommentarer: **"Ingen slagskygge findes på siden"** —
materiale, ikke skeuomorft teater. Begge systemets skyggetokens (`--skygge`,
`--skygge-loeft`) er sat til `none`; se *Dybde* nedenfor.

Kataloget er i dag sprogroden. Forsiden med hero, yderpunkter og EU-fundet, som
tidligere udgave af denne fil beskrev udførligt, **er slettet** (L72, 1. sep
2026, `spor/oversigt`) — `dist/da/index.html` er nu selve katalogsiden (86 kort,
0 forekomster af ordet "hero"). De komponentbeskrivelser hører historien til, se
noten i bunden af *Komponenter*.

Redaktionel stilhed er stadig princippet: én accentfarve, hårfine kanter,
firkantede stansede felter frem for runde bløde flader. Personligheden ligger i
præcisionen — tabulære cifre der flugter i kolonner, og huller der er formgivet
lige så omhyggeligt som tallene. Halvdelen af nøgletallene mangler på en typisk
robot, fordi producenten ikke oplyser dem; cellen bliver stående med sit ikon og
sin etiket, og kun figuren skiftes ud med et synligt hul (hård begrænsning 5).

**Migrationen er i gang, ikke færdig.** `system.css`s egne kommentarer siger det
selv: paletten og topbaren (dækket) er lagt om til TYPESKILT; overskrifter og
brødtekst venter på det, kildens kommentarer kalder **"runde 2"**. Det betyder,
at store dele af sidens tekst i dag rammes af den GAMLE skriftfamilie, som ikke
længere er selvhostet. Se *Typografi* og `## Konflikter` nedenfor — det er den
femte, ikke-brief-listede konflikt, dette spor fandt.

**Nøglekarakteristika:**

- Ét ord for systemet i koden: **eloxeret plade**, stansede felter, ingen skygge
- Fire flader, ingen mørk tilstand i selve sitet: bund, panel, roligt indfelt, hul
  — men fem forskellige tokennavne deler i dag værdien `#E8EBED`, se *Farver*
- Fire datatilstande, der ikke deler skriftgrad, bogstavform, flade eller mærke
  (uændret fra ORBIT — TYPESKILT rørte paletten, ikke denne regel)
- Tal sættes i mono med tabulære cifre; sætninger sættes aldrig som tal
- 10,5 px er skriftgulvet i hele systemet
- Ingen købsknap, ingen prisforespørgsel, ingen "featured" — formen findes ikke

## Farver

Paletten er næsten farveløs med vilje: seksten poletter i `:root`, hvoraf tretten
peger på gråtoner eller sort og én bærer al farve (`--accent`, afmærkningsgul).
**Kontrastforholdene nedenfor er genmålt af dette spor** med WCAG's egen
relativitetsformel (ikke kopieret fra den forrige udgave af filen, som beskrev en
anden palet) — og krydstjekket mod de tal, kildens egne kommentarer allerede
angiver (fx `blaek`:`bund` 12,72, `accent` som baggrund for `blaek`-tekst 9,19):
alle stemte.

### Primær

- **Afmærkningsgul** (`#F2C400`): links, valgte filtre, kildemærker, fokusring
  og `.videre--stille`-knappens tekst. **Kun sikker som BAGGRUND**, med mørk
  tekst ovenpå (`blaek` på `accent` = 9,19 : 1). **Som forgrund er den ikke
  sikker** — se konfliktafsnittet; det er samme fund som L70 i CLAUDE.md,
  genmålt uafhængigt her.
- **Afmærkningsgul, rolig** (`--accent-ro`): peger i koden på samme værdi som
  `--bund` (`#E8EBED`) — se *Farvedubletter* i `## Konflikter`.

### Neutral

- **Gunmetal** (`--blaek`, `#22262A`): al primær tekst, overskrifter, den eneste
  knapflade. 14,69 : panel, 12,72 : bund.
- **Blæk 2** (`--blaek2`, `#545C63`): brødtekst, feltnavne. 6,56 : panel,
  5,68 : bund.
- **Støv-blæk** (`--blaek3` og `--stoev-blaek`, samme værdi `#5F686F`): mikroskrift,
  "ikke oplyst"-teksten. 5,48 : panel, 4,74 : bund — den lyseste tone, systemet
  tillader til tekst.
- **Støvgrå** (`--hegn` og `--paafod2`, samme værdi `#9AA3A9`): **betydningsbærende**
  kant — inputkant, stiplet hul-markør, focus-nabolag. 2,47 : panel, 2,14 : bund.
  **Under WCAG 1.4.11's 3:1-krav til meningsbærende ikke-tekst** på begge flader
  — se konfliktafsnittet.
- **Rille** (`--linje`, `#C6CCD1`): hårfin skillelinje. Rent dekorativ, 1,56 : panel,
  1,35 : bund — bevidst under kontrastkravet, fordi den aldrig bærer betydning alene.
- **Eloxgrå** (`--bund`, `--panel-ro`, `--tom`, `--accent-ro`, `--paafod`, alle
  `#E8EBED`): pladen selv, roligt indfelt, fyldet bag "ikke oplyst", lys tekst
  på mørk flade. Fem navne, én værdi — se *Farvedubletter*.
- **Kridt** (`--panel`, `#FAFBFB`): den løftede flade — kort, striber, tabeller.
- **Lyskant** (`--stans`, `#FFFFFF`): 1px indfældet lyskant i en stansning
  (`.stans`-primitiven). Ny TYPESKILT-token uden ORBIT-modstykke.

### Mørk flade

- **Gunmetal som mørk flade** (`--fod`, samme værdi som `--blaek`): billednoten
  øverst, sidefoden.
- **Eloxgrå på gunmetal** (`--paafod`): lys tekst på mørk bund. 12,72 : 1.
- **Støvgrå på gunmetal** (`--paafod2`): dæmpet tekst på mørk bund. 5,94 : 1.

### Navngivne regler

**Reglen om navnene, ikke værdierne.** `system.css`s egen kommentar siger det
direkte: "VÆRDIERNE ER NYE, NAVNENE ER DE GAMLE" — TYPESKILT genbruger ORBIT's 16
tokennavne med helt nye hex-værdier, fordi præcis ét sted i testsuiten
(`tests/dele/31-pudsning.mjs:141-142`) binder et bogstaveligt tokennavn. Enhver,
der læser et gammelt navn som et løfte om en gammel farve, læser forkert.

**Reglen om det farveløse hul.** Fravær har ingen farve. Et manglende tal er grå
flade, stiplet kant og minuskler — aldrig rødt, aldrig gult.

**Reglen om den ene stemme.** Der findes én accentfarve. Den bruges aldrig
dekorativt og aldrig til at gøre en overskrift pænere.

## Typografi

**Tre skrifter, ét kun delvist koblet på.** Alle tre er selvhostede `woff2`-filer
i `assets/fonts/` (Saira Semi Condensed: 8 filer, 400/500/600/700 × latin/latin-ext;
Literata: 2 filer, variabel 400–600).

- **SairaSemiCondensed** (`--mono`, "Pladen"): etiketter, tal, topbaren (`.daek`).
  62 brugssteder på tværs af `system.css` (40) og `generator.css` (22) — talt
  ved `grep -o "var(--mono)"`, ikke ved linjer, som overtæller flerbrugslinjer.
- **Literata** (`--manual`, "Manualen"): løbende prosa på Om-siden
  (`.om-lede`, `.om-broed`) og et par sammenligningsside-noter. 8 brugssteder.
- **Manrope** (`--sans`): kun **3** eksplicitte brugssteder (`body`, `.sog input`,
  `.v-tekst`) — men fordi `body{font-family:var(--sans)}` er sidens
  **arve-standard**, og hverken `h1`–`h4`, `.t-hero`/`.t-h1`/`.t-h2`/`.t-h3`,
  `.kort__navn` eller `.typeskilt .robot-navn h1` sætter deres egen
  `font-family`, er `--sans` også skriften på **alle overskrifter og det
  meste løbende tekst i dag** — inklusive robottens eget navn i H1 på
  robotsiden. `"Manrope lokal"` har intet `@font-face` (fjernet i TYPESKILTs
  runde 1), og `Manrope` er ikke hentet nogen steder fra, så stakken falder
  til `Segoe UI Variable Text`/`Segoe UI`/`system-ui`. Kildens egen kommentar
  ved `.daek`: *"Comp'ens body-skrift ER Saira; sidens er stadig --sans"* —
  et selverkendt, ufærdigt migreringstrin, ikke en overset fejl.

### Hierarki

Skalaen (klemmerne, ikke skrifterne) er uændret fra ORBIT: ved 1440 px
76 / 46 / 34 / 19 / 17 / 15 / 13 / 11,5 px. **Vægten på Hero er rettet fra 800 til
700** (`spor/kort`, 31. aug 2026): Saira selvhostes kun i 400/500/600/700, og en
manglende 800 tvang browseren til at SYNTETISERE fed skrift, hvilket gav en
ujævn streg i store grader.

- **Hero** (700, `clamp(33px,6.2vw,76px)`, 0,98, −0,035em, `--sans`-stakken):
  206 sider bruger klassen i dag — ikke kun en forside, der ikke længere findes.
- **H1** (700, `clamp(27px,3.6vw,46px)`, `--sans`-stakken): robotnavnet på
  robotsiden bruger sin egen, større regel — `clamp(40px,7.2vw,84px)`, 700,
  stadig `--sans`, ikke `--mono` — se konfliktafsnittet.
- **H2** (700, `clamp(23px,2.8vw,34px)`): sektionshoveder.
- **H3** (700, 19px).
- **Brød** (400, 17px, 1,6, `blaek2`, `--sans`-stakken via nedarvning).
- **Lille** (400, 15px, 1,55, `blaek2`).
- **Mikro** (400, 13px, 1,5, `blaek3`).
- **Etiket** (mono, 500, 11,5px, +0,15em, versaler, `blaek3`).
- **Figur** (mono, 700, tabulære cifre `tnum 1`): selve tallet. Størrelsen er
  kontekstbestemt af komponenten (fx `.om-regnskab__raekke .figur` 30px/38px på
  Om-siden, `.producent-fakta .figur` 21px) — der er ingen ét-tal-passer-alle
  figur-størrelse i dag.
- **Manual-brød** (400, 18px, 1,62, `blaek`, `--manual`/Literata): Om-sidens
  argumenterende afsnit. 62ch, ikke sitets almindelige 68ch — Literata er
  bredere pr. tegn ved samme pixelstørrelse (målt: 62ch Literata 18px = 636px,
  mod 68ch Saira 17px = 629px, kildens egen kommentar).

### Navngivne regler

**Reglen om versaletiketten.** Den spatierede versaletiket må kun navngive en
datagruppe eller en enhed — aldrig en indholdstom optakt over en overskrift.

**Reglen om mono.** Mono og fed hører til tal, aldrig til en sætning.

**Skriftgulvet.** 10,5 px er den mindste skriftgrad i systemet, også i den
smalleste ombrydning.

## Layout

Sidens indhold ligger i `.rum`: højst 1440 px bredt, centreret, med
`clamp(16px,3.4vw,44px)` (`--kant`) ydre luft. Brødtekst begrænses til 68ch
(`--maal`, Saira-stakken) eller 62ch (Literata).

Rummet måles i en ottetalsskala med ni trin: 4, 8, 12, 16, 24, 32, 48, 64,
96 px (`--r1`–`--r9`).

**Katalogets gitter** (`.net`, katalogsiden er sprogroden i dag) er
`repeat(auto-fill,minmax(232px,1fr))` med 1px synlig fuge farvet `--linje` —
kortene bærer selv hårstregen, ingen enkeltborder pr. kort, ingen dobbeltstreg
hvor to kort mødes.

**Dækket** (topbaren, `spor/topbar`, 31. aug 2026) er sidens ramme øverst: ingen
egen baggrund (arver `--bund`), kun en hårfin `linje`-underkant, sat i `--mono`
(Saira) — bevidst forskelligt fra sidens `--sans`-standard, fordi comp'en dækket
er bygget efter selv står i Saira. Navigationen er et vandret rullespor (7 punkter
i dag efter L58 tilføjede tre), med `scroll-padding-inline` og en indad-tegnet
fokusring, fordi `overflow-x:auto` ellers klipper den.

**Brudpunkter i koden i dag er langt flere end ORBIT-erans fire.** Målt ved
`grep -oE "max-width:[0-9]+px"` over begge stilark: 420, 460, 560, 679, 680, 700,
720, 820, 899, 1100, 1180 px optræder alle mindst én gang — de fleste tilføjet
med Om-siden, sammenligningssiden og producentsiderne, som ikke fandtes, da
ORBIT-udgaven af denne fil blev skrevet. De fire, ORBIT-filen nævnte (1180, 680,
679, 420), er stadig reelle brudpunkter, men er ikke længere den fulde liste.

## Dybde

Systemet er **fladt, punktum** — ikke "fladt i hvile" som ORBIT. Begge
skyggetokens er sat til `none` i `:root`, med kildens egen begrundelse ordret:
*"Ingen slagskygge findes på siden. Materiale, ikke skeuomorft teater."*
Tokenerne (`--skygge`, `--skygge-loeft`) er bevidst bevaret som navne — 11
brugssteder på tværs af begge stilark refererer dem stadig via `var()` — så
en fremtidig beslutning om at genindføre skygge kan gøres ét sted, uden at
opsøge hvert brugssted. I dag tegner ingen af dem noget.

Dybde signaleres i stedet af **fladeskift og streger**: `.rille`
(`--linje`) mellem kort i gitteret, en hårfin underkant under dækket, og
`.stans`-primitivens indfældede lyskant (se *Former*). Hullet — "ikke
oplyst", den stiplede kant — reagerer aldrig på hover eller fokus; det er
ikke en tilstand, der kan "forbedres" ved at pege på den.

## Former

**To formsprog lever side om side i koden i dag, uden en fælles regel for
hvornår hvert bruges** — se `## Konflikter`. Det ene er den gamle,
tokeniserede treleddede skala (`--rund` 12px, `--rund-ind` 8px,
`--rund-lille` 6px), brugt på paneler, kort, felter og chips. Det andet er
TYPESKILTs **stansning**: en hårdkodet `border-radius:2px`, ikke bundet til
noget token, som optræder **26 gange** på tværs af begge stilark (talt ved
`grep -o "border-radius:2px"`) — `.stans`-primitiven selv, robotsidens
store foto (`.robot-foto .billedled--stor`), og en række andre TYPESKILT-
komponenter. Der findes desuden **4** hårdkodede `border-radius:99px`
(pille/cirkel: scrollbar-håndtag, en lille prik-markør) — de konkurrerer
ikke om samme rolle som de to andre og er ikke en del af konflikten.

Kanten bærer stadig betydning, som i ORBIT:

- **Fuldt optrukket, `linje`**: dekorativ skillelinje.
- **Fuldt optrukket, `hegn`**: en kant, læseren skal kunne se — inputfeltets
  ramme. **Målt af dette spor: `hegn` er i dag under WCAG 1.4.11's 3:1-krav
  til meningsbærende ikke-tekst** (2,47 : panel, 2,14 : bund) — se
  `## Konflikter`.
- **Stiplet, `hegn`**: fravær — hullet, "ikke oplyst"-chippen, den
  sekundære kilde.
- **`.stans`-kanten**: 1px indfældet `linje`-kontur med en 1px `--stans`
  (hvid) lyskant foroven — den stansede-metal-effekt, TYPESKILTs signatur.

Firkanten på 9 × 9 px er stadig systemets datatilstands-alfabet: **udfyldt**
(nej), **åben med fyldt kerne** (ja), **stiplet** (ikke oplyst), **halvt
fyldt diagonalt** (kun vist på billede) — uændret fra ORBIT.

## Komponenter

### Dækket (topbaren)

Ét bånd øverst på alle 213 sider, sat i `--mono` (Saira) — bevidst
forskelligt fra sidens `--sans`-standard, se *Typografi*. Ingen egen
baggrund; arver `--bund`, kun adskilt af en hårfin `linje`-underkant.
Ordmærket bærer et **stiplet, midlertidigt navnemærke** (`.daek__stempel`),
fordi sidens navn ikke er afgjort (Å1) — sat i neutral `blaek3`, ikke gult,
fordi et permanent gult felt ville bruge sidens ENESTE accentfarve på noget,
der aldrig skifter. Navigationen er et vandret rullespor; se *Layout* for
de to målte tastaturfælder, det løser (`scroll-padding-inline`,
indad-tegnet fokusring).

### Kort (katalogets kort, `.net .kort`)

Rækkefølgen er fast: **fotografi · producentnavn · robotnavn.** Ingen
mørketalsstribe på selve kortet i dag — `.stribe--kompakt`, som ORBIT-filen
beskrev udførligt som "fire celler, ikke fem", **renders 0 gange** i det
byggede site (bekræftet: én af de 9 kendte, beskyttede døde CSS-klasser fra
`spor/doedcss`, ikke denne agents ansvar at røre).

- **Rammen:** `.net` sætter et 1px `linje`-farvet gitter-gap; kortene selv
  har `border:0;border-radius:0;box-shadow:none` — den tokeniserede
  kort-ramme (`--rund`, `--linje`, `--skygge`) findes i `.kort`s
  **grundregel**, men `.net .kort` nulstiller den. To kort-rammer i to
  filer — se `## Konflikter`.
- **Billedledet:** se *Former* og `## Konflikter` — `.billedled` (16:10,
  `cover`) mod `.net .billedled` (4:3, `contain`); den sidste vinder på
  specificitet på katalogsiden.
- **Navnet** står under billedet, i `--sans`-stakken (arvet, ikke sat
  eksplicit), 17px/600. Navnets `::after` dækker hele kortet, ét klikmål.
- **Statusstempel:** lægges kun på, når status ikke er "i produktion".

### Filtre (kataloget)

`.filtre`/`.chips`, checkboxes med skjult, men fokuserbar, input.

- **Form:** 8px radius, mindst 44px høj.
- **Hvile:** hvid flade mod sidens grå bund — kanten er fjernet med vilje
  (30 chips med hver sin 1px ramme læste som streg-støj).
- **Valgt:** accentfyldt flade, hvid tekst.
- **"Ikke oplyst"-chippen** (hård begrænsning 5): dæmpet `tom`-flade,
  stiplet `hegn`-kant, ingen fed vægt — samme hulsprog som `.v-ikke`.
- **Tælleren** er et tal og sættes i mono med tabulære cifre.

### Søgefeltet

`.sog input`: 44px høj (sitets berøringsmål), 16px skrift (under det zoomer
iOS Safari selv ved fokus), 9px lodret polstring — begge tal målt med
`C:/Praktik/websites/maalevaerktoej/maal.mjs`, ikke regnet i hånden, ifølge
kildens egen kommentar. Virker som et almindeligt formularfelt uden
JavaScript; filtrene er links uanset.

### Knapper

**Kildens egen kommentar kalder `.videre` "den eneste knapform på sitet"** —
det er ikke længere sandt i praksis, se `## Konflikter`.

- **`.videre`** (primær): 46px høj, 8px radius, blæk-flade, hvid tekst,
  hover skifter til accent. På 146 sider i alt (talt i `dist/`).
- **`.videre--stille`**: samme kasse, gennemsigtig flade, accentfarvet
  tekst — **som falder under WCAG 4,5:1** (1,38–1,60 : 1), se
  `## Konflikter` — `hegn`-kant. På 144 af de 146 sider.
- **`.nulstil`**: en anden, nyere knapklasse (katalogsidens
  `<button type="reset">`), på 2 sider.
- Plus mindst tre yderligere, siden-specifikke knap-lignende klasser
  (fx `.valg__fjern`), hver brugt ét sted. Ikke navn-for-navn efterprøvet
  af dette spor — se rapportens usikkerhedsafsnit.

**Der findes ingen købsknap, ingen demoknap, ingen prisforespørgsel.**

### Kildemærket

Et hævet bogstav efter værdien, `--mono`, accentfarve (se kontrastfund i
`## Konflikter`), `max(8px,.34em)`. Bærer et usynligt 24×24px `::before`
for WCAG 2.5.8's berøringsmål uden at bogstavet selv vokser.
**Sekundær kilde** (producentens domæne, ikke produktsiden) markeres med
stiplet `hegn` i `blaek3` — hullets eget sprog.

### De fire datatilstande

Systemets kerne: "Ikke oplyst", "nej", "0" og "kun vist på billede" deler
hverken skriftgrad, bogstavform, flade eller mærke.

- **Tal** (`.v-tal`): stor, fed figur i mono. Operatoren foran i
  `max(8px,.72em)`, enheden bagefter i `max(8px,.56em)`.
- **Nul** (`.v-nul`): sættes præcis som ethvert andet tal.
- **Nej** (`.v-nej`): **fast 10,5px** (ikke længere em-baseret — rettet i
  `spor/samlvaelg`, fordi em-satsen svingede med arvet skrift), versaler,
  0,13em spatiering, fuld blæk, udfyldt 9×9px firkant.
- **Ja** (`.v-ja`): stadig em-baseret, `.62em`, samme vægt som nej, åben
  firkant med fyldt kerne.
- **Ikke oplyst** (`.v-ikke`): **fast 11px** (samme rettelse), minuskler,
  `blaek3` på `tom`-flade, stiplet `hegn`-kant, 9×9px stiplet firkant.
- **Kun vist på billede** (`.v-billede`): fast 11px, kursiveret ord, halvt
  fyldt firkant, ingen dæmpet flade.

**`.v-nej` og `.v-ikke`/`.v-billede` bruger i dag to forskellige
satsmetoder** (fast px mod em) inden for samme fire-tilstandsfamilie — ikke
en af de fire konflikter i briefet, men målt her.

### Nøgletalsstriben (robotsiden)

`.stribe--fem`, robotsidens egen fulde stribe: fem celler, `column-reverse`
så figuren står øverst visuelt mens DOM-rækkefølgen er etiket-før-værdi
(skærmlæserrækkefølge). Figur 29px i mono. Falder til tre spalter, så to,
alt efter bredde. Brugt på 144 sider i dag. Katalogkortets tidligere
kompakte udgave (`.stribe--kompakt`) er død, se *Kort* ovenfor.

### Stansningen (`.stans`)

TYPESKILTs egen primitiv: 2px radius, 1px indfældet `linje`-kontur, 1px
hvid (`--stans`) lyskant foroven — den stansede-metal-effekt. Bæres i dag
af det midlertidige navnemærke i dækket; genbrugelig på fremtidige
komponenter.

### Slettede komponenter — historisk

Forsiden (`hero`, `yderpunkterne`, `EU-fundet`, `formålsfilteret`) er
**slettet** (L72, 1. sep 2026, `spor/oversigt`). Den forrige udgave af
denne fil brugte omkring 250 linjer på at beskrive dem som levende
komponenter, inklusive et ændringslog tilbage til 24. aug 2026. Det er nu
arkiv — se git-historikken for `DESIGN.md` før dette spor, eller
`fund/FUND-kortramme.md` for en analyse af hvad der skete, da `.yderpunkt`s
billedrettelse ikke fulgte med til `.net`-kortet.

## Gør og lad være

### Gør

- **Gør** hullet lige så formgivet som tallet.
- **Gør** hver ny tone målt mod BÅDE `panel` og `bund` med den faktiske WCAG-
  formel — ikke kun genbrugt fra en kildekommentar skrevet til en anden
  rolle (se `## Konflikter`, `--accent` som forgrund).
- **Gør** tal i mono med tabulære cifre, og bevar operatoren.
- **Gør** versaletiketten funktionel — den navngiver en datagruppe eller
  en enhed.
- **Gør** designændringer i `assets/*.css` og `tools/skabelon/*.mjs`.
  `dist/` er genereret og overskrives ved næste byg.
- **Gør** rummet fra ottetalsskalaen.
- **Gør** hver betjeningsflade brugbar uden JavaScript, eller skjul den til
  JS tænder den.

### Lad være

- **Lad være** med at give fravær farve.
- **Lad være** med at sætte nul som et hul.
- **Lad være** med at bruge versaletiketten som indholdstom optakt.
- **Lad være** med at indføre en knapform, der fører ud af sitet. Ingen
  købsknap, intet affiliate-link, ingen prisforespørgsel.
- **Lad være** med at løfte, animere eller fremhæve et hul.
- **Lad være** med at sætte en sætning i mono.
- **Lad være** med at gå under 10,5px, heller ikke i den smalleste
  ombrydning.
- **Lad være** med at antage, at et token-navn (`--blaek3`, `--hegn`, …)
  stadig bærer sin ORBIT-værdi. Værdierne er nye; kun navnene er gamle.
- **Lad være** med at bruge `--accent` som tekstfarve mod en lys flade uden
  at slå `## Konflikter` op først — den er kun målt sikker som baggrund.

---

## Konflikter

**Disse punkter er MÅLT, ikke afgjort.** Designfrysen (L70, CLAUDE.md)
gælder: retningen ligger hos led 2 (`extract`) og JPK. Intet nedenfor er en
anbefaling.

**1. Knappen — to generationer.** `.videre`/`.videre--stille` (146/144
sider, talt i `dist/`) er ORBIT-æraens knapprimitiv, stadig i brug.
`.nulstil` (2 sider) er en nyere, anden knapklasse. Plus mindst tre
yderligere sidespecifikke knap-lignende klasser, hver brugt ét sted —
navnene er ikke enkeltvis efterprøvet af dette spor. Kildens egen kommentar
kalder `.videre` "den eneste knapform på sitet"; det stemmer ikke længere.

**2. Billedrammen — to sideforhold.** `.billedled{aspect-ratio:16/10}` (16:10) +
`object-fit:cover` (system.css) mod `.net .billedled{aspect-ratio:4/3}` (4:3) +
`object-fit:contain` (generator.css) — den sidste vinder på specificitet på
katalogsiden. To formater på samme primitiv i to filer, ingen har besluttet
hvilket der gælder generelt. Uddybet i `fund/FUND-kortramme.md`.

**3. Farvedubletter.** Flere tokennavne peger på samme værdi: **5 navne**
på `#E8EBED` (`--bund`, `--tom`, `--panel-ro`, `--accent-ro`, `--paafod`),
**2** på `#9AA3A9` (`--hegn`, `--paafod2`), **2** på `#22262A` (`--blaek`,
`--fod`), **2** på `#5F686F` (`--blaek3`, `--stoev-blaek`). Alle tal
genmålt af dette spor direkte i `:root`.

**4. Den tredje skrift — en ufærdig migrering.** `--mono` (Saira) i **62**
regler (ikke 67 — genmålt, se rapporten), `--manual` (Literata) i **8**,
`--sans` (Manrope) i kun **3** eksplicitte regler — men fordi `body`,
`h1`–`h4` og hver typografisk utility-klasse (`.t-hero` osv.) undlader at
sætte deres egen `font-family`, ARVER de `--sans`. Manrope har **0**
fontfiler i `assets/fonts/` og falder til systemskrift. Kildens egen
kommentar erkender det: *"sidens [skrift] er stadig --sans"*, ventende på
en "runde 2".

**5. `--accent` som forgrund fejler WCAG AA (bekræfter L70, CLAUDE.md,
genmålt uafhængigt her).** `accent` på `panel` = **1,60 : 1**, på `bund` =
**1,38 : 1** — mod kravet på 4,5 : 1. Bruges alligevel som tekstfarve i
`a{color:var(--accent)}` (ethvert link på sitet), `.kildemaerke` og
`.videre--stille`. Sikker kun som BAGGRUND (`blaek`-tekst på `accent` =
9,19 : 1, matcher kildens egen kommentar).

**6. `--hegn` som betydningsbærende kant fejler WCAG 1.4.11.** 2,47 : 1 mod
`panel`, 2,14 : 1 mod `bund` — under de 3,0 : 1, standarden kræver til
meningsbærende ikke-tekst-elementer (inputkant, hul-markør). ORBIT-værdien
klarede kravet (3,32–3,68 : 1, jf. den forrige filudgave); TYPESKILTs nye
hex gjorde det ikke.

**7. To formsprog for radius.** Den tokeniserede skala (`--rund` 12px,
`--rund-ind` 8px, `--rund-lille` 6px) og en hårdkodet, ikke-tokeniseret
TYPESKILT-stansning på 2px, brugt **26** gange på tværs af begge stilark.
Ingen regel siger, hvilken en ny komponent skal vælge.

**8. To kort-rammer i to filer.** `.kort`s grundregel (`system.css`) sætter
`border:1px solid linje;border-radius:rund;box-shadow:skygge`. `.net .kort`
(`generator.css`, katalogsiden) nulstiller alle tre til `0`/`none`. Samme
klasse, to visuelle identiteter, afhængigt af hvilken side der spørger.
