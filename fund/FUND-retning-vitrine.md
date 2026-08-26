# FUND: retning Vitrine

Skills: `impeccable` (`new-work`) valgt og kaldt via Skill-værktøjet (virkede,
ingen fallback). `ui-ux-critique`/`critique` fravalgt — dette er byg, ikke
fejljagt. `robotdata`/`parallelt`/`grillmig` fravalgt — ingen ny robotpost,
intet nyt spor at sætte i gang, ingen beslutning at grille. Undervejs bad
orkestratoren mig desuden læse **frontend-design** fra disk (ikke
installeret som plugin): gjort, `.../plugins/frontend-design/skills/
frontend-design/SKILL.md`, 55 linjer.

**Designplan (to-trins, per frontend-design):** Farve/type uændret fra
DESIGN.md (bevidst — projektet har allerede besluttet dem). Layout: rammefri
fotoplader til de fire yderpunkter (ingen kortkant, ingen skygge — kun
foto+tal+navn), seks katalogkort hvor tallene ligger i en mørk gardin
(`--fod`/`--paafod`, allerede målt 14,88:1/9,88:1) der glider op over
FOTOET ved hover/fokus, ikke under det. Kritik mod kalibreringslisten
(creme+serif+terracotta / næsten-sort+neon / avis-hårstreger+nul-radius):
rammer ingen af de tre — bund er lys, mørk optræder kun i gardinen+fod,
og "færre streger, mere luft" trækker aktivt væk fra avis-tætheden. Eneste
selv-rettelse: yderpunkternes tal-clamp var først selvopfundet
(26–32px) — rettet til DESIGN.md's egen dokumenterede clamp(24,2.1vw,29)
for netop denne komponent, fundet ved kritikken "ville jeg gøre præcis
det her for enhver anden side?".

**Signaturelement:** Kortet er ét ubrudt fotografi i hvile — INSTRUMENT og
REGISTER kan vise tal ved siden af billedet; Vitrine kan kun vise dem ved at
erstatte fotoets nederste tredjedel med dem.

1. **Valgt:** rammefri "fotoplade" til yderpunkterne + mørk gardin-reveal på
   katalogkort. **Fravalgt:** boksede statistik-fliser til yderpunkterne
   (ville gentage "hero-metric"-skabelonen, forbudt af craft-floor).
2. **Konfidens:**
   - Billeder indlæst 10/10, vandret overløb 0 ved 1440 og 390 px — **HØJ**
     (`node maal.mjs http://localhost:8087/index.html 1440|390`, genkørt
     efter sidste rettelse; forkert ville have givet <10 og/eller >0).
   - `:focus-within` = `:hover`: **HØJ** (Playwright-skærmbillede af
     tastatur-fokuseret vs. museklikket Spot-kort, bit-for-bit samme
     opløste tilstand — se `hover-spot.png`/`focus-spot.png` i sessionen).
   - Ingen indlejrede `<a>`: **HØJ** (talte samtidig `<a>`-dybde i det
     byggede HTML, maks. 1; en fejl ville give ≥2).
   - 7 tal efterprøvet mod `robots.json` (galileo-s1-w 85 kg, lynx-s10
     8 m/s, neura 360 min, spot 1,6 m/s, go2 dockingstation=nej, anymal-x
     egenvægt=ikke_oplyst, Kina-observation 14/25/62/77): **HØJ**, alle 7
     stemte 1:1.
   - Billedbeskæring uden benamputation: **MIDDEL** — designtidsregel (25 %
     tolerance på kort-forholdet 1,3, samme metode systemet selv bruger på
     16:10) plus visuel stikprøve af de 3 bredeste billeder, IKKE en
     automatisk pixel-måling af alle 10.
   - Mekanisk detektor: 22 fund, alle "advisory" — degraderet
     regex-tilstand (mangler htmlparser2 m.fl.), ingen "must-fix". Hver
     eneste er enten et bogstaveligt genbrug af `system.css` (fx `.spring`
     14px, scrollbar 99px) eller en DESIGN.md-dokumenteret værdi
     (`#CFD4DB`-hover, yderpunkt-clampen) — **MIDDEL**, ikke efterprøvet af
     en anden læser.

**Målingerne:** billeder 10/10 begge bredder · vandret overløb 0/0 ·
detektor 22/22 advisory, 0 must-fix · 7/7 tal stemmer mod `robots.json`.

## Nye fælder og opdagelser

Kortets gardin-reveal (`.v-kort-scrim`) lækkede ned i navne-feltet, fordi
kun den YDRE kortramme havde `overflow:hidden` — den INDRE billedbeholder
manglede det, så en `translateY(100%)`-skjult gardin blev klippet af den
ydre ramme i stedet for at forsvinde helt, og resten stod og overlappede
navn/producent PERMANENT (ikke kun ved hover). Rettet med `overflow:hidden`
på `.v-kort-lag`. Fundet ved screenshot, ikke ved kodelæsning — koden så
rigtig ud. Desuden: robots.json bærer IKKE `billede`-feltet (kun i
YAML'en), og ingen af de 77 robotter har en reel 0-værdi i noget talfelt —
"nul"-tilstanden findes derfor kun som CSS-regel (samme kode som ethvert
andet tal, ingen falsk truthy-fælde), ikke som levende eksempel.

## Punkter i briefet, jeg ikke nåede

Ingen. Alle seks krævede kort, de fire yderpunkter, én beregnet
iagttagelse, hoved/hero/afslutning er bygget og efterprøvet ved begge
bredder.
