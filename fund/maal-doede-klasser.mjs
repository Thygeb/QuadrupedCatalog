/* Runde 2: renser de to falske positiver ud af runde 1's tal.
   A) "doed" kan vaere en klasse, JavaScript tilfoejer ved koersel.
   B) "ustylet" kan vaere en klasse, en skabelon styler i sin EGEN inline <style>. */
import fs from 'node:fs';
import path from 'node:path';

const rod = process.cwd(); // koer fra projektroden ELLER en worktree
const laes = (p) => fs.readFileSync(path.join(rod, p), 'utf8');

const stilark = ['assets/system.css', 'assets/generator.css'];
const iCss = new Set();
for (const f of stilark) {
  const uden = laes(f).replace(/\/\*[\s\S]*?\*\//g, '');
  const sel = uden.split('}').map((b) => b.split('{')[0]).join(' ');
  for (const m of sel.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) iCss.add(m[1]);
}

const brugt = new Set();
const inlineCss = [];           // al CSS fra <style> i de byggede sider
const gaa = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) gaa(p);
    else if (e.name.endsWith('.html')) {
      const html = fs.readFileSync(p, 'utf8');
      for (const m of html.matchAll(/class="([^"]*)"/g))
        for (const c of m[1].split(/\s+/)) if (c) brugt.add(c);
      for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) inlineCss.push(m[1]);
    }
  }
};
gaa(path.join(rod, 'dist'));

// A) klasser JS kan tilfoeje
const js = fs.readdirSync(path.join(rod, 'assets'))
  .filter((f) => f.endsWith('.js'))
  .map((f) => laes('assets/' + f)).join('\n');

// B) klasser stylet i inline <style>
const iInline = new Set();
{
  const uden = inlineCss.join('\n').replace(/\/\*[\s\S]*?\*\//g, '');
  const sel = uden.split('}').map((b) => b.split('{')[0]).join(' ');
  for (const m of sel.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) iInline.add(m[1]);
}

const raaDoede = [...iCss].filter((c) => !brugt.has(c));
const iJs = raaDoede.filter((c) => new RegExp('[\'"`]' + c.replace(/[-]/g, '\\-') + '[\'"` ]').test(js));
const aegteDoede = raaDoede.filter((c) => !iJs.includes(c)).sort();

const raaUstylede = [...brugt].filter((c) => !iCss.has(c));
const daekketInline = raaUstylede.filter((c) => iInline.has(c));
const aegteUstylede = raaUstylede.filter((c) => !iInline.has(c)).sort();

console.log('KONTROL: inline <style> fandtes i dist (forventer >0 blokke): ' + inlineCss.length);
console.log('KONTROL: klasser stylet inline (forventer >0): ' + iInline.size + '\n');
console.log('doede foer rensning : ' + raaDoede.length);
console.log('  heraf naevnt i JS : ' + iJs.length + '  -> IKKE doede');
console.log('  AEGTE DOEDE       : ' + aegteDoede.length + '\n');
console.log('ustylede foer rensning : ' + raaUstylede.length);
console.log('  heraf stylet inline  : ' + daekketInline.length + '  -> IKKE ustylede');
console.log('  AEGTE USTYLEDE       : ' + aegteUstylede.length + '\n');
console.log('JS-brugte (falske doede): ' + iJs.sort().join('  ') + '\n');
console.log('AEGTE DOEDE:\n  ' + aegteDoede.join('  ') + '\n');
console.log('AEGTE USTYLEDE:\n  ' + aegteUstylede.join('  '));
