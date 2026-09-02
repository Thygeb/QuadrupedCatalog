---
name: Firbenede robotter (arbejdstitel — Å1 er ikke afgjort)
description: Et kildeangivet opslagsværk over verdens firbenede robotter, hvor hullerne i vores viden er lige så formgivet som tallene.
colors:
  # Primitiver (spor/primitiv, 2. sep 2026, BRIEF-primitiv.md): farven, som
  # den ER. Navnene er MANIFEST.md's Paletten (retninger/nyverden/MANIFEST.md
  # §Paletten). De 16 tokens nedenfor pegede foer direkte paa disse hex-
  # vaerdier; de peger nu paa primitivet i stedet - samme farve, eksplicit
  # delt fremfor implicit gentaget. Se assets/system.css :root for kilden.
  p-eloxgraa: "#E8EBED"
  p-gunmetal: "#22262A"
  p-kridt: "#FAFBFB"
  p-blaek-2: "#545C63"
  p-afmaerkningsgul: "#F2C400"
  p-rille: "#C6CCD1"
  p-stoevgraa: "#9AA3A9"
  p-stoev-blaek: "#5F686F"
  p-stans: "#FFFFFF"
  # Semantik: hvad farven BETYDER. Navnene er de oprindelige 16, uaendrede.
  # Vaerdien er nu en reference til primitivet ovenfor, ikke en literal hex -
  # praecis som i koden. Ingen af de 16 er fjernet eller lagt sammen.
  bund: "var(--p-eloxgraa)"
  panel: "var(--p-kridt)"
  panel-ro: "var(--p-eloxgraa)"
  tom: "var(--p-eloxgraa)"
  blaek: "var(--p-gunmetal)"
  blaek2: "var(--p-blaek-2)"
  blaek3: "var(--p-stoev-blaek)"
  stoev-blaek: "var(--p-stoev-blaek)"
  accent: "var(--p-afmaerkningsgul)"
  accent-ro: "var(--p-eloxgraa)"
  linje: "var(--p-rille)"
  hegn: "var(--p-stoevgraa)"
  fod: "var(--p-gunmetal)"
  paafod: "var(--p-eloxgraa)"
  paafod2: "var(--p-stoevgraa)"
  stans: "var(--p-stans)"
typography:
  display:
    fontFamily: "SairaSemiCondensed, ui-sans-serif, system-ui, -apple-system, Segoe UI Variable Text, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(33px, 6.2vw, 76px)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "SairaSemiCondensed, ui-sans-serif, system-ui, -apple-system, Segoe UI Variable Text, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(27px, 3.6vw, 46px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  title:
    fontFamily: "SairaSemiCondensed, ui-sans-serif, system-ui, -apple-system, Segoe UI Variable Text, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(23px, 2.8vw, 34px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.026em"
  body:
    fontFamily: "SairaSemiCondensed, ui-sans-serif, system-ui, -apple-system, Segoe UI Variable Text, Segoe UI, Helvetica Neue, Arial, sans-serif"
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
  # L79 (2. sep 2026): ét hjoerne, ikke en skala. Her stod rund 12 /
  # rund-ind 8 / rund-lille 6. Se ## Konflikter, punkt 7 — AFGJORT.
  hjoerne: "2px"
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
    rounded: "{rounded.hjoerne}"
  videre:
    backgroundColor: "{colors.blaek}"
    textColor: "#FFFFFF"
    rounded: "{rounded.hjoerne}"
    padding: "0 18px"
    height: "46px"
  videre-hover:
    backgroundColor: "{colors.accent}"
    # L76: her stod "#FFFFFF" = 1,66 : 1. Tekst PAA accent er altid blaek.
    textColor: "{colors.blaek}"
  videre-stille:
    backgroundColor: "transparent"
    # L76: her stod "{colors.accent}" paa en gennemsigtig (= lys) flade,
    # altsaa 1,38 : 1. Accent er baggrund og markoer, aldrig tekst paa lys.
    textColor: "{colors.blaek}"
    rounded: "{rounded.hjoerne}"
    padding: "0 16px"
    height: "46px"
  nulstil:
    backgroundColor: "transparent"
    textColor: "{colors.blaek2}"
    rounded: "{rounded.hjoerne}"
    height: "44px"
  filter:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.blaek2}"
    rounded: "{rounded.hjoerne}"
    padding: "0 14px"
    height: "44px"
  filter-valgt:
    backgroundColor: "{colors.accent}"
    # L76: her stod "#FFFFFF" = 1,66 : 1. Nu blaek paa accent = 9,19 : 1.
    textColor: "{colors.blaek}"
  sogefelt:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.blaek}"
    rounded: "{rounded.hjoerne}"
    padding: "9px 14px"
    height: "44px"
  vaerdi-tal:
    textColor: "{colors.blaek}"
    typography: "{typography.figur}"
  vaerdi-ikke:
    backgroundColor: "{colors.tom}"
    textColor: "{colors.blaek3}"
    rounded: "{rounded.hjoerne}"
    padding: "1px 5px"
  maerke:
    backgroundColor: "{colors.panel-ro}"
    textColor: "{colors.blaek2}"
    rounded: "{rounded.hjoerne}"
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

**Migrationen er kommet et stort skridt videre.** Paletten og topbaren
(dækket) blev lagt om til TYPESKILT 31. aug; **overskrifter, brødtekst,
radius og billedramme fulgte 2. sep 2026 med L76–L80** (`spor/extract`).
Her stod indtil da, at overskrifter og brødtekst ventede på det, kildens
kommentarer kaldte *"runde 2"*, og at store dele af sidens tekst derfor
blev tegnet i en skriftfamilie uden fontfiler. Det er ikke længere sandt:
sidens skrift er Saira, sat eksplicit på `body`.

**Det, der stadig udestår, er knappen** (L77, eget spor) samt de uafgjorte
punkter 3, 6 og 8 i `## Konflikter`.

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

- **Afmærkningsgul** (`#F2C400`): valgte filtre, fokusring, understregning
  på hover, markørflader. **L76 (2. sep 2026) gør reglen bindende: accent er
  en BAGGRUND og en MARKØR, aldrig tekst på en lys flade.** Med mørk tekst
  ovenpå er den sikker (`blaek` på `accent` = 9,19 : 1); som forgrund på lys
  er den 1,60 : 1 på `panel` og 1,38 : 1 på `bund`. **Tekst PÅ accent er
  altid `blaek`, aldrig hvid** (hvid = 1,66 : 1). På den mørke flade
  (`blaek`/`fod`) MÅ accent være tekst — dér er den 9,19 : 1, og tre regler
  bruger den sådan. Her stod tidligere, at accent var farven på *links* og
  *kildemærker*; det er den ikke længere. Se punkt 5 i `## Konflikter`.
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

**To skrifter. Saira til maskinen, Literata til mennesket** (L80,
2. sep 2026). Begge er selvhostede `woff2`-filer i `assets/fonts/`
(Saira Semi Condensed: 8 filer, 400/500/600/700 × latin/latin-ext;
Literata: 2 filer, variabel 400–600). **Der er ingen tredje skrift** — her
stod indtil 2. sep "tre skrifter, ét kun delvist koblet på", og den tredje
havde nul fontfiler.

- **SairaSemiCondensed** (`--mono`, "Pladen"): **sidens skrift.** `body`
  sætter den eksplicit, så etiketter, tal, topbaren (`.daek`), alle
  overskrifter og al ikke-prosa tekst står i den. 62 brugssteder i kode
  (59 før L80 plus de 3, `--sans` afgav) — talt ved `grep -o "var(--mono)"`
  på filen **uden kommentarer**; et råt grep giver et par flere, fordi
  tokennavnet også nævnes i kommentarer.
- **Literata** (`--manual`, "Manualen"): løbende prosa på Om-siden
  (`.om-lede`, `.om-broed`) og et par sammenligningsside-noter. 8 brugssteder.
  L80 lod de 8 stå, som de var.

`h1`–`h4` sætter **ingen** `font-family` og arver `body`. Det er et bevidst
valg, ikke en forglemmelse: fejlen, L80 rettede, lå i `body`s værdi, så en
eksplicit erklæring på overskrifterne ville have arvet eller gentaget det
samme forkerte token. Én kilde til sidens skrift.

**Navnet `--mono` er historisk og passer ikke til indholdet** — tokenet er
ikke en fastbredde-skrift. Se punkt 4 i `## Konflikter`.

### Hierarki

Skalaen (klemmerne, ikke skrifterne) er uændret fra ORBIT: ved 1440 px
76 / 46 / 34 / 19 / 17 / 15 / 13 / 11,5 px. **Vægten på Hero er rettet fra 800 til
700** (`spor/kort`, 31. aug 2026): Saira selvhostes kun i 400/500/600/700, og en
manglende 800 tvang browseren til at SYNTETISERE fed skrift, hvilket gav en
ujævn streg i store grader.

- **Hero** (700, `clamp(33px,6.2vw,76px)`, 0,98, −0,035em, Saira):
  206 sider bruger klassen i dag — ikke kun en forside, der ikke længere findes.
- **H1** (700, `clamp(27px,3.6vw,46px)`, Saira): robotnavnet på
  robotsiden bruger sin egen, større regel — `clamp(40px,7.2vw,84px)`, 700,
  nu `--mono` (Saira), som resten af siden.
- **H2** (700, `clamp(23px,2.8vw,34px)`): sektionshoveder.
- **H3** (700, 19px).
- **Brød** (400, 17px, 1,6, `blaek2`, Saira via nedarvning fra `body`).
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
(Saira), fordi comp'en dækket er bygget efter selv står i Saira. Indtil L80
var det bevidst FORSKELLIGT fra sidens standard; efter L80 er det samme
skrift som resten af siden, og erklæringen er dermed blevet en bekræftelse
i stedet for en undtagelse. Navigationen er et vandret rullespor (7 punkter
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

**Ét hjørne. `--hjoerne` = 2px, og det gælder overalt** (L79,
2. sep 2026). JPK's ord: *"der skal være konsistens i websiden"* — derfor
ét trin, ikke to.

Her stod indtil 2. sep, at **to** formsprog levede side om side uden en
fælles regel: den gamle tokeniserede treleddede skala (`--rund` 12px,
`--rund-ind` 8px, `--rund-lille` 6px) på 31 brugssteder, og TYPESKILTs
**stansning** — en hårdkodet 2px på 26 brugssteder, ikke bundet til noget
token. Stansningen vandt, og den er nu et token. Alle 57 brugssteder peger
samme sted; 54 står tilbage, efter at tre selvophævende regler er slettet.

**Navnet:** `--stans` var det oplagte valg og er optaget — det er en
FARVE (lyskanten i en stansning). Tokenet hedder derfor `--hjoerne`.

To ting er ikke hjørner og beholder deres egen værdi:

- **Radius nul** (14 steder) er en anden påstand end "systemets hjørne" —
  fx de to sekundære kildemærker, der skal læses som klammer, ikke som
  prikker (låst af `tests/dele/31-pudsning.mjs` 31.14).
- **99px-pillen** (4 steder: scrollbar-håndtag, enhedsomskifterens spor og
  knop, en lille prik) er en fuldt afrundet **ende**, ikke et hjørne.

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
sat i `--mono` som resten af siden, se *Typografi*. Ingen egen
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
  kort-ramme (`--hjoerne`, `--linje`, `--skygge`) findes i `.kort`s
  **grundregel**, men `.net .kort` nulstiller den. To kort-rammer i to
  filer — se `## Konflikter`.
- **Billedledet:** 4:3 og `contain`, som overalt på sitet (L78). Her stod,
  at `.billedled` (16:10, `cover`) og `.net .billedled` (4:3, `contain`)
  konkurrerede, og at den sidste vandt på specificitet. Grundreglen bærer
  nu begge værdier, og katalogets undtagelse er slettet, fordi den var
  blevet en gentagelse. Se punkt 2 i `## Konflikter`.
- **Navnet** står under billedet, i Saira (arvet fra `body`, ikke sat
  eksplicit), 17px/600. Navnets `::after` dækker hele kortet, ét klikmål.
- **Statusstempel:** lægges kun på, når status ikke er "i produktion".

### Filtre (kataloget)

`.filtre`/`.chips`, checkboxes med skjult, men fokuserbar, input.

- **Form:** `--hjoerne` (2px, L79), mindst 44px høj.
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

- **`.videre`** (primær): 46px høj, `--hjoerne`, blæk-flade, hvid tekst.
  Hover skifter til accent-flade med **blæk** tekst. På 146 sider i alt
  (talt i `dist/`). L76-note: hover-tilstanden stod på hvid tekst mod
  accent (1,66 : 1), og den fejl var usynlig for en linjebaseret søgning,
  fordi farven står i `.videre` og baggrunden i `.videre:hover`.
- **`.videre--stille`**: samme kasse, gennemsigtig flade, `hegn`-kant.
  Teksten var accentfarvet og faldt under WCAG 4,5:1 (1,38–1,60 : 1);
  den er **blæk** efter L76. På 144 af de 146 sider.
- **`.nulstil`**: en anden, nyere knapklasse (katalogsidens
  `<button type="reset">`), på 2 sider.
- Plus mindst tre yderligere, siden-specifikke knap-lignende klasser
  (fx `.valg__fjern`), hver brugt ét sted. Ikke navn-for-navn efterprøvet
  af dette spor — se rapportens usikkerhedsafsnit.

**Der findes ingen købsknap, ingen demoknap, ingen prisforespørgsel.**

### Kildemærket

Et hævet bogstav efter værdien, `--mono`, `blaek2`, `max(8px,.34em)`.
Mærket var accentfarvet indtil L76 og stod dermed på 1,60 : 1 mod panel —
i praksis usynligt ved 8px. `blaek2` giver 6,56 : 1 og holder det stadig
underordnet selve tallet. Bærer et usynligt 24×24px `::before`
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
- **Lad være** med at bruge `--accent` som tekstfarve mod en lys flade.
  Det er ikke længere en advarsel, men en regel (L76): accent er baggrund,
  kant, understregning eller fokusring — aldrig forgrund på lyst. På den
  mørke flade må den gerne være tekst.
- **Lad være** med at sætte hvid tekst på `--accent`. Tekst på accent er
  altid `--blaek`. Hvid giver 1,66 : 1.
- **Lad være** med at beskære et produktfoto (L78), og lad være med at
  give en flade sit eget sideforhold eller sin egen `object-fit`.
- **Lad være** med at skrive en radius i hånden. Brug `--hjoerne` (L79).
  Vil du have nul eller en fuldt afrundet ende, så skriv det — det er
  andre påstande end "systemets hjørne".

---

## Konflikter

**Punkterne her er MÅLT.** De blev skrevet, mens designfrysen (L70) gjaldt,
og ingen af dem var dengang afgjort.

**Fire af dem er afgjort siden.** JPK traf 2. sep 2026 beslutningerne
L76–L80, og led 2 (`extract`) byggede fire af dem ind i stilarkene. De
afgjorte punkter er markeret **AFGJORT** med deres L-nummer og beholdt i
fuld længde — en løst konflikt, der slettes, efterlader ingen forklaring
på, hvorfor koden ser ud, som den gør.

**Punkt 1 (knappen) står stadig ÅBENT.** Den følger som L77 i et separat
spor, fordi den også ændrer skabelonerne. Punkt 3, 6 og 8 er uafgjorte og
uberørte.

**1. Knappen — to generationer.** `.videre`/`.videre--stille` (146/144
sider, talt i `dist/`) er ORBIT-æraens knapprimitiv, stadig i brug.
`.nulstil` (2 sider) er en nyere, anden knapklasse. Plus mindst tre
yderligere sidespecifikke knap-lignende klasser, hver brugt ét sted —
navnene er ikke enkeltvis efterprøvet af dette spor. Kildens egen kommentar
kalder `.videre` "den eneste knapform på sitet"; det stemmer ikke længere.

**2. Billedrammen — to sideforhold. AFGJORT af L78 (2. sep 2026).**
Konflikten var: `.billedled` (16:10 + `cover`, system.css) mod
`.net .billedled` (4:3 + `contain`, generator.css) — den sidste vandt på
specificitet på katalogsiden. To formater på samme primitiv i to filer.
Uddybet i `fund/FUND-kortramme.md`.

**Afgørelsen: et produktfoto beskæres aldrig. 4:3 og `contain` overalt,
ingen fladespecifik undtagelse.** Grundreglen bærer nu begge værdier, og
de fire overflødige undtagelser er slettet frem for efterladt. Målingen bag:
med `cover` mistede 40 af 65 fotos over 10 % af billedet, i snit 18,3 %,
værst 59 % — og robotsiden er netop fladen, hvor man vil se maskinen.

**Én undtagelse, og den er en måleenhed, ikke en smagsdom.** Måltro-pladen
(`.billedled--maal`) er ikke et produktfoto — den har intet `<img>`, kun
`<span>`. Dens kasse tegnes i procent af feltet, og procenterne regnes i
`tools/skabelon/side.mjs` ud fra et 16:10-felt. Ved 4:3 ville hver silhuet
blive tegnet **20,0 % for høj** (målt på pladens egen kasse: 771 × 400 mm,
sandt forhold 1,928, tegnet 1,606). Pladens forhold står derfor som tokenet
`--plade-forhold`, og `tests/dele/61-extract.mjs` læser BEGGE sider og
fejler, hvis CSS'en og `side.mjs` skrider fra hinanden.

**3. Farvedubletter.** Flere tokennavne peger på samme værdi: **5 navne**
på `#E8EBED` (`--bund`, `--tom`, `--panel-ro`, `--accent-ro`, `--paafod`),
**2** på `#9AA3A9` (`--hegn`, `--paafod2`), **2** på `#22262A` (`--blaek`,
`--fod`), **2** på `#5F686F` (`--blaek3`, `--stoev-blaek`). Alle tal
genmålt af dette spor direkte i `:root`.

**4. Den tredje skrift — en ufærdig migrering. AFGJORT af L80
(2. sep 2026).** Konflikten var: `--mono` (Saira) i **62** regler,
`--manual` (Literata) i **8**, `--sans` (Manrope) i kun **3** eksplicitte
regler — men fordi `body`, `h1`–`h4` og hver typografisk utility-klasse
undlod at sætte deres egen `font-family`, ARVEDE de `--sans`. Manrope havde
**0** fontfiler i `assets/fonts/`, så hver overskrift og al brødtekst på
216 sider blev tegnet i operativsystemets standardskrift.

**Afgørelsen: der er to skrifter, ikke tre. Saira til maskinen, Literata
til mennesket.** `--sans` er fjernet; dens tre brugssteder (`body`,
`.sog input`, `.v-tekst`) peger nu på `--mono`. `body` sættes eksplicit.
`h1`–`h4` arver bevidst: en eksplicit erklæring dér ville have arvet eller
gentaget det samme fantomtoken og var altså ikke det, der beskyttede mod
fejlen — kun `body`s værdi var det.

Efterprøvet i browseren, ikke kun i CSS'en: `body`, `h1`, `h2`, `.v-tekst`,
`.stribe` og `.billedled--stor` tegner alle i SairaSemiCondensed.

To rettelser til tallene ovenfor, begge målt: `assets/fonts/` rummer **8**
Saira-filer (4 vægte × 2 subsets) og 2 Literata — ikke 10 Saira. Og de
**62** `--mono`-brug var 59 i kode plus 3 i kommentarer.

**Stadig åbent, men lille:** navnet `--mono` passer ikke til indholdet —
tokenet er ikke en fastbredde-skrift, det er maskinens skrift. Et
navneskift rører 62 brugssteder og to tests, der kræver strengen ordret,
og var ikke en del af L80.

**5. `--accent` som forgrund fejler WCAG AA. AFGJORT af L76
(2. sep 2026).** Konflikten var: `accent` på `panel` = **1,60 : 1**, på
`bund` = **1,38 : 1** — mod kravet på 4,5 : 1. Brugt alligevel som
tekstfarve i `a{color:var(--accent)}` (ethvert link på sitet, 7.892
`<a>`-elementer), `.kildemaerke` og `.videre--stille`.

**Afgørelsen: `--accent` er en BAGGRUND og en MARKØR, aldrig tekst på en
lys flade.** På lys flade må accent være baggrund, kant, understregning
eller fokusring. **Tekst PÅ accent er altid `blaek`, aldrig hvid** — hvid
på accent er 1,66 : 1, `blaek` på accent er 9,19 : 1. På den mørke flade
(`blaek`/`fod`) MÅ accent være tekst; dér er den 9,19 : 1.

Links er nu `blaek` med understregning; accent flytter til hover som
understregningens farve, ikke tekstens — en gul tekstfarve på hover ville
give 1,38 mod hvilens 12,72, altså det modsatte af hensigten.

15 regler med accent som forgrund blev gennemgået enkeltvis: **12 flyttet,
3 beholdt** (`.klaebebar__gaa`, `.valg__fjern:hover`, `.taeller__tal` —
alle på mørk flade, hver med en kommentar i koden om hvorfor).

**Vær opmærksom på, at hvid-på-accent fandtes SYV steder, ikke seks.** Det
syvende, `.videre:hover`, kan ikke ses med en linjebaseret søgning: farven
står i `.videre` og baggrunden i `.videre:hover`, altså i hver sin regel.

Efterprøvet i browseren på en bygget robotside: 29 links, **0** med accent
som tekstfarve, **0** under 4,5 : 1. Måleapparatet er valideret mod et
kendt svar — tvinges accent tilbage, rapporterer samme script 29 og 15.

**6. `--hegn` som betydningsbærende kant fejler WCAG 1.4.11.** 2,47 : 1 mod
`panel`, 2,14 : 1 mod `bund` — under de 3,0 : 1, standarden kræver til
meningsbærende ikke-tekst-elementer (inputkant, hul-markør). ORBIT-værdien
klarede kravet (3,32–3,68 : 1, jf. den forrige filudgave); TYPESKILTs nye
hex gjorde det ikke.

**7. To formsprog for radius. AFGJORT af L79 (2. sep 2026).** Konflikten
var: den tokeniserede skala (`--rund` 12px, `--rund-ind` 8px,
`--rund-lille` 6px, **31** brugssteder) og en hårdkodet, ikke-tokeniseret
TYPESKILT-stansning på 2px, brugt **26** gange. Ingen regel sagde, hvilken
en ny komponent skulle vælge. Systemet rettede endda sig selv i hånden:
tre regler scopet under `.typeskilt` ophævede `--rund` tilbage til 2px.

**Afgørelsen: stansningen vinder. 2px bliver systemets radius overalt, og
den bliver et token.** JPK's ord: *"der skal være konsistens i websiden"* —
derfor ét trin, ikke to. Tokenet hedder **`--hjoerne`**; `--stans` var det
oplagte navn og er optaget af en FARVE (lyskanten i en stansning).

Regnskabet: 26 hårdkodede + 31 tokeniserede = 57 brugssteder, minus de tre
selvophævende `.typeskilt`-regler = **54 i kode**. De tre blev efterprøvet
enkeltvis før sletningen: deres grundregler stod alle på `var(--hjoerne)`.

Urørt med vilje: **14** × radius nul (en anden påstand end "systemets
hjørne") og **4** × 99px-pillen (en fuldt afrundet ende, ikke et hjørne).

Tre kommentarer, der argumenterede ud fra den gamle skala, er skrevet om i
stedet for efterladt. Én assertion (34.20) er **vendt**, ikke slettet: den
krævede den ordrette værdi `border-radius:2px` og beviser nu, at `.stans`
peger på systemets token, OG at tokenet er 2px.

**8. To kort-rammer i to filer.** `.kort`s grundregel (`system.css`) sætter
`border:1px solid linje;border-radius:rund;box-shadow:skygge`. `.net .kort`
(`generator.css`, katalogsiden) nulstiller alle tre til `0`/`none`. Samme
klasse, to visuelle identiteter, afhængigt af hvilken side der spørger.
