/**
 * tests/dele/71-hentbyg-vaern.mjs — spor/f2-vaern, punkt 3 (fund/BRIEF-f2-vaern.md).
 * Nummer 71 TILDELT af briefet (70 var hoejeste paa main, da briefet blev
 * skrevet — efterproevet mod denne worktrees tests/dele/ foer filen blev lagt).
 *
 * INGEN DATABASEADGANG: db/hentbyg.mjs's egen hentDanskCaveatTalLive()
 * (som rent faktisk kalder db/fase2-tjek.mjs's hentRobotter()/fetch())
 * kaldes ALDRIG herfra. Al maaling erstattes af en haandskrevet
 * fixture-funktion (async () => ({...}) eller async () => { throw ... })
 * givet direkte til koerVaern() — samme dependency-injektions-punkt,
 * db/hentbyg.mjs blev bygget med netop for at goere dette muligt.
 *
 * Daekker briefets fem minimumskrav (punkt 3):
 *   1. vaernet siger nej ved et dansk-tal > 0
 *   2. vaernet slipper igennem ved 0
 *   3. vaernets besked indeholder tallet
 *   4. --alligevel omgaar vaernet
 *   5. manglende maaling giver stop, ikke stiltiende succes
 * Plus den ene beslutning briefet overlod til sporet: --alligevel UDEN
 * --uden-commit naegtes ogsaa (se db/hentbyg.mjs's koerVaern()-kommentar og
 * fund/FUND-f2vaern.md for begrundelsen).
 */
import { koerVaern, vaernTilstand, vaernBesked } from '../../db/hentbyg.mjs';

export default async function koer(ctx) {
  const { ok } = ctx;

  /* -------------------------------------------------- (1) dansk-tal > 0 blokerer */
  const t1 = vaernTilstand({ iAlt: 890, dansk: 795 });
  ok('(1) vaernTilstand: dansk=795 (>0) blokerer', t1.blokeret === true, JSON.stringify(t1));

  const r1 = await koerVaern(new Set(['--uden-commit']), async () => ({ iAlt: 890, dansk: 795 }));
  ok('(1) koerVaern: en dansk-maaling > 0 blokerer (ingen --alligevel)',
    r1.blokeret === true, JSON.stringify(r1));

  /* -------------------------------------------------- (2) dansk=0 slipper igennem */
  const t2 = vaernTilstand({ iAlt: 890, dansk: 0 });
  ok('(2) vaernTilstand: dansk=0 slipper igennem (blokeret:false)',
    t2.blokeret === false, JSON.stringify(t2));

  const r2 = await koerVaern(new Set(['--uden-commit']), async () => ({ iAlt: 890, dansk: 0 }));
  ok('(2) koerVaern: en REN database (konstrueret 0-resultat) slipper igennem uden --alligevel',
    r2.blokeret === false, JSON.stringify(r2));

  /* -------------------------------------------------- (3) beskeden baerer tallet */
  const besked = vaernBesked({ iAlt: 890, dansk: 795 });
  ok('(3) vaernBesked indeholder BAaDE dansk- og i alt-tallet, ikke bare "nej"',
    besked.includes('795') && besked.includes('890'), besked);
  ok('(3) koerVaern() giver samme besked videre ved en blokerende maaling',
    typeof r1.besked === 'string' && r1.besked.includes('795') && r1.besked.includes('890'),
    JSON.stringify(r1));

  /* -------------------------------------------------- (4) --alligevel omgaar vaernet */
  let maalingKaldt = false;
  const r4 = await koerVaern(new Set(['--alligevel', '--uden-commit']), async () => {
    maalingKaldt = true;
    return { iAlt: 890, dansk: 795 }; // ville ellers blokere
  });
  ok('(4) koerVaern: --alligevel (+ --uden-commit) kommer forbi, SELV med et dansk-tal > 0',
    r4.blokeret === false, JSON.stringify(r4));
  ok('(4) koerVaern: --alligevel springer maalingen HELT over (koster intet — briefets krav 4)',
    maalingKaldt === false);

  /* -------------------------------------------------- (5) manglende maaling giver stop */
  const fejlBesked = 'SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY mangler i .env';
  const r5 = await koerVaern(new Set(['--uden-commit']), async () => { throw new Error(fejlBesked); });
  ok('(5) koerVaern: en KASTENDE maaling (fx manglende .env) stopper — ikke tavs succes',
    r5.blokeret === true, JSON.stringify(r5));
  ok('(5) koerVaern: stop-beskeden forklarer HVORFOR (citerer maalefejlen)',
    typeof r5.besked === 'string' && r5.besked.includes(fejlBesked), r5.besked);

  /* -------------------------------------------------- ekstra: --alligevel KRAeVER --uden-commit */
  let maalingKaldtUdenCommit = false;
  const r6 = await koerVaern(new Set(['--alligevel']), async () => { maalingKaldtUdenCommit = true; return { iAlt: 1, dansk: 0 }; });
  ok('(ekstra) koerVaern: --alligevel UDEN --uden-commit naegtes (den beslutning briefet overlod til sporet)',
    r6.blokeret === true, JSON.stringify(r6));
  ok('(ekstra) koerVaern: den naegtelse sker FOER nogen maaling (ren flag-logik, intet netvaerk)',
    maalingKaldtUdenCommit === false);
  ok('(ekstra) koerVaern: naegtelsens besked naevner BEGGE flag, saa det er tydeligt hvad der mangler',
    typeof r6.besked === 'string' && r6.besked.includes('--alligevel') && r6.besked.includes('--uden-commit'),
    r6.besked);

  /* -------------------------------------------------- positiv kontrol: --alligevel + --uden-commit + dansk=0 */
  const r7 = await koerVaern(new Set(['--alligevel', '--uden-commit']), async () => ({ iAlt: 5, dansk: 0 }));
  ok('(positiv kontrol) --alligevel + --uden-commit + en ren database slipper ogsaa igennem',
    r7.blokeret === false, JSON.stringify(r7));
}
