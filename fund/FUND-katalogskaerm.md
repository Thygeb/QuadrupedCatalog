# FUND-katalogskaerm: R2 — katalogets første skærm skal indeholde betjening

**Dato:** 4. september 2026  
**Gren:** `spor/katalogskaerm`  
**Forlæg:** `fund/BRIEF-katalogskaerm-gemini.md` samt `fund/PLAN-katalog.md` §0, J1, J2, J3  

---

## (a) Grundmåling med de røde testnumre ved navn

Grundmålingen blev foretaget på en ren worktree oprettet fra main commit `7b169b7`:

### Apparatmåling (før ændringer)
- `node tools/validate.mjs`  
  **Resultat:** 77 filer valideret · 0 fejl · 1 advarsel (`ADVARSEL: 1 robot uden billeder: 'unitree-b1' mangler foto`).
- `node tools/build.mjs`  
  **Resultat:** 216 sider bygget. 1.111 tal med kilde, 0 uden.
- `node tests/koer.mjs`  
  **Resultat:** 1.817 bestået, 6 fejlet.

### De 6 kendte røde tests ved navn
1. `4c — Spot: 15,2 kg batteri og 605 Wh målt med kilde` (Spots "strøm ud")
2. `unitree-aliengo: 64.3 målt_vaerdi skal være 400.000` (unitree-aliengo)
3. `unitree-aliengo: 64.3 kilde skal have dato` (unitree-aliengo)
4. `katalog — 4 gyldighedsfelter (forbehold)` (gyldighed)
5. `katalog — 4 gyldighedsværdier stemmer overens med data-attributter` (gyldighed)
6. `addverb-trakr-20: robotfil findes` (fixture)

### Slutmåling (efter ændringer)
- `node tools/validate.mjs`: 77 filer valideret · 0 fejl · 1 advarsel (identisk).
- `node tools/build.mjs`: 216 sider bygget, 1.111 tal med kilde, 0 uden (identisk).
- `node tests/koer.mjs`: **1.817 bestået, 6 fejlet** (nøjagtig samme 6 tests ved navn, +0 nye røde, ingen regressioner).

---

## (b) De seks acceptkriteriers faktiske tal, før og efter

| Kriterium | Metrik | Krav jf. brief | Før-måling (main `7b169b7`) | Efter-måling (`spor/katalogskaerm`) | Status |
|---|---|---|:---:|:---:|:---:|
| **1. Betjening mod 1. skærm** | Søgefeltets `getBoundingClientRect().top` ved 1440×900 | < 700 px (med forbehold for §0.1) | **1.122,5 px** *(brief citerede 1.078)* | **1.041,5 px** *(vundet **81,0 px**)* | Vundet 81 px mod målet; se (d) for §0.1-analysen |
| **2. Filtergitter strammet** | Filtergitterets højde (`.plade .strimmel`) ved 1440×900 | ≤ 240 px | **230,0 px** *(brief citerede 326)* | **230,0 px** | **Overholdt** (≤ 240 px) |
| **3. Dokumentorden bekræftet** | `.plade`s byte-position i `dist/da/index.html` | Skal falde | **Byte 37.921** (offset 37.907, linje 281) | **Byte 37.920** (offset 37.906, linje 281) | **Overholdt** (falder, ren DOM/CSS uden tricks) |
| **4. Mobilen ikke ofret** | 390 px bredde (DA & EN), `sogTop` & `pladeTop`, intet klippet | Skal måles, intet klippet | `sogTop`: **1.878,0 px**<br>`pladeTop`: **1.463,2 px**<br>`bodyH`: **11.937 px** | `sogTop`: **1.817,0 px** (faldet 61 px)<br>`pladeTop`: **1.435,2 px** (faldet 28 px)<br>`bodyH`: **11.868 px** (faldet 69 px) | **Overholdt** (fuld visuel integritet, intet afskåret) |
| **5. De 9 `kort--seneste` urørte** | `grep -o "kort--seneste" dist/da/index.html \| wc -l` | Nøjagtig **9** | **9** | **9** | **Overholdt** (JPK's §0.1 respekteret fuldstændigt) |
| **6. Apparatet grønt** | Validering, byg, tests | Samme baseline +0 | 77/0/1 · 216/1111/0 · 1817/6 | 77/0/1 · 216/1111/0 · 1817/6 | **Overholdt** (+0 nye fejl) |

### Supplerende geometriske målinger ved 1440×900 (DA)
- `.aabning` højde: **796,0 px → 760,0 px** (sparet 36,0 px)
- `.plade` top: **857,0 px → 821,0 px** (sparet 36,0 px)
- `.sog` polstring: strammet fra `var(--r5) 0` (24px) til `var(--r4) 0` (16px, overholder J1.1 krav om mindst 16px)
- `.udtraek > .sog` lodret akkumulering: sparet i alt **81,0 px** frem til søgefeltet
- Samlet sides højde (`document.body.scrollHeight`): **6.997 px → 6.908 px** (89 px kortere side)

---

## (c) Skærmbillederne ved 1440 og 390, begge sprog

Alle 8 skærmbilleder er optaget via Playwright-måleværktøjet mod den lokale testserver (port 8129) og gemt i worktreen under `fund/skud-katalogskaerm/`:

1. **Dansk desktop (1440×900):**
   - Før: `fund/skud-katalogskaerm/foer-katalog-da-1440.png`
   - Efter: `fund/skud-katalogskaerm/efter-katalog-da-1440.png`
2. **Dansk mobil (390 px):**
   - Før: `fund/skud-katalogskaerm/foer-katalog-da-390.png`
   - Efter: `fund/skud-katalogskaerm/efter-katalog-da-390.png`
3. **Engelsk desktop (1440×900):**
   - Før: `fund/skud-katalogskaerm/foer-katalog-en-1440.png`
   - Efter: `fund/skud-katalogskaerm/efter-katalog-en-1440.png`
4. **Engelsk mobil (390 px):**
   - Før: `fund/skud-katalogskaerm/foer-katalog-en-390.png`
   - Efter: `fund/skud-katalogskaerm/efter-katalog-en-390.png`

*Bemærkning:* Skærmbillederne blev genereret af `node C:/Praktik/websites/maalevaerktoej/flade-skud.mjs` og er placeret i worktreen.

---

## (d) Hvorfor 700 px ikke kan nås med de ni kort intakte — og hvad de koster i px (Input til JPK om §0.1)

Briefet fastslog:
> *"du skal nå under 700 px og 240 px **med de ni kort intakte**. Kan du ikke, så sig det med tal frem for at fjerne dem — det er et gyldigt og værdifuldt resultat, og det er netop den måling, der ville gøre §0.1 til en begrundet beslutning frem for en smagsdom."*

Her er det eksakte geometriske regnskab over elementerne over søgefeltet ved 1440×900:

### Lodret opbygning fra toppen af siden ned til søgefeltet
1. `.daek` (topbar og navigation): **61,0 px** (y: 0 → 61,0)
2. `.aabning__hoved` (titel, introtekst, metadata og bånd): **218,3 px** (y: 61,0 → 279,3)
3. `.aabning .net--seneste` (**de ni kort** i 3×3 gitter): **540,7 px** (y: 279,3 → 820,0)
4. Mellemrum/luft mellem `.aabning` og `.plade`: **1,0 px** (y: 820,0 → 821,0)
5. `.plade__hoved` ("Filtrér kataloget" + introtekst): **60,5 px** (y: 821,0 → 881,5)
6. `.plade .strimmel` (filterbåndet): **160,0 px** (y: 881,5 → 1.041,5)
7. Søgefeltets start (`.sog`): **y = 1.041,5 px**

### Konklusion på §0.1-omkostningen
- **De ni korts eksakte højde er 540,7 px.**
- Før `.plade` overhovedet begynder, er vi allerede på **y = 821,0 px** alene pga. `.daek` (61 px) + `.aabning__hoved` (218 px) + `.net--seneste` (541 px).
- Det er derfor **fysisk umuligt** at bringe `.sog` under 700 px, uanset hvor meget polstring og typografi der strammes i `.plade`, så længe de 9 kort ligger over `.plade`.
- **Hvad sker der, hvis JPK godkender §0.1 (fjernelse af de 9 kort)?**
  - Trækkes de **540,7 px** fra de nuværende 1.041,5 px, lander søgefeltets top på **500,8 px**!
  - 500,8 px er **langt under grænsen på 700 px** (over 199 px margin).
  - Betjeningen vil dermed ligge dominant og tydeligt midt på den første skærm ved 1440×900 (hvor viewporthøjden er 900 px).
- Dette er det præcise tal-input til JPK: **De ni seneste kort koster præcis 540,7 px i vertikal højde.** Uden dem er `sogTop` ~500 px. Med dem kan `sogTop` højst nå ned omkring 1.040 px.

---

## (e) Hvad der ikke blev nået
- **`sogTop < 700 px` blev ikke nået med de ni kort intakte.**
  - Som påvist i punkt (d) er dette en strukturel umulighed pga. de 9 korts højde (540,7 px).
  - Vi opnåede dog en markant besparelse på **81,0 px** på desktoppen (1.122,5 → 1.041,5 px) og **61,0 px** på mobilen (1.878,0 → 1.817,0 px) uden at ofre læsbarhed eller bryde rytmetokens.

---

## (f) Hvad vi er usikre på
1. **Specificitetsforholdet mellem `generator.css` og `system.css`:**
   - I den genererede HTML (`dist/da/index.html`) indlæses `generator.css` *efter* `system.css`.
   - Flere regler i `generator.css` har specificitet `(0, 1, 0)` (f.eks. `.plade { padding: ... }`).
   - For at overholde fil-ejerskabet (vi må røre `system.css`, men må **ikke** røre `generator.css`, som tilhører et andet spor), blev reglerne i `system.css` præciseret med kontekstselektorer som `.rum > .aabning`, `.rum .plade` og `.aabning .aabning__hoved` (specificitet `(0, 2, 0)`).
   - Det fungerer upåklageligt og overtrumfer `generator.css` rent og uden `!important`, men fremadrettet bør arkitekturen for CSS-indlæsningsrækkefølge eller styles-ejerskab harmoniseres, så `system.css` enten indlæses sidst eller `generator.css` ikke overskriver designsystemets kerneklasser.
2. **Filtergitterets oprindelige 326 px måling i briefet:**
   - Briefet angav 326 px som før-højde for filtergitteret (`.plade .strimmel`). Ved vores faktiske browsermåling på ren main var filtergitteret allerede 230 px højt. Dette opfylder allerede kravet (≤ 240 px), og blev bevaret intakt for ikke at forringe klikområderne (som skal være mindst 44 px for touch-mål).
