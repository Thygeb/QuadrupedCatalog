// Maalescript for spor/maerke. Laeser dist/robots.json + fund/FUND-d14-klassifikation.md
// og svarer paa: hvor mange talfelter, hvor mange faar maerket, og hvilke robotter
// ligger taettest paa katalogets egen andel.
// Koer: node retninger/maerke/maal.mjs   (fra worktree-roden)
import fs from 'node:fs';

const db = JSON.parse(fs.readFileSync('dist/robots.json', 'utf8'));
const robotter = db.robotter;

// --- 1. tilstande i alle_felter ---
const tilstande = new Map();
for (const r of robotter) {
  for (const [, f] of Object.entries(r.alle_felter || {})) {
    tilstande.set(f.tilstand, (tilstande.get(f.tilstand) || 0) + 1);
  }
}
console.log('Tilstande i alle_felter:');
for (const [t, n] of [...tilstande].sort((a, b) => b[1] - a[1])) console.log('  ', t, n);

const ERTAL = new Set(['tal', 'nul']);

// --- 2. klassifikationstabellen ---
const md = fs.readFileSync('fund/FUND-d14-klassifikation.md', 'utf8');
const klasse = new Map(); // "slug|felt" -> "gyldighed"|"uddybning"
let raekker = 0;
for (const linje of md.split(/\r?\n/)) {
  const m = linje.match(/^\|\s*([a-z0-9-]+)\s*\|\s*([a-z0-9_]+)\s*\|\s*(gyldighed|uddybning)\s*\|/);
  if (!m) continue;
  raekker++;
  klasse.set(m[1] + '|' + m[2], m[3]);
}
console.log('\nKlassifikationsraekker parset:', raekker, '· unikke noegler:', klasse.size);

// --- 3. totaler ---
let talfelter = 0, medForbehold = 0, gyldighed = 0, uddybning = 0, uklassificeret = 0;
const uklassListe = [];
const perRobot = [];
for (const r of robotter) {
  let t = 0, g = 0, u = 0, fb = 0;
  for (const [navn, f] of Object.entries(r.alle_felter || {})) {
    if (!ERTAL.has(f.tilstand)) continue;
    t++;
    if (f.forbehold) {
      fb++;
      const k = klasse.get(r.slug + '|' + navn);
      if (k === 'gyldighed') g++;
      else if (k === 'uddybning') u++;
      else { uklassificeret++; uklassListe.push(r.slug + '|' + navn); }
    }
  }
  talfelter += t; medForbehold += fb; gyldighed += g; uddybning += u;
  perRobot.push({ slug: r.slug, navn: r.navn, producent: r.producent, tal: t, forbehold: fb, gyldighed: g, uddybning: u });
}

const pct = (a, b) => (100 * a / b).toFixed(1) + ' %';
console.log('\n=== TOTALER (kun tilstand tal/nul) ===');
console.log('talfelter i alt          ', talfelter);
console.log('heraf med forbehold      ', medForbehold, pct(medForbehold, talfelter));
console.log('  gyldighed (faar maerke)', gyldighed, pct(gyldighed, talfelter), '· af forbeholdene:', pct(gyldighed, medForbehold));
console.log('  uddybning (intet maerke)', uddybning, pct(uddybning, talfelter), '· af forbeholdene:', pct(uddybning, medForbehold));
console.log('  uklassificeret         ', uklassificeret);
if (uklassListe.length) console.log('  ', uklassListe.slice(0, 20).join(', '));

// --- 4. robotter taettest paa katalogets andel ---
const maal = gyldighed / talfelter;
console.log('\n=== ROBOTTER TAETTEST PAA KATALOGETS ANDEL (' + pct(gyldighed, talfelter) + ') ===');
const kandidater = perRobot
  .filter(r => r.tal >= 12)
  .map(r => ({ ...r, andel: r.gyldighed / r.tal }))
  .sort((a, b) => Math.abs(a.andel - maal) - Math.abs(b.andel - maal));
for (const r of kandidater.slice(0, 15)) {
  console.log(`  ${r.slug.padEnd(30)} tal=${String(r.tal).padStart(2)} gyld=${String(r.gyldighed).padStart(2)} (${(100 * r.andel).toFixed(1)}%) uddyb=${r.uddybning}`);
}

// --- 5. kolliderer maerket med et hul? findes "ikke_oplyst" MED forbehold ---
let hulMedForbehold = 0;
const hulEks = [];
for (const r of robotter) {
  for (const [navn, f] of Object.entries(r.alle_felter || {})) {
    if (f.tilstand === 'ikke_oplyst' && f.forbehold) {
      hulMedForbehold++;
      if (hulEks.length < 8) hulEks.push(r.slug + '|' + navn + ' :: ' + String(f.forbehold).slice(0, 70));
    }
  }
}
console.log('\n=== HUL MED FORBEHOLD (tilstand ikke_oplyst + forbehold) ===');
console.log('antal:', hulMedForbehold);
hulEks.forEach(e => console.log('  ', e));
console.log('Er nogen af dem klassificeret i D14-tabellen?',
  [...klasse.keys()].filter(k => {
    const [s, f] = k.split('|');
    const r = robotter.find(x => x.slug === s);
    return r && r.alle_felter[f] && r.alle_felter[f].tilstand === 'ikke_oplyst';
  }).length);

// --- 6. tilstanden 'nul' — findes den, og har den forbehold? ---
const nuller = [];
for (const r of robotter) {
  for (const [navn, f] of Object.entries(r.alle_felter || {})) {
    if (f.tilstand === 'nul') nuller.push(r.slug + '|' + navn + (f.forbehold ? ' [forbehold]' : ''));
  }
}
console.log('\n=== NUL-TILSTANDE ===', nuller.length);
nuller.slice(0, 10).forEach(n => console.log('  ', n));
