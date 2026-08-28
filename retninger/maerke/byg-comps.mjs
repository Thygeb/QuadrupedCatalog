/* =============================================================================
   byg-comps.mjs — bygger comps'ene for spor/maerke fra RIGTIGE data.

   Ingen tal opfindes (haard begraensning 2). Alt kommer fra:
     dist/robots.json                        vaerdier, enheder, tilstande, forbehold
     fund/FUND-d14-klassifikation.md         gyldighed / uddybning pr. felt
     data/i18n/da.json                       feltnavne, laest, aldrig skrevet

   Skriver KUN i retninger/maerke/. Roerer ikke tools/, assets/ eller data/.
   Koer:  node retninger/maerke/byg-comps.mjs
   ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';

const UD = 'retninger/maerke';
const db = JSON.parse(fs.readFileSync('dist/robots.json', 'utf8'));
const T = JSON.parse(fs.readFileSync('data/i18n/da.json', 'utf8'));

/* --- klassifikationen ---------------------------------------------------- */
const klasse = new Map();
for (const l of fs.readFileSync('fund/FUND-d14-klassifikation.md', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\|\s*([a-z0-9-]+)\s*\|\s*([a-z0-9_]+)\s*\|\s*(gyldighed|uddybning)\s*\|/);
  if (m) klasse.set(m[1] + '|' + m[2], m[3]);
}
const ERTAL = new Set(['tal', 'nul']);
/** gyldighed = det synlige maerke. uddybning = kun title. null = intet forbehold. */
function klassenAf(slug, felt, post) {
  if (!post || !post.forbehold) return null;
  if (!ERTAL.has(post.tilstand)) return 'ikke-klassificeret';
  return klasse.get(slug + '|' + felt) || 'ikke-klassificeret';
}

/* --- sats ---------------------------------------------------------------- */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const tal = (n) => String(n).replace('.', ',');
const OP = { '~': 'ca.', '<=': '≤', '>=': '≥', '<': '<', '>': '>' };

/** Vaerdien, sat som system.css saetter den. `maerket` er comp-varianten. */
function vaerdiHTML(slug, navn, post, { variant, kilde = 'A', kompakt = false }) {
  const kl = klassenAf(slug, navn, post);
  const vis = kl === 'gyldighed';                 // KUN gyldighed faar maerket
  const abbr = post?.forbehold
    ? `<abbr class="forbehold--skjult" title="${esc(post.forbehold)}"><span class="kunskaerm">${
      vis ? 'Forbehold: ' : ''}${esc(post.forbehold)}</span></abbr>` : '';
  const km = kilde ? `<a class="kildemaerke" href="#kilde-${kilde}" tabindex="-1">${kilde}</a>` : '';
  // Kortets kompakte stribe har INGEN .feltvaerdi-omslag i bygget (maalt i
  // dist/da/robotter/index.html) - kildemaerket ligger inde i .v. Robotsidens
  // stribe og feltlisten har omslaget. Comps'ene foelger bygget praecist,
  // fordi .stribe--kompakt > li er et grid, hvor .krop er display:contents.
  const ind = (indre) => kompakt ? indre : `<span class="feltvaerdi">${indre}</span>`;

  if (!post || post.tilstand === 'ikke_oplyst') {
    return ind(`<span class="v v-ikke"><i class="mrk"></i>ikke oplyst${kompakt ? abbr : ''}</span>${kompakt ? '' : abbr}`);
  }
  if (post.tilstand === 'ja' || post.tilstand === 'nej') {
    return ind(`<span class="v v-${post.tilstand}"><i class="mrk"></i>${post.tilstand}${kompakt ? abbr + km : ''}</span>${kompakt ? '' : abbr + km}`);
  }
  if (post.tilstand === 'tekst') {
    return ind(`<span class="v-tekst">${esc(post.tekst)}</span>${abbr}${km}`);
  }
  // tal og nul
  const figur = post.vaerdi !== null && post.vaerdi !== undefined
    ? tal(post.vaerdi)
    : `${tal(post.min)}–${tal(post.maks)}`;
  // Laengdetrinnene, ordret fra tools/skabelon/side.mjs:819-824. Uden dem
  // klipper lange vaerdier i kortets celle, og comp'en ville vise en fejl,
  // bygget ikke har. Foerste udgave af comp'en gjorde netop det: "60-120 mi".
  const opTekst = post.operator ? String(OP[post.operator] || post.operator) : '';
  const enhedTekst = post.enhed || '';
  const figurTekst = post.vaerdi !== null && post.vaerdi !== undefined
    ? tal(post.vaerdi) : `${tal(post.min)}–${tal(post.maks)}`;
  const tegn = (opTekst ? opTekst.length + 1 : 0) + figurTekst.length + enhedTekst.length;
  const lang = tegn >= 14 ? ' v-tal--xxlang' : tegn >= 11 ? ' v-tal--xlang'
    : tegn >= 9 ? ' v-tal--lang' : '';
  const op = post.operator ? `<span class="op" aria-hidden="true">${esc(OP[post.operator] || post.operator)}</span>` : '';
  // Udgave C laegger maerket paa ETIKETTEN, ikke paa vaerdien. Uden denne
  // gren fik .v-tal ogsaa klassen m-etiket - en klasse uden regel, som
  // maaleapparatet talte med og gav 150 % maerker paa striben.
  const m = vis && variant !== 'etiket' ? ` m-${variant}` : '';
  const krop = `${op}<b class="num">${figur}</b>`
    + (post.enhed ? `<span class="enhed">${esc(post.enhed)}</span>` : '');
  const v = `<span class="v v-${post.tilstand === 'nul' ? 'nul v-tal' : 'tal'}${lang}${m}">`
    + krop + (kompakt ? abbr + km : abbr) + `</span>`;
  return ind(kompakt ? v : v + km);
}

function etiketHTML(tekst, markeret, variant) {
  const m = markeret && variant === 'etiket' ? ' m-etiket' : '';
  return `<span class="etiket${m}">${esc(tekst)}</span>`;
}

/** dt-klassen i kollisionsproeven. Udgave C's maerke sidder paa FELTNAVNET,
 *  saa proeven skal baere den samme klasse - ellers viser C-spalten intet
 *  maerke, og proeven maaler den forkerte ting. (Foerste udgave af proeven
 *  gjorde netop det: C-spalten stod uden et eneste maerke.) */
function DTM(variant, felt) {
  if (variant !== 'etiket') return '';
  return klassenAf(EMNE.slug, felt, EMNE.alle_felter[felt]) === 'gyldighed'
    ? ' class="m-etiket"' : '';
}

/* --- flade 1: robotsidens noegletalsstribe -------------------------------- */
const STRIBE = [
  ['egenvaegt', 'i-vaegt'], ['nyttelast_gaaende', 'i-nyttelast'],
  ['driftstid', 'i-driftstid'], ['hastighed', 'i-fart'], ['ip_klasse', 'i-ip'],
];
function stribeHTML(r, variant) {
  let oplyst = 0, maerket = 0, talceller = 0;
  const celler = STRIBE.map(([navn, ikon]) => {
    const post = r.alle_felter[navn];
    const hul = !post || post.tilstand === 'ikke_oplyst';
    if (!hul) oplyst++;
    const kl = klassenAf(r.slug, navn, post);
    if (ERTAL.has(post?.tilstand)) talceller++;
    if (kl === 'gyldighed') maerket++;
    return `<li${hul ? ' class="hul"' : ''}><svg class="ikon" aria-hidden="true"><use href="#${ikon}"/></svg><span class="krop">
${etiketHTML(T['felt_' + navn], kl === 'gyldighed', variant)}
${vaerdiHTML(r.slug, navn, post, { variant })}</span></li>`;
  }).join('\n');
  const huller = STRIBE.length - oplyst;
  return {
    maerket, talceller,
    html: `<div class="stribe-hylster">
<div class="stribe-hoved"><span class="etiket etiket--blaek">Nøgletal ifølge producenten</span>
<span class="stribe-taeller"><b>${oplyst} af ${STRIBE.length} oplyst</b>${huller ? ` <span class="mangler">· ${huller === 1 ? '1 hul' : huller + ' huller'}</span>` : ''}</span></div>
<ul class="stribe stribe--fem">
${celler}
</ul></div>`,
  };
}

/* --- flade 2: katalogkortet ----------------------------------------------- */
const KORT = [['egenvaegt', 'i-vaegt'], ['nyttelast_gaaende', 'i-nyttelast'],
  ['hastighed', 'i-fart'], ['driftstid', 'i-driftstid']];
function kortHTML(r, variant) {
  let maerket = 0, talceller = 0;
  const celler = KORT.map(([navn, ikon]) => {
    const post = r.alle_felter[navn];
    const hul = !post || post.tilstand === 'ikke_oplyst';
    const kl = klassenAf(r.slug, navn, post);
    if (ERTAL.has(post?.tilstand)) talceller++;
    if (kl === 'gyldighed') maerket++;
    return `<li${hul ? ' class="hul"' : ''}><svg class="ikon" aria-hidden="true"><use href="#${ikon}"/></svg><span class="krop">${
      etiketHTML(T['stribe_' + navn], kl === 'gyldighed', variant)}${
      vaerdiHTML(r.slug, navn, post, { variant, kompakt: true })}</span></li>`;
  }).join('\n');
  return {
    maerket, talceller,
    html: `<article class="kort">
<div class="kort-krop">
<div class="kort-hoved"><p class="kort-ophav"><span class="prod">${esc(r.producent)}</span><span class="land">${esc(r.producentland)}</span></p>
<h3 class="kort-navn"><a href="#">${esc(r.navn)}</a></h3></div>
<ul class="stribe stribe--kompakt panel--ro">
${celler}
</ul></div></article>`,
  };
}

/* --- flade 3: den fulde feltliste ----------------------------------------- */
const GRUPPER = [
  ['Fysik', ['egenvaegt', 'laengde', 'bredde', 'hoejde', 'frihedsgrader',
    'nyttelast_gaaende', 'nyttelast_staaende']],
  ['Færden', ['hastighed', 'haeldning', 'forhindring_enkelt', 'trappetrin_kontinuerlig']],
  ['Miljø', ['ip_klasse', 'temp_min', 'temp_maks']],
  ['Strøm', ['batteri_wh', 'driftstid', 'hot_swap', 'ladetid', 'dockingstation']],
];
function feltlisteHTML(r, variant) {
  let maerket = 0, talceller = 0, raekker = 0;
  const ud = GRUPPER.map(([titel, felter]) => {
    const rk = felter.map((navn) => {
      const post = r.alle_felter[navn];
      if (!post) return '';
      raekker++;
      const kl = klassenAf(r.slug, navn, post);
      if (ERTAL.has(post.tilstand)) talceller++;
      if (kl === 'gyldighed') maerket++;
      // Forbeholdsblokken: to slags, ikke én. Se rapportens i18n-forslag.
      const blok = post.forbehold
        ? `<p class="advarsel advarsel--${kl === 'gyldighed' ? 'gyldighed' : 'uddybning'}">`
          + `<b class="advarsel-navn">${kl === 'gyldighed' ? 'Forbehold' : 'Note'}</b>`
          + `<span>${esc(post.forbehold)}</span></p>` : '';
      const dtM = kl === 'gyldighed' && variant === 'etiket' ? ' class="m-etiket"' : '';
      return `<div class="raekke${kl === 'gyldighed' ? ' raekke--maerket' : ''}">
<dt${dtM}>${esc(T['felt_' + navn] || navn)}</dt>
<dd>${vaerdiHTML(r.slug, navn, post, { variant })}${blok}</dd></div>`;
    }).filter(Boolean).join('\n');
    return `<section class="skema-gruppe"><h4 class="t-h3">${titel}</h4>\n<dl class="raekker">\n${rk}\n</dl></section>`;
  }).join('\n');
  return { maerket, talceller, raekker, html: `<div class="skema-krop">\n${ud}\n</div>` };
}

/* --- sidernes stillads ---------------------------------------------------- */
const SPRITE = `<svg class="kunskaerm" aria-hidden="true"><defs>
<g id="i-vaegt"><path d="M12 4v3M7 7h10M5 20h14l-3-11H8z"/><circle cx="12" cy="4" r="1.6"/></g>
<g id="i-nyttelast"><path d="M4 9h16v10H4zM8 9V6a4 4 0 0 1 8 0v3M9 14h6"/></g>
<g id="i-driftstid"><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></g>
<g id="i-fart"><path d="M4 16a8 8 0 0 1 16 0M12 16l4-5"/></g>
<g id="i-ip"><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/></g>
</defs></svg>`;

const VARIANTER = {
  kant: {
    navn: 'A · KANT',
    linje: 'En 2 px lodret streg foran værdien — samme streg som forbeholdsblokken bærer i venstre kant.',
  },
  streg: {
    navn: 'B · UNDERSTREG',
    linje: 'En 2 px vandret streg under cifrene alene. Enheden og kildebogstavet står urørt.',
  },
  etiket: {
    navn: 'C · ETIKET',
    linje: 'Mærket forlader tallet og rider på feltnavnet. Figurerne bliver en ren kolonne.',
  },
};

function side({ titel, krop, ekstra = '' }) {
  return `<!doctype html>
<html lang="da"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(titel)}</title>
<link rel="stylesheet" href="comp.css">
</head><body>
${SPRITE}
${krop}
${ekstra}
</body></html>`;
}

/* --- byg ------------------------------------------------------------------ */
const hent = (s) => {
  const r = db.robotter.find((x) => x.slug === s);
  if (!r) throw new Error('ukendt slug: ' + s);
  return r;
};
/* Emnevalget, og hvorfor. Maalt med retninger/maerke/fladetaethed.mjs:
   feltlisten baerer 31,5 % maerkede tal over hele kataloget, striben 45,8 %
   og kortet 52,5 %. Emnerne er valgt pr. FLADE mod fladens egen andel,
   ikke mod katalogets snit - og striben faar ogsaa sit vaerste tilfaelde,
   fordi et maerke, der kun holder ved 46 %, ikke holder. */
const EMNE = hent('xiaomi-cyberdog-1');            // feltliste: 4/12 = 33 %
const STRIBEEMNER = [
  ['xiaomi-cyberdog-2', 'typisk · 2 af 4 tal mærket. Stribens egen andel over kataloget er 45,8 %'],
  ['xiaomi-cyberdog-1', 'over snittet · 3 af 4'],
  ['weilan-alphadog-c500', 'værste tilfælde, der findes · 4 af 4. Otte af 72 robotter står sådan'],
].map(([s, note]) => ({ r: hent(s), note }));
// Katalogets tolv foerste kort i deres egen raekkefoelge - ikke haandplukket.
// Tolv er ogsaa det, en 1440-skaerm viser af gitteret paa én gang.
const KORTRAEKKE = ['yobotics-y10', 'xiaomi-cyberdog-2', 'unitree-go1',
  'mab-honey-badger-4', 'deep-robotics-lite3', 'xiaomi-cyberdog-1',
  'galileo-c1', 'yobotics-e-dog', 'genisom-gangben-l1', 'unitree-go2',
  'yufan-lingmao-cyvet', 'magiclab-magicdog-edu'].map(hent);

const maalinger = [];

function fladeblok(variant) {
  const striber = STRIBEEMNER.map(({ r, note }) => ({ ...stribeHTML(r, variant), r, note }));
  const kort = KORTRAEKKE.map((r) => kortHTML(r, variant));
  const fl = feltlisteHTML(EMNE, variant);
  const kortM = kort.reduce((a, k) => a + k.maerket, 0);
  const kortT = kort.reduce((a, k) => a + k.talceller, 0);
  const sM = striber.reduce((a, s) => a + s.maerket, 0);
  const sT = striber.reduce((a, s) => a + s.talceller, 0);
  maalinger.push({
    variant, stribe: [sM, sT], kort: [kortM, kortT], feltliste: [fl.maerket, fl.talceller],
  });
  return `
<section class="flade" id="stribe-${variant}">
<h3 class="flade-navn">1 · Robotsidens nøgletalsstribe <span class="flade-tal">${sM} mærker på ${sT} tal = ${(100 * sM / sT).toFixed(0)} % over de tre</span></h3>
${striber.map((s) => `<div class="robot-hoved">
<p class="prove-navn">${esc(s.r.producent)} ${esc(s.r.navn)} — ${esc(s.note)}</p>
${s.html}</div>`).join('\n')}
</section>

<section class="flade" id="kort-${variant}">
<h3 class="flade-navn">2 · Katalogkortet — de tolv første kort i katalogets egen rækkefølge <span class="flade-tal">${kortM} mærker på ${kortT} tal = ${(100 * kortM / kortT).toFixed(0)} %</span></h3>
<div class="gitter">${kort.map((k) => k.html).join('\n')}</div>
</section>

<section class="flade" id="felt-${variant}">
<h3 class="flade-navn">3 · Robotsidens fulde feltliste <span class="flade-tal">${fl.maerket} mærker på ${fl.talceller} tal = ${(100 * fl.maerket / fl.talceller).toFixed(0)} %</span></h3>
<div class="skema">${fl.html}</div>
</section>`;
}

// --- tre selvstaendige sider ---
for (const [v, meta] of Object.entries(VARIANTER)) {
  const krop = `<main class="rum">
<header class="comp-hoved">
<p class="comp-mikro">spor/maerke · comp · gyldighedsmærket (L48)</p>
<h1 class="comp-titel">${esc(meta.navn)}</h1>
<p class="comp-lede">${esc(meta.linje)}</p>
<p class="comp-note">Alle tal, enheder og forbeholdstekster er hentet fra kataloget. Emne: Xiaomi CyberDog (12 talfelter, 4 med gyldighedsforbehold = 33 %) og katalogets seks første kort.</p>
</header>
${fladeblok(v)}
<p class="comp-retur"><a href="index.html">← Alle tre udgaver ved siden af hinanden</a></p>
</main>`;
  fs.writeFileSync(path.join(UD, v + '.html'), side({ titel: meta.navn + ' — gyldighedsmærket', krop }), 'utf8');
}

// --- sammenligningssiden ---
const kolonner = Object.entries(VARIANTER).map(([v, meta]) => {
  const s = stribeHTML(hent('xiaomi-cyberdog-2'), v);
  const kort = [1, 4, 5].map((i) => kortHTML(KORTRAEKKE[i], v));
  const fl = feltlisteHTML(EMNE, v);
  return `<article class="spalte" id="s-${v}">
<header class="spalte-hoved"><h2>${esc(meta.navn)}</h2><p>${esc(meta.linje)}</p>
<p class="spalte-link"><a href="${v}.html">Se udgaven i fuld bredde →</a></p></header>
<div class="spalte-prove">
<p class="prove-navn">Nøgletalsstriben</p>${s.html}
<p class="prove-navn">Tre katalogkort</p><div class="gitter gitter--tre">${kort.map((k) => k.html).join('\n')}</div>
<p class="prove-navn">Feltlisten (udsnit: Fysik)</p><div class="skema">${
  fl.html.slice(fl.html.indexOf('<section class="skema-gruppe">'),
    fl.html.indexOf('</dl></section>') + 15)}</div>
</div></article>`;
}).join('\n');

const oversigt = `<main class="rum rum--bred">
<header class="comp-hoved">
<p class="comp-mikro">spor/maerke · 28. august 2026</p>
<h1 class="comp-titel">Gyldighedsmærket — tre udgaver</h1>
<p class="comp-lede">L48 gav mærket sin dækning. Formen manglede. Her er tre, sat på de samme tre flader med de samme rigtige tal, så de kan ses ved siden af hinanden.</p>
<div class="fakta">
<div><b>259</b><span>tal får mærket</span></div>
<div><b>31,5 %</b><span>af katalogets 821 talfelter</span></div>
<div><b>45,8 %</b><span>af tallene i robotsidens stribe</span></div>
<div><b>52,5 %</b><span>af tallene på katalogkortet</span></div>
</div>
<p class="comp-note">De to sidste tal er sporets eget fund og står ikke i briefet: striben og kortet viser netop de fire-fem felter, hvis forbehold oftest truer sammenligneligheden (nyttelast gående/stående, driftstid uden lastbetingelse, vægt med/uden batteri). Mærkets tæthed dér er altså ikke katalogets 31,5 % — den er over halvdelen. Genkør med <code>node retninger/maerke/fladetaethed.mjs</code>.</p>
</header>
<div class="spalter">${kolonner}</div>
<section class="flade" id="kollision">
<h3 class="flade-navn">Kollisionsprøven — de fire datatilstande plus mærket</h3>
<p class="comp-note">Hård begrænsning 5 siger, at «ikke oplyst», «nej» og «0» skal se forskellige ud. Mærket lægger en fjerde dimension oven i dem. Rækken her er ikke opdigtet: den er Xiaomi CyberDogs egne felter, med hver tilstand vist én gang.</p>
<div class="kollision">${['kant', 'streg', 'etiket'].map((v) => `<div class="kol-boks"><p class="prove-navn">${esc(VARIANTER[v].navn)}</p>
<dl class="raekker">
<div class="raekke"><dt${DTM(v,'nyttelast_gaaende')}>Nyttelast, gående</dt><dd>${vaerdiHTML(EMNE.slug, 'nyttelast_gaaende', EMNE.alle_felter.nyttelast_gaaende, { variant: v })}<span class="kol-note">tal · gyldighedsforbehold → mærket</span></dd></div>
<div class="raekke"><dt${DTM(v,'bredde')}>Bredde</dt><dd>${vaerdiHTML(EMNE.slug, 'bredde', EMNE.alle_felter.bredde, { variant: v })}<span class="kol-note">tal · intet forbehold</span></dd></div>
<div class="raekke"><dt${DTM(v,'egenvaegt')}>Egenvægt</dt><dd>${vaerdiHTML(EMNE.slug, 'egenvaegt', EMNE.alle_felter.egenvaegt, { variant: v })}<span class="kol-note">tal · uddybning → intet mærke</span></dd></div>
<div class="raekke"><dt${DTM(v,'temp_min')}>Driftstemperatur, nedre</dt><dd>${vaerdiHTML(EMNE.slug, 'temp_min', EMNE.alle_felter.temp_min, { variant: v })}<span class="kol-note kol-note--hul">nul · forbehold UDEN klasse i D14</span></dd></div>
<div class="raekke"><dt${DTM(v,'ce_oplyst')}>CE oplyst</dt><dd>${vaerdiHTML(EMNE.slug, 'ce_oplyst', EMNE.alle_felter.ce_oplyst, { variant: v })}<span class="kol-note">nej · et svar, ikke et hul</span></dd></div>
<div class="raekke"><dt${DTM(v,'ip_klasse')}>IP-klasse</dt><dd>${vaerdiHTML(EMNE.slug, 'ip_klasse', EMNE.alle_felter.ip_klasse, { variant: v })}<span class="kol-note">ikke oplyst · et hul</span></dd></div>
<div class="raekke"><dt${DTM(v,'lidar')}>LiDAR</dt><dd>${vaerdiHTML(EMNE.slug, 'lidar', EMNE.alle_felter.lidar, { variant: v })}<span class="kol-note kol-note--hul">ikke oplyst MED forbehold — 109 af dem findes</span></dd></div>
</dl></div>`).join('\n')}</div>
</section>

<section class="flade" id="maalinger">
<h3 class="flade-navn">Målingerne — hvad der skiller de tre</h3>
<p class="comp-note">Ikke «ser rigtigt ud». Alle fire kolonner er målt i browseren på præcis de sider, der står ovenfor. Kommandoerne står under tabellen, og de kan genkøres.</p>
<div class="tabelrum"><table>
<thead><tr><th>Måling</th><th>A · Kant</th><th>B · Understreg</th><th>C · Etiket</th><th>Hvad det betyder</th></tr></thead>
<tbody>
<tr><th>Markens sideværts spredning, sd(x) i px<br><span class="t-mikro">stribe / kort / feltliste</span></th>
<td class="god">0,3 / 0 / 0</td><td class="daarlig">18,3 / 10,5 / 11,8</td><td class="god">0,3 / 0 / 0</td>
<td>Stjernen døde af at <b>flytte sig</b>. Lav spredning = mærkerne læses som en kolonne. B's mærke starter og slutter, hvor cifrene tilfældigvis gør.</td></tr>
<tr><th>Markens egen størrelse</th>
<td class="god">2 px bred, én højde pr. flade</td><td class="daarlig">2 px høj, <b>9 forskellige bredder</b> på kortet</td><td class="god">2 px bred, én højde pr. flade</td>
<td>Et instrument har ét mærke, ikke ni.</td></tr>
<tr><th>Rører mærket nabotekst?<br><span class="t-mikro">mindste luft i px, 1440 / 390</span></th>
<td class="god">nej · 10,8 / 10,0</td><td class="daarlig"><b>ja</b> · 5 af 9 celler i striben ved 1440 har 0 px. På kortet 0,9 px</td><td class="god">nej · 3,5 / 3,5</td>
<td>B's streg lander oven i etiketten under tallet og læses som en understregning af feltnavnet.</td></tr>
<tr><th>Koster mærket en brækket aflæsning på kortet?</th>
<td class="god">nej (0 af 45)</td><td class="god">nej</td><td class="god">nej</td>
<td>A's første udgave kostede 1 af 45. Rettet ved at hænge marken uden for værdiboksen, i cellens egen polstring.</td></tr>
<tr><th>Vandret overløb ved 390 px</th><td class="god">0</td><td class="god">0</td><td class="god">0</td><td>Alle tre holder på telefon.</td></tr>
<tr><th>Bærer nogen af de tre andre datatilstande et mærke?</th><td class="god">0</td><td class="god">0</td><td class="god">0</td><td>Hård begrænsning 5 er urørt: kun tal og nul kan bære mærket.</td></tr>
</tbody></table></div>
<p class="comp-note">Genkør: <code>node maerke-maal.mjs http://localhost:8195/retninger/maerke 1440</code> · <code>node maerke-brud.mjs …</code> · <code>node maerke-overlap.mjs … 390</code> — alle tre i <code>C:/Praktik/websites/maalevaerktoej/</code>. Havde mærkerne siddet forkert, ville tælleren have vist noget andet end 9 / 26 / 4, som generatoren regner uafhængigt ud af databasen.</p>
</section>

<section class="flade" id="ord">
<h3 class="flade-navn">Ordene, mærket har brug for — forslag, ikke besluttet</h3>
<p class="comp-note">Et mærke uden forklaring er en gåde. Og der er et andet ordproblem ved siden af: <b>alle</b> forbeholdstekster hedder i dag «Advarsel» i feltlisten — også de 303 uddybninger, der ikke advarer om noget. Læseren, der følger et mærke ned i feltlisten, møder derfor 25 identiske overskrifter og kan ikke se, hvilken af dem mærket pegede på. Feltlisten ovenfor viser forslaget: to slags blok, to navne.</p>
<div class="tabelrum"><table>
<thead><tr><th>i18n-nøgle</th><th>da</th><th>en</th></tr></thead>
<tbody>
<tr><th>maerke_forklaring</th><td>Streg ved tallet: producentens tal er ikke uden videre sammenligneligt med de andres. Forbeholdet står ordret under «Alle felter».</td><td>Rule beside the figure: this number is not directly comparable with the others. The caveat is spelled out under “All fields”.</td></tr>
<tr><th>forbehold_gyldighed_navn</th><td>Forbehold</td><td>Caveat</td></tr>
<tr><th>forbehold_uddybning_navn</th><td>Note</td><td>Note</td></tr>
<tr><th>maerke_skaermlaeser</th><td>Forbehold: {tekst}</td><td>Caveat: {text}</td></tr>
</tbody></table></div>
<p class="comp-note"><code>data/i18n/</code> ejes af <code>spor/legende2</code> i denne runde, så nøglerne står her som forslag og er ikke skrevet ind nogen steder.</p>
</section>
</main>`;
fs.writeFileSync(path.join(UD, 'index.html'),
  side({ titel: 'Gyldighedsmærket — tre udgaver' , krop: oversigt }), 'utf8');

/* --- maalingerne, skrevet ud ---------------------------------------------- */
console.log('Skrev', ['index', ...Object.keys(VARIANTER)].map((n) => UD + '/' + n + '.html').join(', '));
console.log('\nMaerker pr. flade (identisk for alle tre udgaver — kun formen skifter):');
const m = maalinger[0];
for (const f of ['stribe', 'kort', 'feltliste']) {
  console.log(`  ${f.padEnd(10)} ${m[f][0]} maerker paa ${m[f][1]} tal = ${(100 * m[f][0] / m[f][1]).toFixed(1)} %`);
}
