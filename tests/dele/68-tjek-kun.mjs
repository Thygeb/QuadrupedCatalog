/**
 * tests/dele/68-tjek-kun.mjs — spor/tjekkun, D5. Efter kontrakten i
 * tests/LAESMIG.md: tocifret praefiks 68 (tildelt af orkestratoren — 63 og
 * 64 er i brug, 65-67 reserveret til en anden session), ingen liste at
 * redigere, eget data/dist ville laegges under ctx.tmp hvis der var brug
 * for det (her er der ikke: alt bygger paa fixtures + laesRobotter).
 *
 * INGEN DATABASE, INGEN .env, INGEN fetch — de to funktioner, der roerer
 * databasen (db/eksporter.mjs --fra-db i tjek.mjs's trin 1, og selve
 * hoved()-koerslen), kaldes aldrig herfra. Det eneste, der spawnes, er
 * "node db/tjek.mjs --liste", som per D1's kontrakt selv exit'er FOeR
 * eksporten kaldes.
 *
 * Fixtures (tests/dele/fixtures/68-*.json): unitree-aliengo.yaml parset +
 * normaliseret (samme kaede som build.mjs/validate.mjs bruger), gemt som
 * JSON, plus tre muterede kopier — genereret én gang med et scratchpad-
 * script, IKKE haandskrevet, saa fixturen er byte-tro mod den rigtige
 * normaliserRobot(parseYaml(...))-form:
 *   68-original.json          uaendret
 *   68-mut-tekst.json         felter.egenvaegt.advarsel aendret (TEKSTNOEGLE)
 *   68-mut-tal.json           felter.egenvaegt.vaerdi aendret (TAL, 21.5 -> 999)
 *   68-mut-raekkefoelge.json  felter.dataporte.vaerdi vendt om (samme fire strenge)
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

/** Taeller forekomster af TEKSTNOEGLER-noegler paa ALLE dybder — bruges til
 *  "foer/efter"-beviset for udenTekst(). Uafhaengig implementering af
 *  db/tjek.mjs's egen udenTekst(), saa testen ikke kan naa til samme
 *  fejlopfattelse som koden den efterproever. */
function taelTekstnoegler(obj, saet) {
  if (Array.isArray(obj)) return obj.reduce((n, v) => n + taelTekstnoegler(v, saet), 0);
  if (obj !== null && typeof obj === 'object') {
    let n = 0;
    for (const [k, v] of Object.entries(obj)) {
      if (saet.has(k)) n++;
      n += taelTekstnoegler(v, saet);
    }
    return n;
  }
  return 0;
}

const FORVENTET_TEKSTNOEGLER = [
  'advarsel', 'advarsel_ordlyd', 'advarsel_i18n',
  'note', 'note_ordlyd', 'note_i18n',
  'noter', 'noter_ordlyd',
  'citat', 'citat_ordlyd',
  'producentland', 'producentby',
  'alt',
];

export default async function koer(ctx) {
  const { ok, rod, node, lasRobotter } = ctx;

  const tjekMjsSti = path.join(rod, 'db/tjek.mjs');
  const { dybtLig, talLig, udenTekst, TEKSTNOEGLER } =
    await import(`file://${tjekMjsSti.replace(/\\/g, '/')}`);

  const fixturesMappe = path.join(rod, 'tests/dele/fixtures');
  const laesFixture = (navn) => JSON.parse(fs.readFileSync(path.join(fixturesMappe, navn), 'utf8'));

  // To UAFHAENGIGE parsninger af samme fixture, saa dybtLig(orig, origKopi)
  // proever RIGTIG dyb lighed — ikke bare a === b paa samme objektreference.
  const orig = laesFixture('68-original.json');
  const origKopi = laesFixture('68-original.json');
  const mutTekst = laesFixture('68-mut-tekst.json');
  const mutTal = laesFixture('68-mut-tal.json');
  const mutRaekkefoelge = laesFixture('68-mut-raekkefoelge.json');

  ok('dybtLig(orig, orig) er sand (to uafhaengige parsninger)', dybtLig(orig, origKopi) === true);

  ok('talLig(orig, tekstaendret) er sand — kun en TEKSTNOEGLE differerer', talLig(orig, mutTekst) === true);
  ok('dybtLig(orig, tekstaendret) er falsk — tekstforskellen taeller for dybtLig', dybtLig(orig, mutTekst) === false);

  ok('talLig(orig, talaendret) er falsk — en talkolonne differerer', talLig(orig, mutTal) === false);

  ok('talLig(orig, raekkefoelge-byttet) er falsk — listeraekkefoelge er ordnet data',
    talLig(orig, mutRaekkefoelge) === false);

  const foerAntal = taelTekstnoegler(orig, new Set(TEKSTNOEGLER));
  const stripped = udenTekst(orig);
  const efterAntal = taelTekstnoegler(stripped, new Set(TEKSTNOEGLER));
  ok('udenTekst: input har mindst én TEKSTNOEGLE foer strip', foerAntal > 0, `foer=${foerAntal}`);
  ok('udenTekst: 0 TEKSTNOEGLER tilbage paa alle dybder efter strip', efterAntal === 0, `efter=${efterAntal}`);

  const advarselFoer = orig.felter.egenvaegt.advarsel;
  udenTekst(orig);
  ok('udenTekst muterer IKKE sit input', orig.felter.egenvaegt.advarsel === advarselFoer
    && stripped.felter.egenvaegt.advarsel === undefined);

  ok('TEKSTNOEGLER er praecis D2s liste (pinner kontrakten)',
    JSON.stringify(TEKSTNOEGLER) === JSON.stringify(FORVENTET_TEKSTNOEGLER),
    JSON.stringify(TEKSTNOEGLER));

  // --liste: ren lokal laesning, INGEN database, INGEN .env. Facittet
  // udledes fra data/robots/ selv (IKKE hardkodet 25 — se tests/LAESMIG.md's
  // regel om at et haandskrevet facittal glider fra virkeligheden).
  const alleRobotter = lasRobotter(path.join(rod, 'data/robots'));
  const taelling = new Map();
  for (const r of alleRobotter) taelling.set(r.producent, (taelling.get(r.producent) ?? 0) + 1);
  const forventetLinjer = [...taelling.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'da'));
  const [forventetFoersteProducent, forventetFoersteAntal] = forventetLinjer[0];

  const start = Date.now();
  const res = spawnSync(node, [tjekMjsSti, '--liste'], { cwd: rod, encoding: 'utf8' });
  const varighedMs = Date.now() - start;
  const linjer = res.stdout.split('\n').map((l) => l.trimEnd()).filter(Boolean);

  ok('--liste: exit 0', res.status === 0, `status=${res.status}`);
  ok('--liste: antal linjer = antal forskellige producenter i data/robots/',
    linjer.length === forventetLinjer.length, `${linjer.length} vs ${forventetLinjer.length}`);
  ok('--liste: foerste linje er producenten med flest robotter',
    linjer[0] === `${forventetFoersteAntal}  ${forventetFoersteProducent}`, linjer[0]);
  ok('--liste: udskriften indeholder IKKE "1/4" (eksporteren blev ikke kaldt)',
    !res.stdout.includes('1/4'));
  ok('--liste: under 5000 ms (ingen database, ingen .env)', varighedMs < 5000, `${varighedMs} ms`);
}
