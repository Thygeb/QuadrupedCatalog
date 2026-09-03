# FUND-sidefod — sidefoden, der ikke fandtes

## Før og efter

| | Før (main `1437838`) | Efter |
|---|---|---|
| `<footer` i `dist/` | **0 af 216 sider** | *(måles efter bygget)* |
| Hvad foden bar | **intet — der er ingen fod** | |
| Fodens højde | **0 px** | |

*(Udfyldes ved trin 3.)*

## Grundmåling, mine egne tal

Kørt i worktreen som første kommandoer, efter at `assets/fotos/fabrikant/`
(610 filer) var kopieret ind fra hovedrepoet:

- `node tools/validate.mjs` → **77 filer · 0 fejl · 1 advarsel** (= briefets tal)
- `node tools/build.mjs` → **216 sider · 1111 tal med kilde · 0 uden** (= briefets tal)
- `find dist -name "*.html" | wc -l` → **216** (kontrol: samme som byggets eget tal)
- `grep -rl "<footer" dist --include=*.html | wc -l` → **0**
  (kontrol skrevet før aflæsning: *"216 hvis foden er fælles"*)

## Briefets påstand om en eksisterende fod er AFKRÆFTET

Briefet og Å54 citerer, at *"footeren trykker 'Ingen tredjepartskald. Ingen
cookies.' på hver side"*. Målt:

- `grep -rl "tredjepartskald" dist --include=*.html` → **0**
- `git log --all -S'tredjepartskald' -- data/i18n/ tools/skabelon/` → **0 commits**

Strengen har **aldrig** stået i en bygget side. Den findes ét sted i repoet:
som **CSS-kommentar** i `assets/system.css:16`. Det er præcis briefets egen
fælde — `assets/*.css` kopieres råt til `dist/`, så en CSS-kommentar tæller
med i ethvert grep mod det byggede site.

## Foden fandtes, og den blev fjernet med vilje for én dag siden

`git log -S'class="fod"' -- tools/skabelon/side.mjs` → `a6c8681`
*"Punkt 7: hele `<footer class="fod">` vaek"*, flettet som `8ab82f6`
(`spor/uifix`, 2. sep 2026, BRIEF-uifix.md punkt 7). Den fjernede markup bar
tre linjer: `T.ingen_forhandler`, `T.taethed_forklaring` og
`T.udgiver` · sprogskifte-link. De tre nøgler blev slettet fra begge
sprogfiler i samme commit.

**JPK's opgave i dag omgør altså hans egen beslutning fra i går.** Det er
hans at omgøre, og han har gjort det udtrykkeligt (*"Hele siden mangler en
sidefod"*), så jeg bygger — men det står her, fordi ingen skal tro, at foden
blev glemt.
