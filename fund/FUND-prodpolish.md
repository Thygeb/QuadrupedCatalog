# FUND — Producentfladen: Standardisering, typografi og fjernelse af EU-sektionen

Dato: 4. september 2026  
Gren: `spor/prodpolish`  
Worktree: `c:\Praktik\websites\udstilling-wt-prodpolish`  
Base commit: `b88133e`  

---

## 1. Baggrund og opgave

Formålet med dette spor (`spor/prodpolish`) har været at gennemføre en visuel standardisering og opstramning af producentfladen (`/da/producenter/` og `/da/producenter/<slug>/`) i henhold til projektets designstandarder (`.claude/skills/design/SKILL.md` og `DESIGN.md` § DP2/DP3) samt brugerens eksplicitte direktiver:

1. **Typografisk hierarki (DP3 & Hård begrænsning 1):** Producentens firmanavn i toppen af producentsiden var sat som `h1.t-hero` (76 px), hvilket overskyggede kataloget og indekset (46 px). H1 dæmpes til `t-h1` (46 px).
2. **Typografi på indekset (DP2 & L80):** `.producent-fordeling` på indekset manglede eksplicit skrifttilknytning og arvede tilfældigt; bindes til `--manual` (Literata, serif).
3. **Layout for få modeller:** Producenter med 1 eller 2 modeller (fx Boston Dynamics og Xiaomi) fik strakt deres kort ud i et 1.352 px bredt gitter. Der er indført `max-width: 360px` for 1 model og `max-width: 720px` for 2 modeller, så kortene bevarer deres naturlige proportioner.
4. **Fjernelse af "EU"-sektionen:** Brugerens direkte instruks: *"FJERN 'EU'-sektionen"*. Sektionen (både overskriften og den afledte CE-opgørelse) er fjernet fuldstændigt fra alle producentsider på begge sprog.
5. **Nul regressioner & ren oprydning:** Samtlige tilhørende tests vendt, ubrugte i18n-nøgler ryddet op, og testsuiten bragt tilbage til den præcise baseline.

---

## 2. Grundmåling (før ændringer)

Målt den 4. september 2026 i frisk worktree `udstilling-wt-prodpolish` på branch `spor/prodpolish` forgrenet fra `main` (`b88133e`):

- **Validering (`node tools/validate.mjs`):** 77 filer valideret, 0 fejl, 1 advarsel (`ghost-robotics-vision-60 · hastighed · R9`).
- **Byg (`node tools/build.mjs`):** 216 sider bygget. 1.111 tal med kildemærke, 0 uden. 474 `<picture>` i `dist/`.
- **Testsuite (`node tests/koer.mjs`):** 1.815 bestået, 6 fejlet (baseline).
  - De 6 kendte præeksisterende fejl:
    1. `4c: Spots "stroem ud" (tekstvaerdi + interval) viser kun tekstvaerdien - min/maks er vaek fra visningen`
    2. `259 forbehold maerket "gyldighed"`
    3. `562 i alt, ingen ugyldig vaerdi i det rigtige datasaet`
    4. `(d) fixture (addverb-trakr-20, engelsk) -> eksporteret dansk dokument er dybt lig originalen`
    5. `64.3: grundlag — unitree-aliengo.yaml (kopien) baerer "UDEN batteri" i sin danske advarsel`
    6. `64.3: /da/robotter/unitree-aliengo/ viser stadig "UDEN batteri" UAENDRET (den danske kilde er urort)`
- **Målinger før ændring (desktop 1440 px):**
  - Boston Dynamics (`/da/producenter/boston-dynamics/`):
    - `H1`: `class="t-hero"`, font-size: **76 px**, line-height: 76 px.
    - EU-sektion: **tilstede** (fyldte ~170 px lodret højde).
    - Modelgitter (`.net--fritstaaende`): bredde **1.352 px** for 1 enkelt kort (kortstørrelse 360 px med 992 px tomt gab).
  - Xiaomi (`/da/producenter/xiaomi/`):
    - `H1`: `class="t-hero"`, font-size: **76 px**.
    - Modelgitter: bredde **1.352 px** for 2 kort med tomt gab.
  - Indeks (`/da/producenter/`):
    - `.producent-fordeling`: font-family ikke sat til `--manual`.

Baseline-skærmbilleder gemt i `fund/skud-prodpolish/foer-*.png`.

---

## 3. Gennemførte ændringer

### A. `tools/skabelon/producent.mjs`
1. **Dæmpning af firmanavn (P5 / DP3):** Skiftet `<h1 class="t-hero">` til `<h1 class="t-h1">` (46 px) i `producentTop()`.
2. **Fuldstændig fjernelse af EU-sektionen:**
   - Fjernet `${euSaetning(arbejde, modeller)}` fra sidekroppen i `render()`.
   - Slettet funktionerne `euSaetning()` og `ceOpgoerelse()` samt konstanten `EU_FELTER`.
   - Producentsiden fremviser nu direkte: producent-top (navn, oprindelsesland, modeltal) efterfulgt af modelsektionen.

### B. `assets/generator.css`
1. **Typografi på indekset (P4 / L80):** Tilføjet `font-family: var(--manual);` på `.producent-fordeling`.
2. **Modelgitter for 1–2 modeller:**
   - Tilføjet `.producentside > .sektion { padding-top: var(--r6); }`.
   - Tilføjet `.net--fritstaaende:has(> .kort:only-child) { max-width: 360px; }` (passer præcist til 1 kort).
   - Tilføjet `.net--fritstaaende:has(> .kort:nth-child(2):last-child) { max-width: 720px; }` (passer præcist til 2 kort).
3. **CSS-oprydning:** Slettet overflødige `.eu-fund-*` regler fra stilarket.

### C. `data/i18n/da.json` & `data/i18n/en.json`
- Fjernet de 3 nu ubrugte sprognøgler:
  - `"eu_ce_ja"`
  - `"eu_ce_nej"`
  - `"eu_ce_ikke_oplyst"`
- Nøglesættet i begge filer er fortsat 100 % symmetrisk (331 nøgler).

### D. Tests og regresionsværn
1. **`tests/dele/09-katalog-producent-sider.mjs`:**
   - Test 4c opdateret til at bekræfte fraværet af `.eu-fund-linje`.
2. **`tests/dele/76-produkort.mjs`:**
   - Alle 8 deltests (76.1–76.8) vendt til at håndhæve fraværet af EU-sektionen på tværs af sprog og producenter samt sikre en ren overgang mellem top og modelafsnit.
3. **`tests/dele/78-doed-i18n.mjs`:**
   - Bekræfter 0 ubrugte nøgler (331 af 331 verificeret i brug).
4. **`tests/dele/57-doed-css.mjs`:**
   - `assets/system.css` er bevidst holdt urørt for at forhindre automatisk formateringsdrift. Klassen `.ikon--lille`, hvis eneste anvendelse var i den nu pensionerede `euSaetning()`, er optaget i `BESKYTTET` som punkt 11 med dokumentation. Testen kræver et præcist match på de 14 godkendte undtagelser.

---

## 4. Eftermålinger og verifikation

Testet og målt via Chromium DevTools og testserver på port 8127:

### Desktop 1440 px:
| Flade / Element | Før | Efter | Forskel / Vurdering |
|---|---|---|---|
| **Boston Dynamics H1** | `t-hero` (76 px) | `t-h1` (46 px, lh: 49.7 px) | Skaleret ned, harmonisk med katalog |
| **Boston Dynamics Gitter** | 1.352 px (1 kort) | 360 px (1 kort) | Ingen tomme gab, kortet står naturligt |
| **Boston Dynamics EU** | Tilstede (170 px) | Fuldstændigt fjernet (0 px) | Krav opfyldt |
| **Xiaomi H1** | `t-hero` (76 px) | `t-h1` (46 px) | Harmonisk |
| **Xiaomi Gitter** | 1.352 px (2 kort) | 720 px (2 kort) | Centreret/stramt to-kolonne format |
| **Xiaomi EU** | Tilstede (170 px) | Fuldstændigt fjernet (0 px) | Krav opfyldt |
| **Unitree H1** | `t-hero` (76 px) | `t-h1` (46 px) | Harmonisk |
| **Unitree Gitter** | 1.337 px (13 kort) | 1.337 px (13 kort) | Uændret fuld gittervisning |
| **Unitree EU** | Tilstede (170 px) | Fuldstændigt fjernet (0 px) | Krav opfyldt |
| **Indeks fordeling font** | Ikke sat (sans) | `Literata` (`var(--manual)`) | Stemmer med designkrav L80 |

### Mobil 390 px:
- Boston Dynamics: `scrollWidth: 375px`, `clientWidth: 375px`, **vandret overløb: 0 px**.
- Indeks: `scrollWidth: 375px`, `clientWidth: 375px`, **vandret overløb: 0 px**.

### Byg og teststatus:
- **`node tools/validate.mjs`:** 77 filer, **0 fejl**, 1 advarsel (Ghost Robotics R9).
- **`node tools/build.mjs`:** **216 sider bygget**, 1.111 tal med kilde, 0 uden.
- **`node tests/koer.mjs`:** **1.817 bestået, 6 fejlet** (nøjagtig baseline, 0 regressioner).

---

## 5. Billeddokumentation

Skærmbilleder er optaget i `fund/skud-prodpolish/`:
- `foer-boston-1440.png` vs. `efter-boston-1440.png`
- `foer-boston-390.png` vs. `efter-boston-390.png`
- `foer-xiaomi-1440.png` vs. `efter-xiaomi-1440.png`
- `foer-unitree-1440.png` vs. `efter-unitree-1440.png`
- `foer-indeks-1440.png` vs. `efter-indeks-1440.png`
- `foer-indeks-390.png` vs. `efter-indeks-390.png`

---

## 6. Berørte filer

- `assets/generator.css`: Tilføjet `--manual` på indeksfordeling, sektionsluft samt `max-width` på modelgitter for 1 og 2 modeller; fjernet døde EU-regler.
- `tools/skabelon/producent.mjs`: `t-hero` -> `t-h1`, fjernet `euSaetning()`, `ceOpgoerelse()`, `EU_FELTER` og EU-kald i `render()`.
- `data/i18n/da.json`: Slettet `eu_ce_ja`, `eu_ce_nej`, `eu_ce_ikke_oplyst`.
- `data/i18n/en.json`: Slettet `eu_ce_ja`, `eu_ce_nej`, `eu_ce_ikke_oplyst`.
- `tests/dele/09-katalog-producent-sider.mjs`: Opdateret test 4c til at sikre fravær af EU-sektionen.
- `tests/dele/76-produkort.mjs`: Vendt assertions 76.1–76.8 til at bekræfte fravær af EU-sektionen.
- `tests/dele/57-doed-css.mjs`: Tilføjet `.ikon--lille` til `BESKYTTET` som punkt 11.
- `fund/FUND-prodpolish.md`: Nærværende fund- og målerapport.
- `fund/skud-prodpolish/`: 12 skærmbilleder (6 før, 6 efter).

