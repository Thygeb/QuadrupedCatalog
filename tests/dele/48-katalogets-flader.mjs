/**
 * tests/dele/48-katalogets-flader.mjs — spor/katalog2, 1. sep 2026.
 *
 * Laaser de seks punkter (plus JPK's fire rettelser 4R/5R/6R/7R) fast, som
 * ellers kun stod som skaermbilleder og en agentrapport:
 *
 *  1. H1'et navngiver sin egen sektion, ikke hele siden ("Alle robotter" er
 *     vaek, en ny noegle staar i stedet).
 *  2. Typeskilt-pladen baerer KUN udgaven - QUAD-taerskelen er vaek fra
 *     katalogsiden, men uroert paa sammenligningssiden.
 *  3. Soegefeltet holder de to ufravigelige gulve: min-height >= 44px,
 *     font-size >= 16px.
 *  4. Filtergrupperne er <details>/<summary>, collapsed som standard, og
 *     baerer et "mindst ét valgt"-maerke i to udgaver (CSS + JS).
 *  4R. Kolonnespaendene er en delmaengde af samme gitterrytme (s3/s6, ikke
 *     s4/s5) - laast som TAL, ikke som pixelmaaling, saa denne del kan
 *     koere uden en browser.
 *  5R. Mærkets faste position og summary'ens 44px-gulv staar i CSS'en.
 *  6R. Den bug, JPK's skaermbillede matchede (`[hidden]` slaaet af en
 *     forfatterregel), er rettet - laast fast, saa den ikke kommer igen.
 *  6. Den klaebende bundbjaelke findes IKKE i den byggede HTML (P0: JS-
 *     bygget, ikke skabelon-bygget), og hverken CSS eller JS baerer
 *     handelssprog (haard begraensning 1).
 *
 * Browsermaalingerne (faktisk pixelposition, klik-adfaerd) staar i sporets
 * rapport, ikke her - denne del laeser kildekode og byggetekst, som
 * tests/dele allerede goer alle andre steder. Bygger sit eget dist i sin
 * egen undermappe af ctx.tmp, jf. tests/LAESMIG.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

/** Udsnittet mellem to kommentarmarkoerer i en kildefil - samme greb som
 *  tests/dele/47's vaelgerBlok(): indexOf paa selve markoerteksten, ALDRIG
 *  split() paa noget der ogsaa kan staa andre steder (CLAUDE.md's femte
 *  skalfaelde). Giver hele resten af filen, hvis sluttet ikke findes. */
function udsnit(kilde, fraTekst, tilTekst) {
  const s = kilde.indexOf(fraTekst);
  if (s < 0) return null;
  const e = tilTekst ? kilde.indexOf(tilTekst, s) : -1;
  return e < 0 ? kilde.slice(s) : kilde.slice(s, e);
}

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n48. spor/katalog2: katalogets seks punkter + JPKs fire rettelser (4R/5R/6R/7R)');

  const ud = path.join(tmp, 'dist-katalog2');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${ud}`],
    { cwd: rod, encoding: 'utf8' });
  ok('48.0: byg giver exit 0', b.status === 0, (b.stderr || '').slice(0, 400));
  if (b.status !== 0) return;

  /* STIEN FLYTTEDE, ikke testen. spor/oversigt lagde katalogsiden paa
     sprogroden (L72, 1. sep 2026); dist/<sprog>/robotter/index.html findes
     ikke laengere. Rettet af orkestratoren ved flettet - denne fil blev
     flettet til main EFTER spor/oversigt grenede, saa sporet kunne ikke se
     den, da det rettede de oevrige 20 testfiler. Alle paastandene herunder
     er uaendrede; kun hvor de laeser fra er. */
  const laesHtml = (sprog) => fs.readFileSync(path.join(ud, sprog, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(rod, 'assets', 'system.css'), 'utf8');
  const js = fs.readFileSync(path.join(rod, 'assets', 'katalog.js'), 'utf8');
  const i18nDa = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'da.json'), 'utf8'));
  const i18nEn = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'en.json'), 'utf8'));

  /* ==================================================================
     PUNKT 1: h1 navngiver aabningens egen sektion
     ================================================================== */
  for (const [sprog, i18n] of [['da', i18nDa], ['en', i18nEn]]) {
    const html = laesHtml(sprog);
    const m = html.match(/<h1 class="aabning__titel"[^>]*>([^<]*)</);
    ok(`48.1.${sprog}: h1 findes`, !!m, 'aabningssektionens h1 mangler helt');
    if (!m) continue;
    ok(`48.1.${sprog}: h1 er den nye, sektionsspecifikke noegle ("${m[1]}")`,
      m[1] === i18n.katalog_seneste_titel, `forventede "${i18n.katalog_seneste_titel}"`);
    ok(`48.2.${sprog}: h1 er IKKE laengere "Alle robotter"/"All robots"`,
      m[1] !== 'Alle robotter' && m[1] !== 'All robots', `fandt "${m[1]}"`);
  }

  /* ==================================================================
     PUNKT 2: typeskilt-pladen baerer kun udgaven
     ================================================================== */
  for (const sprog of ['da', 'en']) {
    const html = laesHtml(sprog);
    ok(`48.3.${sprog}: ingen QUAD-taerskel paa katalogsiden`, !html.includes('QUAD-'),
      'Type-stemplet skulle vaere fjernet (JPK punkt 2)');
    const dl = udsnit(html, '<dl class="stempler">', '</dl>');
    ok(`48.4.${sprog}: stempelblokken findes`, !!dl);
    if (dl) {
      const dt = (dl.match(/<dt>/g) || []).length;
      ok(`48.5.${sprog}: pladen baerer praecis ét stempel (fandt ${dt})`, dt === 1);
      ok(`48.6.${sprog}: det ene stempel er en dato (ÅÅÅÅ-MM-DD)`,
        /\d{4}-\d{2}-\d{2}/.test(dl), dl);
    }
  }
  // VENDT af orkestratoren ved flet, 1. sep 2026.
  //
  // Her stod: "sammenligningssidens plade er UROERT - QUAD- skal stadig staa
  // der", og paastanden var RIGTIG paa spor/katalog2's egen gren. Den maalte,
  // at punkt 2 ikke bredte sig ud over katalogsiden, og det gjorde det ikke.
  //
  // Imens fjernede spor/tal den samme plade fra sammenligningssiden - af en
  // ANDEN grund: dens `stempel_felter` sendte konstanten NAEVNER (antallet af
  // sammenlignelige FELTER, 30) ind under noejagtig samme etiket, som
  // katalogsiden brugte til antallet af oplyste FELTVAERDIER (842). Samme ord,
  // to stoerrelser. Begge spor havde ret paa hver sin gren; kun flettet kunne
  // se, at de to sandheder var uforenelige.
  //
  // Assertionen er derfor VENDT, ikke slettet: den beviser nu den regel, der
  // faktisk gaelder efter begge spor - pladen betyder det samme paa BEGGE
  // sider, nemlig én dato. Det er stadig en spaerre mod, at punkt 2 breder sig
  // forkert: sker det, staar der mere end ét stempel her.
  const samlHtml = fs.readFileSync(path.join(ud, 'da', 'sammenligning', 'index.html'), 'utf8');
  const samlDl = udsnit(samlHtml, '<dl class="stempler">', '</dl>');
  ok('48.7: sammenligningssidens plade findes', !!samlDl);
  if (samlDl) {
    const samlDt = (samlDl.match(/<dt>/g) || []).length;
    ok(`48.7b: sammenligningens plade baerer praecis ét stempel (fandt ${samlDt})`,
      samlDt === 1, 'samme regel som katalogsiden - én dato, ingen taelling');
    ok('48.7c: det ene stempel er en dato, ikke en taelling',
      /\d{4}-\d{2}-\d{2}/.test(samlDl) && !samlDl.includes('QUAD-'), samlDl);
  }

  /* ==================================================================
     PUNKT 3: soegefeltets to ufravigelige gulve
     ================================================================== */
  const sogBlok = udsnit(css, '.sog input{', '}');
  ok('48.8: .sog input-reglen findes', !!sogBlok);
  if (sogBlok) {
    const minH = (/min-height:\s*(\d+(?:\.\d+)?)px/.exec(sogBlok) || [])[1];
    const fs2 = (/font-size:\s*(\d+(?:\.\d+)?)px/.exec(sogBlok) || [])[1];
    ok(`48.9: min-height >= 44px (fandt ${minH})`, !!minH && Number(minH) >= 44);
    ok(`48.10: font-size >= 16px, ellers zoomer iOS Safari (fandt ${fs2})`,
      !!fs2 && Number(fs2) >= 16);
  }

  /* ==================================================================
     PUNKT 4 + 4R: <details>/<summary>, collapsed, gitterrytmen
     ================================================================== */
  for (const sprog of ['da', 'en']) {
    const html = laesHtml(sprog);
    const detaljer = (html.match(/<details/g) || []).length;
    const grupper = (html.match(/<details[^>]*data-facetgruppe="/g) || []).length;
    const aabne = (html.match(/<details[^>]* open/g) || []).length;
    const fieldsetIFacetnet = udsnit(html, '<div class="facetter__net">', '<section class="resultat"');
    ok(`48.11.${sprog}: ni filtergrupper er <details> (fandt ${detaljer} <details> i alt,`
      + ` heraf ${grupper} med data-facetgruppe - certificering har bevidst ingen)`,
      detaljer === 10 && grupper === 8, `${detaljer}/${grupper}, forventede 10/8`);
    ok(`48.12.${sprog}: kun DEN ydre panel-toggle staar aaben (fandt ${aabne} med "open")`,
      aabne === 1);
    ok(`48.13.${sprog}: facetter__net baerer ingen <fieldset> laengere`,
      fieldsetIFacetnet !== null && !fieldsetIFacetnet.includes('<fieldset'),
      'fieldset->details-byttet er ikke fuldfoert alle steder');

    // 4R: gitterrytmen. Row1 (anv, vaegt, eg) skal vaere 3+3+6, ikke 3+4+5 -
    // laast som ANTAL forekomster af hver span-klasse, saa en fremtidig
    // regression (nogen aendrer et tal tilbage) bliver ROED uden en browser.
    const s3 = (html.match(/facet--s3(?!\d)/g) || []).length;
    const s4 = (html.match(/facet--s4(?!\d)/g) || []).length;
    const s5 = (html.match(/facet--s5(?!\d)/g) || []).length;
    const s6 = (html.match(/facet--s6(?!\d)/g) || []).length;
    ok(`48.14.${sprog}: 4R - ingen facet bruger s4 eller s5 laengere (fandt s4=${s4}, s5=${s5})`,
      s4 === 0 && s5 === 0,
      'vaegt (4) og egenskaber (5) skulle vaere flyttet til s3/s6 for at dele gitterrytme med de oevrige raekker');
    ok(`48.15.${sprog}: 4R - seks facetter er s3, tre er s6 (fandt s3=${s3}, s6=${s6})`,
      s3 === 6 && s6 === 3,
      'anv/vaegt/ip/status/land/certificering = 6 x s3; egenskaber/nyttelast/pris = 3 x s6');
  }

  /* Maerkerne (CSS-udgave + JS-udgave), generisk paa tvaers af sprog. */
  ok('48.16: CSS-udgaven af "mindst ét valgt"-maerket findes ([data-facet-aktiv])',
    css.includes('[data-facet-aktiv]'));
  ok('48.17: JS-udgaven ([data-facet-antal]) fyldes af assets/katalog.js',
    js.includes('facetgruppeAntal') && js.includes('data-facet-antal'));

  /* 5R: maerkets faste position + summary'ens 44px-gulv. */
  ok('48.18: 5R - begge maerkeudgaver flugter mod cellens hoejre kant (margin-left:auto)',
    /\.facet__aktiv\{[^}]*margin-left:auto/.test(css)
    && /\.facet__aktiv-tal\{[^}]*margin-left:auto/.test(css));
  ok('48.19: 5R - haarstregen efter summary er slaaet fra, saa auto-margenen faar sin plads',
    /summary\.facet__navn::after\{flex:none\}/.test(css));
  ok('48.20: 5R/7R - <summary> har sit eget 44px-gulv (var IKKE tilfaeldet foer rettelsen)',
    /summary\.facet__navn\{[^}]*min-height:44px/.test(css));
  ok('48.21: 5R - underteksten forkortes i stedet for at braekke om (ellipsis, ikke wrap)',
    /summary\.facet__navn\s*>\s*\.facet__tal\{[^}]*text-overflow:ellipsis/.test(css));

  /* 6R: den [hidden]-bug, JPKs skaermbillede matchede, er rettet og laast. */
  ok('48.22: 6R - .facet__aktiv-tal respekterer [hidden] (den fundne cascade-bug)',
    /\.facet__aktiv-tal\[hidden\]\{display:none\}/.test(css),
    'uden denne linje slaar display:inline-flex ALTID [hidden] - en tom taeller ville staa synlig paa alle grupper');

  // 7R-hullet: .facet--s6 fik aldrig en mobiludgave i generator.css - laast
  // her, saa Egenskaber (nu s6) ikke falder tilbage i splittet paa 390px.
  ok('48.23: 7R - .facet--s6 gaar fuld bredde under 720px (generator.css daekker kun s3/s4/s5)',
    /@media \(max-width:720px\)\{\s*\.facetter__net \.facet--s6\{grid-column:1 \/ -1\}/.test(css));

  /* ==================================================================
     PUNKT 6: den klaebende bundbjaelke - P0 og haard begraensning 1
     ================================================================== */
  for (const sprog of ['da', 'en']) {
    const html = laesHtml(sprog);
    ok(`48.24.${sprog}: bjaelken findes IKKE i den byggede HTML (JS-bygget, ikke skabelon-bygget)`,
      !html.includes('class="klaebebar"'),
      'P0: uden JavaScript maa bjaelken vaere fravaerende, ikke bare hidden');
  }
  ok('48.25: assets/katalog.js bygger bjaelken naar samlknapper findes',
    js.includes('klaebebar') && /document\.createElement\(['"]div['"]\)/.test(js));
  ok('48.26: bjaelken laenker til sammenligningssiden (samme href, skabelonen allerede skrev)',
    /getAttribute\(['"]href['"]\)/.test(js) && js.includes('saml-taeller__gaa'));
  ok('48.27: bjaelken viser NAVNE (join med mellemrum-punktum), ikke et antal',
    /navne\.join\(['"] · ['"]\)/.test(js));

  // Haard begraensning 1, maalt paa de STRENGE en laeser faktisk moeder -
  // samme moenster som tests/dele/41-samlknap.mjs's egen 41.3, udvidet med
  // den nye noegle. Scopet til klaebebar-blokkene specifikt (indexOf paa
  // selve markoerteksten), IKKE hele filerne: system.css baerer stadig en
  // AELDRE, legitim historisk kommentar om hvorfor en bjaelke blev
  // FRAVALGT i gaar ("indkoebskurvens form") - den skal blive staaende som
  // dokumentation og ville give et falsk rødt resultat i en filbred soegning.
  //
  // "order" ER MED I 41.3'S EGEN LISTE, men den scanner kun RENDEREDE
  // i18n-VAERDIER - aldrig kildekode. Her scannes CSS og JS, som legitimt
  // baerer ordet: `border:0` (indeholder "order" som delstreng) og CSS'
  // egen `order`-egenskab (flex-raekkefoelge, brugt andetsteds i filens
  // uroerte filhoved om kortsortering). Maalt: begge udloeste falske
  // positiver foerste gang denne del koerte. "order" bruges derfor KUN i
  // i18n-tjekket (48.32 nedenfor), som 41.3 allerede daekker det samme sted.
  const FORBUDTE = [
    'kurv', 'indkoeb', 'indkøb', 'bestil', 'tilbud', 'forespoerg', 'forespørg',
    'cart', 'basket', 'checkout', 'buy', 'quote', 'enquir', 'inquir', 'badge',
  ];
  const FORBUDTE_I18N = [...FORBUDTE, 'order'];
  const klaebebarCss = udsnit(css, '/* PUNKT 6 (JPK 1. sep 2026, L67): den klaebende bjaelke.',
    '/* --- sammenligningens vaelger');
  ok('48.28: klaebebar-CSS-blokken blev fundet til ordforraadstjekket', !!klaebebarCss);
  if (klaebebarCss) {
    const traf = FORBUDTE.filter((f) => klaebebarCss.toLowerCase().includes(f));
    ok(`48.29: klaebebar-CSS-blokken baerer intet handels- eller kurv-ord`,
      traf.length === 0, `fandt: ${traf.join(', ')}`);
  }
  const trafJs = FORBUDTE.filter((f) => js.toLowerCase().includes(f));
  ok('48.30: assets/katalog.js baerer intet handels- eller kurv-ord',
    trafJs.length === 0, `fandt: ${trafJs.join(', ')}`);

  // Den nye i18n-noegle selv, samme moenster som 41.3.
  for (const [sprog, i18n] of [['da', i18nDa], ['en', i18nEn]]) {
    ok(`48.31.${sprog}: klaebebar_etiket findes og er en ikke-tom streng`,
      typeof i18n.klaebebar_etiket === 'string' && i18n.klaebebar_etiket.length > 0);
    const v = String(i18n.klaebebar_etiket || '').toLowerCase();
    const traf = FORBUDTE_I18N.filter((f) => v.includes(f));
    ok(`48.32.${sprog}: klaebebar_etiket baerer intet handels- eller kurv-ord ("${i18n.klaebebar_etiket}")`,
      traf.length === 0, `fandt: ${traf.join(', ')}`);
  }
}
