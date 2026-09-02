# BRIEF — spor/extract: L76, L78, L79 og L80 bygges ind i systemet

**Skrevet 2. sep 2026. Gren `spor/extract`, worktree
`C:\Praktik\websites\udstilling-wt-extract`, forgrenet fra `36e1755`.**

Dette er led 2 (`extract`), første af to spor. Du bygger **fire systemregler**,
JPK traf i dag. **L77 (knapprimitivet) er IKKE dit** — det følger som spor 2,
fordi det også skal ændre `tools/skabelon/*.mjs`. Rør dem ikke.

Designfrysen L70 er ophævet for netop disse fire punkter. Den gælder stadig
for alt andet.

---

## De fire regler, ordret som JPK traf dem

**L76 — `--accent` er en BAGGRUND og en MARKØR, aldrig tekst på en lys flade.**
På lys flade må accent være baggrund, kant, understregning eller fokusring.
**Tekst PÅ accent er altid `--blaek`, aldrig hvid.** På den mørke flade (`--blaek`)
MÅ accent være tekst. Links bliver `--blaek` med understregning; accent flytter
til hover og fokus.

**L78 — et produktfoto beskæres aldrig.** `object-fit:contain` og
`aspect-ratio:4/3` overalt. Ét sideforhold, én fit, ingen fladespecifik
undtagelse.

**L79 — stansningen vinder.** 2px bliver systemets radius **overalt**, og den
bliver et token. De bløde `--rund`/`--rund-ind`/`--rund-lille` udgår.
JPK's ord: *"der skal være konsistens i websiden"* — derfor ét trin, ikke to.

**L80 — `--sans` udgår. Saira til maskinen, Literata til mennesket.**
`--sans`' tre brug peger på Saira. `h1`–`h4`, UI og data er Saira, arvet fra
`body`, som sættes eksplicit. Løbende prosa er Literata; de 8 nuværende
`--manual`-brug beholdes.

---

## Målinger, jeg har taget i dag — og hvad de betyder for dig

**Kontrastforholdene, målt med en kontrol (sort mod hvid gav 21,00):**

```
FEJL   1,38 : 1   accent som tekst paa bund      krav 4,5
FEJL   1,60 : 1   accent som tekst paa panel     krav 4,5
FEJL   1,66 : 1   HVID tekst paa accent          krav 4,5
ok     9,19 : 1   BLAEK tekst paa accent
FEJL   4,10 : 1   blaek2 paa accent              krav 4,5  <- taet paa, brug BLAEK
ok     9,19 : 1   accent som tekst paa blaek
```

`--blaek2` fejler snævert. **Brug `--blaek`, ikke `--blaek2`, som tekst på accent.**

**De seks hvid-på-accent-regler, alle 1,66 : 1** — de er flere end konflikten
beskrev, og `::selection` er den mest oversete:

```
system.css:242     ::selection{background:var(--accent);color:#FFFFFF}
system.css:1405    .filtre input:checked + label{...color:#FFFFFF}
system.css:1422    background:var(--accent);border:1px dashed #FFFFFF;color:#FFFFFF
system.css:2040    background:var(--accent);color:#FFFFFF
generator.css:94   .filtre input:target + label{...color:#FFFFFF}
generator.css:97   background:var(--accent);border:1px dashed #FFFFFF;color:#FFFFFF
```

**Billedrammen:**

```
system.css:1071    .billedled{aspect-ratio:16/10}      + :1075 object-fit:cover
generator.css:1284 .net .billedled{aspect-ratio:4/3}   + :1288 object-fit:contain
generator.css:290  .billedled--stor{aspect-ratio:16/10}
```

Kortene (328 billedled) gør allerede det rigtige. **Robotsidens 154 skal med.**

**Radius:** 31 tokeniserede brug (`--rund` 10, `--rund-ind` 12, `--rund-lille` 9)
mod **26** hårdkodede `border-radius:2px`. Tre regler ophæver allerede `--rund`
tilbage til 2px, scopet under `.typeskilt` — `system.css:1616`, `:1618`, `:1621`.
**De skal væk, fordi de bliver standarden.**

**FÆLDE, jeg selv gik i, og som du skal kende: `--stans` er OPTAGET.**
`system.css:163` — `--stans:var(--p-stans)` er en **farve** (hvid, lyskanten i
en stansning). Radius-tokenet skal hedde noget andet. `--hjoerne` er ledigt
(målt: 0 forekomster af `--hjoerne`, `--radius` og `--stansning`). Vælg selv,
men skriv hvad du valgte.

**Skrifterne:**

```
assets/fonts/    saira 10 filer (5 vaegte x 2 subsets) · literata 2 · manrope 0
--mono   62 brug (Saira)   --manual 8 (Literata)   --sans 3 (Manrope, fantom)
system.css:227   body{font-family:var(--sans)}
system.css:235   h1,h2,h3,h4{...}   <- saetter INGEN font-family, arver body
```

---

## Punkterne, med kørte acceptkriterier

**Hvert tal nedenfor er kørt mod `main` i dag.** Det er "giver i dag X" —
kommandoen måler noget, den ændrer sig.

### 1. L76 — accent ud af forgrunden på lys flade

```
kommando                                                     i dag   skal give
grep -c 'a{color:var(--accent)' assets/system.css                1           0
grep -h 'background:var(--accent)' assets/*.css | grep -c '#FFFFFF'  6       0
```

Links bliver `--blaek` med understregning. Accent flytter til hover/fokus.
De 20 regler, der bruger accent som forgrund, skal gennemgås **enkeltvis**:
de, der står på `--blaek`, må blive (9,19 : 1). Skriv i rapporten, hvor mange
du beholdt og hvor mange du flyttede.

**HVORFOR:** 7.892 `<a>`-elementer på 216 sider står i dag på 1,38 : 1.

### 2. L78 — én billedramme

```
grep -h -o 'aspect-ratio:16/10' assets/*.css | wc -l             2           0
grep -h -o 'object-fit:cover'   assets/*.css | wc -l             2           0
```

Alle rammer 4:3, alle billeder `contain`. `.billedled--stor` må gerne blive
som **variant** (den har sin egen kant), men dens sideforhold og fit følger
reglen.

**HVORFOR:** med `cover` mister 40 af 65 målte fotos over 10 %, gennemsnit
18,3 %, værst 59 %. Robotsiden er den flade, hvor man mest vil se maskinen.

### 3. L79 — én radius, som token

```
grep -h -o 'border-radius:2px' assets/*.css | wc -l             26           0
grep -cE '^\s*--rund[a-z-]*:' assets/system.css                  3           0
grep -cE '^\s*--hjoerne:' assets/system.css                      0           1
```

Alle 26 hårdkodede værdier bliver ét token. De tre bløde tokens udgår, og
deres 31 brugssteder peger på det nye. De tre `.typeskilt`-scopede ophævelser
slettes.

**HVORFOR:** en hårdkodet værdi 26 steder er præcis den tilstand, `extract`
findes for at afskaffe.

### 4. L80 — `--sans` udgår

```
grep -h -o 'Manrope' assets/system.css | wc -l                   4           0
grep -h -o 'var(--sans)' assets/*.css | wc -l                    3           0
```

`body` sættes eksplicit til Saira. `h1`–`h4` må gerne fortsætte med at arve —
men skriv i rapporten, om du satte den eksplicit eller lod den arve, og hvorfor.

**HVORFOR:** hver overskrift og al brødtekst tegnes i dag i operativsystemets
standardskrift, fordi Manrope ikke har en fil.

### 5. DESIGN.md skal følge med — ellers lyver den igen

`DESIGN.md` er **din**, og det er ikke valgfrit. Led 1's hele pointe var, at
filen beskrev et forladt system. Fire ting i den bliver forkerte af dit arbejde:

- `typography:`-blokken navngiver **Manrope** i `display`, `headline`, `title`
  og `body`
- `rounded:`-blokken lister `rund`/`rund-ind`/`rund-lille`
- komponentspecifikationerne `videre-hover` og `filter-valgt` foreskriver
  `textColor: "#FFFFFF"` **på accent** — det er de 1,66 : 1, L76 forbød
- `vaerdi-ikke` har `rounded: "2px"` hårdkodet
- `## Konflikter` skal markere **2, 5, 7 og "den tredje skrift"** som AFGJORT
  med L-nummeret. **Lad konflikt 1 (knappen) stå åben** — den er spor 2's

**Acceptkriterium:** `node tests/koer.mjs` skal stadig vise **58.5** og **58.6**
grønne. 58.6 kræver, at `## Konflikter` navngiver mindst **fire** kendte
konflikter — så du må ikke slette afsnittet, kun markere punkter som afgjort.

### 6. Ny testfil, der låser de fire regler

`tests/dele/61-extract.mjs` (61 er ledigt; 60 er højeste på main).
Mindst ét ødelagt tilfælde pr. regel. **Vend aldrig et krav ned for at få
grønt** — hvis en assertion i en ældre fil bliver forkert af din ændring, så
**vend den, så den beviser den nye regel.** Skriv i rapporten hvilke du vendte.

---

## Grundmåling — målt af mig 2. sep 2026 kl. 10:40 på `36e1755`

**Din første kommando er at genkøre alle fire.**

```
node tools/validate.mjs      77 fil(er) · 0 fejl · 1 advarsler
node tools/build.mjs         216 sider · 1111 tal med kilde, 0 uden
node tests/koer.mjs          1534 bestaaet, 0 fejlet · Validator: 71 fangede 71
node tools/linktjek.mjs      0 doede interne · 50 producentsider · 0 unaaede
```

**Byg mindst én gang UDEN `--ud=`.** Bygger du kun til en sidemappe, står
`dist/` tom, og 12 tests fejler på hårdkodede `dist/`-stier. Det ligner dit
arbejde og er miljøet.

**Testtallet er et KRAV om retning, ikke et tal at ramme:** 1534 plus dine nye
assertions. Falder det, har du slettet noget. Skriv det faktiske tal.

---

## Filejerskab

**Du ejer:**

```
assets/system.css
assets/generator.css
DESIGN.md
tests/dele/61-extract.mjs      NY fil
tests/dele/58-designmd.mjs     KUN hvis en assertion skal VENDES, ikke slettes
fund/BRIEF-extract.md          denne fil, hvis noget viser sig forkert
fund/FUND-extract.md           din rapport
```

**Du må ikke røre:**

```
tools/skabelon/*.mjs      spor 2's - L77 knapprimitivet aendrer HTML
tools/build.mjs
data/robots/**
tests/dele/59-farvetokens.mjs   laaser farvetokens; dit arbejde roerer ikke
                                paletten, saa den skal blive groen af sig selv.
                                Bliver den roed, har du aendret en farve - stop
```

---

## Skills

Du er et **designspor** og kører derfor Opus (L45). Vurdér og skriv, hvilke du
valgte og gik forbi:

- **`impeccable`** — L70 gør dens flows til metoden for designarbejde.
  `impeccable extract` eller `colorize`/`typeset` er nærliggende. Fladens MODE:
  kataloget er **Operate**, robotsiden og Om os er **Read**.
- **`fejljagt`** — hver gang et tal ikke passer. Måleapparatet før tallet.
- **`ui-ux-critique`** — vurdér den; den er fejljagt på en bygget side.

Lykkes et skill-kald ikke fra worktreen (det svinger, målt 26. aug), så læs
`SKILL.md` fra disk og **skriv i rapporten at du gjorde det**:

```
C:/Users/thyge/.claude/skills/impeccable/SKILL.md
```

Projektets egne skills ligger i `.claude/skills/` og følger med worktreen.

---

## Miljø

```
node        "/c/Program Files/nodejs/node.exe"  — intet er paa PATH i Git Bash
python      /c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe
server      python -m http.server 8144 --directory dist   FRA PROJEKTRODEN
            aldrig 8080, aldrig cd dist. LUK DEN, naar du er faerdig med at
            maale, og skriv i rapporten at du gjorde det
verificér   curl -s http://localhost:8144/system.css | grep -c "<din streng>"
            mod  grep -c "<din streng>" assets/system.css
            Giver de to forskellige tal, maaler du en anden agents byg
skud        node C:/Praktik/websites/maalevaerktoej/flade-skud.mjs <url> <bredde> <ud.png>
            Du KAN se fladen. Brug det - dette er et designspor
commit      skriv beskeden til en fil og brug  git commit -F <fil>
sed -i      fejler TAVST med exit 0 naar moensteret ikke rammer. Brug Edit
filer       UTF-8 uden BOM
git -C      MSYS-stier (/c/Praktik/...) fejler paa Windows. Brug C:/Praktik/...
2>/dev/null brug det ALDRIG paa en kommando, hvis exitkode eller fejltekst
            er en del af maalingen
```

Gitignorerede filer er allerede kopieret ind: `assets/fotos/fabrikant/` (610
filer, målt), `.env`, `db/kanonisk.json`, `db/seed.sql`.

**Commit undervejs er et krav.** Ét commit pr. regel. To spor er døde uden en
linje efterladt.

---

## Rapporten

Højst 60 linjer, i `fund/FUND-extract.md`: valgt/fravalgt pr. punkt · konfidens
pr. punkt (høj kræver genkørbar kommando **plus** én linje om, hvad tallet ville
have været, hvis arbejdet var forkert) · usikkerheder · målingerne som tal.

**Uden for de 60 linjer, obligatorisk:** "Nye fælder og opdagelser" (skriv
"ingen", hvis der ingen er) og "Punkter i briefet, jeg ikke nåede".

**Og fordi dette er et designspor: læg mindst ét skærmbillede ved af kataloget
og ét af en robotside, før og efter.** En CSS-diff beviser ikke, at fladen ser
rigtig ud.

---

## Til sidst: briefets fakta er påstande

Alle tal ovenfor er mine målinger. **Afviger noget, du måler, fra noget,
briefet påstår, så er afvigelsen en del af leverancen — ikke ulydighed.**
Jeg tog i dag fejl to gange, som begge blev fanget af en kontrol: jeg påstod,
at fotoene er høje (56 af 65 er brede), og jeg foreslog `--stans` som
radius-token, hvor navnet var optaget af en farve. Begge fejl stod i et
udkast, der så rigtigt ud.

Rammer et `fil:linje` forbi, så skriv det.
