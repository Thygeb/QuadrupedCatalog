---
name: grillmig
description: Gril et agentbrief, før det sendes, eller en åben beslutning, før den låses. Brug den hver gang nogen siger "gril lige den her", "er planen god nok", "hold den op mod virkeligheden", "spørg mig ud", "find hullerne" eller "hvad har jeg overset" — og altid før en agent sættes i gang, og før et punkt flyttes fra åbent til lukket i STATUS.md. Den tvinger fem spørgsmål frem om leverance, aftager, spildrisiko, filkollisioner og færdigkriterium, og fire om alternativernes pris, den afgørende måling, tidligere beslutninger imod og den dyreste fejl. Den er ikke en designkritik, og den siger stop, når opgaven ikke er værd at lave.
user-invokable: true
argument-hint: "brief|beslutning + hvad der skal grilles"
---

# Grillmig

To job, og kun to:

1. **Gril et agentbrief, før det sendes.**
2. **Gril en åben beslutning, før den låses.**

Alt andet hører til andre skills. Se afgrænsningen nederst, før du bruger den på noget tredje.

---

## Holdningen: enighed er fejltilstanden

En grilning, der lister tre småting og kalder planen "solid", er værdiløs. Den koster et kald
og efterlader et falsk kvitteringsstempel: næste læser tror, planen har været igennem noget.

Tre regler for tonen, og de er ikke stilistiske:

- **Den hårdeste indvending står først.** Ikke sidst, ikke i midten. Grilninger læses ovenfra,
  og den, der gemmer det dyre fund under punkt 7, har skrevet det til arkivet, ikke til
  beslutningen.
- **Slut aldrig med en ros.** Ingen "men grundlaget er stærkt", ingen "godt tænkt". Ros til
  sidst er det, læseren husker, og den ophæver listen ovenfor. Skal noget bevares, står det
  under en overskrift der hedder *Behold dette*, midt i dokumentet, med en begrundelse.
- **Enighed skal betales.** Kan du ikke finde en blokerende indvending, så skriv **hvilken
  måling du foretog** for at kunne sige det. "Ser fornuftigt ud" er ikke et svar; det er en
  fornemmelse med slips på.

---

## Fejl, der allerede er betalt

Hver af dem ville være fanget af ét af spørgsmålene nedenfor. Tallene er målt i dette projekts
egne dokumenter, ikke skønnet.

**1. Spærringen, der ikke spærrede for noget.** `STATUS.md` førte D7 — er nævneren 29 eller
31 felter? — som *"Blokerer sidens eneste rangering"* og lod den vente på JPK.
`KRITIK-1-plan.md` K9 kørte `validate.mjs`' egen `taethed()` over alle 46 robotter og
sammenlignede rækkefølgerne: **29 vs 31 ens, 29 vs 33 ens. D7 flytter 0 pladser.** Til
gengæld flytter D4, tællereglen på linjen ovenfor, **16 af 46**.
→ **B2 fanger den:** en konstant nævner kan matematisk ikke ændre en rangering. Ét
sorteringstjek lukkede et spørgsmål, der havde ventet på en person i to dage.
**Siden lukket som L30: nævneren er 33,** og den er ikke længere et håndskrevet tal — den
udledes af skemaets egne nøgler. Det viste sig at være den vigtigste halvdel af historien:
31 var ikke det forsigtige mellemtal, det var **talt forkert** — se fejl 6.

**6. Tælleren og nævneren kom fra hver sin liste, og ingen af dem vidste det.** `FUND-naevner.md`
(skrevet, da L30 skulle lukkes) fandt, at koden hele tiden havde talt **tælleren** op over
skemaets 33 nøgler (`FELTNAVNE`), mens **nævneren** var en håndskrevet konstant, `[29, 31]`.
Brøkens to halvdele kom fra to forskellige lister. 31-tallet i den offentliggjorte prosaliste
viste sig at afvige fra skemaet på tre punkter, der næsten gik lige op: **+2** for `mål stående`
(talt som ét punkt, skrevet som tre felter: `laengde`, `bredde`, `hoejde`), **+1** for
`driftstemperatur`, og **−1** for et felt, prosalisten nævner, men skemaet **aldrig har haft**:
`mål sammenfoldet`. 31 + 2 + 1 − 1 = 33 — og det manglende felt betød, at hver eneste robot blev
trukket ned med et point for noget, ingen producent nogensinde kunne udfylde.
→ **A1 (hvad er leverancen konkret) og B2 (hvilken måling ville afgøre det) fanger den sammen:**
et brief, der beder om "find hvilke robotter der får 29, og hvilke der får 31", antager en
præmis — at nogen robot udelukkende får det ene tal — som var forkert, fordi hver robot blev
opgjort på begge nævnere samtidig. Grilningens første spørgsmål burde have været: *hvordan ved
vi, at præmissen holder?*

**7. 61 nøgler var i virkeligheden 71, og bygget talte de forkerte.** Samme dag flyttede et andet
spor de sidste UI-strenge ind i sprogfilerne. Optællingen, der først blev brugt, talte de nøgler,
**en skabelon rent faktisk slår op** — og landede på et tal, der var ti for lavt. Seks af de
oversete nøgler stod i **levende kode**, ikke i arkiv, og ville have vist bogstaveligt `«noegle»`
på den færdige side, hvis de var sendt i produktion uden at blive fanget.
→ **A5 fanger den:** et færdigkriterium som "alle UI-nøgler er flyttet" er ikke et tal, før nogen
har defineret, hvad der tælles med. Et script, der tæller nøgler i en fil, og et script, der
tæller nøgler, en skabelon rent faktisk bruger, giver to forskellige svar — og kun det sidste er
det, en bruger ser.

**2. Feltet, der ikke målte det, det hed.** Manifestets `hentet_utc` blev læst som
hentetidspunkt. Målt: alle **58** filer i `raa-vest-2026-08-19/` har mtime **og** birthtime
inden for **0,475 sekund** af hinanden (2026-08-19T07:44:19Z) — 58 sider kan ikke hentes på
et halvt sekund. Tolv af siderne bærer serverens eget stempel i Shopifys `__st.reqid`:
**07:20:43Z til 07:27:31Z**, sluttende **17 minutter før** mtime. Kolonnen er en øvre grænse,
ikke en måling.
→ **A5 fanger den:** et feltnavn er en påstand. Havde briefet krævet *"skriv, hvor
hentetidspunktet kommer fra"*, var en mtime aldrig blevet afleveret som en måling.

**3. De tre hjembyer, ingen søgte på.** Rainbow Robotics stod som *"Daejeon"* (producentens
egen sidefod siger Sejong-si), Ghost Robotics som *"Philadelphia"*, Boston Dynamics som
*"Waltham, Massachusetts"*. Målt: `grep -o -i -c philadelphia` på `ghost_home.html`,
`ghost_v60.html` og `v60.txt` → **0**. `waltham`, `massachusetts` og `hyundai` på alle fire
Boston Dynamics-råfiler → **0, 0, 0**. Den tredje kom først frem, da nogen efterprøvede
**alle syv hjembyer under ét**; `FUND-vest-2.md` skriver det selv: *"Derfor er det tredje
tilfælde ikke fundet før: ingen søgte på det."*
→ **A1 fanger den:** fire kildekort i træk havde **tal** i leverancen, ikke producenthoveder.
Det, der ikke står i leverancen, bliver ikke set på — af nogen.

**4. Tallet med den forkerte nævner.** Et brief bar vægtfordelingen `11/12/12/8`. Målt i
bygget over alle **46** poster: **12/12/13/9** (commit `fb0ddba`). Briefets tal var talt over
**43** robotter, før Laikago, CyberDog 1 og RAIBO2 kom til i `35bf28a` — tre robotter, briefet
ikke vidste fandtes. `STATUS.md` L27 bærer stadig det gamle tal.
→ **A5 fanger den:** et tal i et brief har en nævner og en dato. Spørg om begge, ellers arver
agenten fejlen tavst og afleverer den som sin egen måling.

**5. De 47 påstande, ingen skulle bruge.** `KILDEKORT-C` gennemgik Petoi og MangDang:
**47 påstande i 18 råfiler, 3 fejl fundet.** Alle tre står i `FUND-vest-2.md`s rettelsestabel
som post 13, 14 og 15, mærket **"uden for scope"** — L11 holder legetøj, hobbyrobotter og
undervisningskit ude af kataloget, og Petoi og MangDang står navngivet på listen. **3 af de 17
rettelser** gælder maskiner, der aldrig får en side.
→ **A2 fanger den:** hvem bruger resultatet, og til hvad? Spørgsmålet tager tredive sekunder
og skal stilles, før de 18 filer læses.

**8. JPK's egne fem agenter, sendt uden at grille sine egne briefs.** Den friskeste af dem alle,
fordi den skete i præcis den runde, denne skill findes for at forhindre. To fejl kom ud af det
samme udsend: **præmissen i nævner-briefet var forkert** — briefet bad om "find hvilke robotter
der får 29, og hvilke der får 31", men målingen viste, at ingen robot udelukkende fik det ene;
hver eneste blev opgjort på begge nævnere samtidig (samme rod som fejl 6). Og **filerne var
mis-scopet**: en tabel til CEO'en skrev, at nævner-sporet rørte `tools/skema.mjs` og `STATUS.md`
— det rørte også `tools/build.mjs` og `tools/validate.mjs`, som billedsporet ejer.
→ **A3 og B2 fanger den første, A4 fanger den anden** — og A4 stod bogstaveligt på JPK's egen
liste over de fem spørgsmål. At kende spørgsmålet er ikke det samme som at stille det på sit
eget brief, før man trykker send. Det er hele grunden til, at denne skill skal bruges *før*
afsendelse, ikke huskes undervejs.

Læg mærke til, hvad de otte har til fælles: **ingen af dem er en dårlig udførelse.** Arbejdet
var i hvert enkelt tilfælde omhyggeligt, og agenterne afleverede det, de blev bedt om.
Fejlen sad i opgaven, ikke i hånden — og derfor kunne den kun fanges før start.

---

## Før du griller

**Åbn materialet.** Nævner briefet en fil, en gren, et L-nummer eller et tal, så slå det op —
grilningens værdi ligger i at holde påstanden op mod noget, og en grilning skrevet alene ud af
teksten foran dig er en omskrivning af den. Fejl 1, 4 og 5 ovenfor blev alle afgjort af et
opslag, der tog under et minut.

**Læs `STATUS.md` helt igennem, ikke halvt.** Både **Lukket**-tabellen og
**"Kom ikke igen med disse"** — og gør det, uanset om du griller et brief eller en beslutning.
Filen modsiger sig selv mere end ét sted: D4 står som **åbent** punkt på linje 44 og som
**lukket** beslutning L20 på linje 131, og D7 gør nøjagtig det samme (linje 45 mod L19 på
linje 130). Et brief, der kun har læst den åbne halvdel, beder om en beslutning, der allerede
er truffet — og det er ikke en teoretisk risiko, det er fejl 5 ovenfor.

**Løs ikke opgaven.** Du skal ikke skrive briefet om, ikke træffe beslutningen og ikke lave
arbejdet. Du skal aflevere de indvendinger, der skal svares på først. Den, der ejer opgaven,
skal kunne se sit eget brief igen, kun med hullerne markeret.

---

## Job 1 — gril et agentbrief, før det sendes

Fem spørgsmål. Et brief, der ikke kan svare på alle fem, er ikke klar til at blive sendt.
Skriv spørgsmålet, briefets faktiske svar, og din dom over svaret.

**A1 — Hvad er leverancen konkret?**
Et filnavn, et format, et antal. *"Undersøg X"* er ikke en leverance; *"en tabel i
`FUND-x.md` med én række pr. producent og en kildekolonne"* er. Kan du ikke skrive, hvad der
ligger på disken bagefter, kan agenten heller ikke.

**A2 — Hvem bruger resultatet, og til hvad?**
Navngiv aftageren og den beslutning, resultatet skal fodre. Er svaret *"godt at have"* eller
*"så vi ved det"*, er det ikke et svar — det er en indrømmelse. Det var det spørgsmål, der
manglede før fejl 5 ovenfor.

**A3 — Hvad ville gøre arbejdet spildt?**
Tving mindst én konkret hændelse frem: en beslutning, der kan falde imod det; et scope, det
kan lande uden for; en fil, en anden agent kan overskrive. Findes hændelsen, så spørg hvor
langt agenten er, når den indtræffer. Er svaret *"hele vejen"*, skal briefet enten vente eller
have et tidligt tjekpunkt.

**A4 — Hvilke filer rører den, og kolliderer de med et andet spor?**
Absolutte stier, ikke mapper. To agenter i samme fil er en flettekonflikt, der først viser sig,
når begge er færdige — altså efter at arbejdet er gjort. Se `parallelt` for worktree-vejen;
denne skill kontrollerer kun, at spørgsmålet er stillet og besvaret.

**A5 — Hvordan ved vi, at den er færdig — hvilket tal skal den kunne skrive?**
Et brief uden færdigkriterium får en rapport uden tælling tilbage. Kræv formen:
*"efterprøvede N felter, fandt M fejl"*, *"N af 46"*, *"N sider bygget"*. Bærer briefet selv
et tal, så kræv dets **nævner og dato** — det er hele fejl 4.

---

## Job 2 — gril en åben beslutning, før den låses

Fire spørgsmål. En beslutning, der ikke kan svare på dem, må ikke flyttes til
`STATUS.md`s **Lukket**-tabel.

**B1 — Hvad er alternativerne, og hvad koster hvert af dem?**
Mindst to, og prisen skal være konkret: arbejdstimer, felter der falder væk, sider der skal
bygges om, læsere der mister noget. Er der kun ét alternativ på bordet, er beslutningen ikke
truffet — den er kun skrevet ned. Er ét af alternativerne uprissat, er sammenligningen tom, og
det er præcis den grilning, der skal skrives først.

**B2 — Hvilken måling ville afgøre det?**
Ikke *"hvad synes vi"*, men *"hvad kan vi køre"*. Kan du skrive kommandoen eller scriptet, så
skriv det og foreslå, at det køres, før beslutningen låses. Kan spørgsmålet **ikke** afgøres
med en måling, så skriv det — så er det en smagsbeslutning, og den skal træffes af den, der
ejer smagen, ikke af den, der skriver notatet. Fejl 1 ovenfor stod og ventede på en person i
to dage; den ventede i virkeligheden på ét sorteringstjek.

**B3 — Er der en tidligere beslutning imod, og hvad har ændret sig siden?**
Læs `STATUS.md`s **Lukket**-tabel og **"Kom ikke igen med disse"** før du svarer. Findes der en
post imod, så citér den med nummer (L11, L15, L27 …) og skriv, hvad der er ændret siden. Er
svaret *"ingenting"*, er beslutningen allerede truffet, og grilningen er færdig. Den dyreste
fejl er ikke at bygge noget forkert; det er at bygge noget, der allerede er sagt nej til.

**B4 — Hvad er det dyreste, der sker, hvis vi vælger forkert?**
Skriv omkostningen ved at vende om senere, ikke sandsynligheden for at tage fejl. En beslutning,
der kan vendes for en commit, må træffes hurtigt og løst. En, der koster en ombygning af
generatoren eller en publicering, der ikke kan trækkes tilbage, skal have B2's måling først.

---

## Sådan skrives grilningen

Fast form, så den kan læses i den rækkefølge, den skal handles i:

```
## Dom
<én til tre linjer. Send ikke / Send efter rettelse / Send  —  Lås ikke / Lås efter måling / Lås>

## G1 — [Blocker] <den hårdeste indvending, i overskriften, ikke i brødteksten>
**Hvad briefet siger:** <citat eller linjehenvisning>
**Hvorfor det ikke holder:** <bevis: en måling, en tælling, en citeret beslutning>
**Hvad der lukker den:** <acceptkriterium — hvad præcis skal stå i briefet, før G1 falder bort>

## G2 — [Major] ...
## G3 — [Minor] ...

## Spørgsmålene, svar for svar
<A1-A5 for et brief, B1-B4 for en beslutning. Skriv materialets faktiske svar
 ved hvert enkelt og din dom over det. Ubesvarede markeres tydeligt som ubesvarede>

## Behold dette
<kun hvis der er noget, en rettelse kunne komme til at smide væk. Med begrundelse>

## Selv-tjek
Grillet <N> spørgsmål, <M> ubesvarede. <K> indvendinger, heraf <J> blokerende.
```

`[Blocker]` betyder: sendes briefet sådan, er arbejdet spildt eller forkert. `[Major]`: det
koster en runde. `[Minor]`: nævn det, men lad være med at fylde listen op med dem — tre
minorpunkter er den mest almindelige måde at udgive en tom grilning på.

**Hver indvending skal have et acceptkriterium.** Uden *"hvad der lukker den"* er en indvending
en stemning, og en stemning kan ikke afvises af den, der er uenig. Det er samme krav, projektet
stiller til en redaktionel score: ingen dom uden offentliggjort metode.

---

## Stop er et gyldigt svar

Viser grilningen, at opgaven ikke er værd at lave, så **skriv det rent ud**. Skriv ikke en
mindre udgave i stedet.

Den mindre udgave er den behagelige udvej, og den er dyrere end et nej: den bruger halvt så
mange kald på noget, der stadig ikke har en aftager, og den efterlader et halvfærdigt dokument,
som næste læser skal finde ud af hvad er. `KILDEKORT-C` er ikke for lang — den skulle ikke have
været skrevet, og det kunne A2 have afgjort på tredive sekunder.

Formen på et stop:

> **Dom: send ikke.** Leverancen har ingen aftager. B-siden af A2 er ubesvaret, og de
> nærmeste kandidater — <navngiv dem> — er lukket af <L-nummer>. Genoptag, hvis <konkret
> betingelse> ændrer sig.

Et stop skal have en genoptagelsesbetingelse. Ellers er det ikke en beslutning, det er en
udsættelse.

---

## Selv-tjek (obligatorisk)

Når grilningen er skrevet:

1. **Tæl:** *"Grillet N spørgsmål, M ubesvarede. K indvendinger, heraf J blokerende."*
   Nul blokerende uden en tælling er ikke en grilning — det er en godkendelse i forklædning.
2. **Efterprøv dine egne tal.** Hver måling, du citerer, skal du selv have kørt eller have
   linjehenvisning til. Et tal, du har udledt i hovedet, er en hypotese; skriv da *skønnet*
   ved siden af. Fejl 4 ovenfor var netop et udledt tal, der rejste videre som en måling.
3. **Læs den første overskrift alene.** Er den hårdeste indvending virkelig G1? Hvis den, der
   ville koste mest at overse, står som G3, så byt om.
4. **Søg efter ros i sidste afsnit.** Findes den, så slet den eller flyt den til
   *Behold dette*.

## Selv-review (obligatorisk)

Skriv, hvad du er usikker på — og vær særlig ærlig om det ubehagelige spørgsmål: **er der en
indvending, du lod være med at skrive, fordi den ville vælte hele briefet?** Den er den
vigtigste på listen.

Skriv også, hvilke af spørgsmålene du ikke kunne svare på, fordi materialet ikke lå frit.
Et ubesvaret spørgsmål er et fund, ikke en mangel ved grilningen.

---

## Hvad denne skill ikke er

Den er smal med vilje. Projektet har fire kritikværktøjer i forvejen, og den, der bruger det
forkerte, får en anmeldelse i stedet for en beslutning:

| Skal du … | Så brug |
|---|---|
| vurdere en **bygget** side: hierarki, tilgængelighed, mobil, AI-prosa | `ui-ux-critique` |
| vurdere designeffektivitet på noget, der findes visuelt | `critique` |
| forme, hærde eller tilpasse en flade | `impeccable` |
| gennemgå kode for fejl og forenkling | `code-review` / `simplify` |
| efterprøve en robotpost mod kilden | `robotdata` |
| fordele arbejde på flere agenter i worktrees | `parallelt` |
| **afgøre om et brief overhovedet skal sendes, eller en beslutning kan låses** | **`grillmig`** |

De fire første dømmer et **resultat**. Denne dømmer en **hensigt**, og den skal bruges, mens
det stadig er gratis at ombestemme sig.

## Rapportér ærligt

Hvad nåede du ikke, hvad sprang du over, hvad er du usikker på. En grilning, der kun indeholder
det, der var let at finde, kan ikke bruges til at beslutte noget.
