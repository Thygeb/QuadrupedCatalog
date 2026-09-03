# BRIEF — spor/produkort: producentsidens CE-faktafejl + impeccable analyse mod DESIGN.md

**Model:** opus · **Port:** 8138 · **Testnummer:** 76 · **Gren:** `spor/produkort`,
forgrenet fra `951fd29` · **Worktree:** `C:\Praktik\websites\udstilling-wt-produkort`

**Forventet pris:** ~400k tokens (opus, to leverancer, hvoraf den ene dømmes med øjne).

**Hjemmel:** JPK 3. sep 2026, ordret: *"Ja send den nu sammen med et impeccable analyse
flow på UI designet"* — og umiddelbart efter: *"husk at DESIGN.md beskriver hvordan
websiden skal være designet, for at sikre konsistens og standardisering af websidens
udseende og funktionalitet."*

**Sporet har TO leverancer. Den ene retter noget. Den anden retter INTET.** Bland dem
aldrig sammen — se afsnit 3's designfrys.

---

## 0. Din første handling

**Kald `spor`-skillen** (Skill-værktøjet, `skill: "spor"`). Den bærer grundmålingen,
skrive-grænsen, kontrollinjen, filejerskabet, selv-efterprøvningen, rapportformen og
konfidensskalaen. Lykkes kaldet ikke fra worktreen, så læs `.claude/skills/spor/SKILL.md`
fra disk og **skriv i rapporten, at du gjorde det**.

**Læs derefter DESIGN.md (834 linjer) — HELE FILEN, ikke kun de afsnit, jeg citerer.**
Det er projektets designsystem og JPK's udtrykkelige ramme for dette spor. Alt, du
foreslår eller bygger, måles mod den.

**Læs også `fund/PLAN-producent.md` (754 linjer).** Den er fladens egen plan og nævner
`ceOpgoerelse`/*"0 af 2"* **11 gange** (målt af mig). **Din analyse må ikke genopfinde
det, planen allerede har afgjort** — citér planen, hvor den dækker et fund, og skriv
tydeligt hvad der er NYT.

**Skills til leverance B, med diskstier som udtrykkelig reserve:**

```
impeccable            C:/Users/thyge/.claude/skills/impeccable/SKILL.md
```

Kaldet til bruger- og plugin-skills fra en worktree **lykkes nogle gange og fejler andre
gange** — vi ved ikke hvorfor. Fejler det, så læs `SKILL.md` fra disken og **skriv i
rapporten, at du gjorde det**, så et stille fallback ikke forveksles med, at skillen kørte.

**Skriv i rapporten, hvilke øvrige skills du vurderede og gik forbi, med begrundelse.**

---

## 1. Grundmålingen — målt af mig på `951fd29`, genmål den som din første kommando

```
node tools/validate.mjs   ->  77 fil(er) · 0 fejl · 1 advarsler
node tools/build.mjs      ->  Byggede 216 sider. Kildemaerker: 1111 tal med kilde, 0 uden
```

**Testsuiten er RØD i forvejen, og det er ikke dig.** Å150 målte **1691 bestået / 8
FEJLET** på `1437838`. Tallet er en **forudsigelse** — `spor/testvend` retter netop de
otte lige nu, så tallet kan være ændret, når du måler. **Mål det selv og skriv det
faktiske.** Dit spor er uskyldigt i alt, der allerede var rødt, og skyldigt i enhver NY rød.

---

## LEVERANCE A — faktafejlen på 25 producentsider

### Ændringen i UI-termer

| Hvor | Før | Efter |
|---|---|---|
| Producentsidens EU-afsnit, `<p class="eu-fund-linje">` | **`0 af 2`** på Xiaomis side, efterfulgt af *"robotter i kataloget oplyser CE-mærkning fra producenten."* | Alle tre tilstande synlige, hver med sit mærke fra DESIGN.md: **ja**, **nej** og **ikke oplyst** |

**Fejlen, målt af mig på den byggede side:** `dist/da/producenter/xiaomi/index.html` viser
**`0 af 2`**. Xiaomi CyberDog 2 bærer et **dokumenteret nej** (`ce_oplyst.vaerdi: false`
med kilde). Tallet gør producentens dokumenterede *"der er ikke CE"* visuelt umuligt at
skelne fra *"vi ved det ikke"*. **Fejlen står på 25 producentsider**
(`grep -l "eu-fund-tal" dist/da/producenter/*/index.html | wc -l` → **25**).

### Mekanismen — regnestykket er RIGTIGT, trykket er forkert

`tools/skabelon/producent.mjs:144` `ceOpgoerelse()` returnerer ordret:

```js
  return { ja, nej, ukendt, i_alt: modeller.length };
```

Men `producent.mjs:212` bruger kun to af de fire:

```js
<b class="eu-fund-tal">${esc(flet(T(i18n, 'forside_eu_tal'), { n: t.ja, m: t.i_alt }))}</b>
```

`t.nej` og `t.ukendt` beregnes og **smides væk**. Det er hele fejlen.

### Hvorfor dette IKKE er designarbejde, og hvorfor du alligevel skal følge DESIGN.md

Designfrysen (L70) undtager udtrykkeligt *"fejl hvor rettelsen ikke rører en
systembeslutning"*, og Å150 kalder selv dette punkt *"en faktafejl, ikke design"*. Det
bryder **hård begrænsning 5**, ordret fra CLAUDE.md: *"'Ikke oplyst', 'nej' og '0' er tre
forskellige tilstande og skal se forskellige ud. Det er der, katalogsider lyver."*

**Men du opfinder ikke et nyt udtryk for tilstandene — DESIGN.md har dem allerede.**
DESIGN.md:583 *"De fire datatilstande"* definerer klasserne, og de er systemets kerne:

- `.v-ja` — em-baseret `.62em`, åben firkant med fyldt kerne
- `.v-nej` — **fast 10,5px**, versaler, 0,13em spatiering, fuld blæk, udfyldt 9×9px firkant
- `.v-ikke` — **fast 11px**, minuskler, `blaek3` på `tom`-flade, stiplet `hegn`-kant,
  9×9px stiplet firkant

**Genbrug dem. Opfind ingen ny klasse.** Filen har allerede mekanismen: `producent.mjs`
bruger `ctx.__H.tilstand(byTilstand, i18n)` til hjemstedsfeltet — **samme vej skal CE-
opgørelsen gå.** Find det kald, læs hvad hjælperen kan, og brug det.

**Kræver rettelsen nye i18n-nøgler, så skriv dem ved linje 46-47**, hvor
`forside_eu_tal` og `forside_eu_paastand` allerede bor. **IKKE ved linje 364 og IKKE ved
linje 429** — se afsnit 4's kollisionsadvarsel. Nøglerne skal i **begge** sprogfiler.

**Formuleringen af sætningen er dit valg, men den skal kunne læses højt uden at lyve.**
*"1 af 2 oplyser CE-mærkning"* er sandt og skjuler stadig, at den anden er et dokumenteret
nej. Skriv, hvad du valgte, og hvorfor.

### Acceptkriterier — kørt mod main af mig, giver i dag de tal, der står

```
node tools/build.mjs
grep -o "0 af 2" dist/da/producenter/xiaomi/index.html          # i dag: 1  -> skal blive 0
grep -c "v-nej" dist/da/producenter/xiaomi/index.html           # i dag: MAAL DET FOERST
grep -c "eu-fund-tal" dist/da/producenter/*/index.html | wc -l  # 25 sider, skal forblive 25
```

Færdig, når Xiaomis side viser det dokumenterede nej med `.v-nej`-mærket, når ingen
producentside har mistet sit EU-afsnit, og når `node tools/validate.mjs` står uændret på
**77 fil(er) · 0 fejl · 1 advarsler**.

**Kontrafaktisk, som du selv skal køre:** find en producent, hvor ALLE modeller er "ikke
oplyst", og bekræft, at dens linje ikke pludselig påstår et nej. Skriv producentens navn
og det målte resultat.

### Testen — `tests/dele/76-produkort.mjs`, NY fil

Nummer 76 er ledigt (75 er taget af `spor/prisnote`, som kører nu). Læs
`tests/LAESMIG.md`s kontrakt. **`tests/koer.mjs` opdager filer selv** — målt i kilden,
`tests/koer.mjs:59-62` filtrerer `/^\d\d-.*\.mjs$/` fra `tests/dele/`. **Rør ikke
`koer.mjs`.**

Assertions, der skal bevise fejlen er væk **og ikke kan komme igen**:

1. Xiaomis producentside viser det dokumenterede nej som en egen tilstand, begge sprog.
2. En producent med udelukkende "ikke oplyst" viser **ikke** et nej.
3. **Revert-bevis:** en syntetisk opgørelse med `nej > 0` fanges af samme tjek — så testen
   beviseligt kan fejle.

---

## LEVERANCE B — impeccable analyse af producentsidens UI mod DESIGN.md

### DETTE ER EN ANALYSE. DU RETTER INGENTING.

**Designfrysen står, JPK 1. sep 2026:** *"vi skal have en overordnet designplan, inden vi
retter noget design."* **Fund noteres, de rettes ikke.** Den eneste undtagelse i dette
spor er leverance A's faktafejl.

Fælden, frysen lukker, er at **et designfund kan LIGNE en almindelig fejl**. Er du i tvivl,
om noget er en designrettelse: **det er det.** Skriv det som et fund.

### Navngiv fladens MODE — og den er givet her

**Producentsiden er `Read`:** den besøgende skal forstå noget om en producent, ikke løse
en opgave. Katalogsiden er `Operate`. **Bedøm fladen efter Read-kriteriet**, ikke efter
Operate. Skriv MODE'et eksplicit i din analyse — CLAUDE.md kræver det hver gang, og
projektet behandlede de to ens i alt arbejde før 1. sep.

### Rammen er DESIGN.md, ikke almen smag

JPK's ord: *"for at sikre konsistens og standardisering af websidens udseende og
funktionalitet."* **Hvert eneste fund skal pege på et sted i DESIGN.md** — en farve, en
skriftgrad, en komponent, en *"gør"* eller *"lad være"* (DESIGN.md:630-673), eller en af
de opregnede **konflikter** (DESIGN.md:674+).

Et fund uden en DESIGN.md-henvisning er en smagsdom, og den hører ikke i denne rapport.
Finder du noget ægte, som DESIGN.md **ikke dækker**, så skriv det i et eget afsnit
*"Huller i DESIGN.md"* — det er den mest værdifulde del af leverancen, fordi det er dér
standardiseringen mangler.

**TYPESKILT står uændret som gældende retning, og paletten er låst.** Skillen respekterer
selv vores låse: *"The brief wins. Honor pinned aesthetics, eras, materials, fonts, and
palettes."* Foreslå aldrig en ny palet eller en ny skrift.

### Sådan kører du den

Brug `impeccable`s analyse-kommandoer — **`critique`** (virker designet: hierarki,
informationsarkitektur, kognitiv belastning) og **`audit`** (teknisk kvalitet:
tilgængelighed, ydelse, responsivitet). **Ikke** `shape`, `polish`, `layout` eller nogen
kommando, der producerer eller ændrer kode — de er frosset.

**Mål fladen med egne øjne, ikke kun i kildekoden.** Server på **din egen port 8138**:

```
/c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe -m http.server 8138 --directory dist
```

kørt **fra worktree-roden**, aldrig `cd dist`. **Verificér serveren mod disken, før ét
eneste tal bruges** — port 8080 er delt, og en fremmed servers svar ser præcis ud som dit
eget. Vælg en streng, der kun findes i din udgave, og sammenlign `curl` mod `grep`.

Skærmbilleder, som kan læses med Read-værktøjet:

```
node C:/Praktik/websites/maalevaerktoej/flade-skud.mjs <url> <bredde> <udfil.png>
node C:/Praktik/websites/maalevaerktoej/maal.mjs <url> [bredde]
```

**Mål mindst to bredder** (1440 og 390) og **begge sprog** — producentsiden findes på
`dist/{da,en}/producenter/<slug>/`. Vælg mindst tre producenter med forskellig karakter
(mange modeller, én model, og en med huller i data), og skriv hvilke du valgte og hvorfor.

**Advarsel om impeccables egen detektor:** `detect.mjs` kører **stille degraderet** her —
fire parser-moduler mangler, og den fejler ikke, den *dæmpes*: exit 0, tom liste, én linje
på stderr. Målt mod en kontrolside med bevidst slop fandt den **2 af 13** fund og **nul**
CSS-afhængige regler, kontrastmåling inklusive. **Bruger du dens tal, så validér motoren
mod et kendt svar først, og skriv valideringen.** Kan du ikke validere den, så brug den
ikke — mål i browseren i stedet.

### Leverancen

**`fund/ANALYSE-produkort.md`** — et selvstændigt dokument, ikke en del af rapporten.
Struktur:

1. **MODE og hvad fladen skal lykkes med** (Read).
2. **Fund, rangeret efter hvor meget de koster læseren** — hvert med: hvad der er galt,
   hvilken DESIGN.md-regel det bryder (med linjenummer), hvad det ville koste at rette,
   og om `fund/PLAN-producent.md` allerede dækker det.
3. **Huller i DESIGN.md** — hvor fladen gør noget, systemet ikke har en regel for.
4. **Det, der VIRKER** og skal bevares. En analyse, der kun rummer fejl, kan ikke bruges
   til at beslutte noget.

**Hvert fund skal bære en måling**, ikke et indtryk: px, kontrasttal med **læseretning**
(DESIGN.md's egen lærestreg: *"Et kontrasttal uden en læseretning er ikke et tal"* —
paletkommentarens `9,19` var rigtigt for gunmetal **på** gult, mens tokenet bruges som
forgrund og giver **1,38:1**), antal, skriftgrader.

---

## 3. Rækkefølge og commits

1. **Grundmåling** — commit intet, men skriv den ned.
2. **Leverance A**, én commit: `producent.mjs` + i18n + den nye test, samlet, så commit'en
   er grøn i sig selv.
3. **Leverance B**, én commit: `fund/ANALYSE-produkort.md`.
4. **Rapporten**, sidste commit: `fund/FUND-produkort.md`.

**COMMIT UNDERVEJS.** Et spor, der dør af en sessionsgrænse, efterlader kun det, der er
committet — tre spor døde sådan i går, og kun det committede overlevede.

---

## 4. Filejerskab — komplet, og FIRE andre spor kører samtidig

**Du ejer og må skrive i:**

```
tools/skabelon/producent.mjs
data/i18n/da.json, data/i18n/en.json   (KUN omkring linje 46-47 - se advarslen)
tests/dele/76-produkort.mjs            (NY fil)
fund/BRIEF-produkort.md, fund/ANALYSE-produkort.md, fund/FUND-produkort.md
```

**Du må IKKE røre — hver ejes af et spor, der kører NU:**

```
tools/skabelon/robot.mjs      spor/prisnote
tools/skabelon/katalog.mjs    spor/prisnote
tools/skabelon/side.mjs       spor/sidefod
assets/system.css             spor/sidefod
assets/generator.css          spor/testvend
tests/dele/31, 35, 48, 57     spor/testvend
tests/dele/62                 spor/prisnote
tests/dele/75                 spor/prisnote
tests/koer.mjs                rør den ikke - den opdager din testfil selv
data/robots/                  0 aendringer er et acceptkriterium
STATUS.md, DESIGN.md          orkestratorens - LAES dem, skriv aldrig i dem
```

### i18n-KOLLISIONEN — den har allerede kostet én runde i dag

**Tre spor skriver i `data/i18n/*.json` samtidig:**

```
linje  46-47   DIG          (forside_eu_tal, forside_eu_paastand)
linje  364     spor/prisnote
linje  429     spor/sidefod  (allerede committet)
```

**Skriv KUN omkring linje 46-47.** Der er over 300 linjers afstand til de to andre, og en
tekstuel flet går rent. Skriver du i bunden af filen eller nær 364/429, laver du en
konflikt, der først opdages hos mig.

**Og der findes en symmetritest, i en fil du ikke ejer.**
`tests/dele/35-typeskilt-katalog.mjs:221` lyder:

```js
const kunDa = Object.keys(da).filter((k) => !(k in en));
```

**Enhver nøgle skal i BEGGE sprogfiler** — tilføjelser såvel som sletninger. Går 35.25 rød
af din asymmetri, ser fejlen ud som `spor/testvend`s, og der bliver brugt en runde på at
lede det forkerte sted. Kør før og efter:

```
node -e "const f=require('fs');const da=JSON.parse(f.readFileSync('data/i18n/da.json','utf8'));const en=JSON.parse(f.readFileSync('data/i18n/en.json','utf8'));console.log('kun da:',Object.keys(da).filter(k=>!(k in en)),'kun en:',Object.keys(en).filter(k=>!(k in da)));"
```

Begge lister skal være tomme. **Skriv begge målinger i rapporten.**

---

## 5. Miljø

- **`node` er ikke på PATH i Git Bash.** Brug `/c/Program\ Files/nodejs/node.exe`.
  Exit **127** med `command not found` er PATH; exit 127 med `Assertion failed` og
  `src\win\async.c` er libuv-fælden efter et `fetch`. **Læs teksten, ikke kun koden.**
- **DISKEN ER KRITISK: 11 GB fri, 96 % brugt, og du er det FEMTE spor.**
  `tests/.tmp-koersel` kan nå 2,5 GB **pr. worktree** — målt: `wt-testvend` står på
  3106 MB, heraf 2946 MB i den mappe. **Ryd din egen efter HVER testkørsel**, ikke først
  til sidst; oprydning bagefter taber kapløbet. **Rammer du ENOSPC: STOP.** Det er miljøet
  og ikke din kode — meld det, frem for at fejlsøge dig selv.
- **Skærmbilleder fylder også.** Slet dine PNG'er, når du har læst dem, og behold kun dem,
  analysen faktisk henviser til.
- **Mål altid mod `git merge-base`, aldrig `git diff main..<gren>`** — main rykker videre,
  og en almindelig diff viser mains nye filer som SLETNINGER. Å145.

---

## 6. Rapporten

**Fil:** `fund/FUND-produkort.md`. Form og konfidensskala står i `spor`-skillen — højst 60
linjer plus de to obligatoriske sektioner uden for loftet.

**Skriv derudover, som egne sektioner:**

- **Før-og-efter i UI-termer, ØVERST** (CLAUDE.md afsnit 2b): hvad JPK ser på Xiaomis
  producentside bagefter, og på hvor mange sider. Måling og konfidens **bagefter**.
- **Hvordan du formulerede CE-sætningen**, og hvorfor.
- **Om `impeccable`-kaldet lykkedes fra worktreen**, eller om du læste `SKILL.md` fra disk.
- **Om `detect.mjs` blev valideret** — og hvis ikke, at dens tal derfor ikke er brugt.

---

## 7. Briefets fakta er PÅSTANDE

Hvert linjenummer, citat og tal ovenfor er slået op af mig i dag på `951fd29` — men jeg
kan tage fejl, og linjenumre flytter sig. **Afviger noget, du måler, fra noget briefet
påstår, så RAPPORTÉR AFVIGELSEN. Det er en del af leverancen, ikke ulydighed.**

**Mærkning af tallene i dette brief:** **25 sider**, **`0 af 2`**, **11 omtaler i
PLAN-producent.md**, **i18n-linjerne 46/364/429** og **DESIGN.md's 834 linjer** er
**målt** af mig i dag. **1691/8** er en **forudsigelse** fra Å150 og er formentlig ændret,
fordi `spor/testvend` arbejder på præcis de otte. **`v-nej`-tælleren på Xiaomis side er
UMÅLT** — mål den, før du ændrer noget, ellers kan du ikke vise, at den steg.

**Du fletter ALDRIG selv.** Orkestratoren fletter.
