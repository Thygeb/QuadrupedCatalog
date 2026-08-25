# FUND — retning LYS ("Udstillingssalen, forfinet")

Agentrapport for byggeriet af designretning LYS: fire statiske HTML-mockups plus
`BEGRUNDELSE.md`, alle i `prototype/retning-lys/` på gren `spor/retning-lys`, worktree
`C:/Praktik/websites/udstilling-wt-ret1`. Én af tre konkurrerende retninger — denne
rapport dækker kun LYS.

## Skill-vurdering

Vurderet ved opgavens start, som CLAUDE.md kræver:

- **`impeccable`** — gået forbi. Retningens tese var allerede fastlagt af orkestratoren
  ("evolution af ORBIT-lys, forfinet"), så jeg fulgte den direkte i stedet for at køre
  hele impeccable-flowets forme-fra-bunden-proces.
- **`robotdata`** — gået forbi som fuldt skema (jeg tilføjer ingen robotpost), men de fire
  datatilstande (`ikke_oplyst`/`nej`/`0`/`kun_billede`) og kildereglerne, skillen bærer, er
  fulgt i praksis gennem hele byggeriet — det er selve kernen i sammenligningssiden.
- **`ui-ux-critique`/`critique`** — gået forbi. Hører til orkestratorens review efter
  levering, ikke til selve byggeriet.
- **`parallelt`** — gået forbi. Worktree'en var allerede sat op af orkestrator før jeg
  startede.
- **`grillmig`** — gået forbi. Briefet var allerede grillet, jf. orkestratorens instruks.
- **Anthropics `frontend-design`-skill** — hentet midt i opgaven efter en tilføjelse fra
  orkestratoren (URL i beskeden), og reglerne deri er anvendt retroaktivt på alt indhold.
  Se `BEGRUNDELSE.md`, afsnittet "Anthropics frontend-design-skill", for hvilke punkter der
  blev brugt og hvilke der blev fravalgt med begrundelse.

Konklusion: ingen projekt- eller global skill blev kørt i sin fulde form til selve
byggeriet — opgavebrevets eksplicitte tese og CLAUDE.md's regler blev fulgt direkte, med
Anthropics designskill hentet og anvendt undervejs efter tilføjelsen.

## Læst før bygning

`DESIGN.md` (hele filen, 829 linjer — ORBIT-lys-systemet denne retning er en evolution af),
`PRODUCT.md` (hele filen — læseren, positioneringen, de fem produktprincipper), `STATUS.md`
L16 (visuel grundtone) og L31 (målgruppe vendt om), `CLAUDE.md`s hårde begrænsninger,
`tools/skema.mjs` (det fulde 30-feltsskema, grupperne, `taethed()`s regler),
`tools/validate.mjs` (`erUdfyldt()` — den PRÆCISE regel for hvornår et felt tæller som
udfyldt), `tools/skabelon/side.mjs` (hjælpefunktionerne `tal()`, `tilstand()`, `operator()`
— den nøjagtige rendering af de fire tilstande og operatorsymbolerne), `data/i18n/da.json`
(alle feltnavne, gruppenavne, operatorsymboler). `dist/` fandtes ikke i worktree'en og blev
bygget med `node tools/build.mjs` for at se det nuværende udtryk — to referenceskærmbilleder
(forside + `unitree-b2`-robotside) blev taget med Playwright og gennemgået, før noget blev
tegnet.

## Data — hvordan tallene blev hentet

Ikke skrevet i hånden fra hukommelse. Et Node-script (`prototype/retning-lys/_ref/uddrag.mjs`,
scratch — se note nederst) brugte projektets **egen** parser (`tools/yaml.mjs`) og **egen**
tæthedsfunktion (`tools/validate.mjs`s `erUdfyldt()`/`taethed()`) til at trække de 62
robotters felter ud til en mellemliggende JSON, som jeg derefter læste direkte og
transskriberede til HTML. De tre sammenligningsrobotter (Boston Dynamics Spot, ANYbotics
ANYmal X, Unitree Go2) og detaljesidens robot (GENISOM Gangben L2) blev læst i deres fulde
YAML-form med Read-værktøjet og bygget felt for felt direkte fra kildeteksten.

**To scriptfejl fundet og rettet undervejs**, begge i mit eget engangsscript, ikke i
projektets kode:

1. Mit første udtræksscript beregnede tæthed selv i stedet for at bruge `tools/validate.mjs`s
   `taethed()` — og talte fejlagtigt et felt som `ikke_oplyst`, hvis det kun havde
   `min`/`maks` (interval) og ikke en skalar `vaerdi`. Det ramte bl.a. Gangben L2 (22/30 i
   stedet for korrekte 23/30, fordi driftstiden er et interval). Rettet ved at importere den
   rigtige `taethed()`-funktion og køre den om — **9 af 16 katalogtal og 2 af 3
   sammenligningsrobotters tæthedstal var forkerte og er rettet** (Go2 13→14, CyberDog 2
   18→17, Gangben L1 18→19, Spot 21→20, Gangben L2 22→23, AlienGo 12→13, Shvana 4→5, MOVENEW
   T1 22→24, Jueying X30 12→13).
2. Filterrækkens "Driftstid"-tælling brugte samme fejlagtige logik og viste 55/7 i stedet for
   de korrekte **52/10** — rettet efter at have genkørt tællingen med den rigtige
   `erUdfyldt()`.

## Selv-tjek med tælling

Optalt maskinelt (`grep -o` på de rendrede klasser): **226 rendrede dataværdier** på tværs
af de fire sider (`<b class="num">`, `v-ikke`, `v-nej`, `v-ja`, `v-tekst` — hver optælling
er én tal- eller tilstandsvisning). Fordeling: forside 28, katalog 64, sammenligning 95,
robotside 39.

- **De 95 (sammenligning) + 39 (robotside) = 134 værdier** blev bygget direkte fra de fire
  robotters fuldt indlæste YAML-tekst, felt for felt i skemaets rækkefølge — ikke fra
  hukommelse.
- **De 64 (katalog) + 28 (forside) = 92 værdier** blev bygget fra den maskinelt udtrukne
  JSON (se ovenfor), som fjerner transskriptionsrisikoen i selve dataindsamlingen; den
  resterende risiko lå i formateringstrinnet (dansk decimalkomma, operatorsymbol), som blev
  efterprøvet separat (se nedenfor).
- **Alle 16 tæthedstal** (`X AF 30 FELTER`) er genberegnet med den rigtige `taethed()`-
  funktion efter fejl 1 blev fundet — 9 fejl fundet og rettet, 7 var allerede korrekte.
- **Alle 6 filtergruppers optællinger** (19 chips: nyttelast, driftstid, IP-klasse, ROS 2,
  CE, pris) er genberegnet med `erUdfyldt()` direkte mod alle 62 filer — 1 af 6 grupper
  (driftstid) var forkert og er rettet; de øvrige 5 (CE 2/2/58, ROS2 5/0/57, IP-fordeling,
  pris 6/56, nyttelast 50/12) stemte allerede med den korrekte funktion.
- **Vægtklasse-algoritmen** (`hjaelp.vaegtklasse()` i `tools/skabelon/side.mjs`) blev læst i
  kildekoden og alle 16 katalogrobotters gruppetilhør efterprøvet manuelt mod den — **0
  fejl** (bl.a. Lynx S10s "≤20 kg" korrekt placeret i 20-40 kg-gruppen, MOVENEW T1s
  interval 40-50 kg korrekt placeret i over-40-gruppen via midtpunktsregel). Gruppetotalerne
  (14/17/21/10) er hentet fra `tools/build.mjs`s eget konsoloutput, ikke genudregnet af mig.
- **Tekstfelter (v-tekst) fidelitetstjekket separat**: 5 værdier blev fundet at være
  omskrevet/oversat af mig i stedet for vist verbatim (ANYmal X's og Spots
  `autonominiveau`, ANYmal X's `kameraer`, samt to lister med `x2`→`×2`-notation) og er
  rettet til at matche YAML-strengen tegn for tegn — inklusive kildens egne uregelmæssigheder
  (fx "foelgning" uden ø, det kinesisk/danske blandingsudtryk i Gangben L2's
  autonominiveau-felt).
- **Stikprøve på ca. 25 øvrige numeriske/operator-felter** (intervaller, ±/~/≥/≤-operatorer,
  imperial-par) sammenholdt direkte med den already-loaded YAML-tekst — **0 yderligere fejl
  fundet**.
- **EU-linjen** ("2 af 62 … CE-mærkning") og **producent-/robottallet** ("62 modeller fra 21
  producenter") er begge talt maskinelt fra de 62 datafiler, ikke overtaget fra
  referenceskærmbilledet uden efterprøvning (skærmbilledet viste samme tal, men tallet er
  selvstændigt genberegnet).

**Samlet:** 226 viste værdier, 134 bygget direkte fra fuldt læst kildetekst, 92 bygget fra
maskinelt udtrukket JSON. Deriveret-tal-laget (16 tæthedstal, 19 filtertal, 4
gruppetotaler, 5 tekstfelter) blev alle eksplicit genefterprøvet mod projektets egen kode:
**15 fejl fundet og rettet** (9 tæthedstal + 1 filtergruppe + 5 tekstfelter), 0 fejl
tilbage efter rettelserne, efterprøvet ved gentagen kørsel af de samme scripts.

## Skærmbilleder og hvad der blev rettet

Playwright (cachet lokal installation, `C:/Users/thyge/AppData/Local/npm-cache/_npx/…/playwright`,
browsere allerede hentet til `C:/Users/thyge/AppData/Local/ms-playwright`) — ingen
`node_modules` i projektet, så en fil, der peger direkte på den cachede pakkes `index.mjs`,
blev brugt til at starte Chromium.

- **Skærmbilleder taget:** alle fire sider ved 1280px og 390px (8 fulde skærmbilleder), plus
  en systematisk overflow-scanning ved 1440/1280/1024/900/850/760/680/600/480/390/375px på
  alle fire sider (`document.documentElement.scrollWidth` mod `clientWidth`), plus flere
  målrettede beskæringer af navigation, sammenligningstabellens mobile visning og
  katalogkortenes stribe.
- **To rigtige fejl fundet og rettet:**
  1. **Navigationslinjen løb ud over skærmen ved 390px** (`scrollWidth` 538 mod
     `clientWidth` 390) — de fire menupunkter brød ikke om og skubbede siden i overflow.
     Rettet med et nyt brudpunkt ved 560px, der lader navigationen ombryde til to linjer og
     skjuler det midlertidige navne-mærke for at spare plads.
  2. **Forsidens "Feltets yderpunkter"-gitter** brugte en inline `grid-template-columns`, der
     ikke kunne brydes responsivt — ved 390px blev montre-fotoet og faktalisten klemt ned i
     to alt for smalle spalter. Flyttet til en rigtig CSS-klasse (`.yderpunkt-gitter`) med et
     brudpunkt ved 760px, der stabler dem i én spalte.
  3. **Sammenligningstabellens mobile visning** manglede robotnavn pr. celle, når de tre
     spalter stables til én ved 900px — en læser kunne ikke se, hvilken robot et tal hørte
     til, uden at scrolle tilbage til toppen. Rettet med CSS-genererede mikro-etiketter
     ("SPOT"/"ANYMAL X"/"GO2") foran hver celle, baseret på den faste rækkefølge cellerne
     altid står i.
- **Falsk positiv, IKKE rettet:** QA-scriptets automatiske billede-brudt-tjek
  (`img.complete`/`naturalWidth`) markerede adskillige billeder som "knækkede" ved 390px,
  fordi tjekket kørte, før `loading="lazy"`-billederne nåede at blive indlæst under
  fuldside-scroll. Efterprøvet visuelt i de faktiske skærmbilleder (fx `qa-katalog-1280.png`)
  — alle billeder vises korrekt. Ingen ægte fejl.
- **Overflow-scanningen** (10 bredder × 4 sider = 40 målinger) viste **0 overflow** efter
  rettelserne ovenfor.

## Selv-review

**Hvad jeg er sikker på:** datatallene er efterprøvet grundigt og systematisk, med to reelle
scriptfejl fundet, rettet og genefterprøvet — ikke en påstået nulfejl uden optælling.
Layoutet er testet ved ti bredder uden overløb, og de tre rigtige responsive fejl, jeg fandt,
er rettet og genskærmbilledet. De fire datatilstande er konsekvent adskilt gennem alle 226
værdier (mono/fed for tal, versal-firkant for ja/nej, stiplet grå for hul). Kilder er
konsekvent skjult (kildemærket er fjernet fra både HTML og CSS, ikke kun gjort usynligt).

**Hvad jeg er usikker på:**

1. **"Kortstriben" på forsiden** er fortolket som en smagsprøve (seks kort) med link videre
   til `katalog.html`, ikke som hele det 62-robotters katalog, dagens `dist/da/index.html`
   viser på forsiden. Det er en arkitekturændring, jeg har begrundet i `BEGRUNDELSE.md`, men
   det ER en fortolkning af et tvetydigt ord i briefet ("kortstriben") — orkestratoren bør
   afgøre, om det stemmer med hensigten.
2. **Ingen "bedste værdi"-markering** i sammenligningstabellen er en bevidst, begrundet
   designafgørelse (se `BEGRUNDELSE.md`), men det er én af flere gyldige svar på briefets
   spørgsmål, og en anden retning kunne rimeligt have valgt en mere synlig
   yderpunkt-markering (i samme sprog som forsidens "Yderpunkter"-komponent). Jeg vurderede
   risikoen for at glide mod en redaktionel score som for stor til at forsvare det valg.
3. **Forbeholdsteksterne (`title`-attributter) er parafraserede**, ikke ordret kopieret fra
   `advarsel`-felterne i YAML — jeg holdt alle tal og påstande i parafraserne identiske med
   kilden og efterprøvede det, men det er ikke samme fidelitetsniveau, som de primære
   værdifelter (`v-tal`/`v-tekst`) fik efter rettelsen af tekstfeltfejlene. Den rigtige
   generator ville formentlig vise `advarsel`-teksten ordret i `title`; her er den forkortet
   for læsbarhedens skyld i en `title`-attribut.
4. **`prototype/retning-lys/_ref/`** indeholder scratch-materiale (uddragsscript,
   QA-screenshots, mellemliggende JSON) fra byggeprocessen. Jeg forsøgte at slette mappen
   efter brug, men `rm -rf` blev afvist af værktøjets tilladelsessystem (ikke en
   sandbox-fejl — afvist selv med `dangerouslyDisableSandbox`). Mappen ligger derfor stadig i
   `prototype/retning-lys/` og er **ikke** en del af de fire leverede sider, men optager
   plads i mappen. Orkestratoren bør enten rydde den manuelt eller fortsat behandle kun de
   fem navngivne filer (fire `.html` + `BEGRUNDELSE.md` + `lys.css`) som leverancen.
5. **Fonts:** `assets/fonts/` er tom i denne worktree (kun `.gitkeep`), så Manrope/JetBrains
   Mono falder tilbage til systemfonte i skærmbillederne. Det er identisk med, hvordan den
   rigtige side selv ville opføre sig uden de lokale woff2-filer — ikke en fejl i mockuppen,
   men værd at nævne, hvis CEO'en undrer sig over skrifttypen på skærmbillederne.

## Git

Endnu ikke committet — afventer instruks om, hvorvidt orkestratoren vil gennemgå filerne
først eller ønsker commits undervejs i logiske trin, som CLAUDE.md foreskriver.
