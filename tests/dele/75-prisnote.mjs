/**
 * tests/dele/75-prisnote.mjs — spor/prisnote, 3. sep 2026 (BRIEF-prisnote.md).
 *
 * ECB-prisnoten er flyttet fra katalogsiden (filter_pris_note/sortering_pris_note)
 * til robotsiden (feltnote--pris ved prisraekken), Å150 punkt 2. Fire paastande,
 * begge veje af flytningen plus ét vaern mod den fælde, briefet selv navngav:
 *
 *   1. Noten staar PAA robotsiden, begge sprog.
 *   2. Noten staar IKKE PAA katalogsiden, begge sprog.
 *   3. Noten staar paa PRAECIS de robotsider, der faktisk har en oplyst pris
 *      (11, JPKs raad fulgt - ogsaa de fire, der allerede staar i USD, baerer
 *      noten) - og paa NUL prisloese sider.
 *   4. Nyttelastnoten staar STADIG paa katalogsiden: katalog.mjs' noteNoegle-
 *      maskineri er GENERISK og deles med prisen. Denne paastand er den
 *      eneste, der fanger, om mekanismen blev revet ud sammen med prisens
 *      egne nøgler - briefets egen advarsel.
 *
 * REVERT-BEVIS (CLAUDE.md's krav): hver strukturel paastand proeves ogsaa mod
 * en bevidst FORKERT/syntetisk streng, og proeven skal svare forkert dér.
 *
 * Bygger sit EGET dist i sin egen undermappe af ctx.tmp, jf. tests/LAESMIG.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const {
    rod, tmp, node, ok,
  } = ctx;

  console.log('\n75. spor/prisnote: ECB-prisnoten flyttet fra katalogsiden til robotsiden (BRIEF-prisnote.md)');

  const ud = path.join(tmp, 'dist-prisnote');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${ud}`],
    { cwd: rod, encoding: 'utf8' });
  ok('75.0: build.mjs giver exit 0 (frisk byg til midlertidig mappe)',
    b.status === 0, (b.stderr || '').trim().split('\n').slice(-3).join(' / '));
  if (b.status !== 0) return;

  const laes = (rel) => fs.readFileSync(path.join(ud, rel), 'utf8');
  // Samme robot som tests/dele/62-uifix.mjs' 62.2.c/d og 45-skala-og-kurs.mjs'
  // 45.8/45.10 allerede bruger: en af de 11 med oplyst pris (og en af de 7
  // med fremmed kildevaluta, saa den faktisk omregnes).
  const ROBOT = 'yufan-lingmao-cyvet';

  /* ========================================================================
     1. Noten staar PAA robotsiden, begge sprog
     ==================================================================== */
  for (const sprog of ['da', 'en']) {
    const noteStreng = sprog === 'da' ? 'referencekurs' : 'reference rate';
    const html = laes(path.join(sprog, 'robotter', ROBOT, 'index.html'));
    ok(`75.1.${sprog}: prisnoten ("${noteStreng}") staar paa robotsiden (${ROBOT})`,
      html.includes(noteStreng), `fandt ikke "${noteStreng}"`);
  }
  // REVERT-BEVIS: en syntetisk streng UDEN noten ville fejle tjekket ovenfor.
  ok('75.1.revert: en syntetisk streng uden noten fanges',
    !''.includes('referencekurs'));

  /* ========================================================================
     2. Noten staar IKKE PAA katalogsiden, begge sprog
     ==================================================================== */
  for (const sprog of ['da', 'en']) {
    const noteStreng = sprog === 'da' ? 'referencekurs' : 'reference rate';
    const html = laes(path.join(sprog, 'index.html'));
    ok(`75.2.${sprog}: prisnoten ("${noteStreng}") staar IKKE paa katalogsiden`,
      !html.includes(noteStreng), `fandt "${noteStreng}" paa katalogsiden`);
  }
  // REVERT-BEVIS: en syntetisk streng MED noten ville fejle "IKKE"-tjekket.
  ok('75.2.revert: en syntetisk streng med noten fanges',
    !(!'x referencekurs y'.includes('referencekurs')));

  /* ========================================================================
     3. Noten staar paa PRAECIS de prisbaerende robotsider (11), og paa 0
     prisloese. "Prisbaerende" udledes af den samme stribe, siden selv
     tegner: enten mangler <li> for i-pris helt (stribe--intet, alle seks
     nøgletal uoplyst - 5 robotter), eller cellen har class="hul".
     ==================================================================== */
  const robotDirs = fs.readdirSync(path.join(ud, 'da', 'robotter'))
    .filter((f) => fs.statSync(path.join(ud, 'da', 'robotter', f)).isDirectory());

  const prisbaerendeMedNote = [];
  const prisloeseMedNote = [];
  let prisbaerendeTotal = 0;
  for (const slug of robotDirs) {
    const html = fs.readFileSync(path.join(ud, 'da', 'robotter', slug, 'index.html'), 'utf8');
    const li = html.match(/<li([^>]*)><svg class="ikon" aria-hidden="true"><use href="#i-pris"\/>/);
    const prisbaerende = !!li && !/class="hul"/.test(li[1]);
    const harNote = html.includes('referencekurs');
    if (prisbaerende) {
      prisbaerendeTotal++;
      if (harNote) prisbaerendeMedNote.push(slug);
    } else if (harNote) prisloeseMedNote.push(slug);
  }
  ok(`75.3.a: der er noget at maale paa (${robotDirs.length} robotsider fundet)`,
    robotDirs.length > 0);
  ok(`75.3.b: noten staar paa PRAECIS de ${prisbaerendeTotal} prisbaerende robotsider`,
    prisbaerendeMedNote.length === prisbaerendeTotal,
    `${prisbaerendeMedNote.length} af ${prisbaerendeTotal}: ${prisbaerendeMedNote.join(', ')}`);
  ok('75.3.c: noten staar paa 0 prisloese robotsider (laekker ikke)',
    prisloeseMedNote.length === 0, `fandt ${prisloeseMedNote.length}: ${prisloeseMedNote.join(', ')}`);
  // REVERT-BEVIS: samme taelling ville fange en syntetisk liste, hvor en
  // prisloes side FEJLAGTIGT baerer noten (listen ville ikke vaere tom).
  ok('75.3.c.revert: en ikke-tom prisloes-med-note-liste ville fejle 75.3.c',
    !(['en-syntetisk-prisloes-side'].length === 0));

  /* ========================================================================
     4. Nyttelastnoten staar STADIG paa katalogsiden - vaernet mod at
     katalog.mjs' delte noteNoegle-mekanisme blev revet ud sammen med
     PRISENS egne nøgler (den ene maade, punkt 2 kunne gaa galt, jf. briefet).
     ==================================================================== */
  const katalogDa = laes(path.join('da', 'index.html'));
  ok('75.4.a: filter_nyttelast_note staar stadig i katalog.mjs',
    fs.readFileSync(path.join(rod, 'tools', 'skabelon', 'katalog.mjs'), 'utf8')
      .includes('filter_nyttelast_note'));
  ok('75.4.b: nyttelastnotens tekst ("bærer 0 kg") staar paa katalogsiden',
    katalogDa.includes('bærer 0 kg'), 'nyttelastnoten er enten vaek eller aendret');
  // REVERT-BEVIS: skala__note skal staa PRAECIS 1 gang (kun nyttelast) -
  // 2 ville betyde prisens tomme note ikke blev udeladt korrekt (punkt 2),
  // 0 ville betyde nyttelastens note ogsaa forsvandt (denne fælde).
  const skalaNoteAntal = (katalogDa.match(/skala__note/g) || []).length;
  ok(`75.4.c: PRAECIS ét skala__note-element paa katalogsiden (fandt ${skalaNoteAntal})`,
    skalaNoteAntal === 1);
}
