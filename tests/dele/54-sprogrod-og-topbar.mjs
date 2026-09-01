/**
 * tests/dele/54-sprogrod-og-topbar.mjs — spor/oversigt, 1. sep 2026.
 *
 * JPK, ordret: "HELE oversigt-siden skal vaek" og samme dag: "Jeg kan se at
 * siden 'Overview' stadig lever. Den skal vaek fra websiden." To punkter,
 * laast fast her:
 *
 *   PUNKT 1: forsiden (tools/skabelon/forside.mjs) er SLETTET, ikke flyttet.
 *   Kataloget (tools/skabelon/katalog.mjs, uroert af dette spor) overtager
 *   dens adresse - kataloget ER sprogroden nu (dist/<sprog>/index.html),
 *   og dist/<sprog>/robotter/index.html findes IKKE laengere (kun
 *   robotter/<slug>/-undersiderne bor der stadig). "Oversigt"/"Overview"
 *   staar ingen steder i nogen bygget menu.
 *
 *   PUNKT 2: enhedsomskifteren (metrisk/imperial) staar ÉT sted paa alle
 *   sider - i topbaren (.daek__enhed) - i stedet for at leve to forskellige
 *   steder (robotsiden, sammenligningssiden). Den fysiske <input
 *   id="enhedsskift"> er UROERT (staar stadig i robot.mjs/sammenligning.mjs,
 *   begge uden for dette spors filejerskab); kun den synlige etiket flyttede,
 *   forbundet via label/for paa tvaers af DOM'et. Mekanikken er stadig ren
 *   CSS (P0): den gamle `~`-soeskende-regel (16c i system.css) styrer
 *   stadig selve tal-skiftet uaendret, og en NY :has()-baseret regel (spor/
 *   oversigt-blokken i system.css) styrer topbar-etikettens EGEN
 *   tilstandsvisning og synlighed.
 *
 * REVERT-BEVIS (CLAUDE.md's krav): hver strukturel paastand proeves ogsaa
 * mod en bevidst FORKERT streng/tilstand, og proeven skal svare forkert
 * dér - ellers beviser den positive paastand ingenting.
 *
 * Bygger sit eget dist (den RIGTIGE data/robots/, ikke fixturen - punkt 1 og
 * 2 handler om hele sitets adressestruktur, som fixturen ikke daekker bredt
 * nok) i sin egen undermappe af ctx.tmp, jf. tests/LAESMIG.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const {
    rod, tmp, node, ok, skema,
  } = ctx;

  console.log('\n54. Sprogroden er kataloget, "Oversigt" er vaek, enhedskontakten er i topbaren (spor/oversigt)');

  const udMappe = path.join(tmp, 'dist-sprogrod-topbar');
  fs.rmSync(udMappe, { recursive: true, force: true });
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${udMappe}`],
    { cwd: rod, encoding: 'utf8' });
  ok('54.0: build.mjs giver exit 0 (frisk byg af det rigtige datasaet, egen tmp-mappe)',
    b.status === 0, (b.stdout || b.stderr || '').trim().split('\n').slice(-3).join(' / '));
  if (b.status !== 0) return;

  const alleHtml = [];
  (function gaa(m) {
    for (const f of fs.readdirSync(m, { withFileTypes: true })) {
      const p = path.join(m, f.name);
      if (f.isDirectory()) gaa(p); else if (f.name.endsWith('.html')) alleHtml.push(p);
    }
  }(udMappe));
  ok(`54.0b: der er sider at maale paa (${alleHtml.length} .html)`, alleHtml.length > 0);

  const laes = (rel) => {
    const sti = path.join(udMappe, rel);
    return fs.existsSync(sti) ? fs.readFileSync(sti, 'utf8') : null;
  };
  const daJson = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'da.json'), 'utf8'));
  const enJson = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'en.json'), 'utf8'));
  const sysCss = fs.readFileSync(path.join(rod, 'assets', 'system.css'), 'utf8');

  /* ======================================================================
     PUNKT 1a: sprogroden ER kataloget - h1/titel og filterformularen staar
     paa dist/<sprog>/index.html, ikke en seks-korts smagsproeve.
     ====================================================================== */
  for (const [sprog, T] of [['da', daJson], ['en', enJson]]) {
    const html = laes(`${sprog}/index.html`);
    ok(`54.1.${sprog}: dist/${sprog}/index.html findes`, html !== null);
    if (!html) continue;
    /* RETTET AF ORKESTRATOREN VED FLETTET, 1. sep 2026 — og aarsagen er
       vaerd at kende, fordi den kan ramme enhver markoer af denne slags.

       Her stod `html.includes('>' + T.katalog_titel + '<')`. Paastanden var
       RIGTIG, da den blev skrevet: katalogsidens h1 var ordret "Alle
       robotter", saa teksten stod som et helt elementindhold.

       spor/katalog2 doebte samme dag h1'en om til "Nyeste i kataloget"
       (JPK's punkt 1: overskriften skal navngive sin egen sektion, som viser
       de ni nyeste). katalog_titel staar derefter KUN i <title>, hvor den er
       efterfulgt af " · Firbenede robotter" — altsaa ikke `>tekst<`.
       Markoeren forsvandt, uden at siden aendrede karakter.

       Begge spor havde ret paa hver sin gren; kun flettet kunne se det.

       Rettelsen SVAEKKER ikke paastanden. Titlen tjekkes stadig, men dér hvor
       den faktisk bor, og de to STRUKTURELLE markoerer — filterformularen og
       resultatgitteret — er uaendrede. De er desuden de staerkeste af de tre:
       en h1 kan omdoebes af et designspor i morgen, mens `form.styr` og
       `#alle` ER katalogets mekanik. */
    const titel = (html.match(/<title>([^<]*)/) || [])[1] || '';
    const erKatalog = titel.includes(T.katalog_titel)
      && /<form class="styr" id="styr"/.test(html)
      && html.includes('id="alle"');
    ok(`54.1.${sprog}: dist/${sprog}/index.html ER katalogsiden (<title> baerer `
      + `"${T.katalog_titel}", filterformular og resultatgitter #alle findes)`, erKatalog,
    `titel var: ${titel}`);
  }
  // REVERT-BEVIS: en side UDEN katalogets markoerer bestaar ikke 54.1's tjek.
  /* Revert-beviset SKAL spejle den rettede kontrol ovenfor - ellers beviser
     det en logik, der ikke laengere koeres. Rettet sammen med 54.1. */
  const ikkeKatalog = '<html><head><title>En helt anden side</title></head>'
    + '<body><h1>En helt anden side</h1></body></html>';
  const ikkeTitel = (ikkeKatalog.match(/<title>([^<]*)/) || [])[1] || '';
  ok('54.1.revert: en side uden katalog-markoererne fejler PRAECIS samme tjek',
    !(ikkeTitel.includes(daJson.katalog_titel)
      && /<form class="styr" id="styr"/.test(ikkeKatalog)
      && ikkeKatalog.includes('id="alle"')));

  /* ======================================================================
     PUNKT 1b: dist/<sprog>/robotter/index.html findes IKKE - kun
     robotter/<slug>/-undersiderne bor der. Robotsiderne selv er UROERTE.
     ====================================================================== */
  for (const sprog of ['da', 'en']) {
    ok(`54.2.${sprog}: dist/${sprog}/robotter/index.html findes IKKE (kataloget flyttede)`,
      !fs.existsSync(path.join(udMappe, sprog, 'robotter', 'index.html')));
  }
  const robotMapper = fs.readdirSync(path.join(udMappe, 'da', 'robotter'), { withFileTypes: true })
    .filter((f) => f.isDirectory());
  ok(`54.2b: robotter/<slug>/-undersiderne staar der stadig (${robotMapper.length} mapper under da/robotter/)`,
    robotMapper.length > 0
      && robotMapper.every((m) => fs.existsSync(path.join(udMappe, 'da', 'robotter', m.name, 'index.html'))));

  /* ======================================================================
     PUNKT 1c: "Oversigt"/"Overview" findes IKKE i nogen bygget menu -
     maalt over HELE dist/, ikke kun topbaren, saa et glemt link et
     vilkaarligt sted ogsaa fanges.
     ====================================================================== */
  const medOversigt = [];
  for (const p of alleHtml) {
    const html = fs.readFileSync(p, 'utf8');
    if (/>Oversigt<|>Overview</.test(html)) medOversigt.push(path.relative(udMappe, p));
  }
  ok(`54.3: "Oversigt"/"Overview" findes 0 steder i de ${alleHtml.length} byggede sider`,
    medOversigt.length === 0,
    medOversigt.slice(0, 5).join(', '));
  // REVERT-BEVIS: den SAMME regex FANGER "Oversigt", naar den staar der.
  const medFalskOversigt = '<li><a href="../da/" aria-current="page">Oversigt</a></li>';
  ok('54.3.revert: samme regex fanger en synlig "Oversigt"-laenke, naar den findes',
    />Oversigt<|>Overview</.test(medFalskOversigt));

  /* ======================================================================
     PUNKT 1d: forside.mjs er VAEK fra disken, og intet i build.mjs
     importerer den laengere.
     ====================================================================== */
  const forsideSti = path.join(rod, 'tools', 'skabelon', 'forside.mjs');
  ok('54.4: tools/skabelon/forside.mjs findes IKKE paa disken', !fs.existsSync(forsideSti));
  // REVERT-BEVIS for eksistens-tjekket selv: en fil, vi VED findes (katalog.mjs),
  // skal give existsSync === true - ellers beviser 54.4 ingenting om selve
  // mekanismen (fs.existsSync), kun om denne ene sti.
  ok('54.4.revert: fs.existsSync finder rent faktisk en fil, der ER der (katalog.mjs)',
    fs.existsSync(path.join(rod, 'tools', 'skabelon', 'katalog.mjs')));

  const buildKilde = fs.readFileSync(path.join(rod, 'tools', 'build.mjs'), 'utf8');
  const importerForside = /from\s+['"]\.\/skabelon\/forside\.mjs['"]/.test(buildKilde);
  ok('54.5: build.mjs importerer IKKE laengere forside.mjs', !importerForside);
  // REVERT-BEVIS: samme regex FANGER en genindsat importlinje.
  const medImport = "import * as forsideSkabelon from './skabelon/forside.mjs';";
  ok('54.5.revert: samme regex fanger en genindsat forside.mjs-import',
    /from\s+['"]\.\/skabelon\/forside\.mjs['"]/.test(medImport));

  /* ======================================================================
     PUNKT 2a: enhedskontakten (den RIGTIGE <input type="checkbox">) staar
     PRAECIS ÉN gang pr. side, hverken 0 eller 2 - to kontakter paa samme
     side er to sandheder (briefets egen ordlyd).
     ====================================================================== */
  const enBoksAntal = (html) => (html.match(/class="kunskaerm enhedsskift__boks"/g) || []).length;
  // En robotside MED omregnelige felter (boston-dynamics-spot har hastighed
  // i baade m/s og mph, jf. andre deles fixtures) - laes den fra det
  // rigtige datasaet i stedet for at antage et slug, ingen har efterproevet.
  const enRobotMedEnhed = robotMapper.map((m) => m.name)
    .map((slug) => ({ slug, html: laes(`da/robotter/${slug}/index.html`) }))
    .find(({ html }) => html && enBoksAntal(html) === 1);
  ok('54.6-forudsaetning: mindst én robotside har praecis én enhedsskift__boks (forudsaetning for 54.6)',
    !!enRobotMedEnhed, `ingen af de ${robotMapper.length} robotsider havde praecis 1`);
  if (enRobotMedEnhed) {
    ok(`54.6: ${enRobotMedEnhed.slug}/ har PRAECIS ÉN enhedsskift__boks, ikke to`,
      enBoksAntal(enRobotMedEnhed.html) === 1, `fandt ${enBoksAntal(enRobotMedEnhed.html)}`);
  }
  const samHtml = laes('da/sammenligning/index.html');
  ok('54.7: sammenligningssiden har PRAECIS ÉN enhedsskift__boks, ikke to',
    samHtml !== null && enBoksAntal(samHtml) === 1,
    samHtml ? `fandt ${enBoksAntal(samHtml)}` : 'siden findes ikke');
  // REVERT-BEVIS: en syntetisk side med TO kontakter fejler samme tjek.
  const toBokse = '<input class="kunskaerm enhedsskift__boks"><input class="kunskaerm enhedsskift__boks">';
  ok('54.7.revert: samme taelling fanger to kontakter paa én side (revert af "praecis én")',
    enBoksAntal(toBokse) !== 1, `fandt ${enBoksAntal(toBokse)}`);

  /* ======================================================================
     PUNKT 2a-bis: ÉN SYNLIG kontakt, ikke bare én <input>. robot.mjs
     (uroert, uden for dette spors filejerskab) skriver STADIG sin egen
     enhedsskifter()-etiket TO gange i den raa HTML (16c: "den staar to
     steder") - uden en CSS-regel til at skjule dem ville en robotside vise
     TRE synlige kontakter (topbar + to in-page), praecis den tilstand
     PUNKT 2 skulle fjerne. system.css skal derfor baere en regel, der
     skjuler .enhedsskift inde i BAADE .robotside.typeskilt og
     .sammenligning-app (sidstnaevntes etiket er JS-indsat, assets/
     sammenligning.js' enhedslinjeHTML(), men rammes af samme selektor). */
  if (enRobotMedEnhed) {
    const raaEtiketter = (enRobotMedEnhed.html.match(/<label class="enhedsskift" for="enhedsskift">/g) || []).length;
    ok(`54.7b-forudsaetning: ${enRobotMedEnhed.slug}/'s RAA HTML baerer stadig 3 label-forekomster `
      + '(topbar + robot.mjs\' to egne, uroerte kald) - beviser at CSS, ikke markup, maa loese det',
      raaEtiketter === 3, `fandt ${raaEtiketter}`);
  }
  const skjulRegex = /\.robotside\.typeskilt \.enhedsskift,\s*\.sammenligning-app \.enhedsskift\{display:none\}/;
  ok('54.7c: system.css skjuler de GAMLE in-page etiketter (.robotside.typeskilt/.sammenligning-app), '
    + 'saa kun topbarens er synlig',
    skjulRegex.test(sysCss));
  // REVERT-BEVIS: samme regex fejler paa en CSS-kilde, hvor reglen mangler.
  ok('54.7c.revert: samme regex fejler paa en CSS-kilde uden skjule-reglen',
    !skjulRegex.test('.enhedsskift{color:red}'));

  /* ======================================================================
     PUNKT 2b: topbarens etiket (.daek__enhed > label.enhedsskift[for=
     enhedsskift]) staar UNDVIGELIGT i skallen paa HVER eneste side - den er
     bygget af side.mjs' skal(), som er FAELLES for alle sidetyper. Ingen ny
     <input> foelger med (grep-tallet i 54.6/54.7 er stadig 1, ikke 2).
     ====================================================================== */
  const udenEtiket = alleHtml.filter((p) => {
    const h = fs.readFileSync(p, 'utf8');
    return /<header class="daek">/.test(h) && !/<label class="enhedsskift" for="enhedsskift">/.test(h);
  });
  ok(`54.8: alle sider med topbar (${alleHtml.length - udenEtiket.length}) baerer topbarens `
    + 'enheds-etiket, uanset om kontakten er synlig',
    udenEtiket.length === 0, `mangler paa: ${udenEtiket.slice(0, 3).map((p) => path.relative(udMappe, p)).join(', ')}`);
  // REVERT-BEVIS: en side med topbar men uden etiketten FANGES af filteret.
  const medDaekUdenEtiket = '<header class="daek">...</header><main></main>';
  ok('54.8.revert: filteret fanger en topbar uden enheds-etiketten',
    /<header class="daek">/.test(medDaekUdenEtiket)
      && !/<label class="enhedsskift" for="enhedsskift">/.test(medDaekUdenEtiket));

  /* ======================================================================
     PUNKT 2c: strukturel P0-proeve. Mekanikken skal vaere ren CSS - ingen
     JavaScript maa vaere FORUDSAETNINGEN. Proeves her ved at laese CSS-kilden
     (ikke ved at koere en browser - se rapporten for den levende maaling):
       - Boksen er en AEGTE <input type="checkbox">, ikke en div/role=checkbox.
       - system.css baerer en :has()-baseret regel, der styrer .daek__enhed's
         synlighed OG en :has()-regel, der styrer dens tilstand (checket/
         fokus) - :has() er stadig CSS, ikke JS.
       - Den GAMLE `~`-baserede regel, der rent faktisk skifter TALLENE
         (.enhedsvis--imperial/--metrisk), staar UAENDRET - boksens egen
         soeskende-kontekst er ikke roert, kun dens etikets placering.
     ====================================================================== */
  ok('54.9: boksen er en AEGTE <input type="checkbox">, ingen robotside bruger role="checkbox"',
    !alleHtml.some((p) => /role="checkbox"/.test(fs.readFileSync(p, 'utf8'))));
  // To selektorer (robotside/sammenligning), komma-adskilt over to linjer,
  // deler samme deklaration - se assets/system.css's spor/oversigt-blok.
  // [\s\S]*? (ikke [^)]*): `.sammenligning-app:not([hidden])` baerer selv en
  // lukke-parentes FOER body:has()'s egen, saa et "ingen )"-tegnsaet ville
  // stoppe for tidligt og aldrig naa frem til .enhedsskift__boks.
  const visSynlighedRegex = /body:has\([\s\S]*?\.enhedsskift__boks\)\s*\.daek__enhed,\s*body:has\([\s\S]*?\.enhedsskift__boks\)\s*\.daek__enhed\{\s*display:flex;/;
  ok('54.10: system.css baerer en :has()-regel, der viser/skjuler .daek__enhed',
    visSynlighedRegex.test(sysCss));
  ok('54.11: system.css baerer en :has()-regel, der styrer .daek__enhed ved :checked',
    /body:has\(\.enhedsskift__boks:checked\)\s*\.daek__enhed \.enhedsskift\{/.test(sysCss));
  ok('54.12: system.css baerer en :has()-regel, der styrer .daek__enhed ved :focus-visible',
    /body:has\(\.enhedsskift__boks:focus-visible\)\s*\.daek__enhed \.enhedsskift\{/.test(sysCss));
  // REVERT-BEVIS: samme tre regex'er FEJLER paa en CSS-kilde uden reglerne.
  const cssUdenHas = '.daek__enhed{display:none}\n.enhedsskift{color:red}';
  ok('54.10-12.revert: samme tre tjek fejler alle paa en CSS-kilde uden :has()-reglerne',
    !visSynlighedRegex.test(cssUdenHas)
    && !/body:has\(\.enhedsskift__boks:checked\)\s*\.daek__enhed \.enhedsskift\{/.test(cssUdenHas)
    && !/body:has\(\.enhedsskift__boks:focus-visible\)\s*\.daek__enhed \.enhedsskift\{/.test(cssUdenHas));
  ok('54.13: den GAMLE `~`-regel, der skifter selve tallene, staar stadig uaendret '
    + '(.typeskilt .enhedsskift__boks:checked ~ * .enhedsvis--imperial)',
    /\.typeskilt \.enhedsskift__boks:checked ~ \* \.enhedsvis--imperial\{display:contents\}/.test(sysCss));
  ok('54.14: samme for sammenligningssidens variant (.sammenligning-app-scopet)',
    /\.sammenligning-app \.enhedsskift__boks:checked ~ \* \.enhedsvis--imperial\{display:contents\}/.test(sysCss));

  /* ======================================================================
     PUNKT 2d: katalogsiden (og andre sider uden en #enhedsskift-boks)
     viser IKKE en inaktiv/doed kontakt - :has()-reglen skal holde
     .daek__enhed skjult dér, jf. briefets eksplicitte spoergsmaal.
     ====================================================================== */
  for (const sprog of ['da', 'en']) {
    const html = laes(`${sprog}/index.html`);
    ok(`54.15.${sprog}: katalogsiden har INGEN enhedsskift__boks (P0-forudsaetning: `
      + 'ingen boks -> :has() skal holde kontakten skjult)',
      html !== null && enBoksAntal(html) === 0, html ? `fandt ${enBoksAntal(html)}` : 'siden findes ikke');
  }
}
