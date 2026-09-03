#!/usr/bin/env node
/**
 * fund/f2han-maal.mjs — spor/f2han grundmåling og arbejdsliste.
 * Genbruger laesForbindelse/hentRobotter fra db/fase2-tjek.mjs (Å12/L30 —
 * ingen tredje .env-læser). Læser ALDRIG data/robots/, skriver ALDRIG.
 *
 * Kør: node fund/f2han-maal.mjs           -> grundmåling + liste (JSON til stdout via --json)
 */
import { hentRobotter } from '../db/fase2-tjek.mjs';

const CJK = /[一-鿿]/;
function cjkTal(s) {
  if (typeof s !== 'string') return 0;
  const m = s.match(new RegExp(CJK, 'g'));
  return m ? m.length : 0;
}

const robotter = await hentRobotter();

let hanCaveat = 0, hanCaveatWording = 0, hanValueText = 0;
const rows = [];
const producentTal = {};
for (const r of robotter) {
  for (const fe of (r.field_entries || [])) {
    const c = typeof fe.caveat === 'string' ? fe.caveat : '';
    const cw = typeof fe.caveat_wording === 'string' ? fe.caveat_wording : '';
    const vt = typeof fe.value_text === 'string' ? fe.value_text : '';
    if (CJK.test(c)) {
      hanCaveat++;
      rows.push({
        robot_id: r.id, slug: r.slug, manufacturer: r.manufacturer, field_name: fe.field_name,
        caveat: c, caveat_wording: cw,
      });
      producentTal[r.manufacturer] = (producentTal[r.manufacturer] || 0) + 1;
    }
    if (CJK.test(cw)) hanCaveatWording++;
    if (CJK.test(vt)) hanValueText++;
  }
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ hanCaveat, hanCaveatWording, hanValueText, rows, producentTal }, null, 2));
} else {
  console.log(`han_i_caveat: ${hanCaveat}`);
  console.log(`han_i_caveat_wording: ${hanCaveatWording}`);
  console.log(`han_i_value_text: ${hanValueText}`);
  console.log(`robotter beroert: ${new Set(rows.map((r) => r.robot_id)).size}`);
  console.log(`producenter: ${JSON.stringify(producentTal)}`);
}
process.exitCode = 0;
