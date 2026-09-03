#!/usr/bin/env node
// fund/f2han-tjek-og-generer.mjs — tjekker f2han-data.mjs (43 raekker, ingen
// CJK i nye caveat-tekster, ingen dubletter) og genererer én JSON-batch pr.
// producent til db/f2-skriv.mjs. Skriver ALDRIG til databasen selv.
import fs from 'node:fs';
import path from 'node:path';
import { BATCHES } from './f2han-data.mjs';

const CJK = /[一-鿿]/;
let total = 0;
let fejl = 0;
const set = new Set();
for (const [producent, rows] of Object.entries(BATCHES)) {
  for (const r of rows) {
    total++;
    const noegle = `${r.robot_id}:${r.field_name}`;
    if (set.has(noegle)) { console.error(`DUBLET: ${noegle}`); fejl++; }
    set.add(noegle);
    if (CJK.test(r.caveat)) { console.error(`CJK STADIG I caveat: ${noegle}: ${r.caveat}`); fejl++; }
    if (!r.reason) { console.error(`MANGLER reason: ${noegle}`); fejl++; }
  }
}
console.log(`I alt raekker: ${total} (forventer 43)`);
console.log(`Fejl fundet: ${fejl}`);
if (fejl) process.exitCode = 1;

const udDir = path.resolve('fund/f2han-batches');
fs.mkdirSync(udDir, { recursive: true });
for (const [producent, rows] of Object.entries(BATCHES)) {
  const poster = rows.map((r) => {
    const saet = { caveat: r.caveat };
    if (r.caveat_wording !== undefined) saet.caveat_wording = r.caveat_wording;
    return {
      tabel: 'field_entries',
      noegle: { robot_id: r.robot_id, field_name: r.field_name },
      saet,
      change_reason: r.reason,
    };
  });
  const fil = path.join(udDir, `${producent}.json`);
  fs.writeFileSync(fil, JSON.stringify(poster, null, 2), 'utf8');
  console.log(`skrevet: ${fil} (${poster.length} poster)`);
}
