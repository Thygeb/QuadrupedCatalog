/**
 * tests/dele/05-visning-nye-former.mjs — Det, der ikke maa gaa tabt paa vejen
 * fra YAML til side, for de to skemaudvidelser og aliasserne.
 *
 * De tre eksempelposter (brugt i dele/04-byg-struktur.mjs) roerer ingen af de
 * nye former, saa uden en post, der goer det, ville hele skemaudvidelsen vaere
 * ubevist paa visningssiden. Bygger derfor sin egen lille fixture.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n5. Visningen af de nye former');

  const dataMappe = path.join(tmp, 'form-data');
  fs.mkdirSync(dataMappe, { recursive: true });
  fs.writeFileSync(path.join(dataMappe, 'proeve-alle-former.yaml'), [
    'slug: proeve-alle-former',
    'navn: Proeve Alle Former',
    'producent: Proeveproducent',
    'producentland: Kina',
    'producentby: Shenzhen',
    'status: i_produktion',
    'fremdrift: ben',
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
  // Derfor laeses de to felters egne vaerdiceller, ikke bare siden som helhed.
  //
  // OPDATERET (spor/robot, 31. aug 2026): skemaet er ikke laengere en <dl> bag
  // <details>, men comp'ens AABNE tabel - feltnavnet staar i <th scope="row">
  // og vaerdien i <td class="skema-v">. REGLEN er uaendret og proeves uaendret
  // nedenfor: "nej" skal vises som nej og maa ikke kollapse til ja. Kun
  // udtraekket foelger med markup'en. <th> kan baere D18's m-etiket-klasse,
  // derfor [^>]* foer ">".
  const feltBlok = (etiket) => (side.match(
    new RegExp(`<th scope="row" role="rowheader"[^>]*>${etiket.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}</th>`
      + `<td class="skema-v"[^>]*>([\\s\\S]*?)</td>`)) || [])[1] ?? '';
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
  // Se dele/04-byg-struktur.mjs - kilde+hentedato staar i en delt kildeliste, ikke
  // gentaget som "class=herkomst" ved hvert tal. class="kildemaerke" er referencen.
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
    ctx.operatorRegex('ca\\.', '60–120', 'min').test(side));
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
  // VENDT 31. aug 2026 (spor/katalog, L56 punkt 7): markeringen sidder i den
  // KOMPAKTE STRIBE, og katalogkortet har ikke laengere en stribe - det viser
  // billede + producent + produktnavn og intet andet. Striben, og dermed
  // variantmarkeringen, staar uaendret paa forsidens kort. Vagten laeser
  // derfor forsiden; ellers ville den maale en flade, hvor figuren med vilje
  // ikke findes.
  const forsideVar = fs.readFileSync(path.join(ud, 'da', 'index.html'), 'utf8');
  ok('den kompakte stribe markerer, at feltet har varianter',
    /maerke--varianter/.test(forsideVar));
  ok('katalogkortet baerer ingen variantmarkering (det har ingen stribe, L56 punkt 7)',
    !/maerke--varianter/.test(katalog));
  ok('advarslen staar stadig ved siden af vaerdien',
    side.indexOf('class="advarsel advarsel--') > side.indexOf('v-ikke'));
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
  // lokaliseret tekst. Teksten er UDLEDT af data/i18n/da.json (samme kilde,
  // koden selv laeser), ikke skrevet i haanden - aendrer ordlyden sig, foelger
  // proeven med.
  //
  // OPDATERET (spor/robot, 31. aug 2026): TYPESKILT-formen samler status,
  // vaegtklasse og anvendelse i ÉN maerkelinje under robotnavnet, saa etiketten
  // staar i <li class="maerke maerke--vaegt …> i stedet for i sin egen
  // <p class="t-mikro vaegtklasse">. REGLEN er uaendret - vaegtklassen skal
  // staa paa selve siden og ikke kun i indekset - og skaerpet ét sted: den
  // uoplyste klasse skal ogsaa BAERE den tomme tilstands form (maerke--tom),
  // saa haard begraensning 5 ikke kan tabes ved en senere omskrivning.
  const da = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'da.json'), 'utf8'));
  const vaegtChip = (side.match(/<li class="maerke maerke--vaegt[\s\S]*?<\/li>/) || [''])[0];
  ok('vaegtklassen staar ogsaa paa siden, saa den ikke kun findes i indekset',
    Boolean(da.vaegtklasse_ikke_oplyst)
    && vaegtChip.includes(da.vaegtklasse_ikke_oplyst)
    && vaegtChip.includes('maerke--tom'),
    da.vaegtklasse_ikke_oplyst ? 'fandt ikke etiketten i markup' : 'vaegtklasse_ikke_oplyst mangler i da.json');
}
