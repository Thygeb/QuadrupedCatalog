#!/usr/bin/env node
/** fund/f2valuetext-tjek-changelog.mjs — LAeSE-ONLY. Kontrollerer briefets
 *  acceptkriterium 6: alle rader med changed_by='spor/f2-valuetext' roerer
 *  KUN value_text-kolonnen og KUN mine producenter (ikke de ni udelukkede).
 *
 *  change_log gemmer old_row som HELE FOeR-billedet, ikke en diff — saa
 *  hver logget raekke hentes sammen med den NUVAeRENDE field_entries-raekke,
 *  og de to sammenlignes felt for felt.
 */
import { laesForbindelse, hentRobotter } from '../db/fase2-tjek.mjs';

const UDELUKKET = new Set([
  'Yuejia Lingdong', 'Galileo (Tianjin)',
  'GENISOM AI', 'Astrall Dynamics', 'CVTE', 'Yufan Intelligent', 'Xiaomi',
  'RIVR', 'Boston Dynamics',
]);

const { url, headers } = laesForbindelse();
const select = 'select=*&changed_by=eq.spor%2Ff2-valuetext&order=id.asc';
const svar = await fetch(`${url}/rest/v1/change_log?${select}`, { headers });
if (!svar.ok) throw new Error(`GET change_log fejlede: ${svar.status} ${await svar.text()}`);
const logRaekker = await svar.json();
console.log(`Raekker med changed_by='spor/f2-valuetext' i change_log: ${logRaekker.length}`);

const robotter = await hentRobotter();
const robotPrId = new Map(robotter.map((r) => [r.id, r]));

let udenForFieldEntries = 0;
let udenForValueText = 0;
let udenForMineProducenter = 0;

for (const log of logRaekker) {
  if (log.table_name !== 'field_entries') { udenForFieldEntries += 1; console.log('  IKKE field_entries:', JSON.stringify(log)); continue; }
  const { robot_id, field_name } = log.row_key;
  const raa = robotPrId.get(robot_id);
  if (!raa) { console.log('  ROBOT IKKE FUNDET:', robot_id); continue; }
  if (UDELUKKET.has(raa.manufacturer)) {
    udenForMineProducenter += 1;
    console.log(`  UDEN FOR MINE PRODUCENTER: robot ${robot_id} (${raa.manufacturer}) felt ${field_name}`);
  }
  const nu = (raa.field_entries ?? []).find((fe) => fe.field_name === field_name);
  if (!nu) { console.log('  FELT IKKE FUNDET NU:', robot_id, field_name); continue; }
  const foer = log.old_row;
  const forskelligeFelter = Object.keys(foer).filter((k) => {
    if (k === 'collected_by' || k === 'change_reason') return false; // forventes altid aendret
    return JSON.stringify(foer[k]) !== JSON.stringify(nu[k]);
  });
  const kunValueText = forskelligeFelter.length === 1 && forskelligeFelter[0] === 'value_text';
  if (!kunValueText) {
    udenForValueText += 1;
    console.log(`  ANDRE KOLONNER AeNDRET: robot ${robot_id} felt ${field_name} -> ${forskelligeFelter.join(', ')}`);
  }
}

console.log(`\nRaekker uden for field_entries: ${udenForFieldEntries}`);
console.log(`Raekker, hvor andet end value_text (+ collected_by/change_reason) aendrede sig: ${udenForValueText}`);
console.log(`Raekker uden for mine producenter: ${udenForMineProducenter}`);
