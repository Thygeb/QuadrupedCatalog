# FUND-indgang: forsidens afslutning, kortets hover, doed kode, kildeform

Skill: ingen valgt indledningsvis (fil-og-linje-forankret implementering). Efter
orkestratorens rettelse midt i sporet: `impeccable` KALDT via Skill-vaerktoejet (lykkedes)
foer punkt 2/3; `context.mjs` koert, `reference/craft-floor.md` laest fra disk.
`frontend-design` (plugin) ikke installeret - ikke kaldt.

## Valgt / fravalgt

1. **Doed kode:** slettet, ikke arkiveret - 0 kaldesteder efterproevet foer hver sletning.
2. **Afslutning:** genbruger sammenligningssidens "ingen vinder markeret" i stedet for en
   generisk CTA (heading+saetning+knap, centreret) - fravalgt efter impeccable-review.
3. **Hover-signal:** tekst+pil oeverst i billedet, IKKE nederst - fravalgt bunden, fordi
   `.maalplade .titelfelt` og `.billedmaerke` allerede bor der (se fælde nedenfor).
4. **Kildeform:** laest direkte fra `r.felter[n]._kildeform` i sammenligning.mjs, IKKE
   tilfoejet i `feltVisning()` (skema.mjs er spor/s1's fil, roert 0 gange).

## Konfidens

- **Punkt 1 (doed kode): HOEJ.** `grep -rn "...mønstre..." tools/ assets/ data/i18n/ | wc -l`
  → 0. Var arbejdet forkert, ville tallet vaere 5+ (de 4 noegler + 2 CSS-klasser + 2
  kommentarreferencer, alle fundet undervejs).
- **Punkt 2 (afslutning): HOEJ.** `grep -c 'class="sektion afslutning"' dist-i/{da,en}/index.html`
  → 1/1; saetningen viser "77 robotter fra 25 producenter" (matcher `data/robots/`).
  Hoejde 2846→3083 px (maalt med `maal.mjs`). Forkert arbejde ville enten mangle
  sektionen (0) eller vise et haardkodet tal, der ikke matcher `data/robots/`-taellingen.
- **Punkt 3 (hover): HOEJ.** Playwright: korthoejde 547→547 px (foto) og 551→551 px
  (maaleplade) ved hover; opacity 0→1 ved hover OG focus-within (efter .42s). Forkert
  arbejde ville vise en hoejdeaendring (gitteret hopper) eller opacity fastlaast paa 0.
- **Punkt 4 (kildeform): HOEJ.** `grep -c "Producenten skrev" dist-i/da/sammenligning/index.html`
  → 1 (var 0). Spots laengde-celle, levende browser: title = "Producenten skrev: 1100 mm.
  Vi viser tallet i sidens faelles enhed." Forkert arbejde ville give 0 traeffere.
- **Punkt 5 (tests): HOEJ.** `node tests/koer.mjs` → 296 bestaaet/2 fejlet (var 275/2).
  `git diff --stat tests/koer.mjs` → 70 insertions, 0 deletions (efterproevet - ingen
  eksisterende test roert).

## Usikkerheder

- DESIGN.md's oevrige, foreksisterende drift (fx en levende reference til "billednoten"
  andre steder i filen) er IKKE rettet - kun de tre punkter, dette spor selv skabte
  (`.kort-invit`, `.afslutning`, Formaalsfilteret markeret historisk) er opdateret, i en
  separat commit efter de fem nummererede punkter. Et fuldt `document`-kald ville rette
  resten, men laa uden for briefets fem punkter.
- `dist-i/` og `.tmp-commit/` staar tilbage untracked i worktreen (`rm -rf` blev naegtet
  af sandboxen). Harmloest - begge er byggeoutput/scratch, ingen af dem er committet -
  men ryddes ikke selv af mig.
- Impeccable-detektoren kunne ikke koere URL-scanning (puppeteer mangler); koert som
  statisk filscanning i stedet. 85 fund, 84 advisory (foreksisterende font-size/radius,
  spredt over hele generator.css, ikke i mine linjer) + 1 warning (`.advarsel`s
  `border-left`, linje 191, foreksisterende, uden for dette spors scope). 0 fund paa mine
  egne nye linjer i side.mjs, forside.mjs eller de nye CSS-regler.

## Maalingerne

validate 77/0/1 · tests 296/2 (var 275/2, +21) · build 213 sider/1110 tal med kilde
(uaendret gennem alle 5 punkter) · da/en i18n-noegler: 265/265 (0 afvig) · AK1-grep: 0 ·
forsidehoejde 2846→3083 px · kort: 547→547 px (foto), 551→551 px (maaleplade) ·
kildeform-traeffere paa sammenligning: 0→1

---

## Nye fælder og opdagelser

1. **Hover-signalets foerste placering (bund af billedet) kolliderede med to
   eksisterende overlays.** `.maalplade .titelfelt` (LAENGDE × HOEJDE, altid synlig) og
   `.billedmaerke` (delt-foto-maerket) sidder begge `bottom:` inde i billedomraadet. Et
   hover-signal dernede ville daekke begge ved hover - fanget FOER commit ved at laese
   CSS'en for eksisterende bund-forankrede elementer, rettet ved at flytte signalet til
   toppen (`top:0`) i stedet. Efterproevet med Playwright: 0 overlap paa et maaleplade-kort.
2. **`_kildeform` naar aldrig klienten via `feltVisning()`.** Funktionen bygger sit
   udtryk af navngivne noegler (samme grund som `_kildeform` aldrig staar i
   `POST_NOEGLER`) og dropper derfor stille alt, den ikke selv navngiver. Loesningen
   laeser `_kildeform` direkte fra raadataen ved siden af `feltVisning()`-kaldet, ikke
   ved at aendre selve funktionen (som ligger i skema.mjs - spor/s1's fil).
3. **Sammenligningssidens tabel er 100 % klientside-genereret.** `grep`-baserede
   acceptkriterier paa den byggede HTML fungerer alligevel, fordi den raa i18n-skabelon
   ("Producenten skrev: {figur}...") ligger i siden inline JSON-blok - men det betyder
   AK5's grep IKKE i sig selv beviser, at en title rent faktisk vises paa en celle. Det
   krævede en separat, levende Playwright-koersel (se Spot-stikproeven) for reelt bevis.
4. **`.impeccable/design.json` og DESIGN.md er allerede en tak bagud** foer dette spor
   overhovedet begyndte: DESIGN.md beskriver formaalsfilteret og "billednoten" som om de
   stadig findes. Ikke rettet af mig for andet end de tre punkter, dette spor selv
   aendrede (se Usikkerheder) - resten af drivet staar tilbage.

## Punkter i briefet, jeg ikke nåede

Ingen. Alle fem punkter (0-5) er udfoert, efterproevet og committet
(`0ed7e65`..`cf70cf8`, 5 commits, én pr. punkt, plus `f4345ae` for DESIGN.md-driften
naevnt under Usikkerheder).
