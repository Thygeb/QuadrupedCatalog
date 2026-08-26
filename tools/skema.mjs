/**
 * tools/skema.mjs — feltlisten, sprogneutralt. Nul afhaengigheder.
 *
 * Delt af validate.mjs og build.mjs. Ingen dansk eller engelsk tekst her:
 * etiketter staar i data/i18n/{da,en}.json, én fil pr. sprog (PLAN.md afsnit 7).
 * Faelder generatoren over en manglende etikette, er det med vilje — en manglende
 * oversaettelse skal fejle synligt, ikke lande som dansk paa /en/.
 */

import { kanoniskEnhed, ENHEDER, tilBasis } from './yaml.mjs';

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
  // L32 (24. aug 2026): eu_tilgaengelig, eu_service og leveringstid fjernet -
  // stod ikke_oplyst paa alle 55 robotter (0 af 165 mulige vaerdier udfyldt),
  // og deres indhold laa i sekundaere kilder D1 aldrig har godkendt. ce_oplyst
  // er tilbage som den eneste EU-oplysning skemaet baerer, og gruppen 'eu'
  // lever videre alene paa den.
  ce_oplyst:               { gruppe: 'eu',          art: 'jaNej' },
};

export const FELTNAVNE = Object.keys(FELTER);
export const GRUPPER = ['fysik', 'energi', 'sensorik', 'nyttelast', 'kommercielt', 'eu'];

/** Identitet. Skrives af os og taeller ikke i taetheden. */
export const IDENTITET_PAAKRAEVET = ['slug', 'navn', 'producent', 'producentland', 'status'];
export const IDENTITET_VALGFRI = [
  'foerste_udgivelse', 'forgaenger', 'noter',
  // Producentens by. Sammen med producentland er den svaret paa "hvor staar de
  // henne" — ANYbotics ligger i Zuerich, og Schweiz er ikke EU.
  'producentby',
  // Robottens billede. Se BILLEDE_* nedenfor og R18.
  // `silhuet` STOD her indtil 21. aug 2026 som en noegle uden regler, uden
  // laeser og uden en eneste fil, der brugte den (maalt: 0 af 46). To noegler
  // for det samme billede er en kontakt med to stillinger, og den her havde
  // ingen. Den er fjernet, saa `billede:` er den eneste vej ind.
  'billede',
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
   2. Ville det taelle i specifikationstaetheden, ville naevneren skifte fra 30 til
      31, og alle historiske taethedstal i STATUS.md og DATAMODEL.md ville blive
      uforlignelige. Naevneren er udledt siden L30, saa skiftet ville ske TAVST i
      koden — men metodeproeven i tests/koer.mjs fanger det, fordi metode.md saa
      ville sige 30, hvor koden siger 31.

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

/* ======================================================================
   billede — hvem har lavet det, og hvor kom det fra

   Feltet er en TOPNOEGLE af samme grund som `anvendelse`: et billede er ikke
   en specifikation, producenten oplyser eller lader vaere med at oplyse, saa
   det maa ikke flytte naevneren i specifikationstaetheden (D7 er stadig aaben).

   Formen:

     billede:
       fil: silhuetter/unitree-b2-staaende.svg   # RELATIV TIL assets/
       ophav: silhuet                            # eget_foto | silhuet | fabrikant
       kilde: https://www.unitree.com/b2         # hvor maalene/billedet kom fra
       hentet: 2026-08-21
       alt: "Maaltro silhuet af Unitree B2"      # valgfri
       note: "Tegnet efter L 1098 x B 450 mm."   # valgfri
       delt_med: unitree-b2                      # valgfri, L28
       plade: ja                                 # valgfri, ellers udledt af ophav
       pos: "50% 40%"                            # valgfri object-position

   Tre ting, feltet er bygget for at goere umuligt:

   1. **Et billede uden ophav.** Uden `ophav` kan siden ikke vide, om den viser
      vores eget arbejde eller fabrikantens materiale — og S1 forbyder
      publicering med det sidste. Ophavet er derfor PAAKRAEVET (R18), ikke
      udledt af mappen. En mappe kan flyttes; en oplysning i data kan ikke
      flytte sig selv.
   2. **En silhuet uden kilde paa de maal, den er tegnet efter.** Det er
      assets/silhuetter/LÆSMIG.md regel 5, og det er den samme regel som for
      tal: et maal uden kilde er ikke indsamlet, det er husket. Derfor kraever
      `silhuet` og `fabrikant` begge `kilde` + `hentet`.
   3. **En sti ud af assets/.** `fil` er relativ til assets/ og maa hverken
      begynde med `/`, indeholde `..` eller pege paa media/. Det er den samme
      spaerring som i bygget, skrevet ind i data-laget, saa den ikke kun
      findes ét sted.

   `eget_foto` maa staa uden kilde: vi har taget det selv, og der er ingen
   URL at pege paa. Staar der alligevel en kilde, skal `hentet` foelge med.
   ====================================================================== */

export const BILLEDE_OPHAV = ['eget_foto', 'silhuet', 'fabrikant'];

/** Ophav, hvor billedet ikke er vores eget arbejde og skal kunne foelges hjem. */
export const BILLEDE_KRAEVER_KILDE = new Set(['silhuet', 'fabrikant']);

/** Noegler, en billedpost maa indeholde. Alt andet fejler paa R18. */
export const BILLEDE_NOEGLER = new Set([
  'fil', 'ophav', 'kilde', 'hentet', 'alt', 'note', 'delt_med', 'plade', 'pos',
]);

/** Mapper under assets/, et billede maa ligge i. media/ staar ikke og kan ikke staa her. */
export const BILLEDMAPPER = ['fotos', 'silhuetter', 'ikoner'];

/** Endelser, bygget kopierer og skabelonerne kan vise. */
export const BILLEDE_ENDELSER = ['.svg', '.jpg', '.jpeg', '.png', '.webp', '.avif'];

/**
 * Kilder til et <picture>: de moderne formater foerst, i den raekkefoelge en
 * browser skal proeve dem. Kun formater, der FINDES som fil, bliver til en
 * <source> — en srcset til en fil, ingen har lavet, er en tom paastand.
 */
export const BILLEDE_ALTERNATIVER = [['.avif', 'image/avif'], ['.webp', 'image/webp']];

/**
 * Skal billedet staa som en genstand paa hvid plade (contain) frem for at
 * beskaeres (cover)? Silhuetter skal — de er tegninger i faelles maalestok, og
 * en 16:10-beskaering ville tage poterne. Fotografier beskaeres, med mindre
 * dataskriveren siger andet. Én udledning ét sted, saa kort og robotside ikke
 * kan naa til hver sin konklusion om den samme fil.
 */
export function billedPlade(b) {
  if (!b) return false;
  const p = jaNejAf(b.plade);
  if (p !== null) return p;
  return b.ophav === 'silhuet';
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
 * FELTNAVNE.length, i dag 30.
 *
 * Den bliver UDLEDT og maa aldrig skrives som et tal igen. Det var praecis det, der
 * gik galt: `taethed()` har hele tiden talt taelleren op over FELTNAVNE (i dag 30
 * noegler), mens naevneren stod som en haandskrevet konstant. To lister, ét
 * broekstreg — og de skred fra hinanden ved hver skemaaendring uden at noget fejlede.
 *
 * Lineage:
 *   29  praeliste fra foer L6 (nyttelast som ét felt, trinhoejde som ét). Levn.
 *   31  L19's tal. Talte "maal staaende L x B x H" som ÉN post, hvor skemaet har tre
 *       noegler med hver sin kilde, og talte et felt med, "maal sammenfoldet", som
 *       skemaet aldrig har haft. To modsatrettede fejl, der naesten gik lige op.
 *   33  maalt 21. aug 2026 (L30-lukningen): det skemaet havde dengang, og det de 46
 *       datafiler skrev: 46 x 33 = 1518 feltposter, nul ukendte noegler, nul ubrugte
 *       skemafelter.
 *   30  L32 (24. aug 2026): eu_tilgaengelig, eu_service og leveringstid fjernet fra
 *       FELTER. De stod ikke_oplyst paa alle 55 robotter (0 af 165 mulige vaerdier
 *       udfyldt) — intet kildebelagt tal gik tabt. ce_oplyst blev. Naevneren gaar 33
 *       -> 30 og alle taethedstal stiger ~10 % som foelge (anden niveauforskydning
 *       paa en uge efter L30 — sammenlign aldrig et tal fra foer 24. aug 2026 med et
 *       nyt uden at regne om).
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
  'nyttelast_gaaende', 'driftstid', 'ip_klasse', 'ros2', 'ce_oplyst', 'pris',
];

/**
 * Ét felt i SAMMENLIGNINGENS visningsform — sprogneutralt (tal forbliver
 * tal, operatoren forbliver sin raa kode), til /sammenligning/'s klientside
 * felt-for-felt-tabel (tools/skabelon/sammenligning.mjs, assets/sammenligning.js).
 * Delt af build.mjs (robots.json's `alle_felter`) og sammenligning.mjs (den
 * inline JSON-blok, hver sprogudgave af siden baerer) — ét sted, saa de to
 * ikke kan naa til hver sin laesning af den samme YAML.
 *
 * Deler INGEN kode med side.mjs' tal()/tilstand() (som skriver HTML for ét
 * sprog ad gangen) — de to har forskellige job: side.mjs afgoer UDSEENDET
 * for en robot, bygget kender paa forhaand; denne funktion afgoer DATAEN
 * for en robot, LAESEREN vaelger i browseren, og som derfor maa vaere klar i
 * begge sprogudgaver paa forhaand. Formen genbruger samme fire tilstande og
 * samme felter (operator, min/maks, ved_last, forbehold) som resten af
 * systemet — kun UDTRYKKET er strukturerede data i stedet for HTML.
 *
 * IKKE med: `kilde`, `hentet`, `kildetype`. Kildemaerker forbliver skjult
 * paa sammenligningssiden (CEO-beslutning 24. aug, se BEGRUNDELSE.md
 * "Kilder skjules") — de udelades her, saa de aldrig kan naa klienten,
 * ikke kun visuelt skjules med CSS.
 */
export function feltVisning(navn, post) {
  const spec = FELTER[navn];
  if (post === undefined) return { tilstand: 'ikke_oplyst' };
  if (typeof post === 'string') {
    const t0 = tilstandAf(post);
    return t0 ? { tilstand: t0 === 'nej' ? 'nej' : t0 } : { tilstand: 'tekst', tekst: post };
  }
  if (typeof post !== 'object') return { tilstand: 'ikke_oplyst' };
  const t0 = tilstandAf(post.vaerdi);
  if (t0) return { tilstand: t0 === 'nej' ? 'nej' : t0, forbehold: post.advarsel ?? null };
  if (spec?.art === 'jaNej') return { tilstand: post.vaerdi ? 'ja' : 'nej', forbehold: post.advarsel ?? null };
  if (spec?.art === 'liste') {
    const v = Array.isArray(post.vaerdi) ? post.vaerdi : [post.vaerdi];
    return { tilstand: 'tekst', tekst: v.join(', '), forbehold: post.advarsel ?? null };
  }
  if (typeof post.vaerdi === 'string' && spec?.art !== 'ip') {
    // Et tekstfelt kan baere et maalbart interval ved siden af producentens
    // ordlyd (Spots "ureguleret DC 35-58,8 V") - samme regel som robot.mjs' vaerdi().
    // Intervallet er tekstvaerdiens maskinlaesbare skygge, IKKE en ekstra
    // oplysning til laeseren: findes begge, vises kun tekstvaerdien (spor/
    // sammenlign, fund 3+6+8, punkt 2) - ellers saa Spots "Stroem ud" baade
    // "ureguleret DC 35-58,8 V, 150 W pr. port" OG "35-58,8 V" samtidig.
    // min/maks/enhed udelades derfor helt af udtrykket her; de forbliver i
    // raadata (post.min/post.maks), saa intet forsvinder - kun visningen af
    // dem, naar en tekstvaerdi allerede daekker samme tal.
    return { tilstand: 'tekst', tekst: post.vaerdi, forbehold: post.advarsel ?? null };
  }
  // Tal - ogsaa art:'ip' ("IP67" er en figur, ikke prosa, samme regel som robot.mjs).
  const erNul = post.vaerdi === 0;
  const ud = {
    tilstand: erNul ? 'nul' : 'tal',
    vaerdi: post.min !== undefined ? null : (typeof post.vaerdi === 'number' ? post.vaerdi : String(post.vaerdi)),
    min: post.min ?? null, maks: post.maks ?? null,
    enhed: post.enhed ?? null, operator: post.operator ?? null,
    forbehold: post.advarsel ?? null,
  };
  if (post.ved_last !== undefined) {
    const raa = post.ved_last;
    const ukendt = typeof raa === 'string' || tilstandAf(typeof raa === 'object' ? raa.vaerdi : raa);
    ud.ved_last = ukendt ? { ukendt: true } : { vaerdi: raa.vaerdi, enhed: raa.enhed ?? null };
  }
  return ud;
}

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
  if (!erKort(doc)) return doc;

  // 0. Billedposten. "plade: ja" bliver til true ét sted, saa validatoren og
  //    generatoren ikke kan naa til hver sin konklusion om, hvordan filen skal
  //    staa. Et ord, der hverken er ja eller nej, roeres IKKE — R18 skal kunne
  //    se det. Stien roeres heller ikke: en omvendt skraastreg er en fejl, der
  //    skal fejle synligt, ikke rettes tavst til en anden stavemaade.
  if (erKort(doc.billede)) {
    const p = jaNejAf(doc.billede.plade);
    if (p !== null) doc.billede.plade = p;
  }

  if (!erKort(doc.felter)) return doc;
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

/* ======================================================================
   spor/enheder (26. aug 2026) — kanonisk VISNINGSenhed pr. felt

   BEVISET (dist-e/robots.json, alle 77 robotter, foer dette spor):
     laengde mm:50 cm:8 m:1 · bredde mm:50 cm:8 m:1 · hoejde mm:52 cm:8 m:1
     forhindring_enkelt cm:25 mm:2 m:3 · hastighed m/s:58 km/h:6
     driftstid t:59 min:7 · ladetid t:18 min:5 · haeldning °:52 %:1
     pris CNY:6 USD:4 EUR:1
   Ni felter, ni forskellige enheder ved siden af hinanden i samme raekke.

   Dette er IKKE en aendring af normaliserRobot() ovenfor. Den funktion deles
   med validate.mjs, og validatoren skal blive ved med at se PRODUCENTENS
   egen enhed (R5/R9 regner paa den). Kanonisk VISNINGSenhed er en ny,
   adskilt omregning, som KUN build.mjs kalder — paa den i-hukommelse-kopi af
   robotten, bygget selv har lavet. Datafilerne (data/robots/*.yaml) roeres
   aldrig, og validatoren ser intet af det her.

   TO FELTER ER BEVIDST UDELADT herfra:
   - `pris`: CNY/USD/EUR kan kun omregnes med en valutakurs, og en kurs er et
     tal, siden ikke har en kilde til (CLAUDE.md-briefets regel 1b). Valutaen
     staar som producenten skrev den.
   - `haeldning`: allerede arkitektonisk besluttet ovenfor i FELTER
     (kommentaren ved `ogsaaType: 'stigning'`) - ° og % er to DIMENSIONER,
     ikke to enheder for samme stoerrelse (45 % er 24,2°, og atan(p/100) er en
     udledning, ikke en oversaettelse). Begge staar uroert.

   DE SYV TILBAGEVAERENDE — enheden og MAALINGEN, der afgjorde den (tools/
   _maal_enheder2.mjs, koert 26. aug 2026 over alle 77 datafiler):

   - laengde, bredde, hoejde, forhindring_enkelt -> cm.
     mm giver op til FIRE cifre (forhindring_enkelt' 1100 mm, laengdes
     1190 mm). cm giver hoejst TRE (119 cm) og holder alle fire maal i
     samme enhed, som de i forvejen vises side om side paa (L x B x H).
     Prisen: 11 af 59 laengdevaerdier faar én decimal (721 mm -> 72,1 cm) -
     det er en PRAECIS omregning (mm er altid et heltal), ikke et gaet.
   - hastighed -> m/s. Allerede den dominerende enhed (58 af 64 vaerdier).
     Modsat vej (alle til km/h) ville tvinge 58 vaerdier igennem *3,6 med
     mange decimaler (2,4 m/s -> 8,64 km/h); m/s tvinger kun 6 vaerdier
     igennem /3,6, og maks-tallet er ét ciffer (8).
   - driftstid, ladetid -> min. MODSAT den dominerende enhed (t staar paa
     59/66 af driftstidsposterne) - maalt fordi minutter viser sig at vaere
     det BROEKFRIE valg: alle fundne "t"-vaerdier (1.5, 2.5, 3.15, 3.3, 4.6 t)
     er hele antal minutter (90, 150, 189, 198, 276), mens flere "min"-
     vaerdier (40, 110, 160 min) IKKE er hele antal timer (0,667 t, 1,833 t,
     2,667 t - periodiske decimaler). At foelge flertallet havde givet
     broeker; minutter giver ingen, og max-tallet (720) er stadig kun tre
     cifre. Det er den ene af de ni felter, hvor kriteriet ("uden broeker OG
     uden firecifrede tal") peger paa MINDRETallets enhed - skrevet ud her,
     saa den naeste laeser ikke tror det er en fejl.

   Rundes til 6 decimaler for at fjerne flydende-komma-stoej (fx 189,00000
   000000003 fra 3,15 t * 60) - IKKE for at reducere praecisionen laeseren
   ser. Den sidste afrunding til visning sker stadig i side.mjs' nformat/
   assets/sammenligning.js' fmt (begge maximumFractionDigits: 3), uaendret.
   ====================================================================== */
export const KANONISK_VISNINGSENHED = {
  laengde: 'cm', bredde: 'cm', hoejde: 'cm', forhindring_enkelt: 'cm',
  hastighed: 'm/s',
  driftstid: 'min', ladetid: 'min',
};

/**
 * Ét felts post OMSAT til dets kanoniske visningsenhed - VISNING KUN, se
 * kommentaren ovenfor. Returnerer en NY kopi (originalen roeres aldrig - kun
 * build.mjs's egen i-hukommelse-kopi af robotten kalder denne funktion, via
 * normaliserVisningsEnheder nedenfor).
 *
 * `post` uaendret (SAMME reference) naar: feltet ikke er et af de syv,
 * enheden allerede er den kanoniske, vaerdien er en tilstand
 * (ikke_oplyst/nej/kun_billede), vaerdien er fri tekst (Spots "ureguleret DC
 * 35-58,8 V" - samme regel som feltVisning ovenfor: en tekstvaerdis
 * indlejrede tal roeres ikke), eller enheden er ukendt/en anden dimension
 * (fejler et andet sted, ikke her).
 *
 * Naar en omregning FAKTISK sker, faar kopien en `_kildeform`: producentens
 * egen figur + enhed, fx "70 cm". Det er raamaterialet til "kildens egen
 * formulering", som CLAUDE.md-briefet kraever tilgaengelig - se
 * tools/skabelon/robot.mjs, hvor den vises i en title. `_kildeform` er ALDRIG
 * en del af POST_NOEGLER og skrives aldrig til robots.json (feltVisning() og
 * indekset i build.mjs bygger begge deres udtryk af navngivne noegler, ikke
 * ved at sprede posten).
 */
export function visningsPost(navn, post) {
  const maal = KANONISK_VISNINGSENHED[navn];
  if (!maal || !erKort(post)) return post;
  if (!post.enhed || post.enhed === maal) return post;
  if (tilstandAf(post.vaerdi)) return post;
  if (typeof post.vaerdi === 'string') return post;

  const fra = ENHEDER[post.enhed];
  const til = ENHEDER[maal];
  if (!fra || !til || fra[0] !== til[0]) return post; // ukendt/forskellig dimension - R5's bord, ikke dette

  const om = (v) => {
    if (typeof v !== 'number') return v;
    const basis = tilBasis(v, post.enhed);
    return Math.round((basis / til[1]) * 1e6) / 1e6;
  };
  const kildeform = post.min !== undefined
    ? `${post.min}–${post.maks} ${post.enhed}`
    : `${post.vaerdi} ${post.enhed}`;

  const ny = { ...post, enhed: maal, _kildeform: kildeform };
  if (post.min !== undefined) { ny.min = om(post.min); ny.maks = om(post.maks); }
  else ny.vaerdi = om(post.vaerdi);
  return ny;
}

/**
 * Kaldes af build.mjs, LIGE EFTER normaliserRobot() - aldrig af validate.mjs.
 * Muterer doc.felter PAA STEDET (samme begrundelse som normaliserRobot: det
 * er bygget's egen kortlevede kopi, ikke en fil paa disk), saa ALLE
 * skabeloner, der laeser robot.felter[navn] fra samme robotter-array
 * (side.mjs' kort/stribe, forside.mjs' yderpunkter, katalog.mjs,
 * sammenligning.mjs' feltVisning-kald), automatisk ser den kanoniske enhed -
 * uden at nogen af de filer skal aendres.
 */
export function normaliserVisningsEnheder(doc) {
  if (!erKort(doc) || !erKort(doc.felter)) return doc;
  for (const navn of Object.keys(KANONISK_VISNINGSENHED)) {
    const post = doc.felter[navn];
    if (post === undefined) continue;
    const ny = visningsPost(navn, post);
    if (ny !== post) doc.felter[navn] = ny;
  }
  return doc;
}
