# BRIEF — gør de ti CSS-assertions uafhængige af formatering

**Model: sonnet** (mekanisk arbejde med et målbart facit). **Worktree:**
`C:\Praktik\websites\udstilling-wt-prodtest`, gren `spor/prodtest`, forgrenet
fra `spor/producent` med `main` flettet ind.

**Din første handling: kald `spor`-skillen.** Den bærer grundmålingen,
skrive-grænsen, kontrollinjen, filejerskabet, selv-efterprøvningen,
rapportformen og miljøfælderne. Lykkes kaldet ikke fra worktreen, så læs
`.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at du gjorde det**.

**Ingen anden skill er relevant.** Ikke `robotdata` (ingen robotposter),
ikke `supabase` (ingen database), ikke `design` (du rører ikke design — se
nedenfor). Kald `fejljagt`, hvis en test opfører sig uventet.

---

## Baggrunden, i én sætning

Et spor omformaterede hele `assets/generator.css` — filen gik fra 1.620 til
3.073 linjer, hver regel fik afsluttende semikolon, `.1em` blev til `0.1em` og
`#FFFFFF` til `#ffffff`. **Reglerne er de samme; kun deres skrivemåde er ny.**
Ti assertions leder efter den gamle, kompakte skrivemåde og kan ikke finde dem.

**JPK har besluttet, at omformateringen bliver, og at testene skal omskrives.**

---

## GRUNDMÅLING — din første kommando efter skill-kaldet

```
node tests/koer.mjs
```

**Orkestratorens tal, målt på `spor/producent` 3. sep 2026 kl. ~22.30 — en
PÅSTAND, ikke facit:** **1734 bestået, 10 fejlet.** Dine ti er:

```
K10 · K10b     tests/dele/12-enheder.mjs
5c             tests/dele/14-afslutning-oprydning.mjs
30.19          tests/dele/30-filtreret-sandhed.mjs
31.8 · 31.15 · 31.17 · 31.18   tests/dele/31-pudsning.mjs
74.1 · 74.2    tests/dele/74-rammebeskaering.mjs
```

**Afviger dine tal, så rapportér afvigelsen** — det er en del af leverancen,
ikke ulydighed. Får du et helt andet antal fejl, så STOP og meld frem for at
rette videre.

---

## Opgaven — og den regel, der er vigtigere end opgaven

**Hver assertion skal fortsætte med at bevise PRÆCIS det, den beviser i dag.**
Du gør den uafhængig af mellemrum og skrivemåde. Du sænker den ikke.

**Det forbudte, sagt konkret:** en assertion, der i dag kræver
`position:sticky;top:0` og som du ændrer til bare at lede efter `sticky`,
er **sænket** — den ville nu bestå på en regel uden `top:0`. Kræver den to
egenskaber, skal din nye udgave stadig kræve begge to.

**Den anbefalede metode: normalisér FILEN, ikke mønsteret.** Læs CSS'en ind,
fjern kommentarer, fjern al whitespace, fjern afsluttende semikolon før `}`, og
normalisér tal med foranstillet punktum (`.1em` → `0.1em`) og hex til småt.
Søg derefter i den normaliserede streng med de mønstre, testen allerede har.
Så virker testene på BEGGE skrivemåder, og de kan ikke sænkes ved et uheld.

En normaliserer, der virker — orkestratoren har kørt den:

```js
const rens = (s) => s
  .replace(/\/\*[\s\S]*?\*\//g, '')          // kommentarer
  .replace(/;\s*}/g, '}')                     // afsluttende semikolon
  .replace(/\s+/g, '')                        // al whitespace
  .replace(/([:,(\s])\.(\d)/g, '$10.$2')      // .1em -> 0.1em
  .replace(/#([0-9A-Fa-f]{3,8})\b/g, (m) => m.toLowerCase());
```

**Ligger den samme rensning i flere testfiler, så læg den ét sted** efter
kontrakten i `tests/LAESMIG.md`, og peg på den fra hver fil. Fem håndskrevne
kopier divergerer ved den sjette.

---

## Punkterne, i den rækkefølge de skal udføres

**1.** `tests/dele/74-rammebeskaering.mjs` — 74.1 og 74.2. Start her, fordi den
har præcis to og er den mindste. Commit.
**2.** `tests/dele/31-pudsning.mjs` — 31.8, 31.15, 31.17, 31.18. Commit.
**3.** `tests/dele/12-enheder.mjs` — K10 og K10b. Commit.
**4.** `tests/dele/14-afslutning-oprydning.mjs` — 5c. Commit.
**5.** `tests/dele/30-filtreret-sandhed.mjs` — 30.19. Commit.

**Commit efter hvert punkt.** Tre spor er døet midt i arbejdet i dette projekt
på tre dage; et spor, der dør med commits, kan genoptages.

---

## Acceptkriterium — ét, og det er kørt mod grenen i dag

```
node tests/koer.mjs
```

**Giver i dag: 1734 bestået, 10 fejlet.**

**Færdig, når den giver 0 fejlet OG samme samlede antal som i dag** — altså
**1744**. Tallet 1744 er et **KRAV**, ikke et gæt: du hverken tilføjer eller
fjerner assertions, så summen skal være uændret. **Får du et andet total, har
du ændret på antallet, og det er en fejl.**

**Og et acceptkriterium mere, som er det egentlige værn:** for hver af de ti
skal du i rapporten skrive **hvad den kræver før og efter**, så en læser kan se,
at kravet er det samme. Uden den linje er en grøn test ikke et bevis.

---

## Filejerskab — din grænse

**Du ejer:** de fem testfiler ovenfor, en eventuel ny fælles hjælpefil i
`tests/`, og `fund/FUND-prodtest.md`.

**Du må IKKE røre:** `assets/generator.css`, `assets/system.css`,
`data/i18n/*`, `tools/`, `data/robots/`, `DESIGN.md`, `STATUS.md`, `CLAUDE.md`
eller nogen anden fil i `tests/dele/`. **Går en test rød, fordi CSS'en er
forkert, så RET IKKE CSS'EN — meld det.** Det ville være at rette beviset i
stedet for sagen.

**Andre spor lever samtidig:** fem fase 2-spor i den anden session (kun
`fund/f2*` og databasen) og Antigravitys `spor/producent`, som din gren
stammer fra. **Nul overlap med dine filer.**

---

## Miljø

- **Egen port, hvis du får brug for en server: 8203.** Aldrig 8080.
- Du må køre `node tests/koer.mjs` og `node tools/build.mjs` i DIN worktree.
  Disken har ~9 GB fri; ryd `tests/.tmp-koersel` mellem kørsler, hvis den vokser.
- **`node.exe` læser en MSYS-sti som en Windows-sti.** Giver du `/c/Praktik/…`
  til node, skriver den i `C:\c\Praktik\…` og melder succes. Brug `C:/…`.
- **`grep -P` virker ikke på denne maskine** (*"supports only unibyte and UTF-8
  locales"*) og giver falske mismatch. Brug `awk -F'\t'` eller node i stedet.

---

## Rapporten

`fund/FUND-prodtest.md`, højst 60 linjer plus skillens to obligatoriske
sektioner.

**Først en tabel med de ti**: testnummer, hvad den krævede før, hvad den
kræver nu. Derefter målingerne. **Skriv udtrykkeligt, hvis du er i tvivl om,
at en af dine omskrivninger beviser det samme** — en test, der er blevet
svagere uden at nogen opdagede det, er værre end en rød test.
