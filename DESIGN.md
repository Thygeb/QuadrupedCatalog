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
  p-eloxgraa-2: "#E4E7EA"
  p-gunmetal: "#22262A"
  p-kridt: "#FAFBFB"
  p-blaek-2: "#545C63"
  p-afmaerkningsgul: "#F2C400"
  p-rille: "#C6CCD1"
  p-stoevgraa: "#9AA3A9"
  p-stoevgraa-2: "#737F87"
  p-stoev-blaek: "#5F686F"
  p-stans: "#FFFFFF"
  # Semantik: hvad farven BETYDER. Navnene er de oprindelige 16, uaendrede.
  # Vaerdien er nu en reference til primitivet ovenfor, ikke en literal hex -
  # praecis som i koden. Ingen af de 16 er fjernet eller lagt sammen.
  bund: "var(--p-eloxgraa)"
  panel: "var(--p-kridt)"
  panel-ro: "var(--p-eloxgraa)"
  tom: "var(--p-eloxgraa-2)"
  blaek: "var(--p-gunmetal)"
  blaek2: "var(--p-blaek-2)"
  blaek3: "var(--p-stoev-blaek)"
  stoev-blaek: "var(--p-stoev-blaek)"
  accent: "var(--p-afmaerkningsgul)"
  accent-ro: "var(--p-eloxgraa)"
  linje: "var(--p-rille)"
  hegn: "var(--p-stoevgraa)"
  hegn-baerende: "var(--p-stoevgraa-2)"
  fod: "var(--p-gunmetal)"
  paafod: "var(--p-eloxgraa)"
  paafod2: "var(--p-stoevgraa)"
  stans: "var(--p-stans)"
  ring: "var(--p-gunmetal)"
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
  # DP3b (designplanen, 3. sep 2026): h3, lille, raekke og mikro er FOEJET TIL
  # her, ikke opfundet. Prosaen navngav ni trin, frontmatter kun syv, og et
  # spor, der laeste frontmatter, konkluderede derfor at 13 px og 14 px ikke
  # fandtes i skalaen. Reglen er nu: frontmatter navngiver hvert trin,
  # prosaen navngiver. Se ## Typografi -> Hierarki -> DP3b.
  h3:
    fontFamily: "SairaSemiCondensed, ui-sans-serif, system-ui, -apple-system, Segoe UI Variable Text, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "19px"
    fontWeight: 700
    lineHeight: 1.08
  body:
    fontFamily: "SairaSemiCondensed, ui-sans-serif, system-ui, -apple-system, Segoe UI Variable Text, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "-0.006em"
  lille:
    fontFamily: "SairaSemiCondensed, ui-sans-serif, system-ui, -apple-system, Segoe UI Variable Text, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  # RAEKKE: navnet paa eller indholdet i én raekke i en taet liste eller tabel.
  # Ni levende brugssteder i dag, fem af dem netop den rolle.
  raekke:
    fontFamily: "SairaSemiCondensed, ui-sans-serif, system-ui, -apple-system, Segoe UI Variable Text, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.5
  mikro:
    fontFamily: "SairaSemiCondensed, ui-sans-serif, system-ui, -apple-system, Segoe UI Variable Text, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
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
  # KNAPPEN (L77, spor/knap, 2. sep 2026): ÉN primitiv med varianter.
  # Her stod foer videre / videre-hover / videre-stille / nulstil - fire af
  # de elleve knapudtryk, sitet talte. Grundformen taler nu TYPESKILT.
  #
  # DEN GAMLE "nulstil"-post var DIREKTE FORKERT, og fejlen er laererig:
  # den stod her med textColor blaek2 og height 44px. I koden var den
  # color:var(--paafod) (= eloxgraa, en LYS forgrund til en MOERK flade) og
  # havde slet ingen height. En laeser af denne fil ville altsaa tro, at
  # nulstil var en lys-flade-knap - og det var praecis den antagelse, der
  # kostede spor/saml3 en knap paa 1,16:1 dagen foer L77.
  knap:
    # Grundformen baerer INGEN farve. Det er sporets vigtigste beslutning:
    # en .knap uden flade-variant arver den flade, den staar paa, og kan
    # derfor aldrig blive usynlig ved et uheld.
    backgroundColor: "transparent"
    textColor: "inherit"
    fontFamily: "{typography.label.fontFamily}"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.11em"
    textTransform: "uppercase"
    rounded: "{rounded.hjoerne}"
    padding: "0 16px"
    height: "44px"
  # FLADE-VARIANTER. Tre vaegte, to flader. Ingen af dem er standarden;
  # ordet "-moerk" i navnet er vaernet mod at vaelge den forkerte flade.
  knap--fyldt:            # lys bund - 14,69 : 1
    backgroundColor: "{colors.blaek}"
    textColor: "{colors.panel}"
  knap--kant:             # lys bund - 12,72 : 1, haarstreg i blaek2
    backgroundColor: "transparent"
    textColor: "{colors.blaek}"
  knap--tekst:            # lys bund - 4,74 : 1, understreget, uden kasse
    backgroundColor: "transparent"
    textColor: "{colors.stoev-blaek}"
  knap--kant-moerk:       # moerk flade (--fod) - 12,72 : 1
    backgroundColor: "transparent"
    textColor: "{colors.paafod}"
  knap--tekst-moerk:      # moerk flade (--fod) - 5,94 : 1
    backgroundColor: "transparent"
    textColor: "{colors.paafod2}"
  knap--frem:             # tekstvaegtens oeverste trin, paa begge flader
    textColor: "{colors.blaek}"          # paa lys - 12,72 : 1
    textColorOnDark: "{colors.accent}"   # paa moerk - 9,19 : 1 (L76 tillader det)
  knap--maerkat:          # kortets mikroplade - 4,74 : 1
    backgroundColor: "{colors.bund}"
    textColor: "{colors.stoev-blaek}"
    fontSize: "9.5px"
    fontWeight: 700
    letterSpacing: "0.13em"
    height: "24px"
  knap--kryds:            # ikon-kvadrat, arver forgrunden fra sin chip
    textColor: "inherit"
    height: "18px"
  knap-hover:
    # ÉN gestus for hele familien: kassen fyldes med afmaerkningsgul, og
    # teksten gaar til blaek - 9,19 : 1, uanset udgangsflade.
    backgroundColor: "{colors.accent}"
    textColor: "{colors.blaek}"
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

Kataloget er i dag sprogroden. Forsiden med hero og yderpunkter, som tidligere
udgave af denne fil beskrev udførligt, **er slettet** (L72, 1. sep 2026,
`spor/oversigt`) — `dist/da/index.html` er nu selve katalogsiden (86 kort,
0 forekomster af ordet "hero"). De komponentbeskrivelser hører historien til, se
noten i bunden af *Komponenter*.

**Undtagelsen er EU-fundet, og den skal læses, før nogen tror andet: komponenten
er IKKE slettet.** `.eu-fund-linje` / `.eu-fund-tal` overlevede forsidens
sletning ved at blive genbrugt på **producentfladen**, hvor den bærer CE-opgørelsen
for hele producentens modelrække. Målt 3. sep 2026 på `main`: **50 af 50**
producentsider trykker klassen (`grep -l "eu-fund-linje" dist/{da,en}/producenter/*/index.html`),
og den bygges af `tools/skabelon/producent.mjs:212` med fire regler i
`assets/generator.css`. Genbruget er bevidst — `producent.mjs:195-196` skriver, at
den bruger *"samme CSS-klasser … fremfor at opfinde en producent-specifik
variant"*.

Denne fil førte komponenten som slettet **to steder** indtil 3. sep 2026, mens
den stod på 50 sider. Fejlen er rettet her og i *Slettede komponenter*, og
**hullet bagved er lukket samme dag: se `## Komponenter` → *Producentfladen*
(DP2)**, som beskriver fladens otte klasser og afgør EU-fundets to målte
defekter. Her stod indtil da, at der ingenting stod.

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

**Knappen fulgte 2. sep 2026 med L77** (`spor/knap`): elleve knapudtryk er
foldet til én primitiv, `.knap`, med varianter. Tilbage står de uafgjorte
punkter 3, 6 og 8 i `## Konflikter`.

**Nøglekarakteristika:**

- Ét ord for systemet i koden: **eloxeret plade**, stansede felter, ingen skygge
- Fire flader, ingen mørk tilstand i selve sitet: bund, panel, roligt indfelt, hul
  — men fem forskellige tokennavne deler i dag værdien `#E8EBED`, se *Farver*
- Fire datatilstande, der ikke deler skriftgrad, bogstavform, flade eller mærke
  (uændret fra ORBIT — TYPESKILT rørte paletten, ikke denne regel)
- Tal sættes i mono med tabulære cifre; sætninger sættes aldrig som tal
- 10,5 px er skriftgulvet for tekst, der bæres alene — se *Typografi → Hierarki*
- Ingen købsknap, ingen prisforespørgsel, ingen "featured" — formen findes ikke

## Fladernes MODE — DP3, designplanen 3. sep 2026

**Hver flade har ét af to succeskriterier, og det skal navngives, hver gang
fladen bygges, bedømmes eller får et brief.** CLAUDE.md har krævet det siden
1. sep 2026; **denne fil nævnte det ikke med ét ord indtil designplanen**, og
designsystemet og arbejdsreglen talte derfor ikke sammen. Det er hul H2 i
`fund/ANALYSE-produkort.md`.

**Konsekvensen af ikke at have det: alle flader blev bedømt ens.** En Read-flade,
dømt efter Operate-kriteriet, får de forkerte anmærkninger — og omvendt.
**Et fund uden et MODE er en smagsdom.**

### Operate — den besøgende løser en opgave

Succes: **opgaven er løst, og læseren kan SE, at den blev det.**

- Enhver betjening har en synlig tilstand, og en standardtilstand må aldrig
  tegnes som et brugervalg.
- Resultatet af en handling skal kunne ses uden at rulle.
- **Tæthed slår luft.** En Operate-flade må pakke; det er ikke en fejl, at
  betjeningen fylder toppen af skærmen — det er fladens emne.
- Fejl, der skal jages her: en betjening, hvis tilstand ikke kan ses; et
  resultat, der flytter sig ud af syne; et filter, der ikke kan fortrydes.

**Operate-flader:** katalogsiden (`/<sprog>/`, sprogroden), sammenligningssiden,
producentindekset (`/producenter/`) og 404-siden. **Den mindst sikre af dem er
404** — den har ét job (kom videre), men er ikke en arbejdsflade; kald den
Operate, indtil nogen har en bedre grund.

### Read — den besøgende skal forstå noget

Succes: **læseren forstår, hvad vi ved — OG hvad vi ikke ved.**

- De fire datatilstande skal kunne skelnes på et blik. Det er fladens
  vigtigste krav, ikke et tilgængelighedskrav ved siden af.
- Et tal uden proveniens er en fejl på en Read-flade, også når tallet er rigtigt.
- **Rytme slår tæthed.** Linjelængde, ottetalsskalaen og hierarkiet vejer mere
  end at få meget med.
- Fejl, der skal jages her: et hul, der ligner et nul; et tal uden kildemærke;
  navigation, der fylder mere end emnet.

**Read-flader:** robotsiden, producentsiden og Om os.

### Reglen om fladens eget emne — gælder Read

**På en Read-flade skal de sektioner, der handler om fladens EGET emne,
tilsammen fylde mere end halvdelen af fladens højde ved 1440px.**

Halvdelen er en **beslutning**, ikke en måling — den er valgt, fordi den kan
afgøres uden fortolkning, og fordi et flertal er den svageste tærskel, der
stadig betyder noget. Argumentér gerne imod tallet; men afvis ikke et fund med,
at der ingen tærskel er. Det var netop fraværet af én, der gjorde F3 til en
observation frem for en fejl.

**Målt af `spor/produkort` ved 1440px, og reglen er brudt i dag:** på
producentsiden handler **31 %** af Xiaomis side og **42 %** af Unitrees om den
producent, siden er opkaldt efter. Blokken *"Alle 25 producenter"* er
**konstant 1715px** uanset producent — så jo tyndere producenten er, jo mere
handler hendes side om alle andre. Se `fund/PLAN-designarbejde.md`, punkt 1.

## Farver

Paletten er næsten farveløs med vilje: seksten poletter i `:root`, hvoraf tretten
peger på gråtoner eller sort og én bærer al farve (`--accent`, afmærkningsgul).
**Kontrastforholdene nedenfor er genmålt af dette spor** med WCAG's egen
relativitetsformel (ikke kopieret fra den forrige udgave af filen, som beskrev en
anden palet) — og krydstjekket mod de tal, kildens egne kommentarer allerede
angiver (fx `blaek`:`bund` 12,72, `accent` som baggrund for `blaek`-tekst 9,19):
alle stemte.

### Primær

- **Afmærkningsgul** (`#F2C400`): valgte filtre og markørflader — altså accent
  som **baggrund**, med `blaek` ovenpå (9,19 : 1). Som **forgrund** er den
  1,60 : 1 på `panel` og 1,38 : 1 på `bund`, og hvad den derfor må og ikke må,
  afgøres af **Forgrundsreglen** nedenfor — ikke af denne punktopstilling.
  **Tekst PÅ accent er altid `blaek`, aldrig hvid** (hvid = 1,66 : 1). På den
  mørke flade (`blaek`/`fod`) MÅ accent være forgrund — dér er den 9,19 : 1.
  Her stod tidligere, at accent var farven på *links* og *kildemærker*; det er
  den ikke længere. Og her stod indtil designplanen ordet **"fokusring"** midt
  på listen over tilladte brug. Det var forkert, og hvordan det kunne stå der
  uimodsagt i to dage, er hele pointen i Forgrundsreglen. Se punkt 5 i
  `## Konflikter`.
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
- **Støvgrå** (`--hegn` og `--paafod2`, samme værdi `#9AA3A9`): kontur, der kun
  **afgrænser** — inputkant, focus-nabolag. 2,47 : panel, 2,14 : bund.
  **Under WCAG 1.4.11's 3:1-krav**, og derfor må den ikke længere bære en
  oplysning alene. Rettet af `spor/tomstat` (R8, 4. sep 2026): den bærende kant
  har fået sin egen polet, `--hegn-baerende`.
- **Støvgrå 2** (`--hegn-baerende`, `#737F87`): den kant, der SELV er oplysningen
  — i dag `.v-ikke`s ramme og dens 9×9 stiplede firkant. 3,96 : panel,
  **3,43 : bund**, 3,31 mod sit eget fyld `#E4E7EA`. Over 1.4.11's 3,0 mod alle
  tre naboer, og bevidst lysere end teksten (4,74 : bund), så konturen ikke
  konkurrerer med ordet.
- **Rille** (`--linje`, `#C6CCD1`): hårfin skillelinje. Rent dekorativ, 1,56 : panel,
  1,35 : bund — bevidst under kontrastkravet, fordi den aldrig bærer betydning alene.
- **Eloxgrå** (`--bund`, `--panel-ro`, `--accent-ro`, `--paafod`, alle
  `#E8EBED`): pladen selv, roligt indfelt, lys tekst på mørk flade.
  **Fire navne**, én værdi — se *Farvedubletter*.
- **Eloxgrå 2** (`--tom`, `#E4E7EA`): fyldet bag "ikke oplyst", ét trin ned ad
  samme akse. 1,04 : bund. Skilt ud af eloxgrå af `spor/tomstat` (R8): fyld og
  flade var samme hex, 1,00 : 1, og tilstanden var usynlig. **Fyldet kan ikke
  gøres mørkere** — teksten på det står på 4,58 : 1 og har kun 0,08 til kravet.
- **Kridt** (`--panel`, `#FAFBFB`): den løftede flade — kort, striber, tabeller.
- **Lyskant** (`--stans`, `#FFFFFF`): 1px indfældet lyskant i en stansning
  (`.stans`-primitiven). Ny TYPESKILT-token uden ORBIT-modstykke.

### Mørk flade

- **Gunmetal som mørk flade** (`--fod`, samme værdi som `--blaek`): billednoten
  øverst, sidefoden.
- **Eloxgrå på gunmetal** (`--paafod`): lys tekst på mørk bund. 12,72 : 1.
- **Støvgrå på gunmetal** (`--paafod2`): dæmpet tekst på mørk bund. 5,94 : 1.

### Forgrundsreglen for `--accent` — DP1, designplanen 3. sep 2026

**Denne regel afløser L76's tekstregel. Den siger det samme og mere: L76 dækkede
`--accent` som TEKSTfarve, og alt andet forgrundsbrug faldt udenom.**

Det er ikke en teoretisk mangel. `assets/system.css:343` sætter sidens globale
fokusring til `3px solid var(--accent)`, og på en lys flade er den **1,38 : 1**
mod WCAG 1.4.11's krav på **3,0 : 1**. Ringen tegnes på hvert fokuserbart
element på hele sitet, der ikke selv overstyrer den.

**Og reglen fangede det ikke, fordi den selv listede fejlen som et tilladt
brug.** L76's egen formulering, ordret fra *Lad være* før denne rettelse:
*"accent er baggrund, kant, understregning eller fokusring — aldrig forgrund på
lyst."* En kant er en forgrund. En fokusring er en forgrund. Sætningen
modsiger sig selv i sin egen anden halvdel — den forbød forgrund og gav tre
eksempler på forgrund som undtagelser.

**Den generelle lære, og den koster ingenting at følge: skriv altid, hvilke brug
en tokenregel IKKE dækker.** En regel, der kun nævner det, den forbyder, ser
komplet ud. Havde L76 båret linjen *"denne regel siger intet om kanter,
fokusringe og ikoner"*, var fokusringen fundet samme dag i stedet for to dage
senere. Rækkevidden er en del af reglen, ikke en kommentar til den.

#### Reglen: fem brugstyper, ét kravtal pr. type, én læseretning pr. tal

Et kontrasttal uden en læseretning er ikke et tal. Tallene nedenfor er regnet
med WCAG's relativitetsformel af designplansporet på et apparat, der først blev
valideret mod **15** af denne fils egne offentliggjorte tal — 15/15 stemte.

| # | Forgrundsbrug af `--accent` | Standard | Kravtal | Lys flade (`bund` 1,38 · `panel` 1,60) | Mørk flade (`fod` 9,19) |
|---|---|---|---|---|---|
| 1 | Tekst under 24px (eller under 18,66px fed) | WCAG 1.4.3 AA | **4,5 : 1** | **FORBUDT** | tilladt |
| 2 | Stor tekst — ≥24px, eller ≥18,66px fed | WCAG 1.4.3 AA | **3,0 : 1** | **FORBUDT** | tilladt |
| 3 | Fokusindikator: `outline`, `border-color` eller `box-shadow`, der markerer fokus | WCAG 1.4.11 | **3,0 : 1** | **FORBUDT alene** | tilladt |
| 4 | Betydningsbærende kant, ikon eller markør, hvor formen ALENE bærer oplysningen | WCAG 1.4.11 | **3,0 : 1** | **FORBUDT** | tilladt |
| 5 | Rent dekorativ forgrund, hvor betydningen bæres af noget andet i samme element — fx en understregning under en `blaek`-tekst, en hover-tone, en fuge | ingen | — | **tilladt** | tilladt |

To ting, reglen IKKE rører, så ingen læser dem ind i den:

- **Accent som BAGGRUND er altid tilladt**, på begge flader. Tekst ovenpå er
  altid `blaek` (9,19 : 1), aldrig hvid (1,66 : 1).
- **`--accent-ro` er ikke accent.** Den peger på `#E8EBED` og er en flade.

#### De tre spørgsmål, reglen skal kunne besvare uden fortolkning

1. **Må accent være fokusring på `--bund`?** **Nej.** Type 3, lys flade,
   1,38 : 1 mod kravet 3,0.
2. **Må accent være fokusring på dækket?** **Nej — og af en grund, der er værd
   at læse.** Der findes ikke noget farvetoken ved navn `--daek`; målt:
   `grep -c -- "--daek:" assets/system.css` giver **0**. `.daek`
   (`system.css:512`) sætter ingen baggrund og arver `--bund`. **Dækket er en
   LYS flade**, så spørgsmålet er identisk med spørgsmål 1. Det er i praksis
   allerede en levende fejl: `.daek__nav a:focus-visible` (`system.css:576`)
   ændrer kun offset og arver den globale accentring.
3. **Må accent være brødtekst nogen steder?** **Ja — men kun på den mørke
   flade** (`--fod`/`--blaek`), hvor den er 9,19 : 1. Aldrig på lyst, uanset
   skriftgrad: 1,60 : 1 klarer ikke engang type 2's 3,0.

#### DP1b — hvad fokusringen SKAL være

**Én ring, to fladevarianter. Samme grammatik som knappen fik med L77, hvor
`-moerk` står i navnet, så den forkerte flade ikke kan vælges ved et uheld.**

| Flade | Ringens farve | Kontrast mod fladen | Krav |
|---|---|---|---|
| `--bund` (`#E8EBED`) | `--blaek` | **12,72 : 1** | 3,0 |
| `--panel` (`#FAFBFB`) | `--blaek` | **14,69 : 1** | 3,0 |
| `--fod` / `--blaek` (`#22262A`) | `--accent` | **9,19 : 1** | 3,0 |

Mekanikken, så et byggespor ikke skal gætte: **ét semantisk alias, `--ring`.**
Det tilfører ingen farve — paletten er låst, og aliaset peger på primitiver, der
allerede findes, præcis som de 16 semantiske tokens gør i dag.

```css
:root{ --ring: var(--blaek) }                 /* den sikre standard */
:focus-visible{ outline:3px solid var(--ring); outline-offset:3px;
                border-radius:var(--hjoerne) }
.sidefod, .billednote, .klaebebar{ --ring: var(--accent) }   /* mørke flader */
```

**Standarden skal være den lyse**, fordi sitet er lyst: en mørk flade, der
glemmer sit `--ring`, er få og findes ved gennemgang; en lys flade, der glemmer
det, er 200+ sider.

**Systemet har allerede svaret, og det er halvvejs bygget.** Målt over begge
stilark: **fem** fokusregler tegner allerede ringen i `--blaek` — `.rk__felt`
(`generator.css:1409`), `.chip__felt` (`:1449`), `.sortervalg input` (`:1496`),
`.skala__greb` (`system.css:2222`) og `.knap--maerkat` (`:2716`). **Otte** tegner
den i `--accent`, hvoraf **syv står på lys flade** og er ulovlige: den globale
(`system.css:343`), `summary.facet__navn` (`:2368`), `.stribe-under-fold >
summary` (`generator.css:964`), `.skema > summary` (`generator.css:1058`, hvis
flade er `--panel`, `:1045`) og **enhedskontaktens tre kopier**
(`system.css:2022`, `:2566`, `:2811`). Den ottende, `.klaebebar__gaa/__ryd`
(`system.css:2483`), står på `--fod` og er **lovlig**. Dertil én
`border-color`-indikator, `.sog input:focus-visible` (`system.css:1524`), som er
type 3 på lys flade.

> **RETTELSE 3. sep 2026, af samme spor som skrev afsnittet.** Der stod
> *"Fem tegner den i `--accent`, hvoraf fire står på lys flade"*. Målt med
> `grep -nE "outline:[^;}]*solid var\(--accent\)" assets/system.css
> assets/generator.css`: **8**, ikke 5. De tre oversete er tre kopier af den
> samme regel på enhedskontakten — `.typeskilt .enhedsskift` (2022),
> `.daek__enhed .enhedsskift` (2566) og `.sammenligning-app .enhedsskift`
> (2811). `.daek` sætter ingen egen baggrund (`system.css:512-515`) og arver
> `--bund`, så ringen dér er de samme **1,38 : 1**. Byggesporet skal måle, om
> 2811 overhovedet kan nås — `.sammenligning-app .enhedsskift` er
> `display:none` på `system.css:2557` — og skrive svaret, i stedet for at
> antage det.

**Fravalgt alternativ, skrevet ned så det ikke skal genopfindes: den tofarvede
ring** — et indre accentbånd og en ydre gunmetalring, hvor accent læses mod
gunmetal (9,19) frem for mod siden. Den bevarer accenten i fokus og overholder
kravet. Den er fravalgt, fordi den kræver en anden tegnemekanisme ved siden af
`outline` (`box-shadow`), og sitet har allerede tre steder, der slås med
klipning ved hjælp af **negativ** `outline-offset` (`.daek__nav a` −3px,
`.skema > summary` −3px, `.klaebebar` tegner udad med 2px netop for at undgå
det). Et `box-shadow`-bånd følger ikke en negativ offset og ville knække præcis
dér. Dertil: *"Ingen slagskygge findes på siden"* gør `box-shadow` til en ladt
mekanisme i dette system.

#### Acceptkriterier for DP1 — et byggespor kan sendes på dem

- **AK1a.** `grep -cE "outline:[^;}]*solid var\(--accent\)" assets/system.css
  assets/generator.css` giver **0** for begge filer. Kontrafaktisk: uden
  rettelsen giver samme kommando **6** og **2**, i alt **8**.
  **Her stod tallet 4, og det var forkert** — det talte fem regler, hvoraf
  enhedskontaktens tre kopier manglede. Se rettelsen i DP1b ovenfor.
  Brug den snævre form: `grep -n "solid var(--accent)"` giver **10**, fordi
  to `border-bottom`-erklæringer (`generator.css:1251, 1349`) også matcher.
  De er ikke fokusringe og må ikke røres.
- **AK1b.** `grep -c -- "--ring" assets/system.css` er **≥ 2** (definitionen i
  `:root` og den globale ring), og hver mørk flade, der kan indeholde et
  fokuserbart element, sætter `--ring:var(--accent)`. Byggesporet skriver
  antallet af mørke flader, det fandt, og lister dem — tallet måles, det
  forudsiges ikke her.
- **AK1c.** Målt i browseren på en bygget lys side: `outline-color` på et
  fokuseret navigationslink i dækket er `rgb(34, 38, 42)`, og kontrasten mod
  `rgb(232, 235, 237)` er **12,72**. Kontrafaktisk: slår rettelsen ikke igennem,
  rapporterer samme script `rgb(242, 196, 0)` og **1,38**.
- **AK1d.** `.sog input:focus-visible` bruger ikke længere `--accent` som
  `border-color` på lys flade.

**DP1 er en beslutning i designplanen, ikke en L-post.** Accepterer JPK planen,
hører den hjemme i STATUS.md med sit eget L-nummer; indtil da står den her som
det, planen har besluttet, og et byggespor kan sendes på den.

### Navngivne regler

**Reglen om rækkevidden.** Enhver regel om et token skal skrive, hvilke brug den
IKKE dækker. Se Forgrundsreglen ovenfor for prisen, da den linje manglede.

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

Skalaen (klemmerne, ikke skrifterne) er ved 1440 px
76 / 46 / 34 / 19 / 17 / 15 / **14** / 13 / 11,5 px. **Vægten på Hero er rettet fra
800 til 700** (`spor/kort`, 31. aug 2026): Saira selvhostes kun i 400/500/600/700,
og en manglende 800 tvang browseren til at SYNTETISERE fed skrift, hvilket gav en
ujævn streg i store grader.

**14 px — trinet "Række" — er tilføjet af designplanen 3. sep 2026 (DP3b).
Det er ikke et nyt trin; det er et trin, der var i brug og manglede et navn.**
Se afgørelsen nedenfor.

- **Hero** (700, `clamp(33px,6.2vw,76px)`, 0,98, −0,035em, Saira):
  206 sider bruger klassen i dag — ikke kun en forside, der ikke længere findes.
- **H1** (700, `clamp(27px,3.6vw,46px)`, Saira): robotnavnet på
  robotsiden bruger sin egen, større regel — `clamp(40px,7.2vw,84px)`, 700,
  nu `--mono` (Saira), som resten af siden.
- **H2** (700, `clamp(23px,2.8vw,34px)`): sektionshoveder.
- **H3** (700, 19px).
- **Brød** (400, 17px, 1,6, `blaek2`, Saira via nedarvning fra `body`).
- **Lille** (400, 15px, 1,55, `blaek2`).
- **Række** (500–600, 14px, 1,5): **navnet på eller indholdet i én række i en
  tæt liste eller tabel**, hvor 15px er for løst og 13px for stille. Tilføjet
  som navngivet trin af DP3b; se afgørelsen nedenfor.
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

### DP3b — det trin, skalaen manglede, og som allerede fandtes

**Spørgsmålet, der blokerede et spor.** `fund/PLAN-klaebebar.md` §10 kunne ikke
afgøre klæbebarens navne-skriftgrad: *"14 px findes ikke i DESIGN.md's skala,
men 11,5 px (`label`) er for lille … Der mangler et trin, og at vælge det er en
systembeslutning, ikke en bjælkebeslutning."*

**Målt af designplanen, og svaret er ikke det forventede.**

```
grep -ohE "font-size:[^;}]+" assets/system.css assets/generator.css | sort -u | wc -l
```

giver **56** unikke `font-size`-værdier — og `font-size:14px` optræder **10**
gange, hvoraf 9 er levende regler (den tiende står i en L77-kommentar).
**14 px er altså sitets syvende mest brugte skriftgrad**, ikke en
enkeltstående afvigelse. De ni er `.spring` (353), en spatieret versaletiket
(522), `.stribe--intet p` (939), `.udtraek .chip__navn` (1597),
`.skema-tabel` (2074) og `.klaebebar__navne` (2459) i `system.css`, samt
`.saml-matrix` (570), `.plade__under` (1279) og `.rk__navn` (1421) i
`generator.css`.

**Fem af de ni er den samme ting: et navn eller en celle i en tæt række.**
`.rk__navn`, `.chip__navn`, `.klaebebar__navne`, `.skema-tabel`,
`.saml-matrix`. Det er en rolle, ikke et tilfælde, og den havde ikke et navn.

**Afgørelsen: trinet hedder "Række" og er 14 px. Der tilføjes INGEN ny
størrelse — der sættes et navn på en, der bruges ni gange.** At vælge 15 px
(Lille) i stedet ville have flyttet klæbebaren op på et trin, den ikke deler
med nogen anden tæt række, og efterladt de ni brug uforklarede. Fravalgt.

**Og planen retter en fejl i sit eget forlæg:** §10 skriver, at *"14 px og
13 px"* ikke er navngivne trin. **13 px ER et navngivet trin** — det hedder
*Mikro* og står i listen ovenfor. Fejlen opstod, fordi `typography:`-blokken i
frontmatter kun navngiver **7** roller (display, headline, title, body, label,
figur, manual), mens prosaen navngiver **9** trin. **Frontmatter og prosa har
ikke været enige om, hvor mange trin skalaen har**, og et spor, der læser den
ene, får et andet svar end et spor, der læser den anden.

**Reglen, der lukker den fælde: frontmatter skal navngive hvert trin, prosaen
navngiver.** Manglende i dag: H3 (19), Lille (15), Række (14), Mikro (13).

#### Svaret til klæbebar-sporet, så det kan sendes uden at spørge

**Robotnavnene i klæbebaren er 14 px, vægt 600 — trinet "Række".** Under
460 px falder de til 13 px, trinet *Mikro*. **Begge værdier er dem, koden har i
dag** (`system.css:2459`); det, der manglede, var ikke en anden værdi, men
hjemmel til den. **Acceptkriterium DP3b:** klæbebar-sporet kan bygge Retning B
uden at ændre en eneste `font-size` — og hvis det ændrer én, skal det stå i
rapporten som en afvigelse fra denne beslutning.

**Det legitimerer ikke de 56.** At skære skalaen ned er et selvstændigt spor
over hele sitet (`impeccable typeset`), og det står i `fund/PLAN-designarbejde.md`.
DP3b gør præcis én ting: den fjerner den usikkerhed, der blokerede ét spor.

### DP3c — skriftgulvet får en rækkevidde

**Skriftgulvet på 10,5 px er brudt af systemets egne komponenter, og reglen
gjorde det umuligt at se forskel på et brud og en undtagelse.**

Målt: `font-size:8px` (`generator.css:452`) og `font-size:7px`
(`generator.css:748`) på `.saml-fotofelt__ord`, plus **10** erklæringer af
formen `max(8px, …em)` — kildemærket, operatoren, enheden. Uden en rækkevidde
er alle 12 lige store brud, og så er ingen af dem det.

**Reglen, omskrevet:** 10,5 px er gulvet for **tekst, der bæres alene** — et
ord, en sætning, en etiket, et navn. **Undtaget er tegn, der læses SAMMEN med
en figur, de sidder på:** det hævede kildemærke, operatoren foran et tal og
enheden efter det. De har `max(8px, …em)`-form, netop for at følge figuren og
aldrig stå alene. Undtagelsen er en **liste, ikke et princip** — en ny
komponent kan ikke skrive sig ind i den ved at ligne den.

**`.saml-fotofelt__ord` er dermed et ægte brud, ikke en undtagelse:** det er et
ord ("ikke oplyst"-teksten i sammenligningens fotofelt), det står alene, og
det er 8 px — 7 px i den smalleste ombrydning. **Acceptkriterium DP3c:**
`.saml-fotofelt__ord` er mindst 10,5 px ved alle bredder, eller ordet er
erstattet af tilstandsalfabetets stiplede firkant uden tekst. Kontrafaktisk:
i dag rapporterer `grep -c "font-size:[78]px" assets/generator.css` **2**;
bagefter **0**.

### Navngivne regler

**Reglen om versaletiketten.** Den spatierede versaletiket må kun navngive en
datagruppe eller en enhed — aldrig en indholdstom optakt over en overskrift.

**Reglen om mono.** Mono og fed hører til tal, aldrig til en sætning.

**Skriftgulvet.** 10,5 px er den mindste skriftgrad for tekst, der bæres alene,
også i den smalleste ombrydning. Rækkevidden og de to undtagelser står i DP3c
ovenfor.

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

### Knapper — én primitiv, `.knap` (L77, 2. sep 2026)

**Her stod indtil 2. sep 2026, at sitet havde to knapgenerationer og
"mindst tre yderligere" navne, som ikke var efterprøvet. De blev talt:
der var ELLEVE knapudtryk.** Nu er der ét. Grundformen taler TYPESKILT —
mono, versaler, spærret, `--hjoerne`.

**Retningen er ikke valgt efter udbredelse.** `.videre` stod på 158 sider
og `.nulstil` på 2; udbredelse er et mål for oprydningens størrelse, ikke
et argument for en retning.

**Grundformen bærer ingen farve**, og det er systemets vigtigste regel om
knapper. `.knap` sætter `color:inherit` og `background:transparent`, så en
knap uden flade-variant arver den flade, den står på. Den kan derfor aldrig
blive usynlig ved et uheld — hvilket den kunne før: `.nulstil` var skrevet
til den mørke flade, og genbrugt på lys bund målte den **1,16 : 1**.

**Fladen vælges ved navn.** Tre vægte gange to flader:

| | lys bund (`bund`/`panel`) | mørk flade (`fod`) |
|---|---|---|
| **Fyldt** | `.knap--fyldt` — 14,69 : 1 | *findes ikke endnu, se nedenfor* |
| **Kant** | `.knap--kant` — 12,72 : 1 | `.knap--kant-moerk` — 12,72 : 1 |
| **Tekst** | `.knap--tekst` — 4,74 : 1 | `.knap--tekst-moerk` — 5,94 : 1 |

**Ingen af dem er standarden, og ordet `-moerk` i klassenavnet ER værnet:**
den forkerte flade kan ikke vælges uden at have skrevet ordet.

- **`.knap--frem`** er tekstvægtens øverste trin, når to tekstknapper står
  side om side og den ene er handlingen og den anden fortrydelsen: `blaek`
  på lys (12,72 : 1), `accent` på mørk (9,19 : 1 — L76 tillader udtrykkeligt
  accent som tekst dér).
- **`.knap--maerkat`** er kortets mikroplade, 9,5px/24px, dæmpet
  `stoev-blaek` på `bund` (4,74 : 1), gul når `aria-pressed="true"`.
  Bevidst dæmpet: den står på 77 kort samtidig.
- **`.knap--kryds`** er ikon-kvadratet, 18×18. **Den eneste variant uden
  flade i navnet**, og det er pointen: den sætter ingen forgrund, så den
  arver chippens. På den gule `.valg`-chip giver arven blæk på gul,
  9,19 : 1, uden at nogen har skullet vide det.

**Hover er én gestus i hele familien:** kassen fyldes med afmærkningsgul, og
teksten går til blæk — 9,19 : 1, uanset udgangsflade. Tekstvægtene har ingen
kasse at fylde og skifter forgrund i stedet. Undtaget er `.knap--maerkat`
(gul betyder dér *afsat*, ikke *musen er her*) og `.knap--kryds` (dens
hvileflade ER gul).

**Den fyldte vægt på mørk flade findes bevidst ikke endnu.** Ingen af de
elleve knapper havde den, og en variant uden brugssted er død CSS
(`tests/dele/57`). Pladsen er udmålt til den dag en flade behøver den:
`background: paafod`, `textColor: blaek`, 12,72 : 1.

**Der findes ingen købsknap, ingen demoknap, ingen prisforespørgsel.**
Primitiven må ikke bruges til at indføre formen.

`tests/dele/70-knap.mjs` vogter det hele: at de pensionerede klasser ikke
kommer igen, at hver `<button>` på sitet bærer `.knap`, at grundformen
forbliver farveløs, og at hver variant holder 4,5 : 1 — med kontrasten
**regnet i testen** fra tokenernes hex, ikke afskrevet fra en kommentar.

### Fokusringen

Ringen er en **farveregel**, ikke en komponent med egen form, og den står derfor
i fuld længde under `## Farver` → **Forgrundsreglen for `--accent`**, punkt
**DP1b**. Kort: 3px, `outline-offset` 3px, `--hjoerne` som radius, og farven
kommer fra aliaset `--ring` — `--blaek` på lys flade (12,72 / 14,69),
`--accent` på mørk (9,19). **Skriv aldrig ringens farve direkte i en regel.**

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
  `blaek3` på `tom`-flade (`#E4E7EA`, 4,58 : 1 for TEKSTEN på FYLDET), stiplet
  **`hegn-baerende`**-kant (3,43 : 1 for KANTEN på BUNDEN), 9×9px stiplet
  firkant i samme farve. **Kanten, ikke fladen, er den, der bærer tilstanden**
  — R8, `spor/tomstat` 4. sep 2026: et fyld mørkt nok til WCAG 1.4.11 gør ordet
  ulæseligt, og det gælder hele paletten, ikke kun denne tone.
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

Forsiden (`hero`, `yderpunkterne`, `formålsfilteret`) er **slettet** (L72,
1. sep 2026, `spor/oversigt`). Den forrige udgave af denne fil brugte omkring
250 linjer på at beskrive dem som levende komponenter, inklusive et ændringslog
tilbage til 24. aug 2026. Det er nu arkiv — se git-historikken for `DESIGN.md`
før dette spor, eller `fund/FUND-kortramme.md` for en analyse af hvad der skete,
da `.yderpunkt`s billedrettelse ikke fulgte med til `.net`-kortet.

**`EU-fundet` stod på denne liste indtil 3. sep 2026 og hørte aldrig til her.**
Komponenten lever på producentfladen — 50 af 50 byggede producentsider, målt på
`main` — og listen sagde det modsatte. En agent, der slog EU-fundet op for at
finde ud af, hvordan det skulle se ud, fik ét svar: *"den er slettet."*

**En slettet-liste er farligere end et manglende afsnit**, fordi den besvarer
spørgsmålet i stedet for at lade det stå åbent. Skriv derfor aldrig en komponent
på denne liste uden først at måle den i `dist/`:

```
grep -rl "<klassenavn>" dist/da/ dist/en/ | wc -l     # skal give 0
```

### Producentfladen — DP2, designplanen 3. sep 2026

**Hullet blev noteret 3. sep 2026 af `spor/produkort` (`fund/ANALYSE-produkort.md`,
hul H1) og lukkes her.** Her stod indtil designplanen kun en note om, at
afsnittet manglede.

**MODE: Read.** Den besøgende skal **forstå** noget om en producent, ikke løse
en opgave. Fladens ene berettigelse, ordret fra `producent.mjs`' eget hoved:
*"at vise CE-oplysningen SAMLET for hele producentens modelrække. Ét 'ikke
oplyst' er en tom rubrik; tolv under hinanden er en oplysning om producenten."*
Read-kriteriet er derfor: **kan læseren forstå, hvad vi ved om denne producent —
og hvad vi ikke ved?** Alt på fladen dømmes efter det, ikke efter Operate's
"kan opgaven løses hurtigt".

**Ingen betjening.** Målt af `fund/PLAN-producent.md` 6.1: **0** `.knap`,
**0** `<button>`, **0** `<form>` på begge producentflader. Det er fladens
reneste overholdelse af hård begrænsning 1, og det er en **egenskab, ikke et
tilfælde** — en fremtidig knap på denne flade skal begrundes, ikke bare
tilføjes.

#### De otte klasser

| Klasse | Hvor | Hvad den er |
|---|---|---|
| `.eu-fund-linje` | `generator.css:24` | CE-opgørelsens linje. `display:flex`, `flex-wrap`, `align-items:baseline`, `gap:10px 12px`, `max-width:74ch`. **Er siden 3. sep en LISTE af `<p>`, ikke ét element** — se DP2b |
| `.eu-fund-tal` | `generator.css:28` | Figuren *"n af m"*. `--mono`, tabulære cifre, `clamp(26px,2.6vw,34px)`, 700, `--blaek` |
| `.producent-fakta` | `generator.css:1087` | Headerens faktarække. `flex-wrap`, `gap:var(--r3) var(--r6)`; `dd` 17px/600/`--blaek`; `.figur` 21px/700 |
| `.pnavn` | `generator.css:1099` | Producentnavnet i indekslisten. 16px/600, `flex:1 1 14ch`, `min-height:24px`. `--blaek` siden L76 |
| `.pland` | `generator.css:1104` | Landet. `--mono`, 12px, `--blaek3` |
| `.pantal` | `generator.css:1105` | Modelantallet. `--mono`, 12,5px, `--blaek2` |
| `.prod-navne` | `generator.css:1166` | Modelnavne-cellen i producenttabellen. `width:auto`, `padding-left:var(--r4)`, `--blaek3` med `--blaek`-links. Skjules under 899px |
| `.kort-legende` | **ingen CSS** | Billedlegenden. Målt: `grep -rc "kort-legende" assets/*.css` giver **0** i begge stilark — al form kommer fra `.t-lille`. Klassen bruges to steder (`katalog.mjs:1521`, `producent.mjs:317`) med **hver sin** i18n-nøgle |

**`.kort-legende` er dermed et navn uden en regel.** Systemet har en test mod
død CSS; det har ingen mod en klasse, der er ren markørtekst i HTML'en.
Beslutning: **den beholdes** — den er et fæste, en senere regel kan hænge på,
og at fjerne den ville gøre to flader usporbare med ét grep. Men den skal
**ikke** bruges som forbillede: en klasse uden regel er ikke systemets måde.

#### DP2a — F2: samme datatilstand i to størrelser på samme side

**Målt af `spor/produkort` på Xiaomis side:** `.v-ikke` står to gange og ser
forskellig ud — **11px** i headeren (korrekt), **17px** i EU-afsnittet. Samme
gælder `.v-nej` (skal være 10,5px, fuld `blaek`) og `.v-ja`.

**Årsagen:** `generator.css:30` er `.eu-fund-linje span{font-size:17px;
line-height:1.5;color:var(--blaek2)}`. Specificiteten **0,1,1** slår `.v-nej`s
**0,1,0** (`system.css:646`). Reglen blev skrevet, dengang linjen indeholdt
**præcis én** `<span>` — sætningen. Den er **ældre end** de tilstandsmærker,
`producent.mjs` lægger ind i dag.

**Det er et konsistensbrud, ikke et tilgængelighedsbrud.** `blaek2` på `bund`
er 5,68 : 1 mod AA's 4,5 — og de 9×9px firkanter måler korrekt, så hård
begrænsning 5 er opfyldt. Det er systemets **typografi**, der skrider, ikke
tilstandsalfabetet.

**Analysens kandidatrettelse er FRAVALGT — diagnosen er rigtig, løsningen er
det ikke.** Kandidaten var tre nye, mere specifikke regler
(`.eu-fund-linje span.v-nej{font-size:10.5px;color:var(--blaek)}` osv.). Den
slår specificitet med mere specificitet og **skriver de fire tilstandes
værdier af i hånden et sted mere.** Ændres `.v-nej` fra 10,5px, divergerer
kopien tavst, og ingen test fejler. Det er nøjagtig fælden, denne fil selv
navngiver: tre håndskrevne kopier divergerer ved den fjerde.

**Valgt løsning: flyt erklæringen fra barnet til forælderen.**

```css
/* var: .eu-fund-linje span{...}   — rammer ogsaa tilstandsmaerkerne */
.eu-fund-linje{font-size:17px;line-height:1.5;color:var(--blaek2); /* + de nuvaerende flex-egenskaber */}
```

**Hvorfor det virker uden en specificitetskamp: en ARVET værdi taber altid til
en direkte erklæring, uanset specificitet.** Sætningens klasseløse `<span>`
arver 17px/`blaek2`; `.v-nej`, `.v-ikke`, `.v-ja` og `.v-billede` har deres
egne direkte erklæringer i `system.css` og vinder dermed af sig selv. Ingen ny
klasse, ingen kopi, ingen ny regel at holde ved lige. `.eu-fund-tal` og `.ikon`
har egne erklæringer og er upåvirkede; `.mrk` er px-sat overalt
(`system.css:648, 653, 695, 703`), så firkanterne rører sig ikke.

**Følgen, som skal skrives frem, fordi den ikke er nul:** `.v-ja` er
`font-size:.62em` (`system.css:651`) og bliver dermed 0,62 × 17px =
**10,54px** — lige over skriftgulvet på 10,5px, og på linje med headeren, hvor
`.producent-fakta dd` også er 17px. **Den underliggende uenighed består:**
`.v-nej` (646) og `.v-ikke` (692) er fast px, `.v-ja` og `.v-billede` er em. DP2a løser
symptomet på denne flade; **px/em-splittet i tilstandsfamilien er stadig
uafgjort** og står i `## Konflikter` som punkt 9.

**Acceptkriterium DP2a:** målt i browseren på en bygget producentside med
mindst to CE-tilstande — `.eu-fund-linje .v-nej` er **10,5px** og
`rgb(34, 38, 42)`; `.eu-fund-linje .v-ikke` er **11px** og `rgb(95, 104, 111)`;
sætningens `<span>` er stadig **17px** og `rgb(84, 92, 99)`. Kontrafaktisk:
uden rettelsen rapporterer samme script **17px** og `rgb(84, 92, 99)` for alle
tre. Og: `grep -c "eu-fund-linje span" assets/generator.css` giver **0**.

#### DP2b — H4: hvad der sker, når en komponent bliver en liste

`.eu-fund-linje` blev designet som **ét** element og er siden 3. sep 2026 en
**liste** af op til tre `<p>` (`producent.mjs:253`). `p{margin:0}`
(`system.css:300`) gælder, så blokkene støder op mod hinanden.

**Målt af `spor/produkort` ved 390px:** **10px** inde i én tilstandsblok (fra
tallets bund til den ombrudte sætning), **0px** mellem to blokke. **Nærheden
grupperer modsat af meningen.** Ved 1440px ombrydes intet, hver blok er 53px,
og problemet findes ikke — det er altså en ombrydningsfejl, ikke en
grundfejl. **0px er heller ikke et trin på ottetalsskalaen**, og denne fil
siger *"Gør rummet fra ottetalsskalaen."*

**Reglen om det gentagne blokelement — den gælder alle komponenter, ikke kun
denne.** Når en komponent, der var ét element, bliver til en liste, skal
afstanden **mellem** to forekomster være **mindst ét trin over den største
afstand inde i** én forekomst, og begge skal komme fra ottetalsskalaen. Ellers
læses listen som én blok med tilfældige ombrydninger.

**Anvendt her:** største indre afstand er `gap`ens **12px**; nærmeste trin over
er `--r4` = **16px**.

```css
.eu-fund-linje + .eu-fund-linje{margin-top:var(--r4)}
```

**Acceptkriterium DP2b:** målt ved 390px på en producentside med mindst to
CE-tilstande — afstanden mellem to `.eu-fund-linje` er **16px**, og den er
større end enhver afstand inde i en enkelt blok. Kontrafaktisk: uden rettelsen
rapporterer samme måling **0px**. Ved 1440px må målingen af blokkenes højde
være uændret på nær de 16px.

**DP2 er en beslutning i designplanen, ikke en L-post** — samme forbehold som
DP1.

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
- **Lad være** med at bruge `--accent` som **forgrund** mod en lys flade —
  tekst, kant, fokusring, ikon eller markør. Her stod indtil designplanen
  *"accent er baggrund, kant, understregning eller fokusring — aldrig forgrund
  på lyst"*, og de tre eksempler modsagde reglen: en kant og en fokusring ER
  forgrunde. Se **Forgrundsreglen for `--accent` (DP1)** under *Farver* for
  kravtallet pr. brugstype. På den mørke flade må accent være forgrund
  (9,19 : 1).
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

**Fem af dem er afgjort nu.** Punkt 3, 6 og 8 er uafgjorte og uberørte, og
designplanen har 3. sep 2026 tilføjet **punkt 9**, som også er uafgjort.
Punkt 5 er genåbnet og afgjort bredere — se noten dér.

**1. Knappen — to generationer. AFGJORT af L77 (2. sep 2026).**
Konflikten var: `.videre`/`.videre--stille` (158/142 sider, talt i `dist/`)
var ORBIT-æraens knapprimitiv, stadig i brug. `.nulstil` (2 sider) var en
nyere, anden knapklasse. Plus "mindst tre yderligere sidespecifikke
knap-lignende klasser, hver brugt ét sted — navnene er ikke enkeltvis
efterprøvet". Kildens egen kommentar kaldte `.videre` "den eneste knapform
på sitet"; det stemte ikke.

**De blev talt, og de var ikke tre, men ni:** `.nulstil`, `.kort__saml`,
`.valg__fjern`, `.saml-taeller__ryd`, `.saml-taeller__gaa`,
`.specimen__fjern`, `.saml-invit__link`, `.klaebebar__ryd` og
`.klaebebar__gaa`. **Elleve udtryk i alt** med `.videre` og
`.videre--stille`.

**Afgørelsen: ÉN primitiv, `.knap`, med varianter, og grundformen taler
TYPESKILT.** Se *Komponenter → Knapper* for systemet. De to ting, der
gjorde konflikten dyr, er lukket ved roden:

- **Grundformen er farveløs.** Der findes ikke længere en "forkert flade,
  man får ved et uheld". `.nulstil` var skrevet til mørk flade; genbrugt på
  lys bund gav den 1,16 : 1, og *to* forsøg på at rette det slog fejl, fordi
  reglen skulle vinde en specificitetskamp mod en klasse 700 linjer længere
  nede i filen. Begge de neutraliserende regler er nu slettet — der er
  ingenting at neutralisere.
- **Fladen står i klassenavnet.** `-moerk` kan ikke udelades ved et uheld.

Regnskabet: 11 udtryk → 1 primitiv + 8 varianter, hvoraf 6 er flade-vægte.
414 elementer i `dist/` bærer `.knap`; 180 af 180 `<button>` gør.
`.f-sort` overlevede uændret og er **ikke** en knap — den er den skjulte
`<input type="radio">`, sorteringen hænger på; dens `<label>` er det
synlige. Den stod på briefets liste over elleve ved en fejl.

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

**3. Farvedubletter. DELVIST LUKKET, 5 → 4.** Flere tokennavne peger på samme
værdi: **4 navne** på `#E8EBED` (`--bund`, `--panel-ro`, `--accent-ro`,
`--paafod`) — `--tom` blev skilt ud af `spor/tomstat` 4. sep 2026 og har nu
`#E4E7EA`,
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

**Punktet blev genåbnet 3. sep 2026 og er nu afgjort igen, bredere. L76 var
rigtig, men dens RÆKKEVIDDE var for smal:** den dækkede accent som *tekst*, og
fokusringen — som er en forgrund, ikke en baggrund — slap igennem på 1,38 : 1 mod
WCAG 1.4.11's 3,0. Værre: L76's egen formulering listede *"fokusring"* blandt de
tilladte brug. **Tallet var kendt hele tiden** — `fund/PLAN-klaebebar.md` §11
fører `--accent` på `--bund` som *"1,38 (ulovlig, L76)"* — men ingen anvendte
reglen på en ikke-tekstlig komponent med et andet kravtal. Se
**Forgrundsreglen for `--accent` (DP1)** under `## Farver`, som afløser L76 og
dækker alle fem forgrundstyper.

**6. `--hegn` som betydningsbærende kant fejler WCAG 1.4.11.** 2,47 : 1 mod
`panel`, 2,14 : 1 mod `bund` — under de 3,0 : 1, standarden kræver til
meningsbærende ikke-tekst-elementer (inputkant, hul-markør). ORBIT-værdien
klarede kravet (3,32–3,68 : 1, jf. den forrige filudgave); TYPESKILTs nye
hex gjorde det ikke.

**Delvist afgjort af `spor/tomstat` (R8, 4. sep 2026).** Det ene sted, hvor
`--hegn` var den eneste bærer af en oplysning — `.v-ikke`s ramme og dens 9×9
firkant — brugte fra da af `--hegn-baerende` (`#737F87`, 3,43 : bund, 3,96 :
panel). `--hegn` selv stod uændret på sine 41 øvrige brugssteder, hvor den kun
afgrænser. To bærere af en oplysning stod dengang stadig tilbage:
`.stribe--intet` (10 sider) og `.typeskilt .maerke--tom` (30 sider), begge på
2,14 : 1 mod bunden.

**AFGJORT af `spor/hegn2` (4. sep 2026).** De to resterende bærere skiftede
samme dag til `--hegn-baerende`: `.stribe--intet` gik fra 2,07 : 1 mod eget
fyld / 2,14 : 1 mod bund til **3,31 : 1 / 3,43 : 1**, og `.typeskilt
.maerke--tom` (38 elementer på de 30 sider) gik fra 2,14 : 1 mod bund til
**3,43 : 1**. `--hegn` selv står nu uændret på sine **40** øvrige
brugssteder (`grep -ro "var(--hegn)" assets/ --include=*.css | wc -l`, målt
efter rettelsen — se tokenkommentaren ved `system.css`s `--hegn`-token for den
selvreference-sikre genmålingskommando). Reglen, der afgør fremtidige
tilfælde, står uændret siden `spor/tomstat` og er nu anvendt tre steder i
stedet for ét: forsvinder konturen uden at en oplysning forsvinder med den,
er den `--hegn`; ellers `--hegn-baerende`.

**Bevidst urørt: `.stribe--intet .ikon`** (`color:var(--hegn)`, 2,07 : 1 mod
samme fyld som kanten stod på før rettelsen). Blokken har både en overskrift
og et afsnit, der siger det samme med ord — ikonet er derfor et redundant
tekst-supplement, ikke bæreren af oplysningen, og WCAG 1.4.11 gælder kun det
ikke-tekstlige element, der ER bæreren. Målt, ikke antaget — så beslutningen
ikke ligner en forglemmelse for næste læser.

To nye assertions i `tests/dele/59-farvetokens.mjs` (59.25, 59.26) låser nu
begge kanter gennem `var()`-kæden — kontrast OG polet, ikke kun hex, samme
grund som 59.21/59.23 er delt i to — og er efterprøvet kontrafaktisk: sættes
en af kanterne tilbage til `var(--hegn)`, falder netop den assertion, med
tallet i fejlteksten (2,07/2,14 hhv. 2,14).

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

**9. Tilstandsfamilien satses på to måder. NY, tilføjet af designplanen
3. sep 2026.** `.v-nej` er fast **10,5px** og `.v-ikke` fast **11px**
(`system.css:646, 692`), begge omlagt fra `em` af `spor/samlvaelg`, fordi
em-satsen svingede med den arvede skrift. `.v-ja` (`.62em`) og `.v-billede`
er stadig em-baserede. **Halvdelen af én fire-tilstandsfamilie skifter
størrelse med sin kontekst, halvdelen gør ikke.**

Konflikten var allerede noteret i *De fire datatilstande* som en måling; den
står nu her, fordi den er en **uafgjort systembeslutning**, og fordi DP2a gør
den mærkbar: efter DP2a bliver `.v-ja` i EU-afsnittet 0,62 × 17px = 10,54px,
altså **et tilfældigt tal, der lige akkurat rammer over skriftgulvet.**

**Ikke afgjort af designplanen, og hvorfor:** at låse `.v-ja` og `.v-billede`
til faste px vil ændre deres størrelse på **alle** flader, der bruger dem —
robotside, sammenligningsside, katalog — og de flader er ikke målt. Det er et
eget spor med en egen grundmåling, ikke en note i en plan. Se
`fund/PLAN-designarbejde.md`.
