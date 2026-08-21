#!/usr/bin/env node
/**
 * tools/build.mjs — data/robots/*.yaml  ->  dist/
 *
 * Nul afhaengigheder. Statisk HTML pr. sprog. Siden virker uden JavaScript:
 * hele kataloget renderes i en tabel, og JS tilfoejer kun filtrering.
 *
 *   node tools/build.mjs
 *   node tools/build.mjs --data=<mappe> --ud=<mappe>
 *   node tools/build.mjs --naevner=29,31        D7 er ikke afgjort - begge vises
 *   node tools/build.mjs --type-uden-model=tael D4 er ikke afgjort
 *   node tools/build.mjs --spring-validering-over   (kun til fejlsoegning)
 *
 * Bygget koerer validate.mjs foerst og stopper, hvis den fejler. Det er den
 * mekaniske haandhaevelse af "opfind aldrig tal": et talfelt uden enhed eller
 * kilde kan ikke naa dist/.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { parseYaml, YamlFejl } from './yaml.mjs';
import {
  FELTER, FELTNAVNE, GRUPPER, KATALOG_FELTER, FILTER_FELTER, SPROG, STATUS_VAERDIER,
  tilstandAf, normaliserRobot,
} from './skema.mjs';
import { main as validerMain, taethed, laesFlag, findFiler, naevnereFra } from './validate.mjs';

const rod = process.cwd();
const iDag = new Date().toISOString().slice(0, 10);

/* ------------------------------------------------------------------ hjaelp */

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const attr = (s) => esc(s);

function skrivFil(fil, indhold) {
  fs.mkdirSync(path.dirname(fil), { recursive: true });
  fs.writeFileSync(fil, indhold, 'utf8');
}

function ryd(mappe) {
  if (fs.existsSync(mappe)) fs.rmSync(mappe, { recursive: true, force: true });
}

/** Operatoren skal SES. "> 40 kg", ikke "40 kg" (regel 4). */
const OP_TEGN = { '>': '>', '>=': '≥', '<': '<', '<=': '≤', '~': '≈', '±': '±' };

function tal(n, sprogkode) {
  const locale = sprogkode === 'da' ? 'da-DK' : 'en-GB';
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 3 }).format(n);
}

function erForaeldet(hentet) {
  if (typeof hentet !== 'string') return false;
  const d = new Date(hentet);
  if (Number.isNaN(d.getTime())) return false;
  const graense = new Date();
  graense.setFullYear(graense.getFullYear() - 1);
  return d < graense;
}

/* --------------------------------------------------------------- i18n */

function laesI18n(sprogkode) {
  const fil = path.join(rod, 'data/i18n', `${sprogkode}.json`);
  if (!fs.existsSync(fil)) throw new Error(`Sprogfilen mangler: ${fil}`);
  const o = JSON.parse(fs.readFileSync(fil, 'utf8'));
  // En manglende oversaettelse skal fejle synligt, ikke lande som dansk paa /en/.
  return new Proxy(o, {
    get(m, n) {
      if (typeof n !== 'string') return undefined;
      if (n === '__raa') return m;
      if (!(n in m)) throw new Error(`data/i18n/${sprogkode}.json mangler noeglen "${n}"`);
      return m[n];
    },
  });
}

/**
 * Landenavne er tekst og hoerer derfor til i sprogfilerne, ikke i robottens YAML.
 * Skemaet skriver dem som "Kina"; her slaas de op som "land_Kina". Mangler noeglen,
 * vises den raa vaerdi, og bygget siger hoejt hvilken noegle der mangler — et ikke
 * oversat land skal vaere synligt, men ikke standse hele kataloget.
 */
const manglendeLande = new Set();
function land(T, vaerdi, sprogkode) {
  const n = 'land_' + vaerdi;
  if (n in T.__raa) return T.__raa[n];
  manglendeLande.add(`${sprogkode}: ${n}`);
  return vaerdi;
}

/* ------------------------------------------------- visning af én vaerdi */

/**
 * De fire tilstande skal SE forskellige ud - ikke kun have forskellig farve.
 * Hver af dem faar sit eget tegn, sin egen tekst og sin egen ramme, saa de ogsaa
 * kan skelnes i sort/hvid og af en skaermlaeser.
 */
function visTilstand(t, T) {
  const kort = {
    ikke_oplyst: ['—', T.tilstand_ikke_oplyst, T.tilstand_ikke_oplyst_forklaring, 'ikke-oplyst'],
    nej: ['✗', T.tilstand_nej, T.tilstand_nej_forklaring, 'nej'],
    kun_billede: ['◎', T.tilstand_kun_billede, T.tilstand_kun_billede_forklaring, 'kun-billede'],
  }[tilstandAf(t) ?? t];
  if (!kort) return `<span class="tilstand">${esc(String(t))}</span>`;
  const [tegn, tekst, forklaring, klasse] = kort;
  return `<span class="tilstand tilstand--${klasse}" title="${attr(forklaring)}">` +
    `<span class="tilstand__tegn" aria-hidden="true">${tegn}</span>${esc(tekst)}</span>`;
}

function visKilde(post, T) {
  if (!post.kilde) return '';
  let vaert = post.kilde;
  try { vaert = new URL(post.kilde).hostname.replace(/^www\./, ''); } catch { /* vises raa */ }
  const gammel = erForaeldet(post.hentet);
  return `<span class="herkomst">` +
    `<a class="herkomst__kilde" href="${attr(post.kilde)}" rel="nofollow noopener external">` +
    `${esc(T.kilde)}: ${esc(vaert)}</a>` +
    `<span class="herkomst__dato${gammel ? ' herkomst__dato--gammel' : ''}"` +
    (gammel ? ` title="${attr(T.foraeldet)}"` : '') +
    `> · ${esc(T.hentet)} <time datetime="${attr(post.hentet)}">${esc(post.hentet)}</time>` +
    (gammel ? ' ⚠' : '') + `</span>` +
    (post.kildetype === 'sekundaer' ? `<span class="herkomst__type">sekundaer</span>` : '') +
    `</span>`;
}

/** Selve tallet med operator, enhed, interval og imperial. */
function visTal(post, sprogkode, T) {
  const enhed = post.enhed ? ` <span class="enhed">${esc(post.enhed)}</span>` : '';
  // Regel 4: operatoren skal SES — ogsaa foran et interval. Unitree skriver
  // "ca. 1-2 t" om Go2's driftstid, og uden "≈" bliver forbeholdet til vores
  // praecision.
  const op = post.operator ? `<span class="operator">${esc(OP_TEGN[post.operator] ?? post.operator)}</span> ` : '';
  let kerne;
  if (post.min !== undefined) {
    // Regel 5: et interval er ikke sit gennemsnit.
    kerne = `${op}${tal(post.min, sprogkode)}–${tal(post.maks, sprogkode)}${enhed}`;
  } else {
    const cifre = post.vaerdi === 0 ? `<span class="nul">0</span>` : tal(post.vaerdi, sprogkode);
    kerne = `${op}${cifre}${enhed}`;
  }
  let ud = `<span class="vaerdi">${kerne}</span>`;
  if (post.vaerdi === 0) {
    ud += ` <span class="maerke maerke--nul" title="${attr(T.tilstand_nul_forklaring)}">${esc(T.tilstand_nul)}</span>`;
  }
  if (post.vaerdi_imperial !== undefined) {
    ud += ` <span class="imperial">(${tal(post.vaerdi_imperial, sprogkode)} ${esc(post.enhed_imperial ?? '')})</span>`;
  }
  return ud;
}

/**
 * Varianterne ved navn. Lite3's fire varianter baerer 5, 4,5, 4 og 2,5 kg — de er
 * fire maskiner, ikke pynt, og blokken maa derfor ikke falde ud af visningen.
 * Vaerdien ovenfor er én af dem; her staar de alle sammen, saa laeseren kan se,
 * hvilken kolonne tallet kommer fra.
 */
function visVarianter(v, sprogkode, T) {
  if (!v.varianter) return '';
  const somTekst = (x) => {
    if (typeof x === 'number') return tal(x, sprogkode);
    if (typeof x === 'boolean') return x ? T.ja : T.nej;
    return String(x);
  };
  const raekker = Object.entries(v.varianter)
    .map(([n, x]) => `<div class="variant"><dt>${esc(n)}</dt><dd>${esc(somTekst(x))}</dd></div>`)
    .join('');
  return `<div class="varianter"><p class="varianter__titel">${esc(T.varianter)}</p>` +
    `<dl class="varianter__liste">${raekker}</dl></div>`;
}

function visPost(navn, v, sprogkode, T) {
  if (typeof v === 'string') return visTilstand(v, T);
  const spec = FELTER[navn];
  let ud = '';

  const tilstand = tilstandAf(v.vaerdi);
  if (tilstand) {
    // Skemaudvidelse 1: tilstanden med herkomst. Den skal SE ud som den bare
    // tilstand — ellers ville "ikke oplyst" pludselig have to udseender — men
    // den baerer kilde, hentedato og forbehold nedenfor.
    ud = visTilstand(tilstand, T);
  } else if (spec.art === 'jaNej') {
    ud = `<span class="vaerdi vaerdi--${v.vaerdi ? 'ja' : 'nej'}">` +
      `<span class="tilstand__tegn" aria-hidden="true">${v.vaerdi ? '✓' : '✗'}</span>` +
      `${esc(v.vaerdi ? T.ja : T.nej)}</span>`;
  } else if (spec.art === 'liste') {
    ud = `<span class="vaerdi">${v.vaerdi.map((x) => `<code>${esc(x)}</code>`).join(' ')}</span>`;
  } else if (typeof v.vaerdi === 'string') {
    ud = `<span class="vaerdi">${esc(v.vaerdi)}</span>`;
    // Et tekstfelt kan baere et maalbart interval ved siden af producentens
    // ordlyd (Spots "ureguleret DC 35-58,8 V"). Det skal med, ellers er det data,
    // ingen kan se.
    if (v.min !== undefined) {
      ud += ` <span class="vaerdi vaerdi--afledt">${tal(v.min, sprogkode)}–${tal(v.maks, sprogkode)}` +
        (v.enhed ? ` <span class="enhed">${esc(v.enhed)}</span>` : '') + `</span>`;
    }
  } else {
    ud = visTal(v, sprogkode, T);
  }

  if (v.ved_last !== undefined) {
    const ukendt = typeof v.ved_last === 'string' || tilstandAf(v.ved_last.vaerdi);
    ud += ukendt
      ? ` <span class="betingelse">(${esc(T.ved_last_ukendt)})</span>`
      : ` <span class="betingelse">(${esc(T.ved_last)} ${tal(v.ved_last.vaerdi, sprogkode)} ${esc(v.ved_last.enhed ?? '')})</span>`;
  }
  // Advarslen staar VED SIDEN AF vaerdien, ikke i en fodnote (regel 9).
  if (v.advarsel) {
    ud += `<span class="advarsel"><span aria-hidden="true">⚠</span> ` +
      `<strong>${esc(T.advarsel)}:</strong> ${esc(v.advarsel)}</span>`;
  }
  if (v.note) ud += `<span class="note">${esc(v.note)}</span>`;
  ud += visVarianter(v, sprogkode, T);
  ud += visKilde(v, T);
  return ud;
}

/** Kort, ensrettet visning til katalogtabellen - uden kilde og advarsel. */
function visKort(navn, v, sprogkode, T) {
  if (v === undefined) return visTilstand('ikke_oplyst', T);
  if (typeof v === 'string') return visTilstand(v, T);
  const spec = FELTER[navn];
  const tilstand = tilstandAf(v.vaerdi);
  // En dokumenteret tilstand ser ud som tilstanden - kilden staar paa detaljesiden.
  if (tilstand) return visTilstand(tilstand, T);
  if (spec.art === 'jaNej') {
    return `<span class="vaerdi vaerdi--${v.vaerdi ? 'ja' : 'nej'}">` +
      `<span class="tilstand__tegn" aria-hidden="true">${v.vaerdi ? '✓' : '✗'}</span>` +
      `${esc(v.vaerdi ? T.ja : T.nej)}</span>`;
  }
  if (spec.art === 'liste') return `<span class="vaerdi">${esc(v.vaerdi.join(', '))}</span>`;
  if (typeof v.vaerdi === 'string') return `<span class="vaerdi">${esc(v.vaerdi)}</span>`;
  return visTal(v, sprogkode, T)
    + (v.varianter ? ` <span class="maerke maerke--varianter" title="${attr(Object.entries(v.varianter).map(([n, x]) => `${n}: ${x}`).join(' · '))}">${esc(T.varianter_kort)}</span>` : '')
    + (v.advarsel ? ` <span class="maerke maerke--advarsel" title="${attr(v.advarsel)}">⚠</span>` : '');
}

/* ----------------------------------------------------------------- sider */

function hoved({ titel, sprogkode, dybde, alternativer, beskrivelse }) {
  const op = '../'.repeat(dybde);
  const alt = alternativer
    .map((a) => `  <link rel="alternate" hreflang="${attr(a.sprog)}" href="${attr(a.href)}">`)
    .join('\n');
  return `<!doctype html>
<html lang="${attr(sprogkode)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titel)}</title>
<meta name="description" content="${attr(beskrivelse)}">
${alt}
  <link rel="alternate" hreflang="x-default" href="${attr(alternativer[0].href)}">
<link rel="stylesheet" href="${op}stil.css">
</head>
<body>
`;
}

function fod(T, sprogkode, dybde, andetSprogHref) {
  return `<footer class="fod">
<p>${esc(T.ingen_forhandler)}</p>
<p>${esc(T.udgiver)} · <a href="${attr(andetSprogHref)}" hreflang="${sprogkode === 'da' ? 'en' : 'da'}">${esc(T.andet_sprog)}</a></p>
</footer>
</body>
</html>
`;
}

/**
 * Producentens egen anvendelsesinddeling.
 *
 * Citatet vises SAMMEN MED kategorien, altid, aldrig som et tooltip. Uden det
 * synlige citat ville en laeser ikke kunne se forskel paa producentens hylde og
 * vores vurdering — og saa var feltet blevet det, CLAUDE.md begraensning 6 forbyder.
 * Derfor er der ingen kompakt visning: kan citatet ikke vises, vises kategorien ikke.
 */
/** Anvendelsen i robots.json. Formen er den samme uanset hvad YAML'en skrev. */
function anvendelseTilIndeks(a) {
  if (a === undefined) return { vaerdi: ['ikke_oplyst'], citat: [] };
  const raa = typeof a === 'string' ? { vaerdi: a } : a;
  const vaerdier = Array.isArray(raa.vaerdi) ? raa.vaerdi : [raa.vaerdi];
  const citater = raa.citat === undefined ? []
    : (Array.isArray(raa.citat) ? raa.citat : [raa.citat]);
  return {
    vaerdi: vaerdier.map((v) => tilstandAf(v) ?? v),
    citat: citater,
    kilde: raa.kilde ?? null,
    hentet: raa.hentet ?? null,
  };
}

function anvendelseBlok(robot, T) {
  const a = robot.anvendelse;
  if (a === undefined) return '';
  const raa = typeof a === 'string' ? { vaerdi: a } : a;
  const vaerdier = Array.isArray(raa.vaerdi) ? raa.vaerdi : [raa.vaerdi];
  const erIkkeOplyst = vaerdier.length === 1 && tilstandAf(vaerdier[0]) === 'ikke_oplyst';

  const maerker = erIkkeOplyst
    ? `<span class="tilstand tilstand--ikke_oplyst" title="${attr(T.tilstand_ikke_oplyst_forklaring)}">`
      + `${esc(T.tilstand_ikke_oplyst)}</span>`
    : vaerdier.map((v) => `<span class="anvendelse__maerke anvendelse__maerke--${attr(v)}">`
      + `${esc(T['anvendelse_' + v])}</span>`).join(' ');

  const citater = raa.citat === undefined ? []
    : (Array.isArray(raa.citat) ? raa.citat : [raa.citat]);
  const citatDel = citater.length
    ? `<blockquote class="anvendelse__citat"><p class="anvendelse__citat-etikette">`
      + `${esc(T.anvendelse_citat)}</p>`
      + citater.map((c) => `<p>${esc(c)}</p>`).join('') + `</blockquote>`
    : '';

  const kildeDel = raa.kilde
    ? `<p class="anvendelse__kilde"><a href="${attr(raa.kilde)}" rel="nofollow noopener">`
      + `${esc(T.kilde)}</a>${raa.hentet ? ` · ${esc(T.hentet)} ${esc(raa.hentet)}` : ''}</p>`
    : '';

  const noteDel = raa.note ? `<p class="anvendelse__note">${esc(raa.note)}</p>` : '';

  return `<section class="gruppe anvendelse">
<h2>${esc(T.anvendelse_titel)}</h2>
<p class="anvendelse__vaerdi">${maerker}</p>
${citatDel}
${kildeDel}
${noteDel}
<p class="anvendelse__forklaring">${esc(T.anvendelse_forklaring)}</p>
</section>
`;
}

function taethedBlok(robot, naevnere, d4, T, sprogkode) {
  const dele = naevnere.map((n) => {
    const x = taethed(robot, n, d4);
    return `<span class="taethed__tal"><strong>${x.pct} %</strong> ` +
      `<span class="taethed__brok">${x.udfyldt}/${x.naevner}</span></span>`;
  });
  return `<div class="taethed">
<h3>${esc(T.taethed_titel)}</h3>
<p class="taethed__tal-raekke">${dele.join(' ')}</p>
<p class="taethed__note">${esc(T.taethed_forklaring)}</p>
<p class="taethed__note taethed__note--aaben">${esc(T.taethed_naevner_aaben)}</p>
</div>`;
}

function detaljeside(robot, sprogkode, T, naevnere, d4) {
  const dybde = 3; // /<sprog>/robotter/<slug>/
  const op = '../'.repeat(dybde);
  const andet = sprogkode === 'da' ? 'en' : 'da';
  const alternativer = SPROG.map((s) => ({ sprog: s, href: `${op}${s}/robotter/${robot.slug}/` }));
  const titel = `${robot.navn} — ${robot.producent}`;

  let ud = hoved({
    titel: `${titel} · ${T.sted_navn}`,
    sprogkode, dybde, alternativer,
    beskrivelse: `${titel}. ${T.sted_undertitel}`,
  });

  ud += `<header class="top">
<a class="top__hjem" href="${op}${sprogkode}/robotter/">${esc(T.til_katalog)}</a>
</header>
<main>
<article class="post">
<h1>${esc(robot.navn)}</h1>
<p class="post__meta">
<span>${esc(robot.producent)}</span>
<span>${esc(land(T, robot.producentland, sprogkode))}</span>
<span class="status status--${attr(robot.status)}">${esc(T['status_' + robot.status])}</span>
${robot.foerste_udgivelse ? `<span>${esc(String(robot.foerste_udgivelse))}</span>` : ''}
</p>
${taethedBlok(robot, naevnere, d4, T, sprogkode)}
${anvendelseBlok(robot, T)}`;

  for (const gruppe of GRUPPER) {
    const navne = FELTNAVNE.filter((n) => FELTER[n].gruppe === gruppe);
    if (!navne.length) continue;
    ud += `<section class="gruppe">
<h2>${esc(T['gruppe_' + gruppe])}</h2>
<dl class="felter">
`;
    for (const navn of navne) {
      const v = robot.felter[navn];
      ud += `<div class="felt">
<dt>${esc(T['felt_' + navn])}</dt>
<dd>${v === undefined ? visTilstand('ikke_oplyst', T) : visPost(navn, v, sprogkode, T)}</dd>
</div>
`;
    }
    ud += `</dl>
</section>
`;
  }

  // noter er enten én tekst eller en liste af dem. En liste, der renderes med
  // esc() alene, bliver til "a,b" - en tavs sammenkoedning af to observationer.
  if (robot.noter) {
    const krop = Array.isArray(robot.noter)
      ? `<ul class="noter">${robot.noter.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>`
      : `<p>${esc(robot.noter)}</p>`;
    ud += `<section class="gruppe"><h2>${esc(T.noter)}</h2>${krop}</section>\n`;
  }

  ud += `</article>
</main>
`;
  ud += fod(T, sprogkode, dybde, `${op}${andet}/robotter/${robot.slug}/`);
  return ud;
}

function katalogside(robotter, sprogkode, T, naevnere, d4) {
  const dybde = 2; // /<sprog>/robotter/
  const op = '../'.repeat(dybde);
  const andet = sprogkode === 'da' ? 'en' : 'da';
  const alternativer = SPROG.map((s) => ({ sprog: s, href: `${op}${s}/robotter/` }));

  let ud = hoved({
    titel: `${T.katalog_titel} · ${T.sted_navn}`,
    sprogkode, dybde, alternativer,
    beskrivelse: T.sted_undertitel,
  });

  const lande = [...new Set(robotter.map((r) => r.producentland))]
    .map((l) => ({ vaerdi: l, tekst: land(T, l, sprogkode) }))
    .sort((a, b) => a.tekst.localeCompare(b.tekst, sprogkode));
  const statusser = STATUS_VAERDIER.filter((s) => robotter.some((r) => r.status === s));

  ud += `<header class="top">
<h1>${esc(T.sted_navn)}</h1>
<p class="top__under">${esc(T.sted_undertitel)}</p>
</header>
<main>
<h2>${esc(T.katalog_titel)} <span class="antal">${robotter.length} ${esc(T.katalog_antal)}</span></h2>

<form class="filter" id="filter" hidden>
<fieldset>
<legend>${esc(T.filter_titel)}</legend>
<label>${esc(T.filter_producentland)}
<select name="land" data-filter="producentland">
<option value="">${esc(T.filter_alle)}</option>
${lande.map((l) => `<option value="${attr(l.vaerdi)}">${esc(l.tekst)}</option>`).join('\n')}
</select></label>
<label>${esc(T.filter_status)}
<select name="status" data-filter="status">
<option value="">${esc(T.filter_alle)}</option>
${statusser.map((s) => `<option value="${attr(s)}">${esc(T['status_' + s])}</option>`).join('\n')}
</select></label>
<button type="button" id="ryd">${esc(T.filter_ryd)}</button>
</fieldset>
<p class="filter__tom" id="filter-tom" hidden>${esc(T.filter_ingen_traef)}</p>
</form>
<noscript><p class="note">${esc(T.katalog_uden_js)}</p></noscript>

<div class="tabel-rulle">
<table class="katalog">
<thead>
<tr>
<th scope="col">${esc(T.tabel_robot)}</th>
<th scope="col">${esc(T.tabel_producent)}</th>
<th scope="col">${esc(T.tabel_land)}</th>
<th scope="col">${esc(T.tabel_status)}</th>
${KATALOG_FELTER.map((n) => `<th scope="col">${esc(T['felt_' + n])}</th>`).join('\n')}
<th scope="col">${esc(T.tabel_taethed)}</th>
</tr>
</thead>
<tbody>
`;

  for (const r of robotter) {
    const t = naevnere.map((n) => {
      const x = taethed(r, n, d4);
      return `${x.pct} % <span class="taethed__brok">(${x.udfyldt}/${x.naevner})</span>`;
    }).join('<br>');
    ud += `<tr data-slug="${attr(r.slug)}" data-producentland="${attr(r.producentland)}" data-status="${attr(r.status)}">
<th scope="row"><a href="${attr(r.slug)}/">${esc(r.navn)}</a></th>
<td>${esc(r.producent)}</td>
<td>${esc(land(T, r.producentland, sprogkode))}</td>
<td><span class="status status--${attr(r.status)}">${esc(T['status_' + r.status])}</span></td>
${KATALOG_FELTER.map((n) => `<td>${visKort(n, r.felter[n], sprogkode, T)}</td>`).join('\n')}
<td class="taethed__celle">${t}</td>
</tr>
`;
  }

  ud += `</tbody>
</table>
</div>
<p class="note">${esc(T.sammenlign_advarsel)}</p>
<ul class="forklaring">
<li>${visTilstand('ikke_oplyst', T)} ${esc(T.tilstand_ikke_oplyst_forklaring)}</li>
<li>${visTilstand('nej', T)} ${esc(T.tilstand_nej_forklaring)}</li>
<li><span class="vaerdi"><span class="nul">0</span></span> <span class="maerke maerke--nul">${esc(T.tilstand_nul)}</span> ${esc(T.tilstand_nul_forklaring)}</li>
<li>${visTilstand('kun_billede', T)} ${esc(T.tilstand_kun_billede_forklaring)}</li>
</ul>
</main>
<script src="${op}filter.js" defer></script>
`;
  ud += fod(T, sprogkode, dybde, `${op}${andet}/robotter/`);
  return ud;
}

function forside(sprogkode, T, antal) {
  const dybde = 1;
  const op = '../';
  const andet = sprogkode === 'da' ? 'en' : 'da';
  const alternativer = SPROG.map((s) => ({ sprog: s, href: `${op}${s}/` }));
  let ud = hoved({
    titel: T.sted_navn, sprogkode, dybde, alternativer, beskrivelse: T.sted_undertitel,
  });
  ud += `<header class="top">
<h1>${esc(T.sted_navn)}</h1>
<p class="top__under">${esc(T.sted_undertitel)}</p>
</header>
<main>
<p><a class="knap" href="robotter/">${esc(T.nav_katalog)} — ${antal} ${esc(T.katalog_antal)}</a></p>
<p>${esc(T.taethed_forklaring)}</p>
</main>
`;
  ud += fod(T, sprogkode, dybde, `${op}${andet}/`);
  return ud;
}

/* ------------------------------------------------------------------ main */

function main(argv) {
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
      console.log('  De filer er EKSEMPLER. Dataagentens rigtige poster overtager, saa snart de ligger i data/robots/.');
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

  const ud = path.resolve(String(flag['ud'] ?? 'dist'));
  ryd(ud);

  let sider = 0;
  for (const sprogkode of SPROG) {
    const T = laesI18n(sprogkode);
    skrivFil(path.join(ud, sprogkode, 'index.html'), forside(sprogkode, T, robotter.length));
    sider++;
    skrivFil(path.join(ud, sprogkode, 'robotter', 'index.html'),
      katalogside(robotter, sprogkode, T, naevnere, d4));
    sider++;
    for (const r of robotter) {
      skrivFil(path.join(ud, sprogkode, 'robotter', r.slug, 'index.html'),
        detaljeside(r, sprogkode, T, naevnere, d4));
      sider++;
    }
  }

  // Lille indeks til klientside-filtrering. Kun de felter, der filtreres paa.
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
        // Tilstanden med herkomst filtrerer som tilstanden. Uden det her ville en
        // dokumenteret "nej" lande i indekset som {vaerdi: "nej"} og blive
        // sorteret som en tekst - og de tre tilstande ville kollapse i filteret.
        else if (tilstandAf(v.vaerdi)) f[n] = tilstandAf(v.vaerdi);
        else if (typeof v.vaerdi === 'boolean') f[n] = v.vaerdi;
        else if (v.min !== undefined) f[n] = { min: v.min, maks: v.maks, enhed: v.enhed };
        else f[n] = { vaerdi: v.vaerdi, enhed: v.enhed, operator: v.operator ?? null };
      }
      return {
        slug: r.slug, navn: r.navn, producent: r.producent,
        producentland: r.producentland, status: r.status,
        // Producentens egen inddeling. ALTID en liste, ogsaa naar der kun er én
        // vaerdi, og ogsaa naar den er ["ikke_oplyst"] — en forside, der grupperer
        // efter feltet, skal have en bunke at lægge de ukendte i, ikke et hul.
        // Citatet foelger med: en gruppering uden producentens ord er en paastand.
        anvendelse: anvendelseTilIndeks(r.anvendelse),
        taethed: Object.fromEntries(naevnere.map((n) => [n, taethed(r, n, d4).pct])),
        felter: f,
      };
    }),
  };
  skrivFil(path.join(ud, 'robots.json'), JSON.stringify(indeks, null, 1));

  // Statiske aktiver. dist/ bygges KUN fra assets/ - media/ kan ikke slippe ud.
  for (const [fra, til] of [['assets/stil.css', 'stil.css'], ['assets/filter.js', 'filter.js']]) {
    const kilde = path.join(rod, fra);
    if (fs.existsSync(kilde)) skrivFil(path.join(ud, til), fs.readFileSync(kilde, 'utf8'));
    else console.error(`  advarsel: ${fra} findes ikke`);
  }

  // Sprogvaelger paa roden, saa dist/index.html kan aabnes direkte.
  skrivFil(path.join(ud, 'index.html'), `<!doctype html>
<html lang="da">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Firbenede robotter · Quadruped robots</title>
${SPROG.map((s) => `<link rel="alternate" hreflang="${s}" href="${s}/">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="da/">
<link rel="stylesheet" href="stil.css">
</head>
<body>
<main class="top">
<h1>Firbenede robotter</h1>
<p><a class="knap" href="da/robotter/">Dansk — katalog</a> <a class="knap" href="en/robotter/">English — catalogue</a></p>
</main>
</body>
</html>
`);
  sider++;

  if (manglendeLande.size) {
    console.error(`  advarsel: ${manglendeLande.size} landenoegle(r) mangler i sprogfilerne og ` +
      `vises paa dansk i alle sprog:\n    ${[...manglendeLande].join('\n    ')}`);
  }

  console.log(`\nByggede ${sider} sider fra ${robotter.length} robotter · ${SPROG.length} sprog · ${ud}`);
  console.log(`Taethedsnaevnere brugt: ${naevnere.join(', ')} (D7 er ikke afgjort - alle vises paa siden)`);
  return 0;
}

const erHoved = process.argv[1] && path.resolve(process.argv[1]).endsWith('build.mjs');
if (erHoved) process.exit(main(process.argv.slice(2)));

export { main };
