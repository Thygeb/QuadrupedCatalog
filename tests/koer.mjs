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
const alder = await import(`file://${path.join(rod, 'tools', 'alder.mjs').replace(/\\/g, '/')}`);

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
  ok('skemaet har 30 feltnoegler', skema.FELTNAVNE.length === 30,
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

  // 6. Taelleren kan ikke overstige naevneren. Med 30/30 er 100 % loftet.
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
  const sideDelt = fs.readFileSync(path.join(kaedeDist, 'da', 'robotter', 'proeve-delt', 'index.html'), 'utf8');

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
  // spor/kort (26.08.2026) fjernede katalogkortets fodnote helt (JPK's direkte
  // bestilling) - "Samme fil som X" flyttede derfor med resten af
  // billedsandheden til robotsidens EGEN billedfod (billedLinjer() bruges
  // stadig af robot.mjs, uaendret) og staar ikke laengere paa kortet.
  ok('robotsidens billedfod siger, hvem filen deles med',
    /Samme fil som proeve-silhuet/.test(sideDelt));

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
     paa /index.html) og, pr. sprog, forsiden, kataloget, SAMMENLIGNINGSSIDEN,
     én side pr. robot, og - naar producentskabelonen findes - producentindekset
     plus én side pr. UNIK producent. Robot- og producentantal laeses af
     proevedatasaettet selv (tests/eksempel-robotter), og sprogantallet af
     skema.SPROG, saa tallet foelger med, hvis dén data aendrer sig, i stedet for
     at kraeve en ny konstant her.
     VENDT (spor/lysbyg, retning LYS): leddet var "2" (forside + katalog) og er
     nu "3" - /sammenligning/ er en NY sidetype, tools/skabelon/sammenligning.mjs,
     bygget én gang pr. sprog uafhaengigt af robotantallet (klientside vaelger,
     se dens filhoved). Kravet er skaerpet, ikke sloejfet: formlen fanger stadig
     enhver fremtidig sidetype-aendring, praecis som foer. */
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
  const forventetSider = 1 + skema.SPROG.length * (3 + fixtureRobotter.length
    + (harProducentindeks ? 1 + fixtureProducenter.size : 0));
  ok(`${forventetSider} HTML-sider bygget, afledt af ${fixtureRobotter.length} robotter / `
    + `${fixtureProducenter.size} producenter / ${skema.SPROG.length} sprog + sammenligningssiden (fandt ${sider.length})`,
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
  //
  // VENDT af spor/enheder (K9): driftstid vises nu i sidens kanoniske
  // visningsenhed (minutter, skema.mjs' KANONISK_VISNINGSENHED), ikke i den
  // enhed dataskriveren brugte. "1-2 t" er derfor MED VILJE blevet til
  // "60-120 min" - fixturen ovenfor er uaendret ("enhed: t"), kun VISNINGEN
  // er normaliseret. Assertionen er vendt om, saa den beviser den nye regel
  // (samme operator foran et INTERVAL i den nye enhed), ikke den gamle.
  ok('operatoren staar ogsaa foran et interval, nu i kanonisk enhed: "ca. 60–120 min"',
    operatorRegex('ca\\.', '60–120', 'min').test(side));
  ok('haeldningen vises i producentens procent, ikke omregnet til grader',
    /<b class="num">45<\/b><span class="enhed">%<\/span>/.test(side) && !side.includes('24,2'));
  ok('varianterne staar paa siden med navn og vaerdi',
    /class="varianter"/.test(side) && side.includes('>AIR<') && side.includes('>PRO<') && side.includes('>2,5<'));
  // RETTET (fund/FUND-detalje.md, opgave 4c): markeringen laa aldrig i
  // katalog.mjs (grep for "variant" gav stadig 0 traef - den fil rammer
  // ikke feltvaerdien direkte) men i side.mjs' felt(), som katalog.mjs
  // kalder via hjaelp.kort() -> stribe() -> felt(..., {kunVaerdi:true}).
  // Naar post.varianter er sat, faar den kompakte stribes .v-spann nu
  // klassen "maerke--varianter" (og en forklarende title), uden at aendre
  // selve figuren, katalogkortet viser.
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

  /* L27 - maengden, ikke raekkefoelgen. STAAR STADIG BEVIDST SOM FEJL, men af
     en ANDEN og smallere aarsag end foer (fund/FUND-detalje.md, opgave 4c):
     tools/skabelon/side.mjs' hjaelp.anvendelse() sorterer nu vaerdierne via
     skema.mjs' sorterAnvendelse() - det retter siden, katalogets maerker og
     robotsidens BEM-klasser (de to proever lige nedenfor). Men robots.json's
     "anvendelse.vaerdi" bliver IKKE bygget af hjaelp.anvendelse() - build.mjs
     (L363-372, forbudt fil i dette spor) har sin EGEN, uafhaengige kopi af
     samme udregning ("(Array.isArray(a.vaerdi) ? a.vaerdi :
     [a.vaerdi]).map((v) => tilstandAf(v) ?? v)") direkte i indeks-byggeren,
     uden at kalde hjaelp.anvendelse() eller sorterAnvendelse() overhovedet.
     Kravet er ikke saenket - roeret er sporet til en konkret linje, den
     staar bare i en fil, dette spor ikke maa aendre. */
  ok('to filer med samme kategorier i modsat raekkefoelge giver samme indeks (L27) — uafklaret, robots.json bygges af build.mjs (forbudt fil), se fund/FUND-detalje.md',
    JSON.stringify(anv['j-orden-en'].vaerdi) === JSON.stringify(anv['k-orden-to'].vaerdi),
    `${JSON.stringify(anv['j-orden-en'].vaerdi)} mod ${JSON.stringify(anv['k-orden-to'].vaerdi)}`);

  const sideJ = fs.readFileSync(path.join(ud, 'da', 'robotter', 'j-orden-en', 'index.html'), 'utf8');
  const sideK = fs.readFileSync(path.join(ud, 'da', 'robotter', 'k-orden-to', 'index.html'), 'utf8');
  /* RETTET (fund/FUND-detalje.md, opgave 4c): robot.mjs' anvendelseMaerker()
     saetter nu "anvendelse__maerke--<vaerdi>" pr. kategori (samme BEM-princip
     som side.mjs' kort-udgave), og vaerdierne kommer i den samme kanoniske
     orden fra hjaelp.anvendelse() (sorterAnvendelse()) uanset YAML-raekkefoelge.
     Robotsidens EGEN side viser derfor nu det, testen efterspoerger - i
     modsaetning til robots.json ovenfor, som er en anden kilde. */
  const maerkerne = (s) => (s.match(/anvendelse__maerke--([a-z_]+)/g) || []).join(',');
  ok('og samme raekkefoelge paa de to sider - ingen af dem er "hovedkategori"',
    maerkerne(sideJ) === maerkerne(sideK) && maerkerne(sideJ) !== '', maerkerne(sideJ));
  ok('alle tre kategorier vises, ingen tabes af grupperingen',
    ['industri', 'sikkerhed_overvaagning', 'logistik'].every((v) => sideJ.includes(`anvendelse__maerke--${v}`)));

  /* RETTET (fund/FUND-detalje.md, opgave 4c): robot.mjs' anvendelseBlok()
     slaar nu moderen op i ctx.robotter og skriver et rigtigt <a href> med
     moderens VISNINGSNAVN, ikke den raa slug. hjaelp.anvendelse() manglede
     tidligere `arvet_fra` i sit returobjekt (kontrakten i robot.mjs' hoved
     dokumenterede feltet, men side.mjs sendte det aldrig med) - arve-blokken
     var derfor ALTID tom, uanset data. Begge dele er rettet.
     Hrefformen er IKKE '../l-mor/' - det var testens egen antagelse om
     sti(), aldrig efterproevet mod et rigtigt byg. sti() bruger ctx.url.robot(),
     naar bygget giver den (altid i praksis), og den giver en absolut-fra-
     sprogroden sti - noejagtig samme form som den allerede groenne
     "til_producent"-test to afsnit ovenfor bruger for producent-linket paa
     samme side (dist/da/robotter/<slug>/index.html: '../../../da/producenter/…/').
     Maalt direkte i tests/.tmp-koersel/dist-klasse/da/robotter/m-barn/index.html. */
  const sideM = fs.readFileSync(path.join(ud, 'da', 'robotter', 'm-barn', 'index.html'), 'utf8');
  ok('arven staar synligt paa varianten, med moderens navn og et link',
    /class="anvendelse__arv"/.test(sideM) && sideM.includes('>L Mor</a>')
    && sideM.includes('href="../../../da/robotter/l-mor/"'),
    sideM.includes('anvendelse__arv') ? 'link/navn mangler' : 'blok mangler');
  ok('og moderens citat vises paa varianten', sideM.includes('Robot - Industry'));
  const sideL = fs.readFileSync(path.join(ud, 'da', 'robotter', 'l-mor', 'index.html'), 'utf8');
  ok('moderen selv baerer INGEN arvemarkering', !/class="anvendelse__arv"/.test(sideL));
  // Paa en arvet post ER koblingen vores, saa den generelle forklaring
  // ("kategorien er ikke vores vurdering") ville staa og lyve nederst paa siden.
  // RETTET (opgave 4c): anvendelseBlok() vaelger nu i18n-noeglen
  // anvendelse_forklaring_arvet ("...er vores slutning...") i stedet for den
  // almindelige anvendelse_forklaring, naar a.arvet_fra er sat.
  ok('den arvede side siger, at koblingen er vores - ikke det modsatte',
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

console.log('\n7. Vagten i db/migrer.mjs — ren sammenligningsfunktion (L35)');
{
  // Ren funktion, testes uden netvaerk og uden .env - se db/migrer.mjs's
  // sammenlignDbMedYaml. Importeres som modul; erHoved-vagten i migrer.mjs
  // (og i eksporter.mjs/rundtur.mjs, som den selv importerer) sikrer, at
  // ingen af dem koerer deres main() bare fordi de bliver importeret her.
  const migrer = await import(`file://${path.join(rod, 'db', 'migrer.mjs').replace(/\\/g, '/')}`);

  /** Én minimal, men kanonisk-formet robot - samme noeglesaet som
   *  klassificerRobot()/omdanRobotFraDb() begge producerer. Funktionen kan
   *  ikke se forskel paa "kommer fra YAML" og "kommer fra DB'en" - begge
   *  sider er allerede paa denne form, naar sammenlignDbMedYaml() kaldes. */
  const grundrobot = () => ({
    slug: 'proeve-vagt', navn: 'Proeve', producent: 'X', producentland: 'Kina',
    producentby: 'Beijing', status: 'i_produktion', foerste_udgivelse: 2024,
    forgaenger: null, varianter: null, noter: null,
    felter: {
      egenvaegt: {
        form: 'tal', vaerdi_tal: 50, min: null, maks: null, enhed: 'kg',
        enhed_imperial: null, vaerdi_imperial: null, operator: null,
        kilde: 'https://example.com/a', hentet: '2026-08-19', kildetype: null,
        advarsel: null, note: null, raa: null, valuta: null,
      },
    },
    anvendelse: null, billede: null,
  });

  const ensAfvigelser = migrer.sammenlignDbMedYaml([grundrobot()], [grundrobot()]);
  ok('ens DB- og YAML-tilstand giver nul afvigelser',
    Array.isArray(ensAfvigelser) && ensAfvigelser.length === 0, JSON.stringify(ensAfvigelser));

  const dbMedEnAendring = grundrobot();
  dbMedEnAendring.producentby = 'VAGTTEST';
  const afvigelser = migrer.sammenlignDbMedYaml([dbMedEnAendring], [grundrobot()]);
  ok('én aendret vaerdi giver praecis én afvigelse, med rigtig slug og feltsti',
    afvigelser.length === 1 && afvigelser[0].slug === 'proeve-vagt' && afvigelser[0].sti === 'producentby'
    && afvigelser[0].db === 'VAGTTEST' && afvigelser[0].yaml === 'Beijing',
    JSON.stringify(afvigelser));

  // Å14: afgoerVagt() er selve beslutningen (naegt / naegt ikke), retter L35's
  // foerste udgave, som sammenlignede databasen mod YAML og derfor naegtede
  // lige saa haardt paa et agent-spors normale fremrykning som paa en
  // faktisk Studio-redigering. Ren funktion - samme betingelse som ovenfor
  // (intet fetch, intet filsystem), og fire scenarier daekker begge grene af
  // det, punktet skal skelne: aftryk-sammenligning naar der findes et aftryk,
  // fald-tilbage til YAML naar der ikke goer.
  const yamlMedNyRobot = [grundrobot(), { ...grundrobot(), slug: 'ny-fra-agent' }];

  const tomDb = migrer.afgoerVagt([], [grundrobot()], yamlMedNyRobot);
  ok('afgoerVagt: en tom database naegter aldrig, uanset aftryk/YAML',
    tomDb.naegt === false && tomDb.kilde === 'tom-database', JSON.stringify(tomDb));

  const agentTilfaeldet = migrer.afgoerVagt([grundrobot()], [grundrobot()], yamlMedNyRobot);
  ok('afgoerVagt: DB matcher AFTRYKKET, YAML er rykket videre (agent-tilfaeldet) - naegter IKKE',
    agentTilfaeldet.naegt === false && agentTilfaeldet.kilde === 'aftryk', JSON.stringify(agentTilfaeldet));

  const dbRedigeretIStudio = grundrobot();
  dbRedigeretIStudio.producentby = 'VAGT2TEST';
  const studioTilfaeldet = migrer.afgoerVagt([dbRedigeretIStudio], [grundrobot()], [grundrobot()]);
  ok('afgoerVagt: DB afviger fra AFTRYKKET (Studio-tilfaeldet) - naegter, selv naar YAML uaendret',
    studioTilfaeldet.naegt === true && studioTilfaeldet.kilde === 'aftryk'
    && studioTilfaeldet.afvigelser.length === 1 && studioTilfaeldet.afvigelser[0].sti === 'producentby',
    JSON.stringify(studioTilfaeldet));

  const intetAftrykEns = migrer.afgoerVagt([grundrobot()], null, [grundrobot()]);
  ok('afgoerVagt: intet aftryk findes endnu, DB matcher YAML - fald-tilbage naegter ikke',
    intetAftrykEns.naegt === false && intetAftrykEns.kilde === 'yaml-fallback', JSON.stringify(intetAftrykEns));

  const intetAftrykUens = migrer.afgoerVagt([dbRedigeretIStudio], null, [grundrobot()]);
  ok('afgoerVagt: intet aftryk findes endnu, DB afviger fra YAML - fald-tilbage naegter (som L35s foerste udgave)',
    intetAftrykUens.naegt === true && intetAftrykUens.kilde === 'yaml-fallback', JSON.stringify(intetAftrykUens));
}

console.log('\n8. Vagten i db/eksporter.mjs — ren beslutningsfunktion (L35-opfoelgning, punkt 1)');
{
  // Ren funktion, testes uden netvaerk og uden .env - se db/eksporter.mjs's
  // boerFlyttes. Importeres som modul; erHoved-vagten i eksporter.mjs
  // sikrer, at main() ikke koerer bare fordi filen bliver importeret her -
  // samme moenster som afsnit 7 bruger for db/migrer.mjs's
  // sammenlignDbMedYaml. Beviser netop det, punktets opgavebrev kraever: at
  // et fejlfrit valideringsresultat foerer til flytning (boerFlyttes === true),
  // og at et fejlbehaeftet ikke goer (boerFlyttes === false) - uafhaengigt af
  // om databasen eller assets/ overhovedet findes paa maskinen.
  const eksporter = await import(`file://${path.join(rod, 'db', 'eksporter.mjs').replace(/\\/g, '/')}`);

  ok('0 fejl foerer til flytning (boerFlyttes === true)',
    eksporter.boerFlyttes({ filer: 77, fejl: 0, advarsler: 1 }) === true);
  ok('0 fejl og 0 advarsler foerer ogsaa til flytning',
    eksporter.boerFlyttes({ filer: 1, fejl: 0, advarsler: 0 }) === true);
  ok('1 fejl blokerer flytningen (boerFlyttes === false), selv med 0 advarsler',
    eksporter.boerFlyttes({ filer: 77, fejl: 1, advarsler: 0 }) === false);
  ok('flere fejl blokerer ligesaa - advarsler alene maa aldrig kunne maskere en fejl',
    eksporter.boerFlyttes({ filer: 77, fejl: 55, advarsler: 1 }) === false);
}

console.log('\n9. tools/alder.mjs — rene funktioner (aeldste/nyeste/median, graense-logik)');
{
  // robotAlder: kendte datoer, kendte svar. Rakkefoelgen i input er BEVIDST
  // ikke sorteret - funktionen skal selv sortere, ikke bare tage input[0].
  const a5 = alder.robotAlder(
    ['2026-08-19', '2026-08-01', '2026-08-25', '2026-08-10', '2026-08-15']);
  ok('robotAlder: 5 datoer (ulige antal) - aeldste, nyeste og midterste er de rigtige',
    a5.aeldste === '2026-08-01' && a5.nyeste === '2026-08-25' && a5.median === '2026-08-15'
    && a5.antal === 5, JSON.stringify(a5));

  ok('robotAlder: tom liste er null, ikke en dato — INGEN DATEREDE KILDER er en tredje tilstand',
    alder.robotAlder([]) === null && alder.robotAlder(undefined) === null);

  // medianDato ved lige antal: to eksempler, saa BAADE grundreglen (gennemsnit af
  // de to midterste) OG afrundingsvalget (naermeste hele dag, op ved en halv) er
  // bevist - ikke kun det ene tilfaelde, der aldrig rammer en halv dag.
  ok('medianDato: lige antal, praecis midtvejs mellem to datoer uden brøkdag (01. og 03. -> 02.)',
    alder.medianDato(['2026-08-01', '2026-08-01', '2026-08-03', '2026-08-03']) === '2026-08-02');
  ok('medianDato: lige antal, midtpunktet er en halv dag (02. og 03.) -> runder OP til 03.',
    alder.medianDato(['2026-08-01', '2026-08-02', '2026-08-03', '2026-08-04']) === '2026-08-03');

  ok('dageSiden: 2026-08-01 til 2026-08-25 er 24 hele dage',
    alder.dageSiden('2026-08-01', '2026-08-25') === 24);

  // tilEfterproevning: graensen er "AELDRE end N dage" - en robot noejagtig N
  // dage gammel er IKKE til efterproevning endnu, N+1 er.
  const alderMedNyeste = { aeldste: '2026-07-01', nyeste: '2026-08-01', median: '2026-07-15', antal: 3 };
  ok('tilEfterproevning: 24 dage gammel, graense 23 -> til efterproevning (24 > 23)',
    alder.tilEfterproevning(alderMedNyeste, '2026-08-25', 23) === true);
  ok('tilEfterproevning: 24 dage gammel, graense 24 -> IKKE til efterproevning (24 er ikke > 24)',
    alder.tilEfterproevning(alderMedNyeste, '2026-08-25', 24) === false);
  ok('tilEfterproevning: 24 dage gammel, graense 25 -> IKKE til efterproevning',
    alder.tilEfterproevning(alderMedNyeste, '2026-08-25', 25) === false);
  ok('tilEfterproevning: robot uden daterede kilder (alder === null) er ALDRIG til efterproevning her - ' +
    'den staar allerede i sin egen tilstand, "til efterproevning" maaler fra en nyeste-dato, den ikke har',
    alder.tilEfterproevning(null, '2026-08-25', 0) === false);

  // datoerIRobot: samler felter + anvendelse + billede, og IGNORERER bevidst
  // bare tilstand-strenge og tilstandsposter uden en gyldig "hentet".
  const doc = {
    felter: {
      egenvaegt: { vaerdi: 60, enhed: 'kg', kilde: 'https://example.com', hentet: '2026-08-01' },
      frihedsgrader: 'ikke_oplyst',                                    // bar tilstand - ingen dato at samle
      driftstid: { vaerdi: 'ikke_oplyst', kilde: 'https://example.com' }, // tilstandspost UDEN hentet
      hastighed: { vaerdi: 5, enhed: 'm/s', kilde: 'https://example.com', hentet: '2026-08-10' },
    },
    anvendelse: { vaerdi: 'industri', citat: 'x', kilde: 'https://example.com', hentet: '2026-08-05' },
    billede: { fil: 'silhuetter/x.svg', ophav: 'silhuet', kilde: 'https://example.com', hentet: '2026-08-15' },
  };
  const datoer = alder.datoerIRobot(doc);
  ok('datoerIRobot: 4 gyldige datoer fundet (2 felter + anvendelse + billede), 2 felter uden dato sprunget over',
    datoer.length === 4
    && ['2026-08-01', '2026-08-10', '2026-08-05', '2026-08-15'].every((d) => datoer.includes(d)),
    JSON.stringify(datoer));

  const docUdenDato = { felter: { egenvaegt: 'ikke_oplyst' }, anvendelse: 'ikke_oplyst' };
  ok('datoerIRobot: en robot helt uden daterede kilder giver en tom liste, ikke en fejl',
    Array.isArray(alder.datoerIRobot(docUdenDato)) && alder.datoerIRobot(docUdenDato).length === 0);
}

// === spor/kort: fodnote + CE-maerke vaek ===
// JPK bad om at fodnotesektionen og EU/CE-maerket forsvinder fra katalogkortene
// (side.mjs kort()). Disse tre proever ville FEJLE, hvis nogen af de to blev
// rullet tilbage - og de bruger det samme fixture-byg (`dist`) som afsnit 4
// allerede byggede ovenfor, saa de proever det faktiske HTML-output, ikke
// skabelonens kildekode.
console.log('\n10. spor/kort: fodnotesektion og EU/CE-maerke vaek fra katalogkort');
{
  const katalogDaKort = fs.readFileSync(path.join(dist, 'da', 'robotter', 'index.html'), 'utf8');
  const forsideDa = fs.readFileSync(path.join(dist, 'da', 'index.html'), 'utf8');

  ok('4a: et bygget katalogkort indeholder ingen kort-fod',
    !katalogDaKort.includes('kort-fod'));

  ok('4b: et bygget katalogkort indeholder intet EU/CE-maerke (klassen "eu eu--" er vaek)',
    !/class="eu eu--/.test(katalogDaKort) && !katalogDaKort.includes('eu-svar'));

  // L32: forsidens CE-taelling (hjaelp.ceTilstand via forside.mjs) skal blive
  // staaende uaendret. Tallene er UDLEDT af proevedatasaettet her, ikke
  // haardkodede - fixture-settet (tests/eksempel-robotter) kan aendre sig,
  // uden at proeven bliver forkert af den grund.
  const ceMatch = forsideDa.match(/<b class="eu-fund-tal">(\d+) af (\d+)<\/b>/);
  ok('4c: forsidens CE-saetning findes stadig og baerer to udledte tal (VAERN OM L32)',
    !!ceMatch && Number.isInteger(Number(ceMatch[1])) && Number.isInteger(Number(ceMatch[2]))
    && Number(ceMatch[2]) > 0,
    ceMatch ? `fandt "${ceMatch[1]} af ${ceMatch[2]}"` : 'ingen eu-fund-tal fundet paa forsiden');
}

// === spor/forside: fund 2 + 7 ===
// Nummereret 11 ved flettet 26. aug 2026: sporet skrev "7", men afsnit 7 var
// optaget, og spor/kort tog 10 i samme flet. Numrene er kun laeseordre.
console.log('\n11. Forsidens udvalgsregel (fund 2) og yderpunkter (fund 7) — spor/forside');
{
  const forsideModul = await import(
    `file://${path.join(rod, 'tools', 'skabelon', 'forside.mjs').replace(/\\/g, '/')}`);

  // 3a + 3b: udvalgReglen() kaldes direkte paa det rigtige katalog - ingen fixture,
  // for hvis kataloget aendrer sig, skal testen maale DET rigtige katalog, ikke
  // et haardkodet snapshot af det. Samme skema.NAEVNER som build.mjs bruger (L30).
  const robotterNu = lasRobotter(path.join(rod, 'data', 'robots'));
  const udvalgOpts = { naevner: skema.NAEVNER, d4: false, antal: 6, minVaegtklasser: 3 };

  const valgt1 = forsideModul.udvalgReglen(robotterNu, udvalgOpts);
  const producenterIValgt = new Set(valgt1.map((r) => r.producent));
  ok('3a. udvalgReglen(): 6 forskellige producenter paa det nuvaerende katalog',
    producenterIValgt.size === 6,
    `fik ${producenterIValgt.size} producent(er): ${[...producenterIValgt].join(', ')}`);

  const valgt2 = forsideModul.udvalgReglen(robotterNu, udvalgOpts);
  ok('3b. udvalgReglen(): deterministisk - samme input to gange giver samme raekkefoelge',
    JSON.stringify(valgt1.map((r) => r.slug)) === JSON.stringify(valgt2.map((r) => r.slug)),
    `${valgt1.map((r) => r.slug).join(',')} vs ${valgt2.map((r) => r.slug).join(',')}`);

  // 3c: bygget, ikke bare skabelonens funktion - beviser at HTML'en, en laeser
  // faktisk moeder, har mistet lead/lille-opdelingen, ikke kun at koden gør.
  const ud7 = path.join(tmp, 'dist-forside-fund2');
  const b7 = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${ud7}`],
    { cwd: rod, encoding: 'utf8' });
  ok('build.mjs (spor/forside-testbyg) giver exit 0', b7.status === 0, (b7.stderr || '').trim());

  const forsideHTML = fs.readFileSync(path.join(ud7, 'da', 'index.html'), 'utf8');
  const ypFaelles = (forsideHTML.match(/<article class="yderpunkt">/g) || []).length;
  const harLead = forsideHTML.includes('yderpunkt--lead');
  const harLille = forsideHTML.includes('yderpunkt--lille');
  ok('3c. alle fire yderpunkter renderes med samme (faelles) klasse - ingen lead, ingen lille',
    ypFaelles === 4 && !harLead && !harLille,
    `yderpunkt-kort (faelles klasse): ${ypFaelles}, lead-forekomster: ${harLead}, lille-forekomster: ${harLille}`);
}

// === spor/sammenlign: fund 3 + 6 + 8 ===
// Nummereret 12 ved flettet 26. aug 2026: sporet skrev "10", som spor/kort tog
// i samme flet. Numrene er kun laeseordre.
console.log('\n12. spor/sammenlign: standardtrio (punkt 1), tekst+interval (punkt 2), soegning (punkt 3)');
{
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

  // 4d — soegefeltet (punkt 3): en minimal, formaalsbygget DOM-shim (ingen ny
  // afhaengighed - projektet er dependency-frit og har ingen jsdom). Den
  // koerer den RIGTIGE assets/sammenligning.js mod den RIGTIGE byggede side
  // via node:vm og daekker kun det, filen faktisk bruger: getElementById,
  // querySelector(All) paa tag/#id/[attr]/[attr=vaerdi], hidden/value/checked/
  // textContent og addEventListener/dispatchEvent - ikke en generel HTML-parser.
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

  const chips = domQueryAll(domRod, '[data-sog]');
  const soegInput = domDocument.getElementById('saml-soeg');
  ok('4d: soegefeltet ("Søg blandt robotterne") staar i den byggede side', !!soegInput);

  const synligeFoer = chips.filter((c) => !c.hidden).length;
  if (soegInput) { soegInput.value = 'gang'; soegInput.dispatchEvent('input'); }
  const synligeEfter = chips.filter((c) => !c.hidden).length;

  ok('4d: soegning paa "gang" reducerer chips til Gangben-familien '
    + `(foer: ${synligeFoer}/${chips.length} synlige · efter: ${synligeEfter} synlige, alle matcher "gang")`,
    !!soegInput && synligeFoer === chips.length && synligeEfter > 0 && synligeEfter < synligeFoer
    && chips.filter((c) => !c.hidden).every((c) => (c.getAttribute('data-sog') || '').includes('gang')));
}

// === spor/yderpunkt: K5 + K6 ===
// Beviser tre ting, der ellers ville faa forsidens yderpunkter til at lyve:
// K5a en graense-operator (<=, >=, <, >) kan ikke baere et yderpunkt (Aa-fund
//     26. aug 2026: "<= 100 kg" beviser ikke at Qiuqiu SP1 er tungest, kun at
//     den ikke er tungere end 100 - den kunne veje 40).
// K5b sammen med K5a: intet yderpunkt mangler et rigtigt fotografi - en
//     afskaaret maaleplade i det lille felt er ikke information.
// K6  forklaringens tal (tf('yderpunkter_forklaring', {n})) foelger det
//     faktiske antal viste kort paa den BYGGEDE forside, ikke et haardkodet
//     "Fire" - og ingen af kortene viser en maaleplade (.billedled--maal).
console.log('\n13. Yderpunkternes graense-operator- og fotokrav (spor/yderpunkt)');
{
  const sideModul = await import(
    `file://${path.join(rod, 'tools', 'skabelon', 'side.mjs').replace(/\\/g, '/')}`);
  const robotterNu = lasRobotter(path.join(rod, 'data', 'robots'));
  const yp = sideModul.ekstremer(robotterNu);

  const GRAENSE_OPERATORER = new Set(['<', '<=', '>', '>=']);
  const medGraense = yp.filter((x) => GRAENSE_OPERATORER.has(x.post?.operator));
  ok('K5a: intet yderpunkt baeres af en graense-operator (<, <=, >, >=)',
    medGraense.length === 0,
    medGraense.map((x) => `${x.id}=${x.robot.slug} (${x.post.operator})`).join(', '));

  const udenFoto = yp.filter((x) => !sideModul.laesBillede(x.robot));
  ok('K5b: intet yderpunkt mangler et rigtigt fotografi (laesBillede() !== null)',
    udenFoto.length === 0,
    udenFoto.map((x) => `${x.id}=${x.robot.slug}`).join(', '));

  // K5c: SYNTETISK fixture, ikke det rigtige katalog. Paa dagens 77 datafiler
  // aendrer fotokravet 0 yderpunkter (alle vindere har allerede et foto af
  // andre grunde), saa K5b alene ville forblive groen, selv hvis fotokravet
  // blev fjernet fra ekstremer() - den maaler kun DAGENS tilfaeldighed, ikke
  // REGLEN. Denne fixture tvinger en robot uden foto til at vaere den letteste
  // paa et rent tal, og beviser at den IKKE vindes vaek fra fotobaerende R2.
  const fiksturFotokrav = [
    { slug: 'uden-foto-letst', navn: 'Uden foto', felter: { egenvaegt: { vaerdi: 1, enhed: 'kg' } } },
    { slug: 'med-foto-naestletst', navn: 'Med foto', felter: { egenvaegt: { vaerdi: 2, enhed: 'kg' } },
      billede: { fil: 'test.jpg' } },
  ];
  const ypFikstur = sideModul.ekstremer(fiksturFotokrav);
  const letsteFikstur = ypFikstur.find((x) => x.id === 'letteste');
  ok('K5c (syntetisk): en robot uden foto vinder IKKE et yderpunkt, selv med det mest ekstreme tal',
    !!letsteFikstur && letsteFikstur.robot.slug === 'med-foto-naestletst',
    letsteFikstur ? `valgte ${letsteFikstur.robot.slug}` : 'intet letteste-yderpunkt fundet');

  const udY = path.join(tmp, 'dist-yderpunkt');
  const bY = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${udY}`],
    { cwd: rod, encoding: 'utf8' });
  ok('K6: build.mjs (spor/yderpunkt-testbyg) giver exit 0', bY.status === 0, (bY.stderr || '').trim());

  const forsideHTML = fs.readFileSync(path.join(udY, 'da', 'index.html'), 'utf8');
  const sektionMatch = forsideHTML.match(
    /<div class="yderpunkter">([\s\S]*?)\n<\/div>\n<p class="t-lille sektion-note">([\s\S]*?)<\/p>/);
  ok('K6: yderpunktsektionen findes paa den byggede forside', !!sektionMatch);

  if (sektionMatch) {
    const [, sektion, forklaring] = sektionMatch;
    const antalKort = (sektion.match(/<article class="yderpunkt">/g) || []).length;
    const talIForklaring = forklaring.match(/^(\d+)/);
    ok('K6b: forklaringens tal foelger det faktiske antal viste yderpunkt-kort',
      !!talIForklaring && Number(talIForklaring[1]) === antalKort,
      `forklaring siger "${talIForklaring ? talIForklaring[1] : '?'}", gitteret viser ${antalKort} kort`);

    const antalMaal = (sektion.match(/billedled--maal/g) || []).length;
    ok('K6c: intet yderpunkt viser en maaleplade (0 forekomster af billedled--maal)',
      antalMaal === 0, `${antalMaal} forekomster`);
  }
}

// === spor/producent: K11 + K12 ===
console.log('\nK11 + K12. Producentoversigten: tre kolonner + beregnet fordelingssaetning');
{
  // Genbruger `dist` (byggeoutput fra tests/eksempel-robotter, afsnit 4
  // ovenfor) og lasRobotter() - IKKE producent.mjs's egne hjaelpefunktioner
  // (landefordeling/producentSaetning), saa testen er en uafhaengig
  // efterregning af det byggede resultat, ikke et ekko af samme kode.
  const fixtureMappe = path.join(rod, 'tests', 'eksempel-robotter');
  const fixtureRobotter = lasRobotter(fixtureMappe);
  const fixtureProducenter = new Set(fixtureRobotter.map((r) => r.producent));

  const prodIndeksDa = fs.readFileSync(path.join(dist, 'da', 'producenter', 'index.html'), 'utf8');
  const prodIndeksEn = fs.readFileSync(path.join(dist, 'en', 'producenter', 'index.html'), 'utf8');

  // K11: tre adskilte celler pr. raekke - IKKE land og modeltal klistret
  // sammen i én <dd>-streng ("Kina 13 modeller", saadan stod det foer punkt
  // 1). Rulles aendringen tilbage til .raekker/.raekke, forsvinder <table>
  // og <td> helt, og testen fejler paa antallet (0 != forventet).
  const trIAlt = (prodIndeksDa.match(/<tr>/g) || []).length;
  const tdAntal = (prodIndeksDa.match(/<td[ >]/g) || []).length;
  const figurTdAntal = (prodIndeksDa.match(/<td class="figur">/g) || []).length;
  const forventetRaekker = fixtureProducenter.size;
  ok(`K11: producentoversigten har ${forventetRaekker} datarækker med tre <td> hver, `
    + `modeltallet højrestillet med .figur `
    + `(fandt ${trIAlt - 1}/${forventetRaekker} <tr>, ${tdAntal}/${forventetRaekker * 3} <td>, `
    + `${figurTdAntal}/${forventetRaekker} <td class="figur">)`,
    trIAlt - 1 === forventetRaekker && tdAntal === forventetRaekker * 3
    && figurTdAntal === forventetRaekker
    && /<th scope="col" class="figur">/.test(prodIndeksDa));

  // K12: den beregnede fordelingssaetning baerer TAL, der matcher en
  // UAFHAENGIG optaelling af proevedatasaettet (Set af producentnavne pr.
  // land, ikke summering af `antal`-feltet, som producent.mjs selv bruger) -
  // ikke konstanter, der bare tilfaeldigvis passer i dag. Rulles punkt 2
  // tilbage (saetningen fjernes, eller et tal haardkodes), fejler testen paa
  // enten fravaeret af klassen eller et forkert tal.
  const perLand = new Map();
  for (const r of fixtureRobotter) {
    const land = r.producentland;
    if (!land || skema.tilstandAf(land)) continue;
    const t = perLand.get(land) ?? { producenter: new Set(), modeller: 0 };
    t.producenter.add(r.producent);
    t.modeller += 1;
    perLand.set(land, t);
  }
  let bedstLand = null; let bedstTal = null;
  for (const [land, t] of perLand) {
    const producenter = t.producenter.size;
    if (!bedstLand || producenter > bedstTal.producenter
      || (producenter === bedstTal.producenter && land.localeCompare(bedstLand, 'da') < 0)) {
      bedstLand = land; bedstTal = { producenter, modeller: t.modeller };
    }
  }
  const totalProducenter = fixtureProducenter.size;
  const totalModeller = fixtureRobotter.length;

  const forventetDa = `${bedstTal.producenter} af ${totalProducenter} producenter er fra ${bedstLand} `
    + `og står for ${bedstTal.modeller} af de ${totalModeller} modeller i kataloget.`;
  ok(`K12: fordelingssaetningen matcher en uafhaengig optaelling af proevedatasaettet ("${forventetDa}")`,
    prodIndeksDa.includes(forventetDa));

  // Samme paa /en/ - beviser at det er ÉN oversat skabelon, ikke to kopier
  // der kan skride fra hinanden (samme princip som 4.'s katalog-test).
  const landOversat = { Kina: 'China', Schweiz: 'Switzerland', USA: 'USA' };
  const bedstLandEn = landOversat[bedstLand] ?? bedstLand;
  const forventetEn = `${bedstTal.producenter} of ${totalProducenter} manufacturers are from ${bedstLandEn} `
    + `and account for ${bedstTal.modeller} of the ${totalModeller} models in the catalogue.`;
  ok(`K12: samme fordelingssaetning er oversat paa /en/ ("${forventetEn}")`,
    prodIndeksEn.includes(forventetEn));
}

// === spor/enheder: K9 + K10 ===
// Punkt 1 (K9): ni felter blandede mm/cm/m, m/s/km-h, t/min, CNY/USD/EUR i
// samme kolonne (bevis i briefet). skema.mjs' visningsPost()/
// normaliserVisningsEnheder() omsaetter 7 af dem til ÉN kanonisk visnings-
// enhed - KUN i build.mjs's i-hukommelse-kopi, aldrig i datafilerne selv.
// `pris` og `haeldning` er bevidste undtagelser (CLAUDE.md-briefets regel
// 1b/1c). Punkt 2 (K10): sammenligningstabellens kolonnehoved (.specimen-
// hoved) er klaebende fra 901 px, saa robotnavnene ikke ruller ud af
// billedet foer sidste raekke ("CE oplyst").
console.log('\n13. spor/enheder: kanonisk visningsenhed (K9) og klaebende tabelhoved (K10)');
{
  // --- K9a/K9b: visningsPost() paa isolerede poster - beviser SELVE
  // omregningen, uafhaengigt af om build.mjs husker at kalde den. ---
  const spotLaengde = { vaerdi: 1100, enhed: 'mm', kilde: 'https://x/', hentet: '2026-01-01' };
  const spotVist = skema.visningsPost('laengde', spotLaengde);
  ok('K9a: visningsPost normaliserer Spots laengde 1100 mm -> 110 cm og bevarer kilden',
    spotVist.vaerdi === 110 && spotVist.enhed === 'cm' && spotVist.kilde === spotLaengde.kilde
    && spotVist._kildeform === '1100 mm',
    JSON.stringify(spotVist));

  const go2Laengde = { vaerdi: 70, enhed: 'cm', kilde: 'https://x/' };
  const go2Vist = skema.visningsPost('laengde', go2Laengde);
  ok('K9a: visningsPost roerer IKKE Go2s laengde 70 cm (allerede kanonisk) - samme reference',
    go2Vist === go2Laengde && go2Vist._kildeform === undefined,
    JSON.stringify(go2Vist));

  const driftT = { vaerdi: 1.5, enhed: 't', kilde: 'https://x/' };
  const driftVist = skema.visningsPost('driftstid', driftT);
  ok('K9a: visningsPost omsaetter driftstid 1,5 t -> 90 min (mindretallets enhed, se skema.mjs)',
    driftVist.vaerdi === 90 && driftVist.enhed === 'min', JSON.stringify(driftVist));

  const prisPost = { vaerdi: 100, enhed: 'USD', kilde: 'https://x/' };
  ok('K9b: `pris` staar UDEN for KANONISK_VISNINGSENHED - visningsPost roerer den ikke',
    skema.visningsPost('pris', prisPost) === prisPost && !('pris' in skema.KANONISK_VISNINGSENHED));

  const haeldningPct = { vaerdi: 45, enhed: '%', kilde: 'https://x/' };
  ok('K9b (dokumenteret 1c-undtagelse): `haeldning` staar OGSAA uden for kortet - % roeres ikke',
    skema.visningsPost('haeldning', haeldningPct) === haeldningPct
    && !('haeldning' in skema.KANONISK_VISNINGSENHED));

  // --- K9c: datafilerne paa disk er urørte - laest FRISK, ikke via bygget. ---
  const spotRaa = skema.normaliserRobot(yaml.parseYaml(
    fs.readFileSync(path.join(rod, 'data', 'robots', 'boston-dynamics-spot.yaml'), 'utf8'),
    'boston-dynamics-spot.yaml'));
  ok('K9c: data/robots/boston-dynamics-spot.yaml har STADIG laengde: 1100 mm paa disk',
    spotRaa.felter.laengde.vaerdi === 1100 && spotRaa.felter.laengde.enhed === 'mm',
    JSON.stringify(spotRaa.felter.laengde));

  // --- K9a (helhed) + K9b (helhed): et rigtigt byg af HELE kataloget - beviser
  // at build.mjs faktisk KALDER normaliseringen, ikke kun at funktionen findes. ---
  const udK9 = path.join(tmp, 'dist-enheder');
  const bK9 = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${udK9}`],
    { cwd: rod, encoding: 'utf8' });
  ok('spor/enheder: byg af hele kataloget giver exit 0', bK9.status === 0, (bK9.stderr || '').trim());

  const robotsJson = JSON.parse(fs.readFileSync(path.join(udK9, 'robots.json'), 'utf8'));
  const KANDIDATER = ['laengde', 'bredde', 'hoejde', 'forhindring_enkelt',
    'hastighed', 'driftstid', 'ladetid'];
  const enhederPrFelt = {};
  for (const navn of KANDIDATER) enhederPrFelt[navn] = new Set();
  const prisEnheder = new Set();
  for (const r of robotsJson.robotter) {
    for (const navn of KANDIDATER) {
      const v = r.alle_felter?.[navn];
      if (v && v.tilstand === 'tal' && v.enhed) enhederPrFelt[navn].add(v.enhed);
    }
    const p = r.alle_felter?.pris;
    if (p && p.tilstand === 'tal' && p.enhed) prisEnheder.add(p.enhed);
  }
  for (const navn of KANDIDATER) {
    ok(`K9a: "${navn}" viser PRAECIS én enhed paa tvaers af kataloget (bygget dist)`,
      enhederPrFelt[navn].size === 1, `fandt: ${[...enhederPrFelt[navn]].join(', ') || 'ingen'}`);
  }
  ok('K9b: `pris` viser STADIG flere valutaer (den bevidste undtagelse er ikke rullet ind i normaliseringen)',
    prisEnheder.size >= 2, `fandt: ${[...prisEnheder].join(', ')}`);

  // --- K10: klaebende kolonnehoved staar i den byggede CSS. ---
  const builtCss = fs.readFileSync(path.join(udK9, 'generator.css'), 'utf8');
  const harKlaebende = /\.specimen-hoved\{[^}]*position:sticky[^}]*top:0/.test(builtCss)
    || /@media[^{]*\{\s*\.specimen-hoved\{[^}]*position:sticky/.test(builtCss);
  ok('K10: .specimen-hoved har position:sticky;top:0 i den byggede generator.css',
    harKlaebende);
}

// === spor/billedramme: K1 + K4 ===
// Nummereret 13 ved flettet 26. aug 2026: sporet skrev "5", som var optaget.
console.log('\n13. spor/billedramme: sideforhold -> --plade automatisk, og eager/lazy paa kortene');
{
  const sideMod = await import(`file://${path.join(rod, 'tools', 'skabelon', 'side.mjs').replace(/\\/g, '/')}`);

  /** Minimal, GYLDIG PNG-header (signatur + IHDR med w/h) - ingen IDAT, fordi
   *  dimAfPNG() i side.mjs kun laeser byte 16-24 og aldrig afkoder billedet. */
  function lavPNG(w, h) {
    const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(w, 0);
    ihdr.writeUInt32BE(h, 4);
    ihdr[8] = 8; // bit depth
    const laengde = Buffer.alloc(4);
    laengde.writeUInt32BE(13, 0);
    const type = Buffer.from('IHDR', 'ascii');
    const crc = Buffer.alloc(4); // efterproeves ikke af dimAfPNG
    return Buffer.concat([sig, laengde, type, ihdr, crc]);
  }

  // --- K1 (3a/3b): filens EGET sideforhold afgoer --plade, ikke et huskefelt ---
  const dimRod = path.join(tmp, 'sideforhold-rod');
  fs.mkdirSync(path.join(dimRod, 'assets', 'fotos'), { recursive: true });
  fs.writeFileSync(path.join(dimRod, 'assets', 'fotos', 'skaev.png'), lavPNG(300, 900)); // ratio 0,33 - 79 % fra 1,6
  fs.writeFileSync(path.join(dimRod, 'assets', 'fotos', 'paesig.png'), lavPNG(320, 200)); // ratio 1,6 praecis - 0 %

  ok('3a: et billede langt fra 16:10 (300x900, ratio 0,33) faar --plade automatisk (billedAutoPlade)',
    sideMod.billedAutoPlade('fotos/skaev.png', dimRod) === true);
  ok('3b: et billede PRAECIS 16:10 (320x200) faar IKKE --plade — reglen skelner, saetter den ikke paa alt',
    sideMod.billedAutoPlade('fotos/paesig.png', dimRod) === false);

  // Samme skel igennem HELE kaeden: laesBillede() -> plade-feltet -> markup'et.
  const bSkaev = sideMod.laesBillede({ billede: { fil: 'fotos/skaev.png', ophav: 'fabrikant' } }, dimRod);
  const bPaesig = sideMod.laesBillede({ billede: { fil: 'fotos/paesig.png', ophav: 'fabrikant' } }, dimRod);
  ok('3a: laesBillede() saetter plade:true for det skaeve foto, uden noget plade-felt i YAML',
    bSkaev?.plade === true);
  ok('3b: laesBillede() saetter plade:false for det paesiddende foto',
    bPaesig?.plade === false);

  const tekst = { intet: '', grund: '', alt: 'x', delt: '', ophav: {} };
  ok('3a: billedledHTML() skriver billedled--plade for det skaeve foto',
    /class="billedled billedled--plade"/.test(sideMod.billedledHTML({ b: bSkaev, tekst })));
  ok('3b: billedledHTML() skriver IKKE billedled--plade for det paesiddende foto',
    !sideMod.billedledHTML({ b: bPaesig, tekst }).includes('billedled--plade'));

  // Eksplicit `plade: nej` skal vinde over maalingen, ogsaa naar filen rent
  // faktisk er skaev — et bevidst felt maa ikke overstyres af en maaling.
  const bSkaevMenNej = sideMod.laesBillede(
    { billede: { fil: 'fotos/skaev.png', ophav: 'fabrikant', plade: 'nej' } }, dimRod,
  );
  ok('eksplicit plade:nej i YAML vinder over den automatiske udledning',
    bSkaevMenNej?.plade === false);

  // --- K4 (3c): de foerste EAGER_KORT_ANTAL katalogkort er eager, resten lazy ---
  ok('billedledHTML(): eager:true skriver loading="eager"',
    /loading="eager"/.test(sideMod.billedledHTML({ b: bPaesig, eager: true, tekst })));
  ok('billedledHTML(): eager:false (standard) skriver loading="lazy"',
    /loading="lazy"/.test(sideMod.billedledHTML({ b: bPaesig, tekst })));
  ok('billedledHTML(): stor (robotsidens hero) vinder over eager - baerer aldrig et loading-attribut',
    !/loading=/.test(sideMod.billedledHTML({
      b: bPaesig, stor: true, eager: true, tekst,
    })));

  // Integrationstjek paa den RIGTIGE data/robots/: eager-taelleren i det
  // byggede katalog skal matche EAGER_KORT_ANTAL - ikke et haardkodet 4, saa
  // testen foelger med, hvis konstanten selv aendres.
  const eagerDist = path.join(tmp, 'dist-eager');
  const b5 = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${eagerDist}`],
    { cwd: rod, encoding: 'utf8' });
  ok('3c: byg af den rigtige data/robots/ giver exit 0', b5.status === 0,
    (b5.stderr || '').trim().split('\n').slice(-3).join(' / '));
  const katalogHTML = fs.readFileSync(path.join(eagerDist, 'da', 'robotter', 'index.html'), 'utf8');
  const eagerAntal = (katalogHTML.match(/loading="eager"/g) || []).length;
  const lazyAntal = (katalogHTML.match(/loading="lazy"/g) || []).length;
  const imgAntal = (katalogHTML.match(/<img /g) || []).length;
  ok(`3c: kataloget har praecis EAGER_KORT_ANTAL (${sideMod.EAGER_KORT_ANTAL}) kort med `
    + `loading="eager" (fandt ${eagerAntal})`,
    eagerAntal === sideMod.EAGER_KORT_ANTAL);
  ok(`3c: resten af billederne (${imgAntal} <img> i alt) er loading="lazy" (fandt ${lazyAntal})`,
    lazyAntal === imgAntal - eagerAntal && lazyAntal > 0);

  // --- Punkt 5: S1 er ophaevet (JPK, 26. aug 2026) - billednote-banneret er
  // fjernet fra ALLE sider, og forhandler-fodnoten (et andet krav, om
  // forhandlerforhold, ikke billedtilladelse) staar stadig. ---
  const forsideHTML = fs.readFileSync(path.join(eagerDist, 'da', 'index.html'), 'utf8');
  ok('5: billednote-banneret findes ikke laengere paa katalogsiden',
    !katalogHTML.includes('billednote'));
  ok('5: billednote-banneret findes ikke laengere paa forsiden',
    !forsideHTML.includes('billednote'));
  ok('5: teksten om manglende skriftlig tilladelse er vaek fra kataloget',
    !katalogHTML.includes('uden skriftlig tilladelse'));
  ok('5: sidefodens forhandler-fodnote staar stadig (produktkrav, ikke S1)',
    forsideHTML.includes('Vi er ikke forhandler'));
}

console.log(`\nValidator: ${alle.length + arvsagerFangede} oedelagte tilfaelde `
  + `(${alle.length} i én fil + ${arvsagerFangede} paa tvaers af filer), fangede ${fangede}.`);
console.log(`I alt: ${bestaaet} bestaaet, ${fejlet} fejlet.`);
if (fejlet) console.log(`Fejlede: ${fejlliste.join(' · ')}`);
process.exit(fejlet ? 1 : 0);
