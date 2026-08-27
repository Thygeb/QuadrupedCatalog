---
name: fejljagt
description: Systematisk rodårsagsjagt for quadruped-kataloget. Brug den, HVER gang noget opfører sig uventet — en rød test, et måletal der ikke passer, et byg der fejler, en side der ser forkert ud, et acceptkriterium der giver 0 eller det samme tal uanset input. Også når fejlen "nok bare er en lille ting": det var alle ugens tre målefejl også. Skillen forhindrer, at symptomet rettes i stedet for årsagen, og at et måleapparat tages for givet.
---

# Fejljagt — find årsagen, ikke symptomet

Projektets dyreste fejl i uge 35 var ikke i koden — de var i **målingerne af
koden.** Tre gange pegede et tal på det forkerte, og alle tre havde samme rod:
måleapparatet blev taget for givet.

| Betalt fejl | Mekanismen |
|---|---|
| `<li>`-tællingen gav 71+6 "intet" | Regexen matchede `<li>` men ikke `<li class="hul">`. **Tallet var reproducerbart og forkert** |
| `diff` godkendte to navnelister som identiske | `grep -P` fejlede ("unibyte locales"), begge filer blev tomme — og `diff` på to tomme filer melder "ingen forskel" |
| `maal.mjs` målte 0 beskårne billeder, filmålingen 16 | Værktøjet målte mod `<img>`'s egen kasse, ikke mod rammen der klipper |

Læg mærke til fællestrækket: **ingen af dem var en kodefejl i leverancen.**
Havde nogen "rettet" det, tallet pegede på, var den rigtige fejl blevet stående.

## De fem skridt — i rækkefølge, ingen springes over

### 1. Efterprøv måleapparatet, FØR du tror på tallet

Et tal, der skal bruges til at finde en fejl, skal selv kunne fejle:

- **Kør kommandoen mod et kendt svar.** Ny måling → kendt facit først.
  (`maal.mjs` blev valideret mod filmålingens 16 — og afveg.)
- **Tving den til at fejle.** Bryd noget med vilje og se tallet flytte sig.
  Flytter det sig ikke, måler kommandoen ingenting. Det er O2-reglen fra
  ARBEJDSGANG-2, og den gælder også under fejljagt.
- **Tjek de tomme mellemled.** Skriv linjeantal ud for hver mellemfil, før du
  sammenligner dem. En tom fil i en pipeline er en falsk godkendelse på vej.

### 2. Reproducér minimalt

Find det mindste input, der stadig viser fejlen. Én robot i stedet for 77, én
side i stedet for 213. Kan fejlen ikke reproduceres, er det første fund: så er
den tilstandsafhængig (server-cache, stale `dist/`, en anden agents proces på
samme port — alle tre er sket her).

### 3. Spor baglæns fra symptomet til mekanismen

Gå fra det synlige mod årsagen, ét led ad gangen: siden → skabelonen →
normaliseringen → datafilen. Ved hvert led: **hvem SÆTTER den værdi, ikke kun
hvor læses den.** Det er CLAUDE.md's egen regel — `fil:linje` beviser at kode
findes, ikke at nogen kalder den — brugt som sporingsmetode.

### 4. Skriv mekanismesætningen, før du retter

Én sætning på formen: *"X viser Y, fordi Z gør W, før/efter/i stedet for V."*

Kan du ikke skrive den, kender du ikke årsagen — så er en rettelse et gæt, og
gæt-rettelser er, hvordan `billedled--plade` kunne ligge død i koden, mens alle
antog den virkede. Sætningen skal med i commit-beskeden.

### 5. Bevis at DIN rettelse var årsagen

To målinger, begge obligatoriske:

1. **Det oprindelige fejltilfælde**, genkørt — grønt.
2. **Rettelsen midlertidigt fortrudt** (`git stash` / revert af den ene linje)
   — fejlen skal komme IGEN. Kommer den ikke igen, var det noget andet, der
   fiksede det (en cache, en genstart, en anden agents flet), og din rettelse
   er død kode med et godt ry.

Skriv begge udfald. Det er konfidensskalaens kontrafaktiske linje, anvendt på
en fejlrettelse.

## Tre fælder, der ligner fejl men er miljø

Tjek dem FØR skridt 2 — de har kostet runder her:

- **Stale server.** `curl` kan svare 200 fra en ANDEN agents server på samme
  port. Verificér altid, at det servede indhold matcher disken (grep efter en
  streng, kun din udgave har), før et browsertal bruges.
- **Manglende gitignorerede filer i en worktree.** 54 valideringsfejl, der
  ligner databrud, kan være et tomt `assets/fotos/fabrikant/`. Grundmålingen
  afslører det: var fejlene der før dit arbejde, er de ikke dine.
- **Skallen har ødelagt indholdet.** Backticks/`$` i en `node -e`-streng
  udføres af bash, `sed -i` uden match gør intet med exit 0, PowerShell-BOM
  knækker tankestreger. Mistænk skrivevejen, før du mistænker logikken.

## Rapportform

Fundet skrives med mekanismesætningen, de to beviser fra skridt 5, og hvad der
blev efterprøvet undervejs — tal, ikke "ser rigtigt ud". Er fejljagten en del
af et spor, hører den i sporets rapport under "Nye fælder og opdagelser".
