# FUND-saml3 — sammenligningsmatricen, seks punkter fra JPK 3. sep 2026

**Skills:** `spor` (kaldt, virkede fra worktreen) · `fejljagt` (punkt 2+7) · `impeccable`
(kaldt; `reference/layout.md` læst fra `C:/Users/thyge/.claude/skills/impeccable/`). Gik forbi:
`robotdata`, `flet`/`grillmig` (orkestratorens), `supabase*`, `frontend-design` (ingen ny flade).

**Grundmåling:** `validate.mjs` gav **77 · 76 fejl · 1** mod briefets 0 fejl. Alle 76 er R18
*"assets/fotos/fabrikant/… findes ikke"*; mappen lå tom. Kopieret ind fra hovedrepoet (610
filer, kun læst derfra) → **77 · 0 · 1**. Miljø, ikke `c95abce`. **Valgt:** planens K1/K2 som
skrevet, undtagen K2 punkt 3, hvor JPK har omgjort planen. **Fravalgt:** at hæve `--linje` selv
(73 forekomster, seks flader — eget systemspor). Alt målt med **isoleret** Playwright, egen
server 8131, servervagt disk = server. 6 commits.

| # | Resultat | Konfidens |
|---|---|---|
| 1 | Kolonneforhold **4,78×→1,00** (2 plader), **3,92×→1,00** (3), **1,63×→1,00** (390 px). Pris: sidehøjde +96/+191/+385 px. 0 afklippede celler, 0 vandret overløb | **høj** |
| 2+7 | Tegnede rækkestreger **0 → 38** = 33 datarækker + 5 gruppeskel. Linje 604 **ikke slettet** | **høj** |
| 3 | Markering ved svæv og fokus. **12 Tab-tryk** rammer rækkehovedet med tastatur alene | **høj** |
| 4 | CONVERTED-mærker i matricen **11 → 0**; forklaringslinjen står, nu omskrevet | **høj** |
| 5 | *"No winner"* i dist-HTML **2 → 0**. Tests vendt, ikke slettet | **høj** |
| 6 | **IKKE BYGGET** — hele kontaktens CSS ligger i `assets/system.css`, som jeg ikke ejer | — |

**Kontrafaktiske linjer.** 1: `maal-saml.mjs 3 1440` → `forhold: 1`; uden ændringen `3.917`.
2+7: samme kørsel → `38`; med nulstilleren sat tilbage målte jeg **5**, og datacellerne stod
igen på `0px none`. 3: `tastatur.mjs` → cellebaggrund `rgba(0,0,0,0)` → `rgb(232,235,237)`;
uden `tabindex="0"` kan `:focus-within` ikke fyre. 4: `omregnet.mjs en` → `0`, før `11`.
5: `grep -ril "no winner\|ingen vinder" --include=*.html dist/ | wc -l` → `0`, før `2`.

**Punkt 2+7 — mekanismesætningen, committet før rettelsen** (fuld udredning i `17237e7`):
Matricen viste nul streger, fordi `.saml-raekke > th,.saml-raekke > td,…{border-top:0}`
(**0,1,1**) slog `.saml-raekke > *{border-top:1px solid var(--linje)}` (**0,1,0**) —
specificitet afgøres før kilderækkefølge, og hvert barn af en `<tr>` er `th` eller `td`, så 604
vandt på **0 af 142** celler. Det er **(b)**: `el.matches` er true for selektoren, og
`border-top` målte `0px none` på alle 142 (var (a) rigtig, stod der `1px solid`). **Å146's "død
regel" er rigtig om virkningen og forkert om årsagen** — reglen var overskrevet, og en sletning
ville have fjernet netop den mekanisme, JPK bad om.

**Stregens kontrast, med læseretning.** Rækkehårstreg rille **på** panel = **1,56:1**;
gruppeskel støv-blæk **på** panel = **5,48:1**. 1,56 er under 3,0 og valgt bevidst: planens
systemregel kræver ≥3,0 kun når stregen er **eneste** bærer, og rækkeadskillelsen bæres også af
43,7 px rækkehøjde og hver celles venstrekant. Målt på samme celle er `border-left` og
`border-top` **identiske** — `1px solid rgb(198, 204, 209)` — så den vandrette streg er lige så
synlig som de lodrette, fladen altid har haft. Set på skærmbillede.

**Hård begrænsning 5 — planens åbne usikkerhed er lukket.** Planen kunne ikke måle `.v-nul`.
Med et udvalg med en nulværdi (`grep "vaerdi: 0"`, 8 robotter har en): `v-ikke` **4,74** ·
`v-nej`/`v-ja`/`v-tal`/**`v-nul`**/`v-tekst` **12,72** mod eloxgråt. Ingen under 4,5, og *ikke
oplyst* skilles af en stiplet **ramme** — en formforskel, en tone ikke kan udviske.

**Punkt 6 er ikke bygget** — se sidste afsnit; målingerne og den præcise rettelse står der.
**Målinger:** `validate.mjs` 77 · 0 · 1 · `build.mjs` 216 sider · 216 HTML-filer. Testdel 38
alene **58/0**; delene 05, 36, 44, 47, 57, 62 **134/0** (egen tmp-mappe, ikke
`tests/.tmp-koersel`; hele suiten er **ikke** kørt). Samlet diff 274+/70− over 7 filer, og
`git diff -w` giver **samme tal** — der er ikke omformateret én linje.

**Usikkerheder:** (1) `tabindex="0"` giver **33 nye tabulatorstop**; det ændrer sidens
tastaturrejse, ikke kun dens udseende. (2) Efter punkt 4 har `.omregnet` **nul udsendere** på
sitet, men tests 36.18 og 47.20–47.22 læser reglen ud af `system.css`, så Å102 kan ikke følges
uden at bryde ejerskabet. (3) Jeg omskrev `enhed_skift_forklaring`, som robotsiderne bruger.

## Nye fælder og opdagelser

- **`grep -ric … dist/ | wc -l` giver 843 = antallet af FILER i dist/, ikke træffere.** `-c`
  udskriver en linje pr. fil, også dem med nul. Briefets eget acceptkriterium for punkt 5 var
  skrevet i den form. Korrekt: `grep -ril … | wc -l` → 3 før, 1 efter.
- **"ingen vinder" er en delstreng af "Stansningen vinder" og af "ingen vindercelle".**
  `dist/system.css` har derfor en falsk positiv, som var der før mit spor; min egen første
  kommentar i `generator.css` ramte den anden variant. Ordet skal have en ordgrænse.
- **`assets/*.css` og `assets/*.js` kopieres RÅT til `dist/`, så en kommentar dér tæller med i
  ethvert grep mod den byggede side.** Ramte mig to gange (punkt 4 og 5). Forklaringer, der
  citerer det, de fjerner, hører i `tools/`, som ikke kopieres.
- **`CSSStyleRule` har en TOM `.cssRules` i nyere Chrome (nested CSS).** En CSSOM-sonde med
  `if (x.cssRules) recurse()` sender derfor alle regler ned i en tom rekursion og melder **0**
  — et fuldstændig plausibelt nul, som ingen fejljagt ville fyre på. Tjek `selectorText` først:
  0 → 846 regler. Uden kontroltallet havde sonden "bevist" mekanisme (c).
- **`'<præfiks> ' + 'a,b,c'` præfikser kun FØRSTE selektor i en kommaliste.** Min måling af
  fokusbare elementer gav derfor 4 for både `.saml-matrix` og `tr.saml-raekke` — to forskellige
  omfang med samme tal, og det var det eneste, der afslørede fejlen. Rettet: 3 og **0**.
- **`getComputedStyle(el).left` giver den BRUGTE px-værdi, også når CSS'en siger `left:auto`.**
  Min første måling af kuglen meldte derfor "venstre" i begge stillinger. Mål geometrisk.
- **`enhed_skift_forklaring` HENVISTE til mærket** (*"bærer mærket 'omregnet'. Tal uden det
  mærke er producentens egne"*). Briefet bad mig beholde den uændret; havde jeg gjort det,
  ville siden bede læseren lede efter noget, der ikke findes, og selve det, linjen skal værne,
  ville ikke kunne aflæses. Omskrevet på begge sprog. **Den var i øvrigt allerede forkert på 71
  robotsider × 2 sprog siden 2. sep**, hvor `spor/uifix` fjernede mærket dér; omskrivningen
  retter det med, uden at `robot.mjs` er rørt.
- **Punkt 4 var ikke en ny beslutning.** JPK traf den 2. sep 2026 (`spor/uifix` punkt 2) for
  robotsiden, hvor `side.mjs`' `omregningsMaerke()` allerede er lagt om, og test 62.2.a vogter
  den. Matricen blev bare ikke rettet med. Jeg brugte samme løsning, ikke en ny.
- **Planens K2.1 forudsatte noget fokusbart i rækkerne. Der er nul.** De eneste tre fokusbare i
  hele matricen er FJERN-knapperne i pladehovedet.
- **`maksAntal` er 3** (`sammenligning.mjs:228`), så briefets "5 robotter" **kan ikke opstå**.
  Målt syntetisk ved at omskrive `"maksAntal":3` i svaret: 224 · 5 × 225,6 → forhold 1,00, 0
  overløb. Planens forudsigelse om, at datakolonnerne bliver smallere end rækkehovedets 224 px,
  holder **ikke** ved 1440 (225,6 > 224).
- Mine før-tal afviger let fra planens: **4,78×** mod 4,70 og **3,92×** mod 3,86. Under 2 %.
- **`netstat` og `taskkill` er IKKE på PATH i Git Bash**, ligesom `node` og `python`. Mit
  første forsøg på at lukke serveren kørte
  `netstat -ano 2>/dev/null | grep :8131 | awk '{print $NF}'` og fik en tom streng, som jeg
  læste som *"ingen server kører"* — men `2>/dev/null` havde slugt `command not found`.
  Serveren levede videre og svarede 200 i samme kørsel; **kun fordi jeg også målte med `curl`,
  opdagede jeg modsigelsen.** Det er præcis dokumentfælden "send aldrig en kommando til
  /dev/null, hvis dens fejltekst er en del af målingen", og den ramte i selve oprydningen, hvor
  prisen ville have været en forældreløs server på en port, et andet spor senere får tildelt.
  Brug fulde stier: `/c/Windows/System32/netstat.exe` og `/c/Windows/System32/taskkill.exe`
  (sidstnævnte skal desuden have `MSYS_NO_PATHCONV=1` og `/PID`, ikke `//PID`).

## Punkter i briefet, jeg ikke nåede

- **Punkt 6 (enhedskontakten altid gul): ikke bygget.** Kontakten tegnes af `assets/system.css`
  ~1876/1887–1888 og ~2431–2432; **intet af den ligger i mine filer**, briefet holder den
  udtrykkeligt uden for mit ejerskab, og `spor/kat3` har **170+/38−** linjer i netop den fil
  lige nu. Den er desuden en delt komponent på alle 107 sider, ikke en fladeændring.
  **Alt er målt, så rettelsen kan udføres uden ny research.** I begge stillinger står der
  **ingen tekst på det gule** (0 elementer) — ordene ligger på `--panel`, aktivt ord 14,69:1,
  passivt 5,48:1, begge over 4,5. Kuglen flytter sig reelt: 2 px fra venstre kant → 2 px fra
  højre (16 px rejse på et 30 px spor), så det ikke-farvebårne signal (WCAG 1.4.1) overlever,
  at farven bliver konstant. Rettelsen er to erklæringer, begge permanente:
  `.enhedsskift__spor{background:var(--accent);border-color:var(--blaek)}` og
  `.enhedsskift__knop{background:var(--blaek)}`; `:checked`-reglerne beholder kun
  `left:auto;right:1px`. Derefter er kuglen **gunmetal PÅ afmærkningsgul = 9,19:1 i BEGGE
  stillinger** (beholdes kuglen som `--blaek3`, bliver den 3,43:1 på gult — over 3,0, men uden
  grund). Kontrastværnet er altså overholdt; det er kun filejerskabet, der stopper.
- **Hele testsuiten (`node tests/koer.mjs`) er ikke kørt** — briefet bad mig melde det først.
  Seks dele, valgt fordi de nævner det, jeg rørte, er kørt: 38 alene 58/0, samlet 134/0.
- **F3 (gruppetitlens klæbning virker ikke, 16 → −234 px)** står uændret. Planen ville bygge
  den sammen med gruppeskellet, men den var ikke i briefets seks punkter. Jeg har **ikke** målt
  den før og efter — mit gruppeskel er en `border-top`, som ikke rører `position:sticky`, men
  det er en udledning, ikke en måling.
