# FUND — spor/f2deep: kildeordlyd til DEEP Robotics' 77 forbehold

**Navnevalg:** `FUND-f2deep.md`/`BRIEF-f2deep.md` var allerede optaget af det tidligere
(bindestregede) `spor/f2-deep` (merget). Orkestratorens `c2bd420` overskrev
`BRIEF-f2deep.md`'s indhold FØR jeg startede — se "Nye fælder". Jeg gør ikke skaden
større: denne rapport og mine arbejdsfiler har andre navne (`FUND-f2deep-kildeordlyd.md`,
`f2deep2-fremdrift.txt`).

**Skills:** valgt `spor`, `robotdata`, `supabase` (MCP `execute_sql`). Fravalgt `design`
(ingen visuel flade), `fejljagt` (intet uventet).

## ÆNDRINGEN — A/B pr. robot (kriterium 1)

| Robot | A (udfyldt) | B (dokumenteret tom) | Felter i B |
|---|---|---|---|
| lite3 | 6 | 3 | height, slope, runtime |
| lynx-m20 | 11 | 2 | lidar, compute |
| lynx-m20-pro | 11 | 2 | lidar, compute |
| lynx-m20s | 10 | 1 | lidar |
| lynx-s10 | 4 | 0 | — |
| mini | 7 | 0 | — |
| x20 | 5 | 1 | runtime |
| x30 | 6 | 1 | runtime |
| x30-pro | 6 | 1 | runtime |
| **Sum** | **66** | **11** | **A+B=77, C=0** |

Alle 66 A-rækker skrevet til `field_entries.caveat_wording`, `collected_by='spor/f2deep'`.
Fuld liste med hver ordlyd og hver B-søgning: `fund/f2deep-arbejde.json`.

## Grundmåling
`select count(*) ... where caveat_wording is null and caveat is not null and
manufacturer='DEEP Robotics'` → **77**, matcher briefet præcist. Pr.-robot-fordelingen
(9/13/13/11/4/7/6/7/7) matchede også briefets tabel.

## Kriterier — målt (alle høj konfidens: genkørbar kommando + kontrafaktisk linje)
1. **A+B+C=77:** 66+11+0=77. Kontrol: `... where manufacturer='DEEP Robotics' and
   caveat_wording is null and caveat is not null` → **11**. Havde jeg skrevet for få A,
   ville tallet være >11. ✓
2. **Bogstavelig delstreng:** `node db/f2deep-skriv.mjs --verificer` → **116 fragmenter,
   0 fejl**. Fejlede 7 gange undervejs (se fælde 4) og blev rettet FØR nogen skrivning. ✓
3. **Intet andet ændret:** globalt `n_caveat=890` uændret fra grundmålingen. 5 stikprøver
   (lite3/weight, lynx-m20/payload_walking, lynx-m20s/speed, x30/weight, x30-pro/width)
   sammenlignet felt-for-felt mod min FØR-dump: **5/5 uændrede** (value_number, unit,
   source, caveat). PATCH-kroppen sender strukturelt kun 3 kolonner. ✓
4. **Herkomst:** `collected_by='spor/f2deep'` → **66** = A. ✓
5. **Kontrolgruppe:** `collected_by='spor/f2deep' and manufacturer<>'DEEP Robotics'` →
   **0**. ✓

## Ordlydsform og CN/EN
**Etiket-plus-værdi** (51/66, fx `"Payload Capacity"`) når forbeholdet handler om
etiketten; **ren værdi/annotation** (15/66, fx `"(battery included)"`) når det handler
om tallet. **9 rækker citerer BEGGE sprog** fordi caveat eksplicit kontrasterer dem
(lite3 payload_walking/stair_step_continuous/data_ports, lynx-s10 weight/speed,
mini battery_wh, x20 payload_walking/data_ports, x30 stair_step_continuous) — jeg
afgjorde ikke hvem der "har ret", begge fragmenter citeret adskilt.

## Nye fælder og opdagelser
1. **Dokumentnavne-kollision, sket før jeg startede.** `spor/f2-deep` og `spor/f2deep`
   deler filnavne (`BRIEF-f2deep.md`, `FUND-f2deep.md`, `f2deep-skriv-log.txt`,
   `f2deep-dump.mjs`). `c2bd420` overskrev det gamle `BRIEF-f2deep.md`. `FUND-f2deep.md`
   peger stadig på det GAMLE sprors rapport, ikke dette — orkestratoren bør afgøre det
   rigtige navn fremadrettet.
2. **lynx-m20s/obstacle_single:** briefets citat af caveaten ("Max. Single-Step Height")
   er en upræcis parafrase — den faktiske EN-label er "Max. Single-Step **Obstacle**
   Height". Skrevet med den korrekte, bogstavelige label.
3. **lynx-s10/autonomy_level:** `value_text` siger "**route** planning", kilden siger
   "**path** planning". Rørte ikke `value_text` (uden for mandatet) — `caveat_wording`
   bruger kildens faktiske ord. Bør flages til en fremtidig rettelse af `value_text`.
4. **`<sup>`-tags splitter fodnotetal fra label i rå HTML.** "Lab-Tested Max. Speed[1]"
   findes IKKE sammenhængende, fordi "[1]" ligger i et `<sup>`-tag. Løsning: citér
   labelen uden taltegn, citér fodnotens fulde brødtekst separat. Ramte 7 fragmenter,
   alle rettet før skrivning.
5. **Lynx S10 har INGEN specifikationstabel** — alle mål/ydelser står i brødtekst. Alle
   4 rækker er kasse A på brødtekst-citater, ikke tabelceller.

## Punkter i briefet, jeg ikke nåede
Ingen. Alle 5 acceptkriterier målt og bestået, arbejdsfilen skrevet, alle 9 commits lavet
(én pr. robot).
