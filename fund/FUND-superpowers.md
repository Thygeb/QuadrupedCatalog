# FUND-superpowers.md — kan obra/superpowers bruges her?

27. aug 2026. Bestilt af JPK. Grillet med `grillmig` (job 2: gril en åben
beslutning, før den låses).

**Dom: installér den ikke. Stjæl to af dens skills i hånden i stedet.**

Grundlaget er ikke en fornemmelse: jeg har talt overlappet mod projektets egne
regler, læst den faktiske tekst i tre af dens SKILL.md-filer, og fundet ét
hårdt sammenstød og ét, der er værre — dens hook.

---

## G1 — [Blocker] Den installerer en SessionStart-hook, der konkurrerer med vores egen

**Hvad superpowers gør:** `hooks/session-start` indsætter tekst i *hver*
session, indrammet som `<EXTREMELY_IMPORTANT>`, med ordlyden:

> *"You have superpowers. Below is the full content of your
> 'superpowers:using-superpowers' skill — your introduction to using skills.
> For all other skills, use the 'Skill' tool."*

Derefter følger hele `using-superpowers/SKILL.md`.

**Hvorfor det ikke holder:** projektet har allerede en `UserPromptSubmit`-hook i
`.claude/settings.json`, som ved hver eneste instruks indskærper *vores* regel:
skill-vurdering først, worktree pr. agent, selv-test med tælling, rør aldrig
salgssiden. **To hooks, der begge hævder forrang, og den ene er ikke skrevet til
dette projekt.** Når de er uenige, følger agenten den, den læste sidst — og det
er ikke en regel, det er et lotteri.

**Hvad der lukker den:** en måling, der viser, at de to hooks kan sameksistere
uden at nogen af dem taber. Den måling findes ikke, og den kan først tages efter
installationen — hvilket er den forkerte rækkefølge for en spærring.

---

## G2 — [Blocker] Otte af dens femten skills er en anden udgave af regler, vi allerede har

Optalt mod projektets egne dokumenter:

| Superpowers-skill | Findes her allerede som |
|---|---|
| `using-git-worktrees` | `.claude/skills/parallelt` + CLAUDE.md's worktree-instruks |
| `dispatching-parallel-agents` | samme |
| `subagent-driven-development` | Modelfordelingen (24. aug) + den faste arbejdsgang (25. aug) |
| `writing-plans` | Briefets rygrad + ARBEJDSGANG-2 O3 |
| `requesting-code-review` | Orkestratorens fire skridt |
| `receiving-code-review` | De tre udfald: flet / flet efter rettelse / afvis |
| `verification-before-completion` | Konfidensskalaen med den kontrafaktiske linje |
| `finishing-a-development-branch` | *"Et spor er ikke færdigt, før worktreen er væk"* |

**Hvorfor det ikke holder:** CLAUDE.md bærer selv reglen, der forbyder det:

> *"Skriv aldrig reglerne af i hånden ind i en agentprompt. Peg på skillen.
> Tre håndskrevne kopier af samme regel divergerer ved den fjerde."*

At installere superpowers er at anskaffe **en niende kopi af otte regler**, som
vedligeholdes af en anden, ændrer sig på hans kadence og er formuleret
anderledes end vores. Divergensen er ikke et spørgsmål om *om*, men om *hvornår*.

**Hvad der lukker den:** at vi opgiver vores egne otte og lader superpowers være
kilden. Det er et gyldigt valg — men så skal `parallelt`, modelfordelingen og
arbejdsgangen slettes, ikke ligge ved siden af.

---

## G3 — [Major] Den forbyder det, dette projekt har målt virker

`subagent-driven-development` siger:

> *"Never dispatch multiple implementation subagents in parallel (conflicts)."*

JPK's stående regel fra 19. aug 2026 siger det modsatte:

> *"Kør agenter parallelt, når opgaven kan deles. Én agent ad gangen er
> undtagelsen, ikke normen."*

**Målingen afgør det, og den er vores egen:** 26. aug kørte **fire
implementeringsspor parallelt** — instrument2, hastighed, testdele, data2 — med
**nul filkollisioner** og nul flettekonflikter. Det virkede, fordi filejerskabet
blev skåret på forhånd og hver agent fik sin egen worktree.

Superpowers' egen `dispatching-parallel-agents` er blødere og forbyder kun
parallelitet, når *"agents would interfere with each other"*. Det er præcis den
interferens, worktrees og filejerskab fjerner. **Forbuddet er altså ikke forkert
— det er skrevet til en opsætning uden vores værn.** Men det står som et absolut,
og en agent, der læser det, vil holde op med at parallelisere.

---

## Behold dette

**Superpowers er ikke dårlig. Den er uafhængig bekræftelse.** Tre af dens regler
er nået frem til nøjagtig samme konklusion som dette projekt, uden kontakt:

| Superpowers | Her |
|---|---|
| *"Always specify the model explicitly when dispatching a subagent. An omitted model inherits your session's model — often the most capable and most expensive, which silently defeats this section."* | JPK's regel 24. aug, sat efter at to spor døde af netop det |
| *"Never fix findings yourself in the controller session — your context stays clean for coordination, and controller fixes skip review."* | *"Orkestratoren implementerer aldrig selv"* |
| *"The final whole-branch review — dispatch it on the most capable available model, not the session default."* | *"Reviews og analyser er ALDRIG Sonnets"* |

At to uafhængige hold rammer den samme tredobbelte konklusion er det stærkeste
argument, der findes, for at reglerne er rigtige. **Det er værd at skrive ind i
CLAUDE.md som ekstern bekræftelse — uden at installere noget.**

---

## De to, vi ikke har

| Skill | Vurdering |
|---|---|
| `systematic-debugging` | **Ægte hul.** Projektet har intet om struktureret rodårsagsjagt. Filerne `root-cause-tracing.md`, `defense-in-depth.md` og `find-polluter.sh` er direkte relevante — vi har haft mindst tre fejl i denne uge, hvor en måling pegede på symptomet (mit `<li>`-regex, det falske `diff` på tomme filer, `grep -P`-fejlen) |
| `test-driven-development` | **Delvist.** RED-GREEN-REFACTOR passer på `tools/`, men ikke på et YAML-katalog — deliverancen er data, ikke funktioner. Projektet har i forvejen *"ret assertions, slet dem ikke"* og en vagt-kultur, der er stærkere end de fleste. **Værdien er lav nok til at vente** |

## Anbefaling

1. **Installér ikke.** G1 og G2 er blokerende, og G1 kan ikke måles væk på forhånd.
2. **Læs `systematic-debugging` fra repoet og skriv en projekt-skill** — vores
   egen, i `.claude/skills/`, som følger med worktreen og bruger vores sprog.
   Det er det ene sted, hvor superpowers dækker et hul, vi faktisk har.
3. **Skriv den tredobbelte bekræftelse ind i CLAUDE.md** ved modelfordelingen.
   En regel, to hold er nået frem til uafhængigt, skal ikke genforhandles af
   den næste agent, der synes den er besværlig.

## Genoptagelsesbetingelse

Genovervej installationen, hvis **enten** vores egen hook fjernes (så G1
bortfalder), **eller** vi beslutter at opgive `parallelt` + modelfordelingen +
arbejdsgangen og lade superpowers være kilden (så G2 bortfalder). Begge dele er
gyldige valg. Halvvejs er det ikke.

## Selv-tjek

Grillet 4 beslutningsspørgsmål (B1-B4), 0 ubesvarede. 3 indvendinger, heraf
**2 blokerende**.

**B1 alternativer og pris:** installér alt (pris: to hooks, ni kopier af otte
regler) · installér ikke (pris: vi går glip af `systematic-debugging`) · stjæl i
hånden (pris: vi vedligeholder selv, og opdateringer kommer ikke af sig selv).
**B2 målingen, der afgør:** overlapstællingen ovenfor — 8 af 15 skills dækket,
2 nye, 5 irrelevante eller redundante med installerede plugins.
**B3 tidligere beslutning imod:** ja, CLAUDE.md's forbud mod kopierede regler,
citeret i G2. Intet har ændret sig siden.
**B4 dyreste fejl:** at to hooks skændes i hver session, uden at nogen opdager
hvilken der vandt. Det viser sig som agenter, der pludselig arbejder anderledes,
og årsagen vil være usynlig i git.

---

# Efterskrift 27. aug 2026 — den svage del er nu lukket

JPK bad om, at spørgsmålet blev afgjort ordentligt. Jeg har læst **alle seks**
overlappende SKILL.md-filer i fuld tekst (ikke fem — min egen optælling var
forkert i selv-reviewet nedenfor). Analysearbejde, så orkestratoren gjorde det
selv; intet spor sendt.

## Svaret: nej, deres er ikke bedre — men vores er ikke færdige

Hoved mod hoved på de seks:

| Skill | Hvem er stærkest | Hvorfor |
|---|---|---|
| `using-git-worktrees` | **Vores, klart** | Deres skriver selv, at den *"does not address untracked files, environment files, or worktree cleanup"* — det er præcis de tre steder, vi har betalt for vores regler (MANIFEST-tabet, de 54 valideringsfejl fra manglende billeder, de fire låste mapper) |
| `writing-plans` | **Vores, fittet bedre** | Deres skriver *koden* ind i planen og deler i 2-5-minutters trin — designet til én sekventiel implementer. Vores skriver *acceptkriteriet* og passer på et spor, der kører 20-40 minutter. Og vores har *"et tal i et brief er enten et krav eller et gæt"*, som de intet har |
| `verification-before-completion` | **Vores, skarpere** | Vores tre-trins konfidensskala med den **kontrafaktiske linje** er mere generel end deres røde-grønne cyklus, som kun gælder regressionstests |
| `requesting-code-review` | **Uafgjort** | Deres har SHA-afgrænset kontekst; vores har modelkravet og udfaldet *"afvis"*, som de mangler helt. **Deres modsiger desuden sig selv:** her er reviewer en `general-purpose` uden modelkrav, mens `subagent-driven-development` kræver den mest kapable model |
| `receiving-code-review` | **Vores på rapportering, deres på ét punkt** | Vores har rapportform, konfidens og de to obligatoriske sektioner; deres har *"IF any item is unclear: STOP — do not implement anything yet"*, som vi ikke har |
| `finishing-a-development-branch` | **Deres, på to punkter** | Se nedenfor. Det er den eneste, hvor de reelt slår os |

**Ingen af de otte skal erstattes.** Men syv konkrete regler mangler hos os, og
to af dem er huller, ikke forfinelser.

## De to huller, der betyder noget — begge i oprydningen

**1. Vi kører ikke tests på det FLETTEDE resultat som en skreven regel.**
Superpowers: *"On merge, tests must pass again on the merged result before
cleanup proceeds."* Målt i CLAUDE.md: ordene findes ikke. Jeg gjorde det i
praksis efter hvert flet i går, men en vane er ikke en regel — og et flet kan
knække det, ingen af de to grene knækkede.

**2. Vi har ingen regel mod at `--force`-fjerne en worktree.**
Superpowers: agenten *"never force-removes without human authorization"* og
viser i stedet, hvad der ligger, hvis der er ucommittede filer. Målt:
`grep -c "force" CLAUDE.md` giver **0** — ordet står ikke i vores regler.
**Jeg brugte `--force` på hver eneste worktree-fjernelse 26.-27. aug.** Det gik
godt hver gang, men det gik godt *på trods af* reglen, ikke på grund af den. Det
er nøjagtig den form, arbejde forsvinder i uden et spor i git.

## De fem øvrige, værd at stjæle

3. **Forbud mod færdigmeldingssprog før verifikation** — *"should work"*,
   *"probably"*, *"Great!"*, *"Done!"*. Vi kræver et tal, men forbyder ikke
   sætningen, der lyder som et tal.
4. **Forbud mod stedfortræder-signaler** — *"linter passing ≠ build
   succeeding"*. Vi er faldet i den: mit `grep dist/`-kriterium var for bredt,
   og mit `<li>`-regex målte det forkerte.
5. **Pladsholder-scanning af briefet, før det sendes** — deres `writing-plans`
   har en navngiven liste over mønstre at søge efter (*"TODO"*, *"similar to
   Task N"*, trin uden kodeblok). Det er ARBEJDSGANG-2's `brief`-skill, som blev
   besluttet og aldrig bygget.
6. **Isolationsdetektion før worktree-oprettelse** — `GIT_DIR` mod
   `GIT_COMMON`, med en vagt mod submoduler. Vi antager, at vi ved, hvor vi er.
7. **SHA-afgrænset reviewkontekst** — *"precisely crafted context for
   evaluation — never your session's history."* Når jeg reviewer, bærer jeg hele
   sessionens kontekst med og kan være forudindtaget af mit eget brief.

## Dommen står, men grunden er skiftet

**Installér stadig ikke** — G1 (de to hooks) og G2 (ni kopier af otte regler) er
uændrede, og de er strukturelle. Men grunden er ikke længere *"vores er bedre"*.
Den er: **vores er bedre fittet, og de syv ting, de kan, kan skrives ind hos os
for en brøkdel af prisen ved at have to systemer.**

**Genoptagelsesbetingelsen fra ovenfor gælder uændret.**

## Selv-review

**Det jeg ikke kunne måle:** om superpowers' hook faktisk overskriver eller blot
supplerer vores. Det kan kun afgøres ved at installere den, og det er netop det,
spærringen handler om — så jeg har ladet den stå som en spærring frem for at
teste den. Det er en bevidst asymmetri: prisen ved at tage fejl den ene vej er
en manglende skill, den anden vej er en arbejdsgang, der skrider usynligt.

**Den ubehagelige indvending, jeg ikke lod være med at skrive:** hvis
superpowers' otte overlappende skills er *bedre skrevet* end vores otte
håndlavede regler, er det rigtige svar ikke "installér ikke" — det er "erstat
vores med dens". Jeg har ikke læst alle otte grundigt nok til at afgøre det, og
jeg har kun læst tre af dem i fuld tekst. **Det er den svageste del af denne
grilning.**
