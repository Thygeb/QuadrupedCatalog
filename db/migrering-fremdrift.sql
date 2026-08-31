-- db/migrering-fremdrift.sql — ALTER-migrering af det LEVENDE Supabase-projekt
-- (spor/dbfelter, 31. aug 2026). Denne fil er IKKE en del af db/skema.sql —
-- skema.sql er skrevet, som om kolonnen altid har vaeret der (fundament-filen
-- for et TOMT projekt), mens denne fil er den ALTER-koreografi, der bringer
-- en DATABASE MED 77 EKSISTERENDE RAEKKER (kort fra --til-db, jf. db/LAESMIG.md)
-- op paa samme skema, uden at tabe data eller braekke en NOT NULL/CHECK paa
-- vejen. Koeres AF ORKESTRATOREN, ikke af dette spor — spor/dbfelter har
-- kun LAeSEadgang til den levende DB (se briefets egen graense).
--
-- RAEKKEFOELGEN ER PAAKRAeVET, IKKE VALGFRI: en NOT NULL-kolonne kan ikke
-- tilfoejes direkte til en tabel med eksisterende raekker (Postgres ville
-- kraeve en DEFAULT for at udfylde dem, og der findes ingen fornuftig
-- default for et identitetsfelt som fremdrift — "ben" for en hjulrobot ville
-- vaere en opfundet paastand, jf. CLAUDE.md begraensning 2). Vejen er derfor:
--   1. Tilfoej kolonnen NULLABLE.
--   2. Backfil alle 77 vaerdier fra data/robots/*.yaml (maalt 31. aug 2026,
--      spor/dbfelter — 53 ben / 24 ben_hjul, samme tal som formscannet i
--      CLAUDE.md).
--   3. Saet NOT NULL, naar (og kun naar) alle raekker har en vaerdi.
--   4. Tilfoej CHECK-begraensningen, der laaser de to gyldige vaerdier fast —
--      samme regel som db/skema.sql skriver for et NYT projekt, saa et
--      fremtidigt "SELECT * FROM information_schema" ikke kan skelne en
--      migreret database fra en frisk en.
--
-- FOeR KOeRSEL: efterprøv at raekketallet er 77 (SELECT count(*) FROM
-- robotter), og at INGEN raekke allerede har en fremdrift-kolonne (en
-- tidligere delvis koersel af denne fil ville goere trin 1 fejle med
-- "column already exists" — det er en SYNLIG fejl, ikke en tavs no-op, saa
-- den er ufarlig at forsoege igen).

begin;

-- 1. Tilfoej kolonnen NULLABLE. Ingen CHECK endnu — den ville ikke fejle paa
--    NULL-raekker (en CHECK er per definition NULL-tolerant i Postgres,
--    "NULL passerer" er UKENDT, ikke FALSK), men KRAEVES foerst efter
--    backfilden af klarhedshensyn: en constraint, der ligger foer sine data
--    findes, laeses forkert af den naeste, der aabner filen.
alter table robotter add column fremdrift text;

-- 2. Backfil alle 77 vaerdier, ÉN UPDATE, CASE paa slug (den FORRETNINGS-
--    MAESSIGE noegle, R14/skema.sql's egen begrundelse — ikke det interne
--    bigint-id, som ikke er stabilt paa tvaers af --til-db-koersler, jf.
--    LAESMIG.md's "Genkoerselsstrategi"). Vaerdierne er en RAA UDSKRIFT af
--    data/robots/*.yaml's fremdrift-felt (spor/dbfelter, 31. aug 2026) — ikke
--    udledt, ikke gaettet.
update robotter set fremdrift = case slug
    when 'addverb-trakr-20' then 'ben'
    when 'addverb-trakr-5' then 'ben'
    when 'anybotics-anymal' then 'ben'
    when 'anybotics-anymal-x' then 'ben'
    when 'astrall-dynamics-hypertron-t01' then 'ben'
    when 'bhairav-robotics-shvana' then 'ben'
    when 'boston-dynamics-spot' then 'ben'
    when 'cvte-maxhub-x7' then 'ben'
    when 'deep-robotics-lite3' then 'ben'
    when 'deep-robotics-lynx-m20' then 'ben_hjul'
    when 'deep-robotics-lynx-m20-pro' then 'ben_hjul'
    when 'deep-robotics-lynx-m20s' then 'ben_hjul'
    when 'deep-robotics-lynx-s10' then 'ben'
    when 'deep-robotics-mini' then 'ben'
    when 'deep-robotics-x20' then 'ben'
    when 'deep-robotics-x30' then 'ben'
    when 'deep-robotics-x30-pro' then 'ben'
    when 'galileo-c1' then 'ben'
    when 'galileo-c1-w' then 'ben_hjul'
    when 'galileo-e1' then 'ben'
    when 'galileo-e1-w' then 'ben_hjul'
    when 'galileo-s1' then 'ben'
    when 'galileo-s1-w' then 'ben_hjul'
    when 'genisom-gangben-l1' then 'ben'
    when 'genisom-gangben-l1-w' then 'ben_hjul'
    when 'genisom-gangben-l2' then 'ben'
    when 'genisom-gangben-l2-w' then 'ben_hjul'
    when 'genisom-gangben-l2-w-ultra' then 'ben_hjul'
    when 'genisom-qiuqiu-sp1' then 'ben_hjul'
    when 'genisom-tongchui-m1' then 'ben_hjul'
    when 'genisom-tongchui-m1-pro' then 'ben_hjul'
    when 'genisom-tongchui-m1-ultra' then 'ben_hjul'
    when 'ghost-robotics-spirit-40' then 'ben'
    when 'ghost-robotics-vision-60' then 'ben'
    when 'keybotic-keyper' then 'ben'
    when 'mab-honey-badger-4' then 'ben'
    when 'mab-honey-badger-5' then 'ben'
    when 'magiclab-magicdog-edu' then 'ben'
    when 'magiclab-magicdog-pro' then 'ben'
    when 'magiclab-magicdog-w' then 'ben_hjul'
    when 'magiclab-magicdog-y1' then 'ben'
    when 'microrobotech-movenew-p1' then 'ben_hjul'
    when 'microrobotech-movenew-t1' then 'ben_hjul'
    when 'neura-quadruped' then 'ben'
    when 'pudu-d5' then 'ben'
    when 'pudu-d5-w' then 'ben_hjul'
    when 'rainbow-robotics-rbq-10' then 'ben'
    when 'raion-robotics-raibo2' then 'ben'
    when 'rivr-one' then 'ben_hjul'
    when 'unitree-a1' then 'ben'
    when 'unitree-a2' then 'ben'
    when 'unitree-a2-w' then 'ben_hjul'
    when 'unitree-aliengo' then 'ben'
    when 'unitree-as2' then 'ben'
    when 'unitree-as2-w' then 'ben_hjul'
    when 'unitree-b1' then 'ben'
    when 'unitree-b2' then 'ben'
    when 'unitree-b2-w' then 'ben_hjul'
    when 'unitree-go1' then 'ben'
    when 'unitree-go2' then 'ben'
    when 'unitree-go2-w' then 'ben_hjul'
    when 'unitree-laikago' then 'ben'
    when 'weilan-alphadog-c500' then 'ben'
    when 'weilan-alphadog-c501' then 'ben'
    when 'weilan-alphadog-e300' then 'ben'
    when 'weilan-alphadog-e400l' then 'ben'
    when 'weilan-babyalpha' then 'ben'
    when 'xiaomi-cyberdog-1' then 'ben'
    when 'xiaomi-cyberdog-2' then 'ben'
    when 'yobotics-e-dog' then 'ben'
    when 'yobotics-y10' then 'ben'
    when 'yobotics-y20' then 'ben'
    when 'yuejia-yj30' then 'ben'
    when 'yuejia-yj30-max' then 'ben'
    when 'yuejia-yj30-max-w' then 'ben_hjul'
    when 'yuejia-yj30-w' then 'ben_hjul'
    when 'yufan-lingmao-cyvet' then 'ben'
  end;

-- Sikkerhedstjek: fejl HOEJLYDT, hvis backfilden ikke ramte praecis 77
-- raekker, eller hvis en raekke stadig staar NULL — en tavs "0 rows updated"
-- (fx fordi slug-tabellen er blevet redigeret i Studio siden 31. aug 2026,
-- eller migreringen koeres mod et andet robotantal) skal IKKE glide videre
-- til NOT NULL-trinnet, hvor Postgres' egen fejlmeddelelse ("column contains
-- null values") er langt sværere at spore tilbage til aarsagen.
do $$
declare
  mangler integer;
  total integer;
begin
  select count(*) into total from robotter;
  select count(*) into mangler from robotter where fremdrift is null;
  if mangler > 0 then
    raise exception 'migrering-fremdrift: % af % raekker har stadig fremdrift = NULL efter backfilden — sammenlign robotter.slug mod data/robots/*.yaml foer du fortsaetter.', mangler, total;
  end if;
  if total <> 77 then
    raise notice 'migrering-fremdrift: forventede 77 raekker (maalt i data/robots/ 31. aug 2026), fandt %. Backfilden daekkede alle KENDTE slugs — undersoeg om der er kommet nye robotter til siden.', total;
  end if;
end $$;

-- 3. NOT NULL, naar alle 77 raekker har en vaerdi (sikret af DO-blokken ovenfor).
alter table robotter alter column fremdrift set not null;

-- 4. CHECK — samme to vaerdier og samme begrundelse (text + CHECK, ikke et
--    nyt enum) som db/skema.sql's kolonnedefinition. Bevidst et NAVNGIVET
--    constraint (ikke en inline CHECK i kolonnedefinitionen, som ALTER TABLE
--    ADD COLUMN ikke tillader i ét trin sammen med NOT NULL paa en
--    eksisterende tabel) — navnet foelger Postgres' egen autogenererede
--    konvention (<tabel>_<kolonne>_check), saa et fremtidigt \d robotter
--    ser ud, som om kolonnen altid har vaeret der.
alter table robotter add constraint robotter_fremdrift_check check (fremdrift in ('ben', 'ben_hjul'));

commit;

-- EFTER KOeRSEL: synk ogsaa de 45 foerste_udgivelse-vaerdier (spor/datafelter,
-- ikke en del af DENNE migrering, men samme "identitetsfelt udvidet i YAML,
-- ikke i DB endnu"-tilstand). db/LAESMIG.md dokumenterer INGEN saerskilt
-- ALTER for foerste_udgivelse — kolonnen (`foerste_udgivelse integer`,
-- db/skema.sql linje ~179) har staaet der siden fundamentet, nullable, uden
-- CHECK, saa de 45 nye vaerdier kraever INGEN skemaaendring, kun et gencyk
-- af selve dataindlaesningen:
--
--   node db/migrer.mjs --til-db
--
-- Denne kommando gaar via db/migrer.mjs's egen vagt (L35, db/LAESMIG.md
-- "Vagten: --til-db naegter at overskrive Studio-redigeringer") — den
-- laeser databasens NUVAeRENDE indhold via db/eksporter.mjs's fraDb() (samme
-- kodevej som --fra-db) og sammenligner det med data/robots/ via
-- db/rundtur.mjs's dybtLig, FOeR den toemmer og genindlaeser. Er databasen
-- IKKE redigeret i Studio siden sidste migrering, fortsaetter den og
-- genindlaeser ALLE seks tabeller (inklusive fremdrift, naar denne fils
-- ALTER er koert foerst) — det er samme "toem-og-genindlaes"-vej, foerste_
-- udgivelse ELLERS ville have brugt, dokumenteret i db/LAESMIG.md's afsnit
-- "Genkoerselsstrategi: toem-og-genindlaes, ikke upsert". Bekraeftet at den
-- vej baerer foerste_udgivelse: db/migrer.mjs:306-307 (kanonisk form fra
-- YAML) og db/migrer.mjs:786 (POST-kroppen til robotter-tabellen) skriver
-- begge doc.foerste_udgivelse / r.foerste_udgivelse ubetinget, uden noget
-- feltnavn-filter der kunne udelukke det.
