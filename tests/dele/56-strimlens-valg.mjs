/**
 * tests/dele/56-strimlens-valg.mjs — spor/valgbar, 1. sep 2026.
 *
 * JPK, ordret: "SELECTED-baren viser DISCONTINUED HIDDEN selv om den ikke er
 * valgt. Baren skal KUN vise aktive filtre!"
 *
 * Mekanismen (fejljagt-skillens skridt 3-4, sporet baglaens fra symptomet):
 * Status-facetten har TRE mulige vaerdier, men kun TO af dem staar i
 * `status.standard` (i_produktion, annonceret er VIST som standard - deres
 * checkbokse er `checked` i den byggede HTML). Den tredje, "udgaaet", er
 * SKJULT som standard (ingen `checked`). Foer denne rettelse genererede
 * tools/skabelon/katalog.mjs én "skjult-X"-chip PR. VAERDI, uden at skelne:
 * for i_produktion/annonceret betyder "unchecked" en AKTIV afvigelse fra
 * standarden (et rigtigt brugervalg) - men for "udgaaet" betyder "unchecked"
 * netop STANDARDEN SELV, som ingen brugerhandling kan naa (den eneste vej
 * VAEK fra "unchecked" er at krydse af, og reglen viste chippen paa det
 * MODSATTE af det). Resultatet var en chip i en bar, der hedder "valgte
 * filtre", som stod der UDEN at nogen havde valgt noget.
 *
 * Rettelsen: katalog.mjs's to genereringssteder (chippens <li> i strimlen,
 * og dens :has()-regel i hovedStil()) springer nu vaerdier over, der IKKE er
 * i status.standard. Klassen "valg--standard" (den tidligere daempede,
 * "det er bare standarden"-stil) er fjernet helt fra de to tilbagevaerende
 * chips (i_produktion/annonceret) - naar de VISER sig, er de altid en
 * rigtig aktiv afvigelse og skal se ud som enhver anden valgt chip.
 *
 * "74 af 77" mister ikke sin forklaring: status-facettens <summary> baerer
 * allerede `f.mrk` (i18n-noeglen filter_status_mrk, "standard: udgaaede
 * skjult" / "default: discontinued hidden") - og et <summary>-element er
 * per HTML-spec ALTID synligt, ogsaa naar det omsluttende <details> er
 * sammenfoldet (facetgrupperne er sammenfoldet som standard, JPK 1. sep
 * 2026 punkt 4). Testen beviser det strukturelt: teksten ligger FOER det
 * lukkende </summary>-tag.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n56. spor/valgbar: SELECTED-baren viser kun aktive filtre, ikke standardtilstanden');

  const ud = path.join(tmp, 'dist-strimlens-valg');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${ud}`],
    { cwd: rod, encoding: 'utf8' });
  ok('56.0: byg giver exit 0', b.status === 0, (b.stderr || '').slice(0, 400));
  if (b.status !== 0) return;

  const laesHtml = (sprog) => fs.readFileSync(path.join(ud, sprog, 'robotter', 'index.html'), 'utf8');
  const i18nDa = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'da.json'), 'utf8'));
  const i18nEn = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'en.json'), 'utf8'));

  for (const [sprog, i18n] of [['da', i18nDa], ['en', i18nEn]]) {
    const html = laesHtml(sprog);

    /* ==================================================================
       PUNKT 1: "valg--standard" findes slet ikke laengere. Det er ikke nok
       at DAEMPE stilen paa en chip, ingen har valgt - den skal ikke staa i
       en bar, der hedder "valgte filtre", overhovedet.
       ================================================================== */
    const antalStandardKlasse = (html.match(/valg--standard/g) || []).length;
    ok(`56.1.${sprog}: klassen "valg--standard" findes 0 gange (fandt ${antalStandardKlasse})`,
      antalStandardKlasse === 0, html.match(/.{0,60}valg--standard.{0,60}/)?.[0]);

    /* ==================================================================
       PUNKT 2: den konkrete bug er vaek - hverken chippen for "udgaaet skjult"
       eller dens tilhoerende :has()-regel findes, i NOGEN form. Det er den
       vaerdi, JPK's skaermbillede viste (DISCONTINUED HIDDEN / UDGAAET SKJULT).
       ================================================================== */
    ok(`56.2.${sprog}: ingen <li> for "skjult-udgaaet" i strimlen`,
      !html.includes('data-valg="skjult-udgaaet"'));
    ok(`56.2b.${sprog}: ingen :has()-regel for "skjult-udgaaet"`,
      !html.includes('[data-valg="skjult-udgaaet"]'));

    /* ==================================================================
       PUNKT 3: brugerens EGNE valg forsvinder ikke sammen med standard-
       chippen. De to statusvaerdier, der ER vist som standard (i_produktion,
       annonceret), skal STADIG kunne blive til en aktiv chip, naar laeseren
       fjerner fluebenet - ellers er "genindsaet mekanik" en paastand uden
       daekning. Chippen skal baere almindelig "valg"-klasse (ikke den
       fjernede --standard-daempning), for naar den VISER sig, er den en
       rigtig valgt chip.
       ================================================================== */
    for (const v of ['i_produktion', 'annonceret']) {
      const liRegex = new RegExp(`<li class="valg" data-valg="skjult-${v}">`);
      ok(`56.3.${sprog}.${v}: <li class="valg" data-valg="skjult-${v}"> findes (ren "valg", ikke "valg--standard")`,
        liRegex.test(html));

      const regelRegex = new RegExp(
        `\\.styr:not\\(:has\\(#f-status-${v}:checked\\)\\) \\[data-valg="skjult-${v}"\\]\\{display:inline-flex\\}`,
      );
      ok(`56.3b.${sprog}.${v}: :has()-reglen der taender chippen naar #f-status-${v} IKKE er checked, findes`,
        regelRegex.test(html));

      // Modstykket: checkboksen ER checked som standard (I produktion/
      // Annonceret er vist i hvile) - saa "unchecked" faktisk KAN naas ved
      // en brugerhandling, i modsaetning til udgaaet.
      const checkedRegex = new RegExp(`id="f-status-${v}"[^>]*checked`);
      ok(`56.3c.${sprog}.${v}: #f-status-${v} ER checked i hvile (standard = vist)`,
        checkedRegex.test(html));
    }

    // Og modsat: "udgaaet" er IKKE checked i hvile - den eneste vej til
    // "unchecked" for den vaerdi ER hvile, aldrig en brugerhandling.
    const udgaaetCheckboks = html.match(/id="f-status-udgaaet"[^>]*>/)?.[0] || '';
    ok(`56.3d.${sprog}: #f-status-udgaaet er IKKE checked i hvile (standard = skjult)`,
      !udgaaetCheckboks.includes('checked'));

    /* ==================================================================
       PUNKT 4: "74 af 77" mister ikke sin forklaring. filter_status_mrk
       ("standard: udgaaede skjult" / "default: discontinued hidden") skal
       staa INDEN i <summary>, saa den er synlig, naar gruppen er
       sammenfoldet (HTML-spec: <summary> er altid synligt, resten af
       <details> er det ikke, naar `open` mangler).
       ================================================================== */
    const mrkTekst = i18n.filter_status_mrk;
    ok(`56.4.${sprog}: i18n-noeglen filter_status_mrk findes ("${mrkTekst}")`, !!mrkTekst);

    const detailsMatch = html.match(/<details[^>]*data-facetgruppe="status"[^>]*>([\s\S]*?)<\/summary>/);
    ok(`56.4b.${sprog}: <details data-facetgruppe="status"> findes`, !!detailsMatch);
    if (detailsMatch) {
      const summaryDel = detailsMatch[1];
      ok(`56.4c.${sprog}: "${mrkTekst}" staar INDEN i status-summary'en (synlig sammenfoldet)`,
        summaryDel.includes(mrkTekst));
    }

    // Selve <details>-elementet maa IKKE baere `open` - sammenfoldet er
    // standarden (JPK 1. sep 2026, punkt 4), og forklaringens synlighed
    // staar og falder med netop det.
    const detailsAaben = html.match(/<details[^>]*data-facetgruppe="status"[^>]*>/)?.[0] || '';
    ok(`56.4d.${sprog}: status-facetgruppen har IKKE "open" (er sammenfoldet, som resten)`,
      !/\bopen\b/.test(detailsAaben));

    /* ==================================================================
       PUNKT 5 (uaendret mekanik, kontrol): de andre facetters chips (ikke
       status) roeres slet ikke af denne rettelse - stikproeve paa vaegt.
       ================================================================== */
    ok(`56.5.${sprog}: en almindelig facets chip-mekanik (vaegt) staar uaendret`,
      /\.styr:has\(#f-vaegt-[^:]+:checked\) \[data-valg="f-vaegt-[^"]+"\]/.test(html));
  }

  const restTal = (laesHtml('da').match(/valg--standard/g) || []).length;
  console.log(`  info  56: ${restTal} forekomster af "valg--standard" i da/robotter/index.html (skal vaere 0)`);
}
