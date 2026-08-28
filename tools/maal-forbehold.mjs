/**
 * maal-forbehold.mjs — er et forbehold tegnet én gang, eller flere?
 *
 *   node tools/maal-forbehold.mjs [dist]
 *
 * Svarer paa det, et raat antal ikke kan: hvor mange STYKKER baerer et
 * forbehold, og hvor mange af dem tegner det samme forbehold to gange.
 * Et fald i "stykker med mindst ét" er tabt information; et fald i
 * "overskydende" er fjernede dubletter. De to maa aldrig forveksles - det
 * var praecis den forveksling, der gjorde gulvet i
 * tests/dele/20-aflaesningslinje.mjs foraeldet (D18, 28. aug 2026).
 *
 * Maalt 28. aug 2026: 940 stykker, 0 overskydende. Foer afdublingen:
 * samme 940 stykker, men 396 overskydende.
 */
// Fordeling af forbehold--skjult PR. VAERDIKONTEKST, uden regex-matching af
// balancerede elementer: dokumentet skaeres ved hver kendt kontekststart
// (<li ...> for striben, <div class="raekke"> for feltlisten), og hvert
// stykke taelles for sig. Et stykke = én celle/raekke.
import fs from 'node:fs'; import path from 'node:path';
const rod = process.argv[2] || 'dist';
const hist = new Map();          // antal forbehold i stykket -> antal stykker
let ialt = 0, filer = 0;
const eksempler = [];
function gaa(d) {
  for (const p of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, p.name);
    if (p.isDirectory()) { gaa(f); continue; }
    if (!p.name.endsWith('.html')) continue;
    filer++;
    const h = fs.readFileSync(f, 'utf8');
    ialt += (h.match(/forbehold--skjult/g) || []).length;
    for (const stykke of h.split(/(?=<li[ >])|(?=<div class="raekke">)|(?=<div class="yderpunkt-krop">)/)) {
      const n = (stykke.match(/forbehold--skjult/g) || []).length;
      if (n === 0) continue;
      hist.set(n, (hist.get(n) || 0) + 1);
      if (n > 1 && eksempler.length < 3) eksempler.push({ f, stykke: stykke.slice(0, 300) });
    }
  }
}
gaa(rod);
console.log(`filer: ${filer} · forbehold--skjult i alt: ${ialt}`);
let sumStykker = 0, sumForbehold = 0, overskydende = 0;
for (const n of [...hist.keys()].sort((a,b)=>a-b)) {
  const s = hist.get(n);
  sumStykker += s; sumForbehold += n*s; overskydende += (n-1)*s;
  console.log(`  stykker med ${n} forbehold: ${s}   (= ${n*s} forbehold)`);
}
console.log(`stykker med mindst ét: ${sumStykker} · daekket: ${sumForbehold} · UDEN for et stykke: ${ialt - sumForbehold}`);
console.log(`OVERSKYDENDE (dubletter): ${overskydende}`);
if (process.argv[3] === '-v') for (const e of eksempler) console.log('\n---', e.f, '\n', e.stykke);
