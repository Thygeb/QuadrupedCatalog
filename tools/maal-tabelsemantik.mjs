/**
 * tools/maal-tabelsemantik.mjs — maaler tabelsemantikken i /sammenligning/.
 *
 * HVORFOR ET EGET MAALEAPPARAT: sammenligningstabellen tegnes KLIENTSIDE
 * (assets/sammenligning.js' `tabelHTML()`), og staar derfor slet ikke i
 * `dist/da/sammenligning/index.html`. Et `grep` paa den byggede fil giver
 * 0 for `<table>`, uanset om semantikken er rigtig eller ravruskende gal -
 * et kriterium, der giver samme tal uanset input, maaler ingenting.
 * Maalingen skal derfor ligge paa FUNKTIONENS OUTPUT.
 *
 * Vejen dertil: byg siden, parsé den, koer den RIGTIGE sammenligning.js i en
 * `vm` mod en minimal DOM-shim, og laes `[data-saml-resultat]`s innerHTML -
 * det ER `tabelHTML()`s output, ord for ord.
 *
 * Shimmen og minparseren er de samme som `tests/dele/11-sammenligning.mjs`
 * allerede bruger til soegefeltet (samme graenser: ingen generel
 * HTML-parser, kun det velformede markup, build.mjs selv skriver). De staar
 * HER frem for i testen, saa `tests/dele/29-tabelsemantik.mjs` kan importere
 * dem: ét maaleapparat, to kaldere, ingen risiko for at maalingen og testen
 * skrider fra hinanden. 11-sammenligning.mjs er UROERT (den ejes ikke af
 * dette spor) og baerer derfor stadig sin egen kopi.
 *
 * Ingen afhaengigheder - samme loefte som resten af generatoren.
 *
 * Brug:
 *   node tools/maal-tabelsemantik.mjs                 (bygger til dist-tabelsemantik/)
 *   node tools/maal-tabelsemantik.mjs --dist=dist     (maaler et byg, der findes)
 *   node tools/maal-tabelsemantik.mjs --sprog=en
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';

export const ROD = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');

/* ---------------------------------------------------------------------------
   Minimal DOM: kun det, assets/sammenligning.js faktisk roerer.
--------------------------------------------------------------------------- */

export class El {
  constructor(tag) {
    this.tagName = tag;
    this._attrs = new Map();
    this.children = [];
    this.parent = null;
    this._listeners = {};
    this._text = '';
    this._html = '';
    this._value = undefined;
    this._checked = undefined;
  }
  setAttribute(k, v) { this._attrs.set(k, v === undefined ? '' : String(v)); }
  getAttribute(k) { return this._attrs.has(k) ? this._attrs.get(k) : null; }
  removeAttribute(k) { this._attrs.delete(k); }
  hasAttribute(k) { return this._attrs.has(k); }
  get id() { return this.getAttribute('id') || ''; }
  get lang() { return this.getAttribute('lang') || ''; }
  get hidden() { return this.hasAttribute('hidden'); }
  set hidden(v) { if (v) this.setAttribute('hidden', ''); else this.removeAttribute('hidden'); }
  get value() { return this._value !== undefined ? this._value : (this.getAttribute('value') || ''); }
  set value(v) { this._value = v; }
  get checked() { return this._checked !== undefined ? this._checked : this.hasAttribute('checked'); }
  set checked(v) { this._checked = !!v; }
  get textContent() { return this._text; }
  set textContent(v) { this._text = String(v); this.children = []; }
  get innerHTML() { return this._html; }
  set innerHTML(v) { this._html = v; this.children = []; }
  addEventListener(type, fn) { (this._listeners[type] = this._listeners[type] || []).push(fn); }
  dispatchEvent(type) { (this._listeners[type] || []).forEach((fn) => fn.call(this)); }
  appendChild(c) { c.parent = this; this.children.push(c); return c; }
  querySelectorAll(sel) { return queryAll(this, sel); }
  querySelector(sel) { return queryAll(this, sel)[0] || null; }
}

function selectorDele(sel) {
  return sel.match(/(^[a-zA-Z][\w-]*)|(#[\w-]+)|(\.[\w-]+)|(\[[^\]]+\])/g) || [];
}
function delMatcher(el, del) {
  if (del[0] === '#') return el.getAttribute('id') === del.slice(1);
  if (del[0] === '.') return (el.getAttribute('class') || '').split(/\s+/).includes(del.slice(1));
  if (del[0] === '[') {
    const inder = del.slice(1, -1);
    const eq = inder.indexOf('=');
    if (eq === -1) return el.hasAttribute(inder);
    const noegle = inder.slice(0, eq);
    const vaerdi = inder.slice(eq + 1).replace(/^["']|["']$/g, '');
    return el.getAttribute(noegle) === vaerdi;
  }
  return el.tagName === del;
}
export function matcher(el, sel) {
  return selectorDele(sel).every((d) => delMatcher(el, d));
}
export function queryAll(rodEl, sel) {
  const ud = [];
  (function gaa(node) {
    for (const c of node.children) {
      if (matcher(c, sel)) ud.push(c);
      gaa(c);
    }
  })(rodEl);
  return ud;
}

const TOMME_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'source', 'track', 'wbr']);
const RAATEKST_TAGS = new Set(['script', 'style']);

function afkodEntitet(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}

/** Formaalsbygget parser, IKKE en generel én: antager velformet markup (den,
 *  build.mjs og sammenligning.js selv skriver) og dropper tekstnoder. */
export function parse(html) {
  let i = 0;
  const rodEl = new El('#rod');
  const stak = [rodEl];
  const top = () => stak[stak.length - 1];

  function parseAttrs() {
    const attrs = {};
    for (;;) {
      while (/\s/.test(html[i] || '')) i++;
      if (html[i] === '>' || (html[i] === '/' && html[i + 1] === '>')) break;
      const m = /^[^\s=/>]+/.exec(html.slice(i));
      if (!m) break;
      const navn = m[0];
      i += navn.length;
      while (/\s/.test(html[i] || '')) i++;
      let vaerdi = '';
      if (html[i] === '=') {
        i++;
        while (/\s/.test(html[i] || '')) i++;
        const q = html[i];
        if (q === '"' || q === "'") {
          i++;
          const slut = html.indexOf(q, i);
          vaerdi = afkodEntitet(html.slice(i, slut));
          i = slut + 1;
        } else {
          const m2 = /^[^\s>]+/.exec(html.slice(i));
          vaerdi = m2 ? afkodEntitet(m2[0]) : '';
          i += vaerdi.length;
        }
      }
      attrs[navn.toLowerCase()] = vaerdi;
    }
    return attrs;
  }

  while (i < html.length) {
    if (html.startsWith('<!--', i)) { const e = html.indexOf('-->', i); i = e < 0 ? html.length : e + 3; continue; }
    if (html.startsWith('<!', i)) { const e = html.indexOf('>', i); i = e < 0 ? html.length : e + 1; continue; }
    if (html[i] !== '<') { i++; continue; }
    if (html.startsWith('</', i)) {
      const m = /^<\/([a-zA-Z][\w-]*)\s*>/.exec(html.slice(i));
      if (m) { i += m[0].length; if (stak.length > 1) stak.pop(); } else i++;
      continue;
    }
    const m = /^<([a-zA-Z][\w-]*)/.exec(html.slice(i));
    if (!m) { i++; continue; }
    i += m[0].length;
    const tag = m[1].toLowerCase();
    const attrs = parseAttrs();
    const selvlukket = html[i] === '/' && html[i + 1] === '>';
    i += selvlukket ? 2 : 1;
    const el = new El(tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    top().appendChild(el);
    if (selvlukket || TOMME_TAGS.has(tag)) continue;
    if (RAATEKST_TAGS.has(tag)) {
      const luk = `</${tag}>`;
      const e = html.indexOf(luk, i);
      el._text = e < 0 ? html.slice(i) : html.slice(i, e);
      i = e < 0 ? html.length : e + luk.length;
      continue;
    }
    stak.push(el);
  }
  return rodEl;
}

/* ---------------------------------------------------------------------------
   Selve maalingen.
--------------------------------------------------------------------------- */

/**
 * Koerer assets/sammenligning.js mod en bygget side og giver `tabelHTML()`s
 * raa output tilbage sammen med den inline JSON-blok, siden baerer.
 */
export function kaldTabelHTML(sideHTML, scriptKilde) {
  const domRod = parse(sideHTML);
  const htmlEl = queryAll(domRod, 'html')[0] || null;
  const dokument = {
    documentElement: htmlEl,
    getElementById: (id) => queryAll(domRod, `#${id}`)[0] || null,
    querySelector: (sel) => queryAll(domRod, sel)[0] || null,
    querySelectorAll: (sel) => queryAll(domRod, sel),
  };
  const sandkasse = { document: dokument, window: { Intl }, Intl, console };
  vm.createContext(sandkasse);
  vm.runInContext(scriptKilde, sandkasse, { filename: 'assets/sammenligning.js' });

  const resultat = dokument.querySelector('[data-saml-resultat]');
  const dataEl = dokument.getElementById('sammenligning-data');
  let data = null;
  try { data = JSON.parse(dataEl.textContent); } catch { data = null; }
  return { tabelHTML: resultat ? resultat.innerHTML : '', data };
}

/**
 * Taeller tabelsemantikken i `tabelHTML()`s output.
 *
 * KONTRAFAKTISK: naar tabellen er et div-gitter (som foer Aa54), er
 * `table`, `caption`, `thScopeCol` og `thScopeRow` alle 0, og
 * `celleTags` er `['div']`. Tallene kan altsaa ikke blive rigtige ved et
 * tilfaelde - de kraever, at semantikken faktisk naar frem til klienten.
 */
export function taelSemantik(tabelHTML, data) {
  const rodEl = parse(tabelHTML);
  const alle = queryAll(rodEl, '');
  const alleEl = [];
  (function gaa(n) { for (const c of n.children) { alleEl.push(c); gaa(c); } })(rodEl);
  void alle;

  const tags = (t) => alleEl.filter((e) => e.tagName === t);
  const th = tags('th');
  const thScopeCol = th.filter((e) => e.getAttribute('scope') === 'col');
  const thScopeRow = th.filter((e) => e.getAttribute('scope') === 'row');
  const thScopeRowgroup = th.filter((e) => e.getAttribute('scope') === 'rowgroup');

  // Vaerdicellerne: de baerer klassen .saml-raekke__celle, uanset hvilket tag
  // de tegnes med. Er ÉN af dem ikke et <td>, staar en vaerdi uden for en
  // celle, og skaermlaeseren kan ikke knytte den til raekken.
  const vaerdiceller = alleEl.filter((e) => (e.getAttribute('class') || '').split(/\s+/).includes('saml-raekke__celle'));
  const celleTags = [...new Set(vaerdiceller.map((e) => e.tagName))].sort();

  // Ethvert direkte barn af en <tr> SKAL vaere <td> eller <th>.
  const trBoernFejl = [];
  for (const tr of tags('tr')) {
    for (const c of tr.children) if (c.tagName !== 'td' && c.tagName !== 'th') trBoernFejl.push(`${tr.getAttribute('class')} > ${c.tagName}`);
  }

  // Ingen vaerdi (.v) maa staa uden for en <td>/<th>.
  const vUdenforCelle = alleEl
    .filter((e) => (e.getAttribute('class') || '').split(/\s+/).includes('v'))
    .filter((e) => {
      let p = e.parent;
      while (p && p.tagName !== '#rod') {
        if (p.tagName === 'td' || p.tagName === 'th') return false;
        p = p.parent;
      }
      return true;
    });

  const antalRobotter = data ? data.standard.length : null;
  const antalFelter = data ? data.grupper.reduce((a, g) => a + g.felter.length, 0) : null;

  const capEl = tags('caption')[0] || null;
  const capMatch = tabelHTML.match(/<caption[^>]*>([\s\S]*?)<\/caption>/);

  return {
    table: tags('table').length,
    caption: tags('caption').length,
    captionTekst: capMatch ? capMatch[1] : '',
    captionId: capEl ? capEl.getAttribute('id') : null,
    thead: tags('thead').length,
    tbody: tags('tbody').length,
    tr: tags('tr').length,
    th: th.length,
    td: tags('td').length,
    thScopeCol: thScopeCol.length,
    thScopeRow: thScopeRow.length,
    thScopeRowgroup: thScopeRowgroup.length,
    div: tags('div').length,
    vaerdiceller: vaerdiceller.length,
    celleTags,
    trBoernFejl,
    vUdenforCelle: vUdenforCelle.length,
    antalRobotter,
    antalFelter,
  };
}

/** Byg + maal i ét. `distMappe` skal indeholde `<sprog>/sammenligning/index.html`. */
export function maal({ rod = ROD, distMappe, sprog = 'da' } = {}) {
  const sideSti = path.join(distMappe, sprog, 'sammenligning', 'index.html');
  const sideHTML = fs.readFileSync(sideSti, 'utf8');
  const scriptKilde = fs.readFileSync(path.join(rod, 'assets', 'sammenligning.js'), 'utf8');
  const { tabelHTML, data } = kaldTabelHTML(sideHTML, scriptKilde);
  return { ...taelSemantik(tabelHTML, data), tabelHTML, sideSti };
}

function erHovedmodul() {
  return process.argv[1] && path.resolve(process.argv[1]) === path.resolve(url.fileURLToPath(import.meta.url));
}

if (erHovedmodul()) {
  const arg = (n, fald) => {
    const t = process.argv.find((a) => a.startsWith(`--${n}=`));
    return t ? t.slice(n.length + 3) : fald;
  };
  const sprog = arg('sprog', 'da');
  let distMappe = arg('dist', null);
  if (!distMappe) {
    distMappe = path.join(ROD, 'dist-tabelsemantik');
    const b = spawnSync(process.execPath, [path.join(ROD, 'tools', 'build.mjs'), `--ud=${distMappe}`],
      { cwd: ROD, encoding: 'utf8' });
    if (b.status !== 0) {
      console.error(`byg fejlede (exit ${b.status}):\n${(b.stderr || '').trim()}`);
      process.exitCode = 1;
    }
  } else if (!path.isAbsolute(distMappe)) {
    distMappe = path.join(ROD, distMappe);
  }

  const m = maal({ distMappe, sprog });
  console.log(`tabelsemantik i ${path.relative(ROD, m.sideSti)} (klientside-output fra tabelHTML())`);
  console.log(`  <table>            ${m.table}`);
  console.log(`  <caption>          ${m.caption}   ${m.captionTekst ? `"${m.captionTekst}"` : ''}`);
  console.log(`  <th scope="col">   ${m.thScopeCol}   (valgte robotter: ${m.antalRobotter})`);
  console.log(`  <th scope="row">   ${m.thScopeRow}   (felter: ${m.antalFelter})`);
  console.log(`  <th scope="rowgroup"> ${m.thScopeRowgroup}   (grupper)`);
  console.log(`  <tbody> ${m.tbody} · <thead> ${m.thead} · <tr> ${m.tr} · <td> ${m.td} · <div> ${m.div}`);
  console.log(`  vaerdiceller: ${m.vaerdiceller}, tegnet som: ${m.celleTags.join(', ') || 'ingen'}`);
  console.log(`  celler uden for en <td>/<th>: ${m.vUdenforCelle} · ikke-celle-boern af <tr>: ${m.trBoernFejl.length}`);

  const ok = m.table === 1 && m.caption === 1
    && m.thScopeCol === m.antalRobotter && m.thScopeRow === m.antalFelter
    && m.vUdenforCelle === 0 && m.trBoernFejl.length === 0
    && m.celleTags.length === 1 && m.celleTags[0] === 'td';
  console.log(`\n${ok ? 'OK' : 'IKKE OPFYLDT'}: <table> 1 · <caption> 1 · th[scope=col] = ${m.antalRobotter} · th[scope=row] = ${m.antalFelter} · alle vaerdier i <td>`);
  if (!ok) process.exitCode = 1;
}
