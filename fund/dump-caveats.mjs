/* Dumper alle caveat/note/notes-tekster fra FOER-snapshottet i laesbar form,
   grupperet pr. robot, til brug ved klassificering. */
import fs from 'node:fs';
const d = JSON.parse(fs.readFileSync('fund/snapshot-foer-f2vest.json', 'utf8'));
const bySlug = {};
for (const r of d.robots) bySlug[r.id] = r.slug;
const out = [];
for (const id of d.robots.map(r=>r.id).sort((a,b)=>a-b)) {
  out.push(`\n########## ${id} ${bySlug[id]} ##########`);
  const felter = d.felter.filter(f => f.robot_id === id && f.caveat != null);
  for (const f of felter) {
    out.push(`--- field_entries: ${f.field_name} ---`);
    out.push(`value_number=${f.value_number} value_text=${JSON.stringify(f.value_text)} unit=${f.unit} operator=${f.operator}`);
    out.push(`caveat: ${f.caveat}`);
    out.push(`caveat_wording: ${JSON.stringify(f.caveat_wording)}`);
    out.push(`caveat_class: ${JSON.stringify(f.caveat_class)}`);
  }
  const app = d.applications.find(a => a.robot_id === id);
  if (app) {
    out.push(`--- applications ---`);
    out.push(`note: ${app.note}`);
    out.push(`note_wording: ${JSON.stringify(app.note_wording)}`);
    out.push(`quote: ${JSON.stringify(app.quote)}`);
    out.push(`quote_wording: ${JSON.stringify(app.quote_wording)}`);
  }
  const img = d.images.find(i => i.robot_id === id);
  if (img && img.note) {
    out.push(`--- images ---`);
    out.push(`note: ${img.note}`);
  }
  const rob = d.robots.find(r => r.id === id);
  if (rob && Array.isArray(rob.notes) && rob.notes.length) {
    out.push(`--- robots.notes (${rob.notes.length}) ---`);
    rob.notes.forEach((n,idx) => out.push(`[${idx}] ${n}`));
    out.push(`notes_wording: ${JSON.stringify(rob.notes_wording)}`);
  }
}
fs.writeFileSync('fund/dump-caveats-f2vest.txt', out.join('\n'), 'utf8');
console.log('skrevet fund/dump-caveats-f2vest.txt,', out.length, 'linjer');
