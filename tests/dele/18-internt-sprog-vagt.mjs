/**
 * tests/dele/18-internt-sprog-vagt.mjs — R19, den mekaniske vagt mod internt
 * sprog i "advarsel:" og "noter:" (Å25, 27. aug 2026).
 *
 * En regel, der ikke er bevist at kunne fejle, beviser ingenting: dette
 * bekraefter, at en robotfil med "se galileo-c1.yaml" i en advarsel AFVISES
 * af validatoren med netop R19 - samt at reglen daekker "noter:", flere andre
 * moenstre fra briefets liste, og ikke rammer legitim producenttekst.
 */
import fs from 'node:fs';
import path from 'node:path';

const HOVED = `slug: NAVN
navn: Proeve
producent: Proeveproducent
producentland: Kina
status: i_produktion
fremdrift: ben
`;

export default async function koer(ctx) {
  const { tmp, ok, koerValidator } = ctx;

  console.log('\n18. R19 — internt sprog i advarsel/noter afvises');

  // 1. Det navngivne tilfaelde fra briefet: "se galileo-c1.yaml" i en advarsel.
  {
    const indhold = HOVED.replace('NAVN', 'sag-18-0') +
      `felter:\n  nyttelast_gaaende:\n    vaerdi: 8\n    enhed: kg\n` +
      `    kilde: https://example.com/a\n    hentet: 2026-08-19\n` +
      `    advarsel: "samme fortolkning som C1, se galileo-c1.yaml"\n`;
    const fil = path.join(tmp, 'sag-18-0.yaml');
    fs.writeFileSync(fil, indhold, 'utf8');
    const r = koerValidator([fil]);
    ok('advarsel med "se galileo-c1.yaml"  ->  R19',
      r.kode === 1 && /\bR19:/.test(r.ud),
      r.kode !== 1 ? `exit ${r.kode}, forventede 1` : `ingen R19 i udskriften`);
  }

  // 2. Reglen skal ogsaa daekke noter: - ikke kun advarsel:.
  {
    const indhold = HOVED.replace('NAVN', 'sag-18-1') +
      `noter:\n  - "STOPPROEVE (firbenet): BESTAAET, entydigt."\n` +
      `felter:\n  egenvaegt: ikke_oplyst\n`;
    const fil = path.join(tmp, 'sag-18-1.yaml');
    fs.writeFileSync(fil, indhold, 'utf8');
    const r = koerValidator([fil]);
    ok('noter med "STOPPROEVE ... BESTAAET"  ->  R19',
      r.kode === 1 && /\bR19:/.test(r.ud),
      r.kode !== 1 ? `exit ${r.kode}, forventede 1` : `ingen R19 i udskriften`);
  }

  // 3. Resten af briefets liste - ét tilfaelde pr. moenster, saa reglen ikke kun
  //    er bevist paa de to mest oplagte.
  const MOENSTRE = [
    ['internt feltnavn ved_last', 'ved_last er derfor ikke_oplyst, ikke et gaettet kg-tal.'],
    ['internt feltnavn _gaaende', 'Placeringen i nyttelast_gaaende er vores tolkning.'],
    ['internt feltnavn _staaende', 'nyttelast_staaende er derfor ikke_oplyst, ikke 0.'],
    ['vaerktoejsnavnet validator', 'Konsekvens for validatoren: den skal tjekke enheden.'],
    ['filendelsen .mjs', 'Se build.mjs for hvordan feltet bruges.'],
    ['direkte instruks "skal normaliseres"', 'Skal normaliseres i indlaesningen, ellers fejler parseren.'],
    ['direkte instruks "i indlaesningen"', 'Rettes i indlaesningen, ikke her.'],
  ];
  MOENSTRE.forEach(([navn, tekst], i) => {
    const indhold = HOVED.replace('NAVN', `sag-18-m${i}`) +
      `felter:\n  egenvaegt:\n    vaerdi: 10\n    enhed: kg\n` +
      `    kilde: https://example.com/a\n    hentet: 2026-08-19\n` +
      `    advarsel: "${tekst}"\n`;
    const fil = path.join(tmp, `sag-18-m${i}.yaml`);
    fs.writeFileSync(fil, indhold, 'utf8');
    const r = koerValidator([fil]);
    ok(`${navn}  ->  R19`, r.kode === 1 && /\bR19:/.test(r.ud),
      r.kode !== 1 ? `exit ${r.kode}, forventede 1` : `ingen R19 i udskriften`);
  });

  // 4. Modstykket: en almindelig, laeservendt advarsel MAA IKKE fanges af R19.
  //    Uden dette tilfaelde beviser testen kun, at reglen siger nej til alt.
  {
    const indhold = HOVED.replace('NAVN', 'sag-18-gyldig') +
      `felter:\n  nyttelast_gaaende:\n    vaerdi: 8\n    enhed: kg\n` +
      `    kilde: https://example.com/a\n    hentet: 2026-08-19\n` +
      `    advarsel: "samme fortolkning som hos C1. Identisk tal med den gaaende C1."\n`;
    const fil = path.join(tmp, 'sag-18-gyldig.yaml');
    fs.writeFileSync(fil, indhold, 'utf8');
    const r = koerValidator([fil]);
    ok('almindelig, laeservendt advarsel passerer R19', r.kode === 0, r.ud.trim());
  }

  // 5. "arvet_fra" er et LOVLIGT topnoegle-feltnavn (R17) og maa ikke fanges af
  //    R19, naar det staar som en YAML-noegle - kun naar det staar som ORD i en
  //    advarsel/note-tekst (R19 laeser kun tekstindholdet, aldrig noeglenavne).
  {
    const indhold = HOVED.replace('NAVN', 'sag-18-arv') +
      `anvendelse:\n  vaerdi: industri\n  citat: "Robot - Industry"\n` +
      `  kilde: https://example.com/a\n  hentet: 2026-08-19\n  arvet_fra: en-mor\n` +
      `felter:\n  egenvaegt: ikke_oplyst\n`;
    const fil = path.join(tmp, 'sag-18-arv.yaml');
    fs.writeFileSync(fil, indhold, 'utf8');
    const r = koerValidator([fil]);
    // Filen fejler paa R17 (moderen findes ikke) - IKKE paa R19. Beviser at
    // vagten laeser tekstindhold, ikke YAML-noeglenavne.
    ok('"arvet_fra" som YAML-noegle udloeser ikke R19 (kun R17)',
      !/\bR19:/.test(r.ud), r.ud.trim());
  }
}
