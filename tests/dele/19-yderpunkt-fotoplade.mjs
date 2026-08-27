/**
 * tests/dele/19-yderpunkt-fotoplade.mjs — forsidens yderpunkt-plader
 * (spor/plader, 27. aug 2026, L40's sidste punkt: "VITRINEs fire fotoplader
 * med ét stort tal hver", inden for INSTRUMENTs ramme).
 *
 * Vagten daekker de tre ting, briefet kraevede: fire plader paa BEGGE sprog,
 * hver med et kildemaerke, og D16-saetningen ("en robot i et yderpunkt er
 * ikke bedre, kun mere ekstrem") staaende paa den byggede side. Den roerer
 * IKKE ekstremer()-logikken (K5, side.mjs) - kun formen, de fire poster
 * vises i, jf. 10-forside-yderpunkter.mjs's egne K5/K6-vagter, som denne
 * fil ikke gentager.
 *
 * D16-saetningen laeses fra data/i18n/{da,en}.json's `yderpunkter_forklaring`
 * (ikke skrevet af i haanden her) - saa en fremtidig ordlydsaendring i
 * sprogfilen ikke stille goer denne vagt til en loegn om, hvad siden siger.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n19. Forsidens yderpunkt-fotoplader (spor/plader)');

  const ud = path.join(tmp, 'dist-yderpunkt-plade');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${ud}`],
    { cwd: rod, encoding: 'utf8' });
  ok('19.0: build.mjs (spor/plader-testbyg) giver exit 0', b.status === 0, (b.stderr || '').trim());

  const daJSON = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'da.json'), 'utf8'));
  const enJSON = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'en.json'), 'utf8'));

  /** Klip pladsholderen `{n}` ud af sprogstrengen, saa vi tjekker den
   *  LITERALE haenge-tekst (som ikke afhaenger af hvor mange kort der er
   *  udvalgt netop nu), ikke hele saetningen med et forkert taeller-tal. */
  const udenTaeller = (s) => s.replace('{n}', '').trim();

  const sprog = [
    { kode: 'da', d16: udenTaeller(daJSON.yderpunkter_forklaring) },
    { kode: 'en', d16: udenTaeller(enJSON.yderpunkter_forklaring) },
  ];

  for (const { kode, d16 } of sprog) {
    const html = fs.readFileSync(path.join(ud, kode, 'index.html'), 'utf8');
    const start = html.indexOf('yderpunkter-sektion');
    const slut = html.indexOf('</section>', start);
    ok(`19.1 (${kode}): yderpunkter-sektionen findes paa den byggede forside`, start !== -1 && slut !== -1);
    if (start === -1 || slut === -1) continue;
    const sektion = html.slice(start, slut);

    const antalPlader = (sektion.match(/<article class="yderpunkt">/g) || []).length;
    ok(`19.2 (${kode}): fire fotoplader paa forsiden`, antalPlader === 4, `fandt ${antalPlader}`);

    const antalKildemaerker = (sektion.match(/class="kildemaerke/g) || []).length;
    ok(`19.3 (${kode}): mindst fire kildemaerker (ét pr. plade, nogle baerer to)`,
      antalKildemaerker >= 4, `fandt ${antalKildemaerker}`);

    ok(`19.4 (${kode}): D16-saetningen ("ikke et udvalg og ikke en anbefaling") staar paa siden`,
      sektion.includes(d16), `ledte efter: "${d16}"`);
  }

  // 19.5: MOVENEW P1's egen advarselstekst (ikke kun den generiske
  // "lastbetingelse ikke oplyst") skal staa paa dens plade - beviser
  // forbehold-flettningen i forside.mjs' yderpunktHTML() rent faktisk virker,
  // ikke kun at NOGET forbeholdsmaerke findes. Teksten indeholder citationstegn
  // og "<="/">=", som HTML-escapes til &quot;/&lt;= paa siden - derfor
  // genbruges side.mjs's EGEN esc()-funktion her (importeret, ikke duplikeret),
  // saa testen sammenligner escaped mod escaped, ikke raa mod escaped.
  {
    const sideModul = await import(
      `file://${path.join(rod, 'tools', 'skabelon', 'side.mjs').replace(/\\/g, '/')}`);
    const robotYaml = fs.readFileSync(
      path.join(rod, 'data', 'robots', 'microrobotech-movenew-p1.yaml'), 'utf8');
    const advarselMatch = robotYaml.match(/driftstid:[\s\S]*?advarsel:\s*"((?:[^"\\]|\\.)*)"/);
    ok('19.5a: microrobotech-movenew-p1.yaml har stadig en advarsel paa driftstid (forudsaetning)',
      !!advarselMatch);
    if (advarselMatch) {
      // Et rent, citations-frit udsnit midt i teksten ("To lastbetingelser...")
      // - starten af den raa streng er selv omgivet af \"-tegn og ville kraeve
      // HTML-escaping foer sammenligning; dette udsnit er allerede rent.
      const raaAdvarsel = advarselMatch[1].replace(/\\"/g, '"');
      const udsnit = raaAdvarsel.slice(raaAdvarsel.indexOf('To lastbetingelser'), raaAdvarsel.indexOf('To lastbetingelser') + 40);
      const forventet = sideModul.esc(udsnit);
      const html = fs.readFileSync(path.join(ud, 'da', 'index.html'), 'utf8');
      const start = html.indexOf('yderpunkter-sektion');
      const slut = html.indexOf('</section>', start);
      const sektion = html.slice(start, slut);
      ok('19.5b: MOVENEW P1s egen advarselstekst (ikke kun "lastbetingelse ikke oplyst") staar paa pladen',
        udsnit.length > 0 && sektion.includes(forventet), `ledte efter: "${forventet}"`);
    }
  }
}
