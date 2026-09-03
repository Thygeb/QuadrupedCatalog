import fs from 'node:fs';
for (const l of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^([A-Z_]+)=(.*)$/); if (m) process.env[m[1]] = m[2].trim();
}
const U = process.env.SUPABASE_URL, K = process.env.SUPABASE_SERVICE_ROLE_KEY;
const H = { apikey: K, Authorization: `Bearer ${K}` };
const ids = '2231,2232,2233,2234,2235,2236,2237,2238,2239,2240,2241,2242,2243';
const rows = await (await fetch(`${U}/rest/v1/field_entries?robot_id=in.(${ids})&value_text=not.is.null&select=robot_id,field_name,value_text`, { headers: H })).json();
const DANSKE_ORD = /\b(producenten|producentens|oplyst|oplyser|ikke|samme|kilde|kilden|kilder|angiver|staar|står|vaerdi|værdi|tallet|siden|derfor|hverken|hvorfor|mens|uden|indeholder|noteret|maalt|målt|skemaet|feltet|naermeste|nærmeste|kerner|kerne)\b/i;
const ae = (s) => /[æøåÆØÅ]/.test(s || '');
const dansk = (s) => ae(s) || DANSKE_ORD.test(s || '');
console.log('value_text i alt (forventer 35, uaendret - kun 2 raekker oversat, ikke fjernet):', rows.length);
console.log('dansk-tal MED "kerner" tilfoejet til ordlisten (forventer 0):', rows.filter(r => dansk(r.value_text)).length);
for (const r of rows.filter(r => dansk(r.value_text))) console.log('STADIG DANSK:', r.robot_id, r.field_name, r.value_text);
