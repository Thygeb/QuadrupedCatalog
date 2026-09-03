# Rapport: R1 — Fokusringen (spor/fokusring)

Dato: 3. september 2026
Branch: spor/fokusring
Spor-ansvarlig: spor/fokusring

## 1. Udført arbejde (DP1b / WCAG 1.4.11)
1. **Semantisk alias `--ring` indført i `:root` (`assets/system.css`):**
   - `--ring: var(--blaek)` (standard for lyse flader, 12,72 : 1 på `--bund` mod WCAG 1.4.11 kravet på ≥ 3,0).
   - `:focus-visible` global regel opdateret til `outline: 3px solid var(--ring); outline-offset: 3px; border-radius: var(--hjoerne)`.
2. **Mørke flader tildelt `--ring: var(--accent)`:**
   - `.sidefod, .klaebebar { --ring: var(--accent) }` i `assets/system.css`.
   - `.strimmel { --ring: var(--accent) }` i `assets/generator.css`.
   - Resultat på mørke flader: 9,19 : 1 mod `--fod` (fuldt lovlig jf. DP1b).
3. **Alle 8 accent-outlines konverteret til `var(--ring)`:**
   - `assets/system.css`: global `:focus-visible` (344), `.typeskilt .enhedsskift` (2024), `summary.facet__navn` (2370), `.klaebebar__gaa/.klaebebar__ryd` (2485), `.daek__enhed .enhedsskift` (2568), `.sammenligning-app .enhedsskift` (2813).
   - `assets/generator.css`: `.stribe-under-fold > summary` (966), `.skema > summary` (1060).
4. **AK1d opfyldt:**
   - `.sog input:focus-visible` opdateret fra `border-color: var(--accent)` til `border-color: var(--ring)`.
5. **Dokumentation i `DESIGN.md` opdateret:**
   - Tilføjet `ring: "var(--p-gunmetal)"` i frontmatter under `colors:` jf. test 58.3.

## 2. Efterprøvning af acceptkriterier (AK1a–AK1d)
- **AK1a:** `grep -cE "outline:[^;}]*solid var\(--accent\)" assets/system.css assets/generator.css` viser **0** for begge filer.
  *(Snæver kontrol `grep -n "solid var(--accent)"` viser præcis 2, som er de to godkendte `border-bottom` på tælleren i `generator.css:1253, 1351`).*
- **AK1b:** `grep -c -- "--ring" assets/system.css` viser **9** (krav: ≥ 2).
- **AK1c (browsermåling i Chrome DevTools):**
  - Fokuseret link i `.daek__nav`: `outlineColor = rgb(34, 38, 42)` (`--blaek`), kontrast mod `--bund` er **12,72 : 1**.
  - Fokuseret link i `.sidefod`: `outlineColor = rgb(242, 196, 0)` (`--accent`), kontrast mod `--fod` er **9,19 : 1**.
- **AK1d:** `.sog input:focus-visible` bruger `var(--ring)`.
- **Måling §62:** Målt i browseren på `/da/sammenligning/`: `.sammenligning-app .enhedsskift` har `display: none` (`system.css:2557`) og kan derfor p.t. ikke nås visuelt via Tab. Reglen på linje 2813 er alligevel opdateret til `var(--ring)` for systemkonsistens.

## 3. Testresultater
- `node tools/validate.mjs`: 77 filer, 0 fejl, 1 advarsel (godkendt R9 tolerance på Ghost Robotics).
- `node tools/build.mjs`: 216 sider bygget uden fejl.
- `node tests/koer.mjs`: **1.744 bestået, 0 fejlet** (100 % grøn).
