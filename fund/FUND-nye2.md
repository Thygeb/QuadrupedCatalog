# FUND — nye2 (to nye robotposter: Guoxing brandslukning, Rainbow Robotics RBQ-3)

Målt 24. august 2026 i worktreen `udstilling-wt-nye2`, gren `spor/nye2`. Opgave fra
CEO'en: to nye robotposter. **Ingen af de to kunne leveres** — begge eftersøgninger endte
i en producentside, der ikke bekræfter den robot, opgavebrevet beskrev. Nul YAML-filer
tilføjet, nul commits på data.

---

## Regel 0 — skill-vurdering

**Valgt: `robotdata`** (`.claude/skills/robotdata` i worktree-roden), læst via
Skill-værktøjet — det lykkedes uden `Unknown skill`, så der er ingen fallback-situation
at nævne. Opgaven er præcis dét, skillen er skrevet til: indsamle/verificere en
robotpost efter 33-feltsskemaet med kilde+hentet-disciplin.

**Gået forbi, med begrundelse:**
- `parallelt` — jeg er allerede den ene dedikerede agent på dette spor, sat i gang af en
  orkestrator. At splitte to research-tråde (Guoxing / RBQ-3) ud på endnu et lag
  underagenter ville være at re-delegere hele min egen opgave, hvilket min systeminstruks
  udtrykkeligt fraråder. De to eftersøgninger er i praksis uafhængige (forskellig
  producent, forskelligt land, forskellige søgetermer), men adskillelsen var billig nok
  til at gøre selv, sekventielt, uden worktree-overhead.
- `grillmig` — intet åbent brief eller beslutning at grille; opgaven var allerede
  grillet og afgrænset af orkestratoren, med et eksplicit exit-kriterium ("aflevér IKKE
  posten" hvis kilden ikke findes).
- `impeccable` / `critique` / `ui-ux-critique` / `dataviz` — ingen visuel flade i denne
  opgave, ren dataindsamling.
- `new-project` — projektet er allerede scaffoldet.
- `code-review` / `simplify` — ingen kodeændring.

---

## Spor 1 — Guoxing Intelligent brandslukningsquadruped: IKKE FUNDET

**Konklusion: producenten findes, men laver ikke en firbenet ("robot dog") brandslukningsrobot.
Deres brandslukningsserie er hjul-/bæltekørende.** Posten kan derfor ikke eksistere i dette
katalog, jf. opgavens eget kriterium ("Finder du ingen producentside med specifikationer,
aflevér IKKE posten").

**Eftersøgningen:**

1. `WebSearch: "Guoxing Intelligent firefighting robot dog quadruped manufacturer"` fandt
   producenten: **Shandong Guoxing Intelligent Technology Co., Ltd.**, grundlagt 2004,
   Yantai, Shandong. Egen side: <https://www.gxsuprobot.com/> (også spejlet på
   `guoxingsmartech.en.alibaba.com` og `gxsuprobot.goldsupplier.com`).
2. `WebFetch https://www.gxsuprobot.com/` — hele navigationens produktkategorier:
   Firefighting Robot, Military/DIY Robot Chassis, Tracked Robot Chassis, Coal Mine
   Robot, Petroleum & Petrochemical Robot, State Grid Robot, Accessories. **Ingen
   quadruped- eller "robot dog"-kategori.**
3. `WebSearch: site:gxsuprobot.com quadruped OR "robot dog" OR "四足"` — nul træf på
   domænet.
4. `WebSearch: "Guoxing" quadruped robot dog firefighting site:alibaba.com OR
   site:made-in-china.com` — alle fundne Guoxing-produkter er navngivet med præfikset
   `RXR-` (fx `RXR-YM100000D` løftende røgudsugningsrobot, `RXR-MC100BGD`
   eksplosionssikret slukningsrobot, `RXR-M80D-15KT` med 85 m vandrækkevidde) — alle
   er hjul- eller bæltekøretøjer i beskrivelse og billeder, ingen ben.
5. `WebSearch: "国星智能 消防 机器狗 四足机器人"` (kinesisk) — Guoxing optræder slet ikke i
   brancheoversigter over kinesiske firbenede brandslukningsrobotter. De kilder, der
   findes, navngiver i stedet **Unitree** (>60 % markedsandel) og **DEEP Robotics/云深处**
   (~90 % i selve brandslukningsnichen) som de dominerende firbenede
   brandslukningsleverandører i Kina — Guoxing nævnes ingen steder i den sammenhæng.

**Vurdering:** opgavebrevets beskrivelse ("Guoxing Intelligent firefighting robot dog")
er sandsynligvis en sammenblanding fra en liste — enten med en anden producents
quadruped, eller en fejlagtig kategorisering af Guoxings hjulkørende slukningsrobot.
Ingen producentside, intet specifikationstal, ingen post.

---

## Spor 2 — Rainbow Robotics RBQ-3: IKKE FUNDET PÅ PRODUCENTENS EGEN SIDE

**Konklusion: RBQ-3 findes IKKE på rainbow-robotics.com** (hverken engelsk eller koreansk
version, hverken produktsider eller nyheds-/PR-sider), og heller ikke på producentens
egen GitHub-dokumentation (`rainbowrobotics.github.io/RBQ/`). RBQ-serien på producentens
egen side består udelukkende af **RBQ-10** (i produktion — allerede i kataloget) og
**RBQ-10W** (annonceret som "coming soon", hjul-ben-hybrid). Opgavebrevets antagelse om,
at "rainbow-robotics.com har produktsider" for RBQ-3, holder ikke ved eftersyn.

**Eftersøgningen — producentens egne kanaler, alle gennemgået direkte:**

1. `https://rainbow-robotics.com/en/products/` og
   `https://rainbow-robotics.com/en/products/quadruped-robots/` og
   `.../quadruped-robots/rbq-series/` — kun RBQ-10 (link) + RBQ-10W (nævnt, "coming soon",
   intet link endnu).
2. `https://www.rainbow-robotics.com/rbq` (koreansk sideversion) — samme resultat: kun
   RBQ-10 med specifikationer (98×43×62 cm, 42 kg, 15 kg nyttelast, 9/14 km/t, IP54,
   2/4 t), ingen RBQ-3.
3. `https://rainbowrobotics.github.io/RBQ/` (producentens egen GitHub-dokumentation, som
   RBQ-10-posten allerede citerer) — kun "RBQ" generisk/RBQ-10, ingen model­opdeling.
4. `https://rainbow-robotics.com/en/news/` — nyhedsarkivet gav **0 træf** ("검색 결과가
   없습니다" / ingen søgeresultater) på RBQ-3, RB-01K, Hyundai Rotem eller forsvar.

**Hvor "RBQ-3" rent faktisk optræder — alt sammen tredjepartskilder, ikke brugt:**

- `aparobot.com` og `originofbots.com` — begge tredjeparts robot-databaser/aggregatorer,
  ikke producentens egen side. Ikke brugt som kilde (opgavens eksplicitte krav:
  "Kilder er producentens EGNE sider").
- `armyrecognition.com` (2024, forsvarsnyhedsside) — en artikel om et samarbejde mellem
  **Hyundai Rotem** og Rainbow Robotics om en firbenet forsvarsrobot til
  antiterror-brug, som citerer specifikke RBQ-3-tal (350×550×400 mm, 25 kg, 5 kg
  nyttelast, 3,6/10 km/t, 8 cm forhindring). Artiklen citerer **ingen** officiel
  Rainbow Robotics-kilde eller pressemeddelelse — tallene kan ikke spores tilbage til
  producenten selv.
- `kedglobal.com` (2026, koreansk erhvervsnyhedsside) — omtaler i stedet **RB-01K**, "a
  four-legged combat robot dog jointly developed by Samsung affiliate Rainbow Robotics
  and Hyundai Rotem", der skal udrulles til den sydkoreanske hær ved udgangen af 2026.
  Ingen tekniske specifikationer i artiklen, og igen ingen kilde tilbage til producentens
  egen side.

**Vurdering:** RBQ-3 (eller dens mulige efterfølger/omdøbning RB-01K) ser ud til at være
et reelt forsvars-samarbejdsprojekt mellem Rainbow Robotics og Hyundai Rotem, dækket af
uafhængig presse — men **producenten har ikke selv publiceret specifikationer for det**.
Det kan skyldes, at det stadig er et prototype-/forsvarsprojekt uden offentlig
produktside (almindeligt for militærmateriel før udrulning). Uanset årsag: uden en
producentside med tal kan posten ikke bygges efter dette katalogs regler.

---

## Rettelse til opgavebrevet — data/manufacturers/ er tom og ubrugt

Opgavebrevet bad om at "genbruge producentfilen i data/manufacturers/" for Rainbow
Robotics og "ikke oprette den igen". Efterprøvet: `data/manufacturers/` indeholder kun
`.gitkeep` — ingen producentfiler findes, hverken for Rainbow Robotics eller nogen anden
producent. `tools/build.mjs` linje 195 bekræfter, at dette er **arkitektur, ikke en
fejl**: `// Producenterne udledes af robotterne. data/manufacturers/ er tom i dag.`
Producentsiderne (`tools/skabelon/producent.mjs`) bygges ved at gruppere robotposterne på
`producent`-feltet — der er intet forbrugende led, der læser `data/manufacturers/`.
Havde jeg leveret en RBQ-3-post, ville der altså **ikke** have skullet oprettes eller
genbruges nogen fil i `data/manufacturers/` — det var en fejlagtig antagelse i briefet,
uafhængig af, om RBQ-3 kunne verificeres.

---

## Færdigkriterium — tal

**(a)** N = 0 poster leveret, K = 2 sprunget over med begrundelse. N + K = 2.
**(b)** Ikke relevant — ingen post skrevet, så intet 33-feltsregnskab at aflægge.
**(c)** `node tools/validate.mjs`: **46 fil(er) · 0 fejl · 1 advarsel** (den
   ene advarsel er præeksisterende, på `ghost-robotics-vision-60`, urørt af dette spor).
   `node tools/build.mjs`: gennemført, 125 sider, samme 46 datafiler. Uændret baseline —
   bekræfter at researcharbejdet ikke har rørt eksisterende data.
**(d)** Selv-tjek felt-for-felt: ikke relevant — ingen felter skrevet. I stedet er hver
   *negative* konklusion (Guoxing: 5 selvstændige søgninger/hentninger, alle uden
   quadruped-træf; RBQ-3: 4 direkte opslag på producentens egne kanaler, alle uden
   RBQ-3-træf) talt op ovenfor, så en anden agent kan se, hvad der faktisk blev afprøvet,
   og ikke skal gentage den samme forgæves søgning.
**(e)** Gitignorerede nye filer: **ingen.** `media/_kilder/` er urørt — der er ikke
   gemt rå-HTML/skærmbilleder, fordi intet tal fra nogen af de to eftersøgninger
   kvalificerede sig til at blive skrevet ind i en post (LÆSMIG.md's bevispligt gælder
   tal, vi *bruger*; her er der intet at dokumentere bevis for).

---

## Billedkandidater

Ingen — der er ingen leverede poster at knytte billeder til. Findes en fremtidig
Guoxing-quadruped eller en officiel RBQ-3/RB-01K-produktside, skal billedbaren fra
robotdata-skillen anvendes på det tidspunkt, i en separat billedrunde som opgavebrevet
foreskriver.

---

## Selv-review

- **Er jeg sikker på Guoxing-konklusionen?** Rimeligt sikker. Fem uafhængige
  søgestrategier (egen side, site-søgning, marketplace-søgning, kinesisksproget
  brancheoversigt) landede alle samme sted: Guoxings brandslukningsprodukter er
  hjul-/bæltekørende. Usikkerhed: Guoxing kan have et nyere produkt, der endnu ikke er
  indekseret af søgemaskiner, eller et produkt solgt under et andet firmanavn/mærke i
  samme koncern — det kan jeg ikke udelukke fra websøgning alene.
- **Er jeg sikker på RBQ-3-konklusionen?** Mindre sikker end Guoxing-sporet, af én
  grund: RBQ-3 er tydeligvis et *reelt* projekt (armyrecognition.com og kedglobal.com er
  ikke useriøse kilder, og et forsvarssamarbejde med Hyundai Rotem er en konkret,
  navngiven begivenhed) — det er ikke en opdigtet robot, sådan som Guoxing-quadrupeden
  ser ud til at være. Det, der mangler, er specifikt en **producentside** med tal, og
  det er en anden mangel end "robotten findes ikke". Er en producentside for RBQ-3/RB-01K
  offentliggjort efter 24. aug 2026 (fx ved den planlagte hær-udrulning senere i 2026),
  bør sporet genoptages.
- **Kunne jeg have accepteret armyrecognition.com's tal som `kildetype: sekundaer`?**
  Skemaet (`tools/skema.mjs` POST_NOEGLER) understøtter faktisk `kildetype`, og
  DATAMODEL.md's punkt D1 ("skal sekundære kilder med?") er stadig åbent — så det er
  teknisk muligt i systemet. Jeg har **bevidst ikke** gjort det, fordi opgavebrevet gav
  en skarpere, specifik instruks for netop denne runde: "Kilder er producentens EGNE
  sider" og "hvert tal skal komme fra producentens egen side". Den instruks vejer tungere
  end skemaets generelle mulighed. Er det en fejlvurdering, er den let at rette: tallene
  fra armyrecognition.com står ordret citeret ovenfor og kan skrives ind med
  `kildetype: sekundaer`, hvis CEO'en beslutter, at D1 skal besvares "ja" for denne post.
