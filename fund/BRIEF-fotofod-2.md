# BRIEF — fotofod: efterprøv det, der aldrig er blevet kørt

**Model: sonnet.** **Worktree:** `C:\Praktik\websites\udstilling-wt-foto2`,
gren `spor/fotofod` med `main` flettet ind (konflikten i `generator.css` er løst
af orkestratoren — se nedenfor).

**Din første handling: kald `spor`-skillen.** Lykkes kaldet ikke fra worktreen,
så læs `.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at du
gjorde det**. Kald `fejljagt`, hvis noget opfører sig uventet.

---

## Situationen, i tre sætninger

Sporet døde på en session-grænse. **Alle tre punkter er skrevet og committet**
— `<tfoot>`-strukturen i `assets/sammenligning.js`, CSS'en i
`assets/generator.css`, og `tests/dele/79-fotofod.mjs`. **Men test 79 har
aldrig kørt.** Din opgave er ikke at bygge; den er at bevise.

**En test, der aldrig har kørt, er en hypotese.** Den kan være grøn af den
forkerte grund, rød af en tastefejl, eller slet ikke være med i kørslen.

---

## GRUNDMÅLING — din første kommando efter skill-kaldet

```
node tools/validate.mjs
node tools/build.mjs
node tests/koer.mjs
```

**Rækkefølgen er ikke valgfri.** Testene læser fra `dist/`, så et manglende byg
giver ~16 falske fejl med tekster som *"der ER bygget sider at måle på"*.
Fabrikantbillederne er allerede kopieret ind (610 filer).

**Orkestratorens tal, PÅSTANDE:** main gav i aften **1749 bestået, 0 fejlet**.
Denne gren har test 79 oveni, som main ikke har. **Skriv dit eget tal.**
**Måler du røde tests, så STOP ikke — det er hele pointen med sporet.** Find ud
af, om de er 79's egne eller noget andet, og meld begge dele hver for sig.

---

## Punkt 1 — kører test 79 overhovedet med?

`tests/LAESMIG.md` beskriver kontrakten for, hvordan en fil i `tests/dele/`
kommer med i kørslen. **Mål, at 79 faktisk kaldes** — ikke at filen findes.

**Acceptkriterium 1:** `node tests/koer.mjs` nævner test 79's overskrift i sit
output, og suitens samlede antal er **1749 plus præcis dine 79-assertions**.
Stemmer summen ikke, mangler nogle assertions i kørslen.

---

## Punkt 2 — er 79 grøn af den RIGTIGE grund?

For hver assertion i 79: **vis et revert-bevis.** Bryd det, den påstår, og vis
at den falder rød. En assertion uden revert-bevis kan ikke skelnes fra en, der
altid består — det er præcis den kontrol, testfil 76 og 35 allerede bruger.

**Acceptkriterium 2:** rapporten har én linje pr. assertion i 79: hvad den
kræver, og hvilken ændring der får den til at falde. Kør reverterne i en
midlertidig kopi eller rul dem tilbage — **efterlad ikke et brudt repo.**

---

## Punkt 3 — ser fladen rigtig ud, og holder de fire datatilstande?

Det, JPK bad om, ordret: *"Fodnoter til foto skal være i deres respektive
kollonner."* Før stod fotokreditten som **én linje under hele tabellen**; nu
skal den stå **pr. kolonne** i en `<tfoot>`.

**Mål på den byggede side, ikke i kilden:**

- `dist/da/sammenligning/index.html` — men bemærk: **matricen bygges
  KLIENTSIDE af `assets/sammenligning.js`.** Et `grep` i `dist/` kan ikke se
  den. Orkestratoren tog fejl af netop det i dag. **Brug browseren:**
  `node C:/Praktik/websites/maalevaerktoej/flade-skud.mjs <url> 1440 <udfil.png>`
  og læs billedet, eller mål med Playwright-MCP'en, hvis den svarer.
- **Server: din egen port 8205**, aldrig 8080, startet fra worktree-roden med
  fuld sti til python. **Verificér serveren mod disken, før ét tal bruges.**

**Acceptkriterium 3:** rapporten viser antallet af `<td class="saml-fotofod__celle">`
i den KØRENDE side (ikke i kilden), og at tallet svarer til antallet af valgte
robotter med fabrikantfoto. Plus ét skærmbillede, du selv har set på.

---

## Det, der er ændret under dig, og som du skal kende

**`assets/generator.css` er blevet omformateret på main** — filen gik fra 1.620
til 3.073 linjer, hver regel har nu én egenskab pr. linje. **Orkestratoren har
løst flettekonflikten** ved at skrive dine to `.saml-fotofod__`-regler om i den
nye formatering; indholdet er uændret. **Efterprøv det:** reglerne skal stadig
genbruge `var(--linje)` og `var(--blaek2)` og ikke indføre nye farver.

To andre spor har rørt samme fil siden: fokusringen bruger nu `var(--ring)`, og
`.saml-fotofelt__ord` er blevet tilgængelighedstekst. **Rør ingen af delene.**

---

## Filejerskab

**Du ejer:** `tests/dele/79-fotofod.mjs`, `assets/sammenligning.js`,
`assets/generator.css` **men kun `.saml-fotofod__*` og `.saml-fotoophav`**, og
`fund/FUND-fotofod.md`.

**Du må IKKE røre:** nogen anden regel i `generator.css`, hele `system.css`,
`tools/`, `data/`, `DESIGN.md`, `STATUS.md`, `CLAUDE.md`, og **ingen anden fil
i `tests/dele/`** — `spor/certfacet` arbejder samtidig i 35, 77 og 78.

---

## Miljø

- **Disken er presset.** Kør `tests/koer.mjs` **så få gange som muligt** —
  grundmålingen og én gang til sidst. Brug `build.mjs` + `grep` til mellemtjek.
- **Kør ALDRIG `rm -rf` på `tests/.tmp-koersel`** — den står i
  `.claude/settings.json`s deny-liste. Er disken fuld, så MELD det og stop.
- **`node.exe` læser `/c/...` som `C:\c\...`** og melder succes. Brug `C:/...`.
- **`grep -P` virker ikke her.** Brug `awk` eller node.

---

## Rapport

`fund/FUND-fotofod.md`, højst 60 linjer plus skillens to obligatoriske
sektioner. **Først en tabel: hver assertion i 79, hvad den kræver, og hvilken
revert der fælder den.** Derefter målingerne og skærmbilledet.

**Skriv udtrykkeligt, hvis en assertion viser sig ikke at bevise noget** — det
er et bedre resultat end at få den grøn.
