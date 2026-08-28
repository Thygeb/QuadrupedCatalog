// Taeller ALLE vaerdiceller (stribe-<li> OG feltliste-.raekke) med >1 forbehold--skjult.
import fs from 'node:fs'; import path from 'node:path';
const rod = process.argv[2] || 'dist';
const stat = { li: [0,0], raekke: [0,0], andet: 0 };
let total = 0;
function tael(html, key, re) {
  for (const m of html.matchAll(re)) {
    const c = m[0];
    if (!c.includes('forbehold--skjult')) continue;
    const n = (c.match(/forbehold--skjult/g) || []).length;
    stat[key][0]++;                 // celler med mindst én
    if (n > 1) stat[key][1] += n-1; // overskydende
  }
}
function gaa(d) {
  for (const p of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, p.name);
    if (p.isDirectory()) { gaa(f); continue; }
    if (!p.name.endsWith('.html')) continue;
    const h = fs.readFileSync(f, 'utf8');
    total += (h.match(/forbehold--skjult/g) || []).length;
    tael(h, 'li', /<li\b[^>]*>[\s\S]*?<\/li>/g);
    tael(h, 'raekke', /<div class="raekke">[\s\S]*?<\/div>\s*<\/div>/g);
  }
}
gaa(rod);
console.log(`forbehold--skjult i alt i dist: ${total}`);
console.log(`stribe <li>   : ${stat.li[0]} celler med maerke, ${stat.li[1]} overskydende`);
console.log(`feltliste .raekke: ${stat.raekke[0]} celler med maerke, ${stat.raekke[1]} overskydende`);
