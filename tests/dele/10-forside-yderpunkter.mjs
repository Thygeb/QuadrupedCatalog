/**
 * tests/dele/10-forside-yderpunkter.mjs — forsidens udvalgsregel og dens
 * "yderpunkter"-sektion (spor/forside fund 2+7, spor/yderpunkt K5+K6).
 *
 * Udvalgsregel: 6 forskellige producenter, deterministisk raekkefoelge, og
 * bygget viser dem alle med samme (faelles) klasse - ingen lead/lille-opdeling.
 *
 * Yderpunkter: ingen graense-operator (<, <=, >, >=) kan baere et yderpunkt
 * (Aa-fund 26. aug 2026: "<= 100 kg" beviser ikke at en robot ER tungest, kun
 * at den ikke er tungere end 100), intet yderpunkt mangler et rigtigt
 * fotografi, og forklaringens tal foelger det faktiske antal viste kort.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const {
    rod, tmp, node, ok, skema, lasRobotter,
  } = ctx;

  console.log('\n11. Forsidens udvalgsregel (fund 2) og yderpunkter (fund 7) — spor/forside');
  {
    const forsideModul = await import(
      `file://${path.join(rod, 'tools', 'skabelon', 'forside.mjs').replace(/\\/g, '/')}`);

    // 3a + 3b: udvalgReglen() kaldes direkte paa det rigtige katalog - ingen fixture,
    // for hvis kataloget aendrer sig, skal testen maale DET rigtige katalog, ikke
    // et haardkodet snapshot af det. Samme skema.NAEVNER som build.mjs bruger (L30).
    const robotterNu = lasRobotter(path.join(rod, 'data', 'robots'));
    const udvalgOpts = { naevner: skema.NAEVNER, d4: false, antal: 6, minVaegtklasser: 3 };

    const valgt1 = forsideModul.udvalgReglen(robotterNu, udvalgOpts);
    const producenterIValgt = new Set(valgt1.map((rb) => rb.producent));
    ok('3a. udvalgReglen(): 6 forskellige producenter paa det nuvaerende katalog',
      producenterIValgt.size === 6,
      `fik ${producenterIValgt.size} producent(er): ${[...producenterIValgt].join(', ')}`);

    const valgt2 = forsideModul.udvalgReglen(robotterNu, udvalgOpts);
    ok('3b. udvalgReglen(): deterministisk - samme input to gange giver samme raekkefoelge',
      JSON.stringify(valgt1.map((rb) => rb.slug)) === JSON.stringify(valgt2.map((rb) => rb.slug)),
      `${valgt1.map((rb) => rb.slug).join(',')} vs ${valgt2.map((rb) => rb.slug).join(',')}`);

    // 3c: bygget, ikke bare skabelonens funktion - beviser at HTML'en, en laeser
    // faktisk moeder, har mistet lead/lille-opdelingen, ikke kun at koden gør.
    const ud7 = path.join(tmp, 'dist-forside-fund2');
    const b7 = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${ud7}`],
      { cwd: rod, encoding: 'utf8' });
    ok('build.mjs (spor/forside-testbyg) giver exit 0', b7.status === 0, (b7.stderr || '').trim());

    const forsideHTML = fs.readFileSync(path.join(ud7, 'da', 'index.html'), 'utf8');
    const ypFaelles = (forsideHTML.match(/<article class="yderpunkt">/g) || []).length;
    const harLead = forsideHTML.includes('yderpunkt--lead');
    const harLille = forsideHTML.includes('yderpunkt--lille');
    ok('3c. alle fire yderpunkter renderes med samme (faelles) klasse - ingen lead, ingen lille',
      ypFaelles === 4 && !harLead && !harLille,
      `yderpunkt-kort (faelles klasse): ${ypFaelles}, lead-forekomster: ${harLead}, lille-forekomster: ${harLille}`);
  }

  // K5a en graense-operator (<=, >=, <, >) kan ikke baere et yderpunkt (Aa-fund
  //     26. aug 2026: "<= 100 kg" beviser ikke at Qiuqiu SP1 er tungest, kun at
  //     den ikke er tungere end 100 - den kunne veje 40).
  // K5b sammen med K5a: intet yderpunkt mangler et rigtigt fotografi - en
  //     afskaaret maaleplade i det lille felt er ikke information.
  // K6  forklaringens tal (tf('yderpunkter_forklaring', {n})) foelger det
  //     faktiske antal viste kort paa den BYGGEDE forside, ikke et haardkodet
  //     "Fire" - og ingen af kortene viser en maaleplade (.billedled--maal).
  console.log('\n12. Yderpunkternes graense-operator- og fotokrav (spor/yderpunkt)');
  {
    const sideModul = await import(
      `file://${path.join(rod, 'tools', 'skabelon', 'side.mjs').replace(/\\/g, '/')}`);
    const robotterNu = lasRobotter(path.join(rod, 'data', 'robots'));
    const yp = sideModul.ekstremer(robotterNu);

    const GRAENSE_OPERATORER = new Set(['<', '<=', '>', '>=']);
    const medGraense = yp.filter((x) => GRAENSE_OPERATORER.has(x.post?.operator));
    ok('K5a: intet yderpunkt baeres af en graense-operator (<, <=, >, >=)',
      medGraense.length === 0,
      medGraense.map((x) => `${x.id}=${x.robot.slug} (${x.post.operator})`).join(', '));

    const udenFoto = yp.filter((x) => !sideModul.laesBillede(x.robot));
    ok('K5b: intet yderpunkt mangler et rigtigt fotografi (laesBillede() !== null)',
      udenFoto.length === 0,
      udenFoto.map((x) => `${x.id}=${x.robot.slug}`).join(', '));

    // K5c: SYNTETISK fixture, ikke det rigtige katalog. Paa dagens 77 datafiler
    // aendrer fotokravet 0 yderpunkter (alle vindere har allerede et foto af
    // andre grunde), saa K5b alene ville forblive groen, selv hvis fotokravet
    // blev fjernet fra ekstremer() - den maaler kun DAGENS tilfaeldighed, ikke
    // REGLEN. Denne fixture tvinger en robot uden foto til at vaere den letteste
    // paa et rent tal, og beviser at den IKKE vindes vaek fra fotobaerende R2.
    const fiksturFotokrav = [
      { slug: 'uden-foto-letst', navn: 'Uden foto', felter: { egenvaegt: { vaerdi: 1, enhed: 'kg' } } },
      { slug: 'med-foto-naestletst', navn: 'Med foto', felter: { egenvaegt: { vaerdi: 2, enhed: 'kg' } },
        billede: { fil: 'test.jpg' } },
    ];
    const ypFikstur = sideModul.ekstremer(fiksturFotokrav);
    const letsteFikstur = ypFikstur.find((x) => x.id === 'letteste');
    ok('K5c (syntetisk): en robot uden foto vinder IKKE et yderpunkt, selv med det mest ekstreme tal',
      !!letsteFikstur && letsteFikstur.robot.slug === 'med-foto-naestletst',
      letsteFikstur ? `valgte ${letsteFikstur.robot.slug}` : 'intet letteste-yderpunkt fundet');

    const udY = path.join(tmp, 'dist-yderpunkt');
    const bY = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${udY}`],
      { cwd: rod, encoding: 'utf8' });
    ok('K6: build.mjs (spor/yderpunkt-testbyg) giver exit 0', bY.status === 0, (bY.stderr || '').trim());

    const forsideHTML = fs.readFileSync(path.join(udY, 'da', 'index.html'), 'utf8');
    const sektionMatch = forsideHTML.match(
      /<div class="yderpunkter">([\s\S]*?)\n<\/div>\n<p class="t-lille sektion-note">([\s\S]*?)<\/p>/);
    ok('K6: yderpunktsektionen findes paa den byggede forside', !!sektionMatch);

    if (sektionMatch) {
      const [, sektion, forklaring] = sektionMatch;
      const antalKort = (sektion.match(/<article class="yderpunkt">/g) || []).length;
      const talIForklaring = forklaring.match(/^(\d+)/);
      ok('K6b: forklaringens tal foelger det faktiske antal viste yderpunkt-kort',
        !!talIForklaring && Number(talIForklaring[1]) === antalKort,
        `forklaring siger "${talIForklaring ? talIForklaring[1] : '?'}", gitteret viser ${antalKort} kort`);

      const antalMaal = (sektion.match(/billedled--maal/g) || []).length;
      ok('K6c: intet yderpunkt viser en maaleplade (0 forekomster af billedled--maal)',
        antalMaal === 0, `${antalMaal} forekomster`);
    }
  }
}
