#!/usr/bin/env node
/**
 * fund/.tmp-blindpunkt/find-kandidater.mjs — engangsscript for spor/f2-blindpunkt.
 * Reproducerer briefets 392-tal: korte celler (< 60 tegn) uden æøå i
 * kolonnerne value_text, caveat, caveat_wording, applications.note, hos de
 * 16 producenter dette spor ejer (de 9 andre spors producenter udelukkes).
 * Skriver ALDRIG til databasen — kun laesning via hentRobotter().
 */
import { hentRobotter, harAeoeaa } from '../../db/fase2-tjek.mjs';

const UDELUKKEDE_PRODUCENTER = new Set([
  'Yuejia Lingdong', 'Galileo (Tianjin)',
  'GENISOM AI', 'Astrall Dynamics', 'CVTE', 'Yufan Intelligent', 'Xiaomi',
  'RIVR', 'Boston Dynamics',
]);

function kort(streng) {
  return typeof streng === 'string' && streng.trim() !== '' && streng.length < 60;
}

const robotter = await hentRobotter();
const mine = robotter.filter((r) => !UDELUKKEDE_PRODUCENTER.has(r.manufacturer));

console.error(`Robotter i alt: ${robotter.length} · mine (16 producenter): ${mine.length}`);
const producenterSet = new Set(mine.map((r) => r.manufacturer));
console.error(`Producenter i mit soegerum (${producenterSet.size}): ${[...producenterSet].sort().join(', ')}`);

const rows = [];
for (const r of mine) {
  for (const fe of (r.field_entries ?? [])) {
    for (const kolonne of ['value_text', 'caveat', 'caveat_wording']) {
      const v = fe[kolonne];
      if (kort(v) && !harAeoeaa(v)) {
        rows.push({ robot_id: r.id, slug: r.slug, manufacturer: r.manufacturer, field_name: fe.field_name, kolonne, tekst: v });
      }
    }
  }
  const note = r.applications?.note;
  const noter = Array.isArray(note) ? note : (note ? [note] : []);
  noter.forEach((v, i) => {
    if (kort(v) && !harAeoeaa(v)) {
      rows.push({ robot_id: r.id, slug: r.slug, manufacturer: r.manufacturer, field_name: `applications.note[${i}]`, kolonne: 'applications.note', tekst: v });
    }
  });
}

console.error(`KANDIDATCELLER (< 60 tegn, ingen aeoeaa): ${rows.length}`);

const prProducent = new Map();
for (const row of rows) prProducent.set(row.manufacturer, (prProducent.get(row.manufacturer) ?? 0) + 1);
for (const [p, n] of [...prProducent.entries()].sort((a, b) => b[1] - a[1])) {
  console.error(`  ${p}: ${n}`);
}

console.log(JSON.stringify(rows, null, 0));
