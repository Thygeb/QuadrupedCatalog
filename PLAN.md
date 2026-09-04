# Byggeplan — oversigt over firbenede robotter

Skrevet 19. august 2026 efter interview med JPK. Forbillede: humanoid.guide, som chefen
har peget på. ~~**Ingen kode skrevet endnu.**~~ *(Forældet — siden er bygget og i drift,
se CLAUDE.md.)* Denne fil er beslutningsgrundlaget.

**Den gældende byggeplan er §0 nedenfor**, skrevet 2. september 2026. §7, §8 og §12
er overhalet af den og står som historik.

Skill brugt til planlægningen: `impeccable` → `init` (produktsandhed, gav
[PRODUCT.md](PRODUCT.md)) → `shape` (IA og adfærd før kode). Gik forbi: `ui-ux-critique`
og `critique` (vurderer noget der findes), `frontend-design` og `ui-ux-pro-max`
(overlapper impeccable), `feature-dev` (subagenter, ikke bedt om), `new-project`
(scaffolding — først når vi koder).

---

## 0. Planen fra 2. september 2026 — Supabase som sandhedskilde, fase 0–5

**Skrevet 2. sep 2026 efter JPK's beslutninger L81–L85** (STATUS.md Å115–Å119).
Erstatter §7 (sprogarkitektur), §8 (teknisk arkitektur) og §12 (rækkefølge).

### Præmissen

Projektet kørte med **to lagre uden en primær**: YAML redigeret i hånden som den
arbejdende sandhed, Supabase som spejl, holdt i takt af håndskrevne feltlister i
`db/migrer.mjs`. Alle tre datatab-nærved (Å15, Å48, Å108) kom af den dobbelthed — en
nøgle, der fandtes i det ene lager og aldrig nåede det andet. Målt 2. sep: `db/` var
3.630 håndholdte linjer, og databasen var et **blad** i afhængighedsgrafen (0 læsere
uden for `db/`), YAML roden (11.101 linjer i `tools/`+`tests/`).

Planen fjerner dobbeltheden ved at gøre databasen til det ene lager — og fjerner
derefter hvert lag, der kun fandtes for at holde to lagre i takt.

### Beslutningerne

| # | Beslutning | Vender | STATUS |
|---|---|---|---|
| **L81** | Supabase er den ene sandhedskilde; agenter skriver i databasen | L35 (model C); udfører L34 | Å116 |
| **L82** | Websiden bliver engelsk alene; alt i databasen på engelsk — indhold, kolonner, etiketter. Dansk droppes i fase 4, ikke før | L3, L24 | Å116, Å118 |
| **L83** | Tekstfelterne genindsamles fra producenterne på engelsk; tallene består | — | Å116 |
| **L84** | Intet mellemlag: bygget læser databasen direkte. `data/robots/` slettes, ingen eksport committes | (Å115/Å116's fase 3–4) | Å119 |
| **L85** | Koden bliver også engelsk (fase 5); ordbogen er et midlertidigt redskab, ikke et lag | — | Å119 |

### Faserne

**Rækkefølgen er bindende.** To afhængigheder er ikke til forhandling: **fase 1 skal
være flettet og migreringen anvendt, FØR fase 2 skriver én tekst** (sikkerhedsnettet —
databasen er genskabelig fra `data/robots/` på `b5bb73d` indtil da, og ikke derefter);
og **fase 5 kan først køre, når intet andet spor er i `tools/` og `assets/`**.

| Fase | Formål | Leverancer | Ejer | Færdig når | Status |
|---|---|---|---|---|---|
| **0** | Databasen bliver et sandt spejl af `data/robots/` — baselinen for alt efterfølgende | `migrer --til-db`; tre skemahuller lukket på den levende DB (cert-enum, `*_ordlyd`, `alt` → jsonb) | orkestrator | `rundtur --live` 77/77 · validate 0 · build 216=216 · 1111=1111 | **Kørt 2. sep** (Å115) |
| **1** | Skemaet bliver engelsk; YAML→DB-retningen lukkes; historik og ejerskab kommer på | `db/ordbog.mjs` (dansk↔engelsk, 1:1, vendbar — 7 tabeller, 78 kolonner, 7 enums, 33 feltnavne, opremsede værdier) · `db/byg-migrering.mjs` **genererer** `db/migrering-engelsk.sql` fra ordbogen · `db/migrering-cert.sql` · `db/skema.sql` på engelsk med `images.alt jsonb`, `collected_by`, `change_reason`, historiktabel + trigger, uden `_i18n` · `db/eksporter.mjs` læser engelsk, skriver den danske YAML-form (midlertidigt bevis) · `db/migrer.mjs` **slettes**, `synk_aftryk` droppes, `db/rundtur.mjs` → `db/tjek.mjs` · tests 07/28/33/44/60 fjernes (114 assertions), ny test 63 | `spor/skema`, Sonnet | 13 acceptkriterier i [fund/BRIEF-skema.md](fund/BRIEF-skema.md); derefter orkestratoren: migrering anvendt på den levende DB, `tjek.mjs` → 77/77 · validate 0 · 216=216 · 1111=1111 | **FÆRDIG** (Å117; status rettet 4. sep 2026 — her stod **"Kører"** i to døgn efter at fasen var i hus). Efterprøvet på disken samme dag: `db/ordbog.mjs`, `db/byg-migrering.mjs`, `db/tjek.mjs` og `db/migrering-engelsk.sql` **findes**; `db/migrer.mjs` og `db/rundtur.mjs` er **væk**. Rest: `db/kanonisk.json` ligger stadig på disken, selv om §0 siger den forsvandt med `migrer.mjs` — gitignoreret levn, ikke en åben leverance |
| **2** | Teksterne bliver engelske; tallene rører sig ikke. **TRE arbejder, ikke to — se korrektionen under tabellen** (her stod "to" indtil 4. sep 2026) | N parallelle spor, **rækkeejerskab pr. producent**, skriver **kun tekstkolonner** via REST: `caveat` (891), `note` (97), `applications.quote` (76 blokke), `country` (8), feltetiketter (~30) · pr. tekst: engelsk formulering + `source_wording` **ordret i kildens sprog** + råkilde-snapshot med MANIFEST (URL, HTTP, UTC, SHA-256) · de 62 kinesiske producenter læses **på kinesisk** | fase 2-spor, Sonnet, på JPK's kommando | talkolonnernes diff før/efter = **0** · `caveat_wording` udfyldt på alle **890** → derefter `NOT NULL` · konsistenskontrol: står tallet i den citerede ordlyd? **Tallet 891 stod her indtil 4. sep 2026 og var forkert med én; 890 er målt med SQL mod `field_entries`. "I dag 309" er ligeledes udskiftet — se statuskolonnen** | **KØRER** (status rettet 4. sep 2026; her stod **"Venter på fase 1"**, mens fasen havde kørt i to døgn). **Målt 4. sep 2026 kl. 07: `caveat_wording` udfyldt på 711 af 890, mangler 179** (var 623/267 ved døgnets begyndelse). **Dansk er ude af de brugervendte tekstkolonner** (`--dansk` giver 0 i alle ti), **men kinesisk er det ikke: 19 rækker står tilbage — `applications.note` 14 · `robots.notes` 5**, og de holder tre assertions i `tests/dele/42` røde. 17 af de 19 har allerede et ordlydsfelt udfyldt, så det er en fjernelse for dem og en flytning for Unitrees 2 |
| **3** | Bygget læser databasen direkte — intet mellemlag | `build.mjs` henter 77 robotter via REST (anon-nøgle + RLS-læsepolitik — ingen hemmelighed for at bygge) og mapper gennem ordbogen til den dokumentform, skabelonerne læser · `validate` på det hentede · `tests/dele/_faelles.lasRobotter()` → `hentRobotter()`, ét kald, cachet · `--data=` udgår · `db/eksporter.mjs`, `db/hentbyg.mjs`, `db/tjek.mjs` slettes · `data/robots/` **slettes** · `tools/yaml.mjs` (457 linjer) slettes | ét spor, Sonnet | build fra DB giver byte-identisk `dist/` mod build fra `data/robots/` (målt før sletningen) · tests samme beståtal | Venter på fase 2 |
| **4** | Omskiftet: engelsk alene, dokumenterne følger med | `SPROG = ['en']` (`tools/skema.mjs:563`), `KILDESPROG` · de 32 `da`-refererende tests rettes · `data/i18n/da.json` slettes · `spor/i18nfelt`s mekanisme fjernes · CLAUDE.md (mappestruktur, sprog, hårde begrænsninger 3 og L35-noter), DATAFLOW.md, `robotdata`-skillen (redigér i DB + råkilderegel) skrives om | ét spor + orkestrator (dokumenter) | 108 sider, ikke 216 · 0 forekomster af `dist/da` · linktjek 0 | Venter på fase 3 |
| **5** | Koden taler engelsk; ordbogen slettes | Mekanisk omdøbning i `tools/`+`tests/` (1.227 linjer med de 33 feltnavne, 6.671 med kernenøglerne), 402 i18n-nøgler, CSS-klasser · `db/ordbog.mjs` slettes | ét spor, Sonnet | `dist/` byte-identisk før/efter · tests samme beståtal · `grep` efter hvert dansk identifikator = 0 | Venter på fase 4 **og** på at `spor/uifix`/`spor/extract` er flettet |

### Korrektion af fase 2's verbum, 2. sep 2026: "genindsamles fra producenterne" var forkert for de fleste tekster

Rækken ovenfor sagde indtil nu *"Teksterne genindsamles på engelsk fra
producenterne"*. **Det passer på under en tredjedel af dem.** Målt i
`data/robots/` samme dag, nøgle for nøgle:

| Hvem har skrevet teksten | Nøgler | Antal | Hvad fase 2 skal gøre |
|---|---|---|---|
| **Producenten** | `citat` 69 · `citat_ordlyd` 33 · `advarsel_ordlyd` 309 · `note_ordlyd` 22 · `noter_ordlyd` 17 · `producentland` 77 · `producentby` 61 | **588** | **Genindsamles** ordret fra kilden, på kildens sprog |
| **Os** | `advarsel` 891 · `note` 97 · `noter` 63 · `alt` 35 | **1.086** | **Skrives om til engelsk.** Der er intet at indsamle — teksten findes ikke hos producenten |

| **Blandet** | de `advarsel`-rækker, hvor producentens ord ligger inde i vores prosa uden at være skilt ud i `advarsel_ordlyd` | **267** ved døgnets begyndelse 3. sep, **179** målt 4. sep kl. 07 | **Skilles ad** i engelsk brødtekst + ordret `caveat_wording`. Det er dette arbejde, der gør kravet `NOT NULL` opfyldeligt |

### Korrektion nummer to, 4. sep 2026: det tredje arbejde er IKKE det, rækken ovenfor påstår — målt på de 267

Den tredje række blev skrevet på beskrivelsen *"producentens citat gemt inde
i vores danske prosa, som skal skilles ad"*. **Det passer på 29 af de 267.**

Målt med SQL mod `field_entries` 3. sep 2026, på de rækker der havde
`caveat` men manglede `caveat_wording`:

| Måling | Tal |
|---|---|
| Rækker i alt | **267** |
| — med et citat i anførselstegn at skille ud | **29** |
| — **uden noget citat overhovedet** | **238** |
| — stadig på dansk | **0** (alle var allerede oversat) |

**De 238 er vores egen analyse, ikke producentens ord.** Stikprøve, ordret
fra databasen: *"Qualitative, not a level on a scale."* · *"Includes battery.
The value is the Basic variant's."* · *"No load condition given. Range falls
as equipment is added; the schema has no range field."*

**Der er ingenting at skille ud i dem.** Deres vej er L83's *"genindsamles fra
producenterne"*, og for en del af dem findes producentens ord slet ikke —
forbeholdet eksisterer netop, fordi kilden ikke siger noget. **Et tomt
`caveat_wording` er derfor et gyldigt slutresultat for nogle rækker, og
kravet `NOT NULL` kan ikke opfyldes for dem uden at digte.** Den beslutning
er ikke truffet.

**Prisen for ikke at vide det står målt:** to spor mødte samme situation i
samme time 3. sep. `spor/f2weilan` meldte to prisrækker uden kildeordlyd som
udokumenterede. `spor/f2pudu` fyldte sin med `"price":8500000` — et
JSON-fragment fra sidens markup, i cent. Målt: `$85,000` findes i **ingen** af
de seks råkildefiler. Rettet til NULL. **Et opdigtet bevis er værre end intet
bevis, fordi det stopper eftersøgningen, og ingen test kan fange det.**

**Skriv derfor i ethvert fase 2-brief, at *"ingen kildeordlyd findes"* er et
gyldigt og forventet resultat**, og formulér acceptkriteriet, så det ikke
belønner et højt tal. Se Å171.

Beviset er et enkelt felt. Aliengos advarsel lyder: *"Producenten skriver
Weight (without battery) 21.5kg ±1kg. Vægten er UDEN batteri — alle andre
Unitree-modeller oplyser med. Sat ved siden af Go2's 15 kg og As2's 20 kg
sammenligner man en robot uden batteri med to robotter med."* Kun første
sætning står hos Unitree. Resten er vores sammenligning, og **56 advarsler**
bærer den slags formulering (*"alle andre"*, *"sammenlign"*, *"skemaet har
ingen felter til"*). Ingen producentside vil nogensinde indeholde dem.

**Konsekvensen for briefene:** et fase 2-spor har to leverancer pr. robot,
ikke én, og de har hvert sit acceptkriterium. Indsamlingen bevises med
snapshot, MANIFEST og ordret ordlyd. Omskrivningen bevises med, at påstanden
stadig kan holdes op mod ordlyden — samme konsistenskontrol som før, men det
er en redigeringsopgave, ikke en indsamlingsopgave.

**Og et tredje arbejde, som lå skjult i tallet 891 mod 309:** de **582**
advarsler uden eget `advarsel_ordlyd` bærer ofte producentens citat **inde i**
den danske prosa (`"WEIGHT (INCL BATTERY): 18 KG" i den strukturerede
specifikationstabel`). De skal **skilles ad** i engelsk brødtekst plus ordret
`source_wording`. Det er udtrækning, ikke indsamling, og det er dér, kravet
`source_wording NOT NULL` bliver opfyldeligt.

**Rest efter fase 2: ingen i dækning, men en åben beslutning.** Kan en
advarsels påstand ikke føres tilbage til en kilde ved udtrækningen, er den
enten forkert eller uden belæg — hård begrænsning 2's område. Den beslutning
er JPK's og træffes på de konkrete felter, når de dukker op, ikke på forhånd.

### Det, der tabes — skrevet frem, ikke gemt

- **Byg uden net.** Bygget kalder databasen (77 rækker, ét nested select).
  Afhængighedsfriheden holder — L34 tillod fetch, ingen npm — men offline holder ikke.
- **Git-diff af data før udgivelse.** Erstattes af historiktabellen (hvem, hvornår,
  hvorfor, gammel række) og af diffen mellem to byg.
- **Afvisning før data lander.** Erstattes af `collected_by` + historiktabel: en
  afvisning er en forespørgsel, ikke en gren.
- **Den danske side** (106 sider, 988 håndskrevne tekster — ligger i git-historikken).
- **Redigering uden nøgle.** Skrivning kræver Supabase-adgang; læsning og byg gør ikke.

### Det, der ikke er til forhandling

- **Råkilden gemmes, hver gang** — snapshot + MANIFEST pr. kilde. Prisen var L9's 26
  kina-poster. `robotdata`-skillen bærer ikke reglen i dag (0 træffere); den skal ind,
  før fase 2's første spor sendes.
- **Kinesiske producenter læses på kinesisk.** `＜60 cm` var undvigelsesafstand på
  kinesisk og landede som forhindringshøjde på engelsk. Lagringssprog er engelsk;
  kildesprog er producentens.
- **Oversat ordlyd mærkes som oversættelse** — `source_wording` ordret, `source_wording_en`
  ved siden af. Hård begrænsning 2.
- **De fire tilstande forbliver fire ord** i den engelske enum. Hård begrænsning 5.
- **`source_wording NOT NULL` sættes først, når fase 2 er færdig** — 582 rækker ville
  falde i dag.

### Hvad ordbogen er, og hvornår den forsvinder

`db/ordbog.mjs` har tre roller: **(1)** migreringen genereres fra den — én liste, ikke to
(L30) · **(2)** beviset for at omdøbningen er tabsfri (`tjek.mjs`) · **(3)** broen i
build, indtil koden selv taler engelsk. Efter fase 5 findes den ikke.

---

## 1. Hvad feltet er

Her stod tidligere et producenttal på 42 og et modeltal på "28+", begge globalt, med
kilde til en side der i dag svarer HTTP 403 og aldrig definerede, hvad der talte som
producent (STATUS.md, punkt Å7). Det tal kan ikke citeres og er fjernet.

Den bedst efterprøvede afgrænsning, vi selv har lavet, står i `fund/FUND-felt.md`
(afsnit 4): en gennemsøgt kandidatliste på **57 producenter** — 31 verificeret mod eget
domæne, 26 navne der kun kommer fra én sekundær kilde (CMRA) og ikke er
domæneverificeret, 4 forkastede navne talt fra. Vores eget katalog dækker i dag **25
unikke producenter og 77 robotposter** (`data/robots/*.yaml`, optællingskommando i
`fund/FUND-producentby.md`). De to tal er talt på forskelligt grundlag og må ikke
lægges sammen eller sættes i brøk med hinanden.

Til sammenligning lister humanoid.guide ~235 humanoider uden noget tilsvarende loft.

**Feltet kan gøres færdigt.** Ikke fordi vi har talt hvert eksemplar, men fordi den
bedste kendte afgrænsning (57, efterprøvet — ikke 42 fra en død kilde) er lille nok til,
at et katalog på 50-70 komplette poster reelt kan dække den, mod humanoid.guides 235
halve poster, som ikke engang forsøger en afgrænsning. Strategien nedenfor følger af, at
vi kan nå bunden af et afgrænset felt, og at de ikke kan.

## 2. Hvad der gør den bedre end forbilledet

humanoid.guide filtrerer på *Max speed, Strength, Nationality, Sales price, Height,
Weight* og rangerer på en **Skill score 1-5** uden synlig metode. Det er
forbrugerfiltre og en mening forklædt som et tal.

Vores tre kanter:

**1. Kilde og dato på hvert tal.** Hver post bærer `hentet: ÅÅÅÅ-MM-DD`. Poster over 12
måneder markeres synligt som forældede. Det koster næsten intet og er det eneste, der
gør et katalog citerbart.

**2. EU-kolonnen — den ingen andre har.** CE-mærkning oplyst ja/nej/ukendt. Hvem bliver
importør ved direkte køb fra Asien (svar: køberen, med fuldt ansvar under
maskinforordningen). Findes dokumentationen på et EU-sprog. Er der et servicepunkt og
reservedele i Europa. Leveringstid. **Det er det spørgsmål, der afgør om en dansk fabrik
overhovedet må sætte maskinen i drift**, og ingen eksisterende oversigt svarer på det.
Det er også præcis den viden, KeyResearch sidder på.

**3. Specifikationstæthed som eneste rangering.** Hvor mange af vores felter oplyser
producenten faktisk? Et tal mellem 0 og 100 %, regnet mekanisk. Det måler
producenternes åbenhed, ikke vores mening. Det kan ikke spilles uden at udgive flere
data. Og det erstatter den 1-5-score, vi ikke må lave — hele begrundelsen står på
salgssidens afvist-liste: *"ingen metode, ingen acceptkriterier — en konklusion skrevet
om til tal."*

## 3. Datamodellen

Én YAML-fil pr. robot. Felterne i seks grupper:

**Identitet** — slug, navn, producent, producentland, første udgivelse (år/md),
status (i produktion / annonceret / udgået), forgænger/generation.

**Fysik** — egenvægt kg · mål stående og foldet L×B×H mm · frihedsgrader (DoF) ·
maks. nyttelast kg · maks. hastighed m/s · maks. hældning ° · maks. trinhøjde mm ·
IP-klasse · driftstemperatur °C fra/til.

**Energi** — batteri Wh · opgivet driftstid t (og under hvilken belastning, hvis oplyst) ·
hot-swap ja/nej · ladetid · dockingstation.

**Sensorik og autonomi** — LiDAR-model/type · dybdekameraer · autonominiveau
(teleop / waypoint / autonom rundering) · SLAM · forhindringsundvigelse · onboard compute ·
ROS 2 · SDK-sprog · åbent eller lukket API.

**Nyttelast og udvidelser** — monteringsinterface · strøm ud V/A · dataporte ·
dokumenterede armoptioner · tredjepartsnyttelast.

**Kommercielt og EU** — vejledende pris med valuta, dato og kilde · tilgængelig i EU ·
CE oplyst · importøransvar ved direkte køb · dokumentation på EU-sprog · servicepunkt i
EU · reservedelsforsyning · leveringstid.

Hvert talfelt bærer `værdi`, `enhed`, `kilde` (URL), `hentet` (dato). **Mangler enhed
eller kilde, fejler bygget.** Det er den mekaniske håndhævelse af "opfind aldrig tal" —
reglen står ikke bare i en CLAUDE.md, den kan ikke overtrædes.

Tre tilstande skal kunne skelnes overalt, i data og i UI: **ikke oplyst**, **nej**
og **0**. De fleste katalogsider blander dem, og det er der, de lyver.

## 4. Beregnede felter — vores tilføjelse

Regnet af tal med kilde, med formlen synlig ved siden af resultatet:

| Felt | Formel | Hvad det afslører |
|---|---|---|
| Nyttelastforhold | nyttelast ÷ egenvægt | Om robotten bærer noget eller bærer sig selv |
| Wh pr. driftstime | batteri ÷ opgivet driftstid | Om driftstiden er målt tom eller lastet |
| Pris pr. kg nyttelast | pris ÷ nyttelast | Sammenlignelig på tværs af klasser |
| Rækkevidde pr. opladning | hastighed × driftstid | Med tydeligt forbehold — teoretisk maksimum |
| Specifikationstæthed | udfyldte felter ÷ felter i alt | Producentens åbenhed |

## 5. Sidestruktur

```
/da/                                 forside: hvad er det, og kataloget straks synligt
/da/robotter/                        katalog med filtre, sortering, søgning
/da/robotter/<producent>-<model>/    detaljeside — den delbare URL
/da/sammenlign/?a=…&b=…              to-tre modeller side om side
/da/producenter/                     producentoversigt
/da/producenter/<navn>/              profil: modeller, land, EU-tilstedeværelse
/da/metode/                          hvordan vi indsamler, hvad vi ikke gør, hvornår
/da/ordbog/                          DoF, IP-klasse, hot-swap, teleop, SLAM
/da/om/                              udgiver, formål, ingen forhandleraftale
/da/ret/                             meld en fejl · tilføj en robot
```

Samme træ under `/en/`. `hreflang` imellem.

To sider bærer mere end deres størrelse antyder:

- **`/metode/`** er hele troværdigheden. Den skal sige hvad vi *ikke* gør: vi tester
  ikke, vi måler ikke, vi rangerer ikke kvalitet, vi tager ikke penge fra producenter.
- **`/ordbog/`** gør siden forståelig, uden at kræve fagsprog i forvejen — ikke kun for
  ingeniører. For den tekniske indkøber gælder det samme: en, der kan forstå
  specifikationerne, er den der booker mødet.

**Forsiden må ikke være et marketinglag foran kataloget.** Den nysgerrige læser ankommer
ofte uden et modelnavn i hovedet; den tekniske indkøber ankommer stadig ofte fra en
søgning på en konkret model eller et konkret krav. Filtrene skal være synlige i første
viewport.

## 6. Filtre

Driftsfiltre, ikke forbrugerfiltre:

Nyttelast ≥ X kg · driftstid ≥ X t · IP-klasse · nedre driftstemperatur · armoption
findes · ROS 2 · tilgængelig i EU · CE oplyst · prisinterval **med "pris ikke
offentliggjort" som eksplicit, valgbar værdi** · status · producentland.

Sortering: nyttelast · driftstid · pris · specifikationstæthed · udgivelsesdato.

Filtre skal kunne betjenes fra tastatur, og hver filtertilstand skal have sin egen URL,
så en filtreret liste kan sendes videre.

## 7. Sprogarkitektur

> **Overhalet 2. sep 2026 af L82 — engelsk alene. Se §0.** Arkitekturen (én fil pr.
> sprog, URL pr. sprog, `hreflang`) bliver stående i koden med ét sprog; den er ikke
> revet ned, den er sat på ét.

**Byg til mange, udgiv med to.** En robotpost er ~80 % tal — kg, mm, Wh, IP — og de
oversættes aldrig.

- Sprogneutrale tal findes **én gang** i robottens YAML-fil.
- Oversat tekst (feltnavne, beskrivelser, ordbog, UI-strenge) i **én fil pr. sprog**.
- URL pr. sprog, `hreflang` imellem.
- Enheder: metrisk primært, imperial som klientside-omregning af samme tal — ikke en
  oversættelse, ikke en ekstra datapost.

At tilføje kinesisk senere = ét nyt sprogfilsæt plus en subsettet CJK-font. Ingen
ombygning. **`data-en`-attributløsningen fra salgsprojektet må ikke genbruges** — den er
en kontakt med to stillinger og kan ikke få en tredje.

## 8. Teknisk arkitektur

> **Overhalet 2. sep 2026 af L81 og L84 — Supabase er kilden, `data/robots/` slettes i
> fase 3, bygget læser databasen direkte. Se §0.** Resten af afsnittet (JS-fri katalog,
> ingen tredjepartskald, målescripts) gælder stadig.

```
data/robots/*.yaml            én fil pr. robot — én robot = én commit, git-diffbar
data/manufacturers/*.yaml
data/i18n/{da,en}.json        UI-strenge og feltnavne
tools/build.mjs               nul afhængigheder → dist/ med statisk HTML pr. sprog
tools/validate.mjs            skemavalidering: enhed + kilde påkrævet, ellers exit 1
tools/*.mjs                   målescripts, arvet fra salgsprojektet
```

- **Klientside-filtrering over et lille JSON-indeks** — kun de felter der filtreres på,
  anslået ~15 KB for 60 robotter, ikke hele datasættet.
- **Virker uden JavaScript:** kataloget renderes statisk med alle robotter; JS tilføjer
  filtrering. Samme princip som salgssiden.
- Ingen tredjepartskald, ingen cookies, ingen tracking.
- Genbrug fra salgsprojektet: de ni målescripts, fontstrategien (lokale variable woff2),
  `<picture>`-mønstret.

## 9. Billedproblemet — projektets hårdeste

60 robotter vil have 60 billeder. Fabrikanternes pressefotos kan vi ikke bruge: både
rettighederne og — vigtigere — fordi det at udgive dem er det stærkeste mulige signal
om et forhandlerforhold, der ikke findes.

Fire veje, ærligt vurderet:

1. **Måltro silhuetter, vi selv tegner** ud fra de oplyste mål, alle i samme målestok og
   samme streg. Kan ikke krænke noget, ser bevidst ud, og er **bedre end fotos til
   sammenligning**, fordi alle robotter for første gang står i samme skala. Anbefales —
   det kan blive sidens visuelle signatur frem for dens kompromis.
2. Skriftlig tilladelse fra producenterne. Realistisk for nogle, tidskrævende, og skaber
   en relation, der kan misforstås.
3. Egne fotos. Kun for de robotter, vi fysisk kan komme til.
4. Ingen billeder. Ærligt, men et opslagsværk uden visuel genkendelse er tungt at bruge.

Ikke en mulighed: AI-genererede robotbilleder.

## 10. Anti-mål

- **Ingen købsknap.** humanoid.guide har "Buy-a-Humanoid™". Vi må ikke og skal ikke —
  det ville gøre os til forhandler i læserens øjne og bryde begrænsning 1.
- Ingen affiliate-links.
- Ingen 1-5-score uden offentliggjort metode.
- Ingen nyhedsbrevs-popup.
- Ingen cookiebanner (fordi ingen cookies).
- Ingen nyhedssektion, vi ikke kan vedligeholde. En død nyhedsstrøm daterer siden.
- Ingen prisforespørgselsformular i en katalogpost.

## 11. Vedligehold

Det spørgsmål, der slår katalogsider ihjel. Svaret er billigt: hver post har en
hentedato, og poster over 12 måneder markeres synligt. Uden det er kataloget forkert
efter et år, og ingen kan se det.

## 12. Rækkefølge

> **Udført.** Alle syv trin nedenfor er gennemført (august 2026). Den gældende
> rækkefølge er §0's fase 0–5.

1. **Datamodellen fastlægges, og tre robotter udfyldes i hånden** — Unitree B2, Boston
   Dynamics Spot, ANYbotics ANYmal. De tre poler: billig, etableret, industriel. Det
   afslører hvilke felter der reelt kan udfyldes, **før** vi bygger noget.
2. **Visuel retning** (`impeccable` → `new-work`). Åben — se nedenfor.
3. Generator + én detaljeside, hele vejen igennem.
4. Katalog med filtre.
5. Resten af robotterne.
6. Metode-, om- og ordbogssider.
7. Måling og kritikrunde (`ui-ux-critique`, målescripts, AI-prosa-scanner).

## 13. Åbne beslutninger

| # | Punkt | Venter på |
|---|---|---|
| **Å1** | **Navn og domæne.** Hele brandet hænger på det | CEO'en |
| **Å2** | **Visuel retning.** Ikke påbegyndt. Næste designrunde | Byggestart |
| **Å3** | **Billedvejen.** Anbefaling: silhuetter (afsnit 9) | CEO'en |
| **Å4** | **Besluttet 19. aug, ikke udført endnu.** Se note nedenfor | Agenterne |
| **Å5** | Hvem vedligeholder kataloget efter lancering | KeyResearch |

**Note til Å4 — mappestrukturen er besluttet:**

```
c:\Praktik\websites\salg\          nuværende c:\Praktik\website
c:\Praktik\websites\udstilling\    nuværende c:\Praktik\guide (dette projekt)
```

`websites\` er oprettet. Flytningen er ikke udført, og rækkefølgen er ikke valgfri:

1. **Vent på de tre agenter.** Deres worktrees indeholder absolutte stier til
   `C:\Praktik\guide\.git\worktrees\`. En flytning under kørsel river git-bindingen over,
   og agenterne fejler, når de skal committe.
2. Flet `data/kina`, `data/vest` og `data/felt` til `main`, og fjern de tre worktrees.
3. Flyt `guide` → `websites\udstilling`.
4. Flyt `website` → `websites\salg` **til sidst**. Den flytning fjerner den kørende
   sessions arbejdsmappe under den, så Claude Code skal genstartes i
   `c:\Praktik\websites\` bagefter.
5. Ret stierne i salgsprojektets egen CLAUDE.md, som nævner `c:\Praktik\website` flere
   steder, og kopiér hukommelsen fra projektnøglen `c--Praktik-website` til den nye.
