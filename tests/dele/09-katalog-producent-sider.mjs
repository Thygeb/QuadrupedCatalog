/**
 * tests/dele/09-katalog-producent-sider.mjs — to smaa visningsdetaljer, begge
 * paa en indekstype:
 *  - spor/kort: katalogkortets fodnote og EU/CE-maerke er vaek, og CE-saetningen
 *    (oprindeligt forsidens, L32) staar stadig med to udledte tal - siden
 *    spor/oversigt (1. sep 2026) slettede forsiden, maalt paa producentsiden,
 *    som er den eneste, der stadig baerer den (se 4c herunder).
 *  - K11+K12: producentoversigten har fire kolonner (ikke land+antal klistret
 *    sammen) - tre til og med spor/prodindeks (1. sep 2026), som lagde
 *    modelnavnene i en fjerde .prod-navne-celle - og dens beregnede
 *    fordelingssaetning matcher en uafhaengig optaelling af proevedatasaettet.
 *
 * Bygger sin egen kopi af tests/eksempel-robotter, uafhaengigt af de andre
 * dele, saa denne fil kan koeres og laeses for sig.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const {
    rod, tmp, node, ok, lasRobotter, skema,
  } = ctx;

  const fixtureMappe = path.join(rod, 'tests', 'eksempel-robotter');
  const dist = path.join(tmp, 'dist-katalog-producent');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'),
    `--data=${fixtureMappe}`, `--ud=${dist}`], { cwd: rod, encoding: 'utf8' });
  // IKKE en ok()-paastand: originalen genbrugte sektion 4's allerede-tjekkede
  // `dist` og talte derfor ikke dette byg som endnu et testresultat. Denne del
  // bygger sin egen (for at vaere uafhaengig af koersels-raekkefoelgen), men
  // for at "Tallene skal vaere fuldstaendig uaendret" (tests/LAESMIG.md) skal
  // holde, er dette en haard fejl-hvis-forkert, ikke endnu en taellet paastand.
  if (b.status !== 0) {
    throw new Error(`katalog/producent-fixture: byg af tests/eksempel-robotter fejlede (exit ${b.status}) - `
      + (b.stderr || '').trim());
  }

  console.log('\n10. spor/kort: fodnotesektion og EU/CE-maerke vaek fra katalogkort');
  {
    // spor/oversigt (1. sep 2026): kataloget flyttede til sprogroden, saa
    // "4a"/"4b" laeser i dag samme fil, ved dens nye adresse.
    const katalogDaKort = fs.readFileSync(path.join(dist, 'da', 'index.html'), 'utf8');

    ok('4a: et bygget katalogkort indeholder ingen kort-fod',
      !katalogDaKort.includes('kort-fod'));

    ok('4b: et bygget katalogkort indeholder intet EU/CE-maerke (klassen "eu eu--" er vaek)',
      !/class="eu eu--/.test(katalogDaKort) && !katalogDaKort.includes('eu-svar'));

    // L32 beskyttede oprindeligt FORSIDENS CE-taelling (hjaelp.ceTilstand via
    // forside.mjs). spor/oversigt slettede forside.mjs paa JPKs udtrykkelige
    // ordre ("HELE oversigt-siden skal vaek", PUNKT 1) - saetningens FORM
    // flyttede ALDRIG til kataloget (katalog.mjs har sine egne, andre
    // EU-noter: eu_pointe/filter_certificering_note, uroert af dette spor).
    // Den lever videre PRAECIS SOM FOER paa producentsiden alene
    // (producent.mjs' euSaetning(), en fil dette spor ikke maa roere,
    // genbruger bevidst SAMME i18n-noegler og CSS-klasser som forside.mjs
    // havde - se producent.mjs:194-197). Vagten flyttes derfor til at maale
    // DER i stedet for at blive slettet: L32s krav ("to udledte tal, ikke
    // haardkodede") staar stadig, blot paa den side, der rent faktisk baerer
    // det i dag.
    const producentMapper = fs.readdirSync(path.join(dist, 'da', 'producenter'), { withFileTypes: true })
      .filter((f) => f.isDirectory()).map((f) => f.name);
    ok('4c-forudsaetning: mindst én producentside er bygget til at maale L32 paa',
      producentMapper.length > 0, `fandt ${producentMapper.length} producentmapper`);
    const producentDa = producentMapper.length
      ? fs.readFileSync(path.join(dist, 'da', 'producenter', producentMapper[0], 'index.html'), 'utf8')
      : '';
    const ceMatch = producentDa.match(/<b class="eu-fund-tal">(\d+) af (\d+)<\/b>/);
    ok('4c: producentsidens CE-saetning findes og baerer to udledte tal (VAERN OM L32, flyttet fra forsiden)',
      !!ceMatch && Number.isInteger(Number(ceMatch[1])) && Number.isInteger(Number(ceMatch[2]))
      && Number(ceMatch[2]) > 0,
      ceMatch ? `fandt "${ceMatch[1]} af ${ceMatch[2]}"`
        : `ingen eu-fund-tal fundet paa producentsiden (${producentMapper[0] ?? 'ingen producent bygget'})`);
  }

  console.log('\nK11 + K12. Producentoversigten: fire kolonner + beregnet fordelingssaetning');
  {
    // IKKE producent.mjs's egne hjaelpefunktioner (landefordeling/producentSaetning),
    // saa testen er en uafhaengig efterregning af det byggede resultat, ikke et
    // ekko af samme kode.
    const fixtureRobotter = lasRobotter(fixtureMappe);
    const fixtureProducenter = new Set(fixtureRobotter.map((rb) => rb.producent));

    const prodIndeksDa = fs.readFileSync(path.join(dist, 'da', 'producenter', 'index.html'), 'utf8');
    const prodIndeksEn = fs.readFileSync(path.join(dist, 'en', 'producenter', 'index.html'), 'utf8');

    // K11: fire adskilte celler pr. raekke - IKKE land og modeltal klistret
    // sammen i én <dd>-streng ("Kina 13 modeller", saadan stod det foer punkt
    // 1). Fjerde celle (.prod-navne) kom med spor/prodindeks, 1. sep 2026 -
    // se tests/dele/49-producentindeks.mjs for selve modelkolonnens egne
    // paastande (kilde, rekkefoelge, "ikke oplyst"). Rulles aendringen
    // tilbage til .raekker/.raekke, forsvinder <table> og <td> helt, og
    // testen fejler paa antallet (0 != forventet).
    const trIAlt = (prodIndeksDa.match(/<tr>/g) || []).length;
    const tdAntal = (prodIndeksDa.match(/<td[ >]/g) || []).length;
    const figurTdAntal = (prodIndeksDa.match(/<td class="figur">/g) || []).length;
    const navneTdAntal = (prodIndeksDa.match(/<td class="prod-navne">/g) || []).length;
    const forventetRaekker = fixtureProducenter.size;
    ok(`K11: producentoversigten har ${forventetRaekker} datarækker med fire <td> hver, `
      + `modeltallet højrestillet med .figur, modelnavnene i en fjerde .prod-navne-celle `
      + `(fandt ${trIAlt - 1}/${forventetRaekker} <tr>, ${tdAntal}/${forventetRaekker * 4} <td>, `
      + `${figurTdAntal}/${forventetRaekker} <td class="figur">, `
      + `${navneTdAntal}/${forventetRaekker} <td class="prod-navne">)`,
      trIAlt - 1 === forventetRaekker && tdAntal === forventetRaekker * 4
      && figurTdAntal === forventetRaekker && navneTdAntal === forventetRaekker
      && /<th scope="col" class="figur">/.test(prodIndeksDa)
      && /<th scope="col" class="prod-navne">/.test(prodIndeksDa));

    // K12: den beregnede fordelingssaetning baerer TAL, der matcher en
    // UAFHAENGIG optaelling af proevedatasaettet (Set af producentnavne pr.
    // land, ikke summering af `antal`-feltet, som producent.mjs selv bruger) -
    // ikke konstanter, der bare tilfaeldigvis passer i dag. Rulles punkt 2
    // tilbage (saetningen fjernes, eller et tal haardkodes), fejler testen paa
    // enten fravaeret af klassen eller et forkert tal.
    const perLand = new Map();
    for (const rb of fixtureRobotter) {
      const land = rb.producentland;
      if (!land || skema.tilstandAf(land)) continue;
      const t = perLand.get(land) ?? { producenter: new Set(), modeller: 0 };
      t.producenter.add(rb.producent);
      t.modeller += 1;
      perLand.set(land, t);
    }
    let bedstLand = null; let bedstTal = null;
    for (const [land, t] of perLand) {
      const producenter = t.producenter.size;
      if (!bedstLand || producenter > bedstTal.producenter
        || (producenter === bedstTal.producenter && land.localeCompare(bedstLand, 'da') < 0)) {
        bedstLand = land; bedstTal = { producenter, modeller: t.modeller };
      }
    }
    const totalProducenter = fixtureProducenter.size;
    const totalModeller = fixtureRobotter.length;

    const forventetDa = `${bedstTal.producenter} af ${totalProducenter} producenter er fra ${bedstLand} `
      + `og står for ${bedstTal.modeller} af de ${totalModeller} modeller i kataloget.`;
    ok(`K12: fordelingssaetningen matcher en uafhaengig optaelling af proevedatasaettet ("${forventetDa}")`,
      prodIndeksDa.includes(forventetDa));

    // Samme paa /en/ - beviser at det er ÉN oversat skabelon, ikke to kopier
    // der kan skride fra hinanden (samme princip som dele/04-byg-struktur.mjs's
    // katalog-test).
    const landOversat = { Kina: 'China', Schweiz: 'Switzerland', USA: 'USA' };
    const bedstLandEn = landOversat[bedstLand] ?? bedstLand;
    const forventetEn = `${bedstTal.producenter} of ${totalProducenter} manufacturers are from ${bedstLandEn} `
      + `and account for ${bedstTal.modeller} of the ${totalModeller} models in the catalogue.`;
    ok(`K12: samme fordelingssaetning er oversat paa /en/ ("${forventetEn}")`,
      prodIndeksEn.includes(forventetEn));
  }
}
