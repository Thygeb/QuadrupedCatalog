-- db/migrering-cjk-ordlyd.sql — ALTER-migrering af det LEVENDE Supabase-projekt
-- (spor/cjkui, 1. sep 2026). Samme princip som db/migrering-fremdrift.sql
-- (læs den fils toptekst for den fulde begrundelse for hvorfor en ALTER-fil
-- findes ved siden af db/skema.sql, som er skrevet, som om kolonnerne altid
-- har været der). Køres AF ORKESTRATOREN, ikke af dette spor — spor/cjkui
-- har kun LÆSEadgang til den levende DB (samme grænse som spor/dbfelter havde).
--
-- HVAD DEN GØR: føjer FIRE NYE, NULLABLE søsterfelter til skemaet —
-- robotter.noter_ordlyd, feltposter.advarsel_ordlyd, anvendelse.citat_ordlyd,
-- anvendelse.note_ordlyd — plus deres formkrav som CHECK-constraints
-- (samme regler som R21 i tools/validate.mjs håndhæver på YAML-siden).
--
-- SIMPLERE END migrering-fremdrift.sql, OG DET ER BEVIDST: fremdrift var et
-- PÅKRÆVET identitetsfelt (NOT NULL), som derfor krævede rækkefølgen
-- "tilføj NULLABLE -> backfil ALLE 77 værdier -> SET NOT NULL -> CHECK", fordi
-- Postgres ikke tillader en NOT NULL-kolonne på en tabel med eksisterende
-- rækker uden at udfylde dem først. De fire felter her er derimod VALGFRIE
-- søsterfelter (kun 456 af de mulige poster har rent faktisk en fremmedsproget
-- ordlyd at bevare, jf. dfef6a8's commit-besked) — de kan tilføjes NULLABLE
-- og forblive sådan. INGEN BACKFILL I DENNE FIL: kolonnerne starter tomme
-- efter ALTER, og den NÆSTE almindelige "node db/migrer.mjs --til-db"
-- (tøm-og-genindlæs, jf. db/LAESMIG.md's "Genkørselsstrategi") udfylder dem
-- automatisk fra data/robots/*.yaml, samme vej som alle andre felter — der er
-- ingen særskilt backfill-koreografi at skrive.
--
-- RÆKKEFØLGE: ADD COLUMN (nullable) før ADD CONSTRAINT, ligesom fremdrift-
-- filen — en CHECK, der ligger før sin kolonne findes, er ikke meningsfuld.
-- Alle fire CHECK-constraints er "X IS NULL OR <form>" — de er derfor
-- AUTOMATISK opfyldt af eksisterende (tomme) rækker, uden en DO-blok-vagt af
-- den art migrering-fremdrift.sql krævede (den vagt var nødvendig DÉR, fordi
-- NOT NULL kunne fejle på en ufuldstændig backfill; her er der intet NOT
-- NULL-trin, og dermed intet at vagte).
--
-- IDEMPOTENT: hvert ADD COLUMN bruger IF NOT EXISTS, og hver ADD CONSTRAINT
-- er pakket i en DO-blok, der tjekker pg_constraint først (Postgres har selv
-- intet "ADD CONSTRAINT IF NOT EXISTS") — filen kan køres to gange uden fejl,
-- jf. CLAUDE.md's krav til en migrering.
--
-- FØR KØRSEL: efterprøv at rækketallet er 77 (SELECT count(*) FROM
-- robotter — målt af spor/cjkui via MCP execute_sql, 1. sep 2026, uændret
-- siden migrering-fremdrift.sql), og at INGEN af de fire kolonner allerede
-- findes (målt: information_schema.columns viste 0 træffere på
-- noter_ordlyd/advarsel_ordlyd/citat_ordlyd/note_ordlyd, samme kørsel).

begin;

-- 1. robotter.noter_ordlyd — søster til "noter". ALTID et array (aldrig en
--    bar streng, modsat "noter" selv — se R21 i tools/validate.mjs).
alter table robotter add column if not exists noter_ordlyd jsonb;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'robotter_noter_ordlyd_form') then
    alter table robotter add constraint robotter_noter_ordlyd_form
      check (noter_ordlyd is null or jsonb_typeof(noter_ordlyd) = 'array');
  end if;
end $$;

-- 2. feltposter.advarsel_ordlyd — søster til "advarsel" (feltniveau).
alter table feltposter add column if not exists advarsel_ordlyd text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'feltposter_advarsel_ordlyd_ikke_tom') then
    alter table feltposter add constraint feltposter_advarsel_ordlyd_ikke_tom
      check (advarsel_ordlyd is null or btrim(advarsel_ordlyd) <> '');
  end if;
  if not exists (select 1 from pg_constraint where conname = 'feltposter_advarsel_ordlyd_kraever_advarsel') then
    alter table feltposter add constraint feltposter_advarsel_ordlyd_kraever_advarsel
      check (advarsel_ordlyd is null or (advarsel is not null and btrim(advarsel) <> ''));
  end if;
end $$;

-- 3. anvendelse.citat_ordlyd — søster til "citat" (anvendelsens egen, IKKE
--    en feltpost). Følger citat's egen form: streng ELLER array.
alter table anvendelse add column if not exists citat_ordlyd jsonb;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'anvendelse_citat_ordlyd_form') then
    alter table anvendelse add constraint anvendelse_citat_ordlyd_form
      check (citat_ordlyd is null or jsonb_typeof(citat_ordlyd) in ('string', 'array'));
  end if;
end $$;

-- 4. anvendelse.note_ordlyd — søster til "note" (anvendelsens egen).
alter table anvendelse add column if not exists note_ordlyd text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'anvendelse_note_ordlyd_ikke_tom') then
    alter table anvendelse add constraint anvendelse_note_ordlyd_ikke_tom
      check (note_ordlyd is null or btrim(note_ordlyd) <> '');
  end if;
  if not exists (select 1 from pg_constraint where conname = 'anvendelse_note_ordlyd_kraever_note') then
    alter table anvendelse add constraint anvendelse_note_ordlyd_kraever_note
      check (note_ordlyd is null or (note is not null and btrim(note) <> ''));
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
    raise notice 'migrering-cjk-ordlyd: forventede 77 raekker (maalt af spor/cjkui, 1. sep 2026), fandt %. Skemaaendringen er stadig anvendt korrekt (den roerer ingen data) — men undersoeg om dette er den database, du troede.', total;
  end if;
end $$;

commit;

-- EFTER KØRSEL: de fire kolonner er tomme (NULL på alle 77 rækker), indtil
-- den næste fulde migrering køres:
--
--   node db/migrer.mjs --til-db
--
-- Denne kommando går via db/migrer.mjs's egen vagt (L35/Å14, db/LAESMIG.md
-- "Vagten: --til-db nægter at overskrive Studio-redigeringer") og udfører
-- derefter et almindeligt tøm-og-genindlæs af alle seks tabeller — de fire
-- nye kolonner udfyldes i samme ombæring som resten af hver rækkes felter,
-- fra data/robots/*.yaml's *_ordlyd-nøgler (456 poster i dag, jf.
-- dfef6a8's commit-besked: 309 advarsel_ordlyd, 90+5 anvendelse.citat_ordlyd,
-- 22 anvendelse.note_ordlyd, 30 noter_ordlyd). Ingen særskilt kommando er
-- nødvendig ud over den, der allerede køres efter enhver YAML-ændring.
