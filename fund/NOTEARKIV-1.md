# NOTEARKIV-1.md — interne noter flyttet ud af `data/robots/*.yaml`

Bygget under spor/noter (27. aug 2026), punkt Å25a i briefet. Grundlaget er
`fund/FUND-forbehold.md` afsnit 3b: 100 af 325 offentlige noter (regex-gulv, ikke facit)
bar intern revisionstekst - STOPPROEVE-verdikter, regel-/L-nummerhenvisninger, filnavne,
sessionsnavne, skemamangel-klager og katalogdesign-metakommentar.

**Alle 189 noter herunder er læst enkeltvis og dømt, ikke fundet med en regex.** (186 ved
første læsning + 3 rettet 27. aug 2026, da en efterprøvning af den byggede side fandt
interne feltnavne overlevet i tre noter, der oprindeligt blev dømt læservendte - se de
mærkede afsnit under bhairav-robotics-shvana, galileo-s1-w og microrobotech-movenew-p1.)
De er citeret ORDRET fra deres YAML-kilde (kun \" og \\-escape er fjernet) og er
FJERNET fra `noter:`-blokken i den tilhørende robotfil, i den rækkefølge, dette dokument
blev skrevet, jf. Å15's regel: en note slettes aldrig, før arkivet er efterprøvet at bære den.

Nummeret i firkantet parentes er notens oprindelige indeks i YAML-filens `noter:`-liste
(0-tal), så en fremtidig læser kan finde den præcise position, hvis git-historikken skal
efterprøves.

---

## addverb-trakr-20

**[0]** STOPPROEVE (firbenet): BESTAAET, samme grundlag som Trakr 5 - samme produktside, samme quadruped-sprogbrug, samme afsnit foer fane-vaelgeren. Sidens egen broedtekst for netop denne fane: "Trakr 20 is the heavy-duty quadruped. 20 kg carry, rock-steady under load."

**[1]** STOPPROEVE (reelt produkt): BESTAAET, samme grundlag som Trakr 5 - se den fils noter.

**[2]** TRAKR 20'S EGEN SPECIFIKATIONSTABEL ER IKKE BRUGT, MED EEN UNDTAGELSE. Den hentede statiske HTML for Trakr 20-fanen (https://addverb.ai/trakr, hentet 2026-08-25) viser MECHANICAL-gruppen med noejagtig samme tal som Trakr 5 (WEIGHT: 18 KG, STANDING HEIGHT: 280 MM, PAYLOAD: 5 KG) - selvom sidens EGEN broedtekst for netop denne fane siger "20 kg carry". Det er en direkte selvmodsigelse inden for samme fane. De oevrige otte specifikationsgrupper (MOBILITY, ACTUATION, COMPUTE, COMMUNICATION, SENSORS, ENVIRONMENT, CHARGING, OPTIONAL) staar helt uden vaerdier for denne fane i den hentede HTML - kun gruppeoverskrifter, ingen tal. Vurderet som en overfoerselsfejl i sidens fane-komponent (sandsynligvis Framer-baseret client-side rendering, hvor kun ELECTRICAL & BATTERY-gruppen reelt blev ombundet til fane 2, mens MECHANICAL-gruppens tekstlag beholdt fane 1's statiske vaerdier). ELECTRICAL & BATTERY-gruppen viste AFVIGENDE tal for fane 2 (VOLTAGE 48V mod Trakr 5's 24V, BATTERY CAPACITY 8AH mod 10AH, ENDURANCE 2 HRS mod 1.5 HRS) - disse KUNNE vaere ægte Trakr 20-tal, men er BEVIDST IKKE brugt i denne fil: naar en fane-blok beviseligt indeholder mindst eet forkert tal (payload) uden nogen ekstern bekraeftelse for de oevrige, kan ingen af blokkens tal skelnes fra en fejl (regel 1). WebFetch (uafhaengig AI-opsummering af samme side) naaede samme konklusion: "the complete TRAKR 20 specification table is not provided in the source material". Ingen brochure-PDF-link blev fundet i den statiske HTML (kun en "DOWNLOAD BROCHURE"-knap uden synligt href) - kunne ikke efterproeves yderligere.

**[3]** NYTTELAST 20 KG ER DEN ENESTE EGENSKAB, DER HAR UAFHAENGIG BEKRAEFTELSE UD OVER DEN UPAALIDELIGE TABEL: BAADE addverb.ai/trakr's egen broedtekst for Trakr 20-fanen ("20 kg carry") OG en selvstaendig kilde paa Addverbs andet eget domaene (addverb.com/press-release/addverb-launches-new-warehouse-robots-trakr-2-0-brisk-and-hoca-at-logimat-india-2025/, 17. feb. 2025, citat af medstifter Bir Singh: "The Trakr 2.0, a quadruped robot, is capable of carrying up to 20 kg") bekraefter samme tal uafhaengigt af den fejlbehaeftede specifikationstabel. Presseartiklen er Addverbs eget materiale (citat af egen medstifter, publiceret paa eget domaene addverb.com), IKKE tredjeparts presseomtale - mærket kildetype sekundaer, fordi det ikke er selve produktsiden. "Trakr 2.0" er sandsynligvis navnet, Trakr 20 hed foer den nuvaerende Trakr 5/Trakr 20-navngivning (samme 20 kg-taeraskel, samme robottype).

---

## addverb-trakr-5

**[0]** STOPPROEVE (firbenet): BESTAAET, entydigt. Sidens egen titel: "Trakr | Quadruped Robot for Surveillance & Inspection". Meta-description: "Trakr is Addverb's agile quadruped robot for industrial inspection and security". Broedtekst: "Our quadruped robot is engineered to conquer complex industrial terrain." https://addverb.ai/trakr, hentet 2026-08-25.

**[1]** STOPPROEVE (reelt produkt, ikke legetoej/hobbykit): BESTAAET. Dedikeret produktside med fuld teknisk specifikationstabel, "DOWNLOAD BROCHURE"- og "INQUIRE ABOUT ADD-ONS"-knapper, en separat "DEV PORTAL" for tredjepartsudvikling, og en blogartikel om lancering paa Addverbs eget BotValley-anlaeg daekket af India Today. Addverb er en etableret, velfinansieret indisk robotikvirksomhed (ikke en ny opstart). Ingen tegn paa undervisningskit-karakter (modsat L11's navngivne eksempler).

**[2]** TO VARIANTER PAA SAMME SIDE, TRAKR 20'S EGEN TABEL ER UPAALIDELIG: siden har en fane-vaelger ("2 VARIANTS AVAILABLE", "COMPARE", "TRAKR 5"/"TRAKR 20"). Trakr 5's tabel (denne fil) er fuldt og konsistent udfyldt. Trakr 20's tabel viser TIL GENGAELD samme MECHANICAL-vaerdier som Trakr 5 (18 KG, 280 MM, PAYLOAD: 5 KG) - selvom sidens EGEN broedtekst siger "Trakr 20 is the heavy-duty quadruped. 20 kg carry" for netop denne fane. Det er en direkte selvmodsigelse inden for samme side/samme variant, og de oevrige otte specifikationsgrupper (MOBILITY, ACTUATION, COMPUTE osv.) staar helt uden vaerdier for Trakr 20-fanen i den hentede statiske HTML. Vurderet som en overfoerselsfejl i sidens fane-komponent (Framer), ikke virkelige Trakr 20-tal - se addverb-trakr-20.yaml for den fulde konsekvens af dette fund. Raw HTML gemt til efterproevning.

**[3]** BLOGGENS TREDJE PAYLOAD-TAL, IKKE BRUGT: addverb.ai/blog/trakr-indias-homegrown-robotic-dog-quadruped's resume-linje skriver "carries a 5 kg and 10 kg payload" - et 10 kg-tal, der hverken matcher denne fils 5 kg eller Trakr 20's 20 kg. Ikke brugt til noget felt, kun noteret som endnu en intern uoverensstemmelse i Addverbs eget materiale over tid (blog dateret 15. dec. 2025, formentlig foer den nuvaerende Trakr 5/Trakr 20-opdeling var endeligt navngivet).

---

## anybotics-anymal-x

**[1]** PROJEKTETS BEDSTE ARGUMENT, OG DET LIGNER ET NEDERLAG. Den robot i feltet, der har den staerkeste europaeiske certificering - ATEX og IECEx op til Zone 1 IIB, det papir der afgoer, om en maskine overhovedet maa ind paa et raffinaderi - har den naestlaveste specifikationstaethed i hele indsamlingen. Taethed maaler AABENHED, ikke EGNETHED. Sorterer kataloget paa taethed som standard, lander den robot, en dansk procesindustri faktisk maa koebe, i bunden.

**[2]** SKEMAET MANGLER ET FELT: ex_certificering. ATEX/IECEx-zoneklassifikation kan ikke skrives ind i nogen af de 33 felter uden at blive kvalt i ce_oplyst. Producentens ordrette tekst: ATEX & IECEx certified up to Zone 1 IIB; Certified for up to Zone 1 where inflammable gases are likely to occur; intrinsically safe. Forslag: ex_certificering med standard (ATEX|IECEx), zone (0|1|2) og gasgruppe (IIA|IIB|IIC), og ikke_oplyst som foerstegangsvaerdi for alle andre poster.

---

## astrall-dynamics-hypertron-t01

**[0]** STOPPROEVE (firbenet/hjul-ben-hybrid): Produktsiden kalder maskinen entydigt "重负载行业级轮足机器狗" (tunglast industri-klasse hjul-fod-robothund) og "重载四足机器人平台" (tunglast firbenet robotplatform) med "轮足式设计结构" (hjul-fod-designstruktur). Kilde: https://www.astralldynamics.com/project-Hypertron-T01.html, hentet 2026-08-24. Det er en hjul-ben-hybrid, som opgavebrevet eksplicit taeller som firbenet.

**[1]** Selskabets kinesiske navn er 深圳璇玑动力科技(有限公司), forkortet 璇玑动力 (Xuanji Power/Dynamics). Det engelske brand paa selskabets egen side er "ASTRALL"/"Astrall Dynamics" (om-os-siden: "深圳璇玑动力科技（以下简称：璇玑动力）"; footer: "深圳璇玑动力科技有限公司"; e-mail contact@astralldynamics.com). Producentfeltet her bruger det engelske selvvalgte navn, samme princip som MagicLab/魔法原子.

**[2]** SITE-INKONSISTENS FUNDET, IKKE BRUGT: forsidens 'hero'-boks paa produktsiden viser fire store tal - 100 km/h, 50 km raekkevidde, 300 kg last, 50 N·m moment - under overskriften "A01全地形机器人" (et ANDET modelnavn end "Hypertron-T01"). Billedfilerne bag boksen hedder ordret a01-shoux1.png / a01-shoux-hexin.png. Disse tal MODSIGER den detaljerede 产品参数-tabel laengere nede paa samme side (maks. hastighed 7 m/s, maks. staaende last 200 kg, moment 50/300 N·m raekkefolge byttet om). Vurderet som skabelontekst/billede genbrugt fra en anden/generisk produktside og ikke som Hypertron-T01's egne tal - derfor IKKE brugt i felterne nedenfor. Baade hero-tallene og filnavnene er gemt i media/_kilder/raa-kand2-2026-08-24/ til efterproevning.

**[3]** "俯卧尺寸（长×宽×高）1130mm*755mm*320mm" (liggende maal) er ogsaa oplyst, men skemaet har ingen felter til foldemaal (L30) - noteret her i stedet for hoejde-feltet.

**[4]** 驱动&电机: encoder "双编码器" og moment "额定/最大扭矩: 50 N·m / 300 N·m" har intet felt i skemaet - der findes intet ledmoment-felt. Noteret her.

**[5]** 储存温度 (opbevaringstemperatur, adskilt fra arbejdstemperatur): -20℃~60℃. Skemaets temp_min/temp_maks er arbejdstemperatur (工作温度); opbevaringstemperaturen har intet eget felt.

**[6]** En engelsk pressemeddelelse (GlobeNewswire, 2026-06-07, "Astrall Dynamics Unveils Integrated Quadruped Firefighting Robot Hypertron-T01 at INTERSCHUTZ 2026") naevner i WebSearch-uddrag IP67 (mod IP66 paa den kinesiske produktside) samt en integreret 20L/s brandkanon med 60 m raekkevidde. Denne kilde kunne IKKE hentes direkte (WebFetch og curl gav begge timeout mod globenewswire.com efter flere forsoeg) og er derfor IKKE brugt til noget feltvaerdi - kun noteret her som en ueftereproevet selvmodsigelse (IP66 vs. IP67), der boer afklares naeste gang siden er tilgaengelig.

**[7]** PDF-OPFYLDNINGSRUNDEN (2026-08-25): fem arkiverede Astrall Dynamics-nyhedsartikler blev laest fuldt til. Ingen af dem handler om Hypertron-T01's egne specifikationer - de daekker firmaets generelle motor-/ledmodulteknologi (轴向磁通电机/aksial-flux-motor), et nyt billedoverfoerings-fjernbetjeningssystem vist paa to droneremesser, og en investeringsrunde (兰璞创投). IP66/IP67-modsigelsen forbliver derfor UAFKLARET - GlobeNewswire-pressemeddelelsen, som naevner IP67, kunne stadig ikke hentes. Ingen af de ti tilbageværende ikke_oplyst-felter (frihedsgrader, batteri_wh, hot_swap, ladetid, compute, ros2, sdk_sprog, monteringsinterface, pris, ce_oplyst) kunne fyldes fra dette materiale.

---

## bhairav-robotics-shvana

**[0]** STOPPROEVE (firbenet): BESTAAET, med et direkte og eksplicit producentcitat - ikke kun en afledning: "Bhairav Robotics unveils Bharat's first armed quadruped 'Shvana (श्वान)'". Kilde: https://bhairavrobotics.com/shvana-robot/, hentet 2026-08-24 (raa HTML gemt, verificeret - se noten om sidens fulde indhold nedenfor). Samme ord ("quadruped") staar ogsaa paa forsiden: "Armed Quadruped UGV Made in India", https://bhairavrobotics.com/, hentet 2026-08-24.

**[1]** STOPPROEVE (reelt produkt, ikke legetoej/hobbykit): BESTAAET paa firma- og formaalsniveau, men med forbehold om PRODUKTIONSSTATUS (se naeste note). Siden beskriver udelukkende militaere og industrielle anvendelser (Defence & Homeland Security, Industrial Environments) - ingen forbruger-, legetoejs- eller hobbysprog noget sted. Firmaet er et registreret indisk selskab med et team af ingenioerer med 25+ aars erfaring i forsvarsindustrien ("MohanRaj Gangadharan ... 25+ years of experience in design and manufacturing of numerous products for defense industry"; "Ramakrishna Commuri ... 25+ years of experience... building drones for armed forces"), https://bhairavrobotics.com/, hentet 2026-08-24. IKKE brugt som feltkilde, kun som kontekst for stopproeven: en ekstern soegning (Dealroom) fandt at Zen Technologies Limited (indisk forsvarsboers-selskab) i 2025 tog en ejerandel paa 45,33% i Bhairav Robotics - bekraefter et reelt, kapitaliseret selskab, men er presseformidlet/tredjepart og indgaar derfor IKKE i noget felt (L21/L33).

**[3]** VAEGT ER EKSPLICIT UDEN NYTTELAST: "Weight: 25 kg (minus payload)" - grundvaegten er 25 kg UDEN den paafoerte nyttelast. En eventuel totalvaegt med fuld 10 kg nyttelast (op til 35 kg) er ALDRIG oplyst af producenten og er derfor ikke udregnet eller skrevet nogen steder i denne post (regel 1 - vi gaetter ikke et tal, producenten ikke selv har skrevet).

**[4]** NYTTELAST PLACERET SOM GAAENDE, IKKE STAAENDE: siden skelner ikke selv mellem gaaende/staaende nyttelast - der staar kun ét tal, "Payload: 10 kg". Placeret under nyttelast_gaaende, fordi al anvendelsestekst handler om at baere/goere noget UNDER bevaegelse ("Shvana can carry can also walk in the field areas/shopfloor along the designated path to carry out required tasks"), ikke om en staaende last. nyttelast_staaende staar derfor ikke_oplyst, ikke 0 - samme fortolkningsprincip som brugt i data/robots/yufan-lingmao-cyvet.yaml.

**[5]** KAMERAER BEVIDST IKKE SAT TIL EN VAERDI: siden skriver kvalitativt at Shvana er "packed with a suite of sensors that act like eyes and ears" og naevner "Vision based detection and recognition" som en evne - men navngiver INTET kameratype, -antal eller -model som STANDARDUDSTYR. "high resolution RGB/thermal cameras" naevnes eksplicit kun som ET EKSEMPEL PAA EN NYTTELAST, Shvana KAN baere ("A few payloads Shvana can carry include robotic arm, high resolution RGB/thermal cameras and specialized sensors") - altsaa tilbehoer, ikke bekraeftet indbygget udstyr. De to udsagn modsiger ikke hinanden, men entydiggoer heller ikke, om der er indbyggede kameraer. Sat til ikke_oplyst frem for at gaette, hvilken af de to der gaelder (samme princip som lidar-haandteringen i data/robots/genisom-gangben-l2.yaml).

**[7]** KOMMUNIKATION (LTE/RF) HAR INTET SKEMAFELT: "Communication: LTE, RF" er robottens egen fjernstyrings-/dataforbindelse, ikke fysiske dataporte til tilbehoer (jf. samme afgraensning som Keybotic Keypers WiFi/Ethernet-afsnit, se data/robots/keybotic-keyper.yaml). Noteret her, ikke brugt til at udfylde dataporte.

**[8]** MONTERINGSINTERFACE BEVIDST SAT TIL IKKE_OPLYST: producenten naevner "payloads Shvana can carry include robotic arm, high resolution RGB/thermal cameras and specialized sensors" - en KATEGORILISTE, men ingen monteringsstandard, boltmoenster, spaending eller lastkapacitet for selve grafnsefladen (i modsaetning til fx Cyvet, hvor siden eksplicit oplyser "20kg industrial payload platform"). At genbruge nyttelast-teksten som monteringsinterface ville kun gentage nyttelast_gaaende uden ny oplysning - derfor ikke_oplyst.

*(Efterindsat 27. aug 2026 ved efterproevning af den byggede side: noten indeholder det interne feltnavn `nyttelast_gaaende` og blev omklassificeret fra "laeservendt" til "intern" efter foerste fase A/B-koersel - se rapportens afsnit om de tre rettede fejlklassifikationer.)*

**[10]** BILLEDE: billedport-spor 26. aug 2026 vurderede begge kandidater med oejne. pic1.png (staaende ben-udgave, sort baggrund, intet paaskrevet tekst ud over robottens eget logo) blev godkendt og brugt. pic4.png viser en hjul-variant af Shvana, som denne post ikke handler om, og blev derfor IKKE brugt.

---

## cvte-maxhub-x7

**[0]** STOPPROEVE (firbenet): Producentens EGEN produktside hedder ordret "四足机器人 X7" ("Quadruped Robot X7") og staar i CVTE's produktnavigation under 机器人 > 四足机器人 (/product/quadrupedrobot). Nyhedsartiklen fra samme domaene skriver: "视源股份自主研发的高性能工业级四足机器人MAXHUB X7首次亮相" (CVTE's selvudviklede hoejtydende industrielle FIRBENEDE robot MAXHUB X7 debuterer). Kilder: https://www.cvte.com/product/quadrupedrobot og https://www.cvte.com/news/detail/161afb60-856a-11f0-bd5d-fb86232a40db, begge hentet 2026-08-24.

**[1]** cvte.com har baade en dedikeret produktside (/product/quadrupedrobot) og flere nyhedsartikler om X7, ingen af dem set af det tidligere messespor.

**[2]** ARTIKLENS DATO MODSIGER MESSERAPPORTENS ANTAGELSE OM WRC 2026: CVTE's egen nyhedsartikel om X7's debut er dateret 2025-08-08, og handler eksplicit om "2025世界机器人大会" (World Robot Conference 2025), IKKE 2026. X7 debuterede altsaa for et aar siden, ikke ved den aktuelle WRC. Produktet har siden vaeret i felten: samme domaene har en separat artikel ("21000公里！小C家'机器狗'年度总结曝光", cvte.com/news/detail/b215d840-e9d4-11f0-9573-c1812bef4fc9) om en 21.000 km kumuleret driftsdistance og en vundet "最佳越障突破奖" (bedste forhindringsgennembrudspris) ved et Guangzhou Tower-arrangement - lagt til grund for status i_produktion, men disse to tal (21.000 km, prisnavn) er begivenheds-/PR-tal, ikke specifikationer, og indgaar derfor IKKE i felter.

**[6]** PDF-OPFYLDNINGSRUNDEN (2026-08-25): intet CVTE-PDF-datablad fundet i det arvede arkiv. Et forsoeg paa at hente produktsiden (https://www.cvte.com/product/quadrupedrobot) paa ny bekraeftede blot samme oplysninger som allerede i felterne - ingen download-/PDF-link fundet paa siden. Ingen af de 20 tilbageværende ikke_oplyst-felter kunne fyldes.

---

## deep-robotics-lynx-m20s

**[1]** Indsamlingens taetteste post (18 af 31 felter). Den bryder robotdata-skillens advarselstaerskel paa 55 %, men alle 18 felter staar i producentens egen tabel paa producentens eget domaene. Det er taersklen, der skal justeres, ikke posten.

---

## deep-robotics-mini

**[0]** Billedport 24. aug 2026: billede fjernet. Det tidligere billede (deep-robotics-mini-3.png) var et LiDAR-punktskybillede, ikke et foto af robotten - fejlklassificeret som fabrikantfoto ved indsamlingen. De fire oevrige arkivkandidater (mini-1, -2, -4, -5) kunne ikke efterproeves foer denne sessions billedlaesekvote blev opbrugt; billedet er derfor slettet, ikke byttet. Skal gennemses paa ny naar kvoten er tilgaengelig.

**[1]** Billed3 25. aug 2026: nyt billede fundet direkte paa Mini-produktsiden (pro2_main.png, det billede siden selv bruger som hovedbillede for Mini). Blaat/sort glansrender, hele maskinen, hvid/transparent baggrund, intet tekstoverlay - bestod. Afviste undervejs: deep-robotics-mini-7.png, en 3D-terraengengivelse/pointcloud-visualisering med et lille indlejret foto - gentager NOEJAGTIGT samme fejlmoenster som det oprindeligt afviste billede (teknisk visualisering, ikke et foto); deep-robotics-mini-8.png viste sig slet ikke at vaere robotten, men et menneske-positurgenkendelses-demofoto med fire personer og skeletoverlay.

---

## galileo-c1-w

**[0]** STOPPROEVE (hjul-ben-hybrid, ikke ren hjulplatform): bestaaet, MED forbehold. Producentens egen model-tabel-overskrift: "【C1-W工业小型】智能仿生轮足机器人" (C1-W lille industrimodel - intelligent bionisk HJUL-BEN-robot, "轮足" = hjul+fod). Samme moenster som Unitree B2/B2-W: robotten staar under samme "智能仿生四足机器人"-manual/produktfamilie som den rent gaaende C1, med et navngivet "轮足" (hjul-ben) kendetegn, ikke en ren hjulplatform.

**[1]** IKKE LEGETOEJ (L11): nej - samme begrundelse som C1.

**[2]** KILDETYPE SEKUNDAER (L33): se galileo-c1.yaml's tilsvarende note - samme PDF, samme begrundelse.

**[3]** GENBRUGT EVIDENS: se galileo-c1.yaml.

**[4]** TABEL-TERMINOLOGI FOR KLATREEVNE: C1-W's tabel skriver "正向高度差70cm高台" (fremadrettet hoejdeforskel, 70cm platform) - mappet til forhindring_enkelt, IKKE trappetrin_kontinuerlig, i modsaetning til den gaaende C1's "20cm高连续台阶". De to modeller bruger forskellige formuleringer for samme raekkenavn i tabellen, konsekvent med skemaets to-felts-opdeling (regel 7) - se galileo-c1.yaml's topnote.

---

## galileo-c1

**[0]** STOPPROEVE (firbenet): bestaaet, entydigt. Producentens egen model-tabel-overskrift: "【C1工业小型】智能仿生四足机器人" (C1 lille industrimodel - intelligent bionisk FIRBENET robot). Hele manualens titel er "智能仿生四足机器人 / INTELLIGENT BIONIC QUADRUPED ROBOT".

**[1]** IKKE LEGETOEJ (L11): nej. Anvendelser (lufthavn/togstation/grænsepatrulje, brandvæsen, industriinspektion, militaer/politi "武装反恐") og en fuld teknisk specifikationstabel med enheder placerer produktet klart uden for legetoejs-/hobbykit-kategorien.

**[3]** KILDETYPE SEKUNDAER (L33): PDF'en er uploadet af Galileo selv til World Robot Conferences officielle udstillerprofilside (worldrobotconference.com), ikke hentet fra Galileos eget domæne (galileotime.com). galileotime.com er en tung Vue/React-SPA, der ikke lod sig hente statisk - dette er den bedste tilgaengelige kilde til Galileos tekniske specifikationer, men mærket sekundær per L33, saa det er synligt at den ikke kommer direkte fra producentens eget domæne.

**[4]** TABEL-TERMINOLOGI FOR KLATREEVNE: C1's tabel skriver "可攀爬高度: 20cm高连续台阶" (klatrehoejde: 20cm kontinuerligt trappetrin) - "连续台阶" (kontinuerlig trin/trappe) mappet til trappetrin_kontinuerlig. C1-W's tilsvarende raekke skriver i stedet "正向高度差70cm高台" (fremadrettet hoejdeforskel, 70cm platform) - mappet til forhindring_enkelt paa C1-W's egen post. De to modeller bruger FORSKELLIGE formuleringer for samme raekkenavn, konsekvent med skemaets to-felts-opdeling (regel 7).

**[5]** DRIFTSTID UDEN LASTBETINGELSE: C1's "续航时间: 3.5h～6h" har intet kg-tal - ved_last er derfor ikke_oplyst, i modsaetning til S1/S1-W, hvis tabeller eksplicit skriver "(20kg负载)".

**[8]** IKKE MEDTAGET: 通信 (WIFI/4G/5G-traadloes forbindelse) og 通信带宽 (≤20M) staar i tabellen, men skemaet har intet felt for traadloes forbindelse (kun dataporte for FYSISKE porte). Ikke tvunget ind i noget felt. Samme for 语音交互 (选配/tilvalg), som er lagt i autonominiveau i stedet.

---

## galileo-e1-w

**[0]** STOPPROEVE (hjul-ben-hybrid, ikke ren hjulplatform): bestaaet, MED forbehold. Producentens egen model-tabel-overskrift: "【E1-W工业中型】智能仿生轮足机器人" (E1-W mellemstor industrimodel - intelligent bionisk HJUL-BEN-robot). Samme moenster som C1/C1-W.

**[1]** IKKE LEGETOEJ (L11): nej - samme begrundelse som C1.

**[2]** KILDETYPE SEKUNDAER (L33) og GENBRUGT EVIDENS: se galileo-c1.yaml.

**[3]** SIDELAYOUT-AFVIGELSE VED UDTRAEK og TILDELING AF VAERDIBLOK: se galileo-e1.yaml's topnoter for den fulde begrundelse - samme problematik gaelder her. Blokken med "正向高度差1m高台" (platform-hoejde-formulering, samme moenster som C1-W) er tildelt E1-W.

**[6]** STROEM_UD-VAERDIEN ER EN ANALOGISLUTNING: se galileo-e1.yaml's stroem_ud-advarsel - "5V；12V；48V" er brugt for baade E1 og E1-W, da vaerdien kun optraadte ÉN gang i det udtrukne tekstlag.

---

## galileo-e1

**[0]** STOPPROEVE (firbenet): bestaaet, entydigt. Producentens egen model-tabel-overskrift: "【E1工业中型】智能仿生四足机器人" (E1 mellemstor industrimodel - intelligent bionisk FIRBENET robot).

**[1]** IKKE LEGETOEJ (L11): nej - samme begrundelse som C1.

**[2]** KILDETYPE SEKUNDAER (L33) og GENBRUGT EVIDENS: se galileo-c1.yaml.

**[3]** SIDELAYOUT-AFVIGELSE VED UDTRAEK: E1/E1-W's side (manualens side 8) har en mere sammenfiltret tekstraekkefoelge end C1/C1-W og S1/S1-W's sider ved det tekstudtraek, der matte bygges i mangel af pdftoppm. SAERLIGT: "外接电源接口"-vaerdien "5V；12V；48V" optraadte kun ÉN gang i den udtrukne raekkefoelge (i slutningen af sideteksten) i stedet for to gange (én gang per model), selvom begge modellers labelliste efterspurgte den. Da C1/C1-W-parret havde IDENTISK vaerdi for dette felt paa begge varianter, er den samme vaerdi brugt for baade E1 og E1-W her - en analogislutning, ikke en uafhaengigt bekraeftet aflaesning for E1-W specifikt. Se advarslen paa stroem_ud.

**[5]** TILDELING AF DE TO VAERDIBLOKKE TIL E1 HHV. E1-W: siden har TO saet elektriske/motoriske parametre efter hinanden, uden entydig visuel raekkefoelge i det udtrukne tekstlag. Tildelingen her er baseret paa INDHOLDET, ikke positionen: blokken med "30cm高连续台阶" (kontinuerlig trappe, samme formulering som den gaaende C1) er tildelt E1, og blokken med "正向高度差1m高台" (platform-hoejde, samme formulering som den hjulbenede C1-W) er tildelt E1-W. Denne indholdsbaserede tildeling er mere paalidelig end tekstens raekkefoelge, men er stadig en tolkning - flagget her som en usikkerhed.

---

## galileo-s1-w

**[0]** STOPPROEVE (hjul-ben-hybrid, ikke ren hjulplatform): bestaaet, MED forbehold. Producentens egen model-tabel-overskrift: "【S1-W工业大型】智能仿生轮足机器人" (S1-W stor industrimodel - intelligent bionisk HJUL-BEN-robot). Samme moenster som C1/C1-W og E1/E1-W.

**[1]** IKKE LEGETOEJ (L11): nej - samme begrundelse som C1. Kataloget tungeste Galileo-model (85kg egenvaegt, 120kg maks. nyttelast).

**[2]** KILDETYPE SEKUNDAER (L33) og GENBRUGT EVIDENS: se galileo-c1.yaml.

**[3]** S1-W HAR OGSAA BEGGE KLATREFELTER UDFYLDT: tabellen skriver "可攀爬高度: 25cm高连续台阶" OG (paa naeste linje i samme raekke) "正向高度差110cm高台" - ligesom S1 (se galileo-s1.yaml), men med en markant hoejere platform-vaerdi (110cm mod S1's 40cm) - forventeligt for hjulbenet variant, som ogsaa saas mellem C1/C1-W (70cm) og E1/E1-W (100cm).

*(Efterindsat 27. aug 2026 ved efterproevning af den byggede side: noten indeholder filreferencen `galileo-s1.yaml` og blev omklassificeret fra "laeservendt" til "intern" efter foerste fase A/B-koersel.)*

**[4]** DRIFTSTID MED EKSPLICIT LASTBETINGELSE: "续航时间: 4h（20kg负载）～6h" - samme moenster som S1: ved_last=20kg for laveste tal.

---

## galileo-s1

**[0]** STOPPROEVE (firbenet): bestaaet, entydigt. Producentens egen model-tabel-overskrift: "【S1工业大型】智能仿生四足机器人" (S1 stor industrimodel - intelligent bionisk FIRBENET robot).

**[1]** IKKE LEGETOEJ (L11): nej - samme begrundelse som C1. Kataloget stoerste/tungeste Galileo-model (120kg maks. nyttelast).

**[2]** KILDETYPE SEKUNDAER (L33) og GENBRUGT EVIDENS: se galileo-c1.yaml.

**[4]** DRIFTSTID MED EKSPLICIT LASTBETINGELSE: "续航时间: 5h（20kg负载）～7.5h" - S1 er den FOERSTE Galileo-model i denne runde med en tallastbetingelse (20kg) paa driftstiden, jf. regel 8. ved_last er derfor sat til 20kg, IKKE ikke_oplyst som paa C1/C1-W/E1/E1-W.

**[5]** IKKE MEDTAGET I NOGET FELT: "最大跳跃深堑宽度1.2m,最大跳远距离1.6m" (maks. springbredde over en groeft 1.2m, maks. springlaengde 1.6m) - skemaet har intet springfelt. Kun naevnt her for fuldstaendighedens skyld, ikke opfundet ind i et eksisterende felt.

---

## genisom-gangben-l1-w

**[0]** STOPPROEVE (firbenet, hjul-ben-hybrid): bestaaet. Meta-keywords paa L1-W's egen produktside: "具身智能,四足机器人,机器狗,行业级机器人,钢镚L1,铜锤M1,轮足机器人,..." (四足机器人 = quadruped robot). Meta-description: "钢镚L1-W是智身科技推出的首款行业级轮式四足机器人" (Gangben L1-W er GENISOM AI's foerste industriklasse hjul-firbenede robot). Sidens egen overskrift: "钢镚 L1-W - 首款小型行业级轮式四足机器人" (foerste smaa industriklasse hjul-firbenede robot). https://www.genisomai.com/product-robot/L1-W, hentet 2026-08-24. Hjul-ben-hybrid (12 ledmotorer + 4 hjulnavmotorer, jf. "高性能轮毂电机: 4 个" i den strukturerede specifikationstabel) - taeller efter opgavens egen regel om at hjul-ben-hybrider er firbenede, samme princip som Unitree B2-W.

**[2]** PRODUKTIONSTAL 15.000+ ENHEDER DAEKKER HELE KATALOGET: se genisom-gangben-l1.yaml for den fulde efterproevning - tallet er ikke opdelt pr. model og gentages derfor ikke her.

**[3]** TO SOEGENDE MODELLER IKKE BYGGET DENNE RUNDE: L1-W's egen produktside naevner "钢镚 L1-W EDU" (NVIDIA Orin NX, op til 100 TOPS, indbygget 3D LiDAR, dybdekamera, GNSS og 5G) som en selvstaendig konfiguration under "形态百变, 场景无界" - INGEN egen produktside fundet (kun en tekstboks paa L1-W's side), ikke efterproevet med samme kildedisciplin. Desuden findes tre navngivne undermodeller "ZSL-1 Air/Pro/Max" i en model-vaelger nederst paa siden uden synlige separate specifikationer i denne HTML - heller ikke bygget.

---

## genisom-gangben-l1

**[0]** STOPPROEVE (firbenet): bestaaet, entydigt. Meta-keywords paa producentens egen produktside: "具身智能,四足机器人,机器狗,行业级机器人,钢镚L1,..." (fire ben; 四足机器人 = quadruped robot, 机器狗 = robot dog). Meta-description: "钢镚L1是智身科技自主研发的首款行业级小型四足机器人" (Gangben L1 er GENISOM AI's selvudviklede foerste industriklasse smaa firbenede robot). https://www.genisomai.com/product-robot/L1, hentet 2026-08-24. L1 er en ren gaaende ("点足", punktfod) model, ikke en hjul-ben-hybrid.

**[1]** PRODUKTIONSTAL 15.000+ ENHEDER: EFTERPROEVET SOM PRODUCENTENS EGET, IKKE KUN PRESSENS. Homepage genisomai.com viser billedtekst "累计量产突破 15,000 台" (kumuleret produktion har passeret 15.000 enheder) direkte i en heltalsgrafik paa forsiden. Selskabets egen om-os-side gentager det i en tidslinje: "2026年6月底，完成了第15000台行业级具身智能机器人的量产" (ved udgangen af juni 2026 blev produktion af den 15.000. industriklasse embodied-AI-robot fuldfoert). Begge citater er hentet direkte fra genisomai.com (hhv. forsiden og /aboutus.html, hentet 2026-08-24), ikke fra pressemateriale. Tidligere kilde for tallet var pressen (Sohu) - denne runde bekraefter, at producenten selv trykker det samme tal paa egen hjemmeside. Tallet DAEKKER HELE GENISOM-KATALOGET (Gangben L1/L1-W/L2 + Tongchui M1), ikke L1 alene - producenten opdeler ikke tallet pr. model.

**[2]** GANGBEN-SERIEN ER STOERRE END DE TO POSTER I DENNE OMGANG. Fundet paa genisomai.com, men IKKE bygget som selvstaendige poster: 钢镚 L1-W (hjul-ben-variant af L1), 钢镚 L1 Maker (undervisningsudgave af L1), 钢镚 L2-W og 钢镚 L2-W Ultra (hjul-ben-varianter af L2, dokumenteret i L2's egen tekniske JSON-tabel). Desuden fandtes to selvstaendige produktlinjer hos samme producent, der IKKE hedder "钢镚"/Gangben: 铜锤 M1 (Tongchui M1, mellemklasse firbenet robot, egen produktside genisomai.com/product-robot/M1) og 铅球 SP1 (Qiuqiu SP1, eksplosionssikker hjul-ben firbenet robot). Alle er bekraeftet firbenede efter producentens egne ord, men er UDENFOR denne opgaves navngivne omfang ("Gangben-serien") og er ikke efterproevet mod raa HTML paa samme niveau som L1/L2. Angivet her, saa et fravalg ikke forveksles med en forglemmelse.

**[3]** SENSOR-UOVERENSSTEMMELSE MELLEM MARKEDSFOERINGSTEKST OG SPECIFIKATIONSTABEL, IKKE LOEST STILTIENDE: se samme problem paa genisom-gangben-l2.yaml (L2's egen side har samme moenster). L1's egen JSON-specifikationstabel naevner INGEN LiDAR for basismodellen - kun bredvinkelkamera og IMU.

**[4]** REGELAENDRING (CEO'en, under dette spor): producentens eget materiale ud over produktsiden - PDF-datablade, manualer, udviklerdokumentation - taeller nu ogsaa som gyldig kilde, mod at det maerkes kildetype: sekundaer. Brugt til sdk_sprog nedenfor: github.com/zsibot er GENISOM AI's egen officielle GitHub-organisation (linket direkte fra genisomai.com/download.html: "官方 GitHub: https://github.com/zsibot/"). Repoet "genisom_L1_sdk" er eksplicit navngivet "Official SDK for Genisom L1 Series robots" og README'en skriver "基于 C++20 开发" (udviklet med C++20) - ingen ROS/ROS2-omtale i den README. https://github.com/zsibot/genisom_L1_sdk, hentet 2026-08-24.

**[5]** ROS2 IKKE SAT FOR L1, BEVIDST. Et andet repo i samme organisation, genisom_roamerx_open ("Open-source navigation stack for GENISOM-AI robots"), kraever eksplicit "ROS2 Humble Hawksbill" og er "Based on ROS2 Nav2". Men L1's EGEN produktside naevner ikke navigationssystemet "RoamerX" - det er en "新一代"/naeste-generations-funktion, som kun staar paa L2's produktside (se genisom-gangben-l2.yaml). Uden den kobling er der ikke grundlag for at saette ros2: ja paa L1 specifikt - feltet staar derfor ikke_oplyst, med denne begrundelse, i stedet for at antage at hele produktfamilien deler samme navigationsstak.

**[6]** Tredjeparts-WebSearch-sammendrag (ikke direkte efterproevet mod raa HTML) naevner et valgfrit, konfigurerbart sensorsaet for L1 - Intel RealSense dybdekamera, Livox Mid360 LiDAR og NVIDIA Orin NX (op til 100 TOPS) - som IKKE staar i den officielle specifikations-JSON paa produktsiden (den viser kun "8-kernet CPU" og bredvinkelkameraet). Ikke medtaget som data, fordi den ikke kunne bekraeftes i raa HTML.

**[7]** PDF-OPFYLDNINGSRUNDEN (2026-08-25): intet GENISOM-PDF-datablad fundet i arkivet eller paa genisomai.com (kun HTML-produktsider og GitHub). Endnu et repo i zsibot-organisationen, "genisom_robot_sdk", blev laest fuldt til - se genisom-gangben-l2.yaml for hvorfor det IKKE blev brugt (tom GitHub-beskrivelse, ingen modelkobling). L1's egen sdk_sprog (C++, fra genisom_L1_sdk) staar uaendret. Ingen andre ikke_oplyst-felter (nyttelast_staaende, forhindring_enkelt, hot_swap, lidar, monteringsinterface, stroem_ud, dataporte, pris, ce_oplyst) kunne fyldes fra det tilgaengelige materiale.

---

## genisom-gangben-l2-w-ultra

**[0]** STOPPROEVE (firbenet, hjul-ben-hybrid): bestaaet. L2-siden markerer denne variant "轮足环视版" (hjul-fod rundtomsyn-udgave) i techParamsData - samme hjul-ben-hybridtype som L2-W, med et udvidet 360°-sensorsaet oveni.

---

## genisom-gangben-l2-w

**[0]** STOPPROEVE (firbenet, hjul-ben-hybrid): bestaaet. L2-siden markerer denne variant "轮足运动版" (hjul-fod bevaegelsesudgave) i techParamsData - samme princip som Unitree B2-W/MOVENEW T1/Gangben L1-W.

**[1]** INGEN SELVSTAENDIG URL: L2-W har intet eget navigationslink paa genisomai.com - den findes udelukkende som et fane-skift i den strukturerede specifikationstabel paa L2's egen side (https://www.genisomai.com/product-robot/L2, techParamsData.datas[1], classname "钢镚 L2-W", id 1249). Alle feltvaerdier nedenfor er hentet fra netop denne JSON-blok, IKKE fra L2 (id 63, basisudgaven) eller L2-W Ultra (id 1250).

---

## genisom-gangben-l2

**[0]** STOPPROEVE (firbenet): bestaaet, entydigt. Meta-keywords paa producentens egen produktside: "具身智能,四足机器人,机器狗,行业级机器人,钢镚L2,...". Meta-description: "钢镚L2是智身科技自主研发的新一代行业级小型四足机器人" (Gangben L2 er GENISOM AI's selvudviklede naeste-generations industriklasse smaa firbenede robot). https://www.genisomai.com/product-robot/L2, hentet 2026-08-24. Basismodellen ("点足运动版"/punktfod-bevaegelsesudgave) er ren gaaende, ikke hjul-ben.

**[1]** PRODUKTSIDEN VISER TRE VARIANTER I ÉN STRUKTURERET JSON-BLOK: 钢镚 L2 (点足运动版, ren gaaende - denne post), 钢镚 L2-W (轮足运动版, hjul-ben) og 钢镚 L2-W Ultra (轮足环视版, hjul-ben med udvidet sensorpakke). Kun basisudgaven L2 er bygget som selvstaendig post i denne omgang - samme afgraensning som L1 (se genisom-gangben-l1.yaml's noter om Gangben-seriens fulde omfang). L2-W og L2-W Ultra har egne komplette parametersaet i samme kilde-JSON og kan bygges som selvstaendige poster senere uden ny research.

**[2]** PRODUKTIONSTAL 15.000+ ENHEDER: se genisom-gangben-l1.yaml for den fulde efterproevning (producentens eget tal, bekraeftet paa baade forside og /aboutus.html, daekker HELE kataloget - ikke L2 alene).

**[3]** REGELAENDRING (CEO'en, under dette spor): producentens GitHub-organisation (github.com/zsibot, linket fra genisomai.com/download.html) taeller nu som gyldig kilde - mod sekundaer-maerkning. UNDERSOEGT FOR ros2/sdk_sprog, MEN IKKE BRUGT: se advarslen paa ros2-feltet nedenfor for den fulde begrundelse. Kort fortalt: L2's egen produktside naevner "新一代 RoamerX 智能导航系统", og repoet github.com/zsibot/genisom_roamerx_open kraever ROS2 Humble - men repoets eget README skriver "Hardware Deployment: TODO", altsaa at koblingen til et faktisk saelgende produkt IKKE er dokumenteret af producenten selv. Sat til ikke_oplyst i stedet for et gaet, der ikke kan skelnes fra en maaling (regel 1). Se genisom-gangben-l1.yaml for et modeksempel, hvor samme regelaendring GAV et brugbart resultat (sdk_sprog: C++, fordi det repo eksplicit er navngivet den officielle L1-SDK, uden et 'TODO' paa produktkoblingen).

**[5]** BATTERI-Wh: to tal paa samme side, ikke indbyrdes modstridende, men heller ikke krydsbekraeftet af os. Et fremhaevet "kapacitetskort" paa siden skriver "756Wh 大容量电池" (756Wh stor-kapacitetsbatteri) - brugt som feltets vaerdi. Tilbehoerslisten i den strukturerede specifikationstabel skriver separat "电池: 15000mAh" uden spaending. Vi udregner IKKE Wh af mAh (regel 9) - de to tal er blot noteret som fundet paa samme side uden modsigelse.

**[6]** PDF-OPFYLDNINGSRUNDEN (2026-08-25) UNDERSOEGTE, MEN BRUGTE IKKE: endnu et repo i zsibot-organisationen, "genisom_robot_sdk" (github.com/zsibot/genisom_robot_sdk), blev laest fuldt (README.md). Det er en generel C++-motion-control-SDK (Ubuntu 22.04, CMake 3.8+, GCC 11.4, Boost 1.74) - men repoets EGEN GitHub-beskrivelse er TOM (""), i modsaetning til "genisom_L1_sdk", som eksplicit hedder "Official SDK for the Genisom AI L1 Series". Ingen model (L1, L2 eller andet) naevnes noget sted i README'en. Uden en eksplicit kobling til L2 specifikt ville det vaere en gaetning at bruge repoet til L2's sdk_sprog - samme forsigtighed som ros2-feltets begrundelse nedenfor (afvisning af roamerx-koblingen). Feltet sdk_sprog forbliver derfor ikke_oplyst for L2.

---

## genisom-qiuqiu-sp1

**[0]** STOPPROEVE (firbenet, hjul-ben-hybrid): bestaaet, entydigt. Meta-keywords paa SP1's egen produktside: "防爆巡检机器人,四足机器人,机器狗,防爆机器人,防爆机器狗" (四足机器人 = quadruped robot, 机器狗 = robot dog). Sidens egen produktkort naevner eksplicit tre bevaegelsesformer: "匍匐通行" (kravlende gennemgang), "轮式行进" (hjuldrevet fremdrift paa fladt terraen) og "足式越障" (benbaseret forhindringsovervindelse, "稳健攀爬楼梯、跨越台阶及复杂障碍路面" - stabil trappeklatring, trinoverskridelse og komplekst forhindringsterraen). https://www.genisomai.com/product-robot/sp1, hentet 2026-08-24. Hjul-ben-hybrid - taeller efter opgavens egen regel om at hjul-ben-hybrider er firbenede.

**[1]** EKSPLOSIONSKLASSE, IKKE ET SKEMAFELT: sidens hero-badge skriver "Ex d IIC T6 Gb" ("全链路隔爆屏障" - fuld-kaede eksplosionsbarriere, godkendt til zone 1/2 eksplosive gasmiljoeer). Meta-descriptionen skriver en let afvigende streng "Ex IIC T6 Gb" (uden "d") - hero-badgets mere praecise "Ex d IIC T6 Gb" er brugt her som citat i denne note. Skemaet har intet eksplosionssikringsfelt, saa oplysningen kan ikke lande i felter-blokken - noteret her, saa den ikke gaar tabt.

**[2]** LIDAR-FELTET SAT TIL IKKE_OPLYST PAA GRUND AF ET TVETYDIGT ORD, IKKE FORDI INTET BLEV FUNDET: SP1's marketingtekst skriver "感知雷达封装于隔爆视窗之后，保障精准感知" (opfattelsesradar/-lidar indkapslet bag et eksplosionssikkert vindue, sikrer praecis opfattelse). Ordet "雷达" betyder generisk "radar" og bruges ikke her sammen med "激光" (som ellers klart betyder LiDAR paa L2-W Ultra's side: "3D激光雷达"). Uden det praecise ord er det en gaetning at kalde det LiDAR specifikt - regel 1. Feltet staar derfor ikke_oplyst.

**[3]** KOMMUNIKATION OG LADEMETODE, IKKE KORTLAGT TIL ET FELT: strukturerede tabel oplyser "通讯方式: WIFI/4G/5G" og "充电方式: 无线/有线" (lademetode: traadloes/kabelforbundet) - INGEN af de to felter passer praecist til et af de 30 skemafelter (kommunikationsform er ikke et felt; "lademetode" er ikke det samme som "dockingstation", som specifikt kraever en fysisk ladestation nogen har bekraeftet foelger med). dockingstation staar derfor ikke_oplyst, selvom traadloes ladning antyder en ladepude/-station kan findes - det er ikke eksplicit bekraeftet paa siden.

**[4]** TYNDESTE KILDE I DENNE RUNDE: SP1's egen strukturerede specifikationstabel har kun TRE sektioner (基础信息/性能参数/功能列表) mod L1/L2/M1's fem-seks - INGEN sektion for ledparametre (frihedsgrader, moment) og INGEN sensor-sektion (kamera, IMU, LiDAR). Taetheden er derfor markant lavere end de oevrige fire poster i dette spor, og det er en aegte forskel i, hvad producenten oplyser om denne specifikke model - ikke en indsamlingsfejl.

---

## genisom-tongchui-m1-pro

**[0]** STOPPROEVE (firbenet): BESTAAET, entydigt. Samme side, samme meta-keywords som basisudgaven ("具身智能,四足机器人,机器狗,行业级机器人,..."). M1 Pro's egen fane i techParamsData: classname "铜锤 M1 Pro", id 226, ingen humanoid- eller andet-kropstype-sprog. https://www.genisomai.com/product-robot/M1, hentet 2026-08-25.

**[1]** INGEN SELVSTAENDIG URL: M1 Pro findes udelukkende som et fane-skift i M1's egen, strukturerede techParamsData-JSON (datas[1], id 226, delliste-id'er 497-502). Alle feltvaerdier nedenfor er hentet fra netop denne JSON-blok, IKKE fra basisudgaven M1 (id 217) eller M1 Ultra (id 227) - efterproevet byte-for-byte mod raa HTML i denne session.

**[2]** OPGRADERING FRA BASIS-M1, IKKE JUST EN OMDOEBNING: hoejden ved staaende maal er 595mm mod basisudgavens 585mm (+10mm), og krybende hoejde er 210mm mod basisudgavens 200mm (+10mm) - laengde, bredde og vaegt er ellers identiske. Sensorlisten tilfoejer et "超声波传ensor" (ultralydssensor, ingen skemafelt til det). Tilbehoerslisten opgraderer lagerplads til "256G+512G TF卡" (base: kun "标配 256G") - ingen skemafelt til lagerplads. Funktionslisten tilfoejer tre nye punkter ud over basisudgavens: "目标追踪" (maalfoelging: UWB跟随；激光视觉跟随 - UWB- og laser/visuel foelging), "语音对讲" (talekommunikation) og "录音广播" (optagelse/broadcast). Sidens egen broedtekst bekraefter: "UWB模块、麦克风与扬声器 / 铜锤M1 Pro 支持语音对讲、录音广播、UWB与激光视觉融合跟随等功能。" (UWB-modul, mikrofon og hoejttaler - Tongchui M1 Pro understoetter talekommunikation, optagelse/broadcast, UWB- og laser-visuel fusionsfoelgning).

**[4]** VAEGT-UOVERENSSTEMMELSEN FRA BASIS-M1 GAELDER OGSAA HER, DEN ER SIDEBRED: sidens fremhaevede hero-marketingkort ("约 30kg 整机重量（同级别最轻量），约 30kg 持续作业负载，...近 1:1 负载自重比") staar EN gang for hele siden, foer fanebladene - IKKE gentaget i M1 Pro's egen JSON-blok, som i stedet siger "整机重量（含电池）: 41 kg". Samme selvmodsigelse som paa basisudgaven, samme haandtering: den strukturerede tabels 41 kg er brugt som feltvaerdi (regel 9: rettes ikke stiltiende).

**[5]** FORHINDRING_ENKELT (80cm) OG DATAPORTE-ANTALLET (9 mod "15") ER LIGELEDES FRA DEN DELTE, SIDEBREDE MARKETINGTEKST, IKKE M1 Pro's EGEN JSON-BLOK - samme kilde og samme fortolkning som basisudgavens tilsvarende felter ("80cm 垂直越障高度" og "15 大标准硬件接口全开放" mod den strukturerede tabels 9 navngivne porte). Se genisom-tongchui-m1.yaml's noter for den fulde begrundelse; gentaget her fordi begge tal ligger UDEN for M1 Pro's egen tab-specifikke datablok, men PAA samme URL som resten af posten.

**[6]** SDK_SPROG IKKE GENUNDERSOEGT I DENNE SESSION: basisudgavens post dokumenterer en udtoemmende undersoegelse af GENISOM AI's GitHub-organisation (github.com/zsibot/genisom_robot_sdk), som konkluderede ikke_oplyst, fordi repoet ikke eksplicit binder sig til noget produktnavn. Denne konklusion er OVERFOERT her uden en frisk, selvstaendig efterproevning af GitHub i DENNE session - det er en antagelse om, at M1 Pro deler samme SDK-oekosystem som basisudgaven, ikke en ny maaling. Markeret som usikkerhed i selv-reviewet.

---

## genisom-tongchui-m1-ultra

**[0]** STOPPROEVE (firbenet): BESTAAET, entydigt. Samme side, samme meta-keywords som basisudgaven og M1 Pro. M1 Ultra's egen fane i techParamsData: classname "铜锤 M1 Ultra", id 227, ingen humanoid- eller andet-kropstype-sprog. https://www.genisomai.com/product-robot/M1, hentet 2026-08-25.

**[1]** INGEN SELVSTAENDIG URL: M1 Ultra findes udelukkende som et fane-skift i M1's egen, strukturerede techParamsData-JSON (datas[2], id 227, delliste-id'er 504-509). Alle feltvaerdier nedenfor er hentet fra netop denne JSON-blok, IKKE fra basisudgaven M1 (id 217) eller M1 Pro (id 226) - efterproevet byte-for-byte mod raa HTML i denne session.

**[4]** COMPUTE DIFFERER FRA BASISUDGAVEN OG M1 PRO: M1 Ultra's egen datablok skriver "基础算力: 6核高性能CPU（128TOPS）" (6-kernet CPU, 128 TOPS) - FAERRE kerner, men HOEJERE TOPS end basisudgavens/M1 Pro's "8 核高性能 CPU （100TOPS）" (8-kernet, 100 TOPS). Ikke en skrivefejl-kandidat: tallet gentages identisk i JSON'en og er efterproevet byte-for-byte mod raa HTML.

**[6]** VAEGT-UOVERENSSTEMMELSEN OG DE SIDEBREDDE MARKETINGTAL (forhindring_enkelt 80cm, dataporte 15 vs 9) GAELDER OGSAA HER, SAMME BEGRUNDELSE SOM M1 PRO: se genisom-tongchui-m1-pro.yaml's noter for den fulde forklaring - identisk mekanisme, samme delte, ikke-fane-specifikke kilde paa samme URL.

**[7]** TILBEHOER: samme lagerplads-opgradering som M1 Pro ("存储单元: 256G+512G TF卡" mod basisudgavens "标配 256G") og samme "超声波传感器: 支持" som M1 Pro - ingen skemafelt til nogen af de to, noteret her.

**[8]** SDK_SPROG IKKE GENUNDERSOEGT I DENNE SESSION: samme forbehold som M1 Pro - se den fils tilsvarende note. Overfoert antagelse, ikke en frisk maaling.

---

## genisom-tongchui-m1

**[0]** STOPPROEVE (firbenet): bestaaet, entydigt. Meta-keywords paa M1's egen produktside: "具身智能,四足机器人,机器狗,行业级机器人,...". Meta-description: "铜锤M1是智身科技推出的中型行业级四足机器人，16个自由度" (Tongchui M1 er GENISOM AI's mellemklasse industriklasse firbenede robot, 16 frihedsgrader). Sidens egen overskrift: "铜锤 M1 - 行业首款轻体型、高负载、全防护四足机器人" (industriens foerste lette, hoejtbelastede, fuldt beskyttede firbenede robot). https://www.genisomai.com/product-robot/M1, hentet 2026-08-24. Selvstaendig produktlinje - hverken "钢镚"(Gangben) eller en dublet af L1/L2.

**[4]** M1 HAR TO YDERLIGERE TIER-VARIANTER PAA SAMME SIDE, IKKE BYGGET: samme techParamsData-JSON som base-M1 rummer ogsaa "铜锤 M1 Pro" (tilfoejer UWB-modul, mikrofon/hoejtaler, taleopkald, RTK) og "铜锤 M1 Ultra" (tilfoejer 720° panoramasyn med fire fiskeoejekameraer). Begge er nye fund udenfor denne opgaves navngivne omfang ("Tongchui M1") - dokumenteret her, saa et fravalg ikke forveksles med en forglemmelse, samme princip som L2-W/L2-W Ultra fik i forrige runde.

---

## keybotic-keyper

**[0]** STOPPROEVE (firbenet): BESTAAET, entydigt og med to uafhaengige citater fra producentens egen /technology/-side: "Keyper is an autonomous 4-legged robot designed to conduct industrial inspections" og, i FAQ-afsnittet samme side, "Its four legs, agile structure, and robust design allow Keyper to access the same areas a human could get to, including stairs, steps, slopes, and unstable terrains such as gravel -all of them environments in which a wheeled robot could not operate." Begge https://keybotic.com/technology/, hentet 2026-08-24.

**[1]** STOPPROEVE (reelt produkt, ikke legetoej/hobbykit): BESTAAET. Keybotic har vundet 1. praemie i DARPA Robotics Challenge ("1st Prize DARPA Robotics Challenge", https://keybotic.com/, hentet 2026-08-24), har en offentliggjort case-story om reel drift hos en international kemivirksomhed ("Keybotic Automates Inspection Rounds for International Chemical Manufacturer", maj 2024, samme side) og saelger/udlejer robotten kommercielt via en Robot-as-a-Service-model ("With our Robot as a Service (RaaS) employment model, you can hire your own Keyper and start automating your inspections now", https://keybotic.com/technology/). Ingen tegn paa legetoejs- eller undervisningskit-karakter noget sted paa siden.

**[2]** VIGTIGT FUND: en tidligere gennemgang konkluderede at Keybotics specside var "formularlaast" og at kun presseformidlede tal (Uncrewed Systems, EU-Startups) var tilgaengelige. Det er korrekt for de to sider, der hedder "Product Brochure" (https://keybotic.com/product-brochure/) og "Technical Specifications" (https://keybotic.com/technical-specifications/) - begge bekraeftet formularlaaste i dette spor, se raa-kilderne. MEN producentens "Technology"-side (https://keybotic.com/technology/, ikke tidligere fundet/besoegt) har et fuldt "Specifications"-afsnit direkte paa siden, uden formular. ALLE talfelter i denne post er hentet derfra, IKKE fra pressen - kildetype: primaer, ikke sekundaer.

**[3]** PRESSETAL BEVIDST IKKE BRUGT: en tidligere gennemgang citerede en hastighed paa 2 m/s samt 90 min drift og 40 min hurtiglader fra Uncrewed Systems' artikel, der interviewer virksomheden. L21/L33 tillader kun materiale fra producentens EGET domaene (produktside, PDF, manual, udviklerdok) som sekundaer kilde - forhandlere, databaser, anmeldelser og PRESSEOMTALE er eksplicit stadig ude. Uncrewed Systems og EU-Startups er presseartikler, ikke producentmateriale, og er derfor IKKE brugt som kilde til noget felt i denne post, selvom tallene isoleret set kunne have udfyldt hastighed-feltet. hastighed staar derfor ikke_oplyst, ikke 2 m/s.

**[4]** LAENGDE < BREDDE: producentens egen specifikationsliste skriver "Length: 60cm" og "Width: 95cm" - bredden er stoerre end laengden. Det er usaedvanligt for en firbenet robot (laengde naese-til-hale er normalt den stoerste af de to vandrette maal), men staar saadan ordret paa siden og er IKKE rettet stiltiende (regel 9). Mulig forklaring, IKKE bekraeftet af producenten: "Width" kan daekke benenes spredning i staaende positur snarere end kroppens egen bredde - men det er en gaetning fra os, ikke et citat, og indgaar derfor kun som advarsel, ikke som rettelse.

**[5]** DRIFTSTID UDEN ENTYDIG LASTBETINGELSE: siden skriver kun "90/120 min battery run time" uden at maerke, hvilket af de to tal der gaelder med/uden last (i modsaetning til fx Genisom L2's eksplicitte "5.5H（空载） 3.5H（满载）"). Sat som interval min 90/maks 120 med ved_last: ikke_oplyst, jf. regel 8 - vi gaetter ikke, hvilket tal der hoerer til hvilken last.

**[7]** FORBINDELSE (WiFi/Ethernet/4G LTE) HAR INTET SKEMAFELT: "Both WiFi and Ethernet connections are available. Latest bands of 2.4GHz, 5Ghz (160Mhz) and WiFi 6 802.11ax standards supported as well as 1000Base-T for Ethernet connections. Mobile 4G LTE optional." Dette er traadloes netvaerksforbindelse mellem robot og operatoer/sky, ikke fysiske dataporte til tilbehoer (som Genisom L2's USB3.0/M12-stik) - derfor IKKE brugt til at udfylde dataporte-feltet, kun noteret her. Samme afgraensning som forbindelsesfeltet i skema-D9's aabne punkter.

**[9]** BILLEDE: billedport-spor 26. aug 2026 vurderede alle tre kandidater med oejne. keyper-robot-03opt.png og keyper-robot-04opt.png (naevnt i en tidligere note) viste sig begge at vaere makro-detaljer af hoften/benet UDEN hele maskinen - AFVIST, jf. robotdata-skillens billedbar. keyper-robot-01opt.png fra forsiden (https://keybotic.com/) viser derimod hele robotten tydeligt paa hvid baggrund og blev brugt i stedet.

---

## mab-honey-badger-4

**[0]** Billedport 24. aug 2026: billede fjernet. Det tidligere billede (mab-honey-badger-4-1.png) var logoet for et forskningsinstitut ("Instituto Cajal", roed stjerne), ikke et foto af robotten - fejlklassificeret som fabrikantfoto ved indsamlingen. De fire oevrige arkivkandidater (badger-4-2 til -5) kunne ikke efterproeves foer denne sessions billedlaesekvote blev opbrugt; billedet er derfor slettet, ikke byttet. Skal gennemses paa ny naar kvoten er tilgaengelig.

**[1]** Billed3 25. aug 2026: nyt billede fundet direkte paa honey-badger-siden (statisk HTML havde kun logo-/partnerbilleder synlige - kandidaten blev lokaliseret ved at bede om en gengivelse af den JS-renderede side). mab-honey-badger-4-6.png - robotten fuldt synlig under en rustet jernbanebro, "MAB ROBOTICS" som paamalet produktnavn (ikke overlejret reklame), feltfoto - bestod. Web-kopien er gemt som .jpg i stedet for producentens .png: originalfilen var et ukomprimeret 24 MB kamerafoto, som efter beskaering til 2400 px stadig fyldte 6,75 MB i lossless PNG; JPEG-kvalitet 88 gav 1,13 MB uden synligt kvalitetstab og ligger inden for de eksisterende 46 filers stoerrelsesspaend.

---

## mab-honey-badger-5

**[0]** Billedport 24. aug 2026: det daviaerende billede var byte-identisk med Honey Badger 4.0's fejlbillede (logoet for et forskningsinstitut, ikke et foto af robotten) og blev derfor slettet. Se noten nedenfor for det nye billede, fundet 25. aug 2026.

**[1]** Billed3 25. aug 2026: nyt billede fundet direkte paa honey-badger-5-siden. To kandidater bestod dommen: mab-honey-badger-5-6.jpg (to enheder side om side paa groesplaene i en park - graensetilfaelde efter rivr-one-praecedens, samme model, ikke flere modeller) og mab-honey-badger-5-7.jpg (EN robot paa en betonkant i samme parkanlaeg, "MAB ROBOTICS" paamalet). Valgte -7 for den utvetydige enkeltmaskine-komposition.

---

## microrobotech-movenew-p1

**[0]** STOPPROEVE (firbenet): bestaaet. Meta-keywords paa P1's egen produktside: "quadruped robot, wheeled legged robot, ... high-payload legged robot". Meta-description: "All-terrain quadruped robot for industrial inspection, fire response, and public safety missions." (https://www.micbotics.com/list_12/98.html, hentet 2026-08-24). Hjul-ben-hybrid ('efficient wheeled cruising with superior legged obstacle-crossing capabilities' i banner-teksten) - taeller som firbenet efter opgavens egen regel.

**[1]** Se microrobotech-movenew-t1.yaml for producentens dokumenterede navneskifte MicroRoboTech -> Micbot (samme rebrand-noter gaelder her, gentages ikke).

**[2]** Load Dimensions 595 x 419 x 129 mm (lastrummets maal) og Foldet maal 1150 x 800 x 200 mm er begge oplyst, men har intet skemafelt.

**[3]** P1 har ogsaa en produkt-PDF ("MOVENEW P1 Product Datasheet", 7,2 MB, hentet 2026-08-24) paa producentens supportside, men den kunne ikke laeses i denne omgang - ingen data herfra er brugt i posten. "P1 SDK Development Guide" og "P1 Operation Guide" har tomme download-links paa hentetidspunktet.

**[6]** MINDRE UOVERENSSTEMMELSE, IKKE RETTET: PDF-databladet skriver "Max Static Payload: > 400 kg" og "Max Dynamic Payload: > 200 kg" (med ">"-operator), mens produktsidens allerede udfyldte nyttelast_staaende (400 kg) og nyttelast_gaaende (200 kg) staar uden operator. Samme talvaerdier, men PDF'en praesenterer dem som et gulv ("mere end") snarere end et loft. Felterne er ikke aendret - kun noteret her.

*(Efterindsat 27. aug 2026 ved efterproevning af den byggede side: noten indeholder de interne feltnavne `nyttelast_staaende` og `nyttelast_gaaende` og blev omklassificeret fra "laeservendt" til "intern" efter foerste fase A/B-koersel.)*

**[5]** MODSIGELSE FUNDET VED PDF-OPFYLDNINGSRUNDEN (2026-08-25), IKKE RETTET: PDF-databladets "P1 Technical Specifications"-tabel (side 4) skriver "Operating Temperature: -40°C to 85°C", og samme tal gentages i markedsfoeringsteksten paa side 3 ("FROM THE FRIGID COLD OF -40°C TO THE SCORCHING HEAT OF 85°C"). Det MODSIGER produktsidens allerede udfyldte temp_maks (55°C, https://www.micbotics.com/list_12/98.html, hentet 2026-08-24) - samme moenster som T1, hvor produktsiden ogsaa skriver 55°C. temp_maks er IKKE rettet (regel: et allerede udfyldt felt aendres aldrig), men modsigelsen (55°C vs. 85°C) er hermed dokumenteret. Kilde til 85°C: producentens PDF-datablad, side 3-4, hentet 2026-08-25.

---

## microrobotech-movenew-t1

**[0]** STOPPROEVE (firbenet): bestaaet. Producentens egen produktside skriver i meta-keywords "Micbot, quadruped robot, ..." og i meta-description "Micbot's quadruped robot features... (70kg dynamic load, 200kg static load)..." (https://www.micbotics.com/list_13/96.html, hentet 2026-08-24). T1 er en hjul-ben-hybrid ("wheeled quadruped"/"轮式四足机器人") - opgaven definerer hjul-ben-hybrider som firbenede, saa den taeller.

**[3]** Foldet maal 1025 x 750 x 150 mm er oplyst men har intet skemafelt (skemaet har kun staaende maal).

**[6]** Producentens support-side (https://www.micbotics.com/support/, hentet 2026-08-24) har en rigtig, downloadbar PDF: "MOVNEWT1 Product Datasheet" (13,2 MB). Den blev hentet, men kunne ikke laeses i foerste omgang - ingen data herfra var brugt i posten paa det tidspunkt. "T1 SDK Development Guide", "T1 Operation Guide" og "Micbot Reinforcement Learning/Perception SDK Developer Guide" staar ogsaa paa support-siden, men alle fire har tomme download-links paa hentetidspunktet - ikke publicerede endnu, intet at hente.

**[7]** OPFOELGNING 2026-08-25 (PDF-opfyldningsrunde, L33): poppler er stadig ikke installeret paa maskinen (bekraeftet paa ny), og WebFetch giver stadig HTTP 403 paa PDF'en direkte - men et npm-pakke-baseret pure-JS-alternativ (pdf-parse v2, installeret i en scratch-mappe uden for repoet, IKKE en projektafhaengighed) kunne rendere PDF-siderne til PNG-billeder, som derefter blev laest visuelt side for side med Read-vaerktoejet. PDF'en (12 sider) viste sig at vaere naesten teksttom (kun sideskift-tegn ved almindelig tekstudtraek) - dvs. rent visuel/vektorgrafik, hvilket forklarer hvorfor det tidligere Python+zlib-forsoeg intet fandt. Spec-tabellen star paa side 8, en batteri-/effektside paa side 5. Evidens: media/_kilder/raa-pdf-2026-08-24/t1-pages/page-{1..12}.png. Tre nye felter udfyldt herfra (hot_swap, stroem_ud, monteringsinterface); resten af PDF'ens indhold bekraefter allerede udfyldte felter (se advarsler nedenfor) uden at tilfoeje nyt.

**[8]** EFTERPROEVET AF EFTERFOELGENDE AGENT (2026-08-25), UCOMMITTET ARV: de tre felter ovenfor (hot_swap, stroem_ud, monteringsinterface) var skrevet af en forgaenger-agent, hvis session doede foer commit. Alle tre er genefterproevet mod kilden - t1-pages/page-5.png og page-8.png laest paa ny med oejne - og citaterne stemmer ordret. Alle tre BEHOLDT uaendret. Samtlige oevrige 10 sider (page-1 til -4, -6, -7, -9 til -12) er ogsaa gennemgaaet paa ny: ingen yderligere skemafelter fundet ud over de tre allerede skrevne (siderne er marketingprosa om DynaCore/DynaForce-motorteknologi, sensoropstilling, anvendelsesscenarier, farve-/materialevalg og virksomhedskontakt - intet om pris, CE, ROS2, SDK-sprog eller dataporte). Ingen modsigelser fundet mellem PDF'ens "Parameter Information"-tabel (side 8) og de allerede udfyldte felter fra produktsiden - alle sammenlignelige tal (maal, vaegt, hastighed, driftstid, nyttelast, haeldning, trappetrin, IP-klasse, temp) stemmer overens.

---

## neura-quadruped

**[0]** STOPPROEVE (firbenet): BESTAAET, entydigt. Sidens egen hovedoverskrift: "Meet NEURA Quadruped. Four-legged explorer robot." FAQ: "Its four-legged design enables navigation through rough terrain, stairs, and obstacles that traditional wheeled systems cannot handle." https://neura-robotics.com/product/quadruped-reservation/, hentet 2026-08-25. VIGTIGT ADSKILT FRA MiPA: NEURAs anden robot "MiPA" er hjuldrevet, ikke benet - denne post gaelder udelukkende det selvstaendige "NEURA Quadruped"-produkt/reservationsside, ikke MiPA.

**[1]** STOPPROEVE (reelt produkt, ikke praesentation/legetoej): BESTAAET, men med forbehold der er vaerd at notere. Der findes en aabnet reservationsflade (100 EUR reservationsgebyr, fuldt refunderbart, forventet levering 2026) OG en downloadbar officiel datablad-PDF med konkrete tal (se nedenfor) - ikke kun en prisside uden indhold. MEN produktet er selv ifoelge siden "Currently in development" (datablad) og status saettes derfor til "annonceret", ikke "i_produktion".

**[2]** En tidligere gennemgang (24. aug 2026) besoegte samme URL og konkluderede: "Nej — kun pris publiceret paa egen reservationsside. Intet vaegt-, nyttelast-, hastigheds- eller batterital fundet". Denne gennemgang (25. aug 2026, eet doegn senere) fandt paa samme URL BAADE en udfyldt "At A Glance"-specifikationstabel OG et "Datasheet"-download-link, der foerer til en fuld teknisk PDF med konkrete tal. Enten er siden opdateret i mellemtiden, eller databladlinket var der allerede og blev ikke set af den tidligere gennemgang - begge dele er mulige, og ingen af dem kan afgoeres herfra. Dette er IKKE en rettelse af en tidligere fejl (den tidligere gennemgang rapporterede korrekt, hvad den saa paa daviaerende tidspunkt), kun en dokumenteret aendring/nyt fund.

**[3]** DATABLAD-PDF'EN ER PRIMAERKILDEN TIL DE FLESTE TALFELTER: linket "Datasheet" paa reservationssiden peger paa https://neurarobotics.px.media/plk/NP/QuadrupedDatasheet.pdf - hostet paa en marketing-CDN-underdomaene (px.media), men lagt direkte og udelukkende fra NEURA Robotics' egen officielle produktside som selskabets eget datablad, dateret "V1 / 01.01.2026" og med copyright "NEURA Robotics GmbH". Behandlet som producentens eget materiale efter L21/L33 og maerket kildetype: sekundaer paa hvert felt, der stammer derfra (PDF-datablad, ikke selve produktsiden). PDF'en har INGEN Tj/TJ-tekstoperatorer (overskrifter er outline-tegnede vektorstier, ikke tekstlag) - almindelig tekstudtraekning (node+zlib) fejlede; pdftotext -layout (poppler-utils, tilgaengelig via Git Bash paa denne maskine) lykkedes og gav en ren, entydig tekstgengivelse.

**[4]** WEBSEARCH-OPSUMMERINGENS TAL ER IKKE BRUGT: en indledende websoegning (brugt til at finde frem til denne side, ikke som kilde til noget feltdata) gengav payload som "21.9 kg (48.5 lb.)" - databladets EGET trykte tal er "22 kg / 48.5 lbs" (konsistent internt: 22 kg x 2,20462 = 48,50 lbs). Kun PDF'ens eget tal er brugt som feltvaerdi, jf. regel 1 (kilden er dokumentet selv, ikke en AI-opsummering af det).

---

## pudu-d5-w

**[0]** STOPPROEVE (firbenet, hjul-ben-hybrid taeller jf. opgavens definition): webbutikkens beskrivelse skriver "Choose between legged and wheel-legged configurations to match different terrain and mobility requirements" - D5-W er den hjul-ben-hybride variant af samme firbenede platform som D5 ("Industry-Grade Autonomous Quadruped Robot"). Ingen tvivl om benantal i producentens egen tekst.

**[1]** D5 og D5-W er SAMME produktside med en variantvaelger (Shopify, samme handle "pudu-d5"). Skrevet som to filer alligevel, i tråd med praksis for Unitree B2/B2-W, A2/A2-W, AS2/AS2-W og Go2/Go2-W. Feltet forgaenger er IKKE brugt her, fordi D5-W ikke er en efterfoelger i tid - kun den anden konfiguration paa samme side (Shopify-billedet for D5-W-varianten er tidsstemplet 2026-03-09, D5 selv 2026-02-04, men det er et billed-uploadtidspunkt, ikke en modeludgivelsesdato).

**[2]** Se pudu-d5.yaml's noter for den fulde redegoerelse af uoverensstemmelsen mellem den generelle markedsfoeringstekst ("25 cm steps, 30° climbs, 45° descents") og den variant-specifikke sammenligningstabel. For D5-W stemmer markedsfoeringsteksten faktisk overens med tabellens D5-W-raekke (30° ascent, 25 cm step) - modsat D5, hvor de IKKE stemmer overens.

**[3]** Raa HTML-bevis: media/_kilder/raa-kand1a-2026-08-24/pudu-d5-storeside-2026-08-24.html (samme fil som pudu-d5.yaml - begge varianter staar paa denne ene side).

**[4]** PDF-OPFYLDNINGSRUNDEN (2026-08-25): se pudu-d5.yaml for den fulde gennemgang af flyeren, download-siden og Pudu Robotics' tomme GitHub-organisation - samme flyer daekker D5 og D5-W paa én sammenligningstabel, ingen af de ti tilbageværende ikke_oplyst-felter kunne fyldes for D5-W heller.

---

## pudu-d5

**[0]** STOPPROEVE (firbenet): produktsiden i webbutikken haedrer selv titlen "PUDU D5 Series Quadruped Robot | PUDU Official Store" og undertitlen "Industry-Grade Autonomous Quadruped Robot" (H1 paa begge sider). Ingen tvivl om benantal - modsat Lenovo Daystar GS og Direct Drive TITA er der intet i producentens egen tekst, der peger paa andet end fire ben.

**[1]** D5 og D5-W er SAMME produktside med en variantvaelger (Shopify-variant, samme handle "pudu-d5"). De to er alligevel skrevet som to filer her, i tråd med praksis for Unitree B2/B2-W, A2/A2-W, AS2/AS2-W og Go2/Go2-W.

**[2]** Maksimalt ledmoment ("Maximum Joint Torque": 165 Nm / 121.7 lb·ft) og enkelt-opladning-raekkevidde ("Single-charge range extends to 14 kilometers", PR Newswire) har intet felt i skemaet og er derfor kun noteret her - de taeller ikke i specifikationstaetheden.

**[5]** Raa HTML-bevis: media/_kilder/raa-kand1a-2026-08-24/pudu-d5-storeside-2026-08-24.html (butik, indeholder Shopify-produkt-JSON med pris og variant-tabel), pudu-d5-officielside-2026-08-24.html (pudurobotics.com/en/products/d5, indeholder fodnoterne 1-5), pudu-d5-prnewswire-2026-08-24.html (pressemeddelelse med lastbetinget driftstid).

**[6]** PDF-OPFYLDNINGSRUNDEN (2026-08-25): den arvede "PUDU D5 Product Flyer", se media/_kilder/raa-pdf-2026-08-24/pudu-d5-product-flyer.pdf (2 sider, laest som pudu-d5-pages/page-1.png og page-2-hi.png), er en forbruger-rettet marketingflyer, ikke et teknisk datablad - den gentager kun tal, der allerede staar paa produktsiden (maal, vaegt, computing-platform, sensorer, driftstid, nyttelast, klatreevne, temperatur, IP-klasse). Ingen af de ti tilbageværende ikke_oplyst-felter (frihedsgrader, nyttelast_staaende, hot_swap, ladetid, ros2, sdk_sprog, monteringsinterface, stroem_ud, dataporte, ce_oplyst) kunne fyldes herfra. Pudus generelle download-side (pudu-download-page.html) blev ogsaa gennemgaaet for andre PDF'er - kun et generelt "Industrial Product Brochure" (flere produkter, ikke D5-specifikt) blev fundet, ikke hentet, lav forventet vaerdi. Et forsoeg paa at finde en Pudu Robotics GitHub-organisation (github.com/pudurobotics) bekraeftede, at organisationen findes, men har INGEN offentlige repositories - ingen SDK/ROS2-kilde tilgaengelig ad den vej.

---

## raion-robotics-raibo2

**[2]** DE TRE TAL, DER ER FOERT IND, ER SEKUNDAERE OG MAERKET SOM SAADAN. De staar hos KAIST RaiLab, laboratoriet der byggede robotten, ikke hos den virksomhed der saelger den: 42 kg, op til 6 m/s, op til 8 timers uafbrudt drift. De er maerket kildetype sekundaer, saa det senere kan besluttes, om de overhovedet maa taelle med (robotdata-skillens regel 3). Uden dem ville posten vaere helt tom for tal, og en tom post ville skjule, at oplysningerne findes - bare ikke hos saelgeren.

---

## rivr-one

**[2]** SKEMAPROBLEM: RIVR oplyser RAEKKEVIDDE i km (over 30 km pr. opladning), ikke driftstid i timer. Skemaet har driftstid som felt og raekkevidde som beregnet felt; her er det omvendt. Med over 30 km og op til 14 km/t kunne man regne baglaens til ca. 2,1 timer - DET GOER VI IKKE. Det ville vaere et fabrikeret tal med to usikre operatorer ganget sammen.

**[3]** RIVR TWO er navngivet i navigationen uden nogen specifikationer. Ingen post oprettet.

---

## unitree-a1

**[0]** A1-siden er en ren marketingside uden parametertabel. Det er ikke en fejl i indsamlingen - siden har ingen tabel. Konsekvensen er den laveste taethed i hele Unitree-materialet.

---

## unitree-b2

**[0]** Billedport 24. aug 2026: billede fjernet. `fil:`-feltet pegede paa unitree-b2.jpg, som ikke findes paa disk - den faktiske fil var unitree-b2.png (bekraeftet med gyldige PNG-magicbytes og MANIFEST-match til unitree-b2-2.png, unitree.com/b2). Denne sessions billedlaesekvote blev opbrugt foer billedets indhold naaede at blive set - det er derfor ALDRIG blevet visuelt godkendt, kun sporet som en filstiskaeg. Billedet er slettet frem for gættet godkendt, jf. reglen om at et uefterproevet billede er lige saa risikabelt som et forkert. Skal ses og domsfaeldes paa ny naar kvoten er tilgaengelig.

**[1]** Billedport 25. aug 2026: billedet er et rent hvidt studiorender fra producentens egen webshop (shop.unitree.com), i samme stil som Xiaomi Cyberdog 2's godkendte render. Flere andre kandidatbilleder blev vurderet og fravalgt undervejs (forkert motiv, infografik, eller en stuntagtig demofoto med en trae-stok).

---

## unitree-go2-w

**[0]** Billedport 24. aug 2026: billede fjernet. Det tidligere billede (unitree-go2-w-1.jpg) viste et stort antal Go2-robotter opstillet i formation paa et stadion, hver med et roedt loeve-dans-kostumehoved paa ryggen, som skjuler selve produktets sensorhoved. Ikke en enkelt, tydelig maskine. De fire oevrige arkivkandidater (go2-w-2 til -5) kunne ikke efterproeves foer denne sessions billedlaesekvote blev opbrugt; billedet er derfor slettet, ikke byttet. Skal gennemses paa ny naar kvoten er tilgaengelig.

**[1]** Billed3 25. aug 2026: nyt billede fundet paa producentens egen go2-w-side (ikke arkivkandidaterne, som ikke findes i denne worktree - de var alle hentet fra unitree.com's forside, ikke fra go2-w-siden selv, og viste sig ved kontrol at vaere Unitree H1-humanoidbilleder til kinesisk nytaar med indbraendt reklametekst, ikke Go2-W). unitree-go2-w-6.png - enkelt hjulforsynet Go2-W i oerkenterraen, hjulene tydelige, sensorhoved frit, intet tekstoverlay - bestod og er sat ind.

---

## unitree-go2

**[0]** Billedport 24. aug 2026: billede fjernet. Det tidligere billede (unitree-go2-1.png) var et skaermbillede af Unitrees fjernbetjenings-app paa en telefon - et LiDAR-punktskykort med kamerafeed og betjeningsknapper, ikke et foto af robotten. De fire oevrige arkivkandidater (go2-2 til -5) kunne ikke efterproeves foer denne sessions billedlaesekvote blev opbrugt; billedet er derfor slettet, ikke byttet. Skal gennemses paa ny naar kvoten er tilgaengelig.

**[1]** Billed3 25. aug 2026: nyt billede fundet paa producentens egen side (ikke arkivkandidaterne, som ikke findes i denne worktree). unitree-go2-6.jpg (hero med indbraendt overskriftstekst) og unitree-go2-7.jpg (eksploderet infografik med komponentkald) blev begge AFVIST. unitree-go2-8.jpg - robotten fuldt synlig paa en klippe i vand, feltfoto, ingen tekst - bestod og er sat ind.

---

## unitree-laikago

**[3]** HVORFOR POSTEN ALLIGEVEL FINDES: en oversigt, der kun viser de modeller producenten stadig markedsfoerer, fortaeller ikke en indkoeber, at Unitree har bygget firbenede robotter siden 2017, og hvilke der ikke laengere findes. Posten er en daekningsoplysning, ikke en katalogpost.

---

## weilan-alphadog-e300

**[4]** DESIGNSPOERGSMAALET, DENNE POST STILLER: hvordan ser en post ud, hvor samtlige felter er ikke_oplyst? Ser den oedelagt ud, har vi bygget forkert. Weilans INDUSTRImodeller - dem en driftschef ville overveje - har 0 % taethed, mens deres legetoejsmodel har 35 %.

---

## weilan-alphadog-e400l

**[4]** DESIGNSPOERGSMAALET, DENNE POST STILLER: hvordan ser en post ud, hvor samtlige felter er ikke_oplyst? Ser den oedelagt ud, har vi bygget forkert. Weilans INDUSTRImodeller - dem en driftschef ville overveje - har 0 % taethed, mens deres legetoejsmodel har 35 %.

---

## weilan-babyalpha

**[1]** Sensorerne naevnes i prosa uden modeller og uden antal: wide-angle vision, active infrared vision, 360-degree lidar, multi-time-of-flight (TOF) radar, microphone array, multipoint touch sensor, temperature and humidity sensor, 6DF inertial measurement unit (IMU) sensor, joint torque sensor, displacement sensor og 6D pose estimation. 360-degree lidar er type uden model og taeller ikke under D4.

**[3]** KLASSEMARKERING MANGLER I SKEMAET. BabyAlpha er en hjemme-/selskabsrobot, ikke et arbejdsredskab. Den staar ikke paa CEO ens udelukkelsesliste (Petoi, MangDang, Hiwonder, Yahboom, Elephant Robotics, Sony aibo, Tombot), og er derfor konverteret - men om den hoerer i kataloget er et aabent spoergsmaal.

---

## xiaomi-cyberdog-1

**[1]** BUNDLENS FILNAVN ER INDHOLDS-HASHET. Retter Xiaomi et tal, skifter filnavnet. Vedligeholdsrutinen skal hente HTML'en foerst og laese bundle-URL'en ud af den.

**[5]** BILLEDE BEVIDST UDELADT (billedport-spor 26. aug 2026): den levende mi.com/cyberdog og mi.com/cyberdog/specs svarer begge 403 Forbidden (Akamai-blokering, testet med curl og WebFetch fra Danmark - mi.com/cyberdog2 svarer 200 med samme brugeragent, saa blokeringen rammer specifikt den udgaaede CyberDog 1-side). Wayback Machine har en arkiveret kopi (20260123082543), men den viser samme klient-renderede Vue-skal som den levende side; de faktiske produktbilleder loades via en API-kaldt billedliste, der ikke findes i den statiske HTML - hverken paa produktsiden, specsiden eller den arkiverede kopi. Den lokale fangst (raa-anvendelse-2026-08-19) indeholder kun Mi Malls generiske navigations-ikoner (telefoner, aircondition, vandrenser) fra sitets faelles skabelon, intet CyberDog-specifikt. Robotten beholder sin maaleplade.

**[6]** FORNYET FORSOEG, STADIG INGEN BILLEDE (spor/data2, 2026-08-26): mi.com/cyberdog svarede denne gang 200 via curl (blokeringen er ikke konstant), men HTML'en indeholdt kun 193 billed-URL'er, og INGEN af dem viste CyberDog - alle var enten 320x220-anbefalingsminiaturer af ANDRE Mi-produkter (fx et TV), 80x80-ikoner, eller Xiaomis lovpligtige forhandlertilladelser (增值电信业务经营许可证/foedevaretilladelse, delt skabelon-footer). Samme resultat paa Wayback-snapshottet fra lige efter lancering (20210817233737, hentet direkte fra archive.org) - ogsaa her var de to eneste stoerre billeder (>2000px2) de samme to lovpligtige tilladelser, ikke robotten. Xiaomis officielle discover-artikel (mi.com/global/discover/article?id=2069) og Community-showcasen (new.c.mi.com/it/post/26586) blev ogsaa forsoegt: foerste gav kun logo/favicon-assets, anden gav 2,7 KB uden indhold (begge sandsynligvis klient-renderet SPA-indhold, ligesom produktsiden). Konklusionen fra 26. aug staar altsaa ved magt efter et uafhaengigt, bredere forsoeg: robottens faktiske produktfotos er ikke tilgaengelige for noget vaerktoej i denne session, hverken via mi.com direkte eller via arkiv/presse-kanaler. Robotten beholder sin maaleplade.

---

## xiaomi-cyberdog-2

**[1]** VEDLIGEHOLDSFORBEHOLD 1: bundlens filnavn er indholds-hashet. Retter Xiaomi et tal, skifter filnavnet, og en gemt bundle-URL peger paa noget, der ikke findes. Vedligeholdsrutinen skal hente HTML'en foerst og laese bundle-URL'en ud af den - ikke gemme den som konstant.

**[2]** VEDLIGEHOLDSFORBEHOLD 2: en validator, der kun ser sidens HTML, vil rapportere posten som TOM.

**[3]** mi.com bruger en BLOKERINGSliste, ikke en tilladelsesliste: curl, tom user-agent, libwww-perl og Go-http-client faar alle 200; wget, Scrapy og Java faar 403 (fra Akamai, ikke fra Xiaomi). En hentelogik bygget paa antagelsen om at alle vaerktoejer blokeres, ville vaere bygget paa en fejl.

**[4]** DENNE POST HAR SOM DEN ENESTE I HELE INDSAMLINGEN baade LiDAR-MODEL, FRIHEDSGRADER, ROS 2 og BATTERI I Wh - fire af de seks felter, der havde nul daekning paa alle tre referencerobotter i DATAMODEL.md.

---

## yobotics-e-dog

**[1]** E-DOG OPLYSER TRE NYTTELASTTAL, IKKE TO - og skemaet har kun to felter: maks. STATISK last 8 kg, maks. DYNAMISK last 5 kg, og dynamisk last I DRIFT 3 kg. Det tredje tal (arbejdslast) har ingen plads i skemaet og staar kun i advarslen paa nyttelast_gaaende. Det er en skemamangel, ikke en indsamlingsmangel.

---

## yobotics-y10

**[0]** Billedport 24. aug 2026: billede fjernet. Det tidligere billede (yobotics-y10-2.jpg) var et familiebanner: seks forskellige Yobotics-modeller opstillet i raekke, med indbraendt kinesisk marketingtekst ("智能灵巧 轻松驾驭多场景" / "优宝特四足机器人系列") - hverken en enkelt maskine eller Y10 specifikt identificerbar. De fire oevrige arkivkandidater (y10-1, -3, -4, -5) kunne ikke efterproeves foer denne sessions billedlaesekvote blev opbrugt; billedet er derfor slettet, ikke byttet. Skal gennemses paa ny naar kvoten er tilgaengelig.

**[1]** Billed3 25. aug 2026: producentsidens egen markup (swiper-slide med tit-en Y10/Y20/e-Dog) afsloerede at det GAMLE manifest havde krydset billeder mellem Y10 og Y20 - den forrige indsamling havde tildelt pro-1.png (som siden selv maerker Y20) til slug yobotics-y10. Rettet ved at laese HTML-konteksten direkte i stedet for at genbruge den gamle tildeling: pro-2.png (siden maerker den Y10) - rent hvidt studiorender, hel maskine, intet tekstoverlay - bestod og er sat ind.

---

## yobotics-y20

**[0]** Billedport 24. aug 2026: det daviaerende billede var et familiebanner - seks forskellige Yobotics-modeller opstillet i raekke, med indbraendt kinesisk marketingtekst, hverken en enkelt maskine eller Y20 specifikt identificerbar - og blev derfor slettet. Se noten nedenfor for det nye billede, fundet 25. aug 2026.

**[1]** Billed3 25. aug 2026: samme krydstildeling som Y10 (se den YAML-fil) - det gamle manifest havde pro-1.png liggende under BEGGE slugs. Producentsidens egen markup maerker pro-1.png som Y20 (tit-en). Robotten baerer et paamonteret kamera-/sensorpayload, i tone med Y20's stoerre nyttelast og industrielle profil. Rent hvidt studiorender, hel maskine, intet tekstoverlay - bestod. Afviste undervejs: yobotics-y20-7.png (y20-bg.png), samme render med otte cirkulaere ikonmaerkater med kinesisk tekst rundt om robotten - infografik, ikke rent foto.

**[2]** NAVNET. Producentens egen om-side skriver det kinesiske firmanavn med tegnet for fremragende (2 traef), ikke med tegnet for ven (0 traef) - samme udtale, forskelligt tegn, forskelligt firmanavn. Deres egen engelske gengivelse er Shandong Youbaote Intelligent Robot Co., Ltd. YOBOTICS ER DOMAENENAVNET, ikke firmaets eget engelske navn. Kataloget boer skrive begge og ikke lade et domaene blive til et firmanavn.

---

## yuejia-yj30-max-w

**[0]** STOPPROEVE (hjul-ben-hybrid, ikke ren hjulplatform): bestaaet, MED forbehold - samme begrundelse som YJ30 W, blot stor-udgaven (jf. YJ30/YJ30Max-parringen). https://yuejialingdong.com/index.php/yuejiasizuxilie/58.html, hentet 2026-08-25.

**[1]** IKKE LEGETOEJ (L11): nej. Pris 358.000 kr - kataloget dyreste Yuejia-model - og brandinspektions-/industrianvendelse.

**[2]** GENBRUGT EVIDENS: research udfoert i spor/kand4. Raa HTML genbruges fra media/_kilder/raa-kand4-2026-08-25/yuejialingdong-yj-58-2026-08-25.html (hentet 2026-08-25). Samme "基础参数"-tabel (YJ30Max vs. YJ30W Max) staar ogsaa paa side 57 (yuejialingdong-yj-57-2026-08-25.html) - begge kilder krydstjekket og enige.

**[3]** GAAENDE/STAAENDE-SPLIT ER EKSPLICIT: som YJ30Max har tabellen TO separate raekker "静态负载" og "动态负载" for YJ30W Max. 静态负载 -> nyttelast_staaende, 动态负载 -> nyttelast_gaaende - direkte aflaesning.

**[4]** TRAPPETRIN_KONTINUERLIG: samme delte kolonnenavn "攀爬台阶高度" som YJ30/YJ30 W-parret (se yuejia-yj30-w.yaml's topnote for den fulde begrundelse) - vaerdien 80cm er markant hoejere end YJ30Max's 30cm, som forventet for en hjuldrevet variant.

---

## yuejia-yj30-max

**[0]** STOPPROEVE (firbenet): bestaaet. Samme producentnavigation som YJ30 ("越甲四足系列"), YJ30Max staar under samme hovedpunkt. https://yuejialingdong.com/index.php/yuejiasizuxilie/57.html, hentet 2026-08-25.

**[1]** IKKE LEGETOEJ (L11): nej. Pris 288.000 kr og anvendelser (工业巡检/消防应急/复杂环境作业) i samme industri-/beredskabskategori som resten af kataloget - hoejere prisklasse end YJ30, konsistent med "高负载" (hoej nyttelast) positioneringen.

**[2]** GAAENDE/STAAENDE-SPLIT ER EKSPLICIT HER, MODSAT YJ30: tabellen har TO separate raekker "静态负载" (statisk last) og "动态负载" (dynamisk last), i modsaetning til YJ30's ene uspecificerede "负载"-raekke. 静态负载 -> nyttelast_staaende, 动态负载 -> nyttelast_gaaende - en direkte aflaesning, ikke et skoen.

---

## yuejia-yj30-w

**[0]** STOPPROEVE (hjul-ben-hybrid, ikke ren hjulplatform): bestaaet, MED forbehold. Producentens egen tekst siger "四足巡检机器人，采用四轮独立驱动结构" (firbenet inspektionsrobot med firehjuls uafhaengigt drev) - selve maskintypen kaldes "四足" (firbenet) i overskriften, mens bevaegelsen sker paa fire uafhaengigt drevne hjul monteret paa ben-lignende strukturer. Samme mønster som Unitree B2/B2-W og Genisom Gangben L2/L2-W, som allerede staar som separate katalogposter. Robotten staar under samme "越甲四足系列"-produktnavigation som den rent gaaende YJ30/YJ30Max.

**[1]** IKKE LEGETOEJ (L11): nej. Pris 88.000 kr og brandinspektions-/sikkerhedsanvendelse.

**[2]** SINGLE "负载"-FELT, SAMME MOENSTER SOM YJ30: tabellen har kun én uspecificeret "负载"-raekke (12kg) for YJ30 W, ikke en gaaende/staaende-splittet raekke. Placeret i nyttelast_gaaende som et forsigtigt skoen, jf. YJ30's begrundelse.

**[3]** TRAPPETRIN_KONTINUERLIG BRUGER SAMME KOLONNE SOM BASISUDGAVEN: "攀爬台阶高度" er ÉN kolonne i tabellen, delt af baade YJ30 (20cm) og YJ30 W (60cm) - producenten skelner IKKE mellem "kontinuerlig trappe" og "enkelt forhindring" med to forskellige feltnavne, saadan som Galileo og Genisom goer. Vaerdien er derfor lagt i trappetrin_kontinuerlig for begge varianter for at holde feltvalget konsistent inden for samme producents tabel - IKKE fordi 60cm noedvendigvis er en kontinuerlig trappe i praksis for en hjulbenet robot. Se ogsaa forhindring_enkelt: ikke_oplyst.

---

## yuejia-yj30

**[0]** STOPPROEVE (firbenet): bestaaet. Producentens egen sidenavigation har hovedpunktet "越甲四足系列" (Yuejia Quadruped/Four-Legged Series), navlink til /yuejiasizuxilie.html, som YJ30 staar under. https://yuejialingdong.com/index.php/yuejiasizuxilie/56.html, hentet 2026-08-25.

**[1]** IKKE LEGETOEJ (L11): nej. Pris 78.000 kr (¥78.000) og anvendelser (巡逻巡检/应急救援/电力巡检 - patrulje/beredskab/el-inspektion) placerer produktet i samme industri-/sikkerhedskategori som resten af kataloget.

**[3]** SINGLE "负载"-FELT, IKKE GAAENDE/STAAENDE-SPLITTET: tabellen har KUN én uspecificeret "负载" (last)-raekke (10kg), ikke to separate "静态负载"/"动态负载"-raekker som YJ30Max's tabel har. Samme situation som Unitree Go2 (data/robots/unitree-go2.yaml) - vaerdien er placeret i nyttelast_gaaende som et forsigtigt (IKKE en aflaesning) skoen, jf. samme princip. nyttelast_staaende er ikke_oplyst.

**[7]** BILLEDE BEVIDST UDELADT (billedport-spor 26. aug 2026, FORTSAT NEDENFOR): siden for netop denne post (56.html) linker kun to slags produktfotos - en fest/optog-scene i Pingyao med et publikum og robotten i et broderet ceremonidraet, OG en familie-gruppeopstilling med to forskellige undermodeller side om side. Begge to gengivne fotos paa DENNE side viste desuden en robot med HJUL - selvom posten her er den rent gaaende YJ30 (ingen hjul, jf. regel 2a). Samme hjulfoto genfindes uaendret paa YJ30 W's og YJ30W MAX's egne sider (58.html/59.html), saa 56.html ser ud til at genbruge hele seriens marketingmateriale frem for at vise netop denne variant. Intet foto paa siden kunne bekraeftes at vise den gaaende YJ30 alene, uden folkemaengde eller broderet dragt. Robotten beholder derfor sin maaleplade - et forkert billede er vaerre end intet.

**[8]** BILLEDE FUNDET VED FORNYET GENNEMGANG (spor/data2, 2026-08-26): alle 16 <img>-URL'er paa 56.html blev hentet og gennemset enkeltvis (ikke kun de to, den forrige gennemgang fandt). 14 af dem er logo/banner/QR-koder/spec-tabel-skaermbilleder eller viser (som forudsagt) HJULvarianten (bl.a. Pingyao-ceremonien og familiegruppebilledet, begge bekraeftet hjulforsynede ved visuel inspektion). ÉN fil - https://yuejialingdong.com/public/uploads/files/20260414/f618e35816c8484fca4c9116678d893d.png - viser derimod en ren studiofotografering paa lys/hvid baggrund af robotten UDEN hjul (gummi-fodspidser, ingen hjulskiver), hele maskinen synlig, ingen tekst/folkemaengde/dragt. Sammenlignet visuelt med assets/fotos/fabrikant/yuejia-yj30-w.png (den allerede brugte hjul-studiofoto for YJ30 W) - de to er tydeligt forskellige optagelser, ingen genbrugsrisiko. Billedet er derfor tilfoejet, og maalepladen erstattet.

---

## yufan-lingmao-cyvet

**[0]** STOPPROEVE (firbenet): Producentens egen navigation kalder produktet "四足机器人" (firbenet/quadruped-robot), link /embodied-ai/robot. Produktsiden skriver selv om bevaegelsen: "无论是疾速奔跑、灵活转身，还是复杂的仿生步态，每一个指令都能精准执行" ("Uanset om det er lynhurtigt loeb, adroit vending eller kompleks biomimetisk gangart, udfoeres hver kommando praecist"). Kilde: https://www.uniubi.com/embodied-ai/robot, hentet 2026-08-24.

**[3]** Feltet 关节峰值扭旋/额定扭矩 (led-drejningsmoment) har intet felt i skemaet. Noteret her: peak 60 N·m, nominel ca. 18 N·m pr. led (kilde som frihedsgrader nedenfor).

**[4]** 工作最大功率 (maks. arbejdseffekt) 3500 W har intet felt i skemaet - noteret her, ikke i felter.
