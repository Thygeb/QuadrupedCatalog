/**
 * tests/dele/66-samlflade.mjs — spor/saml3, 2. sep 2026.
 *
 * JPK's to instrukser om sammenligningsfladen, laast paa FUNKTIONENS OUTPUT:
 *
 *   1. "Disse bokse der angiver felter oplyste skal ikke vaere der."
 *      -> `.saml-svar`-markoererne er vaek, MEN skaermlaeserens taelling
 *         ("N af 3 oplyst" i `.kunskaerm`) staar uroert.
 *   2. "Choose robot knappen skal vaek og der skal istedet vaere en under
 *      hver robot."
 *      -> sidens ene SSR-knap er vaek; hvert kolonnehoved baerer en knap, der
 *         fjerner NETOP SIN EGEN robot; invitationen tilbage til kataloget
 *         staar ÉN gang, kun naar der er en ledig plads.
 *
 * HVORFOR DEN IKKE MAA MAALE PAA `dist/` ALENE (samme graense som
 * tests/dele/38): matricen tegnes KLIENTSIDE. Et grep paa den byggede fil
 * giver 0 <button>, uanset om arbejdet er rigtigt eller ravruskende galt -
 * et kriterium, der giver samme tal uanset input, maaler ingenting.
 *
 * DEN EGENTLIGE FORSKEL FRA 38 er, at denne fil ogsaa UDFOERER klikket.
 * `tools/maal-tabelsemantik.mjs`' sandkasse har med vilje intet
 * `localStorage` (den maaler standardvalget), saa filen bygger sin egen
 * sandkasse ovenpaa dens eksporterede parser. Det er noedvendigt, fordi
 * fjern-knappens dyreste fejl netop IKKE kan ses paa markup'en:
 *
 *   Har laeseren ikke selv valgt noget, kommer udvalget fra `DATA.standard`,
 *   og lageret er TOMT. Gemmer klikket ikke den RESTERENDE liste, laeser
 *   naeste opdater() lageret, finder ingenting, falder tilbage til de samme
 *   tre - og knappen ser ud til ikke at goere noget. Markup'en ville vaere
 *   perfekt, og alle grep-kriterier groenne. Det er Aa121 punkt 1 i ny
 *   forklaedning, og 66.7-66.9 er det eneste, der fanger den.
 *
 * BEGGE RETNINGER BEVISES: blok 4 muterer kilden med vilje og kraever, at
 * maalingerne FALDER. Mutationen sker paa en streng i hukommelsen - ingen
 * fil roeres, intet skal ryddes op bagefter.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { parse, queryAll } from '../../tools/maal-tabelsemantik.mjs';

/**
 * Koerer assets/sammenligning.js mod en bygget side MED et localStorage-shim,
 * saa baade standardvalget, et gemt udvalg og selve klikket kan maales.
 * Giver beholderen tilbage, ikke kun HTML'en, saa klik kan udfoeres bagefter.
 */
function koerMedLager(sideHTML, scriptKilde, startLager) {
  const domRod = parse(sideHTML);
  const lager = { v: startLager === undefined ? null : startLager };
  const dokument = {
    documentElement: queryAll(domRod, 'html')[0] || null,
    referrer: '',
    getElementById: (id) => queryAll(domRod, `#${id}`)[0] || null,
    querySelector: (sel) => queryAll(domRod, sel)[0] || null,
    querySelectorAll: (sel) => queryAll(domRod, sel),
    createElement: () => ({ href: '', protocol: '', host: '', pathname: '' }),
  };
  const localStorage = {
    getItem: (k) => (k === 'quad-sammenligning' ? lager.v : null),
    setItem: (k, v) => { if (k === 'quad-sammenligning') lager.v = v; },
  };
  const sandkasse = {
    document: dokument,
    window: { Intl, localStorage, history: { back() {} } },
    Intl,
    console,
  };
  vm.createContext(sandkasse);
  vm.runInContext(scriptKilde, sandkasse, { filename: 'assets/sammenligning.js' });
  const beholder = dokument.querySelector('[data-saml-resultat]');
  return { beholder, lager, html: beholder ? beholder.innerHTML : '' };
}

/** Udfoerer et klik paa fjern-knappen for `slug`, som browseren ville. */
function klikFjern(beholder, slug) {
  const maal = { getAttribute: (k) => (k === 'data-saml-fjern' ? slug : null) };
  for (const fn of (beholder._listeners.click || [])) {
    fn.call(beholder, { target: maal, preventDefault() {} });
  }
  return beholder.innerHTML;
}

const fjernSlugs = (h) => [...h.matchAll(/data-saml-fjern="([^"]+)"/g)].map((m) => m[1]);
const antalInvit = (h) => (h.match(/data-saml-knap/g) || []).length;
const antalTaelling = (h) => (h.match(/<\/span><span class="kunskaerm">[^<]*<\/span><\/th>/g) || []).length;

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n66. spor/saml3: proeveboksene vaek, én fjern-knap pr. robotkolonne');

  // Egen, frisk dist - ingen anden del maa antages at have bygget noget.
  const ud = path.join(tmp, 'dist-samlflade');
  fs.rmSync(ud, { recursive: true, force: true });
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${ud}`],
    { cwd: rod, encoding: 'utf8' });
  ok('66.0: build.mjs giver exit 0 (frisk byg til egen midlertidig mappe)',
    b.status === 0, (b.stderr || '').trim().split('\n').slice(-3).join(' / '));
  if (b.status !== 0) return;

  const scriptKilde = fs.readFileSync(path.join(rod, 'assets', 'sammenligning.js'), 'utf8');

  for (const sprog of ['da', 'en']) {
    const sideHTML = fs.readFileSync(path.join(ud, sprog, 'sammenligning', 'index.html'), 'utf8');
    const start = koerMedLager(sideHTML, scriptKilde, null);
    const data = JSON.parse(
      sideHTML.match(/<script type="application\/json" id="sammenligning-data">([\s\S]*?)<\/script>/)[1],
    );
    const antalFelter = data.grupper.reduce((a, g) => a + g.felter.length, 0);

    /* --- 1. PUNKT 1: boksene vaek, taellingen tilbage --------------------- */

    // Bevidst bredt moenster: `saml-svar` daekker baade wrapperen og begge
    // markoer-klasser, saa kriteriet ogsaa faelder en delvis genindfoerelse.
    const bokse = (start.html.match(/saml-svar/g) || []).length;
    ok(`66.1.${sprog}: proeveboksene (.saml-svar*) tegnes ikke laengere`,
      bokse === 0, `fandt ${bokse}`);

    // Den anden halvdel, og den der goer 66.1 til en oprydning frem for en
    // tilgaengelighedsregression: markoerraekken bar aria-hidden, saa tallet
    // i .kunskaerm ER skaermlaeserens eneste udgave af oplysningen.
    const taellinger = antalTaelling(start.html);
    ok(`66.2.${sprog}: skaermlaeserens taelling staar for alle ${antalFelter} feltraekker`,
      taellinger === antalFelter, `fandt ${taellinger}`);

    /* --- 2. PUNKT 2: én knap pr. robotkolonne ---------------------------- */

    const slugs = fjernSlugs(start.html);
    ok(`66.3.${sprog}: hver af de ${data.standard.length} robotkolonner har sin egen fjern-knap`,
      slugs.length === data.standard.length, `fandt ${slugs.length}`);

    // DET, DER SKILLER LOESNINGEN FRA "tre kopier af det samme kataloglink"
    // (L73, og spor/saml2's "Tre identiske links til samme sted er stoej,
    // ikke betjening"): hver knap baerer SIN EGEN kolonnes slug. Var de tre
    // ens, ville 66.4 falde, uanset hvor rigtig markup'en ellers saa ud.
    ok(`66.4.${sprog}: de tre knapper peger paa TRE FORSKELLIGE robotter, i kolonnernes egen orden`,
      slugs.length === new Set(slugs).size && slugs.join(',') === data.standard.join(','),
      `knapper=[${slugs.join(', ')}] kolonner=[${data.standard.join(', ')}]`);

    // Tilgaengeligt navn: det korte ord er aria-hidden, saa navnet kommer fra
    // .kunskaerm og NAVNGIVER robotten. Tre knapper, der alle bare hed
    // "Fjern", ville vaere tre ens navne paa tre forskellige handlinger.
    const navne = data.standard.map((s) => (data.robotter.find((r) => r.slug === s) || {}).navn);
    const manglerNavn = navne.filter((n) => !start.html.includes(
      String(data.tekst.fjern_navn).replace('{navn}', n)));
    ok(`66.5.${sprog}: hver knaps tilgaengelige navn naevner sin robot ("${String(data.tekst.fjern_navn).replace('{navn}', navne[0])}")`,
      manglerNavn.length === 0, `manglede for: ${manglerNavn.join(', ')}`);

    // L73 staar: kataloghenvisningen er ÉN, ikke én pr. kolonne - og med tre
    // valgte robotter er der ingen ledig plads, saa den staar slet ikke.
    ok(`66.6.${sprog}: med ${data.maksAntal} af ${data.maksAntal} pladser fyldt staar der 0 kataloghenvisninger`,
      antalInvit(start.html) === 0, `fandt ${antalInvit(start.html)}`);

    /* --- 3. KLIKKET: virkningen, ikke kun markup'en ---------------------- */

    const fjernet = slugs[1];
    const efter = klikFjern(start.beholder, fjernet);
    const restSlugs = fjernSlugs(efter);

    ok(`66.7.${sprog}: klikket fjerner NETOP sin egen robot (${fjernet}), de OEvrige bliver`,
      !restSlugs.includes(fjernet) && restSlugs.length === slugs.length - 1
      && restSlugs.every((s) => slugs.includes(s)),
      `foer=[${slugs.join(', ')}] efter=[${restSlugs.join(', ')}]`);

    /* 66.8 er den, markup'en ikke kan bevise. Udgangspunktet var
       STANDARDVALGET, altsaa et TOMT lager. Gemmes den resterende liste
       ikke, laeser naeste opdater() lageret, finder ingenting og falder
       tilbage til de samme tre - klikket ville se ud til ikke at virke,
       mens hvert eneste grep-kriterium var groent. */
    let gemt = null;
    try { gemt = JSON.parse(start.lager.v); } catch { gemt = null; }
    ok(`66.8.${sprog}: resultatet er GEMT, ogsaa naar udgangspunktet var standardvalget`,
      Array.isArray(gemt) && gemt.join(',') === restSlugs.join(','),
      `lager=${start.lager.v}`);

    // Nu ER der en ledig plads - og saa, og kun saa, inviterer siden tilbage
    // til kataloget. Ét sted, aldrig én pr. besat kolonne.
    ok(`66.9.${sprog}: med en plads ledig staar der PRAECIS ÉN kataloghenvisning`,
      antalInvit(efter) === 1, `fandt ${antalInvit(efter)}`);
    ok(`66.9b.${sprog}: henvisningen peger paa kataloget (samme URL som siden selv baerer)`,
      efter.includes(`href="${data.katalogUrl}"`), `katalogUrl=${data.katalogUrl}`);

    // Ned til én robot: matricen kan ikke tegnes, men siden maa ikke blive en
    // blindgyde - invitationen bliver staaende ved siden af statuslinjen.
    const tilEn = klikFjern(start.beholder, restSlugs[0]);
    ok(`66.10.${sprog}: ned til én robot -> ingen matrix, men stadig en vej videre`,
      !/<table/.test(tilEn) && antalInvit(tilEn) === 1,
      `tabel=${/<table/.test(tilEn)}, invitationer=${antalInvit(tilEn)}`);
  }

  /* --- 4. MODBEVIS: maalingerne skal FALDE, naar arbejdet fjernes -------- */

  console.log('  modbevis — kriterierne skal falde, naar reglen fjernes');
  {
    const sideHTML = fs.readFileSync(path.join(ud, 'da', 'sammenligning', 'index.html'), 'utf8');

    /* 4a - fjern knappens handle fra kolonnehovedet. 66.3 skal gaa fra 3
       til 0.

       MUTATIONEN RAMMER `data-saml-fjern`, IKKE <button>-taggen, og det er
       en rettelse fra dette spors egen foerste udgave: den muterede
       `<button ... class="specimen__fjern nulstil"` vaek og lod attributten
       staa - saa maalingen fandt stadig sine tre, og 66.12 gik ROED paa et
       intakt arbejde. Modbeviset skal ramme praecis det, maalingen laeser;
       ellers maaler det sin egen mutation i stedet for reglen. */
    const udenKnap = scriptKilde.replace(/data-saml-fjern="/g, 'data-ingenting="');
    ok('66.11/modbevis: mutationen fjernede faktisk fjern-knappens handle fra kilden',
      udenKnap !== scriptKilde, 'ingen forekomst at erstatte - testen ville vaere tom');
    const muteret = fjernSlugs(koerMedLager(sideHTML, udenKnap, null).html).length;
    ok('66.12/modbevis: uden knappen falder antallet fra 3 til 0',
      muteret === 0, `fandt ${muteret}`);

    /* 4b - lad knappen staa, men lad klikket vaere om at GEMME. 66.3-66.7
       ville stadig vaere groenne (markup'en er uroert); det er praecis den
       tilstand, 66.8 findes for at fange, og den skal falde her. */
    const udenGem = scriptKilde.replace(/window\.localStorage\.setItem\(SAML_NOEGLE[^;]*;/,
      'void 0;');
    ok('66.13/modbevis: mutationen fjernede faktisk skrivningen fra kilden',
      udenGem !== scriptKilde, 'ingen forekomst at erstatte');
    const uden = koerMedLager(sideHTML, udenGem, null);
    const foerSlugs = fjernSlugs(uden.html);
    const efterUdenGem = klikFjern(uden.beholder, foerSlugs[1]);
    ok('66.14/modbevis: uden skrivningen falder robotten TILBAGE ind i matricen, og lageret er tomt',
      uden.lager.v === null && fjernSlugs(efterUdenGem).length === foerSlugs.length,
      `lager=${uden.lager.v}, efter=[${fjernSlugs(efterUdenGem).join(', ')}]`);

    // 4c - kontrol: den UROERTE kilde skal stadig maale rigtigt gennem SAMME
    // vej som mutationerne. Ellers kunne 4a/4b vaere faldet af en anden
    // grund end mutationen (fx en shim, der slet ikke koerer scriptet).
    const ren = koerMedLager(sideHTML, scriptKilde, null);
    ok('66.15/modbevis: samme vej med UROERT kilde giver 3 knapper, 0 bokse og en fuld taelling',
      fjernSlugs(ren.html).length === 3
      && (ren.html.match(/saml-svar/g) || []).length === 0
      && antalTaelling(ren.html) > 0,
      `knapper=${fjernSlugs(ren.html).length}, bokse=${(ren.html.match(/saml-svar/g) || []).length}, `
      + `taellinger=${antalTaelling(ren.html)}`);
  }

  fs.rmSync(ud, { recursive: true, force: true });
}
