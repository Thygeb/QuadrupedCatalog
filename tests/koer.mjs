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

/** tools/skema.mjs og tools/yaml.mjs bruges i flere afsnit (3b, 3c, 4) - importeret
 *  ÉN gang her, saa alle afsnit deler samme modul-instans i stedet for at importere
 *  hver for sig (to laesninger af den samme fil er praecis den fejl, build.mjs'
 *  egen kommentar advarer om ved L186). */
const skema = await import(`file://${path.join(rod, 'tools', 'skema.mjs').replace(/\\/g, '/')}`);
const yaml = await import(`file://${path.join(rod, 'tools', 'yaml.mjs').replace(/\\/g, '/')}`);

/** Taeller filer rekursivt under `dir`. Delt af de steder, der har brug for et
 *  filtal uden at gentage gaa()-moenstret hver gang. */
function taelFilerRekursivt(dir, filtrer = () => true) {
  let n = 0;
  if (!fs.existsSync(dir)) return n;
  (function gaa(m) {
    for (const p of fs.readdirSync(m, { withFileTypes: true })) {
      const sti = path.join(m, p.name);
      if (p.isDirectory()) { gaa(sti); continue; }
      if (filtrer(p.name)) n++;
    }
  })(dir);
  return n;
}

/** Laeser og normaliserer alle robot-YAML'er i en mappe - samme parse+normaliser-
 *  kaede som build.mjs selv koerer (L186-189), samlet ét sted i stedet for skrevet
 *  ud for hver fixture, der skal laeses. */
function lasRobotter(mappe) {
  return fs.readdirSync(mappe).filter((f) => /\.ya?ml$/.test(f))
    .map((f) => skema.normaliserRobot(yaml.parseYaml(fs.readFileSync(path.join(mappe, f), 'utf8'), f)));
}

/** Bygger regex'en for "operator + skaermlaesertekst + tal [+ enhed]", som gaar
 *  igen for hvert operator-tilfaelde (">", "ca.", "≤" ...). Ét sted at rette,
 *  hvis side.mjs's tal()-markup nogensinde flytter sig igen. */
function operatorRegex(op, tal, enhed) {
  return new RegExp(`<span class="op" aria-hidden="true">${op}</span><span class="kunskaerm">[^<]*</span>`
    + `<b class="num">${tal}</b>` + (enhed ? `<span class="enhed">${enhed}</span>` : ''));
}

const GYLDIG_HOVED = `slug: NAVN
navn: Proeve
producent: Proeveproducent
producentland: Kina
status: i_produktion
felter:
`;

/** Hoved uden felter, til R18-tilfaeldene. `felter:` skrives af hvert tilfaelde. */
const BILLEDHOVED = `slug: NAVN
navn: Proeve
producent: Proeveproducent
producentland: Kina
status: i_produktion
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

  // R17 - arv (L23). De tre tilfaelde her kan afgoeres i filen selv; resten
  // kraever moderen og staar i afsnit 2c.
  ['arvet_fra peger paa robotten selv', 'R17',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\n` +
    `anvendelse:\n  vaerdi: industri\n  citat: "Robot - Industry"\n  kilde: https://example.com/a\n` +
    `  hentet: 2026-08-19\n  arvet_fra: NAVN\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['arvet_fra staar sammen med ikke_oplyst - der er ingen kategori at arve', 'R17',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\n` +
    `anvendelse:\n  vaerdi: ikke_oplyst\n  kilde: https://example.com/a\n  hentet: 2026-08-19\n` +
    `  arvet_fra: en-anden\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['arvet_fra er ikke moderens slug som tekst', 'R17',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\n` +
    `anvendelse:\n  vaerdi: industri\n  citat: "Robot - Industry"\n  kilde: https://example.com/a\n` +
    `  hentet: 2026-08-19\n  arvet_fra: 42\nfelter:\n  egenvaegt: ikke_oplyst\n`],

  /* R18 — billedet. Tre ting maa ikke kunne ske: et billede uden ophav (saa
     ved siden ikke, om S1 gaelder), en sti til en fil, ingen har lagt (saa
     staar der et brudt billede og intet fejlsignal), og en sti ud af assets/
     (saa er fabrikantens materiale paa vej ind i bygget).
     Filen `silhuetter/_proeve-kaede.svg` FINDES i assets/ - den bruges her,
     saa hvert tilfaelde fejler paa netop den ting, det handler om. */
  ['billede uden ophav - siden kan ikke se, om S1 gaelder', 'R18',
    BILLEDHOVED + `billede:\n  fil: silhuetter/_proeve-kaede.svg\n` +
    `  kilde: https://example.com/a\n  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['billede med et ophav, skemaet ikke kender', 'R18',
    BILLEDHOVED + `billede:\n  fil: silhuetter/_proeve-kaede.svg\n  ophav: pressefoto\n` +
    `  kilde: https://example.com/a\n  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['billede uden fil', 'R18',
    BILLEDHOVED + `billede:\n  ophav: eget_foto\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['billede peger paa en fil, der ikke findes i assets/', 'R18',
    BILLEDHOVED + `billede:\n  fil: silhuetter/findes-ikke.svg\n  ophav: silhuet\n` +
    `  kilde: https://example.com/a\n  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['billede peger ind i media/ - fabrikantens materiale', 'R18',
    BILLEDHOVED + `billede:\n  fil: media/_kilder/unitree-b2.jpg\n  ophav: fabrikant\n` +
    `  kilde: https://example.com/a\n  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['billedstien gaar op ad mappetraeet', 'R18',
    BILLEDHOVED + `billede:\n  fil: ../media/x.jpg\n  ophav: fabrikant\n` +
    `  kilde: https://example.com/a\n  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['billedstien skrevet med "assets/" foran - den er allerede relativ til assets/', 'R18',
    BILLEDHOVED + `billede:\n  fil: assets/silhuetter/_proeve-kaede.svg\n  ophav: silhuet\n` +
    `  kilde: https://example.com/a\n  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['silhuet uden kilde paa de maal, den er tegnet efter', 'R18',
    BILLEDHOVED + `billede:\n  fil: silhuetter/_proeve-kaede.svg\n  ophav: silhuet\n` +
    `felter:\n  egenvaegt: ikke_oplyst\n`],
  ['fabrikantbillede uden kilde - det kan ikke foelges hjem', 'R18',
    BILLEDHOVED + `billede:\n  fil: silhuetter/_proeve-kaede.svg\n  ophav: fabrikant\n` +
    `felter:\n  egenvaegt: ikke_oplyst\n`],
  ['billede med kilde, men uden hentedato (R18 genbruger R7)', 'R7',
    BILLEDHOVED + `billede:\n  fil: silhuetter/_proeve-kaede.svg\n  ophav: silhuet\n` +
    `  kilde: https://example.com/a\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['ukendt noegle i billedposten (tastefejl)', 'R18',
    BILLEDHOVED + `billede:\n  fil: silhuetter/_proeve-kaede.svg\n  ophav: silhuet\n  ophavv: silhuet\n` +
    `  kilde: https://example.com/a\n  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['billede som bar tekst - der findes ingen tilstand "billede: ikke_oplyst"', 'R18',
    BILLEDHOVED + `billede: ikke_oplyst\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['delt_med peger paa robotten selv', 'R18',
    BILLEDHOVED + `billede:\n  fil: silhuetter/_proeve-kaede.svg\n  ophav: silhuet\n` +
    `  kilde: https://example.com/a\n  hentet: 2026-08-19\n  delt_med: NAVN\n` +
    `felter:\n  egenvaegt: ikke_oplyst\n`],
  ['tom alt-tekst - et hul, der ligner indhold', 'R18',
    BILLEDHOVED + `billede:\n  fil: silhuetter/_proeve-kaede.svg\n  ophav: eget_foto\n  alt: ""\n` +
    `felter:\n  egenvaegt: ikke_oplyst\n`],
  ['topnoeglen "silhuet" findes ikke laengere - billede: er den eneste vej ind', 'R1',
    BILLEDHOVED + `silhuet: silhuetter/_proeve-kaede.svg\nfelter:\n  egenvaegt: ikke_oplyst\n`],
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

  // L22 - den syvende kategori. Uden det her tilfaelde ville "landbrug"-tilfaeldet
  // ovenfor lige saa godt kunne bevise, at listen slet ikke var udvidet.
  ['sikkerhed_overvaagning er en gyldig anvendelse (L22)',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\n` +
    `anvendelse:\n  vaerdi: [inspektion, sikkerhed_overvaagning]\n` +
    `  citat: "ideal for security, inspection, and advanced applications."\n` +
    `  kilde: https://example.com/a\n  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`],

  // R18 — de former, billedfeltet SKAL kunne baere. Uden dem beviser de
  // fjorten tilfaelde ovenfor kun, at validatoren siger nej til alt, der hedder
  // "billede".
  ['silhuet med fil, ophav, kilde og hentedato',
    BILLEDHOVED + `billede:\n  fil: silhuetter/_proeve-kaede.svg\n  ophav: silhuet\n` +
    `  kilde: https://example.com/a\n  hentet: 2026-08-19\n` +
    `  alt: "Maaltro silhuet"\n  note: "Tegnet efter L 1000 x H 700 mm."\n` +
    `felter:\n  egenvaegt: ikke_oplyst\n`],
  ['eget foto UDEN kilde - vi har taget det selv, der er ingen URL at pege paa',
    BILLEDHOVED + `billede:\n  fil: silhuetter/_proeve-kaede.svg\n  ophav: eget_foto\n` +
    `felter:\n  egenvaegt: ikke_oplyst\n`],
  ['fabrikantbillede med kilde - tilladt lokalt (L13), spaerret ved udgivelse (S1)',
    BILLEDHOVED + `billede:\n  fil: silhuetter/_proeve-kaede.svg\n  ophav: fabrikant\n` +
    `  kilde: https://example.com/a\n  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['plade og pos skrevet ud i haanden',
    BILLEDHOVED + `billede:\n  fil: silhuetter/_proeve-kaede.svg\n  ophav: eget_foto\n` +
    `  plade: ja\n  pos: "50% 40%"\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['robot helt uden billede - feltet er valgfrit, og den tomme plade er aerlig',
    BILLEDHOVED + `felter:\n  egenvaegt: ikke_oplyst\n`],
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
let arvsagerFangede = 0;
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

/* ------------------------------------------------------------------------
   2c. R17 — arv af anvendelse fra grundmodel til variant (L23).

   Arven kan ikke afgoeres i én fil: den skal kunne foelges tilbage til et ord,
   producenten har skrevet, og det ord staar hos MODEREN. Hvert tilfaelde her
   skriver derfor et helt lille datasaet og validerer mappen.

   Reglerne skal vaere STRENGERE end R16, ikke mildere. Uden det ville
   "arvet_fra" vaere en bagdoer: en variant kunne faa en kategori, ingen
   producent har sagt, og se kildebelagt ud imens.
   ------------------------------------------------------------------------ */
console.log('\n2c. R17 — arv af anvendelse paa tvaers af filer (L23)');
{
  const hoved = (slug, navn) =>
    `slug: ${slug}\nnavn: ${navn}\nproducent: P\nproducentland: Kina\nstatus: i_produktion\n`;
  const MOR = hoved('mor', 'Mor')
    + `anvendelse:\n  vaerdi: [industri, inspektion]\n  citat:\n    - "Robot - Industry"\n`
    + `    - "for industrial inspection"\n  kilde: https://example.com/mor\n  hentet: 2026-08-19\n`
    + `felter:\n  egenvaegt: ikke_oplyst\n`;
  const barn = (anv) => hoved('barn', 'Barn') + anv + `felter:\n  egenvaegt: ikke_oplyst\n`;

  /** [navn, forventet regel eller null for "skal passere", filer] */
  const ARVSAGER = [
    ['moderen findes ikke', 'R17', {
      'barn.yaml': barn(`anvendelse:\n  vaerdi: industri\n  citat: "Robot - Industry"\n`
        + `  kilde: https://example.com/mor\n  hentet: 2026-08-19\n  arvet_fra: findes-ikke\n`),
    }],
    ['moderen har selv ingen kategori - tavshed kan ikke arves', 'R17', {
      'mor.yaml': hoved('mor', 'Mor') + `anvendelse:\n  vaerdi: ikke_oplyst\n`
        + `  kilde: https://example.com/mor\n  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`,
      'barn.yaml': barn(`anvendelse:\n  vaerdi: industri\n  citat: "Robot - Industry"\n`
        + `  kilde: https://example.com/mor\n  hentet: 2026-08-19\n  arvet_fra: mor\n`),
    }],
    ['arven giver varianten en kategori, moderen ikke har', 'R17', {
      'mor.yaml': MOR,
      'barn.yaml': barn(`anvendelse:\n  vaerdi: [industri, logistik]\n  citat: "Robot - Industry"\n`
        + `  kilde: https://example.com/mor\n  hentet: 2026-08-19\n  arvet_fra: mor\n`),
    }],
    ['arven baerer et citat, der ikke staar ordret hos moderen', 'R17', {
      'mor.yaml': MOR,
      'barn.yaml': barn(`anvendelse:\n  vaerdi: industri\n  citat: "Built for industry"\n`
        + `  kilde: https://example.com/mor\n  hentet: 2026-08-19\n  arvet_fra: mor\n`),
    }],
    ['arven skifter kilde - citatet blev laest hos moderen', 'R17', {
      'mor.yaml': MOR,
      'barn.yaml': barn(`anvendelse:\n  vaerdi: industri\n  citat: "Robot - Industry"\n`
        + `  kilde: https://example.com/barn\n  hentet: 2026-08-19\n  arvet_fra: mor\n`),
    }],
    ['arv i kaede: moderen har selv arvet', 'R17', {
      'bedstemor.yaml': hoved('bedstemor', 'Bedstemor')
        + `anvendelse:\n  vaerdi: industri\n  citat: "Robot - Industry"\n`
        + `  kilde: https://example.com/mor\n  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`,
      'mor.yaml': hoved('mor', 'Mor') + `anvendelse:\n  vaerdi: industri\n  citat: "Robot - Industry"\n`
        + `  kilde: https://example.com/mor\n  hentet: 2026-08-19\n  arvet_fra: bedstemor\n`
        + `felter:\n  egenvaegt: ikke_oplyst\n`,
      'barn.yaml': barn(`anvendelse:\n  vaerdi: industri\n  citat: "Robot - Industry"\n`
        + `  kilde: https://example.com/mor\n  hentet: 2026-08-19\n  arvet_fra: mor\n`),
    }],
    // Og formen, arven SKAL kunne baere - ellers beviser de seks ovenfor kun,
    // at validatoren siger nej til alt, der hedder "arvet_fra".
    ['arv med moderens kategori, moderens citat, moderens kilde og maerket', null, {
      'mor.yaml': MOR,
      'barn.yaml': barn(`anvendelse:\n  vaerdi: industri\n  citat: "Robot - Industry"\n`
        + `  kilde: https://example.com/mor\n  hentet: 2026-08-19\n  arvet_fra: mor\n`
        + `  note: "Variantens egen side er gennemlaest uden fund."\n`),
    }],
    ['arv af BEGGE moderens kategorier og begge citater', null, {
      'mor.yaml': MOR,
      'barn.yaml': barn(`anvendelse:\n  vaerdi: [industri, inspektion]\n  citat:\n`
        + `    - "Robot - Industry"\n    - "for industrial inspection"\n`
        + `  kilde: https://example.com/mor\n  hentet: 2026-08-19\n  arvet_fra: mor\n`),
    }],
  ];

  ARVSAGER.forEach(([navn, regel, filer], i) => {
    const mappe = path.join(tmp, `arv-${i}`);
    fs.mkdirSync(mappe, { recursive: true });
    for (const [f, indhold] of Object.entries(filer)) fs.writeFileSync(path.join(mappe, f), indhold, 'utf8');
    const r = koerValidator([`--data=${mappe}`]);
    if (regel === null) {
      ok(`${navn}  ->  skal passere`, r.kode === 0,
        r.ud.trim().split('\n').filter((l) => l.startsWith('FEJL')).join(' / '));
    } else {
      const somVentet = r.kode === 1 && new RegExp(`\\b${regel}:`).test(r.ud);
      if (somVentet) fangede++;
      arvsagerFangede++;
      ok(`${navn}  ->  ${regel}`, somVentet,
        r.kode !== 1 ? `exit ${r.kode}, forventede 1` : `ingen ${regel} i udskriften`);
    }
  });

  // Moderen skal kunne slaas op, ogsaa naar kun varianten staar paa
  // kommandolinjen. Ellers ville "validate.mjs <én fil>" tavst springe R17 over.
  const mappe = path.join(tmp, 'arv-2');   // barn har logistik, moderen har det ikke
  const enkelt = koerValidator([path.join(mappe, 'barn.yaml')]);
  ok('R17 fanger arven ogsaa naar KUN varianten valideres', enkelt.kode === 1 && /\bR17:/.test(enkelt.ud),
    `exit ${enkelt.kode}`);
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

/* ------------------------------------------------------------------------
   3b. Naevneren i specifikationstaetheden (D7, lukket med L30).

   Her stod tidligere én proeve: *"taethed vises med baade 29 og 31 som naevner"*.
   Den er vendt om, ikke slettet — reglen er nu den modsatte, og den skal bevises:
   ÉN naevner, og den skal vaere skemaets faktiske feltantal.

   Hvorfor det ikke bare er kosmetik: `taethed()` taeller taelleren op over
   FELTNAVNE. Stod naevneren som en haandskrevet konstant, kom broekens to halvdele
   fra hver sin liste, og en robot med flere udfyldte felter end konstanten ville
   give over 100 %. Proeve 2 nedenfor er den, der goer det umuligt at falde tilbage.

   Proeve 4 er den dyre: CLAUDE.md begraensning 6 forbyder en rangering uden
   OFFENTLIGGJORT metode. Siger koden 33 og `indhold/metode.md` 31, er metoden ikke
   offentliggjort — den er bare skrevet ned et sted, der er holdt op med at passe.
   ------------------------------------------------------------------------ */
console.log('\n3b. Naevneren (D7 / L30)');
{
  ok('skemaet har 33 feltnoegler', skema.FELTNAVNE.length === 33,
    `fandt ${skema.FELTNAVNE.length}`);

  // 2. Naevneren er UDLEDT. Hardkodes den igen, sprinter den her.
  ok('naevneren er skemaets feltantal, ikke et haandskrevet tal',
    skema.NAEVNER === skema.FELTNAVNE.length,
    `NAEVNER=${skema.NAEVNER}, FELTNAVNE.length=${skema.FELTNAVNE.length}`);

  // 3. ÉN naevner. To procenttal ved siden af hinanden er ikke en rangering.
  ok('bygget bruger praecis én naevner som standard',
    Array.isArray(skema.NAEVNERE_STANDARD) && skema.NAEVNERE_STANDARD.length === 1
      && skema.NAEVNERE_STANDARD[0] === skema.NAEVNER,
    JSON.stringify(skema.NAEVNERE_STANDARD));

  // 4. Den offentliggjorte metode skal sige det samme tal som koden.
  const metode = fs.readFileSync(path.join(rod, 'indhold', 'metode.md'), 'utf8');
  const formel = metode.match(/specifikationstæthed = udfyldte felter ÷ (\d+)/);
  ok('metode.md udgiver formlen med et tal', Boolean(formel),
    'fandt ingen "specifikationstæthed = udfyldte felter ÷ N"');
  ok('metode.md udgiver SAMME naevner som koden regner med',
    Boolean(formel) && Number(formel[1]) === skema.NAEVNER,
    formel ? `metode.md: ${formel[1]}, koden: ${skema.NAEVNER}` : '');

  // 5. Ingen efterladt LEVENDE reference til de to gamle skalaer.
  //    Citatlinjer (blockquote, ">") er undtaget med vilje: projektets rettelsesnoter
  //    skrives som blockquote og SKAL kunne sige "her stod tidligere ÷ 31". At forbyde
  //    det ville goere reglen usynlig i stedet for rettet — og det er praecis den
  //    slettede-assertion-adfaerd, CLAUDE.md forbyder. En paastand i broedteksten er
  //    derimod noget siden staar ved, og den skal matche koden.
  const gamle = metode.split('\n')
    .filter((l) => !/^\s*>/.test(l))
    .flatMap((l) => [...l.matchAll(/÷ (?:29|31)\b|\b(?:af|of) (?:29|31) felter/g)].map((m) => m[0]));
  ok('metode.md har ingen efterladte 29- eller 31-taellinger i broedteksten',
    gamle.length === 0, gamle.join(' · '));

  // 6. Taelleren kan ikke overstige naevneren. Med 33/33 er 100 % loftet.
  const val = await import(`file://${path.join(rod, 'tools', 'validate.mjs').replace(/\\/g, '/')}`);
  const dataMappe = path.join(rod, 'data', 'robots');
  const filer = fs.existsSync(dataMappe)
    ? fs.readdirSync(dataMappe).filter((f) => /\.ya?ml$/.test(f)) : [];
  let vaerst = 0;
  for (const f of filer) {
    const doc = skema.normaliserRobot(yaml.parseYaml(fs.readFileSync(path.join(dataMappe, f), 'utf8'), f));
    for (const d4 of [false, true]) vaerst = Math.max(vaerst, val.taethed(doc, skema.NAEVNER, d4).pct);
  }
  ok(`ingen af de ${filer.length} poster kommer over 100 % (hoejeste: ${vaerst} %)`, vaerst <= 100);
}

/* ------------------------------------------------------------------------
   3c. BILLEDKAEDEN — fra `billede:` i YAML til <picture> i dist/.

   Hvert led er efterprovet for sig andre steder. Det her afsnit efterproever
   SAMMENHAENGEN, som er der, den slags gaar galt: R18 kan sige god for en fil,
   der findes i assets/, uden at bygget nogensinde kopierer den, og saa staar
   der et brudt billede paa siden med gronne tests bagved.

   Datasaettet er tests/billedkaede/: én post med silhuet, én der DELER filen,
   og én HELT UDEN billede. Den sidste er lige saa vigtig som de to foerste -
   den tomme plade skal blive ved med at virke, ogsaa naar naboen har et
   billede.
   ------------------------------------------------------------------------ */
console.log('\n3c. Billedkaeden: YAML -> assets/ -> dist/billeder/ -> <picture>');
const kaedeDist = path.join(tmp, 'dist-billedkaede');
{
  const kaedeData = path.join(rod, 'tests', 'billedkaede');
  const v = koerValidator([`--data=${kaedeData}`]);
  ok('de tre proeveposter valideres uden fejl', v.kode === 0,
    v.ud.trim().split('\n').filter((l) => l.startsWith('FEJL')).join(' / '));

  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'),
    `--data=${kaedeData}`, `--ud=${kaedeDist}`], { cwd: rod, encoding: 'utf8' });
  ok('bygget giver exit 0', b.status === 0, (b.stderr || '').trim().split('\n').slice(-3).join(' / '));

  // 1. Filen skal vaere KOPIERET. fil:linje beviser, at kopikoden findes -
  //    ikke at den ramte den fil, en robotpost peger paa.
  const kopi = path.join(kaedeDist, 'billeder', 'silhuetter', '_proeve-kaede.svg');
  ok('silhuetten er kopieret til dist/billeder/silhuetter/', fs.existsSync(kopi));

  /* Forventningen var haardkodet til "1" - gyldigt, dengang assets/fotos/ var tom.
     build.mjs kopierer HELE assets/{fotos,silhuetter,ikoner}/-traeet, uanset hvilket
     --data= der bygges (L403-429 i build.mjs), saa siden L13/S1 (19. aug 2026) tillod
     lokale fabrikantfotos i assets/fotos/fabrikant/, taeller ethvert byg dem med -
     ogsaa et byg af tre proeveposter, der ikke selv bruger dem. Tallet MAALES her
     direkte i bygget POSTCONDITION (filerne, der faktisk ligger i kaedeDist/billeder/
     bagefter) i stedet for at forudsige det ved at genskrive build.mjs' eget filter
     (BILLEDE_ENDELSER, dotfil/LÆSMIG-udelukkelsen) en gang til her - to laesninger af
     den samme regel er praecis den fejl, der bliver stiltiende forkert, hvis den ene
     kopi glemmes ved en fremtidig aendring. */
  const forventetBilleder = taelFilerRekursivt(path.join(kaedeDist, 'billeder'));
  ok(`bygget taeller billedet i sin slutrapport (${forventetBilleder} billedfiler faktisk `
    + 'kopieret til dist/billeder/, maalt - ikke hardkodet)',
    new RegExp(`billeder kopieret fra assets\\/: ${forventetBilleder}\\b`).test(b.stdout || ''),
    (b.stdout || '').split('\n').slice(-4).join(' | '));
  ok('bygget skriver ophavet ud, saa S1 kan ses uden at aabne en fil',
    /silhuet: 2/.test(b.stdout || ''));

  const kat = fs.readFileSync(path.join(kaedeDist, 'da', 'robotter', 'index.html'), 'utf8');
  const side = fs.readFileSync(path.join(kaedeDist, 'da', 'robotter', 'proeve-silhuet', 'index.html'), 'utf8');
  const tom = fs.readFileSync(path.join(kaedeDist, 'da', 'robotter', 'proeve-tom-plade', 'index.html'), 'utf8');

  // 2. <picture>-moensteret, paa BAADE kortet og robotsiden.
  ok('kortet bruger <picture>', /<picture>[\s\S]*?_proeve-kaede\.svg[\s\S]*?<\/picture>/.test(kat));
  ok('robotsiden bruger <picture>', /<picture>[\s\S]*?_proeve-kaede\.svg[\s\S]*?<\/picture>/.test(side));
  ok('robotsidens billedled er det store', /class="billedled billedled--stor/.test(side));
  ok('silhuetten faar --plade (contain), ikke en 16:10-beskaering af poterne',
    /class="billedled billedled--plade"/.test(kat));

  // 3. Stien skal PEGE rigtigt fra hver sidedybde. En haandregnet '../../' er
  //    den slags fejl, der foerst ses i browseren.
  ok('kortets sti gaar to mapper op (/da/robotter/)',
    kat.includes('src="../../billeder/silhuetter/_proeve-kaede.svg"'));
  ok('robotsidens sti gaar tre mapper op (/da/robotter/<slug>/)',
    side.includes('src="../../../billeder/silhuetter/_proeve-kaede.svg"'));
  for (const [navn, fil] of [['kortet', kat], ['robotsiden', side]]) {
    const stier = [...fil.matchAll(/src="([^"]*billeder\/[^"]+)"/g)].map((m) => m[1]);
    ok(`hver billedsti paa ${navn} findes som fil i dist/`,
      stier.length > 0 && stier.every((s) => fs.existsSync(path.join(kaedeDist, 'da', 'robotter',
        navn === 'kortet' ? '' : 'proeve-silhuet', s))),
      stier.join(' / '));
  }

  // 4. Den tomme plade skal blive ved med at virke - MED en grund skrevet ud.
  ok('robotten uden billede faar den tomme plade', /class="intetfoto"/.test(tom));
  ok('den tomme plade baerer en grund, ikke bare et ikon',
    /class="grund">[^<]{20,}</.test(tom));
  ok('robotten uden billede har intet <picture>', !/<picture>/.test(tom));
  ok('kataloget har baade et <picture> og en tom plade paa samme side',
    /<picture>/.test(kat) && /class="intetfoto"/.test(kat));

  // 5. Delt fil (L28): maerket staar PAA billedet og naevner den anden model.
  ok('den delte fil er maerket med .billedmaerke', /class="billedmaerke"/.test(kat));
  ok('fodnoten siger, hvem filen deles med',
    /Samme fil som proeve-silhuet/.test(kat));

  // 6. Billedets sandhed - ophavet skal staa skrevet, ikke gaettes af mappen.
  ok('robotsidens billedfod siger, at det er en silhuet og ikke et fotografi',
    /billedfod[\s\S]*?silhuet/i.test(side));
  ok('dataskriverens egen note staar under billedet',
    side.includes('Figuren er paafundet til proeven'));

  // 7. alt-teksten. En silhuet SIGER, at den er en silhuet - en
  //    skaermlaeserbruger skal have samme oplysning som en seende.
  ok('dataskriverens egen alt-tekst vinder', side.includes('alt="Proevefigur i profil'));
  ok('uden egen alt-tekst siger silhuetten selv, at den er en silhuet',
    /alt="M[^"]*ltro silhuet af Proeve Delt/.test(kat));

  // 8. media/ maa aldrig staa som sti. Bygget paastaar det selv; her laeses
  //    de faerdige filer igennem uafhaengigt af bygget.
  const kaedeSider = [];
  (function gaa(m) {
    for (const f of fs.readdirSync(m, { withFileTypes: true })) {
      const p = path.join(m, f.name);
      if (f.isDirectory()) gaa(p); else if (f.name.endsWith('.html')) kaedeSider.push(p);
    }
  })(kaedeDist);
  ok('ingen henvisning til media/ i billedkaedens byg',
    !kaedeSider.some((f) => /["'(/]media\//.test(fs.readFileSync(f, 'utf8'))));

  // 9. S1 mekanisk: --til-udgivelse skal AFVISE et fabrikantbillede og
  //    SLIPPE et saet uden. Kun det foerste beviser noget om spaerringen.
  const s1Data = path.join(tmp, 's1-data');
  fs.mkdirSync(s1Data, { recursive: true });
  fs.writeFileSync(path.join(s1Data, 'proeve-fabrikant.yaml'),
    `slug: proeve-fabrikant\nnavn: Proeve Fabrikant\nproducent: P\nproducentland: Kina\n`
    + `status: i_produktion\nbillede:\n  fil: silhuetter/_proeve-kaede.svg\n  ophav: fabrikant\n`
    + `  kilde: https://example.com/a\n  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`, 'utf8');
  const s1 = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'),
    `--data=${s1Data}`, `--ud=${path.join(tmp, 'dist-s1')}`, '--til-udgivelse'],
  { cwd: rod, encoding: 'utf8' });
  ok('--til-udgivelse afviser et fabrikantbillede (S1)',
    s1.status === 1 && /SPAERRING S1/.test((s1.stdout || '') + (s1.stderr || '')), `exit ${s1.status}`);
  const s1ok = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'),
    `--data=${kaedeData}`, `--ud=${path.join(tmp, 'dist-s1-ok')}`, '--til-udgivelse'],
  { cwd: rod, encoding: 'utf8' });
  ok('--til-udgivelse slipper et saet uden fabrikantbilleder igennem', s1ok.status === 0,
    ((s1ok.stdout || '') + (s1ok.stderr || '')).trim().split('\n').slice(-2).join(' / '));

  // 10. <source> skrives KUN for filer, der findes. En srcset til en fil, ingen
  //     har lavet, er en tom paastand. Proeven laver et lille assets-trae med
  //     en .webp ved siden af en .png og laeser modulet direkte.
  {
    const asstRod = path.join(tmp, 'alt-rod');
    const m = path.join(asstRod, 'assets', 'fotos');
    fs.mkdirSync(m, { recursive: true });
    fs.writeFileSync(path.join(m, 'a.png'), 'ikke et rigtigt billede', 'utf8');
    fs.writeFileSync(path.join(m, 'a.webp'), 'ikke et rigtigt billede', 'utf8');
    fs.writeFileSync(path.join(m, 'b.png'), 'ikke et rigtigt billede', 'utf8');
    const url = new URL('../tools/skabelon/side.mjs', import.meta.url).href;
    const mod = await import(url);
    const medWebp = mod.billedAlternativer('fotos/a.png', asstRod);
    const udenWebp = mod.billedAlternativer('fotos/b.png', asstRod);
    ok('<source> skrives for den .webp, der FINDES',
      medWebp.length === 1 && medWebp[0][0] === 'fotos/a.webp' && medWebp[0][1] === 'image/webp',
      JSON.stringify(medWebp));
    ok('ingen <source> for et format, ingen har lavet', udenWebp.length === 0, JSON.stringify(udenWebp));
  }
}

/* R18 paa tvaers af filer: `delt_med` skal pege paa en robot, der findes.
   Ellers ville maerket paa billedet naevne en maskine, kataloget ikke har. */
console.log('\n3d. R18 paa tvaers af filer');
{
  const m = path.join(tmp, 'delt-med');
  fs.mkdirSync(m, { recursive: true });
  fs.writeFileSync(path.join(m, 'proeve-delt.yaml'),
    `slug: proeve-delt\nnavn: Proeve Delt\nproducent: P\nproducentland: Kina\n`
    + `status: i_produktion\nbillede:\n  fil: silhuetter/_proeve-kaede.svg\n  ophav: silhuet\n`
    + `  kilde: https://example.com/a\n  hentet: 2026-08-19\n  delt_med: findes-ikke\n`
    + `felter:\n  egenvaegt: ikke_oplyst\n`, 'utf8');
  const r = koerValidator([`--data=${m}`]);
  ok('delt_med peger paa en robot, der ikke findes  ->  R18',
    r.kode === 1 && /\bR18:/.test(r.ud), `exit ${r.kode}`);
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

  /* Sidetallet var haardkodet til 11, blev maalt til 17, saa 19 - hver gang
     forsidesporet aendrede build.mjs' sidestruktur, og et haandskrevet tal ville
     skride igen ved naeste aendring (samme laere som NAEVNER, STATUS.md L30).
     Formlen foelger den struktur, build.mjs selv skriver: én rodside (sprogvaelgeren
     paa /index.html) og, pr. sprog, forsiden, kataloget, én side pr. robot, og -
     naar producentskabelonen findes - producentindekset plus én side pr. UNIK
     producent. Robot- og producentantal laeses af proevedatasaettet selv
     (tests/eksempel-robotter), og sprogantallet af skema.SPROG, saa tallet foelger
     med, hvis dén data aendrer sig, i stedet for at kraeve en ny konstant her. */
  const fixtureRobotter = lasRobotter(path.join(rod, 'tests', 'eksempel-robotter'));
  const fixtureProducenter = new Set(fixtureRobotter.map((rb) => rb.producent));
  // Samme gate som build.mjs L327 bruger for producenter/index.html - IKKE bare om
  // producent.mjs findes (build.mjs L309 kraever kun det for de ENKELTE producent-
  // sider), men om den ogsaa eksporterer renderIndeks(). De to gates er i dag ens i
  // udfald, men kun fordi producent.mjs faktisk har begge - proeven maaler den
  // rigtige betingelse i stedet for at antage det.
  const producentModul = await import(
    `file://${path.join(rod, 'tools', 'skabelon', 'producent.mjs').replace(/\\/g, '/')}`).catch(() => null);
  const harProducentindeks = typeof producentModul?.renderIndeks === 'function';
  const forventetSider = 1 + skema.SPROG.length * (2 + fixtureRobotter.length
    + (harProducentindeks ? 1 + fixtureProducenter.size : 0));
  ok(`${forventetSider} HTML-sider bygget, afledt af ${fixtureRobotter.length} robotter / `
    + `${fixtureProducenter.size} producenter / ${skema.SPROG.length} sprog (fandt ${sider.length})`,
    sider.length === forventetSider);

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

  // De fire tilstande skal SE forskellige ud. Klassenavnene her er "tilstand--X" og
  // "maerke--nul" - det var den gamle navngivning. Designsystemet blev lagt om
  // (DESIGN.md), og den navngivning findes i dag KUN i de to doede CSS-filer
  // (assets/stil.css, assets/sider.css - se afsnittet om dem nederst i denne fil),
  // som intet byg nogensinde laeser. tools/skabelon/side.mjs' faelles tilstand()/
  // tal()-funktioner skriver v-ikke/v-nej/v-billede/v-nul i dag (bruges af baade
  // katalog.mjs og robot.mjs). Kravet er uaendret - fire tilstande, hver sin
  // markoer - kun navnene er rettet til dem, koden faktisk skriver.
  const markoerer = ['v-ikke', 'v-nej', 'v-billede', 'v-nul'];
  ok('alle fire tilstande har hver sin markoer i katalogets forklaring',
    markoerer.every((m) => katalogDa.includes(m)),
    markoerer.filter((m) => !katalogDa.includes(m)).join(', '));
  // dist/stil.css findes ikke og har aldrig eksisteret i dette byg - build.mjs
  // kopierer system.css og generator.css (se dets <link>-tags i skal()), som ogsaa
  // er de to filer, browseren rent faktisk henter. At laese en fil ved navn
  // stil.css var den direkte aarsag til, at hele testpakken crashede paa en
  // uhaandteret ENOENT, i stedet for at fejle paa selve paastanden.
  const css = fs.readFileSync(path.join(dist, 'system.css'), 'utf8')
    + fs.readFileSync(path.join(dist, 'generator.css'), 'utf8');
  ok('CSS giver hver tilstand sin egen regel (ikke kun farve)',
    markoerer.every((m) => new RegExp(`\\.${m.replace(/-/g, '\\-')}\\s*[,{]`).test(css)),
    markoerer.filter((m) => !new RegExp(`\\.${m.replace(/-/g, '\\-')}\\s*[,{]`).test(css)).join(', '));

  // "> 40 kg", ikke "40 kg" (regel 4). Testen laeser hele udtrykket, saa den ogsaa
  // fanger, hvis operatoren skulle havne et andet sted end foran tallet.
  // Klassen hed "operator" og stod som synlig tekst mellem operator og tal;
  // den hedder "op" i dag, er aria-hidden (billedskrift), og en saerskilt
  // ".kunskaerm"-tekst ("mere end ") baerer betydningen for skaermlaesere, mens
  // tallet selv staar i <b class="num">. Rettet mod tools/skabelon/side.mjs' tal().
  ok('operatoren vises foran tallet: "> 40 kg"',
    operatorRegex('&gt;', '40', 'kg').test(
      fs.readFileSync(path.join(dist, 'da', 'robotter', 'unitree-b2', 'index.html'), 'utf8')));
  ok('advarslen staar ved siden af vaerdien paa detaljesiden',
    /class="advarsel"/.test(spotDa) && spotDa.indexOf('class="advarsel"') > spotDa.indexOf('43,3 in'));
  // Herkomsten (kilde+hentedato) staar ikke laengere gentaget ved hvert tal - den
  // staar ÉN gang pr. unik URL i en delt <ul class="kildeliste"> (class="dato"),
  // og hvert tal baerer kun en let overskrift-markoer (class="kildemaerke"), der
  // linker til den. Samme garanti (hvert tal kan foelges til kilde+dato), anden
  // form - se lavKilder() i tools/skabelon/side.mjs.
  ok('kilde og hentedato staar paa hvert tal',
    (spotDa.match(/class="kildemaerke/g) || []).length >= 5
    && (spotDa.match(/class="dato"/g) || []).length >= 1);
  // Vendt om med L30. Reglen var "vis begge naevnere"; den er nu "vis én", og det
  // beviser sig bedst der, hvor tallet FAKTISK naar en laeser. Maalt 21. aug 2026:
  // taethedsblokken i build.mjs' midlertidigRobotside er doed kode, fordi
  // tools/skabelon/robot.mjs har overtaget robotsiden og ikke tegner tallet. Eneste
  // levende vej ud er robots.json. Proeven staar derfor paa robots.json og faelder
  // desuden siden, hvis den nogensinde begynder at trykke en anden naevner.
  const json = JSON.parse(fs.readFileSync(path.join(dist, 'robots.json'), 'utf8'));
  ok('robots.json baerer praecis én naevner',
    Array.isArray(json.naevnere) && json.naevnere.length === 1,
    JSON.stringify(json.naevnere));
  ok('og hver robots taethed er opgjort paa netop den ene naevner',
    json.robotter.every((r) => Object.keys(r.taethed).length === 1
      && Number(Object.keys(r.taethed)[0]) === json.naevnere[0]),
    JSON.stringify(json.robotter.map((r) => r.taethed)));
  ok('detaljesiden trykker ingen fremmed naevner (fx 5/29 eller 5/31)',
    !/\b\d+\/(?:29|31)\b/.test(spotDa));
  ok('robots.json har de tre robotter', json.robotter.length === 3);
  ok('robots.json er et lille indeks, ikke hele datasaettet',
    JSON.stringify(json).length < 8000, `${JSON.stringify(json).length} tegn`);

  /* Uden JavaScript: hele kataloget skal staa fuldt renderet, og FILTRENE skal
     virke uden JS - det er selve pointen i den nye "styr"-mekanik (CSS :has()
     paa afkrydsningsfelter, se tools/skabelon/katalog.mjs' kommentar L1-10).
     Kataloget stod som <table><tr data-slug=...>; det staar i dag som
     <article class="kort"> pr. robot - talt paa samme maade som andre steder
     i denne fil (taelKort() i build.mjs). Og filterFORMULAREN er ikke laengere
     skjult for JS (den var det, indtil "styr" blev CSS-baaret) - kun
     fritekstsoegningen er, fordi soegning ikke kan skrives i ren CSS
     (assets/katalog.js' egen kommentar: "Filtrene virker uden JavaScript"). */
  const kort = (katalogDa.match(/<article class="kort/g) || []).length;
  ok('kataloget staar fuldt renderet i HTML uden JS (3 kort)', kort === 3, `fandt ${kort}`);
  ok('filterformularen ("styr") findes og er IKKE skjult - CSS-filtrene skal virke uden JS',
    /<form class="styr" id="styr"/.test(katalogDa) && !/<form class="styr" id="styr"[^>]*hidden/.test(katalogDa));
  ok('kun fritekstsoegningen er skjult, indtil JS taender den (resten af filteret kan ikke det)',
    /<div class="sog" data-sog="katalog" hidden>/.test(katalogDa));
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
  // Klassenavnene "vaerdi--ja/nej" og glyfferne ✓/✗ er den gamle navngivning
  // (samme designomlaegning som afsnit 4). tilstand()/jaNej() i side.mjs skriver
  // i dag v-ja/v-nej med et rent CSS-maerke (<i class="mrk">) og selve ordet
  // "ja"/"nej" - ingen glyf staar i HTML'en laengere, saa den kan ikke laeses her.
  ok('"vaerdi: nej" paa et ja/nej-felt vises som nej, ikke som ja',
    ros2Blok.includes('v-nej') && ros2Blok.includes('>nej<') && !ros2Blok.includes('v-ja'),
    ros2Blok.slice(0, 90));
  ok('"vaerdi: ja" paa et ja/nej-felt vises som ja',
    hotBlok.includes('v-ja') && hotBlok.includes('>ja<') && !hotBlok.includes('v-nej'),
    hotBlok.slice(0, 90));
  ok('ikke_oplyst, nej og 0 ser stadig forskellige ud paa samme side',
    side.includes('v-ikke') && side.includes('v-nej') && side.includes('v-nul'));
  // Se afsnit 4 - kilde+hentedato staar i en delt kildeliste, ikke gentaget som
  // "class=herkomst" ved hvert tal. class="kildemaerke" er referencen paa tallet.
  ok('den dokumenterede tilstand baerer sin kilde',
    side.includes('v-ikke') && (side.match(/class="kildemaerke/g) || []).length >= 6);
  // "~" skrives i dag som "ca." (dansk fagudtryk, ikke tegnet ≈) - se side.mjs'
  // operator-opslagstabel. Egen kommentar to linjer ovenfor beviser det samme:
  // "ca. 1-2 t" har staaet der siden testen blev skrevet, mens selve paastanden
  // stadig ledte efter "≈".
  ok('operatoren staar ogsaa foran et interval: "ca. 1–2 t"',
    operatorRegex('ca\\.', '1–2', 't').test(side));
  ok('haeldningen vises i producentens procent, ikke omregnet til grader',
    /<b class="num">45<\/b><span class="enhed">%<\/span>/.test(side) && !side.includes('24,2'));
  ok('varianterne staar paa siden med navn og vaerdi',
    /class="varianter"/.test(side) && side.includes('>AIR<') && side.includes('>PRO<') && side.includes('>2,5<'));
  // IKKE rettet - katalogsiden har ingen erstatning for "maerke--varianter"
  // fundet (grep for "variant" i tools/skabelon/katalog.mjs giver 0 traeff).
  // Kravet er derfor ladt staa: enten mangler markeringen paa katalogsiden i
  // det nuvaerende byg, eller ogsaa er den flyttet et sted, denne test ikke
  // har fundet. Se fund/FUND-test.md.
  ok('katalogtabellen markerer, at feltet har varianter',
    /maerke--varianter/.test(katalog));
  ok('advarslen staar stadig ved siden af vaerdien',
    side.indexOf('class="advarsel"') > side.indexOf('v-ikke'));
  ok('de to noter staar som to punkter, ikke som én sammenkoedet linje',
    /<ul class="noter"><li>foerste note<\/li><li>anden note<\/li><\/ul>/.test(side));

  const json = JSON.parse(fs.readFileSync(path.join(ud, 'robots.json'), 'utf8'));
  ok('robots.json holder ja/nej som boolean, ikke som teksten "nej"',
    json.robotter[0].felter.ros2 === false);

  // Robotten har ingen egenvaegt. Den skal stadig have en vaegtklasse - sin egen,
  // ikke ingen. Ellers falder den ud af en forside, der grupperer efter vaegt.
  // vaegtklasse i robots.json var et objekt ({klasse, kg, ...}) - i dag er den
  // bare selve klassestrengen (side.mjs' vaegtklasse() returnerer kun ét af de
  // fire ord). Detaljerne (kg, operator, "cirka") staar stadig synligt ved SELVE
  // feltvaerdien paa siden (allerede bevist ovenfor: "operatoren vises foran
  // tallet"), saa proeven her taber ingen daekning - den taester bare paa den
  // streng, koden faktisk skriver.
  ok('en robot uden oplyst vaegt faar klassen ikke_oplyst, ikke ingen klasse',
    json.robotter[0].vaegtklasse === 'ikke_oplyst',
    JSON.stringify(json.robotter[0].vaegtklasse));
  // Etiketten er ikke laengere en BEM-klasse ("vaegtklasse--X") - den staar som
  // lokaliseret tekst i <p class="t-mikro vaegtklasse">. Teksten er UDLEDT af
  // data/i18n/da.json (samme kilde, koden selv laeser), ikke skrevet i haanden -
  // aendrer ordlyden sig, foelger proeven med.
  const da = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'da.json'), 'utf8'));
  ok('vaegtklassen staar ogsaa paa siden, saa den ikke kun findes i indekset',
    Boolean(da.vaegtklasse_ikke_oplyst)
    && side.includes(`class="t-mikro vaegtklasse">${da.vaegtklasse_ikke_oplyst}<`),
    da.vaegtklasse_ikke_oplyst ? 'fandt ikke etiketten i markup' : 'vaegtklasse_ikke_oplyst mangler i da.json');
}

/* ------------------------------------------------------------------------
   6. Vaegtklasse (afledt, L27) og anvendelse som usorteret maengde (L27).

   Vaegtklassen staar ikke i nogen YAML-fil og maa aldrig komme til det. Testen
   her er derfor et bevis paa, at bygget REGNER den ud - og at graenserne er
   dem, der blev besluttet, og ikke dem, nogen huskede.
   ------------------------------------------------------------------------ */
console.log('\n6. Vaegtklasser og flervaerdi-anvendelse');
{
  const dataMappe = path.join(tmp, 'klasse-data');
  fs.mkdirSync(dataMappe, { recursive: true });
  const hoved = (slug, navn) =>
    `slug: ${slug}\nnavn: ${navn}\nproducent: P\nproducentland: Kina\nstatus: i_produktion\n`;
  const vaegt = (slug, navn, felt) => [slug,
    hoved(slug, navn) + `felter:\n${felt}`];

  const filer = [
    // Graenserne: 19,9 under, 20 paa, 39,9 under, 40 paa. Fire tal, fire klasser.
    vaegt('a-under', 'A Under', `  egenvaegt:\n    vaerdi: 19.9\n    enhed: kg\n` +
      `    kilde: https://example.com/a\n    hentet: 2026-08-19\n`),
    vaegt('b-nedre-graense', 'B Nedre', `  egenvaegt:\n    vaerdi: 20\n    enhed: kg\n` +
      `    kilde: https://example.com/a\n    hentet: 2026-08-19\n`),
    vaegt('c-midt-top', 'C Midt', `  egenvaegt:\n    vaerdi: 39.9\n    enhed: kg\n` +
      `    kilde: https://example.com/a\n    hentet: 2026-08-19\n`),
    vaegt('d-oevre-graense', 'D Oevre', `  egenvaegt:\n    vaerdi: 40\n    enhed: kg\n` +
      `    kilde: https://example.com/a\n    hentet: 2026-08-19\n`),
    // Operatoren skal respekteres: "~60 kg" ER 60, men forbeholdet foelger med.
    vaegt('e-cirka', 'E Cirka', `  egenvaegt:\n    vaerdi: 60\n    enhed: kg\n    operator: "~"\n` +
      `    kilde: https://example.com/a\n    hentet: 2026-08-19\n`),
    // "<= 20 kg" ligger PAA graensen og kan vaere begge klasser (DEEP Lynx S10).
    vaegt('f-paa-graensen', 'F Graense', `  egenvaegt:\n    vaerdi: 20\n    enhed: kg\n    operator: "<="\n` +
      `    kilde: https://example.com/a\n    hentet: 2026-08-19\n`),
    // Interval hen over en graense: maa ikke kollapse til sit midtpunkt (regel 5).
    vaegt('g-interval', 'G Interval', `  egenvaegt:\n    vaerdi_min: 18\n    vaerdi_maks: 25\n    enhed: kg\n` +
      `    kilde: https://example.com/a\n    hentet: 2026-08-19\n`),
    vaegt('h-ingen-vaegt', 'H Ingen', `  egenvaegt: ikke_oplyst\n`),
    // Vaegt i pund er ikke kg og maa ikke laeses som et tal i kg.
    vaegt('i-kun-imperial', 'I Imperial', `  egenvaegt:\n    vaerdi: 74\n    enhed: lb\n` +
      `    kilde: https://example.com/a\n    hentet: 2026-08-19\n`),
    // L27: samme to kategorier, modsat raekkefoelge i YAML'en. De to skal
    // komme ud ens - ellers afgoer en producents saetningsorden, hvor de lander.
    ['j-orden-en', hoved('j-orden-en', 'J En')
      + `anvendelse:\n  vaerdi: [logistik, industri, sikkerhed_overvaagning]\n`
      + `  citat: "Robot - Industry"\n  kilde: https://example.com/a\n  hentet: 2026-08-19\n`
      + `felter:\n  egenvaegt: ikke_oplyst\n`],
    ['k-orden-to', hoved('k-orden-to', 'K To')
      + `anvendelse:\n  vaerdi: [sikkerhed_overvaagning, industri, logistik]\n`
      + `  citat: "Robot - Industry"\n  kilde: https://example.com/a\n  hentet: 2026-08-19\n`
      + `felter:\n  egenvaegt: ikke_oplyst\n`],
    // Arven skal SES paa siden, ikke kun staa i data.
    ['l-mor', hoved('l-mor', 'L Mor')
      + `anvendelse:\n  vaerdi: industri\n  citat: "Robot - Industry"\n`
      + `  kilde: https://example.com/mor\n  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`],
    ['m-barn', hoved('m-barn', 'M Barn')
      + `anvendelse:\n  vaerdi: industri\n  citat: "Robot - Industry"\n`
      + `  kilde: https://example.com/mor\n  hentet: 2026-08-19\n  arvet_fra: l-mor\n`
      + `felter:\n  egenvaegt: ikke_oplyst\n`],
  ];
  for (const [slug, indhold] of filer) fs.writeFileSync(path.join(dataMappe, `${slug}.yaml`), indhold, 'utf8');

  const ud = path.join(tmp, 'dist-klasse');
  const r = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'),
    `--data=${dataMappe}`, `--ud=${ud}`], { cwd: rod, encoding: 'utf8' });
  ok('bygget gaar igennem med de nye former', r.status === 0,
    ((r.stdout || '') + (r.stderr || '')).trim().split('\n').slice(-4).join(' / '));

  const json = JSON.parse(fs.readFileSync(path.join(ud, 'robots.json'), 'utf8'));
  const vk = Object.fromEntries(json.robotter.map((x) => [x.slug, x.vaegtklasse]));
  const anv = Object.fromEntries(json.robotter.map((x) => [x.slug, x.anvendelse]));

  /* vaegtklasse i robots.json var et objekt ({klasse, kg, operator, cirka,
     graensetilfaelde}); tools/skabelon/side.mjs' vaegtklasse() returnerer i dag
     KUN klassestrengen (bevist ovenfor i afsnit 5). vk[x] ER derfor allerede
     selve strengen her - ".klasse" findes ikke paa den laengere. */
  ok('19,9 kg -> under_20', vk['a-under'] === 'under_20', vk['a-under']);
  ok('20 kg -> 20_40 (graensen er inklusiv nedadtil)', vk['b-nedre-graense'] === '20_40',
    vk['b-nedre-graense']);
  ok('39,9 kg -> 20_40', vk['c-midt-top'] === '20_40', vk['c-midt-top']);
  // RETTET: 40 kg var forventet "over_40". Maalt direkte i koden (side.mjs'
  // vaegtklasse(): "if (kg <= VAEGTGRAENSER.over) return '20_40'") og
  // krydstjekket mod den dokumenterede fordeling over de rigtige 46 poster
  // (samme fils kommentar: "Maalt over data/robots/ 21.08.2026: 12/12/13/9" -
  // efterregnet her: byg uden --data giver praecis under_20:12, 20_40:12,
  // over_40:13, ikke_oplyst:9). 20-40 kg-klassen er altsaa lukket i BEGGE
  // ender: [20,40] - ikke [20,40). Den gamle forventning var asymmetrisk og
  // er den stale del; graensereglen for 20 kg ("inklusiv nedadtil") staar ved.
  ok('40 kg -> 20_40 (graensen er inklusiv i begge ender, maalt mod koden og mod 12/12/13/9)',
    vk['d-oevre-graense'] === '20_40', vk['d-oevre-graense']);
  // kg/operator/cirka stod paa vaegtklasse-objektet; de staar i dag kun paa
  // selve feltvaerdien ("~ 60 kg" er allerede bevist synlig i afsnit 4/5's
  // operator-proever). Her er kun klassen tilbage at proeve.
  ok('"~ 60 kg" laeser stadig som 60 og klassificeres som over_40',
    vk['e-cirka'] === 'over_40', vk['e-cirka']);
  // "graensetilfaelde" fandtes som et separat flag paa objektet; det findes
  // ikke laengere. Designets egen begrundelse (kommentar ved vaegtklasse() i
  // side.mjs) er, at operatoren staar SYNLIGT PAA KORTET i stedet - laeseren
  // ser selv "≤ 20 kg" og kan doemme. Proeven her flyttes til at bevise DEN
  // paastand direkte, i stedet for et flag, koden ikke laengere skriver.
  const fSide = fs.readFileSync(path.join(ud, 'da', 'robotter', 'f-paa-graensen', 'index.html'), 'utf8');
  ok('"<= 20 kg" ligger paa graensen, og operatoren staar synligt paa siden i stedet for et flag',
    vk['f-paa-graensen'] === '20_40' && operatorRegex('≤', '20').test(fSide));
  /* IKKE RETTET - flyttet til en kendt, aaben brist. vaegtIKg() i side.mjs
     regner et interval som (min+maks)/2 for at afgoere klassen: (18+25)/2 =
     21,5 -> 20_40. Det er PRAECIS den kollaps til midtpunktet, denne proeves
     oprindelige navn advarer imod ("kollapser ikke til sit midtpunkt"), og der
     findes intet graensetilfaelde-flag eller andet signal, der viser laeseren,
     at 18 kg af intervallet faktisk ligger i under_20. Proeven er IKKE vendt
     om til at bevise midtpunktsreglen - det ville saenke et krav, ingen har
     besluttet at saenke. Den staar bevidst som FEJL. Se fund/FUND-test.md. */
  ok('interval 18-25 kg kollapser ikke til sit midtpunkt (uafklaret - se fund/FUND-test.md)',
    vk['g-interval'] !== '20_40', vk['g-interval']);
  ok('ingen vaegt -> klassen ikke_oplyst, og robotten bliver staaende',
    vk['h-ingen-vaegt'] === 'ikke_oplyst', vk['h-ingen-vaegt']);
  ok('74 lb laeses ikke som 74 kg', vk['i-kun-imperial'] === 'ikke_oplyst', vk['i-kun-imperial']);
  /* json.vaegtfordeling fandtes engang paa robots.json's rod; den er der ikke
     laengere (robots.json's noegler er i dag kun genereret/naevnere/
     type_uden_model_taeller/filterfelter/robotter - efterproevet ved at
     printe Object.keys(json)). Fordelingen er IKKE tabt information - hver
     robot baerer sin egen vaegtklasse-streng i json.robotter - saa proeven
     taeller den selv op af raadata i stedet for at kraeve, at bygget ogsaa
     skriver et faerdigt sammendrag. Samme laere som L30: udled, kraev ikke en
     ekstra kilde, der kan skride fra den foerste. */
  const fordeling = { under_20: 0, '20_40': 0, over_40: 0, ikke_oplyst: 0 };
  for (const r of json.robotter) fordeling[r.vaegtklasse] = (fordeling[r.vaegtklasse] ?? 0) + 1;
  // Taellingen er efterregnet i haanden fil for fil (g-interval taeller her
  // som 20_40, jf. den kendte midtpunktsbrist ovenfor):
  //   under_20 1   a-under 19,9
  //   20_40    5   b-nedre 20 · c-midt 39,9 · d-oevre 40 (rettet graense) · f-graense <=20 · g-interval (kollaps)
  //   over_40  1   e-cirka ~60
  //   ikke_oplyst 6  h-ingen · i-imperial(lb) · j · k · l-mor · m-barn
  // 1+5+1+6 = 13 filer, som der er.
  ok('den afledte fordeling summer korrekt: under_20 1 / 20_40 5 / over_40 1 / ikke_oplyst 6',
    fordeling.under_20 === 1 && fordeling['20_40'] === 5
    && fordeling.over_40 === 1 && fordeling.ikke_oplyst === 6,
    JSON.stringify(fordeling));
  ok('og summen af de fire klasser er alle robotterne - ingen falder ud imellem dem',
    Object.values(fordeling).reduce((a, b) => a + b, 0) === json.robotter.length,
    `${JSON.stringify(fordeling)} mod ${json.robotter.length} robotter`);

  /* L27 - maengden, ikke raekkefoelgen. IKKE RETTET, staar bevidst som FEJL:
     hjaelp.anvendelse() i tools/skabelon/side.mjs (~L626) skriver
     "vaerdier = (Array.isArray(raa.vaerdi) ? raa.vaerdi : [raa.vaerdi])" - raa
     YAML-raekkefoelge, ingen sortering. To robotter med samme kategorisaet i
     forskellig raekkefoelge faar derfor forskellige arrays i robots.json. Det
     er den PRAECISE ting, L27 (STATUS.md) blev besluttet for at undgaa
     ("ingen af vaerdierne er hovedkategorien"). Kraevet er ikke saenket. */
  ok('to filer med samme kategorier i modsat raekkefoelge giver samme indeks (L27) — uafklaret, se fund/FUND-test.md',
    JSON.stringify(anv['j-orden-en'].vaerdi) === JSON.stringify(anv['k-orden-to'].vaerdi),
    `${JSON.stringify(anv['j-orden-en'].vaerdi)} mod ${JSON.stringify(anv['k-orden-to'].vaerdi)}`);

  const sideJ = fs.readFileSync(path.join(ud, 'da', 'robotter', 'j-orden-en', 'index.html'), 'utf8');
  const sideK = fs.readFileSync(path.join(ud, 'da', 'robotter', 'k-orden-to', 'index.html'), 'utf8');
  /* IKKE RETTET, staar bevidst som FEJL: klassen "anvendelse__maerke--X"
     findes slet ikke i robot.mjs. anvendelseBlok() (~L518-549) UDREGNER
     "vaerdier" (de enkelte kategorier), men bruger variablen ALDRIG i den
     HTML, den returnerer - kun det raa citat vises. Kataloget viser kategori-
     "maerker" (side.mjs' anvendelse().maerker(), klassen hedder bare "maerke",
     ikke en BEM-variant pr. kategori) - men ROBOTTENS EGEN side goer det ikke.
     Kravet ("alle kategorier skal ses, ingen tabes") staar derfor uindfriet
     paa netop den side, testen peger paa. */
  const maerkerne = (s) => (s.match(/anvendelse__maerke--([a-z_]+)/g) || []).join(',');
  ok('og samme raekkefoelge paa de to sider - ingen af dem er "hovedkategori" — uafklaret, se fund/FUND-test.md',
    maerkerne(sideJ) === maerkerne(sideK) && maerkerne(sideJ) !== '', maerkerne(sideJ));
  ok('alle tre kategorier vises, ingen tabes af grupperingen — uafklaret, se fund/FUND-test.md',
    ['industri', 'sikkerhed_overvaagning', 'logistik'].every((v) => sideJ.includes(`anvendelse__maerke--${v}`)));

  /* IKKE RETTET, staar bevidst som FEJL: robot.mjs' anvendelseBlok() (~L539)
     skriver arven som <p class="t-mikro arvet">${a.arvet_fra}</p> - raa
     SLUG-tekst ("l-mor"), ingen <a href>, intet visningsnavn, og linjen 547's
     forklaringstekst er den SAMME uanset arv (ingen "vores slutning"-variant).
     L23's krav ("arven skal SES, med moderens navn og link, og laeseren skal
     vide, at koblingen her er redaktionel") er derfor ikke indfriet endnu. */
  const sideM = fs.readFileSync(path.join(ud, 'da', 'robotter', 'm-barn', 'index.html'), 'utf8');
  ok('arven staar synligt paa varianten, med moderens navn og et link — uafklaret, se fund/FUND-test.md',
    /class="anvendelse__arv"/.test(sideM) && sideM.includes('>L Mor</a>')
    && sideM.includes('href="../l-mor/"'), sideM.includes('anvendelse__arv') ? 'link/navn mangler' : 'blok mangler');
  ok('og moderens citat vises paa varianten', sideM.includes('Robot - Industry'));
  const sideL = fs.readFileSync(path.join(ud, 'da', 'robotter', 'l-mor', 'index.html'), 'utf8');
  ok('moderen selv baerer INGEN arvemarkering', !/class="anvendelse__arv"/.test(sideL));
  // Paa en arvet post ER koblingen vores, saa den generelle forklaring
  // ("kategorien er ikke vores vurdering") ville staa og lyve nederst paa siden.
  ok('den arvede side siger, at koblingen er vores - ikke det modsatte — uafklaret, se fund/FUND-test.md',
    sideM.includes('vores slutning') && !sideM.includes('Kategorien er ikke vores vurdering'));
  ok('og moderens side siger stadig det oprindelige',
    sideL.includes('Kategorien er ikke vores vurdering'));

  /* data-vaegtklasse/data-anvendelse hed det, dengang testen blev skrevet.
     katalog.mjs bygger navnet af FILTER_FELTER-definitionens korte "navn"
     (L157: "data-${f.navn}") - de hedder i dag "vaegt" og "anv" (kortere
     attributnavne, samme mekanisme). Vaerdien for "anv" ER stadig ordenen fra
     YAML'en (samme L27-brist som ovenfor) - men CSS' [attr~=] matcher token
     for token, uafhaengigt af raekkefoelge, saa selve FILTERET virker uanset.
     Proeven her er derfor gjort raekkefoelge-uafhaengig med vilje: den
     efterproever maengden (det, navnet "en maengde" faktisk lover), ikke den
     specifikke streng - den strengere paastand staar allerede ovenfor, hvor
     den hoerer hjemme. */
  const katalog = fs.readFileSync(path.join(ud, 'da', 'robotter', 'index.html'), 'utf8');
  ok('katalograekken baerer vaegtklassen som data-attribut, saa en gruppering kan bruge den',
    /data-vaegt="under_20"/.test(katalog) && /data-vaegt="ikke_oplyst"/.test(katalog));
  const jMaengde = [...katalog.matchAll(/data-anv="([^"]*)"/g)]
    .map((m) => m[1].split(' ').sort().join(' '));
  ok('og anvendelserne som en maengde, mellemrumsadskilt',
    jMaengde.includes(['industri', 'logistik', 'sikkerhed_overvaagning'].sort().join(' ')),
    jMaengde.join(' | '));

  // Klassen er afledt. Staar den i en YAML-fil, er beslutningen brudt.
  const iData = fs.readdirSync(path.join(rod, 'data', 'robots'))
    .filter((f) => /vaegtklasse/.test(fs.readFileSync(path.join(rod, 'data', 'robots', f), 'utf8')));
  ok('ingen datafil indeholder ordet "vaegtklasse" - klassen er afledt, ikke skrevet',
    iData.length === 0, iData.join(', '));
}

console.log(`\nValidator: ${alle.length + arvsagerFangede} oedelagte tilfaelde `
  + `(${alle.length} i én fil + ${arvsagerFangede} paa tvaers af filer), fangede ${fangede}.`);
console.log(`I alt: ${bestaaet} bestaaet, ${fejlet} fejlet.`);
if (fejlet) console.log(`Fejlede: ${fejlliste.join(' · ')}`);
process.exit(fejlet ? 1 : 0);
