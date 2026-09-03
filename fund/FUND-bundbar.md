# FUND — bundbaren, Retning B (SKINNEN)

`spor/bundbar`, 4. sep 2026. **Skills:** `spor` og `design` kaldt (begge lykkedes;
Skill-værktøjet indlæste dem fra hovedrepoets `.claude/skills/`, ikke worktreens kopi —
indholdet er committet og identisk). Fravalgt: `impeccable` (retningen var valgt af JPK,
sporet udfører den), `fejljagt` (fulgt som *metode* to gange — apparat før tal — men ikke
kaldt som skill), `robotdata`/`supabase*` (rører ingen data).

## HVAD JPK SER PÅ SKÆRMEN

Katalogsiden, 1440 px, tre robotter valgt. Alle tal er mine egne målinger.

| UI-element | Før | Efter |
|---|---|---|
| **Bjælkens bredde** | 1.440 px, kant til kant | **696 px** (typiske navne) · **866 px** (de tre længste) · 512 px ved én robot |
| **Bjælkens form** | Fuldbleed gunmetalbånd | **Fritstående, centreret genstand**, 16 px fri af kanten, 2 px hjørne |
| **Bjælkens højde** | 45,7 px | **33,2 px** — og det gælder ved *alle* 10 målte bredder |
| **Højde ved 390 px, 3 valgte** | 69,3 px (to rækker) | **33,2 px** (én række, vandret rullespor på 155 px) |
| **Dækket gunmetal-areal** | 65.808 px² | **23.101 px² (−65 %)** typisk · 28.733 px² (−56 %) værst |
| **Fjern én robot** | Fandtes ikke | **`FJERN`-knap ved hvert navn**, 53×25 px (da) / 67×25 px (en) |
| **Berøringsmål, alle bjælkens knapper** | 13,2 px høje | **≥ 24 px** — også `Åbn sammenligningen` og `Ryd udvalget` |
| **Overkanten** | Rå `rgba(0,0,0,.2)` | **1 px hårstreg** i `--paafod2`. Sidens eneste rå rgba er væk |
| **Dokumentets sidste px** | 45,7 / 69,3 px dækket | **0 dækkede tekstnoder** i 6 målinger |
| **Tabulatorstop til `Åbn sammenligningen`** | 241 af 242 | **10 af 245** |
| **Fokus efter et `Fjern`-klik** | Faldt til `<body>` | Næste `Fjern` → kortets knap → søgefeltet. **0 af 3 klik gav `body`** |
| **Grænsebeskeden "højst 3"** | I filterpladen, op til 3.000 px væk | **I bjælken**, over den, i samme materiale |
| **Skriftgrader** | 14 px / 13 px | **Uændret. Ikke én ny `font-size`** (DP3b's acceptkriterium holdt) |
| **Bevægelse** | — | **Ingen.** 0 `transition`, 0 `@keyframes` (J2) |

**Skærmbilleder, jeg selv har set på** (i scratchpad, `skud/`): `da-1440-3`, `da-1440-1`,
`en-1440-3`, `da-390-3`, `da-390-1`, `en-390-3`, `da-390-3-fokus`, `da-1440-3-fokus`.

## MÅLINGER

| Kørsel | Før (min grundmåling, `e5e8cca`) | Efter (`git merge main` = `d5897b5`) |
|---|---|---|
| `node tools/validate.mjs` | 77 filer · 0 fejl · 1 advarsel | 77 · 0 · 1 |
| `node tools/build.mjs` | 216 sider · 1111 tal med kilde | 216 · 1111 |
| `node tests/koer.mjs` | **1757 bestået, 9 fejlet** | **1805 bestået, 9 fejlet** |

1805 = mains 1769 + mine 36. **De 9 røde er ordret briefets liste** — ingen af dem er mine,
og ingen gik grøn. 48.28/48.29, 61 og 65 er grønne: ankeret er bevaret.

## KONFIDENS

**Høj** (genkørbar kommando + kontrafaktisk linje):

- **Geometri, højde, centrering** — `geo2.mjs`/`p6.mjs` mod port 8206. 20 målinger, højde
  33,2 px ved alle. *Var arbejdet forkert, ville højden være 45,7/62,4/69,3 — de tal, jeg
  målte på samme apparat før hvert punkt.*
- **Fokusreglen** — 3 tastaturklik, 0 gange `body`; kontrolkørsel med filtreret kort
  landede på `#sog-katalog`. *Før punkt 2: 1 af 3 gav `body`.*
- **Bundpladsen** — 6 målinger ved maks. rulning, 0 overlap og 0 dækkede tekstnoder.
  *Uden `--barplads` ville `.sidefod__ramme` stå på 104 px hårdkodet luft.*
- **Tabulaturrækkefølgen** — 10 af 245, begge sprog. *Med `body.appendChild` var det 241.*
- **Test 81** — 36/36 grøn på urørt kilde; 13 mutationer fældede 14 assertions.
- **Suiten** — 1805/9, kommandoen ovenfor.

**Middel:** at rullesporets 155 px er *nok* på mobil. Målt som px, ikke afprøvet af et
menneske; et 21-tegns navn fylder stadig mere end sporet (se skærmbilledet).

**Lav:** intet. Alt i tabellen er målt i browseren.

## USIKKERHEDER

1. **Rullesporet klipper hårdt.** Ved 390 px står `ANYmal (Generation D) FJE|` uden nogen
   antydning af, at der er mere. Dækket lever med samme risiko (J3 accepterede den), men
   her lander snittet midt i et ord og læses som ødelagt snarere end som rulbart.
2. **`Ryd udvalget` skal rulles frem** ved smalle bredder. J5 er overholdt — knappen findes
   og rydder alle tre på ét tryk — men den er ikke synlig uden en swipe ved 390 px.
3. **Tabulaturrækkefølgen er Fjern×3 → Ryd → Åbn**, ikke briefets Fjern×3 → Åbn → Ryd.
   Begrundelse og måling nedenfor.

## AFVIGELSER FRA BRIEFET OG PLANEN — alle målt

1. **Acceptkriterium 3 ("bredde < 800 px") holder typisk og falder i værste tilfælde.**
   Målt: da 696,1 typisk / 865,8 værst; en 778,6 / 948,3. Årsagen er regnestykket bag
   forudsigelsen: planens ~653 px er blæk 605 + 48 polstring, hvor 605 er navne **plus de
   to handlinger, men uden de tre Fjern-knapper**, som samme plan pålægger. Rent blæk i
   værste tilfælde er 764 px, så enhver polstring overhovedet ligger over 800.
2. **Planens `left:auto;right:auto` ville have brudt J1.** På et `position:fixed` element
   betyder `left:auto` "brug den statiske position" = venstrekanten. Formen, der centrerer,
   er `left:0;right:0;margin-inline:auto`. Målt: venstre = højre på px i alle 20 målinger.
3. **Rullesporet gælder ved alle bredder, ikke under 700 px.** Ved 700 px var bjælken
   62,4 px høj — værre end de 45,7, klagen handlede om. Grænsen ville desuden flytte sig
   med sproget ("Remove" er bredere end "Fjern").
4. **`Ryd udvalget` ligger inde i rullesporet** (som planens §6 selv skriver). Med begge
   handlinger faste blev sporet 52 px (da) / 12 px (en) ved 390 — navnene var reelt
   usynlige. Med Ryd i sporet: 155 / 160 px.
5. **Sidefodens `:has()`-regel er fjernet, ikke omskrevet til `var(--barplads)`.** Begge
   regler ville reservere pladsen to gange (104 px i foden + 45 px på body for en 49 px
   bjælke). Reglen er beskrevet i prosa på sin gamle plads.
6. **`saml_fjern_kort`/`saml_fjern_navn` står på `data/i18n/*.json:281-282`**, ikke 338-339
   som briefet siger.
7. **Briefets DESIGN.md-linjenumre var alle rigtige** (DP3b 666, Dybde 745, Former 761), og
   `grep -c "^#" DESIGN.md` gav 45. **`design`-skillens eget kort siger 32 og er forældet.**
8. **Å152's fund er LUKKET.** "Bundbaren og foden er samme gunmetal og smelter sammen ved
   390 px": bundpladsen på `<body>` er lys `--bund`, så der ligger nu en lys stribe mellem
   de to gunmetalflader. Set på `da-390-3.png`.

## FUND, JEG IKKE HAR RETTET (designfrysen)

**Symbolforbuddet i `system.css` er allerede brudt af koden på samme side.** Kommentaren
over `.klaebebar` siger *"Ingen symboler af nogen art"*; kortets stempel `.knap--maerkat`
tegner `content:"+"` i hvile og `content:"\00d7"` når robotten er valgt. Det er en modstrid
mellem en kommentar og koden, ikke en fejl i bjælken — `Fjern` bærer ordet (J4), så bjælken
overholder reglen uanset hvordan den ender. **Hører i designplanen, ikke i et hastespor.**

## HULLER I DESIGN.md

1. **Der er ingen regel for, hvad der må ligge OVEN PÅ en flade i samme farve.** Bjælken og
   sidefoden er begge `--fod`; hverken *Dybde* eller *Former* siger, hvordan to
   gunmetalflader skal skilles ad. Jeg brugte en lys stribe fra bundpladsen — det virker,
   men det er min løsning, ikke systemets.
2. **`--ring`s offset er ikke systematiseret.** Sidens globale ring er 3 px/3 px, bjælkens
   2 px/2 px, og alt i et rullespor må tegnes **indad**. Den tredje regel findes kun som en
   kommentar i dækkets afsnit og er nu kopieret til bjælken. Den hører i *Fokusringen*.
3. **Der findes intet trin for "fritstående genstand".** *Former* dækker hjørnet, *Dybde*
   forbyder skygge — men ikke, hvordan en flydende ting afgrænses. Jeg brugte `inset 0 0 0
   1px var(--paafod2)`; hvis flere flader får den form, bør den blive et token.

## NYE FÆLDER OG OPDAGELSER

1. **Revert-beviset fandt en fejl i testen, ikke i koden — det var sporets vigtigste enkelte
   måling.** 13 mutationer, forventet 15 røde, målt 14. Den, der ikke faldt, var 81.21:
   `getElementById('sog-katalog')` står **to** steder i `katalog.js` (linje 421 i
   fokusreglen, 562 i filterkoden), så den anden forekomst holdt påstanden grøn, mens
   fokusreglens tredje gren var ødelagt. **En assertion, der kan holdes i live af en linje,
   den ikke handler om, beviser ingenting** — og den ville have stået grøn i suiten, mens
   fokus faldt til `<body>`. Rettet til at måle inde i funktionen; bevist bagefter med en
   enkeltmutation (35/1).
2. **`udsnit(css, ':root{', '}')` rammer en `}` inde i blokkens egen kommentar.** 81.12 var
   rød af den grund, længe før den nåede de to skyggetokens på linje 269-270. Samme familie
   som CLAUDE.md's `split()`-fælde, ét lag ude: en afgrænsning, der lander et sted, ingen
   havde tænkt på, og som giver et fuldt plausibelt falsk svar.
3. **Et råt `grep` i CSS talte min egen dokumentation.** `rgba(` og `transition` gav begge 1
   i klæbebar-blokken — begge stod i den kommentar, der forklarer, hvorfor de *ikke* er der.
   Med kommentarer strippet: 0 og 0. Fælden er kendt fra CLAUDE.md; den blev alligevel
   trådt i, fordi tallet 1 var fuldstændig plausibelt.
4. **En tavs fokusfejl med to årsager.** `tegnSaml`'s else-gren satte kun `hidden` og tømte
   aldrig listen, så et forældet `<li>` i den skjulte bjælke blev talt som et resterende mål
   — fokus blev sat på et skjult element, og `activeElement` blev `<body>` **uden nogen
   undtagelse nogen steder**. To værn nu: listen tømmes, og fokusreglen tjekker selv `hidden`.
5. **`scroll-padding-bottom: auto → 0px` er en ændring, der ser ud som ingen ændring.** Et
   ubetinget `html{scroll-padding-bottom:var(--barplads)}` gav 0px på alle 216 sider — samme
   opførsel i dag, men `auto` er per specifikation UA'ens valg. Kun fordi jeg målte den
   *tekstlige* værdi og ikke kun tallet, blev reglen gjort betinget med `:has()`.
6. **Et blødt bindestreg (U+00AD) smuttede ind i en kommentar** og var usynlig i editoren.
   Fanget af `grep | cat -A`, som CLAUDE.md kræver efter skal-skrivning.

## PUNKTER I BRIEFET, JEG IKKE NÅEDE

- **Ingen.** Alle syv punkter er bygget, målt og committet (9 commits).
- **Ikke gjort med vilje:** de 9 røde er ikke rørt; symbolmodstriden er noteret, ikke rettet;
  `data/i18n/` er ikke rørt (ingen ny nøgle); `dist/` er ikke committet.
- **Server på port 8206 er lukket** og verificeret død (netstat 0 LISTENING, `curl` tomt).
- **`tests/.tmp-bundbar-proeve` (68 MB) står stadig i worktreen.** Jeg forsøgte at rydde den,
  men `rm -rf` på `tests/.tmp-*` er nægtet af permission-systemet, og jeg gik ikke uden om
  reglen med et andet værktøj. Den er gitignoreret og forsvinder med worktreen — men den
  skal med i oprydningen, hvis worktreen skal leve videre.
