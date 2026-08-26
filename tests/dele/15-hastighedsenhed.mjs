/**
 * tests/dele/15-hastighedsenhed.mjs — spor/hastighed (26. aug 2026): kanonisk
 * visningsenhed for hastighed vendes fra m/s til km/h (L41).
 *
 * Flyttet ind fra den selvstaendige tests/nyt-hastighed.mjs (spor/testfold,
 * 26. aug 2026) — den fil blev skrevet, mens et andet spor delte
 * tests/koer.mjs op og ikke maatte roere den. Se tests/LAESMIG.md.
 *
 * Testen beviser tre ting, og de er ikke det samme:
 *   1. at kanonisk enhed faktisk er 'km/h' (ikke bare at koden LIGNER det)
 *   2. at de fire poster, der i forvejen staar i km/t/km/h hos producenten,
 *      IKKE regnes om — de er allerede maalt, og en omregning ville risikere
 *      at introducere flydende-komma-stoej, hvor der ingen behoever vaere
 *   3. at en m/s-native post (unitree-a1) regnes praecist om, uden
 *      flydende-komma-stoej (11.88, ikke 11.879999999999999 eller 11.880001)
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const {
    rod, tmp, node, ok, skema, yaml,
  } = ctx;

  console.log('\n15. spor/hastighed: kanonisk visningsenhed km/h (L41)');

  console.log('  15.1 Kanonisk visningsenhed for hastighed er km/h');
  ok('KANONISK_VISNINGSENHED.hastighed === "km/h"',
    skema.KANONISK_VISNINGSENHED.hastighed === 'km/h',
    `fik "${skema.KANONISK_VISNINGSENHED.hastighed}"`);

  console.log('  15.2 En post der allerede staar i km/h roeres slet ikke');
  {
    const post = { vaerdi: 15, enhed: 'km/h', kilde: 'https://example.com/x', hentet: '2026-08-19' };
    const ny = skema.visningsPost('hastighed', post);
    ok('samme objekt-reference (ingen omregning udfoert)', ny === post);
    ok('vaerdi uaendret (15)', ny.vaerdi === 15, `fik ${ny.vaerdi}`);
    ok('ingen _kildeform tilfoejet (der skete ingen omregning)', ny._kildeform === undefined);
  }

  console.log('  15.3 m/s -> km/h regnes praecist om (unitree-a1s egen post: 3.3 m/s)');
  {
    // Producentens eget forbehold paa unitree.com/A1 skriver selv "11.88km/h"
    // ved siden af "3.3m/s" — det er krydstjekket, briefet peger paa.
    const post = { vaerdi: 3.3, enhed: 'm/s', kilde: 'https://www.unitree.com/A1', hentet: '2026-08-19' };
    const ny = skema.visningsPost('hastighed', post);
    ok('ny post, ikke samme reference (der skete en omregning)', ny !== post);
    ok('enhed er km/h', ny.enhed === 'km/h', `fik ${ny.enhed}`);
    ok('vaerdi er PRAECIS 11.88 — ikke 11.879999999999999 eller 11.880001',
      ny.vaerdi === 11.88, `fik ${ny.vaerdi}`);
    ok('_kildeform baerer producentens egen figur ("3.3 m/s")',
      ny._kildeform === '3.3 m/s', `fik "${ny._kildeform}"`);
  }

  console.log('  15.4 Interval-poster (min/maks) regnes ogsaa om, praecist');
  {
    // Opdigtet interval til at bevise at min/maks-grenen (ikke kun vaerdi-grenen)
    // ogsaa runder korrekt: 2.5-5 m/s -> 9-18 km/h, begge heltal.
    const post = { min: 2.5, maks: 5, enhed: 'm/s', kilde: 'https://example.com/y', hentet: '2026-08-19' };
    const ny = skema.visningsPost('hastighed', post);
    ok('min er praecis 9', ny.min === 9, `fik ${ny.min}`);
    ok('maks er praecis 18', ny.maks === 18, `fik ${ny.maks}`);
  }

  console.log('  15.5 De fire navngivne km/t-robotter (D-fund i briefet): heltal, ingen omregning');
  {
    const forventet = {
      'unitree-b2-w.yaml': 15,
      'yobotics-e-dog.yaml': 12,
      'neura-quadruped.yaml': 12,
      'rivr-one.yaml': 14,
    };
    for (const [fil, tal] of Object.entries(forventet)) {
      const sti = path.join(rod, 'data', 'robots', fil);
      const doc = skema.normaliserRobot(yaml.parseYaml(fs.readFileSync(sti, 'utf8'), sti));
      const post = doc.felter.hastighed;
      ok(`${fil}: raa-enhed er allerede km/h efter normaliserRobot (km/t-alias)`,
        post.enhed === 'km/h', `fik ${post.enhed}`);
      const ny = skema.visningsPost('hastighed', post);
      ok(`${fil}: ingen omregning fandt sted (samme reference)`, ny === post);
      ok(`${fil}: vaerdi er praecis ${tal}`, ny.vaerdi === tal, `fik ${ny.vaerdi}`);
    }
  }

  console.log('  15.6 Tilstande og fri tekst roeres ikke (uaendret regel, ikke ny — men skal blive ved med at holde)');
  {
    const tilstand = { vaerdi: 'ikke_oplyst', hentet: '2026-08-19' };
    ok('tilstanden "ikke_oplyst" er uroert', skema.visningsPost('hastighed', tilstand) === tilstand);
    const fri = { vaerdi: 'ureguleret, se producentens ark', enhed: 'm/s', kilde: 'https://x', hentet: '2026-08-19' };
    ok('fri tekst er uroert', skema.visningsPost('hastighed', fri) === fri);
  }

  console.log('  15.7 Fuldt byg (isoleret --ud=, roerer ikke det rigtige dist/): alle talposter viser km/h, aldrig m/s');
  {
    const tmpUd = path.join(tmp, 'dist-hastighed');
    fs.rmSync(tmpUd, { recursive: true, force: true });
    const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${tmpUd}`],
      { cwd: rod, encoding: 'utf8' });
    ok('build.mjs giver exit 0', b.status === 0, (b.stderr || b.stdout || '').trim().split('\n').slice(-3).join(' / '));

    const jsonSti = path.join(tmpUd, 'robots.json');
    if (fs.existsSync(jsonSti)) {
      const j = JSON.parse(fs.readFileSync(jsonSti, 'utf8'));
      const fordeling = {};
      for (const r of j.robotter) {
        const h = (r.alle_felter || {}).hastighed;
        if (h && h.tilstand === 'tal') fordeling[h.enhed] = (fordeling[h.enhed] || 0) + 1;
      }
      ok('kun km/h forekommer blandt talposterne (aldrig m/s)',
        Object.keys(fordeling).length === 1 && fordeling['km/h'] > 0,
        JSON.stringify(fordeling));
    } else {
      ok('dist/robots.json findes efter byg', false, jsonSti);
    }
    fs.rmSync(tmpUd, { recursive: true, force: true });
  }

  console.log('  15.8 Kommentarblokken i skema.mjs modsiger ikke laengere koden');
  {
    const kilde = fs.readFileSync(path.join(rod, 'tools', 'skema.mjs'), 'utf8');
    const forekomster = (kilde.match(/hastighed -> m\/s/g) || []).length;
    ok('strengen "hastighed -> m/s" findes 0 gange (den gamle, nu forkerte, paastand)',
      forekomster === 0, `fandt ${forekomster} gange`);
  }
}
