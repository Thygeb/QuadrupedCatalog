# Rapport: Polering af producentsiderne (spor/producent)

Dato: 3. september 2026
Branch: spor/producent

## 1. Udført arbejde
1. Mobil-afskæring på producentindekset løst (assets/generator.css):
   - Tilføjet min-width: 0 på .prod-tabel for at neutralisere system.css globale table { min-width: 620px }, som tidligere tvang tabellen til 620 px bredde og skubbede ANTAL-kolonnen ud over skærmkanten på telefoner.
   - Nulstillet th:nth-child(2), td:nth-child(2) til width: auto og tildelt .figur en fleksibel kompakt bredde (min-width: 5ch; text-align: right) under @media (max-width:899px).
   - Resultat: På 390 px viewport (iPhone) vises alle 3 kolonner (PRODUCENT, LAND, ANTAL) 100 % synligt uden afskæring og uden horisontal scroll.

2. Visuel rytme & baseline (assets/generator.css):
   - Tilføjet min-height: 26px; display: inline-flex; align-items: center på .producent-fakta dd, så LAND (tekst), HJEMSTED (tilstandschip [ikke oplyst]) og MODELLER I KATALOGET (21px tal) flugter harmonisk på samme lodrette linje.
   - Tilføjet .eu-fund-linje + .eu-fund-linje { margin-top: var(--r2); }, som giver behagelig luft mellem flere CE-opgørelseslinjer (fx på Xiaomi med både nej og ikke_oplyst).

3. Mikrotypografi (data/i18n/da.json & data/i18n/en.json):
   - Indsat non-breaking spaces \u00A0 i producent_modeller ({n}\u00A0modeller / {n}\u00A0models) og producent_model_en (1\u00A0model), så tal og enhed aldrig skilles ad ved linjeskift.

## 2. Testresultater
- node tools/validate.mjs: 77 filer, 0 fejl, 1 advarsel (godkendt R9 tolerance på Ghost Robotics).
- node tools/build.mjs: 216 sider bygget uden fejl.
- node tests/koer.mjs: 1.744 bestået, 0 fejlet (100 % grøn).
- Visuel verifikation udført via DevTools MCP i 1440 px og 390 px.
