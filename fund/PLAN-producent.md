# PLAN — producentfladen (led 3, fjerde og sidste fladeplan)

**Spor:** `spor/prodplan` · **Skill:** `impeccable shape` · **MODE: Read** · 3. sep 2026
**Fladen er TO flader:** producentindekset (`/<sprog>/producenter/`, 1 side pr. sprog) og
producentundersiden (25 sider pr. sprog). De behandles hver for sig, hvor de har hver sit
problem, og samlet, hvor de deler et.

**Denne plan er den fjerde.** `fund/PLAN-robotside.md` (Read), `fund/PLAN-katalog.md`
(Operate) og `fund/PLAN-sammenligning.md` (Operate) ligger på main og er læst. Hvor de er
uenige, skriver denne plan hvilken producentfladen følger — den opfinder ikke en femte vej.

---

## 0. Grundmåling — hvad fladen er i dag

### 0.1 Miljøet, og beviset for at tallene er mine egne

Frisk worktree fra `ac84dfe`. `.env`, `media/_kilder/` og `assets/fotos/fabrikant/` fulgte
ikke med grenen (gitignoreret). **Første byg fejlede med 76 R18-fejl** — filen findes ikke —
og det er miljøet, ikke fladen. De 610 fabrikantfotos blev kopieret ind fra hovedrepoet
(kun læst derfra, intet skrevet), hvorefter:

```
node tools/build.mjs
→ Byggede 216 sider · 77 datafiler · 1111 tal med kilde, 0 uden
```

Server: **egen port 8144**, startet fra projektroden. **Vagt:** en sentinelfil skrevet til
`dist/` og hentet gennem serveren gav samme streng — serveren serverer min egen `dist`, ikke
et andet spors. Alle browsertal er målt med et selvskrevet script på **egen chromium-instans**
(ikke den delte MCP-browser), og **hver måling åbner med `location.href` + `innerWidth`**.
Alle vagter passerede; intet tal i denne plan er forkastet.

### 0.2 Briefets fem påstande om fladen — alle fem holder

| Måling | Briefet | Målt | |
|---|---|---|---|
| Sider pr. sprog (indeks + undersider) | 26 | **26** (1 + 25), da og en | holder |
| `kort`-elementer på dem | 77 | **77** | holder |
| Sider der indlæser JavaScript | 0 | **0** `<script>` | holder |
| Kontrol: katalog | 1 | **1** (robot 1, sammenligning 3) | holder |
| `samling` i `producent.mjs` | 2 | **2** (l. 244 kommentar, l. 255 kode) | holder |

### 0.3 Kortdelene — og to af briefets katalogtal skal rettes

Målt som **elementer**, ikke som rå `grep -o`. Det er forskellen, briefet selv advarer om:
`grep -o 'kort__vaerdi'` rammer også `kort__vaerdi--dato` og `kort__vaerdi-mrk`.

| Del | Producent | Katalog | Briefets katalogtal |
|---|---|---|---|
| `<article class="kort">` | **77** | **86** (77 + 9 `kort--seneste`) | — |
| `kort__navn` · `kort__prod` · `kort__tekst` | **77** hver | **86** hver | 86 · holder |
| `kort__mrk` (statusstempel) | **9** | **12** | 12 · holder |
| `kort__vaerdi` (talceller) | **0** | **185** | 370 · **rettes** (370 = 185 celler × 2 klassetræf) |
| `kort__savn` ("ikke oplyst") | **0** | **123** | 123 · holder |
| `kort__saml` (knapper) | **0** | **86** | 172 · **rettes** (172 = 86 knapper + 86 `kort__saml-ord`) |

**Producentsidens fem tal holder alle fem.** De to rettelser rammer kun kontrolkolonnen.

### 0.4 Fladens form, målt ved 1440 px

| | Producentindeks | Underside (Unitree, 13 modeller) | Underside (RIVR, 1 model) |
|---|---|---|---|
| Sidehøjde | 1.654 px | 3.174 px | 2.632 px |
| Vandret overløb | 0 | 0 | 0 |
| Klikbare i `<main>` | **102** | **38** | **26** |
| — heraf `<button>`/`<label>`/`<summary>`/`<input>` | **0** | **0** | **0** |
| Visuelle signaturer blandt dem | **1** | **3** | **3** |
| Klikbare under 44 px høje | 101 af 102 | 37 af 38 | 25 af 26 |
| Skriftgrader i `<main>` | **5** | **12** | **11** |
| Skriftfamilier i `<main>` | Saira, kun Saira | Saira, kun Saira | Saira, kun Saira |
| `kildemaerke` | **0** | **0** | **0** |
| `.knap` | **0** | **0** | **0** |

Sektionshøjder på undersiden (1440 px), målt fra sidens top:

| Sektion | Unitree | RIVR |
|---|---|---|
| `producent-top` (navn, land, hjemsted, antal) | 150 px | 150 px |
| EU-sætningen | 170 px | 170 px |
| Modelafsnittet | 952 px | **411 px** |
| **"Alle 25 producenter"** | **1.719,6 px = 54,2 %** | **1.719,6 px = 65,3 %** |

---

## 1. MODE: Read — og hvad det betyder her, når robotsiden allerede har defineret det

`fund/PLAN-robotside.md` afsnit 1 satte Read-modens tre konsekvenser. **Denne plan arver dem
ordret** frem for at formulere sine egne, og anvender dem på en flade, hvor den tredje
rammer hårdest:

| Robotsidens Read-regel | Producentfladen |
|---|---|
| *"Øjet skal lande på maskinen, og derefter på optegnelsens tilstand"* | Øjet skal lande på **producenten**, og derefter på **hvad vi ved om den** |
| *"Sidens form skal ændre sig med dens indhold"* | **Brydes målbart.** RIVR (1 model) og Unitree (13) har samme fire sektioner i samme rækkefølge, og 1.719,6 px af begge sider er den samme liste over de andre 24 |
| *"Læsbarhed slår tæthed"* | Fladen har **to** prosasætninger i alt, og begge er sat i maskinens skrift |

**Hvad den besøgende skal forstå på en producentside, i rækkefølge:**

1. **Hvem er det her?** Navn, land, hjemsted.
2. **Hvor stor en del af feltet er de?** Antal modeller i kataloget — og hvad det tal betyder,
   når 10 af 25 producenter har præcis én.
3. **Hvad ved vi om dem som producent, som ingen enkelt robotside kan sige?** ← *dette er
   sidens eneste egentlige grund til at eksistere.* Filens eget hoved siger det (l. 4–8):
   *"Siden har ét job, som robotsiden ikke kan gøre: at vise CE-oplysningen SAMLET for hele
   producentens modelrække. Ét 'ikke oplyst' er en tom rubrik; tolv under hinanden er en
   oplysning om producenten."*
4. **Modellerne**, som indgange til robotsiderne.

**Fladen leverer 1, 2 og 4 og fejler på 3** — og punkt 3 er det eneste, den har for sig selv.
Det er nøjagtig samme diagnose som robotsidens, og det er ikke en tilfældighed: begge Read-
flader lægger deres egen påstand sidst eller svagest, mens den lånte struktur fylder midten.

**Producentindekset er også Read, ikke Operate.** Det ligner en Operate-flade — en tabel, man
scanner — men der er intet at betjene: nul filtre, nul sortering, nul input. Den besøgende
skal **forstå feltets form** (hvor mange producenter, hvorfra, hvor store). Det er derfor
`producentSaetning()` findes, og den er det rigtigste element på hele fladen.

---

## 2. De låste beslutninger, planen regner med og ikke genåbner

Slået op i STATUS.md's **Lukket**-tabel og i *"Kom ikke igen med disse"*, uden `head`.

| Nr. | Beslutning | Hvad planen gør |
|---|---|---|
| **K.1** | Ét kort, én implementering; forskellen mellem flader er **fratrækning** | Arves ordret. Se afsnit 3 — planen foreslår **ingen** ændring af kortet |
| **L72** | Forsiden er slettet; `dist/da/index.html` er kataloget | Bruges som *bevis*: fladen har arvet fire forældreløse abstraktioner fra den. Se 11.5 |
| **L76** | `--accent` er baggrund og markør, aldrig tekst på lys flade | Ingen accentforgrund foreslås. Hvor noget skal frem: flade, vægt eller kant |
| **L77** | Én knapprimitiv `.knap` med varianter | Producentfladen har **0** `.knap` (målt). Planen foreslår **ingen** knap — se 6.3 |
| **L78** | Produktfoto beskæres aldrig; `contain` + 4:3 overalt | Uændret. Kortets billedled røres ikke |
| **L79** | 2 px er systemets radius | Alt nyt arver `--hjoerne`. Målt: `.kort` har i dag radius 0 på begge flader |
| **L80** | `--sans` udgår. **Saira til maskinen, Literata til mennesket** | Planen **udfører** den på fladens to egne sætninger — se P4. Eksekvering, ikke ny beslutning |
| **Hård begr. 1** | Ingen forhandleraftale | Se 6.1. Producentsiden er det farligste sted på sitet for den regel, og planen har ét forslag, der rører den (P1) |
| **Hård begr. 5** | *"Ikke oplyst"*, *"nej"* og *"0"* er tre tilstande | Se afsnit 4. **Fladen bryder den ét sted**, og det er ikke de tre nuller |
| **Hård begr. 6** | Ingen redaktionel 1-5-score uden metode | Intet forslag rangerer en producent. `producentSaetning()`s *"14 af 25"* er en optælling, ikke en dom — og planen bevarer den form |

I *"Kom ikke igen med disse"* er nærmeste nabo *"Redaktionel 1-5-score"*. Intet forslag her
bedømmer en producent; det stærkeste, planen foreslår, er at **vise et tal, koden allerede
regner og kaster væk**.

---

## 3. Kortarven — arvet fra K.1, og efterprøvet frem for troet

K.1 siger: *"Producentsidens plan arver dette kort med tal, huller og samleknap fratrukket,
og har intet kort at beslutte."* **Denne plan beslutter intet om kortet.** Men den har
efterprøvet arven, fordi en arv, ingen har målt, er en påstand.

### 3.1 K.1's tre påstande, genmålt

**a) Den fælles `kort()` har præcis én kalder.** Målt uafhængigt:
`grep -rn "\.kort(" tools/skabelon/*.mjs` giver **én** kalder, `producent.mjs:251`.
`tools/skabelon/forside.mjs` findes ikke. **K.1 holder.**

**b) Det obligatoriske sæt er intakt.** Sammenlignet kort-for-kort mellem katalogets **77
almindelige** kort (altså uden de 9 `kort--seneste`) og producentfladens 77:

| Obligatorisk efter K.1 | Katalogets 77 | Producentens 77 |
|---|---|---|
| `<picture>` (billedet, fototilstanden) | 76 | **76** |
| `billedled--plade` (måltro plade) | 27 | **27** |
| `billedled--tom` (tom flade) | 0 | **0** |
| `kort__mrk` (statusstempel når status ≠ i produktion) | 9 | **9** |

**Fire ud af fire identiske.** Fratrækningen rammer præcis det valgfrie sæt og ikke én ting
mere. Det er den stærkeste form for bevis, arven kan få: ikke *"kortet ser rigtigt ud"*, men
*"det obligatoriske er byte-for-byte det samme på begge flader"*.

**c) Fratrækningen har en målt gevinst, ikke kun en begrundelse.** Kortenes højde ved 1440 px:

| | Unikke højder | Spænd |
|---|---|---|
| Katalog | 3 (269,8 · 269,9 · 286,1) | **16,3 px** |
| Producent | **1** (269,9) | **0 px** |

Katalogets kort springer i højde, fordi antallet af talceller og huller varierer pr. robot.
Producentfladens 77 kort har **nul** højdespring. Et net, hvor hvert kort er nøjagtig lige
højt, er en anden og roligere flade — og det er en Read-flades rigtige valg.

### 3.2 Hvad planen tilføjer til arven: én sætning, den ikke må brydes

K.1's *"ingen flade må tilføje en handling, kataloget ikke har"* dækker knapper. **Den dækker
ikke, at producentkortet i dag har en anden klikflade end katalogkortet.** Målt: på begge
flader er det klikbare område **kun** `<h3 class="kort__navn"><a>`, ikke kortet. Billedet er
ikke klikbart noget sted. Det er konsistent, og planen foreslår ikke at ændre det — men det
hører i arven, så en fremtidig bygger ikke "forbedrer" producentkortet ensidigt.

**Arvens ene tilføjelse:** producentkortet må aldrig få en klikflade, et hover eller en
markering, katalogkortet ikke har. Fratrækning går kun én vej.

---

## 4. DE TRE NULLER MOD HÅRD BEGRÆNSNING 5 — planens vigtigste spørgsmål, besvaret

Briefet: *"Er det en legitim fratrækning eller et sted, hvor siden fortier noget?"*

**Svaret er begge dele, og de to dele ligger ikke samme sted.** De tre nuller på kortet er
legitime. Men fladen bryder begrænsning 5 ét andet sted — i den ene sætning, hvor den
faktisk *viser* en tilstand — og det sted er samtidig sidens eneste eksistensberettigelse.

### 4.1 Kriteriet, jeg dømmer efter, og som kan bruges på de andre tre flader

En fratrækning er ikke legitim eller ulegitim i sig selv. **Den er legitim, når det
fratrukne findes ét klik væk i samme form. Den er ikke legitim, når fladen er det eneste
sted, oplysningen findes.**

Det er ikke en smagsregel; det er begrænsning 5's egen logik. Reglen siger, at de tre
tilstande *"skal se forskellige ud"*, fordi *"det er der, katalogsider lyver"* — og en
katalogside lyver ikke ved at udelade et felt, den lyver ved at **vise et felt, hvor to
tilstande er trykt ens**. Udeladelse er kun løgn, når der ikke er nogen vej til sandheden.

### 4.2 De tre nuller på kortet: legitime, og nu med bevis

| Nul | Dom | Bevis |
|---|---|---|
| `kort__saml` = 0 | **Legitim** | Siderne indlæser 0 JavaScript (målt). En sammenlign-knap ville stå `hidden` for evigt — død markup, ikke en knap i venteposition |
| `kort__vaerdi` = 0 | **Legitim** | Hvert af de 77 kort linker til robotsiden, hvor samme tal står **med enhed og kildemærke**. Ét klik væk, i en bedre form |
| `kort__savn` = 0 | **Legitim** | Samme vej. Og hullerne står på robotsiden i den fulde optegnelse, hvor 33 felter viser tilstanden hver for sig |

**Og fratrækningen er symmetrisk, hvilket er det, der redder den.** Alle 77 kort mister de
samme tre ting. Der findes ikke ét kort, hvor et tal vises, og ét, hvor det er blankt — og
det er præcis den asymmetri, begrænsning 5 forbyder. En flade, der viste nyttelast på 65 kort
og intet på de 12, ville lyve; en flade, der viser nyttelast på nul, gør ikke.

**Målt gevinst ved fratrækningen:** 0 px højdespring mod katalogets 16,3 px (afsnit 3.1c).

### 4.3 Hvor fladen så faktisk bryder reglen: EU-sætningen

**Fladen viser præcis én af de tre tilstande.** Målt over alle 26 danske producentsider:

| Tilstandsklasse | Forekomster på producentfladen |
|---|---|
| `v-ikke` ("ikke oplyst") | **6** — de seks ukendte hjemsteder |
| `v-nej` | **0** |
| `v-tal` | **0** |

Den ene, den viser, viser den rigtigt: Boston Dynamics, Ghost Robotics, RIVR, Unitree, Xiaomi
og Yufan får hjemstedet tegnet som den prikkede *ikke oplyst*-chip, ikke som en tom plads.
**Fladen kan altså begrænsning 5.** Den gør det bare ikke, hvor det betyder noget.

**Kæden, målt led for led:**

1. `producent.mjs:144 ceOpgoerelse()` regner **tre** tal: `{ ja, nej, ukendt, i_alt }`.
2. Funktionens egen kommentar (l. 139–142) siger ordret: *"TRE tal, ikke to: oplyst ja,
   oplyst nej, og intet oplyst. **De tre må ikke kollapse — det er præcis CLAUDE.md
   begrænsning 5 på producentniveau.**"*
3. `producent.mjs:199 euSaetning()` udsender **to**: `t.ja` og `t.i_alt`. `t.nej` og
   `t.ukendt` bliver regnet og smidt væk.
4. Målt over de 77 datafiler: **ja = 2** (ANYbotics ANYmal, ANYmal X) · **nej = 1**
   (xiaomi-cyberdog-2) · **ikke oplyst = 74**.
5. Xiaomis producentside siger: **"0 af 2 robotter i kataloget oplyser CE-mærkning fra
   producenten."** De to modeller er CyberDog 2, hvis YAML bærer `vaerdi: false` med kilde,
   hentedato og noten *"DOKUMENTERET NEJ, ikke et hul. Producenten oplyser sine standarder,
   og CE er ikke iblandt dem: GB 17625.1-2012, …"* — og CyberDog, der siger ingenting.
6. **Robotsiden for CyberDog 2 viser tilstanden rigtigt:**
   `<span class="v v-nej"><i class="mrk"></i>nej</span>`, med noten under.
7. **Producentsiden trykker den som et 0.**

**Er sætningen så falsk?** Nej. *"0 af 2 oplyser CE-mærkning"* er bogstaveligt sandt om
Xiaomi. **Den er tabsgivende i præcis den dimension, begrænsning 5 er sat for at beskytte** —
og det er ikke en detalje, for **denne flade er det eneste sted på hele webstedet, hvor CE
opgøres pr. producent** (målt: `.eu-fund-linje` findes på 25 sider, alle producentundersider,
og på ingen andre). Der er ingen "ét klik væk". 4.1's kriterium falder ud til den anden side.

**Og der findes ikke noget at opfinde.** Ordforrådet står allerede i begge sprogfiler,
færdigoversat, **med nul forbrugere:**

| Nøgle | da.json | en.json | Kaldere i `tools/` |
|---|---|---|---|
| `eu_ce_ja` | "CE oplyst af producenten" | "CE stated by the manufacturer" | **0** |
| `eu_ce_nej` | "Producenten oplyser, at der ikke er CE" | "The manufacturer states that there is no CE marking" | **0** |
| `eu_ce_ikke_oplyst` | "CE står ikke noget sted" | "CE is not stated anywhere" | **0** |

De tre er formuleret nøjagtigt efter L25's regel — de taler om **hvad producenten oplyser**,
aldrig om hvorvidt maskinen *har* CE. De blev skrevet til L32's slettede EU-tabel og har
ligget ubrugte siden.

### 4.4 Den fjerde kopi, filen selv advarer imod

`side.mjs:1634` har en delt `ceTilstand(robot)`, der returnerer `'ja' | 'nej' |
'ikke_oplyst'`. **Katalogsiden kalder den to gange** (`katalog.mjs:1105` og `:1459`).
**`producent.mjs` kalder den ikke** — `ceOpgoerelse()` skriver klassifikationen af igen i
hånden. Filens eget hoved (l. 35–37) siger: *"VÆRKTØJET deles med robot.mjs frem for at blive
skrevet af igen. Tre håndskrevne kopier af `esc` og `T` divergerer ved den fjerde ændring."*

**Og de to er allerede divergeret, latent.** For en strengværdi:

| `ce_oplyst: "nej"` | `ceTilstand` (side.mjs) | `ceOpgoerelse` (producent.mjs) |
|---|---|---|
| Resultat | `'nej'` — `tilstandAf` kender `'nej'` (`skema.mjs:128`) | **`ukendt`** — `typeof p === 'string'` fanger den før |

Ingen robot bærer strengen `"nej"` i dag, så divergensen er **ikke synlig** — men den betyder,
at hvis en dataindsamler skriver `ce_oplyst: "nej"` i stedet for `vaerdi: false`, viser
katalogsiden og producentsiden to forskellige tal for samme robot, uden at noget fejler.

---

## 5. Producentindekset er sin egen flade og har sit eget problem

Briefet: *"ca. 250 mørke understregede modelnavne, noteret men aldrig målt ordentligt.
Mål det."*

**Målt: 102 links, ikke ~250** — 25 producentnavne i kolonne 1 og 77 modelnavne i kolonne 4.
Tallet 250 findes ikke på fladen i nogen tælling, jeg kan reproducere; det nærmeste er 102
links pr. sprog, altså 204 over da+en.

**Men fundet bag tallet er rigtigere end tallet.** Målt ved 1440 px:

- **102 klikbare elementer. Én visuel signatur.** 15 px · vægt 600 · understreget ·
  `rgb(34,38,42)` = `--blaek` · ingen kasse · radius 0. Alle 102.
- **Nul `<button>`, nul `<label>`, nul `<summary>`, nul `<input>`.** Indekset har intet at
  betjene — hvilket bekræfter Read, ikke Operate.
- **101 af 102 er under 44 px høje.**

### 5.1 Fladens egentlige fejl: rækkens emne kan ikke skelnes fra rækkens indhold

Kolonne 1 er **producenten** — rækkens emne, og den akse, tabellen er sorteret på.
Kolonne 4 er **modellerne** — rækkens indhold. De er trykt fuldstændig ens, og kolonne 4 er
836 px af tabellens 1.352 (**62 %**) og bærer 77 af de 102 links.

Konsekvensen er målbar i ekstremerne: DEEP Robotics og GENISOM AI har 9 modeller hver,
Unitree 13. På de rækker er producentnavnet ét link mod tretten identiske ved siden af.
**Emnet drukner i sit eget indhold**, og det gør det uden at ét eneste element er forkert
formet — de er bare alle formet ens.

### 5.2 Og de to flader modsiger hinanden om, hvad et robotlink er

| Link til en robotside | Grad | Understreget | Farve |
|---|---|---|---|
| På **indekset** (`td.prod-navne a`) | 15 px | **ja** | `--blaek` |
| På **undersiden** (`.kort__navn a`) | 17 px | **nej** | `--blaek` |

| Link til en producentside | Grad | Understreget | Farve |
|---|---|---|---|
| På **indekset** (`td a`) | 15 px | ja | `--blaek` |
| På **undersiden** (`.pnavn`) | 16 px | ja | `--blaek` |

Samme destination, to former, samme flade. Der findes ingen regel, der siger, hvad en
understregning betyder her — den er en tilfældighed, arvet fra to forskellige komponenter.
**Det er katalogsidens F1-sygdom i Read-modens udgave:** dér var seks kontroller i seks
visuelle sprog; her er tre linkroller i tre former, uden at formen betyder noget.

### 5.3 Undersidens største element er ikke om producenten

**"Alle 25 producenter" fylder 1.719,6 px på hver eneste af de 25 undersider** — 54,2 % af
Unitrees side, **65,3 % af RIVRs**. På RIVR får producentens ene model 411 px; listen over de
andre 24 får 1.720. **Fire gange så meget side bruges på at gå væk som på at blive.**

Og listen er en dårligere udgave af indekset, som står ét klik væk i topbaren:

| | Producentindekset | "Alle 25" på undersiden |
|---|---|---|
| Rækkefølge | **Alfabetisk** (efterprøvet) | **Ikke alfabetisk** (efterprøvet) |
| Bærer land | ja | ja |
| Bærer modeltal | ja | ja |
| Bærer **modelnavnene** | ja (77 links) | nej |
| Tallets placering | **klods op ad navnet** (kolonne 3 af 4) | ~1.000 px ude til højre |
| Antal gengivelser i bygget | 1 pr. sprog | **25 pr. sprog** |

**Rækkefølgen er ikke besluttet af nogen.** Alle 25 undersider har samme rækkefølge (målt: 1
unik rækkefølge over de 25), men den er hverken alfabetisk eller efter størrelse. Mekanismen:
`build.mjs:282` bygger `producenter` som en `Map` over `robotter`, og `robotter` er sorteret
på **robottens** navn (`build.mjs:276`). Rækkefølgen er altså *"producentens alfabetisk
første modelnavn"* — Unitree først, fordi "A1" er katalogets første robotnavn. Det er et
biprodukt af en datastruktur, ikke et valg.

**Og tallets placering er den fejl, indekset allerede har fået rettet.** JPK's beslutning
1. sep (`spor/prodindeks`) flyttede modeltallet ind **før** navnene, netop for at løse
"13-og-1-problemet": *"Med tallet som anker læses begge rækker rigtigt: '13 A1, A2-W, …' er
en optælling, og '1 Spot' er en KOMPLET liste, ikke en række der mangler noget."*
Undersidens liste står stadig med tallet ~1.000 px ude til højre — **den rettede flade er
kopieret 50 gange i sin uretttede form.**

---

## 6. Hvad der skal blive, som det er

**6.1 Der er ingen købsknap, og der kommer ingen.** Målt: `.knap` = **0** på begge
producentflader (katalog 136, robotside 70, 404 1). Nul `<button>`, nul `<input>`, nul
`<form>`. Fladen har i dag den reneste mulige overholdelse af hård begrænsning 1, og det er
ikke et tilfælde, der skal opdages igen — det skal stå skrevet. **Producentsiden er
webstedets farligste sted for reglen, fordi den handler om ét firma.** Ingen "besøg
producentens hjemmeside", intet logo, ingen kontaktlinje, ingen leveringstid.

**6.2 CE vises som "oplyst / ikke oplyst", aldrig som "har / har ikke".** L25's regel står i
filens hoved med sin begrundelse (MAB Robotics er polsk og skriver intet om CE, fordi det er
en selvfølge for dem). **Forslag P1 nedenfor rører den ikke** — den tredje tilstand hedder
*"producenten oplyser, at der ikke er CE"*, ikke *"har ikke CE"*, og ordlyden findes allerede.

**6.3 Kortet.** Urørt, jf. afsnit 3.

**6.4 `producentSaetning()`s form.** Ét tal, en nøgtern konstatering, aldrig en dom, og
landet fundet ved løb over data ved byggetid frem for skrevet i hånden. Den er fladens
bedste element og er skrevet med D7/L30-fælden i hovedet. **Formen genbruges af P1.**

**6.5 Hjemstedets tre tilstande.** `hjemstedAf()` gætter aldrig en by, og *"ikke oplyst"*
tegnes som en tilstand. Bliver stående uændret.

---

## 7. Briefet (impeccable shape, fase 3)

**Ingen interview-runde var mulig.** Jeg er subagent uden `AskUserQuestion` og uden vej til
JPK; `context.mjs`' `AUTONOMY_DIRECTIVE_CHECK` kræver et forsøg, før antagelser erstatter
svar, og forsøget kan ikke stilles herfra. **Antagelserne er derfor mærket som antagelser**,
og de tre, der kræver JPK, står i afsnit 10 frem for at blive afgjort her.

**1. Job og publikum.** Den nysgerrige fagperson (PRODUCT.md's primære) ankommer fra en
robotside eller fra topbarens "Producenter" og vil vide, hvem der står bag, og hvor stor en
del af feltet de er. Den tekniske indkøber (sekundær) ankommer for CE-opgørelsen. **MODE:
Read** på begge flader.

**2. Resultat og bevis.** Succes: læseren kan sige, hvor mange modeller producenten har i
kataloget, hvorfra de kommer, **og hvad producenten oplyser om CE — i tre tilstande, ikke
én** — og kan citere det tal videre. Beviset er data, der allerede findes: 77 YAML-poster med
1.111 kildebelagte tal.

**3. Den valgte retning.** TYPESKILT, uændret. Fladens strukturelle tese: **producentsiden er
en optælling, ikke en profil.** Alt, hvad den siger, er et tal, vi har regnet over kataloget —
og derfor skal dens største element være **fundet**, ikke firmanavnet.

**4. Omfang og grænser.** Planlægning. Ingen kode, ingen CSS, ingen skabelonændring i dette
spor. Urørt: kortet, billedledet, topbaren, `retur`, de fire datatilstande, `hjemstedAf()`,
`producentSaetning()`s form, L25's CE-ordlyd. **Anti-mål:** ingen ny komponent, ingen ny
farve, ingen ny knap, intet element der kan læses som en anbefaling af producenten.

**5. Tilstande og spænd, målt.** Modeller pr. producent: **1 til 13** — og **10 af 25 har
præcis 1**. CE pr. producent: 1 med "ja" (ANYbotics 2/2), 1 med dokumenteret "nej" (Xiaomi
1 af 2), **23 helt tavse**. Hjemsted: 19 oplyst, 6 ikke oplyst. Land: 25 af 25 oplyst.
Latent utegnet tilstand: `renderIndeks()`s `antalDel = ''` giver en **tom celle**, hvis
`p.antal === null` — nås ikke i dag (målt: 0 tomme celler), men koden findes.

**6. Interaktion og layout.** Ingen interaktion ud over links; ingen JavaScript. Hierarkiet
skal vende: fundet før firmanavnet. Responsivt: modelkolonnen falder væk under 900 px
(besluttet), kortnettet går 5 → 2 kolonner ved 390 px (målt).

**7. Begrænsninger og åbne beslutninger.** Se afsnit 2 og afsnit 10.

---

## 8. Forslagene

Mærket **(a)** = udfører en truffet beslutning · **(b)** = ny beslutning, der skal træffes.

### P1 — EU-sætningen får de tre tal, koden allerede regner **(a/b)**

**(a)** for delen "vis det, `ceOpgoerelse` regner"; **(b)** for ordlydens endelige form.

**I dag** på alle 25 sider: én sætning, to tal — *"{ja} af {i_alt} robotter i kataloget
oplyser CE-mærkning fra producenten."* 24 af de 25 sider siger *"0 af N"*.

**Foreslået:** sætningen bærer de tilstande, der faktisk forekommer hos denne producent, med
de tre eksisterende, færdigoversatte nøgler `eu_ce_ja` / `eu_ce_nej` / `eu_ce_ikke_oplyst`,
og med **den visuelle tilstandsgrammatik, siden allerede har** (`v-tal` / `v-nej` / `v-ikke`)
— ikke som ny form, men som den samme form, robotsiden bruger på præcis dette felt.

**Hvad der ikke må ske:** en tilstand med 0 forekomster må ikke tegnes som en tom rubrik
(det ville være begrænsning 5 med omvendt fortegn). Regel: **en tilstand vises, når den
forekommer; forekommer den ikke, nævnes den ikke.** For 23 af 25 producenter er der derfor
fortsat kun én tilstand at vise, og deres side bliver ikke tungere.

**Hvorfor:** fladen er det eneste sted, CE opgøres pr. producent. Der er intet "ét klik væk".

**Acceptkriterium:** `grep -c 'v-nej' dist/da/producenter/xiaomi/index.html` går fra **0** til
**≥1** · sætningen på de 23 tavse producenter har uændret antal tilstande · ingen ny i18n-nøgle
oprettes (de tre findes, målt i både `da.json` og `en.json`).

### P2 — `ceOpgoerelse()` erstattes af den delte `ceTilstand()` **(a)**

Ren oprydning, men den hører her, fordi P1 bygger oven på klassifikationen. `side.mjs:1634`
`ceTilstand()` er sandheden; katalogsiden kalder den to gange; `producent.mjs` skriver den af.
De to divergerer allerede latent på strengen `"nej"` (afsnit 4.4).

**Acceptkriterium:** `grep -c 'ceOpgoerelse' tools/skabelon/producent.mjs` går fra 2 til 0 ·
`ceTilstand`-kaldere går fra 2 til 3 · EU-linjen på alle 25 sider er uændret **bortset fra**
P1's tilføjelse (diff pr. side efterprøves, ikke antaget).

### P3 — En linkgrammatik for fladen, Read-modens svar på katalogets F1.1 **(b)**

Katalogplanens F1.1 gav Operate-fladen tre kontrolslags med hver sin form. **Read-fladen har
ingen kontroller — den har kun links, og de har tre roller:**

| # | Rolle | Hvad den gør | Klasser i dag |
|---|---|---|---|
| 1 | **Ind i emnet** | fører til en robotside — det, siden handler om | `.kort__navn a` (17 px, ikke understreget) · `td.prod-navne a` (15 px, understreget) |
| 2 | **Til et sideordnet emne** | fører til en anden producent | `.pnavn` (16 px, understreget) · indeksets `td a` (15 px, understreget) |
| 3 | **Ud af emnet** | tilbage til kataloget | `.retur a` (15 px, `--blaek2`, ikke understreget) |

**Reglen:** hver rolle har **én** form, og den er ens på indekset og undersiden. Rolle 1 og 2
må ikke dele form på nogen af de to flader — det er 5.1's fejl, og den kan kun lukkes af en
regel, ikke af en enkeltrettelse.

**Acceptkriterium:** antal visuelle signaturer blandt klikbare i `<main>` går fra **1 → 2**
på indekset (rolle 1 og 2 skilles) og fra **3 → 3** på undersiden, men **de tre er de samme
tre** på begge flader · `td.prod-navne a` og `.kort__navn a` har samme signatur ·
`td a` (kolonne 1) og `.pnavn` har samme signatur.

### P4 — Fladens to egne sætninger sættes i Literata (udfører L80) **(a)**

**Målt: producentfladen er 100 % Saira.** `--manual` (Literata) bruges 8 steder i CSS — 5 på
sammenligningssiden (`.saml-noegle__stam`, `.saml-tegn__tekst`, `.saml-hjoerne__note`,
`.saml-vinderregel`, `.saml-fotoophav`) og 3 på katalogsiden (`.sorter__note`,
`.facet-omfang`, `.chip-fod`) — og **nul** her.

Fladen har præcis to sætninger i **vores egen stemme**: `producent-fordeling` på indekset
(*"14 af 25 producenter er fra Kina og står for 62 af de 77 modeller i kataloget."*) og
`eu-fund-linje`s påstandsdel på de 25 undersider. Begge er vores slutninger, ikke
producentens data. L80: *"Saira til maskinen, Literata til mennesket"*, og *"de 8 nuværende
brug beholdes **og udvides**"*. Robotsideplanens P3 udfører den samme udvidelse på sin flade.

**Tallene bliver i Saira.** `.eu-fund-tal` bruger `var(--mono)`, som siden MANIFEST er Saira
med tabulære cifre. Kun sætningen skifter, ikke figuren — det er hele pointen med de to
skrifter.

**Acceptkriterium:** `--manual`-brugssteder i CSS går fra 8 til 10 · Literata-forekomster på
producentfladen går fra 0 til 2 klasser · `.eu-fund-tal` er uændret Saira.

### P5 — Producentnavnet forlader `.t-hero` **(b)**

**Målt h1 på alle seks flader ved 1440 px:**

| Flade | Klasse | Grad |
|---|---|---|
| Katalog | `.aabning__titel` | 44 px |
| Producentindeks | `.t-h1` | 46 px |
| Sammenligning | `.t-h1` | 46 px |
| **Producentunderside** | **`.t-hero`** | **76 px** |
| Om os | `.t-hero` | 76 px |
| Robotside | `.t-hero` | **84 px** |

**Et firmanavn er sidens næststørste typografi på hele webstedet.** Det er også det første,
den besøgende møder på alle 25 sider, og det står alene — uden et tal, uden en tilstand, uden
et fund.

**Argumentet er ikke smag, det er hård begrænsning 1.** Reglen er, at siden *"aldrig må kunne
læses som salgskanal"*. Et firmanavn sat i sidens største display-grad, alene og øverst, er
den mest brand-side-agtige komposition, fladen overhovedet kan have — og den findes 50 gange
i bygget. Robotsidens 84 px er en anden sag: robotten **er** emnet, og navnet er vores
optegnelses titel. Producenten er et firma, og asymmetrien er derfor tilsigtet, ikke
inkonsekvent.

**Foreslået:** producentnavnet flytter til fladens egen grad, `.t-h1` (46 px), som er den,
indekset allerede bruger — og den frigjorte vægt går til punkt 3 i Read-rækkefølgen: hvad vi
ved om producenten. **Ingen ændring af `.t-hero` selv** (den står på 103 sider); ændringen er,
hvilken klasse `producent.mjs:174` vælger.

**Modargument, der skal skrives frem:** de to Read-flader bruger i dag samme klasse, og at
skille dem kan læses som inkonsekvens. Modsvaret er, at de to flader **ikke har samme emne**,
og at begrænsning 1 kun gælder den ene.

### P6 — Kildeleddet: fladen viser kun regnede tal og bærer nul kildemærker **(b, og den er delt)**

**Målt:** `kildemaerke` = **142** elementer på kataloget, **1.545** på 72 robotsider, 2 på
Om os — og **0** på begge producentflader. Samtidig er **hvert eneste tal på fladen** noget,
vi har regnet: "Modeller i kataloget: 13", "0 af 2", "13 modeller", "14 af 25 producenter…",
"Alle 25 producenter", og indeksets antalkolonne.

PRODUCT.md's positionering nr. 1: *"Hvert tal har en kilde og en hentedato … en journalist,
der citerer ét tal, skal kunne belægge det lige så let som en indkøber."*

**Dette forslag foreslår ikke en løsning.** Det siger, at **producentfladen er det sted, hvor
katalogplanens åbne punkt 4 bider hårdest**, og at de to er den samme beslutning:

> Katalogplanen, åbent punkt 4: *"'Regnet' mod 'oplyst' som fjerde tilstand er foreslået,
> ikke formgivet. Den rører hård begrænsning 5 og skal formgives sammen med de tre
> eksisterende, ikke ved siden af."*

**Producentfladen er den eneste flade, hvor *alle* viste tal er regnede.** Bliver "regnet"
formgivet, er det her, formen skal prøves først. Bliver den ikke formgivet, står fladen
tilbage som webstedets eneste indholdsflade uden ét eneste kildeled.

**Ingen acceptkriterium — forslaget er en henvisning, ikke en rettelse.**

---

## 9. SYSTEMÆNDRING

Alle tal målt i `dist/da` (**107 sider**: katalog 1 · prodINDEKS 1 · prod-underside 25 ·
robot 77 · sammenligning 1 · om 1 · 404 1) i denne worktree, med eksakt klasse-token.

| Forslag | Rører | Andre skærme | Pris dér |
|---|---|---|---|
| **P1** EU-sætningens tre tilstande | `.eu-fund-linje`, `.eu-fund-tal`, `v-nej`/`v-ikke`/`v-tal` | `.eu-fund-*`: **25/25 prod-undersider og ingen andre**. `v-*`: robotsiden (den fulde optegnelse) og kataloget | **Ingen på `.eu-fund-*`.** `v-*` genbruges uændret — P1 tilføjer ingen regel, den *bruger* en eksisterende. Hvis en ny regel alligevel bliver nødvendig, skal den scopes til `.eu-fund-linje`, ellers rammer den robotsidens 33 rækker |
| **P2** `ceTilstand()` deles | `producent.mjs` (kode), `side.mjs` (uændret) | `ceTilstand` har 2 kaldere i dag (`katalog.mjs:1105`, `:1459`) | **Ingen visuel.** Men EU-linjens tal skal diffes pr. side før/efter — divergensen på strengen `"nej"` er latent, og en "oprydning", der flytter et tal, er ikke en oprydning |
| **P3** linkgrammatikken | `.pnavn`, `td.prod-navne a`, `.kort__navn a`, `.retur a` | `.pnavn`/`.pland`/`.pantal`: **625/25, prod-underside kun**. `td.prod-navne`: **prodINDEKS kun**. **`.kort__navn a`: også kataloget (86)**. **`.retur`: 25 prod + 77 robot + 1 sammenligning = 103 sider** | **`.kort__navn a` og `.retur` er de dyre.** Rører grammatikken dem, rammer den katalogets 86 kort og 103 siders returlink. **Anbefaling: grammatikken beskriver dem og ændrer dem ikke** — kun de producent-egne klasser flyttes ind i formen |
| **P4** Literata på to sætninger | `.producent-fordeling` (**1/1**, prodINDEKS kun) · `.eu-fund-linje span` (**25/25**, prod-underside kun) | ingen | **Ingen.** Begge klasser er producent-egne. Det er planens billigste forslag |
| **P5** navnet forlader `.t-hero` | `producent.mjs:177`s klassevalg | `.t-hero` står på **103 sider** (25 prod + 77 robot + 1 om). `.t-h1` på 3 (prodINDEKS, sammenligning, 404) | **Ingen — hvis ændringen er klassevalget.** Ændres `.t-hero`s egen regel i stedet, koster det robotsidens 77 h1'er og Om-siden, og det modsiger robotsideplanen. **Rør ikke `.t-hero`** |
| **P6** kildeleddet | intet i dette spor | — | henvisning til katalogplanens åbne punkt 4 |
| **5.3** "Alle 25" på undersiden | `.prodliste`, `.pnavn`, `.pland`, `.pantal` | **prod-underside kun** (25/25 og 625/25) | **Ingen anden skærm.** Men det er en indholdsbeslutning, ikke en designrettelse — se afsnit 10 |

**Komponenter, planen bevidst ikke rører, og hvad de ville have kostet:**

| Komponent | Spredning | Hvorfor ikke |
|---|---|---|
| `kort` | katalog 86 · prod-underside 77 | K.1 er truffet; afsnit 3 |
| `billedled` | katalog 86 · prod 77 · robot 77 · 404 1 | L78 |
| `stans` | **alle seks flader** | ingen anledning |
| `figur` | prodINDEKS 26 · prod-under 650 · robot 122 · om 7 | tallene bliver, som de er |
| `etiket` | katalog 2 · prod-under 76 · robot 1.144 · om 5 | ingen anledning |
| `sektion` / `sektion-hoved` | alle flader | ingen anledning |
| `net` | katalog 3 · prod-under 26 · robot 1 | kortnettet er uændret |
| `maerke` | **robotside kun** (360/77) | katalogplanens F1 sagde det samme: konvergensen er robotsidens |

---

## 10. Åbne punkter, som en bygger ikke må opfinde selv

1. **"Alle 25 producenter" på undersiden er en indholdsbeslutning og kræver JPK's ord.**
   Målingen er entydig (1.719,6 px, 54–65 % af siden, 25 gengivelser pr. sprog, ikke-alfabetisk
   rækkefølge ingen har valgt, og tallet placeret som den form, JPK selv fik rettet på
   indekset). **Min anbefaling:** afsnittet er navigation og hører i navigationens form —
   enten som en kort række søskendelinks uden land og tal, eller helt væk, fordi topbaren
   allerede fører til indekset. **Men det fjerner en synlig sektion**, og katalogplanens
   punkt 1 satte præcedensen: den slags afgøres ikke af en fladeplan.
2. **P1's endelige ordlyd.** Nøglerne findes og er oversat, men rækkefølgen og
   sammensætningen af de tilstande, der faktisk forekommer, er en tekstbeslutning. L25's
   grænse er hård: *oplyser* — aldrig *har*.
3. **P5 rører sidens første indtryk på 25 sider** og er den mest synlige enkeltændring i
   planen. Argumentet er hård begrænsning 1, men dommen er JPK's.
4. **Katalogsidens `eu_pointe` er faktuelt forkert, og rettelsen er ikke min.** Se afsnit 11.
5. **Den utegnede tomme antalcelle** (`renderIndeks()`, `p.antal === null`) nås ikke i dag.
   Skal den tegnes som *"ikke oplyst"*, er det begrænsning 5, ikke en tom `<td>` — men det
   kræver, at tilstanden overhovedet kan opstå, og det kan den først, når
   `data/manufacturers/` ikke længere er tom.

---

## 11. Modsigelser og fund, der rører de andre tre planer

**11.1 Katalogsiden siger et forkert tal om producenter, og det er min flades emne.**
`katalog.mjs:1459` sender `eu_pointe` **robottal** ind i en sætning om **producenter**:

```
n = robotter.filter(r => hjaelp.ceTilstand(r) === 'ikke_oplyst').length   // 74
m = alle = robotter.length                                                // 77
```

Bygget siger derfor på katalogsiden: **"74 af 77 producenter oplyser intet om CE."**
Der er **25** producenter. Målt pr. producent er det rigtige tal **23 af 25** helt tavse
(1 med "ja", 1 med et dokumenteret "nej" på én af to modeller).

Det er ikke opfundne tal (begrænsning 2), men det er et navneord, der ikke passer til sit tal,
på en side, hvis hele positionering er, at en journalist skal kunne citere ét tal isoleret.
**Rettelsen hører i katalogsidens plan**, ikke her — men tallet, der skal ind, kan kun regnes
over producenter, og det er min flades regnestykke. **De to planer skal afgøres sammen.**

**11.2 Katalogplanens åbne punkt 4 og min P6 er den samme beslutning.** "Regnet" mod "oplyst"
som tilstand. Producentfladen er den eneste, hvor 100 % af tallene er regnede, og derfor det
rigtige sted at prøve formen først.

**11.3 Robotsideplanens P3 og min P4 er den samme udførelse af L80** på to Read-flader.
De skal ikke afgøres hver for sig — hvis Literata udvides på robotsiden og ikke her, får de
to Read-flader hver sin stemme, og det er præcis det, L80 skulle lukke.

**11.4 Katalogplanens F1.1-grammatik og min P3 er søskende, ikke konkurrenter.** F1.1 ordner
**kontroller** på en Operate-flade; P3 ordner **links** på en Read-flade. De deler ét element:
`.kort__navn a`, som står på begge flader (86 + 77). **Den må kun have én form**, og
katalogets version skal vinde, fordi den er den, flest kort bærer.

**11.5 Fladen har arvet fire forældreløse ting fra den slettede forside (L72)** — K.1 fandt
den første; jeg har målt tre til:

| Arvegods | Eneste forbruger i dag |
|---|---|
| `side.mjs:1827 kort()` | `producent.mjs:251` (K.1's fund, genmålt: holder) |
| i18n `forside_eu_tal`, `forside_eu_paastand` | `producent.mjs` |
| CSS `.eu-fund-linje`, `.eu-fund-tal` | prod-underside, 25/25 |
| i18n `eu_ce_ja`, `eu_ce_nej`, `eu_ce_ikke_oplyst` | **ingen** — færdigoversat, nul kaldere |

Tre af de fire peger stadig på forsiden — i nøglenavnet (`forside_eu_*`) eller i kommentaren
over sig (`katalog.mjs:1137` og `producent.mjs`' egen note om at *"genbruge forsidens
EU-fund (forside.mjs' euFund)"*) — på en side, der ikke findes.
**Det er ikke kosmetik:** den fjerde række er ordforrådet, P1 mangler — og den ville formentlig
være fundet for en uge siden, hvis nogen havde søgt på det ord, der stadig peger på et slettet
sted.

---

## 12. Rækkefølge, hvis noget bygges

1. **P2** (del `ceTilstand`) — fundament, ingen visuel ændring, skal diffes pr. side.
2. **P1** (de tre tilstande) — planens grund til at eksistere. Bygger på P2.
3. **P4** (Literata) — billigst, nul andre skærme, udfører en truffet beslutning.
4. **P3** (linkgrammatikken) — kræver, at katalogplanens F1.1 er afgjort først, fordi de
   deler `.kort__navn a`.
5. **P5** (h1) — kræver JPK.
6. **5.3** ("Alle 25") — kræver JPK, og er den største enkeltgevinst i px.

**Ikke i denne plan:** mobilpasset (målt: 0 vandret overløb på begge flader ved 390 px,
kortnettet går til 2 kolonner, modelkolonnen falder væk — der er ingen akut mobilfejl at
melde), og de **fire** forældede tal i `producent.mjs`' egne kommentarer, som en bygger vil
snuble over:

| Linje | Kommentaren påstår | Målt 3. sep 2026 |
|---|---|---|
| 2 | *"producentsiden. 12 af dem."* | **25** |
| 6 | *"Unitree har 12 modeller i kataloget"* | **13** |
| 84 | *"producentby står på 9 af Unitrees filer"* | **0** af 13 (61 af 77 filer i alt bærer feltet) |
| 141 | *"2 modeller siger ja, 2 siger nej, 42 siger intet"* | **2 / 1 / 74** over 77 |

Alle fire var sande i en 46-robots-tid. **Et tal i en kommentar ældes tavst** — og linje 84's
tal er ikke bare forældet, det er *begrundelsen* for `hjemstedAf()`s form. Reglen er
formentlig stadig rigtig; dens bevis er det ikke. De rettes sammen med den kode, de står ved.

---

## Bilag — sådan genkøres planens browsertal

Planens browsermålinger er ikke citater fra et spor, der er væk. **Otte linjer genskaber
dem alle**, og de bærer selv vagten (`url` + `w` i svaret), så et tal fra en fremmed fane
eller en fremmed bredde er synligt i samme øjeblik.

```bash
# 1. server paa EGEN port, fra projektroden (aldrig `cd dist`)
/c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe \
  -m http.server 8144 --directory dist &

# 2. maaleren skrives i maalevaerktoejets mappe (playwright bor der, uden for repoet)
cat > C:/Praktik/websites/maalevaerktoej/prodmaal.mjs <<'EOF'
import{chromium as c}from'playwright';const b=await c.launch(),p=await b.newPage({viewport:{width:1440,height:1000}});
await p.goto(process.argv[2],{waitUntil:'networkidle'});
console.log(await p.evaluate(()=>{const s=[...document.querySelectorAll('main section,main header')].map(x=>x.className+' '+Math.round(x.getBoundingClientRect().height*10)/10);
const a=[...document.querySelectorAll('main a,main button,main label,main summary,main input')];
const g=new Set(a.map(x=>{const y=getComputedStyle(x);return[y.fontSize,y.fontWeight,y.textDecorationLine,y.color,y.backgroundColor,y.borderTopWidth].join('|')}));
return JSON.stringify({url:location.href,w:innerWidth,sektioner:s,klikbare:a.length,signaturer:g.size,sidehoejde:document.documentElement.scrollHeight})}));
await b.close();process.exitCode=0;
EOF

# 3. koer (fra maalevaerktoejets mappe). Git Bash har IKKE node paa PATH.
"/c/Program Files/nodejs/node.exe" prodmaal.mjs http://localhost:8144/da/producenter/rivr/
"/c/Program Files/nodejs/node.exe" prodmaal.mjs http://localhost:8144/da/producenter/
```

**Svaret, målt 3. sep 2026 — det er de tal, planen bruger:**

```
RIVR    {"url":".../da/producenter/rivr/","w":1440,
         "sektioner":["producent-top 150","sektion 170.4","sektion 410.8","sektion 1719.6"],
         "klikbare":26,"signaturer":3,"sidehoejde":2632}
INDEKS  {"url":".../da/producenter/","w":1440,
         "sektioner":["sektion 1341.3"],
         "klikbare":102,"signaturer":1,"sidehoejde":1654}
```

**Sådan læses det, hvis noget er galt:** afviger `url` eller `w` fra det, du bad om, har en
anden proces flyttet browseren eller serveren — forkast tallet. Er `signaturer` på indekset
**større end 1**, er P3 helt eller delvist bygget. Er den fjerde sektion på RIVR ikke
**1719,6**, er 5.3 afgjort. `process.exit()` bruges ikke: filen har lavet et netværkskald,
og libuv-fælden giver da exit 127 på denne maskine.

**Og `node tools/build.mjs` skal have kørt først.** Uden `assets/fotos/fabrikant/` (610
filer, gitignoreret) stopper bygget med 76 R18-fejl, og `dist/` skrives ikke — så måler du
et fravær og tror, du måler en flade.
