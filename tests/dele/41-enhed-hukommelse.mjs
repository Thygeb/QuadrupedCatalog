/**
 * tests/dele/41-enhed-hukommelse.mjs — spor/enhed, 1. sep 2026.
 *
 * L60 udvidet (JPK): enhedsvalget skal vaere gennemgaaende paa hele websiden,
 * og det skal HUSKES paa tvaers af sider. Omregningens egne regler er allerede
 * daekket af dele/36 (producentens tal vinder, de uomregnelige enheder,
 * afrundingen). Denne fil proever de tre ting, DEN aendring foejer til, og som
 * hver isaer kan gaa galt tavst:
 *
 *   1. HVOR BESLUTNINGEN BOR. Omregningen laa i robot.mjs og er flyttet til
 *      side.mjs' tal(), saa enhver flade, der kalder H.tal(), arver
 *      enhedsvalget uden at kende til det. Bliver den en dag kopieret tilbage
 *      ind i en skabelon, virker alt stadig - lige indtil de to kopier
 *      divergerer. Derfor proeves BAADE at side.mjs traeffer beslutningen, OG
 *      at robot.mjs ikke har sin egen omregningstabel igen.
 *
 *   2. AT FLAGET IKKE LAEKKER. build.mjs bygger ÉN hjaelper pr. sprog og
 *      genbruger den til alle sider (build.mjs:261). Glemmes gendan(), faar
 *      katalog- og producentsiderne skjulte imperiale figurer uden en kontakt
 *      til at vise dem - usynligt paa skaermen, og derfor kun maalbart som et
 *      antal i den byggede HTML.
 *
 *   3. P0. assets/katalog.js:1-17: "Uden JavaScript er siden SAND, men
 *      statisk. Med JavaScript bliver den PRAECIS." Selve skiftet SKAL blive i
 *      CSS. Den dag enhed.js begynder at saette display eller flytte klasser,
 *      holder siden op med at virke uden JavaScript - og det ville ingen
 *      eksisterende test opdage, fordi den byggede HTML ser ens ud.
 *
 * MAALT MED BROWSER 1. sep 2026 (kan ikke koeres herfra, staar som facit):
 * paa en kopi af Spot-siden UDEN script-tagget - document.scripts.length === 0
 * - skiftede alle 20 synlige figurer fra metrisk til imperial ved ét klik paa
 * etiketten (33,8 kg -> 74,5 lb, 5,76 km/h -> 3,58 mph, 110 cm -> 43,3 in).
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n41. spor/enhed: enhedsvalget bor ét sted og huskes paa tvaers af sider');

  const dist = path.join(tmp, 'dist-enhed');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${dist}`],
    { cwd: rod, encoding: 'utf8' });
  ok('41.0: byg af hele kataloget giver exit 0', b.status === 0, (b.stderr || '').trim());

  const laes = (...d) => fs.readFileSync(path.join(...d), 'utf8');
  const sideKilde = laes(rod, 'tools', 'skabelon', 'side.mjs');
  const robotKilde = laes(rod, 'tools', 'skabelon', 'robot.mjs');

  /* --- 1. Beslutningen bor i side.mjs' tal(), ikke i en skabelon -------- */

  ok('41.1: side.mjs baerer omregningen (imperialTal/imperialPost defineres her)',
    /export function imperialTal\(/.test(sideKilde)
    && /export function imperialPost\(/.test(sideKilde));
  ok('41.2: … og omregningstabellen selv, saa der kun er ét regnestykke',
    /export const OMREGNING = \{/.test(sideKilde));

  // Modbeviset for 41.1-41.2: robot.mjs maa VIDERESENDE navnene, men aldrig
  // definere dem igen. En genindfoert kopi ville bestaa alle andre tests.
  ok('41.3: robot.mjs videresender navnene i stedet for at definere dem igen',
    /export \{ OMREGNING, imperialTal, imperialPost \} from '\.\/side\.mjs';/.test(robotKilde)
    && !/export const OMREGNING = \{/.test(robotKilde)
    && !/export function imperialTal\(/.test(robotKilde));

  // Beslutningen skal ligge i tal() - ikke i en hjaelper ved siden af, som en
  // ny sidetype saa skulle huske at kalde.
  const talKrop = sideKilde.slice(sideKilde.indexOf('  function tal(post, {'),
    sideKilde.indexOf('  /* --- 2. tilstand'));
  ok('41.4: tal() er dét sted, enheden afgoeres', talKrop.includes('imperialPost(post, sprogkode)')
    && talKrop.includes('enhedsvis--imperial'), `tal()-kroppen er ${talKrop.length} tegn`);
  // Uden vaernet ville den imperiale tvilling selv soege en tvilling.
  ok('41.5: … og den imperiale tvilling soeger ikke selv en tvilling',
    /if \(__imperial\) return ud;/.test(talKrop));

  /* --- 2. Flaget laekker ikke fra én side til den naeste ----------------- */

  const tael = (s, m) => (s.match(m) || []).length;
  const ENHEDSVIS = /class="enhedsvis enhedsvis--imperial"/g;

  for (const sprog of ['da', 'en']) {
    // Robotsiderne SKAL have tvillinger - ellers maaler 41.7 nul af den
    // forkerte grund, og hele afsnittet ville vaere groent paa en side, hvor
    // omskifteren aldrig blev tegnet.
    const robotMappe = path.join(dist, sprog, 'robotter');
    const sider = fs.readdirSync(robotMappe, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => path.join(robotMappe, d.name, 'index.html'))
      .filter((p) => fs.existsSync(p));
    const medTvilling = sider.filter((p) => tael(laes(p), ENHEDSVIS) > 0).length;
    ok(`41.6.${sprog}: robotsiderne baerer imperiale tvillinger (${medTvilling} af ${sider.length})`,
      medTvilling > 0 && medTvilling <= sider.length, `${medTvilling}/${sider.length}`);

    // … og PRAECIS de sider, der ogsaa tegner kontakten. En tvilling uden
    // kontakt er skjult tekst, ingen kan naa; en kontakt uden tvillinger er
    // et loefte, siden ikke kan holde.
    const uenige = sider.filter((p) => {
      const h = laes(p);
      return (tael(h, ENHEDSVIS) > 0) !== /class="kunskaerm enhedsskift__boks"/.test(h);
    });
    ok(`41.7.${sprog}: hver side med tvillinger har ogsaa en kontakt, og omvendt`,
      uenige.length === 0, `uenige sider: ${uenige.length}`);

    // Laekagen: kataloget og producentsiderne har ingen forudberegnede
    // enhedsvis--spans og maa derfor ikke baere ét eneste imperialt span.
    // Sammenligningssiden staar med i listen, fordi dens matrix tegnes af
    // JavaScript (assets/sammenligning.js) - den byggede statiske HTML har
    // ligesom kataloget nul spans, selvom siden BAERER en kontakt (§ 41.7
    // maaler netop den kontakt, denne liste ikke handler om enheden dér).
    //
    // spor/oversigt (1. sep 2026): kataloget flyttede fra
    // dist/<sprog>/robotter/index.html til dist/<sprog>/index.html - den
    // gamle sti findes ikke laengere og er fjernet herfra i stedet for at
    // staa som en post, .filter(existsSync) alligevel altid dropper.
    const udenKontakt = [
      path.join(dist, sprog, 'index.html'),
      path.join(dist, sprog, 'sammenligning', 'index.html'),
    ].filter((p) => fs.existsSync(p));
    const prodMappe = path.join(dist, sprog, 'producenter');
    if (fs.existsSync(prodMappe)) {
      for (const d of fs.readdirSync(prodMappe, { withFileTypes: true })) {
        if (!d.isDirectory()) continue;
        const p = path.join(prodMappe, d.name, 'index.html');
        if (fs.existsSync(p)) udenKontakt.push(p);
      }
    }
    const laekket = udenKontakt.filter((p) => tael(laes(p), ENHEDSVIS) > 0);
    ok(`41.8.${sprog}: flaget laekker ikke til de ${udenKontakt.length} sider uden kontakt`,
      laekket.length === 0,
      `laekket til: ${laekket.map((p) => path.relative(dist, p)).slice(0, 5).join(', ')}`);
  }

  /* --- 3. P0: JavaScript husker, den skifter ikke ----------------------- */

  const js = path.join(rod, 'assets', 'enhed.js');
  ok('41.9: assets/enhed.js findes', fs.existsSync(js));
  const jsKilde = fs.existsSync(js) ? laes(js) : '';

  // Det, filen SKAL goere.
  ok('41.10: den laeser og skriver valget i localStorage',
    /localStorage\.getItem\(/.test(jsKilde) && /localStorage\.setItem\(/.test(jsKilde));
  ok('41.11: … og saetter kontaktens tilstand, ikke tallenes',
    /\.checked = /.test(jsKilde));

  // Det, filen ALDRIG maa goere. Bliver skiftet flyttet fra CSS til JS, holder
  // siden op med at virke uden JavaScript - og den byggede HTML ser ens ud,
  // saa ingen anden test ville opdage det.
  //
  // KOMMENTARERNE SKAERES FRA FOERST, og det er ikke en opblødning af kravet:
  // paastanden handler om, hvad filen GOER. Foerste udgave af proeven var roed,
  // fordi filens egen forklaring af CSS-mekanikken naevner ordet "enhedsvis" -
  // altsaa fordi den dokumenterer, at skiftet IKKE ligger i JavaScript. En
  // proeve, der straffer den forklaring, maaler prosa og ikke adfaerd.
  // (Fjernelsen er tekstuel og ville ogsaa ramme "//" inde i en streng; filen
  // har ingen, og en URL i den ville i sig selv vaere et brud paa 41.12.)
  const udenKommentarer = (s) => s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/.*$/gm, '$1');
  const FORBUDT = [
    [/\.style\b/, 'style-manipulation'],
    [/classList/, 'classList'],
    [/enhedsvis/, 'enhedsvis-klassen'],
    [/innerHTML/, 'innerHTML'],
    [/fetch\(|XMLHttpRequest/, 'netvaerkskald'],
  ];
  const jsKode = udenKommentarer(jsKilde);
  const forbudt = FORBUDT.filter(([m]) => m.test(jsKode)).map(([, n]) => n);
  ok('41.12: P0 — enhed.js roerer hverken display, klasser eller netvaerk',
    forbudt.length === 0, `fandt: ${forbudt.join(', ')}`);

  // Modbeviset for 41.12: proeven skal kunne fejle. En kontrolfil, der ligner
  // enhed.js men FLYTTER skiftet ind i JavaScript, skal fange alle tre
  // moenstre - ogsaa efter at kommentarerne er skaaret fra. Uden det her
  // ville 41.12 vaere groen, hvis udenKommentarer() aad hele filen.
  const kontrol = udenKommentarer(`/* enhedsvis staar kun i denne kommentar */\n`
    + `// og her\n`
    + `el.classList.add('enhedsvis'); el.style.display = 'none';\n`);
  const fanget = FORBUDT.filter(([m]) => m.test(kontrol)).map(([, n]) => n);
  ok('41.13: … og proeven kan fejle (kontrolfil med skiftet i JS fanges)',
    fanget.length === 3 && kontrol.includes('classList'),
    `fangede: ${fanget.join(', ')}`);

  /* --- 4. Filen naar faktisk ud paa siderne ----------------------------- */

  ok('41.14: enhed.js kopieres til dist', fs.existsSync(path.join(dist, 'enhed.js')));

  for (const sprog of ['da', 'en']) {
    const robotMappe = path.join(dist, sprog, 'robotter');
    const sider = fs.readdirSync(robotMappe, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => path.join(robotMappe, d.name, 'index.html'))
      .filter((p) => fs.existsSync(p));
    // Scriptet skal staa paa PRAECIS de sider, der har en kontakt at huske.
    const uenige = sider.filter((p) => {
      const h = laes(p);
      return /enhed\.js"><\/script>/.test(h) !== /class="kunskaerm enhedsskift__boks"/.test(h);
    });
    ok(`41.15.${sprog}: scriptet staar paa praecis de sider, der har en kontakt`,
      uenige.length === 0, `uenige: ${uenige.length}`);

    // Og det skal staa FOER indholdet. Med defer eller nederst i <body> naar
    // browseren at tegne de metriske tal, og en laeser med imperialt valg ser
    // siden blinke.
    const foerst = sider.filter((p) => {
      const h = laes(p);
      if (!/enhed\.js"><\/script>/.test(h)) return true;
      return h.indexOf('enhed.js"></script>') < h.indexOf('<header class="robot-top">')
        && !/enhed\.js" defer|defer src="[^"]*enhed\.js/.test(h);
    });
    ok(`41.16.${sprog}: scriptet staar foer sidens indhold og uden defer (intet blink)`,
      foerst.length === sider.length, `${sider.length - foerst.length} sider har det for sent`);
  }
}
