# ARBEJDSGANG.md — hvad tre evalueringer målte om arbejdsgangen selv

Sammenlagt 1. sep 2026 af **ARBEJDSGANG.md** (19. aug), **ARBEJDSGANG-2.md**
(26. aug) og **ARBEJDSGANG-3.md** (27. aug). De to sidste er slettet; deres
indhold står her.

**Hvorfor sammenlagt:** 517 linjer fordelt på tre filer, hvor de fleste fund
siden er destilleret til skills. Prosaen blev læst én gang og derefter aldrig;
skillene bliver kaldt. Denne fil er nu **indekset over, hvad hver runde fandt,
og hvor svaret bor i dag** — ikke udredningen. Går du efter detaljen bag et
fund, står den i den skill, fundet blev til.

**Numrene er bevaret med vilje.** O1–O5 og V1–V5 citeres fra levende filer:
`.claude/skills/brief/SKILL.md`, `.claude/skills/fejljagt/SKILL.md`,
`CLAUDE.md` og `tests/koer.mjs`. Et fund må omskrives, men aldrig omnummereres.

---

## Runde 1 — 19. aug 2026

Bestilt af JPK med fokus på **autonomi** og **parallelt agentarbejde**, efter
den første arbejdsdag.

Resultatet var de første projektskills og en udvidet `.claude/settings.json`.
Rundens varige bidrag er **tre miljøfælder**, som stadig koster et kald hver,
når de udelades — de står nu i CLAUDE.md's værktøjsafsnit og i `brief`-skillens
miljøblok:

- `head` i Bash tæller **ikke** som en læsning for Edit-værktøjet.
- `sed -i`, der ikke matcher, gør intet — tavst og med exit 0.
- Lange markdown-filer knækker i bash-heredocs. Brug Write-værktøjet.

---

## Runde 2 — 26. aug 2026

Bestilt af JPK: *"evaluér vores workflow ud fra det, du har lært i denne
session."* Grundlaget var én dags arbejde, ikke en fornemmelse: **13
agentbriefs sendt.**

| # | Fundet | Hvor svaret bor i dag |
|---|---|---|
| **O1** | Testfilen er en flettekonflikt af konstruktion — ramte **6 af 9** spor-flet | **Løst.** `tests/koer.mjs` opdager selv filer i `tests/dele/`; ét spor = én ny fil = ingen konflikt. Kontrakten står i `tests/LAESMIG.md` |
| **O2** | Et acceptkriterium, der aldrig blev kørt, måler ingenting — **2 af 13** briefs | **Løst.** `brief`-skillens punkt 2: kriteriet skal køres mod main og bære sit nuværende output |
| **O3** | Briefets rygrad blev skrevet i hånden 13 gange — **4 defekter** slap igennem | **Løst.** Blev til `brief`-skillen |
| **O4** | Beslutninger driver fra virkeligheden, og ingen måler det — **3 fund på én dag** | **Delvist.** Målingen blev kørt én gang og fandt sin egen grænse. Se det åbne punkt nederst |
| **O5** | Tre gange præsenterede orkestratoren en **slutning** som en **måling** | **Delvist.** `fejljagt`-skillen kræver mekanismesætning før rettelse og revert-bevis efter — men fejlformen gentog sig 1. sep, se nedenfor |

**Rangeringen dengang:** O2 var den billigste rettelse (én linje, ville have
fanget to af fire defekter); O1 den dyreste at lade være med (en manuel
konfliktløsning pr. flet, værre for hvert spor). Begge er udført.

---

## Runde 3 — 27. aug 2026

Bestilt af JPK: *"er der mangler? Har vi lavet fejl, som kunne være undgået?"*

| # | Fundet | Hvor svaret bor i dag |
|---|---|---|
| **V1** | **Orkestratoren er sessionens hyppigste regelbryder — 6 mod 2** | **Delvist.** `brief`-skillens punkt 10 giver agenterne mandat til at måle orkestratorens påstande. Se det åbne punkt |
| **V2** | En navngiven fejl gentog sig to gange — **papirregler standser ingenting** | **Delvist.** Skillene er bygget med mekaniske felter frem for formaninger, netop derfor |
| **V3** | Citater slår igennem uden kontrol — **to gange på én session** | **Løst.** `brief`-skillen: et citat er et tal. Citeret med linjenummer og slået op = høj konfidens; citeret efter hukommelse = lav, og skal mærkes |
| **V4** | Øjebliksbilleder af dynamisk tilstand **rådner på timer** | **Løst som regel.** Et kritikdokument er et øjebliksbillede af et katalog i bevægelse — genmål hvert fund lige før sporet sendes, ikke da dokumentet blev skrevet |
| **V5** | **Miljøet er en større fejlkilde end koden** | **Løst.** Fik sit eget værn i `brief`-skillens miljøblok og i CLAUDE.md's værktøjsafsnit |

---

## Hvad der virkede, og som ikke må optimeres væk

Tre ting bar de tidlige dage. De er navngivet her, så en fremtidig oprydning
ikke fjerner dem i god tro:

**Genmålingen før afsendelse betaler sig med det samme.** Da Å18's tolv fund
skulle sendes ud, viste genmålingen, at **to af dem havde ændret sig under os
på under fire timer** — ét var løst af et andet spor, ét var blevet værre. Et
spor sendt på det første ville have arbejdet på et problem, der ikke fandtes.

**Konfidensskalaen med den kontrafaktiske linje virker.** Agenterne
rapporterer huller, de kunne have skjult. Det er den ærlighed, der gør
reviewet muligt overhovedet.

**"Ret assertions, slet dem ikke" bliver fulgt under pres.** Målt gentagne
gange siden — senest 1. sep, hvor et spor flyttede en påstand om hård
begrænsning 5 derhen, hvor beviset var flyttet, og *skærpede* den undervejs,
uden at være bedt om det.

---

## Det åbne punkt: orkestratoren har stadig ingen kontrollant

ARBEJDSGANG-3 skrev det som rundens vigtigste uløste, og formuleringen står
uændret, fordi den holdt:

> Punkt 10 giver agenterne mandat til at måle mine påstande i briefs — men
> mine analyser, fletbeskeder og STATUS-poster læses af ingen. Det
> strukturelle svar ville være et periodisk review-spor på den mest kapable
> model, der læser orkestratorens egne dokumenter mod virkeligheden. **Ikke
> bygget — det er en beslutning om pris, og den er JPK's.**

**1. sep 2026 blev forudsigelsen indfriet, og prisen målt.** CLAUDE.md sagde,
at D15 låste paletten, og at L40 valgte INSTRUMENT som retning. Begge dele var
omgjort af L54 den 31. aug. Orkestratoren læste sin egen forældede note og
skrev den ind i **syv briefs på én dag**. Farve- og skriftlisten var
tilfældigvis stadig rigtig, så ingen agent byggede noget galt — men INSTRUMENT
blev givet som pejlemærke til designspor, og det er udtrykkeligt det, en flade
IKKE skal ligne.

**Fejlen blev fundet, fordi ét spor slog efter i STATUS.md i stedet for at tro
på CLAUDE.md.** Ingen regel bad det om det; `brief`-skillens punkt 10 gjorde
det lovligt, men ikke påkrævet. Det er nøjagtig det hul, V1 beskrev: hver
gentagelse af orkestratorens fejl ser ud som en bekræftelse, og de syv spor
kunne ikke opdage den uden at gå uden om deres eget brief.

**Det, der stadig mangler, er ikke en regel — det er en læser.**

---

## Det, ingen af de tre runder kunne måle

Om skillene faktisk ændrer adfærd, eller om de bliver endnu et lag papir oven
på reglerne, de er destilleret af. V2 siger, at papir ikke standser noget.
Skillene er bygget med mekaniske felter netop derfor — men beviset kommer ved
næste spor-afsendelse, næste flet og næste røde tal, ikke i en evaluering.
