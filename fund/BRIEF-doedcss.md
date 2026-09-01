# BRIEF — spor/doedcss

**Model: Sonnet.** Rugbrødsarbejde med et målbart facit: 66 klassenavne skal væk
fra to stilark, og et script siger, hvornår du er færdig. Ingen designbeslutning.

**Arbejdsmappe:** `C:\Praktik\websites\udstilling-wt-doedcss`
**Gren:** `spor/doedcss`, forgrenet fra `af87916`
**Serverport: 8142** (aldrig 8080 — den er hovedrepoets)
**Testnummer: 57** (i brug på tværs af alle worktrees: 1-56. Din nye testfil
skal hedde `tests/dele/57-doed-css.mjs`)

**Rør ALDRIG** `c:\Praktik\websites\salg` eller `c:\Praktik\website`. Andre projekter.

---

## Regel 0 — skill-vurdering, første handling

Skriv i rapporten, hvilken skill du valgte, og hvilke du gik forbi med begrundelse.
*"Ingen skill passer her"* er et gyldigt svar, men det skal skrives.

Læs først `CLAUDE.md` i din worktree. Projektets egne skills ligger i
`.claude/skills/` og følger med worktreen.

---

## 1. Grundmåling — din FØRSTE kommando, før du ændrer noget

Kør disse og skriv tallene i rapporten. Uden dem kan du ikke svare på
*"var det mig, der ødelagde det?"*

```bash
node tools/validate.mjs
node tools/build.mjs --ud=.tmp/dist-grund
node tests/koer.mjs
node fund/maal-doede-klasser.mjs
```

**Mine tal på `af87916`, målt umiddelbart før afsendelse. Afviger dine, så
RAPPORTÉR afvigelsen — det er en del af leverancen, ikke ulydighed:**

| Måling | Værdi på main |
|---|---|
| validate | 77 filer · 0 fejl · 1 advarsel |
| build | 216 sider · 1111 tal med kilde, 0 uden |
| tests | **1479 bestået · 0 fejlet** |
| ægte døde klasser | **66** |
| ægte ustylede klasser | **26** |
| CSS-linjer i alt | 4251 |

**Giver validate 76 fejl i stedet for 0, er det MILJØET og ikke dit arbejde:**
fabrikantfotoerne er gitignorerede. De ER kopieret ind i din worktree (610
filer), så det bør ikke ske — men kender du årsagen, sparer du en runde.

---

## 2. Opgaven

Fjern de **66 ægte døde CSS-klasser** fra `assets/system.css` og
`assets/generator.css`. En klasse er død, når den nævnes i et stilark og står i
`class="…"` på **nul** byggede sider **og** ikke nævnes i nogen `assets/*.js`.

`fund/maal-doede-klasser.mjs` er facitlisten. Kør den, læs afsnittet
`AEGTE DOEDE`, og arbejd den liste igennem.

### Hvad du IKKE må røre

| Rør ikke | Hvorfor |
|---|---|
| **De 26 ustylede klasser** | Et andet spørgsmål: de står i HTML uden en regel. Nogle er bevidste kroge, andre er ægte huller. Ikke besluttet |
| **`.videre` og `.nulstil`** | To knapgenerationer, begge LEVENDE. At vælge én er en designbeslutning, og designfrysen (L70) gælder |
| **De 31 JS-tilføjede klasser** | `klaebebar*`, `saml-*`, `specimen*`, `status`, `facet-tom` lever ved kørsel. Scriptet har allerede sorteret dem fra — hvis du ser dem i din liste, er scriptet gået i stykker, og så STOPPER du og rapporterer |
| **Alt uden for de to stilark** | Ingen skabeloner, ingen data, ingen JS |

### FÆLDEN, som er hele grunden til at dette ikke er søg-og-erstat

**En død klasse kan dele en regel med en LEVENDE selektor.** Sletter du hele
reglen, dør den levende med. Målt på main: **178 regler nævner en død klasse.
173 kan slettes helt. 5 kan IKKE.**

Her er alle fem. Fjern **kun den døde selektordel**, lad reglen og dens
erklæringer stå:

```
system.css     DØD .stribe--kompakt .krop > .v-tal    LEVENDE .stribe .krop > .v-tal
system.css     DØD .stribe--kompakt .v                LEVENDE .stribe .v
system.css     DØD .stribe--kompakt .num              LEVENDE .stribe .num
generator.css  DØD .panel, .eu-blok .eu-krop          LEVENDE .kort, .stribe
generator.css  DØD .facetter__net .facet--s4
                   .facetter__net .facet--s5          LEVENDE .facetter__net .facet--s3
```

**Tallet 178/173/5 er MÅLT af mig, ikke gættet.** Genkør det selv med scriptet
i `fund/` plus din egen kontrol; afviger det, så rapportér.

### Kommentarer

Stilarkene bærer lange forklarende kommentarer, og flere af dem handler om de
klasser, du fjerner. **Fjern en kommentar sammen med sin regel, når den KUN
handler om den.** Handler den også om noget levende, så lad den stå og skriv i
kommentaren, at reglen er fjernet, med dato. **Slet aldrig en kommentar, der
forklarer en levende regel** — projektets kommentarer er dokumentation, ikke støj.

---

## 3. Filejerskab

**Du ejer:** `assets/system.css` · `assets/generator.css` ·
`tests/dele/57-doed-css.mjs` (ny) · `fund/FUND-doedcss.md` (din rapport).

**Ingen andre spor kører lige nu**, så der er ingen konflikt. Rør alligevel ikke
andet — et spor, der udvider sit ejerskab undervejs, kan ikke flettes uden en
ekstra runde.

---

## 4. Acceptkriterier — alle KØRT mod main, med dagens svar

Hvert punkt har ét entydigt kriterium. **"Giver i dag X"** er målt af mig på
`af87916`, så du kan se, at kriteriet faktisk måler noget.

**1. Ingen døde klasser tilbage.**
```bash
node fund/maal-doede-klasser.mjs | grep 'AEGTE DOEDE'
```
Giver i dag: `AEGTE DOEDE       : 66`. **Færdig, når den giver `: 0`.**

**2. De ustylede er URØRT.**
```bash
node fund/maal-doede-klasser.mjs | grep 'AEGTE USTYLEDE'
```
Giver i dag: `AEGTE USTYLEDE       : 26`. **Skal stadig give `: 26`.**
Ændrer det sig, har du rørt noget levende.

**3. Siden bygger uændret.**
```bash
node tools/validate.mjs && node tools/build.mjs --ud=.tmp/dist-efter
```
**Sidetallet og kildemærkerne skal være PRÆCIS de samme som i din grundmåling.**
Tallet 216 er min måling i dag; brug dit eget grundmålingstal som facit, ikke mit.

**4. Testene består.**
```bash
node tests/koer.mjs
```
**Samme beståtal som din grundmåling, samme kendte røde.** Knækker en test,
fordi den påstod noget om en fjernet regel: **ret assertionen, så den beviser
den NYE regel — slet den aldrig.** Det er en hård projektregel.

**5. Den byggede HTML er byte-identisk.**
Dette er det stærkeste kriterium, og det er derfor det står her:
```bash
diff -r .tmp/dist-grund .tmp/dist-efter --exclude='*.css'
```
**Skal give ingen forskelle.** Du fjerner CSS, ikke indhold — ændrer HTML sig,
har du rørt en skabelon, og det må du ikke.

**6. Din nye test låser resultatet.**
`tests/dele/57-doed-css.mjs` skal fejle, hvis en død klasse kommer tilbage.
Enkleste form: kør målescriptets logik og påstå `AEGTE DOEDE === 0`.
**Kør den, og skriv i rapporten, at du så den fejle**, før du fik den til at
bestå — en test, der aldrig har været rød, beviser ingenting.

---

## 5. Commit undervejs — det er et krav, ikke et råd

**To spor er døde på tre dage uden en linje efterladt.** Dør du, skal dit
arbejde kunne måles i stedet for gættes.

**Ét commit pr. sammenhængende gruppe.** Og læg mærke til formuleringen, fordi
den er en SKRIVE-grænse, ikke en commit-grænse: *skriv KUN gruppe 1's ændringer,
mål dem, commit — og først DEREFTER må gruppe 2 skrives.* Målt to gange på
agenter, der fik samme instruks: hele arbejdet blev skrevet i ét kald, og
commit 1 bar dermed også commit 2-3's uefterprøvede kode.

Foreslået gruppering, i denne rækkefølge:

1. **De 5 delte regler** — de farlige. Kirurgisk selektorfjernelse. Commit.
2. **Forsidens efterladte klasser** (`yderpunkt*`, `hero*`) — én sammenhængende
   blok. Commit.
3. **Fjernede komponenter** (`vaelgernet`, `vc*`, `eu-*`, `stribe--*`,
   `saml-udtraek*`, `sammenligning-vaelger`, `valg--standard`). Commit.
4. **Omdøbte kort-klasser** (`kort-navn`, `kort-krop`, `kort-hoved`,
   `kort-billed`, `kort-invit`). Commit.
5. **Resten.** Commit.
6. **Testen.** Commit.

**Commit-beskeder med backticks, `$` eller anførselstegn skal skrives til en fil
og committes med `git commit -F <fil>`.** PowerShell 5.1 ødelægger
argumentoverførsel til native kommandoer med dobbelte anførselstegn.

---

## 6. Miljøfælder — hver af dem koster en runde

- **`node` er ikke på PATH i Git Bash.** Fuld sti:
  `/c/Program\ Files/nodejs/node.exe`
- **`sed -i`, der ikke matcher, gør INTET — tavst og med exit 0.** Brug
  Edit-værktøjet, som fejler synligt. Bruger du alligevel skallen, så `grep`
  efter resultatet bagefter.
- **Skriv filer som UTF-8 UDEN BOM.** `Set-Content -Encoding utf8` ødelægger
  tankestreger, og stilarkene er fulde af danske kommentarer.
- **Egen serverport 8142**, aldrig 8080. Og **verificér serveren mod disken,
  før du bruger ét eneste måletal**: vælg en streng, der kun findes i din
  udgave, og sammenlign `curl`-svaret med `grep` på filen. Fem forældreløse
  servere kørte samtidig 1. sep og serverede fremmede byg.
- **`python` er ikke på PATH i en baggrundsskal.** Fuld sti:
  `/c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe`
- **Luk din server, når du er færdig med at måle, og skriv i rapporten at du
  gjorde det.**
- **Disken er knap.** `tests/.tmp-koersel` vokser ~2,5 GB pr. kørselsserie og er
  gitignoreret. Ryd den mellem runder. Rammer du ENOSPC, er det miljøet, ikke
  dit arbejde.
- **Et `grep`, der bærer en konklusion, skal have en kontrol:** skriv det
  forventede tal, FØR du læser det. Et forkert mønster giver et fuldstændig
  plausibelt nul.

---

## 7. Rapporten — `fund/FUND-doedcss.md`, HØJST 60 linjer

Fire ting og ikke mere:

1. **Valgt løsning + fravalgt alternativ**, én linje hver.
2. **Konfidensniveau pr. punkt.** Skalaen er bundet til bevistype, ikke til
   fornemmelse:
   - **høj** = målt med en kommando, orkestratoren kan genkøre den og få samme tal
   - **middel** = efterprøvet indirekte, ikke i den endelige form
   - **lav** = ikke efterprøvet
   **Høj uden en genkørbar kommando nedskrives automatisk til lav.** Og høj
   kræver desuden **én linje om, hvad tallet ville have været, hvis arbejdet var
   forkert** — genkørbarhed beviser reproducerbarhed, ikke relevans.
3. **Usikkerheder mødt undervejs.**
4. **Målingerne som tal**, ikke som prosa. `"66 → 0"`, ikke `"alt kørte fint"`.

**To sektioner ligger UDEN FOR de 60 linjer og er obligatoriske:**

- **"Nye fælder og opdagelser."** Er der intet, skal der stå, at der intet er.
- **"Punkter i briefet, jeg ikke nåede."** Én linje pr. punkt, tom hvis ingen.

---

## 8. Briefets fakta er påstande

**Afviger noget, du måler, fra noget, dette brief påstår, så RAPPORTÉR
afvigelsen. Det er en del af leverancen, ikke ulydighed.** To agenter rettede
orkestratorens fakta på eget initiativ i august, begge korrekt, og det var
sessionens billigste kvalitetskontrol — orkestratoren kontrolleres ellers af
ingen.

Det gælder især tallene **66**, **26**, **178/173/5** og listen over de fem
delte regler. De er målt af mig i dag på `af87916`. Måler du andet, har enten
scriptet eller jeg taget fejl, og begge dele skal frem.
