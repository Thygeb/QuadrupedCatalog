/**
 * fund/maal-vikke-kontrast.mjs — spor/tomstat, 4. sep 2026 (designplanens R8).
 *
 * Maaler acceptkriterie 1 og 2 for tilstanden "ikke oplyst" DIREKTE i
 * assets/system.css, saa tallene kan genkoeres af enhver:
 *
 *   1. .v-ikke's baerende KANT paa --bund skal vaere >= 3,00 (WCAG 1.4.11)
 *   2. .v-ikke's TEKST paa dens EGET FYLD skal vaere >= 4,50 (WCAG 1.4.3)
 *
 * Farverne LAESES ud af CSS'en (token-kaeden foelges gennem var()), de er
 * ikke skrevet ind her. Aendrer nogen en polet, flytter tallene sig med.
 *
 * Hver maaling har en KONTROLLINJE: et tal, der er kendt paa forhaand, og
 * som afsloerer et gaaet-i-stykker maaleapparat i samme oejeblik. Uden den
 * ser et forkert resultat ud som et gyldigt resultat.
 *
 * Kør:  node fund/maal-vikke-kontrast.mjs
 * Exit: 0 hvis begge kriterier holder, 1 hvis ikke.
 */
import fs from 'node:fs';
import path from 'node:path';

const rod = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const css = fs.readFileSync(path.join(rod, 'assets', 'system.css'), 'utf8');
const rent = css.replace(/\/\*[\s\S]*?\*\//g, '');

/* --- token-kaeden ------------------------------------------------------- */
const raa = new Map();
for (const m of rent.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;}]+)/g)) {
  if (!raa.has(m[1])) raa.set(m[1], m[2].trim());
}
const loes = (v, d = 0) => {
  if (d > 12) return 'LOOP';
  const m = String(v).match(/^var\((--[a-z0-9-]+)\)$/);
  if (!m) return v;
  return raa.has(m[1]) ? loes(raa.get(m[1]), d + 1) : 'UDEFINERET:' + m[1];
};
const farve = (navn) => loes(raa.get(navn)).toUpperCase();

/* --- WCAG --------------------------------------------------------------- */
const kanal = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (h) => {
  const [r, g, b] = [1, 3, 5].map((i) => kanal(parseInt(h.slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const K = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const f = (n) => n.toFixed(2).replace('.', ',');

/* --- hvad .v-ikke FAKTISK bruger, laest ud af reglen -------------------- */
const regel = rent.match(/\.v-ikke\{([^}]*)\}/);
const maerke = rent.match(/\.v-ikke \.mrk\{([^}]*)\}/);
if (!regel || !maerke) { console.error('FEJL: fandt ikke .v-ikke-reglerne i system.css'); process.exit(1); }
const tokenI = (blok, egenskab) => {
  const m = blok.match(new RegExp(egenskab + ':[^;]*?var\\((--[a-z0-9-]+)\\)'));
  return m ? m[1] : null;
};
const tTekst = tokenI(regel[1], 'color');
const tFyld = tokenI(regel[1], 'background');
const tKant = tokenI(regel[1], 'border');
const tMaerkeKant = tokenI(maerke[1], 'border');

const BUND = farve('--bund');
const TEKST = farve(tTekst), FYLD = farve(tFyld), KANT = farve(tKant), MKANT = farve(tMaerkeKant);

console.log('\n.v-ikke bruger, laest ud af system.css:');
console.log(`  tekst  ${tTekst} -> ${TEKST}`);
console.log(`  fyld   ${tFyld} -> ${FYLD}`);
console.log(`  kant   ${tKant} -> ${KANT}`);
console.log(`  9x9    ${tMaerkeKant} -> ${MKANT}   (fladen bagved: --bund -> ${BUND})`);

console.log('\nKONTROLLINJER (kendte tal - afviger de, er apparatet i stykker):');
console.log(`  --blaek3 #5F686F PAA --bund #E8EBED   forventer 4,74  ->  ${f(K('#5F686F', '#E8EBED'))}`);
console.log(`  --hegn  #9AA3A9 PAA --bund #E8EBED    forventer 2,14  ->  ${f(K('#9AA3A9', '#E8EBED'))}`);
console.log(`  --bund  PAA --bund                    forventer 1,00  ->  ${f(K('#E8EBED', '#E8EBED'))}`);

const k1a = K(KANT, BUND), k1b = K(KANT, FYLD), k1c = K(MKANT, FYLD);
const k2 = K(TEKST, FYLD);
const okKant = k1a >= 3 && k1b >= 3 && k1c >= 3;
const okTekst = k2 >= 4.5;

console.log('\nACCEPTKRITERIE 1 - den baerende kant, WCAG 1.4.11 >= 3,00');
console.log(`  chippens KANT ${KANT} PAA sidens BUND ${BUND}        ${f(k1a)}  ${k1a >= 3 ? 'OK' : 'FEJL'}`);
console.log(`  chippens KANT ${KANT} PAA sit eget FYLD ${FYLD}      ${f(k1b)}  ${k1b >= 3 ? 'OK' : 'FEJL'}`);
console.log(`  9x9-firkantens KANT ${MKANT} PAA chippens FYLD ${FYLD}  ${f(k1c)}  ${k1c >= 3 ? 'OK' : 'FEJL'}`);

console.log('\nACCEPTKRITERIE 2 - ordet skal stadig kunne laeses, WCAG 1.4.3 >= 4,50');
console.log(`  ordets TEKST ${TEKST} PAA chippens FYLD ${FYLD}      ${f(k2)}  ${okTekst ? 'OK' : 'FEJL'}`);

console.log('\nTIL SAMMENLIGNING - fyldet alene kan ikke baere tilstanden');
console.log(`  chippens FYLD ${FYLD} PAA sidens BUND ${BUND}        ${f(K(FYLD, BUND))}  (var 1,00)`);
console.log('  LOFTET: det moerkeste fyld, der stadig lader teksten holde 4,50 -');
for (const [navn, h] of [['--blaek3 #5F686F', '#5F686F'], ['--blaek2 #545C63', '#545C63'], ['--blaek  #22262A', '#22262A']]) {
  const Lf = 4.5 * (lum(h) + 0.05) - 0.05;
  console.log(`    med ${navn} som tekst: fyldet naar hoejst ${f((lum(BUND) + 0.05) / (Lf + 0.05))} : 1 mod bunden`);
}
console.log('  Selv palettens moerkeste blaek loefter ikke fyldet over 3,0. Kanten maa baere.');

console.log(`\nRESULTAT: ${okKant && okTekst ? 'BEGGE KRITERIER HOLDER' : 'MINDST ÉT KRITERIUM FEJLER'}\n`);
process.exitCode = okKant && okTekst ? 0 : 1;
