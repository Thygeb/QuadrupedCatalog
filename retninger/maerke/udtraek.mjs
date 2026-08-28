// Traekker de RIGTIGE data ud, som comps'ene skal bygges paa.
// Ingen tal opfindes: alt kommer fra dist/robots.json + fund/FUND-d14-klassifikation.md.
// Koer: node retninger/maerke/udtraek.mjs [slug ...]
import fs from 'node:fs';

const db = JSON.parse(fs.readFileSync('dist/robots.json', 'utf8'));
const md = fs.readFileSync('fund/FUND-d14-klassifikation.md', 'utf8');
const klasse = new Map();
for (const linje of md.split(/\r?\n/)) {
  const m = linje.match(/^\|\s*([a-z0-9-]+)\s*\|\s*([a-z0-9_]+)\s*\|\s*(gyldighed|uddybning)\s*\|\s*(.*?)\s*\|\s*$/);
  if (m) klasse.set(m[1] + '|' + m[2], { klasse: m[3], begrundelse: m[4] });
}

const slugs = process.argv.slice(2);
const valgte = slugs.length ? slugs : ['xiaomi-cyberdog-1'];

for (const slug of valgte) {
  const r = db.robotter.find(x => x.slug === slug);
  if (!r) { console.log('IKKE FUNDET:', slug); continue; }
  console.log('\n============================================================');
  console.log(r.producent, r.navn, '·', slug, '· vaegtklasse', r.vaegtklasse);
  console.log('kilder:', r.kilder.map(k => k.bogstav + (k.sekundaer ? '(sek)' : '')).join(' '));
  let tal = 0, gyld = 0;
  for (const [navn, f] of Object.entries(r.alle_felter || {})) {
    const k = klasse.get(slug + '|' + navn);
    const erTal = f.tilstand === 'tal' || f.tilstand === 'nul';
    if (erTal) { tal++; if (k && k.klasse === 'gyldighed') gyld++; }
    const v = f.tilstand === 'tal' || f.tilstand === 'nul'
      ? (f.vaerdi !== null && f.vaerdi !== undefined ? f.vaerdi : `${f.min}-${f.maks}`) + ' ' + (f.enhed || '')
      : f.tilstand === 'tekst' ? JSON.stringify(f.tekst).slice(0, 60) : f.tilstand;
    const mrk = k ? (k.klasse === 'gyldighed' ? '### GYLDIGHED' : '  uddybning ') : (f.forbehold ? '  UKLASSIF.  ' : '             ');
    console.log(`${mrk} ${navn.padEnd(24)} ${f.tilstand.padEnd(12)} ${String(v).padEnd(22)} ${f.operator ? 'op=' + f.operator + ' ' : ''}`);
    if (f.forbehold) console.log(`                 forbehold: ${f.forbehold}`);
    if (k) console.log(`                 D14: ${k.begrundelse}`);
  }
  console.log(`--- ${slug}: ${tal} talfelter, ${gyld} gyldighed = ${(100 * gyld / tal).toFixed(1)} %`);
}
