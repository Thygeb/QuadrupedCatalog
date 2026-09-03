#!/usr/bin/env node
/**
 * .claude/hooks/sessionsvagt.mjs — UserPromptSubmit-hook, spor/vagt (fund/BRIEF-vagt.md).
 *
 * VIGTIGT: hooks registreres ved SESSIONSSTART, ligesom skills. Denne fil
 * virker foerst i sessioner, der startes EFTER den er flettet til main — en
 * session, der allerede koerer paa fletningsoejeblikket, laeser den ikke,
 * foer den startes forfra. Ser hooken "doed" ud lige efter et flet, er det
 * forventet, ikke en fejl — genstart sessionen i stedet for at fejlsoege den.
 *
 * Formaal (fuld baggrund i BRIEF-vagt.md): konteksten laeses om paa HVERT
 * API-kald til 10% af fuld pris — den er en loebende skat, ikke en
 * engangsudgift — og prompt-cachen lever kun ca. en time. Ingen af de to
 * graenser kan JPK se selv. Denne hook tier, indtil én af dem er krydset, og
 * taler saa til ASSISTENTEN via additionalContext (den eneste kanal en hook
 * har) og beder den tilbyde JPK en overlevering.
 *
 * Nul afhaengigheder, som resten af projektet: kun node:fs, node:path,
 * node:url.
 *
 * Deling I/O vs. beslutning: traekUsage, traekTimestamp og beslut() er RENE
 * funktioner uden filsystemadgang — tests/dele/73-sessionsvagt.mjs importerer
 * dem direkte i stedet for at starte en proces for hver paastand. laesHale()
 * er den eneste I/O-laesning, og main() er den tynde proces-indpakning
 * (stdin -> beslut -> stdout), som ALDRIG maa lade en fejl naa JPKs besked.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ---- De to graenser. KRAV, ikke gaet — kilde: BRIEF-vagt.md. --------------

// Maalt over 7 dage i dette projekt: gennemsnit 237.000 tokens/kald, og denne
// sessions egen kontekst paa 311.000 (2 + 2.699 + 308.217, maalt af JPK i
// briefet). 300.000 ligger imellem de to, saa vagten fyrer paa en session som
// den, der udloeste sporet, og IKKE paa en frisk session.
export const KONTEKST_GRAENSE = 300_000;

// Prompt-cachen lever i praksis ca. 60 minutter. 55 giver fem minutters
// margin, saa vagten naar at sige til, foer cachen faktisk er udloebet.
export const CACHE_TTL_MINUTTER = 55;

// Under 100.000 tokens er en genopbygning af cachen billig nok til at tie om,
// selv naar de 55 minutter er overskredet — advarslen er kun vaerd noget, naar
// konteksten, der skal skrives forfra, er stor.
export const CACHE_MIN_KONTEKST = 100_000;

// Hvor meget af transskriptets HALE der laeses. Filen, der udloeste dette
// spor, var 65 MB / 27.147 linjer — at laese den fulde fil paa hvert
// UserPromptSubmit ville goere vagten selv dyrere end det, den maaler.
export const HALE_BYTES = 256 * 1024;

// ---- Rene funktioner: ingen I/O, importeres direkte af testen ------------

/**
 * Finder summen af tokens fra det SIDSTE brugbare "usage"-objekt i teksten.
 *
 * Transskriptet er JSONL (én komplet JSON-linje pr. begivenhed). En
 * hale-udskaering starter typisk midt i en linje — den linje fejler blot
 * JSON.parse og springes ubemaerket over i catch'en, saa hverken en afskaaret
 * foerste linje eller andre JSON-linjer uden "usage" forstyrrer resultatet.
 *
 * usage ligger under message.usage for en assistant-tur (maalt direkte i
 * halen af den levende session, der udloeste sporet: sessionId
 * "e5b0e47f-8725-4594-8914-f4e41d5e3176"). Der lyttes ogsaa efter et
 * top-niveau usage-felt, hvis formatet nogensinde flytter sig — se BRIEF-
 * vagt.mds sidste afsnit ("er formatet anderledes i en frisk session, er det
 * et fund, og din vagt skal haandtere begge former eller tie").
 *
 * Returnerer null, hvis intet brugbart usage-objekt findes i halen — det
 * daekker baade "ugyldigt input" og "et andet transskriptformat", og begge
 * skal tie, ikke fejle.
 */
export function traekUsage(tekst) {
  let sidste = null;
  for (const linje of String(tekst).split('\n')) {
    if (!linje.includes('"usage"')) continue;
    let objekt;
    try { objekt = JSON.parse(linje); } catch { continue; }
    const usage = (objekt && objekt.message && objekt.message.usage) || (objekt && objekt.usage);
    if (!usage) continue;
    const { input_tokens: i, cache_creation_input_tokens: c, cache_read_input_tokens: r } = usage;
    if (typeof i !== 'number' || typeof c !== 'number' || typeof r !== 'number') continue;
    sidste = i + c + r;
  }
  return sidste;
}

/**
 * Finder det seneste "timestamp":"..."-felt i teksten som en ren
 * tekstsoegning. Feltet ligger paa oeverste niveau i praktisk talt hver
 * linje i transskriptet, saa en regex over hele halen er billigere og mere
 * robust mod en afskaaret foerste linje end at JSON.parse hver linje for sig
 * kun for at laese ét felt.
 */
export function traekTimestamp(tekst) {
  const fund = [...String(tekst).matchAll(/"timestamp"\s*:\s*"([^"]+)"/g)];
  return fund.length ? fund[fund.length - 1][1] : null;
}

/** "310918" -> "310.918", dansk tusindtalsopdeling uden at gaa via
 *  Intl/toLocaleString (usikkert paa en Node uden fuld ICU-data). */
const talMedPunktum = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/**
 * DEN RENE BESLUTNING. Ingen I/O, intet Date.now()-kald indeni — "nu" gives
 * udefra, saa funktionen er deterministisk og testbar uden uret. Returnerer
 * enten null (tie) eller additionalContext-teksten (taler, baerer tallene).
 *
 * Praecedens, naar begge graenser er krydset samtidig: kontekstgraensen
 * vinder. Den er den mere akutte af de to — den skat betales paa HVERT
 * eneste kald fremover, mens cache-udloebet kun koster ekstra paa det
 * foerste kald efter en pause.
 */
export function beslut(tekst, nu = new Date()) {
  const kontekst = traekUsage(tekst);
  if (kontekst === null) return null; // intet brugbart usage-felt -> tie

  if (kontekst > KONTEKST_GRAENSE) {
    return `SESSIONSVAGT: konteksten er ${talMedPunktum(kontekst)} tokens, over graensen paa `
      + `${talMedPunktum(KONTEKST_GRAENSE)}. Konteksten laeses om til 10% af fuld pris paa hvert `
      + `kald herfra — tilbyd JPK en overlevering (kald 'overlevering'-skillen), foer du fortsaetter.`;
  }

  if (kontekst >= CACHE_MIN_KONTEKST) {
    const ts = traekTimestamp(tekst);
    const sidst = ts ? new Date(ts) : null;
    if (sidst && !isNaN(sidst.getTime())) {
      const minutter = (nu.getTime() - sidst.getTime()) / 60000;
      if (minutter > CACHE_TTL_MINUTTER) {
        return `SESSIONSVAGT: der er gaaet ca. ${Math.round(minutter)} minutter siden sidste besked, `
          + `over cache-TTL'ens ${CACHE_TTL_MINUTTER}-minutters margin. Konteksten er `
          + `${talMedPunktum(kontekst)} tokens og bliver formentlig skrevet forfra som en dyr `
          + `cache-skrivning ved naeste kald — tilbyd JPK en overlevering (kald 'overlevering'-skillen).`;
      }
    }
  }

  return null;
}

// ---- I/O-indpakning ---------------------------------------------------

/**
 * Laeser de sidste `bytes` bytes af `filsti` via et createReadStream med et
 * start-offset udregnet af fs.statSync().size — det er kravet, briefet
 * kalder det, der betyder mest. Kastes der en fejl (filen findes ikke,
 * forsvinder mellem stat og read osv.), forplanter den til kalderen, som
 * fanger den i main()'s try/catch og tier.
 */
export function laesHale(filsti, bytes = HALE_BYTES) {
  return new Promise((resolve, reject) => {
    let start = 0;
    try {
      const st = fs.statSync(filsti);
      start = Math.max(0, st.size - bytes);
    } catch (fejl) {
      reject(fejl);
      return;
    }
    const dele = [];
    const ind = fs.createReadStream(filsti, { start, encoding: 'utf8' });
    ind.on('data', (d) => dele.push(d));
    ind.on('end', () => resolve(dele.join('')));
    ind.on('error', reject);
  });
}

/** Laeser stdin til ende og giver den raa tekst. Tomt stdin -> tom streng. */
function laesStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (d) => { data += d; });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', () => resolve(''));
  });
}

// ---- Proces-indpakningen: stdin -> beslut -> stdout -----------------------

/**
 * Hele arbejdet i ÉT try. Fejl maa ALDRIG blokere JPKs besked: manglende
 * transcript_path, tom fil, uparsebar JSON paa stdin, en fil der forsvinder
 * mellem stat og read — alt sammen tier og giver exit 0.
 *
 * Ingen process.exit() kaldes NOGEN steder i denne fil. Scriptet har lavet
 * async filsystem-I/O (stdin + createReadStream), og et eksplicit
 * process.exit() efter en async kilde med aabne handles kan crashe node paa
 * denne maskine (libuv-assertionen i miljoefaelder.md). Lad event-loekken
 * toemme sig selv i stedet — uden pending handles slutter processen med
 * exit 0 paa egen haand.
 */
async function main() {
  try {
    const raa = await laesStdin();
    if (!raa || !raa.trim()) return;
    let input;
    try { input = JSON.parse(raa); } catch { return; }
    const sti = input && input.transcript_path;
    if (!sti || typeof sti !== 'string' || !fs.existsSync(sti)) return;
    const hale = await laesHale(sti);
    const besked = beslut(hale, new Date());
    if (besked) {
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: besked },
      }) + '\n');
    }
  } catch {
    // Tie. Se kommentaren ovenfor — fejl maa aldrig naa JPKs besked.
  }
}

// ---- --selvtest: fire indbyggede syntetiske transskript-uddrag ------------

function selvtestLinje(inputTok, cacheCreate, cacheRead, timestampISO) {
  return JSON.stringify({
    parentUuid: 'x',
    message: {
      model: 'claude-sonnet-5',
      usage: {
        input_tokens: inputTok,
        cache_creation_input_tokens: cacheCreate,
        cache_read_input_tokens: cacheRead,
      },
    },
    type: 'assistant',
    timestamp: timestampISO,
  });
}

function koerSelvtest() {
  const NU = new Date('2026-09-03T12:00:00.000Z');

  // En afskaaret foerste linje, saadan som et rigtigt haleudsnit ville give —
  // beviser at en delvis linje ikke forstyrrer resten af udsnittet.
  const AFSKAARET = '_tokens":9999,"foo":"denne linje er afskaaret midt i og kan ikke JSON.parse\'es';

  const SAGER = [
    {
      navn: 'under begge graenser',
      forventet: 0,
      tekst: [AFSKAARET, selvtestLinje(2, 0, 49998, '2026-09-03T11:59:00.000Z')].join('\n'),
    },
    {
      navn: 'over kontekstgraensen',
      forventet: 1,
      tekst: [AFSKAARET, selvtestLinje(2, 0, 319998, '2026-09-03T11:59:50.000Z')].join('\n'),
    },
    {
      navn: 'over cachegraensen',
      forventet: 1,
      tekst: [AFSKAARET, selvtestLinje(2, 0, 149998, '2026-09-03T10:00:00.000Z')].join('\n'),
    },
    {
      navn: 'ugyldigt input',
      forventet: 0,
      tekst: 'dette er ikke json\nheller ikke denne linje\n{"stadig ikke gyldig json',
    },
  ];

  let altOk = true;
  for (const sag of SAGER) {
    const besked = beslut(sag.tekst, NU);
    const talt = besked ? 1 : 0;
    const ok = talt === sag.forventet;
    if (!ok) altOk = false;
    console.log(`${sag.navn}: ${talt} udskrift${talt === 1 ? '' : 'er'}${ok ? '' : ` (VENTEDE ${sag.forventet})`}`);
  }
  process.exitCode = altOk ? 0 : 1;
}

const erHovedmodul = process.argv[1] && (() => {
  try { return fileURLToPath(import.meta.url) === path.resolve(process.argv[1]); }
  catch { return false; }
})();

if (erHovedmodul) {
  if (process.argv.includes('--selvtest')) koerSelvtest();
  else main();
}
