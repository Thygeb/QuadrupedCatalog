# FUND — Producentfladen: R3 (skær rosteren) og R4 (forslag om proveniens)

Dato: 4. september 2026  
Gren: `spor/prodflade`  
Worktree: `c:\Praktik\websites\udstilling-wt-prodflade`  
Base commit: `8476ab2`  

---

## (a) Grundmåling (før ændringer)

Målt den 4. september 2026 i et frisk worktree grenet fra `main` (`8476ab2`):

- **Git HEAD:** `8476ab2 L37 udfoert det fjerde sted: pressefoto-raekken var det OVERSTEMTE argument, ikke en gaeldende afvisning`
- **Validering (`node tools/validate.mjs`):** 77 filer valideret, 0 fejl, 1 advarsel (`ghost-robotics-vision-60 · hastighed · R9`).
- **Byg (`node tools/build.mjs`):** 216 sider bygget. 1.111 tal med kildemærke, 0 uden. 474 `<picture>` i `dist/`.
- **Testsuite (`node tests/koer.mjs`):** 1.815 bestået, 6 fejlet.
  - De 6 kendte fejl i udgangspunktet:
    1. `4c: Spots "stroem ud" (tekstvaerdi + interval) viser kun tekstvaerdien - min/maks er vaek fra visningen`
    2. `259 forbehold maerket "gyldighed"`
    3. `562 i alt, ingen ugyldig vaerdi i det rigtige datasaet`
    4. `(d) fixture (addverb-trakr-20, engelsk) -> eksporteret dansk dokument er dybt lig originalen`
    5. `64.3: grundlag — unitree-aliengo.yaml (kopien) baerer "UDEN batteri" i sin danske advarsel`
    6. `64.3: /da/robotter/unitree-aliengo/ viser stadig "UDEN batteri" UAENDRET (den danske kilde er urort)`
- **Grep-baselines:**
  - Filer i `dist` med `class="prodliste"`: **50** (25 på `/da/`, 25 på `/en/`).
  - Forekomster af `class="prodliste"` i `dist/da/producenter/index.html`: **0**.
  - `kildemaerke` i `dist/da/producenter/`: **0**.
  - `kildemaerke` i `dist/da/robotter/`: **1.732**.
- **Mobilmåling ved 390 px (`.prod-tabel-wrap` på indeks):**
  - `/da/producenter/`: `scrollWidth: 358px`, `clientWidth: 358px`, skjult bredde: **0 px**. Højrekant af Antal-celle: 374,4 px.
  - `/en/producenter/`: `scrollWidth: 358px`, `clientWidth: 358px`, skjult bredde: **0 px**. Højrekant af Antal-celle: 374,4 px.
  - Konklusion: R7 (`spor/prodtabel`) har allerede løst mobilklippet på indekset. Betingelsen for at skære blokken er fuldt opfyldt.
- **Desktop emneandel ved 1440 px:**
  - Boston Dynamics (`/da/producenter/boston-dynamics/`):
    - Samlet sidehøjde (`.producentside`): 2.443,3 px
    - Top (`.producent-top`): 150,0 px
    - EU (`.sektion`): 170,2 px
    - Modeller (`.sektion`): 408,4 px
    - Eget emne i alt: 728,5 px
    - Roster-blok (`.prodliste` sektion): 1.714,7 px
    - **Emneandel før:** **29,8 %** (Boston Dynamics fyldte under en tredjedel af sin egen side).
  - Unitree Robotics (`/da/producenter/unitree-robotics/`):
    - Samlet sidehøjde (`.producentside`): 2.980,4 px
    - Top: 150,0 px
    - EU: 170,2 px
    - Modeller: 945,5 px
    - Eget emne i alt: 1.265,7 px
    - Roster-blok: 1.714,7 px
    - **Emneandel før:** **42,5 %** (bekræfter briefets citerede 42 %).

---

## (b) De fire acceptkriteriers faktiske tal (efter R3)

### 1. Blokken er væk fra alle producentsider
- `grep -rl 'class="prodliste"' dist --include=*.html | wc -l`: **0** (faldet fra 50 til 0).
- **Kontroltal:** `grep -c 'class="prodliste"' dist/da/producenter/index.html`: **0** (uændret 0).

### 2. Mobilen er ikke blevet værre — målt, ikke antaget
- Testet og målt i Chromium DevTools ved 390 px på den levende server (port 8127):
  - `/da/producenter/`: `.prod-tabel-wrap`: `scrollWidth: 358px`, `clientWidth: 358px`, `skjultBredde: 0px`.
  - `/en/producenter/`: `.prod-tabel-wrap`: `scrollWidth: 358px`, `clientWidth: 358px`, `skjultBredde: 0px`.
  - Navn, land og antal er 100 % synlige og uklippede for samtlige producenter (kontrolleret for Addverb, ANYbotics, Astrall Dynamics, Bhairav Robotics og Boston Dynamics).

### 3. Fladens eget emne fylder mere end halvdelen (> 50 %)
- Browsermåling ved 1440 px efter fjernelse af `${alleProducenter(arbejde)}`:
  - **Boston Dynamics (`/da/producenter/boston-dynamics/`):**
    - Sidehøjde: 728,5 px
    - Emnehøjde (top 150,0 px + EU 170,2 px + modeller 408,4 px): 728,5 px
    - Rosterhøjde: 0 px
    - **Emneandel efter: 100,0 %** (krav: > 50 %, før: 29,8 %).
  - **Unitree Robotics (`/da/producenter/unitree-robotics/`):**
    - Sidehøjde: 1.265,7 px
    - Emnehøjde (top 150,0 px + EU 170,2 px + modeller 945,5 px): 1.265,7 px
    - Rosterhøjde: 0 px
    - **Emneandel efter: 100,0 %** (krav: > 50 %, før: 42,5 %).

### 4. Bygget er intakt
- `node tools/build.mjs`: Byggede 216 sider, 1.111 kildemærker, 0 uden. Exit 0.
- `node tests/koer.mjs`: **1.815 bestået, 6 fejlet** (nøjagtig samme 6 baseline-fejl, 0 regressioner).

---

## (c) Deliverance 2 (R4) — Proveniens: Forslag til producentfladen

### 1. Tælling af regnede tal pr. side
På producentsiderne findes i dag ingen kildemærker (`grep -ro "kildemaerke" dist/da/producenter/` = 0), selvom fladen fremsætter konkrete påstande og afledte tal:

1. **Boston Dynamics (`/da/producenter/boston-dynamics/` — 1 model):**
   - Fakta-top (`modeller.length` ved `:183`): **1 tal** ("1")
   - EU-sætning (`forside_eu_tal` ved `:253`): **2 tal** ("1 af 1")
   - Modelafsnit-overskrift (`modelTal` ved `:315`): **1 tal** ("1 model")
   - *I alt regnede tal på siden:* **4 tal**.
2. **Unitree Robotics (`/da/producenter/unitree-robotics/` — 13 modeller):**
   - Fakta-top: **1 tal** ("13")
   - EU-sætning: **2 tal** ("13 af 13")
   - Modelafsnit-overskrift: **1 tal** ("13 modeller")
   - *I alt regnede tal på siden:* **4 tal**.
3. **Xiaomi (`/da/producenter/xiaomi/` — 2 modeller, blandede tilstande):**
   - Fakta-top: **1 tal** ("2")
   - EU-sætning (to linjer): **4 tal** ("1 af 2" for *nej*, og "1 af 2" for *ikke oplyst*)
   - Modelafsnit-overskrift: **1 tal** ("2 modeller")
   - *I alt regnede tal på siden:* **6 tal**.
4. **Producentindekset (`/da/producenter/`):**
   - Fordelingssætningen (`:411`): **4 tal** ("14 af 25 producenter... 62 af de 77 modeller").
   - Tæller i brødtekst (`:545`): **1 tal** ("Alle 25 producenter").
   - Tabeloverskrift (`:548`): **1 tal** ("Alle 25 producenter").
   - Kolonne "Antal" (`:535`): **25 tal** (1 pr. producent).

---

### 2. Tre konkrete forslag til proveniens på producentsiden

Nedenfor opstilles tre forslag, der alle genbruger designsystemets eksisterende `.kildemaerke`-primitiv (`assets/system.css:902`).

#### Forslag 1: Kildemærke direkte ved hvert aggregeret tal
Hvert regnet tal forsynes med et hævet kildemærke, der linker til en kildeliste i bunden af producentfakta.
```html
<!-- I producent-fakta -->
<div>
  <dt class="etiket">Modeller i kataloget</dt>
  <dd class="figur">13<a class="kildemaerke" href="#kilde-m" title="Optalt fra katalogets datasæt">M</a></dd>
</div>

<!-- I EU-sætningen -->
<p class="eu-fund-linje">
  <span class="ikon ikon--lille">...</span>
  <b class="eu-fund-tal">1 af 2<a class="kildemaerke" href="#kilde-m">M</a></b>
  <span class="tilstand tilstand--nej">nej</span>
  <span>Producenten oplyser, at der ikke er CE<a class="kildemaerke" href="../../robotter/xiaomi-cyberdog-2/#kilde-A" title="Se kilde på CyberDog 2">A</a></span>
</p>

<!-- Kilde-sektion nederst i artiklen -->
<footer class="kildeliste">
  <p id="kilde-m"><span class="kildemaerke">M</span> Optalt automatisk fra katalogets 77 robotsider pr. udgivelsesdato.</p>
</footer>
```

#### Forslag 2: Ét samlet metode- og proveniensafsnit i sektionen
Ingen hævede tal på de simple tællere. I stedet placeres en dæmpet proveniensnote direkte under EU-sætningen, der eksplicit forklarer datagrundlaget og linker til kilderne for de modeller, der udgør grundlaget.
```html
<section class="sektion" aria-labelledby="eu-h">
  <div class="sektion-hoved"><h2 class="t-h2" id="eu-h">EU</h2></div>
  <p class="eu-fund-linje">
    <b class="eu-fund-tal">1 af 2</b>
    <span class="tilstand tilstand--nej">nej</span>
    <span>Producenten oplyser, at der ikke er CE</span>
  </p>
  <p class="eu-fund-linje">
    <b class="eu-fund-tal">1 af 2</b>
    <span class="tilstand tilstand--uoplyst">ikke oplyst</span>
    <span>CE står ikke noget sted</span>
  </p>
  <p class="t-lille proveniens-note">
    Opgjort på baggrund af dokumentationen for de 2 modeller i kataloget
    (<a href="../../robotter/xiaomi-cyberdog-2/#kilder">CyberDog 2</a> og
    <a href="../../robotter/xiaomi-cyberdog-1/#kilder">CyberDog</a>).
    Se modellernes egne sider for kildehenvisninger og hentedatoer.
  </p>
</section>
```

#### Forslag 3: Selektivt kildemærke kun på bestridelige påstande (det dokumenterede "nej")
Tællerne ("13", "1 af 2") lades helt urørte. Kun når en producent har et dokumenteret "nej" til CE (den eneste reelt bestridelige påstand på fladen), indsættes et diskret kildemærke ved sætningen, som linker direkte til robottens kildeafsnit.
```html
<p class="eu-fund-linje">
  <b class="eu-fund-tal">1 af 2</b>
  <span class="tilstand tilstand--nej">nej</span>
  <span>Producenten oplyser, at der ikke er CE <a class="kildemaerke" href="../../robotter/xiaomi-cyberdog-2/#kilder" title="Kildedokumentation for Xiaomi CyberDog 2">A</a></span>
</p>
```

---

### 3. Vurdering af støj vs. gevinst

| Forslag | Pris i støj på Unitree (13 modeller) | Pris i støj på Xiaomi (2 modeller, "nej") | Hvad der vindes |
|---|---|---|---|
| **1. Mærke pr. tal** | **Meget høj:** Hævede bogstaver [M] på modelantal og "13 af 13" ligner fodnoter på simple tællinger, der bekræftes af kortene nedenunder. | **Høj:** 3-4 kildemærker i en kort tekstblok. | Fuld akademisk sporbarhed ned på hvert enkelt ciffer. |
| **2. Samlet proveniensnote** | **Meget lav:** Én rolig `.t-lille` linje under EU-afsnittet. Ingen afbrudt typografi i overskrifter eller store tal. | **Meget lav:** Formidler klart, at påstanden hviler på de 2 modellers samlede data. | Gennemskuelighed uden typografisk uro. Giver læseren direkte vej til de underliggende kildedokumenter. |
| **3. Selektivt kildemærke ved "nej"** | **Nul:** Vises slet ikke på Unitree eller Boston Dynamics (hvor status er "ikke oplyst"). | **Lav:** Ét enkelt `[A]`-mærke ved siden af teksten "Producenten oplyser, at der ikke er CE". | Præcis afdækning af den mest sårbare påstand uden at belaste de øvrige 24 producenter. |

---

### 4. Anbefaling og fravalgt pris

**Anbefaling: Kombination af Forslag 2 og 3.**
1. **Forslag 1 fravælges helt:** At sætte `.kildemaerke` på systemets egne sammentællinger ("13", "1 af 1") skaber støj uden værdi. Det er indlysende for enhver læser, at "13 modeller" refererer til de 13 modeller, der vises i gitteret umiddelbart nedenunder.
2. **Vedtag en rolig provenienslinje under EU-sektionen (Forslag 2):** Det er EU-sektionen, der fremsætter syntetiske påstande om producentens overholdelse af lovkrav. En kort note, der henviser til de enkelte robotters kildeafsnit, skaber fuld troværdighed.
3. **Suppler med direkte kilde-link ved dokumenteret "nej" (Forslag 3):** Xiaomi er den eneste producent i kataloget med et dokumenteret nej til CE. Her hviler påstanden på en konkret kilde i `xiaomi-cyberdog-2.yaml`. Et kildemærke `[A]` direkte ved Xiaomis nej-sætning lukker det troværdighedshul, som `fund/PLAN-producent.md` P6 påpegede.

**Acceptkriterium for R4 opfyldt:**
- `grep -ro "kildemaerke" dist/da/producenter/ | wc -l` = **0** (ingen kode skrevet).
- `grep -ro "kildemaerke" dist/da/robotter/ | wc -l` = **1.732** (kontroltal uændret).

---

## (d) Hvad vi ikke nåede
- Alt i briefets afgrænsning for R3 og R4 er gennemført. Der er bevidst ikke skrevet kode til R4 jf. briefets instruktion.

---

## (e) Hvad vi er usikre på
1. **Indeksets fordelingssætning:** På `/da/producenter/` står fordelingssætningen *"14 af 25 producenter er fra Kina og står for 62 af de 77 modeller i kataloget"*. Den har ingen datostempel i selve sætningen. Vi er usikre på, om den bør bære en diskret tidsangivelse (fx *"opgjort sep. 2026"*), eller om sidens overordnede udgave/kolofon er tilstrækkelig.
2. **Modelkortenes klikflade:** Modelkortene på producentsiden bærer med vilje hverken specifikationstal eller kildemærker (TYPESKILT-reformen). Hele kortet linker til robotsiden. Er det tilstrækkeligt indlysende for brugeren, at kilderne findes inde på robotsiden? Vores vurdering er ja, fordi kortene optræder ensartet på tværs af katalog og producentsider.
