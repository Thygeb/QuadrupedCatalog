/**
 * tests/dele/13-billedramme.mjs — spor/billedramme: et billedes EGET
 * sideforhold afgoer --plade automatisk (K1), de foerste EAGER_KORT_ANTAL
 * katalogkort er eager og resten lazy (K4), og billednote-banneret (S1-aeraen)
 * er vaek fra alle sider.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const {
    rod, tmp, node, ok,
  } = ctx;

  console.log('\n13. spor/billedramme: sideforhold -> --plade automatisk, og eager/lazy paa kortene');

  const sideMod = await import(`file://${path.join(rod, 'tools', 'skabelon', 'side.mjs').replace(/\\/g, '/')}`);

  /** Minimal, GYLDIG PNG-header (signatur + IHDR med w/h) - ingen IDAT, fordi
   *  dimAfPNG() i side.mjs kun laeser byte 16-24 og aldrig afkoder billedet. */
  function lavPNG(w, h) {
    const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(w, 0);
    ihdr.writeUInt32BE(h, 4);
    ihdr[8] = 8; // bit depth
    const laengde = Buffer.alloc(4);
    laengde.writeUInt32BE(13, 0);
    const type = Buffer.from('IHDR', 'ascii');
    const crc = Buffer.alloc(4); // efterproeves ikke af dimAfPNG
    return Buffer.concat([sig, laengde, type, ihdr, crc]);
  }

  // --- K1 (3a/3b): filens EGET sideforhold afgoer --plade, ikke et huskefelt ---
  const dimRod = path.join(tmp, 'sideforhold-rod');
  fs.mkdirSync(path.join(dimRod, 'assets', 'fotos'), { recursive: true });
  fs.writeFileSync(path.join(dimRod, 'assets', 'fotos', 'skaev.png'), lavPNG(300, 900)); // ratio 0,33 - 79 % fra 1,6
  fs.writeFileSync(path.join(dimRod, 'assets', 'fotos', 'paesig.png'), lavPNG(320, 200)); // ratio 1,6 praecis - 0 %

  ok('3a: et billede langt fra 16:10 (300x900, ratio 0,33) faar --plade automatisk (billedAutoPlade)',
    sideMod.billedAutoPlade('fotos/skaev.png', dimRod) === true);
  ok('3b: et billede PRAECIS 16:10 (320x200) faar IKKE --plade — reglen skelner, saetter den ikke paa alt',
    sideMod.billedAutoPlade('fotos/paesig.png', dimRod) === false);

  // Samme skel igennem HELE kaeden: laesBillede() -> plade-feltet -> markup'et.
  const bSkaev = sideMod.laesBillede({ billede: { fil: 'fotos/skaev.png', ophav: 'fabrikant' } }, dimRod);
  const bPaesig = sideMod.laesBillede({ billede: { fil: 'fotos/paesig.png', ophav: 'fabrikant' } }, dimRod);
  ok('3a: laesBillede() saetter plade:true for det skaeve foto, uden noget plade-felt i YAML',
    bSkaev?.plade === true);
  ok('3b: laesBillede() saetter plade:false for det paesiddende foto',
    bPaesig?.plade === false);

  const tekst = { intet: '', grund: '', alt: 'x', delt: '', ophav: {} };
  ok('3a: billedledHTML() skriver billedled--plade for det skaeve foto',
    /class="billedled billedled--plade"/.test(sideMod.billedledHTML({ b: bSkaev, tekst })));
  ok('3b: billedledHTML() skriver IKKE billedled--plade for det paesiddende foto',
    !sideMod.billedledHTML({ b: bPaesig, tekst }).includes('billedled--plade'));

  // Eksplicit `plade: nej` skal vinde over maalingen, ogsaa naar filen rent
  // faktisk er skaev — et bevidst felt maa ikke overstyres af en maaling.
  const bSkaevMenNej = sideMod.laesBillede(
    { billede: { fil: 'fotos/skaev.png', ophav: 'fabrikant', plade: 'nej' } }, dimRod,
  );
  ok('eksplicit plade:nej i YAML vinder over den automatiske udledning',
    bSkaevMenNej?.plade === false);

  // --- K4 (3c): de foerste EAGER_KORT_ANTAL katalogkort er eager, resten lazy ---
  ok('billedledHTML(): eager:true skriver loading="eager"',
    /loading="eager"/.test(sideMod.billedledHTML({ b: bPaesig, eager: true, tekst })));
  ok('billedledHTML(): eager:false (standard) skriver loading="lazy"',
    /loading="lazy"/.test(sideMod.billedledHTML({ b: bPaesig, tekst })));
  ok('billedledHTML(): stor (robotsidens hero) vinder over eager - baerer aldrig et loading-attribut',
    !/loading=/.test(sideMod.billedledHTML({
      b: bPaesig, stor: true, eager: true, tekst,
    })));

  // Integrationstjek paa den RIGTIGE data/robots/: eager-taelleren i det
  // byggede katalog skal matche EAGER_KORT_ANTAL - ikke et haardkodet 4, saa
  // testen foelger med, hvis konstanten selv aendres.
  const eagerDist = path.join(tmp, 'dist-eager');
  const b5 = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${eagerDist}`],
    { cwd: rod, encoding: 'utf8' });
  ok('3c: byg af den rigtige data/robots/ giver exit 0', b5.status === 0,
    (b5.stderr || '').trim().split('\n').slice(-3).join(' / '));
  const katalogHTML = fs.readFileSync(path.join(eagerDist, 'da', 'robotter', 'index.html'), 'utf8');
  const eagerAntal = (katalogHTML.match(/loading="eager"/g) || []).length;
  const lazyAntal = (katalogHTML.match(/loading="lazy"/g) || []).length;
  const imgAntal = (katalogHTML.match(/<img /g) || []).length;
  ok(`3c: kataloget har praecis EAGER_KORT_ANTAL (${sideMod.EAGER_KORT_ANTAL}) kort med `
    + `loading="eager" (fandt ${eagerAntal})`,
    eagerAntal === sideMod.EAGER_KORT_ANTAL);
  ok(`3c: resten af billederne (${imgAntal} <img> i alt) er loading="lazy" (fandt ${lazyAntal})`,
    lazyAntal === imgAntal - eagerAntal && lazyAntal > 0);

  // --- Punkt 5: S1 er ophaevet (JPK, 26. aug 2026) - billednote-banneret er
  // fjernet fra ALLE sider, og forhandler-fodnoten (et andet krav, om
  // forhandlerforhold, ikke billedtilladelse) staar stadig. ---
  const forsideHTML = fs.readFileSync(path.join(eagerDist, 'da', 'index.html'), 'utf8');
  ok('5: billednote-banneret findes ikke laengere paa katalogsiden',
    !katalogHTML.includes('billednote'));
  ok('5: billednote-banneret findes ikke laengere paa forsiden',
    !forsideHTML.includes('billednote'));
  ok('5: teksten om manglende skriftlig tilladelse er vaek fra kataloget',
    !katalogHTML.includes('uden skriftlig tilladelse'));
  ok('5: sidefodens forhandler-fodnote staar stadig (produktkrav, ikke S1)',
    forsideHTML.includes('Vi er ikke forhandler'));
}
