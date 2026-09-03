/**
 * fund/f2galileo-oversaettelser-galileo.mjs — mine engelske oversaettelser
 * for Galileo (Tianjin)s 6 robotter. KUN citatkolonnerne mangler her
 * (caveat/caveat_wording/notes er allerede engelske, skrevet af forgaengeren
 * og efterproevet af orkestratoren - roeres IKKE).
 *
 * applications.quote/quote_wording er IDENTISK paa tvaers af alle 6
 * robotter (fælles side 4 i PDF-manualen, foer variant-opdelingen - jf.
 * forgaengerens egen note: "Samme citat er brugt uafhaengigt paa alle seks
 * Galileo-poster ... fordi det er familiesiden, der ligger foer
 * variant-opdelingen"). Derfor ÉN faelles tabel her, brugt for alle 6.
 *
 * VIGTIGT FUND (se FUND-rapporten): `pdftotext` paa denne maskine
 * ekstraherer 0 kinesiske tegn fra galileo-wrc-product-manual-2025.pdf
 * (checket: 0 forekomster af "重量", som ellers indgaar i allerede skrevne,
 * efterproevede caveat_wording-celler for samme PDF). Ingen PDF->billede-
 * konvertering var tilgaengelig (pdftoppm/ghostscript/imagemagick mangler
 * alle). Jeg kunne derfor IKKE selv genlaese PDF'en og uafhaengigt
 * bekraefte disse kinesiske fragmenter mod kilden - de er UAeNDREDE UDTRAeK
 * af tekst, der allerede laa i DB'en (skrevet af en tidligere indsamling,
 * ikke af mig), blot flyttet fra parentes til rent felt. Se FUND-rapporten.
 */

export const QUOTE_DA_TO_EN = [
  "Security patrol in public spaces such as airports, train stations, and residential areas",
  "Reconnaissance and search at disasters such as earthquakes, rubble, and dikes",
  "Patrol at borders or special areas, guard posts, and investigation for armed anti-terrorism, explosive clearance, and other emergency incidents",
  "Security inspection in factories, industrial parks, and ports",
  "Intelligent inspection and data collection of high-risk industrial equipment",
  "Intelligent inspection of toxic industrial areas and other priority zones",
];

// RETTET efter briefets afsnit 7: quote_wording blander vores indledning
// (den oversatte tekst) med kildens ord (parentesen) - oversaettes PAA
// PLADS, strukturen (oversaettelse + kildeparentes) omstruktureres IKKE.
export const QUOTE_WORDING_ZH = [
  "Security patrol in public spaces such as airports, train stations, and residential areas (机场/车站/社区等公共场所安保巡逻)",
  "Reconnaissance and search at disasters such as earthquakes, rubble, and dikes (地震/废墟/河堤等灾害应急救援侦查搜索)",
  "Patrol at borders or special areas, guard posts, and investigation for armed anti-terrorism, explosive clearance, and other emergency incidents (边境或特殊区域治安巡逻、岗哨及武装反恐、防爆等突发事件勘察)",
  "Security inspection in factories, industrial parks, and ports (工厂/园区/港口等场景安防巡检)",
  "Intelligent inspection and data collection of high-risk industrial equipment (高风险工业设备智能巡检与数据采集)",
  "Intelligent inspection of toxic industrial areas and other priority zones (工业有毒及重点区域的智能巡检)",
];

// De 6 robot_id'er - samme quote/quote_wording-par for alle.
export const GALILEO_ROBOT_IDS = [2199, 2200, 2201, 2202, 2203, 2204];

// KUN galileo-c1 (2199) har en udfyldt applications.note_wording (dansk).
// De oevrige 5 har allerede null der (forgaengeren efterlod den saadan).
// RETTET efter briefets afsnit 7 (se ovenfor): struktur bevaret, kun den
// danske del oversat paa plads.
export const NOTE_WORDING_C1 = "From the manual's page 4 (\"应用场景\"), BEFORE the model-specific technical parameter tables (pages 7-9). The text appears under the heading \"智能仿生四足机器人\" (the generic family name, the same name C1 itself carries) and does not name C1 specifically - it covers the whole C1/E1/S1 series as a product category. Our own translation: 安保巡逻 (security patrol) -> security and surveillance; 应急救援/武装反恐/防爆 (emergency response/anti-terror/explosive clearance) -> defense and emergency response; 安防巡检/智能巡检 (security/intelligent inspection) -> inspection. The same quote is used independently on all six Galileo entries (C1/C1-W/E1/E1-W/S1/S1-W), NOT via inherited_from, because it is the family page that precedes the variant split - same principle as GENISOM Gangben L2-W's note about citing the shared source independently.";
