/**
 * tests/dele/42-cjk-ordlyd.mjs — spor/cjkui, 1. sep 2026.
 *
 * JPK: "UI SKAL VAERE REN FOR kinesiske tegn." Orkestratorens valg: den
 * kinesiske ordlyd bliver i dataen (beviset for hvad producenten skrev), men
 * flytter fra "advarsel"/"note"/"citat"/"noter" (som robot.mjs renderer
 * ordret) til et nyt soesterfelt "<felt>_ordlyd" (som INGEN skabelon laeser).
 *
 * Denne del beviser fire ting:
 *   1. Skemaet/validatoren ACCEPTERER de nye soesterfelter, korrekt udfyldt.
 *   2. Validatoren AFVISER dem, naar formen er forkert (R21) — tom tekst,
 *      en ordlyd uden sit reader-facing modstykke, eller en liste-ordlyd med
 *      forkert laengde. Uden dette tilfaelde beviser 1. kun, at reglen siger
 *      ja til alt.
 *   3. Den STRUKTURELLE regel paa det RIGTIGE datasaet: ingen af de fire
 *      reader-facing felter (advarsel, note, citat, noter) baerer et eneste
 *      han-tegn nogen steder i data/robots/*.yaml — uanset hvor mange
 *      robotter kataloget vokser til.
 *   4. Den BYGGEDE side: 0 sider, 0 han-tegn i dist/ — det faktiske
 *      acceptkriterium, JPK stillede.
 */
import fs from 'node:fs';
import path from 'node:path';

const CJK = /[一-鿿]/;

const HOVED = `slug: NAVN
navn: Proeve
producent: Proeveproducent
producentland: Kina
status: i_produktion
fremdrift: ben
`;

/** Tæller han-tegn i en streng — 0 hvis den ikke er en streng. */
function cjkTal(s) {
  if (typeof s !== 'string') return 0;
  return (s.match(CJK) || []).length ? (s.match(new RegExp(CJK, 'g')) || []).length : 0;
}

export default async function koer(ctx) {
  const {
    rod, tmp, node, ok, koerValidator, skema, hentRobotter,
  } = ctx;

  console.log('\n42. spor/cjkui — advarsel/note/citat/noter er rene for han-tegn, ordlyden er bevaret i *_ordlyd');

  // 1. Skemaet accepterer alle fire soesterfelter, korrekt formet.
  {
    const indhold = HOVED.replace('NAVN', 'sag-42-gyldig') +
      `noter:\n  - "Dansk note uden fremmedsprog."\n  - "Dansk note med kildeformulering."\n` +
      `noter_ordlyd:\n  - ""\n  - "原文引用"\n` +
      `anvendelse:\n  vaerdi: industri\n` +
      `  citat:\n    - "Dansk oversaettelse et."\n    - "Dansk oversaettelse to."\n` +
      `  citat_ordlyd:\n    - ""\n    - "原文"\n` +
      `  kilde: https://example.com/a\n  hentet: 2026-08-19\n` +
      `  note: "Dansk begrundelse for kategorien."\n  note_ordlyd: "原文说明"\n` +
      `felter:\n  egenvaegt:\n    vaerdi: 10\n    enhed: kg\n` +
      `    kilde: https://example.com/a\n    hentet: 2026-08-19\n` +
      `    advarsel: "Dansk forbehold."\n    advarsel_ordlyd: "原文备注"\n`;
    const fil = path.join(tmp, 'sag-42-gyldig.yaml');
    fs.writeFileSync(fil, indhold, 'utf8');
    const r = koerValidator([fil]);
    ok('alle fire *_ordlyd-felter, korrekt formet, passerer validatoren',
      r.kode === 0, r.ud.trim());
  }

  // 2. R21 — formkrav afvises hver for sig.
  const basisFelter = `felter:\n  egenvaegt:\n    vaerdi: 10\n    enhed: kg\n` +
    `    kilde: https://example.com/a\n    hentet: 2026-08-19\n    advarsel: "Dansk forbehold."\n`;

  const sager = [
    ['advarsel_ordlyd: tom streng',
      HOVED.replace('NAVN', 'sag-42-tom') + basisFelter + `    advarsel_ordlyd: ""\n`],
    ['advarsel_ordlyd uden advarsel',
      HOVED.replace('NAVN', 'sag-42-uden-advarsel') +
        `felter:\n  egenvaegt:\n    vaerdi: 10\n    enhed: kg\n` +
        `    kilde: https://example.com/a\n    hentet: 2026-08-19\n    advarsel_ordlyd: "原文"\n`],
    ['anvendelse.citat_ordlyd med forkert laengde',
      HOVED.replace('NAVN', 'sag-42-citat-laengde') +
        `anvendelse:\n  vaerdi: industri\n  citat:\n    - "Et."\n    - "To."\n` +
        `  citat_ordlyd:\n    - ""\n` +   // kun 1, citat har 2
        `  kilde: https://example.com/a\n  hentet: 2026-08-19\n` +
        `felter:\n  egenvaegt: ikke_oplyst\n`],
    ['anvendelse.note_ordlyd uden note',
      HOVED.replace('NAVN', 'sag-42-note-uden-note') +
        `anvendelse:\n  vaerdi: industri\n  citat: "Et citat."\n` +
        `  kilde: https://example.com/a\n  hentet: 2026-08-19\n  note_ordlyd: "原文"\n` +
        `felter:\n  egenvaegt: ikke_oplyst\n`],
    ['top-level noter_ordlyd med forkert laengde',
      HOVED.replace('NAVN', 'sag-42-noter-laengde') +
        `noter:\n  - "Et."\n  - "To."\n` +
        `noter_ordlyd:\n  - ""\n` +   // kun 1, noter har 2
        `felter:\n  egenvaegt: ikke_oplyst\n`],
  ];
  for (const [navn, indhold] of sager) {
    const fil = path.join(tmp, navn.replace(/[^a-z0-9]+/gi, '-') + '.yaml');
    fs.writeFileSync(fil, indhold, 'utf8');
    const r = koerValidator([fil]);
    ok(`${navn}  ->  R21`, r.kode === 1 && /\bR21:/.test(r.ud),
      r.kode !== 1 ? `exit ${r.kode}, forventede 1 — ${r.ud.trim().slice(0, 200)}` : `ingen R21 i udskriften: ${r.ud.trim().slice(0, 200)}`);
  }

  // 3. Den strukturelle regel paa det RIGTIGE datasaet: reader-facing felter
  //    baerer INGEN han-tegn nogen steder — uanset hvor mange robotter der
  //    kommer til siden hen. Beviset staar for sig selv: en fejl her betyder
  //    enten at en ny robotpost fik uoversat kinesisk i et af de fire felter,
  //    eller at en fremtidig aendring gled tilbage til den gamle, blandede form.
  {
    // AA183/L84: laeser hentRobotter() (databasen), ikke data/robots/ - mappen
    // er slettet.
    const robotter = (await hentRobotter()).map((d) => skema.normaliserRobot(d));
    let synligeTegn = 0;
    const fund = [];
    const tjekTekst = (sti, s) => {
      const n = cjkTal(s);
      if (n) { synligeTegn += n; fund.push(`${sti} (${n} tegn)`); }
    };
    for (const r of robotter) {
      if (Array.isArray(r.noter)) r.noter.forEach((n, i) => tjekTekst(`${r.slug}.noter[${i}]`, n));
      else tjekTekst(`${r.slug}.noter`, r.noter);

      const a = r.anvendelse;
      if (a && typeof a === 'object') {
        if (Array.isArray(a.citat)) a.citat.forEach((c, i) => tjekTekst(`${r.slug}.anvendelse.citat[${i}]`, c));
        else tjekTekst(`${r.slug}.anvendelse.citat`, a.citat);
        tjekTekst(`${r.slug}.anvendelse.note`, a.note);
      }

      for (const [navn, post] of Object.entries(r.felter ?? {})) {
        if (!post || typeof post !== 'object') continue;
        tjekTekst(`${r.slug}.felter.${navn}.advarsel`, post.advarsel);
        tjekTekst(`${r.slug}.felter.${navn}.note`, post.note);
      }
    }
    ok(`0 han-tegn i advarsel/note/citat/noter paa tvaers af ${robotter.length} robotter`,
      synligeTegn === 0, fund.slice(0, 10).join(' | '));
  }

  // 4. Den byggede side: 0 sider, 0 han-tegn — det faktiske acceptkriterium.
  //    Eget dist under ctx.tmp, jf. LAESMIG.md ("byg dit eget data/dist").
  {
    const udMappe = path.join(tmp, 'dist-cjk-ordlyd');
    fs.rmSync(udMappe, { recursive: true, force: true });
    const { spawnSync } = await import('node:child_process');
    const byg = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${udMappe}`],
      { cwd: rod, encoding: 'utf8' });
    ok('byg af hele kataloget (eget dist) giver exit 0', byg.status === 0,
      (byg.stdout || '') + (byg.stderr || ''));

    let sider = 0, tegn = 0;
    const fund = [];
    if (fs.existsSync(udMappe)) {
      (function gaa(d) {
        for (const e of fs.readdirSync(d, { withFileTypes: true })) {
          const q = path.join(d, e.name);
          if (e.isDirectory()) { gaa(q); continue; }
          if (!e.name.endsWith('.html')) continue;
          const m = fs.readFileSync(q, 'utf8').match(new RegExp(CJK, 'g'));
          if (m) { sider++; tegn += m.length; fund.push(q); }
        }
      })(udMappe);
    }
    ok('0 byggede sider baerer han-tegn', sider === 0, fund.slice(0, 5).join(' | '));
    ok('0 han-tegn i alt i dist/', tegn === 0, `fik ${tegn}`);
  }
}
