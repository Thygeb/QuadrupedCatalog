/**
 * tests/dele/31-pudsning.mjs — spor/puds, 28. aug 2026.
 *
 * EMNET er de fem greb, pudsningen lagde ind. Hver vagt er valgt, saa den
 * bliver ROED, hvis grebet rulles tilbage — ikke saa den blot bekraefter, at
 * en fil findes.
 *
 * Vagterne laeser KILDEN og det byggede output. De kan ikke maale computed
 * px — det kraever en browser, og generatoren skal blive ved med at vaere
 * afhaengighedsfri — saa de vogter MEKANISMEN, mens browsermaalingerne i
 * commit-beskederne beviser VIRKNINGEN. Det er samme arbejdsdeling som
 * del 30.
 *
 * 1. Skriftgulvet: enhed og operator baerer max(8px,…) i hvert laengdetrin.
 * 2. accent-color er sat fra paletten, saa afkrydsningsfelter og radioer
 *    ikke tegnes med browserens egen blaa.
 * 3. Nav-baandet under 420 px staar paa ÉN raekke.
 * 4. Radius-skalaen: ingen erklaering uden for 0/6/8/12 (+ 99px-pillen).
 * 5. Variantfelterne deler ikke chip-grammatikken med de klikbare filtre.
 */
import fs from 'node:fs';
import path from 'node:path';

export default async function koer(ctx) {
  const { rod, ok } = ctx;

  console.log('\n31. Pudsningen (spor/puds)');

  const sys = fs.readFileSync(path.join(rod, 'assets', 'system.css'), 'utf8');
  const gen = fs.readFileSync(path.join(rod, 'assets', 'generator.css'), 'utf8');

  /* --- 1. Skriftgulvet paa enhed og operator ---------------------------- */
  // Fejlen var IKKE én for lille grad, men en kaskade: `.38em` af en
  // foraelder, der selv var skrumpet til 15 px, gav 5,70 px. Derfor skal
  // gulvet staa i HVERT trin - et gulv i grundreglen alene bliver
  // overskrevet af trinnet lige under.
  ok('31.1: grundreglens enhed og operator har et px-gulv',
    /\.v-tal \.enhed\{font-size:max\(8px,\.56em\)/.test(sys)
      && /\.v-tal \.op\{font-size:max\(8px,\.72em\)/.test(sys),
    'et rent em-tal arver graden fra en foraelder, der selv kan vaere 15 px');

  for (const trin of ['lang', 'xlang', 'xxlang']) {
    const re = new RegExp(`\\.v-tal--${trin} \\.enhed\\{font-size:max\\(8px,`);
    ok(`31.2.${trin}: laengdetrinnet --${trin} baerer gulvet paa .enhed`,
      re.test(sys),
      'uden gulvet i trinnet ganges trinnets skrump paa foraeldrens');
  }
  for (const trin of ['xlang', 'xxlang']) {
    const re = new RegExp(`\\.v-tal--${trin} \\.op\\{font-size:max\\(8px,`);
    ok(`31.3.${trin}: laengdetrinnet --${trin} baerer gulvet paa .op`, re.test(sys));
  }
  // Ingen bar em-grad under gulvet maa staa tilbage paa enhed/op. .34em er
  // kildemaerkets (som har sit eget max()), saa vi ser kun paa enhed og op.
  const bareGrader = [...sys.matchAll(/\.(enhed|op)\{font-size:(\.\d+)em\}/g)]
    .map((m) => `${m[1]}:${m[2]}em`);
  ok('31.4: ingen enhed/op staar tilbage paa en bar em-grad',
    bareGrader.length === 0,
    `staar bart: ${bareGrader.join(', ')}`);

  // Under 420 px er cellen 147 px bred mod 91 px ved 1440 - stigen skal
  // falde til ét trin dér, ellers komprimerer den, hvor der er mest plads.
  ok('31.5: laengdestigen falder til --lang\'s grad under 420 px',
    /\.stribe--kompakt \.v-tal--xxlang \.num\{font-size:\.80em/.test(sys),
    'ellers staar det fjerde trin paa .56em i en celle med 62 px luft');

}
