# Rapport: spor/robot3 (Pris i nøgletalsblokken)

## Skill-vurdering (Regel 0)
- **Valgt:** `spor` (arbejdsmetode), `robotdata` (skemaregler), `impeccable layout` (nøgletalsgitter).
- **Fravalgt:** `fejljagt` (ingen uventede defekter undervejs), `supabase` (ingen databaseret).

## Grundmåling (Regel 1)
- `node tools/validate.mjs`: 77 fil(er) · 0 fejl · 1 advarsler (R9 ghost-robotics-vision-60).
- `noegletal_taeller`: b = 5 på samtlige 77 robotsider.
- Prisfelter i data: 11 numeriske priser (4 USD, 1 EUR, 6 CNY), 66 uoplyst.

## Ændringer
- `tools/skabelon/robot.mjs`: Indlæser `data/kurser.json`, tilføjer `pris` til `STRIBE_FELTER`, `i-pris` til `IKONER`, `prisVaerdi()` med ECB-kursomregning og kildepris.
- `assets/generator.css`: Tilføjer `.stribe--seks` (rent 2x3 gitter uden span 2) samt styling af `.pris-par` og `.stribe-kildepris`.
- `data/i18n/da.json` + `en.json`: Tilføjer `stribe_pris` ("Pris" / "Price").

## Kontrolmåling & Acceptkriterier
- **1. Tælleren:** b er steget fra 5 til 6 på samtlige 77 robotsider i `dist/`.
- **2. 11 mod 66:** Målt i `dist/`: Præcis 11 sider viser oplyst pris, 66 viser "ikke oplyst".
- **3. Kildebogstavet:** På omregnede priser (fx Genisom L2, Neura) sidder kildemærket på kildeprisen (`39.999 CNY A`), mens USD-tallet (`5.952 USD`) ikke har kildemærke. På native USD (Go2) sidder mærket på kildetallet `1.600 USD A`.
- **4. Data urørt:** `git diff --stat data/robots/` giver 0 ændrede filer.
- **5. Skærmbilleder:** Taget ved 1440px på port 8133: `fund/robot3-unitree-go2.png`, `fund/robot3-genisom-l2.png`, `fund/robot3-spot.png`.
- `node tools/validate.mjs`: 77 fil(er) · 0 fejl · 1 advarsler.
- Commits i 3 trin: `4d53a5e` (data), `cca8f63` (skabelon/i18n), `e86d1ef` (CSS).

## Nye fælder og opdagelser
- Briefets påstand om at b var 6 fra start var falsk: måling førte bevis for at b var 5 (CE var tidligere fjernet), så tilføjelsen af pris bragte b op på 6.
- 5 robotter har 0 oplyste nøgletal og renderer `.stribe--intet`; her vises "ingen af de 6 nøgletal".

## Punkter i briefet, jeg ikke nåede
- Ingen. Samtlige acceptkriterier er opfyldt og målt.
