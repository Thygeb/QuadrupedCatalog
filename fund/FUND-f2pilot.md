# FUND — spor/f2-pilot

Arbejdslog. Selve rapporten (højst 60 linjer) står nederst, skrevet sidst.

## Punkt 1 — klassificering af de 17 advarsler

Hentet med `field_entries?robot_id=in.(2182,2183)&caveat=not.is.null` — 17 rækker,
bekræftet (`ANTAL: 17`). Klassificeret ved at læse hver `caveat`-tekst og se, om der
står et citat i anførselstegn, som hævder at være producentens egne ord.

| robot_id | field_name | Kasse | Begrundelse |
|---|---|---|---|
| 2182 | payload_walking | A | To citater: primær "Trakr 20 is the heavy-duty quadruped. 20 kg carry, rock-steady under load." + sekundær (mærket "kildetype sekundær" i teksten selv) "The Trakr 2.0 ... capable of carrying up to 20 kg" |
| 2183 | weight | A | "WEIGHT (INCL BATTERY): 18 KG" — briefets eget eksempel |
| 2183 | height | A | "STANDING HEIGHT: 280 MM" (+ ubrugt "HEIGHT OF CROUCHING: 150 MM") |
| 2183 | degrees_of_freedom | A | "12 actuators" (blogindlæg) |
| 2183 | payload_walking | A | "PAYLOAD: 5 KG" |
| 2183 | speed | A | "SPEED: 1.5 M/S" |
| 2183 | slope | A | To citater der tilsammen giver værdi+operator: "MAX CLIMB ANGLE: 30 DEGREES" og "Climbs stairs, slopes (≤ 30°)..." |
| 2183 | stair_step_continuous | A | "MAXIMUM STEP: 120 MM" (tabel, brugt) vs. modstridende "...climb steps upto 170 mm" (brødtekst, IKKE brugt, regel 9-tilfælde) |
| 2183 | ip_rating | A | "INGRESS PROTECTION (IP RATING): IP67 (OPTIONAL)" |
| 2183 | temperature_max | A | "TEMPERATURE: +5 °C TO +45 °C" |
| 2183 | runtime | A | "ENDURANCE: 1.5 HRS" (+ bekræftende "90-minute runtime" fra blog) |
| 2183 | charging_time | A | "CHARGING TIME: 90 MINS" |
| 2183 | docking_station | A | "CHARGING PILE COMPATIBILITY: YES" |
| 2183 | lidar | A | "LIDAR: 3D LIDAR" |
| 2183 | cameras | A | "HD WIDE ANGLE CAMERA: YES" (+ modstridende ubrugt "four stereo cameras" fra blog) |
| 2183 | compute | A | To citater, begge brugt til samme felt: "BASIC COMPUTING POWER: I7 PROCESSOR" + "HIGH COMPUTING POWER MODULE: JETSON ORIN" |
| 2183 | autonomy_level | B | Intet citat. Egen syntese af fire funktionskort + tabelrække; teksten siger selv "Ingen navngivet autonominiveau-skala" |

**Sum: A=16, B=1, C=0, i alt 17.** ✔ (matcher briefets krav om at de tre kasser summer til 17)

**Bemærkning, der bæres videre til punkt 6 (opskriften):** flere kasse-A-rækker har
MERE END ét citat — enten en bekræftende sekundær kilde (2182), to citater der
tilsammen giver tal+operator (slope), to citater der begge bærer reel feltværdi
(compute), eller et ubrugt/modstridende citat (stair_step_continuous, cameras). Det
"almindelige tilfælde" i briefet (ét citat, én kilde) dækker kun 10 af de 16 A-rækker
rent strukturelt. Beslutningsregel brugt her: `caveat_wording` bærer KUN det/de citater,
der reelt understøtter feltets nuværende værdi (adskilt med " | " hvis flere), aldrig et
ubrugt/modstridende tal — det bliver i `caveat`-prosaen som citeret kontekst.
