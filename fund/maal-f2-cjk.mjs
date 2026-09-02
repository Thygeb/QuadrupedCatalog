#!/usr/bin/env node
/**
 * fund/maal-f2-cjk.mjs — spor/f2-cjk's ENGANGS-måleredskab (ejet af dette
 * spor alene, jf. BRIEF-f2-cjk.md's filejerskab). Genskabt efter
 * beskrivelsen i briefet — søstersporet spor/f2-pilot har sit eget
 * (fund/maal-f2.mjs), og det varige instrument er db/fase2-tjek.mjs
 * (spor/f2-maal). De tre duplikerer HVER ANDEN MED VILJE, så tre
 * parallelle spor ikke venter på hinanden (se BRIEF-f2-cjk.md linje 63-65).
 *
 * Læser .env, henter over PostgREST (LÆS-KUN, ingen skrivning her), og
 * tæller danske strenge pr. tekstkolonne for de robot_id'er, der gives på
 * kommandolinjen. To ben, som briefet kræver:
 *
 *   1. æøå-scan   — findes æ/ø/å (store eller små) ANGET i strengen.
 *   2. stopords-scan — et ord (>=3 tegn, split på a-z efter lowercase) fra
 *      en kurateret liste danske funktionsord UDEN æøå i egen stavning
 *      (fx "ikke", "med", "kan", "skal") — fordi en del danske sætninger i
 *      kataloget slet ikke bruger et æøå-tegn (målt: 116 advarsler i hele
 *      kataloget). 2-bogstavsord ("er", "se", "og", "på" osv.) er BEVIDST
 *      udeladt af listen: de kolliderer for let med forkortelser og andre
 *      sprog. Ord, der selv indeholder æøå (fx "på", "både", "også"),
 *      behøver ikke stå i listen — de fanges allerede af ben 1.
 *
 * En streng er "dansk", hvis mindst ét af de to ben slår til (OR, ikke AND).
 *
 * Brug:
 *   node fund/maal-f2-cjk.mjs <robot_id>[,<robot_id>...]
 *
 * Eksempel (spor/f2-cjk's egne to robotter):
 *   node fund/maal-f2-cjk.mjs 2186,2258
 *
 * Ingen npm-afhængigheder. Kræver SUPABASE_URL og SUPABASE_SERVICE_ROLE_KEY
 * i .env (samme mønster som db/eksporter.mjs's laesDotEnv).
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function laesDotEnv(fil) {
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

/* ---------------------------------------------------------- dansk-detektor */

const AEOEAA = /[æøåÆØÅ]/;

// Kurateret, IKKE udtømmende. Kun ord på 3+ bogstaver, ingen æøå i egen
// stavning (dem fanger ben 1 allerede). Formålet er ben 2's egen opgave:
// danske saetninger der IKKE bruger et æøå-tegn nogen steder.
// RETTET efter foerste koersel mod de skrevne engelske tekster: 'men'
// (engelsk flertal af "man"), 'dog' (KRITISK paa en robothunde-side —
// ordet vil forekomme konstant i legitim engelsk prosa), 'under' og
// 'over' (begge almindelige engelske praepositioner) gav falske
// positiver paa ellers ren engelsk tekst ("under development", "under
// the ... tab") og er derfor FJERNET. Ingen af de 35 oprindelige danske
// tal (32/29 osv., braevets facit) hvilede paa disse fem ord — samtlige
// blev fanget af aeoeaa alene (efterproevet), saa rettelsen aendrer ikke
// braevets allerede bekraeftede grundtal, kun stopords-benets praecision
// paa engelsk tekst herefter.
const STOPORD = new Set([
  'ikke', 'med', 'som', 'der', 'det', 'den', 'denne', 'disse', 'samt',
  'eller', 'hvis', 'fordi', 'meget', 'alle', 'ingen', 'uden', 'efter',
  'mellem', 'ved', 'fra', 'til', 'har', 'kan', 'skal', 'vil',
  'var', 'bliver', 'blev', 'ville', 'skulle', 'kunne', 'burde', 'selv',
  'samme', 'andet', 'anden', 'andre', 'hvor', 'hvordan', 'hvilken', 'hvilke',
  'netop', 'dermed', 'derfor', 'heller', 'stadig', 'allerede', 'begge',
  'hvert', 'hver', 'deres', 'vores', 'jeres', 'dette', 'disse',
  'ogsaa', 'nogle', 'noget', 'ingen', 'kunne', 'skulle', 'ville', 'bliver',
  'sammenligning', 'producenten', 'kilden', 'siden', 'oplyst', 'oplyses',
]);

function erDansk(streng) {
  if (!streng) return false;
  if (AEOEAA.test(streng)) return true;
  const ord = streng.toLowerCase().match(/[a-z]+/g) || [];
  for (const w of ord) {
    if (w.length >= 3 && STOPORD.has(w)) return true;
  }
  return false;
}

function ikkeTom(v) {
  return typeof v === 'string' && v.trim() !== '';
}

/** notes/notes_wording er jsonb: null, ren streng, eller liste af strenge.
 *  Flad ud til en liste af ELEMENTER (0, 1 eller N), uden at filtrere
 *  tomme fra — en tom-streng-plads TÆLLER som et element (briefet: "ét af
 *  dine tre er en tom streng"), den er blot ikke dansk. */
function fladUd(v) {
  if (v === null || v === undefined) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') return [v];
  return [];
}

/* ------------------------------------------------------------------ main */

async function main() {
  const argIds = process.argv[2];
  if (!argIds) {
    console.error('Brug: node fund/maal-f2-cjk.mjs <robot_id>[,<robot_id>...]');
    process.exit(1);
  }
  const ids = argIds.split(',').map((s) => s.trim()).filter(Boolean);
  if (ids.some((id) => !/^\d+$/.test(id))) {
    console.error('robot_id skal være heltal, adskilt af komma.');
    process.exit(1);
  }

  laesDotEnv(path.join(ROD, '.env'));
  const U = process.env.SUPABASE_URL;
  const K = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!U || !K) {
    console.error('Kræver SUPABASE_URL og SUPABASE_SERVICE_ROLE_KEY i .env (se db/LAESMIG.md).');
    process.exit(1);
  }
  const H = { apikey: K, Authorization: `Bearer ${K}` };
  const idListe = ids.join(',');

  const [fe, ap, im, ro] = await Promise.all([
    fetch(`${U}/rest/v1/field_entries?robot_id=in.(${idListe})&select=robot_id,field_name,caveat,caveat_wording`, { headers: H }).then((r) => r.json()),
    fetch(`${U}/rest/v1/applications?robot_id=in.(${idListe})&select=robot_id,note`, { headers: H }).then((r) => r.json()),
    fetch(`${U}/rest/v1/images?robot_id=in.(${idListe})&select=robot_id,note`, { headers: H }).then((r) => r.json()),
    fetch(`${U}/rest/v1/robots?id=in.(${idListe})&select=id,slug,notes,notes_wording`, { headers: H }).then((r) => r.json()),
  ]);

  if (!Array.isArray(fe) || !Array.isArray(ap) || !Array.isArray(im) || !Array.isArray(ro)) {
    console.error('Uventet svar fra PostgREST (forventede lister):', { fe, ap, im, ro });
    process.exit(1);
  }

  const slugs = ro.map((r) => r.slug).join(', ');

  // caveat + "heraf uden ordlyd"
  const caveatRaekker = fe.filter((r) => ikkeTom(r.caveat));
  const caveatDansk = caveatRaekker.filter((r) => erDansk(r.caveat)).length;
  const udenOrdlyd = caveatRaekker.filter((r) => !ikkeTom(r.caveat_wording)).length;

  // caveat_wording
  const wordingRaekker = fe.filter((r) => ikkeTom(r.caveat_wording));
  const wordingDansk = wordingRaekker.filter((r) => erDansk(r.caveat_wording)).length;

  // applications.note
  const apNoter = ap.filter((r) => ikkeTom(r.note));
  const apDansk = apNoter.filter((r) => erDansk(r.note)).length;

  // images.note
  const imNoter = im.filter((r) => ikkeTom(r.note));
  const imDansk = imNoter.filter((r) => erDansk(r.note)).length;

  // robots.notes (elementer)
  const notesElementer = ro.flatMap((r) => fladUd(r.notes));
  const notesDansk = notesElementer.filter((s) => erDansk(s)).length;

  // robots.notes_wording (elementer)
  const notesWordingElementer = ro.flatMap((r) => fladUd(r.notes_wording));
  const notesWordingDansk = notesWordingElementer.filter((s) => erDansk(s)).length;

  const lin = (etiket, n, d) => {
    const dTekst = d === null ? '-'.padStart(4) : String(d).padStart(4);
    console.log(`${etiket.padEnd(30)} ${String(n).padStart(3)} | dansk: ${dTekst}`);
  };

  console.log(`robotter: ${slugs}`);
  lin('caveat', caveatRaekker.length, caveatDansk);
  lin('  heraf uden ordlyd', udenOrdlyd, null);
  lin('caveat_wording', wordingRaekker.length, wordingDansk);
  lin('applications.note', apNoter.length, apDansk);
  lin('images.note', imNoter.length, imDansk);
  lin('robots.notes (elementer)', notesElementer.length, notesDansk);
  lin('robots.notes_wording (el.)', notesWordingElementer.length, notesWordingDansk);
}

main().catch((err) => {
  console.error('maal-f2-cjk: fejl —', err.message);
  process.exit(1);
});
