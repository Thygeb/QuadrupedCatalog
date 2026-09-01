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
