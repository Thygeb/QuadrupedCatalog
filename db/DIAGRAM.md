# Robotkatalogets datamodel — lavpraktisk forklaret

Læsebillede af [skema.sql](skema.sql), som er sandheden. Opdateret 2. sep 2026
(spor/skema, L81-L83 — engelsk skema, 77 robotter, 33 felter, `change_log`
i stedet for `synk_aftryk`). Ændrer skemaet sig, skal denne fil følge med —
eller slettes.

---

## Det store billede på 30 sekunder

Databasen svarer på ét spørgsmål: **"Hvad ved vi om hver robot, og hvor ved vi det fra?"**

- Én række i `robots` = én robot (fx Spot).
- Hver robot har **altid præcis 33 rækker** i `field_entries` — én pr.
  specifikation. Også når svaret er "det oplyser producenten ikke". Sådan
  kan udfyldningsgraden regnes: udfyldte felter ud af 33.
- Billede og anvendelse (`images`/`applications`) er **0 eller 1 række** pr.
  robot — findes rækken ikke, er det i sig selv et svar (intet billede =
  måleplade vises i stedet).
- Enhver UPDATE/DELETE på en af de fem skrivbare tabeller logges i
  `change_log` — fortrydelsesknappen (se afsnittet nedenfor).

**Kolonnenavnene er engelske** (L81-L83 punkt 3 i STATUS.md); den ENE
dansk↔engelsk-ordbog, der afgjorde hvert navn, er [ordbog.mjs](ordbog.mjs).
Kommentarerne i `skema.sql` forbliver danske — L82 gælder databasens
identifikatorer og indhold, ikke dokumentationens sprog.

---

## ER-diagrammet

```mermaid
erDiagram
  robots ||--o{ field_entries : "altid praecis 33 pr. robot"
  field_entries ||--o{ field_entry_variants : "0-n varianter"
  robots ||--o| applications : "0-1"
  robots ||--o| images : "0-1"
  robots |o--o| robots : "predecessor / inherited-from / shared-image"
  field_definitions ||..o{ field_entries : "ordbogen over de 33 felter"
  robots ||--o{ change_log : "historik ved UPDATE/DELETE"

  robots {
    bigint id PK "loebenummer - teknisk noegle"
    text slug UK "webnavnet, fx boston-dynamics-spot"
    text name "fx Spot"
    text manufacturer "fx Boston Dynamics"
    text manufacturer_country "fx USA"
    text manufacturer_city "fx Waltham - kan vaere tom"
    status_enum status "in_production m.fl."
    text locomotion "legged / legged_wheeled"
    integer first_released "aarstal, sjaeldent udfyldt"
    bigint predecessor_robot_id FK "peger paa aeldre robot"
    text_arr variants "fx Air, Pro, Edu"
    jsonb notes "forbehold og stop-tjek-citater"
    text collected_by "hvem redigerede"
    text change_reason "hvorfor"
  }
  field_entries {
    bigint robot_id FK "hvilken robot"
    field_name_enum field_name PK "hvilket af de 33 felter"
    field_form_enum form "hvilken svarform raekken har"
    state_enum state "not_stated / no / image_only"
    numeric value_number "selve tallet, fx 32.7"
    numeric minimum "intervallets bund, fx 35"
    numeric maximum "intervallets top, fx 75"
    text value_text "ordsvar, fx M5 T-slot"
    boolean value_bool "ja-nej-svar, fx ROS2"
    text_arr value_list "flere vaerdier, fx dataporte"
    text unit "kg, m-s, cm - kraevet ved tal"
    numeric imperial_value "fx 74.5 naar producenten ogsaa skriver lb"
    operator_enum operator "producentens forbehold: op til, cirka"
    text source "URL - kraevet paa alt undtagen bar tilstand"
    date retrieved_at "hvornaar vi laeste kilden"
    source_type_enum source_type "primary eller secondary"
    text caveat "synligt forbehold, fx variant-betinget"
    state_enum load_state "bar robotten noget under maalingen"
    numeric load_value "fx 20 kg last under runtime"
  }
  field_entry_variants {
    bigint robot_id FK "hvilken robot"
    field_name_enum field_name FK "hvilket felt varianten aendrer"
    text variant_name PK "fx Go2 Pro"
    jsonb value "variantens eget tal"
  }
  applications {
    bigint robot_id FK "hvilken robot"
    boolean is_not_stated "producenten inddeler ikke selv"
    jsonb value "kategorier, fx inspection + industrial"
    jsonb quote "producentens ordrette saetning - kraevet"
    text source "URL"
    date retrieved_at "hvornaar vi laeste kilden"
    bigint inherited_from_robot_id FK "moderen, naar en variant arver"
  }
  images {
    bigint robot_id FK "hvilken robot"
    text file "filnavn i assets, fx spot.jpg"
    origin_enum origin "own_photo / silhouette / manufacturer"
    text source "hvor billedet er hentet - kraevet for manufacturer"
    date retrieved_at "hvornaar billedet blev hentet"
    jsonb alt "sprogkortlagt alt-tekst {da,en}"
    bigint shared_with_robot_id FK "to robotter, eet foto"
  }
  field_definitions {
    field_name_enum field_name PK "et af de 33"
    text field_group "physics, energy, sensing ..."
    text kind "number, yes_no, text, list, ip"
    boolean catalog_field "vises paa kortet"
    boolean filter_field "kan filtreres paa"
  }
  change_log {
    bigint id PK "loebenummer"
    text table_name "hvilken tabel"
    jsonb row_key "raekkens noegle"
    text operation "update eller delete"
    jsonb old_row "hele den gamle raekke"
    text changed_by "fra collected_by"
    text reason "fra change_reason"
    timestamptz changed_at "hvornaar"
  }
```

### Sådan læses stregerne (kragefods-notation)

Hver **ende** af en streg fortæller, hvor mange rækker på dén side der kan deltage —
læs de to ender hver for sig:

| Endesymbol | Betyder |
|---|---|
| to lodrette streger | præcis én |
| cirkel + streg | nul eller én ("kan mangle") |
| cirkel + kragefod | nul eller mange |
| streg + kragefod | én eller mange |

Cirklen betyder altid *kan mangle*; kragefoden (de tre tæer) betyder altid *mange*.
Fuldt optrukket streg = ægte ejerskab (slettes robotten, ryger rækkerne med);
stiplet streg = løst opslag (ordbogen `field_definitions` ejer ikke
`field_entries`, den slås bare op i). Eksempel: `robots ||--o| images` læses
"én robot har nul eller ét billede" — cirklen ER måleplade-fallbacken.

---

## Enum-opslagsværket — alle syv lister, alle værdier

En enum er en **lukket liste af lovlige værdier** — som en dropdown, hvor man ikke
kan skrive frit. Prøver man at indsætte noget uden for listen, nægter databasen.
Pointen: stavefejl og hjemmelavede kategorier er strukturelt umulige.

### 1. `state_enum` — de ærlige ikke-tal-svar

Det vigtigste begreb i kataloget. Når vi spørger "hvad vejer robotten?", findes
der fire slags svar, som ALDRIG må blandes sammen (hård begrænsning 5):

| Svaret | Gemmes som | Betyder | Eksempel |
|---|---|---|---|
| et tal, fx `32.7` | talkolonne | producenten oplyser tallet | Spots egenvægt: 32,7 kg |
| `0` | talkolonne | producenten oplyser tallet NUL — et rigtigt svar | 0 kr. i licens |
| `not_stated` | enum | producenten siger ingenting — et hul | ANYmal X' vægt |
| `no` | enum | producenten siger udtrykkeligt "det har den ikke" | "ingen dockingstation" |
| `image_only` | enum | oplysningen findes kun som billede/tegning hos producenten | bruges sjældent |

Katalogsider "lyver" typisk ved at vise et hul som et nul eller omvendt. Denne
database KAN ikke blande dem: 0 er et tal i talkolonnen, resten er enum-værdier
i state-kolonnen.

### 2. `field_form_enum` — hvilken svarform har rækken?

| Værdi | Betyder | Eksempel |
|---|---|---|
| `number` | ét tal med enhed | fart: 1,6 m/s |
| `interval` | fra-til | højde: 35-75 cm (Keyper) |
| `text` | ord, ikke tal | "M5 T-slot-skinner" |
| `bool` | ja/nej-svar | ROS 2: ja |
| `list` | flere værdier | dataporte: Ethernet, USB, RS485 |
| `bare_state` | kun en tilstand, ingen kilde krævet | `not_stated` |
| `state_with_provenance` | en tilstand MED kilde | et "no" producenten selv har skrevet, med URL |

### 3. `field_name_enum` — de 33 felter

**Physics:** `weight` · `length` · `width` · `height` · `degrees_of_freedom` ·
`payload_walking` · `payload_standing` · `speed` · `slope` ·
`obstacle_single` · `stair_step_continuous` · `ip_rating` · `temperature_min` · `temperature_max`

**Energy:** `battery_wh` · `runtime` · `hot_swap` · `charging_time` · `docking_station`

**Sensing:** `lidar` · `cameras` · `compute` · `ros2` · `sdk_languages` · `autonomy_level`

**Payload:** `mounting_interface` · `power_output` · `data_ports`

**Commercial:** `price`

**Regulatory:** `ce_disclosed` · `fcc_disclosed` · `ul_disclosed` · `ccc_disclosed`

Låst liste = ingen kan opfinde et 34. felt ved en stavefejl. Ændres listen, er
det en beslutning med L-nummer i STATUS.md, ikke et skred.

### 4. `status_enum` — robottens livsstatus

| Værdi | Betyder | Eksempel |
|---|---|---|
| `in_production` | kan købes/lejes nu | Spot, Go2 |
| `announced` | vist af producenten, men ikke i handel | Shvana |
| `discontinued` | historisk, ikke længere solgt | Laikago |
| `demonstrator` | forskningsplatform, aldrig et produkt | (reserveret) |

### 5. `source_type_enum` — hvor tæt på producenten er kilden?

| Værdi | Betyder |
|---|---|
| `primary` | selve produktsiden på producentens domæne |
| `secondary` | producentens ØVRIGE eget materiale: PDF-datablad, manual, egen GitHub (L33) |

### 6. `operator_enum` — producentens egne forbeholdstegn

| Værdi | Læses som |
|---|---|
| `>` | mere end |
| `>=` | mindst |
| `<` | under |
| `<=` | op til |
| `~` | cirka |
| `±` | plus/minus |

Symboler, sprogneutrale — uændrede af L82.

### 7. `origin_enum` — hvor kommer billedet fra?

| Værdi | Betyder | Konsekvens |
|---|---|---|
| `own_photo` | vores eget kamera | frit at bruge, ingen kilde krævet |
| `silhouette` | vores måltro tegning | kilde krævet (måltallene skal kunne følges) |
| `manufacturer` | producentens pressefoto | kilde krævet. SPÆRRING S1 er ophævet (L37, 26. aug 2026) — ingen build-blokering længere |

---

## Tabellerne, felt for felt

### `robots` — én række pr. robot

Identitetsfelterne (`slug`, `name`, `manufacturer`, `manufacturer_country`,
`manufacturer_city`, `status`, `locomotion`, `first_released`,
`predecessor_robot_id`, `variants`, `notes`) — producenter er IKKE en egen
tabel, de udledes af robotterne. `locomotion` (`legged`/`legged_wheeled`)
IKKE "propulsion" — se `ordbog.mjs`.

### `field_entries` — 33 rækker pr. robot (77 × 33 = 2.541)

`form` styrer via CHECK, hvilke værdikolonner der SKAL/MÅ udfyldes.
`caveat_class` er engelsk KOLONNE med DANSK INDHOLD ("gyldighed"/"uddybning")
— bevidst afgrænsning, se `skema.sql`s kommentar ved kolonnen.

### `field_entry_variants` — når ét felt har flere tal

Go2 findes i fire udgaver; nyttelasten falder fra 5 til 2,5 kg hen over dem.

### `applications` — hvad producenten SELV siger, robotten er til

`value`/`quote` — KUN producentens egen inddeling, aldrig vores mening.
Tæller bevidst IKKE i udfyldningsgraden.

### `images` — robottens foto (0 eller 1)

`alt` er `jsonb` (sprogkort `{da, en}`) siden L81 punkt 3.
`shared_with_robot_id`: to robotter kan dele ét foto (L28).

### `field_definitions` — ordbogen over de 33 felter

Maskinskrevet kopi af `tools/skema.mjs` (genskrives ved hver `--til-db`,
aldrig håndredigeret). IKKE omfattet af `collected_by`/`change_reason` — den
er aldrig en Studio-redigering, et menneske skal forklare.

### `change_log` — fortrydelsesknappen (L81-L83 punkt 3)

Erstatter `synk_aftryk`. Fyldt af trigger `log_change()` ved UPDATE/DELETE
på de fem skrivbare tabeller. `changed_by`/`reason` kommer fra rækkens egen
`collected_by`/`change_reason` (NEW ved UPDATE, OLD ved DELETE).

---

*Kilde: `db/skema.sql` + `db/ordbog.mjs` + `fund/FUND-skema.md`.*
