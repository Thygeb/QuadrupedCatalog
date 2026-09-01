/**
 * tests/dele/01-validator-regler.mjs — tools/validate.mjs's regelsaet.
 *
 * Selvtest af parser/normalisering, bevidst oedelagte tilfaelde (skal fejle
 * paa DEN RIGTIGE regel), de to skemaudvidelser og aliasserne (skal
 * PASSERE), arv af anvendelse paa tvaers af filer (R17/L23), og til sidst at
 * gyldige filer rent faktisk gaar igennem (inkl. --streng-flaget).
 *
 * Denne del returnerer {validator: {ietFilAntal, paaTVaersAntal, fangede}} -
 * koer.mjs bruger det til den afsluttende "Validator: ..."-linje, fordi de
 * tal stammer herfra og ingen andre steder.
 */
import fs from 'node:fs';
import path from 'node:path';

const GYLDIG_HOVED = `slug: NAVN
navn: Proeve
producent: Proeveproducent
producentland: Kina
status: i_produktion
fremdrift: ben
felter:
`;

/** Hoved uden felter, til R18-tilfaeldene. `felter:` skrives af hvert tilfaelde. */
const BILLEDHOVED = `slug: NAVN
navn: Proeve
producent: Proeveproducent
producentland: Kina
status: i_produktion
fremdrift: ben
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
    `  hastighed:\n    vaerdi: 1.5\n    enhed: km/h\n    raa: "1.5 m/s"\n    kilde: https://example.com/a\n    hentet: 2026-08-19\n`],
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
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\nfremdrift: ben\n` +
    `varianter: [Basic, Pro]\nfelter:\n  egenvaegt:\n    vaerdi: 12\n    enhed: kg\n` +
    `    kilde: https://example.com/a\n    hentet: 2026-08-19\n    varianter:\n      Basic: 12\n      Prox: 13\n`],
  ['variantlisten er ikke en liste', 'R15',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\nfremdrift: ben\n` +
    `varianter: Basic\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['noter er hverken tekst eller liste af tekst', 'R1',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\nfremdrift: ben\n` +
    `noter: 42\nfelter:\n  egenvaegt: ikke_oplyst\n`],

  // R16 - anvendelse. Feltet er bygget for IKKE at kunne baere vores mening.
  // Hvert tilfaelde nedenfor er en maade at snige en redaktionel kategori ind paa.
  ['anvendelse med kategori, men uden citat', 'R16',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\nfremdrift: ben\n` +
    `anvendelse:\n  vaerdi: industri\n  kilde: https://example.com/a\n  hentet: 2026-08-19\n` +
    `felter:\n  egenvaegt: ikke_oplyst\n`],
  ['anvendelse med kategori og citat, men uden kilde', 'R6',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\nfremdrift: ben\n` +
    `anvendelse:\n  vaerdi: industri\n  citat: "Robot - Industry"\n  hentet: 2026-08-19\n` +
    `felter:\n  egenvaegt: ikke_oplyst\n`],
  ['anvendelse med kategori og citat, men uden hentedato', 'R7',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\nfremdrift: ben\n` +
    `anvendelse:\n  vaerdi: industri\n  citat: "Robot - Industry"\n  kilde: https://example.com/a\n` +
    `felter:\n  egenvaegt: ikke_oplyst\n`],
  ['anvendelse med en kategori uden for det tilladte saet', 'R16',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\nfremdrift: ben\n` +
    `anvendelse:\n  vaerdi: landbrug\n  citat: "Agriculture"\n  kilde: https://example.com/a\n` +
    `  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['anvendelse ikke_oplyst, men med et citat alligevel', 'R16',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\nfremdrift: ben\n` +
    `anvendelse:\n  vaerdi: ikke_oplyst\n  citat: "ser industriel ud"\n  kilde: https://example.com/a\n` +
    `  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['anvendelse med tomt citat', 'R16',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\nfremdrift: ben\n` +
    `anvendelse:\n  vaerdi: industri\n  citat: ""\n  kilde: https://example.com/a\n` +
    `  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['anvendelse med samme kategori to gange', 'R16',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\nfremdrift: ben\n` +
    `anvendelse:\n  vaerdi: [industri, industri]\n  citat: "Robot - Industry"\n` +
    `  kilde: https://example.com/a\n  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['ukendt noegle i anvendelsesposten', 'R16',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\nfremdrift: ben\n` +
    `anvendelse:\n  vaerdi: industri\n  citaat: "Robot - Industry"\n  citat: "Robot - Industry"\n` +
    `  kilde: https://example.com/a\n  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['anvendelse som bar tekst, der ikke er en tilstand', 'R16',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\nfremdrift: ben\n` +
    `anvendelse: industri\nfelter:\n  egenvaegt: ikke_oplyst\n`],

  // R17 - arv (L23). De tre tilfaelde her kan afgoeres i filen selv; resten
  // kraever moderen og staar i denne fils afsnit 2c.
  ['arvet_fra peger paa robotten selv', 'R17',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\nfremdrift: ben\n` +
    `anvendelse:\n  vaerdi: industri\n  citat: "Robot - Industry"\n  kilde: https://example.com/a\n` +
    `  hentet: 2026-08-19\n  arvet_fra: NAVN\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['arvet_fra staar sammen med ikke_oplyst - der er ingen kategori at arve', 'R17',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\nfremdrift: ben\n` +
    `anvendelse:\n  vaerdi: ikke_oplyst\n  kilde: https://example.com/a\n  hentet: 2026-08-19\n` +
    `  arvet_fra: en-anden\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['arvet_fra er ikke moderens slug som tekst', 'R17',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\nfremdrift: ben\n` +
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
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\nfremdrift: ben\n` +
    `producentby: Poznan\nvarianter: [Basic, Venture, "A2-W PRO"]\nnoter:\n  - "en note"\n  - "og en til"\n` +
    `felter:\n  nyttelast_gaaende:\n    vaerdi: 5\n    enhed: kg\n    kilde: https://example.com/a\n` +
    `    hentet: 2026-08-19\n    varianter:\n      Basic: 5\n      Venture: 4.5\n      A2-W PRO: "IP56-IP67"\n`],

  // R16 - de former, anvendelsesfeltet SKAL kunne baere. Uden dem beviser
  // R16-tilfaeldene kun, at validatoren siger nej til alt, hvad der hedder
  // "anvendelse".
  ['anvendelse med én kategori og ét citat',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\nfremdrift: ben\n` +
    `anvendelse:\n  vaerdi: industri\n  citat: "Robot - Industry"\n  kilde: https://example.com/a\n` +
    `  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['anvendelse med flere kategorier og flere citater',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\nfremdrift: ben\n` +
    `anvendelse:\n  vaerdi: [industri, inspektion]\n  citat:\n    - "Robot - Industry"\n` +
    `    - "for industrial patrol inspection"\n  kilde: https://example.com/a\n  hentet: 2026-08-19\n` +
    `  kildetype: primaer\n  note: "Producentens egen navigation."\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['anvendelse ikke_oplyst MED kilde - vi kiggede, producenten sagde intet',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\nfremdrift: ben\n` +
    `anvendelse:\n  vaerdi: ikke_oplyst\n  kilde: https://example.com/a\n  hentet: 2026-08-19\n` +
    `  note: "GENNEMLAEST, INTET FUNDET."\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['anvendelse som bar tilstand uden kort',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\nfremdrift: ben\n` +
    `anvendelse: ikke_oplyst\nfelter:\n  egenvaegt: ikke_oplyst\n`],
  ['robot helt uden anvendelse - feltet er valgfrit, ikke paakraevet',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\nfremdrift: ben\n` +
    `felter:\n  egenvaegt: ikke_oplyst\n`],

  // L22 - den syvende kategori. Uden det her tilfaelde ville "landbrug"-tilfaeldet
  // ovenfor lige saa godt kunne bevise, at listen slet ikke var udvidet.
  ['sikkerhed_overvaagning er en gyldig anvendelse (L22)',
    `slug: NAVN\nnavn: Proeve\nproducent: P\nproducentland: Kina\nstatus: i_produktion\nfremdrift: ben\n` +
    `anvendelse:\n  vaerdi: [inspektion, sikkerhed_overvaagning]\n` +
    `  citat: "ideal for security, inspection, and advanced applications."\n` +
    `  kilde: https://example.com/a\n  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`],

  // R18 — de former, billedfeltet SKAL kunne baere. Uden dem beviser de
  // fjorten tilfaelde ovenfor kun, at validatoren siger nej til alt, der hedder
  // "billede".
  ['silhuet med fil, ophav, kilde og hentedato',
    BILLEDHOVED + `billede:\n  fil: silhuetter/_proeve-kaede.svg\n  ophav: silhuet\n` +
    `  kilde: https://example.com/a\n  hentet: 2026-08-19\n` +
    `  alt:\n    da: "Maaltro silhuet"\n    en: "True-to-scale silhouette"\n` +
    `  note: "Tegnet efter L 1000 x H 700 mm."\n` +
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

export default async function koer(ctx) {
  const { tmp, ok, koerValidator } = ctx;

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
      `slug: ${slug}\nnavn: ${navn}\nproducent: P\nproducentland: Kina\nstatus: i_produktion\nfremdrift: ben\n`;
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
    const r = koerValidator([`--data=${path.join(ctx.rod, 'tests', 'eksempel-robotter')}`]);
    ok('de tre eksempelposter giver exit 0', r.kode === 0, r.ud.trim());
    ok('Spots imperial-afvigelse baeres som advarsel, ikke som fejl',
      /advarsel {2}boston-dynamics-spot . laengde . R9/.test(r.ud));
    const s = koerValidator([`--data=${path.join(ctx.rod, 'tests', 'eksempel-robotter')}`, '--streng']);
    ok('--streng goer den advarsel til en fejl igen (advarsel: er ingen lyddaemper)', s.kode === 1);

    // robotdata-skillen skriver "ikke oplyst" med mellemrum. Den maa ikke blokere en
    // hel dataindsamling, men den skal heller ikke passere ubemaerket.
    const mel = path.join(tmp, 'mellemrumsform.yaml');
    fs.writeFileSync(mel, GYLDIG_HOVED.replace('NAVN', 'mellemrumsform') + '  egenvaegt: ikke oplyst\n', 'utf8');
    const m = koerValidator([mel]);
    ok('"ikke oplyst" med mellemrum accepteres, men advares om',
      m.kode === 0 && /advarsel.*R3.*understreg/.test(m.ud), `exit ${m.kode}`);
  }

  return { validator: { ietFilAntal: alle.length, paaTVaersAntal: arvsagerFangede, fangede } };
}
