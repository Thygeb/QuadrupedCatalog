#!/usr/bin/env node
/**
 * tools/build.mjs — data/robots/*.yaml  ->  dist/
 *
 * Nul afhaengigheder. Statisk HTML pr. sprog. Siden virker uden JavaScript:
 * hvert kort er renderet i HTML, og filtrene er afkrydsningsfelter med CSS.
 * JavaScript tilfoejer kun fritekstsoegning.
 *
 *   node tools/build.mjs
 *   node tools/build.mjs --data=<mappe> --ud=<mappe>
 *   node tools/build.mjs --naevner=31           D7 er lukket til skemaets feltantal
 *                                              (L30, vender L19's 31). Flaget staar,
 *                                              saa en gammel skala kan MAALES imod
 *   node tools/build.mjs --type-uden-model=tael D4 (L20)
 *   node tools/build.mjs --til-udgivelse        afviser fabrikantbilleder (S1)
 *   node tools/build.mjs --spring-validering-over   (kun til fejlsoegning)
 *
 * Bygget koerer validate.mjs foerst og stopper, hvis den fejler. Det er den
 * mekaniske haandhaevelse af "opfind aldrig tal": et talfelt uden enhed eller
 * kilde kan ikke naa dist/.
 *
 * UDSEENDET kommer fra assets/system.css og skabelonerne i tools/skabelon/,
 * ikke fra haandskrevet HTML. Kontrakten for en skabelon staar i
 * tools/skabelon/side.mjs.
 *
 * BILLEDER: dist/billeder/ fyldes KUN fra assets/. media/ indgaar aldrig -
 * hverken som sti i HTML eller som kopi. Se side.mjs, afsnit 8.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { parseYaml, YamlFejl } from './yaml.mjs';
import {
  FELTER, FELTNAVNE, GRUPPER, FILTER_FELTER, SPROG, tilstandAf, normaliserRobot,
  BILLEDMAPPER, BILLEDE_ENDELSER, BILLEDE_SPAERRET,
} from './skema.mjs';
import { main as validerMain, taethed, laesFlag, findFiler, naevnereFra } from './validate.mjs';
import {
  lavSprog, lavHjaelp, lavKilder, skal, esc, vaegtklasse, VAEGTKLASSER,
  manglendeNoegler,
} from './skabelon/side.mjs';
import * as forsideSkabelon from './skabelon/forside.mjs';
import * as katalogSkabelon from './skabelon/katalog.mjs';

const rod = process.cwd();
const iDag = new Date().toISOString().slice(0, 10);

/* ------------------------------------------------------------------ hjaelp */

function skrivFil(fil, indhold) {
  fs.mkdirSync(path.dirname(fil), { recursive: true });
  fs.writeFileSync(fil, indhold, 'utf8');
}

function ryd(mappe) {
  if (fs.existsSync(mappe)) fs.rmSync(mappe, { recursive: true, force: true });
}

/** En paastand, bygget ikke maa overleve. Kastes, saa dist/ ikke bliver skaevt. */
function paastaa(betingelse, besked) {
  if (!betingelse) throw new Error(`BYGFEJL: ${besked}`);
}

const taelKort = (html) => (html.match(/<article class="kort">/g) || []).length;

/** Skabeloner, en anden agent ejer. Findes de ikke endnu, siger bygget det. */
async function hentSkabelon(navn) {
  const fil = path.join(rod, 'tools', 'skabelon', `${navn}.mjs`);
  if (!fs.existsSync(fil)) return null;
  const mod = await import(`file://${fil.replace(/\\/g, '/')}`);
  if (typeof mod.render !== 'function') {
    console.error(`  advarsel: tools/skabelon/${navn}.mjs har ingen render(ctx) og springes over`);
    return null;
  }
  return mod;
}

/* -------------------------------- midlertidig robotside (indtil robot.mjs) */

/**
 * Robotsiden ejes af en anden agent (tools/skabelon/robot.mjs). Indtil den
 * fil findes, bygges detaljesiden her - med designsystemets komponenter, saa
 * kataloget ikke peger ind i en side fra det gamle udseende. Den er MIDLERTIDIG
 * og siger det selv paa siden.
 */
function midlertidigRobotside(ctx) {
  const { robot, i18n, hjaelp } = ctx;
  const { T, t } = i18n;
  const kilder = hjaelp.kilder(robot);
  const a = hjaelp.anvendelse(robot);
  const naevnere = ctx.naevnere;
  const d4 = ctx.d4;

  const taethedsblok = `<div class="taethed">
<span class="etiket">${esc(T.taethed_titel)}</span>
${naevnere.map((n) => {
    const x = taethed(robot, n, d4);
    return `<span class="tal">${esc(String(x.pct))} %</span>`
      + `<span class="brok">${esc(String(x.udfyldt))}/${esc(String(x.naevner))}</span>`;
  }).join('\n')}
</div>`;

  const anvendelsesblok = `<section class="gruppe">
<h2 class="t-h2">${esc(T.anvendelse_titel)}</h2>
${a.maerker()}
${a.citater.length ? `<blockquote class="advarsel"><span class="etiket">${esc(T.anvendelse_citat)}</span>`
    + a.citater.map((c) => `<p>${esc(c)}</p>`).join('') + `</blockquote>` : ''}
${a.note ? `<p class="feltnote">${esc(a.note)}</p>` : ''}
<p class="t-lille">${esc(T.anvendelse_forklaring)}</p>
</section>`;

  const grupper = GRUPPER.map((gruppe) => {
    const navne = FELTNAVNE.filter((n) => FELTER[n].gruppe === gruppe);
    if (!navne.length) return '';
    return `<section class="gruppe">
<h2 class="t-h2">${esc(T['gruppe_' + gruppe])}</h2>
<dl class="raekker">
${navne.map((n) => `<div class="raekke"><dt>${esc(T['felt_' + n])}</dt>`
      + `<dd>${hjaelp.felt(n, robot.felter[n], { kilder })}</dd></div>`).join('\n')}
</dl>
</section>`;
  }).join('\n');

  const noter = robot.noter
    ? `<section class="gruppe"><h2 class="t-h2">${esc(T.noter)}</h2>`
      + (Array.isArray(robot.noter)
        ? `<ul class="raekker">${robot.noter.map((n) => `<li class="raekke"><dd>${esc(n)}</dd></li>`).join('')}</ul>`
        : `<p class="t-broed">${esc(robot.noter)}</p>`)
      + `</section>`
    : '';

  return `<div class="rum">
<article class="post">
<div class="gruppe">
<p class="post-meta"><span class="prod">${esc(robot.producent)}</span>`
    + `<span class="land">${esc(hjaelp.land(robot.producentland))}</span>`
    + `<span class="status status--${esc(robot.status)}">${esc(T['status_' + robot.status])}</span>`
    + `${robot.foerste_udgivelse ? `<span class="land">${esc(String(robot.foerste_udgivelse))}</span>` : ''}</p>
<h1 class="t-h1">${esc(robot.navn)}</h1>
</div>
${hjaelp.stribe(robot, { kilder })}
${taethedsblok}
${anvendelsesblok}
${grupper}
${noter}
<section class="gruppe">
<h2 class="t-h2">${esc(T.kilde)}</h2>
${hjaelp.kildeliste(kilder)}
</section>
<p class="midlertidig-note">${esc(t('robotside_midlertidig'))}</p>
</article>
</div>`;
}

/* ------------------------------------------------------------------ main */

async function main(argv) {
  const { flag } = laesFlag(argv);
  const naevnere = naevnereFra(flag);
  const d4 = String(flag['type-uden-model'] ?? 'tael-ikke') === 'tael';

  let dataMappe = path.resolve(String(flag['data'] ?? 'data/robots'));
  let filer = findFiler(dataMappe);
  if (!filer.length) {
    const reserve = path.resolve('tests/eksempel-robotter');
    const r = findFiler(reserve);
    if (r.length) {
      console.log(`  ${dataMappe} er tom - bygger fra ${reserve} i stedet.`);
      dataMappe = reserve;
      filer = r;
    }
  }
  if (!filer.length) { console.error(`Ingen YAML-filer i ${dataMappe}.`); return 1; }

  if (!flag['spring-validering-over']) {
    console.log(`Validerer ${filer.length} fil(er) ...`);
    if (validerMain([`--data=${dataMappe}`]) !== 0) {
      console.error('\nBygget stoppet: validatoren fandt fejl. dist/ er ikke skrevet.');
      return 1;
    }
  }

  // Samme normalisering som validatoren koerer. Delt funktion, ikke en kopi:
  // to laesninger af den samme fil er praecis den fejl, der kostede 358 felter.
  const robotter = filer.map((f) => {
    try { return normaliserRobot(parseYaml(fs.readFileSync(f, 'utf8'), f)); }
    catch (e) { if (e instanceof YamlFejl) { console.error(String(e.message)); return null; } throw e; }
  }).filter(Boolean);
  robotter.sort((a, b) => String(a.navn).localeCompare(String(b.navn), 'da'));

  paastaa(robotter.length === filer.length,
    `${filer.length} datafiler, men kun ${robotter.length} kunne laeses.`);

  // Producenterne udledes af robotterne. data/manufacturers/ er tom i dag.
  const producenter = [...new Map(robotter.map((r) => [r.producent, {
    navn: r.producent,
    slug: String(r.producent).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    land: r.producentland,
    robotter: robotter.filter((x) => x.producent === r.producent),
  }])).values()];

  const robotSkabelon = await hentSkabelon('robot');
  const producentSkabelon = await hentSkabelon('producent');
  if (!robotSkabelon) {
    console.log('  tools/skabelon/robot.mjs findes ikke endnu - detaljesiden bygges');
    console.log('  med generatorens MIDLERTIDIGE skabelon. Den erstattes automatisk.');
  }
  if (!producentSkabelon) {
    console.log('  tools/skabelon/producent.mjs findes ikke endnu - producentsider bygges ikke.');
  }

  const ud = path.resolve(String(flag['ud'] ?? 'dist'));
  ryd(ud);

  // Producentsiderne kan kun naas, hvis de FINDES. Flaget styrer baade
  // "Producenter"-leddet i topnavigationen (skal() tegner det kun naar flaget
  // er sat) og robotsidernes link til deres producent — uden skabelonen ville
  // begge pege paa mapper, bygget aldrig skrev (F1 omvendt).
  const harProducenter = !!producentSkabelon;
  const producentAf = new Map(producenter.map((p) => [p.navn, p]));

  const manglendeLande = new Set();
  let sider = 0;
  let kortPaaForside = 0;
  let kortIKatalog = 0;

  for (const sprogkode of SPROG) {
    const i18n = lavSprog(sprogkode);
    const { T, t } = i18n;
    const hjaelp = lavHjaelp({ sprogkode, T, t, tf: i18n.tf });

    // ctx.url baerer BAADE stien og opslag pr. sidetype. Skabelonerne slaar op
    // med url.robot(slug) / url.katalog og skal ikke selv taelle mapper -
    // en haandregnet '../../' er den slags fejl, der ikke ses foer i browseren.
    const grund = (sti) => {
      const dybde = 1 + sti.split('/').filter(Boolean).length;
      const op = '../'.repeat(dybde);
      const her = `${op}${sprogkode}/`;
      return {
        robotter, producenter, i18n, sprog: sprogkode, hjaelp, naevnere, d4,
        url: {
          sti, dybde, op,
          forside: her,
          katalog: `${her}robotter/`,
          producenter: `${her}producenter/`,
          robot: (slug) => `${her}robotter/${slug}/`,
          producent: (slug) => `${her}producenter/${slug}/`,
        },
      };
    };

    /* --- forsiden --- */
    {
      const ctx = grund('');
      const main0 = forsideSkabelon.render(ctx);
      kortPaaForside = taelKort(main0);
      paastaa(kortPaaForside === robotter.length,
        `forsiden (${sprogkode}) har ${kortPaaForside} kort, men der er ${robotter.length} datafiler. `
        + 'Prototypen tabte tre robotter praecis her.');
      skrivFil(path.join(ud, sprogkode, 'index.html'), skal({
        sprogkode, T, t, sti: '', aktiv: '', script: true, harProducenter,
        titel: `${T.sted_navn} · ${T.sted_undertitel}`,
        beskrivelse: T.sted_undertitel,
        main: main0,
      }));
      sider++;
    }

    /* --- kataloget --- */
    {
      const ctx = grund('robotter/');
      const main0 = katalogSkabelon.render(ctx);
      kortIKatalog = taelKort(main0);
      paastaa(kortIKatalog === robotter.length,
        `kataloget (${sprogkode}) har ${kortIKatalog} kort, men der er ${robotter.length} datafiler.`);
      skrivFil(path.join(ud, sprogkode, 'robotter', 'index.html'), skal({
        sprogkode, T, t, sti: 'robotter/', aktiv: 'robotter/', script: true, harProducenter,
        titel: `${T.katalog_titel} · ${T.sted_navn}`,
        beskrivelse: T.sted_undertitel,
        stil: katalogSkabelon.hovedStil(ctx),
        main: main0,
      }));
      sider++;
    }

    /* --- robotsiderne --- */
    for (const robot of robotter) {
      const sti = `robotter/${robot.slug}/`;
      // ctx.producent taender robotsidens to links til producentsiden
      // (skabelonen tegner dem kun, naar den kender et slug). Uden
      // producentskabelonen findes siderne ikke, og linkene skal ikke tegnes.
      const ctx = {
        ...grund(sti), robot,
        producent: harProducenter ? producentAf.get(robot.producent) : undefined,
      };
      const main0 = robotSkabelon ? robotSkabelon.render(ctx) : midlertidigRobotside(ctx);
      skrivFil(path.join(ud, sprogkode, 'robotter', robot.slug, 'index.html'), skal({
        sprogkode, T, t, sti, aktiv: 'robotter/', harProducenter,
        titel: `${robot.navn} — ${robot.producent} · ${T.sted_navn}`,
        beskrivelse: `${robot.navn}, ${robot.producent}. ${T.sted_undertitel}`,
        stil: robotSkabelon?.hovedStil ? robotSkabelon.hovedStil(ctx) : '',
        main: main0,
      }));
      sider++;
    }

    /* --- producentsiderne, hvis skabelonen findes --- */
    if (producentSkabelon) {
      for (const producent of producenter) {
        const sti = `producenter/${producent.slug}/`;
        const ctx = { ...grund(sti), producent };
        skrivFil(path.join(ud, sprogkode, 'producenter', producent.slug, 'index.html'), skal({
          sprogkode, T, t, sti, aktiv: 'producenter/', harProducenter,
          titel: `${producent.navn} · ${T.sted_navn}`,
          beskrivelse: `${producent.navn}. ${T.sted_undertitel}`,
          stil: producentSkabelon.hovedStil ? producentSkabelon.hovedStil(ctx) : '',
          main: producentSkabelon.render(ctx),
        }));
        sider++;
      }

      /* --- producentindekset (F1). Foer 24.08.2026 fandtes producentsiderne,
         men INGEN side linkede til dem, og producenter/index.html fandtes
         ikke — 26 sider uden en eneste doer ind. Indekssiden ligger praecis
         paa producenter/, som topnavigationens led peger paa. --- */
      if (typeof producentSkabelon.renderIndeks === 'function') {
        const sti = 'producenter/';
        const ctx = grund(sti);
        skrivFil(path.join(ud, sprogkode, 'producenter', 'index.html'), skal({
          sprogkode, T, t, sti, aktiv: 'producenter/', harProducenter,
          titel: `${t('nav_producenter')} · ${T.sted_navn}`,
          beskrivelse: T.sted_undertitel,
          main: producentSkabelon.renderIndeks(ctx),
        }));
        sider++;
      } else {
        console.error('  advarsel: producent.mjs har ingen renderIndeks(ctx) — '
          + 'producenter/index.html bygges ikke, og topnavigationens led peger i luften (F1).');
      }
    }

    for (const l of hjaelp.manglendeLande) manglendeLande.add(l);
  }

  /* --- lille indeks til klientsiden --- */
  const indeks = {
    genereret: iDag,
    naevnere,
    type_uden_model_taeller: d4,
    filterfelter: FILTER_FELTER,
    robotter: robotter.map((r) => {
      const f = {};
      for (const n of FILTER_FELTER) {
        const v = r.felter[n];
        if (v === undefined) f[n] = 'ikke_oplyst';
        else if (typeof v === 'string') f[n] = v;
        else if (tilstandAf(v.vaerdi)) f[n] = tilstandAf(v.vaerdi);
        else if (typeof v.vaerdi === 'boolean') f[n] = v.vaerdi;
        else if (v.min !== undefined) f[n] = { min: v.min, maks: v.maks, enhed: v.enhed };
        else f[n] = { vaerdi: v.vaerdi, enhed: v.enhed, operator: v.operator ?? null };
      }
      const a = r.anvendelse === undefined ? { vaerdi: 'ikke_oplyst' }
        : (typeof r.anvendelse === 'string' ? { vaerdi: r.anvendelse } : r.anvendelse);
      return {
        slug: r.slug, navn: r.navn, producent: r.producent,
        producentland: r.producentland, status: r.status,
        // Afledt i bygget, ikke i data (L27). Staar i indekset, saa en
        // klientside-visning ikke kan naa til en anden inddeling end siden.
        vaegtklasse: vaegtklasse(r),
        anvendelse: {
          vaerdi: (Array.isArray(a.vaerdi) ? a.vaerdi : [a.vaerdi]).map((v) => tilstandAf(v) ?? v),
          citat: a.citat === undefined ? [] : (Array.isArray(a.citat) ? a.citat : [a.citat]),
          kilde: a.kilde ?? null, hentet: a.hentet ?? null,
        },
        kilder: lavKilder(r).liste.map((k) => ({ bogstav: k.bogstav, url: k.url, hentet: k.hentet, sekundaer: k.sekundaer })),
        taethed: Object.fromEntries(naevnere.map((n) => [n, taethed(r, n, d4).pct])),
        felter: f,
      };
    }),
  };
  skrivFil(path.join(ud, 'robots.json'), JSON.stringify(indeks, null, 1));

  /* --- statiske aktiver. dist/ bygges KUN fra assets/. --- */
  for (const [fra, til] of [
    ['assets/system.css', 'system.css'],
    ['assets/generator.css', 'generator.css'],
    ['assets/katalog.js', 'katalog.js'],
  ]) {
    const kilde = path.join(rod, fra);
    if (fs.existsSync(kilde)) skrivFil(path.join(ud, til), fs.readFileSync(kilde, 'utf8'));
    else console.error(`  advarsel: ${fra} findes ikke`);
  }
  // Skrifterne kopieres med, saa @font-face's url() virker, naar filerne lander.
  const fontMappe = path.join(rod, 'assets/fonts');
  if (fs.existsSync(fontMappe)) {
    for (const f of fs.readdirSync(fontMappe)) {
      if (!f.endsWith('.woff2')) continue;
      fs.mkdirSync(path.join(ud, 'fonts'), { recursive: true });
      fs.copyFileSync(path.join(fontMappe, f), path.join(ud, 'fonts', f));
    }
  }
  /* --- billederne. KUN fra assets/. -------------------------------------
     media/ kopieres aldrig og staar ikke som sti nogen steder. Det er den
     STRUKTURELLE haandhaevelse af, at fabrikanternes materiale ikke kan slippe
     ud ved et uheld: der findes ingen kodesti fra media/ til dist/, saa reglen
     kan ikke glemmes af den, der skriver den naeste skabelon.

     Kopien gaar rekursivt, saa assets/silhuetter/unitree/b2.svg ogsaa lander -
     mapperne bliver dybere, naar 46 robotter faar hver sin fil. */
  let billeder = 0;
  const kopieredeBilleder = new Set();
  for (const mappe of BILLEDMAPPER) {
    const start = path.join(rod, 'assets', mappe);
    if (!fs.existsSync(start)) continue;
    (function gaa(m, praefiks) {
      for (const p of fs.readdirSync(m, { withFileTypes: true })) {
        if (p.name.startsWith('.') || p.name.toUpperCase().startsWith('LÆSMIG')) continue;
        const rel = praefiks ? `${praefiks}/${p.name}` : p.name;
        if (p.isDirectory()) { gaa(path.join(m, p.name), rel); continue; }
        if (!BILLEDE_ENDELSER.includes(path.extname(p.name).toLowerCase())) continue;
        const maal = path.join(ud, 'billeder', mappe, ...rel.split('/'));
        fs.mkdirSync(path.dirname(maal), { recursive: true });
        fs.copyFileSync(path.join(m, p.name), maal);
        kopieredeBilleder.add(`${mappe}/${rel}`);
        billeder++;
      }
    })(start, '');
  }

  /* Naaede hvert erklaeret billede frem? `fil:linje` beviser, at kopikoden
     findes - ikke at den ramte den fil, en robotpost peger paa. R18 har
     allerede sagt, at filen ligger i assets/; her siges det, at den ogsaa
     ligger i dist/. Uden det her ville et brudt billede foerst blive opdaget
     i en browser. */
  const brugteBilleder = new Map();      // sti -> [slug, ...]
  const spaerrede = [];                  // robotter med ophav, S1 daekker
  const ophavstal = {};
  for (const r of robotter) {
    const b = r.billede;
    if (!b || typeof b.fil !== 'string') continue;
    if (!brugteBilleder.has(b.fil)) brugteBilleder.set(b.fil, []);
    brugteBilleder.get(b.fil).push(r.slug);
    ophavstal[b.ophav] = (ophavstal[b.ophav] ?? 0) + 1;
    if (BILLEDE_SPAERRET.has(b.ophav)) spaerrede.push(`${r.slug} (${b.fil})`);
  }
  for (const [fil, slugs] of brugteBilleder) {
    paastaa(kopieredeBilleder.has(fil),
      `${slugs.join(', ')} peger paa assets/${fil}, men filen naaede ikke dist/billeder/${fil}.`);
  }

  /* S1 er en spaerring, ikke en huskeregel. `--til-udgivelse` goer den
     mekanisk: bygget kan ikke laves faerdigt med et fabrikantbillede i.
     Uden flaget bygges der som i dag - lokalt, med billederne (L13). */
  if (flag['til-udgivelse']) {
    paastaa(spaerrede.length === 0,
      `SPAERRING S1: ${spaerrede.length} billede(r) har ophav "fabrikant" og maa ikke publiceres `
      + `uden skriftlig tilladelse:\n    ${spaerrede.join('\n    ')}\n  `
      + `Skift dem ud med egne fotos eller maaltro silhuetter, eller byg uden --til-udgivelse.`);
  }

  /* --- sprogvaelger paa roden --- */
  skrivFil(path.join(ud, 'index.html'), `<!doctype html>
<html lang="da">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Firbenede robotter · Quadruped robots</title>
<meta name="robots" content="noindex">
${SPROG.map((s) => `<link rel="alternate" hreflang="${s}" href="${s}/">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="da/">
<link rel="stylesheet" href="system.css">
<link rel="stylesheet" href="generator.css">
</head>
<body>
<main class="rum hero" id="hoved">
<h1 class="t-hero">Firbenede robotter</h1>
<p class="t-broed maal">Quadruped robots — et opslagsvaerk med kilde og dato paa hvert tal.</p>
<p class="hero-videre"><a class="videre" href="da/">Dansk</a> <a class="videre videre--stille" href="en/">English</a></p>
</main>
</body>
</html>
`);
  sider++;

  /* ------------------------------------------------------------ selv-tjek */

  const klasser = Object.fromEntries(VAEGTKLASSER.map((k) => [k, 0]));
  for (const r of robotter) klasser[vaegtklasse(r)]++;
  paastaa(Object.values(klasser).reduce((a, b) => a + b, 0) === robotter.length,
    'vaegtklasserne summer ikke til antallet af robotter.');

  /* Naaede media/ ud i HTML? Kopikoden laeser kun assets/, men en skabelon kan
     skrive en sti i haanden, og en sti er nok - browseren henter den. Derfor
     laeses de faerdige sider igennem, ikke bare koden. Det er den samme
     kontrol, tests/koer.mjs har paa proevebygget; her staar den paa det
     rigtige byg, saa den ogsaa gaelder de 46 poster. */
  const htmlFiler = [];
  (function gaa(m) {
    for (const p of fs.readdirSync(m, { withFileTypes: true })) {
      const fuld = path.join(m, p.name);
      if (p.isDirectory()) gaa(fuld); else if (p.name.endsWith('.html')) htmlFiler.push(fuld);
    }
  })(ud);
  // Samme moenster som tests/koer.mjs bruger paa proevebygget: en sti begynder
  // efter et anfoerselstegn, en parentes eller en skraastreg. Ordet "media/"
  // i en saetning er ikke en henvisning - det er prosa, og den maa staa.
  const medMedia = htmlFiler.filter((f) => /["'(/]media\//.test(fs.readFileSync(f, 'utf8')));
  paastaa(medMedia.length === 0,
    `${medMedia.length} side(r) henviser til media/. Fabrikanternes materiale maa aldrig `
    + `indgaa i et byg:\n    ${medMedia.slice(0, 5).join('\n    ')}`);

  // Kortene og robotsiderne skal tegne ét billedled pr. robot pr. sprog -
  // enten et <picture> eller den tomme plade. Er tallet lavere, er et kort
  // faldet ud af skabelonen uden at nogen har bedt om det.
  let tommePlader = 0; let picture = 0;
  for (const f of htmlFiler) {
    const s = fs.readFileSync(f, 'utf8');
    tommePlader += (s.match(/class="intetfoto"/g) || []).length;
    picture += (s.match(/<picture>/g) || []).length;
  }

  let medKilde = 0; let udenKilde = 0; let sekundaere = 0;
  for (const r of robotter) {
    for (const n of FELTNAVNE) {
      const p = r.felter[n];
      if (p === undefined) continue;
      const erTilstand = typeof p === 'string' || tilstandAf(p.vaerdi);
      if (erTilstand) continue;            // et hul er ikke et tal
      if (typeof p === 'object' && p.kilde) { medKilde++; if (p.kildetype === 'sekundaer') sekundaere++; }
      else udenKilde++;
    }
  }

  if (manglendeLande.size) {
    console.error(`  advarsel: ${manglendeLande.size} landenoegle(r) mangler i sprogfilerne:\n    `
      + [...manglendeLande].join('\n    '));
  }
  // data/i18n/<sprog>.json er det eneste sted, UI-tekst staar. Reservesaettet i
  // tools/skabelon/reserve-*.json er nedlagt 21. aug 2026, og de 71 noegler er
  // flyttet ind i sprogfilerne. Mangler en noegle nu, er der ingen at falde
  // tilbage paa - den staar som «noegle» paa siden og skal skrives i sprogfilen.
  if (manglendeNoegler.size) {
    console.error(`\n  ${manglendeNoegler.size} noegle(r) mangler i data/i18n/ `
      + `og staar som «noegle» paa siden:\n    ` + [...manglendeNoegler].join('\n    '));
  }

  console.log(`\nByggede ${sider} sider. `
    + `Vaegtklasser: ${klasser.under_20}/${klasser['20_40']}/${klasser.over_40}/${klasser.ikke_oplyst} `
    + `over ${robotter.length} datafiler. Kort paa forsiden: ${kortPaaForside} `
    + `(skal vaere lig ${robotter.length}). Kildemaerker: ${medKilde} tal med kilde, ${udenKilde} uden.`);
  console.log(`Kort i kataloget: ${kortIKatalog} · sekundaere kilder: ${sekundaere} felter · `
    + `billeder kopieret fra assets/: ${billeder} (media/ indgaar aldrig)`);
  const ophavstekst = Object.keys(ophavstal).length
    ? Object.entries(ophavstal).map(([o, n]) => `${o}: ${n}`).join(', ')
    : 'ingen robotpost peger paa en fil';
  console.log(`Billedfelter: ${brugteBilleder.size} fil(er) brugt af ${
    [...brugteBilleder.values()].reduce((a, b) => a + b.length, 0)} robot(ter) · ${ophavstekst}`);
  console.log(`Billedled i dist/: ${picture} <picture> · ${tommePlader} tomme plader `
    + `(${robotter.length} robotter x ${SPROG.length} sprog x 2 sider = `
    + `${robotter.length * SPROG.length * 2} led plus producentsidernes kort)`);
  if (spaerrede.length) {
    console.error(`\n  SPAERRING S1: ${spaerrede.length} af billederne har ophav "fabrikant". `
      + `Siden maa ikke publiceres med dem uden skriftlig tilladelse.`
      + `\n  Byg med --til-udgivelse for at faa bygget til at afvise dem.`);
  }
  console.log(`Taethedsnaevnere brugt: ${naevnere.join(', ')}`);
  return 0;
}

const erHoved = process.argv[1] && path.resolve(process.argv[1]).endsWith('build.mjs');
if (erHoved) {
  main(process.argv.slice(2)).then((k) => process.exit(k)).catch((e) => {
    console.error(String(e && e.message ? e.message : e));
    process.exit(1);
  });
}

export { main };
