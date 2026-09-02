/* Efterproevning (a)+(b) for spor/f2-vest, jf. BRIEF-FAELLES.md.
   (a) Talkolonne-diff: FOER vs EFTER-snapshot, alle kolonner UNDTAGEN dem
       spor/f2-vest maa roere.
   (b) change_log: taeller raekker med changed_by='spor/f2-vest', og hvor
       mange der ligger UDENFOR vores 13 robot_id'er. */
import fs from 'node:fs';
for (const l of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^([A-Z_]+)=(.*)$/); if (m) process.env[m[1]] = m[2].trim();
}
const U = process.env.SUPABASE_URL, K = process.env.SUPABASE_SERVICE_ROLE_KEY;
const H = { apikey: K, Authorization: `Bearer ${K}` };
const q = async (p) => { const s = await fetch(`${U}/rest/v1/${p}`, { headers: H });
  if (!s.ok) { console.error('HTTP', s.status, await s.text()); process.exitCode = 1; throw new Error('fejl'); } return s.json(); };

const ids = [2184,2185,2187,2188,2214,2215,2216,2217,2218,2225,2228,2229,2230];
const idsQ = ids.join(',');

// --- (a) talkolonne-diff -----------------------------------------------
const foer = JSON.parse(fs.readFileSync('fund/snapshot-foer-f2vest.json', 'utf8'));
const efter = {
  felter: await q(`field_entries?robot_id=in.(${idsQ})&select=*&order=robot_id,field_name`),
  applications: await q(`applications?robot_id=in.(${idsQ})&select=*&order=robot_id`),
  images: await q(`images?robot_id=in.(${idsQ})&select=*&order=robot_id`),
  robots: await q(`robots?id=in.(${idsQ})&select=*&order=id`),
};
fs.writeFileSync('fund/snapshot-efter-f2vest.json', JSON.stringify(efter, null, 1), 'utf8');

const TILLADT_FELTER = new Set(['caveat', 'caveat_wording', 'caveat_class', 'value_text', 'collected_by', 'change_reason']);
const TILLADT_APP = new Set(['note', 'collected_by', 'change_reason']);
const TILLADT_IMG = new Set(['note', 'collected_by', 'change_reason']);
const TILLADT_ROB = new Set(['notes', 'notes_wording', 'collected_by', 'change_reason']);

let diffAntal = 0;
const diffLinjer = [];
function sammenlign(tabel, foerRows, efterRows, noegleFn, tilladt) {
  const foerMap = new Map(foerRows.map(r => [noegleFn(r), r]));
  const efterMap = new Map(efterRows.map(r => [noegleFn(r), r]));
  for (const [key, fRow] of foerMap) {
    const eRow = efterMap.get(key);
    if (!eRow) { diffAntal++; diffLinjer.push(`${tabel} ${key}: raekke FORSVUNDET`); continue; }
    const alleKolonner = new Set([...Object.keys(fRow), ...Object.keys(eRow)]);
    for (const kol of alleKolonner) {
      if (tilladt.has(kol)) continue;
      const fv = JSON.stringify(fRow[kol]);
      const ev = JSON.stringify(eRow[kol]);
      if (fv !== ev) { diffAntal++; diffLinjer.push(`${tabel} ${key} .${kol}: ${fv} -> ${ev}`); }
    }
  }
  for (const key of efterMap.keys()) {
    if (!foerMap.has(key)) { diffAntal++; diffLinjer.push(`${tabel} ${key}: NY raekke (uventet)`); }
  }
}
sammenlign('field_entries', foer.felter, efter.felter, r => `${r.robot_id}/${r.field_name}`, TILLADT_FELTER);
sammenlign('applications', foer.applications, efter.applications, r => `${r.robot_id}`, TILLADT_APP);
sammenlign('images', foer.images, efter.images, r => `${r.robot_id}`, TILLADT_IMG);
sammenlign('robots', foer.robots, efter.robots, r => `${r.id}`, TILLADT_ROB);

console.log('=== (a) Talkolonne-diff ===');
console.log('kontrol: forventer 0 diffs uden for de tilladte kolonner');
console.log('Diffs fundet:', diffAntal);
if (diffAntal) diffLinjer.forEach(l => console.log(' -', l));

// --- (b) change_log ------------------------------------------------------
const logRows = await q(`change_log?changed_by=eq.spor%2Ff2-vest&select=table_name,row_key,changed_at`);
console.log('\n=== (b) change_log ===');
console.log('kontrol: forventer 158 raekker med changed_by=spor/f2-vest (vores skrivetal)');
console.log('Fundet:', logRows.length);
const udenforVoresRobotter = logRows.filter(r => {
  const rk = r.row_key;
  const rid = rk.robot_id ?? rk.id;
  return !ids.includes(rid);
});
console.log('Rows UDENFOR vores 13 robot_id (forventer 0):', udenforVoresRobotter.length);
if (udenforVoresRobotter.length) console.log(udenforVoresRobotter);

const pr_tabel = {};
for (const r of logRows) pr_tabel[r.table_name] = (pr_tabel[r.table_name] || 0) + 1;
console.log('Pr. tabel:', pr_tabel);
