// D14: dump alle forbehold paa TALFELTER (tilstand==='tal') fra dist/robots.json,
// til manuel laesning og klassifikation. Ingen regex-dom - kun uddrag til visning.
import fs from 'node:fs';

const j = JSON.parse(fs.readFileSync('dist/robots.json', 'utf8'));
const out = [];
let n = 0;
for (const r of j.robotter) {
  const rows = [];
  for (const [felt, p] of Object.entries(r.alle_felter || {})) {
    if (p && typeof p === 'object' && p.tilstand === 'tal' && p.forbehold) {
      rows.push({ felt, tekst: p.forbehold });
      n++;
    }
  }
  if (rows.length) {
    out.push(`=== ${r.slug} (${rows.length}) ===`);
    rows.forEach((row) => out.push(`[${row.felt}] ${row.tekst}`));
    out.push('');
  }
}
fs.writeFileSync(process.argv[2], out.join('\n'), 'utf8');
console.log('robotter:', out.filter((l) => l.startsWith('===')).length, 'forbehold:', n);
