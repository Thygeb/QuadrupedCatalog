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

  /* --- 2. accent-color -------------------------------------------------- */
  // Backlogpunktet paastod, at browseren tegner 110 felter i sin egen blaa.
  // MAALT: den tegner nul - alle 220 felter staar 1x1 px med opacity:0, og
  // chippen ER etiketten. Erklaeringen staar alligevel, saa den flade ikke
  // foerst opdages den dag, nogen tilfoejer en kontrol, der TEGNES.
  const accent = [...sys.matchAll(/accent-color:\s*([^;}]+)/g)].map((m) => m[1].trim());
  ok('31.6: accent-color er sat', accent.length >= 1,
    'ellers tegner browseren en fremtidig kontrol i en blaa, ingen har valgt');
  ok('31.7: accent-color kommer fra paletten, ikke fra en loes hex',
    accent.length > 0 && accent.every((v) => v.startsWith('var(--')),
    `fandt: ${accent.join(' | ')}`);
  // Vagten paa PRAEMISSEN: bliver et felt en dag SYNLIGT, skal nogen se
  // efter, om chip-grammatikken stadig holder. Skjulningen er selve grunden
  // til, at accent-color er insurance og ikke en synlig rettelse.
  ok('31.8: filterfelterne er stadig visuelt skjulte (chippen er etiketten)',
    /\.filtre input\{position:absolute;width:1px;height:1px;opacity:0\}/.test(sys),
    'holder den ikke, tegner browseren felterne, og accent-color bliver synlig');

  /* --- 3. Nav-baandet paa ÉN raekke ------------------------------------- */
  // Reglen staar UDEN FOR brudpunktet med vilje: braekket laa fra 320 px op
  // til ca. 500 px, ikke kun under 420.
  ok('31.9: nav-baandet er ét spor, ikke to raekker',
    /\.baand nav\{[^}]*flex-wrap:nowrap/.test(sys)
      && /\.baand nav\{[^}]*overflow-x:auto/.test(sys),
    'med flex-wrap:wrap braekker fem laenker over to 44 px-raekker');
  // De to ting, et rullespor koster, hvis ingen maaler dem. Begge er
  // tastaturfejl, ikke udseendefejl - og begge er usynlige paa et skud.
  ok('31.10: rullesporet har rullefyld, saa fokus afsloerer hele laenken',
    /\.baand nav\{[^}]*scroll-padding-inline:/.test(sys),
    'uden det bliver en delvist synlig laenke staaende - Blink ruller kun '
      + 'et element frem, der ligger HELT uden for rulleporten');
  ok('31.11: fokusringen tegnes inde i laenken, saa overflow ikke klipper den',
    /\.baand nav a:focus-visible\{outline-offset:-3px\}/.test(sys),
    'en overflow-boks klipper ogsaa ved 1440, hvor der intet er at rulle');
  ok('31.12: trykfladen er stadig 44 px',
    /\.baand nav a\{[^}]*min-height:44px/.test(sys),
    'én raekke maa ikke koebes for en mindre trykflade');

  /* --- 4. Radius-skalaen ------------------------------------------------ */
  // Skalaen er 0/6/8/12 (--rund-lille/--rund-ind/--rund) plus 99px-pillen,
  // som er "fuldt afrundet ende" og ikke et trin. Alt andet er drift: en
  // 3 px radius er hverken en kant eller et hjoerne, og den opstaar, fordi
  // nogen skoennede i stedet for at vaelge fra skalaen.
  const LOVLIG = new Set(['0', '0px', '6px', '8px', '12px', '99px', '50%']);
  const drift = [];
  for (const [fil, css] of [['system.css', sys], ['generator.css', gen]]) {
    for (const m of css.matchAll(/border-radius:([^;}]+)/g)) {
      for (const del of m[1].trim().split(/[\s/]+/)) {
        if (del.startsWith('var(') || del === 'inherit') continue;
        if (!LOVLIG.has(del)) drift.push(`${fil}: ${del}`);
      }
    }
  }
  ok('31.13: ingen radius uden for skalaen 0/6/8/12 (+ 99px-pillen)',
    drift.length === 0, `uden for skalaen: ${drift.join(', ')}`);
  // De to smaa kildemaerker skal blive ved med at vaere KLAMMER. Ved 6 px
  // moedes hjoernerne paa en 11 px hoej kasse og maerket bliver en prik.
  ok('31.14: begge sekundaere kildemaerker staar paa 0',
    /\.kildemaerke--sek\{[^}]*border-radius:0[;}]/.test(sys)
      && /\.kildeliste \.sek \.bogstav\{[^}]*border-radius:0[;}]/.test(sys),
    'ved 6 px bliver den 11 px hoeje kasse en prik, ikke et maerke');

  /* --- 5. Variantfelterne deler ikke chip-grammatikken ------------------ */
  // Chip-grammatikken er de TRE ting sammen: flade + ramme + radius. Faldt
  // én af dem vaek, ville en senere redigering kunne laegge den tilbage
  // uden at nogen opdagede det, saa vagten ser efter alle tre.
  const variantnavn = (gen.match(/\.variantnavn\{[^}]*\}/) || [''])[0];
  ok('31.15: .variantnavn fandtes stadig som regel', variantnavn !== '',
    'reglen er forsvundet - saa maaler de foelgende vagter ingenting');
  ok('31.16: variantnavnene har hverken flade, ramme eller radius',
    !/background:(?!none)/.test(variantnavn)
      && !/border:(?!0)/.test(variantnavn)
      && !/border-radius/.test(variantnavn),
    `flade+ramme+radius ER chip-grammatikken: ${variantnavn}`);
  ok('31.17: variantnavnene er sat som sidens vaerdier (mono, fuld blaek)',
    /font-family:var\(--mono\)/.test(variantnavn)
      && /color:var\(--blaek\)/.test(variantnavn),
    'oplysningen skal blive - det er kun formen, der skilles fra chippen');

  // Parboksen under striben maatte IKKE bare fjernes: den grupperer navn og
  // vaerdi. Den er skiftet til den mindste form, der stadig grupperer.
  const parboks = (gen.match(/\.varianter \.variant\{[^}]*\}/) || [''])[0];
  ok('31.18: variantparret grupperes af en 1 px tap, ikke af en chip',
    /border-left:1px solid/.test(parboks)
      && /background:none/.test(parboks)
      && /border-radius:0/.test(parboks),
    `staar stadig som chip: ${parboks}`);
}
