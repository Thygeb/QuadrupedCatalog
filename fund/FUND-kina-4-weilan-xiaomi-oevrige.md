# FUND-kina-4 — Weilan, Xiaomi og de syv uåbnede producenter

Indsamlet 19. august 2026 i worktree `data/kina-weilan-xiaomi`.
Efterfølger til det ubekræftede udkast `fund/FUND-kina.md` afsnit 2.4–2.7 (se D6 i STATUS.md).

**Status: efterprøvet mod gemte råkilder.** Alle tal i dette dokument er kontrolleret mod en
rå HTML-fil, der ligger i
`C:\Praktik\websites\udstilling\media\_kilder\raa-kina-weilan-xiaomi-2026-08-19\`
med `MANIFEST.tsv` ved siden af. Det er forskellen på dette dokument og forgængeren.

---

## Skill-vurdering (regel 0)

| Skill | Valgt? | Begrundelse |
|---|---|---|
| `robotdata` | **Valgt.** Kaldt med `/robotdata`, indlæst uden fejl | Bærer 29-feltsskemaet, de ti hårde regler og det obligatoriske selv-tjek med tælling. Det er præcis denne opgave |
| `parallelt` | Gået forbi | Jeg *er* ét spor i en parallel kørsel. Skillen bruges af den, der **fordeler** arbejdet, ikke af den, der udfører et spor |
| `impeccable`, `critique`, `ui-ux-critique` | Gået forbi | Design- og IA-skills. Der er ikke bygget noget at kritisere; dette er ren dataindsamling |
| `dataviz` | Gået forbi | Relevant når tæthedstallene skal *vises*. Her produceres de kun |
| `new-project`, `code-review`, `simplify` | Gået forbi | Ingen kode i dette spor ud over engangs-udtræksscripts i scratchpad |

`robotdata` blev kaldt normalt og svarede — **ingen `Unknown skill`, intet fallback fra disk.**

---

## Sådan er der talt (tællereglen, så den kan genkøres)

D7 er ikke lukket: overskrifterne i DATAMODEL.md siger `Fysik (10)` og i alt **29**, mens den
opremsede feltliste efter L6-splittene indeholder **31**. Jeg opgiver derfor **begge** overalt og
låser ingenting.

Nævneren 31 er: Fysik 12 · Energi 5 · Sensorik 6 · Nyttelast/udvidelser 3 · Kommercielt/EU 5.
Nævneren 29 er den samme liste med nyttelast og trinhøjde talt som ét felt hver.

**Et felt tæller som udfyldt, når og kun når:**

1. Producenten oplyser en værdi for netop det felt **på sin egen side** — eller i en ressource,
   siden selv indlæser for at vise den (fx dens egen JS-bundle). Sekundære kilder tæller ikke.
2. Værdien bærer enhed, hvor feltet kræver enhed.
3. Ja/nej-felter tæller ved et eksplicit `Yes` / `No` / `支持`. **Et udtrykkeligt "nej" er
   udfyldt** — regel 10 siger, at `nej` og `ikke oplyst` er forskellige ting.
4. **Type uden model tæller ikke** (D4 er ikke lukket; indtil da er dette den strenge linje).
5. **Værdier i HTML-kommentarer tæller ikke.** De vises ikke i en browser og er derfor ikke
   publiceret. Se afsnit 1.2 — det er ikke et hypotetisk tilfælde.
6. **Værdier, der kun findes i et billede, tæller ikke** i det maskinlæsbare tal, men føres som
   den fjerde datatilstand. Se afsnit 3.4.
7. **Beregnelige værdier tæller ikke som oplyste.** `23Ah` uden spænding giver ikke Wh, og et
   Wh-tal, vi selv har ganget os frem til, er vores tal, ikke producentens.

Punkt 5 og 6 er nye. De blev tvunget frem af to fund i denne indsamling, ikke opfundet på forhånd.

---

## Råkilderne og manifestet

**30 filer gemt**, hver med kilde-URL, HTTP-statuskode, hentetidspunkt i UTC, SHA-256, bytestørrelse,
beskrivelse og sprogversion i `MANIFEST.tsv`. Manifestet har desuden **2 linjer for forsøg, der ikke
gemte en fil** (`(ingen fil gemt)`), så et fravær kan skelnes fra en forglemmelse.

**Fejlsider er navngivet, så de ikke kan forveksles med indhold:**

| Filnavn | Kode | Hvad det i virkeligheden er |
|---|---|---|
| `weilan-katalog-robots-cn-…-FEJL-404.html` | 404 | Sprogskifteren til kinesisk peger på en side, der ikke findes |
| `weilan-alphadogc-produktside-cn-…-FEJL-404.html` | 404 | Samme |
| `weilan-alphadoge-produktside-cn-…-FEJL-404.html` | 404 | Samme |
| `hiwonder-puppypipro-produktside-…-FEJL-404.html` | 404 | 1,6 MB Shopify-fejlside. Uden `-FEJL-404` i navnet ville den ligne en produktside |
| `yahboom-dogzilla-produktside-…-FEJL-404.html` | 404 | Mit gæt på URL'en var forkert; den rigtige er `/products/dogzilla-s1` |
| `xiaomi-…-UA-wget-…-FEJL-403.html` | 403 | **Gemt med vilje** — det er selve beviset i afsnit 2.1 |
| `xpengrobotics-INTET-PRODUKT-parkeret-domaene-til-salg-….html` | **200** | Se nedenfor |

Den sidste er den vigtigste af dem: **`xpengrobotics.com` svarer HTTP 200 og er ikke XPengs side.**
Det er et parkeret domæne til salg for 30 000 USD hos `spaceship.com`. En statuskode alene havde
ikke fanget det — kun at åbne filen gjorde. Filen er omdøbt, så navnet siger, hvad den er.

---

# Del 1 — Weilan / 蔚蓝科技, Nanjing

Kinesisk navn kontrolleret på producentens egne sider: **WEILAN Co., Ltd.**, ICP-nummer
`Su-ICP-Bei-19029747-1` (苏ICP备19029747号-1), altså registreret i Jiangsu. Produktsiderne selv
skriver kun `WEILAN` med latinske bogstaver.

> **Sprogskifteren på Weilans engelske sider er brudt.** Menupunktet `简体中文` peger på
> `https://www.weilan.com/alphadogc.html`, som svarer **404**. Det gælder alle tre sider jeg
> prøvede. Der findes altså ikke en kinesisk primærkilde at krydstjekke imod på weilan.com —
> hvilket er værd at vide, før nogen prøver.

## 1.1 AlphaDog C500 / C501 — det gamle udkast undertalte

Kilde: `https://www.weilan.com/en/en/alphadogc.html` → `weilan-alphadogc-produktside-2026-08-19.html` (200)

**De to tal, opgaven bad mig efterprøve ordret, holder begge.**

**De fire udholdenhedstal — bekræftet ordret, alle fire uden lastbetingelse:**

| Producentens etiket | Værdi ordret | Operator |
|---|---|---|
| `Average` | `Up to 5.7h` | `Up to` = `≤`, ikke `=` |
| `Continuous Walking` | `Up to 3.3h` | `Up to` |
| `Standing` | `Up to 8h` | `Up to` |
| `Standby Mode` | `Up to 18h` | `Up to` |

Ingen af de fire bærer en lastangivelse. Alle fire skal derfor bære `ved_last: ikke oplyst`.

**Driftstemperaturen — bekræftet ordret, og der er et tal mere, end udkastet fandt:**

| Felt | Værdi ordret |
|---|---|
| `Operating Ambient Temperature` | `0°C ～ 35°C` |
| `Nonoperating Temperature` | `0°C ～ 45°C` |

`0°C–35°C` står fast som indsamlingens smalleste driftstemperatur og den eneste, der ikke går under
frysepunktet. **For en dansk køber er den en diskvalifikator udendørs hele vinteren.**

Men *ikke-drifts*-temperaturen er den egentlige nyhed, og udkastet havde den ikke:
**`0°C ～ 45°C` betyder, at maskinen heller ikke må opbevares under frysepunktet.** En uopvarmet
garage eller et skur i Danmark ligger under 0 °C store dele af året. Det gør robotten ikke bare
uegnet til udendørs drift — det stiller også krav til, hvor den må stå, når den er slukket.
`Nonoperating Temperature` findes ikke i skemaet i dag; se skemamangel **N2** nedenfor.

> Bemærk formen: producenten bruger **fuldbredde-tilden `～` (U+FF5E)**, ikke ASCII `~`. Det skal
> normaliseres i indlæsningen, ellers matcher intervalparseren ikke.

**Hvad det gamle udkast talte forkert.** Udkastet skrev *"Udfyldt: 8 · 8/31 = 26 % · 8/29 = 28 %"*
og afsluttede feltlisten med *"Øvrige —"*. Tre felter er udfyldt på siden og blev ikke talt med:

| Felt | Værdi på siden | Hvorfor det tæller |
|---|---|---|
| `dataporte` | `Ports: HDMI, USB, WIFI` | Eksplicit portliste i specifikationstabellen |
| `kameraer` | `Fisheye Vision Camera: Yes`; `Depth Vision Camera: No / Yes` | Eksplicit ja/nej pr. variant |
| `autonominiveau` | `Autonomous Navigation: No (C500) / Yes (C501)` | Et udtrykkeligt **nej** er en oplysning, ikke et hul (regel 10) |

**Rettet tælling: 11 udfyldte felter. 11/31 = 35 % · 11/29 = 38 %** for begge varianter.

De 11: egenvægt · mål stående · nyttelast (udelt) · maks. hastighed · maks. hældning ·
driftstemperatur · driftstid · kameraer · onboard compute · autonominiveau · dataporte.

**Fire ting, der ikke tæller, og hvorfor:**

- **`Payload Capacity: Up to 3 kg` er ét udelt tal.** Producenten skelner ikke mellem gående og
  stående last. Det gamle udkast skrev det ind som `F5 nyttelast gående` — **det er en slutning, ikke
  en aflæsning**, og regel 6 findes for at forhindre netop den. Feltet skal bære, at producenten
  ikke skelner.
- **`Linux + ROS`, ikke ROS 2.** Feltet hedder `ROS 2`. Producenten oplyser ROS uden version.
  Tæller ikke.
- **`23Ah Lithium Battery` uden spænding.** Wh kan ikke udledes. Tæller ikke (tællereglens punkt 7).
- **Frihedsgrader er ikke oplyst som tal.** Siden oplyser leddenes bevægelsesområder
  (`Abduction/Adduction ±30°`, `Thigh Rotation -185°~+115°`, `Calf Rotation 0°~+150°`), hvoraf man
  *kan* slutte tre led pr. ben og dermed 12. **Det er en udregning, ikke en oplysning.** Feltet
  forbliver `ikke oplyst`.

**To-hastighedsproblemet står stadig:** `Speed: Up to 1.5 m/s` mod `Max. Safe Speed: 3.0m/s`.

## 1.2 AlphaDog E300 / E400L — konklusionen holder, forklaringen var forkert

Kilde: `https://www.weilan.com/en/en/alphadoge.html` → `weilan-alphadoge-produktside-2026-08-19.html` (200)

**Nul publicerede specifikationer. Bekræftet — 0/31 = 0 % · 0/29 = 0 %.**

**Men det gamle udkast beskrev siden forkert.** Udkastet skrev: *"Siden viser produktnavn, billede og
'Enterprise Version Available'."* Det er ikke rigtigt:

- Ordet `Enterprise` optræder **0 gange** i sidens rå HTML.
- Modelnavnene `E300` og `E400L` er **ikke synlige** på siden.
- Den synlige side består udelukkende af navigation, sidehoved og sidefod. **Der er intet
  produktindhold overhovedet.**

**Den virkelige forklaring er mere interessant, og den er en skemamangel.**

Specifikationerne findes i filen. De er bare **pakket ind i en HTML-kommentar**:

```
<!--    <section id="content"> … </section>  -->
   start: byte 19561 · slut: byte 53141 · længde: 33 580 bytes
```

Målt på den gemte fil: `<body>` er 73 121 tegn med kommentarer og 37 734 tegn uden.
**48 % af sidens krop er kommenteret ud.** Inde i kommentaren ligger et komplet
specifikationsark for begge modeller — ni tabeller, med bl.a. `Speed Up to 3 m/s` / `4 m/s`,
`Payload Capacity Up to 5 Kg` / `10 Kg`, `Weight 13 Kg` / `18 Kg`,
`Operating Ambient Temperature 0°C to 35°C`, `Nonoperating Temperature -20°C to 45°C` og
`Battery Type: Switchable Rechargeable Lithium-ion Battery` (altså hot-swap).

**Jeg har ikke ført et eneste af de tal ind som data, og det bør ingen gøre.** Kontrolleret:
siden indeholder ingen `innerHTML`, ingen `COMMENT_NODE`, ingen kode der genindsætter blokken —
`snav-content` optræder 4 gange, alle inde i selve kommentaren. **En browser viser intet af det.**
Indholdet er trukket tilbage. At hente tal ud af det ville være at udgive noget, producenten har
taget ned, med producentens navn på.

> **Konklusionen fra udkastet står, og den står stærkere.** Weilans *industrimodeller* — dem en
> driftschef ville overveje — har 0 % tæthed, mens deres legetøjsmodel har 35 %. En 0 %-post kan
> ikke spilles uden at udgive data. Og designspørgsmålet er uændret: **hvordan ser en post ud, hvor
> alle 31 felter er "ikke oplyst"?** Hvis den ser ødelagt ud, har vi bygget forkert.
>
> Men *hvorfor*-forklaringen skal rettes i kataloget. Det er ikke en producent, der aldrig har
> oplyst noget. Det er en producent, der **har oplyst det og derefter skjult det** — og
> forskellen betyder noget for, hvad man kan forvente at få oplyst ved henvendelse.

## 1.3 BabyAlpha — indsamlet for første gang

Kilde: `https://www.weilan.com/en/en/babyAlpha.html` → `weilan-babyalpha-produktside-2026-08-19.html` (200)

**Ingen specifikationstabel. 0/31 = 0 % · 0/29 = 0 %.**

Siden er ren markedsføring: ingen vægt, ingen mål, ingen hastighed, ingen driftstid, ingen batterital.
Sensorerne nævnes i prosa uden modeller og uden antal: *"wide-angle vision, active infrared vision,
360-degree lidar, multi-time-of-flight (TOF) radar, microphone array, multipoint touch sensor,
temperature and humidity sensor, 6DF inertial measurement unit (IMU) sensor, joint torque sensor,
displacement sensor, and 6D pose estimation."*

`360-degree lidar` er type uden model og tæller ikke (D4). Siden har en `BUY NOW`-knap, men **ingen pris.**

> **Weilan har nu tre nul-poster og én post på 35 %.** Det er producentens samlede profil: den
> eneste model, der oplyser noget, er udviklerversionen af legetøjet.

## 1.4 C100 og C200 — udkastets påstand er forkert på katalogniveau

Det gamle udkast skrev: *"C100 og C200 findes ikke længere. Producentens nuværende C-side viser kun
C500 og C501."* Det andet led er rigtigt. **Det første er forkert.**

Producentens katalogside `https://www.weilan.com/en/en/robots.html` (gemt, 200) viser 19. aug 2026:

| Produkt på katalogsiden | Undertekst |
|---|---|
| **AlphaDog C100** | `Developer Version and Limited Engineering Samples Available` |
| **AlphaDog C200** | `Developer and Enterprise Version Available` |
| **AlphaDog E300** | `Enterprise Version Available` |
| **AlphaDog E400L** | `Enterprise Version Available` |

**Producentens eget katalog og producentens egen produktside er uenige om, hvilke modeller der
findes.** Katalogsiden kender C100 og C200 og kender ikke C500/C501; C-produktsiden kender kun
C500/C501. Ankrene `#section-ad_c100` og `#section-ad_c200` ligger stadig i katalogsidens markup.

Og her ligger `Enterprise Version Available`, som udkastet tilskrev E-produktsiden: **sætningen står
på katalogsiden, ikke på E-siden.** Udkastet havde citatet rigtigt og kilden forkert.

**Prisene 16 900 CNY og 86 900 CNY er ikke overført til nogen model** og må ikke blive det.
Weilans ordreside (`order.html`, gemt, 200) oplyser **ingen priser overhovedet** — kun
*"We can assist you to make your order. Please contact us via email."* `vejledende pris` er
`ikke oplyst` for alle Weilan-modeller.

---

# Del 2 — Xiaomi CyberDog 2 / 铁蛋2

Kilder: `https://www.mi.com/cyberdog2` og `/cyberdog2/specs`, begge gemt (200).

**Dette er dokumentets vigtigste rettelse. Tre af det gamle udkasts fire påstande er forkerte, og
posten går fra 0 % til det højeste, projektet har målt.**

## 2.1 Påstand 1 — **FORKERT**

> *"Siden svarer HTTP 200 kun med en browser-user-agent; uden svarer mi.com HTTP 403."*

Målt med `curl -w '%{http_code}'`, samme URL, kun user-agent varieret:

| User-agent | Kode |
|---|---|
| Chrome 127 (browser) | **200** |
| `curl/8.15.0` (curls standard) | **200** |
| tom user-agent | **200** |
| `libwww-perl/6.0` | **200** |
| `Go-http-client/1.1` | **200** |
| `Wget/1.21` | **403** |
| `Scrapy/2.11` | **403** |
| `Java/17.0.1` | **403** |

**Det er en blokeringsliste, ikke en tilladelsesliste.** `mi.com` afviser nogle kendte
værktøjs-user-agents og lukker alle andre igennem — inklusive curls egen. 403-kroppen afslører,
hvem der blokerer: `errors.edgesuite.net` = **Akamai**, ikke Xiaomi selv.

Bevaret som `xiaomi-…-UA-wget-…-FEJL-403.html` (381 bytes) og
`xiaomi-…-UA-curl-standard-…html` (200), så påstanden kan efterprøves uden at hente igen.

**Hvorfor det betyder noget praktisk:** udkastets konklusion var, at *"vores hentere kan altså ikke
automatisk følge posten"*. Det er ikke rigtigt — de kan udmærket, så længe de ikke hedder wget.
En vedligeholdsrutine bygget på den antagelse ville være bygget på en fejl.

## 2.2 Påstand 2 — **RIGTIG**

> *"Der findes en parameterside, som siden selv kalder `参数页`."*

Bekræftet ordret. I sidens egen navigations-JSON:

```
{"title":"概述页","url":"https://www.mi.com/cyberdog2"},
{"title":"参数页","url":"https://www.mi.com/cyberdog2/specs"}
```

`参数页` optræder 3 gange i den gemte fil.

## 2.3 Påstand 3 — **FORKERT, og det er den afgørende**

> *"Parametersiden indeholder ingen søgbare tal — specifikationerne er udgivet som billeder.
> Søg i rå HTML efter `8.9`, `36.7`, `1.6m/s`, `12999`, `自由度`."*

Jeg søgte præcis som anvist. To ting gik galt i den oprindelige søgning.

**Først: søgningen giver faktisk træffere, men de er tilfældige.** `8.9` og `36.7` findes hver
2 gange i den rå HTML — men kontrolleret i kontekst er de delstrenge inde i sporings-id'er
(`data-spm="cms_10530.3476798.9"`, `bid=3916936.7`). **En ren delstrengssøgning kan ikke afgøre
spørgsmålet.** Det er en metodefælde, der er værd at skrive ned: nul træffere beviser fravær, men
træffere beviser ikke tilstedeværelse uden et kontekstopslag.

**Dernæst, og vigtigere: specifikationerne er ikke billeder. De er tekst — bare ikke i HTML'en.**

Parametersidens indholdselement er tomt ved levering:

```html
<specs-content>
    <div class="loader loader-gray"></div>
</specs-content>
```

75 bytes, og hele indholdet er en indlæsningssnurre. Siden henter sit indhold fra sin egen
JavaScript-bundle, som HTML'en selv linker til:

`https://cdn.cnbj1.fds.api.mi-img.com/mi.com-assets/shop/pro/js/product/cyberdog2/specs.74df51bf.js`
(gemt, 200, 109 869 bytes)

I bundlen ligger **hele specifikationsarket som ren tekst** i Vue-render-funktioner
(`t._v("…")`). Jeg trak 141 tekststrenge ud. `自由度` findes 3 gange — i den fil, sidens egen
HTML beder browseren om at hente.

## 2.4 Påstand 4 — **RIGTIG**

> *"Sidens JSON-blok siger `is_enable:false` og `price:0`."*

Bekræftet ordret:

```json
"product_info":{"product_id":"19079","name":"CyberDog 2 仿生四足机器人",
"price":"0","market_price":"0","is_enable":false,"is_multi_price":false}
```

Udkastet havde `price` og `is_enable`; der er også `market_price:"0"`. Produktet er ikke købbart
på mi.com på indsamlingsdagen. **`vejledende pris` er `ikke oplyst` — ikke `0`.** Et `price:"0"` i
en butiks-JSON for et produkt med `is_enable:false` betyder "ingen pris sat", ikke "koster nul".
At skrive `0` ind ville være regel 10-fejlen i sin reneste form.

## 2.5 Den fulde CyberDog 2-specifikation — fra primærkilde

Alt nedenfor er ordret fra `specs.74df51bf.js`, som `mi.com/cyberdog2/specs` selv indlæser.
Jeg regner det som **primærkilde**: det er producentens egen server, producentens eget indhold,
og det er den tekst, en besøgende faktisk får vist.

| Felt | Værdi ordret | Bemærkning |
|---|---|---|
| Produktmodel | `MS2242CN` | |
| Egenvægt | `8.9 ± 0.5kg` | **Med tolerance.** Ikke `8.9 kg` |
| Mål, stående | `长度：562mm 宽度：339mm 高度：481mm` | |
| Mål, liggende (`趴下`) | `长度：603mm 宽度：339mm 高度：300mm` | **"Liggende", ikke "sammenfoldet"** |
| Frihedsgrader | `整机12个自由度，单腿3个自由度` | 12 i alt, 3 pr. ben |
| Nyttelast | `最大负载: 1kg` | Udelt — ingen gående/stående-skelnen |
| Maks. hastighed | `最大前进方向速度: 1.6m/s` | Fremadrettet, laboratoriemålt |
| Driftstemperatur | `工作温度: 0°C~40°C` | |
| Batteri | `4500mAh 97.2Wh`, `标称电压 21.6V`, `充电限制电压 24.9V` | **Wh oplyst direkte** |
| Driftstid | `续航时间: 约90分钟` | `约` = "cirka" |
| Ladetid | `充电时间: 约90分钟` | |
| LiDAR | `激光传感器: YDLIDAR TG30` | **Type *og* model** |
| Kameraer | `Intel® RealSense™ D430` (dybde) · `13MP` (AI) · `1MP` (RGB) · `FOV 146°` (fisheye) | |
| Onboard compute | `6-core NVIDIA Carmel ARM v8.2 64-bit` · `384-core Volta GPU, 48 Tensor Cores` · `8GB LPDDR4x` · `16GB eMMC 5.1` · `32GB SD Class 10` | |
| OS / ROS | `Ubuntu 18.04 + ROS2` | **ROS 2 eksplicit** |
| Dataporte | `外置接口: Type-C x 1` | |
| Trådløst | `Wi-Fi IEEE 802.11 a/b/g/n/ac` · `蓝牙 5.0` | |
| Strømforsyning | `适配器型号 MDY-13-EU` · ind `100-240V~50/60Hz 3.0A` · ud `20V 10.5A MAX` | |
| Standarder | `GB 17625.1-2012` · `GB 4943.1-2011` · `GB/T 9254.1-2021` · batteri `GB31241-2014`, `UN38.3` | **Kun GB — ingen CE** |

**Driftstiden har en tilstandsbetingelse, og den er usædvanligt ærlig.** Fodnoten lyder:
`90 分钟续航是包括趴下、站立、静止姿态展示、常规地面稳定行走等基础行为综合测得` —
*de 90 minutter er målt som en blanding af at ligge ned, stå, vise statiske positurer og gå
stabilt på normalt underlag.* Det er ikke en lastangivelse, men det er en **tilstandsangivelse**,
og det er mere, end nogen anden producent i indsamlingen giver. Feltet bærer
`ved_last: ikke oplyst` plus tilstandsbeskrivelsen.

**Tæthed, to opgørelser:**

- **Streng (14 felter): 14/31 = 45 % · 14/29 = 48 %**
- **Med to skønsafhængige felter (16): 16/31 = 52 % · 16/29 = 55 %**

De to skønsafhængige er:
1. **`mål sammenfoldet`** — producenten oplyser mål i **liggende** stilling (`趴下`), ikke sammenfoldet.
   Det er en anden tilstand end den, feltet beskriver. Tælles den med, er den ikke sammenlignelig
   med Unitrees foldemål.
2. **`CE oplyst`** — producenten oplyser sine standarder, og **CE er ikke iblandt dem**; kun kinesiske
   GB-standarder. Det er et dokumenteret **nej**, ikke et hul. Regel 10 siger, at de to skal se
   forskellige ud — men om et dokumenteret nej *tæller med i tætheden*, er ikke besluttet.
   **Det er et spørgsmål til JPK**, se N4 nedenfor.

> **Konsekvensen er stor nok til at skulle siges rent.** Det gamle udkast skrev CyberDog 2 som
> **0 %** og som eksempel på "producenten oplyser det, men i et format vi ikke kan citere".
> Målt fra primærkilden er posten **48–55 %** og har som den eneste i hele indsamlingen både
> **LiDAR-model**, **frihedsgrader**, **ROS 2** og **batteri i Wh** — fire af de seks felter, der
> havde nul dækning på alle tre referencerobotter.
>
> Havde udkastet stået, ville kataloget have vist markedets mest åbne kinesiske post som markedets
> mest lukkede. **Rangeringen på åbenhed ville have været vendt på hovedet for netop den post.**
>
> **D9 nr. 8 skal rettes.** Den fjerde datatilstand — *oplyst, men kun som billede* — er ægte og
> nødvendig, men **CyberDog 2 er ikke et eksempel på den.** Se afsnit 3.4 for et rigtigt eksempel.

**To vedligeholdsforbehold, som ikke forsvinder:**

- **Filnavnet er indholds-hashet:** `specs.74df51bf.js`. Retter Xiaomi et tal, skifter navnet, og
  vores gemte URL peger på en fil, der ikke findes mere. Vedligeholdsrutinen skal hente HTML'en
  først og læse bundle-URL'en ud af den — ikke gemme bundle-URL'en som en konstant.
- **Tallene står ikke i HTML.** En validator, der kun ser sidens HTML, vil rapportere posten som tom.

---

# Del 3 — De syv producenter, ingen havde åbnet en side på

**Alle syv er åbnet. 7 af 7.** Resultatet er blandet, og de negative resultater er lige så
brugbare som de positive.

| Producent | Kinesisk navn (primærkilde) | Firbenede modeller | Specifikationsark? |
|---|---|---|---|
| Dreame | 追觅科技 | Eame One (1./2. gen.) | **Nej — findes ikke på producentens sider** |
| Yobotics | **山东优宝特智能机器人有限公司** | Y10 · Y20 · e-Dog | **Ja, fuldt** |
| XPeng / Pengxing | 鹏行智能 | robothest ("小白龙") | **Nej — ingen produktside** |
| Hiwonder | 幻尔科技 | PuppyPi · MechDog | **Ja** |
| Yahboom | 亚博智能 | DOGZILLA S1/S2 | **Ja, men som billede** |
| Elephant Robotics | 大象机器人 | metaDog | **Nej — kun markedsføring** |
| LimX Dynamics | — | W1 (udgået) | **Nej — har forladt feltet** |

## 3.1 Navnefælden fangede en fejl til

Advarslen i opgaven var berettiget. **Det gamle udkast skrev Yobotics' kinesiske navn som
`山东友宝特智能机器人`. Det er forkert.**

Producentens egen om-side skriver **`山东优宝特智能机器人有限公司`** — 2 træffere på `优宝特`,
**0 træffere på `友宝特`**. Forskellen er ét tegn: **优** (yōu, "fremragende") mod **友** (yǒu, "ven").
Samme udtale-familie, forskelligt tegn, forskelligt firma-navn.

Deres egen engelske gengivelse er **`Shandong Youbaote Intelligent Robot Co., Ltd`** (sidefod og
om-side). **`Yobotics` er domænenavnet, ikke firmaets eget engelske navn.** Kataloget bør skrive
begge og ikke lade domænet blive til et firmanavn.

Modelbeskrivelsen i udkastet — *"to-, fire- og seksbenede"* — passer heller ikke. Producentens
katalog har præcis to kategorier: **firbenede robotter** og **hydrauliske robotarme.**

## 3.2 Yobotics — den største positive overraskelse

Kilde: `https://www.yobotics.cn/en/product/quadruped_robot_series/` (gemt, 200)

Specifikationerne står i tabeller på den engelske side, men **selve tabellerne er på kinesisk**.
Markup'en bærer `x:str=""`-attributter — tabellerne er indsat fra Excel.

**En fælde, der ville have kostet en fejlpost:** overskrifterne og beskrivelserne er uenige om
modelnavnene.

| Overskrift på siden | Modelnavn i beskrivelsen lige under |
|---|---|
| `Y10` | *"**Y5**是一款桌面级…"* |
| `Y20` | *"**Y30**是一款全地形…"* |
| `e-Dog` | *"**Y15**是一款行业应用的…"* |

**Tre ud af tre stemmer ikke.** Jeg har brugt overskrifterne som modelnavn og noteret afvigelsen —
men posten kan ikke låses, før nogen har spurgt producenten hvilket navn der gælder. **Det er et
åbent punkt, ikke et løst.**

**Y20 — 15/31 = 48 % · 15/29 = 52 %.** Den tætteste post i hele det kinesiske spor:

| Felt | Værdi ordret |
|---|---|
| Egenvægt | `约60kg(含电池)` — cirka, **inkl. batteri** |
| Mål stående | `约1100mm×475mm×610mm` |
| Mål sammenfoldet | `约930mm×450mm×370mm` |
| **Nyttelast stående** | `站立负载: 最大150kg` |
| **Nyttelast gående** | `行走负载: 最大80kg` |
| Maks. hastighed | `最大4m/s` |
| Maks. hældning | `攀爬斜坡角度: 最大40°` |
| Trinhøjde | `攀爬台阶高度: 最大30cm` |
| IP-klasse | `IP54` |
| Driftstemperatur | `零下25℃~零上50℃` (−25 °C til +50 °C) |
| Driftstid | `空载持续行走＞5h, 有效负载作业＞2.5h` |
| Ladetid / docking | `充电桩…充满电时间≤3h` (tilvalg) |
| Batteri | `25Ah` (uden spænding → ikke Wh) |
| Compute | `Upboard×1: Intel Atom x5-Z8350 up to 1.92GHz` |

> **Tre ting her er vigtigere end tallene selv.**
>
> **(a) L6-splittet bekræftes af en producent, der ikke er Unitree.** `站立负载 150kg` mod
> `行走负载 80kg` — næsten dobbelt forskel, oplyst som to felter af producenten selv. Beslutningen
> om at splitte nyttelast er nu underbygget af to uafhængige producenter.
>
> **(b) Driftstiden har lastbetingelse indbygget.** `空载` = uden last, `有效负载作业` = i drift med
> nyttelast. Det er den eneste post i indsamlingen, hvor producenten selv leverer den betingelse,
> DATAMODEL.md's F3 efterlyser.
>
> **(c) −25 °C til +50 °C mod Weilans 0 °C til 35 °C.** To kinesiske producenter, samme dag, og
> den ene kan arbejde i dansk vinter mens den anden ikke må stå i et koldt skur. **Det er
> filteret "nedre driftstemperatur", der gør præcis det, PLAN.md afsnit 6 håbede på.**

**Y10 — 9/31 = 29 % · 9/29 = 31 %.** Bl.a. `约5.6kg±0.5kg(整机，含电池)`,
`持续行走负载 ＞3Kg` (eksplicit **gående** last), `奔跑速度 1.4m/s空载下` (hastighed **uden last** —
en hastighed med lastbetingelse, hvilket skemaet ikke har plads til), `续航 110分钟`, 12 frihedsgrader.

**e-Dog — 10/31 = 32 % · 10/29 = 34 %.** Bl.a. `680×330×380mm(±10mm)`, `15kg±0.5kg`,
`最大速度≥12km/h`, `爬坡角度≥35°`, `爬楼梯高度≥16cm`, `续航不低于1.5小时`, 12 frihedsgrader,
`峰值扭矩48Nm`.

**e-Dog oplyser tre nyttelasttal, ikke to:**
`最大静态负载能力8kg` (maks. statisk) · `最大动态负载能力5kg` (maks. dynamisk) ·
`工作动态负载能力3kg` (dynamisk **i drift**). Skemaet har to felter. Se skemamangel **N1**.

## 3.3 Hiwonder — undervisningskit med højere tæthed end industrirobotterne

Kilder: `hiwonder.com/products/puppypi` og `/products/mechdog` (begge gemt, 200).
`PuppyPi Pro` findes **ikke** som produktside — `/products/puppypi-pro` giver **404** (gemt som
`-FEJL-404`). Udkastets modelliste er altså forkert på det punkt.

**MechDog er Hiwonders produkt, ikke Elephant Robotics'.** Det gamle udkast førte MechDog op under
begge producenter. Hiwonder har både produktsiden og dokumentationen (`wiki.hiwonder.com/projects/MechDog`).

| Felt | PuppyPi | MechDog |
|---|---|---|
| Mål | `226*149*190mm` | `214*126*138mm (when it is powered on)` |
| Egenvægt | `720g` | `About 560g` |
| Frihedsgrader | `8DOF` | `8 DOF` |
| Kamera | `480P` | `320*240` |
| Batteri | `7.4V 2200mAh Lipo` | `7.4V 1500mAh 5C Lithium` |
| Compute | `Raspberry Pi 4B/5` | `ESP32 robot controller` |
| ROS | `Ubuntu22.04 + ROS Humble` / `Ubuntu20.04 + ROS noetic` | — |
| **Pris** | **`USD 1 059,99 – 1 179,99`** | **`USD 299,99 – 469,99`** |

**PuppyPi: 7/31 = 23 % · 7/29 = 24 %. MechDog: 6/31 = 19 % · 6/29 = 21 %.**

> **Undervisningskittene fylder felter, industrirobotterne lader stå tomme.** PuppyPi oplyser
> **frihedsgrader**, **ROS 2** og **pris** — tre af de seks felter, der havde nul dækning på Spot,
> B2 og ANYmal. Ikke fordi kittet er mere avanceret, men fordi det sælges i en netbutik, og en
> netbutik er nødt til at oplyse en pris.
>
> **Det peger direkte på D9 nr. 6 (`klasse`).** En sortering på tæthed, hvor PuppyPi til 1 060 USD
> ligger over ANYmal på 28 %, er teknisk korrekt og fuldstændig misvisende. `klasse` er ikke en
> pyntekolonne — uden den er sidens hovedtal utrolværdigt.

## 3.4 Yahboom — det ægte eksempel på den fjerde datatilstand

Kilde: `https://category.yahboom.net/products/dogzilla-s1` (gemt, 200)

DOGZILLA S1/S2's specifikationer er udgivet som **ét JPEG-billede**:
`Robot_Dog_DOGZILLA_Parameters.jpg` (gemt, 200, 243 861 bytes). Filen hedder bogstavelig talt
"Parameters".

**I sidens tekst findes kun `12 DOF` og prisen.** Alt andet — vægt, mål, driftstid, processor,
LiDAR-model — findes udelukkende inde i billedet.

Jeg har åbnet billedet og læst det. Det indeholder bl.a.:

| Felt | S1 | S2 |
|---|---|---|
| Egenvægt | `About 880g` | `About 982g` |
| Mål (tændt) | `246.2*144.6*169.5mm` | `246.2*144.6*195.3mm` |
| Mål (slukket) | `249.5*144.8*99.4mm` | `249.5*144.8*125.2mm` |
| Driftstid | `About 1.5 hours` | `About 1 hours` |
| Compute | `Raspberry Pi 5-4GB` | ← |
| OS | `raspios-bookworm-arm64 + Docker + ROS2 Humble` | ← |
| LiDAR | — | **`MS200 lidar`** |
| Frihedsgrader | `12 DOF joints` | ← |

**Tælling, to opgørelser:**
- **Maskinlæsbart: 2/31 = 6 % · 2/29 = 7 %** (frihedsgrader + pris)
- **Inkl. billedet: 10/31 = 32 % · 10/29 = 34 %**

> **Det er her, den fjerde datatilstand hører hjemme — ikke hos Xiaomi.** Yahboom **oplyser** det
> hele. Vi kan bare ikke citere det maskinelt, ikke validere det, og ikke se om det er ændret om
> tolv måneder uden at kigge på et billede med øjnene igen.
>
> **Forskellen på 6 % og 32 % er ikke en observation — det er et valg om metode**, og det valg
> skal træffes eksplicit og skrives på `/metode/`. Skrives posten som "ikke oplyst", lyver den om
> Yahboom. Skrives tallene ind som var de tekst, lyver tætheden om, hvor efterprøvelig posten er.
>
> **Billedet må aldrig genudgives.** Det ligger i `media/_kilder/` som bevis for, hvad siden sagde
> 19. aug 2026, og bliver dér. Det er fabrikantens materiale.

## 3.5 Elephant Robotics — ingen specifikationer på producentens sider

Kilder: `elephantrobotics.com/en/metadog-2024-en/` og `shop.elephantrobotics.com/products/metadog-…`
(begge gemt, 200).

**Ingen `<table>` på nogen af de to sider. Ingen vægt, mål, driftstid eller frihedsgrader i teksten.**
Kun markedsføring og en pris: **`USD 189,00 – 268,00`**.

**1/31 = 3 % · 1/29 = 3 %** (kun pris).

Tallene, søgninger returnerer (`930g`, `560×150×210mm`, `2000mAh`, `3 DOF`, `10-12 timer`), står hos
**RobotShop, Amazon og Kickstarter** — alle **SEKUNDÆRE**. De er ikke ført ind.

> **`3 DOF` rejser et scope-spørgsmål.** Med tre frihedsgrader i alt er metaDog ikke en firbenet
> robot i samme forstand som de øvrige — den går ikke med ledbenene, den er en animatronisk
> selskabsrobot. Den bør formentlig helt ud af kataloget, eller ind under `klasse: legetøj`.
> **Det er en beslutning, ikke noget jeg har truffet.** Bemærk desuden, at `3 DOF` selv er et
> sekundært tal — producenten oplyser det ikke.

## 3.6 Dreame — ingen produktside overhovedet

Kilder: `global.dreametech.com` og `dreame.tech` (begge gemt, 200).

Søgt i begge forsiders rå HTML efter `Eame`, `robot dog`, `quadruped`, `robotic dog`, `机器狗`, `四足`:
**0 træffere i alt, på begge sider.**

**Eame One findes ikke på Dreames egne sider.** Alt, hvad der cirkulerer om den — 15 frihedsgrader,
12 servomotorer, 21 TOPS, dobbelte RealSense-kameraer — kommer fra **messeomtale** (AWE) via
`leaderobot.com` (机器人大讲堂), som er et **medie, ikke producenten**.

**0/31 = 0 % · 0/29 = 0 %,** og posten kan ikke oprettes på primærkilder.

> **"Ingen produktside" er selv en oplysning en indkøber kan bruge.** En robot, der kun findes i
> messeomtale, kan man ikke købe, få leveringstid på eller reklamere over.

## 3.7 XPeng / Pengxing — domænet er til salg

**`xpengrobotics.com` er ikke XPengs.** HTTP 200, og indholdet er en salgsside for domænet hos
`spaceship.com` til 30 000 USD. Ingen af søgeordene `小白龙`, `鹏行`, `robot horse`, `quadruped`
findes på siden — 0 træffere hver.

Robothesten ("小白龙", *lille hvide drage*) blev vist af **Shenzhen Pengxing Intelligent** (鹏行智能),
et økosystemselskab under XPeng, som en **tredje generations prototype**. Den har aldrig haft en
produktside med specifikationer, og XPengs robotarbejde er siden gået til den humanoide **IRON**.

**0/31 = 0 % · 0/29 = 0 %.**

> Statuskoden alene ville have givet en falsk positiv her. **HTTP 200 betyder "en server svarede",
> ikke "producenten har en side".** Det er argumentet for, at manifestet skal have en
> *hvad-er-filen*-kolonne og ikke kun en kode.

## 3.8 LimX Dynamics — bekræftet, de har forladt firbensfeltet

Kilde: `https://www.limxdynamics.com/en` (gemt, 200)

**Bekræftet.** Produktnavigationen indeholder: **Luna** og **Oli** (humanoider), **TRON 1** og
**TRON 2** (tobenede/multiform), plus software (COSA, VGM, DreamActor, FluxVLA).
`quadruped` (lille q): 0 træffere. **Ingen firbenet robot i kataloget.**

`W1` optræder **præcis 1 gang** i hele filen — i virksomhedens historik-tidslinje:

> `2023 Sep: "Released first wheeled-legged robot W1"`

Og i i18n-ordbogen ligger en efterladt karruselstreng, der ikke vises nogen steder:
`"page.home.carousel.w1.subtitle":"Quadruped Wheeled Robot"`.

Historikken nævner desuden en model, udkastet ikke kendte:
`2022 Aug: "Quadruped prototype X1 unveiled"` og `2022 Sep: "Quadruped prototype X1 achieved
forward stair climbing"`.

**To rettelser til udkastet:** LimX kalder selv W1 **"wheeled-legged" / "Quadruped Wheeled Robot"** —
altså en hjulbenet firbenet, ikke en ren firbenet. Og **X1 (2022) var deres første firbenede**,
ikke W1.

**0/31 = 0 % · 0/29 = 0 %.** Bekræfter D9 nr. 7: `status` har brug for en femte tilstand —
*demonstrator / ikke kommercialiseret*. Både W1 og X1 er i den.

---

# Skemamangler fundet i dette spor

D9 har otte. Disse er **nye eller ændrede** i forhold til dem.

| # | Mangler | Fundet på | Hvorfor det gør ondt |
|---|---|---|---|
| **N1** | **Tre** nyttelasttilstande, ikke to | Yobotics e-Dog: `最大静态负载8kg` / `最大动态负载5kg` / `工作动态负载3kg` | L6 splittede i stående/gående. Her er der en tredje: *dynamisk i drift*. Vælger vi det forkerte af de tre, er posten 2,7 gange forkert |
| **N2** | `ikke-drift-temperatur` (opbevaring) | Weilan C500: `0°C ～ 45°C`; E-serien: `-20°C to 45°C` | En robot, der ikke må **opbevares** under frysepunktet, kan ikke stå i et dansk skur. Feltet findes ikke i skemaet |
| **N3** | **Lastbetingelse på hastighed**, ikke kun på driftstid | Yobotics Y10: `奔跑速度 1.4m/s空载下` (uden last) | F3 gav `ved_last` til driftstid. Hastighed har samme problem, og kun én producent oplyser betingelsen |
| **N4** | Tæller et **dokumenteret nej** med i tætheden? | CyberDog 2: oplyser GB-standarder, CE er ikke iblandt | Regel 10 siger, `nej` og `ikke oplyst` skal se forskellige ud. Men om et nej **tæller** som udfyldt, er ikke besluttet — og det flytter CyberDog 2 mellem 48 % og 55 % |
| **N5** | `vægt inkl. batteri` som eksplicit felt | Xiaomi: `整机重量 (含电池)`; Yobotics Y20: `约60kg(含电池)`; Y10: `(整机，含电池)` | Bekræfter D9 nr. 3 fra en helt anden kant: **tre kinesiske producenter siger det udtrykkeligt**, fordi det ikke er selvfølgeligt |
| **N6** | **Tolerance** som selvstændig del af et tal | `8.9 ± 0.5kg`, `5.6kg±0.5kg`, `15kg±0.5kg`, `680×330×380mm(±10mm)` | Fire poster bruger `±`. Skemaet har `operator` til `>`/`~`, men ikke et tolerance-felt. `8.9 ± 0.5` er ikke `8.9`, og det er heller ikke et interval |
| **N7** | `repeterbarhed / positioneringsnøjagtighed` | Yobotics Y20: `重复定位精度 ≤ ±6cm` | Det eneste præcisionstal i hele indsamlingen. Har ingen plads i skemaet |
| **N8** | **Modelnavn-konflikt på producentens egen side** | Yobotics: `Y10`/`Y5`, `Y20`/`Y30`, `e-Dog`/`Y15` | Ikke et felt, men en tilstand posten kan være i: *producenten er uenig med sig selv om navnet*. En post uden det forbehold ser mere sikker ud, end den er |

**Rettelse til den eksisterende D9 nr. 8:** eksemplet `Xiaomi CyberDog 2` er forkert og skal
udskiftes med **Yahboom DOGZILLA S1/S2**. Tilstanden er ægte — eksemplet var det ikke.

---

# Byggenoter — to parser-fælder, der er målt, ikke gættet

Begge ville tavst ødelægge data, og begge blev fundet, fordi efterprøvningen kørte mod den
gemte råfil frem for mod min hukommelse.

**1. Producenter bruger U+00A0 (hårdt mellemrum) mellem tal og enhed.**
Weilans hastighedscelle er byte for byte:

```
U p ␣ t o ␣ 1 . 5 \302\240 m / s
                   ↑ 0xC2 0xA0 = U+00A0
```

Min første efterprøvning meldte `Up to 1.5 m/s` som **manglende**, selvom værdien stod der.
En parser, der deler på ASCII-mellemrum, taber enheden eller hele feltet.
Weilan bruger desuden **fuldbredde-tilde `～` (U+FF5E)** i temperaturintervaller.

**2. Operatorer ankommer HTML-entitetskodede.**
Yobotics' gående last står i kilden som `&gt;3Kg`, ikke `>3Kg`.
**Det er præcis regel 4's tal.** En indlæsning, der ikke afkoder entiteter, forvandler
producentens `> 3 kg` til enten `3 kg` (forbeholdet forsvinder) eller `&gt;3Kg` (uparsbart).
Yobotics' tabeller bærer `x:str=""` — de er indsat fra Excel, hvilket er en sandsynlig kilde til
både entiteter og hårde mellemrum.

**Anbefaling:** normalisér U+00A0→mellemrum, U+FF5E→`~`, `℃`→`°C` og afkod HTML-entiteter
**før** feltparsning, og lad validatoren fejle på et talfelt, der stadig indeholder `&`.

---

# Tæthedstabel — hele dette spor

Begge nævnere opgivet, jf. D7. Rangeret efter 31-nævneren.

| Robot | Producent | Udfyldt | /31 | /29 | Note |
|---|---|---|---|---|---|
| Yobotics Y20 | 优宝特 | 15 | **48 %** | **52 %** | Modelnavn omstridt (`Y30`?) |
| Xiaomi CyberDog 2 | 小米 | 14–16 | **45–52 %** | **48–55 %** | Se N4 for spændet |
| Weilan AlphaDog C500 | 蔚蓝 | 11 | 35 % | 38 % | |
| Weilan AlphaDog C501 | 蔚蓝 | 11 | 35 % | 38 % | |
| Yobotics e-Dog | 优宝特 | 10 | 32 % | 34 % | Modelnavn omstridt (`Y15`?) |
| Yahboom DOGZILLA S1/S2 | 亚博 | 2 *(10)* | **6 %** *(32 %)* | **7 %** *(34 %)* | Kursiv = inkl. billede |
| Yobotics Y10 | 优宝特 | 9 | 29 % | 31 % | Modelnavn omstridt (`Y5`?) |
| Hiwonder PuppyPi | 幻尔 | 7 | 23 % | 24 % | |
| Hiwonder MechDog | 幻尔 | 6 | 19 % | 21 % | |
| Elephant metaDog | 大象 | 1 | 3 % | 3 % | Kun pris. 3 DOF — scope? |
| Weilan AlphaDog E300 | 蔚蓝 | 0 | **0 %** | **0 %** | Specs findes, men er kommenteret ud |
| Weilan AlphaDog E400L | 蔚蓝 | 0 | **0 %** | **0 %** | Samme |
| Weilan BabyAlpha | 蔚蓝 | 0 | 0 % | 0 % | |
| Dreame Eame One | 追觅 | 0 | 0 % | 0 % | Ingen produktside |
| XPeng robothest | 鹏行 | 0 | 0 % | 0 % | Ingen produktside |
| LimX W1 / X1 | — | 0 | 0 % | 0 % | Har forladt feltet |

**Referencerne til sammenligning:** Spot 55 % · B2 48 % · ANYmal 28 % (alle på 29-nævneren).

> **Yobotics Y20 og CyberDog 2 ligger på niveau med Spot.** `robotdata`-skillens tærskel —
> *"ligger en ny post markant over 55 %, er det sandsynligvis en fejl"* — er ikke overtrådt, men
> den er tættere på end forventet for kinesiske producenter. Jeg har kontrolleret begge for
> indsnegne sekundære kilder: **ingen fundet.** Alle tal stammer fra producentens egen side eller
> fra en ressource, siden selv indlæser.

---

# Selv-tjek (obligatorisk)

Efterprøvningen er kørt som et **script mod de gemte råfiler**, ikke som en gennemlæsning, så den
kan genkøres af den næste: `efterproev.js` slår 57 påstande op i den fil, de kom fra, med
normalisering af U+00A0, U+FF5E og HTML-entiteter.

**Efterprøvet 57 felter over 16 modeller, fandt 2 fejl, åbnede 7 af 7 nye producenter.**

De 2 fejl var begge i **min egen efterprøvning**, ikke i data — og begge afdækkede en parser-fælde,
der nu er skrevet ned:

1. `Up to 1.5 m/s` meldt manglende → hårdt mellemrum U+00A0. Bekræftet med byte-dump.
2. `>3Kg` meldt manglende → HTML-entitet `&gt;3Kg`. Bekræftet med byte-opslag.

Efter rettelse af harnisket: **57 af 57 påstande bekræftet mod råfil, 0 uforklarede afvigelser.**

Særligt kontrolleret, jf. `robotdata`-skillens punkt 3:

- **Operatorer bevaret (regel 4):** `Up to`, `Max.`, `>`, `≥`, `≤`, `约` (cirka), `±` er alle ført
  med som operator og ikke slugt. `Up to 5.7h` er ikke `5.7h`.
- **Nyttelast ikke blandet (regel 6):** Yobotics Y20's `150kg` (stående) og `80kg` (gående) er i
  hver sit felt. Weilans og Xiaomis **udelte** tal er markeret som udelte og **ikke** tildelt
  gående, selvom det gamle udkast gjorde det.
- **Trinhøjde ikke blandet (regel 7):** kun Yobotics oplyser trinhøjde. Y20's `最大30cm` er
  registreret som `forhindring_enkelt` — producenten oplyser **ikke** en kontinuerlig trappehøjde,
  så `trappetrin_kontinuerlig` er `ikke oplyst`. **De to må ikke sammenlignes med Spots 30 cm.**
- **Driftstid har lastbetingelse (regel 8):** alle 11 driftstidstal gennemgået. Yobotics Y20 er den
  eneste med reel lastbetingelse. De øvrige 10 bærer `ved_last: ikke oplyst`. Weilans fire og
  Yahbooms to bærer desuden en **tilstand** (gående/stående/standby), som skemaet ikke har.

**Manifestet er efterprøvet mod disken:** 30 filer på disk, 30 filrækker + 2 rækker for forsøg
uden resultat. SHA-256 er beregnet på filerne som de ligger nu, ikke som de blev hentet.

---

# Selv-review — hvad jeg er usikker på

**1. Er Xiaomis JS-bundle en primærkilde?** Jeg har regnet den som primær: producentens server,
producentens indhold, og det er den tekst, en besøgende ser. **Men det er en fortolkning, ikke en
regel projektet har.** Regner JPK den som sekundær, falder CyberDog 2 tilbage til ~0 %, og hele
afsnit 2 skifter konklusion. **Det er dokumentets mest konsekvensrige enkeltantagelse, og den bør
afgøres eksplicit.** Jeg har gemt bundlen, så begge veje kan efterprøves.

**2. To felter på CyberDog 2 er skøn.** `mål sammenfoldet` (producenten oplyser *liggende*) og
`CE oplyst` (dokumenteret nej). Derfor står posten som et spænd, ikke et tal. Jeg har ikke valgt
for JPK.

**3. Yobotics' modelnavne er uafklarede.** Tre af tre overskrifter er uenige med deres egen
beskrivelse. Jeg brugte overskrifterne. **Hvis beskrivelserne er de rigtige, hedder tre poster
noget forkert** — og det er præcis den slags fejl, der er svær at fjerne igen. Bør afklares ved
henvendelse til producenten før posterne låses.

**4. Yobotics' dataport-felt er talt på serieniveau.** `USB、Ethernet、串口、CAN` står i den fælles
seriebeskrivelse, ikke i den enkelte models tabel. Jeg talte det med for alle tre. **Det er den
mest tvivlsomme af mine 34 Yobotics-optællinger** — trækkes det fra, falder hver post ét felt.

**5. Jeg har ikke OCR'et Yahboom-billedet maskinelt.** Jeg har læst det med øjnene. Tallene i
afsnit 3.4 er afskrevet af mig fra et billede — det er en svagere kæde end resten af dokumentet,
og de bør ikke ind i en YAML-fil uden at nogen læser billedet igen.

**6. Weilans kinesiske sider kunne ikke nås.** Alle tre 404'ede. Der findes altså ingen
sprogversion at krydstjekke Weilans engelske tal imod — og krydstjek mellem sprogversioner er
netop den kontrol, der fangede Spot-længden i vest-sporet.

**7. Jeg har ikke verificeret de kinesiske navne på Hiwonder (幻尔科技), Yahboom (亚博智能),
Elephant Robotics (大象机器人), Dreame (追觅科技) og XPeng/Pengxing (鹏行智能) mod primærkilder.**
De er overtaget fra det gamle udkasts tabel. **Kun Yobotics' navn er efterprøvet — og det var
forkert.** Det giver en konkret grund til at mistro de øvrige fem. De bør kontrolleres på
producenternes kinesiske sider, før de skrives i kataloget.

**8. Tallene ser for pæne ud hos Yobotics.** `最大150kg`, `最大80kg`, `最大4m/s`, `最大40°`,
`最大30cm` — fem runde maksimumtal i træk. Det er markedsføringstal-mønsteret. Producenten oplyser
meget, men oplyser kun det flatterende: der er ingen støjmåling, ingen vedligeholdsinterval, ingen
MTBF, og driftstemperaturen `零下25℃~零上50℃` er skrevet i ord (*"25 grader under nul"*) frem for
som tal, hvilket er usædvanligt for et datablad.

---

# Hvad jeg ikke nåede

- **Weilans ordreside gav ingen priser**, og jeg har ikke skrevet til dem. `vejledende pris` er
  `ikke oplyst` for alle fire Weilan-modeller.
- **`PuppyPi Pro` er ikke indsamlet** — produktsiden giver 404. Jeg har ikke ledt efter et andet
  navn; den kan hedde noget andet i dag.
- **Hiwonders og Yahbooms øvrige firbenede modeller** (`ROSPug`, `DOGZILLA-Lite`) blev fundet i
  søgeresultater, men **ikke åbnet**. De står her som arbejdsliste, ikke som data.
- **Jeg har ikke gemt Xiaomis `chunk-vendors.js`.** Hvis specifikationstekst også ligger dér, har
  jeg overset den. Jeg fandt et komplet ark i `specs.…js` og stoppede.
- **Ingen YAML-filer er skrevet.** Opgaven var indsamling og efterprøvning; `data/robots/` er
  urørt, jf. at der ikke skrives kode, før CEO'en siger til.
- **D7 er ikke lukket, og jeg har ikke forsøgt at lukke den.** Alle tal står med begge nævnere.
