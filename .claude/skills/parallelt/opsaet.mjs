#!/usr/bin/env node
/**
 * opsaet.mjs — worktree-opsaetning og -lukning i én kommando.
 *
 * Bygget 1. sep 2026 efter en dag med 21 flettede spor. Opsaetningen var indtil
 * da et manuelt ritual paa fem trin, og TRE spor doede eller maalte forkert,
 * fordi ét af trinene blev glemt:
 *
 *   1. git worktree add ... -b spor/<navn>
 *   2. kopiér de GITIGNOREREDE filer ind   <- glemt tre gange
 *   3. tilfoej til .claude/settings.json
 *   4. tildel en port, ingen andre bruger   <- to porte fik to processer
 *   5. tildel et testnummer, ingen andre bruger  <- fire kollisioner paa én dag
 *
 * Trin 2 er det dyreste: assets/fotos/fabrikant/ foelger ikke med en gren, og
 * uden billederne giver validate.mjs 76 fejl, som INTET har med sporets arbejde
 * at goere. To spor brugte en runde paa at finde ud af det.
 *
 * Trin 5 kan ikke loeses af sporet selv, og det er pointen: en worktree ser
 * tests/dele/ som mappen saa ud, da grenen blev lavet. Den kan hverken se
 * samtidige spors numre eller dem, der er kommet paa main siden. Dette script
 * scanner ALLE worktrees og hovedrepoet under ét - den eneste vinkel, hvorfra
 * "naeste ledige" er et opslag frem for et gaet.
 *
 * BRUG
 *   node .claude/skills/parallelt/opsaet.mjs <navn> [--medie] [--env]
 *   node .claude/skills/parallelt/opsaet.mjs --ryd <navn> [--tvang]
 *   node .claude/skills/parallelt/opsaet.mjs --status
 *
 * Koeres ALTID fra hovedrepoets rod.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROD = process.cwd();
const FORAELDER = path.dirname(ROD);
const PORT_BASIS = 8140;

/* Gitignorerede stier, en worktree kan have brug for. `noedvendig` betyder, at
   validate.mjs fejler uden den - de oevrige kopieres kun paa forlangende, fordi
   media/ alene er 562 MB og disken er en maalt begraensning (se CLAUDE.md). */
const GITIGNORERET = [
  { sti: 'assets/fotos/fabrikant', noedvendig: true, flag: null },
  { sti: '.env', noedvendig: false, flag: '--env' },
  { sti: 'media', noedvendig: false, flag: '--medie' },
];

const git = (...a) => execFileSync('git', a, { cwd: ROD, encoding: 'utf8' }).trim();

/** Alle worktrees, hovedrepoet inklusive. */
function trae() {
  return git('worktree', 'list', '--porcelain')
    .split('\n\n')
    .map((b) => {
      const sti = (b.match(/^worktree (.+)$/m) || [])[1];
      const gren = (b.match(/^branch refs\/heads\/(.+)$/m) || [])[1] || '(loesrevet)';
      return sti ? { sti, gren } : null;
    })
    .filter(Boolean);
}

/**
 * Naeste ledige testnummer, set fra ALLE worktrees paa én gang.
 * Det er hele grunden til, at scriptet findes: et spor kan ikke selv se dette.
 */
function naesteTestnummer() {
  const brugte = new Set();
  for (const { sti } of trae()) {
    const d = path.join(sti, 'tests', 'dele');
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d)) {
      const m = /^(\d\d)-/.exec(f);
      if (m) brugte.add(Number(m[1]));
    }
  }
  /* HOEJESTE + 1, ikke laveste ledige hul. tests/LAESMIG.md: "praefikset baerer
     ogsaa laeseordenen". Der er huller ved 21 og 25 fra slettede filer, og at
     fylde dem ville laegge en september-test ind mellem to fra august. */
  const n = Math.max(0, ...brugte) + 1;
  return { nummer: String(n).padStart(2, '0'), brugte: [...brugte].sort((a, b) => a - b) };
}

/**
 * Porte, der lytter lige nu. Fejler opslaget, returneres null - og det SIGES i
 * outputtet, saa et ugyldigt tal aldrig praesenteres som en maaling.
 *
 * FULD STI ER PAAKRAEVET, og scriptet faldt selv i faelden foerste gang det
 * blev koert: Git Bash' PATH indeholder ikke System32, node arver den PATH, og
 * `execFileSync('netstat', ...)` gav ENOENT. Det er samme faelde som node,
 * python og jq, dokumenteret i CLAUDE.md - og den ramte et script skrevet af
 * en, der lige havde laest den.
 */
function lyttendePorte() {
  for (const bin of ['C:\\Windows\\System32\\netstat.exe', 'netstat']) {
    try {
      const ud = execFileSync(bin, ['-ano'], { encoding: 'utf8' });
      return new Set([...ud.matchAll(/:(\d{4,5})\s+\S+\s+LISTENING/gi)].map((m) => Number(m[1])));
    } catch { /* proev naeste */ }
  }
  return null;
}

function naestePort() {
  const lytter = lyttendePorte();
  const optaget = new Set(lytter || []);
  // Reservér ogsaa én port pr. eksisterende worktree, saa to spor sat op i
  // samme minut ikke faar samme tal, foer deres servere er startet.
  for (let i = 0; i < trae().length; i++) optaget.add(PORT_BASIS + i);
  let p = PORT_BASIS;
  while (optaget.has(p)) p++;
  return { port: p, maalt: lytter !== null };
}

function kopiér(fra, til) {
  fs.cpSync(fra, til, { recursive: true });
}

function taelFiler(p) {
  if (!fs.existsSync(p)) return 0;
  if (fs.statSync(p).isFile()) return 1;
  return fs.readdirSync(p, { recursive: true })
    .filter((f) => fs.statSync(path.join(p, f)).isFile()).length;
}

function settings(muter) {
  const p = path.join(ROD, '.claude', 'settings.json');
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  j.permissions.additionalDirectories ??= [];
  muter(j.permissions.additionalDirectories);
  fs.writeFileSync(p, `${JSON.stringify(j, null, 2)}\n`);
  return j.permissions.additionalDirectories;
}

/* ---------------------------------------------------------------- opsaetning */

function opsaet(navn, flag) {
  const maal = path.join(FORAELDER, `udstilling-wt-${navn}`);
  if (fs.existsSync(maal)) {
    console.error(`FEJL: ${maal} findes allerede. Ryd den foerst, eller vaelg et andet navn.`);
    process.exit(1);
  }

  git('worktree', 'add', maal, '-b', `spor/${navn}`);

  const kopieret = [];
  for (const { sti, noedvendig, flag: f } of GITIGNORERET) {
    if (!noedvendig && !flag.has(f)) continue;
    const fra = path.join(ROD, sti);
    if (!fs.existsSync(fra)) {
      console.log(`  ${sti}: findes ikke i hovedrepoet, sprunget over`);
      continue;
    }
    kopiér(fra, path.join(maal, sti));
    kopieret.push(`${sti} (${taelFiler(path.join(maal, sti))} filer)`);
  }

  const dirs = settings((a) => { if (!a.includes(maal.replace(/\\/g, '/'))) a.push(maal.replace(/\\/g, '/')); });
  const { nummer, brugte } = naesteTestnummer();
  const { port, maalt } = naestePort();

  console.log(`
KLAR: spor/${navn}
  worktree      ${maal}
  gren          spor/${navn} (fra ${git('rev-parse', '--short', 'HEAD')})
  kopieret ind  ${kopieret.join('\n                ') || '(intet)'}
  settings      ${dirs.length} worktree(s) registreret

TIL BRIEFET - skriv disse tre ordret ind:
  Serverport    ${port}${maalt ? '' : '   (ADVARSEL: netstat svarede ikke, tallet er IKKE maalt mod lyttende porte)'}
  Testnummer    ${nummer}   (i brug paa tvaers af alle worktrees: ${brugte.join(', ')})
  Grundmaaling  koer selv validate/build/tests og saet FRISKE tal i briefet

EFTERPROEV FOER DU SENDER:
  node tools/validate.mjs   skal give 0 fejl. Giver den 76, mangler billederne.
`);
}

/* -------------------------------------------------------------------- ryd op */

function ryd(navn, tvang) {
  const maal = path.join(FORAELDER, `udstilling-wt-${navn}`);
  const gren = `spor/${navn}`;
  if (!fs.existsSync(maal)) {
    console.error(`FEJL: ${maal} findes ikke.`);
    process.exit(1);
  }

  // flet-skillens punkt 5: MAAL foer du fjerner. Aldrig --force paa en fornemmelse.
  const status = execFileSync('git', ['-C', maal, 'status', '--short'], { encoding: 'utf8' }).trim();
  let foran = '0';
  try { foran = execFileSync('git', ['-C', maal, 'rev-list', '--count', `main..${gren}`], { encoding: 'utf8' }).trim(); } catch { /* gren kan vaere vaek */ }

  console.log(`MAALT FOER FJERNELSE
  commits foran main   ${foran}
  ucommitterede filer  ${status ? status.split('\n').length : 0}`);
  if (status) console.log(status.split('\n').map((l) => `    ${l}`).join('\n'));

  const kunSkrald = status && status.split('\n').every((l) => /^\?\? \.tmp-|^\?\? \.playwright-mcp/.test(l));

  if (foran !== '0') {
    console.error(`\nSTOP: grenen har ${foran} commit(s), main ikke har. Flet dem foerst.`);
    process.exit(1);
  }
  if (status && !kunSkrald && !tvang) {
    console.error(`\nSTOP: der ligger ucommitteret arbejde, som ikke kun er scratch.
Vis det for JPK og lad valget vaere hans. Er du sikker, saa gentag med --tvang.`);
    process.exit(1);
  }

  git('worktree', 'remove', ...(status ? ['--force'] : []), maal);
  try { git('branch', '-d', gren); } catch { console.log(`  (grenen ${gren} kunne ikke slettes med -d - flet den, eller slet manuelt)`); }
  const dirs = settings((a) => {
    const i = a.findIndex((d) => d.replace(/\\/g, '/').endsWith(`wt-${navn}`));
    if (i >= 0) a.splice(i, 1);
  });
  console.log(`\nRYDDET: ${gren}. ${dirs.length} worktree(s) tilbage i settings.`);
}

/* -------------------------------------------------------------------- status */

function status() {
  const { nummer, brugte } = naesteTestnummer();
  console.log('WORKTREES\n');
  for (const { sti, gren } of trae()) {
    let foran = '-'; let aendret = '-';
    try { foran = execFileSync('git', ['-C', sti, 'rev-list', '--count', `main..HEAD`], { encoding: 'utf8' }).trim(); } catch { /* main selv */ }
    try {
      const s = execFileSync('git', ['-C', sti, 'status', '--short'], { encoding: 'utf8' }).trim();
      aendret = s ? String(s.split('\n').length) : '0';
    } catch { /* ignoreres */ }
    console.log(`  ${gren.padEnd(22)} commits foran main ${String(foran).padStart(3)}   ucommitteret ${String(aendret).padStart(3)}`);
  }
  console.log(`\nTESTNUMRE i brug: ${brugte.join(', ')}\nNaeste ledige:    ${nummer}`);
  const { port, maalt } = naestePort();
  console.log(`Naeste ledige port: ${port}${maalt ? '' : '  (netstat svarede ikke - IKKE maalt)'}`);
}

/* ---------------------------------------------------------------------- main */

const a = process.argv.slice(2);
const flag = new Set(a.filter((x) => x.startsWith('--')));
const fri = a.filter((x) => !x.startsWith('--'));

if (flag.has('--status')) status();
else if (flag.has('--ryd')) {
  if (!fri[0]) { console.error('BRUG: --ryd <navn>'); process.exit(1); }
  ryd(fri[0], flag.has('--tvang'));
} else if (fri[0]) opsaet(fri[0], flag);
else {
  console.error(`BRUG
  node .claude/skills/parallelt/opsaet.mjs <navn> [--medie] [--env]
  node .claude/skills/parallelt/opsaet.mjs --ryd <navn> [--tvang]
  node .claude/skills/parallelt/opsaet.mjs --status`);
  process.exit(1);
}
