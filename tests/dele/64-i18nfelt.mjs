/**
 * tests/dele/64-i18nfelt.mjs — spor/i18ntest, 2. sep 2026 (genskabt daekning).
 *
 * spor/skema slettede tests/dele/60-i18nfelt.mjs (247 linjer, 24 ok-kald) i
 * commit 906a966 med begrundelsen "mekanismer der ophoerer". Det var kun
 * rigtigt for den gamle fils punkt 4-5 — punkt 1-3 tester tools/validate.mjs
 * og tools/build.mjs, som LEVER (advarsel_i18n/note_i18n staar stadig i
 * POST_NOEGLER/ANVENDELSE_NOEGLER/BILLEDE_NOEGLER, R22 findes stadig, og
 * build.mjs's sprogoploesRobotter() findes stadig). Denne fil genskaber
 * DEM tre og udelader resten:
 *
 *   1. advarsel_i18n/note_i18n er KENDTE NOEGLER for validatoren: en gyldig
 *      post giver 0 fejl, hvor den ellers gav R11 "ukendt noegle".
 *   2. R22: fem bevidst OEDELAGTE tilfaelde (ét pr. krav) giver praecis den
 *      fejl, og de gyldige former (advarsel_i18n samt note_i18n paa
 *      anvendelse OG billede) passerer.
 *   3. build.mjs vaelger tekst efter sprog ÉT sted: i en EKSPORT af
 *      databasen (scratch-mappe i ctx.tmp, ALDRIG databasen selv) patches
 *      unitree-aliengo.yaml med en advarsel_i18n; bygget af kopien viser
 *      "WITHOUT the battery" paa /en/robotter/unitree-aliengo/ og IKKE
 *      "UDEN batteri", mens /da/ stadig viser "UDEN batteri".
 *
 * UDELADT — den gamle fils punkt 4 og 5, efterproevet paa denne gren 2. sep
 * 2026: db/migrer.mjs findes ikke laengere (punkt 5's FELTPOST_NOEGLER_KENDT-
 * graense er der ikke noget at teste). db/skema.sql har nul forekomster af
 * "i18n" (AA125: databasen blev det engelske skema uden i18n-kolonner), og
 * db/migrering-i18n.sql er slettet — punkt 4's skema-/migreringspaastande om
 * de tre i18n-kolonner er derfor ikke laengere sande og genskabes IKKE.
 *
 * Dette spor oversaetter INGENTING — testene her bruger derfor udelukkende
 * syntetiske fixtures i ctx.tmp, ALDRIG de rigtige robotdata, bortset fra
 * punkt 3's build, som EKSPORTERER (aldrig redigerer databasen) til en
 * scratch-mappe foer den patches der.
 *
 * AA183/L84 (4. sep 2026): data/robots/ er slettet. Punkt 3 kopierede foer
 * filer derfra til scratch-mappen; det kan den ikke laengere. Den bruger nu
 * db/eksporter.mjs --fra-db --ud=<scratch> (samme mekanisme db/tjek.mjs's
 * eget trin 1 bruger) i stedet for ctx.hentRobotter() - den proces-krydsende
 * cache (fund/BRIEF-dbcache.md punkt 1) sidder i db/hent.mjs's
 * hentRobotter()-ombygning af fraDb(), ikke i db/eksporter.mjs's egen
 * fraDb(), og naas derfor ikke af et subprocess-kald uanset hvilken vej der
 * vaelges. Desuden findes der ingen objekt->YAML-serialiserer uden for
 * db/eksporter.mjs's skrivRobotYaml(), som kraever byggRobotDoc()'s RAA
 * Supabase-raekkeform - ikke hentRobotter()s allerede-genparsede dokumenter
 * - saa at genbruge exportvejen direkte er den enklere, afproevede vej.
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
  const {
    rod, tmp, node, ok, koerValidator,
  } = ctx;

  console.log('\n64. spor/i18ntest — advarsel_i18n/note_i18n: genskabt daekning (punkt 1-3 af den slettede 60-i18nfelt.mjs)');

  console.log('  1. advarsel_i18n er en kendt noegle — en gyldig post giver 0 fejl');
  {
    const indhold = `${HOVED.replace('NAVN', 'sag-64-kendt-noegle')
    }felter:\n  egenvaegt:\n    vaerdi: 60\n    enhed: kg\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`
      + `    advarsel: "Dansk forbehold."\n    advarsel_i18n:\n      en: "English caveat."\n`;
    const fil = path.join(tmp, 'sag-64-kendt-noegle.yaml');
    fs.writeFileSync(fil, indhold, 'utf8');
    const r = koerValidator([fil]);
    ok('64.1: advarsel_i18n paa en feltpost giver 0 fejl (R11 kender noeglen)', r.kode === 0, r.ud.trim());
  }

  console.log('  2. R22 — fem bevidst oedelagte former, plus de gyldige (advarsel_i18n + note_i18n x2)');
  const basisFelter = `felter:\n  egenvaegt:\n    vaerdi: 60\n    enhed: kg\n`
    + `    kilde: https://example.com/a\n    hentet: 2026-08-19\n    advarsel: "Dansk forbehold."\n`;
  const oedelagte = [
    ['advarsel_i18n er ikke et sprogkort (bar streng)',
      `${HOVED.replace('NAVN', 'sag-64-ikke-kort')}${basisFelter}    advarsel_i18n: "ikke et kort"\n`],
    ['advarsel_i18n med et sprog uden for SPROG ("fr")',
      `${HOVED.replace('NAVN', 'sag-64-ukendt-sprog')}${basisFelter}    advarsel_i18n:\n      fr: "Texte francais."\n`],
    ['advarsel_i18n med kildesproget "da" som noegle',
      `${HOVED.replace('NAVN', 'sag-64-kildesprog')}${basisFelter}    advarsel_i18n:\n      da: "Dansk igen."\n`],
    ['advarsel_i18n uden advarsel',
      `${HOVED.replace('NAVN', 'sag-64-uden-advarsel')
      }felter:\n  egenvaegt:\n    vaerdi: 60\n    enhed: kg\n    kilde: https://example.com/a\n`
        + `    hentet: 2026-08-19\n    advarsel_i18n:\n      en: "Only translation, no source."\n`],
    ['advarsel_i18n med internt sprog i den oversatte tekst',
      `${HOVED.replace('NAVN', 'sag-64-internt-sprog')}${basisFelter
      }    advarsel_i18n:\n      en: "See egenvaegt.yaml for details."\n`],
  ];
  for (const [navn, indhold] of oedelagte) {
    const fil = path.join(tmp, `${navn.replace(/[^a-z0-9]+/gi, '-')}.yaml`);
    fs.writeFileSync(fil, indhold, 'utf8');
    const r = koerValidator([fil]);
    ok(`64.2: ${navn}  ->  R22`, r.kode === 1 && /\bR22:/.test(r.ud),
      r.kode !== 1 ? `exit ${r.kode}, forventede 1 — ${r.ud.trim().slice(0, 200)}` : `ingen R22 i udskriften: ${r.ud.trim().slice(0, 200)}`);
  }

  {
    const gyldig = `${HOVED.replace('NAVN', 'sag-64-gyldig')
    }anvendelse:\n  vaerdi: industri\n  citat: "Robot - Industry"\n  kilde: https://example.com/a\n`
      + `  hentet: 2026-08-19\n  note: "Dansk begrundelse."\n  note_i18n:\n    en: "English rationale."\n`
      + `billede:\n  fil: silhuetter/_proeve-kaede.svg\n  ophav: silhuet\n  kilde: https://example.com/a\n`
      + `  hentet: 2026-08-19\n  note: "Dansk billednote."\n  note_i18n:\n    en: "English image note."\n`
      + `${basisFelter}    advarsel_i18n:\n      en: "English caveat."\n`;
    const fil = path.join(tmp, 'sag-64-gyldig.yaml');
    fs.writeFileSync(fil, gyldig, 'utf8');
    const r = koerValidator([fil]);
    ok('64.2: advarsel_i18n + anvendelse.note_i18n + billede.note_i18n, alle gyldigt formet, giver 0 fejl',
      r.kode === 0, r.ud.trim());
  }

  console.log('  3. build.mjs vaelger tekst efter sprog ÉT sted — "UDEN batteri" forsvinder fra /en/, forbliver paa /da/');
  {
    const dataMappe = path.join(tmp, 'proeve-data-64');
    fs.rmSync(dataMappe, { recursive: true, force: true });
    // AA183/L84: data/robots/ er slettet - se filhovedets note. Scratch-
    // mappen fyldes nu ved at eksportere databasen, ikke ved at kopiere filer.
    const eksport = spawnSync(node, [path.join(rod, 'db', 'eksporter.mjs'), '--fra-db', `--ud=${dataMappe}`],
      { cwd: rod, encoding: 'utf8' });
    ok('64.3: grundlag — db/eksporter.mjs --fra-db skrev scratch-mappen (exit 0)',
      eksport.status === 0, (eksport.stdout || '') + (eksport.stderr || ''));
    const kildeFiler = fs.existsSync(dataMappe)
      ? fs.readdirSync(dataMappe).filter((f) => /\.ya?ml$/.test(f)) : [];
    ok('64.3: grundlag — 77 robotfiler eksporteret til scratch-mappen (KOPI, databasen er ikke roert)',
      kildeFiler.length === 77, `fik ${kildeFiler.length}`);

    const aliengoFil = path.join(dataMappe, 'unitree-aliengo.yaml');
    const original = fs.readFileSync(aliengoFil, 'utf8');
    ok('64.3: grundlag — unitree-aliengo.yaml (kopien) baerer "UDEN batteri" i sin danske advarsel',
      original.includes('UDEN batteri'), 'strengen "UDEN batteri" findes ikke i kildefilen');
    const patched = original.replace(
      '    advarsel_klasse: "gyldighed"',
      '    advarsel_klasse: "gyldighed"\n    advarsel_i18n:\n      en: "The manufacturer states Weight (without battery) 21.5kg +/-1kg. '
        + 'The weight is WITHOUT the battery."',
    );
    ok('64.3: grundlag — advarsel_i18n blev faktisk indsat i kopien (patch-strengen matchede)', patched !== original);
    fs.writeFileSync(aliengoFil, patched, 'utf8');

    const udMappe = path.join(tmp, 'dist-64');
    fs.rmSync(udMappe, { recursive: true, force: true });
    const byg = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--data=${dataMappe}`, `--ud=${udMappe}`],
      { cwd: rod, encoding: 'utf8' });
    ok('64.3: byg af den patchede scratch-mappe giver exit 0', byg.status === 0, (byg.stdout || '') + (byg.stderr || ''));

    const enSti = path.join(udMappe, 'en', 'robotter', 'unitree-aliengo', 'index.html');
    const daSti = path.join(udMappe, 'da', 'robotter', 'unitree-aliengo', 'index.html');
    const enSide = fs.existsSync(enSti) ? fs.readFileSync(enSti, 'utf8') : '';
    const daSide = fs.existsSync(daSti) ? fs.readFileSync(daSti, 'utf8') : '';
    const taelForekomster = (s, m) => (s.match(new RegExp(m, 'g')) || []).length;
    ok('64.3: /en/robotter/unitree-aliengo/ viser IKKE "UDEN batteri" (den engelske oversaettelse traadte i stedet)',
      taelForekomster(enSide, 'UDEN batteri') === 0, `fik ${taelForekomster(enSide, 'UDEN batteri')}`);
    ok('64.3: /en/robotter/unitree-aliengo/ viser den engelske oversaettelse ("WITHOUT the battery") mindst én gang',
      taelForekomster(enSide, 'WITHOUT the battery') >= 1, `fik ${taelForekomster(enSide, 'WITHOUT the battery')}`);
    ok('64.3: /da/robotter/unitree-aliengo/ viser stadig "UDEN batteri" UAENDRET (den danske kilde er urort)',
      taelForekomster(daSide, 'UDEN batteri') === 2, `fik ${taelForekomster(daSide, 'UDEN batteri')}`);
  }
}
