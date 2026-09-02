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

/* -------------------------------------------------------------- PUNKT 2: --dansk */

/** Danske markoerord, der IKKE er gyldige engelske ord — andet ben af
 *  dansk-detektionen (foerste ben er AEOEAA_REGEX nedenfor). NOeDVENDIGT,
 *  IKKE TILSTRAeKKELIGT (briefets eget krav om at skrive graensen her): en
 *  dansk saetning uden æøå OG uden et af disse ord slipper igennem som
 *  "ikke dansk" — en KENDT GRAeNSE, ikke en fejl. Se fund/FUND-f2maal.md.
 *
 *  Ord, der ER aktuelle engelske ord, er BEVIDST UDELADT for at undgaa
 *  falske positiver paa allerede oversat tekst — fundet ved gennemsyn, ikke
 *  antaget: "men" (flertal af "man"), "under"/"over"/"her" (identiske
 *  engelske praepositioner/pronomen), "dog" (dyret — relevant i en
 *  robotside, der sammenligner med hunde), "sig" (kan kollidere med "SIG"
 *  i en forsvars-anvendelseskategori). Ord med æøå er udeladt her, fordi
 *  AEOEAA_REGEX allerede fanger dem (fx "på", "når", "større") — at
 *  gentage dem her ville kun tilfoeje regex-kompleksitet uden at fange
 *  flere tilfaelde. */
const DANSKE_MARKOEROR = [
  'og', 'ikke', 'med', 'som', 'af', 'til', 'er', 'den', 'det', 'de',
  'har', 'kan', 'skal', 'vil', 'eller', 'hvis', 'samt', 'hvor',
  'denne', 'dette', 'disse', 'vores', 'deres', 'selv',
  'meget', 'mere', 'mest', 'kun', 'uden', 'inden', 'efter',
  'mellem', 'ved', 'fra', 'om', 'nu', 'der', 'hvad', 'hvem',
  'andre', 'samme', 'producenten', 'producent', 'oplyst', 'oplyser',
  'angiver', 'angivet', 'skemaet', 'kilde', 'kilden',
  'sammenligner', 'sammenligning', 'ingen', 'alle', 'nogle', 'flere', 'mindre',
  'egen', 'egne', 'robotten', 'robottens', 'producentens', 'stedet', 'modsat',
  'baseret', 'beregnet', 'skrevet', 'formentlig', 'formodentlig', 'ligesom',
  'imellem', 'herunder', 'heraf', 'heri', 'hertil', 'herefter',
  'dermed', 'derfor', 'blot', 'netop', 'stadig', 'allerede',
];
const DANSK_ORD_REGEX = new RegExp(`\\b(${DANSKE_MARKOEROR.join('|')})\\b`, 'i');
const AEOEAA_REGEX = /[æøåÆØÅ]/;

/** Foerste ben alene — det KONTROLTAL, briefet selv maalte (fx "677 med
 *  aeoeaa" for caveat). Eksporteret separat, saa --dansk kan vise begge
 *  tal ved siden af hinanden, jf. briefets krav om at ordlisten aldrig maa
 *  give et LAVERE tal end æøå-scanningen alene. */
export function harAeoeaa(streng) {
  return typeof streng === 'string' && AEOEAA_REGEX.test(streng);
}

/** To-benet dansk-detektor: æøå ELLER et markoerord (helt ord,
 *  versalsuafhaengigt). Se DANSKE_MARKOEROR's kommentar for graensen —
 *  NOeDVENDIGT, IKKE TILSTRAeKKELIGT. */
export function erDansk(streng) {
  if (typeof streng !== 'string' || streng === '') return false;
  return AEOEAA_REGEX.test(streng) || DANSK_ORD_REGEX.test(streng);
}

/** Udfolder ÉN jsonb-vaerdi (streng ELLER liste af strenge, ELLER null/
 *  undefined — se db/skema.sql's kommentarer ved fx applications.quote,
 *  robots.notes) til en FLAD liste af ikke-tomme strenge. "Tæl elementer,
 *  ikke raekker" (briefets punkt 2): en 3-elements liste bidrager 3, en
 *  bar streng bidrager 1, null/tom bidrager 0. Bruges ogsaa for almindelige
 *  TEXT-kolonner (caveat, note, ...) — de er allerede en bar JS-streng
 *  eller null efter JSON.parse, saa samme funktion daekker begge typer
 *  uden en separat gren. */
function udfoldStrenge(v) {
  if (v === null || v === undefined) return [];
  if (Array.isArray(v)) return v.filter((x) => typeof x === 'string' && x.trim() !== '');
  if (typeof v === 'string' && v.trim() !== '') return [v];
  return [];
}

/** De 10 tekstkolonner, briefets punkt 2 navngiver. `uddrag(raa)` giver
 *  denne robots elementer for kolonnen (flad liste af strenge). images.alt
 *  er SAeRTILFAeLDET: den er et OBJEKT {da, en} (ikke streng/liste), og
 *  briefet vil vide om "en"-noeglen STADIG baerer dansk tekst — IKKE om
 *  "da"-noeglen goer (den ER pr. definition altid dansk, saa at taelle DEN
 *  ville altid give "alt er dansk" og maale ingenting). Derfor udtraekkes
 *  alt.en, ikke alt — resten af rutinen (udfoldStrenge + erDansk) er
 *  UAeNDRET for dette saertilfaelde, det er kun VALGET af kilde-noegle, der
 *  er saerligt. */
const DANSK_KOLONNER = [
  { navn: 'caveat', uddrag: (raa) => (raa.field_entries ?? []).flatMap((fe) => udfoldStrenge(fe.caveat)) },
  { navn: 'caveat_wording', uddrag: (raa) => (raa.field_entries ?? []).flatMap((fe) => udfoldStrenge(fe.caveat_wording)) },
  { navn: 'applications.note', uddrag: (raa) => udfoldStrenge(raa.applications?.note) },
  { navn: 'applications.note_wording', uddrag: (raa) => udfoldStrenge(raa.applications?.note_wording) },
  { navn: 'applications.quote', uddrag: (raa) => udfoldStrenge(raa.applications?.quote) },
  { navn: 'applications.quote_wording', uddrag: (raa) => udfoldStrenge(raa.applications?.quote_wording) },
  { navn: 'images.note', uddrag: (raa) => udfoldStrenge(raa.images?.note) },
  { navn: 'images.alt', uddrag: (raa) => udfoldStrenge(raa.images?.alt?.en) },
  { navn: 'robots.notes', uddrag: (raa) => udfoldStrenge(raa.notes) },
  { navn: 'robots.notes_wording', uddrag: (raa) => udfoldStrenge(raa.notes_wording) },
];

/** Taeller ÉN kolonne over `robotter`: {iAlt, dansk, kunAeoeaa, prProducent}
 *  — prProducent er et Map producent -> {iAlt, dansk, kunAeoeaa}, sorteret
 *  ved udskrift, ikke her (ren tælling, ingen visningslogik). */
export function taelKolonne(robotter, uddrag) {
  let iAlt = 0, dansk = 0, kunAeoeaa = 0;
  const prProducent = new Map();
  for (const raa of robotter) {
    const elementer = uddrag(raa);
    if (!elementer.length) continue;
    const p = prProducent.get(raa.manufacturer) ?? { iAlt: 0, dansk: 0, kunAeoeaa: 0 };
    for (const tekst of elementer) {
      iAlt++; p.iAlt++;
      if (harAeoeaa(tekst)) { kunAeoeaa++; p.kunAeoeaa++; }
      if (erDansk(tekst)) { dansk++; p.dansk++; }
    }
    prProducent.set(raa.manufacturer, p);
  }
  return { iAlt, dansk, kunAeoeaa, prProducent };
}

/** Alle 10 kolonner paa én gang — {navn, iAlt, dansk, kunAeoeaa, prProducent}[]. */
export function danskAlle(robotter) {
  return DANSK_KOLONNER.map(({ navn, uddrag }) => ({ navn, ...taelKolonne(robotter, uddrag) }));
}

function koerDansk(robotter, producent) {
  const filtreret = filtrerProducent(robotter, producent);
  const resultater = danskAlle(filtreret);
  console.log(`FASE2-TJEK --dansk${producent ? ` --producent="${producent}"` : ''}`);
  console.log('KOLONNE                       I ALT   DANSK  (æøå-alene, kontroltal — dansk SKAL vaere >= denne)');
  for (const r of resultater) {
    console.log(`${r.navn.padEnd(28)} ${String(r.iAlt).padStart(6)} ${String(r.dansk).padStart(7)}  (${r.kunAeoeaa})`);
    const producenter = [...r.prProducent.entries()].sort((a, b) => b[1].dansk - a[1].dansk || a[0].localeCompare(b[0], 'da'));
    for (const [navn, p] of producenter) {
      if (p.dansk === 0) continue;
      console.log(`  ${navn.padEnd(26)} ${String(p.iAlt).padStart(6)} ${String(p.dansk).padStart(7)}  (${p.kunAeoeaa})`);
    }
  }
  return 0;
}

/* -------------------------------------------------------------- PUNKT 3: --belaeg */

/** Konverterer fuldbredde-cifre (U+FF10-FF19, "１８") til ASCII-cifre. */
function fuldbredTilAscii(s) {
  return s.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFF10 + 0x30));
}

function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

/** Plausible SKRIFTFORMER af ét tal, konservativt (briefets krav): heltal
 *  faar baade "18" og "18.0"/"18,0"; ikke-heltal faar baade punktum- og
 *  komma-decimal SAMT en afrundet heltalsform (82.4 -> ogsaa "82"). Formaalet
 *  er at MINIMERE falske "intet traef" (briefet: et manglende traef er et
 *  spoergsmaal til et menneske, ikke en fejl) — IKKE at udtoemme alle
 *  producentens mulige skrivemaader (enhedsomregning er ikke forsoegt her,
 *  se koerBelaeg's kommentar). */
function talformer(v) {
  const former = new Set();
  former.add(String(v));
  if (Number.isInteger(v)) {
    former.add(`${v}.0`);
    former.add(`${v},0`);
    // Tusind-adskiller ("15,999") — fundet noedvendigt ved foerste koersel
    // mod den levende DB (yufan-lingmao-cyvet.price: 15999 vs. citeret
    // "¥15,999"). Kun for tal >= 1000, hvor formen er meningsfuld.
    if (Math.abs(v) >= 1000) former.add(v.toLocaleString('en-US'));
  } else {
    former.add(String(v).replace('.', ','));
    former.add(String(Math.round(v)));
  }
  return [...former];
}

/** Forekommer `tal` i `ordlyd`? Fuldbredde-cifre normaliseres foerst.
 *  Traeffet kraever, at tallet IKKE er omgivet af andre cifre/decimaltegn
 *  (saa "18" ikke falsk-traeffer inde i "180" eller "2.18") — braendt af
 *  lookaround i stedet for \b, fordi \b ikke skelner "18" fra "1.8"s "8". */
export function ordlydIndeholderTal(ordlyd, v) {
  if (typeof ordlyd !== 'string' || !ordlyd) return false;
  const norm = fuldbredTilAscii(ordlyd);
  for (const form of talformer(v)) {
    const re = new RegExp(`(?<![0-9.,])${escapeRegex(form)}(?![0-9])`);
    if (re.test(norm)) return true;
  }
  return false;
}

/** Alle field_entries-raekker med BAADE value_number OG caveat_wording
 *  (ikke-blank) — briefets afgraensning af, hvad der skal "undersoeges".
 *  {slug, field_name, value_number, caveat_wording, traef}[]. */
export function belaegRaekker(robotter) {
  const ud = [];
  for (const raa of robotter) {
    for (const fe of raa.field_entries ?? []) {
      if (fe.value_number === null || fe.value_number === undefined) continue;
      if (typeof fe.caveat_wording !== 'string' || fe.caveat_wording.trim() === '') continue;
      ud.push({
        slug: raa.slug, field_name: fe.field_name,
        value_number: fe.value_number, caveat_wording: fe.caveat_wording,
        traef: ordlydIndeholderTal(fe.caveat_wording, fe.value_number),
      });
    }
  }
  return ud;
}

function koerBelaeg(robotter, producent) {
  const filtreret = filtrerProducent(robotter, producent);
  const raekker = belaegRaekker(filtreret);
  const medTraef = raekker.filter((r) => r.traef);
  const udenTraef = raekker.filter((r) => !r.traef);
  console.log(`FASE2-TJEK --belaeg${producent ? ` --producent="${producent}"` : ''}`);
  console.log('Konservativ konsistenskontrol (PLAN.md par. 0): staar value_number i den citerede caveat_wording?');
  console.log('Et manglende traef er et SPOeRGSMAaL TIL ET MENNESKE, ikke en fejl — enheder kan vaere omregnet,');
  console.log('og formen kan afvige fra dette scripts konservative gaet (se talformer()s kommentar).');
  if (udenTraef.length) {
    console.log(`\nUDEN TRAeF (${udenTraef.length}):`);
    for (const r of udenTraef) {
      const uddrag = r.caveat_wording.length > 100 ? `${r.caveat_wording.slice(0, 100)}…` : r.caveat_wording;
      console.log(`  ${r.slug} · ${r.field_name} · value_number=${r.value_number} · caveat_wording: "${uddrag}"`);
    }
  }
  console.log(`\nUndersoegt: ${raekker.length} · med traef: ${medTraef.length} · uden traef: ${udenTraef.length}`);
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
  if (flag['dansk']) return koerDansk(robotter, producent);
  if (flag['belaeg']) return koerBelaeg(robotter, producent);

  return 2;
}

const erHoved = process.argv[1] && path.resolve(process.argv[1]).endsWith('fase2-tjek.mjs');
if (erHoved) {
  hoved().then((k) => process.exit(k)).catch((e) => {
    console.error(String(e && e.stack ? e.stack : e));
    process.exit(1);
  });
}
