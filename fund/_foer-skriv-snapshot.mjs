import fs from 'node:fs';
for (const l of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^([A-Z_]+)=(.*)$/); if (m) process.env[m[1]] = m[2].trim();
}
const U = process.env.SUPABASE_URL, K = process.env.SUPABASE_SERVICE_ROLE_KEY;
const H = { apikey: K, Authorization: `Bearer ${K}` };
const ids = '2231,2232,2233,2234,2235,2236,2237,2238,2239,2240,2241,2242,2243';
const fe = await (await fetch(`${U}/rest/v1/field_entries?robot_id=in.(${ids})&select=*&order=robot_id,field_name`, { headers: H })).json();
const app = await (await fetch(`${U}/rest/v1/applications?robot_id=in.(${ids})&select=*&order=robot_id`, { headers: H })).json();
const img = await (await fetch(`${U}/rest/v1/images?robot_id=in.(${ids})&select=*&order=robot_id`, { headers: H })).json();
const rob = await (await fetch(`${U}/rest/v1/robots?id=in.(${ids})&select=*&order=id`, { headers: H })).json();
fs.writeFileSync(process.argv[2] || 'fund/_snapshot.json', JSON.stringify({ field_entries: fe, applications: app, images: img, robots: rob }, null, 2));
console.log('field_entries', fe.length, 'applications', app.length, 'images', img.length, 'robots', rob.length);
