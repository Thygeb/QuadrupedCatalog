/**
 * tools/enheder.mjs — projektets enheds- og operatorordforraad. Nul afhaengigheder.
 *
 * Udskilt fra tools/yaml.mjs (spor/opdel, 4. sep 2026): filen hed yaml.mjs, men 13
 * af dens 15 eksporter var aldrig YAML — det var ENHEDER, OPERATORER og de andre
 * navne herunder. Aa178's aabne punkt (b) kraevede opdelingen, fordi PLAN.md's
 * fase 3 saa "yaml.mjs slettes", og en sletning ville have braekket
 * tools/skabelon/side.mjs og tools/skema.mjs, som begge overlever fase 3.
 *
 * Kroppen af hver funktion er flyttet ORDRET fra tools/yaml.mjs — ingen logik er
 * aendret. Deler ingenting med parseren i tools/yaml.mjs: de to moduler har intet
 * indbyrdes afhaengighedsforhold.
 */

/* ==========================================================================
   Normalisering — de to maalte parser-faelder
   --------------------------------------------------------------------------
   FAELDE A: producenter saetter U+00A0 (og slaegtninge) mellem tal og enhed.
   FAELDE B: operatorer ankommer entitetskodede ("&gt;") eller som fuldbredde-
             glyffer ("＞"). Begge aeder operatoren tavst uden dette trin.
   ========================================================================== */

const ENTITETER = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  times: '×', deg: '°', plusmn: '±', le: '≤', ge: '≥',
  asymp: '≈', ne: '≠', ndash: '–', mdash: '—',
  hellip: '…', middot: '·', micro: 'µ', sup2: '²', sup3: '³',
};

export function afkodEntiteter(s) {
  let ud = s;
  for (let runde = 0; runde < 2; runde++) {
    const foer = ud;
    ud = ud.replace(/&(#[xX][0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g, (hele, g) => {
      if (g[0] === '#') {
        const kp = (g[1] === 'x' || g[1] === 'X')
          ? parseInt(g.slice(2), 16)
          : parseInt(g.slice(1), 10);
        return Number.isFinite(kp) && kp > 0 && kp <= 0x10FFFF ? String.fromCodePoint(kp) : hele;
      }
      return Object.prototype.hasOwnProperty.call(ENTITETER, g) ? ENTITETER[g] : hele;
    });
    if (ud === foer) break;
  }
  return ud;
}

// Skrevet som escapes med vilje: literale usynlige tegn i kildekoden kan ikke
// laeses i en diff, og det er praecis den slags, der forsvinder ved en kopiering.
const MELLEMRUM_KLASSE = '[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]';
const NULBREDDE_KLASSE = '[\u200B\u200C\u200D\u2060\uFEFF]';
const MELLEMRUM_RE = new RegExp(MELLEMRUM_KLASSE, 'g');
const NULBREDDE_RE = new RegExp(NULBREDDE_KLASSE, 'g');
const MELLEMRUM_TEST = new RegExp(MELLEMRUM_KLASSE);

const GLYFFER = [
  ['＞', '>'], ['＜', '<'], ['＝', '='],
  ['≥', '>='], ['≧', '>='], ['⩾', '>='],
  ['≤', '<='], ['≦', '<='], ['⩽', '<='],
  ['≈', '~'], ['～', '~'], ['〜', '~'], ['∼', '~'],
  ['−', '-'], ['–', '-'], ['—', '-'],
  ['℃', '°C'], ['℉', '°F'],
  ['，', ','], ['（', '('], ['）', ')'], ['：', ':'],
];

export function normaliser(s) {
  if (typeof s !== 'string') return s;
  let ud = afkodEntiteter(s);
  ud = ud.replace(NULBREDDE_RE, '').replace(MELLEMRUM_RE, ' ');
  for (const [fra, til] of GLYFFER) ud = ud.split(fra).join(til);
  return ud.replace(/\s+/g, ' ').trim();
}

/** Rapporterer hvilke faelder en raastreng indeholder — til fejlbeskeder. */
export function faelderI(s) {
  const f = [];
  if (/&(#[xX][0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/.test(s)) f.push('HTML-entitet');
  if (MELLEMRUM_TEST.test(s)) f.push('U+00A0 eller anden ikke-ASCII-blank');
  for (const [fra] of GLYFFER) if (s.includes(fra)) { f.push(`glyffen ${JSON.stringify(fra)}`); break; }
  return f;
}

/* ==========================================================================
   Talstreng-parser
   ========================================================================== */

export const OPERATORER = ['>=', '<=', '>', '<', '~', '±'];

/** Ord, der er en operator uanset sammenhaeng. */
export const ORD_OPERATOR = [
  [/\bgreater than\b|\bmore than\b|\bat least\b|\bno less than\b/i, '>'],
  [/\bless than\b|\bno more than\b|\bup to\b/i, '<='],
  [/\babout\b|\bapprox(?:\.|imately)?\b|\bca\.\b|\baround\b|\bnearly\b/i, '~'],
];
/** Ord, der KAN vaere en etikette ("Max Speed") og derfor kun giver advarsel. */
export const ORD_MAASKE = [/\bmax(?:imum|imal)?\b/i, /\bmin(?:imum)?\b/i];

const ENHED_ALIAS = {
  mins: 'min', mns: 'min', minutes: 'min', minute: 'min',
  hrs: 'h', hr: 'h', hours: 'h', hour: 'h', timer: 't', time: 't',
  secs: 's', sec: 's', seconds: 's',
  lbs: 'lb', pounds: 'lb', pound: 'lb', kgs: 'kg',
  inches: 'in', inch: 'in', feet: 'ft', foot: 'ft', miles: 'mi', mile: 'mi',
  'n.m': 'Nm', nm: 'Nm',
  kmh: 'km/h', kph: 'km/h', 'km/t': 'km/h',
  degrees: '°', deg: '°', grader: '°', grad: '°',
  procent: '%', percent: '%', pct: '%',
  watt: 'W', watts: 'W', volt: 'V', volts: 'V', lumens: 'lm', lumen: 'lm',
};

/**
 * Aliasser, der KUN gaelder inden for én dimension.
 * "C" er Celsius i et temperaturfelt — men "C" er coulomb i SI, og "F" er farad.
 * Et globalt alias ville derfor lade en coulomb passere som en temperatur. Tabellen
 * slaas op paa feltets dimension, saa "C" uden for et temperaturfelt stadig er en
 * ukendt enhed og stadig fejler paa R5.
 */
const ENHED_ALIAS_TYPE = {
  temperatur: { c: '°C', celsius: '°C', degc: '°C', f: '°F', fahrenheit: '°F', degf: '°F' },
};

/** Fyldes naar ENHEDER er defineret nedenfor. Producenter skriver "Kg", "WH", "Mins". */
const KASSE_UAFHAENGIG = new Map();

export function kanoniskEnhed(e, type) {
  if (!e) return e;
  const lav = String(e).toLowerCase();
  const iType = type && ENHED_ALIAS_TYPE[type];
  if (iType && Object.prototype.hasOwnProperty.call(iType, lav)) return iType[lav];
  if (Object.prototype.hasOwnProperty.call(ENHED_ALIAS, lav)) return ENHED_ALIAS[lav];
  if (KASSE_UAFHAENGIG.has(lav)) return KASSE_UAFHAENGIG.get(lav);
  return e;
}

/**
 * Finder alle tal i en (normaliseret) streng med operator og enhed.
 * En "~" MELLEM to tal er en intervalseparator, ikke en operator — uden den
 * skelnen laeses "20~25cm" og "~60kg" ens.
 */
export function findTal(normaliseret) {
  const s = normaliseret;
  const RE = /(-?\d+(?:\.\d+)?)\s*([A-Za-z°µΩ%]+(?:\/[A-Za-z]+)?)?/g;
  const ud = [];
  let m;
  while ((m = RE.exec(s)) !== null) {
    const start = m.index;
    let i = start - 1;
    while (i >= 0 && s[i] === ' ') i--;
    let op = null, opSlut = i;
    if (i >= 0) {
      const to = s.slice(Math.max(0, i - 1), i + 1);
      if (to === '>=' || to === '<=') { op = to; opSlut = i - 2; }
      else if ('><~±-'.includes(s[i])) { op = s[i]; opSlut = i - 1; }
    }
    let separator = false;
    if (op === '~' || op === '-') {
      let j = opSlut;
      while (j >= 0 && s[j] === ' ') j--;
      if (j >= 0 && /\d/.test(s[j])) separator = true; // "20~25cm" -> interval
    }
    if (op === '-' && !separator) op = null; // et minus foran et tal er et fortegn
    ud.push({
      tal: Number(m[1]),
      enhed: kanoniskEnhed(m[2]),
      operator: separator ? null : op,
      separator,
      indeks: start,
    });
  }
  // Enhed arves fremad i "20~25cm" og "1098x450x645mm".
  for (let k = ud.length - 1; k >= 0; k--) {
    if (!ud[k].enhed && ud[k + 1] && ud[k + 1].enhed) ud[k].enhedArvet = ud[k + 1].enhed;
  }
  return ud;
}

/* ==========================================================================
   Enheder
   ========================================================================== */

/** enhed -> [type, faktor til typens basisenhed] */
export const ENHEDER = {
  kg: ['masse', 1], g: ['masse', 0.001], ton: ['masse', 1000],
  lb: ['masse', 0.45359237], oz: ['masse', 0.028349523125],

  mm: ['laengde', 0.001], cm: ['laengde', 0.01], m: ['laengde', 1], km: ['laengde', 1000],
  in: ['laengde', 0.0254], ft: ['laengde', 0.3048], mi: ['laengde', 1609.344], yd: ['laengde', 0.9144],

  'm/s': ['hastighed', 1], 'km/h': ['hastighed', 1 / 3.6], mph: ['hastighed', 0.44704],
  'ft/s': ['hastighed', 0.3048],

  '°': ['vinkel', 1],

  // Haeldning oplyses af nogle producenter i PROCENT (stigningsforhold), ikke i
  // grader. 45 % er 24,2°, saa de to tal maa aldrig ligge i samme kolonne. De er
  // derfor to forskellige dimensioner, og enhederne kan ikke omregnes til hinanden
  // af tilBasis. Feltet accepterer begge, og siden viser producentens egen enhed.
  '%': ['stigning', 1],

  s: ['tid', 1], min: ['tid', 60], h: ['tid', 3600], t: ['tid', 3600], ms: ['tid', 0.001],

  Wh: ['energi', 1], kWh: ['energi', 1000], J: ['energi', 1 / 3600],
  Ah: ['ladning', 1], mAh: ['ladning', 0.001],
  V: ['spaending', 1], mV: ['spaending', 0.001], kV: ['spaending', 1000],
  W: ['effekt', 1], kW: ['effekt', 1000],

  '°C': ['temperatur', 1], '°F': ['temperatur', 1], K: ['temperatur', 1],

  Nm: ['moment', 1],
  Hz: ['frekvens', 1], kHz: ['frekvens', 1000], MHz: ['frekvens', 1e6], GHz: ['frekvens', 1e9],
  lm: ['lysstroem', 1], lux: ['belysning', 1], dB: ['lyd', 1],

  stk: ['antal', 1], DoF: ['antal', 1],

  USD: ['valuta', 1], EUR: ['valuta', 1], DKK: ['valuta', 1], GBP: ['valuta', 1],
  CNY: ['valuta', 1], JPY: ['valuta', 1], CHF: ['valuta', 1],
};

/** Enheder pr. type — bruges i fejlbeskeden, saa den siger hvad der VAR gyldigt. */
export const TYPE_ENHEDER = {};
for (const [e, [t]] of Object.entries(ENHEDER)) (TYPE_ENHEDER[t] ||= []).push(e);

// Kasse-uafhaengigt opslag. En kollision ville goere "Kg" tvetydigt og skal derfor
// fejle hoejlydt ved indlaesning, ikke tavst ved en maaling.
for (const e of Object.keys(ENHEDER)) {
  const lav = e.toLowerCase();
  if (KASSE_UAFHAENGIG.has(lav) && KASSE_UAFHAENGIG.get(lav) !== e) {
    throw new Error(`Enhedstabellen har to enheder, der kun adskilles af store/smaa bogstaver: ` +
      `"${KASSE_UAFHAENGIG.get(lav)}" og "${e}"`);
  }
  KASSE_UAFHAENGIG.set(lav, e);
}

export const IMPERIALE = new Set(['lb', 'oz', 'in', 'ft', 'mi', 'yd', 'mph', 'ft/s', '°F']);

export function tilBasis(vaerdi, enhed) {
  const e = ENHEDER[enhed];
  if (!e) return null;
  if (e[0] === 'temperatur') {
    if (enhed === '°C') return vaerdi;
    if (enhed === '°F') return (vaerdi - 32) * 5 / 9;
    return vaerdi - 273.15;
  }
  return vaerdi * e[1];
}

/** Antal decimaler i et trykt tal — bestemmer hvor meget afrunding kan forklare. */
export function decimaler(n) {
  const s = String(n);
  const i = s.indexOf('.');
  return i === -1 ? 0 : s.length - i - 1;
}
