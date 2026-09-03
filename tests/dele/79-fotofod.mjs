/**
 * tests/dele/79-fotofod.mjs — spor/fotofod, 3. sep 2026.
 *
 * JPK, ordret: "Fodnoter til foto skal vaere i deres respektive kollonner."
 * fotoophavHTML() (én <p class="saml-fotoophav"> under hele tabellen,
 * "Producentens eget billede. Addverb (...) · ANYbotics (...)") er erstattet
 * af fotoFodHTML() (en <tfoot> med én celle pr. robot) og fotoIndledningHTML()
 * (den faelles indledning, uaendret ét sted).
 *
 * HVORFOR DENNE FIL BLANDER TO TESTFORMER, IKKE VAELGER ÉN:
 * matricen tegnes KLIENTSIDE (assets/sammenligning.js' tabelHTML()), og staar
 * derfor slet ikke i dist/da/sammenligning/index.html - 0 <table> maalt der.
 * En ren kildetest (grep i assets/sammenligning.js) beviser kun at koden
 * FINDES, ikke at den goer det rigtige. Derfor:
 *
 *   DEL A (79.1-79.5) koerer den RIGTIGE fotoFodHTML()/fotoIndledningHTML(),
 *   UDTRUKKET af assets/sammenligning.js selv (ikke genskrevet), i en vm mod
 *   SYNTETISKE {producent, foto} objekter. Det er IKKE katalogdata og paastaar
 *   intet om en rigtig robot (haard begraensning 2 gaelder data/robots/, ikke
 *   testens egne pladsholderobjekter) - det er den eneste vej til at proeve
 *   "0 krediterede robotter"-grenen, fordi det RIGTIGE datasaet kun har ÉN
 *   robot uden billede (xiaomi-cyberdog-1) og dermed ingen ægte to-robotter-
 *   uden-foto-kombination at vaelge blandt.
 *
 *   DEL B (79.6) bygger HELE kataloget med den RIGTIGE build.mjs, koerer den
 *   RIGTIGE assets/sammenligning.js i en vm mod en DOM-shim (samme moenster
 *   som tools/maal-tabelsemantik.mjs, som tests/dele/29 bruger - importeret
 *   herfra, ikke gentaget), og laeser den FAKTISKE <tfoot> for tre RIGTIGE
 *   robotter (to krediterede, én uden foto). Det er beviset for, at
 *   ledningerne fra rigtig YAML til rigtig DOM rent faktisk virker - Del A
 *   beviser kun, at den isolerede funktion er korrekt.
 *
 * Bygger sin egen dist i tmp, jf. tests/LAESMIG.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { parse, queryAll } from '../../tools/maal-tabelsemantik.mjs';

/** Brace-balanceret udtraek af "function <navn>(...) { ... }" fra kildeteksten -
 *  IKKE en generel parser, kun robust nok til navngivne top-niveau-funktioner
 *  uden regex/skabelonstrenge med ubalancerede krøller (sammenligning.js har
 *  ingen). Fejler haardt (kaster), hvis funktionen ikke findes - en tavs tom
 *  streng ville give et falsk "0 fund" i stedet for en aabenlys testfejl. */
function udtraekFunktion(kilde, navn) {
  const noegle = `function ${navn}(`;
  const start = kilde.indexOf(noegle);
  if (start < 0) throw new Error(`udtraekFunktion: "${navn}" ikke fundet i kilden`);
  const kroelleStart = kilde.indexOf('{', start);
  let dybde = 0;
  let i = kroelleStart;
  for (; i < kilde.length; i++) {
    if (kilde[i] === '{') dybde++;
    else if (kilde[i] === '}') { dybde--; if (dybde === 0) break; }
  }
  if (dybde !== 0) throw new Error(`udtraekFunktion: ubalancerede krøller i "${navn}"`);
  return kilde.slice(start, i + 1);
}

/** Koerer de tre udtrukne funktioner i en vm mod en DATA, testen selv styrer. */
function koerFotofodFunktioner(kilde, data) {
  const escSrc = udtraekFunktion(kilde, 'esc');
  const fodSrc = udtraekFunktion(kilde, 'fotoFodHTML');
  const indlSrc = udtraekFunktion(kilde, 'fotoIndledningHTML');
  const sandkasse = { DATA: data, String };
  vm.createContext(sandkasse);
  vm.runInContext(`${escSrc}\n${fodSrc}\n${indlSrc}`, sandkasse);
  return { fod: sandkasse.fotoFodHTML, indl: sandkasse.fotoIndledningHTML };
}

/** Samme sandkasse som tools/maal-tabelsemantik.mjs' kaldTabelHTML(), men med
 *  en ARBEJDENDE window.localStorage, saa PRAECIS de robotter, scenariet
 *  kraever, bliver valgt - kaldTabelHTML() selv har ingen localStorage og
 *  falder derfor altid tilbage til DATA.standard (uden for denne tests
 *  kontrol). `slug` og laesningen af den ('quad-sammenligning') er sidens
 *  egne, uaendrede - se assets/sammenligning.js:700. */
function kaldTabelHTMLMedValg(sideHTML, scriptKilde, slugs) {
  const domRod = parse(sideHTML);
  const htmlEl = queryAll(domRod, 'html')[0] || null;
  const dokument = {
    documentElement: htmlEl,
    getElementById: (id) => queryAll(domRod, `#${id}`)[0] || null,
    querySelector: (sel) => queryAll(domRod, sel)[0] || null,
    querySelectorAll: (sel) => queryAll(domRod, sel),
  };
  const lager = new Map([['quad-sammenligning', JSON.stringify(slugs)]]);
  const localStorage = {
    getItem: (k) => (lager.has(k) ? lager.get(k) : null),
    setItem: (k, v) => lager.set(k, String(v)),
  };
  const sandkasse = { document: dokument, window: { Intl, localStorage }, Intl, console };
  vm.createContext(sandkasse);
  vm.runInContext(scriptKilde, sandkasse, { filename: 'assets/sammenligning.js' });
  const resultat = dokument.querySelector('[data-saml-resultat]');
  return resultat ? resultat.innerHTML : '';
}

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n79. Fotokreditten staar pr. kolonne i en <tfoot> (spor/fotofod)');

  const kilde = fs.readFileSync(path.join(rod, 'assets', 'sammenligning.js'), 'utf8');
  const DATA = { tekst: { hentet: 'Hentet', foto_ophav: 'Producentens eget billede.' } };
  const { fod, indl } = koerFotofodFunktioner(kilde, DATA);

  /* --- DEL A: den isolerede, RIGTIGE funktion, tre synteiske robotter ---- */

  const treRobotter = [
    { producent: 'Galileo (Tianjin)', foto: { ophav: 'fabrikant', hentet: '2026-08-26' } },
    { producent: 'WEILAN', foto: { ophav: 'fabrikant', hentet: '2026-08-19' } },
    { producent: 'Uden Foto', foto: null },
  ];
  const fodHTML = fod(treRobotter);
  const celler = [...fodHTML.matchAll(/<td class="saml-fotofod__(?:hjoerne|celle)"[^>]*>([^<]*)<\/td>/g)]
    .map((m) => m[1]);

  ok('79.1: fotoFodHTML() giver PRAECIS 1 tom etiketcelle + 1 celle pr. robot (4)',
    celler.length === 4, `celler=${celler.length} · fodHTML=${fodHTML}`);

  ok('79.2: hjoernecellen (foerste) er tom - samme moenster som specimenHoved()',
    celler[0] === '', `hjoernecelle="${celler[0]}"`);

  ok('79.3: hver krediteret robot staar i sin EGEN celle, i samme raekkefoelge som robotter[]',
    celler[1] === 'Galileo (Tianjin) (Hentet 2026-08-26)'
    && celler[2] === 'WEILAN (Hentet 2026-08-19)',
    `celler=${JSON.stringify(celler)}`);

  ok('79.4: en robot uden fabrikantfoto giver en TOM celle, ikke en opfundet kredit',
    celler[3] === '', `celle for "Uden Foto"="${celler[3]}"`);

  // --- 79.5: INGEN af de viste har fabrikantfoto -> INGEN <tfoot> overhovedet
  const totIngenFoto = [{ producent: 'A', foto: null }, { producent: 'B', foto: { ophav: 'ukendt' } }];
  const fodTom = fod(totIngenFoto);
  const indlTom = indl(totIngenFoto);
  ok('79.5: er ingen af de viste fotos fabrikantens, udebliver <tfoot> OG indledningen helt',
    fodTom === '' && indlTom === '',
    `fod="${fodTom}" · indledning="${indlTom}"`);

  // --- 79.6 REVERT-BEVIS: den GAMLE udgaves faktiske output (ordret, foer
  // rettelsen) skal AFVISES af 79.1/79.3's kriterium. Uden denne kunne
  // celler-udtraekket vaere i stykker og altid give "4 celler, rigtig raekke-
  // foelge" - ogsaa for den gamle, sammenspaendte saetning. */
  {
    const gammel = '<p class="saml-fotoophav">Producentens eget billede. '
      + 'Galileo (Tianjin) (Hentet 2026-08-26) · WEILAN (Hentet 2026-08-19)</p>';
    const gammelCeller = [...gammel.matchAll(/<td class="saml-fotofod__(?:hjoerne|celle)"[^>]*>([^<]*)<\/td>/g)];
    ok('79.6 (revert-bevis): den gamle ÉN-saetning-udgave har INGEN saml-fotofod-celler',
      gammelCeller.length === 0 && !gammel.includes('<tfoot'),
      `fandt ${gammelCeller.length} celler i den gamle udgave - 79.1 ville vaere faldet paa den`);
  }

  /* --- DEL B: den RIGTIGE build, RIGTIGE robotter, RIGTIG DOM --------------
     addverb-trakr-20 og anybotics-anymal er de eneste to producenter, testen
     selv vaelger vilkaarligt blandt de 76 med billede.ophav="fabrikant";
     xiaomi-cyberdog-1 er den ENESTE robot i hele data/robots/ helt UDEN
     billede-blok (maalt: `grep -rL "^billede:" data/robots/*.yaml` giver 1
     linje), og er derfor den naturlige, ægte "tom celle"-robot. */
  const dist = path.join(tmp, 'dist-fotofod');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${dist}`],
    { cwd: rod, encoding: 'utf8' });
  if (b.status !== 0) {
    throw new Error(`fotofod: byg fejlede (exit ${b.status}) - ${(b.stderr || '').trim()}`);
  }

  const sideHTML = fs.readFileSync(path.join(dist, 'da', 'sammenligning', 'index.html'), 'utf8');
  const slugs = ['addverb-trakr-20', 'anybotics-anymal', 'xiaomi-cyberdog-1'];
  const tabelHTML = kaldTabelHTMLMedValg(sideHTML, kilde, slugs);

  const navne = [...tabelHTML.matchAll(/<span class="specimen__navn">([^<]*)</g)].map((m) => m[1]);
  const bygCeller = [...tabelHTML.matchAll(/<td class="saml-fotofod__(?:hjoerne|celle)"[^>]*>([^<]*)<\/td>/g)]
    .map((m) => m[1]);

  ok('79.7: byg af hele kataloget (fixturen for Del B) giver exit 0',
    b.status === 0, (b.stderr || '').trim());

  ok('79.8: tre RIGTIGE robotter valgt via localStorage giver 3 <th scope="col">, i den valgte raekkefoelge',
    navne.length === 3, `navne=${JSON.stringify(navne)}`);

  ok('79.9: den BYGGEDE side har praecis 4 saml-fotofod-celler (1 tom + 3 robotter)',
    bygCeller.length === 4, `bygCeller=${JSON.stringify(bygCeller)}`);

  ok('79.10: Addverb og ANYbotics staar krediteret hver i sin egen kolonne, med RIGTIG hentedato fra YAML',
    bygCeller[1] === 'Addverb (Hentet 2026-08-26)' && bygCeller[2] === 'ANYbotics (Hentet 2026-08-19)',
    `bygCeller=${JSON.stringify(bygCeller)}`);

  ok('79.11: xiaomi-cyberdog-1 (INGEN billede-blok i YAML-filen) faar en TOM celle, ikke en opfundet kredit',
    bygCeller[3] === '', `celle for xiaomi-cyberdog-1="${bygCeller[3]}"`);

  ok('79.12: den faelles indledning staar UDEN FOR <table>, som sit eget <p>, uden per-robot-info',
    tabelHTML.includes('</table><p class="saml-fotoophav">Producentens eget billede.</p>'),
    `hale af tabelHTML: ${tabelHTML.slice(tabelHTML.indexOf('</table>'))}`);

  fs.rmSync(dist, { recursive: true, force: true });
}
