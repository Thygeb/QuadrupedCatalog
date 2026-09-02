# BRIEF — spor/uifix: seks UI-ændringer fra JPK

**Skrevet 2. sep 2026. Gren `spor/uifix`, worktree
`C:\Praktik\websites\udstilling-wt-uifix`, forgrenet fra `b5bb73d`.**

JPK gav syv ændringer og blev interviewet om de tvetydige. **Punkt 4
(sammenligningsbaren) er IKKE dit** — den kræver CSS, og `spor/extract` ejer
stilarkene lige nu. De seks andre rører **ikke én linje CSS**.

**Du rører ikke `assets/*.css`, ikke `DESIGN.md`, ikke `db/`, ikke
`data/robots/`.** Tre andre spor ejer dem.

---

## De seks punkter

Hvert punkt har et acceptkriterium, **kørt mod `main` i dag**. Tallet efter
"i dag" er målt, ikke gættet.

### 1. Enhedskontaktens etiket skal følge tilstanden

Kontakten **skifter allerede** — det er efterprøvet: en robotside udsender 10
`enhedsvis--metrisk` og 10 `enhedsvis--imperial`, og
`system.css:1667-1669` skjuler den ene. **Fejlen er etiketten:** den siger
`"Imperiale enheder"` både tændt og slukket, altså hvad den skifter TIL, ikke
hvad der vises.

JPK's ord: *"Denne skal skifte skriften mellem imperial og metrics"* —
præciseret i interview til **etiketten**.

Efter: etiketten siger **hvad der vises**. Metrisk tilstand → `"Imperiale
enheder"` (det du kan skifte til, som i dag). Imperial tilstand → `"Metriske
enheder"`.

**Løs det UDEN ny CSS.** Klasserne `enhedsvis--metrisk` og
`enhedsvis--imperial` findes allerede og gør præcis dette — pak de to
etiketter i dem. Kræver du en ny CSS-regel, så **stop og skriv hvorfor**;
så er punktet mit at flytte til et andet spor.

Ny i18n-nøgle. Den nuværende hedder `enhed_skift_etiket` (`da.json:173`,
`en.json:173`).

```
kommando                                                      i dag   skal give
grep -o 'Imperiale enheder' dist/da/robotter/unitree-go2/index.html | wc -l   3   3
grep -o 'Metriske enheder'  dist/da/robotter/unitree-go2/index.html | wc -l   0   3
```

Begge etiketter skal stå i HTML'en; CSS'en viser én ad gangen. **Tallet 3 er
ikke et krav, det er en forudsigelse** — kontakten tegnes tre steder på den
side. Mål det faktiske og skriv det.

### 2. Begge "omregnet"-mærker væk

Der er **to** forskellige mærker, og JPK har bekræftet i interview, at
**begge** skal væk:

```
class="omregnet"        maalenes maerke      12 paa yufan-lingmao-cyvet
class="pris-om__ord"    prisens maerke        7 paa katalogsiden
```

```
grep -o 'class="omregnet"'     dist/da/robotter/yufan-lingmao-cyvet/index.html | wc -l   12   0
grep -o 'class="pris-om__ord"' dist/da/index.html | wc -l                                 7   0
```

**Rør IKKE de forklarende noter.** `sortering_pris_note` (`da.json:373`) og
`filter_pris_note` (`da.json:437`) indeholder også ordet *"omregnet"*, men de
er kildeangivelser om ECB's referencekurs, ikke mærker. De bliver.
Et `grep -c omregnet` på hele filen er derfor **et forkert måleapparat** —
brug klasserne.

**HVORFOR det er værd at vide, selv om beslutningen er truffet:** 30 af 1.251
talfelter bærer producentens **egen** imperiale værdi (`vaerdi_imperial`).
Mærket var det, der skilte dem fra vores omregning. JPK har valgt med det tal
på bordet.

### 3. Chip-rækken viser aktive filtre, og ingen er aktive som standard

JPK's ord, ordret: *"Baren på katalogsiden skal KUN vise de aktive filtre. som
standard skal INGEN være aktive."* Og i interviewet: *"lige nu er 'I produktion
68, Annonceret'-aktive. men de vises ikke som chips?"*

**Han har ret, og det er to fejl i én.** `tools/skabelon/katalog.mjs:473` sætter

```js
standard: new Set(['i_produktion', 'annonceret']),
```

og kommentaren på `:891` siger selv, at *"en værdi der er skjult SOM STANDARD
får aldrig en chip"*. Altså: to filtre er aktive, og ingen af dem er synlige
som chip. **En aktiv, usynlig filtrering er værre end en synlig.**

Efter: standarden er **tom**. Ingen chip ved indlæsning, fordi intet er valgt,
og kataloget viser **alle 77** i stedet for 74 — de tre udgåede kommer med.

```
grep -o ' checked' dist/da/index.html | wc -l                 3   0
grep -o 'standard: udgåede skjult' dist/da/index.html | wc -l 1   0
```

`filter_status_mrk` (`da.json:350`) bliver forkert, når standarden er tom.
Fjern nøglen, eller giv den et indhold, der passer — skriv hvad du valgte.

**Efterprøv, at chippen virker den anden vej:** sæt et filter i browseren og
mål, at der KOMMER en chip. En tom chip-række, fordi chips er gået i stykker,
ser præcis ud som en tom chip-række, fordi intet er valgt. **Det er punktets
eneste rigtige fælde.**

### 4. (springes over — sammenligningsbaren, kræver CSS)

### 5. Katalogsiden viser kun USD

```
grep -o 'CNY' dist/da/index.html | wc -l     33   0
grep -o 'USD' dist/da/index.html | wc -l     74   >0, skriv det faktiske
```

Originalvalutaen forsvinder fra kortene. **Kildemærket bliver** — prisen har
stadig en kilde, og hård begrænsning 2 gælder uændret.

### 6. Robotsiden viser begge valutaer — uændret

Dette punkt er en **ikke-ændring**, og dets kriterium er derfor et
regressionsværn:

```
grep -rl 'CNY' dist/da/robotter --include=index.html | wc -l   8   8
grep -rl 'USD' dist/da/robotter --include=index.html | wc -l   6   6
```

Ændrer de to tal sig, har punkt 5 ramt bredere end katalogsiden.

### 7. Hele sidefoden væk

JPK, i interview, med tabet forelagt: **hele `<footer class="fod">`**, ikke kun
forhandlerlinjen.

```
grep -rlo '<footer class="fod">' dist --include=*.html | wc -l   214   0
```

Foden rummer tre `<p>` (`tools/skabelon/side.mjs:2085-2087`): forhandlerlinjen,
tæthedsforklaringen og `"Udgivet af KeyResearch · In English"`.

**Sprogskifteren går IKKE tabt** — topbaren har den allerede
(`class="daek__sprog"` → `DA / EN`), og fodens er en dublet. Det er efterprøvet.

**Det, der går tabt, er tæthedsforklaringen.** Den findes kun der. JPK har
valgt med det på bordet; noter det i rapporten, ret det ikke.

`om-os.mjs:300` har sin **egen** forhandlerlinje uden for foden. **Den bliver.**

---

## Grundmåling — målt af mig 2. sep 2026 kl. 11:38 på `b5bb73d`

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

**Sidetallet skal blive 216.** Falder det, har du fjernet en side, ikke en fod.

---

## Filejerskab

**Du ejer:**

```
tools/skabelon/side.mjs · robot.mjs · katalog.mjs · om-os.mjs · sammenligning.mjs
data/i18n/da.json · data/i18n/en.json
tests/dele/62-uifix.mjs      NY fil — 62 er ledigt (61 er spor/extracts)
fund/BRIEF-uifix.md          denne fil, hvis noget viser sig forkert
fund/FUND-uifix.md           din rapport
```

**Du må ikke røre:**

```
assets/system.css · assets/generator.css · DESIGN.md   spor/extract ejer dem
db/**                                                  spor/skema ejer den
data/robots/**                                         genereres fra databasen (L81)
tools/build.mjs · tools/validate.mjs · tools/skema.mjs
```

**Rammer du en opgave, der kræver en af de forbudte filer, så STOP på det
punkt, lav de øvrige færdige, og skriv det i "Punkter jeg ikke nåede".**
Det er ikke en fejl; det er den rigtige opførsel.

---

## Skills

Vurdér og skriv, hvilke du valgte og gik forbi:

- **`fejljagt`** — hver gang et tal ikke passer. Punkt 3's fælde (en tom
  chip-række med to årsager) er præcis dens område.
- **`ui-ux-critique`** — vurdér den. Du ændrer seks flader; en gennemgang
  bagefter er billig.
- **`robotdata`** — sandsynligt fravalg, du rører ikke robotdata. Skriv det.

Lykkes et skill-kald ikke fra worktreen (det svinger, målt 26. aug), så læs
`SKILL.md` fra disk og **skriv i rapporten at du gjorde det**. Projektets egne
skills ligger i `.claude/skills/` og følger med worktreen.

---

## Miljø

```
node        "/c/Program Files/nodejs/node.exe"  — intet er paa PATH i Git Bash
python      /c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe
server      python -m http.server 8145 --directory dist   FRA PROJEKTRODEN
            aldrig 8080, aldrig cd dist. LUK DEN, naar du er faerdig med at
            maale, og skriv i rapporten at du gjorde det
verificér   curl -s http://localhost:8145/... mod din egen disk, foer ét tal
            bruges — tre spor koerer samtidig
skud        node C:/Praktik/websites/maalevaerktoej/flade-skud.mjs <url> <bredde> <ud.png>
            Punkt 3 SKAL ses i browseren, ikke kun grepes
commit      skriv beskeden til en fil og brug  git commit -F <fil>
sed -i      fejler TAVST med exit 0 naar moensteret ikke rammer. Brug Edit
filer       UTF-8 uden BOM
git -C      MSYS-stier (/c/Praktik/...) fejler paa Windows. Brug C:/Praktik/...
2>/dev/null brug det ALDRIG paa en kommando, hvis exitkode eller fejltekst
            er en del af maalingen
```

Gitignorerede filer er kopieret ind: `assets/fotos/fabrikant/` (610 filer,
målt), `.env`, `db/kanonisk.json`, `db/seed.sql`.

**Commit undervejs er et krav.** Ét commit pr. punkt.

---

## Rapporten

Højst 60 linjer, i `fund/FUND-uifix.md`: valgt/fravalgt pr. punkt · konfidens
pr. punkt (høj kræver genkørbar kommando **plus** én linje om, hvad tallet ville
have været, hvis arbejdet var forkert) · usikkerheder · målingerne som tal.

**Uden for de 60 linjer, obligatorisk:** "Nye fælder og opdagelser" (skriv
"ingen", hvis der ingen er) og "Punkter i briefet, jeg ikke nåede".

---

## Til sidst: briefets fakta er påstande

Alle tal ovenfor er mine målinger fra i dag. **Afviger noget, du måler, fra
noget, briefet påstår, så er afvigelsen en del af leverancen — ikke
ulydighed.**

Jeg tog fejl to gange i dag, begge fanget af en kontrol, begge i et udkast der
så rigtigt ud: jeg advarede JPK om, at punkt 7 koster sprogskifteren (den
findes allerede i topbaren), og jeg antog, at et `grep -c omregnet` ville måle
mærkerne (det tæller også to kildeangivelser, der skal blive).

Rammer et `fil:linje` forbi, så skriv det.
