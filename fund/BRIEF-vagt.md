# BRIEF — spor/vagt: en sessionsvagt, der siger til, før konteksten bliver dyr

**Model: Sonnet. Arbejdsmappe: `C:\Praktik\websites\udstilling-wt-vagt`. Gren: `spor/vagt`.**

Rør aldrig `c:\Praktik\websites\udstilling` (hovedrepoet, to sessioner arbejder i
det), `c:\Praktik\websites\salg` eller `c:\Praktik\website`.

## Regel 0 — kald `spor`-skillen som din FØRSTE handling

Den bærer metoden: grundmåling, kontrollinje før hver måling, skrive-grænse,
filejerskab, selv-efterprøvning med tælling, rapportform og miljøfælderne.
Lykkes kaldet ikke fra din worktree, så læs `.claude/skills/spor/SKILL.md` fra
disk og **skriv i rapporten, at du gjorde det.**

Skillen er ny (bygget i dag). **Finder du noget i den, der er forkert eller
mangler, så skriv det i rapporten** — den har aldrig været brugt før dig.

Øvrige skills at vurdere: `fejljagt` hvis en måling opfører sig uventet.
`robotdata` og `supabase` er IKKE relevante her — dit spor rører hverken
robotdata eller databasen.

## Hvorfor du findes

JPK spurgte, hvornår man skal starte en ny session frem for at komprimere.
Målt over syv dage i dette projekt:

| Måling | Tal |
|---|---|
| Andel af input, der er cache-læsninger | 98,5 % |
| Gennemsnitlig kontekst pr. API-kald | 237.000 tokens |
| API-kald pr. besked fra JPK | 58 |
| Cache-læsningernes andel af inputregningen | 84 % |
| Komprimeringer i den nuværende session | 14 |

Konteksten læses om på **hvert** kald til ti procent af fuld pris. Den er
derfor en løbende skat, ikke en engangsudgift. Og prompt-cachen lever **én
time**: går der længere mellem to beskeder, betales hele konteksten forfra som
en cache-skrivning.

Ingen af de to grænser kan et menneske se. Det er dét, du bygger.

## Opgaven — tre punkter, i denne rækkefølge

**Skriv KUN punkt 1's kode, mål den, commit — og først DEREFTER punkt 2.**
En instruks om commits alene ændrer ikke skrivevanen; det er en skrive-grænse.

### Punkt 1 — `.claude/hooks/sessionsvagt.mjs`

Et `UserPromptSubmit`-hook. Node, **nul afhængigheder**, som resten af projektet.

Det får et JSON-objekt på stdin med blandt andet `transcript_path` og
`session_id`. Det skal:

1. **Læse KUN halen af transskriptet.** Filen er målt til **65 MB** og 27.147
   linjer i den nuværende session. Læser du hele filen på hver besked, er
   vagten selv dyrere end det, den måler. Læs de sidste ~256 KB med
   `fs.createReadStream` med `start`-offset udregnet af `fs.statSync().size`.
   **Dette er kravet, der betyder mest.**
2. **Finde den faktiske kontekststørrelse.** Den står i transskriptet og skal
   ikke skønnes: sidste `"usage"`-objekt, summen af `input_tokens` +
   `cache_creation_input_tokens` + `cache_read_input_tokens`. Målt i den
   nuværende session: 2 + 2699 + 308217 = **310.918**.
3. **Finde tiden siden sidste aktivitet** fra det seneste `"timestamp"`-felt i
   halen.
4. **Tie, medmindre en grænse er krydset.** Ingen udskrift, exit 0.

**De to grænser er KRAV, ikke gæt.** Læg dem i navngivne konstanter øverst i
filen med en kommentarlinje om, hvor tallet kommer fra:

- `KONTEKST_GRAENSE = 300_000` — over gennemsnittets 237k, under den nuværende
  sessions 311k, så den fyrer på en session som denne og ikke på en frisk.
- `CACHE_TTL_MINUTTER = 55` og `CACHE_MIN_KONTEKST = 100_000` — cachen lever
  en time; 55 giver margin. Under 100k er genopbygningen billig nok til at
  tie.

**Udskriften, når en grænse er krydset**, er samme form som det hook, der
allerede ligger i `.claude/settings.json` — ét JSON-objekt på stdout:

```
{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"..."}}
```

Teksten i `additionalContext` skal henvende sig til **assistenten**, ikke til
JPK, og bede den tilbyde en overlevering. Den skal bære **tallene**, så
assistenten ikke skal måle dem igen: kontekststørrelsen, og ved cache-grænsen
også minutterne siden sidst.

**To ting mere, begge krav:**

- **Fejl må ALDRIG blokere JPK's besked.** Hele arbejdet i en `try`, `catch`
  som tier, og altid exit 0. Findes `transcript_path` ikke, er filen tom, eller
  er JSON'en uparsebar: tie.
- **Skriv en kommentar i filens hoved om, at hooken først virker i sessioner
  startet EFTER flettet.** Registreringen sker ved sessionsstart, ligesom for
  skills. Uden den linje fejlsøger den næste agent en hook, der ser død ud men
  er rigtig. *(Peer-sessionens observation, og den er god.)*

**Et `--selvtest`-flag** er et krav, ikke pynt: en tavs hook og en død hook ser
ens ud. Det skal køre mod indbyggede syntetiske transskript-uddrag og printe et
tal for hver af de fire tilstande.

**Acceptkriterium, kørt mod main i dag:**
```
ls .claude/hooks/sessionsvagt.mjs        giver i dag: No such file or directory
```
Færdig, når filen findes, og når `node .claude/hooks/sessionsvagt.mjs --selvtest`
printer **fire** linjer med tal: under begge grænser 0 udskrifter · over
kontekstgrænsen 1 · over cachegrænsen 1 · ugyldigt input 0 udskrifter og exit 0.

### Punkt 2 — registrér hooken i `.claude/settings.json`

Tilføj den som et **ekstra** `UserPromptSubmit`-hook ved siden af det
eksisterende projektregel-hook. **Slet eller ændr ikke det eksisterende** —
det bærer projektreglen om skill-vurdering og ejes ikke af dig.

Brug Edit-værktøjet, ikke `sed`. Filen er JSON: efterprøv bagefter, at den
stadig kan parses.

**Acceptkriterium, kørt mod main i dag:**
```
node -e "const j=JSON.parse(require('fs').readFileSync('.claude/settings.json','utf8'));console.log((JSON.stringify(j.hooks||{}).match(/sessionsvagt/g)||[]).length)"
giver i dag: 0
```
Færdig, når det giver **1**, og når det eksisterende hook stadig er der
(samme kommando med `PROJEKTREGEL` i stedet for `sessionsvagt` skal give
mindst 1 både før og efter).

### Punkt 3 — testen: `tests/dele/73-sessionsvagt.mjs`

**Nummeret 73 er TILDELT af orkestratoren. Vælg det ikke selv, og skift det
ikke.** 72 er reserveret af et andet spor, der kører lige nu, og som du ikke
kan se. Læs `tests/LAESMIG.md`s kontrakt.

Testen skal dække vagtens **beslutning**, ikke dens formatering: at den tier
under grænserne, at den taler over hver af dem, og at ugyldigt input giver
tavshed og exit 0. Importér de rene funktioner fra hook-scriptet frem for at
starte en proces, hvor det kan lade sig gøre — det er hurtigere og mere
præcist. Del derfor scriptet i en ren beslutningsfunktion og en tynd
I/O-indpakning.

**Acceptkriterium, kørt mod main i dag:**
```
node tests/koer.mjs        giver i dag: 1658 bestaaet, 0 fejlet
```
Færdig, når tallet er **1658 plus dine nye tests, 0 fejlet**. Det er en
**forudsigelse**, ikke et krav: mål det faktiske tal og skriv det. Rammer du
ikke 1658 som udgangspunkt, er det et fund — meld det.

## Grundmåling — dine FØRSTE kommandoer

Kør dem, før du ændrer noget, og skriv tallene i rapporten. Alle er målt af mig
på main umiddelbart før afsendelse:

```
node tools/build.mjs        # KØR DENNE FØRST — dist/ er gitignoreret og 13 tests kraever den
node tools/validate.mjs     # mit tal: 77 filer / 0 fejl / 1 advarsel
node tests/koer.mjs         # mit tal: 1658 bestaaet, 0 fejlet
```

`assets/fotos/fabrikant/` er kopieret ind for dig (**610** filer — efterprøv).
`.env` og `media/_kilder/` er **ikke** kopieret ind, og du skal ikke bruge dem.

## Filejerskab — kun disse fire

```
.claude/hooks/sessionsvagt.mjs      NY
.claude/settings.json               KUN tilfoeje ét hook, aendr intet andet
tests/dele/73-sessionsvagt.mjs      NY
fund/FUND-vagt.md                   NY, din rapport
```

**Rør intet andet.** Særligt ikke `db/`, `data/robots/`, `assets/system.css`,
`tools/side.mjs`, `PLAN.md`, `DATAFLOW.md`, `STATUS.md`, `CLAUDE.md`, eller
nogen anden fil i `tests/dele/`. Tre andre spor kører samtidig.

**Kør IKKE `db/`-scripts.** Dit spor rører ikke databasen.

## Prisen

Dit spor er anslået til **150.000-250.000 tokens** af JPK's grænse. Er du på vej
langt over, så commit det, du har, og skriv i rapporten hvor du står, frem for
at fortsætte i tavshed.

## Briefets fakta er påstande

Alle tal ovenfor er **mine målinger, ikke sandheder**. Afviger noget, du måler,
så **rapportér afvigelsen — det er leverance, ikke ulydighed.** Fire agenter
rettede mine fakta på én dag i går, alle fire korrekt.

Særligt: jeg har målt transskriptets `usage`-felt i **min egen** session. Er
formatet anderledes i en frisk session, er det et fund, og din vagt skal
håndtere begge former eller tie.
