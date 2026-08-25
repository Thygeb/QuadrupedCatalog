# Byggeplan — oversigt over firbenede robotter

Skrevet 19. august 2026 efter interview med JPK. Forbillede: humanoid.guide, som chefen
har peget på. **Ingen kode skrevet endnu.** Denne fil er beslutningsgrundlaget; den
visuelle retning er ikke afgjort og er sidste åbne punkt før byggestart.

Skill brugt til planlægningen: `impeccable` → `init` (produktsandhed, gav
[PRODUCT.md](PRODUCT.md)) → `shape` (IA og adfærd før kode). Gik forbi: `ui-ux-critique`
og `critique` (vurderer noget der findes), `frontend-design` og `ui-ux-pro-max`
(overlapper impeccable), `feature-dev` (subagenter, ikke bedt om), `new-project`
(scaffolding — først når vi koder).

---

## 1. Hvad feltet er

Omkring **42 producenter** af firbenede robotter globalt; den grundigste eksisterende
oversigt sammenligner **28+ modeller**. Til sammenligning lister humanoid.guide ~235
humanoider.

Det er planens vigtigste enkelttal. **Feltet kan gøres færdigt.** Et katalog på 50-70
komplette poster er et opslagsværk; 235 halve poster er en liste. Hele strategien
nedenfor følger af, at vi kan nå bunden af feltet, og at de ikke kan.

## 2. Hvad der gør den bedre end forbilledet

humanoid.guide filtrerer på *Max speed, Strength, Nationality, Sales price, Height,
Weight* og rangerer på en **Skill score 1-5** uden synlig metode. Det er
forbrugerfiltre og en mening forklædt som et tal.

Vores tre kanter:

**1. Kilde og dato på hvert tal.** Hver post bærer `hentet: ÅÅÅÅ-MM-DD`. Poster over 12
måneder markeres synligt som forældede. Det koster næsten intet og er det eneste, der
gør et katalog citerbart.

**2. EU-kolonnen — den ingen andre har.** CE-mærkning oplyst ja/nej/ukendt. Hvem bliver
importør ved direkte køb fra Asien (svar: køberen, med fuldt ansvar under
maskinforordningen). Findes dokumentationen på et EU-sprog. Er der et servicepunkt og
reservedele i Europa. Leveringstid. **Det er det spørgsmål, der afgør om en dansk fabrik
overhovedet må sætte maskinen i drift**, og ingen eksisterende oversigt svarer på det.
Det er også præcis den viden, KeyResearch sidder på.

**3. Specifikationstæthed som eneste rangering.** Hvor mange af vores felter oplyser
producenten faktisk? Et tal mellem 0 og 100 %, regnet mekanisk. Det måler
producenternes åbenhed, ikke vores mening. Det kan ikke spilles uden at udgive flere
data. Og det erstatter den 1-5-score, vi ikke må lave — hele begrundelsen står på
salgssidens afvist-liste: *"ingen metode, ingen acceptkriterier — en konklusion skrevet
om til tal."*

## 3. Datamodellen

Én YAML-fil pr. robot. Felterne i seks grupper:

**Identitet** — slug, navn, producent, producentland, første udgivelse (år/md),
status (i produktion / annonceret / udgået), forgænger/generation.

**Fysik** — egenvægt kg · mål stående og foldet L×B×H mm · frihedsgrader (DoF) ·
maks. nyttelast kg · maks. hastighed m/s · maks. hældning ° · maks. trinhøjde mm ·
IP-klasse · driftstemperatur °C fra/til.

**Energi** — batteri Wh · opgivet driftstid t (og under hvilken belastning, hvis oplyst) ·
hot-swap ja/nej · ladetid · dockingstation.

**Sensorik og autonomi** — LiDAR-model/type · dybdekameraer · autonominiveau
(teleop / waypoint / autonom rundering) · SLAM · forhindringsundvigelse · onboard compute ·
ROS 2 · SDK-sprog · åbent eller lukket API.

**Nyttelast og udvidelser** — monteringsinterface · strøm ud V/A · dataporte ·
dokumenterede armoptioner · tredjepartsnyttelast.

**Kommercielt og EU** — vejledende pris med valuta, dato og kilde · tilgængelig i EU ·
CE oplyst · importøransvar ved direkte køb · dokumentation på EU-sprog · servicepunkt i
EU · reservedelsforsyning · leveringstid.

Hvert talfelt bærer `værdi`, `enhed`, `kilde` (URL), `hentet` (dato). **Mangler enhed
eller kilde, fejler bygget.** Det er den mekaniske håndhævelse af "opfind aldrig tal" —
reglen står ikke bare i en CLAUDE.md, den kan ikke overtrædes.

Tre tilstande skal kunne skelnes overalt, i data og i UI: **ikke oplyst**, **nej**
og **0**. De fleste katalogsider blander dem, og det er der, de lyver.

## 4. Beregnede felter — vores tilføjelse

Regnet af tal med kilde, med formlen synlig ved siden af resultatet:

| Felt | Formel | Hvad det afslører |
|---|---|---|
| Nyttelastforhold | nyttelast ÷ egenvægt | Om robotten bærer noget eller bærer sig selv |
| Wh pr. driftstime | batteri ÷ opgivet driftstid | Om driftstiden er målt tom eller lastet |
| Pris pr. kg nyttelast | pris ÷ nyttelast | Sammenlignelig på tværs af klasser |
| Rækkevidde pr. opladning | hastighed × driftstid | Med tydeligt forbehold — teoretisk maksimum |
| Specifikationstæthed | udfyldte felter ÷ felter i alt | Producentens åbenhed |

## 5. Sidestruktur

```
/da/                                 forside: hvad er det, og kataloget straks synligt
/da/robotter/                        katalog med filtre, sortering, søgning
/da/robotter/<producent>-<model>/    detaljeside — den delbare URL
/da/sammenlign/?a=…&b=…              to-tre modeller side om side
/da/producenter/                     producentoversigt
/da/producenter/<navn>/              profil: modeller, land, EU-tilstedeværelse
/da/metode/                          hvordan vi indsamler, hvad vi ikke gør, hvornår
/da/ordbog/                          DoF, IP-klasse, hot-swap, teleop, SLAM
/da/om/                              udgiver, formål, ingen forhandleraftale
/da/ret/                             meld en fejl · tilføj en robot
```

Samme træ under `/en/`. `hreflang` imellem.

To sider bærer mere end deres størrelse antyder:

- **`/metode/`** er hele troværdigheden. Den skal sige hvad vi *ikke* gør: vi tester
  ikke, vi måler ikke, vi rangerer ikke kvalitet, vi tager ikke penge fra producenter.
- **`/ordbog/`** gør siden forståelig, uden at kræve fagsprog i forvejen — ikke kun for
  ingeniører. For den tekniske indkøber gælder det samme: en, der kan forstå
  specifikationerne, er den der booker mødet.

**Forsiden må ikke være et marketinglag foran kataloget.** Den nysgerrige læser ankommer
ofte uden et modelnavn i hovedet; den tekniske indkøber ankommer stadig ofte fra en
søgning på en konkret model eller et konkret krav. Filtrene skal være synlige i første
viewport.

## 6. Filtre

Driftsfiltre, ikke forbrugerfiltre:

Nyttelast ≥ X kg · driftstid ≥ X t · IP-klasse · nedre driftstemperatur · armoption
findes · ROS 2 · tilgængelig i EU · CE oplyst · prisinterval **med "pris ikke
offentliggjort" som eksplicit, valgbar værdi** · status · producentland.

Sortering: nyttelast · driftstid · pris · specifikationstæthed · udgivelsesdato.

Filtre skal kunne betjenes fra tastatur, og hver filtertilstand skal have sin egen URL,
så en filtreret liste kan sendes videre.

## 7. Sprogarkitektur

**Byg til mange, udgiv med to.** En robotpost er ~80 % tal — kg, mm, Wh, IP — og de
oversættes aldrig.

- Sprogneutrale tal findes **én gang** i robottens YAML-fil.
- Oversat tekst (feltnavne, beskrivelser, ordbog, UI-strenge) i **én fil pr. sprog**.
- URL pr. sprog, `hreflang` imellem.
- Enheder: metrisk primært, imperial som klientside-omregning af samme tal — ikke en
  oversættelse, ikke en ekstra datapost.

At tilføje kinesisk senere = ét nyt sprogfilsæt plus en subsettet CJK-font. Ingen
ombygning. **`data-en`-attributløsningen fra salgsprojektet må ikke genbruges** — den er
en kontakt med to stillinger og kan ikke få en tredje.

## 8. Teknisk arkitektur

```
data/robots/*.yaml            én fil pr. robot — én robot = én commit, git-diffbar
data/manufacturers/*.yaml
data/i18n/{da,en}.json        UI-strenge og feltnavne
tools/build.mjs               nul afhængigheder → dist/ med statisk HTML pr. sprog
tools/validate.mjs            skemavalidering: enhed + kilde påkrævet, ellers exit 1
tools/*.mjs                   målescripts, arvet fra salgsprojektet
```

- **Klientside-filtrering over et lille JSON-indeks** — kun de felter der filtreres på,
  anslået ~15 KB for 60 robotter, ikke hele datasættet.
- **Virker uden JavaScript:** kataloget renderes statisk med alle robotter; JS tilføjer
  filtrering. Samme princip som salgssiden.
- Ingen tredjepartskald, ingen cookies, ingen tracking.
- Genbrug fra salgsprojektet: de ni målescripts, fontstrategien (lokale variable woff2),
  `<picture>`-mønstret.

## 9. Billedproblemet — projektets hårdeste

60 robotter vil have 60 billeder. Fabrikanternes pressefotos kan vi ikke bruge: både
rettighederne og — vigtigere — fordi det at udgive dem er det stærkeste mulige signal
om et forhandlerforhold, der ikke findes.

Fire veje, ærligt vurderet:

1. **Måltro silhuetter, vi selv tegner** ud fra de oplyste mål, alle i samme målestok og
   samme streg. Kan ikke krænke noget, ser bevidst ud, og er **bedre end fotos til
   sammenligning**, fordi alle robotter for første gang står i samme skala. Anbefales —
   det kan blive sidens visuelle signatur frem for dens kompromis.
2. Skriftlig tilladelse fra producenterne. Realistisk for nogle, tidskrævende, og skaber
   en relation, der kan misforstås.
3. Egne fotos. Kun for de robotter, vi fysisk kan komme til.
4. Ingen billeder. Ærligt, men et opslagsværk uden visuel genkendelse er tungt at bruge.

Ikke en mulighed: AI-genererede robotbilleder.

## 10. Anti-mål

- **Ingen købsknap.** humanoid.guide har "Buy-a-Humanoid™". Vi må ikke og skal ikke —
  det ville gøre os til forhandler i læserens øjne og bryde begrænsning 1.
- Ingen affiliate-links.
- Ingen 1-5-score uden offentliggjort metode.
- Ingen nyhedsbrevs-popup.
- Ingen cookiebanner (fordi ingen cookies).
- Ingen nyhedssektion, vi ikke kan vedligeholde. En død nyhedsstrøm daterer siden.
- Ingen prisforespørgselsformular i en katalogpost.

## 11. Vedligehold

Det spørgsmål, der slår katalogsider ihjel. Svaret er billigt: hver post har en
hentedato, og poster over 12 måneder markeres synligt. Uden det er kataloget forkert
efter et år, og ingen kan se det.

## 12. Rækkefølge

1. **Datamodellen fastlægges, og tre robotter udfyldes i hånden** — Unitree B2, Boston
   Dynamics Spot, ANYbotics ANYmal. De tre poler: billig, etableret, industriel. Det
   afslører hvilke felter der reelt kan udfyldes, **før** vi bygger noget.
2. **Visuel retning** (`impeccable` → `new-work`). Åben — se nedenfor.
3. Generator + én detaljeside, hele vejen igennem.
4. Katalog med filtre.
5. Resten af robotterne.
6. Metode-, om- og ordbogssider.
7. Måling og kritikrunde (`ui-ux-critique`, målescripts, AI-prosa-scanner).

## 13. Åbne beslutninger

| # | Punkt | Venter på |
|---|---|---|
| **Å1** | **Navn og domæne.** Hele brandet hænger på det | CEO'en |
| **Å2** | **Visuel retning.** Ikke påbegyndt. Næste designrunde | Byggestart |
| **Å3** | **Billedvejen.** Anbefaling: silhuetter (afsnit 9) | CEO'en |
| **Å4** | **Besluttet 19. aug, ikke udført endnu.** Se note nedenfor | Agenterne |
| **Å5** | Hvem vedligeholder kataloget efter lancering | KeyResearch |

**Note til Å4 — mappestrukturen er besluttet:**

```
c:\Praktik\websites\salg\          nuværende c:\Praktik\website
c:\Praktik\websites\udstilling\    nuværende c:\Praktik\guide (dette projekt)
```

`websites\` er oprettet. Flytningen er ikke udført, og rækkefølgen er ikke valgfri:

1. **Vent på de tre agenter.** Deres worktrees indeholder absolutte stier til
   `C:\Praktik\guide\.git\worktrees\`. En flytning under kørsel river git-bindingen over,
   og agenterne fejler, når de skal committe.
2. Flet `data/kina`, `data/vest` og `data/felt` til `main`, og fjern de tre worktrees.
3. Flyt `guide` → `websites\udstilling`.
4. Flyt `website` → `websites\salg` **til sidst**. Den flytning fjerner den kørende
   sessions arbejdsmappe under den, så Claude Code skal genstartes i
   `c:\Praktik\websites\` bagefter.
5. Ret stierne i salgsprojektets egen CLAUDE.md, som nævner `c:\Praktik\website` flere
   steder, og kopiér hukommelsen fra projektnøglen `c--Praktik-website` til den nye.
