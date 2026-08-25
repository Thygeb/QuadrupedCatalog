# FUND-kand4 — fem navngivne kandidater: findes de, og er de interessante?

Ren research-runde, stillet af CEO'en 25. aug 2026. **Ingen robotposter er skrevet eller ændret**
i dette spor — ingen filer i `data/robots/`. Arbejdet i git-worktree
`C:\Praktik\websites\udstilling-wt-kand4`, gren `spor/kand4`. Ingen anden worktree eller repo er
rørt (`c:\Praktik\website`, `c:\Praktik\websites\salg` og hovedrepoet er ikke besøgt).

**Læst først, som bedt om:**
- `.claude/skills/robotdata/SKILL.md` (30-feltsskemaet, de ti hårde regler, billedbaren, selv-tjek)
- `STATUS.md` — L11 (scope: legetøj/hobby/undervisningskit ude) og L21/L33 (sekundære kilder
  tilladt når de ligger på producentens eget domæne, eller alt materiale fra producenten selv med
  synligt mærke)
- `fund/FUND-kandglobal.md` og `fund/FUND-messe.md` — krydstjekket for alle fem navne. Ingen af de
  fem optræder i nogen af de to. Uniubi/Yufan optræder (kandidat #6 i messe-tabellen, allerede i
  kataloget), Pudu optræder (kandidat #1 i messe-tabellen, allerede i kataloget) — begge kun i den
  forstand at de allerede er katalogført, ikke som ny research at genbruge.
- **Ekstra fund undervejs:** `fund/FUND-felt.md` (en landskabsliste over 38 kinesiske producenter,
  ikke efterprøvet data) nævner allerede "Galileo | Tianjin | 2013 | BQR3 smart quadruped robot"
  som række 34 — men **ikke** de fire øvrige navne. Se afsnit 3 for hvorfor modelnavnet BQR3
  sandsynligvis er en fejltilskrivning.

---

## 0. Skill-vurdering

| Skill | Valgt? | Begrundelse |
|---|---|---|
| `robotdata` | Gået forbi (kun læst) | Opgaven er markedsafdækning, ikke postindsamling — ingen YAML skrives. Men SKILL.md er læst for stop-tjek-kriterierne (firbenet, ikke legetøj, egen producentside), som er brugt direkte nedenfor |
| `parallelt` | Gået forbi | Jeg *er* allerede ét spor i en fordelt kørsel (spor/kand4). Fem navne, én rapportfil — at splitte til fem underagenter ville give fem samtidige processer, der skriver rå kildefiler i samme mappe uden gevinst, da hvert navn tager 5-15 minutters research og kan køres sekventielt hurtigere end koordineringsomkostningen ved at dele det |
| `grillmig` | Gået forbi | Gælder gril af et brief *før* afsendelse, eller lås af en STATUS.md-beslutning. Intet af det sker her |
| `critique`, `ui-ux-critique`, `impeccable`, `dataviz` | Gået forbi | Ingen bygget flade, ingen sammenligningsgrafik |
| `new-project`, `code-review`, `simplify` | Gået forbi | Ingen kode ændret |

**Konklusion: ingen skill passer på selve udførelsen** ("webresearch af navngivne kandidater") —
samme konklusion som `FUND-kandglobal.md` og `FUND-messe.md` nåede for beslægtede opgaver.
`robotdata`s stop-tjek-kriterier er brugt som checkliste, ikke som fuld skill-kørsel.

---

## 1. X25-D

**1. Findes det?** **Ikke fundet**, efter seks navngivne søgninger:
- `"X25-D robot quadruped"` — kun DEEP Robotics X20/X30 (allerede katalogført), akademiske
  papers, ingen X25-D.
- `"X25-D" robot` — kun X25 industriel CT-scanner, Xbox Series X25, Dolphin X25 (pool-robot) —
  ingen relation til firbenede robotter.
- `"X25D" OR "X25-D" 机器人 四足` (kinesisk) — ingen træffer.
- `X25-D quadruped robot dog manufacturer WRC 2026` — gav kun allerede kendte WRC 2026-udstillere
  (Pudu D5, DaxAI Qiji X1, AGIBOT D1-serien) — ingen X25-D.
- Direkte tjek af Galileos officielle produktmanual (9 sider, alle seks nuværende serier C1/C1-W/
  E1/E1-W/S1/S1-W) for strengen "X25" — intet fund.
- Direkte tjek af Pudus, Uniubis og Galileos hjemmesider (rå HTML) for strengen "X25"/"x25" — intet
  fund på nogen af de tre.

**2. Stop-tjek:** Kan ikke afgøres — der er intet produkt at afgøre det på.

**3. Interessant?** Kan ikke vurderes uden et fundet produkt.

**4. Dubletkontrol:** X25-D optræder heller ikke i `fund/FUND-felt.md`s 38-producent-liste eller
i noget andet FUND-dokument i repoet (grep over hele `fund/`-mappen, nul træf).

**Vurdering:** Enten er navnet forkert stavet/husket, et internt kodenavn der aldrig blev
offentliggjort, eller et produkt fra en producent, hvis navn ikke er på listen. Kan ikke afgøres
uden yderligere kontekst fra CEO'en (hvor blev navnet set/hørt?).

---

## 2. Yuejia Lingdong Technology

**1. Findes det?** **Ja.** Kinesisk navn: **深圳越甲灵动（深圳）科技有限公司** — bogstaveligt
"Shenzhen Yuejia Lingdong (Shenzhen) Technology Co., Ltd." (den dobbelte "Shenzhen" i navnet er
producentens eget selskabsnavn, ikke en fejl i denne rapport — bekræftet i sidefoden på alle fire
produktsider). Officielt site: **yuejialingdong.com**. Registreret gennem "粤ICP备2025504006号-1"
— en 2025-ICP-registrering, altså et meget nyt selskab.

Citat (producentens egen metabeskrivelse, engelsk sideversion):
> "Yuejia Lingdong is a high-tech enterprise dedicated to the research and development of
> intelligent motion control and bionic robots."
> — [yuejialingdong.com, EN-metabeskrivelse](https://yuejialingdong.com/index.php/rencailinian.html?catdir=rencailinian&lang=en), hentet 2026-08-25

**2. Stop-tjek — firbenet:** **Ja**, bekræftet direkte i producentens egen sidenavigation:
> "越甲四足系列" (Yuejia Quadruped/Four-Legged Series), nav-link til `/yuejiasizuxilie.html`
> — [yuejialingdong.com/index.php/yuejiasizuxilie/56.html](https://yuejialingdong.com/index.php/yuejiasizuxilie/56.html), hentet 2026-08-25

Fire modeller i serien, alle med "立即购买" (Buy Now)-knap og pris i RMB — reelt kommercielt
produkt, ikke kun rendering:

| Model | Type | Pris | Kilde |
|---|---|---|---|
| YJ30 | firbenet | ¥78.000 | `/yuejiasizuxilie/56.html` |
| YJ30Max | firbenet | ¥288.000 | `/yuejiasizuxilie/57.html` |
| YJ30W MAX | **hjulben** (fire-hjul-drev, jf. egen tekst "采用四轮独立驱动结构") | ¥358.000 | `/yuejiasizuxilie/58.html` |
| YJ30 W | **hjulben** (samme forbehold) | ¥88.000 | `/yuejiasizuxilie/59.html` |

**Vigtigt forbehold på W-varianterne:** producentens egen tekst for YJ30W MAX og YJ30 W siger
eksplicit "轮足巡检机器人，采用四轮独立驱动结构" (hjulbenet inspektionsrobot med firehjuls
uafhængigt drev), ikke firbenet gang. De optræder alligevel under samme "四足系列"-navigation som
en -W-variant af den firbenede YJ30/YJ30Max — samme mønster som Unitree B2/B2-W og Pudu D5/D5-W,
som allerede står som to separate katalogposter hver. Kun YJ30 og YJ30Max består selve stop-tjekket
for firbenet.

Ikke legetøj/hobbykit (L11): nej — priserne (¥78.000–¥358.000, ca. 15.000–75.000 kr.) og de
angivne anvendelser (巡逻巡检、应急救援、电力巡检、警用巡逻 — patrulje/inspektion, redning,
el-inspektion, politipatrulje) placerer det klart i samme industri-/sikkerhedskategori som
kataloget i forvejen dækker.

**3. Interessant?** **Ja, stærkt.** Ny producent (findes ikke i kataloget under noget navn), nyt
brand, og en usædvanligt tæt specifikationstabel direkte fra producentens egen side — YJ30 alene
giver: stående mål, vægt, negativ/positiv negativt oplyst nyttelast, driftstid, trappetrinshøjde,
maks. hastighed, hældningsvinkel, DOF, IP-klasse, WiFi/4G/5G, billedtransmission. Groft optalt
dækker det direkte **10-12 af kataloget 30 felter** for YJ30 alene (egenvægt, længde×bredde×højde,
nyttelast_gående, driftstid, trappetrin_kontinuerlig, maks_hastighed, maks_hældning, frihedsgrader,
IP-klasse — evt. flere med et grundigt gennemsyn af "核心技术"-undersiderne, som ikke er besøgt i
denne runde). Det er markant højere end kataloget median (13/30 = 43 %, jf. `SKILL.md`).

**4. Dubletkontrol:** Ikke fundet under noget andet navn i kataloget eller i de to tidligere
globale scanninger. Selskabet er for nyt (2025-registrering) til at være dækket af tidligere
runder.

---

## 3. Galileo og Galileo Ex2

**1. Findes det?** **Ja, som producent** — men **"Galileo Ex2" specifikt blev ikke fundet.**
Producent: **伽利略（天津）技术有限公司** — Galileo (Tianjin) Technology Co., Ltd. Officielt site:
**galileotime.com** (en tung Vue/React-SPA, der ikke lader sig hente statisk — se selv-review for
begrænsningen). Fandt i stedet producentens egen 9-siders produktmanual, uploadet af selskabet selv
til World Robot Conferences officielle udstillerprofilside (WRC 2025):

> "伽利略（天津）技术有限公司 / 智能仿生四足机器人 / INTELLIGENT BIONIC QUADRUPED ROBOT"
> — [worldrobotconference.com, Galileo-produktmanual PDF](https://www.worldrobotconference.com/profile/robot/download/2025/07/08/Galileo-%E6%99%BA%E8%83%BD%E4%BB%BF%E7%94%9F%E5%9B%9B%E8%B6%B3%E6%9C%BA%E5%99%A8%E4%BA%BA%E4%BA%A7%E5%93%81%E6%89%8B%E5%86%8C_20250708115131A101.pdf), hentet 2026-08-25 (gemt lokalt, se afsnit 5)

**Ingen model hedder "Ex2" eller "EX2" noget sted** — hverken i denne officielle manual (der
dækker seks modeller: C1, C1-W, E1, E1-W, S1, S1-W), i fem forskellige søgninger (engelsk og
kinesisk, inkl. site-afgrænset), eller i den nyeste WRC 2026-nyhed om "Galileo X" (unveiled 24. aug
2026). Det tætteste fund er en **EX-1** — en separat, presseomtalt (ikke selv set på producentens
egen side) eksplosionssikret firbenet model:

> "伽利略EX-1全地形防爆机器人" / "Ex IIB T4 Gb 整机防爆等级"
> — [zhidx.com](https://zhidx.com/p/521138.html), presseartikel, hentet 2026-08-25 — **ikke
> producentens egen tekst**, kun sekundær kilde

**Vurdering af navnet:** "Galileo Ex2" er sandsynligvis en forveksling af enten **EX-1**
(det eksplosionssikrede produkt, presseomtalt, tal ikke direkte fra producenten) eller **E1**
(det mellemstore industri-produkt fra den officielle manual, hvor "1" let læses/høres som "Ex1"/
"Ex2"). Ingen af de to hedder "Ex2". Åbent spørgsmål, se afsnit 6.

**2. Stop-tjek — firbenet:** **Ja**, entydigt for hele C1/E1/S1-familien — titlen på selve
producentmanualen er "智能仿生四足机器人" (Intelligent Bionic Quadruped Robot), og hver model har
sin egen tabel med "四足" i produkttitlen (fx "【C1工业小型】智能仿生四足机器人"). De tre
-W-varianter (C1-W, E1-W, S1-W) er eksplicit "智能仿生**轮足**机器人" (hjulbenet), samme
et-til-en-parring som Yuejia og Pudu.

Ikke legetøj (L11): nej — produktmanualen viser anvendelser som lufthavns-/togstations-/
grænsepatrulje, brandvæsen, industri-inspektion, og militær/politi ("岗哨及武装反恐" —
vagtpost og bevæbnet antiterror). Reelt produkt, ikke kun rendering: tabellerne har fulde
tekniske specifikationer med enheder, ikke marketingtekst.

**3. Interessant?** **Ja.** Ny producent, seks separate modelvarianter med komplet
producentudgivet specark hver. Groft optalt for C1 alene (den mindste model): stående mål, vægt,
batterikapacitet, spænding, ladeinput, eksterne strømporte, kommunikationsporte, autonom opladning,
hastighed, hældningsvinkel, klatrehøjde, driftstid, rækkevidde, nyttelast (to felter: effektiv og
maks.), CPU, kommunikation, LiDAR-rækkevidde, IP-klasse, temperaturområde — det dækker direkte
**15-18 af 30 felter**, potentielt kataloget nye højeste tæthedstal (over Gangben L2's 77 %), hvis
alle felter kan mappes 1:1 til skemaets navngivning. **Kræver en direkte feltmapping-runde**, da
producentens egne feltnavne (fx "有效负载"/"最大负载" = nyttelast gående/nyttelast stående; "续航
时间"/"续航里程" = driftstid/rækkevidde) ikke nødvendigvis følger skemaets to-felts-opdeling
1:1 uden efterprøvning.

**4. Dubletkontrol:** Ikke i kataloget under noget navn. **Allerede nævnt** (uafhængigt) i
`fund/FUND-felt.md` række 34: "Galileo | Tianjin | 2013 | BQR3 smart quadruped robot" — men
modelnavnet BQR3 stemmer ikke med noget fundet i denne runde (C1/C1-W/E1/E1-W/S1/S1-W/EX-1/X).
En stikprøvesøgning på "BQR3" finder i stedet en robot brugt i forskningsartikler fra Beijing
Institute of Technology (Kalman-filter-baseret kraftestimering) — sandsynligvis en
sammenblanding i den ueftterprøvede landskabsliste, ikke et reelt Galileo-produktnavn. Bør ikke
tælle som en tidligere afvisning af Galileo, kun som et tidligere *set*-mærke.

---

## 4. Pudu Robotics — flere firbenede modeller end D5/D5-W?

**Findes flere?** **Nej**, ikke på producentens nuværende site. Hentet direkte fra den
JSON-produktkode, der driver navigationen på pudurobotics.com/en/products (samme kilde som
allerede citeret i `data/robots/pudu-d5.yaml`):

> `"D9":"PUDU D9 The First Full-sized Bipedal Humanoid Robot by Pudu Robotics"`
> `"D5":"PUDU D5 Series Industry-Grade Autonomous Quadruped Robot"`
> `"D7":"PUDU D7 The First-Generation Semi-Humanoid Robot by Pudu Robotics"`
> — [pudurobotics.com/en/products](https://www.pudurobotics.com/en/products), rå HTML hentet
> 2026-08-25 (gemt lokalt, se afsnit 5)

Den fulde produktkode-liste (26 koder i alt: rengørings-, leverings- og embodied AI-robotter)
indeholder **kun ét** firbenet-kodet produkt: **D5**. D7 og D9 er eksplicit humanoide (to-benede),
ikke firbenede — irrelevante per opgavens afgrænsning. Det tidligere **D1** (selskabets første
leveringsquadruped fra 2022, fundet omtalt i pressemeddelelser og i den ældre `old-official.
pudurobotics.com`-underdomæne) findes **ikke** i den nuværende produktkode-liste — sandsynligvis
udgået/erstattet af D5-serien. Ingen ny model fundet ud over det allerede katalogførte D5/D5-W-par.

**Konklusion:** Ingen ændring nødvendig. De to eksisterende poster (`pudu-d5.yaml`, `pudu-d5-w.
yaml`) dækker hele Pudus nuværende firbenede sortiment.

---

## 5. UNIUBI (Yufan) — flere firbenede modeller end Cyvet?

**Findes flere?** **Nej**, ikke fundet. Producentens egen sektion for firbenede robotter
(uniubi.com/embodied-ai/robot) viser kun ét brandet produkt:

> Sidetitel: "灵猫•Cyvet" — undertekst "灵巧于形，智能于心" (yndefuld i form, intelligent i
> hjerte) / "你的第一只赛博灵宠" (din første cyber-kæledyr)
> — [uniubi.com/embodied-ai/robot](https://www.uniubi.com/embodied-ai/robot), rå HTML hentet
> 2026-08-25 (gemt lokalt, se afsnit 5)

Topnavigationens eneste firbenet-relaterede link ("四足机器人") peger på netop denne ene side.
En opfølgende søgning specifikt efter en "Cyvet Creator"-variant (nævnt i `fund/FUND-messe.md`
som "Cyvet, Cyvet Creator") gav ingen selvstændig kilde til en separat Creator-model ud over selve
Cyvet — mest sandsynligt en undertitel/udviklerudgave af samme produkt, ikke en ny model med eget
navn og specark.

**Konklusion:** Ingen ændring nødvendig. Den eksisterende post (`yufan-lingmao-cyvet.yaml`) dækker
Uniubis nuværende firbenede sortiment, så vidt denne runde kunne afgøre.

---

## 6. Anbefalingstabel

| Navn | Anbefaling | Begrundelse (én linje) |
|---|---|---|
| **X25-D** | Kan ikke afgøres | Intet fund efter seks søgninger på tværs af tre producenters egne sites og generel web — intet produkt at vurdere |
| **Yuejia Lingdong (YJ30/YJ30Max)** | **Tilføj** | Ny producent, reelt kommercielt produkt (købsknap, RMB-pris), 10-12/30 felter direkte udfyldelige fra producentens egen tabel — over kataloget median |
| **Galileo (C1/E1/S1-serien)** | **Tilføj** | Ny producent, seks modelvarianter med komplet officielt specark (producentens egen 9-siders manual), potentielt kataloget højeste tæthedstal — men "Ex2"-navnet specifikt findes ikke, se åbent spørgsmål |
| **Pudu Robotics** | Ingen ny post nødvendig | Kun D5/D5-W er firbenede på producentens nuværende site — begge allerede katalogført |
| **UNIUBI (Yufan)** | Ingen ny post nødvendig | Kun Cyvet er firbenet på producentens nuværende site — allerede katalogført |

CEO'en beslutter herfra. Ingen robotpost er oprettet i denne runde.

---

## 7. Evidens gemt (media/_kilder/raa-kand4-2026-08-25/, gitignoreret)

12 filer, alle hentet 2026-08-25:

1. `galileo-wrc-product-manual-2025.pdf` — Galileos officielle 9-siders produktmanual (C1/C1-W/
   E1/E1-W/S1/S1-W), uploadet af producenten selv til WRC's officielle udstillerprofil
2. `galileotime-home-2026-08-25.html` — galileotime.com forside (kun SPA-skal, se selv-review)
3. `galileotime-robot-zh-2026-08-25.html` — galileotime.com/zh/main/Robot (samme SPA-begrænsning)
4. `pudu-products-2026-08-25.html` — pudurobotics.com/en/products, rå HTML med fuld produktkode-JSON
5. `uniubi-embodied-ai-2026-08-25.html` — uniubi.com/embodied-ai
6. `uniubi-embodied-robot-2026-08-25.html` — uniubi.com/embodied-ai/robot (Cyvet-siden)
7. `yuejialingdong-en-2026-08-25.html` — yuejialingdong.com forside, engelsk metadata
8. `yuejialingdong-yj-56-2026-08-25.html` — YJ30-produktside
9. `yuejialingdong-yj-57-2026-08-25.html` — YJ30Max-produktside
10. `yuejialingdong-yj-58-2026-08-25.html` — YJ30W MAX-produktside
11. `yuejialingdong-yj-59-2026-08-25.html` — YJ30 W-produktside
12. `yuejialingdong-yj30-en-2026-08-25.html` — YJ30-produktside, engelsk version

---

## 8. Selv-tjek med tælling

- **N = 5** navne undersøgt (X25-D, Yuejia Lingdong, Galileo/Galileo Ex2, Pudu, UNIUBI).
- **M = 4** producent-sites fundet (Yuejia Lingdong, Galileo, Pudu, UNIUBI — X25-D gav 0).
- **K = 4** stop-tjek afgjort med direkte producentcitat: Yuejia Lingdong (firbenet: ja, med
  hjulben-forbehold på W-varianterne), Galileo (firbenet: ja, samme W-mønster), Pudu (ingen nyt
  produkt at stop-tjekke — bekræftet uændret sortiment via producentens egen produktkode-liste),
  UNIUBI (samme — bekræftet uændret sortiment). X25-D har intet at stop-tjekke.
- **J = 3** åbne spørgsmål (listet i afsnit 9).

Alle fem navnes søgestrenge er skrevet ud i de respektive afsnit ovenfor, ikke kun konklusionen —
i tråd med reglen om at en negativ konklusion uden søgestreng ikke kan efterprøves.

---

## 9. Selv-review — hvad jeg er usikker på, og hvad jeg ikke nåede

**Åbne spørgsmål (J = 3):**

1. **"Galileo Ex2" er stadig uafklaret.** Jeg fandt hverken en model med det præcise navn, eller
   en entydig forklaring på forvekslingen. To kandidater (EX-1 eksplosionssikret, E1 industri-
   mellemklasse) er begge plausible, ingen er bekræftet. Hvis CEO'en har set navnet et konkret
   sted (en messeliste, en artikel), ville den kilde afgøre det på minutter — jeg har ikke den
   kilde.
2. **galileotime.com selv kunne ikke hentes statisk** — det er en tung Vue/React-SPA, hvor `curl`
   kun giver en tom app-skal (2175 bytes, bekræftet to gange). Al Galileo-data i denne rapport
   kommer fra den officielle PDF-manual (hostet på WRC's exhibitor-side, men uploadet af
   producenten selv) og pressekilder, **ikke** fra en direkte hentning af producentens eget
   domæne. Det er en svagere kildekæde end de andre fire — bør efterprøves med et
   browser-baseret hentningsværktøj (Playwright/headless Chrome), som jeg ikke har adgang til i
   dette spor.
3. **"Cyvet Creator" (UNIUBI) er ikke afklaret som separat model eller variant-undertekst.** Jeg
   fandt ingen selvstændig kilde, der beskriver den som noget andet end Cyvet selv — men jeg har
   heller ikke set en direkte modsigelse. Lav prioritet, da det under alle omstændigheder ikke
   ville være en ny producent.

**Hvad jeg ikke nåede:**

- Feltmapping felt-for-felt for hverken Yuejia Lingdong eller Galileo — specifikationstætheden
  angivet ovenfor (10-12/30 og 15-18/30) er et **groft skøn ud fra tabellernes rækker**, ikke en
  efterprøvet optælling mod `tools/skema.mjs`s 30 feltnavne. Det hører til, hvis/når en agent
  bygger disse to som fulde katalogposter (jf. mønsteret i `fund/FUND-kand3.md`).
  - Galileo E1-W og S1-W's felter er ikke gennemgået lige så grundigt som C1 — kun tabellerne er
    læst, ikke krydstjekket mod skemaets exakte enheder/operator-krav (regel 4-9 i SKILL.md).
- Yuejia Lingdongs anden produktserie ("越甲机器人系列", link `/yuejiajiqirenxilie.html`) er
  **ikke besøgt** — uklart om den indeholder yderligere firbenede modeller eller er en
  ikke-quadruped-linje (fx håndrobotter). Nævnt her, så fravalget er synligt.
- Galileos "X"-model (unveiled ved WRC 2026, 24. aug 2026 — dagen før denne research) er kun set
  i presseoverskrifter, ikke i egen kildetekst — for ny til at være i den hentede PDF-manual
  (dateret juli 2025).
- Ingen af de fem navne blev søgt på japansk, koreansk eller andre sprog end dansk/engelsk/
  kinesisk — irrelevant for X25-D/Galileo (kinesiske/uklare rødder), men kunne i teorien være
  relevant hvis "Yuejia Lingdong" viser sig at have en anden hovedmarkedsbetegnelse.
- Jeg har **ikke** forsøgt at bekræfte Galileos "9个国家高新技术企业认定"-type
  virksomhedscertificeringer (kvalitetsstempler nævnt i manualens side 2) — irrelevant for
  robotdata-skemaet, men nævnt for fuldstændighedens skyld.

**Hvad jeg er sikker på:** Pudu og UNIUBI's nuværende sortiment (ingen skjulte ekstra firbenede
modeller) er bekræftet direkte mod hver producents egen, maskinelt genererede produktkode-liste —
ikke et skøn ud fra en menu, der kunne mangle et element. X25-D's fravær er bekræftet med seks
uafhængige søgestrenge på tværs af to sprog. Yuejia Lingdong og Galileos eksistens som reelle,
firbenede, kommercielle producenter er begge bekræftet med direkte citat fra egen side/eget
materiale — den eneste usikkerhed er navnepræcisionen på "Galileo Ex2".
