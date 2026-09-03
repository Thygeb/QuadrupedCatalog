import fs from 'node:fs';
import { FIELD_ENTRIES, APPLICATIONS, IMAGES, ROBOTS_NOTES } from '../db/f2-unitree-skriv.mjs';
for (const l of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^([A-Z_]+)=(.*)$/); if (m) process.env[m[1]] = m[2].trim();
}
const U = process.env.SUPABASE_URL, K = process.env.SUPABASE_SERVICE_ROLE_KEY;
const H = { apikey: K, Authorization: `Bearer ${K}` };

let checked = 0, mismatches = 0;

for (const r of FIELD_ENTRIES) {
  const rows = await (await fetch(`${U}/rest/v1/field_entries?robot_id=eq.${r.robot_id}&field_name=eq.${r.field_name}&select=caveat,caveat_wording,value_text`, { headers: H })).json();
  const db = rows[0];
  checked++;
  if (db.caveat !== r.caveat) { mismatches++; console.log('MISMATCH caveat', r.robot_id, r.field_name); }
  if ((db.caveat_wording ?? null) !== (r.caveat_wording ?? null)) { mismatches++; console.log('MISMATCH caveat_wording', r.robot_id, r.field_name); }
  if ('value_text' in r && db.value_text !== r.value_text) { mismatches++; console.log('MISMATCH value_text', r.robot_id, r.field_name); }
}

for (const a of APPLICATIONS) {
  const rows = await (await fetch(`${U}/rest/v1/applications?robot_id=eq.${a.robot_id}&select=note`, { headers: H })).json();
  checked++;
  if (rows[0].note !== a.note) { mismatches++; console.log('MISMATCH applications.note', a.robot_id); }
}

for (const im of IMAGES) {
  const rows = await (await fetch(`${U}/rest/v1/images?robot_id=eq.${im.robot_id}&select=note`, { headers: H })).json();
  checked++;
  if (rows[0].note !== im.note) { mismatches++; console.log('MISMATCH images.note', im.robot_id); }
}

for (const [robotId, notes] of Object.entries(ROBOTS_NOTES)) {
  const rows = await (await fetch(`${U}/rest/v1/robots?id=eq.${robotId}&select=notes`, { headers: H })).json();
  checked++;
  if (JSON.stringify(rows[0].notes) !== JSON.stringify(notes)) { mismatches++; console.log('MISMATCH robots.notes', robotId); }
}

console.log(`\nUTF-8/exakthedstjek: ${checked} felter tjekket (=== mod PRÆCIS samme datastruktur, importeret), ${mismatches} mismatches.`);
