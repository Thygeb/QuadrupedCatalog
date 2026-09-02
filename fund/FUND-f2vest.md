# FUND — spor/f2-vest: 13 vestlige robotter, fase 2 (L87)

**Regel 0.** Valgt `robotdata` — læst direkte fra disk, ikke via Skill-tool
(opgaven var fuldt specificeret af briefs+opskrifter). Fravalgt: `supabase`
(ingen MCP-brug, kun `fetch()`), `fejljagt` (reglerne fulgt i praksis, se
"Nye fælder", skillen ikke formelt kaldt), `grillmig` (ude af workflow).

## 1. Valgt løsning / fravalgt alternativ

- Fulgte kasse-A/B-mønsteret — **alle 127 caveats var kasse A**. Fravalgt:
  ingen kasse D/L87-sletning nødvendig i `field_entries`.
- Byggede `db/f2-vest-skriv.mjs` med indbygget kildeverifikation
  (`--verificer`) — fravalgt manuel dobbelttjek af 127 felter uden
  mekanisk sikkerhedsnet.
- To `robots.notes`-påstande uverificerbare (RIVR "Swiss-Mile"/ETH
  Zürich; Boston Dynamics "Hyundai"). Fulgte L87: **hverken slettet
  eller oversat**, flaget nedenfor. Fravalgt at oversætte (udgiver
  uverificeret for verificeret) og at slette (L87 forbyder ved tvivl).

## 2. Konfidens pr. punkt

- **Grundmåling matcher briefet.** Høj. `validate.mjs` → 77/0/1, HEAD
  05cf625; `maal-f2-vest.mjs` → identisk med briefets tal. Forkert
  ville have givet andre tal.
- **127/127 dækket, 0 ekstra.** Høj. `krydstjek-felter.mjs`, mekanisk mod
  snapshot. Et glemt felt ville vise i "mangler"-listen.
- **230 kildefragmenter, 0 fejl.** Høj. `--verificer`. Et opfundet citat
  ville have givet fejl > 0 (gjorde det 38 gange undervejs, se "Nye fælder").
- **Talkolonner urørt.** Høj. `efterproev-f2vest.mjs` (a) → 0 diffs.
- **change_log korrekt.** Høj. Samme script (b) → 158 rækker,
  `changed_by=spor/f2-vest`, 0 uden for egne 13 robot_id'er.
- **Dansk 0 efter skrivning.** Høj for det målte, **middel for det usete**
  (se punkt 3). EFTER: caveat/caveat_wording/notes/value_text alle 0,
  `robots.notes` 1/29 (den bevidste Hyundai-undtagelse).

## 3. Usikkerheder mødt undervejs

- Dansk-detektoren fanger IKKE RIVR-notens danske sætning (ingen æøå,
  ingen stopord) — kun fundet ved manuel læsning af alle 308 tekster.
- Neura (2225) havde ingen råkilde i worktreen — hentet frisk (se "Nye
  fælder"). Usikker om en session uden netadgang kan genskabe den identisk.
- RIVR/Hyundai-påstandene er formentlig sande (offentligt kendt), men
  usporbare i vores eget materiale — se L87-listen.

## 4. Målingerne

```
validate.mjs:              77 filer / 0 fejl / 1 advarsel (grundmaaling, uaendret)
FIELD_ENTRIES daekning:     127/127 (0 mangler, 0 ekstra)
Kildeverifikation:         230/230 fragmenter, 0 fejl
--skriv:                   158/158 opdateringer bekraeftet
Talkolonne-diff (a):       0
change_log (b):            158 raekker, 0 uden for egne 13 robot_id'er
Dansk EFTER: caveat 0/127, caveat_wording 0/115, applications.note 0/13,
             images.note 0/1, value_text 0/32, robots.notes 1/29 (bevidst)
Selv-laesning:              308 tekster laest, 0 fejl (ud over de 2 L87-flag)
```

## L87-liste til JPK — 2 påstande, hverken slettet eller oversat

| Robot | Sted | Påstand | Hvorfor ikke verificerbar |
|---|---|---|---|
| boston-dynamics-spot (2188) | `robots.notes[1]` | "Majoritetsejet af Hyundai Motor Group (Sydkorea)" | 0 træf på "majority"/"owned"/"subsidiary" i produktside, datablad, og et frisk hentet `bostondynamics.com/about/` (2026-09-02) — kun en samarbejdsoverskrift fundet, ingen ejerskabserklæring |
| rivr-one (2230) | `robots.notes[0]` | "Tidligere Swiss-Mile... udspring fra ETH Zürich" | 0 træf på "Swiss-Mile"/"ETH"/"Zurich" i alle fire rivr.ai-filer, inkl. et frisk hentet stories-opslag (2026-09-02) |

Begge er sandsynligvis korrekte (offentligt kendte fakta), men kan ikke
føres tilbage til noget i `media/_kilder/`. Efterladt på dansk med vilje.

## Nye fælder og opdagelser

1. **`db/f2-vest-skriv.mjs`'s egen kildeverifikator havde tre målefejl,
   fundet og rettet FØR skrivning:** (1) et globalt `~`-strip (til at rense
   pdf.js' kerning-markør) ødelagde ÆGTE tilder i almindelige HTML-kilder
   (Bhairavs "~2-5 m/sec" blev til "2-5 m/sec"). (2) pdf.js' dokumenterede
   fi-ligatur-tab er IKKE bogstaverne "Certied" — det er styretegnet U+001F
   ("Certi\x1Fed"), usynligt ved almindelig terminaludskrift, så en
   streng-baseret "Certied"→"Certified"-rettelse ramte aldrig. (3) PDF'ens
   `en-US`-sprogmærker lækker ind midt i ord uden mellemrum
   ("suben-US-en-USmerged"). Alle tre er rettet i scriptets `laesKilde()`.
2. **Neura Quadruped (2225) havde INGEN råkilde i denne worktree** — hverken
   i `media/_kilder/` (ingen mappe nævner "neura") eller i nogen
   batch-manifest. Hentet frisk 2026-09-02 med ægte HTTP-status og
   Date-header (`curl -D`) til `media/_kilder/raa-f2-vest-2026-09-02/` —
   produktside + PDF-datablad, begge HTTP 200. Alle eksisterende danske
   caveats' påstande bekræftet ordret i det friske snapshot.
3. **"raa-anvendelse-2026-08-19" er misvisende navngivet** — mappen hedder
   "anvendelse" men bærer de FAKTISKE kilderne til Raion Robotics RAIBO2
   (samt Unitree/Xiaomi-materiale, ikke relevant her). Et spor der leder
   efter "raa-raion" eller lignende finder intet.
4. **RBQ-10's `rbq_llms.txt` er RAA markdown/HTML, aldrig kørt gennem
   `x.js`** — bærer bogstavelige `<strong>`-tags og markdown-stjerner midt i
   sætninger. Kildeverifikatoren måtte udvides til at ignorere dem, ellers
   fejler et ægte citat på formatering alene.
5. **To robots.notes-påstande var uverificerbare selv efter friske
   forsøg** — se L87-listen ovenfor. Første gang dette spor stødte på L87
   anvendt på `robots.notes` (ikke `field_entries`' caveat-trio) — der findes
   ingen "slet hele trioen"-mekanisme for et notes-array-element; løsningen
   blev at lade PRÆCIS det ene element stå untranslated, resten af arrayet
   oversat.
6. **Rainbow Robotics RBQ-10 har sine SDK-sider navngivet anderledes end den
   oprindelige danske caveat antog** ("RBQ SDK — C/C++ Overview" /
   "RBQ SDK — ROS2 Overview", ikke "RBQ SDK (C/C++)"/"RBQ SDK (ROS2)") — og
   "ROS 2 Humble integration" er ikke en sidetitel, men en omskrivning af
   quick-start-teksten "Connect the RBQ robot to ROS 2 Humble in 4 steps."
   Rettet til de faktiske overskrifter.
7. **Et felt kan have `value_text` sat med `caveat=NULL`** — ingen af
   opskrifterne nævner dette eksplicit. Fandt 5 sådanne rækker (heraf én,
   2228/autonomy_level, først fundet af et EFTER-krydstjek — den var glemt i
   første udkast af scriptet). Håndteret i et separat `VALUE_TEXT_ONLY`-array.

## Punkter i briefet, jeg ikke nåede

Ingen. Alle punkter i BRIEF-f2-vest.md og BRIEF-FAELLES.md er udført: 13
robotter, 127 caveats, 5 value_text-only-rækker klassificeret og skrevet,
grundmåling matchede, alle fem "rækkefølge"-punkter gennemført med commit
hver gang, og alle "Færdig når"-kriterier målt.

## Til opskriften

- **Tilføj afsnittet "value_text med caveat=NULL"** til
  `OPSKRIFT-fase2.md` §6.4: nogle felter har KUN dansk `value_text`, intet
  `caveat` at oversætte ved siden af — check hver robots fulde
  `value_text`-liste mod caveat-nærvær, ikke kun de rækker der allerede har
  et caveat.
- **Tilføj en L87-på-`robots.notes`-note**: trio-sletningsmekanikken (caveat/
  caveat_wording/caveat_class) findes kun for `field_entries`. For et
  `notes`-array-element uden kilde er svaret at lade PRÆCIS det element stå
  urørt (hverken slettet eller oversat) og oversætte resten af arrayet —
  ikke "lad hele rækken stå" (der er ingen "hele række" for et array).
- **pdf.js' fi-ligatur er U+001F, ikke bogstaverne "fi" mangler visuelt** —
  ret enhver fremtidig "Certied"-streng-erstatning til at matche
  `/\x1f/g` i stedet.
