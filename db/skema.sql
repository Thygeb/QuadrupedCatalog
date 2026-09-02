-- db/skema.sql — Postgres/Supabase-DDL for L34 (STATUS.md), redaktionslaget
--
-- ENGELSK, "SOM OM DET ALTID HAR VAERET SAADAN" (L81-L83, spor/skema,
-- 2. sep 2026): denne fil beskrev tidligere en database med danske tabel-,
-- kolonne- og enumnavne. L82 goer databasen engelsk — denne udgave er
-- skrevet, som om den engelske form altid har vaeret fundamentet, IKKE som
-- en ALTER-koreografi (den koreografi er db/migrering-engelsk.sql, genereret
-- af db/byg-migrering.mjs FRA db/ordbog.mjs — se den fil for selve
-- navneoversaettelsen og L30-laerdommen om, hvorfor den ikke er en anden
-- haandskrevet liste). Kommentarerne herunder er FORTSAT danske: det er
-- projektets interne dokumentationssprog (CLAUDE.md, STATUS.md, DATAFLOW.md
-- er alle danske) — L82 gaelder DATABASENS IDENTIFIKATORER og INDHOLD, ikke
-- kildekodens/dokumentationens sprog.
--
-- SANDHEDSKILDEN for FELTNAVNENE er stadig tools/skema.mjs (danske noegler —
-- den fil roeres ALDRIG af dette spor, jf. briefets filejerskab). Den
-- danske<->engelske oversaettelse af feltnavne (og alt andet i denne fil)
-- staar ÉT sted: db/ordbog.mjs. field_name_enum herunder er en
-- OEJEBLIKSAFLAESNING af de 33 FELTNAVNE, senest ajourfoert 1. sep 2026 (spor/
-- cert tilfoejede fcc_oplyst/ul_oplyst/ccc_oplyst — her fcc_disclosed/
-- ul_disclosed/ccc_disclosed). Postgres kan ikke laese en ekstern .mjs-fil
-- ved CREATE TYPE-tid, saa listen er skrevet i haanden ÉN gang her og skal
-- udvides mekanisk (ALTER TYPE ... ADD VALUE), hvis skema.mjs aendrer sig —
-- praecis den fejl, spor/cert selv begik (Å115), og som db/migrering-cert.sql
-- retter for den levende database.
--
-- IDENTIFIKATORER: alle tabel- og kolonnenavne er lowercase snake_case uden
-- store bogstaver, saa de aldrig kraever anfoerselstegn i en forespoergsel
-- (Supabase-skillen "supabase-postgres-best-practices", reference
-- schema-lowercase-identifiers.md — "unquoted lowercase identifiers are
-- portable and tool-friendly"). Ét reserveret Postgres-noegleord blev fundet
-- og undgaaet under omdoebningen: feltdefinitioner.gruppe blev IKKE til
-- "group" (GROUP BY), men til "field_group" — se db/ordbog.mjs's egen
-- kommentar ved kolonnen.
--
-- PRIMAeRNOeGLE: Supabase-skillens reference schema-primary-keys.md anbefaler
-- "bigint identity" for en enkelt database (ikke UUID v4 — det fragmenterer
-- indekset ved indsaettelse) og naevner slet ikke naturlige noegler/slugs som
-- alternativ. Opgavebrevet kraever omvendt "slug er noegle". De to forliges
-- her: `id bigint generated always as identity` er den TEKNISKE primaernoegle
-- (det, fremmednoegler peger paa — hurtige joins, ingen tekstsammenligning),
-- og `slug` staar som `UNIQUE NOT NULL` ved siden af og er den
-- FORRETNINGSMAeSSIGE noegle, som R14 (slug = filnavn) og hele YAML-kaeden
-- allerede kender. Ingen af de to erstatter den anden.
--
-- FREMMEDNOeGLER: hver eneste FK-kolonne herunder har sit eget indeks
-- (schema-foreign-key-indexes.md — Postgres opretter IKKE automatisk et
-- indeks paa en FK-kolonne, og uden det bliver JOIN og CASCADE-sletning en
-- fuld tabelscanning).
--
-- RLS: se bunden af filen. Supabase-skillens reference security-privileges.md
-- ("grant only the minimum permissions required") og security-rls-basics.md
-- er fulgt, men TILPASSET: dette er IKKE et multi-tenant-system med
-- brugerdata (RLS-basics' eksempler handler alle om at adskille bruger A's
-- raekker fra bruger B's). Supabase er her redaktoerens eget redskab (L34) —
-- siden bygges stadig fra data/robots/*.yaml (eksporteret fra databasen via
-- db/eksporter.mjs), ikke fra databasen direkte. Der er derfor INGEN
-- anon/authenticated-policy: RLS slaas til uden nogen policy, hvilket er
-- Postgres' egen default-luk-alt, og kun service_role (som altid omgaar RLS)
-- kan laese og skrive. Det er "basis", auth og finere RLS-politikker er
-- bevidst ikke bygget — se db/LAESMIG.md.
--
-- SYNK_AFTRYK FINDES IKKE LAeNGERE (L81-L83, punkt 5): den vagtede
-- db/migrer.mjs --til-db's skrivevej, som selv er fjernet — databasen ER
-- kilden nu, ikke YAML. Fortrydelse er flyttet til change_log (afsnit 7
-- nedenfor), som daekker BEGGE skrivevejenes fravaer: enhver UPDATE/DELETE,
-- uanset om den kom fra Supabase Studio eller en fremtidig redigerings-UI.

begin;

/* ============================================================
   0. ENUM-TYPER
   ============================================================ */

-- De TRE tilstande, en feltpost kan skrive som ren tekst (TILSTANDE i
-- skema.mjs). "0" er IKKE et fjerde medlem her — det er en almindelig
-- talpost med value_number = 0 og sin egen kilde (skema.mjs's egen
-- kommentar: "0 er den fjerde og er IKKE en streng ... kan ikke skrives som
-- en sentinel"). De fire tilstande — not_stated, no, 0, image_only — kan
-- derfor ALDRIG kollapse i dette skema (haard begraensning 5): de tre
-- foerste er lukkede enum-vaerdier, og 0 kan kun opstaa som form='number',
-- value_number=0 — en helt anden kolonne end state_enum'en. De to kan
-- strukturelt ikke blandes.
create type state_enum as enum ('not_stated', 'no', 'image_only');

-- Robottens markedsstatus (STATUS_VAERDIER). 'demonstrator' har 0
-- forekomster i data i dag (formscan, 25. aug 2026), men staar i skema.mjs
-- og skal kunne bruges — LimX W1-sagen i D9 er praecis grunden.
create type status_enum as enum ('in_production', 'announced', 'discontinued', 'demonstrator');

-- Kildens art (R6/tjekKilde). 'primary' har 0 eksplicitte forekomster i data
-- i dag (fravaeret AF kildetype betyder implicit primaer - se R6: feltet er
-- valgfrit), men staar som gyldig vaerdi og skal kunne skrives eksplicit.
create type source_type_enum as enum ('primary', 'secondary');

-- De seks operatorer, R8 tillader (OPERATORER i yaml.mjs/validate.mjs).
-- Symboler, ikke danske ord — uaendrede af L82 (sprogneutrale).
create type operator_enum as enum ('>', '>=', '<', '<=', '~', '±');

-- Billedets oprindelse (BILLEDE_OPHAV). 'manufacturer' er den, SPAeRRING S1
-- daekker — se kommentaren ved images.origin nedenfor. IKKE navngivet
-- "provenance_enum": det ord er allerede brugt til field_form_enum's
-- 'state_with_provenance' (herkomst-begrebet) — to danske ord (ophav,
-- herkomst) maa ikke dele ét engelsk paa tvaers af navnerum, ogsaa selvom
-- lavOrdbog()'s eget 1:1-vaern ikke saa det (den er per-kortlaegning), jf.
-- db/ordbog.mjs's rettelseshistorik.
create type origin_enum as enum ('own_photo', 'silhouette', 'manufacturer');

-- FORM — den afgoerende diskriminator for en feltpost. Ikke en del af
-- skema.mjs (som ikke behoever den — JS kan bare kigge paa hvilke noegler et
-- objekt har), men den mekaniske formscan af alle 62 filer (25. aug 2026,
-- fund/FUND-db1.md) fandt PRAeCIS syv former, og de summer til alle
-- feltposter (77 robotter x 33 felter) uden rest:
--   bare_state             — feltet er en ren tekststreng: "not_stated"
--   state_with_provenance  — { vaerdi: <tilstand>, kilde, hentet, ... }
--   number                 — { vaerdi: <tal>, enhed, kilde, hentet, ... }
--   interval               — { min, maks, enhed, kilde, hentet, ... }
--   text                   — { vaerdi: <tekst>, kilde, hentet, ... }
--   bool                   — { vaerdi: true/false, kilde, hentet, ... }
--   list                   — { vaerdi: [tekst, ...], kilde, hentet, ... }
-- Formen er det, der goer R4 ("vaerdi ELLER min/maks, aldrig begge, aldrig
-- ingen") til en CHECK i stedet for applikationslogik: en raekke har
-- PRAeCIS én form, og CHECK-reglerne nedenfor tillader kun de kolonner,
-- formen siger.
create type field_form_enum as enum (
  'bare_state', 'state_with_provenance', 'number', 'interval', 'text', 'bool', 'list'
);

-- De 33 feltnavne, tools/skema.mjs's FELTNAVNE havde 1. sep 2026 (NAeVNER,
-- jf. L30/L32/spor/cert i STATUS.md — naevneren udledes i koden af
-- FELTNAVNE.length og maa ALDRIG skrives som et tal andre steder end her og
-- i db/eksporter.mjs's driftvagt mod skema.mjs). Rakkefoelgen matcher
-- tools/skema.mjs's FELTER-objekt, ikke db/ordbog.mjs's — de to er ikke
-- forpligtet til samme raekkefoelge, kun samme MAeNGDE.
create type field_name_enum as enum (
  'weight', 'length', 'width', 'height', 'degrees_of_freedom',
  'payload_walking', 'payload_standing', 'speed', 'slope',
  'obstacle_single', 'stair_step_continuous', 'ip_rating', 'temperature_min', 'temperature_max',
  'battery_wh', 'runtime', 'hot_swap', 'charging_time', 'docking_station',
  'lidar', 'cameras', 'compute', 'ros2', 'sdk_languages', 'autonomy_level',
  'mounting_interface', 'power_output', 'data_ports',
  'price',
  'ce_disclosed', 'fcc_disclosed', 'ul_disclosed', 'ccc_disclosed'
);

/* ============================================================
   1. FIELD_DEFINITIONS — udledt af skema.mjs's FELTER, ikke opfundet.
   ============================================================
   db/eksporter.mjs (den vej, der skriver database -> YAML) laeser denne
   tabel som en maskinlaesbar spejling af tools/skema.mjs's FELTER-objekt —
   IKKE omvendt: siden L81 er databasen kilden, saa en fremtidig
   redigerings-UI kan laese/skrive denne tabel direkte, uden at importere
   JavaScript. field_definitions er BEVIDST UNDTAGET collected_by/
   change_reason (afsnit 7) — den er en spejling af koden, aldrig en
   Studio-redigering, et menneske skal kunne forklare/fortryde. */
create table field_definitions (
  field_name          field_name_enum primary key,
  field_group         text not null,               -- 'physics' | 'energy' | ... (GRUPPER)
  kind                text not null,                -- 'number' | 'yes_no' | 'text' | 'list' | 'ip'
  dimension           text,                         -- spec.type, fx 'mass', 'length' — null for ikke-tal-arter
  secondary_dimension text,                         -- spec.ogsaaType, fx slope: 'grade'
  requires_load_condition boolean not null default false, -- spec.kraeverVedLast
  d4_affected         boolean not null default false, -- spec.d4 — beroert af det aabne spoergsmaal D4
  catalog_field       boolean not null default false, -- staar i KATALOG_FELTER
  filter_field        boolean not null default false  -- staar i FILTER_FELTER
);
comment on table field_definitions is
  'Spejl af tools/skema.mjs FELTER. Genskrevet ved hver --til-db, indtil YAML-vejen erstattes fuldt af databasen som kilde (L81).';

/* ============================================================
   2. ROBOTS — identiteten (IDENTITET_PAAKRAEVET / IDENTITET_VALGFRI)
   ============================================================ */
create table robots (
  id                  bigint generated always as identity primary key,
  slug                text not null unique,
  name                text not null,
  manufacturer        text not null,
  -- PRODUCENTFELTER BOR PAA ROBOTPOSTEN, IKKE I EN EGEN manufacturers-TABEL.
  -- Det er IKKE en afvigelse fra i dag: tools/build.mjs udleder selv
  -- "producenter" af robotternes eget producent-felt (en Map over
  -- r.producent), fordi data/manufacturers/ er tom. En separat
  -- producent-tabel ville kraeve en beslutning om, HVORDAN producenter
  -- normaliseres (samme navn stavet forskelligt to steder?), som ingen fil
  -- i dag tester, og som L34's opgave ikke bad om at loese. Bliver
  -- data/manufacturers/ nogensinde levende, er det en ny beslutning med sit
  -- eget nummer i STATUS.md, ikke noget der glider ind her.
  manufacturer_country text not null,
  manufacturer_city   text,                          -- IDENTITET_VALGFRI, delvist udfyldt (formscan)
  status              status_enum not null,
  -- LOCOMOTION (spor/dbfelter, 31. aug 2026): PAAKRAEVET identitetsfelt
  -- (IDENTITET_PAAKRAEVET, tools/validate.mjs:67 — "ben" | "ben_hjul" paa
  -- YAML-siden, her 'legged' | 'legged_wheeled'). text + CHECK, IKKE et nyt
  -- enum: to lukkede vaerdier, der staar UDEN for tools/skema.mjs's
  -- FELTNAVNE, og en CHECK kraever ingen ALTER TYPE ... ADD VALUE-
  -- koreografi, hvis en tredje fremdriftsform nogensinde tilfoejes. IKKE
  -- "propulsion" (orkestrator-rettelse, db/ordbog.mjs): propulsion er
  -- fremdrift ved motorkraft/thrust, locomotion er robotikkens ord for
  -- ben-mod-hjul.
  locomotion          text not null check (locomotion in ('legged', 'legged_wheeled')),
  first_released      integer,                        -- IDENTITET_VALGFRI, kun et aarstal
  predecessor_robot_id bigint references robots(id),   -- IDENTITET_VALGFRI "forgaenger:"
  variants            text[],                          -- IDENTITET_VALGFRI topnoegle, liste af variantnavne (R15)
  notes               jsonb,                           -- streng ELLER liste af strenge (noterListe/noterString,
                                                         -- se R1's noter-tjek). jsonb bevarer den PRAeCISE form
                                                         -- (streng vs. 1-elements liste er IKKE det samme for
                                                         -- rundturstesten/db/tjek.mjs), saa formen roeres ikke.
  -- NOTES_WORDING (spor/cjkui, 1. sep 2026, R21): soesterfeltet til "notes".
  -- JPK: "UI SKAL VAERE REN FOR kinesiske tegn" — producentens ordrette,
  -- ikke-danske formulering staar her; "notes" baerer KUN den danske
  -- oversaettelse (robot.mjs' noterBlok() renderer den ordret). ALTID en
  -- liste, ALDRIG en bar streng (modsat "notes" selv) — en PARALLEL liste,
  -- samme laengde og raekkefoelge som "notes", "" hvor den enkelte note ikke
  -- havde en fremmedsproget ordlyd (tools/validate.mjs's R21). Den praecise
  -- laengde-parring haandhaeves IKKE her (kraever et element-for-element-
  -- tjek, CHECK kan ikke sammenligne to jsonb-arrays elementvis uden en
  -- funktion) — kun formen (skal vaere et array) er en DB-CHECK.
  notes_wording       jsonb,
  -- COLLECTED_BY + CHANGE_REASON (L81-L83, punkt 3): fortrydelsesknappen OG
  -- haard begraensning 2's spor, jf. change_log (afsnit 7). Udfyldes af den,
  -- der redigerer raekken (Studio eller en fremtidig UI) — begge NULLABLE,
  -- fordi den maskinelle --til-db-indlaesning (indtil den erstattes fuldt af
  -- databasen som kilde) ikke kender en menneskelig aarsag pr. felt.
  collected_by        text,
  change_reason        text,
  constraint robots_predecessor_not_self check (predecessor_robot_id is distinct from id),
  constraint robots_notes_form check (notes is null or jsonb_typeof(notes) in ('string', 'array')),
  constraint robots_notes_wording_form check (notes_wording is null or jsonb_typeof(notes_wording) = 'array')
);
create index robots_predecessor_idx on robots (predecessor_robot_id);
create index robots_manufacturer_idx on robots (manufacturer);
comment on table robots is 'Én raekke pr. robot (data/robots/<slug>.yaml eksporteret hertil, eller redigeret direkte). R1: identitetsfelter er NOT NULL, ukendte topnoegler er strukturelt umulige (rigidt kolonnesaet).';
comment on column robots.slug is 'R14: slug = filnavn i den eksporterede YAML. Forretningsnoeglen. id er den tekniske FK-maalnoegle.';

/* ============================================================
   3. FIELD_ENTRIES — de 33 specifikationsfelter, én raekke pr. (robot, felt).
   ============================================================
   77 robotter x 33 felter = 2.541 raekker, uanset udfyldningsgrad — en
   "not_stated"-post er lige saa meget en raekke som en udfyldt. Det er
   praecis den regel, specifikationstaetheden (D7/L30) allerede regner med:
   naevneren er 33, fordi ALLE 33 felter altid skrives, ogsaa som
   not_stated. */
create table field_entries (
  robot_id            bigint not null references robots(id) on delete cascade,
  field_name          field_name_enum not null,
  form                field_form_enum not null,

  -- Tilstanden. Baade 'bare_state' (ren streng i YAML, R3) og
  -- 'state_with_provenance' (kort med vaerdi+kilde+hentet, skemaudvidelse 1)
  -- bruger denne kolonne. De to adskilles KUN af, om source er udfyldt.
  state               state_enum,

  -- Vaerdikolonnerne. Praecis én er udfyldt, afhaengigt af form — det er
  -- R4's "vaerdi ELLER min/maks, aldrig begge" skrevet som CHECK i stedet
  -- for at staa som en regel, en dataskriver kan glemme.
  value_number        numeric,
  minimum             numeric,
  maximum             numeric,
  value_text          text,
  value_bool          boolean,
  value_list          text[],

  unit                text,
  imperial_unit       text,
  imperial_value      numeric,
  operator            operator_enum,
  source              text,
  retrieved_at        date,
  source_type         source_type_enum,
  caveat              text,
  -- R20/L48/D14 (spor/d14data, opfoelgning spor/dbklasse): et forbehold
  -- ("caveat") kan baere en MASKINLAESBAR klasse — "gyldighed" (paavirker
  -- sammenligneligheden) eller "uddybning" (uddybende kontekst, intet tvivl
  -- om selve tallet). IKKE oversat til engelsk (briefets punkt 1 naevner
  -- ikke caveat_class blandt de opremsede datavaerdier, der skal
  -- oversaettes — en bevidst afgraensning, se fund/FUND-skema.md): kolonnen
  -- HEDDER engelsk (caveat_class), men INDHOLDET (de to vaerdier
  -- "gyldighed"/"uddybning") forbliver dansk indtil videre.
  --
  -- KOLONNETYPE: text + CHECK, ikke et nyt enum. De to gyldige vaerdier
  -- staar IKKE i tools/skema.mjs — de staar alene i tools/validate.mjs's
  -- ADVARSEL_KLASSER-saet. Et enum ville kraeve sin EGEN driftvagt for
  -- praecis to vaerdier, der sjaeldent aendrer sig. En CHECK holder samme
  -- haandhaevelse ved siden af selve kolonnen, uden det ekstra synk-punkt.
  caveat_class        text,
  -- CAVEAT_WORDING (spor/cjkui, 1. sep 2026, R21): soesterfeltet til
  -- "caveat". Samme JPK-krav og samme mekanik som robots.notes_wording
  -- ovenfor — producentens ordrette, ikke-danske kildeformulering; "caveat"
  -- selv baerer fra nu KUN den danske oversaettelse robot.mjs rent faktisk
  -- viser laeseren. Text, ikke jsonb: "caveat" selv er altid en bar streng
  -- (aldrig en liste).
  caveat_wording       text,
  note                text,
  raw                 text,           -- sjaeldent udfyldt, men et gyldigt POST_NOEGLER-felt (raa)
  currency            text,           -- sjaeldent udfyldt, samme grund

  -- LOAD_STATE/LOAD_VALUE/LOAD_UNIT (R10, "driftstid uden lastbetingelse er
  -- ikke et tal"). Kan selv vaere en tilstand ("not_stated") ELLER et
  -- masse-kort. To kolonner, samme XOR-moenster som ovenfor.
  load_state          state_enum,
  load_value          numeric,
  load_unit           text,

  -- COLLECTED_BY + CHANGE_REASON (punkt 3) — se robots' egen kommentar.
  collected_by        text,
  change_reason        text,

  primary key (robot_id, field_name),

  -- R2 (ukendt felt) haandhaeves allerede af field_name_enum: en vaerdi uden
  -- for de 33 kan slet ikke INSERTes. Samme for R3's gyldige tilstande.

  -- Formen bestemmer PRAeCIS hvilke vaerdikolonner maa vaere udfyldt.
  constraint field_entries_form_state check (
    (form in ('bare_state', 'state_with_provenance')) = (state is not null)
  ),
  constraint field_entries_form_number check (
    (form = 'number') = (value_number is not null)
  ),
  constraint field_entries_form_interval check (
    form <> 'interval' or (minimum is not null and maximum is not null)
  ),
  -- minimum/maximum er IKKE eksklusive for formen 'interval' alene. Den
  -- generiske min/maks-gren i validate.mjs's tjekFelt gaelder for ALLE
  -- ikke-tal-arter (fx Spot's stroem_ud skrevet som TEKST OG samtidig
  -- min:35/maks:58,8/enhed:V som et maaleligt sidespor ved siden af
  -- ordlyden — formscan 25. aug 2026, 1 forekomst ud af 1860 dengang).
  constraint field_entries_minmax_paired check (
    (minimum is null) = (maximum is null)
  ),
  constraint field_entries_minmax_only_on_these_forms check (
    minimum is null or form in ('interval', 'text', 'bool', 'list')
  ),
  constraint field_entries_form_text check (
    (form = 'text') = (value_text is not null)
  ),
  constraint field_entries_form_bool check (
    (form = 'bool') = (value_bool is not null)
  ),
  constraint field_entries_form_list check (
    (form = 'list') = (value_list is not null)
  ),
  constraint field_entries_text_not_blank check (
    form <> 'text' or btrim(value_text) <> ''
  ),
  -- OBS: array_length(tomt_array, 1) returnerer NULL i Postgres, ikke 0 —
  -- og "NULL > 0" er UKENDT, som en CHECK behandler som BESTAAET. cardinality()
  -- returnerer korrekt 0 for et tomt array, saa den bruges her i stedet.
  constraint field_entries_list_not_empty check (
    form <> 'list' or cardinality(value_list) > 0
  ),

  -- R5: et udfyldt talfelt (number ELLER interval) SKAL have enhed. At
  -- enheden ogsaa skal tilhoere feltets rette dimension (fx "kg" ikke paa
  -- et laengdefelt) kraever et opslag i field_definitions og haandhaeves
  -- derfor IKKE her, men i tools/validate.mjs.
  constraint field_entries_number_requires_unit check (
    (form not in ('number', 'interval') or unit is not null)
    and (minimum is null or unit is not null)
  ),

  -- R6 + R7 (kilde-URL og hentedato): PAAKRAEVET paa alt undtagen en BAR
  -- tilstand. Kun 'bare_state' slipper (R3 alene, ingen kilde kraevet af en
  -- ren "not_stated"-streng).
  constraint field_entries_source_required check (
    form = 'bare_state' or source is not null
  ),
  constraint field_entries_retrieved_at_required check (
    form = 'bare_state' or retrieved_at is not null
  ),
  -- R6: kilden skal vaere en http(s)-URL. Samme regex som tjekKilde i
  -- tools/validate.mjs (/^https?:\/\//).
  constraint field_entries_source_is_url check (
    source is null or source ~ '^https?://'
  ),

  -- R20/L48/D14: caveat_class er enten NULL (uklassificeret, lovligt) eller
  -- PRAeCIS én af de to tekster, validate.mjs's ADVARSEL_KLASSER kender.
  constraint field_entries_caveat_class_valid check (
    caveat_class is null or caveat_class in ('gyldighed', 'uddybning')
  ),
  -- R20's andet krav: en klasse klassificerer et forbehold — uden et
  -- forbehold er der intet at klassificere.
  constraint field_entries_caveat_class_requires_caveat check (
    caveat_class is null or (caveat is not null and btrim(caveat) <> '')
  ),

  -- R21 (spor/cjkui): samme to krav, samme facon, for caveat_wording.
  constraint field_entries_caveat_wording_not_blank check (
    caveat_wording is null or btrim(caveat_wording) <> ''
  ),
  constraint field_entries_caveat_wording_requires_caveat check (
    caveat_wording is null or (caveat is not null and btrim(caveat) <> '')
  ),

  -- ONLY_WITH_NUMBER (den del af R4, der gaelder tilstandsposter): en
  -- tilstand er ikke et tal og maa ikke baere enhed/operator/min/maks/
  -- imperial/raw/currency. Formen alene styrer dette allerede (dobbeltsikring).
  constraint field_entries_state_carries_no_number check (
    form not in ('bare_state', 'state_with_provenance')
    or (unit is null and operator is null and imperial_value is null
        and imperial_unit is null and raw is null and currency is null)
  ),

  -- R8: operatoren er allerede begraenset af operator_enum. raw staar kun
  -- paa et tal/interval semantisk (tjekRaa kaldes kun fra tjekTalfelt) —
  -- denne CHECK er STRENGERE end R11 (som blot tillader noeglen overalt).
  constraint field_entries_raw_only_on_number check (
    raw is null or form in ('number', 'interval')
  ),

  -- R9: metrisk/imperial staar sammen eller slet ikke.
  constraint field_entries_imperial_paired check (
    (imperial_value is null) = (imperial_unit is null)
  ),

  -- R10: load_* hoerer KUN til paa 'runtime', og runtime (naar den er et
  -- tal/interval) SKAL have en load-angivelse — enten en tilstand eller et
  -- masse-kort, aldrig begge.
  constraint field_entries_load_only_on_runtime check (
    (load_state is null and load_value is null)
    or field_name = 'runtime'
  ),
  constraint field_entries_runtime_requires_load check (
    field_name <> 'runtime' or form not in ('number', 'interval')
    or (load_state is not null or load_value is not null)
  ),
  constraint field_entries_load_xor check (
    load_state is null or load_value is null
  ),
  constraint field_entries_load_value_requires_unit check (
    load_value is null or load_unit is not null
  ),

  -- R13: IP-klassen skal ligne "IP65", "IPX4", "IP56K" (samme regex som
  -- tjekTekstfelt: /^IP[0-9X]{2}K?$/i). Kun relevant naar field_name er
  -- ip_rating OG formen er 'text'.
  constraint field_entries_ip_rating_form check (
    field_name <> 'ip_rating' or form <> 'text' or value_text ~* '^IP[0-9X]{2}K?$'
  )
);
create index field_entries_robot_id_idx on field_entries (robot_id);
create index field_entries_field_name_idx on field_entries (field_name);
comment on table field_entries is
  '77 x 33 = 2.541 raekker. form-kolonnen er R4 skrevet som CHECK: praecis én vaerdiform pr. raekke.';

/* ============================================================
   4. FIELD_ENTRY_VARIANTS — R15, "varianter:"-blokken paa et enkelt felt.
   ============================================================
   Go2's fire varianter er fire maskiner (nyttelasten falder 5 -> 2,5 kg hen
   over Lite3's fire kolonner) — se skema.mjs's kommentar ved R15. */
create table field_entry_variants (
  robot_id            bigint not null,
  field_name          field_name_enum not null,
  variant_name        text not null,
  value               jsonb not null,   -- scalar (tal, tekst ELLER bool) — jsonb bevarer typen uden gaetteri
  primary key (robot_id, field_name, variant_name),
  foreign key (robot_id, field_name) references field_entries (robot_id, field_name) on delete cascade,
  constraint field_entry_variants_value_is_scalar check (
    jsonb_typeof(value) in ('string', 'number', 'boolean')
  )
  -- R15's krav om, at variant_name skal staa i robottens EGEN "varianter:"-
  -- topnoegle (robots.variants), kraever et opslag paa TVAERS af tabeller —
  -- Postgres' CHECK tillader ikke subqueries mod andre raekker/tabeller, saa
  -- det haandhaeves IKKE her. Se tools/validate.mjs (R15).
);
-- INTET separat indeks paa (robot_id, field_name) her: primaernoeglen
-- (robot_id, field_name, variant_name) daekker allerede opslag paa de to
-- foerste kolonner som et PREFIX af sit eget btree-indeks.
comment on table field_entry_variants is 'R15: variantvaerdier paa et felt. Medlemsskabet af robots.variants haandhaeves i tools/validate.mjs, ikke i DB.';

/* ============================================================
   5. APPLICATIONS — producentens EGEN inddeling (R16), topnoegle, ikke felt.
   ============================================================
   Ligger uden for field_entries helt bevidst, ligesom i skema.mjs: anvendelse
   taeller IKKE i specifikationstaetheden (D7/L30's naevner er
   FELTNAVNE.length, og anvendelse staar ikke i FELTNAVNE). Fravaer af
   topnoeglen giver INGEN raekke her (ikke en NULL-raekke — fravaeret ER
   fravaeret, samme princip som images nedenfor). */
create table applications (
  robot_id            bigint primary key references robots(id) on delete cascade,
  is_bare_string      boolean not null default false,
  -- true, naar YAML'en skrev "anvendelse: not_stated" som ren tekst i
  -- stedet for et kort. R16 tillader begge, og db/eksporter.mjs skal kunne
  -- genskabe formen praecist, hvis den nogensinde bruges.
  is_not_stated       boolean not null,
  value               jsonb,     -- kategori(er): streng ELLER liste (ANVENDELSE_VAERDIER), null naar is_not_stated
  quote               jsonb,     -- ordret citat: streng ELLER liste, PAAKRAEVET naar ikke er is_not_stated (R16)
  -- QUOTE_WORDING (spor/cjkui, 1. sep 2026, R21): soesterfeltet til "quote",
  -- samme mekanik som robots.notes_wording/field_entries.caveat_wording —
  -- producentens ordrette, ikke-danske formulering. Foelger quote's EGEN
  -- form (streng ELLER liste). Staar "quote" som en liste, er
  -- "quote_wording" samme laengde liste, "" hvor det enkelte citat ikke
  -- havde en fremmedsproget ordlyd. Element-for-element-laengdeparring mod
  -- "quote" er IKKE en DB-CHECK — kun formen.
  quote_wording        jsonb,
  source              text,
  retrieved_at        date,
  source_type         source_type_enum,
  inherited_from_robot_id bigint references robots(id),  -- R17: moderens robot, IKKE robotten selv
  note                text,
  -- NOTE_WORDING (spor/cjkui, 1. sep 2026, R21): soesterfeltet til "note"
  -- (anvendelsens egen note, IKKE feltposternes) — samme mekanik.
  note_wording         text,

  -- COLLECTED_BY + CHANGE_REASON (punkt 3).
  collected_by        text,
  change_reason        text,

  constraint applications_not_inherited_from_self check (inherited_from_robot_id is distinct from robot_id),
  constraint applications_source_is_url check (source is null or source ~ '^https?://'),

  -- R16: is_not_stated maa ikke baere et citat eller en arv (tjekAnvendelse:
  -- "citat staar sammen med ikke_oplyst" / "arvet_fra staar sammen med
  -- ikke_oplyst" er begge FEJL).
  constraint applications_not_stated_has_no_quote check (
    not is_not_stated or quote is null
  ),
  constraint applications_not_stated_has_no_inheritance check (
    not is_not_stated or inherited_from_robot_id is null
  ),
  -- R16: er kategorien IKKE not_stated, er citatet paakraevet — "uden
  -- producentens eget ord er kategorien vores mening".
  constraint applications_quote_required check (
    is_not_stated or quote is not null
  ),
  constraint applications_value_form check (
    value is null or jsonb_typeof(value) in ('string', 'array')
  ),
  constraint applications_quote_form check (
    quote is null or jsonb_typeof(quote) in ('string', 'array')
  ),
  constraint applications_quote_wording_form check (
    quote_wording is null or jsonb_typeof(quote_wording) in ('string', 'array')
  ),
  constraint applications_note_wording_not_blank check (
    note_wording is null or btrim(note_wording) <> ''
  ),
  constraint applications_note_wording_requires_note check (
    note_wording is null or (note is not null and btrim(note) <> '')
  )
  -- Resten af R16 (er hver vaerdi i ANVENDELSE_VAERDIERs syv gyldige
  -- kategorier?) og HELE R17 (arv: har moderen selv en kategori? er den
  -- ikke selv en arv? er barnets kategorier en delmaengde af moderens? er
  -- citatet ordret moderens? er kilden moderens?) kraever at laese EN ANDEN
  -- raekke (moderrobotten) og kan derfor ikke vaere en CHECK.
  -- inherited_from_robot_id er en fremmednoegle, saa "peger arven paa en
  -- robot, der findes?" ER DB-haandhaevet — resten er ikke.
);
create index applications_inherited_from_idx on applications (inherited_from_robot_id);
comment on table applications is 'R16/R17. 0-1 raekke pr. robot. Fravaer af raekke = fravaer af topnoeglen i YAML.';

/* ============================================================
   6. IMAGES — R18, topnoegle, ikke felt (samme naevner-begrundelse).
   ============================================================
   Alle robotter med et billede stod pr. sidste maaling med origin =
   'manufacturer', hvilket er praecis SPAeRRING S1's problem historisk —
   ophaevet af JPK 26. aug 2026 (L37, CLAUDE.md), saa spaerringen haandhaeves
   ikke laengere i tools/build.mjs. */
create table images (
  robot_id            bigint primary key references robots(id) on delete cascade,
  file                text not null,      -- relativ til assets/, R18's stiregler haandhaeves IKKE i DB (kraever filsystemopslag)
  origin              origin_enum not null,
  source              text,
  retrieved_at        date,
  -- ALT: JSONB (L81 punkt 3), IKKE text. Spor/alt (1. sep 2026) indfoerte et
  -- sprogkort ({da: "...", en: "..."}), men db/skema.sql fulgte ikke med —
  -- migreringen skete direkte paa den levende database FOeR denne fil blev
  -- rettet (Å115, STATUS.md). Denne udgave skriver det, der ALLEREDE staar
  -- live, ikke en ny beslutning.
  alt                 jsonb,
  note                text,
  shared_with_robot_id bigint references robots(id), -- L28: to robotter kan dele samme fysiske fil
  plate               boolean,
  position             text,

  -- COLLECTED_BY + CHANGE_REASON (punkt 3).
  collected_by        text,
  change_reason        text,

  constraint images_file_not_blank check (btrim(file) <> ''),
  constraint images_not_shared_with_self check (shared_with_robot_id is distinct from robot_id),
  constraint images_source_is_url check (source is null or source ~ '^https?://'),

  -- R18: origin 'silhouette' og 'manufacturer' KRAeVER source (silhouette:
  -- maaltal skal kunne foelges; manufacturer: billedet skal kunne foelges
  -- til sin side). 'own_photo' maa staa uden — vi har taget det selv.
  constraint images_source_required_for_origin check (
    origin = 'own_photo' or source is not null
  ),
  -- "retrieved_at uden source daterer ingenting" (R18).
  constraint images_retrieved_at_requires_source check (
    retrieved_at is null or source is not null
  ),
  -- ALT: jsonb-objekt (sprogkort), samme formkrav som R18's oprindelige
  -- text-udgave havde som fri prosa — nu haandhaevet strukturelt.
  constraint images_alt_form check (
    alt is null or jsonb_typeof(alt) = 'object'
  )
  -- R18's regler om selve STIEN (ingen "..", ingen "\", ingen "media/",
  -- filen skal FINDES paa disk i assets/<mappe>/) er filsystemtjek og kan
  -- ikke vaere en SQL CHECK. De staar ved magt i tools/validate.mjs.
);
comment on table images is 'R18. 0-1 raekke pr. robot. SPAeRRING S1 er ophaevet af JPK 26. aug 2026 (L37) — ingen build-tidsblokering laengere.';
comment on column images.shared_with_robot_id is 'L28: to robotter kan dele samme fysiske fil.';

/* ============================================================
   7. CHANGE_LOG — fortrydelsesknappen (L81-L83, punkt 3)
   ============================================================
   Erstatter synk_aftryk-vagten (Å14), som kun beskyttede ÉN skrivevej
   (db/migrer.mjs --til-db, nu fjernet). change_log daekker ALLE skrivevejes
   fravaer: en raekke-trigger paa UPDATE/DELETE gemmer den GAMLE raekke som
   jsonb, sammen med hvem og hvorfor (collected_by/change_reason paa selve
   raekken, jf. de fem tabeller ovenfor) — en afvisning bliver en
   forespoergsel (find raekken i change_log, se hvad den var), ikke en gren
   (Å116's egen formulering for, hvad L81 taber og genopretter). */
create table change_log (
  id          bigint generated always as identity primary key,
  table_name  text not null,
  row_key     jsonb not null,      -- den aendrede raekkes primaernoegle(r), som et JSON-objekt
  operation   text not null check (operation in ('update', 'delete')),
  old_row     jsonb not null,      -- HELE den gamle raekke, foer aendringen
  changed_by  text,                -- fra collected_by (NEW ved UPDATE, OLD ved DELETE — se log_change())
  reason      text,                -- fra change_reason, samme regel
  changed_at  timestamptz not null default now()
);
create index change_log_table_name_idx on change_log (table_name);
create index change_log_changed_at_idx on change_log (changed_at);
comment on table change_log is 'L81 punkt 3: raekke-historik ved UPDATE/DELETE paa robots/field_entries/field_entry_variants/applications/images. Fyldt af trigger log_change() nedenfor.';

/** Generisk trigger-funktion: virker paa alle fem skrivbare tabeller uden
 *  fem separate kopier (samme D7/L30-princip som resten af projektet — én
 *  funktion, ikke fem, der kan skride fra hinanden). Noeglen bygges pr.
 *  tabel via TG_TABLE_NAME, fordi de fem tabeller har forskellige
 *  primaernoegler (robots: id · field_entries/applications/images: robot_id
 *  · field_entry_variants: robot_id+field_name+variant_name). */
create or replace function log_change() returns trigger as $$
declare
  v_key jsonb;
  v_changed_by text;
  v_reason text;
begin
  if TG_TABLE_NAME = 'robots' then
    v_key := jsonb_build_object('id', OLD.id);
  elsif TG_TABLE_NAME = 'field_entries' then
    v_key := jsonb_build_object('robot_id', OLD.robot_id, 'field_name', OLD.field_name);
  elsif TG_TABLE_NAME = 'field_entry_variants' then
    v_key := jsonb_build_object('robot_id', OLD.robot_id, 'field_name', OLD.field_name, 'variant_name', OLD.variant_name);
  elsif TG_TABLE_NAME = 'applications' then
    v_key := jsonb_build_object('robot_id', OLD.robot_id);
  elsif TG_TABLE_NAME = 'images' then
    v_key := jsonb_build_object('robot_id', OLD.robot_id);
  else
    v_key := '{}'::jsonb;
  end if;

  -- UPDATE: NEW.collected_by/change_reason er redaktoerens forklaring PAA
  -- DENNE aendring (saettes samtidig med selve aendringen). DELETE: intet
  -- NEW findes, saa OLD's sidst kendte vaerdier bruges som naermeste bud.
  if TG_OP = 'UPDATE' then
    v_changed_by := NEW.collected_by;
    v_reason := NEW.change_reason;
  else
    v_changed_by := OLD.collected_by;
    v_reason := OLD.change_reason;
  end if;

  insert into change_log (table_name, row_key, operation, old_row, changed_by, reason)
  values (TG_TABLE_NAME, v_key, lower(TG_OP), to_jsonb(OLD), v_changed_by, v_reason);

  return OLD;
end;
$$ language plpgsql security definer;

create trigger log_change_robots after update or delete on robots for each row execute function log_change();
create trigger log_change_field_entries after update or delete on field_entries for each row execute function log_change();
create trigger log_change_field_entry_variants after update or delete on field_entry_variants for each row execute function log_change();
create trigger log_change_applications after update or delete on applications for each row execute function log_change();
create trigger log_change_images after update or delete on images for each row execute function log_change();

commit;

/* ============================================================
   8. ROW LEVEL SECURITY — "basis", jf. opgavens afgraensning
   ============================================================
   Se filens toptekst. RLS slaas til paa alle syv tabeller UDEN nogen policy
   for anon/authenticated — Postgres' egen default, naar RLS er aktiveret
   uden en matchende policy, er at NAeGTE adgang for enhver rolle, der ikke
   er ejeren eller BYPASSRLS. service_role har altid BYPASSRLS i Supabase og
   er den eneste rolle, db/eksporter.mjs bruger (SUPABASE_SERVICE_ROLE_KEY,
   se db/LAESMIG.md) — noeglen maa ALDRIG bruges i en offentlig klient.

   Bevidst IKKE bygget her: en authenticated-policy til en fremtidig
   redigerings-UI, en anon-laese-policy (kataloget er stadig statisk HTML,
   genereret fra en database-eksport, ikke live fra DB), og enhver rolle ud
   over service_role. */
alter table field_definitions      enable row level security;
alter table robots                 enable row level security;
alter table field_entries          enable row level security;
alter table field_entry_variants   enable row level security;
alter table applications           enable row level security;
alter table images                 enable row level security;
alter table change_log             enable row level security;

-- Least privilege (security-privileges.md): PUBLIC-skemaets standardrettigheder
-- fjernes eksplicit, saa en fremtidig anon/authenticated-rolle ikke arver
-- adgang ved en fejl, den dag en policy tilfoejes.
revoke all on all tables in schema public from public;
revoke all on all tables in schema public from anon, authenticated;
