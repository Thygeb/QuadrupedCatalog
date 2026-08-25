# FUND-vagt.md — mekanisk vagt mod tavst datatab i `db/migrer.mjs --til-db` (L35)

Gren `spor/vagt`, worktree `C:/Praktik/websites/udstilling-wt-vagt`. Tre commits,
ét pr. punkt: `f28a7cd` (punkt 1), `9182cc3` (punkt 2), `4b8fada` (punkt 3).

## Skill-vurdering

Ingen af de tre projekt-skills (`robotdata`, `parallelt`, `grillmig`) passer direkte:
opgaven var ikke at tilføje/opdatere en robotpost, ikke at dele arbejde på flere
agenter (jeg fik eksplicit besked "arbejd direkte — deleger ikke videre"), og ikke
at grille et brief eller en beslutning (jeg *var* det brief, ikke afsenderen).

`supabase` og `supabase-postgres-best-practices` blev læst, som briefet krævede
(`.claude/skills/supabase/SKILL.md` og `.claude/skills/supabase-postgres-best-practices/SKILL.md`),
men vurderet IKKE at gælde skarpt her: opgaven ændrer intet i `db/skema.sql`, ingen
RLS-politik, intet indeks — den genbruger udelukkende allerede afprøvet PostgREST-kode
(`eksporter.mjs`s `fraDb()`), som briefet selv krævede importeret, ikke genimplementeret.
De fire PostgREST-fælder i `db/LAESMIG.md` er derfor allerede håndteret af den
eksisterende kode; jeg har ikke skrevet en eneste ny `fetch`-forespørgsel.

`code-review`/`simplify` blev bevidst IKKE kørt af mig selv — CLAUDE.md's
model-tiering-regel er eksplicit: "reviews og analyser er ALDRIG Sonnets." Det er
orkestratorens job at dømme diffen, ikke mit.

## Punkt 1 — vagten i `db/migrer.mjs`

`tilDb(robotter, argv)` læser nu, før første `del()`/`patch()`-kald, DB'ens indhold
via `fraDb()` (importeret fra `db/eksporter.mjs`, ikke genimplementeret) og
sammenligner det med `robotter`-argumentet via en ny funktion `sammenlignDbMedYaml`,
som bruger `dybtLig` (importeret fra `db/rundtur.mjs`) til selve ja/nej-afgørelsen på
hvert delfelt og graver derefter videre (`findAfvigelser`) for at finde den konkrete
feltsti og de to bladværdier — `dybtLig` alene rapporterer kun "typeforskel"/
"listelængde", ikke selve værdierne, så det var ikke nok til rapportformatet.

`--overskriv-databasen` springer vagten helt over. En tom database (0 rækker)
stopper ikke — den har intet at miste. `main()` sender nu `argv` videre til `tilDb`.

### Målt (fire kørsler, alle udført af mig)

**(a) Uberørt database:**
```
77 fil(er) · 0 fejl · 1 advarsler
  vagt: laeser DB'ens nuvaerende indhold og sammenligner med data/robots/ ...
  vagt: databasen (77 robotter) matcher data/robots/ — fortsaetter.
  toemmer eksisterende raekker ...
  77 robotter · 2310 feltposter · 127 varianter · 76 anvendelser · 54 billeder · 30 feltdefinitioner skrevet.
EXIT=0
```

**(b) Bevidst DB-drift** (PATCH `boston-dynamics-spot.producentby` → `"VAGTTEST"`
direkte mod PostgREST, uden om YAML — efterligner en Studio-redigering):
```
VAGT: databasen indeholder aendringer, der ikke findes i data/robots/.
  boston-dynamics-spot: producentby — DB "VAGTTEST" vs YAML "Waltham, Massachusetts"
Koer db/eksporter.mjs --fra-db foerst, eller gentag med --overskriv-databasen hvis aendringerne skal kasseres.
EXIT=1
```
Rækketælling bagefter: **77** (uændret — ingen DELETE blev kaldt).

**(c) `--overskriv-databasen`:**
```
  vagt: sprunget over (--overskriv-databasen).
  77 robotter · 2310 feltposter · 127 varianter · 76 anvendelser · 54 billeder · 30 feltdefinitioner skrevet.
EXIT=0
```
Efterfulgt af `db/rundtur.mjs --live`:
```
     77/77 dybt lig.
     77 fil(er) · 0 fejl · 1 advarsler.
     eksport:  213 sider · 1110 tal med kilde, 0 uden
     original: 213 sider · 1110 tal med kilde, 0 uden
RUNDTUR: 77/77 dybt lig · validate 0 fejl · build sider 213=213 · kilder 1110=1110
RUNDTUR BESTAAET — fundamentet er efterproevet.
EXIT=0
```
Slutkontrol: `boston-dynamics-spot.producentby` = `"Waltham, Massachusetts"`, og
**0** rækker med `producentby = "VAGTTEST"` i hele tabellen — VAGTTEST er ikke
efterladt i databasen.

**(d) `node tests/koer.mjs`** (før punkt 2's nye tests): **195 bestået, 2 fejlet** —
samme to kendte røde som før (interval-midtpunkt, L27/robots.json).

### En forudsætning, jeg måtte rette selv for at kunne måle noget som helst

`node db/migrer.mjs --til-db` fejlede først på validate-trinnet (54×R18, "filen
findes ikke") — **ikke** min ændring, men et kendt mønster i dette projekt
(hukommelsen nævner "Gitignorerede filer ved flet"): `assets/fotos/fabrikant/**` er
gitignoreret, så en frisk worktree arver aldrig de 54 fabrikantbilleder, selvom
`data/robots/*.yaml` allerede refererer dem. Bekræftet ved at `git stash`e mine
ændringer og køre den ORIGINALE `migrer.mjs` — samme 54 R18-fejl. Jeg kopierede
(`cp -n`, ingen overskrivning) de 54 filer fra `C:/Praktik/websites/udstilling/assets/fotos/fabrikant/`
ind i worktreen, samme princip som `.env`-kopieringen i briefet — filerne forbliver
gitignorerede og er IKKE committet af mig.

## Punkt 2 — testen

`sammenlignDbMedYaml` eksporteret fra `db/migrer.mjs`. To nye tests i
`tests/koer.mjs`, nyt afsnit "7. Vagten i db/migrer.mjs — ren sammenligningsfunktion":

- ens DB- og YAML-tilstand (to identiske konstruerede robotter) → 0 afvigelser
- én ændret `producentby` → præcis 1 afvigelse, `slug: "proeve-vagt"`, `sti: "producentby"`

Ingen fetch, intet filsystemkald i selve testen — bekræftet ved at flytte `.env` væk
midlertidigt og køre `tests/koer.mjs` igen: samme resultat.

**Målt:** `node tests/koer.mjs` → **197 bestået, 2 fejlet** (de samme to kendte røde,
uændrede — jeg har ikke rørt et tredje tal).

## Punkt 3 — procesdokumenterne

Skrevet EFTER punkt 1 og 2 var målt færdige, som briefet krævede.

- `.claude/skills/robotdata/SKILL.md`: nyt afsnit "To veje ind i data, siden L35"
  — JPK's Studio-vej, `db/eksporter.mjs --fra-db` som hjemtagningen, og eksplicit:
  agenternes egen arbejdsgang med YAML i egen worktree er UÆNDRET.
- `CLAUDE.md`, `## Mappestruktur`: note ved `data/robots/`-linjen om at mappen kan
  regenereres fra Supabase, men at validate/build/tests altid kører på YAML'en.

**Efterprøvet:** `grep -n "eksporter.mjs --fra-db"` rammer begge filer.
`grep -c "overskriv-databasen" .claude/skills/robotdata/SKILL.md` → **1**.

## Selv-tjek (tælling)

- 4 kørsler af `migrer.mjs --til-db` i forskellige tilstande (uberørt, drift, overskriv,
  plus den oprindelige fejlende kørsel før asset-kopieringen) — alle gav det forventede.
- 1 kørsel af `db/rundtur.mjs --live` — 77/77, 0 fejl.
- 3 kørsler af `tests/koer.mjs` (før punkt 1-ændringen som baseline, efter punkt 1,
  efter punkt 2) — tal steg præcis 195 → 195 → 197, ingen tredje test rørt.
- 1 direkte REST-kald til at bekræfte rækketal (77) efter drift-testen, og igen efter
  oprydningen — begge talt, ikke antaget.
- Fandt 0 fejl i selve vagtlogikken under afprøvning — men fandt 1 miljøfejl (manglende
  gitignorerede billeder), som blev rettet før vagten kunne testes.

## Selv-review — hvad jeg er usikker på

- **`findAfvigelser`'s bladgrænse ved strukturelle forskelle:** når to værdier har
  forskellig type (fx en liste mod et objekt) eller forskellig listelængde, rapporterer
  jeg HELE undertræet som ét afvigende blad (via `JSON.stringify`) i stedet for at grave
  videre. Det er bevidst — en listelængdeforskel har ikke en meningsfuld "feltsti pr.
  element" — men det betyder, at en afvigelse dybt inde i en lang liste kan give en
  ulæseligt lang JSON-streng i rapporten. Ikke testet mod et sådant tilfælde, kun mod
  den simple skalar-ændring, briefet bad om.
- **20-linjers-grænsen og "... og N flere"** er implementeret men kun efterprøvet ved
  kodelæsning, ikke ved en kørsel med >20 afvigende felter — jeg har ikke konstrueret
  et scenarie med så mange afvigelser, og gjorde det ikke, for ikke at skulle rode
  yderligere i den rigtige database for et tilfælde, briefets acceptkriterier ikke krævede.
- **`null` vs. `undefined`** i sammenligningen: `dybtLig` behandler dem IKKE som ens
  (`a===null||b===null||...→ a===b`). Jeg har ikke stødt på et tilfælde, hvor DB-siden
  og YAML-siden reelt afveg her (begge kodeveje bruger `?? null` konsekvent), men har
  heller ikke skrevet en test, der beviser fraværet af den fælde.
- **Ydelse ved 77 robotter × 30 felter:** sammenligningen er O(felter) pr. robot,
  målt til at være øjeblikkelig i praksis (ingen synlig forsinkelse i (a)/(b)-kørslerne),
  men jeg har ikke stopurs-målt den eksplicit.

## Rapportér ærligt — hvad jeg ikke nåede

- Jeg har ikke selv kørt en review-runde på diffen (bevidst, se skill-vurderingen
  ovenfor — det er orkestratorens opgave, ikke min).
- Jeg testede kun ÉN drift-form (en ændret tekststreng på et topniveaufelt,
  `producentby`). Jeg har ikke afprøvet vagten mod en drift i et `felter`-underfelt,
  en tilføjet/fjernet robot i DB'en, eller en ændring i `anvendelse`/`billede` — briefets
  acceptkriterium for (b) nævnte kun `producentby`, så jeg standsede der, men det er en
  smallere afprøvning end "enhver form for Studio-redigering".
- STATUS.md's L35-række og D12-rækken er IKKE opdateret af mig — briefet bad kun om
  `robotdata`-skillen og `CLAUDE.md`, og STATUS.md er (jf. CLAUDE.md's dokumentregler)
  orkestratorens bord, ikke agentens.
