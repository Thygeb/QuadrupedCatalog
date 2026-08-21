/**
 * tools/skabelon/side.mjs — sideskallen og hjaelpefunktionerne.
 *
 * ============================ SKABELON-KONTRAKTEN ============================
 *
 *   // tools/skabelon/<navn>.mjs
 *   export function render(ctx) { ... returnerer HTML-strengen for <main> ... }
 *
 *   ctx = { robot | robotter, producent | producenter, i18n, sprog, url, hjaelp }
 *
 *   hjaelp = { tal, tilstand, kildemaerke, kilder, vaegtklasse, anvendelse }
 *
 * De seks navne ovenfor er kontrakten og aendres ikke. `hjaelp` baerer desuden
 * et par bekvemmeligheder (esc, felt, stribe, kort, eu, billede, ikon, land,
 * taethed, tegnforklaring), som skabelonerne maa bruge, men ikke skal.
 *
 *   ctx.i18n  T         opslag der FEJLER paa en manglende noegle (streng)
 *             t(n)      opslag med reserve (tools/skabelon/reserve-<sprog>.json)
 *             tf(n,o)   som t(), men saetter {n}-pladsholdere ind
 *   ctx.sprog 'da' | 'en'
 *   ctx.url   { dybde, sti, op }   sti er uden sprogpraefiks, fx 'robotter/'
 *
 * Skallen (<head>, baand, billednote, skip-link, hreflang, fod) skrives af
 * skal() her i filen. En skabelon skriver KUN indholdet af <main>.
 *
 * ============================================================================
 *
 * Designet kommer fra assets/system.css. Skabelonerne skriver klassenavnene
 * derfra; de opfinder ikke deres eget udseende. Alt hvad system.css ikke
 * daekker, staar i assets/generator.css - og kun det.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FELTER, SPROG, tilstandAf } from '../skema.mjs';

const her = path.dirname(fileURLToPath(import.meta.url));
export const ROD = path.resolve(her, '..', '..');

/* ------------------------------------------------------------------ tekst */

export const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const attr = esc;

/** Pladsholdere: "{n} af {m}" -> tal indsat. Ingen locale-magi her. */
function saetInd(tekst, vaerdier) {
  return String(tekst).replace(/\{(\w+)\}/g, (hel, n) => (n in vaerdier ? String(vaerdier[n]) : hel));
}

/* -------------------------------------------------------------- sprogfilen */

/** Noegler, der blev hentet fra reservefilen. Bygget skriver dem ud til sidst. */
export const brugteReserver = new Set();
/** Noegler, der hverken fandtes i sprogfilen eller i reserven. */
export const manglendeNoegler = new Set();

export function lavSprog(sprogkode) {
  const fil = path.join(ROD, 'data/i18n', `${sprogkode}.json`);
  if (!fs.existsSync(fil)) throw new Error(`Sprogfilen mangler: ${fil}`);
  const raa = JSON.parse(fs.readFileSync(fil, 'utf8'));

  const reserveFil = path.join(her, `reserve-${sprogkode}.json`);
  const reserve = fs.existsSync(reserveFil) ? JSON.parse(fs.readFileSync(reserveFil, 'utf8')) : {};

  // T fejler paa en manglende noegle. En manglende oversaettelse skal vaere
  // synlig, ikke lande som dansk paa /en/.
  const T = new Proxy(raa, {
    get(m, n) {
      if (typeof n !== 'string') return undefined;
      if (n === '__raa') return m;
      if (!(n in m)) throw new Error(`data/i18n/${sprogkode}.json mangler noeglen "${n}"`);
      return m[n];
    },
  });

  /** Opslag med reserve. Bruges KUN til noegler, der endnu ikke er flyttet
   *  til data/i18n/. Hver brug taelles og rapporteres af bygget. */
  function t(n) {
    if (n in raa) return raa[n];
    if (n in reserve) { brugteReserver.add(n); return reserve[n]; }
    manglendeNoegler.add(`${sprogkode}: ${n}`);
    return `«${n}»`;
  }
  const tf = (n, vaerdier) => saetInd(t(n), vaerdier);

  // ctx.i18n laeses paa to maader: som et opslagsobjekt (`i18n['advarsel']`,
  // som robot.mjs og producent.mjs bruger) og som en pose funktioner
  // (`i18n.T`, `i18n.t`, `i18n.tf`, som forside og katalog bruger). Begge er
  // rimelige laesninger af et ord som "i18n", og det er billigere at
  // understoette dem begge end at rette en fil, en anden agent ejer.
  //
  // Opslag paa en manglende noegle giver `undefined` HER (ikke en fejl), fordi
  // robot.mjs selv kaster med et navn paa. `i18n.T.foo` fejler stadig haardt.
  const ekstra = { T, t, tf, raa, sprogkode };
  return new Proxy(raa, {
    get(m, n) {
      if (typeof n !== 'string') return undefined;
      if (n in ekstra) return ekstra[n];
      if (n in m) return m[n];
      // Samme reserve som t(): et opslag, der gaar uden om t(), skal ikke
      // kunne faa et andet svar end t() ville give. Brugen taelles og
      // rapporteres, saa reserven ikke kan blive et stille andet sprogsted.
      if (n in reserve) { brugteReserver.add(n); return reserve[n]; }
      return undefined;
    },
    has(m, n) { return (typeof n === 'string' && (n in ekstra || n in reserve)) || n in m; },
  });
}

/* ------------------------------------------------------------------ ikoner */

/**
 * Ikonsaettet fra designsystemet, ét 24-net, én stregtykkelse. Sprite'en
 * skrives ind i hver side: <use href> til en anden fil er spaerret paa
 * file:// i flere browsere, og siden skal kunne aabnes lokalt.
 */
export const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
<symbol id="i-vaegt" viewBox="0 0 24 24"><path d="M9.4 8a2.6 2.6 0 0 1 5.2 0"/><path d="M7 8h10l1.9 11.4a1.4 1.4 0 0 1-1.4 1.6H6.5a1.4 1.4 0 0 1-1.4-1.6Z"/></symbol>
<symbol id="i-nyttelast" viewBox="0 0 24 24"><path d="M12 3v4.6"/><path d="M9.7 5.4 12 7.7l2.3-2.3"/><path d="M7.5 10.2h9v8.3h-9z"/><path d="M3.4 21h17.2"/></symbol>
<symbol id="i-driftstid" viewBox="0 0 24 24"><path d="M3.6 8.2h12.9a1.6 1.6 0 0 1 1.6 1.6v4.4a1.6 1.6 0 0 1-1.6 1.6H3.6A1.6 1.6 0 0 1 2 14.2V9.8a1.6 1.6 0 0 1 1.6-1.6Z"/><path d="M20.8 10.9v2.2"/><path d="M4.9 10.9h4.3v2.2H4.9z"/></symbol>
<symbol id="i-fart" viewBox="0 0 24 24"><path d="M3.6 17.4a8.8 8.8 0 1 1 16.8 0"/><path d="M12 17.4 16.4 10.6"/><circle cx="12" cy="17.4" r="1.35"/></symbol>
<symbol id="i-ip" viewBox="0 0 24 24"><path d="M12 2.7 5.6 5.3v6c0 4.1 2.7 7.3 6.4 8.4 3.7-1.1 6.4-4.3 6.4-8.4v-6Z"/><path d="M12 8.9c-1.4 1.8-2.2 2.9-2.2 4a2.2 2.2 0 0 0 4.4 0c0-1.1-.8-2.2-2.2-4Z"/></symbol>
<symbol id="i-ce" viewBox="0 0 24 24"><path d="M6 2.9h7.3L18 7.7v13.4H6z"/><path d="M13.3 2.9v4.8H18"/><path d="M9 13.1h6"/><path d="M9 16.5h4"/></symbol>
<symbol id="i-hul" viewBox="0 0 24 24"><path d="M4.4 4.4h15.2v15.2H4.4z" stroke-dasharray="3.2 3.2"/></symbol>
<symbol id="i-pil" viewBox="0 0 24 24"><path d="M4 12h15"/><path d="M13.4 6.4 19 12l-5.6 5.6"/></symbol>
</svg>`;

export const ikon = (navn, klasse = 'ikon') =>
  `<svg class="${attr(klasse)}" aria-hidden="true"><use href="#${attr(navn)}"/></svg>`;

/* ------------------------------------------------------------ vaegtklasser */

/**
 * L27: forsidens akse. Klasserne er AFLEDT I BYGGET og staar ikke i data -
 * ellers ville en graenseflytning kraeve 46 commits.
 *
 * Graenserne er L27's: 20 og 40 kg. Maalt over data/robots/ 21.08.2026:
 * 12 / 12 / 13 / 9.
 *
 * Inddelingen bruger PRODUCENTENS TAL, ikke vores fortolkning af operatoren.
 * DEEP Lynx S10 oplyses som "<= 20 kg" og staar derfor i 20-40 kg, fordi 20 er
 * det tal, producenten skriver. Operatoren staar synligt paa kortet, saa
 * laeseren kan se forskellen; havde vi flyttet robotten, ville vores slutning
 * vaere blevet usynlig.
 */
export const VAEGTKLASSER = ['under_20', '20_40', 'over_40', 'ikke_oplyst'];
export const VAEGTGRAENSER = { under: 20, over: 40 };

/** Egenvaegten i kg, eller null hvis den ikke er oplyst som et tal. */
function vaegtIKg(robot) {
  const p = robot?.felter?.egenvaegt;
  if (!p || typeof p === 'string') return null;
  if (tilstandAf(p.vaerdi)) return null;
  const v = p.min !== undefined ? (p.min + p.maks) / 2 : p.vaerdi;
  if (typeof v !== 'number' || Number.isNaN(v)) return null;
  if (p.enhed === 'kg') return v;
  if (p.enhed === 'g') return v / 1000;
  return null; // ukendt enhed taeller ikke som oplyst vaegt
}

export function vaegtklasse(robot) {
  const kg = vaegtIKg(robot);
  if (kg === null) return 'ikke_oplyst';
  if (kg < VAEGTGRAENSER.under) return 'under_20';
  if (kg <= VAEGTGRAENSER.over) return '20_40';
  return 'over_40';
}

/* ------------------------------------------------------------------ kilder */

/**
 * Kilderegistret for én robot.
 *
 * Kritikkens haardeste fund: prototypens ene saetning ("tallene er laest paa
 * producentens produktside") er USAND for 16 af 46 robotter, som henter tal fra
 * flere URL'er. Rettelsen er ikke en bedre saetning - det er at holde op med at
 * skrive saetningen. Kilden hoerer til TALLET.
 *
 * Registret giver hver unik URL et bogstav i den raekkefoelge, felterne staar i
 * skemaet, saa bogstavet er stabilt fra byg til byg.
 */
export function lavKilder(robot) {
  // Listen ER en Array. tools/skabelon/robot.mjs laeser den som en liste af
  // kildeposter, mens forside og katalog bruger .for(post) og .antal. Begge
  // laesninger er rigtige, og de skal ikke koste en anden datastruktur hver.
  const liste = [];
  const efterUrl = new Map();

  const tilfoej = (post, navn) => {
    if (!post || typeof post !== 'object' || !post.kilde) return;
    const url = String(post.kilde);
    let vaertsnavn = url;
    try { vaertsnavn = new URL(url).hostname.replace(/^www\./, ''); } catch { /* vises raa */ }
    if (efterUrl.has(url)) {
      const p = efterUrl.get(url);
      if (post.kildetype === 'sekundaer') { p.sekundaer = true; p.kildetype = 'sekundaer'; }
      if (navn) p.felter.push(navn);
      return;
    }
    const p = {
      url,
      vaert: vaertsnavn,
      hentet: post.hentet ?? null,
      kildetype: post.kildetype === 'sekundaer' ? 'sekundaer' : 'primaer',
      sekundaer: post.kildetype === 'sekundaer',
      felter: navn ? [navn] : [],
      bogstav: String.fromCharCode(65 + liste.length),
    };
    efterUrl.set(url, p);
    liste.push(p);
  };

  for (const navn of Object.keys(FELTER)) tilfoej(robot?.felter?.[navn], navn);
  tilfoej(robot?.anvendelse, 'anvendelse');

  /** Kildeposten for ét felt, eller null. */
  liste.for = (post) => {
    if (!post || typeof post !== 'object' || !post.kilde) return null;
    return efterUrl.get(String(post.kilde)) ?? null;
  };
  liste.liste = liste;
  liste.antal = liste.length;
  return liste;
}

/* ---------------------------------------------------------------- hjaelpen */

export function lavHjaelp({ sprogkode, T, t, tf }) {
  const locale = sprogkode === 'da' ? 'da-DK' : 'en-GB';
  const nf = new Intl.NumberFormat(locale, { maximumFractionDigits: 3 });
  const df = new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });

  const nformat = (n) => nf.format(n);
  const dformat = (iso) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? String(iso) : df.format(d);
  };

  /** Landenavne er tekst og hoerer til i sprogfilen, ikke i robottens YAML. */
  const manglendeLande = new Set();
  const land = (vaerdi) => {
    const n = 'land_' + vaerdi;
    if (n in T.__raa) return T.__raa[n];
    manglendeLande.add(`${sprogkode}: ${n}`);
    return vaerdi;
  };

  /* --- operatoren. Regel 4: den skal SES, og den skal kunne HOERES. --- */
  const OPNAVN = {
    '>': 'mereend', '>=': 'mindst', '<': 'mindreend', '<=': 'hoejst',
    '~': 'cirka', '±': 'pm',
  };
  function operator(op) {
    if (!op) return '';
    const n = OPNAVN[op];
    if (!n) return `<span class="op">${esc(op)}</span>`;
    return `<span class="op" aria-hidden="true">${esc(T['operator_' + n])}</span>`
      + `<span class="kunskaerm">${esc(T['operator_' + n + '_laest'])} </span>`;
  }

  /* --- 1. tal ------------------------------------------------------------ */

  /**
   * Selve tallet: operator, figur, enhed, interval, imperial og lastbetingelse.
   * Regel 5: et interval er ikke sit gennemsnit og saettes som et interval.
   */
  function tal(post, { kilder = null, maerke = true, hvorhen = '' } = {}) {
    const nul = post.vaerdi === 0;
    const figur = post.min !== undefined
      ? `${nformat(post.min)}–${nformat(post.maks)}`
      : (typeof post.vaerdi === 'number' ? nformat(post.vaerdi) : String(post.vaerdi));

    let ud = `<span class="v v-tal${nul ? ' v-nul' : ''}">`
      + operator(post.operator)
      + `<b class="num">${esc(figur)}</b>`
      + (post.enhed ? `<span class="enhed">${esc(post.enhed)}</span>` : '');

    // Regel 9: oplyser producenten baade metrisk og imperial, staar begge tal.
    // Vi omregner ikke og retter ikke - afvigelsen baeres af post.advarsel.
    if (post.vaerdi_imperial !== undefined) {
      const imp = `${nformat(post.vaerdi_imperial)} ${post.enhed_imperial ?? ''}`.trim();
      ud += `<abbr class="forbehold" title="${attr(t('imperial_forklaring'))}">${esc(imp)}</abbr>`;
    }
    if (post.ved_last !== undefined) {
      const ukendt = typeof post.ved_last === 'string' || tilstandAf(post.ved_last.vaerdi);
      ud += ukendt
        ? `<abbr class="forbehold" title="${attr(T.ved_last_ukendt)}">${esc(T.ved_last_ukendt)}</abbr>`
        : `<abbr class="forbehold" title="${attr(T.ved_last)} ${attr(nformat(post.ved_last.vaerdi))} `
          + `${attr(post.ved_last.enhed ?? '')}">${esc(T.ved_last)} ${esc(nformat(post.ved_last.vaerdi))} `
          + `${esc(post.ved_last.enhed ?? '')}</abbr>`;
    }
    if (maerke && kilder) ud += kildemaerke(post, kilder, hvorhen);
    ud += `</span>`;
    return ud;
  }

  /* --- 2. tilstand ------------------------------------------------------- */

  /**
   * De fire tilstande deler hverken skriftgrad, bogstavform, flade eller
   * maerke. "0" er ikke en tilstand - det er et tal og saettes af tal().
   */
  function tilstand(navn, { kilder = null, post = null, hvorhen = '' } = {}) {
    const k = tilstandAf(navn) ?? navn;
    let ud;
    // "ja" er ikke en tilstand i skemaet, men robotsiden kalder tilstand('ja')
    // for et ja/nej-felt. Den maa ikke lande som "ikke oplyst": et svar og et
    // hul er praecis de to, der aldrig maa kollapse.
    if (k === 'ja' || k === true) return jaNej(true, { kilder, post, hvorhen });
    if (k === 'nej') {
      ud = `<span class="v v-nej"><i class="mrk"></i>${esc(T.tilstand_nej)}`;
    } else if (k === 'kun_billede') {
      ud = `<span class="v v-billede"><i class="mrk"></i><span class="ord">${esc(T.tilstand_kun_billede)}</span>`;
    } else {
      ud = `<span class="v v-ikke"><i class="mrk"></i>${esc(T.tilstand_ikke_oplyst)}`;
    }
    if (kilder && post) ud += kildemaerke(post, kilder, hvorhen);
    return ud + `</span>`;
  }

  function jaNej(v, { kilder = null, post = null, hvorhen = '' } = {}) {
    if (v === false) return tilstand('nej', { kilder, post, hvorhen });
    let ud = `<span class="v v-ja"><i class="mrk"></i>${esc(T.ja)}`;
    if (kilder && post) ud += kildemaerke(post, kilder, hvorhen);
    return ud + `</span>`;
  }

  function tekstvaerdi(v, { kilder = null, post = null, hvorhen = '' } = {}) {
    let ud = `<span class="v v-tekst">${esc(v)}`;
    if (kilder && post) ud += kildemaerke(post, kilder, hvorhen);
    return ud + `</span>`;
  }

  /* --- 3. kildemaerket --------------------------------------------------- */

  /**
   * Det haevede bogstav efter en vaerdi. `kilder` er registret fra
   * hjaelp.kilder(robot). Uden register - eller uden kilde paa feltet - er der
   * intet at pege paa, og der skrives intet: et hul uden kilde er en anden
   * oplysning end et hul med.
   *
   * `hvorhen` peger paa kildelisten. Paa robotsiden er den paa samme side
   * (#kilde-A); paa et kort ligger den paa robottens egen side.
   */
  function kildemaerke(post, kilder, hvorhen = '') {
    if (!kilder) return '';
    const k = kilder.for(post);
    if (!k) return '';
    const sek = k.sekundaer ? ' kildemaerke--sek' : '';
    const titel = k.sekundaer ? t('kilde_sek_forklaring') : T.kilde_primaer;
    return `<a class="kildemaerke${sek}" href="${attr(hvorhen)}#kilde-${attr(k.bogstav)}"`
      + ` title="${attr(titel)}">${esc(k.bogstav)}</a>`;
  }

  /** Kildelisten. Per kilde, ikke per tal: en kilde har én hentedato. */
  function kildeliste(kilder) {
    if (!kilder.liste.length) return `<p class="t-mikro">${esc(T.kilde_ingen)}</p>`;
    const raekker = kilder.liste.map((k) => {
      let vaert = k.url;
      try { vaert = new URL(k.url).hostname.replace(/^www\./, '') + new URL(k.url).pathname; }
      catch { /* vises raa */ }
      return `<li${k.sekundaer ? ' class="sek"' : ''} id="kilde-${attr(k.bogstav)}">`
        + `<span class="bogstav">${esc(k.bogstav)}</span>`
        + `<span>${k.sekundaer ? `<span class="type">${esc(T.kilde_sekundaer)}:</span> ` : ''}`
        + `<span class="hvad">${esc(k.sekundaer ? t('kilde_sek_forklaring') : T.kilde_primaer)}</span> `
        + `<a class="url" href="${attr(k.url)}" rel="nofollow noopener external">${esc(vaert)}</a>`
        + (k.hentet
          ? ` <span class="dato">· ${esc(T.hentet)} <time datetime="${attr(k.hentet)}">${esc(dformat(k.hentet))}</time></span>`
          : '')
        + `</span></li>`;
    }).join('\n');
    return `<ul class="kildeliste">\n${raekker}\n</ul>`;
  }

  /* --- 4. ét felt -------------------------------------------------------- */

  /**
   * Vaerdien af ét felt, uanset art og form.
   *
   * `kunVaerdi` bruges i noegletalsstriben: en celle er 20-30 px hoej og kan
   * ikke baere en advarsel paa fire linjer. Advarslen forsvinder ikke - den
   * bliver til et forbeholdsmaerke med hele teksten i title, og den staar
   * uafkortet paa robotsiden. Uden det her ville et <p> desuden ligge inde i
   * et <span>, og det er ugyldig HTML, som ingen browser klager over.
   */
  function felt(navn, post, { kilder = null, hvorhen = '', kunVaerdi = false } = {}) {
    if (post === undefined) return tilstand('ikke_oplyst');
    if (typeof post === 'string') return tilstand(post);

    const spec = FELTER[navn];
    const t0 = tilstandAf(post.vaerdi);
    let ud;
    if (t0) ud = tilstand(t0, { kilder, post, hvorhen });
    else if (spec?.art === 'jaNej') ud = jaNej(post.vaerdi, { kilder, post, hvorhen });
    else if (spec?.art === 'liste') ud = tekstvaerdi(post.vaerdi.join(', '), { kilder, post, hvorhen });
    else if (typeof post.vaerdi === 'string') ud = tekstvaerdi(post.vaerdi, { kilder, post, hvorhen });
    else ud = tal(post, { kilder, hvorhen });

    if (kunVaerdi) {
      if (post.advarsel) {
        ud += `<abbr class="forbehold" title="${attr(post.advarsel)}">${esc(T.advarsel)}</abbr>`;
      }
      return ud;
    }
    if (post.advarsel) {
      ud += `<p class="advarsel"><span class="etiket">${esc(T.advarsel)}</span>${esc(post.advarsel)}</p>`;
    }
    if (post.note) ud += `<p class="feltnote">${esc(post.note)}</p>`;
    if (post.varianter) {
      const somTekst = (x) => (typeof x === 'number' ? nformat(x)
        : typeof x === 'boolean' ? (x ? T.ja : T.nej) : String(x));
      ud += `<dl class="varianter"><dt class="etiket">${esc(T.varianter)}</dt>`
        + Object.entries(post.varianter)
          .map(([n, x]) => `<dd><b>${esc(n)}</b> ${esc(somTekst(x))}</dd>`).join('')
        + `</dl>`;
    }
    return ud;
  }

  /* --- 5. anvendelse ----------------------------------------------------- */

  /**
   * Producentens EGEN inddeling. Flerværdi (L27): en robot maa vaere baade
   * industri og inspektion, og ingen af vaerdierne er "hovedkategorien" -
   * den regel blev trukket tilbage, fordi den lod en producents menuraekke-
   * foelge afgoere, hvor ti robotter havnede.
   */
  function anvendelse(robot) {
    const a = robot?.anvendelse;
    const raa = a === undefined ? { vaerdi: 'ikke_oplyst' } : (typeof a === 'string' ? { vaerdi: a } : a);
    const vaerdier = (Array.isArray(raa.vaerdi) ? raa.vaerdi : [raa.vaerdi])
      .map((v) => tilstandAf(v) ?? v);
    const citater = raa.citat === undefined ? []
      : (Array.isArray(raa.citat) ? raa.citat : [raa.citat]);
    return {
      vaerdier,
      citater,
      // Samme to lister under datafilens egne navne. robot.mjs laeser
      // {vaerdi, citat}; forside og katalog laeser {vaerdier, citater}. To
      // navne for én ting divergerer normalt - her er de bundet til den samme
      // konstant og kan derfor ikke.
      vaerdi: vaerdier,
      citat: citater,
      kilde: raa.kilde ?? null,
      hentet: raa.hentet ?? null,
      note: raa.note ?? null,
      erIkkeOplyst: vaerdier.length === 1 && vaerdier[0] === 'ikke_oplyst',
      navn: (v) => (v === 'ikke_oplyst' ? T.tilstand_ikke_oplyst : t('anvendelse_' + v)),
      /** Maerkerne som de staar paa kortet. */
      maerker() {
        return `<ul class="maerker">` + vaerdier.map((v) => (v === 'ikke_oplyst'
          ? `<li class="maerke maerke--tom">${esc(T.tilstand_ikke_oplyst)}</li>`
          : `<li class="maerke">${esc(t('anvendelse_' + v))}</li>`)).join('') + `</ul>`;
      },
    };
  }

  /* --- 6. noegletalsstriben ---------------------------------------------- */

  /**
   * AENDRET 21.08.2026: hastighed ind, CE ud.
   *
   * Maalt over alle 46 datafiler: ce_oplyst er oplyst paa 4, hastighed paa 36.
   * En celle, der er tom paa 42 af 46 kort, laerer laeseren at springe hele
   * striben over. CE staar i stedet i sin egen EU-markering, hvor "ikke
   * oplyst" er selve pointen frem for et hul.
   */
  const STRIBE = [
    ['egenvaegt', 'i-vaegt'],
    ['nyttelast_gaaende', 'i-nyttelast'],
    ['driftstid', 'i-driftstid'],
    ['hastighed', 'i-fart'],
    ['ip_klasse', 'i-ip'],
  ];

  /** Er feltet oplyst med et rigtigt svar (tal, tekst, ja eller nej)? */
  function erOplyst(post) {
    if (post === undefined) return false;
    if (typeof post === 'string') return tilstandAf(post) === 'nej';
    const t0 = tilstandAf(post.vaerdi);
    if (t0) return t0 === 'nej';
    return true;
  }

  function stribe(robot, { kompakt = false, kilder = null, hvorhen = '' } = {}) {
    const felter = STRIBE.map(([navn, ikonnavn]) => ({
      navn, ikonnavn, post: robot.felter?.[navn], oplyst: erOplyst(robot.felter?.[navn]),
    }));
    const oplyst = felter.filter((f) => f.oplyst).length;
    const huller = felter.length - oplyst;

    const hoved = `<div class="stribe-hoved">`
      + `<span class="etiket">${esc(T.noegletal_titel)}</span>`
      + `<span class="stribe-taeller"><b>${esc(saetInd(T.noegletal_taeller, { a: oplyst, b: felter.length }))}</b>`
      + (huller ? ` <span class="mangler">· ${esc(huller === 1 ? T.noegletal_hul_en
        : saetInd(T.noegletal_hul_flere, { n: huller }))}</span>` : '')
      + `</span></div>`;

    // Nul oplyste tal: fem huller ville vaere fem gange den samme oplysning.
    if (oplyst === 0) {
      return `<div class="stribe-hylster">${hoved}
<div class="stribe stribe--intet">${ikon('i-hul')}
<div class="tekst"><p class="hoved">${esc(tf('noegletal_intet_alle', { b: felter.length }))}</p>
<p>${esc(t('noegletal_intet_grund'))}</p></div></div></div>`;
    }

    const celler = felter.map((f) => {
      const etiket = kompakt ? t('stribe_' + f.navn) : T['felt_' + f.navn];
      const vaerdi = felt(f.navn, f.post, { kilder, hvorhen, kunVaerdi: true });
      return `<li${f.oplyst ? '' : ' class="hul"'}>${ikon(f.ikonnavn)}<span class="krop">`
        + `<span class="etiket">${esc(etiket)}</span>${vaerdi}</span></li>`;
    }).join('\n');

    const klasse = kompakt ? 'stribe stribe--kompakt panel--ro' : 'stribe';
    if (kompakt) return `<ul class="${klasse}">\n${celler}\n</ul>`;
    return `<div class="stribe-hylster">${hoved}\n<ul class="${klasse}">\n${celler}\n</ul></div>`;
  }

  /* --- 7. EU-markeringen -------------------------------------------------- */

  /**
   * CE ud af striben, ind i sin egen markering. Maalt: 2 robotter oplyser CE,
   * 2 oplyser at der ikke er CE, og 42 siger intet. Som tom celle i en stribe
   * var tavsheden et hul; her er den et udsagn.
   */
  function eu(robot) {
    const ce = robot.felter?.ce_oplyst;
    const t0 = ce === undefined ? 'ikke_oplyst'
      : (typeof ce === 'string' ? (tilstandAf(ce) ?? 'ikke_oplyst') : tilstandAf(ce.vaerdi));
    let tekst; let klasse;
    if (t0) { tekst = t0 === 'nej' ? t('eu_ce_nej') : t('eu_ce_ikke_oplyst'); klasse = t0 === 'nej' ? 'nej' : 'ikke'; }
    else if (ce.vaerdi === true) { tekst = t('eu_ce_ja'); klasse = 'ja'; }
    else { tekst = t('eu_ce_nej'); klasse = 'nej'; }
    return `<p class="eu eu--${klasse}">${ikon('i-ce', 'ikon ikon--lille')}`
      + `<span class="etiket">${esc(t('eu_titel'))}</span>`
      + `<span class="eu-svar">${esc(tekst)}</span></p>`;
  }

  /** ja / nej / ikke_oplyst for CE - bruges af filtrene. */
  function ceTilstand(robot) {
    const ce = robot.felter?.ce_oplyst;
    if (ce === undefined) return 'ikke_oplyst';
    if (typeof ce === 'string') return tilstandAf(ce) ?? 'ikke_oplyst';
    const t0 = tilstandAf(ce.vaerdi);
    if (t0) return t0 === 'nej' ? 'nej' : 'ikke_oplyst';
    return ce.vaerdi === true ? 'ja' : 'nej';
  }

  /* --- 8. billedet ------------------------------------------------------- */

  /**
   * BILLEDVALGET, truffet 21.08.2026.
   *
   * `media/` maa aldrig indgaa i et byg (CLAUDE.md, mappestruktur). Kritikken
   * fandt, at prototypen laeste 42 billeder direkte derfra. Vi kopierer dem
   * ikke til dist/ heller: en kopi ville flytte spaerringen fra en strukturel
   * regel til en huskeregel, og LÆSMIG.md i media/_kilder dokumenterer, at en
   * pladsholder overlevede til lancering paa nabosiden.
   *
   * Derfor: billeder kommer KUN fra assets/. Findes der intet, staar den tomme
   * plade fra designsystemet med en grund skrevet ud. Maalt 21.08.2026:
   * 0 filer i assets/fotos/ og 0 i assets/silhuetter/ - alle 46 kort viser
   * den tomme plade, og det er den aerlige tilstand.
   */
  const BILLEDMAPPER = [
    ['assets/fotos', ['.jpg', '.jpeg', '.png', '.webp', '.avif'], 'fotos'],
    ['assets/silhuetter', ['.svg'], 'silhuetter'],
  ];
  const billedIndeks = new Map();
  for (const [mappe, endelser, slags] of BILLEDMAPPER) {
    const fuld = path.join(ROD, mappe);
    if (!fs.existsSync(fuld)) continue;
    for (const f of fs.readdirSync(fuld)) {
      const e = path.extname(f).toLowerCase();
      if (!endelser.includes(e)) continue;
      const slug = path.basename(f, path.extname(f));
      if (!billedIndeks.has(slug)) billedIndeks.set(slug, { fil: `${slags}/${f}`, slags });
    }
  }

  function billede(robot, op = '') {
    const b = billedIndeks.get(robot.slug);
    if (!b) {
      return `<div class="billedled"><div class="intetfoto">`
        + `<span class="plade" aria-hidden="true"></span>`
        + `<p class="hoved">${esc(T.billede_intet)}</p>`
        + `<p class="grund">${esc(t('billede_ingen_egen'))}</p></div></div>`;
    }
    const plade = b.slags === 'silhuetter' ? ' billedled--plade' : '';
    return `<div class="billedled${plade}"><img src="${attr(op)}billeder/${attr(b.fil)}"`
      + ` alt="${attr(robot.navn)}" loading="lazy" decoding="async"></div>`;
  }
  /** Filerne, bygget skal kopiere til dist/billeder/. Kun fra assets/. */
  billede.indeks = billedIndeks;

  /* --- 9. robotkortet ---------------------------------------------------- */

  /**
   * Kortet har ingen doer ud af sitet: ingen pris, ingen knap, ingen stjerner
   * og ingen "featured". Navnet staar UNDER billedet, ikke paa det.
   */
  /**
   * op  = stien tilbage til dist/ (til billeder og aktiver)
   * til = stien til robotmapperne fra den side, kortet staar paa
   */
  function kort(robot, { op = '', til = '', kilder = null } = {}) {
    const k = kilder ?? lavKilder(robot);
    const hvorhen = `${til}${robot.slug}/`;
    const a = anvendelse(robot);
    const antalKilder = k.antal;
    const kildelinje = antalKilder === 0 ? t('kort_kilder_ingen')
      : antalKilder === 1 ? t('kort_kilder_en')
        : tf('kort_kilder_flere', { n: antalKilder });

    // Designsystemets regel: bogstaverne staar paa kortet KUN naar posten har
    // mere end én kilde. Kortets fodnote taeller altid kilderne, saa et kort
    // uden bogstaver skyldes en optalt kilde, ikke tavshed.
    const stribeKilder = antalKilder > 1 ? k : null;

    return `<article class="kort">
${billede(robot, op)}
<div class="kort-krop">
<div class="kort-hoved">
<p class="kort-ophav"><span class="prod">${esc(robot.producent)}</span>`
      + `<span class="land">${esc(land(robot.producentland))}</span>`
      + `<span class="status status--${attr(robot.status)}">${esc(T['status_' + robot.status])}</span></p>
<h3 class="kort-navn"><a href="${attr(hvorhen)}">${esc(robot.navn)}</a></h3>
</div>
${stribe(robot, { kompakt: true, kilder: stribeKilder, hvorhen })}
${a.maerker()}
${eu(robot)}
</div>
<div class="kort-fod">
<p><i class="prik prik--klip"></i>${esc(T.billede_intet)}. ${esc(t('billede_ingen_egen'))}</p>
<p><i class="prik"></i>${esc(kildelinje)}</p>
</div>
</article>`;
  }

  /* --- 10. tegnforklaringen ---------------------------------------------- */

  /**
   * De fire tilstande og de to kildemaerker, sat op ved siden af hinanden.
   * Staar paa katalogsiden, fordi det er der, de foerste gang moedes.
   */
  function tegnforklaring() {
    const raekke = (v, tekst) => `<div class="raekke"><dt>${v}</dt><dd>${esc(tekst)}</dd></div>`;
    return `<section class="sektion tegnforklaring" aria-labelledby="tegn">
<div class="sektion-hoved"><h2 class="t-h2" id="tegn">${esc(t('tegnforklaring_titel'))}</h2></div>
<dl class="raekker">
${raekke(`<span class="v v-tal"><b class="num">33,8</b><span class="enhed">kg</span></span>`, T.taethed_udfyldte)}
${raekke(`<span class="v v-tal v-nul"><b class="num">0</b></span>`, T.tilstand_nul_forklaring)}
${raekke(tilstand('nej'), T.tilstand_nej_forklaring)}
${raekke(tilstand('ikke_oplyst'), T.tilstand_ikke_oplyst_forklaring)}
${raekke(tilstand('kun_billede'), T.tilstand_kun_billede_forklaring)}
${raekke(`<span class="v v-tal"><b class="num">14</b><span class="enhed">kg</span><a class="kildemaerke" href="#tegn">A</a></span>`, t('kilde_maerke_forklaring'))}
${raekke(`<span class="v v-tal"><b class="num">1100</b><span class="enhed">mm</span><a class="kildemaerke kildemaerke--sek" href="#tegn">B</a></span>`, t('kilde_sek_forklaring'))}
</dl>
<p class="t-lille">${esc(T.sammenlign_advarsel)}</p>
</section>`;
  }

  return {
    // --- kontrakten ---
    tal, tilstand, kildemaerke, kilder: lavKilder, vaegtklasse, anvendelse,
    // --- bekvemmeligheder ---
    esc, attr, ikon, land, felt, jaNej, tekstvaerdi, kildeliste, stribe, eu,
    ceTilstand, billede, kort, tegnforklaring, nformat, dformat, operator,
    saetInd, manglendeLande, STRIBE_FELTER: STRIBE.map(([n]) => n), VAEGTKLASSER,
  };
}

/**
 * Modulets egen hjaelp, paa dansk.
 *
 * Bygget giver altid `ctx.hjaelp`, som er bundet til sidens sprog, og det er
 * den, skabelonerne skal bruge. Denne eksport findes, fordi
 * `import { skal, hjaelp } from './side.mjs'` staar i robot.mjs og
 * producent.mjs som reserve (`ctx?.hjaelp ?? hjaelp`) - uden den kan de to
 * moduler ikke indlaeses. Den er doven, saa sprogfilen foerst laeses, hvis
 * nogen faktisk rammer reserven.
 */
let _hjaelpDa = null;
export const hjaelp = new Proxy({}, {
  get(_, n) {
    if (typeof n !== 'string') return undefined;
    if (!_hjaelpDa) {
      const s = lavSprog('da');
      _hjaelpDa = lavHjaelp({ sprogkode: 'da', T: s.T, t: s.t, tf: s.tf });
    }
    return _hjaelpDa[n];
  },
  has(_, n) { return typeof n === 'string'; },
});

/* ------------------------------------------------------------------ skallen */

/**
 * Sideskallen. Alt uden for <main>: <head>, hreflang, skip-link, baandet
 * oeverst, billednoten (spaerring S1) og sidefoden.
 */
export function skal({
  sprogkode, T, t, titel, beskrivelse, sti, main, aktiv,
  script = false, stil = '', harProducenter = false,
}) {
  const dybde = 1 + (sti ? sti.split('/').filter(Boolean).length : 0);
  const op = '../'.repeat(dybde);
  const andet = sprogkode === 'da' ? 'en' : 'da';
  const alternativer = SPROG.map((s) => ({ sprog: s, href: `${op}${s}/${sti}` }));
  const nav = [
    ['', T.nav_forside],
    ['robotter/', T.nav_katalog],
  ];
  if (harProducenter) nav.push(['producenter/', t('nav_producenter')]);

  // Kontrakten siger "HTML-streng for <main>". De to laesninger - indholdet AF
  // main, og main-elementet selv - findes begge i praksis (robot.mjs og
  // producent.mjs skriver elementet med). To indlejrede <main> med samme
  // id="hoved" ville bryde skip-linket TAVST, saa skallen laeser efter.
  const kropp = /^\s*<main[\s>]/.test(main) ? main : `<main id="hoved">\n${main}\n</main>`;

  return `<!doctype html>
<html lang="${attr(sprogkode)}" dir="${attr(T.retning)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titel)}</title>
<meta name="description" content="${attr(beskrivelse)}">
<meta name="robots" content="noindex">
${alternativer.map((a) => `<link rel="alternate" hreflang="${attr(a.sprog)}" href="${attr(a.href)}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${attr(alternativer[0].href)}">
<link rel="stylesheet" href="${op}system.css">
<link rel="stylesheet" href="${op}generator.css">
${stil ? `<style>\n${stil}\n</style>` : ''}
</head>
<body>
<a class="spring" href="#hoved">${esc(t('spring_til_indhold'))}</a>
${SPRITE}
<header class="baand">
<div class="rum">
<div class="baand-navn">
<span class="titel">${esc(T.sted_navn)}</span>
<span class="midlertidig">${esc(t('sted_navn_midlertidig'))}</span>
</div>
<nav aria-label="${attr(T.nav_katalog)}">
${nav.map(([href, tekst]) => `<a href="${attr(op + sprogkode + '/' + href)}"`
    + `${aktiv === href ? ' aria-current="page"' : ''}>${esc(tekst)}</a>`).join('\n')}
<a href="${attr(`${op}${andet}/${sti}`)}" hreflang="${attr(andet)}" lang="${attr(andet)}">${esc(T.andet_sprog)}</a>
</nav>
</div>
</header>
<aside class="billednote">
<div class="rum">
<span class="maerke">${esc(t('billednote_maerke'))}</span>
<p>${esc(t('billednote_tekst'))}</p>
</div>
</aside>
${kropp}
<footer class="fod">
<div class="rum">
<p class="haard">${esc(T.ingen_forhandler)}</p>
<p>${esc(T.taethed_forklaring)}</p>
<p>${esc(T.udgiver)} · <a href="${attr(`${op}${andet}/${sti}`)}" hreflang="${attr(andet)}" lang="${attr(andet)}">${esc(T.andet_sprog)}</a></p>
</div>
</footer>
${script ? `<script src="${op}katalog.js" defer></script>` : ''}
</body>
</html>
`;
}
