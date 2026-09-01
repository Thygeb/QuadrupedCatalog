/**
 * tests/dele/11-sammenligning.mjs — spor/sammenlign: standardtrio (punkt 1),
 * tekst+interval-felt som ÉN vaerdi (punkt 2), soegefeltet (punkt 3).
 *
 * Punkt 3 koerer den RIGTIGE assets/sammenligning.js mod den RIGTIGE byggede
 * side via en minimal, formaalsbygget DOM-shim (ingen ny afhaengighed -
 * projektet er dependency-frit og har ingen jsdom). Shimmen daekker kun det,
 * filen faktisk bruger: getElementById, querySelector(All) paa
 * tag/#id/[attr]/[attr=vaerdi], hidden/value/checked/textContent og
 * addEventListener/dispatchEvent - ikke en generel HTML-parser.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n13. spor/sammenlign: standardtrio (punkt 1), tekst+interval (punkt 2), soegning (punkt 3)');

  const distA = path.join(tmp, 'dist-sammenlign-a');
  const distB = path.join(tmp, 'dist-sammenlign-b');

  // Grundmaaling for DENNE bloks egne paastande: byg af HELE kataloget (ikke
  // en fixture) - punkt 1's trio og punkt 2's tekst+interval-felt (Spots
  // stroem_ud) findes kun i de rigtige data/robots, ikke i tests/eksempel-robotter.
  const bA = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${distA}`],
    { cwd: rod, encoding: 'utf8' });
  ok('spor/sammenlign: byg af hele kataloget (1/2) giver exit 0', bA.status === 0, (bA.stderr || '').trim());

  function laesSammenligningData(distMappe, sprogkode) {
    const html = fs.readFileSync(path.join(distMappe, sprogkode, 'sammenligning', 'index.html'), 'utf8');
    const m = html.match(/<script type="application\/json" id="sammenligning-data">([\s\S]*?)<\/script>/);
    return { html, data: m ? JSON.parse(m[1]) : null };
  }

  const { html: htmlA, data: dataA } = laesSammenligningData(distA, 'da');

  // 4a — standardtrioen (punkt 1): >= 15 af 30 felter oplyst i HVER af de tre
  // kolonner, maalt paa det NUVAERENDE katalog. Rulles punkt 1 tilbage til den
  // haardkodede STANDARD_SLUGS, falder testen paa ANYmal X (4/30).
  const trio = (dataA && dataA.standard || []).map((slug) => dataA.robotter.find((r) => r.slug === slug));
  ok('4a: standardtrioen har tre robotter, hver med >= 15 af 30 felter oplyst',
    trio.length === 3 && trio.every((r) => r && r.taethedAntal >= 15),
    trio.map((r) => `${r ? r.slug : '?'}:${r ? r.taethedAntal : '?'}/30`).join(', '));

  // 4b — tre FORSKELLIGE producenter (punkt 1, acceptkriterium 2).
  const producenterITrio = new Set(trio.filter(Boolean).map((r) => r.producent));
  ok('4b: standardtrioens tre robotter har tre forskellige producenter',
    producenterITrio.size === 3, [...producenterITrio].join(', '));

  // 4b — determinisme ("afgjort alfabetisk paa slug ved lige taethed, saa
  // bygget er 100% reproducerbart"): to UAFHAENGIGE byg af samme data giver
  // samme trio i samme raekkefoelge.
  const bB = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${distB}`],
    { cwd: rod, encoding: 'utf8' });
  ok('spor/sammenlign: byg af hele kataloget (2/2) giver exit 0', bB.status === 0, (bB.stderr || '').trim());
  const { data: dataB } = laesSammenligningData(distB, 'da');
  ok('4b: standardtrioen er deterministisk (to uafhaengige byg giver samme tre slugs, samme raekkefoelge)',
    JSON.stringify(dataA.standard) === JSON.stringify(dataB.standard),
    `${JSON.stringify(dataA.standard)} vs ${JSON.stringify(dataB.standard)}`);

  // 4c — tekst + interval giver ÉN vaerdi (punkt 2). Spots stroem_ud er det
  // ENESTE felt i hele kataloget, der baerer baade en tekstvaerdi og et
  // maalbart interval samtidig (maalt under rettelsen, se commit-beskeden for
  // tools/skema.mjs) - rulles punkt 2 tilbage, faar denne celle igen min/maks
  // ved siden af tekstvaerdien.
  const spot = dataA.robotter.find((r) => r.slug === 'boston-dynamics-spot');
  const stroemUd = spot && spot.felter.stroem_ud;
  ok('4c: Spots "stroem ud" (tekstvaerdi + interval) viser kun tekstvaerdien - min/maks er vaek fra visningen',
    !!stroemUd && stroemUd.tilstand === 'tekst'
    && stroemUd.tekst === 'ureguleret DC 35-58,8 V, 150 W pr. port'
    && stroemUd.min === undefined && stroemUd.maks === undefined,
    JSON.stringify(stroemUd));

  // 4d — soegefeltet (punkt 3).
  const vm = await import('node:vm');

  class El {
    constructor(tag) {
      this.tagName = tag;
      this._attrs = new Map();
      this.children = [];
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
    appendChild(c) { this.children.push(c); return c; }
    querySelectorAll(sel) { return domQueryAll(this, sel); }
    querySelector(sel) { return domQueryAll(this, sel)[0] || null; }
  }

  function domParseSelectorParts(sel) {
    return sel.match(/(^[a-zA-Z][\w-]*)|(#[\w-]+)|(\.[\w-]+)|(\[[^\]]+\])/g) || [];
  }
  function domElMatchesPart(el, part) {
    if (part[0] === '#') return el.getAttribute('id') === part.slice(1);
    if (part[0] === '.') return (el.getAttribute('class') || '').split(/\s+/).includes(part.slice(1));
    if (part[0] === '[') {
      const inner = part.slice(1, -1);
      const eq = inner.indexOf('=');
      if (eq === -1) return el.hasAttribute(inner);
      const key = inner.slice(0, eq);
      const val = inner.slice(eq + 1).replace(/^["']|["']$/g, '');
      return el.getAttribute(key) === val;
    }
    return el.tagName === part;
  }
  function domMatches(el, sel) {
    return domParseSelectorParts(sel).every((p) => domElMatchesPart(el, p));
  }
  function domQueryAll(root, sel) {
    const ud = [];
    (function gaa(node) {
      for (const c of node.children) {
        if (domMatches(c, sel)) ud.push(c);
        gaa(c);
      }
    })(root);
    return ud;
  }

  const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'source', 'track', 'wbr']);
  const RAW_TEXT_TAGS = new Set(['script', 'style']);
  function afkodEntitet(s) {
    return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'").replace(/&amp;/g, '&');
  }

  /** En lille, formaalsbygget HTML-parser - IKKE en generel én. Antager
   *  velformet markup (den, build.mjs selv skriver) og dropper tekstnoder
   *  (ingen kode i sammenligning.js LAESER textContent - kun SKRIVER den). */
  function domParse(html) {
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
        const naam = m[0];
        i += naam.length;
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
        attrs[naam.toLowerCase()] = vaerdi;
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
      if (selvlukket || VOID_TAGS.has(tag)) continue;
      if (RAW_TEXT_TAGS.has(tag)) {
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

  const domRod = domParse(htmlA);
  const htmlEl = domQueryAll(domRod, 'html')[0] || null;
  const domDocument = {
    documentElement: htmlEl,
    getElementById: (id) => domQueryAll(domRod, `#${id}`)[0] || null,
    querySelector: (sel) => domQueryAll(domRod, sel)[0] || null,
    querySelectorAll: (sel) => domQueryAll(domRod, sel),
  };

  const scriptSrc = fs.readFileSync(path.join(rod, 'assets', 'sammenligning.js'), 'utf8');
  const sandbox = { document: domDocument, window: { Intl }, Intl, console };
  vm.createContext(sandbox);
  vm.runInContext(scriptSrc, sandbox, { filename: 'assets/sammenligning.js' });

  /* 4d — VENDT AF ORKESTRATOREN VED FLET, 1. sep 2026.

     Her stod to paastande om soegefeltet: at "Søg blandt robotterne" fandtes
     i den byggede side, og at en soegning paa "gang" reducerede chippene til
     Gangben-familien. Begge var rigtige, da de blev skrevet.

     Soegefeltet hoerte til sammenligningssidens robotvaelger, og JPK fjernede
     hele vaelgeren (L73): udvalget sker nu paa katalogsiden. Emnet findes
     altsaa ikke laengere - paastandene er ikke saenket, de er blevet
     genstandsloese.

     DET, DER VAR VAERD AT BEVARE, ER APPARATET OMKRING DEM. Blokken ovenfor
     bygger en DOM-shim og koerer den RIGTIGE assets/sammenligning.js igennem
     den. Det er den eneste test i suiten, der beviser, at scriptet
     overhovedet kan parses og eksekveres mod den byggede side - en
     roegproeve, der ville have fanget en syntaksfejl eller et kald til et
     element, der er forsvundet. Havde jeg slettet 4d helt, var det apparat
     gaaet med.

     De to paastande er derfor erstattet af to andre, der bruger samme
     apparat: at scriptet koerer rent, og at soegefeltet FAKTISK er vaek.
     Den fulde daekning af den nye flade ligger i
     tests/dele/55-sammenligning-uden-vaelger.mjs. */

  ok('4d: assets/sammenligning.js kan parses og koere mod den byggede side',
    typeof sandbox === 'object' && sandbox !== null);

  const soegInput = domDocument.getElementById('saml-soeg');
  const chips = domQueryAll(domRod, '[data-sog]');
  ok('4d: soegefeltet og vaelgerchippene er FJERNET med vaelgeren (L73) '
    + `(fandt ${soegInput ? 1 : 0} soegefelt, ${chips.length} chips - begge skal vaere 0)`,
    soegInput === null && chips.length === 0);
}
