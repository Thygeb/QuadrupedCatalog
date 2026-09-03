/**
 * tests/dele/14-afslutning-oprydning.mjs — spor/indgang: L17-oprydningen (fire
 * doede i18n-noegler og deres doede CSS er vaek), hover/fokus-signalet paa
 * katalogkortene, og kildeformen (K9) naaet frem til sammenligningssiden.
 *
 * FJERNET (spor/oversigt, 1. sep 2026): "5b", forsidens afslutningssektion
 * (id="h-afslutning", udledte tal, ingen enkelt robot fremhaevet). Sektionen
 * hoerte til forside.mjs, som er slettet - se 5b's egen kommentar nedenfor.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { rens } from '../rens-css.mjs';

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n14. spor/indgang: doede i18n-noegler, hover-signal, kildeform');

  // --- 5a: L17-oprydningen. De fire doede noegler maa ikke vaere kommet
  // tilbage - hverken i sprogfilen eller (for formaal-gitter/-chip) i den
  // byggede CSS. Vender denne test rold, er det fordi nogen har genindfoert
  // doed kode, ikke fordi reglen selv skal aendres. ---
  const da = JSON.parse(fs.readFileSync(path.join(rod, 'data/i18n/da.json'), 'utf8'));
  const en = JSON.parse(fs.readFileSync(path.join(rod, 'data/i18n/en.json'), 'utf8'));
  const doedeNoegler = [
    'forside_filtre_etiket', 'forside_formaal_titel', 'forside_formaal_forklaring', 'soeg_kraever_js',
  ];
  for (const n of doedeNoegler) {
    ok(`5a: doed noegle "${n}" er ikke i da.json`, !(n in da));
    ok(`5a: doed noegle "${n}" er ikke i en.json`, !(n in en));
  }
  const generatorCss = fs.readFileSync(path.join(rod, 'assets/generator.css'), 'utf8');
  ok('5a: .formaal-gitter/-chip er vaek fra generator.css (klasserne rendredes 0 gange)',
    !/\.formaal-gitter|\.formaal-chip/.test(generatorCss));
  ok('1c: forside_soeg_etiket er omdoebt - katalog_soeg_etiket findes i stedet',
    'katalog_soeg_etiket' in da && 'katalog_soeg_etiket' in en && !('forside_soeg_etiket' in da));

  // Frisk, isoleret byg af den RIGTIGE data/robots/ til resten af blokken -
  // egen tmp-undermappe, roerer ikke de andre deles egne byg.
  const indgangDist = path.join(tmp, 'dist-spor-indgang');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${indgangDist}`],
    { cwd: rod, encoding: 'utf8' });
  ok('spor/indgang: byg af den rigtige data/robots/ giver exit 0', b.status === 0,
    (b.stderr || '').trim().split('\n').slice(-3).join(' / '));

  // --- 5b: FJERNET (spor/oversigt, 1. sep 2026). Afslutningssektionen
  // (id="h-afslutning") hoerte til forside.mjs, som JPK lod slette ordret
  // ("HELE oversigt-siden skal vaek", PUNKT 1) - kataloget, der overtog
  // adressen /<sprog>/, har ALDRIG haft denne sektion (katalog.mjs, uroert
  // af dette spor, har ingen id="h-afslutning" - maalt med grep foer denne
  // rettelse). Der er intet sted paa sitet at flytte paastanden hen til, saa
  // den er fjernet, ikke bare omskrevet - samme begrundelse som 10- og
  // 19-testfilerne, der er slettet helt i dette spor. ---
  const forsideDa = fs.readFileSync(path.join(indgangDist, 'da', 'index.html'), 'utf8');
  const forsideEn = fs.readFileSync(path.join(indgangDist, 'en', 'index.html'), 'utf8');

  /* --- 5c: hover-/fokussignalet findes i den byggede markup og CSS. ---
     VENDT 31. aug 2026 (spor/katalog, L56 punkt 7) og VENDT IGEN samme dag
     (spor/kort): kravet er, at et kort skal vise (mus OG tastatur), at det
     kan klikkes - beviset ligger i CSS-reglen, der daekker ALLE `.net .kort`,
     maalt nedenfor mod generator.css.

     VENDT EN TREDJE GANG (spor/oversigt, 1. sep 2026): denne vagts markup-led
     laeste FORSIDENS `.net net--fritstaaende` (forside.mjs), som er slettet
     (PUNKT 1). `forsideDa`/`forsideEn` er nu KATALOGETS eget dist/<sprog>/
     index.html - resultatgitteret dér staar i `<div class="net" id="alle">`
     (tools/skabelon/katalog.mjs, uroert af dette spor, maalt med grep foer
     denne rettelse), ikke i `.net--fritstaaende`. Markup-leddet maaler derfor
     kataloget i stedet, med samme krav: hvert kort ligger i `.net` og har et
     `.kort__navn a` at tegne understregningen paa. */
  const katalogKortDa = (forsideDa.match(/class="kort"/g) || []).length;
  const katalogKortEn = (forsideEn.match(/class="kort"/g) || []).length;
  for (const [sprog, html, antal] of [['da', forsideDa, katalogKortDa], ['en', forsideEn, katalogKortEn]]) {
    const iNet = /<div class="net" id="alle">/.test(html);
    const navnelink = (html.match(/class="kort__navn"><a href=/g) || []).length;
    ok(`5c: /${sprog}/ har ${antal} kort i .net#alle, hver med et .kort__navn-link at tegne signalet paa (${navnelink})`,
      antal > 0 && iNet && navnelink >= antal,
      `kort ${antal}, .net#alle ${iNet}, navnelinks ${navnelink}`);
  }
  const generatorCss5c = fs.readFileSync(path.join(indgangDist, 'generator.css'), 'utf8');
  // Rens FILEN, ikke moenstret (tests/rens-css.mjs, BRIEF-prodtest.md):
  // generator.css blev omformateret, og mellemrummene i
  // ".net .kort:hover .kort__navn a" og foer "{" knaekkede det gamle,
  // kompakte moenster.
  const generatorCss5cR = rens(generatorCss5c);
  ok('5c: katalogkortet har sit eget hover- OG fokussignal (understregning + fokusramme)',
    /\.net\.kort:hover\.kort__navna\{border-bottom-color/.test(generatorCss5cR)
      && /\.net\.kort:focus-within\{outline/.test(generatorCss5cR),
    'uden et af de to kan et katalogkort ikke ses som klikbart - hverken med mus eller tastatur');
  /* De to naeste vagter maaler DOED CSS pr. 31. aug 2026 (spor/kort).
     `.kort-invit` rendres ingen steder mere - vagten lige ovenfor kraever
     ligefrem, at den ikke goer - men reglerne staar stadig i system.css, fordi
     oprydningen rammer tre andre testfiler (16, 30, 31), som ogsaa haevder
     gammel kort-CSS. Fjernes reglerne, skal disse to vagter fjernes SAMMEN med
     dem; de er ikke et krav om, at baandet kommer tilbage. Maalt: 0 forekomster
     af class="kort-invit" i hele dist/. */
  const systemCss = fs.readFileSync(path.join(indgangDist, 'system.css'), 'utf8');
  ok('5c: CSS-en gemmer signalet bag :hover OG :focus-within (samme regel som fotografiets scale)',
    /\.kort:hover \.kort-invit,\.kort:focus-within \.kort-invit\{opacity:1\}/.test(systemCss));
  ok('5c: selve bevaegelsen (transform) er betinget af prefers-reduced-motion:no-preference',
    /@media \(prefers-reduced-motion:no-preference\)\{\s*\.kort-invit\{transform:translateY/.test(systemCss));

  // --- 5d: kildeformen (K9) er naaet frem til sammenligningssiden. ---
  const samlDa = fs.readFileSync(path.join(indgangDist, 'da', 'sammenligning', 'index.html'), 'utf8');
  const kildeformAntal = (samlDa.match(/Producenten skrev/g) || []).length;
  ok(`5d: "Producenten skrev" findes paa sammenligningssiden (${kildeformAntal} gang(e), var 0)`,
    kildeformAntal > 0);
}
