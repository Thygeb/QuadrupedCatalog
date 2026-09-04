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
 *
 * ------------------------------------------------------------------------
 * VENDT AF spor/tomstat, 4. sep 2026 (designplanens R8), efter JPK's ord
 * "giv --tom sin egen primitiv".
 *
 * Testen laaste, at --tom loeser op til #E8EBED - altsaa til NOEJAGTIG
 * samme hex som --bund. Det var korrekt at laase i gaar og forkert i dag:
 * netop den identitet var fejlen. "Ikke oplyst" stod paa 1,00 : 1 for
 * FYLDET paa BUNDEN og var usynlig paa hver --bund-flade, hvilket bryder
 * haard begraensning 5 ("'Ikke oplyst', 'nej' og '0' ... skal se
 * forskellige ud").
 *
 * Assertionen er derfor VENDT, ikke slettet. Den beviser nu den nye regel,
 * og den er STRAMMERE end den gamle - hvor der foer stod ét lighedstegn,
 * staar der nu tre krav (59.--tom, 59.19, 59.20):
 *   - --tom loeser op til #E4E7EA
 *   - --tom er IKKE laengere lig --bund  (det, R8 handlede om)
 *   - de fire ANDRE navne paa #E8EBED staar uroerte
 * Vaernet fra STATUS.md linje 143 er dermed intakt: de fem navne blev ikke
 * lagt sammen - ét blev SKILT UD, og testen faelder enhver sammenlaegning.
 * ------------------------------------------------------------------------
 */
import fs from 'node:fs';
import path from 'node:path';

/** De navne, der fandtes FOER spor/primitiv, og den hex de skal blive
 *  ved med at loese op til. Kilde: fund/BRIEF-primitiv.md §1 (mine tal) og
 *  git 5ba2356:assets/system.css, genmaalt af dette spor med
 *  fund/maal-farvetokens.mjs foer noget blev aendret.
 *
 *  --tom staar IKKE i tabellen laengere - den har sin egen, strammere
 *  blok nedenfor (spor/tomstat, R8). 15 navne her, ikke 16. */
const GAMLE_TOKENS = {
  '--bund': '#E8EBED', '--panel': '#FAFBFB', '--panel-ro': '#E8EBED',
  '--blaek': '#22262A', '--blaek2': '#545C63', '--blaek3': '#5F686F',
  '--accent': '#F2C400', '--accent-ro': '#E8EBED',
  '--linje': '#C6CCD1', '--hegn': '#9AA3A9',
  '--fod': '#22262A', '--paafod': '#E8EBED', '--paafod2': '#9AA3A9',
  '--stans': '#FFFFFF', '--stoev-blaek': '#5F686F',
};

/** R8 (spor/tomstat): fyldet bag "ikke oplyst" har sin egen primitiv nu.
 *  Vaerdien er maalt, ikke valgt frit - se fund/FUND-tomstat.md's loft:
 *  skal ordet holde 4,50 : 1 PAA fyldet, kan fyldet hoejst naa 1,05 : 1
 *  mod bunden med --blaek3 som tekst. #E4E7EA ligger paa 1,04. */
const TOM_EFTER_R8 = '#E4E7EA';

/** De fire navne paa #E8EBED, der IKKE maa flytte sig, naar --tom skilles
 *  ud. STATUS.md linje 143: de fem navne maa aldrig lægges SAMMEN - og
 *  denne test faelder baade en sammenlaegning og en utilsigtet spredning. */
const BUNDFAMILIEN = ['--bund', '--panel-ro', '--accent-ro', '--paafod'];

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
  ok('59.a: alle 15 uroerte tokennavne loeser stadig op til deres oprindelige farve (opsummering)',
    alleOk, 'se enkeltposter ovenfor for hvilke der afviger');

  // --- R8, spor/tomstat: --tom er SKILT UD af bundfamilien ---------------
  // Den gamle assertion sagde "--tom loeser op til #E8EBED". Den er vendt,
  // fordi netop den identitet VAR fejlen: fyldet og fladen bagved var samme
  // hex, 1,00 : 1, og "ikke oplyst" var usynlig paa hver --bund-flade.
  {
    const def = raa.get('--tom');
    const tom = def ? loes(def[0]).toUpperCase() : null;
    ok(`59.--tom: loeser op til ${TOM_EFTER_R8} (R8 - egen primitiv, ikke --bund's)`,
      tom === TOM_EFTER_R8, def ? `fandt ${tom} (raa: ${def[0]})` : 'token findes slet ikke laengere');

    const bundDef = raa.get('--bund');
    const bund = bundDef ? loes(bundDef[0]).toUpperCase() : null;
    ok('59.19: --tom og --bund er IKKE laengere samme farve (haard begraensning 5)',
      tom !== null && bund !== null && tom !== bund,
      `--tom -> ${tom}, --bund -> ${bund}. Er de ens, staar "ikke oplyst" paa 1,00 : 1 igen.`);

    // STATUS.md linje 143: de fem navne paa #E8EBED maa ALDRIG lægges sammen.
    // Ét er skilt ud; de fire andre skal staa uroerte paa den gamle vaerdi.
    const afvigere = BUNDFAMILIEN
      .map((n) => [n, raa.get(n) ? loes(raa.get(n)[0]).toUpperCase() : null])
      .filter(([, v]) => v !== '#E8EBED');
    ok('59.20: de fire ANDRE navne paa #E8EBED staar uroerte (--bund, --panel-ro, --accent-ro, --paafod)',
      afvigere.length === 0, `afveg: ${afvigere.map(([n, v]) => `${n}=${v}`).join(', ')}`);
  }

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

  // Kontrol mod at maalingen selv er i stykker: praecis 11 --p-*-primitiver
  // skal findes, og de skal alle vaere literale hex (bunden af kaeden).
  // 9 fra spor/primitiv + 2 fra spor/tomstat (R8): --p-eloxgraa-2 (fyldet
  // bag "ikke oplyst") og --p-stoevgraa-2 (den baerende kant). Tallet er en
  // KONTROL, ikke et krav om at antallet aldrig maa vokse - vokser det,
  // skal den, der lod det vokse, skrive hvorfor her.
  const primitiver = [...raa.keys()].filter((n) => n.startsWith('--p-'));
  const ikkeLiterale = primitiver.filter((n) => !/^#[0-9A-Fa-f]{3,8}$/.test(raa.get(n)[0]));
  ok('59.18: praecis 11 --p-*-primitiver findes, alle som literal hex (kaedens bund)',
    primitiver.length === 11 && ikkeLiterale.length === 0,
    `fandt ${primitiver.length}: ${primitiver.join(', ')}${ikkeLiterale.length ? ' — ikke-literale: ' + ikkeLiterale.join(', ') : ''}`);

  // --- R8: kanten, der BAERER tilstanden, er ikke --hegn laengere --------
  // Uden denne assertion kan en fremtidig oprydning skrive .v-ikke's kant
  // tilbage til var(--hegn) (2,14 : 1 for KANTEN paa BUNDEN), og alt andet
  // i denne fil ville stadig vaere groent - farverne er jo uaendrede.
  {
    const sys = fs.readFileSync(path.join(rod, 'assets', 'system.css'), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '');
    const regel = sys.match(/\.v-ikke\{([^}]*)\}/);
    const maerke = sys.match(/\.v-ikke \.mrk\{([^}]*)\}/);
    const baerer = (blok) => !!blok && /border:[^;]*var\(--hegn-baerende\)/.test(blok);
    ok('59.21: .v-ikke og .v-ikke .mrk bruger var(--hegn-baerende), ikke var(--hegn)',
      baerer(regel && regel[1]) && baerer(maerke && maerke[1]),
      `.v-ikke: ${regel ? regel[1].slice(0, 90) : 'reglen findes ikke'} | .mrk: ${maerke ? maerke[1] : 'findes ikke'}`);

    const kant = raa.get('--hegn-baerende') ? loes(raa.get('--hegn-baerende')[0]).toUpperCase() : null;
    ok('59.22: --hegn-baerende findes og loeser op til #737F87 (3,43 : 1 for KANTEN paa BUNDEN #E8EBED)',
      kant === '#737F87', `fandt ${kant}`);
  }
}
