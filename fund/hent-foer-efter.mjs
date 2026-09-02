/* Henter ALLE field_entries + applications + images + robots-raekker for
   spor/f2-vests 13 robotter, gemmer som JSON. Bruges baade til FOER- og
   EFTER-snapshot til (a)-efterproevningen (talkolonne-diff).
   Brug: node fund/hent-foer-efter.mjs <foer|efter> */
import fs from 'node:fs';
for (const l of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^([A-Z_]+)=(.*)$/); if (m) process.env[m[1]] = m[2].trim();
}
const U = process.env.SUPABASE_URL, K = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!U || !K) { console.error('mangler SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY i .env'); process.exit(1); }
const H = { apikey: K, Authorization: `Bearer ${K}` };
const q = async (p) => { const s = await fetch(`${U}/rest/v1/${p}`, { headers: H });
  if (!s.ok) { console.error('HTTP', s.status, await s.text()); process.exitCode = 1; throw new Error('HTTP fejl ' + s.status); } return s.json(); };
const which = process.argv[2];
if (which !== 'foer' && which !== 'efter') { console.error('brug: node fund/hent-foer-efter.mjs <foer|efter>'); process.exit(1); }
const ids = '2184,2185,2187,2188,2214,2215,2216,2217,2218,2225,2228,2229,2230';
const i = `robot_id=in.(${ids})`;
const felter = await q(`field_entries?${i}&select=*&order=robot_id,field_name`);
const app    = await q(`applications?${i}&select=*&order=robot_id`);
const img    = await q(`images?${i}&select=*&order=robot_id`);
const rob    = await q(`robots?id=in.(${ids})&select=*&order=id`);
const ud = { felter, applications: app, images: img, robots: rob };
fs.writeFileSync(`fund/snapshot-${which}-f2vest.json`, JSON.stringify(ud, null, 1), 'utf8');
console.log('gemt fund/snapshot-' + which + '-f2vest.json —', felter.length, 'field_entries,', app.length, 'applications,', img.length, 'images,', rob.length, 'robots');
