/* Krydstjekker db/f2-vest-skriv.mjs's FIELD_ENTRIES mod de 127 rigtige
   caveat-baerende raekker i FOER-snapshottet - ingen glemt, ingen ekstra,
   ingen forkert robot_id/field_name. */
import fs from 'node:fs';
import { FIELD_ENTRIES, VALUE_TEXT_ONLY } from '../db/f2-vest-skriv.mjs';

const d = JSON.parse(fs.readFileSync('fund/snapshot-foer-f2vest.json', 'utf8'));
const ægte = new Set(d.felter.filter(f => f.caveat != null).map(f => `${f.robot_id}/${f.field_name}`));
const mine = new Set(FIELD_ENTRIES.map(r => `${r.robot_id}/${r.field_name}`));

console.log('FIELD_ENTRIES raekker:', FIELD_ENTRIES.length, '(forventer 127)');
console.log('Unikke robot_id/field_name i FIELD_ENTRIES:', mine.size);

const manglerIMin = [...ægte].filter(k => !mine.has(k));
const ekstraIMin = [...mine].filter(k => !ægte.has(k));
console.log('Mangler i FIELD_ENTRIES (findes i DB, ikke i scriptet):', manglerIMin.length, manglerIMin);
console.log('Ekstra i FIELD_ENTRIES (findes i scriptet, ikke som caveat i DB):', ekstraIMin.length, ekstraIMin);

// value_text-only raekker: caveat=null i dag, kun value_text aendres.
const valTextÆgte = new Set(d.felter.filter(f => f.value_text != null).map(f => `${f.robot_id}/${f.field_name}`));
console.log('\nVALUE_TEXT_ONLY raekker:', VALUE_TEXT_ONLY.length);
for (const r of VALUE_TEXT_ONLY) {
  const nøgle = `${r.robot_id}/${r.field_name}`;
  console.log(' ', nøgle, valTextÆgte.has(nøgle) ? 'OK (har value_text i dag)' : 'FEJL: ingen value_text i DB i dag');
}

// Robot-id daekning: alle 13 skal vaere repraesenteret i EN af de to lister
// eller i ROBOTS/APPLICATIONS (spirit-40 har 0 field_entries).
const forventet13 = [2184,2185,2187,2188,2214,2215,2216,2217,2218,2225,2228,2229,2230];
const dækket = new Set([...FIELD_ENTRIES.map(r=>r.robot_id), ...VALUE_TEXT_ONLY.map(r=>r.robot_id)]);
console.log('\nRobot-id UDEN nogen field_entries-raekke i scriptet (forventer kun 2214):',
  forventet13.filter(id => !dækket.has(id)));
