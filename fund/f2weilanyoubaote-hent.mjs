#!/usr/bin/env node
/**
 * fund/f2weilanyoubaote-hent.mjs — henter og dumper ALLE field_entries +
 * applications + robots-tekster for WEILAN og Shandong Youbaote Intelligent
 * Robot, til inspektion og som snapshot (brief punkt 8a / OPSKRIFT §5).
 * LÆS-KUN — genbruger hentRobotter()/filtrerProducent() fra fase2-tjek.mjs.
 *
 * Brug: node fund/f2weilanyoubaote-hent.mjs <navn>
 *   <navn> bruges til udfilernes navn: fund/f2weilanyoubaote-<navn>.json/.txt
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { hentRobotter, filtrerProducent } from '../db/fase2-tjek.mjs';

const ROD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function hoved() {
  const navn = process.argv[2] || 'uddrag';
  const robotter = await hentRobotter();
  const weilan = filtrerProducent(robotter, 'WEILAN');
  const youbaote = filtrerProducent(robotter, 'Shandong Youbaote Intelligent Robot');
  const alle = [...weilan, ...youbaote];

  const udfil = path.join(ROD, 'fund', `f2weilanyoubaote-${navn}.json`);
  fs.writeFileSync(udfil, JSON.stringify(alle, null, 2), 'utf8');
  console.log(`Skrev ${alle.length} robotter (${weilan.length} WEILAN + ${youbaote.length} Youbaote) til ${udfil}`);

  for (const r of alle) {
    console.log(`\n=== ${r.slug} (id ${r.id}, ${r.manufacturer}) ===`);
    for (const fe of r.field_entries ?? []) {
      if (fe.caveat || fe.caveat_wording) {
        console.log(`  [${fe.field_name}]`);
        if (fe.caveat) console.log(`    caveat: ${fe.caveat}`);
        if (fe.caveat_wording) console.log(`    caveat_wording: ${fe.caveat_wording}`);
        if (fe.caveat_class) console.log(`    caveat_class: ${fe.caveat_class}`);
      }
    }
    if (r.notes) console.log(`  robots.notes: ${JSON.stringify(r.notes)}`);
    if (r.notes_wording) console.log(`  robots.notes_wording: ${JSON.stringify(r.notes_wording)}`);
    if (r.applications?.note) console.log(`  applications.note: ${JSON.stringify(r.applications.note)}`);
    if (r.applications?.note_wording) console.log(`  applications.note_wording: ${JSON.stringify(r.applications.note_wording)}`);
    if (r.applications?.quote) console.log(`  applications.quote: ${JSON.stringify(r.applications.quote)}`);
  }
  return 0;
}

hoved().then((k) => { process.exitCode = k; }).catch((e) => {
  console.error(String(e && e.stack ? e.stack : e));
  process.exitCode = 1;
});
