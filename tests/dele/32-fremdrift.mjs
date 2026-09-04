/**
 * tests/dele/32-fremdrift.mjs — spor/datafelter (31. aug 2026), opgave A.
 *
 * "fremdrift" er et nyt PÅKRÆVET identitetsfelt (IDENTITET_PAAKRAEVET), skrevet
 * af os som "status" — ikke et FELTER-felt, som producenten oplyser eller lader
 * være med at oplyse. To gyldige værdier: "ben" (går udelukkende på ben) og
 * "ben_hjul" (mindst ét hjuldrevet segment ved siden af benene).
 *
 * Denne fil beviser selve REGLEN (samme mønster som "status" i
 * dele/01-validator-regler.mjs's ITUSLAAEDE_HOVED/GYLDIGE_HOVED): manglende
 * fremdrift og en ugyldig værdi skal fælde R1, gyldige værdier skal passere —
 * plus en stikprøve mod det RIGTIGE datasæt, så tallet i rapporten er MÅLT,
 * ikke antaget.
 */
import fs from 'node:fs';
import path from 'node:path';

const HOVED = `slug: NAVN
navn: Proeve
producent: Proeveproducent
producentland: Kina
status: i_produktion
`;

export default async function koer(ctx) {
  const { tmp, ok, skema, hentRobotter, koerValidator } = ctx;

  console.log('\n32. "fremdrift" — nyt paakraevet identitetsfelt (spor/datafelter)');

  console.log('  1. Skemaet: to gyldige vaerdier, og feltet er identitet, ikke FELTER');
  {
    ok('FREMDRIFT_VAERDIER er praecis ["ben", "ben_hjul"]',
      Array.isArray(skema.FREMDRIFT_VAERDIER)
      && skema.FREMDRIFT_VAERDIER.length === 2
      && skema.FREMDRIFT_VAERDIER.includes('ben')
      && skema.FREMDRIFT_VAERDIER.includes('ben_hjul'),
      JSON.stringify(skema.FREMDRIFT_VAERDIER));
    ok('fremdrift er et PAAKRAEVET identitetsfelt (som status)',
      skema.IDENTITET_PAAKRAEVET.includes('fremdrift'));
    ok('fremdrift taeller IKKE i specifikationstaetheden (staar ikke i FELTNAVNE)',
      !skema.FELTNAVNE.includes('fremdrift'));
  }

  console.log('  2. Validatoren: manglende/ugyldig fremdrift fejler paa R1, gyldige vaerdier passerer');
  {
    const FELTER = 'felter:\n  egenvaegt: ikke_oplyst\n';

    // Manglende fremdrift helt - identitetsfeltet mangler (samme R1 som manglende status).
    const udenFremdrift = HOVED.replace('NAVN', 'sag-32-uden') + FELTER;
    const filUden = path.join(tmp, 'sag-32-uden.yaml');
    fs.writeFileSync(filUden, udenFremdrift, 'utf8');
    const rUden = koerValidator([filUden]);
    ok('robot helt uden fremdrift  ->  R1',
      rUden.kode === 1 && /fremdrift.*\bR1:/.test(rUden.ud),
      rUden.kode !== 1 ? `exit ${rUden.kode}, forventede 1` : `ingen R1/fremdrift i udskriften: ${rUden.ud.trim()}`);

    // Ugyldig vaerdi - hverken "ben" eller "ben_hjul".
    const ugyldig = HOVED.replace('NAVN', 'sag-32-ugyldig') + 'fremdrift: "hjul"\n' + FELTER;
    const filUgyldig = path.join(tmp, 'sag-32-ugyldig.yaml');
    fs.writeFileSync(filUgyldig, ugyldig, 'utf8');
    const rUgyldig = koerValidator([filUgyldig]);
    ok('fremdrift: "hjul" (hverken ben eller ben_hjul)  ->  R1',
      rUgyldig.kode === 1 && /fremdrift.*\bR1:/.test(rUgyldig.ud),
      rUgyldig.kode !== 1 ? `exit ${rUgyldig.kode}, forventede 1` : `ingen R1/fremdrift: ${rUgyldig.ud.trim()}`);

    // Tomt felt - identitetsfeltet er tomt, samme regel som en tom status.
    const tom = HOVED.replace('NAVN', 'sag-32-tom') + 'fremdrift: ""\n' + FELTER;
    const filTom = path.join(tmp, 'sag-32-tom.yaml');
    fs.writeFileSync(filTom, tom, 'utf8');
    const rTom = koerValidator([filTom]);
    ok('fremdrift: "" (tomt)  ->  R1',
      rTom.kode === 1 && /fremdrift.*\bR1:/.test(rTom.ud),
      rTom.kode !== 1 ? `exit ${rTom.kode}, forventede 1` : `ingen R1/fremdrift: ${rTom.ud.trim()}`);

    // De to gyldige vaerdier - modstykket, ellers beviser sagerne ovenfor kun,
    // at validatoren siger nej til alt, der hedder "fremdrift".
    for (const vaerdi of ['ben', 'ben_hjul']) {
      const gyldig = HOVED.replace('NAVN', `sag-32-gyldig-${vaerdi}`) + `fremdrift: "${vaerdi}"\n` + FELTER;
      const fil = path.join(tmp, `sag-32-gyldig-${vaerdi}.yaml`);
      fs.writeFileSync(fil, gyldig, 'utf8');
      const r = koerValidator([fil]);
      ok(`fremdrift: "${vaerdi}"  ->  passerer`, r.kode === 0,
        r.ud.trim().split('\n').filter((l) => l.startsWith('FEJL')).join(' / '));
    }
  }

  console.log('  3. Stikproeve mod det RIGTIGE datasaet (databasens 77 robotter) - MAALT, ikke gaettet');
  {
    // AA183/L84: laeser hentRobotter() (databasen), ikke data/robots/ - mappen
    // er slettet.
    const robotter = (await hentRobotter()).map((d) => skema.normaliserRobot(d));
    ok('77 robotfiler laest', robotter.length === 77, `fik ${robotter.length}`);

    const udenFremdrift = robotter.filter((r) => typeof r.fremdrift !== 'string' || r.fremdrift.trim() === '');
    ok('alle 77 robotter har et udfyldt fremdrift-felt',
      udenFremdrift.length === 0,
      udenFremdrift.map((r) => r.slug).join(', '));

    const ugyldige = robotter.filter((r) => !skema.FREMDRIFT_VAERDIER.includes(r.fremdrift));
    ok('ingen robot har en fremdrift-vaerdi uden for FREMDRIFT_VAERDIER',
      ugyldige.length === 0,
      ugyldige.map((r) => `${r.slug}=${JSON.stringify(r.fremdrift)}`).join(', '));

    const benHjul = robotter.filter((r) => r.fremdrift === 'ben_hjul').map((r) => r.slug).sort();
    const ben = robotter.filter((r) => r.fremdrift === 'ben').map((r) => r.slug).sort();
    // IKKE et haardkodet facit-slug-array: paastanden er summen (ben + ben_hjul
    // == alle 77) og at ingen robot staar i begge lister. De FAKTISKE tal
    // (24 ben_hjul / 53 ben, maalt 31. aug 2026 mod hver robots egen kilde-URL
    // via producentens "wheeled"/"hjulbenet"-ordlyd i noter/citat/alt-tekst) hoerer
    // hjemme i agentrapporten, ikke som et haandskrevet tal her - en fremtidig
    // ny robot maa gerne aendre optaellingen uden at braekke denne proeve.
    ok('hver robot er praecis ÉN af ben/ben_hjul, og de to lister daekker alle 77',
      ben.length + benHjul.length === 77 && new Set([...ben, ...benHjul]).size === 77,
      `ben=${ben.length}, ben_hjul=${benHjul.length}`);
  }
}
