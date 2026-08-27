// Å25b: 48 `advarsel:`-tekster der bærer internt sprog. Hver post er (slug, gammelt
// fragment -> nyt fragment). Fragmentet skal findes ORDRET og PRÆCIS ÉN GANG i filens
// rå tekst - scriptet der bruger denne liste fejler synligt ellers. Kun sproget
// omskrives; værdi, enhed, kilde og dato er urørt (hård begrænsning 2).
//
// To poster (weilan-alphadog-c500/-c501, temp_maks) er reelt en opgave til os
// ("Skal normaliseres i indlæsningen...") og fjernes helt fra advarsel - de er
// flyttet til fund/NOTEARKIV-1.md i stedet, se rapporten.

export const OMSKRIVNINGER = [
  {
    slug: 'addverb-trakr-5', felt: 'nyttelast_gaaende',
    fra: 'Placeringen i nyttelast_gaaende er vores tolkning, ikke en aflaesning (samme princip som Boston Dynamics Spot og ANYbotics ANYmal i dette katalog).',
    til: 'Placeringen under gaaende last er vores tolkning, ikke en aflaesning (samme princip som Boston Dynamics Spot og ANYbotics ANYmal i dette katalog).',
  },
  {
    slug: 'addverb-trakr-5', felt: 'driftstid',
    fra: 'Ingen lastbetingelse oplyst - ved_last ikke_oplyst, selvom et separat 5 kg-payloadtal findes andetsteds paa siden (regel 8: gaetter ikke paa koblingen). VOLTAGE 24V og BATTERY CAPACITY 10AH er ogsaa oplyst; Wh er ikke trykt direkte og udregnes ikke af V x Ah (regel 9-praecedens fra flere andre poster i kataloget).',
    til: 'Ingen lastbetingelse oplyst, selvom et separat 5 kg-payloadtal findes andetsteds paa siden - forbindelsen mellem de to er ikke lavet af producenten, saa driftstiden staar uden lastkrav. VOLTAGE 24V og BATTERY CAPACITY 10AH er ogsaa oplyst; Wh er ikke trykt direkte og udregnes ikke af V x Ah, samme forsigtighed som andre poster i kataloget.',
  },
  {
    slug: 'astrall-dynamics-hypertron-t01', felt: 'driftstid',
    fra: 'vi gaetter ikke, at det er de 80 kg fra 工作负载-feltet, saa ved_last staar ikke_oplyst i stedet for at opfinde koblingen.',
    til: 'vi gaetter ikke, at det er de 80 kg fra 工作负载-feltet, saa lastbetingelsen staar ikke oplyst i stedet for at opfinde koblingen.',
  },
  {
    slug: 'boston-dynamics-spot', felt: 'nyttelast_gaaende',
    fra: 'Placeringen i nyttelast_gaaende er vores tolkning, ikke en aflaesning.',
    til: 'Placeringen under gaaende last er vores tolkning, ikke en aflaesning.',
  },
  {
    slug: 'deep-robotics-lynx-s10', felt: 'egenvaegt',
    fra: 'Bemaerk ogsaa, at EN bruger tegnet U+2264 og CN tegnet U+2266 for samme robot, samme felt, samme dag. Enhver validator, der matcher paa tegnet frem for paa betydningen, ser dem som to forskellige operatorer.',
    til: 'Bemaerk ogsaa, at EN bruger tegnet U+2264 og CN tegnet U+2266 for samme robot, samme felt, samme dag - to forskellige tegn for samme betydning.',
  },
  {
    slug: 'deep-robotics-mini', felt: 'batteri_wh',
    fra: 'Det gamle udkast kasserede feltet; det kan reddes, men kun ved at laese originalsproget. Konsekvens for validatoren: den skal tjekke, at ENHEDEN passer til feltet, ikke kun at der er en enhed.',
    til: 'Det korrekte tal findes kun ved at laese originalsproget, ikke den engelske oversaettelse.',
  },
  {
    slug: 'galileo-c1-w', felt: 'nyttelast_gaaende',
    fra: '"有效负载: 8kg" - samme fortolkning som C1, se galileo-c1.yaml. Identisk tal med den gaaende C1.',
    til: '"有效负载: 8kg" - samme fortolkning som hos C1. Identisk tal med den gaaende C1.',
  },
  {
    slug: 'galileo-c1-w', felt: 'hot_swap',
    fra: 'Fra den delte funktionsside (side 6) - se galileo-c1.yaml.',
    til: 'Fra den delte funktionsside (side 6), samme kilde som hos C1.',
  },
  {
    slug: 'galileo-c1-w', felt: 'dockingstation',
    fra: '"自主充电功能: 支持" kombineret med den delte funktionssides ladepile-docking - se galileo-c1.yaml.',
    til: '"自主充电功能: 支持" kombineret med den delte funktionssides ladepile-docking, samme kilde som hos C1.',
  },
  {
    slug: 'galileo-c1', felt: 'nyttelast_gaaende',
    fra: 'Mappet til nyttelast_gaaende - "有效" (effektiv, under aktiv brug) fortolket som svarende til den gaaende/dynamiske last, parallelt med Yuejias eksplicitte "动态负载". En fortolkning, ikke producentens egne ord "gaaende".',
    til: 'Mappet til gaaende last - "有效" (effektiv, under aktiv brug) fortolket som svarende til den gaaende/dynamiske last, parallelt med Yuejias eksplicitte "动态负载". En fortolkning, ikke producentens egne ord "gaaende".',
  },
  {
    slug: 'galileo-c1', felt: 'nyttelast_staaende',
    fra: 'Mappet til nyttelast_staaende - se advarslen paa nyttelast_gaaende for fortolkningsprincippet.',
    til: 'Mappet til staaende last - samme fortolkningsprincip som for den gaaende last ovenfor.',
  },
  {
    slug: 'galileo-e1-w', felt: 'hot_swap',
    fra: 'Fra den delte funktionsside (side 6) - se galileo-c1.yaml.',
    til: 'Fra den delte funktionsside (side 6), samme kilde som hos C1.',
  },
  {
    slug: 'galileo-e1', felt: 'nyttelast_gaaende',
    fra: '"有效负载: 20kg" - samme fortolkning som C1, se galileo-c1.yaml.',
    til: '"有效负载: 20kg" - samme fortolkning som hos C1.',
  },
  {
    slug: 'galileo-e1', felt: 'hot_swap',
    fra: 'Fra den delte funktionsside (side 6) - se galileo-c1.yaml.',
    til: 'Fra den delte funktionsside (side 6), samme kilde som hos C1.',
  },
  {
    slug: 'galileo-s1-w', felt: 'hot_swap',
    fra: 'Fra den delte funktionsside (side 6) - se galileo-c1.yaml.',
    til: 'Fra den delte funktionsside (side 6), samme kilde som hos C1.',
  },
  {
    slug: 'galileo-s1', felt: 'nyttelast_gaaende',
    fra: '"有效负载: 40kg" - samme fortolkning som C1, se galileo-c1.yaml.',
    til: '"有效负载: 40kg" - samme fortolkning som hos C1.',
  },
  {
    slug: 'galileo-s1', felt: 'hot_swap',
    fra: 'Fra den delte funktionsside (side 6) - se galileo-c1.yaml.',
    til: 'Fra den delte funktionsside (side 6), samme kilde som hos C1.',
  },
  {
    slug: 'genisom-gangben-l2-w-ultra', felt: 'driftstid',
    fra: 'Kvalitativ lastbetingelse, intet kg-tal - derfor ved_last: ikke_oplyst.',
    til: 'Kvalitativ lastbetingelse, intet kg-tal - derfor er lastbetingelsen ikke oplyst.',
  },
  {
    slug: 'genisom-gangben-l2-w', felt: 'driftstid',
    fra: 'Kvalitativ lastbetingelse (tom/fuld), intet kg-tal - derfor ved_last: ikke_oplyst.',
    til: 'Kvalitativ lastbetingelse (tom/fuld), intet kg-tal - derfor er lastbetingelsen ikke oplyst.',
  },
  {
    slug: 'genisom-gangben-l2', felt: 'egenvaegt',
    fra: 'samme moenster som genisom-gangben-l1.yaml, rettet ved selv-tjek der - kontrolleret her fra start efter samme fejl',
    til: 'samme moenster som Gangben L1, rettet ved selv-tjek der - kontrolleret her fra start efter samme fejl',
  },
  {
    slug: 'genisom-gangben-l2', felt: 'driftstid',
    fra: 'Kvalitativ lastbetingelse (tom/fuld), intet kg-tal for "fuld last" - derfor ved_last: ikke_oplyst, ikke et masse-kort.',
    til: 'Kvalitativ lastbetingelse (tom/fuld), intet kg-tal for "fuld last" - derfor er lastbetingelsen ikke oplyst, ikke et gaettet masse-kort.',
  },
  {
    slug: 'genisom-qiuqiu-sp1', felt: 'driftstid',
    fra: 'men er ikke eksplicit bundet til denne udholdenhedsangivelse - derfor ved_last: ikke_oplyst, jf. regel 8 og samme forsigtighed som L2/M1\'s driftstidsfelter.',
    til: 'men er ikke eksplicit bundet til denne udholdenhedsangivelse - derfor er lastbetingelsen ikke oplyst, samme forsigtighed som L2/M1\'s driftstidsfelter.',
  },
  {
    slug: 'genisom-tongchui-m1-pro', felt: 'driftstid',
    fra: 'Kvalitativ lastbetingelse (tom/fuld), intet kg-tal knyttet direkte - derfor ved_last: ikke_oplyst.',
    til: 'Kvalitativ lastbetingelse (tom/fuld), intet kg-tal knyttet direkte - derfor er lastbetingelsen ikke oplyst.',
  },
  {
    slug: 'genisom-tongchui-m1-pro', felt: 'kameraer',
    fra: '(bemaerk: samme kameraopstilling som basis-M1, IKKE M1 Ultra\'s fiskeoeje-array - se genisom-tongchui-m1-ultra.yaml).',
    til: '(bemaerk: samme kameraopstilling som basis-M1, IKKE M1 Ultra\'s fiskeoeje-array).',
  },
  {
    slug: 'genisom-tongchui-m1-pro', felt: 'compute',
    fra: '(bemaerk: DIFFERER fra M1 Ultra\'s 6-kernet/128TOPS - se genisom-tongchui-m1-ultra.yaml).',
    til: '(bemaerk: DIFFERER fra M1 Ultra\'s 6-kernet/128TOPS).',
  },
  {
    slug: 'genisom-tongchui-m1-ultra', felt: 'egenvaegt',
    fra: 'MODSIGES af sidens sidebredde marketingkort ("约 30kg") - se genisom-tongchui-m1-pro.yaml\'s topnote. Regel 9: ikke rettet stiltiende.',
    til: 'MODSIGES af sidens sidebredde marketingkort ("约 30kg"), samme selvmodsigelse som M1 Pro. Ikke rettet stiltiende.',
  },
  {
    slug: 'genisom-tongchui-m1-ultra', felt: 'driftstid',
    fra: 'Kvalitativ lastbetingelse, intet kg-tal knyttet direkte - ved_last: ikke_oplyst.',
    til: 'Kvalitativ lastbetingelse, intet kg-tal knyttet direkte - lastbetingelsen er derfor ikke oplyst.',
  },
  {
    slug: 'genisom-tongchui-m1', felt: 'driftstid',
    fra: 'derfor ved_last: ikke_oplyst, selvom et separat "最大载荷: 30 kg" staar andetsteds paa siden.',
    til: 'derfor er lastbetingelsen ikke oplyst, selvom et separat "最大载荷: 30 kg" staar andetsteds paa siden.',
  },
  {
    slug: 'ghost-robotics-vision-60', felt: 'hastighed',
    fra: ' Fejlen kraever en procenttolerance i validatoren, ikke kun en stoerrelsesordenstest.',
    til: '',
  },
  {
    slug: 'keybotic-keyper', felt: 'driftstid',
    fra: 'ved_last er derfor ikke_oplyst, ikke et gaettet kg-tal.',
    til: 'lastbetingelsen er derfor ikke oplyst, ikke et gaettet kg-tal.',
  },
  {
    slug: 'magiclab-magicdog-y1', felt: 'batteri_wh',
    fra: ' Validatoren boer krydstjekke Wh mod Ah x V, naar begge er trykt - og et brud maa markeres, ikke rettes.',
    til: '',
  },
  {
    slug: 'microrobotech-movenew-p1', felt: 'driftstid',
    fra: 'kan derfor ikke skrives som et masse-kort i ved_last, kun som tilstanden ikke_oplyst.',
    til: 'kan derfor ikke skrives som et konkret lastkrav, kun som tilstanden ikke oplyst.',
  },
  {
    slug: 'neura-quadruped', felt: 'nyttelast_gaaende',
    fra: 'Placeringen i nyttelast_gaaende er vores tolkning, ikke en aflaesning (samme princip som Boston Dynamics Spot m.fl.).',
    til: 'Placeringen under gaaende last er vores tolkning, ikke en aflaesning (samme princip som Boston Dynamics Spot m.fl.).',
  },
  {
    slug: 'pudu-d5-w', felt: 'laengde',
    fra: 'USIKKER TILDELING, se pudu-d5.yaml. Producenten skriver samme trippel "900 x 543 x 572 mm" for D5-W som for D5 - staaende maal er identiske paa tvaers af de to varianter ifoelge tabellen.',
    til: 'USIKKER TILDELING, samme forbehold som hos D5. Producenten skriver samme trippel "900 x 543 x 572 mm" for D5-W som for D5 - staaende maal er identiske paa tvaers af de to varianter ifoelge tabellen.',
  },
  {
    slug: 'pudu-d5-w', felt: 'forhindring_enkelt',
    fra: 'Producentens etiket "Climbing Capability: Up to 80 cm", identisk for D5 og D5-W. Se pudu-d5.yaml for tildelingsforbeholdet mellem dette felt og trappetrin_kontinuerlig.',
    til: 'Producentens etiket "Climbing Capability: Up to 80 cm", identisk for D5 og D5-W. Samme tildelingsforbehold mellem dette felt og den kontinuerlige trappe som hos D5.',
  },
  {
    slug: 'pudu-d5-w', felt: 'temp_maks',
    fra: 'Separat producentfelt "Cold-Start Capability: Below -10°C" - se pudu-d5.yaml for samme forbehold.',
    til: 'Separat producentfelt "Cold-Start Capability: Below -10°C" - samme forbehold som hos D5.',
  },
  {
    slug: 'pudu-d5-w', felt: 'driftstid',
    fra: 'Pressemeddelelsens lastbetingede "over two hours at full load (30 kg)" er ikke eksplicit knyttet til D5-W alene og er derfor kun brugt i pudu-d5.yaml (D5), ikke her.',
    til: 'Pressemeddelelsens lastbetingede "over two hours at full load (30 kg)" er ikke eksplicit knyttet til D5-W alene og er derfor kun brugt hos D5, ikke her.',
  },
  {
    slug: 'pudu-d5-w', felt: 'lidar',
    fra: 'Fodnote 5, samme som pudu-d5.yaml - gaelder D5-serien, ingen separat angivelse for D5-W.',
    til: 'Fodnote 5, samme som hos D5 - gaelder D5-serien, ingen separat angivelse for D5-W.',
  },
  {
    slug: 'pudu-d5-w', felt: 'autonominiveau',
    fra: 'Kvalitativ, gaelder D5-serien bredt, ikke D5-W-specifik. Se pudu-d5.yaml.',
    til: 'Kvalitativ, gaelder D5-serien bredt, ikke D5-W-specifik - samme kilde som hos D5.',
  },
  {
    slug: 'pudu-d5', felt: 'laengde',
    fra: 'Foerste tal er her antaget som laengde, som i moenstret fra deep-robotics-x30.yaml. Ikke bekraeftet ud fra kilden.',
    til: 'Foerste tal er her antaget som laengde, som i moenstret fra Deep Robotics X30. Ikke bekraeftet ud fra kilden.',
  },
  {
    slug: 'pudu-d5', felt: 'pris',
    fra: 'D5-W koster 85.000 USD ifoelge samme kilde (variant "D5-W": price 8500000) - se pudu-d5-w.yaml.',
    til: 'D5-W koster 85.000 USD ifoelge samme kilde (variant "D5-W": price 8500000).',
  },
  {
    slug: 'unitree-go2', felt: 'nyttelast_gaaende',
    fra: 'Placeringen i nyttelast_gaaende er en konservativ slutning ud fra stoerrelsesordenen, IKKE en aflaesning.',
    til: 'Placeringen under gaaende last er en konservativ slutning ud fra stoerrelsesordenen, IKKE en aflaesning.',
  },
  {
    slug: 'weilan-alphadog-c500', felt: 'temp_maks',
    fra: 'Producenten bruger fuldbredde-tilden U+FF5E, ikke ASCII-tilde, mellem de to temperaturer. Skal normaliseres i indlaesningen, ellers matcher intervalparseren ikke.',
    til: 'Producenten bruger fuldbredde-tilden U+FF5E, ikke ASCII-tilde, mellem de to temperaturer.',
  },
  {
    slug: 'weilan-alphadog-c501', felt: 'temp_maks',
    fra: 'Producenten bruger fuldbredde-tilden U+FF5E, ikke ASCII-tilde, mellem de to temperaturer. Skal normaliseres i indlaesningen, ellers matcher intervalparseren ikke.',
    til: 'Producenten bruger fuldbredde-tilden U+FF5E, ikke ASCII-tilde, mellem de to temperaturer.',
  },
  {
    slug: 'yuejia-yj30-w', felt: 'haeldning',
    fra: 'Fra samme sammenlagte kolonne "爬坡角度/DOF" som YJ30 - se yuejia-yj30.yaml\'s topnote.',
    til: 'Fra samme sammenlagte kolonne "爬坡角度/DOF" som YJ30, samme forbehold som i YJ30\'s egen post.',
  },
  {
    slug: 'yuejia-yj30', felt: 'nyttelast_gaaende',
    fra: 'Placeringen i nyttelast_gaaende er et forsigtigt skoen ud fra stoerrelsesordenen, IKKE en aflaesning.',
    til: 'Placeringen under gaaende last er et forsigtigt skoen ud fra stoerrelsesordenen, IKKE en aflaesning.',
  },
  {
    slug: 'yufan-lingmao-cyvet', felt: 'nyttelast_gaaende',
    fra: 'nyttelast_staaende er derfor ikke_oplyst, ikke 0.',
    til: 'staaende nyttelast er derfor ikke oplyst, ikke 0.',
  },
  {
    slug: 'yufan-lingmao-cyvet', felt: 'ros2',
    fra: 'Til forskel fra GENISOM L2\'s roamerx-repo (afvist i genisom-gangben-l2.yaml pga. et eksplicit "TODO" paa hardware-koblingen) er der her ingen tilsvarende forbehold i kilden selv.',
    til: 'Til forskel fra GENISOM L2\'s roamerx-repo (afvist dér pga. et eksplicit "TODO" paa hardware-koblingen) er der her ingen tilsvarende forbehold i kilden selv.',
  },
];
