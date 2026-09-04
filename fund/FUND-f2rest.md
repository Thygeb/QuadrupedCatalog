# FUND — `spor/f2rest`: 40 forbehold uden kildeordlyd, 13 producenter (+ Galileos 9)

**Skills:** `spor`, `robotdata`, `supabase` kaldt og kørt. `design`/`fejljagt` gået forbi
(ingen visuel flade, ingen uventet adfærd).

**RETTELSE (orkestratoren efterprøvede alle 19 rækker, ikke stikprøve):** NEURA
`sdk_languages`s `caveat_wording` bar et ` | `-rørtegn JEG havde indsat — kilden skriver
"Interfaces" og værdien som to SEPARATE linjer. Rettet til citat-form `"Interfaces" "Wi-Fi 6,
Gigabit Ethernet, ROS 2, C++, Python SDK, NEURA Sync"` (verificeret, patchet ALENE, rækketal
uændret: 19). Se "Nye fælder" punkt 6 for hvorfor mit eget `--verificer` ikke fangede det.

## ÆNDRINGEN — A/B/C pr. producent (49 rækker: 40 fra briefet + Galileos 9, se rettelsen)

| Producent | A (udfyldt) | B (dokumenteret tom) | C (uafgjort) | I alt |
|---|---|---|---|---|
| GENISOM AI | 2 | 9 | 0 | 11 |
| Unitree Robotics | 4 | 3 | 0 | 7 |
| MicroRoboTech | 4 | 0 | 0 | 4 |
| Rainbow Robotics | 1 | 2 | 0 | 3 |
| MAB Robotics | 1 | 2 | 0 | 3 |
| Yuejia Lingdong | 2 | 0 | 0 | 2 |
| ANYbotics | 1 | 1 | 0 | 2 |
| Ghost Robotics | 1 | 1 | 0 | 2 |
| WEILAN | 0 | 2 | 0 | 2 |
| RIVR | 1 | 0 | 0 | 1 |
| NEURA Robotics | 1 | 0 | 0 | 1 |
| Addverb | 1 | 0 | 0 | 1 |
| Pudu Robotics | 0 | 1 | 0 | 1 |
| **13 producenter i alt** | **19** | **21** | **0** | **40** |
| Galileo (Tianjin) (rettelse, se nedenfor) | 0 | 9 | 0 | 9 |
| **Samlet** | **19** | **30** | **0** | **49** |

19 felter fik producentens egne ord (fx Unitree B2-W's "25km with 40kg load [2]",
MicroRoboTechs "Standing Dimensions" "900mm × 600mm × 650mm"). 30 felter er bevidst LADT
TOMME — intet producentcitat at hente (søgning/belæg pr. række: `fund/f2rest-arbejde.json`).

**Galileo-udvidelse:** orkestratoren omgjorde punkt 3 efter selv at læse de 9 forbehold —
ingen citerer producenten, alle er egne sammenligninger ("as expected", "same source as C1").
Ført som Kasse B, sætningen selv som belæg.

## Målemetode, efterprøvning og konfidens
Grundmåling FØR skrivning: mine 40 rækker matchede briefets tabel præcist. DEEP (11) og
MagicLab (2) lå under briefets 77/53, fordi `spor/f2deep`/`spor/f2magic` arbejdede samtidig
— ikke rørt. `db/f2rest-skriv.mjs --verificer`: 49 fragmenter i 19 rækker, **0 fejl**, hver
som bogstavelig delstreng af rækkens EGEN kildefil. `--skriv`: 19/19 PATCH bekræftet.
Selv-efterprøvning EFTER skrivning mod DEN LEVENDE database: 19 → **19 matcher, 0 afviger**.
**Min B-liste er 30** (21 for de 13 producenter uden Galileo + Galileos 9) — **global rest i
kataloget er 43** (mine 30 + DEEP's 11 + MagicLabs 2). Skriv 30/43, ikke 21, i senere
reference. Kriterium 4: `collected_by='spor/f2rest'` → **19**. Kriterium 5: 0 rækker på
DEEP/MagicLab/Galileo. Kriterium 3: hvert kald sendte KUN de tre tilladte kolonner.

**Konfidens høj** på alle 19 A-skrivninger og regnskabet (49) — genkørbare; kontrafaktisk: et
forkert fragment stopper ALT (kriterium 2), gav 6 fejl i første forsøg. **Middel** på
GENISOM's 7 strukturelle B-rækker. **Usikkerhed:** ANYbotics `autonomy_level` (2184) —
"AI-based mobility and autonomy" er literal, men "Autonomous inspection missions" (DB's
parafrase) findes IKKE ordret — derfor B.

**pudu-d5-w** (punkt 5): `caveat` beskriver stadig det opdigtede "$85,000"-fragment fra
Å171 — `caa0ea3` nulstillede kun `value_number`; `caveat_wording` forbliver NULL.

## Nye fælder og opdagelser
1. **NBSP/linjeskift som usynlig fælde, mødt tre gange:** Unitree B2-W's kilde har U+00A0
   mellem "mileage" og "≈30km"; MAB5's tekstudtræk har et LINJESKIFT mellem "Operating
   temperature" og "0-45°C" — begge fejlede `--verificer` som håndskrevne, almindelige
   mellemrum. Løst ved at splitte i flere `"..."`-fragmenter i stedet for at gætte tegnet.
2. **GENISOM L1's arkiverede side (URL `/product-robot/L1`, MANIFEST-bekræftet) bærer et
   7-punkts funktionslisten, mens databasens `autonomy_level`-værdi for robot 2205 (L1) kun
   har 4 punkter** — de 7 punkter matcher i stedet L1-W's (2206) værdi. Enten er 2205's
   værdi forældet/ufuldstændig, eller L1-siden reelt viser L1-W-konfiguration. Ikke rettet
   (uden for mandat: kun `caveat_wording`), men flaget her.
3. **Dansk tekst i et engelsk-mærket felt:** `field_entries` (2257, `yuejia-yj30-w`,
   `autonomy_level`).`value_text` indeholder danske ord ("ja", "Billedtransmission",
   "Stemmegenkendelse") — brud på L81/L82's "databasen er engelsk". Ikke rettet (uden for
   mandat), flaget for et fremtidigt oprydningsspor.
4. **GENISOM L1-W's markedsføringsprosa nævner "内置3D激光雷达" (indbygget 3D-lidar), mens
   den STRUKTUREREDE sensor-tabel (samme side) ikke har nogen lidar-række** — en reel
   uoverensstemmelse i producentens EGET materiale, ikke en fejl i vores data. Understøtter
   B-klassifikationen for cameras-feltets "no lidar row"-forbehold.
5. **`content-range`-baseret optælling kræver `robot_id` som `select`-kolonne** —
   `select=id` gav `42703 undefined column` (ingen `id`-kolonne i `field_entries`), stille
   `null`-header ellers. Kostede tre forgæves forsøg før fejlkoden blev læst.
6. **Mit eget `fragmenter()`-værktøj skjulte NEURA-fejlen for sig selv:** funktionen splitter
   allerede på `" | "` (form `pipe-del`), så begge halvdele blev tjekket HVER FOR SIG og
   begge fandtes — men det er ikke det samme som at bevise at den SAMMENFØJEDE streng (med
   `|` skrevet ind i databasen) er kildetekst. Fragmenttallet var derfor 49 BÅDE før og efter
   rettelsen (ikke 47→48 som forventet) — pipe-formen talte allerede som to. Rodfejlen var
   ikke antallet af fragmenter, men at "begge halvdele findes hver for sig" blev læst som
   bevis for at HELE den sammensatte streng var kildetekst. Præcis f2pudus fejlform, én
   abstraktion længere ude: ikke opdigtet indhold, men opdigtet FORM, og mit eget
   værktøj var bygget til at bekræfte formen i stedet for at anfægte den.

## Punkter i briefet, jeg ikke nåede
Ingen. Alle 40 rækker fra briefets tabel plus de 9 Galileo-rækker fra rettelsen er
klassificeret (A, B eller C — C=0). `fund/f2rest-arbejde.json` bærer den fulde liste med
søgning/belæg pr. række.
