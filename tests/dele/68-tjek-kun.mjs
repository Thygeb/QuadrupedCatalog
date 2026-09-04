/**
 * tests/dele/68-tjek-kun.mjs — spor/tjekkun, D5. Efter kontrakten i
 * tests/LAESMIG.md: tocifret praefiks 68 (tildelt af orkestratoren — 63 og
 * 64 er i brug, 65-67 reserveret til en anden session), ingen liste at
 * redigere, eget data/dist ville laegges under ctx.tmp hvis der var brug
 * for det (her er der ikke: alt bygger paa fixtures + laesRobotter).
 *
 * Denne fils EGNE kald er database-frie: dybtLig/talLig/udenTekst testes
 * isoleret paa fixtures, ingen fetch. Det eneste, der spawnes, er
 * "node db/tjek.mjs --liste".
 *
 * AA183/L84 (4. sep 2026): data/robots/ er slettet, og db/tjek.mjs's --liste
 * kan derfor IKKE laengere vaere database-fri (db/tjek.mjs's egen
 * docstring/AA183-note forklarer hvorfor) - trin 1's eksport koeres nu
 * ALTID foerst, ogsaa for --liste, saa "1/4 ..." STAAR i outputtet, hvor det
 * foer var forbudt. --liste's egen exit-status og facit (linjer, foerste
 * producent) er UAeNDREDE; kun eksport-headeren og --liste's timing-antagelse
 * ("ingen database") er det, der er rettet nedenfor. Facittet udledes
 * stadig, ikke hardkodet (samme regel som foer) - kun kilden er hentRobotter()
 * (databasen), ikke data/robots/.
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
  const {
    ok, rod, node, skema, hentRobotter,
  } = ctx;

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

  // --liste: facittet udledes fra databasen (IKKE hardkodet 25 — se
  // tests/LAESMIG.md's regel om at et haandskrevet facittal glider fra
  // virkeligheden). AA183/L84: foer data/robots/, nu hentRobotter() - mappen
  // er slettet.
  const alleRobotter = (await hentRobotter()).map((d) => skema.normaliserRobot(d));
  const taelling = new Map();
  for (const r of alleRobotter) taelling.set(r.producent, (taelling.get(r.producent) ?? 0) + 1);
  const forventetLinjer = [...taelling.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'da'));
  const [forventetFoersteProducent, forventetFoersteAntal] = forventetLinjer[0];

  const start = Date.now();
  const res = spawnSync(node, [tjekMjsSti, '--liste'], { cwd: rod, encoding: 'utf8' });
  const varighedMs = Date.now() - start;
  // AA183/L84: --liste's output baerer nu ALTID trin 1's "1/4 ..."-header
  // FOeR producentlinjerne (db/tjek.mjs's egen AA183-note) - filtreret vaek
  // med et moenster, kun de rigtige "<antal>  <navn>"-linjer matcher (et
  // taltegn, TO mellemrum, saa ikke-tomt), saa "1/4  node db/eksporter..."
  // og enhver advarsel-linje IKKE taeller med.
  const linjer = res.stdout.split('\n').map((l) => l.trimEnd()).filter((l) => /^\d+ {2}\S/.test(l));

  ok('--liste: exit 0', res.status === 0, `status=${res.status}`);
  ok('--liste: antal producentlinjer = antal forskellige producenter i databasen',
    linjer.length === forventetLinjer.length, `${linjer.length} vs ${forventetLinjer.length}`);
  ok('--liste: foerste producentlinje er producenten med flest robotter',
    linjer[0] === `${forventetFoersteAntal}  ${forventetFoersteProducent}`, linjer[0]);
  // VENDT (ikke slettet, CLAUDE.md): AA183/L84 goer eksporten obligatorisk
  // for --liste (db/tjek.mjs's docstring), saa "1/4" SKAL nu staa i
  // outputtet - det modsatte af kontrakten foer dette spor.
  ok('--liste: udskriften indeholder "1/4" (trin 1s eksport koeres nu altid foerst, AA183/L84)',
    res.stdout.includes('1/4'), res.stdout.slice(0, 120));
  // VENDT: "ingen database" gaelder ikke laengere (se ovenfor) - graensen
  // 5000 ms staar ved magt som et loft for ÉN db-eksport plus producenttael,
  // ikke som et bevis for database-frihed.
  ok('--liste: under 5000 ms (ÉN db-eksport, ikke database-fri laengere)', varighedMs < 5000, `${varighedMs} ms`);
}
