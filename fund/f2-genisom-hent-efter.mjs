import fs from 'node:fs';
for (const l of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^([A-Z_]+)=(.*)$/); if (m) process.env[m[1]] = m[2].trim();
}
const U = process.env.SUPABASE_URL, K = process.env.SUPABASE_SERVICE_ROLE_KEY;
const H = { apikey: K, Authorization: `Bearer ${K}` };
const q = async (p) => { const s = await fetch(`${U}/rest/v1/${p}`, { headers: H });
  if (!s.ok) { console.error('HTTP', s.status, await s.text()); process.exitCode = 1; throw new Error('HTTP fejl'); } return s.json(); };
const ids = '2205,2206,2207,2208,2209,2210,2211,2212,2213';
const i = `robot_id=in.(${ids})`;
const fe = await q(`field_entries?${i}&select=*&order=robot_id,field_name`);
const app = await q(`applications?${i}&select=*&order=robot_id`);
const img = await q(`images?${i}&select=*&order=robot_id`);
const rob = await q(`robots?id=in.(${ids})&select=*&order=id`);
fs.writeFileSync('fund/f2-genisom-snapshot-efter.json', JSON.stringify({ field_entries: fe, applications: app, images: img, robots: rob }, null, 2));
console.log('field_entries', fe.length, 'applications', app.length, 'images', img.length, 'robots', rob.length);
