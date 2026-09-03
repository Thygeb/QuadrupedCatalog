# ANALYSE — producentfladens UI målt mod DESIGN.md

**Spor:** `spor/produkort` · **Dato:** 3. sep 2026 · **Gren:** `spor/produkort`
**Flow:** `impeccable critique` + `impeccable audit`. Skillen blev kaldt med
Skill-værktøjet **fra worktreen, og kaldet LYKKEDES** — ingen diskreserve brugt.

**DETTE DOKUMENT RETTER INGENTING.** Designfrysen (L70, JPK 1. sep 2026) gælder:
*"vi skal have en overordnet designplan, inden vi retter noget design."* Hvert
punkt er et **fund**, ikke en opgave. Den eneste kode, sporet har ændret, er
leverance A's faktafejl, som frysen udtrykkeligt undtager.

**Rammen er DESIGN.md**, læst i fuld længde (834 linjer, målt). JPK's ord:
*"DESIGN.md beskriver hvordan websiden skal være designet, for at sikre
konsistens og standardisering af websidens udseende og funktionalitet."*
**Hvert fund peger på et linjenummer.** Fund uden DESIGN.md-dækning står samlet
i afsnit 3 — de er analysens mest værdifulde del.

---

## 1. MODE: Read — og hvad fladen skal lykkes med

**Producentsiden er `Read`.** Den besøgende skal **forstå** noget om en
producent; hun skal ikke løse en opgave. Katalogsiden er `Operate`. De to blev
behandlet ens i alt arbejde før 1. sep 2026, og det er stadig fladens
grundproblem.

Fladens ene berettigelse, ordret fra `producent.mjs`' eget hoved og gengivet i
`fund/PLAN-producent.md` afsnit 1: *"Siden har ét job, som robotsiden ikke kan
gøre: at vise CE-oplysningen SAMLET for hele producentens modelrække. Ét 'ikke
oplyst' er en tom rubrik; tolv under hinanden er en oplysning om producenten."*

Read-kriteriet er derfor: **kan læseren på fladen forstå, hvad vi ved om denne
producent — og hvad vi ikke ved?**

---

## 2. Fund, rangeret efter hvad de koster læseren

### F1 — DESIGN.md erklærer EU-fundet SLETTET, mens det står på 50 sider

**Målt.** `grep -ni "eu-fund" DESIGN.md` giver **2** forekomster, og **begge**
beskriver komponenten som død:

- **DESIGN.md:204-208:** *"Forsiden med hero, yderpunkter og EU-fundet … **er
  slettet** (L72) … De komponentbeskrivelser hører historien til."*
- **DESIGN.md:620-628,** afsnittet *"Slettede komponenter — historisk"*:
  *"Forsiden (`hero`, `yderpunkterne`, `EU-fundet`, `formålsfilteret`) er
  **slettet**."*

**Virkeligheden:** `.eu-fund-linje` står på **50 byggede sider** (25 producenter
× 2 sprog) med **52 elementer** efter leverance A.

```
grep -l "eu-fund-linje" dist/{da,en}/producenter/*/index.html | wc -l   ->  50
```

Designsystemet har altså **arkiveret beskrivelsen af en komponent, der stadig
sendes til brugeren.** En agent, der slår op i DESIGN.md for at finde ud af,
hvordan EU-fundet skal se ud, får ét svar: *"den er slettet."*

**Det er rodårsagen til F2.** Ingen ejer komponentens spec, så ingen opdagede,
at dens `span`-regel var uafgrænset.

**Dækket af PLAN-producent.md?** Planen kender forældreløsheden (afsnit 11.5,
*"fladen har arvet fire forældreløse abstraktioner"* fra L72), men **ikke** at
DESIGN.md aktivt fører komponenten som slettet. **Dette er NYT.**

**Pris at rette:** et afsnit i DESIGN.md's *Komponenter*. Ingen kode.

---

### F2 — Samme datatilstand tegnes i to størrelser på samme side

**Det skarpeste konsistensbrud på fladen, og det er målt på et isoleret
apparat** (egen Playwright-instans, URL bekræftet i samme kald).

På Xiaomis side står `.v-ikke` **to gange** — og de ser forskellige ud:

| Forekomst | Målt | DESIGN.md's krav |
|---|---|---|
| Header, *Hjemsted* (`.producent-fakta .v-ikke`) | **11px**, `rgb(95,104,111)` | **korrekt** (DESIGN.md:596) |
| EU-afsnittet (`.eu-fund-linje .v-ikke`) | **17px**, `rgb(84,92,99)` | **afviger** |

Samme gælder de to andre tilstande i EU-afsnittet:

| Tilstand | Målt i EU-afsnittet | DESIGN.md's krav |
|---|---|---|
| `.v-nej` | 17px, `rgb(84,92,99)` | **10,5px**, fuld `blaek` `rgb(34,38,42)` — DESIGN.md:591-593 |
| `.v-ikke` | 17px, `rgb(84,92,99)` | **11px**, `blaek3` `rgb(95,104,111)` — DESIGN.md:596-597 |
| `.v-ja` | 17px, `rgb(84,92,99)` | em-baseret `.62em` — DESIGN.md:594 |

**Årsagen, læst ud af det levende stilark:**

```css
.eu-fund-linje span { font-size: 17px; line-height: 1.5; color: var(--blaek2); }
```

`assets/generator.css:30`. Specificiteten er **0,1,1** og slår `.v-nej`s
**0,1,0** (`assets/system.css:646`). Reglen er skrevet dengang linjen kun
indeholdt **én** `<span>` — sætningen. Den er ældre end de tilstandsmærker,
leverance A lægger ind.

**Hvad der IKKE er galt:** kontrasten. Målt med WCAG-formlen, med læseretning:

```
blaek2 #545C63 PAA bund #E8EBED  =  5,68 : 1     (AA-kravet er 4,5)
```

Måleapparatet er valideret mod et kendt svar: samme funktion giver 12,72 for
`blaek` på `bund` og 4,74 for `blaek3` på `bund` — **præcis** de tal, DESIGN.md
selv trykker på linje 267 og 271. **Det er altså et konsistensbrud, ikke et
tilgængelighedsbrud**, og det skal ikke rapporteres som det sidste.

**De ni-pixels firkanter overlever:** `.v-nej .mrk` måler 9×9px fyldt
`rgb(34,38,42)`, `.v-ikke .mrk` 9×9px stiplet — begge som DESIGN.md:454-456
kræver. **Hård begrænsning 5 er altså opfyldt**; det er systemets typografi, der
skrider, ikke tilstandsalfabetet.

**Ærligt om mit eget spor:** reglen er ældre end mig, men **den anden forekomst
af `.v-ikke` er min.** Leverance A indførte tilstandsmærker i en scope, der
overstyrer dem. Alternativet — at droppe mærkerne — ville have efterladt
begrænsning 5 opfyldt af ren prosa, og `fund/PLAN-producent.md` P1 foreskriver
udtrykkeligt *"den visuelle tilstandsgrammatik, siden allerede har"*.

**Kandidatrettelsen er målt, ikke gættet — og IKKE anvendt** (designfrys, og
`generator.css` ejes af `spor/testvend`). Injiceret i browseren gav tre linjer
CSS præcis DESIGN.md's tal tilbage (`.v-nej` 10,5px/`blaek`, `.v-ikke`
11px/`blaek3`):

```css
.eu-fund-linje span.v-nej { font-size:10.5px; color:var(--blaek) }
.eu-fund-linje span.v-ikke{ font-size:11px;   color:var(--blaek3) }
.eu-fund-linje span.v-ja  { font-size:.62em;  color:var(--blaek) }
```

**Dækket af PLAN?** Nej. Planen forudsagde P1's mærker, men ikke at de ville
lande i en overstyrende scope. **NYT.**

---

### F3 — 69 % af en producentside handler om de andre producenter

**Målt ved 1440px**, sektionshøjder som andel af `.producentside`:

| Sektion | Xiaomi (2 modeller) | Unitree (13 modeller) |
|---|---|---|
| Producentens identitet (header) | 150px — **6 %** | 150px — **5 %** |
| EU | 223px — 9 % | 170px — 6 % |
| Producentens modeller | 408px — 16 % | 946px — 32 % |
| **"Alle 25 producenter"** | **1715px — 69 %** | **1715px — 58 %** |
| **I alt om DENNE producent** | **31 %** | **42 %** |

*"Alle 25 producenter"* er **konstant 1715px** uanset producent. Jo tyndere
producenten er, jo mere handler hendes side om alle andre.

**DESIGN.md-hjemmel:** filen har ingen regel om sektionsvægt — se **hul H2**.
Den nærmeste er *Overblik* (DESIGN.md:210-215) om redaktionel stilhed og
*"personligheden ligger i præcisionen"*. For **MODE Read** er 6 % til fladens
emne det, der koster læseren mest på hele siden.

**Dækket af PLAN?** **JA — `fund/PLAN-producent.md` afsnit 5.3,
*"Undersidens største element er ikke om producenten"*.** Planen har allerede
afgjort, at det er et problem. **Mit bidrag er tallene** (6 %/69 % mod
5 %/58 %), som planen ikke havde, og konstateringen af, at blokken er en
konstant, så fejlen vokser omvendt med producentens størrelse.

---

### F4 — Producentfladen har intet kildemærke, men består udelukkende af tal

`fund/PLAN-producent.md` P6 har målt det: `kildemaerke` = **142** på kataloget,
**1.545** på robotsiderne, **0** på begge producentflader — mens *hvert eneste
tal på fladen* er noget, vi har regnet.

**Efter leverance A er det blevet skarpere, ikke mildere.** Fladen trykker nu
*"1 af 2 · nej · Producenten oplyser, at der ikke er CE"*. Påstanden hviler på
en `kilde`, en `hentet`-dato og en `advarsel` i
`data/robots/xiaomi-cyberdog-2.yaml` — **og ingen af de tre kan ses på fladen.**
Robotsiden for CyberDog 2 viser dem; producentsiden gør ikke.

**DESIGN.md:573-581** definerer kildemærket som en komponent, fladen ikke
bruger. **PRODUCT.md's positionering nr. 1:** *"en journalist, der citerer ét
tal, skal kunne belægge det lige så let som en indkøber."*

**Dækket af PLAN?** Ja, P6 — som udtrykkeligt *"ikke foreslår en løsning"*.
**Mit bidrag:** leverance A hæver indsatsen, fordi et **dokumenteret nej** er
den mest bestridelige påstand, fladen kan fremsætte.

---

### F5 — Ti af elleve `forside_*`-i18n-nøgler er døde, og jeg gjorde den tiende død

**Målt** over `tools/`:

| Nøgle | Brug i kode |
|---|---|
| `forside_eu_tal` | **1** (producent.mjs) |
| `forside_eu_paastand` | **0** ← *var 1 før leverance A* |
| øvrige ni `forside_*` | **0** |

Nøglerne er navngivet efter en forside, der blev slettet 1. sep 2026 (L72), og
`tools/skabelon/forside.mjs` findes ikke. Den ene overlevende nøgle hedder
stadig `forside_eu_tal` og bruges kun af producentsiden.

**Der findes ingen test, der fanger døde i18n-nøgler** — jeg søgte efter én:
`tests/dele/63-ordbog-og-skema.mjs` jager ubrugte **databasekolonner**, ikke
i18n. Symmetritesten i `tests/dele/35:221` kræver kun, at `da` og `en` er enige.

**Ærligt:** leverance A øgede antallet af døde nøgler fra 9 til 10. Jeg har
**ikke** slettet `forside_eu_paastand` — sletning i i18n er en indholdsændring i
et område, sporet ikke ejer, og nøglen kan ønskes igen.

**DESIGN.md-hjemmel:** ingen direkte. Nærmeste princip er reglen bag
`tests/dele/57` om død CSS, gengivet i DESIGN.md:560-562: *"en variant uden
brugssted er død CSS"*. **Se hul H3.**

---

## 3. Huller i DESIGN.md — hvor fladen gør noget, systemet ikke har en regel for

Dette afsnit er analysens vigtigste, fordi det er dér, standardiseringen
mangler.

### H1 — Producentfladen har intet komponentafsnit overhovedet

**Målt.** DESIGN.md's *Komponenter* rummer ti afsnit: Dækket, Kort, Filtre,
Søgefeltet, Knapper, Kildemærket, De fire datatilstande, Nøgletalsstriben,
Stansningen, Slettede komponenter. **Ingen af dem er producentfladen.**

Ordet *"producent"* står **5** gange i hele filen, og alle fem er tilfældige:
en figur-størrelse (:355), en brudpunktsnote (:398), kortets rækkefølge (:474),
kildemærkets sekundærform (:580) og en sætning om hullers oprindelse (:214).

Klasser, fladen bygger på, og som **ikke** findes i DESIGN.md:
`.eu-fund-linje`, `.eu-fund-tal`, `.producent-fakta` (nævnt én gang, kun som
figur-størrelse), `.pnavn`, `.pland`, `.pantal`, `.prod-navne`, `.kort-legende`.

**Konsekvens:** to af analysens fem fund (F1, F2) findes, fordi ingen regel
siger, hvordan fladen skal se ud. Det er præcis den *"konsistens og
standardisering"*, JPK spørger til.

### H2 — Ingen regel om sektionsvægt eller om, hvor meget en flade må handle om noget andet

DESIGN.md regulerer farve, skrift, rum, form, dybde og komponenter — men har
**ingen** regel af typen *"en flades eget emne skal fylde mere end dens
navigation"*. F3's 69 % bryder derfor ingen skreven regel. For en `Read`-flade
er det den dyreste mangel i filen.

DESIGN.md nævner heller ikke **MODE** (Read/Operate) med ét ord, selv om
CLAUDE.md kræver, at fladens mode navngives hver gang. **Designsystemet og
arbejdsreglen taler ikke sammen.**

### H3 — Ingen regel om døde i18n-nøgler, kun om død CSS

Systemet har en test mod død CSS (`tests/dele/57`) og en beslutning om, at en
variant uden brugssted ikke må stå (DESIGN.md:560-562). Den samme tankegang er
aldrig skrevet for **sprogfilerne**, og resultatet er 10 døde nøgler (F5).

### H3b — Fladen har ingen sidefod, og DESIGN.md har ingen regel om én

**Målt på dette spors udgangspunkt (`951fd29`):** producentsiden har **0**
`<footer>`, **0** elementer med en `fod`-klasse, og ordet **"KeyResearch"
optræder 0 gange**.

**PRODUCT.md's *Brand Commitments* siger:** *"Bindende: KeyResearch nævnes som
udgiver"*, og *"KeyResearch står som udgiver i footer og på Om-siden."*
DESIGN.md nævner `--fod`/`--paafod` som **farver** (:288-291) og sidefoden som
en flade, men har **intet komponentafsnit om sidefoden**.

**VIGTIGT FORBEHOLD, så dette ikke bliver et dobbeltarbejde:** `spor/sidefod`
kører netop nu og ejer `assets/system.css` og `tools/skabelon/side.mjs`.
Målingen er taget på **min** gren og siger intet om deres. Punktet står her,
fordi **DESIGN.md-hullet** består uanset hvad de bygger — ikke som en opgave.

### H4 — Ingen regel for, hvad der sker, når en komponent gentages

`.eu-fund-linje` var designet som **ét** element. Leverance A gør den til en
**liste**. DESIGN.md har regler for gitre (:381-384) og for rummets ottetalsskala
(:378-379), men ingen for et gentaget blokelement.

**Målt følge ved 390px** på Xiaomi:

| Afstand | Målt |
|---|---|
| **Inde i** én tilstandsblok (tal-bund → ombrudt sætning) | **10px** |
| **Mellem** to tilstandsblokke | **0px** |

Nærhed grupperer altså **modsat** af meningen: det, der hører sammen, står
længere fra hinanden end det, der ikke gør. Ved 1440px ombrydes intet, hver blok
er 53px høj, og problemet findes ikke.

**0px er ikke et trin på ottetalsskalaen** (DESIGN.md:378-379, `--r1`…`--r9` =
4/8/12/16/24/32/48/64/96), og DESIGN.md:643 siger *"**Gør** rummet fra
ottetalsskalaen."* Fladen bruger her et rum, skalaen ikke indeholder.

**Dette er en direkte følge af leverance A og skal med i designplanen.** Jeg har
ikke rettet det: `.eu-fund-linje` bor i `generator.css`, som ejes af
`spor/testvend`, og en margin er en systembeslutning om rytme, ikke en
funktionsfejl.

---

## 4. Dokumentdrift, som ikke er design, men som vildleder næste agent

Tre steder, hvor projektets egne dokumenter modsiger den byggede virkelighed.
Ingen af dem er mine at rette.

1. **`PRODUCT.md:113`** skriver stadig, at fabrikantbilleder kun må bruges,
   *"så længe siden er lokal"*, og henviser til *"spærring S1"*. **CLAUDE.md:160-165**
   siger, at S1 blev **ophævet af JPK 26. aug 2026 (L37)**, og at *"ingen agent
   skal fremover føre S1 som en åben spærring"*. PRODUCT.md indlæses af
   `impeccable`s egen `context.mjs` og vil derfor blive læst som gældende.
2. **`STATUS.md:375`** fører *"Fabrikanternes pressefotos"* på listen **"Kom
   ikke igen med disse"**. Bygget kopierer i dag **611** fabrikantbilleder, og
   **25** producentsider trykker sætningen *"Fotos på kortene er producenternes
   egne."* Om *pressefotos* er en snævrere kategori end *billeder*, kan en læser
   ikke afgøre af listen.
3. **`forside.mjs` nævnes 7 gange i `tools/`**, og filen findes ikke (slettet af
   L72). To af dem lå i `producent.mjs` og er rettet af dette spor; de øvrige
   fem står i `build.mjs` og `katalog.mjs`, som sporet ikke ejer.

---

## 5. Det, der VIRKER, og som skal bevares

En analyse, der kun rummer fejl, kan ikke bruges til at beslutte noget.

1. **Fladen er webstedets reneste overholdelse af hård begrænsning 1.** Målt af
   `fund/PLAN-producent.md` 6.1 og bekræftet her: **0** `.knap`, **0**
   `<button>`, **0** `<form>` på begge producentflader. Siden handler om ét
   firma og har alligevel ingen købsknap, intet logo, ingen kontaktlinje. Det er
   ikke et tilfælde, der må opdages igen — det skal stå skrevet.
2. **CE formuleres som "oplyst / ikke oplyst", aldrig som "har / har ikke".**
   L25's regel, gengivet i PLAN 6.2. Leverance A's tredje tilstand hedder
   *"Producenten oplyser, at der ikke er CE"* — ikke *"har ikke CE"*. Ordlyden
   var færdigoversat i forvejen og er ikke opfundet af dette spor.
3. **Hullet er formgivet som tallet.** DESIGN.md:634 (*"**Gør** hullet lige så
   formgivet som tallet"*) holdes: hjemstedets *"ikke oplyst"* tegnes som en
   tilstand med stiplet kant og egen flade, ikke som en tom celle. `hjemstedAf()`
   gætter aldrig en by.
4. **Tilstandsalfabetet overlever selv en forkert typografisk scope.** De 9×9px
   firkanter måler korrekt (fyldt for nej, stiplet for ikke oplyst) selv dér,
   hvor skriftgraden skrider — så begrænsning 5 holder, også hvor DESIGN.md's
   typografi ikke gør.
5. **Ingen accent som forgrund.** L76 holdes på fladen; EU-ikonet står i
   `--blaek` (12,72 : 1) med en kommentar i `generator.css:25-26`, der forklarer
   hvorfor det ikke længere er gult.
6. **Tastatur og fokus er fladens stærkeste håndværk.** Målt ved at trykke Tab
   otte gange på en isoleret instans: **skip-linket *"Spring til indholdet"*
   kommer først**, og hvert eneste element bærer en synlig `solid 3px
   rgb(242,196,0)` fokusring. Navigationens fire punkter tegner den **indad**
   (`outline-offset: -3px`), præcis som DESIGN.md:391-393 foreskriver, *"fordi
   `overflow-x:auto` ellers klipper den"*. Tab-ordenen er logisk: skip → ordmærke
   → nav → retur → indhold. **Accent bruges her som markør, ikke som forgrund —
   L76 efterlevet i praksis.**
7. **Semantikken er i orden, og det er målt frem for antaget.** På begge flader:
   **1** `h1`, overskriftsrækken `1,2,2,3,3,2` med **nul spring**, `main`=1,
   `nav`=1, `lang="da"`, **3** `hreflang`-led. Producentindekset er en **rigtig
   `<table>` med 4 `<th>` og 4 `scope`** — modsat sammenligningsfladen, hvor Å54
   målte `<table>` 0 · `<th>` 0 · `scope` 0. Det ene billede har `alt`.
   *(Manglende `<caption>` på indekset er den eneste rest — mindre observation.)*
8. **Ingen vandret overløb ved nogen målt bredde.** 390, 768 og 1440 px:
   `scrollWidth > clientWidth` er **falsk** alle tre steder.

**Berøringsmål, præcist frem for alarmerende:** 33 links på fladen. **1** er
under WCAG 2.5.8's AA-grænse på 24px — ordmærket i topbaren, 22px højt (og
site-bredt, ikke producentfladens). De 25 links, der er under **44** px, ligger
over AA-kravet; 44px er 2.5.5 **AAA**, og DESIGN.md sætter kun 44px for
**filtre** (:498) og **søgefeltet** (:508), som er betjeningsflader — ikke for
tekstlinks i en liste. **Et råt "27 af 33 links er for små" ville være et
overdrevet tal, og det er derfor ikke rapporteret som fund.**

---

## 6. Måleapparater — og de to, der var i stykker

**Rapporteret, fordi et tal fra et forstyrret apparat ikke er et tal.**

- **`impeccable`s `detect.mjs` kører degraderet og må ikke bruges her.**
  Valideret mod et kendt svar: en kontrolside med ~10 bevidste fejl (7px skrift,
  `#eee` på `#fff`, `div` med `onclick`, `img` uden `alt`, h1→h4-spring, tom
  `<button>`, `input` uden label, "Læs mere"-link, fast 1400px bredde,
  marketing-floskel) gav **1 fund af ~10** — kun floskel-reglen, som er ren
  regex. På den ægte side giver den `[]` og **exit 0**, med denne linje på
  stderr: *"DEGRADED - HTML parser modules unavailable … findings are an
  undercount, not a clean bill of health."* **Ingen af dens tal er brugt i denne
  analyse.**
- **Den delte Playwright-browser gav et forkert svar midt i målingen.**
  `browser_navigate` meldte ANYbotics, mens `location.href` stadig var Xiaomi og
  senere producentindekset — fordi analysens to underagenter kørte i **samme**
  browserinstans og navigerede samtidig. Fejlen så ud som et ægte nul
  (*"intet `v-ja` fundet"*). Alle tal i F2 er derfor **gentaget på en isoleret
  Playwright-instans med `location.href` læst i samme kald**, og de to
  apparater er enige.

---

*Fortsættes: syntesen af `impeccable critique`s to uafhængige vurderinger
(Assessment A: design review · Assessment B: detektor + browser-evidens)
skrives ind, når begge har afleveret.*
