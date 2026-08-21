/**
 * tools/skema.mjs — feltlisten, sprogneutralt. Nul afhaengigheder.
 *
 * Delt af validate.mjs og build.mjs. Ingen dansk eller engelsk tekst her:
 * etiketter staar i data/i18n/{da,en}.json, én fil pr. sprog (PLAN.md afsnit 7).
 * Faelder generatoren over en manglende etikette, er det med vilje — en manglende
 * oversaettelse skal fejle synligt, ikke lande som dansk paa /en/.
 */

import { kanoniskEnhed, ENHEDER } from './yaml.mjs';

/**
 * art:  tal | jaNej | tekst | liste | ip
 * type: dimensionen, som enheden skal tilhoere (kun for art: 'tal')
 * ogsaaType: en anden dimension, feltet ogsaa maa oplyses i, uden omregning
 * d4:   feltet er beroert af det aabne spoergsmaal D4 (type uden model)
 */
export const FELTER = {
  egenvaegt:               { gruppe: 'fysik',       art: 'tal',   type: 'masse' },
  laengde:                 { gruppe: 'fysik',       art: 'tal',   type: 'laengde' },
  bredde:                  { gruppe: 'fysik',       art: 'tal',   type: 'laengde' },
  hoejde:                  { gruppe: 'fysik',       art: 'tal',   type: 'laengde' },
  frihedsgrader:           { gruppe: 'fysik',       art: 'tal',   type: 'antal' },
  nyttelast_gaaende:       { gruppe: 'fysik',       art: 'tal',   type: 'masse' },
  nyttelast_staaende:      { gruppe: 'fysik',       art: 'tal',   type: 'masse' },
  hastighed:               { gruppe: 'fysik',       art: 'tal',   type: 'hastighed' },
  // To dimensioner med vilje: Rainbow oplyser 45 %, Boston Dynamics +/- 30°.
  // 45 % ER 24,2°, saa en stiltiende omregning ville flytte en robot fem pladser
  // i en rangering. Begge enheder accepteres, ingen af dem omregnes.
  haeldning:               { gruppe: 'fysik',       art: 'tal',   type: 'vinkel', ogsaaType: 'stigning' },
  forhindring_enkelt:      { gruppe: 'fysik',       art: 'tal',   type: 'laengde' },
  trappetrin_kontinuerlig: { gruppe: 'fysik',       art: 'tal',   type: 'laengde' },
  ip_klasse:               { gruppe: 'fysik',       art: 'ip' },
  temp_min:                { gruppe: 'fysik',       art: 'tal',   type: 'temperatur' },
  temp_maks:               { gruppe: 'fysik',       art: 'tal',   type: 'temperatur' },

  batteri_wh:              { gruppe: 'energi',      art: 'tal',   type: 'energi' },
  driftstid:               { gruppe: 'energi',      art: 'tal',   type: 'tid', kraeverVedLast: true },
  hot_swap:                { gruppe: 'energi',      art: 'jaNej' },
  ladetid:                 { gruppe: 'energi',      art: 'tal',   type: 'tid' },
  dockingstation:          { gruppe: 'energi',      art: 'jaNej' },

  lidar:                   { gruppe: 'sensorik',    art: 'tekst', d4: true },
  kameraer:                { gruppe: 'sensorik',    art: 'tekst', d4: true },
  compute:                 { gruppe: 'sensorik',    art: 'tekst' },
  ros2:                    { gruppe: 'sensorik',    art: 'jaNej' },
  sdk_sprog:               { gruppe: 'sensorik',    art: 'liste' },
  autonominiveau:          { gruppe: 'sensorik',    art: 'tekst' },

  monteringsinterface:     { gruppe: 'nyttelast',   art: 'tekst' },
  stroem_ud:               { gruppe: 'nyttelast',   art: 'tekst' },
  dataporte:               { gruppe: 'nyttelast',   art: 'liste' },

  pris:                    { gruppe: 'kommercielt', art: 'tal',   type: 'valuta' },
  eu_tilgaengelig:         { gruppe: 'eu',          art: 'jaNej' },
  ce_oplyst:               { gruppe: 'eu',          art: 'jaNej' },
  eu_service:              { gruppe: 'eu',          art: 'jaNej' },
  leveringstid:            { gruppe: 'eu',          art: 'tal',   type: 'tid' },
};

export const FELTNAVNE = Object.keys(FELTER);
export const GRUPPER = ['fysik', 'energi', 'sensorik', 'nyttelast', 'kommercielt', 'eu'];

/** Identitet. Skrives af os og taeller ikke i taetheden. */
export const IDENTITET_PAAKRAEVET = ['slug', 'navn', 'producent', 'producentland', 'status'];
export const IDENTITET_VALGFRI = [
  'foerste_udgivelse', 'forgaenger', 'noter', 'silhuet',
  // Producentens by. Sammen med producentland er den svaret paa "hvor staar de
  // henne" — ANYbotics ligger i Zuerich, og Schweiz er ikke EU.
  'producentby',
  // Varianterne ved navn. Naar den staar, er den listen over de kolonner, et felts
  // "varianter:"-blok maa bruge — se R15. Uden den kan en variant hedde noget
  // forskelligt paa to felter i samme fil, og de to kan ikke stilles op mod hinanden.
  'varianter',
  // Producentens egen anvendelsesinddeling. Se ANVENDELSE_VAERDIER nedenfor og R16.
  'anvendelse',
];
export const STATUS_VAERDIER = ['i_produktion', 'annonceret', 'udgaaet', 'demonstrator'];

/**
 * De fire tilstande, der aldrig maa kollapse (CLAUDE.md begraensning 5, regel 10).
 * `0` er den fjerde og er IKKE en streng — den er en almindelig post med vaerdi 0
 * og kilde. Netop derfor kan den ikke skrives som en sentinel.
 */
export const TILSTANDE = ['ikke_oplyst', 'nej', 'kun_billede'];

/**
 * Kanonisk tilstand, eller null hvis strengen ikke er en tilstand.
 * robotdata-skillen skriver "ikke oplyst" med mellemrum i sin prosa, mens skemaet
 * bruger understreg. Begge accepteres — ellers ville en hel dataindsamling blive
 * blokeret af en stavemaade — men validatoren advarer om mellemrumsformen, saa
 * de to ikke stille og roligt lever side om side.
 */
export function tilstandAf(v) {
  if (typeof v !== 'string') return null;
  const k = v.trim().replace(/\s+/g, '_');
  return TILSTANDE.includes(k) ? k : null;
}

/* ======================================================================
   anvendelse — producentens EGEN inddeling, ikke vores

   CLAUDE.md begraensning 6 forbyder en redaktionel score uden offentliggjort
   metode. En redaktionel ANVENDELSESinddeling ville falde for samme regel:
   "en konklusion skrevet om til en kategori". Derfor er feltet konstrueret,
   saa det ikke KAN baere vores mening: uden et ordret citat fra producenten
   er den eneste tilladte vaerdi ikke_oplyst, og det haandhaeves af R16.

   Feltet er en TOPNOEGLE, ikke et felt i "felter". To grunde:
   1. Det er ikke en specifikation, producenten oplyser eller lader vaere med at
      oplyse — det er den hylde, producenten selv stiller robotten paa.
   2. Ville det taelle i specifikationstaetheden, ville naevneren skifte fra 33 til
      34, og alle historiske taethedstal i STATUS.md og DATAMODEL.md ville blive
      uforlignelige. Naevneren er udledt siden L30, saa skiftet ville ske TAVST i
      koden — men metodeproeven i tests/koer.mjs fanger det, fordi metode.md saa
      ville sige 33, hvor koden siger 34.

   Form:
     anvendelse:
       vaerdi: industri              # eller en liste, eller ikke_oplyst
       citat: "Robot - Industry"     # streng ELLER liste af strenge, ordret
       kilde: https://www.unitree.com/
       hentet: 2026-08-19
       kildetype: primaer            # valgfri
       arvet_fra: unitree-b2         # valgfri: se L23 og R17
       note: "..."                   # valgfri: hvad citatet IKKE daekker
   ====================================================================== */

/**
 * Det tilladte saet.
 *
 * L27 (21. aug 2026): vaerdierne er en USORTERET MAENGDE. Der findes ikke laengere
 * en "hovedpositionering", og raekkefoelgen i YAML'en betyder ingenting.
 * Den gamle regel — "staar der flere, er den foerste producentens
 * hovedpositionering" — er fjernet, fordi KRITIK-1-plan.md K4 maalte, hvad den
 * gjorde: ti robotter med de SAMME to kategorier blev delt i to bunker af
 * raekkefoelgen i en producents navigationsmenu. R16 kraever citat paa AT en
 * kategori er naevnt, og kraevede intet om raekkefoelgen — saa beviskravet laa paa
 * det led, der ikke betyder noget, og manglede paa det led, der afgjorde forsiden.
 * Det er praecis den redaktionelle dom, feltet blev bygget for at undgaa.
 *
 * Raekkefoelgen her i listen er derfor kun én ting: den kanoniske visningsorden,
 * som `sorterAnvendelse` laegger vaerdierne i, saa to filer med de samme
 * kategorier ser ens ud uanset hvad YAML'en skrev.
 *
 * `sikkerhed_overvaagning` er den syvende, tilfoejet med L22. Uden den blev
 * producentens eget ord (*security / patrol / surveillance*) paa seks robotter
 * ikke omsat — og alternativet, at presse det ind under `forsvar_beredskab`,
 * ville stille en parkpatruljerobot ved siden af en militaerplatform.
 */
export const ANVENDELSE_VAERDIER = [
  'industri',
  'inspektion',
  'sikkerhed_overvaagning',
  'forskning_udvikling',
  'forbruger_uddannelse',
  'forsvar_beredskab',
  'logistik',
];

/**
 * Kanonisk orden. Ikke en rangering: en fast orden er netop det, der goer
 * raekkefoelgen ulaeselig som mening. Ukendte vaerdier bagerst, saa en fejl i
 * data ikke forsvinder i sorteringen — den skal stadig fanges af R16.
 */
export function sorterAnvendelse(vaerdier) {
  const plads = (v) => {
    const i = ANVENDELSE_VAERDIER.indexOf(v);
    return i === -1 ? ANVENDELSE_VAERDIER.length : i;
  };
  return [...vaerdier].sort((a, b) => plads(a) - plads(b) || String(a).localeCompare(String(b)));
}

/** Noegler, en anvendelsespost maa indeholde. Alt andet fejler paa R16. */
export const ANVENDELSE_NOEGLER = new Set([
  'vaerdi', 'citat', 'kilde', 'hentet', 'kildetype', 'arvet_fra', 'note',
]);

/**
 * Ja/nej som tekst. Dataskriveren skriver producentens svar paa dansk, og
 * "vaerdi: ja" er ikke et gaet — det er den samme oplysning som "vaerdi: true"
 * skrevet i det sprog, resten af filen er skrevet i. Formen normaliseres til en
 * boolean ét sted (normaliserRobot), saa validatoren og generatoren ikke kan naa
 * til hver sin konklusion om, hvad "nej" betyder.
 *
 * Returnerer true, false eller null. null betyder "ikke et ja/nej" — og det er
 * stadig en fejl paa et ja/nej-felt, saa R4 er ikke blevet mildere.
 */
const JA_ORD = new Set(['ja', 'yes', 'true']);
const NEJ_ORD = new Set(['nej', 'no', 'false']);
export function jaNejAf(v) {
  if (typeof v === 'boolean') return v;
  if (typeof v !== 'string') return null;
  const k = v.trim().toLowerCase();
  if (JA_ORD.has(k)) return true;
  if (NEJ_ORD.has(k)) return false;
  return null;
}

/** Noegler, en feltpost maa indeholde. Alt andet fejler — en tastefejl i en
 *  noegle ville ellers forsvinde tavst ud af bygget.
 *  `varianter` er skemaudvidelse 2: Go2's fire varianter er fire maskiner. */
export const POST_NOEGLER = new Set([
  'vaerdi', 'min', 'maks', 'enhed', 'operator', 'kilde', 'hentet', 'kildetype',
  'vaerdi_imperial', 'enhed_imperial', 'advarsel', 'note', 'raa',
  'ved_last', 'valuta', 'varianter',
]);

/**
 * Noegler med to stavemaader. `vaerdi_min`/`vaerdi_maks` staar i 24 filer og
 * laeser bedre ved siden af `vaerdi` og `vaerdi_imperial` end de bare `min`/`maks`
 * — men to stavemaader for én ting divergerer ved den fjerde aendring. Derfor
 * accepteres begge ved indlaesningen, og ALT efter normaliseringen (validator,
 * generator, taethed, robots.json) ser kun den kanoniske form.
 */
export const POST_NOEGLE_ALIAS = { vaerdi_min: 'min', vaerdi_maks: 'maks' };

/**
 * D7 — naevneren i specifikationstaetheden. LUKKET med L30 (21. aug 2026): den er
 * FELTNAVNE.length, i dag 33.
 *
 * Den bliver UDLEDT og maa aldrig skrives som et tal igen. Det var praecis det, der
 * gik galt: `taethed()` har hele tiden talt taelleren op over FELTNAVNE (33 noegler),
 * mens naevneren stod som en haandskrevet konstant. To lister, ét broekstreg — og de
 * skred fra hinanden ved hver skemaaendring uden at noget fejlede.
 *
 * Lineage, maalt 21. aug 2026:
 *   29  praeliste fra foer L6 (nyttelast som ét felt, trinhoejde som ét). Levn.
 *   31  L19's tal. Talte "maal staaende L x B x H" som ÉN post, hvor skemaet har tre
 *       noegler med hver sin kilde, og talte et felt med, "maal sammenfoldet", som
 *       skemaet aldrig har haft. To modsatrettede fejl, der naesten gik lige op.
 *   33  det skemaet har, og det de 46 datafiler skriver: 46 x 33 = 1518 feltposter,
 *       nul ukendte noegler, nul ubrugte skemafelter.
 *
 * Aendrer nogen FELTER, flytter naevneren med — og det ER det rigtige, fordi
 * taelleren allerede flytter med. Metodesiden maa saa rettes: tests/koer.mjs har en
 * proeve, der fejler, hvis `indhold/metode.md` siger et andet tal end det her.
 */
export const NAEVNER = FELTNAVNE.length;

/** Liste, fordi --naevner= stadig kan give flere, naar en aendring skal MAALES. */
export const NAEVNERE_STANDARD = [NAEVNER];

/** Felter, katalogtabellen viser. Resten staar paa detaljesiden. */
export const KATALOG_FELTER = [
  'egenvaegt', 'nyttelast_gaaende', 'hastighed', 'driftstid',
  'ip_klasse', 'ros2', 'ce_oplyst', 'pris',
];

/** Felter, klientside-filtreringen kan bruge. Holdes lille — indekset skal vaere lille. */
export const FILTER_FELTER = [
  'nyttelast_gaaende', 'driftstid', 'ip_klasse', 'ros2', 'eu_tilgaengelig', 'ce_oplyst', 'pris',
];

export const SPROG = ['da', 'en'];

/* ======================================================================
   Normalisering — ét sted, delt af validate.mjs og build.mjs

   Validatoren og generatoren maa ikke kunne naa til hver sin konklusion om,
   hvad en datafil betyder. Da to dataagenter skrev efter hver sin laesning af
   skemaet, blev det til 358 afviste felter. Rettelsen er ikke at laere hver af
   de to programmer at gaette; det er at give dem én laesning at dele.

   Normaliseringen omskriver kun FORM. Den fylder aldrig noget ud, gaetter aldrig
   en enhed og kollapser aldrig ikke_oplyst, nej og 0 til hinanden.
   ====================================================================== */

/** Feltets enhed i kanonisk form. Slaar op inden for feltets egen dimension
 *  foerst, saa "C" er Celsius i et temperaturfelt og ukendt alle andre steder. */
export function feltEnhed(raa, spec) {
  if (raa === undefined || raa === null || raa === '') return raa;
  for (const t of [spec?.type, spec?.ogsaaType]) {
    if (!t) continue;
    const k = kanoniskEnhed(String(raa), t);
    if (ENHEDER[k] && ENHEDER[k][0] === t) return k;
  }
  return kanoniskEnhed(String(raa));
}

const erKort = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/**
 * Normaliserer ét dokument PAA STEDET og returnerer det.
 * Kaldes af begge programmer lige efter parseYaml.
 */
export function normaliserRobot(doc) {
  if (!erKort(doc) || !erKort(doc.felter)) return doc;
  for (const [navn, post] of Object.entries(doc.felter)) {
    const spec = FELTER[navn];
    if (!erKort(post)) continue;

    // 1. Noeglealias. Staar begge stavemaader, roeres ingen af dem — saa fejler
    //    R11 paa den ukendte noegle i stedet for at én af dem tavst vinder.
    for (const [fra, til] of Object.entries(POST_NOEGLE_ALIAS)) {
      if (post[fra] !== undefined && post[til] === undefined) {
        post[til] = post[fra];
        delete post[fra];
      }
    }

    // 2. Enheder til kanonisk form: "C" -> "°C", "grader" -> "°", "km/t" -> "km/h".
    //    Gaettes ikke: kender skemaet ikke enheden, staar den uroert og fejler paa R5.
    if (spec) {
      post.enhed = feltEnhed(post.enhed, spec);
      post.enhed_imperial = feltEnhed(post.enhed_imperial, spec);
      if (post.enhed_imperial === undefined) delete post.enhed_imperial;
      if (post.enhed === undefined) delete post.enhed;
    }
    if (erKort(post.ved_last)) {
      const e = feltEnhed(post.ved_last.enhed, { type: 'masse' });
      if (e !== undefined) post.ved_last.enhed = e;
    }

    // 3. Ja/nej-felter: producentens svar som ord bliver til en boolean.
    //    Kun paa ja/nej-felter — "nej" paa et listefelt er stadig tilstanden
    //    "producenten svarer nej", og de to maa ikke bytte plads.
    if (spec?.art === 'jaNej') {
      const b = jaNejAf(post.vaerdi);
      if (b !== null) post.vaerdi = b;
    }
  }
  return doc;
}
