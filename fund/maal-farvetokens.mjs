/* ACCEPTKRITERIET for spor/primitiv: hver token skal LOESE OP til samme
   faktiske farve som foer. Ikke "staar der det samme" - "bliver det samme".
   Foelger var()-kaeder rekursivt, saa et primitiv-lag regnes igennem.
   Koer fra projektroden eller en worktree. */
import fs from 'node:fs';
const css = fs.readFileSync('assets/system.css', 'utf8') + '\n'
  + fs.readFileSync('assets/generator.css', 'utf8');

/* Saml ALLE --token: vaerdi (ogsaa uden for :root, saa en omdefinering
   i en media query ikke kan gemme sig for maalingen) */
const raa = new Map();
for (const m of css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(--[a-z0-9-]+)\s*:\s*([^;}]+)/g)) {
  const n = m[1], v = m[2].trim();
  if (!raa.has(n)) raa.set(n, []);
  raa.get(n).push(v);
}

/* Loes var()-kaeder op, med loop-vaern */
const loes = (v, dybde = 0) => {
  if (dybde > 12) return 'LOOP';
  const m = v.match(/^var\((--[a-z0-9-]+)\)$/);
  if (!m) return v;
  const naeste = raa.get(m[1]);
  if (!naeste) return 'UDEFINERET:' + m[1];
  return loes(naeste[0], dybde + 1);
};

const ud = {};
for (const [n, vs] of [...raa].sort()) {
  const l = loes(vs[0]);
  if (/^#|^rgb|^hsl/i.test(l)) ud[n] = { farve: l.toUpperCase(), definitioner: vs.length };
}
if (!Object.keys(ud).length) { console.log('APPARATET ER I STYKKER: 0 farver fundet'); process.exit(1); }

const arg = process.argv[2];
if (arg === '--skriv') { fs.writeFileSync('.tmp-farver.json', JSON.stringify(ud, null, 1)); console.log('gemt ' + Object.keys(ud).length + ' farvetokens'); }
else if (arg === '--sammenlign') {
  const foer = JSON.parse(fs.readFileSync('.tmp-farver.json', 'utf8'));
  let aendret = 0, nye = 0, fjernet = 0;
  for (const n of Object.keys(foer)) {
    if (!ud[n]) { console.log('  FJERNET ' + n + ' (var ' + foer[n].farve + ')'); fjernet++; }
    else if (ud[n].farve !== foer[n].farve) { console.log('  AENDRET  ' + n + ': ' + foer[n].farve + ' -> ' + ud[n].farve); aendret++; }
  }
  for (const n of Object.keys(ud)) if (!foer[n]) { console.log('  NY       ' + n + ' = ' + ud[n].farve); nye++; }
  console.log('foer ' + Object.keys(foer).length + ' tokens, nu ' + Object.keys(ud).length);
  console.log('AENDREDE FARVEVAERDIER: ' + aendret + '   fjernede navne: ' + fjernet + '   nye: ' + nye);
  process.exit(aendret + fjernet ? 1 : 0);
} else {
  console.log('farvetokens: ' + Object.keys(ud).length);
  const efterVaerdi = {};
  for (const [n, o] of Object.entries(ud)) (efterVaerdi[o.farve] ||= []).push(n);
  const dub = Object.entries(efterVaerdi).filter(([, a]) => a.length > 1);
  console.log('vaerdier med flere navne: ' + dub.length);
  for (const [v, a] of dub) console.log('  ' + v + '  <- ' + a.length + ': ' + a.join(' '));
}
