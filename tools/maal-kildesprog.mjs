/* Maaler kinesisk kildetekst i det BYGGEDE output og deler den i fire klasser.
 *
 * Bygget af orkestratoren 28. aug 2026 som acceptkriterie-apparat for
 * spor/kildesprog. Gaelder KUN synlig tekst: title= og .kunskaerm fjernes
 * foerst, fordi de er skaermlaeser-/tooltip-lag og ikke det, oejet moeder.
 *
 * De fire klasser, og hvorfor graensen ligger der:
 *   CITAT   staar i anfoerselstegn -> producentens egen etiket, ordret.
 *           Det ER kildeloeftet. Maa ALDRIG fjernes.
 *   NAVN    latinsk navn + kinesisk i parentes ("Lingmao Cyvet (灵猫·Cyvet)").
 *           Ogsaa legitimt.
 *   GLOSSET raa kinesisk, men med dansk forklaring ved siden af.
 *   RAA     hverken citat, navn eller gloss - intet latinsk tegn overhovedet.
 *           Det er FEJLEN.
 *
 * Koer:  node tools/maal-kildesprog.mjs [dist-mappe]
 */
import fs from 'node:fs';

const rod = process.argv[2] ?? 'dist';
const tael = { citat: 0, navn: 0, glosset: 0, raa: 0 };
const raaEks = [];
const perFil = {};

const gaa = (d) => {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = d + '/' + f.name;
    if (f.isDirectory()) { gaa(p); continue; }
    if (!f.name.endsWith('.html')) continue;

    const r = fs.readFileSync(p, 'utf8')
      .replace(/title="[^"]*"/g, '')
      .replace(/<span class="kunskaerm">.*?<\/span>/gs, '')
      .replace(/<[^>]+>/g, '|');

    for (const s of (r.match(/[^|]*[一-鿿][^|]*/g) ?? [])) {
      const t = s.trim();
      if (/&quot;|"|「/.test(t)) { tael.citat++; continue; }
      if (/[（(][^)）]*[一-鿿]/.test(t) && /[A-Za-z]/.test(t)) { tael.navn++; continue; }
      if (/[a-zæøåA-ZÆØÅ]{3,}/.test(t)) { tael.glosset++; continue; }
      tael.raa++;
      const robot = p.split('/').slice(-2)[0];
      perFil[robot] = (perFil[robot] ?? 0) + 1;
      if (raaEks.length < 15) raaEks.push(robot + ' :: ' + t.slice(0, 70));
    }
  }
};
gaa(rod);

console.log('CITAT   (anfoerselstegn, LEGITIMT) :', tael.citat);
console.log('NAVN    (Latin + kinesisk, LEGITIMT):', tael.navn);
console.log('GLOSSET (raa, men dansk ved siden) :', tael.glosset);
console.log('RAA     (HELT uoversat = FEJLEN)   :', tael.raa);
console.log('\nvaerst ramte sider:');
for (const [k, v] of Object.entries(perFil).sort((a, b) => b[1] - a[1]).slice(0, 8))
  console.log('  ' + String(v).padStart(3), k);
console.log('\neksempler paa RAA:');
for (const e of raaEks) console.log('  ' + e);
