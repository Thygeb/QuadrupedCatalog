# FUND — spor/katalog3: SELECTED-baren lever kun i bunden af skærmen

Base `a405066` · commits `e10f59a`, `619b31d`. `git diff --name-only a405066..HEAD` viser præcis
`assets/katalog.js`, `tools/skabelon/katalog.mjs`, `tests/dele/65-katalogbar.mjs` — ingen forbudt fil.

**Skill: `impeccable audit`** — kaldet fra worktreen **virkede** (fjerde datapunkt på det, CLAUDE.md
kalder svingende). Kørte ikke den fulde scan: dens `audit.md` siger *"Don't fix issues; document
them"*, og L70 siger det samme; brugte A11y-dimensionen målrettet på ARIA-navn og fokusrækkefølge og
målte det i browseren. **Fravalgt:** `fejljagt` (intet tal opførte sig uventet), `impeccable
critique`/`ui-ux-critique` (designdom, frosset), `flet` (orkestratorens), `robotdata`/`supabase*`.

**Valgt:** blokken i `tegnSaml()`, der slog `hidden` fra og satte `data-aktiv`, er væk — chippen er
låst af **to** ting: `hidden` fra skabelonen og CSS' `display:none`.
**Fravalgt:** briefets vej (kun droppe `setAttribute`) — så hvilede alt på `assets/system.css`, som
`spor/topbar` ejer og kan ændre uden at kende beslutningen. Én lås i en fremmed fil er ingen lås.
**Fravalgt, bevidst:** at rydde `samlTal`/`samlOrd` og `samlRyd`-lytteren op. `samlSkabelon` er eneste
læser af `data-saml-skabelon`, eneste bruger af i18n-nøglen `saml_taeller`; oprydningen ville gøre
nøglen forældreløs i `data/i18n/`, som jeg ikke ejer. Markeret inert i koden.

## Målinger

**Grundmålingen reproducerede briefets tre tal nøjagtigt, før jeg rørte noget → efter:** `validate.mjs`
77 filer / 0 fejl / 1 advarsel → uændret · `build.mjs` 216 sider, 1111 tal med kilde / 0 uden →
uændret · `koer.mjs` 1478 / 1 → **1498 / 1**, hvor +20 er mine. Den ene røde er `63 (c)` CRLF.

**Acceptkriterier, brief sagde → målt** (alle fem opfyldt): K1 `grep -c "setAttribute('data-aktiv'"
assets/katalog.js` 1 → **0** · K2 `grep -c 'data-saml-taeller' dist/{da,en}/index.html` 1 → **1 / 1**
· K3 `grep -c "querySelector('.saml-taeller__gaa')" assets/katalog.js` 1 → **1** · K4 `grep -c
'saml-graense' tools/skabelon/katalog.mjs` 1 → **1** · K5 `git diff --stat -- assets/system.css` →
**0 linjer ændret**. **AFVIGELSE — K5's "9" er forkert:** både `grep -c` og `grep -o … \| wc -l`
giver **7** på `main`s egen, urørte fil; tallet var forkert, før sporet begyndte.

**K6 — egen port 8231, verificeret mod disken før ét tal blev brugt** (en streng kun min udgave har: 1 på disk = 1 fra serveren, HTML og JS).
Tre robotter valgt med **rigtige klik** i gitteret, ikke ved at plante localStorage. Chippens kasse: `display:none`, **0×0** ved 1440, 390 og `/en/`.
Bjælken: **top 850 / bund 900** i et 900 px vindue (390 px: top 811, h 89); navne `A1 · A2 · A2-W`; ARIA-navn `Robotter valgt til sammenligning` /
`Robots selected for comparison`; link+ryd `Åbn sammenligningen`/`Ryd udvalget` og `Open the comparison`/`Clear the selection` — alle fyldte, 0 konsolfejl.
**Jeg har set skuddene: bundbjælken står, chiprækken i filterpladen er væk. Kontrafaktual:** samme side, samme rullehøjde, `data-aktiv` sat i
browseren → chippen kommer frem igen på **41 px** med *"3 valgt til sammenligning · Åbn sammenligningen · Ryd udvalget"*. Én attributs forskel.
**Afvisningsbeskeden virker:** fjerde klik afvist, `.saml-graense` blev `display:block`, **38 px**, `role="status"`, og udvalget forblev tre.

**K7 — `tests/dele/65-katalogbar.mjs`, 20 påstande.** Revert-bevis, fire sabotager, hver gendannet:
uændret **20/0** · `data-aktiv` sat igen **19/1** (65.1) · `.saml-taeller__gaa` døbt om **18/2**
(65.5 da+en) · hele bæreren slettet **10/10** (65.3–65.7) · `.saml-graense` fjernet **18/2** (65.12).

## Konfidens — høj kræver genkørbar kommando **plus** hvad tallet var blevet, hvis arbejdet var forkert

- **Chippen kan ikke ses — høj.** Var det forkert, gav A-skud og kontrolskud samme billede; A gav 0×0, kontrollen 41 px.
- **Bjælken urørt og virker — høj.** Var bæreren knækket, var ARIA-navn og link/ryd-tekst tomme strenge; alle fyldte i da+en.
- **Testen fælder en tilbagerulning — høj.** Var den ligegyldig, gav sabotagerne 20/0; de gav 19/1, 18/2, 10/10, 18/2.
- **CSS urørt — høj.** Var den rørt, gav `git diff --stat` > 0 linjer; den giver 0.
- **Suiten ikke forværret — høj.** 1478 + 20 = 1498, og den røde er reproduceret før mit arbejde.
- **Ingen anden flade påvirket — middel.** Kun katalogsiden er kørt i browser; sammenligningssiden er læst, ikke kørt.

## Usikkerheder

1. Om `data-saml-skabelon` bør blive: at fjerne den gør `saml_taeller` forældreløs i `spor/saml3`s fil. Lod den stå, skrev hvorfor i koden.
2. Playwright-MCP'en meldte 1 konsolfejl ved `browser_navigate`, min egen kørsel 0 på samme URL. Fandt ikke forskellen; alle K6-tal er fra min kørsel.
3. 1440 px-målingen af bjælkens dækning gav `sidsteBund` 985 i et 900 px vindue — uopnåeligt indhold eller måleartefakt? 390 px-tallet er entydigt (nedenfor).

---

## Nye fælder og opdagelser

1. **`tools/skabelon/katalog.mjs` ER én stor template literal.** Et backtick i en HTML-kommentar
   afslutter strengen og giver `SyntaxError: Unexpected identifier` — bygget døde. CLAUDE.md
   advarer om backticks i *skallen*; det her er samme fælde et lag inde, i en fil hvor det ser ud
   som almindelig prosa. Skrevet ind i filens egen kommentar, så næste forfatter ser det på stedet.
2. **En test kan måle sin egen dokumentation, og det ser ud som et gyldigt rødt resultat.** Jeg
   skrev `65.1` til at måle `setAttribute`-**kaldet** netop for at undgå det — og faldt så i
   samme fælde i `65.11`, som målte ordet `innerText` og var rød ved prøvekørslen, fordi min egen
   kommentar nævner ordet. Rettet til `.innerText`. **Lærdom: en kildekodetest på et forbudt ord
   skal måle syntaks (et kald, et ejendomsopslag), aldrig et ord** — forbud og dokumentation af
   forbuddet lever i samme fil.
3. **`textContent` vs. `innerText` var et reelt minefelt, og det gik godt ved et tilfælde.**
   Bjælken læser bærerens tekst; bæreren er nu permanent skjult. `innerText` er layout og ville
   give **tom streng** — bjælken uden linktekst og ryd-knap, og *intet andet ville fejle*. Koden
   brugte allerede `textContent`. Låst i 65.11.
4. **Skærmbilleder kan ikke skrives til worktreen via playwright-MCP'en.** Dens tilladte rod er
   `c:\Praktik\websites\udstilling` — **hovedrepoet**, som et spor ikke må skrive i. Jeg skrev
   mit eget skud-script og importerede Playwright med absolut `file://`-URL fra
   `maalevaerktoej/node_modules`, så det kunne ligge i scratchpad uden en `node_modules`-nabo.
   Værd at kende for hvert worktree-spor, der vil *se* sin egen flade.
5. **Mit sabotage-værktøj fangede en tavs no-op på første forsøg.** En `String.replace`, hvis
   mønster ikke rammer, returnerer strengen uændret og exit 0 — `sed -i`-fælden i ny forklædning.
   Guarden `if (!s.includes(fra)) exit(1)` gjorde den synlig med det samme. **Ethvert skript, der
   ændrer en fil ved mønster, skal fejle højt, når mønstret ikke rammer.**
6. **Grundmålingen reproducerede briefets tre tal nøjagtigt** (77/0/1, 216/1111, 1478/1) — værd at
   notere, fordi det gjorde enhver senere afvigelse entydigt til min.

### Fund, jeg IKKE har rettet (designfrys L70 + forbudt fil)

**Den faste bjælke dækker sidens sidste indhold, når man er rullet helt ned.** Målt ved 390 px med
tre valgt: bjælken fylder 811–900, sidste afsnit (`p.t-lille`, *"Trappetrin og nyttelast findes i
to udgaver hver."*) har bund 900 → **89 px af det sidste indhold står bag bjælken**.
`body { padding-bottom: 0px }` — intet reserverer plads. Tilstanden er **ikke ny** (bjælken har
været `position:fixed` siden 1. sep), men den vejer tungere nu, hvor bjælken er den eneste visning
af udvalget. **Rettelsen kræver `assets/system.css`, som `spor/topbar` ejer** — både et frysepunkt
og en forbudt fil. Noteret, ikke rørt.

## Punkter i briefet, jeg ikke nåede

- **Ingen.** Alle syv acceptkriterier kørt, K5's forventede tal korrigeret med måling, K6 taget i
  to sprog og to bredder.
- Serveren på 8231 er **lukket** — efterprøvet: `curl` giver `000` / ingen forbindelse.
- `tests/.tmp-koersel` og `tests/.tmp-65` er **ryddet** — efterprøvet: `fs.existsSync` = `false`.
