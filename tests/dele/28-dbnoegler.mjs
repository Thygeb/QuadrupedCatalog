/**
 * tests/dele/28-dbnoegler.mjs — spor/dbklasse, punkt 4.
 *
 * Beviser den STRUKTURELLE invariant, der blev brudt 27.–28. aug 2026: hver
 * nøgle, der findes i en RIGTIG feltpost i data/robots/*.yaml, skal også
 * kunne kopieres helskindet gennem BEGGE retninger af db-pipelinen —
 * db/migrer.mjs (YAML -> DB) og db/eksporter.mjs (DB -> YAML) — uden at
 * kræve netværk eller .env. "advarsel_klasse" er den nøgle, der faktisk
 * forsvandt (562 forekomster, ingen af pipelinens fem kopisteder kendte den);
 * denne fil tester BÅDE den konkrete nøgle OG den generiske vagt, der skal
 * fange den NÆSTE.
 *
 * Ingen del her rører data/robots/ (kun læser) eller kalder fetch.
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
  const { rod, tmp, ok, skema } = ctx;
  const migrer = await import(`file://${path.join(rod, 'db/migrer.mjs').replace(/\\/g, '/')}`);
  const eksporter = await import(`file://${path.join(rod, 'db/eksporter.mjs').replace(/\\/g, '/')}`);
  const FELTER = skema.FELTER;

  console.log('\n28. Feltpost-nøglerne gennem db-pipelinen (spor/dbklasse, opfølgning på d14data)');

  console.log('  1. tjekFeltpostNoeglerKendt: det RIGTIGE datasæt har nul ukendte nøgler');
  {
    const ukendte = migrer.tjekFeltpostNoeglerKendt(path.join(rod, 'data/robots'));
    ok('0 ukendte feltpost-nøgler i data/robots/*.yaml',
      ukendte.size === 0,
      ukendte.size ? [...ukendte.entries()].map(([n, s]) => `"${n}": ${s.slice(0, 2).join(', ')}`).join(' | ') : '');
    ok('FELTPOST_NOEGLER_KENDT kender advarsel_klasse (den nøgle, der forsvandt)',
      migrer.FELTPOST_NOEGLER_KENDT.has('advarsel_klasse'));
  }

  console.log('  2. Vagten fanger et bevidst ødelagt eksempel (opdigtet nøgle i en feltpost)');
  {
    const felter =
      `  egenvaegt:\n    vaerdi: 60\n    enhed: kg\n    kilde: https://example.com/a\n` +
      `    hentet: 2026-08-19\n    fantomnoegle: "denne findes ikke i FELTPOST_NOEGLER_KENDT"\n`;
    const fil = path.join(tmp, '28-oedelagt.yaml');
    fs.writeFileSync(fil, HOVED.replace('NAVN', '28-oedelagt') + felter, 'utf8');
    const mappe = path.join(tmp, '28-oedelagt-mappe');
    fs.rmSync(mappe, { recursive: true, force: true });
    fs.mkdirSync(mappe, { recursive: true });
    fs.copyFileSync(fil, path.join(mappe, '28-oedelagt.yaml'));

    const ukendte = migrer.tjekFeltpostNoeglerKendt(mappe);
    ok('vagten fanger "fantomnoegle" på den ødelagte fil',
      ukendte.size === 1 && ukendte.has('fantomnoegle'),
      JSON.stringify([...ukendte.entries()]));
  }

  console.log('  3. Rundtur i klassificerFeltpost <-> byggFeltpostVaerdi med sentinel-værdier — formen "tal"');
  {
    const post = {
      vaerdi: 12, enhed: 'km/h', enhed_imperial: 'mph', vaerdi_imperial: 7.5, operator: '>=',
      kilde: 'https://example.com/sentinel', hentet: '2026-08-27', kildetype: 'sekundaer',
      advarsel: 'sentinel-forbehold', advarsel_klasse: 'uddybning',
      note: 'sentinel-note', raa: 'sentinel-raa', valuta: null,
    };
    const ud = migrer.klassificerFeltpost('hastighed', post, FELTER.hastighed);
    ok('klassificerFeltpost bevarer advarsel_klasse (form: tal)', ud.advarsel_klasse === 'uddybning', JSON.stringify(ud));
    ok('klassificerFeltpost bevarer nabofeltet advarsel (kontrol af selve mekanismen)',
      ud.advarsel === 'sentinel-forbehold', JSON.stringify(ud));

    const kort = eksporter.byggFeltpostVaerdi(ud);
    ok('byggFeltpostVaerdi bevarer advarsel_klasse tilbage til YAML-formen (form: tal)',
      kort.advarsel_klasse === 'uddybning', JSON.stringify(kort));

    const raekke = migrer.byggFeltpostRaekkeTilDb(ud, 'hastighed', 42);
    ok('byggFeltpostRaekkeTilDb (tilDb\'s POST-payload) bevarer advarsel_klasse',
      raekke.advarsel_klasse === 'uddybning' && raekke.robot_id === 42 && raekke.feltnavn === 'hastighed',
      JSON.stringify(raekke));
  }

  console.log('  4. Samme rundtur for formen "tilstand_med_herkomst" (den anden gren, briefet advarede om)');
  {
    const post = {
      vaerdi: 'ikke_oplyst', kilde: 'https://example.com/sentinel2', hentet: '2026-08-27',
      kildetype: 'primaer', advarsel: 'sentinel-forbehold-2', advarsel_klasse: 'gyldighed',
    };
    const ud = migrer.klassificerFeltpost('ip_klasse', post, FELTER.ip_klasse);
    ok('klassificerFeltpost rammer formen tilstand_med_herkomst', ud.form === 'tilstand_med_herkomst', JSON.stringify(ud));
    ok('klassificerFeltpost bevarer advarsel_klasse (form: tilstand_med_herkomst)',
      ud.advarsel_klasse === 'gyldighed', JSON.stringify(ud));

    const kort = eksporter.byggFeltpostVaerdi(ud);
    ok('byggFeltpostVaerdi bevarer advarsel_klasse tilbage til YAML-formen (form: tilstand_med_herkomst)',
      kort.advarsel_klasse === 'gyldighed', JSON.stringify(kort));
  }

  console.log('  5. omdanFeltpostFraDb (eksporter --fra-db\'s læsevej) bevarer advarsel_klasse fra en simuleret DB-række');
  {
    const raa = {
      form: 'tal', tilstand: null, vaerdi_tal: 12, min: null, maks: null,
      vaerdi_tekst: null, vaerdi_bool: null, vaerdi_liste: null,
      enhed: 'km/h', enhed_imperial: null, vaerdi_imperial: null, operator: null,
      kilde: 'https://example.com/db', hentet: '2026-08-27', kildetype: null,
      advarsel: 'db-forbehold', advarsel_klasse: 'gyldighed', note: null, raa: null, valuta: null,
      ved_last_tilstand: null, ved_last_vaerdi: null, ved_last_enhed: null,
    };
    const ud = eksporter.omdanFeltpostFraDb(raa);
    ok('omdanFeltpostFraDb bevarer advarsel_klasse fra en DB-række', ud.advarsel_klasse === 'gyldighed', JSON.stringify(ud));
  }

  console.log('  6. byggSeedSql på det RIGTIGE datasæt: 259 gyldighed / 303 uddybning (562 i alt)');
  {
    const filer = fs.readdirSync(path.join(rod, 'data/robots')).filter((f) => /\.ya?ml$/.test(f)).sort();
    const robotter = filer.map((f) => {
      const doc = skema.normaliserRobot(ctx.yaml.parseYaml(fs.readFileSync(path.join(rod, 'data/robots', f), 'utf8'), f));
      return migrer.klassificerRobot(doc);
    });
    ok('77 robotter klassificeret', robotter.length === 77, `fik ${robotter.length}`);

    const sql = migrer.byggSeedSql(robotter);
    ok('seed.sql\'s feltposter-INSERT nævner kolonnen advarsel_klasse',
      /insert into feltposter \([^)]*advarsel_klasse/.test(sql));
    const gyldighed = (sql.match(/'gyldighed'/g) || []).length;
    const uddybning = (sql.match(/'uddybning'/g) || []).length;
    ok('259 "gyldighed" i den genererede SQL', gyldighed === 259, `fik ${gyldighed}`);
    ok('303 "uddybning" i den genererede SQL', uddybning === 303, `fik ${uddybning}`);
  }

  return {};
}
