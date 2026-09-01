/**
 * tests/dele/41-samlknap.mjs — spor/kort, 1. sep 2026.
 *
 * "Tilfoej til sammenligning"-knappen (JPK 1. sep 2026, punkt 1) og de tre
 * ting, der kan gaa i stykker uden at nogen opdager det:
 *
 * 1. ARKITEKTURREGEL P0. Knappen skal staa `hidden` i HTML'en - hver eneste
 *    af dem, paa hver eneste flade. Uden JavaScript findes den saa ikke for
 *    laeseren, og sammenligningssidens egne afkrydsningsfelter er uroert den
 *    eneste vej ind. Fjerner nogen `hidden` fra skabelonen, staar der
 *    pludselig en knap, som INTET goer paa de 50 producentsider, der ikke
 *    indlaeser JavaScript. Det er praecis den tilstand, briefet kaldte
 *    "vaerre end ingen knap".
 *
 * 2. GRAENSEN, DER KAN DRIVE. assets/katalog.js baerer `SAML_MAKS`, og
 *    tools/skabelon/sammenligning.mjs baerer `maksAntal`. De maa ikke kunne
 *    blive uenige: er JS'ens tal stoerst, kan laeseren afsaette fire kort i
 *    kataloget og faa det fjerde smidt vaek tavst paa sammenligningssiden.
 *    Tallet kan ikke importeres fra skabelonen (det er en egenskab paa et
 *    objekt, funktionen returnerer, ikke en eksport), saa i stedet laeses
 *    begge som tekst og holdes op mod hinanden.
 *
 * 3. HAARD BEGRAENSNING 1. Siden maa aldrig kunne laeses som en salgskanal.
 *    Knappen er en sammenligningshandling, ikke en kurv, og denne del vogter
 *    ordforraadet: hverken knappen eller taelleren maa baere kurv-, tilbuds-
 *    eller forespoergselssprog.
 *
 * Bygger sit eget dist i sin egen undermappe af ctx.tmp, jf. tests/LAESMIG.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n41. spor/kort: samlknappen - P0, graensen og haard begraensning 1');

  const ud = path.join(tmp, 'dist-samlknap');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${ud}`],
    { cwd: rod, encoding: 'utf8' });
  ok('41: byg giver exit 0', b.status === 0, (b.stderr || '').slice(0, 400));

  /* --- 1. P0: hver knap staar hidden i HTML'en ------------------------------
     Alle sider gennemgaas, ikke kun kataloget: knappen bliver renderet af
     hjaelp.samlknap() i side.mjs, som ogsaa forsiden og producentsiderne
     bruger, saa en aendring dér rammer flader, sporet ikke selv tegner. */
  const sider = [];
  (function gaa(mappe) {
    for (const p of fs.readdirSync(mappe, { withFileTypes: true })) {
      const sti = path.join(mappe, p.name);
      if (p.isDirectory()) gaa(sti);
      else if (p.name.endsWith('.html')) sider.push(sti);
    }
  }(ud));

  let knapper = 0;
  let udenHidden = 0;
  const udenHiddenEksempler = [];
  for (const sti of sider) {
    const html = fs.readFileSync(sti, 'utf8');
    for (const m of html.matchAll(/<button([^>]*class="kort__saml"[^>]*)>/g)) {
      knapper++;
      if (!/\shidden(\s|>|=)/.test(m[1])) {
        udenHidden++;
        if (udenHiddenEksempler.length < 3) udenHiddenEksempler.push(path.relative(ud, sti));
      }
    }
  }
  ok(`41.1: der ER samlknapper at maale paa (fandt ${knapper})`, knapper > 0);
  ok(`41.1: P0 - alle ${knapper} samlknapper staar hidden i HTML'en (0 uden)`,
    udenHidden === 0, `${udenHidden} uden hidden, fx: ${udenHiddenEksempler.join(', ')}`);

  /* Knappen skal ogsaa BAERE sin robot: uden data-saml ved JavaScript ikke,
     hvad et klik betyder, og uden aria-label hoerer en skaermlaeser kun ordet
     "Sammenlign" 83 gange uden at vide paa hvad. */
  let udenSlug = 0;
  let udenNavn = 0;
  for (const sti of sider) {
    const html = fs.readFileSync(sti, 'utf8');
    for (const m of html.matchAll(/<button([^>]*class="kort__saml"[^>]*)>/g)) {
      if (!/data-saml="[^"]+"/.test(m[1])) udenSlug++;
      if (!/aria-label="[^"]+"/.test(m[1])) udenNavn++;
    }
  }
  ok(`41.1: hver samlknap baerer data-saml (${knapper - udenSlug} af ${knapper})`, udenSlug === 0);
  ok(`41.1: hver samlknap baerer aria-label med robottens navn (${knapper - udenNavn} af ${knapper})`,
    udenNavn === 0);

  /* --- 2. Graensen maa ikke drive fra sammenligningssidens maksAntal ------- */
  const js = fs.readFileSync(path.join(rod, 'assets', 'katalog.js'), 'utf8');
  const skabelon = fs.readFileSync(path.join(rod, 'tools', 'skabelon', 'sammenligning.mjs'), 'utf8');
  const mJs = /SAML_MAKS\s*=\s*(\d+)/.exec(js);
  const mSk = /maksAntal:\s*(\d+)/.exec(skabelon);
  ok('41.2: SAML_MAKS findes i assets/katalog.js', !!mJs);
  ok('41.2: maksAntal findes i tools/skabelon/sammenligning.mjs', !!mSk);
  if (mJs && mSk) {
    ok(`41.2: de to graenser er ens (katalog.js ${mJs[1]} = sammenligning.mjs ${mSk[1]})`,
      mJs[1] === mSk[1],
      `katalog.js siger ${mJs[1]}, sammenligning.mjs siger ${mSk[1]} - en laeser kan afsaette flere kort, end sammenligningen vil vise`);
  }

  /* Begge ender skal bruge den SAMME noegle i lokalt lager, ellers rejser
     udvalget ikke med fra kataloget til sammenligningen - og fejlen er tavs:
     begge sider virker hver for sig. */
  const samlJs = fs.readFileSync(path.join(rod, 'assets', 'sammenligning.js'), 'utf8');
  const nJs = /SAML_NOEGLE\s*=\s*'([^']+)'/.exec(js);
  const nSaml = /SAML_NOEGLE\s*=\s*'([^']+)'/.exec(samlJs);
  ok('41.2: begge scripts bruger samme noegle i lokalt lager',
    !!nJs && !!nSaml && nJs[1] === nSaml[1],
    `katalog.js: ${nJs && nJs[1]} · sammenligning.js: ${nSaml && nSaml[1]}`);

  /* --- 3. Haard begraensning 1: ingen kurv ---------------------------------
     Ordene maales paa de STRENGE, laeseren faktisk moeder, i begge sprog -
     ikke paa kildekoden, hvor et ord kunne staa i en kommentar. */
  const FORBUDTE = [
    'kurv', 'indkoeb', 'indkøb', 'bestil', 'tilbud', 'forespoerg', 'forespørg',
    'pris paa', 'køb', 'koeb',
    'cart', 'basket', 'checkout', 'buy', 'order', 'quote', 'enquir', 'inquir',
  ];
  const NOEGLER = ['kort_saml_knap', 'kort_saml_navn', 'saml_taeller', 'saml_gaa', 'saml_ryd'];
  for (const sprog of ['da', 'en']) {
    const i18n = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', `${sprog}.json`), 'utf8'));
    for (const n of NOEGLER) {
      ok(`41.3: ${sprog}.json har noeglen ${n}`, typeof i18n[n] === 'string' && i18n[n].length > 0);
      const v = String(i18n[n] || '').toLowerCase();
      const traf = FORBUDTE.filter((f) => v.indexOf(f) >= 0);
      ok(`41.3: ${sprog}.${n} baerer intet kurv-ord ("${i18n[n]}")`,
        traf.length === 0, `fandt: ${traf.join(', ')}`);
    }
  }
}
