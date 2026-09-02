/**
 * tests/dele/59-farvetokens.mjs — spor/primitiv, 2. sep 2026.
 *
 * Laaser resultatet af LED 2's foerste del: et primitiv-lag under de 16
 * gamle semantiske farvetokens, uden at fjerne eller sammenlaegge nogen af
 * dem (briefets afsnit 3 - de fem navne paa #E8EBED, herunder --tom bag
 * "ikke oplyst", hard begraensning 5, maa ALDRIG lægges sammen).
 *
 * To ting laases, hver for sig:
 *   1. Alle 16 GAMLE navne findes stadig og LOESER OP (rekursivt gennem
 *      var()-kaeder, praecis som fund/maal-farvetokens.mjs) til NOEJAGTIG
 *      den samme hex-vaerdi som foer dette spor (59.1-59.16).
 *   2. De fire kendte dublet-grupper (#E8EBED x5, #22262A x2, #5F686F x2,
 *      #9AA3A9 x2) peger GENUINT paa et --p-* primitiv - ikke bare "har
 *      samme vaerdi ved et tilfaelde" (59.17), saa en fremtidig agent, der
 *      erstatter var(--p-x) med en ny literal hex paa ét sted, faelder
 *      testen, selvom farven stadig matcher.
 *
 * MAALEAPPARATET er en selvstaendig kopi af resolver-logikken i
 * fund/maal-farvetokens.mjs (loop-vaernet var()-opslag) - denne del maa
 * ikke importere fra fund/, jf. filejerskabet i BRIEF-primitiv.md §5.
 */
import fs from 'node:fs';
import path from 'node:path';

/** De 16 navne, der fandtes FOER spor/primitiv, og den hex de skal blive
 *  ved med at loese op til. Kilde: fund/BRIEF-primitiv.md §1 (mine tal) og
 *  git 5ba2356:assets/system.css, genmaalt af dette spor med
 *  fund/maal-farvetokens.mjs foer noget blev aendret. */
const GAMLE_TOKENS = {
  '--bund': '#E8EBED', '--panel': '#FAFBFB', '--panel-ro': '#E8EBED', '--tom': '#E8EBED',
  '--blaek': '#22262A', '--blaek2': '#545C63', '--blaek3': '#5F686F',
  '--accent': '#F2C400', '--accent-ro': '#E8EBED',
  '--linje': '#C6CCD1', '--hegn': '#9AA3A9',
  '--fod': '#22262A', '--paafod': '#E8EBED', '--paafod2': '#9AA3A9',
  '--stans': '#FFFFFF', '--stoev-blaek': '#5F686F',
};

/** De fire dublet-grupper (DESIGN.md's "## Konflikter" punkt 3) - navnet,
 *  der IKKE maa vaere den eneste vej til vaerdien laengere: hver skal nu
 *  gaa gennem et var(--p-*). */
const DUBLET_NAVNE = ['--bund', '--tom', '--panel-ro', '--accent-ro', '--paafod',
  '--blaek', '--fod', '--blaek3', '--stoev-blaek', '--hegn', '--paafod2'];

export default async function koer(ctx) {
  const { rod, ok } = ctx;

  console.log('\n59. Farvetokens: primitiv-lag under de 16 gamle navne (spor/primitiv)');

  const css = fs.readFileSync(path.join(rod, 'assets', 'system.css'), 'utf8') + '\n'
    + fs.readFileSync(path.join(rod, 'assets', 'generator.css'), 'utf8');
  const uden_kommentarer = css.replace(/\/\*[\s\S]*?\*\//g, '');

  const raa = new Map();
  for (const m of uden_kommentarer.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;}]+)/g)) {
    const n = m[1], v = m[2].trim();
    if (!raa.has(n)) raa.set(n, []);
    raa.get(n).push(v);
  }

  const loes = (v, dybde = 0) => {
    if (dybde > 12) return 'LOOP';
    const m = v.match(/^var\((--[a-z0-9-]+)\)$/);
    if (!m) return v;
    const naeste = raa.get(m[1]);
    if (!naeste) return 'UDEFINERET:' + m[1];
    return loes(naeste[0], dybde + 1);
  };

  if (raa.size === 0) {
    ok('59.0: apparatet fandt overhovedet nogen --token i CSS\'en', false, 'raa.size === 0');
    return;
  }

  let alleOk = true;
  for (const [navn, forventet] of Object.entries(GAMLE_TOKENS)) {
    const def = raa.get(navn);
    const fundet = def ? loes(def[0]).toUpperCase() : null;
    const passer = fundet === forventet;
    if (!passer) alleOk = false;
    ok(`59.${navn}: loeser op til ${forventet}`, passer,
      def ? `fandt ${fundet} (raa: ${def[0]})` : 'token findes slet ikke laengere');
  }
  ok('59.a: alle 16 gamle tokennavne loeser stadig op til deres oprindelige farve (opsummering)',
    alleOk, 'se enkeltposter ovenfor for hvilke der afviger');

  // 2. Dublet-gruppens medlemmer skal GAA GENNEM et --p-* primitiv - ikke
  // bare tilfaeldigvis have samme literale hex igen. En semantisk token,
  // hvis raa vaerdi IKKE er "var(--p-...)", er ikke lagt paa primitiv-laget,
  // uanset om den stadig loeser til den rigtige farve.
  const ikkeIndirekte = [];
  for (const navn of DUBLET_NAVNE) {
    const def = raa.get(navn);
    const raaVaerdi = def ? def[0] : null;
    if (!raaVaerdi || !/^var\(--p-[a-z0-9-]+\)$/.test(raaVaerdi)) ikkeIndirekte.push(`${navn}=${raaVaerdi}`);
  }
  ok('59.17: alle 11 dublet-tokens peger paa et --p-* primitiv (ikke literal hex laengere)',
    ikkeIndirekte.length === 0, `ikke-indirekte: ${ikkeIndirekte.join(', ')}`);

  // Kontrol mod at maalingen selv er i stykker: praecis 9 --p-*-primitiver
  // skal findes, og de skal alle vaere literale hex (bunden af kaeden).
  const primitiver = [...raa.keys()].filter((n) => n.startsWith('--p-'));
  const ikkeLiterale = primitiver.filter((n) => !/^#[0-9A-Fa-f]{3,8}$/.test(raa.get(n)[0]));
  ok('59.18: praecis 9 --p-*-primitiver findes, alle som literal hex (kaedens bund)',
    primitiver.length === 9 && ikkeLiterale.length === 0,
    `fandt ${primitiver.length}: ${primitiver.join(', ')}${ikkeLiterale.length ? ' — ikke-literale: ' + ikkeLiterale.join(', ') : ''}`);
}
