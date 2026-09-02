# FUND — spor/f2-cjk: den kinesiske ordlyd, renset for dansk

Robotter: `robot_id` 2186 (`astrall-dynamics-hypertron-t01`) og 2258 (`yufan-lingmao-cyvet`).

## Punkt 5(b) øverst, som krævet: `change_log`-triggeren VIRKER

`change_log` havde 0 rækker for disse to robotter, da briefet blev skrevet.
**Efter skrivningen: 39 rækker** (34 `field_entries` + 4 `applications` +
1 `robots` — de 4 på `applications` er 2 originale + 2 fra en efterfølgende
rettelse, se punkt 4 nedenfor), alle med `changed_by = 'spor/f2-cjk'`.
Triggeren fyrer altså korrekt på en rigtig UPDATE. Målt to gange (før og
efter rettelsen), samme mekanisme begge gange.

## Rapport (≤60 linjer)

**1. Valgt / fravalgt.** Genskabte måleredskabet fra briefets beskrivelse
(kildekoden fra `spor/f2-pilot` var ikke tilgængelig) frem for at gætte på
et andet format — fravalgt: at stole på den eksisterende `caveat_wording`-
tekst uden kildeverifikation (ville have arvet mindst to tegnkorruptioner,
se "Nye fælder"). Fravalgt at bruge briefets forudsagte 29/3/3/0-fordeling
som facit — målt egen fordeling i stedet (32/0/2/1), se punkt 2.

**2. Konfidens.**
- **Høj**: `node fund/maal-f2-cjk.mjs 2186,2258` — genkørbar, giver i dag
  `caveat 35|dansk 1, caveat_wording 34|dansk 0, applications.note 2|dansk 0,
  images.note 0|dansk 0, robots.notes 3|dansk 0, robots.notes_wording 3|dansk 0`.
  Var arbejdet forkert (dansk glemt et sted), ville et af disse tal være >0
  ud over den bevidst urørte D-række.
- **Høj**: UTF-8-rundtur, `node fund/f2-cjk-utf8tjek.mjs` — 76 strenge
  sammenlignet med `===` mod PRÆCIS det, `db/f2-cjk-skriv.mjs` selv sendte
  (genbrugt via `import`, ikke en ny afskrift): 0 mismatch. Var en CJK-streng
  forvansket undervejs, ville denne kommando vise `MISMATCH` med det eksakte
  kodepunkt.
- **Høj**: kildeverifikation, `node db/f2-cjk-skriv.mjs --verificer` — 73
  wording-fragmenter, hvert prøvet som bogstavelig delstreng (eller
  etiket+værdi-split, eller "..."-split) i den citerede råkildefil: 0 fejl.
  Var et citat opdigtet, ville denne kommando afvise det FØR nogen
  skrivning.
- **Høj**: `node fund/f2-cjk-punkt5-tjek.mjs` — punkt 5(a)+(b) samlet: 0
  uventede kolonnediffs mod `fund/snapshot-foer-f2-cjk.json`, 39
  `change_log`-rækker, 0 forkerte `changed_by`. Var en talkolonne rørt ved
  et uheld, ville denne kommando vise `UVENTET DIFF` med kolonnenavn.
- **Middel**: de engelske `caveat`-teksters MENING (at oversættelsen er tro
  mod det danske grundlag) — læst igennem manuelt (alle 43), ikke målt med
  en kommando. Fandt og rettede 1 fejl (se punkt 4).

**3. Usikkerheder.** `2186/height`s "se noter" og `2186/temperature_max`s
"se noter" peger på `robots.notes`, som er `NULL` for 2186 — enten en
dinglende reference fra en tidligere agent, eller "noter" betyder blot
"andre feltbemærkninger på denne robot" i løs forstand. Oversat bogstaveligt
uden at gætte på hvilken. Ingen kinesisk etiket var uklar nok til at kræve
et gæt — alle otte stikprøvede labels/citater matchede råkilden ordret ved
direkte opslag (se punkt 1 i commit-historikken).

**4. Målingerne.** 35 advarsler klassificeret: **A=32, B=0, C=2, D=1**
(briefets forudsigelse var 29/3/3/0 — B blev 0, ikke 3, se "Nye fælder").
37 skrivninger udført (34 `field_entries` + 2 `applications` + 1 `robots`),
alle "1 række opdateret". 1 efterfølgende rettelse (2 × `applications.note`,
"industry" → "industrial") fundet ved slutlæsningen af alle 43 tekster —
**43 læst, 1 fejl fundet**. Slutmåling: `caveat_wording` dansk 34→0,
`caveat` dansk 35→1 (kun kasse D, bevidst urørt). `change_log`: 39 rækker,
0 forkerte `changed_by`. Punkt 5(a)-diff: 0 uventede ændringer uden for
tekstkolonnerne (alle tal, kilder, datoer uændrede).

## Punkt 5(c) — Kasse D-listen til JPK — OPDATERET: raekken er SLETTET under L87

**Denne sektion beskrev oprindeligt raekken som urørt, som briefets kasse-D-
regel krævede.** Efter orkestratorens efterprøvning besluttede JPK **L87**
(STATUS.md, 2. sep 2026): *"Kildens ord ordret, vores prosa KUN når hver
påstand kan efterprøves i et snapshot — og det, der ikke kan, SLETTES."*
Det er hård begrænsning 2 gjort til regel for fase 2, og den gør netop denne
D-postens tilstand ("urørt, dansk, uden belæg") til noget der skal væk.

**Sletningen er JPK's beslutning, udført her på hans ord — ikke sporets eget
initiativ.** Udført med `db/f2-cjk-l87-slet.mjs` (nyt, ejet af dette spor):
`caveat` sat til `null` (var den danske sætning nedenfor), `caveat_wording`
forblev `null` (var det allerede). `value_text` ("IP66", kildebelagt) er
URØRT — kun selve den ubelagte påstand er væk.

**Uventet ekstra ændring, opdaget af selve databasen, ikke af briefet:**
rækken havde `caveat_class = 'validity'`. Constraint'en
`feltposter_advarsel_klasse_kraever_advarsel` (db/skema.sql) tillader ikke
en advarsels-klasse uden en advarsel — første skriveforsøg blev afvist med
HTTP 400. `caveat_class` er derfor OGSÅ sat til `null`, mekanisk krævet af
selve sletningen, ikke en selvstændig beslutning.

| robot_id | field_name | dansk tekst (SLETTET, stod her før L87) | søgt efter og ikke fundet |
|---|---|---|---|
| 2186 | ip_rating | ~~"Se noten om en ueftereprøvet IP67-påstand i en pressemeddelelse, der ikke kunne hentes."~~ | Søgte "IP67" og "pressemeddelelse" i alle tre astrall-kildefiler (`astralldynamics-hypertron-t01-produktside`, `astralldynamics-forside`, `astralldynamics-om-os`, alle 2026-08-24). Ingen af de tre nævner IP67 nogen steder (kun IP66, som ER kildebelagt på produktsiden og URØRT). `robots.notes` for 2186 er desuden `NULL` — feltets egen henvisning "se noten" pegede derfor på noget, der ikke findes i databasen, hvilket understøttede at påstanden aldrig fik en kilde hæftet på sig. |

**Efterprøvet:** `node fund/maal-f2-cjk.mjs 2186,2258` giver nu
`caveat 34 | dansk 0` og `heraf uden ordlyd 0` (før: `35 | 1` og `1`).
`change_log` for de to robotter: **40 rækker** (før: 39), alle
`changed_by = 'spor/f2-cjk'`. Punkt 5(a)-diffen viser nu netop ÉN uventet
kolonnediff (`caveat_class`, forklaret ovenfor) — resten af invariansen
(alle andre tal, kilder, datoer) holder stadig.

## Punkt 2 — Klassificering af alle 35 advarsler

Fire kasser. **A** = ordlyd findes, forurenet af dansk. **B** = ordlyd findes,
allerede ren. **C** = ingen ordlyd, citat findes i kilden og kan trækkes ud.
**D** = påstanden kan ikke føres tilbage til nogen kilde — rørt ikke.

| robot_id | field_name | kasse | begrundelse |
|---|---|---|---|
| 2186 | weight | A | `caveat_wording` = CJK-citat + dansk parentes + dansk sætning |
| 2186 | length | A | CJK-citat + dansk parentes, gentaget to gange |
| 2186 | height | C | `caveat_wording` NULL i dag; kilden har label+værdi `俯卧尺寸 1130mm*755mm*320mm` på samme produktside som feltets egen `source` — verificeret i punkt 1 |
| 2186 | payload_walking | A | CJK-citat + `(arbejdslast)` — dansk ord uden æøå, IKKE fanget af måleredskabets to ben, men stadig dansk ved læsning |
| 2186 | payload_standing | A | CJK-citat + dansk parentes |
| 2186 | speed | A | CJK-citat + dansk fodnote-oversættelse |
| 2186 | slope | A | Starter ligefrem med dansk "Etiket er" foran CJK-citatet |
| 2186 | obstacle_single | A | CJK-citat + dansk parentes |
| 2186 | stair_step_continuous | A | CJK-citat + dansk parentes |
| 2186 | ip_rating | D → **slettet under L87** | Caveaten hævdede en "ueftereprøvet IP67-påstand i en pressemeddelelse, der ikke kunne hentes" — søgt i alle tre astrall-kildefiler (produktside, forside, om-os) efter "IP67" og "pressemeddelelse": intet fundet. Værdien selv (IP66) har en gyldig kilde og er urørt; DENNE påstand havde ingen — oprindeligt sat på D-listen (rørt ikke), men **slettet af JPK's egen beslutning L87 efter orkestratorens efterprøvning**, se Punkt 5(c) |
| 2186 | temperature_max | A | CJK-citat + `(driftstemperatur). Opbevaringstemperatur ... er separat - se noter.` — igen uden æøå, samme måleblinde-vinkel som payload_walking |
| 2186 | runtime | A | CJK-citat + lang dansk uddybning |
| 2186 | docking_station | A | CJK-citat + dansk uddybning, inkl. tolkningen af "docking" |
| 2186 | lidar | A | CJK-citat + dansk parentes-oversættelse af specifikationerne |
| 2186 | cameras | A | CJK-citat + dansk parentes-oversættelse |
| 2186 | power_output | A | CJK-citat + dansk parentes |
| 2186 | data_ports | A | CJK-citat + `(ekstern kommunikation: ...)` — uden æøå, samme blinde vinkel |
| 2258 | weight | A | CJK-citat + lang dansk uddybning om nyttelast-sammenhæng |
| 2258 | length | A | CJK-citat + dansk parentes, gentaget |
| 2258 | height | A | CJK-citat + dansk parentes + henvisning til L30 |
| 2258 | degrees_of_freedom | A | Starter med dansk "FAQ-svar:" foran CJK-citatet |
| 2258 | payload_walking | A | CJK-citat + lang dansk begrundelse for gående/stående-valget |
| 2258 | speed | A | CJK-citat + dansk parentes |
| 2258 | stair_step_continuous | A | CJK-citat + dansk parentes |
| 2258 | ip_rating | A | Dansk "GÆLDER IKKE STANDARDMODELLEN" foran CJK FAQ-spørgsmål+svar, verificeret ordret mod `yufan-uniubi-shop-cyvet` |
| 2258 | temperature_max | A | To CJK-citater (spec + FAQ) + dansk uddybning |
| 2258 | battery_wh | A | Dansk "Trykt direkte som" foran CJK-citat |
| 2258 | runtime | A | To CJK-citater + dansk uddybning om lastbetingelse |
| 2258 | hot_swap | A | CJK-citat + dansk parentes |
| 2258 | lidar | A | CJK-citat + dansk parentes |
| 2258 | cameras | A | To CJK-citater + dansk parentes-oversættelse |
| 2258 | compute | A | CJK-citat + dansk halesætning |
| 2258 | ros2 | C | `caveat_wording` NULL i dag; to engelske citater ligger allerede INDE i den danske prosa (`"ROS 2 integration for Uniubi robots... Prerequisites: ROS 2 Humble is installed and sourced"`) — verificeret ordret mod `github-uniubi_ros2-README.md`. Topics `/cmd_vel /odom /joint_states /imu/data /battery_state` og robots.json's ene robotmappe `cyvet` også bekræftet |
| 2258 | sdk_languages | A | CJK-citat + dansk parentes |
| 2258 | price | A | CJK-citat + dansk parentes + dansk uddybning |

**Facit ved sporets oprindelige aflevering: A = 32, B = 0, C = 2, D = 1.
Sum = 35. Efter JPK's L87-beslutning (se Punkt 5(c)): D-rækken er slettet,
34 tilbage.**

**Afviger fra briefets forudsigelse 29/3/3/0** — se "Nye fælder og opdagelser"
i hovedrapporten for hvorfor B blev 0, ikke 3.

---

## Nye fælder og opdagelser (uden for de 60 linjer)

1. **To karaktertegn-korruptioner i den EKSISTERENDE database-tekst**, fundet
   ved at verificere citater mod selve HTML-kilden i stedet for at stole på
   teksten, der allerede lå der. `robots.notes_wording[1]` havde `•`
   (U+2022, almindelig bullet) hvor kilden konsekvent bruger `・` (U+30FB,
   katakana-midterprik) i "灵猫・Cyvet" — ni gange i kilden, alle ni med
   samme tegn. `robots.notes_wording[2]` havde et ASCII-punktum `.` hvor
   kilden har et fuldbredde kinesisk `。` (U+3002). Begge rettet til kildens
   tegn ved denne skrivning. Ingen af dem ville være fanget visuelt eller af
   dansk-detektoren — kun ved kodepunkt-for-kodepunkt-sammenligning.
2. **Kildens HTML-tabeller lægger etiket og værdi i separate celler**, ofte
   med mellemrum omkring skråstreger i etiketten ("数量 / 检测距离"). Første
   forsøg på at genkonstruere `caveat_wording` som én sammenhængende streng
   gav 31 verifikationsfejl af 46 fragmenter — ikke fordi indholdet var
   forkert, men fordi mellemrumsformateringen ikke matchede kilden præcist.
   Rettet felt for felt mod frisk HTML-udtræk. Se `fund/OPSKRIFT-fase2-cjk.md`.
3. **Måleredskabets egen stopordsliste kolliderede med almindelig engelsk**
   ("under", "over", "men", "dog") og gav 5 falske dansk-positiver på
   allerede-korrekt engelsk tekst efter selve skrivningen — herunder ordet
   "dog" i sig selv, som er farligt på netop denne robothunde-side. Fundet
   og rettet, se commit 96dacfa.
4. **Kasse B var 0, ikke briefets forudsagte 3.** De tre "kandidater",
   måleredskabet ikke selv fangede som danske, VAR stadig danskforurenede
   ved manuel læsning ("arbejdslast", "ekstern kommunikation", "driftstem-
   peratur ... er separat - se noter") — bare uden æøå og uden et ord fra en
   almindelig stopordsliste. Bekræftet beregnet (ikke kun læst): et script
   fjernede al citeret tekst fra alle 32 wording-felter og testede, om der
   stod dansk uden for citaterne — 0 af 32 var reelt rene.
5. **`media/_kilder/raa-kand2-2026-08-24/` og `raa-pdf-2026-08-24/`
   (uniubi GitHub-snapshots) manglede i worktreen** — briefet sagde "dine
   råkilder findes allerede", men den kendte gitignore-fælde ramte alligevel.
   Kopieret ind (læst fra hovedrepoet, intet skrevet der) — se commit 04a0673.
6. **`change_log`s `row_key` bruger forskellige nøglenavne pr. tabel**
   (`robot_id` for `field_entries`/`applications`/`images`, men `id` for
   `robots` — `log_change()`-triggeren i `db/skema.sql`). En første
   change_log-optælling filtreret kun på `row_key->>robot_id` gav derfor 36
   i stedet for det korrekte 37 — `robots`-rækken var der hele tiden, bare
   under en anden nøgle. Fanget, fordi jeg havde skrevet forventningen
   ("37") ned, FØR jeg læste tallet.
7. **`caveat_class` kan ikke stå alene uden en `caveat` — håndhævet af en
   DB-constraint, ikke af nogen skrevet regel.** L87-sletningen (RETTELSE 1)
   satte kun `caveat` til `null` i første forsøg; PostgREST afviste med
   HTTP 400 og `feltposter_advarsel_klasse_kraever_advarsel`, fordi rækken
   havde `caveat_class = 'validity'`. Enhver fremtidig L87-sletning skal
   også nulstille `caveat_class`, hvis den er sat — ellers fejler skrivningen
   synligt (godt), men først ved selve forsøget, ikke ved en kildekontrol.
8. **`process.exit()` efter et gennemført `fetch()`-kald crasher Node 24
   med en libuv-assertion og exit 127** — bekræftet af orkestratoren med
   kontrolgruppe, rettet i RETTELSE 3 (`process.exitCode` + `return`
   overalt i begge egne scripts). Værd at kende for enhver fremtidig
   node-fetch-CLI i dette projekt.

## Punkter i briefet, jeg ikke nåede

Ingen. Alle seks punkter (1-6) er gennemført, målt og commit'et undervejs.

