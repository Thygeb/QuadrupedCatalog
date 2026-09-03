#!/usr/bin/env node
/**
 * fund/f2magicpudu-snapshot.mjs — henter ALLE field_entries-rækker for en
 * producent (rå PostgREST, alle kolonner) og gemmer som JSON, så en
 * før/efter-diff kan tage ALLE kolonner undtagen de tekstkolonner, sporet må
 * røre (BRIEF-FAELLES's efterprøvning (a)). Bruger Range-sideskift, fordi
 * PostgREST kapper ved 1000 rækker uden fejl (CLAUDE.md/briefets miljøafsnit).
 */
import fs from 'node:fs';
import process from 'node:process';
import { laesForbindelse, hentRobotter, filtrerProducent, findProducent } from '../db/fase2-tjek.mjs';

async function hoved() {
  const oenske = process.argv[2];
  const udfil = process.argv[3];
  if (!oenske || !udfil) { console.error('Brug: node f2magicpudu-snapshot.mjs <Producent> <udfil.json>'); return 2; }
  const robotter = await hentRobotter();
  const { match, gyldige } = findProducent(oenske, robotter);
  if (!match) { console.error(`Ukendt producent "${oenske}". Gyldige: ${gyldige.join(', ')}`); return 2; }
  const filtreret = filtrerProducent(robotter, match);
  const ider = filtreret.map((r) => r.id);
  const { url, headers } = laesForbindelse();
  const alle = [];
  for (const id of ider) {
    let start = 0;
    for (;;) {
      const svar = await fetch(`${url}/rest/v1/field_entries?robot_id=eq.${id}&select=*,field_entry_variants(*)&order=field_name`, {
        headers: { ...headers, Range: `${start}-${start + 999}`, Prefer: 'count=exact' },
      });
      if (!svar.ok) throw new Error(`GET field_entries robot_id=${id} fejlede: ${svar.status} ${await svar.text()}`);
      const del = await svar.json();
      alle.push(...del);
      const cr = svar.headers.get('content-range'); // "0-N/total"
      const total = cr && cr.includes('/') ? Number(cr.split('/')[1]) : del.length;
      start += del.length;
      if (del.length === 0 || start >= total) break;
    }
  }
  fs.writeFileSync(udfil, JSON.stringify({ producent: match, robot_ider: ider, hentet: new Date().toISOString(), rows: alle }, null, 2));
  console.log(`${alle.length} field_entries-raekker for ${match} (${ider.length} robotter) gemt i ${udfil}`);
  return 0;
}
hoved().then((k) => { process.exitCode = k; }).catch((e) => {
  console.error(String(e && e.stack ? e.stack : e));
  process.exitCode = 1;
});
