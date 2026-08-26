# FUND-producent.md — spor/producent

Skill: `robotdata` valgt til den midlertidige testpost (punkt 2, ACCEPTKRITERIUM 3) - 30-feltsskema
og korrekt slug/filnavn-match (R14 fangede en fejl her, se fælder). `impeccable` fravalgt: layout var
allerede besluttet i briefet (tre kolonner, tabular-nums, sætningsform), opgaven var implementering
til spec, ikke retningsvalg. `ui-ux-critique` fravalgt: reviews er ikke Sonnets (CLAUDE.md). `parallelt`/
`grillmig`/`supabase*` fravalgt: ingen af dem passer på et enkelt implementeringsspor i egen worktree.

## 1. Valgt / fravalgt
- Punkt 1: rigtig `<table>` i stedet for `.raekker`/`.raekke` — fravalgt at genbruge den delte 2-kolonne-
  komponent, da den ejes af et andet spor og ikke kan bære tre selvstændige, højrestillede celler.
- Punkt 2: sætning "{n} af {m} … er fra {land} …" — fravalgt et demonym-adjektiv ("kinesisk"), da det
  kræver bøjning pr. sprog/land; "fra {land}" genbruger de eksisterende `land_*`-nøgler ubøjet.
- Punkt 3: uafhængig genregning i testen (Set af producentnavne pr. land), ikke et kald til
  producent.mjs's egne funktioner — ellers tester testen kun sig selv.

## 2. Konfidens
- **Punkt 1 (tom flade)**: HØJ. `node tomrum-producentoversigt.mjs http://localhost:8082/da/producenter/ 1440`
  → 3,1 % (44px af 1440px), ned fra 45 % (648px) før ændringen (samme script kørt mod dist-before).
  Var arbejdet forkert (fx tabellen stadig smal), ville scriptet vise en procent tæt på de 45 % "før".
- **Punkt 1 (tre celler)**: HØJ. `grep -o "<td[ >]" dist-p/da/producenter/index.html | wc -l` → 75
  (3×25). Var cellerne ikke adskilt, ville tallet være lavere (fx 50 for to celler, eller 0 uden `<table>`).
- **Punkt 2 (udledte tal)**: HØJ. Egen node-optælling af `data/robots/*.yaml` (uafhængig af build.mjs)
  gav Kina 14/62, total 25/77 — identisk med den byggede sætning. Var tallene hårdkodet, ville de ikke
  ændre sig med testposten (se nedenfor) — det gjorde de (25→26, 77→78).
- **Punkt 3**: HØJ. `node tests/koer.mjs` → 235 bestået/2 fejlet (grundmåling 232/2). Rullet producent.mjs
  tilbage til commit 419e694 og kørt igen: K11+K12 gav alle tre FEJL (232/5) — testene fanger reelt en
  tilbagerulning, ikke kun en tilstedeværelse-kontrol.

## 3. Usikkerheder
- Kolonnebredderne (`nth-child(2)`/`last-child` i ch-enheder) er valgt uden en fastlagt breakpoint-test
  under 1440px — kun 1440px er målt eksplicit i acceptkriteriet.
- `producent_fordeling_saetning`s uafgjortheds-regel (alfabetisk på landenavn) er ikke bedt om i briefet;
  den er min tilføjelse for et deterministisk resultat, hvis to lande en dag har samme producentantal.

## 4. Målinger
validate 77/0/1 (uændret fra grundmåling) · tests 235/2 (+3, samme 2 kendte røde) · build 213 sider,
1110 tal med kilde, 75 billeder (alle uændrede fra grundmåling) · tomrum 1440px: 45 %→3,1 % · celler:
75 `<td>`/25 rækker på både da/ og en/ · sætning: "14 af 25 producenter er fra Kina og står for 62 af de
77 modeller i kataloget." → med testpost: "14 af 26 … 62 af de 78 …" (m og y flyttede sig; n og x stod
korrekt stille, da testposten ikke var kinesisk) · `git status --short data/robots` = 0 linjer efter oprydning.

---

## Nye fælder og opdagelser
- **CLAUDE.md i denne worktree er nyere end den, orkestratoren citerede i briefet.** Kun tre globale
  skills findes reelt (`impeccable`, `ui-ux-critique`, `critique` — sidstnævnte ude af drift); tabellen
  med `new-project`/`dataviz`/`code-review`/`simplify` er forældet. Fulgte den opdaterede fil.
- **R14 fangede en fejl i min egen testpost**: filnavnet `_test-spor-producent-japan.yaml` matchede ikke
  `slug: test-spor-producent-japan` (validate.mjs kræver identisk match). Rettet ved at omdøbe filen.
- **"Begge tal ændrer sig" i acceptkriterium 3 er ikke firetallet i sætningen — det er de to totaler
  (m, y).** Toplandets egne tal (n, x) skal *ikke* ændre sig, når testposten er fra et andet land end
  toplandet — ellers ville beregningen selv være forkert. Værd at vide for næste agent, der læser
  kriteriet bogstaveligt og forventer alle fire tal til at bevæge sig.
- **`git stash push -u` tager gitignorerede build-outputs med**, hvis de findes som untracked mapper
  (`dist-p/`) — brugt bevidst til før/efter-målingen, men værd at vide, at en stash uden `-u` ikke ville
  have ramt dem.

## Punkter i briefet, jeg ikke nåede
(ingen — alle tre punkter, alle fire acceptkriterier og selv-efterprøvningen er gennemført)

## Selv-efterprøvning
9 ting efterprøvet: (1) tomrum før/efter, (2) celletælling da+en, (3) tabular-nums/`.figur`-genbrug,
(4) sætning da+en mod uafhængig node-optælling, (5) testpost validerer (78/0), (6) begge tal i sætningen
ændrer sig korrekt retvist (m/y op, n/x uændret), (7) `git status` tomt efter oprydning, (8) tests fejler
ægte ved tilbagerulning (232/5), (9) ingen forbudte filer rørt (`git diff --stat 419e694..HEAD`, 5 filer,
alle tilladte). 0 fejl fundet ved denne gennemgang.
