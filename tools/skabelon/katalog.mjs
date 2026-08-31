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

import { esc } from './side.mjs';
import { tilstandAf } from '../skema.mjs';

const attr = esc;

/** Et vaerdinavn, der kan staa i et id og i en attributvaelger. */
const nogle = (v) => String(v).toLowerCase().replace(/[^a-z0-9_]+/g, '-');

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

/** Er feltet oplyst overhovedet (uanset om svaret er ja, nej eller et tal)? */
const erOplyst = (robot, navn) => laesFelt(robot, navn).slags !== 'ikke_oplyst';

function ipVaerdi(robot) {
  const p = robot.felter?.ip_klasse;
  if (p === undefined) return 'ikke_oplyst';
  if (typeof p === 'string') return tilstandAf(p) ?? 'ikke_oplyst';
  const t0 = tilstandAf(p.vaerdi);
  if (t0) return t0;
  return String(p.vaerdi);
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
   3. FACETTERNE
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
      /* STATUS er den ENESTE facet med en standardtilstand (L56 punkt 5):
         udgaaede skjult, i produktion + annoncerede vist. Den saettes med
         almindelige `checked`-attributter i HTML, saa den virker uden
         JavaScript og kan nulstilles af en <button type="reset">. */
      navn: 'status',
      etiket: t('filter_status'),
      mrk: t('filter_status_mrk'),
      vaerdier: (r) => [r.status],
      tekst: (v) => T['status_' + v],
      orden: ['i_produktion', 'annonceret', 'udgaaet'],
      standard: new Set(['i_produktion', 'annonceret']),
    },
    {
      navn: 'land',
      etiket: t('filter_land'),
      vaerdier: (r) => [r.producentland],
      tekst: (v) => hjaelp.land(v),
    },
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
   4. SORTERINGEN (L56 punkt 3)
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
 * PRISEN ER GRUPPERET EFTER VALUTA, ikke omregnet. Skemaet siger det selv
 * (tools/skema.mjs): CNY/USD/EUR kan kun omregnes med en kurs, og en kurs er
 * et tal, vi ville have opfundet - haard begraensning 2. Maalt 31. aug 2026:
 * 11 af 77 oplyser pris, fordelt CNY 6 · USD 4 · EUR 1. Derfor sorteres der
 * inden for hver valuta, valutaerne staar i fast alfabetisk orden, og
 * kontrollen baerer en note, der siger praecis det.
 */
const SORTERINGER = [
  { navn: 'alfa', noegle: 'katalog_sortering_alfabetisk', standard: true },
  {
    navn: 'dato',
    noegle: 'katalog_sortering_dato',
    savn: 'savn_dato',
    tal: (r) => (typeof r.foerste_udgivelse === 'number' ? r.foerste_udgivelse : null),
    faldende: true,
  },
  {
    navn: 'pris',
    noegle: 'katalog_sortering_pris',
    savn: 'savn_pris',
    note: 'sortering_pris_note',
    tal: (r) => { const f = laesFelt(r, 'pris'); return f.slags === 'tal' ? f.tal : null; },
    gruppe: (r) => (r.felter?.pris?.enhed ?? ''),
  },
  {
    navn: 'nyttelast',
    noegle: 'katalog_sortering_nyttelast',
    savn: 'savn_nyttelast',
    tal: (r) => { const f = laesFelt(r, 'nyttelast_gaaende'); return f.slags === 'tal' ? f.tal : null; },
    faldende: true,
  },
  {
    navn: 'hastighed',
    noegle: 'katalog_sortering_hastighed',
    savn: 'savn_hastighed',
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
   5. DEN GENEREREDE FILTER-CSS
   ========================================================================== */

/** Kaldes af bygget og lægges i sidens inline <style>. */
export function hovedStil(ctx) {
  const { robotter, hjaelp, i18n } = ctx;
  const F = facetter(robotter, hjaelp, i18n);
  const K = kapabiliteter(robotter);
  const linjer = [];

  /* 5a. Listefacetterne: skjul-alle + vis-de-valgte. */
  for (const f of F) {
    linjer.push(`.styr:has(.f-${f.navn}:checked) .lag-${f.navn},`);
    linjer.push(`.styr:has(.f-${f.navn}:target) .lag-${f.navn}{display:none}`);
    for (const v of f.liste) {
      const id = `f-${f.navn}-${nogle(v)}`;
      linjer.push(`.styr:has(#${id}:checked) .lag-${f.navn}[data-${f.navn}~="${v}"],`);
      linjer.push(`.styr:has(#${id}:target) .lag-${f.navn}[data-${f.navn}~="${v}"]{display:contents}`);
    }
  }

  /* 5b. Egenskabschippene: ren HIDE, saa flere chips lagrer sig som OG.
     Se filhovedets note - det er den eneste facetgruppe, der virker saadan,
     fordi en capability er en uafhaengig betingelse og ikke en vaerdiliste. */
  const chipRegler = [];
  for (const k of K) {
    const id = `f-eg-${k.navn}`;
    chipRegler.push(`.styr:has(#${id}:checked) .lag-eg:not([data-eg~="${k.navn}"]),`);
    chipRegler.push(`.styr:has(#${id}:target) .lag-eg:not([data-eg~="${k.navn}"]){display:none}`);
  }

  /* 5c. Strimlens chips. Hver mulig markering har sin egen <li>, som staar
     skjult og taendes af sin egen regel. Det er den samme byggetidsviden, der
     baerer filtrene: vi ved, hvilke vaerdier der findes, saa "hvad er valgt"
     kan tegnes uden at kunne taelle. */
  const valgRegler = [];
  for (const f of F) {
    if (f.standard) continue; // status haandteres som UDELUKKELSE nedenfor
    for (const v of f.liste) {
      const id = `f-${f.navn}-${nogle(v)}`;
      valgRegler.push(`.styr:has(#${id}:checked) [data-valg="${id}"],`);
      valgRegler.push(`.styr:has(#${id}:target) [data-valg="${id}"]{display:inline-flex}`);
    }
  }
  for (const k of K) {
    const id = `f-eg-${k.navn}`;
    valgRegler.push(`.styr:has(#${id}:checked) [data-valg="${id}"],`);
    valgRegler.push(`.styr:has(#${id}:target) [data-valg="${id}"]{display:inline-flex}`);
  }
  /* Status vender modsat: chippen fortaeller, hvad der er SKJULT. I hvile er
     "Udgaaede skjult (3)" derfor den ene chip, der staar - praecis som compen. */
  const status = F.find((f) => f.navn === 'status');
  for (const v of status.liste) {
    const id = `f-status-${nogle(v)}`;
    valgRegler.push(`.styr:not(:has(#${id}:checked)) [data-valg="skjult-${nogle(v)}"]{display:inline-flex}`);
  }

  /* 5d. Sorteringen. To ting pr. sortering: kortenes orden og det aerlige
     savn-maerke paa dem, der ikke oplyser feltet. Alfabetisk har ingen regel -
     den er DOM-ordenen. */
  const sortering = [];
  for (const s of SORTERINGER) {
    if (s.standard) continue;
    sortering.push(`.styr:has(#sort-${s.navn}:checked) .kort{order:var(--o-${s.navn})}`);
    sortering.push(`.styr:has(#sort-${s.navn}:checked) .kort__savn--${s.navn}{display:block}`);
    if (s.note) sortering.push(`.styr:has(#sort-${s.navn}:checked) [data-note="${s.navn}"]{display:block}`);
  }

  /* 5e. Omfangsmaerkerne. De taendes, naar der FAKTISK er filtreret - og kun
     uden JavaScript (`:not([data-levende])`), fordi JavaScript regner tallene
     om og goer forbeholdet usandt. Se render()s note om maerkerne.

     Status kraever sin egen betingelse: dens felter er krydset af i hvile, saa
     "er der filtreret" betyder her "afviger fra standarden". */
  const filtreret = [];
  for (const f of F) {
    if (f.standard) continue;
    filtreret.push(`.styr:not([data-levende]):has(.f-${f.navn}:checked)`);
    filtreret.push(`.styr:not([data-levende]):has(.f-${f.navn}:target)`);
  }
  filtreret.push('.styr:not([data-levende]):has(.f-eg:checked)');
  filtreret.push('.styr:not([data-levende]):has(.f-eg:target)');
  for (const v of status.liste) {
    const id = `f-status-${nogle(v)}`;
    filtreret.push(status.standard.has(v)
      // en standard-afkrydset vaerdi, der er slaaet FRA, er en filtrering
      ? `.styr:not([data-levende]):not(:has(#${id}:checked))`
      // en ikke-standard vaerdi, der er slaaet TIL, er ogsaa en filtrering
      : `.styr:not([data-levende]):has(#${id}:checked)`);
  }
  const omfang = `${filtreret.map((s) => `${s} [data-omfang]`).join(',\n')}{display:inline}\n`
    + `${filtreret.map((s) => `${s} [data-omfang-note]`).join(',\n')}{display:block}`;

  return `/* Filtrene. Genereret af tools/skabelon/katalog.mjs - én regel pr. vaerdi. */
@supports selector(:has(*)){
${linjer.join('\n')}

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
   6. SIDEN
   ========================================================================== */

export function render(ctx) {
  const { robotter, i18n, sprog, hjaelp } = ctx;
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
     JavaScript ikke koerer (reglerne genereres i hovedStil §5e).

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
     Hvor mange kort staar der, FOER laeseren roerer noget? Status-facetten er
     krydset af paa i produktion + annonceret, saa svaret er ikke 77. Det
     regnes her i stedet for at blive skrevet i haanden - tallet aendrer sig,
     saa snart en robot skifter status. */
  const iStandard = robotter.filter((r) => status.standard.has(r.status)).length;

  /* --- TYPESKILTETS STEMPLER ----------------------------------------------
     Fire stansede felter. Alle FIRE er udledt af data - ingen af dem er
     skrevet i haanden, og ingen af dem er en dato fra byggeuret (som ville
     goere to byg af samme data forskellige).

     "Udgave" er den seneste hentedato i hele kataloget: den siger, hvor frisk
     materialet er, og den er den eneste dato paa siden, der ikke tilhoerer en
     enkelt robot. */
  const datoer = [];
  for (const r of robotter) {
    if (r.billede?.hentet) datoer.push(r.billede.hentet);
    if (r.anvendelse?.hentet) datoer.push(r.anvendelse.hentet);
    for (const p of Object.values(r.felter ?? {})) {
      if (p && typeof p === 'object' && typeof p.hentet === 'string') datoer.push(p.hentet);
    }
  }
  const udgave = datoer.length ? datoer.sort()[datoer.length - 1] : '';
  const oplysteFelter = robotter.reduce((sum, r) => sum
    + Object.keys(r.felter ?? {}).filter((n) => erOplyst(r, n)).length, 0);
  const lande = new Set(robotter.map((r) => r.producentland)).size;

  const stempler = [
    [t('stempel_type'), `QUAD-${alle}`],
    [t('stempel_udgave'), udgave],
    [t('stempel_poster'), hjaelp.nformat(alle)],
    [t('stempel_felter'), hjaelp.nformat(oplysteFelter)],
  ];

  /* --- STRIMLENS CHIPS ----------------------------------------------------
     Én <li> pr. mulig markering, skjult i hvile, taendt af sin egen regel
     (hovedStil §5c). Krydset er en <label>, ikke en <button>: en label kan
     slaa afkrydsningsfeltet fra UDEN JavaScript, hvilket en knap ikke kan. */
  const kryds = `<svg class="valg__kryds" width="9" height="9" viewBox="0 0 9 9" aria-hidden="true">`
    + `<path d="M1.4 1.4 7.6 7.6M7.6 1.4 1.4 7.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;
  const valgChip = (id, tekst, ekstra = '') => `<li class="valg${ekstra}" data-valg="${attr(id)}">`
    + `<span class="valg__navn">${esc(tekst)}</span>`
    + `<label class="valg__fjern" for="${attr(id)}">${kryds}`
    + `<span class="kun-skaerm">${esc(tf('valg_fjern', { navn: tekst }))}</span></label></li>`;

  const valgListe = [];
  for (const f of F) {
    if (f.standard) continue;
    for (const v of f.liste) valgListe.push(valgChip(`f-${f.navn}-${nogle(v)}`, f.tekst(v)));
  }
  for (const k of K) valgListe.push(valgChip(`f-eg-${k.navn}`, t('eg_' + k.navn)));
  // Status vender modsat: chippen siger, hvad der er SKJULT.
  for (const v of status.liste) {
    const n = status.antal.get(v) ?? 0;
    valgListe.push(`<li class="valg valg--standard" data-valg="skjult-${attr(nogle(v))}">`
      + `<span class="valg__navn">${esc(tf('valg_skjult', { navn: status.tekst(v), n }))}</span>`
      + `<label class="valg__fjern" for="f-status-${attr(nogle(v))}">${kryds}`
      + `<span class="kun-skaerm">${esc(tf('valg_vis', { navn: status.tekst(v) }))}</span></label></li>`);
  }

  /* --- FACETGRUPPERNE ----------------------------------------------------- */
  const raekke = (f, v) => {
    const id = `f-${f.navn}-${nogle(v)}`;
    const valgt = f.standard?.has(v) ? ' checked' : '';
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

  const facetBlok = (f, bredde, klasser = '') => `<fieldset class="facet facet--s${bredde}${klasser}">
<legend class="facet__navn">${esc(f.etiket)}${f.mrk ? `<span class="facet__tal">${esc(f.mrk)}</span>` : ''}</legend>
${f.liste.map((v) => raekke(f, v)).join('\n')}
</fieldset>`;

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

  const facetNet = `<div class="facetter__net">
${facetBlok(anv, 3)}
${facetBlok(vaegt, 4)}
<fieldset class="facet facet--s5 facet--raekkeslut">
<legend class="facet__navn">${esc(t('filter_egenskaber'))}<span class="facet__tal">${esc(t('filter_egenskaber_mrk'))}</span></legend>
${chipsHtml}
<p class="fod">${esc(tf('eg_fod', { n: alle, m: frost.nej, k: frostNul }))}</p>
</fieldset>
${facetBlok(ip, 3, ' facet--sidste-raekke')}
${facetBlok(status, 3, ' facet--sidste-raekke')}
${facetBlok(land, 3, ' facet--sidste-raekke')}
<fieldset class="facet facet--s3 facet--raekkeslut facet--sidste-raekke">
<legend class="facet__navn">${esc(t('filter_certificering'))}<span class="facet__tal">${esc(t('filter_certificering_mrk'))}</span></legend>
<div class="reserveret">
<p class="reserveret__ord">${esc(t('filter_certificering_ord'))}</p>
<p class="reserveret__note">${esc(tf('filter_certificering_note', { n: robotter.filter((r) => hjaelp.ceTilstand(r) === 'ja').length, m: alle }))}</p>
</div>
</fieldset>
</div>`;

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
  const kortHTML = (r, { variant = '', savn = '' } = {}) => {
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
      + `${stempel}${hjaelp.billede(r, '../../', { eager })}`
      + `<div class="kort__tekst">`
      + `<p class="kort__prod">${esc(r.producent)}</p>`
      + `<h3 class="kort__navn"><a href="${attr(r.slug)}/">${esc(r.navn)}</a></h3>`
      + `${savn}</div></article>`;
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

    // Ét lag pr. listefacet, plus ÉT faelles lag til alle fem egenskabschips.
    const egVaerdier = K.filter((k) => kapabilitet(r, k) === 'ja').map((k) => k.navn).join(' ');
    const aabne = F.map((f, i) => {
      const vaerdier = f.vaerdier(r).join(' ');
      const ekstra = i === 0
        ? ` data-sog="${attr(sogetekst)}" style="${attr(ordner)}"`
        : '';
      return `<div class="lag lag-${attr(f.navn)}" data-${attr(f.navn)}="${attr(vaerdier)}"${ekstra}>`;
    }).join('') + `<div class="lag lag-eg" data-eg="${attr(egVaerdier)}">`;
    return `${aabne}\n${kortHTML(r, { savn })}\n${'</div>'.repeat(F.length + 1)}`;
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

  const aabning = senesteAar === null ? '' : `<section class="aabning" aria-labelledby="aabning-titel">
<div class="aabning__krop stans">
<div class="aabning__hoved">
<div class="aabning__ord">
<h1 class="aabning__titel" id="aabning-titel">${esc(T.katalog_titel)}</h1>
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
  const sorterNoter = SORTERINGER.filter((s) => s.note)
    .map((s) => `<p class="t-mikro sorter__note" data-note="${attr(s.navn)}">${esc(t(s.note))}</p>`).join('\n');

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
<h2 class="resultat__titel" id="resultat-titel">
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
