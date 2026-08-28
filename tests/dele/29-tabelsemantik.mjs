/**
 * tests/dele/29-tabelsemantik.mjs — Aa54: sammenligningsmatricen er en RIGTIG
 * tabel, og siden er ikke en tavs blindgyde uden JavaScript.
 *
 * HVORFOR DEN HER TEST IKKE MAA MAALE PAA `dist/`:
 * matricen tegnes KLIENTSIDE af assets/sammenligning.js' `tabelHTML()` og
 * staar derfor slet ikke i `dist/<sprog>/sammenligning/index.html`. Et
 * `grep` paa den byggede fil giver 0 `<table>` - uanset om semantikken er
 * rigtig eller ravruskende gal. Et kriterium, der giver samme tal uanset
 * input, maaler ingenting.
 *
 * Derfor importeres maaleapparatet fra `tools/maal-tabelsemantik.mjs`, som
 * koerer den RIGTIGE sammenligning.js i en `vm` mod en DOM-shim og laeser
 * `[data-saml-resultat]`s innerHTML - altsaa `tabelHTML()`s faktiske output.
 * Ét maaleapparat, to kaldere (kommandolinjen og denne test), saa maalingen
 * og testen ikke kan skride fra hinanden.
 *
 * BEGGE RETNINGER BEVISES. En groen test beviser ingenting alene, saa
 * blok 4 muterer kilden med vilje (fjerner scope="col", og goer <table> til
 * <div>) og kraever, at maalingen SO FALDER. Muteringen sker paa en STRENG i
 * hukommelsen - ingen fil roeres, intet skal ryddes op bagefter.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { kaldTabelHTML, taelSemantik, maal } from '../../tools/maal-tabelsemantik.mjs';

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n29. Aa54: tabelsemantik i sammenligningsmatricen + noscript-udvejen');

  const dist = path.join(tmp, 'dist-tabelsemantik');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${dist}`],
    { cwd: rod, encoding: 'utf8' });
  ok('29: byg af hele kataloget giver exit 0', b.status === 0, (b.stderr || '').trim());

  /* --- 1. Selve tabelsemantikken, paa begge sprog ------------------------ */

  for (const sprog of ['da', 'en']) {
    const m = maal({ rod, distMappe: dist, sprog });

    ok(`29/${sprog}: tabelHTML() udsender praecis én <table>`,
      m.table === 1, `table=${m.table}`);

    ok(`29/${sprog}: tabellen har præcis én <caption>`,
      m.caption === 1, `caption=${m.caption}`);

    // Captionen skal NAVNGIVE tabellen, ikke bare findes. Uden id'et og
    // <table aria-labelledby> kan caption->navn-relationen falde bort, naar
    // display aendres paa tabelelementet.
    ok(`29/${sprog}: <caption> har et id, som <table aria-labelledby> peger paa`,
      !!m.captionId && m.tabelHTML.includes(`aria-labelledby="${m.captionId}"`),
      `captionId=${m.captionId}`);

    // Captionen skal naevne de robotter, der faktisk staar i tabellen -
    // ellers er den en tom etikette.
    const navne = [...m.tabelHTML.matchAll(/<span class="specimen__navn">([^<]*)</g)].map((t) => t[1]);
    ok(`29/${sprog}: captionteksten naevner hver af de ${m.antalRobotter} valgte robotter`,
      navne.length === m.antalRobotter && navne.every((n) => n && m.captionTekst.includes(n)),
      `caption="${m.captionTekst}" · navne i hovedet: ${navne.join(' | ')}`);

    // Kernen: hver vaerdi skal kunne knyttes til BAADE sin robot (scope=col)
    // og sit felt (scope=row). Tallene er UDLEDT af datablokken, ikke
    // haardkodet - vokser kataloget eller skemaet, foelger kravet med.
    ok(`29/${sprog}: <th scope="col"> = antal valgte robotter (${m.antalRobotter})`,
      m.thScopeCol === m.antalRobotter, `thScopeCol=${m.thScopeCol}`);

    ok(`29/${sprog}: <th scope="row"> = antal felter (${m.antalFelter})`,
      m.thScopeRow === m.antalFelter, `thScopeRow=${m.thScopeRow}`);

    // Gruppetitlen gaelder netop raekkerne i SIN <tbody> - det er praecis
    // hvad rowgroup-scope betyder, og der skal vaere én pr. gruppe.
    const antalGrupper = m.tbody;
    ok(`29/${sprog}: <th scope="rowgroup"> = antal <tbody>-grupper (${antalGrupper})`,
      m.thScopeRowgroup === antalGrupper && antalGrupper > 0,
      `thScopeRowgroup=${m.thScopeRowgroup}, tbody=${m.tbody}`);

    // Hver vaerdicelle skal vaere et <td>. Er ÉN af dem et <div>, staar den
    // vaerdi uden for tabellen, og skaermlaeseren kan ikke naa den via
    // raekke/kolonne.
    ok(`29/${sprog}: alle ${m.vaerdiceller} vaerdiceller er <td> (ikke <div>)`,
      m.celleTags.length === 1 && m.celleTags[0] === 'td' && m.vaerdiceller > 0,
      `tegnet som: ${m.celleTags.join(', ') || 'ingen'}`);

    ok(`29/${sprog}: ingen vaerdi (.v) staar uden for en <td>/<th>`,
      m.vUdenforCelle === 0, `vUdenforCelle=${m.vUdenforCelle}`);

    ok(`29/${sprog}: hvert direkte barn af en <tr> er <td> eller <th>`,
      m.trBoernFejl.length === 0, m.trBoernFejl.join(', '));

    // Raekketallet skal HAENGE SAMMEN: ét hoved + én titel pr. gruppe + én
    // pr. felt. Rammer det ikke, er hoved og krop ude af trit, og hver
    // vaerdi ville blive laest op under den forkerte robot.
    const ventetTr = 1 + antalGrupper + m.antalFelter;
    ok(`29/${sprog}: <tr> = 1 hoved + ${antalGrupper} gruppetitler + ${m.antalFelter} feltraekker = ${ventetTr}`,
      m.tr === ventetTr, `tr=${m.tr}`);

    // Hoved og krop skal have samme antal spalter: hjoerne + N kolonne-
    // overskrifter, og pr. feltraekke ét feltnavn + N vaerdier.
    const ventetTd = 1 + m.antalRobotter * m.antalFelter;
    ok(`29/${sprog}: <td> = 1 hjoernecelle + ${m.antalRobotter}x${m.antalFelter} vaerdier = ${ventetTd}`,
      m.td === ventetTd, `td=${m.td}`);
  }

  /* --- 2. <noscript>-udvejen (punkt 3) ---------------------------------- */

  for (const sprog of ['da', 'en']) {
    const html = fs.readFileSync(path.join(dist, sprog, 'sammenligning', 'index.html'), 'utf8');
    const antalNoscript = (html.match(/<noscript/g) || []).length;

    ok(`29/${sprog}: sammenligningssiden har mindst én <noscript>`,
      antalNoscript >= 1, `noscript=${antalNoscript}`);

    // En besked uden en vej videre er stadig en blindgyde. Katalogsiden er
    // det eneste sted, tal kan sammenlignes uden JavaScript, saa beskeden
    // skal pege DERHEN - ikke bare konstatere, at noget ikke virker.
    const blok = html.slice(html.indexOf('<noscript'), html.indexOf('</noscript>'));
    ok(`29/${sprog}: <noscript>-beskeden linker til katalogsiden`,
      blok.includes(`${sprog}/robotter/`), blok.replace(/\s+/g, ' ').trim());
  }

  /* --- 3. Skabelonen maa ikke miste caption-noeglen --------------------- */

  for (const sprog of ['da', 'en']) {
    const html = fs.readFileSync(path.join(dist, sprog, 'sammenligning', 'index.html'), 'utf8');
    const m = html.match(/<script type="application\/json" id="sammenligning-data">([\s\S]*?)<\/script>/);
    const data = m ? JSON.parse(m[1]) : null;
    ok(`29/${sprog}: datablokken baerer tekst.tabel_caption med pladsholderen {robotter}`,
      !!data && typeof data.tekst.tabel_caption === 'string'
        && data.tekst.tabel_caption.includes('{robotter}')
        && !data.tekst.tabel_caption.includes('«'),
      `tabel_caption=${data && JSON.stringify(data.tekst.tabel_caption)}`);
  }

  /* --- 4. MODBEVIS: maalingen skal FALDE, naar semantikken fjernes ------ */

  const sideHTML = fs.readFileSync(path.join(dist, 'da', 'sammenligning', 'index.html'), 'utf8');
  const kilde = fs.readFileSync(path.join(rod, 'assets', 'sammenligning.js'), 'utf8');

  // 4a - fjern scope="col". Kriteriet i blok 1 skal gaa fra opfyldt til brudt.
  const udenScopeCol = kilde.replace(/ scope="col"/g, '');
  ok('29/modbevis: mutationen fjernede faktisk scope="col" fra kilden',
    udenScopeCol !== kilde, 'ingen forekomst at fjerne - testen ville vaere tom');

  const r1 = kaldTabelHTML(sideHTML, udenScopeCol);
  const mBrudt = taelSemantik(r1.tabelHTML, r1.data);
  ok('29/modbevis: uden scope="col" falder th[scope=col] til 0, og kriteriet brydes',
    mBrudt.thScopeCol === 0 && mBrudt.thScopeCol !== mBrudt.antalRobotter,
    `thScopeCol=${mBrudt.thScopeCol}, ventet af kriteriet=${mBrudt.antalRobotter}`);

  // 4b - goer <table> til <div>. Tabelkriteriet skal falde med.
  const udenTable = kilde.replace('<table class="saml-matrix"', '<div class="saml-matrix"');
  ok('29/modbevis: mutationen erstattede faktisk <table>-taggen',
    udenTable !== kilde, 'ingen forekomst at erstatte');

  const r2 = kaldTabelHTML(sideHTML, udenTable);
  const mBrudt2 = taelSemantik(r2.tabelHTML, r2.data);
  ok('29/modbevis: uden <table> falder tabelkriteriet til 0',
    mBrudt2.table === 0, `table=${mBrudt2.table}`);

  // 4c - kontrol: den URORTE kilde skal stadig maale rigtigt gennem SAMME
  // vej som mutationerne. Ellers kunne 4a/4b vaere faldet af en anden grund
  // end mutationen (fx en shim, der ikke koerer scriptet overhovedet).
  const rRen = kaldTabelHTML(sideHTML, kilde);
  const mRen = taelSemantik(rRen.tabelHTML, rRen.data);
  ok('29/modbevis: samme vej med UROERT kilde giver stadig fuld semantik',
    mRen.table === 1 && mRen.thScopeCol === mRen.antalRobotter && mRen.thScopeRow === mRen.antalFelter,
    `table=${mRen.table}, thScopeCol=${mRen.thScopeCol}/${mRen.antalRobotter}, thScopeRow=${mRen.thScopeRow}/${mRen.antalFelter}`);
}
