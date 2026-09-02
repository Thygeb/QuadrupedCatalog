# BRIEF — spor/topbar: enhedskontakten viser begge enheder, DA/EN fjernes

**Model:** Opus (L45 — leverancen dømmes med øjne).
**Skærm:** topbaren. Den står på **214 af 215 byggede sider**, så dette spor rører alle skærme
på én gang. Det er derfor det eneste af de tre kodespor, der ejer `assets/system.css`.
**Worktree:** `C:/Praktik/websites/udstilling-wt-topbar` · **gren:** `spor/topbar` · **base:** `a405066`.
**Egen serverport: 8233.** Aldrig 8080.

## Punkt 4 — enhedskontakten skal vise BEGGE enheder

JPK, ordret: *"Unit-knappen skal vise både metric og imperial som der toggles mellem."*

**Problemet med den nuværende:** kontakten viser én etiket ad gangen — på skærmbilledet
`IMPERIAL UNITS` med kontakten slukket. Det er tvetydigt: er `IMPERIAL` tilstanden eller målet?
Det kan man ikke se, og det er hele grunden til, at JPK beder om ændringen.

**Ønsket resultat:** begge etiketter står samtidig med kontakten imellem eller ved siden af, så
man kan se, hvad man skifter **fra** og **til**, og hvilken der er aktiv nu.

**Markuppen udsender allerede begge** — `tools/skabelon/side.mjs:2100`:

```
<span class="enhedsskift__ord enhedsvis enhedsvis--metrisk">Metriske enheder</span>
<span class="enhedsskift__ord enhedsvis enhedsvis--imperial">Imperiale enheder</span>
```

*(nøglerne hedder `enhed_skift_etiket` = "Imperiale enheder" og `enhed_skift_etiket_metrisk` =
"Metriske enheder" — læs dem, navnene og indholdet er byttet om i forhold til, hvad man
forventer.)*

**Hvorfor topbaren ikke skifter etiket i dag — den defekt, du overtager:** reglerne
`.enhedsvis--metrisk{display:none}` / `.enhedsvis--imperial{display:contents}` findes **kun**
under `.typeskilt .enhedsskift__boks:checked ~ *` (`system.css:1810-1811`) og under
`.sammenligning-app ... ~ *` (2538-2539) — de to **skjulte** in-page-instanser. Topbarens eget
`body:has(...)`-blok (2344-2347) styrer kun farve, spor og knop, aldrig teksten.

**Det gør din opgave lettere, ikke sværere:** når begge etiketter skal ses samtidig, skal du
**ikke** tilføje de manglende `display:none`-regler. Du skal i stedet sørge for, at ingen af
dem skjules i topbaren, og at den **aktive** er markeret visuelt.

**Du skal ikke røre de to in-page-instanser** (`.robotside.typeskilt` og `.sammenligning-app`).
`system.css:2338-2339` skjuler dem allerede, når topbaren bærer kontakten. Ændrer du deres
regler, ændrer du en flade, du ikke er sendt til.

**Skiftet er ren CSS og virker uden JavaScript (P0), og det må det blive ved med.** Mekanikken
er `.enhedsskift__boks:checked ~ *` — `~` rammer **kun senere søskende** til afkrydsningsfeltet.
Bryder du den betingelse, holder skiftet op med at virke uden JS, og **ingen test fanger det i
dag**. Det er L75's egen advarsel; efterprøv med JavaScript slået fra, og skriv resultatet.

**Ingen nye i18n-nøgler.** De to eksisterende siger allerede præcis det, der skal stå.
`data/i18n/` ejes af `spor/saml3` — rør den ikke.

## Punkt 5 — DA/EN skal væk fra topbaren

JPK, ordret: *"Desuden skal DA/ENG knappen væk."* Bekræftet i en popup samme dag, valgmulighed
**"Fjern helt, rodens vælger er nok"**.

**Prisen er kendt og accepteret — skriv den ikke om til et spørgsmål.** Efter dit spor står der
**nul** brugersynligt sprogskift på 214 af 215 sider; kun `dist/index.html` (rodens vælger) kan
skifte sprog. `hreflang` i `<head>` er upåvirket. JPK har set prisen og valgt den, med L82
(dansk udgår) som baggrund.

**Kommentaren i `side.mjs:1996` bliver forkert af dit arbejde.** Den siger ordret
*"Sprogskifteren gaar IKKE tabt: topbaren (.daek__sprog, 'DA / ...')"* — den blev skrevet, da
fodens skifter blev fjernet, og den begrundede fjernelsen med netop den, du nu tager. **Ret
kommentaren, så den beskriver den nye sandhed**, i stedet for at efterlade en påstand, næste
læser vil tro på. Det er samme fejlform som DESIGN.md, der beskrev et forladt system.

**Fjern både markup OG CSS**, så der hverken efterlades død CSS eller ustylet markup:
`side.mjs:2060-2061` (`sprogSkifter`), `side.mjs:2101` (`.daek__sprog`), og
`system.css:580-586, 592-593, 617`.

**`sprog_etiket` bliver en ubrugt i18n-nøgle.** Den ligger i `data/i18n/`, som `spor/saml3`
ejer. **Lad den stå**, notér den i rapporten som en ubrugt nøgle til en senere oprydning.
Målt: ingen test kræver, at alle i18n-nøgler bruges.

## Filejerskab

**Du ejer:**
```
tools/skabelon/side.mjs
assets/system.css
tests/dele/37-topbar.mjs
tests/dele/51-fejl404.mjs
tests/dele/54-sprogrod-og-topbar.mjs
tests/dele/62-uifix.mjs
tests/dele/67-topbar2.mjs           (ny fil, nummeret er tildelt dig)
fund/FUND-topbar.md                 (din rapport)
```

**De fire eksisterende testfiler er MÅLT til at nævne `daek__sprog` eller `daek__enhed`.**
Læs dem, før du bygger. **Ret assertions, vend dem — slet dem ikke.** En assertion, der i dag
beviser, at DA/EN står i topbaren, skal efter dit spor bevise, at den ikke gør, og at
`hreflang` stadig er der. Skriv i rapporten, hvor mange du vendte, hvor mange du tilføjede, og
hvor mange du slettede med begrundelse for hver sletning.

**Forbudt — tre andre spor og en anden session kører samtidig:**
```
assets/generator.css · tools/skabelon/sammenligning.mjs · assets/sammenligning.js
data/i18n/*.json · tests/dele/38 · 55 · 57 · 66          spor/saml3 ejer dem
tools/skabelon/katalog.mjs · assets/katalog.js · tests/dele/65   spor/katalog3
db/** · tests/dele/63 · tests/dele/64                    den anden session
```

**Fælde i netop dit spor:** `system.css` bærer også `.saml-taeller` (2455-2491) og
`.klaebebar` (2235-2281), som `spor/katalog3` arbejder omkring. **Rør ikke de to blokke** —
katalog3 er skrevet til at klare sig uden CSS-ændringer, netop så I ikke kolliderer.

## Grundmåling — DIN FØRSTE KOMMANDO er at genmåle den

Målt af orkestratoren på `a405066` umiddelbart før afsendelse:

```
node tools/validate.mjs    77 filer / 0 fejl / 1 advarsel
node tools/build.mjs       216 sider · 1111 tal med kilde / 0 uden
node tests/koer.mjs        1478 bestaaet / 1 fejlet
```

**Den ene røde er IKKE din:** `tests/dele/63` punkt (c), CRLF mod LF i
`db/migrering-engelsk.sql`. Rød i enhver frisk checkout, rettes af `spor/crlf63` i en anden
session. **Rør den ikke.** Er der 2 røde efter dit arbejde, er den ene din.

**Gitignorerede filer skal kopieres ind, ellers giver validate 54 fejl, der ikke er dine:**
```
cp -r ../udstilling/assets/fotos/fabrikant/. assets/fotos/fabrikant/
```

## Acceptkriterier — hvert enkelt er KØRT mod main, og "giver i dag" er målt

| # | Kommando | Giver i dag | Skal give |
|---|---|---|---|
| T1 | `grep -c 'class="daek__sprog"' tools/skabelon/side.mjs` | **1** | **0** |
| T2 | `grep -c 'sprogSkifter' tools/skabelon/side.mjs` | **2** | **0** |
| T3 | `grep -c 'daek__sprog' dist/da/index.html` | **1** | **0** |
| T4 | `grep -c 'daek__sprog' assets/system.css` | **7** | **0** |
| T5 | `grep -o 'hreflang' dist/da/index.html \| wc -l` | **4** | **4** (maskinlæsbart sprogskift bliver) |
| T6 | `grep -c 'daek__enhed' assets/system.css` | **9** | **≥9** (topbarens kontakt bliver) |
| T7 | `grep -c 'enhedsvis--metrisk' assets/system.css` | **2** | **2** (de to in-page-instanser er urørte) |

**Bemærk, hvorfor mønstrene ser sådan ud.** Rå `grep -c 'daek__sprog'` på `side.mjs` giver
**4**, ikke 1 — **kommentarer nævner navnet**. T1 rammer markup, ikke prosa. Bruger du et andet
mønster, så mål og skriv, hvad det giver i dag, **før** du ændrer noget.

**T8 — den, der beviser, at det virker for en bruger, og som de syv ovenfor IKKE beviser.**
Kør din server på 8233 og skyd topbaren på to flader:

```
node C:/Praktik/websites/maalevaerktoej/flade-skud.mjs http://localhost:8233/da/ 1440 <udfil>.png
node C:/Praktik/websites/maalevaerktoej/flade-skud.mjs "http://localhost:8233/da/robotter/<slug>/" 1440 <udfil>.png
```

Læs skuddene. **Begge enhedsetiketter skal stå samtidig, den aktive skal kunne skelnes, og
DA/EN skal være væk.** Klik kontakten og skyd igen: **tallene på siden skal skifte, og den
aktive etiket skal flytte sig.** Skriv alle fire iagttagelser.

Uden T8 er kriterierne kun en påstand om filer. **Det er præcis den fejl, der gik grøn i går på
netop denne kontakt:** Å121's punkt 1 havde et kørt, reproducerbart og gyldigt kriterium
(3 etiketter i HTML), som målte tre etiketter, hvoraf de to sad på skjulte instanser.
Kriteriet var grønt, og funktionen virkede ikke. **Din opgave er den samme kontakt.**

**T9 — P0 uden JavaScript.** Efterprøv med JS slået fra, at kontakten stadig skifter enheder,
og skriv hvordan du målte det.

**T10 — ny test i `tests/dele/67-topbar2.mjs`:** mindst én assertion, der fælder, hvis DA/EN
vender tilbage til topbaren, mindst én, der fælder, hvis `hreflang` forsvinder, og mindst én,
der fælder, hvis kun den ene enhedsetiket vises i topbaren. Følg kontrakten i
`tests/LAESMIG.md`.

## Skills

**Vurdér og skriv, hvad du valgte og hvad du gik forbi, med begrundelse.** Kandidater:
`impeccable layout` (topbaren får to etiketter, hvor der var én — pladsen og rytmen ændrer sig,
og den skal holde ved 390 px), `impeccable audit` (kontakten er en `<label>` for en
`<input type=checkbox>`; med to synlige etiketter skal det stadig være entydigt for en
skærmlæser, hvad afkrydsningen betyder), `fejljagt` (hvis et måletal opfører sig uventet).
**Designfrysen L70 gælder:** du udfører JPK's to instrukser, du opfinder ikke ny form ved siden
af. Ser du andet, der burde laves om, så **notér det, ret det ikke**.

**TYPESKILT er den låste retning** — mono, versaler, spærret, skarpe hjørner (`--hjoerne` = 2px,
L79), blæk på lys bund. **L76 forbyder `--accent` som forgrundsfarve på lys bund** (gul på lys
giver 1,38:1 mod WCAG's 4,5). Markér den aktive etiket med noget andet end gul tekst.

Kald til plugin-skills fra en worktree svinger. Lykkes kaldet ikke, så læs fra disk:
```
C:/Users/thyge/.claude/skills/impeccable/SKILL.md
```
**og skriv i rapporten, at du læste den fra disk.**

## Miljø — hver af disse koster en runde, når den udelades

- `node` ligger i `/c/Program Files/nodejs/node.exe` — Git Bash har den **ikke** på PATH.
- Commit-beskeder med backticks, `$` eller anførselstegn: skriv til fil, `git commit -F <fil>`.
- **`sed -i` fejler tavst med exit 0.** Brug Edit-værktøjet, som fejler synligt.
- **En HTML-kommentar tæller med i et grep-baseret acceptkriterium.**
- **Råt `grep -o '{'` i CSS tæller også klammer i kommentarer** — 504 mod motorens 493.
- **Send aldrig en kommando til `/dev/null`, hvis dens exitkode eller fejltekst er en del af
  målingen.**
- `git -C` skal have `C:/Praktik/...`, ikke `/c/Praktik/...`.
- Skriv filer som UTF-8 **uden** BOM.
- **Serveren:** `/c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe -m
  http.server 8233 --directory dist` fra worktree-roden, **aldrig `cd dist`**.
  **Verificér mod disken, før ét eneste tal bruges:** vælg en streng, der kun findes i din
  udgave, og sammenlign `curl -s` mod `grep` på filen. **Vælg kontrolordet med omhu** — ordet
  `hjoerne` duer ikke, det findes 10 gange i mains eget stilark.
- **Luk din server, når du er færdig med at måle, og skriv i rapporten, at du gjorde det.**
- **Ryd `tests/.tmp-koersel` i din worktree, når du er færdig** — 11,5 GB fri på C:.

## Commit undervejs er et krav

Ét commit pr. sammenhængende ændring. Punkt 4 og punkt 5 er to commits, ikke ét.

## Rapporten — `fund/FUND-topbar.md`, højst 60 linjer

1. Valgt løsning og fravalgt løsning, én linje hver.
2. **Konfidens pr. punkt.** *Høj* kræver en genkørbar kommando **plus** én linje om, hvad
   tallet ville have været, hvis arbejdet var forkert. Uden begge dele: middel.
3. Usikkerheder.
4. Målingerne som tal, ikke prosa.

**UDEN FOR de 60 linjer, obligatorisk:**
- **"Nye fælder og opdagelser."** Er der intet, skal der stå, at der intet er.
- **"Punkter i briefet, jeg ikke nåede."** Én linje pr. punkt, tom hvis ingen.

## Briefets fakta er påstande

**Afviger noget, du måler, fra noget, briefet påstår, så rapportér afvigelsen — det er en del
af leverancen, ikke ulydighed.** Linjenumrene er slået op på `a405066`. To af mine egne tal i
nabosporenes briefs var forkerte, fordi kommentarer nævnte klassenavnene; regn med, at det kan
gælde her også.
