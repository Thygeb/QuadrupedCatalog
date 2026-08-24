# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Datafiler (YAML) + selvskrevet Node-generator uden afhængigheder, der udsender statisk
HTML pr. sprog. Klientside-filtrering over et lille JSON-indeks. Bekræftet af brugeren
19. aug 2026. Fravalgt: Astro/11ty (npm-afhængigheder og opdateringsforpligtelse) og
én-fils-modellen fra KeyResearch-siden (bryder sammen ved ~60 robotter × flere sprog, og
efterlader ingen delbar URL pr. robot).

## Users

**Primær:** den nysgerrige fagperson — presse, studerende og folk i branchen — der vil
forstå, hvad feltet af firbenede robotter består af. Hun ankommer typisk **uden** et
modelnavn i hovedet og vil have et retvisende overblik over feltet, ikke en
anskaffelsesbeslutning.

**Sekundær:** driftschef, teknisk indkøber, CTO/COO i produktion, logistik, forsyning,
inspektion og beredskab i Nordeuropa, som overvejer en firbenet robot til en konkret
opgave og skal kunne afvise mange modeller hurtigt og begrunde valget internt; samt
forskere og integratorer, der skal bruge SDK-, ROS- og nyttelastoplysninger samlet ét
sted.

Den nysgerrige fagperson ankommer typisk fra en generel søgning ("firbenede robotter",
"robothund"), en nyhedsartikel eller ren nysgerrighed efter feltet — ikke fra et
modelnavn. Den tekniske indkøber ankommer stadig ofte fra en søgning på en konkret
model eller et konkret krav ("firbenet robot IP67", "nyttelast 20 kg").

**Ændret 24. aug 2026 (L31):** primær og sekundær er byttet om. Tidligere stod den
tekniske indkøber som primær. Se L31 i STATUS.md for begrundelsen og hvad der talte
imod.

## Product Purpose

Et komplet, kildeangivet opslagsværk over verdens firbenede robotter. Feltet er
afgrænset — omkring 42 producenter globalt, og den grundigste eksisterende oversigt
sammenligner 28+ modeller. Det betyder, at kataloget kan gøres **færdigt**, i modsætning
til humanoid.guide, hvis ~235 poster nødvendigvis er tynde.

Succes: en nysgerrig fagperson uden forudgående kendskab kan på få minutter få et
retvisende billede af feltet — hvor mange producenter, hvilke typer robotter, hvad de
kan — med kilde på hvert tal, og kan citere eller dele siden videre uden selv at skulle
efterprøve tallene.

For den sekundære læser gælder det tidligere kriterium fortsat: en teknisk indkøber kan
på under ti minutter komme fra "vi overvejer en firbenet robot" til en kort liste på
to-tre modeller, med kilde på hvert tal, og sende linket videre uden at skulle forklare
hvor tallene kommer fra.

## Positioning

Tre ting, en konkurrerende oversigt ikke kan kopiere uden at lave arbejdet:

1. **Hvert tal har en kilde og en hentedato.** Poster over 12 måneder markeres synligt
   som forældede. Gælder for enhver læser: en journalist, der citerer ét tal, skal
   kunne belægge det lige så let som en indkøber, der sammenligner ti.
2. **EU-kolonnen — en hensigt, vi arbejder mod, ikke en position, siden indtager i
   dag.** Feltet skal dække CE-mærkning oplyst ja/nej/ukendt, tilgængelighed i EU,
   EU-service og leveringstid. Målt 24. aug 2026: `ce_oplyst` er udfyldt på 2 af 46
   robotter, de tre øvrige EU-felter på 0 af 46 — 2 af 184 mulige feltværdier. Ingen
   eksisterende oversigt svarer på spørgsmålet i dag, men det gør vi heller ikke
   endnu. Spørgsmålet tjener desuden primært den sekundære læser (teknisk indkøber,
   integrator) — den primære læser har sjældnere brug for at vide, om en dansk fabrik
   må sætte maskinen i drift. **Ændret 24. aug 2026 (L31):** påstanden om at køberen
   selv bliver importør ved direkte køb fra Asien var allerede droppet af L25 i
   STATUS.md, men stod stadig i denne fil — rettet her.
3. **Specifikationstæthed** som eneste rangering: hvor mange af skemaets 33 felter
   producenten faktisk oplyser (nævneren er udledt af skemaet, se L30 i STATUS.md).
   Den måler producenternes åbenhed, ikke vores mening, kan ikke spilles uden at
   udgive flere data, og erstatter den 1-5-score, konkurrenten bruger uden offentlig
   metode. Det er lige så læsbart for en nysgerrig læser, der vil vide, hvor
   gennemsigtigt feltet er, som for en indkøber, der skal vælge — begge kan se
   forskel på en producent, der svarer, og en, der ikke gør.

## Operating Context

Den nysgerrige fagperson kommer typisk uden et referencepunkt: hun kender ikke feltets
størrelse, sprogbrug eller hvilke producenter der findes, og skal kunne orientere sig
uden at kende et modelnavn i forvejen. Artikler, oplæg og undervisning citerer ofte ét
tal eller én robot ad gangen — kildeangivelsen skal derfor holde til at blive citeret
isoleret, ikke kun i sammenhæng med resten af siden.

Den tekniske indkøber (sekundær) sammenligner typisk mod et eksisterende alternativ
(fast installation, drone, menneske på en rundering) og skal kunne begrunde en
indstilling for en ledelse eller et indkøbsudvalg. Beslutningen kræver ofte tal,
producenten ikke oplyser — derfor skal "ikke oplyst" være en synlig og filtrerbar
tilstand, ikke et tomt felt, uanset hvilken af de to læsere der ser den.

Udgives af KeyResearch, Aarhus, under eget domæne og eget navn. KeyResearch står som
udgiver i footer og på Om-siden, ikke som afsender i katalogposterne.

## Capabilities and Constraints

- Dansk og engelsk ved lancering. Arkitekturen skal kunne tage flere sprog (kinesisk,
  tysk) uden ombygning: sprogneutrale tal ét sted, oversat tekst i én fil pr. sprog,
  URL pr. sprog, `hreflang` imellem dem.
- Metrisk primært; imperial som klientside-omregning af samme tal, ikke som oversættelse.
- Statisk. Ingen tredjepartskald, ingen cookies, ingen tracking-scripts.
- Skal virke uden JavaScript: kataloget renderes statisk med alle robotter, JS tilføjer
  filtrering.
- **Der findes ingen forhandleraftale mellem KeyResearch og nogen fabrikant.** Siden må
  aldrig kunne læses som en salgskanal: ingen købsknap, ingen affiliate-links, ingen
  "forespørg pris"-formular i en katalogpost.
- **Opfind aldrig tal.** Håndhæves mekanisk: bygget fejler, hvis et talfelt mangler
  enhed eller kilde.
- **Ændret 19. aug 2026 (L13):** fabrikanternes billeder må bruges, **så længe siden er
  lokal**. Siden må ikke publiceres med dem uden skriftlig tilladelse — se spærring S1 i
  STATUS.md. Den oprindelige regel lød: fabrikanternes marketingbilleder må ikke genudgives — hverken juridisk eller fordi
  det er det stærkeste mulige signal om et forhandlerforhold, der ikke findes.

## Brand Commitments

Navn og domæne er ikke valgt endnu (åben beslutning). Bindende: KeyResearch nævnes som
udgiver, og linjen om ingen forhandleraftale med nogen fabrikant står på Om-siden.
Tone arves fra KeyResearch-siden: rolig, konkret, teknisk, korte sætninger, ærlige
begrænsninger, ingen superlativer.

## Evidence on Hand

- Ingen egne målinger af nogen firbenet robot. Alt indhold ved lancering er
  producentoplyste tal med kilde, plus felter vi selv regner ud af dem med formlen synlig.
- Ingen kundereferencer, ingen pilotinstallationer, ingen testresultater. Må ikke
  fabrikeres.
- Ingen billedbank. Robotbilleder er et uløst problem og skal løses med materiale, vi
  selv fremstiller eller har skriftlig tilladelse til.
- Genbrugeligt fra KeyResearch-projektet: ni målescripts i `c:\Praktik\website\tools\`,
  fontstrategi (Manrope + JetBrains Mono, lokale variable woff2), `<picture>`-mønster.

## Product Principles

1. **Et tal uden kilde findes ikke.** Hellere et synligt "ikke oplyst" end et plausibelt
   estimat.
2. **"Ikke oplyst", "nej" og "0" er tre forskellige ting** og skal se forskellige ud.
   Det er der, katalogsider lyver.
3. **Færdigt slår stort.** 60 komplette poster er mere værd end 235 halve.
4. **Vi rangerer producenternes åbenhed, ikke deres kvalitet.** Vi har ikke testet dem.
5. **Uafhængighed bevises ved at kunne citeres, ikke ved at blive påstået.** Derfor intet
   salgslag i kataloget.

## Accessibility & Inclusion

Samme niveau som KeyResearch-siden: WCAG-kontrast målt som fladeandel, berøringsmål
≥44 px, skip-link, tastaturbetjenbare filtre, reduceret bevægelse respekteres, og
tabeller der kan læses af skærmlæsere. Filtrering må ikke kræve mus.
