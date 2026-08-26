#!/usr/bin/env node
/**
 * tests/nyt-instrument.mjs — selvstaendig testfil for spor/instrument2
 * (retning INSTRUMENT ind i kortet og gitteret).
 *
 *   node tests/nyt-instrument.mjs
 *
 * Skrevet i egen fil, IKKE i tests/koer.mjs: et andet spor deler den fil op
 * lige nu (briefets filejerskab). Orkestratoren fletter denne fil ind i
 * testopdelingen bagefter.
 *
 * Bygger ét frisk dist til en midlertidig mappe (samme moenster som
 * koer.mjs's --data=/--ud=-brug), saa testen ikke afhaenger af, hvad der
 * tilfaeldigvis staar i den rigtige dist/ fra en igangvaerende maaling.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';

const rod = path.resolve(
  path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'),
  '..',
);
const node = process.execPath;
const udMappe = path.join(rod, 'tests', '.tmp-instrument-dist');

let bestaaet = 0;
let fejlet = 0;

function ok(navn, betingelse, detalje) {
  if (betingelse) { bestaaet++; console.log(`  ok    ${navn}`); }
  else { fejlet++; console.log(`  FEJL  ${navn}${detalje ? ' — ' + detalje : ''}`); }
}

/** Taeller <li> i .stribe pr. .kort - samme metode som briefets eget
 *  acceptkriterium for punkt 1. */
function taelStribeLi(html) {
  const kort = html.split('<article class="kort"').slice(1);
  const taelling = {};
  for (const k of kort) {
    const s = k.indexOf('<ul class="stribe');
    if (s < 0) { taelling.intet = (taelling.intet || 0) + 1; continue; }
    const blok = k.slice(s, k.indexOf('</ul>', s));
    const n = (blok.match(/<li[ >]/g) || []).length;
    taelling[n] = (taelling[n] || 0) + 1;
  }
  return { antalKort: kort.length, taelling };
}

function laesFil(rel) {
  const sti = path.join(udMappe, rel);
  return fs.existsSync(sti) ? fs.readFileSync(sti, 'utf8') : null;
}

/* ------------------------------------------------------------- opsaetning */
fs.rmSync(udMappe, { recursive: true, force: true });
const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${udMappe}`],
  { cwd: rod, encoding: 'utf8' });
ok('build.mjs giver exit 0 (frisk byg til midlertidig mappe, hele det rigtige datasaet)',
  b.status === 0, (b.stdout || b.stderr || '').trim().split('\n').slice(-3).join(' / '));

/* ------------------------------------------------------ punkt 1: kortet
   Aflaesningslinjen - alle katalogkort viser altid fire faste pladser,
   ogsaa en robot uden ét oplyst noegletal (den stiplede "ikke oplyst"-
   tilstand ER pointen, ikke en prosaboks). */
for (const sprog of ['da', 'en']) {
  const html = laesFil(`${sprog}/robotter/index.html`);
  ok(`${sprog}/robotter/: katalogsiden blev bygget`, html !== null);
  if (!html) continue;
  const { antalKort, taelling } = taelStribeLi(html);
  ok(`${sprog}: alle katalogkort har praecis 4 <li> i .stribe (0 i "intet"-grenen)`,
    !taelling.intet && Object.keys(taelling).length === 1 && taelling['4'] === antalKort,
    `fandt: ${JSON.stringify(taelling)} over ${antalKort} kort`);
}

/* Robotsidens EGEN, fulde stribe (kompakt:false) skal STADIG kunne vise
   prosagrenen for en robot uden ét oplyst noegletal - rettelsen tilfoejede
   "&& !kompakt", den fjernede ikke grenen. Briefets punkt 1 siger eksplicit,
   at robotsidens fulde stribe ikke skal aendres. */
{
  const daRobotterDir = path.join(udMappe, 'da', 'robotter');
  let fundetProse = false;
  if (fs.existsSync(daRobotterDir)) {
    for (const post of fs.readdirSync(daRobotterDir, { withFileTypes: true })) {
      if (!post.isDirectory()) continue;
      const side = path.join(daRobotterDir, post.name, 'index.html');
      if (fs.existsSync(side) && fs.readFileSync(side, 'utf8').includes('stribe--intet')) {
        fundetProse = true;
        break;
      }
    }
  }
  ok('robotsidens egen fulde stribe (kompakt:false) viser stadig "intet"-prosagrenen for mindst én robot uden noegletal',
    fundetProse);
}

/* ------------------------------------------------------ punkt 2+3: CSS'en
   Struktur-tjek af de faktiske regler, ikke af den visuelle effekt (den er
   maalt med maalevaerktoej/maal.mjs i rapporten, ikke gentageligt her uden
   en browser - se briefets krav om, at dette IKKE er en Playwright-test). */
const systemCss = fs.readFileSync(path.join(rod, 'assets', 'system.css'), 'utf8');
const generatorCss = fs.readFileSync(path.join(rod, 'assets', 'generator.css'), 'utf8');

ok('gitteret bruger en smallere minimumsbredde end foer sporet (250px, ikke 310px) - fem spalter ved 1440 px i stedet for fire',
  /minmax\(250px,1fr\)/.test(systemCss) && !/minmax\(310px,1fr\)/.test(systemCss));

ok('kortets kompakte stribe har INGEN haarstreg mellem cellerne laengere (kun de stiplede "ikke oplyst"-huller staar tilbage, uaendret)',
  /\.stribe--kompakt\s*>\s*li\{[^}]*border:0/.test(systemCss)
    && !/\.stribe--kompakt\s*>\s*li:nth-child\(n\+3\)\{border-top/.test(systemCss));

ok('kortets navnesats er strammet under det oprindelige 22px (haardere typografi, punkt 3)',
  /\.kort-navn\{font-size:1[4-9]px/.test(systemCss) && !/\.kort-navn\{font-size:22px/.test(systemCss));

/* ------------------------------------------------------ punkt 4: headers
   Beslutningen var at IKKE tilfoeje kolonneoverskrifter over gitteret uden
   en maaling, der beviser 2px-flugtning ved baade 390 og 1440 - se
   rapporten. Denne test vaerner mod, at nogen tilfoejer dem senere uden at
   opdatere rapportens begrundelse. */
ok('ingen "kanalhoved"-lignende overskriftsraekke over katalogets gitter (bevidst fravalg uden maaling, se rapporten)',
  !/kanalhoved/.test(systemCss) && !/kanalhoved/.test(generatorCss));

/* ------------------------------------------------------ efterproevning
   Kortantallet er uaendret af taethedsaendringen - 77 er en AEGTE optaelling
   fra datamappen, ikke et haandtal (se CLAUDE.md's advarsel mod haardkodede
   forventede tal). */
{
  const html = laesFil('da/robotter/index.html');
  const antalKilder = fs.readdirSync(path.join(rod, 'data', 'robots')).filter((f) => /\.ya?ml$/.test(f)).length;
  ok(`antal katalogkort matcher antal robotfiler i data/robots/ (${antalKilder})`,
    html !== null && (html.match(/<article class="kort"/g) || []).length === antalKilder);
}

fs.rmSync(udMappe, { recursive: true, force: true });

console.log(`\nI alt: ${bestaaet} bestaaet, ${fejlet} fejlet.`);
process.exit(fejlet ? 1 : 0);
