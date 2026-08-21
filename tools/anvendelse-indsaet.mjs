#!/usr/bin/env node
/**
 * tools/anvendelse-indsaet.mjs — engangsvaerktoej.
 *
 * Skriver topnoeglen "anvendelse:" ind i data/robots/*.yaml lige efter "status:".
 * Tabellen nedenfor er indsamlingens resultat: hver raekke baerer producentens
 * ORDRETTE ord og den fil, ordene blev laest i. Ingen raekke er udledt af, hvordan
 * robotten ser ud, hvor tung den er eller hvad den koster — kan producenten ikke
 * citeres, staar der ikke_oplyst.
 *
 * Feltet "fil" bruges IKKE af generatoren. Den staar her, fordi
 * tools/efterproev-anvendelse.mjs slaar hvert eneste citat op i den gemte raafil
 * og fejler, hvis det ikke staar der ordret. Uden den kolonne ville citaterne
 * kun kunne efterproeves i haanden.
 *
 *   node tools/anvendelse-indsaet.mjs            skriver
 *   node tools/anvendelse-indsaet.mjs --toer     viser kun hvad der ville ske
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

export const KILDEROD = 'C:/Praktik/websites/udstilling/media/_kilder';

/**
 * vaerdi:  streng eller liste. USORTERET MAENGDE (L27) - raekkefoelgen betyder intet.
 * arvet_fra: moderens slug, naar citatet er moderens og ikke variantens (L23, R17).
 * citat:   streng eller liste. Ordret, uden vores omskrivning.
 * fil:     den gemte raafil, citatet er laest i (relativ til KILDEROD).
 * note:    hvad citatet IKKE daekker. Med vilje kort.
 */
export const TABEL = {

  /* ---------------- Unitree ---------------------------------------------
     Producentens hovednavigation deler robothundene i praecis to grupper.
     Den engelske skriver "Robot - Consumer/Education" og "Robot - Industry";
     den kinesiske skriver "机器狗 - 消费级 / 科研" (forbruger / videnskabelig
     forskning) og "机器狗 - 行业级" (brancheniveau). De to sprogversioner er
     ikke enige om den foerste gruppe: EN siger uddannelse, CN siger forskning.
     Begge foeres, fordi valget mellem dem ville vaere vores.                 */

  'unitree-a1': {
    vaerdi: ['forbruger_uddannelse', 'forskning_udvikling'],
    citat: ['Robot - Consumer/Education', '机器狗 - 消费级 / 科研'],
    kilde: 'https://www.unitree.com/',
    hentet: '2026-08-19',
    fil: ['raa-kina-unitree-2026-08-19/unitree-forside-nav-2026-08-19.html',
      'raa-felt-eu-2026-08-19/unitree-forside-cn-2026-08-19.html'],
    note: 'Producentens egen produktnavigation, gruppen A1 staar i. Den engelske og '
      + 'den kinesiske navigation navngiver gruppen forskelligt: EN "Consumer/Education", '
      + 'CN "forbrugerniveau / videnskabelig forskning". Begge er producentens.',
  },
  'unitree-go1': {
    vaerdi: ['forbruger_uddannelse', 'forskning_udvikling'],
    citat: ['Robot - Consumer/Education', '机器狗 - 消费级 / 科研'],
    kilde: 'https://www.unitree.com/',
    hentet: '2026-08-19',
    fil: ['raa-kina-unitree-2026-08-19/unitree-forside-nav-2026-08-19.html',
      'raa-felt-eu-2026-08-19/unitree-forside-cn-2026-08-19.html'],
    note: 'Producentens egen produktnavigation, gruppen Go1 staar i.',
  },
  'unitree-go2': {
    vaerdi: ['forbruger_uddannelse', 'forskning_udvikling'],
    citat: ['Robot - Consumer/Education', '机器狗 - 消费级 / 科研'],
    kilde: 'https://www.unitree.com/',
    hentet: '2026-08-19',
    fil: ['raa-kina-unitree-2026-08-19/unitree-forside-nav-2026-08-19.html',
      'raa-felt-eu-2026-08-19/unitree-forside-cn-2026-08-19.html'],
    note: 'Producentens egen produktnavigation, gruppen Go2 staar i.',
  },
  'unitree-as2': {
    vaerdi: ['forbruger_uddannelse', 'forskning_udvikling'],
    citat: ['Robot - Consumer/Education', '机器狗 - 消费级 / 科研'],
    kilde: 'https://www.unitree.com/',
    hentet: '2026-08-19',
    fil: ['raa-kina-unitree-2026-08-19/unitree-forside-nav-2026-08-19.html',
      'raa-felt-eu-2026-08-19/unitree-forside-cn-2026-08-19.html'],
    note: 'Producentens egen produktnavigation, gruppen As2 staar i. MODSIGELSE: As2 '
      + 'staar under Consumer/Education i navigationen, men As2-produktsidens egen titel '
      + 'er "Unitree As2 Compact Size Industrial Capability". Producenten siger begge dele.',
  },
  'unitree-a2': {
    vaerdi: 'industri',
    citat: ['Robot - Industry', '机器狗 - 行业级'],
    kilde: 'https://www.unitree.com/',
    hentet: '2026-08-19',
    fil: ['raa-kina-unitree-2026-08-19/unitree-forside-nav-2026-08-19.html',
      'raa-felt-eu-2026-08-19/unitree-forside-cn-2026-08-19.html'],
    note: 'Producentens egen produktnavigation, gruppen A2 staar i.',
  },
  'unitree-b1': {
    vaerdi: 'industri',
    citat: ['Robot - Industry', '机器狗 - 行业级'],
    kilde: 'https://www.unitree.com/',
    hentet: '2026-08-19',
    fil: ['raa-kina-unitree-2026-08-19/unitree-forside-nav-2026-08-19.html',
      'raa-felt-eu-2026-08-19/unitree-forside-cn-2026-08-19.html'],
    note: 'Producentens egen produktnavigation, gruppen B1 staar i.',
  },
  'unitree-b2': {
    vaerdi: 'industri',
    citat: ['Robot - Industry', '机器狗 - 行业级'],
    kilde: 'https://www.unitree.com/',
    hentet: '2026-08-19',
    fil: ['raa-kina-unitree-2026-08-19/unitree-forside-nav-2026-08-19.html',
      'raa-felt-eu-2026-08-19/unitree-forside-cn-2026-08-19.html'],
    note: 'Producentens egen produktnavigation, gruppen B2 staar i.',
  },
  'unitree-aliengo': {
    vaerdi: 'industri',
    citat: ['Robot - Industry', '机器狗 - 行业级'],
    kilde: 'https://www.unitree.com/',
    hentet: '2026-08-19',
    fil: ['raa-kina-unitree-2026-08-19/unitree-forside-nav-2026-08-19.html',
      'raa-felt-eu-2026-08-19/unitree-forside-cn-2026-08-19.html'],
    note: 'Producentens egen produktnavigation, gruppen AlienGo staar i.',
  },

  /* W-varianterne staar IKKE i navigationen. Derfor kommer deres kategori fra
     deres egen produktside - eller slet ikke.                                */

  'unitree-a2-w': {
    vaerdi: ['inspektion', 'logistik', 'forsvar_beredskab'],
    citat: 'Suited for industrial inspection, park logistics, and emergency rescue and more.',
    kilde: 'https://www.unitree.com/A2-W',
    hentet: '2026-08-19',
    fil: 'raa-kina-unitree-2026-08-19/unitree-a2-w-produktside-2026-08-19.html',
    note: 'A2-W staar ikke i producentens produktnavigation, hvor A2 staar under '
      + '"Robot - Industry". Kategorien her er derfor produktsidens egen saetning, ikke '
      + 'navigationens gruppe. Samme side kalder robotten "Industrial-grade mobile platform" '
      + '- det er en byggekvalitet, ikke en anvendelse, og taeller ikke med.',
  },
  'unitree-as2-w': {
    vaerdi: ['inspektion', 'sikkerhed_overvaagning'],
    citat: 'ideal for security, inspection, and advanced applications.',
    kilde: 'https://www.unitree.com/As2-W',
    hentet: '2026-08-19',
    fil: 'raa-kina-unitree-2026-08-19/unitree-as2-w-produktside-2026-08-19.html',
    note: 'L22: producentens eget ord "security" i samme saetning er nu omsat til '
      + 'sikkerhed_overvaagning. Citatet er As2-W\'s egen produktside; As2-W staar ikke i '
      + 'produktnavigationen, saa der er intet arvet her.',
  },

  /* B2-W og Go2-W: ARVET (L23). Citatet kommer fra MODERENS raafil - navigationen -
     og ikke fra variantens egen side, som er gennemlaest uden fund. Derfor peger
     `fil` her paa navigationsfilerne: efterproev-anvendelse.mjs skal kunne finde
     citatet ORDRET der, hvor det staar.                                          */

  'unitree-b2-w': {
    vaerdi: 'industri',
    citat: ['Robot - Industry', '机器狗 - 行业级'],
    kilde: 'https://www.unitree.com/',
    hentet: '2026-08-19',
    arvet_fra: 'unitree-b2',
    fil: ['raa-kina-unitree-2026-08-19/unitree-forside-nav-2026-08-19.html',
      'raa-felt-eu-2026-08-19/unitree-forside-cn-2026-08-19.html'],
    note: 'ARVET (L23). B2-W staar ikke i produktnavigationen, og dens egen side '
      + 'https://www.unitree.com/b2-w er gennemlaest 2026-08-19 uden at naevne nogen '
      + 'anvendelse - kun "Go Further with Higher Efficiency" og "Brand New Intelligent '
      + 'Species". Citatet er B2s, og koblingen B2-W = B2 i hjulet udgave er vores '
      + 'slutning, ikke producentens.',
  },
  'unitree-go2-w': {
    vaerdi: ['forbruger_uddannelse', 'forskning_udvikling'],
    citat: ['Robot - Consumer/Education', '机器狗 - 消费级 / 科研'],
    kilde: 'https://www.unitree.com/',
    hentet: '2026-08-19',
    arvet_fra: 'unitree-go2',
    fil: ['raa-kina-unitree-2026-08-19/unitree-forside-nav-2026-08-19.html',
      'raa-felt-eu-2026-08-19/unitree-forside-cn-2026-08-19.html'],
    note: 'ARVET (L23). Go2-W staar ikke i produktnavigationen, og dens egen side '
      + 'https://www.unitree.com/go2-w er gennemlaest 2026-08-19 og siger kun '
      + '"Driving All Terrain" og "Go2 New Model Transformative Newborn". Citatet er '
      + 'Go2s, og koblingen Go2-W = Go2 i hjulet udgave er vores slutning, ikke producentens.',
  },

  /* ---------------- DEEP Robotics ---------------------------------------- */

  'deep-robotics-lite3': {
    vaerdi: ['forbruger_uddannelse', 'forskning_udvikling'],
    citat: '教育科研',
    kilde: 'https://www.deeprobotics.cn/robot/index/product1.html',
    hentet: '2026-08-19',
    fil: 'raa-kina-deep-magic-2026-08-19/deeprobotics-lite3-specside-cn-2026-08-19.html',
    note: 'Producentens kinesiske produktpanel saetter en etikette paa hver model. '
      + 'Lite3 faar "教育科研" (uddannelse og videnskabelig forskning), X20 og X30 faar '
      + '"行业应用" (brancheanvendelse). Den ENGELSKE Lite3-side siger intet om anvendelse '
      + 'overhovedet - kategorien findes kun paa den kinesiske.',
  },
  'deep-robotics-x20': {
    vaerdi: ['industri', 'inspektion'],
    citat: 'The X20 quadruped robot solution is for industrial patrol inspection under extreme working conditions.',
    kilde: 'https://deeprobotics.cn/en/index/product.html',
    hentet: '2026-08-19',
    fil: 'raa-kina-deep-magic-2026-08-19/deeprobotics-x20-specside-en-2026-08-19.html',
    note: 'Sidens titel siger det samme: "X20: The Ultimate Quadruped Bot series for '
      + 'Industrial Use". Producentens kinesiske produktpanel etiketterer X20 "行业应用".',
  },
  'deep-robotics-x30': {
    vaerdi: ['industri', 'inspektion', 'sikkerhed_overvaagning'],
    citat: 'X30 quadruped robot, a flagship product designed to meet core industry needs in multiple fields including inspection, investigation, security, surveying and mapping.',
    kilde: 'https://deeprobotics.cn/en/index/product3.html',
    hentet: '2026-08-19',
    fil: 'raa-kina-deep-magic-2026-08-19/deeprobotics-x30-specside-en-2026-08-19.html',
    note: 'L22: "security" er omsat til sikkerhed_overvaagning. "surveying and mapping" '
      + 'har det tilladte saet stadig ingen kategori for og er ikke omsat.',
  },
  'deep-robotics-x30-pro': {
    vaerdi: ['industri', 'inspektion', 'sikkerhed_overvaagning'],
    arvet_fra: 'deep-robotics-x30',
    citat: 'X30 quadruped robot, a flagship product designed to meet core industry needs in multiple fields including inspection, investigation, security, surveying and mapping.',
    kilde: 'https://deeprobotics.cn/en/index/product3.html',
    hentet: '2026-08-19',
    fil: 'raa-kina-deep-magic-2026-08-19/deeprobotics-x30-specside-en-2026-08-19.html',
    note: 'ARVET (L23). X30 Pro har ingen egen produktside; den staar som en variant paa '
      + 'X30-siden, og saetningen er skrevet om "X30 quadruped robot" - ikke om serien. '
      + 'At Proen er daekket, er derfor vores kobling, ikke producentens ord. '
      + 'L22: "security" er omsat til sikkerhed_overvaagning.',
  },
  'deep-robotics-lynx-m20': {
    vaerdi: ['industri', 'inspektion', 'forsvar_beredskab', 'logistik', 'forskning_udvikling'],
    citat: 'The LYNX M20 series represents the world’s first wheeled-legged robot built specifically for challenging terrains and hazardous environments during industrial operation. Featuring lightweight design with extreme-environment endurance, it conquers rugged mountain trails, muddy wetlands and debris-strewn ruins—pioneering embodied intelligence in power inspection, emergency response, logistics, and scientific exploration.',
    kilde: 'https://deeprobotics.cn/en/index/lynx.html',
    hentet: '2026-08-19',
    fil: 'raa-kina-deep-magic-2026-08-19/deeprobotics-lynx-m20-specside-en-2026-08-19.html',
    note: 'FEM kategorier i én saetning. Det er producentens egen opremsning, og de fem '
      + 'staar uden indbyrdes rangering (L27): robotten hoerer til i alle fem, ikke i '
      + 'den foerste.',
  },
  'deep-robotics-lynx-m20-pro': {
    vaerdi: ['industri', 'inspektion', 'forsvar_beredskab', 'logistik', 'forskning_udvikling'],
    citat: 'The LYNX M20 series represents the world’s first wheeled-legged robot built specifically for challenging terrains and hazardous environments during industrial operation. Featuring lightweight design with extreme-environment endurance, it conquers rugged mountain trails, muddy wetlands and debris-strewn ruins—pioneering embodied intelligence in power inspection, emergency response, logistics, and scientific exploration.',
    kilde: 'https://deeprobotics.cn/en/index/lynx.html',
    hentet: '2026-08-19',
    fil: 'raa-kina-deep-magic-2026-08-19/deeprobotics-lynx-m20-specside-en-2026-08-19.html',
    note: 'Producenten skriver om "The LYNX M20 series", og Pro er en variant i den serie.',
  },
  'deep-robotics-lynx-m20s': {
    vaerdi: ['industri', 'inspektion', 'forsvar_beredskab', 'logistik', 'forskning_udvikling'],
    citat: 'The LYNX M20 series represents the world’s first wheeled-legged robot built specifically for challenging terrains and hazardous environments during industrial operation. Featuring lightweight design with extreme-environment endurance, it conquers rugged mountain trails, muddy wetlands and debris-strewn ruins—pioneering embodied intelligence in power inspection, emergency response, logistics, and scientific exploration.',
    kilde: 'https://deeprobotics.cn/en/index/lynx.html',
    hentet: '2026-08-19',
    fil: 'raa-kina-deep-magic-2026-08-19/deeprobotics-lynx-m20-specside-en-2026-08-19.html',
    note: 'Producenten skriver om "The LYNX M20 series", og M20S er en variant i den serie.',
  },
  'deep-robotics-lynx-s10': {
    vaerdi: ['inspektion', 'sikkerhed_overvaagning', 'forsvar_beredskab', 'forbruger_uddannelse', 'forskning_udvikling'],
    citat: 'It provides a highly efficient and reliable professional platform for intelligent lightweight tasks in industries such as power inspection, security patrol, emergency firefighting, and education & scientific research.',
    kilde: 'https://deeprobotics.cn/en/index/lynxs10.html',
    hentet: '2026-08-19',
    fil: 'raa-kina-deep-magic-2026-08-19/deeprobotics-lynx-s10-specside-en-2026-08-19.html',
    note: 'L22: "security patrol" er omsat til sikkerhed_overvaagning. "emergency '
      + 'firefighting" er forsvar_beredskab. De fem kategorier er producentens egen '
      + 'opremsning i én saetning og staar uden indbyrdes rangering (L27).',
  },
  'deep-robotics-mini': {
    vaerdi: 'ikke_oplyst',
    kilde: 'https://deeprobotics.cn/en/index/product2.html',
    hentet: '2026-08-19',
    fil: 'raa-kina-deep-magic-2026-08-19/deeprobotics-mini-specside-en-2026-08-19.html',
    note: 'GENNEMLAEST, INTET FUNDET. Mini staar heller ikke i producentens kinesiske '
      + 'produktpanel, hvor Lite3, X20 og X30 hver faar en anvendelsesetikette. Sidens '
      + 'egen tekst handler om teknologi ("deep learning", "visual perception"), ikke '
      + 'om hvem robotten er til.',
  },

  /* ---------------- MagicLab -------------------------------------------- */

  'magiclab-magicdog-pro': {
    vaerdi: ['forskning_udvikling', 'forbruger_uddannelse'],
    citat: 'MagicDog is an intelligent quadruped robot developed for research, education, interactive entertainment and companion-style applications.',
    kilde: 'https://www.magiclabglobal.com/products/magicdog/',
    hentet: '2026-08-19',
    fil: 'raa-kina-deep-magic-2026-08-19/magiclabglobal-magicdog-specside-en-2026-08-19.html',
    note: 'Samme afsnit slutter: "PRO and EDU configurations are available", saa '
      + 'saetningen daekker begge varianter. magiclabglobal.com er producentens nye '
      + 'globale site (FUND-kina-3, afsnit om de to domaener).',
  },
  'magiclab-magicdog-edu': {
    vaerdi: ['forskning_udvikling', 'forbruger_uddannelse'],
    citat: 'MagicDog is an intelligent quadruped robot developed for research, education, interactive entertainment and companion-style applications.',
    kilde: 'https://www.magiclabglobal.com/products/magicdog/',
    hentet: '2026-08-19',
    fil: 'raa-kina-deep-magic-2026-08-19/magiclabglobal-magicdog-specside-en-2026-08-19.html',
    note: 'Samme afsnit slutter: "PRO and EDU configurations are available".',
  },
  'magiclab-magicdog-w': {
    vaerdi: ['forskning_udvikling', 'inspektion'],
    citat: 'MagicDog-W is suitable for research, demonstrations, patrol, surveying and expandable mobile applications.',
    kilde: 'https://www.magiclabglobal.com/products/magicdog-w/',
    hentet: '2026-08-19',
    fil: 'raa-kina-deep-magic-2026-08-19/magiclabglobal-magicdog-w-specside-en-2026-08-19.html',
    note: 'Producentens kinesiske og engelske produktsider paa magiclab.top kalder den '
      + 'kun "MagicLab Quadruped Wheeled Robot" - en form, ikke en anvendelse.',
  },
  'magiclab-magicdog-y1': {
    vaerdi: ['industri', 'inspektion', 'forsvar_beredskab'],
    citat: ['MagicDog Y1 is an industrial quadruped robot engineered for inspection, emergency response, rescue support and demanding outdoor operations.',
      'MagicLab Industrial Quadruped Robot'],
    kilde: 'https://www.magiclabglobal.com/products/magicdog-y1/',
    hentet: '2026-08-19',
    fil: ['raa-kina-deep-magic-2026-08-19/magiclabglobal-magicdog-y1-specside-en-2026-08-19.html',
      'raa-kina-deep-magic-2026-08-19/magiclab-magicdog-y1-specside-en-2026-08-19.html'],
    note: 'De to producentdomaener siger det samme: magiclab.top skriver "MagicLab '
      + 'Industrial Quadruped Robot" (CN: "魔法原子工业四足机器人").',
  },

  /* ---------------- WEILAN ----------------------------------------------- */

  'weilan-alphadog-c500': {
    vaerdi: 'forbruger_uddannelse',
    citat: 'Children’s education, family companionship, elderly care, express delivery, STEAM education',
    kilde: 'https://www.weilan.com/en/en/alphadogc.html',
    hentet: '2026-08-19',
    fil: 'raa-kina-weilan-xiaomi-2026-08-19/weilan-alphadogc-produktside-2026-08-19.html',
    note: 'Listen staar under overskriften "Innovative Applications in Discovery" - '
      + 'producentens egne ord for at det er noget, der undersoeges. Derfor er '
      + '"express delivery" IKKE foert som logistik: en anvendelse under udforskning '
      + 'er ikke en anvendelse, robotten saelges til.',
  },
  'weilan-alphadog-c501': {
    vaerdi: 'forbruger_uddannelse',
    citat: 'Children’s education, family companionship, elderly care, express delivery, STEAM education',
    kilde: 'https://www.weilan.com/en/en/alphadogc.html',
    hentet: '2026-08-19',
    fil: 'raa-kina-weilan-xiaomi-2026-08-19/weilan-alphadogc-produktside-2026-08-19.html',
    note: 'C500 og C501 deler produktside. Se noten paa C500 om "Innovative '
      + 'Applications in Discovery".',
  },
  'weilan-alphadog-e300': {
    vaerdi: 'ikke_oplyst',
    kilde: 'https://www.weilan.com/en/en/alphadoge.html',
    hentet: '2026-08-19',
    fil: 'raa-kina-weilan-xiaomi-2026-08-19/weilan-alphadoge-produktside-2026-08-19.html',
    note: 'DER STAAR EN POSITIONERING I FILEN, OG DEN ER TAGET NED. Saetningen "it can '
      + 'be assigned to safeguard people and properties, patrol parks and communities, '
      + 'guide a blind person, deliver packages to your front door, inspect factories '
      + 'or dangerous places, do rescue missions" ligger paa byte 23.014-23.500 - inde i '
      + 'HTML-kommentaren, en browser aldrig viser. Maalt: alle fire positioneringstekster '
      + 'paa E-siden ligger i kommentaren. Samme afgoerelse som for tallene: vi udgiver '
      + 'ikke noget, producenten har trukket tilbage.',
  },
  'weilan-alphadog-e400l': {
    vaerdi: 'ikke_oplyst',
    kilde: 'https://www.weilan.com/en/en/alphadoge.html',
    hentet: '2026-08-19',
    fil: 'raa-kina-weilan-xiaomi-2026-08-19/weilan-alphadoge-produktside-2026-08-19.html',
    note: 'Se noten paa E300: E-seriens positionering ligger inde i en HTML-kommentar '
      + 'og bruges ikke.',
  },
  'weilan-babyalpha': {
    vaerdi: 'forbruger_uddannelse',
    citat: 'AI-powered Family Companion',
    kilde: 'https://www.weilan.com/en/en/babyAlpha.html',
    hentet: '2026-08-19',
    fil: 'raa-kina-weilan-xiaomi-2026-08-19/weilan-babyalpha-produktside-2026-08-19.html',
    note: 'Samme side, synlig tekst: "a source of family entertainment that doubles as '
      + 'a home security guard". Producenten placerer den selv i hjemmet.',
  },

  /* ---------------- Xiaomi ----------------------------------------------- */

  'xiaomi-cyberdog-2': {
    vaerdi: 'ikke_oplyst',
    kilde: 'https://www.mi.com/cyberdog2/specs',
    hentet: '2026-08-19',
    fil: 'raa-kina-weilan-xiaomi-2026-08-19/xiaomi-cyberdog2-specside-bundle-js-2026-08-19.js',
    note: 'GENNEMLAEST, INTET FUNDET - ogsaa i JS-bundlen, hvor specifikationerne ligger. '
      + 'Producentens eneste etikette er produkttypen "仿生四足机器人" (biomimetisk '
      + 'firbenet robot). Det er hvad den ER, ikke hvem den er til.',
  },

  /* ---------------- Yobotics ---------------------------------------------- */

  'yobotics-y10': {
    vaerdi: ['forskning_udvikling', 'forbruger_uddannelse'],
    citat: 'It is a flagship product in the field of commercial, scientific research, and educational quadruped robots.',
    kilde: 'https://www.yobotics.cn/en/product/quadruped_robot_series/',
    hentet: '2026-08-19',
    fil: 'raa-kina-weilan-xiaomi-2026-08-19/yobotics-katalog-firbenede-2026-08-19.html',
    note: 'Saetningen staar som indledning paa katalogsiden for hele serien (Y20, Y10, '
      + 'e-Dog) og er ikke skrevet om den enkelte model. Ordet "commercial" har det '
      + 'tilladte saet ingen kategori for.',
  },
  'yobotics-y20': {
    vaerdi: ['forskning_udvikling', 'forbruger_uddannelse'],
    citat: 'It is a flagship product in the field of commercial, scientific research, and educational quadruped robots.',
    kilde: 'https://www.yobotics.cn/en/product/quadruped_robot_series/',
    hentet: '2026-08-19',
    fil: 'raa-kina-weilan-xiaomi-2026-08-19/yobotics-katalog-firbenede-2026-08-19.html',
    note: 'Serieindledning, ikke en modelspecifik saetning. Se noten paa Y10.',
  },
  'yobotics-e-dog': {
    vaerdi: ['forskning_udvikling', 'forbruger_uddannelse'],
    citat: 'It is a flagship product in the field of commercial, scientific research, and educational quadruped robots.',
    kilde: 'https://www.yobotics.cn/en/product/quadruped_robot_series/',
    hentet: '2026-08-19',
    fil: 'raa-kina-weilan-xiaomi-2026-08-19/yobotics-katalog-firbenede-2026-08-19.html',
    note: 'Serieindledning, ikke en modelspecifik saetning. Se noten paa Y10.',
  },

  /* ---------------- Boston Dynamics -------------------------------------- */

  'boston-dynamics-spot': {
    vaerdi: ['industri', 'inspektion'],
    citat: 'Our agile mobile robot for dynamic sensing and industrial inspection',
    kilde: 'https://bostondynamics.com/products/spot/',
    hentet: '2026-08-19',
    fil: 'raa-vest-2026-08-19/spot.html',
    note: 'Producentens egen produktnavigation, teksten under punktet "Spot". Sidens '
      + 'loesningsmenu deler i "Inspection" og "Safety & Response".',
  },

  /* ---------------- ANYbotics -------------------------------------------- */

  'anybotics-anymal': {
    vaerdi: ['inspektion', 'industri'],
    citat: ['ANYmal - Autonomous Robotic Inspection Solution - ANYbotic',
      'Purpose-built for intricate industrial plants.'],
    kilde: 'https://www.anybotics.com/robotics/anymal/',
    hentet: '2026-08-19',
    fil: 'raa-vest-2026-08-19/anymal.txt',
    note: 'Foerste citat er sidens egen titel.',
  },
  'anybotics-anymal-x': {
    vaerdi: ['inspektion', 'industri'],
    citat: ['ANYmal X - Ex-proof inspection robot - ANYbotics',
      'Complies with CE directives for industrial deployment'],
    kilde: 'https://www.anybotics.com/robotics/anymal-x/',
    hentet: '2026-08-19',
    fil: 'raa-vest-2026-08-19/anymalx.txt',
    note: 'Foerste citat er sidens egen titel. Siden praeciserer branchen: "Automate '
      + 'inspections in Oil & Gas and Chemical operations to increase safety,".',
  },

  /* ---------------- Ghost Robotics ---------------------------------------- */

  'ghost-robotics-vision-60': {
    vaerdi: 'forsvar_beredskab',
    citat: ['Designed to meet your real-world commercial and defense needs, Q-UGV is the most adaptable unmanned ground vehicle in the world.',
      'Redefining government, homeland, and military operations.'],
    kilde: 'https://www.ghostrobotics.io/vision-60',
    hentet: '2026-08-19',
    fil: 'raa-vest-2026-08-19/v60.txt',
    note: 'Producentens hovednavigation har to punkter: "Defense" og "Commercial". '
      + '"Commercial" er ikke en anvendelse i det tilladte saet, og forsiden praeciserer '
      + 'den som "From the battlefield to the oil field".',
  },
  'ghost-robotics-spirit-40': {
    vaerdi: 'ikke_oplyst',
    kilde: 'https://www.ghostrobotics.io/spirit-40',
    hentet: '2026-08-19',
    fil: 'raa-vest-2026-08-19/ghost_s40.html',
    note: 'PRODUCENTEN HAR INGEN SIDE OM MODELLEN. Den gemte fil har <title>Not Found</title> '
      + 'og teksten "Page Not Found". Uden en side er der intet at citere, og Ghost '
      + 'Robotics generelle forsvarspositionering hoerer til Vision 60, ikke til en '
      + 'model producenten ikke laengere omtaler.',
  },

  /* ---------------- MAB Robotics ------------------------------------------ */

  'mab-honey-badger-4': {
    vaerdi: ['inspektion', 'forskning_udvikling'],
    citat: ['Industrial inspection', 'Academia & Research'],
    kilde: 'https://www.mabrobotics.pl/honey-badger',
    hentet: '2026-08-19',
    fil: 'raa-vest-2026-08-19/mab.txt',
    note: 'FIRMANIVEAU, IKKE MODELNIVEAU. Citaterne er to punkter i producentens '
      + '"Industries"-menu, som staar paa hele sitet: Industrial inspection, Mining, '
      + 'Public safety, Utilities, Civil engineering, Academia & Research. Honey Badger '
      + 'er producentens eneste robot, men producenten har ikke selv sat etiketten paa '
      + 'modellen. Mining, Public safety, Utilities og Civil engineering har det tilladte '
      + 'saet ingen kategorier for.',
  },
  'mab-honey-badger-5': {
    vaerdi: ['inspektion', 'forskning_udvikling'],
    citat: ['Industrial inspection', 'Academia & Research'],
    kilde: 'https://www.mabrobotics.pl/honey-badger-5',
    hentet: '2026-08-19',
    fil: 'raa-vest-2026-08-19/mab5.txt',
    note: 'FIRMANIVEAU, IKKE MODELNIVEAU - se noten paa Honey Badger 4.0. Modelsidens '
      + 'egen overskrift "Designed with Precision for Industrial-grade Standards" er en '
      + 'byggekvalitet, ikke en anvendelse, og taeller ikke med.',
  },

  /* ---------------- Rainbow Robotics -------------------------------------- */

  'rainbow-robotics-rbq-10': {
    vaerdi: ['forskning_udvikling', 'inspektion', 'sikkerhed_overvaagning'],
    citat: ['Research Platform',
      'Based on dynamics-based gait control and AI gait technology, it provides walking stability and mobility outdoors, while supporting sensor and system expansion for field applications such as patrol, inspection, and observation.',
      'PTZ cameras, thermal imaging, lighting, speakers, and other modules can be combined according to mission purpose and environment, supporting scenarios such as surveillance, inspection, and observation.'],
    kilde: 'https://rainbow-robotics.com/en/products/rbq-10/',
    hentet: '2026-08-19',
    fil: 'raa-vest-2026-08-19/rbq10.txt',
    note: '"Research Platform" er en etikette paa selve produktet, ved siden af "Outdoor '
      + 'Walking" og "AI Gait". L22: "patrol" og "surveillance" er omsat til '
      + 'sikkerhed_overvaagning; tredje citat er produktsidens egen modulbeskrivelse. '
      + 'Producentens brancheliste for hele firmaet naevner ogsaa Defense & Security og '
      + 'Logistics, men den er ikke skrevet om RBQ-10 og er ikke brugt.',
  },

  /* ---------------- RIVR --------------------------------------------------- */

  'rivr-one': {
    vaerdi: 'logistik',
    citat: 'Our delivery robot is designed to seamlessly navigate the last mile and the critical last 100 yards right to the doorstep, ensuring secure deliveries while integrating into your existing infrastructure.',
    kilde: 'https://www.rivr.ai/product',
    hentet: '2026-08-19',
    fil: 'raa-vest-2026-08-19/rivrp.txt',
    note: 'Producentens navigation deler i Parcel Delivery, Grocery Delivery og '
      + '"Instant food and convenience store delivery" - tre former for det samme.',
  },

  /* ---------------- De tre nye poster ------------------------------------
     Raakilderne til dem ligger i raa-anvendelse-2026-08-19/ med egen MANIFEST.tsv.
     De tre raekker her staar KUN, saa efterproev-anvendelse.mjs kan slaa citaterne
     op - blokkene er skrevet direkte ind i YAML-filerne, ikke af det her program. */

  'unitree-laikago': {
    vaerdi: 'ikke_oplyst',
    kilde: 'https://www.unitree.com/laikago',
    hentet: '2026-08-21',
    fil: 'raa-anvendelse-2026-08-19/unitree-laikago-produktside-en-2026-08-21-FEJL-404.html',
    note: 'HTTP 404. Ingen produktside, intet at citere.',
  },
  'xiaomi-cyberdog-1': {
    vaerdi: 'ikke_oplyst',
    kilde: 'https://www.mi.com/cyberdog/specs',
    hentet: '2026-08-21',
    fil: 'raa-anvendelse-2026-08-19/xiaomi-cyberdog1-specside-bundle-js-2026-08-21.js',
    note: 'Gennemlaest, ingen anvendelse naevnt - hverken i HTML eller i JS-bundlen.',
  },
  'raion-robotics-raibo2': {
    vaerdi: ['inspektion', 'forskning_udvikling', 'sikkerhed_overvaagning'],
    citat: ['Modular payload space supports perception, communication, and mission equipment for patrol, inspection, and research workflows.',
      'RAIBO2 integrates high-output actuators, reinforced mechanical structure, and learning-based control into a field-ready quadruped platform.'],
    kilde: 'https://raionrobotics.com/en/product/Raibo2',
    hentet: '2026-08-21',
    fil: 'raa-anvendelse-2026-08-19/raionrobotics-raibo2-produktside-en-2026-08-21.html',
    note: 'L22: "patrol" er omsat til sikkerhed_overvaagning, og det er den svageste af '
      + 'de seks: producenten skriver hverken "security" eller "surveillance" om RAIBO2 '
      + '- kun "patrol", og kun én gang. Se i oevrigt noten i datafilen.',
  },
};

/* ---------------------------------------------------------------- skrivning */

const cit = (s) => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

export function blok(a) {
  const l = ['anvendelse:'];
  l.push(Array.isArray(a.vaerdi)
    ? `  vaerdi: [${a.vaerdi.join(', ')}]`
    : `  vaerdi: ${a.vaerdi}`);
  if (a.citat !== undefined) {
    if (Array.isArray(a.citat)) {
      l.push('  citat:');
      for (const c of a.citat) l.push(`    - ${cit(c)}`);
    } else {
      l.push(`  citat: ${cit(a.citat)}`);
    }
  }
  if (a.kilde) l.push(`  kilde: ${a.kilde}`);
  if (a.hentet) l.push(`  hentet: ${a.hentet}`);
  if (a.kildetype) l.push(`  kildetype: ${a.kildetype}`);
  // Arven staar EFTER kilden og foer noten: den er ikke en kilde, men den
  // aendrer, hvis ord kilden baerer. Se R17.
  if (a.arvet_fra) l.push(`  arvet_fra: ${a.arvet_fra}`);
  if (a.note) l.push(`  note: ${cit(a.note)}`);
  return l.join('\n') + '\n';
}

function main() {
  const toer = process.argv.includes('--toer');
  const mappe = 'data/robots';
  let skrevet = 0; const mangler = [];
  for (const fil of fs.readdirSync(mappe).filter((f) => f.endsWith('.yaml'))) {
    const slug = fil.replace(/\.yaml$/, '');
    const a = TABEL[slug];
    if (!a) { mangler.push(slug); continue; }
    const sti = path.join(mappe, fil);
    let src = fs.readFileSync(sti, 'utf8');
    if (/^anvendelse:/m.test(src)) { console.log(`  springer over (har allerede): ${slug}`); continue; }
    // `.` i JS matcher IKKE \r - den er en linjeafslutter paa lige fod med \n.
    // Datafilerne er CRLF, saa /^status: .*\n/m fandt ingenting, tavst.
    const m = src.match(/^status: [^\r\n]*\r?\n/m);
    if (!m) { console.error(`  FEJL: ${slug} har ingen "status:"-linje`); continue; }
    // Blokken skal have samme linjeskift som filen, ellers bliver filen blandet.
    const nl = m[0].endsWith('\r\n') ? '\r\n' : '\n';
    const ind = src.indexOf(m[0]) + m[0].length;
    src = src.slice(0, ind) + blok(a).replace(/\n/g, nl) + src.slice(ind);
    if (!toer) fs.writeFileSync(sti, src, 'utf8');
    skrevet++;
  }
  console.log(`${toer ? '[toerloeb] ' : ''}${skrevet} fil(er) fik "anvendelse:"`);
  if (mangler.length) console.error(`MANGLER I TABELLEN (${mangler.length}): ${mangler.join(', ')}`);
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`
  || process.argv[1].endsWith('anvendelse-indsaet.mjs')) main();
