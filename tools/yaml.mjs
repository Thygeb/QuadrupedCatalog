/**
 * tools/yaml.mjs — YAML-delmaengde-laeser + normalisering. Nul afhaengigheder.
 *
 * Delt af validate.mjs og build.mjs, saa de to ikke kan divergere paa, hvad en
 * datafil betyder. En tredje kopi af parseren ville vaere den fjerde regel, ingen
 * har besluttet at aendre.
 *
 * Parseren er reddet fra den stoppede agents tools/validate.mjs (D9-udkastet);
 * normaliseringen ligeledes. Resten af det udkast er kasseret, fordi det validerede
 * et andet skema end det, dataagenten skriver efter lige nu.
 *
 * Understoettet: kort, blok-sekvenser, flow-kort {a: 1}, flow-lister [a, b],
 * citerede og bare skalarer, kommentarer, true/false/null.
 * Bevidst IKKE understoettet: tabulatorindrykning, blokskalarer (| og >), ankre,
 * tags, YAML 1.1-booleans (yes/no/on/off). Alt det fejler med linjenummer.
 */

export class YamlFejl extends Error {}

function fjernKommentar(linje) {
  let ud = '';
  let citat = null;
  for (let i = 0; i < linje.length; i++) {
    const c = linje[i];
    if (citat) {
      ud += c;
      if (c === citat && linje[i - 1] !== '\\') citat = null;
      continue;
    }
    if (c === '"' || c === "'") { citat = c; ud += c; continue; }
    if (c === '#' && (i === 0 || /\s/.test(linje[i - 1]))) break;
    ud += c;
  }
  return ud.replace(/\s+$/, '');
}

const NOEGLE_RE = /^([A-Za-z_][A-Za-z0-9_.-]*)\s*:(?:\s+([\s\S]*))?$/;
const YAML11_BOOL = /^(y|Y|yes|Yes|YES|n|N|no|No|NO|on|On|ON|off|Off|OFF)$/;

export function parseYaml(src, fil = '<streng>') {
  const raekker = [];
  const linjer = src.replace(/^\uFEFF/, '').split(/\r?\n/);
  for (let i = 0; i < linjer.length; i++) {
    const nr = i + 1;
    const linje = linjer[i];
    if (/^\s*\t/.test(linje)) {
      throw new YamlFejl(`${fil}:${nr}: tabulator i indrykningen — brug to mellemrum pr. niveau`);
    }
    const uden = fjernKommentar(linje);
    if (!uden.trim()) continue;
    if (uden.trim() === '---' || uden.trim() === '...') continue;
    const indryk = uden.match(/^ */)[0].length;
    if (indryk % 2 !== 0) {
      throw new YamlFejl(`${fil}:${nr}: indrykning er ${indryk} mellemrum — skal vaere et lige antal`);
    }
    raekker.push({ nr, indryk, txt: uden.trim() });
  }

  let pos = 0;
  const erSekvens = (r) => r.txt === '-' || r.txt.startsWith('- ');

  function laesBlok(indryk) {
    if (pos >= raekker.length) return null;
    return erSekvens(raekker[pos]) ? laesSekvens(indryk) : laesKort(indryk);
  }

  function laesSekvens(indryk) {
    const ud = [];
    while (pos < raekker.length && raekker[pos].indryk === indryk && erSekvens(raekker[pos])) {
      const r = raekker[pos];
      const rest = r.txt === '-' ? '' : r.txt.slice(2).trim();
      if (rest === '') {
        pos++;
        if (pos < raekker.length && raekker[pos].indryk > indryk) ud.push(laesBlok(raekker[pos].indryk));
        else ud.push(null);
      } else if (NOEGLE_RE.test(rest) && !rest.startsWith('{') && !rest.startsWith('[')) {
        raekker[pos] = { nr: r.nr, indryk: indryk + 2, txt: rest };
        ud.push(laesKort(indryk + 2));
      } else {
        pos++;
        ud.push(laesSkalar(rest, r.nr, fil));
      }
    }
    return ud;
  }

  function laesKort(indryk) {
    const ud = {};
    while (pos < raekker.length && raekker[pos].indryk === indryk && !erSekvens(raekker[pos])) {
      const r = raekker[pos];
      const m = r.txt.match(NOEGLE_RE);
      if (!m) throw new YamlFejl(`${fil}:${r.nr}: forventede "noegle: vaerdi", fik: ${r.txt}`);
      const noegle = m[1];
      const rest = (m[2] ?? '').trim();
      if (Object.prototype.hasOwnProperty.call(ud, noegle)) {
        throw new YamlFejl(`${fil}:${r.nr}: noeglen "${noegle}" staar to gange i samme kort`);
      }
      pos++;
      const blok = rest.match(/^([|>])([+-]?)\s*$/);
      if (blok) {
        ud[noegle] = laesBlokskalar(blok, r.nr, indryk);
      } else if (rest !== '') {
        ud[noegle] = laesSkalar(rest, r.nr, fil);
      } else if (pos < raekker.length && raekker[pos].indryk > indryk) {
        ud[noegle] = laesBlok(raekker[pos].indryk);
      } else {
        ud[noegle] = null;
      }
    }
    return ud;
  }

  /**
   * Blokskalarer: "|" beholder linjeskift, ">" folder dem til mellemrum.
   * Laeses fra de RAA linjer, ikke fra de forbehandlede raekker — ellers ville
   * en "#" inde i teksten blive spist som en kommentar.
   * Lange "advarsel:"- og "noter:"-tekster skrives naturligt paa den maade, saa
   * uden dette ville en dataagents post fejle paa formatering frem for indhold.
   */
  function laesBlokskalar(m, nr, foraeldreIndryk) {
    const stil = m[1], chomp = m[2];
    const raa = [];
    let i = nr;                       // nr er 1-baseret: linjerne[nr] er linjen EFTER noeglen
    while (i < linjer.length) {
      const l = linjer[i];
      if (l.trim() === '') { raa.push(''); i++; continue; }
      if (l.match(/^ */)[0].length <= foraeldreIndryk) break;
      raa.push(l); i++;
    }
    while (raa.length && raa[raa.length - 1] === '') raa.pop();
    const sidsteNr = nr + raa.length;
    while (pos < raekker.length && raekker[pos].nr <= sidsteNr) pos++;
    if (!raa.length) return '';

    const mindst = Math.min(...raa.filter((l) => l.trim() !== '').map((l) => l.match(/^ */)[0].length));
    const ind = raa.map((l) => l.slice(mindst).replace(/\s+$/, ''));

    let tekst;
    if (stil === '|') {
      tekst = ind.join('\n');
    } else {
      tekst = '';
      for (const l of ind) {
        if (l === '') { tekst += '\n'; continue; }
        if (tekst !== '' && !tekst.endsWith('\n')) tekst += ' ';
        tekst += l;
      }
    }
    if (chomp === '-') return tekst.replace(/\n+$/, '');
    if (chomp === '+') return tekst.endsWith('\n') ? tekst : tekst + '\n';
    return tekst.replace(/\n+$/, '') + '\n';
  }

  if (!raekker.length) return {};
  const rod = laesBlok(raekker[0].indryk);
  if (pos < raekker.length) {
    throw new YamlFejl(`${fil}:${raekker[pos].nr}: uventet indrykning — linjen hoerer ikke til nogen blok`);
  }
  return rod;
}

function laesSkalar(s, nr, fil) {
  if (s.startsWith('{')) return laesFlow(s, nr, fil, '}');
  if (s.startsWith('[')) return laesFlow(s, nr, fil, ']');
  if (s.length >= 2 && s.startsWith('"') && s.endsWith('"')) {
    try { return JSON.parse(s); } catch { return s.slice(1, -1); }
  }
  if (s.length >= 2 && s.startsWith("'") && s.endsWith("'")) return s.slice(1, -1).replace(/''/g, "'");
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (s === 'null' || s === '~') return null;
  if (YAML11_BOOL.test(s)) {
    throw new YamlFejl(
      `${fil}:${nr}: "${s}" er en YAML 1.1-boolean og laeses forskelligt af forskellige parsere. ` +
      `Skriv true/false — eller skriv tilstanden ud: ikke_oplyst | nej | kun_billede`);
  }
  if (/^-?\d+$/.test(s)) return Number(s);
  if (/^-?\d+\.\d+$/.test(s)) return Number(s);
  return s;
}

function laesFlow(s, nr, fil, luk) {
  if (!s.endsWith(luk)) throw new YamlFejl(`${fil}:${nr}: flow-vaerdi mangler "${luk}": ${s}`);
  const indre = s.slice(1, -1).trim();
  if (indre === '') return luk === '}' ? {} : [];
  const dele = [];
  let dybde = 0, citat = null, buf = '';
  for (let i = 0; i < indre.length; i++) {
    const c = indre[i];
    if (citat) { buf += c; if (c === citat) citat = null; continue; }
    if (c === '"' || c === "'") { citat = c; buf += c; continue; }
    if (c === '{' || c === '[') dybde++;
    if (c === '}' || c === ']') dybde--;
    if (c === ',' && dybde === 0) { dele.push(buf.trim()); buf = ''; continue; }
    buf += c;
  }
  dele.push(buf.trim());
  if (luk === ']') return dele.filter((d) => d !== '').map((d) => laesSkalar(d, nr, fil));
  const ud = {};
  for (const d of dele) {
    if (d === '') continue;
    const m = d.match(/^([A-Za-z_][A-Za-z0-9_.-]*)\s*:\s*([\s\S]*)$/);
    if (!m) throw new YamlFejl(`${fil}:${nr}: flow-kort forventede "noegle: vaerdi", fik: ${d}`);
    if (Object.prototype.hasOwnProperty.call(ud, m[1])) {
      throw new YamlFejl(`${fil}:${nr}: noeglen "${m[1]}" staar to gange i flow-kortet`);
    }
    ud[m[1]] = laesSkalar(m[2].trim(), nr, fil);
  }
  return ud;
}

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
  kmh: 'km/h', kph: 'km/h',
  degrees: '°', deg: '°',
  watt: 'W', watts: 'W', volt: 'V', volts: 'V', lumens: 'lm', lumen: 'lm',
};

/** Fyldes naar ENHEDER er defineret nedenfor. Producenter skriver "Kg", "WH", "Mins". */
const KASSE_UAFHAENGIG = new Map();

export function kanoniskEnhed(e) {
  if (!e) return e;
  const lav = String(e).toLowerCase();
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
