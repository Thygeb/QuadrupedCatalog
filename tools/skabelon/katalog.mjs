/**
 * tools/skabelon/katalog.mjs — katalogsiden som TYPESKILTET.
 *
 * OMBYGGET 31. aug 2026 (spor/katalog, L54/L57): retningskontrakten er
 * `retninger/nyverden/katalog.html`. Formen er en stanset plade - typeskiltets
 * hoved, den klaebende strimmel, facetlaget i et 12-kolonners gitter - og
 * derunder ét fladt gitter af kort.
 *
 * HVAD DER FORSVANDT, OG HVORFOR DET IKKE ER EN TILBAGERULNING:
 * Vaegtklasse-SALENE (romertal I-IV, tommelindeks, tomhedsregler pr. sal) er
 * vaek. De var spor/lysbygs gruppering, og de kan ikke overleve L56 punkt 3:
 * sorteringen er nu ALFABETISK som standard, og en gruppering efter vaegt
 * ville tvinge vaegtordenen igennem foerst, uanset hvad laeseren vaelger.
 * Vaegtklassen er i stedet en FACET (fire afkrydsningsfelter), praecis som
 * compen og MANIFEST.md tegner den. Med salene forsvinder ogsaa hele klassen
 * af fejl, de genererede tomhedsregler fandtes for at daempe: der er ingen
 * gruppeoverskrift tilbage, der kan staa over et tomt gitter.
 *
 * FILTRENE VIRKER UDEN JAVASCRIPT. Uaendret mekanik, ét lag pr. facet:
 *
 *   .styr:has(.f-anv:checked) .lag-anv            { display:none }      skjul alle
 *   .styr:has(#f-anv-industri:checked)
 *        .lag-anv[data-anv~="industri"]           { display:contents }  vis igen
 *
 * Den anden regel vinder, fordi :has() arver sit mest specifikke argument, og
 * et id slaar en klasse. Resultatet er ELLER inden for en facet og OG paa
 * tvaers af facetter (hver facet har sit eget lag, og et lag skjult af facet A
 * kan ikke vises igen af facet B).
 *
 * EGENSKABSCHIPPENE GAAR DEN MODSATTE VEJ, og det er med vilje. En capability
 * er en uafhaengig betingelse: "gaar paa trapper" OG "arbejder i frost" skal
 * indsnaevre, ikke udvide. Derfor har de fem chips ÉT faelles lag og en ren
 * HIDE-regel hver:
 *
 *   .styr:has(#f-eg-trapper:checked) .lag-eg:not([data-eg~="trapper"]){display:none}
 *
 * Hver afkrydsning skjuler selvstaendigt, saa flere chips lagrer sig oven paa
 * hinanden som OG - uden et show-led, der kunne genoplive et kort, en anden
 * chip har skjult. Det sparer samtidig fire lag pr. kort.
 *
 * Lagene er `display:contents`, saa de ikke selv bliver gitterceller. Et skjult
 * kort efterlader derfor intet tomt felt i gitteret.
 *
 * Uden :has()-stoette sker der ingenting: alle kort staar. Det er den rigtige
 * vej at fejle - kataloget er stadig helt.
 *
 * :target gaar den samme vej, saa et filterlink (robotter/#f-anv-industri)
 * saetter et filter uden JavaScript.
 *
 * Kontrakten staar i side.mjs. Denne fil skriver kun indholdet af <main>.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from './side.mjs';
import { tilstandAf } from '../skema.mjs';

const attr = esc;

/** Et vaerdinavn, der kan staa i et id og i en attributvaelger. */
const nogle = (v) => String(v).toLowerCase().replace(/[^a-z0-9_]+/g, '-');

/* ==========================================================================
   0. VEKSELKURSEN (L66, JPK 1. sep 2026)
   ==========================================================================

   Kursen laeses HER og ikke i tools/build.mjs, og det er et ejerskabsvalg,
   ikke et arkitektonisk: build.mjs tilhoerer et andet spor i denne runde.
   Stien regnes ud fra modulets EGEN placering (import.meta.url) og ikke fra
   process.cwd(), saa filen findes uanset hvor bygget startes fra.

   HVORFOR EN KURS OVERHOVEDET MAA STAA PAA SIDEN. Her stod indtil i dag - i
   tools/skema.mjs, i sorteringens note og i denne fils eget hoved - at en
   vekselkurs var "et tal, vi selv havde fundet paa" (haard begraensning 2).
   Den saetning forvekslede TO ting: et tal ingen har offentliggjort, og et
   tal ingen havde slaaet op. ECB's daglige referencekurs er offentliggjort
   med udgiver, URL og dato, praecis som en producents prisangivelse er det.
   Den er derfor kildebelagt paa noejagtig samme maade som ethvert andet tal
   paa siden - og den staar i data/kurser.json, ikke i denne kode, af samme
   grund som robotternes tal staar i data/robots/.

   REGNESTYKKET STAAR ÉT STED, og det er dette. ECB noterer alt som "enheder
   pr. 1 euro", saa kursen fra en valuta til basisvalutaen er en division af
   to tal, der begge kan slaas efter i kilden. */
const ROD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const KURSER = JSON.parse(fs.readFileSync(path.join(ROD, 'data', 'kurser.json'), 'utf8'));
const BASISVALUTA = KURSER.basis;

/**
 * Kursen fra `valuta` til basisvalutaen, eller `null` naar kilden ikke
 * daekker valutaen.
 */
function kursTilBasis(valuta) {
  const fra = KURSER.per_euro?.[valuta];
  const til = KURSER.per_euro?.[BASISVALUTA];
  if (typeof fra !== 'number' || typeof til !== 'number' || !(fra > 0)) return null;
  return til / fra;
}

/* kursFormat()/kursPar() ("1 EUR = 1,1596 USD · 1 EUR = 7,7922 CNY") er
   FJERNET af BRIEF-uifix.md punkt 5 (spor/uifix, 2. sep 2026): "katalogsiden
   viser kun USD" - og en kurspar-tekst, der naevner den originale valuta ved
   navn, er praecis den slags tekst, der ikke laengere maa staa paa siden,
   naar den originale valuta ikke laengere vises dér. Den fulde kurs (begge
   valutaers tal, med alle cifre) staar stadig i data/kurser.json og paa
   robottens EGEN side (BRIEF-uifix.md punkt 6, uroert). Katalogsidens egen
   prisforklaring (tidligere prisMaerke(), se dens fjernelse laengere nede)
   er fjernet af samme grund. */

/* ==========================================================================
   1. AFLAESNING AF ET FELT
   ========================================================================== */

/**
 * Feltets tre-tilstand plus dets tal, laest ÉT sted.
 *
 * Formerne i data (maalt 31. aug 2026 over alle 77 poster):
 *   felter.x mangler                     -> ikke oplyst
 *   felter.x = "ikke oplyst" (streng)    -> ikke oplyst
 *   felter.x.vaerdi = "ikke oplyst"      -> ikke oplyst
 *   felter.x.vaerdi = true/false         -> ja / nej   (dockingstation, hot_swap)
 *   felter.x.vaerdi = tal                -> tal
 *   felter.x.min/.maks                   -> tal (midtpunktet)
 *
 * Returnerer { slags, tal, enhed }, hvor slags er 'ja' | 'nej' | 'tal' |
 * 'ikke_oplyst'. 'nul' er IKKE en egen slags her: et maalt nul er et TAL, og
 * det er netop pointen i haard begraensning 5 - det skal kunne regnes med.
 */
function laesFelt(robot, navn) {
  const p = robot.felter?.[navn];
  if (p === undefined || p === null) return { slags: 'ikke_oplyst' };
  if (typeof p === 'string') return { slags: tilstandAf(p) === 'nej' ? 'nej' : 'ikke_oplyst' };
  const v = p.vaerdi;
  if (typeof v === 'boolean') return { slags: v ? 'ja' : 'nej' };
  if (typeof v === 'string') {
    const t = tilstandAf(v);
    if (t === 'nej') return { slags: 'nej' };
    if (t) return { slags: 'ikke_oplyst' };
    if (v === 'ja') return { slags: 'ja' };
    return { slags: 'ikke_oplyst' };
  }
  const tal = p.min !== undefined ? (p.min + p.maks) / 2 : v;
  if (typeof tal !== 'number' || !Number.isFinite(tal)) return { slags: 'ikke_oplyst' };
  return { slags: 'tal', tal, enhed: p.enhed };
}

function ipVaerdi(robot) {
  const p = robot.felter?.ip_klasse;
  if (p === undefined) return 'ikke_oplyst';
  if (typeof p === 'string') return tilstandAf(p) ?? 'ikke_oplyst';
  const t0 = tilstandAf(p.vaerdi);
  if (t0) return t0;
  return String(p.vaerdi);
}

/**
 * Robottens nyttelast som ÉT tal til skalaen, eller `null` naar den tier.
 *
 * ET SPAEND LAESES PAA SIT MAKSIMUM, ikke paa sit midtpunkt, og det er en
 * bevidst afvigelse fra laesFelt(). Skalaen spoerger "kan den baere mindst N
 * kg?", og en robot, producenten opgiver til 20-30 kg, KAN baere 28 - den
 * skal derfor ikke falde ud ved 28, blot fordi midtpunktet er 25.
 *
 * Maalt 1. sep 2026: to robotter har spaend (pudu-d5 og pudu-d5-w, begge
 * 20-30 kg), og de to laesninger giver samme svar ved alle fire trin
 * (5/10/20/50). Forskellen kan altsaa KUN ses paa den glidende skala - hvilket
 * er praecis derfor den skal skrives ud her og ikke opdages senere.
 */
function nyttelastTal(robot) {
  const p = robot.felter?.nyttelast_gaaende;
  const f = laesFelt(robot, 'nyttelast_gaaende');
  if (f.slags !== 'tal') return null;
  return (p && typeof p === 'object' && typeof p.maks === 'number') ? p.maks : f.tal;
}

/**
 * Prisen omregnet til basisvalutaen (L66), eller `null` naar robotten ikke
 * oplyser en pris.
 *
 * Returnerer `{ tal, valuta, kurs, omregnet }`, hvor `omregnet` er falsk for
 * de priser, producenten SELV skrev i basisvalutaen - de er ikke omregnet af
 * os og maa ikke baere et omregningsmaerke.
 *
 * KASTER paa en valuta, kilden ikke daekker. Det er med vilje det haarde
 * udfald: alternativet er, at en ny pris i en ny valuta tavst falder ud af
 * baade sortering og filter, og et tal, der forsvinder uden at nogen ser det,
 * er praecis den fejl haard begraensning 5 findes for at forhindre. Beskeden
 * siger, hvilken fil der skal have en linje mere.
 */
function prisIBasis(robot) {
  const f = laesFelt(robot, 'pris');
  if (f.slags !== 'tal') return null;
  const valuta = robot.felter?.pris?.enhed;
  const kurs = kursTilBasis(valuta);
  if (kurs === null) {
    throw new Error(`katalog.mjs: ${robot.slug} oplyser prisen i "${valuta}", som `
      + `data/kurser.json ikke har en kurs for. Tilfoej valutaen dér med kilde og `
      + `dato - prisen maa ikke falde tavst ud af sortering og filter.`);
  }
  return {
    tal: Math.round(f.tal * kurs),
    valuta,
    kurs,
    omregnet: valuta !== BASISVALUTA,
  };
}

/* ==========================================================================
   2. EGENSKABSCHIPPENE (L55 punkt 2)
   ========================================================================== */

/**
 * De fem godkendte capability-chips. Hver er AFLEDT af et eksisterende felt -
 * intet nyt skemafelt, intet opfundet tal - og hver baerer sin taerskel i
 * ETIKETTEN, saa "ja" ikke er en redaktionel dom, laeseren ikke kan efterproeve.
 *
 * `praed` afgoer ja/nej for et TAL. Er feltet et rent ja/nej (boolsk), bruges
 * boolen selv, og `praed` roeres ikke.
 *
 * Taersklerne er compens, efterproevet mod data 31. aug 2026 (se rapporten):
 * 42/0/35 · 57/8/12 · 36/10/31 · 31/3/43 · 19/0/58. Hver linje summer til 77,
 * og kapabiliteter() KASTER, hvis en ikke goer.
 */
const KAPABILITETER = [
  { navn: 'trapper', felt: 'trappetrin_kontinuerlig', praed: () => true },
  { navn: 'baerer', felt: 'nyttelast_gaaende', praed: (v) => v >= 5 },
  { navn: 'frost', felt: 'temp_min', praed: (v) => v <= -10 },
  { navn: 'lader', felt: 'dockingstation', praed: () => true },
  { navn: 'hotswap', felt: 'hot_swap', praed: () => true },
];

/** Tre-tilstanden for én kapabilitet paa én robot. */
function kapabilitet(robot, k) {
  const f = laesFelt(robot, k.felt);
  if (f.slags === 'ikke_oplyst') return 'ikke_oplyst';
  if (f.slags === 'ja') return 'ja';
  if (f.slags === 'nej') return 'nej';
  return k.praed(f.tal) ? 'ja' : 'nej';
}

/**
 * Chippenes optaellinger, med den kontrol L55 kraever: hver linje SKAL summe
 * til antallet af robotter. Kaster, hvis en ikke goer - en chip, der taber en
 * robot mellem tre tilstande, er praecis den slags stille fejl, haard
 * begraensning 5 findes for at forhindre.
 */
function kapabiliteter(robotter) {
  return KAPABILITETER.map((k) => {
    const c = { ja: 0, nej: 0, ikke_oplyst: 0 };
    for (const r of robotter) c[kapabilitet(r, k)] += 1;
    const sum = c.ja + c.nej + c.ikke_oplyst;
    if (sum !== robotter.length) {
      throw new Error(`katalog.mjs: egenskabschippen "${k.navn}" summer til ${sum}, `
        + `ikke ${robotter.length} (ja ${c.ja}, nej ${c.nej}, ikke oplyst ${c.ikke_oplyst})`);
    }
    return { ...k, ...c, sum };
  });
}

/* ==========================================================================
   3. SKALAERNE (L65c og L66, JPK 1. sep 2026)
   ==========================================================================

   TO FLADER AF SAMME SAG, og det er hele pointen. JPK bad om en GLIDENDE
   slider til nyttelast - ikke trinvise radioknapper. Men en slider er et
   JavaScript-objekt: uden scriptet er `<input type=range>` en kontrol, der
   ikke goer noget. Ville sliderne vaere sidens eneste vej til at filtrere paa
   nyttelast, ville P0 vaere brudt (se assets/katalog.js' filhoved: "JavaScript
   maa forbedre sandheden; den maa aldrig vaere forudsaetningen for den").

   Derfor bygges BEGGE, og de er ikke to mekanismer, men én i to oploesninger:

     UDEN JavaScript  fire afkrydsningsfelter: "Mindst 5 kg", "Mindst 10 kg",
                      "Mindst 20 kg", "Mindst 50 kg". Ren CSS, samme :has()-
                      mekanik som alle andre facetter - ingen ny kode.
     MED JavaScript   de fire felter viger for en skala, der kan staa hvor som
                      helst mellem 0 og 200 kg. Trinnene bliver til RIDSER paa
                      skalaen, saa laeseren kan se, hvor den grovere udgave
                      ville have ligget.

   TRAERSKELVAERDIER, IKKE BAAND, og det er den detalje, der faar de to
   oploesninger til at moedes praecist. Et kort baerer ALLE de traerskler, det
   opfylder: 30 kg giver data-nyttelast="5 10 20". Facetternes ELLER-grammatik
   (hovedStil §6a) forener derfor to afkrydsninger til den LAVESTE traerskel -
   ">=20 eller >=50" ER ">=20" - og det er sandt, ikke en tilnaermelse. Havde
   trinnene i stedet vaeret disjunkte baand (5-9, 10-19, ...), ville sliderens
   ene haandtag ikke kunne udtrykke det samme udvalg.

   RETNINGEN FOELGER SPOERGSMAALET, ikke en skabelon. Nyttelast spoerges der
   NEDEFRA ("kan den baere mindst 20 kg?"), pris spoerges der OVENFRA ("hvad
   kan jeg faa for hoejst 15.000?"). Derfor ét haandtag hver og modsat vej -
   ikke to generiske to-haandtags-intervaller, som ville koste et haandtag,
   ingen bruger, paa hver af dem.

   HAARD BEGRAENSNING 5 STAAR I SELVE FORMEN. De robotter, der ikke oplyser
   feltet, faar vaerdien `ikke_oplyst` - en EGEN raekke med sit eget tal og sit
   eget maerke (`rk--uoplyst`), i begge oploesninger. De falder aldrig tavst ud,
   og de ser aldrig ud som om de baerer 0 kg eller koster 0. Raekken staar
   UDEN FOR trinlisten, saa den ogsaa er der, naar slideren har overtaget. */
const SKALAER = [
  {
    navn: 'nyttelast',
    etiketNoegle: 'filter_nyttelast',
    mrkNoegle: 'filter_nyttelast_mrk',
    noteNoegle: 'filter_nyttelast_note',
    enhed: 'kg',
    retning: 'mindst',
    // Traersklerne er compens og chippernes: 5 kg er NOEJAGTIG den graense,
    // egenskabschippen `baerer` allerede bruger, saa de to kan ikke komme til
    // at sige hver sit om samme robot. Maalt 1. sep 2026: 57/46/28/5 af de 65
    // oplyste, plus 12 uden tal.
    trin: [5, 10, 20, 50],
    skridt: 1,
    tal: nyttelastTal,
  },
  {
    navn: 'pris',
    etiketNoegle: 'filter_pris',
    mrkNoegle: 'filter_pris_mrk',
    noteNoegle: 'filter_pris_note',
    enhed: BASISVALUTA,
    retning: 'hoejst',
    // Maalt 1. sep 2026 paa de 11 omregnede priser: 3/6/9 af 11, plus 66
    // uden pris. Tallene er runde, fordi de er en BETJENING og ikke en
    // maaling - selve optaellingen ved siden af dem regnes af data.
    trin: [5000, 15000, 60000],
    skridt: 500,
    tal: (r) => prisIBasis(r)?.tal ?? null,
  },
];

/**
 * Én skala som et FACET-OBJEKT. Formen er med vilje den, facetter() allerede
 * kender - `vaerdier`, `tekst`, `orden` - saa skalaen arver hele den
 * eksisterende maskine gratis: optaellingen, CSS-reglerne (hovedStil §6a),
 * strimlens chips (§6c) og omfangsmaerkerne (§6e). Der er ingen ny
 * filtermekanik i dette spor overhovedet; der er en ny INDGANG til den, der
 * var.
 *
 * `skala`-noeglen er det ene, der er nyt, og den baerer kun det, slideren og
 * dens ridser skal bruge for at kunne tegnes.
 */
function skalaFacet(spec, robotter, hjaelp, i18n) {
  const { T, t, tf } = i18n;
  const tal = robotter.map(spec.tal).filter((v) => v !== null);
  const hoejeste = tal.length ? Math.max(...tal) : 0;
  // Rundes OP til et helt skridt. Ellers kan skalaens hoejeste stilling ikke
  // naa den dyreste robot, og den ville staa filtreret vaek i hvile - en
  // fejl, der kun ville vise sig paa den ene robot, der er yderst.
  const stoerste = Math.max(spec.skridt, Math.ceil(hoejeste / spec.skridt) * spec.skridt);

  return {
    navn: spec.navn,
    etiket: t(spec.etiketNoegle),
    mrk: tf(spec.mrkNoegle, { n: tal.length, m: robotter.length }),
    // Kursens vaerdier gives til ALLE skalaers noter, ogsaa nyttelastens, som
    // ikke bruger dem. Prisen er lige nu den ene, der har brug for {basis} og
    // {dato} - men saetInd() lader en ukendt pladsholder staa ORDRET paa
    // siden ("{dato}"), og en note, der en dag faar en linje mere, skal ikke
    // kunne lande saadan. Overfloedige vaerdier koster ingenting; en
    // manglende koster en synlig fejl i produktionen.
    // {kurser} ("1 EUR = X USD · 1 EUR = Y CNY") er FJERNET af BRIEF-
    // uifix.md punkt 5 sammen med kursPar() ovenfor - se dens begrundelse.
    note: tf(spec.noteNoegle, {
      n: tal.length,
      u: robotter.length - tal.length,
      basis: BASISVALUTA,
      dato: hjaelp.dformat(KURSER.kilde.dato),
    }),
    skala: {
      navn: spec.navn,
      enhed: spec.enhed,
      retning: spec.retning,
      trin: spec.trin,
      skridt: spec.skridt,
      mindste: 0,
      stoerste,
      // Hvilestillingen er den, hvor skalaen IKKE filtrerer: bunden for et
      // "mindst", toppen for et "hoejst".
      hvile: spec.retning === 'mindst' ? 0 : stoerste,
      oplyste: tal.length,
      tal: spec.tal,
    },
    vaerdier: (r) => {
      const v = spec.tal(r);
      if (v === null) return ['ikke_oplyst'];
      // En vaerdi, der ikke naar NOGEN traerskel (fx 1 kg), giver en tom
      // liste. Det er rigtigt: robotten er oplyst, saa den hoerer ikke til i
      // "ikke oplyst", og den opfylder ingen af de traerskler, der kan
      // vaelges. Den staar i standardvisningen og forsvinder ved ethvert
      // traerskelvalg - hvilket er sandt.
      return spec.trin
        .filter((n) => (spec.retning === 'mindst' ? v >= n : v <= n))
        .map(String);
    },
    tekst: (v) => (v === 'ikke_oplyst' ? T.tilstand_ikke_oplyst
      : tf(spec.retning === 'mindst' ? 'skala_mindst' : 'skala_hoejst',
        { n: hjaelp.nformat(Number(v)), enhed: spec.enhed })),
    orden: [...spec.trin.map(String), 'ikke_oplyst'],
  };
}

/* ==========================================================================
   4. FACETTERNE
   ========================================================================== */

/**
 * De fem listefacetter. Raekkefoelgen her er ogsaa lagenes raekkefoelge i HTML.
 *
 * `ce` UDGIK 31. aug 2026 (L55 punkt 3): den kunne kun udvaelge 2 af 77 og
 * opsluges i den kommende certificerings-facet, som staar reserveret og tom.
 * `status` kom til som fuld facet (L55 punkt 5).
 */
function facetter(robotter, hjaelp, i18n) {
  const { T, t } = i18n;
  const tilstandsnavn = (v) => (v === 'ikke_oplyst' ? T.tilstand_ikke_oplyst
    : v === 'nej' ? T.tilstand_nej : v);

  return [
    {
      navn: 'anv',
      etiket: t('filter_anvendelse'),
      vaerdier: (r) => hjaelp.anvendelse(r).vaerdier,
      tekst: (v) => (v === 'ikke_oplyst' ? T.tilstand_ikke_oplyst : t('anvendelse_' + v)),
    },
    {
      // L50: en robot med et vaegtspaend, der daekker flere klasser, skal
      // matche i dem ALLE - derfor vaegtklasser() (flertal), ikke vaegtklasse().
      navn: 'vaegt',
      etiket: t('filter_vaegt'),
      vaerdier: (r) => hjaelp.vaegtklasser(r),
      tekst: (v) => t('vaegtklasse_' + v),
      orden: hjaelp.VAEGTKLASSER,
    },
    {
      navn: 'ip',
      etiket: t('filter_ip'),
      vaerdier: (r) => [ipVaerdi(r)],
      tekst: tilstandsnavn,
    },
    {
      /* STATUS HAVDE en standardtilstand (L56 punkt 5: udgaaede skjult, i
         produktion + annoncerede vist) - fjernet af BRIEF-uifix.md punkt 3
         (spor/uifix, 2. sep 2026). JPK, ordret: "Baren paa katalogsiden
         skal KUN vise de aktive filtre. som standard skal INGEN vaere
         aktive." To fejl i én: to filtre var aktive ved indlaesning, OG
         ingen af dem viste en chip (en aktiv, usynlig filtrering er vaerre
         end en synlig). Status er derfor nu en facet SOM ALLE ANDRE -
         ingen `mrk`, ingen `standard`, ingen `checked` ved indlaesning, og
         dens vaerdier gaar gennem den samme generiske chip-mekanik som
         vaegt/ip/land nedenfor i stedet for den tidligere INVERTEREDE
         "skjult-X"-mekanik (se hovedStil() og valgListe herunder - begge
         havde et status-saerspor, som er fjernet i samme spor). */
      navn: 'status',
      etiket: t('filter_status'),
      vaerdier: (r) => [r.status],
      tekst: (v) => T['status_' + v],
      orden: ['i_produktion', 'annonceret', 'udgaaet'],
    },
    {
      navn: 'land',
      etiket: t('filter_land'),
      vaerdier: (r) => [r.producentland],
      tekst: (v) => hjaelp.land(v),
    },
    // Skalaerne staar SIDST, fordi raekkefoelgen her ogsaa er lagenes
    // raekkefoelge i HTML - og de to nye lag hoerer inderst, taettest paa
    // kortet, hvor deres tal-attribut ogsaa skal staa.
    ...SKALAER.map((s) => skalaFacet(s, robotter, hjaelp, i18n)),
  ].map((f) => {
    const antal = new Map();
    for (const r of robotter) {
      for (const v of f.vaerdier(r)) antal.set(v, (antal.get(v) ?? 0) + 1);
    }
    const liste = [...antal.keys()].sort((a, b) => {
      if (f.orden) return f.orden.indexOf(a) - f.orden.indexOf(b);
      // "ikke oplyst" staar sidst; ellers efter antal og saa alfabetisk.
      if (a === 'ikke_oplyst') return 1;
      if (b === 'ikke_oplyst') return -1;
      return antal.get(b) - antal.get(a) || String(a).localeCompare(String(b));
    });
    return { ...f, antal, liste };
  });
}

/* ==========================================================================
   5. SORTERINGEN (L56 punkt 3)
   ========================================================================== */

/**
 * Fem sorteringer, ingen Skill Score (haard begraensning 6 - og posten staar
 * paa "Kom ikke igen med disse"). Alfabetisk er STANDARD og har med vilje
 * INGEN CSS-regel: den ER DOM-raekkefoelgen, saa standardvisningen har visuel
 * orden = DOM-orden = taborden.
 *
 * RETNINGEN STAAR I ETIKETTEN. "Pris" alene skjuler et valg, laeseren ikke kan
 * se; "Pris, laveste foerst" kan efterproeves med det samme.
 *
 * PRISEN ER OMREGNET TIL ÉN VALUTA (L66, JPK 1. sep 2026). Her stod indtil i
 * dag det modsatte: at priserne var GRUPPERET efter valuta, fordi "en kurs er
 * et tal, vi ville have opfundet". Den saetning er nu forkert, og den blev
 * ikke forkert af en holdningsaendring - JPK fik omkostningen forelagt og
 * svarede "Ja - omregn til USD". Begrundelsen staar i data/kurser.json: en
 * offentliggjort referencekurs er kildebelagt paa noejagtig samme maade som
 * producentens egen prisangivelse.
 *
 * `gruppe` er derfor VAEK. Med den fandtes der ikke én raekkefoelge, men tre -
 * CNY foerst, saa EUR, saa USD - og "laveste foerst" var kun sandt inden for
 * hver bunke. Maalt 1. sep 2026: 11 af 77 oplyser pris (CNY 6 · USD 4 ·
 * EUR 1), og efter omregningen ordnes de i ét forloeb fra 1.600 til 85.000
 * USD.
 *
 * PRODUCENTENS EGET TAL SORTERES DER IKKE PAA, og det er den fine skelnen:
 * `tal` (rangordningen) bruger det omregnede beloeb, mens `post` (det, kortet
 * VISER) stadig er producentens egen post i producentens egen valuta. Vores
 * omregning staar ved siden af, maerket som vores.
 */
const SORTERINGER = [
  { navn: 'alfa', noegle: 'katalog_sortering_alfabetisk', standard: true },
  {
    navn: 'dato',
    noegle: 'katalog_sortering_dato',
    savn: 'savn_dato',
    feltnoegle: 'felt_foerste_udgivelse',
    // AARSTALLET SENDES SOM STRENG, OG DET ER EN RETTELSE, IKKE EN GENVEJ.
    // H.tal()s figurgren er `typeof post.vaerdi === 'number' ? nformat(...)
    // : String(post.vaerdi)`, og nformat er `Intl.NumberFormat('da-DK')`:
    // et TAL 2023 bliver til "2.023" med tusindtalsseparator (maalt).
    // Et aarstal er et ORDENSTAL, ikke en maalt maengde - det har hverken
    // enhed eller kilde i skemaet - og resten af sitet saetter det da ogsaa
    // raat (robot.mjs:1151 og katalog.mjs' aarstempel bruger begge
    // String(...)). Strengen rammer derfor den gren, der IKKE formaterer,
    // og tallet arver stadig .v-tal-typografien fra H.tal().
    post: (r) => ({ vaerdi: String(r.foerste_udgivelse) }),
    tal: (r) => (typeof r.foerste_udgivelse === 'number' ? r.foerste_udgivelse : null),
    faldende: true,
  },
  {
    navn: 'pris',
    noegle: 'katalog_sortering_pris',
    savn: 'savn_pris',
    note: 'sortering_pris_note',
    feltnoegle: 'felt_pris',
    post: (r) => r.felter?.pris,
    tal: (r) => prisIBasis(r)?.tal ?? null,
  },
  {
    navn: 'nyttelast',
    noegle: 'katalog_sortering_nyttelast',
    savn: 'savn_nyttelast',
    // FELTNAVNET, IKKE ET KORTERE ORD. `sammenlign_advarsel` advarer selv om,
    // at "nyttelast findes i to udgaver" - gaaende og staaende - og begge
    // maales i kg. Et bart "14 kg" under et robotnavn kunne desuden laeses som
    // robottens VAEGT, der ogsaa er kg. Etiketten baerer derfor hele
    // feltnavnet "Nyttelast, gaaende", saa kortet ikke flader en skelnen ud,
    // siden et andet sted udtrykkeligt beder laeseren om at holde fast i.
    feltnoegle: 'felt_nyttelast_gaaende',
    post: (r) => r.felter?.nyttelast_gaaende,
    tal: (r) => { const f = laesFelt(r, 'nyttelast_gaaende'); return f.slags === 'tal' ? f.tal : null; },
    faldende: true,
  },
  {
    navn: 'hastighed',
    noegle: 'katalog_sortering_hastighed',
    savn: 'savn_hastighed',
    feltnoegle: 'felt_hastighed',
    post: (r) => r.felter?.hastighed,
    tal: (r) => { const f = laesFelt(r, 'hastighed'); return f.slags === 'tal' ? f.tal : null; },
    faldende: true,
  },
];

/**
 * Rangtal 1..N for én sortering. De OPLYSTE foerst i deres egen orden, de
 * UOPLYSTE sidst i alfabetisk orden - L56: "uoplyste ligger sidst med aerlig
 * maerkning". Maerkningen selv er `savn`-maerket paa kortet.
 */
function rangFor(robotter, s, sprog) {
  const navn = (r) => String(r.navn).localeCompare(String(r.navn), sprog);
  const alfabetisk = (a, b) => String(a.navn).localeCompare(String(b.navn), sprog);
  void navn;
  const med = [];
  const uden = [];
  for (const r of robotter) (s.tal(r) === null ? uden : med).push(r);
  med.sort((a, b) => {
    if (s.gruppe) {
      const g = String(s.gruppe(a)).localeCompare(String(s.gruppe(b)));
      if (g) return g;
    }
    const d = s.tal(a) - s.tal(b);
    if (d) return s.faldende ? -d : d;
    return alfabetisk(a, b);
  });
  uden.sort(alfabetisk);
  const rang = new Map();
  [...med, ...uden].forEach((r, i) => rang.set(r.slug, i + 1));
  return rang;
}

/* ==========================================================================
   6. DEN GENEREREDE FILTER-CSS
   ========================================================================== */

/** Kaldes af bygget og lægges i sidens inline <style>. */
export function hovedStil(ctx) {
  const { robotter, hjaelp, i18n } = ctx;
  const F = facetter(robotter, hjaelp, i18n);
  const K = kapabiliteter(robotter);
  const linjer = [];

  /* 6a. Listefacetterne: skjul-alle + vis-de-valgte.

     SKALAERNE FAAR ÉT LED MERE, `:not([data-levende])`, og det er den linje,
     der holder de to oploesninger fra at filtrere OVEN PAA hinanden. Uden
     JavaScript er disse regler skalaens eneste maskineri og virker som
     enhver anden facet. Med JavaScript overtager assets/katalog.js hele
     skalaen - baade traersklen og "ikke oplyst"-raekken - og da SKAL CSS'en
     tie, ellers ville en afkrydsning fra fx et filterlink filtrere én gang i
     CSS og én gang i JavaScript med to forskellige graenser.

     Leddet saettes paa BEGGE regler (skjul og vis), saa deres indbyrdes
     specificitet er uroert: vis-reglen vinder stadig, fordi den baerer et id.
     Det er samme greb som omfangsmaerkerne i §6e allerede bruger. */
  for (const f of F) {
    const kun = f.skala ? '.styr:not([data-levende])' : '.styr';
    linjer.push(`${kun}:has(.f-${f.navn}:checked) .lag-${f.navn},`);
    linjer.push(`${kun}:has(.f-${f.navn}:target) .lag-${f.navn}{display:none}`);
    for (const v of f.liste) {
      const id = `f-${f.navn}-${nogle(v)}`;
      linjer.push(`${kun}:has(#${id}:checked) .lag-${f.navn}[data-${f.navn}~="${v}"],`);
      linjer.push(`${kun}:has(#${id}:target) .lag-${f.navn}[data-${f.navn}~="${v}"]{display:contents}`);
    }
  }

  /* 6a2. FACETGRUPPENS "MINDST ÉT VALGT"-MAERKE (JPK 1. sep 2026, punkt 4).
     Se facetBlok()s kommentar for den fulde begrundelse - dette er den
     genererede halvdel. CSS kan ikke taelle, saa reglen her taender kun en
     TILSTEDEVAERELSE ([data-facet-aktiv]) naar mindst ét afkrydsningsfelt i
     gruppen er markeret; assets/katalog.js erstatter den med det praecise
     tal, naar den kan. `:not([data-levende])` er den samme guard som §6a
     bruger til skalaerne - naar JavaScript overtager en gruppe (i dag kun
     de to skalaer), skal CSS'ens egen version tie, ellers kan de to komme
     til at sige to forskellige ting om samme gruppe. */
  const gruppeMrk = [];
  for (const f of F) {
    gruppeMrk.push(`.styr:not([data-levende]):has(.f-${f.navn}:checked) [data-facetgruppe="${f.navn}"] [data-facet-aktiv],`);
    gruppeMrk.push(`.styr:not([data-levende]):has(.f-${f.navn}:target) [data-facetgruppe="${f.navn}"] [data-facet-aktiv]{display:inline}`);
  }
  gruppeMrk.push(`.styr:not([data-levende]):has(.f-eg:checked) [data-facetgruppe="eg"] [data-facet-aktiv]{display:inline}`);

  /* 6b. Egenskabschippene: ren HIDE, saa flere chips lagrer sig som OG.
     Se filhovedets note - det er den eneste facetgruppe, der virker saadan,
     fordi en capability er en uafhaengig betingelse og ikke en vaerdiliste. */
  const chipRegler = [];
  for (const k of K) {
    const id = `f-eg-${k.navn}`;
    chipRegler.push(`.styr:has(#${id}:checked) .lag-eg:not([data-eg~="${k.navn}"]),`);
    chipRegler.push(`.styr:has(#${id}:target) .lag-eg:not([data-eg~="${k.navn}"]){display:none}`);
  }

  /* 6c. Strimlens chips. Hver mulig markering har sin egen <li>, som staar
     skjult og taendes af sin egen regel. Det er den samme byggetidsviden, der
     baerer filtrene: vi ved, hvilke vaerdier der findes, saa "hvad er valgt"
     kan tegnes uden at kunne taelle. */
  const valgRegler = [];
  for (const f of F) {
    // Samme begrundelse som §6a: naar JavaScript koerer, er skalaens tilstand
    // sliderens og ikke afkrydsningsfelternes, og chippen tegnes derfor af
    // assets/katalog.js med den vaerdi, laeseren faktisk har stillet paa.
    const kun = f.skala ? '.styr:not([data-levende])' : '.styr';
    for (const v of f.liste) {
      const id = `f-${f.navn}-${nogle(v)}`;
      valgRegler.push(`${kun}:has(#${id}:checked) [data-valg="${id}"],`);
      valgRegler.push(`${kun}:has(#${id}:target) [data-valg="${id}"]{display:inline-flex}`);
    }
  }
  for (const k of K) {
    const id = `f-eg-${k.navn}`;
    valgRegler.push(`.styr:has(#${id}:checked) [data-valg="${id}"],`);
    valgRegler.push(`.styr:has(#${id}:target) [data-valg="${id}"]{display:inline-flex}`);
  }
  // Status havde her et INVERTERET saerspor ("skjult-X" viser sig ved
  // unchecked), fjernet af BRIEF-uifix.md punkt 3 sammen med `standard`-
  // feltet paa facetten ovenfor. Status' checkbokse baerer samme
  // `f-status`-klasse som enhver anden facet (se raekke()) og faar derfor
  // AUTOMATISK den generiske chip-mekanik i loekken ovenfor - ingen egen
  // kode noedvendig laengere.
  const status = F.find((f) => f.navn === 'status');

  /* 6d. Sorteringen. To ting pr. sortering: kortenes orden og det aerlige
     savn-maerke paa dem, der ikke oplyser feltet. Alfabetisk har ingen regel -
     den er DOM-ordenen. */
  const sortering = [];
  for (const s of SORTERINGER) {
    if (s.standard) continue;
    sortering.push(`.styr:has(#sort-${s.navn}:checked) .kort{order:var(--o-${s.navn})}`);
    sortering.push(`.styr:has(#sort-${s.navn}:checked) .kort__savn--${s.navn}{display:block}`);
    // Samme mekanik som savn-maerket lige ovenfor, og med vilje samme form:
    // vaerdien er savnets modstykke og taendes af noejagtig samme betingelse.
    sortering.push(`.styr:has(#sort-${s.navn}:checked) .kort__vaerdi--${s.navn}{display:flex}`);
    if (s.note) sortering.push(`.styr:has(#sort-${s.navn}:checked) [data-note="${s.navn}"]{display:block}`);
  }

  /* 6e. Omfangsmaerkerne. De taendes, naar der FAKTISK er filtreret - og kun
     uden JavaScript (`:not([data-levende])`), fordi JavaScript regner tallene
     om og goer forbeholdet usandt. Se render()s note om maerkerne.

     Status havde her sin egen inverterede betingelse ("skjult standard-
     vaerdi = filtreret"), fjernet af BRIEF-uifix.md punkt 3 - dens felter
     er ikke laengere krydset af i hvile, saa den falder ind under den
     generiske "har nogen krydset af" betingelse ligesom enhver anden
     facet. */
  const filtreret = [];
  for (const f of F) {
    filtreret.push(`.styr:not([data-levende]):has(.f-${f.navn}:checked)`);
    filtreret.push(`.styr:not([data-levende]):has(.f-${f.navn}:target)`);
  }
  filtreret.push('.styr:not([data-levende]):has(.f-eg:checked)');
  filtreret.push('.styr:not([data-levende]):has(.f-eg:target)');
  const omfang = `${filtreret.map((s) => `${s} [data-omfang]`).join(',\n')}{display:inline}\n`
    + `${filtreret.map((s) => `${s} [data-omfang-note]`).join(',\n')}{display:block}`;

  return `/* Filtrene. Genereret af tools/skabelon/katalog.mjs - én regel pr. vaerdi. */
@supports selector(:has(*)){
${linjer.join('\n')}

/* Facetgruppernes "mindst ét valgt"-maerke (punkt 4). */
${gruppeMrk.join('\n')}

/* Egenskabschippene (OG, ikke ELLER - se filhovedet). */
${chipRegler.join('\n')}

/* Strimlens valgte chips. */
${valgRegler.join('\n')}

/* Sorteringen (L56 punkt 3). */
${sortering.join('\n')}

/* Taellernes omfangsmaerker, naar der er filtreret UDEN JavaScript. */
${omfang}
}`;
}

/* ==========================================================================
   7. SIDEN
   ========================================================================== */

export function render(ctx) {
  // `url` og ikke en haandregnet '../': build.mjs' grund() advarer selv om, at
  // "en haandregnet '../../' er den slags fejl, der ikke ses foer i browseren".
  const { robotter, i18n, sprog, hjaelp, url } = ctx;
  const { T, t, tf } = i18n;
  const F = facetter(robotter, hjaelp, i18n);
  const K = kapabiliteter(robotter);
  const status = F.find((f) => f.navn === 'status');

  const alle = robotter.length;

  /* --- SORTERINGENS RANGTAL ------------------------------------------------
     DOM-raekkefoelgen er ALFABETISK, fordi alfabetisk er standardsorteringen
     (L56 punkt 3) - saa standardvisningen har visuel orden = DOM-orden =
     taborden, og den sortering behoever ingen CSS-regel. De fire oevrige faar
     hver sit rangtal pr. kort og én `order`-regel hver (se hovedStil). */
  const sorteret = [...robotter]
    .sort((a, b) => String(a.navn).localeCompare(String(b.navn), sprog));
  const rang = new Map(SORTERINGER.filter((s) => !s.standard)
    .map((s) => [s.navn, rangFor(robotter, s, sprog)]));

  /* --- OMFANGSMAERKET ------------------------------------------------------
     Hver statisk taeller faar en efterstilling, der siger HVAD den taeller.
     Den staar `hidden` i hvile og vises kun, naar et filter er slaaet til OG
     JavaScript ikke koerer (reglerne genereres i hovedStil §6e).

     Hvorfor overhovedet: tallene er regnet ved BYGGETIDEN over hele kataloget.
     Uden JavaScript kan de ikke regnes om, naar laeseren filtrerer - :has()
     kan taende og slukke kort, men kan ikke taelle dem. Et tal, der staar
     uaendret ved siden af et udvalg, det ikke laengere beskriver, er en
     paastand uden daekning; sidens positionering nr. 1 er, at hvert tal har en
     kilde. "41" bliver derfor til "41 af 77", og "74 robotter" til "74
     robotter i standardvisningen" - sandt i enhver filtertilstand.

     Teksten staar i HTML og ikke i CSS' content: den skal oversaettes gennem
     de samme sprogfiler som alt andet, kunne markeres og kopieres, og kunne
     ses af de tests, der laeser byggets synlige tekst. */
  const omfangAlle = `<span class="taeller-omfang" data-omfang hidden> ${esc(tf('taeller_af_alle', { n: alle }))}</span>`;
  const omfangStandard = `<span class="taeller-omfang" data-omfang hidden> ${esc(t('taeller_standardvisning'))}</span>`;

  /* --- STANDARDVISNINGEN --------------------------------------------------
     Hvor mange kort staar der, FOER laeseren roerer noget? Foer BRIEF-uifix.md
     punkt 3 (spor/uifix, 2. sep 2026) var status-facetten krydset af paa i
     produktion + annonceret, saa svaret var 74, ikke 77. INGEN facet har
     laengere en standardtilstand, saa standardvisningen ER hele kataloget -
     tallet er derfor bare `alle`, ikke et separat, udregnet delmaengde. */
  const iStandard = alle;

  /* --- TYPESKILTETS STEMPEL (JPK 1. sep 2026, punkt 2) ---------------------
     STOD FOER SOM FIRE FELTER (Type, Udgave, Poster, Oplyste felter). JPK
     spurgte ordret "Hvad er meningen med dette?", og det var et rigtigt
     spoergsmaal: "Oplyste felter" stod her som 842, paa sammenligningssiden
     som 30 og paa Om os som 1.116 - samme etiket, tre forskellige tal, ingen
     forklaring paa hvorfor. Type (QUAD-77) og Poster (77) gentog blot
     `alle`, som allerede staar i strimlens taeller og resultatoverskriften
     nogle faa linjer laengere nede - en dublet af et tal, siden allerede
     viser.

     KUN UDGAVEN BLIVER TILBAGE. Det er den ene af de fire, der IKKE staar
     andetsteds paa siden: den seneste hentedato i hele kataloget, dvs. hvor
     FRISK materialet er. En dato alene laeser som en tilfaeldig detalje uden
     et ord ved siden af, der siger hvad den er - derfor beholdes
     `stempel_udgave` ("Udgave"/"Edition") som etiket. Ordet er sandt: det er
     den udgave af datagrundlaget, siden er bygget af, og det er praecis det,
     koden nedenfor regner (den seneste `hentet`-dato paa tvaers af alle
     robotter). Ingen ny noegle noedvendig. */
  const datoer = [];
  for (const r of robotter) {
    if (r.billede?.hentet) datoer.push(r.billede.hentet);
    if (r.anvendelse?.hentet) datoer.push(r.anvendelse.hentet);
    for (const p of Object.values(r.felter ?? {})) {
      if (p && typeof p === 'object' && typeof p.hentet === 'string') datoer.push(p.hentet);
    }
  }
  const udgave = datoer.length ? datoer.sort()[datoer.length - 1] : '';
  const lande = new Set(robotter.map((r) => r.producentland)).size;

  const stempler = [
    [t('stempel_udgave'), udgave],
  ];

  /* --- STRIMLENS CHIPS ----------------------------------------------------
     Én <li> pr. mulig markering, skjult i hvile, taendt af sin egen regel
     (hovedStil §6c). Krydset er en <label>, ikke en <button>: en label kan
     slaa afkrydsningsfeltet fra UDEN JavaScript, hvilket en knap ikke kan. */
  const kryds = `<svg class="valg__kryds" width="9" height="9" viewBox="0 0 9 9" aria-hidden="true">`
    + `<path d="M1.4 1.4 7.6 7.6M7.6 1.4 1.4 7.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;
  const valgChip = (id, tekst, ekstra = '') => `<li class="valg${ekstra}" data-valg="${attr(id)}">`
    + `<span class="valg__navn">${esc(tekst)}</span>`
    + `<label class="valg__fjern" for="${attr(id)}">${kryds}`
    + `<span class="kunskaerm">${esc(tf('valg_fjern', { navn: tekst }))}</span></label></li>`;

  const valgListe = [];
  for (const f of F) {
    for (const v of f.liste) valgListe.push(valgChip(`f-${f.navn}-${nogle(v)}`, f.tekst(v)));
  }
  for (const k of K) valgListe.push(valgChip(`f-eg-${k.navn}`, t('eg_' + k.navn)));
  /* SKALAERNES CHIP ER TOM I HTML OG FYLDES AF assets/katalog.js. De oevrige
     chips kan tegnes ved byggetiden, fordi deres mulige vaerdier er en kort,
     kendt liste; en skala har 101 stillinger, og en <li> pr. stilling ville
     vaere 202 skjulte listeelementer i markuppen for at spare ét tekstkald.
     Uden JavaScript staar skalaens tilstand i stedet paa traerskel-chippene
     ovenfor, som er afkrydsningsfelter og derfor kan tegnes paa forhaand.
     En <button> er forsvarlig her netop fordi elementet KUN findes under
     JavaScript - modsat kryds-labelen ovenfor, der ogsaa skal virke uden. */
  for (const f of F) {
    if (!f.skala) continue;
    valgListe.push(`<li class="valg valg--skala" data-valg-skala="${attr(f.navn)}" hidden>`
      + `<span class="valg__navn" data-valg-skala-navn></span>`
      + `<button class="valg__fjern" type="button" data-valg-skala-ryd="${attr(f.navn)}">${kryds}`
      + `<span class="kunskaerm">${esc(tf('valg_fjern', { navn: f.etiket }))}</span></button></li>`);
  }
  // Status havde her et INVERTERET saerspor ("skjult-X" chippen), fjernet af
  // BRIEF-uifix.md punkt 3 (spor/uifix, 2. sep 2026) sammen med `standard`-
  // feltet paa facetten og saersporet i hovedStil(). Status' vaerdier faar nu
  // en almindelig chip fra loekken ovenfor, ligesom enhver anden facet.

  /* --- FACETGRUPPERNE ----------------------------------------------------- */
  const raekke = (f, v) => {
    const id = `f-${f.navn}-${nogle(v)}`;
    // INGEN facet har en standardtilstand laengere (BRIEF-uifix.md punkt 3,
    // spor/uifix, 2. sep 2026) - ingen checkbox er `checked` ved indlaesning.
    const valgt = '';
    // "ikke oplyst" og "nej" er EGNE tilstande med egne maerker, aldrig et hul.
    const stand = v === 'ikke_oplyst' ? ' rk--uoplyst' : v === 'nej' ? ' rk--nej' : '';
    return `<div class="rk${stand}">`
      + `<input class="rk__felt f-${attr(f.navn)}" type="checkbox" id="${attr(id)}"`
      + ` name="${attr(f.navn)}" value="${attr(v)}"${valgt}>`
      + `<label class="rk__mrk" for="${attr(id)}">`
      + `<span class="rk__boks" aria-hidden="true">${hjaelp.ikon(v === 'ikke_oplyst' ? 'i-ioplyst' : v === 'nej' ? 'i-nej' : 'i-ja', 'rk__tegn')}</span>`
      + `<span class="rk__navn">${esc(f.tekst(v))}</span>`
      + `<span class="antal"><span class="antal__tal">${esc(String(f.antal.get(v)))}</span>${omfangAlle}</span>`
      + `</label></div>`;
  };

  /* --- GRUPPENS "MINDST ÉT VALGT"-MAERKE (JPK 1. sep 2026, punkt 4) --------
     To spans, ALDRIG samme tekst paa samme tid:
       - `data-facet-aktiv` er den JavaScript-frie udgave. CSS kan ikke
         taelle, saa den er en TILSTEDEVAERELSE ("Valgt", genbruger
         strimmel_valgt) og ikke et tal - sand, men ikke praecis, praecis som
         briefets egen formulering. Regelen, der taender den, staar i
         hovedStil() og laeser samme `.f-${navn}`-klasse som resten af
         filtret. `:not([data-levende])` slukker den, saa snart JavaScript
         overtager.
       - `data-facet-antal` er den JavaScript kan fylde med det EKSAKTE tal
         (assets/katalog.js' facetgruppeAntal()). Den staar `hidden`, indtil
         scriptet saetter et tal - en tom taeller ville vaere en paastand
         uden daekning.
     Gruppens navn staar KUN på det omsluttende element (`data-facetgruppe`),
     ikke gentaget paa hvert maerke - assets/katalog.js laeser det ÉN gang
     pr. gruppe og finder sine to spans som efterkommere. */
  const facetAktivMrk = () => `<span class="facet__aktiv" data-facet-aktiv hidden>${esc(t('strimmel_valgt'))}</span>`
    + `<span class="facet__aktiv-tal" data-facet-antal hidden></span>`;

  /* FACETGRUPPEN ER ET <details>/<summary> (JPK 1. sep 2026, punkt 4:
     "Filter-felterne skal vaere collapsed som default"). `open` udelades
     bevidst - collapsed ER standarden.

     KLASSERNE STAAR UAENDRET (`facet facet--sN`), og det er ikke en
     bekvemmelighed: generator.css:1356-1366 saetter display, polstring,
     hairlines og grid-column-spaend paa NETOP disse klassenavne, uden at
     spoerge om baereren er et <fieldset> eller et <details> - CSS kender
     ikke til tags, kun klasser. Byttet fra <fieldset>+<legend> til
     <details>+<summary> koster derfor ikke én linje i generator.css, som
     dette spor alligevel ikke maa roere.

     `data-facetgruppe` er kun til assets/katalog.js' opslag (facetgruppeAntal
     finder sine to maerker som efterkommere af den) - hovedStil()s egne
     :has()-regler bruger stadig `.f-${navn}`-klassen, uaendret af byttet. */
  const facetBlok = (f, bredde, klasser = '') => `<details class="facet facet--s${bredde}${klasser}" data-facetgruppe="${attr(f.navn)}">
<summary class="facet__navn">${esc(f.etiket)}${f.mrk ? `<span class="facet__tal">${esc(f.mrk)}</span>` : ''}${facetAktivMrk()}</summary>
${f.liste.map((v) => raekke(f, v)).join('\n')}
</details>`;

  /* --- SKALABLOKKEN (L65c) -------------------------------------------------
     Samme fieldset som enhver anden facet, med tre ting mere: en skala, dens
     ridser, og en trinliste der viger for den.

     SKALAEN ER IKKE-LINEAER, OG DET ER MAALT FREM, ikke valgt af smag. Paa en
     lineaer akse fra 0 til 200 kg ville 60 af de 65 oplyste robotter ligge paa
     de foerste 40 % af banen, og ridserne ved 5 og 10 kg ville staa 2,5 % fra
     hinanden - ulaeselige ved enhver realistisk bredde. Aksen loeber derfor
     gennem KNUDER (0, de fire traerskler, og datasaettets stoerste vaerdi), som
     fordeles JAEVNT paa banen; mellem to knuder interpoleres der lineaert, saa
     enhver mellemliggende vaerdi stadig kan stilles ind. Det er samme greb som
     paa et manometer med sammentrykt topomraade - en aflaesning, ingen laeser
     forveksler med en lineal, fordi ridserne staar der og siger hvad der er
     hvor.

     RIDSERNE ER TRAERSKLERNE. Det er ikke pynt: de er NOEJAGTIG de trin, den
     JavaScript-frie udgave filtrerer i. Laeseren, der stiller skalaen paa 20,
     staar paa den ridse, en anden laeser uden JavaScript ville have krydset af.
     Strukturen siger altsaa noget sandt om indholdet i stedet for at
     dekorere det.

     KNUDERNE SENDES MED SOM DATA, ikke som en kopi af trin-listen i
     assets/katalog.js. To lister, der skal vaere ens, driver fra hinanden ved
     fjerde rettelse; her findes de kun ét sted (SKALAER) og skrives ud i
     `data-skala-knuder`.

     `hidden` PAA SKALAEN ER P0 I PRAKSIS. Et <input type=range> uden
     JavaScript er en kontrol, der ikke goer noget - og en kontrol, der ikke
     goer noget, er vaerre end ingen kontrol. assets/katalog.js fjerner
     attributten; goer den det ikke, ser laeseren kun trinlisten, og den
     virker. Samme moenster som soegefeltet og samlknappen. */
  const skalaBlok = (f, bredde, klasser = '', noteHtml = null) => {
    const s = f.skala;
    const knuder = [...new Set([s.mindste, ...s.trin.filter((n) => n < s.stoerste), s.stoerste])]
      .sort((a, b) => a - b);
    const led = Math.max(1, knuder.length - 1);
    const hvileTekst = t(s.retning === 'mindst' ? 'skala_hvile_mindst' : 'skala_hvile_hoejst');
    const trinRaekker = f.liste.filter((v) => v !== 'ikke_oplyst');
    const uoplyst = f.liste.filter((v) => v === 'ikke_oplyst');

    const ridser = knuder.map((n, i) => `<span class="skala__ridse" style="left:${attr(String(Math.round((i / led) * 1e4) / 100))}%">`
      + `<span class="skala__ridse-tal">${esc(hjaelp.nformat(n))}</span></span>`).join('');

    // Samme <details>/<summary>-bytte som facetBlok() - se dens kommentar.
    // Skalaen er ogsaa collapsed som standard: JavaScript fjerner `hidden`
    // fra selve skalaen (linjen ovenfor), ikke fra <details>-elementets
    // `open`, saa en laeser uden JavaScript stadig skal folde gruppen ud for
    // at naa trinlisten - konsekvent med alle otte andre grupper.
    return `<details class="facet facet--s${bredde} facet--skala${klasser}" data-facetgruppe="${attr(s.navn)}">
<summary class="facet__navn">${esc(f.etiket)}${f.mrk ? `<span class="facet__tal">${esc(f.mrk)}</span>` : ''}${facetAktivMrk()}</summary>

<div class="skala" hidden
 data-skala="${attr(s.navn)}"
 data-skala-retning="${attr(s.retning)}"
 data-skala-enhed="${attr(s.enhed)}"
 data-skala-knuder="${attr(knuder.join(' '))}"
 data-skala-afrund="${attr(String(s.skridt))}"
 data-skala-hvile="${attr(String(s.hvile))}"
 data-skala-hviletekst="${attr(hvileTekst)}"
 data-skala-ord="${attr(t(s.retning === 'mindst' ? 'skala_ord_mindst' : 'skala_ord_hoejst'))}"
 data-skala-traef-skabelon="${attr(t('skala_traef'))}">
<p class="skala__aflaes">
<span class="skala__ord" data-skala-visord>${esc(hvileTekst)}</span>
<b class="skala__tal" data-skala-vistal></b>
<span class="skala__enhed" data-skala-visenhed></span>
</p>
<input class="skala__greb" type="range" id="skala-${attr(s.navn)}"
 min="0" max="100" step="1" value="${attr(String(s.retning === 'mindst' ? 0 : 100))}"
 aria-label="${attr(f.etiket)}" aria-valuetext="${attr(hvileTekst)}">
<p class="skala__ridser" aria-hidden="true">${ridser}</p>
<p class="skala__traef" data-skala-traef role="status"></p>
<p class="kunskaerm">${esc(t('skala_ridser'))}</p>
</div>

<div class="skala__trin">
${trinRaekker.map((v) => raekke(f, v)).join('\n')}
</div>
${uoplyst.map((v) => raekke(f, v)).join('\n')}
<p class="t-mikro skala__note">${noteHtml ?? esc(f.note)}</p>
</details>`;
  };

  /* Egenskabsgruppen. Chippen er ÉT afkrydsningsfelt ("vis kun dem, der kan
     det"), men alle TRE tilstande staar som tal ved siden af - haard
     begraensning 5. Laeseren kan derfor se, hvad et kryds vil koste, FOER
     klikket: 35 robotter siger ikke noget om trapper, og de forsvinder. */
  const tegn = { ja: 'i-ja', nej: 'i-nej', nul: 'i-nul', ikke_oplyst: 'i-ioplyst' };
  const delTal = (slags, n, ord) => `<span class="d d--${slags === 'ikke_oplyst' ? 'uoplyst' : slags}">`
    + `${hjaelp.ikon(tegn[slags], 'd__tegn')}<span class="d__tal">${esc(String(n))}</span>`
    + `<span class="d__ord">${esc(ord)}</span></span>`;

  const chipsHtml = K.map((k) => `<div class="chip">
<input class="chip__felt f-eg" type="checkbox" id="f-eg-${attr(k.navn)}" name="eg" value="${attr(k.navn)}">
<label class="chip__krop" for="f-eg-${attr(k.navn)}">
<span class="chip__navn">${esc(t('eg_' + k.navn))}</span>
<span class="deling">${delTal('ja', k.ja, T.ja)}`
    // Et taelleligt NUL er ikke det samme som et manglende svar: 0 robotter
    // afviser hot-swap, og det maerke skal derfor vaere nul-maerket.
    + `${delTal(k.nej === 0 ? 'nul' : 'nej', k.nej, T.nej)}`
    + `${delTal('ikke_oplyst', k.ikke_oplyst, T.tilstand_ikke_oplyst)}`
    + `<span class="antal antal--chip">${omfangAlle}</span></span>
</label>
</div>`).join('\n');

  const frostNul = robotter.filter((r) => {
    const p = r.felter?.temp_min;
    return p && typeof p === 'object' && p.vaerdi === 0;
  }).length;
  const frost = K.find((k) => k.navn === 'frost');

  /* --- FACETLAGET --------------------------------------------------------- */
  const anv = F.find((f) => f.navn === 'anv');
  const vaegt = F.find((f) => f.navn === 'vaegt');
  const ip = F.find((f) => f.navn === 'ip');
  const land = F.find((f) => f.navn === 'land');
  const nyttelast = F.find((f) => f.navn === 'nyttelast');
  const pris = F.find((f) => f.navn === 'pris');

  /* KURSENS KILDE STAAR SOM ET LINK, ikke som en paastand om en kilde.
     Acceptkriteriet for L66 er, at kursens kilde og dato kan LAESES paa siden;
     et link, laeseren kan foelge og selv slaa efter i, er den staerkeste form
     for det. Det er samme greb som kildemaerket ved ethvert andet tal paa
     siden (side.mjs:1263), og `rel` er den samme dér. */
  const prisNoteHtml = `${esc(pris.note)} <a class="url" href="${attr(KURSER.kilde.url)}"`
    + ` rel="nofollow noopener external">`
    + `${esc(tf('kurs_kilde', {
      udgiver: KURSER.kilde.udgiver,
      navn: KURSER.kilde.navn,
      dato: hjaelp.dformat(KURSER.kilde.dato),
    }))}</a>`;

  /* De to skalaer faar en RAEKKE FOR SIG SELV nederst, seks kolonner hver.
     Ikke af pladshensyn: en skala er en vandret betjening, og klemt ned i tre
     kolonner ved siden af en afkrydsningsliste ville dens bane vaere kortere
     end dens egen aflaesning. `facet--sidste-raekke` flytter derfor HERNED fra
     ip/status/land, som ikke laengere er nederst.

     SPAENDENE ER RETTET TIL EN GENTAGET GITTERRYTME (JPK 1. sep 2026,
     PUNKT 4R). Foer denne rettelse brugte raekke 1 spaendene 3·4·5 (graenser
     ved kolonne 3, 7, 12) mod raekke 2's 3·3·3·3 (graenser ved 3, 6, 9, 12)
     og skalaraekkens 6·6 (graense ved 6, 12) - tre forskellige moenstre, der
     ikke lagde lodret linje ned gennem fladen. JPK maalte det og navngav
     aarsagen praecist: "kolonnegraenserne gentager sig ikke mellem
     raekkerne", ikke bare "for meget".

     LOESNINGEN: enhver graense, der forekommer NOGET sted i gitteret, skal
     vaere et multiplum af 3 - saa den altid falder paa en linje, en af de
     oevrige raekker OGSAA bruger. Vaegt gaar fra 4 til 3 kolonner (den har
     kun fire faste vaegtklasser og trængte aldrig til den fjerde), og
     Egenskaber gaar fra 5 til 6 (den baerer mest indhold - fem chips med
     hver sin tre-delte "ja/nej/ikke oplyst"-taelling - og faar dermed den
     bredde, den allerede havde mest brug for). Raekke 1 bliver 3·3·6
     (graenser 3, 6, 12); raekke 2 er uaendret 3·3·3·3 (3, 6, 9, 12);
     skalaraekken er uaendret 6·6 (6, 12) - JPK's egen tilladte undtagelse.
     Alle tre raekkers graenser er nu en delmaengde af {3, 6, 9, 12}, saa
     6 og 12 gaar igen i hver eneste raekke - den lodrette rytme, oejet
     ledte efter. Maalt med Playwright ved 1440 px, se sporets rapport for
     de faktiske x-koordinater foer/efter.

     INGEN NY CSS-KLASSE NOEDVENDIG: `.facet--s3` og `.facet--s6` findes
     begge allerede (generator.css §20e hhv. system.css's filterskala-blok)
     - kun ARGUMENTERNE her aendrede sig, ikke generator.css, som denne
     rettelse ikke maa roere (samtidigt spor ejer den filen). */
  const facetNet = `<div class="facetter__net">
${facetBlok(anv, 3)}
${facetBlok(vaegt, 3)}
<details class="facet facet--s6 facet--raekkeslut" data-facetgruppe="eg">
<summary class="facet__navn">${esc(t('filter_egenskaber'))}<span class="facet__tal">${esc(t('filter_egenskaber_mrk'))}</span>${facetAktivMrk()}</summary>
${chipsHtml}
<p class="chip-fod">${esc(tf('eg_fod', { n: alle, m: frost.nej, k: frostNul }))}</p>
</details>
${facetBlok(ip, 3)}
${facetBlok(status, 3)}
${facetBlok(land, 3)}
<!-- CERTIFICERING ER RESERVERET OG TOM: ingen afkrydsningsfelt findes endnu,
     saa den faar hverken data-facetgruppe eller facetAktivMrk() - der er
     intet at "vaere valgt". Den foldes stadig sammen som standard, for
     konsistens med de otte oevrige grupper (JPK 1. sep 2026, punkt 4). -->
<details class="facet facet--s3 facet--raekkeslut">
<summary class="facet__navn">${esc(t('filter_certificering'))}<span class="facet__tal">${esc(t('filter_certificering_mrk'))}</span></summary>
<div class="reserveret">
<p class="reserveret__ord">${esc(t('filter_certificering_ord'))}</p>
<p class="reserveret__note">${esc(tf('filter_certificering_note', { n: robotter.filter((r) => hjaelp.ceTilstand(r) === 'ja').length, m: alle }))}</p>
</div>
</details>
${skalaBlok(nyttelast, 6, ' facet--sidste-raekke')}
${skalaBlok(pris, 6, ' facet--raekkeslut facet--sidste-raekke', prisNoteHtml)}
</div>`;

  /* --- DEN OMREGNEDE PRIS PAA KORTET (L66) --------------------------------
     FJERNET af BRIEF-uifix.md punkt 5 (spor/uifix, 2. sep 2026): "katalog-
     siden viser kun USD". Her stod foer en `prisMaerke()`, der viste
     producentens EGEN valuta som hovedtal og vores USD-omregning ved siden
     af med et synligt "≈"-maerke (samme form som L60's imperiale omregning).
     JPK's ord var entydige: originalvalutaen forsvinder fra kortet - ikke
     kun dens maerke, som punkt 2 fjernede, men TALLET selv. Kortets prisfelt
     (se vaerdi() nedenfor) viser derfor nu prisen direkte i BASISVALUTA for
     ALLE robotter, uanset hvad producenten selv skrev - og der er intet
     sekundaert tal tilbage at maerke.

     KILDEMAERKET BLIVER (briefets egen formulering, en bevidst afvigelse fra
     regel 3's "en omregning har ingen selvstaendig kilde" - se vaerdi()
     nedenfor for hvordan). En forklaring af SELVE omregningen (kildefigur,
     kurs) er derimod IKKE flyttet med: den forklaring maatte navngive
     originalvalutaen for at give mening, og den maa netop ikke staa paa
     siden laengere - hverken synligt eller i skjult tekst, jf. acceptkrite-
     riets "grep -o 'CNY' ... 0". Den fulde forklaring staar stadig paa
     robottens egen side (punkt 6, uroert).

     Ingen "fra kun", ingen valutavaelger: haard begraensning 1 gaelder
     uaendret - tallet er en OPLYSNING, ikke et tilbud. */

  /* --- KORTET -------------------------------------------------------------
     L56 punkt 7: billede + producent + produktnavn, intet andet. Katalogets
     kort er BEVIDST ikke hjaelp.kort(): den deles med forsiden og
     producentsiderne, som ikke er bygget om i dette spor, og som stadig skal
     have striben, landet og anvendelsesmaerkerne. En faelles funktion, der
     skulle kunne begge, ville vaere en kontakt med to stillinger - og det er
     praecis den konstruktion, sprogreglen i CLAUDE.md forbyder et andet sted.

     Statusstemplet lægges KUN paa, naar status ikke er "i produktion":
     forskellen er den eneste, kortet skal kunne baere (MANIFEST §Layouttesen). */
  let kortIndeks = 0;

  /**
   * Selve kortet. `variant` giver aabningens kort en EGEN klasse, og det er
   * ikke kosmetik: tools/build.mjs:66 taeller `<article class="kort">` ordret
   * og paastaar (linje 295), at kataloget har praecis én pr. datafil. Ville
   * aabningens ni kort baere den samme ordrette streng, ville bygget fejle med
   * 86 mod 77 - og den paastand har ret: det er RESULTATGITTERET, der skal
   * have ét kort pr. robot. Varianten holder derfor taellingen aerlig i stedet
   * for at slaa den fra.
   */
  const kortHTML = (r, { variant = '', under = '' } = {}) => {
    const eager = kortIndeks < hjaelp.EAGER_KORT_ANTAL;
    kortIndeks += 1;
    const stempel = r.status === 'i_produktion' ? ''
      : `<span class="kort__mrk">${esc(T['status_' + r.status])}</span>`;
    // Linket ligger paa NAVNET, ikke om hele kortet: skaermlaeseren skal
    // annoncere "Go2", ikke hele kortets indhold. `.kort__navn a::after`
    // daekker kortet, saa hele fladen alligevel er klikbar.
    //
    // ÅBNINGSTAGGEN ER ORDRET `<article class="kort">` for resultatgitteret.
    // tools/build.mjs:66 taeller netop den streng, saa hverken et style- eller
    // et data-attribut maa ind foran klassen. Rangtallene staar derfor paa det
    // yderste lag og ARVES ned (CSS-variable nedarves) - samme greb som foer
    // ombygningen.
    return `<article class="kort${variant}">`
      + `${stempel}${hjaelp.samlknap(r)}${hjaelp.billede(r, url.op, { eager })}`
      + `<div class="kort__tekst">`
      + `<p class="kort__prod">${esc(r.producent)}</p>`
      + `<h3 class="kort__navn"><a href="${attr(url.robot(r.slug))}">${esc(r.navn)}</a></h3>`
      + `${under}</div></article>`;
  };

  /** Resultatgitterets kort: indpakket i ét lag pr. facet. */
  const lagKortHTML = (r) => {
    const sogetekst = [
      r.navn, r.producent, r.producentland, hjaelp.land(r.producentland),
      ipVaerdi(r), t('vaegtklasse_' + hjaelp.vaegtklasse(r)),
      ...hjaelp.anvendelse(r).vaerdier.map((v) => (v === 'ikke_oplyst' ? T.tilstand_ikke_oplyst : t('anvendelse_' + v))),
    ].join(' ').toLowerCase();

    const ordner = SORTERINGER.filter((s) => !s.standard)
      .map((s) => `--o-${s.navn}:${rang.get(s.navn).get(r.slug)}`).join(';');
    // Det aerlige savn-maerke: kun for de sorteringer, robotten IKKE oplyser.
    const savn = SORTERINGER.filter((s) => !s.standard && s.tal(r) === null)
      .map((s) => `<span class="kort__savn kort__savn--${s.navn}">${esc(t(s.savn))}</span>`).join('');

    /* DEN ANDEN HALVDEL AF SAVN-MAERKET (JPK 1. sep 2026: "ved sortering skal
       det sorterede felt vises paa kortet"). Savn-maerket sagde hidtil kun,
       hvem der TIER; nu siger raekken ved siden af, hvad de oevrige SIGER.

       DE TO ER SAMME RAEKKE MED SAMME ETIKET og adskiller sig kun i det, de
       baerer: en stiplet tom firkant mod en sat figur. Det er haard
       begraensning 5 i selve formen - et hul kan ikke forveksles med et tal,
       fordi de to ikke deler hverken bogstavform eller flade.

       TALLET GAAR GENNEM H.tal() og aldrig gennem en egen formatering: den
       funktion baerer kildemaerket, operatoren ("ca.", "fra"), intervallet,
       forbeholdet og den imperiale sidevaerdi - fem ting, en haandskrevet
       streng ville tabe én ad gangen. `kompakt: true` er kortets tilstand:
       den imperiale vaerdi flytter til `title` og `.kunskaerm` i stedet for at
       konkurrere med hovedfiguren i en 232 px celle.

       `forbehold: post.advarsel` er samme moenster som forsidens yderpunkt
       (forside.mjs:197). Uden den linje tabte kortet robottens EGEN
       advarselstekst - fx Vision 60's R9-afvigelse mellem metrisk og
       imperial - og viste kun den generiske lastbetingelse. */
    const kilder = hjaelp.kilder(r);
    const vaerdi = SORTERINGER.filter((s) => !s.standard && s.tal(r) !== null)
      .map((s) => {
        // BRIEF-uifix.md punkt 5 (spor/uifix, 2. sep 2026): prisfeltet vises
        // i BASISVALUTA uanset producentens egen valuta - "katalogsiden
        // viser kun USD". `post` klones med `vaerdi`/`enhed` overskrevet til
        // den omregnede USD-figur; alle andre felter (isaer `.kilde`) staar
        // uroert, saa hjaelp.tal()s kildemaerke nedenfor STADIG peger paa
        // producentens side - "kildemaerket bliver", briefets egen
        // formulering, en bevidst afvigelse fra regel 3 ("en omregning har
        // ingen selvstaendig kilde") for netop dette felt. Robotsidens eget
        // prisfelt (robot.mjs) er UROERT af dette - punkt 6, uaendret.
        const post = s.navn === 'pris'
          ? { ...s.post(r), vaerdi: prisIBasis(r).tal, enhed: BASISVALUTA }
          : s.post(r);
        const figur = hjaelp.tal(post, {
          kilder,
          hvorhen: url.robot(r.slug),
          kompakt: true,
          forbehold: post.advarsel ? [post.advarsel] : [],
        });
        return `<span class="kort__vaerdi kort__vaerdi--${s.navn}">`
          + `<span class="kort__vaerdi-mrk">${esc(t(s.feltnoegle))}</span>`
          + `${figur}</span>`;
      }).join('');

    // Ét lag pr. listefacet, plus ÉT faelles lag til alle fem egenskabschips.
    //
    // SKALALAGENE BAERER ÉT ATTRIBUT MERE: robottens RAA tal (`data-*-tal`).
    // Traersklerne i `data-nyttelast` er nok for CSS, men slideren kan staa
    // hvor som helst mellem dem, og den skal kunne sammenligne mod det
    // faktiske tal. Attributten udelades helt, naar robotten ikke oplyser
    // feltet - et tomt attribut ville skulle skelnes fra "0", og det er
    // noejagtig den sammenblanding, haard begraensning 5 forbyder. Fravaeret
    // ER tilstanden, og assets/katalog.js laeser den som saadan.
    const egVaerdier = K.filter((k) => kapabilitet(r, k) === 'ja').map((k) => k.navn).join(' ');
    const aabne = F.map((f, i) => {
      const vaerdier = f.vaerdier(r).join(' ');
      const ekstra = i === 0
        ? ` data-sog="${attr(sogetekst)}" style="${attr(ordner)}"`
        : '';
      let raatal = '';
      if (f.skala) {
        const v = f.skala.tal(r);
        if (v !== null) raatal = ` data-${attr(f.navn)}-tal="${attr(String(v))}"`;
      }
      return `<div class="lag lag-${attr(f.navn)}" data-${attr(f.navn)}="${attr(vaerdier)}"${raatal}${ekstra}>`;
    }).join('') + `<div class="lag lag-eg" data-eg="${attr(egVaerdier)}">`;
    // Vaerdien foerst, savnet derefter: de er gensidigt udelukkende pr.
    // sortering (én robot kan ikke baade oplyse og tie om samme felt), saa
    // raekkefoelgen i DOM'en afgoer intet visuelt - kun at de to hoerer til
    // samme baelte under navnet.
    return `${aabne}\n${kortHTML(r, { under: vaerdi + savn })}\n${'</div>'.repeat(F.length + 1)}`;
  };

  /* --- AABNINGEN: DE SENESTE MODELLER -------------------------------------
     JPK's tillaeg 31. aug 2026. Compen har INGEN aabning, saa formen er
     fortolket - men den er fortolket inden for typeskiltet: en stanset plade,
     aarstallet stemplet som et stort tal, resten i pladens egen skrift.

     DEN ER SAT AF ROBOTTER, IKKE AF EN PAASTAND, og det er svaret paa D20
     ("skal katalogsiden aabne med robotterne i stedet for betjeningen?").
     Et hero-baand af ren tekst ville have skubbet det foerste robotkort
     LAENGERE ned; dette traekker det op til sidens foerste skaerm.

     AERLIGHEDEN ER SELVE OPGAVEN HER. 45 af 77 oplyser et udgivelsesaar,
     32 goer ikke. De 32 maa aldrig komme til at se GAMLE ud: "ikke oplyst" er
     ikke en daarlig aargang, det er en tavshed (haard begraensning 5). Derfor
     staar kvalifikationen i selve blokken - ikke i en fodnote - og udvalget
     praesenteres som "udgivet i <aar>", et faktum, og ikke som "de nyeste
     robotter", en rangordning de 32 ikke har faaet lov at deltage i. */
  const medAar = robotter.filter((r) => typeof r.foerste_udgivelse === 'number');
  const senesteAar = medAar.length ? Math.max(...medAar.map((r) => r.foerste_udgivelse)) : null;
  const seneste = medAar.filter((r) => r.foerste_udgivelse === senesteAar)
    .sort((a, b) => String(a.navn).localeCompare(String(b.navn), sprog));

  /* H1'ET ER SEKTIONENS EGEN OVERSKRIFT, IKKE SIDENS (JPK 1. sep 2026: "skal
     ikke vaere 'All robots', men mere beskrivende for hvad der vises i den
     sektion"). Det staar strukturelt korrekt allerede - <section
     aria-labelledby="aabning-titel"> goer h1'et til navnet paa NETOP
     aabningen, ikke paa hele siden - men teksten sagde noget andet end
     strukturen lovede. `katalog_titel` ("Alle robotter") maa IKKE genbruges
     her: build.mjs:322 bruger samme noegle til <title>, og producent.mjs:263
     bruger den til modelafsnittets H2 - begge steder er "Alle robotter"
     korrekt, og en aendret VAERDI ville have rettet dette h1 ved at
     oedelaegge de to andre. Derfor sin egen noegle, sand om netop de
     `seneste.length` kort, aabningen viser (maalt 1. sep 2026: 9 paa tvaers
     af den seneste udgivelsesaargang). */
  const aabning = senesteAar === null ? '' : `<section class="aabning" aria-labelledby="aabning-titel">
<div class="aabning__krop stans">
<div class="aabning__hoved">
<div class="aabning__ord">
<h1 class="aabning__titel" id="aabning-titel">${esc(t('katalog_seneste_titel'))}</h1>
<p class="aabning__under">${esc(tf('katalog_plade_under', { n: alle, l: lande }))}</p>
</div>
<p class="aarstempel">
<span class="aarstempel__tal">${esc(String(senesteAar))}</span>
<span class="aarstempel__ord">${esc(t('seneste_aar_ord'))}</span>
</p>
</div>
<div class="aabning__baand">
<h2 class="aabning__flok">${esc(tf('seneste_antal', { n: seneste.length, aar: senesteAar }))}</h2>
<p class="aabning__note">${esc(tf('seneste_note', { m: medAar.length, i: alle, u: alle - medAar.length }))}</p>
</div>
<div class="net net--seneste">
${seneste.map((r) => kortHTML(r, { variant: ' kort--seneste' })).join('\n')}
</div>
</div>
</section>`;

  /* --- SORTERINGSKONTROLLEN ------------------------------------------------
     Radioknapper, ikke <select>. Compen tegner en <select>, men en <select>
     kan ikke drive `order` uden JavaScript, og sorteringen skal virke uden -
     samme loefte som filtrene (tests/dele/24-flade.mjs vogter det). Formen er
     derfor en stanset raekke, ikke en rullemenu; det er den eneste bevidste
     afvigelse fra compens facon paa denne flade. */
  const sortervalg = SORTERINGER.map((s, i) => `<input type="radio" class="f-sort" id="sort-${attr(s.navn)}"`
    + ` name="sort" value="${attr(s.navn)}"${i === 0 ? ' checked' : ''}>`
    + `<label for="sort-${attr(s.navn)}">${esc(t(s.noegle))}</label>`).join('\n');
  /* Sorteringens noter. Prisnoten er den eneste, der har vaerdier at indsaette
     - kursens dato og antallet af omregnede priser - og de HENTES i stedet for
     at staa i teksten: en dato skrevet ind i sprogfilen ville skulle rettes to
     steder, hver gang kursen fornys, og det andet sted ville blive glemt.
     Kildens navn og link staar i filterets prisnote, hvor der er plads til
     dem; her staar kun datoen, saa laeseren kan se, hvor gammelt tallet er. */
  const prisTal = robotter.filter((r) => prisIBasis(r) !== null).length;
  const noteVaerdier = {
    pris: { basis: BASISVALUTA, dato: hjaelp.dformat(KURSER.kilde.dato), n: prisTal },
  };
  const sorterNoter = SORTERINGER.filter((s) => s.note)
    .map((s) => `<p class="t-mikro sorter__note" data-note="${attr(s.navn)}">`
      + `${esc(noteVaerdier[s.navn] ? tf(s.note, noteVaerdier[s.navn]) : t(s.note))}</p>`).join('\n');

  return `<div class="rum">
${aabning}
<form class="styr" id="styr" action="#alle" method="get">

<section class="plade" aria-labelledby="plade-titel">
<div class="plade__krop stans">

<div class="plade__hoved">
<div class="plade__ord">
<h2 class="plade__titel" id="plade-titel">${esc(t('plade_filtrer'))}</h2>
<p class="plade__under">${esc(t('filter_uden_js'))}</p>
</div>
<dl class="stempler">
${stempler.map(([n, v]) => `<div class="stempel"><dt>${esc(n)}</dt><dd>${esc(v)}</dd></div>`).join('\n')}
</dl>
</div>

<div class="strimmel">
<span class="strimmel__mrk">${esc(t('strimmel_valgt'))}</span>
<ul class="valgliste">
${valgListe.join('\n')}
</ul>
<p class="taeller">
<span class="taeller__tal">${esc(hjaelp.nformat(iStandard))}</span>
<span class="taeller__af">${esc(tf('taeller_af_alle', { n: alle }))}</span>
${omfangStandard}
</p>
<button class="nulstil" type="reset" data-nulstil>${esc(t('filter_nulstil'))}</button>
</div>

<!-- SAMLTAELLEREN. Staar i strimlen, hvor sidens oevrige aktive valg allerede
     staar - en chip blandt chips, som forsvinder helt, naar udvalget er
     tomt. Tom i HTML'en og fyldt af assets/katalog.js: uden JavaScript
     findes hverken knapperne eller udvalget, saa en taeller ville vaere en
     paastand om noget, laeseren ikke kan naa (P0).

     JPK OMGJORDE 1. sep 2026 (L67, punkt 6) det FRAVALG, der stod her indtil
     i dag: "et svaevende 'N valgt' med en fremad-knap er indkoebskurvens
     form". Bjaelken findes nu OGSAA - se assets/katalog.js' KLAEBEBAR-afsnit
     - som en PERSISTENT paamindelse, mens laeseren scroller forbi denne
     strimmel og ned gennem gitterets 77 kort. De to er ikke i konflikt:
     denne chip er kontekstuel (staar kun, mens man ser filterpladen),
     bjaelken er global (staar hele siden igennem). Haard begraensning 1
     gaelder stadig begge - se katalog.js for hvordan bjaelken overholder
     den (navne, ikke antal; intet ikon; ingen "fortsaet"-knap).

     data-klaebebar-etiket baerer bjaelkens ARIA-navn; resten af dens tekst
     (link og ryd) LAESER katalog.js fra klasserne saml-taeller__gaa/__ryd
     herunder i stedet for at faa sin egen kopi - ét sted at oversaette
     "Åbn sammenligningen"/"Ryd udvalget", ikke to. -->
<p class="saml-taeller" data-saml-taeller hidden
 data-saml-skabelon="${attr(t('saml_taeller'))}"
 data-saml-maks-tekst="${attr(t('sammenligning_maks'))}"
 data-klaebebar-etiket="${attr(t('klaebebar_etiket'))}">
<span class="saml-taeller__tal" data-saml-tal>0</span>
<span data-saml-ord></span>
<a class="saml-taeller__gaa" href="${attr(url.sammenligning)}">${esc(t('saml_gaa'))}</a>
<button class="saml-taeller__ryd" type="button" data-saml-ryd>${esc(t('saml_ryd'))}</button>
</p>
<p class="saml-graense" data-saml-graense role="status"></p>

<details class="udtraek" open>
<summary class="udtraek__greb">${esc(t('filter_udtraek'))}<span class="haandtag" aria-hidden="true">${hjaelp.ikon('i-pil', 'haandtag__tegn')}</span></summary>
<div class="sog" data-sog="katalog" hidden>
<label class="etiket" for="sog-katalog">${esc(t('katalog_soeg_etiket'))}</label>
<input id="sog-katalog" name="s" type="search" autocomplete="off"
 placeholder="${attr(t('katalog_soeg_pladsholder'))}">
</div>
${facetNet}
<p class="t-mikro facet-omfang" data-omfang-note hidden>${esc(t('filter_omfang_statisk'))}</p>
</details>

</div>
</section>

<section class="resultat" aria-labelledby="resultat-titel">
<div class="resultat__hoved">
<h2 class="resultat__titel" id="resultat-titel" data-antal-flere="${attr(t('antal_kort'))}" data-antal-en="${attr(t('antal_kort_en'))}">
<span class="antal__tal">${esc(iStandard === 1 ? t('antal_kort_en') : tf('antal_kort', { n: iStandard }))}</span>${omfangStandard}
</h2>
<fieldset class="sorter">
<legend class="sorter__etiket">${esc(t('katalog_sortering_etiket'))}</legend>
<div class="sortervalg">
${sortervalg}
</div>
</fieldset>
</div>
${sorterNoter}
<div class="net" id="alle">
${sorteret.map(lagKortHTML).join('\n')}
</div>

<p class="tomt" data-tomt hidden role="status">
<span data-tomt-grund="soeg">${esc(t('soeg_ingen_traef'))}</span>
<span data-tomt-grund="filter" hidden>${esc(t('filter_ingen_traef'))}</span>
<a class="videre videre--stille tomt__ryd" data-ryd href="#alle">${esc(t('filter_vis_alle'))}</a>
</p>
</section>
</form>

<p class="t-lille kort-legende">${esc(t('kort_legende'))}</p>
<p class="t-lille sektion-note">${esc(tf('eu_pointe', { n: robotter.filter((r) => hjaelp.ceTilstand(r) === 'ikke_oplyst').length, m: alle }))}</p>
${hjaelp.tegnforklaring()}
</div>`;
}
