/**
 * tests/dele/44-cjk-ordlyd-db.mjs — spor/cjkui (opfoelgning), 1. sep 2026.
 *
 * tests/dele/42-cjk-ordlyd.mjs (forrige spor) beviste UI-siden af R21: han-
 * tegn er vaek fra advarsel/note/citat/noter, og *_ordlyd staar korrekt formet
 * i YAML. Den fil roerer IKKE db-kaeden — og db-kaeden var netop stedet, hvor
 * "advarsel_klasse" tidligere forsvandt tavst (28-dbnoegler.mjs's egen
 * historie). Denne fil laaser derfor at de FIRE nye soesterfelter
 * (advarsel_ordlyd, citat_ordlyd, note_ordlyd, noter_ordlyd) overlever BEGGE
 * retninger af db-pipelinen:
 *
 *   1. FELTPOST_NOEGLER_KENDT (VAGT 2, db/migrer.mjs) kender advarsel_ordlyd,
 *      og det RIGTIGE datasaet giver 0 ukendte noegler.
 *   2. klassificerFeltpost <-> byggFeltpostVaerdi <-> byggFeltpostRaekkeTilDb
 *      <-> omdanFeltpostFraDb bevarer advarsel_ordlyd, i begge former (tal,
 *      tilstand_med_herkomst) — samme mekanik-tjek som 28-dbnoegler.mjs
 *      koerte for advarsel_klasse.
 *   3. klassificerRobot <-> byggRobotDoc bevarer noter_ordlyd (topnoegle,
 *      ALTID en liste) og anvendelse.citat_ordlyd/note_ordlyd (skalar- OG
 *      liste-formen af citat_ordlyd), paa RIGTIGE robotter fra data/robots/.
 *   4. omdanRobotFraDb (--fra-db's laesevej — den funktion, der ville have
 *      SKJULT en regression, hvis den blev kaldt mod en rigtig database)
 *      bevarer alle fire fra en simuleret DB-raekke.
 *   5. byggSeedSql paa det RIGTIGE datasaet: de fire kolonner staar i
 *      INSERT-listerne, og optaellingen af *_ordlyd-noegler i den genererede
 *      SQL matcher PRAECIS grep-tallene i data/robots/ (309/33/22/17,
 *      maalt af spor/cjkui via db/rundtur.mjs samme dag).
 *   6. db/skema.sql definerer alle fire kolonner med deres R21-formkrav som
 *      CHECK, og db/migrering-cjk-ordlyd.sql foejer dem til den LEVENDE
 *      database (idempotent — ADD COLUMN IF NOT EXISTS + DO-blok-vagtede
 *      ADD CONSTRAINT).
 *
 * Ingen del her rører data/robots/ (kun læser) eller kalder fetch/.env.
 * Den STAERKESTE proeve — den fulde YAML -> kanonisk.json -> YAML rundtur
 * paa alle 77 rigtige robotter, inkl. tools/validate.mjs og tools/build.mjs
 * paa resultatet — koeres IKKE her (den koerer db/migrer.mjs og
 * db/eksporter.mjs som SUBPROCESSER og skriver til disk, hvilket er uden
 * for denne dels "ingen filsystemskrivning udenfor ctx.tmp"-kontrakt) men
 * som `node db/rundtur.mjs` — se agentrapporten for det maalte facit
 * (77/77 dybt lig, 0 fejl, sider/kilder ens).
 */
import fs from 'node:fs';
import path from 'node:path';

export default async function koer(ctx) {
  const { rod, ok, skema, lasRobotter } = ctx;
  const migrer = await import(`file://${path.join(rod, 'db/migrer.mjs').replace(/\\/g, '/')}`);
  const eksporter = await import(`file://${path.join(rod, 'db/eksporter.mjs').replace(/\\/g, '/')}`);
  const FELTER = skema.FELTER;

  console.log('\n44. *_ordlyd-soesterfelterne (advarsel/citat/note/noter) gennem hele db-kaeden (spor/cjkui)');

  const robotter77 = lasRobotter(path.join(rod, 'data/robots'));
  ok('grundlag: 77 robotfiler læst', robotter77.length === 77, `fik ${robotter77.length}`);

  console.log('  1. VAGT 2 (FELTPOST_NOEGLER_KENDT): 0 ukendte feltpost-nøgler, og advarsel_ordlyd er kendt');
  {
    const ukendte = migrer.tjekFeltpostNoeglerKendt(path.join(rod, 'data/robots'));
    ok('0 ukendte feltpost-nøgler i data/robots/*.yaml (advarsel_ordlyd er nu kendt)',
      ukendte.size === 0,
      ukendte.size ? [...ukendte.entries()].map(([n, s]) => `"${n}": ${s.slice(0, 2).join(', ')}`).join(' | ') : '');
    ok('FELTPOST_NOEGLER_KENDT kender advarsel_ordlyd', migrer.FELTPOST_NOEGLER_KENDT.has('advarsel_ordlyd'));
  }

  console.log('  2. Sentinel-rundtur for advarsel_ordlyd — form "tal" og form "tilstand_med_herkomst"');
  {
    const post = {
      vaerdi: 12, enhed: 'km/h', kilde: 'https://example.com/sentinel44', hentet: '2026-09-01',
      advarsel: 'sentinel-forbehold-44', advarsel_ordlyd: 'sentinel-ordlyd-44 (哨兵)',
    };
    const ud = migrer.klassificerFeltpost('hastighed', post, FELTER.hastighed);
    ok('klassificerFeltpost bevarer advarsel_ordlyd (form: tal)', ud.advarsel_ordlyd === 'sentinel-ordlyd-44 (哨兵)', JSON.stringify(ud));

    const kort = eksporter.byggFeltpostVaerdi(ud);
    ok('byggFeltpostVaerdi bevarer advarsel_ordlyd tilbage til YAML-formen (form: tal)',
      kort.advarsel_ordlyd === 'sentinel-ordlyd-44 (哨兵)', JSON.stringify(kort));

    const raekke = migrer.byggFeltpostRaekkeTilDb(ud, 'hastighed', 44);
    ok('byggFeltpostRaekkeTilDb (tilDb\'s POST-payload) bevarer advarsel_ordlyd',
      raekke.advarsel_ordlyd === 'sentinel-ordlyd-44 (哨兵)' && raekke.robot_id === 44, JSON.stringify(raekke));

    const postTilstand = { vaerdi: 'ikke_oplyst', kilde: 'https://example.com/s44b', hentet: '2026-09-01',
      advarsel: 'sentinel-tilstand-44', advarsel_ordlyd: 'sentinel-tilstand-ordlyd-44' };
    const udTilstand = migrer.klassificerFeltpost('ip_klasse', postTilstand, FELTER.ip_klasse);
    ok('klassificerFeltpost bevarer advarsel_ordlyd (form: tilstand_med_herkomst)',
      udTilstand.advarsel_ordlyd === 'sentinel-tilstand-ordlyd-44', JSON.stringify(udTilstand));

    const raa = {
      form: 'tal', tilstand: null, vaerdi_tal: 12, min: null, maks: null,
      vaerdi_tekst: null, vaerdi_bool: null, vaerdi_liste: null,
      enhed: 'km/h', enhed_imperial: null, vaerdi_imperial: null, operator: null,
      kilde: 'https://example.com/db44', hentet: '2026-09-01', kildetype: null,
      advarsel: 'db-forbehold-44', advarsel_klasse: null, advarsel_ordlyd: 'db-ordlyd-44',
      note: null, raa: null, valuta: null,
      ved_last_tilstand: null, ved_last_vaerdi: null, ved_last_enhed: null,
    };
    const udFraDb = eksporter.omdanFeltpostFraDb(raa);
    ok('omdanFeltpostFraDb bevarer advarsel_ordlyd fra en simuleret DB-række', udFraDb.advarsel_ordlyd === 'db-ordlyd-44', JSON.stringify(udFraDb));
  }

  console.log('  3. klassificerRobot <-> byggRobotDoc paa RIGTIGE robotter — noter_ordlyd, citat_ordlyd (skalar+liste), note_ordlyd');
  {
    // cvte-maxhub-x7: advarsel_ordlyd (feltposter), noter_ordlyd (liste,
    // topnoegle), anvendelse.citat_ordlyd (SKALAR-form), anvendelse.note_ordlyd.
    const cvte = robotter77.find((r) => r.slug === 'cvte-maxhub-x7');
    ok('grundlag: cvte-maxhub-x7 findes i det rigtige datasæt', !!cvte);
    if (cvte) {
      ok('originalen bærer noter_ordlyd som en liste', Array.isArray(cvte.noter_ordlyd) && cvte.noter_ordlyd.length > 0,
        JSON.stringify(cvte.noter_ordlyd));
      ok('originalen bærer anvendelse.citat_ordlyd som en ikke-tom streng',
        typeof cvte.anvendelse?.citat_ordlyd === 'string' && cvte.anvendelse.citat_ordlyd !== '',
        JSON.stringify(cvte.anvendelse?.citat_ordlyd));
      ok('originalen bærer anvendelse.note_ordlyd', typeof cvte.anvendelse?.note_ordlyd === 'string' && cvte.anvendelse.note_ordlyd !== '',
        JSON.stringify(cvte.anvendelse?.note_ordlyd));

      const kanonisk = migrer.klassificerRobot(cvte);
      ok('klassificerRobot bevarer noter_ordlyd, samme længde som originalen',
        Array.isArray(kanonisk.noter_ordlyd) && kanonisk.noter_ordlyd.length === cvte.noter_ordlyd.length,
        JSON.stringify(kanonisk.noter_ordlyd));
      ok('klassificerRobot bevarer anvendelse.citat_ordlyd (skalar)',
        kanonisk.anvendelse?.citat_ordlyd === cvte.anvendelse.citat_ordlyd, JSON.stringify(kanonisk.anvendelse?.citat_ordlyd));
      ok('klassificerRobot bevarer anvendelse.note_ordlyd',
        kanonisk.anvendelse?.note_ordlyd === cvte.anvendelse.note_ordlyd, JSON.stringify(kanonisk.anvendelse?.note_ordlyd));

      const doc = eksporter.byggRobotDoc(kanonisk);
      ok('byggRobotDoc bevarer noter_ordlyd tilbage til YAML-formen',
        JSON.stringify(doc.noter_ordlyd) === JSON.stringify(cvte.noter_ordlyd), JSON.stringify(doc.noter_ordlyd));
      ok('byggRobotDoc bevarer anvendelse.citat_ordlyd tilbage til YAML-formen',
        doc.anvendelse?.citat_ordlyd === cvte.anvendelse.citat_ordlyd, JSON.stringify(doc.anvendelse?.citat_ordlyd));
      ok('byggRobotDoc bevarer anvendelse.note_ordlyd tilbage til YAML-formen',
        doc.anvendelse?.note_ordlyd === cvte.anvendelse.note_ordlyd, JSON.stringify(doc.anvendelse?.note_ordlyd));

      const yamlTekst = eksporter.skrivRobotYaml(doc);
      ok('skrivRobotYaml skriver noter_ordlyd som en topnøgle (kritisk: uden den i topRaekkefoelge forsvinder feltet tavst)',
        /^noter_ordlyd:$/m.test(yamlTekst), yamlTekst.split('\n').filter((l) => l.startsWith('noter')).join(' | '));

      // Fuld rundtur: parse den genererede YAML igen og sammenlign normaliseret
      // form mod originalen, PRAECIS db/rundtur.mjs's egen proeve, men skoppet
      // til de fire *_ordlyd-felter alene.
      const genparset = skema.normaliserRobot((await import(`file://${path.join(rod, 'tools/yaml.mjs').replace(/\\/g, '/')}`)).parseYaml(yamlTekst, 'test44.yaml'));
      ok('fuld tekst-rundtur (skriv -> genparse): noter_ordlyd byte-for-byte lig originalen',
        JSON.stringify(genparset.noter_ordlyd) === JSON.stringify(cvte.noter_ordlyd), JSON.stringify(genparset.noter_ordlyd));
      ok('fuld tekst-rundtur: anvendelse.citat_ordlyd byte-for-byte lig originalen',
        genparset.anvendelse?.citat_ordlyd === cvte.anvendelse.citat_ordlyd, JSON.stringify(genparset.anvendelse?.citat_ordlyd));
      ok('fuld tekst-rundtur: anvendelse.note_ordlyd byte-for-byte lig originalen',
        genparset.anvendelse?.note_ordlyd === cvte.anvendelse.note_ordlyd, JSON.stringify(genparset.anvendelse?.note_ordlyd));
    }

    // unitree-go2: anvendelse.citat_ordlyd i LISTE-formen (den anden gren,
    // citat_ordlyd's egen kommentar advarer om — samme parallel-liste-mekanik
    // som noter_ordlyd, men på anvendelse-niveau).
    const go2 = robotter77.find((r) => r.slug === 'unitree-go2');
    ok('grundlag: unitree-go2 findes i det rigtige datasæt', !!go2);
    if (go2) {
      ok('originalen bærer anvendelse.citat_ordlyd som en LISTE',
        Array.isArray(go2.anvendelse?.citat_ordlyd), JSON.stringify(go2.anvendelse?.citat_ordlyd));
      ok('anvendelse.citat_ordlyd har samme længde som anvendelse.citat',
        go2.anvendelse.citat_ordlyd.length === go2.anvendelse.citat.length,
        `citat: ${go2.anvendelse.citat.length}, citat_ordlyd: ${go2.anvendelse.citat_ordlyd.length}`);

      const kanonisk = migrer.klassificerRobot(go2);
      ok('klassificerRobot bevarer anvendelse.citat_ordlyd (liste-form), samme længde',
        Array.isArray(kanonisk.anvendelse?.citat_ordlyd) && kanonisk.anvendelse.citat_ordlyd.length === go2.anvendelse.citat_ordlyd.length,
        JSON.stringify(kanonisk.anvendelse?.citat_ordlyd));

      const doc = eksporter.byggRobotDoc(kanonisk);
      ok('byggRobotDoc bevarer anvendelse.citat_ordlyd (liste-form) tilbage til YAML-formen',
        JSON.stringify(doc.anvendelse?.citat_ordlyd) === JSON.stringify(go2.anvendelse.citat_ordlyd),
        JSON.stringify(doc.anvendelse?.citat_ordlyd));
    }
  }

  console.log('  4. omdanRobotFraDb (--fra-db\'s læsevej) bevarer alle fire fra en simuleret DB-række');
  {
    const feltposter = skema.FELTNAVNE.map((feltnavn, i) => ({
      feltnavn, form: 'bare_tilstand', tilstand: 'ikke_oplyst',
      vaerdi_tal: null, min: null, maks: null, vaerdi_tekst: null, vaerdi_bool: null, vaerdi_liste: null,
      enhed: null, enhed_imperial: null, vaerdi_imperial: null, operator: null, kilde: null, hentet: null,
      kildetype: null, advarsel: i === 0 ? 'db-forbehold-44b' : null, advarsel_klasse: null,
      advarsel_ordlyd: i === 0 ? 'db-ordlyd-44b' : null,
      note: null, raa: null, valuta: null,
      ved_last_tilstand: null, ved_last_vaerdi: null, ved_last_enhed: null, feltpost_varianter: [],
    }));
    const raaRaekke = {
      slug: 'proeve-fradb-44', navn: 'Proeve', producent: 'X', producentland: 'Kina', producentby: null,
      status: 'i_produktion', fremdrift: 'ben', foerste_udgivelse: null,
      forgaenger_robot_id: null, varianter: null, noter: ['En note.'], noter_ordlyd: ['原文'],
      feltposter,
      anvendelse: {
        er_bar_streng: false, er_ikke_oplyst: false, vaerdi: 'industri',
        citat: 'Et citat.', citat_ordlyd: '原文引用', kilde: 'https://example.com/44c', hentet: '2026-09-01',
        kildetype: null, arvet_fra_robot_id: null, note: 'En begrundelse.', note_ordlyd: '原文说明',
      },
      billede: null,
    };
    const ud = eksporter.omdanRobotFraDb(raaRaekke, new Map());
    ok('omdanRobotFraDb bevarer noter_ordlyd fra en simuleret DB-række',
      JSON.stringify(ud.noter_ordlyd) === JSON.stringify(['原文']), JSON.stringify(ud.noter_ordlyd));
    ok('omdanRobotFraDb bevarer anvendelse.citat_ordlyd fra en simuleret DB-række',
      ud.anvendelse?.citat_ordlyd === '原文引用', JSON.stringify(ud.anvendelse?.citat_ordlyd));
    ok('omdanRobotFraDb bevarer anvendelse.note_ordlyd fra en simuleret DB-række',
      ud.anvendelse?.note_ordlyd === '原文说明', JSON.stringify(ud.anvendelse?.note_ordlyd));
    ok('omdanRobotFraDb bevarer advarsel_ordlyd på feltpost-niveau fra en simuleret DB-række',
      ud.felter[skema.FELTNAVNE[0]].advarsel_ordlyd === 'db-ordlyd-44b', JSON.stringify(ud.felter[skema.FELTNAVNE[0]]));
  }

  console.log('  5. byggSeedSql på det RIGTIGE datasæt: kolonnerne findes, tal matcher grep i data/robots/');
  {
    const kanoniske = robotter77.map((doc) => migrer.klassificerRobot(doc));
    const sql = migrer.byggSeedSql(kanoniske);
    ok('seed.sql\'s robotter-INSERT nævner kolonnen noter_ordlyd',
      /insert into robotter \([^)]*\bnoter_ordlyd\b/.test(sql));
    ok('seed.sql\'s feltposter-INSERT nævner kolonnen advarsel_ordlyd',
      /insert into feltposter \([^)]*\badvarsel_ordlyd\b/.test(sql));
    ok('seed.sql\'s anvendelse-INSERT nævner kolonnerne citat_ordlyd og note_ordlyd',
      /insert into anvendelse \([^)]*\bcitat_ordlyd\b[^)]*\bnote_ordlyd\b/.test(sql));

    // "key:"-linjetal i data/robots/*.yaml (grep -c "^\s*<key>:") — samme
    // maaletal, spor/cjkui rapporterede fra db/rundtur.mjs samme dag.
    // advarsel_ordlyd/citat_ordlyd/note_ordlyd taeller antal 'noeglen: ...'-
    // FOREKOMSTER i seed.sql'ens genererede felt-vaerdier (via en simpel,
    // ikke-null-taelling paa den kanoniske form — mere robust end en SQL-
    // tekst-grep, som ville kunne ramme et citat, der selv indeholder ordet).
    let advarselOrdlydTal = 0, citatOrdlydTal = 0, noteOrdlydTal = 0, noterOrdlydTal = 0;
    for (const r of kanoniske) {
      for (const feltnavn of skema.FELTNAVNE) {
        if (r.felter[feltnavn].advarsel_ordlyd != null) advarselOrdlydTal++;
      }
      if (r.anvendelse?.citat_ordlyd != null) citatOrdlydTal++;
      if (r.anvendelse?.note_ordlyd != null) noteOrdlydTal++;
      if (r.noter_ordlyd != null) noterOrdlydTal++;
    }
    ok('309 advarsel_ordlyd-feltposter i det rigtige datasæt (grep-tal, samme dag)', advarselOrdlydTal === 309, `fik ${advarselOrdlydTal}`);
    ok('33 anvendelse.citat_ordlyd-forekomster i det rigtige datasæt (grep-tal, samme dag)', citatOrdlydTal === 33, `fik ${citatOrdlydTal}`);
    ok('22 anvendelse.note_ordlyd-forekomster i det rigtige datasæt (grep-tal, samme dag)', noteOrdlydTal === 22, `fik ${noteOrdlydTal}`);
    ok('17 noter_ordlyd-topnøgle-forekomster i det rigtige datasæt (grep-tal, samme dag)', noterOrdlydTal === 17, `fik ${noterOrdlydTal}`);
  }

  console.log('  6. db/skema.sql og db/migrering-cjk-ordlyd.sql — strukturel tilstedeværelse');
  {
    const skemaSql = fs.readFileSync(path.join(rod, 'db/skema.sql'), 'utf8');
    ok('db/skema.sql definerer robotter.noter_ordlyd (jsonb)', /noter_ordlyd\s+jsonb/.test(skemaSql));
    ok('db/skema.sql definerer feltposter.advarsel_ordlyd (text)', /advarsel_ordlyd\s+text/.test(skemaSql));
    ok('db/skema.sql definerer anvendelse.citat_ordlyd (jsonb)', /citat_ordlyd\s+jsonb/.test(skemaSql));
    ok('db/skema.sql definerer anvendelse.note_ordlyd (text)', /note_ordlyd\s+text/.test(skemaSql));

    const migSql = fs.readFileSync(path.join(rod, 'db/migrering-cjk-ordlyd.sql'), 'utf8');
    ok('migrering-cjk-ordlyd.sql tilføjer alle fire kolonner (IF NOT EXISTS, idempotent)',
      /add column if not exists noter_ordlyd jsonb/.test(migSql)
      && /add column if not exists advarsel_ordlyd text/.test(migSql)
      && /add column if not exists citat_ordlyd jsonb/.test(migSql)
      && /add column if not exists note_ordlyd text/.test(migSql));
    ok('migrering-cjk-ordlyd.sql vagter hver ADD CONSTRAINT mod pg_constraint (kan køres to gange)',
      (migSql.match(/select 1 from pg_constraint where conname/g) || []).length >= 6);
  }
}
