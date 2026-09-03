import fs from 'node:fs';
for (const l of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^([A-Z_]+)=(.*)$/); if (m) process.env[m[1]] = m[2].trim();
}
const U = process.env.SUPABASE_URL, K = process.env.SUPABASE_SERVICE_ROLE_KEY;
const H = { apikey: K, Authorization: `Bearer ${K}` };
const ids = '2184,2185,2187,2188,2214,2215,2216,2217,2218,2225,2228,2229,2230';
const q = async (p) => { const s = await fetch(`${U}/rest/v1/${p}`, { headers: H });
  if (!s.ok) { console.error('HTTP', s.status, await s.text()); process.exitCode = 1; throw new Error('fejl'); } return s.json(); };
const DANSKE_ORD = /\b(producenten|producentens|oplyst|oplyser|ikke|samme|kilde|kilden|kilder|angiver|staar|står|vaerdi|værdi|tallet|siden|derfor|hverken|hvorfor|mens|uden|indeholder|noteret|maalt|målt|skemaet|feltet|naermeste|nærmeste|grundlaeggende|grundlæggende)\b/i;
const ae = (s) => /[æøåÆØÅ]/.test(s || '');
const dansk = (s) => ae(s) || DANSKE_ORD.test(s || '');
const rows = await q(`field_entries?robot_id=in.(${ids})&value_text=not.is.null&select=robot_id,field_name,value_text`);
for (const r of rows) console.log(r.robot_id, r.field_name, JSON.stringify(r.value_text), dansk(r.value_text) ? 'DANSK' : '');
console.log('total', rows.length, 'dansk', rows.filter(r=>dansk(r.value_text)).length);
