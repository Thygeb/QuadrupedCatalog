# FUND-prisnote.md — spor/prisnote: ECB-prisnoten flyttet fra katalogsiden til robotsiden

**Skill:** `spor` kaldt som første handling og lykkedes fra worktreen (Skill-værktøjet
returnerede indholdet direkte — intet disk-fallback nødvendigt, men bemærk det alligevel
her, jf. reglen om at skrive det). Øvrige vurderet og fravalgt: `robotdata` (rører ikke
`data/robots/`), `fejljagt` (ingen uventet fejl — to reelle testkonflikter blev fundet og
meldt, ikke gættet på), enhver designskill (dette er en tekst-/mekanikflytning, ingen ny
flade, ingen MODE at navngive).

## Ændringen, i UI-termer (før målingen)

| Hvor | Før | Efter |
|---|---|---|
| Katalogsiden, Pris-facettens skala | ECB-note under skalaen (URL + dato) | **Ingen note.** Skalaen står alene |
| Katalogsiden, sorteringens noteliste ved «Pris» | ECB-note (URL + dato + antal) | **Ingen note** |
| Robotsiden, det fulde skema, prisrækkens kildekolonne | Ingen note | **Ny note** (samme form som CE-feltets `feltnote--eu`): ECB-forklaring + kildelink, på **11 af 77** robotsider — alle med oplyst pris, ikke kun de 7 der faktisk omregnes |
| `assets/generator.css` | `.sorter__note`-regel (2 steder) | Fjernet — reglen var kun for katalogsidens nu-forsvundne prissorteringsnote. **0 HTML-forskel målt** (diff -rq) |

## Valg: 11 eller 7 robotsider

Fulgte JPKs råd: **11** (alle prisbærende), ikke kun de 7 med fremmed kildevaluta. Målt:
`grep -l "stribe-kildepris" dist/da/robotter/*/index.html | wc -l` → **7**; egen måling af
alle prisbærende (ikke-hul `<li>` for i-pris, inkl. 5 robotter med `stribe--intet` hvor
intet nøgletal er oplyst) → **11**. Robotter i USD uden faktisk omregning (pudu-d5,
pudu-d5-w, unitree-go1, unitree-go2) bærer noten alligevel — de er underlagt samme
basisvaluta-beslutning.

## Konfidens og målinger

- **Høj**: `node tests/koer.mjs` → **1729 bestået, 0 fejlet** (genkørbar). Kontrafaktisk:
  et forkert punkt 2 ville have vist `«undefined»` i `dist/da/index.html` (soft-lookup i
  `side.mjs`s `t()`) — målt `grep -c "«" dist/da/index.html` → 0.
- **Høj**: `grep -l "referencekurs" dist/da/robotter/*/index.html | wc -l` → **11**;
  kontrol mod de 66 prisløse (61 tom `<li>` + 5 `stribe--intet`) → **0** lækage.
- **Høj**: `node tools/validate.mjs` → 77/0/1 uændret gennem hele sporet.
  `node tools/build.mjs` → 216 sider, 1111 kildemærker, uændret.
- **Middel**: `diff -rq` før/efter CSS-fjernelsen viste 0 HTML-forskel, men kun for ÉN
  build (ikke bevist idempotent over flere kørsler).

## Grundmåling — afveg fra briefet, rapporteret undervejs

Første `validate.mjs` gav **76 fejl**, ikke briefets 0: worktreen manglede de
gitignorerede `assets/fotos/fabrikant/` (610 filer) og `.env`. Kopieret fra
hovedrepoet (læse-only kilde, intet rørt der), hvorefter grundmålingen matchede
briefets 77/0/1 og 216 sider præcist.

**Testsuite-grundmålingen ÆNDREDE SIG midt i sporet**, fordi spor/testvend blev flettet
til main mens jeg arbejdede: 1691/8 (briefets tal, bekræftet før merge) →
**1712/0 på main** efter merge → 1710/5 lige efter min egen merge (mine egne
punkt 1-2-ændringer gjorde 45.8/45.10 da+en og 57.1 røde) → **1729/0** efter punkt 5+6
(vending af 45.8/45.10, fjernelse af død `.sorter__note`-CSS) og punkt 4 (14 nye
assertions i test 75).

`koer.mjs` krævede IKKE registrering af test 75: bekræftet ved læsning af
`tests/koer.mjs:59-62` (selvopdagende regex `^\d\d-.*\.mjs$`), `koer.mjs` er urørt.

## Nye fælder og opdagelser

1. **To eksisterende, låste tests kodede en tidligere JPK-beslutning, som dagens brief
   direkte ophæver** — ikke faktafejl, men reelle modstridende beslutninger:
   `tests/dele/62-uifix.mjs` 62.2.c (2. sep: "noterne bliver, kun mærket forsvinder")
   og `tests/dele/45-skala-og-kurs.mjs` 45.8/45.10 (kildepligt kun på katalogsiden).
   Begge stoppet og meldt til orkestratoren FØR ændring, begge fik udvidet
   filejerskab og en afgørelse tilbage, begge VENDT (ikke slettet) med ny
   begrundelse i kommentaren, jf. CLAUDE.md "ret assertions, slet dem ikke".
2. **`tf(undefined, …)` er ikke en fejl i `side.mjs`s bløde `t()`-opslag — det er en
   synlig `«undefined»`-tekst på siden plus en stille build-advarsel.** Fjernes en
   `noteNoegle` fra et facet-spec uden at vagte forbrugeren, lækker det til produktion.
   Rettet med `spec.noteNoegle ? tf(...) : ''` i `skalaFacet()`.
3. **En tom note-streng er ikke det samme som et fraværende `<p>`-element.**
   `noteHtml ?? esc(f.note)` viste stadig en TOM `<p class="skala__note">`, så
   `grep -c "skala__note"` ikke faldt. `skalaBlok()` udelader nu hele paragraffen ved
   tomt indhold — en generalisering, der ikke ændrer nyttelasts (aldrig tomme) adfærd.
4. **Fjernelse af prisens `note`-felt gjorde `.sorter__note` (CSS) reelt død**, fordi
   det var den ENESTE bruger af `SORTERINGER`s `note`-mekanisme. Fanget af test 57.1,
   ikke af mig — ejerskabet blev udvidet af orkestratoren efter meldingen.

## Punkter i briefet, jeg ikke nåede

Ingen. Alle fire punkter gennemført, plus to opfølgende rettelser fra orkestratoren
(vending af 45.8/45.10, fjernelse af `.sorter__note`) efter to selv-opdagede
testkonflikter.
