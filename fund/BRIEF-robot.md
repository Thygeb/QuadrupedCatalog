# BRIEF — `spor/robot`: robotsiden i TYPESKILT-formen

Worktree `C:/Praktik/websites/udstilling-wt-robot`, gren `spor/robot`, base
`8eda364`. **Model: Opus** (L45 — dømmes med øjne). Port **8180**.

---

## 0. Grundmåling — din FØRSTE handling

Målt af orkestratoren **i din worktree** umiddelbart før afsendelse:

```
node tools/validate.mjs   → 77 filer · 0 fejl · 1 advarsel
node tools/build.mjs      → 213 sider · 1110 tal med kilde, 0 uden
node tests/koer.mjs       → 673 bestaaet · 0 fejlet
```

Kør alle tre først og skriv tallene. Afviger et tal: **STOP og rapportér.** De 77
gitignorerede fabrikantfotos og `.env` er kopieret ind.

---

## 1. Leverancen

**Byg robotsiden om til TYPESKILT-formen på den rigtige side**, begge sprog.
Forlægget er `retninger/nyverden/robot-spot.html` — den godkendte retningskontrakt
(L57), og `retninger/nyverden/` er pr. L59 projektets **eneste** retning.

Ikke en comp. Rigtig side, 77 robotter × 2 sprog. Sidetallet skal forblive **213**.

JPK har bestilt **tre konkrete ting** ud over at følge compen. To af dem er
beslutninger, han har truffet i dag, og de står i §3 og §4.

**Fra L57, som compen allerede efterlever:** tæthedsmåler-blokken (67 %-bjælken) er
**droppet** fra robotsiden. Tætheden består som begreb og som sorteringsvalg, men
måler-UI'et bygges ikke. Byg den ikke tilbage.

---

## 2. Bedre hierarki mellem overskrift og billede

JPK's ord: *"Lav bedre hierarki af overskrift og billede."*

**Compen viser løsningen** — se `robot-spot.html`: fotoet står stort i venstre
spalte med en tynd ramme og en billedtekst om ophavet; til højre står producent,
land, statusmærke og årstal på én linje, derunder navnet i stor Saira, derunder
vægtklassen, så anvendelses-chips, så et link til producentens øvrige modeller.

Følg den. **Hvis du afviger, så skriv hvorfor i rapporten** — det er en godkendt
tegning, ikke et forslag.

**Målt udgangspunkt, så du kan vise forbedringen:** på den nuværende side ved 1440
er robotnavnet ikke sidens største element, og fotoet og titlen konkurrerer.
**Mål og rapportér:** skriftstørrelsen på robotnavnet og på nærmeste konkurrerende
element, før og efter, ved 1440 og 390.

---

## 3. Omskifter mellem metrisk og imperial — BESLUTTET AF JPK I DAG

JPK's valg (L60): **omregn selv, og mærk det tydeligt.** Her er hvorfor det kræver
omhu, og hvad målingerne siger.

**Datagrundlaget, målt af mig i dag:**

- Kun **7 af 77 robotter** har imperial-tal fra producenten.
- I alt **30 `vaerdi_imperial`-felter** i hele datasættet.
- Spot har 10 imperial-visninger; Go2 og ANYmal har **0**.

**Reglen, du skal bygge:**

1. **Oplyser producenten selv et imperial-tal, vises DERES tal.** Aldrig vores
   omregning oven i en oplyst værdi. Feltet hedder `vaerdi_imperial` /
   `enhed_imperial`.
2. **Ellers omregner vi** fra det metriske og **mærker det synligt som vores
   omregning** — ikke som producentens tal. En læser skal kunne se forskel på
   *"producenten skriver 74,5 lb"* og *"33,8 kg, omregnet ≈ 74,5 lb"*.
3. **Kildemærket følger det metriske tal**, ikke omregningen. En omregning har
   ingen selvstændig kilde, og siden lover, at hvert tal har en.

**Hvorfor punkt 1 ikke bare er pedanteri:** `validate.mjs` bærer **regel R9**, som
sammenligner producentens metriske og imperiale tal og advarer ved afvigelser over
tolerancen. Den advarsel, du ser i grundmålingen, er netop den: Ghost Robotics
oplyser 2,4 m/s **og** 4,9 mph, som afviger **9,6 %**. Producentens to tal er altså
en selvstændig oplysning om producenten — den må ikke overskrives af vores regnestykke.

**Hvilke enheder skal kunne skiftes — og hvilke må ALDRIG:**

| Enhed | Antal i data | Omregnes til |
|---|---|---|
| kg | 172 | lb |
| mm | 154 | in |
| cm | 91 | in |
| m | 6 | ft |
| °C | 92 | °F |
| m/s | 58 | mph |
| km/h | 6 | mph |

**Omregnes ALDRIG** (de har ingen imperial modpart, og en "omregning" ville være
volapyk): `t` (77 — timer), `°` (52 — hældningsgrader), `DoF` (29), `Wh` (25),
`min` (12), `CNY` (6), `USD` (4). Valuta omregnes **ikke** — en vekselkurs er et tal
uden kilde og ændrer sig dagligt.

**Acceptkriterium:** i metrisk tilstand skal siden se ud **præcis** som før dit spor
for alle 77 robotter. Omskifteren må ikke ændre standardvisningen.

---

## 4. Kilderne ned i bunden — BESLUTTET AF JPK I DAG, og det omgør compen

JPK's ord: *"kilder ned i bunden."*

**Dette er en bevidst omgørelse af compen, og du skal kende den, så du ikke tror,
du retter en fejl.** Målt af mig i dag:

- **Den nuværende side:** kildelisten står **95 %** nede — altså i bunden.
- **Compen:** KILDER står **21 %** inde, lige under titlen og **før**
  specifikationerne. Commit `1fe7967` hedder ordret *"kilderne flyttes op i højre
  kolonne på robotsiden"* — designsporet flyttede dem op **med vilje**.

**JPK er forelagt konflikten og har valgt bunden (L60).** Byg det sådan. Alt andet i
compen står ved magt.

**Men sporbarheden må ikke tabes:** de hævede kildebogstaver ved hvert tal skal
stadig pege på listen, og ankrene skal virke. **Mål efter:** hvert `#kilde-<bogstav>`
skal ramme et eksisterende `id` på siden. Stikprøve 5 robotter og skriv 5/5 eller
det faktiske tal.

---

## 5. Fem ting, der ALDRIG må rulles tilbage

1. **Hvert tal skal have en kilde.** `node tools/build.mjs` melder i dag **1110 tal
   med kilde, 0 uden**, og bygget **fejler**, hvis et talfelt mangler enhed eller
   kilde (hård begrænsning 2, håndhævet mekanisk). Tallet skal være uændret.
2. **Tre tilstande skal ses** (hård begrænsning 5): "ikke oplyst", "nej" og "0" er
   forskellige ting. Fundamentet lagde de fire SVG-mærker i spriten — `i-ja`,
   `i-nej`, `i-nul`, `i-ioplyst`. Brug dem. "Ikke oplyst" i støv-blæk `#5F686F`,
   aldrig i støvgrå `#9AA3A9` (målt 2,14:1 — kun kontur).
3. **Skriftgulvet er 8 px** for al synlig tekst. `.enhed` gik engang til 5,70 px, og
   gulvet skal stå i **hvert** trin — et gulv i grundreglen alene overskrives af
   trinnet under. `tests/dele/31-pudsning.mjs` vogter det.
4. **Radius-skalaen er 0/2/6/8/12 + 99px-pillen.** 2 px er typeskiltets stansning.
5. **Forbeholdene skal blive stående.** Siden bærer 890 forbehold, hvoraf 562 er
   klassificerede med gyldighedsmærke. De er en stor del af sidens værdi — et
   redesign, der gemmer dem for at få et renere layout, fjerner grunden til, at
   siden findes.

---

## 6. Ét spørgsmål du IKKE må afgøre

**Højdelinealen (Å71)** er uafklaret — den hører til katalogfilteret, ikke din flade,
men hvis du støder på den, så lad være med at vælge. **L57 står, indtil JPK svarer.**

---

## 7. Filejerskab

**Du ejer:**

- `tools/skabelon/robot.mjs`
- `assets/system.css` — **kun** nye klasser, du selv indfører
- `data/i18n/da.json` + `en.json` — nye strenge, **aldrig hårdkodet tekst**; begge
  filer holdes symmetriske (målt i dag: 279/279)
- **ny fil** `tests/dele/36-typeskilt-robot.mjs`

**Du rører IKKE:**

- `retninger/` — retningskontrakten er arkiv
- `tools/skabelon/katalog.mjs`, `assets/katalog.js`, `assets/generator.css` —
  **`spor/katalog` arbejder i dem lige nu**
- `tools/skabelon/forside.mjs`, `producent.mjs`, `sammenligning.mjs`
- `data/robots/`, `db/`, `tools/build.mjs`, `tools/validate.mjs`

**To andre spor kører.** Holder du dig fra listen ovenfor, kolliderer I ikke.

---

## 8. Skills

Vurdér skills først og **skriv, hvilken du valgte, og hvilke du gik forbi med
begrundelse.** `frontend-design` og `impeccable` (shape/layout) er kandidaterne.
Diskstier som reserve, hvis kaldet fejler fra worktreen:

```
C:/Users/thyge/.claude/plugins/marketplaces/claude-plugins-official/plugins/frontend-design/skills/frontend-design/SKILL.md
C:/Users/thyge/.claude/skills/impeccable/SKILL.md
```

Læser du fra disk, **skriv det i rapporten.** `robotdata`-skillen er relevant, hvis
du er i tvivl om et felts betydning — den bærer 30-feltsskemaet.

**`taste-skill` må ikke følges bogstaveligt:** den råder til opfundne tal og
opdigtede firmanavne (hård begrænsning 2) og dækker efter eget udsagn ikke datatabeller.

---

## 9. Rapportform

**Højst 60 linjer:** valgt/fravalgt løsning · konfidens pr. punkt · usikkerheder ·
målinger som **tal**.

**Konfidens:** **Høj** = genkørbar kommando + tallet + **én linje om, hvad tallet
ville have været, hvis arbejdet var forkert.** Uden den linje: **middel**.

**UDEN FOR de 60 linjer, obligatorisk:** "Nye fælder og opdagelser" (skriv "ingen",
hvis ingen) og "Punkter i briefet, jeg ikke nåede".

**Læg skærmbilleder ved ved 1440 OG 390**, og skriv stierne:

```
node C:/Praktik/websites/maalevaerktoej/flade-skud.mjs http://localhost:8180/da/robotter/boston-dynamics-spot/ 1440 <fil.png>
```

Vælg mindst to robotter til skuddene: **Spot** (rig på data, har producentens
imperial-tal) og **én med mange "ikke oplyst"**, så JPK kan se, at tomheden er
formgivet og ikke ligner en fejl.

---

## 10. Fælder, andre spor har betalt for

- **CJK-tegn dækkes ikke af skrifterne.** `spor/samlcomp` målte i dag **331 CJK-tegn
  i 37 celler** i robotdataene, og hverken Saira eller Literata har dem i deres
  `unicode-range`. De falder tilbage til systemskrift. Robotsiden viser de samme
  data. **Du skal ikke løse det**, men mål hvor mange der står på dine skudte sider,
  og skriv tallet — det er en beslutning, JPK skal tage senere.
- **`≥` (U+2265) findes ikke i nogen af skrifterne.** Det kommer fra `da.json`s
  `operator_mindst` og lander på ethvert "mindst"-felt.
- **`overflow-x:auto` tvinger `overflow-y` fra `visible` til `auto`** og ødelægger
  `position:sticky` inde i beholderen — **og et fuldsides-skærmbillede kan ikke se
  det.** Bruger du klæbende elementer, så mål deres `top` i browseren.
- **`.kun-skaerm`-spans er `position:absolute`** og kan give vandret sideoverløb,
  som `body.scrollWidth` **ikke** afslører. `spor/samlcomp` fandt 214 px, der kun
  kunne ses med `window.scrollTo(500,0)`.
- **`grep` på den byggede HTML måler ikke klientside-tegnet indhold.** Mål i browser.
- **`netstat`, `tasklist`, `findstr` er IKKE på PATH i Git Bash** (exit 127 — ser ud
  som et tomt resultat). Brug fuld sti under `/c/Windows/System32/`. `taskkill /PID`
  kræver `MSYS_NO_PATHCONV=1`.

---

## 11. Miljø

- **Commit undervejs er et krav.** Ét commit pr. sammenhængende ændring. Tre spor er
  døde midtvejs de seneste dage; commit-kravet reddede arbejdet hver gang.
- **node kun med fuld sti:** `/c/Program Files/nodejs/node.exe`
- **Din port er 8180.** Aldrig 8080, 8142, 8160 eller 8170. Fra worktree-roden,
  **aldrig** `cd dist`:
  ```
  /c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe -m http.server 8180 --bind 127.0.0.1 --directory dist
  ```
- **Verificér serveren mod disken, før ét tal bruges.**
- **`sed -i` fejler TAVST med exit 0.** Brug Edit. **UTF-8 uden BOM.**
- Commit-beskeder med backticks/`$`/`%`: skriv til fil, `git commit -F <Windows-sti>`.

---

## 12. Acceptkriterier — målt mod din base af mig i dag

| # | Kommando | Giver i dag | Skal give |
|---|---|---|---|
| Kilder | `node tools/build.mjs` → "tal med kilde / uden" | **1110 / 0** | **1110 / 0** |
| Sidetal | `node tools/build.mjs` | 213 sider | **213** |
| Validate | `node tools/validate.mjs` | 77 · 0 fejl · 1 adv. | **uændret** |
| Tests | `node tests/koer.mjs` | **673 / 0** | **≥673 / 0** |
| i18n | nøgler da vs en | **279 / 279** | **symmetrisk** |
| Kilder i bund | kildelistens position i den byggede side | **95 %** | **stadig sidst** |
| Imperial | omskifter virker for alle 77 | findes ikke | **77/77** |
| Metrisk urørt | metrisk visning identisk med før sporet | — | **identisk** |

Alle tal er målt 31. aug 2026 på `8eda364`. **673 er en grundlinje, der skal stige**
med dine egne tests i `tests/dele/36-*` — skriv det faktiske tal, ram ikke mit.
**1110 og 213 skal derimod være uændrede.**

**Briefets fakta er påstande.** Jeg har taget fejl to gange i dag: om `build.mjs`'
kopiliste (ville have korrumperet ti fontfiler) og om måling af CSS-regler. **Afviger
noget, du måler, fra noget briefet påstår, så rapportér det — det er en del af
leverancen, ikke ulydighed.** Otte spor har rettet orkestratorens fakta i denne
sessionsrække; hver gang havde sporet ret.
