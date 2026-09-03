/* Findes alle citations-kandidat-fragmenter (dobbelt-anfoerselstegn) i hver
 * raekkes NUVAERENDE caveat_wording/notes_wording/note, og tjekker hvert
 * fragment mod SAMTLIGE raa-kildefiler i media/_kilder/raa-genisom-2026-08-24/.
 * Output: for hver raekke, for hvert fragment, hvilke(n) fil(er) det findes
 * BOGSTAVELIGT i (eller INGEN). Rent efterprøvningsredskab, skriver intet.
 *
 * Brug: node fund/f2-genisom-fragtjek.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const KILDE_DIR = path.resolve('media/_kilder/raa-genisom-2026-08-24');
const filer = fs.readdirSync(KILDE_DIR).filter((f) => /\.(html|json|txt)$/.test(f));
const indhold = new Map();
for (const f of filer) indhold.set(f, fs.readFileSync(path.join(KILDE_DIR, f), 'utf8'));

function fragmenter(wording) {
  if (!wording) return [];
  const dele = [];
  const re = /"([^"]*)"/g;
  let m;
  while ((m = re.exec(wording))) if (m[1].trim()) dele.push(m[1]);
  return dele;
}

// Proever: (1) heltmatch, (2) split paa foerste ": " (etiket+vaerdi i to
// separate DOM-celler/JSON-felter, samlet med kollektorens ": "-konvention),
// (3) split paa foerste blanktegn. Rapporterer hvilken metode der lykkedes.
function findFiler(frag) {
  const helt = [];
  for (const [f, txt] of indhold) if (txt.includes(frag)) helt.push(f);
  if (helt.length) return { metode: 'helt', filer: helt };

  const iKolon = frag.indexOf(': ');
  if (iKolon > 0) {
    const etiket = frag.slice(0, iKolon).trim();
    const vaerdi = frag.slice(iKolon + 2).trim();
    const split = [];
    for (const [f, txt] of indhold) if (txt.includes(etiket) && txt.includes(vaerdi)) split.push(f);
    if (split.length) return { metode: `split ": " ("${etiket}" + "${vaerdi}")`, filer: split };
  }

  const iSpace = frag.indexOf(' ');
  if (iSpace > 0) {
    const etiket = frag.slice(0, iSpace).trim();
    const vaerdi = frag.slice(iSpace + 1).trim();
    const split = [];
    for (const [f, txt] of indhold) if (txt.includes(etiket) && txt.includes(vaerdi)) split.push(f);
    if (split.length) return { metode: `split blank ("${etiket}" + "${vaerdi}")`, filer: split };
  }
  return { metode: null, filer: [] };
}

const d = JSON.parse(fs.readFileSync('fund/f2-genisom-snapshot-foer.json', 'utf8'));

console.log('=== field_entries.caveat_wording ===');
for (const r of d.field_entries) {
  if (r.caveat_wording == null) continue;
  const frags = fragmenter(r.caveat_wording);
  console.log(`\n[${r.robot_id}] ${r.field_name}`);
  if (frags.length === 0) {
    console.log('  (ingen anfoerselstegn-fragmenter — hele strengen):', JSON.stringify(r.caveat_wording));
    continue;
  }
  for (const frag of frags) {
    const f = findFiler(frag);
    console.log(`  "${frag}" ->`, f.filer.length ? `[${f.metode}] ${f.filer.join(', ')}` : 'INGEN FIL');
  }
}

console.log('\n=== applications.note/quote_wording ===');
for (const r of d.applications) {
  console.log(`\n[${r.robot_id}] note`);
  const frags = fragmenter(r.note);
  for (const frag of frags) {
    const f = findFiler(frag);
    console.log(`  "${frag}" ->`, f.filer.length ? `[${f.metode}] ${f.filer.join(', ')}` : 'INGEN FIL');
  }
  if (r.quote_wording) {
    console.log(`[${r.robot_id}] quote_wording:`, JSON.stringify(r.quote_wording));
  }
}

console.log('\n=== robots.notes_wording ===');
for (const r of d.robots) {
  const arr = Array.isArray(r.notes_wording) ? r.notes_wording : [];
  arr.forEach((w, idx) => {
    console.log(`\n[${r.id}] notes_wording[${idx}]`);
    const frags = fragmenter(w);
    if (frags.length === 0) { console.log('  (ingen fragmenter):', JSON.stringify(w)); return; }
    for (const frag of frags) {
      const f = findFiler(frag);
      console.log(`  "${frag}" ->`, f.filer.length ? `[${f.metode}] ${f.filer.join(', ')}` : 'INGEN FIL');
    }
  });
}

console.log('\n=== images.note ===');
for (const r of d.images) {
  console.log(`\n[${r.robot_id}] images.note:`, JSON.stringify(r.note));
}
