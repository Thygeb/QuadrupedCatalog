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
 *   node db/hentbyg.mjs --alligevel     omgaar VAeRNET (se nedenfor) — kraever
 *                                       OGSAa --uden-commit, se VAeRNETs kommentar
 *
 * VAeRNET (spor/f2-vaern, fund/BRIEF-f2-vaern.md, Fare 1): fase 2 oversaetter
 * lige nu databasen fra dansk til engelsk (STATUS.md Å132/Å134). Foer trin 1
 * (eksporten) maa koere, maaler hentbyg om databasen stadig baerer dansk tekst
 * — genbruger db/fase2-tjek.mjs's --dansk-instrument (hentRobotter + danskAlle,
 * IMPORTERET, ikke genskrevet, D7/L30-laerdommen) paa 'caveat'-kolonnen, samme
 * tal STATUS.md selv citerer ("N af M advarsler er stadig danske"). Er tallet
 * > 0, NAeGTER hentbyg at fortsaette — uden vaernet ville trin 1 skrive 77
 * halvt engelske filer ned i data/robots/ SOM OM de var den danske kanoniske
 * form, og trin 4 ville committe dem.
 *
 * --alligevel omgaar vaernet, men KRAeVER ogsaa --uden-commit (den ene
 * beslutning briefet overlod til sporet — se fund/FUND-f2vaern.md for
 * begrundelsen): en overstyring af maalingen maa ALDRIG ogsaa tillade et
 * automatisk commit af halvt oversat data. Vil du se, hvad eksporten giver i
 * dag uden vaernet, koer "--alligevel --uden-commit"; et rigtigt commit af
 * halvt oversat data er IKKE noget denne ét-kommando-vej goer for dig — det
 * kraever et bevidst, manuelt skridt uden om hentbyg.
 *
 * Kan vaernet ikke maale (fx mangler .env), STOPPER hentbyg med en forklaring
 * — det maaler IKKE som "0 dansk" ved en fejl. Et vaern, der springer sig selv
 * over, naar det ikke kan maale, er vaerre end intet vaern.
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

/* --------------------------------------------------------- VAeRNET (Fare 1) */

/** Ren beslutningsfunktion — ingen filsystem, intet netvaerk. Givet
 *  'caveat'-kolonnens {iAlt, dansk} (samme facon db/fase2-tjek.mjs's
 *  danskAlle() giver pr. kolonne), afgoer den om vaernet blokerer. KUN
 *  dansk > 0 blokerer — er databasen ren, koerer hentbyg som foer (briefets
 *  krav 4: "maa ikke koste noget, naar databasen er ren"). */
export function vaernTilstand({ iAlt, dansk }) {
  return dansk > 0 ? { blokeret: true, iAlt, dansk } : { blokeret: false };
}

/** Beskeden vaernet viser, NAeR tallet — ikke bare "nej" (briefets krav 1). */
export function vaernBesked({ iAlt, dansk }) {
  return `HENTBYG STOPPET: ${dansk} af ${iAlt} advarsler i databasen er stadig danske. `
    + 'Fase 2 er ikke faerdig, og en eksport nu ville committe halvt oversat YAML.\n'
    + 'Koer med --alligevel for at se eksporten alligevel — --alligevel kraever OGSAa '
    + '--uden-commit, saa en halvt oversat eksport aldrig committes automatisk '
    + '(se filens toptekst for begrundelsen).';
}

/**
 * Kernen af vaernet, dependency-injiceret for testbarhed (tests/dele/71 kører
 * UDEN databaseadgang, jf. tests/LAESMIG.md): `hentDanskCaveatTal` er en
 * async funktion uden argumenter, der giver {iAlt, dansk} eller KASTER. I
 * produktion er den hentDanskCaveatTalLive nedenfor (rigtig DB-maaling); i
 * testen er den en fixture/stub, saa testen aldrig rører netvaerket.
 *
 * Returnerer altid {blokeret, besked?} — kaster aldrig selv (kaldstedet
 * afgoer, om en blokering betyder "skriv beskeden og returnér 1").
 */
export async function koerVaern(flag, hentDanskCaveatTal) {
  const alligevel = flag.has('--alligevel');
  const udenCommit = flag.has('--uden-commit');

  // --alligevel UDEN --uden-commit ville tillade et automatisk commit af
  // halvt oversat data — det er netop den fare, vaernet findes for at lukke.
  // Denne kontrol er REN flag-logik (intet netvaerk), saa den koster intet,
  // uanset databasens tilstand.
  if (alligevel && !udenCommit) {
    return {
      blokeret: true,
      besked: 'HENTBYG STOPPET: --alligevel kraever OGSAa --uden-commit. '
        + 'En overstyring af sprogvaernet maa ikke ogsaa committe halvt oversat '
        + 'data automatisk — koer "node db/hentbyg.mjs --alligevel --uden-commit" '
        + 'for at se eksporten uden at committe, eller vent til fase 2 er faerdig.',
    };
  }
  if (alligevel) return { blokeret: false };

  let tal;
  try {
    tal = await hentDanskCaveatTal();
  } catch (e) {
    // Ingen .env / maalingen fejlede -> STOP. Et vaern, der springer sig selv
    // over, naar det ikke kan maale, er vaerre end intet vaern (briefets krav 5).
    return {
      blokeret: true,
      besked: 'HENTBYG STOPPET: vaernet kunne ikke maale, om databasen stadig '
        + `baerer dansk tekst (${e && e.message ? e.message : e}). Ingen maaling `
        + '-> ingen tavs succes. Ret .env, eller koer med --alligevel --uden-commit, '
        + 'hvis du bevidst vil springe vaernet over.',
    };
  }

  const tilstand = vaernTilstand(tal);
  if (tilstand.blokeret) return { blokeret: true, besked: vaernBesked(tal) };
  return { blokeret: false };
}

/** Den RIGTIGE maaling — importerer db/fase2-tjek.mjs's hentRobotter/
 *  danskAlle (IMPORTERET, ikke genskrevet, D7/L30-laerdommen; samme
 *  "importer fra den fil" -moenster som db/eksporter.mjs's traekValidateTal)
 *  og laeser 'caveat'-kolonnens {iAlt, dansk} ud — samme tal STATUS.md selv
 *  citerer under fase 2 ("N af M advarsler er stadig danske"). */
export async function hentDanskCaveatTalLive() {
  const mod = await import(`file://${path.join(ROD, 'db/fase2-tjek.mjs')}`);
  const robotter = await mod.hentRobotter();
  const resultater = mod.danskAlle(robotter);
  const caveat = resultater.find((r) => r.navn === 'caveat');
  if (!caveat) {
    throw new Error('db/fase2-tjek.mjs\'s danskAlle() indeholder ikke en "caveat"-kolonne'
      + ' — uventet skema-aendring, undersoeg foer vaernet stoles paa.');
  }
  return { iAlt: caveat.iAlt, dansk: caveat.dansk };
}

async function main(argv) {
  const flag = new Set(argv);
  const udenCommit = flag.has('--uden-commit');
  const udenByg = flag.has('--uden-byg');

  const vaernResultat = await koerVaern(flag, hentDanskCaveatTalLive);
  if (vaernResultat.blokeret) {
    console.error(vaernResultat.besked);
    return 1;
  }

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
  // VAeRNET ovenfor importerer db/fase2-tjek.mjs, som kalder et AeGTE fetch()
  // I DENNE PROCES (til forskel fra trin 1/5's execFileSync-subprocesser,
  // hvor fetch sker i et BARN) — samme exit-127-fare som db/eksporter.mjs,
  // db/billeder.mjs og fund/maal-f2.mjs (spor/f2-vaern punkt 2, STATUS.md
  // Å132). Fandtes ikke her, foer vaernet blev tilfoejet — rettet defensivt
  // med det samme, saa punkt 1 ikke selv indfoerer faren, punkt 2 lukker.
  main(process.argv.slice(2)).then((k) => { process.exitCode = k; }).catch((e) => {
    console.error(String(e && e.stack ? e.stack : e));
    process.exitCode = 1;
  });
}

export { main, filerFraStatus };
