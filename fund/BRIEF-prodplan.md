# BRIEF — `spor/prodplan`: fladeplan for producentsiden og producentindekset

**Model: ARVET fra sessionen, med vilje.** Orkestratoren har udeladt `model`-parameteren
efter JPK's udtrykkelige valg 3. sep 2026, fordi det er den eneste vej til en bestemt
Opus-version. **Det er ikke et brud på L45's værn i tavshed** — værnet blev sat, fordi to
spor 24. aug arvede en dyr model, *uden at nogen havde valgt den*. Her er arven valget.
**Skriv i din rapport, hvilken model du faktisk kører**, så næste læser kan se, at det
lykkedes.

**Worktree:** `C:/Praktik/websites/udstilling-wt-prodplan`, gren `spor/prodplan`, fra `ac84dfe`.

## Første handling

**Kald `spor`-skillen.** Den bærer grundmålingen, skrive-grænsen, kontrollinjen,
filejerskabet, selv-efterprøvningen, rapportformen og miljøfælderne. Lykkes kaldet ikke fra
din worktree, så læs `.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at du
gjorde det**.

**Kald derefter `impeccable shape`** — L70: designarbejde går gennem impeccables flows.
Diskstien som reserve: `C:/Users/thyge/.claude/skills/impeccable/SKILL.md`.

## Leverancen

Én fil: **`fund/PLAN-producent.md`**. Ingen kode, ingen CSS, ingen skabelonændring.
Rapporten `fund/FUND-prodplan.md` er den anden fil, du må committe — briefets
ejerskabsafsnit gælder, ikke et filantal.

**MODE: Read.** Den besøgende skal **forstå** noget: hvem producenten er, og hvad de laver.
Ikke Operate. Kataloget og sammenligningssiden er Operate; **denne er den fjerde plan, og
den anden Read-flade efter robotsiden.** Læs `fund/PLAN-robotside.md`s behandling af Read,
så de to ikke opfinder hver sin.

## DU ER DEN SIDSTE — læs de tre andre planer først

Der findes tre fladeplaner, alle flettet til main:

| Fil | Flade | MODE | Linjer |
|---|---|---|---|
| `fund/PLAN-robotside.md` | robotsiden | Read | 1115 |
| `fund/PLAN-katalog.md` | kataloget (= sprogroden) | Operate | 465 |
| `fund/PLAN-sammenligning.md` | sammenligningssiden | Operate | 451 |

**Din plan er den eneste, der kan skrives med de tre andre i hånden.** Brug det: hvor de
tre er uenige, skal du ikke opfinde en fjerde vej — du skal skrive, hvilken af dem
producentfladen følger og hvorfor.

## KORTBESLUTNINGEN ER ALLEREDE TRUFFET — du arver, du opfinder ikke

`fund/PLAN-katalog.md`s `SYSTEMÆNDRING`, afsnit **K.1**, er skrevet udtrykkeligt for at
blive arvet af dig. Læs den ordret. Kort gengivet, men **læs originalen**:

- **Ét kort, én implementering.** Forskellen mellem flader er **fratrækning**, ikke en
  komponent nummer to.
- **Kortets opgave:** at lade den besøgende **afvise** en model uden at åbne den.
- **Obligatorisk:** billedet, produktnavnet, producenten, og statusstemplet når status ikke
  er "i produktion".
- **Valgfrit:** nøgletallene, hullerne, samleknappen.
- **Ingen flade må tilføje en handling, kataloget ikke har** (hård begrænsning 1).

**Planen fandt også, at begrundelsen for TO kortimplementeringer er forældet:**
`katalog.mjs:1137` siger, at den fælles `kort()` deles med *"forsiden og producentsiderne"*
— men **forsiden blev slettet af L72**. Den fælles funktion har i dag **én** kalder,
`producent.mjs:251`, altså dig. **Du er den anden stilling, kontakten mistede.**

## Fladen, målt af mig 3. sep — påstande, du skal efterprøve

| Måling | Tal |
|---|---|
| Sider (indeks + underside) | **26** pr. sprog |
| `kort`-forekomster på dem | **77** |
| Sider der indlæser JavaScript | **0** (kontrol: kataloget indlæser 1) |
| `samling:false` i `producent.mjs` | **2** forekomster |

**Hvilke kortdele fladen bærer i dag, mod katalogets:**

| Del | Producent | Katalog |
|---|---|---|
| `kort__navn` · `kort__prod` · `kort__tekst` | **77** hver | 86 hver |
| `kort__mrk` (statusstempel) | **9** | 12 |
| `kort__vaerdi` (nøgletal) | **0** | 370 |
| `kort__savn` ("ikke oplyst") | **0** | 123 |
| `kort__saml` (sammenlign) | **0** | 172 |

**De tre nuller er ikke en mangel — de er formentlig rigtige**, og planen skal sige hvorfor
eller hvorfor ikke:

- **`kort__saml` kan ikke virke her.** Siderne indlæser **0** JavaScript, så en
  sammenlign-knap ville stå `hidden` for evigt.
- **`kort__vaerdi` og `kort__savn`** er fratrukket. Læseren har allerede valgt producenten.
  **Men hård begrænsning 5 siger, at "ikke oplyst", "nej" og "0" skal se forskellige ud** —
  og på denne flade vises **ingen** af dem. Er det en legitim fratrækning eller et sted,
  hvor siden fortier noget? **Det er plansens vigtigste spørgsmål, og du skal svare på det.**

## To fund fra de andre planer, som rører dig

**`.maerke` og `.knap` er typografisk konvergeret efter L77** — en besøgende kan ikke se
forskel på noget klikbart og noget, der bare står der. Målt af katalogsporet: kataloget har
**seks klikbare kontroller i seks visuelle sprog**. Hvad har producentfladen? **Tæl det.**

**Producentindekset er tungt** — ca. 250 mørke understregede modelnavne, noteret men aldrig
målt ordentligt. **Mål det, og tag stilling.** Indekset og undersiden er to forskellige
flader i én plan; behandl dem hver for sig, hvis de har hver sit problem.

## SYSTEMÆNDRING — obligatorisk sektion, og planen afvises uden den

Skriv, hvilke **andre** skærme hvert forslag rører, og hvad det koster dér. Målt
komponentspredning (`dist/da`):

| Komponent | Skærme |
|---|---|
| `stans` | **alle seks** |
| `kort` | katalog (86) · **producent (77)** |
| `tabel` | robot (77) · producent (1) |
| `knap` | katalog · robot (70) · 404 |

**Jeg samler alle fire planers systemdeltaer til ÉT sæt beslutninger, før noget bygges.**
Din sektion er den sidste brik. **Foreslår du noget, der modsiger en af de tre andre planer,
så skriv modsigelsen frem** — det er mere værd end en plan, der lader som om den passer.

## Hårde begrænsninger

1. **Ingen forhandleraftale.** Producentsiden er det farligste sted på hele webstedet for
   den regel: den handler om ét firma. Ingen købsknap, intet affiliate-link, ingen
   prisforespørgsel, ingen formulering der læser som en anbefaling af producenten.
2. **Opfind aldrig tal, cases eller certificeringer.**
3. **"Ikke oplyst", "nej" og "0" er tre forskellige tilstande.** Se spørgsmålet ovenfor.
4. **TYPESKILT er låst.** En kontrastrettelse skal være en systemregel om, hvor et token må
   bruges — ikke "vælg en anden farve".

## Acceptkriterier — kørt mod main af mig 3. sep, med "giver i dag X"

1. `ls fund/PLAN-producent.md` → **findes ikke i dag**.
2. `grep -c 'SYSTEMÆNDRING' fund/PLAN-producent.md` → i dag **0**, skal være ≥1.
3. `grep -ci 'Read' fund/PLAN-producent.md` → i dag **0**, skal være ≥1, og MODE skal være
   navngivet i prosa.
4. Planen skal svare særskilt på: **kortarven** fra K.1 · **de tre nuller** (`kort__vaerdi`,
   `kort__savn`, `kort__saml`) mod hård begrænsning 5 · **indekset** som egen flade.
5. `git diff --name-only main...spor/prodplan` → kun `fund/PLAN-producent.md`,
   `fund/FUND-prodplan.md` og `fund/BRIEF-prodplan.md`.

## Miljø

- **node:** `/c/Program Files/nodejs/node.exe`. Bar `node` giver **exit 127**, som ligner
  libuv-fælden fra CLAUDE.md, men er bash' `command not found`. **Læs fejlteksten.**
- **Din serverport er 8144.** Aldrig 8080. Verificér serveren mod disken, før ét tal bruges.
  **Luk den, når du er færdig, og skriv i rapporten, at du gjorde det.**
- **DEN STYRBARE BROWSER ER FÆLLES PÅ TVÆRS AF SAMTIDIGE SPOR — også den aktuelle fane.**
  Målt 3. sep af to spor uafhængigt: et spor blev flyttet til en fremmed port, til en anden
  side og til sidst til **reddit.com**; bredden sprang 1440 → 1536 → 2048. **Egen port
  beskytter ikke.** Skriv en URL- og bredde-vagt som **første linje i hver måling**, og
  forkast tallet, hvis den fejler. `spor/zoom` kører samtidig med dig.
- **Kør ikke `tests/koer.mjs`** — du ændrer ingen kode, og den koster 2,8 GB disk.
- **`dist/da/katalog/` findes ikke.** Kataloget er `dist/da/index.html`.
- **Et grep på en klasse tæller kommentarer og bindestreger med.** `\bfod\b` matcher
  `chip-fod`; `kort` matcher `kort-ophav` og `om-kort`. **Det har kostet tre forkerte
  konklusioner på to dage.** Mål på præcist klassenavn, og kør altid en positiv kontrol.
- UTF-8 uden BOM · `git commit -F <fil>` ved backticks · `sed -i` fejler tavst, brug Edit.
- **Commit undervejs.**

## Rapporten — `fund/FUND-prodplan.md`, højst 60 linjer

Valgt/fravalgt · konfidens pr. punkt (høj kræver genkørbar kommando **plus** én linje om,
hvad tallet ville have været, hvis arbejdet var forkert) · usikkerheder · målinger som tal.
**Skriv hvilken model du kører.** **Uden for de 60, obligatorisk:** "Nye fælder og
opdagelser" og "Punkter i briefet, jeg ikke nåede".

**Briefets fakta er påstande.** Afviger din måling fra min, så rapportér afvigelsen — det er
en del af leverancen, ikke ulydighed. **Ni af orkestratorens fakta er blevet rettet af spor
i går og i dag, og hver eneste rettelse var rigtig.**
