#!/usr/bin/env node
/**
 * tools/maal-skrift.mjs — R5: Maaleapparat for font-size i system.css og generator.css
 *
 * Parser CSS-erklaeringer og IKKE tekst (springer kommentarer over).
 * Udskriver hver unik font-size-vaerdi, forekomster, og hvilke selektorer der bruger den.
 *
 * Anvendelse:
 *   node tools/maal-skrift.mjs
 *   node tools/maal-skrift.mjs --detaljer
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rod = path.resolve(__dirname, '..');

/**
 * Fjerner CSS-kommentarer /* ... * /
 */
export function fjernKommentarer(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/**
 * Parser font-size-erklaeringer i en CSS-streng.
 * Haandterer regler inde i og uden for @media-blokke.
 * Returnerer array af: { fil, sel, val, raa, erVigtig, erPx, pxTal }
 */
export function findFontSizeErklaeringer(css, filNavn = '') {
  const ren = fjernKommentarer(css);
  const fund = [];

  let pos = 0;
  const len = ren.length;
  const stack = [];
  let buffer = '';

  while (pos < len) {
    const ch = ren[pos];

    if (ch === '{') {
      const header = buffer.trim();
      buffer = '';
      stack.push({ header });
      pos++;
    } else if (ch === '}') {
      const popped = stack.pop();
      if (popped) {
        const body = buffer;
        const selector = stack.map(s => s.header).concat(popped.header).join(' -> ');
        analyserKrop(body, selector, filNavn, fund);
      }
      buffer = '';
      pos++;
    } else if (ch === ';') {
      buffer += ch;
      pos++;
    } else {
      buffer += ch;
      pos++;
    }
  }

  return fund;
}

function analyserKrop(body, selector, filNavn, fund) {
  const erklaeringer = body.split(';');
  for (const erk of erklaeringer) {
    const kolon = erk.indexOf(':');
    if (kolon === -1) continue;
    const prop = erk.slice(0, kolon).trim();
    if (prop === 'font-size') {
      const raaVal = erk.slice(kolon + 1).trim();
      if (!raaVal) continue;
      const erVigtig = /\!important\s*$/i.test(raaVal);
      const val = raaVal.replace(/\s*\!important\s*$/i, '').trim();
      const pxMatch = /^([0-9.]+)px$/.exec(val);
      const erPx = !!pxMatch;
      const pxTal = erPx ? parseFloat(pxMatch[1]) : null;

      fund.push({
        fil: filNavn,
        sel: selector,
        val,
        raa: raaVal,
        erVigtig,
        erPx,
        pxTal,
      });
    }
  }
}

/**
 * Samler statistik over font-size fund
 */
export function opsummer(fund) {
  const unikkeMap = new Map();

  for (const f of fund) {
    if (!unikkeMap.has(f.val)) {
      unikkeMap.set(f.val, {
        val: f.val,
        antal: 0,
        filer: new Set(),
        vigtige: 0,
        erPx: f.erPx,
        pxTal: f.pxTal,
        selektorer: [],
      });
    }
    const post = unikkeMap.get(f.val);
    post.antal++;
    post.filer.add(f.fil);
    if (f.erVigtig) post.vigtige++;
    post.selektorer.push({ fil: f.fil, sel: f.sel });
  }

  const unikke = [...unikkeMap.values()];

  // Sorter: Først talværdier numerisk, derefter clamps/max/em/var alfabetisk
  unikke.sort((a, b) => {
    if (a.pxTal !== null && b.pxTal !== null) return a.pxTal - b.pxTal;
    if (a.pxTal !== null) return -1;
    if (b.pxTal !== null) return 1;
    return a.val.localeCompare(b.val);
  });

  const renePx = unikke.filter(u => u.erPx);
  const spand9til20 = renePx.filter(u => u.pxTal >= 9 && u.pxTal <= 20);
  const clamps = unikke.filter(u => u.val.startsWith('clamp('));
  const maxes = unikke.filter(u => u.val.startsWith('max('));
  const vigtigeAntal = fund.filter(f => f.erVigtig).length;
  const underGulv = renePx.filter(u => u.pxTal < 10.5);

  return {
    totalErklaeringer: fund.length,
    unikkeAntal: unikke.length,
    renePxAntal: renePx.length,
    spand9til20Antal: spand9til20.length,
    clampsAntal: clamps.length,
    maxesAntal: maxes.length,
    vigtigeAntal,
    underGulvAntal: underGulv.length,
    unikke,
    renePx,
    spand9til20,
    underGulv,
  };
}

// Hovedkørsel hvis kaldt direkte fra kommandolinjen
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const visDetaljer = process.argv.includes('--detaljer');
  const sysSti = path.join(rod, 'assets', 'system.css');
  const genSti = path.join(rod, 'assets', 'generator.css');

  const sysCss = fs.readFileSync(sysSti, 'utf8');
  const genCss = fs.readFileSync(genSti, 'utf8');

  const sysFund = findFontSizeErklaeringer(sysCss, 'system.css');
  const genFund = findFontSizeErklaeringer(genCss, 'generator.css');
  const alleFund = sysFund.concat(genFund);

  const stats = opsummer(alleFund);

  console.log('='.repeat(78));
  console.log('MAAL-SKRIFT: Opgørelse af font-size (uden CSS-kommentarer)');
  console.log('='.repeat(78));
  console.log(`Total erklaeringer:       ${stats.totalErklaeringer} (system: ${sysFund.length}, generator: ${genFund.length})`);
  console.log(`Unikke vaerdier:          ${stats.unikkeAntal}`);
  console.log(`Rene px-vaerdier:         ${stats.renePxAntal}`);
  console.log(`Trin i spaendet 9-20px:   ${stats.spand9til20Antal}`);
  console.log(`Clamp()-erklaeringer:     ${stats.clampsAntal} unikke`);
  console.log(`Max()-erklaeringer:       ${stats.maxesAntal} unikke`);
  console.log(`!important erklaeringer:  ${stats.vigtigeAntal}`);
  console.log(`Vaerdier under 10.5px:    ${stats.underGulvAntal} unikke (rene px)`);
  console.log('-'.repeat(78));
  console.log('VÆRDI'.padEnd(26) + 'ANTAL'.padEnd(8) + 'FILER'.padEnd(24) + '!IMPORTANT');
  console.log('-'.repeat(78));

  for (const u of stats.unikke) {
    const filerStr = [...u.filer].join(', ');
    const vigtigStr = u.vigtige > 0 ? `${u.vigtige} stk` : '-';
    console.log(u.val.padEnd(26) + String(u.antal).padEnd(8) + filerStr.padEnd(24) + vigtigStr);

    if (visDetaljer) {
      for (const s of u.selektorer) {
        console.log(`    [${s.fil}] ${s.sel}`);
      }
    }
  }

  console.log('='.repeat(78));
}
