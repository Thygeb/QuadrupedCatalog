#!/usr/bin/env node
/** fund/f2magicpudu-acceptkriterium-cn.mjs — efterprøver orkestratorens
 * acceptkriterium: select robot_id from applications where note ~ '\(CN:\s*\)';
 * skal give 0 raekker. PostgREST har ikke en direkte SQL-konsol her, saa
 * kriteriet efterprøves ved at hente ALLE applications.note-vaerdier og
 * anvende PRAeCIS samme regex client-side (samme semantik som Postgres' ~). */
import process from 'node:process';
import { laesForbindelse } from '../db/fase2-tjek.mjs';

async function hoved() {
  const { url, headers } = laesForbindelse();
  const svar = await fetch(`${url}/rest/v1/applications?select=robot_id,note`, { headers });
  if (!svar.ok) throw new Error(`GET fejlede: ${svar.status} ${await svar.text()}`);
  const rows = await svar.json();
  const re = /\(CN:\s*\)/;
  const traef = rows.filter((r) => typeof r.note === 'string' && re.test(r.note));
  console.log(`applications-raekker undersoegt: ${rows.length}`);
  console.log(`raekker der matcher '\(CN:\s*\)' (forventer 0): ${traef.length}`);
  for (const t of traef) console.log(`  robot_id=${t.robot_id}: ${t.note}`);
  return traef.length > 0 ? 1 : 0;
}
hoved().then((k) => { process.exitCode = k; }).catch((e) => { console.error(String(e && e.stack ? e.stack : e)); process.exitCode = 1; });
