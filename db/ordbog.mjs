#!/usr/bin/env node
/**
 * db/ordbog.mjs — DEN ENE ordbog dansk <-> engelsk (spor/skema, punkt 1 af
 * FASE 1, L81-L83 i STATUS.md). Nul afhaengigheder.
 *
 * FORMAALET: L82 goer databasen engelsk — tabelnavne, kolonnenavne,
 * enum-typer, enum-vaerdier og de opremsede datavaerdier (producentland,
 * fremdrift, anvendelseskategorier, feltdefinitionernes gruppe/art/dimension).
 * Denne fil er den ENE liste, der afgoer hvert navneskifte. `db/byg-migrering.mjs`
 * LAESER den og genererer `db/migrering-engelsk.sql` derfra — migreringen er
 * IKKE en anden haandskrevet liste ved siden af (L30-laerdommen: "en broek,
 * hvis to halvdele kommer fra hver sin liste, skrider — tavst"). `db/eksporter.mjs`
 * bruger samme ordbog til at mappe den engelske DB-form TILBAGE til det danske
 * YAML-dokument, `data/robots/` allerede har.
 *
 * KRAV (briefets punkt 1): 1:1 og vendbart — `tilDansk(tilEngelsk(x)) === x`
 * for ALT. Haandhaevet STRUKTURELT her, ikke kun ved konvention: `lavOrdbog()`
 * bygger BEGGE retninger af hver kortlaegning og KASTER en fejl ved import,
 * hvis to danske noegler nogensinde skulle pege paa samme engelske vaerdi (et
 * OS-modul kan ikke lade en saadan kollision glide stille igennem, saa denne
 * fil fejler hoejlydt fremfor at lade to danske ord "dele" ét engelsk).
 *
 * NAVNEREGLER (briefet): ét navn pr. begreb, snake_case, hele ord, ingen
 * forkortelser. Konsekvenser, der er lidt ud over det aabenlyse:
 *   - `min`/`maks` bliver `minimum`/`maximum` (matematiske forkortelser
 *     talte som forkortelser her, ikke som selvstaendige ord).
 *   - `pos` (CSS object-position) bliver `position`.
 *   - `temp_min`/`temp_maks` bliver `temperature_min`/`temperature_max`.
 *   - `id`, `ip`, `ros2`, `compute`, `hot_swap` er IKKE oversat: de er
 *     allerede engelske/internationale tekniske termer eller (for `id`)
 *     universel databasekonvention — at oversaette dem ville tilfoeje stoej,
 *     ikke klarhed. Skrevet ud her, saa det staar som et BEVIDST valg.
 *   - `ce_oplyst`/`fcc_oplyst`/`ul_oplyst`/`ccc_oplyst`: certificeringernes
 *     egne navne (CE, FCC, UL, CCC) er proprietaere forkortelser, IKKE danske
 *     ord — de forbliver uoversatte, kun "oplyst" (-> "disclosed") oversaettes.
 *   - "egenvaegt" er IKKE "own weight" (briefets egen advarsel). Det er
 *     robottens EGEN masse, uden nyttelast — nyttelasten har sine egne felter
 *     (nyttelast_gaaende/nyttelast_staaende), saa "weight" alene er entydigt
 *     her og kraever ikke et kvalificerende "own"/"net".
 *   - "tilstand" -> "state" GENNEMGAAENDE (kolonnen, tilstand_enum,
 *     ved_last_tilstand -> load_state, bare_tilstand -> bare_state,
 *     tilstand_med_herkomst -> state_with_provenance). Ét dansk ord, ét
 *     engelsk ord, alle steder det forekommer — se selvtjekket nedenfor.
 *   - HAARD BEGRAENSNING 5: de fire tilstande (ikke_oplyst/nej/0/kun_billede)
 *     forbliver fire forskellige ord: undisclosed / no / (0 er en TALVAERDI,
 *     ikke et enum-medlem, og optraeder derfor slet ikke her) / image_only.
 *
 * NAVNEROEM: hver kortlaegning nedenfor er sin EGEN, uafhaengige ordbog — 1:1
 * kraeves KUN inden for samme kortlaegning (fx maa en TABEL og en ENUM-LABEL
 * godt begge oversaettes til "provenance", uden at det er en kollision, fordi
 * de aldrig slaas op i samme retning). Praksis her er alligevel GENNEMGAAENDE
 * konsistent: samme danske ord faar samme engelske ord, ogsaa paa tvaers af
 * kortlaegninger (fx "laengde" -> "length" baade som feltnavn og som
 * dimensionsetiket) — det er et bevidst, men IKKE et haandhaevet, valg.
 */

/** Bygger BEGGE retninger af én kortlaegning og fejler ved import, hvis den
 *  ikke er 1:1. `navn` er kun til fejlteksten. */
function lavOrdbog(kortlaegning, navn) {
  const tilEngelskKort = new Map(Object.entries(kortlaegning));
  const tilDanskKort = new Map();
  for (const [da, en] of tilEngelskKort) {
    if (tilDanskKort.has(en)) {
      throw new Error(
        `db/ordbog.mjs: "${navn}" er IKKE 1:1 — engelsk "${en}" faar to danske kilder: ` +
        `"${tilDanskKort.get(en)}" og "${da}". Ret én af dem.`
      );
    }
    tilDanskKort.set(en, da);
  }
  return {
    navn,
    kort: kortlaegning,
    tilEngelsk(da) {
      if (!tilEngelskKort.has(da)) {
        throw new Error(`db/ordbog.mjs: "${navn}" har ingen engelsk oversaettelse for dansk "${da}".`);
      }
      return tilEngelskKort.get(da);
    },
    tilDansk(en) {
      if (!tilDanskKort.has(en)) {
        throw new Error(`db/ordbog.mjs: "${navn}" har ingen dansk tilbageoversaettelse for engelsk "${en}".`);
      }
      return tilDanskKort.get(en);
    },
    danske() { return [...tilEngelskKort.keys()]; },
    engelske() { return [...tilDanskKort.keys()]; },
  };
}

/* ============================================================
   1. TABELLER — 7 i den levende DB (Å115/Å116), 6 overlever ind i den
   engelske skema.sql. `synk_aftryk` er den syvende: L81-L83's punkt 5
   ("den ene retning lukkes") dropper den strukturelt, fordi den mekanisme
   den vagtede (`db/migrer.mjs --til-db`s skrive-vej) selv forsvinder — der
   findes derfor intet engelsk navn at give den. Den staar i
   TABELLER_FJERNET, IKKE i TABELLER, saa test 63b's bijektion mod den NYE
   skema.sql (som ikke laengere har tabellen) forbliver ren, samtidig med at
   ordbogen dokumenterer alle 7, briefets punkt 1 selv taeller.
   ============================================================ */
export const TABELLER = lavOrdbog({
  robotter: 'robots',
  feltposter: 'field_entries',
  feltpost_varianter: 'field_entry_variants',
  anvendelse: 'applications',
  billede: 'images',
  feltdefinitioner: 'field_definitions',
}, 'TABELLER');

export const TABELLER_FJERNET = ['synk_aftryk'];

/* ============================================================
   2. KOLONNER — FLAD ordbog: ét dansk kolonnenavn, ét engelsk navn, samme
   oversaettelse UANSET hvilken af de 6 tabeller det staar i (fx "kilde" er
   altid "source", hvad enten det er feltposter.kilde, anvendelse.kilde eller
   billede.kilde — det er samme begreb, en URL). 61 noegler: de 64 distinkte
   kolonnenavne i den levende DB (78 kolonneFOREKOMSTER paa tvaers af 7
   tabeller, jf. STATUS.md Å115/Å116 og briefets facit-tal), minus de TRE
   noegler, der KUN findes paa synk_aftryk (aftryk, robotantal, opdateret) —
   de staar i KOLONNER_FJERNET, af samme grund som TABELLER_FJERNET ovenfor.
   ============================================================ */
export const KOLONNER = lavOrdbog({
  // feltdefinitioner
  feltnavn: 'field_name',
  gruppe: 'group',
  art: 'kind',
  dimension: 'dimension',
  ogsaa_dimension: 'secondary_dimension',
  kraever_ved_last: 'requires_load_condition',
  d4_beroert: 'd4_affected',
  katalogfelt: 'catalog_field',
  filterfelt: 'filter_field',
  // robotter (id, slug, navn, ... — identitet)
  id: 'id',
  slug: 'slug',
  navn: 'name',
  producent: 'manufacturer',
  producentland: 'manufacturer_country',
  producentby: 'manufacturer_city',
  status: 'status',
  fremdrift: 'propulsion',
  foerste_udgivelse: 'first_released',
  forgaenger_robot_id: 'predecessor_robot_id',
  varianter: 'variants',
  noter: 'notes',
  noter_ordlyd: 'notes_wording',
  // feltposter
  robot_id: 'robot_id',
  form: 'form',
  tilstand: 'state',
  vaerdi_tal: 'value_number',
  min: 'minimum',
  maks: 'maximum',
  vaerdi_tekst: 'value_text',
  vaerdi_bool: 'value_bool',
  vaerdi_liste: 'value_list',
  enhed: 'unit',
  enhed_imperial: 'imperial_unit',
  vaerdi_imperial: 'imperial_value',
  operator: 'operator',
  kilde: 'source',
  hentet: 'retrieved',
  kildetype: 'source_type',
  advarsel: 'caveat',
  advarsel_klasse: 'caveat_class',
  advarsel_ordlyd: 'caveat_wording',
  note: 'note',
  raa: 'raw',
  valuta: 'currency',
  ved_last_tilstand: 'load_state',
  ved_last_vaerdi: 'load_value',
  ved_last_enhed: 'load_unit',
  // feltpost_varianter
  variant_navn: 'variant_name',
  vaerdi: 'value',
  // anvendelse
  er_bar_streng: 'is_bare_string',
  er_ikke_oplyst: 'is_undisclosed',
  citat: 'quote',
  citat_ordlyd: 'quote_wording',
  arvet_fra_robot_id: 'inherited_from_robot_id',
  note_ordlyd: 'note_wording',
  // billede
  fil: 'file',
  ophav: 'provenance',
  alt: 'alt',
  delt_med_robot_id: 'shared_with_robot_id',
  plade: 'plate',
  pos: 'position',
}, 'KOLONNER');

export const KOLONNER_FJERNET = {
  aftryk: 'kun synk_aftryk (fjernet, se TABELLER_FJERNET)',
  robotantal: 'kun synk_aftryk (fjernet, se TABELLER_FJERNET)',
  opdateret: 'kun synk_aftryk (fjernet, se TABELLER_FJERNET)',
};

/* ============================================================
   3. ENUM-TYPER — alle 7, ingen fjernes (kun synk_aftryk som TABEL forsvinder,
   ikke nogen af enum-typerne — alle syv bruges stadig af de 6 overlevende
   tabeller).
   ============================================================ */
export const ENUM_TYPER = lavOrdbog({
  tilstand_enum: 'state_enum',
  status_enum: 'status_enum',
  kildetype_enum: 'source_type_enum',
  operator_enum: 'operator_enum',
  ophav_enum: 'provenance_enum',
  feltform_enum: 'field_form_enum',
  feltnavn_enum: 'field_name_enum',
}, 'ENUM_TYPER');

/* ============================================================
   4. ENUM-LABELS — én ordbog PR. enum-type (danske label -> engelsk label).
   Nøglerne i ENUM_LABELS er de DANSKE enum-typenavne (samme som ENUM_TYPER's
   venstre side), så et opslag altid går "hvilken enum" -> "hvilket ordbog".
   ============================================================ */
export const ENUM_LABELS = {
  // HAARD BEGRAENSNING 5: disse tre + tallet 0 (som slet ikke er et
  // enum-medlem, se skema.sql's egen kommentar ved tilstand_enum) skal
  // forblive fire forskellige ord. undisclosed / no / image_only er alle
  // indbyrdes forskellige og forskellige fra "0"/"zero".
  tilstand_enum: lavOrdbog({
    ikke_oplyst: 'undisclosed',
    nej: 'no',
    kun_billede: 'image_only',
  }, 'ENUM_LABELS.tilstand_enum'),
  status_enum: lavOrdbog({
    i_produktion: 'in_production',
    annonceret: 'announced',
    udgaaet: 'discontinued',
    demonstrator: 'demonstrator',
  }, 'ENUM_LABELS.status_enum'),
  kildetype_enum: lavOrdbog({
    primaer: 'primary',
    sekundaer: 'secondary',
  }, 'ENUM_LABELS.kildetype_enum'),
  // Symboler, ikke danske ord — sprogneutrale, oversaettes ikke. Identitet
  // her betyder "ingen ALTER TYPE ... RENAME VALUE for denne enum", som
  // byg-migrering.mjs's logik selv laeser ud af, at tilEngelsk(x) === x.
  operator_enum: lavOrdbog({
    '>': '>',
    '>=': '>=',
    '<': '<',
    '<=': '<=',
    '~': '~',
    '±': '±',
  }, 'ENUM_LABELS.operator_enum'),
  ophav_enum: lavOrdbog({
    eget_foto: 'own_photo',
    silhuet: 'silhouette',
    fabrikant: 'manufacturer',
  }, 'ENUM_LABELS.ophav_enum'),
  feltform_enum: lavOrdbog({
    bare_tilstand: 'bare_state',
    tilstand_med_herkomst: 'state_with_provenance',
    tal: 'number',
    interval: 'interval',
    tekst: 'text',
    bool: 'bool',
    liste: 'list',
  }, 'ENUM_LABELS.feltform_enum'),
  // De 33 feltnavne (tools/skema.mjs's FELTER, jf. briefets facit-tal).
  // Betydningen er hentet fra skema.mjs's kommentarer ved hvert felt, ikke
  // fra en gaetning paa det danske ord alene — se filens toptekst for
  // "egenvaegt" som det konkrete eksempel, briefet selv advarer om.
  feltnavn_enum: lavOrdbog({
    egenvaegt: 'weight',
    laengde: 'length',
    bredde: 'width',
    hoejde: 'height',
    frihedsgrader: 'degrees_of_freedom',
    nyttelast_gaaende: 'payload_walking',
    nyttelast_staaende: 'payload_standing',
    hastighed: 'speed',
    haeldning: 'incline',
    forhindring_enkelt: 'obstacle_single',
    trappetrin_kontinuerlig: 'stair_step_continuous',
    ip_klasse: 'ip_rating',
    temp_min: 'temperature_min',
    temp_maks: 'temperature_max',
    batteri_wh: 'battery_wh',
    driftstid: 'runtime',
    hot_swap: 'hot_swap',
    ladetid: 'charging_time',
    dockingstation: 'docking_station',
    lidar: 'lidar',
    kameraer: 'cameras',
    compute: 'compute',
    ros2: 'ros2',
    sdk_sprog: 'sdk_languages',
    autonominiveau: 'autonomy_level',
    monteringsinterface: 'mounting_interface',
    stroem_ud: 'power_output',
    dataporte: 'data_ports',
    pris: 'price',
    ce_oplyst: 'ce_disclosed',
    fcc_oplyst: 'fcc_disclosed',
    ul_oplyst: 'ul_disclosed',
    ccc_oplyst: 'ccc_disclosed',
  }, 'ENUM_LABELS.feltnavn_enum'),
};

/* ============================================================
   5. DATA-VAERDIER — opremsede, ikke-fri-tekst-vaerdier, der IKKE er
   enum-medlemmer i Postgres-forstand (CHECK-baaret eller blot konventionel),
   men som stadig er "et lukket saet ord", jf. briefets punkt 1. Oversaettes
   via en UPDATE pr. vaerdi i migreringen (byg-migrering.mjs), IKKE via
   ALTER TYPE ... RENAME VALUE. IKKE en del af test 63b's skema.sql-bijektion
   (det er hverken tabel-, kolonne- eller enum-identifikatorer, kun literals),
   men committes her alligevel, jf. briefets punkt 1's fulde taelling.
   ============================================================ */
export const DATA_VAERDIER = {
  // robotter.producentland — 8 distinkte, maalt i data/robots/*.yaml.
  producentland: lavOrdbog({
    Kina: 'China',
    USA: 'USA',
    Schweiz: 'Switzerland',
    Indien: 'India',
    Sydkorea: 'South Korea',
    Polen: 'Poland',
    Tyskland: 'Germany',
    Spanien: 'Spain',
  }, 'DATA_VAERDIER.producentland'),
  // robotter.fremdrift — CHECK (fremdrift in ('ben','ben_hjul')), IKKE en
  // enum-type (samme begrundelse som skema.sql's egen kommentar ved
  // kolonnen: to lukkede vaerdier uden for feltnavn_enum).
  fremdrift: lavOrdbog({
    ben: 'legged',
    ben_hjul: 'legged_wheeled',
  }, 'DATA_VAERDIER.fremdrift'),
  // anvendelse.vaerdi — ANVENDELSE_VAERDIER i tools/skema.mjs, de 7 kategorier
  // producenten selv kan placere en robot i (R16).
  anvendelse_vaerdi: lavOrdbog({
    industri: 'industrial',
    inspektion: 'inspection',
    sikkerhed_overvaagning: 'security_surveillance',
    forskning_udvikling: 'research_development',
    forbruger_uddannelse: 'consumer_education',
    forsvar_beredskab: 'defense_emergency_response',
    logistik: 'logistics',
  }, 'DATA_VAERDIER.anvendelse_vaerdi'),
};

/* ============================================================
   6. FELTDEFINITIONERS ETIKETTER — feltdefinitioner.gruppe/art/dimension er
   FRI TEKST (ikke enum-typer, se skema.sql's egen begrundelse: undgaar endnu
   en ALTER TYPE-koreografi for vaerdier, der sjaeldent aendrer sig), men
   trukket af et LUKKET saet i tools/skema.mjs (GRUPPER, arterne 'tal'|'jaNej'|
   'tekst'|'liste'|'ip', og de dimensioner FELTER's `type`/`ogsaaType` bruger)
   — briefets "feltdefinitioners gruppe/art/dimension-etiketter".
   ============================================================ */
export const FELTGRUPPER = lavOrdbog({
  // 'eu': gruppen daekker i praksis regulatorisk/certificering bredt (CE,
  // FCC, UL, CCC), ikke kun EU — tools/skema.mjs's egen kommentar ved
  // fcc_oplyst navngiver uoverensstemmelsen eksplicit. "regulatory" er den
  // engelske etikette, der matcher hvad gruppen RENT FAKTISK daekker i dag,
  // ikke det historiske navn.
  fysik: 'physics',
  energi: 'energy',
  sensorik: 'sensing',
  nyttelast: 'payload',
  kommercielt: 'commercial',
  eu: 'regulatory',
}, 'FELTGRUPPER');

export const FELTARTER = lavOrdbog({
  tal: 'number',
  jaNej: 'yes_no',
  tekst: 'text',
  liste: 'list',
  ip: 'ip',
}, 'FELTARTER');

export const FELTDIMENSIONER = lavOrdbog({
  masse: 'mass',
  laengde: 'length',
  antal: 'count',
  hastighed: 'speed',
  vinkel: 'angle',
  stigning: 'grade',
  temperatur: 'temperature',
  energi: 'energy',
  tid: 'time',
  valuta: 'currency',
}, 'FELTDIMENSIONER');

/* ============================================================
   7. SELVTJEK — koeres ved import (samme princip som db/migrer.mjs's
   tjekEnumDrift): lavOrdbog() har allerede sikret, at HVER kortlaegning for
   sig er 1:1. Denne funktion beviser derudover, at kortlaegningerne
   TILSAMMEN daekker de tal, briefet selv angiver som facit (punkt 9:
   78 kolonner, 7 enums, 33 feltnavne osv.) — kaldes af test 63, ikke
   automatisk ved import (importet skal ikke kunne fejle på et tal, testen
   selv efterproever).
   ============================================================ */
export function tael() {
  return {
    tabeller: TABELLER.danske().length,
    tabellerFjernet: TABELLER_FJERNET.length,
    kolonner: KOLONNER.danske().length,
    kolonnerFjernet: Object.keys(KOLONNER_FJERNET).length,
    enumTyper: ENUM_TYPER.danske().length,
    enumLabelsIAlt: Object.values(ENUM_LABELS).reduce((sum, o) => sum + o.danske().length, 0),
    feltnavne: ENUM_LABELS.feltnavn_enum.danske().length,
  };
}
