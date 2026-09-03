#!/usr/bin/env node
/**
 * fund/f2feje-utf8-tjek.mjs — ejet af spor/f2-feje. UTF-8-kontrollen fra
 * OPSKRIFT-fase2-cjk.md: hent hver skrevet kolonne TILBAGE fra databasen og
 * sammenlign med === (streng-lighed, ingen normalisering) mod PRAeCIS det,
 * der blev sendt — genbruger samme datastruktur (poster), ikke en
 * genindtastet kopi.
 */
import { hentRobotter } from '../db/fase2-tjek.mjs';
import { poster as genisom } from './f2feje-genisom-payload.mjs';
import { poster as fire } from './f2feje-fire-payload.mjs';

async function hoved() {
  const robotter = await hentRobotter();
  const appByRobotId = new Map(robotter.map((r) => [r.id, r.applications]));
  let ok = 0, fejl = 0;
  for (const post of [...genisom, ...fire]) {
    const levende = appByRobotId.get(post.noegle.robot_id);
    for (const [kolonne, forventet] of Object.entries(post.saet)) {
      const faktisk = levende ? levende[kolonne] : undefined;
      const ens = JSON.stringify(faktisk) === JSON.stringify(forventet);
      if (ens) ok++; else { fejl++; console.log(`AFVIGELSE robot_id=${post.noegle.robot_id} ${kolonne}:\n  sendt:  ${JSON.stringify(forventet)}\n  i db:   ${JSON.stringify(faktisk)}`); }
    }
  }
  console.log(`UTF-8/indhold-kontrol: ${ok} kolonner ens, ${fejl} afvigelser (forventer 0 afvigelser).`);
}
hoved().then(() => { process.exitCode = 0; }).catch((e) => { console.error(e); process.exitCode = 1; });
