/**
 * tests/dele/57-doed-css.mjs — spor/doedcss, 1. sep 2026.
 * Udvidet af spor/uifix, 2. sep 2026: 15 -> 16 (punkt 4) -> 18 (punkt 5)
 * -> 20 (punkt 7). AFKORTET af spor/saml3 samme dag: 20 -> 19 (punkt 8).
 *
 * Laaser resultatet af 66 -> 19 doede CSS-klasser. Skal FEJLE, hvis en
 * fjernet klasse (eller en helt ny, uafhaengig doed klasse) sniger sig ind
 * i assets/system.css eller assets/generator.css igen.
 *
 * DE 15 BESKYTTEDE undtagelser er IKKE et tilfaeldigt tal: hver er en klasse,
 * briefets egen definition ("0 i class="..." OG 0 i assets/*.js") fejlagtigt
 * klassificerede som doed, fordi definitionen ikke saa to ting - begge
 * MAALT under selv-kontrollen, se fund/FUND-doedcss.md for beviserne:
 *
 *   1. En klasse kan vaere REACHABLE via en LEVENDE, datastyret kode-sti,
 *      der bare ikke rammes af de nuvaerende 77 robotters data (endnu).
 *      billedmaerke/prik--klip (billede.delt_med), grund (billedledHTML(null)
 *      ved manglende laengde+hoejde), maerke--varianter (post.varianter).
 *   2. maal-doede-klasser.mjs' egen JS-detektor har en regex-bug: den
 *      kraever et citationstegn UMIDDELBART foer klassenavnet og misser
 *      derfor en modifier-klasse, der staar som klasse nr. TO i en
 *      class="a b"-streng. saml-fotofelt--uoplyst, saml-raekke--tavs og
 *      saml-svar__m--tavs konstrueres alle saadan i assets/sammenligning.js.
 *   3. En klasses CSS-tekst kan vaere LAAST af en anden, allerede-passerende
 *      test - fjernes reglen, skal netop DEN test rettes/fjernes MED den
 *      (samme princip som denne fil selv foelger). stribe--kompakt (test
 *      16 + 31), kort-navn/-krop/-hoved/-billed/-invit (test 14's 5c +
 *      test 16), filtre (test 31.8) og gitter (test 16) er alle laast saadan
 *      i FIRE testfiler, dette spor ikke ejer (CLAUDE.md, DIT FILEJERSKAB).
 *   4. pris-om__ord (spor/uifix, 2. sep 2026, BRIEF-uifix.md punkt 2): JPK
 *      bad om, at det synlige "omregnet"-ord paa katalogsidens priskort
 *      skulle vaek. tools/skabelon/katalog.mjs holdt op med at skrive
 *      class="pris-om__ord" (forklaringen lever videre i .kunskaerm) - men
 *      assets/system.css er UDEN FOR spor/uifix' filejerskab (CLAUDE.md,
 *      "Du maa ikke roere: assets/*.css"), saa CSS-reglen for klassen staar
 *      tilbage doed. Dette er en TILSIGTET foelge af en produktbeslutning,
 *      ikke en regression - modsat de tre punkter ovenfor er den ikke fundet
 *      via en detektor-svaghed, men skabt af selve rettelsen. Fjernes CSS-
 *      reglen i et senere spor med adgang til stilarkene, fjern klassen
 *      herfra i samme spor.
 *   5. pris-om, pris-om__tal (samme spor, BRIEF-uifix.md punkt 5, samme dag):
 *      "katalogsiden viser kun USD" gjorde HELE den omregnede-pris-badge
 *      paa kortet overfloedig, ikke kun dens ord - kortets prisfelt viser nu
 *      selve USD-tallet direkte (med kildemaerke, se katalog.mjs), saa der
 *      er intet sekundaert "≈ X USD"-tal tilbage at style. Samme graense som
 *      punkt 4: assets/system.css er uden for filejerskabet, saa de to
 *      CSS-regler staar doede tilbage af samme grund.
 *   6. fod, haard (samme spor, BRIEF-uifix.md punkt 7, samme dag): HELE
 *      <footer class="fod"> er fjernet fra tools/skabelon/side.mjs (JPK, i
 *      interview, med tabet forelagt). ".fod" var footerens egen ramme;
 *      ".haard" ("haard" formatering, IKKE det uroerte ".om-haard" paa Om
 *      os) var kun brugt paa footerens forhandler-linje. Samme graense
 *      igen: assets/system.css er uden for filejerskabet.
 *
 *   8. saml-svar__m--tavs er FJERNET fra listen (spor/saml3, 2. sep 2026,
 *      BRIEF-samlflade.md punkt 1). Den stod her af grund 2 ovenfor:
 *      detektorens regex missede den som klasse nr. TO i en class="a b".
 *      JPK bad om, at de grafiske svarbokse under feltnavnene skulle vaek -
 *      og modsat punkt 4-6 kunne DETTE spor roere stilarket
 *      (assets/generator.css er i dets filejerskab). `.saml-svar`,
 *      `.saml-svar__m` og `.saml-svar__m--tavs` er derfor fjernet fra CSS'en
 *      i SAMME commit som udsendelsen i assets/sammenligning.js. Klassen er
 *      altsaa ikke laengere DOED - den FINDES ikke, og en post om en klasse,
 *      der ikke findes, ville gOEre listen usand. Det er den oprydning,
 *      punkt 4's sidste saetning forudsaa ("Fjernes CSS-reglen i et senere
 *      spor med adgang til stilarkene, fjern klassen herfra i samme spor").
 *
 * Vagten er derfor IKKE "AEGTE DOEDE === 0" (briefets oprindelige, men
 * fejlagtige forudsaetning) - det er "AEGTE DOEDE er PRAECIS disse 20,
 * hverken flere eller faerre". Aendrer det sig, er det enten en regression
 * (en fjernet klasse er kommet tilbage - ROED, ret CSS'en) eller en bevidst
 * fremtidig oprydning af én af de 19 (ROED, ret DENNE liste MED sin kilde-
 * test i samme spor - se kommentaren ovenfor for hvilken).
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const BESKYTTET = [
  'billedmaerke', 'filtre', 'fod', 'gitter', 'grund', 'haard', 'kort-billed',
  'kort-hoved', 'kort-invit', 'kort-krop', 'kort-navn', 'maerke--varianter',
  'prik--klip', 'pris-om', 'pris-om__ord', 'pris-om__tal',
  'saml-fotofelt--uoplyst', 'saml-raekke--tavs',
  'stribe--kompakt',
].sort();

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n57. spor/doedcss: ingen doede CSS-klasser er kommet tilbage');

  // Egen, frisk dist - ingen anden del maa antages at have bygget den.
  const ud = path.join(tmp, 'dist-doed-css');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${ud}`],
    { cwd: rod, encoding: 'utf8' });
  ok('57.0: build.mjs giver exit 0 (frisk byg til midlertidig mappe)',
    b.status === 0, (b.stderr || '').trim().split('\n').slice(-3).join(' / '));
  if (b.status !== 0) return;

  // Samme metode som fund/maal-doede-klasser.mjs (klasser naevnt i CSS'ens
  // selektorer, klasser der staar i class="..." paa de byggede sider, og
  // klasser JS kan tilfoeje ved koersel) - genskrevet her, ikke importeret,
  // fordi fund/ ikke er dette spors filejerskab og ikke maa aendres til at
  // eksportere noget.
  const laes = (p) => fs.readFileSync(path.join(rod, p), 'utf8');
  const stilark = ['assets/system.css', 'assets/generator.css'];
  const iCss = new Set();
  for (const f of stilark) {
    const uden = laes(f).replace(/\/\*[\s\S]*?\*\//g, '');
    const sel = uden.split('}').map((del) => del.split('{')[0]).join(' ');
    for (const m of sel.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) iCss.add(m[1]);
  }

  const brugt = new Set();
  const gaa = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) gaa(p);
      else if (e.name.endsWith('.html')) {
        const html = fs.readFileSync(p, 'utf8');
        for (const m of html.matchAll(/class="([^"]*)"/g)) {
          for (const c of m[1].split(/\s+/)) if (c) brugt.add(c);
        }
      }
    }
  };
  gaa(ud);

  const js = fs.readdirSync(path.join(rod, 'assets'))
    .filter((f) => f.endsWith('.js'))
    .map((f) => laes('assets/' + f)).join('\n');

  const raaDoede = [...iCss].filter((c) => !brugt.has(c));
  const iJs = raaDoede.filter((c) => new RegExp(`['"\`]${c.replace(/-/g, '\\-')}['"\` ]`).test(js));
  const aegteDoede = raaDoede.filter((c) => !iJs.includes(c)).sort();

  ok(`57.1: aegte doede klasser er PRAECIS de ${BESKYTTET.length} kendte, beskyttede undtagelser (fandt ${aegteDoede.length}: ${aegteDoede.join(', ') || 'ingen'})`,
    aegteDoede.length === BESKYTTET.length && aegteDoede.every((c, i) => c === BESKYTTET[i]),
    `forventede praecis: ${BESKYTTET.join(', ')}`);
}
