---
target: katalogsiden, robotsiden og forsiden (dist/da/)
total_score: 20
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
timestamp: 2026-08-28T12-12-27Z
slug: dist-da-robotter-index-html
---
# Critique — katalogsiden, robotsiden og forsiden (dist/da/), 28. aug 2026

Method: dual-agent (A: designreview, isoleret · B: detektor + browsermaaling, isoleret).
Overlay-trinnet IKKE koert (Playwright-MCP nede; rodaarsag: pluginnets .mcp.json kalder
"npx", som er en bash-shellscript Windows ikke kan udfoere). Ingen klik/hover/tastatur
testet — ingen styrbar browser. Detektoren koerte foerst DEGRADERET (fire parser-moduler
mangler paa maskinen); B installerede dem i scratchpad og validerede motoren mod en
kontrolside med bevidst slop (2 fund degraderet mod 13 med motor) foer tallene blev brugt.

## Design Health Score: 20/40 — Acceptable, nedre kant

| # | Heuristik | Score | Noeglefund |
|---|---|---|---|
| 1 | Systemstatus | 1 | Filtreret tilstand: 34 taellere (sum 592) + 4 saltaellere opdateres aldrig; 3 tomme sale med overskrift; tom-tilstand kan ikke naas fra filtre |
| 2 | Match m. virkeligheden | 3 | Klart dansk, producentens ord citeret; traek for legendens placering og "Contact your sales expert" i prisfelt |
| 3 | Brugerkontrol | 2 | "Vis alle igen" uden JS rydder kun :target; robotsider er blindgyder |
| 4 | Konsistens | 2 | Sortering og filtre deler chip-sprog; kort besk aerer / robotside postkasser; 3 CTA'er, 2 navne |
| 5 | Fejlforebyggelse | 1 | 30 facetter, statiske tal, nul-resultat let at ramme, intet advarer |
| 6 | Genkendelse frem for huskning | 2 | Legenden ~9.000 px efter behovet; taethed staar 0 gange paa kortene |
| 7 | Fleksibilitet | 3 | Filtrering+sortering i ren CSS (:has), dybtlinkbar, virker uden JS |
| 8 | AEstetik/minimalisme | 2 | Disciplineret i det smaa; foerste skaerm er 100 % betjening |
| 9 | Fejlgenopretning | 1 | Den ene fejltilstand ([data-tomt]) er uopnaaelig fra filtrene |
| 10 | Hjaelp/dokumentation | 3 | "Saadan laeses tallene" er sidens bedste skrivning — forkert placeret |

Moenster: 1-1-1 paa status/forebyggelse/genopretning (alle i den filtrerede tilstand);
3-3-3 paa sprog/fleksibilitet/dokumentation. Siden er staerk, indtil nogen roerer den.

## Design-specificitet

KERNEN ER BLANDT DET MEST PRODUKTFORANKREDE, VI HAR MAALT: de fire datatilstande
(tal/nul/nej/ikke-oplyst, delt hverken grad, form, flade eller maerke), kildeapparatet
(haevet bogstav, stiplet sekundaer, hentedato, "Vi er ikke forhandler"-rammen),
forbeholdssaetningerne. Det kan ikke flyttes til et andet produkt uden at miste sin grund.
Deterministisk stoette: 50 af 59 detektorregler fyrede NUL med motoren beviseligt
funktionsdygtig — hele slop-familien (gradient-tekst, gloed, eyebrow-chips, buzzwords,
AI-palette) er fravaerende.

MEN KORTGITTERETS VISUELLE SPROG ER DREVET GENERISK: DESIGN.md's ledestjerne
("Udstillingssalen": maskinen frit paa hvid plade; maalepladen som hullets modstykke)
renderer ikke laengere — 1 maaleplade / 76 fabrikantfotos / 77 kort; 49 af 76 fotos
cover-beskaaret (gns. 11,6 %, vaerst 24,2 %); kort beskaerer mens robotside postkasser
(68,7 % ved 1440, 52,3 % ved 390). Det, der fylder gitteret, er praecis det, enhver
konkurrent ogsaa har.

Overlay: ikke muligt — fallback-signal, aarsag ovenfor.

## Prioriterede problemer

### [P0] Den filtrerede katalogside viser 38 forkerte tal og tre tomme sale
Bevis: #f-land-tyskland ved 1440 -> 1 synligt kort; samtidig 34 facettaellere (sum 592),
4 saltaellere og 3 sale med overskrift+taelling og nul kort — inkl. saetningen "De staar
her, ikke skjult..." over et tomt felt. Mekanisme bekraeftet af orkestrator i kode:
0 :has()-regler roerer .sal/.antal; katalog.js lytter kun paa soegefeltet (linje 39),
intet paa afkrydsningsfelter; [data-tomt] saettes kun i soeg().
Hvorfor: sidens positionering nr. 1 er "hvert tal har en kilde" — det her er 38 tal, der
bliver usande i samme sekund, laeseren bruger hovedbetjeningen.
Fix: taellerne skal enten beskrive det viste udvalg eller deklarere sig statiske
("x af 77"); tom-tilstanden skal kunne naas fra filtrene. Kommando: /impeccable harden.

### [P1] De fire datatilstande kollapser paa robotsiden ved >=1180 px
Bevis: breddesweep — forhold hul:tal 0,45 ved 390-1179, praecis 1,00 fra 1180.
generator.css:706 (.robot-noegletal .stribe .v{font-size:23px}, tre klasser, i
@media min-width:1180 fra :662) slaar system.css:966 (.stribe .v-ikke{font-size:13px}).
Samme specificitetsfejl som DESIGN.md's changelog 24. aug beskriver som rettet —
genindfoert kun paa desktop. "Ikke oplyst" er panelets tungeste element (155 px, vaegt
500) paa den flade, hvor tallene laeses. Fix: én selektor. Kommando: /impeccable polish.

### [P1] Kildemaerket — sidens signatur — er ulaeseligt, og CSS'en doemmer det selv
Bevis (B, computed px, kalibreret mod maalevaerktoej/skriftgrad.mjs): robotside 5,78 px
alle 22 (baade 1440 og 390); katalog ned til 3,74 px (4 stk., .v-ikke-chippen, et <a>);
kompakt celle 7,05 ved 390 (ikke de lovede 8,0 — @media 420 saetter .v til 15px).
system.css:553-557 skriver selv: ".34em af 17 px er 5,8 px - under det, en skaerm kan
saette et versalt bogstav paa" — rettelsen (.47em) blev kun lagt i .stribe--kompakt (:557);
grundreglen (:318) staar paa .34em, og robotsidens feltliste bruger den. Dertil: PRODUCT.md
lover 44 px-maal (AAA), DESIGN.md implementerer 24 px (AA). Detektoren fangede det IKKE
(mulig enkelttegns-undtagelse) — det er B's browsermaaling. Kommando: /impeccable typeset
eller polish.

### [P2] Katalogsidens foerste skaerm indeholder nul robotter
Bevis: foerste .kort ved y=993 (1440x900) / y=1820 (390) — 44 betjeningselementer og tre
afsnit foer foerste genstand. L31 gjorde den nysgerrige fagperson primaer; hun ankommer
uden modelnavn og kan ikke bruge et eneste af de 30 filtre endnu. Fladen er bygget
Operate; hendes ankomst er Read. BESLUTNING, ikke kun fejl. Kommando: /impeccable layout —
efter JPK-beslutning.

### [P3] Ledestjernen renderer ikke laengere
Bevis: se specificitet. Plus: hvid robot paa hvid baggrund med contain paa hvid plade
(MAB Honey Badger 5.0, Yuejia YJ30) er perceptuelt umulig at skelne fra fravaer —
naturalWidth-kontrol gav 0 indlaesningsfejl, saa det er aegte kollision med haard
begraensning 5: noget der LIGNER et hul uden at vaere det. BESLUTNING: forpligt paa
udstillingssalen igen, eller skriv DESIGN.md om til det, der faktisk renderer.

## Persona-roede flag

Den nysgerrige fagperson (PRIMAER, L31): 44 betjeningselementer foer foerste robot; intet
at filtrere med endnu — kataloget er bygget til en, der ved hvad hun leder efter. Moeder
notationen ved kort 1, forklaringen ~9.000 px senere. Kan ikke gaa fra robot til robot
(blindgyder). "MIDLERTIDIGT NAVN" som foerste element paa hver side.

Den tekniske indkoeber (sekundaer): rammer nul-resultatet uden forklaring naar han krydser
to facetter (hans vigtigste arbejdsgang); "ikke oplyst" er panelets tungeste element paa
hans 1440-skaerm; kan ikke se hvorfor taethedssortering ordner som den goer — kan ikke
bruge tallet i sin interne begrundelse, hvilket er feltets formaal.

## Mindre observationer

- [naesten-P] Specifikationstaethed er sorteringsvalg men vises 0 gange paa kortene; paa
  robotsiden foldet bag et "+". PRODUCT.md kalder den positionering nr. 3 og "eneste
  rangering". Billig at rette (kortet har pladsen).
- 793 af detektorens 852 fund er TO CSS-erklaeringer (10,5 px etiketter x490; .enhed-
  graderne x303, ned til 5,7 px computed). Naar taellerne rammer elementantal praecist,
  er de aarsager, ikke stoej — men prioritering skal ske pr. erklaering, ikke pr. fund.
- 7 falske positive dokumenteret af B: "cirka"x3 er sr-only-tekst (.kunskaerm); cramped-
  padding 12+11 er kaskade-fejllaesning (border:0-overskrivning + bevidst prikket
  understregning); radius "8px0"/"6px0" er shorthand-serialisering af var(); thin-border-
  wide-shadow ser bort fra spread -18px; repeating-stripes er semantiske (lineal,
  tomt-billede-skravering).
- AEgte off-scale: 3px radius paa .kildemaerke--sek (system.css:332); skalaen er 12/8/6.
- tight-leading paa .v (line-height:1.2) x4.
- "SOEG EFTER MODEL, PRODUCENT ELLER KRAV" — 37 tegns all-caps formularlabel.
- "Contact your sales expert" sat i mono som maaling i prisfeltet (go2). Producentens
  egne ord — skal glosses efter kildesprog-konventionen, ikke omskrives.
- Xiaomi CyberDog: eneste kort uden <img> (77 article, 76 picture).
- Nav-baandet 160 px hoejt ved 390 (2 raekker); DESIGN.md's changelog paastaar 1.
- Variantfelter (AIR/PRO/X/EDU) er <div> med chip-udseende — falsk affordance.
- EU-sektion: 46 px overskrift paa to bogstaver over ét-raekkes panel; vaerdien ~450 px
  fra sin etiket.
- Kort-indre bundluft varierer 1-126 px (median 21); korthoejder er derimod ens (spring 0).
- Robotsiden slutter blindt: ingen naeste-robot, ingen lignende, intet link til
  sammenligning fra broedteksten.

## Spoergsmaal at overveje

1. Hvis 76 af 77 kort viser producentens marketingfoto — hvad er "Udstillingssalen" saa:
   ledestjerne eller beskrivelse af en side, der ikke findes laengere?
2. Kataloget er bygget Operate; den primaere laeser ankommer Read. Skal kataloget aabne
   med robotter og lade filtrene komme efter — eller skal forsiden holde op med at vaere
   indgang og BLIVE kataloget?
3. Hvilken kilde har "18 robotter", naar der staar ét kort under overskriften? Er en
   taelling, der beskriver et andet udvalg end det viste, ikke praecis haard
   begraensning 5's loegn — bare paa et andet felt?
4. Hvad koster 30 filtre, som ingen kombination garanterer et resultat for, mod fem?

## Ikke daekket (begge assessments)

Klik/hover/tastatur/fokus (ingen styrbar browser) · den filtrerede tilstand kun via
:target, aldrig aegte krydsfiltrering · /en/, producentsider, Om, 404, print,
prefers-reduced-motion · kontrast ikke genmaalt (detektorens low-contrast gav 0 med
motor; DESIGN.md's 16+13 par taget for paalydende) · skaermbilleder kun 1440 og 390 —
1180, hvor P1 vender, er aldrig SET.
