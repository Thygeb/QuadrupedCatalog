/**
 * tests/dele/14-afslutning-oprydning.mjs — spor/indgang: L17-oprydningen (fire
 * doede i18n-noegler og deres doede CSS er vaek), forsidens afslutningssektion
 * (udledte tal, ingen enkelt robot fremhaevet), hover/fokus-signalet paa
 * katalogkortene, og kildeformen (K9) naaet frem til sammenligningssiden.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n14. spor/indgang: doede i18n-noegler, forsidens afslutning, hover-signal, kildeform');

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

  const robotter = ctx.lasRobotter(path.join(rod, 'data', 'robots'));
  const producentAntal = new Set(robotter.map((r) => r.producent)).size;

  // --- 5b: afslutningssektionen findes paa begge sprog og baerer UDLEDTE
  // tal (robotter.length/producenter.size), ikke haardkodede. ---
  const forsideDa = fs.readFileSync(path.join(indgangDist, 'da', 'index.html'), 'utf8');
  const forsideEn = fs.readFileSync(path.join(indgangDist, 'en', 'index.html'), 'utf8');
  ok('5b: afslutningssektionen findes paa /da/', /id="h-afslutning"/.test(forsideDa));
  ok('5b: afslutningssektionen findes paa /en/', /id="h-afslutning"/.test(forsideEn));
  ok(`5b: /da/'s afslutning baerer det udledte robotantal (${robotter.length})`,
    forsideDa.includes(`alle ${robotter.length} robotter`));
  ok(`5b: /da/'s afslutning baerer det udledte producentantal (${producentAntal})`,
    forsideDa.includes(`${producentAntal} producenter`));
  ok('5b: ingen enkelt robot er fremhaevet i afslutningen (intet <picture> i den sektion)',
    !/id="h-afslutning"[\s\S]*?<\/section>/.test(forsideDa)
    || !/<picture>/.test(forsideDa.match(/id="h-afslutning"[\s\S]*?<\/section>/)[0]));

  // --- 5c: hover-/fokussignalet findes i den byggede markup og CSS, begge sprog. ---
  const katalogDa = fs.readFileSync(path.join(indgangDist, 'da', 'robotter', 'index.html'), 'utf8');
  const katalogEn = fs.readFileSync(path.join(indgangDist, 'en', 'robotter', 'index.html'), 'utf8');
  const kortAntalDa = (katalogDa.match(/class="kort"/g) || []).length;
  const kortAntalEn = (katalogEn.match(/class="kort"/g) || []).length;
  const invitAntalDa = (katalogDa.match(/class="kort-invit"/g) || []).length;
  const invitAntalEn = (katalogEn.match(/class="kort-invit"/g) || []).length;
  ok(`5c: hvert korts hover-invitation staar paa /da/robotter/ (${invitAntalDa} af ${kortAntalDa} kort)`,
    invitAntalDa === kortAntalDa && kortAntalDa > 0);
  ok(`5c: hvert korts hover-invitation staar paa /en/robotter/ (${invitAntalEn} af ${kortAntalEn} kort)`,
    invitAntalEn === kortAntalEn && kortAntalEn > 0);
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
