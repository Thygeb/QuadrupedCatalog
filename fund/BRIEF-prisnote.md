# BRIEF — spor/prisnote: flyt prisnoten fra katalogsiden til robotsiden

**Model:** sonnet · **Port:** 8137 · **Testnummer:** 75 · **Gren:** `spor/prisnote`,
forgrenet fra `c0f9b76` · **Worktree:** `C:\Praktik\websites\udstilling-wt-prisnote`

**Forventet pris:** ~150k tokens. Mekanisk facit, ingen dataindsamling, ingen designretning.

**Hjemmel:** JPK's køede punkt (2) i STATUS.md Å150, ordret: prisnoten *"skal flyttes fra
katalogsiden til robotsiden ved de øvrige noter; den bor i dag som `filter_pris_note`
(`katalog.mjs:321`) og `sortering_pris_note` (`katalog.mjs:589`)"*. Bekræftet af JPK i
samtalen 3. sep 2026: *"Kør denne: (2) Prisnoten → robotsiden"*.

---

## 0. Din første handling

**Kald `spor`-skillen.** Den bærer grundmålingen, skrive-grænsen, kontrollinjen,
filejerskabet, selv-efterprøvningen, rapportformen og miljøfælderne. Lykkes kaldet ikke
fra din worktree, så læs `.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten,
at du gjorde det**.

**Øvrige skills:** `fejljagt`, hvis noget opfører sig uventet — en rød test du ikke
forudså, et acceptkriterium der giver samme tal uanset input. Ingen designskill: dette
er en flytning af en eksisterende tekst, ikke en ny flade. `robotdata` er ikke relevant
— **du rører ikke `data/robots/`**.

---

## 1. Grundmålingen — målt af mig på `c0f9b76` kl. 13:2x, genmål den som din første kommando

```
node tools/validate.mjs     ->  77 fil(er) · 0 fejl · 1 advarsler
node tools/build.mjs        ->  Byggede 216 sider. Kildemaerker: 1111 tal med kilde, 0 uden
```

**Testsuiten er RØD i forvejen, og det er ikke dig.** Å150: **1691 bestået / 8 FEJLET**
(`35.11 da/en`, `35.12 da/en`, `48.11 da/en`, `57.1`, `31.8`). De otte rettes af
`spor/testvend`, som kører parallelt med dig. Tallet 1691/8 er en **forudsigelse** fra
Å150 målt på `1437838`; `c0f9b76` ændrede kun STATUS.md (1 linje), så det bør holde —
**mål det selv og skriv det faktiske tal.** Dit spor er uskyldigt i alt, der allerede
var rødt; det er skyldigt i enhver NY rød.

---

## 2. Hvad der skal ændres — i UI-termer

| Hvor | Før | Efter |
|---|---|---|
| **Katalogsiden**, filterblokkens Pris-facet | Note under skalaen: *"De 11 oplyste priser vises i USD, omregnet med Den Europæiske Centralbanks referencekurs for 31.08.2026… De 66 robotter uden oplyst pris står som deres egen række; de er hverken billige eller dyre."* + ECB-link | **Ingen note.** Skalaen står alene |
| **Katalogsiden**, sorteringens noteliste | Note ved sortering «Pris»: *"Priserne vises i USD, omregnet med… så de 11 oplyste priser kan ordnes i én række…"* | **Ingen note** |
| **Robotsiden**, nøgletalsstribens prisfelt | Ingen note om omregning (målt: 0 forekomster af "referencekurs"/"reference rate" i `dist/{da,en}/robotter/unitree-go2/index.html`) | **Note ved prisfeltet**, samme form som EU/CE-noten: `<p class="feltnote">` med omregningsteksten + ECB-kildelink |

**Nævneren, målt af mig 3. sep:** 11 robotter har en oplyst pris (generatorens eget tal i
noten: 11 oplyste + 66 uden = 77). **7 af de 11** bærer en kildepris i fremmed valuta
(`grep -l "stribe-kildepris" dist/da/robotter/*/index.html | wc -l` giver **7**).
Forskellen mellem 11 og 7 er robotter, hvis pris allerede står i USD.

**DU SKAL BESLUTTE OG BEGRUNDE ÉT VALG, og skrive det i rapporten:** vises noten på alle
11 prisbærende robotsider, eller kun på de 7, hvor der faktisk er omregnet? Mit råd er
**de 11** — en robot, hvis pris allerede er i USD, er stadig underlagt den samme
basisvaluta-beslutning, og en note der forsvinder på 4 af 11 sider er en usynlig regel.
Men **mål begge tal og skriv dem**; afviger din konklusion fra mit råd, så skriv hvorfor.
Noten må **aldrig** stå på en robotside uden pris (66 stk.) — der ville den forklare
noget, der ikke er der.

---

## 3. Punkterne, i den rækkefølge de skal udføres — hver sin commit

### Punkt 1 — noten ind på robotsiden

**Fil:** `tools/skabelon/robot.mjs`

**Forlægget, som du skal følge**, `robot.mjs:900` ordret:

```js
    ? `<p class="feltnote feltnote--eu">${esc(T(i18n, 'eu_forklaring'))}</p>`
```

og linje 902: `const noter = advarselBlok(post, ctx) + noteBlok(post) + varianter(post, ctx) + euNote;`

Prisnoten skal bæres samme vej — som en `feltnote` knyttet til **prisfeltets** række,
ikke som løs prosa i bunden af siden. Prisfeltet renderes af `prisVaerdi()`
(`robot.mjs:117`), som kaldes fra `robot.mjs:412-413`.

**Teksten er IKKE ny og må ikke digtes.** Den afledes af de to eksisterende i18n-nøgler
(se punkt 3). ECB-kildelinket findes allerede som `KURSER.kilde.url` — se hvordan
`katalog.mjs:1093` bygger det, og genbrug samme kilde. **Hård begrænsning 2: opfind
aldrig tal, kurser eller datoer.** Kursdatoen skal komme fra samme sted som i dag.

**HVORFOR:** JPK's begrundelse er, at noten forklarer et tal, der står på robotsiden —
den hører ved tallet, ikke ved et filter.

**Acceptkriterium — kørt mod main af mig, giver i dag `0`:**

```
node tools/build.mjs
grep -c "referencekurs" dist/da/robotter/unitree-go2/index.html   # i dag: 0
grep -c "reference rate" dist/en/robotter/unitree-go2/index.html   # i dag: 0
```

Færdig, når begge giver **1**, og når antallet af robotsider med noten er lig det tal, du
begrundede i afsnit 2 (11 eller 7) — **skriv det målte tal, ram ikke mit**:

```
grep -l "referencekurs" dist/da/robotter/*/index.html | wc -l
```

Kontrol, der skal give **0** og beviser, at noten ikke lækker til prisløse sider:

```
for f in $(grep -L "stribe-kildepris\|pris-par" dist/da/robotter/*/index.html); do grep -l "referencekurs" $f; done | wc -l
```

### Punkt 2 — noten væk fra katalogsiden

**Fil:** `tools/skabelon/katalog.mjs`

To steder, begge citeret fra filen som den står nu:

- **linje 321:** `    noteNoegle: 'filter_pris_note',`
- **linje 589:** `    note: 'sortering_pris_note',`

Og den plumbing, der kun findes for prisnotens skyld:

- **linje 1093:** `  const prisNoteHtml = \`${esc(pris.note)} <a class="url" href="${attr(KURSER.kilde.url)}"` …
- **linje 1160:** `${skalaBlok(pris, 6, ' facet--raekkeslut facet--sidste-raekke', prisNoteHtml)}`

**FÆLDE, og den er den eneste måde dette punkt kan gå galt: `noteNoegle`-maskineriet er
GENERISK og bruges også af nyttelast.** `katalog.mjs:306` er
`noteNoegle: 'filter_nyttelast_note'`, og `:365` (`note: tf(spec.noteNoegle, …)`),
`:1047` (`<p class="t-mikro skala__note">`) og `:1392-1394` (`sorterNoter`) er delt
maskineri. **Fjern PRISENS nøgler, ikke mekanismen.** Nyttelastnoten skal stå uændret
bagefter.

**HVORFOR:** en fjernet mekanisme ville tage nyttelastnoten med sig tavst — den slags
fejl er grøn i alle tests, indtil nogen kigger på siden.

**Acceptkriterium — kørt mod main af mig, giver i dag de tal, der står:**

```
node tools/build.mjs
grep -c "referencekurs" dist/da/index.html            # i dag: 1   -> skal blive 0
grep -c "reference rate" dist/en/index.html           # i dag: 2   -> skal blive 0
grep -c "skala__note" dist/da/index.html              # i dag: MAAL DET FOERST -> skal falde med praecis 1
```

Færdig, når de to første giver **0**, og når nyttelastnoten stadig står:

```
grep -c "filter_nyttelast_note" tools/skabelon/katalog.mjs   # skal stadig give 1
grep -o "nyttelast[^<]*" dist/da/index.html | grep -c "kg"   # nyttelastnoten er der endnu
```

### Punkt 3 — i18n

**Filer:** `data/i18n/da.json`, `data/i18n/en.json`

- `filter_pris_note` (da:428 / en:428) og `sortering_pris_note` (da:364 / en:364) bliver
  **ubrugte** efter punkt 2. Fjern dem **ikke** blindt — kør først:
  `grep -rn "filter_pris_note\|sortering_pris_note" tools/ tests/` og fjern dem kun, hvis
  tælleren er 0 uden for i18n-filerne. Er der en efterladt læser, så rapportér den.
- Den nye nøgle til robotsiden skrives i **begge** filer. Teksten afledes af de to
  eksisterende: behold *"omregnet med Den Europæiske Centralbanks referencekurs for
  {dato}"* og *"Kildemærket peger stadig på producentens egen side, hvor beløbet står i
  dens egen valuta"*. **Udelad** sætningen om *"De {u} robotter uden oplyst pris står som
  deres egen række"* — den handler om filterrækken og er falsk på en robotside.

**HVORFOR:** en flyttet tekst, der beholder sin gamle kontekst, bliver en påstand om
noget, der ikke findes på den nye side.

**Acceptkriterium:** `node tools/build.mjs` giver **0 fejl**, og
`node tools/validate.mjs` står uændret på **77 fil(er) · 0 fejl · 1 advarsler**.
En manglende i18n-nøgle skal få bygget til at fejle — **efterprøv at det faktisk sker**
ved midlertidigt at fjerne din nye nøgle fra `en.json` og se bygget fejle; virker det
ikke, har du ingen dækning, og det skal stå i rapporten.

### Punkt 4 — testen

**Fil:** `tests/dele/75-prisnote.mjs` — **NY fil, nummer 75 er ledigt** (højeste i dag
er 74, målt med `ls tests/dele/ | grep -o "^[0-9]*" | sort -n | tail -1`).

Læs `tests/LAESMIG.md`s kontrakt først. Assertions, der skal bevise flytningen begge veje:

1. Prisnoten står på robotsiden, begge sprog.
2. Prisnoten står **ikke** på katalogsiden, begge sprog.
3. Noten står på præcis det antal robotsider, du begrundede — og på **0** sider uden pris.
4. Nyttelastnoten står stadig på katalogsiden (værnet mod at maskineriet blev revet ud).

**Skriv assertion 4, selv om den ikke handler om din opgave** — den er det eneste, der
fanger fælden i punkt 2.

---

## 4. Filejerskab — komplet, og tre andre spor kører samtidig

**Du ejer og må skrive i:**

```
tools/skabelon/robot.mjs
tools/skabelon/katalog.mjs
data/i18n/da.json
data/i18n/en.json
tests/dele/75-prisnote.mjs      (NY fil)
fund/FUND-prisnote.md           (din rapport)
```

**Du må IKKE røre — hver af dem ejes af et spor, der kører NU:**

```
tools/skabelon/side.mjs         spor/sidefod
assets/system.css               spor/sidefod (ny sektion i bunden) + spor/testvend
assets/generator.css            spor/testvend
tests/dele/*.mjs  (alle EKSISTERENDE filer, saerligt 31, 35, 48, 57)
                                spor/testvend
data/robots/                    0 aendringer er et acceptkriterium
STATUS.md                       orkestratorens
```

**`tests/dele/75-prisnote.mjs` er en NY fil og kolliderer derfor ikke** — men rør ingen
af de eksisterende. Skal `tests/koer.mjs` registrere din nye del eksplicit? **Mål det**
(jeg fandt ingen eksplicit importliste, men efterprøvede det ikke), og rør kun `koer.mjs`,
hvis registrering faktisk kræves — skriv i rapporten, hvad du målte.

**i18n-fælden:** `spor/sidefod` tilføjer også nøgler til de to i18n-filer, samlet i én
blok. Læg dine nye nøgler **ved siden af de eksisterende pris-nøgler**, ikke i bunden af
filen, så de to spor ikke skriver samme sted. Kør `git diff data/i18n/da.json` og se på
den, før du committer.

---

## 5. Miljø

- **`node` er ikke på PATH i Git Bash.** Brug `/c/Program\ Files/nodejs/node.exe`.
  Exit **127** med `command not found` er PATH; exit 127 med `Assertion failed` og
  `src\win\async.c` er libuv-fælden efter et `fetch`. **Læs teksten, ikke kun koden.**
- **Din port er 8137.** Aldrig 8080 — den deles med alle spor. Server:
  `/c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe -m http.server 8137 --directory dist`
  kørt **fra worktree-roden**, aldrig `cd dist`.
  **Verificér serveren mod disken, før ét eneste tal bruges** — se `spor`-skillen.
- **DISKEN ER KNAP: 7,5 GB fri, 97 % brugt, og tre spor kører ved siden af dig.**
  `tests/.tmp-koersel` kan nå 2,5 GB pr. worktree. **Ryd din egen
  `tests/.tmp-koersel` efter hver testkørsel**, ikke først til sidst. Rammer du ENOSPC,
  er det miljøet og ikke dit arbejde — se `fejljagt`, og meld det i rapporten.
- **`tests/koer.mjs` må du gerne køre** — udstilling-20 har målt i kilden
  (`tests/koer.mjs:31`, `tests/dele/_faelles.mjs:17-20`), at `tests/.tmp-koersel` er
  **pr. worktree**, ikke delt. Konfidens **middel**: mekanismen er læst, ikke bevist med
  to samtidige kørsler. Går det galt med ENOTEMPTY, så er det den måling, der var forkert
  — meld det, det er et fund værd.

---

## 6. Rapporten

**Fil:** `fund/FUND-prisnote.md`. Form og konfidensskala står i `spor`-skillen — højst
60 linjer plus de to obligatoriske sektioner uden for loftet.

**Skriv derudover, som egne sektioner:**

- **Før-og-efter i UI-termer, ØVERST** (CLAUDE.md afsnit 2b): hvad JPK ser på
  katalogsiden bagefter, hvad han ser på en robotside bagefter, og på hvor mange sider.
  Måling og konfidens kommer BAGEFTER, ikke først.
- **Dit valg af 11 eller 7** med begrundelsen og begge målte tal.
- **Om `koer.mjs` krævede registrering** af din nye testdel.

---

## 7. Briefets fakta er PÅSTANDE

Hvert linjenummer, citat og tal ovenfor er slået op af mig i dag på `c0f9b76` — men jeg
kan tage fejl, og mine linjenumre flytter sig, hvis nogen committer før dig.
**Afviger noget, du måler, fra noget, briefet påstår, så rapportér afvigelsen. Det er en
del af leverancen, ikke ulydighed.** To agenter rettede orkestratorens fakta 26.-27. aug,
begge på eget initiativ, begge korrekt — det var sessionens billigste kvalitetskontrol.

Tallet **1691/8** er en **forudsigelse**, ikke et krav. **11** og **7** er **målte** tal,
men på `dist/` som den stod kl. 13:2x. **`skala__note`-tælleren i punkt 2 er
UMÅLT af mig** — mål den, før du ændrer noget, ellers kan du ikke vise, at den faldt med
præcis 1.
