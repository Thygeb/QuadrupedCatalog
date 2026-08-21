#!/usr/bin/env node
/**
 * tests/koer.mjs — koerer validatoren mod bevidst oedelagte filer og bygger dist/.
 *
 *   node tests/koer.mjs
 *
 * Hvert oedelagt tilfaelde baerer sin forventede regelkode ved siden af sit input.
 * Ligger forventningen i en anden fil, divergerer de to ved fjerde aendring.
 *
 * Testen beviser TO ting, og de er ikke det samme:
 *   1. at validatoren giver exit 1 (den fejler overhovedet)
 *   2. at den fejler paa DEN RIGTIGE regel (den fejler af den rigtige grund)
 * Kun nr. 2 er et bevis. Nr. 1 alene ville ogsaa vaere sandt for en validator,
 * der altid fejlede.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';

const rod = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const tmp = path.join(rod, 'tests', '.tmp-koersel');
const node = process.execPath;

const GYLDIG_HOVED = `slug: NAVN
navn: Proeve
producent: Proeveproducent
producentland: Kina
status: i_produktion
felter:
`;

/** Hvert tilfaelde: [navn, forventet regelkode, felter-blok]. */
const ITUSLAAEDE = [
  ['talfelt uden enhed', 'R5',
    `  egenvaegt:\n    vaerdi: 60\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['talfelt uden kilde', 'R6',
    `  egenvaegt:\n    vaerdi: 60\n    enhed: kg\n    hentet: 2026-08-19\n`],
  ['talfelt uden hentedato', 'R7',
    `  egenvaegt:\n    vaerdi: 60\n    enhed: kg\n    kilde: https://example.com/a\n`],
  ['kilde er ikke en URL', 'R6',
    `  egenvaegt:\n    vaerdi: 60\n    enhed: kg\n    kilde: produktsiden\n    hentet: 2026-08-19\n`],
  ['ukendt operator', 'R8',
    `  egenvaegt:\n    vaerdi: 60\n    enhed: kg\n    operator: ">>"\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['Ghost: 2.4 m/s mod 4.9 mph afviger 9 %', 'R9',
    `  hastighed:\n    vaerdi: 2.4\n    enhed: m/s\n    vaerdi_imperial: 4.9\n    enhed_imperial: mph\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['Spot: 110 mm mod 43.3 in, faktor 10', 'R9',
    `  laengde:\n    vaerdi: 110\n    enhed: mm\n    vaerdi_imperial: 43.3\n    enhed_imperial: in\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['driftstid uden lastbetingelse', 'R10',
    `  driftstid:\n    vaerdi: 90\n    enhed: min\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['ukendt feltnavn (tastefejl)', 'R2',
    `  egenvagt:\n    vaerdi: 60\n    enhed: kg\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['ugyldig tilstand', 'R3',
    `  egenvaegt: ukendt\n`],
  ['bart tal uden enhed, kilde og dato', 'R4',
    `  egenvaegt: 60\n`],
  ['interval med kun min', 'R4',
    `  trappetrin_kontinuerlig:\n    min: 20\n    enhed: cm\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  // "vaerdi: ja" ER gyldigt: dataskriveren skriver producentens svar paa dansk, og
  // normaliseringen oversaetter det til true ét sted. Kravet er ikke blevet
  // mildere, det er blevet praecist - et ord, der hverken er ja eller nej, fejler
  // stadig. Se ogsaa GYLDIGE nedenfor, som beviser den anden halvdel.
  ['ja/nej-felt med et ord, der hverken er ja eller nej', 'R4',
    `  ros2:\n    vaerdi: maaske\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['ja/nej-felt med et tal', 'R4',
    `  ros2:\n    vaerdi: 1\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],

  // Skemaudvidelse 1 - tilstanden med herkomst. Den giver LOV til at skrive
  // "ikke_oplyst" som en post, men den fritager ikke for kilde og hentedato.
  ['tilstand som post uden kilde', 'R6',
    `  batteri_wh:\n    vaerdi: ikke_oplyst\n    hentet: 2026-08-19\n`],
  ['tilstand som post uden hentedato', 'R7',
    `  batteri_wh:\n    vaerdi: ikke_oplyst\n    kilde: https://example.com/a\n`],
  ['tilstand som post med enhed - "ikke oplyst kg" findes ikke', 'R4',
    `  batteri_wh:\n    vaerdi: ikke_oplyst\n    enhed: Wh\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['tilstand som post med lastbetingelse - den betinger ingenting', 'R10',
    `  driftstid:\n    vaerdi: ikke_oplyst\n    ved_last: ikke_oplyst\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['lastbetingelse paa et felt, der ikke kraever en', 'R10',
    `  ladetid:\n    vaerdi: 3\n    enhed: t\n    ved_last: ikke_oplyst\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],

  // Skemaudvidelse 2 - varianter. Fire varianter er fire maskiner, men de skal
  // hedde det samme i hele filen, ellers taler to felter om hver sin "Pro".
  ['varianter paa et felt, men ingen variantliste paa robotten', 'R15',
    `  egenvaegt:\n    vaerdi: 12\n    enhed: kg\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n    varianter:\n      Basic: 12\n`],

  // Enheder. Aliasserne er dimensionsbundne: "C" er Celsius i et temperaturfelt
  // og ingenting alle andre steder.
  ['"C" som masseenhed er stadig ukendt', 'R5',
    `  egenvaegt:\n    vaerdi: 60\n    enhed: C\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['procent som masseenhed er stadig forkert dimension', 'R5',
    `  egenvaegt:\n    vaerdi: 60\n    enhed: procent\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['tekstfelt med et halvt interval ved siden af ordlyden', 'R4',
    `  stroem_ud:\n    vaerdi: "ureguleret DC 35-58,8 V"\n    vaerdi_min: 35\n    enhed: V\n` +
    `    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['tekstfelt med interval uden enhed', 'R5',
    `  stroem_ud:\n    vaerdi: "ureguleret DC 35-58,8 V"\n    vaerdi_min: 35\n    vaerdi_maks: 58.8\n` +
    `    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['begge stavemaader af min i samme post', 'R11',
    `  hoejde:\n    vaerdi_min: 13\n    min: 20\n    vaerdi_maks: 50\n    enhed: cm\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['ukendt noegle i feltposten', 'R11',
    `  egenvaegt:\n    vaardi: 60\n    enhed: kg\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['enhed af forkert dimension', 'R5',
    `  egenvaegt:\n    vaerdi: 60\n    enhed: mm\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['ugyldig IP-klasse', 'R13',
    `  ip_klasse:\n    vaerdi: vandtaet\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['raastreng med &gt;, operator tabt', 'R12',
    `  egenvaegt:\n    vaerdi: 60\n    enhed: kg\n    raa: "&gt; 60 kg"\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['raastreng med U+00A0, enhed passer ikke', 'R12',
    `  hastighed:\n    vaerdi: 1.5\n    enhed: km/h\n    raa: "1.5 m/s"\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['YAML 1.1-boolean', 'R0',
    `  ros2: no\n`],
  ['tabulator i indrykningen', 'R0',
    `  egenvaegt:\n\tvaerdi: 60\n`],
];

/** Tilfaelde, der rammer identiteten frem for et felt. */
const ITUSLAAEDE_HOVED = [
  ['status med mellemrum i stedet for understreg', 'R1',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i produktion\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['slug passer ikke til filnavnet', 'R14',
    `slug: en-anden-slug\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['producent mangler', 'R1',
    `slug: NAVN\nnavn: Proeve\nproducentland: Kina\nstatus: i_produktion\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['variantnavn paa et felt, som ikke staar paa robottens variantliste', 'R15',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\n` +
    `varianter: [Basic, Pro]\nfelter:\n  egenvaegt:\n    vaerdi: 12\n    enhed: kg\n` +
    `    kilde: https://example.com/a\n    hentet: 2026-08-19\n    varianter:\n      Basic: 12\n      Prox: 13\n`],
  ['variantlisten er ikke en liste', 'R15',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\n` +
    `varianter: Basic\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['noter er hverken tekst eller liste af tekst', 'R1',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\n` +
    `noter: 42\nfelter:\n  egenvaegt: ikke_oplyst\n`],

  // R16 - anvendelse. Feltet er bygget for IKKE at kunne baere vores mening.
  // Hvert tilfaelde nedenfor er en maade at snige en redaktionel kategori ind paa.
  ['anvendelse med kategori, men uden citat', 'R16',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\n` +
    `anvendelse:\n  vaerdi: industri\n  kilde: https://example.com/a\n  hentet: 2026-08-19\n` +
    `felter:\n  egenvaegt: ikke_oplyst\n`],
  ['anvendelse med kategori og citat, men uden kilde', 'R6',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\n` +
    `anvendelse:\n  vaerdi: industri\n  citat: "Robot - Industry"\n  hentet: 2026-08-19\n` +
    `felter:\n  egenvaegt: ikke_oplyst\n`],
  ['anvendelse med kategori og citat, men uden hentedato', 'R7',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\n` +
    `anvendelse:\n  vaerdi: industri\n  citat: "Robot - Industry"\n  kilde: https://example.com/a\n` +
    `felter:\n  egenvaegt: ikke_oplyst\n`],
  ['anvendelse med en kategori uden for det tilladte saet', 'R16',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\n` +
    `anvendelse:\n  vaerdi: landbrug\n  citat: "Agriculture"\n  kilde: https://example.com/a\n` +
    `  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['anvendelse ikke_oplyst, men med et citat alligevel', 'R16',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\n` +
    `anvendelse:\n  vaerdi: ikke_oplyst\n  citat: "ser industriel ud"\n  kilde: https://example.com/a\n` +
    `  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['anvendelse med tomt citat', 'R16',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\n` +
    `anvendelse:\n  vaerdi: industri\n  citat: ""\n  kilde: https://example.com/a\n` +
    `  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['anvendelse med samme kategori to gange', 'R16',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\n` +
    `anvendelse:\n  vaerdi: [industri, industri]\n  citat: "Robot - Industry"\n` +
    `  kilde: https://example.com/a\n  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['ukendt noegle i anvendelsesposten', 'R16',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\n` +
    `anvendelse:\n  vaerdi: industri\n  citaat: "Robot - Industry"\n  citat: "Robot - Industry"\n` +
    `  kilde: https://example.com/a\n  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['anvendelse som bar tekst, der ikke er en tilstand', 'R16',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\n` +
    `anvendelse: industri\nfelter:\n  egenvaegt: ikke_oplyst\n`],
];

/**
 * Tilfaelde, der SKAL passere. Uden dem beviser testen kun, at validatoren siger
 * nej — og en validator, der altid siger nej, bestaar den halvdel med glans.
 * Hvert tilfaelde er en af de to skemaudvidelser eller et af aliasserne.
 */
const GYLDIGE = [
  ['ja/nej-felt skrevet som "ja"',
    `  ros2:\n    vaerdi: ja\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['ja/nej-felt skrevet som "nej"',
    `  ros2:\n    vaerdi: nej\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['dokumenteret nul-svar: listefelt med tilstanden nej, kilde og forbehold',
    `  dataporte:\n    vaerdi: nej\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n` +
    `    advarsel: "CN skriver eksternt interface: INGEN. EN skriver /."\n`],
  ['dokumenteret ikke_oplyst med kilde',
    `  batteri_wh:\n    vaerdi: ikke_oplyst\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['IP-feltet som dokumenteret tilstand (R13 gaelder kun en rigtig IP-klasse)',
    `  ip_klasse:\n    vaerdi: ikke_oplyst\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['temperatur i "C"',
    `  temp_min:\n    vaerdi: -20\n    enhed: C\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['haeldning i procent - producentens egen enhed, uden omregning',
    `  haeldning:\n    vaerdi: 45\n    enhed: procent\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n` +
    `    advarsel: "OPLYST I PROCENT, IKKE I GRADER. 45 % = 24,2 grader."\n`],
  ['haeldning i grader - den anden dimension paa samme felt',
    `  haeldning:\n    vaerdi: 30\n    enhed: grader\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['interval skrevet som vaerdi_min/vaerdi_maks',
    `  hoejde:\n    vaerdi_min: 13\n    vaerdi_maks: 50\n    enhed: cm\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['tekstfelt med producentens ordlyd OG et maalbart interval med enhed',
    `  stroem_ud:\n    vaerdi: "ureguleret DC 35-58,8 V, 150 W pr. port"\n    vaerdi_min: 35\n` +
    `    vaerdi_maks: 58.8\n    enhed: V\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['frihedsgrader med DoF som enhed',
    `  frihedsgrader:\n    vaerdi: 12\n    enhed: DoF\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
  ['lastbetingelse, hvor producenten siger MED last, men ikke hvor meget',
    `  driftstid:\n    vaerdi: 2.5\n    enhed: t\n    operator: ">"\n    ved_last: { vaerdi: ikke_oplyst, enhed: kg }\n` +
    `    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
];

/** Gyldige tilfaelde med eget hoved - varianter kraever topnoeglen. */
const GYLDIGE_HOVED = [
  ['varianter paa et felt, med variantnavnene paa robotten',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\n` +
    `producentby: Poznan\nvarianter: [Basic, Venture, "A2-W PRO"]\nnoter:\n  - "en note"\n  - "og en til"\n` +
    `felter:\n  nyttelast_gaaende:\n    vaerdi: 5\n    enhed: kg\n    kilde: https://example.com/a\n` +
    `    hentet: 2026-08-19\n    varianter:\n      Basic: 5\n      Venture: 4.5\n      A2-W PRO: "IP56-IP67"\n`],

  // R16 - de former, anvendelsesfeltet SKAL kunne baere. Uden dem beviser
  // R16-tilfaeldene kun, at validatoren siger nej til alt, hvad der hedder
  // "anvendelse".
  ['anvendelse med én kategori og ét citat',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\n` +
    `anvendelse:\n  vaerdi: industri\n  citat: "Robot - Industry"\n  kilde: https://example.com/a\n` +
    `  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['anvendelse med flere kategorier og flere citater',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\n` +
    `anvendelse:\n  vaerdi: [industri, inspektion]\n  citat:\n    - "Robot - Industry"\n` +
    `    - "for industrial patrol inspection"\n  kilde: https://example.com/a\n  hentet: 2026-08-19\n` +
    `  kildetype: primaer\n  note: "Producentens egen navigation."\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['anvendelse ikke_oplyst MED kilde - vi kiggede, producenten sagde intet',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\n` +
    `anvendelse:\n  vaerdi: ikke_oplyst\n  kilde: https://example.com/a\n  hentet: 2026-08-19\n` +
    `  note: "GENNEMLAEST, INTET FUNDET."\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['anvendelse som bar tilstand uden kort',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\n` +
    `anvendelse: ikke_oplyst\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['robot helt uden anvendelse - feltet er valgfrit, ikke paakraevet',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\n` +
    `felter:\n  egenvaegt: ikke_oplyst\n`],
];

/* ------------------------------------------------------------------ koersel */

let bestaaet = 0, fejlet = 0;
const fejlliste = [];

function ok(navn, betingelse, detalje) {
  if (betingelse) { bestaaet++; console.log(`  ok    ${navn}`); }
  else { fejlet++; fejlliste.push(navn); console.log(`  FEJL  ${navn}${detalje ? ' — ' + detalje : ''}`); }
}

function koerValidator(args) {
  const r = spawnSync(node, [path.join(rod, 'tools', 'validate.mjs'), ...args],
    { cwd: rod, encoding: 'utf8' });
  return { kode: r.status, ud: (r.stdout || '') + (r.stderr || '') };
}

fs.rmSync(tmp, { recursive: true, force: true });
fs.mkdirSync(tmp, { recursive: true });

console.log('1. Selvtest af parser og normalisering');
{
  const r = koerValidator(['--selvtest']);
  ok('validatorens selvtest bestaar', r.kode === 0, r.ud.trim().split('\n').pop());
}

console.log('\n2. Bevidst oedelagte filer — fejler den, og fejler den paa den rigtige regel?');
const alle = [
  ...ITUSLAAEDE.map(([n, regel, felter], i) => [n, regel, GYLDIG_HOVED.replace('NAVN', `sag-${i}`) + felter, `sag-${i}`]),
  ...ITUSLAAEDE_HOVED.map(([n, regel, hele], i) => [n, regel, hele.replace('NAVN', `hoved-${i}`), `hoved-${i}`]),
];

let fangede = 0;
for (const [navn, regel, indhold, filnavn] of alle) {
  const fil = path.join(tmp, `${filnavn}.yaml`);
  fs.writeFileSync(fil, indhold, 'utf8');
  const r = koerValidator([fil]);
  const fejledeSomVentet = r.kode === 1 && new RegExp(`\\b${regel}:`).test(r.ud);
  if (fejledeSomVentet) fangede++;
  ok(`${navn}  ->  ${regel}`, fejledeSomVentet,
    r.kode !== 1 ? `exit ${r.kode}, forventede 1` : `ingen ${regel} i udskriften`);
}

console.log('\n2b. De to skemaudvidelser og aliasserne — skal PASSERE');
{
  const gyldige = [
    ...GYLDIGE.map(([n, felter], i) => [n, GYLDIG_HOVED.replace('NAVN', `gyldig-${i}`) + felter, `gyldig-${i}`]),
    ...GYLDIGE_HOVED.map(([n, hele], i) => [n, hele.replace('NAVN', `gyldigh-${i}`), `gyldigh-${i}`]),
  ];
  for (const [navn, indhold, filnavn] of gyldige) {
    const fil = path.join(tmp, `${filnavn}.yaml`);
    fs.writeFileSync(fil, indhold, 'utf8');
    const r = koerValidator([fil]);
    ok(navn, r.kode === 0, r.ud.trim().split('\n').filter((l) => l.startsWith('FEJL')).join(' / '));
  }
}

console.log('\n3. Gyldige filer maa IKKE fejle');
{
  const r = koerValidator([`--data=${path.join(rod, 'tests', 'eksempel-robotter')}`]);
  ok('de tre eksempelposter giver exit 0', r.kode === 0, r.ud.trim());
  ok('Spots imperial-afvigelse baeres som advarsel, ikke som fejl',
    /advarsel {2}boston-dynamics-spot . laengde . R9/.test(r.ud));
  const s = koerValidator([`--data=${path.join(rod, 'tests', 'eksempel-robotter')}`, '--streng']);
  ok('--streng goer den advarsel til en fejl igen (advarsel: er ingen lyddaemper)', s.kode === 1);

  // robotdata-skillen skriver "ikke oplyst" med mellemrum. Den maa ikke blokere en
  // hel dataindsamling, men den skal heller ikke passere ubemaerket.
  const mel = path.join(tmp, 'mellemrumsform.yaml');
  fs.writeFileSync(mel, GYLDIG_HOVED.replace('NAVN', 'mellemrumsform') + '  egenvaegt: ikke oplyst\n', 'utf8');
  const m = koerValidator([mel]);
  ok('"ikke oplyst" med mellemrum accepteres, men advares om',
    m.kode === 0 && /advarsel.*R3.*understreg/.test(m.ud), `exit ${m.kode}`);
}

console.log('\n4. Bygget');
const dist = path.join(tmp, 'dist');
{
  const r = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'),
    `--data=${path.join(rod, 'tests', 'eksempel-robotter')}`, `--ud=${dist}`],
    { cwd: rod, encoding: 'utf8' });
  ok('build.mjs giver exit 0', r.status === 0, (r.stderr || '').trim());

  const sider = [];
  (function gaa(m) {
    for (const f of fs.readdirSync(m, { withFileTypes: true })) {
      const p = path.join(m, f.name);
      if (f.isDirectory()) gaa(p); else if (f.name.endsWith('.html')) sider.push(p);
    }
  })(dist);
  ok(`11 HTML-sider bygget (fandt ${sider.length})`, sider.length === 11);

  const katalogDa = fs.readFileSync(path.join(dist, 'da', 'robotter', 'index.html'), 'utf8');
  const katalogEn = fs.readFileSync(path.join(dist, 'en', 'robotter', 'index.html'), 'utf8');
  const spotDa = fs.readFileSync(path.join(dist, 'da', 'robotter', 'boston-dynamics-spot', 'index.html'), 'utf8');

  ok('hreflang da + en + x-default paa detaljesiden',
    /hreflang="da"/.test(spotDa) && /hreflang="en"/.test(spotDa) && /hreflang="x-default"/.test(spotDa));
  ok('katalogets to sprog er reelt oversat (ikke samme tekst)',
    katalogDa.includes('Alle robotter') && katalogEn.includes('All robots'));
  // Landenavne er tekst og skal komme fra sprogfilen, ikke fra robottens YAML.
  ok('landenavne er oversat paa /en/ (Schweiz -> Switzerland)',
    katalogEn.includes('>Switzerland<') && !katalogEn.includes('>Schweiz<'));
  ok('ingen data-en-attributter noget sted i dist/',
    !sider.some((f) => /data-en\s*=/.test(fs.readFileSync(f, 'utf8'))));
  ok('ingen henvisning til media/ i dist/',
    !sider.some((f) => /["'(\/]media\//.test(fs.readFileSync(f, 'utf8'))));
  ok('ingen koebsknap eller affiliate-link i dist/',
    !sider.some((f) => /(affiliate|utm_|buy[-_ ]now|koeb nu)/i.test(fs.readFileSync(f, 'utf8'))));

  // De fire tilstande skal SE forskellige ud.
  const markoerer = ['tilstand--ikke-oplyst', 'tilstand--nej', 'tilstand--kun-billede', 'maerke--nul'];
  ok('alle fire tilstande har hver sin markoer i katalogets forklaring',
    markoerer.every((m) => katalogDa.includes(m)),
    markoerer.filter((m) => !katalogDa.includes(m)).join(', '));
  const css = fs.readFileSync(path.join(dist, 'stil.css'), 'utf8');
  ok('CSS giver hver tilstand sin egen regel (ikke kun farve)',
    markoerer.every((m) => new RegExp(`\\.${m.replace(/-/g, '\\-')}\\s*[,{]`).test(css)),
    markoerer.filter((m) => !new RegExp(`\\.${m.replace(/-/g, '\\-')}\\s*[,{]`).test(css)).join(', '));

  // "> 40 kg", ikke "40 kg" (regel 4). Testen laeser hele udtrykket, saa den ogsaa
  // fanger, hvis operatoren skulle havne et andet sted end foran tallet.
  ok('operatoren vises foran tallet: "> 40 kg"',
    /<span class="operator">&gt;<\/span> 40 <span class="enhed">kg<\/span>/.test(
      fs.readFileSync(path.join(dist, 'da', 'robotter', 'unitree-b2', 'index.html'), 'utf8')));
  ok('advarslen staar ved siden af vaerdien paa detaljesiden',
    /class="advarsel"/.test(spotDa) && spotDa.indexOf('class="advarsel"') > spotDa.indexOf('43,3 in'));
  ok('kilde og hentedato staar paa hvert tal',
    (spotDa.match(/class="herkomst"/g) || []).length >= 5);
  ok('taethed vises med baade 29 og 31 som naevner',
    spotDa.includes('5/29') && spotDa.includes('5/31'));

  const json = JSON.parse(fs.readFileSync(path.join(dist, 'robots.json'), 'utf8'));
  ok('robots.json har de tre robotter', json.robotter.length === 3);
  ok('robots.json er et lille indeks, ikke hele datasaettet',
    JSON.stringify(json).length < 8000, `${JSON.stringify(json).length} tegn`);

  // Uden JavaScript: hele kataloget skal staa i tabellen, og filtrene skal vaere skjult.
  const raekker = (katalogDa.match(/<tr data-slug=/g) || []).length;
  ok('kataloget staar fuldt renderet i HTML uden JS (3 raekker)', raekker === 3, `fandt ${raekker}`);
  ok('filterformularen er skjult, indtil JS taender den',
    /<form class="filter" id="filter" hidden>/.test(katalogDa));
}

/* ------------------------------------------------------------------------
   5. Det, der ikke maa gaa tabt paa vejen fra YAML til side.
   De tre eksempelposter roerer ingen af de nye former, saa uden en post, der
   goer det, ville hele skemaudvidelsen vaere ubevist paa visningssiden.
   ------------------------------------------------------------------------ */
console.log('\n5. Visningen af de nye former');
{
  const dataMappe = path.join(tmp, 'form-data');
  fs.mkdirSync(dataMappe, { recursive: true });
  fs.writeFileSync(path.join(dataMappe, 'proeve-alle-former.yaml'), [
    'slug: proeve-alle-former',
    'navn: Proeve Alle Former',
    'producent: Proeveproducent',
    'producentland: Kina',
    'producentby: Shenzhen',
    'status: i_produktion',
    'varianter: [AIR, PRO]',
    'noter:',
    '  - "foerste note"',
    '  - "anden note"',
    'felter:',
    // ja/nej skrevet som ord - "nej" maa ALDRIG lande som et ja
    '  ros2:',
    '    vaerdi: nej',
    '    kilde: https://example.com/a',
    '    hentet: 2026-08-19',
    '  hot_swap:',
    '    vaerdi: ja',
    '    kilde: https://example.com/a',
    '    hentet: 2026-08-19',
    // de fire tilstande ved siden af hinanden
    '  batteri_wh:',
    '    vaerdi: ikke_oplyst',
    '    kilde: https://example.com/a',
    '    hentet: 2026-08-19',
    '    advarsel: "producenten oplyser ingen kapacitet"',
    '  dataporte:',
    '    vaerdi: nej',
    '    kilde: https://example.com/a',
    '    hentet: 2026-08-19',
    '  nyttelast_staaende:',
    '    vaerdi: 0',
    '    enhed: kg',
    '    kilde: https://example.com/a',
    '    hentet: 2026-08-19',
    '  lidar: ikke_oplyst',
    // interval MED operator - "ca. 1-2 t" maa ikke blive til "1-2 t"
    '  driftstid:',
    '    vaerdi_min: 1',
    '    vaerdi_maks: 2',
    '    enhed: t',
    '    operator: "~"',
    '    ved_last: ikke_oplyst',
    '    kilde: https://example.com/a',
    '    hentet: 2026-08-19',
    // producentens egen enhed: procent, ikke grader
    '  haeldning:',
    '    vaerdi: 45',
    '    enhed: procent',
    '    kilde: https://example.com/a',
    '    hentet: 2026-08-19',
    // varianter: fire varianter er fire maskiner
    '  nyttelast_gaaende:',
    '    vaerdi: 5',
    '    enhed: kg',
    '    kilde: https://example.com/a',
    '    hentet: 2026-08-19',
    '    varianter:',
    '      AIR: 5',
    '      PRO: 2.5',
    '',
  ].join('\n'), 'utf8');

  const ud = path.join(tmp, 'dist-former');
  const r = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'),
    `--data=${dataMappe}`, `--ud=${ud}`], { cwd: rod, encoding: 'utf8' });
  ok('bygget gaar igennem med alle de nye former', r.status === 0,
    ((r.stdout || '') + (r.stderr || '')).trim().split('\n').slice(-4).join(' / '));

  const side = fs.readFileSync(path.join(ud, 'da', 'robotter', 'proeve-alle-former', 'index.html'), 'utf8');
  const katalog = fs.readFileSync(path.join(ud, 'da', 'robotter', 'index.html'), 'utf8');

  // Fortegnet er det, der gaar galt, hvis "nej" bliver laest som en sand streng.
  // Derfor laeses de to felters egne <dd>-blokke, ikke bare siden som helhed.
  const feltBlok = (etiket) => (side.match(
    new RegExp(`<dt>${etiket.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}</dt>\\s*<dd>([\\s\\S]*?)</dd>`)) || [])[1] ?? '';
  const ros2Blok = feltBlok('ROS 2');
  const hotBlok = feltBlok('Hot-swap af batteri');
  ok('"vaerdi: nej" paa et ja/nej-felt vises som nej, ikke som ja',
    ros2Blok.includes('vaerdi--nej') && ros2Blok.includes('✗') && !ros2Blok.includes('vaerdi--ja'),
    ros2Blok.slice(0, 90));
  ok('"vaerdi: ja" paa et ja/nej-felt vises som ja',
    hotBlok.includes('vaerdi--ja') && hotBlok.includes('✓') && !hotBlok.includes('vaerdi--nej'),
    hotBlok.slice(0, 90));
  ok('ikke_oplyst, nej og 0 ser stadig forskellige ud paa samme side',
    side.includes('tilstand--ikke-oplyst') && side.includes('tilstand--nej') && side.includes('maerke--nul'));
  ok('den dokumenterede tilstand baerer sin kilde',
    side.includes('tilstand--ikke-oplyst') && (side.match(/class="herkomst"/g) || []).length >= 6);
  ok('operatoren staar ogsaa foran et interval: "≈ 1–2 t"',
    /<span class="operator">≈<\/span> 1–2 <span class="enhed">t<\/span>/.test(side));
  ok('haeldningen vises i producentens procent, ikke omregnet til grader',
    /45 <span class="enhed">%<\/span>/.test(side) && !side.includes('24,2'));
  ok('varianterne staar paa siden med navn og vaerdi',
    /class="varianter"/.test(side) && side.includes('>AIR<') && side.includes('>PRO<') && side.includes('>2,5<'));
  ok('katalogtabellen markerer, at feltet har varianter',
    /maerke--varianter/.test(katalog));
  ok('advarslen staar stadig ved siden af vaerdien',
    side.indexOf('class="advarsel"') > side.indexOf('tilstand--ikke-oplyst'));
  ok('de to noter staar som to punkter, ikke som én sammenkoedet linje',
    /<ul class="noter"><li>foerste note<\/li><li>anden note<\/li><\/ul>/.test(side));

  const json = JSON.parse(fs.readFileSync(path.join(ud, 'robots.json'), 'utf8'));
  ok('robots.json holder ja/nej som boolean, ikke som teksten "nej"',
    json.robotter[0].felter.ros2 === false);
}

console.log(`\nValidator: ${alle.length} oedelagte tilfaelde, fangede ${fangede}.`);
console.log(`I alt: ${bestaaet} bestaaet, ${fejlet} fejlet.`);
if (fejlet) console.log(`Fejlede: ${fejlliste.join(' · ')}`);
process.exit(fejlet ? 1 : 0);
