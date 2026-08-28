// Taethed PR. FLADE, ikke pr. katalog. Briefets 31,5 % er katalogets snit over
// alle 821 talfelter; de tre flader viser ikke de samme felter og har derfor
// ikke samme taethed. Det er DEN taethed, maerket skal baere.
// Koer: node retninger/maerke/fladetaethed.mjs
import fs from 'node:fs';

const db = JSON.parse(fs.readFileSync('dist/robots.json', 'utf8'));
const md = fs.readFileSync('fund/FUND-d14-klassifikation.md', 'utf8');
const klasse = new Map();
for (const l of md.split(/\r?\n/)) {
  const m = l.match(/^\|\s*([a-z0-9-]+)\s*\|\s*([a-z0-9_]+)\s*\|\s*(gyldighed|uddybning)\s*\|/);
  if (m) klasse.set(m[1] + '|' + m[2], m[3]);
}
const ERTAL = new Set(['tal', 'nul']);
const erGyld = (s, f) => klasse.get(s + '|' + f) === 'gyldighed';

// Felterne kommer fra tools/skabelon/robot.mjs:94 (STRIBE_FELTER) og
// tools/skabelon/side.mjs:1052 (STRIBE, den kompakte).
const FLADER = {
  'robotsidens stribe (5)': ['egenvaegt', 'nyttelast_gaaende', 'driftstid', 'hastighed', 'ip_klasse'],
  'katalogkortet (4)': ['egenvaegt', 'nyttelast_gaaende', 'hastighed', 'driftstid'],
  'fuld feltliste (alle)': null,
};

for (const [navn, felter] of Object.entries(FLADER)) {
  let tal = 0, gyld = 0, celler = 0;
  const perRobot = [];
  for (const r of db.robotter) {
    const liste = felter || Object.keys(r.alle_felter || {});
    let t = 0, g = 0;
    for (const f of liste) {
      const post = r.alle_felter?.[f];
      celler++;
      if (!post || !ERTAL.has(post.tilstand)) continue;
      t++;
      if (post.forbehold && erGyld(r.slug, f)) g++;
    }
    tal += t; gyld += g;
    perRobot.push({ slug: r.slug, navn: r.navn, producent: r.producent, t, g });
  }
  console.log(`\n=== ${navn} ===`);
  console.log(`  celler i alt paa fladen (77 robotter): ${celler}`);
  console.log(`  heraf tal/nul: ${tal}  ·  heraf gyldighed: ${gyld}`);
  console.log(`  maerker pr. tal:   ${(100 * gyld / tal).toFixed(1)} %`);
  console.log(`  maerker pr. celle: ${(100 * gyld / celler).toFixed(1)} %`);
  const maal = gyld / tal;
  const naer = perRobot.filter(r => r.t >= (felter ? felter.length - 1 : 10))
    .map(r => ({ ...r, a: r.g / r.t }))
    .sort((a, b) => Math.abs(a.a - maal) - Math.abs(b.a - maal));
  console.log('  robotter taettest paa fladens egen andel:');
  for (const r of naer.slice(0, 6)) {
    console.log(`    ${r.slug.padEnd(32)} ${r.g}/${r.t} = ${(100 * r.a).toFixed(0)} %`);
  }
}
