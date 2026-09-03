/**
 * tests/dele/77-certfacet.mjs — L90's certificeringsfacet: fire maerker i ÉN
 * gruppe (spor/certfacet, 3. sep 2026, BRIEF-certfacet-2.md punkt 2).
 *
 * L90 (JPK, ordret): "VI ENIGE OM AT Certificeringer SAMLES UNDER ET
 * FILTERGRUPPE". Gruppen "ce" gaar fra tre CE-tilstande (L89) til FIRE
 * maerker - CE, FCC, UL, CCC - hvor et valg viser de robotter, hvor maerket
 * er OPLYST (STATUS.md Å154).
 *
 * DEN VIGTIGSTE PAASTAND HER er JPK's VAERN NUMMER 1, ordret fra Å154:
 * "UL og CCC viser 0 og skal staa der alligevel - et filtervalg, der
 * forsvinder ved nul, siger 'vi har ikke spurgt', naar sandheden er 'vi har
 * spurgt alle 77, og ingen oplyser det'". Det er haard begraensning 5 i ny
 * forklaedning: et taelleligt nul er ikke det samme som et fravaer, og en
 * facet, der skjuler sine tomme valg, lyver om, hvad der er undersoegt.
 *
 * FIXTUREN ER BEVIDST TRE ROBOTTER MED KENDTE, DOKUMENTEREDE TILSTANDE (fra
 * tests/eksempel-robotter/, ikke fra data/robots/): anybotics-anymal har
 * ce_oplyst: true (den ENESTE "ja" i fixturen), boston-dynamics-spot og
 * unitree-b2 har ce_oplyst: ikke_oplyst, og INGEN af de tre saetter
 * fcc/ul/ccc_oplyst eksplicit (skemaets standard er "ikke_oplyst"). Det
 * GARANTERER at FCC, UL og CCC alle staar paa praecis 0 af 3 - uafhaengigt
 * af hvad de 77 rigtige robotter maatte skifte til i fremtiden. Ville testen
 * i stedet laese den byggede dist/ (rigtig data), ville "UL/CCC = 0" vaere
 * en tilfaeldighed ved dagens datasaet og ikke et bevis for reglen.
 *
 * Bygger sin egen dist i tmp, jf. tests/LAESMIG.md: ingen del maa antage, at
 * en anden del har bygget noget foerst.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

/** Den byggede <style>-tekst i <head>. */
function genereretStil(html) {
  const i = html.indexOf('<style>');
  return i === -1 ? '' : html.slice(i + 7, html.indexOf('</style>', i));
}

/** Selve certificeringsgruppens <details>-blok, ikke CSS-selektorernes
 *  raa forekomst af samme streng (se 35-typeskilt-katalog.mjs' egen fejl,
 *  fanget under dette spors selv-efterproevning: html.indexOf paa raa tekst
 *  rammer <style>-blokken foerst, fordi filterreglerne ogsaa naevner
 *  data-facetgruppe="ce"). */
function ceGruppe(html) {
  const m = html.match(/<details\b[^>]*\bdata-facetgruppe="ce"[^>]*>/);
  if (!m) return null;
  const slut = html.indexOf('</details>', m.index);
  return html.slice(m.index, slut === -1 ? undefined : slut);
}

/** "0" eller "N" fra <input id="f-ce-<id>">'s <span class="antal__tal">. */
function antalFor(gruppe, id) {
  const i = gruppe.indexOf(`id="f-ce-${id}"`);
  if (i === -1) return null;
  const m = gruppe.slice(i, i + 400).match(/<span class="antal__tal">(\d+)<\/span>/);
  return m ? Number(m[1]) : null;
}

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  const fixture = path.join(tmp, 'fixture-certfacet');
  fs.rmSync(fixture, { recursive: true, force: true });
  fs.mkdirSync(fixture, { recursive: true });
  for (const f of ['anybotics-anymal.yaml', 'boston-dynamics-spot.yaml', 'unitree-b2.yaml']) {
    fs.copyFileSync(path.join(rod, 'tests', 'eksempel-robotter', f), path.join(fixture, f));
  }

  const dist = path.join(tmp, 'dist-certfacet');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'),
    `--data=${fixture}`, `--ud=${dist}`], { cwd: rod, encoding: 'utf8' });
  // Haard fejl, ikke en taellet paastand - et fejlet byg er et miljoenedbrud,
  // ikke et testresultat (samme valg som dele/76).
  if (b.status !== 0) {
    throw new Error(`certfacet-fixture: byg fejlede (exit ${b.status}) - ${(b.stderr || '').trim()}`);
  }

  console.log('\n77. L90: certificeringsfacetten "ce" - fire maerker, en gruppe (BRIEF-certfacet-2.md)');

  for (const sprog of ['da', 'en']) {
    const p = path.join(dist, sprog, 'index.html');
    const html = fs.readFileSync(p, 'utf8');
    const gruppe = ceGruppe(html);
    const stil = genereretStil(html);

    /* --- 77.1: PRAECIS fire valg, ikke "mindst tre" ---------------------- */
    const antalValg = gruppe ? (gruppe.match(/<input class="rk__felt f-ce" type="checkbox"/g) || []).length : 0;
    ok(`77.1.${sprog}: gruppen "ce" har PRAECIS fire valg`,
      gruppe !== null && antalValg === 4, `fandt ${antalValg}`);

    /* --- 77.2: hvert maerke kan vaelges og filtrerer paa OPLYST ---------- */
    /* Maalt to veje: (a) selve CSS-filtermekanikken findes for id'et, og
       (b) det byggede antal stemmer med fixturens kendte oplyst-tal - CE
       er den ENESTE "ja" af tre robotter (anymal), FCC/UL/CCC er 0 af 3,
       fordi ingen af de tre fixture-robotter saetter dem. Uden (b) kunne
       (a) vaere sand, mens facetten i virkeligheden talte den forkerte
       tilstand (fx "nej" i stedet for "oplyst"). */
    const forventet = { ce: 1, fcc: 0, ul: 0, ccc: 0 };
    for (const id of ['ce', 'fcc', 'ul', 'ccc']) {
      const virkerCss = new RegExp(
        `\\.styr:has\\(#f-ce-${id}:checked\\) \\.lag-ce\\[data-ce~="${id}"\\]`).test(stil);
      const antal = gruppe ? antalFor(gruppe, id) : null;
      ok(`77.2.${sprog}.${id}: maerket "${id}" filtrerer paa OPLYST (css: ${virkerCss}, antal: ${antal})`,
        virkerCss && antal === forventet[id],
        `forventede ${forventet[id]} (kun anymal har ce_oplyst=true; fcc/ul/ccc er usat = ikke_oplyst hos alle tre)`);
    }

    /* --- 77.3: JPK's VAERN NR. 1 - UL og CCC staar der ved 0 -------------- */
    ok(`77.3.${sprog}: UL og CCC staar i gruppen, selvom de matcher 0 af 3 robotter`,
      gruppe !== null && gruppe.includes('id="f-ce-ul"') && gruppe.includes('id="f-ce-ccc"')
        && antalFor(gruppe, 'ul') === 0 && antalFor(gruppe, 'ccc') === 0,
      'et filtervalg der forsvinder ved nul siger "vi har ikke spurgt" - sandheden er "vi har spurgt, og ingen oplyser det" (Å154)');

    // Revert-bevis: simulerer den FORKASTEDE adfaerd (skjul et maerke ved
    // nul-traeffere) ved at fjerne UL og CCC's raekker fra gruppen, og viser
    // at 77.1 og 77.3 begge falder roede paa den simulerede tekst.
    {
      const udenNul = gruppe
        .replace(/<div class="rk"><input class="rk__felt f-ce" type="checkbox" id="f-ce-ul"[\s\S]*?<\/div>/, '')
        .replace(/<div class="rk"><input class="rk__felt f-ce" type="checkbox" id="f-ce-ccc"[\s\S]*?<\/div>/, '');
      const antalUdenNul = (udenNul.match(/<input class="rk__felt f-ce" type="checkbox"/g) || []).length;
      ok(`77.3.${sprog}.revert: skjules UL/CCC (den forkastede "skjul ved nul"-adfaerd), falder BAADE 77.1 og 77.3`,
        antalUdenNul !== 4 && !udenNul.includes('id="f-ce-ul"') && !udenNul.includes('id="f-ce-ccc"'),
        `simuleret antal valg: ${antalUdenNul}`);
    }
  }

  fs.rmSync(fixture, { recursive: true, force: true });
  fs.rmSync(dist, { recursive: true, force: true });
}
