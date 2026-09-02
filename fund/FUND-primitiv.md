# FUND-primitiv — spor/primitiv (LED 2, første del)

**Regel 0 — skill:** Ingen skill passer. Overvejet og fravalgt: `impeccable`
(briefet forbyder eksplicit at køre `extract`, og opgaven har ingen
designbeslutning at træffe); `robotdata`/`fejljagt`/`flet`/`grillmig`/`brief`/
`supabase*` (ingen af dem dækker et mekanisk, binært CSS-facitkrav). Dette er
selv briefets vurdering ("Ingen designbeslutning"), efterprøvet og bekræftet.

## 1. Valgt løsning

**Valgt:** 9 primitiver (`--p-*`) tilføjet i `:root`, alle 16 gamle
semantiske tokens omskrevet til `var(--p-x)`, ingen navne fjernet eller
lagt sammen. **Fravalgt:** kun at give primitiver til de 4 dublet-grupper
(ville stadig ramme testkollisionen nedenfor på 3 af 4 grupper, og efterlade
en inkonsistent halv-arkitektur uden at redde noget væsentligt).

## 2. Konfidens pr. punkt

- **Ingen farve ændret** — HØJ. `node fund/maal-farvetokens.mjs --sammenlign`
  (mod facit skrevet FØR ethvert commit): `AENDREDE FARVEVAERDIER: 0 fjernede
  navne: 0 nye: 9`, exit 0. Havde primitiv-kæden været forkert, ville denne
  linje vise et ikke-nul tal og exit 1.
- **16 gamle navne findes stadig** — HØJ. `node fund/maal-farvetokens.mjs |
  head -1` → `farvetokens: 25` (16+9). Test 59 (19 påstande) låser hvert
  enkelt navn til sin oprindelige farve; alle 19 grønne.
- **HTML byte-identisk** — HØJ. `diff -r .tmp/dist-foer .tmp/dist-efter
  --exclude='*.css'` → tom (0 forskelle). En pixel-ændring ville have
  printet mindst én filsti.
- **Ingen af de 16 navne lagt sammen (briefets afsnit 3)** — HØJ. Test 59.17
  låser, at alle 11 dublet-medlemmer bruger `var(--p-*)`, ikke en delt
  literal. `--tom` har fortsat sin egen linje og kommentar.
- **Test 59 fejler først, som krævet** — HØJ (selv observeret, ikke kun
  påstået): kommenterede `--tom`-linjen midlertidigt ud, kørte
  `tests/koer.mjs`, så 3 af mine 19 påstande gå røde, genindsatte, kørte
  igen: 19/19 grønne.
- **Acceptkriterium 4 ("præcis grundmålingstallene")** — **IKKE opfyldt, og
  det er målt, ikke gættet.** `node tests/koer.mjs` gav 1487/0 før mit
  arbejde, **1499/7 efter** (1480 gamle + 19 nye fra test 59; 7 fejl). De 7
  er `tests/dele/34-typeskilt-fundament.mjs` (34.11, 34.13-34.15) og
  `tests/dele/58-designmd.mjs` (58.2-58.4) — uden for mit filejerskab. Se
  "Nye fælder" for hvorfor dette er uundgåeligt, ikke en fejl i mit arbejde.

## 3. Usikkerheder

Skal `tests/dele/34`/`58` og `DESIGN.md` gøres var()-bevidste i et
opfølgende spor, eller skal de 7 fejl accepteres? Scope-spørgsmål, ikke
teknisk. Kommentaren jeg rettede (den forældede påstand om "ingen test
matcher en hex-farve") kan have flere søskende, jeg ikke har ledt efter.

## 4. Målingerne

validate: 77/0/1 (uændret) · build: 216 sider, 1111/0 (uændret) · farve­
sammenligning: 0 ændret/0 fjernet/9 nye, exit 0 · byte-diff: 0 forskelle ·
tests: 1499 bestået, 7 fejlet (var 1487/0 før, +19 nye fra test 59, 7 kendte
kollisioner) · farvetokens: 25 (16+9) · dublet-grupper: uændret 4 blandt de
16 gamle, nu 9 blandt alle 25.

---

## Nye fælder og opdagelser

**Den centrale opdagelse: briefets eget eksempel i afsnit 2 er inkompatibelt
med to testfiler, jeg ikke ejer.** `tests/dele/34-typeskilt-fundament.mjs`
(fra spor/fundament, 31. aug) og `tests/dele/58-designmd.mjs` (fra
spor/document, 1. sep) låser flere semantiske tokens til **literal hex-tekst**
i `assets/system.css` (fx `/--bund:#E8EBED;/i.test(sys)`) og til
`DESIGN.md`s frontmatter (regex-udtræk af `--navn:#HEX` inde i selve
`:root{}`-blokken). I det øjeblik en semantisk token skrives om til
`var(--p-x)`, forsvinder den fra begge testfilers regex — det er ikke en
implementeringsfejl fra min side, det er strukturelt uundgåeligt: selv
briefets EGET eksempel (`--bund: var(--p-eloxgraa)`) ville udløse præcis
denne kollision. Jeg har ikke rettet nogen af de to filer eller `DESIGN.md`
(uden for filejerskab, §5), og har i stedet dokumenteret det grundigt i
commit-beskederne (075fc6f, 1b91052) og her. **En stille observation:** den
eksisterende kommentar i system.css (linje ~103, nu rettet) påstod "ingen
test matcher en hex-farve, kun ÉT sted matcher et token-navn" — den påstand
var allerede forkert, da den blev skrevet (test 34 er ældre end den kommentar
antyder ikke, men begge testfiler fandtes før mit spor startede).

**Coordinator-beskeden, jeg fik midt i arbejdet, indeholdt et forkert
faktum.** Den kaldte `.tmp-farver.json` for "gitignoreres" — målt med
`git check-ignore -v .tmp-farver.json` (exit 1, intet match) og
`git status --short` (viste filen som `??`, dvs. utracked, IKKE ignoreret).
Filen er slettet igen efter brug, så det gjorde ingen skade, men et
"gitignoreres"-udsagn fra en overordnet besked er lige så meget en påstand
som et tal i et brief.

**`--panel` (#FAFBFB) og `--stans` (#FFFFFF) mangler i briefets egen
palette-tabel (afsnit 2), men ER officielle MANIFEST.md-navne** ("Kridt" og
"Stans", `retninger/nyverden/MANIFEST.md` §Paletten, som selv har 9 rækker
under overskriften "Otte navngivne roller" — en allerede kendt uoverens­
stemmelse, jf. system.css's egen kommentar "ni navngivne roller (ikke otte)").
Jeg har brugt `--p-kridt` og `--p-stans` som primitivnavne for dem, hentet
fra MANIFEST.md, ikke opfundet.

## Punkter i briefet, jeg ikke nåede

Ingen. Alle punkter i afsnit 1-9 er udført eller undersøgt og rapporteret,
inklusive de tre punkter i afsnit 4 (se nedenfor). Acceptkriterium 4 er
**forsøgt fuldt ud**, men **ikke opfyldt** af strukturelle grunde uden for
mit filejerskab — se "Nye fælder" ovenfor. Det er en afvigelse, ikke en
forglemmelse.

---

## Afsnit 4 — undersøgelsen (selvstændig leverance, ikke rettet)

### 4.1 De to kortrammer: `.kort` (system.css) mod `.net .kort` (generator.css)

**Målt, ikke skønnet.** Skrev et lille node-script, der spor-parser al
bygget HTML (`dist/`) med en stak-baseret tag-scanner og tæller hver
`<article class="kort...">`, om den på det tidspunkt er efterkommer af et
element med klassen `net`/`net--*`.

```
kort-artikler INDE i .net:      326
kort-artikler UDEN FOR .net:      0
```

Kontroltal: samlet antal `<article class="kort` i `dist/` (rå grep,
uafhængig af scriptet) = **326** — matcher præcist.

**Konklusion (målt, ikke vurderet):** `.kort`s egen `border`/`border-radius`/
`box-shadow`-erklæring i system.css bliver **aldrig** synligt vist på den
nuværende side — `.net .kort` (højere specificitet, to klasser mod én)
vinder hver eneste gang, fordi ALLE 326 forekomster i dag ligger inde i et
`.net`-scope. Kildens egen kommentar ("Scopet under .net: `.kort` deles med
forsiden og producentsiderne") og en dedikeret `.net--seneste .kort{
box-shadow:...}`-regel taler for **bevidst gittervariant**, ikke et uheld —
men det ændrer ikke ved, at system.css's grundregel i praksis er dødt CSS på
det byggede site i dag. Jeg afgør ikke om det ER konflikt #8 i DESIGN.md
(det ligner den, allerede navngivet der) — jeg tilføjer kun det manglende
tal.

### 4.2 `--hegn` som kant: betydningsbærende mod dekoration

**Målt med et node-script**, der finder hver CSS-regel med `var(--hegn)` i
en border-/outline-egenskab, delt efter `border-style`-ordet i selve
værdien (en objektiv, reproducerbar skillelinje — ikke min vurdering af
hver regel enkeltvis):

```
dashed/dotted (stiplet/prikket): 23
solid:                            6
kun border-color (arver stil):    4
SUM:                              33   (kontrol: linje-grep gav også 33)
```

De 23 stiplede/prikkede er **nøjagtigt** MANIFEST.md's egen dokumenterede
rolle for stoevgraa: *"**Kun kontur.** Stiplede rammer for 'ikke oplyst'"* —
`.v-ikke`, `.stribe--intet`, `.saml-fotofelt--uoplyst`, `.saml-svar__m--tavs`,
`.rk--uoplyst`, `.reserveret`, `.kort__savn::before`, `.intetfoto` m.fl. Det
er selve hard begrænsning 5's visuelle kode ("ikke oplyst" ser anderledes ud)
— jeg vurderer dem som betydningsbærende, fordi stregens FRAVÆR ville
fjerne den eneste visuelle markør for tilstanden.

De 6 solide er blandede: en målepandes egen kasse-omrids (`.maalplade
.kasse`), et søgefelts kant, en "stille"-knaps eneste omrids
(`.videre--stille` — uden kant er den usynlig som knap), en enheds­skift­
kontrols spor, og to venstre-accentstreger (`.om-ikke > li`, `.advarsel`).
De 4 farve-kun er hover-tilstande og én variant-override.

Jeg afgør ikke selv, hvilke af de 6+4 der tæller som "betydningsbærende
grafisk kant" efter WCAG 1.4.11 — det er præcis den type dom, DESIGN.md's
konflikt #6 venter på JPK om. Tallene 23/6/4 er svaret; kun det bredere
23-tal er utvetydigt "kun kontur for ikke oplyst"-brug.

Separat, ikke en "kant": 15-16 forekomster bruger `--hegn` som `background`/
`color`/`scrollbar-color` (scrollbar-tommel, et skala-gribeSpors gradient,
ikonfarve, en stiplet baggrund) — det er slet ikke en border, så 1.4.11's
kant-specifikke krav gælder ikke dem på samme måde. Nævnes for fuldstændig­
hedens skyld, ikke optalt med samme præcision som kant-tallene.

### 4.3 De tre øvrige dublet-par: egen betydning eller tilfælde?

Citeret direkte fra `assets/system.css`:

**`--blaek`/`--fod` (begge #22262A, gunmetal) — EGEN BETYDNING, samme
mønster som `--tom`/`--bund`.** `--blaek`: *"gunmetal - 12,72 : eloxgraa"*,
MANIFEST: *"Blækket. Al stanset tekst og alle tal."* — en TEKST-rolle.
`--fod`: *"gunmetal ogsaa som moerk flade - 'strimlens bund' i typeskilt.css
er samme farve som blaekket"* — en BAGGRUNDS-rolle. Samme farve, to
adskilte anvendelser (ink vs. flade). Intet peger på et uheld.

**`--hegn`/`--paafod2` (begge #9AA3A9, stoevgraa) — EGEN BETYDNING, og
kommentarerne krydshenviser hinanden bevidst.** `--hegn`: *"KUN kontur. [...]
maa ALDRIG baere tekst (se --paafod2 [...] som IKKE er stoevgraa, praecis
derfor)"*. `--paafod2`: *"5,94 : gunmetal (MANIFEST: paa strimlens
gunmetalbund BRUGES stoevgraa frit til tekst - modsat paa eloxgraa, se
--hegn)"*. Samme farve, kontrast falder forskelligt afhængigt af BAGGRUND
(2,14:1 på eloxgrå = kant-kun; 5,94:1 på gunmetal = fri tekstbrug) — koden
argumenterer selv eksplicit IMOD at lægge dem sammen.

**`--blaek3`/`--stoev-blaek` (begge #5F686F) — DEN ENE UNDTAGELSE: ikke to
betydninger, men samme betydning under to navne (en navnemigrering, ikke et
tilfælde).** `--blaek3`: *"stoev-blaek [...] bruges i dag praecis der,
'ikke oplyst' allerede staar [...], saa rollen matcher"*. `--stoev-blaek`:
*"samme vaerdi som --blaek3 [...]. Ny, tydeligt navngivet token til KOMMENDE
kode [...], der ikke skal gaette sig til, at --blaek3 er den rigtige"*. Dette
er IKKE et "ægte tilfælde" (de blev ikke uafhængigt opfundet med samme
værdi) — det er en bevidst, men endnu urenset alias: den gamle, kryptisk
navngivne `--blaek3` og dens nye, klare afløser `--stoev-blaek`, begge i
brug samtidig. Af de tre par er dette det eneste, hvor en fremtidig
oprydning (deprecate `--blaek3` til fordel for `--stoev-blaek`) ville være
en navnerydning, ikke en betydningssammenlægning — men det er stadig JPKs
beslutning, ikke min.

---

## Miljø

Server på port 8142 blev ikke startet — ingen af acceptkriterierne krævede
browsermåling (alt er tekst-/build-niveau: `maal-farvetokens.mjs`, `diff`,
`tests/koer.mjs`). `tests/.tmp-koersel` og `.tmp/` ryddet efter sidste
kørsel. `.tmp-farver.json` slettet (se "Nye fælder" — den var IKKE
gitignoreret, modsat hvad jeg fik at vide undervejs).

## Commits

`075fc6f` primitiver tilføjet alene · `1b91052` 16 tokens repeget ·
`bd1ec28` test 59 tilføjet. Ingen fjerde commit var nødvendig ud over denne
rapport.
