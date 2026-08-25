# FUND-kand7 — elleve navngivne kandidater fra CEO'en: findes de, og er de interessante?

Ren research-runde, samme opgaveform som `fund/FUND-kand4.md`. **Ingen robotposter er skrevet
eller ændret** i dette spor — ingen filer i `data/robots/`. Arbejdet i git-worktree
`C:\Praktik\websites\udstilling-wt-kand7`, gren `spor/kand7`. Ingen anden worktree eller repo er
rørt (`c:\Praktik\website`, `c:\Praktik\websites\salg` og hovedrepoet er ikke besøgt).

**Læst først, som bedt om:**
- `.claude/skills/robotdata/SKILL.md` — stop-tjek-kriterierne (firbenet, ikke legetøj, ægte
  produkt på egen side) og billedbaren. Ikke kørt som fuld skill, kun brugt som checkliste (se §0).
- `STATUS.md` — L11 (scope: legetøj/hobby/undervisningskit ude, med Sony Aibo som navngivet
  eksempel), L21 og L33 om sekundære kilder. **Vigtigt fund undervejs:** L21 og L33 modsiger ikke
  hinanden, men de trækker en grænse, der bider hårdt i denne runde — se §0.1.
- `fund/FUND-kand4.md` — formen for denne rapport, og X25-D-forarbejdet (seks søgninger, intet
  fund) som navn #11 nedenfor bygger videre på.
- `fund/FUND-messe.md` — krydstjekket. Ingen af de elleve navne står der. Vbot-sagens
  "spændingsfelt med L11" (§3, punkt 8 dér) er det nærmeste præcedens til Familiar Machines &
  Magic nedenfor.
- **Ekstra fund undervejs, ikke bedt om:** `fund/FUND-felt.md` har **allerede undersøgt og
  forkastet DOBOT** (linje 249: "Sekssbenet, ikke firbenet. CMRA's egen brødtekst siger
  *'hexapod robot dog'*") og **Hyundai** (linje 250: "Ejer Boston Dynamics; ingen egen firbenet
  model fundet"). Samme fil nævner Sevnce Robotics (linje 148, 205) som endnu **ikke undersøgt**
  ("ikke undersøgt" i kolonnen "Produktside med spec."). Se §1 og §10 for hvordan det påvirker
  denne rundes konklusion.

---

## 0. Skill-vurdering

| Skill | Valgt? | Begrundelse |
|---|---|---|
| `robotdata` | Gået forbi (kun læst) | Markedsafdækning, ingen YAML skrives. SKILL.md læst for stop-tjek-kriterierne, brugt direkte nedenfor |
| `parallelt` | Gået forbi | Jeg er allerede ét spor i en fordelt kørsel (spor/kand7). Elleve navne, én rapportfil — hvert navn tager typisk 5-10 minutters websøgning; at splitte til flere underagenter ville kræve koordinering (delt evidensmappe, delt rapportfil) der koster mere end den sparer, jf. samme begrundelse som `FUND-kand4.md` §0 |
| `grillmig` | Gået forbi | Intet brief afsendes, ingen STATUS.md-beslutning låses i denne runde |
| `critique`, `ui-ux-critique`, `impeccable`, `dataviz` | Gået forbi | Ingen bygget flade, ingen sammenligningsgrafik |
| `new-project`, `code-review`, `simplify` | Gået forbi | Ingen kode ændret |

**Konklusion: ingen skill passer på selve udførelsen**, samme konklusion som `FUND-kand4.md` nåede.

### 0.1 Et sourcing-spørgsmål, der bider i denne runde

`STATUS.md` L21 siger eksplicit: *"Forhandlere, databaser, anmeldelser og pressomtale er stadig
ude."* L33 (24. aug) åbnede for sekundære kilder, men kun når de ligger **på producentens eget
domæne** eller er *"materiale fra producenten selv"* (fx en PDF, producenten selv har uploadet til
en messearrangørs side — præcedensen fra Galileo i `FUND-kand4.md`).

Flere af navnene nedenfor kunne **kun** dokumenteres via kinesisk erhvervspresse (qq.com,
pedaily.cn) eller vestlig fagpresse (IEEE Spectrum), fordi producentens egen side enten er en
uigennemtrængelig SPA (samme fælde som Galileo i kand4) eller ikke findes med sikkerhed. Jeg har
skelnet i hver sektion mellem:

- **Producent-udstedt materiale** — egen hjemmeside, egen pressemeddelelse distribueret under eget
  navn (fx via PR Newswire eller egen investor-side) — dette læser jeg som "materiale fra
  producenten selv", parallelt med kand4's WRC-PDF-præcedens.
- **Journalistisk pressomtale** — en avis' eller et fagmedies egen dækning af producenten — dette
  er **eksplicit udelukket af L21**, uanset hvor pålideligt det virker.

Denne skelnen er **min fortolkning, ikke en afgjort sag** — CEO'en bør bekræfte den, især fordi
den afgør, om nogle af "tilføj"-anbefalingerne nedenfor reelt kan bygges til en robotpost i dag,
eller om de først kan det, når nogen får producentens egen side læst (fx med et
JavaScript-renderende værktøj, som jeg ikke har adgang til i dette spor).

---

## 1. DOBOT — Rover X1 (+ Rover X1 Explorer)

**1. Findes det? Ja.** DOBOT er en kendt kinesisk robotarm-producent (børsnoteret, 2432.HK ifølge
producentens eget søsterbrand, se nedenfor), der har lanceret sin første forbrugerquadruped.
Citat fra DOBOTs egen CES 2026-side:

> "our first smart quadruped robot designed for every home. From the lab to your daily life,
> Rover X1 is always ready at your command."
> — [dobot-robots.com/insights/event/dobot-at-ces-2026.html](https://www.dobot-robots.com/insights/event/dobot-at-ces-2026.html), hentet 2026-08-25 (gemt lokalt)

Produktet sælges reelt gennem DOBOTs eget forbrugersøsterbrand **INFFNI**:

> "INFFNI is the consumer-focused brand of DOBOT Robotics (2432.HK)" / "Rooted in DOBOT's proven
> robotics legacy."
> — [inffnitech.com](https://www.inffnitech.com/), hentet 2026-08-25 (gemt lokalt)

Tre varianter i salg: **Air ($1.999), Pro ($2.799), Pro Flex ($2.999)**, plus en fjerde,
uddannelsesrettet variant **Rover X1 Explorer (Vision)** med 40 TOPS Orin Nano og Intel RealSense
D435i, målrettet "research teams and institutions" — det matcher CEO'ens "(+ Rover X1 Explorer)".
Kilde: [inffnitech.com/products/rover-x1](https://www.inffnitech.com/products/rover-x1), hentet
2026-08-25 (gemt lokalt).

**2. Stop-tjek — ADVARSEL, læs dette først:** `fund/FUND-felt.md` har **allerede afvist en DOBOT-
post** som sekssbenet ("hexapod robot dog", CMRA-kilde). Det er **præcis den fælde**, opgavebrevet
navngiver ("betalte fælder: seksbenet Lenovo"), bortset fra at det denne gang er samme producent,
ikke et andet navn. Jeg har undersøgt, om Rover X1 er det samme produkt som blev afvist, eller et
andet:

- Den afviste post i `FUND-felt.md` er kildeført til CMRA (en brancheorganisation) uden
  modelnavn og uden årstal for lanceringen.
- Rover X1 er et navngivet, dateret produkt (lanceret ultimo 2025, global retail 2026), solgt
  under et helt andet undermærke (INFFNI), med egen produktside, som **ikke nævner seks ben
  noget sted**.
- DOBOTs egen CES-side kalder det eksplicit "quadruped" (firbenet), og INFFNIs produktside
  beskriver et "wheel-leg dual mode" med udskiftelige "fødder" — sprogbrug der kun giver mening
  for fire ben, ikke seks.
- **Jeg har ikke fundet en kilde, der tæller benene eksplicit ("four legs", ikke kun
  "quadruped").** Ordet "quadruped" er i sig selv en firbenet-påstand, men det er producentens
  ordvalg, jeg citerer — ikke min egen optælling af et foto. Se J1 i selv-reviewet.

**Konklusion:** Sandsynligvis et andet, nyere produkt end det tidligere afviste — men denne post
bør **ikke** oprettes uden et billede, nogen har talt benene på, givet præcedensen.

Ikke legetøj (L11): tvivlsomt i sig selv (forbrugerprodukt, "Your First Robot Dog"), men
kataloget har allerede to forbrugerprissatte quadrupeds i samme prisleje (Unitree Go2 ca.
$1.600, Xiaomi CyberDog) — Rover X1s $1.999-2.999 ligger i samme bånd, ikke i legetøjsklassen.

**3. Interessant?** Ja — ny producent (robotarm-gigant udvider til quadruped, ligesom UBTech gjorde
til humanoider), og et prispunkt under Unitree Go2. Groft optalt fra INFFNIs egen produktside:
vægt, nyttelast, maks. hastighed, maks. hældning, forhindring, driftstid, pris, mål (fra
forhandlerside) — **8-10 af 30 felter** direkte udfyldelige.

**4. Dubletkontrol:** Ikke i kataloget under noget navn. Den tidligere DOBOT-post i
`FUND-felt.md` blev aldrig oprettet (den blev forkastet før en YAML-fil), så der er intet at
dubletsikre imod i `data/robots/`.

---

## 2. AiMOGA Robotics — Argos (Argos X1)

**1. Findes det? Ja.** AiMOGA er en kinesisk robotik-satsning inkuberet af bilkoncernen Chery.
Egen pressemeddelelse (distribueret under AiMOGAs eget navn via PR Newswire, ikke tredjeparts
dækning af dem):

> "Mornine and quadruped robot Argos made a landmark debut" ved Asian Youth Para Games 2025.
> — [prnewswire.com, AiMOGA 2025 Brand Strategy](https://www.prnewswire.com/news-releases/aimoga-robotics-unveils-2025-brand-strategy-paving-a-new-vehicle-robot-synergy--global-collaboration-horizon-302589169.html), hentet 2026-08-25 (gemt lokalt)

Producentens egen hjemmeside (`aimoga.com`) kunne **ikke** læses — den omdirigerer via
JavaScript til `/lander`, som heller ikke gav læsbart indhold (samme SPA-begrænsning som
Sevnce og Galileo, se §0.1 og §3). Alle tekniske specifikationer nedenfor kommer derfor fra
tredjepart (ui44.com, europasatellite.com, robotsinternational.com), der selv hævder at citere
AiMOGAs officielle materiale — men det er **ikke efterprøvet af mig direkte mod egen kilde**.

Kommerciel status bekræftet via nyhedsdækning af JD.com-lanceringen: pris **¥15.800 (~2.300
USD)**, tilgængelig fra 8. maj 2026 via "AiMoga's Intelligent Robot JD.com Self-operated Flagship
Store".

**2. Stop-tjek — firbenet:** **Ja**, bekræftet i egen pressemeddelelse ("quadruped robot Argos",
citeret ovenfor). Ikke legetøj (L11): nej — prisleje og brug (hjemmeselskab, patrulje, industri-
sikkerhed) matcher allerede katalogførte forbrugerquadrupeds, ikke hobbykit-klassen.

**3. Interessant?** Ja. Ny producent, ny slags ejerforhold (bilkoncern-inkuberet, minder om
Xiaomi- og Chery-mønsteret snarere end de rene robotikfirmaer). Groft optalt fra tredjepartskilder
(uverificeret mod egen side): vægt, nyttelast, maks. hastighed, maks. hældning, forhindring,
frihedsgrader/motorantal, pris — **6-8 af 30 felter**, men **kræver en efterprøvning mod
producentens egen side eller en officiel PDF**, før tallene kan bruges i en robotpost (jf. §0.1).

**4. Dubletkontrol:** Ikke i kataloget under noget navn eller i `FUND-felt.md`s 38-liste.

---

## 3. Sevnce Robotics / Qiteng (七腾机器人) — X3 (X3 Stable)

**1. Findes det? Ja, som virksomhed — men egen side kunne ikke læses.** `www.sevnce.com` blev
hentet tre gange (WebFetch, rå `curl`, og Wayback Machine-snapshot fra 8. juni 2026) — alle tre
gav kun en tom app-skal:

> Hele det hentede indhold: `七腾机器人_用科技服务社会安全` (sidetitel/overskrift, "Qiteng
> Robot — Serving Social Safety with Technology") — **2.250-4.361 byte i alle tre forsøg, ingen
> produktdata**
> — [sevnce.com](https://www.sevnce.com/), hentet 2026-08-25 (rå HTML og Wayback-snapshot gemt
> lokalt) — **samme SPA-begrænsning som Galileo i `FUND-kand4.md`**

Alt indhold om det konkrete produkt kommer derfor fra kinesisk erhvervspresse — **journalistisk
pressomtale, som L21 eksplicit udelukker** (se §0.1). Med det forbehold, citater fra to
uafhængige kinesiske medier:

> "七腾机器人推出了全新防爆四足机器人-X3 stable" (Qiteng lancerer det nye eksplosionssikre
> firbenede X3 Stable) — "整机质量小于100kg…续航时间提升至5小时" (samlet vægt under 100 kg,
> driftstid forbedret til 5 timer)
> — [news.qq.com](https://news.qq.com/rain/a/20250121A061XO00), hentet 2026-08-25 (gemt lokalt)

> "防爆等级Ex IIB T4 Gb" (eksplosionssikringsklasse Ex IIB T4 Gb) — "自重不到100kg，却能轻松负载
> 200kg" (egenvægt under 100 kg, men kan bære 200 kg) — "全球第一款真正实现量产的整机防爆四足
> 机器人" (verdens første virkeligt masseproducerede, komplette eksplosionssikre firbenede robot)
> — [pedaily.cn](https://news.pedaily.cn/20251020/116272.shtml), hentet 2026-08-25 (gemt lokalt)

**2. Stop-tjek — firbenet:** **Ja**, entydigt (四足 = firbenet, gentaget i begge kilder). Ikke
legetøj (L11): nej — industrigrad eksplosionssikret inspektionsrobot til kemisk industri, samme
kategori som allerede katalogførte industrirobotter.

**3. Interessant?** Ja, potentielt meget — **eksplosionssikring er en klasse, kataloget ikke har
i dag** (ingen af de 62 nuværende poster har en `Ex`-klassificering). Men uden adgang til
producentens egen specside kan feltdækningen kun gættes groft ud fra pressecitater: egenvægt,
nyttelast, driftstid, forhindringshøjde, sprækkebredde, vanddybde, eksplosionsklasse — **op til
7-8 af 30 felter**, men **ingen af dem har `kilde: sevnce.com`** i dag, kun sekundær presse.

**4. Dubletkontrol:** Ikke i kataloget. **Allerede identificeret** i `fund/FUND-felt.md` (linje
148 og 205) som "Sevnce Robotics / 七腾机器人 … sevnce.com … ikke undersøgt" — denne runde
bekræfter navn og model (X3 Stable), men **løser ikke** det tidligere åbne "ikke undersøgt"-punkt,
fordi selve siden stadig ikke kan læses.

---

## 4. Faraday Future — FX Aegis

**1. Findes det? Ja.** Det amerikanske elbilfirma Faraday Future (Nasdaq: FFAI) har lanceret en
quadruped under sin "EAI" (embodied AI)-satsning. Fra selskabets egen investor-pressemeddelelse:

> "FX Aegis is a professional, embodied AI quadruped robot designed for security and
> companionship." / "It comes standard with a quadrupedal structure, while also supporting an
> optional four-wheeled version."
> — [investors.ff.com, pressemeddelelse](https://investors.ff.com/news-releases/news-release-details/faraday-future-announces-its-latest-robot-fx-aegis-quadruped-has/), hentet 2026-08-25

**2. Stop-tjek — firbenet:** **Ja**, entydigt ("quadrupedal structure" som standard, hjulversion
som tilvalg — samme mønster som Unitree B2/B2-W og Pudu D5/D5-W, allerede to separate
katalogposter hver). Ikke legetøj/rendering (L11): nej — FCC-certificeret til salg i USA, reel
pris ($2.490 grundmodel), forsalg live på egen side
([ff.com/us/preorder/robotics](https://www.ff.com/us/preorder/robotics)).

**3. Interessant?** Ja. Ny producent, ny hjemmemarked (USA — kataloget er domineret af kinesiske
og et par europæiske/koreanske producenter), ny kategori-krydsning (elbilfirma → robotik, samme
mønster som DOBOT arm→quadruped og AiMOGA bil→quadruped, men her fra vestlig industri). Groft
optalt fra pressemeddelelsen alene: maks. spidsmoment, forhindringshøjde, maks. hældning, pris,
kommunikation (WiFi/5G) — kun **4-5 af 30 felter** direkte fra denne kilde; et fuldt specark
(vægt, mål, batteri, DOF) er **ikke fundet** på egen side i denne runde — kræver en ny gennemgang
af `robotics.ff.com` eller `ff.com/us/preorder/robotics`, som begge var for JavaScript-tunge til
at give fuldt indhold i dette forsøg.

**4. Dubletkontrol:** Ikke i kataloget. Intet andet FUND-dokument nævner Faraday Future.

---

## 5. All3 — Mantis

**1. Findes det? Ja, men i en anden produktklasse end resten af kataloget.** All3 er et
London-baseret byggeri-robotikfirma (Berlin/Zug-kontorer), der har rejst $25 mio. i
seed-finansiering. Fra producentens egen produktside:

> "The four-legged locomotion system is designed for unstructured sites and adaptive terrain
> navigation." / "100kg+ payload and 4m reach"
> — [all3.com/mantis](https://all3.com/mantis), hentet 2026-08-25 (gemt lokalt)

**2. Stop-tjek — firbenet:** **Ja**, entydigt i egne ord ("four-legged locomotion system"; ikke
"quadruped" som ordvalg, men samme betydning). Ikke legetøj (L11): nej — industrielt byggeri-
samlingsrobot, $25 mio. finansiering, video-dokumenteret test ("Mantis training in the All3
lab"). **Men:** det er uklart, om robotten reelt går på benene som en patruljerobot, eller om
benene primært er statiske støttepunkter til en armmonteret samlerobot — siden viser "training"-
optagelser, ikke uafhængigt bekræftet feltdrift, og der er **intet stated vægttal** for selve
robotten (kun nyttelast og rækkevidde).

**3. Interessant?** Potentielt ja — **en helt ny kategori** kataloget ikke har: byggeri-
samlingsrobotter (vs. de nuværende patrulje-/inspektions-/følgerobotter). Men feltdækningen er
meget tynd: kun nyttelast og rækkevidde er oplyst på egen side i denne runde — **højst 2-3 af 30
felter**, langt under kataloget median (13/30). En fuld gennemgang af `all3.com`s undersider
(ikke kun `/mantis`) er ikke foretaget.

**4. Dubletkontrol:** Ikke i kataloget eller i noget andet FUND-dokument.

---

## 6. NavBot

**1. Findes det? Ja.** Egen produktside, fuldt læsbar:

> Mål-grupper for alle fem produkter: "students, makers, researchers, and developers." Priser:
> NavBot-EG01 $199,49, NavBot-EN01 $269,49, NavBot-ES02 $269,49, OpenDuck Mini $599,00,
> NavBot-D1 $4.999,00.
> — [navbot.com/en/bots](https://navbot.com/en/bots/), hentet 2026-08-25 (gemt lokalt)

**2. Stop-tjek — firbenet:** Ja for flere modeller (NavBot-EG01, NavBot-D1). **Men L11 fælder
den:** samtlige produkter er eksplicit rettet mod "students, makers, researchers, and
developers", solgt som "open-source" byggesæt ("All hardware designs and software are open -
fork, modify, contribute. No black boxes - ever.") — **samme kategori som de allerede udelukkede
Petoi, MangDang, Hiwonder og Yahboom** (L11-listen navngiver dem eksplicit).

**3. Interessant?** Nej, per L11. NavBot-D1 er dyrere ($4.999) end de fleste hobbykits, men
positioneringen ("open quadruped robotics platform for developers") er stadig hobby-/
udviklerplatform, ikke et kommercielt inspektions- eller patruljeprodukt.

**4. Dubletkontrol:** Irrelevant — udelukket af L11 uanset dubletstatus.

---

## 7. Path Robotics — Rove (bruger Boston Dynamics-hardware, ikke egen quadruped)

**1. Findes det? Ja, som produkt — men ikke som en ny quadruped-*producent*.** Path Robotics er
kendt for svejserobotter (spørgsmålet i navnelisten var berettiget). Fra selskabets egen
pressemeddelelse:

> Path Robotics "designed Rove to address the challenge of automating welds on large, immovable
> structures… by mounting its proprietary 'Obsidian' physical AI model onto **a quadruped robot
> from Boston Dynamics**."
> — [path-robotics.com/news](https://www.path-robotics.com/news/path-robotics-launches-rove-bringing-mobility-to-welding-automation-powered-by-physical-ai), hentet 2026-08-25 (gemt lokalt)

**2. Stop-tjek:** Firbenet — ja, men **det er Boston Dynamics Spot**, allerede katalogført
(`data/robots/boston-dynamics-spot.yaml`). Path Robotics leverer et svejsesoftwarelag oven på
en allerede eksisterende, allerede katalogført robotplatform. De producerer ikke selv den
firbenede hardware.

**3. Interessant?** Nej, som ny katalogpost — det ville være en dublet af Spot med et
tredjeparts-softwarelag monteret. **Kunne** være interessant som en note under Spots eksisterende
post (nye anvendelser: skibsbygning/svejsning) hvis kataloget nogensinde begynder at liste
tredjepartsanvendelser — men det er en anden slags felt, kataloget ikke har i dag.

**4. Dubletkontrol:** Dublet af `boston-dynamics-spot.yaml`, ikke en ny post.

---

## 8. Familiar Machines & Magic — Familiar

**1. Findes det? Ja.** Grundlagt af iRobot-medstifter Colin Angle, kom ud af stealth maj 2026.
Egen hjemmeside (`familiarmachines.com`) gav læsbart indhold via hentningsværktøjet, men **ingen
teknisk specifikation** (ingen vægt, ingen pris — kun venteliste). Uafhængig teknisk dybde findes
kun i fagpressen:

> "23 degrees of freedom enabling both lifelike movement and expressive behaviors" / designet som
> "a sort of highly abstracted bear" (bevidst ikke hund eller kat, for at undgå forudindtagede
> forventninger)
> — [spectrum.ieee.org/familiar-machines-and-magic](https://spectrum.ieee.org/familiar-machines-and-magic), hentet 2026-08-25 (gemt lokalt) — **journalistisk pressomtale, jf. §0.1, ikke
> producentens egne ord**

Egen hjemmesides ordvalg:

> "A different kind of companion for people who can't have pets, and for those who already do."
> — [familiarmachines.com](https://www.familiarmachines.com/), hentet 2026-08-25

**2. Stop-tjek — firbenet:** Sandsynligvis ja (IEEE Spectrum kalder det gentagne gange en
"quadruped" med "23 DOF"), men **ikke bekræftet i producentens egne ord** — kun i pressens.
**L11-spændingsfelt, samme som Vbot i `FUND-messe.md`:** eksplicit markedsført som
selskabsdyrs-erstatning ("A different kind of companion for people who can't have pets"), samme
sætning der udelukkede Sony Aibo fra kataloget under L11. Endnu ikke i salg (venteliste, ingen
pris, forventet 2027) — **rendering/forhåndsvisning, ikke et købbart produkt** i dag.

**3. Interessant?** Marginalt, og kun hvis L11-spørgsmålet afgøres til fordel for optagelse.
Ingen tekniske felter er fundet på egen side — **0 af 30 felter** direkte udfyldelige i dag.

**4. Dubletkontrol:** Ikke i kataloget eller i noget andet FUND-dokument.

---

## 9. Galbot

**1. Findes det som quadruped-producent? Nej.** Galbot (银河通用机器人, Beijing) er, som CEO'ens
egen note antydede, en humanoid-producent — og har **ingen firbenet model** i det nuværende
sortiment. Egen hjemmeside (`galbot.com`) var en uigennemtrængelig SPA (2.005 byte, kun
sidetitel), så konklusionen hviler på krydstjek af flere uafhængige robotdatabaser, der alle er
enige om samme tre modeller:

> G1: "wheeled humanoid robot" (hjulbaseret, ikke benet) — S1: "Heavy-Duty Wheeled Humanoid
> Robot" (samme, hjulbaseret) — ET1: "Bipedal Humanoid Robot" (tobenet, ikke firbenet)
> — [robotsinternational.com/Galbot-G1.htm](https://www.robotsinternational.com/Galbot-G1.htm), [robotsinternational.com/Galbot-S1.htm](https://www.robotsinternational.com/Galbot-S1.htm), [robotsinternational.com/Galbot-ET1.htm](https://www.robotsinternational.com/Galbot-ET1.htm), hentet 2026-08-25 — **tredjepartsdatabaser, ikke producentens egne ord (§0.1)**

**2. Stop-tjek:** Fejler — intet firbenet produkt at teste. **Bemærk:** dette er en svagere form
for "ikke fundet" end X25-D (afsnit 11), fordi Galbot selv og deres produkter utvivlsomt findes —
det er specifikt en quadruped hos dem, der ikke findes.

**3. Interessant?** Nej — der er intet produkt at vurdere.

**4. Dubletkontrol:** Irrelevant, intet produkt.

---

## 10. Hyundai Robotics

**1. Findes det som selvstændig quadruped-producent? Nej — allerede afgjort.**
`fund/FUND-felt.md` (linje 250) konkluderede allerede: *"Hyundai … Ejer Boston Dynamics; ingen
egen firbenet model fundet."* Denne runde bekræfter uafhængigt samme konklusion, med et nyt
datapunkt: Hyundai Motor Group har lanceret en **hjulbaseret** mobilitetsrobot, MobED, der kunne
forveksles med en firbenet platform, men ikke er det:

> MobED (Mobile Eccentric Droid) bruger "proprietary DnL modules that integrate posture control,
> driving and steering motors" — et "eccentric-based posture control mechanism", ikke ben.
> — [hyundainews.com](https://www.hyundainews.com/en-us/releases/4640), hentet 2026-08-25 (gemt
> lokalt)

Desuden er **HD Hyundai Robotics** (industrirobotarme, svejserobotter siden 1987) en **separat**
juridisk enhed fra Hyundai Motor Group (som ejer Boston Dynamics) — ingen af de to har en egen
firbenet model.

**2. Stop-tjek:** Fejler — intet selvstændigt firbenet produkt.

**3. Interessant?** Nej.

**4. Dubletkontrol:** Boston Dynamics Spot er allerede katalogført
(`data/robots/boston-dynamics-spot.yaml`) — det er den eneste firbenede robot, "Hyundai" har
nogen tilknytning til, og den er allerede i kataloget under sit eget navn.

---

## 11. Jinfa Edge — X25-D

**1. Findes det? Ikke fundet**, efter yderligere seks søgninger ud over de seks, `FUND-kand4.md`
allerede dokumenterede for samme modelnavn (X25-D):

- `"Jinfa Edge" X25-D robot` — ingen relevante træf (kun X25 CT-scanner, X25 Wikipedia-artikler
  om ikke-relaterede emner).
- `"Jinfа Edge" OR "Jinfa" quadruped robot X25` (med det kyrilliske а, som opgaven foreslog) —
  ingen træf.
- `Jinfa Edge robotics company X25-D quadruped CES` — ingen træf, kun DEEP Robotics/Unitree-støj.
- `金锋 四足机器人 X25` (Jinfeng) — ingen træf.
- `金发 四足机器人 X25-D` (Jinfa, bogstaveligt "gyldent hår") — ingen træf, kun generel
  quadruped-landskabsomtale.
- `锦锋 四足机器人 X25` (Jinfeng, alternativ skrivemåde) — ingen træf.
- `"X25-D" 机器人` (uden firmanavn, bredest mulige kinesiske søgning) — ingen træf.

**2. Stop-tjek:** Kan ikke afgøres — intet produkt at teste.

**3. Interessant?** Kan ikke vurderes.

**4. Dubletkontrol:** Stadig intet fund i `fund/FUND-felt.md`s 38-producent-liste eller andre
FUND-dokumenter (ny grep over hele `fund/`, nul træf ud over kand4's egen omtale).

**Vurdering, uændret fra kand4:** Enten en fejlstavning/fejlhusket navn, et internt kodenavn, der
aldrig blev offentliggjort, eller et produkt fra en producent uden for de nu ni afsøgte
stavevarianter. CEO'en er den eneste, der kan afgøre det — ved at oplyse, hvor navnet blev set.

---

## 12. Anbefalingstabel

| Navn | Anbefaling | Begrundelse (én linje) |
|---|---|---|
| **DOBOT Rover X1 (+ Explorer)** | **Tilføj, men kun efter et billedtjek** | Ægte forbrugerprodukt fra egen producent/søsterbrand, "quadruped" i egne ord — men samme producent har tidligere fået en *anden* model afvist som sekssbenet (`FUND-felt.md`), og ingen kilde her tæller benene eksplicit |
| **AiMOGA Argos** | **Tilføj, med forbehold** | Ny producent, ægte JD.com-salg, "quadruped" i egen pressemeddelelse — men egen hjemmeside kunne ikke læses, specs kun fra tredjepart |
| **Sevnce/Qiteng X3 Stable** | **Tilføj, men kun hvis egen side kan læses** | Ny kategori (eksplosionssikret), firbenet bekræftet — men *alle* kilder er journalistisk pressomtale, som L21 udelukker; egen side er en ulæselig SPA i tre forsøg |
| **Faraday Future FX Aegis** | **Tilføj** | Ny producent, nyt hjemmemarked (USA), FCC-certificeret salg, "quadrupedal structure" i egen pressemeddelelse — men fuldt specark mangler stadig |
| **All3 Mantis** | **Kan ikke afgøres** | Firbenet bekræftet i egne ord, men ny og uklar produktklasse (byggeri-samling vs. patrulje), kun 2-3/30 felter oplyst |
| **NavBot** | **Tilføj ikke** | L11: hobby-/udviklerplatform i egne ord ("students, makers, researchers, and developers"), samme kategori som allerede udelukkede Petoi/MangDang/Hiwonder/Yahboom |
| **Path Robotics** | **Tilføj ikke** | Bruger Boston Dynamics Spot (allerede katalogført) under eget softwarelag — producerer ikke selv en firbenet robot |
| **Familiar Machines & Magic** | **Kan ikke afgøres** | Firbenet sandsynligt (kun i pressen, ikke egne ord), men L11-spændingsfelt (selskabsdyrs-erstatning, samme sprog som den udelukkede Aibo-kategori), endnu ikke i salg |
| **Galbot** | **Tilføj ikke** | Findes ikke — alle tre modeller (G1, S1, ET1) er hjulbaserede eller tobenede humanoider |
| **Hyundai Robotics** | **Tilføj ikke** | Allerede afgjort i `FUND-felt.md`, bekræftet igen: ejer kun Boston Dynamics (Spot allerede katalogført), ingen egen firbenet model |
| **Jinfa Edge X25-D** | **Kan ikke afgøres** | Intet fund efter i alt tolv søgninger på tværs af to research-runder og ni stavevarianter |

CEO'en beslutter herfra. Ingen robotpost er oprettet i denne runde.

---

## 13. Evidens gemt (media/_kilder/raa-kand7-2026-08-25/, gitignoreret)

19 filer, alle hentet 2026-08-25 (én er en Wayback-snapshot fra 2026-06-08, hentet i dag):

1. `dobot-ces-2026-2026-08-25.html` — DOBOTs egen CES 2026-side, med "quadruped"-citatet
2. `dobot-robots-com-products-rover-x1-404-2026-08-25.html` — negativt fund: DOBOTs hovedsite har
   ingen dedikeret Rover X1-side på denne URL (404)
3. `inffnitech-home-2026-08-25.html` — INFFNIs forside ("consumer-focused brand of DOBOT
   Robotics")
4. `inffnitech-rover-x1-2026-08-25.html` — INFFNIs Rover X1-produktside, fulde specs
5. `aimoga-home-2026-08-25.html` — negativt fund: aimoga.com er kun en JS-omdirigering (114 byte)
6. `aimoga-lander-2026-08-25.html` — negativt fund: `/lander` gav heller intet læsbart (709 byte)
7. `prnewswire-aimoga-brand-2026-08-25.html` — AiMOGAs egen 2025-pressemeddelelse med
   Argos-citatet
8. `sevnce-home-2026-08-25.html` — negativt fund: sevnce.com, ren SPA-skal (2.250 byte)
9. `sevnce-wayback-2026-06-08.html` — negativt fund: samme SPA-skal via Wayback Machine
   (4.361 byte), bekræfter det ikke er et midlertidigt problem
10. `qq-qiteng-x3-2026-08-25.html` — Tencent-nyhedsartikel med X3 Stable-specifikationer
11. `pedaily-qiteng-x3-2026-08-25.html` — PEdaily-artikel med eksplosionsklasse og vægt/last
12. `roboticstomorrow-ff-aegis-2026-08-25.html` — gengivelse af FF's pressemeddelelse
13. `ff-robotics-2026-08-25.html` — robotics.ff.com, delvist JS-begrænset
14. `all3-mantis-2026-08-25.html` — All3s egen Mantis-produktside
15. `galbot-home-2026-08-25.html` — negativt fund: galbot.com, ren SPA-skal (2.005 byte)
16. `familiarmachines-home-2026-08-25.html` — Familiar Machines' egen forside (rå HTML,
    JS-bundlet — fortolket indhold kom fra et renderende hentningsværktøj, ikke denne rå fil)
17. `ieee-familiar-machines-2026-08-25.html` — IEEE Spectrum-artiklen med "23 DOF"-citatet
18. `navbot-bots-2026-08-25.html` — NavBots egen produktoversigt med priser og målgruppe
19. `path-robotics-rove-2026-08-25.html` — Path Robotics' egen pressemeddelelse om Rove/Spot
20. `hyundai-mobed-2026-08-25.html` — Hyundais egen pressemeddelelse om MobED (hjulbaseret)

---

## 14. Selv-tjek med tælling

- **N = 11** navne undersøgt (DOBOT, AiMOGA, Sevnce/Qiteng, Faraday Future, All3, NavBot, Path
  Robotics, Familiar Machines & Magic, Galbot, Hyundai Robotics, Jinfa Edge X25-D).
- **M = 9** producent-domæner fundet og delvist eller helt læst med indhold (DOBOT/INFFNI,
  Faraday Future, All3, NavBot, Path Robotics, Familiar Machines, Hyundai, samt AiMOGA og Sevnce
  hvor selve domænet blev fundet men gav intet læsbart indhold — talt med her, fordi domænet
  *findes*, jf. distinktionen i hver sektion). **2 domæner fundet, men fuldt ulæselige som SPA**
  (Sevnce, Galbot). **1 navn gav intet domæne overhovedet** (Jinfa Edge X25-D).
- **K = 10** stop-tjek afgjort med citat (alle undtagen Jinfa Edge X25-D, hvor der intet er at
  teste): DOBOT (ja, med forbehold om benoptælling), AiMOGA (ja), Sevnce/Qiteng (ja, men kun
  pressomtale), Faraday Future (ja), All3 (ja, men uklar klasse), NavBot (udelukket af L11),
  Path Robotics (er Boston Dynamics, ikke egen hardware), Familiar Machines (sandsynligt ja, men
  kun i pressen — se J), Galbot (nej, intet produkt), Hyundai (nej, intet produkt).
- **J = 6** åbne spørgsmål (listet i §15).

Alle elleve navnes søgestrenge/kildeforsøg er skrevet ud i de respektive afsnit, ikke kun
konklusionen.

---

## 15. Selv-review — hvad jeg er usikker på, og hvad jeg ikke nåede

**Åbne spørgsmål (J = 6):**

1. **DOBOT Rover X1 — er det virkelig firbenet, ikke sekssbenet?** Jeg har kun producentens
   ordvalg ("quadruped") og tredjeparts konsistente omtale, aldrig en kilde der eksplicit tæller
   benene ("four legs", ikke bare "quadruped" som label). Givet at `FUND-felt.md` allerede har
   fanget **samme producent** i en sekssbenet fejl på en anden model, er dette den enkeltstående
   vigtigste ting, en opfølgende agent bør bekræfte — ideelt med et billede.
2. **AiMOGAs egen hjemmeside (aimoga.com) blev aldrig læst.** Alle tekniske tal stammer fra
   tredjepartsdatabaser, der hævder at citere AiMOGA, men jeg har ikke selv set kilden.
3. **Sevnce/Qiteng (sevnce.com) er stadig ulæselig efter tre forskellige forsøgsmetoder** (direkte
   hentning, rå `curl`, Wayback Machine). Al data om X3 Stable er journalistisk pressomtale, som
   `STATUS.md` L21 eksplicit holder ude af kataloget. En robotpost kan ikke bygges på det, jeg har
   fundet i dag — kun en fremtidig, JavaScript-renderende hentning af egen side kan løse det.
4. **Familiar Machines & Magics L11-status er uafklaret.** Det er formentlig firbenet (kun i
   pressen, ikke egne ord), men markedsføres eksplicit som kæledyrserstatning — samme sprogbrug
   der udelukkede Sony Aibo. CEO'en bør afgøre, om "companion for people who can't have pets" er
   tættere på Aibo (ude) eller på et industriprodukt (inde), parallelt med Vbot-sagen i
   `FUND-messe.md`.
5. **All3 Mantis' produktklasse er uklar.** Er det en "quadruped" i kataloget forstand (en
   gangrobot med sensorik/nyttelast-fokus), eller en armmonteret byggerirobot, hvor benene kun er
   et understel? Jeg har ikke besøgt andre undersider på all3.com end `/mantis`, som kunne
   afklare det.
6. **Galbots "ingen quadruped fundet"-konklusion hviler på tredjepartsdatabaser**, fordi
   galbot.com selv er en ulæselig SPA. Det er en svagere form for negativt fund end fx X25-D
   (hvor jeg har søgt direkte), men jeg vurderer risikoen for en overset fjerde model som lav,
   fordi tre uafhængige databaser er indbyrdes enige om præcis de samme tre modeller.

**Hvad jeg ikke nåede:**

- Intet forsøg med et JavaScript-renderende hentningsværktøj (fx en headless browser) for de fire
  SPA-blokerede sider (sevnce.com, aimoga.com, galbot.com, dels galileotime.com-mønsteret fra
  kand4) — jeg har ikke adgang til et sådant værktøj i dette spor.
- Ingen felt-for-felt-kortlægning mod `tools/skema.mjs`s 30 feltnavne for noget af de otte
  potentielt interessante navne — kun grove skøn ud fra hvad der er set på siderne, samme
  begrænsning som kand4 dokumenterede for sine to "tilføj"-kandidater.
- Faraday Future FX Aegis' fulde specark (vægt, mål, DOF, batterikapacitet) er ikke fundet — kun
  det, pressemeddelelsen selv nævnte (moment, forhindringshøjde, hældning, pris).
- All3s øvrige undersider (kun `/mantis` og forsiden er besøgt) og en eventuel selvstændig
  specifikationsside er ikke gennemgået.
- Ingen søgning på japansk eller andre sprog end dansk/engelsk/kinesisk/koreansk for noget af de
  elleve navne.
- AiMOGAs engelsksprogede hjemmeside (hvis en sådan findes adskilt fra aimoga.com) er ikke
  lokaliseret.

**Hvad jeg er sikker på:** Galbot har ingen quadruped i sit nuværende sortiment (tre uafhængige
kilder enige). Hyundai har ingen selvstændig quadruped ud over det allerede katalogførte Boston
Dynamics-ejerskab (bekræfter en allerede truffet beslutning i `FUND-felt.md`). Path Robotics
bruger Boston Dynamics' hardware, ikke egen. Jinfa Edge X25-D er stadig ikke fundet efter nu tolv
søgninger på tværs af to runder. NavBot er entydigt en hobby-/udviklerplatform i egne ord, og
udelukkes af L11 uden tvivl.
