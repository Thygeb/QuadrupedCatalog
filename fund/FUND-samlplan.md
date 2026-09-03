# FUND — `spor/samlplan`

**Skills.** `spor` kaldt (lykkedes fra worktreen), `miljoefaelder.md` læst. `impeccable shape`
kaldt (lykkedes), `context.mjs` kørt, `shape.md` + `operate.md` læst; fase 1 (interview) sprunget
over efter skillens egen regel *"when no human … exists, mark assumptions plainly"*.
**Gået forbi:** `ui-ux-critique`, `impeccable critique/audit` (evaluering, ikke planlægning) ·
`frontend-design` (ingen ny visuel verden; TYPESKILT låst) · `taste-skill:*` (udelukker selv
datatabeller) · `robotdata` (ingen data rørt) · `grillmig` (ude af workflowet; ikke et brief).

**Valgt løsning.** K1: `.saml-matrix{table-layout:fixed}` + `overflow-wrap:anywhere`.
K2: rækkemarkering ved svæv/fokus **først**, gruppeskel med `--blaek3` som den ene nye streg,
**nej** til 33 rækkehårstreger. K3: behold `:has()`-reglen, luk hullet på **kataloget**.
**Fravalgt:** `<colgroup>` med procenter (layout ind i JS-markup) · `width:33%` (vejledende
under `auto`) · at løfte `--linje` selv (70+ kaldsteder) · altid-synlig enhedskontakt
(død på 26 producentsider med målt 0 tal).

## Konfidens

| Punkt | Niveau | Genkørbar kommando | Hvis arbejdet var forkert |
|---|---|---|---|
| F1: ingen vandrette streger | **høj** | I browseren: `[...t.querySelectorAll('tr')].flatMap(r=>[...r.children]).map(c=>getComputedStyle(c).borderTopWidth)` → 142 × `0px` | Én værdi ≠ `0px` ville vise, at regel 604 alligevel vinder |
| K1: fixed giver lige kolonner | **høj** | Server 8141, `localStorage['quad-sammenligning']=["microrobotech-movenew-p1","weilan-babyalpha","unitree-laikago"]`, 1440 px, mål `tr`-cellernes bredder med og uden `table-layout:fixed` | Uens tal efter `fixed` ville vise, at 224 px-bredden ikke honoreres og at der ALLIGEVEL skal en eksplicit bredde til |
| Kontrasttal | **høj** | Samme side: WCAG-formlen på `getComputedStyle`-farver | Et andet tal end 1,56 / 2,47 / 5,48 ville vise, at jeg målte token mod token i stedet for mod den faktiske flade |
| F4/K3: kontakten er der | **høj** | `grep -rl 'class="enhedsskift"' dist/da --include='*.html' \| wc -l` → 107; `id="enhedsskift"` → 72 | 0 og 0 ville vise, at etiketten ikke er i topbaren, og briefets påstand var rigtig |
| 132 omregnelige tal på kataloget | **høj** | `grep -o '<span class="enhed">\(kg\|mm\|cm\|m\|°C\|m/s\|km/h\)</span>' dist/da/index.html \| wc -l` | 0 ville vise, at kataloget slet ikke har tal, og at hullet ikke findes |
| F3: gruppetitlen klæber ikke | **høj** | Sæt `.saml-rulle.scrollLeft=250` ved 390 px, læs `.saml-gruppe__titel`s `left` | 16 (uændret) ville vise, at klæbningen virker |
| K2's **rangering** af de tre greb | **middel** | Ikke målbar med en kommando — den hviler på 1.336,8 px rejse, 0 hover-regler og 43,7 px rytme, ikke på en brugertest | — |
| Rækketonen 1,16:1 er nok | **lav** | Ikke efterprøvet med øjne på en rigtig skærm; kun regnet | — |

## Målinger

`validate` **77/0/1** (efter at 610 gitignorerede fabrikantbilleder er kopieret ind fra
hovedrepoet; **uden dem 77/76/1**, alle 76 R18 — miljø, ikke arbejde). `build` **216 sider**,
107 pr. sprog. `tests/koer.mjs` **ikke kørt**, jf. briefet. Server 8141 verificeret mod disken
(15 = 15, 3 = 3) og **lukket** (curl → 000, exit 7). **Selv-efterprøvning: 32 påstande, 1 fejl
fundet og rettet** — 16 linjenumre (fejlen: bredden står på `generator.css:605–606`, ikke
`:607–608`) og 16 tal genkørt med forventet værdi skrevet først. K1-målingen **gentaget**.

## Afvigelser fra briefet — fire, alle målt

1. **Rækkestregen findes ikke.** Briefet: *"Rækkestregen findes allerede … kan bare ikke ses
   (1,56:1)"*. Målt: alle 142 celler har `border-top: 0px none`. `generator.css:589–590`
   (0,1,1) slår `:604` (0,1,0). Hele K2's præmis skifter.
2. **`side.mjs` tegner enhedskontakten 107 gange, ikke 0.** Briefet målte `id=`, som er
   boksen. Etiketten står i topbaren på alle 107 danske sider siden `8bd39b3`. K3 er bygget.
3. **`maksAntal` er 3, ikke 5.** Briefets spørgsmål om 4 og 5 plader kan ikke opstå.
4. **`var(--linje)` er 70 *linjer*, men 73 forekomster / 71 uden for kommentarer.**
   Konklusionen (for mange kaldsteder til en sidebeslutning) ændrer sig ikke.

## Usikkerheder

- `.v-nul` (værdien **0**) optræder ikke i noget udvalg, jeg kunne fremkalde; dens kontrast på
  en tonet række er **antaget**. Byggesporet skal finde en nulværdi og måle den.
- En `1px`-kant måler **0,8 px** brugt bredde ved `devicePixelRatio` 1. Årsagen er ikke
  isoleret; det gælder alle kanter på siden i forvejen.
- Kodens *"~700 døde figurer pr. sprog"* (`side.mjs:1104`) og min **132** tæller ikke det
  samme. Jeg har ikke afgjort, hvilket tal der gælder for et katalog-byg.
- `--blaek3` som **streg** i stedet for tekst: 5,48:1 er målt mod `--panel`, 4,74 mod eloxgraa
  — begge over 3,0, men regnet, ikke set.

## Punkter i briefet, jeg ikke nåede

- **Acceptkriterium 5 kan ikke opfyldes samtidig med rapportkravet.** Briefet siger, at
  `git diff --name-only main...spor/samlplan` skal give **præcis** to filer, og at rapporten
  skal ligge i `fund/FUND-samlplan.md`. Med rapporten committet er der **tre**. Jeg har
  committet den, fordi et spor uden commits ikke kan genoptages; kriteriets hensigt
  (ejerskab) er ikke brudt — den tredje fil er den, briefet selv bad om.
- Alt øvrigt i briefet er dækket. K1, K2 og K3 har hver sin `##`-overskrift; SYSTEMÆNDRING
  har sin egen sektion med målt pris pr. forslag.

## Nye fælder og opdagelser

- **To spor deler ÉN browser gennem projektets playwright-MCP — inklusive den aktuelle fane.**
  Målt fire gange: mit `browser_navigate` til 8141 lykkedes, og næste `browser_evaluate` kørte
  på **8140** (et andet spors port), på `dist/da/index.html` i stedet for
  sammenligningssiden, og til sidst på **reddit.com**. En ny fane hjælper ikke: "current tab"
  er global. **Værnet, der reddede målingerne, var en URL-vagt som første linje i hvert
  `evaluate`** — uden den havde jeg rapporteret katalogsidens tal som matricens. Viewport
  hoppede også bag om ryggen på mig (1440 → 1536 → 2048), så også bredden skal kontrolleres
  i selve målingen. Skriv URL- og bredde-vagt ind i enhver browsermåling fra et spor.
- **Én utilsigtet bivirkning heraf:** ét `localStorage.setItem('quad-sammenligning', …)` blev
  skrevet på **reddit.com**s origin, fordi fanen var flyttet. Harmløst, men det er en skrivning
  uden for mit filejerskab, og den skal stå her frem for at blive fortiet.
- **`netstat` findes ikke i denne Git Bash.** Mit første forsøg på at dræbe serveren rørte
  ingenting: `netstat -ano 2>/dev/null | grep 8141` gav tom streng, som lignede "ingen server",
  mens `curl` samtidig svarede **200**. Præcis `2>/dev/null`-fælden fra `miljoefaelder.md`.
  Serveren blev dræbt med `TaskStop` på baggrundsopgavens id i stedet.
- **`.playwright-mcp/` skrives i HOVEDREPOETS mappe**, ikke i worktreen, fordi MCP-serverens
  arbejdsmappe er sessionens. Den er gitignoreret (`.gitignore:57`), og hovedrepoets
  `git status` var uændret bagefter (kun det forudbestående `f5.txt`) — men et spor, der tror,
  det skriver i sin egen mappe, skriver det ikke.
- **En død CSS-regel larmer ikke.** `generator.css:604` har set korrekt ud for enhver, der
  læste filen — også for orkestratoren, som byggede hele K2 på den. Kun `getComputedStyle`
  afslørede den. Specificitet er den stille slags fejl: begge regler er rigtige hver for sig.
- **`.saml-raekke__celle--tavs` sættes af JS på 42 af 66 celler og har 0 CSS-regler.**
  Å102's spejlbillede: dengang blev CSS'en tilbage uden markup, her er markup'en tilbage uden
  CSS. Værd at have en måling for begge retninger.
