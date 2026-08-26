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
 *             t(n)      bloedt opslag: en manglende noegle bliver til «noegle»
 *                       paa siden og taelles op til sidst af bygget
 *             tf(n,o)   som t(), men saetter {n}-pladsholdere ind
 *   ctx.sprog 'da' | 'en'
 *   ctx.url   { dybde, sti, op }   sti er uden sprogpraefiks, fx 'robotter/'
 *
 * Skallen (<head>, baand, skip-link, hreflang, fod) skrives af
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
import {
  FELTER, SPROG, tilstandAf, sorterAnvendelse,
  BILLEDMAPPER, BILLEDE_ENDELSER, BILLEDE_ALTERNATIVER, billedPlade, jaNejAf,
} from '../skema.mjs';
import { ENHEDER } from '../yaml.mjs';

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

/* ================================================================ billedet
   BILLEDMASKINERIET. Ét sted, brugt af baade kortet (side.mjs), robotsiden
   (robot.mjs) og producentsiden (producent.mjs).

   Grunden til at det ligger her og ikke i tre skabeloner: de tre ville
   divergere ved den fjerde aendring, og saa ville et kort og en robotside
   kunne vise den samme fil paa hver sin maade — eller det ene sted mangle
   maerket om, at filen deles. LÆSNINGEN af feltet og MARKUP'en er derfor
   faelles; kun teksterne kommer udefra, fordi sproget hoerer til i sprogfilen.

   `media/` maa ALDRIG indgaa i et byg (CLAUDE.md, mappestruktur). Kritikken
   fandt, at prototypen laeste 42 billeder direkte derfra. Vi kopierer dem ikke
   til dist/ heller: en kopi ville flytte spaerringen fra en strukturel regel
   til en huskeregel, og media/_kilder/LÆSMIG.md dokumenterer, at en
   pladsholder overlevede til lancering paa nabosiden. Derfor: billeder kommer
   KUN fra assets/, og KUN naar en robotpost peger paa dem med `billede:`.

   Den gamle vej — "ligger der en fil, der HEDDER det samme som robottens
   slug, saa vis den" — er fjernet 21. aug 2026. Den kunne saette et billede
   paa siden uden ophav og uden kilde, alene fordi nogen lagde en fil i en
   mappe. Et billede er en paastand om, hvordan en maskine ser ud, og skal
   kunne foelges hjem som ethvert tal. Maalt foer fjernelsen: 0 filer i
   assets/fotos/ og 0 i assets/silhuetter/, saa vejen fandtes uden at blive
   gaaet.
   ======================================================================== */

/** Alle billedfiler i assets/, som stier relative til assets/. Cachet pr. rod. */
const _billedFiler = new Map();
export function billedFiler(rod = ROD) {
  const noegle = path.resolve(rod);
  if (_billedFiler.has(noegle)) return _billedFiler.get(noegle);
  const fundet = new Set();
  for (const mappe of BILLEDMAPPER) {
    const start = path.join(noegle, 'assets', mappe);
    if (!fs.existsSync(start)) continue;
    (function gaa(m, praefiks) {
      for (const p of fs.readdirSync(m, { withFileTypes: true })) {
        if (p.name.startsWith('.')) continue;
        const rel = praefiks ? `${praefiks}/${p.name}` : p.name;
        if (p.isDirectory()) { gaa(path.join(m, p.name), rel); continue; }
        if (!BILLEDE_ENDELSER.includes(path.extname(p.name).toLowerCase())) continue;
        fundet.add(`${mappe}/${rel}`);
      }
    })(start, '');
  }
  _billedFiler.set(noegle, fundet);
  return fundet;
}

/** Ryd cachen. Kun til test: et byg laeser assets/ én gang. */
export function glemBilledFiler() { _billedFiler.clear(); }

/* ============================================================== pladen
   Rammen (.billedled) er 16:10. Et fotografi, der ikke ligner det ret meget,
   bliver klippet forkert af `object-fit:cover` — poter, hoved eller sider
   ryger uden for kanten. `.billedled--plade` (object-fit:contain) findes
   allerede i assets/system.css, men den var indtil nu kun tilgaengelig via
   et felt (`billede.plade` i YAML'en), som ingen huskede at saette for et
   fotografi (kun for silhuetter, via ophav). Derfor stod 0 fotografier med
   klassen, selvom 27 af 75 (maalt 26. aug 2026, se .tmp-agent/dim.mjs) afveg
   over 25 % fra 16:10.

   Loesningen her laeser filens EGNE dimensioner af byte-headeren — ingen
   billedbibliotek, ingen dependency — og afgoer sagen derfra, saa et felt
   ikke laengere er noedvendigt. Et eksplicit `plade: ja` eller `plade: nej`
   i YAML'en vinder stadig (billedPlade()/jaNejAf ovenfor); det automatiske
   spor traeder kun til, naar feltet ikke er sat.
   ====================================================================== */

/** Rammens eget forhold, sat i assets/system.css:442 (aspect-ratio:16/10). */
const SIDEFORHOLD_MAAL = 16 / 10;

/**
 * Graense for relativ afvigelse fra 16:10, foer et foto faar --plade i
 * stedet for at blive beskaaret. Maalt paa alle 75 billeder i assets/fotos/
 * (.tmp-agent/dim.mjs, 26. aug 2026): brudpunktet ligger IKKE ved et rundt
 * tal ved en tilfaeldighed — der er et hul paa 2,3 procentpoint mellem
 * 24,2 % (yobotics-y10/-y20, kvadratiske produktfotos der bevidst skal
 * beskaeres til liggende) og 26,5 % (unitree-go2, som skal have plade). Et
 * naboliggende hul paa 4,4 point ligger mellem 19,0 % og 23,4 % (den
 * fejlmaerkede cvte-maxhub-x7.jpg, se noten ved dimAfFil) og ville ogsaa
 * virke, men 25 % ligger midt i SIT hul og reproducerer praecis de 27, der
 * blev talt op i briefet: alt over 25 % (fra 26,5 % og opefter) faar --plade,
 * alt under (op til 24,2 %) beholder cover — 27 af 75 billeder rammes,
 * deriblandt alle 7 portraetter.
 */
const SIDEFORHOLD_TOLERANCE = 0.25;

/**
 * Antal katalogkort, der faar `loading="eager"` i stedet for `lazy`.
 * Maalt (ikke gaettet) 26. aug 2026 med et engangsscript i
 * maalevaerktoej/ (_agent-raekke.mjs), der taeller `.kort`-elementer i
 * DOM'ens foerste raekke: ved 1440px bredde giver `.gitter`s
 * `repeat(auto-fill,minmax(310px,1fr))` praecis 4 kort per raekke, og ved
 * viewport-hoejder fra 700-1000px (almindelige laptops) er det enten 0
 * eller netop de samme 4 kort, der er synlige foer scroll — aldrig en
 * delvis raekke. 4 er derfor det stoerste tal, der er sikkert "foerste
 * skaermbillede" paa tvaers af almindelige skaermhoejder uden at hente
 * billeder, ingen ser foer scroll.
 */
export const EAGER_KORT_ANTAL = 4;

function dimAfPNG(buf) {
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

function dimAfJPEG(buf) {
  if (buf.length < 4 || buf.readUInt16BE(0) !== 0xffd8) return null;
  let o = 2;
  while (o + 4 <= buf.length) {
    if (buf[o] !== 0xff) { o += 1; continue; }
    const markoer = buf[o + 1];
    if (markoer === 0xd8 || markoer === 0x01 || (markoer >= 0xd0 && markoer <= 0xd7)) { o += 2; continue; }
    if (markoer === 0xd9) break;
    const laengde = buf.readUInt16BE(o + 2);
    // SOFn baerer maalene (0xC0-0xCF, undtagen DHT/JPG/DAC som ikke er SOF).
    const erSOF = markoer >= 0xc0 && markoer <= 0xcf
      && markoer !== 0xc4 && markoer !== 0xc8 && markoer !== 0xcc;
    if (erSOF) {
      if (o + 9 > buf.length) return null;
      return { h: buf.readUInt16BE(o + 5), w: buf.readUInt16BE(o + 7) };
    }
    o += 2 + laengde;
  }
  return null;
}

function dimAfWebP(buf) {
  if (buf.length < 30) return null;
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') return null;
  const fourcc = buf.toString('ascii', 12, 16);
  if (fourcc === 'VP8X') {
    return {
      w: 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16)),
      h: 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16)),
    };
  }
  if (fourcc === 'VP8 ') {
    return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
  }
  if (fourcc === 'VP8L') {
    const b0 = buf[21]; const b1 = buf[22]; const b2 = buf[23]; const b3 = buf[24];
    return {
      w: 1 + (((b1 & 0x3f) << 8) | b0),
      h: 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)),
    };
  }
  return null;
}

/**
 * Billedets pixelmaal, laest af filens egen byte-header — ikke af filnavnets
 * endelse. Fundet 26. aug 2026: assets/fotos/fabrikant/cvte-maxhub-x7.jpg
 * hedder .jpg, men INDEHOLDER en WebP-fil (RIFF/WEBP-signatur). Et opslag
 * efter filendelsen ville have fejlet stille paa netop den fil og ladet den
 * falde tilbage til cover, uden at nogen kunne se hvorfor. Derfor proeves
 * alle tre formater efter tur, uanset hvad filen hedder.
 */
const _billedDim = new Map();
function dimAfFil(sti) {
  if (_billedDim.has(sti)) return _billedDim.get(sti);
  let dim = null;
  try {
    const buf = fs.readFileSync(sti);
    dim = dimAfPNG(buf) || dimAfJPEG(buf) || dimAfWebP(buf);
  } catch {
    dim = null;
  }
  _billedDim.set(sti, dim);
  return dim;
}

/** Ryd dimensions-cachen. Kun til test. */
export function glemBilledDimensioner() { _billedDim.clear(); }

/**
 * Skal billedet have --plade, UDLEDT af filens eget sideforhold? Bruges kun
 * naar YAML'en ikke selv har taget stilling (se laesBillede). Afvigelsen
 * regnes relativt og retningsloest — |forhold - 16/10| / (16/10) — saa et
 * for smalt portraet (yufan-lingmao-cyvet, 0,66) og et for bredt liggende
 * billede (unitree-laikago, 2,34) behandles ens: begge mister noget af
 * robotten under cover, saa begge skal have contain. At skelne retning ville
 * kraeve en begrundelse for hvorfor den ene slags beskaering er vaerre end
 * den anden, og der er ingen — cover skaerer poter af i begge retninger.
 */
export function billedAutoPlade(fil, rod = ROD) {
  if (typeof fil !== 'string' || fil.trim() === '') return false;
  const dim = dimAfFil(path.join(path.resolve(rod), 'assets', fil));
  if (!dim || !dim.w || !dim.h) return false;
  const forhold = dim.w / dim.h;
  const afvigelse = Math.abs(forhold - SIDEFORHOLD_MAAL) / SIDEFORHOLD_MAAL;
  return afvigelse > SIDEFORHOLD_TOLERANCE;
}

/**
 * Robottens billedpost i den form, skabelonerne bruger — eller null.
 * Null betyder den tomme plade, og den er en aerlig tilstand, ikke en fejl.
 */
export function laesBillede(robot, rod = ROD) {
  const b = robot?.billede;
  if (!b || typeof b !== 'object' || Array.isArray(b)) return null;
  if (typeof b.fil !== 'string' || b.fil.trim() === '') return null;
  const tekst = (v) => (typeof v === 'string' && v.trim() !== '' ? v : null);
  // Eksplicit `plade: ja`/`nej` i YAML'en vinder altid, i begge retninger —
  // et felt, en dataskriver bevidst har sat, skal ikke kunne overstyres af
  // en maaling, den ikke kan se. Er feltet IKKE sat, afgoer billedPlade()
  // stadig silhuetter (ophav==='silhuet'); for alt andet traeder det
  // automatiske sideforhold-tjek til, saa et fotograf ikke laengere kraever
  // et huskefelt for at faa den rigtige beskaering.
  const eksplicitPlade = jaNejAf(b.plade);
  const plade = eksplicitPlade !== null
    ? eksplicitPlade
    : (billedPlade(b) || billedAutoPlade(b.fil, rod));
  return {
    fil: b.fil,
    ophav: tekst(b.ophav),
    kilde: tekst(b.kilde),
    hentet: tekst(b.hentet),
    alt: tekst(b.alt),
    note: tekst(b.note),
    delt_med: tekst(b.delt_med),
    plade,
    pos: tekst(b.pos),
  };
}

/**
 * <source>-linjerne til et <picture>. Kun formater, der FINDES som fil i
 * assets/, bliver til en kilde. En srcset til en fil, ingen har lavet, er en
 * tom paastand — browseren falder ganske vist tilbage til <img>, men saa staar
 * der en linje i HTML, der lyver om, hvad projektet har.
 */
export function billedAlternativer(fil, rod = ROD) {
  const filer = billedFiler(rod);
  const uden = String(fil).replace(/\.[^./]+$/, '');
  const ud = [];
  for (const [endelse, type] of BILLEDE_ALTERNATIVER) {
    const kandidat = `${uden}${endelse}`;
    if (kandidat !== fil && filer.has(kandidat)) ud.push([kandidat, type]);
  }
  return ud;
}

/**
 * Billedleddet. `tekst` baerer sproget: { intet, grund, alt, delt }.
 *
 *   b     laesBillede(robot) eller null
 *   op    stien tilbage til dist/-roden, fx '../../'
 *   stor   robotsidens store led (billedled--stor). Det er sidens foerste
 *          element og indlaeses derfor IKKE dovent
 *   eager  katalogkortets billede skal IKKE laeses dovent, fordi kortet er
 *          blandt de foerste EAGER_KORT_ANTAL paa siden (maalt med
 *          maalevaerktoej/_agent-raekke.mjs 26. aug 2026: praecis 4 kort
 *          staar i foerste raekke ved 1440px bredde, og ingen flere er
 *          synlige foer scroll ved nogen almindelig laptop-hoejde 700-1000px)
 */
export function billedledHTML({
  b, op = '', stor = false, eager = false, tekst, rod = ROD,
}) {
  const klasser = ['billedled'];
  if (stor) klasser.push('billedled--stor');

  // Den tomme plade. Den skal laeses som en TOM PLADS i vaerket, ikke som et
  // brudt billede - derfor staar der en grund, ikke bare et ikon.
  if (!b) {
    if (b !== null && b !== undefined) throw new Error('billedledHTML: b skal vaere en post eller null');
    return `<div class="${klasser.join(' ')}">
<div class="intetfoto">
<span class="plade" aria-hidden="true"></span>
<p class="hoved">${esc(tekst.intet)}</p>
<p class="grund">${esc(tekst.grund)}</p>
</div>
</div>`;
  }

  if (b.plade) klasser.push('billedled--plade');
  const sti = (f) => `${op}billeder/${f}`;
  const kilder = billedAlternativer(b.fil, rod)
    .map(([f, type]) => `<source srcset="${attr(sti(f))}" type="${attr(type)}">`);
  const stil = b.pos ? ` style="object-position:${attr(b.pos)}"` : '';

  // 15 robotter deler 7 filer (SHA-256 i MANIFEST.tsv). Maerket staar PAA
  // fotografiet, fordi det er paa fotografiet, misforstaaelsen sker. Det siger,
  // at filen deles - ikke hvilken af modellerne den viser. Det ved vi ikke.
  const maerke = b.delt_med
    ? `\n<span class="billedmaerke"><i class="mrk"></i>${esc(tekst.delt)}</span>`
    : '';

  // stor (robotsidens hero) har ALDRIG baaret et loading-attribut - den er
  // sidens foerste element og skal ikke se ud som en eftertanke. `eager` er
  // et katalogkort blandt de foerste EAGER_KORT_ANTAL: det FÅR attributten,
  // skrevet eksplicit, saa "hvor mange kort er eager" kan taelles med en
  // grep i stedet for at taelle "mangler lazy" negativt.
  const indlaesning = stor ? '' : ` loading="${eager ? 'eager' : 'lazy'}"`;
  return `<div class="${klasser.join(' ')}">
<picture>
${kilder.length ? kilder.join('\n') + '\n' : ''}<img src="${attr(sti(b.fil))}" alt="${attr(tekst.alt)}"${stil}`
    + `${indlaesning} decoding="async">
</picture>${maerke}
</div>`;
}

/**
 * Billedets sandhed, som linjer. Her staar hvor billedet kommer fra - og kun
 * det. Ingen pris, ingen knap, ingen doer ud af sitet.
 *
 * `tekst.ophav` er et opslag pr. ophavstilstand. Mangler tilstanden en tekst,
 * springes linjen over frem for at skrive "undefined" paa siden.
 */
export function billedLinjer(b, tekst) {
  if (!b) return [];
  const linjer = [];
  const ophavstekst = b.ophav ? tekst.ophav?.[b.ophav] : null;
  if (ophavstekst) linjer.push(['prik', ophavstekst]);
  if (b.delt_med && tekst.delt_forklaring) {
    linjer.push(['prik prik--klip', saetInd(tekst.delt_forklaring, { model: b.delt_med })]);
  }
  if (b.note) linjer.push(['prik', b.note]);
  return linjer;
}

/* -------------------------------------------------------------- sprogfilen */

/**
 * Noegler, der ikke fandtes i sprogfilen. Bygget skriver dem ud til sidst.
 *
 * Der er ikke laengere nogen anden kilde til UI-tekst end data/i18n/<sprog>.json.
 * Generatoren havde indtil 21. aug 2026 et reservesaet i
 * tools/skabelon/reserve-<sprog>.json; det er nedlagt, og noeglerne er flyttet.
 * Genindfoer det ikke: to steder at skrive den samme streng betyder, at det ene
 * bliver glemt, og at /da/ kan ende med at vise translittereret dansk igen.
 */
export const manglendeNoegler = new Set();

export function lavSprog(sprogkode) {
  const fil = path.join(ROD, 'data/i18n', `${sprogkode}.json`);
  if (!fs.existsSync(fil)) throw new Error(`Sprogfilen mangler: ${fil}`);
  const raa = JSON.parse(fs.readFileSync(fil, 'utf8'));

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

  /** Bloedt opslag. En manglende noegle stopper ikke bygget, men bliver til
   *  «noegle» paa siden og staar i bygrapporten til sidst. */
  function t(n) {
    if (n in raa) return raa[n];
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
      return undefined;
    },
    has(m, n) { return (typeof n === 'string' && n in ekstra) || n in m; },
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

/* ------------------------------------------------------------- yderpunkter
 * JPK, 24. aug 2026: loesningen paa "ingen fremhaevet robot". DESIGN.md
 * forbyder "featured" eksplicit, fordi en fremhaevelse er en kvalitetsdom, og
 * PRODUCT.md's princip 4 siger vi rangerer producenternes aabenhed, ikke
 * deres kvalitet. Et yderpunkt er ikke en dom: den tungeste robot er ikke
 * "bedre" end den letteste, den er bare tungest. Fire MAALTE kendsgerninger,
 * udledt her af de samme felter kortene selv viser - aldrig skrevet i haanden.
 *
 * Uafgjort loeses DETERMINISTISK: alfabetisk paa slug, samme regel som
 * vaegtklassernes kortsortering allerede bruger. Efterproevet 24.08.2026 paa
 * alle 46 datafiler: ingen af de fire har i praksis et uafgjort resultat
 * (letteste=5,6 kg, tungeste=85 kg, hurtigste=8 m/s, laengste driftstid=8 t,
 * alle enkeltvise), men reglen staar, saa en fremtidig datarettelse ikke kan
 * give et tilfaeldigt resultat.
 */

/** Feltets vaerdi omregnet til dimensionens BASISenhed (kg, m/s, s), eller
 *  null. Bruges KUN til at SAMMENLIGNE — visningen bruger post's egne tal og
 *  enhed uroert (regel 5: "20~25 cm" er ikke sit gennemsnit). En ukendt enhed
 *  taeller ikke med; vi gaetter aldrig en dimension. */
function feltIBasis(post) {
  if (!post || typeof post === 'string') return null;
  if (typeof post.vaerdi === 'string') return null;
  const v = post.min !== undefined ? (post.min + post.maks) / 2 : post.vaerdi;
  if (typeof v !== 'number' || Number.isNaN(v)) return null;
  const e = ENHEDER[post.enhed];
  if (!e) return null;
  return v * e[1];
}

/** De fire yderpunkter og deres retning. Raekkefoelgen her er raekkefoelgen,
 *  forsiden viser dem i. */
const YDERPUNKT_SPEC = [
  { id: 'letteste', felt: 'egenvaegt', ikon: 'i-vaegt', retning: 'lav' },
  { id: 'tungeste', felt: 'egenvaegt', ikon: 'i-vaegt', retning: 'hoej' },
  { id: 'hurtigste', felt: 'hastighed', ikon: 'i-fart', retning: 'hoej' },
  { id: 'laengste_driftstid', felt: 'driftstid', ikon: 'i-driftstid', retning: 'hoej' },
];

/**
 * Returnerer op til fire poster { id, felt, ikon, robot, post }. Et yderpunkt
 * udelades helt, hvis INTET af de 46 datafiler oplyser feltet som et tal —
 * det sker ikke i dag, men skal ikke kunne kaste en fejl, hvis det gjorde.
 */
export function ekstremer(robotter) {
  return YDERPUNKT_SPEC.map((spec) => {
    const kandidater = robotter
      .map((robot) => ({ robot, basis: feltIBasis(robot.felter?.[spec.felt]) }))
      .filter((x) => x.basis !== null);
    if (!kandidater.length) return null;
    kandidater.sort((a, b) => (spec.retning === 'lav' ? a.basis - b.basis : b.basis - a.basis)
      || String(a.robot.slug).localeCompare(String(b.robot.slug)));
    const bedst = kandidater[0];
    return { ...spec, robot: bedst.robot, post: bedst.robot.felter[spec.felt] };
  }).filter(Boolean);
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
   * Forbeholdet som HAEVET TEGN. Samme sprog som kildemaerkets haevede
   * bogstav (afsnit 3 nedenfor): bogstavet peger paa en kilde, tegnet peger
   * paa et forbehold. Hele teksten staar i `title` (museklik) OG i
   * `.kunskaerm` (skaermlaeser) - ordet "Advarsel" forsvinder ikke, det
   * flytter fra en altid-synlig chip til skaermlaeserens tekst.
   *
   * Maalt 24. aug 2026 paa /da/-forsiden: 174 af 181 forbeholdschips viste
   * ordet "Advarsel", paa 41 af 46 kort. Naar alt advarer, advarer intet.
   * Rettelsen fra 21. aug (den lange saetning -> "Advarsel") er IKKE rullet
   * tilbage - den korte tekst staar stadig, nu i title og .kunskaerm.
   */
  function fnote(tekst) {
    return `<abbr class="forbehold forbehold--tegn" title="${attr(tekst)}">`
      + `<span aria-hidden="true">*</span>`
      + `<span class="kunskaerm">${esc(T.advarsel)}: ${esc(tekst)}</span></abbr>`;
  }

  /**
   * Selve tallet: operator, figur, enhed, interval, imperial og lastbetingelse.
   * Regel 5: et interval er ikke sit gennemsnit og saettes som et interval.
   *
   * `forbehold` (valgfri tekstliste) flettes sammen med en eventuel
   * lastbetingelse til ÉT haevet tegn - to tegn ved siden af hinanden ville
   * laeses som to forskellige fejl, og de hoerer alligevel til samme vaerdi.
   */
  function tal(post, { kilder = null, maerke = true, hvorhen = '', forbehold = [] } = {}) {
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
    const noter = [];
    if (post.ved_last !== undefined) {
      const ukendt = typeof post.ved_last === 'string' || tilstandAf(post.ved_last.vaerdi);
      noter.push(ukendt
        ? T.ved_last_ukendt
        : `${T.ved_last} ${nformat(post.ved_last.vaerdi)} ${post.ved_last.enhed ?? ''}`.trim());
    }
    noter.push(...forbehold);
    if (noter.length) ud += fnote(noter.join(' · '));
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
   *
   * `tabindex="-1"` (fund/FUND-detalje.md, opgave 2): maalt paa katalogsiden,
   * hvert kildemaerke var sit eget tab-stop - op til 4 pr. kort x 46 kort
   * betoed, at de foerste ~40 tab-tryk naaede ca. 5 kort, foer laeseren
   * overhovedet ramte et filter eller et andet kort. Linket forbliver et
   * RIGTIGT link (href, klikbart, i tilgaengelighedstraeet - en skaermlaeser,
   * der laeser sekventielt eller via "vis alle links", finder det stadig),
   * kun VEJEN dertil via Tab-tasten er lukket. Det er den samme afvejning,
   * WAI-ARIA anbefaler for et sekundaert link, der ikke skal konkurrere med
   * sidens primaere navigation om taste-fokus.
   */
  function kildemaerke(post, kilder, hvorhen = '') {
    if (!kilder) return '';
    const k = kilder.for(post);
    if (!k) return '';
    const sek = k.sekundaer ? ' kildemaerke--sek' : '';
    const titel = k.sekundaer ? t('kilde_sek_forklaring') : T.kilde_primaer;
    return `<a class="kildemaerke${sek}" href="${attr(hvorhen)}#kilde-${attr(k.bogstav)}"`
      + ` tabindex="-1" title="${attr(titel)}">${esc(k.bogstav)}</a>`;
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
    // Et tal-felt faer sit forbehold flettet IND i tal()'s eget haevede tegn
    // (lastbetingelse + advarsel bliver ét tegn, ikke to). De andre grene
    // faar deres forbehold sat ind i vaerdispannet lige nedenfor.
    const erTal = !t0 && spec?.art !== 'jaNej' && spec?.art !== 'liste'
      && typeof post.vaerdi !== 'string';
    let ud;
    if (t0) ud = tilstand(t0, { kilder, post, hvorhen });
    else if (spec?.art === 'jaNej') ud = jaNej(post.vaerdi, { kilder, post, hvorhen });
    else if (spec?.art === 'liste') ud = tekstvaerdi(post.vaerdi.join(', '), { kilder, post, hvorhen });
    else if (typeof post.vaerdi === 'string') ud = tekstvaerdi(post.vaerdi, { kilder, post, hvorhen });
    else ud = tal(post, { kilder, hvorhen, forbehold: kunVaerdi && post.advarsel ? [post.advarsel] : [] });

    if (kunVaerdi) {
      // Feltet varierer mellem robottens modelvarianter (fund/FUND-detalje.md,
      // opgave 4c): kataloget viser kun ÉT tal pr. celle, saa markoeren
      // fortaeller laeseren, at det tal ikke er hele historien, uden at
      // fortraenge tallet selv med en fuld variantliste (den staar paa
      // robottens egen side, se robot.mjs' varianter()). Klassen saettes paa
      // det aabne <span class="v ...">, saa den er en del af selve vaerdien.
      if (post.varianter) {
        ud = ud.replace(/^(<span class="v[^"]*)"/,
          `$1 maerke--varianter" title="${attr(t('varianter_forklaring'))}"`);
      }
      // Maerket saettes IND i vaerdiens .v-spann, ikke efter det: striben er
      // column-reverse, og et maerke placeret som en EGEN sideordnet node
      // blev loeftet op OVER vaerdien som cellens foerste, mest synlige led
      // (maalt i browseren 24. aug 2026). Alle grene ovenfor slutter paa
      // </span>, saa indsaetningen lige foer det er stabil.
      if (post.advarsel && !erTal) {
        ud = ud.replace(/<\/span>$/, `${fnote(post.advarsel)}</span>`);
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
   *
   * `sorterAnvendelse()` (fund/FUND-detalje.md, opgave 4c): raa YAML-
   * raekkefoelge blev tidligere sendt uroert videre, saa to robotter med
   * de SAMME kategorier i modsat raekkefoelge i deres respektive filer fik
   * forskellige, uens-udseende maerkeraekker paa deres egne sider - praecis
   * den tilfaeldige "hovedkategori efter skrivevane", L27 blev besluttet for
   * at undgaa. skema.mjs' `sorterAnvendelse` er den kanoniske orden, allerede
   * skrevet til formaalet, men aldrig kaldt herfra foer nu.
   */
  function anvendelse(robot) {
    const a = robot?.anvendelse;
    const raa = a === undefined ? { vaerdi: 'ikke_oplyst' } : (typeof a === 'string' ? { vaerdi: a } : a);
    const vaerdier = sorterAnvendelse((Array.isArray(raa.vaerdi) ? raa.vaerdi : [raa.vaerdi])
      .map((v) => tilstandAf(v) ?? v));
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
      // arvet_fra manglede her (kontrakten i robot.mjs' hoved dokumenterer
      // feltet, men denne funktion returnerede det aldrig) - robot.mjs'
      // anvendelseBlok() laeste derfor ALTID undefined, og arve-blokken
      // kunne ikke vises, uanset hvad en YAML-fil faktisk sagde.
      arvet_fra: (typeof raa.arvet_fra === 'string' && raa.arvet_fra.trim()) ? raa.arvet_fra : null,
      erIkkeOplyst: vaerdier.length === 1 && vaerdier[0] === 'ikke_oplyst',
      navn: (v) => (v === 'ikke_oplyst' ? T.tilstand_ikke_oplyst : t('anvendelse_' + v)),
      /** Maerkerne som de staar paa kortet. `anvendelse__maerke--<vaerdi>` er
       *  en BEM-modifikator pr. kategori, oven i den generiske .maerke, som
       *  bevis paa at raekkefoelgen nu er den samme paa tvaers af robotter
       *  med samme kategorisaet (opgave 4c) - selve udseendet kommer stadig
       *  udelukkende fra .maerke/.maerke--tom. */
      maerker() {
        return `<ul class="maerker">` + vaerdier.map((v) => (v === 'ikke_oplyst'
          ? `<li class="maerke maerke--tom anvendelse__maerke--${attr(v)}">${esc(T.tilstand_ikke_oplyst)}</li>`
          : `<li class="maerke anvendelse__maerke--${attr(v)}">${esc(t('anvendelse_' + v))}</li>`)).join('') + `</ul>`;
      },
    };
  }

  /* --- 6. noegletalsstriben ---------------------------------------------- */

  /**
   * AENDRET 21.08.2026: hastighed ind, CE ud.
   * AENDRET 24.08.2026 (JPK): ip_klasse ud. Maalt over alle 46 datafiler:
   * egenvaegt 37/46, nyttelast_gaaende 36/46, hastighed 36/46, driftstid
   * 36/46 — mod ip_klasse's 23/46 (JPK's eget tal, 22/46, laa taet paa;
   * begge viser samme konklusion). En femte celle, der staar tom paa
   * over halvdelen af kortene, laerer laeseren at springe den over. De fire
   * tilbageblevne daekker alle over trefjerdedele, og striben paa kortet
   * bliver dermed FIRE celler (2x2 i den kompakte udgave), ikke fem.
   *
   * CE staar i sin egen EU-markering, hvor "ikke oplyst" er selve pointen
   * frem for et hul.
   */
  const STRIBE = [
    ['egenvaegt', 'i-vaegt'],
    ['nyttelast_gaaende', 'i-nyttelast'],
    ['hastighed', 'i-fart'],
    ['driftstid', 'i-driftstid'],
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
   * Maskineriet staar i modulets billedafsnit ovenfor. Her bindes kun sproget
   * paa. Én robot uden `billede:` faar den tomme plade med en grund skrevet
   * ud — maalt 21.08.2026: 46 af 46, fordi assets/ er tom, og det er den
   * aerlige tilstand.
   */
  function billedTekst(robot, b) {
    return {
      intet: T.billede_intet,
      grund: t('billede_ingen_egen'),
      delt: T.billede_delt,
      delt_forklaring: T.billede_delt_forklaring,
      alt: billedAlt(robot, b),
      ophav: {
        eget_foto: t('billede_ophav_eget_foto'),
        silhuet: t('billede_ophav_silhuet'),
        fabrikant: T.billede_uden_tilladelse,
      },
    };
  }

  /**
   * Alternativ tekst. Dataskriverens egen `alt:` vinder altid. Uden den siger
   * en silhuet, at den ER en silhuet: en teknisk tegning efter maal er ikke det
   * samme syn som et fotografi, og en skaermlaeserbruger skal have samme
   * oplysning som en seende.
   */
  function billedAlt(robot, b) {
    if (b?.alt) return b.alt;
    const navn = robot?.navn ?? '';
    if (b?.ophav === 'silhuet') return tf('billede_alt_silhuet', { model: navn });
    return navn;
  }

  function billede(robot, op = '', { stor = false, eager = false } = {}) {
    const b = laesBillede(robot);
    if (!b) return tomPlade(robot, op, stor);
    return billedledHTML({
      b, op, stor, eager, tekst: billedTekst(robot, b),
    });
  }

  /** Billedets sandhed under billedet. Tom liste, naar pladen er tom. */
  function billedsandhed(robot) {
    const b = laesBillede(robot);
    return billedLinjer(b, billedTekst(robot, b));
  }

  /* --- 8b. MAALEPLADEN ----------------------------------------------------
   * Den tomme plade var 46 gange den samme graa flade med den samme saetning
   * paa. Maalt 21.08.2026 i dist/da/index.html: 46 tomme plader, 0 <img>, og
   * saetningen "Vi har ikke selv fotograferet modellen ..." stod 92 gange -
   * én gang i pladen og én gang i kortets fodnote, paa hvert eneste kort.
   *
   * Naar vi ikke har et fotografi, har vi stadig MAAL. 31 af 46 robotter
   * oplyser baade laengde og hoejde. De faar deres maalte omrids tegnet i
   * FAELLES MAALESTOK: hele billedfeltets bredde svarer til 1900 mm paa alle
   * kort, saa to plader kan sammenlignes med oejet uden en tabel. Det er
   * silhuetmappens egen pointe (assets/silhuetter/LÆSMIG.md): seks
   * pressefotos fortaeller intet om, hvilken robot der er stoerst.
   *
   * Omridset er en KASSE, ikke en tegning af maskinen. Vi kender laengden og
   * hoejden; vi kender ikke formen. En kasse paastaar praecis det, vi har
   * kilde paa - og den kan ikke forveksles med en afbildning af produktet.
   * Det her er derfor IKKE beslutningen Aa3 (maaltro silhuetter pr. robot);
   * det er den aerlige mellemtilstand, indtil billederne findes.
   *
   * De 15 robotter uden baade laengde og hoejde beholder hullet — via samme
   * billedledHTML(null)-vej som et robotpost uden `billede:`-felt overhovedet,
   * saa der er ét sted, ikke to, der skriver den tomme plades markup og grund.
   */
  const PLADE_MM_BRED = 1900;                      /* billedfeltets bredde i mm */
  const PLADE_MM_HOEJ = PLADE_MM_BRED * 10 / 16;   /* feltet er 16:10 = 1187,5 */

  /** Feltets vaerdi i millimeter, eller null hvis den ikke kan tegnes. */
  function iMillimeter(post) {
    if (!post || typeof post === 'string') return null;
    if (typeof post.vaerdi === 'string') return null;
    const v = post.min !== undefined ? (post.min + post.maks) / 2 : post.vaerdi;
    if (typeof v !== 'number' || !(v > 0)) return null;
    if (post.enhed === 'mm') return v;
    if (post.enhed === 'cm') return v * 10;
    if (post.enhed === 'm') return v * 1000;
    return null;
  }

  /** Vaerdien som den staar i datafilen, til skaermlaeseren. Enheden foelger med. */
  const somSkrevet = (post) => (post.min !== undefined
    ? `${nformat(post.min)}–${nformat(post.maks)} ${post.enhed}`
    : `${nformat(post.vaerdi)} ${post.enhed}`);

  /** Tegner den maalte plade, eller falder tilbage til den almindelige tomme plade. */
  function tomPlade(robot, op = '', stor = false) {
    const lp = robot.felter?.laengde;
    const hp = robot.felter?.hoejde;
    const L = iMillimeter(lp);
    const H = iMillimeter(hp);

    if (L === null || H === null) {
      return billedledHTML({ b: null, op, stor, tekst: billedTekst(robot, null) });
    }

    const bw = (L / PLADE_MM_BRED * 100).toFixed(2);
    const bh = (H / PLADE_MM_HOEJ * 100).toFixed(2);
    // Titelfeltet NAVNGIVER de to maal ("LÆNGDE × HØJDE") OG viser
    // producentens egne tal, som skrevet i kilden — som paa et tegningsark.
    // En bar kasse uden ét eneste tal blev laest som en renderingsfejl (JPK,
    // 24. aug 2026); tallene er det, der goer pladen laesbar som en bevidst,
    // opmaalt tegning i stedet for et brudt billede.
    const navne = `${T.felt_laengde} × ${T.felt_hoejde}`;
    const maaltal = `${somSkrevet(lp)} × ${somSkrevet(hp)}`;
    const laest = `${T.felt_laengde} ${somSkrevet(lp)}, ${T.felt_hoejde} ${somSkrevet(hp)}`;
    const klasser = stor ? 'billedled billedled--maal billedled--stor' : 'billedled billedled--maal';
    return `<div class="${klasser}"><div class="maalplade">`
      + `<span class="net" aria-hidden="true"></span>`
      + `<span class="jord" aria-hidden="true"></span>`
      + `<span class="kasse" style="--bw:${bw}%;--bh:${bh}%" aria-hidden="true"></span>`
      + `<span class="titelfelt" aria-hidden="true">`
      + `<span class="etiket">${esc(navne)}</span>`
      + `<span class="tal">${esc(maaltal)}</span>`
      + `</span>`
      + `<span class="kunskaerm">${esc(T.billede_intet)}. ${esc(laest)}.</span>`
      + `</div></div>`;
  }

  /* --- 9. robotkortet ---------------------------------------------------- */

  /**
   * Kortet har ingen doer ud af sitet: ingen pris, ingen knap, ingen stjerner
   * og ingen "featured". Navnet staar UNDER billedet, ikke paa det.
   */
  /**
   * op  = stien tilbage til dist/ (til billeder og aktiver)
   * til = stien til robotmapperne fra den side, kortet staar paa
   */
  function kort(robot, {
    op = '', til = '', kilder = null, eager = false,
  } = {}) {
    const k = kilder ?? lavKilder(robot);
    const hvorhen = `${til}${robot.slug}/`;
    const a = anvendelse(robot);
    const antalKilder = k.antal;

    // Designsystemets regel: bogstaverne staar paa kortet KUN naar posten har
    // mere end én kilde.
    const stribeKilder = antalKilder > 1 ? k : null;

    return `<article class="kort">
${billede(robot, op, { eager })}
<div class="kort-krop">
<div class="kort-hoved">
<p class="kort-ophav"><span class="prod">${esc(robot.producent)}</span>`
      + `<span class="land">${esc(land(robot.producentland))}</span>`
      + `<span class="status status--${attr(robot.status)}">${esc(T['status_' + robot.status])}</span></p>
<h3 class="kort-navn"><a href="${attr(hvorhen)}">${esc(robot.navn)}</a></h3>
</div>
${stribe(robot, { kompakt: true, kilder: stribeKilder, hvorhen })}
${a.maerker()}
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
${raekke(`<span class="v v-tal"><b class="num">14</b><span class="enhed">kg</span><a class="kildemaerke" href="#tegn" tabindex="-1">A</a></span>`, t('kilde_maerke_forklaring'))}
${raekke(`<span class="v v-tal"><b class="num">1100</b><span class="enhed">mm</span><a class="kildemaerke kildemaerke--sek" href="#tegn" tabindex="-1">B</a></span>`, t('kilde_sek_forklaring'))}
</dl>
<p class="t-lille">${esc(T.sammenlign_advarsel)}</p>
</section>`;
  }

  return {
    // --- kontrakten ---
    tal, tilstand, kildemaerke, kilder: lavKilder, vaegtklasse, anvendelse,
    // --- bekvemmeligheder ---
    esc, attr, ikon, land, felt, jaNej, tekstvaerdi, kildeliste, stribe,
    ceTilstand, billede, billedsandhed, billedTekst, kort, tegnforklaring, nformat, dformat, operator,
    saetInd, manglendeLande, STRIBE_FELTER: STRIBE.map(([n]) => n), VAEGTKLASSER, EAGER_KORT_ANTAL,
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
 * oeverst og sidefoden.
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
    // spor/lysbyg: sammenligningssiden foelger katalogsiden i navigationen,
    // samme raekkefoelge mockuppens baand havde (prototype/retning-lys/*.html).
    ['sammenligning/', T.nav_sammenligning],
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
${kropp}
<footer class="fod">
<div class="rum">
<p class="haard">${esc(T.ingen_forhandler)}</p>
<p>${esc(T.taethed_forklaring)}</p>
<p>${esc(T.udgiver)} · <a href="${attr(`${op}${andet}/${sti}`)}" hreflang="${attr(andet)}" lang="${attr(andet)}">${esc(T.andet_sprog)}</a></p>
</div>
</footer>
${script ? `<script src="${op}${attr(script === true ? 'katalog.js' : script)}" defer></script>` : ''}
</body>
</html>
`;
}
