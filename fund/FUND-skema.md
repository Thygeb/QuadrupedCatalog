# FUND-skema.md — spor/skema (FASE 1 af L81–L83)

## Regel 0 — skill
Kaldte `supabase-postgres-best-practices` (lykkedes fra worktreen, base sti
viste hovedrepoets disk — samme "virker nogle gange" som CLAUDE.md nævner;
ingen disk-fallback nødvendig). Gik forbi `robotdata` (ingen dataindsamling
her) og `brief` (bruges af orkestratoren, ikke af mig).

## Valgt vs. fravalgt (ordbog, hvor jeg afveg fra ankeret)
- `synk_aftryk` → **ikke oversat**, table i `TABELLER_FJERNET` — droppes (vagtede en skrivevej der selv forsvinder).
- `ophav`/`ophav_enum` → `origin`/`origin_enum`, **ikke** `provenance` — orkestrator rettede: `provenance` var allerede `herkomst` (`state_with_provenance`).
- `ikke_oplyst` → `not_stated`, **ikke** `undisclosed` — orkestrator rettede mod `data/i18n/en.json`s faktiske ordvalg.
- `fremdrift` → `locomotion`, **ikke** `propulsion` — samme rettelse (propulsion = motorkraft).
- `hentet` → `retrieved_at`, `haeldning` → `slope` — samme rettelse.
- `gruppe` → `field_group`, **ikke** `group` — selv fundet: `GROUP` er reserveret Postgres-nøgleord.
- `min`/`maks`/`pos` → `minimum`/`maximum`/`position` — "hele ord, ingen forkortelser" taget bogstaveligt.
- `caveat_class` (advarsel_klasse) → **`validity`/`elaboration`** (rettet, commit 9/7). Stod oprindeligt uoversat med henvisning til briefets liste — orkestrator rettede: briefets liste var ufuldstændig, ikke et bevidst fravalg.
- Eksporterens PostgREST-hint → **kolonnenavn (`robot_id`)**, ikke constraint-navn (rettet, commit 10/7) — et constraint-navn er ikke stabilt mellem en frisk installation og den levende, migrerede database.

## Konfidens pr. punkt
- **Høj**: A1, A2, A4, A6–A13, (a)-(e)+(d2) i test 63, alle tre efterfølgende rettelser (8/7-10/7) — alle genkørbare kommandoer, vist ovenfor. Kontrafaktisk: forkert ordbog/skema → (b)/(c)/(d) fejler synligt (vist ved bevidst korruption, se punkt 6, og gentaget for (d2) ved den faktiske caveat_class-værdi på addverb-trakr-20).
- **Middel**: punkt 4 (eksporter.mjs) — fixturen er en HÅNDBYGGET simulering af PostgREST, ikke den levende, migrerede database (A14 kan ikke køres, se nedenfor). Kolonnenavns-hintet ER dog efterprøvet direkte mod den levende instans (HTTP 200, læse-kun GET) — det er høj konfidens for SELVE hintet, middel for at hele `--fra-db`-vejen virker end-to-end.
- **Lav**: ingen.
- A3/A5 er **målt, ikke tvunget til facit** — se nedenfor.

## Målingerne
Grundmåling (før noget rørt, matcher briefets tal præcist): validate 77/0/1 · build 216/1111/0 · tests 1534/0, Validator 71/71 · eksport-fra-DB 77/0.

A1 ✓ (jsonb) · A2=1 ✓ · **A3=10, IKKE 0** (alle 10 er danske ORD i prosa — "77 robotter", "et billede" — eller bevidste historiske referencer, ingen er en SQL-identifikator; grep skelner ikke sprog fra syntaks) · A4=0/0 ✓ · **A5=2, IKKE 0** (to historiske kommentarer i `ordbog.mjs`/`byg-migrering.mjs` der forklarer hvorfor `--til-db` ikke findes mere — ingen funktionel kode) · A6=0 ✓ · A7=6 ✓ (≥2) · A8=5 ✓ · A9=0 ✓ (fandt og rettede en selv-indført regression i den afsluttende fejekørsel — se fælder) · A10=0 ✓ · A11=0 ✓, genkørt efter hver af de tre efterfølgende rettelser (diff tomt hver gang) · **A12 uændret** 77/0/1 · 216/1111/0 (genmålt efter ALT, inkl. de tre rettelser) · **A13 = 1436 bestået, 0 fejlet, Validator 71/71** (grundtal 1534 − 98; fem filer slettet ~113–114 statiske `ok()`, 19 i test 63 efter rettelserne — 18 fra commit 6/7 plus 1 ny eksplicit (d2)-assertion i commit 9/7 — lille metodeforskel statisk/runtime, ikke forsøgt tvunget til et pænt tal).

**Orkestratorens tre eftermålinger, alle bekræftet:** `'physics'|'yes_no'|'mass'` i `migrering-engelsk.sql` = 4 (krævet ≥3) · `'validity'` på tværs af `skema.sql`+`migrering-engelsk.sql`+`ordbog.mjs` = 1+2+1=4 (krævet ≥3) · `'gyldighed'` i `skema.sql` = 0 (var 1, fandt en ANDEN kommentarlinje der også skulle omskrives) · `_fkey` i `eksporter.mjs` = 0 (var 4, deraf 2 i kommentar — kommentaren omskrevet, ikke kun fjernet).

**A14 kan IKKE køres** (den levende DB er stadig dansk). Forventet kommando og resultat, EFTER orkestratoren har anvendt `db/migrering-cert.sql` og dernæst `db/migrering-engelsk.sql`:
```
node db/tjek.mjs
```
Forventet: `77/77 dybt lig · validate 0 fejl · build sider 216=216 · kilder 1111=1111`.

## Usikkerheder
- Fixture (punkt 6d) dækker IKKE `varianter`/`ved_last`-oversættelsen (addverb-trakr-20 har ingen af delene) — ordbogens egne enum-labels dækker dem strukturelt (tilstand_enum bruges ens begge steder), men ingen ende-til-ende-test kører den gren.
- Migrerede FK-/CHECK-/indeks-navne forbliver danske på den LEVENDE database efter migrering (kun `robots_locomotion_check`, `images_alt_form` og `field_entries_caveat_class_valid` fik nye navne, fordi deres VÆRDIER skulle ændres) — en frisk `skema.sql`-installation ville give rene engelske navne for resten. Dokumenteret i `db/LAESMIG.md`, ikke rettet (uden for punkt 2's opgave) — men eksporterens PostgREST-hint er rettet til at være stabilt på tværs af begge (commit 10/7).

---

## Nye fælder og opdagelser
1. **`GROUP` er et reserveret Postgres-nøgleord** — `gruppe → group` ville have givet en syntaksfejl i `ALTER TABLE ... RENAME COLUMN gruppe TO group`. Fanget ved systematisk grep af alle 65 RENAME-mål mod nøgleordslisten, ikke ved at køre migreringen (jeg har kun læseadgang).
2. **`ALTER TABLE/TYPE ... RENAME` ændrer IKKE en eksisterende constraints/indeks' eget, autogenererede navn** — kun tabellens/kolonnens, og navnet blev sat ved CREATE TABLE-tid. Konsekvensen ramte to steder: `db/eksporter.mjs`s PostgREST-select (rettet, commit 10/7 — se punkt 7 nedenfor) og selve dokumentationen i `db/LAESMIG.md` (som først dokumenterede FEJLEN som var den en løsning). Fundet ved rå `pg_constraint`-læsning, ikke gættet.
3. **`billede.alt` er ALLEREDE `jsonb` live** (Å115s rettelse), constraint hedder `billede_alt_form` — `migrering-engelsk.sql`s F4 blev derfor en vagtet OMDØBNING, ikke en ny oprettelse. Havde jeg gættet i stedet for at læse, ville jeg have skrevet en duplikeret constraint.
4. **Briefets påstand om `60-i18nfelt.mjs` er ikke helt præcis**: "alle om mekanismer der ophører" — punkt 1–3 af filens seks punkter tester `tools/validate.mjs`s R22 og `tools/build.mjs`s sprogvalg, som IKKE røres af L81–L83 og forbliver i drift. Kun punkt 4–5 er om den fjernede DB-retning. Slettet som instrueret (uden for min filejerskab at genskabe validate.mjs-dækning), men flagget her — orkestratoren bør afgøre om R22 skal have en ny testhjem.
5. **Egen A9-regression**: en senere redigering (punkt 5, commit 8adf5bc) genindførte utilsigtet den præcise streng "FORBEREDT, IKKE KOERT" i en historisk kommentar. Fanget i den AFSLUTTENDE A1–A11-fejekørsel (ikke undervejs) — retter CLAUDE.md's egen lærdom om at grundmåle FØR man konkluderer "færdig": jeg havde erklæret A9 opfyldt i commit 4/7's besked, og det var sandt DER, men ikke efter commit 5/7. Rettet i egen commit.
6. `applications`/`images` mangler indeks på deres sekundære FK (`inherited_from_robot_id` findes, `shared_with_robot_id` gør ikke) — efterprøvet mod `b5bb73d`: samme hul fandtes i originalens `billede.delt_med_robot_id`. Ikke en regression, ikke rettet (uden for en ren omdøbnings scope).
7. **Orkestrator-review fandt tre yderligere huller** (rettet i commits 8/7–10/7): (a) `db/byg-migrering.mjs` oversatte aldrig `feltdefinitioner`s egne etiketter (gruppe/art/dimension/ogsaa_dimension), selvom ordbogen definerede dem — generatoren læste dem bare ikke; (b) `caveat_class` (gyldighed/uddybning) stod uden for briefets liste, men er et lukket sæt på to ord ligesom `fremdrift`; (c) PostgREST-hintet ved constraint-navn (punkt 2 ovenfor) ville have fejlet mod en frisk installation. Alle tre er eksempler på samme mønster: en oversættelse, der virker på PAPIRET (ordbogen er komplet, byte-lig-testen er grøn), men som et konkret, målt scenarie (den levende databases faktiske constraint-navne, den fulde kolonneliste) viste var ufuldstændig. Ingen af de tre blev fanget af test 63's egne assertions FØR orkestratorens review — (a) og (b) BURDE i princippet være fanget af (b)-testens skema.sql↔ordbog-bijektion, men den test sammenligner kun IDENTIFIKATORER (kolonnenavne), ikke DATAVÆRDIER, og fangede derfor aldrig at værdierne selv ikke blev oversat.
8. **`field_definitions` er nu en HÅNDHOLDT kopi** af `tools/skema.mjs`s `FELTER`, siden `db/migrer.mjs` (den eneste skriver, der genskrev tabellen ved hver `--til-db`) er slettet. Intet i koden opdaterer den længere automatisk — ændres `FELTER`, skal `field_definitions` rettes manuelt. Dokumenteret i `db/LAESMIG.md`, ikke rettet (ingen ny skrivevej var del af opgaven).
9. **PostgREST's skemacache kan halte lige efter en DDL-ændring** — kører `eksporter.mjs --fra-db` umiddelbart efter `apply_migration`, og den fejler med 404/`PGRST205`, er det ikke en fejl i selve migreringen. `notify pgrst, 'reload schema';` og prøv igen. Dokumenteret i `db/LAESMIG.md` (orkestrator-anmodet, ikke selv fundet).

## Punkter i briefet, jeg ikke nåede
- Ingen. Alle punkter (1–7) er udført og committet, plus tre opfølgende rettelser fra orkestrator-review (8/7–10/7); A14 er bevidst ikke kørt (kræver skriveadgang, jf. briefets egen grænse) — forventet kommando/resultat står ovenfor.

## Forældede afsnit i DATAFLOW.md (rørt IKKE — til orkestratoren)
- **Diagram 1** ("En ny robot findes"): trin `O->>S: node db/migrer.mjs --til-db` er en død kommando — filen er slettet, og L81 vender selve retningen (databasen er kilden, ikke YAML). Hele diagrammet bygger på "agent skriver YAML → migreres ind" og bør tegnes om.
- **Diagram 2** ("JPK retter i Studio"): trinnet `JPK->>M: node db/migrer.mjs --til-db` og noten "Glemmer man eksporten, stopper næste migrering af sig selv" beskriver `synk_aftryk`-vagten, som er erstattet af `change_log` (logger EFTER en ændring, stopper ikke en migrering FØR — der er ingen migrering at stoppe længere). Trin 1 (`eksporter.mjs --fra-db`) er fortsat korrekt.
- **"Hvor flowet kan stoppe"-tabellen**, rækken "Vagten": beskriver `--til-db`s nægtelse, som ikke findes mere.
- **"Status, 25. aug 2026"-afsnittet**: nævner "vagten i `--til-db` (L35)" som en del af det efterprøvede flow — samme forældelse.

## Commits (11 stk., kronologisk)
1. `15f0777` — (1/7) db/ordbog.mjs
2. `358d78e` — (1b/7) fem navne rettet efter review
3. `48764c4` — (2/7) SQL genereret fra ordbogen, plus migrering-cert.sql
4. `a23e40c` — (3/7) db/skema.sql omskrevet, engelsk
5. `ffd7320` — (4/7) db/eksporter.mjs + db/tjek.mjs
6. `8adf5bc` — (5/7) den ene retning lukkes (sletninger, dokumenter)
7. `906a966` — (6/7) tests: 5 slettet, 63 tilføjet
8. `bac37d7` — A9-regression rettet (selv fundet, egen commit)
9. `2ffde6e` — (7/7) fund/FUND-skema.md, første udgave
10. `b645256` — (8/7) field_definitions' egne etiketter oversat (orkestrator-fund)
11. `6ec9129` — (9/7) caveat_class (gyldighed/uddybning) oversat (orkestrator-fund)
12. `5b34abc` — (10/7) eksporterens embed-hint: kolonnenavn i stedet for constraint-navn (orkestrator-fund)
13. (denne commit) — fund/FUND-skema.md opdateret med de tre rettelsers tal
