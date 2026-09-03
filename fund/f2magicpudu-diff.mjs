#!/usr/bin/env node
/**
 * fund/f2magicpudu-diff.mjs — diff FOER/EFTER-snapshots (fra
 * f2magicpudu-snapshot.mjs) på ALLE kolonner UNDTAGEN dem, sporet har lov at
 * røre (caveat, collected_by, change_reason, updated_at/lignende
 * metadata-tidsstempler). Bruges til BRIEF-FAELLES's efterprøvning (a).
 */
import fs from 'node:fs';
import process from 'node:process';

const TILLADT_AENDRET = new Set(['caveat', 'collected_by', 'change_reason']);
const IGNORER_ALTID = new Set(['updated_at', 'created_at']); // rene metadata-tidsstempler, ikke data

function hoved() {
  const [foerFil, efterFil] = process.argv.slice(2);
  if (!foerFil || !efterFil) { console.error('Brug: node f2magicpudu-diff.mjs <foer.json> <efter.json>'); return 2; }
  const foer = JSON.parse(fs.readFileSync(foerFil, 'utf8')).rows;
  const efter = JSON.parse(fs.readFileSync(efterFil, 'utf8')).rows;
  const noegle = (r) => `${r.robot_id}::${r.field_name}`;
  const efterMap = new Map(efter.map((r) => [noegle(r), r]));
  let uventedeAendringer = 0;
  const detaljer = [];
  if (foer.length !== efter.length) {
    console.log(`ADVARSEL: raekkeantal aendrede sig: ${foer.length} -> ${efter.length}`);
  }
  for (const rF of foer) {
    const rE = efterMap.get(noegle(rF));
    if (!rE) { console.log(`MANGLER EFTER: ${noegle(rF)}`); uventedeAendringer++; continue; }
    const alleNoegler = new Set([...Object.keys(rF), ...Object.keys(rE)]);
    for (const k of alleNoegler) {
      if (TILLADT_AENDRET.has(k) || IGNORER_ALTID.has(k)) continue;
      const vF = JSON.stringify(rF[k] ?? null);
      const vE = JSON.stringify(rE[k] ?? null);
      if (vF !== vE) {
        uventedeAendringer++;
        detaljer.push(`${noegle(rF)}.${k}: ${vF} -> ${vE}`);
      }
    }
  }
  console.log(`${foer.length} raekker sammenlignet (foer) mod ${efter.length} (efter).`);
  console.log(`UVENTEDE AeNDRINGER (uden for {${[...TILLADT_AENDRET].join(', ')}}): ${uventedeAendringer}`);
  for (const d of detaljer) console.log(`  ${d}`);
  return uventedeAendringer > 0 ? 1 : 0;
}
process.exitCode = hoved();
