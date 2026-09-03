#!/usr/bin/env node
// fund/f2han-selvtjek.mjs — spor/f2han: sammenligner ALLE 43 planlagte
// raekker (fund/f2han-data.mjs) mod det, der FAKTISK staar i databasen nu,
// felt for felt. LAeS-KUN.
import { laesForbindelse } from '../db/fase2-tjek.mjs';
import { BATCHES } from './f2han-data.mjs';

const { url, headers } = laesForbindelse();
let talt = 0;
let fejl = 0;
for (const [producent, rows] of Object.entries(BATCHES)) {
  for (const r of rows) {
    talt++;
    const svar = await fetch(
      `${url}/rest/v1/field_entries?robot_id=eq.${r.robot_id}&field_name=eq.${r.field_name}&select=caveat,caveat_wording`,
      { headers },
    );
    const [nu] = await svar.json();
    if (!nu) { console.log(`FEJL: ${producent} ${r.robot_id}:${r.field_name} — raekke ikke fundet`); fejl++; continue; }
    if (nu.caveat !== r.caveat) {
      console.log(`FEJL caveat: ${producent} ${r.robot_id}:${r.field_name}\n  forventet: ${r.caveat}\n  faktisk:   ${nu.caveat}`);
      fejl++;
    }
    const forventetWording = r.caveat_wording !== undefined ? r.caveat_wording : null;
    if (forventetWording !== null && nu.caveat_wording !== forventetWording) {
      console.log(`FEJL caveat_wording: ${producent} ${r.robot_id}:${r.field_name}\n  forventet: ${forventetWording}\n  faktisk:   ${nu.caveat_wording}`);
      fejl++;
    }
  }
}
console.log(`\nEfterproevet: ${talt} raekker (forventer 43). Fejl: ${fejl} (forventer 0).`);
process.exitCode = fejl ? 1 : 0;
