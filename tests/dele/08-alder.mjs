/**
 * tests/dele/08-alder.mjs — tools/alder.mjs's rene funktioner (aeldste/
 * nyeste/median, graense-logik for "til efterproevning", og datoIndsamling).
 */
export default async function koer(ctx) {
  const { ok, alder } = ctx;

  console.log('\n9. tools/alder.mjs — rene funktioner (aeldste/nyeste/median, graense-logik)');

  // robotAlder: kendte datoer, kendte svar. Rakkefoelgen i input er BEVIDST
  // ikke sorteret - funktionen skal selv sortere, ikke bare tage input[0].
  const a5 = alder.robotAlder(
    ['2026-08-19', '2026-08-01', '2026-08-25', '2026-08-10', '2026-08-15']);
  ok('robotAlder: 5 datoer (ulige antal) - aeldste, nyeste og midterste er de rigtige',
    a5.aeldste === '2026-08-01' && a5.nyeste === '2026-08-25' && a5.median === '2026-08-15'
    && a5.antal === 5, JSON.stringify(a5));

  ok('robotAlder: tom liste er null, ikke en dato — INGEN DATEREDE KILDER er en tredje tilstand',
    alder.robotAlder([]) === null && alder.robotAlder(undefined) === null);

  // medianDato ved lige antal: to eksempler, saa BAADE grundreglen (gennemsnit af
  // de to midterste) OG afrundingsvalget (naermeste hele dag, op ved en halv) er
  // bevist - ikke kun det ene tilfaelde, der aldrig rammer en halv dag.
  ok('medianDato: lige antal, praecis midtvejs mellem to datoer uden brøkdag (01. og 03. -> 02.)',
    alder.medianDato(['2026-08-01', '2026-08-01', '2026-08-03', '2026-08-03']) === '2026-08-02');
  ok('medianDato: lige antal, midtpunktet er en halv dag (02. og 03.) -> runder OP til 03.',
    alder.medianDato(['2026-08-01', '2026-08-02', '2026-08-03', '2026-08-04']) === '2026-08-03');

  ok('dageSiden: 2026-08-01 til 2026-08-25 er 24 hele dage',
    alder.dageSiden('2026-08-01', '2026-08-25') === 24);

  // tilEfterproevning: graensen er "AELDRE end N dage" - en robot noejagtig N
  // dage gammel er IKKE til efterproevning endnu, N+1 er.
  const alderMedNyeste = { aeldste: '2026-07-01', nyeste: '2026-08-01', median: '2026-07-15', antal: 3 };
  ok('tilEfterproevning: 24 dage gammel, graense 23 -> til efterproevning (24 > 23)',
    alder.tilEfterproevning(alderMedNyeste, '2026-08-25', 23) === true);
  ok('tilEfterproevning: 24 dage gammel, graense 24 -> IKKE til efterproevning (24 er ikke > 24)',
    alder.tilEfterproevning(alderMedNyeste, '2026-08-25', 24) === false);
  ok('tilEfterproevning: 24 dage gammel, graense 25 -> IKKE til efterproevning',
    alder.tilEfterproevning(alderMedNyeste, '2026-08-25', 25) === false);
  ok('tilEfterproevning: robot uden daterede kilder (alder === null) er ALDRIG til efterproevning her - ' +
    'den staar allerede i sin egen tilstand, "til efterproevning" maaler fra en nyeste-dato, den ikke har',
    alder.tilEfterproevning(null, '2026-08-25', 0) === false);

  // datoerIRobot: samler felter + anvendelse + billede, og IGNORERER bevidst
  // bare tilstand-strenge og tilstandsposter uden en gyldig "hentet".
  const doc = {
    felter: {
      egenvaegt: { vaerdi: 60, enhed: 'kg', kilde: 'https://example.com', hentet: '2026-08-01' },
      frihedsgrader: 'ikke_oplyst',                                    // bar tilstand - ingen dato at samle
      driftstid: { vaerdi: 'ikke_oplyst', kilde: 'https://example.com' }, // tilstandspost UDEN hentet
      hastighed: { vaerdi: 5, enhed: 'm/s', kilde: 'https://example.com', hentet: '2026-08-10' },
    },
    anvendelse: { vaerdi: 'industri', citat: 'x', kilde: 'https://example.com', hentet: '2026-08-05' },
    billede: { fil: 'silhuetter/x.svg', ophav: 'silhuet', kilde: 'https://example.com', hentet: '2026-08-15' },
  };
  const datoer = alder.datoerIRobot(doc);
  ok('datoerIRobot: 4 gyldige datoer fundet (2 felter + anvendelse + billede), 2 felter uden dato sprunget over',
    datoer.length === 4
    && ['2026-08-01', '2026-08-10', '2026-08-05', '2026-08-15'].every((d) => datoer.includes(d)),
    JSON.stringify(datoer));

  const docUdenDato = { felter: { egenvaegt: 'ikke_oplyst' }, anvendelse: 'ikke_oplyst' };
  ok('datoerIRobot: en robot helt uden daterede kilder giver en tom liste, ikke en fejl',
    Array.isArray(alder.datoerIRobot(docUdenDato)) && alder.datoerIRobot(docUdenDato).length === 0);
}
