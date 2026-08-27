/**
 * tests/dele/25-sammenlign-kilde.mjs — spor/sammenlign, punkt 4.
 *
 * Baggrund: Å38's krydskontrol (27. aug 2026, se STATUS.md) fandt at
 * /sammenligning/ - "den flade, hele siden er bygget for" (felt for felt) -
 * var den ENESTE med 0 kildebogstaver i sin indlejrede DATA. Punkt 1
 * (tools/skabelon/sammenligning.mjs' dataBlok()) retter det ved at slaa hvert
 * felts kilde op med `lavKilder(r).for(post)` - samme funktion, side.mjs' egen
 * kildemaerke() og producent.mjs' kompaktStribe() allerede bruger (KRITIK-4
 * fund 2) - og sender bogstavet med som den korte noegle `k` (+ `sek` naar
 * kilden er sekundaer).
 *
 * VIGTIGT, laest i skema.mjs' feltVisning()-kommentar FOER denne test blev
 * skrevet: den funktion udelader bevidst kilde/hentet/kildetype med
 * henvisning til en CEO-beslutning 24. aug 2026 ("Kilder skjules",
 * BEGRUNDELSE.md). Denne test - og aendringen den daekker - staar i direkte
 * modstrid med den beslutning. Se rapportens "Nye faelder og opdagelser".
 * Testen paastaar KUN, hvad koden nu faktisk goer, ikke om det BOER goere det.
 *
 * To paastande her er valgt for at bevise BEGGE retninger af reglen "et hul
 * uden kilde er en anden oplysning end et hul med" (hård begrænsning 5) -
 * ikke kun at bogstaver findes, men at de IKKE laekker til felter, der aldrig
 * blev efterprøvet:
 *
 *   - `data/robots/unitree-a1.yaml` felt `egenvaegt`: `vaerdi: ikke_oplyst`
 *     MEN med `kilde:` sat og advarslen "Negativkontrolleret: ordet Weight
 *     staar ikke ET sted paa siden." - et hul, som ALLIGEVEL er efterprøvet
 *     og derfor SKAL bære sit bogstav.
 *   - Samme fils felt `hoejde: ikke_oplyst` (bar YAML-streng, ingen `kilde:`
 *     overhovedet) - et hul, der ALDRIG er tjekket, og som derfor IKKE må få
 *     et bogstav.
 *
 * Selve robotten er selv efterprøvet her (data/robots/unitree-a1.yaml laest i
 * sin helhed under research til dette spor), ikke kun antaget.
 *
 * Bygger sit eget dist i sin egen undermappe af ctx.tmp, jf. tests/LAESMIG.md.
 * Går hverken på nettet eller gennem en browser - læser kun den indlejrede
 * JSON-blok direkte fra det byggede HTML-dokument.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

/** Klipper DATA-blokken ud af én byg side og JSON.parse'r den. */
function sammenligningData(html) {
  const noegle = 'id="sammenligning-data">';
  const s = html.indexOf(noegle);
  if (s === -1) return null;
  const start = s + noegle.length;
  const e = html.indexOf('</script>', start);
  if (e === -1) return null;
  try { return JSON.parse(html.slice(start, e)); } catch { return null; }
}

export default async function koer(ctx) {
  const { rod, tmp, node, ok, lasRobotter } = ctx;

  console.log('\n25. spor/sammenlign: kildebogstav i sammenligningssidens DATA (Å38s krydskontrolfund)');

  const udMappe = path.join(tmp, 'dist-sammenlign-kilde');
  fs.rmSync(udMappe, { recursive: true, force: true });
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${udMappe}`],
    { cwd: rod, encoding: 'utf8' });
  ok('build.mjs giver exit 0 (frisk byg til midlertidig mappe)',
    b.status === 0, (b.stdout || b.stderr || '').trim().split('\n').slice(-3).join(' / '));
  if (b.status !== 0) return;

  const sti = path.join(udMappe, 'da', 'sammenligning', 'index.html');
  ok(`${sti}: filen findes`, fs.existsSync(sti));
  if (!fs.existsSync(sti)) return;

  const html = fs.readFileSync(sti, 'utf8');
  const data = sammenligningData(html);
  ok('den indlejrede DATA-blok kan JSON.parses og bærer et robotter-array',
    !!data && Array.isArray(data.robotter) && data.robotter.length > 0,
    data ? `robotter: ${data.robotter?.length}` : 'parse fejlede');
  if (!data) return;

  /* 1. Global taelling - selve acceptkriteriet: den valgte noegle ("k") findes
     mere end 0 gange. */
  let felterMedK = 0;
  let felterUdenK = 0;
  for (const r of data.robotter) {
    for (const n of Object.keys(r.felter)) {
      if (Object.prototype.hasOwnProperty.call(r.felter[n], 'k')) felterMedK++;
      else felterUdenK++;
    }
  }
  ok(`DATA bærer kildebogstaver (nøglen "k"): ${felterMedK} felter med, ${felterUdenK} uden`,
    felterMedK > 0);

  /* 2. Bijektiv krydskontrol mod raadataen, over ALLE 77 robotter - ikke kun
     stikproeven nedenfor. Genbruger IKKE lavKilder()s bogstav-udregning (det
     ville vaere L30/Å12-fælden: to kopier af samme regel) - efterprøver kun
     KONTRAKTEN "post.kilde findes <=> feltet bærer k", uafhængigt af hvilket
     bogstav det bliver til. */
  const robotterRaa = lasRobotter(path.join(rod, 'data', 'robots'));
  const rRaaAf = new Map(robotterRaa.map((r) => [r.slug, r]));
  let uoverensstemmelser = 0;
  const eksempler = [];
  for (const rUd of data.robotter) {
    const rRaa = rRaaAf.get(rUd.slug);
    if (!rRaa) continue;
    for (const n of Object.keys(rUd.felter)) {
      const post = rRaa.felter?.[n];
      const harKilde = !!(post && typeof post === 'object' && post.kilde);
      const harK = Object.prototype.hasOwnProperty.call(rUd.felter[n], 'k');
      if (harKilde !== harK) {
        uoverensstemmelser++;
        if (eksempler.length < 5) eksempler.push(`${rUd.slug}.${n} (raa kilde:${harKilde}, DATA k:${harK})`);
      }
    }
  }
  ok(`hvert felt med post.kilde i raadataen bærer "k", og intet hul uden kilde bærer et (0 uoverensstemmelser af ${felterMedK + felterUdenK} felter, ${robotterRaa.length} robotter)`,
    uoverensstemmelser === 0, eksempler.join(', '));

  /* 3. Navngiven, selv-efterprøvet robot: data/robots/unitree-a1.yaml er læst
     i sin helhed under research til dette spor (ikke kun antaget). */
  const a1 = data.robotter.find((r) => r.slug === 'unitree-a1');
  ok('unitree-a1 (Unitree A1) findes i DATA', !!a1);
  if (!a1) return;

  ok('unitree-a1.egenvaegt (ikke_oplyst, MEN negativkontrolleret - YAML\'en sætter kilde:) bærer "k"',
    a1.felter.egenvaegt?.tilstand === 'ikke_oplyst' && Object.prototype.hasOwnProperty.call(a1.felter.egenvaegt, 'k'),
    JSON.stringify(a1.felter.egenvaegt));

  ok('unitree-a1.hoejde (ikke_oplyst, bar YAML-streng - ALDRIG efterprøvet, ingen kilde:) bærer INGEN "k"',
    a1.felter.hoejde?.tilstand === 'ikke_oplyst' && !Object.prototype.hasOwnProperty.call(a1.felter.hoejde, 'k'),
    JSON.stringify(a1.felter.hoejde));

  ok('unitree-a1.nyttelast_gaaende (tal, 5 kg, sourced) bærer "k"',
    a1.felter.nyttelast_gaaende?.tilstand === 'tal' && Object.prototype.hasOwnProperty.call(a1.felter.nyttelast_gaaende, 'k'),
    JSON.stringify(a1.felter.nyttelast_gaaende));
}
