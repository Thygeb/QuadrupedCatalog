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
  ['ja/nej-felt med tekst i stedet for true/false', 'R4',
    `  ros2:\n    vaerdi: ja\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
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
  ok('validatorens 10 selvtest bestaar', r.kode === 0, r.ud.trim().split('\n').pop());
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

console.log(`\nValidator: ${alle.length} oedelagte tilfaelde, fangede ${fangede}.`);
console.log(`I alt: ${bestaaet} bestaaet, ${fejlet} fejlet.`);
if (fejlet) console.log(`Fejlede: ${fejlliste.join(' · ')}`);
process.exit(fejlet ? 1 : 0);
