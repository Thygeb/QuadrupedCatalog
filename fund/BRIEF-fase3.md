# BRIEF — spor/fase3: bygget læser databasen, og intet slettes

**Model:** sonnet · **Worktree:** `c:\Praktik\websites\udstilling-wt-fase3` · **Gren:** `spor/fase3`
**Base:** `8476ab2` · **Rapport:** `fund/FUND-fase3.md`
**Forventet pris:** ~250–400k tokens. Er du over 500k uden at være i mål, så stop, commit og meld det.

## FØRSTE HANDLING

Kald **`spor`**-skillen. Den bærer grundmålingen, skrive-grænsen, kontrollinjen,
filejerskabet, selv-efterprøvningen, rapportformen og miljøfælderne. Lykkes kaldet ikke
fra worktreen, så læs `.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at
du gjorde det**.

**Øvrige skills:** `supabase` (du arbejder mod REST og RLS) og `fejljagt` (hver gang et
tal ikke opfører sig, som du forventer). **Ikke** `design` — intet visuelt røres.
**Ikke** `robotdata` — ingen robotpost redigeres.

## HVAD DER ÆNDRER SIG, I KONKRETE TERMER

| | I dag | Efter dit spor |
|---|---|---|
| Hvor `build.mjs` får sine 77 robotter | `data/robots/*.yaml` gennem `parseYaml` | Supabase over REST |
| Hvor `validate.mjs` får sine | samme | samme DB-kald |
| `tests/dele/_faelles.mjs` | `lasRobotter(mappe)` læser YAML | **beholdes** + ny `hentRobotter()` ved siden af |
| `data/robots/` | 77 filer | **77 filer, urørt** |
| `tools/yaml.mjs` | 457 linjer, 15 eksporter | **urørt** |
| `db/eksporter.mjs`, `hentbyg.mjs`, `tjek.mjs` | findes | **findes stadig** |
| `dist/` | 216 sider | **216 sider, byte-identisk** |

**Du sletter INGENTING.** Det er en bevidst beslutning af JPK 4. sep 2026, og den ændrer
PLAN.md's fase 3: fasen er delt i to, og du er den første halvdel. Anden halvdel
(sletningerne) er et separat spor, når DB-vejen har kørt et stykke tid.

**Hvorfor:** at slette `data/robots/` og `db/eksporter.mjs` er en envejsdør — bagefter
findes der ingen vej tilbage til YAML. Din leverance er beviset for, at DB-vejen giver
det samme; sletningen er en beslutning, der først skal kunne træffes ovenpå det bevis.

## GRUNDMÅLING — orkestratorens egne tal, målt på `8476ab2`

**Din første kommando er at genmåle dem.** De er taget FØR `spor/hegn2` blev flettet,
og hegn2 lægger **+2 assertions** til (59.25, 59.26). Din base kan derfor allerede være
flyttet.

```
node tools/validate.mjs   ->  77 fil(er) · 0 fejl · 1 advarsler
node tools/build.mjs      ->  216 sider · 1111 tal med kilde · 0 uden
node tests/koer.mjs       ->  1815 bestaaet, 6 fejlet
```

Advarslen er `ghost-robotics-vision-60 · hastighed · R9` (metrisk/imperial afviger 9,6 %).
Den er der i forvejen. **De 6 røde er der også i forvejen**, ved navn: `4c` (Spots strøm
ud) · `259 forbehold mærket "gyldighed"` (fik 258) · `562 i alt, ingen ugyldig værdi`
(fik 561) · `(d) fixture addverb-trakr-20` · 2 × `64.3` (unitree-aliengo "UDEN batteri").
**Ser du en syvende, er den din.**

## OPGAVEN — fem punkter, i denne rækkefølge

### 1. Byg `hentRobotter()` som et nyt modul

Nyt modul, du selv navngiver (forslag: `db/hent.mjs`). Det skal eksportere
`async hentRobotter()`, som returnerer **det samme objektarray**, som
`data/robots/`-vejen producerer i dag.

**Genbrug, skriv ikke om.** `db/eksporter.mjs:616` eksporterer allerede
`fraDb` og `omdanRobotFraDb`, og `fraDb()` (`:471-489`) gør hele REST-kaldet med
netop det `select`, der henter `field_entries`, `field_entry_variants`,
`applications` og `images` i ét kald.

**Nøglen er `SUPABASE_SERVICE_ROLE_KEY`, ikke anon.** Besluttet af JPK 4. sep 2026 som
**L94**. Målt før beslutningen, med kontrolgruppe:

```
service_role   HTTP 200, 77 robotter
anon (legacy)  HTTP 401, 42501 permission denied
publishable    HTTP 401, 42501 permission denied
select count(*) from pg_policies where schemaname='public'  ->  0
```

**Rør ikke databasen.** Ingen GRANT, ingen politikker, ingen DDL, ingen skriv. Du læser.

**Formen, dit modul skal ramme.** `build.mjs:272-274` gør i dag:

```js
normaliserVisningsEnheder(normaliserRobot(parseYaml(fs.readFileSync(f,'utf8'), f)))
```

Din vej skal give det samme fra `omdanRobotFraDb(...)`. **Der findes allerede et bevis
for, at det kan lade sig gøre:** `db/tjek.mjs` måler dyb lighed mellem databasen og
YAML'en gennem `normaliserRobot(parseYaml(x))`. Læs den, før du skriver dit modul —
den har allerede løst det svære.

**Acceptkriterium 1:** `node -e` importerer dit modul, kalder `hentRobotter()` og skriver
`robotter.length`. **Færdig, når det giver 77.** *(Giver i dag: modulet findes ikke.)*

### 2. `build.mjs` henter fra databasen

`build.mjs:242` sætter `dataMappe` fra `--data=`; `:272` læser filerne. Lad `--data=`
**blive** som flag — den er stadig den vej, fixturerne bygges med, og 19 filer bruger
den. Tilføj en DB-vej ved siden af, og gør **databasen til standard**, når intet
`--data=` er givet.

**Acceptkriterium 2:** `node tools/build.mjs` uden flag giver **samme tre tal som din
grundmåling** — sidetal, kildemærker, og 0 uden. *(Giver i dag de samme tal ad
YAML-vejen; pointen er, at de skal overleve skiftet.)*

### 3. BEVISET: byte-identisk `dist/`

Det er sporets egentlige leverance.

```
node tools/build.mjs --data=data/robots --ud=dist-yaml
node tools/build.mjs --ud=dist-db
diff -r dist-yaml dist-db
```

**Acceptkriterium 3:** `diff -r` giver **0 linjer**. Giver den ikke det, så **ret ikke
mod tallet** — skriv hver eneste forskel i rapporten med fil og uddrag. En forskel her
er et ægte fund om, at DB og YAML ikke er enige, og den er mere værd end et grønt spor.

Ryd `dist-yaml/` og `dist-db/` bagefter — de er ~60 MB hver, og disken er den hårde
grænse (17 GB fri, målt 4. sep).

### 4. `validate.mjs` på det hentede

`validate.mjs:32` importerer fra `./yaml.mjs`, `:1343` læser filerne. Samme mønster som
punkt 2: DB som standard, `--data=` beholdes.

**Acceptkriterium 4:** `node tools/validate.mjs` giver **77 filer / 0 fejl / 1 advarsel**,
og advarslen er stadig Ghost Vision 60's R9.

### 5. `_faelles.mjs` får `hentRobotter()` — og `lasRobotter()` BLIVER

`tests/dele/_faelles.mjs:45` eksporterer `lasRobotter(mappe)`. **Slet den ikke og skift
den ikke ud.** Tilføj `hentRobotter()` ved siden af, og eksponér den gennem `ctx`, som
`tests/koer.mjs:28` og `:47` gør med de øvrige hjælpere. Ét kald, cachet — suiten må ikke
lave 76 REST-kald.

**Grunden til, at `lasRobotter()` skal blive**, er den vigtigste fælde i hele briefet, og
den er fundet af `udstilling-e4` og efterprøvet af mig:

`_faelles.mjs:24` gør `export const yaml = await import(...tools/yaml.mjs)` på
**modulniveau**. `tests/koer.mjs:29` importerer `_faelles.mjs`, og **75 af 76 testdele**
får deres hjælpere via `ctx`. Brækker `_faelles.mjs` ved import, dør **hele kørslen** før
den tæller noget — og acceptkriteriet "samme beståtal" ville da vise et *lavere* tal uden
at nogen kunne se hvorfor.

**Acceptkriterium 5, som fanger netop det:**

```
node -e "import('./tests/dele/_faelles.mjs').then(m=>console.log('importerbar, eksporter:',Object.keys(m).length))"
```

**Færdig, når den skriver et tal og ikke en fejl** — både før og efter din ændring.
*(Giver i dag: importerbar.)*

**Acceptkriterium 6:** `node tests/koer.mjs` giver **samme beståtal som din egen
grundmåling fra punkt 0, og samme 6 røde ved navn.**

**Bemærk, at kriteriet er en REGEL og ikke et tal.** Skriv aldrig 1815 eller 1817 ind
som en konstant: `spor/hegn2` flettes til main parallelt med dit spor og lægger +2
assertions til. Dit tal er det, *du* målte i punkt 0 — ikke mit.

## FILEJERSKAB

**Du ejer og må skrive i:**

```
tools/build.mjs            tools/validate.mjs
tests/dele/_faelles.mjs    tests/koer.mjs
db/hent.mjs (ny)           fund/BRIEF-fase3.md, fund/FUND-fase3.md
```

**Du må LÆSE, men ikke skrive i:** `db/eksporter.mjs`, `db/tjek.mjs`, `tools/skema.mjs`,
`tools/yaml.mjs`, `tools/skabelon/side.mjs`, `data/robots/`.

**Rør under ingen omstændigheder:** `assets/system.css`, `tests/dele/59-farvetokens.mjs`,
`DESIGN.md` — de ejes af `spor/hegn2` i en anden session, som fletter parallelt.
`c:\Praktik\websites\salg` er et andet projekt.

**Databasen er delt.** Du læser fra den. Du skriver ikke i den, og du kører ingen DDL.

## PLANENS EGNE FORBEHOLD

PLAN.md §0's fase 3-række bærer **ingen** forbehold i sin egen celle. Men §0's indledning
(`:47-50`) bærer to bindinger, og **den ene rammer dig indirekte:** *"fase 5 kan først
køre, når intet andet spor er i `tools/` og `assets/`."* Du ER i `tools/`. Det betyder
ikke noget for dit spor, men det betyder, at fase 5 ikke kan startes, mens du kører.

**Og planens leveranceliste er målt forkert på ét punkt.** Den siger *"`tools/yaml.mjs`
(457 linjer) slettes"*. Målt: filen har **15 eksporter**, hvoraf kun **2** er YAML
(`parseYaml`, `YamlFejl`). Resten er enheds- og operatorordforrådet — `ENHEDER`,
`kanoniskEnhed`, `tilBasis` — og de bruges af `tools/skema.mjs` og
`tools/skabelon/side.mjs`, som **begge overlever fase 3**. Det er grunden til, at
sletningerne er taget ud af dit spor. **Du skal ikke løse det; du skal bare vide, hvorfor
listen i planen ikke matcher dit brief.**

## BRIEFETS FAKTA ER PÅSTANDE

Alt ovenfor er målt af orkestratoren og kan være forkert. **Afviger noget, du måler, fra
noget, briefet påstår, så er afvigelsen en del af leverancen — ikke ulydighed.** Skriv
den frem med din kommando og dit tal. To agenter rettede orkestratorens fakta i denne
uge, begge på eget initiativ, begge korrekte.

Det gælder linjenumrene lige så hårdt som tallene: `build.mjs:242`, `:272-274`,
`validate.mjs:32`, `:1343`, `_faelles.mjs:24`, `:45`, `eksporter.mjs:471-489`, `:616`,
`koer.mjs:28-29`, `:47` er slået op 4. sep 2026 på `8476ab2`. Flytter hegn2's flet dem,
så mål dem om.

## COMMIT UNDERVEJS

Commit efter **hvert** af de fem punkter, i rækkefølge. Et spor, der dør midt i, skal
efterlade sit arbejde — det er værnet, der gør lange spor forsvarlige her.

## MILJØ

- `node` er **ikke** på PATH i Git Bash: `/c/Program Files/nodejs/node.exe`
- **`.env` og `assets/fotos/fabrikant/` er kopieret ind i worktreen** (122 bytes,
  610 filer — talt). Byg uden dem giver et andet billedtal.
- **Har en fil lavet et `fetch()`, så kald aldrig `process.exit()` bagefter** — sæt
  `process.exitCode`. `node.exe` v24.13.0 crasher med libuv-assertion og exit 127. Det
  rammer dig direkte: dit modul laver netop et `fetch`.
- **Egen port**, hvis du starter en server: 8127. Aldrig 8080.
- Du **må** køre `tests/koer.mjs` — du er i din egen worktree med din egen
  `tests/.tmp-koersel`. Én kørsel er ~2,8 GB. **Ryd den mellem kørsler**; der var 17 GB
  fri, da sporet blev sendt, og en anden session kører også.
