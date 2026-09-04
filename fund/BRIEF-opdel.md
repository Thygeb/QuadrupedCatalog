# BRIEF — spor/opdel: `tools/yaml.mjs` deles i parser og enhedsordforråd

**Gren:** `spor/opdel` · **Worktree:** `C:/Praktik/websites/udstilling-wt-opdel`
**Model:** sonnet · **Base:** `7b169b7` · **Rapport:** `fund/FUND-opdel.md`
**Forventet pris:** ~200–300k tokens. Overstiger du 400k uden at være i mål, så
meld det frem for at fortsætte.

**Kald `spor`-skillen som din FØRSTE handling** — den bærer grundmålingen,
skrive-grænsen, kontrollinjen, filejerskabet, selv-efterprøvningen,
rapportformen og miljøfælderne. Lykkes kaldet ikke fra din worktree, så læs
`.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at du gjorde
det**.

**Ingen andre skills er relevante her.** Ikke `design` (intet visuelt røres —
`side.mjs`-ændringen er en importlinje, ikke en skabelonændring), ikke
`robotdata` (ingen robotpost røres), ikke `supabase` (ingen skemaændring, ingen
DB-skrivning). Kalder du `fejljagt`, er det fordi noget opfører sig uventet —
det er ikke planlagt.

---

## Hvorfor denne opgave findes

PLAN.md's fase 3 siger ordret: *"`tools/yaml.mjs` (457 linjer) slettes"*.
**Det er målt forkert.** Filen har 15 eksporter, og kun 2 er YAML. De øvrige 13
er projektets enheds- og operatorordforråd, og `ENHEDER` bruges af
`tools/skabelon/side.mjs` og `tools/skema.mjs`, som **begge overlever fase 3**.
En sletning ville brække dem begge.

Derfor er dette en **opdelingsopgave**, ikke en sletteopgave. Å178's åbne punkt
(b) ordret: *"`tools/yaml.mjs` skal splittes, ikke slettes: enhedsordforrådet
(`ENHEDER`, `kanoniskEnhed`, `tilBasis`, `OPERATORER`, `findTal`, `IMPERIALE`)
skal overleve i et eget modul, YAML-parseren kan derefter vurderes."*

### Planens egne forbehold, citeret — fordi de er en del af opgaven

PLAN.md's fase 3-række bærer ét bindende forbehold, og det gælder dig:

> *"build fra DB giver byte-identisk `dist/` mod build fra `data/robots/` (målt
> før sletningen) · tests samme beståtal"*

Byte-identiteten er **allerede bevist** af fase 3's første halvdel (`7a68d10`).
Din opgave må ikke bryde den. Derfor er acceptkriterium 4 nedenfor en `diff -r`
mod begge veje, ikke kun mod den ene.

PLAN.md's fase 3-række bærer **intet** forbehold om rækkefølge eller om parring
med et andet spor. `spor/dbcache` kører parallelt med dig, men ejer andre filer
(se filejerskabet).

---

## Grundmåling — orkestratorens egne tal på `7b169b7`, 4. sep 2026

Genmål dem som din første kommando efter skill-kaldet, og skriv dine egne tal.
**Afviger noget, er det en del af leverancen at rapportere det, ikke ulydighed.**

| Kommando | Mit tal |
|---|---|
| `node tools/validate.mjs` | **77 filer · 0 fejl · 1 advarsel** (Ghost Vision 60's R9, 9,6 %) |
| `node tools/build.mjs` | **216 sider · 1.111 tal med kilde · 0 uden** |
| `node tests/koer.mjs` | **1817 bestået / 6 fejlet** — se note |

**Note om 1817/6, og den skal læses:** de 6 røde er `4c` (Spots strøm ud) · 2
forbehold mærket "gyldighed" · 1 fixture (`addverb-trakr-20`) · 2 × `64.3`
(`unitree-aliengo`). De var røde før dig. **1817/6 er målt to gange uafhængigt
på `7b169b7`** — af peer-sessionen på det flettede resultat og af mig i en egen
kørsel — og de seks er navneidentiske begge gange.

**Tallet er alligevel ikke et krav.** `spor/dbcache` kører parallelt med dig og
kan flytte det, og din egen ændring i `_faelles.mjs` kan gøre det samme.
Acceptkriteriet er derfor skrevet som en regel: *"samme beståtal som din egen
grundmåling"*, ikke *"1817"*. **Mål dit eget og brug det som facit.**

**Miljø:** node er `/c/Program Files/nodejs/node.exe` og er **ikke** på PATH i
Git Bash. `.env` og de 610 fabrikantfotos er allerede kopieret ind i din
worktree — tjek det med `ls assets/fotos/fabrikant | wc -l` (skal give 610). Din
port, hvis du får brug for en server: **8126**, aldrig 8080.

**Disk:** ~20 GB fri, og én suitekørsel er ~2,8 GB. Ryd `tests/.tmp-koersel` i
din worktree, når du er færdig med en kørsel — ikke bagefter, når du har brug
for pladsen.

---

## Opgaven

Del `tools/yaml.mjs` (457 linjer, 15 eksporter) i to moduler.

**Målt af orkestratoren, og du skal efterprøve det:** de to halvdele bruger
**intet** af hinanden. `grep` efter ordforrådets navne i parserens linjer 18–233
gav tomt, og `grep` efter `parseYaml`/`YamlFejl`/`laesSkalar`/`laesFlow` i linje
235–460 gav tomt. Snittet er derfor rent.

### Punkt 1 — `tools/yaml.mjs` beholder KUN parseren

Efter opdelingen eksporterer filen præcis to ting:

| Eksport | Linje i dag |
|---|---|
| `YamlFejl` | `tools/yaml.mjs:18` |
| `parseYaml` | `tools/yaml.mjs:48` |

De interne hjælpere, der hører til parseren og **ikke** eksporteres, bliver:
`fjernKommentar` (:20), `NOEGLE_RE` (:45), `YAML11_BOOL` (:46), `laesSkalar`
(:170), `laesFlow` (:190).

**Acceptkriterium 1:** `grep -c "^export" tools/yaml.mjs` giver **2**.
*Giver i dag: **15**.*

**Hvorfor:** filen hedder `yaml.mjs` og indeholder i dag 13 ting, der ikke er
YAML. Navnet har løjet, siden ordforrådet flyttede ind, og fase 3's plan
sletteliste blev skrevet på det navn.

### Punkt 2 — `tools/enheder.mjs` er ny og bærer ordforrådet

Ny fil med præcis disse 13 eksporter, flyttet uændret:

`afkodEntiteter` (:235) · `normaliser` (:271) · `faelderI` (:280) ·
`OPERATORER` (:292) · `ORD_OPERATOR` (:295) · `ORD_MAASKE` (:301) ·
`kanoniskEnhed` (:330) · `findTal` (:345) · `ENHEDER` (:387) ·
`TYPE_ENHEDER` (:425) · `IMPERIALE` (:439) · `tilBasis` (:441) ·
`decimaler` (:453)

De interne hjælpere, der følger med: `ENTITETER` (:228, kun brugt af
`afkodEntiteter` på :246), `MELLEMRUM_KLASSE`/`NULBREDDE_KLASSE`/`MELLEMRUM_RE`/
`NULBREDDE_RE`/`MELLEMRUM_TEST` (:255–259), `GLYFFER` (:261), `ENHED_ALIAS`
(:303), `ENHED_ALIAS_TYPE` (:323), `KASSE_UAFHAENGIG` (:328).

**Flyt koden, omskriv den ikke.** Kroppen af hver funktion skal være ordret den
samme. Det er hele grunden til, at acceptkriterium 4 kan være en `diff -r`.

**Acceptkriterium 2:** `grep -c "^export" tools/enheder.mjs` giver **13**.
*Giver i dag: filen findes ikke (`ls tools/enheder.mjs | wc -l` = **0**).*

**Hvorfor:** `ENHEDER` og `tilBasis` er projektets måleordforråd og overlever
hele fase 3, 4 og 5. De skal ikke bo i en fil, som en plan har på sin
sletteliste.

### Punkt 3 — de tre importører i `tools/` retter deres import

Målt: præcis **3** filer i `tools/` henter ordforråd fra `yaml.mjs`.

| Fil | Linje i dag | Henter |
|---|---|---|
| `tools/skabelon/side.mjs` | `:46` — `import { ENHEDER } from '../yaml.mjs';` | 1 navn |
| `tools/skema.mjs` | `:10` — `import { kanoniskEnhed, ENHEDER, tilBasis } from './yaml.mjs';` | 3 navne |
| `tools/validate.mjs` | `:29–32` — `import { parseYaml, YamlFejl, normaliser, faelderI, findTal, kanoniskEnhed, ENHEDER, TYPE_ENHEDER, IMPERIALE, tilBasis, decimaler, ORD_OPERATOR, ORD_MAASKE } from './yaml.mjs';` | 2 fra parser, 11 fra ordforråd |

`validate.mjs` skal altså have **to** import-sætninger efter opdelingen, ikke én.

**Rør IKKE de seks øvrige filer**, der importerer `yaml.mjs` — de henter kun
`parseYaml`/`YamlFejl`, som bliver liggende: `tools/alder.mjs:38`,
`tools/build.mjs:32`, `tools/efterproev-anvendelse.mjs:25`,
`tools/maal-maerkekryds.mjs:14`, `db/hent.mjs:38`, `db/tjek.mjs:57`.
**`db/hent.mjs` er `spor/dbcache`s fil — rør den ikke, heller ikke dens
importlinje.** Den behøver ingen ændring, og det er efterprøvet.

**Acceptkriterium 3:** denne kommando giver **0**:
```
grep -rl "ENHEDER\|kanoniskEnhed\|tilBasis" --include=*.mjs tools/ \
  | xargs grep -l "yaml.mjs" | grep -v "tools/yaml.mjs" | wc -l
```
*Giver i dag: **3** (`side.mjs`, `skema.mjs`, `validate.mjs`).*

**Hvorfor:** hvis blot én importør bliver hængende på det gamle navn, er
opdelingen kosmetisk, og næste spor vil tro, at `yaml.mjs` er ren.

### Punkt 4 — `tests/dele/_faelles.mjs` eksporterer begge moduler

`tests/dele/_faelles.mjs:31` gør i dag:
```
export const yaml = await import(`file://${path.join(rod, 'tools', 'yaml.mjs')...}`);
```
`ctx.yaml` bruges af testdelene og skal fortsat kunne nå **både** parseren og
ordforrådet. **Vælg den løsning, der bryder færrest testdele, og skriv i
rapporten hvilken du valgte og hvorfor.** To oplagte:

- `ctx.yaml` beholder alle 15 navne (spred begge moduler ind i ét objekt) —
  ingen testdel skal røres.
- `ctx.yaml` bliver parseren, og `ctx.enheder` bliver ordforrådet — renere, men
  hver testdel, der bruger et ordforrådsnavn gennem `ctx.yaml`, skal rettes.

**Mål antallet, før du vælger:** tæl hvor mange testdele der faktisk rører et
ordforrådsnavn via `ctx.yaml`, og skriv tallet i rapporten. Det er tallet, der
afgør valget — ikke smag.

**Acceptkriterium 4:** `node tests/koer.mjs` giver **samme beståtal og samme
seks navngivne røde som din egen grundmåling**. Ikke "nogenlunde samme": samme
tal, og de røde sammenlignet **ved navn**, ikke som nettotal.

**Hvorfor:** en suite, der falder fra 1817 til 1810 og fra 6 til 0 røde, ser
bedre ud og er værre. Nettotal skjuler det.

### Punkt 5 — beviset: `dist/` er uændret ad BEGGE veje

Byg fire gange og sammenlign:

```
git stash             # eller byg fra en ren checkout af 7b169b7
node tools/build.mjs --data=data/robots --ud=<tmp>/foer-fil
node tools/build.mjs                    --ud=<tmp>/foer-db
git stash pop
node tools/build.mjs --data=data/robots --ud=<tmp>/efter-fil
node tools/build.mjs                    --ud=<tmp>/efter-db
diff -r <tmp>/foer-fil <tmp>/efter-fil   # skal give 0 linjer
diff -r <tmp>/foer-db  <tmp>/efter-db    # skal give 0 linjer
```

**Acceptkriterium 5:** begge `diff -r` giver **0 linjer**, og hver
`build.mjs`-kørsel siger **216 sider · 1.111 tal med kilde · 0 uden**.

*Giver i dag (maalt af mig paa 7b169b7, saa apparatet er valideret foer du faar det): to identiske byg giver **0** · indsat linje giver **3** · fjernet igen giver **0** · **216/216** HTML-sider i hver. Ram ikke mit tal 3 — det afhaenger af, hvilken linje du indsaetter.*

**Kontrafaktisk, og den er obligatorisk:** bevis at `diff -r` overhovedet kan se
en forskel. Indsæt en linje i én HTML-fil i `efter-fil`, kør `diff -r` igen
(skal give >0), fjern den, kør igen (skal give 0). **Skriv begge tal i
rapporten.** Uden den måler `0 forskelle` lige så godt et ødelagt apparat som et
korrekt resultat — det er præcis den kontrol, fase 3's første halvdel blev
flettet på.

**Hvorfor:** opdelingen må ikke ændre ét eneste tegn i den byggede side. Er der
en forskel, er en funktionskrop blevet omskrevet undervejs.

---

## Filejerskab — komplet, og ingen fil deles med et andet spor

**Du ejer og må skrive i:**
```
tools/yaml.mjs
tools/enheder.mjs          (ny)
tools/skema.mjs
tools/skabelon/side.mjs
tools/validate.mjs
tests/dele/_faelles.mjs
tests/dele/*.mjs           KUN hvis punkt 4's måling viser, at de skal rettes
fund/FUND-opdel.md         (din rapport)
```

**Du må IKKE røre** — de ejes af andre lige nu:
```
db/hent.mjs, tests/koer.mjs, .gitignore     spor/dbcache
assets/system.css, tools/skabelon/katalog.mjs   peer-sessionens spor/katalogskaerm
data/robots/*.yaml                          peer-sessionens to datasporer + databasen
PLAN.md, STATUS.md, CLAUDE.md               orkestratoren
databasen                                   skriv aldrig; du læser kun via build/validate
```

`tests/dele/12-enheder.mjs` og `tests/dele/44-samlenhed.mjs` hedder noget med
enheder og er **dine**, hvis punkt 4's måling kræver det — men ret dem kun, hvis
målingen siger det.

---

## Commit-rækkefølge

Commit hvert punkt for sig, i denne rækkefølge. Et spor, der dør undervejs,
efterlader da noget brugbart:

1. `tools/enheder.mjs` oprettet (punkt 2) — filen findes, intet importerer den endnu
2. `tools/yaml.mjs` trimmet + de tre importører rettet (punkt 1 og 3) — dette er
   den commit, hvor bygget skal virke igen
3. `tests/dele/_faelles.mjs` og eventuelle testdele (punkt 4)
4. `fund/FUND-opdel.md`

Efter commit 2 skal `node tools/build.mjs` virke. Gør den ikke det, så stop og
ret, før du går videre — commit 3 skjuler ellers årsagen.

---

## Til sidst

**Briefets fakta er påstande.** Linjenumrene ovenfor er slået op i filen på
`7b169b7` og skal stemme; gør de ikke det, så skriv afvigelsen i rapporten. Det
samme gælder mine tal: 15 eksporter, 3 importører, 56/17/39 build-kald, de tomme
grep i begge retninger. **At modsige mig er en del af leverancen** — to agenter
rettede orkestratorens fakta 26.–27. aug, begge korrekt, og det var den
sessions billigste kvalitetskontrol.

**Rapportér ærligt hvad du ikke nåede.** Rapporten er højst 60 linjer plus de to
obligatoriske sektioner uden for loftet. **Høj konfidens kræver en genkørbar
kommando PLUS en kontrafaktisk linje** — ellers er den middel.
