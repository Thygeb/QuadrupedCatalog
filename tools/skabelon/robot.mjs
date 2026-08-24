/**
 * tools/skabelon/robot.mjs — robotsiden.
 *
 * L14: billeddrevet, ikke datablad. Fotografiet foerst, fem noegletal, og derefter
 * doeren ud til producentens egen side. Det fulde skema staar sammenklappet: det er
 * tilgaengeligt, men det er ikke det, siden handler om.
 *
 * KRITIK-1 K1 er den regel, alt andet boejer sig for: hvert tal baerer sin egen kilde.
 * Maalt paa data: 16 af 46 poster henter tal fra mere end én URL (Spot henter seks
 * felter fra et pdf-datablad og resten fra produktsiden). Derfor staar der INGEN
 * saetning paa siden, der lover én kilde. Kildelisten er bygget af de faktiske
 * distinkte URL'er i posten, og hvert tal peger paa sin med et bogstav.
 *
 * ---------------------------------------------------------------------------
 * KONTRAKTEN (laast — side.mjs skrives af en anden agent)
 *
 *   import { skal, hjaelp } from './side.mjs';
 *   export function render(ctx)     // HTML-streng til <main>
 *   ctx = { robot, producent, i18n, sprog, url, hjaelp }
 *
 * `skal` er importeret, fordi kontrakten kraever importen, men den KALDES IKKE
 * herfra. Kontrakten dokumenterer ikke dens signatur, og de to naerliggende
 * laesninger — "skal(...) tegner sidens skal (dokumentet)" og "skal(betingelse,
 * besked) er en assertion" — kan ikke begge kaldes rigtigt. En skal-funktion,
 * der tegner dokumentet, maa desuden ikke kaldes inde fra <main>. Se rapporten.
 *
 * FORVENTNINGER TIL hjaelp (skrevet ud, saa de kan efterproeves, ikke gaettes):
 *
 *   hjaelp.tal(post, sprog)      -> '<span class="v v-tal">…</span>'
 *        Ejer ALT inde i figuren: operator (regel 4: "> 40 kg", ikke "40 kg"),
 *        interval (regel 5: "20~25 cm" er ikke 22,5), enhed og imperial.
 *        Ejer IKKE ved_last, advarsel, note, varianter eller kildemaerke —
 *        dem tegner denne fil, se `forbehold()`, `advarsel()` og `varianter()`.
 *        Kaldes ogsaa for art:'ip' ("IP67" er en figur, ikke prosa).
 *   hjaelp.tilstand(v, i18n)     -> '<span class="v v-ikke|v-nej|v-ja|v-billede">…</span>'
 *        v er 'ikke_oplyst' | 'nej' | 'ja' | 'kun_billede'.
 *        De fire tilstande maa aldrig se ens ud (CLAUDE.md begraensning 5).
 *   hjaelp.kildemaerke(post, kilder) -> '<a class="kildemaerke" href="#kilde-A">A</a>' | ''
 *        ANKERET SKAL VAERE '#kilde-<bogstav>'. Kildelisten nedenfor saetter
 *        id="kilde-<bogstav>" paa hver <li>. Aendrer den ene form sig, peger
 *        maerkerne ud i luften — og det sker tavst.
 *   hjaelp.kilder(robot)         -> [{ bogstav, url, vaert?, hentet, kildetype?, felter? }]
 *        Én post pr. DISTINKT URL. Raekkefoelgen er listens raekkefoelge.
 *   hjaelp.vaegtklasse(robot)    -> 'under_20' | '20_40' | 'over_40' | 'ikke_oplyst'
 *        eller et objekt med .noegle. Bruges kun til en kontekstlinje.
 *   hjaelp.anvendelse(robot)     -> { vaerdi:[…], citat:[…], kilde?, hentet?, note?, arvet_fra? }
 *
 * BILLEDET er ikke i kontrakten, men maskineriet er faelles. Denne fil skriver
 * IKKE sit eget billedled: den kalder `billedledHTML` i side.mjs med teksterne
 * fra sit eget sprog. To haandskrevne billedled — ét paa kortet og ét her —
 * ville divergere ved den fjerde aendring, og saa kunne den samme fil staa uden
 * maerke det ene sted og med maerke det andet.
 *
 * Feltet er `robot.billede` fra YAML'en (skema.mjs, R18):
 *   { fil, ophav, kilde, hentet, alt, note, delt_med, plade, pos }
 * `fil` er RELATIV TIL assets/. Bygget kopierer assets/ til dist/billeder/, og
 * media/ indgaar aldrig. Mangler feltet, tegnes den tomme plade — maalt
 * 21.08.2026: 46 af 46 robotter, fordi assets/ er tom. De skal se bevidste ud,
 * ikke oedelagte (K5).
 *
 * `ctx.billede` accepteres stadig som en OVERSKRIVNING, saa producentsiden kan
 * give kortene et billede, den selv har slaaet op.
 *
 * IKONER: <use href="#i-…"> kraever, at spriten staar i dokumentet. Den hoerer til
 * skallen, ikke til <main>. Glemmes den, forsvinder ikonerne TAVST (system.html,
 * knaek 1). Derfor eksporteres `IKONER` nedenfor, saa bygget kan taelle efter.
 *
 * NYE i18n-NOEGLER, denne fil kraever (én fil pr. sprog, PLAN.md afsnit 7):
 *   eu_titel · eu_forklaring · produktside_titel · produktside_forklaring ·
 *   produktside_link · produktside_ingen · skema_titel · skema_taeller ·
 *   kilder_titel · kilder_forklaring · varianter_forklaring · billede_ingen_egen ·
 *   billede_ophav_eget_foto · billede_ophav_silhuet · billede_alt_silhuet ·
 *   til_producent · vaegtklasse_under_20 · vaegtklasse_20_40 · vaegtklasse_over_40
 * OG én rettelse: `noegletal_intet` siger "ingen af de seks noegletal". Striben har
 * fem her — CE er taget ud. Strengen skal skrives om, saa den ikke naevner et antal.
 */

import { skal, hjaelp, laesBillede, billedledHTML, billedLinjer } from './side.mjs';
// Skrivebeskyttet import af skemaet. Feltlisten maa kun findes ét sted; en
// haandskrevet kopi her ville divergere ved den fjerde aendring.
import { FELTER, FELTNAVNE, GRUPPER, tilstandAf } from '../skema.mjs';

/* ------------------------------------------------------------------ hjaelp */

export const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Ikoner, siden bruger. Bygget kan bruge listen til at efterproeve spriten. */
export const IKONER = ['i-vaegt', 'i-nyttelast', 'i-driftstid', 'i-fart', 'i-ip', 'i-ce', 'i-hul', 'i-pil'];

/** Stribens fem tal. CE er IKKE med: feltet er tomt paa 42 af 46, og en fast
 *  celle, der er et hul 42 gange, laerer ingen noget. CE faar sin egen blok. */
export const STRIBE_FELTER = [
  ['egenvaegt', 'i-vaegt'],
  ['nyttelast_gaaende', 'i-nyttelast'],
  ['driftstid', 'i-driftstid'],
  ['hastighed', 'i-fart'],
  ['ip_klasse', 'i-ip'],
];

/** EU-blokken. L32 (24. aug 2026) fjernede eu_tilgaengelig, eu_service og
 *  leveringstid fra skemaet — CE er den eneste EU-oplysning skemaet stadig
 *  baerer. Listen har ét element tilbage, ikke fire; den lever videre som en
 *  liste og ikke en streng, saa euBlok() nedenfor ikke skal vide, at den er
 *  skrumpet. */
const EU_FELTER = ['ce_oplyst'];

/**
 * Streng, der SKAL findes. i18n kan vaere en Proxy, der selv kaster, eller et
 * almindeligt objekt, der returnerer undefined. Uden det her ville en manglende
 * oversaettelse lande i HTML som "undefined" — og en pladsholder, der ligner
 * indhold, overlever til lancering. Det er sket paa nabosiden.
 */
export function T(i18n, noegle) {
  const v = i18n?.[noegle];
  if (v === undefined || v === null || v === '') {
    throw new Error(`skabelon/robot.mjs: i18n-noeglen "${noegle}" mangler`);
  }
  return String(v);
}

/**
 * Streng, hvis noegle kommer fra DATA (land_Kina, anvendelse_industri, …).
 * Her maa et nyt land eller en syvende anvendelseskategori ikke standse hele
 * kataloget; den raa vaerdi vises, og bygget kan sige det hoejt. Samme linje som
 * build.mjs' `land()`. Faste UI-strenge gaar ALDRIG gennem den her.
 */
export function TD(i18n, noegle, reserve) {
  try {
    const v = i18n?.[noegle];
    return (v === undefined || v === null || v === '') ? reserve : String(v);
  } catch { return reserve; }
}

/** "{a} af {b} oplyst" -> "4 af 5 oplyst". Tal formateres af kalderen. */
export function flet(streng, felter) {
  return String(streng).replace(/\{(\w+)\}/g, (m, n) => (n in felter ? String(felter[n]) : m));
}

/** Samme indstillinger som build.mjs' tal(): sproget bestemmer decimaltegnet. */
export function lokaltTal(n, sprog) {
  return new Intl.NumberFormat(sprog === 'da' ? 'da-DK' : 'en-GB',
    { maximumFractionDigits: 3 }).format(n);
}

/** Vaert uden www. Kilden skal kunne genkendes uden at hele URL'en staar. */
export function vaert(url) {
  try { return new URL(String(url)).hostname.replace(/^www\./, ''); }
  catch { return String(url); }
}

/**
 * Butiks-URL'er. CLAUDE.md begraensning 1: siden maa aldrig kunne laeses som
 * salgskanal. unitree-b2 henter et felt fra shop.unitree.com, og naar kilderne
 * bliver klikbare (K1's fix), staar der pludselig et link til en webshop paa
 * siden. Kilden bliver staaende og kan citeres — den er bare ikke et link.
 */
export function erButik(url) {
  const v = vaert(url);
  return /^(shop|store|butik|buy)\./i.test(v) || /\/(shop|store|cart|checkout)(\/|$)/i.test(String(url));
}

/**
 * Stier. ctx.url's form er ikke i kontrakten, saa den proeves i tre former, og
 * ellers bruges en relativ reserve. Reserven afhaenger af, hvilken side der
 * spoerger: begge sider ligger tre mapper nede (/<sprog>/robotter/<slug>/ og
 * /<sprog>/producenter/<slug>/), men de peger ikke samme sted hen.
 */
export function sti(ctx, art, id) {
  const u = ctx?.url;
  try {
    if (typeof u === 'function') { const s = u(art, id); if (s) return s; }
    if (u && typeof u[art] === 'function') { const s = u[art](id); if (s) return s; }
    if (u && typeof u[art] === 'string') return u[art];
  } catch { /* falder igennem til reserven */ }
  const fra = ctx?.__fra ?? 'robot';
  const katalog = fra === 'producent' ? '../../robotter/' : '../';
  const robot = (s) => (fra === 'producent' ? `../../robotter/${s}/` : `../${s}/`);
  const producent = (s) => (fra === 'producent' ? `../${s}/` : `../../producenter/${s}/`);
  if (art === 'katalog') return katalog;
  if (art === 'forside') return '../../';
  if (art === 'producenter') return fra === 'producent' ? '../' : '../../producenter/';
  if (art === 'producent') return producent(id);
  if (art === 'robot') return robot(id);
  if (art === 'metode') return '../../metode/';
  return '../';
}

/** Hjaelperne skal vaere der. Fejler de, skal det fejle HER med et navn paa,
 *  ikke som en TypeError midt i en HTML-streng. */
export function kraevHjaelp(H) {
  for (const n of ['tal', 'tilstand', 'kildemaerke', 'kilder', 'anvendelse']) {
    if (typeof H?.[n] !== 'function') {
      throw new Error(`skabelon/robot.mjs: hjaelp.${n} mangler eller er ikke en funktion`);
    }
  }
}

/* --------------------------------------------------------- én feltvaerdi */

/**
 * Forbeholdet haenger paa vaerdien, ikke ved siden af den. Driftstid er det
 * eneste felt i praksis, der baerer ved_last — og driftstid er ét af stribens
 * fem tal, saa forbeholdet maa ikke kunne falde ud.
 *
 * Haevet TEGN, ikke det fulde ord "Advarsel" (fund/FUND-detalje.md, opgave
 * 4a): denne funktion fodrer robot.mjs' EGEN feltKrop()/stribe() OG, via
 * `vaerdi()`, producent.mjs' minikort (`kompaktStribe()` kalder `vaerdi()`
 * herfra) - de arver derfor rettelsen uden selv at aendres. Samme sprog og
 * samme klasse (.forbehold--tegn) som side.mjs' fnote(), som 24. aug 2026
 * allerede loeste noejagtig det samme problem paa kataloget: 174 af 181
 * altid-synlige "Advarsel"-chips paa 41 af 46 kort. Ordet forsvinder ikke -
 * det staar stadig fuldt ud i title (museklik) og .kunskaerm (skaermlaeser).
 */
function forbehold(post, ctx) {
  if (post?.ved_last === undefined) return '';
  const { i18n, sprog } = ctx;
  const ukendt = typeof post.ved_last === 'string' || tilstandAf(post.ved_last?.vaerdi);
  const tekst = ukendt
    ? T(i18n, 'ved_last_ukendt')
    : `${T(i18n, 'ved_last')} ${lokaltTal(post.ved_last.vaerdi, sprog)} ${post.ved_last.enhed ?? ''}`.trim();
  return `<abbr class="forbehold forbehold--tegn" title="${esc(tekst)}">`
    + `<span aria-hidden="true">*</span>`
    + `<span class="kunskaerm">${esc(T(i18n, 'advarsel'))}: ${esc(tekst)}</span></abbr>`;
}

/**
 * Advarslen staar VED SIDEN AF vaerdien (regel 9), ikke i en fodnote.
 * Spot: laengden er 1100 mm, og produktsiden skriver 110mm. Egenvaegten er
 * 33,8 kg paa produktsiden og 32,7 kg i databladet. Begge tal staar i
 * advarselsteksten med hver sin URL — teksten gengives ordret og uden link,
 * saa producentens egen formulering ikke bliver til vores.
 */
export function advarselBlok(post, ctx) {
  if (!post?.advarsel) return '';
  return `<p class="advarsel"><b class="advarsel-navn">${esc(T(ctx.i18n, 'advarsel'))}</b>` +
    `<span>${esc(post.advarsel)}</span></p>`;
}

function noteBlok(post) {
  return post?.note ? `<p class="feltnote">${esc(post.note)}</p>` : '';
}

/**
 * Varianterne ved navn. 37 felter i kataloget baerer en varianter:-blok, og
 * Go2's fire varianter er fire maskiner. Vaerdien ovenfor er ÉN af dem; her
 * staar de alle, saa laeseren kan se, hvilken kolonne tallet kommer fra.
 */
export function varianter(post, ctx) {
  if (!post?.varianter) return '';
  const { i18n, sprog } = ctx;
  const somTekst = (x) => {
    if (typeof x === 'number') return lokaltTal(x, sprog);
    if (typeof x === 'boolean') return x ? T(i18n, 'ja') : T(i18n, 'nej');
    if (typeof x === 'string' && tilstandAf(x)) return TD(i18n, 'tilstand_' + tilstandAf(x), x);
    return String(x);
  };
  const raekker = Object.entries(post.varianter)
    .map(([n, x]) => `<div class="variant"><dt>${esc(n)}</dt><dd>${esc(somTekst(x))}</dd></div>`)
    .join('');
  return `<dl class="varianter"><div class="variant variant--navn"><dt>${esc(T(i18n, 'varianter'))}</dt><dd></dd></div>${raekker}</dl>`;
}

/**
 * Selve vaerdien. Returnerer ogsaa `hul`, saa striben kan maerke cellen.
 * "nej" er IKKE et hul: producenten har svaret, og svaret fylder lige saa meget
 * som et tal. Kun "ikke oplyst" er et hul.
 */
export function vaerdi(navn, post, ctx, kilder) {
  const H = ctx.__H;
  const { i18n, sprog } = ctx;
  const spec = FELTER[navn];

  if (post === undefined) {
    return { html: H.tilstand('ikke_oplyst', i18n), hul: true, maerke: '' };
  }
  if (typeof post === 'string') {
    const t = tilstandAf(post) ?? 'ikke_oplyst';
    return { html: H.tilstand(t, i18n), hul: t === 'ikke_oplyst', maerke: '' };
  }

  let html;
  let hul = false;
  const t = tilstandAf(post.vaerdi);
  if (t) {
    // Tilstanden MED herkomst. Den ser ud som den bare tilstand — ellers ville
    // "ikke oplyst" have to udseender — men den baerer et kildemaerke.
    // Spots ce_oplyst er praecis den: vi HAR laest databladet og fandt intet.
    html = H.tilstand(t, i18n);
    hul = t === 'ikke_oplyst';
  } else if (spec?.art === 'jaNej') {
    html = H.tilstand(post.vaerdi ? 'ja' : 'nej', i18n);
  } else if (spec?.art === 'liste') {
    const v = Array.isArray(post.vaerdi) ? post.vaerdi : [post.vaerdi];
    html = `<span class="v v-liste">${v.map((x) => `<code>${esc(x)}</code>`).join(' ')}</span>`;
  } else if (typeof post.vaerdi === 'string' && spec?.art !== 'ip') {
    html = `<span class="v v-tekst">${esc(post.vaerdi)}</span>`;
    // Et tekstfelt kan baere et maalbart interval ved siden af producentens
    // ordlyd (Spots "ureguleret DC 35-58,8 V"). Det skal med.
    if (post.min !== undefined) {
      html += ` ${H.tal({ min: post.min, maks: post.maks, enhed: post.enhed }, sprog)}`;
    }
  } else {
    html = H.tal(post, sprog);
  }

  html += forbehold(post, ctx);
  const maerke = post.kilde ? (H.kildemaerke(post, kilder) || '') : '';
  return { html, hul, maerke };
}

/** Vaerdi + kildemaerke + advarsel + note + varianter, som de staar i en raekke. */
export function feltKrop(navn, post, ctx, kilder) {
  const { html, maerke } = vaerdi(navn, post, ctx, kilder);
  return `<div class="feltvaerdi">${html}${maerke}</div>` +
    advarselBlok(post, ctx) + noteBlok(post) + varianter(post, ctx);
}

/* -------------------------------------------------------------- billedet */

/**
 * Billedposten. `ctx.billede` er en OVERSKRIVNING, som producentsiden bruger,
 * naar den selv har slaaet et billede op; ellers laeses robottens eget felt.
 * Formen normaliseres af side.mjs, saa kortet og robotsiden ikke kan naa til
 * hver sin laesning af den samme YAML.
 */
function billedeAf(ctx) {
  if (ctx?.billede) return laesBillede({ billede: ctx.billede, navn: ctx?.robot?.navn });
  return laesBillede(ctx?.robot);
}

/**
 * Stien tilbage til dist/-roden. Bygget giver den i `ctx.url.op`; reserven er
 * '../../../', fordi en robotside ligger i /<sprog>/robotter/<slug>/. En
 * haandregnet '../../' er den slags fejl, der foerst ses i browseren.
 */
function opAf(ctx) {
  const op = ctx?.url?.op;
  return typeof op === 'string' && op ? op : '../../../';
}

/** Teksterne, billedmaskineriet i side.mjs skal bruge. Sproget hoerer hjemme her. */
function billedTekst(ctx, b) {
  const { i18n, robot } = ctx;
  const navn = robot?.navn ?? '';
  const alt = b?.alt
    ? b.alt
    : (b?.ophav === 'silhuet' ? flet(T(i18n, 'billede_alt_silhuet'), { model: navn }) : navn);
  return {
    intet: T(i18n, 'billede_intet'),
    grund: T(i18n, 'billede_ingen_egen'),
    delt: T(i18n, 'billede_delt'),
    delt_forklaring: T(i18n, 'billede_delt_forklaring'),
    alt,
    ophav: {
      eget_foto: T(i18n, 'billede_ophav_eget_foto'),
      silhuet: T(i18n, 'billede_ophav_silhuet'),
      fabrikant: T(i18n, 'billede_uden_tilladelse'),
    },
  };
}

export function billedled(ctx, { stor = false } = {}) {
  const b = billedeAf(ctx);
  const H = ctx?.hjaelp ?? hjaelp;
  // Intet rigtigt billede: gaa den FAELLES vej i side.mjs (hjaelp.billede),
  // som tegner MAALEPLADEN, naar robotten oplyser laengde og hoejde, og ellers
  // den tomme plade. Foer 24.08.2026 tegnede denne fil sin egen flade plade
  // udenom, saa kortet paa forsiden og robotsiden viste to forskellige ting
  // for den samme robot (flettecommit 347051a flagede det som fund).
  // ctx.billede-overskrivningen sendes med, saa producentsidens opslag stadig
  // vinder over robottens eget felt — ogsaa naar opslaget er ubrugeligt.
  if (!b && ctx?.robot && typeof H?.billede === 'function') {
    const emne = ctx.billede ? { ...ctx.robot, billede: ctx.billede } : ctx.robot;
    return H.billede(emne, opAf(ctx), { stor });
  }
  return billedledHTML({ b, op: opAf(ctx), stor, tekst: billedTekst(ctx, b) });
}

/** Billedets sandhed under billedet. Ingen pris, ingen knap. */
export function billedfod(ctx) {
  const b = billedeAf(ctx);
  const linjer = billedLinjer(b, billedTekst(ctx, b));
  if (!linjer.length) return '';
  return `<figcaption class="billedfod">` +
    linjer.map(([k, s]) => `<p><i class="${k}"></i>${esc(s)}</p>`).join('\n') +
    `</figcaption>`;
}

/* ------------------------------------------------------------- afsnittene */

/** Noegletalsstriben. Cellen bliver staaende, ogsaa naar den er tom. */
function stribe(ctx, kilder) {
  const { i18n, robot } = ctx;
  const celler = STRIBE_FELTER.map(([navn, ikon]) => {
    const post = robot.felter?.[navn];
    const { html, hul, maerke } = vaerdi(navn, post, ctx, kilder);
    return {
      navn, ikon, hul,
      html: `<li${hul ? ' class="hul"' : ''}><svg class="ikon" aria-hidden="true"><use href="#${ikon}"/></svg><span class="krop">
<span class="etiket">${esc(T(i18n, 'felt_' + navn))}</span>
<span class="feltvaerdi">${html}${maerke}</span></span></li>`,
    };
  });
  const oplyst = celler.filter((c) => !c.hul).length;
  const huller = celler.length - oplyst;

  const taeller = `<span class="stribe-taeller">` +
    `<b>${esc(flet(T(i18n, 'noegletal_taeller'), { a: oplyst, b: celler.length }))}</b>` +
    (huller
      ? ` <span class="mangler">· ${esc(huller === 1
        ? T(i18n, 'noegletal_hul_en')
        : flet(T(i18n, 'noegletal_hul_flere'), { n: huller }))}</span>`
      : '') + `</span>`;

  // Ved NUL oplyste tal ville fem huller vaere fem gange den samme oplysning.
  // Maalt: 5 af 46 robotter staar saadan (Weilan E300 er én af dem).
  const krop = oplyst === 0
    ? `<div class="stribe stribe--intet">
<svg class="ikon" aria-hidden="true"><use href="#i-hul"/></svg>
<div class="tekst"><p class="hoved">${esc(T(i18n, 'noegletal_intet'))}</p></div>
</div>`
    : `<ul class="stribe stribe--fem">\n${celler.map((c) => c.html).join('\n')}\n</ul>`;

  // Advarsler og varianter paa stribens felter staar UNDER striben: cellen er
  // for smal til dem, og de maa ikke forsvinde, fordi tallet stod i striben.
  //
  // Foldet bag <details> (fund/FUND-detalje.md, opgave 1): op til fem af
  // disse boxe kunne staa udfoldet paa én gang, hver en venstrestillet blok
  // med tom hoejrespalte ved siden af sig. Foldningen fjerner INGEN tekst —
  // hver advarsel og variant staar uafkortet i .stribe-under-krop, kun
  // standardtilstanden (lukket) er aendret. Selve noegletalsstriben ovenfor
  // og dens fire datatilstande er UROERT: kun de supplerende afvigelses-/
  // variantnoter foldes.
  const underFelter = STRIBE_FELTER
    .map(([navn]) => [navn, robot.felter?.[navn]])
    .filter(([, p]) => p && typeof p === 'object' && (p.advarsel || p.varianter));
  const under = underFelter.length
    ? `<details class="stribe-under-fold">
<summary>${esc(flet(T(i18n, 'noegletal_afvigelser'), { n: underFelter.length }))}</summary>
<div class="stribe-under-krop">
${underFelter.map(([navn, p]) => `<div class="stribe-under"><p class="etiket">${esc(T(i18n, 'felt_' + navn))}</p>` +
    advarselBlok(p, ctx) + varianter(p, ctx) + `</div>`).join('\n')}
</div>
</details>`
    : '';

  return `<section class="sektion" aria-labelledby="noegletal-h">
<div class="stribe-hylster">
<div class="stribe-hoved">
<h2 class="etiket etiket--blaek" id="noegletal-h">${esc(T(i18n, 'noegletal_titel'))}</h2>
${taeller}
</div>
${krop}
</div>
${under}
</section>`;
}

/**
 * EU-blokken. CE er taget ud af striben, fordi feltet er tomt paa 42 af 46 —
 * en fast celle, der er et hul 42 gange, laerer ingen noget. Her staar den i
 * sin egen sektion, hvor tomheden er en oplysning om producenten frem for et
 * hul hos os.
 *
 * L32 (24. aug 2026): de tre andre EU-felter (eu_tilgaengelig, eu_service,
 * leveringstid), CE tidligere stod sammen med her, er fjernet fra skemaet —
 * alle tre stod ikke_oplyst paa samtlige robotter. Blokken viser derfor kun
 * ét felt nu, men bevarer sin form (dl/raekke) frem for at blive skrevet om
 * til en enkelt saetning: modsat producentsidens EU-kolonne (mange modeller
 * paa én gang, se producent.mjs' euSaetning) er der her kun ét dyr og ét
 * felt, saa en tabelform vs. en saetningsform er ikke en forskel, en laeser
 * maerker.
 *
 * L25: der staar INTET om, at koeberen bliver importoer. Paastanden er droppet,
 * fordi der ikke findes en primaerkilde. Feltet hedder "CE oplyst", ikke
 * "har CE" — og forskellen er hele pointen.
 */
function euBlok(ctx, kilder) {
  const { i18n, robot } = ctx;
  const raekker = EU_FELTER.map((navn) => `<div class="raekke">
<dt>${esc(T(i18n, 'felt_' + navn))}</dt>
<dd>${feltKrop(navn, robot.felter?.[navn], ctx, kilder)}</dd>
</div>`).join('\n');

  return `<section class="sektion eu-blok" aria-labelledby="eu-h">
<div class="sektion-hoved">
<h2 class="t-h2" id="eu-h">${esc(T(i18n, 'eu_titel'))}</h2>
</div>
<div class="eu-krop">
<svg class="ikon eu-ikon" aria-hidden="true"><use href="#i-ce"/></svg>
<div>
<dl class="raekker">
${raekker}
</dl>
<p class="t-lille eu-forklaring">${esc(T(i18n, 'eu_forklaring'))}</p>
</div>
</div>
</section>`;
}

/**
 * Doeren ud. Det er DYBDEN: vi gengiver ikke hele databladet, og siden er ikke
 * en salgskanal. Derfor er formen `videre--stille` — den samme, "Om metoden"
 * bruger — og ikke en fyldt knap. Ingen koebsknap, ingen demo, ingen
 * prisforespoergsel; de former findes ikke i systemet.
 */
function produktside(ctx, kilder) {
  const { i18n, robot } = ctx;
  const valgt = vaelgProduktside(robot, kilder);
  const krop = valgt
    ? `<a class="videre videre--stille" href="${esc(valgt.url)}" rel="nofollow noopener external">` +
      `${esc(flet(T(i18n, 'produktside_link'), { model: robot.navn }))}` +
      `<svg class="ikon" aria-hidden="true"><use href="#i-pil"/></svg></a>
<p class="t-mikro produktside-url">${esc(valgt.url)}</p>`
    : `<p class="t-lille">${esc(T(i18n, 'produktside_ingen'))}</p>`;
  return `<section class="sektion produktside" aria-labelledby="produktside-h">
<div class="sektion-hoved"><h2 class="t-h2" id="produktside-h">${esc(T(i18n, 'produktside_titel'))}</h2></div>
<p class="t-broed maal">${esc(T(i18n, 'produktside_forklaring'))}</p>
${krop}
</section>`;
}

/**
 * Hvilken URL er "producentens egen produktside"? Den primaere kilde, flest
 * felter er laest paa. Spot: 17 felter fra produktsiden mod 6 fra databladet.
 * Sekundaere kilder (L21: datablade, manualer, JS-bundles) og butiks-URL'er
 * kan ikke vinde — et datablad er ikke en produktside, og en webshop maa ikke
 * blive sidens doer ud.
 */
function vaelgProduktside(robot, kilder) {
  const taelling = new Map();
  for (const post of Object.values(robot.felter ?? {})) {
    if (!post || typeof post !== 'object' || !post.kilde) continue;
    if (post.kildetype === 'sekundaer') continue;
    if (erButik(post.kilde)) continue;
    taelling.set(post.kilde, (taelling.get(post.kilde) ?? 0) + 1);
  }
  // Anvendelsens kilde er ofte producentens navigation — den taeller med som én.
  const a = robot.anvendelse;
  if (a && typeof a === 'object' && a.kilde && !erButik(a.kilde) && a.kildetype !== 'sekundaer') {
    taelling.set(a.kilde, (taelling.get(a.kilde) ?? 0) + 1);
  }
  let bedst = null;
  for (const [url, n] of taelling) if (!bedst || n > bedst.n) bedst = { url, n };
  if (bedst) return bedst;
  // Ingen primaer kilde: hellere ingen doer end en doer til en webshop.
  const rest = (kilder ?? []).find((k) => k.kildetype !== 'sekundaer' && !erButik(k.url));
  return rest ? { url: rest.url, n: 0 } : null;
}

/** Producentens egen inddeling, gengivet. Citatet staar ALTID sammen med
 *  kategorien — uden det kan en laeser ikke se forskel paa producentens hylde
 *  og vores vurdering, og saa var feltet blevet det, begraensning 6 forbyder. */
function anvendelseBlok(ctx) {
  const { i18n } = ctx;
  const a = ctx.__H.anvendelse(ctx.robot) ?? {};
  const vaerdier = Array.isArray(a.vaerdi) ? a.vaerdi : [a.vaerdi].filter(Boolean);
  const citater = Array.isArray(a.citat) ? a.citat : [a.citat].filter(Boolean);
  if (!vaerdier.length && !citater.length) return '';

  const citatDel = citater.length
    ? `<blockquote class="anvendelse-citat">
<p class="etiket">${esc(T(i18n, 'anvendelse_citat'))}</p>
${citater.map((c) => `<p>${esc(c)}</p>`).join('\n')}
</blockquote>`
    : '';
  const kildeDel = a.kilde
    ? `<p class="t-mikro">${esc(T(i18n, 'kilde'))}: ${esc(vaert(a.kilde))}` +
      (a.hentet ? ` · ${esc(T(i18n, 'hentet'))} <time datetime="${esc(a.hentet)}">${esc(a.hentet)}</time>` : '') +
      `</p>`
    : '';
  const noteDel = a.note ? `<p class="t-lille">${esc(a.note)}</p>` : '';

  // L23: en variant arver moderens kategori og VISER det, med moderens
  // rigtige NAVN og et rigtigt LINK — ikke den raa slug uden markering, som
  // den forrige udgave skrev (fund/FUND-detalje.md, opgave 4c: side.mjs'
  // hjaelp.anvendelse() returnerede tidligere slet ikke `arvet_fra`, saa
  // denne blok var altid tom, uanset data). Moderen slaas op i ctx.robotter
  // — bygget giver hele robotlisten med i ctx (samme "udvidelse ud over den
  // laaste kontrakt" som ctx.billede) — og R17 har allerede sikret paa
  // valideringstidspunktet, at arvet_fra peger paa en robot, der findes.
  let arvet = '';
  if (a.arvet_fra) {
    const alle = Array.isArray(ctx.robotter) ? ctx.robotter : [];
    const mor = alle.find((r) => r.slug === a.arvet_fra);
    const link = mor ? sti(ctx, 'robot', mor.slug) : null;
    const navn = mor ? mor.navn : a.arvet_fra;
    arvet = `<p class="anvendelse__arv">${esc(T(i18n, 'anvendelse_arvet_fra'))}` +
      (link ? `, <a href="${esc(link)}">${esc(navn)}</a>.` : ` ${esc(navn)}.`) +
      `</p>\n<p class="t-mikro anvendelse__note">${esc(T(i18n, 'anvendelse_arvet_forklaring'))}</p>`;
  }

  // Naar koblingen ER vores egen slutning (en arvet kategori), ville den
  // ALMINDELIGE forklaring ("Kategorien er ikke vores vurdering") lyve paa
  // netop denne side — anvendelse_forklaring_arvet siger det modsatte.
  const forklaringNoegle = a.arvet_fra ? 'anvendelse_forklaring_arvet' : 'anvendelse_forklaring';

  return `<section class="sektion anvendelse" aria-labelledby="anvendelse-h">
<div class="sektion-hoved"><h2 class="t-h2" id="anvendelse-h">${esc(T(i18n, 'anvendelse_titel'))}</h2></div>
${citatDel}
${arvet}
${kildeDel}
${noteDel}
<p class="t-lille maal">${esc(T(i18n, forklaringNoegle))}</p>
</section>`;
}

/** Anvendelsesmaerkerne i toppen. FLERVAERDI: en robot maa have flere, og
 *  Lynx M20 har fem. At vaelge den foerste ville vaere vores slutning (K4).
 *  `anvendelse__maerke--<vaerdi>` (opgave 4c): en BEM-modifikator pr.
 *  kategori, samme princip som side.mjs' egen anvendelse().maerker() nu
 *  bruger paa kortet — bevis paa at raekkefoelgen (hjaelp.anvendelse() sorterer
 *  nu via skema.mjs' sorterAnvendelse) er den samme paa tvaers af robotter med
 *  samme kategorisaet, ikke kun visuelt ens ved et tilfaelde. */
function anvendelseMaerker(ctx) {
  const { i18n } = ctx;
  const a = ctx.__H.anvendelse(ctx.robot) ?? {};
  const vaerdier = (Array.isArray(a.vaerdi) ? a.vaerdi : [a.vaerdi]).filter(Boolean);
  if (!vaerdier.length) return '';
  const punkter = vaerdier.map((v) => {
    const t = tilstandAf(v);
    if (t) {
      return `<li class="maerke maerke--tom anvendelse__maerke--${esc(t)}">${esc(TD(i18n, 'tilstand_' + t, v))}</li>`;
    }
    return `<li class="maerke anvendelse__maerke--${esc(v)}">${esc(TD(i18n, 'anvendelse_' + v, v))}</li>`;
  }).join('');
  return `<ul class="maerker">${punkter}</ul>`;
}

/** Det fulde skema, sammenklappet. Tilgaengeligt uden JavaScript: <details>
 *  er browserens egen. Taelleren i sammenklapningen siger, hvad der er indeni. */
function skema(ctx, kilder) {
  const { i18n, robot } = ctx;
  const udfyldt = FELTNAVNE.filter((n) => {
    const p = robot.felter?.[n];
    if (p === undefined) return false;
    if (typeof p === 'string') return tilstandAf(p) === null;
    return tilstandAf(p.vaerdi) === null;
  }).length;

  const grupper = GRUPPER.map((g) => {
    const navne = FELTNAVNE.filter((n) => FELTER[n].gruppe === g);
    if (!navne.length) return '';
    const raekker = navne.map((navn) => `<div class="raekke">
<dt>${esc(T(i18n, 'felt_' + navn))}</dt>
<dd>${feltKrop(navn, robot.felter?.[navn], ctx, kilder)}</dd>
</div>`).join('\n');
    return `<section class="skema-gruppe">
<h3 class="t-h3">${esc(T(i18n, 'gruppe_' + g))}</h3>
<dl class="raekker">
${raekker}
</dl>
</section>`;
  }).join('\n');

  return `<details class="skema">
<summary><span class="skema-titel">${esc(T(i18n, 'skema_titel'))}</span>
<span class="skema-taeller figur">${esc(flet(T(i18n, 'skema_taeller'), { a: udfyldt, b: FELTNAVNE.length }))}</span></summary>
<div class="skema-krop">
${grupper}
<p class="t-mikro">${esc(T(i18n, 'sammenlign_advarsel'))}</p>
</div>
</details>`;
}

/**
 * Kildelisten. Den er en liste over de FAKTISKE distinkte URL'er i posten —
 * aldrig én saetning, der lover én kilde. 16 af 46 poster har flere end én.
 * Listen er bygget af data, saa antallet af synlige URL'er er lig antallet i
 * YAML-filen af konstruktion, ikke af omhu (K1's acceptkriterium).
 */
function kildeliste(ctx, kilder) {
  const { i18n } = ctx;
  if (!kilder.length) {
    return `<section class="sektion kilder" id="kilder" aria-labelledby="kilder-h">
<div class="sektion-hoved"><h2 class="t-h2" id="kilder-h">${esc(T(i18n, 'kilder_titel'))}</h2></div>
<p class="t-lille">${esc(T(i18n, 'kilde_ingen'))}</p>
</section>`;
  }
  // Kun ÉN af URL'erne maa kaldes "producentens produktside" — den, vi ogsaa
  // sender laeseren hen til. De oevrige primaere kilder staar med deres adresse
  // og intet andet: vi ved, at de ligger paa producentens domaene, men ikke hvad
  // siden hedder, og et gaet ville vaere en paastand.
  const valgt = vaelgProduktside(ctx.robot, kilder)?.url ?? null;
  const punkter = kilder.map((k) => {
    const sek = k.kildetype === 'sekundaer';
    const url = String(k.url ?? '');
    const vist = url.replace(/^https?:\/\//, '');
    // Butiks-URL'er staar som tekst, ikke som link (begraensning 1).
    const adresse = erButik(url)
      ? `<span class="url">${esc(vist)}</span>`
      : `<a class="url" href="${esc(url)}" rel="nofollow noopener external">${esc(vist)}</a>`;
    const hvad = (!sek && url === valgt)
      ? `<span class="hvad">${esc(T(i18n, 'kilde_primaer'))}</span> ` : '';
    return `<li${sek ? ' class="sek"' : ''} id="kilde-${esc(k.bogstav)}">
<span class="bogstav">${esc(k.bogstav)}</span>
<span>${sek ? `<span class="type">${esc(T(i18n, 'kilde_sekundaer'))}:</span> ` : ''}${hvad}${adresse}` +
      (k.hentet ? ` <span class="dato">· ${esc(T(i18n, 'hentet'))} <time datetime="${esc(k.hentet)}">${esc(k.hentet)}</time></span>` : '') +
      `</span>
</li>`;
  }).join('\n');

  return `<section class="sektion kilder" id="kilder" aria-labelledby="kilder-h">
<div class="sektion-hoved"><h2 class="t-h2" id="kilder-h">${esc(T(i18n, 'kilder_titel'))}</h2></div>
<ul class="kildeliste">
${punkter}
</ul>
<p class="t-mikro maal">${esc(T(i18n, 'kilder_forklaring'))}</p>
</section>`;
}

function noterBlok(ctx) {
  const { i18n, robot } = ctx;
  if (!robot.noter) return '';
  const krop = Array.isArray(robot.noter)
    ? `<ul class="noter">${robot.noter.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>`
    : `<p class="t-broed maal">${esc(robot.noter)}</p>`;
  return `<section class="sektion noter-blok" aria-labelledby="noter-h">
<div class="sektion-hoved"><h2 class="t-h2" id="noter-h">${esc(T(i18n, 'noter'))}</h2></div>
${krop}
</section>`;
}

/* ------------------------------------------------------------------ toppen */

function top(ctx, kilder) {
  const { i18n, robot } = ctx;
  const producentNavn = robot.producent ?? ctx.producent?.navn ?? '';
  const producentSlug = ctx.producent?.slug ?? null;
  const producentDel = producentSlug
    ? `<a class="prod" href="${esc(sti(ctx, 'producent', producentSlug))}">${esc(producentNavn)}</a>`
    : `<span class="prod">${esc(producentNavn)}</span>`;

  const vk = ctx.__H.vaegtklasse ? ctx.__H.vaegtklasse(robot) : null;
  const vkNoegle = typeof vk === 'string' ? vk : vk?.noegle;
  // Vaegtklassen er kontekst, ikke en paastand. Mangler etiketten, staar der
  // ingenting — en tom <p> ville vaere et hul, ingen havde valgt.
  const vkTekst = vkNoegle ? TD(i18n, 'vaegtklasse_' + vkNoegle, '') : '';
  const vkDel = vkTekst ? `<p class="t-mikro vaegtklasse">${esc(vkTekst)}</p>` : '';

  const varianterDel = Array.isArray(robot.varianter) && robot.varianter.length
    ? `<p class="t-lille robot-varianter"><span class="etiket">${esc(T(i18n, 'varianter'))}</span>` +
      robot.varianter.map((v) => `<span class="variantnavn">${esc(v)}</span>`).join('') +
      `</p><p class="t-mikro maal">${esc(T(i18n, 'varianter_forklaring'))}</p>`
    : '';

  return `<header class="robot-top">
<figure class="robot-foto">
${billedled(ctx, { stor: true })}
${billedfod(ctx)}
</figure>
<div class="robot-navn">
<p class="kort-ophav">${producentDel}` +
    (robot.producentland ? `<span class="land">${esc(TD(i18n, 'land_' + robot.producentland, robot.producentland))}</span>` : '') +
    (robot.status ? `<span class="status status--${esc(robot.status)}">${esc(TD(i18n, 'status_' + robot.status, robot.status))}</span>` : '') +
    (robot.foerste_udgivelse ? `<span class="figur aar">${esc(String(robot.foerste_udgivelse))}</span>` : '') +
    `</p>
<h1 class="t-hero">${esc(robot.navn ?? '')}</h1>
${vkDel}
${anvendelseMaerker(ctx)}
${varianterDel}
${producentSlug ? `<p class="t-lille"><a href="${esc(sti(ctx, 'producent', producentSlug))}">${esc(flet(T(i18n, 'til_producent'), { producent: producentNavn }))}</a></p>` : ''}
</div>
</header>`;
}

/* ------------------------------------------------------------------ render */

export function render(ctx) {
  const H = ctx?.hjaelp ?? hjaelp;
  kraevHjaelp(H);
  const arbejde = { ...ctx, __H: H, __fra: 'robot' };
  const { i18n, robot } = arbejde;
  if (!robot) throw new Error('skabelon/robot.mjs: ctx.robot mangler');

  const kilder = H.kilder(robot) ?? [];

  return `<main class="side" id="hoved">
<div class="rum">
<p class="retur"><a href="${esc(sti(arbejde, 'katalog'))}">${esc(T(i18n, 'til_katalog'))}</a></p>

<article class="robotside">
${top(arbejde, kilder)}
${stribe(arbejde, kilder)}
${euBlok(arbejde, kilder)}
${produktside(arbejde, kilder)}
${anvendelseBlok(arbejde)}
${skema(arbejde, kilder)}
${noterBlok(arbejde)}
${kildeliste(arbejde, kilder)}
</article>
</div>
</main>
`;
}

export default { render, IKONER, STRIBE_FELTER };
