/* Efterprøvning (a) fra BRIEF-FAELLES.md: talkolonnerne maa ikke have roert
 * sig. Diff'er fund/f2-genisom-snapshot-foer.json mod -efter.json paa ALLE
 * kolonner UNDTAGEN dem, sporet har lov at roere.
 * Brug: node fund/f2-genisom-talkolonne-diff.mjs
 */
import fs from 'node:fs';

const foer = JSON.parse(fs.readFileSync('fund/f2-genisom-snapshot-foer.json', 'utf8'));
const efter = JSON.parse(fs.readFileSync('fund/f2-genisom-snapshot-efter.json', 'utf8'));

const TILLADT_FE = new Set(['caveat', 'caveat_wording', 'caveat_class', 'value_text', 'collected_by', 'change_reason']);
const TILLADT_APP = new Set(['note', 'collected_by', 'change_reason']);
const TILLADT_IMG = new Set(['note', 'collected_by', 'change_reason']);
const TILLADT_ROB = new Set(['notes', 'notes_wording', 'collected_by', 'change_reason']);

function diffRows(foerRows, efterRows, key, tilladt, label) {
  const foerMap = new Map(foerRows.map((r) => [key(r), r]));
  let diffs = 0;
  for (const e of efterRows) {
    const f = foerMap.get(key(e));
    if (!f) { console.log('NY RÆKKE', label, key(e)); continue; }
    for (const k of Object.keys(e)) {
      if (tilladt.has(k)) continue;
      const a = JSON.stringify(f[k]);
      const b = JSON.stringify(e[k]);
      if (a !== b) {
        diffs++;
        console.log('DIFF UDEN FOR TILLADT', label, key(e), k, ':', a, '->', b);
      }
    }
  }
  return diffs;
}

let total = 0;
total += diffRows(foer.field_entries, efter.field_entries, (r) => r.robot_id + '/' + r.field_name, TILLADT_FE, 'field_entries');
total += diffRows(foer.applications, efter.applications, (r) => r.robot_id, TILLADT_APP, 'applications');
total += diffRows(foer.images, efter.images, (r) => r.robot_id, TILLADT_IMG, 'images');
total += diffRows(foer.robots, efter.robots, (r) => r.id, TILLADT_ROB, 'robots');
console.log('TOTAL diffs uden for tilladte kolonner (forventer 0):', total);
