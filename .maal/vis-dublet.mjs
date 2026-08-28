import fs from 'node:fs'; import path from 'node:path';
let vist = 0;
function gaa(d) {
  for (const p of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, p.name);
    if (p.isDirectory()) { gaa(f); continue; }
    if (!p.name.endsWith('.html') || vist >= 2) continue;
    const h = fs.readFileSync(f, 'utf8');
    for (const m of h.matchAll(/<li\b[^>]*>[\s\S]*?<\/li>/g)) {
      const c = m[0];
      if ((c.match(/forbehold--skjult/g) || []).length > 1 && vist < 2) {
        console.log('--- ' + f + ' ---'); console.log(c.slice(0, 1400)); console.log(); vist++;
      }
    }
  }
}
gaa('dist');
