# FUND-uiux — UI/UX-revision af de stabile flader

**Spor:** `spor/uiux` · **Dato:** 1. sep 2026 · **Gren stod på:** `b479324`
**Skill:** `ui-ux-critique` — **kaldet lykkedes fra worktreen**, ingen disk-fallback nødvendig.

**Fravalgte skills, med begrundelse:**

- `impeccable critique` — **fravalgt efter instruks.** Den svarer på *"er det her det rigtige
  design?"*. Retningen er låst (D15, L40), så spørgsmålet er *"er det udført rigtigt?"*.
- `taste-skill` i alle former — **fravalgt.** Dens egen første linje afgrænser den til
  *"landing pages, portfolios and redesigns — not dashboards, not data tables"*, og dette site
  er datatabeller. Fire af dens afsnit bryder hårde begrænsninger 2 og 4 direkte.
- `frontend-design` — fravalgt. Den bygger; dette spor dømmer.
- `fejljagt` — **delvist brugt uden at være kaldt.** Dens kerneregel (efterprøv måleapparatet
  før tallet) er fulgt bogstaveligt og fangede to falske fund, se §0.

**Grundmåling, taget før alt andet:**

```
node tools/validate.mjs   ->  77 fil(er) · 0 fejl · 1 advarsler
node tools/build.mjs      ->  Byggede 218 sider ... 1110 tal med kilde, 0 uden
```

Begge stemmer med orkestratorens tal (77/0/1 · 218 · 1110/0). **Ingen afvigelse — intet i
denne rapport skyldes et skævt udgangspunkt.**

**Serververifikation.** Egen port 8164. Serveren er efterprøvet mod disken med md5 på tre
filer, ikke med en grep-streng:

```
md5sum dist/system.css dist/generator.css dist/404.html
curl -s http://localhost:8164/system.css | md5sum      # b644bf15b1ff8c05f5117a2248412b27
curl -s http://localhost:8164/generator.css | md5sum   # cb4317667231463672b9bf09696a76b1
curl -s http://localhost:8164/404.html | md5sum        # a3e3bf2d1a3905742ec7456d901f572e
```

Alle tre identiske med disken. Fire fremmede servere kørte samtidig; ingen af deres tal er
havnet her.

---

## §0. To fund jeg måtte trække tilbage — læs dette først

Begge var på vej til at blive alvorlige fund. Begge var **måleapparatets fejl, ikke sidens.**
De står her, fordi en rapport, der kun viser de fund der overlevede, skjuler hvor let de
tal kunne have været forkerte.

### 0.1 "77 elementer uden fokusring" — FALSK, instrumentfejl

Min første fokusmåling brugte `el.focus()` fra script og rapporterede, at **77 af 111**
fokuserbare elementer på producentindekset manglede synlig fokusring.

**Det var forkert.** `el.focus()` fra script udløser ikke `:focus-visible` på links i
Chromium — kun rigtig tastaturnavigation gør. Målt om med rigtige Tab-tryk:

```
node <scratch>/uiux-fokus.mjs --selvtest        # FOKUS-SELVTEST OK: 4/4
node <scratch>/uiux-fokus.mjs 1440 /da/producenter/ /da/producenter/boston-dynamics/ \
     /da/om/ /da/404.html /404.html
```

Resultat: **169 tab-stop over fem sider, 0 uden synlig fokusring.** Se §6 — det er et af
sidens stærkeste punkter, ikke et fund.

### 0.2 "Hård begrænsning 5 er brudt i skematabellen" — FALSK, jeg målte den forkerte node

Jeg målte `getComputedStyle` på `td.skema-v` og fandt, at "ikke oplyst", "nej", "ja" og "0"
alle gav **nøjagtig samme signatur**: `rgb(34,38,42)`, vægt 600, 14px, ingen kursiv, intet
`::before`. Det så ud som et direkte brud på hård begrænsning 5.

**Det var forkert.** Forskellen ligger ikke på `<td>`, men på et barn inde i cellen. Et
skærmbillede af sektionen afgjorde det:

```
node <scratch>/uiux-elskud.mjs http://localhost:8164/da/robotter/weilan-alphadog-c500/ \
     "section.sektion.skema" <ud>.png 1440
```

Markuppen, der bærer forskellen:

| Tilstand | Markup | Ser ud som |
|---|---|---|
| ikke oplyst | `<span class="v v-ikke"><i class="mrk"></i>ikke oplyst</span>` | stiplet ramme, lille grå chip |
| nej | `<span class="v v-nej"><i class="mrk"></i>nej</span>` | udfyldt sort firkant + versal NEJ |
| nul | `<span class="v v-tal v-nul"><b class="num">0</b><span class="enhed">°C</span></span>` | almindeligt fed tal som `24 kg` |

**Hård begrænsning 5 er overholdt i skematabellen, og den er overholdt tydeligt.**
Se §7.1. Lærdommen er projektets egen: `fil:linje` og en computed-style beviser ikke,
hvad en læser ser. Kun skuddet gjorde.

---

## §1. [BLOKERER] `--accent` som tekstfarve på lys bund: 1,38:1 — under en tredjedel af kravet

**Hvor:** `assets/generator.css:1164` (producenttabellen), `assets/generator.css:1137`
(`.prodliste .pnavn`), og bredere — se listen nedenfor.
Systemniveau: gælder alle flader, også de spærrede.

**Hvad der er målt.** `--accent:#F2C400` på `--bund:#E8EBED` giver **1,38:1**.
WCAG AA kræver 4,5:1 for brødtekst og 3:1 for stor tekst. På den lysere flade `#FAFBFB`
er det **1,60:1**.

**Mekanismen står i palettens egen kommentar,** `assets/system.css:122`:

```
--accent:#F2C400;          /* afmaerkningsgul - 9,19 (gunmetal PAA gul) */
```

**9,19 er målt den anden vej** — mørk tekst *på* gult felt. Efterprøvet: gunmetal `#22262A`
på `#F2C400` giver præcis **9,19:1**. Tokenet er altså målt som *baggrund* og bruges som
*tekstfarve*. Det er ikke en smagsfejl; det er en retningsfejl i et tal, der ser
efterprøvet ud.

**Hvor det rammer en læser (målt i browseren, ikke udledt):**

| Flade | Element | Antal | Grad | Forhold |
|---|---|---|---|---|
| `/da/producenter/` · `/en/producenter/` | producentnavnene i venstre kolonne | 25 | 15px | 1,38:1 |
| `/da/producenter/<slug>/` | `.prodliste .pnavn` — modellisten | 24 | 16px | 1,38:1 |
| robotside · `.sektion.kilder` | `a.url` (kildeadresser) | 2 | 12,5px | 1,38:1 |
| robotside · `.sektion.kilder` | `span.bogstav` (A/B) | 2 | 12,5px | 1,38:1 |
| `/da/om/` · `/en/om/` | `a.kildemaerke` i nøglen | 1 | 8px | 1,38:1 |
| robotside · `.stribe` *(hero — FLADEN ER I SPIL)* | `a.kildemaerke` | 5 | 8px | 1,60:1 |

**Kommandoer:**

```
node <scratch>/uiux-probe.mjs 390  /da/producenter/ /da/producenter/boston-dynamics/
node <scratch>/uiux-probe.mjs 1440 /da/om/ /da/robotter/boston-dynamics-spot/
```

Kontrastmotoren er valideret mod fire kanoniske WCAG-værdier før brug (21:1 sort/hvid,
1:1 hvid/hvid, 4,54:1 `#767676`/hvid, 8,59:1 hvid/blå) — alle ramt eksakt.

**Hvorfor det betyder noget.** På producentindekset er de 25 gule navne **sidens primære
navigation** — det er den kolonne, man scanner for at komme videre. De er sat i den eneste
farvekombination på siden, der er ulæselig. Modelnavnene i samme tabel, som er sekundære,
er derimod mørke og læsbare (`generator.css:1200` sætter `.prod-navne a` til `--blaek`).
Hierarkiet er altså vendt om: det vigtigste led er det, man ser dårligst.

**Dette forslår ikke at ændre paletten.** D15 er låst, og det skal den være. Fundet er, at
**kombinationen** er forkert, ikke farven: `--accent` fungerer som den er tænkt — som
baggrund med mørk tekst (9,19:1) eller som mærkefarve. Den mindste rettelse, der samler
flest, er at lade de seks rækker ovenfor bruge `--blaek` som tekstfarve og beholde gult
til understregning, mærke eller baggrund.

**Acceptkriterium:** `node <scratch>/uiux-probe.mjs 1440 /da/producenter/` rapporterer
**0** kombinationer under kravet mod 2 i dag, og samme kommando på
`/da/producenter/boston-dynamics/` rapporterer 1 (kun `.daek__skil`, se §5).

---

## §2. [BLOKERER] Fokusringen er den samme gule — indikatoren selv er på 1,38:1

**Hvor:** `assets/system.css:238`

```
:focus-visible{outline:3px solid var(--accent);outline-offset:3px;
```

**Hvad der er målt.** Ringen tegnes i `#F2C400` med 3px offset, altså **direkte på
`--bund` `#E8EBED`**. Forholdet mellem ring og baggrund er **1,38:1**. WCAG 1.4.11
(Non-text Contrast, AA) kræver **3:1** for den visuelle information, der identificerer en
komponents tilstand — en fokusindikator er dækket.

**Kommando:**

```
node -e "...srgb-luminans..." # accent paa bund : 1.38:1   (krav 3 for fokusring)
node <scratch>/uiux-fokus.mjs 1440 /da/producenter/   # ring: solid 3px rgb(242,196,0) off:3px
```

**Hvorfor det betyder noget.** Ringen *findes* overalt (§6) — det er gjort rigtigt.
Men den er kun synlig i kraft af sin **kulør**, ikke sin lyshed. For en bruger med nedsat
farvesyn eller på en skærm i sollys forsvinder markeringen af, hvor tastaturet står, på
en side med 111 tab-stop.

**Nogen har allerede set problemet ét sted:** `assets/system.css:1485` gør
`.fod :focus-visible{outline-color:var(--paafod)}` — altså en anden ringfarve på den
mørke fod. Den samme tanke mangler for den lyse flade, som er 90 % af sitet.
`system.css:1818` og `2086` bruger i øvrigt `--blaek` som ringfarve på to andre
komponenter, så præcedensen findes i kodebasen.

**Acceptkriterium:** ringens farve mod `#E8EBED` måler ≥ 3:1. `--blaek` `#22262A` giver
12,72:1; en tostrenget ring (mørk kerne + gul yderkant) bevarer udtrykket og består.

---

## §3. [ALVORLIG] Den typografiske skala er et kontinuum — 32 grader gengives, 17 par er under 1 px fra hinanden

**Hvor:** `assets/system.css` + `assets/generator.css`, systemniveau.

### 3.1 Erklæret: 55 værdier — briefets tal HOLDER

Målt med en rigtig CSS-parser, ikke `sed` (den fjerner strenge korrekt og kommentarer over
flere linjer; **333 kommentarblokke** blev fjernet):

```
node <scratch>/uiux-css-maal.mjs assets/system.css assets/generator.css
```

→ `font-size: erklaeringer 228 · unikke vaerdier 55`

Briefets grove greb gav **229 forekomster**, parseren **228** — én forekomst lå i en
kommentar. **Antallet af unikke værdier er 55 i begge metoder.** Briefets hovedtal er
altså rigtigt.

**Én rettelse til briefet:** briefet siger *"i spændet 9–20 px alene ligger 18 trin"* og
lister dem. Der er **20**, ikke 18 — `15.5` og `16.5` mangler i briefets liste:

```
9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 18, 19, 20
```

### 3.2 Gengivet: 32 af 55 — det tal briefet efterspurgte

Dette er det tal, der afgør, om de 55 er uro eller død kode. Målt i browseren over 15 sider
(begge sprog, producentindeks, fem producentsider, om, tre 404, robotside):

```
node <scratch>/uiux-brows.mjs --selvtest      # SELVTEST OK: 11/11
node <scratch>/uiux-brows.mjs 1440 /da/producenter/ ... /en/robotter/boston-dynamics-spot/
```

| | 1440 px | 390 px |
|---|---|---|
| **gengivne unikke skriftgrader** | **32** | **29** |
| par under 1 px fra hinanden | **17** | 14 |
| flest på én side (`/da/om/`, robotside) | **20** | 19 |
| færrest (`/404.html`) | 5 | 5 |

**23 af de 55 erklærede værdier når altså aldrig en skærm** på de målte flader — de er død
kode, ikke uro. Men de 32, der gør, er stadig langt flere end nogen skala.

### 3.3 De par, der er to beslutninger uden en forskel

De værste, med antal tekstnoder i hver:

| Par | Afstand | Forekomster |
|---|---|---|
| **9,5 / 9,52 px** | **0,02 px** | 2 vs 6 |
| 12,88 / 13 px | 0,12 px | 8 vs 10 |
| 10,8 / 11 px | 0,20 px | 2 vs 59 |
| 10,5 / 10,8 px | 0,30 px | 86 vs 2 |
| 12,5 / 12,88 px | 0,38 px | 190 vs 8 |
| 8 / 8,4 px | 0,40 px | 16 vs 28 |
| + elleve par på præcis 0,5 px | | |

**9,5 px og 9,52 px er 0,02 px fra hinanden.** Det er ikke en finjustering; det er to
størrelser, ingen skærm kan skelne, og som derfor er to beslutninger, nogen skal
vedligeholde uden nogensinde at kunne se forskel.

**Kilden til de skæve tal er de relative grader.** `max(8px,.5em)`, `.80em`, `.62em`,
`max(8px,.34em)` m.fl. — 15 af de 55 erklæringer er `em`-baserede eller `clamp()`.
De arver en forælder, der selv er sat i halve pixels, og resultatet er værdier som
8,4 · 9,52 · 10,8 · 12,88, som ingen har valgt.

**Hvorfor det betyder noget for en læser.** På en datatung side er skriftgrad det stærkeste
signal om, hvad der er vigtigst. Med 20 grader på robotsiden og 0,5 px mellem nabotrinene
bærer graden ingen information: læseren kan ikke aflæse et niveauskift, fordi der ikke er
nogen niveauer — kun en glidende skala. Det er den samme kritik, INSTRUMENT (L40) svarer
på med *"hårdere typografi"*.

**Mindste ændring, der samler flest.** De fire mest brugte grader dækker allerede
1.213 af 1.799 tekstnoder ved 1440: 15px (424), 12px (224), 12,5px (190), 16px (160).
En skala på seks-syv trin — fx 10 · 12 · 13,5 · 15 · 17 · 20 · clamp-overskrifter — ville
kunne optage de 32 med afrunding under 1 px for langt de fleste noder. **Halvpixeltrinnene
er der, den største gevinst ligger**: at fjerne `.5`-trinnene alene fjerner elleve af de
sytten par.

**Acceptkriterium:** `node <scratch>/uiux-brows.mjs 1440 <de 15 sider>` rapporterer
`unikke gengivne skriftgrader` ≤ 12 og `par under 1px` = 0.

---

## §4. [ALVORLIG] `--r`-skalaen har intet trin under 4 px — og 227 rå px-forekomster ligger uden for den

**Hvor:** `assets/system.css` (tokens), begge stilark (brugen).

### 4.1 Briefets tal — hvor mine afviger, og hvorfor

Briefet siger: *89 forskellige padding-værdier, 48 erklæringer bruger et token, 81 bruger
rå px.* Målt med parseren:

| | Briefet | Målt, `padding:` **alene** | Målt, padding **inkl. longhand** |
|---|---|---|---|
| unikke værdier | 89 | **88** | **102** |
| bruger `--r`-token | 48 | **48** ✅ | **88** |
| rå px uden token | 81 | **64** | **84** |
| erklæringer i alt | — | 131 | **204** |

**Briefet målte `padding:`-shorthand alene** — dets tokental (48) rammer den kolonne
præcist. Men det udelader `padding-top/right/bottom/left`, hvor **40 ud af 73** bruger et
token. **Konklusionen skal derfor blødes op:** CSS'en går ikke uden om skalaen. Med alle
204 padding-erklæringer er det **88 med token mod 84 rå px** — omtrent halvt om halvt, ikke
37 % mod 63 %.

### 4.2 Det egentlige fund: skalaen mangler bunden

Skalaen er `--r1:4px --r2:8px --r3:12px --r4:16px --r5:24px --r6:32px --r7:48px --r8:64px
--r9:96px`. Optælling af **rå px-komponenter i padding/margin/gap uden token**:

```
node <scratch>/uiux-css-maal.mjs assets/system.css assets/generator.css
```

| Rå værdi | Forekomster | Findes som token? |
|---|---|---|
| **6px** | **38** | nej — ligger mellem `--r1` og `--r2` |
| 8px | 33 | ja, `--r2` |
| **2px** | **32** | nej — under hele skalaen |
| **10px** | **26** | nej — mellem `--r2` og `--r3` |
| **5px** | **24** | nej |
| 4px | 22 | ja, `--r1` |
| **14px** | **18** | nej — mellem `--r3` og `--r4` |
| 12px | 18 | ja, `--r3` |
| **9px** | **17** | nej |
| **3px** | **16** | nej |
| **7px** | **15** | nej |
| **1px** | **13** | nej |
| 16px | 12 | ja, `--r4` |

**85 forekomster rammer præcis et token; 227 ligger uden for skalaen.** Og fordelingen er
ikke tilfældig: **de syv hyppigste ikke-token-værdier (6, 2, 10, 5, 9, 3, 7) ligger alle
under 12 px.** Skalaen springer 4 → 8 → 12, og alt det fine arbejde — cellepolstring i en
tæt tabel, chips, hårstreger, mærker — har ingen sprosse at stå på.

**Hvorfor det betyder noget.** Det er ikke disciplinbrist; det er et værktøj, der ikke
passer til opgaven. Et site, der mest består af tætte tabeller, bruger sin rytme i det
lille område, og dér har skalaen tre trin (4, 8, 12) mod ni i det store. Resultatet er
lodret rytme, der skifter med en-pixel-spring mellem beslægtede komponenter.

**Mindste ændring, der samler flest.** Tre trin i bunden — `--r0:2px`, og trin ved 6px og
10px — ville optage **96 forekomster** (6px×38 + 2px×32 + 10px×26) uden at røre en eneste
eksisterende værdi. Det er den enkeltændring i dette dokument med det bedste forhold
mellem risiko og dækning.

**Acceptkriterium:** samme kommando rapporterer `uden for skalaen` ≤ 140 mod 227 i dag.

---

## §5. [MINDRE] Sprogskillestregen "/" står på 1,35:1 — den laveste kontrast på sitet

**Hvor:** `header.daek > p.daek__sprog > span.daek__skil`. Findes på **alle** målte sider.
*Topbaren er i spil (flyttes af et andet spor) — fundet er systemisk og følger med.*

**Hvad der er målt:** `rgb(198,204,209)` (= `--linje`) på `rgb(232,235,237)` = **1,35:1**
ved 12px/vægt 600. Det er den laveste kontrast, jeg har målt nogen steder.

**Hvorfor det betyder noget — og hvorfor det kun er "mindre":** tegnet er rent dekorativt
og adskiller `DA` fra `EN`. Ingen information går tabt, hvis det er usynligt. Men det er
`--linje`, altså **stregfarven**, brugt som tekst — samme retningsfejl som §1, i lille
format. Er `aria-hidden` ikke sat, læses det desuden op.

**Acceptkriterium:** enten `aria-hidden="true"` + accept af den lave kontrast som ren
dekoration, eller `--blaek3` (4,74:1).

---

## §6. Målt og fundet i orden — fokus, tabulartal, overløb, prosa

Dette afsnit er ikke pynt. Uden det kan orkestratoren ikke se forskel på *"efterprøvet og
fint"* og *"ikke set på"*.

### 6.1 Fokusringe: 169 tab-stop, 0 uden ring ✅

Målt med **rigtige Tab-tryk** (efter at `el.focus()`-metoden var kasseret, se §0.1).
Instrumentet er valideret mod en kontrolside med både en ring og en bevidst fjernet ring:
`FOKUS-SELVTEST OK: 4/4`.

```
node <scratch>/uiux-fokus.mjs 1440 /da/producenter/ /da/producenter/boston-dynamics/ \
     /da/om/ /da/404.html /404.html
```

| Side | Tab-stop | Uden synlig ring |
|---|---|---|
| `/da/producenter/` | 111 | **0** |
| `/da/producenter/boston-dynamics/` | 35 | **0** |
| `/da/om/` | 11 | **0** |
| `/da/404.html` | 10 | **0** |
| `/404.html` | 2 | **0** |
| **I alt** | **169** | **0** |

Der findes desuden et `a.spring` ("Spring til indholdet") som første tab-stop på alle
sider undtagen rod-404. Ringens *farve* er et selvstændigt fund (§2), men dens
*tilstedeværelse* er komplet.

### 6.2 `font-variant-numeric: tabular-nums`: 75 af 75 talceller ✅

Briefet bad om producentindekset og skematabellen. Begge er dækket **100 %**:

| Tabel | Celler | Med tal | Med `tabular-nums` |
|---|---|---|---|
| `/da/producenter/` `.prod-tabel` | 104 | 43 | **43** |
| `/en/producenter/` `.prod-tabel` | 104 | 43 | **43** |
| robotside `.skema-tabel` | 99 | 32 | **32** |
| `/en/` robotside `.skema-tabel` | 99 | 32 | **32** |

Ingen talkolonne mangler det. `system.css:1873` sætter det desuden med `min-height:1em`,
så en tom talcelle ikke kollapser.

### 6.3 Vandret overløb ved 390 px: ingen — heller ikke producenttabellen ✅

Briefet advarede om, at producenttabellen ruller vandret. **Målt: dokumentet ruller ikke
på nogen af de 15 sider ved hverken 390 eller 1440 px** (`scrollWidth == clientWidth`).

Årsagen er, at tabellen ligger i `.prod-tabel-wrap{overflow-x:auto}`
(`generator.css:1157`), og at `generator.css:1202` skjuler `.prod-navne`-kolonnen under
en breakpoint. Rulningen sker altså **inde i tabellens egen beholder**, hvilket er den
rigtige løsning — siden ruller ikke sidelæns. Det er ikke et fund; det er en korrekt
implementering, og den bør ikke "rettes".

### 6.4 Prosa: 0 kandidater i syv filer, og tallene holder ✅

```
python C:/Users/thyge/.claude/skills/ui-ux-critique/scripts/scan_copy.py \
   dist/da/om/index.html dist/en/om/index.html dist/da/producenter/index.html \
   dist/en/producenter/index.html dist/da/404.html dist/en/404.html dist/404.html
```

→ **`0 candidates across 7 file(s).`** Ingen markedsføringsadjektiver, ingen tomme
forsikringer, hverken på dansk eller engelsk.

Jeg har derudover læst om-siden igennem og kørt skillens tre tests i hånden:

- **Swap-testen:** består. *"1.110 af de 1.116 oplyste felter bærer et kildemærke. 963
  peger på producentens egen produktside, 147 på et datablad…"* kan ikke stå på nogen
  anden virksomheds side.
- **Negationstesten:** består. *"Der gives ingen karakter fra 1 til 5, ingen stjerner og
  ingen rangering"* — konkurrenter gør præcis det modsatte, så udsagnet bærer information.
- **Crop-testen:** består. Afsnittet "De fire tilstande" kunne ikke sidde på en vilkårlig
  SaaS-side.

**Tre talpåstande på om-siden er efterprøvet mod det byggede katalog — alle tre holder:**

| Om-siden påstår | Målt i `dist/da/robotter/` (77 sider) |
|---|---|
| "8 målte nul" | `v-tal v-nul` → **8** |
| "11 gange svarer de udtrykkeligt nej" | `v v-nej` → **11** |
| "Ikke oplyst 1.194" | `v v-ikke` → **1194** |

Og `2310 − 1194 = 1116` stemmer med "1.116 oplyste felter", som stemmer med byggets
`1110 tal med kilde` + de 6 nej uden tal.

**DA og EN bærer nøjagtig de samme tal i samme rækkefølge** — efterprøvet ved at trække
alle tal ud af `<main>` på begge sprog og sammenligne: `samme multiset: true`, `kun i DA:
(ingen)`, `kun i EN: (ingen)`. Skillen kalder en talafvigelse mellem sprog for en
blokerende fejl; her er der ingen.

### 6.5 Hård begrænsning 5 i skematabellen ✅

Se §0.2. De fire tilstande (tal · nul · nej · ikke oplyst) er tegnet forskelligt med
klasserne `.v-tal` · `.v-nul` · `.v-nej` · `.v-ikke`, hver med sit `<i class="mrk">`.
Om-siden dokumenterer reglen i ord, og nøglen dér bruger **de samme mærker, robotsiderne
selv sætter** — ikke en tegning af dem.

---

## §7. [MINDRE] Berøringsmål: sitet har to gulve, 44 px og 24 px, og det lave vinder på de tætte flader

**Hvor:** `assets/generator.css:1115, 1126, 1137, 1165`, `assets/system.css:2056`.

**Briefets tal efterprøvet:** `min-height:44px` står **7 steder** i `assets/` — bekræftet
(`generator.css:823, 1593`, `system.css:465, 1376, 1624, 1997, 2137`), plus
`min-width:44px` og `height:44px` ét sted hver.

**Men der findes et konkurrerende gulv på 24 px**, og det er det, der gælder på de tætte
flader:

```
grep -n "min-height" assets/*.css
```

| Målt ved 390 px | Størrelse | Gulv i CSS |
|---|---|---|
| `.prod-tabel td a` (77 modellinks) | **24 px høj** | `min-height:24px` |
| `.prodliste .pnavn` (24 modellinks) | 40,8 px | `min-height:24px` |
| `a.daek__sprogkode` (DA/EN) | 28,2 × 22,6 | `auto` |
| `a.daek__navn` (logo) | 168 × 21,7 | `auto` |
| `.kildemaerke` i skematabellen | **17 × 17** | `0` |
| `.kildemaerke` i `.stribe`/`dl.raekker` | **7 × 8** | `auto` |
| fodlink | 60,5 × 20 | `0` |

På `/da/producenter/` er **29 af 34** interaktive elementer under 44 px ved 390 px.

**Hvorfor det kun er "mindre" — og hvor det ikke er.** De 24 px høje links er tekstlinks
i en tabelrække; WCAG 2.5.8 (AA) kræver 24×24 og undtager links i løbende tekst, så de
**består** den formelle grænse, selvom de falder under sitets eget mål. Det er et
konsistensfund, ikke et tilgængelighedsbrud.

**To ting er derimod reelt for små:**

1. **`.kildemaerke` på 17×17 px** i skematabellen (21 stk. pr. robotside) — under 24×24.
   De har `tabindex="-1"` og er derfor bevidst uden for tabulatorrækkefølgen, hvilket er
   rigtigt, men de er stadig klikbare, og på en telefon skal de rammes med en finger.
2. **`.kildemaerke` på 7×8 px** i `.stribe` og `dl.raekker` (om-siden er i scope) — det er
   under en tredjedel af 24×24. Kombineret med §1 (1,60:1 i gult) er det sidens sværeste
   element at både se og ramme. *`.stribe` sidder i robot-heroen, som er i spil; om-sidens
   `dl.raekker` er ikke.*

**Hvorfor det betyder noget.** Kildemærket er beviset. Hele sidens løfte er, at hvert tal
har en kilde, man kan klikke sig til. Er beviset 7×8 px og på 1,6:1, er løftet formelt
indfriet og praktisk uindfrieligt.

**Acceptkriterium:** `.kildemaerke` måler ≥ 24×24 px ved 390 px (må gerne via usynlig
`padding`/`::after`-hitbox, så typografien ikke flytter sig).

---

## §8. [MINDRE] 404-siderne stopper ved 722 px — briefets måling bekræftet, og de tre 404'er er ikke enige

**Hvor:** `dist/da/404.html`, `dist/en/404.html` mod `dist/404.html`.

**Briefets tal er efterprøvet og holder præcist:**

```
node <scratch>/uiux-luft.mjs
```

| Side | 1440×900 | 390×900 | `min-height`-træf |
|---|---|---|---|
| `/da/404.html` | body **722** px, doc 900 → **178 px bar stribe** | body 823 → 77 px bar | **0** |
| `/en/404.html` | body **722** px | body 823 | **0** |
| `/404.html` (rod) | body **900** px — **fylder skærmen** | body 900 | **1** |

**Der findes ingen `min-height:100dvh`** på `html`, `body`, `main` eller `.side` i noget
stilark — bekræftet. Rod-404'en klarer sig, fordi den har sin egen indlejrede `<style>`
med en højde; de to sprog-404'er bruger den almindelige sideskabelon og har ingen.

**Formlen for den bare stribe er `viewporthøjde − 722`** — på en 1080 px skærm er det
358 px tomt under foden.

Set på skærmbilledet: den mørke fod slutter, og derunder står ren baggrundsgrå til
bunden. Det læses som om siden er knækket midt i indlæsningen — hvilket er præcis den
forkerte følelse på den ene side, hvor brugeren allerede er faret vild.

**Ingen andre korte sider er ramt.** Alle øvrige målte sider er 1.966–8.753 px høje, altså
langt over enhver skærm. Det er udelukkende et 404-fund.

**Sideeffekt værd at nævne:** de tre 404'er er tre forskellige sider med tre forskellige
opbygninger. Rod-404'en har hverken topbar, `a.spring`-springlink eller fod (2 tab-stop),
mens sprog-404'erne har det hele (10 tab-stop). Det er forsvarligt — rod-404'en skal
kunne stå før et sprogvalg — men **kun rod-404'en har fået `min-height`**, hvilket
tyder på, at højden blev løst ét sted og ikke båret videre.

**Acceptkriterium:** `node <scratch>/uiux-luft.mjs` viser `bodyH >= 900` for alle tre
404-sider ved 1440×900, uden at nogen anden sides `bodyH` ændrer sig.

---

## §9. [MINDRE] 540 KB inlinet SVG-sprite, hvoraf 1.334 symbolforekomster er ubrugte

**Hvor:** alle 218 byggede sider — sprite-blokken `<svg width="0" height="0">` i `<body>`.

**Hvad der er målt:**

```
node -e "...gaa igennem dist, find sprite, tjek hvilke #id kroppen bruger..."
```

| | |
|---|---|
| HTML-sider i `dist/` | 218 |
| Inlinet sprite i alt | **540,4 KB** |
| Ubrugte symbolforekomster | **1.334** |
| Sprite-andel af `/da/404.html` | **51,0 %** (2.562 B af 5.021 B) |
| Sprite-andel af `/da/producenter/` | 19,4 % — **alle 12 symboler ubrugte** |
| Sprite-andel af robotside | 7,1 % — 4 ubrugte |

Spriten indeholder 12 symboler (`i-vaegt`, `i-nyttelast`, `i-driftstid`, `i-fart`, `i-ip`,
`i-ce`, `i-hul`, `i-pil`, `i-ja`, `i-nej`, `i-nul`, `i-ioplyst`) og lægges **komplet på
hver side uanset behov**. På producentindekset og om-siden bruges ingen af dem.

**En hypotese jeg måtte forkaste:** jeg troede først, at `i-ja`/`i-nej`/`i-nul`/`i-ioplyst`
var helt døde, og at det forklarede §0.2. Efterprøvet over hele `dist/`:
`#i-ioplyst` bruges på **156** sider, `#i-nej` på 6, `#i-ja` på 6, `#i-nul` på 2
(i mærkestriben i robot-heroen). De er altså i brug — bare ikke på de sider, hvor de
inlines forgæves.

**Hvorfor det betyder noget.** Det er ikke et alvorligt fund — det er ukomprimeret markup,
og gzip æder det meste. Men på 404-siden er **over halvdelen af filen ikoner, siden ikke
tegner**, og det er den side, der oftest rammes af en robot eller en fejlklikkende bruger.

**Mindste ændring:** udelad spriten på sider, hvor `#`-referencer ikke forekommer i
kroppen — det er et opslag, generatoren allerede kan lave, og det fjerner 12 af 12 på
producent- og om-siderne.

---

## §10. Set, men uden for min afgrænsning

- **`MIDLERTIDIGT NAVN`-badgen i topbaren** står på hver eneste af de 218 sider ved siden
  af "FIRBENEDE ROBOTTER". Det er en pladsholder i et bygget, lanceringsklart site.
  **Topbaren er i spil** hos et andet spor, så jeg rører den ikke — men den bør ikke
  overleve lanceringen, og den forsvinder ikke af sig selv, når topbaren flyttes.
- **`/da/om/` er 5.192 px høj ved 390 px** (3.366 ved 1440). Det er en lang side på en
  telefon uden nogen indholdsfortegnelse. Jeg har ikke målt, om det koster noget — der er
  ingen målbar fejl, og siden er bevidst grundig. Nævnt, ikke rejst som fund.
- **Om-sidens overskrift "De fire tilstande"** efterfølges to afsnit senere af *"derfor
  står der også en femte tilstand"* (`kun vist på billede`). Ikke forkert — den femte er
  en billedtilstand, ikke en værditilstand — men overskriften og nøglen tæller forskelligt,
  og en læser tæller efter.

---

## §11. Hvad jeg ikke kunne måle

- **Kontrast over billeder og gradienter.** Min metode går op i DOM'en til første
  uigennemsigtige `background-color` og kan ikke måle tekst oven på et fotografi. På
  robotsiden er dette markeret `[OVER BILLEDE - usikker]` i råudskriften. Ingen af de
  fund, jeg rejser, hviler på et sådant tilfælde.
- **Rigtige enheder.** Alt er målt i Chromium via Playwright ved emulerede viewports.
  Der er ingen mobil browserchrome, ingen touch, og `dvh` opfører sig ikke som på en
  telefon, hvor adresselinjen folder sig. §8's tal er derfor gyldige for skrivebordet;
  på en telefon kan den bare stribe være større eller mindre.
- **Hover- og aktiv-tilstande.** Jeg har målt hviletilstand og fokustilstand. Om et link
  får tilstrækkelig kontrast **ved hover** er ikke målt — det kan ændre §1's tal til det
  bedre for musebrugere, men ikke for tastatur eller touch.
- **De spærrede flader.** Katalogsidens filterområde, robot-hero, EU-blok,
  "producentens egen side", topbar/navigation, sammenligningssidens vælger og bund samt
  forsiden er ikke gennemgået. §1, §2, §3, §4 og §9 er systemniveau og rammer dem også,
  men jeg har ikke opgjort hvor hårdt.
- **Ydelse og indlæsningstid.** Ikke målt. Kun `networkidle` er afventet.
- **Skærmlæser.** Ingen AT-kørsel. `aria-labelledby`, rollerne på skematabellen og
  `aria-hidden` på mærkerne er læst i markup, ikke hørt.

---

## §12. Behold dette

Fem ting, der skal overleve enhver rettelsesrunde, fordi de er svære at få rigtigt og
allerede er rigtige:

1. **De fire tilstande i skematabellen** (§0.2, §6.5). Stiplet chip, sort firkant + NEJ,
   almindeligt tal for nul. Det er hård begrænsning 5 løst i praksis, ikke i ord.
2. **`tabular-nums` på 75 af 75 talceller** (§6.2). Fuldstændig dækning.
3. **Fokusringen på alle 169 tab-stop** (§6.1) — kun dens *farve* skal rettes, aldrig
   dens tilstedeværelse eller dens `outline-offset:3px`.
4. **Prosaen på om-siden** (§6.4). 0 hype-kandidater, tre talpåstande der verificerer mod
   kataloget, og fuld talparitet mellem DA og EN. Rør den ikke.
5. **`.prod-tabel-wrap{overflow-x:auto}`** (§6.3). Den holder siden fri af vandret
   rulning ved 390 px. Ser den overflødig ud i en oprydning, er den det ikke.

---

## §13. Rangering efter, hvad det koster læseren

| # | Fund | Alvor | Koster |
|---|---|---|---|
| 1 | §1 `--accent` som tekst: 1,38:1 på 25+24+5 primære links | **Blokerer** | Sidens vigtigste navigation er ulæselig for mange |
| 2 | §2 Fokusringen er samme gule: 1,38:1 | **Blokerer** | Tastaturbrugeren mister sin position på 111 tab-stop |
| 3 | §3 32 gengivne skriftgrader, 17 par under 1 px | Alvorlig | Graden bærer ingen information; hierarkiet forsvinder |
| 4 | §4 227 rå px uden for `--r`-skalaen, alt det fine under 12 px | Alvorlig | Ujævn lodret rytme på de tætteste flader |
| 5 | §7 `.kildemaerke` 7×8 og 17×17 px | Mindre | Beviset for hvert tal er svært at ramme |
| 6 | §8 404 stopper ved 722 px | Mindre | Ser knækket ud, netop hvor brugeren er faret vild |
| 7 | §9 540 KB sprite, 51 % af 404-siden | Mindre | Spildt vægt, ingen synlig skade |
| 8 | §5 Sprogskillestregen 1,35:1 | Mindre | Rent dekorativt tegn |

**§1 og §2 er samme rodårsag** — `--accent` brugt i den retning, den ikke er målt for.
Rettes den ene rigtigt, er den anden en tolinjers.
