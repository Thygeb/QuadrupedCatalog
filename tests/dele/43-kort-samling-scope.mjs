/**
 * tests/dele/43-kort-samling-scope.mjs — spor/oprydknap, 1. sep 2026.
 *
 * "Tilfoej til sammenligning"-knappen (samlknap() i side.mjs) staar paa
 * ALLE kort, fordi kort() er én delt funktion for kataloget og de
 * 50 producentsider. Maalt i browser (Playwright, 1. sep 2026) er knappen
 * KUN levende paa én af de to flader:
 *
 *   - kataloget   henter katalog.js  -> knappen virker (klik -> aria-pressed,
 *                                       localStorage)
 *   - producentsider henter INTET JavaScript -> `hidden` fjernes aldrig,
 *                                       knappen er doed markup for evigt
 *
 * FORSIDEN ER UDE af denne beskrivelse (spor/oversigt, 1. sep 2026, PUNKT 1):
 * forside.mjs er slettet paa JPKs udtrykkelige ordre, og kataloget overtog
 * dens adresse - "kataloget" og "forsiden" var to sider foer dette spor, de
 * er nu ÉN.
 *
 * spor/oprydknap gav derfor kort() en `samling`-parameter (std. true) og
 * satte den til false i producent.mjs' modelkort(), saa producentsiderne
 * ikke laengere skriver en knap, der aldrig kan blive levende. Denne del
 * efterproever SCOPET af den aendring, ikke selve P0 (som 41-samlknap.mjs
 * allerede daekker for de flader, der stadig har knappen):
 *
 *   1. Producentsider: NUL samlknapper, paa tvaers af alle 50 sider x 2 sprog.
 *   2. Kataloget: hvert kort har staerkt praecis én samlknap - fladen
 *      mistede ikke knappen ved en fejl i scopingen.
 *   3. Producentsiderne mistede KUN knappen, ikke resten af kortet: samme
 *      antal <article class="kort"> staar der stadig.
 *
 * Bygger sit eget dist i sin egen undermappe af ctx.tmp, jf. tests/LAESMIG.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n43. spor/oprydknap: samlknappens scope - vaek fra producentsider, uroert andre steder');

  const ud = path.join(tmp, 'dist-kort-samling-scope');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${ud}`],
    { cwd: rod, encoding: 'utf8' });
  ok('43: byg giver exit 0', b.status === 0, (b.stderr || '').slice(0, 400));

  const tael = (html, re) => (html.match(re) || []).length;
  // Kataloget har sin egen kopi af kortet (katalog.mjs:635, med vilje - se
  // dens kommentar) og giver de ni "seneste tilfoejet"-kort en EGEN klasse
  // (` kort--seneste`, tools/skabelon/katalog.mjs:668) for at kunne skelne
  // dem fra resultatgitterets 77 i tools/build.mjs' egen taelling. Begge
  // varianter skal med her, ellers fejler 43.2 paa katalogsiden med et
  // falsk 77-mod-86-mismatch, der intet siger om denne aendring.
  const KORT_RE = /<article class="kort(?: kort--seneste)?">/g;
  const KNAP_RE = /<button[^>]*class="kort__saml"[^>]*>/g;

  // Sti-formen er stabil (byg.mjs' egen struktur): dist/<sprog>/producenter/<slug>/index.html
  // og dist/<sprog>/index.html (katalogets liste - flyttet hertil fra
  // dist/<sprog>/robotter/index.html af spor/oversigt, 1. sep 2026, PUNKT 1).
  const alle = [];
  (function gaa(mappe) {
    for (const p of fs.readdirSync(mappe, { withFileTypes: true })) {
      const sti = path.join(mappe, p.name);
      if (p.isDirectory()) gaa(sti);
      else if (p.name.endsWith('.html')) alle.push(sti);
    }
  }(ud));

  const rel = (sti) => path.relative(ud, sti).split(path.sep).join('/');
  const producentSider = alle.filter((s) => /^(da|en)\/producenter\/[^/]+\/index\.html$/.test(rel(s)));
  // spor/oversigt (1. sep 2026, PUNKT 1): forsiden (forside.mjs) er slettet,
  // og kataloget overtog dens adresse - "katalog" og "forside" var to
  // sider foer dette spor, de er nu ÉN. `forsideSider` er derfor vaek;
  // katalogSider peger paa den nye, ene adresse.
  const katalogSider = alle.filter((s) => /^(da|en)\/index\.html$/.test(rel(s)));

  ok(`43.0: fandt producentsider (${producentSider.length})`, producentSider.length > 0);
  ok(`43.0: fandt katalogsider (${katalogSider.length})`, katalogSider.length === 2,
    katalogSider.map(rel).join(', '));

  /* --- 1. Producentsider: nul samlknapper --------------------------------- */
  let producentKnapper = 0;
  let producentKort = 0;
  const producentMedKnap = [];
  for (const sti of producentSider) {
    const html = fs.readFileSync(sti, 'utf8');
    const k = tael(html, KNAP_RE);
    producentKnapper += k;
    producentKort += tael(html, KORT_RE);
    if (k > 0) producentMedKnap.push(rel(sti));
  }
  ok(`43.1: producentsiderne har 0 samlknapper (fandt ${producentKnapper} paa tvaers af ${producentSider.length} sider)`,
    producentKnapper === 0, `sider med knap: ${producentMedKnap.slice(0, 5).join(', ')}`);

  /* --- 3. Producentsiderne mistede KUN knappen, ikke kortet ---------------
     Rammer scopingsfejlen "samling:false slog HELE kortet fra" i stedet for
     kun knappen - modeller() bygger stadig ét <article class="kort"> pr.
     model, saa tallet skal vaere det samme som antal modelkort i data. */
  ok(`43.3: producentsiderne har stadig kort (fandt ${producentKort} <article class="kort"> paa tvaers af ${producentSider.length} sider)`,
    producentKort > 0);

  /* --- 2. Kataloget: hvert kort har praecis én samlknap -------------------
     spor/oversigt (1. sep 2026): "forside" er fjernet fra denne liste - se
     noten ved katalogSider. */
  for (const [navn, sider] of [['katalog', katalogSider]]) {
    for (const sti of sider) {
      const html = fs.readFileSync(sti, 'utf8');
      const kort = tael(html, KORT_RE);
      const knapper = tael(html, KNAP_RE);
      ok(`43.2: ${navn} ${rel(sti)} - hvert kort (${kort}) har praecis én samlknap (${knapper})`,
        kort > 0 && kort === knapper, `kort=${kort}, knapper=${knapper}`);
    }
  }
}
