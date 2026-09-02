-- db/migrering-engelsk.sql — GENERERET af db/byg-migrering.mjs FRA db/ordbog.mjs.
-- IKKE til haandredigering: ret db/ordbog.mjs eller db/byg-migrering.mjs og
-- genkoer `node db/byg-migrering.mjs > db/migrering-engelsk.sql`.
--
-- L81-L83 (STATUS.md): databasen bliver engelsk. Denne fil omdoeber det, YAML-
-- vejen (db/migrer.mjs) aldrig fik lov at skrive et andet sted end sig selv —
-- se db/LAESMIG.md og db/tjek.mjs for hvordan den efterproeves. KOeRES AF
-- ORKESTRATOREN i ÉN apply_migration (transaktionel), IKKE af dette spor —
-- spor/skema har kun LAESEadgang til den levende database.
--
-- FOeR KOeRSEL: efterprøv raekketallet er 77 (select count(*) from robotter)
-- og at synk_aftryk's indhold ikke er tabt information nogen har brug for —
-- den var udelukkende --til-db's eget fingeraftryk (Å14), intet redaktionelt.
begin;

-- A. Datavaerdier oversat FOeR omdoebning (mens tabel-/kolonnenavne
--    stadig er danske).

-- A1. robotter.fremdrift: CHECK-begraensningen ("robotter_fremdrift_check",
--     laest raat af pg_constraint 2. sep 2026, IKKE gaettet ud fra navnekonvention)
--     forbyder de nye vaerdier og droppes derfor FOeR UPDATE — genskabt med de nye
--     vaerdier i sektion F1, EFTER omdoebningen.
alter table robotter drop constraint robotter_fremdrift_check;
update robotter set fremdrift = case fremdrift
  when 'ben' then 'legged'
  when 'ben_hjul' then 'legged_wheeled'
  else fremdrift end;

-- A2. robotter.producentland: ingen CHECK (fri tekst i praksis) — direkte UPDATE.
update robotter set producentland = case producentland
  when 'Kina' then 'China'
  when 'USA' then 'USA'
  when 'Schweiz' then 'Switzerland'
  when 'Indien' then 'India'
  when 'Sydkorea' then 'South Korea'
  when 'Polen' then 'Poland'
  when 'Tyskland' then 'Germany'
  when 'Spanien' then 'Spain'
  else producentland end;

-- A3. anvendelse.vaerdi: jsonb, enten en STRENG eller en LISTE af strenge (R16) —
--     formen bevares PRAECIST (en enkelt kategori bliver IKKE en 1-elements liste,
--     en flerelements liste beholder sin raekkefoelge via "with ordinality").
update anvendelse set vaerdi = case jsonb_typeof(vaerdi)
  when 'string' then to_jsonb(case vaerdi #>> '{}'
    when 'industri' then 'industrial'
    when 'inspektion' then 'inspection'
    when 'sikkerhed_overvaagning' then 'security_surveillance'
    when 'forskning_udvikling' then 'research_development'
    when 'forbruger_uddannelse' then 'consumer_education'
    when 'forsvar_beredskab' then 'defense_emergency_response'
    when 'logistik' then 'logistics'
    else vaerdi #>> '{}' end)
  when 'array' then (
    select jsonb_agg(to_jsonb(oversat) order by raekkefoelge)
    from (
      select raekkefoelge, case element
        when 'industri' then 'industrial'
        when 'inspektion' then 'inspection'
        when 'sikkerhed_overvaagning' then 'security_surveillance'
        when 'forskning_udvikling' then 'research_development'
        when 'forbruger_uddannelse' then 'consumer_education'
        when 'forsvar_beredskab' then 'defense_emergency_response'
        when 'logistik' then 'logistics'
        else element end as oversat
      from jsonb_array_elements_text(vaerdi) with ordinality as t(element, raekkefoelge)
    ) omregnet
  )
  else vaerdi end
where vaerdi is not null;

-- A4. feltdefinitioner.gruppe/art/dimension/ogsaa_dimension: ingen CHECK
--     (laest raat af pg_constraint 2. sep 2026: feltdefinitioner har KUN sin
--     primaernoegle — ingen drop/genskab noedvendig, i modsaetning til A1/A5).
--     Fundet 2. sep 2026 (orkestrator-review): denne tabel var glemt af den
--     foerste udgave af denne fil, selvom ordbogen (FELTGRUPPER/FELTARTER/
--     FELTDIMENSIONER) altid har defineret oversaettelsen — L82 gaelder ALT i
--     databasen, ogsaa feltdefinitionernes egne etiketter.
update feltdefinitioner set gruppe = case gruppe
  when 'fysik' then 'physics'
  when 'energi' then 'energy'
  when 'sensorik' then 'sensing'
  when 'nyttelast' then 'payload'
  when 'kommercielt' then 'commercial'
  when 'eu' then 'regulatory'
  else gruppe end;
update feltdefinitioner set art = case art
  when 'tal' then 'number'
  when 'jaNej' then 'yes_no'
  when 'tekst' then 'text'
  when 'liste' then 'list'
  when 'ip' then 'ip'
  else art end;
update feltdefinitioner set dimension = case dimension
  when 'masse' then 'mass'
  when 'laengde' then 'length'
  when 'antal' then 'count'
  when 'hastighed' then 'speed'
  when 'vinkel' then 'angle'
  when 'stigning' then 'grade'
  when 'temperatur' then 'temperature'
  when 'energi' then 'energy'
  when 'tid' then 'time'
  when 'valuta' then 'currency'
  else dimension end;
update feltdefinitioner set ogsaa_dimension = case ogsaa_dimension
  when 'masse' then 'mass'
  when 'laengde' then 'length'
  when 'antal' then 'count'
  when 'hastighed' then 'speed'
  when 'vinkel' then 'angle'
  when 'stigning' then 'grade'
  when 'temperatur' then 'temperature'
  when 'energi' then 'energy'
  when 'tid' then 'time'
  when 'valuta' then 'currency'
  else ogsaa_dimension end;

-- A5. feltposter.advarsel_klasse: CHECK-begraensningen ("feltposter_advarsel_klasse_gyldig",
--     laest raat af pg_constraint 2. sep 2026, IKKE gaettet) forbyder de nye
--     vaerdier og droppes derfor FOeR UPDATE — genskabt med de nye vaerdier i
--     sektion F5, EFTER omdoebningen (samme moenster som A1/F1).
--     feltposter_advarsel_klasse_kraever_advarsel roeres IKKE: den haardkoder
--     ingen af de to vaerdier, kun at kolonnen kraever et forbehold ved siden af.
alter table feltposter drop constraint feltposter_advarsel_klasse_gyldig;
update feltposter set advarsel_klasse = case advarsel_klasse
  when 'gyldighed' then 'validity'
  when 'uddybning' then 'elaboration'
  else advarsel_klasse end;

-- B. Enum-VAeRDIER omdoebt (mens enum-TYPEnavnene stadig er danske —
--    de to omdoebes uafhaengigt af hinanden). Identiske par (fx
--    feltform_enum.interval -> interval) er udeladt: RENAME VALUE til
--    samme navn fejler paa en duplikeret label.
alter type tilstand_enum rename value 'ikke_oplyst' to 'not_stated';
alter type tilstand_enum rename value 'nej' to 'no';
alter type tilstand_enum rename value 'kun_billede' to 'image_only';
alter type status_enum rename value 'i_produktion' to 'in_production';
alter type status_enum rename value 'annonceret' to 'announced';
alter type status_enum rename value 'udgaaet' to 'discontinued';
alter type kildetype_enum rename value 'primaer' to 'primary';
alter type kildetype_enum rename value 'sekundaer' to 'secondary';
alter type ophav_enum rename value 'eget_foto' to 'own_photo';
alter type ophav_enum rename value 'silhuet' to 'silhouette';
alter type ophav_enum rename value 'fabrikant' to 'manufacturer';
alter type feltform_enum rename value 'bare_tilstand' to 'bare_state';
alter type feltform_enum rename value 'tilstand_med_herkomst' to 'state_with_provenance';
alter type feltform_enum rename value 'tal' to 'number';
alter type feltform_enum rename value 'tekst' to 'text';
alter type feltform_enum rename value 'liste' to 'list';
alter type feltnavn_enum rename value 'egenvaegt' to 'weight';
alter type feltnavn_enum rename value 'laengde' to 'length';
alter type feltnavn_enum rename value 'bredde' to 'width';
alter type feltnavn_enum rename value 'hoejde' to 'height';
alter type feltnavn_enum rename value 'frihedsgrader' to 'degrees_of_freedom';
alter type feltnavn_enum rename value 'nyttelast_gaaende' to 'payload_walking';
alter type feltnavn_enum rename value 'nyttelast_staaende' to 'payload_standing';
alter type feltnavn_enum rename value 'hastighed' to 'speed';
alter type feltnavn_enum rename value 'haeldning' to 'slope';
alter type feltnavn_enum rename value 'forhindring_enkelt' to 'obstacle_single';
alter type feltnavn_enum rename value 'trappetrin_kontinuerlig' to 'stair_step_continuous';
alter type feltnavn_enum rename value 'ip_klasse' to 'ip_rating';
alter type feltnavn_enum rename value 'temp_min' to 'temperature_min';
alter type feltnavn_enum rename value 'temp_maks' to 'temperature_max';
alter type feltnavn_enum rename value 'batteri_wh' to 'battery_wh';
alter type feltnavn_enum rename value 'driftstid' to 'runtime';
alter type feltnavn_enum rename value 'ladetid' to 'charging_time';
alter type feltnavn_enum rename value 'dockingstation' to 'docking_station';
alter type feltnavn_enum rename value 'kameraer' to 'cameras';
alter type feltnavn_enum rename value 'sdk_sprog' to 'sdk_languages';
alter type feltnavn_enum rename value 'autonominiveau' to 'autonomy_level';
alter type feltnavn_enum rename value 'monteringsinterface' to 'mounting_interface';
alter type feltnavn_enum rename value 'stroem_ud' to 'power_output';
alter type feltnavn_enum rename value 'dataporte' to 'data_ports';
alter type feltnavn_enum rename value 'pris' to 'price';
alter type feltnavn_enum rename value 'ce_oplyst' to 'ce_disclosed';
alter type feltnavn_enum rename value 'fcc_oplyst' to 'fcc_disclosed';
alter type feltnavn_enum rename value 'ul_oplyst' to 'ul_disclosed';
alter type feltnavn_enum rename value 'ccc_oplyst' to 'ccc_disclosed';

-- C. Enum-TYPEnavne omdoebt. status_enum og operator_enum udelades: begge
--    navne er allerede engelske (identitet).
alter type tilstand_enum rename to state_enum;
alter type kildetype_enum rename to source_type_enum;
alter type ophav_enum rename to origin_enum;
alter type feltform_enum rename to field_form_enum;
alter type feltnavn_enum rename to field_name_enum;

-- D. Tabelnavne omdoebt.
alter table feltdefinitioner rename to field_definitions;
alter table robotter rename to robots;
alter table feltposter rename to field_entries;
alter table feltpost_varianter rename to field_entry_variants;
alter table anvendelse rename to applications;
alter table billede rename to images;

-- E. Kolonnenavne omdoebt, PAA DE NU-ENGELSKE TABELNAVNE (sektion D er koert).
--    Identiske par (id, slug, status, robot_id, form, operator, note, alt,
--    dimension) er udeladt — RENAME COLUMN til samme navn er en fejl, ikke et
--    no-op. Postgres opdaterer selv ALLE CHECK/FK-udtryk, der naevner en
--    omdoebt kolonne (attnum-baseret internt, ikke tekst) — INGEN af de 30+
--    navngivne constraints i skema.sql skal genskrives for selve omdoebningen.
alter table field_definitions rename column feltnavn to field_name;
alter table field_definitions rename column gruppe to field_group;
alter table field_definitions rename column art to kind;
alter table field_definitions rename column ogsaa_dimension to secondary_dimension;
alter table field_definitions rename column kraever_ved_last to requires_load_condition;
alter table field_definitions rename column d4_beroert to d4_affected;
alter table field_definitions rename column katalogfelt to catalog_field;
alter table field_definitions rename column filterfelt to filter_field;
alter table robots rename column navn to name;
alter table robots rename column producent to manufacturer;
alter table robots rename column producentland to manufacturer_country;
alter table robots rename column producentby to manufacturer_city;
alter table robots rename column fremdrift to locomotion;
alter table robots rename column foerste_udgivelse to first_released;
alter table robots rename column forgaenger_robot_id to predecessor_robot_id;
alter table robots rename column varianter to variants;
alter table robots rename column noter to notes;
alter table robots rename column noter_ordlyd to notes_wording;
alter table field_entries rename column feltnavn to field_name;
alter table field_entries rename column tilstand to state;
alter table field_entries rename column vaerdi_tal to value_number;
alter table field_entries rename column min to minimum;
alter table field_entries rename column maks to maximum;
alter table field_entries rename column vaerdi_tekst to value_text;
alter table field_entries rename column vaerdi_bool to value_bool;
alter table field_entries rename column vaerdi_liste to value_list;
alter table field_entries rename column enhed to unit;
alter table field_entries rename column enhed_imperial to imperial_unit;
alter table field_entries rename column vaerdi_imperial to imperial_value;
alter table field_entries rename column kilde to source;
alter table field_entries rename column hentet to retrieved_at;
alter table field_entries rename column kildetype to source_type;
alter table field_entries rename column advarsel to caveat;
alter table field_entries rename column advarsel_klasse to caveat_class;
alter table field_entries rename column advarsel_ordlyd to caveat_wording;
alter table field_entries rename column raa to raw;
alter table field_entries rename column valuta to currency;
alter table field_entries rename column ved_last_tilstand to load_state;
alter table field_entries rename column ved_last_vaerdi to load_value;
alter table field_entries rename column ved_last_enhed to load_unit;
alter table field_entry_variants rename column feltnavn to field_name;
alter table field_entry_variants rename column variant_navn to variant_name;
alter table field_entry_variants rename column vaerdi to value;
alter table applications rename column er_bar_streng to is_bare_string;
alter table applications rename column er_ikke_oplyst to is_not_stated;
alter table applications rename column vaerdi to value;
alter table applications rename column citat to quote;
alter table applications rename column citat_ordlyd to quote_wording;
alter table applications rename column kilde to source;
alter table applications rename column hentet to retrieved_at;
alter table applications rename column kildetype to source_type;
alter table applications rename column arvet_fra_robot_id to inherited_from_robot_id;
alter table applications rename column note_ordlyd to note_wording;
alter table images rename column fil to file;
alter table images rename column ophav to origin;
alter table images rename column kilde to source;
alter table images rename column hentet to retrieved_at;
alter table images rename column delt_med_robot_id to shared_with_robot_id;
alter table images rename column plade to plate;
alter table images rename column pos to position;

-- F. Strukturelle tilfoejelser fra punkt 3 (L81) — haandskrevet, ikke udledt
--    af en liste (der findes ingen anden liste, de kunne skride fra).

-- F1. robots.locomotion: CHECK genskabt med de NYE vaerdier (droppet i A1).
alter table robots add constraint robots_locomotion_check check (locomotion in ('legged', 'legged_wheeled'));

-- F2. collected_by + change_reason paa de skrivbare tabeller. IKKE paa
--     field_definitions — se filens toptekst for begrundelsen.
alter table robots add column if not exists collected_by text;
alter table robots add column if not exists change_reason text;
alter table field_entries add column if not exists collected_by text;
alter table field_entries add column if not exists change_reason text;
alter table field_entry_variants add column if not exists collected_by text;
alter table field_entry_variants add column if not exists change_reason text;
alter table applications add column if not exists collected_by text;
alter table applications add column if not exists change_reason text;
alter table images add column if not exists collected_by text;
alter table images add column if not exists change_reason text;

-- F3. change_log: fortrydelsesknappen OG haard begraensning 2s spor (Aa116).
--     Raekke-trigger ved UPDATE/DELETE gemmer den GAMLE raekke som jsonb,
--     sammen med hvem og hvorfor. NEW.collected_by/change_reason ved UPDATE
--     (redaktoerens forklaring paa DENNE aendring); OLD ved DELETE (intet NEW).
create table if not exists change_log (
  id bigint generated always as identity primary key,
  table_name text not null,
  row_key jsonb not null,
  operation text not null check (operation in ('update', 'delete')),
  old_row jsonb not null,
  changed_by text,
  reason text,
  changed_at timestamptz not null default now()
);

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

drop trigger if exists log_change_robots on robots;
create trigger log_change_robots after update or delete on robots for each row execute function log_change();
drop trigger if exists log_change_field_entries on field_entries;
create trigger log_change_field_entries after update or delete on field_entries for each row execute function log_change();
drop trigger if exists log_change_field_entry_variants on field_entry_variants;
create trigger log_change_field_entry_variants after update or delete on field_entry_variants for each row execute function log_change();
drop trigger if exists log_change_applications on applications;
create trigger log_change_applications after update or delete on applications for each row execute function log_change();
drop trigger if exists log_change_images on images;
create trigger log_change_images after update or delete on images for each row execute function log_change();

alter table change_log enable row level security;
revoke all on change_log from public;
revoke all on change_log from anon, authenticated;

-- F4. images.alt -> jsonb. ALLEREDE anvendt paa den levende database (Aa115,
--     STATUS.md: billede_alt_jsonb via apply_migration) — bekraeftet ved
--     laesning 2. sep 2026: information_schema siger jsonb, og CHECK hedder
--     "billede_alt_form". Vagtet begge veje, saa filen forbliver koerbar mod
--     BAADE en database, der fik rettelsen, og en, der ikke gjorde.
do $$
begin
  if (select data_type from information_schema.columns where table_name = 'images' and column_name = 'alt') = 'text' then
    alter table images alter column alt type jsonb using alt::jsonb;
  end if;
end $$;

do $$
begin
  if exists (select 1 from pg_constraint where conname = 'billede_alt_form') then
    alter table images rename constraint billede_alt_form to images_alt_form;
  elsif not exists (select 1 from pg_constraint where conname = 'images_alt_form') then
    alter table images add constraint images_alt_form check (alt is null or jsonb_typeof(alt) = 'object');
  end if;
end $$;

-- F5. field_entries.caveat_class: CHECK genskabt med de NYE vaerdier (droppet i A5).
alter table field_entries add constraint field_entries_caveat_class_valid check (caveat_class is null or caveat_class in ('validity', 'elaboration'));

-- G. synk_aftryk droppet (punkt 5) — vagtede en skrivevej (db/migrer.mjs),
--    der selv er fjernet. IF EXISTS: allerede fjernet er ikke en fejl.
drop table if exists synk_aftryk;

commit;
