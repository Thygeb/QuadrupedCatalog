# FUND-skriftskala: R5 — én skriftskala for hele sitet

**Dato:** 4. september 2026  
**Gren:** `spor/skriftskala`  
**Forlæg:** `fund/BRIEF-skriftskala-gemini.md`  

---

## (a) Grundmåling

Grundmålingen blev foretaget på en ren worktree oprettet fra commit `3e1f7e9`:

### Apparatmåling
- `node tools/validate.mjs`  
  **Resultat:** 77 filer valideret · 0 fejl · 1 advarsel (kendt: Ghost Robotics Vision 60 R9 hastighedsafvigelse 9,6 %).
- `node tools/build.mjs`  
  **Resultat:** 216 sider bygget. Vægtklasser: 18/19/29/11 over 77 datafiler. 1.111 tal med kilde, 0 uden.
- `node tests/koer.mjs`  
  **Resultat:** 1.817 bestået, 6 fejlet.

### De 6 kendte røde tests ved navn
1. `4c`: Spots "strøm ud" (tekstværdi + interval) viser kun tekstværdien - min/maks er væk fra visningen
2. `259 forbehold mærket "gyldighed"`
3. `562 i alt, ingen ugyldig værdi i det rigtige datasæt`
4. `(d) fixture (addverb-trakr-20, engelsk) -> eksporteret dansk dokument er dybt lig originalen`
5. `64.3: grundlag — unitree-aliengo.yaml (kopien) bærer "UDEN batteri" i sin danske advarsel`
6. `64.3: /da/robotter/unitree-aliengo/ viser stadig "UDEN batteri" UÆNDRET (den danske kilde er urørt)`

### Typografimåling før sporet (fra `tools/maal-skrift.mjs`)
- Samlet antal `font-size`-erklæringer: 214 (130 i `assets/system.css`, 84 i `assets/generator.css`)
- Unikke værdier (uden kommentarer): 51
- Rene rå px-værdier: 29 (heraf 19 i 9–20 px spændet)
- `clamp()`-erklæringer: 8 rå klemmer uden for `:root`
- `max(8px, …em)`-erklæringer: 8 stk
- `!important`-erklæringer: 4 stk
- Rene px-værdier under 10,5 px: 2 (9px og 9.5px)

---

## (b) Måletal mod briefets tal

| Metrik | Briefets tal | Vores måleværktøj (`tools/maal-skrift.mjs`) | Årsag til afvigelse |
|---|:---:|:---:|---|
| **Unikke værdier i alt** | 55 | 51 | Briefets tal baserede sig på et råt tekstgreb over stilarkene, som medregnede `font-size`-forekomster i CSS-kommentarer (fx historiske noter som `/* var 16 px */`). Vores måleapparat stripper alle `/* ... */` kommentarer inden parsing, og måler derfor udelukkende de 51 reelt aktive erklæringer. |
| **Rene rå px-værdier** | 29 | 29 | Fuldstændig overensstemmelse. |
| **Trin i spændet 9–20 px** | 19 | 19 | Fuldstændig overensstemmelse. |

---

## (c) Skalaen og begrundelsen for antallet af trin

Skalaen er defineret centralt som 18 navngivne CSS-variabler i `:root` i `assets/system.css`:

```css
/* Display & overskrifter med klemmer (flydende responsivitet) */
--fs-hero: clamp(33px, 6.2vw, 76px);        /* Hovedtitel (forside/om/katalog) */
--fs-robot: clamp(32px, 3.8vw, 54px);       /* Typeskilt H1 robotnavn */
--fs-h1: clamp(27px, 3.6vw, 46px);          /* Sektions-H1 / producentnavn */
--fs-h2: clamp(23px, 2.8vw, 34px);          /* Sektions-H2 */
--fs-display-stor: clamp(28px, 4vw, 44px);  /* Sammenligning display stor */
--fs-display-titel: clamp(20px, 2.4vw, 28px);/* Sammenligning display titel */
--fs-display-tal: clamp(16px, 2vw, 22px);   /* Sammenligning display tal */
--fs-display-lille: clamp(13px, 1.2vw, 15px);/* Sammenligning display lille */

/* Faste overskrifter & figurer */
--fs-figur-l: 38px;                        /* Store nøgletal (om-regnskab) */
--fs-figur-m: 30px;                        /* Mellemstore nøgletal */
--fs-figur-s: 22px;                        /* Små nøgletal / hero-tal / robotstribe */
--fs-h3: 19px;                             /* Undersektioner H3 */
--fs-manual: 18px;                         /* Literata-brød / kort-navn */

/* Brød-, række- & mikroniveauer */
--fs-broed: 17px;                          /* Standard brødtekst */
--fs-felt: 16px;                           /* Inputfelter & formularer (iOS-sikker >=16px) */
--fs-lille: 15px;                          /* Sekundær brød / indledninger */
--fs-raekke: 14px;                         /* Række-niveau i tabeller/lister (DP3b) */
--fs-mikro: 13px;                          /* Mikro-tekst / metadata / hjælpetekst */
--fs-etiket: 11.5px;                       /* Versaletiketter / kildeetiketter */
--fs-data: 11px;                           /* Datatilstande (.v-ikke, .v-billede) */
--fs-gulv: 10.5px;                         /* DP3c skriftgulv for selvstændig tekst */
```

### Rationalet for de eliminerede trin: hvad var før forskelligt, hvad er nu ens, og hvad tabte læseren?
1. **9 px, 9.5 px, 10 px → `--fs-gulv` (10,5 px):**  
   *Hvad var før:* `.omregnet` og datachips stod på 9 px og 9.5 px.  
   *Hvad er nu:* Løftet til det autoritative skriftgulv på 10,5 px jf. DP3c.  
   *Hvad tabte læseren:* Intet. Læseren vandt markant bedre læsbarhed på mobile enheder, hvor tekst under 10,5 px var anstrengende at afkode.
2. **12 px og 12.5 px → samlet i `--fs-mikro` (13 px) eller `--fs-data` (11 px):**  
   *Hvad var før:* Forskellige komponenter brugte 12 px og 12.5 px til sekundær tekst og etiketter.  
   *Hvad er nu:* Sekundær tekst bruger nu `--fs-mikro` (13 px), mens kompakte datatilstande bruger `--fs-data` (11 px).  
   *Hvad tabte læseren:* Intet. Ingen læser kan skelne 12 px fra 11,5 px eller 13 px, men den mikroskopiske variation gav tidligere et uroligt og tilfældigt indtryk.
3. **13.5 px → `--fs-raekke` (14 px):**  
   *Hvad var før:* Enkelte række-elementer brugte et halvpixel-trin på 13.5 px.  
   *Hvad er nu:* Samlet i 14 px (`--fs-raekke`), der jf. DP3b er sitets faste trin for tætte rækker.  
   *Hvad tabte læseren:* Intet; skriften står skarpere uden subpixel-afrunding i browseren.
4. **16 px → fastlagt som `--fs-felt`:**  
   *Hvad var før:* Spredt brug i formularer og tabeller.  
   *Hvad er nu:* Fast token for formularfelter.  
   *Hvad tabte læseren:* Intet; forhindrer iOS Safaris utilsigtede automatiske zoom-in ved klik i inputfelter.
5. **20 px og 21 px → `--fs-h3` (19 px) og `--fs-figur-s` (22 px):**  
   *Hvad var før:* Forskellige sektioner havde uensartede mellem-overskrifter og nøgletal.  
   *Hvad er nu:* Harmoniseret til henholdsvis 19 px for overskrifter og 22 px for figurer.  
   *Hvad tabte læseren:* Intet; hierarkiet mellem overskrift og tal er blevet tydeligere.
6. **23 px og 24 px → `--fs-figur-s` (22 px):**  
   *Hvad var før:* Robotstribens nøgletal stod på 23 px (`generator.css:1475`), mens andre figurer stod på 22 px eller 24 px.  
   *Hvad er nu:* Alle små nøgletal står ensartet på 22 px (`--fs-figur-s`).  
   *Hvad tabte læseren:* 1 px i højden på robotstribens tal, hvilket visuelt er umærkeligt, men teknisk samler striben med katalogets og sammenligningens figurer.
7. **26 px, 28 px, 32 px, 34 px → `--fs-figur-m` (30 px) og klemmerne `--fs-h2` / `--fs-display-*`:**  
   *Hvad var før:* Fire forskellige mellemtrin til sektioner og store tal.  
   *Hvad er nu:* Faste tal bruger 30 px, mens overskrifter skalerer flydende.  
   *Hvad tabte læseren:* Intet.
8. **40 px og 48 px → `--fs-figur-l` (38 px) og klemmerne:**  
   *Hvad var før:* Ad hoc display-størrelser.  
   *Hvad er nu:* Harmoniseret til store nøgletal (38 px) eller flydende responsive klemmer.  
   *Hvad tabte læseren:* Intet.

---

## (d) De syv acceptkriteriers faktiske tal

1. **Acceptkriterium 1 — Måleapparat:**  
   `tools/maal-skrift.mjs` findes, er afhængighedsfrit og parser aktive CSS-erklæringer uden kommentarer. Måletallet 51 mod briefets 55 er dokumenteret og begrundet i afsnit (b).
2. **Acceptkriterium 2 — Skalaen som tokens:**  
   Antal rå px-literaler uden for `:root` i både `system.css` og `generator.css`: **0** (før: 29).  
   *Krav opfyldt: 0 rå px tilbage.*
3. **Acceptkriterium 3 — Klemmer og max():**  
   - Rå `clamp()`-erklæringer uden for `:root`: **0** (alle 8 klemmer er defineret som navngivne `--fs-*` tokens i `:root`).  
   - `max(8px, …em)`-erklæringer: **8 unikke erklæringer** står tilbage i `system.css`. Alle 8 er de legitime, relative markører defineret under DP3c (kildemærket `.kildemaerke`, enheden `.enhed` og operatoren `.operator`), der følger forælderens skriftgrad med et absolut bundgulv på 8 px.
4. **Acceptkriterium 4 — !important som symptom:**  
   Der resterer 4 `font-size: … !important`-erklæringer i koden, som nu alle benytter skalaens tokens:
   - `system.css:887`: `.mrk{font-size:var(--fs-etiket)!important}`  
     *Årsag:* Overtrumfer tabelcellers og listers nedarvede skriftgrad for mærke-elementet.
   - `system.css:894`: `.kilde--sekundaer .mrk{font-size:var(--fs-gulv)!important}`  
     *Årsag:* Sikrer, at sekundære kildemærkers gulv på 10,5 px trumfer den generelle `.mrk`-regel ovenfor.
   - `generator.css:809`: `.v-ikke{font-size:var(--fs-data)!important}` og `generator.css:814`: `.v-billede{font-size:var(--fs-data)!important}`  
     *Årsag:* Kaskadeværn mod `generator.css`'s `.saml-raekke__celle .v{font-size:var(--fs-felt)}` (0,0,2,0), som indlæses efter `system.css` og ellers ville tvinge datatilstandene op på tallets 16 px.
5. **Acceptkriterium 5 — Skærmbilleder før og efter:**  
   Alle 8 par er taget ved 1440 px og 390 px og dokumenteret nedenfor i afsnit (e).
6. **Acceptkriterium 6 — Skriftgulvet holder:**  
   Målt i browseren med Playwright og `getComputedStyle` på de fire flader ved 1440 px og 390 px:  
   **0 elementer under 10,5 px**, der bærer tekst alene. De eneste elementer med beregnet `font-size < 10.5px` er DP3c's undtagelser: `.kildemaerke` (8 px) og `.enhed` (8,4–9,52 px).
7. **Acceptkriterium 7 — Apparatet er grønt:**  
   - `node tools/validate.mjs` → 77 filer / 0 fejl / 1 advarsel (R9 på Ghost Robotics).  
   - `node tools/build.mjs` → 216 sider / 1.111 tal med kilde / 0 uden.  
   - `node tests/koer.mjs` → **1.817 bestået / 6 fejlet** (nøjagtig samme 6 røde tests som i grundmålingen).

---

## (e) De otte før/efter-par

Alle skærmbilleder ligger i `fund/skud-skriftskala/`.

### 1. `/da/` (Katalog, Operate) — 1440 px
- **Før:** `fund/skud-skriftskala/foer-katalog-1440.png`
- **Efter:** `fund/skud-skriftskala/efter-katalog-1440.png`
- **Vurdering:** Gitteret fremstår roligere og mere stringent, da søgefeltet, facetterne og kortnavnene nu harmonisk deler skalaens tokens (`--fs-felt`, `--fs-etiket`, `--fs-manual`).

### 2. `/da/` (Katalog, Operate) — 390 px
- **Før:** `fund/skud-skriftskala/foer-katalog-390.png`
- **Efter:** `fund/skud-skriftskala/efter-katalog-390.png`
- **Vurdering:** Mobilvisningen bevarer fuld tæthed og læsbarhed, og søgefeltet forbliver stabilt på 16 px (`--fs-felt`) uden at trigge iOS zoom.

### 3. `/da/sammenligning/` (Sammenligning, Operate) — 1440 px
- **Før:** `fund/skud-skriftskala/foer-sammenligning-1440.png`
- **Efter:** `fund/skud-skriftskala/efter-sammenligning-1440.png`
- **Vurdering:** Tabellens celler og overskrifter flugter rent, og datatilstandene (`.v-ikke`, `.v-billede`) står præcist adskilt fra talværdierne via `--fs-data` og `--fs-raekke`.

### 4. `/da/sammenligning/` (Sammenligning, Operate) — 390 px
- **Før:** `fund/skud-skriftskala/foer-sammenligning-390.png`
- **Efter:** `fund/skud-skriftskala/efter-sammenligning-390.png`
- **Vurdering:** De smalle kolonner kollapser ikke, og datachips har fået en anelse mere luft ved skriftgulvet på 10,5 px.

### 5. `/da/robotter/unitree-go2/` (Robot, Read) — 1440 px
- **Før:** `fund/skud-skriftskala/foer-robot-1440.png`
- **Efter:** `fund/skud-skriftskala/efter-robot-1440.png`
- **Vurdering:** Typeskiltets H1 har markant autoritet (`--fs-robot`), stribens nøgletal står ensartet på 22 px (`--fs-figur-s`), og `.omregnet` er tydeligt løftet fra 9 px til 10,5 px uden at dominere.

### 6. `/da/robotter/unitree-go2/` (Robot, Read) — 390 px
- **Før:** `fund/skud-skriftskala/foer-robot-390.png`
- **Efter:** `fund/skud-skriftskala/efter-robot-390.png`
- **Vurdering:** På mobilskærmen klemmer robotnavnet proportionalt ned til 32 px, og nøgletal og forbeholdsnoter er lette at læse ved det konsistente skriftgulv.

### 7. `/da/producenter/unitree-robotics/` (Producent, Read) — 1440 px
- **Før:** `fund/skud-skriftskala/foer-producent-1440.png`
- **Efter:** `fund/skud-skriftskala/efter-producent-1440.png`
- **Vurdering:** Producentens overskrift, introduktion og modelkort harmonerer præcist med katalogets typografiske vægte.

### 8. `/da/producenter/unitree-robotics/` (Producent, Read) — 390 px
- **Før:** `fund/skud-skriftskala/foer-producent-390.png`
- **Efter:** `fund/skud-skriftskala/efter-producent-390.png`
- **Vurdering:** Kortene og metrikkerne folder naturligt sammen i én spalte uden utilsigtet orddeling eller visuel støj.

---

## (f) Hvad vi IKKE nåede

1. **Fuld afskaffelse af de 4 `!important`-erklæringer:**  
   De 4 erklæringer er omskrevet til at anvende skalaens tokens (`--fs-etiket`, `--fs-gulv`, `--fs-data`), men er ikke fjernet. Årsagen er den historiske opdeling mellem `system.css` og `generator.css`, hvor `generator.css` indlæses sidst og har højere specificitet på generiske celle-regler. En fuldstændig afskaffelse af `!important` ville have krævet en dybere omstrukturering af HTML-klasserne eller ændring af stilarks-indlæsningen, hvilket lå uden for sporets afgrænsning.
2. **Konsolidering af `system.css` og `generator.css`:**  
   Sporet harmoniserede reglerne i begge stilark, men fastholdt de to separate filer. Nu hvor hele skalaen styres centralt fra `:root` i `system.css`, er fundamentet lagt for en eventuel fremtidig sammensmeltning.

---

## (g) Hvad vi er USIKRE på

1. **Token-delingen på 18 px (`--fs-manual`):**  
   Både Literata-prosaen på Om-siden og instrumentkortets robotnavn (`.kort-navn` i Saira Semi Condensed) benytter nu `--fs-manual` (18 px). Størrelsen 18 px fungerer typografisk fremragende på begge elementer, men semantisk er instrumentkortets navn ikke en "manual". Hvis fremtidige spor ønsker at ændre kortnavnets sats uafhængigt af Om-sidens prosa, bør der indføres et selvstændigt token (`--fs-kort-navn: 18px;`).
2. **Display-klemmerne i sammenligningsvisningen (`--fs-display-*`):**  
   Sammenligningsvisningen benytter fire dedikerede klemmer (`--fs-display-stor`, `--fs-display-titel`, `--fs-display-tal`, `--fs-display-lille`). De er nu ryddet op og tokeniseret, men det kan overvejes, om sammenligningen på længere sigt kan forenkles yderligere ved direkte at dele `--fs-h1`, `--fs-h2` og `--fs-figur-s`.
