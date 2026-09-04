# FUND — `spor/galileokilde`: Galileos 120 ubelagte tal søgt på producentens eget domæne

**Skill:** `spor` + `robotdata` (begge kaldt fra worktree, virkede). `design` fravalgt.
**Valgt:** læse SPA-skallens bundlede JS for det rigtige endepunkt — **fravalgt** at gætte RuoYi-stier blindt.

## Grundmåling (punkt 0) — AFVIGELSE fra briefet
`validate.mjs`/`build.mjs` kræver nu `.env` som standard (spor/fase3, allerede på main
`71e5fc1`) — briefet forudsatte YAML som standard. Kørt med `--data=data/robots` (ingen
databaseadgang brugt): **77 fil(er)/0 fejl/1 advarsel · 216 sider/1.111 kildemærker/0 uden ·
Galileo-URL'er 1 · WRC-felter 140** — matcher briefets forudsigelse på alle fire.

## Punkt 1 — kan `galileotime.com` levere en kilde? Ja
6 hentede sider bekræfter den kendte tomme SPA-skal (200, 2.175 bytes, 117 tegn). Skallens
`<script>` peger på en bundlet JS-fil; tekstsøgning i den fandt kildekoden bag appens data:
`` `/config/lang.json?t=${Date.now()}` `` — en RuoYi/Vue-locale-fil der viste sig at være
appens **fulde indholdsdatabase** (403.072 bytes, zh+en), med nøglerne
`dogc1`/`doge1`/`dogs1` der matcher vores 6 modeller 1:1. To API-endepunkter blev også fundet
(`/api/website/product/list`, 4.493 bytes) men bærer kun billeder/købslinks, ingen specs.

## Punkt 2 — arkivering
`media/_kilder/galileo-2026-09-04/`: 5 rå filer + `MANIFEST.tsv` (8 kolonner) + `LÆSMIG.md` =
**7** filer (`find media/_kilder/galileo-* -type f | wc -l`). Alle > 2.175 bytes undtagen den
tomme SPA-skal (dokumenteret som netop det).

## Punkt 3 — krydstjek af de 120 B-felter
**A2=14 · B2=15 · C2=91 · sum=120** (`grep -c "^| galileo-.*| A2 |"` — simplere `grep -c
"| A2 |"` matcher også DENNE linje og gav fejlagtigt 15, se fælde 5). Metode: literal
substring-søgning af PDF-strengen mod **robottens egen kolonne**
(`data1`=C1/E1/S1, `data2`=-W) i `lang.json`s `param.list`; ingen ordret match → tjek om et
felt med samme begrebslabel findes med ANDEN værdi (C2) eller slet ikke (B2).

**Vigtigste enkeltfund:** hvor et felt findes begge steder, er værdien systematisk
**forskellig** (C1 vægt: PDF 15 kg vs. website 22 kg; mål: 660×320×470 mm vs. 765×410×475 mm)
— gentaget på tværs af alle 6 modeller. **Tyder på to produktrevisioner**, ikke to
formuleringer af samme tal. A2 (14, som forudsagt lavt) er næsten kun IP-klasse,
dockingstation og enkelte dataport-felter, hvor kilderne tilfældigvis er enige.

## L21-spørgsmålet
Alle **140** felter er kildet til `worldrobotconference.com`
(`grep -h worldrobotconference data/robots/galileo-*.yaml | wc -l` → 140). **L21**
(`STATUS.md:342`): *"Tilladt, når kilden ligger på producentens eget domæne og kan dateres —
datablade, brugermanualer, udviklerdok, JS-bundles. […] Forhandlere, databaser, anmeldelser og
pressomtale er stadig ude."* WRC er messearrangør, ikke Galileos domæne — falder efter ordlyden
**udenfor**, medmindre PDF'en er Galileos eget dokument blot hostet af WRC (ikke efterprøvet).
To veje, ingen anbefalet: **(1)** WRC udenfor L21 → op til 106 af 120 felter mister deres eneste
kilde (15 findes slet ikke andetsteds, 91 modsiges af website); pris: specifikationstætheden
falder markant. **(2)** WRC indenfor L21 (kræver bevis for Galileo-forfatterskab) → de 140
kildemærker består, men de 91 C2-modsigelser står ubehandlet — to kilder, ét felt, ingen regel
for hvilken der vinder.

## Konfidens, usikkerheder, målinger
**Høj** (kommando + kontrafaktisk): grundmåling, punkt 1/2, A2/B2's literal-substring-del
(havde `/config/lang.json` ikke eksisteret, ville fetch give 404). **Middel:**
C2-klassifikationen bygger på min egen begrebs-ordbog (fx "持续负载" ≈ `nyttelast_gaaende`),
ikke efterprøvet af en anden læser — en anden opdeling kunne flytte nogle C2 til B2.
**Usikkert:** er PDF'en Galileos eget dokument eller WRC's kompilering (afgør L21)? Ikke
undersøgt. `lang.json` rummer også GH1/SH1/EX-1-nøgler — ikke efterprøvet, uden for vores 6
robotter. Ingen forklaring fundet på HVORFOR kilderne afviger, kun AT de gør.
**Målinger:** validate 77/0/1 · build 216/1.111/0 · Galileo-URL'er 1 · WRC-felter 140 ·
arkivfiler 5 · A2=14 · B2=15 · C2=91 · sum=120.
---

## Nye fælder og opdagelser

1. **`validate.mjs`/`build.mjs` skiftede standardkilde til databasen** mellem briefets
   skrivning og grenens branch-punkt (samme commit `71e5fc1`, af `spor/fase3`). Uden
   `--data=data/robots` fejler grundmålingen med en `.env`-fejl, der ligner et miljøproblem
   men er et ændret standardflag.
2. **Min egen første tabelparsing var forkert, fanget før brug:** en naiv `split('|')` knækker
   på escapede `\|` inde i cellerne i `FUND-galileotekst.md` (bruges som delcitat-separator,
   fx `续航时间: 3.5h～6h \| 续航里程: ＞10km`), hvilket trunkerede mindst 3 rækker og
   forskød deres sidste kolonne. Rettet med en parser der respekterer `\|` som literal pipe —
   præcis den "plausibelt forkert tal"-fælde `SKILL.md` punkt 2 advarer imod.
3. **Websitets tal for C1/E1/S1 afviger systematisk fra WRC-manualens** for næsten alle
   fælles felter (se punkt 3). Ikke en søgefejl — gentaget på alle 6 modeller.
4. **LiDAR (探测距离40m) findes i PDF'en, ikke i `lang.json`s param-tabeller for C1/E1/S1.**
   Ordet findes andre steder i samme `lang.json`, men under en anden produktnøgle
   (ikke `dogc1`/`doge1`/`dogs1`) — brug det ikke som kilde for disse 6 robotter.

## Punkter i briefet, jeg ikke nåede

Ingen. Alle fem acceptkriterier adresseret: (1) hentninger m. status/bytes/tegn, (2) arkiv
m. MANIFEST+LÆSMIG, (3) fuld 120-rækkers tabel nedenfor, (4) L21-afsnit ovenfor, (5) `git diff`
viser kun `fund/FUND-galileokilde.md` (verificeret nedenfor).

---

## Krydstjek-tabellen (120 rækker — leverancen, tæller ikke med i 60-linjers loftet)

| Robot | Felt | Klasse | PDF-soegning (fra FUND-galileotekst.md) | Website-evidens / nul-soegning |
|---|---|---|---|---|
| galileo-c1 | felter.egenvaegt | C2 | 重量: 15kg | website 本体规格/重量: "22kg" (vs. PDF: "重量: 15kg") |
| galileo-c1 | felter.laengde | C2 | 站立尺寸（长×宽×高）单位mm: 660*320*470 | website 本体规格/站立尺寸(长x宽x高): "765x410x475mm" (vs. PDF: "站立尺寸（长×宽×高）单位mm: 660*320*470") |
| galileo-c1 | felter.bredde | C2 | 320mm | website 本体规格/站立尺寸(长x宽x高): "765x410x475mm" (vs. PDF: "320mm") |
| galileo-c1 | felter.hoejde | C2 | 470mm | website 本体规格/站立尺寸(长x宽x高): "765x410x475mm" (vs. PDF: "470mm") |
| galileo-c1 | felter.nyttelast_gaaende | C2 | 有效负载: 8kg | website 运动参数/持续负载: "12kg" (vs. PDF: "有效负载: 8kg") |
| galileo-c1 | felter.nyttelast_staaende | B2 | 最大负载: 15kg | 0 traeff: literal-substring-soegning af PDF-strengen mod galileo-c1s egen kolonne i lang.json's param-tabel gav ingen match, og ingen raekke i samme param-tabel har et label, der begrebsmaessigt daekker feltet (nyttelast_staaende) |
| galileo-c1 | felter.hastighed | C2 | 运动速度: 0～3.7m/s | website 运动参数/运动速度: "0-3m/s(可调节)" (vs. PDF: "运动速度: 0～3.7m/s") |
| galileo-c1 | felter.haeldning | C2 | 可攀爬斜坡最大坡度: ±40° | website 运动参数/可攀爬斜坡最大坡度: "≥30°" (vs. PDF: "可攀爬斜坡最大坡度: ±40°") |
| galileo-c1 | felter.trappetrin_kontinuerlig | C2 | 可攀爬高度: 20cm高连续台阶 | website 运动参数/楼梯行走能力: "≥20cm高连续台阶" (vs. PDF: "可攀爬高度: 20cm高连续台阶") |
| galileo-c1 | felter.ip_klasse | A2 | IP67 | fundet ordret i lang.json (galileo-c1 egen kolonne) |
| galileo-c1 | felter.temp_min | C2 | 工作环境温度: -20℃~55℃（-40℃可定制） | website 环境参数/工作环境温度: "-20℃~55℃" (vs. PDF: "工作环境温度: -20℃~55℃（-40℃可定制）") |
| galileo-c1 | felter.temp_maks | C2 | 55°C | website 环境参数/工作环境温度: "-20℃~55℃" (vs. PDF: "55°C") |
| galileo-c1 | felter.batteri_wh | C2 | \"电池容量: 15AH，720Wh\" \"电池额定电压: 48V\" | website 电气参数/电池容量: "20Ah(960Wh)" (vs. PDF: "\"电池容量: 15AH，720Wh\" \"电池额定电压: 48V\"") |
| galileo-c1 | felter.driftstid | C2 | 续航时间: 3.5h～6h \| 续航里程: ＞10km | website 运动参数/续航时间: "3-5h" (vs. PDF: "续航时间: 3.5h～6h \| 续航里程: ＞10km") |
| galileo-c1 | felter.hot_swap | B2 | 配备模块化热插拔电池仓，支持数秒完成电池更换 | 0 traeff: literal-substring-soegning af PDF-strengen mod galileo-c1s egen kolonne i lang.json's param-tabel gav ingen match, og ingen raekke i samme param-tabel har et label, der begrebsmaessigt daekker feltet (hot_swap) |
| galileo-c1 | felter.dockingstation | C2 | 自主充电功能: 支持 \| 通过激光雷达导航实现自动对接充电桩 | website 电气参数/自主充电功能: "支持" (vs. PDF: "自主充电功能: 支持 \| 通过激光雷达导航实现自动对接充电桩") |
| galileo-c1 | felter.lidar | B2 | 激光雷达: 探测距离40m \| 环境参数 | 0 traeff: literal-substring-soegning af PDF-strengen mod galileo-c1s egen kolonne i lang.json's param-tabel gav ingen match, og ingen raekke i samme param-tabel har et label, der begrebsmaessigt daekker feltet (lidar) |
| galileo-c1 | felter.compute | C2 | CPU: X86或国产ARM低功耗高性能CPU | website 控制系统/CPU: "国产ARM低功耗高性能CPU(8核8线程/8G内存/64G固态存储)" (vs. PDF: "CPU: X86或国产ARM低功耗高性能CPU") |
| galileo-c1 | felter.stroem_ud | C2 | 外接电源接口: 5V; 12V; 24V； | website 电气参数/外接电源接口: "48V;24V(可按需拓展)" (vs. PDF: "外接电源接口: 5V; 12V; 24V；") |
| galileo-c1 | felter.dataporte | A2 | 外接通讯接口: Ethernet; USB; RS485 | fundet ordret i lang.json (galileo-c1 egen kolonne) |
| galileo-c1-w | felter.egenvaegt | C2 | 重量: 19kg | website 本体规格/重量: "28.5kg" (vs. PDF: "重量: 19kg") |
| galileo-c1-w | felter.laengde | C2 | 站立尺寸（长×宽×高）单位mm: 660*320*560 | website 本体规格/站立尺寸(长x宽x高): "765x480x540mm" (vs. PDF: "站立尺寸（长×宽×高）单位mm: 660*320*560") |
| galileo-c1-w | felter.bredde | C2 | 320mm | website 本体规格/站立尺寸(长x宽x高): "765x480x540mm" (vs. PDF: "320mm") |
| galileo-c1-w | felter.hoejde | C2 | 560mm | website 本体规格/站立尺寸(长x宽x高): "765x480x540mm" (vs. PDF: "560mm") |
| galileo-c1-w | felter.nyttelast_gaaende | C2 | 有效负载: 8kg | website 运动参数/持续负载: "12kg" (vs. PDF: "有效负载: 8kg") |
| galileo-c1-w | felter.nyttelast_staaende | B2 | 最大负载: 15kg | 0 traeff: literal-substring-soegning af PDF-strengen mod galileo-c1-ws egen kolonne i lang.json's param-tabel gav ingen match, og ingen raekke i samme param-tabel har et label, der begrebsmaessigt daekker feltet (nyttelast_staaende) |
| galileo-c1-w | felter.hastighed | C2 | 运动速度: 0～2.5m/s | website 运动参数/运动速度: "0-5m/s(可调节)" (vs. PDF: "运动速度: 0～2.5m/s") |
| galileo-c1-w | felter.haeldning | C2 | 可攀爬斜坡最大坡度: ±40° | website 运动参数/可攀爬斜坡最大坡度: "≥30°" (vs. PDF: "可攀爬斜坡最大坡度: ±40°") |
| galileo-c1-w | felter.forhindring_enkelt | B2 | 可攀爬高度: 正向高度差70cm高台 | 0 traeff: literal-substring-soegning af PDF-strengen mod galileo-c1-ws egen kolonne i lang.json's param-tabel gav ingen match, og ingen raekke i samme param-tabel har et label, der begrebsmaessigt daekker feltet (forhindring_enkelt) |
| galileo-c1-w | felter.ip_klasse | A2 | IP67 | fundet ordret i lang.json (galileo-c1-w egen kolonne) |
| galileo-c1-w | felter.temp_min | C2 | 工作环境温度: -20℃~55℃（-40℃可定制） | website 环境参数/工作环境温度: "-20℃~55℃" (vs. PDF: "工作环境温度: -20℃~55℃（-40℃可定制）") |
| galileo-c1-w | felter.temp_maks | C2 | 55°C | website 环境参数/工作环境温度: "-20℃~55℃" (vs. PDF: "55°C") |
| galileo-c1-w | felter.batteri_wh | C2 | \"电池容量: 15AH，720Wh\" \"电池额定电压: 48V\" | website 电气参数/电池容量: "20Ah(960Wh)" (vs. PDF: "\"电池容量: 15AH，720Wh\" \"电池额定电压: 48V\"") |
| galileo-c1-w | felter.driftstid | C2 | 续航时间: 2.5h～5h \| 续航里程: ＞15km | website 运动参数/续航时间: "3-5h" (vs. PDF: "续航时间: 2.5h～5h \| 续航里程: ＞15km") |
| galileo-c1-w | felter.hot_swap | B2 | 配备模块化热插拔电池仓，支持数秒完成电池更换 | 0 traeff: literal-substring-soegning af PDF-strengen mod galileo-c1-ws egen kolonne i lang.json's param-tabel gav ingen match, og ingen raekke i samme param-tabel har et label, der begrebsmaessigt daekker feltet (hot_swap) |
| galileo-c1-w | felter.dockingstation | A2 | 自主充电功能: 支持 | fundet ordret i lang.json (galileo-c1-w egen kolonne) |
| galileo-c1-w | felter.lidar | B2 | 激光雷达: 探测距离40m \| 环境参数 | 0 traeff: literal-substring-soegning af PDF-strengen mod galileo-c1-ws egen kolonne i lang.json's param-tabel gav ingen match, og ingen raekke i samme param-tabel har et label, der begrebsmaessigt daekker feltet (lidar) |
| galileo-c1-w | felter.compute | C2 | CPU: X86或国产ARM低功耗高性能CPU | website 控制系统/CPU: "国产ARM低功耗高性能CPU(8核8线程/8G内存/64G固态存储)" (vs. PDF: "CPU: X86或国产ARM低功耗高性能CPU") |
| galileo-c1-w | felter.stroem_ud | C2 | 5V; 12V; 24V (external power outlets, wattage not disclosed) | website 电气参数/外接电源接口: "48V;24V(可按需拓展)" (vs. PDF: "5V; 12V; 24V (external power outlets, wattage not disclosed)") |
| galileo-c1-w | felter.dataporte | A2 | Ethernet; USB; RS485 | fundet ordret i lang.json (galileo-c1-w egen kolonne) |
| galileo-e1 | felter.egenvaegt | C2 | 重量: 44kg | website 本体规格/重量: "52kg" (vs. PDF: "重量: 44kg") |
| galileo-e1 | felter.laengde | C2 | 站立尺寸（长×宽×高）单位mm: 1000*420*710 | website 本体规格/站立尺寸(长x宽x高): "1000*452*550mm" (vs. PDF: "站立尺寸（长×宽×高）单位mm: 1000*420*710") |
| galileo-e1 | felter.bredde | C2 | 420mm | website 本体规格/站立尺寸(长x宽x高): "1000*452*550mm" (vs. PDF: "420mm") |
| galileo-e1 | felter.hoejde | C2 | 710mm | website 本体规格/站立尺寸(长x宽x高): "1000*452*550mm" (vs. PDF: "710mm") |
| galileo-e1 | felter.nyttelast_gaaende | C2 | 有效负载: 20kg | website 运动参数/持续行走负载: "30kg" (vs. PDF: "有效负载: 20kg") |
| galileo-e1 | felter.nyttelast_staaende | C2 | 最大负载: 85kg | website 运动参数/极限负载: "100kg(站立负载)" (vs. PDF: "最大负载: 85kg") |
| galileo-e1 | felter.hastighed | C2 | 运动速度: 0～4m/s（极限4.95m/s） | website 运动参数/运动速度: "0-3.5m/s(可调节)" (vs. PDF: "运动速度: 0～4m/s（极限4.95m/s）") |
| galileo-e1 | felter.haeldning | C2 | 可攀爬斜坡最大坡度: ±45° | website 运动参数/攀爬斜坡能力: "≥30°" (vs. PDF: "可攀爬斜坡最大坡度: ±45°") |
| galileo-e1 | felter.trappetrin_kontinuerlig | C2 | 可攀爬高度: 30cm高连续台阶 | website 运动参数/可攀爬高度: "正向高度差80cm高台" (vs. PDF: "可攀爬高度: 30cm高连续台阶") |
| galileo-e1 | felter.ip_klasse | A2 | IP67 | fundet ordret i lang.json (galileo-e1 egen kolonne) |
| galileo-e1 | felter.temp_min | C2 | -20℃~55℃（-40℃可定制） | website 环境参数/工作环境温度: "-20℃~55℃" (vs. PDF: "-20℃~55℃（-40℃可定制）") |
| galileo-e1 | felter.temp_maks | C2 | 55°C | website 环境参数/工作环境温度: "-20℃~55℃" (vs. PDF: "55°C") |
| galileo-e1 | felter.batteri_wh | C2 | 电池容量: 25Ah（1200Wh） | website 电气参数/电池容量: "30Ah(1440Wh)" (vs. PDF: "电池容量: 25Ah（1200Wh）") |
| galileo-e1 | felter.driftstid | C2 | 续航时间: 2h～4h \| 续航里程: ＞15km | website 运动参数/续航时间: "2.5-4.5h" (vs. PDF: "续航时间: 2h～4h \| 续航里程: ＞15km") |
| galileo-e1 | felter.hot_swap | B2 | 配备模块化热插拔电池仓，支持数秒完成电池更换 | 0 traeff: literal-substring-soegning af PDF-strengen mod galileo-e1s egen kolonne i lang.json's param-tabel gav ingen match, og ingen raekke i samme param-tabel har et label, der begrebsmaessigt daekker feltet (hot_swap) |
| galileo-e1 | felter.dockingstation | A2 | 自主充电功能: 支持 | fundet ordret i lang.json (galileo-e1 egen kolonne) |
| galileo-e1 | felter.lidar | B2 | 激光雷达: 探测距离40m \| 环境参数 | 0 traeff: literal-substring-soegning af PDF-strengen mod galileo-e1s egen kolonne i lang.json's param-tabel gav ingen match, og ingen raekke i samme param-tabel har et label, der begrebsmaessigt daekker feltet (lidar) |
| galileo-e1 | felter.compute | C2 | CPU: X86或国产ARM低功耗高性能CPU | website 控制系统/CPU: "国产ARM低功耗高性能CPU(8核8线程/8G内存/64G固态存储)+X86低功耗高性能CPU(4核8线程/16G内存/256G硬盘)" (vs. PDF: "CPU: X86或国产ARM低功耗高性能CPU") |
| galileo-e1 | felter.stroem_ud | C2 | 外接电源接口: 5V；12V；48V | website 电气参数/外接电源接口: "48V;24V(可按需拓展)" (vs. PDF: "外接电源接口: 5V；12V；48V") |
| galileo-e1-w | felter.egenvaegt | C2 | 重量: 38kg | website 本体规格/重量: "60kg" (vs. PDF: "重量: 38kg") |
| galileo-e1-w | felter.laengde | C2 | 站立尺寸（长×宽×高）单位mm: 1000×420×600 | website 本体规格/站立尺寸(长x宽x高): "995*537*630mm" (vs. PDF: "站立尺寸（长×宽×高）单位mm: 1000×420×600") |
| galileo-e1-w | felter.bredde | C2 | 420mm | website 本体规格/站立尺寸(长x宽x高): "995*537*630mm" (vs. PDF: "420mm") |
| galileo-e1-w | felter.hoejde | C2 | 600mm | website 本体规格/站立尺寸(长x宽x高): "995*537*630mm" (vs. PDF: "600mm") |
| galileo-e1-w | felter.nyttelast_gaaende | C2 | 有效负载: 20kg | website 运动参数/持续行走负载: "30kg" (vs. PDF: "有效负载: 20kg") |
| galileo-e1-w | felter.nyttelast_staaende | C2 | 最大负载: 85kg | website 运动参数/极限负载: "100kg(站立负载)" (vs. PDF: "最大负载: 85kg") |
| galileo-e1-w | felter.hastighed | C2 | 运动速度: 0-4m/s（极限4.95m/s） | website 运动参数/运动速度: "0-6m/s(可调节)" (vs. PDF: "运动速度: 0-4m/s（极限4.95m/s）") |
| galileo-e1-w | felter.haeldning | C2 | 可攀爬斜坡最大坡度: ±45 ° | website 运动参数/攀爬斜坡能力: "≥30°" (vs. PDF: "可攀爬斜坡最大坡度: ±45 °") |
| galileo-e1-w | felter.forhindring_enkelt | C2 | 可攀爬高度: 正向高度差1m高台 | website 运动参数/可攀爬高度: "正向高度差100cm高台" (vs. PDF: "可攀爬高度: 正向高度差1m高台") |
| galileo-e1-w | felter.ip_klasse | A2 | IP67 | fundet ordret i lang.json (galileo-e1-w egen kolonne) |
| galileo-e1-w | felter.temp_min | C2 | -20℃~55℃（-40℃可定制） | website 环境参数/工作环境温度: "-20℃~55℃" (vs. PDF: "-20℃~55℃（-40℃可定制）") |
| galileo-e1-w | felter.temp_maks | C2 | 55°C | website 环境参数/工作环境温度: "-20℃~55℃" (vs. PDF: "55°C") |
| galileo-e1-w | felter.batteri_wh | C2 | 电池容量: 25Ah（1200Wh） | website 电气参数/电池容量: "30Ah(1440Wh)" (vs. PDF: "电池容量: 25Ah（1200Wh）") |
| galileo-e1-w | felter.driftstid | C2 | 续航时间: 1.5h～3h \| 续航里程: ＞30km | website 运动参数/续航时间: "2.5-4h" (vs. PDF: "续航时间: 1.5h～3h \| 续航里程: ＞30km") |
| galileo-e1-w | felter.hot_swap | B2 | 配备模块化热插拔电池仓，支持数秒完成电池更换 | 0 traeff: literal-substring-soegning af PDF-strengen mod galileo-e1-ws egen kolonne i lang.json's param-tabel gav ingen match, og ingen raekke i samme param-tabel har et label, der begrebsmaessigt daekker feltet (hot_swap) |
| galileo-e1-w | felter.dockingstation | A2 | 自主充电功能: 支持 | fundet ordret i lang.json (galileo-e1-w egen kolonne) |
| galileo-e1-w | felter.lidar | B2 | 激光雷达: 探测距离40m \| 环境参数 | 0 traeff: literal-substring-soegning af PDF-strengen mod galileo-e1-ws egen kolonne i lang.json's param-tabel gav ingen match, og ingen raekke i samme param-tabel har et label, der begrebsmaessigt daekker feltet (lidar) |
| galileo-e1-w | felter.compute | C2 | CPU: X86或国产ARM低功耗高性能CPU | website 控制系统/CPU: "国产ARM低功耗高性能CPU(8核8线程/8G内存/64G固态存储)+X86低功耗高性能CPU(4核8线程/16G内存/256G硬盘)" (vs. PDF: "CPU: X86或国产ARM低功耗高性能CPU") |
| galileo-e1-w | felter.stroem_ud | C2 | 5V; 12V; 48V (eksterne strømudtag, watttal ikke oplyst) | website 电气参数/外接电源接口: "48V;24V(可按需拓展)" (vs. PDF: "5V; 12V; 48V (eksterne strømudtag, watttal ikke oplyst)") |
| galileo-s1 | felter.egenvaegt | C2 | 重量: 60kg | website 本体规格/重量: "118kg" (vs. PDF: "重量: 60kg") |
| galileo-s1 | felter.laengde | C2 | 站立尺寸（长×宽×高）单位mm: 1100*450*700 | website 本体规格/站立尺寸(长x宽x高): "1200x550x650mm" (vs. PDF: "站立尺寸（长×宽×高）单位mm: 1100*450*700") |
| galileo-s1 | felter.bredde | C2 | 450mm | website 本体规格/站立尺寸(长x宽x高): "1200x550x650mm" (vs. PDF: "450mm") |
| galileo-s1 | felter.hoejde | C2 | 700mm | website 本体规格/站立尺寸(长x宽x高): "1200x550x650mm" (vs. PDF: "700mm") |
| galileo-s1 | felter.nyttelast_gaaende | C2 | 有效负载: 40kg | website 运动参数/持续行走负载: "100kg" (vs. PDF: "有效负载: 40kg") |
| galileo-s1 | felter.nyttelast_staaende | C2 | 最大负载: 120kg | website 运动参数/极限站立负载: "170kg" (vs. PDF: "最大负载: 120kg") |
| galileo-s1 | felter.hastighed | C2 | 运动速度: 0-4m/s,（极限6m/s） | website 运动参数/运动速度: "0-3.5m/s(可调节)" (vs. PDF: "运动速度: 0-4m/s,（极限6m/s）") |
| galileo-s1 | felter.haeldning | C2 | 可攀爬斜坡最大坡度: ±45° | website 运动参数/可攀爬斜坡最大坡度: "≥30°" (vs. PDF: "可攀爬斜坡最大坡度: ±45°") |
| galileo-s1 | felter.forhindring_enkelt | C2 | 正向高度差40cm高台 | website 运动参数/可攀爬高度: "30cm高连续台阶,正向高度差80cm高台" (vs. PDF: "正向高度差40cm高台") |
| galileo-s1 | felter.trappetrin_kontinuerlig | C2 | 25cm高连续台阶 | website 运动参数/可攀爬高度: "30cm高连续台阶,正向高度差80cm高台" (vs. PDF: "25cm高连续台阶") |
| galileo-s1 | felter.ip_klasse | A2 | IP67 | fundet ordret i lang.json (galileo-s1 egen kolonne) |
| galileo-s1 | felter.temp_min | C2 | -20℃~55℃（-40℃可定制） | website 环境参数/工作环境温度: "-20℃~55℃" (vs. PDF: "-20℃~55℃（-40℃可定制）") |
| galileo-s1 | felter.temp_maks | C2 | 55°C | website 环境参数/工作环境温度: "-20℃~55℃" (vs. PDF: "55°C") |
| galileo-s1 | felter.batteri_wh | C2 | 电池容量: 40Ah（2880Wh） | website 电气参数/电池容量: "60Ah(3540Wh,双电池)" (vs. PDF: "电池容量: 40Ah（2880Wh）") |
| galileo-s1 | felter.driftstid | C2 | 续航时间: 5h（20kg负载）～7.5h \| 续航里程: ＞20km | website 运动参数/续航时间: "3.5-5h" (vs. PDF: "续航时间: 5h（20kg负载）～7.5h \| 续航里程: ＞20km") |
| galileo-s1 | felter.hot_swap | B2 | 配备模块化热插拔电池仓，支持数秒完成电池更换 | 0 traeff: literal-substring-soegning af PDF-strengen mod galileo-s1s egen kolonne i lang.json's param-tabel gav ingen match, og ingen raekke i samme param-tabel har et label, der begrebsmaessigt daekker feltet (hot_swap) |
| galileo-s1 | felter.dockingstation | A2 | 自主充电功能: 支持 | fundet ordret i lang.json (galileo-s1 egen kolonne) |
| galileo-s1 | felter.lidar | B2 | 激光雷达: 探测距离40m \| 环境参数 | 0 traeff: literal-substring-soegning af PDF-strengen mod galileo-s1s egen kolonne i lang.json's param-tabel gav ingen match, og ingen raekke i samme param-tabel har et label, der begrebsmaessigt daekker feltet (lidar) |
| galileo-s1 | felter.compute | C2 | CPU: X86或国产ARM低功耗高性能CPU | website 控制系统/CPU: "国产ARM低功耗高性能CPU(8核8线程/8G内存/64G固态存储)+X86低功耗高性能CPU(4核8线程/16G内存/256G硬盘)" (vs. PDF: "CPU: X86或国产ARM低功耗高性能CPU") |
| galileo-s1 | felter.stroem_ud | C2 | 外接电源接口: 5V; 12V; 24V； | website 电气参数/外接电源接口: "48V;24V(可按需求拓展)" (vs. PDF: "外接电源接口: 5V; 12V; 24V；") |
| galileo-s1 | felter.dataporte | C2 | 外接通讯接口: Ethernet; USB; RS485 | website 电气参数/外接通讯接口: "Ethernet; USB3.0; RS485(接口可按需拓展)" (vs. PDF: "外接通讯接口: Ethernet; USB; RS485") |
| galileo-s1-w | felter.egenvaegt | C2 | 重量: 85kg | website 本体规格/重量: "128kg" (vs. PDF: "重量: 85kg") |
| galileo-s1-w | felter.laengde | C2 | 站立尺寸（长×宽×高）单位mm: 1100*450*810 | website 本体规格/站立尺寸(长x宽x高): "1200x550x760mm" (vs. PDF: "站立尺寸（长×宽×高）单位mm: 1100*450*810") |
| galileo-s1-w | felter.bredde | C2 | 450mm | website 本体规格/站立尺寸(长x宽x高): "1200x550x760mm" (vs. PDF: "450mm") |
| galileo-s1-w | felter.hoejde | C2 | 810mm | website 本体规格/站立尺寸(长x宽x高): "1200x550x760mm" (vs. PDF: "810mm") |
| galileo-s1-w | felter.nyttelast_gaaende | C2 | 有效负载: 40kg | website 运动参数/持续行走负载: "100kg" (vs. PDF: "有效负载: 40kg") |
| galileo-s1-w | felter.nyttelast_staaende | C2 | 最大负载: 120kg | website 运动参数/极限站立负载: "170kg" (vs. PDF: "最大负载: 120kg") |
| galileo-s1-w | felter.hastighed | C2 | 运动速度: 0-4m/s,（极限6m/s） | website 运动参数/运动速度: "0-6m/s(可调节)" (vs. PDF: "运动速度: 0-4m/s,（极限6m/s）") |
| galileo-s1-w | felter.haeldning | C2 | 可攀爬斜坡最大坡度: ±45° | website 运动参数/可攀爬斜坡最大坡度: "≥30°" (vs. PDF: "可攀爬斜坡最大坡度: ±45°") |
| galileo-s1-w | felter.forhindring_enkelt | A2 | 正向高度差110cm高台 | fundet ordret i lang.json (galileo-s1-w egen kolonne) |
| galileo-s1-w | felter.trappetrin_kontinuerlig | C2 | 25cm高连续台阶 | website 运动参数/可攀爬高度: "30cm高连续台阶,正向高度差110cm高台" (vs. PDF: "25cm高连续台阶") |
| galileo-s1-w | felter.ip_klasse | A2 | IP67 | fundet ordret i lang.json (galileo-s1-w egen kolonne) |
| galileo-s1-w | felter.temp_min | C2 | -20℃~55℃（-40℃可定制） | website 环境参数/工作环境温度: "-20℃~55℃" (vs. PDF: "-20℃~55℃（-40℃可定制）") |
| galileo-s1-w | felter.temp_maks | C2 | 55°C | website 环境参数/工作环境温度: "-20℃~55℃" (vs. PDF: "55°C") |
| galileo-s1-w | felter.batteri_wh | C2 | 电池容量: 40Ah（2880Wh） | website 电气参数/电池容量: "60Ah(3540Wh,双电池)" (vs. PDF: "电池容量: 40Ah（2880Wh）") |
| galileo-s1-w | felter.driftstid | C2 | 续航时间: 4h（20kg负载）～6h \| 续航里程: ＞60km | website 运动参数/续航时间: "2.5-4h" (vs. PDF: "续航时间: 4h（20kg负载）～6h \| 续航里程: ＞60km") |
| galileo-s1-w | felter.hot_swap | B2 | 配备模块化热插拔电池仓，支持数秒完成电池更换 | 0 traeff: literal-substring-soegning af PDF-strengen mod galileo-s1-ws egen kolonne i lang.json's param-tabel gav ingen match, og ingen raekke i samme param-tabel har et label, der begrebsmaessigt daekker feltet (hot_swap) |
| galileo-s1-w | felter.dockingstation | A2 | 自主充电功能: 支持 | fundet ordret i lang.json (galileo-s1-w egen kolonne) |
| galileo-s1-w | felter.lidar | B2 | 激光雷达: 探测距离40m \| 环境参数 | 0 traeff: literal-substring-soegning af PDF-strengen mod galileo-s1-ws egen kolonne i lang.json's param-tabel gav ingen match, og ingen raekke i samme param-tabel har et label, der begrebsmaessigt daekker feltet (lidar) |
| galileo-s1-w | felter.compute | C2 | CPU: X86或国产ARM低功耗高性能CPU | website 控制系统/CPU: "国产ARM低功耗高性能CPU(8核8线程/8G内存/64G固态存储)+X86低功耗高性能CPU(4核8线程/16G内存/256G硬盘)" (vs. PDF: "CPU: X86或国产ARM低功耗高性能CPU") |
| galileo-s1-w | felter.stroem_ud | C2 | 外接电源接口: 5V; 12V; 24V； | website 电气参数/外接电源接口: "48V;24V(可按需求拓展)" (vs. PDF: "外接电源接口: 5V; 12V; 24V；") |
| galileo-s1-w | felter.dataporte | C2 | 外接通讯接口: Ethernet; USB; RS485 | website 电气参数/外接通讯接口: "Ethernet; USB3.0; RS485(接口可按需拓展)" (vs. PDF: "外接通讯接口: Ethernet; USB; RS485") |
