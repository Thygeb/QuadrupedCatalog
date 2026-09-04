# FUND — spor/prodtabel (R7), grundmåling

**Status: GRUNDMÅLING. Ingen CSS ændret endnu.** Denne commit findes, så næste læser
ved, hvad udgangspunktet var, hvis sporet dør.

Målt 4. sep 2026 på `8eb117f` (forgrenet fra `5e6eb6f`), egen worktree, egen server
på port **8123**, verificeret mod disken:
`curl -s http://localhost:8123/generator.css | md5sum` = `fd55838a…` =
`md5sum < dist/generator.css`. Samme sum, så serveren er min egen.

## Kildemålinger (kommando først)

| Kommando | Forventet | Målt |
|---|---|---|
| `grep -c "prod-tabel-wrap::after" assets/generator.css` | 0 | **0** ✓ |
| `grep -nE "width: *(20ch\|12ch)" assets/generator.css` | 2047, 2051, 2087 | **2047, 2051, 2060, 2087** — briefet manglede 2060 (kommentarlinje, `width:12ch}` uden mellemrum) |
| `grep -cE "font-size: *[78]px" assets/generator.css` | 0 | **0** ✓ (R9 bekræftet lukket) |
| `node tools/build.mjs` | grønt | **77 filer · 0 fejl · 1 advarsel · 216 sider** (efter at gitignorerede `assets/fotos/fabrikant/` blev kopieret ind — 610 filer; uden dem 76 fejl, som er miljø og ikke arbejde) |

## Browsermåling af `.prod-tabel-wrap` — før

`node prodtabel-maal.mjs http://localhost:8123/<sprog>/producenter/ <bredde>`

| Sprog | Bredde | clientWidth | scrollWidth | Skjult |
|---|---|---|---|---|
| da | 390 | 358 | 620 | **262** |
| en | 390 | 358 | 620 | **262** |
| da | 1440 | 1352 | 1352 | 0 |
| en | 1440 | 1352 | 1352 | 0 |

**Afviger fra briefet:** briefet siger clientWidth 343 og skjult 277. Jeg måler 358
og 262 — differencen er præcis 15 px, bredden af en klassisk rullebjælke.
`scrollWidth` er identisk 620 i begge målinger, så vi måler det samme fænomen;
kun det synlige felt er talt forskelligt.

**Værre end briefet påstod:** briefet siger *"LAND er klippet midt i ordet"*. Målt
ved 390 px starter LAND-kolonnen ved x = 434,3 (da) / 408,5 (en), og fladens højre
kant er 374. **LAND er ikke klippet — den er helt usynlig, ligesom ANTAL.** Set med
egne øjne på skærmbillede ved 390 px: kun kolonnen PRODUCENT er på skærmen.

## Kolonnebredder før (px)

| Kolonne (da / en) | 390 px | 1440 px |
|---|---|---|
| Producent / Manufacturer | 418,3 / 392,5 | 237,1 |
| Land / Country | 126,6 / 157,0 — **uden for skærmen** | 174,3 |
| Antal / Count | 75,1 / 70,5 — **uden for skærmen** | 104,6 |
| Modeller / Models | `display:none` | 836,0 |

## `ch` målt i px (briefets spørgsmål 1)

`ch` = bredden af tegnet `0` i elementets egen skrift. Målt i browseren, ens ved
390 og 1440 og ens på begge sprog:

- `thead th` (12,5 px): **1ch = 7,4 px** → `20ch` = **148,0 px**, `12ch` = **88,8 px**
- `tbody td` (15 px): **1ch = 8,6 px** → `12ch` = **103,2 px**

**Fund:** `12ch` betyder to forskellige ting i samme kolonne — 88,8 px på
overskriften og 103,2 px på cellen — fordi `th` og `td` har forskellig skriftgrad.
Ingen af de to tal er den faktiske kolonnebredde ved 1440 (174,3 og 104,6):
`table-layout: auto` fordeler den overskydende plads, så `width` kun virker som et
gulv, ikke som et mål.

## Datatilstande i ANTAL og LAND (hård begrænsning 5)

`grep -o '<td class="figur">[^<]*</td>' dist/da/producenter/index.html | wc -l` = **25**,
tomme = **0**, `>0<` = **0**. Alle 25 producenter har både land og antal i dag, så
`.v-ikke`/`.v-nul` optræder ikke på fladen nu. Skabelonen KAN producere dem
(`producent.mjs` kalder `H.tilstand('ikke_oplyst')` for manglende land), så
kolonnebredden skal kunne bære `<span class="v v-ikke"><i class="mrk"></i>Ikke
oplyst</span>` uden at klippe mærket.
