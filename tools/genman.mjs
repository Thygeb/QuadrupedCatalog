import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const map = {
 'unitree-forside-nav-2026-08-19.html':      ['https://www.unitree.com/','Unitree, forside — navigation, brugt til at faststaa modelliste'],
 'unitree-b2-produktside-2026-08-19.html':   ['https://www.unitree.com/b2','Unitree B2, produktside med specifikationstabel'],
 'unitree-b2-w-produktside-2026-08-19.html': ['https://www.unitree.com/b2-w','Unitree B2-W, produktside med specifikationstabel'],
 'unitree-a2-produktside-2026-08-19.html':   ['https://www.unitree.com/A2','Unitree A2, produktside med specifikationstabel (A2 + A2-PRO)'],
 'unitree-a2-w-produktside-2026-08-19.html': ['https://www.unitree.com/A2-W','Unitree A2-W, produktside med specifikationstabel (A2-W + A2-W PRO)'],
 'unitree-as2-produktside-2026-08-19.html':  ['https://www.unitree.com/As2','Unitree As2, produktside med specifikationstabel (AIR/PRO/X/EDU)'],
 'unitree-as2-w-produktside-2026-08-19.html':['https://www.unitree.com/As2-W','Unitree As2-W, produktside med specifikationstabel (X/EDU)'],
 'unitree-go2-produktside-2026-08-19.html':  ['https://www.unitree.com/go2','Unitree Go2, produktside med specifikationstabel (AIR/PRO/X/EDU) og priser'],
 'unitree-go2-w-produktside-2026-08-19.html':['https://www.unitree.com/go2-w','Unitree Go2-W, produktside med specifikationstabel'],
 'unitree-go1-produktside-2026-08-19.html':  ['https://www.unitree.com/go1','Unitree Go1, produktside med specifikationstabel (Air/Pro/Edu) og priser'],
 'unitree-b1-produktside-2026-08-19.html':   ['https://www.unitree.com/b1','Unitree B1, produktside med specifikationstabel'],
 'unitree-b1-16-produktside-2026-08-19.html':['https://www.unitree.com/b1-16','Unitree B1-16 — IKKE en robot: vandtaet ledmotor (komponent). Gemt som bevis for udelukkelsen'],
 'unitree-aliengo-produktside-2026-08-19.html':['https://www.unitree.com/aliengo','Unitree AlienGo, produktside med specifikationstabel'],
 'unitree-a1-produktside-2026-08-19.html':   ['https://www.unitree.com/A1','Unitree A1, produktside — marketingside uden egentlig specifikationstabel'],
 'unitree-b2-shopside-2026-08-19.html':      ['https://shop.unitree.com/products/unitree-b2','Unitree B2, webshopside — hentet for at efterproeve pladsholderprisen'],
 'unitree-a2-shopside-2026-08-19.html':      ['https://shop.unitree.com/products/unitree-a2','Unitree A2, webshopside — hentet for at efterproeve pladsholderprisen'],
};
const rows = [['filnavn','kilde_url','http_status','hentet_utc','sha256','bytes','indhold','sprogversion'].join('\t')];
for (const f of readdirSync('.').filter(x => x.endsWith('.html')).sort()) {
  if (!map[f]) { console.error('UKENDT FIL UDEN URL:', f); continue; }
  const buf = readFileSync(f);
  const sha = createHash('sha256').update(buf).digest('hex');
  const mt = statSync(f).mtime.toISOString().replace('.000Z','Z');
  const sprog = f.includes('shopside') ? 'en (shop.unitree.com, USD)' : 'en-US (unitree.com, "United States / English")';
  rows.push([f, map[f][0], '200', mt, sha, buf.length, map[f][1], sprog].join('\t'));
}
writeFileSync('MANIFEST.tsv', rows.join('\n') + '\n', 'utf8');
console.log(rows.length - 1, 'linjer skrevet');
