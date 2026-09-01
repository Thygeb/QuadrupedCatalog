/**
 * tests/dele/49-producentindeks.mjs — spor/prodindeks, punkt 3 (1. sep 2026):
 * Antal-kolonnen paa producentindekset laeses fra p.antal og maa ALDRIG kunne
 * udledes af modelnavnenes liste. Det er CLAUDE.md's haarde begraensning 2 i
 * praksis — et tal paa siden skal have en kilde, og "listens laengde" er
 * ikke den kilde, Antal bruger.
 *
 * HVORFOR EN HAANDBYGGET ctx OG IKKE EN FIXTURE-BYGNING (som resten af
 * tests/dele/ bruger): maalt paa den rigtige pipeline (build.mjs linje
 * 227-232) saetter INTET producentobjekt nogensinde et eksplicit p.antal —
 * data/manufacturers/ er tom, saa renderIndeks() falder altid tilbage til
 * `p.robotter.length`, PRAECIS det array navnelisten ogsaa bygges af. Og
 * fordi R14 haandhaever, at hver robot har et slug, dropper
 * `modeller.filter(m => m && m.slug)` aldrig noget. De to tal kan derfor
 * IKKE divergere gennem en YAML-fixture i dag — en test, der proevede at
 * bygge en divergens via data/robots/, ville teste noget der ikke findes.
 * Testen kalder derfor renderIndeks() direkte med et ctx, hvor p.antal
 * EKSPLICIT er sat forskelligt fra robotter-listens laengde. Det er en
 * kontrakttest af selve skabelonfunktionen: den beviser, at koden LAESER
 * p.antal frem for at taelle listen — en garanti, der bliver vigtig den dag
 * data/manufacturers/ ikke laengere er tom.
 *
 * REVERT-BEVIST (efterproevet af agenten, ikke en del af selve koerslen):
 * aendres tools/skabelon/producent.mjs's `antal: p.antal ?? (...)` til at
 * praioritere listelaengden foerst (fx `(Array.isArray(p.modeller) ? ...) ??
 * p.antal`), bliver 49.1 rød — se commit-beskeden for den maalte koersel.
 *
 * 49.4 efterproever desuden REKKEFOELGEN (punkt 2): sorterModeller() skal
 * vise letteste foerst og ukendt vaegt sidst, samme akse som resten af
 * kataloget. Maalt paa de 25 rigtige producenter (ikke en del af denne
 * koersel, se rapporten): alle 25 producentraekker baerer modelnavne, og
 * alle 25 matcher raekkefoelgen paa producentens egen side.
 */
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

export default async function koer(ctx) {
  const {
    rod, tmp, node, ok,
  } = ctx;

  const producentUrl = `file://${path.join(rod, 'tools', 'skabelon', 'producent.mjs').replace(/\\/g, '/')}`;
  const sideUrl = `file://${path.join(rod, 'tools', 'skabelon', 'side.mjs').replace(/\\/g, '/')}`;
  const producentSkabelon = await import(producentUrl);
  const { lavSprog } = await import(sideUrl);
  const i18n = lavSprog('da');

  console.log('\n49. Producentindeksets Antal-kolonne: kilden er p.antal, aldrig navnelistens laengde');

  {
    // 49.1 + 49.2: en producent, hvor antal (999) og modellisten (2 navne)
    // FAKTISK afviger. Viser cellen 999, kommer tallet fra p.antal - viste
    // den 2, var den udledt af listen (netop det, mellemtilstanden haevdede
    // ikke kunne ske).
    const divergensCtx = {
      i18n,
      sprog: 'da',
      producenter: [{
        navn: 'Testfirma',
        slug: 'testfirma',
        land: 'Ukendtland',
        antal: 999,
        robotter: [
          { slug: 'model-a', navn: 'Model A' },
          { slug: 'model-b', navn: 'Model B' },
        ],
      }],
    };
    const html = producentSkabelon.renderIndeks(divergensCtx);
    const figurMatch = html.match(/<td class="figur">(\d+)<\/td>/);
    const navneMatch = html.match(/<td class="prod-navne">([\s\S]*?)<\/td>/);
    const navneAntal = navneMatch ? (navneMatch[1].match(/<a /g) || []).length : -1;

    ok('49.1: Antal-cellen viser p.antal (999), ikke robotter.length (2)',
      !!figurMatch && figurMatch[1] === '999',
      figurMatch ? `fandt "${figurMatch[1]}"` : 'ingen .figur-celle fundet i det byggede HTML');

    ok('49.2: modelkolonnen baerer stadig kun de 2 rigtige modellinks (beviser at de to '
      + 'tal FAKTISK afveg i denne fixture - uden dette ville 49.1 ikke vaere et bevis)',
      navneAntal === 2, `fandt ${navneAntal} modellinks`);
  }

  {
    // 49.3: p.antal === null (tallet ikke oplyst) skal give en TOM celle,
    // ikke "0" og ikke listelaengden - tre forskellige tilstande maa ikke
    // kollapse (haard begraensning 5).
    const nulCtx = {
      i18n,
      sprog: 'da',
      producenter: [{
        navn: 'Uoplystfirma', slug: 'uoplystfirma', land: 'Ukendtland', antal: null,
        robotter: [{ slug: 'x', navn: 'X' }],
      }],
    };
    const html = producentSkabelon.renderIndeks(nulCtx);
    const figurMatch = html.match(/<td class="figur">([\s\S]*?)<\/td>/);
    ok('49.3: p.antal === null giver en TOM Antal-celle, ikke "0" og ikke "1" '
      + '(begraensning 5: "ikke oplyst", "nej" og "0" er tre tilstande)',
      !!figurMatch && figurMatch[1] === '', figurMatch ? `fandt "${figurMatch[1]}"` : 'ingen .figur-celle fundet');
  }

  {
    // 49.4: rekkefoelgen (punkt 2) - letteste foerst, ukendt vaegt sidst,
    // samme akse producentsiden og forsiden bruger (sorterModeller()).
    const vaegtCtx = {
      i18n,
      sprog: 'da',
      producenter: [{
        navn: 'Vaegttest', slug: 'vaegttest', land: 'Danmark', antal: 3,
        robotter: [
          { slug: 'tung', navn: 'Tung', felter: { egenvaegt: { vaerdi: 80 } } },
          { slug: 'let', navn: 'Let', felter: { egenvaegt: { vaerdi: 10 } } },
          { slug: 'ukendt', navn: 'Ukendt', felter: { egenvaegt: 'ikke_oplyst' } },
        ],
      }],
    };
    const html = producentSkabelon.renderIndeks(vaegtCtx);
    const navneMatch = html.match(/<td class="prod-navne">([\s\S]*?)<\/td>/);
    const navne = navneMatch ? [...navneMatch[1].matchAll(/>([^<]+)<\/a>/g)].map((m) => m[1]) : [];
    ok('49.4: sorterModeller() i indeksets modelkolonne: letteste foerst (Let 10kg, Tung 80kg), '
      + 'ukendt vaegt sidst (Ukendt)',
      JSON.stringify(navne) === JSON.stringify(['Let', 'Tung', 'Ukendt']),
      `fandt raekkefoelgen ${JSON.stringify(navne)}`);
  }

  {
    // 49.5: integrationssmoke paa den rigtige fixture (tests/eksempel-robotter,
    // 3 producenter med hver 1 model) - hver raekkes modellinks-antal matcher
    // dens Antal-tal, saa den nye kolonne rent faktisk er koblet paa byg.mjs's
    // egen pipeline og ikke kun paa haandbyggede ctx'er ovenfor.
    const fixtureMappe = path.join(rod, 'tests', 'eksempel-robotter');
    const dist = path.join(tmp, 'dist-producentindeks');
    const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'),
      `--data=${fixtureMappe}`, `--ud=${dist}`], { cwd: rod, encoding: 'utf8' });
    if (b.status !== 0) {
      throw new Error(`producentindeks-fixture: byg fejlede (exit ${b.status}) - ${(b.stderr || '').trim()}`);
    }
    const html = fs.readFileSync(path.join(dist, 'da', 'producenter', 'index.html'), 'utf8');
    const theadMatch = html.match(/<thead>([\s\S]*?)<\/thead>/);
    const thAntal = theadMatch ? (theadMatch[1].match(/<th[ >]/g) || []).length : 0;
    ok('49.5a: producentindeksets <thead> har 4 kolonner, sidste med class="prod-navne"',
      thAntal === 4 && /<th scope="col" class="prod-navne">/.test(theadMatch ? theadMatch[1] : ''),
      `fandt ${thAntal} <th>`);

    const rows = [...html.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((m) => m[1]).filter((r) => r.includes('<td class="figur">'));
    let match = 0; let uoverens = 0;
    for (const r of rows) {
      const figurM = r.match(/<td class="figur">(\d+)<\/td>/);
      const navneM = r.match(/<td class="prod-navne">([\s\S]*?)<\/td>/);
      const antal = figurM ? Number(figurM[1]) : -1;
      const links = navneM ? (navneM[1].match(/<a /g) || []).length : -1;
      if (antal === links) match++; else uoverens++;
    }
    ok(`49.5b: alle ${rows.length} producentraekker i fixture-bygget: Antal og modellinks-antal er ens`,
      rows.length > 0 && uoverens === 0, `${match}/${rows.length} matcher, ${uoverens} uoverensstemmelser`);
  }
}
