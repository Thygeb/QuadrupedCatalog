# FUND-billedramme.md — spor/billedramme

Skill-vurdering: ingen af de tre kørbare globale skills (`impeccable`,
`ui-ux-critique`, `critique`) passer — briefet var en præcist specificeret
kode-/CSS-rettelse (målt årsag, given løsning), ikke en design- eller
kritikopgave. Projektskillerne (`robotdata`, `parallelt`, `grillmig`,
`supabase*`) rammer heller ikke denne opgavetype. Gik forbi alle, byggede
direkte.

## Valgt/fravalgt

- **Punkt 1:** Valgt: `--plade` udledes automatisk af filens egen
  byte-header (PNG/JPEG/WebP, magic-byte-sniffet). Fravalgt: at kræve et
  manuelt `plade: ja`-felt pr. billede (det er netop den løsning, der lå
  ubrugt og gav 0/75).
- **Punkt 2:** Valgt: `loading="eager"` på de første 4 kort (målt
  række-antal), øvrige lazy, plus en `@media print`-regel for sideskift og
  farve. Fravalgt: en CSS-regel der "tvinger" netværkshentning — den
  findes ikke, se usikkerheder.
- **Punkt 5 (nyt fra orkestrator):** Valgt: fjern hele banneret + CSS +
  i18n-nøgler, ret alle fire kommentarer i min egen fil. Fravalgt: at røre
  generator.css:389 (ejes af andre spor, jf. briefet).

## Konfidens

- **Punkt 1, HØJT.** `grep -o billedled--plade dist-r/da/robotter/index.html | wc -l` → 27 (før: 0). Var koden rullet tilbage, ville kommandoen igen give 0.
- **Punkt 2 (eager), HØJT.** `grep -o 'loading="eager"' dist-r/da/robotter/index.html | wc -l` → 4. Rullet tilbage ville alle 75 være lazy (0 eager).
- **Punkt 2 (print-CSS), MIDDEL.** `grep -c "@media print" dist-r/system.css` → 1. Reglen styrer sideskift/farve — jeg kan IKKE bevise, at den tvinger netværkshentning, fordi ingen CSS-egenskab gør det (se usikkerheder).
- **Punkt 3, HØJT.** `node tests/koer.mjs` → 249 bestået/2 fejlet (var 232/2). 13+4=17 nye, alle grønne. Rullet tilbage ville de 17 fejle.
- **Punkt 5, HØJT.** `grep -rl "uden skriftlig tilladelse" dist-r/ | wc -l` → 0 (var >0). `grep -rl billednote dist-r/ | wc -l` → 1 (kun den tilladte generator.css-kommentar, se nedenfor).

## Usikkerheder

- CSS kan ikke tvinge en `loading="lazy"`-billedhentning i gang. Det
  eneste, jeg kan pege på, er dokumenteret Chromium/Firefox-adfærd
  (browseren ignorerer selv `lazy` ved print) — jeg har IKKE selv testet en
  faktisk print/PDF-eksport i denne opgave, så det punkt er kun bevist ved
  kildehenvisning, ikke ved måling.
- 25 %-grænsen er valgt, fordi den rammer briefets tal (27) og ligger i et
  reelt (om end ikke det globalt største) hul i fordelingen. En anden
  grænse (fx 21 %) ville også adskille klyngerne, bortset fra
  `cvte-maxhub-x7.jpg` (23,4 %), som ligger lige under linjen.
- `katalog.mjs` er rørt (index-tælleren til eager), selvom briefet navngav
  `side.mjs`/`system.css` som "min fil" — det var nødvendigt, fordi
  kort-rækkefølgen kun kendes der. Filen stod ikke på forbudslisten.

## Målinger

| Mål | Før | Efter |
|---|---|---|
| `billedled--plade` i katalog | 0 | 27 |
| `beskaaretOver25pct` (browser, maal.mjs, 1440px) | 27 | 0 |
| `loading="eager"` i katalog | 0 | 4 |
| `loading="lazy"` i katalog | 75 | 71 |
| `@media print` i system.css | 0 | 1 |
| validate.mjs | 77/0/1 | 77/0/1 |
| tests/koer.mjs | 232/2 | 249/2 |
| `billednote` i dist/ | 92+ (banner på hver side) | 1 (generator.css-kommentar) |
| "uden skriftlig tilladelse" i dist/ | >0 | 0 |
| Forhandler-fodnote i dist/ | 106 | 106 (uændret) |

Selv-efterprøvning: alle 5 punkter gennemgået mod acceptkriterierne, alle
grep-kommandoer talt om igen efter sidste rebuild. 2 fejl fundet undervejs
og rettet før commit: eager skrev intet attribut i stedet for
`loading="eager"`, og `system.css:62`s kommentar om billednote (ikke nævnt
i briefet, rettet alligevel). 6 skærmbilleder efter Playwright-scroll
(`yufan-lingmao-cyvet`, `unitree-laikago`, `unitree-aliengo`,
`magiclab-magicdog-edu`, `genisom-tongchui-m1-ultra`,
`boston-dynamics-spot` som kontrol) — alle bedre eller uændret, ingen værre.

## Nye fælder og opdagelser

`assets/fotos/fabrikant/cvte-maxhub-x7.jpg` hedder `.jpg`, men indeholder
en WebP-fil (RIFF/WEBP-signatur i byte-headeren). En dimensionslæser, der
stoler på filendelsen, ville fejle stille på netop denne fil. Løsningen
sniffer derfor magic bytes (PNG→JPEG→WebP) uanset endelse. Filen selv
ligger med 23,4 % afvigelse — lige under 25 %-grænsen, så den beholder
cover, men det er en ægte gråzone, ikke en klar sag.

`git add -p` er upraktisk til at splitte punkt 1 og punkt 2, fordi begge
tilføjede kode i samme sammenhængende blok i `side.mjs` (SIDEFORHOLD- og
EAGER_KORT_ANTAL-konstanterne stod side om side). Løst ved midlertidigt at
fjerne punkt 2-linjerne, committe punkt 1 alene, og generhverve punkt 2 fra
en lokal backup-kopi — ikke `git stash`-hunk-splitting, som er interaktivt
og ikke kan scriptes herfra.

## Punkter i briefet, jeg ikke nåede

Ingen. Alle fem punkter (inkl. det tilføjede punkt 5) er gennemført,
committet hver for sig, og efterprøvet.
