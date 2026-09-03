import fs from 'node:fs';
for (const l of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^([A-Z_]+)=(.*)$/); if (m) process.env[m[1]] = m[2].trim();
}
const U = process.env.SUPABASE_URL, K = process.env.SUPABASE_SERVICE_ROLE_KEY;
const H = { apikey: K, Authorization: `Bearer ${K}` };
const s = await fetch(`${U}/rest/v1/change_log?changed_by=eq.spor%2Ff2-genisom&select=id,table_name,row_key,changed_by&order=id`, { headers: H });
if (!s.ok) { console.error('HTTP', s.status, await s.text()); process.exitCode = 1; }
else {
  const rows = await s.json();
  console.log('change_log raekker for spor/f2-genisom (forventer 174):', rows.length);
  const buckets = {};
  for (const r of rows) buckets[r.table_name] = (buckets[r.table_name]||0)+1;
  console.log(buckets);
  const idsAllowed = new Set([2205,2206,2207,2208,2209,2210,2211,2212,2213]);
  let uden = 0;
  for (const r of rows) {
    const id = r.row_key.robot_id ?? r.row_key.id;
    if (!idsAllowed.has(id)) { uden++; console.log('UDEN FOR EGNE ROBOTTER:', JSON.stringify(r)); }
  }
  console.log('raekker uden for egne 9 robotter (forventer 0):', uden);
}

const s2 = await fetch(`${U}/rest/v1/change_log?select=id&changed_by=neq.spor%2Ff2-genisom&row_key=cs.{}`, { headers: H });
