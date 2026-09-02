import fs from 'node:fs';
for (const l of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^([A-Z_]+)=(.*)$/); if (m) process.env[m[1]] = m[2].trim();
}
const U = process.env.SUPABASE_URL, K = process.env.SUPABASE_SERVICE_ROLE_KEY;
const H = { apikey: K, Authorization: `Bearer ${K}`, Prefer: 'count=exact' };
const s = await fetch(`${U}/rest/v1/change_log?changed_by=eq.spor%2Ff2-unitree&select=id`, { headers: H, method: 'HEAD' });
console.log('change_log rows for spor/f2-unitree:', s.headers.get('content-range'));
const s2 = await fetch(`${U}/rest/v1/change_log?select=id`, { headers: H, method: 'HEAD' });
console.log('change_log rows TOTAL:', s2.headers.get('content-range'));
