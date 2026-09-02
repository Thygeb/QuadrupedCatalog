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
  BILLEDMAPPER, BILLEDE_ENDELSER, feltVisning,
  normaliserVisningsEnheder, sorterAnvendelse,
} from './skema.mjs';
import { main as validerMain, taethed, laesFlag, findFiler, naevnereFra } from './validate.mjs';
import {
  lavSprog, lavHjaelp, lavKilder, skal, esc, vaegtklasse, VAEGTKLASSER,
  manglendeNoegler,
} from './skabelon/side.mjs';
import * as katalogSkabelon from './skabelon/katalog.mjs';
import * as sammenligningSkabelon from './skabelon/sammenligning.mjs';
import * as omOsSkabelon from './skabelon/om-os.mjs';
import * as fejl404Skabelon from './skabelon/fejl404.mjs';

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

/**
 * spor/i18nfelt (Å98 spor A), punkt 3 — ÉT sted, hvor build vaelger tekst
 * efter sprog: en sprogoploest KOPI af `robotter` til ét sprog. Findes
 * `advarsel_i18n[sprogkode]` paa en feltpost, traeder den i stedet for den
 * danske "advarsel"; findes den ikke, staar "advarsel" uaendret (den danske
 * kilde er stadig den ene sandhed, tools/skema.mjs's KILDESPROG). Samme
 * mekanik for "note_i18n" paa "anvendelse" og "billede" — de to steder
 * "note:" bor (grundmaalingen: 97 "note:", ALLE paa indryk 2 — anvendelse
 * 76 + billede 21 — ALDRIG i en feltpost).
 *
 * KOPI, ikke mutation: `for (const sprogkode of SPROG)` laengere nede
 * koerer FLERE gange over det SAMME `robotter`-array (parseYaml'et ÉN gang
 * foer loekken) — en mutation i sprogrunde ét ville sive ind i runde to.
 *
 * Alle skabeloner, der laeser `robot.felter[navn].advarsel`/
 * `robot.anvendelse.note`/`robot.billede.note` fra ctx.robotter (katalogkort,
 * sammenligningens indlejrede JSON-blok, robotsidens egen `robot`), faar
 * dermed automatisk den rigtige sprogudgave — ingen af tools/skabelon/*.mjs
 * skal aendres (BRIEF-i18nfelt.md: "tools/skabelon/*.mjs skal IKKE aendres").
 */
function sprogoploesRobotter(robotter, sprogkode) {
  const loesTekst = (kildeTekst, i18n) => {
    if (!i18n || typeof i18n !== 'object') return kildeTekst;
    const oversat = i18n[sprogkode];
    return typeof oversat === 'string' && oversat.trim() !== '' ? oversat : kildeTekst;
  };
  return robotter.map((r) => {
    let aendret = false;

    let felter = r.felter;
    for (const [navn, post] of Object.entries(r.felter ?? {})) {
      if (!post || typeof post !== 'object' || !post.advarsel_i18n) continue;
      const ny = loesTekst(post.advarsel, post.advarsel_i18n);
      if (ny === post.advarsel) continue;
      if (felter === r.felter) felter = { ...r.felter };  // foerste aendring i denne robot: kopiér
      felter[navn] = { ...post, advarsel: ny };
      aendret = true;
    }

    let anvendelse = r.anvendelse;
    if (anvendelse && typeof anvendelse === 'object' && anvendelse.note_i18n) {
      const ny = loesTekst(anvendelse.note, anvendelse.note_i18n);
      if (ny !== anvendelse.note) { anvendelse = { ...anvendelse, note: ny }; aendret = true; }
    }

    let billede = r.billede;
    if (billede && typeof billede === 'object' && billede.note_i18n) {
      const ny = loesTekst(billede.note, billede.note_i18n);
      if (ny !== billede.note) { billede = { ...billede, note: ny }; aendret = true; }
    }

    return aendret ? { ...r, felter, anvendelse, billede } : r;
  });
}

/* Taeller tal med og uden kilde paa tvaers af kataloget. Ligger som funktion,
   fordi tallet nu skal bruges TO steder: i byggets logudskrift til sidst, og
   paa sprogvaelgeren, som stanser "TAL MED KILDE" i sit hoved. To kopier af
   loekken ville vaere den samme faelde som Aa12's regex-duplikering - de
   divergerer ved den tredje redigering, og saa staar der ét tal paa siden og
   et andet i loggen, uden at nogen test kan se forskel. Haard begraensning 2
   kraever, at sidens tal er REGNET; den kraever ogsaa, at det er regnet ét sted. */
function taelKilder(robotter) {
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
  return { medKilde, udenKilde, sekundaere };
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
  //
  // normaliserVisningsEnheder() koeres KUN her, ALDRIG i validate.mjs (spor/
  // enheder, se skema.mjs): den omsaetter fx laengde til kanonisk cm paa
  // bygget's egen i-hukommelse-kopi, saa validatorens R5/R9 blive ved med at
  // se producentens raa enhed, mens ALLE skabeloner (kort, robotside,
  // sammenligning), der laeser samme robotter-array, automatisk viser én
  // enhed pr. felt.
  const robotter = filer.map((f) => {
    try { return normaliserVisningsEnheder(normaliserRobot(parseYaml(fs.readFileSync(f, 'utf8'), f))); }
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
  let kortIKatalog = 0;
  // Fyldes i sprogloekken herunder, laest af den sprogneutrale rod-404 efter
  // loekken (spor/404). Samme genbrug som RODSPROG laengere nede: teksten
  // hentes fra data/i18n/, skrives ikke to gange.
  const rod404Sprog = [];

  for (const sprogkode of SPROG) {
    const i18n = lavSprog(sprogkode);
    const { T, t } = i18n;
    const hjaelp = lavHjaelp({ sprogkode, T, t, tf: i18n.tf });

    // spor/i18nfelt (Å98 spor A), punkt 3: ÉN sprogoploest kopi af
    // robotterne, brugt af BAADE ctx.robotter (grund() herunder, laest af
    // katalog- og sammenligningsskabelonen) OG robotsidernes egen loekke
    // (`for (const robot of robotterSprog)` nedenfor) - se
    // sprogoploesRobotter()'s kommentar for hvorfor en kopi og ikke en mutation.
    const robotterSprog = sprogoploesRobotter(robotter, sprogkode);

    // ctx.url baerer BAADE stien og opslag pr. sidetype. Skabelonerne slaar op
    // med url.robot(slug) / url.katalog og skal ikke selv taelle mapper -
    // en haandregnet '../../' er den slags fejl, der ikke ses foer i browseren.
    const grund = (sti) => {
      const dybde = 1 + sti.split('/').filter(Boolean).length;
      const op = '../'.repeat(dybde);
      const her = `${op}${sprogkode}/`;
      return {
        robotter: robotterSprog, producenter, i18n, sprog: sprogkode, hjaelp, naevnere, d4,
        url: {
          sti, dybde, op,
          // spor/oversigt (1. sep 2026): kataloget ER sprogroden - forsiden
          // (tools/skabelon/forside.mjs) er nedlagt, og der er dermed ingen
          // separat "forside"-adresse at pege paa laengere. Se PUNKT 1.
          katalog: her,
          sammenligning: `${her}sammenligning/`,
          producenter: `${her}producenter/`,
          robot: (slug) => `${her}robotter/${slug}/`,
          producent: (slug) => `${her}producenter/${slug}/`,
        },
      };
    };

    /* --- kataloget (spor/oversigt, 1. sep 2026): kataloget ER sprogroden ---
       JPK, ordret: "HELE oversigt-siden skal vaek". Forsiden
       (tools/skabelon/forside.mjs, dens seks-korts "Fra kataloget"-smagsproeve
       og "yderpunkter"-sektion) er slettet, ikke erstattet - kataloget flytter
       blot fra `<sprog>/robotter/` til `<sprog>/`, samme skabelon, samme
       udseende, ny adresse. `<sprog>/robotter/` faar derfor INGEN index-fil;
       kun robotundersiderne (robotter/<slug>/) bor der stadig. --- */
    {
      const ctx = grund('');
      const main0 = katalogSkabelon.render(ctx);
      kortIKatalog = taelKort(main0);
      paastaa(kortIKatalog === robotter.length,
        `kataloget (${sprogkode}) har ${kortIKatalog} kort, men der er ${robotter.length} datafiler.`);
      skrivFil(path.join(ud, sprogkode, 'index.html'), skal({
        sprogkode, T, t, sti: '', aktiv: '', script: true, harProducenter,
        titel: `${T.katalog_titel} · ${T.sted_navn}`,
        beskrivelse: T.sted_undertitel,
        stil: katalogSkabelon.hovedStil(ctx),
        main: main0,
      }));
      sider++;
    }

    /* --- sammenligningssiden (spor/lysbyg) --- */
    {
      const ctx = grund('sammenligning/');
      const main0 = sammenligningSkabelon.render(ctx);
      skrivFil(path.join(ud, sprogkode, 'sammenligning', 'index.html'), skal({
        sprogkode, T, t, sti: 'sammenligning/', aktiv: 'sammenligning/',
        script: 'sammenligning.js', harProducenter,
        titel: `${T.sammenligning_titel} · ${T.sted_navn}`,
        beskrivelse: T.sammenligning_lede,
        main: main0,
      }));
      sider++;
    }

    /* --- Om os (spor/omos, L61) ---------------------------------------------
       Stien er `om/` paa BEGGE sprog. Maalt foer valget: de tre bestaaende
       ruter bruger samme segment i dist/da og dist/en (robotter, sammenligning,
       producenter — identiske lister), saa et oversat `about/` ville vaere den
       foerste rute, der brood konventionen, og hreflang-parret ville skulle
       regnes i stedet for at falde ud af `sti`. */
    {
      const ctx = grund('om/');
      const main0 = omOsSkabelon.render(ctx);
      skrivFil(path.join(ud, sprogkode, 'om', 'index.html'), skal({
        sprogkode, T, t, sti: 'om/', aktiv: 'om/', harProducenter,
        titel: `${T.om_titel} · ${T.sted_navn}`,
        beskrivelse: T.om_beskrivelse,
        main: main0,
      }));
      sider++;
    }

    /* --- 404-siden, sprogspecifik variant (spor/404) ------------------------
       Skrevet som en FLAD fil (dist/<sprog>/404.html), IKKE i en undermappe
       med index.html: en statisk vaert leder efter en fil ved navn 404.html.
       sti='' holder mappedybden lig forsidens (grund('') herover er allerede
       beregnet til dybde 'dist/<sprog>/', samme mappe filen faktisk lander i),
       saa alle relative stier (system.css, kataloglinket, sprogskiftet i
       foden) peger rigtigt uden en saerlig regning. aktiv:null, fordi INGEN
       af navigationens punkter er "den aktuelle side" for en 404 - se
       tools/skabelon/fejl404.mjs for hele begrundelsen (fillayout, tone). */
    {
      const ctx = grund('');
      const main0 = fejl404Skabelon.render(ctx);
      skrivFil(path.join(ud, sprogkode, '404.html'), skal({
        sprogkode, T, t, sti: '', aktiv: null, harProducenter,
        titel: `${t('fejl404_titel')} · ${T.sted_navn}`,
        beskrivelse: t('fejl404_beskrivelse'),
        main: main0,
      }));
      sider++;
    }
    rod404Sprog.push({
      kode: sprogkode, titel: t('fejl404_titel'),
      forklaring: t('fejl404_forklaring'), knap: t('fejl404_knap'),
    });

    /* --- robotsiderne --- */
    for (const robot of robotterSprog) {
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
        // aktiv:'' (spor/oversigt): kataloget bor nu paa sprogroden, saa dets
        // nav-punkt bruger href '' - samme vaerdi som en robotside skal matche
        // for stadig at vise "Katalog" som den aktive sektion, den er en del af.
        sprogkode, T, t, sti, aktiv: '', harProducenter,
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
          // L27/fund/FUND-detalje.md opgave 4c: sorterAnvendelse() lagger
          // vaerdierne i den kanoniske orden, saa to filer med de samme
          // kategorier i modsat YAML-raekkefoelge giver samme indeks.
          // Samme kald og samme raekkefoelge (tilstandAf foer sortering)
          // som tools/skabelon/side.mjs' hjaelp.anvendelse().
          vaerdi: sorterAnvendelse((Array.isArray(a.vaerdi) ? a.vaerdi : [a.vaerdi]).map((v) => tilstandAf(v) ?? v)),
          citat: a.citat === undefined ? [] : (Array.isArray(a.citat) ? a.citat : [a.citat]),
          kilde: a.kilde ?? null, hentet: a.hentet ?? null,
        },
        kilder: lavKilder(r).liste.map((k) => ({ bogstav: k.bogstav, url: k.url, hentet: k.hentet, sekundaer: k.sekundaer })),
        taethed: Object.fromEntries(naevnere.map((n) => [n, taethed(r, n, d4).pct])),
        felter: f,
        // /sammenligning/'s fulde felt-for-felt-visning (spor/lysbyg): alle
        // FELTNAVNE.length felter, ikke kun FILTER_FELTER's seks - se
        // feltVisning() ovenfor for hvorfor formen adskiller sig fra `felter`.
        alle_felter: Object.fromEntries(FELTNAVNE.map((n) => [n, feltVisning(n, r.felter[n])])),
      };
    }),
  };
  skrivFil(path.join(ud, 'robots.json'), JSON.stringify(indeks, null, 1));

  /* --- statiske aktiver. dist/ bygges KUN fra assets/. --- */
  for (const [fra, til] of [
    ['assets/system.css', 'system.css'],
    ['assets/generator.css', 'generator.css'],
    ['assets/katalog.js', 'katalog.js'],
    ['assets/sammenligning.js', 'sammenligning.js'],
    // Enhedsvalgets hukommelse (L60 udvidet, spor/enhed). Indlaeses direkte
    // af robotsiden, ikke gennem skallens `script`-parameter, som kun har
    // én plads - se robot.mjs' enhedsHukommelse().
    ['assets/enhed.js', 'enhed.js'],
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
  const ophavstal = {};
  for (const r of robotter) {
    const b = r.billede;
    if (!b || typeof b.fil !== 'string') continue;
    if (!brugteBilleder.has(b.fil)) brugteBilleder.set(b.fil, []);
    brugteBilleder.get(b.fil).push(r.slug);
    ophavstal[b.ophav] = (ophavstal[b.ophav] ?? 0) + 1;
  }
  for (const [fil, slugs] of brugteBilleder) {
    paastaa(kopieredeBilleder.has(fil),
      `${slugs.join(', ')} peger paa assets/${fil}, men filen naaede ikke dist/billeder/${fil}.`);
  }

  const { medKilde, udenKilde, sekundaere } = taelKilder(robotter);

  /* --- sprogvaelger paa roden ---------------------------------------------
     TYPESKILT (L57/L59). Roden var indtil 31. aug 2026 den ENESTE flade, intet
     redesignspor havde roert, fordi den ikke bruger en skabelon - JPK aabnede
     den og sagde med rette "det er jo den gamle side". Tre maalte defekter laa
     i den gamle blok, og alle tre er aarsagen til, at den saa gammel ud:

       1. `.t-hero` arver --sans = "Manrope lokal", som INGEN @font-face har
          siden spor/fundament. Overskriften faldt derfor tilbage til Segoe UI:
          roden stod bogstaveligt i en anden skrift end de 212 andre sider.
          Maalt i browseren: font-family = "Manrope lokal", Manrope, Segoe UI...
       2. `.t-hero` er font-weight:800, som Saira ikke har en fil til - samme
          syntetiske fedme, robotsiden allerede er rettet for (16b ovenfor).
       3. `<main class="rum hero">` satte begge klasser paa SAMME element, men
          generator.css' regel er `.hero .rum{padding-block:...}` - en
          EFTERKOMMER-selektor. Den ramte aldrig, saa siden laa klistret op i
          hjoernet uden en eneste pixels luft foroven.

     Blokken er derfor selvbaerende: den bruger hverken .rum, .hero eller
     .t-hero, men saetter sin egen form i et inline <style>. Se rapportens
     afsnit om CSS, der boer flyttes til system.css, naar spor/topbar slipper
     filen - den ejer den lige nu, saa reglerne kan ikke lægges der endnu.

     TALLENE ER REGNET, ikke tastet (haard begraensning 2, L30/D7): POSTER og
     LANDE af `robotter`, TAL MED KILDE af taelKilder() - samme funktion, som
     byggets logudskrift bruger - og NYESTE KILDE af den seneste hentedato paa
     et felt. Et haardkodet "77" ville vaere forkert, foerste gang kataloget
     vokser. tests/dele/39-rod.mjs:39.2 vogter det ved at bygge mod
     proevedatasaettets 3 robotter: et tastet 77 ville staa sort paa hvidt. */
  const rodLande = new Set(robotter.map((r) => r.producentland).filter(Boolean));
  /* NYESTE KILDE = den seneste hentedato paa et FELT. Tre valg, som alle tre
     kunne vaere gaaet galt, og som derfor staar skrevet:

     1. Ikke byggedatoen. Den ville skifte ved hvert byg (ikke-deterministisk
        output, stoejende diff) og desuden love en friskhed, data ikke har.
     2. Kun felter, ikke billeder. Maalt 31. aug 2026: de nyeste datoer i
        repoet er 22 stk. 2026-08-26, og de ligger ALLE i `billede:`-blokke;
        seneste dato paa et felt er 2026-08-25. "Kilde" betyder gennem hele
        projektet et TALS kilde (kildemaerker, "1110 tal med kilde"), saa
        stemplet daekker samme population som stemplet lige under det.
     3. Etiketten siger "Nyeste kilde", ikke "Udgave". "Udgave 2026-08-25"
        kan laeses som "hele vaerket er fra den dato"; det er falsk, for
        kilderne er hentet over et spand. "Nyeste" siger praecis, hvad
        tallet er - den ene yderste dato - og lover intet om resten. */
  let rodUdgave = '';
  for (const r of robotter) {
    for (const n of FELTNAVNE) {
      const p = r.felter[n];
      if (p && typeof p === 'object' && typeof p.hentet === 'string' && p.hentet > rodUdgave) rodUdgave = p.hentet;
    }
  }
  /* Et stempel uden en vaerdi stanses IKKE. Foerste udgave af blokken faldt
     her: den havde en paastaa(), der kraevede baade lande og en dato, og den
     faeldede bygget med exit 1 paa tests/dele/03-billedkaede.mjs' S1-datasaet
     - én robot, hvis eneste felt er `egenvaegt: ikke_oplyst`. Et saadant
     datasaet har ingen `hentet` paa et FELT (kun paa `billede:`, som med
     vilje ikke taelles), saa rodUdgave var tom, og paastanden kastede.
     Mekanismen kort: bygget faldt, fordi assertionen kraevede et tal, data
     ikke behoever at have - ikke fordi data var forkert.
     Rettelsen er ogsaa den rigtige efter haard begraensning 5: et tomt
     stempel ville staa som "0" eller som en blank, og hverken "0" eller
     blank er sandt om noget, ingen har oplyst. Raekken udelades. */
  /* Dansk tusindtalsseparator er punktum: 1110 -> "1.110". Skrevet i haanden
     frem for toLocaleString('da-DK'), fordi generatoren er afhaengighedsfri og
     ikke skal afhaenge af, at Node er bygget med fuld ICU - et miljoeskifte
     ville ellers kunne aendre sidens tekst uden at nogen roerte koden.
     TYPE-stemplet ("QUAD-77") er droppet: det bar SAMME tal som POSTER, og en
     plade, hvis hele tese er at hvert tal er et selvstaendigt maalt faktum,
     maa ikke stanse det samme tal to gange. */
  const rodTal = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  const rodStempler = [
    ['Poster', rodTal(robotter.length)],
    ['Lande', rodLande.size > 0 ? rodTal(rodLande.size) : null],
    ['Tal med kilde', medKilde > 0 ? rodTal(medKilde) : null],
    ['Nyeste kilde', rodUdgave || null],
  ].filter(([, v]) => v !== null);

  // Sproglinjerne staar i ét array, saa de to celler er bygget af SAMME kode.
  // Det er ikke en bekvemmelighed: se rapportens punkt om ligevaerdighed - en
  // primaer/sekundaer-knap (den gamle .videre + .videre--stille) gjorde engelsk
  // til andenrangs paa den ene flade, hvor sprogvalget skal vaere ligevaerdigt.
  const RODSPROG = [
    { kode: 'da', navn: 'Dansk', linje: 'Opslagsværk med kilde og dato på hvert tal.', handling: 'Åbn kataloget' },
    { kode: 'en', navn: 'English', linje: 'Reference work with a source and a date on every number.', handling: 'Open the catalogue' },
  ];
  paastaa(RODSPROG.length === SPROG.length && RODSPROG.every((s) => SPROG.includes(s.kode)),
    `sprogvaelgeren tegner ${RODSPROG.length} celle(r), men bygget har ${SPROG.length} sprog `
    + `(${SPROG.join(', ')}). Et nyt sprog skal ogsaa faa en vej ind fra roden.`);

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
<style>
/* Sprogvaelgerens egen form. Midlertidigt inline: assets/system.css ejes af
   spor/topbar i skrivende stund. Radius holdes paa skalaen 0/2/6/8/12
   (tests/dele/31-pudsning.mjs), skriftgulvet paa 8px, og vaegten naar aldrig
   800 - de tre vaern, briefet satte. */
.rod{min-height:100dvh;display:grid;place-items:center;padding:var(--r5) var(--kant);box-sizing:border-box}
.rod__plade{width:100%;max-width:880px;background:var(--panel);border-radius:2px;
  box-shadow:inset 0 0 0 1px var(--linje), inset 0 1px 0 var(--stans);overflow:hidden}
/* Hovedet: navnet stanset til venstre, maerkepladen til hoejre - comp'ens
   .plade__hoved-grammatik (retninger/nyverden/typeskilt.css 5a). */
.rod__hoved{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:var(--r5);
  align-items:start;padding:var(--r5);border-bottom:1px solid var(--linje)}
.rod__navne{margin:0;min-width:0}
.rod__navn{display:block;font-family:var(--mono);font-weight:700;
  font-size:clamp(26px,3.4vw,44px);line-height:1.02;letter-spacing:-.018em;
  text-transform:uppercase;color:var(--blaek);text-wrap:balance}
/* Andet sprogs navn i samme graad og vaegt - kun rillen skiller dem. Ingen af
   de to sprog maa se ud som en undertitel til det andet.
   width:fit-content, saa rillen slutter ved teksten. Uden den spaendte den
   over hele hovedkolonnen og laeste som en tilfaeldig streg, der skilte
   titlen fra ingenting - set paa skaermbilledet ved baade 1440 og 390. */
.rod__navn{width:fit-content;max-width:100%}
.rod__navn + .rod__navn{margin-top:7px;padding-top:7px;border-top:1px solid var(--linje)}
.rod__stempler{display:grid;grid-template-columns:auto auto;gap:3px var(--r4);margin:0;align-self:start}
.rod__stempler dt{font-family:var(--mono);font-size:10.5px;font-weight:600;letter-spacing:.13em;
  text-transform:uppercase;color:var(--blaek3);white-space:nowrap}
.rod__stempler dd{margin:0;font-family:var(--mono);font-size:13.5px;font-weight:600;
  text-align:right;color:var(--blaek);font-variant-numeric:tabular-nums}
/* De to veje ind. Samme bredde, samme vaegt, samme alt - kun ordene skifter. */
.rod__veje{display:grid;grid-template-columns:1fr 1fr}
.rod__vej{display:grid;align-content:start;gap:var(--r2);padding:var(--r5);
  text-decoration:none;color:var(--blaek);border-left:3px solid transparent;min-width:0}
.rod__vej + .rod__vej{box-shadow:inset 1px 0 0 var(--linje)}
.rod__kode{font-family:var(--mono);font-size:10.5px;font-weight:600;letter-spacing:.16em;
  text-transform:uppercase;color:var(--blaek3)}
.rod__sprog{font-family:var(--mono);font-size:23px;font-weight:700;line-height:1.05;letter-spacing:-.01em}
.rod__linje{font-family:var(--manual);font-size:14px;line-height:1.5;color:var(--blaek2);margin:0}
.rod__handling{display:inline-flex;align-items:center;gap:8px;margin-top:var(--r2);
  font-family:var(--mono);font-size:12.5px;font-weight:600;letter-spacing:.05em;text-transform:uppercase}
.rod__pil{width:15px;height:15px;flex:none}
/* Afmaerkningsgul er KUN markering (MANIFEST §Paletten): den stansede kant
   viser, hvilken vej der er valgt - den pynter ingen steder. */
.rod__vej:hover{background:var(--bund);border-left-color:var(--accent)}
.rod__vej:focus-visible{outline:3px solid var(--accent);outline-offset:-3px;background:var(--bund)}
.rod__vej:hover .rod__pil,.rod__vej:focus-visible .rod__pil{transform:translateX(3px)}
.rod__pil{transition:transform .12s ease-out}
@media (prefers-reduced-motion:reduce){.rod__pil{transition:none}}
@media (max-width:720px){
  .rod__hoved{grid-template-columns:1fr;gap:var(--r4);padding:var(--r4)}
  .rod__stempler{justify-items:start;grid-template-columns:auto auto;justify-content:start;gap:2px var(--r3)}
  .rod__stempler dd{text-align:left}
  .rod__veje{grid-template-columns:1fr}
  .rod__vej{padding:var(--r4)}
  .rod__vej + .rod__vej{box-shadow:inset 0 1px 0 var(--linje)}
}
</style>
</head>
<body>
<main class="rod" id="hoved">
<div class="rod__plade">
<div class="rod__hoved">
<h1 class="rod__navne">
<span class="rod__navn" lang="da">Firbenede robotter</span>
<span class="rod__navn" lang="en">Quadruped robots</span>
</h1>
<dl class="rod__stempler">
${rodStempler.map(([n, v]) => `<dt>${esc(n)}</dt><dd>${esc(String(v))}</dd>`).join('\n')}
</dl>
</div>
<div class="rod__veje">
${RODSPROG.map((s) => `<a class="rod__vej" href="${s.kode}/" hreflang="${s.kode}" lang="${s.kode}">
<span class="rod__kode">${esc(s.kode)}</span>
<span class="rod__sprog">${esc(s.navn)}</span>
<span class="rod__linje">${esc(s.linje)}</span>
<span class="rod__handling">${esc(s.handling)}<svg class="rod__pil" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"/></svg></span>
</a>`).join('\n')}
</div>
</div>
</main>
</body>
</html>
`);
  sider++;

  /* --- den sprogneutrale rod-404 (spor/404) -------------------------------
     Selvbaerende, som roden herover - se tools/skabelon/fejl404.mjs for
     hvorfor filen ligger uden for sti-systemet og hvilken vaertsadfaerd de to
     404-varianter (denne og den sprogspecifikke) tilsammen daekker.
     paastaa() vogter samme forudsaetning som RODSPROG lidt laengere oppe:
     ét indslag pr. sprog, ikke flere, ikke faerre. */
  paastaa(rod404Sprog.length === SPROG.length && rod404Sprog.every((s) => SPROG.includes(s.kode)),
    `rod-404 baerer ${rod404Sprog.length} sprog, men bygget har ${SPROG.length} `
    + `(${SPROG.join(', ')}). Et nyt sprog skal ogsaa faa sin egen fejl404_-tekst.`);
  skrivFil(path.join(ud, '404.html'), fejl404Skabelon.renderRod(rod404Sprog));
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
    + `over ${robotter.length} datafiler. Kildemaerker: ${medKilde} tal med kilde, ${udenKilde} uden.`);
  console.log(`Kort i kataloget (sprogroden): ${kortIKatalog} · sekundaere kilder: ${sekundaere} felter · `
    + `billeder kopieret fra assets/: ${billeder} (media/ indgaar aldrig)`);
  const ophavstekst = Object.keys(ophavstal).length
    ? Object.entries(ophavstal).map(([o, n]) => `${o}: ${n}`).join(', ')
    : 'ingen robotpost peger paa en fil';
  console.log(`Billedfelter: ${brugteBilleder.size} fil(er) brugt af ${
    [...brugteBilleder.values()].reduce((a, b) => a + b.length, 0)} robot(ter) · ${ophavstekst}`);
  console.log(`Billedled i dist/: ${picture} <picture> · ${tommePlader} tomme plader `
    + `(${robotter.length} robotter x ${SPROG.length} sprog x 2 sider = `
    + `${robotter.length * SPROG.length * 2} led plus producentsidernes kort)`);
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
