#!/usr/bin/env node
// fund/f2deep-changelog-tjek.mjs — briefets acceptkriterium 3: taeller
// change_log-raekker for changed_by='spor/f2-deep', joinet mod
// robots.manufacturer, saa jeg kan bevise 0 raekker uden for DEEP Robotics.
// row_key er en jsonb med enten {"id":<n>} (robots) eller
// {"robot_id":<n>} (field_entries/applications/images).
import { laesForbindelse } from '../db/fase2-tjek.mjs';

async function hoved() {
  const { url, headers } = laesForbindelse();
  const svar = await fetch(
    `${url}/rest/v1/change_log?changed_by=eq.spor%2Ff2-deep&select=id,table_name,row_key,changed_at&order=id.asc`,
    { headers },
  );
  if (!svar.ok) {
    console.error(`GET change_log fejlede: ${svar.status} ${await svar.text()}`);
    return 1;
  }
  const rows = await svar.json();
  console.log(`change_log-raekker med changed_by='spor/f2-deep': ${rows.length}`);

  const robotterSvar = await fetch(`${url}/rest/v1/robots?manufacturer=eq.DEEP%20Robotics&select=id`, { headers });
  const deepIds = new Set((await robotterSvar.json()).map((r) => r.id));
  console.log(`DEEP Robotics robot_id'er: ${[...deepIds].sort((a, b) => a - b).join(', ')}`);

  let indenfor = 0, udenfor = 0;
  const udenforListe = [];
  for (const r of rows) {
    const rid = r.row_key.robot_id ?? r.row_key.id;
    if (deepIds.has(rid)) indenfor++;
    else { udenfor++; udenforListe.push({ table_name: r.table_name, row_key: r.row_key }); }
  }
  console.log(`Indenfor DEEP Robotics: ${indenfor}`);
  console.log(`UDENFOR DEEP Robotics: ${udenfor}`);
  if (udenfor) console.log(JSON.stringify(udenforListe, null, 2));

  const prTabel = {};
  for (const r of rows) prTabel[r.table_name] = (prTabel[r.table_name] ?? 0) + 1;
  console.log('Fordelt pr. tabel:', JSON.stringify(prTabel));
  return 0;
}

hoved().then((k) => { process.exitCode = k; }).catch((e) => {
  console.error(String(e && e.stack ? e.stack : e));
  process.exitCode = 1;
});
