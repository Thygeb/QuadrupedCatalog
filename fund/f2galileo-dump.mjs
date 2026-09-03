#!/usr/bin/env node
/**
 * fund/f2galileo-dump.mjs — LAeS-KUN hjaelpescript, ejet af spor/f2-galileo
 * (genoptagelsen). Dumper de fulde raa DB-raekker (field_entries,
 * applications, images, robots) for en given producent til en JSON-fil, saa
 * jeg kan laese/klassificere/oversaette teksterne offline uden gentagne
 * netkald. Genbruger hentRobotter/filtrerProducent fra db/fase2-tjek.mjs
 * (importeret, ikke kopieret - L30-princippet). Skriver ALDRIG til databasen.
 *
 * Brug: node fund/f2galileo-dump.mjs "<producentnavn>" <udfil.json>
 */
import fs from 'node:fs';
import { hentRobotter, filtrerProducent, findProducent } from '../db/fase2-tjek.mjs';

const [, , producentArg, udfilArg] = process.argv;
if (!producentArg || !udfilArg) {
  console.error('Brug: node fund/f2galileo-dump.mjs "<producentnavn>" <udfil.json>');
  process.exitCode = 2;
} else {
  const robotter = await hentRobotter();
  const { match, gyldige } = findProducent(producentArg, robotter);
  if (!match) {
    console.error(`Ukendt producent: "${producentArg}". Gyldige: ${gyldige.join(', ')}`);
    process.exitCode = 2;
  } else {
    const filtreret = filtrerProducent(robotter, match).sort((a, b) => a.id - b.id);
    fs.writeFileSync(udfilArg, JSON.stringify(filtreret, null, 2), 'utf8');
    console.log(`Skrevet ${filtreret.length} robot(ter) for "${match}" til ${udfilArg}`);
    process.exitCode = 0;
  }
}
