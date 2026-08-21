/**
 * prototype/tjek-system.mjs
 *
 * Efterproever assets/system.css og prototype/system.html mod data og mod de
 * regler, systemet er bygget paa. Skriver en TAELLING, ikke en forsikring:
 * nul fundne fejl uden et antal er ikke en efterproevning.
 *
 * Koeres med:
 *   "/c/Program Files/nodejs/node.exe" prototype/tjek-system.mjs
 *
 * Ingen afhaengigheder.
 */

import fs from 'node:fs';
import path from 'node:path';
import { parseYaml } from '../tools/yaml.mjs';
import { PAR, P } from './kontrast-system.mjs';

const ROD = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const l = (f) => fs.readFileSync(path.join(ROD, f), 'utf8');

const css = l('assets/system.css');
const html = l('prototype/system.html');

let proevet = 0;
let faldne = 0;
const fejl = [];
function tjek(navn, betingelse, detalje = '') {
  proevet++;
  if (!betingelse) { faldne++; fejl.push(`${navn}${detalje ? ' — ' + detalje : ''}`); }
}

/* ------------------------------------------------------------------ DATA */
const robotFiler = fs.readdirSync(path.join(ROD, 'data/robots')).filter((f) => f.endsWith('.yaml'));
const robotter = robotFiler.map((f) => parseYaml(l('data/robots/' + f), f));

const oplyst = (v) => {
  if (v === undefined || v === null || v === 'ikke_oplyst') return false;
  if (typeof v === 'object') {
    if (v.vaerdi === 'ikke_oplyst') return false;
    return v.vaerdi !== undefined || v.vaerdi_min !== undefined;
  }
  return true;
};
const seksTal = (r) => {
  const F = r.felter || {};
  const ny = oplyst(F.nyttelast_gaaende) || oplyst(F.nyttelast_staaende);
  return [oplyst(F.egenvaegt), ny, oplyst(F.driftstid), oplyst(F.hastighed),
    oplyst(F.ip_klasse), oplyst(F.ce_oplyst)].filter(Boolean).length;
};

/* ------------------------------------------------- 1. KORT MOD DATAFILER */
/* Kravet fra kritikken: en robot uden billede skal stadig faa et kort.
   Denne proeve er skrevet, saa den fejler den dag katalogsiden bygges med
   43 kort igen. system.html er en komponentside og viser med vilje et
   udvalg — derfor sammenlignes tallet med katalogsiden, naar den findes. */
const katalog = path.join(ROD, 'prototype/katalog-v3.html');
if (fs.existsSync(katalog)) {
  const k = fs.readFileSync(katalog, 'utf8');
  const antalKort = (k.match(/<article class="kort"/g) || []).length;
  tjek('Katalogsiden har ét kort pr. datafil',
    antalKort === robotFiler.length,
    `${antalKort} kort mod ${robotFiler.length} datafiler`);
} else {
  console.log(`  (katalog-v3.html findes ikke endnu — kortantallet kan foerst proeves,`);
  console.log(`   naar bid 4 bygger den. Datafiler lige nu: ${robotFiler.length})`);
}

/* Komponentsiden skal vise mindst ét kort UDEN billede, ellers er tilfaeldet
   ikke tegnet, og bid 4 opdager foerst hullet paa katalogsiden. */
const kortUdenBillede = (html.match(/class="intetfoto"/g) || []).length;
tjek('Komponentsiden viser kort uden billede', kortUdenBillede >= 3,
  `${kortUdenBillede} tomme plader`);

/* De tre robotter uden billedmappe skal kunne faa et kort. */
const billedmapper = fs.readdirSync(path.join(ROD, 'media/robotbilleder'))
  .filter((f) => fs.statSync(path.join(ROD, 'media/robotbilleder', f)).isDirectory());
const udenMappe = robotter.filter((r) => !billedmapper.includes(r.slug)).map((r) => r.slug);
tjek('Robotter uden billedmappe er kendt og talt', udenMappe.length === 3,
  `${udenMappe.length}: ${udenMappe.join(', ')}`);

/* ------------------------------------------------ 2. DE FIRE TILSTANDE */
for (const [navn, klasse] of [['tal', 'v-tal'], ['nej', 'v-nej'], ['nul', 'v-nul'],
  ['ikke oplyst', 'v-ikke'], ['kun vist paa billede', 'v-billede']]) {
  tjek(`Tilstanden "${navn}" har en egen klasse i system.css`, css.includes('.' + klasse));
  tjek(`Tilstanden "${navn}" er tegnet i system.html`, html.includes(klasse));
}
/* De fire maa ikke dele skriftgrad: et hul paa 29 px ville vaere et tal. */
const grad = (k) => {
  const m = css.match(new RegExp('\\.' + k + '\\{[^}]*font-size:([0-9.]+)em'));
  return m ? Number(m[1]) : null;
};
const gTal = 1, gNej = grad('v-nej'), gIkke = grad('v-ikke'), gBillede = grad('v-billede');
tjek('"nej" er mindre end et tal', gNej !== null && gNej < gTal, `${gNej}em mod ${gTal}em`);
tjek('"ikke oplyst" er mindre end "nej"', gIkke !== null && gIkke < gNej, `${gIkke}em mod ${gNej}em`);
tjek('"ikke oplyst" har stiplet hegn', /\.v-ikke\{[^}]*dashed/.test(css));
tjek('"nul" arver tallets grad', /\.v-nul\{[^}]*\}/.test(css) && !/\.v-nul\{[^}]*font-size/.test(css));
tjek('"kun vist paa billede" har halvt fyldt maerke',
  /\.v-billede \.mrk\{[^}]*linear-gradient/.test(css));

/* ------------------------------------------------------- 3. OPERATORER */
const opsBrugt = new Set();
for (const r of robotter) {
  const gaa = (o) => {
    if (!o || typeof o !== 'object') return;
    if (typeof o.operator === 'string') opsBrugt.add(o.operator);
    for (const v of Object.values(o)) if (v && typeof v === 'object') gaa(v);
  };
  gaa(r.felter);
}
const vist = { '~': 'ca.', '>': '&gt;', '>=': '≥', '<=': '≤', '±': '±', '<': '&lt;' };
for (const op of opsBrugt) {
  tjek(`Operatoren ${op} er tegnet i system.html`,
    html.includes('<span class="op">' + vist[op] + '</span>'),
    `forventede ${vist[op]}`);
}
tjek('Operatoren har egen klasse med egen grad', /\.v-tal \.op\{[^}]*font-size/.test(css));

/* --------------------------------------------------------- 4. STRIBEN */
const striber = html.match(/<ul class="stribe">[\s\S]*?<\/ul>/g) || [];
tjek('Der findes mindst fire fulde striber', striber.length >= 4, `${striber.length}`);
striber.forEach((s, i) => {
  const celler = (s.match(/<li[ >]/g) || []).length;
  tjek(`Stribe ${i + 1} har praecis seks celler`, celler === 6, `${celler} celler`);
});
const hullerPrStribe = striber.map((s) => (s.match(/class="hul"/g) || []).length);
tjek('Striben er proevet med 1 hul', hullerPrStribe.includes(1), hullerPrStribe.join(','));
tjek('Striben er proevet med 2 huller', hullerPrStribe.includes(2), hullerPrStribe.join(','));
tjek('Striben er proevet med 4 huller', hullerPrStribe.includes(4), hullerPrStribe.join(','));
tjek('Striben er proevet med 0 huller (sammenslaaet)', html.includes('stribe--intet'));

/* Ingen robot oplyser alle seks — proeven fejler den dag én goer, saa
   striben med nul huller kan tegnes med rigtige tal i stedet for at mangle. */
const fordeling = [0, 0, 0, 0, 0, 0, 0];
for (const r of robotter) fordeling[seksTal(r)]++;
tjek('Ingen robot oplyser alle seks noegletal', fordeling[6] === 0,
  `${fordeling[6]} goer`);
tjek('Kun robotter med NUL oplyste tal faar den sammenslaaede stribe',
  fordeling[1] === 0, `${fordeling[1]} robotter har praecis ét — graensen skal saettes om`);

/* ---------------------------------------------------- 5. KILDEMAERKET */
const flereKilder = robotter.filter((r) => {
  const u = new Set();
  const gaa = (o) => {
    if (!o || typeof o !== 'object') return;
    if (typeof o.kilde === 'string') u.add(o.kilde);
    for (const v of Object.values(o)) if (v && typeof v === 'object') gaa(v);
  };
  gaa(r.felter);
  return u.size > 1;
}).length;
tjek('Kildemaerket findes i system.css', css.includes('.kildemaerke'));
tjek('Sekundaer kilde ser anderledes ud end primaer',
  /\.kildemaerke--sek\{[^}]*dashed/.test(css));
tjek('Kildelisten findes', css.includes('.kildeliste') && html.includes('class="kildeliste"'));
tjek('Hentedatoen staar paa siden', /hentet 1[0-9]\.0[0-9]\.2026/.test(html));
tjek('Der staar ingen saetning om ÉN kilde til hele posten',
  !/[Aa]lle tal på denne side er læst på producentens/.test(html));
tjek('Kortenes kildesaetning taeller kilderne',
  /Kortets tre tal kommer fra \d+ kilde/.test(html));
console.log(`  (maalt: ${flereKilder} af ${robotter.length} poster har mere end én kilde-URL)`);

/* ------------------------------------------------------- 6. BILLEDER */
tjek('Billedmaerket for delte fotografier findes', css.includes('.billedmaerke'));
tjek('Delte fotografier er maerket i html', html.includes('billedmaerke'));
tjek('Beskaeringsklassen er fjernet (L28)', !css.includes('billedled--klip'));
tjek('Go2-billedet med reklameoverskrift er ikke i brug (L28)',
  !html.includes('unitree-go2-4.jpg'));
tjek('Spirit 40-billedet er ikke i brug (L28)',
  !html.includes('ghost-robotics-spirit-40-1.jpg'));
tjek('De to billedklasser er beholdt', css.includes('.billedled--plade'));
tjek('Den tomme plade har v2s ordlyd', html.includes('Ingen brugbar optagelse'));

/* Alle billeder, siden peger paa, skal findes paa disken. */
const billeder = [...html.matchAll(/src="\.\.\/(media\/robotbilleder\/[^"]+)"/g)].map((m) => m[1]);
let manglende = 0;
for (const b of billeder) if (!fs.existsSync(path.join(ROD, b))) { manglende++; fejl.push('Billede mangler: ' + b); }
proevet += billeder.length; faldne += manglende;
console.log(`  (${billeder.length} billedhenvisninger proevet, ${manglende} mangler paa disken)`);

/* Intet billede maa vaere kopieret til assets/ — den strukturelle spaerring. */
const iAssets = fs.existsSync(path.join(ROD, 'assets/fotos'))
  ? fs.readdirSync(path.join(ROD, 'assets/fotos')).filter((f) => !f.startsWith('.')) : [];
tjek('Ingen fabrikantbilleder er kopieret til assets/fotos', iAssets.length === 0,
  iAssets.join(', '));
tjek('system.css peger ikke paa media/', !css.includes('media/'));

/* --------------------------------------------------- 7. SPAERRING S1 */
tjek('Billednoten staar paa siden', html.includes('Siden må ikke udgives'));
tjek('Billednoten er ikke roed', !/billednote[\s\S]{0,400}#[a-fA-F0-9]*[cCdDeEfF]{2}[0-3][0-9a-fA-F]{3}/.test(css));

/* ------------------------------------------------- 8. TILGAENGELIGHED */
tjek('Skip-link findes', html.includes('class="spring"'));
tjek('Fokusring er defineret', css.includes(':focus-visible'));
tjek('Beroeringsmaal paa navigation er mindst 44 px', /\.baand nav a\{[^}]*min-height:44px/.test(css));
tjek('Beroeringsmaal paa filtre er mindst 44 px', /\.filtre label\{[^}]*min-height:44px/.test(css));
tjek('Soegefeltet er mindst 44 px', /\.sog input\{[^}]*min-height:50px/.test(css));
tjek('Reduceret bevaegelse respekteres', css.includes('prefers-reduced-motion'));
tjek('Ikoner er skjult for skaermlaesere', !/<svg class="ikon"(?![^>]*aria-hidden)/.test(html));
tjek('Ingen emoji brugt som ikon', !/[\u{1F300}-\u{1FAFF}]/u.test(html));

/* --------------------------------------------------------- 9. RENHED */
tjek('Ingen tredjepartskald i css', !/https?:\/\//.test(css.replace(/\/\*[\s\S]*?\*\//g, '')));
tjek('Ingen tredjepartskald i html', !/(src|href)="https?:\/\//.test(html));
tjek('Ingen JavaScript paa siden', !/<script/.test(html));
/* Proeven skal ramme KNAPPER, ikke prosa: siden skriver med vilje ordet
   "koebsknap" i den saetning, der forklarer, at formen ikke findes. */
const knapper = [...html.matchAll(/<a\b[^>]*class="[^"]*(?:videre|doer|knap)[^"]*"[^>]*>([\s\S]*?)<\/a>/g)]
  .map((m) => m[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
tjek('Ingen koebs-, demo- eller prisknap',
  !knapper.some((k) => /(køb|demo|forespørg|bestil|pris)/i.test(k)),
  knapper.join(' | '));

/* --------------------------------------------------------- 10. FARVE */
const medKrav = PAR.filter((p) => p[3] > 0);
console.log(`  (${PAR.length} farvepar maalt af kontrast-system.mjs, ${medKrav.length} med krav)`);
tjek('Paletten i css og i maaleren er den samme',
  Object.values(P).every((h) => h === '#CFD4DB' || css.includes(h)),
  Object.values(P).filter((h) => h !== '#CFD4DB' && !css.includes(h)).join(', '));
/* Farven maa gerne staa i en KOMMENTAR — det er dér, maalingen forklares.
   Den maa bare ikke vaere i brug. */
const cssUdenKommentar = css.replace(/\/\*[\s\S]*?\*\//g, '');
tjek('Det forkastede #6B7280 er ikke i brug', !cssUdenKommentar.includes('#6B7280'));

/* ------------------------------------------------------------ SVAR */
console.log('');
console.log(`Proevede ${proevet} paastande. ${faldne} faldt.`);
if (fejl.length) {
  console.log('');
  for (const f of fejl) console.log('  FALDT: ' + f);
}
console.log('');
console.log('Maalt i data:');
console.log(`  ${robotter.length} robotter · ${billedmapper.length} med billedmappe · ${udenMappe.length} uden`);
console.log(`  noegletal oplyst af seks, fordeling 0..6: ${fordeling.join(' · ')}`);
console.log(`  ${flereKilder} poster med mere end én kilde-URL`);
process.exitCode = faldne ? 1 : 0;
