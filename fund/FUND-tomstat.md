# FUND — spor/tomstat (R8: "ikke oplyst" er usynlig på `--bund`)

*(Under arbejde. Denne commit bærer KUN grundmålingen, taget før én linje blev ændret.)*

## Grundmåling — kørt i `../udstilling-wt-tomstat` på `29ada1b`, 4. sep 2026

| Kommando | Briefets tal | Mit tal | Enig? |
|---|---|---|---|
| `node fund/maal-farvetokens.mjs` | 26 tokens, `#E8EBED` med 6 navne | **26**, `#E8EBED` med **6** | ja |
| `grep -c "var(--tom)" assets/system.css assets/generator.css` | 6 og 1 | **6** og **1** | ja |
| `grep -c "var(--hegn)" assets/system.css assets/generator.css` | 31 og 11 | **31** og **11** | ja |
| `grep -n "^\.v-ikke" assets/system.css` | 694 og 697 | **694** og **697** | ja |
| `node tools/build.mjs` → `find dist -name "*.html" \| wc -l` | (skulle måles) | **216 sider** | — |

De seks navne på `#E8EBED`: `--accent-ro` `--bund` `--p-eloxgraa` `--paafod` `--panel-ro` `--tom`.

**Bygget fejlede først med 76 fejl** — alle R18 "filen findes ikke" på
`assets/fotos/fabrikant/*`. Det er den kendte gitignore-fælde, ikke mit arbejde:
mappen blev kopieret ind fra hovedrepoet (610 filer, 60 MB, kun læst derfra),
hvorefter bygget gav **216 sider, 1111 tal med kilde, 0 uden**.

`.tmp-farver.json` er skrevet med `--skriv` som før-billede. **Den er IKKE
gitignoreret** — den bliver ikke committet og slettes til sidst.
