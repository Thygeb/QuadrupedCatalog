/**
 * tests/dele/33-fremdrift-db.mjs — spor/dbfelter.
 *
 * "fremdrift" (IDENTITET_PAAKRAEVET, tools/validate.mjs:67) er PAAKRAEVET og
 * udfyldt 77/77 i data/robots/*.yaml, men db-kæden kendte den IKKE, før dette
 * spor rettede det (Å65, briefet der satte sporet i gang): db/skema.sql havde
 * ingen kolonne, og migrer.mjs/eksporter.mjs kopierede feltet ingen steder —
 * en `--fra-db`-eksport ville derfor stille og roligt STRIPPE fremdrift fra
 * enhver robot, den rørte.
 *
 * Denne fil beviser BEGGE retninger af pipelinen bærer feltet — YAML -> DB-
 * form (klassificerRobot, byggSeedSql) og DB-form -> YAML (byggRobotDoc,
 * skrivRobotYaml, omdanRobotFraDb, den funktion der ville have skjult Å65,
 * hvis den var kaldt mod en rigtig database) — samt at selve migrerings-
 * SQL'en (db/migrering-fremdrift.sql), der skal bringe den LEVENDE database
 * ajour, backfilder PRÆCIS de 77 værdier, data/robots/ i dag bærer. Ingen
 * netværk, ingen .env — samme princip som 07-db-vagt.mjs og 28-dbnoegler.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';

export default async function koer(ctx) {
  const { rod, ok, skema, lasRobotter } = ctx;
  const migrer = await import(`file://${path.join(rod, 'db/migrer.mjs').replace(/\\/g, '/')}`);
  const eksporter = await import(`file://${path.join(rod, 'db/eksporter.mjs').replace(/\\/g, '/')}`);

  console.log('\n33. "fremdrift" gennem hele db-kæden (spor/dbfelter, Å65-ophævelse)');

  const robotter77 = lasRobotter(path.join(rod, 'data/robots'));
  ok('grundlag: 77 robotfiler læst', robotter77.length === 77, `fik ${robotter77.length}`);

  console.log('  1. klassificerRobot (YAML -> kanonisk form) bevarer fremdrift, for begge værdier');
  {
    const benDoc = robotter77.find((r) => r.fremdrift === 'ben');
    const benHjulDoc = robotter77.find((r) => r.fremdrift === 'ben_hjul');
    ok('mindst én "ben"-robot findes i det rigtige datasæt', !!benDoc);
    ok('mindst én "ben_hjul"-robot findes i det rigtige datasæt', !!benHjulDoc);

    const benKanonisk = migrer.klassificerRobot(benDoc);
    const benHjulKanonisk = migrer.klassificerRobot(benHjulDoc);
    ok('klassificerRobot bevarer fremdrift = "ben"', benKanonisk.fremdrift === 'ben', benKanonisk.fremdrift);
    ok('klassificerRobot bevarer fremdrift = "ben_hjul"', benHjulKanonisk.fremdrift === 'ben_hjul', benHjulKanonisk.fremdrift);
    ok('de to værdier er faktisk FORSKELLIGE (måleapparatet skelner, gætter ikke én konstant)',
      benKanonisk.fremdrift !== benHjulKanonisk.fremdrift);
  }

  console.log('  2. byggSeedSql på det RIGTIGE datasæt: kolonnen findes, og 53 ben / 24 ben_hjul optræder');
  {
    const kanoniske = robotter77.map((doc) => migrer.klassificerRobot(doc));
    const sql = migrer.byggSeedSql(kanoniske);
    ok('seed.sql\'s robotter-INSERT nævner kolonnen fremdrift',
      /insert into robotter \([^)]*\bfremdrift\b/.test(sql));

    // Skop til robotter-INSERTet alene, saa 'ben'/'ben_hjul' ikke ved en
    // tilfaeldighed ogsaa matcher en tekst-/note-vaerdi laengere nede i den
    // samme fil (feltposter-sektionen baerer al specifikationsdata).
    const robotterSektion = sql.slice(0, sql.indexOf('insert into feltposter'));
    const ben = (robotterSektion.match(/'ben'/g) || []).length;
    const benHjul = (robotterSektion.match(/'ben_hjul'/g) || []).length;
    ok('53 "ben" i robotter-INSERTet', ben === 53, `fik ${ben}`);
    ok('24 "ben_hjul" i robotter-INSERTet', benHjul === 24, `fik ${benHjul}`);
    ok('53 + 24 = 77, dækker alle robotter', ben + benHjul === 77, `${ben} + ${benHjul}`);
  }

  console.log('  3. byggRobotDoc + skrivRobotYaml (DB-form -> YAML) skriver fremdrift som citeret streng');
  {
    const ben = migrer.klassificerRobot(robotter77.find((r) => r.fremdrift === 'ben'));
    const doc = eksporter.byggRobotDoc(ben);
    ok('byggRobotDoc bevarer fremdrift', doc.fremdrift === 'ben', doc.fremdrift);

    const yamlTekst = eksporter.skrivRobotYaml(doc);
    ok('skrivRobotYaml skriver "fremdrift: \\"ben\\"" som citeret streng (samme form som status)',
      /^fremdrift: "ben"$/m.test(yamlTekst), yamlTekst.split('\n').find((l) => l.startsWith('fremdrift')));
  }

  console.log('  4. omdanRobotFraDb (--fra-db\'s læsevej — den funktion, der ville have SKJULT Å65) bevarer fremdrift');
  {
    // 30 minimale, men strukturelt gyldige feltpost-raekker, én pr. FELTNAVNE
    // — omdanRobotFraDb kraever praecis FELTNAVNE.length feltposter, ellers
    // fejler den hoejlydt (samme vagt som beskytter mod en pagineret/ufuldstaendig
    // GET, se funktionens egen kommentar i db/eksporter.mjs).
    const feltposter = skema.FELTNAVNE.map((feltnavn) => ({
      feltnavn, form: 'bare_tilstand', tilstand: 'ikke_oplyst',
      vaerdi_tal: null, min: null, maks: null, vaerdi_tekst: null, vaerdi_bool: null, vaerdi_liste: null,
      enhed: null, enhed_imperial: null, vaerdi_imperial: null, operator: null, kilde: null, hentet: null,
      kildetype: null, advarsel: null, advarsel_klasse: null, note: null, raa: null, valuta: null,
      ved_last_tilstand: null, ved_last_vaerdi: null, ved_last_enhed: null, feltpost_varianter: [],
    }));
    const raaRaekke = {
      slug: 'proeve-fradb-33', navn: 'Proeve', producent: 'X', producentland: 'Kina', producentby: null,
      status: 'i_produktion', fremdrift: 'ben_hjul', foerste_udgivelse: null,
      forgaenger_robot_id: null, varianter: null, noter: null,
      feltposter, anvendelse: null, billede: null,
    };
    const ud = eksporter.omdanRobotFraDb(raaRaekke, new Map());
    ok('omdanRobotFraDb bevarer fremdrift fra en simuleret DB-række (den PRÆCISE vej Å65 ramte)',
      ud.fremdrift === 'ben_hjul', JSON.stringify(ud.fremdrift));
  }

  console.log('  5. db/skema.sql og db/migrering-fremdrift.sql — strukturel tilstedeværelse og fuldt dækkende backfill');
  {
    const skemaSql = fs.readFileSync(path.join(rod, 'db/skema.sql'), 'utf8');
    ok('db/skema.sql definerer fremdrift som text not null med CHECK på præcis de to værdier',
      /fremdrift\s+text not null check \(fremdrift in \('ben', 'ben_hjul'\)\)/.test(skemaSql));

    const migSql = fs.readFileSync(path.join(rod, 'db/migrering-fremdrift.sql'), 'utf8');
    ok('migrering-fremdrift.sql tilføjer kolonnen (nullable først)',
      /alter table robotter add column fremdrift text;/.test(migSql));
    ok('migrering-fremdrift.sql backfilder fra en UPDATE',
      /update robotter set fremdrift = case slug/.test(migSql));
    ok('migrering-fremdrift.sql sætter NOT NULL',
      /alter table robotter alter column fremdrift set not null;/.test(migSql));
    ok('migrering-fremdrift.sql tilføjer CHECK-begrænsningen',
      /add constraint robotter_fremdrift_check check \(fremdrift in \('ben', 'ben_hjul'\)\);/.test(migSql));

    // Selve regressionsvagten: hver ÉNESTE slug i det RIGTIGE datasæt i dag
    // skal findes i backfildens CASE-udtryk, MED PRÆCIS samme værdi som
    // YAML'en bærer — ikke kun "kolonnen findes et sted i filen". Kommer en
        // robot til, eller ændres en fremdrift-værdi, før migreringen er kørt af
    // orkestratoren, fanger denne test det.
    let uoverensstemmelser = 0;
    for (const doc of robotter77) {
      const linje = `when '${doc.slug}' then '${doc.fremdrift}'`;
      if (!migSql.includes(linje)) uoverensstemmelser++;
    }
    ok('alle 77 slugs backfildes i migrering-fremdrift.sql med PRÆCIS deres YAML-værdi',
      uoverensstemmelser === 0, `${uoverensstemmelser} af 77 mangler eller afviger`);
  }
}
