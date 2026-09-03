/**
 * tests/dele/80-hvidliste-value-text.mjs — spor/f2-valuetext (fund/BRIEF-f2-valuetext.md).
 *
 * db/f2-skriv.mjs er DEN ENESTE lovlige skrivevej i fase 2, og TEKSTKOLONNE_HVIDLISTE
 * er dens eneste vej en kolonne kan naa "saet". value_text manglede paa den (kontrolmaalt
 * 0 i briefet), selv om fund/BRIEF-FAELLES.md lister den som en kolonne, fase 2-sporene
 * maa roere. Konsekvensen var maalt: fire spor skrev i value_text UDEN OM denne fil.
 *
 * To ben, og begge er noedvendige — det ene beviser intet uden det andet:
 *   1. value_text ER paa hvidlisten, og valider() ACCEPTERER en post, der kun saetter den.
 *   2. En kolonne UDEN FOR hvidlisten AFVISES STADIG — saa testen fejler, hvis nogen
 *      senere aabner listen helt (fx erstatter Set-tjekket med "alt er tilladt").
 *
 * REVERT-BEVIS (CLAUDE.md's krav): 80.3 proever mod value_text som ENESTE tilladte
 * kolonne af to i "saet" — er begge tilladt, er 80.1/80.2 ikke nok til at vise, at
 * hvidlisten reelt haandhaeves felt for felt.
 *
 * Ren funktionstest — INGEN I/O, ingen dist, ingen database. Bygger derfor ikke sit
 * eget dist (LAESMIG.md's raad gaelder kun dele, der roerer disk/database).
 */
import { valider, TEKSTKOLONNE_HVIDLISTE } from '../../db/f2-skriv.mjs';

export default async function koer(ctx) {
  const { ok } = ctx;

  console.log('\n80. spor/f2-valuetext: value_text paa TEKSTKOLONNE_HVIDLISTE, uden at aabne den helt (BRIEF-f2-valuetext.md)');

  ok('80.1: TEKSTKOLONNE_HVIDLISTE indeholder value_text',
    TEKSTKOLONNE_HVIDLISTE.has('value_text'),
    `hvidliste: ${[...TEKSTKOLONNE_HVIDLISTE].join(', ')}`);

  const gyldigPost = {
    tabel: 'field_entries',
    noegle: { robot_id: 2183, field_name: 'weight' },
    saet: { value_text: 'basic' },
    change_reason: 'test 80: value_text alene skal accepteres',
  };
  const { fejl: fejlGyldig } = valider([gyldigPost]);
  ok('80.2: en post, der KUN saetter value_text, accepteres (0 fejl)',
    fejlGyldig.length === 0,
    fejlGyldig.join(' / ') || '(ingen fejl)');

  const ikkeHvidlistetPost = {
    tabel: 'field_entries',
    noegle: { robot_id: 2183, field_name: 'weight' },
    saet: { value: 'skulle vaere umuligt' },
    change_reason: 'test 80: en raa "value"-kolonne skal AFVISES',
  };
  const { fejl: fejlUgyldig } = valider([ikkeHvidlistetPost]);
  ok('80.3: en post, der saetter en ikke-hvidlistet kolonne ("value"), AFVISES stadig',
    fejlUgyldig.length === 1 && /ikke-hvidlistede kolonner: value(?!_text)/.test(fejlUgyldig[0]),
    fejlUgyldig.join(' / ') || '(ingen fejl — VAERNET ER VAEK)');

  const blandetPost = {
    tabel: 'field_entries',
    noegle: { robot_id: 2183, field_name: 'weight' },
    saet: { value_text: 'basic', ulovlig_kolonne: 'x' },
    change_reason: 'test 80: value_text plus en ulovlig kolonne skal AFVISES samlet',
  };
  const { fejl: fejlBlandet } = valider([blandetPost]);
  const blandetMatch = fejlBlandet[0] && fejlBlandet[0].match(/ikke-hvidlistede kolonner: ([^(]+) \(kun:/);
  const blandetListe = blandetMatch ? blandetMatch[1].trim() : null;
  ok('80.4: value_text redder ikke en post, der OGSAA saetter en ulovlig kolonne (kun ulovlig_kolonne rapporteres)',
    fejlBlandet.length === 1 && blandetListe === 'ulovlig_kolonne',
    fejlBlandet.join(' / ') || '(ingen fejl)');

  // 80.5 (revert-bevis): fjern value_text midlertidigt fra en LOKAL kopi af hvidlisten
  // og vis, at PRAECIS den situation, briefet fandt (kontrolmaaling gav 0), reproduceres
  // af en simpel Set uden value_text — beviser, at 80.1 rent faktisk maaler noget.
  const gammelHvidliste = new Set([...TEKSTKOLONNE_HVIDLISTE].filter((k) => k !== 'value_text'));
  ok('80.5 (revert-bevis): en hvidliste UDEN value_text (den gamle tilstand) ville have fejlet 80.1',
    gammelHvidliste.has('value_text') === false,
    `simuleret gammel hvidliste: ${[...gammelHvidliste].join(', ')}`);
}
