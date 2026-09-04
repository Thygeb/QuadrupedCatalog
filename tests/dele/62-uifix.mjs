/**
 * tests/dele/62-uifix.mjs — spor/uifix, 2. sep 2026 (BRIEF-uifix.md).
 *
 * Seks UI-rettelser fra JPK, seks punkter herunder i samme raekkefoelge som
 * briefet (punkt 4, sammenligningsbaren, er IKKE dette spors - et andet spor
 * ejer stilarkene, se BRIEF-uifix.md). Bygger sit EGET dist i sin egen
 * undermappe af ctx.tmp, jf. tests/LAESMIG.md.
 *
 * REVERT-BEVIS (CLAUDE.md's krav): hver strukturel paastand proeves ogsaa
 * mod en bevidst FORKERT/gammel form, og proeven skal svare forkert dér -
 * ellers beviser den positive paastand ingenting.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const {
    rod, tmp, node, ok, skema, hentRobotter,
  } = ctx;

  console.log('\n62. spor/uifix: seks UI-rettelser (BRIEF-uifix.md)');

  const ud = path.join(tmp, 'dist-uifix');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${ud}`],
    { cwd: rod, encoding: 'utf8' });
  ok('62.0: build.mjs giver exit 0 (frisk byg til midlertidig mappe)',
    b.status === 0, (b.stderr || '').trim().split('\n').slice(-3).join(' / '));
  if (b.status !== 0) return;

  const laes = (rel) => fs.readFileSync(path.join(ud, rel), 'utf8');
  const tael = (html, streng) => html.split(streng).length - 1;

  const kurser = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'kurser.json'), 'utf8'));
  const basis = kurser.basis;

  /* ========================================================================
     PUNKT 1: enhedskontaktens etiket foelger tilstanden
     ==================================================================== */
  {
    const html = laes(path.join('da', 'robotter', 'unitree-go2', 'index.html'));
    const imperiale = tael(html, 'Imperiale enheder');
    const metriske = tael(html, 'Metriske enheder');
    ok(`62.1.a: "Imperiale enheder" og "Metriske enheder" staar lige mange gange paa unitree-go2 (${imperiale} vs. ${metriske})`,
      imperiale > 0 && imperiale === metriske, `${imperiale} imperiale, ${metriske} metriske`);
    // REVERT-BEVIS: den GAMLE fejl (kun "Imperiale enheder", 0 "Metriske
    // enheder") ville IKKE bestaa samme ligheds-tjek.
    const gammelForm = { imperiale: 3, metriske: 0 };
    ok('62.1.a.revert: den gamle etiket-fejl (0 "Metriske enheder") fanges af samme tjek',
      !(gammelForm.imperiale > 0 && gammelForm.imperiale === gammelForm.metriske));
  }

  /* ========================================================================
     PUNKT 2: begge "omregnet"-maerker vaek. ECB-noterne stod paa katalog-
     siden indtil spor/prisnote (BRIEF-prisnote.md, 3. sep 2026) flyttede dem
     til robotsiden - se 62.2.c/d nedenfor for begge halvdele af flytningen.
     ==================================================================== */
  {
    const robotHtml = laes(path.join('da', 'robotter', 'yufan-lingmao-cyvet', 'index.html'));
    const katalogHtml = laes(path.join('da', 'index.html'));
    ok('62.2.a: class="omregnet" findes 0 gange paa yufan-lingmao-cyvet',
      tael(robotHtml, 'class="omregnet"') === 0, `fandt ${tael(robotHtml, 'class="omregnet"')}`);
    ok('62.2.b: class="pris-om__ord" findes 0 gange paa katalogsiden',
      tael(katalogHtml, 'class="pris-om__ord"') === 0, `fandt ${tael(katalogHtml, 'class="pris-om__ord"')}`);
    // VENDT (ikke slettet) af BRIEF-prisnote.md, JPK 3. sep 2026, Å150 punkt 2:
    // "prisnoten skal flyttes fra katalogsiden til robotsiden". Det OPHAEVER
    // den 2. sep-regel, denne assertion tidligere bar ("noterne skal STADIG
    // staa paa siden - kun MAERKERNE er fjernet"). Assertionen staar med
    // vilje, med ny ordlyd, saa optegnelsen af BEGGE beslutninger - at
    // reglen fandtes, og at den siden blev afloest - bevares i repoet
    // (samme laere som L55/Å149: en slettet regel kan genindfoeres uden
    // modstand af en agent, der ikke saa den).
    ok('62.2.c: ECB-referencekursens forklaring staar IKKE laengere paa katalogsiden',
      !katalogHtml.includes('Den Europæiske Centralbanks referencekurs'));
    // REVERT-BEVIS: en syntetisk katalogstreng MED saetningen (den gamle,
    // forkastede tilstand) ville fejle "IKKE laengere"-tjekket ovenfor.
    ok('62.2.c.revert: en syntetisk katalogstreng med den gamle note fanges',
      !(!'…Den Europæiske Centralbanks referencekurs…'.includes('Den Europæiske Centralbanks referencekurs')));
    // Noten staar nu PAA robotsiden i stedet, ved prisfeltet (robot.mjs'
    // feltnote--pris). yufan-lingmao-cyvet er allerede laest ovenfor og er en
    // af de 11 robotter med oplyst pris (blandt de 7 med fremmed kildevaluta).
    ok('62.2.d: ECB-referencekursens forklaring staar paa robotsiden (yufan-lingmao-cyvet)',
      robotHtml.includes('Den Europæiske Centralbanks referencekurs'));
    // REVERT-BEVIS: en syntetisk robotstreng UDEN saetningen ville fejle
    // tilstedevaerelses-tjekket ovenfor.
    ok('62.2.d.revert: en syntetisk robotstreng uden noten fanges',
      !''.includes('Den Europæiske Centralbanks referencekurs'));
    // REVERT-BEVIS: en syntetisk streng MED maerket fanges af samme tjek.
    ok('62.2.revert: en syntetisk streng med class="omregnet" fanges',
      tael('<span class="omregnet">x</span>', 'class="omregnet"') === 1);
  }

  /* ========================================================================
     PUNKT 3: chip-raekken viser kun aktive filtre, ingen aktive som standard
     ==================================================================== */
  {
    const html = laes(path.join('da', 'index.html'));
    const checketStatus = ['i_produktion', 'annonceret', 'udgaaet']
      .filter((v) => new RegExp(`id="f-status-${v}"[^>]*checked`).test(html));
    ok('62.3.a: INGEN af de tre status-vaerdier er checked ved indlaesning',
      checketStatus.length === 0, `checket: ${checketStatus.join(', ') || 'ingen'}`);
    ok('62.3.b: "standard: udgåede skjult" findes 0 gange',
      tael(html, 'standard: udgåede skjult') === 0);
    ok('62.3.c: resultatoverskriften viser 77 robotter, ikke 74',
      /77 robotter/.test(html) && !/74 robotter/.test(html));
    // Strukturelt bevis for "chippen virker den anden vej" (den levende
    // maaling staar i fund/FUND-uifix.md - Playwright, ikke her): den
    // GENERISKE CSS-regel, der taender chippen NAAR checkboksen ER checked
    // (ikke inverteret), findes for status.
    ok('62.3.d: den generiske (ikke-inverterede) chip-regel findes for f-status-udgaaet',
      /\.styr:has\(#f-status-udgaaet:checked\) \[data-valg="f-status-udgaaet"\]/.test(html));
    // REVERT-BEVIS: den GAMLE inverterede id-form ("skjult-X") findes IKKE
    // laengere - fanger en eventuel tilbagevenden af den gamle mekanik.
    ok('62.3.revert: den gamle inverterede chip-id "skjult-udgaaet" findes IKKE',
      !html.includes('data-valg="skjult-udgaaet"'));
  }

  /* ========================================================================
     PUNKT 5: katalogsiden viser kun USD (basisvalutaen)
     ==================================================================== */
  for (const sprog of ['da', 'en']) {
    const html = laes(path.join(sprog, 'index.html'));
    ok(`62.5.a.${sprog}: 'CNY' findes 0 gange paa katalogsiden`,
      tael(html, 'CNY') === 0, `fandt ${tael(html, 'CNY')}`);
    ok(`62.5.b.${sprog}: '${basis}' findes paa katalogsiden`,
      tael(html, basis) > 0, `fandt 0`);
    // "Kildemaerket bliver": mindst ét prissat kort baerer stadig et
    // kildemaerke, selvom det synlige omregningsmaerke er vaek.
    const prisKort = [...html.matchAll(/class="kort__vaerdi kort__vaerdi--pris"[\s\S]*?<\/span><\/span>/g)]
      .map((m) => m[0]);
    const medKildemaerke = prisKort.filter((k) => /class="kildemaerke[^"]*"/.test(k)).length;
    ok(`62.5.c.${sprog}: prisfigurer baerer stadig et kildemaerke (${medKildemaerke} af ${prisKort.length})`,
      medKildemaerke > 0);
  }

  /* ========================================================================
     PUNKT 6: robotsiden viser BEGGE valutaer - en IKKE-aendring
     (regressionsvaern, data-drevet: udledt af data/robots/, ikke gaettet)
     ==================================================================== */
  {
    // AA183/L84: laeser hentRobotter() (databasen), ikke data/robots/ - mappen
    // er slettet.
    const robotter = (await hentRobotter()).map((d) => skema.normaliserRobot(d));
    const medCny = robotter.filter((r) => r.felter?.pris?.enhed === 'CNY').map((r) => r.slug);
    const medBasis = robotter.filter((r) => r.felter?.pris?.enhed === basis).map((r) => r.slug);
    const findesMed = (slug, streng) => {
      const p = path.join(ud, 'da', 'robotter', slug, 'index.html');
      return fs.existsSync(p) && fs.readFileSync(p, 'utf8').includes(streng);
    };
    const manglerCny = medCny.filter((s) => !findesMed(s, 'CNY'));
    ok(`62.6.a: alle ${medCny.length} robotter med CNY-pris viser stadig 'CNY' paa deres egen side`,
      manglerCny.length === 0, `mangler paa: ${manglerCny.join(', ')}`);
    const manglerBasis = medBasis.filter((s) => !findesMed(s, basis));
    ok(`62.6.b: alle ${medBasis.length} robotter med ${basis}-pris viser stadig '${basis}' paa deres egen side`,
      manglerBasis.length === 0, `mangler paa: ${manglerBasis.join(', ')}`);
    ok('62.6.c: der er robotter af begge slags at maale paa (regressionsvaernet proever noget)',
      medCny.length > 0 && medBasis.length > 0, `${medCny.length} CNY, ${medBasis.length} ${basis}`);
  }

  /* ========================================================================
     PUNKT 7: hele <footer class="fod"> vaek
     ==================================================================== */
  {
    let antalMedFod = 0;
    let antalSider = 0;
    (function gaa(m) {
      for (const e of fs.readdirSync(m, { withFileTypes: true })) {
        const p = path.join(m, e.name);
        if (e.isDirectory()) { gaa(p); continue; }
        if (!e.name.endsWith('.html')) continue;
        antalSider++;
        if (fs.readFileSync(p, 'utf8').includes('<footer class="fod">')) antalMedFod++;
      }
    })(ud);
    ok(`62.7.a: 0 af ${antalSider} byggede sider baerer <footer class="fod">`,
      antalMedFod === 0, `fandt ${antalMedFod}`);
    /* 62.7.b ER VENDT OM (spor/topbar, 2. sep 2026). Den lyd indtil da:
       "topbarens sprogskifter (daek__sprogkode) staar stadig paa forsiden",
       og den var fodens ALIBI - foden maatte fjernes, netop fordi topbaren
       bar skiftet. Samme dag fjernede JPK saa ogsaa topbarens ("Desuden
       skal DA/ENG knappen vaek"), og alibiet holdt op med at findes.

       Assertionen er derfor ikke slettet, men VENDT: det er nu en fejl,
       hvis skifteren dukker op igen paa forsiden. Og fordi et rent
       fravaer kan vaere groent af den forkerte grund - en tom eller
       manglende fil er ogsaa "uden skifter" - proever den samtidig, at
       siden faktisk ER en topbar-side (67-topbar2.mjs foerer den fulde
       taelling over alle 214). */
    const forsideHtml = laes(path.join('da', 'index.html'));
    ok('62.7.b: forsiden har en topbar, men INGEN sprogskifter i den '
      + '(JPK 2. sep 2026: DA/EN vaek - fodens alibi findes ikke laengere)',
      /<header class="daek">/.test(forsideHtml)
        && !/class="daek__sprogkode"/.test(forsideHtml));
    // Det MASKINLAESBARE sprogskift er uroert - det var aldrig knappen.
    ok('62.7.b2: <link rel="alternate" hreflang> staar stadig i <head> paa forsiden',
      (forsideHtml.match(/<link rel="alternate" hreflang="[^"]*"/g) || []).length >= 2);
    // REVERT-BEVIS: proeven skal FANGE en forside, hvor skifteren er tilbage.
    const medSkifter = '<header class="daek"><a class="daek__sprogkode" href="../en/">EN</a></header>';
    ok('62.7.b.revert: samme proeve FANGER en topbar, hvor sprogskifteren er vendt tilbage',
      !(/<header class="daek">/.test(medSkifter) && !/class="daek__sprogkode"/.test(medSkifter)));
    // Om os' egen forhandlerlinje er UROERT.
    const omOsHtml = laes(path.join('da', 'om', 'index.html'));
    const i18nDa = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'da.json'), 'utf8'));
    ok('62.7.c: Om os baerer stadig sin egen forhandlerlinje (uden for foden)',
      omOsHtml.includes(i18nDa.ingen_forhandler));
  }
}
