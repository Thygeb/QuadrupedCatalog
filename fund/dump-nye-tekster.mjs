import { FIELD_ENTRIES, VALUE_TEXT_ONLY, APPLICATIONS, IMAGES, ROBOTS } from '../db/f2-vest-skriv.mjs';
const DANSKE_ORD = /\b(producenten|producentens|oplyst|oplyser|ikke|samme|kilde|kilden|kilder|angiver|staar|står|vaerdi|værdi|tallet|siden|derfor|hverken|hvorfor|mens|uden|indeholder|noteret|maalt|målt|skemaet|feltet|naermeste|nærmeste)\b/i;
const ae = (s) => /[æøåÆØÅ]/.test(s || '');
const dansk = (s) => ae(s) || DANSKE_ORD.test(s || '');
let n = 0, flagged = 0;
const out = [];
function tjek(label, tekst) {
  if (tekst == null) return;
  n++;
  const d = dansk(tekst);
  if (d) flagged++;
  out.push(`[${d ? 'DANSK?' : '      '}] ${label}: ${tekst}`);
}
for (const r of FIELD_ENTRIES) {
  tjek(`${r.robot_id}/${r.field_name} caveat`, r.caveat);
  tjek(`${r.robot_id}/${r.field_name} caveat_wording`, r.caveat_wording);
  if (r.value_text !== undefined) tjek(`${r.robot_id}/${r.field_name} value_text`, r.value_text);
}
for (const r of VALUE_TEXT_ONLY) tjek(`${r.robot_id}/${r.field_name} value_text(only)`, r.value_text);
for (const a of APPLICATIONS) tjek(`${a.robot_id} applications.note`, a.note);
for (const im of IMAGES) tjek(`${im.robot_id} images.note`, im.note);
for (const r of ROBOTS) r.notes.forEach((note, i) => tjek(`${r.robot_id} notes[${i}]`, note));
console.log(out.join('\n'));
console.log(`\n--- N=${n} tekster, dansk-detektoren flager ${flagged} ---`);
