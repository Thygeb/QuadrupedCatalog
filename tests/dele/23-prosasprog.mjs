/**
 * tests/dele/23-prosasprog.mjs — KRITIK-4 fund 1/5 (spor/prosa2, 27. aug 2026):
 * "advarsel:"/"note:"/"noter:" var skrevet i translittereret dansk uden æ/ø/å,
 * og brugte de fem interne anvendelse-enum-navne direkte i læservendt tekst
 * ("Feltet er ikke_oplyst" i stedet for "Feltet er ikke oplyst"). Denne del
 * beviser tre ting:
 *
 *   (a) R19's udvidelse (tools/validate.mjs) FEJLER på et enum-navn i en
 *       advarsel — den udvidelse, dette spor tilføjede, virker faktisk.
 *   (b) en almindelig, allerede omskrevet advarsel PASSERER R19 — uden dette
 *       ville testen kun bevise, at reglen siger nej til alt.
 *   (c) det RIGTIGE katalogs byggede output (data/robots, som dette spor
 *       rettede 77 filer i) indeholder 0 forekomster af et udvalg
 *       translittererede ord — den samme kontrol som
 *       C:/Praktik/websites/maalevaerktoej/translit.mjs kører, men skrevet
 *       selvstændigt her, fordi måleværktøjet bevidst ligger uden for repoet
 *       og aldrig må importeres af en test.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const HOVED = `slug: NAVN
navn: Proeve
producent: Proeveproducent
producentland: Kina
status: i_produktion
fremdrift: ben
`;

// Samme udvalg som ORD-listen i translit.mjs (en delmængde, ikke hele listen -
// "et udvalg", jf. briefet), valgt fordi de er hyppige i selve fundet: vaerdi
// (78 forekomster maalt 27. aug), laengde, vaegt, hoejde, graense, naevner,
// erklaering, foerste.
const TRANSLIT_ORD = ['vaerdi', 'laengde', 'vaegt', 'hoejde', 'graense', 'naevner', 'erklaering', 'foerste'];

/** Samme metode som maalevaerktoej/translit.mjs: strip script/style/tags, led
 *  efter hele ord (ikke som delstreng af et laengere ord). */
function taelTranslitOrd(htmlTekst) {
  const tekst = htmlTekst
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  const fund = [];
  for (const o of TRANSLIT_ORD) {
    const re = new RegExp('(^|[^a-zA-ZæøåÆØÅ])(' + o + ')($|[^a-zA-ZæøåÆØÅ])', 'gi');
    if (re.test(tekst)) fund.push(o);
  }
  return fund;
}

function gaaHtml(dir, ind) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) { gaaHtml(p, ind); continue; }
    if (f.name.endsWith('.html')) ind.push(p);
  }
}

export default async function koer(ctx) {
  const { tmp, ok, rod, node } = ctx;

  console.log('\n23. Prosasprog — R19-udvidelsen mod enum-navne, og translit-nul paa det rigtige katalog');

  // (a) Hver af de fem enum-navne skal fælde R19, naar de staar som loebende
  //     tekst i en advarsel — ikke kun de moenstre, R19 allerede daekkede.
  const ENUM_SAGER = [
    ['sikkerhed_overvaagning (ren ASCII-form)', 'Kategorien er sat til sikkerhed_overvaagning ud fra producentens ord.'],
    ['sikkerhed_overvågning (aa allerede rettet til å)', 'Kategorien er sat til sikkerhed_overvågning ud fra producentens ord.'],
    ['forsvar_beredskab', 'Producentens \"emergency response\" er omsat til forsvar_beredskab.'],
    ['forskning_udvikling', 'Punktet \"R&D\" er omsat til forskning_udvikling.'],
    ['forbruger_uddannelse', 'Skoleeksemplaret er kategoriseret som forbruger_uddannelse.'],
    ['ikke_oplyst i loebende tekst', 'Feltet er ikke_oplyst - IKKE nej: kilden nævner det slet ikke.'],
  ];
  ENUM_SAGER.forEach(([navn, tekst], i) => {
    const indhold = HOVED.replace('NAVN', `sag-23-enum${i}`)
      + `felter:\n  egenvaegt:\n    vaerdi: 10\n    enhed: kg\n`
      + `    kilde: https://example.com/a\n    hentet: 2026-08-19\n`
      + `    advarsel: "${tekst}"\n`;
    const fil = path.join(tmp, `sag-23-enum${i}.yaml`);
    fs.writeFileSync(fil, indhold, 'utf8');
    const r = ctx.koerValidator([fil]);
    ok(`enum-leak ${navn}  ->  R19`, r.kode === 1 && /\bR19:/.test(r.ud),
      r.kode !== 1 ? `exit ${r.kode}, forventede 1` : `ingen R19 i udskriften: ${r.ud.trim()}`);
  });

  // (b) Modstykket: en advarsel skrevet paa korrekt, laeservendt dansk (samme
  //     form dette spor efterlod i data/robots) MAA IKKE fanges af R19.
  {
    const indhold = HOVED.replace('NAVN', 'sag-23-gyldig')
      + `felter:\n  egenvaegt:\n    vaerdi: 10\n    enhed: kg\n`
      + `    kilde: https://example.com/a\n    hentet: 2026-08-19\n`
      + `    advarsel: "Producentens kategori \\"security\\" er omsat til sikkerhed og overvågning. Feltet er ikke oplyst for øvrige varianter, ikke nej."\n`;
    const fil = path.join(tmp, 'sag-23-gyldig.yaml');
    fs.writeFileSync(fil, indhold, 'utf8');
    const r = ctx.koerValidator([fil]);
    ok('naturligt omskrevet advarsel (sikkerhed og overvågning / ikke oplyst) passerer R19',
      r.kode === 0, r.ud.trim());
  }

  // (c) Det RIGTIGE katalog (data/robots, 77 filer, rettet af dette spor)
  //     bygges i sin egen tmp-undermappe, og det byggede output maa ikke
  //     indeholde noget af translit-udvalget. Ingen antagelse om, at en
  //     anden del allerede har bygget noget.
  {
    const dist = path.join(tmp, 'dist-prosasprog');
    const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${dist}`],
      { cwd: rod, encoding: 'utf8' });
    ok('det rigtige katalog bygger med exit 0 (grundmaaling for denne del)',
      b.status === 0, `exit ${b.status}: ${(b.stderr || '').trim()}`);

    const htmlFiler = [];
    gaaHtml(dist, htmlFiler);
    ok('mindst én HTML-side blev fundet at scanne (ellers beviser 0-tallet ingenting)',
      htmlFiler.length > 0, `fandt ${htmlFiler.length} .html-filer under ${dist}`);

    const fundPrFil = new Map();
    for (const f of htmlFiler) {
      const fund = taelTranslitOrd(fs.readFileSync(f, 'utf8'));
      if (fund.length) fundPrFil.set(f, fund);
    }
    ok(`translit-udvalget (${TRANSLIT_ORD.join(', ')}) forekommer 0 gange i det byggede output`,
      fundPrFil.size === 0,
      fundPrFil.size
        ? [...fundPrFil.entries()].slice(0, 5)
          .map(([f, ord]) => `${path.relative(dist, f)}: ${ord.join(',')}`).join(' | ')
        : '');
  }
}
