# FUND — `spor/f2rest`: 40 forbehold uden kildeordlyd, 13 producenter (+ Galileos 9)

**Skills:** `spor`, `robotdata`, `supabase` — alle tre kaldt og kørt fra worktreen.
`design`/`fejljagt` gået forbi (ingen visuel flade, ingen uventet adfærd).

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

19 felter fik producentens egne ord ind i `caveat_wording` (fx Unitree B2-W's "25km with
40kg load [2]" for driftstid, MicroRoboTechs "Standing Dimensions" "900mm × 600mm × 650mm"
for bredde/højde, Ghost Vision 60's "Autonomy Modes" "Perception Aided Mobility"
"Record-Playback" "Mission Control"). 30 felter er bevidst LADT TOMME — intet producentcitat
at hente, kun vores egen analyse (se `fund/f2rest-arbejde.json` for søgning/belæg pr. række).

**Rettelse modtaget undervejs:** orkestratoren omgjorde punkt 3 (Galileo "skåret ud") efter
selv at have læst de 9 forbehold — ingen citerer producenten, alle er egne sammenligninger
("as expected", "an analogy drawn from", "same source as C1"). PDF'en (CID-kodet, ikke
gennemsøgelig) er irrelevant for netop disse 9. Ført som Kasse B med selve sætningen som belæg.

## Målemetode, efterprøvning og konfidens
Grundmåling FØR skrivning: mine 40 rækker matchede briefets tabel præcist. DEEP (11) og
MagicLab (2) lå under briefets 77/53, fordi `spor/f2deep`/`spor/f2magic` arbejdede samtidig
— ikke rørt. `db/f2rest-skriv.mjs --verificer`: 49 fragmenter i 19 rækker, **0 fejl**, hver
som bogstavelig delstreng af rækkens EGEN kildefil. `--skriv`: 19/19 PATCH bekræftet.
Selv-efterprøvning EFTER skrivning mod DEN LEVENDE database (ikke kun scriptets eget svar):
genlæste alle 19 → **19 matcher, 0 afviger**; genkørte grundmålingen → **21** mangler stadig,
præcis lig B-listens tælling. Kriterium 4: `collected_by='spor/f2rest'` → **19**. Kriterium
5: 0 rækker på DEEP/MagicLab/Galileo. Kriterium 3: hvert PATCH-kald sendte KUN
`caveat_wording`+`collected_by`+`change_reason` — garanteret ved konstruktion.

**Konfidens høj** på alle 19 A-skrivninger og regnskabet (49) — genkørbare mod databasen;
kontrafaktisk: et forkert fragment havde stoppet ALT (kriterium 2), gav faktisk 6 fejl i
første forsøg (rettet, se "Nye fælder"). **Middel** på GENISOM's 7 strukturelle B-rækker.

**Usikkerhed:** ANYbotics `autonomy_level` (2184) — "AI-based mobility and autonomy" er en
literal overskrift, men "Autonomous inspection missions" (DB's parafrase) findes IKKE ordret
— derfor B, selvom DELE af value_text er citerbare.

**pudu-d5-w** (briefets punkt 5): `caveat` (IKKE `caveat_wording`) beskriver stadig det
opdigtede "$85,000"-fragment fra Å171 — `caa0ea3` nulstillede kun `value_number`.
`caveat_wording` var allerede NULL og forbliver det — intet producentcitat findes for prisen.

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

## Punkter i briefet, jeg ikke nåede
Ingen. Alle 40 rækker fra briefets tabel plus de 9 Galileo-rækker fra rettelsen er
klassificeret (A, B eller C — C=0). `fund/f2rest-arbejde.json` bærer den fulde liste med
søgning/belæg pr. række.
