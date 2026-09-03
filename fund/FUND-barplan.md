# FUND — spor/barplan, 3. sep 2026

## Hvad planen foreslår

**Højden:** 45,7 px (desktop) og 69,3 px (390 px, 3 valgte) → **≤ 40 px overalt**, mens
berøringsmålene går den anden vej: **13,2 → ≥ 24 px.** **Formen — her skal JPK vælge:**
bjælken er i dag et *bånd*, 1.440 × 45,7 px massiv gunmetal (65.790 px²) for 605 px blæk; **58 % tom ved tre valgte robotter, 74 % ved én.**
Anbefaling: **B, SKINNEN** — bjælken bliver så bred som sit indhold (~653 px mod 1.440),
centreret, løftet fri af kanten, hårstreg i stedet for den rå `rgba`-skygge: tom andel →
~0 %, dækket areal −60 %. **A, RÆKKEN** beholder båndet og pakker kun indholdet sammen —
sikrest, løser "grim" kun halvt. **C, SPORET** (tre pladser) er demoteret.

**Fjern-knappen sidder umiddelbart efter hvert navn**, ikke i en kolonne, og hedder
**"Fjern"/"Remove"** synligt med `Fjern Spot fra sammenligningen` i `.kunskaerm`. **Ingen
symboler, ingen ny i18n-nøgle, ingen ny komponent** — det er sammenligningssidens
`specimen__fjern` (JPK 2. sep); nøglerne står i `da.json`/`en.json:338-339`.

**Bundpladsen:** `--barplads` sat af JS ud fra bjælkens **målte** højde, brugt som
`padding-bottom` på `body` **og** `scroll-padding-bottom` på `html`; pris på de øvrige
215 sider: 0 px. **D1–D8 med pris** står i planens afsnit 8 — kun D1 kan ikke uddelegeres.

## Valgt og fravalgt

`impeccable shape` (L70) — kaldet **lykkedes** fra worktreen; `scripts/context.mjs` kørt
(skriver intet: 0 nye filer). `spor` kaldt som første handling. **Forbi:** `new-work`
(verdenen er låst; §3 *"Extend an existing surface"*), `critique`/`ui-ux-critique`
(fejljagt, ikke plan — L70: en fejlliste kan ikke hæve loftet), `frontend-design` (ingen
ny flade), `taste-skill:*` (Å148), `grillmig` (ude af workflow). **Leverance:**
`fund/PLAN-klaebebar.md`, 537 linjer + 4 skud; **ingen kode rørt** (`git status` på
`*.css`/`*.js`/`*.mjs` giver **0**). **Grundmåling** efter kopiering af de 610 gitignorerede
fotos: `validate` **77/0** + 1 advarsel, `build` **216 sider** (CLAUDE.md siger 213).

## Målinger

| | Tal |
|---|---|
| Barhøjde 1440 / 1024 / 390 (3 valgte) | **45,7 / 45,7 / 69,3 px** · ombryder mellem **660 og 700 px** |
| Tom andel, 1440, ved 1 / 2 / 3 valgte | **74,2 / 65,6 / 58,0 %** |
| Utilgængeligt dokument ved maks. rulning, 1440 / 390 | **45,7 / 69,3 px** — katalogets sidste `<p>` **100 % skjult** |
| Bjælkens knapper i fokusrækkefølgen | **231 og 232 af 232** |

## Konfidens

- **Høj — alle tal ovenfor.** Genkørbart: `barmaal/bund/tomrum/tab.mjs` i scratchpad mod
  egen server på 8135, hver med URL- og breddevagt. *Havde det været forkert:* min første
  kørsel gav `"fandtBar": false` på briefets sti — et plausibelt nul, ikke en fejl.
- **Høj — 23 `fil:linje`-citater** slået op enkeltvis (`sed -n <n>p` + `grep`). **3 var
  forkerte og er rettet** (2425→2426, 2478→2482-83, 2487→2485); 23/23 nu OK. *Uden tjekket*
  var tre forkerte linjenumre gået videre til en bygger. **Fire kontrasttal** er desuden
  genberegnet med WCAG-formlen og læseretning skrevet ud: 4/4 stemmer.
- **Middel — retningernes tal** (~653 px, 40 px, −60 %): regnet af målte størrelser, men
  intet er bygget; mobilens 40 px hviler på et rullespor, der er udregnet, ikke set.
  **Lav — æstetikken:** "B er pænere end A" er en dom, ikke en måling. JPK skal se dem.

## Usikkerheder

- **Navnenes skriftgrad er uafgjort:** 14 px findes ikke i DESIGN.md's skala, 11,5 px er for lille ved en `Fjern`-knap — hører i `impeccable typeset`, ikke her.
- **Om `Ryd udvalget` skal overleve** tre `Fjern`-knapper — lod den stå; kan omgøres
  isoleret. **Om centreret slår højrestillet** i B er en læsning, ikke en måling.

## Nye fælder og opdagelser

1. **"Ingen symboler af nogen art" er allerede brudt på samme flade.** Kortets stempel
   `.knap--maerkat` tegner `content:"+"` (`system.css:2692`) og `content:"\00d7"` — et
   kryds — når robotten er valgt (`:2712`). Reglen i klæbebarens kommentar
   (`system.css:2445`) læser som absolut og er det ikke. **Planen bryder den ikke** og
   foreslår ikke at ophæve den; men næste læser skal ikke tro, at et kryds er
   uhørt her.
2. **CSS-kommentaren `system.css:2485` er direkte forkert:** *"Bjaelken daekker IKKE
   sidefoden."* Katalogsiden har **0** `<footer>` (målt), og intet holder bjælken væk fra
   sidens sidste afsnit, som er 100 % skjult. Kommentaren afviser samtidig
   `scroll-padding-bottom` som unødvendig — men `id="tegn"` ligger **100 %** inde i filen
   og har **2** links til sig fra selve kataloget, så et `:target`-hop lander netop dér,
   hvor bjælken skærer. **En kommentar, der forklarer hvorfor noget ikke er nødvendigt,
   er lige så meget en påstand som et tal og skal efterprøves lige så hårdt.**
3. **`sammenligning.js:705 fjernSlug()` taber fokus til `<body>`** ved hvert klik, fordi
   `opdater()` skriver `resultat.innerHTML`. Præcedensen, planen ellers genbruger, gør
   altså én ting forkert — den er skrevet ud som D3, så den ikke arves.
4. **Bjælkens `box-shadow:0 -1px 0 rgba(0,0,0,.2)` (`:2452`) er den ENESTE rå
   rgba-skygge i hele `system.css`.** Målt: `grep -n "box-shadow:[^;]*rgba"` giver 1
   træffer. Systemet er ellers fladt med `--skygge:none`.
5. **Miljø: `netstat`, `cmd` og `python` findes ikke på PATH i Git Bash — heller ikke
   `cmd`.** Serveren måtte lukkes med `/c/Windows/System32/NETSTAT.EXE -ano -p tcp` for
   at finde PID'en og `/c/Windows/System32/taskkill.exe`. `taskkill //PID $x //F` med
   MSYS-flugtsyntaks fejlede tavst, fordi `cmd` ikke fandtes — **og `curl` svarede
   stadig 200 bagefter, så det lignede at kommandoen bare ikke virkede.** Der kørte
   samtidig en fremmed server på **8136**; den er efterladt kørende med vilje.
6. **`git commit -F /tmp/<fil>` virker ikke.** Bash skriver til sin egen `/tmp`, som
   Windows-git ikke kan se: `fatal: could not read log file`. Beskeden skal skrives til
   en `C:/…`-sti. Det står i miljøfælderne for node, men ikke for git.
7. **`grep -o '<moenster>' <fil> | wc -l` mod `grep -c`:** mit `class="kort__navn"`-regex
   gav **0** mod forventet 77, fordi navnet står i et barneelement på næste linje.
   Kontrollinjen fangede det med det samme — uden den havde "0 navne" set ud som et
   gyldigt resultat, og hele afsnittet om navnelængder var faldet bort.

## Punkter i briefet, jeg ikke nåede

- **Ingen.** Alle seks krav til planens indhold er besvaret (afsnit 1, 3, 4, 5, 8, 9),
  og alle fire af JPK's klager har et forslag med acceptkriterium.
- **Tre af briefets fakta var forkerte og er rettet i planen frem for fulgt:**
  `.klaebebar` står på `system.css:2447` (ikke ~2315); katalogsiden er
  `dist/da/index.html` (ikke `dist/da/robotter/`, som gav mig et `"fandtBar": false`);
  og *"1, 3 og 5 valgte robotter"* kan ikke måles — `SAML_MAKS = 3`
  (`assets/katalog.js:79`), så området er 0–3. Planen er målt på 1, 2 og 3.
- **CLAUDE.md's "213 byggede sider" er forældet.** Målt her: **216**.
- **Serveren på 8135 er lukket** (målt: 200 før, 000 efter). Worktreen
  `../udstilling-wt-barplan` står tilbage med 2 commits og skal ryddes af orkestratoren
  efter flet.
