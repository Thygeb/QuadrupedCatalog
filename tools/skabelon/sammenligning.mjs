/**
 * tools/skabelon/sammenligning.mjs — /sammenligning/, felt-for-felt.
 *
 * NY SIDE (spor/lysbyg, kontrakt: prototype/retning-lys/sammenligning.html +
 * BEGRUNDELSE.md). Mockuppens form var en HAARDKODET trio (Spot/ANYmal X/
 * Go2); den rigtige side lader LAESEREN vaelge 2-3 af alle robotterne i
 * kataloget, klientside, uden en gensyntese af siden. Det kraever data,
 * bygget ikke havde foer: `skema.mjs`s `feltVisning()` — samme funktion,
 * `tools/build.mjs` bruger til robots.json's `alle_felter` — gengivet her
 * SPROGSPECIFIKT (labels, gruppenavne, operator-tekst) og indlejret direkte
 * i HVER sprogudgave af siden.
 *
 * HVORFOR INDLEJRET, IKKE `fetch('../../robots.json')`:
 * Siden maa kunne aabnes med `file://` (samme forudsaetning som resten af
 * sitet, se assets/katalog.js' egen kommentar "Ingen netvaerkskald").
 * Chromium naegter `fetch()` af en lokal fil paa tvaers af mapper under
 * `file://` (CORS), saa et kald til `../../robots.json` ville fejle netop
 * dér, hvor siden skal virke uden en server. Data ligger derfor i et
 * `<script type="application/json">` i selve dokumentet — ingen
 * netvaerksafhaengighed, samme robusthed som resten af generatoren.
 * `dist/robots.json` udvides STADIG (build.mjs, `alle_felter`), som
 * kontrakten bad om — det er blot ikke DENNE sides datakilde.
 *
 * TO LAG, VIRKER BEGGE UDEN JS:
 *   1. Tegnforklaringen + en flad robotliste med links (altid synlig,
 *      aldrig en tom side — kontraktens eget krav).
 *   2. Vaelgeren (afkrydsningsfelter, samme `.filtre`-sprog som katalogets
 *      facetter) + resultatbeholderen. Begge staar i markup'en, men selve
 *      TABELLEN kan kun bygges af JavaScript (en fuld combinationsmatrix i
 *      ren CSS for "vaelg 2-3 af 62" er ikke gennemfoerlig) — derfor er
 *      `.sammenligning-app` skjult, indtil `assets/sammenligning.js`
 *      fjerner `hidden`, praecis samme idiom som `.sog[hidden]` andre
 *      steder paa sitet.
 *
 * Kontrakten staar i side.mjs. Denne fil skriver kun indholdet af <main>.
 */

import { esc, laesBillede, billedAlternativer, imperialPost } from './side.mjs';
import { FELTER, FELTNAVNE, GRUPPER, NAEVNER, feltVisning } from '../skema.mjs';
import { taethed } from '../validate.mjs';

const attr = esc;

/** Kontaktens id. Den SAMME streng, robot.mjs bruger (ENHED_ID) og
 *  assets/enhed.js slaar op med getElementById — hukommelsen paa tvaers af
 *  sider er praecis den ene noegle. Aendres den ét sted, holder valget op med
 *  at foelge laeseren, og INTET bliver rødt: derfor laaser
 *  tests/dele/44-samlenhed.mjs de tre steder sammen. */
const ENHED_ID = 'enhedsskift';

/**
 * Standardtrioen (spor/sammenlign, punkt 1 — afloeser den haardkodede
 * Spot/ANYmal-X/Go2-liste, som mockuppen fastlagde): de tre robotter med
 * HOEJEST specifikationstaethed, hoejst én pr. producent, afgjort alfabetisk
 * paa slug ved lige taethed. UDLEDT af bygget, ikke en redaktionel liste -
 * ANYmal X (4 af 30 felter) mødte foerstegangsbesoegende med 26 stiplede
 * "ikke oplyst"-bokse, det stik modsatte af sitets 1.110 kildebelagte tal.
 *
 * Taetheden er den SAMME `taethed()`, validate.mjs og build.mjs allerede
 * bruger til sluttaellingen og robots.json's `taethed`-felt - ingen ny
 * maalestok. NAEVNER (FELTNAVNE.length, i dag 30) er importeret, ALDRIG
 * skrevet som et tal her (L30/D7).
 */
function standardvalg(robotter, d4) {
  const med = robotter.map((r) => ({ r, tal: taethed(r, NAEVNER, d4).udfyldt }));
  med.sort((a, b) => b.tal - a.tal || String(a.r.slug).localeCompare(String(b.r.slug)));
  const producenter = new Set();
  const valgt = [];
  for (const { r } of med) {
    if (producenter.has(r.producent)) continue;
    producenter.add(r.producent);
    valgt.push(r.slug);
    if (valgt.length === 3) break;
  }
  return valgt;
}

/** Operatorernes tekst, sprogspecifik — samme noegler som side.mjs' operator(). */
const OPNAVN = {
  '>': 'mereend', '>=': 'mindst', '<': 'mindreend', '<=': 'hoejst', '~': 'cirka', '±': 'pm',
};

/**
 * Robotfotoet, som kolonnehovedet skal kunne tegne KLIENTSIDE.
 *
 * HVORFOR DET NU LIGGER I JSON'EN, NAAR DET FOER VAR EN DOKUMENTERET
 * UDELADELSE (fund/FUND-lysbyg.md): compen saetter fotoet i selve
 * kolonnehovedet, fordi hovedet OGSAA er betjeningen - man skal kunne se
 * HVILKEN maskine en spalte er, mens man ruller. Det argument fandtes ikke,
 * da hovedet kun var tekst.
 *
 * PRISEN ER MAALT, IKKE GAETTET: hele posten er stier og én alt-tekst, ingen
 * markup. 77 poster koster 8,6 KB i den byggede side (maalt) - mod de
 * ~120 KB, indlejret <picture>-markup for alle 77 ville have kostet.
 * Stierne er FULDE (op + 'billeder/'), saa klienten ikke skal kende sin egen
 * dybde i mappetraeet - samme grund som url-opslagene i build.mjs' grund().
 *
 * `alt` kommer fra hjaelp.billedTekst()s egen alt-vej, saa fotoet i matricen
 * beskrives med NOEJAGTIGT samme saetning som paa robotsiden og i kataloget -
 * ikke en tredje formulering, ingen ny i18n-noegle.
 *
 * Null betyder "ingen brugbar optagelse" - en aerlig tilstand, ikke en fejl.
 * Maalt: 76 af 77 robotter har et foto, saa tilfaeldet er sjaeldent, men det
 * findes, og klienten tegner da den stiplede ikke-oplyst-plade i stedet for
 * en tom kasse, der ville se ud som en indlaesningsfejl.
 */
function fotoPost(robot, ctx) {
  const b = laesBillede(robot);
  if (!b) return null;
  const sti = (f) => `${ctx.url.op}billeder/${f}`;
  return {
    src: sti(b.fil),
    kilder: billedAlternativer(b.fil).map(([f, type]) => [sti(f), type]),
    alt: ctx.hjaelp.billedTekst(robot, b).alt,
    ophav: b.ophav || null,
    hentet: b.hentet || null,
  };
}

/* ==================================================== enhederne (L60 → K9)
 *
 * DEN AFGOERENDE ARKITEKTURBESLUTNING PAA DENNE SIDE, og den er en ANDEN end
 * den, spor/enhed foreslog. Den foreslog en OMREGNINGSTABEL i browseren,
 * bundet til side.mjs' `OMREGNING` med en test, fordi den maalte prisen ved
 * at sende tallene med til +29,9 KB. Jeg maalte den om, 1. sep 2026, og fik
 * et andet tal — se de tre veje, alle maalt paa den byggede da-side (381,0 KB):
 *
 *   fuld post pr. felt  +50,6 KB   (den form, +29,9 KB tilsyneladende gjaldt)
 *   TABEL i browseren   + 1,3 KB
 *   KUN FIGUREN pr. felt + 9,9 KB  ← valgt
 *
 * Den tredje vej var ikke maalt foer. Den koster 9,9 KB (2,6 % af siden) og
 * betaler for noget, en tabel ikke kan: **browseren regner ikke.** Der er
 * ingen kopi af `OMREGNING`, ingen kopi af `imperialTal()`s afrundingsregel
 * (0 decimaler fra 100, 1 fra 10, ellers 2), og ingen kopi af regel 1.
 * `imperialPost()` — SAMME funktion, robotsiden bruger — er ene om at
 * bestemme, hvad der staar. To kopier kan ikke divergere, naar den ene ikke
 * findes; en test, der holder to tabeller op mod hinanden, er en svagere
 * garanti end slet ikke at have den anden tabel.
 *
 * DE TRE REGLER, arvet uroert fordi de haandhaeves af `imperialPost()` selv:
 *   1. `vaerdi_imperial` (30 felter, 7 robotter) vinder over vores omregning.
 *      `egen: 1` foeres med, saa klienten kan lade vaere med at saette
 *      "omregnet"-maerket paa producentens eget tal.
 *   2. Vores omregning maerkes synligt (assets/sammenligning.js' renderTal).
 *   3. Kildemaerket foelger det metriske tal. Matricen har slet ingen
 *      kildemaerker — men `kildeform`-wrapperen ("Producenten skrev: 1100 mm")
 *      er af samme slags og saettes KUN paa den metriske tvilling, praecis som
 *      side.mjs:1151 goer det med `!__imperial`.
 *
 * FAELDEN, DER KOSTEDE MEST AT FINDE: 565 felter er omregnelige, ikke 557.
 * De otte, tallet manglede, er alle `temp_min: 0 °C` — og 0 °C er 32 °F, ikke
 * 0 °F. En udgave, der kun daekkede `tilstand: 'tal'`, ville vise "0 °F" for
 * otte robotter: et forkert tal, som oveni ville laese som nul-TILSTANDEN
 * (haard begraensning 5). Derfor baerer `imp` sin egen nul-afgoerelse:
 * `v-nul` hoerer til det METRISKE 0, aldrig til de 32 °F.
 */
function imperialFelt(post) {
  const imp = imperialPost(post, 'da'); // sproget bruges kun til kildeform, som ikke sendes med
  if (!imp) return null;
  const p = imp.post;
  const ud = p.min !== undefined
    ? { min: p.min, maks: p.maks }
    : { vaerdi: p.vaerdi };
  ud.enhed = p.enhed || '';
  // `egen` staar KUN naar den er sand: 30 af 565. En `0` paa de 535 oevrige
  // ville koste mere end de 30 `1` sparer.
  if (imp.egen) ud.egen = 1;
  return ud;
}

/** Den inline JSON-blok, klienten laeser. Ét objekt pr. robot: identitet +
 *  alle 30 felters visningsform (skema.mjs' feltVisning — sprogneutral) +
 *  en lille sprogspecifik ordbog, assets/sammenligning.js bruger til at
 *  tegne cellerne (label pr. felt/gruppe, operator-tekst, tilstandstekst). */
function dataBlok(ctx) {
  const { robotter, i18n, d4 } = ctx;
  const { T, t } = i18n;

  const robotterUd = robotter.map((r) => {
    // Kildeformen (spor/enheder, K9): `feltVisning()` bygger sit udtryk af
    // NAVNGIVNE noegler og daekker derfor aldrig `_kildeform` - samme grund
    // til, at den ikke er en del af POST_NOEGLER (skema.mjs). Den laeses her
    // direkte fra raadataen, r.felter[n], ved siden af feltVisning()-kaldet,
    // og sendes med som `kildeform` (uden understreg - klientens JSON-noegle,
    // ikke skema.mjs' interne felt) SAA sammenligning.js kan tegne samme
    // title, robot.mjs allerede viser ("Producenten skrev: …") - genbrugt
    // moenster, ikke et nyt. Findes ingen omregning, er `_kildeform`
    // undefined, og feltet er urort (samme som paa robotsiden).
    const felter = Object.fromEntries(FELTNAVNE.map((n) => {
      const vis = feltVisning(n, r.felter[n]);
      const kildeform = r.felter[n]?._kildeform;
      const ud = kildeform ? { ...vis, kildeform } : vis;
      const imp = imperialFelt(r.felter[n]);
      return [n, imp ? { ...ud, imp } : ud];
    }));
    // "N af 30 felter" (skilt__nr i mockuppen): samme maalestok som
    // resten af sitets taethedstal - "oplyst" er alt, der ikke er hullet
    // ("ikke_oplyst"), praecis de andre taetheds-visninger (skema_taeller,
    // stribe-taeller) allerede taeller efter.
    const taethedAntal = FELTNAVNE.filter((n) => felter[n].tilstand !== 'ikke_oplyst').length;
    return {
      slug: r.slug, navn: r.navn, producent: r.producent,
      producentland: r.producentland, status: r.status, taethedAntal, felter,
      foto: fotoPost(r, ctx),
    };
  });

  const grupper = GRUPPER.map((g) => ({
    id: g,
    titel: T['gruppe_' + g],
    felter: FELTNAVNE.filter((n) => FELTER[n].gruppe === g),
  })).filter((g) => g.felter.length);

  const feltNavne = Object.fromEntries(FELTNAVNE.map((n) => [n, T['felt_' + n]]));

  // {vis, laest}: samme to-delt operatorsprog som side.mjs' operator() -
  // et aria-hidden forkortet tegn OG en fuld laesetekst til skaermlaesere
  // (regel 4: operatoren skal kunne SES og HOERES).
  const operatorer = Object.fromEntries(
    Object.entries(OPNAVN).map(([kode, navn]) => [kode, {
      vis: T['operator_' + navn], laest: T['operator_' + navn + '_laest'],
    }]),
  );

  return {
    standard: standardvalg(robotter, d4),
    maksAntal: 3,
    robotter: robotterUd,
    grupper,
    feltNavne,
    operatorer,
    tekst: {
      ikke_oplyst: T.tilstand_ikke_oplyst,
      nej: T.tilstand_nej,
      ja: T.ja,
      kun_billede: T.tilstand_kun_billede,
      ved_last: T.ved_last,
      ved_last_ukendt: T.ved_last_ukendt,
      advarsel: T.advarsel,
      maks: t('sammenligning_maks'),
      for_faa: t('sammenligning_for_faa'),
      // Aa54: tabellens <caption>. Raat moenster med "{robotter}" - klienten
      // erstatter selv (sammenligning.js' tabelHTML()), praecis som
      // kilde_original_form's "{figur}" lige nedenfor. `t()` og ikke `T.`,
      // saa en manglende noegle bliver RAPPORTERET af build.mjs i stedet for
      // at blive til en tom caption, ingen opdager.
      tabel_caption: t('sammenligning_tabel_caption'),
      taethed_skabelon: T.skema_taeller,
      /* --- spor/samlbyg: jigraekken og svarmaerket ------------------------
         ALLE syv strenge herunder er EKSISTERENDE noegler, genbrugt. Sporet
         maatte ikke roere data/i18n/*.json (spor/topbar ejer dem), saa hvor
         compen havde en ny formulering, er den naermeste eksisterende noegle
         valgt frem for at opfinde en streng. De steder, hvor ingen noegle
         passede, er feltet UDELADT og fOErt som eftersleb i sporets rapport -
         aldrig fyldt med en dansk streng skrevet i skabelonen, som saa ville
         staa uoversat paa den engelske side.
         `vaelg_titel` (kolonnehovedets "Skift plade"-link) er FJERNET her
         (spor/saml2, JPK 1. sep 2026): kolonnens eget "Vælg robotter"-link
         er vaek sammen med hele vaelgeren - der er nu ÉN knap for hele
         siden (den SSR'ede .afslutning-knap i render(), aldrig JSON-baaret),
         saa klienten har ikke laengere brug for teksten via DATA.tekst. */
      // Svarmaerkets skaermlaesertekst, fx "2 af 3 oplyst". `noegletal_taeller`
      // og ikke `skema_taeller`: sidstnaevnte siger "... felter oplyst", og her
      // taelles PLADER, ikke felter. Den generiske form passer praecis.
      svar_taeller: T.noegletal_taeller,
      // Hjoernecellen over feltnavnene.
      alle_felter: T.alle_felter,
      felter_naevner: t('taethed_naevner'),
      // Fotokreditten under matricen.
      foto_ophav: T.billede_uden_tilladelse,
      hentet: T.hentet,
      billede_intet: T.billede_intet,
      // Raa moenster med "{figur}" - klienten selv erstatter (sammenligning.js'
      // renderTal()), samme funktion som robot.mjs' flet() udfoerer server-side.
      kilde_original_form: T.kilde_original_form,
      /* --- enhedsomskifteren (spor/samlenhed) ----------------------------
         Fem EKSISTERENDE noegler, alle skrevet af L60 til robotsiden og
         genbrugt ordret. Ingen ny i18n-noegle: spor/filter ejer begge
         sprogfiler i dag, og en streng skrevet i skabelonen ville staa
         dansk paa den engelske side. `enhed_omregnet_forklaring` og
         `kilde_original_form` er raa moenstre med "{figur}", som klienten
         selv udfylder — samme deling som resten af blokken her. */
      enhed_skift_etiket: T.enhed_skift_etiket,
      enhed_skift_forklaring: T.enhed_skift_forklaring,
      enhed_omregnet: T.enhed_omregnet,
      enhed_omregnet_forklaring: T.enhed_omregnet_forklaring,
      imperial_forklaring: t('imperial_forklaring'),
      vaegtklasse: {
        under_20: T.vaegtklasse_under_20,
        '20_40': T.vaegtklasse_20_40,
        over_40: T.vaegtklasse_over_40,
        ikke_oplyst: T.vaegtklasse_ikke_oplyst,
      },
    },
  };
}

/**
 * Laesenoeglen som ÉT ALTID-SYNLIGT BAAND (spor/samlbyg, kontrakt:
 * retninger/nyverden/sammenligning.html, godkendt af JPK 31. aug 2026).
 *
 * INGEN <details>, INGEN fold. JPK var udtrykkelig: noeglen til at laese
 * tallene maa ikke ligge bag et klik paa den side, hvis hele opgave er at
 * laese tal. Her stod foer en `.tegnforklaring`-dl med fem raekker under
 * hinanden; den kostede en halv skaerm og skubbede matricen ned.
 *
 * SAETNINGEN LOEBER VANDRET GENNEM BAANDET. De fire i18n-forklaringer deler
 * ordret forstavelsen "Producenten oplyser", som nu staar én gang som lead;
 * hvert maerke baerer kun sin egen fortsaettelse. Forstavelsen er UDLEDT af
 * faellesForstavelse() - se dens egen kommentar for hvorfor.
 *
 * VAERNET: giver udledningen mindre end to ord, er der ingen faelles
 * forstavelse at loefte ud, og baandet falder tilbage til de FULDE
 * saetninger uden lead. Et halvt ord som lead ville vaere vaerre end intet.
 *
 * Vinderreglen staar IKKE her (den var foer femte raekke). Den er en
 * redaktionel position, ikke et tegn man slaar op - den hoerer ved matricens
 * fod, se matrixFodHTML().
 *
 * Kildemaerker er stadig ude (L46, bekraeftet af JPK 27. aug 2026): en
 * forklaring paa et maerke, der aldrig staar paa fladen, er uden genstand.
 */
function legendeHTML(t, T) {
  const fulde = [
    T.tegnforklaring_oplyst,
    T.tilstand_nul_forklaring,
    T.tilstand_nej_forklaring,
    T.tilstand_ikke_oplyst_forklaring,
  ];
  const lead = faellesForstavelse(fulde);
  const brugLead = lead.trim().split(/\s+/).filter(Boolean).length >= 2;
  const rest = (s) => (brugLead
    ? String(s).slice(lead.length).replace(/^[,\s]+/, '').replace(/\s*\.\s*$/, '')
    : String(s));
  const tegn = (mrk, s) => `<span class="saml-tegn"><span class="saml-tegn__mrk">${mrk}</span>`
    + `<span class="saml-tegn__tekst">${esc(rest(s))}</span></span>`;

  return `<section class="saml-noegle" aria-labelledby="h-tegn">
<div class="saml-noegle__raekke">
<p class="saml-noegle__lead">
<span class="saml-noegle__navn" id="h-tegn">${esc(t('tegnforklaring_titel'))}</span>
${brugLead ? `<span class="saml-noegle__stam">${esc(lead.trim())} …</span>` : ''}
</p>
${tegn('<span class="v v-tal"><b class="num">33,8</b><span class="enhed">kg</span></span>', T.tegnforklaring_oplyst)}
${tegn('<span class="v v-tal v-nul"><b class="num">0</b></span>', T.tilstand_nul_forklaring)}
${tegn(`<span class="v v-nej"><i class="mrk"></i>${esc(T.tilstand_nej)}</span>`, T.tilstand_nej_forklaring)}
${tegn(`<span class="v v-ikke"><i class="mrk"></i>${esc(T.tilstand_ikke_oplyst)}</span>`, T.tilstand_ikke_oplyst_forklaring)}
</div>
</section>`;
}

/**
 * Den laengste faelles forstavelse, tegn for tegn. Loefter "Producenten
 * oplyser" ("The manufacturer states " paa engelsk) ud af de fire
 * tilstandsforklaringer, saa den kan staa ÉN gang som baandets lead i
 * stedet for fire gange i fire saetninger. UDLEDT, ikke skrevet: ingen ny
 * i18n-noegle, og en oversaettelse med en anden formulering faar
 * automatisk sit eget lead.
 */
function faellesForstavelse(strenge) {
  if (!strenge.length) return '';
  const f = String(strenge[0]);
  let i = 0;
  while (i < f.length && strenge.every((s) => String(s)[i] === f[i])) i++;
  return f.slice(0, i);
}

/**
 * Stempelblokken - kun UDGAVE.
 *
 * Fjernede FOER 27. sep 2026 (spor/tal, punkt 2): Type, Poster og Felter var
 * genbrugt fra katalogsidens typeskilt (tools/skabelon/katalog.mjs'
 * `stempler`) under de SAMME i18n-noegler - men "Felter" betød her
 * NAEVNER (30, skemaets feltantal), mens den samme noegle `stempel_felter`
 * andre steder paa sitet (katalogsiden, foer spor/katalog2; om-os' regnskab)
 * betyder ANTAL OPLYSTE FELTVAERDIER (et tal i tusind-omraadet). Samme ord,
 * to stoerrelsesordener - en fejlmaerkning, ikke en uenighed (maalt
 * 1. sep 2026, spor/tal). Type og Poster (robotter.length) var ikke i sig
 * selv forkerte, men stod i samme <dl> som Felter og var lige saa lette at
 * laese forkert paa tvaers af siderne.
 *
 * Tilbage staar kun Udgave - den seneste hentedato i hele kataloget, et
 * MAALT tal udledt af data, ikke en byggedato. Den bruger ingen delt
 * i18n-noegle, der ogsaa betyder noget andet et andet sted, og kan derfor
 * ikke fejlmaerkes paa samme maade.
 */
function stempelblokHTML(ctx) {
  const { robotter, i18n } = ctx;
  const { t } = i18n;
  const datoer = [];
  for (const r of robotter) {
    if (r.billede?.hentet) datoer.push(r.billede.hentet);
    if (r.anvendelse?.hentet) datoer.push(r.anvendelse.hentet);
    for (const p of Object.values(r.felter ?? {})) {
      if (p && typeof p === 'object' && typeof p.hentet === 'string') datoer.push(p.hentet);
    }
  }
  const udgave = datoer.length ? datoer.sort()[datoer.length - 1] : '';
  const stempler = [
    [t('stempel_udgave'), udgave],
  ];
  return `<dl class="stempler">
${stempler.map(([n, v]) => `<div class="stempel"><dt>${esc(n)}</dt><dd>${esc(v)}</dd></div>`).join('\n')}
</dl>`;
}

/**
 * Matricens fod: vinderreglen. Den er en TRUFFET BESLUTNING (haard
 * begraensning 6 - ingen redaktionel score uden offentliggjort metode), ikke
 * en note der kan spares vaek, saa den staar med sit eget navn og sin egen
 * ramme - men NEDE ved matricen, hvor en laeser leder efter den vindercelle,
 * der ikke findes. Foer stod den som femte raekke i tegnforklaringen, hvor
 * den blev laest som endnu et tegn blandt tegnene.
 *
 * Fotokreditten staar IKKE her: hvilke fotos der vises, afhaenger af hvilke
 * robotter laeseren har valgt, saa den linje tegnes klientside sammen med
 * tabellen (assets/sammenligning.js' fotoophavHTML()).
 */
function matrixFodHTML(t) {
  return `<div class="saml-fod">
<p class="saml-vinderregel">
<span class="saml-vinderregel__navn">${esc(t('sammenligning_legende_vinder_titel'))}</span>
${esc(t('sammenligning_legende_vinder_forklaring'))}</p>
</div>`;
}

/**
 * Kontakten + hukommelsen. Tre ting, og hver af dem er et valg:
 *
 * 1. EN RIGTIG AFKRYDSNING, foerste barn af `.sammenligning-app`. Alt andet i
 *    app'en er SOESKENDE efter den, saa `:checked ~ * .enhedsvis--imperial`
 *    naar hver eneste celle i matricen — samme rene CSS-skifte som paa
 *    robotsiden, og matricen behoever derfor IKKE tegnes om, naar laeseren
 *    skifter enhed. Selve etiketten tegnes af klienten oven over tabellen
 *    (assets/sammenligning.js), fordi den skal kunne UDEBLIVE; se vaernet dér.
 *
 * 2. `id="enhedsskift"` — den samme streng som robot.mjs' ENHED_ID, fordi
 *    assets/enhed.js slaar netop den op. Det er hele delingen af valget:
 *    vaelger man imperial paa /da/robotter/boston-dynamics-spot/, staar
 *    kontakten her allerede paa imperial.
 *
 * 3. `enhed.js` SYNKRONT, umiddelbart efter kontakten — ikke `defer`. Skallen
 *    har kun én `script`-plads, og den er optaget af sammenligning.js (som
 *    ER deferred). Rækkefoelgen er dermed: enhed.js saetter afkrydsningen →
 *    sammenligning.js tegner matricen. Havde enhed.js vaeret deferred, kunne
 *    matricen naa at blive tegnet metrisk foerst og blinke.
 *
 * UDEN JS staar her en afkrydsning inde i en `hidden` beholder: usynlig,
 * ikke i tabuleringsraekkefoelgen, og uden en matrix at skifte paa. Det er
 * ikke en dOEd kontakt — det er ingen kontakt, hvilket er det rigtige, naar
 * der ingen matrix er (P0: siden er stadig sand, bare ikke praecis).
 */
function enhedskontakt(ctx) {
  const op = ctx?.url?.op;
  const boks = `<input type="checkbox" id="${ENHED_ID}" class="kunskaerm enhedsskift__boks">`;
  // Uden en kendt dybde skrives ingen <script>: en forkert sti ville give en
  // 404 ved hvert sidevisning. Kontakten bliver staaende og virker — den
  // husker bare ikke, praecis som robot.mjs' enhedsHukommelse() haandterer det.
  if (typeof op !== 'string') return boks;
  return `${boks}\n<script src="${esc(op)}enhed.js"></script>`;
}

/** Uden JS: en flad, alfabetisk liste med links - aldrig en tom side. */
function fallbackHTML(robotter, ctx) {
  const { url } = ctx;
  const sorteret = [...robotter].sort((a, b) => String(a.navn).localeCompare(String(b.navn), ctx.sprog));
  const raekker = sorteret.map((r) => `<div class="raekke">
<dt><a href="${attr(url.robot(r.slug))}">${esc(r.navn)}</a></dt>
<dd><span class="v v-tekst">${esc(r.producent)}</span></dd>
</div>`).join('\n');
  return `<dl class="raekker" data-sammenligning-fallback>
${raekker}
</dl>`;
}

export function render(ctx) {
  const { robotter, i18n, url } = ctx;
  const { T, t } = i18n;

  const data = dataBlok(ctx);
  const dataJSON = JSON.stringify(data)
    .replace(/</g, '\\u003c').replace(/-->/g, '--\\u003e'); // saa </script> i data aldrig kan lukke blokken

  /* SPOR/SAML2 (JPK 1. sep 2026, punkt 1+2): vaelgeren er FJERNET fra denne
     side. Rationalet er JPK's eget: kataloget bliver det ENE sted, man
     vaelger robotter (afkrydsning der, eller den klaebende bundbjaelke et
     samtidigt spor bygger); denne side bliver ren visning. Udvalget deles
     stadig via localStorage (SAML_NOEGLE, assets/sammenligning.js), kun
     SKRIVES det ikke laengere fra denne side.

     Tilbage staar ÉN knap, "Vaelg robotter" (samme tekst, samme i18n-noegle,
     som foer sad paa den skjulte h2 og paa kolonnehovedets "Skift plade"-
     link) - en RIGTIG <a href> til kataloget, altid til stede, ALDRIG kun
     skabt af JS (P0: uden JavaScript er siden sand, med JavaScript bliver
     den praecis - et link, der kun virker med JS, bryder netop den regel).
     assets/sammenligning.js laegger klik-adfaerden ovenpaa: kommer laeseren
     fra kataloget (document.referrer), goer knappen `history.back()` i
     stedet, saa katalogets afkrydsede filtre genskabes af browseren selv
     (bfcache) - ingen tilstand at gemme, ingen ny mekanisme.

     KNAPPENS FORM er `.videre.videre--stille` - IKKE en ny klasse, samme
     tilbageholdne knap robot.mjs' "Om metoden"/produktside-link bruger,
     valgt netop fordi siden IKKE er en salgskanal (haard begraensning 1).
     Wrapperen `.afslutning-knap` (generator.css:345, margin-top:r5) er
     GENBRUGT fra forsidens afslutningsblok - den er en generisk
     margin-regel uden nogen kobling til forsiden specifikt, og den giver
     PRAECIS den luft over knappen, kataloget/generator.css allerede
     validerer andetsteds. INGEN ny CSS er tilfoejet for at opnaa dette
     (filejerskabet forbyder at roere system.css/generator.css); begge
     klasser eksisterede allerede og laante kun deres eksisterende regler.

     STRUKTUREN BAGVED (`<div class="sektion">`) ER BEVIDST BEVARET, kun
     klassen "sammenligning" er droppet fra den: `.sektion{padding-top:r8}`
     er den ENESTE regel, den gamle `<section class="sektion sammenligning">`
     traf (maalt: intet `.sammenligning`- eller `.sektion.sammenligning`-
     selektor findes i hverken system.css eller generator.css), saa
     fjernelsen af netop det ene klassenavn koster INGEN visuel aendring
     for resten af blokken - kun grep'et efter "sektion sammenligning" (som
     PUNKT 1's acceptkriterium laeser bogstaveligt) bliver 0. Sektionen er nu
     en <div>, ikke et <section>, fordi dens gamle <h2 aria-labelledby> (der
     gav den et tilgaengeligt navn) er vaek med vaelgeren - et unavngivet
     <section> er intet landmark for en skaermlaeser alligevel, saa <div>
     siger det samme uden at paastaa en semantik, der ikke er der.

     `.sammenligning-app` er STADIG hidden indtil JS. Laesenoeglen, knappen
     og fallback-listen staar uden for den og virker alle uden JS. */
  return `<div class="rum">
<p class="retur"><a href="${attr(url.katalog)}">${esc(T.til_katalog)}</a></p>

<div class="katalog-hoved saml-plade">
<div class="saml-plade__ord">
<h1 class="t-h1">${esc(T.sammenligning_titel)}</h1>
<p class="t-broed maal">${esc(T.sammenligning_lede)}</p>
</div>
${stempelblokHTML(ctx)}
</div>

${legendeHTML(t, T)}

<p class="afslutning-knap"><a class="videre videre--stille" href="${attr(url.katalog)}" data-saml-knap>${esc(T.sammenligning_vaelg_titel)}${ctx.hjaelp.ikon('i-pil')}</a></p>

<div class="sektion">
<div class="sammenligning-app" data-sammenligning hidden>
${enhedskontakt(ctx)}
<p class="t-lille sammenligning-status" data-saml-status role="status" aria-live="polite" hidden></p>
<div class="saml-rulle" data-saml-resultat></div>
${matrixFodHTML(t)}
</div>

<div data-sammenligning-fallback-wrap>
<noscript>
<p class="t-lille sammenligning-noscript">${esc(t('sammenligning_uden_js_noscript'))} <a href="${attr(url.katalog)}">${esc(t('sammenligning_uden_js_link'))}</a></p>
</noscript>
<p class="t-lille sektion-note">${esc(T.sammenligning_uden_js_forklaring)}</p>
${fallbackHTML(robotter, ctx)}
</div>
</div>
</div>
<script type="application/json" id="sammenligning-data">${dataJSON}</script>
`;
}
