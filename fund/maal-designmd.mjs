/* Hvor mange af DESIGN.md's tokens passer stadig paa koden?
   KONTROL: begge udtraek skal give et positivt tal, ellers er apparatet i stykker. */
import fs from 'node:fs';
const dm = fs.readFileSync('DESIGN.md', 'utf8');
const css = fs.readFileSync('assets/system.css', 'utf8');

// frontmatter = mellem foerste og anden linje med kun '---'
const linjer = dm.split(/\r?\n/);
const grænser = linjer.map((l, i) => (l.trim() === '---' ? i : -1)).filter((i) => i >= 0);
const fm = linjer.slice(grænser[0] + 1, grænser[1]);

// farver: linjer under 'colors:' med to mellemrums indryk
const dmFarver = [];
let iColors = false;
for (const l of fm) {
  if (/^colors:/.test(l)) { iColors = true; continue; }
  if (iColors && /^\S/.test(l)) iColors = false;
  const m = iColors && l.match(/^\s+([a-z0-9-]+):\s*"?(#[0-9A-Fa-f]{3,8})"?/);
  if (m) dmFarver.push([m[1], m[2].toUpperCase()]);
}

const root = (css.match(/:root\{[\s\S]*?\n\}/) || [''])[0];
const kode = new Map();
for (const m of root.matchAll(/--([a-z0-9-]+):\s*(#[0-9A-Fa-f]{3,8})/g)) kode.set(m[1], m[2].toUpperCase());

if (!dmFarver.length || !kode.size) {
  console.log('APPARATET ER I STYKKER: DESIGN.md ' + dmFarver.length + ', kode ' + kode.size);
  process.exit(1);
}
console.log('kontrol OK: ' + dmFarver.length + ' farver i DESIGN.md, ' + kode.size + ' i :root\n');

let ens = 0; const afvig = [];
for (const [n, v] of dmFarver) {
  const k = kode.get(n);
  if (k === v) ens++;
  else afvig.push('  ' + n.padEnd(11) + 'DESIGN.md ' + v + '   kode ' + (k || '(navn findes ikke)'));
}
console.log('VAERDIER DER STEMMER: ' + ens + ' af ' + dmFarver.length + '\n');
afvig.forEach((a) => console.log(a));

// skriften i frontmatter
const fam = [...new Set([...fm.join('\n').matchAll(/fontFamily:\s*"([^",]+)/g)].map((m) => m[1]))];
console.log('\nskriftfamilier i DESIGN.md: ' + fam.join(' · '));
console.log('fontfiler paa disken      : ' + fs.readdirSync('assets/fonts').join(' · '));
