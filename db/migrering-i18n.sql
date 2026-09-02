-- db/migrering-i18n.sql — ALTER-migrering af det LEVENDE Supabase-projekt
-- (spor/i18nfelt, 2. sep 2026, Å98 spor A). Samme princip som db/migrering-
-- cjk-ordlyd.sql (læs den fils toptekst for den fulde begrundelse for hvorfor
-- en ALTER-fil findes ved siden af db/skema.sql, som er skrevet, som om
-- kolonnerne altid har været der). Køres AF ORKESTRATOREN, ikke af dette
-- spor — spor/i18nfelt har kun LÆSEadgang til den levende DB (samme grænse
-- som spor/cjkui havde).
--
-- HVAD DEN GØR: føjer TRE NYE, NULLABLE søsterfelter til skemaet —
-- feltposter.advarsel_i18n, anvendelse.note_i18n, billede.note_i18n — plus
-- deres formkrav som CHECK-constraints (samme regler som R22 i tools/
-- validate.mjs håndhæver på YAML-siden, minus den del R22 alene kan dømme —
-- se hver kolonnes kommentar).
--
-- ANDET FORMÅL END migrering-cjk-ordlyd.sql's fire felter, selvom formen
-- ligner: _ordlyd/citat_ordlyd bevarer KILDENS EGEN (ikke-danske)
-- formulering; _i18n her er en OVERSÆTTELSE af den danske tekst til et
-- andet sprog ({en: "..."}). Derfor jsonb-typen 'object', ikke 'string'/
-- 'array' — sprogkort, ikke en parallel-liste.
--
-- SIMPLERE END migrering-fremdrift.sql, samme grund som migrering-cjk-
-- ordlyd.sql: de tre felter er VALGFRIE søsterfelter (0 forekomster i
-- data/robots/*.yaml i dag — dette spor bygger MEKANISMEN, det udfylder
-- intet, jf. BRIEF-i18nfelt.md: "Dette oversætter ingenting"), så de kan
-- tilføjes NULLABLE og forblive sådan. INGEN BACKFILL I DENNE FIL:
-- kolonnerne starter tomme efter ALTER og forbliver tomme, indtil et SENERE
-- spor lægger advarsel_i18n/note_i18n i data/robots/*.yaml OG opdaterer
-- db/migrer.mjs's FELTPOST_NOEGLER_KENDT (den fil er IKKE rørt af dette
-- spor — se rapportens "Nye fælder og opdagelser" for hvorfor det er en
-- forudsætning, ikke en selvfølge, før "node db/migrer.mjs --til-db" kan
-- bære de tre felter).
--
-- RÆKKEFØLGE: ADD COLUMN (nullable) før ADD CONSTRAINT, samme grund som de
-- to forrige migreringsfiler. Alle CHECK-constraints er "X IS NULL OR
-- <form>" — automatisk opfyldt af eksisterende (tomme) rækker, ingen
-- DO-blok-vagt af den art migrering-fremdrift.sql krævede.
--
-- IDEMPOTENT: hvert ADD COLUMN bruger IF NOT EXISTS, og hver ADD CONSTRAINT
-- er pakket i en DO-blok, der tjekker pg_constraint først — filen kan køres
-- to gange uden fejl, jf. CLAUDE.md's krav til en migrering.
--
-- FØR KØRSEL: efterprøvet af spor/i18nfelt via MCP execute_sql, 2. sep 2026:
-- rækketallet er 77 (SELECT count(*) FROM robotter), og INGEN af de tre
-- kolonner findes allerede (information_schema.columns gav 0 træffere på
-- advarsel_i18n/note_i18n i public-skemaet).

begin;

-- 1. feltposter.advarsel_i18n — søster til "advarsel" (feltniveau), men
--    ANDET FORMÅL end feltposter.advarsel_ordlyd (migrering-cjk-ordlyd.sql):
--    en OVERSÆTTELSE, ikke kildens egen formulering. Sprogkort, altid et
--    OBJEKT ({en: "..."}), aldrig en streng/liste — "advarsel" selv er
--    altid en bar streng, så der er intet parallel-liste-krav at bevare her.
alter table feltposter add column if not exists advarsel_i18n jsonb;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'feltposter_advarsel_i18n_form') then
    alter table feltposter add constraint feltposter_advarsel_i18n_form
      check (advarsel_i18n is null or jsonb_typeof(advarsel_i18n) = 'object');
  end if;
  if not exists (select 1 from pg_constraint where conname = 'feltposter_advarsel_i18n_kraever_advarsel') then
    alter table feltposter add constraint feltposter_advarsel_i18n_kraever_advarsel
      check (advarsel_i18n is null or (advarsel is not null and btrim(advarsel) <> ''));
  end if;
  -- R22's tredje krav: kildesproget "da" må ikke stå som nøgle i
  -- overbygningen — dansk bor i "advarsel" alene, ellers er der to steder at
  -- rette den samme danske tekst. Den `?`-operator tjekker jsonb-NØGLER,
  -- ikke -værdier.
  if not exists (select 1 from pg_constraint where conname = 'feltposter_advarsel_i18n_ikke_kildesprog') then
    alter table feltposter add constraint feltposter_advarsel_i18n_ikke_kildesprog
      check (advarsel_i18n is null or not (advarsel_i18n ? 'da'));
  end if;
end $$;

-- 2. anvendelse.note_i18n — søster til "note" (anvendelsens egen, IKKE
--    feltposternes). Samme tre krav som ovenfor.
alter table anvendelse add column if not exists note_i18n jsonb;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'anvendelse_note_i18n_form') then
    alter table anvendelse add constraint anvendelse_note_i18n_form
      check (note_i18n is null or jsonb_typeof(note_i18n) = 'object');
  end if;
  if not exists (select 1 from pg_constraint where conname = 'anvendelse_note_i18n_kraever_note') then
    alter table anvendelse add constraint anvendelse_note_i18n_kraever_note
      check (note_i18n is null or (note is not null and btrim(note) <> ''));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'anvendelse_note_i18n_ikke_kildesprog') then
    alter table anvendelse add constraint anvendelse_note_i18n_ikke_kildesprog
      check (note_i18n is null or not (note_i18n ? 'da'));
  end if;
end $$;

-- 3. billede.note_i18n — søster til billedets egen "note". Samme tre krav.
alter table billede add column if not exists note_i18n jsonb;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'billede_note_i18n_form') then
    alter table billede add constraint billede_note_i18n_form
      check (note_i18n is null or jsonb_typeof(note_i18n) = 'object');
  end if;
  if not exists (select 1 from pg_constraint where conname = 'billede_note_i18n_kraever_note') then
    alter table billede add constraint billede_note_i18n_kraever_note
      check (note_i18n is null or (note is not null and btrim(note) <> ''));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'billede_note_i18n_ikke_kildesprog') then
    alter table billede add constraint billede_note_i18n_ikke_kildesprog
      check (note_i18n is null or not (note_i18n ? 'da'));
  end if;
end $$;

-- Sikkerhedstjek: bekræft rækketallet er uændret af denne migrering (den
-- rører ingen eksisterende rækker, kun skemaet — men et forkert rækketal
-- her ville betyde, at ALTER-transaktionen af en anden grund ikke kørte mod
-- den database, orkestratoren troede den kørte mod).
do $$
declare
  total integer;
begin
  select count(*) into total from robotter;
  if total <> 77 then
    raise notice 'migrering-i18n: forventede 77 raekker (maalt af spor/i18nfelt, 2. sep 2026), fandt %. Skemaaendringen er stadig anvendt korrekt (den roerer ingen data) — men undersoeg om dette er den database, du troede.', total;
  end if;
end $$;

commit;

-- EFTER KØRSEL: de tre kolonner er tomme (NULL på alle 77 rækker) — og
-- FORBLIVER tomme efter "node db/migrer.mjs --til-db", MODSAT migrering-cjk-
-- ordlyd.sql's fire felter: den kommando læser fra data/robots/*.yaml, og
-- INGEN robotpost bærer endnu advarsel_i18n/note_i18n (dette spor bygger
-- kun mekanismen). De tre kolonner udfyldes først, den dag et senere
-- oversættelsesspor har lagt sprogtekst i YAML'en OG db/migrer.mjs's
-- FELTPOST_NOEGLER_KENDT (og migreringens anvendelse/billede-genopbygning,
-- linje ~296-330 i db/migrer.mjs) er opdateret til at kende de nye nøgler —
-- se rapportens "Nye fælder og opdagelser" for den fulde begrundelse.
