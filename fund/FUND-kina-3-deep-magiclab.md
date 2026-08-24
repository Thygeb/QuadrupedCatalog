# FUND-kina-3 — DEEP Robotics og MagicLab, med gemte råkilder

Indsamlet 19. august 2026. Erstatter afsnit 2.2 og 2.3 i `fund/FUND-kina.md`, som er
**ubekræftbar** (D6): dens råsider blev aldrig gemt.

**Denne gang er beviset gemt.** 31 råfiler ligger i hovedrepoet under
`media/_kilder/raa-kina-deep-magic-2026-08-19/` med `MANIFEST.tsv` (filnavn · kilde-URL ·
HTTP-kode · hentetid i UTC · SHA-256 · bytes · indhold · sprogversion). Mappen er
gitignoreret med vilje; den ligger i **hovedrepoet**, ikke i worktreen, så den overlever
oprydningen efter fletning.

**Skill-vurdering.** Valgt: `robotdata` — den bærer feltskemaet, de ti hårde regler og det
obligatoriske selv-tjek, og opgaven er præcis en dataindsamling. Den blev kaldt med
`/robotdata` og **indlæstes normalt** (intet `Unknown skill`). Gået forbi: `parallelt`
(jeg *er* det parallelle spor, ikke den der opdeler arbejdet), `impeccable`, `critique`,
`ui-ux-critique`, `dataviz` (design og visning — der er intet bygget at vurdere endnu),
`new-project`, `code-review`, `simplify` (ingen kode i denne opgave).

---

## 0. Sammendrag — hvad der ændrer sig i forhold til det gamle udkast

Syv ting. De fem første er **rettelser**, ikke tilføjelser.

| # | Det gamle udkast sagde | Måling 19. aug |
|---|---|---|
| R1 | X20 findes **kun** i den kinesiske navigation; læser man engelsk, findes den ikke | **Halvt rigtigt.** Den engelske X20-side **lever** på `/en/index/product.html` med egen titel. Den er *afkoblet* fra navigationen på **begge** sprog; kun det kinesiske forsidegitter linker den stadig |
| R2 | Mini-siden har `Battery capacity 10kg` — feltet er ubrugeligt og tælles ikke | **Kun den engelske side.** Den kinesiske side skriver `电池容量 620Wh`. Feltet er ikke ubrugeligt — det er **korrekt på kinesisk og forkert på engelsk** |
| R3 | Alle DEEP Robotics-sider bærer forbeholdet "All parameters are laboratory data" | **Fire ud af seks.** De to Lynx-sider bærer det ikke. Og CN siger noget andet: `官方测试数据` = *officielle testdata*, ikke *laboratoriedata* |
| R4 | MagicLab firbenede: MagicDog, MagicDog Pro, MagicDog-W, MagicDog Y1, Magic Panda | Varianterne hedder **PRO** og **EDU**, ikke Pro. Og der findes **tre Lynx M20-varianter** (M20, M20 Pro, M20S), hvor udkastet kun fandt én |
| R5 | Y1's datablad er strukturelt næsten identisk med B2's, og hvert af Y1's tal ligger lige over B2's | **Sensorstrengen og batteriformen matcher slående. "Hvert tal lige over" holder ikke:** hastighed er *lavere*, driftstidsintervallet er *identisk*, og B2 oplyser et felt (kontinuerlig trappe), Y1 slet ikke har |
| N1 | — | **MagicLab har to engelske sites, der modsiger hinanden** på vægt, forhindringshøjde og **to ulighedstegn** for samme robot |
| N2 | — | **MagicDog-W's `＜60 cm` er ikke en forhindringshøjde.** Den kinesiske etiket siger *afstands*-højde for hindringsundvigelse. Læst på engelsk ville tallet være landet i et mobilitetsfelt |

---

## 1. Metode og tælleregel

### 1.1 Kilder

Kun producenternes egne sider. Hver side hentet med `curl` og gemt rå; **HTTP-koden er
kontrolleret**, ikke blot at der kom bytes tilbage.

Fire værter, og de er ikke ligeværdige:

| Vært | Rolle | Sprog |
|---|---|---|
| `deeprobotics.cn/en/…` · `/robot/…` | DEEP Robotics, produktsider | EN og CN, samme sidestruktur |
| `magiclab.top` | MagicLab, produktsider | EN som standard; **CN findes, men har ingen rute** — se 1.3 |
| `magiclabglobal.com` | MagicLab, **nyt** globalt site | Kun EN |
| `support.magiclab.top` | MagicLab, udviklerdokumentation | **Kun CN** |

### 1.2 To fælder, der blev fanget undervejs

**Byte-identisk dublet.** `https://www.magiclab.top/` 301'er til `/en/`. Filen jeg gemte
som "CN-forside" var byte-for-byte identisk (`sha256 7f4ed932…`) med den engelske. **Den
er slettet**, og forsøget står i manifestet som resultat. Det er præcis den fejl, der gav
det forrige spor to identiske fejlsider under hvert sit navn.

**200 der ikke betyder noget.** `support.magiclab.top` returnerer **200 for enhver sti
under `/docs/<produkt>/`**. Kontrolmåling: `/docs/y1/der-findes-ikke-noget-her-12345` →
**200**, mens `/helt/vildt/vroevl` → **404**. En 200 dér er derfor ikke bevis for at en
side findes. Det afgjorde et konkret spørgsmål — se 3.4.

### 1.3 MagicLabs kinesiske version findes, men kun med cookie

`/zh/`, `/cn/`, `/zh-CN/`, `/zh-Hans/` giver alle **404** (serveren præfikser dem i stedet
til `/en/…`). Men sidens egen i18n-konfiguration opregner to locales, `en` og `zh
(简体中文)`. Den kinesiske version nås ved at kalde den **upræfiksede** sti med cookien
`i18n_redirected=zh`:

```
curl -H "Accept-Language: zh-CN,zh;q=0.9" -b "i18n_redirected=zh" https://www.magiclab.top/dog-y
```

Det er noteret i manifestets URL-felt for hver af de fire CN-filer, **fordi URL'en alene
ikke reproducerer hentningen.** Uden den note kunne sammenligningen ikke genkøres.

### 1.4 Tællereglen, mekanisk

Nævneren er omstridt (D7): overskrifterne siger 29, den opremsede feltliste giver 31.
**Beslutningen er ikke truffet, og jeg træffer den ikke.** Alle tal opgives som `n/29` og
`n/31`.

Et felt tæller som **udfyldt**, når og kun når:

1. **Producentens egen produktside** for den model trykker en værdi med enhed, eller et
   utvetydigt kategorisk svar (`●`/`○`, `Support`, `无`).
2. Værdien står i **specifikationstabellen eller i brødteksten på samme side**. Lynx S10
   har ingen tabel; uden punkt 2 ville den score 0.
3. **Begge sprogversioner tæller.** Et felt, der kun står på den kinesiske side, tæller
   med. Det gælder Minis batterikapacitet og Lynx M20's dockingstation.
4. **LiDAR med type men uden model tæller ikke** (D4, uafklaret — skillens instruks er at
   lade være og notere det). Det rammer Lynx M20/M20S, MagicDog, MagicDog-W og Y1.
5. **Batteri tæller kun, når Wh er trykt.** `8200 mAh, 29.6 V` uden Wh tæller ikke — vi
   regner ikke Wh ud af mAh og volt.
6. **En etiket, der dækker to skemafelter, tæller som ét felt** (X30's `Step/Obstacle
   Height`), og det lægges i det strengeste af de to.
7. **To tal i én celle, der hører i hvert sit skemafelt, tæller som to** (Lynx M20's to
   nyttelaster og to trinhøjder).
8. **Felter, der kun kan udfyldes fra udviklerdokumentationen, tæller ikke** — D1 er
   åben. De rapporteres separat i 3.4.
9. `无` og `/` betyder **"nej"**, ikke "ikke oplyst", og tæller derfor som **udfyldt**.
   Det er regel 10 i skillen. Det påvirker to modeller (X20, Lite3 Basic) med ét felt hver.

> **Punkt 9 er den mest omstridte, og den er billig at rulle tilbage.** Tælles `无`/`/`
> i stedet som "ikke oplyst", falder X20 til 8 og Lite3 Basic til 7. Ingen andre tal ændrer
> sig.

---

## 2. DEEP Robotics — 杭州云深处科技 (Hangzhou Yunshenchu), Hangzhou

`https://deeprobotics.cn` · serier 绝影/Jueying og 山猫/Lynx

### 2.1 Producentprofil: sprogasymmetri og forbehold

**Forbeholdet er ikke det samme på de to sprog.** Ordret, fra de gemte filer:

| Sprog | Ordlyd | Findes på |
|---|---|---|
| EN | `All parameters are laboratory data, operating in real environment may have differences.` | Lite3, Mini, X20, X30 |
| CN | `所有参数为官方测试数据，实际运行环境下或有偏差；` | Lite3, Mini, X20, X30 |

`官方测试数据` betyder **officielle testdata**, ikke *laboratoriedata*. Den engelske
formulering er altså det **stærkere** forbehold. Det er værd at holde fast i, fordi det
går den modsatte vej af Lite3-tilfældet nedenfor, hvor kinesisk er skarpest. **Der er ikke
et mønster om, at ét sprog altid er mere præcist — der er et mønster om, at de to sprog
ikke er den samme kilde.**

**De to Lynx-sider bærer ikke forbeholdet.** De bruger i stedet nummererede fodnoter, som
er mere specifikke — og strengere:

> `[1] Lab-tested extreme speed; safety-limited to 3m/s in user mode.`
> `[2] Lab-tested slope angle; actual performance varies by surface material.`
> `[3][4] Feature enabled via future OTA update.`

**Fodnote [1] giver et tredje hastighedstal.** Lynx M20 trykker `Lab-Tested Max. Speed
5m/s` og `Operating Max. Speed 2m/s` — og fodnoten siger, at produktet er *spærret til
3 m/s i brugertilstand*. Tre tal for samme egenskab: 5, 3, 2. Det gamle udkast fandt to.

**Fodnote [3][4] er den vigtigste.** På Lynx M20 er `Omnidirectional obstacle avoidance`
og `Point cloud surround view` de eneste to autonomiposter — og begge bærer fodnoten
*"Feature enabled via future OTA update"*. **De findes ikke i dag.** En katalogpost, der
læser funktionslisten uden fodnoten, ville tilskrive M20 en autonomi, producenten selv
siger den ikke har endnu. Autonomifeltet er derfor sat til *ikke oplyst* for M20 —
og til udfyldt for M20S, hvor de samme poster står **uden** fodnote.

### 2.2 X20 — hvad sprogasymmetrien faktisk består i

Det gamle udkast skrev, at X20 kun findes på kinesisk. **Målingen er mere præcis og mindre
dramatisk:**

| Sted | Engelsk site | Kinesisk site |
|---|---|---|
| Specside | **Lever.** `/en/index/product.html`, HTTP 200, titel `X20: The Ultimate Quadruped Bot series for Industrial Use` | **Lever.** `/robot/index/product.html` |
| Dropdown i header | Udkommenteret: `<!--<a href="/en/index/product.html" …X20…-->` | Udkommenteret, samme sted |
| Footer | Udkommenteret: `<!--<a href="/en/index/product.html">X20</a>-->` | Udkommenteret |
| Produktgitter på forsiden | **Findes ikke** — den engelske forside har intet produktgitter | **Live link:** `<a class="product" href="/robot/index/product.html"><div class="tit">绝影X20</div>` |

Konklusionen holder — **kun kinesisk navigation fører til X20** — men grunden er en anden,
og den er vigtigere: **siden er afpubliceret fra navigationen på begge sprog, uden at være
taget ned.** Mini er behandlet på samme måde (`<!--<a href="/en/index/product2.html">Mini</a>-->`).

Det er to modeller, der er gjort usynlige uden at blive erklæret udgåede. **Statusfeltet
"i produktion / annonceret / udgået" kan ikke udfyldes fra siden**, og det er i sig selv
det, en indkøber har brug for at vide. Foreslået håndtering: en fjerde status,
*afkoblet fra navigationen, side stadig online*, med hentedato.

**Og den engelske X20-side har en fejletiket, der er værre end Minis.** Ordret:

| Sektion | EN-etiket | CN-etiket | Værdi |
|---|---|---|---|
| Motion | **`Endurance`** | `持续作业负载` (kontinuerlig arbejdslast) | `20kg` |
| Battery | `Endurance` | `续航时间` (driftstid) | `2-4h` |

**Ordet `Endurance` optræder to gange på siden med to helt forskellige betydninger** — én
gang som nyttelast i kilogram, én gang som driftstid i timer. En læser af kun den engelske
side kan ikke vide, at X20 bærer 20 kg. Kun den kinesiske etiket afslører det.

Det er samme fejlklasse som Minis `Battery capacity 10kg`, men sværere at opdage, fordi
`20kg` *ser* rigtigt ud i en tabel — det er kun etiketten, der er forkert.

**Og dataportene:** EN skriver `Interface: /`. CN skriver `外置接口: 无` = **ingen**.
Regel 10 i skillen, fanget i naturen: `/` læses af enhver importør som *ikke oplyst*,
mens producenten faktisk har svaret **nej**.

| # | Felt | X20, som trykt |
|---|---|---|
| egenvægt | `53kg` / `整机重量 53kg` |
| mål stående | `950mm*470mm*700mm` |
| nyttelast gående | `20kg` — EN-etiket `Endurance`, CN-etiket `持续作业负载` |
| maks. hastighed | `≥4M/S` (versaler, som trykt) |
| maks. hældning | `≥30°` |
| trin/forhindring | `≥20CM` (kombineret etiket, versaler) |
| IP-klasse | `IP66` |
| driftstid | `2-4h`, rækkevidde `15km`, **last ikke oplyst** |
| dataporte | `无` / `/` — **nej, ikke "ikke oplyst"** |

**Udfyldt: 9.** 9/31 = **29 %** · 9/29 = **31 %**.

### 2.3 X30 og X30 Pro — modsat ulighedstegn hos samme producent

Kinesisk og engelsk side er **enige om samtlige tal**. Eneste forskel: EN tilføjer
`(battery included)` til vægten, hvor CN nøjes med `整机重量` (helmaskinevægt).

| # | Felt | X30 | X30 Pro |
|---|---|---|---|
| egenvægt | `56kg (battery included)` | `59kg (battery included)` |
| mål stående | `1000*695*470(mm)` | `1000*715*470(mm)` |
| maks. hastighed | `≥4m/s` | `≥4m/s` |
| maks. hældning | **`≤45°`** | **`≤45°`** |
| trin/forhindring | `≥20CM` (kombineret) | `≥20CM` |
| IP-klasse | `IP67` | `IP67` |
| driftstemperatur | `-20°~55°` | `-20°~55°` |
| driftstid | `2.5-4h`, `≥10km`, **last ikke oplyst** | ← |
| strøm ud | `Output power supply (72V BAT)` | `Output power supply (5V 12V 24V)` |
| dataporte | `Ethernet` | `USB2.0 USB3.0 Ethernet WiFi` |

**Udfyldt: 10** for begge. 10/31 = **32 %** · 10/29 = **34 %**.

**Operatorerne, efterprøvet på kodepunktniveau:**

| Model | Felt | Tegn | Kodepunkt |
|---|---|---|---|
| X20 | hældning | `≥30°` | U+2265 |
| X30 | hældning | `≤45°` | U+2264 |
| X20 | hastighed | `≥4M/S` | U+2265, **versaler** |
| X30 | hastighed | `≥4m/s` | U+2265, **små bogstaver** |

**Samme producent, samme felt, modsat ulighedstegn.** `≥30°` læses "mindst 30°", `≤45°`
læses "højst 45°" — det ene er et gulv, det andet et loft. Begge gengives som trykt.
Enhedernes versalisering skifter også inden for samme sides felter. **En normaliserende
importør retter begge dele stiltiende; det skal han ikke.**

**X30 oplyser ingen nyttelast** — hverken gående eller stående, på nogen af sprogene. Den
ældre X20 oplyser `20kg`. Producentens flagskib er blevet mindre oplysende end sin
forgænger. Det er den slags, tætheden skal kunne straffe.

**Kombineret trin-etiket.** `Step/Obstacle’s H` / `台阶/障碍物高度` slår de to felter
sammen, vi netop har adskilt. Værdien er lagt i **trappetrin_kontinuerlig** (den strengeste
tolkning), og `forhindring_enkelt` står tom. **Det er et valg, ikke en aflæsning** — den
modsatte placering ville give X30 en fordel, den ikke har dokumenteret.

### 2.4 Lite3 — den kinesiske etiket afgør feltet, og den er skarpere end ventet

Fire varianter i faneblade: **Basic · Venture · Pro · LIDAR** (基础 · 探索 · 专业 · 激光).

**Opgavens hovedspørgsmål, efterprøvet ordret.** Det er bekræftet, og den engelske etiket
er endnu tyndere, end opgaven angav:

| | Etiket, ordret | Værdi |
|---|---|---|
| EN | **`Stair`** — ét ord, ikke "Stair Height" | `18cm` |
| CN | **`连续楼梯高度`** — *kontinuerlig* trappehøjde | `18cm` |

**Kun den kinesiske side afgør, hvilket af vores to felter tallet hører i.** 18 cm er
`trappetrin_kontinuerlig`. Læser man kun engelsk, kan man lige så godt lægge det i
`forhindring_enkelt` — og så sammenligner kataloget en kontinuerlig trappehøjde med andre
robotters enkelttrin, som er 2-4× større. **Det er indsamlingens klareste enkeltargument
for, at kinesiske originalsider skal læses.**

Samme mønster på nyttelasten, mindre alvorligt: EN `Walking Load`, CN `持续行走负载`
(*kontinuerlig* gående last).

| # | Felt | Basic | Venture | Pro | LIDAR |
|---|---|---|---|---|---|
| egenvægt (m. batteri) | `12kg` | `12.2kg` | `12.9kg` | `13.5kg` |
| mål stående | `610mm*370mm*406mm` | `…*445mm` | `…*450mm` | `…*496mm` |
| nyttelast gående | `5kg` | `4.5kg` | `4kg` | `2.5kg` |
| maks. hældning | `40°` | ← | ← | ← |
| trappetrin kontinuerlig | `18cm` | ← | ← | ← |
| driftstid | `1.5h~2h`, `5km` | `4km` | `3.4km` | `2.7km` |
| autonominiveau | stopper for forhindring, følger | + fremadrettet undvigelse | ← | + `Auto Navigation` |
| dataporte | `无` / `/` = **nej** | `Ethernet*2` | `USB 3.0; HDMI; Ethernet` | ← |

**Udfyldt: 8** for alle fire. 8/31 = **26 %** · 8/29 = **28 %**.

> **Uenighed med det gamle udkast.** Det talte 10 for LiDAR-varianten ved at tælle
> `External Power Input (24V/12V/5V)` som feltet *strøm ud*. Det er **strøm ind**, og
> feltet er tomt. Samme fejl som `72V power input` på Lynx M20.

**Nyttelasten falder, når udstyret stiger:** 5 → 4,5 → 4 → 2,5 kg. Producenten trækker
sensorvægten fra nyttelasten. Det er ærligt og sjældent — og det betyder, at **en samlet
"Lite3"-post ikke findes**: på det felt, der filtreres mest på, er de fire varianter fire
forskellige robotter, med en spredning på faktor 2.

**Ingen hastighed, ingen IP-klasse, ingen driftstemperatur, ingen batterikapacitet, ingen
frihedsgrader** på nogen variant, på noget sprog.

### 2.5 Lynx M20, M20 Pro og M20S — tre varianter, ikke én

Det gamle udkast fandt én M20. Siden har **tre faneblade**, styret af `change(0|1|2)` mod
containerne `#pro_1`, `#pro_2`, `#pro_3`, med etiketterne **`LYNX M20` · `LYNX M20 Pro` ·
`LYNX M20S`** (CN: `山猫M20` · `山猫M20 Pro` · `山猫M20S`). Kortlægningen er læst i
sidens egen JavaScript, ikke gættet.

**M20 og M20 Pro er identiske på alt undtagen ét felt:** compute er
`(16GB+128GB)×2` mod `×3`. Alt andet — mål, vægt, nyttelast, hastighed, trin, IP,
temperatur — er tegn for tegn ens.

**M20S er en anden robot**, med samme mål og vægt, men markant højere tal:

| # | Felt | M20 / M20 Pro | **M20S** |
|---|---|---|---|
| egenvægt | `35kg` | `35kg` |
| mål stående | `820mm×430mm × 570mm` | `820mm×430mm×570mm` |
| nyttelast gående | `Payload Capacity 15kg` | `Effective Payload (standard terrain) 35kg` |
| nyttelast stående | `Max. Load Capacity 50kg` | `Maximum Payload Capacity 100kg` |
| maks. hastighed | `5m/s` lab · `2m/s` drift · **`3m/s` spærret** | `9m/s` lab · `2m/s` drift |
| forhindring enkelt | `Max. Single-Step Height 80cm` | `100cm` |
| trappetrin kontinuerlig | `Max. Continuous Stair Height 25cm` | `30cm` |
| maks. hældning | `45°` [2] | `45°` [2] |
| IP-klasse | `IP66` | `IP67` |
| driftstemperatur | `-20℃~55℃` | `-30°C to 55°C` |
| driftstid uden last | `3h/15km` | `3.5–5 hours` / `16–20 km` |
| driftstid m. last | `2.5h/12km` **ved 15 kg** | `2.5–3.5 hours` / `12–15 km` |
| ladetid | `1.5h` | `1.5h` |
| hot-swap | kun i brødtekst | `Hot-Swappable Dual Battery System` |
| dockingstation | **kun CN:** `自主充电(选配)` | `Autonomous Charging (Optional)` |
| autonominiveau | **fodnote [3][4]: findes ikke endnu** | `SLAM Mapping & Localization`, `Autonomous Navigation`, `Omnidirectional Obstacle Avoidance` |
| compute | `Dual octa-core … ×2` / `×3` | `3 × octa-core 64-bit … (16GB + 128GB)` |
| kameraer | `Wide-Angle Cameras ×2` | `Wide-Angle Cameras ×2` |
| dataporte | `Gigabit Ethernet` | `Gigabit Ethernet, USB 3.0, GMSL` |

**Udfyldt:** M20 **17**, M20 Pro **17**, M20S **18**.
M20: 17/31 = **55 %** · 17/29 = **59 %**. M20S: 18/31 = **58 %** · 18/29 = **62 %**.

> **M20S er indsamlingens tætteste post og bryder skillens advarselstærskel.** Skillen
> siger, at *"markant over 55 % er sandsynligvis en fejl — kontrollér om sekundære kilder
> er sneget med ind"*. Det er de ikke: alle 18 felter står i producentens egen tabel på
> producentens eget domæne, og hvert enkelt er slået op igen i den gemte råfil.
> **Tærsklen er sat på tre robotter og har nu mødt en fjerde, der ærligt overstiger den.**
> Det er tærsklen, der skal justeres, ikke posten.

**Det unikke ved M20-serien: begge trinhøjder står trykt.** `Max. Single-Step Height 80cm`
**og** `Max. Continuous Stair Height 25cm` på samme side, med hver sin etiket. Forholdet er
**3,2×**. På M20S er det `100cm` mod `30cm` — **3,3×**. Det er det eneste sted i hele
indsamlingen, hvor producenten selv trykker begge, og det er den bedste eksterne
bekræftelse på, at F2-splittet i DATAMODEL.md er rigtigt: havde vi taget det høje tal,
ville M20S slå alt andet i feltet; på det sammenlignelige tal ligger den på niveau med
Boston Dynamics Spots 30 cm.

**Nyttelast — en tolkning, ikke en aflæsning.** `Payload Capacity: 15kg` mod
`Max. Load Capacity: 50kg`. **Siden siger ikke, om "Max. Load" er stående last.** Jeg har
lagt den i `nyttelast_staaende`, fordi den strukturelt spiller samme rolle som Unitrees
`≥120kg` — men det er et valg. På M20S er etiketten `Effective Payload (standard terrain)`
mod `Maximum Payload Capacity`, hvilket peger samme vej uden at bevise det.

**Sprogforskel i funktionslisten.** Den kinesiske M20-tabel har rækken
`自主充电(选配)` (autonom opladning, tilvalg). **Den engelske M20-tabel har den ikke** —
den nævnes kun i brødteksten ovenfor ("optional self-charging"). Fem poster på engelsk,
seks på kinesisk.

**`72V power input` er strøm ind**, ikke ud. Feltet *strøm ud* står tomt for M20.

### 2.6 Lynx S10 — en lanceringsside, ikke et datablad

Ingen specifikationstabel på nogen af sprogene. Fem tal, alle i løbende brødtekst.

| # | Felt | EN, ordret | CN, ordret |
|---|---|---|---|
| egenvægt | `weighs ≤20 kg (including battery)` | `整机含电池自重≦20kg` |
| maks. hastighed | `flat-ground top speed of 8 m/s` | `平地极限速度可达8m/s` |
| forhindring enkelt | `clear obstacles up to 50 cm high` | `跨越50cm高障碍` |
| IP-klasse | `IP66 protection rating` | `整机防护等级达IP66` |
| driftstemperatur | `-20°C to 55°C` | `-20℃~55℃` |
| autonominiveau | `autonomous path planning and intelligent obstacle avoidance` | `自主路径规划、智能避障绕行` |

**Udfyldt: 6.** 6/31 = **19 %** · 6/29 = **21 %**.

**To ting, der kun ses ved at læse begge sprog:**

**Operatoren er to forskellige tegn.** EN bruger `≤` (U+2264), CN bruger `≦` (U+2266).
Samme robot, samme felt, samme dag. **Enhver validator, der matcher på tegnet frem for på
betydningen, vil se dem som to forskellige operatorer.** Efterprøvet på kodepunktniveau.

**CN er skarpere på hastigheden.** `极限速度` = *grænse-/ekstremhastighed* — samme ord som
i M20-tabellens `极限测试速度` (laboratorie-ekstremhastighed). EN siger blot `top speed`.
Den kinesiske side markerer altså, at 8 m/s er et grænsetal; den engelske gør ikke.

`≤20 kg` er en operator på **egenvægt** — en øvre grænse på producentens egen robots vægt.
Det er reelt en lovning, ikke en måling, og det er første gang i indsamlingen.

**Tal i brødtekst er sværere at datere og lettere at ændre uden spor** end tal i en tabel.
Det bør markeres på posten.

### 2.7 Mini — den kinesiske side redder et felt, den engelske ødelægger

Ældre side, stadig online, afkoblet fra begge navigationer.

**Det centrale fund, efterprøvet ordret i den rå markup:**

| Række | Engelsk side | Kinesisk side |
|---|---|---|
| Batterikapacitet | `<div class="col2_1">Battery capacity</div>`<br>`<div class="col2_2">10kg</div>` | `<div class="col2_1">电池容量</div>`<br>`<div class="col2_2">620Wh</div>` |
| Driftstid | `Endurance` → `40min` | `续航时间` → **`40min（存疑待核实）`** |

**To ting, og begge ændrer konklusionen fra det gamle udkast.**

**Feltet er ikke ubrugeligt — det er korrekt på kinesisk.** `620Wh` er en gyldig
batterikapacitet med rigtig enhed. Den engelske side har `10kg`, hvilket sandsynligvis er
`Max.load 10kg` kopieret ind i den forkerte række. Det gamle udkast konkluderede, at
feltet ikke kunne tælles. **Det kan det — det kræver bare, at man læser kilden på
originalsproget.** Det er den mest konkrete gevinst ved tosprogsreglen i hele
indsamlingen: ét felt reddet, som en engelsk-kun-læsning havde kasseret.

**Producenten markerer selv sin driftstid som tvivlsom.** `存疑待核实` betyder
*tvivlsom, afventer verifikation*. **Det står kun på kinesisk.** En producent, der i sin
egen offentlige specifikationstabel skriver, at et af dens tal ikke er verificeret, er et
usædvanligt ærligt signal — og det er usynligt for enhver, der læser engelsk.
Feltet skal bære producentens eget forbehold, ikke bare tallet.

| # | Felt | Som trykt |
|---|---|---|
| egenvægt | `23kg` |
| mål stående | `700mmX400mmX500mm` |
| nyttelast gående | `Max.load 10kg` |
| maks. hastighed + hældning | `3.3m/s；30°` — **to felter i én række**, adskilt af fuldbredde-semikolon (U+FF1B) |
| batteri | **`620Wh` (CN)** · `10kg` (EN — trykt enhedsfejl) |
| driftstid | `40min`, CN tilføjer `（存疑待核实）`, last ikke oplyst |
| compute | `Perception processor: Intel Core i7`, `CPU: NIVIDIA Jetson Xavier NX` |
| dataporte | `WIFI / USB / BLUETOOTH` |

**Udfyldt: 9** (kinesisk læsning) · **8** (kun engelsk). 9/31 = **29 %** · 9/29 = **31 %**.

`NIVIDIA` er producentens egen stavefejl og citeres som trykt. **Vi retter ikke — vi
noterer.** Bemærk også den mærkelige fordeling: *perception processor* er en Intel i7,
mens rækken kaldet *CPU* er en Jetson.

**Konsekvens for validatoren.** Her var der ingen imperial kolonne at krydstjekke imod;
det var enhedens **type**, der afslørede fejlen — kilogram i et energifelt. Validatoren
skal derfor tjekke, at **enheden passer til feltet**, ikke kun at der *er* en enhed. Det
er den samme lære som Spots `110mm (43.3 in)` (F4/D2), nået ad en anden vej.

---

## 3. MagicLab — 魔法原子, Wujiang/Suzhou

`https://www.magiclab.top/en/` · nyt globalt site `https://www.magiclabglobal.com` ·
udviklerdok `https://support.magiclab.top/`

### 3.1 Producentprofil: to engelske sites, der modsiger hinanden

MagicLab er midt i en flytning. Produktsiderne på `magiclab.top` bærer et banner:

> `We've Moved to a New Global Home` — *"Visit our new Global Site to access the latest in
> embodied AI and detailed product specs tailored for our global community."*

**Begge sites er i luften, begge er producentens egne, og de er ikke enige.** Det er ikke
en oversættelsesforskel — det er to engelske sider om samme robot med forskellige tal.

**MagicDog:**

| Felt | `magiclab.top` | `magiclabglobal.com` |
|---|---|---|
| egenvægt | `15.8kg` — **`Net Weight (Excluding Battery)`** | `17kg (with battery)` — `Total Weight: Approx` |
| forhindringshøjde | `Maximum Obstacle Height 15cm` | **`Max Obstacle Step Height Approx. 18cm (lab data)`** |
| frihedsgrader | `Degrees of Freedom (DOF) 13` | `12 + 1 (head DOF)` |
| driftstid | `1.5-3.0h` | `Approx. 2.5hours of continuous movement` |
| hastighed | `Maximum Speed 3.0m/s` | `Movement Speed 0–3.0m/s` |
| batteri | `29.6V 8200mAh 240.7W Fast Release` | `8200mAh, rated voltage 29.6V` |

**MagicDog-W — og her er det operatorerne, der vender:**

| Felt | `magiclab.top` | `magiclabglobal.com` |
|---|---|---|
| hastighed | `0-3 m/s` (interval op til 3) | **`≥ 3.0m/s`** (mindst 3) |
| maks. hældning | **`≤ 40°`** | **`≥ 40°`** |
| 60 cm-feltet | `Minimum obstacle clearance height ＜ 60 cm` | `Climbs and Drops: Up to 60cm` |

**`≤ 40°` mod `≥ 40°` for samme robot, samme sprog, samme producent, samme dag.** Det ene
er et loft, det andet et gulv. Det er en skarpere version af X20/X30-fundet, fordi det
dér i det mindste var to forskellige produkter.

Og `0-3 m/s` mod `≥ 3.0m/s` er ikke en afrunding — det er modsatte påstande: *"op til
3 m/s"* mod *"mindst 3 m/s"*.

**MagicDog Y1 er den eneste, hvor de to sites er enige** — tabellen er identisk række for
række.

> **Beslutning, der ikke kan træffes af indsamleren:** hvilket site er primærkilden?
> Begge er producentens egne. Det globale site er nyere, siger selv at det bærer
> *"detailed product specs"*, retter Y1-batteriets manglende Wh-fejl og tilføjer
> `(lab data)`-markeringer. Men det modsiger også det ældre site på felter, hvor ingen af
> dem giver en begrundelse. **Jeg har registreret begge og valgt ingen.** Feltet kan ikke
> udfyldes ærligt, før det er afgjort — og valget hører til hos JPK, ikke i en tabel.

### 3.2 MagicDog PRO og MagicDog EDU — 41 af 43 rækker er identiske

Varianterne hedder **PRO** og **EDU** (ikke "Pro", som det gamle udkast skrev).

**Målt, ikke skønnet:** tabellen har **43 datarækker**. Jeg har sammenlignet de to
kolonner celle for celle:

```
Datalinjer: 43   identiske: 41   forskellige: 2
  [Specifications]  PRO="MagicDog PRO"   EDU="MagicDog EDU"      <- selve navnerækken
  [SDK Support[2]]  PRO="○"              EDU="●"
```

**Der er præcis én specifikationsforskel mellem de to modeller: SDK-adgang.** Alt andet —
mål, vægt, frihedsgrader, nyttelast, hastighed, forhindring, hældning, sensorer, batteri,
adapter, ladedok og samtlige 16 funktionsflueben — er ens.

Og fortegnet er kontraintuitivt: **det er `EDU`, der har SDK'et; `PRO` har det ikke.**
Bekræftet på begge sprog (CN: `二次开发` = sekundær udvikling, `○` mod `●`).

**`○` mod `●` er tre-tilstands-problemet i grafisk form.** `●` = ja, `○` = nej. Der er
ingen tredje tilstand for *ikke oplyst* i denne tabel, og en scraper, der kun leder efter
`●`, vil registrere `○` som *fraværende oplysning* i stedet for som *nej*.

| # | Felt | Som trykt (PRO og EDU ens) |
|---|---|---|
| egenvægt | **`Net Weight (Excluding Battery) 15.8kg`** |
| mål stående | `670*350*560mm` |
| mål sammenfoldet | `720*440*290mm` (`Lying Down`) |
| frihedsgrader | `Degrees of Freedom (DOF) 13` — plus `Aluminum Alloy Precision Joint Motor 12` |
| nyttelast gående | `≈5kg （Max. ≈10kg）` — operator `≈` (U+2248), fuldbredde-parenteser |
| maks. hastighed | `3.0m/s` |
| forhindring enkelt | `Maximum Obstacle Height 15cm` |
| maks. hældning | `40°` |
| batteri | `29.6V 8200mAh 240.7W Fast Release` — **`W` hvor `Wh` hører** |
| driftstid | `1.5-3.0h`, **last ikke oplyst** |
| dockingstation | `Battery Charging Dock ●` |
| compute | `8-Core High-Performance CPU` |
| sensorer | `2D LiDAR + Dual Camera + Depth Camera + 4K HD Camera + Fisheye Camera + Ultrasonic Sensor` |
| autonominiveau | `Smart Obstacle Avoidance ●`, `Patrol Mode ●`, `Smart Following ●` |

**Udfyldt: 13** for begge. 13/31 = **42 %** · 13/29 = **45 %**.

**Vejningen er UDEN batteri**, og det er unikt i indsamlingen. Alle andre modeller — også
MagicLabs egne MagicDog-W (`22.5 kg (with battery)`) og Y1 (`70Kg (with Battery)`) —
oplyser vægt **med** batteri. **Samme producent bruger to modsatte vejekonventioner på tre
modeller.** Uden en eksplicit markering bliver `nyttelast ÷ egenvægt` systematisk forkert
for MagicDog, og forkert i den flatterende retning.

*(Det globale site oplyser `17kg (with battery)` for samme robot. De to tal er forenelige,
hvis batteriet vejer ca. 1,2 kg — men **det er en udledning, ikke et oplyst tal**, og det
skrives ikke ind som data.)*

**Den trykte enhedsfejl er efterprøvet ordret og findes på begge sprog:**
`29.6V 8200mAh 240.7W` / `29.6V 8200mAh 240.7W 快拆`. **Watt er effekt, ikke energi.**
Og selv læst velvilligt som `240.7Wh` passer det ikke: 29,6 V × 8,2 Ah = 242,7 Wh.
**Vi retter ikke, og vi regner ikke Wh ud af mAh og volt.** Batterifeltet står som
*ikke oplyst i Wh*, med producentens streng gengivet ordret.

> Bemærk forskellen på de to enhedsfejl: **Minis fejl findes kun på engelsk** og er rettet
> på kinesisk. **MagicDogs fejl findes på begge sprog** — den er ikke et
> oversættelsesuheld, men producentens egen. Kun det nye globale site har droppet den.

### 3.3 MagicDog-W — feltet, der ville være landet forkert

| # | Felt | EN, ordret | CN, ordret |
|---|---|---|---|
| egenvægt | `22.5 kg (with battery)` | `22.5 Kg（带电池）` |
| mål stående | `670*350*650mm` | ← |
| mål sammenfoldet | `720*500*290mm` (`Prone`) | `趴下尺寸` |
| motorantal | `16+1 (Head Motor)` | `16+1（头部电机）` |
| hovedrotation | `≥ 100°` (U+2265) | `>=100度` (ASCII) |
| nyttelast gående | `Maximum 10 kg` | `最大10 kg` |
| maks. hastighed | `0-3 m/s` | ← |
| **60 cm-feltet** | **`Minimum obstacle clearance height`** `＜ 60 cm` | **`最小避障距离高度`** `＜ 60 cm` |
| maks. hældning | `≤ 40°` | ← |
| compute | `6TOPS` | `本体算力 6TOPS` |
| udvidelsesmodul | `Standard High-Performance Computing Accelerator Module` | **`标配高性能算力模块(157 TOPS)`** |
| batteri | `Capacity: 8200 mAh, Rated Voltage: 29.6 V` — **ingen Wh** | ← |
| driftstid | `2-4 h`, last ikke oplyst | `续航时间 2-4 h` |
| standby | `Up to 8 hours (tested)` | `最长待机8h（实测）` |
| driftstemperatur | `-5° ~ 40°` | `-5° 到 40°` |

**Udfyldt: 10.** 10/31 = **32 %** · 10/29 = **34 %**.

**Det vigtigste fund i hele MagicLab-delen er række 11.**

Den engelske etiket, `Minimum obstacle clearance height`, læses naturligt som en
**mobilitetsegenskab**: hvor høj en forhindring robotten kan forcere. Havde jeg taget den
for pålydende, ville `60 cm` være landet i `forhindring_enkelt` — og MagicDog-W ville
dermed slå Lynx S10 (50 cm) og nærme sig Lynx M20 (80 cm) på en disciplin, den ikke er
dokumenteret for. På en robot på 22,5 kg med 10 kg nyttelast er det ikke plausibelt.

Den kinesiske etiket er `最小避障距离高度` — **minimum *hindringsundvigelses-afstands*højde**.
`避障` er hindrings*undvigelse*, altså sensorik, ikke forcering. **Feltet handler om, hvad
perceptionen kan se, ikke om hvad benene kan klare.**

Og det globale site kalder den tredje ting: `Climbs and Drops: Up to 60cm`.

**Tre etiketter, tre betydninger, ét tal.** Jeg har sat både `forhindring_enkelt` og
`trappetrin_kontinuerlig` til **ikke oplyst** for MagicDog-W og gemt alle tre strenge
ordret på posten. **Det er den eneste ærlige håndtering** — men det er værd at bemærke,
at operatoren `＜` (fuldbredde U+FF1C) i sig selv gør den engelske etiket selvmodsigende:
et *minimum*, der er *mindre end* noget.

**CN oplyser et tal, EN udelader det:** udvidelsesmodulet er `(157 TOPS)` på kinesisk og
uden tal på engelsk. Det er samme modul som i Y1.

**Den engelske side har en afhugget sætning:** `Supports ≥4 touch methods. The robot's
head provides corresponding facial.` Sætningen slutter dér. Kinesisk:
`…提供对应的表情显示和语音反馈` = *…giver tilsvarende ansigtsudtryk og stemmefeedback*.
Ikke et datafelt, men et mål for den engelske sides omhu.

**Batteriet oplyses kun som `8200 mAh` + `29.6 V`.** Ingen Wh. **Feltet står tomt** —
vi regner ikke. (Til sammenligning: MagicDog trykker en forkert Wh-lignende værdi for
samme batteri; MagicDog-W trykker slet ingen. Det er de to måder at miste feltet på.)

### 3.4 MagicDog Y1 — og sammenfaldet med Unitree B2

| # | Felt | EN, ordret | CN, ordret |
|---|---|---|---|
| egenvægt | `70Kg (with Battery)` | `70Kg（含电池）` |
| mål stående | `1050mm×458mm×810mm` | ← |
| nyttelast gående | `Dynamic Payload 45kg` | `运动载荷 45kg` |
| nyttelast stående | `Maximum Payload 150kg` | `最大载荷 150kg` |
| maks. hastighed | `6m/s` | `最大运动速度 6m/s` |
| klatrehøjde | `Maximum Climbing Height ≥60cm` | `最大攀爬高度 ≥60cm` |
| maks. hældning | `≥45°` | `爬坡角度 ≥45°` |
| IP-klasse | `IP67` | ← |
| driftstemperatur | `-20℃ to 55℃` (brødtekst) | ← |
| batteri | `45Ah (2400Wh), Voltage 54V` | `45Ah（2400Wh），电压54V` |
| driftstid | `4–6h ( >4 h continuous walking with 20 kg load )` | `4-6h（20kg负载持续行走>4h）` |
| compute | `8-Core … CPU` + `High-Performance Computing Module (157 TOPS)` | ← |
| sensorer | `3D LiDAR ×1 + Depth Cameras ×2 + Optical Cameras ×2 (configurations may vary)` | ← |
| monteringsinterface | `Extension Boards, Sliding Rails, Screw Mounts, Payload Platform` | ← |
| strøm ud | `(24V+485 output)*4 … (12V output+EthNet)*3` | ← |
| dataporte | `USB3.0*4`, `EthNet`, `EthCat x 1` | ← |

**Udfyldt: 16.** 16/31 = **52 %** · 16/29 = **55 %**.

**EN og CN er enige om hvert eneste tal** — inklusive afvigelsen nedenfor. Y1 er den
eneste MagicLab-model, hvor alle tre kilder (magiclab.top EN, magiclab.top CN,
magiclabglobal.com) er indbyrdes konsistente.

**Wh-afvigelsen, efterprøvet:** `45Ah (2400Wh), Voltage 54V`. 45 × 54 = **2430 Wh**, ikke
2400. Afvigelsen er 30 Wh (1,2 %). **Vi gengiver `2400Wh` som trykt** og noterer
uoverensstemmelsen på feltet. Vi regner ikke Wh ud af mAh og volt — og det er netop her,
reglen tjener sig ind: havde vi regnet, havde vi udgivet et tal, producenten ikke har sagt.

**Klatrehøjden er uafklaret.** `Maximum Climbing Height` / `最大攀爬高度` — hverken EN
eller CN siger, om det er et enkelt trin eller en kontinuerlig trappe. **Her hjælper den
kinesiske side ikke**, i modsætning til Lite3. Jeg har lagt `≥60cm` i
`forhindring_enkelt` og ladet `trappetrin_kontinuerlig` stå tom. **Det er en tolkning**, og
den er valgt, så tallet *ikke* kan forurene den sammenligning, DATAMODEL.md's F2 siger skal
bruge det kontinuerlige felt. Bemærk at valget her går modsat X30's: dér sagde etiketten
eksplicit `台阶` (trin), hvilket berettigede den strenge placering.

#### Sammenfaldet med Unitree B2 — dokumenteret, ikke forklaret

Det gamle udkast bemærkede, at Y1's datablad ligner Unitree B2's. **Jeg har efterprøvet
det felt for felt mod B2's gemte råside** (`raa-kina-unitree-2026-08-19/unitree-b2-produktside-2026-08-19.html`,
gemt af søstersporet samme dag).

| Felt | Unitree B2, ordret | MagicDog Y1, ordret | Forhold |
|---|---|---|---|
| **Sensorstreng** | `3D LiDAR ×1 + Depth camera ×2 + Optical camera ×2 (Varies with different configurations)` | `3D LiDAR ×1 + Depth Cameras ×2 + Optical Cameras ×2 (configurations may vary)` | **Samme opbygning, samme antal, samme forbehold** |
| **Batteriform** | `Battery capacity 45Ah(2250Wh)，voltage 58V` | `45Ah (2400Wh), Voltage 54V` | **Samme sætningsform, samme 45 Ah** |
| **Driftstidsinterval** | `Battery life 4-6h` | `4–6h` | **Identisk** |
| **Driftstid ved last** | `Walking with 20kg load > 4h` | `>4 h continuous walking with 20 kg load` | **Identisk tal, identisk last, identisk operator** |
| IP-klasse | `IP67` | `IP67` | Identisk |
| Nyttelast stående | `Load(Standing) ≥ 120kg` | `Maximum Payload 150kg` | Y1 over (+25 %) |
| Nyttelast gående | `Load(Walking) > 40kg` | `Dynamic Payload 45kg` | Y1 over (+12,5 %) |
| Maks. hældning | `Climbing Angle > 45°` | `≥45°` | ~lige, operator skifter |
| **Maks. hastighed** | `Running Speed > 6m/s` | `6m/s` | **Y1 er IKKE over — den er lig eller under** |
| Egenvægt | `≈ 60kg (battery included)` | `70Kg (with Battery)` | Y1 tungere |
| Mål stående | `≈ 1098mm×450mm×645mm` | `1050mm×458mm×810mm` | **Blandet** — Y1 kortere, bredere, højere |
| Forhindring | `Climb up and down stairs of 40cm` | `≥60cm` | Y1 over |
| **Kontinuerlig trappe** | **`Stairs of 20~25cm`** | **ikke oplyst** | **B2 oplyser, Y1 gør ikke** |

**Hvad der holder, og hvad der ikke gør.**

Det, der **holder**, er stærkere end udkastet formulerede det: sensorstrengen er den samme
konstruktion med samme antal og samme forbehold; batteriet oplyses i samme form og med
**samme 45 Ah**; driftstidsintervallet `4-6h` er identisk; og lastbetingelsen
`>4h ved 20 kg` er identisk ned til operatoren.

Det, der **ikke holder**, er påstanden om at *hvert* af Y1's tal ligger lige over B2's.
**Hastigheden er lavere** (`6m/s` mod `>6m/s`), målene er blandede, og på det felt, som
DATAMODEL.md's F2 udpeger som det eneste sammenlignelige — kontinuerlig trappehøjde —
**oplyser B2 et tal, og Y1 oplyser intet.**

**Vi kan ikke afgøre hvorfor, og vi påstår ingenting.** Fælles underleverandør af
sensorpakke og batteri, fælles bureau, en branchekonvention for hvordan et
firbens-datablad ser ud, eller efterligning — observationen skelner ikke mellem dem.
**Den står som observation, med begge kilder gemt, så en senere læser kan se det samme.**

Én ting, der bør give agt ved *begge*: **ingen af de to Wh-tal passer til deres eget
Ah × V.** B2: 45 Ah × 58 V = 2610 Wh, trykt 2250. Y1: 45 Ah × 54 V = 2430 Wh, trykt 2400.
Det er et argument for, at validatoren skal krydstjekke Wh mod Ah × V, når begge er trykt —
og for at et brud **ikke** må rettes, kun markeres.

### 3.5 Magic Panda — den, der aldrig blev indsamlet, og hvorfor

`https://www.magiclab.top/en/panda`. Indsamlet nu. **Der er næsten intet at indsamle.**

**Målt:** siden indeholder **0 `<table>`-elementer**. Hele specifikationsafsnittet er:

> `Product Specifications` — `In stand position: L 110cm × H 65cm × W 46cm. Face Width:
> 30cm; Face Height: 28cm`

**Udfyldt: 1** (mål stående). 1/31 = **3 %** · 1/29 = **3 %**.

Og produktet er ikke et arbejdsredskab. Ordret fra siden:

- `Limited Edition Collector's Grade Magic Panda`
- `CMG Spring Festival Gala Performance-Grade Replica` — replika af pandaen fra
  nytårsshowet 2026
- `Realistic Faux Fur` · `Limited Global Release: Unique Collection Serial Number`
- `* The panda in this link is a fixed-head version, while the panda in the Spring Festival
  Gala is a movable-head version` — **denne udgave kan ikke dreje hovedet**
- `※ Heat Dissipation Warning: … exterior made of genuine wool. Due to the risk of
  overheating, prolonged continuous operation is not recommended.`

**Anbefaling: Magic Panda hører ikke i kataloget.** Det er et samlerobjekt med uldpels,
serienummer og en producentadvarsel mod længerevarende drift. Det deler formentlig
hardware med MagicDog, men producenten oplyser intet om det. **Det nye globale site fører
den heller ikke** — `magiclabglobal.com` lister MagicDog, MagicDog-W og MagicDog Y1, og
ikke Panda. Producenten behandler den altså selv som noget andet end sin robotlinje.

Tages den alligevel med, bør den bære en eksplicit kategorimarkering, og den skal **holdes
ude af enhver rangering** — en post på 3 % tæthed vil ellers trække alle
gennemsnitsbetragtninger skævt.

### 3.6 Udviklerdokumentationen — to felter, der ellers har nul dækning

`support.magiclab.top` (魔法原子文档中心) er **kun kinesisk**. Der findes udviklerguider
for tre af de firbenede:

| Guide | URL | C++ | Python | **ROS 2** |
|---|---|---|---|---|
| MagicDog | `/docs/dog/about` | ✔ | ✔ | **✔** `ROS2 API`, `ROS2 SDK 使用说明`, `ros2_reference` |
| MagicDog-W | `/docs/dog_w/about` | ✔ | ✔ | **✔** samme struktur |
| MagicDog Y1 | `/docs/y1/about` | ✔ | ✔ | **✘ — ingen ROS2-rute** |

**Y1-resultatet er negativt, og beviset er en optælling, ikke en manglende fornemmelse.**
Y1-guidens egen navigation har **25 ruter**, alle under `/docs/y1/`: C++-API (7 tjenester),
Python-API (7 tjenester), 5 eksempler, SLAM-navigation, FAQ m.m. **Ingen af dem er ROS2.**
De ROS2-strenge, der *findes* i Y1-filen, peger alle på `zh/MagicDog/dog/…` og
`zh/MagicDog/dog_w/…` — de kommer fra det delte dokumentationsindeks, ikke fra Y1.

> **Og her betød statuskoden noget.** `/docs/y1/ros2_sdk` svarer **200**. Det er ikke
> bevis: kontrolmålingen `/docs/y1/der-findes-ikke-noget-her-12345` svarer **også 200**,
> mens `/helt/vildt/vroevl` svarer 404. Under `/docs/<produkt>/` returnerer denne SPA 200
> for hvad som helst. **Navigationsoptællingen er beviset; statuskoden er det ikke.**

**Disse felter er ikke talt med i tætheden**, fordi D1 er åben: må sekundære kilder —
her producentens egen udviklerdokumentation — bruges? DATAMODEL.md's F5 anbefaler netop
**ROS/SDK og frihedsgrader hentet fra udviklerdokumentationen**, og det her er et rent
eksempel: to af de seks felter med nul dækning kan udfyldes for tre robotter, fra
producentens eget domæne, dateret og gemt.

**Prisen står også klart:** dokumentationen er **kun på kinesisk**, så et felt hentet
derfra kan ikke belægges med en kilde, en dansk læser kan læse. Det bør fremgå af
kildemarkeringen, ikke skjules.

---

## 4. Samlet tæthedstabel

Tælleregel i afsnit 1.4. **Begge nævnere opgives, fordi D7 ikke er lukket.**

| Model | Producent | Udfyldt | **n/31** | **n/29** |
|---|---|---|---|---|
| Lynx M20S | DEEP Robotics | 18 | **58 %** | **62 %** |
| Lynx M20 | DEEP Robotics | 17 | **55 %** | **59 %** |
| Lynx M20 Pro | DEEP Robotics | 17 | **55 %** | **59 %** |
| MagicDog Y1 | MagicLab | 16 | **52 %** | **55 %** |
| MagicDog PRO | MagicLab | 13 | **42 %** | **45 %** |
| MagicDog EDU | MagicLab | 13 | **42 %** | **45 %** |
| X30 | DEEP Robotics | 10 | **32 %** | **34 %** |
| X30 Pro | DEEP Robotics | 10 | **32 %** | **34 %** |
| MagicDog-W | MagicLab | 10 | **32 %** | **34 %** |
| X20 | DEEP Robotics | 9 | **29 %** | **31 %** |
| Mini | DEEP Robotics | 9 | **29 %** | **31 %** |
| Lite3 Basic | DEEP Robotics | 8 | **26 %** | **28 %** |
| Lite3 Venture | DEEP Robotics | 8 | **26 %** | **28 %** |
| Lite3 Pro | DEEP Robotics | 8 | **26 %** | **28 %** |
| Lite3 LIDAR | DEEP Robotics | 8 | **26 %** | **28 %** |
| Lynx S10 | DEEP Robotics | 6 | **19 %** | **21 %** |
| Magic Panda | MagicLab | 1 | **3 %** | **3 %** |

17 modeller · 181 udfyldte felter i alt · gennemsnit **10,6 felter** pr. model
(34 % af 31 · 37 % af 29).

**Tre iagttagelser om selve målingen:**

**Nævnerens valg flytter hver eneste post 3-4 procentpoint.** Det er nok til at flytte
M20 og Y1 over eller under 55 %-mærket. **D7 skal lukkes, før tætheden bruges til noget.**

**Skillens advarselstærskel er nu mødt af en ærlig post.** M20S ligger på 62 % af 29 —
"markant over 55 %". Kontrollen er kørt: ingen sekundære kilder, alt fra producentens egen
tabel, hvert felt slået op igen i råfilen. **Tærsklen blev sat på tre robotter; den holder
ikke som fejlindikator.** Den bør omformuleres til en *kontrolpligt*, ikke en
sandsynlighedspåstand.

**Varianter er ikke robotter.** Af de 17 poster er 11 varianter af 6 grundmodeller, og to
af dem (M20/M20 Pro, MagicDog PRO/EDU) adskiller sig på **ét felt hver**. Kataloget skal
beslutte, om det viser 17 kort eller 6 kort med variantvælger. **Lite3 er argumentet for
17** — dens fire varianter spænder fra 5 til 2,5 kg nyttelast. **MagicDog PRO/EDU er
argumentet for 6** — to identiske kort ved siden af hinanden er støj.

---

## 5. Selv-tjek

Hvert tal, jeg agter at udgive, er slået op igen i **den gemte råfil**, som substring-match
mod den rå HTML — ikke mod min egen udtrækning, så en fejl i stripperen ikke kan bekræfte
sig selv. Scriptet ligger i scratchpad og kan genkøres.

> **Efterprøvet 156 felter over 17 modeller, fandt 2 fejl.**

Begge fejl var **mine**, ikke kildens, og begge blev fundet af tjekket:

1. `Unitree B2` nyttelast gående — min påstand `> 40kg` fandtes ikke. Årsag: siden koder
   den som `&gt; 40kg`, og jeg matchede mod rå HTML uden at afkode entiteter.
2. `Unitree B2` hastighed — samme årsag, `&gt; 6m/s`.

Rettet ved at afkode `&gt; &lt; &amp; &quot;` før sammenligning. **Genkørsel: 156
bekræftet, 0 fejlede.**

Fejl 1 og 2 afdækkede desuden et selvstændigt fund: **B2 trykker samme værdi med to
forskellige større-end-tegn på samme side** — `＞6m/s` (U+FF1E, fuldbredde) i
markedsføringsblokken og `> 6m/s` i tabellen. Det hører i søstersporets Unitree-post, ikke
i min, men det er noteret her, fordi det underbygger, at operatorer skal normaliseres på
*betydning* og gemmes på *form*.

**Særligt kontrolleret, jf. skillens punkt 3:**

| Regel | Kontrol | Resultat |
|---|---|---|
| 4 — operatorer bevaret | Kodepunkttjek på `≥ ≤ ≦ ＜ ≈ ＞` | 8 tilfælde bekræftet. Fandt at S10 bruger **≦** (U+2266) på CN og **≤** (U+2264) på EN, og at MagicDog-W bruger **＜** (U+FF1C) og **≤** (U+2264) i samme tabel |
| 6 — nyttelast ikke blandet | Alle poster med to nyttelasttal | Lynx M20 (15/50), M20S (35/100), Y1 (45/150) holdt adskilt. MagicDogs `≈5kg（Max. ≈10kg）` er **ikke** gående/stående, men nominel/maksimal — lagt samlet i `nyttelast_gaaende` med begge tal |
| 7 — trinhøjde ikke blandet | Alle poster med trin/forhindring | M20 (80/25) og M20S (100/30) adskilt som trykt. X30 (`≥20CM`) kombineret → ét felt. MagicDog-W (`＜60 cm`) → **begge felter tomme**. Y1 (`≥60cm`) → kun `forhindring_enkelt` |
| 8 — driftstid har lastbetingelse | Alle 15 driftstidsfelter | 5 har eksplicit last (M20 15 kg, M20S, Y1 20 kg, B2-sammenligning). **10 har `ved_last: ikke oplyst`** — X20, X30, X30 Pro, Lite3 ×4, Mini, MagicDog, MagicDog-W |
| 10 — tre tilstande | `无` / `/` / `○` | 4 tilfælde fundet, alle registreret som **"nej"**, ikke "ikke oplyst": X20 dataporte, Lite3 Basic dataporte, MagicDog PRO SDK |

**Manifestet er også kontrolleret:** 38 linjer, **alle med præcis 8 kolonner**; 31 filer på
disk, alle med en manifestpost; ingen fil uden registreret kilde-URL.

---

## 6. Selv-review — hvad jeg er usikker på

**Tolkninger, ikke aflæsninger.** Disse felter er placeret ved skøn. Hvis nogen senere
undrer sig over en placering, er det disse:

| Model | Felt | Hvad jeg valgte | Hvorfor det er et valg |
|---|---|---|---|
| Lynx M20 / M20S | `Max. Load Capacity` → `nyttelast_staaende` | 50 kg / 100 kg | **Siden siger ikke, at det er stående last.** Kun at det er en maksimal last. Placeringen er analogi til Unitrees `≥120kg` |
| X30 / X30 Pro | `Step/Obstacle’s H ≥20CM` → `trappetrin_kontinuerlig` | ét felt, det strengeste | Etiketten dækker begge felter. Den modsatte placering ville give X30 en udokumenteret fordel |
| MagicDog Y1 | `Maximum Climbing Height ≥60cm` → `forhindring_enkelt` | `trappetrin` tom | **Modsat X30-valget.** Her siger etiketten ikke "trin"; jeg holder tallet ude af det sammenlignelige felt |
| MagicDog | `≈5kg （Max. ≈10kg）` | begge i `nyttelast_gaaende` | Det er nominel mod maksimal, ikke gående mod stående. Men det er en læsning af en tvetydig celle |
| MagicDog-W | `＜60 cm` | **begge trinfelter tomme** | Tre kilder, tre etiketter, tre betydninger. Mest sandsynligt et perceptionsfelt, men ikke sikkert nok til at udfylde noget |
| Lynx M20 | autonominiveau | **tom** | Funktionerne er trykt, men fodnoten siger "future OTA update". Jeg læser det som *findes ikke i dag*. Nogen kan mene, at et annonceret feature bør tælle |
| Alle | hot-swap / docking fra brødtekst | talt med | Punkt 2 i tællereglen. Strengt tabel-kun ville koste M20 to felter |

**Det jeg er mest usikker på:**

**Hvilket MagicLab-site er primærkilden.** Jeg har registreret begge og valgt ingen. Det er
ærligt, men det efterlader **MagicDog og MagicDog-W uden entydige værdier på fem felter**.
Dette er ikke en detalje, der kan skubbes til byggetidspunktet — det bestemmer, hvad der
står på robottens kort. **Det skal afgøres, før posterne skrives.**

**Om `无`/`/` skal tælle som udfyldt.** Jeg mener ja — producenten *har* svaret — men det
er en tælleregel, ingen har besluttet, og den flytter to poster med ét felt hver. Jeg har
angivet den alternative optælling i afsnit 1.4, så det koster ingenting at vende den.

**Om varianter skal have hver sin post.** Jeg har talt 17 poster. Det er en
indsamlingsbeslutning, jeg har truffet for at kunne måle, ikke en katalogbeslutning.

**Y1/B2-sammenfaldet.** Jeg har dokumenteret det og afstået fra at forklare det. Jeg er
usikker på, om det overhovedet bør stå i en offentlig post: **observationen er faktuel, men
den inviterer læseren til at drage en slutning, vi ikke har belæg for.** Min anbefaling er,
at den bliver i fundfilen som intern note og **ikke** går på siden.

**Tal, der ser for pæne ud.** Lite3's `40°` hældning og `18cm` trappe er **identiske
på alle fire varianter**, selv om vægten stiger fra 12 til 13,5 kg og nyttelasten falder
fra 5 til 2,5 kg. Det kan være rigtigt — men det ligner et tal, der er kopieret mellem
faneblade snarere end målt pr. variant. Det kan jeg ikke afgøre fra kilden.

**Producenter, der oplyser meget, men kun det flatterende.** DEEP Robotics oplyser
konsekvent **ikke** batterikapacitet i Wh på nogen model undtagen Mini (kun på kinesisk)
— og Wh pr. driftstime er netop det beregnede felt, DATAMODEL.md's F3 udpeger. **Feltet
kan ikke beregnes for en eneste DEEP Robotics-model.** Ingen af de to producenter oplyser
pris, leveringstid, CE, EU-tilgængelighed eller servicepunkt i EU for nogen model.
De fem kommercielle/EU-felter har **nul dækning på alle 17 poster**, hvilket bekræfter F5.

---

## 7. Hvad jeg ikke nåede

**Ikke gjort, bevidst:**

- **De øvrige DEEP Robotics-produkter.** J60- og J80/J100-ledmodulerne og de humanoide
  DR01/DR02 er ikke firbenede og er ikke indsamlet. MagicLabs MagicBot-serie ligeledes.
- **`magiclabglobal.com`s øvrige sider.** Jeg hentede forsiden og de tre MagicDog-sider.
  Sitet har også `/resources/white-paper`, `/case-studies` og et downloadcenter, som kan
  indeholde datablade. **Ikke undersøgt** — de er sandsynligvis PDF'er, og D1 er åben.
- **DEEP Robotics' downloadcenter og FAQ.** Begge er linket fra hver produktside og kan
  indeholde datablade med de felter, produktsiderne mangler. **Ikke hentet**, samme grund.
- **Frihedsgrader for DEEP Robotics.** Ingen af de seks modeller oplyser det på
  produktsiden. Det ligger sandsynligvis i udviklerdokumentationen; jeg har ikke ledt,
  fordi D1 er åben og fordi MagicLab-eksemplet allerede viser problemet.

**Ikke lykkedes:**

- **MagicLabs kinesiske forside** kunne ikke hentes som selvstændig side; roden 301'er til
  `/en/`. De fire kinesiske **produktsider** lykkedes via cookie-metoden. Forsiden er
  formentlig tilgængelig samme vej, men jeg opdagede metoden efter at have hentet
  forsiden og prioriterede produktsiderne.
- **Ingen side måtte hentes med WebFetch.** Alle 31 filer er hentet med `curl` og gemt rå.
  Der er derfor ingen kilde i dette spor, som ikke kan efterprøves.

**Åbent, som andre skal lukke:**

| # | Spørgsmål | Hvem |
|---|---|---|
| **D7** | Nævner 29 eller 31. Flytter hver post 3-4 procentpoint | JPK |
| **D4** | Tæller LiDAR med type uden model? Rammer 5 af 17 poster | JPK |
| **D1** | Må udviklerdokumentation bruges? Ville give ROS 2 og SDK-sprog for 3 robotter | JPK |
| **N1** | Hvilket MagicLab-site er primærkilden? Blokerer 5 felter på 2 modeller | JPK |
| **N2** | Skal Magic Panda i kataloget? Anbefaling: nej | JPK |
| **N3** | Én post pr. variant, eller variantvælger? 17 mod 6 kort | Katalogdesign |
| **N4** | Status for X20 og Mini: "afkoblet fra navigation, side online" som fjerde tilstand? | Skema |
| **N5** | Skillens 55 %-tærskel er brudt af en ærlig post. Omformuleres til kontrolpligt | `robotdata` |
