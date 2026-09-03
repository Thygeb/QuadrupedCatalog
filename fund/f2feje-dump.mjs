#!/usr/bin/env node
/**
 * fund/f2feje-dump.mjs — arbejdsfil ejet af spor/f2-feje. Dumper de danske
 * celler (note_wording, quote, quote_wording) for de fem producenter, jf.
 * BRIEF-f2-feje.md afsnit 2, til JSON i fund/f2feje-data/ til gennemsyn og
 * senere sammenligning mod media/_kilder/.
 * Læs-kun: skriver ALDRIG til databasen.
 */
import fs from 'node:fs';
import path from 'node:path';
import { hentRobotter, filtrerProducent, findProducent } from '../db/fase2-tjek.mjs';

const PRODUCENTER = ['GENISOM AI', 'Astrall Dynamics', 'CVTE', 'Yufan Intelligent', 'Xiaomi'];

async function hoved() {
  const robotter = await hentRobotter();
  const udDir = path.resolve('fund/f2feje-data');
  fs.mkdirSync(udDir, { recursive: true });
  for (const navn of PRODUCENTER) {
    const { match } = findProducent(navn, robotter);
    if (!match) { console.error(`Ukendt producent: ${navn}`); continue; }
    const filtreret = filtrerProducent(robotter, match);
    const ud = filtreret.map((r) => ({
      robot_id: r.id,
      slug: r.slug,
      manufacturer: r.manufacturer,
      applications: r.applications ? {
        note: r.applications.note ?? null,
        note_wording: r.applications.note_wording ?? null,
        quote: r.applications.quote ?? null,
        quote_wording: r.applications.quote_wording ?? null,
      } : null,
    }));
    const fil = path.join(udDir, `${match.replace(/[^A-Za-z0-9]+/g, '-')}.json`);
    fs.writeFileSync(fil, JSON.stringify(ud, null, 2), 'utf8');
    console.log(`${match}: ${ud.length} robot(ter) -> ${fil}`);
  }
}

hoved().then(() => { process.exitCode = 0; }).catch((e) => {
  console.error(String(e && e.stack ? e.stack : e));
  process.exitCode = 1;
});
