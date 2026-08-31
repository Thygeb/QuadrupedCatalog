/* ==========================================================================
   byg-comp.mjs — bygger TYPESKILTET-compen af dist/robots.json

   Hvorfor en generator og ikke haandskrevet HTML: haard begraensning 2 siger
   "opfind aldrig et tal". Naar hvert tal og hvert navn i compen er REGNET af
   datafilerne, er den regel mekanisk garanteret i stedet for lovet. Etiketterne
   hentes fra data/i18n/da.json, saa heller ikke ordene er mine egne.

   Koer:  node retninger/nyverden/byg-comp.mjs      (fra worktree-roden)
   Kraever at tools/build.mjs har lagt dist/robots.json.
   Skriver KUN i retninger/nyverden/. Roerer aldrig assets/, tools/, data/, tests/.
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// Laeses KUN — tools/ aendres aldrig af dette spor.
import { parseYaml } from '../../tools/yaml.mjs';

const HER = path.dirname(fileURLToPath(import.meta.url));
const ROD = path.resolve(HER, '..', '..');
const D = JSON.parse(fs.readFileSync(path.join(ROD, 'dist', 'robots.json'), 'utf8'));
const I18N = JSON.parse(fs.readFileSync(path.join(ROD, 'data', 'i18n', 'da.json'), 'utf8'));
const R = D.robotter;

/* --- smaa hjaelpere ------------------------------------------------------- */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fladt = {};
(function flad(o, p) {
  for (const k of Object.keys(o)) {
    const v = o[k];
    if (v && typeof v === 'object' && !Array.isArray(v)) flad(v, p + k + '.');
    else fladt[k] = v;
  }
})(I18N, '');
const t = (n, res) => (fladt[n] !== undefined ? fladt[n] : (res !== undefined ? res : n));

const paastand = (ok, besked) => {
  if (!ok) { console.error('BRUD: ' + besked); process.exitCode = 1; }
  else console.log('  ok  ' + besked);
};

const felt = (x, k) => x.alle_felter[k];
const erOplyst = (f) => !!f && f.tilstand !== 'ikke_oplyst';
const tal = (f) => (f && f.tilstand === 'tal' ? (f.vaerdi ?? f.maks ?? f.min) : null);
const iCm = (f) => {
  const v = tal(f); if (v == null) return null;
  return f.enhed === 'mm' ? v / 10 : f.enhed === 'm' ? v * 100 : v;
};
const komma = (n, d = 0) => n.toLocaleString('da-DK', { minimumFractionDigits: d, maximumFractionDigits: d });

/* --- 1. Facetterne, alle regnet af data ---------------------------------- */
const tael = (nøgle) => {
  const m = new Map();
  for (const x of R) m.set(nøgle(x), (m.get(nøgle(x)) || 0) + 1);
  return m;
};

// Anvendelse (flerværdi)
const anvM = new Map();
for (const x of R) {
  const v = x.anvendelse && Array.isArray(x.anvendelse.vaerdi) ? x.anvendelse.vaerdi : [];
  if (v.length === 0) anvM.set('ikke_oplyst', (anvM.get('ikke_oplyst') || 0) + 1);
  for (const a of v) anvM.set(a, (anvM.get(a) || 0) + 1);
}
const ANV = [...anvM.entries()].filter(([k]) => k !== 'ikke_oplyst').sort((a, b) => b[1] - a[1])
  .map(([k, n]) => ({ k, n, navn: t('anvendelse_' + k) }));
const ANV_UO = anvM.get('ikke_oplyst') || 0;

// Vægtklasse
const vkM = tael((x) => x.vaegtklasse);
const VK = [
  { k: 'under_20', navn: t('vaegtklasse_under_20'), n: vkM.get('under_20') || 0, kort: ['UNDER', '20 KG'] },
  { k: '20_40', navn: t('vaegtklasse_20_40'), n: vkM.get('20_40') || 0, kort: ['20–40', 'KG'] },
  { k: 'over_40', navn: t('vaegtklasse_over_40'), n: vkM.get('over_40') || 0, kort: ['OVER', '40 KG'] },
];
const VK_UO = { k: 'ikke_oplyst', navn: t('vaegtklasse_ikke_oplyst'), n: vkM.get('ikke_oplyst') || 0, kort: ['IKKE', 'OPLYST'] };

// Højdespaend pr. vægtklasse — SIGNATUREN
for (const kl of [...VK, VK_UO]) {
  const h = R.filter((x) => x.vaegtklasse === kl.k).map((x) => iCm(felt(x, 'hoejde'))).filter((v) => v != null);
  kl.maalt = h.length;
  kl.min = h.length ? Math.min(...h) : null;
  kl.maks = h.length ? Math.max(...h) : null;
}
const H_MAALT = [...VK, VK_UO].reduce((s, k) => s + k.maalt, 0);
const H_TOP = Math.max(...VK.map((k) => k.maks));

// IP-klasse
const ipM = new Map();
for (const x of R) {
  const f = felt(x, 'ip_klasse');
  const k = !erOplyst(f) ? 'ikke_oplyst' : f.tilstand === 'nej' ? 'nej' : String(f.vaerdi);
  ipM.set(k, (ipM.get(k) || 0) + 1);
}
const IP = [...ipM.entries()].filter(([k]) => k !== 'ikke_oplyst' && k !== 'nej')
  .sort((a, b) => a[0].localeCompare(b[0])).map(([k, n]) => ({ k, navn: k, n }));
const IP_NEJ = ipM.get('nej') || 0;
const IP_UO = ipM.get('ikke_oplyst') || 0;

// Status
const stM = tael((x) => x.status);
const ST = ['i_produktion', 'annonceret', 'udgaaet'].map((k) => ({ k, navn: t('status_' + k), n: stM.get(k) || 0 }));

// Land
const laM = tael((x) => x.producentland);
const LA = [...laM.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'da')).map(([k, n]) => ({ k, navn: k, n }));

/* --- 2. Egenskabschips: ja / nej / nul / ikke oplyst ---------------------- */
const chip = (navn, nøgle, praed) => {
  let ja = 0, nej = 0, uo = 0;
  for (const x of R) {
    const f = felt(x, nøgle);
    if (!erOplyst(f)) { uo++; continue; }
    if (praed(f)) ja++; else nej++;
  }
  return { navn, nøgle, ja, nej, uo, sum: ja + nej + uo };
};
const erJa = (f) => f.tilstand === 'ja';
const CHIPS = [
  chip('Går på trapper', 'trappetrin_kontinuerlig', () => true),
  chip('Bærer fra 5 kg gående', 'nyttelast_gaaende', (f) => (tal(f) ?? 0) >= 5),
  chip('Arbejder i frost', 'temp_min', (f) => (f.tilstand === 'nul' ? 0 : tal(f) ?? 99) <= -10),
  chip('Lader selv', 'dockingstation', erJa),
  chip('Hot-swap-batteri', 'hot_swap', erJa),
];
// Hvor mange af "Arbejder i frost"-nej'erne er en MÅLT nul?
const FROST_NUL = R.filter((x) => felt(x, 'temp_min') && felt(x, 'temp_min').tilstand === 'nul').length;

// Oplyste feltvaerdier i hele kataloget. Regnet, ikke afskrevet: bygget melder
// "1110 tal med kilde", men det tal taeller noget andet (kun talfelter), og et
// haandskrevet tal ved siden af et udledt er praecis D7/L30-faelden.
const FELTER_I_ALT = R.reduce((s, x) => s + Object.keys(x.alle_felter).length, 0);
const OPLYSTE = R.reduce((s, x) => s + Object.keys(x.alle_felter).filter((k) => erOplyst(x.alle_felter[k])).length, 0);

/* --- 3. Den viste filtertilstand ----------------------------------------- */
const harAnv = (x, v) => Array.isArray(x.anvendelse?.vaerdi) && x.anvendelse.vaerdi.includes(v);
const VALGT_ANV = 'inspektion';
const VALGT_IP = 'IP67';
const TRUFNE = R.filter((x) =>
  x.status !== 'udgaaet' && harAnv(x, VALGT_ANV) &&
  felt(x, 'ip_klasse')?.tilstand === 'tal' && felt(x, 'ip_klasse').vaerdi === VALGT_IP
).sort((a, b) => (a.producent + a.navn).localeCompare(b.producent + b.navn, 'da'));
const UDGAAEDE = stM.get('udgaaet') || 0;

/* --- 4. Billedfiler ------------------------------------------------------- */
const FOTOMAPPE = path.join(ROD, 'assets', 'fotos', 'fabrikant');
const fotoMap = {};
if (fs.existsSync(FOTOMAPPE)) for (const f of fs.readdirSync(FOTOMAPPE)) fotoMap[f.replace(/\.[^.]+$/, '')] = f;
const foto = (slug) => (fotoMap[slug] ? '../../assets/fotos/fabrikant/' + fotoMap[slug] : null);

/* --- 5. Mærkerne: fire tilstande, fire tegninger ------------------------- */
const M = {
  flue: '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1.3 5.1 3.9 7.7 8.7 2.1" fill="none" stroke="#22262A" stroke-width="1.9" stroke-linecap="square"/></svg>',
  stiplet: '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1.3 5.1 3.9 7.7 8.7 2.1" fill="none" stroke="#22262A" stroke-width="1.9" stroke-linecap="square"/></svg>',
  ja: '<svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true"><rect x="1" y="1" width="9" height="9" rx="1" fill="currentColor"/></svg>',
  nej: '<svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true"><rect x="1.6" y="1.6" width="7.8" height="7.8" rx="1" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M3.2 7.8 7.8 3.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  nul: '<svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true"><rect x="1.6" y="1.6" width="7.8" height="7.8" rx="1" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="5.5" cy="5.5" r="1.7" fill="currentColor"/></svg>',
  uoplyst: '<svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true"><rect x="1.6" y="1.6" width="7.8" height="7.8" rx="1" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2.4 1.9"/></svg>',
  kryds: '<svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true"><path d="M1.4 1.4 7.6 7.6M7.6 1.4 1.4 7.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  pil: '<svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true"><path d="M7 1.5 2.5 5.5 7 9.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  plus: '<svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true"><path d="M5.5 1.8v7.4M1.8 5.5h7.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
};

/* --- 6. Byggeklodser ------------------------------------------------------ */
const raekke = (id, navn, antal, o = {}) => {
  const kl = ['rk', o.uoplyst ? 'rk--uoplyst' : '', o.nej ? 'rk--nej' : ''].filter(Boolean).join(' ');
  const indhold = o.nej ? M.nej : M.flue;
  return `<div class="${kl}">
<input class="rk__felt" type="checkbox" id="${id}"${o.valgt ? ' checked' : ''}>
<label class="rk__mrk" for="${id}">
<span class="rk__boks">${indhold}</span>
<span class="rk__navn">${esc(navn)}</span>
<span class="rk__antal">${komma(antal)}</span>
</label>
</div>`;
};

const facet = (navn, o, note, krop) => `<fieldset class="facet facet--s${o.s}${o.slut ? ' facet--raekkeslut' : ''}${o.sidst ? ' facet--sidste-raekke' : ''}">
<legend class="facet__navn">${esc(navn)}${note ? `<span class="facet__tal">${esc(note)}</span>` : ''}</legend>
${krop}
</fieldset>`;

/* 6a. SIGNATUREN: højdelinealen ------------------------------------------ */
function lineal() {
  const B = 400, H = 216, GRUND = 166, TOP_CM = 100, SK = 1.32;
  const y = (cm) => GRUND - cm * SK;
  const kol0 = 46, kolB = 76, spring = 92;
  const kx = (i) => kol0 + i * spring;
  let s = `<svg class="lineal" viewBox="0 0 ${B} ${H}" role="img" aria-labelledby="lineal-t lineal-b">
<title id="lineal-t">Højden pr. vægtklasse i fælles målestok</title>
<desc id="lineal-b">${VK.map((k) => `${k.navn}: målt højde ${komma(k.min, 0)} til ${komma(k.maks, 0)} centimeter på ${k.maalt} af ${k.n} robotter.`).join(' ')} ${VK_UO.navn}: ingen af de ${VK_UO.n} robotter oplyser en højde, og gruppen kan derfor ikke tegnes i målestok.</desc>`;
  for (const cm of [0, 25, 50, 75, 100]) {
    const yy = y(cm).toFixed(1);
    s += `<line x1="40" y1="${yy}" x2="${B - 2}" y2="${yy}" stroke="${cm === 0 ? '#22262A' : '#C6CCD1'}" stroke-width="${cm === 0 ? 1.5 : 1}"${cm === 0 ? '' : ' stroke-dasharray="1 3"'}/>`;
    s += `<text class="lineal__akse" x="34" y="${(y(cm) + 3.4).toFixed(1)}" text-anchor="end">${cm}</text>`;
  }
  s += `<text class="lineal__akse" x="34" y="${(y(TOP_CM) - 9).toFixed(1)}" text-anchor="end">CM</text>`;
  VK.forEach((k, i) => {
    const x = kx(i), yTop = y(k.maks), h = y(k.min) - y(k.maks);
    s += `<rect x="${x}" y="${yTop.toFixed(1)}" width="${kolB}" height="${Math.max(h, 2).toFixed(1)}" rx="2" fill="#22262A"/>`;
    s += `<text class="lineal__spand" x="${x + kolB / 2}" y="${(yTop - 6).toFixed(1)}" text-anchor="middle">${komma(k.min, 0)}–${komma(k.maks, 0)} cm</text>`;
    s += `<text class="lineal__navn" x="${x + kolB / 2}" y="${GRUND + 15}" text-anchor="middle">${k.kort[0]}</text>`;
    s += `<text class="lineal__navn" x="${x + kolB / 2}" y="${GRUND + 26}" text-anchor="middle">${k.kort[1]}</text>`;
    s += `<text class="lineal__spand" x="${x + kolB / 2}" y="${GRUND + 40}" text-anchor="middle">${k.maalt} af ${k.n} målt</text>`;
  });
  const x3 = kx(3), yTop3 = y(TOP_CM);
  s += `<rect x="${x3}" y="${yTop3.toFixed(1)}" width="${kolB}" height="${(GRUND - yTop3).toFixed(1)}" rx="2" fill="none" stroke="#9AA3A9" stroke-width="1.3" stroke-dasharray="4 3.5"/>`;
  s += `<text class="lineal__ukendt" x="${x3 + kolB / 2}" y="${(GRUND - (GRUND - yTop3) / 2 + 3).toFixed(1)}" text-anchor="middle">UKENDT</text>`;
  s += `<text class="lineal__navn" x="${x3 + kolB / 2}" y="${GRUND + 15}" text-anchor="middle" fill="#5F686F">${VK_UO.kort[0]}</text>`;
  s += `<text class="lineal__navn" x="${x3 + kolB / 2}" y="${GRUND + 26}" text-anchor="middle" fill="#5F686F">${VK_UO.kort[1]}</text>`;
  s += `<text class="lineal__spand lineal__spand--uoplyst" x="${x3 + kolB / 2}" y="${GRUND + 40}" text-anchor="middle">0 af ${VK_UO.n} målt</text>`;
  s += `</svg>`;
  return s;
}

/* --- 7. Katalogsiden ------------------------------------------------------ */
const KONTRAKT = `<!--
TYPESKILTET — retningskontrakt, spor/nyverden, 31. aug 2026

THESIS: Filtret er ikke et sidepanel. Det er typeskiltet — den stansede plade
enhver industrimaskine bærer, med hvad den er, hvad den tåler, og hvad der IKKE
står på den. Afviser SaaS-filterskuffen med bløde pill-chips langs venstre kant.

OWN-WORLD: Eloxgrå #E8EBED plade, gunmetal #22262A stanset blæk, afmærkningsgul
#F2C400 KUN som markering, støvgrå #9AA3A9 stiplet kontur for ikke oplyst, kridt
#FAFBFB kortflade. Saira Semi Condensed som pladens skrift, Literata som manualens.
Ingen monospace, ingen gradient, intet glas, ingen slagskygge — kun 1 px indfældet
kant og 2 px radius.

STORY: Læseren ser at feltet er måleligt, at 27 af 77 ikke oplyser IP-klasse, og at
"ikke oplyst" er et tælleligt svar — og snævrer 77 ind til 21.

FIRST VIEWPORT: Pladen fylder foldet. Typeskiltets hoved øverst med TYPE/UDGAVE/
POSTER/TAL MED KILDE stanset til højre; derunder den klæbende strimmel med de
aktive valg og tælleren i gult; derunder facetlaget i fire stansede felter, hvor
VÆGTKLASSE bærer højdelinealen.

FORM: Typeskilt/maskinskilt. Pinnet af briefet (L54–L56), ikke rullet frem.

FINISH: comp, ikke implementering. Leverancen er retningen, ikke en bygget side.
-->`;

const hoved = (titel, ekstra = '') => `<!doctype html>
<html lang="da">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(titel)}</title>
<link rel="stylesheet" href="typeskilt.css">
${ekstra}</head>
<body>
${KONTRAKT}
<a class="spring-til" href="#resultat">Spring til resultatet</a>`;

const daek = (aktiv) => `<header class="daek">
<div class="daek__ramme">
<a class="daek__navn" href="katalog.html">Firbenede robotter</a>
<ul class="daek__nav">
<li><a href="katalog.html"${aktiv === 'oversigt' ? ' aria-current="page"' : ''}>Oversigt</a></li>
<li><a href="#">Nyheder</a></li>
<li><a href="#">Services</a></li>
<li><a href="#">Om os</a></li>
</ul>
<p class="sprog"><a href="#" aria-current="true" hreflang="da">DA</a><span>/</span><a href="#" hreflang="en">EN</a></p>
</div>
</header>`;

const bund = `<footer class="bund">
<div class="ramme">
<p>Udgivet af KeyResearch, Aarhus. Hvert tal på siden har en kilde og en hentedato.
Kataloget sælger ikke robotter og har ingen forhandleraftale med nogen fabrikant.
Fotografierne tilhører fabrikanterne og er gengivet med kilde.</p>
</div>
</footer>
</body>
</html>`;

function katalog() {
  const anvRk = ANV.map((a, i) => raekke('anv-' + a.k, a.navn, a.n, { valgt: a.k === VALGT_ANV })).join('\n')
    + '\n' + raekke('anv-uo', t('tilstand_ikke_oplyst', 'ikke oplyst'), ANV_UO, { uoplyst: true });

  const vkRk = VK.map((k) => raekke('vk-' + k.k, k.navn, k.n)).join('\n')
    + '\n' + raekke('vk-uo', VK_UO.navn, VK_UO.n, { uoplyst: true });

  const chipsHtml = CHIPS.map((c, i) => {
    const dele = [
      `<span class="d d--ja">${M.ja}${komma(c.ja)}<span class="d__ord">ja</span></span>`,
      `<span class="d ${c.nej === 0 ? 'd--nul' : 'd--nej'}">${c.nej === 0 ? M.nul : M.nej}${komma(c.nej)}<span class="d__ord">nej</span></span>`,
      `<span class="d d--uoplyst">${M.uoplyst}${komma(c.uo)}<span class="d__ord">ikke oplyst</span></span>`,
    ].join('\n');
    return `<div class="chip">
<input class="chip__felt" type="checkbox" id="eg-${i}">
<label class="chip__krop" for="eg-${i}">
<span class="chip__navn">${esc(c.navn)}</span>
<span class="deling">
${dele}
</span>
</label>
</div>`;
  }).join('\n');

  const ipRk = IP.map((p) => raekke('ip-' + p.k, p.navn, p.n, { valgt: p.k === VALGT_IP })).join('\n')
    + '\n' + raekke('ip-nej', 'Producenten oplyser: ingen IP-klasse', IP_NEJ, { nej: true })
    + '\n' + raekke('ip-uo', t('tilstand_ikke_oplyst', 'ikke oplyst'), IP_UO, { uoplyst: true });

  const stRk = ST.map((s) => raekke('st-' + s.k, s.navn, s.n, { valgt: s.k !== 'udgaaet' })).join('\n');
  const laRk = LA.map((l) => raekke('la-' + l.k, l.navn, l.n)).join('\n');

  const kort = TRUFNE.map((x) => {
    const f = foto(x.slug);
    const alt = `${x.producent} ${x.navn} — fabrikantens eget produktfoto`;
    return `<a class="kort" href="robot-spot.html">
${x.status !== 'i_produktion' ? `<span class="kort__mrk">${esc(t('status_' + x.status))}</span>` : ''}
<span class="kort__billedled">${f ? `<img src="${f}" alt="${esc(alt)}" loading="lazy" width="320" height="240">` : ''}</span>
<span class="kort__tekst">
<span class="kort__prod">${esc(x.producent)}</span>
<span class="kort__navn">${esc(x.navn)}</span>
</span>
</a>`;
  }).join('\n');

  return `${hoved('Katalog over firbenede robotter — TYPESKILTET (comp)')}
${daek('oversigt')}
<main>
<section class="plade" aria-labelledby="plade-titel">
<div class="ramme">
<div class="plade__krop">

<div class="plade__hoved">
<div>
<h1 class="plade__titel" id="plade-titel">Katalog over firbenede robotter</h1>
<p class="plade__under">${R.length} robotter fra ${new Set(R.map((x) => x.producentland)).size} lande.
Hvert tal har en kilde og en hentedato. Felter, producenten ikke oplyser, er tællet med — de er ikke tomme, de er stiplede.</p>
</div>
<div class="stempelblok">
<dl class="stempler">
<dt>Type</dt><dd>QUAD-${R.length}</dd>
<dt>Udgave</dt><dd>${esc(D.genereret)}</dd>
<dt>Poster</dt><dd>${komma(R.length)}</dd>
<dt>Oplyste felter</dt><dd>${komma(OPLYSTE)}</dd>
</dl>
<p class="comp-stempel">Comp · én filtertilstand</p>
</div>
</div>

<div class="strimmel">
<span class="strimmel__mrk">Valgt</span>
<ul class="valgliste">
<li class="valg">${esc(t('anvendelse_' + VALGT_ANV))}<button class="valg__fjern" type="button" aria-label="Fjern filteret ${esc(t('anvendelse_' + VALGT_ANV))}">${M.kryds}</button></li>
<li class="valg">${VALGT_IP}<button class="valg__fjern" type="button" aria-label="Fjern filteret ${VALGT_IP}">${M.kryds}</button></li>
<li class="valg valg--standard">Udgåede skjult (${UDGAAEDE})<button class="valg__fjern" type="button" aria-label="Vis også udgåede modeller">${M.kryds}</button></li>
</ul>
<p class="taeller"><span class="taeller__tal">${komma(TRUFNE.length)}</span><span class="taeller__af">af ${komma(R.length)}</span></p>
<button class="nulstil" type="button">Nulstil</button>
</div>

<details class="udtraek" open>
<summary>Filtre<span class="haandtag">${M.plus}</span></summary>
<form class="facetter">
<div class="facetter__net">

${facet(t('filter_anvendelse'), { s: 3 }, 'flerværdi', anvRk)}

${facet(t('filter_vaegt'), { s: 4 }, 'målestok', `${lineal()}
<p class="fod">Højden er målt på de <b>${H_MAALT} af ${R.length}</b> robotter, der oplyser den.
Klasserne overlapper: en robot på ${VK[1].navn.toLowerCase()} kan være højere end en på ${VK[2].navn.toLowerCase()}.
Gruppen uden oplyst vægt kan slet ikke tegnes — derfor står den stiplet og tom.</p>
${vkRk}`)}

${facet('Egenskaber', { s: 5, slut: true }, 'ja · nej · ikke oplyst', `${chipsHtml}
<p class="fod">Hver linje summer til ${R.length}. Af de ${CHIPS[2].nej} robotter, der <b>ikke</b> arbejder i frost,
har <b>${FROST_NUL}</b> en målt nedre grænse på præcis 0 °C — et målt nul, ikke et manglende svar.</p>`, { bred: true })}

${facet(t('felt_ip_klasse'), { s: 3, sidst: true }, null, ipRk)}

${facet(t('filter_status'), { s: 3, sidst: true }, 'standard: udgåede skjult', stRk)}

${facet('Land', { s: 3, sidst: true }, null, laRk)}

${facet('Certificeringer', { s: 3, sidst: true, slut: true }, 'reserveret', `<div class="reserveret">
<p class="reserveret__ord">Certificeringer — indsamles</p>
<p class="reserveret__note">Pladsen står tom, fordi feltet ikke er indsamlet endnu.
CE er oplyst på ${R.filter((x) => erOplyst(felt(x, 'ce_oplyst'))).length} af ${R.length} robotter.
Facetten åbner, når der er data at filtrere på — ikke før.</p>
</div>`)}

</div>
</form>
</details>

</div>
</div>
</section>

<section class="resultat" id="resultat" tabindex="-1">
<div class="ramme">
<div class="resultat__hoved">
<h2 class="resultat__titel">${komma(TRUFNE.length)} robotter</h2>
<div class="sorter">
<label for="sorter">Sortering</label>
<select id="sorter">
<option selected>Alfabetisk</option>
<option>Lanceringsdato</option>
<option>Pris</option>
<option>Nyttelast</option>
<option>Hastighed</option>
</select>
</div>
</div>
<div class="net">
${kort}
</div>
</div>
</section>
</main>
${bund}`;
}

/* --- 8. Robotsiden -------------------------------------------------------- */
const SPOT = R.find((x) => x.slug === 'boston-dynamics-spot');

/* Kildebogstav PR. FELT. Foerste udgave stemplede "A" paa hvert eneste felt.
   Det var en paastand, jeg ikke kunne belaegge: dist/robots.json baerer ikke
   kilden pr. felt, kun en liste over robottens kilder. YAML'en goer — og for
   Spot peger fx laengde paa databladet (B), ikke produktsiden (A). Bogstavet
   udledes derfor af YAML'ens kilde-URL, og felter uden match faar INTET
   bogstav i stedet for et gaet. */
const SPOT_YAML = parseYaml(
  fs.readFileSync(path.join(ROD, 'data', 'robots', 'boston-dynamics-spot.yaml'), 'utf8'),
  'boston-dynamics-spot.yaml'
);
const URL_TIL_BOGSTAV = new Map(SPOT.kilder.map((k) => [k.url, k.bogstav]));
const bogstavFor = (nøgle) => {
  const f = SPOT_YAML.felter[nøgle];
  if (!f || typeof f !== 'object' || !f.kilde) return null;
  return URL_TIL_BOGSTAV.get(f.kilde) || null;
};

const GRUPPER = [
  ['Mål og vægt', ['egenvaegt', 'laengde', 'bredde', 'hoejde', 'frihedsgrader']],
  ['Bevægelse', ['hastighed', 'haeldning', 'forhindring_enkelt', 'trappetrin_kontinuerlig']],
  ['Nyttelast og udvidelser', ['nyttelast_gaaende', 'nyttelast_staaende', 'monteringsinterface', 'stroem_ud', 'dataporte']],
  ['Miljø og strøm', ['ip_klasse', 'temp_min', 'temp_maks', 'batteri_wh', 'driftstid', 'hot_swap', 'ladetid', 'dockingstation']],
  ['Sansning og software', ['lidar', 'kameraer', 'compute', 'ros2', 'sdk_sprog', 'autonominiveau']],
  ['Marked', ['pris', 'ce_oplyst']],
];

function vaerdi(f) {
  if (!erOplyst(f)) return `<span class="uo">${M.uoplyst}${esc(t('tilstand_ikke_oplyst', 'ikke oplyst'))}</span>`;
  if (f.tilstand === 'nej') return `<span class="nejv">${M.nej}nej</span>`;
  if (f.tilstand === 'ja') return `<span class="nejv">${M.ja}ja</span>`;
  // NBSP mellem tal og enhed (33,8 kg) er SI-typografi og skal blive.
  // Undtagelsen er gradtegnet for en VINKEL: 30°, uden mellemrum. °C beholder sit.
  const enh = (e) => (!e ? '' : e === '°' ? esc(e) : ' ' + esc(e));
  if (f.tilstand === 'nul') return `0${enh(f.enhed)}`;
  if (f.tilstand === 'tekst') return esc(f.tekst);
  const op = f.operator ? esc(f.operator) : '';
  if (f.vaerdi != null) return op + esc(komma(f.vaerdi, Number.isInteger(f.vaerdi) ? 0 : 1)) + enh(f.enhed);
  if (f.min != null && f.maks != null) return `${komma(f.min)}–${komma(f.maks)}${enh(f.enhed)}`;
  return esc(String(f.vaerdi));
}

function robotside() {
  const x = SPOT;
  const f = foto(x.slug);
  const oplyste = Object.keys(x.alle_felter).filter((k) => erOplyst(x.alle_felter[k])).length;
  const naevner = D.naevnere[0];
  const pct = x.taethed[String(naevner)];

  const raekker = GRUPPER.map(([navn, felter]) => {
    const rk = felter.map((k) => {
      const fe = x.alle_felter[k];
      if (!fe) return '';
      const uo = !erOplyst(fe);
      return `<tr${uo ? ' class="uoplyst"' : ''}>
<th scope="row">${esc(t('felt_' + k, k))}</th>
<td class="v">${vaerdi(fe)}</td>
<td class="k">${uo
        ? (fe.forbehold ? `<span class="forbehold">${esc(fe.forbehold)}</span>` : '')
        : `${bogstavFor(k) ? `<span class="kilde-bogstav">${bogstavFor(k)}</span>` : ''}${fe.forbehold ? `<span class="forbehold">${esc(fe.forbehold)}</span>` : ''}`}</td>
</tr>`;
    }).join('\n');
    return `<tbody><tr><th scope="rowgroup" colspan="3" style="padding-top:22px;font-size:10.5px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#5F686F">${esc(navn)}</th></tr>
${rk}</tbody>`;
  }).join('\n');

  return `${hoved(`${x.producent} ${x.navn} — TYPESKILTET (comp)`)}
${daek('oversigt')}
<main>
<div class="ramme">
<a class="retur" href="katalog.html">${M.pil}Tilbage til kataloget</a>

<article class="post">

<div class="post__billede">
${f ? `<img src="${f}" alt="${esc(x.producent + ' ' + x.navn + ' — fabrikantens eget produktfoto')}" width="640" height="480">` : ''}
</div>

<div class="post__hoved">
<p class="post__prod">${esc(x.producent)} · ${esc(x.producentland)}</p>
<h1 class="post__navn">${esc(x.navn)}</h1>
<p class="post__linje">
<span class="mrk mrk--drift">${esc(t('status_' + x.status))}</span>
<span class="mrk">${esc(t('vaegtklasse_' + x.vaegtklasse))}</span>
${x.anvendelse.vaerdi.map((a) => `<span class="mrk">${esc(t('anvendelse_' + a))}</span>`).join('\n')}
<span class="mrk mrk--uoplyst">${esc(t('felt_ce_oplyst'))}: ${esc(t('tilstand_ikke_oplyst', 'ikke oplyst'))}</span>
</p>

<div class="taethedsplade">
<p class="taethedsplade__top"><span class="taethedsplade__tal">${pct} %</span><span class="taethedsplade__ord">${esc(t('taethed_titel'))}</span></p>
<div class="bjaelke"><i style="width:${pct}%"></i></div>
<p>${esc(t('taethed_forklaring'))} Her: <b>${oplyste} af ${naevner}</b> felter udfyldt.</p>
</div>
<div class="kildeliste">
<h2 class="skema__navn" style="padding:0 0 4px">Kilder</h2>
<ol>
${x.kilder.map((k) => `<li><span class="kilde-bogstav">${esc(k.bogstav)}</span><a href="${esc(k.url)}">${esc(k.url)}</a> — hentet ${esc(k.hentet)}</li>`).join('\n')}
</ol>
</div>
</div>

<p class="post__ophav">Foto: ${esc(x.producent)}. Gengivet fra <a href="${esc(x.kilder[0].url)}">producentens produktside</a>, hentet ${esc(x.kilder[0].hentet)}.</p>

<div class="skema">
<h2 class="skema__navn">Specifikationer</h2>
<table class="tabel">
<caption>Bogstavet peger på kilden øverst til højre. Felter uden tal er stiplede: producenten oplyser dem ikke — det er ikke det samme som nul, og ikke det samme som nej.</caption>
<thead><tr><th>Felt</th><th>Værdi</th><th>Kilde og forbehold</th></tr></thead>
${raekker}
</table>
</div>


</article>
</div>
</main>
${bund}`;
}

/* --- 9. Skriv og efterprøv ---------------------------------------------- */
fs.writeFileSync(path.join(HER, 'katalog.html'), katalog(), 'utf8');
fs.writeFileSync(path.join(HER, 'robot-spot.html'), robotside(), 'utf8');

console.log('\nSKREVET: katalog.html, robot-spot.html\n');
console.log('SELVTJEK — hver facet skal summe til antallet af robotter:');
paastand(VK.reduce((s, k) => s + k.n, 0) + VK_UO.n === R.length, `vægtklasse summer til ${R.length}`);
paastand(ST.reduce((s, k) => s + k.n, 0) === R.length, `status summer til ${R.length}`);
paastand(LA.reduce((s, k) => s + k.n, 0) === R.length, `land summer til ${R.length}`);
paastand(IP.reduce((s, k) => s + k.n, 0) + IP_NEJ + IP_UO === R.length, `IP-klasse summer til ${R.length}`);
for (const c of CHIPS) paastand(c.sum === R.length, `chip "${c.navn}" summer til ${R.length} (${c.ja}/${c.nej}/${c.uo})`);
paastand(H_MAALT === R.filter((x) => iCm(felt(x, 'hoejde')) != null).length, `højdelinealens ${H_MAALT} målte højder er alle målte højder`);
paastand(VK_UO.maalt === 0, `gruppen "${VK_UO.navn}" har 0 målte højder og kan ikke tegnes i målestok`);

const navne = new Set(TRUFNE.map((x) => x.navn));
paastand(navne.size >= 20, `katalog-compen viser ${navne.size} forskellige robotnavne (krævet: 20)`);
paastand(TRUFNE.every((x) => foto(x.slug)), `alle ${TRUFNE.length} kort har et fabrikantfoto`);

const html = fs.readFileSync(path.join(HER, 'katalog.html'), 'utf8');
const facetdel = html.slice(html.indexOf('class="facetter"'), html.indexOf('id="resultat"'));
const uoplyst = (facetdel.match(/ikke oplyst/g) || []).length;
paastand(uoplyst >= 7, `"ikke oplyst" står ${uoplyst} gange i filtersektionen (krævet: 7)`);
console.log('\nHØJDESPAEND: ' + [...VK, VK_UO].map((k) => `${k.navn} ${k.maalt}/${k.n}` + (k.min != null ? ` ${komma(k.min, 0)}–${komma(k.maks, 0)} cm` : ' — kan ikke tegnes')).join(' | '));
console.log('VIST TILSTAND: ' + t('anvendelse_' + VALGT_ANV) + ' + ' + VALGT_IP + ', udgåede skjult => ' + TRUFNE.length + ' af ' + R.length);
