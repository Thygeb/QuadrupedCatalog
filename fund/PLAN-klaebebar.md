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
| `.klaebebar` ligger i `system.css` ~linje 2315 | Kommentarblokken begynder **2425**, reglen **2447** |
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

**CSS-kommentaren på `system.css:2487` er direkte forkert.** Der står:
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
