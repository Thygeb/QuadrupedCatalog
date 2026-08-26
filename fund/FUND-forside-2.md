# FUND-forside-2 — spor/forside (26. aug 2026)

Skill-vurdering: ingen af de listede skills passer direkte — dette er et konkret,
allerede specificeret rettelsesbrief (fil:linje, ønsket resultat, acceptkriterier), ikke
åben design- eller IA-planlægning (`impeccable`), ikke en kritikrunde af en færdig side
(`ui-ux-critique`/`critique`), og ikke robotdata (`robotdata`). Fravalgt med begrundelse.

## 1. Løsning valgt / fravalgt

- **Punkt 1:** valgt en producent+vægtklasse-spredningsregel (`udvalgReglen()`,
  tæthed som prioritet); fravalgt at beholde den alfabetiske slice — den var netop det,
  briefet identificerede som et alfabethoved.
- **Punkt 2:** valgt fire ligestillede yderpunkt-kort i ét CSS-grid; fravalgt
  rotation efter ugenummer (JPK's eget fravalg, gengivet i koden) — rotation gør
  bygget uafhængigt af sit input.

## 2. Konfidensniveau pr. punkt

- **Punkt 1 (udvalgsregel): HØJ.** `node -e "..."` på `dist-a/da/index.html` giver 6 kort
  fra 6 producenter, 3 vægtklasser (over_40/20_40/under_20). To (faktisk tre) byg giver
  samme sha256 (`1bb994a5...d7b5f`). Havde reglen stadig været den alfabetiske slice,
  ville producent-tallet være ≤2 (Unitree dominerer alfabetisk) og teksten på siden
  ville mangle.
- **Punkt 2 (fire kort): HØJ.** `grep` på `dist-a/da/index.html`: 0 `yderpunkt--lead`,
  0 `yderpunkt--lille`, 4 `<article class="yderpunkt">`. Var lead/lille ikke fjernet,
  ville disse tal være 1/3/0.
- **Åbningens højde (1440 px): LAV.** Intet lokalt Playwright/playwright-core i dette
  afhængighedsfrie projekt — ikke målt, ikke gættet.

## 3. Usikkerheder

- Briefets egen acceptkommando 1 (`split('h-udvalg')[1]`) rammer den MIDTERSTE del af
  filen, fordi "h-udvalg" står to gange (`aria-labelledby` og `id`) — giver 0, ikke 6,
  uanset løsning. Brugte i stedet `split('katalog-flade')[1]` + eksakt
  `<article class="kort">`-match. Se "Nye fælder" nedenfor.
- Vægtklasse-ombytningsgrenen i `udvalgReglen()` (svageste medlem af en
  overrepræsenteret klasse viger) er aldrig faktisk kørt på det rigtige katalog — top-6
  ramte 3 klasser uden hjælp. Koden er derfor kun afprøvet via konstruktion, ikke i
  praksis på rigtige data.

## 4. Målingerne

- validate (grund): 77/0/1. validate (efter): 77/0/1 — uændret.
- tests (grund): 217 bestået/2 fejlet. tests (efter): 221 bestået/2 fejlet — samme 2
  kendte røde, +4 nye (3a, 3b, 3c, testbyggets exit 0).
- build (grund og efter): 213 sider, 1110 tal med kilde — uændret.
- "Fra kataloget": 6 kort, 6 producenter (MicroRoboTech, GENISOM AI, Galileo (Tianjin),
  Ghost Robotics, Rainbow Robotics, Yufan Intelligent), 3 vægtklasser.
- Tre byg af `dist-a/da/index.html`: sha256
  `1bb994a5e2ae9a5ba4b4c1e38d1b08c677ff5de3dea682866abf40856e0d7b5f` alle tre gange.
- Yderpunkter: `yderpunkt--lead` 0, `yderpunkt--lille` 0, `<article class="yderpunkt">` 4.

## Nye fælder og opdagelser

- **Briefets acceptkommando for punkt 1 er selv defekt** — "h-udvalg" står to gange i
  markup'en (`aria-labelledby` + h2-`id`), så `split('h-udvalg')[1]` giver den tomme
  midte, ikke sektionen. Det gjaldt allerede den gamle skabelon, jeg indførte det ikke.
  Verificeret med en rettet kommando i stedet (`split('katalog-flade')[1]`).
- **`udvalgReglen()`s regel (a) ("højst ét kort pr. producent") brød build.mjs' egen
  hårde invariant** ("Fra kataloget skal vise nøjagtigt min(6, N) kort") på
  `tests/eksempel-robotter` (3 robotter, i praksis samme producentnavn) — den nye test
  3c/build.mjs fangede det straks (byggede kun 1 kort i stedet for 3). Løst med en
  eksplicit nedgraderingsgren i `udvalgReglen()`, der kun rammer, når kataloget har
  færre distinkte producenter end ønskede kort — aldrig det rigtige katalog (25
  distinkte producenter, altid ≥ 6).
- `<picture>`-tallet i byggeloggen faldt fra 342 til 340 efter punkt 1 — ikke en fejl,
  men en konsekvens af at de SEKS udvalgte robotter nu er andre end før (forskellige
  robotter har forskelligt antal billedvarianter).

## Punkter i briefet, jeg ikke nåede

- Playwright-måling af åbningens højde ved 1440 px (DESIGN.md's 1350 px-budget) — intet
  lokalt playwright-modul i dette afhængighedsfrie projekt, og jeg forsøgte ikke en
  netværksinstallation af browser-binaries for én måling. Rapporteret ikke-målt, ikke
  gættet.
