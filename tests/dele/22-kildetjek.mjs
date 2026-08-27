/**
 * tests/dele/22-kildetjek.mjs — beviser klassifikationslogikken i
 * tools/kildetjek.mjs UDEN netvaerk: en 404 skal blive DOED, en timeout skal
 * blive UNAAELIG, og de to maa ALDRIG blandes sammen — det er hele
 * vaerktoejets vaerdi (se dets egen kommentarhoved). Den faktiske
 * netvaerksmaaling af de 103 kilde-URL'er staar i fund/FUND-kildetjek.md,
 * ikke her: en test, der kraever internet, er flaky og bliver slaaet fra ved
 * foerste roede koersel i en fremmed session.
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  klassificerStatus, klassificerFejl, skalFaldeTilbage, indsamlUrler,
} from '../../tools/kildetjek.mjs';

export default async function koer(ctx) {
  const { ok, tmp } = ctx;

  console.log('\n22. Kildetjek — klassifikation uden netvaerk');

  /* --- statuskoder: OK vs DOED --- */
  ok('22.1: 200 -> OK', klassificerStatus(200).udfald === 'OK');
  ok('22.2: 301 (fetch har allerede fulgt omdirigeringen) -> OK', klassificerStatus(301).udfald === 'OK');
  ok('22.3: 399 -> OK (graensen er "under 400")', klassificerStatus(399).udfald === 'OK');
  ok('22.4: 404 -> DOED', klassificerStatus(404).udfald === 'DOED');
  ok('22.5: 500 -> DOED', klassificerStatus(500).udfald === 'DOED');
  ok('22.6: statuskoden foelger med paa et DOED-svar', klassificerStatus(404).status === 404);
  ok('22.7: et OK/DOED-svar har ingen "aarsag" (den hoerer kun til UNAAELIG)',
    klassificerStatus(200).aarsag === null && klassificerStatus(404).aarsag === null);

  /* --- kastede fejl: ALTID UNAAELIG, aldrig OK eller DOED --- */
  const timeoutFejl = Object.assign(new Error('The operation was aborted due to timeout'), { name: 'TimeoutError' });
  const abortFejl = Object.assign(new Error('This operation was aborted'), { name: 'AbortError' });
  const dnsFejl = Object.assign(new Error('getaddrinfo ENOTFOUND eksempel.invalid'),
    { cause: { code: 'ENOTFOUND' } });
  const refusedFejl = Object.assign(new Error('connect ECONNREFUSED 1.2.3.4:443'), { cause: { code: 'ECONNREFUSED' } });
  const resetFejl = Object.assign(new Error('socket hang up'), { cause: { code: 'ECONNRESET' } });
  const tlsFejl = Object.assign(new Error('certificate has expired'),
    { cause: { code: 'ERR_TLS_CERT_ALTNAME_INVALID' } });

  ok('22.8: TimeoutError -> UNAAELIG', klassificerFejl(timeoutFejl).udfald === 'UNAAELIG');
  ok('22.9: TimeoutError faar aarsagen "timeout"', klassificerFejl(timeoutFejl).aarsag === 'timeout');
  ok('22.10: AbortError -> UNAAELIG med samme aarsag "timeout"',
    klassificerFejl(abortFejl).udfald === 'UNAAELIG' && klassificerFejl(abortFejl).aarsag === 'timeout');
  ok('22.11: ENOTFOUND -> UNAAELIG, aarsagen naevner dns',
    klassificerFejl(dnsFejl).udfald === 'UNAAELIG' && /dns/i.test(klassificerFejl(dnsFejl).aarsag));
  ok('22.12: ECONNREFUSED -> UNAAELIG, aarsagen naevner "naegtet"',
    klassificerFejl(refusedFejl).udfald === 'UNAAELIG' && /naegtet/i.test(klassificerFejl(refusedFejl).aarsag));
  ok('22.13: ECONNRESET -> UNAAELIG, aarsagen naevner "afbrudt"',
    klassificerFejl(resetFejl).udfald === 'UNAAELIG' && /afbrudt/i.test(klassificerFejl(resetFejl).aarsag));
  ok('22.14: en TLS-fejl -> UNAAELIG, aarsagen naevner tls',
    klassificerFejl(tlsFejl).udfald === 'UNAAELIG' && /tls/i.test(klassificerFejl(tlsFejl).aarsag));
  ok('22.15: en kastet fejl faar aldrig en HTTP-status - kun en aarsag', klassificerFejl(timeoutFejl).status === null);

  /* --- de to maa aldrig blandes sammen: kernepaastanden i dette spor --- */
  ok('22.16: en 404 (DOED) og en timeout (UNAAELIG) faar forskelligt udfald',
    klassificerStatus(404).udfald !== klassificerFejl(timeoutFejl).udfald);
  ok('22.17: hverken 404 eller en timeout klassificeres nogensinde som OK',
    klassificerStatus(404).udfald !== 'OK' && klassificerFejl(timeoutFejl).udfald !== 'OK');
  ok('22.18: en DNS-fejl og en forbindelse-naegtet-fejl er begge UNAAELIG, ikke DOED',
    klassificerFejl(dnsFejl).udfald === 'UNAAELIG' && klassificerFejl(refusedFejl).udfald === 'UNAAELIG'
    && klassificerFejl(dnsFejl).udfald !== 'DOED' && klassificerFejl(refusedFejl).udfald !== 'DOED');

  /* --- HEAD -> GET-fallback: kun paa specifikke statuskoder, jf. koden --- */
  ok('22.19: 403 udloeser GET-fallback (typisk bot-beskyttelse mod HEAD)', skalFaldeTilbage(403) === true);
  ok('22.20: 405 udloeser GET-fallback (Method Not Allowed)', skalFaldeTilbage(405) === true);
  ok('22.21: 501 udloeser GET-fallback (Not Implemented)', skalFaldeTilbage(501) === true);
  ok('22.22: 404 udloeser IKKE GET-fallback (siden er reelt vaek, ikke kun metoden)', skalFaldeTilbage(404) === false);
  ok('22.23: 200 udloeser IKKE GET-fallback', skalFaldeTilbage(200) === false);

  /* --- indsamling fra disk: skal taale en manglende data/manufacturers/ --- */
  const testRod = path.join(tmp, 'dist-kildetjek', 'rod');
  fs.mkdirSync(path.join(testRod, 'data', 'robots'), { recursive: true });
  // data/manufacturers findes BEVIDST IKKE her — det er praecis den tomme
  // mappe, briefet kraever, at koden ikke gaar i stykker paa.
  fs.writeFileSync(path.join(testRod, 'data', 'robots', 'test-robot.yaml'), [
    'slug: test-robot',
    'felter:',
    '  egenvaegt:',
    '    kilde: https://eksempel.invalid/side.',
    '    note: "se ogsaa (https://eksempel.invalid/anden)"',
  ].join('\n'), 'utf8');

  let indsamlingFejlede = false;
  let map = new Map();
  try {
    map = indsamlUrler(testRod);
  } catch {
    indsamlingFejlede = true;
  }
  ok('22.24: indsamlUrler fejler ikke paa en manglende data/manufacturers/-mappe', indsamlingFejlede === false);
  ok('22.25: finder begge URL\'er i testfilen', map.size === 2);
  ok('22.26: et afsluttende punktum skaeres af kilde-URL\'en',
    map.has('https://eksempel.invalid/side') && !map.has('https://eksempel.invalid/side.'));
  ok('22.27: en afsluttende parentes skaeres af note-URL\'en',
    map.has('https://eksempel.invalid/anden') && !map.has('https://eksempel.invalid/anden)'));
  ok('22.28: slug hentes fra "slug:"-linjen i filen, ikke kun filnavnet',
    [...(map.get('https://eksempel.invalid/side') || [])].includes('test-robot'));
}
