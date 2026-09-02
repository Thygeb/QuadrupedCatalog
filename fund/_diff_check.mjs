import fs from 'node:fs';
const foer = JSON.parse(fs.readFileSync('fund/_snapshot-foer.json', 'utf8'));
const efter = JSON.parse(fs.readFileSync('fund/_snapshot-efter.json', 'utf8'));

// field_entries: alt undtagen caveat, caveat_wording, caveat_class, value_text,
// collected_by, change_reason maa IKKE roere sig.
const FE_ROERT = new Set(['caveat', 'caveat_wording', 'caveat_class', 'value_text', 'collected_by', 'change_reason']);
function diffRows(foerRows, efterRows, key, tilladt, navn) {
  const foerMap = new Map(foerRows.map(r => [JSON.stringify(key(r)), r]));
  const efterMap = new Map(efterRows.map(r => [JSON.stringify(key(r)), r]));
  let uventedeFejl = 0;
  for (const [k, fr] of foerMap) {
    const er = efterMap.get(k);
    if (!er) { console.log(navn, 'RÆKKE FORSVUNDET:', k); uventedeFejl++; continue; }
    for (const felt of new Set([...Object.keys(fr), ...Object.keys(er)])) {
      if (tilladt.has(felt)) continue;
      const a = JSON.stringify(fr[felt]);
      const b = JSON.stringify(er[felt]);
      if (a !== b) {
        console.log(navn, 'UVENTET DIFF', k, felt, ':', a, '->', b);
        uventedeFejl++;
      }
    }
  }
  return uventedeFejl;
}

let total = 0;
total += diffRows(foer.field_entries, efter.field_entries, r => ({ robot_id: r.robot_id, field_name: r.field_name }), FE_ROERT, 'field_entries');
total += diffRows(foer.applications, efter.applications, r => ({ robot_id: r.robot_id }), new Set(['note', 'collected_by', 'change_reason']), 'applications');
total += diffRows(foer.images, efter.images, r => ({ robot_id: r.robot_id }), new Set(['note', 'collected_by', 'change_reason']), 'images');
total += diffRows(foer.robots, efter.robots, r => ({ id: r.id }), new Set(['notes', 'collected_by', 'change_reason']), 'robots');

console.log('\nUVENTEDE DIFFS I ALT (forventer 0):', total);
