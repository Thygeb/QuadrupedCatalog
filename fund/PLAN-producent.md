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
| **L72** | Forsiden er slettet; `dist/da/index.html` er kataloget | Bruges som *bevis*: fladen har arvet tre forældreløse abstraktioner fra den. Se 5.4 |
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
