/**
 * tests/dele/02-spec-taethed.mjs — Naevneren i specifikationstaetheden (D7,
 * lukket med L30).
 *
 * Her stod tidligere én proeve: *"taethed vises med baade 29 og 31 som naevner"*.
 * Den er vendt om, ikke slettet — reglen er nu den modsatte, og den skal bevises:
 * ÉN naevner, og den skal vaere skemaets faktiske feltantal.
 *
 * Hvorfor det ikke bare er kosmetik: `taethed()` taeller taelleren op over
 * FELTNAVNE. Stod naevneren som en haandskrevet konstant, kom broekens to halvdele
 * fra hver sin liste, og en robot med flere udfyldte felter end konstanten ville
 * give over 100 %. Proeve 2 nedenfor er den, der goer det umuligt at falde tilbage.
 *
 * Proeve 4 er den dyre: CLAUDE.md begraensning 6 forbyder en rangering uden
 * OFFENTLIGGJORT metode. Siger koden 33 og `indhold/metode.md` 31, er metoden ikke
 * offentliggjort — den er bare skrevet ned et sted, der er holdt op med at passe.
 */
import fs from 'node:fs';
import path from 'node:path';

export default async function koer(ctx) {
  const { rod, ok, skema, yaml } = ctx;

  console.log('\n3b. Naevneren (D7 / L30)');

  ok('skemaet har 30 feltnoegler', skema.FELTNAVNE.length === 30,
    `fandt ${skema.FELTNAVNE.length}`);

  // 2. Naevneren er UDLEDT. Hardkodes den igen, sprinter den her.
  ok('naevneren er skemaets feltantal, ikke et haandskrevet tal',
    skema.NAEVNER === skema.FELTNAVNE.length,
    `NAEVNER=${skema.NAEVNER}, FELTNAVNE.length=${skema.FELTNAVNE.length}`);

  // 3. ÉN naevner. To procenttal ved siden af hinanden er ikke en rangering.
  ok('bygget bruger praecis én naevner som standard',
    Array.isArray(skema.NAEVNERE_STANDARD) && skema.NAEVNERE_STANDARD.length === 1
      && skema.NAEVNERE_STANDARD[0] === skema.NAEVNER,
    JSON.stringify(skema.NAEVNERE_STANDARD));

  // 4. Den offentliggjorte metode skal sige det samme tal som koden.
  const metode = fs.readFileSync(path.join(rod, 'indhold', 'metode.md'), 'utf8');
  const formel = metode.match(/specifikationstæthed = udfyldte felter ÷ (\d+)/);
  ok('metode.md udgiver formlen med et tal', Boolean(formel),
    'fandt ingen "specifikationstæthed = udfyldte felter ÷ N"');
  ok('metode.md udgiver SAMME naevner som koden regner med',
    Boolean(formel) && Number(formel[1]) === skema.NAEVNER,
    formel ? `metode.md: ${formel[1]}, koden: ${skema.NAEVNER}` : '');

  // 5. Ingen efterladt LEVENDE reference til de to gamle skalaer.
  //    Citatlinjer (blockquote, ">") er undtaget med vilje: projektets rettelsesnoter
  //    skrives som blockquote og SKAL kunne sige "her stod tidligere ÷ 31". At forbyde
  //    det ville goere reglen usynlig i stedet for rettet — og det er praecis den
  //    slettede-assertion-adfaerd, CLAUDE.md forbyder. En paastand i broedteksten er
  //    derimod noget siden staar ved, og den skal matche koden.
  const gamle = metode.split('\n')
    .filter((l) => !/^\s*>/.test(l))
    .flatMap((l) => [...l.matchAll(/÷ (?:29|31)\b|\b(?:af|of) (?:29|31) felter/g)].map((m) => m[0]));
  ok('metode.md har ingen efterladte 29- eller 31-taellinger i broedteksten',
    gamle.length === 0, gamle.join(' · '));

  // 6. Taelleren kan ikke overstige naevneren. Med 30/30 er 100 % loftet.
  const val = await import(`file://${path.join(rod, 'tools', 'validate.mjs').replace(/\\/g, '/')}`);
  const dataMappe = path.join(rod, 'data', 'robots');
  const filer = fs.existsSync(dataMappe)
    ? fs.readdirSync(dataMappe).filter((f) => /\.ya?ml$/.test(f)) : [];
  let vaerst = 0;
  for (const f of filer) {
    const doc = skema.normaliserRobot(yaml.parseYaml(fs.readFileSync(path.join(dataMappe, f), 'utf8'), f));
    for (const d4 of [false, true]) vaerst = Math.max(vaerst, val.taethed(doc, skema.NAEVNER, d4).pct);
  }
  ok(`ingen af de ${filer.length} poster kommer over 100 % (hoejeste: ${vaerst} %)`, vaerst <= 100);
}
