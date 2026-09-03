/**
 * tests/dele/12-enheder.mjs — spor/enheder: kanonisk visningsenhed (K9) og
 * klaebende tabelhoved (K10).
 *
 * Punkt 1 (K9): ni felter blandede mm/cm/m, m/s/km-h, t/min, CNY/USD/EUR i
 * samme kolonne. skema.mjs' visningsPost()/normaliserVisningsEnheder() omsaetter
 * 7 af dem til ÉN kanonisk visningsenhed - KUN i build.mjs's i-hukommelse-kopi,
 * aldrig i datafilerne selv. `pris` og `haeldning` er bevidste undtagelser
 * (CLAUDE.md-briefets regel 1b/1c). Punkt 2 (K10): sammenligningstabellens
 * kolonnehoved (.specimen-hoved) er klaebende fra 901 px, saa robotnavnene
 * ikke ruller ud af billedet foer sidste raekke ("CE oplyst").
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { rens } from '../rens-css.mjs';

export default async function koer(ctx) {
  const {
    rod, tmp, node, ok, skema, yaml,
  } = ctx;

  console.log('\n13. spor/enheder: kanonisk visningsenhed (K9) og klaebende tabelhoved (K10)');

  // --- K9a/K9b: visningsPost() paa isolerede poster - beviser SELVE
  // omregningen, uafhaengigt af om build.mjs husker at kalde den. ---
  const spotLaengde = { vaerdi: 1100, enhed: 'mm', kilde: 'https://x/', hentet: '2026-01-01' };
  const spotVist = skema.visningsPost('laengde', spotLaengde);
  ok('K9a: visningsPost normaliserer Spots laengde 1100 mm -> 110 cm og bevarer kilden',
    spotVist.vaerdi === 110 && spotVist.enhed === 'cm' && spotVist.kilde === spotLaengde.kilde
    && spotVist._kildeform === '1100 mm',
    JSON.stringify(spotVist));

  const go2Laengde = { vaerdi: 70, enhed: 'cm', kilde: 'https://x/' };
  const go2Vist = skema.visningsPost('laengde', go2Laengde);
  ok('K9a: visningsPost roerer IKKE Go2s laengde 70 cm (allerede kanonisk) - samme reference',
    go2Vist === go2Laengde && go2Vist._kildeform === undefined,
    JSON.stringify(go2Vist));

  const driftT = { vaerdi: 1.5, enhed: 't', kilde: 'https://x/' };
  const driftVist = skema.visningsPost('driftstid', driftT);
  ok('K9a: visningsPost omsaetter driftstid 1,5 t -> 90 min (mindretallets enhed, se skema.mjs)',
    driftVist.vaerdi === 90 && driftVist.enhed === 'min', JSON.stringify(driftVist));

  const prisPost = { vaerdi: 100, enhed: 'USD', kilde: 'https://x/' };
  ok('K9b: `pris` staar UDEN for KANONISK_VISNINGSENHED - visningsPost roerer den ikke',
    skema.visningsPost('pris', prisPost) === prisPost && !('pris' in skema.KANONISK_VISNINGSENHED));

  const haeldningPct = { vaerdi: 45, enhed: '%', kilde: 'https://x/' };
  ok('K9b (dokumenteret 1c-undtagelse): `haeldning` staar OGSAA uden for kortet - % roeres ikke',
    skema.visningsPost('haeldning', haeldningPct) === haeldningPct
    && !('haeldning' in skema.KANONISK_VISNINGSENHED));

  // --- K9c: datafilerne paa disk er urørte - laest FRISK, ikke via bygget. ---
  const spotRaa = skema.normaliserRobot(yaml.parseYaml(
    fs.readFileSync(path.join(rod, 'data', 'robots', 'boston-dynamics-spot.yaml'), 'utf8'),
    'boston-dynamics-spot.yaml'));
  ok('K9c: data/robots/boston-dynamics-spot.yaml har STADIG laengde: 1100 mm paa disk',
    spotRaa.felter.laengde.vaerdi === 1100 && spotRaa.felter.laengde.enhed === 'mm',
    JSON.stringify(spotRaa.felter.laengde));

  // --- K9a (helhed) + K9b (helhed): et rigtigt byg af HELE kataloget - beviser
  // at build.mjs faktisk KALDER normaliseringen, ikke kun at funktionen findes. ---
  const udK9 = path.join(tmp, 'dist-enheder');
  const bK9 = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${udK9}`],
    { cwd: rod, encoding: 'utf8' });
  ok('spor/enheder: byg af hele kataloget giver exit 0', bK9.status === 0, (bK9.stderr || '').trim());

  const robotsJson = JSON.parse(fs.readFileSync(path.join(udK9, 'robots.json'), 'utf8'));
  const KANDIDATER = ['laengde', 'bredde', 'hoejde', 'forhindring_enkelt',
    'hastighed', 'driftstid', 'ladetid'];
  const enhederPrFelt = {};
  for (const navn of KANDIDATER) enhederPrFelt[navn] = new Set();
  const prisEnheder = new Set();
  for (const rb of robotsJson.robotter) {
    for (const navn of KANDIDATER) {
      const v = rb.alle_felter?.[navn];
      if (v && v.tilstand === 'tal' && v.enhed) enhederPrFelt[navn].add(v.enhed);
    }
    const p = rb.alle_felter?.pris;
    if (p && p.tilstand === 'tal' && p.enhed) prisEnheder.add(p.enhed);
  }
  for (const navn of KANDIDATER) {
    ok(`K9a: "${navn}" viser PRAECIS én enhed paa tvaers af kataloget (bygget dist)`,
      enhederPrFelt[navn].size === 1, `fandt: ${[...enhederPrFelt[navn]].join(', ') || 'ingen'}`);
  }
  ok('K9b: `pris` viser STADIG flere valutaer (den bevidste undtagelse er ikke rullet ind i normaliseringen)',
    prisEnheder.size >= 2, `fandt: ${[...prisEnheder].join(', ')}`);

  // --- K10: klaebende kolonnehoved staar i den byggede CSS. ---
  //
  // VENDT 31. aug 2026 (spor/samlbyg). Kravet er UAENDRET - kolonnehovedet
  // skal klaebe, saa raekke 25 ikke laeses uden at vide, hvilken spalte der er
  // hvem. MEKANISMEN er en anden: foer laa `position:sticky` paa <thead>
  // (.specimen-hoved) selv, mens matricen var et CSS-grid ovenpaa
  // tabelelementerne. Compen (godkendt af JPK 31. aug) giver tabellen sin
  // rigtige display tilbage, og paa en NATIV tabel klaeber <thead> ikke -
  // sticky virker paa cellerne. Reglen sidder derfor nu paa
  // `.specimen-hoved th,.specimen-hoved td`.
  //
  // Assertionen er vendt om, ikke slettet: den beviser stadig, at hovedet
  // klaeber, blot paa det element der faktisk baerer det. Efterproevet i
  // browseren samme dag ved 1440x900: med raekke 21 rullet til midten
  // (scrollY 1734) maalte kolonnehovedets getBoundingClientRect().top = 0.
  // Var reglen faldet ud, ville tallet have vaeret ca. -1600.
  const builtCss = fs.readFileSync(path.join(udK9, 'generator.css'), 'utf8');
  // Rens FILEN, ikke moenstret (tests/rens-css.mjs, BRIEF-prodtest.md):
  // generator.css blev omformateret, og bl.a. et mellemrum foer "{" (og et
  // linjeskift i den grupperede selektor "th,\ntd {") knaekkede de gamle,
  // kompakte moenstre. builtCssR er den normaliserede udgave.
  const builtCssR = rens(builtCss);
  const paaCellerne = /\.specimen-hovedth,\.specimen-hovedtd\{[^}]*position:sticky[^}]*top:0/.test(builtCssR);
  const gammelPaaThead = /\.specimen-hoved\{[^}]*position:sticky[^}]*top:0/.test(builtCssR)
    || /@media[^{]*\{[^}]*\.specimen-hoved\{[^}]*position:sticky/.test(builtCssR);
  ok('K10: kolonnehovedet klaeber - position:sticky;top:0 paa jigraekkens celler i den byggede generator.css',
    paaCellerne || gammelPaaThead,
    `paa cellerne: ${paaCellerne}, paa <thead> (gammel form): ${gammelPaaThead}`);

  // Rullebeholderen maa IKKE selv vaere en lodret ruller paa brede skaerme.
  // Saetter man overflow-x:auto uden for et media query, tvinger browseren
  // overflow-y fra visible til auto, og saa klaeber hovedet til en kasse, der
  // ikke ruller lodret - altsaa aldrig. Compen maalte top:-938px paa netop den
  // fejl, MENS skaermbilledet saa helt rigtigt ud. Derfor et krav i CSS'en, og
  // ikke kun en kommentar.
  const rulleFri = /\.saml-rulle\{[^}]*overflow:visible/.test(builtCssR);
  const rulleKunISmal = /@media[^{]*max-width:820px[^{]*\{[^}]*\.saml-rulle\{[^}]*overflow-x:auto/.test(builtCssR);
  ok('K10b: .saml-rulle er overflow:visible som udgangspunkt og ruller kun under 820px',
    rulleFri && rulleKunISmal,
    `visible: ${rulleFri}, ruller kun i media query: ${rulleKunISmal}`);
}
