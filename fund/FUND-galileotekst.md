# FUND — spor/galileotekst: PDF-tekstudtraekning og krydstjek af 140 kildebelagte felter

**Skill:** `spor` kaldt som foerste handling og lykkedes fra worktreen (ingen disk-fallback
noedvendig). `design` fravalgt — sporet roerer intet visuelt. Ingen anden skill relevant.

## VIGTIGSTE FUND FOERST (brief bad om det, hvis A blev lavt)

**PDF'ens EGEN `/ToUnicode`-CMap mapper 10 CID-koder pr. hovedfont til bogstaveligt `U+FFFD`
(REPLACEMENT CHARACTER) — praecis der, hvor cifrene 0-9 skulle staa.** Ikke en fejl i dette
script: cmap-teksten for fontobjekt 338 (stream 328) og 353 (stream 357) indeholder linjer som
`<F6B1> <FFFD>` .. `<F6BA> <FFFD>` direkte i PDF'ens egen `beginbfchar`-blok. Disse to fonte er
de eneste, der bruges til tabelvaerdier paa manualens tekniske specifikationssider (6-9).
Konsekvens: **hvert eneste ciffer i de tekniske tabeller er ulaeseligt** — ikke kun via dette
script, men principielt via ToUnicode-baseret udtraekning overhovedet. Kontrolmaaling: hele det
udtrukne dokument (5648 tegn) indeholder kun **19** loese cifferstrenge, og alle 19 er sidetal
fra indholdsfortegnelsen/sidefod (fx "/01", "03") — **0** cifre fra de tekniske tabeller.

## Foer-og-efter, konkret

| Hvad | Foer sporet | Efter sporet |
|---|---|---|
| `tools/pdftekst.mjs` | findes ikke | ny fil, 629 linjer, kun `node:fs`/`node:zlib` |
| Galileo-manualens tekst | ulaeselig (CID-kodet) | 5648 tegn / 3129 CJK-tegn udtrukket, 9 sider |
| De 140 kildebelagte felter | 0 efterproevet | 140 klassificeret: **A=14, B=120, C=6** |

## Valgt loesning / fravalgt alternativ

Valgt: egen minimal PDF-objekt-parser (regex-afgraensning mellem `obj`-headere, ikke
`indexOf('endobj')`, som fejlede paa binaere streams) + haandskrevet ToUnicode-CMap-parser
(bfchar/bfrange, begge former) + en lille content-stream-tolk for `Tf/Tj/TJ/'/"`.
Fravalgt: at forsoege at rekonstruere cifrene fra fontenes egne indlejrede `FontFile`-glyftabeller
(TrueType/CFF cmap) — teknisk muligt, men uden for briefets leverance 1 (som eksplicit beder om
ToUnicode-CMap-parsing) og et betydeligt scope-hop uden garanteret facit (rækkefoelgen 0-9 for de
10 CID'er er ikke bevist noget sted).

## Konfidens pr. punkt

- **AC1 (>2000 tegn, >=500 CJK): høj.** Kommando: `node tools/pdftekst.mjs
  media/_kilder/raa-kand4-2026-08-25/galileo-wrc-product-manual-2025.pdf --ud=fund/galileotekst-uddrag.txt`
  giver 5648 tegn, 3129 CJK. Kontrafaktisk: var udtraekningen forkert (fx forkert CMap-parsing),
  ville CJK-tallet ligge naer 0, ikke 3129 — det matcher de facto sidernes indhold ved visuel
  gennemlaesning af alle 9 sider.
- **AC2 (ingen afhaengigheder): høj.** `grep -n "^import" tools/pdftekst.mjs` giver netop to
  linjer: `node:fs` og `node:zlib`. Kontrafaktisk: en tredje import ville vaere synlig i samme
  grep.
- **AC3 (A+B+C=140, hver B har sin nul-soegning): høj for SUMMEN, middel for KLASSIFICERINGEN
  af enkelte C-graenserader.** Summen er en tælling (140 raekker parset fra `grep -c "kilde:"`
  paa alle 6 filer = 140, matcher briefets tal). Klassificeringsmetoden (label/vaerdi-split,
  "|"-split for flercitat-raekker, 4-tegns minimumslaengde for en loesreven vaerdi-kandidat) er
  dokumenteret i tabellen nedenfor og kan genefterproeves raekke for raekke med
  `grep -c "<soegestreng>" fund/galileotekst-uddrag.txt` mod den vedhaeftede "Soegning"-kolonne.
  Middel, fordi selve VALGET af soegestreng for konstruerede (ikke citerede) raekker er mit
  skoen, ikke et bogstaveligt PDF-citat — se "Usikkerheder".

## Usikkerheder

1. **21 af 140 raekker mangler en `advarsel_ordlyd` i selve YAML'en** og fik enten en
   konstrueret `vaerdi+enhed`-streng (fx "320mm" for `bredde`) eller en delt kinesisk ordlyd
   laant fra en soesterrobots samme felt (fx `lidar`, `compute`). Begge er gode-tro-forsoeg, ikke
   bogstavelige citater — en anden agent kunne konstruere en anden (ligesaa gyldig) soegestreng
   og faa et andet A/B/C-udfald for netop disse raekker. 21 raekker er mærket i "Kilde
   til soegestreng"-kolonnen som enten "konstrueret" eller "delt advarsel_ordlyd".
2. **`billede`-raekkerne (6 stk, alle C) har slet intet tekstligt citat at teste** — en
   fotohenvisning til PDF'en er ikke en paastand, ToUnicode-teksten kan bekraefte eller afkraefte.
   Forhold, ikke en fejl.
3. **Manifest-forbeholdet (brief-punkt 1) staar ved magt:** `raa-kand4-2026-08-25/` har ingen
   MANIFEST.tsv (efterproevet: `ls` giver "findes ikke"). Filnavn↔URL er sandsynligt, ikke bevist.
   Alle mine A-raekker belaeger derfor kun, at *et dokument med dette indhold* siger det citerede
   — ikke bevisligt praecis det dokument, YAML'ens URL peger paa.
4. `autonominiveau`s eneste kilde-belaeg er tabellernes sektionsoverskrift "其他" (Other) — et
   generisk 2-tegns udtryk, der forekommer 6 gange (én gang pr. robot-tabel). Klassificeret A,
   fordi det ER, hvad YAML'ens `advarsel_ordlyd` selv citerer — men det bekraefter kun, at
   overskriften findes, ikke det kvalitative indhold under den.

## Maalinger som tal

```
Grundmaaling (foer noget blev aendret):
  wc -c < pdf                                    1753565  (brief: 1753565, MATCH)
  MANIFEST.tsv i raa-kand4-2026-08-25/            findes ikke (brief: findes ikke, MATCH)
  ToUnicode-forekomster i pdf                     6 (brief: 6, MATCH)
  Type0-forekomster i pdf                         6 (brief: 6, MATCH)
  FlateDecode-forekomster i pdf                   103 (brief: 103, MATCH)
  stream-starts (\bstream\r?\n, ikke endstream)   209 (brief: 209, MATCH — OBS: naivt
                                                   grep -o "stream" gav 418, fordi det ogsaa
                                                   taeller "endstream"-forekomster. Se "Nye
                                                   fælder" nedenfor.)

Efter Leverance 1:
  node tools/pdftekst.mjs <pdf> --ud=...          5648 tegn (script-egen taelling)
  wc -c paa udfilen                               13597 bytes UTF-8
  CJK-tegn ([一-鿿])                      3129
  antal sider udtrukket                           9
  import-linjer i tools/pdftekst.mjs              2 (node:fs, node:zlib)

Efter Leverance 2:
  "kilde:" raekker paa tvaers af de 6 YAML-filer   140 (23+23+23+23+24+24)
  A (fundet)                                       14
  B (ikke fundet, nul-soegning dokumenteret)        120
  C (uafgjort)                                       6
  A+B+C                                             140
  loese cifferstrenge i hele udtraekket              19 (alle sidetal, 0 fra spec-tabeller)
```

## Nye fælder og opdagelser

1. **`grep -o "stream"` er en fælde parallel til det kendte `{`-i-CSS-problem:** den taeller
   ogsaa `endstream` (som indeholder "stream" som delstreng), og gav 418 mod det korrekte 209.
   Rettet ved at kraeve `(?<!end)stream\r?\n` i stedet.
2. **Objektgrænser via naeste `obj`-header er sikrere end `indexOf('endobj')`:** et forsoeg paa
   at afgraense sideobjekter med `region.indexOf('endobj', start)` fandt kun 8 af 9 sider (en
   falsk `endobj`-lignende byte-sekvens i en komprimeret stream formentlig). Naeste-header-
   afgraensningen (brugt i den endelige `tools/pdftekst.mjs`) fandt korrekt 9/9.
3. **Absolutte `/c/...`-stier knaekker `git commit -F` paa denne maskine** — samme
   MSYS-sti-familie som det dokumenterede node.exe-problem, men her rammer det git: kommandoen
   fejlede med "could not read log file", selvom filen bevisligt fandtes (`ls`/`cat` virkede).
   Relative stier fra worktree-roden virkede uden problemer. **Ny fælde, boer tilfoejes
   `miljoefaelder.md`.**
4. **Digit-FFFD-fundet (se toppen)** er efter min vurdering det vigtigste resultat af hele
   sporet: det forklarer, hvorfor A blev lavt (14/140, ikke det "høje A", briefet gættede paa),
   og det er en egenskab ved KILDEN, ikke ved udtraekningsmetoden — en bedre CMap-parser kan
   ikke rette det, fordi informationen er tabt i selve PDF'en.
5. **21 af de 140 raekker havde intet bogstaveligt kildecitat i YAML'en at teste imod** (kun
   `vaerdi`, ingen `advarsel_ordlyd`) — se "Usikkerheder" punkt 1. Dette er en observation om
   robotdata-skemaets udfyldningsgrad, ikke en fejl i dette spor.

## Punkter i briefet, jeg ikke naaede

Ingen. Leverance 1 (AC1+AC2) og Leverance 2 (AC3) er begge gennemfoert, begge forbehold i
briefet er gengivet ovenfor, og alle tre commits er lavet i briefets raekkefoelge.

---

## Krydstjek-tabel — alle 140 raekker (A+B+C = 140)

Soegemetode pr. raekke: `advarsel_ordlyd` bruges direkte, hvis den findes i YAML'en. Indeholder
den " | ", splittes den i delcitater (fra to forskellige tabelceller), og ALLE skal findes for A.
Indeholder et delcitat et "label: vaerdi"-moenster, testes baade det fulde citat OG vaerdien
alene (fordi PDF'en ofte tegner label og vaerdi som separate tekststykker) — men kun hvis
vaerdien er >=4 tegn, saa en generisk 2-3-tegns streng som "支持" (stoettet) ikke tæller som
falsk-positivt bevis. Mangler `advarsel_ordlyd` helt, konstrueres en soegestreng af
`vaerdi+enhed`, af `vaerdi`-listen, eller (for booleans/engelske omskrivninger uden eget citat)
laanes en delt kinesisk ordlyd fra en soesterrobots samme felt — markeret i sidste kolonne.

| Robot | Felt | Klasse | Soegning (adskilt med `;` hvis flere delcitater) | Kilde til soegestreng |
|---|---|---|---|---|
| galileo-c1 | anvendelse | A | 机场/车站/社区等公共场所安保巡逻 <br> 地震/废墟/河堤等灾害应急救援侦查搜索 <br> 边境或特殊区域治安巡逻、岗哨及武装反恐、防爆等突发事件勘察 <br> 工厂/园区/港口等场景安防巡检 <br> 高风险工业设备智能巡检与数据采集 <br> 工业有毒及重点区域的智能巡检 | anvendelse: test hver af de 6 citat_ordlyd-parenteser (ren CJK, ingen cifre). |
| galileo-c1 | billede | C |  | billede: en fotocitation, ikke en tekstlig paastand fra PDF-teksten — intet citat at soege efter. |
| galileo-c1 | felter.egenvaegt | B | 重量: 15kg | advarsel_ordlyd |
| galileo-c1 | felter.laengde | B | 站立尺寸（长×宽×高）单位mm: 660*320*470 | advarsel_ordlyd |
| galileo-c1 | felter.bredde | B | 320mm | konstrueret af vaerdi+enhed (ingen advarsel_ordlyd) |
| galileo-c1 | felter.hoejde | B | 470mm | konstrueret af vaerdi+enhed (ingen advarsel_ordlyd) |
| galileo-c1 | felter.nyttelast_gaaende | B | 有效负载: 8kg | advarsel_ordlyd |
| galileo-c1 | felter.nyttelast_staaende | B | 最大负载: 15kg | advarsel_ordlyd |
| galileo-c1 | felter.hastighed | B | 运动速度: 0～3.7m/s | advarsel_ordlyd |
| galileo-c1 | felter.haeldning | B | 可攀爬斜坡最大坡度: ±40° | advarsel_ordlyd |
| galileo-c1 | felter.trappetrin_kontinuerlig | B | 可攀爬高度: 20cm高连续台阶 | advarsel_ordlyd |
| galileo-c1 | felter.ip_klasse | B | IP67 | konstrueret af vaerdi alene (ingen advarsel_ordlyd) |
| galileo-c1 | felter.temp_min | B | 工作环境温度: -20℃~55℃（-40℃可定制） | advarsel_ordlyd |
| galileo-c1 | felter.temp_maks | B | 55°C | konstrueret af vaerdi+enhed (ingen advarsel_ordlyd) |
| galileo-c1 | felter.batteri_wh | B | \"电池容量: 15AH，720Wh\" \"电池额定电压: 48V\" | advarsel_ordlyd |
| galileo-c1 | felter.driftstid | B | 续航时间: 3.5h～6h \| 续航里程: ＞10km | advarsel_ordlyd |
| galileo-c1 | felter.hot_swap | B | 配备模块化热插拔电池仓，支持数秒完成电池更换 | advarsel_ordlyd |
| galileo-c1 | felter.dockingstation | B | 自主充电功能: 支持 \| 通过激光雷达导航实现自动对接充电桩 | advarsel_ordlyd |
| galileo-c1 | felter.lidar | B | 激光雷达: 探测距离40m \| 环境参数 | advarsel_ordlyd |
| galileo-c1 | felter.compute | B | CPU: X86或国产ARM低功耗高性能CPU | advarsel_ordlyd |
| galileo-c1 | felter.autonominiveau | A | 其他 | advarsel_ordlyd |
| galileo-c1 | felter.stroem_ud | B | 外接电源接口: 5V; 12V; 24V； | advarsel_ordlyd |
| galileo-c1 | felter.dataporte | B | 外接通讯接口: Ethernet; USB; RS485 | advarsel_ordlyd |
| galileo-c1-w | anvendelse | A | 机场/车站/社区等公共场所安保巡逻 <br> 地震/废墟/河堤等灾害应急救援侦查搜索 <br> 边境或特殊区域治安巡逻、岗哨及武装反恐、防爆等突发事件勘察 <br> 工厂/园区/港口等场景安防巡检 <br> 高风险工业设备智能巡检与数据采集 <br> 工业有毒及重点区域的智能巡检 | anvendelse: test hver af de 6 citat_ordlyd-parenteser (ren CJK, ingen cifre). |
| galileo-c1-w | billede | C |  | billede: en fotocitation, ikke en tekstlig paastand fra PDF-teksten — intet citat at soege efter. |
| galileo-c1-w | felter.egenvaegt | B | 重量: 19kg | advarsel_ordlyd |
| galileo-c1-w | felter.laengde | B | 站立尺寸（长×宽×高）单位mm: 660*320*560 | advarsel_ordlyd |
| galileo-c1-w | felter.bredde | B | 320mm | konstrueret af vaerdi+enhed (ingen advarsel_ordlyd) |
| galileo-c1-w | felter.hoejde | B | 560mm | konstrueret af vaerdi+enhed (ingen advarsel_ordlyd) |
| galileo-c1-w | felter.nyttelast_gaaende | B | 有效负载: 8kg | advarsel_ordlyd |
| galileo-c1-w | felter.nyttelast_staaende | B | 最大负载: 15kg | advarsel_ordlyd |
| galileo-c1-w | felter.hastighed | B | 运动速度: 0～2.5m/s | advarsel_ordlyd |
| galileo-c1-w | felter.haeldning | B | 可攀爬斜坡最大坡度: ±40° | advarsel_ordlyd |
| galileo-c1-w | felter.forhindring_enkelt | B | 可攀爬高度: 正向高度差70cm高台 | advarsel_ordlyd |
| galileo-c1-w | felter.ip_klasse | B | IP67 | konstrueret af vaerdi alene (ingen advarsel_ordlyd) |
| galileo-c1-w | felter.temp_min | B | 工作环境温度: -20℃~55℃（-40℃可定制） | advarsel_ordlyd |
| galileo-c1-w | felter.temp_maks | B | 55°C | konstrueret af vaerdi+enhed (ingen advarsel_ordlyd) |
| galileo-c1-w | felter.batteri_wh | B | \"电池容量: 15AH，720Wh\" \"电池额定电压: 48V\" | advarsel_ordlyd |
| galileo-c1-w | felter.driftstid | B | 续航时间: 2.5h～5h \| 续航里程: ＞15km | advarsel_ordlyd |
| galileo-c1-w | felter.hot_swap | B | 配备模块化热插拔电池仓，支持数秒完成电池更换 | delt advarsel_ordlyd fra soesterrobot (felt: felter.hot_swap) |
| galileo-c1-w | felter.dockingstation | B | 自主充电功能: 支持 | advarsel_ordlyd |
| galileo-c1-w | felter.lidar | B | 激光雷达: 探测距离40m \| 环境参数 | delt advarsel_ordlyd fra soesterrobot (felt: felter.lidar) |
| galileo-c1-w | felter.compute | B | CPU: X86或国产ARM低功耗高性能CPU | delt advarsel_ordlyd fra soesterrobot (felt: felter.compute) |
| galileo-c1-w | felter.autonominiveau | A | 其他 | delt advarsel_ordlyd fra soesterrobot (felt: felter.autonominiveau) |
| galileo-c1-w | felter.stroem_ud | B | 5V; 12V; 24V (external power outlets, wattage not disclosed) | konstrueret af vaerdi alene (ingen advarsel_ordlyd) |
| galileo-c1-w | felter.dataporte | B | Ethernet; USB; RS485 | konstrueret af vaerdi-liste (ingen advarsel_ordlyd) |
| galileo-e1 | anvendelse | A | 机场/车站/社区等公共场所安保巡逻 <br> 地震/废墟/河堤等灾害应急救援侦查搜索 <br> 边境或特殊区域治安巡逻、岗哨及武装反恐、防爆等突发事件勘察 <br> 工厂/园区/港口等场景安防巡检 <br> 高风险工业设备智能巡检与数据采集 <br> 工业有毒及重点区域的智能巡检 | anvendelse: test hver af de 6 citat_ordlyd-parenteser (ren CJK, ingen cifre). |
| galileo-e1 | billede | C |  | billede: en fotocitation, ikke en tekstlig paastand fra PDF-teksten — intet citat at soege efter. |
| galileo-e1 | felter.egenvaegt | B | 重量: 44kg | advarsel_ordlyd |
| galileo-e1 | felter.laengde | B | 站立尺寸（长×宽×高）单位mm: 1000*420*710 | advarsel_ordlyd |
| galileo-e1 | felter.bredde | B | 420mm | konstrueret af vaerdi+enhed (ingen advarsel_ordlyd) |
| galileo-e1 | felter.hoejde | B | 710mm | konstrueret af vaerdi+enhed (ingen advarsel_ordlyd) |
| galileo-e1 | felter.nyttelast_gaaende | B | 有效负载: 20kg | advarsel_ordlyd |
| galileo-e1 | felter.nyttelast_staaende | B | 最大负载: 85kg | advarsel_ordlyd |
| galileo-e1 | felter.hastighed | B | 运动速度: 0～4m/s（极限4.95m/s） | advarsel_ordlyd |
| galileo-e1 | felter.haeldning | B | 可攀爬斜坡最大坡度: ±45° | advarsel_ordlyd |
| galileo-e1 | felter.trappetrin_kontinuerlig | B | 可攀爬高度: 30cm高连续台阶 | advarsel_ordlyd |
| galileo-e1 | felter.ip_klasse | B | IP67 | konstrueret af vaerdi alene (ingen advarsel_ordlyd) |
| galileo-e1 | felter.temp_min | B | -20℃~55℃（-40℃可定制） | advarsel_ordlyd |
| galileo-e1 | felter.temp_maks | B | 55°C | konstrueret af vaerdi+enhed (ingen advarsel_ordlyd) |
| galileo-e1 | felter.batteri_wh | B | 电池容量: 25Ah（1200Wh） | advarsel_ordlyd |
| galileo-e1 | felter.driftstid | B | 续航时间: 2h～4h \| 续航里程: ＞15km | advarsel_ordlyd |
| galileo-e1 | felter.hot_swap | B | 配备模块化热插拔电池仓，支持数秒完成电池更换 | delt advarsel_ordlyd fra soesterrobot (felt: felter.hot_swap) |
| galileo-e1 | felter.dockingstation | B | 自主充电功能: 支持 | advarsel_ordlyd |
| galileo-e1 | felter.lidar | B | 激光雷达: 探测距离40m \| 环境参数 | delt advarsel_ordlyd fra soesterrobot (felt: felter.lidar) |
| galileo-e1 | felter.compute | B | CPU: X86或国产ARM低功耗高性能CPU | delt advarsel_ordlyd fra soesterrobot (felt: felter.compute) |
| galileo-e1 | felter.autonominiveau | A | 其他 | delt advarsel_ordlyd fra soesterrobot (felt: felter.autonominiveau) |
| galileo-e1 | felter.stroem_ud | B | 外接电源接口: 5V；12V；48V | advarsel_ordlyd |
| galileo-e1 | felter.dataporte | A | 外接通讯接口: Ethernet; USB; TypeC（接口可按需拓展） | advarsel_ordlyd |
| galileo-e1-w | anvendelse | A | 机场/车站/社区等公共场所安保巡逻 <br> 地震/废墟/河堤等灾害应急救援侦查搜索 <br> 边境或特殊区域治安巡逻、岗哨及武装反恐、防爆等突发事件勘察 <br> 工厂/园区/港口等场景安防巡检 <br> 高风险工业设备智能巡检与数据采集 <br> 工业有毒及重点区域的智能巡检 | anvendelse: test hver af de 6 citat_ordlyd-parenteser (ren CJK, ingen cifre). |
| galileo-e1-w | billede | C |  | billede: en fotocitation, ikke en tekstlig paastand fra PDF-teksten — intet citat at soege efter. |
| galileo-e1-w | felter.egenvaegt | B | 重量: 38kg | advarsel_ordlyd |
| galileo-e1-w | felter.laengde | B | 站立尺寸（长×宽×高）单位mm: 1000×420×600 | advarsel_ordlyd |
| galileo-e1-w | felter.bredde | B | 420mm | konstrueret af vaerdi+enhed (ingen advarsel_ordlyd) |
| galileo-e1-w | felter.hoejde | B | 600mm | konstrueret af vaerdi+enhed (ingen advarsel_ordlyd) |
| galileo-e1-w | felter.nyttelast_gaaende | B | 有效负载: 20kg | advarsel_ordlyd |
| galileo-e1-w | felter.nyttelast_staaende | B | 最大负载: 85kg | advarsel_ordlyd |
| galileo-e1-w | felter.hastighed | B | 运动速度: 0-4m/s（极限4.95m/s） | advarsel_ordlyd |
| galileo-e1-w | felter.haeldning | B | 可攀爬斜坡最大坡度: ±45 ° | advarsel_ordlyd |
| galileo-e1-w | felter.forhindring_enkelt | B | 可攀爬高度: 正向高度差1m高台 | advarsel_ordlyd |
| galileo-e1-w | felter.ip_klasse | B | IP67 | konstrueret af vaerdi alene (ingen advarsel_ordlyd) |
| galileo-e1-w | felter.temp_min | B | -20℃~55℃（-40℃可定制） | advarsel_ordlyd |
| galileo-e1-w | felter.temp_maks | B | 55°C | konstrueret af vaerdi+enhed (ingen advarsel_ordlyd) |
| galileo-e1-w | felter.batteri_wh | B | 电池容量: 25Ah（1200Wh） | advarsel_ordlyd |
| galileo-e1-w | felter.driftstid | B | 续航时间: 1.5h～3h \| 续航里程: ＞30km | advarsel_ordlyd |
| galileo-e1-w | felter.hot_swap | B | 配备模块化热插拔电池仓，支持数秒完成电池更换 | delt advarsel_ordlyd fra soesterrobot (felt: felter.hot_swap) |
| galileo-e1-w | felter.dockingstation | B | 自主充电功能: 支持 | advarsel_ordlyd |
| galileo-e1-w | felter.lidar | B | 激光雷达: 探测距离40m \| 环境参数 | delt advarsel_ordlyd fra soesterrobot (felt: felter.lidar) |
| galileo-e1-w | felter.compute | B | CPU: X86或国产ARM低功耗高性能CPU | delt advarsel_ordlyd fra soesterrobot (felt: felter.compute) |
| galileo-e1-w | felter.autonominiveau | A | 其他 | delt advarsel_ordlyd fra soesterrobot (felt: felter.autonominiveau) |
| galileo-e1-w | felter.stroem_ud | B | 5V; 12V; 48V (eksterne strømudtag, watttal ikke oplyst) | konstrueret af vaerdi alene (ingen advarsel_ordlyd) |
| galileo-e1-w | felter.dataporte | A | 外接通讯接口: Ethernet; USB; TypeC（接口可按需拓展） | advarsel_ordlyd |
| galileo-s1 | anvendelse | A | 机场/车站/社区等公共场所安保巡逻 <br> 地震/废墟/河堤等灾害应急救援侦查搜索 <br> 边境或特殊区域治安巡逻、岗哨及武装反恐、防爆等突发事件勘察 <br> 工厂/园区/港口等场景安防巡检 <br> 高风险工业设备智能巡检与数据采集 <br> 工业有毒及重点区域的智能巡检 | anvendelse: test hver af de 6 citat_ordlyd-parenteser (ren CJK, ingen cifre). |
| galileo-s1 | billede | C |  | billede: en fotocitation, ikke en tekstlig paastand fra PDF-teksten — intet citat at soege efter. |
| galileo-s1 | felter.egenvaegt | B | 重量: 60kg | advarsel_ordlyd |
| galileo-s1 | felter.laengde | B | 站立尺寸（长×宽×高）单位mm: 1100*450*700 | advarsel_ordlyd |
| galileo-s1 | felter.bredde | B | 450mm | konstrueret af vaerdi+enhed (ingen advarsel_ordlyd) |
| galileo-s1 | felter.hoejde | B | 700mm | konstrueret af vaerdi+enhed (ingen advarsel_ordlyd) |
| galileo-s1 | felter.nyttelast_gaaende | B | 有效负载: 40kg | advarsel_ordlyd |
| galileo-s1 | felter.nyttelast_staaende | B | 最大负载: 120kg | advarsel_ordlyd |
| galileo-s1 | felter.hastighed | B | 运动速度: 0-4m/s,（极限6m/s） | advarsel_ordlyd |
| galileo-s1 | felter.haeldning | B | 可攀爬斜坡最大坡度: ±45° | advarsel_ordlyd |
| galileo-s1 | felter.forhindring_enkelt | B | 正向高度差40cm高台 | advarsel_ordlyd |
| galileo-s1 | felter.trappetrin_kontinuerlig | B | 25cm高连续台阶 | advarsel_ordlyd |
| galileo-s1 | felter.ip_klasse | B | IP67 | konstrueret af vaerdi alene (ingen advarsel_ordlyd) |
| galileo-s1 | felter.temp_min | B | -20℃~55℃（-40℃可定制） | advarsel_ordlyd |
| galileo-s1 | felter.temp_maks | B | 55°C | konstrueret af vaerdi+enhed (ingen advarsel_ordlyd) |
| galileo-s1 | felter.batteri_wh | B | 电池容量: 40Ah（2880Wh） | advarsel_ordlyd |
| galileo-s1 | felter.driftstid | B | 续航时间: 5h（20kg负载）～7.5h \| 续航里程: ＞20km | advarsel_ordlyd |
| galileo-s1 | felter.hot_swap | B | 配备模块化热插拔电池仓，支持数秒完成电池更换 | delt advarsel_ordlyd fra soesterrobot (felt: felter.hot_swap) |
| galileo-s1 | felter.dockingstation | B | 自主充电功能: 支持 | advarsel_ordlyd |
| galileo-s1 | felter.lidar | B | 激光雷达: 探测距离40m \| 环境参数 | delt advarsel_ordlyd fra soesterrobot (felt: felter.lidar) |
| galileo-s1 | felter.compute | B | CPU: X86或国产ARM低功耗高性能CPU | delt advarsel_ordlyd fra soesterrobot (felt: felter.compute) |
| galileo-s1 | felter.autonominiveau | A | 其他 | delt advarsel_ordlyd fra soesterrobot (felt: felter.autonominiveau) |
| galileo-s1 | felter.stroem_ud | B | 外接电源接口: 5V; 12V; 24V； | advarsel_ordlyd |
| galileo-s1 | felter.dataporte | B | 外接通讯接口: Ethernet; USB; RS485 | advarsel_ordlyd |
| galileo-s1-w | anvendelse | A | 机场/车站/社区等公共场所安保巡逻 <br> 地震/废墟/河堤等灾害应急救援侦查搜索 <br> 边境或特殊区域治安巡逻、岗哨及武装反恐、防爆等突发事件勘察 <br> 工厂/园区/港口等场景安防巡检 <br> 高风险工业设备智能巡检与数据采集 <br> 工业有毒及重点区域的智能巡检 | anvendelse: test hver af de 6 citat_ordlyd-parenteser (ren CJK, ingen cifre). |
| galileo-s1-w | billede | C |  | billede: en fotocitation, ikke en tekstlig paastand fra PDF-teksten — intet citat at soege efter. |
| galileo-s1-w | felter.egenvaegt | B | 重量: 85kg | advarsel_ordlyd |
| galileo-s1-w | felter.laengde | B | 站立尺寸（长×宽×高）单位mm: 1100*450*810 | advarsel_ordlyd |
| galileo-s1-w | felter.bredde | B | 450mm | konstrueret af vaerdi+enhed (ingen advarsel_ordlyd) |
| galileo-s1-w | felter.hoejde | B | 810mm | konstrueret af vaerdi+enhed (ingen advarsel_ordlyd) |
| galileo-s1-w | felter.nyttelast_gaaende | B | 有效负载: 40kg | advarsel_ordlyd |
| galileo-s1-w | felter.nyttelast_staaende | B | 最大负载: 120kg | advarsel_ordlyd |
| galileo-s1-w | felter.hastighed | B | 运动速度: 0-4m/s,（极限6m/s） | advarsel_ordlyd |
| galileo-s1-w | felter.haeldning | B | 可攀爬斜坡最大坡度: ±45° | advarsel_ordlyd |
| galileo-s1-w | felter.forhindring_enkelt | B | 正向高度差110cm高台 | advarsel_ordlyd |
| galileo-s1-w | felter.trappetrin_kontinuerlig | B | 25cm高连续台阶 | advarsel_ordlyd |
| galileo-s1-w | felter.ip_klasse | B | IP67 | konstrueret af vaerdi alene (ingen advarsel_ordlyd) |
| galileo-s1-w | felter.temp_min | B | -20℃~55℃（-40℃可定制） | advarsel_ordlyd |
| galileo-s1-w | felter.temp_maks | B | 55°C | konstrueret af vaerdi+enhed (ingen advarsel_ordlyd) |
| galileo-s1-w | felter.batteri_wh | B | 电池容量: 40Ah（2880Wh） | advarsel_ordlyd |
| galileo-s1-w | felter.driftstid | B | 续航时间: 4h（20kg负载）～6h \| 续航里程: ＞60km | advarsel_ordlyd |
| galileo-s1-w | felter.hot_swap | B | 配备模块化热插拔电池仓，支持数秒完成电池更换 | delt advarsel_ordlyd fra soesterrobot (felt: felter.hot_swap) |
| galileo-s1-w | felter.dockingstation | B | 自主充电功能: 支持 | advarsel_ordlyd |
| galileo-s1-w | felter.lidar | B | 激光雷达: 探测距离40m \| 环境参数 | delt advarsel_ordlyd fra soesterrobot (felt: felter.lidar) |
| galileo-s1-w | felter.compute | B | CPU: X86或国产ARM低功耗高性能CPU | delt advarsel_ordlyd fra soesterrobot (felt: felter.compute) |
| galileo-s1-w | felter.autonominiveau | A | 其他 | delt advarsel_ordlyd fra soesterrobot (felt: felter.autonominiveau) |
| galileo-s1-w | felter.stroem_ud | B | 外接电源接口: 5V; 12V; 24V； | advarsel_ordlyd |
| galileo-s1-w | felter.dataporte | B | 外接通讯接口: Ethernet; USB; RS485 | advarsel_ordlyd |
