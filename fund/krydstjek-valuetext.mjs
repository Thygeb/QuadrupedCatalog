import fs from 'node:fs';
import { FIELD_ENTRIES, VALUE_TEXT_ONLY } from '../db/f2-vest-skriv.mjs';

const d = JSON.parse(fs.readFileSync('fund/snapshot-foer-f2vest.json', 'utf8'));
const alle32 = d.felter.filter(f => f.value_text != null);
const rørerJeg = new Set([
  ...FIELD_ENTRIES.filter(r => r.value_text !== undefined).map(r => `${r.robot_id}/${r.field_name}`),
  ...VALUE_TEXT_ONLY.map(r => `${r.robot_id}/${r.field_name}`),
]);
console.log('value_text raekker total:', alle32.length, '| jeg aendrer:', rørerJeg.size);
console.log('\nIKKE aendret (skal alle vaere allerede-engelske koder/tal):');
for (const f of alle32) {
  const k = `${f.robot_id}/${f.field_name}`;
  if (!rørerJeg.has(k)) console.log(' ', k, JSON.stringify(f.value_text));
}
