/**
 * tests/dele/20-aflaesningslinje.mjs — spor/typografi, punkt 5.
 *
 * Vagt om de tre ting, JPK's ordre 27. aug 2026 handlede om, og som INTET
 * andet i tests/ daekker. Baggrunden staar i commit-beskederne til punkt 1 og
 * 2; kort fortalt viste kortene et altid-synligt "*" ved siden af hvert tal
 * med et forbehold, vaerdilinjen braekkede i 175 af 261 talceller, og
 * kildebogstavet - sidens signatur - faldt med ned paa linje to.
 *
 * De tre paastande her er valgt, fordi de kan gaa i stykker HVER FOR SIG og
 * uden at nogen opdager det:
 *
 *   1. INTET SYNLIGT FORBEHOLDS-TEGN i en kompakt celle. Det er let at
 *      genindfoere: forbeholdet tegnes fire steder (side.mjs' fnote(),
 *      robot.mjs' forbehold(), sammenligning.js' fnote() og skabelonernes
 *      egne kald), og de har tidligere divergeret. D14 vil give forbehold to
 *      niveauer og et DESIGNET maerke; naar det sker, skal denne test rettes
 *      bevidst - ikke slettes. Den maaler den nuvaerende regel, ikke en evig.
 *
 *   2. FORBEHOLDSTEKSTEN FORSVINDER IKKE. Punkt 1 flyttede kun den synlige
 *      gengivelse; teksten skal stadig staa i title (mus) og i .kunskaerm
 *      (skaermlaeser). Uden denne paastand ville "fjern stjernen" kunne
 *      loeses ved at fjerne oplysningen, og bygget ville stadig vaere groent.
 *      Taellingen er nedre graenser, ikke faste tal: kataloget vokser.
 *
 *   3. KILDEBOGSTAVER PAA KORTENE. Hvert tal baerer sin egen kilde (K1), og
 *      maerket er det eneste sted, kortet siger hvilken. Falder det ud - fordi
 *      `maerke`-flaget eller kilde-registret aendres - staar tallene tilbage
 *      uden herkomst, og siden holder op med at vaere det, den er.
 *
 * Bygger sit eget dist i sin egen undermappe af ctx.tmp, jf. tests/LAESMIG.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

/** Klipper alle kompakte striber ud af én side. Samme greb som
 *  17-kortstribe-flader.mjs: find aabningen, skaer frem til dens </ul>. */
function kompakteStriber(html) {
  const ud = [];
  let fra = 0;
  for (;;) {
    const s = html.indexOf('<ul class="stribe stribe--kompakt', fra);
    if (s === -1) break;
    const e = html.indexOf('</ul>', s);
    if (e === -1) break;
    ud.push(html.slice(s, e + 5));
    fra = e + 5;
  }
  return ud;
}

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n20. spor/typografi: aflaesningslinjen - intet synligt forbeholds-tegn, ingen tabt tekst, kilde paa kortene');

  const udMappe = path.join(tmp, 'dist-aflaesningslinje');
  fs.rmSync(udMappe, { recursive: true, force: true });
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${udMappe}`],
    { cwd: rod, encoding: 'utf8' });
  ok('build.mjs giver exit 0 (frisk byg til midlertidig mappe)',
    b.status === 0, (b.stdout || b.stderr || '').trim().split('\n').slice(-3).join(' / '));
  if (b.status !== 0) return;

  /* Alle byggede sider paa begge sprog. */
  const sider = [];
  (function gaa(m) {
    if (!fs.existsSync(m)) return;
    for (const p of fs.readdirSync(m, { withFileTypes: true })) {
      const sti = path.join(m, p.name);
      if (p.isDirectory()) gaa(sti);
      else if (p.name.endsWith('.html')) sider.push(sti);
    }
  })(udMappe);
  ok(`der blev bygget sider at maale paa (${sider.length} .html)`, sider.length > 0);

  let kompakteCeller = 0;
  let synligeTegn = 0;
  let kunskaermIAlt = 0;
  let stykkerMedForbehold = 0;
  /* Et "stykke" = én vaerdikontekst: en stribecelle, en feltlisteraekke
     eller et yderpunkt paa forsiden. Dokumentet skaeres ved hver kendt
     kontekststart, saa et forbehold hoerer til praecis ét stykke. */
  const STYKKE_START = /(?=<li[ >])|(?=<div class="raekke">)|(?=<div class="yderpunkt-krop">)/;
  let skjulteForbehold = 0;
  let forbeholdUdenTekst = 0;
  const tegnEksempler = [];
  const tomEksempler = [];
  /* Pr. FLADE, ikke i ét tal. Et samlet gennemsnit skjuler praecis den fejl,
     der findes nedenfor: to flader baerer kildemaerker, den tredje slet ingen,
     og summen ser bare "lav" ud. */
  const flade = (sti) => (sti.includes(`${path.sep}producenter${path.sep}`) ? 'producent'
    : sti.includes(`${path.sep}robotter${path.sep}`) ? 'katalog' : 'forside');
  const striber = { katalog: 0, forside: 0, producent: 0 };
  const medKilde = { katalog: 0, forside: 0, producent: 0 };
  let legendePaaProducent = 0;

  for (const sti of sider) {
    const html = fs.readFileSync(sti, 'utf8');
    kunskaermIAlt += (html.match(/class="kunskaerm"/g) || []).length;
    for (const stykke of html.split(STYKKE_START)) {
      if (stykke.includes('forbehold--skjult')) stykkerMedForbehold++;
    }

    const f = flade(sti);
    const stribeListe = kompakteStriber(html);
    if (f === 'producent' && stribeListe.length && /class="t-lille kort-legende"/.test(html)) {
      legendePaaProducent++;
    }
    for (const stribe of stribeListe) {
      striber[f]++;
      if (/class="kildemaerke/.test(stribe)) medKilde[f]++;
      for (const celle of stribe.split('<li').slice(1)) {
        kompakteCeller++;

        /* 1. Et forbehold maa ikke saette et synligt tegn. Vi leder efter
           BAADE den gamle klasse og et hvilket som helst aria-hidden-tegn
           inde i vaerdispannet - det var praecis formen, stjernen havde
           (<span aria-hidden="true">*</span>), og en ny variant ville
           sandsynligvis ligne den. Operatoren bruger ogsaa aria-hidden, men
           den staar i <span class="op">, som undtages her, fordi den er en
           DEL AF TALLET (regel 4), ikke et forbehold. */
        if (/class="forbehold forbehold--tegn"/.test(celle)) {
          synligeTegn++;
          if (tegnEksempler.length < 3) tegnEksempler.push(path.basename(path.dirname(sti)));
        }
        const friTegn = celle.match(/<span aria-hidden="true">([^<]*)<\/span>/g) || [];
        for (const t of friTegn) {
          if (/class="op"/.test(t)) continue;
          const indhold = t.replace(/<[^>]*>/g, '').trim();
          if (indhold === '*' || indhold === '†' || indhold === '‡') {
            synligeTegn++;
            if (tegnEksempler.length < 3) tegnEksempler.push(`${path.basename(path.dirname(sti))}: ${indhold}`);
          }
        }

        /* 2. Hvert skjult forbehold SKAL baere sin tekst begge steder. */
        for (const m of celle.matchAll(/<abbr class="forbehold--skjult"([^>]*)>(.*?)<\/abbr>/g)) {
          skjulteForbehold++;
          const harTitle = /title="[^"]+"/.test(m[1]);
          const harSkaerm = /<span class="kunskaerm">[^<]+<\/span>/.test(m[2]);
          if (!harTitle || !harSkaerm) {
            forbeholdUdenTekst++;
            if (tomEksempler.length < 3) {
              tomEksempler.push(`${path.basename(path.dirname(sti))} (title:${harTitle} kunskaerm:${harSkaerm})`);
            }
          }
        }
      }
    }
  }

  ok(`intet synligt forbeholds-tegn i nogen kompakt celle (0 af ${kompakteCeller} celler)`,
    kompakteCeller > 0 && synligeTegn === 0,
    synligeTegn ? `${synligeTegn} fundet, fx: ${tegnEksempler.join(', ')}` : '');

  ok(`hvert skjult forbehold baerer sin tekst i BAADE title og .kunskaerm (${skjulteForbehold} forbehold, 0 uden)`,
    skjulteForbehold > 0 && forbeholdUdenTekst === 0,
    forbeholdUdenTekst ? `${forbeholdUdenTekst} uden tekst, fx: ${tomEksempler.join(', ')}` : '');

  /* Nedre graenser, ikke faste tal - kataloget vokser, og en test, der
     knaekker af en ny robot, bliver slettet i stedet for laest. Tallene i
     parentes er MAALT 27. aug 2026 paa 77 robotter og staar der, saa et fald
     kan ses som et fald og ikke forveksles med en tom maaling. */
  /* VENDT 28. aug 2026 (spor/maerke-c). Testen taalte foer RAA
     .kunskaerm-forekomster mod et gulv paa 2000 (maalt 2154 den 27. aug).
     Det maal kan ikke skelne "tekst forsvandt" fra "dublet fjernet": af
     de 2154 laa 396 i stykker, der udskrev det SAMME forbehold to gange,
     fordi robot.mjs' vaerdi() lagde forbehold() oven paa side.mjs' tal(),
     som allerede havde udskrevet lastbetingelsen. Da dubletterne
     forsvandt, faldt raa-tallet til 1758 - uden at én eneste oplysning
     gik tabt.

     Nu taelles det, denne test hele tiden VILLE vaerne om: hvor mange
     stykker der baerer mindst ét forbehold. Det tal var 940 baade FOER
     og EFTER afdublingen, og netop derfor er det det rigtige maal - det
     er ufoelsomt over for, hvor mange GANGE det samme forbehold tegnes,
     og foelsomt over for, at ét forsvinder. Taber en aendring ét stykke,
     fejler den her. */
  const STYKKE_GULV = 940;   // maalt 28. aug 2026; raa .kunskaerm samme dag: 1758
  ok(`forbeholdene er ikke forsvundet: ${stykkerMedForbehold} stykker baerer mindst ét forbehold (gulv ${STYKKE_GULV}, maalt 940 den 28. aug 2026; raa .kunskaerm: ${kunskaermIAlt})`,
    stykkerMedForbehold >= STYKKE_GULV, `fandt ${stykkerMedForbehold}`);

  /* 3. Kildebogstaverne, pr. flade. Ikke alle kort KAN baere et maerke - et
     felt uden `kilde:` i YAML'en faar ingen, og det er den rigtige opfoersel
     (et hul uden kilde er en anden oplysning end et hul med). Derfor et
     gulv, ikke et krav om 100 %: maalt 27. aug 2026 laa katalog paa 76 af
     154 og forsiden paa 8 af 12. */
  for (const [navn, gulv, maalt] of [['katalog', 0.35, '76 af 154'], ['forside', 0.35, '8 af 12']]) {
    ok(`${navn}: kortene baerer kildebogstaver (${medKilde[navn]} af ${striber[navn]} striber, gulv ${gulv * 100} %, maalt ${maalt} den 27. aug 2026)`,
      striber[navn] > 0 && medKilde[navn] / striber[navn] >= gulv,
      `${medKilde[navn]}/${striber[navn]}`);
  }

  /* Rettet (spor/proveniens, KRITIK-4 fund 2, 27. aug 2026): kompaktStribe()
     i producent.mjs regner nu maerket ud selv, via H.kildemaerke(post, kilder,
     hvorhen) med hvorhen = sti(ctx,'robot', m.slug) - samme anker-mekanisme
     som katalog- og forsidekortene bruger til at pege paa robottens egen
     #kilde-<bogstav>. Samme gulv som de to flader ovenfor, ikke 100 %: et
     kort uden kildebelagt tal blandt sine fire felter faar ret ingen maerke. */
  ok(`producentsidernes minikort baerer kildebogstaver (${medKilde.producent} af ${striber.producent} striber, gulv 35 %, maalt 142 af 154 den 27. aug 2026)`,
    striber.producent > 0 && medKilde.producent / striber.producent >= 0.35,
    `${medKilde.producent}/${striber.producent} striber har et kildemaerke, ${legendePaaProducent} producentsider trykker kort_legende`);
}
