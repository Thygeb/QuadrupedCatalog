/**
 * fund/f2galileo-oversaettelser-yuejia.mjs — mine (spor/f2-galileo genoptagelsens)
 * engelske oversaettelser for Yuejia Lingdongs 4 robotter, klassificeret og
 * oversat efter L87 (BRIEF-FAELLES.md) og OPSKRIFT-fase2-cjk.md's kasser.
 *
 * Hver caveat_wording er reduceret til KUN kildens ord (den citat-del, der
 * direkte understoetter den skrevne vaerdi); resten af den tidligere danske
 * saetning er oversat til engelsk prosa i caveat. Verificeret mod
 * media/_kilder/raa-kand4-2026-08-25/yuejialingdong-yj-{56,57,58,59}-2026-08-25.html
 * (se fund/FUND-f2galileo.md for detaljer og robot_id -> side-mapping).
 */

export const FIELD_ENTRIES = {
  2254: { // yuejia-yj30
    payload_walking: {
      caveat: "The manufacturer states only the payload figure, without saying whether it is walking or standing payload - the same situation as the Unitree Go2 (see the top note). Placement under walking payload is a cautious estimate based on the order of magnitude, NOT a reading.",
      caveat_wording: "负载: 10kg",
    },
    speed: {
      caveat: "Maximum speed - a single figure, not a range.",
      caveat_wording: "最大速度: 3m/s",
    },
    slope: {
      caveat: "From the merged column (climb angle/DOF) - see the top note. 50 deg is the climb angle, not DOF.",
      caveat_wording: "爬坡角度/DOF",
    },
    stair_step_continuous: {
      caveat: "Climbable step height - '台阶' means step/stair, interpreted here as continuous stair-climbing, not a single obstacle.",
      caveat_wording: "攀爬台阶高度: 20cm",
    },
    weight: {
      caveat: "In the '基础参数' (basic parameters) table. No '约' (approx.) marker; no indication of with/without battery.",
      caveat_wording: "重量: 17.5kg",
    },
    length: {
      caveat: "The source's own unit notation is missing an 'm' (see the top note). The axis order (length first) is explicitly labelled by the manufacturer in the column heading '站立尺寸' (standing dimensions).",
      caveat_wording: "站立尺寸: 682×354×462m",
    },
    height: {
      caveat: "See the top note on the missing 'm' in the source's '462m'.",
      // no caveat_wording (kasse B - no direct citation, only a cross-reference)
    },
    runtime: {
      caveat: "In the base value. The same cell separately mentions '3h (Dual Battery)' - an extra accessory-dependent configuration with a different battery setup, not used as the main value (see the top note). No load condition (kg) is disclosed for either figure.",
      caveat_wording: "续航: 1.5-2h",
    },
    autonomy_level: {
      caveat: "Six yes/no rows from the '基础参数' (basic parameters) table, all set to '有' (yes) for the YJ30. A qualitative list, not a level on a scale.",
      caveat_wording: "有",
    },
    price: {
      caveat: "Next to a '立即购买' (buy now) button on the manufacturer's own page.",
      caveat_wording: "￥78000.00",
    },
  },
  2255: { // yuejia-yj30-max
    weight: { caveat: "In the '基础参数' (basic parameters) table.", caveat_wording: "重量: 45kg" },
    length: { caveat: "Standing dimensions.", caveat_wording: "站立尺寸: 896x635x530mm" },
    payload_walking: { caveat: "Dynamic/walking load - an explicitly named field, not an estimate (see the top note).", caveat_wording: "动态负载: 30kg" },
    payload_standing: { caveat: "Static/standing load - an explicitly named field.", caveat_wording: "静态负载: 50kg" },
    speed: { caveat: "Speed - a single figure, not a range.", caveat_wording: "速度: 3m/s" },
    slope: { caveat: "Its own column, without the DOF merge (see the top note).", caveat_wording: "爬坡角度: 50°" },
    stair_step_continuous: { caveat: "Climbable step height.", caveat_wording: "攀爬台阶高度: 30cm" },
    runtime: { caveat: "No load condition (kg) disclosed.", caveat_wording: "续航: 3-4h" },
    autonomy_level: {
      caveat: "Five yes/no rows from the '基础参数' (basic parameters) table - one row fewer than the YJ30's table (no '跟随' (follow) item here).",
      caveat_wording: "跟随",
    },
    price: { caveat: "Next to a '立即购买' (buy now) button.", caveat_wording: "￥288000.00" },
  },
  2256: { // yuejia-yj30-max-w
    weight: { caveat: "In the '基础参数' (basic parameters) table.", caveat_wording: "重量: 55kg" },
    length: { caveat: "Standing dimensions.", caveat_wording: "站立尺寸: 896x635×625mm" },
    payload_walking: { caveat: "Dynamic/walking load - an explicitly named field.", caveat_wording: "动态负载: 35kg" },
    payload_standing: { caveat: "Static/standing load - an explicitly named field.", caveat_wording: "静态负载: 55kg" },
    speed: { caveat: "Speed - higher than the YJ30Max's 3m/s, as expected for a wheeled variant.", caveat_wording: "速度: 5m/s" },
    slope: { caveat: "Climb angle - its own column, without the DOF merge.", caveat_wording: "爬坡角度: 50°" },
    stair_step_continuous: { caveat: "See the top note on the column name shared with the base YJ30Max version (30cm).", caveat_wording: "攀爬台阶高度: 80cm" },
    runtime: { caveat: "No load condition (kg) disclosed.", caveat_wording: "续航: 3.5-4.5h" },
    cameras: {
      caveat: "Integrated triple detection technology: infrared thermal imaging, high-sensitivity UV light recognition, visible-light smoke/fire recognition - identical text to the YJ30 W's entry. No model designation or resolution disclosed.",
      caveat_wording: "集成红外热成像、高灵敏度UV光识别、可见光烟火识别三重探测技术",
    },
    autonomy_level: {
      caveat: "Combines the table's five yes/no rows (same pattern as the YJ30Max, no '跟随' (follow) item) with the product description's extra communication and data-analysis features.",
      caveat_wording: "跟随",
    },
    price: { caveat: "Next to a '立即购买' (buy now) button - the highest Yuejia price in the catalogue.", caveat_wording: "￥358000.00" },
  },
  2257: { // yuejia-yj30-w
    weight: { caveat: "In the '基础参数' (basic parameters) table.", caveat_wording: "重量: 20kg" },
    length: { caveat: "Standing dimensions.", caveat_wording: "站立尺寸: 682×354×532mm" },
    payload_walking: {
      caveat: "The manufacturer states only the payload figure, without a walking/standing distinction (see the top note). A cautious estimate, not a reading.",
      caveat_wording: "负载: 12kg",
    },
    speed: { caveat: "Maximum speed - higher than the walking YJ30's 3m/s, as expected for a wheeled variant.", caveat_wording: "最大速度: 5m/s" },
    slope: { caveat: "From the same merged column (climb angle/DOF) as the YJ30, same caveat as in the YJ30's own entry.", caveat_wording: "爬坡角度/DOF" },
    stair_step_continuous: { caveat: "See the top note on the column name shared with the base YJ30 version (20cm).", caveat_wording: "攀爬台阶高度: 60cm" },
    runtime: {
      caveat: "In the base value. The same cell separately mentions '3.5~4h (Dual Battery)' - an extra accessory-dependent configuration, not used as the main value. No load condition (kg) disclosed.",
      caveat_wording: "续航: 1.5-2h",
    },
    cameras: {
      caveat: "Integrated triple detection technology: infrared thermal imaging, high-sensitivity UV light recognition, visible-light smoke/fire recognition - three named detection technologies, specific to this fire-inspection variant. No model designation or resolution disclosed for any of the three.",
      caveat_wording: "集成红外热成像、高灵敏度UV光识别、可见光烟火识别三重探测技术",
    },
    autonomy_level: {
      caveat: "Combines the table's six yes/no rows (same pattern as the YJ30) with the product description's extra communication and data-analysis features specific to the fire-inspection variant.",
      caveat_wording: null, // kasse B efter split: original quoted kun "基础参数" (kontekst -> caveat), ingen selvstaendig vaerdi-citat tilbage
    },
    price: { caveat: "Next to a '立即购买' (buy now) button.", caveat_wording: "￥88000.00" },
  },
};

export const APPLICATIONS = {
  2254: {
    note: "The first quote is the YJ30's own product description (same page). Our own translation: (education/research) -> research and development; (patrol/inspection) -> inspection; (emergency response/rescue) -> defense and emergency response. The other two quotes are from the page's shared section (the same three cards appear identically on all four YJ30-series product pages): (police patrol) -> security and surveillance. A third card (power-line inspection) is excluded from the quote list, since it only repeats inspection.",
    note_wording: "教学科研 | 巡逻巡检 | 应急救援 | 行业应用 | 警用巡逻 | 电力巡检",
    // quote[0]/quote_wording[0] IKKE roert - se FUND-rapportens "Nye fælder" (garbled praeeksisterende fragment, ikke dansk)
    quote: [undefined, "Industry and security inspection", "Police patrol"],
    quote_wording: [undefined, "工业、安防巡检领域", "警用巡逻"],
  },
  2255: {
    note: "The first quote is the YJ30Max's own product description (same page). Our own translation: (industry inspection) -> inspection; (fire-emergency response) -> defense and emergency response; (work in complex environments) -> industry. The other two quotes are from the page's shared section (the same three cards appear identically on all four YJ30-series product pages): (police patrol) -> security and surveillance. The card (power-line inspection) is excluded, since it only repeats inspection.",
    note_wording: "工业巡检 | 消防应急 | 复杂环境作业 | 行业应用 | 警用巡逻 | 电力巡检",
    quote: [undefined, "Industry and security inspection", "Police patrol"],
    quote_wording: [undefined, "工业、安防巡检领域", "警用巡逻"],
  },
  2256: {
    note: "Identical product description to the YJ30 W (same paragraph, same pattern - this is the large version). Our own translation: see the YJ30 W's note for the full rationale. '仓储' (warehousing) is, for the same reason, NOT counted as a separate logistics category.",
    note_wording: "仓储",
    quote: [undefined, "Industry and security inspection", "Police patrol"],
    quote_wording: [undefined, "工业、安防巡检领域", "警用巡逻"],
  },
  2257: {
    note: "The first quote is the YJ30 W's own product description (same page). Our own translation: (multispectral fire detection/warning) -> defense and emergency response; (autonomous mobile inspection/patrol) -> inspection; -> industry; -> research and development. (warehousing/logistics) is NOT included as a logistics category here, since it appears only in a list of possible deployment environments, not as a standalone application category alongside the others - a more cautious reading than the broadest possible one. The last two quotes are from the page's shared section: -> security and surveillance.",
    note_wording: "多光谱火情探测/火情预警 | 自主移动巡检/自主巡逻 | 工业 | 科研 | 仓储 | 行业应用 | 警用巡逻",
    quote: [undefined, "Industry and security inspection", "Police patrol"],
    quote_wording: [undefined, "工业、安防巡检领域", "警用巡逻"],
  },
};

export const ROBOTS = {
  2254: {
    notes: [
      "STANDING-DIMENSIONS TYPO IN THE SOURCE: the row reads '682×354×462m' - missing an 'm' in 'mm', unlike all other rows in the same table (e.g. the YJ30W's '682×354×532mm'), including in the English-language version of the page (the same typo is repeated there: '682 × 354 × 462m'). Assessed as a source-page typing error, not a unit of meters - 462 m in height would be absurd for a 17.5 kg quadruped robot. The unit is set to mm.",
      "MERGED COLUMN HEADING: the table's raw HTML has the heading (climb angle/DOF) as ONE column, but only ONE value (50 deg) in the data row. Since 50 deg carries the degree sign, it is the climb angle; the DOF figure is not filled in at all in the source. degrees_of_freedom is therefore not disclosed, not guessed to be the same figure.",
      "DUAL-BATTERY RUNTIME NOT USED AS THE MAIN VALUE: the table shows '1.5-2h' in the runtime row itself, and separately in the same cell (line break) '3h (Dual Battery)' - an accessory-dependent extended configuration. The main value is 1.5-2 hours; the dual-battery figure of 3h is stated in the caveat, not in value/max.",
      "LIDAR NOT FILLED IN: the product-feature text mentions (multimodal sensor matrix: laser-vision synergy), which hints at some form of laser/LiDAR - but the table itself (the structured specification table) has NO lidar row at all. The field is therefore not disclosed, not inferred from the marketing text - the same principle as GENISOM L2's handling of a similar mismatch between prose and table.",
    ],
    notes_wording: [
      "", // uaendret (allerede tomt i DB, kasse B)
      "爬坡角度/DOF",
      "", // uaendret (allerede tomt i DB, kasse B)
      "多模态感知矩阵：激光视觉协同",
    ],
  },
  2255: {
    notes: [
      "SAME MERGED-COLUMN PATTERN AS THE YJ30 FOR SLOPE: here the column is simply named (climb angle) without the '/DOF' addition - DOF is therefore not mentioned anywhere on the YJ30Max's page at all, not just omitted from a merged column. degrees_of_freedom is not disclosed.",
      "LIDAR NOT FILLED IN: same situation as the YJ30 - no lidar row in the '基础参数' (basic parameters) table.",
    ],
    notes_wording: [
      "爬坡角度",
      "", // kun "基础参数" var citeret, flyttet til notes som kontekst - ingen selvstaendig ordlyd tilbage
    ],
  },
  2256: {
    notes: [
      "MULTISPECTRAL SENSOR PACKAGE (cameras): identical text to the YJ30 W - see its entry for the full citation.",
    ],
    notes_wording: null, // uaendret (allerede null i DB)
  },
  2257: {
    notes: [
      "MULTISPECTRAL SENSOR PACKAGE (cameras) IS EXPLICIT HERE, UNLIKE THE YJ30/YJ30Max: the product text mentions three named detection technologies specific to this (and the YJ30 Max W's) fire-inspection variant - see the cameras field.",
    ],
    notes_wording: null, // uaendret (allerede null i DB)
  },
};
