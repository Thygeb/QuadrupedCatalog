# TYPESKILTET — retningsmanifest

Comp af katalogets nye visuelle verden. Spor `spor/nyverden`, 31. august 2026.
**Dette er en retning, ikke en implementering.** Intet herfra er bygget ind i siden.

Filerne: [`katalog.html`](katalog.html) · [`robot-spot.html`](robot-spot.html) ·
[`typeskilt.css`](typeskilt.css) · [`byg-comp.mjs`](byg-comp.mjs) · `skrift/`

---

## Tesen

**Filtret er ikke et sidepanel. Det er pladen, kataloget er boltet på.**

Enhver industrimaskine bærer et typeskilt: en stanset plade, der siger hvad
maskinen er, hvad den tåler, og — ved sin tavshed — hvad producenten ikke vil
love. Kataloget er 77 sådanne maskiner. Filtersektionen er stedet, hvor de 77
skilte lægges oven på hinanden, og hvor det bliver synligt, at 27 af dem ikke
har en IP-klasse stanset i.

Derfor ligger filtret som en fuldbredde plade i første skærm, ikke i en
venstreskinne. Det er ikke et redskab ved siden af indholdet; det **er**
indholdet, indtil læseren har valgt.

Retningen afviser: SaaS-filterskuffen med bløde pill-chips, trafiklysfarver på
status, gradienter, glasmorfisme, slagskygger, og de tre AI-standardudseender.

---

## Paletten

Otte navngivne roller. Kontrasttallene er **målt** med WCAG-formlen, ikke skønnet
(genkør: se *Målinger* nederst).

| Navn | Hex | Rolle | Målt kontrast |
|---|---|---|---|
| **Eloxgrå** | `#E8EBED` | Pladen selv — anodiseret aluminium. Sidens bund | — |
| **Gunmetal** | `#22262A` | Blækket. Al stanset tekst og alle tal. Strimlens bund | 12,72:1 på eloxgrå |
| **Kridt** | `#FAFBFB` | Kortflade og indfældede felter | — |
| **Afmærkningsgul** | `#F2C400` | **Kun markering.** Valgte tilstande, tællerens streg, fokusring | 9,19:1 for gunmetal på gult |
| **Blæk-2** | `#545C63` | Sekundær tekst, tonet mod pladens blågrå — aldrig neutralgrå | 5,68:1 på eloxgrå |
| **Rille** | `#C6CCD1` | Rillen mellem stansede felter. Hårstreger | — |
| **Stans** | `#FFFFFF` | Lyskanten i en stansning, 1 px indfældet | — |
| **Støvgrå** | `#9AA3A9` | **Kun kontur.** Stiplede rammer for "ikke oplyst" | 2,14:1 på eloxgrå |
| **Støv-blæk** | `#5F686F` | Teksttonen for "ikke oplyst" | 4,74:1 på eloxgrå |

**Farvestrategi: tilbageholdt.** Neutraler plus én kulør, som aldrig bruges
dekorativt. Gult optræder på compen præcis fire steder: valgte afkrydsninger,
strimlens valgte chips, tællerens tal og streg, og fokusringen. Læseren kan
aflæse "hvad har jeg valgt" ved at kigge efter gult og intet andet.

**Lys, ikke mørk — valgt af brugsscenen, ikke af kategorien.** En fagperson ved et
skrivebord i dagslys, der sammenligner specifikationer. Anodiseret aluminium er
desuden lyst; en mørk plade ville være en anden maskine.

### Hvorfor støvgrå blev til to farver

Hypotesen gav "støvgrå #9AA3A9" én rolle: *ikke oplyst — stiplet kontur, ingen
fyld*. Målingen viser, at den kun kan holde den halve rolle: **2,14:1 mod pladen**.
Den kan tegne en streg, men den må aldrig bære tekst.

Etiketten "ikke oplyst" skal kunne læses — det er hele pointen med at tælle den
med. Så tonen er delt: `#9AA3A9` tegner konturen, `#5F686F` skriver ordet (4,74:1).
Forskellen på "ikke oplyst" og almindelig sekundærtekst bæres derfor **ikke af
farven alene** — den bæres af den stiplede kontur, det stiplede mærke og
placeringen sidst. Det er også det tilgængelighedsrigtige: farve må aldrig være
den eneste bærer af betydning.

På strimlens gunmetalbund er støvgrå derimod 5,94:1 og bruges frit til tekst.

---

## Skriftrollerne

Begge snit er **self-hostede woff2** i `skrift/`, latin + latin-ext, 10 filer,
304 KB. Begge er **SIL Open Font License 1.1** — fri til selvhosting, også
kommercielt.

| Rolle | Snit | Licens | Vægte |
|---|---|---|---|
| **Pladen** — etiketter, navigation, facetter, overskrifter | **Saira Semi Condensed** (Omnibus-Type) | SIL OFL 1.1 | 400 · 500 · 600 · 700, statiske instanser |
| **Manualen** — prosa, billedtekster, forbehold | **Literata** (TypeTogether / Google) | SIL OFL 1.1 | variabel, 400–600 |
| **Tal** | **Ingen tredje familie.** Saira med `font-variant-numeric: tabular-nums` | — | — |

**Hvorfor ikke rigtig DIN.** Hypotesen bad om et DIN-slægtet snit, fordi DIN 1451
bogstaveligt er normen fra tyske maskinskilte. Ægte D-DIN kunne ikke hentes:
`@fontsource/d-din` og `@fontsource/din-2014` svarer begge 404, og D-DIN-filen på
GitHub ligeledes — tre URL'er, alle målt med curl. Saira Semi Condensed er valgt
som nærmeste hentbare slægtning: firkantede kurveovergange, flade terminaler,
jævn streg, og en semi-kondenseret bredde tæt på DIN 1451 Mittelschrift.
**Fravalgt:** Barlow Semi Condensed (afrundede terminaler kæmper mod DIN),
Archivo Narrow og Roboto Condensed (for anonyme), Oswald (display-only, og
slægtet fra Alternate Gothic, ikke DIN).

**Hvorfor Literata til prosa.** Parret er ikke tilfældigt: pladen og manualen er
de to tryksager, en industrimaskine faktisk kommer med. Literata sættes **aldrig**
som display — en display-serif oven på hårstreger er AI-standardudseende nr. 3,
og retningen holder sig fra den ved at lade den kondenserede grotesk føre.

**Hvorfor ingen monospace.** Den gamle verden satte hvert tal i `var(--mono)`.
Det er "monospace som kostume for teknisk" — på et rigtigt typeskilt er tallene
stanset i **samme** skrift som etiketterne. Tabulartal løser justeringen; en
skrivemaskineskrift ville kun tilføje en pose.

---

## Signaturelementet: **typeskilt-pladen**

**Ved JPK's dom, 31. aug 2026, er to blokke droppet:** højdelinealen i denne
facet, og tæthedsmåleren på robotsiden (den store procentblok under robotnavnet,
der havde titlen "Specifikationstæthed"). Signaturen er derfor ikke længere en
tegning i én facet — den er selve **stempelblokken** i pladens hoved: TYPE ·
UDGAVE · POSTER · OPLYSTE FELTER, stanset til højre, med afmærkningsgul som
eneste markering (se *Paletten* ovenfor). Vægtklasse-facetten består som fire
afkrydsningsfelter — Under 20 kg (18) · 20–40 kg (19) · Over 40 kg (29) · Vægt
ikke oplyst (11), sidstnævnte fortsat i stiplet ikke-oplyst-stil — i samme
tre-tilstandsstil som resten af pladen, uden en særskilt grafik. Tætheden
består som **begreb**: se *Hvad compen ikke svarer på* — sorteringsmenuen i
denne comp har aldrig haft en "Specifikationstæthed"-mulighed (listen er
Alfabetisk · Lanceringsdato · Pris · Nyttelast · Hastighed), så der er intet
at røre der som følge af drop'et.

### Hvad der blev droppet, til referencen

Højdelinealen tegnede vægtklassernes højdespænd i én fælles målestok, af de
højder producenterne faktisk oplyser:

| Gruppe | Målt | Højdespænd |
|---|---|---|
| Under 20 kg | 16 af 18 | 28–56 cm |
| 20–40 kg | 17 af 19 | 45–65 cm |
| Over 40 kg | 28 af 29 | 47–93 cm |
| Vægt ikke oplyst | **0 af 11** | **kan ikke tegnes** |

Pointen — at klasserne overlapper, og at gruppen "vægt ikke oplyst" slet ikke
kan tegnes i målestok — var rigtig, men er nu et faktum uden en tegning. Tallene
regnes fortsat i `byg-comp.mjs` (til byggets eget logudskrift), men de to
assertions, der bevidste tegningens integritet, er fjernet sammen med selve
tegningen, se *Sådan er compen bygget*.

Silhuetterne fra `assets/silhuetter/` blev heller aldrig brugt her — mappen har
stadig **0** silhuetter, og værnet forbyder enhver ændring i `assets/`. Det
argument står uændret; det er blot ikke længere relevant, fordi ingen grafik
erstatter linealen.

---

## Tre-tilstandsreglen, tegnet

Fire mærker i samme streg, tegnet som SVG — ingen unicode-glyffer, ingen emoji:

| Tilstand | Mærke | Behandling |
|---|---|---|
| **ja / oplyst** | fyldt firkant | fuldt blæk |
| **nej** | kontur med skråstreg | fuldt blæk — et svar, ikke et hul |
| **nul** | kontur med udfyldt prik | fuldt blæk, **altid med den målte værdi ved siden af** |
| **ikke oplyst** | stiplet kontur, ufyldt | støv-blæk, altid **sidst**, adskilt af en stiplet linje |

Egenskabschippene er, hvor reglen er skarpest — og tallene er ikke opfundet til
lejligheden:

| Chip | ja | nej | ikke oplyst |
|---|---|---|---|
| Går på trapper | 42 | 0 | 35 |
| Bærer fra 5 kg gående | 57 | 8 | 12 |
| Arbejder i frost | 36 | 10 | 31 |
| Lader selv | 31 | **3** | 43 |
| Hot-swap-batteri | 19 | **0** | 58 |

Hver linje summer til 77; generatoren fejler, hvis en ikke gør.

To rækker bærer hele argumentet. **"Lader selv"** har alle tre tilstande i data:
31 producenter siger ja, **3 siger udtrykkeligt nej**, 43 siger ingenting.
**"Hot-swap"** har et *tælleligt* nul: ingen producent afviser hot-swap — det er
noget helt andet end de 58, der tier. Og af de 10, der ikke arbejder i frost, har
**8 en målt nedre grænse på præcis 0 °C**: et målt nul, ikke et manglende svar.

---

## Layouttesen

**1440:** pladen fylder første skærm. Typeskiltets hoved øverst (TYPE · UDGAVE ·
POSTER · OPLYSTE FELTER stanset til højre), derunder den **klæbende strimmel** med
aktive valg, tæller og Nulstil, derunder facetlaget i et **12-kolonners gitter**:
Anvendelse 3, Vægtklasse 4, Egenskaber 5 — og
nederst IP-klasse, Status, Land og den reserverede certificeringsgruppe med 3 hver.
Resultatet begynder ved foldkanten, så læseren ser, at der er mere.

**390:** facetlaget bliver et udtrækspanel med håndtag; **strimlen består** og
bliver liggende øverst med tæller og valg. Kortene går 2-op.

**Kortet** viser billede, producent og produktnavn — intet andet. Et statusstempel
lægges kun på, når status ikke er "i produktion", fordi den forskel er den eneste,
kortet skal kunne bære.

**Bevægelse: næsten ingen.** Ét autoreret øjeblik — tælleren *stempler*, når
tallet skifter. `prefers-reduced-motion` respekteres.

**Den æstetiske risiko, taget med vilje:** det stansede udtryk — 2 px radius og
1 px indfældet kant med en hvid lyskant. Materiale, ikke skeuomorf teater. Ingen
slagskygge findes på siden.

---

## Hvor jeg afveg fra retningshypotesen

| # | Hypotesen sagde | Compen gør | Hvorfor |
|---|---|---|---|
| 1 | Signatur: silhuetter fra `assets/silhuetter/` | Højdelinealen | Mappen har **0** silhuetter; værnet forbyder at lave dem |
| 2 | Vægtklasser **I 18 / II 19 / III 29 / IV 11** | **Tre** klasser + gruppen "vægt ikke oplyst" (11) | Data har `under_20`/`20_40`/`over_40`/`ikke_oplyst`. Den fjerde er **ikke en klasse** — at kalde den IV ville blande "ikke oplyst" ind mellem målte værdier og bryde hård begrænsning 5 |
| 3 | "Går på trapper (39 oplyser)" | **42** | Målt på `trappetrin_kontinuerlig` |
| 4 | "Bærer ≥ 5 kg (63 oplyser)" | **65 oplyser**, heraf **57** på 5 kg eller mere | Briefets tal var antallet, der oplyser; chippen skal vise, hvor mange der opfylder |
| 5 | Chipformat `✓ N · M uoplyst` | `N ja · N nej · N ikke oplyst` | To-delingen skjuler "nej". Hård begrænsning 5 kræver, at den ses |
| 6 | Chipnavn "Bærer ≥ 5 kg gående" | "Bærer **fra** 5 kg gående" | `≥` (U+2265) findes hverken i latin- eller latin-ext-subsettet og ville falde tilbage til systemskrift. Almindeligt dansk er desuden bedre |
| 7 | DIN-slægtet industrigrotesk | Saira Semi Condensed | Ægte D-DIN ikke hentbar (3 URL'er, alle 404) |
| 8 | Støvgrå `#9AA3A9` til "ikke oplyst" | Delt i kontur `#9AA3A9` + tekst `#5F686F` | Målt 2,14:1 — kan ikke bære tekst |

**Tal fra briefet, der holdt ved kontrolmåling:** anvendelsesfordelingen (41 · 34 ·
33 · 30 · 30 · 18 · 12 · 8), IP-klasserne (27 io · 25 · 11 · 9 · 2 · 2 · 1 nej),
status (68 · 6 · 3), landefordelingen (62 · 3 · 3 · 3 · 2 · 2 · 1 · 1), "Arbejder
i frost" 46 oplyser, "Lader selv" 31, "Hot-swap" 19.

---

## Sådan er compen bygget

`byg-comp.mjs` genererer begge sider af `dist/robots.json` og henter etiketterne
fra `data/i18n/da.json`. **Ikke af bekvemmelighed, men fordi hård begrænsning 2
kræver det:** når hvert tal og hvert navn er *regnet*, kan der ikke stå et
opfundet tal på siden. Generatoren bærer **12 assertions** — facetsummer,
navneantal, billeddækning, "ikke oplyst"-optælling — og fejler, hvis én ikke
holder. (Var 14 før JPK's dom 31. aug 2026: de to assertions, der bevidste
højdelinealens tegning, udgik sammen med tegningen selv.)

```
node retninger/nyverden/byg-comp.mjs     # fra worktree-roden
```

**To forbehold, læseren skal kende:**

1. **Compen viser én filtertilstand:** Anvendelse = Inspektion + IP-klasse = IP67,
   udgåede skjult → **21 af 77**. Afkrydsningerne kan klikkes, og markeringen
   følger med, men tælleren og kortene er den viste tilstands. Derfor bærer pladen
   et synligt stempel: *Comp · én filtertilstand*.
2. **Billederne ligger uden for git.** Kortene peger på
   `../../assets/fotos/fabrikant/`, som er gitignoreret. Uden den mappe viser
   compen tomme billedfelter. Filerne blev **ikke** kopieret ind i
   `retninger/nyverden/billeder/`, fordi `.gitignore` linje 54 ignorerer
   `retninger/*/billeder/**` — de ville alligevel ikke følge med.

---

## Målinger

Alle tal i dette dokument kan genkøres.

```
# Grundmåling, uændret af sporet
node tools/validate.mjs        # 77 filer · 0 fejl · 1 advarsel
node tools/build.mjs           # 213 sider · 1110 tal med kilde · 0 uden
node tests/koer.mjs            # 608 bestået · 0 fejlet

# Compens egne selvtjek
node retninger/nyverden/byg-comp.mjs      # 12 ok, 0 brud

# Browsermåling (server på egen port 8140 fra worktree-roden)
node C:/Praktik/websites/maalevaerktoej/maal.mjs \
  http://localhost:8140/retninger/nyverden/katalog.html 1440
```

| Måling | 1440 | 390 |
|---|---|---|
| Kort | 21 | 21 |
| Billeder indlæst | 21 af 21 | 21 af 21 |
| Beskåret over 25 % | 0 | 0 |
| **Vandret overløb** | **0** | **0** |
| Højdespring i en række | 0 | 0 |
| Spildt lodret plads | 0 px | 0 px |
| Sidehøjde | 2.832 px | 5.370 px |

### Værnet — og hvorfor kommandoen skal have tre punktummer

```
git diff main...spor/nyverden --name-only -- assets tools data tests
```

→ **0 filer.** Sporet har ikke rørt data, værktøjer, tests eller assets. I alt
rører grenen 15 filer, alle under `retninger/nyverden/`.

**Med *to* punktummer giver samme kommando 94 filer — og det er ikke sporets
skyld.** `main` flyttede sig undervejs: `spor/datafelter` blev flettet ind og
ændrede 94 robotfiler (`foerste_udgivelse` og et `fremdrift`-identitetsfelt).
To-punktumsformen `main..gren` sammenligner de to grenspidser og viser derfor
*mainsfremdrift* oven i sporets egen. Tre-punktumsformen `main...gren` måler fra
flettepunktet (`dc9f62d`) og viser kun, hvad sporet selv har lavet.

Det er samme fælde som et hårdkodet forventet tal: et acceptkriterium, hvis
betydning ændrer sig, når verden omkring det bevæger sig. Kontroltjekket, der
afgør sagen uafhængigt af begge former:

```
git log --oneline main..spor/nyverden --name-only -- assets tools data tests
```

→ tomt. Ingen af sporets commits nævner en eneste fil under de fire stier.

---

## Hvad compen ikke svarer på

- **Filtreringen er ikke bygget.** Hvordan 77 kort skal falde til 21 uden ryk, og
  hvad tælleren gør undervejs, er en implementeringsbeslutning, ikke en retning.
- **Engelsk udgave er ikke tegnet.** Sproglinket er en attrap. Tyske og engelske
  facetnavne er længere end de danske og vil presse 12-kolonners gitteret.
- **Sorteringen er en attrap.** Listen er den besluttede (Alfabetisk ·
  Lanceringsdato · Pris · Nyttelast · Hastighed, ingen Skill Score), men intet
  sorterer.
- **Certificeringsgruppen er en ærlig pladsholder.** Der findes ingen data:
  CE er oplyst på 4 af 77 robotter.
- **Producentsiden og sammenligningssiden** er ikke tegnet i denne verden.
