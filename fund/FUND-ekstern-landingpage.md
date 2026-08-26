# FUND-ekstern-landingpage.md — ekstern feedback på forsiden, efterprøvet

26. aug 2026. JPK forelagde en ekstern designfeedback på forsiden (otte punkter,
skrevet af en anden sprogmodel uden adgang til projektets dokumenter). Dette er
ikke feedbacken; det er hvert punkt holdt op mod en måling.

**Besluttet af JPK samme dag (D16):** rammesætningen og hero-spørgsmålet går
ind i retningsrunden. Tre gevinster, der ikke afhænger af hvilken retning der
vinder, blev taget med det samme som `spor/indgang`.

Feedbacken er **bedre end katalog-feedbacken** (`FUND-ekstern-katalogfeedback.md`),
fordi den fremsætter et strukturelt argument frem for en stilliste.

---

## Hovedfundet: halvdelen af forslaget var allerede sket, uden en beslutning

Feedbacken foreslår at *"flytte filtre og sortering ind på katalogsiden."*
**Det var allerede gjort.** Beslutning L17 lyder ordret:

> *"Kort overskrift der siger hvad siden er, **søgefelt og anvendelsesfiltre
> synlige i første viewport**."*

Målt på den byggede forside 26. aug 2026:

| L17 kræver | Findes på forsiden |
|---|---|
| Søgefelt i første viewport | **Nej** |
| Anvendelsesfiltre i første viewport | **Nej** |

Sporene efter flytningen lå stadig i koden:

* **Fire døde i18n-nøgler, 0 kaldesteder hver:** `forside_filtre_etiket`,
  `forside_formaal_titel`, `forside_formaal_forklaring`, `soeg_kraever_js`.
* **Dødt CSS-afsnit:** `generator.css` §1d styler `formaal-gitter`,
  `formaalsfilter` og `formaal-chip` — alle renderet **0 gange**.
* **Et misvisende nøglenavn:** `forside_soeg_etiket` bruges nu af
  **katalogsiden** (`katalog.mjs:230`), men bærer stadig `forside`-navnet.

Det er samme mønster som `billedled--plade`, fundet samme dag: en kodesti, der
findes uden at nogen kalder den. Forsiden havde altså allerede bevæget sig mod
den retning, feedbacken foreslog — L17 var bare aldrig rettet med.

**Ført som L38.**

---

## Punkt for punkt, med målingen

| # | Feedbackens punkt | Målt status |
|---|---|---|
| 1 | Lad en stor robot fylde heroen; evt. fuldbredde-billede/video | **Kan ikke bygges som skrevet.** Se nedenfor |
| 2 | "Se hvor forskellige de er" — visuel kontrast frem for specs | **Brugbar og forenelig med L17.** Feedbackens bedste idé |
| 3 | Stor Explore-sektion med billedkort, specs ved hover | **Brugbar.** Løser tætheds-spændingen fra katalog-feedbacken |
| 4 | Landingpagen skal ikke vise alle data; flyt filtre til kataloget | **Allerede sket** — se hovedfundet |
| 5 | Meget større afslutnings-CTA | **Brugbar.** Forsiden er kun 2.846 px høj og slutter med et stille link |
| 6 | Retningen: fra database til digitalt showroom | **Går i retningsrunden.** Det er selve spørgsmålet |
| 7 | Rækkefølge: hero → kontrast → udvalg → CTA | Ligger i retningsrunden |
| 8 | Grid frem for masonry | **Allerede.** Stramt grid, aldrig masonry |

---

## Punkt 1 — hvorfor heroen ikke kan bygges som beskrevet

**Én robot i heroen er præcis det, L17 forbyder:** *"Ingen robot fremhævet — at
vælge én ville være en anbefaling."* Et fuldbredde-billede af én quadruped er
den stærkeste redaktionelle udvælgelse, siden kan foretage, på en flade hvis
hele position er, at den ikke anbefaler noget. Og spørgsmålet har intet svar:
*hvilken robot?*

**Videoen findes ikke.** Målt 26. aug: **0 egne fotos, 1 silhuet.** En
producentvideo er samme ophavsretsspørgsmål som stillbillederne, og hård
begrænsning 4 lukker den syntetiske vej.

**Kompositionsbudgettet.** `DESIGN.md:452` — JPK's eget tillæg fra 24. aug:
åbningen må fylde 1.350 px og måler 1.348. Et fuldbredde-hero sprænger det.

### Men feedbackens punkt 2 løser dens eget punkt 1

De **fire målte yderpunkter vist stort** er et billedbårent hero, der ikke er et
udvalg: fire kendsgerninger om katalogets spændvidde, ikke en anbefaling. Det er
den udgave, alle tre retningsspor har fået besked på at bruge — og det er
feedbackens egen idé, to afsnit efter at den foreslog det modsatte.

**Ét værn, der blev skrevet ind i alle tre briefs:** kun robotter med `operator: null`
må bære et yderpunkt. En robot oplyst som *"højst 100 kg"* kan ikke bevise at
være tungest. Det er fund K5 fra `KRITIK-3-side.md`, allerede lukket.

---

## Hvad retningsrunden tager med

1. **Rammesætningen**, som er skarpere end noget i KRITIK-3:
   *forsiden svarer på "hvorfor skal jeg udforske det her?", kataloget på
   "hvordan sammenligner jeg?"*. Den er nu grundlaget for de tre verdener.
2. **Hero-spørgsmålet** afgøres ved at bygge, ikke ved at diskutere: VITRINE
   bygger den mest billedbårne udgave, der overhovedet kan lade sig gøre inden
   for reglerne.
3. **Tætheden er variablen**, jf. D15 — ikke paletten og skrifterne.

## Hvad `spor/indgang` tog med det samme

Fordi de ikke afhænger af hvilken retning der vinder:

* Afslutningssektionen med udledte tal og uden salgssprog.
* Hover-signalet på kortet — `scale(1.024)` er 2,4 % og reelt usynligt.
* Oprydningen efter L38: de fire døde nøgler, CSS §1d, og omdøbningen
  `forside_soeg_*` → `katalog_soeg_*`.
* Dertil en gæld fra `spor/enheder`: kildeformen *"Producenten skrev: 1100 mm"*
  står på 84 robotsider men **0 gange på sammenligningssiden**, hvor
  enhedsfundet oprindelig kom fra.

## Det jeg ikke kunne afgøre

Om showroom-retningen faktisk er bedre. Det er en smagsdom, der kræver at se
begge, og derfor hører den i retningsrunden. Jeg har målt prisen (L17,
budgettet, de manglende egne optagelser), ikke gevinsten.
