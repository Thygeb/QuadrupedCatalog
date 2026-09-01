/**
 * tests/dele/51-fejl404.mjs — 404-siden (spor/404).
 *
 * Foer dette spor havde sitet INGEN 404-side: en forkert URL ramte
 * webserverens bare standardside, uden sitets skrift, uden navigation og
 * uden en vej tilbage (maalt: `ls dist/404.html dist/da/404.html
 * dist/en/404.html` gav 0 filer, foer sporet startede).
 *
 * Sitet er statisk med to sprog og en sprogneutral rod. En statisk vaert
 * leder efter ÉN fast fil ved navn 404.html, og forskellige vaerter leder
 * forskellige steder efter den - se filhovedet i tools/skabelon/fejl404.mjs
 * for hele begrundelsen. Loesningen bygger DERFOR tre filer, og denne del
 * beviser fem ting om dem:
 *
 *   1. ALLE TRE FILER FINDES (dist/404.html, dist/<sprog>/404.html).
 *   2. DE SPROGSPECIFIKKE SIDER BAERER SITETS CHROME - topbar, sprogskifter,
 *      fod med hard-begraensning-1-linjen - saa en 404 ikke foeles som en
 *      anden hjemmeside (briefets punkt 2).
 *   3. INGEN NAVIGATIONSPUNKT ER FALSKT MARKERET SOM DEN AKTUELLE SIDE -
 *      en 404 ER ikke nogen af de rigtige sider, og aria-current="page" paa
 *      fx "Oversigt" ville lyve om det.
 *   4. BEGGE SIDER GIVER EN VEJ VIDERE TIL KATALOGET, og linket rammer en
 *      fil, der faktisk findes i det samme byg - ikke bare en streng, der
 *      LIGNER en sti.
 *   5. ROD-SIDEN ER TOSPROGET OG SELVBAERENDE, med praecis én vej ind pr.
 *      sprog (skema.SPROG.length), og hverken sproget rammes af en anden
 *      sides klassenavne (f404-praefikset er unikt for denne fil).
 *
 * REVERT-BEVIS (CLAUDE.md's krav): for hver strukturel paastand - chrome,
 * aria-current, katalog-link, "404 alene er ikke et svar" - koeres den
 * SAMME regel ogsaa mod en haandskrevet, bevidst OEDELAGT HTML-streng, og
 * proeven kraever, at reglen dér svarer forkert/negativt. Uden det ville en
 * regex, der rammer en kommentar i stedet for selve markup'en (den fejl,
 * CLAUDE.md selv advarer om), kunne staa groen uden at beskytte noget.
 *
 * Bygger tests/eksempel-robotter (fixturen), ikke det rigtige datasaet -
 * samme isolation som del 04 og 42: proeven maa ikke afhaenge af, at nogen
 * har bygget den rigtige dist/ i forvejen.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const {
    rod, tmp, node, ok, skema, lasRobotter,
  } = ctx;

  console.log('\n51. 404-siden (spor/404)');

  const dist = path.join(tmp, 'dist-fejl404');
  const r = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'),
    `--data=${path.join(rod, 'tests', 'eksempel-robotter')}`, `--ud=${dist}`],
  { cwd: rod, encoding: 'utf8' });
  ok('51.0: build.mjs giver exit 0', r.status === 0, (r.stderr || '').trim());

  const SPROG = skema.SPROG;
  const fixtureRobotter = lasRobotter(path.join(rod, 'tests', 'eksempel-robotter'));

  /* --- 1. alle tre filer findes ------------------------------------------- */
  const rodFil = path.join(dist, '404.html');
  ok('51.1.rod: dist/404.html findes', fs.existsSync(rodFil));
  const sider = {};
  for (const s of SPROG) {
    const f = path.join(dist, s, '404.html');
    ok(`51.1.${s}: dist/${s}/404.html findes (FLAD fil, ikke ${s}/404/index.html)`, fs.existsSync(f));
    if (fs.existsSync(f)) sider[s] = fs.readFileSync(f, 'utf8');
  }
  ok('51.1: 404-siden er bygget paa ALLE sprog, ikke kun ét',
    Object.keys(sider).length === SPROG.length,
    `fandt ${Object.keys(sider).length} af ${SPROG.length}`);
  if (!fs.existsSync(rodFil) || Object.keys(sider).length !== SPROG.length) return;
  const rodSide = fs.readFileSync(rodFil, 'utf8');

  // <main> alene til tekstpaastande - fodens ingen_forhandler-linje findes paa
  // HVER side, saa en soegning i hele dokumentet ville vaere groen uanset hvad.
  const hovedAf = (html) => {
    const a = html.indexOf('<main');
    const b = html.indexOf('</main>');
    return a >= 0 && b > a ? html.slice(a, b) : '';
  };

  /* --- 2. sitets chrome er der (topbar, sprogskifter, fod) ---------------- */
  for (const s of SPROG) {
    const T = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', `${s}.json`), 'utf8'));
    ok(`51.2.${s}: <html lang="${s}">`, new RegExp(`<html lang="${s}"`).test(sider[s]));
    ok(`51.2.${s}: <title> baerer fejl404_titel + sted_navn`,
      sider[s].includes(`<title>${T.fejl404_titel} · ${T.sted_navn}</title>`));
    ok(`51.2.${s}: siden er noindex (samme regel som alle andre sider)`,
      /<meta name="robots" content="noindex">/.test(sider[s]));
    ok(`51.2.${s}: topbaren med sitets navn staar paa siden ("daek__navn")`,
      /class="daek__navn"/.test(sider[s]));
    ok(`51.2.${s}: header-sprogskifteren (DA/EN) staar paa siden`,
      /class="daek__sprogkode"/.test(sider[s]));
    ok(`51.2.${s}: fodens haarde linje ("ingen_forhandler") staar paa siden`,
      sider[s].includes(T.ingen_forhandler));
    ok(`51.2.${s}: fodens sprogskifte-laenke ("andet_sprog") staar paa siden`,
      sider[s].includes(T.andet_sprog));
  }
  // REVERT-BEVIS: en side UDEN chrome (kun <main>, ingen <header>/<footer>)
  // skal fejle NOEJAGTIG samme fire regler. Beviser, at 51.2-reglerne rent
  // faktisk kraever chrome'en og ikke bare altid matcher.
  const udenChrome = '<main id="hoved"><h1>x</h1></main>';
  ok('51.2.revert: en side uden chrome mangler daek__navn (proever regelens negativ)',
    !/class="daek__navn"/.test(udenChrome));
  ok('51.2.revert: en side uden chrome mangler daek__sprogkode',
    !/class="daek__sprogkode"/.test(udenChrome));

  /* --- 3. ingen falsk aria-current="page" --------------------------------- */
  for (const s of SPROG) {
    ok(`51.3.${s}: intet navigationspunkt er markeret som den aktuelle side`,
      !sider[s].includes('aria-current="page"'));
  }
  // REVERT-BEVIS: konstruerer en side, hvor "Oversigt" (forsiden) FEJLAGTIGT
  // er markeret som aktuel - reglen ovenfor skal kunne opdage den, ellers
  // beviser den negative paastand ingenting (den kunne vaere "always true").
  const medFalskAktiv = '<li><a href="../da/" aria-current="page">Oversigt</a></li>';
  ok('51.3.revert: den samme test FANGER en falsk aria-current="page", naar den er der',
    medFalskAktiv.includes('aria-current="page"'));

  /* --- 4. vej videre til kataloget, og linket rammer en rigtig fil --------
     spor/oversigt (1. sep 2026): kataloget flyttede til sprogroden, saa
     url.katalog (tools/build.mjs) og dermed dette link peger nu paa
     "../<sprog>/" i stedet for "../<sprog>/robotter/". */
  for (const s of SPROG) {
    const hoved = hovedAf(sider[s]);
    const m = hoved.match(/<a class="videre[^"]*" href="([^"]+)">/);
    ok(`51.4.${s}: <main> har et .videre-link (sitets eneste knapform) til kataloget`, !!m);
    if (m) {
      ok(`51.4.${s}: linket peger paa den rigtige mappe ("../${s}/")`,
        m[1] === `../${s}/`, `fandt "${m[1]}"`);
      const maal = path.join(dist, s, 'index.html');
      ok(`51.4.${s}: maalfilen findes rent faktisk i SAMME byg (${path.relative(rod, maal)})`,
        fs.existsSync(maal));
    }
  }
  // REVERT-BEVIS: et <main> uden noget .videre-link skal IKKE bestaa
  // matchet ovenfor - beviser, at "har et link" rent faktisk kraever ét.
  const udenKnap = '<main id="hoved"><h1>Siden findes ikke</h1><p>Ingen vej videre her.</p></main>';
  ok('51.4.revert: <main> uden .videre-link matcher IKKE knap-reglen',
    !hovedAf(udenKnap).match(/<a class="videre[^"]*" href="([^"]+)">/));

  /* --- 5. "404" alene er ikke et svar -------------------------------------
     De sprogspecifikke sider maa ikke noeje sig med tallet: forklaringen fra
     data/i18n/<sprog>.json skal staa i klartekst i <main>. */
  for (const s of SPROG) {
    const T = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', `${s}.json`), 'utf8'));
    const hoved = hovedAf(sider[s]);
    ok(`51.5.${s}: forklaringen staar i klartekst i <main> (ikke kun "404")`,
      hoved.includes(T.fejl404_forklaring));
  }
  // REVERT-BEVIS: en side, der KUN siger "404", bestaar ikke reglen ovenfor.
  const kunTal = '<main id="hoved"><h1>404</h1></main>';
  {
    const T = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'da.json'), 'utf8'));
    ok('51.5.revert: <main>404</main> alene matcher IKKE forklarings-reglen',
      !hovedAf(kunTal).includes(T.fejl404_forklaring));
  }

  /* --- 6. rod-siden: tosproget, selvbaerende, praecis én vej pr. sprog ---- */
  ok('51.6: rod-siden er noindex',
    /<meta name="robots" content="noindex">/.test(rodSide));
  ok('51.6: rod-siden bruger IKKE de sprogspecifikke chrome-klasser (den er selvbaerende)',
    !/class="daek__navn"/.test(rodSide) && !/class="daek__sprogkode"/.test(rodSide));

  const rodVeje = [...rodSide.matchAll(/<a class="f404-vej" href="([^"]+)" hreflang="([^"]+)" lang="([^"]+)">/g)];
  ok(`51.6: rod-siden har praecis ${SPROG.length} vej(e) ind, én pr. sprog`,
    rodVeje.length === SPROG.length, `fandt ${rodVeje.length}`);
  // spor/oversigt (1. sep 2026): kataloget flyttede til sprogroden, saa
  // renderRod()'s "vej ind" pr. sprog peger nu paa "<sprog>/" i stedet for
  // "<sprog>/robotter/" (tools/skabelon/fejl404.mjs).
  for (const s of SPROG) {
    const v = rodVeje.find((m) => m[2] === s);
    ok(`51.6.${s}: rod-vejen til ${s} har href/hreflang/lang sat konsistent`,
      !!v && v[1] === `${s}/` && v[3] === s,
      v ? `href="${v[1]}"` : 'vejen mangler');
    if (v) {
      const maal = path.join(dist, s, 'index.html');
      ok(`51.6.${s}: rod-vejens maal findes i SAMME byg (${path.relative(rod, maal)})`,
        fs.existsSync(maal));
    }
  }
  // REVERT-BEVIS: en syntetisk rod-side med kun ÉT sprogs vej (i stedet for
  // SPROG.length) skal IKKE bestaa taellingen ovenfor - proever, at 51.6 rent
  // faktisk ville fejle, hvis en fremtidig aendring tabte ét sprogs 404-vej.
  const rodMedKunEtSprog = `<a class="f404-vej" href="${SPROG[0]}/robotter/" `
    + `hreflang="${SPROG[0]}" lang="${SPROG[0]}">x</a>`;
  const vejeMedKunEtSprog = [...rodMedKunEtSprog.matchAll(/<a class="f404-vej" href="([^"]+)" hreflang="([^"]+)" lang="([^"]+)">/g)];
  ok('51.6.revert: en rod-side med kun ét sprogs vej matcher IKKE SPROG.length',
    vejeMedKunEtSprog.length !== SPROG.length,
    `fandt ${vejeMedKunEtSprog.length}, SPROG.length er ${SPROG.length} - de er ens, revert-beviset er tomt`);

  // Begge sprogs egne titler staar paa rod-siden (ikke kun ét sprogs, som ville
  // goere siden til en gaettekonkurrence for den forkerte halvdel af laeserne).
  for (const s of SPROG) {
    const T = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', `${s}.json`), 'utf8'));
    ok(`51.6.${s}: rod-sidens titel for ${s} staar i klartekst`,
      rodSide.includes(T.fejl404_titel));
  }

  /* --- 7. ingen koebsknap, ingen affiliate, ingen media/ (hard begraensning 1/mappestruktur) */
  for (const [navn, html] of [...Object.entries(sider).map(([s, h]) => [`${s}/404.html`, h]), ['404.html', rodSide]]) {
    ok(`51.7.${navn}: ingen koebsknap eller affiliate-link`,
      !/(affiliate|utm_|buy[-_ ]now|koeb nu)/i.test(html));
    ok(`51.7.${navn}: ingen henvisning til media/ (fabrikantmateriale maa aldrig i et byg)`,
      !/["'(/]media\//.test(html));
  }

  /* --- 8. sidetallet: netop tre NYE filer i forhold til foer dette spor ---
     04-byg-struktur.mjs's formel er den generelle vagt (den fejler, hvis
     antallet af 404-filer nogensinde afviger fra 2+SPROG.length ekstra sider).
     Her tuernes den samme kendsgerning igen, lokalt i denne fil, saa en
     laeser af "404-testen" ikke skal ind i en anden fil for at se den. */
  ok(`51.8: netop ${1 + SPROG.length} 404-filer i alt (1 rod + ${SPROG.length} sprog), `
    + `uafhaengigt af robotantallet (${fixtureRobotter.length} i fixturen)`,
    (fs.existsSync(rodFil) ? 1 : 0) + Object.keys(sider).length === 1 + SPROG.length);
}
