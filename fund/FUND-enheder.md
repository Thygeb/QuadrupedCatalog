# FUND-enheder — kanonisk visningsenhed + klaebende sammenligningshoved

Skill-vurdering: ingen af projektets skills passer direkte (`robotdata` gaelder
dataindsamling i YAML, ikke visning; `impeccable`/`ui-ux-critique` er design-
kritik af noget der ikke findes endnu; loesningen var allerede valgt af JPK).
Ingen skill kaldt.

## 1. Valgt / fravalgt

- **Valgt:** ny, ADSKILT normalisering (skema.mjs' `visningsPost`/
  `normaliserVisningsEnheder`), kaldt KUN fra build.mjs's i-hukommelse-kopi.
  ALLE skabeloner (kort, robotside, sammenligning) rammes automatisk, uden at
  side.mjs/forside.mjs/producent.mjs (tre andre spor) skal aendres.
- **Fravalgt:** at laegge normaliseringen ind i `normaliserRobot()` (den delte
  funktion validate.mjs bruger) — ville risikere at aendre validatorens R5/R9,
  som brifet forbyder at forstyrre.
- **Valgt (punkt 2):** `.specimen-hoved{position:sticky;top:0}` fra 901 px,
  panelfarve som baggrund. **Fravalgt:** sticky ogsaa under 900 px — mobil-
  overstyringen stakker specimen-kortene i ét fuldbredt kort pr. robot; et
  klaebende saadant ville daekke det meste af skaermen.

## 2. Konfidens

- **Punkt 1 (enheder), HOEJT:** `node tools/maal-enheder-visning.mjs dist-e/robots.json`
  -> "9 felter tjekket, 0 fejl". Foer sporet gav samme kommando (paa den
  raa, ukonverterede robots.json) 8 fejl (mm/cm/m osv. blandet) — det er
  hvad tallet ville have vaeret, hvis arbejdet var forkert eller rullet tilbage.
- **Punkt 2 (klaebende hoved), HOEJT:** `node tools/maal-klaebende-hoved.mjs
  http://localhost:8081/da/sammenligning/` (server: `python -m http.server 8081
  --directory dist-e`) -> hovedTop:0, hovedISkaerm:true ved sidste raekke. Uden
  CSS'en ville `position` vaere "static" og hovedTop ville vaere langt negativt.
- **Punkt 3 (tests), HOEJT:** `node tests/koer.mjs` -> "248 bestaaet, 2 fejlet"
  (grundmaaling: 232/2). Rulles punkt 1/2 tilbage, fejler K9a/K9b/K10.

## 3. Usikkerheder

- `feltIBasis()`/yderpunkterne (forsidens letteste/tungeste/hurtigste) regner
  til BASISenhed uafhaengigt af hvilken gyldig enhed der staar — matematisk
  unit-invariant, men jeg har IKKE diff'et forsidens fire yderpunkt-navne
  foer/efter for at bevise, at ingen afrundingsfejl i `visningsPost` flyttede
  en robot. Middel tillid, ikke maalt i endelig form.
- Kildens egen form (`_kildeform`) vises KUN paa robotsidens egen feltliste
  (robot.mjs, mit spor). Kortets/stribens kildemaerke (side.mjs, et andet
  spor) faar ikke denne title — jeg kan ikke redigere den fil i dag. Data
  baerer `_kildeform` klar til det, naar/hvis det spor vil bruge den.

## 4. Maalingerne

validate 77/0/1 (uaendret) · build 213 sider, 1110/0 (uaendret) ·
tests 248 bestaaet/2 fejlet (foer: 232/2, +16) · maal-enheder-visning: 0 fejl.

---

## Enhedstabel foer/efter (uden for 60-linjers-loftet)

| Felt | Foer (raa, alle 77 filer) | Efter (dist-e/robots.json) | Kanonisk |
|---|---|---|---|
| laengde | mm:50 cm:8 m:1 | cm:59 | cm |
| bredde | mm:50 cm:8 m:1 | cm:59 | cm |
| hoejde | mm:52 cm:8 m:1 | cm:61 | cm |
| forhindring_enkelt | cm:25 mm:2 m:3 | cm:30 | cm |
| hastighed | m/s:58 km/h:6 | m/s:64 | m/s |
| driftstid | t:59 min:7 | min:66 | min |
| ladetid | t:18 min:5 | min:23 | min |
| haeldning | °:52 %:1 | °:52 %:1 (uaendret, 1c) | ingen — to dimensioner |
| pris | CNY:6 USD:4 EUR:1 | CNY:6 USD:4 EUR:1 (uaendret, 1b) | ingen — valutakurs mangler kilde |

Kriteriet, der afgjorde hver kanonisk enhed (fuld udregning i skema.mjs'
kommentar ved `KANONISK_VISNINGSENHED`):
- Laengder: mm gav op til FIRE cifre (1190 mm, 1100 mm) — cm giver hoejst tre
  (119 cm), mod prisen af én decimal paa 11/59 vaerdier (fx 721 mm -> 72,1 cm,
  en PRAECIS omregning, ikke et gaet).
- Hastighed: m/s er allerede 58/64 af kataloget og har max ét ciffer (8); den
  modsatte vej (alt til km/h) ville tvinge 58 vaerdier gennem *3,6 med mange
  decimaler.
- Driftstid/ladetid: MODSAT flertallet ("t", 59/66) — malt at alle fundne
  "t"-vaerdier (1.5, 2.5, 3.15, 3.3, 4.6) er hele antal minutter, mens flere
  "min"-vaerdier (40, 110, 160) IKKE er hele antal timer (0,667 t, 1,833 t,
  2,667 t). Minutter er derfor det broekfrie valg, selvom det er mindretallets
  enhed — skrevet ud her og i skema.mjs, saa det ikke laeses som en fejl.

## Stikproeve (4 felter, Go2 + Spot obligatoriske)

1. **Unitree Go2, laengde:** foer `{vaerdi:70, enhed:"cm"}` — efter UAENDRET
   (allerede kanonisk cm), intet kildemaerke-tillaeg (ingen `_kildeform`,
   fordi intet blev omregnet).
2. **Boston Dynamics Spot, laengde:** foer `{vaerdi:1100, enhed:"mm"}` — efter
   `{vaerdi:110, enhed:"cm"}`. Kildemaerkets title paa robotsiden (robot.mjs)
   baerer nu "Producenten skrev: 1100 mm. Vi viser tallet i sidens faelles
   enhed." (verificeret i dist-e/da/robotter/boston-dynamics-spot/index.html).
3. **Addverb Trakr 5, driftstid:** foer `{vaerdi:1.5, enhed:"t"}` — efter
   `{vaerdi:90, enhed:"min"}`, title "Producenten skrev: 1.5 t. ...".
4. **Microrobotech MoveNew T1, hastighed:** foer `{vaerdi:18, enhed:"km/h"}` —
   efter `{vaerdi:5, enhed:"m/s"}` (18/3,6 = 5,0 praecist), title "Producenten
   skrev: 18 km/h. ...".

## Nye faelder og opdagelser

- **side.mjs's `.stribe`/`.kort()`/kildemaerke() er filkrydsende, uden at
  vaere paa udelukkelseslisten.** Brifet forbyder at roere side.mjs, men
  KORTETS enhedsvisning laeses derfra og bygges af det SAMME `robotter`-array
  som robot.mjs. Det er GRUNDEN til, at jeg valgte central mutation i
  build.mjs frem for at rette hver skabelon: det var den eneste vej, der
  kunne naa kortet uden at redigere en fil, en anden agent ejer. Vaerd at
  vide for naeste, der undrer sig over, hvorfor normaliseringen ikke ligger i
  side.mjs, hvor `tal()`/`kildemaerke()` bor.
- **En eksisterende test blev roed af den rigtige grund og blev VENDT, ikke
  slettet:** "operatoren staar ogsaa foran et interval: 'ca. 1-2 t'"
  (tests/koer.mjs, syntetisk fixture med driftstid 1-2 t) forventede den
  gamle, ukonverterede tekst. Omskrevet til at forvente "ca. 60-120 min" —
  se commit-beskeden for punkt 3.
- **`somSkrevet()` i side.mjs** (den tomme maaleplades skaermlaesertekst,
  "Vaerdien som den staar i datafilen") laeser OGSAA det nu-normaliserede
  `post.enhed`/`post.vaerdi` — plade-teksten viser derfor "110 cm", ikke
  "1100 mm", for Spot. Jeg vurderer det som oenskeligt (samme regel som
  resten af siden: én enhed), men det er en semantisk drejning af en
  kommentar, jeg ikke skrev, og som jeg ikke kunne rette (side.mjs er
  spaerret) — flag det, hvis det spors ejer er uenig.

## Punkter i briefet, jeg ikke naaede

- Kildens egen form i kildemaerkets `title` paa KORT og noegletalsstriben
  (side.mjs) — kun robotsidens egen feltliste (robot.mjs) faar den. Data
  (`post._kildeform`) staar klar; side.mjs's `kildemaerke()` skal selv laese
  den, naar det spor har mulighed for at aendre filen.
