#!/usr/bin/env node
/** fund/f2magicpudu-changelog-ejerskab.mjs — acceptkriterium 4: alle
 * change_log-raekker for dette spor skal tilhoere MagicLab/Pudu Robotics. */
import process from 'node:process';
import { laesForbindelse, hentRobotter } from '../db/fase2-tjek.mjs';

async function hoved() {
  const gren = process.argv[2] || 'spor/f2-magicpudu';
  const { url, headers } = laesForbindelse();
  const robotter = await hentRobotter();
  const producentFor = new Map(robotter.map((r) => [r.id, r.manufacturer]));
  const alle = [];
  let start = 0;
  for (;;) {
    const svar = await fetch(`${url}/rest/v1/change_log?changed_by=eq.${encodeURIComponent(gren)}&select=id,table_name,row_key,changed_by`, {
      headers: { ...headers, Range: `${start}-${start + 999}`, Prefer: 'count=exact' },
    });
    if (!svar.ok) throw new Error(`GET change_log fejlede: ${svar.status} ${await svar.text()}`);
    const del = await svar.json();
    alle.push(...del);
    const cr = svar.headers.get('content-range');
    const total = cr && cr.includes('/') ? Number(cr.split('/')[1]) : del.length;
    start += del.length;
    if (del.length === 0 || start >= total) break;
  }
  console.log(`change_log raekker for ${gren}: ${alle.length}`);
  const udenforProducent = [];
  const prTabel = {};
  for (const r of alle) {
    prTabel[r.table_name] = (prTabel[r.table_name] ?? 0) + 1;
    const robotId = r.row_key.robot_id ?? r.row_key.id;
    const producent = producentFor.get(robotId);
    if (producent !== 'MagicLab' && producent !== 'Pudu Robotics') {
      udenforProducent.push({ ...r, producent: producent ?? '(ukendt robot_id)' });
    }
  }
  console.log('Pr. tabel:', JSON.stringify(prTabel));
  console.log(`Raekker UDEN FOR MagicLab/Pudu Robotics: ${udenforProducent.length}`);
  for (const r of udenforProducent) console.log('  ', JSON.stringify(r));
  return udenforProducent.length > 0 ? 1 : 0;
}
hoved().then((k) => { process.exitCode = k; }).catch((e) => { console.error(String(e && e.stack ? e.stack : e)); process.exitCode = 1; });
