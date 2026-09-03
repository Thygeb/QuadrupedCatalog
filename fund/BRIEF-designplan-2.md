# BRIEF — designplanens punkt 4: den prioriterede liste

**Model: opus** (designspor, L45). **Worktree:** `C:\Praktik\websites\udstilling-wt-designplan`,
gren `spor/designplan`. **Du fortsætter et spor, der døde på session-grænsen —
arbejdet ligger i grenen, ikke i en samtale.**

**Din første handling: kald `spor`-skillen.** Den bærer grundmålingen,
skrive-grænsen, kontrollinjen, filejerskabet, selv-efterprøvningen,
rapportformen og miljøfælderne. Lykkes kaldet ikke fra worktreen, så læs
`.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at du gjorde det**.

**Kald derefter `design`-skillen.** Den er et navigationskort til DESIGN.md's
1.340 linjer og siger, hvilket afsnit der svarer på hvad — så du læser 40
linjer i stedet for 834. `impeccable critique` og `audit` er **lovlige** under
designfrysen (de rapporterer), hvis du får brug for dem; de 16, der retter en
flade, er det ikke.

---

## Det vigtigste først: sporet er meget mindre, end det oprindelige brief siger

**Punkt 1, 2 og 3 er FÆRDIGE.** Orkestratoren har målt det, ikke antaget det:

| Punkt | Status | Målingen |
|---|---|---|
| 1 — `--accent` som forgrund | færdig, `8397c6e` | committet |
| 2 — producentfladens komponentafsnit | færdig, `74b99c3` | committet |
| 3a — MODE som bærende begreb | **færdig** | `grep -cE "^#+ .*MODE" DESIGN.md` → **1**, afsnittet ligger ved linje 292-310 og fordeler fladerne |
| 3b — skriftskalaens manglende trin | **færdig** | `grep -c "DP3b" DESIGN.md` → **7**; `grep -ci "klaebebar" DESIGN.md` → **10** |
| 4 — den prioriterede liste | **MANGLER** | `ls fund/PLAN-designarbejde.md` → findes ikke |

**DP3b var ucommitteret, da sessionen døde. Orkestratoren har committet den
uændret som `7f0c2b0`** — ikke skrevet den, ikke rettet den, kun sikret den.
**Læs den commit først.** Den afgør klæbebarens skriftgrad (*Række, 14 px*) og
retter en fejl i sit eget forlæg (13 px ER et navngivet trin, *Mikro*).

**Er du uenig i DP3b's afgørelse, så skriv det i rapporten.** Den er ikke
efterprøvet af nogen — heller ikke af mig.

---

## GRUNDMÅLING — din første kommando efter skill-kaldene

Kør den, og **skriv tallene i rapporten**. Uden den kan du ikke svare på
*"var det mig, der ødelagde det?"*

```
git log --oneline -3
wc -l < DESIGN.md
git status --short
```

**Orkestratorens tal, målt 3. sep 2026 kl. ~21.50 — de er PÅSTANDE, ikke facit:**
HEAD er `7f0c2b0`, DESIGN.md er **1.340** linjer, arbejdstræet er **rent**.
**Afviger dine tal, så rapportér afvigelsen — det er en del af leverancen, ikke
ulydighed.**

---

## Punkt 4 — det eneste punkt

En **rangeret liste** over det designarbejde, der nu kan sendes.

**Den skal ligge i en NY fil: `fund/PLAN-designarbejde.md`.** Ikke i DESIGN.md.
Begrundelsen er en systembeslutning, du skal kende frem for at gætte:
**DESIGN.md er systemet, og et system er sandt indtil det ændres. En liste over
arbejde, der mangler, er sand i en uge.** Blandes de to, rådner DESIGN.md
indefra, og næste læser kan ikke se, hvad der er regel og hvad der er ønske.

**Rangér efter hvad det koster LÆSEREN**, ikke efter hvad der er lettest at bygge.

### Hvert punkt på listen skal bære fem ting

1. **Rang og en linje om, hvad læseren betaler i dag** — med et tal, hvor der findes et.
2. **Fladens MODE** (Operate eller Read). DESIGN.md's eget afsnit fordeler fladerne.
3. **Ét acceptkriterium**, formet som *"færdig, når `<kommando>` viser `<tal>`"*.
4. **Filejerskabet** — hvilke filer punktet ville eje, og hvilke det IKKE må røre.
5. **Om det er spærret**, og af hvad.

### Med på listen skal MINDST disse fem

| | Sagen | Det, der er målt |
|---|---|---|
| **F3** | Producentsiden handler mest om de andre producenter | 69 % af fladen, konstant **1715px** uanset producent |
| **F4** | Producentsiden har ingen kildemærker | **0** mod robotsidernes **72**, og fladen består udelukkende af tal |
| — | Producentindekset ved 390px | **277px** skjult, **0** rulleaffordancer |
| — | **Klæbebaren, retning B (SKINNEN)** | JPK har valgt retningen. **Var spærret af skriftgraden — DP3b har netop løst det.** Se `fund/PLAN-klaebebar.md` |
| — | **`impeccable typeset` på hele sitet** | JPK's valgte FØRSTE polish-spor. **55** forskellige skriftstørrelser, 18 trin alene i 9-20px |

**Alle tal i tabellen er PÅSTANDE fra tidligere spor.** Efterprøv dem, du bygger
en rangering på, og skriv hvilke du efterprøvede og hvilke du overtog.

### To ting, listen SKAL tage højde for, som ikke står i det gamle brief

**1. Polish-spor er SERIELLE her.** `assets/system.css` er **3170 linjer, 524
regler**, delt af alle flader — kun **13** regler er sammenligningsspecifikke og
**1** er om-os. To spor, der begge retter CSS, kan ikke køre samtidigt. **Skriv
i listen, hvilke punkter der kolliderer på `system.css`, og hvilke der ikke gør.**
Det er den eneste måde, en fan-out kan planlægges uden at opdage det for sent.

**2. `spor/certfacet` ejer `tools/skabelon/katalog.mjs` indtil videre**, og
klæbebarens strengbærer ligger i den fil på linje **1439-1474**. Klæbebar-punktet
skal derfor bære sin egen spærring: *venter på, at certfacet flettes.*

### Acceptkriterium 4 — kørt mod grenen i dag

```
ls fund/PLAN-designarbejde.md            → i dag: findes ikke
grep -c "^## " fund/PLAN-designarbejde.md → i dag: fejler (ingen fil)
```

**Færdig, når** filen findes, `grep -c "^## "` giver **mindst 5**, og hvert af de
fem obligatoriske punkter kan findes med `grep`. **Tallet 5 er et MINIMUM, ikke
et mål** — finder du flere, der er værd at sende, så tag dem med og skriv hvorfor.

**Den egentlige prøve, som ingen `grep` kan tage:** hvert punkt skal kunne sendes
som brief **uden yderligere afklaring**. Læs dine egne punkter som om du var
Sonnet-agenten, der modtog dem. Kan du komme i tvivl om, hvad der skal stå på
skærmen bagefter, er punktet ikke færdigt.

---

## Filejerskab — din grænse

**Du ejer:** `fund/PLAN-designarbejde.md` (ny), `fund/FUND-designplan-2.md` (din
rapport), og `DESIGN.md` **kun hvis** du finder en direkte fejl i det, du selv
skrev tidligere.

**Du ejer IKKE og må ikke røre:** `tools/`, `assets/`, `data/`, `tests/`,
`CLAUDE.md`, `STATUS.md`, `.gitignore`, `.claude/`. Ingen andre `fund/`-filer
end dine to.

**Andre spor lever samtidig:** `spor/certfacet` (rørt `katalog.mjs`, `side.mjs`,
i18n), `spor/fotofod` (`sammenligning.js`, `generator.css`, test 79), og
`udstilling-d9`s fase 2-spor (`fund/f2*`, databasens tekstkolonner). **Nul
overlap med dig, målt.**

---

## Miljø — det, der er særligt for netop dette spor

- **Kør IKKE `tests/koer.mjs` og IKKE `tools/build.mjs`.** Disken har **5,9 GB
  fri af 236**, og en testkørsel bruger op til 2,8 GB. Du har ikke brug for dem:
  du skriver et dokument, ikke kode.
- **Vil du SE fladerne, så brug de 21 skærmbilleder i
  `C:\Praktik\websites\skaermbilleder\2026-09-03\`** — seks flader × 1440/768/390,
  plus to fold-skud, skudt fra et frisk byg i dag. `LAESMIG.md` i mappen fortæller,
  hvad hver fil er. **Det er hurtigere og billigere end at starte en server.**
- Får du alligevel brug for en server: **egen port, 8151**, aldrig 8080, og
  start den fra projektroden med fuld sti til python. Verificér den mod disken,
  før ét eneste tal bruges.
- **`node.exe` læser en MSYS-sti som en Windows-sti.** Giver du `/c/Praktik/…`
  til node, skriver den i `C:\c\Praktik\…` og melder succes. Brug `C:/…`.

---

## Commits

**Ét commit til `fund/PLAN-designarbejde.md`, ét til rapporten.** Commit planen,
**før** du skriver rapporten — tre spor er døet midt i arbejdet på tre dage, og
et spor, der dør med commits, kan genoptages.

---

## Rapporten

`fund/FUND-designplan-2.md`. **Aldrig genbrug af et dokumentnavn** — `FUND-designplan.md`
er reserveret til det første spor. Højst 60 linjer plus skillens to obligatoriske
sektioner (*"Nye fælder og opdagelser"* og *"Punkter i briefet, jeg ikke nåede"*).

**Først en oversigt i konkrete termer**, ikke i målemetode: hvor mange punkter
listen har, hvilke tre der ligger øverst, og hvad hvert af dem koster læseren i
dag. JPK skal kunne godkende eller afvise **uden at læse en måleprotokol**.
Måling, konfidens og forbehold bagefter.

**Konfidens er bundet til bevistype, ikke fornemmelse.** Høj kræver en genkørbar
kommando **plus** en kontrafaktisk linje.

**Skriv udtrykkeligt:**
- hvilke af briefets tal du efterprøvede, og hvilke du overtog
- hvad du er UENIG i — også i DP3b, som du selv skrev, og som ingen har efterprøvet
- **hvad du ikke kunne afgøre.** En plan, der lader som om alt er afgjort, er
  farligere end en, der siger hvor den stopper

---

## Det, du IKKE skal gøre

**Du løfter ikke designfrysen.** JPK har sagt, at L70 løftes, **når planen
lander** — og "lander" betyder efterprøvet af orkestratoren og godkendt af ham,
ikke committet af dig. Skriv ikke i noget dokument, at frysen er ophævet.

**Du retter ingen flade.** Ingen CSS, ingen skabelon, intet HTML. Finder du en
fejl, hører den på listen som et punkt.
