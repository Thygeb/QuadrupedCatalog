/**
 * tests/dele/26-forbehold-klasse.mjs — L48/D14, spor/d14data punkt 4.
 *
 * Beviser tre ting om "advarsel_klasse:", den nye maskinlaesbare klasse paa
 * et forbehold ("advarsel:"), sat af dette spor i data/robots/*.yaml efter
 * fund/FUND-d14-klassifikation.md:
 *
 *   1. Optaellingen 259 gyldighed / 303 uddybning (562 i alt) holder i det
 *      RIGTIGE datasaet, ikke kun i et fixture.
 *   2. tools/validate.mjs's nye R20-regel fejler paa en ugyldig klasse OG paa
 *      en klasse uden noget "advarsel" at klassificere — og PASSERER de
 *      gyldige former (klassificeret, uklassificeret, ingen advarsel overhovedet).
 *   3. Én navngiven robot og ét navngivet felt, efterproevet mod
 *      fund/FUND-d14-klassifikation.md's egen tekst, baerer den rigtige klasse:
 *      unitree-b2 / egenvaegt = "gyldighed" ("MED batteri mens AlienGo er
 *      UDEN - eksplicit sammenligningsproblem (familie 3)").
 */
import fs from 'node:fs';
import path from 'node:path';

const HOVED = `slug: NAVN
navn: Proeve
producent: Proeveproducent
producentland: Kina
status: i_produktion
felter:
`;

export default async function koer(ctx) {
  const { rod, tmp, ok, lasRobotter, koerValidator } = ctx;

  console.log('1. Optaelling: 259 gyldighed / 303 uddybning / 562 i alt over data/robots/*.yaml');
  {
    const robotter = lasRobotter(path.join(rod, 'data', 'robots'));
    let gyldighed = 0, uddybning = 0, andet = 0;
    for (const r of robotter) {
      for (const post of Object.values(r.felter || {})) {
        if (post === null || typeof post !== 'object') continue;
        const k = post.advarsel_klasse;
        if (k === undefined) continue;
        if (k === 'gyldighed') gyldighed++;
        else if (k === 'uddybning') uddybning++;
        else andet++;
      }
    }
    ok('77 robotfiler laest', robotter.length === 77, `fik ${robotter.length}`);
    ok('259 forbehold maerket "gyldighed"', gyldighed === 259, `fik ${gyldighed}`);
    ok('303 forbehold maerket "uddybning"', uddybning === 303, `fik ${uddybning}`);
    ok('562 i alt, ingen ugyldig vaerdi i det rigtige datasaet', gyldighed + uddybning === 562 && andet === 0,
      `gyldighed+uddybning=${gyldighed + uddybning}, andet=${andet}`);
  }

  console.log('\n2. R20 — validatorreglen fejler paa de ugyldige former, passerer de gyldige');
  {
    const FELTBLOK_MED_ADVARSEL =
      `  egenvaegt:\n    vaerdi: 60\n    enhed: kg\n    kilde: https://example.com/a\n` +
      `    hentet: 2026-08-19\n    advarsel: "test-forbehold, ikke en rigtig klassifikation"\n`;

    const ITUSLAAEDE = [
      ['ugyldig klasse (hverken gyldighed eller uddybning)',
        FELTBLOK_MED_ADVARSEL + `    advarsel_klasse: "vigtigt"\n`],
      ['klasse uden noget "advarsel" at klassificere',
        `  egenvaegt:\n    vaerdi: 60\n    enhed: kg\n    kilde: https://example.com/a\n` +
        `    hentet: 2026-08-19\n    advarsel_klasse: "gyldighed"\n`],
      ['klassen er et tal, ikke en af de to tekster',
        FELTBLOK_MED_ADVARSEL + `    advarsel_klasse: 1\n`],
    ];
    ITUSLAAEDE.forEach(([navn, felter], i) => {
      const fil = path.join(tmp, `r20-sag-${i}.yaml`);
      fs.writeFileSync(fil, HOVED.replace('NAVN', `r20-sag-${i}`) + felter, 'utf8');
      const r = koerValidator([fil]);
      const fejledeSomVentet = r.kode === 1 && /\bR20:/.test(r.ud);
      ok(`${navn}  ->  R20`, fejledeSomVentet, r.kode !== 1 ? `exit ${r.kode}, forventede 1` : `ingen R20 i udskriften`);
    });

    const GYLDIGE = [
      ['forbehold MED gyldig klasse "gyldighed"', FELTBLOK_MED_ADVARSEL + `    advarsel_klasse: "gyldighed"\n`],
      ['forbehold MED gyldig klasse "uddybning"', FELTBLOK_MED_ADVARSEL + `    advarsel_klasse: "uddybning"\n`],
      ['forbehold UDEN klasse (endnu ikke klassificeret — lovligt, jf. orkestratorens rettelse 28. aug 2026)',
        FELTBLOK_MED_ADVARSEL],
      ['felt uden noget forbehold overhovedet, og uden advarsel_klasse',
        `  egenvaegt:\n    vaerdi: 60\n    enhed: kg\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
    ];
    GYLDIGE.forEach(([navn, felter], i) => {
      const fil = path.join(tmp, `r20-gyldig-${i}.yaml`);
      fs.writeFileSync(fil, HOVED.replace('NAVN', `r20-gyldig-${i}`) + felter, 'utf8');
      const r = koerValidator([fil]);
      ok(navn, r.kode === 0, r.ud.trim().split('\n').filter((l) => l.startsWith('FEJL')).join(' / '));
    });
  }

  console.log('\n3. Navngivet stikproeve mod fund/FUND-d14-klassifikation.md');
  {
    // Doemt i fund/FUND-d14-klassifikation.md, raekken "unitree-b2 | egenvaegt
    // | gyldighed | MED batteri mens AlienGo er UDEN - eksplicit
    // sammenligningsproblem (familie 3)" — efterproevet mod selve dokumentet,
    // ikke gaettet her.
    const b2 = fs.readFileSync(path.join(rod, 'data', 'robots', 'unitree-b2.yaml'), 'utf8');
    const linjer = b2.split(/\r?\n/);
    // Find "  egenvaegt:" og led fremad til naeste feltnavn eller filens
    // slutning — uafhaengig af praecis linjeafstand inde i blokken.
    const startI = linjer.indexOf('  egenvaegt:');
    let slutI = linjer.length;
    for (let i = startI + 1; i < linjer.length; i++) {
      if (/^  [a-z_0-9]+:/.test(linjer[i])) { slutI = i; break; }
    }
    const blok = linjer.slice(startI, slutI).join('\n');
    ok('unitree-b2.yaml har en egenvaegt-blok', startI !== -1);
    ok('unitree-b2 / egenvaegt baerer advarsel_klasse: "gyldighed" (FUND-doc: familie 3, MED/UDEN batteri)',
      /advarsel_klasse: "gyldighed"/.test(blok), blok);
  }

  return {};
}
