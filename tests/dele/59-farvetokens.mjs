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

  // --- R8: KONTRASTEN, ikke bare hex-vaerdierne ---------------------------
  // Hvorfor de to naeste assertions ikke er overfloedige ved siden af
  // 59.--tom: den laaser en HEX. Justerer nogen --blaek3 (tekstfarven) et
  // halvt trin, er --tom uroert, 59.--tom er groen, og ordet paa fyldet
  // falder under 4,50 uden at noget faelder. Marginen er 0,08 - den
  // overlever ikke en token-justering, som ingen maaler.
  //
  // Farverne LAESES ud af .v-ikke-reglen gennem token-kaeden, ikke skrevet
  // ind her: skrives kanten tilbage til var(--hegn), falder 59.21 med det
  // samme, fordi TALLET falder - ikke fordi en streng ikke matcher.
  {
    const sys = fs.readFileSync(path.join(rod, 'assets', 'system.css'), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '');
    const regel = sys.match(/\.v-ikke\{([^}]*)\}/);
    const maerke = sys.match(/\.v-ikke \.mrk\{([^}]*)\}/);

    // WCAG 2.x relativ luminans og kontrast. Egen kopi, jf. filejerskabet:
    // denne del maa ikke importere fra fund/.
    const kanal = (c) => { const v = c / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    const lum = (h) => {
      const [r, g, b] = [1, 3, 5].map((i) => kanal(parseInt(h.slice(i, i + 2), 16)));
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const kontrast = (a, b) => {
      const [x, y] = [lum(a), lum(b)];
      return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
    };
    const vis = (n) => n.toFixed(2).replace('.', ',');
    /** Foelg en egenskab i en CSS-blok til sin hex gennem var()-kaeden. */
    const farveI = (blok, egenskab) => {
      if (!blok) return null;
      const m = blok.match(new RegExp(`${egenskab}:[^;]*?var\\((--[a-z0-9-]+)\\)`));
      if (!m || !raa.has(m[1])) return null;
      const h = loes(raa.get(m[1])[0]).toUpperCase();
      return /^#[0-9A-F]{6}$/.test(h) ? h : null;
    };

    const KANT = farveI(regel && regel[1], 'border');
    const FYLD = farveI(regel && regel[1], 'background');
    const TEKST = farveI(regel && regel[1], 'color');
    const MKANT = farveI(maerke && maerke[1], 'border');
    const BUND = raa.get('--bund') ? loes(raa.get('--bund')[0]).toUpperCase() : null;

    // Kontrol mod et gaaet-i-stykker apparat: et kendt tal, der ikke aendrer
    // sig med nogen af de poletter, R8 roerte. Falder den, er det regnestykket
    // og ikke designet, der er galt - og de to naeste tal maa ikke bruges.
    ok('59.20b (kontrol): apparatet regner --blaek3 #5F686F PAA --bund #E8EBED til 4,74',
      vis(kontrast('#5F686F', '#E8EBED')) === '4,74',
      `fandt ${vis(kontrast('#5F686F', '#E8EBED'))} - kontrasteregningen selv er i stykker`);

    const alleFundet = KANT && FYLD && TEKST && MKANT && BUND;
    if (!alleFundet) {
      ok('59.21+59.22: farverne kunne laeses ud af .v-ikke-reglen', false,
        `kant=${KANT} fyld=${FYLD} tekst=${TEKST} mrk-kant=${MKANT} bund=${BUND}`);
    } else {
      const kb = kontrast(KANT, BUND), kf = kontrast(KANT, FYLD), km = kontrast(MKANT, FYLD);
      ok(`59.21: .v-ikke's baerende KANT >= 3,00 mod begge naboer (WCAG 1.4.11). I dag ${vis(kb)} / ${vis(kf)}`,
        kb >= 3 && kf >= 3 && km >= 3,
        `KANTEN ${KANT} paa BUNDEN ${BUND}: ${vis(kb)} (krav 3,00) · KANTEN paa FYLDET ${FYLD}: ${vis(kf)} `
        + `· 9x9-firkantens KANT ${MKANT} paa FYLDET: ${vis(km)}`);

      const tf = kontrast(TEKST, FYLD);
      ok(`59.22: .v-ikke's TEKST >= 4,50 mod sit EGET FYLD (WCAG 1.4.3). I dag ${vis(tf)}`,
        tf >= 4.5,
        `TEKSTEN ${TEKST} paa FYLDET ${FYLD}: ${vis(tf)} (krav 4,50). Marginen er lille med vilje - `
        + 'et fyld, moerkt nok til at baere tilstanden selv, goer ordet ulaeseligt. Se fund/FUND-tomstat.md.');
    }

    // De to strukturelle laase beholdes ved siden af kontrasttallene: en
    // kontrast kan holde, mens polethierarkiet skrider (fx en literal hex
    // skrevet direkte i reglen), og saa er systemet gaaet i stykker, selv om
    // tallet er groent.
    const baerer = (blok) => !!blok && /border:[^;]*var\(--hegn-baerende\)/.test(blok);
    ok('59.23: .v-ikke og .v-ikke .mrk bruger var(--hegn-baerende), ikke var(--hegn)',
      baerer(regel && regel[1]) && baerer(maerke && maerke[1]),
      `.v-ikke: ${regel ? regel[1].slice(0, 90) : 'reglen findes ikke'} | .mrk: ${maerke ? maerke[1] : 'findes ikke'}`);

    const kant = raa.get('--hegn-baerende') ? loes(raa.get('--hegn-baerende')[0]).toUpperCase() : null;
    ok('59.24: --hegn-baerende findes og loeser op til #737F87',
      kant === '#737F87', `fandt ${kant}`);

    // --- spor/hegn2: de to sidste --hegn-kanter, der bar en oplysning -----
    // Samme grund som 59.21/59.23 er delt i to: en hex-laas alene er blind
    // for kontrast, og et kontrasttal alene laaser ikke poletten. Skrives
    // :1022 eller :2052 tilbage til var(--hegn), skal BEGGE typer falde.
    const stribeRegel = sys.match(/\.stribe--intet\{([^}]*)\}/);
    const maerkeTomRegel = sys.match(/\.typeskilt \.maerke--tom\{([^}]*)\}/);

    const S_KANT = farveI(stribeRegel && stribeRegel[1], 'border');
    const S_FYLD = farveI(stribeRegel && stribeRegel[1], 'background');
    const S_ALLE = S_KANT && S_FYLD && BUND;
    const skf = S_ALLE ? kontrast(S_KANT, S_FYLD) : null;
    const skb = S_ALLE ? kontrast(S_KANT, BUND) : null;
    ok(`59.25: .stribe--intets baerende KANT >= 3,00 mod BAADE eget FYLD og --bund (WCAG 1.4.11). I dag ${skf === null ? '?' : vis(skf)} / ${skb === null ? '?' : vis(skb)}`,
      S_ALLE && skf >= 3 && skb >= 3,
      S_ALLE
        ? `KANTEN ${S_KANT} paa eget FYLD ${S_FYLD}: ${vis(skf)} (krav 3,00) · KANTEN paa BUNDEN ${BUND}: ${vis(skb)} (krav 3,00)`
        : `farverne kunne ikke laeses ud af reglen: kant=${S_KANT} fyld=${S_FYLD} bund=${BUND}`);

    const M_KANT = farveI(maerkeTomRegel && maerkeTomRegel[1], 'border');
    const M_ALLE = M_KANT && BUND;
    const mkb = M_ALLE ? kontrast(M_KANT, BUND) : null;
    const brugerBaerende = baerer(maerkeTomRegel && maerkeTomRegel[1]);
    ok(`59.26: .typeskilt .maerke--toms baerende KANT >= 3,00 mod --bund (WCAG 1.4.11) og bruger var(--hegn-baerende). I dag ${mkb === null ? '?' : vis(mkb)}`,
      M_ALLE && mkb >= 3 && brugerBaerende,
      M_ALLE
        ? `KANTEN ${M_KANT} paa BUNDEN ${BUND}: ${vis(mkb)} (krav 3,00) · struktur: ${brugerBaerende ? 'bruger --hegn-baerende' : 'bruger IKKE --hegn-baerende'}`
        : `farven kunne ikke laeses ud af reglen: kant=${M_KANT} bund=${BUND}`);
  }
}
