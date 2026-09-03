/**
 * tests/dele/73-sessionsvagt.mjs — spor/vagt (fund/BRIEF-vagt.md), test 73.
 * Nummeret er TILDELT af orkestratoren (72 er reserveret af et andet spor).
 *
 * Daekker sessionsvagtens BESLUTNING, ikke dens formatering: at den tier
 * under begge graenser, at den taler naar hver af de to graenser for sig er
 * krydset, og at ugyldigt eller manglende input giver tavshed OG exit 0.
 *
 * De rene funktioner (beslut, traekUsage, traekTimestamp) importeres direkte
 * fra hook-scriptet i stedet for at starte en proces for hver paastand -
 * hurtigere og mere praecist, som briefet beder om. Kun 73.4 og 73.5 starter
 * en rigtig proces, fordi "exit 0" og "intet paa stdout" er egenskaber ved
 * PROCESSEN og ikke noget de rene funktioner kan udtale sig om.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const { rod, ok, node } = ctx;
  console.log('\n73. spor/vagt: sessionsvagt.mjs (UserPromptSubmit-hook)');

  const hookSti = path.join(rod, '.claude', 'hooks', 'sessionsvagt.mjs');
  ok('73.0: hook-filen findes paa den forventede sti', fs.existsSync(hookSti), hookSti);

  const vagt = await import(`file://${hookSti.replace(/\\/g, '/')}`);
  const {
    beslut, traekUsage, traekTimestamp,
    KONTEKST_GRAENSE, CACHE_TTL_MINUTTER, CACHE_MIN_KONTEKST,
  } = vagt;

  const NU = new Date('2026-09-03T12:00:00.000Z');
  const linje = (i, c, r, ts) => JSON.stringify({
    message: { usage: { input_tokens: i, cache_creation_input_tokens: c, cache_read_input_tokens: r } },
    type: 'assistant',
    timestamp: ts,
  });

  /* --- 73.1 Under begge graenser: tavshed --------------------------------- */
  {
    const tekst = linje(2, 0, 49998, '2026-09-03T11:59:00.000Z'); // sum 50.000
    const kontekst = traekUsage(tekst);
    ok('73.1a: traekUsage summerer de tre felter korrekt (50.000)', kontekst === 50000, `fik ${kontekst}`);
    const svar = beslut(tekst, NU);
    ok('73.1b: under begge graenser -> beslut() tier (null)', svar === null, `fik ${JSON.stringify(svar)}`);
  }

  /* --- 73.2 Over kontekstgraensen: taler, uanset hvor frisk cachen er ----- */
  {
    const overGraense = KONTEKST_GRAENSE + 20000;
    const tekst = linje(2, 0, overGraense - 2, '2026-09-03T11:59:50.000Z'); // frisk timestamp
    const svar = beslut(tekst, NU);
    ok(`73.2a: over kontekstgraensen (${overGraense} tokens) -> beslut() taler, selv med frisk timestamp`,
      typeof svar === 'string' && svar.length > 0, JSON.stringify(svar));
    const tal = String(overGraense).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    ok('73.2b: beskeden baerer det maalte kontekst-tal',
      typeof svar === 'string' && svar.includes(tal), svar);

    // GRAENSETILFAELDE: praecis PAA graensen skal IKKE tale - kun STRENGT over.
    const paaGraensen = beslut(linje(2, 0, KONTEKST_GRAENSE - 2, '2026-09-03T11:59:50.000Z'), NU);
    ok('73.2c/graense: praecis KONTEKST_GRAENSE tokens tier stadig (kun strengt over taler)',
      paaGraensen === null, `fik ${JSON.stringify(paaGraensen)}`);
  }

  /* --- 73.3 Cachegraensen: kontekst i mellemzonen + gammelt timestamp ----- */
  {
    const midtKontekst = CACHE_MIN_KONTEKST + 20000;
    const gammelTs = '2026-09-03T10:00:00.000Z'; // 120 min foer NU, langt over TTL
    const tekst = linje(2, 0, midtKontekst - 2, gammelTs);

    const ts = traekTimestamp(tekst);
    ok('73.3a: traekTimestamp finder det eneste timestamp-felt i halen', ts === gammelTs, `fik ${ts}`);

    const svar = beslut(tekst, NU);
    ok(`73.3b: kontekst i mellemzonen + stilhed over ${CACHE_TTL_MINUTTER} min -> beslut() taler`,
      typeof svar === 'string' && svar.length > 0, JSON.stringify(svar));

    // Samme kontekst, men FRISK timestamp -> cachen er ikke udloebet -> tier.
    const friskSvar = beslut(linje(2, 0, midtKontekst - 2, '2026-09-03T11:58:00.000Z'), NU);
    ok('73.3c: samme kontekst men frisk timestamp -> beslut() tier (cachen lever endnu)',
      friskSvar === null, `fik ${JSON.stringify(friskSvar)}`);

    // Under CACHE_MIN_KONTEKST, selv med et meget gammelt timestamp -> tier
    // (genopbygningen er billig nok til at ikke naevne den, jf. briefet).
    const lavKontekst = CACHE_MIN_KONTEKST - 20000;
    const lavSvar = beslut(linje(2, 0, lavKontekst - 2, gammelTs), NU);
    ok('73.3d: under CACHE_MIN_KONTEKST -> tier selv med et gammelt timestamp',
      lavSvar === null, `fik ${JSON.stringify(lavSvar)}`);
  }

  /* --- 73.4 Ugyldigt/manglende input: tavshed OG exit 0 (rigtig proces) --- */
  {
    const koerHook = (stdin) => spawnSync(node, [hookSti], { cwd: rod, input: stdin, encoding: 'utf8' });

    const tom = koerHook('');
    ok('73.4a: tomt stdin -> exit 0', tom.status === 0, `exit ${tom.status}, stderr ${tom.stderr}`);
    ok('73.4a: tomt stdin -> intet paa stdout', (tom.stdout || '').trim() === '', `fik "${tom.stdout}"`);

    const sludder = koerHook('dette er ikke json');
    ok('73.4b: ugyldig JSON paa stdin -> exit 0', sludder.status === 0, `exit ${sludder.status}, stderr ${sludder.stderr}`);
    ok('73.4b: ugyldig JSON paa stdin -> intet paa stdout', (sludder.stdout || '').trim() === '', `fik "${sludder.stdout}"`);

    const udenSti = koerHook(JSON.stringify({ session_id: 'x' }));
    ok('73.4c: gyldig JSON UDEN transcript_path -> exit 0', udenSti.status === 0, `exit ${udenSti.status}`);
    ok('73.4c: gyldig JSON UDEN transcript_path -> intet paa stdout', (udenSti.stdout || '').trim() === '', `fik "${udenSti.stdout}"`);

    const ikkeEksisterende = koerHook(JSON.stringify({ transcript_path: path.join(rod, 'findes-ikke-73.jsonl') }));
    ok('73.4d: transcript_path peger paa en fil der ikke findes -> exit 0',
      ikkeEksisterende.status === 0, `exit ${ikkeEksisterende.status}, stderr ${ikkeEksisterende.stderr}`);
    ok('73.4d: samme -> intet paa stdout', (ikkeEksisterende.stdout || '').trim() === '', `fik "${ikkeEksisterende.stdout}"`);
  }

  /* --- 73.5 REVERT-BEVIS: en RIGTIG over-graense session giver rent
     faktisk output paa stdout via processen, ikke kun via beslut() direkte -
     saa 73.4 ikke bare er groen, fordi hooken ALTID tier. ------------------ */
  {
    const tmpMappe = path.join(ctx.tmp, 'dele-73');
    fs.mkdirSync(tmpMappe, { recursive: true });
    const tmpFil = path.join(tmpMappe, 'transskript.jsonl');
    const overGraense = KONTEKST_GRAENSE + 5000;
    fs.writeFileSync(tmpFil, linje(2, 0, overGraense - 2, new Date().toISOString()) + '\n', 'utf8');

    const svar = spawnSync(node, [hookSti], {
      cwd: rod, input: JSON.stringify({ transcript_path: tmpFil }), encoding: 'utf8',
    });
    let parset = null;
    try { parset = JSON.parse((svar.stdout || '').trim()); } catch { /* fanges af ok() nedenfor */ }
    ok('73.5/revert: en RIGTIG over-graense session giver additionalContext paa stdout (proces-niveau)',
      svar.status === 0
        && parset
        && parset.hookSpecificOutput
        && parset.hookSpecificOutput.hookEventName === 'UserPromptSubmit'
        && typeof parset.hookSpecificOutput.additionalContext === 'string'
        && parset.hookSpecificOutput.additionalContext.length > 0,
      `exit ${svar.status}, stdout "${svar.stdout}", stderr "${svar.stderr}"`);
  }

  /* --- 73.6 Halen laeses, ikke hele filen: en KAEMPE fil giver stadig svar
     og INDEN for et rimeligt tidsrum - beviser at HALE_BYTES rent faktisk
     bruges, ikke bare staar som en konstant ingen laeser. ------------------ */
  {
    const tmpMappe = path.join(ctx.tmp, 'dele-73');
    fs.mkdirSync(tmpMappe, { recursive: true });
    const kaempeFil = path.join(tmpMappe, 'kaempe-transskript.jsonl');
    const overGraense = KONTEKST_GRAENSE + 1000;
    const fyld = 'x'.repeat(1024 * 1024); // 1 MB "stoej" foer den rigtige linje
    const strøm = fs.createWriteStream(kaempeFil);
    for (let i = 0; i < 3; i++) strøm.write(`{"noget":"${fyld}"}\n`); // ~3 MB stoej
    strøm.write(linje(2, 0, overGraense - 2, new Date().toISOString()) + '\n');
    await new Promise((res) => strøm.end(res));

    const start = Date.now();
    const svar = spawnSync(node, [hookSti], {
      cwd: rod, input: JSON.stringify({ transcript_path: kaempeFil }), encoding: 'utf8',
    });
    const ms = Date.now() - start;
    let parset = null;
    try { parset = JSON.parse((svar.stdout || '').trim()); } catch { /* fanges nedenfor */ }
    ok('73.6a: en fil paa flere MB giver stadig et svar (halen fandt den sidste linje)',
      svar.status === 0 && parset && parset.hookSpecificOutput
        && typeof parset.hookSpecificOutput.additionalContext === 'string',
      `exit ${svar.status}, stdout "${svar.stdout}"`);
    ok(`73.6b: koerslen tager under 5000 ms (${ms} ms) - et tegn paa at kun halen blev laest`,
      ms < 5000, `${ms} ms`);
  }
}
