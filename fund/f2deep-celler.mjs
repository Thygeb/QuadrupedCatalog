#!/usr/bin/env node
// fund/f2deep-celler.mjs — samme klassifikation som db/fase2-tjek.mjs
// --dansk (erDansk, ordret genbrugt), men paa CELLE-niveau i stedet for
// summeret, saa jeg praecist kan se HVILKE af de 110 danske celler jeg
// skal oversaette. Genbruger erDansk() direkte fra fase2-tjek.mjs (ingen
// ny kopi af ordlisten).
import fs from 'node:fs';
import { erDansk } from '../db/fase2-tjek.mjs';

const raw = JSON.parse(fs.readFileSync(new URL('./f2deep-raw-foer.json', import.meta.url), 'utf8'));

const celler = [];
function tilf(robotId, felt, kolonne, vaerdi) {
  if (typeof vaerdi !== 'string' || vaerdi.trim() === '') return;
  if (erDansk(vaerdi)) celler.push({ robotId, felt, kolonne, vaerdi });
}

for (const r of raw) {
  for (const fe of (r.field_entries ?? [])) {
    tilf(r.id, fe.field_name, 'caveat', fe.caveat);
    tilf(r.id, fe.field_name, 'caveat_wording', fe.caveat_wording);
  }
  const apps = Array.isArray(r.applications) ? r.applications : (r.applications ? [r.applications] : []);
  for (const a of apps) {
    tilf(r.id, 'applications', 'note', a.note);
    tilf(r.id, 'applications', 'note_wording', a.note_wording);
    tilf(r.id, 'applications', 'quote', a.quote);
    tilf(r.id, 'applications', 'quote_wording', a.quote_wording);
  }
  const imgs = Array.isArray(r.images) ? r.images : (r.images ? [r.images] : []);
  for (const im of imgs) {
    tilf(r.id, `images(${im.id ?? '?'})`, 'note', im.note);
    if (im.alt && typeof im.alt === 'object') tilf(r.id, `images(${im.id ?? '?'})`, 'alt.en', im.alt.en);
  }
  const notes = Array.isArray(r.notes) ? r.notes : (r.notes ? [r.notes] : []);
  notes.forEach((n, i) => tilf(r.id, 'robots', `notes[${i}]`, n));
  const notesW = Array.isArray(r.notes_wording) ? r.notes_wording : (r.notes_wording ? [r.notes_wording] : []);
  notesW.forEach((n, i) => tilf(r.id, 'robots', `notes_wording[${i}]`, n));
}

fs.writeFileSync(new URL('./f2deep-celler.json', import.meta.url), JSON.stringify(celler, null, 2), 'utf8');
console.log(`${celler.length} danske celler fundet (forventer 110)`);
const prKolonne = new Map();
for (const c of celler) prKolonne.set(c.kolonne, (prKolonne.get(c.kolonne) ?? 0) + 1);
for (const [k, n] of prKolonne) console.log(`  ${k}: ${n}`);
