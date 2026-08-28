// Taeller stribeceller (<li> i .stribe) der udskriver forbehold--skjult mere end én gang.
import fs from 'node:fs';
import path from 'node:path';
const rod = process.argv[2] || 'dist';
let celler = 0, dubletter = 0, ialt = 0;
const perFil = new Map();
function gaa(d) {
  for (const p of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, p.name);
    if (p.isDirectory()) { gaa(f); continue; }
    if (!p.name.endsWith('.html')) continue;
    const h = fs.readFileSync(f, 'utf8');
    for (const m of h.matchAll(/<li\b[^>]*>[\s\S]*?<\/li>/g)) {
      const c = m[0];
      if (!c.includes('class="krop"') && !c.includes('forbehold--skjult')) continue;
      if (!c.includes('forbehold--skjult')) { celler++; continue; }
      celler++;
      const n = (c.match(/forbehold--skjult/g) || []).length;
      ialt += n;
      if (n > 1) { dubletter++; perFil.set(f, (perFil.get(f) || 0) + 1); }
    }
  }
}
gaa(rod);
console.log(`stribeceller undersoegt: ${celler}`);
console.log(`celler med >1 forbehold--skjult: ${dubletter}`);
console.log(`forbehold--skjult i alt i de celler: ${ialt}`);
console.log(`filer beroert: ${perFil.size}`);
