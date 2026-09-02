# BRIEF — spor/primitiv (første del af LED 2)

**Model: Sonnet.** Rent mekanisk arbejde med et binært facit: et script siger,
om nogen farve har ændret sig. Ingen designbeslutning — se afsnit 3, som
udtrykkeligt forbyder dem.

**Arbejdsmappe:** `C:\Praktik\websites\udstilling-wt-primitiv`
**Gren:** `spor/primitiv`
**Serverport: 8142. Testnummer: 59** (din testfil: `tests/dele/59-farvetokens.mjs`)

**Rør ALDRIG** `c:\Praktik\websites\salg` eller `c:\Praktik\website`.

---

## Regel 0 — skill-vurdering

Skriv, hvilken skill du valgte, og hvilke du gik forbi med begrundelse.
**Bemærk:** dette er første del af `impeccable extract`s arbejde, men du skal
IKKE køre den kommando — den vil også ville afgøre konflikter, og det er
forbudt her. `"Ingen skill passer"` er et gyldigt svar, hvis du når dertil,
men det skal skrives.

---

## 1. Grundmåling — din FØRSTE kommando

```bash
node tools/build.mjs            # UDEN --ud. Se fælden nedenfor.
node tools/validate.mjs
node tests/koer.mjs
node fund/maal-farvetokens.mjs
```

**FÆLDE, fundet af det forrige spor og rettet her:** byg **uden** `--ud=`.
Bygger du til en anden mappe, står `dist/` tom, og **12 tests plus
`fund/maal-doede-klasser.mjs` fejler på hårdkodede `dist/`-stier.** Det ligner
dit arbejde og er miljøet.

**Mine tal, målt umiddelbart før afsendelse på `5ba2356`:**

| Måling | Værdi |
|---|---|
| validate | 77 filer · 0 fejl · 1 advarsel |
| build | 216 sider · 1111 tal med kilde, 0 uden |
| tests | 1487 bestået · 0 fejlet |
| farvetokens | 16, heraf 4 værdier med flere navne |

**Afviger dine tal, så RAPPORTÉR afvigelsen.** Det forrige spor rettede tre af
mine tal og fandt en fejl i mit målescript. Det var dagens mest værdifulde
leverance.

---

## 2. Opgaven: indfør et primitiv-lag

I dag peger **16 farvetokens direkte på hver sin hexværdi**, og fire værdier
har flere navne:

```
#E8EBED  <- 5 navne: --accent-ro --bund --paafod --panel-ro --tom
#22262A  <- 2 navne: --blaek --fod
#5F686F  <- 2 navne: --blaek3 --stoev-blaek
#9AA3A9  <- 2 navne: --hegn --paafod2
```

**Opgaven er at gøre den deling EKSPLICIT, ikke at fjerne den.** Indfør et lag
af primitiver, og lad de nuværende tokens pege på dem:

```css
/* primitiver: farven, som den er */
--p-eloxgraa: #E8EBED;
--p-gunmetal: #22262A;
/* semantik: hvad farven BETYDER. Navnene er uændrede. */
--bund: var(--p-eloxgraa);
--tom:  var(--p-eloxgraa);
```

**Primitivernes navne skal du ikke opfinde. De står allerede i koden**, i
kommentarerne ved hver token i `assets/system.css`:

| Værdi | Navn i kommentaren |
|---|---|
| `#E8EBED` | eloxgraa |
| `#22262A` | gunmetal |
| `#5F686F` | stoev-blaek |
| `#9AA3A9` | stoevgraa |
| `#F2C400` | afmaerkningsgul |
| `#C6CCD1` | rille |
| `#545C63` | blaek-2 |

Brug dem. Præfikset må du vælge (`--p-` er blot et forslag); vælg ét og brug
det konsekvent. **Efterprøv selv, at tabellen passer** — den er læst af mig ud
af kommentarerne og er en påstand.

---

## 3. FORBUDT: at lægge to semantiske navne sammen

**Dette er briefets vigtigste punkt, og det er grunden til, at opgaven ikke er
"ryd op i dubletterne".**

De fem navne på `#E8EBED` er ikke dubletter ved et uheld. Hvert har sin
betydning, og **`--tom` er fyldet bag "ikke oplyst"** — altså projektets
**hårde begrænsning 5** gjort synlig (`.v-ikke` og `.stribe--intet`, begge med
stiplet kant). Slår du `--tom` sammen med `--bund`, er siden pixelidentisk i
dag, og i morgen kan ingen ændre fyldet bag et manglende tal uden at ændre
hele sidens bundfarve.

**Derfor:** alle 16 nuværende tokennavne skal stadig findes bagefter, med
uændret betydning. Du tilføjer et lag under dem. Du fjerner intet.

**Og du afgør ingen konflikt.** Otte andre konflikter står i `DESIGN.md`s
`## Konflikter` og venter på JPK. Rør ingen af dem: ikke knapklasserne, ikke
billedrammens 16:10 mod 4:3, ikke radius, ikke accentfarvens brug, ikke
skriftvalget. Ser du en, du mener er ny, så **skriv den i rapporten** — det er
en leverance, ikke en opgave.

---

## 4. Undersøgelsesdelen — rapportér, ret ikke

Tre punkter er endnu ikke klassificeret som konflikt eller ej. **Undersøg dem
og skriv hvad du finder. Ret intet.**

1. **De to kortrammer.** `.kort` i `system.css` sætter kant, radius og skygge;
   `.net .kort` i `generator.css` nulstiller alle tre. Er det en fejl, eller er
   det en bevidst grundregel plus en gittervariant? Min egen grovmåling tyder
   på, at `.kort` bruges både inde i og uden for `.net`, men den er grov.
   **Mål det ordentligt og skriv tallet.**
2. **`--hegn` som kant.** Kommentaren i koden siger selv `2,14 : eloxgraa`.
   WCAG 1.4.11 kræver 3,0 for en betydningsbærende grafisk kant. Hvor bruges
   `--hegn` som *betydningsbærende* kant, og hvor er den ren dekoration?
   Antallet af hvert er svaret, ikke en vurdering.
3. **De tre øvrige dubletpar** (`--blaek`/`--fod`, `--blaek3`/`--stoev-blaek`,
   `--hegn`/`--paafod2`). Har de hver især en egen betydning som `--tom`, eller
   er mindst ét par en ægte tilfældighed? Citér kommentarerne.

---

## 5. Filejerskab

**Du ejer:** `assets/system.css` · `assets/generator.css` ·
`tests/dele/59-farvetokens.mjs` (ny) · `fund/FUND-primitiv.md` (din rapport).

**Du må ikke ændre** skabeloner, data, i18n, `DESIGN.md` eller noget i
`fund/` ud over din egen rapport. **Ingen andre spor kører.**

---

## 6. Acceptkriterier

**1. Ingen farve har ændret sig. Dette er hovedkriteriet.**
```bash
node fund/maal-farvetokens.mjs --skriv        # FØR du ændrer noget
# ... dit arbejde ...
node fund/maal-farvetokens.mjs --sammenlign
```
Måleren følger `var()`-kæder rekursivt, så et primitiv-lag regnes igennem.
**Færdig, når den skriver `AENDREDE FARVEVAERDIER: 0   fjernede navne: 0`**
og afslutter med exit 0. Nye navne er tilladt — det er primitiverne.

Kontrol, så du ved, at måleren virker: kør `--skriv` og straks `--sammenlign`
uden at ændre noget. Den skal give 0/0/0. Gør den ikke det, er måleren i
stykker, og så rapporterer du det i stedet for at arbejde videre.

**2. Alle 16 semantiske navne findes stadig.**
```bash
node fund/maal-farvetokens.mjs | head -1
```
Giver i dag `farvetokens: 16`. **Færdig, når tallet er 16 + antallet af
primitiver, du tilføjede** — og ingen af de 16 gamle navne er væk. Kriterium 1
fanger det også, men skriv tallet i rapporten.

**3. Den byggede HTML er byte-identisk.**
```bash
node tools/build.mjs --ud=.tmp/dist-foer     # kør FØR arbejdet
node tools/build.mjs --ud=.tmp/dist-efter    # kør EFTER
diff -r .tmp/dist-foer .tmp/dist-efter --exclude='*.css'
```
**Færdig, når der ingen forskelle er.** Du rører kun CSS.

**4. Siden bygger og tester uændret.** validate, build og tests skal give
præcis dine grundmålingstal, plus din nye tests assertions.

**5. Din test låser resultatet.**
`tests/dele/59-farvetokens.mjs` skal fejle, hvis et semantisk navn forsvinder,
eller hvis en token holder op med at løse op til sin farve. **Se den fejle
først, og skriv i rapporten at du gjorde det.** En test, der aldrig har været
rød, beviser ingenting.

---

## 7. Commit undervejs

Ét commit pr. sammenhængende del, og det er en **skrive**-grænse: skriv KUN
primitiverne, mål, commit — og først DEREFTER omskrivningen af de semantiske
tokens. Foreslået: **(1)** primitiv-blokken tilføjet, intet andet ·
**(2)** de 16 tokens peger på primitiver · **(3)** testen ·
**(4)** rapporten med undersøgelsesdelen.

**Commit-beskeder med backticks, `$` eller anførselstegn skrives til en fil og
committes med `git commit -F <fil>`.**

---

## 8. Miljøfælder

- **`node` er ikke på PATH i Git Bash:** `/c/Program\ Files/nodejs/node.exe`
- **Byg UDEN `--ud=`** mindst én gang, ellers står `dist/` tom og 12 tests fejler.
- **`sed -i`, der ikke matcher, gør intet — tavst, exit 0.** Brug Edit-værktøjet.
- **UTF-8 UDEN BOM.** Stilarkene er fulde af danske kommentarer med tankestreger.
- **Egen serverport 8142**, aldrig 8080. Verificér serveren mod disken, før et
  måletal bruges. **Luk den bagefter og skriv i rapporten at du gjorde det.**
- **Et `grep` med en konklusion skal have en kontrol:** skriv det forventede
  tal, FØR du læser det. Jeg greppede selv efter palettenavnene i CLAUDE.md og
  fik 0, fordi filen bruger `å` og koden bruger `aa`.
- **Ryd `tests/.tmp-koersel` mellem testrunder.** Den vokser ~2,5 GB, og disken
  har omkring 15 GB fri.

---

## 9. Rapporten — `fund/FUND-primitiv.md`, HØJST 60 linjer

1. Valgt løsning + fravalgt alternativ, én linje hver.
2. **Konfidens pr. punkt.** høj = målt med en kommando, orkestratoren kan
   genkøre den, PLUS én linje om hvad tallet ville have været, hvis arbejdet
   var forkert · middel = efterprøvet indirekte · lav = ikke efterprøvet.
   **Høj uden genkørbar kommando nedskrives til lav.**
3. Usikkerheder.
4. Målingerne som tal.

**Uden for de 60 linjer, obligatorisk:** *"Nye fælder og opdagelser"* ·
*"Punkter i briefet, jeg ikke nåede"* · **og afsnit 4's undersøgelse**, som er
en selvstændig leverance og ikke tæller med i loftet.

---

## 10. Briefets fakta er påstande

Tallene **16 tokens**, **4 dubletgrupper**, **5 navne på `#E8EBED`** og
palettenavnetabellen i afsnit 2 er målt af mig 2. sep 2026. Måler du andet, så
skriv det. Orkestratoren kontrolleres ellers af ingen.
