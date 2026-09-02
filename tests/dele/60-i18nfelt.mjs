/**
 * tests/dele/60-i18nfelt.mjs — spor/i18nfelt (Å98 spor A), 2. sep 2026.
 *
 * BRIEF-i18nfelt.md's fem punkter, i raekkefoelge:
 *   1. advarsel_i18n/note_i18n er KENDTE NOEGLER (POST_NOEGLER/
 *      ANVENDELSE_NOEGLER/BILLEDE_NOEGLER) — en gyldig post giver 0 fejl,
 *      hvor den foer gav R11 "ukendt noegle".
 *   2. R22 — fem bevidst OEDELAGTE tilfaelde, ét pr. krav i briefets punkt 2,
 *      plus de gyldige former (advarsel_i18n OG note_i18n x2) skal passere.
 *   3. build.mjs vaelger tekst efter sprog ÉT sted: en dansk "UDEN batteri"
 *      forsvinder fra /en/robotter/unitree-aliengo/ og forbliver paa /da/.
 *   4. db/eksporter.mjs baerer BEGGE veje (LOCAL og --fra-db, simulerede
 *      DB-raekker — INGEN fetch, INGEN .env), og db/skema.sql +
 *      db/migrering-i18n.sql definerer kolonnerne strukturelt.
 *   5. En KENDT GRAENSE, IKKE dette spors filejerskab: db/migrer.mjs's
 *      FELTPOST_NOEGLER_KENDT (VAGT 2) kender endnu ikke advarsel_i18n —
 *      se agentrapportens "Nye faelder og opdagelser".
 *
 * (Punkt 5 i briefet — "ingen dansk tekst maa aendre sig" — er EFTERPROEVET
 * separat med `git diff --stat data/robots/` foer commit, ikke skrevet som
 * en automatiseret test her: en test, der paastaar "denne fil rørte ikke
 * data/robots/", er sand af sig selv for enhver fil, der aldrig laeser
 * mappen — den kan ikke bevise noget, en `git diff` ikke allerede beviser
 * bedre.)
 *
 * Dette spor oversaetter INGENTING (roerer ikke data/robots/) — testene her
 * bruger derfor udelukkende syntetiske fixtures i ctx.tmp, ALDRIG rigtige
 * robotfiler, bortset fra punkt 3's build, som KOPIERER (aldrig redigerer)
 * data/robots/ til en scratch-mappe foer den patches der.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const HOVED = `slug: NAVN
navn: Proeve
producent: Proeveproducent
producentland: Kina
status: i_produktion
fremdrift: ben
`;

export default async function koer(ctx) {
  const { rod, tmp, node, ok, koerValidator, skema } = ctx;

  console.log('\n60. spor/i18nfelt — advarsel_i18n/note_i18n: sprogoverbygning paa advarsel og note (Å98 spor A)');

  console.log('  1. advarsel_i18n er en kendt noegle — en gyldig post giver 0 fejl');
  {
    const indhold = HOVED.replace('NAVN', 'sag-60-kendt-noegle') +
      `felter:\n  egenvaegt:\n    vaerdi: 60\n    enhed: kg\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n` +
      `    advarsel: "Dansk forbehold."\n    advarsel_i18n:\n      en: "English caveat."\n`;
    const fil = path.join(tmp, 'sag-60-kendt-noegle.yaml');
    fs.writeFileSync(fil, indhold, 'utf8');
    const r = koerValidator([fil]);
    ok('advarsel_i18n paa en feltpost giver 0 fejl (R11 kender noeglen)', r.kode === 0, r.ud.trim());
  }

  console.log('  2. R22 — fem bevidst oedelagte former, plus de gyldige (advarsel_i18n + note_i18n x2)');
  const basisFelter = `felter:\n  egenvaegt:\n    vaerdi: 60\n    enhed: kg\n` +
    `    kilde: https://example.com/a\n    hentet: 2026-08-19\n    advarsel: "Dansk forbehold."\n`;
  const oedelagte = [
    ['advarsel_i18n er ikke et sprogkort (bar streng)',
      HOVED.replace('NAVN', 'sag-60-ikke-kort') + basisFelter + `    advarsel_i18n: "ikke et kort"\n`],
    ['advarsel_i18n med et sprog uden for SPROG ("fr")',
      HOVED.replace('NAVN', 'sag-60-ukendt-sprog') + basisFelter + `    advarsel_i18n:\n      fr: "Texte francais."\n`],
    ['advarsel_i18n med kildesproget "da" som noegle',
      HOVED.replace('NAVN', 'sag-60-kildesprog') + basisFelter + `    advarsel_i18n:\n      da: "Dansk igen."\n`],
    ['advarsel_i18n uden advarsel',
      HOVED.replace('NAVN', 'sag-60-uden-advarsel') +
        `felter:\n  egenvaegt:\n    vaerdi: 60\n    enhed: kg\n    kilde: https://example.com/a\n` +
        `    hentet: 2026-08-19\n    advarsel_i18n:\n      en: "Only translation, no source."\n`],
    ['advarsel_i18n med internt sprog i den oversatte tekst',
      HOVED.replace('NAVN', 'sag-60-internt-sprog') + basisFelter +
        `    advarsel_i18n:\n      en: "See egenvaegt.yaml for details."\n`],
  ];
  for (const [navn, indhold] of oedelagte) {
    const fil = path.join(tmp, navn.replace(/[^a-z0-9]+/gi, '-') + '.yaml');
    fs.writeFileSync(fil, indhold, 'utf8');
    const r = koerValidator([fil]);
    ok(`${navn}  ->  R22`, r.kode === 1 && /\bR22:/.test(r.ud),
      r.kode !== 1 ? `exit ${r.kode}, forventede 1 — ${r.ud.trim().slice(0, 200)}` : `ingen R22 i udskriften: ${r.ud.trim().slice(0, 200)}`);
  }

  {
    const gyldig = HOVED.replace('NAVN', 'sag-60-gyldig') +
      `anvendelse:\n  vaerdi: industri\n  citat: "Robot - Industry"\n  kilde: https://example.com/a\n` +
      `  hentet: 2026-08-19\n  note: "Dansk begrundelse."\n  note_i18n:\n    en: "English rationale."\n` +
      `billede:\n  fil: silhuetter/_proeve-kaede.svg\n  ophav: silhuet\n  kilde: https://example.com/a\n` +
      `  hentet: 2026-08-19\n  note: "Dansk billednote."\n  note_i18n:\n    en: "English image note."\n` +
      basisFelter + `    advarsel_i18n:\n      en: "English caveat."\n`;
    const fil = path.join(tmp, 'sag-60-gyldig.yaml');
    fs.writeFileSync(fil, gyldig, 'utf8');
    const r = koerValidator([fil]);
    ok('advarsel_i18n + anvendelse.note_i18n + billede.note_i18n, alle gyldigt formet, giver 0 fejl',
      r.kode === 0, r.ud.trim());
  }

  console.log('  3. build.mjs vaelger tekst efter sprog ÉT sted — "UDEN batteri" forsvinder fra /en/, forbliver paa /da/');
  {
    const dataMappe = path.join(tmp, 'proeve-data-60');
    fs.rmSync(dataMappe, { recursive: true, force: true });
    fs.mkdirSync(dataMappe, { recursive: true });
    const kildeMappe = path.join(rod, 'data', 'robots');
    const kildeFiler = fs.readdirSync(kildeMappe).filter((f) => /\.ya?ml$/.test(f));
    for (const f of kildeFiler) fs.copyFileSync(path.join(kildeMappe, f), path.join(dataMappe, f));
    ok('grundlag: alle robotfiler kopieret til scratch-mappen (KOPI, data/robots/ er ikke roert)',
      kildeFiler.length > 0 && fs.readdirSync(dataMappe).length === kildeFiler.length,
      `fik ${fs.readdirSync(dataMappe).length} af ${kildeFiler.length}`);

    const aliengoFil = path.join(dataMappe, 'unitree-aliengo.yaml');
    const original = fs.readFileSync(aliengoFil, 'utf8');
    ok('grundlag: unitree-aliengo.yaml (kopien) baerer "UDEN batteri" i sin danske advarsel',
      original.includes('UDEN batteri'), 'strengen "UDEN batteri" findes ikke i kildefilen');
    const patched = original.replace(
      '    advarsel_klasse: "gyldighed"',
      '    advarsel_klasse: "gyldighed"\n    advarsel_i18n:\n      en: "The manufacturer states Weight (without battery) 21.5kg +/-1kg. '
        + 'The weight is WITHOUT the battery."',
    );
    ok('grundlag: advarsel_i18n blev faktisk indsat i kopien (patch-strengen matchede)', patched !== original);
    fs.writeFileSync(aliengoFil, patched, 'utf8');

    const udMappe = path.join(tmp, 'dist-60');
    fs.rmSync(udMappe, { recursive: true, force: true });
    const byg = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--data=${dataMappe}`, `--ud=${udMappe}`],
      { cwd: rod, encoding: 'utf8' });
    ok('byg af den patchede scratch-mappe giver exit 0', byg.status === 0, (byg.stdout || '') + (byg.stderr || ''));

    const enSti = path.join(udMappe, 'en', 'robotter', 'unitree-aliengo', 'index.html');
    const daSti = path.join(udMappe, 'da', 'robotter', 'unitree-aliengo', 'index.html');
    const enSide = fs.existsSync(enSti) ? fs.readFileSync(enSti, 'utf8') : '';
    const daSide = fs.existsSync(daSti) ? fs.readFileSync(daSti, 'utf8') : '';
    const taelForekomster = (s, m) => (s.match(new RegExp(m, 'g')) || []).length;
    ok('/en/robotter/unitree-aliengo/ viser IKKE "UDEN batteri" (den engelske oversaettelse traadte i stedet)',
      taelForekomster(enSide, 'UDEN batteri') === 0, `fik ${taelForekomster(enSide, 'UDEN batteri')}`);
    ok('/en/robotter/unitree-aliengo/ viser den engelske oversaettelse ("WITHOUT the battery") mindst én gang',
      taelForekomster(enSide, 'WITHOUT the battery') >= 1, `fik ${taelForekomster(enSide, 'WITHOUT the battery')}`);
    ok('/da/robotter/unitree-aliengo/ viser stadig "UDEN batteri" UAENDRET (den danske kilde er urort)',
      taelForekomster(daSide, 'UDEN batteri') === 2, `fik ${taelForekomster(daSide, 'UDEN batteri')}`);
  }

  console.log('  4. Begge db-veje: eksporter.mjs (LOCAL + --fra-db, simulerede raekker), skema.sql + migrering-i18n.sql');
  {
    const eksporter = await import(`file://${path.join(rod, 'db/eksporter.mjs').replace(/\\/g, '/')}`);

    // 4a. LOCAL-vejen: byggFeltpostVaerdi/byggRobotDoc bevarer alle tre nye
    // felter fra en kanonisk-formet post/robot til YAML-formen.
    const feltpost = {
      form: 'tal', vaerdi_tal: 60, enhed: 'kg', kilde: 'https://example.com/sentinel60', hentet: '2026-09-02',
      advarsel: 'sentinel-advarsel-60', advarsel_i18n: { en: 'sentinel-i18n-60' },
    };
    const kort = eksporter.byggFeltpostVaerdi(feltpost);
    ok('byggFeltpostVaerdi bevarer advarsel_i18n',
      JSON.stringify(kort.advarsel_i18n) === JSON.stringify({ en: 'sentinel-i18n-60' }), JSON.stringify(kort));

    const robotKanonisk = {
      slug: 'sentinel-60', navn: 'Sentinel', producent: 'X', producentland: 'Kina', status: 'i_produktion', fremdrift: 'ben',
      felter: Object.fromEntries(skema.FELTNAVNE.map((n) => [n, { form: 'bare_tilstand', tilstand: 'ikke_oplyst' }])),
      anvendelse: {
        er_bar_streng: false, er_ikke_oplyst: false, vaerdi: 'industri', citat: 'Et citat.',
        kilde: 'https://example.com/a', hentet: '2026-09-02',
        note: 'sentinel-note-60', note_i18n: { en: 'sentinel-note-i18n-60' },
      },
      billede: {
        fil: 'silhuetter/_proeve-kaede.svg', ophav: 'silhuet', kilde: 'https://example.com/a', hentet: '2026-09-02',
        note: 'sentinel-billednote-60', note_i18n: { en: 'sentinel-billednote-i18n-60' },
      },
    };
    const doc = eksporter.byggRobotDoc(robotKanonisk);
    ok('byggRobotDoc bevarer anvendelse.note_i18n',
      JSON.stringify(doc.anvendelse?.note_i18n) === JSON.stringify({ en: 'sentinel-note-i18n-60' }), JSON.stringify(doc.anvendelse));
    ok('byggRobotDoc bevarer billede.note_i18n',
      JSON.stringify(doc.billede?.note_i18n) === JSON.stringify({ en: 'sentinel-billednote-i18n-60' }), JSON.stringify(doc.billede));

    // 4b. --fra-db-vejen: omdanFeltpostFraDb/omdanRobotFraDb bevarer alle tre
    // fra en SIMULERET DB-raekke (ingen fetch, ingen .env kraevet).
    const raaFeltpost = {
      form: 'tal', tilstand: null, vaerdi_tal: 60, min: null, maks: null,
      vaerdi_tekst: null, vaerdi_bool: null, vaerdi_liste: null, enhed: 'kg', enhed_imperial: null,
      vaerdi_imperial: null, operator: null, kilde: 'https://example.com/db60', hentet: '2026-09-02',
      kildetype: null, advarsel: 'db-advarsel-60', advarsel_klasse: null, advarsel_ordlyd: null,
      advarsel_i18n: { en: 'db-i18n-60' }, note: null, raa: null, valuta: null,
      ved_last_tilstand: null, ved_last_vaerdi: null, ved_last_enhed: null,
    };
    const udFraDb = eksporter.omdanFeltpostFraDb(raaFeltpost);
    ok('omdanFeltpostFraDb bevarer advarsel_i18n fra en simuleret DB-raekke',
      JSON.stringify(udFraDb.advarsel_i18n) === JSON.stringify({ en: 'db-i18n-60' }), JSON.stringify(udFraDb));

    const raaRaekke = {
      slug: 'sentinel-fradb-60', navn: 'Sentinel', producent: 'X', producentland: 'Kina', producentby: null,
      status: 'i_produktion', fremdrift: 'ben', foerste_udgivelse: null, forgaenger_robot_id: null,
      varianter: null, noter: null, noter_ordlyd: null,
      feltposter: skema.FELTNAVNE.map((feltnavn) => ({
        feltnavn, form: 'bare_tilstand', tilstand: 'ikke_oplyst',
        vaerdi_tal: null, min: null, maks: null, vaerdi_tekst: null, vaerdi_bool: null, vaerdi_liste: null,
        enhed: null, enhed_imperial: null, vaerdi_imperial: null, operator: null, kilde: null, hentet: null,
        kildetype: null, advarsel: null, advarsel_klasse: null, advarsel_ordlyd: null, advarsel_i18n: null,
        note: null, raa: null, valuta: null, ved_last_tilstand: null, ved_last_vaerdi: null, ved_last_enhed: null,
        feltpost_varianter: [],
      })),
      anvendelse: {
        er_bar_streng: false, er_ikke_oplyst: false, vaerdi: 'industri', citat: 'Et citat.',
        citat_ordlyd: null, kilde: 'https://example.com/a', hentet: '2026-09-02', kildetype: null,
        arvet_fra_robot_id: null, note: 'db-anv-note-60', note_ordlyd: null, note_i18n: { en: 'db-anv-i18n-60' },
      },
      billede: {
        fil: 'silhuetter/_proeve-kaede.svg', ophav: 'silhuet', kilde: 'https://example.com/a', hentet: '2026-09-02',
        alt: null, note: 'db-bil-note-60', note_i18n: { en: 'db-bil-i18n-60' },
        delt_med_robot_id: null, plade: null, pos: null,
      },
    };
    const udRobot = eksporter.omdanRobotFraDb(raaRaekke, new Map());
    ok('omdanRobotFraDb bevarer anvendelse.note_i18n fra en simuleret DB-raekke',
      JSON.stringify(udRobot.anvendelse?.note_i18n) === JSON.stringify({ en: 'db-anv-i18n-60' }), JSON.stringify(udRobot.anvendelse));
    ok('omdanRobotFraDb bevarer billede.note_i18n fra en simuleret DB-raekke',
      JSON.stringify(udRobot.billede?.note_i18n) === JSON.stringify({ en: 'db-bil-i18n-60' }), JSON.stringify(udRobot.billede));

    // 4c. Struktur: db/skema.sql definerer alle tre kolonner + deres tre
    // formkrav som CHECK, og db/migrering-i18n.sql tilfoejer dem idempotent.
    const skemaSql = fs.readFileSync(path.join(rod, 'db/skema.sql'), 'utf8');
    ok('db/skema.sql definerer feltposter.advarsel_i18n (jsonb)', /advarsel_i18n\s+jsonb/.test(skemaSql));
    ok('db/skema.sql definerer anvendelse.note_i18n (jsonb)',
      /create table anvendelse[\s\S]{0,5000}?note_i18n\s+jsonb/.test(skemaSql));
    ok('db/skema.sql definerer billede.note_i18n (jsonb)',
      /create table billede[\s\S]{0,5000}?note_i18n\s+jsonb/.test(skemaSql));
    const i18nConstraints = skemaSql.match(/constraint \w+_i18n_(form|kraever_\w+|ikke_kildesprog) check/g) || [];
    ok('db/skema.sql har praecis 9 i18n-CHECKs (3 kolonner x form/kraever/ikke-kildesprog)',
      i18nConstraints.length === 9, `fik ${i18nConstraints.length}: ${i18nConstraints.join(' | ')}`);

    const migSql = fs.readFileSync(path.join(rod, 'db/migrering-i18n.sql'), 'utf8');
    ok('migrering-i18n.sql tilfoejer feltposter.advarsel_i18n (IF NOT EXISTS, idempotent)',
      /add column if not exists advarsel_i18n jsonb/.test(migSql));
    ok('migrering-i18n.sql tilfoejer BEGGE note_i18n-kolonner (anvendelse + billede, IF NOT EXISTS)',
      (migSql.match(/add column if not exists note_i18n jsonb/g) || []).length === 2);
    ok('migrering-i18n.sql vagter alle 9 ADD CONSTRAINT mod pg_constraint (kan koeres to gange)',
      (migSql.match(/select 1 from pg_constraint where conname/g) || []).length === 9);
  }

  console.log('  5. KENDT GRAENSE (IKKE dette spors filejerskab): db/migrer.mjs kender endnu ikke de nye noegler');
  {
    const migrer = await import(`file://${path.join(rod, 'db/migrer.mjs').replace(/\\/g, '/')}`);
    ok('FELTPOST_NOEGLER_KENDT (VAGT 2) kender IKKE advarsel_i18n endnu — db/migrer.mjs staar UDEN FOR '
      + 'BRIEF-i18nfelt.md\'s filejerskab. Denne assertion DOKUMENTERER graensen (CLAUDE.md: "ret assertions, '
      + 'slet dem ikke") — vend den om den dag et senere spor opdaterer FELTPOST_NOEGLER_KENDT',
      !migrer.FELTPOST_NOEGLER_KENDT.has('advarsel_i18n'));
  }
}
