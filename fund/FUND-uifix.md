# FUND — spor/uifix

Seks UI-rettelser fra JPK (punkt 4 er ikke mit spor). Grundmåling (b5bb73d)
matchede briefets tal 1:1 på alle fire kommandoer og alle syv acceptkriterier.

## Skills

Ingen kaldt formelt via Skill-værktøjet. `fejljagt`s metode (mål apparatet,
find mekanismen, ret sidst) blev fulgt i praksis (punkt 1's CSS-scope-fund,
punkt 7's kommentar-læk) uden det formelle kald. `ui-ux-critique` fravalgt:
intet nyt visuelt udtryk designet. `robotdata` fravalgt korrekt — ingen
robotdata rørt (`git diff --stat` mod data/robots/ er tomt).

## Punkt for punkt

1. **Enhedskontakt-etiket.** Løst uden ny CSS, som krævet. Ny nøgle
   `enhed_skift_etiket_metrisk`. Konfidens: **høj** — `grep -o 'Imperiale
   enheder'/'Metriske enheder' dist/da/robotter/unitree-go2/index.html`
   giver 3/3 (var 3/0). Forkert arbejde ville give 3/0 uændret.
2. **Begge "omregnet"-mærker væk.** ECB-noterne rørt ikke her (kun i punkt 5).
   Konfidens: **høj** — `class="omregnet"` på yufan-lingmao-cyvet: 0 (var 12).
   `class="pris-om__ord"` på katalogsiden: 0 (var 7). Forkert: uændret 12/7.
3. **Chip-række, ingen aktive som standard.** Krævede at fjerne HELE status'
   inverterede særspor (4 steder i katalog.mjs), ikke kun tømme
   `standard`-feltet — ellers var chippen gået i stykker (briefets egen
   fælde). Efterprøvet i browser (Playwright): klik "Udgået" → chip vises
   straks, overskrift bliver "3 robotter i standardvisningen". Konfidens:
   **høj** — ` checked`: 1 (IKKE 0, se fælder), `standard: udgåede skjult`:
   0 (var 1), "77 robotter" vist (var 74).
5. **Katalogsiden kun USD.** Fjernede hele den ≈-badge-visende
   `prisMaerke()`/`kursPar()`-mekanik, fordi enhver tekst der navngiver
   valutaen ville lække "CNY" tilbage. Kildemærket bevaret på figuren
   (briefets krav, bevidst afvigelse fra regel 3). Konfidens: **høj** —
   `grep -o 'CNY' dist/da/index.html`: 0 (var 33), `USD`: 31 (var 74).
   Forkert arbejde: CNY forbliver >0.
6. **Robotside, ikke-ændring.** Rørt intet i robot.mjs. Konfidens: **høj** —
   `grep -rl 'CNY'/'USD' dist/da/robotter`: 8/6 (uændret fra grundmålingen).
7. **Hele sidefoden væk.** Fjernet fra side.mjs' fælles `skal()`. Sprogskifter
   uberørt (topbar). Om os' egen linje uberørt. Konfidens: **høj** —
   `grep -rlo '<footer class="fod">' dist`: 0 (var 214), sidetal: 216
   (uændret). Forkert arbejde: 214 uændret, eller sidetal < 216.

## Usikkerheder

- Punkt 1: den FAKTISK synlige kontakt (topbaren) er ikke dækket af den CSS
  briefet henviste til — kun en ny `:has()`-regel (uden for mit filejerskab)
  kan gøre DEN tekst reaktiv. Se fælde nedenfor.
- Punkt 7: tabet er større end briefets ordlyd antyder — se fælde nedenfor.

## Målingerne

```
validate.mjs   77 fil(er) · 0 fejl · 1 advarsler         (uændret)
build.mjs      216 sider · 1111 tal med kilde, 0 uden    (uændret)
tests/koer.mjs 1554 bestået, 0 fejlet                    (var 1534)
linktjek.mjs   0 døde interne · 50 producentsider · 0 unåede (uændret)
```

Server på port 8147 lukket, browser lukket, begge efter punkt 3's måling.

---

## Nye fælder og opdagelser

1. **En HTML-kommentar TÆLLER MED i en grep-baseret acceptkriterium.** Min
   første version af punkt 7 satte en forklarende `<!-- ... -->` ind i
   stedet for foden, og kommentaren citerede selv `footer class="fod"`
   ordret — `grep` skelner ikke kommentar fra markup, så tallet blev 216,
   ikke 0. Rettet ved at flytte forklaringen til en JS-kildekode-kommentar
   (over `export function skal()`), som aldrig når det byggede output.
   Værd at huske for enhver fremtidig "fjern X"-opgave med et grep-kriterium.
2. **Punkt 1's brief antog en CSS-mekanisme, der ikke dækker den synlige
   kontakt.** `system.css`'s `.typeskilt .enhedsskift__boks:checked ~ *`-regel
   (den briefet henviste til) styrer kun de TO skjulte in-page-instanser
   (robot.mjs, selv skjult af en senere `display:none`-regel fra en
   redesign-runde 1. sep). Den ENESTE brugeren rent faktisk ser
   (`.daek__enhed` i topbaren) er kun dækket af en `:has()`-baseret regel,
   der i dag styrer dens FARVE/knop, ikke dens TEKST. Jeg løste den
   skrevne opgave (pak begge tekster i eksisterende klasser — måler 3/3,
   som krævet), men den visuelle switch i topbaren vil IKKE skifte tekst
   for en rigtig bruger, før en ny `:has()`-regel (2 linjer, samme mønster
   som system.css:2198-2200) tilføjes af sporet der ejer CSS'en.
3. **Punkt 3 var to fejl, og en naiv rettelse af den ene ville have
   efterladt den anden usynligt i stykker.** At blot sætte
   `standard: new Set()` uden at fjerne de fire steders særkode (to i
   `hovedStil()`, to i `render()`) ville have ladet `if (f.standard)
   continue` (sand for en tom-men-truthy Set) fortsætte med at springe
   status over i den generiske chip-generering — resultatet: STADIG ingen
   chip for status, uanset hvad brugeren vælger. Fanget ved at læse hele
   kæden igennem FØR jeg rettede, ikke ved at måle bagefter.
4. **Punkt 5 krævede at fjerne indhold, jeg troede var "uden for punktet".**
   To ECB-forklaringsnoter (som punkt 2 udtrykkeligt sagde "rør ikke")
   indeholdt selv literal "CNY"-tekst og en påstand ("valuta står uændret
   på kortet"), der blev usand i samme øjeblik kortet ændrede sig. Løst
   ved at omskrive begge noter til at være sande igen — punkt 2's "rør
   ikke" gjaldt punkt 2's egen, snævrere jagt på synlige mærker, ikke en
   permanent fastfrysning for resten af sporet.
5. **Punkt 7's tab er større end ordlyden "hele foden, ikke kun
   forhandlerlinjen" umiddelbart antyder.** Forbeholdet gik fra at stå på
   ALLE 216 sider til at stå på PRÆCIS én (Om os) — ikke kun en
   deduplikering, som en tidligere spors test (53-robotsidens-flader.mjs)
   antog. Bryder ingen hård begrænsning mekanisk, men er en større
   dækningsændring end en hurtig læsning af briefet giver indtryk af.
6. **Briefets egen "3 → 0"-forudsigelse for ` checked`-optællingen i punkt 3
   var upræcis.** Den blandede status-facettens 2 defaults sammen med
   sorteringens "Alfabetisk"-radioknap (en tredje, urelateret `checked`,
   som IKKE kan blive 0 — en radiogruppe kræver ét valgt). Målt facit: 1,
   ikke 0 — dokumenteret som en afvigelse fra briefet, ikke ulydighed.

## Punkter i briefet, jeg ikke nåede

Ingen. Alle seks punkter (1, 2, 3, 5, 6, 7) er gennemført og målt. Punkt 4
var aldrig mit (sammenligningsbaren, kræver CSS).
