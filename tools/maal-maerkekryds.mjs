/**
 * maal-maerkekryds.mjs — maerker siden PRAECIS de felter, dataen doemmer?
 *
 *   node tools/maal-maerkekryds.mjs
 *
 * Maalt 28. aug 2026: 77 robotter, 2.310 feltposter, 259 dt-maerker,
 * 0 afvigelser. Var D18 bygget forkert, ville tallet vaere 562 (begge
 * klasser maerket) eller 0 (klassen naar aldrig skabelonerne).
 */
/* Efterproevning felt for felt: for HVER robot sammenlignes de felter, YAML'en
   klassificerer som "gyldighed", med de feltnavne, robotsidens feltliste
   faktisk maerker. Ikke en stikproeve - alle 77. */
import fs from 'node:fs';
import { parseYaml } from './yaml.mjs';
import { normaliserRobot, erGyldighedsforbehold } from './skema.mjs';

const i18n = JSON.parse(fs.readFileSync('data/i18n/da.json', 'utf8'));
let robotter = 0, felterTjekt = 0, fejl = 0, maerkerIAlt = 0;
const afvig = [];

for (const f of fs.readdirSync('data/robots').filter(x => x.endsWith('.yaml'))) {
  const slug = f.replace(/\.yaml$/, '');
  const sti = `dist/da/robotter/${slug}/index.html`;
  if (!fs.existsSync(sti)) { afvig.push(`${slug}: ingen side`); fejl++; continue; }
  robotter++;
  const r = normaliserRobot(parseYaml(fs.readFileSync(`data/robots/${f}`, 'utf8'), f));
  const html = fs.readFileSync(sti, 'utf8');

  // Forventet: feltnavnenes OVERSATTE etiketter for de gyldigheds-klassificerede
  const forventet = new Set();
  for (const [navn, post] of Object.entries(r.felter || {})) {
    felterTjekt++;
    if (erGyldighedsforbehold(post)) {
      const etiket = i18n['felt_' + navn];
      if (etiket) forventet.add(etiket);
    }
  }
  // Faktisk: <dt class="m-etiket">Etiket</dt> i feltlisten
  const faktisk = new Set(
    [...html.matchAll(/<dt class="m-etiket">([^<]*)<\/dt>/g)].map(m =>
      m[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"')));
  maerkerIAlt += faktisk.size;

  for (const e of forventet) if (!faktisk.has(e)) { afvig.push(`${slug}: FORVENTET men ikke maerket: ${e}`); fejl++; }
  for (const a of faktisk) if (!forventet.has(a)) { afvig.push(`${slug}: MAERKET men ikke gyldighed: ${a}`); fejl++; }
}
console.log(`robotter efterproevet : ${robotter}`);
console.log(`feltposter gennemgaaet: ${felterTjekt}`);
console.log(`distinkte dt-maerker   : ${maerkerIAlt}`);
console.log(`AFVIGELSER             : ${fejl}`);
for (const a of afvig.slice(0, 15)) console.log('  ' + a);
