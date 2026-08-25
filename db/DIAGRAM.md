# Robotkatalogets datamodel — diagram

Læsebillede af [skema.sql](skema.sql), som er sandheden. Genereret 25. aug 2026 til
planlægning (L34/D12). Ændrer skemaet sig, skal denne fil følge med — eller slettes.

## Kredsløbet — sådan bevæger sandheden sig

Indtil D12-vippet er YAML-filerne den arbejdende sandhed; databasen er et efterprøvet
spejl. Rundturen er beviset: alt, der migreres ind, skal komme identisk ud igen.

```mermaid
flowchart LR
  yaml["data/robots/*.yaml<br/>67 poster i git"]
  mig["db/migrer.mjs --til-db<br/>tøm og genindlæs"]
  db[("Supabase<br/>6 tabeller · RLS · kun service_role")]
  studio["Supabase Studio<br/>redigering — først efter D12"]
  eks["db/eksporter.mjs --fra-db"]
  ud["eksporteret YAML<br/>(midlertidig mappe)"]
  port["validate · build · tests<br/>18 regler, 195 prøver"]
  rt{"rundtur --live<br/>62/62 dybt lig?"}

  yaml --> mig --> db
  db --> eks --> ud --> port --> rt
  rt -- "ja: bevist enige" --> yaml
  studio -. "efter vippet" .-> db
  rt -- "nej: flet afvises" --> mig
```

Målt 25. aug 2026: live-rundtur 62/62 · validate 0 fejl · build 173=173 sider ·
857=857 kildebelagte tal. Filerne er siden vokset til 67 poster; databasen
genmigreres, når kand5 og lysbyg er flettet.

## ER-diagram — de seks tabeller

Alt hænger på `robotter.id` med kaskadesletning. Fravær af en række er information:
ingen billede-række betyder måleplade, ingen anvendelse-række betyder at topnøglen
ikke findes i YAML'en.

```mermaid
erDiagram
  robotter ||--o{ feltposter : "praecis 30 pr. robot"
  feltposter ||--o{ feltpost_varianter : "0-n varianter (R15)"
  robotter ||--o| anvendelse : "0-1 (R16)"
  robotter ||--o| billede : "0-1 (R18)"
  robotter |o--o| robotter : "forgaenger / arv / delt billede"
  feltdefinitioner ||..o{ feltposter : "30 feltnavne (spejl af skema.mjs)"

  robotter {
    bigint id PK
    text slug UK "R14: slug = filnavn"
    text navn
    text producent
    text producentland
    status_enum status
    bigint forgaenger_robot_id FK
    text_arr varianter
    jsonb noter "streng ELLER liste"
  }
  feltposter {
    bigint robot_id PK,FK
    feltnavn_enum feltnavn PK
    feltform_enum form "R4 som CHECK"
    tilstand_enum tilstand
    numeric vaerdi_tal
    numeric min
    numeric maks
    text vaerdi_tekst
    boolean vaerdi_bool
    text_arr vaerdi_liste
    text enhed "R5: tal kraever enhed"
    operator_enum operator
    text kilde "R6: http-regex, NOT NULL"
    date hentet "R7: NOT NULL"
    kildetype_enum kildetype
    text advarsel
    tilstand_enum ved_last_tilstand "R10"
  }
  feltpost_varianter {
    bigint robot_id PK,FK
    feltnavn_enum feltnavn PK,FK
    text variant_navn PK
    jsonb vaerdi "skalar"
  }
  anvendelse {
    bigint robot_id PK,FK
    boolean er_ikke_oplyst
    jsonb vaerdi "kategorier"
    jsonb citat "R16: paakraevet"
    text kilde
    bigint arvet_fra_robot_id FK "R17"
  }
  billede {
    bigint robot_id PK,FK
    text fil
    ophav_enum ophav "S1 doemmer paa fabrikant"
    text kilde "kraevet for fabrikant+silhuet"
    bigint delt_med_robot_id FK "L28"
  }
  feltdefinitioner {
    feltnavn_enum feltnavn PK
    text gruppe
    text art
    boolean katalogfelt
    boolean filterfelt
  }
```

Rækketal efter fuld migrering af 67 poster: robotter 67 · feltposter 2.010 ·
varianter 127 · anvendelse 66 · billede 54 · feltdefinitioner 30.

## De syv enum-typer

| Enum | Værdier |
|---|---|
| `tilstand_enum` | ikke_oplyst · nej · kun_billede — 0 er strukturelt et tal, aldrig en tilstand |
| `feltform_enum` | bare_tilstand · tilstand_med_herkomst · tal · interval · tekst · bool · liste |
| `feltnavn_enum` | de 30 feltnavne — et ukendt felt kan ikke indsættes |
| `status_enum` | i_produktion · annonceret · udgaaet · demonstrator |
| `kildetype_enum` | primaer · sekundaer |
| `operator_enum` | > · >= · < · <= · ~ · ± |
| `ophav_enum` | eget_foto · silhuet · fabrikant |

## Hvem fanger hvad

| Lag | Håndhæver |
|---|---|
| **Databasen selv** | enums, NOT NULL, FK'er · R4 (værdi XOR interval, CHECK) · R5 (tal kræver enhed) · R6/R7 (kilde-URL + hentedato på alt undtagen bar tilstand) · R16 (kategori kræver ordret citat) |
| **Migrering + validate** | R15 (variantnavn i robottens egen liste) · hele R17-arven (kræver opslag i moderens række) · enhedens dimension · R18's stiregler + fil-findes-på-disk |
| **Build + drift** | S1 (`--til-udgivelse` afviser fabrikant-billeder) · nævneren udledes af skemaet (L30) · RLS uden policies: kun service_role, nøglen i gitignoreret `.env` |
