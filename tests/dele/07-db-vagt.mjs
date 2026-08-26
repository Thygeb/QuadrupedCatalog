/**
 * tests/dele/07-db-vagt.mjs — de to rene vagt-/beslutningsfunktioner i
 * db/migrer.mjs (L35) og db/eksporter.mjs (L35-opfoelgning, punkt 1).
 *
 * Begge testes uden netvaerk og uden .env; erHoved-vagten i de to filer (og i
 * db/rundtur.mjs, som migrer.mjs selv importerer) sikrer, at ingen af dem
 * koerer deres main() bare fordi de bliver importeret her.
 */
export default async function koer(ctx) {
  const { rod, ok } = ctx;

  console.log('\n7. Vagten i db/migrer.mjs — ren sammenligningsfunktion (L35)');
  {
    const migrer = await import(`file://${rod.replace(/\\/g, '/')}/db/migrer.mjs`);

    /** Én minimal, men kanonisk-formet robot - samme noeglesaet som
     *  klassificerRobot()/omdanRobotFraDb() begge producerer. Funktionen kan
     *  ikke se forskel paa "kommer fra YAML" og "kommer fra DB'en" - begge
     *  sider er allerede paa denne form, naar sammenlignDbMedYaml() kaldes. */
    const grundrobot = () => ({
      slug: 'proeve-vagt', navn: 'Proeve', producent: 'X', producentland: 'Kina',
      producentby: 'Beijing', status: 'i_produktion', foerste_udgivelse: 2024,
      forgaenger: null, varianter: null, noter: null,
      felter: {
        egenvaegt: {
          form: 'tal', vaerdi_tal: 50, min: null, maks: null, enhed: 'kg',
          enhed_imperial: null, vaerdi_imperial: null, operator: null,
          kilde: 'https://example.com/a', hentet: '2026-08-19', kildetype: null,
          advarsel: null, note: null, raa: null, valuta: null,
        },
      },
      anvendelse: null, billede: null,
    });

    const ensAfvigelser = migrer.sammenlignDbMedYaml([grundrobot()], [grundrobot()]);
    ok('ens DB- og YAML-tilstand giver nul afvigelser',
      Array.isArray(ensAfvigelser) && ensAfvigelser.length === 0, JSON.stringify(ensAfvigelser));

    const dbMedEnAendring = grundrobot();
    dbMedEnAendring.producentby = 'VAGTTEST';
    const afvigelser = migrer.sammenlignDbMedYaml([dbMedEnAendring], [grundrobot()]);
    ok('én aendret vaerdi giver praecis én afvigelse, med rigtig slug og feltsti',
      afvigelser.length === 1 && afvigelser[0].slug === 'proeve-vagt' && afvigelser[0].sti === 'producentby'
      && afvigelser[0].db === 'VAGTTEST' && afvigelser[0].yaml === 'Beijing',
      JSON.stringify(afvigelser));

    // Å14: afgoerVagt() er selve beslutningen (naegt / naegt ikke), retter L35's
    // foerste udgave, som sammenlignede databasen mod YAML og derfor naegtede
    // lige saa haardt paa et agent-spors normale fremrykning som paa en
    // faktisk Studio-redigering. Ren funktion - samme betingelse som ovenfor
    // (intet fetch, intet filsystem), og fire scenarier daekker begge grene af
    // det, punktet skal skelne: aftryk-sammenligning naar der findes et aftryk,
    // fald-tilbage til YAML naar der ikke goer.
    const yamlMedNyRobot = [grundrobot(), { ...grundrobot(), slug: 'ny-fra-agent' }];

    const tomDb = migrer.afgoerVagt([], [grundrobot()], yamlMedNyRobot);
    ok('afgoerVagt: en tom database naegter aldrig, uanset aftryk/YAML',
      tomDb.naegt === false && tomDb.kilde === 'tom-database', JSON.stringify(tomDb));

    const agentTilfaeldet = migrer.afgoerVagt([grundrobot()], [grundrobot()], yamlMedNyRobot);
    ok('afgoerVagt: DB matcher AFTRYKKET, YAML er rykket videre (agent-tilfaeldet) - naegter IKKE',
      agentTilfaeldet.naegt === false && agentTilfaeldet.kilde === 'aftryk', JSON.stringify(agentTilfaeldet));

    const dbRedigeretIStudio = grundrobot();
    dbRedigeretIStudio.producentby = 'VAGT2TEST';
    const studioTilfaeldet = migrer.afgoerVagt([dbRedigeretIStudio], [grundrobot()], [grundrobot()]);
    ok('afgoerVagt: DB afviger fra AFTRYKKET (Studio-tilfaeldet) - naegter, selv naar YAML uaendret',
      studioTilfaeldet.naegt === true && studioTilfaeldet.kilde === 'aftryk'
      && studioTilfaeldet.afvigelser.length === 1 && studioTilfaeldet.afvigelser[0].sti === 'producentby',
      JSON.stringify(studioTilfaeldet));

    const intetAftrykEns = migrer.afgoerVagt([grundrobot()], null, [grundrobot()]);
    ok('afgoerVagt: intet aftryk findes endnu, DB matcher YAML - fald-tilbage naegter ikke',
      intetAftrykEns.naegt === false && intetAftrykEns.kilde === 'yaml-fallback', JSON.stringify(intetAftrykEns));

    const intetAftrykUens = migrer.afgoerVagt([dbRedigeretIStudio], null, [grundrobot()]);
    ok('afgoerVagt: intet aftryk findes endnu, DB afviger fra YAML - fald-tilbage naegter (som L35s foerste udgave)',
      intetAftrykUens.naegt === true && intetAftrykUens.kilde === 'yaml-fallback', JSON.stringify(intetAftrykUens));
  }

  console.log('\n8. Vagten i db/eksporter.mjs — ren beslutningsfunktion (L35-opfoelgning, punkt 1)');
  {
    // Beviser netop det, punktets opgavebrev kraever: at et fejlfrit
    // valideringsresultat foerer til flytning (boerFlyttes === true), og at et
    // fejlbehaeftet ikke goer (boerFlyttes === false) - uafhaengigt af om
    // databasen eller assets/ overhovedet findes paa maskinen.
    const eksporter = await import(`file://${rod.replace(/\\/g, '/')}/db/eksporter.mjs`);

    ok('0 fejl foerer til flytning (boerFlyttes === true)',
      eksporter.boerFlyttes({ filer: 77, fejl: 0, advarsler: 1 }) === true);
    ok('0 fejl og 0 advarsler foerer ogsaa til flytning',
      eksporter.boerFlyttes({ filer: 1, fejl: 0, advarsler: 0 }) === true);
    ok('1 fejl blokerer flytningen (boerFlyttes === false), selv med 0 advarsler',
      eksporter.boerFlyttes({ filer: 77, fejl: 1, advarsler: 0 }) === false);
    ok('flere fejl blokerer ligesaa - advarsler alene maa aldrig kunne maskere en fejl',
      eksporter.boerFlyttes({ filer: 77, fejl: 55, advarsler: 1 }) === false);
  }
}
