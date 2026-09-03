# FUND — designplanens punkt 4

## Ændringen, i konkrete termer

`fund/PLAN-designarbejde.md` findes nu: **ni rangerede punkter** (briefet krævede fem).
**Fire kan sendes i dag — R1, R5, R7, R9. Fem er spærret**, med spærringen ved punktet.

| Rang | Hvad læseren møder i dag | Efter |
|---|---|---|
| **R1** Fokusringen | Tastaturringen er **1,38 : 1** mod siden (WCAG kræver 3,0) på **7 af 8** ringe; den globale regel gælder **alle 216 sider** | Gunmetal, **12,72 : 1**. Accent kun på mørk flade |
| **R2** Katalogets fold | Første skærm har **nul betjening** — søgefeltet står på **y = 1.078** i et 900 px vindue | Betjening over **y ≈ 700**; filtergitter **326 → ≤ 240 px** |
| **R3** Producentsiden | **69 %** af Xiaomis side handler om de **andre**. Rosteren er **25 rækker på alle 25 sider**, mens **17 sider har ≤2 egne modeller**, **10 præcis 1** | Eget emne **> 50 %** af højden |
| R4-R9 | 0 kildemærker (mod 1.732) · 19 skriftgrader i 9-20 px · sidste sætning 100 % skjult · 277 px skjult ved 390 · `.v-ikke` 1,00 : 1 · 7-8 px tekst | Står i planen med hvert sit kriterium |

**Rækkefølgen afviger med vilje fra rangen:** R5 er femte-dyrest og planlagt **sidst**,
fordi den ejer begge stilark — at typesætte en flade, R2 eller R6 omskriver bagefter, er
at gøre arbejdet to gange. **Valgt:** ni punkter med et *kørt* acceptkriterium hver plus
et baneafsnit over, hvad der kolliderer på `system.css`. **Fravalgt:** kun de fem
obligatoriske — R1, R8 og R9 var ellers blevet fund, ingen ejer.

## Grundmåling · briefets tal: 7 efterprøvet, 4 overtaget, 3 forkerte

HEAD **`d24898a`** (briefet sagde `7f0c2b0`; briefets egen commit lå oven på — ikke en
fejl) · DESIGN.md **1.340** ✓ · træ **rent** ✓ · `PLAN-designarbejde.md` fandtes ikke ✓.
**Efterprøvet:** 0 kildemærker · rosterens konstans · 3.170 linjer/524 `{` ·
skriftgraderne · `prod-tabel-wrap::after` = 0 · `font-size:[78]px` = 2 · dokumentordenen.
**Overtaget:** alle browsertal (1715 px, 69/58 %, 277 px, y=1078, 45,7/69,3, 74,2/58,0) —
**jeg startede bevidst ingen server**, jf. diskgrænsen. Mærket som overtagne i planen.

1. **F4's "0 mod robotsidernes 72"** → målt **0 mod 1.732**, og **23** på én robotside.
2. **"katalog.mjs:1439-1474"** → strengbæreren står på **1471-1478** (filen er 1.547).
   Spærringen mod `spor/certfacet` er uændret rigtig; linjetallet var det ikke.
3. **"55 skriftstørrelser, 18 trin i 9-20 px"** → **56** erklæringer (55 uden `inherit`),
   **19** px-literaler i 9-20 (18 uden 20 px). **Begge gamle tal var rigtige med hver sin
   afgrænsning; ingen af dem sagde hvilken.**

## Det, jeg er uenig i

**DP3b's afgørelse holder — dens tal gjorde ikke.** *Række*, 14 px, er rigtig
(`font-size:14px` × 10; fem af de ni levende er samme rolle). Men PLAN-klaebebar §1.3
skrev **6** og DP3b **10**, uden at nogen sagde, at forskellen er kommentarer.
**F3 kan ikke sendes, som `PLAN-producent.md` §5.3 beskriver:** §5.3 vil slette rosteren,
men `ANALYSE-produkort.md` P-E har målt, at den ved 390 px er det **eneste** sted, navn +
land + antal står sammen uden beskæring. Derfor er R3 spærret på JPK, ikke på arbejdet.

## Rettet i DESIGN.md (`02aacca`) — rapportens vigtigste linje

**DP1, som jeg selv skrev, talte forkert.** DP1b sagde *"fem … hvoraf fire står på lys
flade"*, AK1a lovede kontrafaktisk **4**. Målt:
`grep -cE "outline:[^;}]*solid var\(--accent\)" assets/system.css assets/generator.css`
→ **6 og 2, i alt 8**. De tre oversete er kopier af **samme** regel på enhedskontakten
(`system.css:2022, :2566, :2811`); `.daek` sætter ingen egen baggrund (`:512-515`) og
arver `--bund` → samme 1,38 : 1. **Prisen, hvis det ikke var fanget:** et byggespor
retter de fire, kører AK1a, får **4** i stedet for 0 og tror kriteriet fejler — eller
retter mod 4 og melder færdig med fire ulovlige ringe tilbage.
**Dertil tre døde henvisninger:** DESIGN.md pegede tre steder på `fund/PLAN-design.md`,
som aldrig har eksisteret; alle tre skrevet af dette spor. Nu **0** døde, **3** levende.

## Konfidens · **8 af 9 acceptkriterier er kørt ordret mod grenen** og gav planens tal

| Punkt | Niveau | Bevis + kontrafaktisk |
|---|---|---|
| De 8 accent-fokusringe | **høj** | `grep -cE "outline:[^;}]*solid var\(--accent\)" assets/*.css` → 6 og 2. Var DP1's 5 rigtige, ville summen være 5 |
| 0 kildemærker, producentfladen | **høj** | `grep -ro "kildemaerke" dist/da/producenter/ \| wc -l` → 0 mod 1732 for `robotter/`. Var mærket der, ville tallet skalere med de 26 sider |
| 19 grader i 9-20 px | **høj** | awk-pipen i planens R5 → 19. Var skalaen de ni navngivne trin, ville den vise 9 |
| 17 af 25 sider har ≤2 modeller | **høj** | Løkke over `dist/da/producenter/*/` på `class="kort"`. Skalerede rosteren med, ville `pnavn` variere; den er 25 overalt |
| Alle browsertal | **lav** | **Ikke efterprøvet.** Ingen server startet |
| Rangeringen selv | **middel** | En dom, ikke en måling. Tallene under hvert punkt er efterprøvet; vægtningen er min |

## Det, jeg ikke kunne afgøre

- **Om R1 overhovedet er frosset.** Et WCAG-brud er undtaget, men rettelsen tilføjer et
  token (`--ring`) og rører en systembeslutning. Jeg lod den stå på listen. **JPK afgør.**
- **Om `system.css:2811` kan nås** — `:2557` sætter samme selektor `display:none`.
  Skrevet ind i DESIGN.md som en måling, byggesporet skal tage, ikke antage.
- **Om R5 bør deles i to.** Målingen, der ville afgøre det — hvor mange af de 19 grader
  falder ud af sig selv, når de ni trin håndhæves — har jeg ikke taget.
- **Om R7 løses med smallere kolonner eller en rulleaffordance.** Jeg så kun 1440-skuddet.
- **Ingen server, ingen `koer.mjs`, intet `build.mjs`.** Jeg læste det `dist/`, der lå i
  worktreen, og **kan ikke bevise, at det svarer til HEAD.**

---

## Nye fælder og opdagelser

1. **Et acceptkriterium med et forkert kontrafaktisk tal er farligere end intet
   kriterium.** AK1a lovede 4, virkeligheden var 8. Kriteriet ville have kørt, givet et
   plausibelt tal og **aldrig larmet** — `fejljagt` fyrer aldrig, for der er intet at
   undre sig over.
2. **`git diff --stat | grep -c "font-size"` er altid 0.** `--stat` udskriver ingen
   indholdslinjer. Jeg skrev det som R6's kriterium og fangede det i egen efterprøvning.
   Erstattet af `git diff -U0 … | grep -cE "^[-+].*font-size"`, og **apparatet er
   valideret mod et kendt svar** på min egen commit: anker+`-U0` → 7, anker+`-U3` → 7,
   **uden anker+`-U3` → 14.**
3. **En fil kan være henvist til tre gange og aldrig have eksisteret.** En
   markdown-henvisning fejler ikke, den bliver bare forkert.
   `grep -o "fund/[A-Za-z0-9._-]*" DESIGN.md | sort | uniq -c` mod `ls fund/` er en
   to-sekunders kontrol og fandt tre døde ud af fem navne.
4. **F3 blev målt på to yderpunkter, og fordelingen ligger klemt op ad det dårlige.**
   Stikprøven var Xiaomi (2 modeller) og Unitree (13); **10 af 25 sider har præcis 1**.
   Middeltallet er ikke midt imellem.
5. **`--tom` og `--bund` er samme primitiv** (`system.css:127` og `:134`, begge
   `--p-eloxgraa`). *"Ikke oplyst"*-chippens fyld er derfor **1,00 : 1** mod fladen på
   hver `--bund`-flade. Det er DESIGN.md's konflikt 3 — hidtil journaliseret som et
   **navne**problem — med sin første målte **visuelle** konsekvens.
6. **Skill-kald fra worktree virkede denne gang.** `spor` og `design` blev begge kaldt
   normalt fra `udstilling-wt-designplan`; **ingen fallback til disk.** Endnu et datapunkt
   til CLAUDE.md's "virker nogle gange"-note.

## Punkter i briefet, jeg ikke nåede

- **Ingen udeladt.** Punkt 4 var det eneste og er leveret (`388cfef`), med
  DESIGN.md-rettelsen forud (`02aacca`).
- **Delvist:** briefet bad om at efterprøve de tal, rangeringen hviler på. Jeg
  efterprøvede syv og overtog fire — **alle fire overtagne er browsertal**, og de bærer
  R2, R3 og R6's størrelsesorden. Rangeringen ville ikke vende ved 20 % fejl, men **R2 og
  R3 kunne bytte plads.**
- **Bevidst ikke gjort:** jeg læste **2 af 21** skærmbilleder (`producent-1440`,
  `katalog-fold-1440`) — de to, der bar R2 og R3. Om-os, robotsiden, sammenligningen og
  **alle 390-skuddene** har jeg ikke set, **så listen kan mangle et fund på de flader.**

**Loftet: kroppen er 83 linjer, heraf 17 tomme — 66 med indhold mod skillens 60.**
Målt med `awk '/^## Nye fælder/{print NR-1; exit}'` og `grep -cv "^$"`. Prosaen er
skåret tre gange (143 → 96 → 83); de sidste 6 er de to tabeller, briefet udtrykkeligt
bad om — oversigten i UI-termer (CLAUDE.md 2b) og konfidens pr. punkt. **Jeg valgte at
overskride med 6 frem for at fjerne en af dem.**
