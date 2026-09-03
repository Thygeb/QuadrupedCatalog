#!/usr/bin/env node
/**
 * fund/f2valuetext-les-alle.mjs — LAeSE-ONLY hjaelpescript for spor/f2-valuetext.
 *
 * db/fase2-tjek.mjs maaler IKKE value_text (bekraeftet: kolonnen staar ikke i
 * DANSK_KOLONNER). Dette script dumper alle field_entries.value_text-celler for
 * mine producenter (alle UNDTAGEN de ni, tre andre spor ejer), saa jeg kan laese
 * dem igennem selv i stedet for kun at stole paa æøå.
 *
 * Skriver INTET til databasen. Bruger db/fase2-tjek.mjs's egen hentRobotter/
 * erDansk/harAeoeaa, saa der ikke er en tredje kopi af forbindelses- eller
 * detektorlogikken (Å12/L30-princippet).
 */
import { hentRobotter, erDansk, harAeoeaa } from '../db/fase2-tjek.mjs';

const UDELUKKET = new Set([
  'Yuejia Lingdong', 'Galileo (Tianjin)',
  'GENISOM AI', 'Astrall Dynamics', 'CVTE', 'Yufan Intelligent', 'Xiaomi',
  'RIVR', 'Boston Dynamics',
]);

const robotter = await hentRobotter();
const mine = robotter.filter((r) => !UDELUKKET.has(r.manufacturer));

let laest = 0;
let danskeAeoeaa = 0;
let danskeMarkoer = 0;
const prProducent = new Map();

for (const raa of mine) {
  const p = prProducent.get(raa.manufacturer) ?? { laest: 0, dansk: 0, celler: [] };
  for (const fe of raa.field_entries ?? []) {
    const v = fe.value_text;
    if (v === null || v === undefined) continue;
    if (typeof v !== 'string' || v.trim() === '') continue;
    laest += 1;
    p.laest += 1;
    const aeoeaa = harAeoeaa(v);
    const dansk = erDansk(v);
    if (aeoeaa) danskeAeoeaa += 1;
    if (dansk) danskeMarkoer += 1;
    if (dansk) {
      p.dansk += 1;
      p.celler.push({
        robot: raa.slug ?? raa.id, id: raa.id, felt: fe.field_name, aeoeaa, vaerdi: v,
      });
    }
  }
  prProducent.set(raa.manufacturer, p);
}

console.log(`MINE ROBOTTER: ${mine.length} (af ${robotter.length} i alt, ${robotter.length - mine.length} udelukket)`);
console.log(`value_text-celler LAeST (ikke-tomme): ${laest}`);
console.log(`  heraf med æøå: ${danskeAeoeaa}`);
console.log(`  heraf dansk (æøå ELLER markoerord — erDansk): ${danskeMarkoer}`);
console.log('');

for (const [producent, p] of [...prProducent.entries()].sort((a, b) => a[0].localeCompare(b[0], 'da'))) {
  if (p.dansk === 0) continue;
  console.log(`${producent}: ${p.dansk} danske af ${p.laest} laeste`);
  for (const c of p.celler) {
    console.log(`  robot ${c.id} (${c.robot}) · felt ${c.felt} · æøå=${c.aeoeaa}`);
    console.log(`    "${c.vaerdi}"`);
  }
}

console.log('\n--- Producenter UDEN dansk fund, men med laeste celler (til stikproeve) ---');
for (const [producent, p] of [...prProducent.entries()].sort((a, b) => a[0].localeCompare(b[0], 'da'))) {
  if (p.dansk === 0 && p.laest > 0) console.log(`${producent}: 0 danske af ${p.laest} laeste`);
}

console.log('\n\n=== ALLE 128 ikke-tomme value_text-celler (manuel gennemlaesning, ikke kun de flagede) ===');
for (const raa of mine) {
  for (const fe of raa.field_entries ?? []) {
    const v = fe.value_text;
    if (typeof v !== 'string' || v.trim() === '') continue;
    console.log(`${raa.manufacturer} · robot ${raa.id} (${raa.slug ?? '?'}) · ${fe.field_name}: "${v}"`);
  }
}
