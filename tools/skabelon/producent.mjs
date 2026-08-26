/**
 * tools/skabelon/producent.mjs — producentsiden. 12 af dem.
 *
 * Siden har ét job, som robotsiden ikke kan goere: at vise CE-oplysningen
 * SAMLET for hele producentens modelrække. Det er her en indkoeber ser, at
 * Unitree har 12 modeller i kataloget, og at ingen af dem naevner CE. Ét
 * "ikke oplyst" er en tom rubrik; tolv under hinanden er en oplysning om
 * producenten.
 *
 * L32 (24. aug 2026): EU-KOLONNEN VAR EN TABEL MED FIRE FELTER (ce_oplyst,
 * eu_tilgaengelig, eu_service, leveringstid), ét pr. model. De tre sidste er
 * fjernet fra skemaet — stod ikke_oplyst paa alle 55 robotter — og med kun
 * ét felt tilbage er en matrix ikke laengere den rigtige form. euSaetning()
 * nedenfor erstatter tabellen med ÉN linje, beregnet paa samme maade som
 * forsidens EU-fund (forside.mjs), bare talt over denne producents modeller
 * i stedet for hele kataloget.
 *
 * ---------------------------------------------------------------------------
 * KONTRAKTEN (laast — side.mjs skrives af en anden agent)
 *
 *   import { skal, hjaelp } from './side.mjs';
 *   export function render(ctx)     // HTML-streng til <main>
 *   ctx = { robot, producent, i18n, sprog, url, hjaelp }
 *
 * `skal` importeres, fordi kontrakten kraever det, men kaldes ikke — se
 * begrundelsen i robot.mjs' hoved.
 *
 * ctx.producent's form er ikke i kontrakten. Filen laeser den taalmodigt:
 *   { navn, slug, land|producentland, by|producentby,
 *     modeller|robotter|robots: [robotdokument, …] }
 * og falder tilbage paa ctx.robotter, hvis modellerne ligger der.
 * Ligger modellerne ingen af stederne, tegnes siden med et TOMT modelafsnit og
 * en synlig grund — den maa ikke se ud, som om producenten ingen modeller har.
 *
 * VAERKTOEJET deles med robot.mjs frem for at blive skrevet af igen. Tre
 * haandskrevne kopier af `esc` og `T` divergerer ved den fjerde aendring.
 * Naar side.mjs staar faerdig, hoerer de hjemme DER, ikke i robot.mjs.
 *
 * L25 — DET DER IKKE STAAR PAA SIDEN: der staar intet om, at koeberen selv
 * bliver importoer ved direkte koeb fra Asien. Paastanden er droppet, fordi der
 * ikke findes en primaerkilde for import til eget brug. CE vises som
 * "oplyst / ikke oplyst", ALDRIG som "har CE / har ikke CE". FUND-vest viser
 * hvorfor: MAB Robotics er polsk producent og skriver intet om CE, fordi det er
 * en selvfoelge for dem. Havde vi skrevet "har ikke CE", havde vi loejet.
 *
 * HJEMSTED er et felt som ethvert andet. Rainbow Robotics er Sejong-si; Ghost
 * Robotics oplyser ingen hjemby noget sted, og Boston Dynamics' YAML siger
 * `ikke_oplyst`. To hjembyer blev tidligere skrevet ud af hukommelsen og maatte
 * rettes (STATUS.md L10). Derfor: citér, eller skriv "ikke oplyst".
 *
 * NYE i18n-NOEGLER, denne fil kraever:
 *   producent_modeller · producent_modeller_titel · producent_hjemsted ·
 *   producent_ingen_modeller · producent_alle · tabel_model ·
 *   producent_model_en (ental — "1 modeller" er ikke dansk)
 *
 * EU-saetningen (L32) genbruger forsidens noegler i stedet for at opfinde nye:
 * eu_titel · forside_eu_tal · forside_eu_paastand. Se euSaetning() nedenfor.
 */

import { skal, hjaelp } from './side.mjs';
import { tilstandAf } from '../skema.mjs';
import {
  esc, T, TD, flet, sti, kraevHjaelp, vaerdi, billedled,
} from './robot.mjs';

/** EU-feltet/felterne, skemaet baerer. L32 (24. aug 2026) fjernede tre af de
 *  fire — eu_tilgaengelig, eu_service, leveringstid — og efterlod ét. Ikke
 *  slettet: robot.mjs' egen EU_FELTER holder samme form, og euSaetning()
 *  nedenfor slaar op i den frem for at haardkode 'ce_oplyst' to steder. */
const EU_FELTER = ['ce_oplyst'];

/** Kortets tre tal. Samme tre som designsystemets kompakte stribe, valgt paa
 *  udfyldningsgrad (vaegt 37 af 46, nyttelast 36, driftstid 36).
 *  ADVARSEL: katalog.mjs har den samme liste. Aendres den ét sted, ser
 *  laeseren ét saet tal paa katalogsiden og et andet her (system.html, knaek 5).
 *  Listen hoerer hjemme i side.mjs, saa snart den findes. */
const KORT_FELTER = [
  ['egenvaegt', 'i-vaegt'],
  ['nyttelast_gaaende', 'i-nyttelast'],
  ['driftstid', 'i-driftstid'],
];

/* ------------------------------------------------------------------ hjaelp */

/**
 * Hjemstedet, naar producentfilen ikke selv oplyser det. Det maa IKKE plukkes
 * fra den foerste model i listen: producentby staar paa 9 af Unitrees filer og
 * mangler paa de oevrige, og "den foerste" er da et lotteri. Derfor:
 * er alle modellernes oplyste byer den samme, er den byen. Er de uenige — eller
 * er der ingen — staar der "ikke oplyst". Vi gaetter aldrig en hjemby; to blev
 * tidligere skrevet ud af hukommelsen og maatte rettes (STATUS.md L10).
 */
function hjemstedAf(modeller) {
  const byer = new Set();
  for (const m of modeller) {
    const b = m?.producentby;
    if (b === undefined || b === null || b === '') continue;
    if (tilstandAf(b)) continue;
    byer.add(String(b));
  }
  return byer.size === 1 ? [...byer][0] : undefined;
}

/** "{n} modeller", men aldrig "1 modeller": ental har sin egen noegle. */
function modelTal(i18n, n) {
  return n === 1 ? T(i18n, 'producent_model_en') : flet(T(i18n, 'producent_modeller'), { n });
}

/** Modellerne, uanset hvad noeglen hedder. */
function modellerAf(ctx) {
  const p = ctx?.producent ?? {};
  const m = p.modeller ?? p.robotter ?? p.robots ?? ctx?.robotter ?? ctx?.modeller ?? [];
  return Array.isArray(m) ? m.filter(Boolean) : [];
}

/** Tallet i et felt, hvis det er et tal. Bruges KUN til at sortere — ikke til
 *  at vise. Et interval sorteres paa sin nedre graense; intervallet bevares
 *  uroert i visningen (regel 5: "20~25 cm" er ikke 22,5). */
function sorteringstal(post) {
  if (!post || typeof post !== 'object') return null;
  if (tilstandAf(post.vaerdi)) return null;
  if (typeof post.vaerdi === 'number') return post.vaerdi;
  if (typeof post.min === 'number') return post.min;
  return null;
}

/** Letteste foerst, ukendt vaegt sidst. Vaegt er katalogets akse (L27), og en
 *  producentside, der sorterer anderledes end forsiden, foeles som et andet sted. */
function sorterModeller(modeller) {
  return [...modeller].sort((a, b) => {
    const va = sorteringstal(a?.felter?.egenvaegt);
    const vb = sorteringstal(b?.felter?.egenvaegt);
    if (va === null && vb === null) return String(a?.navn ?? '').localeCompare(String(b?.navn ?? ''), 'da');
    if (va === null) return 1;
    if (vb === null) return -1;
    if (va !== vb) return va - vb;
    return String(a?.navn ?? '').localeCompare(String(b?.navn ?? ''), 'da');
  });
}

/**
 * CE-opgoerelsen. TRE tal, ikke to: oplyst ja, oplyst nej, og intet oplyst.
 * De tre maa ikke kollapse — det er praecis CLAUDE.md begraensning 5 paa
 * producentniveau. Maalt over kataloget: 2 modeller siger ja, 2 siger nej,
 * 42 siger intet.
 */
function ceOpgoerelse(modeller) {
  let ja = 0; let nej = 0; let ukendt = 0;
  for (const m of modeller) {
    const p = m?.felter?.[EU_FELTER[0]];
    if (p === undefined || typeof p === 'string') { ukendt++; continue; }
    if (tilstandAf(p.vaerdi) === 'nej') { nej++; continue; }
    if (tilstandAf(p.vaerdi)) { ukendt++; continue; }
    if (p.vaerdi === true) ja++;
    else if (p.vaerdi === false) nej++;
    else ukendt++;
  }
  return { ja, nej, ukendt, i_alt: modeller.length };
}

/* ------------------------------------------------------------------ toppen */

function top(ctx, modeller) {
  const { i18n } = ctx;
  const p = ctx.producent ?? {};
  const foerste = modeller[0] ?? {};
  const navn = p.navn ?? foerste.producent ?? '';
  const landVaerdi = p.land ?? p.producentland ?? foerste.producentland ?? null;
  const byVaerdi = p.by ?? p.producentby ?? hjemstedAf(modeller);

  // Hjemstedet er et felt som ethvert andet. Er det ikke oplyst, siger vi det
  // med samme visuelle sprog som alle andre huller — ikke ved at lade linjen
  // vaere tom, og aldrig ved at gaette en by.
  const byTilstand = byVaerdi === undefined ? 'ikke_oplyst' : tilstandAf(byVaerdi);
  const byDel = byTilstand
    ? ctx.__H.tilstand(byTilstand, i18n)
    : `<span class="hjemsted">${esc(byVaerdi)}</span>`;

  return `<header class="producent-top">
<h1 class="t-hero">${esc(navn)}</h1>
<dl class="producent-fakta">
${landVaerdi ? `<div><dt class="etiket">${esc(T(i18n, 'tabel_land'))}</dt><dd>${esc(TD(i18n, 'land_' + landVaerdi, landVaerdi))}</dd></div>` : ''}
<div><dt class="etiket">${esc(T(i18n, 'producent_hjemsted'))}</dt><dd>${byDel}</dd></div>
<div><dt class="etiket">${esc(T(i18n, 'producent_modeller_titel'))}</dt><dd class="figur">${esc(String(modeller.length))}</dd></div>
</dl>
</header>`;
}

/* ------------------------------------------------------------- EU-saetningen */

/**
 * EU-saetningen. FOER L32 (24. aug 2026) var det her en tabel: fire EU-felter
 * gange N modeller, en matrix der laeses paa tvaers. Med kun ét felt tilbage
 * (ce_oplyst — se EU_FELTER) er en matrix ikke laengere den rigtige form; én
 * raekke i en tabel er en saetning, der har taget en tabels plads.
 *
 * Formen genbruger forsidens EU-fund (forside.mjs' euFund, samme i18n-noegler
 * forside_eu_tal og forside_eu_paastand, samme CSS-klasser eu-fund-linje/
 * eu-fund-tal) fremfor at opfinde en producent-specifik variant — kun tallene
 * bag "{n} af {m}" skifter, fra hele kataloget til denne producents modeller.
 */
function euSaetning(ctx, modeller) {
  const { i18n } = ctx;

  if (!modeller.length) {
    return `<section class="sektion" aria-labelledby="eu-h">
<div class="sektion-hoved"><h2 class="t-h2" id="eu-h">${esc(T(i18n, 'eu_titel'))}</h2></div>
<p class="t-lille">${esc(T(i18n, 'producent_ingen_modeller'))}</p>
</section>`;
  }

  const t = ceOpgoerelse(modeller);
  return `<section class="sektion" aria-labelledby="eu-h">
<div class="sektion-hoved"><h2 class="t-h2" id="eu-h">${esc(T(i18n, 'eu_titel'))}</h2></div>
<p class="eu-fund-linje">${ctx.__H.ikon('i-ce', 'ikon ikon--lille')}<b class="eu-fund-tal">${esc(flet(T(i18n, 'forside_eu_tal'), { n: t.ja, m: t.i_alt }))}</b><span>${esc(T(i18n, 'forside_eu_paastand'))}</span></p>
</section>`;
}

/* ---------------------------------------------------------------- kortene */

/** Kortets kompakte stribe: tre celler, samme regel som striben paa robotsiden
 *  — cellen bliver staaende, ogsaa naar den er tom. */
function kompaktStribe(ctx, m) {
  const kilder = ctx.__kilder?.get(m.slug) ?? [];
  const celler = KORT_FELTER.map(([navn, ikon]) => {
    const { html, hul } = vaerdi(navn, m.felter?.[navn], { ...ctx, robot: m }, kilder);
    return {
      hul,
      html: `<li${hul ? ' class="hul"' : ''}><svg class="ikon" aria-hidden="true"><use href="#${ikon}"/></svg><span class="krop">
<span class="etiket">${esc(T(ctx.i18n, 'felt_' + navn))}</span>
${html}</span></li>`,
    };
  });
  const oplyst = celler.filter((c) => !c.hul).length;
  if (oplyst === 0) {
    // Tre huller ville vaere tre gange den samme oplysning.
    return `<div class="stribe stribe--intet stribe--intet-kort">
<svg class="ikon ikon--lille" aria-hidden="true"><use href="#i-hul"/></svg>
<div class="tekst"><p class="hoved">${esc(T(ctx.i18n, 'noegletal_intet'))}</p></div>
</div>`;
  }
  return `<ul class="stribe stribe--kompakt panel--ro">\n${celler.map((c) => c.html).join('\n')}\n</ul>`;
}

/* Samme BEM-modifikator som robot.mjs' egen anvendelseMaerker() og side.mjs'
   anvendelse().maerker() (fund/FUND-detalje.md, opgave 4c): tre parallelle
   implementeringer af samme maerke, saa alle tre skal baere det samme
   "anvendelse__maerke--<vaerdi>"-hook, ikke kun to af dem. */
function anvendelseMaerker(ctx, m) {
  const { i18n } = ctx;
  const a = ctx.__H.anvendelse(m) ?? {};
  const vaerdier = (Array.isArray(a.vaerdi) ? a.vaerdi : [a.vaerdi]).filter(Boolean);
  if (!vaerdier.length) return '';
  return `<ul class="maerker">` + vaerdier.map((v) => {
    const t = tilstandAf(v);
    return t
      ? `<li class="maerke maerke--tom anvendelse__maerke--${esc(t)}">${esc(TD(i18n, 'tilstand_' + t, v))}</li>`
      : `<li class="maerke anvendelse__maerke--${esc(v)}">${esc(TD(i18n, 'anvendelse_' + v, v))}</li>`;
  }).join('') + `</ul>`;
}

function modelkort(ctx, m) {
  const { i18n } = ctx;
  const billede = ctx.billeder?.[m.slug] ?? m.billede ?? null;
  const kortCtx = { ...ctx, robot: m, billede };
  return `<li><article class="kort">
${billedled(kortCtx, { stor: false })}
<div class="kort-krop">
<div class="kort-hoved">
<p class="kort-ophav">` +
    (m.producentland ? `<span class="land">${esc(TD(i18n, 'land_' + m.producentland, m.producentland))}</span>` : '') +
    (m.status ? `<span class="status status--${esc(m.status)}">${esc(TD(i18n, 'status_' + m.status, m.status))}</span>` : '') +
    `</p>
<h3 class="kort-navn"><a href="${esc(sti(ctx, 'robot', m.slug))}">${esc(m.navn ?? m.slug)}</a></h3>
</div>
${kompaktStribe(ctx, m)}
${anvendelseMaerker(ctx, m)}
</div>
</article></li>`;
}

function modelafsnit(ctx, modeller) {
  const { i18n } = ctx;
  if (!modeller.length) {
    return `<section class="sektion" aria-labelledby="modeller-h">
<div class="sektion-hoved"><h2 class="t-h2" id="modeller-h">${esc(T(i18n, 'katalog_titel'))}</h2></div>
<p class="t-lille">${esc(T(i18n, 'producent_ingen_modeller'))}</p>
</section>`;
  }
  return `<section class="sektion" aria-labelledby="modeller-h">
<div class="sektion-hoved">
<h2 class="t-h2" id="modeller-h">${esc(modelTal(i18n, modeller.length))}</h2>
</div>
<p class="t-lille kort-legende">${esc(T(i18n, 'kort_legende'))}</p>
<ul class="gitter">
${modeller.map((m) => modelkort(ctx, m)).join('\n')}
</ul>
</section>`;
}

/** Alle producenter, hvis bygget giver os listen. Uden den springes afsnittet
 *  over — en liste med ét navn ville se ud, som om der kun var én producent. */
function alleProducenter(ctx) {
  const { i18n } = ctx;
  const alle = Array.isArray(ctx.producenter) ? ctx.producenter : [];
  if (alle.length < 2) return '';
  const her = ctx.producent?.slug;
  const punkter = alle.map((p) => {
    const n = p.antal ?? (Array.isArray(p.modeller) ? p.modeller.length
      : Array.isArray(p.robotter) ? p.robotter.length : null);
    const navn = p.slug === her
      ? `<span class="pnavn" aria-current="page">${esc(p.navn)}</span>`
      : `<a class="pnavn" href="${esc(sti(ctx, 'producent', p.slug))}">${esc(p.navn)}</a>`;
    return `<li>${navn}` +
      (p.land ? `<span class="pland">${esc(TD(i18n, 'land_' + p.land, p.land))}</span>` : '') +
      (n === null ? '' : `<span class="pantal figur">${esc(modelTal(i18n, n))}</span>`) +
      `</li>`;
  }).join('\n');
  return `<section class="sektion" aria-labelledby="alle-h">
<div class="sektion-hoved"><h2 class="t-h2" id="alle-h">${esc(flet(T(i18n, 'producent_alle'), { n: alle.length }))}</h2></div>
<ul class="prodliste">
${punkter}
</ul>
</section>`;
}

/* ------------------------------------------------------------------ render */

export function render(ctx) {
  const H = ctx?.hjaelp ?? hjaelp;
  kraevHjaelp(H);
  const modeller = sorterModeller(modellerAf(ctx));

  // Kilderne slaas op én gang pr. model, ikke én gang pr. celle. Uden det her
  // ville hjaelp.kilder() blive kaldt 4 x N gange alene til EU-tabellen.
  const kilder = new Map();
  for (const m of modeller) {
    try { kilder.set(m.slug, H.kilder(m) ?? []); } catch { kilder.set(m.slug, []); }
  }

  const arbejde = { ...ctx, __H: H, __fra: 'producent', __kilder: kilder };
  const { i18n } = arbejde;

  return `<main class="side" id="hoved">
<div class="rum">
<p class="retur"><a href="${esc(sti(arbejde, 'katalog'))}">${esc(T(i18n, 'til_katalog'))}</a></p>

<article class="producentside">
${top(arbejde, modeller)}
${euSaetning(arbejde, modeller)}
${modelafsnit(arbejde, modeller)}
${alleProducenter(arbejde)}
</article>
</div>
</main>
`;
}

/* ----------------------------------------------------------------- indeks */

/**
 * Landefordelingen: producenter og modeller grupperet paa producentens land.
 * Et land, der ikke er oplyst (falsy, eller en tilstandsvaerdi som
 * "ikke_oplyst" — samme vagt som hjemstedAf() ovenfor), taeller IKKE med i
 * fordelingen: vi kan ikke sige, hvilket land der har "flest", naar landet
 * ikke er kendt. Det taeller stadig med i totalerne (n af {alle.length}) —
 * kun selve fordelingen udelader det.
 */
function landefordeling(alle) {
  const perLand = new Map();
  for (const p of alle) {
    if (!p.land || tilstandAf(p.land)) continue;
    const noegle = String(p.land);
    const t = perLand.get(noegle) ?? { producenter: 0, modeller: 0 };
    t.producenter += 1;
    t.modeller += (typeof p.antal === 'number' ? p.antal : 0);
    perLand.set(noegle, t);
  }
  return perLand;
}

/**
 * Den beregnede iagttagelse (spor/producent, punkt 2, 26. aug 2026).
 * Producentsiden har hele fordelingen liggende foran sig og sagde hidtil
 * intet om den — modsat forsidens CE-linje (forside.mjs' euFund) og
 * katalogets vaegtklasse-sale, der begge tør skrive et stort udledt tal.
 * Formen laaner CE-linjens: ét tal, en noegtern konstatering, ALDRIG en dom
 * (begraensning 6 — "kinesisk dominans" er en dom, "14 af 25 er fra Kina"
 * er et tal). Derfor "fra {land}", ikke et demonym-adjektiv ("kinesisk") -
 * et adjektiv skal boejes rigtigt for hvert land, et landenavn skal ikke.
 *
 * Landet med flest producenter findes ved LOEB over `alle` ved byggetid,
 * ALDRIG skrevet i haanden — se D7/L30-faelden i CLAUDE.md: et haardkodet
 * 14/25/62/77 her ville vaere fundet FLYTTET, ikke løst, og ville staa
 * forkert i det oejeblik kataloget fik en 78. robot eller en 26. producent.
 * Uafgjort (samme producentantal) afgoeres alfabetisk paa landenavnet, saa
 * resultatet er deterministisk uden at vaere en redaktionel rangering.
 */
function producentSaetning(ctx, alle) {
  const { i18n } = ctx;
  const perLand = landefordeling(alle);
  if (perLand.size === 0) return '';

  let bedst = null;
  for (const [land, tal] of perLand) {
    const bedreEnd = !bedst
      || tal.producenter > bedst.tal.producenter
      || (tal.producenter === bedst.tal.producenter && land.localeCompare(bedst.land, 'da') < 0);
    if (bedreEnd) bedst = { land, tal };
  }

  const totalProducenter = alle.length;
  const totalModeller = alle.reduce((s, p) => s + (typeof p.antal === 'number' ? p.antal : 0), 0);
  const landNavn = esc(TD(i18n, 'land_' + bedst.land, bedst.land));
  const saetning = flet(T(i18n, 'producent_fordeling_saetning'), {
    n: bedst.tal.producenter,
    m: totalProducenter,
    land: landNavn,
    x: bedst.tal.modeller,
    y: totalModeller,
  });
  return `<p class="t-broed producent-fordeling">${saetning}</p>`;
}

/**
 * Producentindekset — siden paa /<sprog>/producenter/, F1's manglende doer ind.
 * Ét led pr. producent: navn (link), land og antal modeller i kataloget.
 * Ingen vurdering og ingen raekkefoelge ud over alfabetet: en sortering efter
 * "stoerst foerst" ville vaere en redaktionel skala, vi ikke har metode til.
 *
 * L(spor/producent, 26. aug 2026), punkt 1: raekken var FOER en <dl>/.raekke
 * (system.css' delte 2-kolonne-komponent) med land og modeltal klistret sammen
 * i én <dd>-streng ("Kina 13 modeller") — to tal, der ikke flugtede lodret, og
 * en side, der brugte under halvdelen af sin bredde. .raekker/.raekke ejes af
 * et andet spor (system.css), saa den genbruges IKKE laengere her; en rigtig
 * <table> med tre <td> giver tre selvstaendige kolonner, kan style modeltallet
 * for sig (font-variant-numeric: tabular-nums via .figur) og fylder .rum's
 * fulde bredde. Markup'en bruger .prod-tabel (assets/generator.css, afsnit 9h)
 * plus .figur, som allerede findes i system.css og ikke er min at redefinere.
 *
 * Linket er `<slug>/` og ikke sti(ctx, 'producent', …): siden ligger selv i
 * producenter/, saa barnelinket kan ikke pege forkert, heller ikke uden ctx.url.
 */
export function renderIndeks(ctx) {
  const H = ctx?.hjaelp ?? hjaelp;
  const { i18n } = ctx;
  const alle = (Array.isArray(ctx?.producenter) ? ctx.producenter : [])
    .map((p) => ({
      ...p,
      antal: p.antal ?? (Array.isArray(p.modeller) ? p.modeller.length
        : Array.isArray(p.robotter) ? p.robotter.length : null),
    }))
    .sort((a, b) => String(a.navn ?? '').localeCompare(String(b.navn ?? ''), ctx?.sprog ?? 'da'));

  const raekker = alle.map((p) => {
    // Landet er et felt som ethvert andet: mangler det, staar hullet med
    // tilstandens eget sprog — aldrig som en tom plads (begraensning 5).
    const landDel = p.land
      ? esc(TD(i18n, 'land_' + p.land, p.land))
      : (typeof H?.tilstand === 'function' ? H.tilstand('ikke_oplyst', i18n) : '');
    // Modelkolonnen viser TALLET alene — kolonnehovedet baerer allerede ordet
    // "modeller" ("1 modeller" er ikke dansk, se producent_model_en, men her
    // opstaar problemet slet ikke, fordi entalsformen aldrig skrives ud).
    const antalDel = p.antal === null ? '' : esc(String(p.antal));
    return `<tr>
<td><a href="${esc(String(p.slug))}/">${esc(p.navn ?? p.slug)}</a></td>
<td>${landDel}</td>
<td class="figur">${antalDel}</td>
</tr>`;
  }).join('\n');

  return `<main class="side" id="hoved">
<div class="rum">
<div class="katalog-hoved">
<h1 class="t-h1">${esc(T(i18n, 'nav_producenter'))}</h1>
${producentSaetning(ctx, alle)}
<p class="t-broed maal">${esc(flet(T(i18n, 'producent_alle'), { n: alle.length }))}</p>
</div>
<section class="sektion" aria-labelledby="prodliste-h">
<h2 class="t-h2 kunskaerm" id="prodliste-h">${esc(flet(T(i18n, 'producent_alle'), { n: alle.length }))}</h2>
<div class="prod-tabel-wrap">
<table class="prod-tabel">
<thead>
<tr>
<th scope="col">${esc(T(i18n, 'tabel_producent'))}</th>
<th scope="col">${esc(T(i18n, 'tabel_land'))}</th>
<th scope="col" class="figur">${esc(T(i18n, 'tabel_modeller'))}</th>
</tr>
</thead>
<tbody>
${raekker}
</tbody>
</table>
</div>
</section>
</div>
</main>
`;
}

export default { render, renderIndeks };
