/* Hvor mange af DESIGN.md's tokens passer stadig paa koden?
   KONTROL: begge udtraek skal give et positivt tal, ellers er apparatet i stykker.

   RETTET af spor/primitiv (2. sep 2026, coordinator-dom "flet efter
   rettelse", punkt 3 af 4). Foer denne rettelse laeste scriptet KUN
   literal hex - orkestratoren maalte 0 forekomster af "var(" i filen - og
   kunne derfor ikke se en semantisk token, der efter primitiv-laget
   (assets/system.css, 9 --p-*-tokens i :root) peger paa et primitiv i
   stedet for at VAERE hex selv. Det gjorde dette script og
   tests/dele/58-designmd.mjs (som genbruger PRAECIS samme regex-logik, jf.
   dens egen filhoved-kommentar) blinde paa samme maade, af samme aarsag -
   to maalescripts, der maalte det samme med forskellig evne, praecis den
   fælde coordinator-dommen navngav.

   Opløseren nedenfor er KOPIERET fra fund/maal-farvetokens.mjs's
   loop-vaernede var()-kaede-algoritme (den fil er uden for dette spors
   ejerskab - kun disse fire filer er - saa logikken duplikeres, ikke
   importeres; scriptet har desuden top-niveau-sideeffekter (--skriv,
   process.exit), som goer det uegnet at importere som modul alligevel). */
import fs from 'node:fs';
const dm = fs.readFileSync('DESIGN.md', 'utf8');
const css = fs.readFileSync('assets/system.css', 'utf8');

// frontmatter = mellem foerste og anden linje med kun '---'
const linjer = dm.split(/\r?\n/);
const grænser = linjer.map((l, i) => (l.trim() === '---' ? i : -1)).filter((i) => i >= 0);
const fm = linjer.slice(grænser[0] + 1, grænser[1]);

// farver: linjer under 'colors:' med to mellemrums indryk. Vaerdien er nu
// ENTEN literal hex (primitiverne) ELLER en var(--p-x)-reference (de
// semantiske tokens, som peger paa et primitiv) - begge er gyldige.
const dmRaa = new Map();
let iColors = false;
for (const l of fm) {
  if (/^colors:/.test(l)) { iColors = true; continue; }
  if (iColors && /^\S/.test(l)) iColors = false;
  const m = iColors && l.match(/^\s+([a-z0-9-]+):\s*"?(#[0-9A-Fa-f]{3,8}|var\(--[a-z0-9-]+\))"?/);
  if (m) dmRaa.set(m[1], m[2]);
}

const root = (css.match(/:root\{[\s\S]*?\n\}/) || [''])[0];
const kodeRaa = new Map();
for (const m of root.matchAll(/--([a-z0-9-]+):\s*([^;}]+)/g)) kodeRaa.set(m[1], m[2].trim());

if (!dmRaa.size || !kodeRaa.size) {
  console.log('APPARATET ER I STYKKER: DESIGN.md ' + dmRaa.size + ', kode ' + kodeRaa.size);
  process.exit(1);
}

/** Loop-vaernet var()-opløser - samme algoritme som fund/maal-farvetokens.mjs,
 *  omskrevet til at virke paa et navn->raa-vaerdi-map i stedet for et array. */
function loes(raa, navn, dybde = 0) {
  if (dybde > 12) return 'LOOP';
  const v = raa.get(navn);
  if (v === undefined) return null;
  const m = v.match(/^var\(--([a-z0-9-]+)\)$/);
  if (!m) return /^#/.test(v) ? v.toUpperCase() : v;
  return loes(raa, m[1], dybde + 1);
}

const dmFarver = [...dmRaa.keys()].map((n) => [n, loes(dmRaa, n)]);
console.log('kontrol OK: ' + dmRaa.size + ' farver i DESIGN.md, ' + kodeRaa.size + ' raa-tokens i :root\n');

let ens = 0; const afvig = [];
for (const [n, v] of dmFarver) {
  const k = loes(kodeRaa, n);
  if (k === v) ens++;
  else afvig.push('  ' + n.padEnd(18) + 'DESIGN.md ' + v + '   kode ' + (k || '(navn findes ikke)'));
}
console.log('VAERDIER DER STEMMER (opløst gennem var()-kaeder, ikke kun literal hex): '
  + ens + ' af ' + dmFarver.length + '\n');
afvig.forEach((a) => console.log(a));

// skriften i frontmatter
const fam = [...new Set([...fm.join('\n').matchAll(/fontFamily:\s*"([^",]+)/g)].map((m) => m[1]))];
console.log('\nskriftfamilier i DESIGN.md: ' + fam.join(' · '));
console.log('fontfiler paa disken      : ' + fs.readdirSync('assets/fonts').join(' · '));
