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
 * taethed, tegnforklaring, vaegtklasser), som skabelonerne maa bruge, men
 * ikke skal. vaegtklasser (L50) er vaegtklasse()'s flertalsversion - svarer
 * et SAET klasser for et vaegtspaend i stedet for én streng - og bruges i
 * dag kun af katalog.mjs; de skabeloner der forudsaetter praecis én klasse
 * (forside, robotside) laeser fortsat vaegtklasse() uaendret.
 *
 *   ctx.i18n  T         opslag der FEJLER paa en manglende noegle (streng)
 *             t(n)      bloedt opslag: en manglende noegle bliver til «noegle»
 *                       paa siden og taelles op til sidst af bygget
 *             tf(n,o)   som t(), men saetter {n}-pladsholdere ind
 *   ctx.sprog 'da' | 'en'
 *   ctx.url   { dybde, sti, op }   sti er uden sprogpraefiks, fx 'robotter/'
 *
 * Skallen (<head>, daekket oeverst, skip-link, hreflang, fod) skrives af
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
  erGyldighedsforbehold, forbeholdsArt,
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
 * regnes relativt og retningsloest — |forhold - maal| / maal — saa et
 * for smalt portraet (yufan-lingmao-cyvet, 0,66) og et for bredt liggende
 * billede (unitree-laikago, 2,34) behandles ens: begge mister noget af
 * robotten under cover, saa begge skal have contain. At skelne retning ville
 * kraeve en begrundelse for hvorfor den ene slags beskaering er vaerre end
 * den anden, og der er ingen — cover skaerer poter af i begge retninger.
 *
 * `maal`/`tolerance` (spor/plader, 27. aug 2026): generaliseret fra det
 * oprindelige katalogkort-specifikke 16:10-tjek, saa den SAMME maalte
 * graense (25 %, se SIDEFORHOLD_TOLERANCE) kan genbruges mod en ANDEN
 * rammes eget sideforhold — fx forsidens yderpunkt-plade (4:3, bredere end
 * katalogkortet), i stedet for at opfinde en ny graense pr. ramme. Ingen
 * kaldested aendrer sig: begge parametre har standardvaerdier, der giver
 * PRAECIS den samme funktion som foer denne aendring.
 */
export function billedAutoPlade(fil, rod = ROD, maal = SIDEFORHOLD_MAAL, tolerance = SIDEFORHOLD_TOLERANCE) {
  if (typeof fil !== 'string' || fil.trim() === '') return false;
  const dim = dimAfFil(path.join(path.resolve(rod), 'assets', fil));
  if (!dim || !dim.w || !dim.h) return false;
  const forhold = dim.w / dim.h;
  const afvigelse = Math.abs(forhold - maal) / maal;
  return afvigelse > tolerance;
}

/**
 * Yderpunkt-pladens eget sideforhold (spor/plader, 27. aug 2026). Sat i
 * assets/generator.css ".yderpunkt .billedled{aspect-ratio:4/3}" — de to
 * tal SKAL vaere ens, ellers regner billedAutoPlade() mod en ramme, siden
 * ikke laengere bruger. 4:3 (mod katalogkortets 16:10) er valgt, fordi det
 * er den stoerste (tætteste-paa-kvadrat) ramme, der stadig lader tre af de
 * fire faktiske yderpunkt-fotografier (deep-robotics-lynx-s10 1,333 = 0 %
 * afvigelse, yobotics-y10 1,212 = 9,1 %, microrobotech-movenew-p1 1,409 =
 * 5,7 %) blive under cover uden --plade — kun galileo-s1-w (1,779 = 33,4 %
 * afvigelse fra 4:3) rammes og faar contain. Maalt med et engangsscript paa
 * de fire filers egne byte-header-dimensioner, ikke gaettet.
 */
export const YDERPUNKT_FORHOLD = 4 / 3;

/**
 * Robottens billedpost i den form, skabelonerne bruger — eller null.
 * Null betyder den tomme plade, og den er en aerlig tilstand, ikke en fejl.
 *
 * `forhold` (spor/plader, 27. aug 2026): hvilken rammes sideforhold det
 * automatiske plade-tjek skal regne afvigelsen imod. Standard er
 * SIDEFORHOLD_MAAL (katalogkortets 16:10, uaendret adfaerd for alle
 * eksisterende kaldesteder). Forsidens yderpunkt-plade sender sin egen
 * ramme (YDERPUNKT_FORHOLD, 4:3) ind her via hjaelp.billede()'s samme
 * parameter, saa ÉT sted afgoer "passer billedet i DENNE ramme uden at
 * miste robotten under cover" — ikke to separate, potentielt divergerende
 * beregninger.
 *
 * `sprogkode` (spor/alt, 1. sep 2026): `b.alt` er siden R18 et
 * SPROGKORTLAGT objekt ({ da, en, … }), ikke en streng — en ny sprognoegle
 * er en noegle, ikke et nyt felt (CLAUDE.md's arkitekturregel). Uden
 * `sprogkode` er der intet at vaelge med, og `alt` bliver `null` (samme
 * sikre tomhed som foer R18, og uaendret for de kaldesteder i denne fil,
 * der laeser `robot.billede.alt` direkte i stedet, se billedAlt()).
 * Sendes `sprogkode` med, vaelges NOEJAGTIGT den noegle — aldrig et andet
 * sprogs tekst som fallback, for saa ville en skaermlaeser paa /en/ faa
 * dansk prosa oplaest.
 */
export function laesBillede(robot, rod = ROD, { forhold = SIDEFORHOLD_MAAL, sprogkode } = {}) {
  const b = robot?.billede;
  if (!b || typeof b !== 'object' || Array.isArray(b)) return null;
  if (typeof b.fil !== 'string' || b.fil.trim() === '') return null;
  const tekst = (v) => (typeof v === 'string' && v.trim() !== '' ? v : null);
  // `b.alt` er enten en almindelig streng (aeldre form, bevaret for
  // bagudkompatibilitet) eller et sprogkortlagt objekt. Er det et objekt,
  // vaelges kun `sprogkode`-noeglen — ingen anden-sprogs-fallback, se noten
  // ovenfor.
  const altRaa = (b.alt && typeof b.alt === 'object' && !Array.isArray(b.alt))
    ? (sprogkode ? b.alt[sprogkode] : null)
    : b.alt;
  // Eksplicit `plade: ja`/`nej` i YAML'en vinder altid, i begge retninger —
  // et felt, en dataskriver bevidst har sat, skal ikke kunne overstyres af
  // en maaling, den ikke kan se. Er feltet IKKE sat, afgoer billedPlade()
  // stadig silhuetter (ophav==='silhuet'); for alt andet traeder det
  // automatiske sideforhold-tjek til, saa et fotograf ikke laengere kraever
  // et huskefelt for at faa den rigtige beskaering.
  const eksplicitPlade = jaNejAf(b.plade);
  const plade = eksplicitPlade !== null
    ? eksplicitPlade
    : (billedPlade(b) || billedAutoPlade(b.fil, rod, forhold));
  return {
    fil: b.fil,
    ophav: tekst(b.ophav),
    kilde: tekst(b.kilde),
    hentet: tekst(b.hentet),
    alt: tekst(altRaa),
    note: tekst(b.note),
    delt_med: tekst(b.delt_med),
    plade,
    pos: tekst(b.pos),
  };
}

/* =============================================================== skalering
   spor/foto, 1. sep 2026. Foer denne dato fandtes der INGEN skalering: hvert
   <picture> pegede paa originalen og kun den, og sammenligningssidens 74px
   chip hentede microrobotech-movenew-p1.jpg paa 4096 px og 329 KB (maalt).

   Filerne laves IKKE her. `tools/build.mjs` er afhaengighedsfri, og Node kan
   ikke skalere et billede uden et bibliotek — derfor ligger generatoren i
   maalevaerktoej/skaler-fotos.mjs, uden for repoet, praecis som Playwright.
   Bygget SER kun de faerdige filer paa disken.

   Konventionen er den, `billedAlternativer` allerede brugte ("samme filnavn,
   anden endelse"), udvidet med ét led:  <filnavn>-<bredde>w.<endelse>.
   Kontrolleret: nul af de 76 originaler matcher `-\d+w\.`, saa suffikset kan
   ikke kollidere med et originalnavn.

   VAERNET ER UAENDRET: kun filer, der FINDES paa disken, bliver til en kilde.
   Findes ingen skalerede udgaver, opfoerer funktionen sig noejagtigt som foer
   — og en side uden derivater falder tilbage til originalen og er stadig
   rigtig. Der bygges aldrig en srcset til en fil, ingen har lavet.
   ======================================================================== */

/** `<navn>-<bredde>w.<endelse>` — én regex, ét sted. */
const SKALA_MOENSTER = /^(.*)-(\d+)w(\.[a-z0-9]+)$/i;

/**
 * Index over de skalerede udgaver: basisnavn -> endelse -> [[bredde, fil], …]
 * sorteret STIGENDE efter bredde. Cachet pr. rod, som billedFiler(), fordi et
 * byg ellers ville gaa hele filsaettet igennem én gang pr. billedled (494 led
 * x 610 filer).
 */
const _billedSkala = new Map();
function billedSkala(rod = ROD) {
  const noegle = path.resolve(rod);
  if (_billedSkala.has(noegle)) return _billedSkala.get(noegle);
  const index = new Map();
  for (const f of billedFiler(rod)) {
    const m = SKALA_MOENSTER.exec(f);
    if (!m) continue;
    const [, basis, bredde, endelse] = m;
    if (!index.has(basis)) index.set(basis, new Map());
    const pr = index.get(basis);
    const e = endelse.toLowerCase();
    if (!pr.has(e)) pr.set(e, []);
    pr.get(e).push([Number(bredde), f]);
  }
  for (const pr of index.values()) for (const liste of pr.values()) liste.sort((a, b) => a[0] - b[0]);
  _billedSkala.set(noegle, index);
  return index;
}

/** Ryd skala-indekset. Kun til test — det foelger billedFiler()s cache. */
export function glemBilledSkala() { _billedSkala.clear(); }

/**
 * <source>-kilderne til et <picture>. Kun formater, der FINDES som fil i
 * assets/, bliver til en kilde. En srcset til en fil, ingen har lavet, er en
 * tom paastand — browseren falder ganske vist tilbage til <img>, men saa staar
 * der en linje i HTML, der lyver om, hvad projektet har.
 *
 * Returnerer `[fil, mimetype, bredde|null]`. Tredje led er NYT (spor/foto) og
 * er bevidst lagt BAGEST: `tools/skabelon/sammenligning.mjs:106` destrukturerer
 * `([f, type]) => [sti(f), type]` og er dermed uroert af tilfoejelsen.
 *
 * RAEKKEFOELGEN ER EN BESLUTNING, ikke en tilfaeldighed. Inden for hver type
 * staar den SMALLESTE foerst. Grunden er sammenligningssiden: dens celler
 * tegnes af assets/sammenligning.js, som skriver én <source> pr. post og lader
 * browseren vaelge den FOERSTE kilde, hvis type den understoetter — altsaa
 * altid den foerste i denne liste. Chippen er maalt til 74x56 css-px, saa
 * 240w (som daekker den helt op til dpr 3) er praecis det rigtige valg dér.
 * Vender nogen listen om, henter sammenligningssiden 1400px-udgaven ind i en
 * 74px-celle.
 */
export function billedAlternativer(fil, rod = ROD) {
  const filer = billedFiler(rod);
  const skala = billedSkala(rod);
  const uden = String(fil).replace(/\.[^./]+$/, '');
  const pr = skala.get(uden);
  const ud = [];
  for (const [endelse, type] of BILLEDE_ALTERNATIVER) {
    for (const [bredde, kandidat] of (pr?.get(endelse) ?? [])) {
      if (kandidat !== fil) ud.push([kandidat, type, bredde]);
    }
    const fuld = `${uden}${endelse}`;
    if (fuld !== fil && filer.has(fuld)) {
      // Fuldstoerrelsen i et moderne format er ikke noget, generatoren laver
      // (den skriver kun -<bredde>w-filer), men vejen har altid vaeret der og
      // bliver staaende. Bredden laeses af filens egen byte-header, saa den
      // kan staa i den samme srcset som de skalerede; kan den ikke laeses,
      // sendes null videre og billedledHTML afgoer, hvad der saa er aerligt.
      const dim = dimAfFil(path.join(path.resolve(rod), 'assets', fuld));
      ud.push([fuld, type, dim?.w ?? null]);
    }
  }
  return ud;
}

/**
 * `sizes` til de to rammer, billedledHTML tegner. MAALT 1. sep 2026 med
 * maalevaerktoej/_foto-maal.mjs paa det byggede site (css-px for .billedled):
 *
 *   viewport      390   600   760   900  1100  1440
 *   robotsidens led 358   559   708   415   511   679     (spalten braekker ~860)
 *   forsidens kort  356   262   336   401   495   312
 *   katalogkortet   179     -     -     -     -    270
 *
 * STOR foelger heroen: 94vw under braekket (708/760 = 93,2 %, 559/600 = 93,2 %,
 * 358/390 = 91,8 %), 48vw over (679/1440 = 47,2 %).
 *
 * KORT er ÉN vaerdi for to rammer med forskellig bredde, og det er et bevidst
 * valg frem for et nyt parameter i alle kaldesteder: forskellen forsvinder i
 * stigens grovhed. Katalogkortet ved 390px har brug for 179 px og faar en
 * `sizes` paa 359 — men naeste trin over 179 er alligevel 240w og over 359 er
 * det 560w, saa over-hentningen er ÉT trin (3,5 KB -> 11,3 KB paa den
 * tungeste fil), og kortene er lazy. Skal det snaevres ind, tager
 * billedledHTML et `sizes`-argument; intet kaldested skal aendres for at faa
 * den nuvaerende opfoersel.
 */
export const BILLED_SIZES = {
  stor: '(max-width: 860px) 94vw, 48vw',
  kort: '(max-width: 700px) 92vw, (max-width: 1200px) 46vw, 340px',
};

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
 *   sizes  overstyrer `sizes`-attributten. Standard er BILLED_SIZES.stor /
 *          .kort, som er MAALT (se der). Findes kun, saa en ramme med en
 *          anden bredde kan sige det uden at aendre de andre kaldesteder
 */
export function billedledHTML({
  b, op = '', stor = false, eager = false, tekst, rod = ROD, sizes = null,
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

  /* Én <source> pr. type med ALLE bredder i samme srcset — ikke én <source>
     pr. fil. Browseren vaelger den foerste <source>, hvis type den forstaar,
     og laeser derefter srcset+sizes; stod hver bredde som sin egen <source>,
     ville den foerste vinde og resten vaere doed markup.

     Bredderne skrives som w-descriptorer. Reglen i HTML er, at en srcset
     enten har w-descriptorer paa ALLE poster eller paa ingen — derfor
     filtreres poster uden kendt bredde fra, saa snart bare én har en. Har
     INGEN post en bredde (fx en silhuet, hvor der ikke findes derivater),
     skrives noejagtigt den samme linje som foer denne aendring: en bar srcset
     uden sizes. Det er faldskaermen: mangler de skalerede filer, taber siden
     kun besparelsen, aldrig billedet. */
  const prType = new Map();
  for (const [f, type, bredde] of billedAlternativer(b.fil, rod)) {
    if (!prType.has(type)) prType.set(type, []);
    prType.get(type).push([f, bredde]);
  }
  const sizesVaerdi = sizes ?? (stor ? BILLED_SIZES.stor : BILLED_SIZES.kort);
  const kilder = [];
  for (const [type, poster] of prType) {
    const medBredde = poster.filter(([, w]) => Number.isFinite(w) && w > 0);
    const brug = medBredde.length ? medBredde : poster;
    const srcset = brug.map(([f, w]) => (medBredde.length ? `${sti(f)} ${w}w` : sti(f))).join(', ');
    kilder.push(`<source srcset="${attr(srcset)}"${
      medBredde.length ? ` sizes="${attr(sizesVaerdi)}"` : ''} type="${attr(type)}">`);
  }
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
<!-- Tre-tilstandsmaerkerne (3.6, spor/fundament, L54/L57 / MANIFEST §"Tre-
     tilstandsreglen, tegnet"). Ingen unicode-glyffer, ingen emoji. Delte
     .ikon-standarden (fill:none, stroke:currentColor) daekker konturerne;
     de to fyldte former (i-ja, i-nul's prik) saetter fill/stroke direkte
     paa elementet, saa de vinder over den nedarvede fill:none uden at
     roere .ikon-klassen. Farven ("fuldt blaek" / "stoev-blaek") er IKKE
     hardkodet her - den kommer fra brugsstedets color, som i alle de
     andre symbolerne. Samme 4,4/15,2-kvadrat som i-hul, saa de fire
     maerker og den eksisterende "ikke oplyst"-firkant deler stoerrelse. -->
<symbol id="i-ja" viewBox="0 0 24 24"><path d="M4.4 4.4h15.2v15.2H4.4z" fill="currentColor" stroke="none"/></symbol>
<symbol id="i-nej" viewBox="0 0 24 24"><path d="M4.4 4.4h15.2v15.2H4.4z"/><path d="M5.8 5.8 18.2 18.2"/></symbol>
<symbol id="i-nul" viewBox="0 0 24 24"><path d="M4.4 4.4h15.2v15.2H4.4z"/><circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none"/></symbol>
<symbol id="i-ioplyst" viewBox="0 0 24 24"><path d="M4.4 4.4h15.2v15.2H4.4z" stroke-dasharray="3.2 3.2"/></symbol>
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

/**
 * Reducerer ét talfelt - der kan vaere et enkelt tal ELLER et interval
 * ({min, maks}) - til ÉT centraltal (midtpunktet for et interval).
 *
 * HVORFOR vi overhovedet reducerer: nogle beregninger kan pr. definition kun
 * arbejde med ét tal ad gangen - en grov vaegtklasse (`vaegtIKg`), en
 * tvaers-af-enheder-sammenligning til et yderpunkt (`feltIBasis`), eller en
 * skalering af en maalt silhuet i millimeter (`iMillimeter`). Midtpunktet er
 * det mindst vilkaarlige valg, naar vi alligevel er tvunget til ét tal.
 *
 * MAA bruges til: intern sortering, klassificering og sammenligning, hvor
 * resultatet ALDRIG vises for laeseren som et selvstaendigt tal.
 *
 * MAA IKKE bruges til at VISE et interval. Regel 5 og L47 er, at et spaend
 * vises som producentens eget "20-25 cm", aldrig som "22,5 cm" - et tal
 * producenten aldrig skrev. Visning laeser `post.min`/`post.maks` direkte
 * (se fx `somSkrevet()` laengere nede) og kalder aldrig denne funktion.
 *
 * Var TRE selvstaendige kopier af samme regning (side.mjs, foer dette punkt:
 * ca. linje 514, 552 og 1204) - projektets dyreste tilbagevendende fejl
 * (L30, Aa12, KRITIK-4 fund 2) er netop at saadanne kopier skrider fra
 * hinanden ved den fjerde. Samlet her, saa der kun er ét sted at rette.
 */
export function centralVaerdi(post) {
  return post.min !== undefined ? (post.min + post.maks) / 2 : post.vaerdi;
}

/** Omregningsfaktor til kg, eller null hvis enheden ikke er en vaegt vi
 *  kender. KUN kg/g accepteres her - `ton`/`lb`/`oz` findes i ENHEDER, men
 *  egenvaegt-feltet er valideret til kun at bruge kg/g (se validate.mjs), saa
 *  en tredje enhed her ville vaere et datafejlsymptom, ikke en gyldig vaegt.
 *  Ét sted for denne regel, brugt af baade vaegtIKg og vaegtEndepunkterIKg. */
function vaegtFaktor(enhed) {
  if (enhed === 'kg') return 1;
  if (enhed === 'g') return 0.001;
  return null; // ukendt/uventet enhed taeller ikke som oplyst vaegt
}

/** Egenvaegten i kg, eller null hvis den ikke er oplyst som et tal. */
function vaegtIKg(robot) {
  const p = robot?.felter?.egenvaegt;
  if (!p || typeof p === 'string') return null;
  if (tilstandAf(p.vaerdi)) return null;
  const v = centralVaerdi(p);
  if (typeof v !== 'number' || Number.isNaN(v)) return null;
  const faktor = vaegtFaktor(p.enhed);
  return faktor === null ? null : v * faktor;
}

export function vaegtklasse(robot) {
  const kg = vaegtIKg(robot);
  if (kg === null) return 'ikke_oplyst';
  if (kg < VAEGTGRAENSER.under) return 'under_20';
  if (kg <= VAEGTGRAENSER.over) return '20_40';
  return 'over_40';
}

/** Egenvaegtens graenser i kg som {min, maks}, eller null hvis feltet ikke
 *  er et interval (se vaegtklasser() nedenfor for det tilfaelde), ikke er
 *  oplyst, eller staar i en enhed vaegtFaktor() ikke kender. */
function vaegtEndepunkterIKg(robot) {
  const p = robot?.felter?.egenvaegt;
  if (!p || typeof p === 'string') return null;
  if (p.min === undefined) return null; // intet interval
  if (tilstandAf(p.vaerdi)) return null;
  const faktor = vaegtFaktor(p.enhed);
  if (faktor === null) return null;
  return { min: p.min * faktor, maks: p.maks * faktor };
}

/**
 * L50 (JPK 27. aug 2026): en robot, hvis vaegtspaend daekker flere
 * vaegtklasser, skal vises i dem ALLE - en robot paa "13-50 kg" skal dukke
 * op baade naar laeseren filtrerer "under 20 kg" OG "over 40 kg". Denne
 * funktion svarer et SAET (som array, mindst ét element) i stedet for
 * vaegtklasse()'s ene streng. vaegtklasse() selv er IKKE aendret og
 * bruges stadig uaendret alle de steder, der forudsaetter praecis én klasse
 * (forsidens fremhaevelseslogik, den enkelte robotsides klassetekst) - kun
 * kataloget (spor/spaends eget filejerskab) laeser denne.
 *
 * Uden et interval (ét tal, eller "ikke oplyst") svarer denne funktion
 * PRAECIS det samme som vaegtklasse() ville, blot pakket i et array - der
 * er intet nyt at afgoere, naar der kun er ét tal.
 *
 * GRAENSETILFAELDE (mit valg for dette punkt, skrevet frem saa det kan
 * efterproeves og ikke bare antages):
 *
 *   Et spaend der SLUTTER praecis paa 20 (fx "10-20 kg") taeller med i
 *   BAADE under_20 og 20_40. Et spaend der STARTER praecis paa 40 (fx
 *   "40-60 kg") taeller med i BAADE 20_40 og over_40. Begrundelsen er
 *   symmetri med vaegtklasse()'s egen regel for ét enkelt tal (v=20 giver
 *   20_40, ikke under_20; v=40 giver 20_40, ikke over_40): graensetallet
 *   selv hoerer til den midterste klasse - og et spaend, hvis ene ende
 *   RAMMER graensen, mens den anden ende ligger klart paa den anden side,
 *   daekker begge de klasser, graensen skiller. Et spaend der ikke naar
 *   graensen (fx "10-19 kg") giver kun under_20, som foer.
 */
export function vaegtklasser(robot) {
  const grae = vaegtEndepunkterIKg(robot);
  if (!grae) return [vaegtklasse(robot)]; // intet interval - uaendret adfaerd
  const { min, maks } = grae;
  const klasser = [];
  if (min < VAEGTGRAENSER.under) klasser.push('under_20');
  if (maks >= VAEGTGRAENSER.under && min <= VAEGTGRAENSER.over) klasser.push('20_40');
  if (maks > VAEGTGRAENSER.over) klasser.push('over_40');
  return klasser;
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
  const v = centralVaerdi(post);
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
 * spor/yderpunkt (JPK's fund, 26. aug 2026): en OEVRE/NEDRE GRAENSE
 * (`<=`, `>=`, `<`, `>`) kan ikke baere et yderpunkt. "Qiuqiu SP1 <= 100 kg"
 * beviser kun at robotten ikke er tungere end 100 kg - den kan i praksis veje
 * 40, og "tungest" er derfor en paastand, dataene ikke baerer. Samme fejl som
 * haard begraensning 2 (opfind aldrig et tal), blot vendt om: her udledes en
 * paastand af et tal, der ikke er det.
 *
 * `~` og `±` er BEVIDST tilladt, og det er den ene undtagelse, briefet bad om
 * en begrundelse for: begge er et skoen OM ét kendt centraltal (Y10's
 * "± 5,6 kg" betyder ca. 5,6 kg, ikke "et sted under X"), ikke en graense uden
 * kendt tal. feltIBasis() bruger allerede centraltallet for et interval
 * (min+maks)/2 - `~`/`±` er den samme slags skoen, blot udtrykt som ét tal med
 * et forbehold i stedet for et interval. En stram ulighed derimod navngiver
 * ALDRIG et centraltal - kun en retning, tallet ligger i.
 */
const YDERPUNKT_OPERATOR_TILLADT = new Set(['~', '±']);
function operatorTilladt(op) {
  return !op || YDERPUNKT_OPERATOR_TILLADT.has(op);
}

/**
 * Returnerer op til fire poster { id, felt, ikon, robot, post }. Et yderpunkt
 * udelades helt, hvis INTET af de 46 datafiler oplyser feltet som et tal —
 * det sker ikke i dag, men skal ikke kunne kaste en fejl, hvis det gjorde.
 *
 * spor/yderpunkt: en kandidat skal OGSAA (a) baere et tal uden en graense-
 * operator (operatorTilladt ovenfor) og (b) have et rigtigt fotografi
 * (laesBillede !== null) - en afskaaret maaleplade i yderpunktets lille felt
 * er ikke information, den er en oedelagt streng (assets/generator.css afsnit
 * 1b er dimensioneret til katalogkortet, ikke til yderpunktfeltet).
 */
export function ekstremer(robotter) {
  return YDERPUNKT_SPEC.map((spec) => {
    const kandidater = robotter
      .map((robot) => {
        const post = robot.felter?.[spec.felt];
        return { robot, post, basis: feltIBasis(post) };
      })
      .filter((x) => x.basis !== null
        && operatorTilladt(x.post?.operator)
        && laesBillede(x.robot) !== null);
    if (!kandidater.length) return null;
    kandidater.sort((a, b) => (spec.retning === 'lav' ? a.basis - b.basis : b.basis - a.basis)
      || String(a.robot.slug).localeCompare(String(b.robot.slug)));
    const bedst = kandidater[0];
    return { ...spec, robot: bedst.robot, post: bedst.post };
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

/* ============================================ metrisk <-> imperial (L60)
 *
 * FLYTTET HERTIL FRA robot.mjs 1. sep 2026 (spor/enhed). JPK udvidede L60:
 * enhedsvalget skal vaere gennemgaaende paa HELE websiden, ikke kun paa
 * robotsiden. Saa laenge omregningen laa i robot.mjs, kunne en anden sidetype
 * kun faa den ved at kopiere den - og tre haandkopier af samme omregning
 * divergerer ved den fjerde. Nu er der ét sted, og `tal()` nedenfor er den
 * ENESTE vej fra en post til et formateret tal; enhver flade, der kalder
 * `H.tal()`, arver derfor enhedsvalget uden at kende til det.
 *
 * robot.mjs re-eksporterer navnene, saa de tests og kaldere, der importerer
 * dem derfra, stadig virker. Den fil er ikke laengere DEFINITIONEN.
 *
 * Reglen har tre led, og raekkefoelgen mellem dem er hele pointen:
 *
 *   1. Oplyser producenten SELV et imperialt tal (`vaerdi_imperial`), vises
 *      DERES. Aldrig vores regnestykke oven i en oplyst vaerdi. Grunden er
 *      maalt og staar i validate.mjs' regel R9: Ghost Robotics oplyser 2,4 m/s
 *      OG 4,9 mph, som afviger 9,6 %. De to tal er en selvstaendig oplysning om
 *      producenten - overskrev vi det ene med vores omregning af det andet,
 *      ville vi rette i en kilde.
 *   2. Ellers omregner vi - og maerket "omregnet" staar synligt ved tallet, saa
 *      forskellen paa "producenten skriver 74,5 lb" og "33,8 kg, omregnet til
 *      74,5 lb" kan ses uden at klikke.
 *   3. Kildemaerket foelger det METRISKE tal. En omregning har ingen
 *      selvstaendig kilde.
 *
 * MAALT paa datasaettet 31. aug 2026: 30 `vaerdi_imperial`-felter fordelt paa
 * 7 af 77 robotter (anybotics-anymal, boston-dynamics-spot,
 * ghost-robotics-vision-60, neura-quadruped, pudu-d5-w, pudu-d5, rivr-one).
 * De oevrige ~730 omregnelige tal paa robotsiderne er vores.
 */

/** Enheder, der KAN omregnes. Alt andet staar uroert i begge tilstande.
 *  ALDRIG paa listen (maalt i de byggede sider: 274 af 1.034 enhedsvisninger):
 *  `min` (155) og `t` - tid er ens i begge systemer; `°` (52) - haeldning er
 *  en vinkel; `DoF` (29) og `Wh` (25) - hverken laengde, vaegt eller
 *  temperatur; `CNY`/`USD`/`EUR` (11) - en vekselkurs er et tal uden kilde,
 *  der aendrer sig dagligt; `V` og `%` (2) - enhedsloese forhold.
 *  mm/m/m-s staar med, selvom build.mjs' visningsPost() normaliserer dem vaek
 *  paa de felter, der har en kanonisk visningsenhed - listen skal ikke skulle
 *  aendres, hvis KANONISK_VISNINGSENHED goer det.
 *
 *  DER FINDES INGEN KOPI I BROWSEREN, og det er med vilje: assets/enhed.js
 *  husker kun valget og roerer aldrig et tal. Skal sammenligningssidens
 *  klienttegnede matrice en dag kunne skifte enhed, er det den beslutning,
 *  der skal traeffes foerst - en tabel mere i en .js-fil er en anden kopi af
 *  det samme regnestykke og skal i saa fald bindes til denne med en test. */
export const OMREGNING = {
  kg: { enhed: 'lb', om: (v) => v * 2.2046226218 },
  mm: { enhed: 'in', om: (v) => v / 25.4 },
  cm: { enhed: 'in', om: (v) => v / 2.54 },
  m: { enhed: 'ft', om: (v) => v * 3.280839895 },
  '°C': { enhed: '°F', om: (v) => v * 9 / 5 + 32 },
  'm/s': { enhed: 'mph', om: (v) => v * 2.2369362921 },
  'km/h': { enhed: 'mph', om: (v) => v * 0.6213711922 },
};

/** Samme indstillinger som build.mjs' tal(): sproget bestemmer decimaltegnet. */
function lokaltTal(n, sprog) {
  return new Intl.NumberFormat(sprog === 'da' ? 'da-DK' : 'en-GB',
    { maximumFractionDigits: 3 }).format(n);
}

/**
 * Afrundingen, skrevet ud saa den kan efterproeves frem for at skulle gaettes:
 * 0 decimaler fra 100 og op, 1 decimal fra 10 og op, ellers 2.
 *
 * Reglen er ikke valgt efter smag. Den er valgt, fordi den rammer
 * producenternes EGEN afrunding i de tilfaelde, hvor vi har begge tal at holde
 * den op imod: 33,8 kg -> 74,52 -> "74,5" (Boston Dynamics skriver 74.5 lb),
 * 1100 mm -> 43,307 -> "43,3" (databladet skriver 43.3 in), 110 cm -> "43,3".
 * En regel, der gav 74,52 eller 75, ville vaere synligt en anden slags tal end
 * producentens.
 */
export function imperialTal(n, sprog) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return String(n);
  const a = Math.abs(n);
  const dec = a >= 100 ? 0 : a >= 10 ? 1 : 2;
  return new Intl.NumberFormat(sprog === 'da' ? 'da-DK' : 'en-GB',
    { maximumFractionDigits: dec }).format(n);
}

/**
 * Den imperiale udgave af én post, eller `null` naar der ikke er nogen.
 *
 * Returnerer `{ post, egen, kildeform }`:
 *   post       en SYNTETISK post til tal(). `ved_last` og `vaerdi_imperial`
 *              er strippet med vilje: tal() udskriver dem selv, og de ville
 *              derfor staa TO gange i den imperiale visning (én gang fra
 *              det metriske span, én gang her). Lastbetingelsen skrives i
 *              stedet paa igen af tal()s egen imperiale gren, saa forbeholdet
 *              ikke forsvinder, naar laeseren skifter enhed.
 *   egen       true = producentens eget tal, false = vores omregning.
 *   kildeform  det metriske udgangspunkt, "33,8 kg", til maerkets forklaring.
 */
export function imperialPost(post, sprog) {
  if (!post || typeof post !== 'object') return null;
  if (tilstandAf(post.vaerdi)) return null;
  const { ved_last: _vl, vaerdi_imperial: _vi, enhed_imperial: _ei, _kildeform: _kf, ...rest } = post;

  // 1. Producentens eget tal vinder - men kun naar det daekker HELE figuren.
  //    Et interval har min/maks, og datasaettet har ingen min_imperial: et
  //    enkelt vaerdi_imperial ved siden af et interval ville vaere en tredje,
  //    uforklaret figur, saa dér omregner vi begge ender i stedet.
  if (post.vaerdi_imperial !== undefined && post.min === undefined) {
    return {
      post: { ...rest, vaerdi: post.vaerdi_imperial, enhed: post.enhed_imperial ?? '' },
      egen: true,
      kildeform: `${lokaltTal(post.vaerdi, sprog)} ${post.enhed ?? ''}`.trim(),
    };
  }

  const o = OMREGNING[post.enhed];
  if (!o) return null;
  const tal = (v) => (typeof v === 'number'
    ? Number(imperialTal(v, 'en').replace(/,/g, '')) : v);
  const har = (v) => typeof v === 'number' && Number.isFinite(v);

  if (post.min !== undefined) {
    if (!har(post.min) || !har(post.maks)) return null;
    return {
      post: { ...rest, min: tal(o.om(post.min)), maks: tal(o.om(post.maks)), enhed: o.enhed },
      egen: false,
      kildeform: `${lokaltTal(post.min, sprog)}–${lokaltTal(post.maks, sprog)} ${post.enhed}`,
    };
  }
  if (!har(post.vaerdi)) return null;
  return {
    post: { ...rest, vaerdi: tal(o.om(post.vaerdi)), enhed: o.enhed },
    egen: false,
    kildeform: `${lokaltTal(post.vaerdi, sprog)} ${post.enhed}`,
  };
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

  /* --- 0. enhedsvalget (L60, udvidet 1. sep 2026) ------------------------- */

  /**
   * Har DENNE side en enhedsomskifter? Flaget afgoer, om `tal()` overhovedet
   * skriver den imperiale tvilling ud - ikke om den vises (det goer CSS).
   *
   * HVORFOR ET FLAG OG IKKE "altid taendt": en side uden omskifter ville
   * baere en skjult kopi af hvert eneste tal, som ingen kan naa. Det er
   * ~700 doede figurer pr. sprog paa katalogsiden alene.
   *
   * HVORFOR EN GENDANNELSESFUNKTION OG IKKE BARE EN SETTER: build.mjs
   * bygger ÉN hjaelper pr. sprog (build.mjs:261) og genbruger den til alle
   * sidens sider. En klaebrig `true`, sat af den sidste robotside, ville
   * laekke ind i den naeste katalog- eller producentside og give den skjulte
   * imperiale figurer uden en kontakt til at vise dem. Kalderen faar derfor
   * en `gendan()` tilbage og lukker sit eget kald i en `finally`.
   */
  let enhedsskift = false;
  function saetEnhedsskift(paa) {
    const foer = enhedsskift;
    enhedsskift = !!paa;
    return () => { enhedsskift = foer; };
  }

  /**
   * Maerket, der skiller VORES omregning fra producentens eget imperiale tal.
   *
   * Kun vores omregninger baerer et synligt ord. Det er en maalt afvejning, ikke
   * en smagssag: 30 af de ~760 omregnelige figurer paa robotsiderne er
   * producentens egne, saa et maerke paa producentens tal ville staa 30 gange og
   * et maerke paa vores 730 gange. Det sjaeldne skal ikke vaere det umaerkede -
   * men det hyppige maa heller ikke druknes i etiketter, saa forklaringen af
   * FRAVAERET staar i omskifterens egen forklaringslinje ("tal uden maerke er
   * producentens egne"), hvor en laeser moeder den, foer tallene.
   *
   * Ordet - ikke et tegn. `≈` (U+2248) findes hverken i Sairas eller Literatas
   * unicode-range og ville falde tilbage til systemskriften midt i en figur,
   * praecis som `≥` goer paa "mindst"-felterne (MANIFEST §afvigelse 6).
   */
  function omregningsMaerke(imp) {
    // Producentens eget tal: intet synligt maerke (se ovenfor), men en
    // skaermlaeser skal ikke skulle regne fravaeret ud af en forklaringslinje
    // langt oppe paa siden.
    if (imp.egen) return `<span class="kunskaerm">${esc(t('imperial_forklaring'))}</span>`;
    // JPK, punkt 2 (spor/uifix, 2. sep 2026): det synlige "omregnet"-maerke
    // (class="omregnet") skal vaek. Forklaringen forsvinder ikke - den
    // flytter til .kunskaerm, samme form som imp.egen-grenen ovenfor, saa en
    // skaermlaeser stadig faar hele saetningen, mens ingen laeser laengere
    // ser ordet paa skaermen.
    const forklaring = saetInd(t('enhed_omregnet_forklaring'), { figur: imp.kildeform });
    return `<span class="kunskaerm">${esc(forklaring)}</span>`;
  }

  /* --- 1. tal ------------------------------------------------------------ */

  /**
   * Forbeholdet, INTERIM UDEN synligt maerke (JPK 27. aug 2026, ordre med
   * skaermbillede: "*"-tegnet stablede sig hulter til bulter under og ved
   * siden af tallene paa kortene). D14 (STATUS.md) vil give forbehold to
   * niveauer - kun gyldighedstruende skal have et synligt maerke - men den
   * klassifikation af de 562 er endnu ikke flettet. Indtil da: INGEN synlig
   * markoer overhovedet. Teksten forsvinder ikke, den flytter til `title`
   * (museklik) og `.kunskaerm` (skaermlaeser) - samme to steder som foer,
   * blot uden den tredje, altid-synlige gengivelse. Naar klassifikationen
   * lander, er det HER det designede gyldigheds-maerke skal saettes ind.
   *
   * Historik: 24. aug 2026 blev den lange advarselssaetning kortet til
   * ordet "Advarsel" som en haevet stjerne (174/181 chips viste "Advarsel"
   * paa 41/46 kort - naar alt advarer, advarer intet). Den rettelse staar
   * stadig i teksten (T.advarsel-praefikset i .kunskaerm); det er kun den
   * ALTID SYNLIGE gengivelse (stjernen), der fjernes her.
   */
  function fnote(tekst) {
    return `<abbr class="forbehold--skjult" title="${attr(tekst)}">`
      + `<span class="kunskaerm">${esc(T.advarsel)}: ${esc(tekst)}</span></abbr>`;
  }

  /**
   * Saetter en klasse - og eventuelt en title - paa vaerdiens AABNE
   * `<span class="v ...">`, uden at tabe en title, der allerede staar der.
   *
   * Uden sammenfletningen fik en celle med baade imperial og varianter TO
   * title-attributter; browseren viser den foerste og taber den anden tavst.
   * Det er praecis den slags fejl, ingen validator fanger, fordi HTML'en
   * parser fint.
   */
  function medMaerke(html, klasse, titel) {
    return html.replace(/^<span class="(v[^"]*?)"(?:\s+title="([^"]*)")?/,
      (_, klasser, gammel) => `<span class="${klasser}${klasse ? ' ' + klasse : ''}"`
        + ` title="${gammel ? gammel + ' · ' : ''}${attr(titel)}"`);
  }

  /**
   * Selve tallet: operator, figur, enhed, interval, imperial og lastbetingelse.
   * Regel 5: et interval er ikke sit gennemsnit og saettes som et interval.
   *
   * `forbehold` (valgfri tekstliste) flettes sammen med en eventuel
   * lastbetingelse til ÉT haevet tegn - to tegn ved siden af hinanden ville
   * laeses som to forskellige fejl, og de hoerer alligevel til samme vaerdi.
   *
   * `kompakt` (JPK 27. aug 2026) er kortets celle, ikke robotsidens. Den er
   * MAALT 60 px bred i en 105 px celle ved 1440 - ikonet og dets gab tager de
   * 25 - og medianen af det, vaerdilinjen har brug for, er 75 px. Derfor faldt
   * 175 af 261 talceller fra hinanden i to ragede linjer med 15 forskellige
   * hoejder. To ting foelger heraf, og de hoerer sammen:
   *
   *   1. IMPERIAL PAA KORTET er en kasse midt i cellen (Vision 60: "112 lb",
   *      "4,9 mph"). Den er selve halen i maalingen - de bredeste celler laa
   *      paa 144-147 px mod 60 tilraadige. Paa kortet flytter den derfor til
   *      vaerdiens `title` (mus) og til `.kunskaerm` (skaermlaeser); den staar
   *      uaendret og synlig paa robotsiden, hvor der er plads. Tallet
   *      forsvinder ikke - det holder op med at konkurrere med hovedfiguren.
   *   2. OPTISK TILPASNING. Laengdeklassen saettes ALTID (den er inert uden
   *      for `.stribe--kompakt`), saa CSS kan saette en lang vaerdi et trin
   *      ned i stedet for at lade den braekke. Traeklen 9 og 11 er ikke valgt
   *      efter smag: for hver celle blev den stoerste hele skriftgrad, der
   *      passer, maalt i browseren, og de to spring laa dér.
   */
  function tal(post, {
    kilder = null, maerke = true, hvorhen = '', forbehold = [], kompakt = false,
    // Saettes KUN af tal()s eget rekursive kald nedenfor, aldrig af en kalder.
    // Uden den ville den imperiale tvilling selv soege en tvilling og saa
    // videre - og `enhedsvis`-parrene ville nestes i det uendelige.
    __imperial = false,
  } = {}) {
    const nul = post.vaerdi === 0;
    const figur = post.min !== undefined
      ? `${nformat(post.min)}–${nformat(post.maks)}`
      : (typeof post.vaerdi === 'number' ? nformat(post.vaerdi) : String(post.vaerdi));
    const enhed = post.enhed ? String(post.enhed) : '';

    let krop = operator(post.operator)
      + `<b class="num">${esc(figur)}</b>`
      + (enhed ? `<span class="enhed">${esc(enhed)}</span>` : '');

    // Regel 9: oplyser producenten baade metrisk og imperial, staar begge tal.
    // Vi omregner ikke og retter ikke - afvigelsen baeres af post.advarsel.
    const titler = [];
    if (post.vaerdi_imperial !== undefined) {
      const imp = `${nformat(post.vaerdi_imperial)} ${post.enhed_imperial ?? ''}`.trim();
      if (kompakt) {
        krop += `<span class="kunskaerm">${esc(imp)} · ${esc(t('imperial_forklaring'))}</span>`;
        titler.push(`${imp} · ${t('imperial_forklaring')}`);
      } else {
        krop += `<abbr class="forbehold" title="${attr(t('imperial_forklaring'))}">${esc(imp)}</abbr>`;
      }
    }
    const noter = [];
    if (post.ved_last !== undefined) {
      const ukendt = typeof post.ved_last === 'string' || tilstandAf(post.ved_last.vaerdi);
      noter.push(ukendt
        ? T.ved_last_ukendt
        : `${T.ved_last} ${nformat(post.ved_last.vaerdi)} ${post.ved_last.enhed ?? ''}`.trim());
    }
    noter.push(...forbehold);
    if (noter.length) krop += fnote(noter.join(' · '));
    if (maerke && kilder) krop += kildemaerke(post, kilder, hvorhen);

    // Tegnene, som LAESEREN ser dem: operatoren staar som sit oversatte tegn
    // ("ca.", "±", ">"), ikke som noeglen, saa laengden maales paa samme streng.
    //
    // Det er ogsaa derfor tallet skal maales PR. SPROG og ikke én gang: fem af
    // de seks operatorer er tegn (≥ ≤ > < ±) og koster det samme overalt, men
    // 'cirka' er et ORD. Dansk skriver "ca." (3 tegn), engelsk "approx." (7).
    // Maalt paa katalogsiden: de laengste danske vaerdier naar 14 tegn, de
    // engelske 18 - og de to laengste engelske skoed 111 og 96 px ud i en
    // celle paa 91, mens dansk gik fri. Havde graenserne kun vaeret maalt paa
    // dansk, ville fejlen staa paa den engelske side alene.
    const opNavn = OPNAVN[post.operator];
    const opTekst = post.operator ? String(opNavn ? (T['operator_' + opNavn] ?? '') : post.operator) : '';
    const tegn = (opTekst ? opTekst.length + 1 : 0) + figur.length + enhed.length;
    const laengde = tegn >= 14 ? ' v-tal--xxlang'
      : tegn >= 11 ? ' v-tal--xlang'
        : tegn >= 9 ? ' v-tal--lang' : '';

    const raa = `<span class="v v-tal${nul ? ' v-nul' : ''}${laengde}">${krop}</span>`;
    let ud = titler.length ? medMaerke(raa, '', titler.join(' · ')) : raa;

    // ------------------------------------------------- enhedsomskifteren
    // Har fladen ingen omskifter, er der intet mere at goere: hverken en
    // imperial tvilling (den ville vaere skjult tekst, ingen kan naa) eller
    // originalform-wrapperen nedenfor.
    if (!enhedsskift) return ud;

    // Producentens EGEN figur, naar bygget har vist tallet i sidens faelles
    // enhed (skema.mjs' visningsPost, kaldt fra build.mjs). `_kildeform` staar
    // KUN paa poster, der faktisk blev omregnet (fx Spots "1100 mm"); resten
    // gaar uroert igennem. Wrapperen laa foer i robot.mjs' vaerdi() og er
    // flyttet hertil, fordi den skal ligge INDE i det metriske span - og
    // robot.mjs ser efter denne aendring ikke laengere de to spans hver for
    // sig.
    //
    // Den saettes ALDRIG paa den imperiale tvilling: dér ville "Producenten
    // skrev: 1100 mm" staa som forklaring paa vores egen omregning, og det er
    // praecis den sammenblanding, regel 3 forbyder.
    //
    // At den ogsaa er bundet til `enhedsskift` er MAALT, ikke principielt:
    // uden den binding fik forsiden, kataloget og de 52 producentsider
    // wrapperen med (144 af 213 byggede filer aendrede sig). Den aendring er
    // usynlig - `.original-enhed` har ingen CSS, kun en `title` - og den er
    // formentlig en forbedring, men den hoerer ikke til dette spor og ville
    // ramme midt i spor/kort. Loeftes bindingen en dag, er det et bevidst
    // valg om at vise originalformen overalt, ikke en bivirkning.
    if (post._kildeform && !__imperial) {
      ud = `<span class="original-enhed" title="${attr(saetInd(t('kilde_original_form'), { figur: post._kildeform }))}">${ud}</span>`;
    }

    // ------------------------------------------------- de to figurer
    // Begge figurer staar i HTML'en; CSS viser én ad gangen
    // (`.enhedsvis{display:contents}`), saa den metriske visning tegnes
    // NOEJAGTIG som uden omskifteren - wrapperen har ingen kasse. Uden
    // JavaScript staar den metriske tilstand tilbage, og den er
    // standardtilstanden.
    //
    // KILDEMAERKET: robotsiden saetter det UDEN FOR begge spans (kalderen
    // tilfoejer det efter H.tal), saa det bliver staaende i begge tilstande
    // uden nogensinde at love, at nogen har oplyst det imperiale tal. Naar
    // en kalder derimod beder tal() om at saette maerket selv (`kilder`),
    // staar det inde i det METRISKE span - regel 3: kildemaerket foelger det
    // metriske tal. Derfor `maerke: false` paa det rekursive kald.
    if (__imperial) return ud;
    const imp = imperialPost(post, sprogkode);
    if (!imp) return ud;
    // `ved_last` foeres med over: imperialPost() stripper den, saa tal() ikke
    // skriver den to gange i den metriske visning - men forbeholdet maa ikke
    // forsvinde, naar laeseren skifter enhed. Selve lastbetingelsen staar
    // uomregnet ("ved last 20 kg"): den er en BETINGELSE for maalingen, ikke
    // en af sidens figurer, og en omregnet betingelse uden kilde ville vaere
    // et nyt tal, ingen har oplyst.
    const impKrop = tal({ ...imp.post, ved_last: post.ved_last }, {
      kilder, maerke: false, hvorhen, forbehold, kompakt, __imperial: true,
    }) + omregningsMaerke(imp);
    return `<span class="enhedsvis enhedsvis--metrisk">${ud}</span>`
      + `<span class="enhedsvis enhedsvis--imperial">${impKrop}</span>`;
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
  function felt(navn, post, { kilder = null, hvorhen = '', kunVaerdi = false, kompakt = false } = {}) {
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
    else ud = tal(post, { kilder, hvorhen, kompakt, forbehold: kunVaerdi && post.advarsel ? [post.advarsel] : [] });

    if (kunVaerdi) {
      // Feltet varierer mellem robottens modelvarianter (fund/FUND-detalje.md,
      // opgave 4c): kataloget viser kun ÉT tal pr. celle, saa markoeren
      // fortaeller laeseren, at det tal ikke er hele historien, uden at
      // fortraenge tallet selv med en fuld variantliste (den staar paa
      // robottens egen side, se robot.mjs' varianter()). Klassen saettes paa
      // det aabne <span class="v ...">, saa den er en del af selve vaerdien.
      if (post.varianter) {
        ud = medMaerke(ud, 'maerke--varianter', t('varianter_forklaring'));
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
    // Samme form som robot.mjs' advarselBlok(). De to tegnede foer blokken
    // forskelligt (span.etiket her, b.advarsel-navn dér), og kun robot.mjs'
    // udgave naaede nogensinde dist: denne gren er kun naaelig gennem
    // build.mjs' midlertidigRobotside(), som er en reserve for det tilfaelde,
    // at tools/skabelon/robot.mjs mangler. Maalt 28. aug 2026: 0 forekomster
    // af denne forms markup i dist. Den er ensrettet frem for slettet, saa en
    // reserve, der en dag TRAEDER i kraft, ikke udsender en blok uden
    // gyldighedsklasse og uden en CSS-regel, der passer paa den.
    const art = forbeholdsArt(post);
    if (art) {
      ud += `<p class="advarsel advarsel--${art}"><b class="advarsel-navn">`
        + `${esc(T[art === 'gyldighed' ? 'forbehold_navn' : 'note_navn'])}</b>`
        + `<span>${esc(post.advarsel)}</span></p>`;
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

    // Nul oplyste tal, PAA ROBOTSIDEN (kompakt:false): fem/fire huller ville
    // vaere fem/fire gange den samme oplysning, saa prosagrenen bliver staaende
    // dér. PAA KORTET (kompakt:true) gaelder den modsatte regel: INSTRUMENT-
    // retningens aflaesningslinje (L40, STATUS.md) kraever, at ALLE FIRE
    // pladser altid staar i samme raekkefoelge paa hvert eneste kort - de
    // stiplede "ikke oplyst"-huller ER selve pointen (haard begraensning 5:
    // "ikke oplyst" skal SES, ikke skjules bag en saetning). Foer denne
    // rettelse gav dette 6 af 77 kort en prosaboks uden en eneste af de fire
    // faste celler (maalt paa main, spor/instrument2's brief).
    if (oplyst === 0 && !kompakt) {
      return `<div class="stribe-hylster">${hoved}
<div class="stribe stribe--intet">${ikon('i-hul')}
<div class="tekst"><p class="hoved">${esc(tf('noegletal_intet_alle', { b: felter.length }))}</p>
<p>${esc(t('noegletal_intet_grund'))}</p></div></div></div>`;
    }

    const celler = felter.map((f) => {
      const etiket = kompakt ? t('stribe_' + f.navn) : T['felt_' + f.navn];
      const vaerdi = felt(f.navn, f.post, { kilder, hvorhen, kunVaerdi: true, kompakt });
      // D18 · ETIKET: maerket rider paa feltnavnet, aldrig paa vaerdien.
      // 52,5 % af tallene paa kortet baerer et forbehold; et tegn paa hvert
      // ANDET tal bliver tekstur, mens et tegn paa etiketraekken bliver en
      // kolonne, og figurerne staar tilbage som en ren talkolonne.
      const m = erGyldighedsforbehold(f.post) ? ' m-etiket' : '';
      return `<li${f.oplyst ? '' : ' class="hul"'}>${ikon(f.ikonnavn)}<span class="krop">`
        + `<span class="etiket${m}">${esc(etiket)}</span>${vaerdi}</span></li>`;
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
   * Alternativ tekst. Dataskriverens egen `alt:` vinder altid, naar den
   * baerer NOEGET sprog for netop DENNE side (spor/alt, 1. sep 2026: `alt` er
   * et sprogkortlagt objekt, `{ da: "...", en: "..." }` - et nyt sprog er en
   * noegle, ikke et nyt felt, jf. CLAUDE.md's arkitekturregel). Laest fra
   * `robot.billede.alt` (raadata), IKKE fra `b.alt`: laesBillede()'s egen
   * `tekst()`-hjaelper forkaster alt, der ikke er en STRENG, og ville derfor
   * nulstille et sprogobjekt, foer det naaede hertil. Uden den rette noegle
   * siger en silhuet, at den ER en silhuet: en teknisk tegning efter maal er
   * ikke det samme syn som et fotografi, og en skaermlaeserbruger skal have
   * samme oplysning som en seende.
   */
  function billedAlt(robot, b) {
    const altKort = robot?.billede?.alt;
    if (altKort && typeof altKort === 'object' && !Array.isArray(altKort)) {
      const egen = altKort[sprogkode];
      if (typeof egen === 'string' && egen.trim() !== '') return egen;
    }
    const navn = robot?.navn ?? '';
    if (b?.ophav === 'silhuet') return tf('billede_alt_silhuet', { model: navn });
    return navn;
  }

  /* `forhold` (spor/plader, 27. aug 2026): sendes videre til laesBillede(),
     saa en kaldested-specifik ramme (fx forsidens yderpunkt-plade,
     YDERPUNKT_FORHOLD i side.mjs) kan faa sit EGET plade/cover-tjek, uden at
     paavirke katalogkortets uaendrede standard (16:10). */
  function billede(robot, op = '', { stor = false, eager = false, forhold } = {}) {
    const b = laesBillede(robot, ROD, forhold !== undefined ? { forhold } : {});
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
    const v = centralVaerdi(post);
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

  /* --- TYPESKILT-KORTET ---------------------------------------------------
     Kortet har ingen doer ud af sitet: ingen pris, ingen knap, ingen stjerner
     og ingen "featured". Navnet staar UNDER billedet, ikke paa det.

     ÉN funktion til BEGGE flader (spor/kort, 31. aug 2026). Foer i dag fandtes
     kortet i tre haandkopier - her, i producent.mjs og i katalog.mjs - og det
     var derfor, fladerne kunne skride fra hinanden: da katalogsporet gav sit
     kort TYPESKILT-grammatikken, fulgte de to andre ikke med, og den samme
     robot havde to udseender afhaengigt af hvilken side man moedte den paa.

     Katalogkommentaren (katalog.mjs:605) begrundede dengang adskillelsen med,
     at denne funktion "deles med forsiden og producentsiderne, som ikke er
     bygget om i dette spor, og som stadig skal have striben, landet og
     anvendelsesmaerkerne" - en faelles funktion ville vaere "en kontakt med to
     stillinger". Den begrundelse var TIDSBESTEMT, ikke principiel: nu ER de to
     flader bygget om, de vil have praecis det samme kort, og kontakten har
     derfor kun én stilling. Det, der er tilbage, er rene parametre - hvor
     billederne ligger, hvor linket peger hen - ikke to opfoersler.

     Katalog.mjs beholder sin egen kopi, fordi filen er uden for dette spors
     ejerskab. Den er ordret den samme grammatik; naar et spor ejer begge filer,
     kan den kalde herind og de tre kopier bliver til én.

     Statusstemplet laegges KUN paa, naar status ikke er "i produktion":
     forskellen er den eneste, kortet skal kunne baere (MANIFEST Layouttesen).

     op           = stien tilbage til dist/ (til billeder og aktiver)
     til          = stien til robotmapperne fra den side, kortet staar paa
     href         = hele linkmaalet, naar kaldet selv kender det (producent-
                    siden regner det med sti(ctx,'robot',slug)). Vinder over `til`.
     billedeKilde = producentsidens opslag i ctx.billeder, som skal vinde over
                    robottens eget felt. Uden den ville minikortet vise et andet
                    billede end det, producentsiden har valgt.
     samling      = skal kortet baere samlknappen? Std. true (forsiden og
                    kataloget - begge henter katalog.js og goer knappen
                    levende, maalt i browser 1. sep 2026: klik saetter
                    aria-pressed og skriver til localStorage paa BEGGE).
                    producent.mjs saetter den til false: de 50 producentsider
                    indlaeser intet JavaScript, saa knappen ville staa
                    `hidden` for evigt - se samlknap()s kommentar.
   */
  function kort(robot, {
    op = '', til = '', href = null, eager = false, billedeKilde = null, samling = true,
  } = {}) {
    const hvorhen = href ?? `${til}${robot.slug}/`;
    // T['status_...'] slaar fejl, hvis en post mangler status. Alle 77 har den
    // i dag (maalt), men producentsidens modeller naar herind ad en anden vej
    // end forsidens, saa stemplet springes over frem for at stanse "undefined".
    const stempelTekst = robot.status ? T['status_' + robot.status] : null;
    const stempel = (!robot.status || robot.status === 'i_produktion' || !stempelTekst)
      ? ''
      : `<span class="kort__mrk">${esc(stempelTekst)}</span>`;
    const emne = billedeKilde ? { ...robot, billede: billedeKilde } : robot;
    // Linket ligger paa NAVNET, ikke om hele kortet: skaermlaeseren skal
    // annoncere "Go2", ikke hele kortets indhold. `.kort__navn a::after`
    // daekker kortet, saa hele fladen alligevel er klikbar.
    //
    // AABNINGSTAGGEN ER ORDRET `<article class="kort">`. tools/build.mjs:88
    // taeller netop den streng og paastaar (linje 297), at forsiden viser
    // noejagtigt seks kort - hverken et style- eller et data-attribut maa
    // derfor ind foran klassen.
    return `<article class="kort">`
      + `${stempel}${samling ? samlknap(robot) : ''}${billede(emne, op, { eager })}`
      + `<div class="kort__tekst">`
      + `<p class="kort__prod">${esc(robot.producent)}</p>`
      + `<h3 class="kort__navn"><a href="${attr(hvorhen)}">${esc(robot.navn ?? robot.slug)}</a></h3>`
      + `</div></article>`;
  }

  /* --- 9b. samlknappen ----------------------------------------------------
   * "Tilfoej til sammenligning" (JPK 1. sep 2026, punkt 1). Ét sted, brugt af
   * baade dette kort og katalogets egen kopi, saa de to flader ikke kan skride
   * fra hinanden - det var netop den fejl, kommentaren over kort() beskriver.
   *
   * ARKITEKTURREGEL P0 (assets/katalog.js:1-17) LIGGER I `hidden`-ATTRIBUTTEN,
   * og den er hele knappens fundament: "Uden JavaScript er siden SAND, men
   * statisk. Med JavaScript bliver den PRAECIS." Uden JavaScript findes
   * knappen derfor ikke for laeseren - hverken visuelt, i taborden eller i
   * tilgaengelighedstraeet - og sammenligningssidens egne afkrydsningsfelter
   * er uroert den eneste vej ind. assets/katalog.js fjerner attributten.
   * En knap, der ikke goer noget, er vaerre end ingen knap.
   *
   * PAA PRODUCENTSIDERNE ER DEN VAERRE END INERT: de 50 sider indlaeser
   * INTET JavaScript (maalt - kun forsiden og katalogsiden henter
   * katalog.js), saa `hidden` bliver ALDRIG fjernet, og markup'en er derfor
   * doed kode, der aldrig kan blive levende - modsat forsiden, som ogsaa
   * kun bruger ÉT script, men netop katalog.js, og hvor knappen derfor ER
   * levende (efterproevet i browser 1. sep 2026: klik paa forsidens kort
   * saetter aria-pressed="true" og skriver slug'en til localStorage,
   * praecis som paa katalogsiden). spor/oprydknap (1. sep 2026) fjernede
   * derfor kun knappen paa producentsiderne, via kort()s `samling: false` -
   * se producent.mjs' modelkort(). Forsiden er UROERT: dens kald bruger
   * standardvaerdien `samling: true`, fordi knappen der rent faktisk
   * virker.
   *
   * HAARD BEGRAENSNING 1: knappen er en SAMMENLIGNINGSHANDLING, ikke en kurv.
   * Ordet er "Sammenlign", tilstanden er `aria-pressed`, og der findes intet
   * trin bagefter, der peger mod en fabrikant. Se ogsaa .saml-taeller i
   * system.css for, hvorfor taelleren er en chip i strimlen og ikke et
   * fastklaebet baand - et svaevende "N valgt"-baand med en fremad-knap ER
   * kurvens form, uanset hvad der staar paa den.
   *
   * TEKSTEN SKIFTER IKKE MED TILSTANDEN. Den synlige etiket er altid
   * "Sammenlign", og om kortet er afsat, baeres af `aria-pressed` (hoert) og
   * af den gule flade plus krydset (set). Skiftede ordet til "Valgt", ville
   * den synlige tekst ikke laengere findes i det tilgaengelige navn
   * (WCAG 2.5.3, "Label in Name"), og knappens bredde ville hoppe.
   */
  function samlknap(robot) {
    if (!robot.slug) return '';
    return `<button type="button" class="kort__saml" hidden`
      + ` data-saml="${attr(robot.slug)}" aria-pressed="false"`
      + ` aria-label="${attr(tf('kort_saml_navn', { robot: robot.navn ?? robot.slug }))}">`
      // Ordet ligger i sin EGEN span, saa CSS kan folde det vaek paa de
      // smalleste kort. MAALT ved 390 px: kortet er 171 px, statusstemplet
      // "Annonceret" 85 px og knappen 106 px - 190 px paa en 171 px raekke,
      // altsaa et sammenstoed. Et bart tekstknudepunkt kan ikke rammes af en
      // vaelger; derfor spannet. Det tilgaengelige navn kommer fra
      // aria-label og er uroert af, at ordet skjules visuelt.
      + `<span class="kort__saml-ord">${esc(T.kort_saml_knap)}</span></button>`;
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
${raekke(`<span class="v v-tal"><b class="num">33,8</b><span class="enhed">kg</span></span>`, T.tegnforklaring_oplyst)}
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
    // Enhedsomskifteren (L60, udvidet 1. sep 2026). Sidetypen taender flaget
    // for sit eget render-kald og lukker det igen med den returnerede
    // gendan(); se saetEnhedsskift()s egen kommentar for hvorfor det ikke er
    // en almindelig setter.
    saetEnhedsskift, imperialPost, imperialTal, OMREGNING,
    // --- bekvemmeligheder ---
    esc, attr, ikon, land, felt, jaNej, tekstvaerdi, kildeliste, stribe,
    ceTilstand, billede, billedsandhed, billedTekst, kort, samlknap, tegnforklaring, nformat, dformat, operator,
    saetInd, manglendeLande, STRIBE_FELTER: STRIBE.map(([n]) => n), VAEGTKLASSER, EAGER_KORT_ANTAL,
    // L50: vaegtklasser() - flertalsversionen, se dens egen kommentar ved
    // definitionen. KUN kataloget (katalog.mjs) laeser den i dag.
    vaegtklasser,
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
 * Sideskallen. Alt uden for <main>: <head>, hreflang, skip-link, daekket
 * oeverst og sidefoden.
 *
 * Daekket er bygget efter comp'en retninger/nyverden/katalog.html (spor/topbar,
 * 31. aug 2026) og erstatter `.baand`. De fire steder, comp'en bevidst ikke er
 * fulgt, staar i assets/system.css afsnit 6 - de hoerer til CSS'en, ikke her.
 *
 * MENUENS INDHOLD er IKKE comp'ens. Comp'en viser fire punkter (Oversigt,
 * Nyheder, Services, Om os); L58 besluttede, at de tre nye laegges TIL de
 * bestaaende, ikke i stedet for - en udtoemmende laesning ville goere 54 sider
 * (sammenligning 2 + producenter 52) uopnaaelige fra navigationen. En laenke
 * til en side, der ikke findes, ville med rette blive fanget af
 * tools/linktjek.mjs, saa et punkt lukkes foerst ind, naar dets side bygges.
 *
 * OM OS ER LUKKET IND 1. sep 2026 (spor/omos, L61): siden findes nu, og
 * punktet staar sidst. Raekken er dermed FEM punkter. Nyheder og Services er
 * fortsat ikke bygget og staar fortsat ikke i menuen; den vokser til syv den
 * dag de findes - rullesporet baerer dem allerede.
 *
 * SIDEFODEN ER FJERNET HELT (BRIEF-uifix.md punkt 7, spor/uifix, 2. sep
 * 2026) - ikke kun forhandlerlinjen, JPK's ord i interview med tabet
 * forelagt. Her stod indtil samme dag: "Sprogskifteren gaar IKKE tabt:
 * topbaren (.daek__sprog, 'DA / EN') havde den allerede, efterproevet foer
 * rettelsen." DEN BEGRUNDELSE HOLDER IKKE LAENGERE, og det er vaerd at vide
 * hvorfor: fodens skifter blev fjernet MED HENVISNING TIL topbarens - og
 * samme dag fjernede spor/topbar saa topbarens (JPK: "Desuden skal DA/ENG
 * knappen vaek"). Der er dermed NUL brugersynligt sprogskift paa de 214
 * sider med topbar; kun dist/index.html (rodens vaelger, en anden skabelon)
 * kan skifte sprog. Det er en truffet beslutning med prisen forelagt, ikke
 * et utilsigtet tab - se skal()'s egen kommentar ved sprogskifteren.
 * <link rel="alternate" hreflang> i <head> er uroert. Forhandlerlinjen
 * (T.ingen_forhandler) staar stadig paa Om os (om-os.mjs:300, sin egen
 * linje, uden for foden - punktet roerer den ikke). TAETHEDSFORKLARINGEN
 * (T.taethed_forklaring, "Hvor mange af skemaets felter producenten selv
 * oplyser...") fandtes KUN i foden og er tabt for godt - JPK har valgt med
 * det paa bordet, noteret i fund/FUND-uifix.md, ikke rettet. T.udgiver/
 * T.andet_sprog ("Udgivet af KeyResearch · In English") var ogsaa kun her;
 * alle tre noegler er fjernet fra da.json/en.json som foelge.
 *
 * INGEN HTML-KOMMENTAR staar i stedet for foden i selve markuppen: en
 * forklaring, der citerer den fjernede tags egen tekst ordret, ville skrive
 * "footer class=\"fod\"" tilbage ind i alle 216 sider og faa acceptkriteriets
 * grep til at give 216, ikke 0. Forklaringen hoerer derfor HER, i kildekoden
 * - ikke i det byggede output.
 */
export function skal({
  sprogkode, T, t, titel, beskrivelse, sti, main, aktiv,
  script = false, stil = '', harProducenter = false,
}) {
  const dybde = 1 + (sti ? sti.split('/').filter(Boolean).length : 0);
  const op = '../'.repeat(dybde);
  // `andet` (modsprogets kode) er FJERNET - BRIEF-uifix.md punkt 7 (spor/
  // uifix, 2. sep 2026) fjernede foden, dens ENESTE bruger.
  const alternativer = SPROG.map((s) => ({ sprog: s, href: `${op}${s}/${sti}` }));
  // spor/oversigt (1. sep 2026, JPK: "HELE oversigt-siden skal vaek"):
  // kataloget ER sprogroden nu - dets nav-punkt bruger href '' og der er
  // intet separat forside-punkt laengere. T.nav_forside staar stadig i
  // begge sprogfiler (uroert, ubrugt her - se STATUS.md/rapporten), men
  // nav-arrayet selv har kun TRE faste punkter fra nu af, ikke fire.
  const nav = [
    ['', T.nav_katalog],
    // spor/lysbyg: sammenligningssiden foelger katalogsiden i navigationen,
    // samme raekkefoelge mockuppens baand havde (prototype/retning-lys/*.html).
    ['sammenligning/', T.nav_sammenligning],
  ];
  if (harProducenter) nav.push(['producenter/', t('nav_producenter')]);
  // spor/omos (L61): Om os er bygget og staar SIDST — comp'ens egen plads for
  // punktet, og den rigtige for en side om udgiveren frem for om robotterne.
  // Noeglen hedder om_nav og ikke nav_om, fordi ALLE noegler fra dette spor
  // baerer praefikset om_; det holder de nye linjer samlet i én blok i begge
  // sprogfiler, saa en flettekonflikt kan loeses ved at tage begge sider.
  // Kommentaren ovenfor om "de tre nye sider findes ikke endnu" gaelder
  // herefter kun Nyheder og Services — raekken er nu fem punkter, ikke fire.
  nav.push(['om/', t('om_nav')]);

  /* SPROGSKIFTEREN ER FJERNET FRA TOPBAREN (JPK, 2. sep 2026, ordret:
     "Desuden skal DA/ENG knappen vaek"). Her stod indtil da en skifter
     bygget over SPROG - to sprogkoder med en skraastreg imellem - og en
     <p> i skallen, der bar den. Begge dele er vaek, og system.css' seks
     tilhoerende regler med dem, saa der hverken staar doed CSS eller
     ustylet markup tilbage. Konstant- og klassenavne skrives bevidst ikke
     her: sporets acceptkriterier er greps paa dem, og en kommentar, der
     naevnte dem, ville faa kriteriet til at maale sin egen forklaring.
     Navnene staar i commit-beskeden ved siden af diffen.

     PRISEN ER KENDT OG VALGT, ikke overset: efter dette spor er der NUL
     brugersynligt sprogskift paa de 214 sider, der baerer en topbar. Kun
     dist/index.html - rodens egen vaelger, en anden skabelon - kan skifte
     sprog. JPK fik prisen forelagt i en popup samme dag og valgte
     "Fjern helt, rodens vaelger er nok", med L82 (dansk udgaar) som
     baggrund. REJS DEN IKKE IGEN.

     DET MASKINLAESBARE SKIFT ER UROERT: `alternativer` herover skriver
     stadig <link rel="alternate" hreflang> for hvert sprog plus x-default i
     <head>. Det er derfor `alternativer` stadig bygges, selvom ingen synlig
     laenke bruger den. En soegemaskine finder stadig begge sprog; det er
     kun mennesket i topbaren, der ikke laengere kan klikke.

     BEMAERK FOR ENHVER, DER TAELLER hreflang: tallet i en bygget side gik
     fra 4 til 3 ved dette spor. De tre er <head>'s (da, en, x-default) - de
     var og er maskinlaesbare. Den fjerde sad paa selve DA/EN-laenken og
     forsvandt med den. Et acceptkriterium, der kraever 4, maaler altsaa den
     fjernede knap, ikke sprogskiftets overlevelse. */

  /* TOPBARENS ENHEDSKONTAKT VISER BEGGE ENHEDER (JPK, 2. sep 2026, ordret:
     "Unit-knappen skal vise baade metric og imperial som der toggles
     mellem"). FOER: kun ÉT ord stod der ad gangen - og det var det ord, man
     skiftede TIL ("IMPERIALE ENHEDER" med kontakten slukket), aldrig den
     tilstand, man var i. Er IMPERIAL saa tilstanden eller maalet? Det kunne
     man ikke se, og det var hele klagen.

     RAEKKEFOELGEN ER MEKANIKKEN, ikke pynt: metrisk-ord | kontakt |
     imperial-ord. Knoppen staar til VENSTRE naar boksen er ukrydset og til
     HOEJRE naar den er krydset, saa den peger fysisk paa det ord, der
     gaelder. Det er den ikke-farvebaarne halvdel af markeringen (WCAG
     1.4.1); den anden halvdel er blaek-trinnet i system.css.

     DE TO enhedsvis--KLASSER ER FJERNET HERFRA, og det er med vilje.
     `.enhedsvis--imperial{display:none}` (system.css:1809) er GLOBAL - det
     var praecis den regel, der skjulte det andet ord i topbaren, mens
     skifte-reglerne kun findes under .typeskilt/.sammenligning-app. Skulle
     begge ord ses, skulle klasserne vaek, ikke suppleres. Topbaren faar i
     stedet sine EGNE modifikatorer (__ord--metrisk/--imperial), saa de to
     in-page-instanser (robot.mjs, sammenligning.js) beholder deres
     enhedsvis-mekanik uroert.

     NOEGLERNE ER BYTTET OM I FORHOLD TIL DERES NAVNE, og det er en faelde,
     ikke en fejl her: `enhed_skift_etiket` = "Imperiale enheder" og
     `enhed_skift_etiket_metrisk` = "Metriske enheder". Metrisk-ordet skal
     derfor hente _metrisk-noeglen. Ingen nye i18n-noegler; de to
     eksisterende siger allerede noejagtig det, der skal staa.

     TILGAENGELIGHED: metrisk-ordet er aria-hidden, imperial-ordet ikke.
     Kontrollens tilgaengelige navn bliver dermed "Imperiale enheder" -
     NOEJAGTIG det, den hed foer dette spor (det andet span var
     display:none og altsaa allerede ude af tilgaengelighedstraeet). En
     afkrydsning, der hedder "Imperiale enheder", siger praecis det rigtige:
     krydset = imperial, ukrydset = metrisk. To laeste ord i étikettens navn
     ville derimod vaere tvetydigt for en skaermlaeser. */

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
<header class="daek">
<div class="daek__ramme rum">
<div class="daek__mark">
<a class="daek__navn" href="${attr(`${op}${sprogkode}/`)}">${esc(T.sted_navn)}</a>
<span class="daek__stempel stans">${esc(t('sted_navn_midlertidig'))}</span>
</div>
<nav class="daek__nav" aria-label="${attr(t('nav_etiket'))}">
<ul>
${nav.map(([href, tekst]) => `<li><a href="${attr(op + sprogkode + '/' + href)}"`
    + `${aktiv === href ? ' aria-current="page"' : ''}>${esc(tekst)}</a></li>`).join('\n')}
</ul>
</nav>
<p class="daek__enhed"><label class="enhedsskift" for="enhedsskift"><span class="enhedsskift__ord enhedsskift__ord--metrisk" aria-hidden="true">${esc(t('enhed_skift_etiket_metrisk'))}</span><span class="enhedsskift__spor" aria-hidden="true"><span class="enhedsskift__knop"></span></span><span class="enhedsskift__ord enhedsskift__ord--imperial">${esc(t('enhed_skift_etiket'))}</span></label></p>
</div>
</header>
${kropp}
${script ? `<script src="${op}${attr(script === true ? 'katalog.js' : script)}" defer></script>` : ''}
</body>
</html>
`;
}
