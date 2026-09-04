# BRIEF — `spor/flader`: syv impeccable-pas over alle fem flader, sekventielt

**Model:** opus (designspor, L45). **Gren:** `spor/flader`. **Worktree:**
`c:\Praktik\websites\udstilling-wt-flader` (**ikke oprettet endnu**).
**Rapport:** `fund/FUND-flader.md`. **Port:** 8171 (din egen — brug aldrig 8080).
**Forventet pris:** 400-800k tokens. **Stort spor — commit efter hvert pas.**

**Kald `spor`-skillen som din første handling** — den bærer grundmålingen,
skrive-grænsen, kontrollinjen, filejerskabet, selv-efterprøvningen,
rapportformen og miljøfælderne. Lykkes kaldet ikke fra din worktree, så læs
`.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at du gjorde
det.**

**Kald derefter `design`-skillen.** Den er navigationskortet til DESIGN.md's
1.359 linjer og siger, hvilket afsnit der svarer på hvad. **Kopiér ikke
DESIGN.md ind i dit arbejde — peg på den.**

**Kald `impeccable` for hvert pas nedenfor.** Lykkes kaldet ikke fra worktreen,
så læs `.claude/skills/impeccable/SKILL.md` fra disk — den er projektlokal og
følger med worktreen — og **skriv i rapporten, at du gjorde det.**

---

## Hvad JPK har bedt om

Ordret, 4. sep 2026: *"start 1 spor med en kombination af disse skills 'polish,
layout, typeset, colorize, bolder, quieter, harden' på alle sider… enten
parallelt eller sekventielt."*

**Valget er truffet: SEKVENTIELT, og det er ikke en præference.** Alle syv
kommandoer skriver i `assets/system.css` og `assets/generator.css`. To
parallelle spor på dem giver garanteret flettekonflikt — det skete
`fund/PLAN-designarbejde.md`s R7 og R9, hvor tre CSS-grene kolliderede på én
aften og to måtte løses i hånden, selv om planen havde advaret om det.

**DESIGNFRYSEN ER OPHÆVET (L98, JPK 4. sep 2026: *"OPHÆV REGLEN"*).** Alle 23
impeccable-kommandoer er lovlige, også de 16 der retter fladen. Du skal ikke
bede om lov til at rette et designfund.

**Kravet, der IKKE faldt med frysen:** rører en rettelse en **systembeslutning**
— en palettefarve, en skriftgrad, en radius, et token — så er den en
**systemregel** og skal skrives som en, ikke som et hastespor på én flade.

---

## De fem flader og deres MODE

**Skriv MODE'et i rapporten ved hvert pas.** En Read-flade dømt efter
Operate-kriteriet får de forkerte anmærkninger.

| Flade | Skabelon | MODE |
|---|---|---|
| Kataloget (sprogroden) | `tools/skabelon/katalog.mjs` | **Operate** |
| Sammenligningssiden | `tools/skabelon/` (find den selv) | **Operate** |
| Robotsiden | `tools/skabelon/side.mjs` | **Read** |
| Producentsiden + indeks | `tools/skabelon/producent.mjs` | **Read** |
| Om os | `tools/skabelon/` (find den selv) | **Read** |

---

## Rækkefølgen — og hvorfor den ikke må ombyttes

```
1. layout      2. typeset      3. colorize
4. bolder / quieter (pr. MODE)
5. polish      6. harden
```

**`polish` og `harden` er sidste kvalitetspas.** Kørt før `layout` og `typeset`
polerer de noget, der bliver lavet om igen.

**`bolder` og `quieter` er modsatrettede og må ALDRIG køres på samme flade.**
Delingen går på MODE:

- **`bolder` på Operate-fladerne** (katalog, sammenligning) — og kun på
  handlingselementerne: filterknapper, nulstil, enhedskontakten, sorteringen.
- **`quieter` på Read-fladerne** (robotside, producentside, Om os) — på krommet,
  så indholdet står frem.

Kører du begge på samme flade, ophæver de hinanden, og diffen bliver umulig at
dømme.

---

## Grundmåling — første kommando, og den skal stå i rapporten

```
node tools/validate.mjs
node tools/build.mjs
node tests/koer.mjs
```

**Forudsigelse, ikke krav** (mål og skriv det faktiske): validate **77 filer /
0 fejl / 1 advarsel** · build **216 sider, 1.111 kildemærker, 0 uden** · tests
**1817 bestået / 6 fejlet**. De seks røde er kendte og navngivne i STATUS.md
Å178; **skriv dem ved navn i din grundmåling**, så en syvende ikke kan skjule
sig blandt dem.

Afviger et af tallene, så **stop og rapportér** — så er der sket noget på main,
og resten af briefet hviler på et forkert grundlag.

---

## Pas 1 — `impeccable layout`

**Det målbare mål, og det er sporets vigtigste enkelttal.**

```
grep -rhoE "(padding|margin)(-top|-right|-bottom|-left)?: *[0-9.]+px" assets/*.css | sort -u | wc -l
```

**Giver i dag: 78.** Det er 78 forskellige rå px-værdier i afstande, ved siden
af en afstandsskala, der allerede findes (`--r1` 4px … `--r9` 96px, 92
erklæringer bruger den).

**Det er præcis samme fund som `spor/skriftskala`s 29 rå `font-size`-værdier**,
som blev til 21 navngivne trin. Den måling er nu **0** — kør den selv som
kontrol:

```
grep -rhoE "font-size: *[0-9.]+px" assets/*.css | sort -u | wc -l     # giver i dag 0
grep -cE "^\s*--fs-[a-z0-9-]*:" assets/system.css                     # giver i dag 21
```

**Acceptkriterium 1:** de 78 er nede på **højst 10**, og hver overlevende rå
værdi har en skreven begrundelse i rapporten (fx en 1px-kant eller en optisk
korrektion, der ikke hører på skalaen). **Sænk ikke tallet ved at flytte
værdier til nye tokens uden for `--r`-skalaen** — så er problemet bare flyttet.

---

## Pas 2 — `impeccable typeset`

Skriftskalaen er allerede lukket (0 rå px, 21 tokens). **Dette pas handler om
HIERARKI, ikke om at opfinde flere trin.**

**Acceptkriterium 2:** antallet af `--fs-`-tokens er **højst 21** bagefter —
det må gerne falde, ikke stige. Rapporten viser for hver flade, hvilke trin den
faktisk bruger, og om to trin gør samme arbejde. **Giver i dag: 21 tokens, og
ingen opgørelse pr. flade findes.**

---

## Pas 3 — `impeccable colorize`

**PALETTEN ER LÅST. TYPESKILT står som gældende retning.** Foreslå aldrig en ny
palet, en ny skrift eller en ny æra. `impeccable` respekterer selv låsen: *"The
brief wins. Honor pinned aesthetics, eras, materials, fonts, and palettes."*

**ET KONTRASTTAL UDEN EN LÆSERETNING ER IKKE ET TAL.** Palettens egen kommentar
sagde engang `9,19` — rigtigt for gunmetal **på** gult. Tokenet blev målt som
**baggrund** og bruges som **forgrund**, hvor det giver **1,38:1** mod WCAG's
4,5. Hver kontrastmåling i din rapport skal sige, **hvad der står på hvad**.

**Acceptkriterium 3:** hver farveændring står i rapporten som `<forgrund> på
<baggrund> = <tal>:1`, med den kommando eller det værktøj, der gav tallet.
Ingen ændring uden et par.

---

## Pas 4 — `impeccable bolder` (Operate) og `quieter` (Read)

Se delingen ovenfor. **Acceptkriterium 4:** rapporten navngiver for hver af de
fem flader, hvilken af de to der blev kørt, og hvorfor — og ingen flade har
fået begge. **Giver i dag: 0 af 5 flader behandlet.**

---

## Pas 5-6 — `impeccable polish`, derefter `impeccable harden`

**Acceptkriterium 5:** `node tests/koer.mjs` giver **mindst 1817 bestået og
præcis de samme 6 røde ved navn.** Flere beståede er fint (du må tilføje
tests). En syvende rød er en regression og skal rettes, ikke forklares.
**Giver i dag: 1817 bestået / 6 fejlet**, målt af orkestratoren på main
`02a20f2` umiddelbart før dette brief blev sendt.

---

## DE FIRE DATATILSTANDE — det, dette spor lettest kommer til at ødelægge

Hård begrænsning 5, ordret: ***"'Ikke oplyst', 'nej' og '0' er tre forskellige
tilstande og skal se forskellige ud. Det er der, katalogsider lyver."***

**Et `quieter`- eller `polish`-pas, der dæmper `.v-nej` og `.v-ikke` mod
hinanden, bryder projektets hårdeste regel — og det ser pænere ud bagefter.**
Det er den farligste enkeltrisiko i hele sporet.

Målt i dag i `assets/system.css`: `.v-tal` 35 · `.v-nul` 1 · `.v-nej` 11 ·
`.v-ja` 12 · `.v-ikke` 25 · `.v-billede` 10 forekomster.

**Acceptkriterium 6:** efter alle seks pas kan du vise, at `.v-nul`, `.v-nej` og
`.v-ikke` er **visuelt forskellige** — forskellig skriftgrad, mærke eller vægt,
ikke kun forskellig tekst. Skriv de tre satser ved siden af hinanden i
rapporten. **Giver i dag: de tre klasser FINDES** (11, 1 og 25 forekomster i
`system.css`), **men deres satser er ikke stillet op ved siden af hinanden
nogen steder — så gør det som noget af det FØRSTE, ikke kun til sidst.** Uden
en før-opstilling kan du ikke bevise, at et `quieter`-pas ikke har dæmpet dem
mod hinanden. DESIGN.md's afsnit *"De fire datatilstande"* definerer dem; slå det
op via `design`-skillens kort.

---

## Filejerskab

**Du ejer:** `assets/system.css` · `assets/generator.css` ·
`tools/skabelon/*.mjs` · en NY testfil i `tests/dele/` (find næste ledige
nummer efter kontrakten i `tests/LAESMIG.md`) · `fund/FUND-flader.md` ·
`fund/skud-flader/`.

**Du må IKKE røre:** `data/` · `db/` · `tools/build.mjs` · `tools/validate.mjs`
· `tools/skema.mjs` · `STATUS.md` · `CLAUDE.md` · `PLAN.md` · `.claude/`.

**DESIGN.md er en undtagelse med en betingelse:** den skal opdateres, så den
beskriver resultatet — men **i sin egen, sidste commit**, efter at alle seks pas
er kørt. Ikke undervejs. Brug `impeccable document`.

**Eksisterende tests må VENDES, ikke slettes.** Ændrer en regel sig, så vend
assertionen, så den beviser den nye regel. **Læs testens NAVN, før du beder om
at vende den:** bærer det et L-nummer eller en datohenvisning, så står
beslutningen i testens navn og intet andet sted. To tests hed engang
`35.11: CE-facetten er vaek (L55 punkt 3)` — havde de været vendt, var en
gældende beslutning forsvundet uden spor.

**Sænk aldrig en grænseværdi for at få noget grønt.** Sig det hellere højt i
rapporten.

---

## Miljø

- **`node` er ikke på PATH i Git Bash:** brug `/c/Program\ Files/nodejs/node.exe`.
- **Server:** `/c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe -m http.server 8171 --directory dist` **fra worktreens rod**, aldrig `cd dist`.
- **Validér serveren mod disken, før ét eneste tal bruges.** Vælg en streng, der
  kun findes i din egen udgave, og sammenlign `curl`-svaret med `grep` på disken.
  Tre forældreløse servere er målt kørende samtidig; en fremmed servers svar ser
  præcis ud som dit eget.
- **Impeccables `detect.mjs` kører STILLE DEGRADERET her.** Fire parser-moduler
  mangler; den fejler ikke, den dæmpes: **exit 0, tom liste, én linje på stderr.**
  Målt mod en kontrolside med bevidst slop fandt den **2 af 13** fund og **nul**
  CSS-afhængige regler, kontrastmåling inklusive. **En tom fundliste fra den er
  ikke en blank attest.** Validér motoren mod et kendt svar, før dens tal bruges
  — eller lad være med at bruge den og mål selv i browseren.
- **Disken er fælles og presset** (~10 GB fri, andre spor kører). Én
  `tests/koer.mjs` er ~2,8 GB. **Kør den ved grundmålingen og efter pas 6 — ikke
  mellem hvert pas.**
- Resten står i `.claude/skills/spor/references/miljoefaelder.md`.

---

## Commit-rækkefølge

**Én commit pr. pas, i rækkefølgen ovenfor.** Det er ikke pænhed: et spor på
400-800k tokens kan dø på en sessionsgrænse, og commit-undervejs er det eneste,
der gør, at arbejdet kan genoptages. Det blev målt 27. aug, hvor et stallet spor
blev genoptaget uden tab, fordi tre commits lå der.

1. `layout` 2. `typeset` 3. `colorize` 4. `bolder`/`quieter`
5. `polish` 6. `harden` 7. tests 8. DESIGN.md + rapport

**Skærmbilleder:** før og efter, 1440 og 390 px, mindst én flade pr. MODE, i
`fund/skud-flader/`. Brug
`node C:/Praktik/websites/maalevaerktoej/flade-skud.mjs <url> <bredde> <udfil.png>`.

---

## Briefets fakta er påstande

**Afviger noget, du måler, fra noget dette brief påstår, skal afvigelsen
rapporteres — det er en del af leverancen, ikke ulydighed.** Tallene 78, 21, 0,
92 og forekomsttallene for de seks tilstandsklasser er mine målinger fra
4. sep 2026 på main `02a20f2`. Modbevis dem gerne.

**Rapportform:** højst 60 linjer plus de to obligatoriske sektioner uden for
loftet (*"Nye fælder og opdagelser"* og *"Punkter i briefet, jeg ikke nåede"*),
plus én før/efter-tabel pr. pas, som er leverancen og ikke tæller med i loftet.
**Konfidens bindes til bevistype, ikke fornemmelse:** høj kræver en genkørbar
kommando **plus** en kontrafaktisk linje.
