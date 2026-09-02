/**
 * tests/dele/69-fase2-tjek.mjs — spor/f2-maal, punkt 5 (fund/BRIEF-f2-maal.md).
 * Efter kontrakten i tests/LAESMIG.md. Nummer 69 TILDELT af briefet (68 var
 * hoejeste, da briefet blev skrevet) — efterproevet 2. sep 2026 mod BAaDE
 * denne worktrees egen tests/dele/ OG de to soester-grene, der arbejder
 * paa fase 2 samtidig (spor/f2-pilot, spor/f2-cjk, via `git ls-tree`): ingen
 * af dem har rørt 69 endnu.
 *
 * INGEN DATABASEADGANG — hverken db/fase2-tjek.mjs's hentRobotter()/
 * laesForbindelse() eller db/f2-skriv.mjs's skrivPost()/laesForbindelse()
 * kaldes nogensinde herfra. Alt koerer paa fixturen
 * tests/dele/fixtures/69-robot.json (ÉN syntetisk robot, IKKE en rigtig
 * producent) plus haandskrevne strenge til dansk-detektoren. At importere
 * modulerne er sikkert: begge filers "erHoved"-vagt tjekker
 * process.argv[1] mod eget filnavn og fyrer ALDRIG, naar filen importeres
 * som modul af en testloeber.
 *
 * Daekker (briefets seks minimumskrav, nummereret som i briefet):
 *   1. aftryksfunktionen er stabil under nøgleomrokering
 *   2. aftrykket AeNDRER sig ved et aendret tal — og (udvidelse, samme
 *      pointe fra den anden side) UAeNDRET ved en aendret TEKST-kolonne,
 *      som er selve instrumentets raison d'être
 *   3. dansk-detektoren fanger BAaDE æøå ALENE og ordlisten ALENE
 *   4. en ren engelsk streng slipper igennem
 *   5. hvidlisten i f2-skriv.mjs afviser en talkolonne
 *   6. en post uden change_reason afvises
 * Plus stikproever paa danskAlle()/taelKolonne() over den fulde fixture,
 * ordlydIndeholderTal() (punkt 3-instrumentet) og byggUrl/byggBody
 * (rene funktioner, f2-skriv.mjs).
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  robotAftryk, robotAftrykData, canonJSON, sha256,
  erDansk, harAeoeaa, danskAlle, ordlydIndeholderTal,
} from '../../db/fase2-tjek.mjs';
import { valider, byggUrl, byggBody, TABEL_NOEGLER, TEKSTKOLONNE_HVIDLISTE } from '../../db/f2-skriv.mjs';

/** Vender noeglerraekkefoelgen om paa ALLE dybder — deterministisk, men
 *  GARANTERET forskellig fra fixturens egen skriverekkefoelge (JSON.parse
 *  bevarer filens raekkefoelge, saa "omvendt" er aldrig et tilfaelde af at
 *  vaere ens). Bruges KUN til at bevise, at robotAftryk() er ligeglad med
 *  den — canon() i db/fase2-tjek.mjs sorterer allerede noegler, saa denne
 *  test er selve beviset for, at den sortering rent faktisk virker. */
function omrokerNoegler(v) {
  if (Array.isArray(v)) return v.map(omrokerNoegler);
  if (v !== null && typeof v === 'object') {
    const ud = {};
    for (const k of Object.keys(v).slice().reverse()) ud[k] = omrokerNoegler(v[k]);
    return ud;
  }
  return v;
}

export default async function koer(ctx) {
  const { ok } = ctx;

  const fixturSti = path.join(ctx.rod, 'tests/dele/fixtures/69-robot.json');
  const original = JSON.parse(fs.readFileSync(fixturSti, 'utf8'));

  /* -------------------------------------------------- (1) stabil under noegleomrokering */
  const original2 = JSON.parse(fs.readFileSync(fixturSti, 'utf8')); // uafhaengig parsning
  const omrokeret = omrokerNoegler(original2);
  ok('(1) robotAftryk er stabil under noegleomrokering (canon() sorterer korrekt)',
    robotAftryk(original) === robotAftryk(omrokeret),
    `${robotAftryk(original)} vs ${robotAftryk(omrokeret)}`);

  /* -------------------------------------------------- (2) foelsom for tal, blind for tekst */
  const foerAftryk = robotAftryk(original);

  const talAendret = JSON.parse(fs.readFileSync(fixturSti, 'utf8'));
  talAendret.field_entries[0].value_number = 999;
  ok('(2a) aftrykket AeNDRER sig, naar value_number aendres',
    robotAftryk(talAendret) !== foerAftryk,
    `${foerAftryk} vs ${robotAftryk(talAendret)}`);

  const variantTalAendret = JSON.parse(fs.readFileSync(fixturSti, 'utf8'));
  variantTalAendret.field_entries[0].field_entry_variants[0].value = 12345;
  ok('(2b) aftrykket AeNDRER sig ogsaa ved et aendret field_entry_variants.value',
    robotAftryk(variantTalAendret) !== foerAftryk);

  const tekstAendret = JSON.parse(fs.readFileSync(fixturSti, 'utf8'));
  tekstAendret.field_entries[0].caveat = 'A completely different English caveat text.';
  tekstAendret.applications.note = 'Also a different note.';
  tekstAendret.images.alt.en = 'A different alt text.';
  ok('(2c) aftrykket er UAeNDRET, naar KUN tekstkolonner (caveat/note/alt) aendres — selve pointen',
    robotAftryk(tekstAendret) === foerAftryk,
    `${foerAftryk} vs ${robotAftryk(tekstAendret)}`);

  /* -------------------------------------------------- (3) dansk-detektoren, to ben */
  const aeoeaaStreng = 'Ekstra præcision: ±0,3 mm.';
  const ordlisteStreng = 'Producenten har ikke oplyst dette tal i skemaet.';
  ok('(3a) erDansk fanger æøå-alene (harAeoeaa alene er nok til at forklare traeffet)',
    erDansk(aeoeaaStreng) === true && harAeoeaa(aeoeaaStreng) === true);
  ok('(3b) erDansk fanger ordliste-alene (uden æøå)', erDansk(ordlisteStreng) === true);
  ok('(3b) den ordliste-streng har IKKE æøå — beviser at DET var ordlisten, der fangede den, ikke æøå',
    harAeoeaa(ordlisteStreng) === false);

  /* -------------------------------------------------- (4) ren engelsk slipper igennem */
  const engelskStreng = 'The manufacturer states this value clearly in the specification sheet.';
  ok('(4) en ren engelsk saetning (ingen æøå, intet markoerord) er IKKE dansk',
    erDansk(engelskStreng) === false);
  ok('(4) samme saetning har heller ingen æøå (kontrol — beviser paastanden ikke er triviel)',
    harAeoeaa(engelskStreng) === false);

  /* -------------------------------------------------- danskAlle() paa hele fixturen */
  const dansk = danskAlle([original]);
  const kolonne = Object.fromEntries(dansk.map((r) => [r.navn, r]));
  ok('danskAlle: caveat 2 i alt, 2 dansk (begge er dansk — æøå hhv. ordliste)',
    kolonne.caveat.iAlt === 2 && kolonne.caveat.dansk === 2,
    JSON.stringify(kolonne.caveat));
  ok('danskAlle: caveat_wording 1 i alt, 0 dansk (allerede engelsk)',
    kolonne.caveat_wording.iAlt === 1 && kolonne.caveat_wording.dansk === 0);
  ok('danskAlle: robots.notes 2 elementer, 1 dansk ("robotten" er et ordliste-ord, ingen æøå)',
    kolonne['robots.notes'].iAlt === 2 && kolonne['robots.notes'].dansk === 1,
    JSON.stringify(kolonne['robots.notes']));
  ok('danskAlle: images.alt laeser .en (ikke .da) — 1 i alt, 0 dansk (en-teksten er ren engelsk)',
    kolonne['images.alt'].iAlt === 1 && kolonne['images.alt'].dansk === 0);

  /* -------------------------------------------------- --belaeg: ordlydIndeholderTal */
  ok('ordlydIndeholderTal: "42" findes i "Weight excl. battery: 42 kg"',
    ordlydIndeholderTal('Weight excl. battery: 42 kg', 42) === true);
  ok('ordlydIndeholderTal: tusind-adskiller "15,999" findes for tallet 15999',
    ordlydIndeholderTal('Listed at ¥15,999 total.', 15999) === true);
  ok('ordlydIndeholderTal: intet traef, naar tallet slet ikke staar i teksten',
    ordlydIndeholderTal('Nothing about the number here.', 42) === false);
  ok('ordlydIndeholderTal: "18" traeffer IKKE inde i "180" (lookaround-graensen virker)',
    ordlydIndeholderTal('The limit is 180 degrees.', 18) === false);

  /* -------------------------------------------------- (5) hvidlisten afviser en talkolonne */
  const talForsoeg = valider([{
    tabel: 'field_entries', noegle: { robot_id: 1, field_name: 'weight' },
    saet: { value_number: 5 }, change_reason: 'forsoeg',
  }]);
  ok('(5) valider() afviser en post, hvis "saet" indeholder en ikke-hvidlistet (tal)kolonne',
    talForsoeg.fejl.length === 1 && /value_number/.test(talForsoeg.fejl[0]),
    JSON.stringify(talForsoeg.fejl));
  ok('(5) TEKSTKOLONNE_HVIDLISTE indeholder IKKE nogen kendt talkolonne',
    ['value_number', 'minimum', 'maximum', 'value_bool', 'value_list', 'unit'].every((k) => !TEKSTKOLONNE_HVIDLISTE.has(k)));

  /* -------------------------------------------------- (6) manglende change_reason afvises */
  const utenReason = valider([{
    tabel: 'robots', noegle: { id: 1 }, saet: { manufacturer_city: 'X' },
  }]);
  ok('(6) valider() afviser en post uden change_reason',
    utenReason.fejl.length === 1 && /change_reason/.test(utenReason.fejl[0]),
    JSON.stringify(utenReason.fejl));

  const tomReason = valider([{
    tabel: 'robots', noegle: { id: 1 }, saet: { manufacturer_city: 'X' }, change_reason: '   ',
  }]);
  ok('(6) valider() afviser ogsaa en BLANK (kun mellemrum) change_reason',
    tomReason.fejl.length === 1);

  /* -------------------------------------------------- positiv kontrol: en GYLDIG post */
  const gyldig = valider([{
    tabel: 'field_entries', noegle: { robot_id: 2183, field_name: 'weight' },
    saet: { caveat: 'x', caveat_wording: 'y' }, change_reason: 'legitim aendring',
  }]);
  ok('valider(): en fuldt gyldig post giver 0 fejl (positiv kontrol — validatoren afviser ikke ALTING)',
    gyldig.fejl.length === 0, JSON.stringify(gyldig.fejl));

  /* -------------------------------------------------- forkert noeglesaet afvises */
  const forkertNoegle = valider([{
    tabel: 'field_entries', noegle: { robot_id: 2183 }, // mangler field_name
    saet: { caveat: 'x' }, change_reason: 'test',
  }]);
  ok('valider(): field_entries kraever PRAeCIS {robot_id, field_name} som noegle',
    forkertNoegle.fejl.length === 1 && /noegle/.test(forkertNoegle.fejl[0]));

  /* -------------------------------------------------- byggUrl / byggBody (rene funktioner) */
  ok('byggUrl: robots {id: 5} -> ?id=eq.5',
    byggUrl('https://x.test', 'robots', { id: 5 }) === 'https://x.test/rest/v1/robots?id=eq.5');
  ok('byggUrl: field_entries {robot_id, field_name} -> to eq.-filtre',
    byggUrl('https://x.test', 'field_entries', { robot_id: 7, field_name: 'weight' })
    === 'https://x.test/rest/v1/field_entries?robot_id=eq.7&field_name=eq.weight');

  const krop = byggBody({ saet: { caveat: 'a' }, change_reason: 'r' }, 'spor/pretend');
  ok('byggBody: saetter collected_by fra GREnnavnet, ALDRIG fra posten selv',
    krop.collected_by === 'spor/pretend' && krop.caveat === 'a' && krop.change_reason === 'r',
    JSON.stringify(krop));

  /* -------------------------------------------------- TABEL_NOEGLER daekker de 5 skrivbare tabeller */
  ok('TABEL_NOEGLER kender praecis de 5 skrivbare tabeller (briefets punkt 4)',
    JSON.stringify(Object.keys(TABEL_NOEGLER).sort())
    === JSON.stringify(['applications', 'field_entries', 'field_entry_variants', 'images', 'robots'].sort()));

  /* -------------------------------------------------- canonJSON/sha256 grundfacit */
  ok('canonJSON + sha256: samme input giver samme hash to gange (determinisme)',
    sha256(canonJSON({ b: 1, a: 2 })) === sha256(canonJSON({ a: 2, b: 1 })));
  ok('robotAftrykData: field_entries sorteres paa field_name (speed foer weight)',
    robotAftrykData(original).felter[0].field_name === 'speed'
    && robotAftrykData(original).felter[1].field_name === 'weight');
}
