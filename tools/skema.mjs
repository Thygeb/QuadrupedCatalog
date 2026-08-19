/**
 * tools/skema.mjs — feltlisten, sprogneutralt. Nul afhaengigheder.
 *
 * Delt af validate.mjs og build.mjs. Ingen dansk eller engelsk tekst her:
 * etiketter staar i data/i18n/{da,en}.json, én fil pr. sprog (PLAN.md afsnit 7).
 * Faelder generatoren over en manglende etikette, er det med vilje — en manglende
 * oversaettelse skal fejle synligt, ikke lande som dansk paa /en/.
 */

/**
 * art:  tal | jaNej | tekst | liste | ip
 * type: dimensionen, som enheden skal tilhoere (kun for art: 'tal')
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
  haeldning:               { gruppe: 'fysik',       art: 'tal',   type: 'vinkel' },
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
export const IDENTITET_VALGFRI = ['foerste_udgivelse', 'forgaenger', 'noter', 'silhuet'];
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

/** Noegler, en feltpost maa indeholde. Alt andet fejler — en tastefejl i en
 *  noegle ville ellers forsvinde tavst ud af bygget. */
export const POST_NOEGLER = new Set([
  'vaerdi', 'min', 'maks', 'enhed', 'operator', 'kilde', 'hentet', 'kildetype',
  'vaerdi_imperial', 'enhed_imperial', 'advarsel', 'note', 'raa',
  'ved_last', 'valuta',
]);

/**
 * D7 — naevneren i specifikationstaetheden er IKKE afgjort.
 * Skemaet har 33 felter; de historiske optaellinger brugte 29 (maal L x B x H som
 * ét felt, driftstemperatur som ét) og 31. Derfor er naevneren en parameter, og
 * bygget viser alle tre, indtil nogen lukker punktet.
 */
export const NAEVNERE_STANDARD = [29, 31];

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
