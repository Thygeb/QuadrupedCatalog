/**
 * tests/dele/81-bundbar.mjs — spor/bundbar, 4. sep 2026.
 *
 * Klaebebaren i bunden af katalogsiden gik fra BAAND til GENSTAND
 * (fund/PLAN-klaebebar.md's Retning B, "SKINNEN", valgt af JPK) og fik en
 * Fjern-knap pr. valgt robot. Denne del laaser de beslutninger, der ellers
 * kun staar i en CSS-kommentar - og som en velmenende oprydning derfor kan
 * fjerne uden at noget siger fra.
 *
 * HVORFOR DEN LAESER KILDE OG BYGGET HTML OG IKKE MAALER I EN BROWSER:
 * bjaelken bygges KLIENTSIDE af assets/katalog.js og staar aldrig i dist/.
 * Et grep i dist/ kan ikke se den. Browsermaalingerne - hoejde 33,2 px ved
 * ti bredder, bredde 865,8 px, fokus aldrig paa <body>, 0 daekkede
 * tekstnoder, fokusstop 10 af 245 - staar i fund/FUND-bundbar.md med
 * kommandoen ved siden af. Det, der kan laases her, er MEKANISMERNE bag
 * dem.
 *
 * FEM AF JPK'S BESLUTNINGER LIGGER I DENNE FIL, og de er grunden til, at
 * den ikke bare er en gentagelse af CSS'en:
 *   J1  bjaelken er centreret          -> 81.12
 *   J2  INGEN bevaegelse               -> 81.7   (forbud, ikke udeladelse)
 *   J3  vandret rullespor paa mobil    -> 81.13
 *   J4  Fjern baerer ORDET             -> 81.1
 *   J5  "Ryd udvalget" bliver          -> 81.14
 *
 * De tre eksisterende dele, der ogsaa roerer bjaelken, er UROERTE af dette
 * spor og daekker noget andet: 48.28/48.29 (blokken baerer intet
 * handels- eller kurv-ord), 48.31/48.32 (i18n-noeglen klaebebar_etiket),
 * 61 (.knap--tekst-moerk.knap--frem staar paa --fod) og 65 (chippen
 * .saml-taeller er baerer af bjaelkens sprog og maa ikke slettes).
 * Denne del gentager ingen af dem.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

/** Udsnittet mellem to markoerer. indexOf paa selve teksten, ALDRIG split()
 *  - samme greb som 48's og 65's egne udsnit(). */
function udsnit(kilde, fraTekst, tilTekst) {
  const s = kilde.indexOf(fraTekst);
  if (s < 0) return null;
  const e = tilTekst ? kilde.indexOf(tilTekst, s) : -1;
  return e < 0 ? kilde.slice(s) : kilde.slice(s, e);
}

/** CSS uden kommentarer. Uden den maaler man sin egen dokumentation:
 *  blokkens kommentar naevner baade "rgba(0,0,0,.2)", "transition" og
 *  "@keyframes" for at forklare, hvorfor de IKKE staar der - et raat grep
 *  gav derfor 1, 1 og 1, hvor det rigtige svar er 0, 0 og 0. Det er
 *  CLAUDE.md's egen CSS-grep-faelde, og den blev traadt i under
 *  udviklingen af netop dette spor. */
function udenKommentarer(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n81. spor/bundbar: bundbaren er en genstand, ikke et baand (Retning B)');

  const ud = path.join(tmp, 'dist-bundbar');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${ud}`],
    { cwd: rod, encoding: 'utf8' });
  ok('81.0: byg giver exit 0 (frisk byg til egen undermappe af ctx.tmp)',
    b.status === 0, (b.stderr || '').slice(0, 400));
  if (b.status !== 0) return;

  const css = fs.readFileSync(path.join(rod, 'assets', 'system.css'), 'utf8');
  const js = fs.readFileSync(path.join(rod, 'assets', 'katalog.js'), 'utf8');
  const skabelon = fs.readFileSync(path.join(rod, 'tools', 'skabelon', 'katalog.mjs'), 'utf8');
  const laesHtml = (sprog) => fs.readFileSync(path.join(ud, sprog, 'index.html'), 'utf8');
  const i18n = (sprog) => JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', `${sprog}.json`), 'utf8'));

  /* Samme START-markoer som 48.28's udsnit() bruger. Bevares den ikke
     ordret, bliver 48.28 roed af en grund, der intet har med bjaelken at
     goere - derfor staar 81.1a her som den foerste paastand: den siger,
     at ankeret ER der, i stedet for at lade to dele fejle gaadefuldt. */
  const ANKER = '/* PUNKT 6 (JPK 1. sep 2026, L67): den klaebende bjaelke.';
  const SLUT = '/* --- sammenligningens vaelger';
  const blokMedKommentarer = udsnit(css, ANKER, SLUT);
  ok('81.1a: 48.28-ankeret staar ordret i system.css (blokken kan skaeres ud)',
    !!blokMedKommentarer,
    'bevares markoerteksten ikke, falder 48.28/48.29 af en grund, der intet har med bjaelken at goere');
  const blok = blokMedKommentarer ? udenKommentarer(blokMedKommentarer) : '';

  /* ==================================================================
     A. SPROGET NAAR KLIENTEN (punkt 1, J4)
     ================================================================== */

  /* De to noegler FANDTES foer sporet, men kun sammenligningssiden laeste
     dem: assets/katalog.js havde ingen adgang til dem overhovedet. Den
     halvdel er den, der er let at tabe ved en oprydning i skabelonen,
     fordi bjaelken saa bare bliver tavs - den forsvinder ikke. */
  for (const sprog of ['da', 'en']) {
    const html = laesHtml(sprog);
    const chip = udsnit(html, '<p class="saml-taeller"', '</p>');
    const kort = chip && /data-saml-fjern-kort="([^"]*)"/.exec(chip);
    const navn = chip && /data-saml-fjern-navn="([^"]*)"/.exec(chip);
    ok(`81.1.${sprog}: Fjern-knappens SYNLIGE ord staar paa baereren og er ikke tomt`,
      !!kort && kort[1].trim().length > 0,
      `fandt "${kort && kort[1]}" - tom giver en knap uden tekst`);
    ok(`81.2.${sprog}: Fjern-knappens SKAERMLAESERTEKST staar paa baereren og baerer {navn}`,
      !!navn && navn[1].includes('{navn}'),
      `fandt "${navn && navn[1]}" - uden pladsholderen hoerer hun "Fjern, Fjern, Fjern"`);
  }

  ok('81.3: katalog.js laeser BEGGE attributter (ellers er de skrevet forgaeves)',
    /getAttribute\(\s*['"]data-saml-fjern-kort['"]\s*\)/.test(js)
    && /getAttribute\(\s*['"]data-saml-fjern-navn['"]\s*\)/.test(js));

  /* Planens §9 punkt 1: "Ingen ny i18n-noegle." De to skal vaere de
     eksisterende - en nyopfundet noegle ville ogsaa faelde 78.1's
     ubrugt-noegle-tjek, men fra den anden ende og med en anden forklaring. */
  const noegler = ['saml_fjern_kort', 'saml_fjern_navn'];
  ok('81.4: skabelonen bruger PRAECIS de to eksisterende i18n-noegler, ingen ny',
    noegler.every((n) => skabelon.includes(`t('${n}')`))
    && noegler.every((n) => n in i18n('da') && n in i18n('en')),
    'planens §9 punkt 1 - noeglerne fandtes i forvejen i begge sprogfiler');

  /* ==================================================================
     B. FORMEN: GENSTAND, IKKE BAAND (punkt 3, J1 + J2)
     ================================================================== */

  const barRegel = udsnit(blok, '.klaebebar{', '}');
  ok('81.5: .klaebebar-reglen blev fundet i den udskaarne blok', !!barRegel);

  /* J1: CENTRERET. left:auto;right:auto - som planen faktisk skrev - ville
     paa et position:fixed element betyde "brug den statiske position",
     altsaa VENSTREKANTEN. Begge halvdele skal derfor laases: at
     centreringsmekanismen er der, OG at den fejlform ikke er kommet ind. */
  ok('81.6: bjaelken er centreret med left:0 + right:0 + margin-inline:auto (J1)',
    !!barRegel && /left:0/.test(barRegel) && /right:0/.test(barRegel)
    && /margin-inline:auto/.test(barRegel));
  ok('81.7: bjaelken bruger IKKE left:auto/right:auto (den ville staa venstrestillet)',
    !!barRegel && !/left:auto/.test(barRegel) && !/right:auto/.test(barRegel),
    'position:fixed + left:auto = statisk position = venstrekanten, ikke centreret');

  ok('81.8: bjaelken er saa bred som sit indhold (width:max-content med et loft)',
    !!barRegel && /width:max-content/.test(barRegel) && /max-width:calc\(100% - 2\*var\(--kant\)\)/.test(barRegel),
    'uden max-content er den et baand igen - 1.440 px for at baere 605 px blaek');

  ok('81.9: bjaelken er loeftet fri af skaermkanten (bottom er ikke 0)',
    !!barRegel && /bottom:var\(--r4\)/.test(barRegel));

  /* D8: den raa rgba var stilarkets ENESTE. Maalt uden kommentarer, fordi
     blokkens egen dokumentation citerer den slettede vaerdi. */
  ok('81.10: der er ingen raa rgba i klaebebar-blokken (kommentarer strippet)',
    (blok.match(/rgba\(/g) || []).length === 0,
    'D8: box-shadow:0 -1px 0 rgba(0,0,0,.2) var stilarkets eneste raa rgba-skygge');
  ok('81.11: overkanten er en haarstreg i --paafod2, ikke en skygge',
    !!barRegel && /box-shadow:inset 0 0 0 1px var\(--paafod2\)/.test(barRegel),
    'DESIGN.md, Dybde: "Dybde signaleres af fladeskift og streger"');

  /* DESIGN.md, Dybde: "Systemet er fladt, punktum". Tokenerne er bevidst
     bevaret som NAVNE og sat til none - en genindfoerelse ét sted ville
     ramme 11 brugssteder paa én gang.
     MAALT PAA HELE ARKET UDEN KOMMENTARER, ikke paa en udskaaret :root.
     Foerste udgave brugte udsnit(css, ':root{', '}') og var roed: den
     foerste `}` efter ':root{' staar inde i blokkens egen KOMMENTAR,
     laenge foer de to tokens paa linje 269-270. Samme familie som
     CLAUDE.md's split()-faelde - en afgraensning, der rammer et sted,
     ingen havde taenkt paa, og som giver et fuldt plausibelt falsk svar. */
  const cssRen = udenKommentarer(css);
  const skyggeDefs = cssRen.match(/--skygge(?:-loeft)?:[^;}]*/g) || [];
  ok(`81.12: begge skyggetokens er stadig none, og ingen af dem er omdefineret (fandt: ${skyggeDefs.join(' | ') || 'ingen'})`,
    skyggeDefs.length === 2 && skyggeDefs.every((d) => /:\s*none\s*$/.test(d)),
    'DESIGN.md, Dybde: "Systemet er fladt, punktum" - en flydende genstand faar en streg, ikke en skygge');

  /* J2: INGEN BEVAEGELSE - et forbud, ikke en udeladelse. Sitet har ingen
     bevaegelsesgrammatik ud over .knap:active, og en sammenfoldning her
     ville vaere sidens eneste animerede tilstandsskift. */
  ok('81.13: bjaelken har hverken transition eller @keyframes (J2, forbud)',
    !/transition/i.test(blok) && !/keyframes/i.test(blok),
    'JPK 3. sep 2026: ingen bevaegelse, naar et led fjernes');

  /* DP3b (DESIGN.md): acceptkriteriet er, at Retning B kunne bygges UDEN
     at aendre én font-size. De to vaerdier er "Raekke" (14) og "Mikro" (13). */
  const grader = [...new Set((blok.match(/font-size:([^;}]+)/g) || []).map((s) => s.split(':')[1].trim()))].sort();
  ok(`81.14: klaebebar-blokken baerer PRAECIS skriftgraderne 13px og 14px (DP3b) - fandt: ${grader.join(', ') || 'ingen'}`,
    grader.length === 2 && grader.includes('13px') && grader.includes('14px'),
    'DP3b: sporet kan bygge Retning B uden at aendre en eneste font-size');

  /* ==================================================================
     C. BUNDPLADSEN (punkt 4)
     ================================================================== */

  ok('81.15: --barplads er 0px som grundtilstand (prisen paa 215 andre sider er nul)',
    /:root\{--barplads:0px\}/.test(udenKommentarer(css)));
  ok('81.16: <body> reserverer pladsen med var(--barplads)',
    /body\{padding-bottom:var\(--barplads\)\}/.test(udenKommentarer(css)));

  /* Den betingede form er ikke pynt: et ubetinget html{scroll-padding-bottom}
     flyttede alle 216 siders beregnede vaerdi fra `auto` til `0px`. De to
     opfoerer sig ens i dag, men `auto` er per specifikation UA'ens valg. */
  ok('81.17: scroll-padding-bottom saettes KUN paa sider med en synlig bjaelke',
    /html:has\(\.klaebebar:not\(\[hidden\]\)\)\{scroll-padding-bottom:var\(--barplads\)\}/.test(udenKommentarer(css)),
    'ubetinget ville de 215 andre sider gaa fra scroll-padding-bottom:auto til 0px');

  ok('81.18: --barplads saettes af en MAALING, ikke af et tal i koden',
    /setProperty\(\s*['"]--barplads['"]/.test(js) && /getBoundingClientRect\(\)/.test(js)
    && /window\.innerHeight/.test(js),
    'D7/L30: bjaelken er 33,2 px paa én raekke og var 91,6 px ved 320 px - ét tal kan ikke daekke begge');

  /* Sidefodens midlertidige loesning. Reglens egen kommentar kaldte sig
     midlertidig "indtil spor/barplan"; det spor er koert. Bliver den
     genindfoert ved siden af --barplads, reserveres pladsen TO gange. */
  ok('81.19: sidefoden baerer ingen haardkodet bundplads til bjaelken laengere',
    !udenKommentarer(css).includes('72px'),
    'de 72 px var forkerte i begge retninger: bjaelken var 45,7 px foer og er 33,2 px nu');

  /* ==================================================================
     D. BETJENINGEN (punkt 1, 2, 5, 6 - J3 og J5)
     ================================================================== */

  /* D5. Den gamle form er lige saa vigtig at laase ude som den nye er at
     laase inde: en tilbagerulning til appendChild ville flytte bjaelkens
     knapper fra fokusstop 10 til 241 af 245, og INTET ville se forkert ud. */
  ok('81.20: bjaelken indsaettes foer <main> og ikke sidst i <body>',
    /insertBefore\(klaebebar,\s*hoveddel\)/.test(js)
    && !/document\.body\.appendChild\(klaebebar\)/.test(js.replace(/else document\.body\.appendChild\(klaebebar\);/, '')),
    'D5: fokusstop 241 af 242 foer sporet, 10 af 245 efter');

  /* D3, og den ene ting praecedensen goer forkert: sammenligningssidens
     fjernSlug() lader fokus falde til <body>. Alle tre grene skal staa -
     den mellemste (kortets egen knap) er den, der er let at glemme, fordi
     den kun rammes, naar det SIDSTE led fjernes. */
  /* MAALT INDE I FUNKTIONEN, IKKE I HELE FILEN - og det er ikke
     forsigtighed, det er en fejl, der blev fanget. Foerste udgave testede
     mod hele `js`, og et revert-forsoeg, der oedelagde netop denne gren,
     lod paastanden staa GROEN: `getElementById('sog-katalog')` staar TO
     steder i filen (linje 421 i fokusreglen og linje 562 i filterkoden),
     saa den anden forekomst bar paastanden alene. En assertion, der kan
     holdes i live af en linje, den ikke handler om, beviser ingenting. */
  const fokusFunk = udsnit(js, 'function flytFokusEfterFjern(', '\n    }');
  ok('81.21: fokus flyttes efter et Fjern-klik, og alle tre grene staar i funktionen selv',
    /flytFokusEfterFjern\(slug, p2\)/.test(js)
    && !!fokusFunk
    && /tilbage\[Math\.min\(plads, tilbage\.length - 1\)\]\.focus\(\)/.test(fokusFunk)
    && /offsetParent !== null/.test(fokusFunk)
    && /getElementById\(\s*['"]sog-katalog['"]\s*\)/.test(fokusFunk),
    'D3: assets/sammenligning.js:705 lader fokus falde til <body> - bjaelken maa ikke kopiere det');

  /* Den tavse halvdel af samme fejl: en tom, skjult bjaelke, der stadig
     indeholder sit sidste <li>, giver querySelectorAll et traef, fokus
     saettes paa et skjult element, og activeElement bliver <body> ALLIGEVEL
     - uden en undtagelse nogen steder. Maalt under udviklingen. */
  ok('81.22: listen toemmes, naar udvalget bliver tomt (ikke bare hidden)',
    /klaebebarValg\.textContent = '';[\s\S]{0,200}klaebebar\.setAttribute\('hidden', ''\)/.test(js),
    'et efterladt <li> i en skjult bjaelke faar fokusreglen til at ramme et skjult element');

  /* J3. Rullesporet findes ved ALLE bredder og ikke under en graense:
     bjaelkens indhold er 865,8 px (da) / 948,3 px (en), saa den ombryder
     omkring 900 px viewport - en graense paa 700 px ville have efterladt
     spandet 700-900 i den fejl, den skulle loese. */
  const sporRegel = udsnit(blok, '.klaebebar__spor{', '}');
  ok('81.23: rullesporet findes og er vandret (J3)',
    !!sporRegel && /overflow-x:auto/.test(sporRegel) && /min-width:0/.test(sporRegel));
  ok('81.24: bjaelken kan ikke ombryde ved nogen bredde (flex-wrap:nowrap)',
    !!barRegel && /flex-wrap:nowrap/.test(barRegel),
    'ombrydning gav 62,4 px ved 700 px - vaerre end de 45,7 px, klagen handlede om');
  ok('81.25: sporet baerer daekkets to tastaturrettelser (scroll-padding + indad ring)',
    !!sporRegel && /scroll-padding-inline/.test(sporRegel)
    && /\.klaebebar__fjern:focus-visible,\.klaebebar__ryd:focus-visible\{[^}]*outline-offset:-2px/.test(blok),
    'en overflow-boks klipper en udadtegnet ring - ogsaa ved 1440, hvor der intet er at rulle');

  /* J5, JPK 3. sep 2026: knappen bliver. Argumentet, en efterfoelger skal
     kende, foer han "rydder op": den er den eneste maade at toemme
     udvalget paa, der ikke kraever, at man rammer tre knapper. */
  ok('81.26: "Ryd udvalget" findes stadig i bjaelken (J5)',
    /klaebebar__ryd/.test(js) && /\.klaebebar__gaa,\.klaebebar__ryd\{/.test(blok),
    'JPK 3. sep 2026 afgjorde planens §10: knappen bliver');

  /* Beroeringsmaalene. .knap--tekst-moerk nulstiller primitivens 44 px til
     0, saa uden disse to regler er bjaelkens knapper 13,2 px hoeje. */
  const fjernRegel = udsnit(blok, '.klaebebar__fjern{', '}');
  const handlingRegel = udsnit(blok, '.klaebebar__gaa,.klaebebar__ryd{', '}');
  ok('81.27: alle tre knaptyper i bjaelken har mindst 24 px beroeringsmaal',
    !!fjernRegel && /min-height:24px/.test(fjernRegel)
    && !!handlingRegel && /min-height:24px/.test(handlingRegel),
    'WCAG 2.5.8 direkte i stedet for gennem afstandsundtagelsen (13,2 px foer sporet)');

  /* ==================================================================
     E. GRAENSEBESKEDEN (punkt 5, D6)
     ================================================================== */

  ok('81.28: graensebeskeden flyttes ind i bjaelken ved koersel',
    /klaebebar\.appendChild\(samlGraense\)/.test(js),
    'D6: graensen laeres, hvor udvalget staar, ikke 3.000 px derfra');

  /* DEN LETTE FEJL AT LAVE: elementet baerer color:var(--blaek), fordi det
     stod paa en lys flade. PAA --fod er blaek 1,00 : 1 - beskeden ville
     vaere usynlig, og intet ville fejle. */
  const graenseIBar = udsnit(blok, '.klaebebar .saml-graense{', '}');
  ok('81.29: beskeden faar den moerke flades forgrund (--blaek paa --fod er 1,00 : 1)',
    !!graenseIBar && /color:var\(--paafod\)/.test(graenseIBar),
    'uden den er beskeden usynlig inde i bjaelken, og ingen test ville fange det');

  /* Og den maa ikke maale bjaelken op: som flexled gjorde den den
     1.121,7 px bred og 70,2 px hoej, hvorefter --barplads - maalt paa den
     lave bjaelke - daekkede indhold igen. */
  ok('81.30: beskeden staar uden for bjaelkens floed og aendrer ikke dens maal',
    !!graenseIBar && /position:absolute/.test(graenseIBar),
    'som flexled gjorde den bjaelken 1.121,7 x 70,2 px i stedet for 865,8 x 33,2');

  /* Flytningen sker i DOM'en ved koersel; skabelonen skal stadig udsende
     elementet, ellers er der intet at flytte - og 65.12 vogter samme
     kontrakt fra sin side. */
  for (const sprog of ['da', 'en']) {
    ok(`81.31.${sprog}: skabelonen udsender stadig .saml-graense at flytte`,
      laesHtml(sprog).includes('data-saml-graense'),
      'flytningen sker ved koersel - uden elementet i bygget er der intet at flytte');
  }
}
