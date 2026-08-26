# FUND-ekstern-katalogfeedback.md — ekstern feedback på katalogsiden, efterprøvet

26. aug 2026. JPK forelagde en ekstern designfeedback på katalogsiden (otte
punkter, tydeligt skrevet af en anden sprogmodel uden adgang til projektets
dokumenter). Dette dokument er **ikke** feedbacken; det er hvert af dens
punkter holdt op mod en måling.

**Besluttet af JPK samme dag: feedbacken går ind i retningsrunden som
briefmateriale**, ikke som et rettelsesspor. Se D15 i STATUS.md.

**Til den, der skriver retningsrundens briefs:** brug tabellerne herunder, ikke
den oprindelige tekst. Fem af otte punkter beskriver noget, siden allerede gør,
og ét bygger på et felt, der ikke findes.

---

## Hovedfundet, som feedbacken selv ikke kunne se

En udefrakommende så på siden og foreslog som **forbedring** fem ting, siden
allerede har. Det er diagnosen, ikke rosen: er paletten, billedformatet,
gitteret, typeparringen og hover-effekten allerede på plads, og siden **stadig**
læses som et gammelt admin-interface, så er problemet ingen af dem.

Det er **tætheden**. Hvert kort bærer fire nøgletal i to kolonner, plus
anvendelseschips, plus status, plus land — i en kasse på mindst 310 px.
Anmelderen mærkede symptomet rigtigt og gættede forkert på årsagen.

---

## Punkt for punkt, med målingen

| # | Feedbackens punkt | Målt status |
|---|---|---|
| 1 | 3 store kort pr. række i stedet for 4-5 | **Delvis ny.** Gitteret er `repeat(auto-fill,minmax(310px,1fr))` → 4 pr. række ved 1440 px (77 kort på 21 rækker, målt i browser). 3 kolonner er en reel mulighed, men prisen er sidelængde: katalogsiden er **14.580 px** i dag |
| 2 | Fjern 50-70 % af informationen fra kortet | **Afvist — se nedenfor.** Bryder produktet |
| 3 | Fast, ensartet billedformat, `cover` eller `contain` efter billedtype | **Allerede + i gang.** `aspect-ratio:16/10` findes; `cover`-vs-`contain` er præcis fund K1 og ligger nu hos `spor/billedramme` |
| 4 | Færre små borders | **Brugbar, med ét forbehold.** Se nedenfor |
| 5 | Off-white bund, næsten sort tekst, én accent, mono til data, sans til navne | **Allerede.** `#F2F3F5` · `#14161A` · `#0D5C86`; JetBrains Mono til etiketter, Manrope til navne. Står i DESIGN.md's frontmatter |
| 6 | Hover-state, subtil zoom, pilesignal | **Halvt allerede.** `.kort:hover .billedled img{transform:scale(1.024)}` findes (system.css:605). 2,4 % zoom er reelt usynligt — **pilesignalet er et ægte hul** |
| 7 | Søgefelt, filterrække, antal, sortering | **Tre af fire allerede.** Søgning, filtre og live-optalte antal findes. **Sortering mangler** |
| 8 | Grid frem for masonry | **Allerede.** Stramt grid, aldrig masonry |

---

## Punkt 2 — hvorfor det ikke kan gennemføres som skrevet

Feedbacken foreslår at erstatte kortets tal med `● Quadruped` og et årstal.
To målinger afgør det:

1. **`● Quadruped` er nul information.** Alle 77 robotter er firbenede — det er
   sidens navn og hele dens afgrænsning (L11 holder endda legetøj og
   undervisningskit ude). Chippen ville stå identisk på hvert eneste kort.
2. **Årstallet findes ikke.** Der er **intet lanceringsår i skemaets 30 felter**.
   At indføre det ville kræve et årstal for 77 robotter, og at gætte ét eneste
   er en direkte overtrædelse af **hård begrænsning 2** ("opfind aldrig tal").

Forslaget er altså at bytte fire kildebelagte tal for ét konstant felt og ét,
der ikke findes. **Kortets tæthed er ikke en fejl i designet — den er
produktet.** Det er dét, en besøgende ikke kan få andre steder.

Det betyder ikke, at tætheden er *velformet*. Se hovedfundet ovenfor.

---

## Punkt 4 — forbeholdet, der ikke må overses

"Fjern de mange små borders" er god håndværksmæssig kritik, men **de fire
datatilstandes kasser er bærende konstruktion, ikke pynt.** Hård begrænsning 5:
*"'Ikke oplyst', 'nej' og '0' er tre forskellige tilstande og skal se
forskellige ud. Det er der, katalogsider lyver."*

Den rigtige udgave: fjern hårstregerne **omkring** nøgletalscellerne og lad
mellemrum og typografi adskille dem — men behold den stiplede kasse for huller.

---

## Hvad retningsrunden skal tage med

1. **Byg én af de tre verdener bevidst "editorial"** — store billeder, få tal,
   sådan som feedbacken beskriver. Ikke for at vinde, men så prisen for tabt
   datatæthed kan **ses** i stedet for diskuteres. Det er den eneste måde,
   spørgsmålet kan afgøres på et andet grundlag end smag.
2. **Tre-kolonne-varianten skal måles, ikke skønnes:** sidelængde og
   billedareal, før og efter. Kommandoen findes:
   `node C:/Praktik/websites/maalevaerktoej/maal.mjs http://localhost:8080/da/robotter/ 1440`
3. **Tætheden er den rigtige variabel at variere mellem de tre verdener** —
   ikke paletten og ikke skrifterne, som allerede er afgjort og virker.

## Tre små gevinster, der ikke behøver vente på retningen

Tages som ét spor, når `spor/billedramme` er flettet:

- Hårstregerne omkring nøgletalscellerne væk; de stiplede huller bliver.
- Et synligt hover-signal ("→ Se robotten"), da 2,4 % zoom ikke registreres.
- En sorteringskontrol. **"Nyeste" kan ikke bygges** (intet årstal) — men
  *efter specifikationstæthed* eller *efter vægt* kan, og det passer sidens
  egen logik bedre end en dato, vi ikke har.

## Det jeg ikke kunne afgøre

Om tre kolonner faktisk føles bedre. Det er en smagsdom, der kræver at se begge,
og derfor hører den i retningsrunden frem for i en tabel her. Jeg har målt
prisen (sidelængde), ikke gevinsten.
