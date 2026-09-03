# BRIEF — fotofod, runde 3: tre formler skal VENDES, ikke slettes

**Model: sonnet** (mekanisk rettelse med et målbart facit).
**Worktree:** `C:\Praktik\websites\udstilling-wt-foto2`, gren `spor/fotofod`.
**Port, hvis du får brug for en: 8205** (din egen fra sidste runde).

**Din første handling: kald `spor`-skillen.** Lykkes kaldet ikke fra worktreen,
så læs `.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at du
gjorde det**. Kald `fejljagt`, hvis noget opfører sig uventet.

**`design` er fravalgt, og det er en instruks:** du ændrer ingen flade, ingen
CSS og intet udseende. Du retter tre testformler. **Rør ikke
`assets/generator.css` eller `assets/sammenligning.js`** — de er færdige og
efterprøvet.

---

## Situationen

Dit arbejde fra runde 1 og 2 er **rigtigt og bliver ikke lavet om.** Test 79 er
efterprøvet, alle 12 assertions revert-bevist, og fladen er set med øjne.

**Men `<tfoot>` brød tre hårdkodede tællinger i to testfiler, du ikke ejer.**
Det er 6 røde assertions (3 formler × 2 sprog). De er **ægte** — ikke støj — og
de er lovligt brudte: du har tilføjet en række og nogle celler til matricen,
fordi JPK bad om fotokreditter pr. kolonne, og formlerne kendte ikke den række.

**Mekanismen, målt af orkestratoren, så du ikke skal gætte:** tests 29 og 38
læser ikke `dist/`. De **kører den rigtige `assets/sammenligning.js` i en `vm`**
mod en DOM-shim (`29-tabelsemantik.mjs:13`, `38-typeskilt-sammenligning.mjs:24`)
og måler resultatet af `tabelHTML()`. Din klientside-`<tfoot>` når derfor helt
ind i deres tællinger.

**Reglen, der styrer hele opgaven — CLAUDE.md:** *"Ret assertions, slet dem
ikke. Ændrer adfærden sig, så vend testen om, så den beviser den nye regel."*
**Sænk aldrig et krav for at få noget grønt.** En formel, der bare får `+ 1`
klistret på uden at vide hvorfor, er en sænkning forklædt som en rettelse.

---

## Punkt 0 — GRUNDMÅLING, din første kommando efter skill-kaldet

**Tag først main ind i grenen:**

```
git merge main
```

**Main er flyttet, siden du sidst målte.** Den står nu på `5903ea8` og
indeholder `spor/certfacet` (L90's certificeringsfacet, 62 slettede i18n-nøgler,
to nye testfiler 77 og 78) samt `udstilling-fb`s dataeksport. **Opstår der en
konflikt: `--ours` er GRENEN, ikke main** — det er modsat af, hvad man husker,
og det har kostet en dublet i dette projekt før. Meld en konflikt frem for at
gætte.

**Derefter:**

```
node tools/validate.mjs
node tools/build.mjs
node tests/koer.mjs
```

**Rækkefølgen er ikke valgfri** — testene læser fra `dist/`.

**ORKESTRATORENS TAL, MÅLT PÅ MAIN `5903ea8` KL. 23:47, IKKE ET GÆT:**

```
validate    77 fil(er) · 0 fejl · 1 advarsler
build       216 sider · 1111 tal med kilde, 0 uden
koer.mjs    1757 bestaaet, 9 fejlet
```

**DE 9 RØDE ER IKKE DINE, OG DE SKAL BLIVE VED MED AT VÆRE RØDE.** De stammer
fra `udstilling-fb`s dataeksport, som hentede fase 2's engelske tekster hjem fra
databasen og dermed gjorde fase 2's egen uløste tilstand synlig i den byggede
side for første gang. Listen, så du kan skelne:

| Antal | Fejlteksten |
|---|---|
| 3 | han-tegn: *"0 han-tegn i advarsel/note/citat/noter"*, *"0 byggede sider baerer han-tegn"*, *"0 han-tegn i alt i dist/"* |
| 2 | `64.3`: unitree-aliengo bærer *"UDEN batteri"* i sin danske advarsel |
| 1 | `(d) fixture (addverb-trakr-20, engelsk)` |
| 1 | `4c`: Spots *"stroem ud"* viser kun tekstværdien |
| 2 | *"259 forbehold maerket gyldighed"* og *"562 i alt, ingen ugyldig vaerdi"* |

**Rør ingen af de 9.** Et andet spor (`spor/f2han`) arbejder på de tre
han-tests netop nu. Går én af dem grøn hos dig, er det et fund — **meld det,
ret det ikke.**

**Efter `git merge main` forventer jeg omkring 1769 bestået** (1757 + dine 12
fra test 79) **og 15 fejlet** (de 9 ovenfor + dine 6). **Begge tal er
FORUDSIGELSER — mål dine egne og skriv dem.** Afviger de, så meld afvigelsen
før du retter videre; det er en del af leverancen, ikke ulydighed.

---

## Punkt 1 — `tests/dele/29-tabelsemantik.mjs:95`, rækketallet

**Det står der nu:**

```js
const ventetTr = 1 + antalGrupper + m.antalFelter;
ok(`29/${sprog}: <tr> = 1 hoved + ${antalGrupper} gruppetitler + ${m.antalFelter} feltraekker = ${ventetTr}`,
  m.tr === ventetTr, `tr=${m.tr}`);
```

**Kommentaren over den, linje 92-94, forklarer hvorfor formlen findes:**
*"Raekketallet skal HAENGE SAMMEN … Rammer det ikke, er hoved og krop ude af
trit, og hver vaerdi ville blive laest op under den forkerte robot."*
**Den begrundelse gælder uændret.** Det er ikke formlens formål, der er forkert
— det er dens led, der mangler ét.

**Ønsket resultat:** formlen skal kende `<tfoot>`-rækken og bevise, at den er
der, når den skal være der. `<tfoot>` tegnes **kun**, når mindst én valgt robot
har et fabrikantfoto — det er `harFabrikantfoto`-vagten i `fotoFodHTML()`.
**Formlen skal derfor være betinget, ikke `+ 1` i blinde.** Udled leddet fra
samme betingelse, som JS'en bruger; hardkod ikke et 1-tal.

**Opdatér assertionens tekst**, så den nævner fodrækken — teksten er det, en
læser ser i output, og en formel, hvis navn ikke matcher dens indhold, er et
fremtidigt fejlspor.

**Én linje HVORFOR:** en test, der tæller rækker, er sidens eneste værn mod at
hoved og krop kommer ud af trit — og det er præcis den fejl, der får en værdi
til at blive læst op under den forkerte robot.

**Acceptkriterium 1:** `29/da` og `29/en`s rækkeassertion er **grønne**, og
formlen giver et **andet** tal, hvis `<tfoot>` fjernes. Vis det revert-bevis i
rapporten. **Giver i dag: rød i begge sprog.**

---

## Punkt 2 — `tests/dele/29-tabelsemantik.mjs:101`, celletallet

**Det står der nu:**

```js
const ventetTd = 1 + m.antalRobotter * m.antalFelter;
ok(`29/${sprog}: <td> = 1 hjoernecelle + ${m.antalRobotter}x${m.antalFelter} vaerdier = ${ventetTd}`,
  m.td === ventetTd, `td=${m.td}`);
```

**Din `<tfoot>` tilføjer to slags celler:** ét hjørne
(`.saml-fotofod__hjoerne`) og én celle pr. valgt robot
(`.saml-fotofod__celle`). Din egen måling i runde 2 gav **3 celler + 1 hjørne**
med tre valgte robotter, der alle har fabrikantfoto.

**Ønsket resultat:** formlen skal bære de to nye led med navn, i samme stil som
de eksisterende (*"1 hjoernecelle + NxM vaerdier"*), så teksten stadig kan
læses som en forklaring. **Antallet af fodceller er ikke altid lig antallet af
robotter** — en robot uden fabrikantfoto får en **tom** celle, ikke ingen
celle (det er test 79.4 og 79.11's regel). Udled tallet; antag det ikke.

**Acceptkriterium 2:** `29/da` og `29/en`s celleassertion er **grønne**, og
formlen fanger stadig en ægte fejl: indsæt midlertidigt en ekstra `<td>` i
`fotoFodHTML()`, vis at assertionen falder rød, og rul tilbage. `git status
--porcelain` skal være **tom** bagefter. **Giver i dag: rød i begge sprog.**

---

## Punkt 3 — `tests/dele/38-typeskilt-sammenligning.mjs:165`

**Det står der nu:**

```js
const hjoerner = (tabelHTML.match(/class="specimen-hoved__hjoerne"/g) || []).length;
ok(`38.10.${sprog}: jigraekken har praecis ét hjoerne, og det er et <td>`,
  hjoerner === 1 && m.td === 1 + m.antalRobotter * m.antalFelter,
  `hjoerner=${hjoerner}, td=${m.td}`);
```

**VIGTIGT — kun DEN ENE halvdel er brudt, og det er målt af orkestratoren:**
`hjoerner` tæller `specimen-hoved__hjoerne`, og dit fodhjørne hedder
`saml-fotofod__hjoerne`. **`hjoerner === 1` er altså stadig sandt og skal
stå urørt.** Det er `m.td`-halvdelen, der mangler dine celler.

**Ret kun `m.td`-leddet.** Rører du `hjoerner`-halvdelen, svækker du en
assertion, der virker — kommentaren over den siger, hvorfor den findes: *"Et
`<th>` uden kolonne ville taelle med som en kolonneoverskrift uden kolonne og
braekke forholdet mellem vaerdi og robot."*

**Acceptkriterium 3:** `38.10.da` og `38.10.en` er **grønne**, `hjoerner`-
halvdelen af udtrykket er **tegn for tegn uændret** (vis diffen i rapporten),
og fejlbeskeden `hjoerner=..., td=...` er bevaret. **Giver i dag: rød i begge
sprog.**

---

## Punkt 4 — slutmåling

```
node tests/koer.mjs
```

**Acceptkriterium 4:** kørslen viser **præcis 9 fejlede**, og de 9 fejltekster
er **ordret** dem fra tabellen i punkt 0. Beståtallet er grundmålingens plus
dine rettede assertions.

**Er der 10 eller flere, eller er en fejltekst en anden end de 9: STOP og meld.**
Ret ikke videre. Det betyder, at noget andet er gået i stykker, og at blande to
årsager sammen har kostet et helt ekstra spor i dette projekt før.

---

## Filejerskab

**Du ejer:** `tests/dele/29-tabelsemantik.mjs`,
`tests/dele/38-typeskilt-sammenligning.mjs`, `fund/FUND-fotofod-3.md`.

**Du må IKKE røre:** `assets/sammenligning.js` og `assets/generator.css`
(færdige — undtagen midlertidigt under et revert-bevis, som **skal** rulles
tilbage), `tests/dele/79-fotofod.mjs` (efterprøvet), `tools/`, `data/`,
`db/`, `DESIGN.md`, `STATUS.md`, `CLAUDE.md`, og **ingen anden fil i
`tests/dele/`** — særligt ikke 77 og 78, som lige er kommet ind med main.

**Samtidige spor:** `udstilling-fb` kører tre spor, der kun skriver i
**databasen** (`spor/f2han`, `spor/f2pudu`, `spor/f2weilan`). Nul overlap med
dig. **Rør ikke databasen.**

---

## Miljø

- **Disken er presset: ~17 GB fri, og én suitekørsel bruger ~3 GB.** Kør
  `tests/koer.mjs` **højst to gange**: grundmålingen og slutmålingen. Brug
  `node tools/build.mjs` plus et målrettet kald af den enkelte testfil til
  mellemtjek.
- **Kør ALDRIG `rm -rf` på `tests/.tmp-koersel`** — den står i
  `.claude/settings.json`s deny-liste. Er disken fuld, så **meld det og stop**.
- **`node.exe` læser `/c/...` som `C:\c\...`** og melder succes. Brug `C:/...`.
- **`grep -P` virker ikke her.** Brug `awk` eller node.
- **node og Git Bash er ikke enige om, hvor `/tmp` ligger** — orkestratoren gik
  i den fælde for tyve minutter siden. Brug en sti i projektet.

---

## Commits og rapport

**Commit dette brief FØRST**, før du retter noget. Derefter ét commit pr. punkt,
i rækkefølgen 1 → 2 → 3. To spor er døet på en sessionsgrænse i dette projekt i
aften; dit eget er ét af dem, og det var kun de committede punkter, der overlevede.

Rapporten er **`fund/FUND-fotofod-3.md`** — genbrug ikke `FUND-fotofod.md`,
den er runde 2's og skal blive stående. Højst 60 linjer plus `spor`-skillens to
obligatoriske sektioner.

**Først en tabel: hver af de tre formler, hvad den krævede før, hvad den kræver
nu, og hvilket revert der fælder den.** Derefter slutmålingen.

**Skriv udtrykkeligt, hvis en af de tre vendinger beviser MINDRE end før.** En
assertion, der er blevet svagere, uden at nogen opdagede det, er værre end en
rød test — og det er den eneste måde, denne opgave kan gå galt på.
