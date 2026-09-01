-- db/skema.sql — Postgres/Supabase-DDL for L34 (STATUS.md), redaktionslaget
--
-- FUNDAMENT, IKKE LIVE: der findes intet Supabase-projekt endnu (25. aug 2026).
-- Denne fil er skrevet, så JPK kan lime den ind i Supabase' SQL-editor, når
-- projektet oprettes. Indtil da er den efterprøvet lokalt af db/rundtur.mjs
-- via en offline model af de samme regler (se den fils kommentarer).
--
-- SANDHEDSKILDEN ER tools/skema.mjs, IKKE denne fil. Enum-værdierne herunder
-- (feltnavn_enum især) er en ØJEBLIKSAFLÆSNING af FELTNAVNE, taget 25. aug
-- 2026 (30 felter, se fund/FUND-db1.md's formscan). Postgres kan ikke læse en
-- ekstern .mjs-fil ved CREATE TYPE-tid, så listen er skrevet i hånden ÉN gang
-- her og skal udvides mekanisk (ALTER TYPE ... ADD VALUE), hvis skema.mjs
-- ændrer sig. db/migrer.mjs sammenligner sin egen kopi af listen mod
-- skema.mjs's FELTNAVNE ved hver kørsel og fejler højlydt ved uoverensstemmelse
-- — se FELTNAVN_ENUM_I_SKEMA_SQL i den fil. Det er den mekaniske håndhævelse af,
-- at de to ikke må skride fra hinanden (samme fælde som D7/L30: to lister,
-- ét broekstreg).
--
-- SPROG I NAVNGIVNINGEN: tabel- og kolonnenavne er de SAMME danske ord som
-- tools/skema.mjs bruger (egenvaegt, nyttelast_gaaende, ...), ikke oversat til
-- engelsk. Migrer/eksporter-scripterne bliver dermed en næsten bogstavelig
-- oversættelse mellem YAML-nøgle og DB-værdi i stedet for endnu et sted, de to
-- navne kan divergere.
--
-- IDENTIFIKATORER: alle tabel- og kolonnenavne er lowercase snake_case uden
-- store bogstaver, så de aldrig kræver anførselstegn i en forespørgsel
-- (Supabase-skillen "supabase-postgres-best-practices", reference
-- schema-lowercase-identifiers.md — "unquoted lowercase identifiers are
-- portable and tool-friendly"). Danske bogstaver æøå bruges IKKE i
-- identifikatorer af samme grund som i data/robots/-filnavne: "ae/oe/aa" er
-- den transskription, hele projektet allerede bruger.
--
-- PRIMÆRNØGLE: Supabase-skillens reference schema-primary-keys.md anbefaler
-- "bigint identity" for en enkelt database (ikke UUID v4 — det fragmenterer
-- indekset ved indsættelse) og nævner slet ikke naturlige nøgler/slugs som
-- alternativ. Opgavebrevet kræver omvendt "slug er nøgle". De to forliges
-- her: `id bigint generated always as identity` er den TEKNISKE primærnøgle
-- (det, fremmednøgler peger på — hurtige joins, ingen tekstsammenligning),
-- og `slug` står som `UNIQUE NOT NULL` ved siden af og er den FORRETNINGSMÆSSIGE
-- nøgle, som R14 (slug = filnavn) og hele YAML-kæden allerede kender. Ingen af
-- de to erstatter den anden.
--
-- FREMMEDNØGLER: hver eneste FK-kolonne herunder har sit eget indeks
-- (schema-foreign-key-indexes.md — Postgres opretter IKKE automatisk et
-- indeks på en FK-kolonne, og uden det bliver JOIN og CASCADE-sletning en
-- fuld tabelscanning).
--
-- RLS: se bunden af filen. Supabase-skillens reference security-privileges.md
-- ("grant only the minimum permissions required") og security-rls-basics.md
-- er fulgt, men TILPASSET: dette er IKKE et multi-tenant-system med
-- brugerdata (RLS-basics' eksempler handler alle om at adskille bruger A's
-- rækker fra bruger B's). Supabase er her redaktørens eget redskab (L34) —
-- siden bygges stadig fra data/robots/*.yaml, ikke fra databasen direkte.
-- Der er derfor INGEN anon/authenticated-policy: RLS slås til uden nogen
-- policy, hvilket er Postgres' egen default-luk-alt, og kun service_role
-- (som altid omgår RLS) kan læse og skrive. Det er "basis", auth og
-- finere RLS-politikker er bevidst ikke bygget — se db/LAESMIG.md.

begin;

/* ============================================================
   0. ENUM-TYPER
   ============================================================ */

-- De TRE tilstande, en feltpost kan skrive som ren tekst (TILSTANDE i
-- skema.mjs). "0" er IKKE et fjerde medlem her — det er en almindelig
-- talpost med vaerdi_tal = 0 og sin egen kilde (skema.mjs's egen kommentar:
-- "0 er den fjerde og er IKKE en streng ... kan ikke skrives som en
-- sentinel"). De fire tilstande — ikke_oplyst, nej, 0, kun_billede — kan
-- derfor ALDRIG kollapse i dette skema: de tre første er lukkede enum-
-- værdier, og 0 kan kun opstå som form='tal', vaerdi_tal=0 — en helt
-- anden kolonne end tilstand-enum'en. De to kan strukturelt ikke blandes.
create type tilstand_enum as enum ('ikke_oplyst', 'nej', 'kun_billede');

-- Robottens markedsstatus (STATUS_VAERDIER). 'demonstrator' har 0
-- forekomster i de 62 filer i dag (formscan, 25. aug 2026), men står i
-- skema.mjs og skal kunne bruges — LimX W1-sagen i D9 er præcis grunden.
create type status_enum as enum ('i_produktion', 'annonceret', 'udgaaet', 'demonstrator');

-- Kildens art (R6/tjekKilde). 'primaer' har 0 eksplicitte forekomster i
-- data i dag (fraværet AF kildetype betyder implicit primær - se R6: feltet
-- er valgfrit), men står som gyldig værdi og skal kunne skrives eksplicit.
create type kildetype_enum as enum ('primaer', 'sekundaer');

-- De seks operatorer, R8 tillader (OPERATORER i yaml.mjs/validate.mjs).
create type operator_enum as enum ('>', '>=', '<', '<=', '~', '±');

-- Billedets ophav (BILLEDE_OPHAV). 'fabrikant' er den, SPÆRRING S1 dækker —
-- se kommentaren ved billede.ophav nedenfor.
create type ophav_enum as enum ('eget_foto', 'silhuet', 'fabrikant');

-- FORM — den afgørende diskriminator for en feltpost. Ikke en del af
-- skema.mjs (som ikke behøver den — JS kan bare kigge på hvilke nøgler et
-- objekt har), men den mekaniske formscan af alle 62 filer (25. aug 2026,
-- fund/FUND-db1.md) fandt PRÆCIS syv former, og de summer til alle 1860
-- feltposter (62 robotter x 30 felter) uden rest:
--   899 bare_tilstand           — feltet er en ren tekststreng: "ikke_oplyst"
--   111 tilstand_med_herkomst   — { vaerdi: <tilstand>, kilde, hentet, ... }
--   556 tal                     — { vaerdi: <tal>, enhed, kilde, hentet, ... }
--    48 interval                — { min, maks, enhed, kilde, hentet, ... }
--   167 tekst                   — { vaerdi: <tekst>, kilde, hentet, ... }
--    43 bool                    — { vaerdi: true/false, kilde, hentet, ... }
--    36 liste                   — { vaerdi: [tekst, ...], kilde, hentet, ... }
-- Formen er det, der gør R4 ("vaerdi ELLER min/maks, aldrig begge, aldrig
-- ingen") til en CHECK i stedet for applikationslogik: en række har PRÆCIS
-- én form, og CHECK-reglerne nedenfor tillader kun de kolonner, formen siger.
create type feltform_enum as enum (
  'bare_tilstand', 'tilstand_med_herkomst', 'tal', 'interval', 'tekst', 'bool', 'liste'
);

-- De 30 feltnavne, skema.mjs's FELTNAVNE havde 25. aug 2026 (NAEVNER, jf.
-- L30/L32 i STATUS.md — nævneren udledes i koden af FELTNAVNE.length og må
-- ALDRIG skrives som et tal andre steder end her og i db/migrer.mjs's
-- driftvagt mod skema.mjs. Se filens toptekst for hvordan de to holdes i sync).
create type feltnavn_enum as enum (
  'egenvaegt', 'laengde', 'bredde', 'hoejde', 'frihedsgrader',
  'nyttelast_gaaende', 'nyttelast_staaende', 'hastighed', 'haeldning',
  'forhindring_enkelt', 'trappetrin_kontinuerlig', 'ip_klasse', 'temp_min', 'temp_maks',
  'batteri_wh', 'driftstid', 'hot_swap', 'ladetid', 'dockingstation',
  'lidar', 'kameraer', 'compute', 'ros2', 'sdk_sprog', 'autonominiveau',
  'monteringsinterface', 'stroem_ud', 'dataporte',
  'pris',
  'ce_oplyst'
);

/* ============================================================
   1. FELTDEFINITIONER — udledt af skema.mjs's FELTER, ikke opfundet.
   ============================================================
   db/migrer.mjs fylder denne tabel FRA tools/skema.mjs's FELTER-objekt ved
   hver kørsel (TRUNCATE + genindsæt) — det er den mekaniske håndhævelse af
   "databaseskemaet skal udledes af skemaet, ikke opfindes". Tabellen bruges
   ikke af CHECK-constraints (Postgres CHECK kan ikke slå op i en anden
   tabel), men er den maskinlæsbare kopi af FELTER, som en redigerings-UI
   eller et review-script kan læse UDEN at importere JavaScript. */
create table feltdefinitioner (
  feltnavn            feltnavn_enum primary key,
  gruppe              text not null,               -- 'fysik' | 'energi' | ... (GRUPPER)
  art                 text not null,                -- 'tal' | 'jaNej' | 'tekst' | 'liste' | 'ip'
  dimension           text,                         -- spec.type, fx 'masse', 'laengde' — null for ikke-tal-arter
  ogsaa_dimension     text,                         -- spec.ogsaaType, fx haeldning: 'stigning'
  kraever_ved_last    boolean not null default false,
  d4_beroert          boolean not null default false, -- spec.d4 — beroert af det aabne spoergsmaal D4
  katalogfelt         boolean not null default false, -- staar i KATALOG_FELTER
  filterfelt          boolean not null default false  -- staar i FILTER_FELTER
);
comment on table feltdefinitioner is
  'Spejl af tools/skema.mjs FELTER, genskrevet af db/migrer.mjs ved hver koersel. Ikke haandskrevet.';

/* ============================================================
   2. ROBOTTER — identiteten (IDENTITET_PAAKRAEVET / IDENTITET_VALGFRI)
   ============================================================ */
create table robotter (
  id                  bigint generated always as identity primary key,
  slug                text not null unique,
  navn                text not null,
  producent           text not null,
  -- PRODUCENTFELTER BOR PAA ROBOTPOSTEN, IKKE I EN EGEN producenter-TABEL.
  -- Det er IKKE en afvigelse fra i dag: tools/build.mjs udleder selv
  -- "producenter" af robotternes eget producent-felt (en Map over
  -- r.producent), fordi data/manufacturers/ er tom. En separat
  -- producent-tabel ville kraeve en beslutning om, HVORDAN producenter
  -- normaliseres (samme navn stavet forskelligt to steder?), som ingen af
  -- de 62 filer i dag tester, og som L34's opgave ikke bad om at loese.
  -- Bliver data/manufacturers/ nogensinde levende, er det en ny beslutning
  -- med sit eget nummer i STATUS.md, ikke noget der glider ind her.
  producentland       text not null,
  producentby         text,                          -- IDENTITET_VALGFRI, 46/62 udfyldt (formscan)
  status              status_enum not null,
  -- FREMDRIFT (spor/dbfelter, 31. aug 2026): nyt PAAKRAEVET identitetsfelt
  -- (IDENTITET_PAAKRAEVET, tools/validate.mjs:67 — "ben" | "ben_hjul",
  -- FREMDRIFT_VAERDIER paa tools/validate.mjs:99). text + CHECK, IKKE et nyt
  -- enum: samme begrundelse som feltposter.advarsel_klasse ovenfor (§3) —
  -- to lukkede vaerdier, der staar UDEN for tools/skema.mjs's FELTNAVNE (saa
  -- de udloeser ikke den mekaniske FELTNAVN_ENUM_I_SKEMA_SQL-driftvagt), og
  -- en CHECK kraever ingen ALTER TYPE ... ADD VALUE-koreografi, hvis en
  -- tredje fremdriftsform nogensinde tilfoejes. Udfyldt 77/77 i dag: 53 ben
  -- / 24 ben_hjul (formscan, spor/datafelter).
  fremdrift           text not null check (fremdrift in ('ben', 'ben_hjul')),
  foerste_udgivelse   integer,                        -- IDENTITET_VALGFRI, kun et aarstal (45/77 i dag, maalt 31. aug 2026 — var 3/62 ved skrivning)
  forgaenger_robot_id bigint references robotter(id), -- IDENTITET_VALGFRI "forgaenger:", 1/62 i dag
  varianter           text[],                          -- IDENTITET_VALGFRI topnoegle, liste af variantnavne (R15), 7/62
  noter               jsonb,                           -- streng ELLER liste af strenge (noterListe=59, noterString=0 i dag,
                                                         -- men skal kunne vaere begge — se R1's noter-tjek). jsonb bevarer
                                                         -- den PRAECISE form (streng vs. 1-elements liste er IKKE det samme
                                                         -- for rundturstesten), saa formen roeres ikke som tal/enhed gaettes.
  -- NOTER_ORDLYD (spor/cjkui, 1. sep 2026, R21): soesterfeltet til "noter".
  -- JPK: "UI SKAL VAERE REN FOR kinesiske tegn" — producentens ordrette,
  -- ikke-danske formulering flytter hertil fra "noter", som fra nu KUN
  -- baerer den danske oversaettelse (robot.mjs' noterBlok() renderer den
  -- ordret). ALTID en liste, ALDRIG en bar streng (modsat "noter" selv) —
  -- en PARALLEL liste, samme laengde og raekkefoelge som "noter", "" hvor
  -- den enkelte note ikke havde en fremmedsproget ordlyd (tools/validate.mjs's
  -- R21). Den praecise laengde-parring haandhaeves IKKE her (samme afgraensning
  -- som R15/feltpost_varianter ovenfor — kraever et element-for-element-tjek,
  -- CHECK kan ikke sammenligne to jsonb-arrays elementvis uden en funktion) —
  -- kun formen (skal vaere et array) er en DB-CHECK.
  noter_ordlyd        jsonb,
  constraint robotter_forgaenger_ikke_selv check (forgaenger_robot_id is distinct from id),
  constraint robotter_noter_form check (noter is null or jsonb_typeof(noter) in ('string', 'array')),
  constraint robotter_noter_ordlyd_form check (noter_ordlyd is null or jsonb_typeof(noter_ordlyd) = 'array')
);
create index robotter_forgaenger_idx on robotter (forgaenger_robot_id);
create index robotter_producent_idx on robotter (producent);
comment on table robotter is 'Én raekke pr. data/robots/<slug>.yaml. R1: identitetsfelter er NOT NULL, ukendte topnoegler er strukturelt umulige (rigidt kolonnesaet).';
comment on column robotter.slug is 'R14: slug = filnavn. Forretningsnoeglen, som YAML-kaeden bruger. id er den tekniske FK-maalnoegle.';

/* ============================================================
   3. FELTPOSTER — de 30 specifikationsfelter, én raekke pr. (robot, felt).
   ============================================================
   62 robotter x 30 felter = 1860 raekker, uanset udfyldningsgrad — en
   "ikke_oplyst"-post er lige saa meget en raekke som en udfyldt. Det er
   praecis den regel, specifikationstaetheden (D7/L30) allerede regner med:
   naevneren er 30, fordi ALLE 30 felter altid skrives, ogsaa som ikke_oplyst. */
create table feltposter (
  robot_id            bigint not null references robotter(id) on delete cascade,
  feltnavn            feltnavn_enum not null,
  form                feltform_enum not null,

  -- Tilstanden. Baade 'bare_tilstand' (ren streng i YAML, R3) og
  -- 'tilstand_med_herkomst' (kort med vaerdi+kilde+hentet, skemaudvidelse 1)
  -- bruger denne kolonne. De to adskilles KUN af, om kilde er udfyldt.
  tilstand            tilstand_enum,

  -- Vaerdikolonnerne. Praecis én er udfyldt, afhaengigt af form — det er
  -- R4's "vaerdi ELLER min/maks, aldrig begge" skrevet som CHECK i stedet
  -- for at staa som en regel, en dataskriver kan glemme.
  vaerdi_tal          numeric,
  min                 numeric,
  maks                numeric,
  vaerdi_tekst        text,
  vaerdi_bool         boolean,
  vaerdi_liste        text[],

  enhed               text,
  enhed_imperial      text,
  vaerdi_imperial     numeric,
  operator            operator_enum,
  kilde               text,
  hentet              date,
  kildetype           kildetype_enum,
  advarsel            text,
  -- R20/L48/D14 (spor/d14data, opfoelgning spor/dbklasse): et forbehold
  -- ("advarsel") kan baere en MASKINLAESBAR klasse — "gyldighed" (paavirker
  -- sammenligneligheden) eller "uddybning" (uddybende kontekst, intet tvivl
  -- om selve tallet). 562 af 890 forbehold er klassificeret af et menneske,
  -- post for post (fund/FUND-d14-klassifikation.md); de resterende 328 er
  -- BEVIDST uklassificerede (CLAUDE.md begraensning 6: ingen redaktionel dom
  -- uden offentliggjort metode) — kolonnen er derfor NULLABLE, IKKE NOT NULL.
  --
  -- KOLONNETYPE: text + CHECK, ikke et nyt enum (advarsel_klasse_enum).
  -- Begrundelse (skema-data-types.md tillader begge: "Enums: use text with
  -- check constraint or create enum type"): de to gyldige vaerdier staar
  -- IKKE i tools/skema.mjs (som feltnavn_enum goer, jf. toptekstens
  -- driftvagt-forklaring) — de staar alene i tools/validate.mjs's
  -- ADVARSEL_KLASSER-saet. Et enum ville kraeve sin EGEN driftvagt
  -- (endnu et sted, to lister kan skride fra hinanden, D7/L30-faelden) for
  -- praecis to vaerdier, der sjaeldent aendrer sig. En CHECK holder samme
  -- haandhaevelse ved siden af selve kolonnen, uden det ekstra synk-punkt,
  -- og uden ALTER TYPE ... ADD VALUE-koreografien, hvis en tredje klasse
  -- nogensinde tilfoejes.
  advarsel_klasse     text,
  -- ADVARSEL_ORDLYD (spor/cjkui, 1. sep 2026, R21): soesterfeltet til
  -- "advarsel". Samme JPK-krav og samme mekanik som robotter.noter_ordlyd
  -- ovenfor — producentens ordrette, ikke-danske kildeformulering, flyttet
  -- ud af "advarsel" (som fra nu kun baerer den danske oversaettelse robot.mjs
  -- rent faktisk viser laeseren). Text, ikke jsonb: "advarsel" selv er altid
  -- en bar streng (aldrig en liste), saa der er ingen parallel-liste-form at
  -- bevare her, i modsaetning til noter/citat.
  advarsel_ordlyd     text,
  note                text,
  raa                 text,           -- 0 forekomster i dag (formscan), men et gyldigt POST_NOEGLER-felt
  valuta              text,           -- 0 forekomster i dag, samme grund

  -- ved_last (R10, "driftstid uden lastbetingelse er ikke et tal"). Kan
  -- selv vaere en tilstand ("ikke_oplyst") ELLER et masse-kort. To
  -- kolonner, samme XOR-moenster som ovenfor.
  ved_last_tilstand   tilstand_enum,
  ved_last_vaerdi     numeric,
  ved_last_enhed      text,

  primary key (robot_id, feltnavn),

  -- R2 (ukendt felt) haandhaeves allerede af feltnavn_enum: en vaerdi uden
  -- for de 30 kan slet ikke INSERTes. Samme for R3's gyldige tilstande.

  -- Formen bestemmer PRAECIS hvilke vaerdikolonner maa vaere udfyldt.
  constraint feltposter_form_tilstand check (
    (form in ('bare_tilstand', 'tilstand_med_herkomst')) = (tilstand is not null)
  ),
  constraint feltposter_form_tal check (
    (form = 'tal') = (vaerdi_tal is not null)
  ),
  constraint feltposter_form_interval check (
    form <> 'interval' or (min is not null and maks is not null)
  ),
  -- min/maks er IKKE eksklusive for formen 'interval' alene. Den generiske
  -- min/maks-gren i validate.mjs's tjekFelt gaelder for ALLE ikke-tal-arter
  -- (koden naevner selv eksemplet): Boston Dynamics' Spot skriver stroem_ud
  -- som TEKST ("ureguleret DC 35-58,8 V, 150 W pr. port") OG samtidig
  -- min:35/maks:58,8/enhed:V som et maaleligt sidespor ved siden af
  -- ordlyden. Det er IKKE en opfundet udvidelse — formscan (25. aug 2026)
  -- fandt netop denne ÉNE post (ud af 1860) med begge dele paa samme raekke.
  constraint feltposter_min_maks_parvis check (
    (min is null) = (maks is null)
  ),
  constraint feltposter_min_maks_kun_paa_disse_former check (
    min is null or form in ('interval', 'tekst', 'bool', 'liste')
  ),
  constraint feltposter_form_tekst check (
    (form = 'tekst') = (vaerdi_tekst is not null)
  ),
  constraint feltposter_form_bool check (
    (form = 'bool') = (vaerdi_bool is not null)
  ),
  constraint feltposter_form_liste check (
    (form = 'liste') = (vaerdi_liste is not null)
  ),
  constraint feltposter_tekst_ikke_tom check (
    form <> 'tekst' or btrim(vaerdi_tekst) <> ''
  ),
  -- OBS: array_length(tomt_array, 1) returnerer NULL i Postgres, ikke 0 —
  -- og "NULL > 0" er UKENDT, som en CHECK behandler som BESTAAET. Det ville
  -- lade en tom "vaerdi: []" liste passere ustraffet, stik imod R4 ("listen
  -- er tom"). cardinality() returnerer korrekt 0 for et tomt array, saa den
  -- bruges her i stedet.
  constraint feltposter_liste_ikke_tom check (
    form <> 'liste' or cardinality(vaerdi_liste) > 0
  ),

  -- R5: et udfyldt talfelt (tal ELLER interval) SKAL have enhed. At enheden
  -- ogsaa skal tilhoere feltets rette dimension (fx "kg" ikke paa et
  -- laengdefelt) kraever et opslag i feltdefinitioner og haandhaeves derfor
  -- IKKE her, men i db/migrer.mjs og tools/validate.mjs — se fund/FUND-db1.md.
  constraint feltposter_tal_kraever_enhed check (
    (form not in ('tal', 'interval') or enhed is not null)
    and (min is null or enhed is not null)
  ),

  -- R6 + R7 (kilde-URL og hentedato): PAAKRAEVET paa alt undtagen en BAR
  -- tilstand. Det er den bogstavelige gengivelse af, at validate.mjs kalder
  -- tjekKilde/tjekHentet ubetinget for tal/interval/tekst/bool/liste OG for
  -- tilstand_med_herkomst — kun 'bare_tilstand' slipper (R3 alene, ingen
  -- kilde kraevet af en ren "ikke_oplyst"-streng).
  constraint feltposter_kilde_paakraevet check (
    form = 'bare_tilstand' or kilde is not null
  ),
  constraint feltposter_hentet_paakraevet check (
    form = 'bare_tilstand' or hentet is not null
  ),
  -- R6: kilden skal vaere en http(s)-URL. Samme regex som tjekKilde i
  -- tools/validate.mjs (/^https?:\/\//).
  constraint feltposter_kilde_er_url check (
    kilde is null or kilde ~ '^https?://'
  ),

  -- R20/L48/D14: advarsel_klasse er enten NULL (uklassificeret, lovligt —
  -- se kolonnens egen kommentar ovenfor) eller PRAECIS én af de to tekster,
  -- validate.mjs's ADVARSEL_KLASSER kender. Samme grov haandhaevelse som
  -- validatorens tjekAdvarselKlasse, skrevet som CHECK i stedet for kun at
  -- staa som applikationslogik.
  constraint feltposter_advarsel_klasse_gyldig check (
    advarsel_klasse is null or advarsel_klasse in ('gyldighed', 'uddybning')
  ),
  -- R20's andet krav: en klasse klassificerer et forbehold — uden et
  -- forbehold er der intet at klassificere. Samme regel som validatorens
  -- tjekAdvarselKlasse ("advarsel_klasse staar uden advarsel"), gjort til
  -- en DB-CHECK saa en fremtidig Studio-redigering ikke kan skabe det
  -- samme ugyldige par uden om YAML-vejen.
  constraint feltposter_advarsel_klasse_kraever_advarsel check (
    advarsel_klasse is null or (advarsel is not null and btrim(advarsel) <> '')
  ),

  -- R21 (spor/cjkui): samme to krav, samme facon, for advarsel_ordlyd —
  -- ikke-tom tekst, og kan ikke staa uden det forbehold, det er en ordlyd TIL.
  constraint feltposter_advarsel_ordlyd_ikke_tom check (
    advarsel_ordlyd is null or btrim(advarsel_ordlyd) <> ''
  ),
  constraint feltposter_advarsel_ordlyd_kraever_advarsel check (
    advarsel_ordlyd is null or (advarsel is not null and btrim(advarsel) <> '')
  ),

  -- KUN_MED_TAL (den del af R4, der gaelder tilstandsposter): en tilstand
  -- er ikke et tal og maa ikke baere enhed/operator/min/maks/imperial/raa/
  -- valuta. Formen alene styrer dette allerede (feltposter_form_tal m.fl.
  -- tvinger de kolonner til null, naar form ikke er 'tal'/'interval') —
  -- denne constraint er en dobbeltsikring, der navngiver reglen eksplicit.
  constraint feltposter_tilstand_baerer_intet_tal check (
    form not in ('bare_tilstand', 'tilstand_med_herkomst')
    or (enhed is null and operator is null and vaerdi_imperial is null
        and enhed_imperial is null and raa is null and valuta is null)
  ),

  -- R8: operatoren er allerede begraenset af operator_enum. raa staar kun
  -- paa et tal/interval semantisk (tjekRaa kaldes kun fra tjekTalfelt) —
  -- denne CHECK er STRENGERE end R11 (som blot tillader noeglen overalt) og
  -- er et bevidst DB-tilfoejet praecisionskrav, ikke en 1:1-oversaettelse af
  -- en eksisterende regel. Se fund/FUND-db1.md's selv-review.
  constraint feltposter_raa_kun_paa_tal check (
    raa is null or form in ('tal', 'interval')
  ),

  -- R9: metrisk/imperial staar sammen eller slet ikke. tjekImperial fejler i
  -- praksis, hvis kun én af de to er sat (se skema.sql's toptekst-analyse af
  -- koden) — her er kravet gjort eksplicit og symmetrisk.
  constraint feltposter_imperial_par check (
    (vaerdi_imperial is null) = (enhed_imperial is null)
  ),

  -- R10: ved_last hoerer KUN til paa driftstid, og driftstid (naar den er
  -- et tal/interval) SKAL have en ved_last-angivelse — enten en tilstand
  -- eller et masse-kort, aldrig begge.
  constraint feltposter_ved_last_kun_paa_driftstid check (
    (ved_last_tilstand is null and ved_last_vaerdi is null)
    or feltnavn = 'driftstid'
  ),
  constraint feltposter_driftstid_kraever_ved_last check (
    feltnavn <> 'driftstid' or form not in ('tal', 'interval')
    or (ved_last_tilstand is not null or ved_last_vaerdi is not null)
  ),
  constraint feltposter_ved_last_xor check (
    ved_last_tilstand is null or ved_last_vaerdi is null
  ),
  constraint feltposter_ved_last_vaerdi_kraever_enhed check (
    ved_last_vaerdi is null or ved_last_enhed is not null
  ),

  -- R13: IP-klassen skal ligne "IP65", "IPX4", "IP56K" (samme regex som
  -- tjekTekstfelt: /^IP[0-9X]{2}K?$/i). Kun relevant naar feltnavn er
  -- ip_klasse OG formen er 'tekst' — begge dele staar i samme CHECK, fordi
  -- Postgres ikke kan slaa "ip_klasse har art ip" op i feltdefinitioner her.
  constraint feltposter_ip_klasse_form check (
    feltnavn <> 'ip_klasse' or form <> 'tekst' or vaerdi_tekst ~* '^IP[0-9X]{2}K?$'
  )
);
create index feltposter_robot_id_idx on feltposter (robot_id);
create index feltposter_feltnavn_idx on feltposter (feltnavn);
comment on table feltposter is
  '62 x 30 = 1860 raekker. form-kolonnen er R4 skrevet som CHECK: praecis én vaerdiform pr. raekke.';

/* ============================================================
   4. FELTPOST-VARIANTER — R15, "varianter:"-blokken paa et enkelt felt.
   ============================================================
   Go2's fire varianter er fire maskiner (nyttelasten falder 5 -> 2,5 kg hen
   over Lite3's fire kolonner) — se skema.mjs's kommentar ved R15. */
create table feltpost_varianter (
  robot_id            bigint not null,
  feltnavn            feltnavn_enum not null,
  variant_navn        text not null,
  vaerdi              jsonb not null,   -- scalar (tal, tekst ELLER bool) — jsonb bevarer typen uden gaetteri
  primary key (robot_id, feltnavn, variant_navn),
  foreign key (robot_id, feltnavn) references feltposter (robot_id, feltnavn) on delete cascade,
  constraint feltpost_varianter_vaerdi_er_skalar check (
    jsonb_typeof(vaerdi) in ('string', 'number', 'boolean')
  )
  -- R15's krav om, at variant_navn skal staa i robottens EGEN "varianter:"-
  -- topnoegle (robotter.varianter), kraever et opslag paa TVAERS af
  -- tabeller — Postgres' CHECK tillader ikke subqueries mod andre raekker
  -- eller tabeller, saa det haandhaeves IKKE her. Se fund/FUND-db1.md's
  -- regeltabel (R15) og db/migrer.mjs, som validerer det foer INSERT.
);
-- INTET separat indeks paa (robot_id, feltnavn) her: praimaernoeglen
-- (robot_id, feltnavn, variant_navn) daekker allerede opslag paa de to
-- foerste kolonner som et PREFIX af sit eget btree-indeks (Postgres kan
-- bruge et indeks' foerste N kolonner uden en fuld match) — et ekstra
-- indeks ville vaere rent vedligeholdelsesarbejde uden gevinst.
comment on table feltpost_varianter is 'R15: variantvaerdier paa et felt. Medlemsskabet af robotter.varianter haandhaeves ved migrering, ikke i DB.';

/* ============================================================
   5. ANVENDELSE — producentens EGEN inddeling (R16), topnoegle, ikke felt.
   ============================================================
   Ligger uden for feltposter helt bevidst, ligesom i skema.mjs: anvendelse
   taeller IKKE i specifikationstaetheden (D7/L30's naevner er FELTNAVNE.length,
   og anvendelse staar ikke i FELTNAVNE). 61/62 robotter har topnoeglen i dag
   (formscan) — én robot har den slet ikke, og den robot har derfor INGEN
   raekke her (ikke en NULL-raekke — fravaeret ER fravaeret, samme princip
   som billede nedenfor). */
create table anvendelse (
  robot_id            bigint primary key references robotter(id) on delete cascade,
  er_bar_streng       boolean not null default false,
  -- true, naar YAML'en skrev "anvendelse: ikke_oplyst" som ren tekst i
  -- stedet for et kort. 0/62 i dag (formscan: anvendelseTilstand=0, alle 61
  -- er kort-formen), men R16 tillader begge, og rundturen skal kunne
  -- genskabe formen praecist, hvis den nogensinde bruges.
  er_ikke_oplyst      boolean not null,
  vaerdi              jsonb,     -- kategori(er): streng ELLER liste (ANVENDELSE_VAERDIER), null naar ikke_oplyst
  citat               jsonb,     -- ordret citat: streng ELLER liste, PAAKRAEVET naar ikke er_ikke_oplyst (R16)
  -- CITAT_ORDLYD (spor/cjkui, 1. sep 2026, R21): soesterfeltet til "citat",
  -- samme mekanik som robotter.noter_ordlyd/feltposter.advarsel_ordlyd —
  -- producentens ordrette, ikke-danske formulering, flyttet ud af "citat"
  -- (som fra nu kun baerer den danske oversaettelse). Foelger citat's EGEN
  -- form (streng ELLER liste, samme jsonb-begrundelse) — staar "citat" som en
  -- liste, er "citat_ordlyd" samme laengde liste, "" hvor det enkelte citat
  -- ikke havde en fremmedsproget ordlyd. Element-for-element-laengdeparring
  -- mod "citat" er IKKE en DB-CHECK, samme afgraensning som noter_ordlyd
  -- ovenfor — kun formen.
  citat_ordlyd        jsonb,
  kilde               text,
  hentet              date,
  kildetype           kildetype_enum,
  arvet_fra_robot_id  bigint references robotter(id),  -- R17: moderens robot, IKKE robotten selv
  note                text,
  -- NOTE_ORDLYD (spor/cjkui, 1. sep 2026, R21): soesterfeltet til "note"
  -- (anvendelsens egen note, IKKE feltposternes) — samme mekanik og samme
  -- begrundelse som ovenfor.
  note_ordlyd         text,

  constraint anvendelse_ikke_arv_af_sig_selv check (arvet_fra_robot_id is distinct from robot_id),
  constraint anvendelse_kilde_er_url check (kilde is null or kilde ~ '^https?://'),

  -- R16: ikke_oplyst maa ikke baere et citat eller en arv (tjekAnvendelse:
  -- "citat staar sammen med ikke_oplyst" / "arvet_fra staar sammen med
  -- ikke_oplyst" er begge FEJL).
  constraint anvendelse_ikke_oplyst_uden_citat check (
    not er_ikke_oplyst or citat is null
  ),
  constraint anvendelse_ikke_oplyst_uden_arv check (
    not er_ikke_oplyst or arvet_fra_robot_id is null
  ),
  -- R16: er kategorien IKKE ikke_oplyst, er citatet paakraevet — "uden
  -- producentens eget ord er kategorien vores mening".
  constraint anvendelse_citat_paakraevet check (
    er_ikke_oplyst or citat is not null
  ),
  constraint anvendelse_vaerdi_form check (
    vaerdi is null or jsonb_typeof(vaerdi) in ('string', 'array')
  ),
  constraint anvendelse_citat_form check (
    citat is null or jsonb_typeof(citat) in ('string', 'array')
  ),
  -- R21 (spor/cjkui): citat_ordlyd foelger citat's egen form (streng ELLER
  -- liste) — samme constraint-facon som citat selv.
  constraint anvendelse_citat_ordlyd_form check (
    citat_ordlyd is null or jsonb_typeof(citat_ordlyd) in ('string', 'array')
  ),
  -- R21: note_ordlyd er ikke-tom tekst og kan ikke staa uden den note, den
  -- er en ordlyd til — samme to krav som feltposter_advarsel_ordlyd_* ovenfor.
  constraint anvendelse_note_ordlyd_ikke_tom check (
    note_ordlyd is null or btrim(note_ordlyd) <> ''
  ),
  constraint anvendelse_note_ordlyd_kraever_note check (
    note_ordlyd is null or (note is not null and btrim(note) <> '')
  )
  -- Resten af R16 (er hver vaerdi i ANVENDELSE_VAERDIERs syv gyldige
  -- kategorier?) og HELE R17 (arv: har moderen selv en kategori? er den
  -- ikke selv en arv? er barnets kategorier en delmaengde af moderens? er
  -- citatet ordret moderens? er kilden moderens?) kraever at laese EN ANDEN
  -- raekke (moderrobotten) og kan derfor ikke vaere en CHECK. arvet_fra_robot_id
  -- er en fremmednoegle, saa "peger arven paa en robot, der findes?" ER
  -- DB-haandhaevet — resten er ikke. Se fund/FUND-db1.md.
);
create index anvendelse_arvet_fra_idx on anvendelse (arvet_fra_robot_id);
comment on table anvendelse is 'R16/R17. 0-1 raekke pr. robot. Fravaer af raekke = fravaer af topnoeglen i YAML.';

/* ============================================================
   6. BILLEDE — R18, topnoegle, ikke felt (samme naevner-begrundelse).
   ============================================================
   46/62 robotter har et billede i dag (formscan) — alle 46 med ophav
   "fabrikant", hvilket er praecis SPAERRING S1's problem: siden maa ikke
   PUBLICERES, mens de 46 raekker har ophav = 'fabrikant'. Det haandhaeves
   ikke her (en DB-raekke er ikke en publicering), men i tools/build.mjs's
   --til-udgivelse-flag efter eksport. */
create table billede (
  robot_id            bigint primary key references robotter(id) on delete cascade,
  fil                 text not null,      -- relativ til assets/, R18's stiregler haandhaeves IKKE i DB (kraever filsystemopslag)
  ophav               ophav_enum not null,
  kilde               text,
  hentet              date,
  alt                 text,
  note                text,
  delt_med_robot_id   bigint references robotter(id),  -- L28: to robotter kan dele samme fysiske fil
  plade               boolean,
  pos                 text,

  constraint billede_fil_ikke_tom check (btrim(fil) <> ''),
  constraint billede_ikke_delt_med_sig_selv check (delt_med_robot_id is distinct from robot_id),
  constraint billede_kilde_er_url check (kilde is null or kilde ~ '^https?://'),

  -- R18: ophav 'silhuet' og 'fabrikant' KRAEVER kilde (silhuet: maaltal skal
  -- kunne foelges; fabrikant: billedet skal kunne foelges til sin side).
  -- 'eget_foto' maa staa uden — vi har taget det selv.
  constraint billede_kilde_paakraevet_for_ophav check (
    ophav = 'eget_foto' or kilde is not null
  ),
  -- "hentet uden kilde daterer ingenting" (R18).
  constraint billede_hentet_kraever_kilde check (
    hentet is null or kilde is not null
  )
  -- R18's regler om selve STIEN (ingen "..", ingen "\", ingen "media/",
  -- filen skal FINDES paa disk i assets/<mappe>/) er filsystemtjek og kan
  -- ikke vaere en SQL CHECK. De staar ved magt i tools/validate.mjs, som
  -- koerer paa den EKSPORTEREDE mappe i db/rundtur.mjs.
);
comment on table billede is 'R18. 0-1 raekke pr. robot. SPAERRING S1: alle raekker med ophav=fabrikant er ikke-publicerbare, haandhaeves af build.mjs --til-udgivelse.';

/* ============================================================
   7. SYNK_AFTRYK — vagtens fingeraftryk (Å14, STATUS.md)
   ============================================================
   L35's oprindelige vagt (db/migrer.mjs's sammenlignDbMedYaml) sammenlignede
   databasens NUVAeRENDE indhold mod YAML'ens NUVAeRENDE tilstand og naegtede
   ved enhver forskel — ogsaa naar forskellen blot var et agent-spors nye
   robotter i data/robots/, som databasen aldrig havde tabt noget af. Å14
   retter det: vagten skal kun raabe, naar DATABASEN selv har flyttet sig
   siden sidste migrering (en Studio-redigering) — ikke naar YAML'en er
   rykket videre.

   Loesningen er et FINGERAFTRYK: hver vellykket "--til-db" gemmer den
   kanoniske robotter-struktur, den LIGE HAR SKREVET, i denne ene raekke.
   Naeste koersel sammenligner databasens nuvaerende indhold mod AFTRYKKET
   (ikke mod YAML) — matcher de, er intet redigeret i Studio siden sidst, og
   migreringen fortsaetter, uanset hvor langt YAML selv er rykket. Afviger
   de, er databasen redigeret uden om YAML siden sidste migrering, og
   migreringen stopper foer foerste DELETE (se db/migrer.mjs's tilDb).

   VALG: ÉN SINGLETON-RAeKKE, IKKE EN LOGTABEL MED ÉN RAeKKE PR. KOeRSEL.
   Vagten skal kun kende SENESTE tilstand — en historik af tidligere aftryk
   loeser ingen del af Å14's problem og ville blot vokse ubegraenset ved
   hver migrering (77 robotter x hver koersel). "--til-db" SLETTER OG
   GENINDSAeTTER derfor denne ene raekke ved hver vellykket koersel, samme
   toem-og-genindlaes-princip som resten af tabellerne.

   SINGLETON-MOeNSTERET: en `bigint identity`-noegle (skema-primary-keys.md's
   generelle anbefaling for en enkelt database) loeser IKKE "praecis én
   raekke" — det kraever enten en separat unik delvis-indeks-regel eller en
   applikationsdisciplin, ingen af delene findes her. `id boolean primary
   key default true` sammen med CHECK (id) er i stedet en velkendt Postgres-
   idiom for netop singleton-konfigurationstabeller: booleans domaene har
   kun to vaerdier, og CHECK (id) forbyder den ene af dem (false) som raekke
   — der kan derfor STRUKTURELT aldrig eksistere mere end én raekke, ikke
   kun "i praksis, hvis koden opfoerer sig ordentligt".

   RLS: samme "basis" som resten af filen (se afsnit 8 nedenfor) — ingen
   policy for anon/authenticated, kun service_role (BYPASSRLS) laeser og
   skriver. security-rls-performance.md's advarsel om auth.uid() kaldt pr.
   raekke er IKKE relevant her, fordi der slet ikke findes nogen policy at
   optimere — samme begrundelse som resten af filens RLS-afsnit. */
create table synk_aftryk (
  id          boolean primary key default true,
  aftryk      jsonb not null,      -- den kanoniske robotter-struktur, senest skrevet af --til-db
  robotantal  integer not null,    -- til hurtig, laesbar logging uden at aabne aftryk selv
  opdateret   timestamptz not null default now(),

  constraint synk_aftryk_er_singleton check (id)
);
comment on table synk_aftryk is
  'Å14: singleton-raekke. Vagten sammenligner databasens nuvaerende indhold mod aftryk (ikke mod YAML), saa den kun naegter, naar DATABASEN er redigeret siden sidste --til-db.';

commit;

/* ============================================================
   8. ROW LEVEL SECURITY — "basis", jf. opgavens afgraensning
   ============================================================
   Se filens toptekst. RLS slaas til paa alle syv tabeller UDEN nogen
   policy for anon/authenticated — Postgres' egen default, naar RLS er
   aktiveret uden en matchende policy, er at NÆGTE adgang for enhver rolle,
   der ikke er ejeren eller BYPASSRLS. service_role har altid BYPASSRLS i
   Supabase og er den eneste rolle, db/migrer.mjs og db/eksporter.mjs
   bruger (SUPABASE_SERVICE_ROLE_KEY, se db/LAESMIG.md) — noeglen maa ALDRIG
   bruges i en offentlig klient (Supabase-skillens egen advarsel,
   skills/supabase/SKILL.md: "Never expose the service_role ... key in
   public clients").

   Bevidst IKKE bygget her (se db/LAESMIG.md's afsnit om det): en
   authenticated-policy til en fremtidig redigerings-UI, en anon-laese-
   policy (kataloget er stadig statisk HTML fra YAML, ikke live fra DB),
   og enhver rolle ud over service_role. */
alter table feltdefinitioner   enable row level security;
alter table robotter           enable row level security;
alter table feltposter         enable row level security;
alter table feltpost_varianter enable row level security;
alter table anvendelse         enable row level security;
alter table billede            enable row level security;
alter table synk_aftryk        enable row level security;

-- Least privilege (security-privileges.md): PUBLIC-skemaets standardrettigheder
-- fjernes eksplicit, saa en fremtidig anon/authenticated-rolle ikke arver
-- adgang ved en fejl, den dag en policy tilfoejes.
revoke all on all tables in schema public from public;
revoke all on all tables in schema public from anon, authenticated;
