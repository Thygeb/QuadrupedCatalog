## ER-diagrammet

Opdateret 2. sep 2026 (spor/skema, L81-L83 — engelsk skema, 33 felter,
`change_log` i stedet for `synk_aftryk`). Se [DIAGRAM.md](DIAGRAM.md) for
den fulde, forklarede udgave med enum-tabeller og tabelbeskrivelser — denne
fil er kun selve diagrammet, til hurtigt opslag.

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
