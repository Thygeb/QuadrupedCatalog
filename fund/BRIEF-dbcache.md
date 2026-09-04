# BRIEF — spor/dbcache: suiten laver ét REST-kald i stedet for 39

**Gren:** `spor/dbcache` · **Worktree:** `C:/Praktik/websites/udstilling-wt-dbcache`
**Model:** sonnet · **Base:** `7b169b7` · **Rapport:** `fund/FUND-dbcache.md`
**Forventet pris:** ~150–250k tokens. Overstiger du 350k uden at være i mål, så
meld det frem for at fortsætte.

**Kald `spor`-skillen som din FØRSTE handling** — den bærer grundmålingen,
skrive-grænsen, kontrollinjen, filejerskabet, selv-efterprøvningen,
rapportformen og miljøfælderne. Lykkes kaldet ikke fra din worktree, så læs
`.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at du gjorde
det**.

**Vurdér desuden `supabase`-skillen og skriv dit valg.** Min vurdering: den er
**ikke** nødvendig — du ændrer intet skema, ingen RLS, ingen politik, og du
skriver aldrig i databasen. Du rører kun, hvor mange gange et eksisterende
GET-kald udføres. Er du uenig, så kald den og skriv hvorfor. Diskstien som
reserve: `.claude/skills/supabase/SKILL.md`.

**Ikke relevante:** `design` (intet visuelt), `robotdata` (ingen robotpost),
`supabase-postgres-best-practices` (ingen DDL, intet indeks, ingen migrering).

---

## Hvorfor denne opgave findes

Fase 3's første halvdel (`7a68d10`) gjorde databasen til byggets standardkilde.
Det virker og er bevist byte-identisk. **Bivirkningen er, at testsuiten er
blevet et netværksapparat.**

Å178's åbne punkt (a) ordret: *"`tests/koer.mjs` kan ikke længere køre offline
eller uden `.env`, og den tager ~4 min mod ~2."*

**Beslutningen, JPK traf 4. sep 2026 (bliver L95):** *offline* droppes som mål.
Der er ingen CI i repoet, generatoren er afhængighedsfri, og suiten køres på en
maskine med net — kravet har ingen aftager, der kan måles. Og en **committet**
snapshot-fixture af de 77 robotter er udelukket af **L84** (*"ingen eksport
committes"*), så den vej er lukket af en stående beslutning, ikke af smag.

**Det, der løses i stedet, er suiten som MÅLEAPPARAT.** 39 netværkskald betyder,
at suiten kan gå rød af en grund, der ikke er kode. Ét kald skærer den
eksponering med 39×.

### Planens forbehold, citeret

PLAN.md's fase 3 siger om netop dette: *"`tests/dele/_faelles.lasRobotter()` →
`hentRobotter()`, **ét kald, cachet**"*. Cachen er altså planens egen hensigt.
`db/hent.mjs`s egen kommentar siger, hvad "cachet" skulle betyde:

> *"det, `"Ét kald, cachet"` i `BRIEF-fase3.md` punkt 5 faktisk sigter paa: at
> suiten ikke laver 76 REST-kald, ikke at doc-objekter deles."*

**Den hensigt er ikke opfyldt.** Cachen i `db/hent.mjs` er
**proces-intern** (`let raaCache = null`), og hvert `build.mjs`-kald er sin egen
proces. Planens punkt bærer i øvrigt **intet** forbehold om rækkefølge eller om
parring med et andet spor.

---

## Grundmåling — orkestratorens egne tal på `7b169b7`, 4. sep 2026

Genmål dem som din første kommando efter skill-kaldet, og skriv dine egne tal.
**Afviger noget, er det en del af leverancen at rapportere det, ikke ulydighed.**

| Kommando | Mit tal |
|---|---|
| `node tools/validate.mjs` | **77 filer · 0 fejl · 1 advarsel** (Ghost Vision 60's R9, 9,6 %) |
| `node tools/build.mjs` | **216 sider · 1.111 tal med kilde · 0 uden** |
| `node tests/koer.mjs` | **1817 bestået / 6 fejlet** — målt af mig, ikke citeret |

De 6 røde ved navn, så du kan sammenligne fejltekster og ikke nettotal: `4c`
(Spots "strøm ud") · `259 forbehold mærket "gyldighed"` · `(d) fixture
(addverb-trakr-20)` · `64.3: grundlag — unitree-aliengo.yaml` · `64.3:
/da/robotter/unitree-aliengo/ viser stadig "UDEN batteri"`. **Alle var røde før
dig.**

**Tidsmålingen, som er hele opgavens anledning** — målt af mig, ét sample hver,
så tag dem som størrelsesorden og genmål selv:

```
node tools/build.mjs                       2,78 s   (DB-vej)
node tools/build.mjs --data=data/robots    1,65 s   (fil-vej)
                                          ------
forskel pr. kald                          ~1,13 s
```

**Miljø:** node er `/c/Program Files/nodejs/node.exe`, **ikke** på PATH i Git
Bash. `.env` og de 610 fabrikantfotos er kopieret ind i din worktree — tjek med
`ls assets/fotos/fabrikant | wc -l` (skal give 610). Din port, hvis du får brug
for en: **8127**, aldrig 8080.

**Node-fælde, der rammer dig direkte:** har en fil lavet et `fetch()`, må du
**aldrig** kalde `process.exit()` bagefter — sæt `process.exitCode`. Ellers
crasher node v24.13.0 med libuv-assertionen `!(handle->flags &
UV_HANDLE_CLOSING)` og exit 127. `process.exit()` **før** det første `fetch`
(argumentfejl, manglende `.env`) er ufarligt.

**Disk:** ~20 GB fri, én suitekørsel ~2,8 GB. `spor/opdel` kører parallelt og
bruger også ~2,8 GB. Ryd `tests/.tmp-koersel` i din worktree mellem kørsler.

---

## Opgaven

Gør cachen i `db/hent.mjs` **proces-krydsende**, så en hel suitekørsel udfører
ét REST-kald i stedet for 39.

### Punkt 1 — DEN HÅRDE BETINGELSE, som skal designes ind fra starten

**Cachen må være aktiv KUN når en env-variabel er sat, og kun `tests/koer.mjs`
må sætte den.** `node tools/build.mjs` kørt i hånden skal fortsat lave et ægte,
frisk REST-kald hver gang.

**Hvorfor det ikke er til forhandling:** fase 3's første halvdel blev flettet på
netop denne negative kontrol (Å178):

> *"`SUPABASE_URL=<ugyldig>` giver exit 1, 0 sider og `"fetch failed"`. Uden den
> sidste kunne `0 forskelle` have betydet, at DB-vejen i smug læste YAML'en — og
> så beviste beviset ingenting."*

**En cache, der er tændt som standard, ødelægger det bevis:** med en varm cache
ville en ugyldig URL stadig bygge 216 sider, og fase 3's eneste garanti for, at
databasen faktisk læses, ville være væk. Cachen skal være et **testtilbehør**,
ikke en ændring af produktionsvejen.

**Acceptkriterium 1 (REGRESSIONSVÆRN — det giver det RIGTIGE svar allerede i
dag, og det skal det blive ved med):**
```
SUPABASE_URL=https://ugyldig.invalid node tools/build.mjs --ud=<tmp>/negativ
```
giver **exit 1**, **0 sider** og en fejltekst med `fetch failed`.
*Giver i dag: præcis det. Kør det FØR din ændring og skriv outputtet, og igen
BAGEFTER. Ændrer det sig, har du brudt fase 3's bevis.*

### Punkt 2 — cachen selv

Cache `fraDb()`s **rå** svar (de 77 danske kanoniske robot-objekter), ikke de
færdige docs. `db/hent.mjs`s eksisterende kommentar forklarer hvorfor, og den
begrundelse gælder uændret:

> *"normaliserRobot() … normaliserer "PAA STEDET" … og MUTERER doc'en. Havde
> cachen delt selve doc-objekterne, ville validate.mjs's normalisering ramme de
> SAMME objekter, build.mjs saa laeste bagefter."*

Så: skriv `raa` til en fil som JSON, læs den tilbage, og kør derefter
`byggRobotDoc`/`skrivRobotYaml`/`parseYaml` **på ny** for hvert kald, præcis som
i dag. Hver kalder skal stadig få sine egne, urørte doc-objekter.

**Placering:** en gitignoreret sti. `tests/.tmp-koersel` er allerede
gitignoreret og pr. worktree — men den ryddes mellem kørsler, så vælg selv og
**skriv valget og begrundelsen i rapporten**. Krav til stien: den skal være pr.
worktree (ikke delt mellem `spor/opdel` og dig), og den skal være gitignoreret.

**Acceptkriterium 2:** efter en fuld suitekørsel giver `git status --short`
**ingen linjer** for cachefilen.
*Giver i dag: filen findes ikke.*

### Punkt 3 — mål, at det faktisk blev til ét kald

Instrumentér **midlertidigt** `db/hent.mjs`, så hvert ægte `fetch` skriver én
linje til en logfil. Kør hele suiten. Tæl linjerne. Fjern instrumenteringen
igen. **Skriv i rapporten, at du gjorde alle fire ting, og hvad tællingen gav
begge gange.**

**Acceptkriterium 3:** linjetallet er **1** efter din ændring.
*Giver i dag: **39** — det er antallet af `build.mjs`-kørsler i `tests/dele/`
uden `--data=`.*

**Mit tal er målt sådan, og metoden er værd at kende, fordi to tidligere
optællinger var uenige (58/17/41 mod 56/17/39):** `--data=` står på **næste
linje** efter `spawnSync(`, så et linjebaseret `grep` kan ikke tælle det. Målt
med balanceret parentesmatch fra `spawnSync(` til dens lukkende `)`:
**56 kørsler i alt · 17 med `--data` · 39 uden**, fordelt på **38 filer**. De 17
rammer Å178's tal præcist, hvilket er kontrollen på, at parsingen er rigtig.
**Genmål det selv — 39 er et målt tal, ikke et krav, og hvis `spor/opdel`s
arbejde ændrer testdele, kan det flytte sig.**

### Punkt 4 — beviset: bygget er uændret

**Acceptkriterium 4:** `diff -r` mellem `dist/` bygget med varm cache og
`dist/` bygget uden cache giver **0 linjer**, og begge kørsler siger **216 sider
· 1.111 tal med kilde · 0 uden**.

*Giver i dag (maalt af mig paa 7b169b7, saa apparatet er valideret foer du faar det): to identiske byg giver **0** · indsat linje giver **3** · fjernet igen giver **0** · **216/216** HTML-sider i hver. Ram ikke mit tal 3 — det afhaenger af, hvilken linje du indsaetter.*

**Kontrafaktisk, obligatorisk:** indsæt en linje i én HTML-fil i den ene mappe,
kør `diff -r` igen (skal give >0), fjern den, kør igen (skal give 0). **Skriv
begge tal.** Uden den måler `0 forskelle` lige så godt et ødelagt apparat som et
korrekt resultat.

### Punkt 5 — den gamle cache må ikke kunne servere gamle data

En proces-krydsende cache indfører en fælde, den proces-interne ikke havde:
**en cachefil, der overlever, serverer i morgen de data, den hentede i går.**
Peer-sessionen retter lige nu robotdata **i databasen**, så det er ikke et
teoretisk problem.

`tests/koer.mjs` skal derfor **slette cachefilen ved suitens start**, så hver
suitekørsel henter friskt netop én gang.

**Acceptkriterium 5, og det skal være en KØRT kontrafaktisk, ikke en påstand:**
kør suiten, ret ét felt i cachefilen på disken til en værdi, der ville være
synlig i `dist/`, kør suiten igen, og vis at den ændrede værdi **ikke** slår
igennem — fordi filen blev slettet ved start. **Skriv kommandoen og begge
udfald.**

**Hvorfor:** en stale cache giver grønne tests på forkerte data. Det er den
værste fejlmode, denne opgave kan indføre, og den er tavs.

### Punkt 6 — suiten skal give samme resultat og være hurtigere

**Acceptkriterium 6:** `node tests/koer.mjs` giver **samme beståtal og samme
seks navngivne røde som din egen grundmåling**. De røde sammenlignes **ved
navn**, ikke som nettotal.

**Acceptkriterium 7:** suitens vægur er lavere end din egen grundmåling. **Skriv
begge tal (før og efter) i sekunder.** *Mit estimat er, at der er ~44 s at
hente (39 × 1,13 s), men Å178 skriver ~2 min. **Begge er estimater, ingen af dem
er et krav.** Mål det faktiske og skriv det — ram ikke mit tal.*

---

## Filejerskab — komplet, og ingen fil deles med et andet spor

**Du ejer og må skrive i:**
```
db/hent.mjs
tests/koer.mjs
.gitignore
fund/FUND-dbcache.md       (din rapport)
```

**Du må IKKE røre** — de ejes af andre lige nu:
```
tools/yaml.mjs, tools/enheder.mjs, tools/skema.mjs,
tools/skabelon/side.mjs, tools/validate.mjs, tests/dele/_faelles.mjs   spor/opdel
assets/system.css, tools/skabelon/katalog.mjs      peer-sessionens spor/katalogskaerm
data/robots/*.yaml                                 peer-sessionens to datasporer
tests/dele/*.mjs                                   spor/opdel kan komme til at røre dem
PLAN.md, STATUS.md, CLAUDE.md                      orkestratoren
db/eksporter.mjs                                   rør den ikke — se nedenfor
databasen                                          LÆS KUN. Skriv aldrig, ingen DDL
```

**Om `db/eksporter.mjs`:** den er på fase 3's oprindelige sletteliste, men kan
ikke slettes. Målt af mig, og det er mere end Å178 vidste: den er spærret **to
steder**, ikke ét — `db/hent.mjs:35` **og** `tests/dele/63-ordbog-og-skema.mjs`
på linje **180** (`omdanRobotFraDb`, `byggRobotDoc`, `skrivRobotYaml`) og **223**
(`boerFlyttes`). Du skal ikke gøre noget ved det; det er skrevet her, så du ikke
bruger tid på at overveje at flytte noget derfra.

---

## Commit-rækkefølge

1. Punkt 1's negative kontrol kørt og skrevet ned (ingen kodeændring endnu) —
   commit din måling som en note i rapportfilen, så baselinen findes, hvis
   sporet dør
2. `db/hent.mjs`: cachen, bag env-variablen (punkt 1 og 2) + `.gitignore`
3. `tests/koer.mjs`: sætter variablen og sletter cachen ved start (punkt 5)
4. `fund/FUND-dbcache.md`

Efter commit 2 skal `node tools/build.mjs` **uden** variablen stadig lave et
ægte kald og fejle på en ugyldig URL. Virker det ikke, så stop og ret der.

---

## Til sidst

**Briefets fakta er påstande.** 39 kald, 1,13 s pr. kald, de to blokerede steder
i `db/eksporter.mjs`, citaterne fra `db/hent.mjs` og PLAN.md — alt er målt eller
slået op af mig på `7b169b7`. **Afviger din måling, så skriv afvigelsen. At
modsige mig er en del af leverancen.**

**Rapportér ærligt hvad du ikke nåede.** Højst 60 linjer plus de to
obligatoriske sektioner uden for loftet. **Høj konfidens kræver en genkørbar
kommando PLUS en kontrafaktisk linje** — ellers er den middel. Punkt 1 og punkt
5 er de to, hvor en middel-konfidens er dyr: den ene bevarer fase 3's bevis, den
anden forhindrer grønne tests på gamle data.
