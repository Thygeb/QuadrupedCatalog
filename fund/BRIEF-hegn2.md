# BRIEF — `spor/hegn2`: luk konflikt 6, de to sidste bærende `--hegn`-kanter

**Model:** sonnet. **Gren:** `spor/hegn2`. **Worktree:** `c:\Praktik\websites\udstilling-wt-hegn2`
(grenet fra `19fb1e3`, som ER main i dag). **Rapport:** `fund/FUND-hegn2.md`.
**Forventet pris:** ~150-250k tokens. Ét suite-gennemløb (~2,8 GB disk) er budgetteret;
der var 20 GB fri, da sporet blev sendt.

**Kald `spor`-skillen som din første handling** — den bærer grundmålingen, skrive-grænsen,
kontrollinjen, filejerskabet, selv-efterprøvningen, rapportformen og miljøfælderne.
Lykkes kaldet ikke fra din worktree, så læs `.claude/skills/spor/SKILL.md` fra disk og
**skriv i rapporten, at du gjorde det.**

**Kald derefter `design`-skillen.** Den er navigationskortet til DESIGN.md. Læs de fire
regler i dens top, og slå **kun** disse afsnit op i `DESIGN.md`:

- **`DESIGN.md:947`** *"De fire datatilstande"* — `.v-ikke` er den tilstand, dette spor rører.
- **`DESIGN.md:1325-1341`** *"Konflikt 6"* — den regel, sporet skal lukke. Læs den ordret.
- **`DESIGN.md:386-387`** — `--hegn` og `--hegn-baerende`s roller i palettens prosa.

**Kortets linjenumre var forældede, da jeg målte dem** (skillen sagde datatilstande 934,
Konflikter 1169; målt 4. sep: **947** og **1186**). Rammer et nummer forkert, så find
afsnittet med `grep -nE "^#{2,3} " DESIGN.md` og **skriv i rapporten, at kortet var forældet.**

**MODE: Read.** Begge flader er Read — robotsiden (`.stribe--intet`) og robotsidens
typeskilt (`.maerke--tom`). Kriteriet er, at læseren skal kunne **forstå** tilstanden,
ikke løse en opgave.

**DESIGNFRYSEN GÆLDER IKKE HER, og her er hvorfor.** L70 undtager *"brudte hårde
begrænsninger"*. Hård begrænsning 5 lyder ordret: *"'Ikke oplyst', 'nej' og '0' er tre
forskellige tilstande og skal se forskellige ud."* Systembeslutningen er desuden **allerede
truffet** af `spor/tomstat` (R8, Å174) og skrevet i `system.css:203-211` og
`DESIGN.md:1339-1341`. Sporet **anvender** en vedtaget regel på de to steder, reglen selv
udpeger — det opfinder ingen ny.

---

## Hvad der ændrer sig på skærmen

| Flade | Element | Før | Efter |
|---|---|---|---|
| Robotside, nøgletalsstriben | `.stribe--intet` (den stiplede kasse *"ingen af de seks er oplyst"*) | Stiplet kant `#9AA3A9`, **2,07 : 1** mod kassens eget fyld `#E4E7EA` | Stiplet kant `#737F87`, **3,31 : 1** mod samme fyld |
| Robotside, typeskiltet | `.typeskilt .maerke--tom` (statusmærket, når status ikke er oplyst) | Stiplet kant `#9AA3A9`, **2,14 : 1** mod bunden `#E8EBED` | Stiplet kant `#737F87`, **3,43 : 1** mod samme bund |

**Ingen anden synlig ændring.** Kantens tykkelse, stiplingen, radius, polstring, skrift og
fyld står uændret. Berørt: **10 sider** for `.stribe--intet` og **30 sider** (38 elementer)
for `.maerke--tom` — mine tal, målt i `dist/` 4. sep 2026. **Genmål dem selv;** min
første tælling gav 11/31/40, fordi `grep -rl` talte `dist/system.css` med som en "side".

---

## Grundmålingen — mine tal, taget umiddelbart før afsendelse

Genmål dem **først**, før du rører noget. Afviger noget, så skriv afvigelsen — det er
en del af leverancen, ikke ulydighed.

| Kommando | Mit svar (4. sep 2026, `19fb1e3`) |
|---|---|
| `git log --oneline -1` | `19fb1e3` |
| `grep -c "dashed var(--hegn-baerende)" assets/system.css` | **2** |
| `sed -n '1022p;2052p' assets/system.css \| grep -c "var(--hegn)"` | **2** |
| `grep -ro "var(--hegn)" assets/ --include=*.css \| wc -l` | **42** (31 i `system.css`, 11 i `generator.css`) |
| `grep -c "ok(" tests/dele/59-farvetokens.mjs` | **14** |
| `node tools/validate.mjs` | 77 filer / 0 fejl / 1 advarsel — **citeret fra Å175, ikke min egen kørsel** |
| `node tools/build.mjs` | 216 sider, 1.111 kildemærker, 0 uden — **citeret fra Å175** |
| `node tests/koer.mjs` | 1815 bestået / 6 fejlet — **citeret fra Å175 (målt på `339eda9`)**. `19fb1e3` rørte kun `STATUS.md`, så tallet bør holde, men det er en **forudsigelse**, ikke en måling. Mål det selv |

**De 6 kendte røde, som IKKE er dine** (Å175): `4c` (Spots strøm ud) · 2 forbehold mærket
"gyldighed" · 1 fixture (`addverb-trakr-20`) · 2 × `64.3` (`unitree-aliengo`).

---

## Filejerskab

**Du ejer og må skrive i:**

- `assets/system.css` — **kun** linje 1022 og 2052 plus tokenkommentaren ved 199-202.
- `tests/dele/59-farvetokens.mjs` — udvides, se punkt 3.
- `DESIGN.md` — **kun** konflikt 6's afsnit (`:1325-1341`). Rør intet andet i filen.
- `fund/FUND-hegn2.md` — din rapport.

**Du må IKKE røre:** `assets/generator.css`, `tools/`, `data/`, `db/`, `STATUS.md`,
`CLAUDE.md`, `.claude/`, `PLAN.md`, nogen anden fil i `tests/`.

**Ingen andre spor kører i `assets/system.css`, `tests/dele/59-farvetokens.mjs` eller
`DESIGN.md` lige nu** — målt af mig, da sporet blev sendt. Starter et andet spor i
DESIGN.md, får du besked; commit da dit DESIGN.md-afsnit for sig, så flettet bliver billigt.

---

## Punkterne, i den rækkefølge de skal udføres

### 1. `.stribe--intet`s kant

`assets/system.css:1022` står i dag ordret:

```
  background:var(--tom);border:1px dashed var(--hegn);border-radius:var(--hjoerne);
```

**Det ønskede resultat:** `var(--hegn)` bliver til `var(--hegn-baerende)`. `background`
og `border-radius` står uændret.

**HVORFOR:** kassen er den eneste bærer af tilstanden *"ingen af de seks nøgletal er
oplyst"*. Dens fyld `--tom` (`#E4E7EA`) måler **1,05 : 1** mod bunden `#E8EBED` — altså
usynligt. **Kanten er derfor i praksis kassens eneste afgrænsning**, og en kant, der selv
er oplysningen, skal bruge `--hegn-baerende` (`DESIGN.md:1340-1341`).

**LAD `.stribe--intet .ikon` PÅ `:1025` STÅ.** Den er `color:var(--hegn)` og **skal ikke
ændres i dette spor** — blokken har en overskrift og et afsnit, der siger det samme med
ord, så ikonet er redundant og ikke omfattet af WCAG 1.4.11. **Mål den alligevel og meld
tallet** i rapporten under *"Nye fælder og opdagelser"*, så beslutningen er dokumenteret
frem for glemt.

**Acceptkriterium 1:** færdig, når
`sed -n '1022p' assets/system.css | grep -c "var(--hegn-baerende)"` viser **1**
og `sed -n '1022p' assets/system.css | grep -c "var(--hegn)"` viser **0**.
*Giver i dag **0** og **1**.*

### 2. `.typeskilt .maerke--tom`s kant

`assets/system.css:2052` står i dag ordret:

```
  background:none;border:1px dashed var(--hegn);
```

**Det ønskede resultat:** `var(--hegn)` bliver til `var(--hegn-baerende)`.
`background:none` står uændret.

**HVORFOR:** `spor/tomstat` målte, at `.maerke--tom`s `background:var(--tom)` er **dødt** —
netop denne regel overskriver det med `background:none`, bekræftet i browseren som
`rgba(0,0,0,0)`. Mærket har derfor **hverken fyld eller udfyldt plade**; den stiplede kant
er den eneste forskel mellem *"ikke oplyst"* og de øvrige statusser. Det er hård
begrænsning 5's kerne.

**Acceptkriterium 2:** færdig, når
`sed -n '2052p' assets/system.css | grep -c "var(--hegn-baerende)"` viser **1**
og `grep -c "dashed var(--hegn-baerende)" assets/system.css` viser **4**.
*Giver i dag **0** og **2**.*

**Og mål, hvad mærket faktisk står på.** `background:none` betyder, at naboen er det, der
ligger bagved — og jeg **ved ikke**, om det er `--bund` (`#E8EBED`) eller `--panel`
(`#FAFBFB`). Mål det i browseren med `getComputedStyle` på forælderen og skriv tallet.
**Begge naboer holder:** jeg har regnet `#737F87` til **3,43** mod `#E8EBED` og **3,96**
mod `#FAFBFB`, begge over 3,00. Rettelsen er altså sikker uanset svaret — men tallet skal
i rapporten med sin læseretning, ikke som "over kravet".

### 3. To nye assertions i test 59, der læser gennem token-kæden

`tests/dele/59-farvetokens.mjs` har allerede alt, du skal bruge: `farveI()` (:201),
`kontrast()`, `vis()` og mønstret `baerer()` (:245). **Genbrug dem — skriv ingen ny
kontrastberegner.**

**Det ønskede resultat:** to nye `ok(`-kald, nummereret **59.25** og **59.26**:

- **59.25:** `.stribe--intet`s KANT måler ≥ 3,00 mod **både** sit eget FYLD og `--bund`,
  læst gennem `var()`-kæden (ikke som literal hex). Fejlteksten skal skrive *hvad på hvad*
  ved hvert tal.
- **59.26:** `.typeskilt .maerke--tom`s KANT måler ≥ 3,00 mod `--bund`, og reglen bruger
  `var(--hegn-baerende)` — altså både kontrasttallet og den strukturelle lås, som 59.21 og
  59.23 er delt i.

**HVORFOR to slags assertion:** Å174 målte, at test 59 låste **hex** og var **blind for
kontrast** — justerer nogen et nabo-token, falder tallet under kravet, mens testen bliver
grøn. En hex-lås alene gentager den fejl.

**Acceptkriterium 3:** færdig, når `grep -c "ok(" tests/dele/59-farvetokens.mjs` viser
**16**. *Giver i dag **14**.*

**Acceptkriterium 3b — KONTRAFAKTISK, og den er obligatorisk.** Sæt `:1022` og `:2052`
midlertidigt tilbage til `var(--hegn)`, kør suiten, og skriv **hvilke testnumre der bliver
røde, og med hvilke tal i fejlteksten**. Sæt dem derefter tilbage og kør igen. Færdig, når
59.25 og 59.26 er **røde** i det mellemtrin og **grønne** bagefter, og de øvrige 24
assertions i test 59 er **uændrede** begge gange. **En test, du ikke har set gå rød, er
ikke en test.**

### 4. Tokenkommentaren ved `system.css:199-202`

Den siger i dag ordret: *"`--hegn` bliver staaende uroert paa sine oevrige **41**
brugssteder"*.

**Målt af mig 4. sep:** `grep -ro "var(--hegn)" assets/ --include=*.css | wc -l` giver
**42** i dag, altså **40** efter dine to rettelser. **Ret tallet til dit eget målte tal**,
og skriv kommandoen ind i kommentaren, så næste læser kan genmåle det. Er mit 42 forkert,
så skriv dit tal og hvordan du målte — ikke mit.

**Acceptkriterium 4:** færdig, når kommentaren bærer et tal, der er lig med
`grep -ro "var(--hegn)" assets/ --include=*.css | wc -l` efter dine rettelser.

### 5. DESIGN.md konflikt 6 lukkes

`DESIGN.md:1332-1341` siger i dag ordret: *"**Konflikten er ikke lukket:** `.stribe--intet`
(10 sider) og `.typeskilt .maerke--tom` (30 sider) bærer stadig en oplysning på en
`--hegn`-kant på 2,14 : 1 mod bunden."*

**Det ønskede resultat:** afsnittet ændres fra **DELVIST AFGJORT** til **AFGJORT**, med
dine egne målte tal og med `spor/hegn2` + datoen som kilde. **Slet ikke historikken** —
DESIGN.md siger selv: *"en løst konflikt, der slettes, efterlader ingen forklaring på,
hvorfor koden ser ud, som den gør."* Reglen i `:1340-1341` (*"forsvinder konturen uden at
en oplysning forsvinder med den…"*) står **uændret**; den er nu anvendt tre steder i
stedet for ét.

**Skriv desuden, at `.stribe--intet .ikon` blev bevidst ladt på `--hegn`, og hvorfor** —
ellers ligner det en forglemmelse for næste læser.

**Acceptkriterium 5:** færdig, når
`grep -c "Konflikten er ikke lukket" DESIGN.md` viser **0** *(giver i dag **1**)*
og `grep -c "hegn2" DESIGN.md` viser **≥ 1** *(giver i dag **0**)*.

### 6. Kør apparatet og meld tallene

`node tools/validate.mjs` · `node tools/build.mjs` · `node tests/koer.mjs`, i den
rækkefølge, **én gang** hver til sidst.

**Acceptkriterium 6:** færdig, når `node tests/koer.mjs` viser **samme antal røde som din
egen grundmåling, plus 0**, og de nye 59.25/59.26 er blandt de grønne.

**SAMMENLIGN FEJLTEKSTERNE, IKKE NETTOTALLET.** Å175's dyrest købte lærdom: `9 → 8` ser
ens ud, uanset om én test blev grøn, eller tre blev grønne og to nye blev røde. Skriv de
røde testnumre **ved navn** i din grundmåling og igen til sidst, og sammenlign de to lister.

---

## Miljø — det, der er særligt for netop dette spor

- **`node` er ikke på PATH i Git Bash.** Brug `"/c/Program Files/nodejs/node.exe"`.
  Resten står i `.claude/skills/spor/references/miljoefaelder.md`.
- **Din port er 8126.** Aldrig 8080. Server startes fra worktree-roden med fuld sti:
  `/c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe -m http.server 8126 --directory dist`
  — **aldrig `cd dist`**, så låser serveren mappen og næste byg fejler med EPERM.
  **Verificér serveren mod disken, før ét eneste tal bruges:** vælg en streng, der kun
  findes i din udgave (fx `hegn-baerende` på `:2052`), og sammenlign
  `curl -s http://localhost:8126/system.css | grep -c "<streng>"` med `grep -c` på filen.
- **Skærmbilleder fra Playwright-MCP lander i HOVEDREPOET, ikke i din worktree** —
  Å174's fund. Flyt dem ind i din worktree, og skriv i rapporten, at du gjorde det.
- **`.env` (122 bytes) og `assets/fotos/fabrikant/` (610 filer, 60 MB) er kopieret ind
  af mig.** Genmål antallet, hvis validate klager over manglende billeder.
- **Du må køre `tests/koer.mjs`** — men kun de kørsler, punkt 3b og 6 kræver. Hver kørsel
  koster ~2,8 GB i `tests/.tmp-koersel`, og disken er den hårde grænse.

## Commit-rækkefølge

1. Punkt 1 + 2 + 4 (`assets/system.css`) — ét commit.
2. Punkt 3 (`tests/dele/59-farvetokens.mjs`) — ét commit, **efter** at du har set 59.25 og
   59.26 gå røde og grønne igen.
3. Punkt 5 (`DESIGN.md`) — ét commit for sig, så det kan flettes uafhængigt, hvis et andet
   spor senere rører filen.
4. Rapporten (`fund/FUND-hegn2.md`) — ét commit.

**Commit undervejs.** Et spor, der dør, skal efterlade sit arbejde.

---

## To ting, der gælder hele briefet

**Briefets fakta er PÅSTANDE.** Alle tal ovenfor er mine målinger eller mine citater.
**Afviger noget, du måler, fra noget, briefet påstår, så rapportér afvigelsen** — det er
en del af leverancen, ikke ulydighed. Å175 og Å174 blev begge bedre, fordi spor rettede
orkestratorens tal frem for at ramme dem.

**Sporets ophav og dets eneste forbehold.** Punkterne kommer fra Å174's afsnit *"TO
OPFØLGNINGSSPOR, MELDT AF SPORET OG IKKE RETTET"*, ikke fra `fund/PLAN-designarbejde.md`.
Å174 bærer **ét** forbehold, og det er citeret ordret i punkt 2: *"`.maerke--tom`s
`background:var(--tom)` er DØDT i praksis — overskrevet af `.typeskilt
.maerke--tom{background:none}`… Ét af de syv `var(--tom)`-brugssteder når aldrig skærmen."*
**Ud over det bærer Å174 ingen forbehold for disse to punkter.**
