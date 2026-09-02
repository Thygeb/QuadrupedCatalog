import fs from 'node:fs';
import { FIELD_ENTRIES, APPLICATIONS, IMAGES, ROBOTS_NOTES } from '../db/f2-unitree-skriv.mjs';
let n = 0;
for (const r of FIELD_ENTRIES) {
  n++;
  console.log(`--- FE ${n} ${r.robot_id}/${r.field_name} ---`);
  console.log('caveat:', r.caveat);
  console.log('caveat_wording:', r.caveat_wording);
  if ('value_text' in r) console.log('value_text:', r.value_text);
}
for (const a of APPLICATIONS) { n++; console.log(`--- APP ${n} ${a.robot_id} ---`); console.log(a.note); }
for (const im of IMAGES) { n++; console.log(`--- IMG ${n} ${im.robot_id} ---`); console.log(im.note); }
for (const [rid, notes] of Object.entries(ROBOTS_NOTES)) { n++; console.log(`--- ROBOTS ${n} ${rid} ---`); notes.forEach((x,i)=>console.log(`[${i}]`, x)); }
console.log('\nTOTAL TEKSTENHEDER:', n);
