# ARBEJDSGANG-2.md — hvad dagen målte om arbejdsgangen selv

26. aug 2026. Bestilt af JPK: *"evaluér vores workflow ud fra det, du har lært
i denne session. Hvordan kan vi optimere det?"*

Grundlaget er én dags arbejde, ikke en fornemmelse: **13 agentbriefs sendt,
12 flet, tests fra 217 til 278, fem af KRITIK-3's tolv fund lukket.** Hver
optimering nedenfor bærer det tal, der begrunder den. Er der ikke et tal, står
der, at det er et skøn.

**Arbejdsgangen virker.** Det, der følger, er ikke en dom over den — det er de
fem steder, hvor den kostede mest i dag, rangeret efter hvad de kostede.

---

## O1. Testfilen er en flettekonflikt af konstruktion — 6 af 9 spor-flet

**Målingen:** `tests/koer.mjs` er **2.139 linjer** med **8 spor-blokke** stablet i
bunden. Seks af de ni spor-flet i dag konfliktede, og **alle seks konfliktede i
denne ene fil**. Konflikten var hver eneste gang den samme: to spor havde lagt
hver sin blok allersidst.

Løsningen var også hver gang den samme — behold begge blokke, fjern de tre
markører, og indsæt den afsluttende tuborg, som `=======` havde spist. **Én af
de seks gange gik det galt**, fordi tuborgen blev glemt, og filen holdt op med
at parse.

**Hvorfor det er nummer ét:** det er 100 % forudsigeligt, 100 % manuelt og har
en kendt fejltilstand. Det bliver værre med hvert spor, ikke bedre.

**Optimeringen er strukturel, ikke proceduel.** Skrivegrænsen ("læg din blok
sidst") løser ikke problemet — den *skaber* det, fordi den sender alle spor til
samme linje. Del filen i stedet:

```
tests/koer.mjs          kører delene, tæller, rapporterer
tests/dele/01-skema.mjs
tests/dele/02-billeder.mjs
tests/dele/…            ét spor = én ny fil = ingen konflikt
```

Så rører to spor aldrig samme fil, og flettet bliver en tilføjelse frem for en
sammenfletning. **Acceptkriterium:** næste to samtidige spor kan flettes uden
konflikt i testfilen.

---

## O2. Et acceptkriterium, der aldrig blev kørt, måler ingenting — 2 af 13 briefs

**Målingen:** to briefs bar et acceptkriterium af formen

```
h.split('h-udvalg')[1].split('udvalg-videre')[0]
```

Skabelonerne skriver hvert sektions-id **to gange** — én gang i `aria-labelledby`
og én gang i `id` — så `split()[1]` giver strengen *mellem* de to forekomster.
Kommandoen printede **0, uanset om arbejdet var rigtigt**. Den ene agent
opdagede det selv og målte med en rettet kommando; jeg gentog fejlen i det næste
brief.

**Optimeringen er én linje, og den er dagens billigste:**

> **Kør dit eget acceptkriterium mod den nuværende main, før du sender briefet.
> Det skal give det "forkerte" svar nu. Gør det ikke det, måler det ikke noget.**

Det er den kontrafaktiske test, arbejdsgangen allerede kræver af *agenternes*
konfidensniveau — vendt mod orkestratørens egne kriterier. At et kriterium er
genkørbart beviser ikke, at det er relevant; det skal kunne **fejle**, før det
kan bevise noget.

---

## O3. Briefets rygrad er skrevet i hånden 13 gange — 4 defekter

**Målingen:** hvert af de 13 briefs gentog den samme rygrad i hånden:
grundmåling først, filejerskab, skrivegrænse, konfidensskalaen, rapportformen
med de to obligatoriske sektioner. **Fire defekter slap igennem:**

| Defekt | Spor | Følge |
|---|---|---|
| Acceptkriterium der altid gav 0 | forside, yderpunkt | Målte intet (O2) |
| Selvmodsigende filejerskab: *"ret `ekstremer()`"* + *"rør ikke `side.mjs`"* — hvor funktionen bor | yderpunkt | Agenten valgte rigtigt, men på trods af briefet |
| Ingen designskill, selvom sporet byggede en ny sektion og hover-tilstande | indgang | Rettet undervejs med en besked |
| Forældet grundmåling: 232 tests mod mains 275 | s1 | Grenet før fire flet |

**Hvorfor `grillmig` ikke fangede dem:** den griller **hensigten** — leverance,
aftager, spildrisiko, filkollisioner, færdigkriterium. Alle fire defekter sad i
**konstruktionen**. Det er ikke en fejl ved grillmig; det er en flade, ingen
skill dækker.

**Optimeringen:** en `brief`-skill, der bærer rygraden og de fire fejl som
tjekliste. Besluttet af JPK 26. aug 2026. `grillmig` bliver stående uændret —
den ene dømmer hensigten, den anden bygger kroppen.

---

## O4. Beslutninger driver fra virkeligheden, og ingen måler det — 3 fund på én dag

**Målingen:** tre beslutninger var holdt op med at passe, uden at nogen havde
opdaget det:

* **L17** krævede søgefelt og anvendelsesfiltre i forsidens første viewport.
  Målt: **ingen af delene fandtes der.** Fire i18n-nøgler stod tilbage med
  **0 kaldesteder**, og CSS-afsnit 1d stylede noget renderet **0 gange**.
* **Å12 og Å14** stod som åbne punkter, selvom begge var lukket dagen før.
* **`billedled--plade`** — en CSS-regel og en kodesti, der fandtes og blev kaldt
  **0 gange**, mens 27 billeder blev beskåret, fordi alle antog at den virkede.

Alle tre er samme fejl: **noget står skrevet, og ingen efterprøver, om det
stadig når koden.** Projektets egen regel siger det allerede — *"`fil:linje`
beviser at kode findes. Det beviser ikke at nogen kalder den."* — men reglen
gælder i dag kun kode. Den skal også gælde beslutninger.

**Optimeringen:** en tilbagevendende måling, ikke en ny regel. For hver lukket
beslutning, der navngiver en fil eller et element på siden: kør en søgning, der
beviser, at den stadig holder. Det er få linjers script, og det er den eneste
måde at opdage en beslutning, der er forladt i stilhed.

---

## O5. Tre gange præsenterede jeg en slutning som en måling

**Det ubehageligste fund, og det er mit eget.** Tre gange i dag skrev jeg noget
som målt, der var udledt:

1. **"Gitteret er takket"** i KRITIK-3 — sluttet ud af strukturelle tal (antal
   nøgletal pr. kort, fodnotelængde) og et skærmbillede. Målt i browseren
   bagefter: springet inden for en række er **0 px**. Gitteret strækker kortene.
   Fundet var forkert i sin forklaring, og rettelsen står nu i dokumentet.
2. **`grep dist/` skal give 0** som acceptkriterium — genkørt gav den 3, men
   alle tre var udviklerkommentarer i CSS/JS, usynlige på siden. Kriteriet var
   for bredt; agentens arbejde var korrekt.
3. **"`frontend-design` er ikke installeret"** — konkluderet ud af
   `ls ~/.claude/skills/`, som kun viser **lokale** skills. Pluginnet havde
   været installeret siden 13. aug.

Fællestrækket: **jeg kiggede ét sted og konkluderede om helheden.** Alle tre
blev fanget, men to af dem først efter at have kostet arbejde.

**Optimeringen er en vane, ikke en regel:** før et fund skrives, spørg *"kørte
jeg noget, eller ræsonnerede jeg?"* — og skriv **skønnet** ved siden af tallet,
når svaret er det sidste. Reglen står allerede i CLAUDE.md; det var mig, der
brød den, i mit eget kritikdokument.

---

## Hvad der virkede, og som ikke må optimeres væk

Tre ting bar dagen, og de er værd at navngive, så en fremtidig oprydning ikke
fjerner dem:

**Grilningen før afsendelse betalte sig med det samme.** Da Å18's tolv fund
skulle sendes ud, viste grilningen, at **to af dem havde ændret sig under os**
på under fire timer: K2 var løst af billedsporet (fire tomme kort → nul), og K1
var blevet **værre** af samme spor (16 af 54 beskårne billeder → 27 af 75). Et
spor sendt på K2 ville have arbejdet på et problem, der ikke fandtes.
**Ny regel, der kom ud af det:** et kritikdokument er et øjebliksbillede af et
katalog i bevægelse — genmål hvert fund lige før sporet sendes, ikke da
dokumentet blev skrevet.

**Konfidensskalaen med den kontrafaktiske linje virker.** Agenterne rapporterede
huller, de kunne have skjult: at kildeformen ikke nåede sammenligningssiden, at
Playwright ikke var tilgængeligt, at en print-regel ikke kunne efterprøves. Det
er den ærlighed, der gør reviewet muligt.

**"Ret assertions, slet dem ikke"** blev fulgt korrekt to gange under pres —
`spor/kort` vendte en test om, så den prøvede robotsiden i stedet for kortet, og
`spor/s1` vendte to S1-tests til at bevise, at bygget nu **gennemfører**. Ingen
af dem slettede noget.

---

## Rangering, hvis der kun er tid til to

**O2** (kør acceptkriteriet, før det sendes) er dagens billigste rettelse: én
linje i briefets rygrad, og den ville have fanget to af de fire defekter.

**O1** (del testfilen) er den dyreste at lade være med: den koster en manuel
konfliktløsning pr. flet og bliver værre med hvert spor.

De to øvrige — `brief`-skillen og beslutningsmålingen — er reelle, men de kan
vente til efter retningsrunden.

## Det jeg ikke kunne måle

Om briefene faktisk blev **bedre** af rygraden, eller om de fire defekter blot
var min egen træthed hen over 13 afsendelser. Det kræver at sammenligne to
måder at skrive briefs på over flere dage, og det er præcis, hvad `skill-creator`s
eval-løkke er til. Det er ikke gjort her.
