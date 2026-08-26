/**
 * tools/maal-enheder-visning.mjs — spor/enheder, acceptkriterium 1.
 *
 * Taeller, hvilke(n) enhed(er) hvert af de ni "blandede" felter viser i et
 * BYGGET robots.json (dist/robots.json's `alle_felter`, samme kilde som
 * /sammenligning/'s inline JSON og kortenes/robotsidernes egne tal - se
 * skema.mjs' normaliserVisningsEnheder()). Efter spor/enheder skal hvert af
 * de otte felter (alt undtagen `pris`) vise PRAECIS ÉN enhed; `haeldning`
 * er en dokumenteret undtagelse (° og % - to dimensioner, se skema.mjs);
 * `pris` er bevidst udeladt (CLAUDE.md-briefets regel 1b).
 *
 * Brug:
 *   node tools/maal-enheder-visning.mjs [dist-e/robots.json]
 */
import fs from 'node:fs';
import path from 'node:path';

const fil = path.resolve(process.argv[2] ?? 'dist/robots.json');
const data = JSON.parse(fs.readFileSync(fil, 'utf8'));

const FELTER = [
  'laengde', 'bredde', 'hoejde', 'forhindring_enkelt',
  'hastighed', 'driftstid', 'ladetid', 'haeldning', 'pris',
];

const taelling = {};
for (const f of FELTER) taelling[f] = {};

for (const r of data.robotter) {
  for (const navn of FELTER) {
    const v = r.alle_felter?.[navn];
    if (!v || v.tilstand !== 'tal') continue;
    const e = v.enhed ?? '(ingen)';
    taelling[navn][e] = (taelling[navn][e] || 0) + 1;
  }
}

let fejl = 0;
for (const navn of FELTER) {
  const enheder = Object.keys(taelling[navn]);
  const ok = navn === 'pris' ? enheder.length >= 1 // pris SKAL fortsat vise flere valutaer
    : navn === 'haeldning' ? true // dokumenteret undtagelse, se skema.mjs
      : enheder.length <= 1;
  if (!ok) fejl++;
  console.log(`${navn.padEnd(20)} ${JSON.stringify(taelling[navn])}${ok ? '' : '  <-- FEJL: flere enheder'}`);
}
console.log(`\n${FELTER.length} felter tjekket, ${fejl} fejl.`);
process.exit(fejl ? 1 : 0);
