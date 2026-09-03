/**
 * 45-skala-og-kurs.mjs — nyttelast- og prisskalaen (L65c) og den omregnede
 * pris (L66). Bygget af spor/filter 1. sep 2026.
 * PUNKT 2/3 OMSKREVET af spor/uifix, 2. sep 2026 (BRIEF-uifix.md punkt 5,
 * "katalogsiden viser kun USD") - ikke slettet, jf. CLAUDE.md "ret
 * assertions, slet dem ikke". Se de to punkter nedenfor for den nye form.
 *
 * HVAD DELEN VOGTER, OG HVORFOR NETOP DET:
 *
 * 1. AT SKALAEN IKKE ER SIDENS ENESTE VEJ TIL AT FILTRERE (P0). JPK bad om en
 *    glidende slider; en slider er JavaScript. Filteret er derfor bygget i to
 *    oploesninger, og den grove - traerskler som afkrydsningsfelter i ren CSS -
 *    SKAL blive staaende. Den fejl, denne del findes for at fange, er den, hvor
 *    nogen "rydder op" i trinlisten, fordi slideren jo daekker den: siden ville
 *    se ens ud i enhver browser med JavaScript og tavst miste et filter i dem
 *    uden.
 *
 * 2. AT INTET KURSTAL STAAR I KODEN, OG AT KILDEN KAN NAAS (haard begraensning
 *    2). Kursen kommer fra data/kurser.json MED udgiver, URL og dato. FOER
 *    punkt 5 stod hvert enkelt kurstal (ogsaa CNY's) ordret paa katalogsiden;
 *    det goer det ikke laengere - originalvalutaen (og ethvert tal, der
 *    naevner den ved navn) er fjernet HELT fra katalogsiden, ikke kun dens
 *    maerke. Det, denne del stadig kraever paa KATALOGSIDEN, er derfor kun
 *    URL'en og datoen; de fulde kurstal med alle cifre staar fortsat i
 *    data/kurser.json og paa robottens EGEN side (BRIEF-uifix.md punkt 6,
 *    uroert af dette spor, ikke denne dels ansvar at proeve).
 *
 * 3. AT KATALOGSIDEN VISER PRISEN I ÉN VALUTA, IKKE TO (BRIEF-uifix.md punkt
 *    5, erstatter den gamle L60-praecedens for netop dette felt). JPK, ordret:
 *    "Katalogsiden [...] kun USD." Foer punkt 5 stod producentens eget beloeb
 *    uroert paa kortet med et synligt "≈"-omregningsmaerke ved siden af (L60's
 *    form, samme som imperial-omregningen); nu viser kortet KUN den omregnede
 *    USD-figur, for ALLE priser, uanset original valuta - og baerer INTET
 *    omregningsmaerke, fordi der intet sekundaert tal er at maerke. Kilde-
 *    maerket (bogstavet, ikke "≈"-badgen) staar stadig paa figuren - en
 *    bevidst afvigelse fra regel 3 ("en omregning har ingen selvstaendig
 *    kilde"), som briefet selv kraever ("kildemaerket bliver").
 *
 * 4. AT DE UOPLYSTE HAR EN EGEN, SYNLIG TILSTAND (haard begraensning 5). De 12
 *    uden nyttelast og de 66 uden pris hverken forsvinder tavst eller ser ud
 *    som om de baerer 0 kg / koster 0.
 *
 * Delen bygger sit EGET dist i ctx.tmp, jf. tests/LAESMIG.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

export default async function koer(ctx) {
  const { ok, rod, tmp, node } = ctx;

  const udMappe = path.join(tmp, 'dist-skala');
  execFileSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${udMappe}`], {
    cwd: rod, stdio: 'pipe',
  });

  const laes = (rel) => fs.readFileSync(path.join(udMappe, rel), 'utf8');

  /* ==================================================================
     1. KURSFILEN: intet tal uden kilde
     ================================================================== */
  const kursSti = path.join(rod, 'data', 'kurser.json');
  ok('45.1: data/kurser.json findes', fs.existsSync(kursSti),
    'kursen skal vaere DATA med kilde, ikke en konstant i en .mjs-fil');

  const kurser = JSON.parse(fs.readFileSync(kursSti, 'utf8'));
  ok('45.2: kursfilen navngiver sin basisvaluta',
    typeof kurser.basis === 'string' && kurser.basis.length === 3, String(kurser.basis));
  for (const felt of ['udgiver', 'navn', 'url', 'dato', 'hentet']) {
    ok(`45.3.${felt}: kilden oplyser "${felt}"`,
      typeof kurser.kilde?.[felt] === 'string' && kurser.kilde[felt].length > 0,
      'en kurs uden kilde er praecis det tal, haard begraensning 2 forbyder');
  }
  ok('45.4: kildens URL er en rigtig adresse, man kan slaa efter i',
    /^https:\/\/\S+\.\S+/.test(kurser.kilde.url), kurser.kilde.url);
  ok('45.5: kildens dato er en ISO-dato',
    /^\d{4}-\d{2}-\d{2}$/.test(kurser.kilde.dato), kurser.kilde.dato);
  ok('45.6: basisvalutaen har selv en kurs i filen',
    typeof kurser.per_euro?.[kurser.basis] === 'number' && kurser.per_euro[kurser.basis] > 0,
    'uden den kan ingen anden valuta regnes om til basis');
  // EUR er notationens nulpunkt (ECB noterer "enheder pr. 1 euro"), ikke en
  // maaling - derfor er praecis 1 det rigtige, og alt andet en fejl.
  ok('45.7: EUR staar som 1 (ECB\'s egen notation)', kurser.per_euro?.EUR === 1,
    String(kurser.per_euro?.EUR));

  /* ==================================================================
     2. SIDEN: kurs, dato og kilde skal kunne LAESES
     ================================================================== */
  // spor/oversigt (1. sep 2026): kataloget flyttede til sprogroden.
  for (const sprog of ['da', 'en']) {
    const html = laes(path.join(sprog, 'index.html'));
    // 45.8/45.10 laeser ROBOTSIDEN, ikke katalogsiden, siden BRIEF-prisnote.md
    // punkt 2 (JPK 3. sep 2026): prisnoten - og dermed kildepligten for
    // kurstallet - er flyttet fra katalogsidens filter/sortering til
    // robotsidens prisraekke (robot.mjs' feltnote--pris). Kravet selv staar
    // UAENDRET (haard begraensning 2: et kurstal uden vej til kilden er en
    // paastand), kun STEDET flytter. yufan-lingmao-cyvet er samme robot som
    // tests/dele/62-uifix.mjs' 62.2.c/d allerede bruger - en af de 11 med
    // oplyst pris (og en af de 7 med fremmed kildevaluta, saa den faktisk
    // omregnes).
    const robotHtml = laes(path.join(sprog, 'robotter', 'yufan-lingmao-cyvet', 'index.html'));

    ok(`45.8.${sprog}: kursens kilde staar som et link paa robotsiden`,
      robotHtml.includes(kurser.kilde.url),
      'et kurstal uden vej tilbage til kilden er en paastand, ikke en oplysning');

    /* 45.9 (kurstal med alle cifre) er FJERNET af BRIEF-uifix.md punkt 5,
       2. sep 2026, ikke svaekket: den proevede noejagtigt det, punkt 5
       forbyder. Et kurstal som CNY's "7,7922" navngiver sin valuta ved
       siden af (samme moenster som "1 EUR = X CNY") - og CNY maa ikke staa
       paa katalogsiden i NOGEN form, synlig eller skjult (acceptkriteriet
       er "grep -o 'CNY' ... 0" paa HELE filen). De fulde cifre findes
       stadig i data/kurser.json (45.1-45.7 ovenfor) og paa robottens egen
       side - ingen af dem er denne dels paastand. REVERT-BEVIS for selve
       forbuddet staar i 45.11 nedenfor.

       Datoen: kursen var sand ÉN dag, og laeseren skal kunne se hvilken.
       SKILLETEGNET ER SPROGETS, ikke vores: hjaelp.dformat() bruger sidens
       locale, saa dansk skriver 31.08.2026 og engelsk 31/08/2026. Foerste
       udgave af denne paastand kraevede punktummer og var derfor roed paa /en/
       for en dato, der stod paa siden hele tiden - maaleapparatet, ikke
       arbejdet. Derfor et moenster, der taaler begge skilletegn. */
    const [aar, maaned, dag] = kurser.kilde.dato.split('-');
    const datoMoenster = new RegExp(`${dag}[./-]${maaned}[./-]${aar}`);
    ok(`45.10.${sprog}: kursens dato staar paa robotsiden`,
      datoMoenster.test(robotHtml) || robotHtml.includes(kurser.kilde.dato),
      `hverken ${dag}.${maaned}.${aar}, ${dag}/${maaned}/${aar} eller ${kurser.kilde.dato} staar paa siden`);

    /* ==================================================================
       3. KATALOGSIDEN VISER PRISEN I ÉN VALUTA (BRIEF-uifix.md punkt 5)
       ================================================================== */
    // 45.11: den GAMLE synlige "≈ X USD"-badge (class="pris-om") findes
    // slet ikke laengere - der er intet sekundaert tal at maerke, naar
    // kortet kun viser ét. REVERT-BEVIS: samme optaelling FANGER en
    // syntetisk streng, der stadig baerer maerket.
    const maerker = (html.match(/class="pris-om"/g) || []).length;
    ok(`45.11.${sprog}: den gamle "pris-om"-badge findes IKKE laengere paa siden`,
      maerker === 0, `fandt ${maerker}`);
    ok(`45.11.revert.${sprog}: samme optaelling fanger en syntetisk "pris-om"-streng`,
      (('<span class="pris-om">'.match(/class="pris-om"/g) || []).length) === 1);

    /* 45.12/45.13: HVERT kort med en pris viser den i basisvalutaen (USD) -
       ingen undtagelser, og ingen anden 3-bogstavs valutakode staar noget
       sted i en pris-kortcelle. */
    const prisKort = [...html.matchAll(/class="kort__vaerdi kort__vaerdi--pris"[\s\S]*?<\/span><\/span>/g)]
      .map((m) => m[0]);
    ok(`45.12.${sprog}: der er prissatte kort at maale paa`,
      prisKort.length > 0, `${prisKort.length} kort`);
    let iBasis = 0;
    let andenValuta = 0;
    for (const k of prisKort) {
      const erBasis = new RegExp(`class="enhed">${kurser.basis}<`).test(k);
      if (erBasis) iBasis++;
      // ANY 3-bogstavs valutakode i cellen, der ikke ER basisvalutaen -
      // fanger baade "enhed"-feltet og enhver skjult tekst i samme celle.
      if (/class="enhed">(?!USD<)[A-Z]{3}</.test(k)) andenValuta++;
    }
    ok(`45.13.${sprog}: ALLE prissatte kort viser ${kurser.basis} (ingen anden valuta tilbage)`,
      iBasis === prisKort.length && andenValuta === 0,
      `${iBasis} af ${prisKort.length} i ${kurser.basis}, ${andenValuta} med en anden valutakode`);
    // REVERT-BEVIS: samme moenster FANGER en syntetisk celle med CNY.
    ok(`45.13.revert.${sprog}: samme moenster fanger en syntetisk celle med en anden valuta`,
      /class="enhed">(?!USD<)[A-Z]{3}</.test('<span class="enhed">CNY</span>'));

    /* 45.14: kildemaerket (bogstavet, ikke "≈"-badgen) staar STADIG paa
       prisfiguren - briefets eksplicitte krav ("kildemaerket bliver"), en
       bevidst afvigelse fra regel 3 for netop dette felt (se filhovedet). */
    let medKildemaerke = 0;
    for (const k of prisKort) if (/class="kildemaerke[^"]*"/.test(k)) medKildemaerke++;
    ok(`45.14.${sprog}: prisfiguren baerer stadig et kildemaerke paa alle kort med kilde`,
      medKildemaerke > 0, `${medKildemaerke} af ${prisKort.length}`);

    /* ==================================================================
       4. SKALAEN: to oploesninger, og den grove skal kunne staa alene
       ================================================================== */
    for (const navn of ['nyttelast', 'pris']) {
      const i = html.indexOf(`data-skala="${navn}"`);
      ok(`45.15.${sprog}.${navn}: skalaen findes`, i > 0);
      // RETTET spor/katalog2, 1. sep 2026 (punkt 4): skalaBlok() bygger nu
      // <details>/<summary> i stedet for <fieldset>/<legend> (JPK: "filter-
      // felterne skal vaere collapsed som default"). Klasserne (facet,
      // facet--skala osv.) er uaendrede - kun tagget skiftede - saa selve
      // udsnittet af blokken foelger med ved at soege det nye tag i stedet.
      const start = html.lastIndexOf('<details', i);
      const blok = html.slice(start, html.indexOf('</details>', i));

      /* P0: SLIDEREN STAAR `hidden` I HTML'EN. Uden JavaScript er et
         <input type=range> en kontrol, der ikke goer noget - og en kontrol,
         der ikke goer noget, er vaerre end ingen kontrol. */
      ok(`45.16.${sprog}.${navn}: skalaen staar hidden og taendes af scriptet`,
        /<div class="skala" hidden/.test(blok),
        'en synlig slider uden JavaScript lover en filtrering, siden ikke kan levere');

      /* P0: TRINNENE FINDES SOM RIGTIGE AFKRYDSNINGSFELTER. Det er dem, der
         baerer filteret, naar scriptet ikke koerer. */
      const trin = (blok.match(new RegExp(`class="rk__felt f-${navn}" type="checkbox"`, 'g')) || []).length;
      ok(`45.17.${sprog}.${navn}: der er trin at filtrere paa uden JavaScript`,
        trin >= 3, `${trin} afkrydsningsfelter`);

      /* Haard begraensning 5: de uoplyste har en EGEN raekke med eget maerke,
         og den staar UDEN FOR trinlisten, saa den ogsaa er der, naar slideren
         har overtaget. */
      const uoplystI = blok.indexOf(`id="f-${navn}-ikke_oplyst"`);
      ok(`45.18.${sprog}.${navn}: de uoplyste har deres egen raekke`,
        uoplystI > 0 && blok.includes('rk--uoplyst'),
        'ellers falder de tavst ud eller ser ud som om de er nul');
      const trinSlut = blok.indexOf('</div>', blok.indexOf('class="skala__trin"'));
      ok(`45.19.${sprog}.${navn}: den uoplyste raekke staar UDEN FOR trinlisten`,
        uoplystI > trinSlut,
        'inde i trinlisten ville den forsvinde sammen med trinnene, naar slideren taendes');

      /* Ridserne ER trinnene. Knuderne sendes med som data, saa katalog.js
         ikke skal baere en kopi af traerskellisten. */
      const knuder = (/data-skala-knuder="([^"]*)"/.exec(blok) || [])[1] || '';
      ok(`45.20.${sprog}.${navn}: knuderne sendes med fra bygget`,
        knuder.split(/\s+/).filter(Boolean).length >= 3, knuder);
      const ridser = (blok.match(/class="skala__ridse"/g) || []).length;
      ok(`45.21.${sprog}.${navn}: hver knude har sin ridse`,
        ridser === knuder.split(/\s+/).filter(Boolean).length,
        `${ridser} ridser mod ${knuder.split(/\s+/).filter(Boolean).length} knuder`);

      /* Tastatur: slideren er et rigtigt <input type=range>, ikke en div med
         museaflytning, og den har baade navn og en aflaeselig vaerdi. */
      ok(`45.22.${sprog}.${navn}: skalaen er et rigtigt range-felt med navn`,
        /<input class="skala__greb" type="range"/.test(blok)
          && /aria-label="[^"]+"/.test(blok) && /aria-valuetext="[^"]+"/.test(blok),
        'en div med museaflytning kan ikke betjenes med tastatur');
    }

    /* Kortene skal baere deres raa tal, ellers kan slideren kun ramme
       traersklerne og er ikke glidende. */
    const raaTal = (html.match(/data-nyttelast-tal="/g) || []).length;
    ok(`45.23.${sprog}: kortene baerer nyttelastens raa tal`, raaTal > 0,
      `${raaTal} kort - uden dem kan slideren ikke staa mellem to ridser`);
    // Og de uoplyste maa IKKE have attributten: fravaeret ER tilstanden.
    const kortIalt = (html.match(/<article class="kort">/g) || []).length;
    ok('45.24.' + sprog + ': de uoplyste har INGEN tal-attribut',
      raaTal < kortIalt,
      `${raaTal} af ${kortIalt} - staar de alle, er "ikke oplyst" blevet til et tal`);
  }

  /* ==================================================================
     5. KODEN: ingen kurs skrevet i hånden
     ================================================================== */
  const skabelon = fs.readFileSync(path.join(rod, 'tools', 'skabelon', 'katalog.mjs'), 'utf8');
  ok('45.25: katalog.mjs laeser kursen fra data, ikke fra en konstant',
    /kurser\.json/.test(skabelon),
    'en kurs i koden er et tal uden kilde');
  ok('45.26: prisen falder ikke tavst ud paa en ukendt valuta',
    /throw new Error\([^)]*kurser\.json/s.test(skabelon)
      || /kurser\.json[^;]*ikke har en kurs/s.test(skabelon),
    'en ny valuta uden kurs skal STOPPE bygget, ikke forsvinde fra filteret');

  const js = fs.readFileSync(path.join(rod, 'assets', 'katalog.js'), 'utf8');
  ok('45.27: katalog.js baerer ingen kopi af traerskellisten',
    !/\[\s*5\s*,\s*10\s*,\s*20\s*,\s*50\s*\]/.test(js),
    'to lister, der skal vaere ens, driver fra hinanden ved fjerde rettelse');
  ok('45.28: katalog.js overlader skalafacetterne til skalaen, ikke til passer()',
    /erSkala\(f\)/.test(js),
    'ellers filtrerer passer() og skalaen paa én gang med hver sin graense');
}
