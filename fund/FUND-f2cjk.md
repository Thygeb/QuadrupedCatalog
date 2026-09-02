# FUND — spor/f2-cjk: den kinesiske ordlyd, renset for dansk

Robotter: `robot_id` 2186 (`astrall-dynamics-hypertron-t01`) og 2258 (`yufan-lingmao-cyvet`).

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
| 2186 | ip_rating | D | Caveaten hævder en "ueftereprøvet IP67-påstand i en pressemeddelelse, der ikke kunne hentes" — søgt i alle tre astrall-kildefiler (produktside, forside, om-os) efter "IP67" og "pressemeddelelse": intet fundet. Værdien selv (IP66) har en gyldig kilde; DENNE påstand har ingen. Rørt ikke, sat på D-listen |
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

**Facit: A = 32, B = 0, C = 2, D = 1. Sum = 35.**

**Afviger fra briefets forudsigelse 29/3/3/0** — se "Nye fælder og opdagelser"
i hovedrapporten for hvorfor B blev 0, ikke 3.
