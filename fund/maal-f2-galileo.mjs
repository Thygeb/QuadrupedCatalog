/* Maaleredskab for et fase 2-spor. Koeres FOER og EFTER arbejdet.
   Brug:  node fund/maal-f2.mjs <robot_id[,robot_id...]> */
import fs from 'node:fs';
for (const l of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^([A-Z_]+)=(.*)$/); if (m) process.env[m[1]] = m[2].trim();
}
const U = process.env.SUPABASE_URL, K = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!U || !K) { console.error('mangler SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY i .env'); process.exit(1); }
const H = { apikey: K, Authorization: `Bearer ${K}` };
const q = async (p) => { const s = await fetch(`${U}/rest/v1/${p}`, { headers: H });
  if (!s.ok) { console.error('HTTP', s.status, await s.text()); process.exitCode = 1; } return s.json(); };
const DANSKE_ORD = /\b(producenten|producentens|oplyst|oplyser|ikke|samme|kilde|kilden|kilder|angiver|staar|står|vaerdi|værdi|tallet|siden|derfor|hverken|hvorfor|mens|uden|indeholder|noteret|maalt|målt|skemaet|feltet|naermeste|nærmeste)\b/i;
const ae = (s) => /[æøåÆØÅ]/.test(s || '');
const dansk = (s) => ae(s) || DANSKE_ORD.test(s || '');
const tael = (a, f) => a.filter(f).length;
const ids = process.argv[2];
if (!ids) { console.error('brug: node fund/maal-f2.mjs <robot_id[,robot_id]>'); process.exit(1); }
const i = `robot_id=in.(${ids})`;
const cav  = await q(`field_entries?${i}&caveat=not.is.null&select=robot_id,field_name,caveat,caveat_wording`);
const app  = await q(`applications?${i}&select=robot_id,note,note_wording,quote,quote_wording`);
const img  = await q(`images?${i}&select=robot_id,note`);
const rob  = await q(`robots?id=in.(${ids})&select=id,slug,notes,notes_wording`);
const ordl = cav.filter(r => r.caveat_wording != null);
const notesEl  = rob.flatMap(r => Array.isArray(r.notes) ? r.notes : []);
const notesOrd = rob.flatMap(r => Array.isArray(r.notes_wording) ? r.notes_wording : []);
const linje = (navn, n, d) => console.log(navn.padEnd(28), String(n).padStart(4), '| dansk:', String(d).padStart(4));
console.log('robotter:', rob.map(r => r.slug).join(', '));
linje('caveat', cav.length, tael(cav, r => dansk(r.caveat)));
linje('  heraf uden ordlyd', tael(cav, r => r.caveat_wording == null), '-');
linje('caveat_wording', ordl.length, tael(ordl, r => dansk(r.caveat_wording)));
linje('applications.note', tael(app, r => r.note != null), tael(app, r => r.note != null && dansk(r.note)));
linje('images.note', tael(img, r => r.note != null), tael(img, r => r.note != null && dansk(r.note)));
linje('robots.notes (elementer)', notesEl.length, tael(notesEl, dansk));
linje('robots.notes_wording (el.)', notesOrd.length, tael(notesOrd, dansk));
