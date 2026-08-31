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
  /* HELE SIDEN, ikke kun de kompakte celler (spor/kort, 31. aug 2026).
     De to krav nedenfor - "et forbehold saetter aldrig et synligt tegn" og
     "hvert skjult forbehold baerer sin tekst begge steder" - blev foer maalt
     inde i kortenes stribeceller. Kortene viser ikke laengere tal, saa den
     maaling ville vaere 0 af 0: et krav, der ikke proever noget.

     Kravene er uaendrede; de maales nu, hvor forbeholdene faktisk staar.
     Maalt samme dag: 264 af 272 stykker med forbehold ligger paa robotsiderne,
     og det tal er UROERT af dette spor. Det er den brede maaling, ikke den
     smalle, der svarer paa "gik en oplysning tabt?". */
  let sideSynligeTegn = 0;
  let sideSkjulteForbehold = 0;
  let sideForbeholdUdenTekst = 0;
  const sideTegnEksempler = [];
  const sideTomEksempler = [];
  /* Pr. FLADE, ikke i ét tal. Et samlet gennemsnit skjuler praecis den fejl,
     der findes nedenfor: to flader baerer kildemaerker, den tredje slet ingen,
     og summen ser bare "lav" ud. */
  const flade = (sti) => (sti.includes(`${path.sep}producenter${path.sep}`) ? 'producent'
    : sti.includes(`${path.sep}robotter${path.sep}`) ? 'katalog' : 'forside');
  const striber = { katalog: 0, forside: 0, producent: 0 };
  const medKilde = { katalog: 0, forside: 0, producent: 0 };
  let legendePaaProducent = 0;

  /* Forbeholdene taelles ogsaa PR. FLADE (spor/katalog, 31. aug 2026). Se den
     lange note ved gulvet nedenfor: ét samlet tal kan ikke skelne "en flade
     mistede med vilje sine tal" fra "en oplysning forsvandt et tilfaeldigt
     sted", og det var praecis den skelnen, der skulle bruges den dag. */
  const bred = (sti) => (sti.includes(`${path.sep}producenter${path.sep}`) ? 'producent'
    : path.basename(path.dirname(sti)) === 'robotter' ? 'katalogindeks'
      : sti.includes(`${path.sep}robotter${path.sep}`) ? 'robotside'
        : sti.includes('sammenligning') ? 'sammenligning' : 'forside');
  const forbeholdPrFlade = {
    forside: 0, producent: 0, robotside: 0, katalogindeks: 0, sammenligning: 0,
  };

  for (const sti of sider) {
    const html = fs.readFileSync(sti, 'utf8');
    kunskaermIAlt += (html.match(/class="kunskaerm"/g) || []).length;

    /* Samme to kontroller som i stribecellerne nedenfor, men paa hele siden.
       `.op` undtages af samme grund som der: operatoren er en DEL af tallet
       (regel 4), ikke et forbehold. */
    if (/class="forbehold forbehold--tegn"/.test(html)) {
      sideSynligeTegn++;
      if (sideTegnEksempler.length < 3) sideTegnEksempler.push(path.basename(path.dirname(sti)));
    }
    for (const t of html.match(/<span aria-hidden="true">([^<]*)<\/span>/g) || []) {
      if (/class="op"/.test(t)) continue;
      const indhold = t.replace(/<[^>]*>/g, '').trim();
      if (indhold === '*' || indhold === '†' || indhold === '‡') {
        sideSynligeTegn++;
        if (sideTegnEksempler.length < 3) {
          sideTegnEksempler.push(`${path.basename(path.dirname(sti))}: ${indhold}`);
        }
      }
    }
    for (const m of html.matchAll(/<abbr class="forbehold--skjult"([^>]*)>([\s\S]*?)<\/abbr>/g)) {
      sideSkjulteForbehold++;
      const harTitle = /title="[^"]+"/.test(m[1]);
      const harSkaerm = /<span class="kunskaerm">[^<]+<\/span>/.test(m[2]);
      if (!harTitle || !harSkaerm) {
        sideForbeholdUdenTekst++;
        if (sideTomEksempler.length < 3) {
          sideTomEksempler.push(`${path.basename(path.dirname(sti))} (title:${harTitle} kunskaerm:${harSkaerm})`);
        }
      }
    }
    for (const stykke of html.split(STYKKE_START)) {
      if (stykke.includes('forbehold--skjult')) {
        stykkerMedForbehold++;
        forbeholdPrFlade[bred(sti)]++;
      }
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

  /* De to krav maales nu paa HELE sitet (se noten ved taellerne). Den gamle,
     smalle udgave stod paa kompakteCeller > 0, og den betingelse kan ingen
     kortflade opfylde laengere - den ville have vaeret 0 af 0. */
  ok(`intet synligt forbeholds-tegn nogen steder paa sitet (0 af ${sideSkjulteForbehold} forbehold)`,
    sideSkjulteForbehold > 0 && sideSynligeTegn === 0,
    sideSynligeTegn ? `${sideSynligeTegn} fundet, fx: ${sideTegnEksempler.join(', ')}` : '');

  ok(`hvert skjult forbehold baerer sin tekst i BAADE title og .kunskaerm (${sideSkjulteForbehold} forbehold, 0 uden)`,
    sideSkjulteForbehold > 0 && sideForbeholdUdenTekst === 0,
    sideForbeholdUdenTekst ? `${sideForbeholdUdenTekst} uden tekst, fx: ${sideTomEksempler.join(', ')}` : '');

  /* Kortfladerne har ingen kompakte celler mere - vagten holder dem fast paa
     det, saa striben ikke sniger sig tilbage uden en beslutning. */
  ok(`ingen kompakte stribeceller paa nogen flade (fandt ${kompakteCeller})`,
    kompakteCeller === 0 && synligeTegn === 0 && skjulteForbehold === 0,
    `celler ${kompakteCeller}, tegn ${synligeTegn}, forbehold ${skjulteForbehold}`);

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
  /* VENDT IGEN 31. aug 2026 (spor/katalog, L56 punkt 7), og denne gang blev
     vagten STRAMMET, ikke slaekket.

     Det samlede gulv paa 940 kunne ikke overleve, at katalogkortet mistede
     sine tal: JPK besluttede samme dag, at kortet viser billede + producent +
     produktnavn og intet andet, saa katalogsidens 490 stykker (2 sprog x 77
     kort x den kompakte stribes celler) forsvandt MED DE TAL, de hoerte til.
     Et forbehold uden en vaerdi at staa ved er ikke en oplysning, der gik
     tabt - det er en oplysning, der ikke laengere vises noget sted.

     MAALT, saa faldet kan skelnes fra et tab (31. aug 2026):
       forside 54 · producent 132 · robotside 264 · katalogindeks 0 = 450
     Faldet 940 -> 450 er praecis 490, og alle 490 laa paa katalogindekset.
     Kontrollen, der afgoer det uafhaengigt af tallene: sporet aendrede ÉN
     skabelon, tools/skabelon/katalog.mjs. side.mjs - som tegner striben og
     dermed hvert eneste forbehold paa de tre oevrige flader - er uroert
     (`git diff --stat 0e5ef6e -- tools/` viser kun katalog.mjs).

     Derfor et gulv PR. FLADE i stedet for ét samlet. Det er strengere: det
     gamle tal kunne bestaas, selv om én flade tabte alt, saa laenge en anden
     voksede. Det nye kan det ikke. */
  /* VENDT IGEN 31. aug 2026 (spor/kort), og gulvene er igen MAALT, ikke gaettet.

     Forsiden og producentsiderne har nu ogsaa TYPESKILT-kortet, saa de to
     sidste kortstriber forsvandt - og med dem de forbehold, der hoerte til
     kortenes tal. Maalt foer og efter:
       forside    54 -> 8    (de 46, der laa i seks kort x to sprog)
       producent 132 -> 0    (alle laa i minikortenes striber)
       robotside 264 -> 264  UROERT
       katalogindeks 0 -> 0
       i alt     450 -> 272

     Den linje, der afgoer, at det er et FLYT og ikke et TAB, er robotsidens:
     264 foer, 264 efter. Hvert forbehold, der hoerer til et vist tal, staar
     stadig ved sit tal. Det, der forsvandt, hoerte til tal, som ingen flade
     viser mere - og et forbehold uden en vaerdi at staa ved er ikke en
     oplysning, der gik tabt.

     Forsidens 8 er ikke en rest af kortene: de ligger i yderpunkt-sektionen,
     som viser rigtige vaerdier og derfor stadig skal baere sine forbehold.
     Derfor har den stadig et gulv - falder den til 0, er noget gaaet i stykker. */
  const FLADEGULV = { forside: 8, robotside: 264 };
  for (const [navn, gulv] of Object.entries(FLADEGULV)) {
    ok(`forbeholdene staar stadig paa ${navn} (${forbeholdPrFlade[navn]} stykker, gulv ${gulv}, maalt 31. aug 2026)`,
      forbeholdPrFlade[navn] >= gulv, `fandt ${forbeholdPrFlade[navn]}`);
  }
  ok(`forbeholdene er ikke forsvundet: ${stykkerMedForbehold} stykker baerer mindst ét forbehold (raa .kunskaerm: ${kunskaermIAlt})`,
    stykkerMedForbehold >= Object.values(FLADEGULV).reduce((a, b) => a + b, 0),
    `fandt ${stykkerMedForbehold}`);
  /* De to kortflader skal have NUL - ikke fordi nul er godt, men fordi det er
     den besluttede tilstand, og en dag hvor striben er tilbage, skal disse
     linjer tvinge nogen til at laese noten ovenfor. */
  for (const navn of ['katalogindeks', 'producent']) {
    ok(`${navn} baerer ingen forbehold (kortet viser ingen tal)`,
      forbeholdPrFlade[navn] === 0, `fandt ${forbeholdPrFlade[navn]}`);
  }

  /* 3. Kildebogstaverne, pr. flade. Ikke alle kort KAN baere et maerke - et
     felt uden `kilde:` i YAML'en faar ingen, og det er den rigtige opfoersel
     (et hul uden kilde er en anden oplysning end et hul med). Derfor et
     gulv, ikke et krav om 100 %: maalt 27. aug 2026 laa katalog paa 76 af
     154 og forsiden paa 8 af 12. */
  /* KATALOGET ER UDE af denne loekke pr. 31. aug 2026 (spor/katalog, L56
     punkt 7): katalogkortet viser billede + producent + produktnavn og har
     ingen stribe, saa der er hverken striber eller kildebogstaver at maale -
     forholdet ville vaere 0/0, og en brøk med nul i naevneren er ikke et
     bestaaet krav, den er en maaling, der ikke fandt sted. Kildeloeftet er
     IKKE svaekket paa den flade: kortets TAL er vaek, og et kildemaerke uden
     et tal at pege paa er meningsloest. De to flader, der stadig viser tal
     paa kort, maales uaendret. */
  /* ALLE TRE kortflader er nu ude af brøken (spor/kort, 31. aug 2026). Noten
     ovenfor gjaldt kataloget; den gaelder nu ordret for forsiden og
     producentsiderne ogsaa, af samme grund: kortenes TAL er vaek, og et
     kildemaerke uden et tal at pege paa er meningsloest.

     Kildeloeftet er ikke svaekket, og det er vaerd at sige, hvor det saa
     bevises: 22-kildetjek.mjs og 27-kildeloefte.mjs vogter selve loeftet, og
     bygget fejler stadig, hvis et talfelt mangler enhed eller kilde (maalt
     samme dag: 1110 tal med kilde, 0 uden). Tallene og deres bogstaver staar
     paa robotsiden, hvor de har plads til baade enhed og maerke. */
  for (const navn of ['katalog', 'forside', 'producent']) {
    ok(`${navn}: kortene har ingen striber at baere kildebogstaver paa`,
      striber[navn] === 0,
      `fandt ${striber[navn]} striber paa ${navn}-fladen`);
  }

  /* Her stod vagten for producentsidernes minikort-kildebogstaver (142 af 154,
     gulv 35 %). Den er gaaet ind i loekken ovenfor som `striber.producent === 0`:
     kompaktStribe() i producent.mjs findes ikke laengere.

     Historikken, som ikke skal gaa tabt med funktionen: den regnede maerket ud
     med et rigtigt `hvorhen` (sti(ctx,'robot',m.slug)), fordi et maerke uden
     det gav href="#kilde-A" - et anker uden maal, da producentsiden ikke selv
     har en kildeliste (KRITIK-4 fund 2, spor/proveniens). Den faelde kan ikke
     komme igen paa denne flade, saa laenge fladen ikke tegner kildemaerker. */
  ok('ingen af de tre kortflader tegner kildemaerker (der er ingen tal at pege paa)',
    medKilde.katalog === 0 && medKilde.forside === 0 && medKilde.producent === 0,
    `katalog ${medKilde.katalog}, forside ${medKilde.forside}, producent ${medKilde.producent}`
    + ` · ${legendePaaProducent} producentsider trykker kort_legende`);
}
