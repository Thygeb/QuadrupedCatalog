/**
 * tests/dele/36-typeskilt-robot.mjs — spor/robot, 31. aug 2026.
 *
 * Robotsiden i TYPESKILT-formen (L57), med JPK's tre bestillinger fra samme
 * dag: hierarkiet mellem overskrift og billede, enhedsomskifteren (L60) og
 * kilderne i bunden (L60).
 *
 * FIRE TING, DER BEVISES HER, OG HVORFOR DE HVER ISAER KAN GAA GALT TAVST:
 *
 *   1. HIERARKIET. Navnet skal staa FOER fotoet i DOM'en - JPK's mulighed
 *      (a). Et gitter kan flytte fotoet op igen med en enkelt
 *      `grid-template-areas`-linje uden at HTML'en aendrer sig, saa BEGGE
 *      dele proeves: raekkefoelgen i markup og gitterets omraadekort i CSS.
 *
 *   2. ENHEDSOMSKIFTEREN. Selve skiftet sker i CSS, saa et grep paa den
 *      byggede HTML kan ikke se, om det VIRKER. Det, der kan proeves uden en
 *      browser, er reglerne bagved - og det er ogsaa dem, der gaar galt:
 *      producentens eget tal skal vinde over vores omregning, de syv
 *      uomregnelige enheder skal staa uroerte, og hver metrisk figur skal
 *      have praecis ét imperialt modstykke. `imperialPost()` er en ren
 *      funktion og proeves derfor direkte, i BEGGE retninger.
 *
 *   3. KILDERNE I BUNDEN. Positionen alene er ikke nok: flytter man en
 *      liste, kan ankrene overleve som doede links, og det sker uden en
 *      fejlmeddelelse nogen steder. Derfor proeves BAADE at kildelisten er
 *      sidens sidste sektion, OG at hvert eneste `#kilde-<bogstav>` paa
 *      hver eneste robotside rammer et id, der findes paa samme side.
 *
 *   4. FORBEHOLDENE. 890 forbehold laa foldet bag <details>. Tallet er ikke
 *      skrevet i haanden her - det TAELLES i data/robots/ og holdes op mod
 *      antallet inde i den AABNE skematabel. Vokser kataloget, foelger begge
 *      tal med; foldes tabellen igen, falder det ene og ikke det andet.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

/** Sektionen fra dens klassenavn og frem til dens egen </section>.
 *  indexOf paa KLASSENAVNET, ikke split() paa sektions-id'et: skabelonen
 *  skriver hvert id to gange (aria-labelledby og id), saa split rammer det
 *  tomme mellemstykke og giver 0 uanset hvad der staar paa siden. */
function sektion(html, klasse) {
  const i = html.indexOf(`class="${klasse}"`);
  if (i === -1) return '';
  return html.slice(i, html.indexOf('</section>', i));
}

export default async function koer(ctx) {
  const { rod, tmp, node, ok, hentRobotter } = ctx;

  /** Taeller "advarsel"-noegler med defineret vaerdi paa ALLE dybder af `obj`
   *  (samme rekursionsform som db/tjek.mjs's udenTekst/tests/dele/68's
   *  taelTekstnoegler). Erstatter et raat regex-tael paa YAML-tekst ("^\s+
   *  advarsel:") med et strukturtael paa det parsede dokument. */
  function taelAdvarsler(obj) {
    if (Array.isArray(obj)) return obj.reduce((n, v) => n + taelAdvarsler(v), 0);
    if (obj !== null && typeof obj === 'object') {
      let n = 0;
      for (const [k, v] of Object.entries(obj)) {
        if (k === 'advarsel' && v !== undefined && v !== null) n++;
        n += taelAdvarsler(v);
      }
      return n;
    }
    return 0;
  }

  console.log('\n36. spor/robot: robotsiden i TYPESKILT-formen (L57/L60)');

  const dist = path.join(tmp, 'dist-typeskilt-robot');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${dist}`],
    { cwd: rod, encoding: 'utf8' });
  ok('36.0: byg af hele kataloget giver exit 0', b.status === 0, (b.stderr || '').trim());

  const sys = fs.readFileSync(path.join(rod, 'assets', 'system.css'), 'utf8');
  const robotMappe = (sprog) => path.join(dist, sprog, 'robotter');
  const alleRobotSider = (sprog) => fs.readdirSync(robotMappe(sprog), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => [d.name, path.join(robotMappe(sprog), d.name, 'index.html')])
    .filter(([, p]) => fs.existsSync(p));

  /* --- 1. Hierarkiet: navnet foer fotoet, i markup OG i gitteret --------- */

  for (const sprog of ['da', 'en']) {
    const sider = alleRobotSider(sprog);
    ok(`36.1.${sprog}: der er bygget robotsider at maale paa`, sider.length > 0,
      `fandt ${sider.length}`);

    const forkert = [];
    for (const [navn, p] of sider) {
      const html = fs.readFileSync(p, 'utf8');
      const iHoved = html.indexOf('<header class="robot-top">');
      const slut = html.indexOf('</header>', iHoved);
      const hoved = iHoved === -1 ? '' : html.slice(iHoved, slut);
      const iNavn = hoved.indexOf('class="robot-navn"');
      const iFoto = hoved.indexOf('class="robot-foto"');
      const iH1 = hoved.indexOf('<h1');
      if (iHoved === -1 || iNavn === -1 || iFoto === -1 || iH1 === -1
        || !(iNavn < iFoto) || !(iH1 < iFoto)) forkert.push(navn);
    }
    ok(`36.2.${sprog}: robotnavnet staar FOER fotoet i DOM'en paa alle ${sider.length} sider`,
      forkert.length === 0,
      `raekkefoelgen er byttet om paa: ${forkert.slice(0, 5).join(', ')}`);
  }

  // Gitteret maa ikke flytte fotoet op igen. `grid-template-areas` er den ene
  // linje, der kan goere det uden at HTML'en aendrer sig.
  const gitter = (sys.match(/\.typeskilt \.robot-top\{[^}]*grid-template-areas:[^;}]*/) || [''])[0];
  ok('36.3: gitteret saetter navnet i FOERSTE raekke over begge spalter',
    /grid-template-areas:"navn navn" "foto tal"/.test(sys),
    `fandt: ${gitter || 'ingen grid-template-areas paa .typeskilt .robot-top'}`);
  // Vaegt 700, ikke 800: Saira Semi Condensed selvhostes i 400/500/600/700
  // (system.css afsnit 1), og 800 ville blive SYNTETISERET af browseren.
  const h1Regel = (sys.match(/\.typeskilt \.robot-navn h1\{[^}]*\}/) || [''])[0];
  ok('36.4: robotnavnet staar paa en vaegt, skriftfilerne faktisk har (700)',
    /font-weight:700/.test(h1Regel) && !/font-weight:800/.test(h1Regel),
    `fandt: ${h1Regel}`);
  const tokenMatch = (h1Regel.match(/font-size:var\((--fs-[^)]+)\)/) || [])[1];
  let gulv;
  if (tokenMatch) {
    gulv = (sys.match(new RegExp(`${tokenMatch}:clamp\\((\\d+)px`)) || [])[1];
  } else {
    gulv = (h1Regel.match(/font-size:clamp\((\d+)px/) || [])[1];
  }
  ok('36.5: navnets mindste grad er stoerre end den stoerste vaerdi i striben (29px, R5 via --fs-robot)',
    Number(gulv) > 29, `gulvet er ${gulv}px`);

  /* --- 2. Enhedsomskifteren: reglerne bag skiftet ------------------------ */

  const robot = await import(
    'file://' + path.join(rod, 'tools', 'skabelon', 'robot.mjs').replace(/\\/g, '/'));

  // 2a. Producentens eget tal VINDER. Spots egenvaegt: 33,8 kg og 74,5 lb.
  const medEget = robot.imperialPost(
    { vaerdi: 33.8, enhed: 'kg', vaerdi_imperial: 74.5, enhed_imperial: 'lb' }, 'da');
  ok('36.6: producentens eget imperiale tal vinder over vores omregning',
    medEget && medEget.egen === true && medEget.post.vaerdi === 74.5
    && medEget.post.enhed === 'lb', JSON.stringify(medEget));
  // Modbeviset: uden producentens tal SKAL den samme figur blive vores.
  const udenEget = robot.imperialPost({ vaerdi: 33.8, enhed: 'kg' }, 'da');
  ok('36.7: uden producentens tal omregner vi selv - og markerer det som vores',
    udenEget && udenEget.egen === false && udenEget.post.enhed === 'lb'
    && udenEget.post.vaerdi === 74.5, JSON.stringify(udenEget));
  ok('36.8: og omregningen baerer sit metriske udgangspunkt, saa maerket kan sige hvorfra',
    udenEget && udenEget.kildeform === '33,8 kg', JSON.stringify(udenEget?.kildeform));

  // 2b. Afrundingen rammer producenternes egen. To krydstjek, som begge har
  // et FACIT i data: Boston Dynamics skriver 74.5 lb til 33,8 kg, og
  // databladet 43.3 in til 1100 mm (= 110 cm efter visningsPost).
  ok('36.9: 110 cm omregnes til 43,3 in - samme afrunding som databladets egen',
    robot.imperialPost({ vaerdi: 110, enhed: 'cm' }, 'da')?.post.vaerdi === 43.3);
  ok('36.10: -20 °C bliver -4 °F (affin omregning, ikke en skalering)',
    robot.imperialPost({ vaerdi: -20, enhed: '°C' }, 'da')?.post.vaerdi === -4);

  // 2c. De syv enheder, der ALDRIG maa omregnes. En "omregning" af dem ville
  // vaere volapyk, og valuta desuden et tal uden kilde.
  const forbudte = ['t', '°', 'DoF', 'Wh', 'min', 'CNY', 'USD', 'EUR', 'V', '%'];
  const omregnet = forbudte.filter((e) => robot.imperialPost({ vaerdi: 7, enhed: e }, 'da') !== null);
  ok('36.11: timer, grader, DoF, Wh, minutter, valuta, volt og procent omregnes ALDRIG',
    omregnet.length === 0, `blev omregnet: ${omregnet.join(', ')}`);
  // Modbeviset: listen skal ramme noget. Er OMREGNING tom, ville 36.11 vaere
  // groen af den forkerte grund.
  ok('36.12: … mens de syv omregnelige enheder ALLE giver et resultat',
    ['kg', 'mm', 'cm', 'm', '°C', 'm/s', 'km/h']
      .every((e) => robot.imperialPost({ vaerdi: 7, enhed: e }, 'da') !== null));

  // 2d. En tilstand er ikke et tal. "ikke oplyst" maa aldrig faa en enhed paa.
  ok('36.13: en tilstandsvaerdi omregnes ikke',
    robot.imperialPost({ vaerdi: 'ikke_oplyst', enhed: 'kg' }, 'da') === null);

  // 2e. Hver metrisk figur skal have PRAECIS ét imperialt modstykke. Falder
  // parringen fra hinanden, forsvinder et tal i den ene tilstand.
  for (const sprog of ['da', 'en']) {
    let m = 0; let i = 0; let sider = 0;
    for (const [, p] of alleRobotSider(sprog)) {
      const html = fs.readFileSync(p, 'utf8');
      m += (html.match(/class="enhedsvis enhedsvis--metrisk"/g) || []).length;
      i += (html.match(/class="enhedsvis enhedsvis--imperial"/g) || []).length;
      sider++;
    }
    ok(`36.14.${sprog}: lige mange metriske og imperiale figurer over ${sider} sider`,
      m === i && m > 0, `metrisk ${m}, imperial ${i}`);
  }

  // 2f. Standardtilstanden er METRISK, og den metriske wrapper har ingen
  // kasse - det er dét, der goer "metrisk visning uroert" til en egenskab
  // ved formen frem for noget, der skal maales frem hver gang.
  ok('36.15: .enhedsvis er display:contents (wrapperen tegner ingen kasse)',
    /\.enhedsvis\{display:contents\}/.test(sys));
  ok('36.16: imperial er skjult som standard - siden aabner metrisk, ogsaa uden JavaScript',
    /\.enhedsvis--imperial\{display:none\}/.test(sys));
  ok('36.17: skiftet haenger paa en RIGTIG afkrydsning, ikke paa JavaScript',
    /\.typeskilt \.enhedsskift__boks:checked ~ \* \.enhedsvis--metrisk\{display:none\}/.test(sys)
    && /\.typeskilt \.enhedsskift__boks:checked ~ \* \.enhedsvis--imperial\{display:contents\}/.test(sys));
  // Skriftgulvet paa 8px (og R5's skriftgulv paa 10.5px) gaelder ogsaa det nye maerke (jf. dele/31).
  const omrRegel = (sys.match(/\.omregnet\{[^}]*\}/) || [''])[0];
  const omrToken = (omrRegel.match(/font-size:var\((--fs-[^)]+)\)/) || [])[1];
  let omrGrad;
  if (omrToken) {
    omrGrad = Number((sys.match(new RegExp(`${omrToken}:([\\d.]+)px`)) || [])[1]);
  } else {
    omrGrad = Number((omrRegel.match(/font-size:([\d.]+)px/) || [])[1]);
  }
  ok('36.18: "omregnet"-maerket staar paa eller over skriftgulvet 8px (R5: bundet til --fs-gulv = 10.5px)',
    omrGrad >= 8, `fandt ${omrGrad}px i: ${omrRegel}`);

  /* --- 3. Kilderne i bunden (L60) - og ankrene, der skal overleve turen -- */

  for (const sprog of ['da', 'en']) {
    const sider = alleRobotSider(sprog);
    const ikkeSidst = [];
    const medDoedeAnkre = [];
    let ankreIAlt = 0;
    for (const [navn, p] of sider) {
      const html = fs.readFileSync(p, 'utf8');
      const iKilder = html.indexOf('class="sektion kilder"');
      const iSkema = html.indexOf('class="sektion skema"');
      // Sidst betyder: efter skemaet, og uden en sektion efter sig.
      const efter = iKilder === -1 ? '' : html.slice(html.indexOf('</section>', iKilder));
      if (iKilder === -1 || iSkema === -1 || !(iSkema < iKilder)
        || /<section class="sektion /.test(efter)) ikkeSidst.push(navn);

      const idPaaSiden = new Set([...html.matchAll(/id="(kilde-[^"]+)"/g)].map((x) => x[1]));
      const ankre = [...html.matchAll(/href="#(kilde-[^"]+)"/g)].map((x) => x[1]);
      ankreIAlt += ankre.length;
      if (ankre.some((a) => !idPaaSiden.has(a))) medDoedeAnkre.push(navn);
    }
    ok(`36.19.${sprog}: kildelisten er sidens SIDSTE sektion paa alle ${sider.length} sider`,
      ikkeSidst.length === 0, `staar ikke sidst paa: ${ikkeSidst.slice(0, 5).join(', ')}`);
    ok(`36.20.${sprog}: alle ${ankreIAlt} kildeankre rammer et id paa deres egen side`,
      medDoedeAnkre.length === 0 && ankreIAlt > 0,
      `doede ankre paa: ${medDoedeAnkre.slice(0, 5).join(', ')} (${ankreIAlt} ankre i alt)`);
  }

  /* --- 4. Forbeholdene staar AABENT, og tallet taelles frem -------------- */

  // AA183/L84: laeser hentRobotter() (databasen), ikke data/robots/ - mappen
  // er slettet.
  const alleRaaForbehold = await hentRobotter();
  const forbeholdIData = alleRaaForbehold.reduce((n, d) => n + taelAdvarsler(d), 0);
  ok('36.21: der ER forbehold i datasaettet at holde skemaet op imod',
    forbeholdIData > 0, `fandt ${forbeholdIData}`);

  for (const sprog of ['da', 'en']) {
    let iSkema = 0;
    for (const [, p] of alleRobotSider(sprog)) {
      iSkema += (sektion(fs.readFileSync(p, 'utf8'), 'sektion skema')
        .match(/class="advarsel advarsel--/g) || []).length;
    }
    ok(`36.22.${sprog}: alle ${forbeholdIData} forbehold staar UDFOLDET i skematabellen`,
      iSkema === forbeholdIData, `fandt ${iSkema} i det aabne skema mod ${forbeholdIData} i data`);
  }
  // Og skemaet maa ikke vaere en sammenklapning igen. Tallet ovenfor ville
  // ogsaa vaere rigtigt inde i et <details>.
  const spotDa = fs.readFileSync(path.join(dist, 'da', 'robotter', 'boston-dynamics-spot', 'index.html'), 'utf8');
  ok('36.23: skemaet er en aaben <section>, ikke en <details>-sammenklapning',
    /<section class="sektion skema"/.test(spotDa) && !/<details class="skema"/.test(spotDa));
  ok('36.24: og det er en RIGTIG tabel med tre navngivne kolonner',
    /<table class="skema-tabel"/.test(spotDa)
    && (spotDa.match(/<th scope="col" role="columnheader">/g) || []).length === 3);

  // Faelden, den aabne tabel kostede 31. aug 2026: system.css' BARE
  // `table{…min-width:620px…}` (afsnit 14, skrevet til sammenligningsmatricen)
  // rammer enhver tabel paa sitet. Maalt ved 390 px foer nulstillingen:
  // computed min-width 620px, body.scrollWidth 636 - 246 px vandret overloeb
  // paa hver eneste robotside, uden at nogen regel saa forkert ud.
  // generator.css:644 nulstiller den samme faelde for `.saml-matrix`; den
  // maa ikke skulle opdages en tredje gang.
  ok('36.24b: skematabellen nulstiller den globale table{min-width:620px}',
    /\.typeskilt \.skema-tabel\{[^}]*min-width:0/.test(sys),
    'uden min-width:0 giver hver robotside 246 px vandret overloeb ved 390');

  /* --- 5. De tre tilstande maa stadig se forskellige ud ------------------ */

  // Haard begraensning 5. Skiltets maerkelinje er sidens FOERSTE moede med
  // reglen (status og vaegtklasse), og bruger spritens SVG-former.
  //
  // CE staar IKKE laengere i maerkelinjen (JPK 1. sep 2026: en fast celle,
  // der er et hul paa 73 af 77 robotter, laerer ingen noget paa sidens
  // dyreste plads - samme regel som allerede holdt CE ude af STRIBE_FELTER).
  // Beviset for CE's "ikke oplyst"-tilstand flyttede derfor til skemaet,
  // hvor det staar som en RIGTIG raekke (skemaRaekke() -> side.mjs' tilstand()),
  // og formen der er en ANDEN mekanik end SVG-spritten: en stiplet
  // firkant (.v-ikke .mrk, border:1px dashed) mod NEJ's fyldte firkant
  // (.v-nej .mrk, solid background) og JA's ring-med-kerne (.v-ja .mrk,
  // inset box-shadow). Tre forskellige FORMER, ikke kun tre toner - proevet
  // paa Spots CE-raekke, som databladet selv lader staa uoplyst (se
  // data/robots/boston-dynamics-spot.yaml).
  const maerkeLinje = (spotDa.match(/<ul class="maerker skiltlinje">[\s\S]*?<\/ul>/) || [''])[0];
  ok('36.25: skiltet har en maerkelinje under robotnavnet', maerkeLinje !== '');
  ok('36.25b: CE staar IKKE i skiltets maerkelinje', !/maerke--ce/.test(maerkeLinje), maerkeLinje.slice(0, 200));
  const ceRaekke = (spotDa.match(/<th scope="row"[^>]*>CE oplyst<\/th>[\s\S]*?<\/tr>/) || [''])[0];
  ok('36.26: den uoplyste CE-tilstand staar i skemaet med en stiplet form, ikke kun en tone',
    /class="v v-ikke"/.test(ceRaekke) && /<i class="mrk">/.test(ceRaekke),
    ceRaekke.slice(0, 200));
  ok('36.26b: den stiplede form er en RIGTIG stiplet kant i CSS, ikke kun en klasse uden virkning',
    /\.v-ikke \.mrk\{[^}]*border:1px dashed/.test(sys));
  ok('36.27: "ikke oplyst"-maerket baerer stoev-blaek (4,74:1), aldrig stoevgraa (2,14:1)',
    /\.typeskilt \.maerke--tom\{[^}]*color:var\(--blaek3\)/.test(sys)
    && !/\.typeskilt \.maerke--tom\{[^}]*color:var\(--hegn\)/.test(sys));
}
