/**
 * tests/dele/74-rammebeskaering.mjs — spor/ramme, 3. sep 2026 (BRIEF-ramme.md).
 *
 * L78: et produktfoto beskaeres ALDRIG. Maalt af orkestratoren 3. sep: 32 af
 * 85 kortfotos i kataloget var beskaaret lodret i hvile (op til 49,1 %),
 * fordi `<picture>` ingen egen hoejde havde - `.billedled img{height:100%}`
 * (system.css) regnede mod intet.
 *
 * To rettelser blev proevet og maalt levende med isoleret Playwright
 * (fund/FUND-ramme.md):
 *   A) `.net .billedled picture{display:block;width:100%;height:100%}` -
 *      samme form som .billedled--stor og .saml-fotofelt allerede bruger.
 *      MAALT AT FEJLE HER: stadig 32/85 beskaaret efter en frisk byg og
 *      frisk sideindlaesning. `.net` er en CSS-grid med flere raekker af
 *      varierende hoejde, og med `place-items:center` (align-items !=
 *      stretch) resolver Chromium ikke et procent-hoejde-barn til raekkens
 *      stoerrelse i denne opstilling - reproduceret ogsaa med inline
 *      !important.
 *   B) `position:relative` paa `.billedled` + `position:absolute;inset:0`
 *      paa `picture` - omgaar grid-raekkens definithed helt, fordi inset:0
 *      regner mod .billedled's PADDING-BOX. MAALT AT VIRKE: 0/85 beskaaret
 *      ved 1440 og 390 px, kort- og sidehoejde uaendret (identiske tal
 *      foer/efter via git stash-sammenligning).
 *
 * Dette er det STATISKE, genkoerbare vaern: at B-reglen findes i den byggede
 * CSS, og at den forkastede A-formulering (uden position:absolute) IKKE er
 * det, der staar der.
 *
 * REVERT-BEVIS (CLAUDE.md's krav): hvert moenster proeves ogsaa mod en
 * bevidst forkert streng, og proeven skal svare forkert dér.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { rens } from '../rens-css.mjs';

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n74. spor/ramme: L78 - katalogets billedramme beskaerer ikke laengere (BRIEF-ramme.md)');

  const ud = path.join(tmp, 'dist-rammebeskaering');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${ud}`],
    { cwd: rod, encoding: 'utf8' });
  ok('74.0: build.mjs giver exit 0 (frisk byg til midlertidig mappe)',
    b.status === 0, (b.stderr || '').trim().split('\n').slice(-3).join(' / '));
  if (b.status !== 0) return;

  const css = fs.readFileSync(path.join(ud, 'generator.css'), 'utf8');
  // Rens FILEN, ikke moenstret (tests/rens-css.mjs) - saa 74.1/74.2 er
  // uafhaengige af, om generator.css staar kompakt eller formateret
  // (BRIEF-prodtest.md). Moenstrene herunder er skrevet MOD den rensede
  // streng og har derfor ingen mellemrum, hverken i efterkommer-kombinatorer
  // (".net .billedled" -> ".net.billedled") eller foer "{".
  const cssR = rens(css);

  // Den valgte regel (B): picture er absolut positioneret inde i en
  // position:relative .billedled, uden at regne paa en grid-raekkes hoejde.
  const billedledPosRel = /\.net\.billedled\{[^}]*position:relative/;
  ok('74.1: .net .billedled har position:relative (bliver .picture-s positioneringskontekst)',
    billedledPosRel.test(cssR));
  ok('74.1.revert: samme moenster fanger IKKE en .billedled-regel uden position:relative',
    !billedledPosRel.test(rens('.net .billedled{background:red;display:grid}')));

  const pictureAbsolut = /\.net\.billedledpicture\{display:block;position:absolute;inset:0\}/;
  ok('74.2: .net .billedled picture er display:block;position:absolute;inset:0',
    pictureAbsolut.test(cssR));
  ok('74.2.revert: samme moenster fanger IKKE den forkastede A-formulering (width/height:100% i stedet)',
    !pictureAbsolut.test(rens('.net .billedled picture{display:block;width:100%;height:100%}')));

  // object-fit:contain er L78's egen ordlyd og maa ikke vaere rort - staar i
  // system.css, som dette spor ikke ejer, men den bygges rate CSS bekraefter
  // at reglen stadig findes levende (ikke kun i en kommentar).
  const sysCss = fs.readFileSync(path.join(ud, 'system.css'), 'utf8');
  const containRegel = /\.billedled img\{width:100%;height:100%;object-fit:contain/;
  ok('74.3: .billedled img har stadig object-fit:contain (uroert, L78s egen ordlyd)',
    containRegel.test(sysCss));
  ok('74.3.revert: samme moenster fanger IKKE en img-regel uden object-fit:contain',
    !containRegel.test('.billedled img{width:100%;height:100%;object-fit:cover}'));
}
