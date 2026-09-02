import fs from 'node:fs';
for (const l of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^([A-Z_]+)=(.*)$/); if (m) process.env[m[1]] = m[2].trim();
}
const U = process.env.SUPABASE_URL, K = process.env.SUPABASE_SERVICE_ROLE_KEY;
const H = { apikey: K, Authorization: `Bearer ${K}` };
const MINE = new Set([2231,2232,2233,2234,2235,2236,2237,2238,2239,2240,2241,2242,2243]);
const rows = await (await fetch(`${U}/rest/v1/change_log?changed_by=eq.spor%2Ff2-unitree&select=table_name,row_key,operation`, { headers: H })).json();
console.log('total rows for spor/f2-unitree:', rows.length);
let udenfor = 0;
const perTable = {};
for (const r of rows) {
  perTable[r.table_name] = (perTable[r.table_name]||0)+1;
  const rid = r.row_key.robot_id ?? r.row_key.id;
  if (!MINE.has(rid)) { udenfor++; console.log('UDENFOR:', r.table_name, r.row_key); }
}
console.log('per table:', perTable);
console.log('raekker UDENFOR mine 13 robotter:', udenfor);
