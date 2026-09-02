import fs from 'node:fs';
import { FIELD_ENTRIES } from '../db/f2-unitree-skriv.mjs';
for (const l of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^([A-Z_]+)=(.*)$/); if (m) process.env[m[1]] = m[2].trim();
}
const U = process.env.SUPABASE_URL, K = process.env.SUPABASE_SERVICE_ROLE_KEY;
const H = { apikey: K, Authorization: `Bearer ${K}`, 'Content-Type': 'application/json', Prefer: 'return=representation' };
const r = FIELD_ENTRIES.find(x => x.robot_id === 2240 && x.field_name === 'compute');
const body = { caveat: r.caveat, caveat_wording: r.caveat_wording, value_text: r.value_text, collected_by: 'spor/f2-unitree', change_reason: r.reason + ' (rettelse: foerste skriv havde en afkortet caveat_wording)' };
const url = `${U}/rest/v1/field_entries?robot_id=eq.2240&field_name=eq.compute`;
const svar = await fetch(url, { method: 'PATCH', headers: H, body: JSON.stringify(body) });
const json = await svar.json();
console.log('status', svar.status, 'raekker', json.length, json);
