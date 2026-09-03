# Rapport: R9 — Skriftgulvet i fotofeltet (spor/skriftgulv)

Dato: 3. september 2026
Branch: spor/skriftgulv
Spor-ansvarlig: spor/skriftgulv

## 1. Udført arbejde (DP3c / Skriftgulv 10,5 px)
1. **Fjernelse af 8px og 7px under skriftgulvet (`assets/generator.css`):**
   - `.saml-fotofelt__ord` (linje 452) opdateret fra `font-size: 8px` til tilgængelig skærmlæsertekst:
     ```css
     .saml-fotofelt__ord{position:absolute!important;width:1px;height:1px;overflow:hidden;
       clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap}
     ```
   - Linje 748 under mobil `@media (max-width:...)` (`.saml-fotofelt__ord{font-size:7px}`) fjernet.
2. **Visuelt resultat:**
   - I fotofeltet for robotter uden billede (fx Xiaomi CyberDog) vises nu designsystemets rolige, stiplede uoplyst-firkant (`background: transparent; border: 1px dashed var(--hegn)`), identisk med tegnforklaringen og øvrige uoplyst-felter.
   - Skærmlæsertekst bevares intakt ("Ingen brugbar optagelse" / "No usable photograph").
   - Ingen afskæring eller overflow på hverken desktop (74x56) eller mobil (52x40).

## 2. Efterprøvning af acceptkriterier
- **Acceptkriterium DP3c:** `grep -c "font-size:[78]px" assets/generator.css` viser **0** (før: 2).
- **Fil-afgrænsning:** Kun `assets/generator.css` er ændret (`.saml-fotofelt*` alene). `system.css`, `sammenligning.js` og skabeloner er 100 % urørte.
- **Visuel verifikation i Chrome DevTools:**
  - Desktop (1440px): CyberDogs fotofelt er en ren, stiplet boks på 74x56 px.
  - Mobil (390px): CyberDogs fotofelt tilpasser sig 52x40 px uden tekstafskæring.

## 3. Testresultater
- `node tools/validate.mjs`: 77 filer, 0 fejl, 1 advarsel (godkendt Ghost Robotics R9).
- `node tools/build.mjs`: 216 sider bygget uden fejl.
- `node tests/koer.mjs`: **1.744 bestået, 0 fejlet** (100 % grøn).
