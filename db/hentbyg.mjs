#!/usr/bin/env node
/**
 * db/hentbyg.mjs — JPK's ét-kommando-vej: hent Studio-rettelser hjem, commit, byg.
 *
 * Pakker DATAFLOW.md's diagram 2 (eksportér -> commit -> byg) ind i ÉN kommando,
 * saa JPK's vedligeholdelsesrutine bliver: ret et tal i Supabase Studio -> koer
 * denne kommando -> genindlaes browseren. Koerer de eksisterende trin som
 * SUBPROCESSER (samme binaerer, samme kode via process.execPath) og
 * genimplementerer intet af deres logik:
 *
 *   1. node db/eksporter.mjs --fra-db --ud=data/robots
 *        Validerer sig selv (midlertidig mappe + tools/validate.mjs) og
 *        naegter at flytte filerne ved fejl — se db/eksporter.mjs's egen
 *        "VAGTEN"-kommentar og db/LAESMIG.md. Fejler den, stopper hentbyg her.
 *   2. git status --porcelain data/robots
 *        Er der overhovedet noget nyt at hente hjem? Tom -> exit 0, intet rørt.
 *   3. git diff --stat data/robots
 *        Viser kort, hvad der kom hjem.
 *   4. git commit -F <midlertidig fil> -- data/robots
 *        Besked skrevet til fil, IKKE paa kommandolinjen (PowerShell 5.1's
 *        anfoerselstegn-faelde, jf. CLAUDE.md). Pathspec'et betyder, at kun
 *        data/robots committes, uanset hvad der maatte staa staged i forvejen.
 *   5. node tools/build.mjs
 *        Kendt faelde: en aaben server eller editor laaser dist/ (EPERM).
 *        Fanges saerskilt, saa JPK ved, at trin 1-4 ALLEREDE lykkedes.
 *
 * FLAG:
 *   node db/hentbyg.mjs                 alle fem trin
 *   node db/hentbyg.mjs --uden-commit   stopper efter trin 3 (test / se an)
 *   node db/hentbyg.mjs --uden-byg      springer trin 5 over (commit koerer)
 *
 * Nul afhaengigheder. Samme "process.execPath til subprocesser"-stil som
 * resten af db/ (se fx db/eksporter.mjs's koerValidator).
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function koerGit(argv) {
  return execFileSync('git', argv, { cwd: ROD, encoding: 'utf8' });
}

/** Traekker filstierne ud af `git status --porcelain`-udskriften. Porcelain
 *  v1-formatet er "XY <sti>" — to statustegn plus ét mellemrum, saa slice(3)
 *  rammer starten af stien for almindelige aendrede/tilfoejede/slettede filer
 *  (den eneste form, data/robots/*.yaml kan optraede i her: eksporter.mjs
 *  skriver/rydder kun *.yaml, aldrig en git-rename). */
function filerFraStatus(status) {
  return status.trim().split(/\r?\n/).map((l) => l.slice(3).trim()).filter(Boolean);
}

async function main(argv) {
  const flag = new Set(argv);
  const udenCommit = flag.has('--uden-commit');
  const udenByg = flag.has('--uden-byg');

  // 1. Eksport fra DB -> data/robots.
  let eksportUdskrift;
  try {
    eksportUdskrift = execFileSync(process.execPath,
      ['db/eksporter.mjs', '--fra-db', '--ud=data/robots'],
      { cwd: ROD, encoding: 'utf8' });
  } catch (e) {
    const udskrift = (e.stdout ?? '') + (e.stderr ?? '');
    process.stdout.write(udskrift);
    console.error('\nHENTBYG STOPPET: db/eksporter.mjs fejlede (se udskrift ovenfor). Intet committet, intet bygget.');
    return 1;
  }
  process.stdout.write(eksportUdskrift);

  // 2. Er der overhovedet noget nyt at hente hjem?
  const status = koerGit(['status', '--porcelain', 'data/robots']);
  if (status.trim() === '') {
    console.log('Ingen aendringer i Studio siden sidst — intet at hente.');
    return 0;
  }

  // 3. Vis diffen kort, saa JPK ser hvad der kom hjem.
  const diffStat = koerGit(['diff', '--stat', 'data/robots']);
  process.stdout.write(diffStat);

  if (udenCommit) {
    console.log('(--uden-commit: stopper her. Intet committet, intet bygget.)');
    return 0;
  }

  // 4. Commit. Besked skrevet til fil + git commit -F -- data/robots (kun
  // denne sti committes, uanset hvad der ellers maatte staa staged).
  const iDag = new Date().toISOString().slice(0, 10);
  const aendredeFiler = filerFraStatus(status);
  const beskedFil = path.join(ROD, `.hentbyg-commit-msg-${process.pid}.txt`);
  const besked = `Studio-rettelser hentet hjem ${iDag}\n\n${aendredeFiler.map((f) => `- ${f}`).join('\n')}\n`;
  fs.writeFileSync(beskedFil, besked, 'utf8');
  try {
    koerGit(['commit', '-F', beskedFil, '--', 'data/robots']);
  } finally {
    fs.rmSync(beskedFil, { force: true });
  }
  console.log('Committet.');

  if (udenByg) {
    console.log('(--uden-byg: springer byg over.)');
    return 0;
  }

  // 5. Byg. EPERM (dist/ laast af server/editor) er en kendt faelde — fang
  // den saerskilt, og goer det tydeligt at trin 1-4 ALLEREDE er lykkedes.
  try {
    const bygUdskrift = execFileSync(process.execPath, ['tools/build.mjs'], { cwd: ROD, encoding: 'utf8' });
    process.stdout.write(bygUdskrift);
  } catch (e) {
    const udskrift = (e.stdout ?? '') + (e.stderr ?? '');
    process.stdout.write(udskrift);
    if (/EPERM/.test(udskrift)) {
      console.error("\nBYG FEJLEDE: dist/ er laast af et andet program (server eller editor). Luk det og koer 'node tools/build.mjs' igen — dine data ER hentet og committet.");
    } else {
      console.error('\nBYG FEJLEDE — se udskrift ovenfor. Dine data ER hentet og committet.');
    }
    return 1;
  }

  return 0;
}

const erHoved = process.argv[1] && path.resolve(process.argv[1]).endsWith('hentbyg.mjs');
if (erHoved) {
  main(process.argv.slice(2)).then((k) => process.exit(k)).catch((e) => {
    console.error(String(e && e.stack ? e.stack : e));
    process.exit(1);
  });
}

export { main, filerFraStatus };
