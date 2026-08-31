/**
 * tests/dele/16-instrumentkort.mjs — spor/instrument2 (retning INSTRUMENT ind
 * i kortet og gitteret, L40).
 *
 * Flyttet ind fra den selvstaendige tests/nyt-instrument.mjs (spor/testfold,
 * 26. aug 2026) — den fil blev skrevet, mens et andet spor delte
 * tests/koer.mjs op og ikke maatte roere den. Se tests/LAESMIG.md.
 *
 * Bygger ét frisk dist til sin egen undermappe af ctx.tmp, saa testen ikke
 * afhaenger af, hvad der tilfaeldigvis staar i den rigtige dist/ fra en
 * igangvaerende maaling.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

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

export default async function koer(ctx) {
  const {
    rod, tmp, node, ok,
  } = ctx;

  console.log('\n16. spor/instrument2: INSTRUMENT ind i kortet og gitteret (L40)');

  const udMappe = path.join(tmp, 'dist-instrument');
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
     Aflaesningslinjen - kortet viser altid fire faste pladser, ogsaa for en
     robot uden ét oplyst noegletal (den stiplede "ikke oplyst"-tilstand ER
     pointen, ikke en prosaboks).

     VENDT 31. aug 2026 (spor/katalog, L56 punkt 7). Vagten laeste
     KATALOGSIDEN, og katalogkortet har ikke laengere en stribe: JPK besluttede
     samme dag, at katalogets kort viser billede + producent + produktnavn og
     intet andet (MANIFEST "Layouttesen": "Kortet viser billede, producent og
     produktnavn - intet andet").

     Reglen er ikke droppet, den er FLYTTET til de flader, der stadig har det
     gamle kort: forsidens "Fra kataloget" og producentsiderne bruger fortsat
     hjaelp.kort() med striben. Vagten laeser dem nu - og en NY vagt nedenfor
     holder katalogkortet fast paa sin nye form, saa striben ikke kan snige sig
     tilbage uden en beslutning. */
  for (const sprog of ['da', 'en']) {
    const html = laesFil(`${sprog}/index.html`);
    ok(`${sprog}/: forsiden blev bygget`, html !== null);
    if (!html) continue;
    const { antalKort, taelling } = taelStribeLi(html);
    ok(`${sprog}: alle forsidens katalogkort har praecis 4 <li> i .stribe (0 i "intet"-grenen)`,
      antalKort > 0 && !taelling.intet && Object.keys(taelling).length === 1
        && taelling['4'] === antalKort,
      `fandt: ${JSON.stringify(taelling)} over ${antalKort} kort`);
  }

  /* Katalogkortets NYE form (L56 punkt 7). Den skal kunne fejle, hvis nogen
     rullede beslutningen tilbage - derfor baade "ingen stribe" og "der ER
     kort at maale paa", saa vagten ikke bliver sand af en tom side. */
  for (const sprog of ['da', 'en']) {
    const html = laesFil(`${sprog}/robotter/index.html`);
    ok(`${sprog}/robotter/: katalogsiden blev bygget`, html !== null);
    if (!html) continue;
    const { antalKort, taelling } = taelStribeLi(html);
    ok(`${sprog}: katalogkortet baerer INGEN stribe (L56 punkt 7: billede + producent + navn)`,
      antalKort > 0 && taelling.intet === antalKort,
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
}
