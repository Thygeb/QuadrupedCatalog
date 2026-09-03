# PLAN — klæbebaren i bunden af katalogsiden

**Spor:** `spor/barplan`, 3. sep 2026. **Metode:** `impeccable shape` (L70), kaldt fra
worktreen — **kaldet lykkedes**, og `scripts/context.mjs` blev kørt med
`--target assets/system.css` (læser PRODUCT.md + DESIGN.md, skriver intet;
`git status` efter kørslen viser 0 nye filer).

**MODE: Operate.** Den besøgende løser en opgave — vælg op til tre robotter, fjern dem
hun fortryder, åbn sammenligningen. Succeskriteriet er, at opgaven bliver **lettere**,
ikke at baren bliver pænere. Katalogsiden er Operate; robotsiden og Om os er Read.

**Leverancen er en plan, ikke en rettelse.** Designfrysen (L70) gælder: intet herunder er
udført, og dette spor har ikke rørt én linje `.css`, `.js` eller `.mjs`. Hvert forslag
bærer et acceptkriterium, så det kan sendes videre som brief.

**Substitution, oplyst efter `impeccable shape`s egen regel** (*"When no human or
structured answer mechanism exists, mark assumptions plainly, return the brief, and
stop"*): skillen forlanger en interviewrunde først. Dette spor er en subagent uden
`AskUserQuestion` — der er ingen at spørge herinde. Jeg har brugt JPK's fire krav som
interviewets svar og mærket hver antagelse, jeg selv har lagt til, med *(antagelse)*.

**Invention-niveau efter `new-work.md` §3:** *Extend an existing surface.* Den visuelle
verden (TYPESKILT, `--hjoerne` 2px, fladt system, palettens 16 tokens) er afgjort og
røres ikke. Kun **komposition, tæthed og betjening** er åbne. Derfor ingen
`concept-seed`-turnering — men tre materielt forskellige strukturer, JPK kan se ved
siden af hinanden (§3, *"derive five to seven materially different structures"*, skaleret
til en bjælke).

---

## Grundmåling, før noget blev rørt

`assets/fotos/fabrikant/` er gitignoreret og manglede i worktreen; **610 filer blev
kopieret ind fra hovedrepoet før første måling** (brevets krav).

```
node tools/validate.mjs   77 fil(er) · 0 fejl · 1 advarsler
node tools/build.mjs      216 sider · 1111 tal med kilde, 0 uden · 77 kort i kataloget
```

**Afvigelse fra CLAUDE.md, meldt efter `spor`-skillens punkt 5:** CLAUDE.md siger
*"213 byggede sider"*. Målt her: **216**. Tallet i CLAUDE.md er forældet, ikke forkert
målt — det er et hårdkodet tal ved siden af et udledt (D7/L30-fælden).

**Rettelse til briefets stier — begge fakta i briefet var forkerte:**

| Briefets påstand | Målt |
|---|---|
| `.klaebebar` ligger i `system.css` ~linje 2315 | Kommentarblokken begynder **2426**, reglen **2447** |
| Katalogsiden er `dist/da/robotter/` | Kataloget er **`dist/da/index.html`** (sprogroden). `dist/da/robotter/<slug>/` er de 77 robotsider. Min første måling gav `"fandtBar": false`, netop fordi jeg troede på stien |

Briefet nævner desuden *"1, 3 og 5 valgte robotter"*. **Fem er umuligt:**
`assets/katalog.js:79` sætter `SAML_MAKS = 3`, håndhævet både ved klik (`:288`) og ved
læsning fra `localStorage` (`:200`). Området er 0–3, og planen er målt på 1, 2 og 3.

---

## 1. Fladen som den FAKTISK er — målt, ikke antaget

Måleopstilling: egen server på **port 8135** (aldrig 8080), verificeret mod disken før
første tal (`grep -c` på en streng, der kun findes i min udgave af `system.css`: disk 1,
server 1). Playwright fra `C:\Praktik\websites\maalevaerktoej\`, altså den isolerede vej,
ikke den delte MCP-browser. Hver måling har en URL- og breddevagt som første linje.
Viewport-højde 900 px overalt.

### 1.1 Kassen

| | Målt |
|---|---|
| Højde, 1440 og 1024 px | **45,7 px** (uafhængigt af 1, 2 eller 3 valgte) |
| Højde, 390 px, 1 valgt | **44,1 px** |
| Højde, 390 px, 3 valgte | **69,3 px** — flexboksen ombryder |
| Højde, 480–660 px, 3 valgte | **70,9 px** |
| Ombrydningsgrænsen (3 længste navne) | mellem **660 og 700 px** (700 → 45,7 · 660 → 70,9) |
| Andel af 900 px viewport | **5,1 %** (desktop) · **7,7 %** (390, 3 valgte) |
| Polstring · fuge | `12px 24px` (`--r3 --r5`) · `gap:12px` |
| Areal ved 1440 | **65.790 px²** massiv gunmetal |

### 1.2 Tomrummet — det, "grim" og "fylder for meget" i virkeligheden peger på

Blækbredde = navnetekstens faktiske bredde (målt med `Range.getBoundingClientRect`)
plus de to handlingers bredde. **De tre længste navne i kataloget** er brugt som værste
tilfælde: `ANYmal (Generation D) · Gangben L2-W Ultra · Tongchui M1 Ultra`, 62 tegn.

| Ved 1440 px | 1 valgt | 2 valgte | 3 valgte |
|---|---|---|---|
| Navnetekst | 129,0 px | 252,8 px | 362,8 px |
| Blæk i alt (navne + to handlinger) | 371,5 px | 495,3 px | 605,3 px |
| **Tomt mellemrum mellem navne og handling** | **1.008,5 px** | 884,7 px | **774,7 px** |
| **Tom andel af barens bredde** | **74,2 %** | 65,6 % | **58,0 %** |

Selv i det værst tænkelige tilfælde — tre valgte robotter med kataloget længste navne —
bærer **58 % af bjælken ingenting.** Med én valgt robot er den 74 % tom.
Se `fund/barplan-bar-1440-naer.png`: et 1440 px bredt sort bånd med 27 tegn i venstre
hjørne og to bittesmå versallinks i højre.

**Og den er sidens eneste flade, der ignorerer sidens eget mål.** DESIGN.md's *Layout*:
alt indhold ligger i `.rum`, højst 1440 px, med `--kant` (`clamp(16px,3.4vw,44px)`) ydre
luft. Klæbebaren er `left:0;right:0` — fuld bredde, uden gutter. Intet andet på
katalogsiden er fuldbleed mørkt.

### 1.3 Typografien taler et sprog, der ikke findes andre steder

| Element | Målt |
|---|---|
| `.klaebebar__navne` | **14 px / 600** (13 px under 460 px) |
| `.klaebebar__gaa` og `__ryd` | 12 px, `--mono`, VERSALER, `letter-spacing:.11em`, understreget |
| Handlingernes højde | **13,2 px** (`min-height:0;padding:0` fra `.knap--tekst-moerk`) |

DESIGN.md's navngivne trin er `body` 17 px, `label` 11,5 px. **14 px og 13 px er ingen af
dem.** Målt over begge stilark: `font-size:14px` optræder 6 gange, `13px` 7 gange, og der
findes **56 unikke `font-size`-værdier** i alt. Barens to grader er altså to af de 56,
ikke to af de seks navngivne.

### 1.4 Den dækker indhold — JPK's skærmbillede er reproduceret

`body{padding-bottom:0}` (målt: `"0px"`), `html{scroll-padding-bottom:auto}`. **Intet
reserverer plads til bjælken.** Ved maksimal rulning ligger derfor barens fulde højde af
dokumentet under den:

| Ved maks. rulning | 1440 px | 390 px |
|---|---|---|
| Utilgængelige dokument-px | **45,7** | **69,3** |
| `<dd>` "Stiplet bogstav: sekundær kilde…" skåret | 11,2 px | 11,7 px |
| `<p class="t-lille">` "Trappetrin og nyttelast findes i to udgaver hver. Sammenlign kun felter med samme etiket." | **100 % skjult** (23,3 px) | **100 % skjult** (46,5 px) |

Katalogsidens **sidste sætning er fuldstændig uopnåelig**, så længe der står én robot i
udvalget. Se `fund/barplan-1440-sidefod.png` og `fund/barplan-390-sidefod.png`;
`maksScroll` var `true` i begge målinger (`scrollY 5703 = 6603 − 900`).

**CSS-kommentaren på `system.css:2485` er direkte forkert.** Der står:
*"Bjaelken daekker IKKE sidefoden … `scroll-padding-bottom` er ikke noedvendig her."*
Målt: `grep -c "<footer" dist/da/index.html` giver **0** — katalogsiden har slet ingen
sidefod, og intet holder bjælken væk fra sidens sidste afsnit. Påstanden er en
antagelse, ingen har efterprøvet, og den er selve grund 4 i JPK's klage.

### 1.5 Betjeningen — hvor den faktisk sidder for et tastatur

Bjælken bygges af `assets/katalog.js:186` med `document.body.appendChild(klaebebar)`,
altså **sidst i DOM'en**. Målt med tre robotter valgt ved 1440 px:

| | Målt |
|---|---|
| Fokuserbare elementer på siden i alt | **232** |
| `Åbn sammenligningen` | plads **231** af 232 |
| `Ryd udvalget` | plads **232** af 232 |

En tastaturbruger skal altså forbi **230 stop** for at nå den bjælke, der permanent står
foran hende. Baren har `role="region"` og `aria-label="Robotter valgt til sammenligning"`
— men **ingen `aria-live`**: navnelisten ændrer sig, uden at nogen får det at vide.
(Grænsebeskeden "højst 3" har sin egen `role="status"` og er ikke berørt.)

### 1.6 Ombrydning og afkortning

`.klaebebar__navne` har `overflow:hidden;text-overflow:ellipsis;white-space:nowrap`.
Målt med de tre længste navne (62 tegn):

| Bredde | Barhøjde | Afkortet? | Tabte px |
|---|---|---|---|
| 1440 / 1024 / 768 | 45,7 | nej | 0 |
| 660 / 600 / 480 | 70,9 | nej | 0 |
| 390 | 69,3 | nej | 0 |
| **360** | 69,3 | **ja** | 24 (92,9 % synligt) |
| **320** | 69,3 | **ja** | 64 (81,0 % synligt) |

Afkortningen er altså en reel, men smal risiko: den begynder først under 360 px.
Gennemsnitligt robotnavn er **8,8 tegn**, median **9** (målt over kortenes 86 `.kort__navn`
— 77 unikke plus de 9 `kort--seneste`).

### 1.7 To ting, der allerede er i vejen for en pæn rettelse

1. **`box-shadow:0 -1px 0 rgba(0,0,0,.2)` på `system.css:2452` er den ENESTE rå
   rgba-skygge i hele stilarket** (målt: `grep -n "box-shadow:[^;]*rgba"` giver 1 træffer,
   og det er denne). DESIGN.md's *Dybde*: *"Systemet er fladt, punktum"*, begge
   skyggetokens er `none`. Baren tegner sin overkant med en håndskrevet sort
   gennemsigtighed i stedet for `--linje` eller `--paafod2`.
2. **Fjern-en-robot findes allerede to andre steder på sitet** — og det er dét, planen
   skal genbruge frem for at opfinde:
   - **Kortets stempel** (`.knap--maerkat`) er en til/fra-knap: klik igen fjerner
     robotten. Prisen er at finde kortet igen blandt 77 i et 6.603 px højt dokument.
   - **Sammenligningssiden** har siden 2. sep 2026 (JPK's egen beslutning) en fjern-knap
     pr. kolonne: `assets/sammenligning.js:356-359`,
     `<button class="specimen__fjern knap knap--kant-moerk" data-saml-fjern="<slug>">`
     med `<span aria-hidden="true">Fjern</span>` plus
     `<span class="kunskaerm">Fjern Spot fra sammenligningen</span>`.
   - **i18n-nøglerne findes allerede i begge sprogfiler:** `saml_fjern_kort`
     ("Fjern" / "Remove") og `saml_fjern_navn` ("Fjern {navn} fra sammenligningen" /
     "Remove {navn} from the comparison"), `data/i18n/da.json:338-339` og
     `en.json:338-339`. **En bygger skal ikke tilføje én ny nøgle.**

---

## 2. Diagnosen, samlet i én sætning pr. klage

| JPK's ord | Hvad målingen siger, det er |
|---|---|
| *"Den er grim"* | Sidens **eneste** fuldbleed mørke flade, 58–74 % tom, med to typografiske grader der ikke findes i DESIGN.md's skala, og sidens eneste rå `rgba`-skygge |
| *"Fylder for meget"* | 45,7 px desktop / 69,3 px mobil — men **arealet** er den rigtige måling: **65.790 px²** massiv gunmetal for at bære 605 px blæk |
| *"Man skal kunne fjerne enkelte robotter"* | Én knap, `Ryd udvalget`, rammer alle tre. Alternativet er at finde kortet igen i et **6.603 px** højt dokument |
| Den dækker indhold | `padding-bottom:0`. **45,7 / 69,3 px** af dokumentet er utilgængeligt, og katalogets sidste sætning er 100 % skjult |

**Én mekanisme forklarer tre af de fire:** bjælken blev bygget som *et bånd*, ikke som
*en genstand*. Et bånd fylder hele bredden, uanset hvad det bærer, og det får sin højde
af sin polstring frem for af sit indhold. Alt andet følger.

---

## 3. Tre retninger, der kan ses ved siden af hinanden

`new-work.md` §3 kalder det her *"Create a whole surface inside an established world"*:
den visuelle verden er låst, kun **strukturen** er åben. De tre er materielt forskellige
— ikke tre variationer af samme idé — og alle tre løser krav 3 og 4 på samme måde
(afsnit 4 og 5). De skiller sig på krav 1 og 2.

### Retning A — RÆKKEN (båndet bliver, men holder op med at strande sit indhold)

Bjælken beholder `left:0;right:0` og sin fuldbleed gunmetalflade — sidens `.strimmel`
og `dækket` er også vandrette bånd, så formfamilien er sidens egen. **Det, der ændrer
sig, er indholdets justering:** i dag ligger navnene helt til venstre og handlingerne
helt til højre med 775–1.008 px død flade imellem. I stedet pakkes hele rækken sammen
til venstre inde i `.rum`'s mål (`max-width:1440px`, `--kant` ydre luft), så øjet går
**0 px** fra "hvad har jeg valgt" til "hvad kan jeg gøre".

- **Højde:** 40 px (24 px indhold + 2 × `--r2`).
- **Tomrum:** stadig ~55 % af bredden — men nu som **margin** i sidens eget gitter,
  ikke som et strandet hul mellem to ting, der hører sammen.
- **Risiko, ærligt:** den løser krav 1 kun halvt. Båndet er stadig 1.440 px bredt og
  stadig 65.790 px² gunmetal ved 1440. JPK kan meget vel synes, det stadig er grimt.
- **Pris:** mindst indgreb. Rører kun `.klaebebar`s indre layout; ingen ny formfamilie.

### Retning B — SKINNEN (bjælken bliver så bred som sit indhold) · **min anbefaling**

Bjælken holder op med at være et bånd og bliver en **genstand**: `left:auto;right:auto`,
centreret over katalogets gitter, `width:max-content`,
`max-width:calc(100% - 2*var(--kant))`, løftet fri af kanten med `bottom:var(--r4)`.

- **Bredde ved 1440, tre længste navne:** ~653 px i stedet for 1.440 (blæk 605 + 48 px
  polstring). Med **én** valgt robot ~420 px. Tom andel går fra 58–74 % til **~0 %**.
- **Dækket areal:** 65.790 → ~26.000 px², **−60 %**.
- **Højde:** 40 px, som A.
- **Kanten:** systemet er fladt (DESIGN.md, *Dybde*: *"Systemet er fladt, punktum"*),
  så en flydende genstand må **ikke** få slagskygge. Den får i stedet en hårstreg —
  `box-shadow:inset 0 0 0 1px var(--paafod2)` — hvilket samtidig fjerner sidens eneste
  rå `rgba`-skygge (afsnit 1.7). *"Dybde signaleres af fladeskift og streger"* er
  DESIGN.md's egen formulering.
- **Hvorfor centreret og ikke i højre hjørne:** højre hjørne er systembeskedens plads
  og læses som en notifikation. Centreret over gitteret læses som *hendes udvalg*.
  *(antagelse — det er en læsning, ikke en måling.)*
- **Risiko, ærligt:** en flydende genstand er en ny formfamilie på et site, hvis
  grammatik er flade, hårde, fuldbleed rækker. Den kan komme til at se ud som en
  fremmed komponent. Modargumentet: `.stans`-primitiven er allerede en indfældet
  genstand med lyskant, så "genstand med kant" er ikke ukendt her.
- **JPK's beslutning 2. sep** (*"selected to compare baren skal kun leve i bunden af
  skærmen"*) er **ikke** brudt: den står stadig i bunden af skærmen.

### Retning C — SPORET (tre pladser, ikke en tekstlinje) · demoteret

`SAML_MAKS` er 3 — et lille, hårdt tal. Bjælken kunne derfor vise **tre pladser**:
fyldte bærer navn + `Fjern`, tomme bærer ordet *"ledig plads"*. Sammenligningssiden har
allerede begrebet (`invitationHTML()` tegner en invitation *"kun naar der er en ledig
plads"*), så ordet er sidens eget.

- **Gevinsten:** grænsen bliver **synlig** i stedet for at blive lært ved at ramme den.
  I dag opdager læseren først loftet på 3, når hun får en fejlbesked. `operate.md`:
  *"Empty states that teach the interface."*
- **Prisen, og derfor er den demoteret:** bjælken har da altid sin fulde bredde
  (~700 px), også med én robot valgt — den løser krav 2 dårligst af de tre. Og tre
  nummererede pladser flytter formen tættere på **kurvens** (hård begrænsning 1), også
  uden et tal: "2 af 3 pladser" er præcis den aflæsning, vi ikke må invitere til.
- **Den bliver ikke smidt væk:** det, A og B skal tage med fra den, er
  **grænsebeskeden**. Se D6.

---

## 4. Fjern-enkelt-robot, løst konkret (krav 3) — gælder alle tre retninger

**Der skal ikke opfindes noget. Mønsteret findes, er godkendt af JPK 2. sep 2026, og
dets to i18n-nøgler står allerede i begge sprogfiler.**

`assets/katalog.js` bygger i dag ét `<p class="klaebebar__navne">` med
`navne.join(' · ')`. Det bliver til en liste med ét led pr. valgt robot:

```html
<ul class="klaebebar__valg">
  <li>
    <span class="klaebebar__navn">Spot</span>
    <button type="button" class="klaebebar__fjern knap knap--tekst-moerk"
            data-saml-fjern="boston-dynamics-spot">
      <span aria-hidden="true">Fjern</span>
      <span class="kunskaerm">Fjern Spot fra sammenligningen</span>
    </button>
  </li>
  …
</ul>
```

**Hvor den sidder:** umiddelbart efter det navn, den hører til — ikke samlet i en
kolonne. Tre knapper, der alle hedder "Fjern", skal skelnes af det, der står ved siden
af dem.

**Hvad den hedder:** `saml_fjern_kort` = **"Fjern"** / **"Remove"** synligt,
`saml_fjern_navn` = **"Fjern Spot fra sammenligningen"** / **"Remove Spot from the
comparison"** til skærmlæseren. Begge findes i `data/i18n/da.json:338-339` og
`en.json:338-339`. **Ingen ny i18n-nøgle.**

**"Ingen symboler" er overholdt — og reglen er svagere, end kommentaren påstår.**
Betjeningen er ordet *Fjern*, ikke et `×`. Det skal noteres, at forbuddet i
`system.css:2445` (*"Ingen symboler af nogen art"*) allerede er brudt på **samme side**:
kortets eget stempel `.knap--maerkat` tegner `content:"+"` i hvile og `content:"\00d7"`
(et kryds) når robotten er valgt — `system.css:2692` og `:2712`. **Vi behøver ikke
ophæve reglen for at løse krav 3**, og planen foreslår ikke at ophæve den. Men den er
ikke den absolutte regel, kommentaren lyder som, og næste læser skal ikke tro det.

**Farvevalg:** `knap--tekst-moerk` (`--paafod2` på `--fod` = **5,94 : 1**, over WCAG's
4,5) — **ikke** `--frem`. Accenten (9,19 : 1) er reserveret til den ene fremadrettede
handling, `Åbn sammenligningen`. To accentfarvede ting i en 40 px bjælke ville gøre
"fjern" og "fortsæt" lige vigtige. Sammenligningssidens `knap--kant-moerk` (12,72 : 1)
er fravalgt her: en omridset knap kræver 24+ px kasse i en 40 px bjælke og ville skubbe
højden tilbage op.

**Berøringsmål — dette er en forbedring, ikke en bevaring.** I dag er bjælkens knapper
**13,2 px** høje (`min-height:0;padding:0` fra `.knap--tekst-moerk`) og klarer kun WCAG
2.5.8 via afstandsundtagelsen. `.klaebebar__fjern` får `padding:6px 8px;min-height:24px`
og opfylder **24 × 24 direkte**. Bjælken bliver altså **mindre** samtidig med at
målene bliver **større**.

**Tastatur.** Rækkefølgen bliver: `Fjern` (robot 1) → `Fjern` (robot 2) → `Fjern`
(robot 3) → `Åbn sammenligningen` → `Ryd udvalget`. Navnene er `<span>` og ikke
fokusstop. Fokusringen er bjælkens egen 2 px accent med 2 px offset
(`system.css:2482-2483`), som er valgt netop fordi sidens globale 3 px ring ville skære ud
over en 44 px bjælke — den regel gælder uændret ved 40 px.

**Fokus efter et klik — den ene ting, præcedensen gør FORKERT.**
`assets/sammenligning.js:705 fjernSlug()` kalder `opdater()`, som skriver
`resultat.innerHTML = …`. Den knap, der lige blev trykket på, findes derefter ikke, og
fokus falder til `<body>`. **Bjælken må ikke kopiere det.** Reglen:

> Efter et klik på `Fjern` flyttes fokus til det **næste tilbageværende** `Fjern` i
> bjælken. Er det sidste led fjernet, forsvinder bjælken, og fokus flyttes til
> **kortets egen sammenlign-knap** for netop den robot, hvis kortet er synligt
> (`offsetParent !== null` — kortet kan være filtreret bort), ellers til søgefeltet
> `#sog-katalog`.

**Acceptkriterium 4.1:** tre `Fjern`-klik i træk udført med tastatur, og
`document.activeElement` er **aldrig** `document.body` bagefter — målt med Playwright,
3 målinger, 0 gange `body`.

**Skærmlæseren skal have det at vide.** Bjælken har i dag `role="region"` +
`aria-label`, men **ingen `aria-live`** (målt: `null`). Listen får
`aria-live="polite"`, så den nye navneliste læses op, når et led forsvinder.
**Kun navnene** — ikke et antal. Et oplæst "2 af 3" ville være kurvens form i lyd, og
hård begrænsning 1 gælder også dér.

---

## 5. Bundpladsen (krav 4) — gælder alle tre retninger

**`scroll-padding-bottom` alene løser det ikke.** Den flytter kun, hvor et
`:target`-hop lander; den gør ikke dokumentets sidste 45,7 px læselige. CSS-kommentaren
på `system.css:2485-2489` afviser den — af den rigtige grund, men efterlader problemet
uløst, fordi den samtidig påstår, at der ikke er noget problem.

**Begge dele skal med, og de løser hver sin ting:**

1. **`padding-bottom` på `<body>`** gør dokumentets bund læselig.
2. **`scroll-padding-bottom` på `<html>`** gør `:target`-hoppet rigtigt. Det er ikke
   teoretisk her: katalogsiden har **2** links med `href="#tegn"`, og `id="tegn"`
   ligger **100 %** inde i filen — sektionen *"Sådan læses tallene"* er præcis den,
   bjælken skærer af.

**Formen, der er exakt ved enhver bredde og enhver ombrydning:**

```css
:root{ --barplads:0px; }
body{ padding-bottom:var(--barplads); }
html{ scroll-padding-bottom:var(--barplads); }
```

og `tegnSaml()` i `assets/katalog.js` sætter
`document.documentElement.style.setProperty('--barplads', bar.offsetHeight + 12 + 'px')`
når bjælken vises, og `'0px'` når den skjules.

**Hvorfor målt og ikke hårdkodet:** højden er 45,7 px ved 1440 og 69,3 px ved 390, og
den skifter ved ombrydningsgrænsen mellem 660 og 700 px. Et hårdkodet `46px` ville
efterlade 23 px dækket på mobil. Det er D7/L30-fælden — et håndskrevet tal ved siden af
et, der kan udledes.

**Prisen på flader uden bjælken: nul.** `--barplads` er `0px` i `:root`, og kun
`katalog.js` sætter den. De øvrige 215 byggede sider indlæser samme `system.css` og får
`padding-bottom:0px` — samme beregnede værdi som i dag. Men det skal **måles**, ikke
antages, fordi `system.css` deles af alle 216 sider.

**Acceptkriterium 5.1:** ved maks. rulning på katalogsiden med 1 og med 3 robotter
valgt, ved 1440, 1024 og 390 px, er `<p class="t-lille">`-elementets `bottom` **mindre
end** bjælkens `top`. Seks målinger, 0 overlap. I dag: 6 målinger, 6 overlap.

**Acceptkriterium 5.2:** på en robotside og på Om-siden er `getComputedStyle(document.body).paddingBottom`
uændret over for `main` før sporet. Måles på begge sprog, 4 sider, 0 afvigelser.

---

## 6. Højdemålet — det tal, JPK skal sige ja eller nej til

| | I dag | Foreslået |
|---|---|---|
| ≥ 700 px viewport | 45,7 px | **≤ 40 px** |
| 390 px viewport, 3 valgte | 69,3 px | **≤ 40 px** |
| Andel af 900 px viewport | 5,1 % / 7,7 % | **≤ 4,5 %** |
| Berøringsmål | 13,2 px | **≥ 24 px** |
| Dækket dokument | 45,7 / 69,3 px | **0 px** (bundplads) |

**Mobilen er den svære, og den har sit eget svar.** Tre navne + tre `Fjern` + to
handlinger kan ikke stå på én linje ved 390 px. Ombryder de, bliver bjælken ~72 px —
**værre** end i dag. Løsningen er sidens eget eksisterende mønster: **et vandret
rullespor.** Dækkets navigation er allerede `overflow-x:auto` med `scroll-padding-inline`
og en indad-tegnet fokusring (målt: `overflow-x:auto` optræder **2** gange i
`system.css`), fordi `overflow-x` ellers klipper ringen.

Ved < 700 px: **én række, 40 px.** `Åbn sammenligningen` står fast uden for sporet
(`flex:none`, 150,8 px), og de tre valgte ruller vandret i de resterende ~179 px.
`Ryd udvalget` ligger i sporets ende. Læseren swiper — samme gestus som i dækket.

**Risiko, ærligt:** et vandret rullespor kan skjule, at der ER mere. Dækket lever med
samme risiko i dag. *(antagelse: at det er acceptabelt her, fordi antallet er højst 3
og navnene står i den rækkefølge, hun selv valgte dem.)*

---

## 7. Tabulatorrækkefølgen — en rettelse, der ikke koster noget visuelt

Bjælkens knapper er fokusstop **231 og 232 af 232**, fordi
`assets/katalog.js:186` gør `document.body.appendChild(klaebebar)`. Med tre
`Fjern`-knapper mere bliver det 231–235 af 235.

`position:fixed` betyder, at **DOM-placeringen ikke påvirker den visuelle placering**.
Bjælken kan derfor indsættes **før `<main>`** i stedet for sidst i `<body>` — og bliver
da fokusstop ~3–5 i stedet for 231–235, uden at ét pixel flytter sig.

**Hvorfor det er rigtigt og ikke bare bekvemt:** bjælken findes kun, når der ER et
udvalg. Er der ét, er det opgavens aktuelle tilstand, og den hører før indholdet — samme
logik som at en skærmlæser hører "3 filtre aktive", før den hører de 77 resultater.
Er udvalget tomt, findes elementet slet ikke og forstyrrer intet.

**Acceptkriterium 7.1:** med 3 robotter valgt ved 1440 px er `Åbn sammenligningen`s
plads i den fokuserbare rækkefølge **≤ 10** (i dag: 231 af 232). Samme måling, samme
script.

---

## 8. Én beslutning pr. punkt, med prisen ved siden af

| # | Beslutning | Pris ved JA | Pris ved NEJ |
|---|---|---|---|
| **D1** | **Retning: A, B eller C.** Anbefaling: **B (SKINNEN)** | Ny formfamilie (flydende genstand med hårstreg) på et fuldbleed-site. Rører `.klaebebar`s position, bredde og kant | A: krav 1 løses kun halvt, båndet er stadig 65.790 px². C: løser krav 2 dårligst og flirter med kurvens form |
| **D2** | **Fjern-knap pr. robot, ordet "Fjern", mønsteret fra sammenligningssiden** | Bjælken går fra 2 til 5 fokusstop. Ingen ny i18n-nøgle, ingen ny komponent | Krav 3 er ikke løst. Læseren skal finde kortet i et 6.603 px dokument |
| **D3** | **Fokusreglen efter et klik** (næste `Fjern` → kortets knap → `#sog-katalog`) | ~12 linjer JS. Retter en fejl, sammenligningssiden også har | Fokus falder til `<body>` ved hvert klik. Tastaturbrugeren mister sin plads |
| **D4** | **`--barplads` sat af JS efter målt højde**, ikke et hårdkodet tal | Én custom property i `:root`, to `var()`-brug, tre linjer JS | Et hårdkodet `46px` efterlader 23 px dækket ved 390 px |
| **D5** | **Bjælken indsættes før `<main>`** i DOM'en | Skærmlæserens læserækkefølge ændrer sig: udvalget høres før kataloget | 235 tabulaturstop til en bjælke, der står permanent på skærmen |
| **D6** | **Grænsebeskeden ("højst 3") flyttes ind i bjælken** — det, C bidrager med | Bjælken får en `role="status"`-linje mere. Grænsen læres, hvor udvalget står, ikke ved kortet 3.000 px væk | Grænsen læres kun ved at ramme den |
| **D7** | **Mobilen bliver ét vandret rullespor** ved < 700 px | Læseren skal swipe for at se robot 3. Samme mønster som dækket | Bjælken bliver ~72 px på mobil — værre end de 69,3 px, JPK klagede over |
| **D8** | **Den rå `rgba`-skygge erstattes af `--paafod2`-hårstreg** | Overkanten skifter tone. Fjerner sidens eneste rå rgba-skygge | En håndskrevet farve bliver stående i et tokeniseret system |

**D1 er den eneste, der ikke kan uddelegeres.** D2–D8 er rigtige uanset retning.

---

## 9. Hvad en bygger IKKE må opfinde selv

1. **Ingen ny i18n-nøgle.** `saml_fjern_kort` og `saml_fjern_navn` findes i begge
   sprogfiler. Mangler der en streng, er svaret at spørge — ikke at skrive dansk ind i
   en skabelon.
2. **Intet tal og intet mærke.** Ingen "3", ingen "2 af 3", ingen prik, ingen badge —
   heller ikke i `aria-live`. `navne.join(' · ')` blev valgt netop for at undgå kurvens
   form (`system.css:2442`, hård begrænsning 1).
3. **Ingen anden knap end de to, der er.** Ingen "fortsæt", ingen "næste trin", ingen
   "gem udvalg", ingen "del". Ét link fremad.
4. **Ingen slagskygge.** `--skygge` og `--skygge-loeft` er `none` i `:root`, og det er
   en beslutning, ikke en forglemmelse. En flydende genstand får en **streg**.
5. **Ingen ny radius.** `--hjoerne` = 2px, L79, gælder overalt. Skriv ikke `4px` i
   hånden, og lav ikke en pille.
6. **`--accent` kun på den mørke flade og kun på den ene fremadrettede handling.**
   Accent som forgrund på lyst er 1,38 : 1 og forbudt (L76). Bjælken står på `--fod`,
   hvor den er 9,19 : 1 — det gælder **kun** dér.
7. **Ingen ny skriftgrad.** Der er allerede 56 unikke `font-size`-værdier. Brug
   DESIGN.md's `label` (11,5 px) til `Fjern` og hold navnene på den grad, retningen
   vælger — tilføj ikke en 57.
8. **`SAML_MAKS` er 3 og ændres ikke** af dette arbejde. Ændres tallet, ændres
   sammenligningssidens tabel med.
9. **`.saml-taeller` må ikke slettes.** Den er siden 2. sep 2026 permanent `hidden`,
   men den er **bærer** af tre oversatte strenge, bjælken læser med `textContent`
   (`assets/katalog.js:143,149,176`). Sletter man elementet, mister bjælken sit sprog.
10. **Bjælken findes kun med JavaScript**, og det er en beslutning: den er
    **fraværende** uden JS, ikke `hidden` — ét niveau strengere end resten af sidens
    P0-mønster (`system.css:2431`). Skriv den ikke ind i skabelonen "så den er der".
    Konsekvensen for bundpladsen: uden JS er `--barplads` `0px`, og der er ingen bjælke
    at gøre plads til. Det passer af sig selv og skal ikke særbehandles.
11. **`dist/` er genereret.** Ændringer hører i `assets/*.css` og `assets/katalog.js`.

---

## 10. Det, jeg IKKE har afgjort

- **Navnenes skriftgrad i den nye bjælke.** 14 px findes ikke i DESIGN.md's skala, men
  11,5 px (`label`) er for lille til et robotnavn ved siden af en `Fjern`-knap i samme
  grad. Der mangler et trin, og at vælge det er en systembeslutning, ikke en
  bjælkebeslutning. Hører i `impeccable typeset` på hele sitet (de 56 grader), ikke her.
- **Om bjælken skal have en overgang, når et led fjernes.** `operate.md` tillader
  150–250 ms på tilstandsskift. Jeg har ikke målt, om siden har en bevægelsesgrammatik
  at låne fra; `.knap:active{transform:translateY(1px)}` er det eneste, jeg fandt.
- **Om `Ryd udvalget` overhovedet skal overleve**, når der er tre `Fjern`-knapper.
  Argumentet for at slette den: tre klik mod ét, men én knap mindre i en bjælke, der
  er for stor. Argumentet imod: den er den eneste, der virker, når fokus er væk fra
  bjælken. Jeg har ladet den stå i alle tre retninger, men det er et valg, JPK kan
  omgøre uden at røre noget andet.

---

## 11. Efterprøvning af planen selv

**23 `fil:linje`-citater blev slået op enkeltvis med `sed -n <linje>p` + `grep`.
3 var forkerte og er rettet:** kommentarblokken begynder på 2426 (ikke 2425),
fokusringen står på 2482–2483 (ikke 2478), og *"daekker IKKE sidefoden"* står på 2485
(ikke 2487). De øvrige 20 var rigtige. **23/23 er nu OK** ved genkørsel.

**De fire kontrasttal er ikke citeret fra kildekommentarerne — de er regnet om med
WCAG-formlen, med læseretningen skrevet ud** (CLAUDE.md: *"Et kontrasttal uden en
læseretning er ikke et tal"*):

| Forgrund PÅ baggrund | Kommentaren siger | Selv beregnet |
|---|---|---|
| `--paafod2` (#9AA3A9) på `--fod` (#22262A) | 5,94 | **5,94** |
| `--accent` (#F2C400) på `--fod` | 9,19 | **9,19** |
| `--paafod` (#E8EBED) på `--fod` | 12,72 | **12,72** |
| `--accent` på `--bund` (#E8EBED) | 1,38 (ulovlig, L76) | **1,38** |

4 af 4 stemmer. Havde ét af dem afveget, ville hele afsnit 4's farvevalg have været
mistænkt, ikke kun det tal.
