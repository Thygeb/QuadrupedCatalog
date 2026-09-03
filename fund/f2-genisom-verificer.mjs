/* Efterprøver HVER fragment i den FÆRDIGE FIELD_ENTRIES/ROBOTS-ordlyd (fra
 * db/f2-genisom-skriv.mjs) bogstaveligt mod de rå kildefiler - baade den
 * oprindelige batch (raa-genisom-2026-08-24) og de frisk hentede filer
 * (raa-f2-genisom-2026-09-02). Samme metode som fund/f2-genisom-fragtjek.mjs,
 * genbrugt paa den FAERDIGE tekst i stedet for den forurenede original.
 *
 * Brug: node fund/f2-genisom-verificer.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const DIRS = ['media/_kilder/raa-genisom-2026-08-24', 'media/_kilder/raa-f2-genisom-2026-09-02'];
const indhold = new Map();
for (const dir of DIRS) {
  const full = path.resolve(dir);
  if (!fs.existsSync(full)) continue;
  for (const f of fs.readdirSync(full)) {
    if (!/\.(html|json|txt)$/.test(f)) continue;
    indhold.set(dir + '/' + f, fs.readFileSync(path.join(full, f), 'utf8'));
  }
}

function fragmenter(wording) {
  if (!wording) return [];
  const dele = [];
  const re = /"([^"]*)"/g;
  let m;
  while ((m = re.exec(wording))) if (m[1].trim()) dele.push(m[1]);
  return dele;
}

function findFiler(frag) {
  const helt = [];
  for (const [f, txt] of indhold) if (txt.includes(frag)) helt.push(f);
  if (helt.length) return { metode: 'helt', filer: helt };

  // "..." markerer en bevidst udeladelse - tjek delene FOER/EFTER hver for sig.
  if (frag.includes('...')) {
    const dele = frag.split('...').map((d) => d.trim()).filter(Boolean);
    const fundetAlle = [];
    for (const [f, txt] of indhold) if (dele.every((d) => txt.includes(d))) fundetAlle.push(f);
    if (fundetAlle.length) return { metode: 'ellipse', filer: fundetAlle };
  }

  // " / " joiner to citater fra SEPARATE DOM-elementer (fx billedtekst +
  // brødtekst i samme UI-slide) - samme accepterede konvention som label+
  // vaerdi i to celler. Tjek begge dele hver for sig i SAMME fil.
  if (frag.includes(' / ')) {
    const dele = frag.split(' / ').map((d) => d.trim()).filter(Boolean);
    const fundetAlle = [];
    for (const [f, txt] of indhold) if (dele.every((d) => txt.includes(d))) fundetAlle.push(f);
    if (fundetAlle.length) return { metode: 'skraastreg-split', filer: fundetAlle };
  }

  const iKolon = frag.indexOf(': ');
  if (iKolon > 0) {
    const etiket = frag.slice(0, iKolon).trim();
    const vaerdi = frag.slice(iKolon + 2).trim();
    const split = [];
    for (const [f, txt] of indhold) if (txt.includes(etiket) && txt.includes(vaerdi)) split.push(f);
    if (split.length) return { metode: 'split kolon', filer: split };
  }
  // Etiket+vaerdi UDEN separator (fx "站立尺寸（长 × 宽 × 高）约 630 × 360 mm"
  // - kildens JSON har dem i to felter, "name"+"value", sammensat her uden
  // mellemrum/kolon). Proev at splitte lige efter "）".
  const iParen = frag.indexOf('）');
  if (iParen > 0 && iParen < frag.length - 1) {
    const etiket = frag.slice(0, iParen + 1).trim();
    const vaerdi = frag.slice(iParen + 1).trim();
    const split = [];
    for (const [f, txt] of indhold) if (txt.includes(etiket) && txt.includes(vaerdi)) split.push(f);
    if (split.length) return { metode: 'split efter）', filer: split };
  }
  const iSpace = frag.indexOf(' ');
  if (iSpace > 0) {
    const etiket = frag.slice(0, iSpace).trim();
    const vaerdi = frag.slice(iSpace + 1).trim();
    const split = [];
    for (const [f, txt] of indhold) if (txt.includes(etiket) && txt.includes(vaerdi)) split.push(f);
    if (split.length) return { metode: 'split blank', filer: split };
  }
  return { metode: null, filer: [] };
}

const { FIELD_ENTRIES, ROBOTS } = await import('../db/f2-genisom-skriv.mjs');

let tjekket = 0;
let fejl = 0;
for (const r of FIELD_ENTRIES) {
  for (const frag of fragmenter(r.caveat_wording)) {
    tjekket++;
    const res = findFiler(frag);
    if (!res.filer.length) {
      fejl++;
      console.log(`FEJL [${r.robot_id}/${r.field_name}] "${frag}" -> INGEN FIL`);
    }
  }
}
for (const rb of ROBOTS) {
  for (const w of rb.notes_wording || []) {
    for (const frag of fragmenter(w)) {
      tjekket++;
      const res = findFiler(frag);
      if (!res.filer.length) {
        fejl++;
        console.log(`FEJL [robots ${rb.id} notes_wording] "${frag}" -> INGEN FIL`);
      }
    }
  }
}
console.log(`\nFragmenter tjekket: ${tjekket}, fejl: ${fejl}`);
