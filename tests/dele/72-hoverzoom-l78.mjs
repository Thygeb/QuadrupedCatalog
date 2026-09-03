/**
 * tests/dele/72-hoverzoom-l78.mjs — spor/zoom, 3. sep 2026 (BRIEF-zoom.md).
 *
 * L78 (2. sep 2026): et produktfoto beskaeres ALDRIG. Kortets hover-zoom
 * (`.kort:hover .billedled img{transform:scale(1.024)}` og en 1.04-variant
 * paa `.billedled--plade img`) blev bygget 26. aug 2026, foer L78, og
 * skalerede fotografiet ind i sin egen ramme, som har 0 % breddeslaek under
 * object-fit:contain — det beskar VANDRET med det samme.
 *
 * spor/zoom maalte to erstatninger (rammeskala/kortskala og en lodret
 * translateY inden for slaekket) og fravalgte begge — se fund/FUND-zoom.md
 * for de levende Playwright-maalinger (crop-% foer/efter, ramme- vs.
 * kortmaal). Denne del er det STATISKE, genkoerbare vaern: at reglerne, der
 * forårsagede beskaeringen, ikke kommer tilbage i CSS'en, og at kortet
 * stadig har ET arbejdende hover-/fokussignal (border-color).
 *
 * REVERT-BEVIS (CLAUDE.md's krav): hver paastand proeves ogsaa mod en
 * bevidst GAMMEL/forkert streng, og proeven skal svare forkert dér.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n72. spor/zoom: L78 - kortets hover-zoom beskaerer ikke laengere (BRIEF-zoom.md)');

  const ud = path.join(tmp, 'dist-hoverzoom-l78');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${ud}`],
    { cwd: rod, encoding: 'utf8' });
  ok('72.0: build.mjs giver exit 0 (frisk byg til midlertidig mappe)',
    b.status === 0, (b.stderr || '').trim().split('\n').slice(-3).join(' / '));
  if (b.status !== 0) return;

  const css = fs.readFileSync(path.join(ud, 'system.css'), 'utf8');

  // De to konkrete regler, der beskar vandret, som LIVE CSS-regler (ikke i en
  // kommentar - deraf kravet om '{' lige efter selektoren).
  const fotoRegel = /\.kort:hover \.billedled img,\.kort:focus-within \.billedled img\{transform:scale\(/;
  const pladeRegel = /\.kort:hover \.billedled--plade img,\.kort:focus-within \.billedled--plade img\{transform:scale\(/;

  ok('72.1: den byggede system.css indeholder IKKE laengere fotografiets scale()-regel (.billedled img)',
    !fotoRegel.test(css));
  ok('72.1.revert: samme moenster FANGER en syntetisk streng med reglen',
    fotoRegel.test('x .kort:hover .billedled img,.kort:focus-within .billedled img{transform:scale(1.024)} y'));

  ok('72.2: den byggede system.css indeholder IKKE laengere pladefotografiets scale()-regel (.billedled--plade img)',
    !pladeRegel.test(css));
  ok('72.2.revert: samme moenster FANGER en syntetisk streng med reglen',
    pladeRegel.test('x .kort:hover .billedled--plade img,.kort:focus-within .billedled--plade img{transform:scale(1.04)} y'));

  // Regressionsvaern: kortet skal STADIG have et virkende hover-/fokussignal
  // (border-color), saa "beskaering fjernet" ikke stille blev til "intet
  // svarer paa hover" - maalt levende i fund/FUND-zoom.md at baggrundsfarven
  // i .net-gitteret ogsaa stadig skifter paa hover.
  const hoverSignal = /\.kort:hover,\.kort:focus-within\{border-color:/;
  ok('72.3: kortet har stadig et border-color hover-/fokussignal (regressionsvaern - ikke fjernet ved en fejl)',
    hoverSignal.test(css));
  ok('72.3.revert: samme moenster fanger IKKE en streng uden reglen',
    !hoverSignal.test('.kort:hover,.kort:focus-within{color:red}'));
}
