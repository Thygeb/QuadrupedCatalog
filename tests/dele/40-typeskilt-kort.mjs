/**
 * tests/dele/40-typeskilt-kort.mjs — spor/kort, 31. aug 2026.
 *
 * TYPESKILT-kortets egen kontrakt paa producentsidernes modelliste (den
 * anden flade, der fik kortet i spor/kort: forsidens "Fra kataloget").
 *
 * FJERNET (spor/oversigt, 1. sep 2026, PUNKT 1, JPK ordret: "HELE
 * oversigt-siden skal vaek"): forsidens "Fra kataloget"-smagsproeve
 * (forside.mjs, dens `.net net--fritstaaende`-grid) er slettet. Kataloget
 * (katalog.mjs, uroert af dette spor) overtog adressen dist/<sprog>/
 * index.html, men er en ANDEN skabelon med sin egen struktur, ikke
 * forsidens - denne fils forside-specifikke paastande er derfor fjernet, jf.
 * samme begrundelse som de slettede 10- og 19-testfilerne. Producentfladen
 * er UROERT og staar tilbage som filens eneste flade.
 *
 * FORSKELLEN TIL 17-kortstribe-flader.mjs, saa de to ikke bliver den samme
 * test to gange: 17 sammenligner fladerne MED HINANDEN (skrider de fra
 * hinanden?). Denne fil holder kortet op mod DATAEN og mod beslutningen -
 * stemples de rigtige robotter, staar der intet andet paa kortet, og siger
 * legenden sandt om det, kortet faktisk viser?
 *
 * Den vigtigste vagt er statusstemplet, og den er bevidst datadrevet frem for
 * et haardkodet tal: stemplet skal sidde paa noejagtigt de robotter, hvis
 * status ikke er "i produktion" - hverken flere eller faerre. Maalt 31. aug
 * 2026: 68 i produktion, 6 annonceret, 3 udgaaet, altsaa 9 stempler. Vokser
 * kataloget, foelger vagten med, fordi den laeser robots.json og ikke tallet 9.
 *
 * Bygger sit eget dist i sin egen undermappe af ctx.tmp, jf. tests/LAESMIG.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

/** Alle kort paa én side, som {slug, stempel, blok}. */
function traekKort(html) {
  const ud = [];
  let fra = 0;
  for (;;) {
    const s = html.indexOf('<article class="kort', fra);
    if (s < 0) break;
    const e = html.indexOf('</article>', s);
    const blok = html.slice(s, e < 0 ? html.length : e);
    fra = (e < 0 ? html.length : e) + 10;

    const link = blok.match(/<h3 class="kort__navn"><a href="([^"]*)"/);
    const led = link ? link[1].split('/').filter((x) => x && x !== '..' && x !== '.') : [];
    const stempel = blok.match(/<span class="kort__mrk">([^<]*)<\/span>/);
    ud.push({
      slug: led.length ? led[led.length - 1] : null,
      stempel: stempel ? stempel[1] : null,
      blok,
    });
  }
  return ud;
}

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n40. spor/kort: TYPESKILT-kortet paa producentsiderne');

  const udMappe = path.join(tmp, 'dist-typeskilt-kort');
  fs.rmSync(udMappe, { recursive: true, force: true });
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${udMappe}`],
    { cwd: rod, encoding: 'utf8' });
  ok('build.mjs giver exit 0 (frisk byg til midlertidig mappe)',
    b.status === 0, (b.stdout || b.stderr || '').trim().split('\n').slice(-3).join(' / '));
  if (b.status !== 0) return;

  /* --- Dataen, vagterne holdes op mod ------------------------------------ */
  const robotJson = JSON.parse(fs.readFileSync(path.join(udMappe, 'robots.json'), 'utf8'));
  const robotter = robotJson.robotter;
  ok('robots.json har en robotter-liste at holde kortene op mod',
    Array.isArray(robotter) && robotter.length > 0,
    `top-noegler: ${Object.keys(robotJson).join(', ')}`);
  if (!Array.isArray(robotter)) return;
  const statusAf = new Map(robotter.map((r) => [r.slug, r.status]));
  const skalStemples = new Set(robotter.filter((r) => r.status !== 'i_produktion').map((r) => r.slug));
  ok(`robots.json giver ${robotter.length} robotter, heraf ${skalStemples.size} med en status, der skal stemples`,
    robotter.length > 0 && skalStemples.size > 0 && skalStemples.size < robotter.length,
    'er alle eller ingen robotter i produktion, kan stempelvagten nedenfor ikke bevise noget');

  /* --- CSS: den syntetiske skriftvaegt ------------------------------------ */
  const systemCss = fs.readFileSync(path.join(udMappe, 'system.css'), 'utf8');
  ok('system.css erklaerer ingen font-weight:800 - Saira selvhostes kun i 400/500/600/700',
    !/font-weight:800/.test(systemCss),
    'en vaegt, filerne ikke har, syntetiserer browseren ved at fortykke 700 - ujaevnt i store grader');
  ok('.t-hero staar paa 700, som der FINDES en fil til',
    /\.t-hero\{[^}]*font-weight:700\}/.test(systemCss));

  for (const sprog of ['da', 'en']) {
    const i18n = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', `${sprog}.json`), 'utf8'));

    /* ---------------------------------------------------- producentsiderne */
    const producentRod = path.join(udMappe, sprog, 'producenter');
    let producentKort = [];
    let producentSider = 0;
    let sidUdenNet = [];
    if (fs.existsSync(producentRod)) {
      for (const m of fs.readdirSync(producentRod, { withFileTypes: true })) {
        if (!m.isDirectory()) continue;
        const f = path.join(producentRod, m.name, 'index.html');
        if (!fs.existsSync(f)) continue;
        producentSider++;
        const html = fs.readFileSync(f, 'utf8');
        if (!/<div class="net net--fritstaaende">/.test(html)) sidUdenNet.push(m.name);
        producentKort = producentKort.concat(traekKort(html));
      }
    }
    ok(`${sprog}/producenter/: alle ${producentSider} modellister staar i .net net--fritstaaende`,
      producentSider > 0 && sidUdenNet.length === 0,
      sidUdenNet.length ? `uden: ${sidUdenNet.slice(0, 3).join(', ')}` : '');

    /* Hver robot skal staa paa praecis ét producentkort. Faerre betyder, at en
       model er faldet ud af sin producents liste; flere betyder en dublet. */
    const prSlug = new Map();
    for (const k of producentKort) prSlug.set(k.slug, (prSlug.get(k.slug) || 0) + 1);
    const dubletter = [...prSlug.entries()].filter(([, n]) => n > 1);
    const savnede = robotter.filter((r) => !prSlug.has(r.slug));
    ok(`${sprog}/producenter/: hver af de ${robotter.length} robotter staar paa praecis ét producentkort (${producentKort.length} kort)`,
      producentKort.length === robotter.length && dubletter.length === 0 && savnede.length === 0,
      `dubletter ${dubletter.length}, savnede ${savnede.length}`
      + (savnede.length ? ` (fx ${savnede[0].slug})` : ''));

    /* --- STATUSSTEMPLET, holdt op mod dataen ---------------------------- */
    const stemplede = new Set(producentKort.filter((k) => k.stempel).map((k) => k.slug));
    const forMeget = [...stemplede].filter((s) => !skalStemples.has(s));
    const forLidt = [...skalStemples].filter((s) => !stemplede.has(s));
    ok(`${sprog}/producenter/: stemplet sidder paa noejagtigt de ${skalStemples.size} robotter, der ikke er i produktion`,
      forMeget.length === 0 && forLidt.length === 0 && stemplede.size === skalStemples.size,
      `for mange: ${forMeget.slice(0, 3).join(', ') || 'ingen'} · for faa: ${forLidt.slice(0, 3).join(', ') || 'ingen'}`);

    /* Stemplets TEKST er robottens status paa sidens eget sprog - ikke en
       raa noegle og ikke "undefined". */
    const forkertTekst = producentKort.filter((k) => k.stempel
      && k.stempel !== i18n[`status_${statusAf.get(k.slug)}`]);
    ok(`${sprog}/producenter/: alle ${stemplede.size} stempler viser status oversat til ${sprog}`,
      forkertTekst.length === 0,
      forkertTekst.length ? `fx ${forkertTekst[0].slug}: "${forkertTekst[0].stempel}"` : '');

    /* --- "INTET ANDET" (MANIFEST Layouttesen) ----------------------------
       spor/oversigt (1. sep 2026): forsideKort er vaek sammen med forsiden -
       "alle" er nu praecis producentKort, ikke laengere to flader samlet. */
    const alle = [...producentKort];
    const FORBUDT = [
      ['den kompakte stribe', /<ul class="stribe/],
      ['anvendelsesmaerker', /<ul class="maerker">/],
      ['landeled', /<span class="land">/],
      ['statusled fra det gamle kort', /<span class="status status--/],
      ['hover-invitationen', /class="kort-invit"/],
      ['kildemaerke', /class="kildemaerke/],
    ];
    for (const [navn, m] of FORBUDT) {
      const traf = alle.filter((k) => m.test(k.blok));
      ok(`${sprog}: intet af de ${alle.length} kort baerer ${navn}`,
        traf.length === 0, traf.length ? `${traf.length} kort, fx ${traf[0].slug}` : '');
    }

    // "LEGENDEN maa ikke love noget, kortet ikke viser"-vagten er FJERNET
    // (spor/oversigt, 1. sep 2026): den proevede udelukkende forsiden
    // (`[['forside', forside]]` var altid ét-element-listen), og forsiden er
    // slettet. Der findes ingen producent-udgave af denne vagt at flytte den
    // til - se filens hoved-note.

    /* --- Skaermlaeserklassen hedder .kunskaerm, ikke .kun-skaerm ---------- */
    ok(`${sprog}: ingen af kortene bruger det forkerte klassenavn "kun-skaerm"`,
      !alle.some((k) => /kun-skaerm/.test(k.blok)),
      'compen bruger sit eget navn; kopieres det, staar skaermlaeserteksten synligt');
  }

  fs.rmSync(udMappe, { recursive: true, force: true });
}
