# KRITIK-2-side.md — UI/UX-review af den byggede side

25. aug 2026, bestilt af JPK ("Lav et ui ux review af hjemmesiden"). Reviewet er
orkestratorens (Fable) — skærmbilleder ved 1440 og 390 px af forside, katalog,
sammenligning, robotside og producentside, målinger taget inde i siderne, og
prosa-scanneren kørt på fem nøglesider. Byg: `ec111b3`, 77 robotter / 213 sider.

**Præmis:** Læseren er den nysgerrige fagperson (L31) — presse, studerende, folk
i branchen. Sidens ene handling: at man finder en robot og går efterprøvet
videre til producentens egen side. Det, der ville få dem til at gå: mistillid
til tallene eller følelsen af en salgsside.

---

## Dom

Siden har noget, næsten ingen katalogsider har: en ærlighed, der kan **ses** —
fire visuelt adskilte datatilstande, kildemærker på hvert tal, og en
sammenligning, der nægter at kåre vindere. Det er dens signatur, og den holder.
Men den lækker sit eget maskinrum ud på de offentlige kort: interne
revisionsnoter med kontrolsummer og henvisninger til projektets egne
arbejdsdokumenter står ordret på katalogsiden. Og dens to udstillingsvinduer —
forsidens "Fra kataloget" og sammenligningens standardtrio — viser henholdsvis
en alfabetisk tilfældighed og en næsten tom kolonne frem for katalogets styrke.
Det største problem er ikke udseendet; det er, at siden tre steder viser det
forkerte indhold frem.

## Fem-sekunders-testen

**Hvad siden gør:** "Et opslagsværk, der sammenligner firbenede robotter tal
for tal, med kilde og dato på hvert tal." Heroen består — sætningen kunne ikke
stå hos en konkurrent. · **Næste skridt:** "Se alle 77 robotter" — utvetydigt.
· **Det jeg husker:** kilde-ærligheden og de stiplede "ikke oplyst"-bokse — og
desværre også en katalogkort-tekst om sha256-kontrolsummer.

## Fund

### 1. [Blocker] Interne revisionsnoter står på offentlige kort
**Hvor:** Katalogsiden, Jueying Lite3's kort (dist: `da/robotter/index.html`,
billednoten); samme klasse af tekst i title/tekst på flere kort (fx linje 2091:
"Krydstjek: 14 km/t = 8,699 mph, gaar op. **FUND-vest kildeangav** ogsaa…").
**Bevis:** ~15 linjer på Lite3-kortet: *"IKKE det tidligere afviste delte
'andre produkter'-miniaturebillede (pro1.png/pro4.png, **sha256 4eb65513a6…** —
byte-identisk paa tvaers af Lite3-, X20-, X30-…)"* — interne filstier,
kontrolsummer og dokumentnavne, synligt for enhver besøgende.
**Hvorfor:** Det er maskinrummet på ydersiden. For fagpersonen ligner det en
fejl; for alle andre er det støj, der æder kortets plads og troværdighed.
Noterne er skrevet til projektets egen revision, ikke til læseren.
**Fix:** Skabelonen holder op med at rendere `billede.note` på kort; interne
krydstjek flyttes fra `advarsel` (synligt felt) til `noter` (internt), og der
indføres en redaktionel regel: `advarsel` bærer kun producentvendte forbehold.
**Accept:** `grep -riE "sha256|FUND-" dist/` giver 0 forekomster.

### 2. [Major] "Fra kataloget" er alfabetisk, ikke et udsnit
**Hvor:** Forsiden, sektionen "Fra kataloget" (6 kort).
**Bevis:** A1, A2, A2-W, AlienGo (fire Unitree), AlphaDog C500, C501 (to
WEILAN) — de første seks slugs i alfabetet, fire fra samme producent.
**Hvorfor:** Sektionen påstår et udsnit af kataloget, men viser et
alfabethoved. Fire Unitree-kort på forsiden læses som fremhævelse — præcis det,
L17 besluttede at undgå ("at vælge én ville være en anbefaling") — og to af
seks kort står med tom plade.
**Fix:** Deterministisk spredning: ét kort pr. vægtklasse-sal og højst ét pr.
producent, valgt efter specifikationstæthed (så udvælgelsesreglen er målbar og
kan skrives på siden). Ingen tilfældighed — bygget skal være reproducerbart.
**Accept:** De 6 kort repræsenterer 6 forskellige producenter og mindst 3
vægtklasser, og reglen står som én sætning under sektionen.

### 3. [Major] Sammenligningens standardtrio viser en næsten tom kolonne
**Hvor:** `/sammenligning/`, standardvalget ANYmal X · Go2 · Spot.
**Bevis:** ANYmal X: **4 af 30 felter oplyst** — kolonnen er 26 stiplede
"ikke oplyst"-bokse fra ende til anden.
**Hvorfor:** Standardvisningen er sidens udstillingsvindue for dens stærkeste
funktion. Førstegangsbesøgende møder en væg af tomhed og konkluderer "der er
ingen data her" — det modsatte af sandheden (1.110 kildebelagte tal).
Ærligheden om huller er en styrke på robotsiden; som førstevisning er den en
selvskade.
**Fix:** Standardtrio = tre af de tættest dækkede robotter fra tre forskellige
producenter (målt i dag ville det være fx Gangben L2 77 % · Vision 60 73 % ·
Spot 67 %), udledt af bygget — aldrig håndskrevet.
**Accept:** Hver standardkolonne viser ≥ 15 af 30 felter oplyst.

### 4. [Major] Kortenes fodnoter gentager det samme 77 gange
**Hvor:** Alle kort på forside, katalog og producentsider.
**Bevis:** *"Producentens eget billede. Ikke krediteret, ingen tilladelse."*
står på 54 kort; *"Kortets tal kommer fra N kilder — se mærkerne"* på alle 77.
**Hvorfor:** Legendetekst er sat som fodnote pr. kort. Gentagelsen begraver de
fodnoter, der faktisk er kort-specifikke (delt foto, afvist billede), og gør
kortrækkerne ujævne. Det er den samme oplysning 77 gange — én gang havde været
information, 77 gange er støj.
**Fix:** Én legendelinje pr. side (under filterbjælken/sektionens top); på
kortet står kun det, der afviger fra standarden.
**Accept:** Standardteksterne forekommer højst 1 gang pr. side i dist.

### 5. [Major] Katalog og sammenligning vejer 345/351 KB HTML + 479 KB JSON
**Hvor:** `da/robotter/index.html` 345 KB · `da/sammenligning/index.html`
351 KB (indlejret JSON) · `robots.json` 479 KB — målt på bygget.
**Hvorfor:** Lokalt uden betydning, men strukturen skalerer lineært: ved 150
robotter er sammenligningssiden ~0,7 MB HTML før billeder. En del af vægten er
gentaget prosa (samme advarsel-citater dubleret i title-attribut + tekst + den
indlejrede JSON).
**Fix (når lancering nærmer sig, ikke nu):** fjern title-dubletterne, og lad
den indlejrede sammenligning-JSON kun bære de 30 felters visningsværdier, ikke
de fulde kildecitater.
**Accept:** sammenligningssiden ≤ 150 KB ved 77 robotter.

### 6. [Minor] "Strøm ud" viser samme værdi to gange i sammenligningen
**Hvor:** `/sammenligning/`, rækken "Strøm ud", Spots celle.
**Bevis:** Cellen viser *"ureguleret DC 35-58,8 V, 150 W pr. port"* **og**
derudover intervallet "35-58,8 V" — samme tal to gange, fordi feltet i data har
både `vaerdi` (tekst) og `vaerdi_min/maks`, og `feltVisning()` renderer begge.
**Fix:** Når både tekstværdi og interval findes, vises kun tekstværdien
(intervallet er dens maskinlæsbare skygge, ikke en ekstra oplysning).
**Accept:** Én værdi pr. celle; testes i sammenligningens DOM-shim-test.

### 7. [Minor] Yderpunkternes layout modsiger deres egen billedtekst
**Hvor:** Forsiden, "Feltets yderpunkter".
**Bevis:** "Hurtigste" (Lynx S10) får et kort på ~10× de tre andres areal;
billedteksten siger *"ikke et udvalg og ikke en anbefaling"*.
**Hvorfor:** Layoutet siger "denne er vigtigst", teksten siger det modsatte —
og layout vinder altid over tekst. Det er ikke en L17-overtrædelse i ånden,
men det er en selvmodsigelse på sidens mest sete skærm.
**Fix:** Fire ligestillede kort — eller rotér deterministisk hvilken af de fire
der får storformatet (fx efter ugenummer), så størrelsen beviseligt ikke er en
rangering.
**Accept:** Enten fire ens kortstørrelser, eller rotationsreglen skrevet på
siden.

### 8. [Minor] Sammenligningens vælger er 77 chips uden søgning
**Hvor:** `/sammenligning/`, "Vælg robotter".
**Bevis:** 77 afkrydsningschips i alfabetisk rækkefølge; katalogsiden har et
søgefelt, vælgeren har ikke.
**Hvorfor:** At finde én bestemt model kræver visuel skimning af 77 navne. Ved
næste kandidatrunde er det 90+. Byggerens egen rapport flagede det samme.
**Fix:** Genbrug katalogsidens søgefelt-mønster som filter over chipsene.
**Accept:** Indtastning af "gang" reducerer synlige chips til Gangben-familien.

### 9. [Note] To bevidste tilstande, der skal huskes før lancering
S1-banneret (sort bjælke om billedtilladelser) og "MIDLERTIDIGT NAVN"-chippen
er **korrekte** i dag — de er projektets egne spærringer (S1/L26, L18/Å1) gjort
synlige. De er ikke fund; de er hegn. Men begge skal falde ved lancering, og
banneret er i dag det allerførste, enhver besøgende læser.

## Behold dette

- **De fire datatilstande** (tal · 0 · NEJ · stiplet "ikke oplyst") visuelt
  adskilte overalt — det er sidens rygrad og dens ærligste påstand.
- **"Sådan læses tallene"-legenden** og linjen *"Vi markerer ikke en vindercelle
  … siden kender ikke anvendelsen"* — den mest særprægede sætning på sitet.
- **Målepladerne** (LÆNGDE × HØJDE-boksen) for robotter uden foto — et hul
  forvandlet til information; målt i dag viser alle 23 fotoløse robotter den.
- **Footerens** *"Vi er ikke forhandler af nogen robot på denne side"* og
  forsidens "2 af 77 oplyser CE" — mod til at vise små tal.
- **Vægtklasse-salene** med romertal og live-optalte antal (18/19/29/11).

## Det jeg ikke kunne bedømme

Hover/motion og tastaturnavigation (headless skud); ydelse på rigtigt netværk
og rigtig mobil; den engelske udgave i dybden (kun forsiden skimmet — pariteten
med dansk bør have sin egen runde, det er dér oversættelsesfejl gemmer sig);
producentsiden (skudt, ikke gransket). Prosa-scanneren gav 99 kandidater — alle
gennemset, næsten alle er engelske decimaler **inde i producentcitater** (i
orden) eller falske særskrivnings-flag; ingen hype-vokabular fundet i egen
prosa på de fem sider.

## Målingernes forbehold

To "fund" blev afvist af mine egne kontrolmålinger, inden de nåede listen:
kort, der så billedløse ud i skærmbillederne (målt inde i siden: 54/54 billeder
indlæst, 23/23 måleplader, 0 blanke — skudkapløbet igen, jf.
`visuel-qa-skudkaploeb`-hukommelsen), og "afskåret" mobiltekst (0 px vandret
overløb målt). Filterchips målt til 125×44 px — over tap-minimum. Fodnoteskrift
målt til 17 px på 390 px — over læsbarhedsgrænsen.
