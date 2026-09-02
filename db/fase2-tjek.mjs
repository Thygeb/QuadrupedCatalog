#!/usr/bin/env node
/**
 * db/fase2-tjek.mjs — instrumentet, der doemmer alle fase 2-spor
 * (spor/f2-maal, fund/BRIEF-f2-maal.md, PLAN.md par. 0 fase 2).
 *
 * FASE 2 (PLAN.md par. 0) sender ~23 parallelle spor, hver med
 * raekkeejerskab paa ÉN producent, som skriver KUN tekstkolonner ind i
 * databasen (caveat/note/quote/alt-familien, PLAN.md's 891+309+76+21+...
 * forekomster). HAARD BEGRAeNSNING 2 (CLAUDE.md) kraever, at INTET tal
 * roerer sig, mens det sker. Dette script er beviset:
 *
 *   --tal                   Et deterministisk SHA-256-aftryk af ALLE
 *                            talbaerende kolonner, pr. robot + samlet.
 *                            Koer FOeR og EFTER et spor: samme aftryk =
 *                            ingen talkolonne roerte sig.
 *   --dansk                  Taeller, hvor mange strenge i de 10
 *                            tekstkolonner der stadig er danske (kommer i
 *                            et senere commit paa samme fil, punkt 2).
 *   --belaeg                 Konsistenskontrol: staar tallet i den citerede
 *                            ordlyd? (punkt 3, senere commit).
 *   --producent=<navn>       Afgraenser til én producent (eksakt, trim,
 *                            versalsuafhaengigt) — samme regel som
 *                            db/tjek.mjs's --kun, jf. db/LAESMIG.md's
 *                            "tjek.mjs --liste/--kun"-afsnit.
 *
 * LAeS-KUN: dette script skriver ALDRIG til databasen. Den ene skrivevej,
 * fase 2-sporene skal bruge, er db/f2-skriv.mjs (punkt 4, et senere commit
 * paa en anden fil).
 *
 * Nul afhaengigheder. Fetch mod PostgREST, samme SELECT-streng og samme
 * disambigueringshints som db/eksporter.mjs's fraDb() (se den fils
 * kommentarer for POSTGREST-OVERRASKELSE 2-4) — genskrevet her, IKKE
 * importeret derfra: db/eksporter.mjs oversaetter til den DANSKE YAML-form
 * via db/ordbog.mjs, hvilket dette instrument ikke skal (det maaler den
 * ENGELSKE DB-form direkte, og roerer aldrig data/robots/). Kraever
 * SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY i .env (db/LAESMIG.md).
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* -------------------------------------------------------------- .env */

/** Samme minimale .env-laeser som db/eksporter.mjs's laesDotEnv — IKKE
 *  importeret derfra (den er ikke eksporteret dér), og fase2-tjek.mjs har
 *  ingen anden afhaengighed til eksporter.mjs, som L30-laerdommen ellers
 *  ville advare mod at duplikere. db/f2-skriv.mjs (punkt 4) importerer
 *  DENNE kopi i stedet for at lave en tredje. */
export function laesDotEnv(fil) {
  if (!fs.existsSync(fil)) return;
  for (const linje of fs.readFileSync(fil, 'utf8').split(/\r?\n/)) {
    const t = linje.trim();
    if (!t || t.startsWith('#')) continue;
    const m = t.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m) continue;
    const [, noegle, raaVaerdi] = m;
    if (process.env[noegle] !== undefined) continue;
    let vaerdi = raaVaerdi.trim();
    if ((vaerdi.startsWith('"') && vaerdi.endsWith('"')) || (vaerdi.startsWith("'") && vaerdi.endsWith("'"))) {
      vaerdi = vaerdi.slice(1, -1);
    }
    process.env[noegle] = vaerdi;
  }
}

/** Laeser SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY (fra proces-env eller
 *  .env) og giver {url, headers} — kaster hoejlydt, hvis en af dem mangler,
 *  saa et manglende .env aldrig ser ud som "0 robotter". */
export function laesForbindelse() {
  laesDotEnv(path.join(ROD, '.env'));
  const url = process.env.SUPABASE_URL;
  const noegle = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !noegle) {
    throw new Error('SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY mangler i .env (se db/LAESMIG.md).');
  }
  return { url, headers: { apikey: noegle, Authorization: `Bearer ${noegle}` } };
}

/* -------------------------------------------------------------- hentning */

/**
 * Henter ALLE robotter fra det ENGELSKE Supabase-skema, indlejret med
 * field_entries(+field_entry_variants), applications, images — én GET,
 * samme select-streng og disambigueringshints som db/eksporter.mjs's
 * fraDb() (se den fils POSTGREST-OVERRASKELSE 2-4). Sorteret paa id.
 */
export async function hentRobotter() {
  const { url, headers } = laesForbindelse();
  const select = 'select=*,field_entries(*,field_entry_variants(*)),' +
    'applications!robot_id(*),images!robot_id(*)';
  const svar = await fetch(`${url}/rest/v1/robots?${select}`, { headers });
  if (!svar.ok) throw new Error(`GET robots fejlede: ${svar.status} ${await svar.text()}`);
  const raa = await svar.json();
  raa.sort((a, b) => a.id - b.id);
  return raa;
}

/* -------------------------------------------------------------- --producent */

/** Eksakt match paa robots.manufacturer, trim + case-uafhaengigt — samme
 *  regel som db/tjek.mjs's findProducent, men slaar op i de FAKTISK
 *  HENTEDE DB-raekker (raa.manufacturer), ikke i data/robots/'s YAML. De to
 *  kilder kan divergere, saa laenge fase 3 (PLAN.md par. 0) ikke er koert —
 *  dette instrument maaler databasen, saa det er DEN, der afgoer navnet. */
export function findProducent(oenske, robotter) {
  const soeg = String(oenske ?? '').trim().toLowerCase();
  const navne = [...new Set(robotter.map((r) => r.manufacturer))].sort((a, b) => a.localeCompare(b, 'da'));
  const match = navne.find((n) => n.trim().toLowerCase() === soeg) ?? null;
  return { match, gyldige: navne };
}

/** Filtrerer robotter til én producent (eller alle, hvis producent er null). */
export function filtrerProducent(robotter, producent) {
  return producent ? robotter.filter((r) => r.manufacturer === producent) : robotter;
}

/* -------------------------------------------------------------- kanonisk JSON + SHA-256 */

/** Rekursivt kanoniseret vaerdi: objektnoegler sorteret alfabetisk paa ALLE
 *  dybder, arrays beholder deres raekkefoelge (den er meningsbaerende data
 *  her — value_list/variantraekkefoelge osv.). Goer JSON.stringify()
 *  UAFHAeNGIG af den noeglerraekkefoelge, PostgREST tilfaeldigvis svarer i. */
function canon(v) {
  if (Array.isArray(v)) return v.map(canon);
  if (v !== null && typeof v === 'object') {
    const ud = {};
    for (const k of Object.keys(v).sort()) ud[k] = canon(v[k]);
    return ud;
  }
  return v;
}
export function canonJSON(v) { return JSON.stringify(canon(v)); }
export function sha256(streng) { return crypto.createHash('sha256').update(streng, 'utf8').digest('hex'); }

/* -------------------------------------------------------------- PUNKT 1: --tal */

/** De 18 talbaerende field_entries-kolonner, briefets punkt 1 navngiver
 *  eksplicit (fund/BRIEF-f2-maal.md). value_text staar IKKE paa listen —
 *  briefet navngiver den ikke, og db/f2-skriv.mjs's hvidliste (punkt 4)
 *  kan alligevel aldrig skrive den (den staar ikke paa TEKSTKOLONNE-
 *  hvidlisten der), saa fravaeret her aabner intet hul. Se ogsaa
 *  fund/FUND-f2maal.md's "Nye fælder"-afsnit. */
const AFTRYK_FELTPOST_KOLONNER = [
  'value_number', 'minimum', 'maximum', 'value_bool', 'value_list',
  'unit', 'imperial_unit', 'imperial_value', 'operator', 'state', 'form',
  'load_state', 'load_value', 'load_unit', 'currency', 'source', 'retrieved_at', 'source_type',
];

/** De talbaerende data for ÉN robot, i den PRAeCISE facon briefets punkt 1
 *  navngiver: 18 field_entries-kolonner pr. felt (sorteret paa field_name),
 *  field_entry_variants.value (sorteret paa variant_name, indlejret under
 *  sit felt), robots.first_released, robots.variants, applications.value.
 *  IKKE eksporteret alene — brug robotAftryk()/robotAftrykData() nedenfor. */
export function robotAftrykData(raa) {
  const felter = (raa.field_entries ?? []).slice()
    .sort((a, b) => a.field_name.localeCompare(b.field_name))
    .map((fe) => {
      const ud = { field_name: fe.field_name };
      for (const k of AFTRYK_FELTPOST_KOLONNER) ud[k] = fe[k] ?? null;
      ud.varianter = (fe.field_entry_variants ?? []).slice()
        .sort((a, b) => a.variant_name.localeCompare(b.variant_name))
        .map((v) => ({ variant_name: v.variant_name, value: v.value }));
      return ud;
    });
  return {
    robot_id: raa.id,
    first_released: raa.first_released ?? null,
    variants: raa.variants ?? null,
    felter,
    applications_value: raa.applications ? (raa.applications.value ?? null) : null,
  };
}

/** SHA-256 af ÉN robots kanoniserede talaftryk. */
export function robotAftryk(raa) { return sha256(canonJSON(robotAftrykData(raa))); }

/** {prRobot: [{robot_id, aftryk}, ...] (sorteret paa robot_id), samlet}.
 *  "samlet" er SHA-256 af den kanoniserede liste af pr.-robot-aftryk — selve
 *  aftrykket er allerede kanonisk pr. robot, saa denne funktion tilfoejer
 *  kun den deterministiske SORTERING paa robot_id, briefet kraever. */
export function samletAftryk(robotter) {
  const prRobot = robotter.slice().sort((a, b) => a.id - b.id)
    .map((r) => ({ robot_id: r.id, aftryk: robotAftryk(r) }));
  return { prRobot, samlet: sha256(canonJSON(prRobot)) };
}

function koerTal(robotter, producent) {
  const filtreret = filtrerProducent(robotter, producent);
  const { prRobot, samlet } = samletAftryk(filtreret);
  const slugFor = new Map(robotter.map((r) => [r.id, r.slug]));
  console.log(`FASE2-TJEK --tal${producent ? ` --producent="${producent}"` : ''}`);
  console.log(`${prRobot.length} robot(ter) · ${AFTRYK_FELTPOST_KOLONNER.length} feltpost-kolonner pr. felt `
    + '+ variants + first_released + applications.value');
  for (const { robot_id, aftryk } of prRobot) {
    console.log(`  ${robot_id}  ${slugFor.get(robot_id) ?? '?'}  ${aftryk}`);
  }
  console.log(`SAMLET AFTRYK: ${samlet}`);
  return 0;
}

/* -------------------------------------------------------------- CLI */

function laesFlag(argv) {
  const flag = {};
  for (const a of argv) {
    if (!a.startsWith('--')) continue;
    const i = a.indexOf('=');
    if (i === -1) flag[a.slice(2)] = true; else flag[a.slice(2, i)] = a.slice(i + 1);
  }
  return flag;
}

async function hoved() {
  const flag = laesFlag(process.argv.slice(2));

  if (!flag['tal'] && !flag['dansk'] && !flag['belaeg']) {
    console.error('Brug: node db/fase2-tjek.mjs --tal | --dansk | --belaeg [--producent=<navn>]');
    return 2;
  }

  const robotter = await hentRobotter();

  let producent = null;
  if (flag['producent'] !== undefined) {
    const oenske = flag['producent'] === true ? '' : String(flag['producent']);
    const { match, gyldige } = findProducent(oenske, robotter);
    if (!match) {
      console.error(`Ukendt producent: "${oenske}".`);
      console.error(`Gyldige producenter (${gyldige.length}):`);
      for (const g of gyldige) console.error(`  ${g}`);
      return 2;
    }
    producent = match;
  }

  if (flag['tal']) return koerTal(robotter, producent);

  console.error('--dansk og --belaeg kommer i et senere commit paa denne fil (punkt 2/3).');
  return 2;
}

const erHoved = process.argv[1] && path.resolve(process.argv[1]).endsWith('fase2-tjek.mjs');
if (erHoved) {
  hoved().then((k) => process.exit(k)).catch((e) => {
    console.error(String(e && e.stack ? e.stack : e));
    process.exit(1);
  });
}
