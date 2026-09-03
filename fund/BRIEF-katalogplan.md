# BRIEF — `spor/katalogplan`: fladeplan for katalogsiden

**Model: opus** (designspor, L45). **Worktree:** `C:/Praktik/websites/udstilling-wt-katalogplan`,
gren `spor/katalogplan`, forgrenet fra `44fec14`.

## Første handling

**Kald `spor`-skillen.** Den bærer grundmålingen, skrive-grænsen, kontrollinjen,
filejerskabet, selv-efterprøvningen, rapportformen og miljøfælderne. Lykkes kaldet ikke fra
din worktree, så læs `.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at du
gjorde det**.

**Kald derefter `impeccable shape`** — L70: designarbejde går gennem impeccables flows.
Diskstien som reserve: `C:/Users/thyge/.claude/skills/impeccable/SKILL.md`.

## Leverancen

Én fil: **`fund/PLAN-katalog.md`**. Ingen kode, ingen CSS, ingen skabelonændring. Du ejer
**kun** den fil.

**MODE: Operate.** Den besøgende løser en opgave: at finde frem til de robotter, der kan
bruges. Ikke Read.

## Fladen — og den første ting, du skal vide, fordi den overraskede mig

**Katalogsiden ER sprogroden.** Den ligger på `dist/da/index.html`. Der findes **ingen**
`dist/da/katalog/` — CLAUDE.md advarer ordret mod den sti, og jeg gik i den alligevel 2. sep.
Alt, hvad du måler, måler du på `dist/da/index.html`.

Konsekvensen for planen: **den her flade er både forsiden og kataloget.** Den skal både tage
imod en, der aldrig har været her før, og lade en, der ved hvad hun leder efter, filtrere
hurtigt. Planen skal sige, hvordan den løser begge dele — eller argumentere for, at den ene
vinder.

## Målt af mig 3. sep 2026 — påstande, du skal efterprøve

| Måling | Tal |
|---|---|
| Sider på fladen | **1** (mod robot 77, prod 26, saml 1, om 1, 404 1 = 107 pr. sprog) |
| `chip` | **kun kataloget** — findes ingen andre steder |
| `klaebebar` | **0 i dist** — injiceres af `assets/katalog.js` ved kørsel |
| `kort` | katalog · robot(77) · **prod(25)** · om |
| `knap` | katalog · robot(70) · 404 |
| `stans` | **alle seks skærme** |
| `id="enhedsskift"` på kataloget | **0** (står på 71 robotsider + sammenligningssiden) |

## To åbne fund fra 2. sep, som planen SKAL tage stilling til

**F1. Mærke og knap er typografisk konvergeret efter L77.** Målt: `.maerke` 11px/29px mod
`.knap--kant` 12px/44px — begge versaler, 2px radius, 1px kant. Før L77 var knappen 15px
sans/46px. **En besøgende kan ikke længere se forskel på noget klikbart og noget, der bare
står der.** Det er en følge af L77, ikke en fejl i den, og det hører i en fladeplan.

**F2. Ti knap-lignende kontroller står uden for knapprimitiven** — 5 sorteringschips og 5
`chip__krop`. L77 foldede tolv udtryk ind i én primitiv; disse ti kom ikke med, fordi mit
brief dengang pegede på `.f-sort` (det skjulte input) i stedet for på etiketten.

**Bemærk:** `.f-sort` er **ikke** en knap, men den skjulte radio — det rettede `spor/knap` mig
i. Efterprøv selv, hvad de ti faktisk er, før du planlægger for dem.

## To fund mere, noteret under designfrysen og ikke rettet

- **Bundbjælken dækker 89 px indhold ved 390 px** (`body{padding-bottom:0}`).
- **Hover-zoomen `scale(1.024)` beskærer 2,4 %** under `contain` — **på katalogsiden**, ikke
  robotsiden, hvor et tidligere brief fejlagtigt placerede den.

## SYSTEMÆNDRING — obligatorisk sektion, og planen afvises uden den

**Kataloget er den flade, der binder mest af systemet.** `kort` går herfra videre til
robotsiden, producentindekset (25 sider) og Om os. `knap` går til robot og 404. `stans` går
alle seks steder.

**Foreslår du en ændring af `kort`, `knap`, `maerke` eller `stans`, skal `SYSTEMÆNDRING`
navngive hvilke ANDRE skærme forslaget gælder for, og hvad det koster dér.**

**Din `kort`-beslutning er den vigtigste enkeltbeslutning i planen.** Producentsidens
fladeplan er bevidst holdt tilbage, indtil den er truffet, så den kan **arve** ét kort i
stedet for at foreslå sit eget på 25 sider. Skriv den, så den kan arves: hvad er kortets
opgave, hvilke dele er obligatoriske, hvad må en flade udelade.

## FILTERPANELET — tre låste krav fra JPK, 3. sep 2026, med måling

JPK sendte et skærmbillede af filterpanelet ved ca. 1.700 px og skrev tre ting. **De er
låste krav, ikke forslag** — men *hvordan* de løses, er planens arbejde.

**J1. Polstringen omkring søgefeltet skal justeres.** Ordret: *"Vi skal også justere padding
omkring search-feltet."* Jeg fandt **ingen** `padding`-regel på søgefeltet ved et greb på
`.soeg`/`.search`/`input[type=search]` i begge stilark — så enten hedder det noget andet,
eller det arver. **Find den faktiske regel, og skriv hvad den er**, før du foreslår et tal.
Mit nul er sandsynligvis et forkert søgemønster, ikke et fravær.

**J2. Filtrenes skriftstørrelse skal ændres.** Ordret: *"tænker også skriftstørrelsen på
filtrene skal ændres."* Målt i dag: `.facet__navn{font-size:11px}` versaler med
`letter-spacing:.17em`, og `.facet__tal{font-size:10.5px}` til undertallene. Retningen
(op eller ned) er ikke givet — planen skal foreslå den og begrunde den i MODE Operate.
**Bemærk konteksten:** `impeccable typeset` målte 1. sep **55 forskellige skriftstørrelser** i
stilarkene, 18 trin alene mellem 9 og 20 px. En ny størrelse her uden et trinsystem gør det
til 56.

**J3. For meget luft mellem hver filtertekst.** JPK spurgte: *"Mener du ikke at der er for
meget luft imellem hver filter-tekst?"* Mit svar er ja, og årsagen er målt:

| Kilde | Værdi | Linje |
|---|---|---|
| `.facetter__net .facet{padding:var(--r5)}` | **24 px** hele vejen rundt | `generator.css:1295` |
| `.facet__navn{margin:0 0 var(--r4)}` | **16 px** under titlen | `generator.css:1305` |
| Gitteret | `repeat(12,minmax(0,1fr))`, facetter spænder 3 eller 6 | `generator.css:1289` |
| `<details>` i den byggede side | **10, heraf 1 åben** | `dist/da/index.html` |

**Den egentlige mekanisme er gitterstrækningen, ikke polstringen** — og det er den indsigt,
planen skal bygge på. Grid-rækker strækkes til rækkens højeste celle. Har én facet en
undertitel (`CAPABILITIES` bærer "yes · no · not stated", `PAYLOAD` bærer "65 of 77 state
it"), arver **alle** facetter i rækken den højde. Da indholdet er foldet sammen, er den
arvede højde ren tomhed. Derfor er `INTENDED USE` lige så høj som sin nabo uden at have
noget at vise.

**Efterprøv den forklaring, før du planlægger på den.** Mål de faktiske cellehøjder i den
styrbare browser ved 1440 og 1700 — jeg har læst CSS'en, ikke målt kasserne, så min
konfidens er **middel**. Er strækningen ikke årsagen, så skriv det; så er J3 en anden opgave.

**J1-J3 er tre rettelser på samme flade, og det er præcis derfor de ligger her og ikke i tre
hastespor** (L70). Planen skal behandle dem som ét spørgsmål om fladens rytme, ikke som tre
tal, der skal skrues på.

## Låst krav fra JPK, 3. sep 2026

**Enhedskontakten skal være en fast del af topbaren.** Ordret: *"metric-imperial knappen skal
være en fast del af topbaren. lige nu lever den kun på sammenligningssiden."* Målt: den står
på **72 af 107** danske sider og **0** på kataloget; `side.mjs`, som ejer topbaren, tegner den
**0** gange. Topbaren selv står på **107 af 107**.

Kataloget viser omregnelige tal (vægt, pris), så kontakten er meningsfuld her. **Planen skal
tage stilling til, hvad den gør ved katalogets egne tal**, og til systemspørgsmålet: skal den
også stå på Om os og 404, hvor der intet er at omregne? Det hører i `SYSTEMÆNDRING`.
**Du implementerer den ikke.**

## Hårde begrænsninger

1. **"Ikke oplyst", "nej" og "0" er tre forskellige tilstande** og skal se forskellige ud.
2. **Opfind aldrig tal.** Og et åbent punkt, planen gerne må tage: **11 af 77 robotter havner
   i prisspanden "Højst 15.000 USD" på et tal, VI har regnet** (kursomregnet). Kilden er
   belagt, så det er ikke et brud på begrænsning 2 — men en besøgende kan ikke se forskel på
   en spand, producenten har bestemt, og en, vi har regnet.
3. **TYPESKILT er låst.** Kontrastrettelser skal være systemregler om, hvor et token må
   bruges — ikke "vælg en anden farve".
4. **Ingen forhandleraftale.** Ingen købsknap, intet affiliate-link, ingen
   prisforespørgselsformular.

## Acceptkriterier — kørt mod main af mig 3. sep, med "giver i dag X"

1. `ls fund/PLAN-katalog.md` → **findes ikke i dag**.
2. `grep -c 'SYSTEMÆNDRING' fund/PLAN-katalog.md` → i dag **0**, skal være ≥1.
3. `grep -ci 'Operate' fund/PLAN-katalog.md` → i dag **0**, skal være ≥1.
4. Planen skal svare på F1, F2, J1, J2, J3 og enhedskontakten hver for sig, med overskrift.
   Kontrol: `grep -c '^## \(F[12]\|J[123]\)' fund/PLAN-katalog.md` → **5**.
5. `git diff --name-only main...spor/katalogplan` → **præcis** `fund/PLAN-katalog.md` og
   `fund/BRIEF-katalogplan.md`.

## Miljø

- **node:** `/c/Program Files/nodejs/node.exe`. Bar `node` giver **exit 127**, som ligner
  libuv-fælden, men er bash' `command not found`. Læs fejlteksten, ikke koden.
- **Din serverport er 8140.** Aldrig 8080. Verificér serveren mod disken, før ét tal bruges.
  **Luk den, når du er færdig med at måle, og skriv i rapporten, at du gjorde det.**
- **Kør ikke `tests/koer.mjs`** — du ændrer ingen kode, og den koster 2,8 GB.
- **`dist/da/katalog/` findes ikke.** Kataloget er `dist/da/index.html`.
- **Et grep på en klasse tæller kommentarer og bindestreger med.** `\bfod\b` matchede
  `chip-fod`. Mål selektorer, og kør altid en positiv kontrol.
- UTF-8 uden BOM · `git commit -F <fil>` ved backticks · `sed -i` fejler tavst, brug Edit.
- **Commit undervejs.**

## Rapporten — `fund/FUND-katalogplan.md`, højst 60 linjer

Valgt/fravalgt · konfidens pr. punkt (høj kræver genkørbar kommando **plus** den
kontrafaktiske linje) · usikkerheder · målinger som tal. **Uden for de 60, obligatorisk:**
"Nye fælder og opdagelser" og "Punkter i briefet, jeg ikke nåede".

**Briefets fakta er påstande.** Afviger din måling fra min, så rapportér det — det er en del
af leverancen. Mine tal ovenfor er målt i `dist/da`, ikke i browseren.
