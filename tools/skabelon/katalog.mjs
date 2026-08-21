/**
 * tools/skabelon/katalog.mjs — katalogsiden: alle robotter, ét kort hver.
 *
 * Filtrene virker UDEN JavaScript. De er almindelige afkrydsningsfelter, og
 * selve filtreringen sker i CSS med :has() og et lag pr. facet:
 *
 *   .styr:has(.f-anv:checked) .lag-anv            { display:none }      skjul alle
 *   .styr:has(#f-anv-industri:checked)
 *        .lag-anv[data-anv~="industri"]           { display:contents }  vis igen
 *
 * Den anden regel vinder, fordi :has() arver sit mest specifikke argument, og
 * et id slaar en klasse. Resultatet er ELLER inden for en facet (flere
 * afkrydsninger udvider udvalget) og OG paa tvaers af facetter (hver facet har
 * sit eget lag, og et lag skjult af facet A kan ikke vises igen af facet B).
 *
 * Lagene er `display:contents`, saa de ikke selv bliver gitterceller. Et skjult
 * kort efterlader derfor intet tomt felt i gitteret.
 *
 * Uden :has()-stoette sker der ingenting: alle kort staar. Det er den rigtige
 * vej at fejle - kataloget er stadig helt.
 *
 * :target gaar den samme vej, saa forsidens filterlinks
 * (robotter/#f-anv-industri) saetter et filter uden JavaScript.
 *
 * Kontrakten staar i side.mjs. Denne fil skriver kun indholdet af <main>.
 */

import { esc } from './side.mjs';
import { tilstandAf } from '../skema.mjs';

const attr = esc;

/** Et vaerdinavn, der kan staa i et id og i en attributvaelger. */
const nogle = (v) => String(v).toLowerCase().replace(/[^a-z0-9_]+/g, '-');

function ipVaerdi(robot) {
  const p = robot.felter?.ip_klasse;
  if (p === undefined) return 'ikke_oplyst';
  if (typeof p === 'string') return tilstandAf(p) ?? 'ikke_oplyst';
  const t0 = tilstandAf(p.vaerdi);
  if (t0) return t0;
  return String(p.vaerdi);
}

/** Facetterne. Raekkefoelgen her er ogsaa lagenes raekkefoelge i HTML. */
function facetter(robotter, hjaelp, i18n) {
  const { T, t } = i18n;
  const tilstandsnavn = (v) => (v === 'ikke_oplyst' ? T.tilstand_ikke_oplyst
    : v === 'nej' ? T.tilstand_nej : v);

  return [
    {
      navn: 'anv',
      etiket: t('filter_anvendelse'),
      vaerdier: (r) => hjaelp.anvendelse(r).vaerdier,
      tekst: (v) => (v === 'ikke_oplyst' ? T.tilstand_ikke_oplyst : t('anvendelse_' + v)),
    },
    {
      navn: 'vaegt',
      etiket: t('filter_vaegt'),
      vaerdier: (r) => [hjaelp.vaegtklasse(r)],
      tekst: (v) => t('vaegtklasse_' + v),
      orden: hjaelp.VAEGTKLASSER,
    },
    {
      navn: 'ip',
      etiket: t('filter_ip'),
      vaerdier: (r) => [ipVaerdi(r)],
      tekst: tilstandsnavn,
    },
    {
      navn: 'land',
      etiket: t('filter_land'),
      vaerdier: (r) => [r.producentland],
      tekst: (v) => hjaelp.land(v),
    },
    {
      navn: 'ce',
      etiket: t('filter_ce'),
      vaerdier: (r) => [hjaelp.ceTilstand(r)],
      tekst: (v) => (v === 'ja' ? T.ja : v === 'nej' ? T.nej : T.tilstand_ikke_oplyst),
    },
  ].map((f) => {
    const antal = new Map();
    for (const r of robotter) {
      for (const v of f.vaerdier(r)) antal.set(v, (antal.get(v) ?? 0) + 1);
    }
    const liste = [...antal.keys()].sort((a, b) => {
      if (f.orden) return f.orden.indexOf(a) - f.orden.indexOf(b);
      // "ikke oplyst" staar sidst; ellers efter antal og saa alfabetisk.
      if (a === 'ikke_oplyst') return 1;
      if (b === 'ikke_oplyst') return -1;
      return antal.get(b) - antal.get(a) || String(a).localeCompare(String(b));
    });
    return { ...f, antal, liste };
  });
}

/** Den genererede filter-CSS. Kaldes af bygget og lægges i <head>. */
export function hovedStil(ctx) {
  const { robotter, hjaelp, i18n } = ctx;
  const F = facetter(robotter, hjaelp, i18n);
  const linjer = [];
  for (const f of F) {
    linjer.push(`.styr:has(.f-${f.navn}:checked) .lag-${f.navn},`);
    linjer.push(`.styr:has(.f-${f.navn}:target) .lag-${f.navn}{display:none}`);
    for (const v of f.liste) {
      const id = `f-${f.navn}-${nogle(v)}`;
      linjer.push(`.styr:has(#${id}:checked) .lag-${f.navn}[data-${f.navn}~="${v}"],`);
      linjer.push(`.styr:has(#${id}:target) .lag-${f.navn}[data-${f.navn}~="${v}"]{display:contents}`);
    }
  }
  return `/* Filtrene. Genereret af tools/skabelon/katalog.mjs - én regel pr. vaerdi. */
@supports selector(:has(*)){
${linjer.join('\n')}
}`;
}

export function render(ctx) {
  const { robotter, i18n, sprog, hjaelp } = ctx;
  const { T, t, tf } = i18n;
  const F = facetter(robotter, hjaelp, i18n);

  const klasseOrden = (r) => hjaelp.VAEGTKLASSER.indexOf(hjaelp.vaegtklasse(r));
  const vaegt = (r) => {
    const p = r.felter?.egenvaegt;
    if (!p || typeof p === 'string' || typeof p.vaerdi === 'string') return Infinity;
    const v = p.min !== undefined ? (p.min + p.maks) / 2 : p.vaerdi;
    return typeof v === 'number' ? (p.enhed === 'g' ? v / 1000 : v) : Infinity;
  };
  const sorteret = [...robotter].sort((a, b) => klasseOrden(a) - klasseOrden(b)
    || vaegt(a) - vaegt(b) || String(a.navn).localeCompare(String(b.navn), sprog));

  /* --- filterfelterne --- */
  const grupper = F.map((f) => `<fieldset class="facet">
<legend class="etiket">${esc(f.etiket)}</legend>
<div class="filtre">
${f.liste.map((v) => {
    const id = `f-${f.navn}-${nogle(v)}`;
    return `<input type="checkbox" class="f-${attr(f.navn)}" id="${attr(id)}" name="${attr(f.navn)}" value="${attr(v)}">`
      + `<label for="${attr(id)}">${esc(f.tekst(v))}<span class="antal">${esc(String(f.antal.get(v)))}</span></label>`;
  }).join('\n')}
</div>
</fieldset>`).join('\n');

  /* --- kortene, pakket i ét lag pr. facet --- */
  const kort = sorteret.map((r) => {
    const sogetekst = [
      r.navn, r.producent, r.producentland, hjaelp.land(r.producentland),
      ipVaerdi(r), t('vaegtklasse_' + hjaelp.vaegtklasse(r)),
      ...hjaelp.anvendelse(r).vaerdier.map((v) => (v === 'ikke_oplyst' ? T.tilstand_ikke_oplyst : t('anvendelse_' + v))),
    ].join(' ').toLowerCase();

    const aabne = F.map((f, i) => {
      const vaerdier = f.vaerdier(r).join(' ');
      const ekstra = i === 0 ? ` data-sog="${attr(sogetekst)}"` : '';
      return `<div class="lag lag-${attr(f.navn)}" data-${attr(f.navn)}="${attr(vaerdier)}"${ekstra}>`;
    }).join('');
    return `${aabne}\n${hjaelp.kort(r, { op: '../../', til: '' })}\n${'</div>'.repeat(F.length)}`;
  }).join('\n');

  /* --- EU-pointen. Staar én gang, ikke paa hvert kort. --- */
  const udenCe = robotter.filter((r) => hjaelp.ceTilstand(r) === 'ikke_oplyst').length;

  return `<div class="rum">
<div class="katalog-hoved">
<h1 class="t-h1">${esc(T.katalog_titel)}</h1>
<p class="t-broed maal">${esc(tf('forside_lede', { n: robotter.length, p: new Set(robotter.map((r) => r.producent)).size }))}</p>
</div>

<form class="styr" id="styr" action="#alle" method="get">
<div class="styring">
<div class="sog" data-sog="katalog" hidden>
<label class="etiket" for="sog-katalog">${esc(t('forside_soeg_etiket'))}</label>
<input id="sog-katalog" name="s" type="search" autocomplete="off"
 placeholder="${attr(t('forside_soeg_pladsholder'))}">
</div>
</div>

<div class="facetter">
${grupper}
</div>
<p class="t-mikro facet-hjaelp">${esc(t('filter_uden_js'))}</p>
<p class="facet-ryd"><a class="videre videre--stille" href="#alle">${esc(t('filter_vis_alle'))}</a></p>

<div class="gitter" id="alle">
${kort}
</div>
</form>
<p class="tomt" data-tomt hidden>${esc(t('soeg_ingen_traef'))}</p>

<p class="t-lille sektion-note">${esc(tf('eu_pointe', { n: udenCe, m: robotter.length }))}</p>
${hjaelp.tegnforklaring()}
</div>`;
}
