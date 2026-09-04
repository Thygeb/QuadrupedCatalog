# FUND — spor/sletning

**Skill:** `spor` (kaldt via Skill-værktøjet, lykkedes — intet fallback til disk nødvendigt).
Øvrige skills vurderet og fravalgt, som briefet selv sagde: hverken `robotdata`, `design` eller
`supabase`-skillene passer på en mekanisk kildesletning. `.env` kopieret ind som første handling.

## Valgt løsning / fravalgt alternativ

- **Punkt 1:** fjernede den døde `'data/robots'`-fallback på linje 1350 · fravalgt: at lade linjen
  stå, fordi den aldrig blev læst i praksis (se "Nye fælder").
- **Punkt 2:** genbrugte den eksisterende `db/eksporter.mjs --fra-db`-subprocesvej til `--liste`/
  `--kun` · fravalgt: en statisk `import { hentRobotter } from './hent.mjs'` i `db/tjek.mjs`, som
  ville lukke en importcyklus (tjek → hent → eksporter → \[dynamisk\] tjek) og ramme *hver* kørsel
  af validate.mjs/build.mjs, ikke kun `db/tjek.mjs` selv.
- **Punkt 3 (64/76):** genbrugte samme `db/eksporter.mjs --fra-db`-subproces til scratch-mapper ·
  fravalgt: `hentRobotter()` direkte, fordi den giver genparsede objekter, ikke rå YAML-tekst, og
  der findes ingen objekt→YAML-serialiserer uden for `skrivRobotYaml` (kræver `byggRobotDoc()`s
  rå Supabase-rækkeform, som `hentRobotter()` ikke har).
- **Punkt 4b:** brugte briefets eget forslag (db/hent.mjs uden POST/PATCH/DELETE), skærpet med
  `\b`-ordgrænser · fravalgt: et råt substring-match, fordi `db/eksporter.mjs` er fuld af
  "POSTGREST" og ville false-positive.

## Konfidens pr. punkt

Alle seks punkter: **høj**. Hvert acceptkriterium er målt med en genkørbar kommando, og hver har
en kontrafaktisk linje (se "Målinger som tal"). Punkt 1 og 2 er desuden dobbelttjekket ved
fysisk at flytte `data/robots/` væk *før* sletningen og køre kommandoen mod dens fravær.

## Usikkerheder

- Punkt 3's to "special"-filer (64, 76) laver nu hver én ekstra, **ukachet** REST-hentning pr.
  suitekørsel (uden for `fund/BRIEF-dbcache.md`s ét-kald-løfte). Ikke rettet — se "Nye fælder".
- 4b's nye assertion er briefets eget forslag, ikke egenudviklet — jeg vurderer den skarp nok
  (verificeret at "POSTGREST" ikke false-positiver), men den håndhæver kun `db/hent.mjs`s
  kildetekst, ikke et faktisk HTTP-kald i køretid.

## Målinger som tal

- **Punkt 1:** `data/robots/` flyttet væk → `node tools/validate.mjs` (ingen flag) → **77/0/1**,
  identisk med mappen til stede. `SUPABASE_URL=<ugyldig>` → **exit 1**. Kontrafaktisk: pegede
  fallback'en stadig på disk, ville kommandoen fejle med "Ingen YAML-filer i …/data/robots".
- **Punkt 2:** samme flytning → `node db/tjek.mjs` → **exit 0**, validate 0 fejl, build
  216=216 sider, 1111=1111 kilder. `--liste`/`--kun` afprøvet samtidig, begge exit 0.
- **Punkt 3+4 (kombineret grep):** `grep -rlE "rod, *'data', *'robots'|rod, *'data/robots'"
  tests/dele/*.mjs \| wc -l` → **0** (var 17). Kontrol: `22-kildetjek.mjs` (temp-rod-fixture)
  giver 0 både før og efter.
- **Punkt 5:** `grep -rl "db/hentbyg\.mjs" tests/ tools/ db/ --include=*.mjs` → **0** efter
  (var 2 før, ikke 1 — se "Nye fælder").
- **Punkt 6:** `ls data/robots 2>/dev/null | wc -l` → **0**. `git ls-tree -r HEAD --name-only`
  har **0** stier under `data/robots`.
- **Suiten, endelig, med `data/robots/` permanent væk:** `node tests/koer.mjs` →
  **1810 bestået, 6 fejlet** — de samme 6 som grundmålingen (se nedenfor). `node
  tools/validate.mjs` → 77/0/1. `node tools/build.mjs` → 216 sider, 1111/0 kilder, 33 tæthed.
  `node db/tjek.mjs` → exit 0, "TJEK BESTÅET".

---

## Nye fælder og opdagelser

**1. Punkt 1's præmis var forkert — allerede rettet af et tidligere spor.** Briefet skrev
*"Giver i dag: kommandoen læser `data/robots/` fra disk."* Målt: **falsk**. Linje 1350 stod
ordret som `dataMappe = path.resolve(String(flag['data'] ?? 'data/robots'));`, men den sætning
lå i en `else`-gren, der kun nås når `filer.length > 0` (positionelle filer på kommandolinjen) —
og i **den** gren bruges `dataMappe` aldrig (arv-opslag bruger `filer[0]`, ikke `dataMappe`).
Når INGEN flag gives, går koden allerede i `if (brugDb)`-grenen og kalder `hentRobotter()`.
Sporet: commit `8e9d2f1 "spor/fase3 punkt 4: validate.mjs henter fra databasen som standard"` —
et TIDLIGERE spor gjorde allerede databasen til standard. Fallback-strengen `'data/robots'` var
derfor **dead code**, aldrig faktisk læst i noget kodeforløb (sporet frem, ikke gættet). Jeg
fjernede den alligevel, fordi den pegede på noget der ville forsvinde, men punkt 1's
acceptkriterium var opfyldt *før* jeg rørte filen. Dette er nøjagtigt den slags, CLAUDE.md's
regel 5 beder om at rapportere: et rigtigt grep i briefet ("linje 1350 peger på mappen") førte
til en forkert konklusion om *hvornår* den linje faktisk læses.

**2. Punkt 3's tabel har 14 rækker, ikke "13".** Overskriften siger *"De 13 mekaniske
kildeskift"*, men tabellen under den lister 14 filer (talt direkte: 02, 15, 26, 32, 35, 36,
42-cjk, 42-om-os, 44, 50, 62, 64, 68, 76). Kontrol: 14 (punkt 3) + 3 (punkt 4: 06, 12, 16) = 17,
som matcher Å183's egen optælling af "17 testfiler". Tabellen er retvisende; kun overskriftens
tal er forkert.

**3. Punkt 5's "1 importør" var 2 filer ved en direkte grep, ikke 1.** `grep -rl
"db/hentbyg\.mjs" tests/ tools/ db/ --include=*.mjs` gav **2** filer før sletning:
`tests/dele/71-hentbyg-vaern.mjs` (den rigtige importør) OG `db/hentbyg.mjs` selv (matcher sin
egen sti i sin egen docstring — selvreference, ikke en ekstern bruger). Ændrer intet ved
handlingen (begge slettes uanset), men briefets "1" var upræcist.

**4. To REST-kald pr. suitekørsel, der ikke var der før, og som ikke er rettet.**
`64-i18nfelt.mjs` og `76-produkort.mjs` skal have RÅ YAML-tekst (til strengpatching hhv.
fixture-filer) — `hentRobotter()` giver kun genparsede objekter. Begge kalder nu
`db/eksporter.mjs --fra-db --ud=<scratch>` som subproces. `fund/BRIEF-dbcache.md`s
procestværgående cache sidder i `db/hent.mjs`s `hentRobotter()`-indpakning af `fraDb()`, IKKE i
`db/eksporter.mjs`s egen `fraDb()` — et subproces-kald når den ikke. Konsekvens: suiten laver nu
2 ekstra, ukachede REST-runde-ture (mod målet "1 REST-kald for hele suiten"). Ikke rettet i dette
spor; kunne løses ved at eksponere en cache-bevidst "skriv hentRobotter()s docs som YAML"-hjælper
i `_faelles.mjs`, men det er en ny funktion i en delt fil — uden for mit filejerskab.

**5. To assertions i `26-forbehold-klasse.mjs` og tre steder i `35-typeskilt-katalog.mjs` kunne
ikke være rene kildeskift.** De læste RÅ YAML-TEKST med regex (fx `advarsel_klasse: "gyldighed"`
som streng, `status: i_produktion` som linjemønster) — `hentRobotter()` giver kun parsede felter.
Samme dbcache-begrundelse som punkt 4 ovenfor forhindrede en frisk `fraDb()`-omvej her. Løst med
strukturfelt-tjek i stedet for tekst-regex (samme værdi, anden aflæsningsform) — dokumenteret i
hver fils egen kommentar.

**6. Suitens tal svinger med et forklarligt, sporbart mønster — ikke en regression.**
Grundmåling (`ec1aea2`, orkestratorens og min egen, identiske): **1817/6**. Efter punkt 3: **1823**
(+6, nye "findes i databasen"-kontrolassertions tilføjet undervejs). Efter punkt 4: **1824** (+1,
samme grund). Efter punkt 5: **1810** (−14, `71-hentbyg-vaern.mjs`s egne assertions forsvinder
med filen). De 6 fejlende testnavne er **byte-identiske** i alle fire målinger — verificeret
tekststreng for tekststreng, ikke kun optalt.

## Punkter i briefet, jeg ikke nåede

Ingen. Alle seks punkter er committet, i rækkefølge, med grønne acceptkriterier. Den eneste
afvigelse fra den planlagte arbejdsgang: en mellemliggende fuld suitekørsel (baggrundsproces
`budg3f7ul`, efter punkt 1-3) skulle egentlig følges af endnu en efter punkt 4 alene, men på
orkestratorens eksplicitte instruktion (budgetpres) blev punkt 4-6 committet i hurtig
rækkefølge uden mellemliggende suitekørsler, og suiten kørt kun ÉN gang for hele
punkt-4/5/6-blokken, i forgrunden, til sidst.

## Assertions, hvis grænseværdi ændrede sig

**Ingen numerisk grænseværdi (tal, tærskel) ændrede sig noget sted.** Alle talværdier, der
allerede stod i testene (77 robotter, 1111 kildemærker, 259/303/562 forbehold, Spots 1100 mm,
33 tæthedsnævnere) er UÆNDREDE — bevist ved at grundmålingens 6 kendte røde er byte-identiske
gennem hele arbejdet, og ved at de øvrige ~1800 grønne forblev grønne.

**Det, der ÆNDREDE SIG, er retning på to assertions — ikke en tærskel:** i
`tests/dele/68-tjek-kun.mjs`, som fallout af punkt 2's kontraktændring (`--liste` kan ikke
længere være database-fri), blev to assertions VENDT (CLAUDE.md: ret, slet ikke):

| Assertion | Før | Efter | Hvorfor |
|---|---|---|---|
| "udskriften indeholder …" | IKKE "1/4" (eksporten blev ikke kaldt) | INDEHOLDER "1/4" (eksporten køres nu altid først) | Punkt 2 gør trin 1 obligatorisk for `--liste` — der findes intet lokalt sted at læse producenter fra uden `data/robots/` |
| linjetælling ved parsing af `--liste`s output | talte alle ikke-tomme linjer | filtrerer til kun `/^\d+ {2}\S/` (ægte "antal  navn"-linjer) | uden filteret tæller "1/4 node db/eksporter…"-linjen forkert med som en producentlinje |

Begge er dokumenteret med "VENDT"-kommentarer i selve filen og efterprøvet isoleret: 14/14
bestået efter rettelsen (var 11/14 lige efter punkt 2, før denne fil blev rettet i punkt 3).
