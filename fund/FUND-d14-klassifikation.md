# FUND-d14-klassifikation.md — gyldighed/uddybning for 562 forbehold paa talfelter

Bygget under spor/noter (27. aug 2026), punkt D14 i briefet. Grundlaget er
`fund/FUND-forbehold.md` afsnit 2's seks familier plus D14's egne tre
(modstridende kilder, faktor 10-fejl, proevemaskine-tal). **Alle 562
forbehold er laest enkeltvis og doemt — ikke fundet med en regex.** Regexernes
99 fra FUND-forbehold.md var en startbunke, ikke et facit; den forkert
klassificerede fjerdedel (11 af 40 i stikproeven) er grunden til, at dette
dokument findes.

**Klassifikationen aendrer INGEN YAML-filer og ingen skabeloner.** Den er
beslutningsgrundlag for JPK's naeste skridt (stjernens to niveauer: gyldighed
faar et synligt maerke, uddybning bliver i `title`/tooltip uden maerke).

**Vigtigt om hvilken tekst der er doemt:** punkt Å25b i samme spor omskrev 48 af
disse 562 tekster for at fjerne internt sprog (filnavne, interne feltnavne,
regelnumre), mens meningen blev bevaret. Klassifikationen herunder er dømt paa
den OMSKREVNE tekst — den, en besoegende faktisk ser paa den byggede side —
ikke paa den oprindelige, interne formulering.

**Metodenote ud over ren tekstlaesning:** familie 3 ("ikke sammenligneligt med
naboerne") er for feltet `driftstid` krydstjekket STRUKTURELT mod `ved_last`
(er en lastbetingelse sat, eller staar den `ikke_oplyst`?) i stedet for kun at
lede efter ordene "ingen lastbetingelse" i selve teksten. Begrundelsen: den
reelle sammenlignelighedstrussel er et fakta om DATAEN (mangler feltet en
lastbetingelse, kan det ikke staa i samme kolonne som naboernes), ikke et
spoergsmaal om hvorvidt den enkelte tekst nævner det. 52 af 65 driftstid-poster
mangler `ved_last`; alle 52 er klassificeret gyldighed af den grund, uanset
ordlyd. De resterende 13 (som HAR en lastbetingelse) er dømt paa deres egen
tekst, som resten af kataloget.

**Totaler:**

| Klasse | Antal | Andel |
|---|---|---|
| **Gyldighed** (synligt maerke) | 259 | 46.1% |
| **Uddybning** (ingen maerke, kun uddybende tekst) | 303 | 53.9% |

**Fordelt paa familie (gyldighed-posterne, én post kan raemme flere familier —
taellingen her er min egen groft opdelte hovedbegrundelse pr. post, ikke en
udtoemmende krydstabel):**

| Familie | Antal |
|---|---|
| familie 1 (interval-oevre-ende) | 5 |
| familie 2 (producenten dementerer/proevemaskine-tal) | 17 |
| familie 3 (ikke sammenligneligt) | 62 |
| familie 4 (gaelder serien/en variant) | 27 |
| familie 5 (sammenlagt/umaerket/tolket kolonne) | 55 |
| familie 6 (gaaende/staaende er vores) | 32 |
| modstridende kilder / faktor 10-fejl | 26 |
| andet (svag kilde, prisusikkerhed, tilvalg m.m.) | 35 |

---

| Robot | Felt | Klasse | Begrundelse |
|---|---|---|---|
| unitree-a1 | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores (familie 6) |
| unitree-a1 | hastighed | uddybning | krydstjek bekraefter tallet, ingen tvivl rejst |
| unitree-a1 | driftstid | gyldighed | uden lastbetingelse, ikke sammenligneligt (familie 3) |
| unitree-a2 | egenvaegt | uddybning | informativ note om batterivaegt, egen vaerdi er konsistent med normen |
| unitree-a2 | hoejde | uddybning | foldemaal uden skemafelt, ekstra info |
| unitree-a2 | nyttelast_gaaende | uddybning | ekstra producentkontekst, aendrer ikke feltets vaerdi |
| unitree-a2 | hastighed | uddybning | separat spidstal ikke brugt, men driftsomraadets tal er ikke draget i tvivl |
| unitree-a2 | forhindring_enkelt | uddybning | ren etiket-citation |
| unitree-a2 | trappetrin_kontinuerlig | uddybning | ren etiket-citation |
| unitree-a2 | batteri_wh | uddybning | producentens regnestykke bekraeftet, gaar op |
| unitree-a2 | driftstid | uddybning | forklarer korrekt valg af lastbetinget tal, ingen tvivl om selve tallet |
| unitree-a2-w | egenvaegt | uddybning | batterivaegt oplyst separat, ren info |
| unitree-a2-w | hoejde | uddybning | foldemaal uden skemafelt |
| unitree-a2-w | hastighed | uddybning | sammenligning med A2, ikke en tvivl om vaerdien |
| unitree-a2-w | forhindring_enkelt | uddybning | ren etiket-citation |
| unitree-a2-w | batteri_wh | uddybning | samme batteri som A2, bekraeftende |
| unitree-a2-w | driftstid | uddybning | interessant sammenligning, tallet selv ikke draget i tvivl |
| unitree-aliengo | egenvaegt | gyldighed | UDEN batteri mens andre oplyser MED - eksplicit sammenligningsproblem (familie 3) |
| unitree-aliengo | hoejde | uddybning | foldemaal uden skemafelt |
| unitree-aliengo | frihedsgrader | uddybning | ren etiket-citation |
| unitree-aliengo | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores (familie 6) |
| unitree-aliengo | haeldning | gyldighed | loft/graense sammenlignet med andres praestationstal, forvraenger rangering |
| unitree-aliengo | driftstid | gyldighed | uden lastbetingelse (familie 3) |
| weilan-alphadog-c500 | egenvaegt | gyldighed | uklart om batteri er inkl. - underminerer sammenlignelighed |
| weilan-alphadog-c500 | laengde | uddybning | ren etiket-citation |
| weilan-alphadog-c500 | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores (familie 6) |
| weilan-alphadog-c500 | hastighed | gyldighed | to hastighedstal paa samme side, faktor 2 - valget paavirker sammenligning |
| weilan-alphadog-c500 | haeldning | gyldighed | loft-tal, laveste i kataloget delvist pga. denne framing |
| weilan-alphadog-c500 | temp_maks | uddybning | ren tegnsaetningsnote (fuldbredde-tilde), ikke en tvivl om vaerdien |
| weilan-alphadog-c500 | driftstid | gyldighed | alle fire udholdenhedstal uden lastbetingelse (familie 3) |
| weilan-alphadog-c501 | egenvaegt | gyldighed | uklart om batteri er inkl. - samme som C500 |
| weilan-alphadog-c501 | laengde | uddybning | ren etiket-citation |
| weilan-alphadog-c501 | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores (familie 6) |
| weilan-alphadog-c501 | hastighed | gyldighed | to hastighedstal, faktor 2 - samme som C500 |
| weilan-alphadog-c501 | haeldning | gyldighed | loft-tal, samme som C500 |
| weilan-alphadog-c501 | temp_maks | uddybning | ren tegnsaetningsnote |
| weilan-alphadog-c501 | driftstid | gyldighed | uden lastbetingelse, samme som C500 |
| anybotics-anymal | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores (familie 6) |
| anybotics-anymal | hastighed | gyldighed | eksplicit "ikke sammenligneligt med de oevrige posters makstal" (familie 3) |
| anybotics-anymal | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - uden lastbetingelse, ikke sammenligneligt (familie 3) |
| anybotics-anymal | ladetid | uddybning | forklarer korrekt valg af sammenlignelig fuld-opladningstid |
| anybotics-anymal-x | ip_klasse | uddybning | ren citation |
| unitree-as2 | hoejde | uddybning | foldemaal uden skemafelt |
| unitree-as2 | nyttelast_gaaende | gyldighed | vaerdien er kun AIR-variantens, spaend 10-15kg paa tvaers af fire varianter (familie 4) |
| unitree-as2 | nyttelast_staaende | gyldighed | vaerdien er kun AIR-variantens, spaend 45-65kg (familie 4) |
| unitree-as2 | hastighed | gyldighed | vaerdien er kun AIR-variantens (familie 4) |
| unitree-as2 | haeldning | gyldighed | vaerdien er kun AIR-variantens (familie 4) |
| unitree-as2 | forhindring_enkelt | gyldighed | staar kun i broedtekst, ikke i tabellen - kildegrundlaget kan falde vaek ved en metodebeslutning |
| unitree-as2 | trappetrin_kontinuerlig | gyldighed | vaerdien er kun AIR-variantens (familie 4) |
| unitree-as2 | temp_maks | gyldighed | vaerdien er kun AIR/PRO-varianternes (familie 4) |
| unitree-as2 | batteri_wh | gyldighed | vaerdien gaelder andre varianter; AIR selv kan slet ikke udledes (familie 4) |
| unitree-as2 | driftstid | gyldighed | vaerdien er kun AIR-variantens (familie 4) |
| unitree-as2-w | egenvaegt | uddybning | med batteri, ren info |
| unitree-as2-w | hoejde | uddybning | foldemaal uden skemafelt |
| unitree-as2-w | nyttelast_staaende | uddybning | faktuel kontekst (hoejeste i programmet), ikke en tvivl |
| unitree-as2-w | hastighed | uddybning | praeciserer spidsbelastning, ren info |
| unitree-as2-w | forhindring_enkelt | gyldighed | noegletalskortet viser intervallets oevre ende alene som headline-tal (familie 1) |
| unitree-as2-w | batteri_wh | uddybning | sourcing-note (staar i broedtekst, ikke tabel), ikke en tvivl om tallet |
| unitree-as2-w | driftstid | gyldighed | to modstridende tal paa samme side, 56% forskel, samme dag (modstridende kilder) |
| unitree-b1 | egenvaegt | uddybning | batterivaegt oplyst separat, ren info |
| unitree-b1 | hoejde | uddybning | usaedvanlig men bekraeftet foldemaal-note |
| unitree-b1 | nyttelast_gaaende | uddybning | producentens egen anbefaling, ikke en tvivl om tallet |
| unitree-b1 | nyttelast_staaende | uddybning | ren operator-note |
| unitree-b1 | ip_klasse | gyldighed | staar kun i overskriftstekst, ingen IP-raekke i tabellen - eksplicit "svageste kildegrundlag" |
| unitree-b1 | batteri_wh | uddybning | producentens regnestykke bekraeftet, gaar op |
| unitree-b1 | driftstid | gyldighed | uden lastbetingelse (familie 3) |
| unitree-b1 | ladetid | uddybning | faktuel kontekst, ikke en tvivl |
| unitree-b2 | egenvaegt | gyldighed | MED batteri mens AlienGo er UDEN - eksplicit sammenligningsproblem (familie 3) |
| unitree-b2 | hoejde | uddybning | foldemaal uden skemafelt |
| unitree-b2 | nyttelast_staaende | uddybning | operator-forskel til B2-W forklaret, ikke en tvivl om selve tallet |
| unitree-b2 | hastighed | gyldighed | producentens egen fodnote: reel hastighed begraenset af sikkerhed, tallet dementeres (familie 2) |
| unitree-b2 | forhindring_enkelt | uddybning | to producentcitater der bekraefter samme tal |
| unitree-b2 | trappetrin_kontinuerlig | uddybning | bekraefter at intervallet er bevaret, ikke kollapset |
| unitree-b2 | batteri_wh | gyldighed | producentens eget regnestykke gaar ikke op, 13,8% afvigelse (faktor/regnefejl) |
| unitree-b2 | driftstid | uddybning | forklarer korrekt valg af det eneste lastbetingede tal |
| unitree-b2-w | egenvaegt | uddybning | med batteri, ren info |
| unitree-b2-w | hoejde | uddybning | foldemaal uden skemafelt |
| unitree-b2-w | nyttelast_staaende | uddybning | operator-forskel til B2 forklaret med vilje, ikke en tvivl |
| unitree-b2-w | hastighed | gyldighed | samme sikkerhedsbegraensede fodnote som B2 gaelder her (familie 2) |
| unitree-b2-w | batteri_wh | uddybning | ren omregningsnote, ingen aendring af tallet |
| galileo-c1 | egenvaegt | uddybning | ren tabel-citation |
| galileo-c1 | laengde | uddybning | ren tabel-citation |
| galileo-c1 | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores fortolkning af "effektiv" (familie 6) |
| galileo-c1 | nyttelast_staaende | gyldighed | gaaende/staaende-tildelingen er vores fortolkning (familie 6) |
| galileo-c1 | hastighed | uddybning | ren tabel-citation |
| galileo-c1 | haeldning | uddybning | ren tabel-citation, operator-note |
| galileo-c1 | trappetrin_kontinuerlig | uddybning | henviser til terminologi-topnote, ikke en tvivl om tallet |
| galileo-c1 | temp_min | uddybning | forklarer korrekt valg af standardvaerdi frem for tilvalgsgraense |
| galileo-c1 | batteri_wh | uddybning | reassurerer at Wh er trykt direkte, ikke udregnet |
| galileo-c1 | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| galileo-c1-w | egenvaegt | uddybning | ren tabel-citation |
| galileo-c1-w | laengde | uddybning | ren tabel-citation |
| galileo-c1-w | hoejde | uddybning | forventet forskel til C1, ikke en tvivl |
| galileo-c1-w | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er arvet fra C1 (familie 6) |
| galileo-c1-w | nyttelast_staaende | gyldighed | gaaende/staaende-tildelingen er arvet fra C1 (familie 6) |
| galileo-c1-w | hastighed | gyldighed | eksplicit "kan ikke sammenlignes" paa tvaers af producenter uden at kende hjuldesign (familie 3) |
| galileo-c1-w | haeldning | uddybning | identisk med C1, ren bekraeftelse |
| galileo-c1-w | forhindring_enkelt | uddybning | henviser til terminologi-topnote |
| galileo-c1-w | temp_min | uddybning | samme tilvalgsgraense-note som C1 |
| galileo-c1-w | batteri_wh | uddybning | identisk med C1, ren bekraeftelse |
| galileo-c1-w | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| xiaomi-cyberdog-1 | egenvaegt | uddybning | ren etiket-citation, inkl. batteri som normen |
| xiaomi-cyberdog-1 | hoejde | uddybning | ekstra liggende-maal uden skemafelt, ikke brugt, ikke en tvivl om staaende maal |
| xiaomi-cyberdog-1 | frihedsgrader | uddybning | ren citation |
| xiaomi-cyberdog-1 | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores (familie 6) |
| xiaomi-cyberdog-1 | hastighed | gyldighed | laboratoriemaalt maksimum mod halvt saa hoej sikker hastighed (proevemaskine-tal) |
| xiaomi-cyberdog-1 | batteri_wh | gyldighed | to producentkapaciteter 7,1% fra hinanden (modstridende kilder, om end mild) |
| xiaomi-cyberdog-1 | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| xiaomi-cyberdog-2 | egenvaegt | uddybning | producentens egen tolerance bevaret korrekt |
| xiaomi-cyberdog-2 | hoejde | uddybning | ekstra liggende-maal, ikke brugt |
| xiaomi-cyberdog-2 | frihedsgrader | uddybning | ren citation |
| xiaomi-cyberdog-2 | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores (familie 6) |
| xiaomi-cyberdog-2 | hastighed | uddybning | ren etiket-praecisering |
| xiaomi-cyberdog-2 | batteri_wh | uddybning | krydstjek bekraefter, gaar praecist op |
| xiaomi-cyberdog-2 | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| yobotics-e-dog | egenvaegt | uddybning | ren tolerance-citation |
| yobotics-e-dog | laengde | uddybning | ren tolerance-citation |
| yobotics-e-dog | bredde | uddybning | ren tolerance-citation |
| yobotics-e-dog | hoejde | uddybning | ren tolerance-citation |
| yobotics-e-dog | frihedsgrader | uddybning | ekstra momenttal, ikke en tvivl |
| yobotics-e-dog | nyttelast_gaaende | gyldighed | tre lasttal, valget af hvilket der svarer til "gaaende" er vores (familie 6) |
| yobotics-e-dog | nyttelast_staaende | gyldighed | "statisk" er ikke det samme ord som "staaende" - vores tolkning (familie 6) |
| yobotics-e-dog | hastighed | uddybning | ren enhedsnote |
| yobotics-e-dog | trappetrin_kontinuerlig | uddybning | konsistent metodevalg, ingen tvivl om tallet |
| yobotics-e-dog | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| galileo-e1 | egenvaegt | uddybning | ren tabel-citation |
| galileo-e1 | laengde | uddybning | ren tabel-citation |
| galileo-e1 | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores, arvet fra C1 (familie 6) |
| galileo-e1 | nyttelast_staaende | uddybning | ren tabel-citation, ingen tolkningssaetning i denne tekst |
| galileo-e1 | hastighed | uddybning | transparent om ikke-brugt graensetal, hovedvaerdien ikke draget i tvivl |
| galileo-e1 | haeldning | uddybning | ren tabel-citation |
| galileo-e1 | trappetrin_kontinuerlig | gyldighed | vaerdiblok-tildelingen er en tolkning, ikke tekstens position (familie 5, se topnoten) |
| galileo-e1 | temp_min | uddybning | tilvalgsgraense forklaret |
| galileo-e1 | batteri_wh | uddybning | ren tabel-citation |
| galileo-e1 | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| galileo-e1-w | egenvaegt | uddybning | ren tabel-citation |
| galileo-e1-w | laengde | uddybning | ren tabel-citation |
| galileo-e1-w | hoejde | uddybning | uforklaret moenster-afvigelse, men vaerdien selv er dobbelttjekket og bekraeftet |
| galileo-e1-w | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen arvet fra E1 (familie 6) |
| galileo-e1-w | nyttelast_staaende | uddybning | ren bekraeftelse, identisk med E1 |
| galileo-e1-w | hastighed | uddybning | transparent om ikke-brugt graensetal |
| galileo-e1-w | haeldning | uddybning | ren tabel-citation |
| galileo-e1-w | forhindring_enkelt | uddybning | eksakt enhedsomregning m->cm, ingen tabsfaktor |
| galileo-e1-w | temp_min | uddybning | tilvalgsgraense forklaret |
| galileo-e1-w | batteri_wh | uddybning | ren bekraeftelse, identisk med E1 |
| galileo-e1-w | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| genisom-gangben-l1 | egenvaegt | uddybning | selv-tjek rettede en tidligere operator-fejl, nuvaerende tal er korrekt |
| genisom-gangben-l1 | laengde | uddybning | akserne eksplicit maerket af producenten |
| genisom-gangben-l1 | hoejde | uddybning | krybende maal uden skemafelt, ekstra info |
| genisom-gangben-l1 | frihedsgrader | gyldighed | motorantal brugt som DoF-proxy, ikke producentens eget ord "frihedsgrader" (familie 5) |
| genisom-gangben-l1 | nyttelast_gaaende | uddybning | separat, hoejere graensetal transparent udeladt |
| genisom-gangben-l1 | hastighed | uddybning | transparent om ikke-brugt graensehastighed |
| genisom-gangben-l1 | haeldning | uddybning | standardvaerdi korrekt valgt frem for graensevaerdi |
| genisom-gangben-l1 | trappetrin_kontinuerlig | uddybning | ren etiket-citation |
| genisom-gangben-l1 | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| genisom-gangben-l1 | ladetid | uddybning | ren citation |
| genisom-gangben-l1-w | egenvaegt | uddybning | ren citation |
| genisom-gangben-l1-w | laengde | uddybning | ren citation |
| genisom-gangben-l1-w | hoejde | uddybning | krybende maal uden skemafelt |
| genisom-gangben-l1-w | frihedsgrader | gyldighed | motorantal som DoF-proxy plus udeladte hjulmotorer (familie 5) |
| genisom-gangben-l1-w | nyttelast_gaaende | uddybning | separat graensetal transparent udeladt |
| genisom-gangben-l1-w | hastighed | uddybning | transparent om ikke-brugt graensehastighed, samme princip som L1/L2 |
| genisom-gangben-l1-w | haeldning | uddybning | standardvaerdi korrekt valgt, samme princip som L1 |
| genisom-gangben-l1-w | forhindring_enkelt | uddybning | korrekt adskilt fra trappetrin_kontinuerlig, ikke en konflikt |
| genisom-gangben-l1-w | trappetrin_kontinuerlig | uddybning | ren citation |
| genisom-gangben-l1-w | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| genisom-gangben-l1-w | ladetid | uddybning | ren citation |
| genisom-gangben-l2 | egenvaegt | uddybning | selv-tjek bekraeftede korrekt tal, ingen resterende tvivl |
| genisom-gangben-l2 | laengde | uddybning | akserne eksplicit maerket |
| genisom-gangben-l2 | hoejde | uddybning | krybende maal uden skemafelt |
| genisom-gangben-l2 | frihedsgrader | gyldighed | motorantal som DoF-proxy, ikke producentens eget ord (familie 5) |
| genisom-gangben-l2 | nyttelast_gaaende | uddybning | ren citation |
| genisom-gangben-l2 | nyttelast_staaende | uddybning | krydsbekraeftet to steder paa siden, enige |
| genisom-gangben-l2 | hastighed | uddybning | transparent om ikke-brugt graensehastighed |
| genisom-gangben-l2 | haeldning | uddybning | krydsbekraeftet af homepage-kortet |
| genisom-gangben-l2 | forhindring_enkelt | uddybning | korrekt adskilt fra trappetrin_kontinuerlig |
| genisom-gangben-l2 | trappetrin_kontinuerlig | uddybning | forventet forskel til enkelt-forhindringstallet |
| genisom-gangben-l2 | batteri_wh | uddybning | eksplicit "uden modsigelse" med et andet tal paa siden |
| genisom-gangben-l2 | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| genisom-gangben-l2 | ladetid | uddybning | ren citation |
| genisom-gangben-l2 | pris | gyldighed | "起" (fra) betyder tilvalg laegges oveni - den viste pris kan understatte reel pris |
| genisom-gangben-l2-w | egenvaegt | uddybning | ren citation |
| genisom-gangben-l2-w | laengde | uddybning | ren citation |
| genisom-gangben-l2-w | hoejde | uddybning | krybende maal uden skemafelt |
| genisom-gangben-l2-w | frihedsgrader | gyldighed | motorantal som DoF-proxy (familie 5) |
| genisom-gangben-l2-w | nyttelast_gaaende | uddybning | samme tal som basisudgaven, ren citation |
| genisom-gangben-l2-w | nyttelast_staaende | gyldighed | eksplicit IKKE krydsbekraeftet, kun én forekomst - svagere kildegrundlag end soesterposten L2 |
| genisom-gangben-l2-w | hastighed | uddybning | forventet forskel til basisudgaven, transparent om ikke-brugt tal |
| genisom-gangben-l2-w | trappetrin_kontinuerlig | uddybning | forventet forskel til basisudgaven |
| genisom-gangben-l2-w | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| genisom-gangben-l2-w-ultra | egenvaegt | uddybning | samme tal som L2-W, ren citation |
| genisom-gangben-l2-w-ultra | laengde | uddybning | identisk med L2-W |
| genisom-gangben-l2-w-ultra | hoejde | uddybning | krybende maal uden skemafelt |
| genisom-gangben-l2-w-ultra | frihedsgrader | gyldighed | motorantal som DoF-proxy (familie 5) |
| genisom-gangben-l2-w-ultra | nyttelast_gaaende | uddybning | samme tal som L2/L2-W |
| genisom-gangben-l2-w-ultra | nyttelast_staaende | gyldighed | ikke krydsbekraeftet af en separat marketinglinje for netop denne variant |
| genisom-gangben-l2-w-ultra | hastighed | uddybning | samme tal som L2-W, transparent om ikke-brugt graensehastighed |
| genisom-gangben-l2-w-ultra | trappetrin_kontinuerlig | uddybning | samme tal som L2-W |
| genisom-gangben-l2-w-ultra | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| unitree-go1 | frihedsgrader | gyldighed | motorantal som DoF-proxy (familie 5) |
| unitree-go1 | nyttelast_gaaende | gyldighed | gaaende-tildeling er vores, og vaerdien er Air/Pro-variantens (familie 6+4) |
| unitree-go1 | hastighed | gyldighed | vaerdien er Air-variantens, ikke noedvendigvis denne model (familie 4) |
| unitree-go1 | pris | gyldighed | vaerdien er Air-variantens (familie 4) |
| unitree-go2 | egenvaegt | uddybning | med batteri, ren info |
| unitree-go2 | hoejde | uddybning | foldemaal uden skemafelt |
| unitree-go2 | frihedsgrader | gyldighed | eksplicit "regner man strengere, er feltet ikke oplyst" (familie 5) |
| unitree-go2 | nyttelast_gaaende | gyldighed | gaaende-tildeling er vores, og vaerdien er AIR-variantens (familie 6+4) |
| unitree-go2 | hastighed | gyldighed | vaerdien er AIR-variantens (familie 4) |
| unitree-go2 | haeldning | gyldighed | vaerdien er AIR-variantens (familie 4) |
| unitree-go2 | forhindring_enkelt | gyldighed | feltidentiteten (enkelt/kontinuerlig) er et valg, og vaerdien er AIR-variantens (familie 5+4) |
| unitree-go2 | driftstid | gyldighed | briefets eget eksempel: uden lastbetingelse, ikke sammenlignelig med B2/A2 (familie 3) |
| unitree-go2 | pris | gyldighed | vaerdien er AIR-variantens (familie 4) |
| unitree-go2-w | frihedsgrader | gyldighed | motorantal som DoF-proxy (familie 5) |
| unitree-go2-w | nyttelast_gaaende | gyldighed | gaaende-tildeling er vores (familie 6) |
| unitree-go2-w | forhindring_enkelt | gyldighed | oevre graense-operator kan laeses som praestation - 75% forskel uden operatoren (familie: loft mod praestation) |
| unitree-go2-w | driftstid | gyldighed | uden lastbetingelse, ikke sammenlignelig med B2/A2 (familie 3) |
| mab-honey-badger-4 | hoejde | uddybning | interval korrekt bevaret, ikke opfundet |
| mab-honey-badger-4 | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores (familie 6) |
| mab-honey-badger-4 | ip_klasse | gyldighed | siden modsiger sig selv: 5 af 6 forekomster siger IP67 uden forbehold, tabellen alene siger "up to" (modstridende kilder) |
| mab-honey-badger-4 | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| mab-honey-badger-5 | hoejde | uddybning | interval korrekt bevaret |
| mab-honey-badger-5 | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores (familie 6) |
| mab-honey-badger-5 | driftstid | gyldighed | uden lastbetingelse (familie 3) |
| astrall-dynamics-hypertron-t01 | egenvaegt | uddybning | inkl. batteri, ren citation |
| astrall-dynamics-hypertron-t01 | laengde | uddybning | ren citation |
| astrall-dynamics-hypertron-t01 | hoejde | uddybning | ekstra liggende-maal, ikke en tvivl om staaende maal |
| astrall-dynamics-hypertron-t01 | nyttelast_gaaende | uddybning | operator bevaret, ren citation |
| astrall-dynamics-hypertron-t01 | nyttelast_staaende | uddybning | ren citation |
| astrall-dynamics-hypertron-t01 | hastighed | gyldighed | producentens egen fodnote: laboratorietal, reel brug kan vaere hastighedsbegraenset (familie 2/proevemaskine-tal) |
| astrall-dynamics-hypertron-t01 | haeldning | gyldighed | feltets etiket maaler muligvis noget andet end "haeldning" i resten af kataloget (familie 5) |
| astrall-dynamics-hypertron-t01 | forhindring_enkelt | uddybning | ren citation |
| astrall-dynamics-hypertron-t01 | trappetrin_kontinuerlig | uddybning | ren citation |
| astrall-dynamics-hypertron-t01 | ip_klasse | gyldighed | ueftereproevet IP67-paastand fra en anden kilde staar aaben (modstridende kilder) |
| astrall-dynamics-hypertron-t01 | temp_maks | uddybning | opbevaringstemperatur er en anden maaling, ikke en tvivl om arbejdstemperatur |
| astrall-dynamics-hypertron-t01 | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| deep-robotics-lite3 | egenvaegt | gyldighed | vaerdien er Basic-variantens (familie 4) |
| deep-robotics-lite3 | hoejde | gyldighed | vaerdien er Basic-variantens (familie 4) |
| deep-robotics-lite3 | nyttelast_gaaende | gyldighed | vaerdien er Basic-variantens (familie 4) |
| deep-robotics-lite3 | haeldning | uddybning | ens for alle fire varianter, intet variant-forbehold gaelder her |
| deep-robotics-lite3 | trappetrin_kontinuerlig | gyldighed | feltidentiteten afgoeres kun paa kinesisk, engelsk laesning giver et 2-4x forkert felt (familie 5) |
| deep-robotics-lite3 | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| deep-robotics-mini | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores (familie 6) |
| deep-robotics-mini | hastighed | gyldighed | to felter deler én raa tabelraekke - identiteten er en udtraeknings-tolkning (familie 5) |
| deep-robotics-mini | haeldning | gyldighed | samme delte raekke som hastighed (familie 5) |
| deep-robotics-mini | batteri_wh | uddybning | forklarer hvorfor den engelske sides fejlvaerdi blev undgaaet - det korrekte tal er brugt |
| deep-robotics-mini | driftstid | gyldighed | producenten maerker selv tallet "tvivlsomt, afventer verifikation" - kun synligt paa kinesisk (familie 2) |
| deep-robotics-x20 | nyttelast_gaaende | gyldighed | feltidentiteten afgoeres kun paa kinesisk, engelsk laesning misser tallet helt (familie 5) |
| deep-robotics-x20 | hastighed | uddybning | ren typografisk note om versalisering |
| deep-robotics-x20 | haeldning | gyldighed | samme producent, samme felt, modsat ulighedstegn (gulv) end soesterposten X30 (loft) |
| deep-robotics-x20 | trappetrin_kontinuerlig | gyldighed | to felter slaaet sammen af producenten, adskilt ved et valg (familie 5) |
| deep-robotics-x20 | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| deep-robotics-x30 | egenvaegt | uddybning | med batteri, ren info |
| deep-robotics-x30 | bredde | gyldighed | akserne umaerket af producenten, kan vaere byttet om med hoejde (familie 5) |
| deep-robotics-x30 | hoejde | gyldighed | samme usikre akse-tildeling som bredde (familie 5) |
| deep-robotics-x30 | haeldning | gyldighed | samme producent, samme felt, modsat ulighedstegn (loft) end soesterposten X20 (gulv) |
| deep-robotics-x30 | trappetrin_kontinuerlig | gyldighed | to felter slaaet sammen, dog delvist begrundet af kinesisk etiket (familie 5) |
| deep-robotics-x30 | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| deep-robotics-x30-pro | egenvaegt | uddybning | med batteri |
| deep-robotics-x30-pro | bredde | gyldighed | akserne umaerket, kan vaere byttet om (familie 5) |
| deep-robotics-x30-pro | hoejde | gyldighed | samme usikre akse-tildeling (familie 5) |
| deep-robotics-x30-pro | haeldning | gyldighed | loft-tegn, samme moenster som X30/X20 |
| deep-robotics-x30-pro | trappetrin_kontinuerlig | gyldighed | to felter slaaet sammen af producenten (familie 5) |
| deep-robotics-x30-pro | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| keybotic-keyper | egenvaegt | gyldighed | ingen angivelse af med/uden batteri - underminerer sammenlignelighed |
| keybotic-keyper | laengde | gyldighed | bredde stoerre end laengde, usaedvanligt og ikke rettet - akse-tildelingen er usikker (familie 5) |
| keybotic-keyper | bredde | gyldighed | samme usaedvanlige bredde/laengde-par som laengde |
| keybotic-keyper | hoejde | gyldighed | justerbar hoejde givet som interval, ikke direkte sammenligneligt med faste maal (familie 3) |
| keybotic-keyper | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| keybotic-keyper | ladetid | uddybning | ren citation |
| yufan-lingmao-cyvet | egenvaegt | uddybning | bekraefter vaegten er uden nyttelast, som forventet |
| yufan-lingmao-cyvet | laengde | uddybning | ren citation |
| yufan-lingmao-cyvet | hoejde | uddybning | ekstra liggende-maal uden skemafelt |
| yufan-lingmao-cyvet | frihedsgrader | gyldighed | ledtal tolket som DoF, samme interpretive gab som andre poster (familie 5) |
| yufan-lingmao-cyvet | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores (familie 6) |
| yufan-lingmao-cyvet | hastighed | uddybning | ren citation |
| yufan-lingmao-cyvet | trappetrin_kontinuerlig | uddybning | ren citation |
| yufan-lingmao-cyvet | ip_klasse | gyldighed | gaelder en tilkoebt variant, ikke standardmodellen resten af posten beskriver (familie 4) |
| yufan-lingmao-cyvet | temp_maks | uddybning | bekraefter grundmodellens graense er brugt korrekt |
| yufan-lingmao-cyvet | batteri_wh | uddybning | trykt direkte og krydsbekraeftet, ikke udregnet |
| yufan-lingmao-cyvet | driftstid | uddybning | korrekt lastbetinget tal valgt frem for det ubetingede headlinetal |
| yufan-lingmao-cyvet | pris | gyldighed | listepris, ikke garanteret endelig - kan understatte reel pris |
| deep-robotics-lynx-m20 | nyttelast_gaaende | uddybning | ren etiket-citation |
| deep-robotics-lynx-m20 | nyttelast_staaende | gyldighed | staaende-tildelingen er vores tolkning (familie 6) |
| deep-robotics-lynx-m20 | hastighed | gyldighed | tre producenttal for samme egenskab, lab vs. drift vs. sikkerhedsbegraenset (familie 2/proevemaskine-tal) |
| deep-robotics-lynx-m20 | haeldning | gyldighed | producentens egen fodnote: laboratorietal, reel praestation varierer med underlag (familie 2) |
| deep-robotics-lynx-m20 | forhindring_enkelt | uddybning | ren etiket-citation |
| deep-robotics-lynx-m20 | trappetrin_kontinuerlig | uddybning | forklarer korrekt hvilket tal sammenligninger skal bruge |
| deep-robotics-lynx-m20 | driftstid | uddybning | korrekt lastbetinget tal valgt, ved_last strukturelt til stede |
| deep-robotics-lynx-m20-pro | nyttelast_gaaende | uddybning | ren etiket-citation |
| deep-robotics-lynx-m20-pro | nyttelast_staaende | gyldighed | staaende-tildelingen er vores tolkning (familie 6) |
| deep-robotics-lynx-m20-pro | hastighed | gyldighed | tre producenttal for samme egenskab (familie 2/proevemaskine-tal) |
| deep-robotics-lynx-m20-pro | haeldning | gyldighed | producentens egen fodnote om laboratorietal (familie 2) |
| deep-robotics-lynx-m20-pro | forhindring_enkelt | uddybning | ren etiket-citation |
| deep-robotics-lynx-m20-pro | trappetrin_kontinuerlig | uddybning | forklarer korrekt sammenligningstal |
| deep-robotics-lynx-m20-pro | driftstid | uddybning | korrekt lastbetinget tal valgt, ved_last strukturelt til stede |
| deep-robotics-lynx-m20s | nyttelast_gaaende | uddybning | ren etiket-citation |
| deep-robotics-lynx-m20s | nyttelast_staaende | gyldighed | staaende-tildelingen er vores tolkning (familie 6) |
| deep-robotics-lynx-m20s | hastighed | gyldighed | laboratoriemaalt ekstremhastighed findes separat (familie 2/proevemaskine-tal) |
| deep-robotics-lynx-m20s | haeldning | gyldighed | producentens egen fodnote om laboratorietal (familie 2) |
| deep-robotics-lynx-m20s | forhindring_enkelt | uddybning | ren etiket-citation |
| deep-robotics-lynx-m20s | trappetrin_kontinuerlig | gyldighed | eksplicit: det forkerte tal ville have givet en helt anden rangering (familie 1/5) |
| deep-robotics-lynx-m20s | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| deep-robotics-lynx-s10 | egenvaegt | gyldighed | eksplicit "en lovning, ikke en maaling" (familie 2) |
| deep-robotics-lynx-s10 | hastighed | gyldighed | kinesisk kilde markerer tallet som graense-/ekstremvaerdi (familie 2/proevemaskine-tal) |
| deep-robotics-lynx-s10 | forhindring_enkelt | gyldighed | kilden er broedtekst, ikke en tabel - svagt kildegrundlag |
| magiclab-magicdog-edu | egenvaegt | gyldighed | uden batteri mens alle andre (ogsaa soestermodeller) oplyser med - eksplicit sammenligningsproblem (familie 3) |
| magiclab-magicdog-edu | hoejde | uddybning | liggende maal uden skemafelt |
| magiclab-magicdog-edu | frihedsgrader | gyldighed | to forskellige DoF-tal (13 vs. 12) paa producentens egne to sites (modstridende kilder) |
| magiclab-magicdog-edu | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores (familie 6) |
| magiclab-magicdog-edu | hastighed | gyldighed | to producentsider er uenige om tallet er et maksimum eller et interval (modstridende kilder) |
| magiclab-magicdog-edu | forhindring_enkelt | gyldighed | globale site giver et 20% hoejere, laboratoriemaerket tal (modstridende kilder/proevemaskine-tal) |
| magiclab-magicdog-edu | driftstid | gyldighed | globale site giver et andet tal; desuden ved_last strukturelt ikke_oplyst (familie 3) |
| magiclab-magicdog-pro | egenvaegt | gyldighed | uden batteri mens alle andre oplyser med (familie 3) |
| magiclab-magicdog-pro | hoejde | uddybning | liggende maal uden skemafelt |
| magiclab-magicdog-pro | frihedsgrader | gyldighed | to forskellige DoF-tal paa producentens egne to sites (modstridende kilder) |
| magiclab-magicdog-pro | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores (familie 6) |
| magiclab-magicdog-pro | hastighed | gyldighed | to producentsider uenige om maksimum vs. interval (modstridende kilder) |
| magiclab-magicdog-pro | forhindring_enkelt | gyldighed | globale site giver et 20% hoejere, laboratoriemaerket tal (modstridende kilder) |
| magiclab-magicdog-pro | driftstid | gyldighed | globale site giver et andet tal; ved_last strukturelt ikke_oplyst (familie 3) |
| magiclab-magicdog-y1 | egenvaegt | uddybning | med batteri, ren info |
| magiclab-magicdog-y1 | nyttelast_gaaende | uddybning | ren etiket-citation |
| magiclab-magicdog-y1 | nyttelast_staaende | gyldighed | staaende-tildelingen er vores tolkning (familie 6) |
| magiclab-magicdog-y1 | hastighed | uddybning | ren rangeringsafklaring, ikke en tvivl om tallets egen validitet |
| magiclab-magicdog-y1 | forhindring_enkelt | gyldighed | hverken EN eller CN afgoer enkelt/kontinuerlig - vores tolkning (familie 5) |
| magiclab-magicdog-y1 | temp_min | gyldighed | kilden er broedtekst, ikke tabel - svagt kildegrundlag |
| magiclab-magicdog-y1 | temp_maks | gyldighed | kilden er broedtekst, ikke tabel - svagt kildegrundlag |
| magiclab-magicdog-y1 | batteri_wh | gyldighed | producentens eget regnestykke gaar ikke op, 1,2% afvigelse (faktor/regnefejl) |
| magiclab-magicdog-y1 | driftstid | uddybning | korrekt lastbetinget tal valgt, ved_last strukturelt til stede |
| magiclab-magicdog-w | egenvaegt | uddybning | entydig med-batteri-etiket for netop denne post |
| magiclab-magicdog-w | hoejde | uddybning | liggende maal uden skemafelt |
| magiclab-magicdog-w | frihedsgrader | gyldighed | motorantal, ikke producentens eget ord "frihedsgrader" (familie 5) |
| magiclab-magicdog-w | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores (familie 6) |
| magiclab-magicdog-w | hastighed | gyldighed | to producentsider giver modsatte paastande, samme dag (modstridende kilder) |
| magiclab-magicdog-w | haeldning | gyldighed | to producentsider giver loft mod gulv for samme tal (modstridende kilder) |
| magiclab-magicdog-w | driftstid | uddybning | maalt standbytid, ren citation |
| cvte-maxhub-x7 | haeldning | gyldighed | producentens egen fodnote: laboratorietal, reel terraenydelse varierer (familie 2) |
| cvte-maxhub-x7 | ip_klasse | uddybning | ren citation |
| cvte-maxhub-x7 | temp_min | uddybning | standard graense-definition, ikke en tvivl om selve graensen |
| cvte-maxhub-x7 | driftstid | gyldighed | producentens egen fodnote: laboratorietal ved 25°C paa fladt underlag (familie 2/proevemaskine-tal) |
| microrobotech-movenew-p1 | egenvaegt | uddybning | entydig med-batteri-etiket |
| microrobotech-movenew-p1 | laengde | gyldighed | akserne umaerket, raekkefoelgen er antaget (familie 5) |
| microrobotech-movenew-p1 | bredde | gyldighed | samme usikre akse-tildeling |
| microrobotech-movenew-p1 | hoejde | gyldighed | samme usikre akse-tildeling |
| microrobotech-movenew-p1 | frihedsgrader | gyldighed | motorantal som DoF-proxy (familie 5) |
| microrobotech-movenew-p1 | nyttelast_gaaende | uddybning | producentens egen etiket siger direkte "Walking Load" - ingen tolkning noedvendig |
| microrobotech-movenew-p1 | nyttelast_staaende | uddybning | producentens egen etiket siger direkte "Standing Load" |
| microrobotech-movenew-p1 | haeldning | gyldighed | to raekker med samme tal under to etiketter - mulig skabelonfejl hos producenten (familie 5) |
| microrobotech-movenew-p1 | forhindring_enkelt | gyldighed | usaedvanligt stort tal, eksplicit mistanke om producent-skrivefejl |
| microrobotech-movenew-p1 | trappetrin_kontinuerlig | uddybning | ren etiket-citation |
| microrobotech-movenew-p1 | ip_klasse | uddybning | korrekt disambigueret mellem hjul- og helmaskineklasse |
| microrobotech-movenew-p1 | batteri_wh | uddybning | ren citation |
| microrobotech-movenew-p1 | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| microrobotech-movenew-p1 | ladetid | uddybning | ren citation |
| microrobotech-movenew-t1 | egenvaegt | gyldighed | producentens egen etiket er eksplicit tvetydig mellem maskine- og batterivaegt (familie 5) |
| microrobotech-movenew-t1 | laengde | gyldighed | akserne umaerket, antaget efter saedvane (familie 5) |
| microrobotech-movenew-t1 | bredde | gyldighed | samme usikre akse-tildeling |
| microrobotech-movenew-t1 | hoejde | gyldighed | samme usikre akse-tildeling |
| microrobotech-movenew-t1 | frihedsgrader | gyldighed | motorantal daekker formentlig baade ben og hjulnav - saerligt usikker DoF-proxy (familie 5) |
| microrobotech-movenew-t1 | nyttelast_gaaende | uddybning | producentens egen etiket siger direkte "Continuous Walking Load" |
| microrobotech-movenew-t1 | nyttelast_staaende | uddybning | producentens egen etiket siger direkte "Max Standing Load" |
| microrobotech-movenew-t1 | hastighed | uddybning | forklarer korrekt hvorfor ingen operator er tilfoejet |
| microrobotech-movenew-t1 | haeldning | gyldighed | loft-tegn, samme moenster som X30 hos en anden producent |
| microrobotech-movenew-t1 | forhindring_enkelt | uddybning | ren etiket-citation |
| microrobotech-movenew-t1 | trappetrin_kontinuerlig | uddybning | producenten adskiller selv de to felter tydeligt, ingen tvetydighed her |
| microrobotech-movenew-t1 | batteri_wh | gyldighed | to batteripakke-STOERRELSER fremstillet som min/maks-interval - kan misforstaas som en tolerance (familie 5) |
| microrobotech-movenew-t1 | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| neura-quadruped | egenvaegt | gyldighed | ingen angivelse af med/uden batteri - underminerer sammenlignelighed |
| neura-quadruped | hoejde | uddybning | ren citation |
| neura-quadruped | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores (familie 6) |
| neura-quadruped | hastighed | uddybning | ren citation |
| neura-quadruped | trappetrin_kontinuerlig | gyldighed | feltidentiteten (enkelt/kontinuerlig) er vores tolkning, ikke en producentmaerkning (familie 5) |
| neura-quadruped | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| neura-quadruped | pris | gyldighed | producentens eget ord er "Estimated" - ikke en bindende salgspris |
| pudu-d5 | egenvaegt | uddybning | entydig med-batteri-etiket |
| pudu-d5 | laengde | gyldighed | akserne umaerket i den trykte trippel (familie 5) |
| pudu-d5 | bredde | gyldighed | samme usikre akse-tildeling |
| pudu-d5 | hoejde | gyldighed | samme usikre akse-tildeling |
| pudu-d5 | nyttelast_gaaende | gyldighed | pressens overskrift viser kun intervallets oevre graense (familie 1) |
| pudu-d5 | hastighed | gyldighed | gaelder D5-serien bredt, ingen variant-specifik raekke i sammenligningstabellen (familie 4) |
| pudu-d5 | haeldning | gyldighed | markedsfoeringsteksten viser reelt D5-Ws tal, ikke D5s - krydskontamineringsrisiko |
| pudu-d5 | forhindring_enkelt | gyldighed | enkelt/kontinuerlig-tildelingen er vores fortolkning, ingen af etiketterne siger det selv (familie 5) |
| pudu-d5 | trappetrin_kontinuerlig | gyldighed | markedsfoeringsteksten viser reelt D5-Ws tal, ikke D5s - krydskontamineringsrisiko |
| pudu-d5 | temp_maks | uddybning | ekstra ubrugt tal, klart adskilt fra temp_min for at undgaa forveksling |
| pudu-d5 | driftstid | uddybning | korrekt lastbetinget tal valgt, ved_last strukturelt til stede |
| pudu-d5 | pris | uddybning | ren citation |
| pudu-d5-w | egenvaegt | uddybning | entydig med-batteri-etiket |
| pudu-d5-w | laengde | gyldighed | samme usikre akse-tildeling som D5 (familie 5) |
| pudu-d5-w | bredde | gyldighed | samme usikre akse-tildeling |
| pudu-d5-w | hoejde | gyldighed | samme usikre akse-tildeling |
| pudu-d5-w | nyttelast_gaaende | uddybning | identisk tal for D5/D5-W i selve tabellen, ingen konflikt for denne variant |
| pudu-d5-w | hastighed | gyldighed | stammer fra generel markedsfoeringstekst for hele serien, ikke en variant-specifik tabelraekke (familie 4) |
| pudu-d5-w | haeldning | uddybning | stemmer overens paa tvaers af kilder for netop denne variant, ingen konflikt |
| pudu-d5-w | forhindring_enkelt | gyldighed | samme tildelingsforbehold som D5 (familie 5) |
| pudu-d5-w | trappetrin_kontinuerlig | uddybning | stemmer overens paa tvaers af kilder for netop denne variant |
| pudu-d5-w | temp_maks | uddybning | ekstra ubrugt tal, samme afklaring som D5 |
| pudu-d5-w | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| pudu-d5-w | pris | uddybning | ren citation |
| genisom-qiuqiu-sp1 | egenvaegt | uddybning | operator bevaret, ren citation |
| genisom-qiuqiu-sp1 | laengde | uddybning | praecist tal, ingen cirka-markoer |
| genisom-qiuqiu-sp1 | nyttelast_gaaende | uddybning | krydsbekraeftet af marketingtekst |
| genisom-qiuqiu-sp1 | haeldning | uddybning | krydsbekraeftet af marketingtekst |
| genisom-qiuqiu-sp1 | trappetrin_kontinuerlig | uddybning | forklarer korrekt hvorfor soesterfeltet er tomt |
| genisom-qiuqiu-sp1 | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| raion-robotics-raibo2 | egenvaegt | gyldighed | sekundaer kilde (laboratoriet), producenten selv oplyser ingen vaegt |
| raion-robotics-raibo2 | hastighed | gyldighed | sekundaer kilde plus loft-operator, ikke en driftshastighed |
| raion-robotics-raibo2 | driftstid | gyldighed | sekundaer kilde, ingen lastbetingelse (familie 3) |
| rainbow-robotics-rbq-10 | egenvaegt | uddybning | manualen praeciserer entydigt med batteri |
| rainbow-robotics-rbq-10 | frihedsgrader | gyldighed | ikke oplyst som specifikation, udledt af SDK-tekst (familie 5) |
| rainbow-robotics-rbq-10 | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores (familie 6) |
| rainbow-robotics-rbq-10 | hastighed | gyldighed | to modstridende tal paa samme side, ingen kan afvises (modstridende kilder) |
| rainbow-robotics-rbq-10 | haeldning | gyldighed | oplyst i procent, ikke sammenlignelig med graders-baserede poster uden omregning (familie 3) |
| rainbow-robotics-rbq-10 | trappetrin_kontinuerlig | gyldighed | to modstridende tal paa samme side (modstridende kilder) |
| rainbow-robotics-rbq-10 | batteri_wh | uddybning | krydstjek bekraefter, gaar op |
| rainbow-robotics-rbq-10 | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| rainbow-robotics-rbq-10 | ladetid | gyldighed | eneste med ladebetingelse i tallet - ikke sammenlignelig med andres fulde opladning (familie 3) |
| rivr-one | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores (familie 6) |
| rivr-one | hastighed | uddybning | krydstjek bekraefter, gaar op |
| rivr-one | ladetid | uddybning | interval korrekt bevaret, ren typografisk note |
| galileo-s1 | egenvaegt | uddybning | ren tabel-citation |
| galileo-s1 | laengde | uddybning | ren tabel-citation |
| galileo-s1 | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores, arvet fra C1 (familie 6) |
| galileo-s1 | nyttelast_staaende | uddybning | ren tabel-citation |
| galileo-s1 | hastighed | uddybning | transparent om ikke-brugt graensehastighed |
| galileo-s1 | haeldning | uddybning | ren tabel-citation |
| galileo-s1 | forhindring_enkelt | uddybning | begge klatrefelter entydigt maerket i samme raekke, ingen sammenblanding |
| galileo-s1 | trappetrin_kontinuerlig | uddybning | begge klatrefelter entydigt maerket i samme raekke |
| galileo-s1 | temp_min | uddybning | tilvalgsgraense forklaret |
| galileo-s1 | batteri_wh | uddybning | ren komparativ note |
| galileo-s1 | driftstid | gyldighed | lastbetingelsen er kun eksplicit maerket paa intervallets nedre ende, ikke det oevre (familie 3-nuance) |
| galileo-s1-w | egenvaegt | uddybning | ren tabel-citation |
| galileo-s1-w | laengde | uddybning | ren tabel-citation |
| galileo-s1-w | hoejde | uddybning | forventet forskel til S1 |
| galileo-s1-w | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen arvet fra S1 (familie 6) |
| galileo-s1-w | nyttelast_staaende | uddybning | identisk med S1, ren bekraeftelse |
| galileo-s1-w | hastighed | uddybning | identisk med S1, transparent om ikke-brugt tal |
| galileo-s1-w | haeldning | uddybning | ren tabel-citation |
| galileo-s1-w | forhindring_enkelt | uddybning | egen entydig vaerdi, forventet forskel til S1 |
| galileo-s1-w | trappetrin_kontinuerlig | uddybning | identisk med S1 |
| galileo-s1-w | temp_min | uddybning | tilvalgsgraense forklaret |
| galileo-s1-w | batteri_wh | uddybning | identisk med S1 |
| galileo-s1-w | driftstid | gyldighed | lastbetingelsen er kun eksplicit maerket paa intervallets nedre ende (samme nuance som S1) |
| bhairav-robotics-shvana | egenvaegt | uddybning | producenten angiver eksplicit grundlaget (uden nyttelast) |
| bhairav-robotics-shvana | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores (familie 6) |
| bhairav-robotics-shvana | hastighed | uddybning | producentens eget tilde-forbehold korrekt bevaret som operator |
| bhairav-robotics-shvana | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| boston-dynamics-spot | egenvaegt | gyldighed | to interne konsistente, men forskellige producenttal - ingen kan afvises (modstridende kilder) |
| boston-dynamics-spot | laengde | gyldighed | produktsiden er en faktor 10 fra databladet (faktor 10-fejl, modstridende kilder) |
| boston-dynamics-spot | hoejde | uddybning | klart labelmaerkede alternativer, korrekt valg forklaret |
| boston-dynamics-spot | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores (familie 6) |
| boston-dynamics-spot | haeldning | uddybning | ren notation-forklaring |
| boston-dynamics-spot | forhindring_enkelt | gyldighed | feltidentiteten er vores tolkning, en navngiven ekstern sammenligning hviler paa den (familie 5) |
| boston-dynamics-spot | temp_min | uddybning | ren citation |
| boston-dynamics-spot | batteri_wh | uddybning | urelateret ekstra faktum |
| boston-dynamics-spot | driftstid | gyldighed | producentens egen fodnote: driftstiden varierer med last og miljoe (familie 2) |
| boston-dynamics-spot | ladetid | gyldighed | databladet giver et andet, betinget tal end produktsidens ubetingede (modstridende kilder) |
| genisom-tongchui-m1 | egenvaegt | gyldighed | marketingkort og tabel modsiger hinanden paa samme side, 41 vs. 30kg (modstridende kilder) |
| genisom-tongchui-m1 | laengde | uddybning | korrekt ingen operator tilfoejet, jf. kilden |
| genisom-tongchui-m1 | hoejde | uddybning | krybende maal uden skemafelt |
| genisom-tongchui-m1 | frihedsgrader | gyldighed | metabeskrivelsen paastaar 16, tabellen 12 - modstridende kilder |
| genisom-tongchui-m1 | nyttelast_gaaende | gyldighed | arver egenvaegtens 41-vs-30kg-modstrid, som paavirker fortolkningen af dette tal |
| genisom-tongchui-m1 | hastighed | uddybning | krydsbekraeftet, transparent om ikke-brugt graensetal |
| genisom-tongchui-m1 | haeldning | uddybning | krydsbekraeftet af marketingkortet |
| genisom-tongchui-m1 | forhindring_enkelt | uddybning | korrekt adskilt fra trappetrin_kontinuerlig, ikke en konflikt |
| genisom-tongchui-m1 | trappetrin_kontinuerlig | uddybning | krydsbekraeftet af marketingkortet |
| genisom-tongchui-m1 | temp_min | uddybning | basisspecifikation korrekt valgt frem for tilvalg |
| genisom-tongchui-m1 | temp_maks | uddybning | samme som temp_min |
| genisom-tongchui-m1 | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| genisom-tongchui-m1 | ladetid | uddybning | ren citation |
| genisom-tongchui-m1-pro | egenvaegt | gyldighed | arver basisudgavens 41-vs-30kg-modstrid (modstridende kilder) |
| genisom-tongchui-m1-pro | hoejde | uddybning | krybende maal uden skemafelt |
| genisom-tongchui-m1-pro | frihedsgrader | uddybning | identisk med basisudgaven, ingen ny modstrid nævnt her |
| genisom-tongchui-m1-pro | nyttelast_gaaende | uddybning | identisk med basisudgaven, ingen tvivl rejst i denne tekst |
| genisom-tongchui-m1-pro | hastighed | uddybning | identisk med basisudgaven, transparent om ikke-brugt tal |
| genisom-tongchui-m1-pro | haeldning | uddybning | identisk med basisudgaven |
| genisom-tongchui-m1-pro | forhindring_enkelt | gyldighed | fra det delte, ikke-variant-specifikke marketingkort, ikke fra Pros egen datablok (familie 4/5) |
| genisom-tongchui-m1-pro | trappetrin_kontinuerlig | uddybning | fra variantens egen datablok, ikke det delte kort - modsat forhindring_enkelt |
| genisom-tongchui-m1-pro | temp_min | uddybning | basisspecifikation korrekt valgt |
| genisom-tongchui-m1-pro | temp_maks | uddybning | samme som temp_min |
| genisom-tongchui-m1-pro | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| genisom-tongchui-m1-pro | ladetid | uddybning | identisk med basisudgaven |
| genisom-tongchui-m1-ultra | egenvaegt | gyldighed | arver basisudgavens 41-vs-30kg-modstrid (modstridende kilder) |
| genisom-tongchui-m1-ultra | hoejde | uddybning | krybende maal uden skemafelt |
| genisom-tongchui-m1-ultra | frihedsgrader | uddybning | identisk med basisudgaven og M1 Pro |
| genisom-tongchui-m1-ultra | nyttelast_gaaende | uddybning | identisk med basisudgaven og M1 Pro |
| genisom-tongchui-m1-ultra | hastighed | uddybning | identisk med basisudgaven og M1 Pro, transparent om ikke-brugt tal |
| genisom-tongchui-m1-ultra | haeldning | uddybning | identisk med basisudgaven og M1 Pro |
| genisom-tongchui-m1-ultra | forhindring_enkelt | gyldighed | fra det delte marketingkort, ikke fra Ultras egen datablok (familie 4/5) |
| genisom-tongchui-m1-ultra | trappetrin_kontinuerlig | uddybning | fra variantens egen datablok, ikke det delte kort |
| genisom-tongchui-m1-ultra | temp_min | uddybning | basisspecifikation korrekt valgt |
| genisom-tongchui-m1-ultra | temp_maks | uddybning | samme som temp_min |
| genisom-tongchui-m1-ultra | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| genisom-tongchui-m1-ultra | ladetid | uddybning | identisk med basisudgaven og M1 Pro |
| addverb-trakr-20 | nyttelast_gaaende | gyldighed | gaaende-tildelingen er vores, og resten af fanens tabel er kendt upaalidelig (familie 6) |
| addverb-trakr-5 | egenvaegt | uddybning | entydig med-batteri-etiket |
| addverb-trakr-5 | hoejde | uddybning | ekstra krybe-maal uden skemafelt |
| addverb-trakr-5 | frihedsgrader | gyldighed | aktuator-antal som DoF-proxy (familie 5) |
| addverb-trakr-5 | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores (familie 6) |
| addverb-trakr-5 | hastighed | uddybning | ren tabel-citation |
| addverb-trakr-5 | haeldning | uddybning | to kilder enige om tallet, kun operatoren er laant |
| addverb-trakr-5 | trappetrin_kontinuerlig | gyldighed | to modstridende tal for samme evne paa samme side (modstridende kilder) |
| addverb-trakr-5 | ip_klasse | gyldighed | eksplicit tilvalg, ikke standard paa alle enheder (familie 4) |
| addverb-trakr-5 | temp_maks | uddybning | ren citation |
| addverb-trakr-5 | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| addverb-trakr-5 | ladetid | gyldighed | talvaerdi identisk med et andet felt, muligvis en producent-tilfaeldighed, ikke rettet |
| ghost-robotics-vision-60 | egenvaegt | uddybning | krydstjek bekraefter, gaar op |
| ghost-robotics-vision-60 | bredde | uddybning | ekstra maal, ren info |
| ghost-robotics-vision-60 | hoejde | uddybning | ekstra maal, ren info |
| ghost-robotics-vision-60 | frihedsgrader | uddybning | producenten skriver eksplicit "Degrees of Freedom", ingen tolkning noedvendig |
| ghost-robotics-vision-60 | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores (familie 6) |
| ghost-robotics-vision-60 | hastighed | gyldighed | briefets eget eksempel: metrisk/imperialt regnestykke gaar ikke op (faktor/regnefejl) |
| ghost-robotics-vision-60 | ip_klasse | uddybning | uddybende, ikke modstridende detalje |
| ghost-robotics-vision-60 | temp_min | gyldighed | det viste tal er ikke et koldstartstal - identitetsforskel mellem drift og koldstart (familie 5) |
| ghost-robotics-vision-60 | driftstid | gyldighed | eneste post i kataloget med en hastighedsbetingelse i stedet for en lastbetingelse (familie 3) |
| ghost-robotics-vision-60 | ladetid | uddybning | ren citation |
| yobotics-y10 | egenvaegt | uddybning | cirka og tolerance paa samme tal, ren info |
| yobotics-y10 | nyttelast_gaaende | uddybning | producentens egen etiket siger direkte "gaaende", en aflaesning ikke en slutning |
| yobotics-y10 | hastighed | gyldighed | eksplicit "ser sammenligneligt ud og er det ikke helt" - lastbetingelse mangler paa hastighed (familie 3) |
| yobotics-y20 | egenvaegt | uddybning | med batteri, ren info |
| yobotics-y20 | hoejde | uddybning | foldemaal uden skemafelt |
| yobotics-y20 | nyttelast_gaaende | uddybning | producentens egen etiket siger direkte "gaaende", ingen tolkning |
| yobotics-y20 | nyttelast_staaende | uddybning | producentens egen etiket siger direkte "staaende" |
| yobotics-y20 | hastighed | uddybning | ren citation |
| yobotics-y20 | haeldning | uddybning | ren citation |
| yobotics-y20 | trappetrin_kontinuerlig | gyldighed | konservativ placering, siden siger ikke selv "kontinuerlig" (familie 5) |
| yobotics-y20 | temp_min | uddybning | komparativ faktuel note, ikke en tvivl om tallet |
| yobotics-y20 | driftstid | gyldighed | kvalitativ lastbetingelse uden kg-tal (familie 3) |
| yobotics-y20 | ladetid | gyldighed | gaelder en tilvalgt ladestander, ikke standardudstyr (familie 4) |
| yuejia-yj30 | egenvaegt | gyldighed | ingen angivelse af med/uden batteri - underminerer sammenlignelighed |
| yuejia-yj30 | laengde | uddybning | akserne eksplicit maerket, ingen tvivl om laengden |
| yuejia-yj30 | hoejde | gyldighed | vaerdien er rettet for en kildetastefejl (manglende "m") |
| yuejia-yj30 | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores (familie 6) |
| yuejia-yj30 | hastighed | uddybning | ét entydigt tal, ingen tvivl |
| yuejia-yj30 | haeldning | gyldighed | fra en sammenlagt/umaerket kolonne (爬坡角度/DOF) (familie 5) |
| yuejia-yj30 | trappetrin_kontinuerlig | gyldighed | feltidentiteten (enkelt/kontinuerlig) er vores fortolkning af ét ord (familie 5) |
| yuejia-yj30 | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| yuejia-yj30 | pris | uddybning | ren, entydig koebspris |
| yuejia-yj30-w | egenvaegt | uddybning | ren tabel-citation |
| yuejia-yj30-w | laengde | uddybning | ren tabel-citation |
| yuejia-yj30-w | nyttelast_gaaende | gyldighed | gaaende/staaende-tildelingen er vores (familie 6) |
| yuejia-yj30-w | hastighed | uddybning | forventet forskel til YJ30 |
| yuejia-yj30-w | haeldning | gyldighed | fra samme sammenlagte kolonne som YJ30 (familie 5) |
| yuejia-yj30-w | trappetrin_kontinuerlig | gyldighed | delt kolonnenavn med basisudgaven, feltidentitet er en tolkning (familie 5) |
| yuejia-yj30-w | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| yuejia-yj30-w | pris | uddybning | ren, entydig koebspris |
| yuejia-yj30-max | egenvaegt | uddybning | ren tabel-citation |
| yuejia-yj30-max | laengde | uddybning | ren tabel-citation |
| yuejia-yj30-max | nyttelast_gaaende | uddybning | producentens egen etiket siger direkte "dynamisk/gaaende", ingen tolkning |
| yuejia-yj30-max | nyttelast_staaende | uddybning | producentens egen etiket siger direkte "statisk/staaende" |
| yuejia-yj30-max | hastighed | uddybning | ét entydigt tal |
| yuejia-yj30-max | haeldning | uddybning | egen kolonne, ingen sammenblanding |
| yuejia-yj30-max | trappetrin_kontinuerlig | uddybning | ren tabel-citation |
| yuejia-yj30-max | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| yuejia-yj30-max | pris | uddybning | ren, entydig koebspris |
| yuejia-yj30-max-w | egenvaegt | uddybning | ren tabel-citation |
| yuejia-yj30-max-w | laengde | uddybning | ren tabel-citation |
| yuejia-yj30-max-w | nyttelast_gaaende | uddybning | producentens egen etiket siger direkte "dynamisk/gaaende" |
| yuejia-yj30-max-w | nyttelast_staaende | uddybning | producentens egen etiket siger direkte "statisk/staaende" |
| yuejia-yj30-max-w | hastighed | uddybning | forventet forskel til YJ30Max |
| yuejia-yj30-max-w | haeldning | uddybning | egen kolonne, ingen sammenblanding |
| yuejia-yj30-max-w | trappetrin_kontinuerlig | gyldighed | delt kolonnenavn med basisudgaven YJ30Max, feltidentitet er en tolkning (familie 5) |
| yuejia-yj30-max-w | driftstid | gyldighed | ved_last strukturelt ikke_oplyst - ingen lastbetingelse (familie 3) |
| yuejia-yj30-max-w | pris | uddybning | ren, entydig koebspris |
