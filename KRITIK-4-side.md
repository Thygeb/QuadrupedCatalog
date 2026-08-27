# KRITIK-4 — komplet review af alle flader, dansk og engelsk

Bestilt af JPK 27. aug 2026 som stående ordre: *"START et komplet review af siden og start
implementering efterfølgende."* Kørt af orkestratoren med `ui-ux-critique` efter at alle fire
spor (`indeks`, `kildetjek`, `paastande`, `typografi`) var flettet.

**Grundlag.** Main på `25b6dec`. validate 77 filer/0 fejl/1 advarsel · tests 424 beståede/2 røde ·
213 sider. Serveren er verificeret mod disken før ét eneste tal blev brugt: `system.css` over HTTP
er byte for byte identisk med `assets/system.css` (54.239 bytes begge steder).

**Metode.** Fuldsideskud af otte flader × to bredder (1440 og 390) med Playwright uden for repoet,
læst med egne øjne; `maal.mjs` på fire flader × to bredder; og fem node-målinger over det byggede
output. Skudene ligger i `C:/Praktik/websites/maalevaerktoej/skud-kritik4/`.

**Antagelse om brugeren**, skrevet frem fordi den styrer hele dommen: en teknisk indkøber eller
forsker, der allerede ved hvad en firbenet robot er, og som skal sammenligne konkrete modeller på
konkrete felter. Ikke en tilfældig besøgende, der skal overbevises om kategorien.

---

## Dom

**Siden virker, og dens signatur er intakt — men den bryder sit eget kerneløfte tre steder, og det
ene af dem står bogstaveligt i samme skærmbillede som løftet selv.** Fem-sekunders-testen består
uden forbehold: man ved efter ét blik hvad siden er, hvad man skal gøre, og hvad man vil huske.
Mekanisk er den i bedre stand end nogen tidligere kritikrunde har målt — nul vandret overløb, nul
beskårne billeder, nul højdespring inden i en række, på alle fire målte flader ved begge bredder.
Det er `spor/plader`, `spor/instrument2` og `spor/typografi`s fortjeneste, og den skal ikke rulles
tilbage.

**Problemet er ikke længere layoutet. Det er teksten og provenienskæden.** 1.616 forekomster af
translittereret dansk står i brødtekst på 134 sider — ord som *"vaegt"*, *"laengde"* og
*"erklaering"* midt i danske sætninger, og de står også på de 67 engelske sider. Producentsiden
trykker sætningen *"Kortenes tal har kilde — et hævet bogstav ved tallet peger på hvilken"*
direkte over tretten kort, hvor der ikke findes ét eneste hævet bogstav. Og hver eneste robotside
åbner med *"Ikke krediteret, ingen tilladelse"* — en spærring, JPK ophævede for to dage siden med
den udtrykkelige tilføjelse, at den heller ikke skal omtales.

**Ingen af de tre er nye fejl. Alle tre er kendte fund, der overlevede den runde, som skulle lukke
dem** — og det mønster er selv det vigtigste fund i dokumentet. Se afsnittet *Mønsteret* til sidst.

---

## Fem-sekunders-testen

Skrevet ned fra hukommelsen efter ét blik på forsiden, før nogen kode blev læst:

**Hvad siden gør:** et opslagsværk over firbenede robotter, hvor 77 modeller fra 25 producenter
sammenlignes felt for felt, og hvert tal bærer kilde og hentedato.
**Næste skridt:** *"Se alle 77 robotter"* — utvetydig, og gentaget hvor man forventer den.
**Det jeg husker:** *"hvert hul er lige så synligt som tallet."* Det er sidens tese, og den er
synlig i selve designet — de stiplede "ikke oplyst"-felter fylder lige så meget som tallene.

Det er en usædvanlig god score. Sammenlign med KRITIK-3, hvor svaret på det tredje spørgsmål var
kortenes udseende og ikke deres pointe.

---

## Fund

### 1. [Blocker] Translittereret dansk står i brødtekst på 134 sider — og på begge sprog

**Hvor:** `data/robots/*.yaml`, felterne `advarsel:` og `noter:`. Renderes på robotsider,
katalogkort, forsidens yderpunktplader og producentkort.

**Bevis:** målt over det byggede output med tags strippet — **1.616 forekomster fordelt på 158
HTML-filer**, heraf **67 danske og 67 engelske robotsider**. Hyppigst: `gaaende` (374),
`staaende` (242), `hoejere` (84), `vaerdi` (78), `raekke` (72), `vaegt` (62), `graense` (62),
`naevner` (58). På Boston Dynamics' side står ordret:

> *"Databladets afsnit hedder ordret Safety and Compliance, United States og **naevner** ISO 12100
> … Ingen CE, ingen EU-**erklaering**. Feltet er ikke_oplyst - IKKE nej: databladet henviser til et
> Information for Use-dokument, vi ikke har **aabnet**."*

og

> *"To producentkilder: produktside (K1) og producentens eget datablad (K2, **maerket** Updated:
> 05/22/2024). De er uenige om **laengde** og **vaegt**."*

**Hvorfor:** en dansksproget side, der staver dansk forkert i sin egen brødtekst, kan ikke bære en
påstand om omhu med tal. Det er ikke en stavefejl — det er en skriveform, der hører til i interne
agentdokumenter (`KRITIK-1-plan.md` fastsatte den bevidst), og som er sivet ned i de eneste
fritekstfelter, læseren møder. **Dertil kommer, at teksterne er danske på de engelske sider:** en
engelsk læser får dansk prosa med ødelagt stavning.

**Fundet er ikke nyt.** `fund/FUND-i18n.md` afsnit F2 målte det den 24. aug: *"42 af de 61 danske
sider viser stadig translittereret dansk … Den bør have sin egen runde."* Samme dokument skriver, at
fundet **ikke** blev ført over i STATUS.md, med begrundelsen at alle parallelle grene skrev i den
fil. Det blev aldrig ført over senere, og kataloget er siden vokset fra 46 til 77 robotter — så
fundet voksede fra 42 sider til 134.

**Fix:** omskriv de **319 `advarsel:`/`note:`-tekstfelter i 73 af 77 datafiler** til korrekt dansk
med æ/ø/å. Det er ikke søg-og-erstat: `vaegt` → `vægt` er sikkert, men `staaende`/`gaaende` optræder
også som feltnavne, og en blind erstatning ville ramme dem. **Acceptkriterium:** kommandoen i
`fund/FUND-kritik4-translit.md` giver **0** forekomster i synlig tekst i `dist/`, og
`node tools/validate.mjs` giver uændret 77/0.

---

### 2. [Blocker] Producentsiden trykker provenienspåstanden direkte over kort, der ikke har den

**Hvor:** `dist/<sprog>/producenter/<slug>/index.html`. Sætningen står i `kort_legende`; kortene
bygges af `kompaktStribe()` i `tools/skabelon/producent.mjs`.

**Bevis:** på Unitrees producentside står linjen

> *"Fotos på kortene er producenternes egne. Kortenes tal har kilde – et hævet bogstav ved tallet
> peger på hvilken."*

og under den tretten robotkort. Målt over alle producentsider: **0 kildebogstaver** (`kildemaerke`
optræder 0 gange i hver eneste af de 25 producentsider på hvert sprog). Testen
`tests/dele/20-aflaesningslinje.mjs` fanger det og står rød med vilje: **0 af 154 striber** bærer
mærket. Årsagen er præcis: `producent.mjs` destrukturerer `const { html, hul } = vaerdi(...)`,
mens `vaerdi()` returnerer `{ html, hul, maerke }` — mærket regnes ud og smides væk.

**Hvorfor:** det er sidens ene løfte, modsagt i samme skærmbillede, på 50 sider. En læser, der
tjekker påstanden dér hvor den står, finder den falsk med det samme. Alle andre fund på listen
koster troværdighed indirekte; dette koster den direkte.

**Fix:** før `maerke` med ud i `kompaktStribe()`. **Ankeret skal løses, ikke ignoreres:** mærkets
`href` er `#kilde-<bogstav>`, og kildelisten står på robottens egen side, ikke på producentsiden —
så et naivt mærke bytter et manglende bogstav ud med et dødt anker. Enten peger mærket på
`../../robotter/<slug>/#kilde-<bogstav>`, eller det renderes som ikke-link med `title`.
**Acceptkriterium:** `tests/dele/20-aflaesningslinje.mjs` bliver grøn, og
`node tools/linktjek.mjs` giver fortsat 0 døde interne links.

---

### 3. [Blocker] Hver robotside åbner med en spærring, der blev ophævet for to dage siden

**Hvor:** i18n-nøglen `billede_uden_tilladelse`, kaldt fra `tools/skabelon/robot.mjs:367` og
`tools/skabelon/side.mjs:1078`.

**Bevis:** målt som synlig tekst i det byggede output — **304 forekomster i 152 filer** (76
robotter × 2 sprog). På ANYmal-siden er det den anden linje, læseren møder, direkte under
hovedfotoet:

> *"Producentens eget billede. Ikke krediteret, ingen tilladelse."*
> *"Manufacturer photo. Uncredited, no permission."*

**Hvorfor:** JPK ophævede S1 den 26. aug (L37) og sagde udtrykkeligt, at spærringen **heller ikke
skal omtales på websiden**. `spor/s1` fjernede banneret, `spor/legende` rettede `kort_legende` på
54 sider (Å26) — og denne tredje forekomst, som er større end de to andre tilsammen, overlevede
begge, fordi hvert funds ordlyd navngav ét sted. Sætningen fortæller desuden læseren, at siden
bruger materiale uden lov, hvilket er en juridisk selvanklage uden noget formål.

**Fix:** følg Å26's præcedens — behold kildeoplysningen, fjern tilladelsespåstanden. Fx
*"Producentens eget billede."* / *"Manufacturer's own photo."* **Acceptkriterium:**
`ingen tilladelse|no permission|uncredited|Ikke krediteret` giver **0** i synlig tekst i `dist/`,
mens strengen *"Producentens eget billede"* fortsat står på de 152 sider.

---

### 4. [Major] Robotsidens første skærm bruger under halvdelen af sin bredde

**Hvor:** `dist/da/robotter/<slug>/index.html`, hovedet — `tools/skabelon/robot.mjs`.

**Bevis:** ved 1440 fylder fotoet venstre ~55 %. Højre kolonne indeholder producentnavn, land,
status, robottens navn, vægtklasse, to anvendelseschips og ét link — og derunder **intet** til
fotoets underkant. Nøgletalsstriben, som er det, brugeren kom efter, begynder først under fotoet.

**Hvorfor:** det er sidens vigtigste flade og den, en besøgende lander på fra Google. Den tomme
halvdel er ikke ro — den er en aflæsningslinje, der er skubbet under folden uden grund. Det er
nøjagtig samme form som K11, der blev rejst om producentsiden, og som ingen har rejst om robotsiden.

**Fix:** flyt nøgletalsstriben (fem felter) op i højre kolonne ved siden af fotoet på brede skærme,
og lad den falde under fotoet ved smalle. **Acceptkriterium:** ved 1440 står mindst tre af de fem
nøgletal over folden (målt som `offsetTop < 900`), og `maal.mjs` giver fortsat 0 vandret overløb ved
1440 og 390.

---

### 5. [Major] Interne feltnavne står som kode i danske sætninger

**Hvor:** samme felter som fund 1, men et andet problem. Målt: **71 forekomster i 32 datafiler** —
`sikkerhed_overvaagning` (25), `forsvar_beredskab` (20), `forskning_udvikling` (11), `ikke_oplyst`
(11), `forbruger_uddannelse` (4).

**Bevis:** på Spots side: *"Feltet er **ikke_oplyst** - IKKE nej: databladet henviser til et
Information for Use-dokument, vi ikke har aabnet."*

**Hvorfor:** understregen røber, at læseren ser kodens eget navn på en tilstand. Sætningen er
indholdsmæssigt vigtig — den forklarer netop hård begrænsning 5's skel mellem *ikke oplyst* og
*nej* — men den siger det i maskinens sprog. R19-vagten, der blev bygget til præcis denne familie,
fanger den ikke, fordi enum-**værdierne** ikke står på dens liste.

**Fix:** omskriv til dansk (*"Feltet er ikke oplyst — og det er ikke det samme som nej: …"*) og
udvid R19 med enum-værdierne, så tilstanden ikke kan komme igen. Tages sammen med fund 1, samme
filer. **Acceptkriterium:** 0 forekomster i synlig tekst, og R19 fejler på et bevidst ødelagt
eksempel.

---

### 6. [Major] Forsidens seks kort bryder som fem plus en forældreløs

**Hvor:** forsidens *"Fra kataloget"*, `dist/da/index.html`.

**Bevis:** `maal.mjs` ved 1440: **6 kort i 2 rækker**. Skuddet viser fem kort på række 1 og ét
alene på række 2, med fire tomme pladser ved siden af. Ved 390 er det 6 rækker, hvilket er rigtigt.

**Hvorfor:** den forældreløse læses som en fejl, ikke som en sektionsafslutning, og den står lige
over sidens vigtigste gentagne CTA. Sektionen viser desuden *"6 af 77"* — tallet 6 er valgt, ikke
givet, så det kan vælges igen.

**Fix:** enten seks kort i én række på brede skærme, eller 3 + 3. **Acceptkriterium:** `maal.mjs`
ved 1440 giver `raekker: 1` eller to lige lange rækker (ingen række med færre end halvdelen af
den bredeste).

---

### 7. [Major] Yderpunkternes fire fotoplader taler fire visuelle sprog

**Hvor:** forsidens *"Feltets yderpunkter"*, fire plader.

**Bevis:** i skuddet ved 1440: plade 1 (Y10) hvid robot der fylder pladen; plade 2 (S1-W) et lille
sort billede med brede hvide margener til begge sider; plade 3 (Lynx S10) et fotografi kant til
kant; plade 4 (MOVENEW P1) sort baggrund kant til kant. `maal.mjs` bekræfter, at **ingen** af dem
er beskåret — problemet er ikke beskæring, det er at fire forskellige billedforhold og
baggrundsfarver står side om side i en række, hvis hele pointe er sammenlignelighed.

**Hvorfor:** dette er K6 fra KRITIK-3, som `spor/plader` løste for formen (VITRINE-rammen) men ikke
for billedernes indbyrdes udseende. Rækken skal læses som ét instrument med fire aflæsninger; i dag
læses den som fire løsrevne kort.

**Fix:** giv pladen en fælles baggrundsfarve og et fælles indre format, så billedets eget forhold
ikke ændrer pladens udseende. **Ikke** beskæring — hård begrænsning mod at ændre fabrikantens
billede står ved magt. **Acceptkriterium:** de fire billedleds egen kasse har samme bredde og højde
ved 1440 (målt i browseren), og `beskaaretOver25pct` er fortsat 0.

---

### 8. [Minor] Katalogkortenes højde spænder 127 px

**Bevis:** `maal.mjs` på `/da/robotter/` ved 1440: `kortHoejde` **404–531 px**, men
`stoersteSpringIRaekke: 0`. Rækkerne er altså indbyrdes ensartede, mens rækkerne indbyrdes ikke er.

**Hvorfor:** det er KRITIK-3's K3 målt ordentligt. Det er ikke et takket gitter — det er
17 rækker med hver sin højde, og forskellen kommer fra antallet af anvendelseschips, ikke fra
nøgletallene. Det er kosmetisk, ikke et aflæsningsproblem, og derfor Minor.

**Fix:** lås chipsområdet til to linjer med overløbsmærke, eller lad være. **Acceptkriterium:**
spændet under 60 px, eller en skreven beslutning om at beholde det.

---

### 9. [Minor] Producentoversigtens 25 rækker regner ingenting ud

**Bevis:** skuddet af `/da/producenter/`: 25 rækker med navn til venstre, land og modelantal til
højre, og cirka to tredjedele tom bredde imellem.

**Hvorfor:** K12 fra KRITIK-3, uændret. Siden har dækning for iagttagelser, den ikke gør — fx at
14 af 25 producenter er kinesiske og står for 62 af 77 modeller. Det er en beregning på egne data,
ikke en redaktionel vurdering, så hård begrænsning 6 er ikke i vejen.

**Fix:** en talkolonne, der kan sorteres, og én beregnet linje over listen.
**Acceptkriterium:** listen kan sorteres efter modelantal uden JavaScript.

---

### 10. [Minor] Tre kald til handling til samme mål på forsiden

**Bevis:** *"Se alle 77 robotter →"* i heltefeltet, *"Se alle 77 robotter →"* under kortene, og
*"Se hele kataloget →"* i afslutningen. Alle tre peger på `/da/robotter/`.

**Hvorfor:** den tredje svækker de to første. Afslutningens knap har desuden en anden ordlyd for
samme mål.

**Fix:** behold heltefeltets og afslutningens; fjern den midterste, eller lad den være et diskret
tekstlink.

---

### 11. [Note] En kodekommentar beskriver en tilstand, der ikke findes mere

**Bevis:** `tools/skabelon/producent.mjs:87-88` skriver: *"producentby staar paa 9 af Unitrees
filer og mangler paa de oevrige."* Målt i dag: **0 af Unitrees 13 filer** bærer `producentby`.
Adfærden er stadig rigtig (ingen by oplyst → *"ikke oplyst"*, aldrig et gæt), men begrundelsen i
kommentaren er forældet.

---

## Behold dette

Fem ting, som en rettelsesrunde ikke må ødelægge:

1. **Hulsproget.** De stiplede *"ikke oplyst"*-felter, der fylder lige så meget som et tal, er
   sidens signatur og hele beviset for heltefeltets påstand. Laikago-kortet med fem huller og
   status *UDGÅET* er sidens bedste enkeltside.
2. **Fodnoten i bunden:** *"Vi er ikke forhandler af nogen robot på denne side, og vi modtager
   ikke betaling fra producenterne."* Den bærer hård begrænsning 1 synligt og skal blive stående
   ordret.
3. **De beregnede tavshedstal** — *"2 af 77 robotter oplyser CE-mærkning"*, *"0 af 13"* på
   producentsiden. Det er sidens skarpeste iagttagelse, og den er regnet, ikke vurderet.
4. **Nøgletalsstribens aflæsningslinje.** Fem felter, fast orden, tabellariske cifre, samme sted på
   hver flade. Det er `spor/typografi`s resultat, og det er målt: 0 værdier ud over cellen på seks
   flader × tre bredder.
5. **Heltefeltets ordlyd.** *"Firbenede robotter, felt for felt"* plus *"hvert hul er lige så
   synligt som tallet"* består både bytte- og negationstesten. Ingen konkurrent ville skrive den
   anden halvdel.

---

## Mønsteret — det fund, der er større end de ti

**Tre af de elleve fund er kendte fund, der overlevede den runde, som skulle lukke dem.** Ikke
fordi arbejdet var sjusket — hver runde lukkede præcis det, dens fund navngav:

| Fund | Kendt siden | Hvorfor det overlevede |
|---|---|---|
| 1 (translitteration) | 24. aug, `FUND-i18n.md` F2 | Fundet blev bevidst ikke ført over i STATUS.md, fordi grene skrev i filen. Det blev aldrig ført over senere |
| 3 (S1-sproget) | 26. aug, L37 + Å26 | Banneret og legenden blev rettet; den tredje forekomst blev ikke nævnt i noget funds ordlyd |
| 5 (enum-navne) | 27. aug, Å33 | Fundet er en dag gammelt og har endnu ikke haft en runde |

**Fælles form: en sag lukkes dér, hvor fundets ordlyd peger, og overlever alle andre steder.** Det
er derfor `flet`-skillens punkt 7 findes — *"hvor ELLERS findes det her?"* — og de to første fund
er begge fra før den regel blev skrevet. Fund 3 blev fanget netop af den regel, i denne runde.

**Den anden halvdel af mønsteret er dyrere: et fund, der ikke står i STATUS.md, findes ikke.**
F2 er skrevet omhyggeligt, med måling og genkørbar kommando, i et dokument ingen læste igen. Dets
egen forfatter forudsagde problemet og bad om, at fundet blev ført over — og det skete ikke.
Kataloget voksede 63 % i mellemtiden, og fundet voksede med det. **Enhver FUND-fil, der ender med
"bør føres over i STATUS.md", skal føres over samme dag, af den der fletter.**

---

## Det jeg ikke kunne bedømme

- **Bevægelse og interaktion.** Skuddene er statiske. Hover-tilstande, fokusringe i brug, og
  sammenligningssidens JavaScript-adfærd er ikke prøvet. Tidligere runder har målt hover-zoomen
  til 2,4 %, hvilket er under sansegrænsen — det står uændret.
- **Faktuel rigtighed af tallene.** Dette er en review af fladen, ikke af data. `validate.mjs`,
  `rundtur.mjs` og `kildetjek.mjs` dækker den side.
- **Sammenligningssidens flade i brug.** `maal.mjs` rapporterer 0 kort på den, fordi den ikke
  bruger kortmarkuppen; jeg har set skuddet, men ikke prøvet at vælge robotter og læse tabellen.
- **Rigtig mobil.** 390 px er en emuleret bredde uden browserens egen krom. Tommelrækkevidde og
  faktisk skriftstørrelse på en telefon er ikke prøvet.
- **De 67 engelske sider ud over katalog og forside.** Jeg har målt translitterationen på dem, men
  kun set to engelske flader som skud.
