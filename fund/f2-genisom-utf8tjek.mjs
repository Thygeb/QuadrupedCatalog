/* UTF-8-kontrollen fra OPSKRIFT-fase2-cjk.md: hent hver skrevet kolonne
 * tilbage og sammenlign med === (JSON string-lighed) mod PRÆCIS det, der
 * blev sendt - importeret direkte fra db/f2-genisom-skriv.mjs, ikke
 * kopieret, saa de to ikke kan skride fra hinanden.
 * Brug: node fund/f2-genisom-utf8tjek.mjs  (kraever fund/f2-genisom-snapshot-efter.json)
 */
import fs from 'node:fs';
import { FIELD_ENTRIES, APPLICATIONS, IMAGES, ROBOTS } from '../db/f2-genisom-skriv.mjs';

const efter = JSON.parse(fs.readFileSync('fund/f2-genisom-snapshot-efter.json', 'utf8'));

const feMap = new Map(efter.field_entries.map((r) => [r.robot_id + '/' + r.field_name, r]));
let fejl = 0;
let tjekket = 0;
for (const r of FIELD_ENTRIES) {
  const e = feMap.get(r.robot_id + '/' + r.field_name);
  tjekket++;
  if (e.caveat !== r.caveat || e.caveat_wording !== r.caveat_wording) {
    fejl++;
    console.log('UTF8-MISMATCH', r.robot_id, r.field_name);
  }
  if ('value_text' in r && e.value_text !== r.value_text) {
    fejl++;
    console.log('VALUE_TEXT-MISMATCH', r.robot_id, r.field_name);
  }
}
const appMap = new Map(efter.applications.map((r) => [r.robot_id, r]));
for (const a of APPLICATIONS) {
  tjekket++;
  if (appMap.get(a.robot_id).note !== a.note) { fejl++; console.log('APP-MISMATCH', a.robot_id); }
}
const imgMap = new Map(efter.images.map((r) => [r.robot_id, r]));
for (const im of IMAGES) {
  tjekket++;
  if (imgMap.get(im.robot_id).note !== im.note) { fejl++; console.log('IMG-MISMATCH', im.robot_id); }
}
const robMap = new Map(efter.robots.map((r) => [r.id, r]));
for (const rb of ROBOTS) {
  tjekket++;
  const e = robMap.get(rb.id);
  if (JSON.stringify(e.notes) !== JSON.stringify(rb.notes) || JSON.stringify(e.notes_wording) !== JSON.stringify(rb.notes_wording)) {
    fejl++;
    console.log('ROBOTS-MISMATCH', rb.id);
  }
}
console.log('UTF-8/indhold-tjek:', tjekket, 'sammenligninger,', fejl, 'fejl (forventer 0)');
