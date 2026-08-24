# FUND-messe — messeudstillere med firbenede robotter, WRC/WAIC 2026, krydset mod kataloget

Ren researchopgave, stillet af CEO'en 24. aug 2026. Ingen kode eller robotdata er ændret i dette
spor. Indsamlet og skrevet i worktree `C:\Praktik\websites\udstilling-wt-messe`, gren `spor/messe`.

---

## Skill-vurdering (regel 0)

| Skill | Valgt? | Begrundelse |
|---|---|---|
| `robotdata` | Gået forbi | Bærer 33-feltsskemaet til at *udfylde en katalogpost* — denne opgave er markedsafdækning, ikke postindsamling. Ingen post oprettes eller ændres |
| `parallelt` | Gået forbi | Jeg *er* ét spor i en allerede fordelt kørsel (spor/messe). Skillen bruges af den, der fordeler arbejdet på tværs af spor, ikke af udførelsen inden i ét spor. Opgaven er desuden én sammenhængende research-og-skriveopgave med én leverance (én rapportfil) — den lader sig ikke meningsfuldt dele yderligere uden at gen-uddelegere min egen opgave, hvilket jeg ikke må |
| `grillmig` | Gået forbi | Gælder gril af et brief *før* det sendes, eller lås af en åben beslutning i STATUS.md. Mit brief er allerede givet og afsendt, og jeg låser ingen beslutning her |
| `critique`, `ui-ux-critique`, `impeccable` | Gået forbi | Designkritik af bygget UI — der er intet bygget at kritisere, ren tekstresearch |
| `dataviz` | Gået forbi | Relevant når sammenligningstal skal *vises*. Her produceres kun en tekstrapport |
| `new-project`, `code-review`, `simplify` | Gået forbi | Ingen kode skrives eller ændres |

**Konklusion: ingen skill passer på "webresearch af messeudstillere."** Det bekræfter CEO'ens eget
bud i opgaven. Jeg har arbejdet med almindelig WebSearch/WebFetch og den kildedisciplin, opgaven
selv beskriver (a/b/c-skelnen), uden skill-stilladsering.

---

## 1. Messens fakta

### World Robot Conference (WRC) 2026 — hovedkilden

- **Navn:** World Robot Conference 2026 (世界机器人大会), med sideløbende World Robot Expo 2026 og
  World Robot Contest 2026.
- **Sted:** Beiren Etrong International Exhibition and Convention Center (北人亦创国际会展中心),
  Beijing Economic-Technological Development Area (Beijing E-Town/亦庄).
- **Dato:** 19.–23. august 2026.
- **Omfang:** angivet forskelligt afhængigt af kilde — Beijing-byens egen side taler om 300+
  udstillere og 2000+ udstillede genstande; kinesisksprogede messeportaler taler om 774
  udstillende virksomheder og ca. 300.000 besøgende over hele perioden. Jeg kan ikke afgøre hvilket
  tal der er "rigtigt" — det afhænger formentlig af optællingsmetode (stande vs. juridiske
  enheder) — og noterer begge.
- Kilder: [Beijing.gov.cn — WRC 2026 start](https://english.beijing.gov.cn/beijinginfo/sci/event/202607/t20260710_4756514.html),
  [Beijing.gov.cn — program](https://english.beijing.gov.cn/whatson/events/exhibition/202607/t20260710_4756607.html),
  [Jufair — WRC-tidsplan](https://www.jufair.com/information/74045.html),
  [Sohu — udstillerguide](https://www.sohu.com/a/1064660882_122182086).

### World Artificial Intelligence Conference (WAIC) 2026 — sekundær, taget med som opgaven bad om

- **Navn:** World Artificial Intelligence Conference 2026 (世界人工智能大会).
- **Sted:** Shanghai, spredt over "tre steder, fire haller": Shanghai World Expo Exhibition Center
  (世博展览馆), Zhangjiang Science Hall (张江科学会堂), West Bund International Convention Centre
  (西岸国际会展中心).
- **Dato:** 17.–20. juli 2026 — altså **før** WRC, ikke samtidig.
- **Omfang:** ca. 100.000 m² udstillingsareal, 1.100+ udstillende virksomheder, 3.000+ udstillede
  produkter; 242 af udstillerne (23,6 %) var robotik/embodied-AI-virksomheder.
- Kilder: [Baidu Baike — WAIC 2026](https://baike.baidu.com/item/2026%E4%B8%96%E7%95%8C%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E5%A4%A7%E4%BC%9A%E6%9A%A8%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E5%85%A8%E7%90%83%E6%B2%BB%E7%90%86%E9%AB%98%E7%BA%A7%E5%88%AB%E4%BC%9A%E8%AE%AE/67986908),
  [Jufair — WAIC-tidsplan](https://www.jufair.com/information/68451.html),
  [Global Times — quadrupeds ved WAIC](https://www.globaltimes.cn/page/202607/1366283.shtml).

**WRC er den relevante messe for opgavens formål** — den er større, i Beijing, og den messe CEO'en
selv pegede på. WAIC er taget med som bedt om, og gav faktisk selvstændige fund (Lens Technology,
DaxAI's tidlige visning, "årets hest"-udgaven af DEEP Robotics' Lynx) — men de fleste af de
firbenede nyheder, jeg fandt for WAIC, gik igen eller blev overgået af WRC en måned senere.

### Allerede-katalogførte producenter, bekræftet til stede (til orientering — ikke opgavens mål)

Krydstjekket viste, at flere af de 13 nuværende katalogproducenter selv var udstillere:

- **Unitree** — fremtrædende stand ved WRC (Go2, G1, GD01), sammenfaldende med selskabets
  børsnotering i Shanghai samme uge. [Reuters via Bozeman Daily Chronicle](https://www.bozemandailychronicle.com/wire/business/from-robot-dogs-to-helpers-china-puts-robotics-ambitions-on-display-at-world-conference/article_e265c099-3726-59c9-bd44-557c92f51195.html)
- **DEEP Robotics (云深处科技)** — udstillede Jueying X30, Lynx (山猫) S10 og M20S ved WRC, samt en
  limited-edition "robothest" (Årets Hest 2026) bygget på Lynx M20's bevægelsesstyring ved WAIC.
  [163.com — WRC-observation](https://www.163.com/dy/article/L4V93T8E0511DPVD.html),
  [Global Times — WAIC](https://www.globaltimes.cn/page/202607/1366283.shtml)
- **MagicLab (魔法原子/Magic Atom)** — **vigtig afklaring:** det kinesiske firmanavn 魔法原子
  ("Magic Atom") og det engelske "MagicLab" er **samme selskab**, bekræftet direkte på
  magiclab.top ("MagicLab er en uafhængig robotstartup inkuberet af Dreame Technology"). Selskabet
  udstillede en udvidet MagicDog-serie ved WRC (MagicDog, MagicDog-W, MagicDog Y1, MagicDog T1).
  Dette er **ikke** en ny producent — det er vores eksisterende katalogpost under fortsat
  produktudvidelse. Kilder: [WRC officiel udstillerside](https://www.worldrobotconference.com/expo/company/450.html),
  [MagicLab.top](https://www.magiclab.top/en/news/33).

---

## 2. Udstillertabel — producenter, der IKKE er i kataloget eller blandt de fem under indsamling

Alle nedenstående er kinesiske selskaber (intet ikke-kinesisk fund af betydning for firbenede
robotter på disse to messer). "Publicerer specs?" betyder: har jeg fundet en kilde, hvor
*producenten selv* — ikke presse — opgiver talværdier med enhed for produktet.

| # | Producent | Land | Model(ler) | I kataloget? | Publicerer specs (producent selv)? | Kilde for deltagelse |
|---|---|---|---|---|---|---|
| 1 | **Pudu Robotics (普渡机器人)**, Shenzhen | Kina | PUDU D5, D5-W | Nej | **Ja** — officiel produktside og PR Newswire-pressemeddelelse med fulde tal (275 TOPS, dobbelt 192-linjers LiDAR, IP67, 30 kg nyttelast, 14 km rækkevidde) | [PRNewswire](https://www.prnewswire.com/news-releases/pudu-robotics-unveils-pudu-d5-series-industry-grade-autonomous-quadruped-robots-designed-for-complex-real-world-operations-302630095.html), [officiel butik](https://store.pudurobotics.com/products/pudu-d5) — deltagelse ved WRC nævnt i kinesisk pressedækning, ikke direkte bekræftet på egen side i denne søgning |
| 2 | **DaxAI Robotics (昕辕/DaxAI)**, Beijing | Kina | Qiji X1 (rent firbenet, ridbar), Qiji XS (hjul-ben-hybrid) | Nej | **Ja** — pris, vægt, nyttelast, rækkevidde og batterispænding opgivet af selskabet selv, gengivet i flere uafhængige presseoutlets | [Interesting Engineering](https://interestingengineering.com/ai-robotics/humanoid-robot-rides-robot-horse-in-beijing), [Futurism](https://futurism.com/robots-and-machines/chinese-startup-shows-off-robot-horse-ride), [tech360tv](https://www.tech360.tv/riding-robot-qiji-x1-now-available-for-purchase-2026-24-08) — WRC 2026 navngivet direkte som visningssted |
| 3 | **智身科技 / GENISOM AI** (智身新创苏州智能科技), Suzhou/Beijing | Kina | 钢镚 (Gangben) L1, L1 Maker, L2; 铜锤 (Tongchui) M1 | Nej | Delvist — produktionstal (15.000+ enheder pr. juni 2026) og enkelte specs (IP54, 20 cm forhindringshøjde, 50 % effekt-redundans for L1) fra presse, ikke set en samlet officiel specark | [Sohu](https://www.sohu.com/a/1034279909_121123802), [WRC officiel udstillerside](https://www.worldrobotconference.com/expo/company/491.html), [officielt site](https://www.genisomai.com/) |
| 4 | **具微科技 / MicroRoboTech / Juwei Technology**, Hangzhou | Kina | MOVENEW T1, P1 (hjul-ben) | Nej | **Ja** — 400 kg nyttelast, 12 timers drift, IP67, −40 til 85 °C, angivet i virksomhedens egne pressemeddelelser gengivet af China Daily | [China Daily](https://cn.chinadaily.com.cn/a/202507/09/WS686e2744a3106af2b3c73366.html), [WRC officiel udstillerside](https://www.worldrobotconference.com/expo/company/506.html) |
| 5 | **璇玑动力 / Xuanji Power** (深圳璇玑动力科技), Shenzhen | Kina | Hypertron T01 (tunglast), Hypertron SW01 (mellemklasse) | Nej | Delvist — presse citerer specifikke driftsforhold (kraft-elnet, brandredning), men jeg fandt ingen selvstændig producent-specside med talværdier | [Sohu](https://www.sohu.com/a/1064971928_122054251), [Zhidx](https://zhidx.com/p/586263.html) |
| 6 | **宇泛智能 / Yufan/Uupan Intelligent** (杭州宇泛智能科技), Hangzhou | Kina | 灵猫 Cyvet, Cyvet Creator | Nej | **Ja** — ledspecifikationer (18 Nm nominel/60 Nm peak, 109 Nm/kg momentdensitet) opgivet af producenten selv i pressedækning der citerer virksomheden direkte | [163.com](https://www.163.com/dy/article/L4V93T8E0511DPVD.html), [Baidu Baike](https://baike.baidu.com/item/%E6%9D%AD%E5%B7%9E%E5%AE%87%E6%B3%9B%E6%99%BA%E8%83%BD%E7%A7%91%E6%8A%80%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8/18667005) |
| 7 | **Vbot / 维他动力** (Vita Dynamics Beijing Technology), Beijing | Kina | 大头 (Datou) BoBo, Datou EDU-W | Nej | **Ja** — 128 TOPS lokal computing, 600 Wh+ batteri, dobbelt stereokamera + 16-linjers LiDAR, opgivet af selskabet | [KrASIA](https://kr-asia.com/vbot-unveils-bobo-a-robotic-dog-built-to-live-and-play-among-humans), [Guancha](https://www.guancha.cn/GongSi/2026_07_14_823700.shtml) — **se forbehold i anbefalingslisten nedenfor** |
| 8 | **MAXHUB Robotics / CVTE (视源股份)**, Guangzhou | Kina | MAXHUB X7 | Nej | Delvist — 35° hældning, IP66 nævnt i presse; jeg fandt intet officielt specark trods forsøg på at hente CVTE/MAXHUB's egen nyhedsside | [Huacheng/GZ-CMC](https://huacheng.gz-cmc.com/pages/2026/08/19/3a412c5fd854433bb5add56dd7205ac1.html), [Sina](https://finance.sina.com.cn/roll/2025-08-08/doc-infkhrzv5030824.shtml) |
| 9 | **AGIQUAD / 智元酷拓** (spin-off fra AgiBot/智元), Shanghai | Kina | Ingen selvstændigt navngivet flagskibsmodel fundet — platform bag Chongqing Haochens ridbare robot (75 kg nyttelast) | Nej | Nej — kun platformsbeskrivelse fundet, ingen talspecifikation direkte fra AGIQUAD selv | [163.com](https://www.163.com/dy/article/L27J48HD055040N3.html), [STCN](https://www.stcn.com/article/detail/3743260.html) |
| 10 | **Lens Technology (蓝思科技)**, Changsha (Hunan) | Kina | Ikke navngivet — "selvudviklet firbenet robothund" uden offentliggjort modelnavn | Nej | Nej — ingen model, ingen specs fundet; kun skala (10.000-styks ordre, 500.000/år kapacitetsmål 2027) | [D1EV](https://www.d1ev.com/news/shichang/307169), [Sina](https://finance.sina.com.cn/wm/2025-11-07/doc-infwppuk6367273.shtml) |

**Usikker/ikke medtaget i tabellen** — se selv-review for begrundelse: CETC 21. institut
(中国电科21所), GAC's GoMate/GoMove, en påstået "Hengzhi Future"-robotpuppy jeg ikke kunne
genfinde en kilde til.

---

## 3. Anbefalingsliste, sorteret efter hvor oplagt katalogværdig

**Tier 1 — klart katalogværdige (kendt/betydelig producent, ægte firbenet produkt, egne
specifikationer med kilde):**

1. **Pudu Robotics (D5/D5-W)** — allerede en internationalt kendt servicerobot-producent (deres
   leveringsrobotter sælges globalt) der nu lancerer en industriel quadruped med et komplet,
   producentudgivet specark. Det stærkeste fund i denne runde: navn, land, model og tal er alle
   på plads uden gæt.
2. **DaxAI Robotics (Qiji X1/XS)** — ny kategori (ridbar robothest), men usædvanligt godt
   dokumenteret: pris, vægt, nyttelast og rækkevidde er alle opgivet, og produktet er allerede i
   salg. Bred international pressedækning (ikke kun kinesisk) understøtter, at dette ikke er et
   engangs-showstykke.
3. **具微科技 / MicroRoboTech (MOVENEW T1/P1)** — klare tal (400 kg nyttelast, IP67,
   temperaturspænd), universitetstilknytning (Tsinghua/Zhejiang/Stanford ifølge kinesisk presse —
   **ubekræftet af mig direkte, kun gengivet i kinesisk presse**), reel finansieringshistorik.
4. **智身科技 / GENISOM AI (Gangben-serien)** — den største produktionsvolumen i denne liste
   (15.000+ leverede enheder pr. juni 2026), finansieret af AgiBot. Specs er kun delvist fundet;
   en egen agent bør hente genisomai.com/zsibot.com direkte, før en post oprettes.

**Tier 2 — sandsynligt katalogværdige, men med et hul der skal lukkes før optagelse:**

5. **宇泛智能 / Yufan Intelligent (Lingmao Cyvet)** — gode ledspecifikationer, men virksomheden er
   oprindeligt en AIoT/sikkerhedsvirksomhed, der er pivoteret ind i robotik i 2026. Bør efterprøves
   at Cyvet er et permanent produktspor og ikke et engangsudstillingsstykke.
6. **璇玑动力 / Xuanji Power (Hypertron-serien)** — stærk industriel forankring (statslige
   el-selskaber som kunder) og seriøs finansiering, men jeg fandt ingen egen specside — kun
   presseomtale af anvendelser. Skal bekræftes med en officiel kilde før optagelse.
7. **MAXHUB Robotics / CVTE (X7)** — det mest ressourcestærke selskab på listen (børsnoteret,
   kendt AV/displaymærke), men den svageste kildedækning af specifikke tal blandt Tier 1/2. Værd
   at forfølge fordi selskabet har kapital og skala til at blive en varig aktør.

**Tier 3 — usikker katalogværdi:**

8. **Vbot / 维他动力 (Datou BoBo/EDU-W)** — **spændingsfelt med L11:** BoBo markedsføres delvist
   som et følelsesmæssigt hjemme-selskabsdyr ("robotdog der lever og leger blandt mennesker"),
   hvilket minder om den allerede udelukkede kategori (Sony Aibo m.fl.). Samtidig har EDU-W-varianten
   udviklerplatform-specifikationer (128 TOPS, LiDAR, SLAM) på niveau med industrielle produkter, og
   selskabet er finansieret som en teknologivirksomhed (500 mio. RMB), ikke et legetøjsmærke. Jeg
   kan ikke afgøre, om dette hører under L11-udelukkelsen eller ej — det bør CEO'en tage stilling
   til eksplicit, med de to varianter (BoBo vs. EDU-W) holdt adskilt.
9. **AGIQUAD / 智元酷拓** — interessant fordi det er en ny quadruped-gren fra et af Kinas store
   humanoid-"nationalhold"-selskaber (AgiBot/智元), men jeg fandt intet selvstændigt navngivet
   flagskibsprodukt med specifikationer — kun en platformstrategi og ét joint venture-produkt
   (Chongqing Haochens ridbare robot). For tidligt til en katalogpost.
10. **Lens Technology (蓝思科技)** — enorm produktionsskala og en bekræftet 10.000-styks ordre, men
    intet offentliggjort modelnavn eller specark. Værd at holde øje med givet virksomhedens
    størrelse, men der er reelt intet produkt at oprette en post om endnu.

---

## 4. Selv-review

**Hvad jeg ikke kunne afgøre:**

- **AGIQUAD's egne specifikationer.** Jeg fandt platformsbeskrivelsen og ét joint venture-produkt,
  men ingen selvstændig produktside med talværdier. Kan ikke afgøre om det skyldes at siden ikke
  findes offentligt endnu, eller at jeg søgte forkert.
- **CETC 21. institut (中国电科21所).** Søgeresultaterne bekræfter, at instituttet arbejder med
  firbenede robotter som forskningsområde, men jeg fandt intet navngivet produkt, ingen
  modelbetegnelse og ingen specark. Et statsligt forskningsinstitut er desuden en anden type
  aktør end de kommercielle producenter, kataloget ellers dækker — jeg har udeladt det fra
  hovedtabellen, men nævner det her, så et fravalg ikke forveksles med en forglemmelse.
- **GAC's GoMate/GoMove.** Disse er eksplicit kategoriseret af producenten selv som "人形机器人"
  (humanoide robotter) — GoMate kan skifte til en "firbenet stabil tilstand" som én af flere
  bevægelsesformer, men grundformen er en tobenet/hjulben-humanoid, ikke en dyrelignende
  quadruped. Jeg har udelukket dem som ude af scope (opgaven ekskluderer humanoider eksplicit),
  men grænsetilfældet er værd at kende, hvis definitionen af "firbenet" nogensinde diskuteres.
- **"Hengzhi Future"-robothvalpen.** Et tidligt WebSearch-resultat syntetiserede dette navn i
  forbindelse med en "mest livagtige robothund" ved WAIC, men jeg kunne ikke genfinde nogen
  artikel, der faktisk nævner det navn, da jeg fulgte op med målrettede søgninger. Jeg har
  **ikke** medtaget det nogen steder som fund — kun nævnt det her som en advarsel om, at
  søgeværktøjets egen sammenfatning på et tidspunkt producerede et navn, jeg ikke kunne
  bekræfte i kildeteksten. Det er formentlig en sammenblanding fra søgemodellens side, ikke en
  reel virksomhed jeg har udeladt.
- **Udstillertallene for WRC 2026** (300 vs. 774 udstillere) modsiger hinanden mellem Beijing-
  byens egen engelske side og kinesiske messeportaler. Jeg har ikke fundet en autoritativ kilde,
  der forklarer forskellen (mulige forklaringer: stande vs. juridiske enheder, eller tal fra
  forskellige tidspunkter før messen).

**Hvilke kilder var svagest:**

- De fleste "deltagelse ved WRC"-påstande for de nye producenter i tabellen hviler på
  **kinesisk brancepresse** (163.com/网易, Sohu, Sina, Zhidx) frem for på messens egen officielle
  udstillerdatabase. Jeg har krydstjekket fire af de ti (智身科技, 具微科技, MagicLab og indirekte
  DEEP Robotics/Unitree via deres produktsider) mod `worldrobotconference.com`'s egen
  udstillerside — de øvrige seks (Pudu, DaxAI, Xuanji, Yufan, Vbot, MAXHUB, AGIQUAD, Lens) er
  **kun** bekræftet via presseartikler, ikke via messens officielle udstillerliste. Det opfylder
  opgavens krav om en kilde-URL for hver deltagelsespåstand, men presseartikler kan tage fejl af
  messenavn eller dato på en måde, en officiel udstillerside ikke kan.
- WebSearch-værktøjets egne sammenfatninger (ikke de rå søgeresultater) indeholdt mindst to
  fejlkilder, jeg måtte rette manuelt: (1) det oversatte 云深处科技 (DEEP Robotics' kinesiske navn)
  til "Cloudminds" — et andet, ikke-relateret selskab — hvilket jeg kun opdagede ved at
  genkende modelnavnene Jueying/Lynx som DEEP Robotics' egne; (2) "Hengzhi Future"-navnet nævnt
  ovenfor. Jeg har ikke stolet blindt på nogen AI-sammenfatning i den endelige tabel uden at
  krydstjekke mod mindst én selvstændig kilde eller mod tabellens egen interne konsistens
  (modelnavne, der matcher kendte producentserier).
- Ingen af CVTE/MAXHUB's egne kanaler (maxhub.com, cvte.com) blev hentet direkte — kun en
  tredjeparts nyhedsside (huacheng.gz-cmc.com) og Sina-finansartikler. Det er tabellens
  svageste kilde-til-producent-afstand.

**Hvad jeg ville undersøge med mere tid:**

1. Hente `worldrobotconference.com`'s fulde udstillerliste systematisk (den har individuelle
   firmasider, som dem jeg allerede besøgte for MagicLab, 智身科技 og 具微科技) i stedet for at
   nå dertil via nyhedsartikler — det ville lukke det svageste hul i kildedisciplinen ovenfor.
2. Hente CVTE/MAXHUB's og Xuanji Powers egne hjemmesider direkte for at afgøre, om Tier 2-hullet
   (specs fundet, men ikke fra producenten selv) kan lukkes.
3. Slå op, om nogen af de ti producenter allerede eksporterer eller har engelsksprogede sider —
   afgørende for kataloget, da fem af de eksisterende 13 katalogproducenter er ikke-kinesiske, og
   projektets sprogregel kræver oversat tekst i egen fil pr. sprog. Ingen af de ti nye fund viste
   tegn på en engelsksproget hjemmeside i denne søgning, hvilket kan blive en selvstændig hindring
   for optagelse uafhængigt af, om specifikationerne findes.
4. Afklare AGIQUAD-sagen direkte via 智元/AgiBot's egen presseside, da det er den eneste kandidat
   på listen, hvor jeg ikke fandt noget konkret produkt at knytte specifikationer til.
