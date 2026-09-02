#!/usr/bin/env node
/**
 * db/byg-migrering.mjs — genererer db/migrering-engelsk.sql FRA db/ordbog.mjs
 * (spor/skema, punkt 2 af FASE 1, L81-L83). Nul afhaengigheder.
 *
 * L30-laerdommen ("en broek, hvis to halvdele kommer fra hver sin liste,
 * skrider — tavst") er grunden til, at denne fil IKKE er endnu en
 * haandskrevet omdoebningsliste ved siden af db/ordbog.mjs. Alle RENAME-
 * saetninger (tabel, kolonne, enum-type, enum-vaerdi) og alle UPDATE-
 * saetninger for opremsede dataværdier er UDLEDT af ordbogen her — kør
 * `node db/byg-migrering.mjs` og output er BYTE-LIG `db/migrering-engelsk.sql`
 * (test 63c beviser det, samme facit som A11).
 *
 * De STRUKTURELLE tilføjelser fra punkt 3 (collected_by/change_reason,
 * change_log-tabellen + trigger, images.alt -> jsonb) er BEVIDST
 * haandskrevet herunder, ikke udledt af en liste — der findes ingen anden
 * liste, de kunne skride fra (D7/L30's fælde er specifikt "to lister for
 * samme fakta", og disse tilføjelser har kun ét sted, de nogensinde står).
 *
 * RÆKKEFØLGE (kan ikke ombyttes uden at ødelægge migreringen):
 *   A. Datavaerdier oversat MENS tabel/kolonnenavne stadig er danske
 *      (robotter.fremdrift's CHECK droppes FØR UPDATE, fordi de nye
 *      værdier ellers ville bryde den gamle CHECK).
 *   B. Enum-VÆRDIER omdøbt (ALTER TYPE ... RENAME VALUE), mens enum-
 *      TYPEnavnene stadig er danske (de to omdøbes uafhængigt af hinanden).
 *   C. Enum-TYPEnavne omdøbt.
 *   D. Tabelnavne omdøbt.
 *   E. Kolonnenavne omdøbt — PÅ DE NU-ENGELSKE TABELNAVNE (afhænger af D).
 *   F. Strukturelle tilføjelser fra punkt 3 — afhænger af D+E, fordi de
 *      refererer de nye engelske tabel-/kolonnenavne direkte.
 *   G. synk_aftryk droppet (punkt 5 — vagtede en skrivevej der selv forsvinder).
 *
 * FUNDET VED LÆSEADGANG TIL DEN LEVENDE DATABASE (2. sep 2026, mcp__supabase__
 * execute_sql, KUN SELECT — se briefets læse-kun-grænse): alle 78 kolonner
 * (7 tabeller) matcher db/ordbog.mjs's KOLONNER+KOLONNER_FJERNET PRÆCIST —
 * ingen af de tre _i18n-kolonner findes live (bekræfter Å116). Constraint-
 * navnene `robotter_fremdrift_check` og `billede_alt_form` er læst RÅT fra
 * `pg_constraint`, ikke gættet — og `billede.alt` er ALLEREDE `jsonb` live
 * (Å115's `apply_migration`), så sektion F4 er skrevet som en VAGTET
 * omdøbning af det eksisterende constraint-navn, ikke en ny oprettelse.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as ordbog from './ordbog.mjs';

const ROD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** SQL-strengliteral med korrekt escaping af enkelt-anførselstegn. Ingen af
 *  ordbogens vaerdier indeholder i dag et anførselstegn, men escapingen
 *  koster intet og goer funktionen korrekt uanset. */
const s = (v) => `'${String(v).replace(/'/g, "''")}'`;

/**
 * Hvilke danske kolonner hoerer til hvilken dansk tabel, I DEN RAEKKEFOELGE
 * db/skema.sql selv erklaerer dem. Dette er STRUKTUR (skemaets facon), ikke
 * OVERSAETTELSE — derfor bor kortet her og ikke i db/ordbog.mjs, som er en
 * ren navne-ordbog. Efterproevet 2. sep 2026 mod den levende databases
 * information_schema.columns: 78 raekker paa tvaers af 7 tabeller, praecis
 * dette moenster (synk_aftryk's 4 er udeladt her med vilje — den tabel
 * droppes i sektion G, faar ingen RENAME).
 */
const TABEL_KOLONNER = {
  feltdefinitioner: [
    'feltnavn', 'gruppe', 'art', 'dimension', 'ogsaa_dimension',
    'kraever_ved_last', 'd4_beroert', 'katalogfelt', 'filterfelt',
  ],
  robotter: [
    'id', 'slug', 'navn', 'producent', 'producentland', 'producentby',
    'status', 'fremdrift', 'foerste_udgivelse', 'forgaenger_robot_id',
    'varianter', 'noter', 'noter_ordlyd',
  ],
  feltposter: [
    'robot_id', 'feltnavn', 'form', 'tilstand', 'vaerdi_tal', 'min', 'maks',
    'vaerdi_tekst', 'vaerdi_bool', 'vaerdi_liste', 'enhed', 'enhed_imperial',
    'vaerdi_imperial', 'operator', 'kilde', 'hentet', 'kildetype', 'advarsel',
    'advarsel_klasse', 'advarsel_ordlyd', 'note', 'raa', 'valuta',
    'ved_last_tilstand', 'ved_last_vaerdi', 'ved_last_enhed',
  ],
  feltpost_varianter: ['robot_id', 'feltnavn', 'variant_navn', 'vaerdi'],
  anvendelse: [
    'robot_id', 'er_bar_streng', 'er_ikke_oplyst', 'vaerdi', 'citat',
    'citat_ordlyd', 'kilde', 'hentet', 'kildetype', 'arvet_fra_robot_id',
    'note', 'note_ordlyd',
  ],
  billede: [
    'robot_id', 'fil', 'ophav', 'kilde', 'hentet', 'alt', 'note',
    'delt_med_robot_id', 'plade', 'pos',
  ],
};

/** De tabeller, der faar collected_by/change_reason + change_log-vagt
 *  (punkt 3). IKKE field_definitions: den er en maskingenereret spejling af
 *  tools/skema.mjs (genskrevet ved hver --til-db), aldrig en Studio-
 *  redigering et menneske skal kunne forklare/fortryde — samme begrundelse
 *  som db/skema.sql's egen kommentar ved tabellen. */
const SKRIVBARE_TABELLER = ['robots', 'field_entries', 'field_entry_variants', 'applications', 'images'];

function sektionA() {
  const l = [];
  l.push('-- A. Datavaerdier oversat FOeR omdoebning (mens tabel-/kolonnenavne');
  l.push('--    stadig er danske).');
  l.push('');
  l.push('-- A1. robotter.fremdrift: CHECK-begraensningen ("robotter_fremdrift_check",');
  l.push('--     laest raat af pg_constraint 2. sep 2026, IKKE gaettet ud fra navnekonvention)');
  l.push('--     forbyder de nye vaerdier og droppes derfor FOeR UPDATE — genskabt med de nye');
  l.push('--     vaerdier i sektion F1, EFTER omdoebningen.');
  l.push('alter table robotter drop constraint robotter_fremdrift_check;');
  l.push('update robotter set fremdrift = case fremdrift');
  for (const [da, en] of Object.entries(ordbog.DATA_VAERDIER.fremdrift.kort)) {
    l.push(`  when ${s(da)} then ${s(en)}`);
  }
  l.push('  else fremdrift end;');
  l.push('');
  l.push('-- A2. robotter.producentland: ingen CHECK (fri tekst i praksis) — direkte UPDATE.');
  l.push('update robotter set producentland = case producentland');
  for (const [da, en] of Object.entries(ordbog.DATA_VAERDIER.producentland.kort)) {
    l.push(`  when ${s(da)} then ${s(en)}`);
  }
  l.push('  else producentland end;');
  l.push('');
  l.push('-- A3. anvendelse.vaerdi: jsonb, enten en STRENG eller en LISTE af strenge (R16) —');
  l.push('--     formen bevares PRAECIST (en enkelt kategori bliver IKKE en 1-elements liste,');
  l.push('--     en flerelements liste beholder sin raekkefoelge via "with ordinality").');
  l.push('update anvendelse set vaerdi = case jsonb_typeof(vaerdi)');
  l.push("  when 'string' then to_jsonb(case vaerdi #>> '{}'");
  for (const [da, en] of Object.entries(ordbog.DATA_VAERDIER.anvendelse_vaerdi.kort)) {
    l.push(`    when ${s(da)} then ${s(en)}`);
  }
  l.push("    else vaerdi #>> '{}' end)");
  l.push("  when 'array' then (");
  l.push('    select jsonb_agg(to_jsonb(oversat) order by raekkefoelge)');
  l.push('    from (');
  l.push('      select raekkefoelge, case element');
  for (const [da, en] of Object.entries(ordbog.DATA_VAERDIER.anvendelse_vaerdi.kort)) {
    l.push(`        when ${s(da)} then ${s(en)}`);
  }
  l.push('        else element end as oversat');
  l.push('      from jsonb_array_elements_text(vaerdi) with ordinality as t(element, raekkefoelge)');
  l.push('    ) omregnet');
  l.push('  )');
  l.push('  else vaerdi end');
  l.push('where vaerdi is not null;');
  l.push('');
  l.push('-- A4. feltdefinitioner.gruppe/art/dimension/ogsaa_dimension: ingen CHECK');
  l.push('--     (laest raat af pg_constraint 2. sep 2026: feltdefinitioner har KUN sin');
  l.push('--     primaernoegle — ingen drop/genskab noedvendig, i modsaetning til A1/A5).');
  l.push('--     Fundet 2. sep 2026 (orkestrator-review): denne tabel var glemt af den');
  l.push('--     foerste udgave af denne fil, selvom ordbogen (FELTGRUPPER/FELTARTER/');
  l.push('--     FELTDIMENSIONER) altid har defineret oversaettelsen — L82 gaelder ALT i');
  l.push('--     databasen, ogsaa feltdefinitionernes egne etiketter.');
  l.push('update feltdefinitioner set gruppe = case gruppe');
  for (const [da, en] of Object.entries(ordbog.FELTGRUPPER.kort)) {
    l.push(`  when ${s(da)} then ${s(en)}`);
  }
  l.push('  else gruppe end;');
  l.push('update feltdefinitioner set art = case art');
  for (const [da, en] of Object.entries(ordbog.FELTARTER.kort)) {
    l.push(`  when ${s(da)} then ${s(en)}`);
  }
  l.push('  else art end;');
  l.push('update feltdefinitioner set dimension = case dimension');
  for (const [da, en] of Object.entries(ordbog.FELTDIMENSIONER.kort)) {
    l.push(`  when ${s(da)} then ${s(en)}`);
  }
  l.push('  else dimension end;');
  l.push('update feltdefinitioner set ogsaa_dimension = case ogsaa_dimension');
  for (const [da, en] of Object.entries(ordbog.FELTDIMENSIONER.kort)) {
    l.push(`  when ${s(da)} then ${s(en)}`);
  }
  l.push('  else ogsaa_dimension end;');
  l.push('');
  l.push('-- A5. feltposter.advarsel_klasse: CHECK-begraensningen ("feltposter_advarsel_klasse_gyldig",');
  l.push('--     laest raat af pg_constraint 2. sep 2026, IKKE gaettet) forbyder de nye');
  l.push('--     vaerdier og droppes derfor FOeR UPDATE — genskabt med de nye vaerdier i');
  l.push('--     sektion F5, EFTER omdoebningen (samme moenster som A1/F1).');
  l.push('--     feltposter_advarsel_klasse_kraever_advarsel roeres IKKE: den haardkoder');
  l.push('--     ingen af de to vaerdier, kun at kolonnen kraever et forbehold ved siden af.');
  l.push('alter table feltposter drop constraint feltposter_advarsel_klasse_gyldig;');
  l.push('update feltposter set advarsel_klasse = case advarsel_klasse');
  for (const [da, en] of Object.entries(ordbog.DATA_VAERDIER.advarsel_klasse.kort)) {
    l.push(`  when ${s(da)} then ${s(en)}`);
  }
  l.push('  else advarsel_klasse end;');
  return l;
}

function sektionB() {
  const l = [];
  l.push('-- B. Enum-VAeRDIER omdoebt (mens enum-TYPEnavnene stadig er danske —');
  l.push('--    de to omdoebes uafhaengigt af hinanden). Identiske par (fx');
  l.push('--    feltform_enum.interval -> interval) er udeladt: RENAME VALUE til');
  l.push('--    samme navn fejler paa en duplikeret label.');
  for (const [daType, delOrdbog] of Object.entries(ordbog.ENUM_LABELS)) {
    for (const [da, en] of Object.entries(delOrdbog.kort)) {
      if (da === en) continue;
      l.push(`alter type ${daType} rename value ${s(da)} to ${s(en)};`);
    }
  }
  return l;
}

function sektionC() {
  const l = [];
  l.push('-- C. Enum-TYPEnavne omdoebt. status_enum og operator_enum udelades: begge');
  l.push('--    navne er allerede engelske (identitet).');
  for (const daType of ordbog.ENUM_TYPER.danske()) {
    const enType = ordbog.ENUM_TYPER.tilEngelsk(daType);
    if (daType === enType) continue;
    l.push(`alter type ${daType} rename to ${enType};`);
  }
  return l;
}

function sektionD() {
  const l = [];
  l.push('-- D. Tabelnavne omdoebt.');
  for (const daTabel of Object.keys(TABEL_KOLONNER)) {
    l.push(`alter table ${daTabel} rename to ${ordbog.TABELLER.tilEngelsk(daTabel)};`);
  }
  return l;
}

function sektionE() {
  const l = [];
  l.push('-- E. Kolonnenavne omdoebt, PAA DE NU-ENGELSKE TABELNAVNE (sektion D er koert).');
  l.push('--    Identiske par (id, slug, status, robot_id, form, operator, note, alt,');
  l.push('--    dimension) er udeladt — RENAME COLUMN til samme navn er en fejl, ikke et');
  l.push('--    no-op. Postgres opdaterer selv ALLE CHECK/FK-udtryk, der naevner en');
  l.push('--    omdoebt kolonne (attnum-baseret internt, ikke tekst) — INGEN af de 30+');
  l.push('--    navngivne constraints i skema.sql skal genskrives for selve omdoebningen.');
  for (const [daTabel, kolonner] of Object.entries(TABEL_KOLONNER)) {
    const enTabel = ordbog.TABELLER.tilEngelsk(daTabel);
    for (const daKol of kolonner) {
      const enKol = ordbog.KOLONNER.tilEngelsk(daKol);
      if (daKol === enKol) continue;
      l.push(`alter table ${enTabel} rename column ${daKol} to ${enKol};`);
    }
  }
  return l;
}

function sektionF() {
  const l = [];
  l.push('-- F. Strukturelle tilfoejelser fra punkt 3 (L81) — haandskrevet, ikke udledt');
  l.push('--    af en liste (der findes ingen anden liste, de kunne skride fra).');
  l.push('');
  // Udledt af ordbogen (ikke hardkodet "propulsion"/"locomotion"): en fejl,
  // der tidligere ramte netop denne linje (orkestrator-review 2. sep 2026,
  // fremdrift -> propulsion blev rettet til -> locomotion), skal ikke kunne
  // gentage sig som en TAVS uoverensstemmelse mellem ordbogen og dette navn.
  {
    const enTabel = ordbog.TABELLER.tilEngelsk('robotter');
    const enKol = ordbog.KOLONNER.tilEngelsk('fremdrift');
    l.push(`-- F1. ${enTabel}.${enKol}: CHECK genskabt med de NYE vaerdier (droppet i A1).`);
    l.push(`alter table ${enTabel} add constraint ${enTabel}_${enKol}_check check (${enKol} in (${s(ordbog.DATA_VAERDIER.fremdrift.tilEngelsk('ben'))}, ${s(ordbog.DATA_VAERDIER.fremdrift.tilEngelsk('ben_hjul'))}));`);
  }
  l.push('');
  l.push('-- F2. collected_by + change_reason paa de skrivbare tabeller. IKKE paa');
  l.push('--     field_definitions — se filens toptekst for begrundelsen.');
  for (const t of SKRIVBARE_TABELLER) {
    l.push(`alter table ${t} add column if not exists collected_by text;`);
    l.push(`alter table ${t} add column if not exists change_reason text;`);
  }
  l.push('');
  l.push('-- F3. change_log: fortrydelsesknappen OG haard begraensning 2s spor (Aa116).');
  l.push('--     Raekke-trigger ved UPDATE/DELETE gemmer den GAMLE raekke som jsonb,');
  l.push('--     sammen med hvem og hvorfor. NEW.collected_by/change_reason ved UPDATE');
  l.push('--     (redaktoerens forklaring paa DENNE aendring); OLD ved DELETE (intet NEW).');
  l.push('create table if not exists change_log (');
  l.push('  id bigint generated always as identity primary key,');
  l.push('  table_name text not null,');
  l.push('  row_key jsonb not null,');
  l.push("  operation text not null check (operation in ('update', 'delete')),");
  l.push('  old_row jsonb not null,');
  l.push('  changed_by text,');
  l.push('  reason text,');
  l.push('  changed_at timestamptz not null default now()');
  l.push(');');
  l.push('');
  l.push('create or replace function log_change() returns trigger as $$');
  l.push('declare');
  l.push('  v_key jsonb;');
  l.push('  v_changed_by text;');
  l.push('  v_reason text;');
  l.push('begin');
  l.push("  if TG_TABLE_NAME = 'robots' then");
  l.push("    v_key := jsonb_build_object('id', OLD.id);");
  l.push("  elsif TG_TABLE_NAME = 'field_entries' then");
  l.push("    v_key := jsonb_build_object('robot_id', OLD.robot_id, 'field_name', OLD.field_name);");
  l.push("  elsif TG_TABLE_NAME = 'field_entry_variants' then");
  l.push("    v_key := jsonb_build_object('robot_id', OLD.robot_id, 'field_name', OLD.field_name, 'variant_name', OLD.variant_name);");
  l.push("  elsif TG_TABLE_NAME = 'applications' then");
  l.push("    v_key := jsonb_build_object('robot_id', OLD.robot_id);");
  l.push("  elsif TG_TABLE_NAME = 'images' then");
  l.push("    v_key := jsonb_build_object('robot_id', OLD.robot_id);");
  l.push('  else');
  l.push("    v_key := '{}'::jsonb;");
  l.push('  end if;');
  l.push('');
  l.push("  if TG_OP = 'UPDATE' then");
  l.push('    v_changed_by := NEW.collected_by;');
  l.push('    v_reason := NEW.change_reason;');
  l.push('  else');
  l.push('    v_changed_by := OLD.collected_by;');
  l.push('    v_reason := OLD.change_reason;');
  l.push('  end if;');
  l.push('');
  l.push('  insert into change_log (table_name, row_key, operation, old_row, changed_by, reason)');
  l.push('  values (TG_TABLE_NAME, v_key, lower(TG_OP), to_jsonb(OLD), v_changed_by, v_reason);');
  l.push('');
  l.push('  return OLD;');
  l.push('end;');
  l.push('$$ language plpgsql security definer;');
  l.push('');
  for (const t of SKRIVBARE_TABELLER) {
    l.push(`drop trigger if exists log_change_${t} on ${t};`);
    l.push(`create trigger log_change_${t} after update or delete on ${t} for each row execute function log_change();`);
  }
  l.push('');
  l.push('alter table change_log enable row level security;');
  l.push('revoke all on change_log from public;');
  l.push('revoke all on change_log from anon, authenticated;');
  l.push('');
  l.push('-- F4. images.alt -> jsonb. ALLEREDE anvendt paa den levende database (Aa115,');
  l.push('--     STATUS.md: billede_alt_jsonb via apply_migration) — bekraeftet ved');
  l.push('--     laesning 2. sep 2026: information_schema siger jsonb, og CHECK hedder');
  l.push('--     "billede_alt_form". Vagtet begge veje, saa filen forbliver koerbar mod');
  l.push('--     BAADE en database, der fik rettelsen, og en, der ikke gjorde.');
  l.push('do $$');
  l.push('begin');
  l.push("  if (select data_type from information_schema.columns where table_name = 'images' and column_name = 'alt') = 'text' then");
  l.push('    alter table images alter column alt type jsonb using alt::jsonb;');
  l.push('  end if;');
  l.push('end $$;');
  l.push('');
  l.push('do $$');
  l.push('begin');
  l.push("  if exists (select 1 from pg_constraint where conname = 'billede_alt_form') then");
  l.push('    alter table images rename constraint billede_alt_form to images_alt_form;');
  l.push("  elsif not exists (select 1 from pg_constraint where conname = 'images_alt_form') then");
  l.push("    alter table images add constraint images_alt_form check (alt is null or jsonb_typeof(alt) = 'object');");
  l.push('  end if;');
  l.push('end $$;');
  l.push('');
  // Udledt af ordbogen (samme begrundelse som F1: en hardkodet "caveat_class"
  // her ville kunne desynke tavst fra ordbog.mjs, praecis den fejl F1 selv
  // rettede for propulsion/locomotion).
  {
    const enTabel = ordbog.TABELLER.tilEngelsk('feltposter');
    const enKol = ordbog.KOLONNER.tilEngelsk('advarsel_klasse');
    const enVaerdier = Object.values(ordbog.DATA_VAERDIER.advarsel_klasse.kort).map((v) => s(v)).join(', ');
    l.push(`-- F5. ${enTabel}.${enKol}: CHECK genskabt med de NYE vaerdier (droppet i A5).`);
    l.push(`alter table ${enTabel} add constraint ${enTabel}_${enKol}_valid check (${enKol} is null or ${enKol} in (${enVaerdier}));`);
  }
  return l;
}

function sektionG() {
  return [
    '-- G. synk_aftryk droppet (punkt 5) — vagtede en skrivevej (db/migrer.mjs),',
    '--    der selv er fjernet. IF EXISTS: allerede fjernet er ikke en fejl.',
    'drop table if exists synk_aftryk;',
  ];
}

export function byggSql() {
  const l = [];
  l.push('-- db/migrering-engelsk.sql — GENERERET af db/byg-migrering.mjs FRA db/ordbog.mjs.');
  l.push('-- IKKE til haandredigering: ret db/ordbog.mjs eller db/byg-migrering.mjs og');
  l.push('-- genkoer `node db/byg-migrering.mjs > db/migrering-engelsk.sql`.');
  l.push('--');
  l.push('-- L81-L83 (STATUS.md): databasen bliver engelsk. Denne fil omdoeber det, YAML-');
  l.push('-- vejen (db/migrer.mjs) aldrig fik lov at skrive et andet sted end sig selv —');
  l.push('-- se db/LAESMIG.md og db/tjek.mjs for hvordan den efterproeves. KOeRES AF');
  l.push('-- ORKESTRATOREN i ÉN apply_migration (transaktionel), IKKE af dette spor —');
  l.push('-- spor/skema har kun LAESEadgang til den levende database.');
  l.push('--');
  l.push('-- FOeR KOeRSEL: efterprøv raekketallet er 77 (select count(*) from robotter)');
  l.push('-- og at synk_aftryk\'s indhold ikke er tabt information nogen har brug for —');
  l.push('-- den var udelukkende --til-db\'s eget fingeraftryk (Å14), intet redaktionelt.');
  l.push('begin;');
  l.push('');
  l.push(...sektionA());
  l.push('');
  l.push(...sektionB());
  l.push('');
  l.push(...sektionC());
  l.push('');
  l.push(...sektionD());
  l.push('');
  l.push(...sektionE());
  l.push('');
  l.push(...sektionF());
  l.push('');
  l.push(...sektionG());
  l.push('');
  l.push('commit;');
  return l.join('\n') + '\n';
}

async function main() {
  process.stdout.write(byggSql());
  return 0;
}

const erHoved = process.argv[1] && path.resolve(process.argv[1]).endsWith('byg-migrering.mjs');
if (erHoved) {
  main().then((k) => process.exit(k)).catch((e) => {
    console.error(String(e && e.stack ? e.stack : e));
    process.exit(1);
  });
}

export { TABEL_KOLONNER, SKRIVBARE_TABELLER };
