#!/usr/bin/env node
// Arbejdsfil til spor/f2weilan — grundmåling, genbruger hentRobotter() fra
// db/fase2-tjek.mjs (ingen egen .env-læser, ingen egen fetch-logik).
import { hentRobotter } from '../db/fase2-tjek.mjs';

const MAALPRODUCENTER = new Set(['WEILAN', 'Shandong Youbaote Intelligent Robot']);
const CITAT_REGEX = /"[^"]{3,}"|[«»""]/;

const robotter = await hentRobotter();
const raekker = [];
for (const r of robotter) {
  if (!MAALPRODUCENTER.has(r.manufacturer)) continue;
  for (const fe of r.field_entries ?? []) {
    const caveat = fe.caveat;
    const wording = fe.caveat_wording;
    const harCaveat = typeof caveat === 'string' && caveat !== '';
    const manglerWording = wording === null || wording === undefined || wording === '';
    if (harCaveat && manglerWording) {
      raekker.push({
        manufacturer: r.manufacturer, robot_id: r.id, slug: r.slug,
        field_name: fe.field_name, caveat, source: fe.source,
        medCitat: CITAT_REGEX.test(caveat),
      });
    }
  }
}

const prProducent = new Map();
for (const raa of raekker) {
  const p = prProducent.get(raa.manufacturer) ?? { raekker: 0, robotter: new Set(), medCitat: 0, kilder: new Set() };
  p.raekker++;
  p.robotter.add(raa.robot_id);
  if (raa.medCitat) p.medCitat++;
  if (raa.source) p.kilder.add(raa.source);
  prProducent.set(raa.manufacturer, p);
}

console.log('GRUNDMÅLING spor/f2weilan');
for (const [navn, p] of prProducent) {
  console.log(`${navn}: raekker=${p.raekker} robotter=${p.robotter.size} med_citat=${p.medCitat} unikke_kilder=${p.kilder.size}`);
}
console.log(`I ALT: ${raekker.length}`);

console.log('\n--- RÆKKER ---');
for (const raa of raekker) {
  console.log(`${raa.robot_id}\t${raa.slug}\t${raa.field_name}\t${raa.medCitat ? 'CITAT' : 'ingen'}\t${JSON.stringify(raa.source)}\t${JSON.stringify(raa.caveat)}`);
}

process.exitCode = 0;
