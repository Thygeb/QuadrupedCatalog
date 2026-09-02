# BRIEF — spor/skema (FASE 1 af L81–L83: databasen bliver engelsk, og den ene retning lukkes)

**Model: Sonnet.** Mekanisk arbejde med et binært facit: eksporten fra den
omdøbte database skal give **præcis** de 77 YAML-dokumenter, `data/robots/`
har i dag (dyb lighed, som `db/rundtur.mjs` definerer den). Ingen
designbeslutning, ingen dataoversættelse af fri tekst — det er fase 2.

**Arbejdsmappe:** `C:\Praktik\websites\udstilling-wt-skema`
**Gren:** `spor/skema`, forgrenet fra `b5bb73d`
**Testnummer: 63** (din testfil: `tests/dele/63-ordbog-og-skema.mjs`). Ingen serverport — intet i browseren.

**Rør ALDRIG** `c:\Praktik\websites\salg` eller `c:\Praktik\website`.

**Læs først, i den rækkefølge:** `CLAUDE.md` · `STATUS.md` **Å115 og Å116**
(fase 0 og L81–L83 — det er hele baggrunden) · `db/LAESMIG.md` · `DATAFLOW.md` ·
`db/skema.sql` · `db/eksporter.mjs` · `db/migrer.mjs` (den fil, du skal afvikle) ·
`db/migrering-fremdrift.sql`s toptekst (projektets konvention for ALTER-filer ved
siden af et skema, der er skrevet "som om kolonnerne altid har været der").

---

## Regel 0 — skill-vurdering

Kald **`supabase-postgres-best-practices`** før du skriver én linje SQL — også for
en omdøbning. Skriv hvilke af dens regler du brugte, og hvilke du gik forbi.
Skriv også, at `robotdata` og `brief` blev gået forbi, og hvorfor. Lykkes et
skill-kald ikke fra worktreen, så læs `.claude/skills/<navn>/SKILL.md` fra disk og
**skriv i rapporten, at du gjorde det**.

---

## 1. Grundmåling — din FØRSTE kommando

```bash
node tools/validate.mjs
node tools/build.mjs            # UDEN --ud. Ellers staar dist/ tom og 12 tests fejler
node tests/koer.mjs
node db/eksporter.mjs --fra-db --ud=.tmp/eksport-foer     # KUN LAESNING af den levende DB
```

**Mine tal, målt umiddelbart før afsendelse på `b5bb73d`:**

| Måling | Værdi |
|---|---|
| validate | 77 filer · 0 fejl · 1 advarsel |
| build | 216 sider · 1111 tal med kilde, 0 uden |
| tests | 1534 bestaaet · 0 fejlet · Validator: 71 fangede 71 (maalt af den anden session 10:40 paa 36e1755; kun STATUS.md er aendret siden, og min egen genkoersel faldt paa ENOTEMPTY i tests/.tmp-koersel — GENMAAL, det er dit foerste tal) |
| eksport fra levende DB | 77 filer, 0 FEJL (fase 0 gjorde den mulig) |
| levende DB | 77 robotter · 2.541 feltposter (33/33 pr. robot) · 127 varianter · 76 anvendelser · 76 billeder · 33 feltdefinitioner |

**Afviger dine tal, så RAPPORTÉR afvigelsen** — det er en leverance, ikke ulydighed.
Fase 0's spor rettede tre af orkestratorens tal; det var dagens vigtigste fund.

**`.env` ligger i worktreen. Du har KUN læseadgang til den levende database.**
Du kører ALDRIG `db/migrer.mjs --til-db`, og du anvender ALDRIG en migrering på den
levende database. Orkestratoren anvender dine migreringsfiler, når de er
efterprøvet. Samme grænse som `spor/cjkui` og `spor/dbfelter` havde.

---

## 2. Opgaven — i skrive-grænser, ét commit pr. punkt

**Rækkefølgen er bindende, og punkt 1 skal committes ALENE, før du skriver noget
andet.** Orkestratoren læser ordbogen og siger til, hvis et navn skal ændres,
mens du arbejder på punkt 2 — det er billigere end at rette 78 kolonner bagefter.

### (1) `db/ordbog.mjs` — den ENE ordbog dansk ↔ engelsk

Hver **tabel** (7), hver **kolonne** (78 i den levende DB, målt), hver **enum-type**
(7) og hver **enum-label** (tilstand, status, kildetype, operator, ophav, feltform
og de 33 feltnavne), plus de **opremsede dataværdier**, der ikke er fri tekst:
`producentland` (8 distinkte, 62 "Kina"), `fremdrift`, `anvendelse.vaerdi`s
7 kategorier, og `feltdefinitioner`s `gruppe`/`art`/`dimension`-etiketter.

Krav: **1:1 og vendbart** — `tilDansk(tilEngelsk(x)) === x` for alt. Ét navn pr.
begreb, `snake_case`, hele ord, ingen forkortelser. **De fire tilstande (hård
begrænsning 5) skal forblive fire forskellige ord.** Betydningen henter du fra
`tools/skema.mjs`s kommentarer ved hvert felt, ikke fra en gætning på det danske
ord — `egenvaegt` er ikke "own weight". Er et navn ikke oplagt, så skriv én linje
begrundelse som kommentar ved det.

Anker, så reviewet går hurtigt (du må afvige med begrundelse):
`robotter → robots` · `feltposter → field_entries` · `feltpost_varianter →
field_entry_variants` · `anvendelse → applications` · `billede → images` ·
`feltdefinitioner → field_definitions` · `synk_aftryk` → **udgår** (se punkt 4).

### (2) `db/byg-migrering.mjs` + `db/migrering-engelsk.sql` — SQL genereret FRA ordbogen

L30-lærdommen: *"en brøk, hvis to halvdele kommer fra hver sin liste, skrider —
tavst."* Migreringen må ikke være en anden håndskrevet liste. `byg-migrering.mjs`
læser `ordbog.mjs` og skriver `migrering-engelsk.sql`: `ALTER TABLE … RENAME TO`,
`RENAME COLUMN`, `ALTER TYPE … RENAME TO`, `ALTER TYPE … RENAME VALUE`, en
`UPDATE` pr. opremset dataværdi, og de strukturelle tilføjelser fra punkt 3.
Filen committes, og testen (punkt 6) beviser, at den er byte-identisk med
generatorens output.

Skriv også **`db/migrering-cert.sql`** — de tre `alter type … add value if not
exists` for `fcc_oplyst`/`ul_oplyst`/`ccc_oplyst`, som `spor/cert` glemte, så
migreringstabellen kan blive sand (Å115). Idempotent; orkestratoren anvender den
som no-op.

### (3) `db/skema.sql` — skrevet om på engelsk, "som om det altid var sådan"

Plus tre strukturelle ændringer, alle fra L81:
- `images.alt` er **`jsonb`** med CHECK `jsonb_typeof = 'object'` — den levende DB
  har det allerede (fase 0), `skema.sql:617` siger stadig `text`.
- **`collected_by text`** og **`change_reason text`** på de skrivbare tabeller, og
  én **historiktabel** (`change_log` eller lignende) fyldt af en række-trigger ved
  UPDATE og DELETE: gammel række som jsonb, tabel, nøgle, `changed_by` (fra
  `collected_by`), `changed_at`, `reason` (fra `change_reason`). Det er
  fortrydelsesknappen OG hård begrænsning 2's spor — begge, jf. Å116.
- **`_i18n`-kolonnerne udgår** helt (skema.sql har 30 forekomster; den levende DB
  fik dem aldrig, og L82 gør dem meningsløse). `db/migrering-i18n.sql` slettes.
- **`source_wording NOT NULL` skrives IKKE ind nu** — 582 rækker ville falde. Det
  er fase 2's slutkriterium; skriv det som en kommentar ved kolonnen.

### (4) `db/eksporter.mjs` — læser engelsk, skriver den form bygget læser i dag

Eksporten mapper gennem `ordbog.mjs` tilbage til **nøjagtig** det danske
YAML-dokument, `data/robots/` har nu — build, validate og skabeloner rører du ikke.
Fjern de 11 `i18n`-steder. Ret `eksporter.mjs:16`s *"FORBEREDT, IKKE KOERT"*.
Bevar 33-assertionen (`omdanRobotFraDb`) — den er rigtig for en eksport.

### (5) Den ene retning lukkes

- **`db/migrer.mjs` slettes.** YAML → DB findes ikke længere; databasen er kilden
  (L81). Dermed forsvinder `kanonisk.json`, `seed.sql`, `FELTPOST_NOEGLER_KENDT`,
  `FELTNAVN_ENUM_I_SKEMA_SQL` og vagten — alle var værn mod en retning, der ikke
  findes mere.
- **`synk_aftryk` udgår** (drop i migreringen) — den var vagtens aftryk.
- **`db/rundtur.mjs` erstattes af `db/tjek.mjs`:** eksport fra den levende DB →
  dyb lighed mod `data/robots/` (samme `normaliserRobot(parseYaml())`-sammenligning
  som rundturen) → `validate` på eksporten → `build` sidetal og kildetal lig med
  original. Læs-kun. Det er fra nu af projektets bevis for, at databasen og bygget
  siger det samme.
- `db/hentbyg.mjs` beholdes (JPK's Studio → git → build), ret det, hvis det peger
  på noget slettet. `db/billeder.mjs` har **1** reference til et tabelnavn — ret den.
- `db/LAESMIG.md`, `db/DIAGRAM.md`, `db/ER-DIAGRAM.md` opdateres til det, der
  findes bagefter. **`DATAFLOW.md` rører du ikke** — skriv i rapporten, hvilke
  afsnit der er forældede, så orkestratoren retter den.

### (6) Tests

- **Slettes:** `tests/dele/07-db-vagt.mjs`, `28-dbnoegler.mjs`, `33-fremdrift-db.mjs`,
  `44-cjk-ordlyd-db.mjs`, `60-i18nfelt.mjs` — **114 assertions** (målt), alle om
  mekanismer, der ophører. **Reglen "ret assertions, slet dem ikke" gælder stadig:**
  i commit-beskeden lister du hver fil og skriver for hver, at den kun tester den
  fjernede retning — og finder du en assertion, der stadig beviser noget levende
  (fx en formregel på `advarsel_ordlyd`), så **flytter** du den til din 63-test i
  stedet for at slette den. Skriv antallet flyttede.
- **Ny `tests/dele/63-ordbog-og-skema.mjs`**, efter kontrakten i `tests/LAESMIG.md`:
  (a) ordbogen er vendbar for hver post · (b) hvert identifikator i `skema.sql`
  (tabel, kolonne, enum, label) findes i ordbogen præcis én gang, og ordbogen har
  ingen post, skemaet ikke bruger · (c) `byg-migrering.mjs`s output er byte-lig
  `migrering-engelsk.sql` · (d) eksporterens omdannelse af en **fixture** af
  engelske rækker (én robot — brug `addverb-trakr-20`s indhold i engelsk kolonneform
  som `tests/dele/fixtures/63-robot-en.json`) giver det danske dokument, der er
  dybt lig `data/robots/addverb-trakr-20.yaml` · (e) `migrering-cert.sql` er
  idempotent (hver linje har `if not exists`). **Se testen fejle først** for (a),
  (c) og (d), og skriv i rapporten, at du gjorde det.

### (7) `fund/FUND-skema.md` — rapporten (afsnit 8)

---

## 3. FORBUDT

- At oversætte fri tekst: `advarsel`, `note`, `citat`, `noter` — de forbliver danske
  i denne fase. Fase 2 genindsamler dem fra producenterne.
- At røre `tools/`, `data/`, `assets/`, `DESIGN.md`, `DATAFLOW.md`, `CLAUDE.md`,
  `STATUS.md` eller nogen test uden for punkt 6. **`spor/extract` kører samtidig og
  ejer `assets/*.css`, `DESIGN.md`, `tests/dele/34` og `61`.**
- At skrive til den levende database. `--fra-db` er læsning; alt andet er forbudt.
- At sætte `source_wording NOT NULL`.

---

## 4. Acceptkriterier — hvert er kørt mod main først

| # | Kommando | Giver i dag | Færdig når |
|---|---|---|---|
| A1 | `grep -n "^\s*alt\s" db/skema.sql` | `617:  alt  text,` | linjen siger `jsonb` |
| A2 | `grep -l "add value if not exists 'fcc_oplyst'" db/*.sql \| wc -l` | 0 | 1 |
| A3 | `grep -c "\brobotter\b\|\bfeltposter\b\|\bfeltpost_varianter\b\|\banvendelse\b\|\bbillede\b\|\bfeltdefinitioner\b\|\bsynk_aftryk\b" db/skema.sql` | 55 | 0 |
| A4 | `grep -c i18n db/skema.sql; grep -c i18n db/eksporter.mjs` | 30 / 11 | 0 / 0 |
| A5 | `grep -l "til-db" db/*.mjs \| wc -l` | 2 | 0 |
| A6 | `grep -rl "kanonisk.json" --include=*.mjs db tests/dele tools \| wc -l` | 4 | 0 |
| A7 | `grep -c "create table.*log\|create trigger" db/skema.sql` | 0 | ≥ 2 |
| A8 | `ls db/ordbog.mjs db/byg-migrering.mjs db/tjek.mjs db/migrering-engelsk.sql db/migrering-cert.sql \| wc -l` | 0 | 5 |
| A9 | `grep -c "FORBEREDT, IKKE KOERT" db/eksporter.mjs` | 1 | 0 |
| A10 | `ls tests/dele/07-* tests/dele/28-* tests/dele/33-* tests/dele/44-cjk* tests/dele/60-* 2>/dev/null \| wc -l` | 5 | 0 |
| A11 | `node db/byg-migrering.mjs \| diff - db/migrering-engelsk.sql \| wc -l` | (findes ikke) | 0 |
| A12 | `node tools/validate.mjs && node tools/build.mjs` | 77/0/1 · 216/1111/0 | **uændret** — du rører ikke data |
| A13 | `node tests/koer.mjs` | 1534 bestaaet · 0 fejlet · Validator: 71 fangede 71 (maalt af den anden session 10:40 paa 36e1755; kun STATUS.md er aendret siden, og min egen genkoersel faldt paa ENOTEMPTY i tests/.tmp-koersel — GENMAAL, det er dit foerste tal) | **forudsigelse:** grundtal − 114 + dine nye; `Validator: 71 fangede 71` uændret. Mål og skriv det faktiske |

**A14 kan du IKKE køre, og det skal stå i rapporten:** `node db/tjek.mjs` mod den
levende database giver først mening, når orkestratoren har anvendt
`migrering-engelsk.sql`. Din fixture-test (6d) er din stedfortræder for den. Skriv
den forventede kommandolinje og det forventede resultat (77/77 · validate 0 · 216=216
· 1111=1111), så orkestratoren kan køre den umiddelbart efter anvendelsen.

---

## 5. Sikkerhedsnet — hvorfor fase 1 skal være færdig FØR fase 2

Fase 2 er ikke startet. Databasen er derfor stadig 100 % genskabelig fra
`data/robots/` på `b5bb73d` med `git show b5bb73d:db/migrer.mjs`. Går
omdøbningen galt på den levende database, ruller orkestratoren tilbage ad den vej.
**Den dag fase 2's første tekst er skrevet, findes det net ikke mere** — så
migreringen skal være transaktionel (én `apply_migration`) og efterprøvet af din
fixture-test, før den anvendes.

---

## 6. Filejerskab

**Du ejer:** alt i `db/` · `tests/dele/63-ordbog-og-skema.mjs` (ny) ·
`tests/dele/fixtures/63-*` (ny) · de fem testfiler i punkt 6 (sletning) ·
`fund/FUND-skema.md`.

**Du må ikke ændre** noget andet. Skal du — fx fordi `tests/dele/_faelles.mjs`
viser sig at importere noget, du sletter — så **stop og rapportér** frem for at
udvide ejerskabet selv. (Målt: `_faelles.mjs` importerer `tools/yaml.mjs`, ikke
noget i `db/`; jeg forventer ingen kollision, men jeg har ikke kørt sletningen.)

---

## 7. Miljøfælder

- **`node`:** `/c/Program\ Files/nodejs/node.exe` — ikke på PATH i Git Bash.
- **Byg UDEN `--ud=`** mindst én gang, ellers står `dist/` tom og 12 tests fejler.
- **`sed -i`, der ikke matcher, gør intet, tavst.** Brug Edit-værktøjet.
- **UTF-8 UDEN BOM.** `skema.sql` og `eksporter.mjs` er fulde af danske kommentarer.
- **Commit-beskeder med backticks, `$` eller anførselstegn:** skriv dem til en fil,
  `git commit -F <fil>`.
- **Et `grep` med en konklusion skal have en kontrol:** skriv det forventede tal,
  FØR du læser det. Fase 0 fandt 3 fejl, hvor der var 70, fordi output blev klippet
  med `tail`.
- **Ryd `tests/.tmp-koersel` mellem testrunder** — den vokser ~2,5 GB pr. kørsel.
- **`.env` og `assets/fotos/fabrikant/` (610 filer) er kopieret ind.** Mangler
  R18-billeder alligevel, er det miljøet, ikke dit arbejde — se `fejljagt`.
- **PostgREST returnerer højst 1.000 rækker pr. kald.** Eksporteren undgår det med
  nested select på `robotter` (77 rækker). Bevar det mønster under det nye navn.

---

## 8. Rapporten — `fund/FUND-skema.md`, HØJST 60 linjer

1. Valgt løsning + fravalgt alternativ, én linje hver — især for navnene i ordbogen,
   hvor du afveg fra ankeret.
2. **Konfidens pr. punkt.** høj = målt med en kommando, orkestratoren kan genkøre
   den, PLUS én linje om hvad tallet ville have været, hvis arbejdet var forkert ·
   middel = efterprøvet indirekte (fixturen er middel — den er ikke den levende DB) ·
   lav = ikke efterprøvet. **Høj uden genkørbar kommando nedskrives til lav.**
3. Usikkerheder.
4. Målingerne som tal, A1–A13, plus A14's forventede kommando og resultat.

**Uden for de 60 linjer, obligatorisk:** *"Nye fælder og opdagelser"* ·
*"Punkter i briefet, jeg ikke nåede"* · **og listen over forældede afsnit i
`DATAFLOW.md`**, som orkestratoren skal rette.

---

## 9. Briefets fakta er påstande

**78 kolonner**, **7 enums**, **55 danske tabelnavne i skema.sql**, **114
assertions**, **4 kanonisk-referencer**, **1 reference i billeder.mjs**, og
grundmålingstallene er målt af orkestratoren 2. sep 2026 på `b5bb73d`. Måler du
andet, så skriv det — orkestratoren kontrolleres ellers af ingen. Ankernavnene i
punkt 1 er forslag, ikke krav.
