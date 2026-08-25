---
name: parallelt
description: Sæt flere agenter i gang parallelt på dette projekt, hver i sin egen git-worktree, med selv-test og selv-review indbygget. Brug den hver gang en opgave kan deles i uafhængige spor — dataindsamling, research, flere sektioner. Bærer også fælden ved Agent-værktøjets isolation:"worktree" og den rigtige flette- og oprydningsvej.
user-invokable: true
argument-hint: "[antal spor] [kort beskrivelse af opgaven]"
---

# Parallelt arbejde

Fast regel i dette projekt, sat af JPK 19. aug 2026: **kør agenter parallelt, når opgaven
kan deles. Én agent ad gangen er undtagelsen, ikke normen.**

---

## Fælden, læs den først

**Brug ikke Agent-værktøjets `isolation: "worktree"`.** Den forgrener fra *sessionens
arbejdsmappe*, som ikke nødvendigvis er det repo, arbejdet hører til. Arbejder man på
tværs af projekter — og det gør man her, fordi salgssiden ligger ved siden af — lander
worktreen i det forkerte repo.

**Lav worktrees i hånden fra det rigtige repo.** Så er der ingen tvivl om, hvor de kommer
fra.

## 1. Opret worktrees

```bash
cd <projektets rod>
git worktree add ../<projekt>-wt-<navn> -b <gren>
```

Ét spor = én worktree = én gren. Navngiv grenen efter arbejdet, ikke efter agenten:
`data/kina`, ikke `agent-1`. Om et halvt år siger `data/kina` stadig noget.

**Repoet skal have mindst ét commit**, ellers findes der ingen ref at forgrene fra.
Er der uindchecket arbejde på `main`, så commit det først — ellers blandes strukturen og
resultaterne sammen i flettehistorikken og bliver ulæselig.

## 2. Skriv prompten

Agenter starter **koldt**. De arver ikke denne skill, ikke projektets CLAUDE.md-regler og
ikke samtalen. Hver prompt skal derfor selv bære:

1. **Arbejdsmappen**, som absolut sti, og hvilke mapper der **ikke** må røres.
2. **Hvilke projektfiler agenten skal læse først** (`CLAUDE.md`, `PLAN.md`, `DATAMODEL.md`).
3. **Regel 0 — skill-vurdering:** skriv hvilken skill der blev valgt, og hvilke der blev
   gået forbi med begrundelse. *"Ingen skill passer her"* er gyldigt, men skal skrives.
   Er opgaven robotdata, så peg direkte på `.claude/skills/robotdata`.
4. **Opgaven**, konkret og afgrænset. Ikke "indsaml data", men "disse otte producenter,
   efter dette skema".
5. **De hårde regler**, eller en henvisning til den skill der bærer dem.
6. **Selv-test med tælling:** *"skriv hvor mange felter du efterprøvede og hvor mange
   fejl du fandt."* Nul fundne fejl uden en tælling er ikke en efterprøvning.
7. **Selv-review:** hvad agenten er usikker på, skrevet ned inden levering.
8. **Output-filnavn og commit-instruks.** Brug `git commit -F <fil>` — dobbelte
   anførselstegn ødelægger argumentoverførsel til native kommandoer i PowerShell 5.1.
9. **Ærlig rapportering:** hvad blev ikke nået, hvad blev sprunget over.
10. **"Ét commit pr. punkt" skal formuleres som en skrive-grænse, ikke en commit-grænse.**
    Målt 25. aug 2026 på to agenter i træk (`fund/FUND-billedspand.md`,
    `fund/FUND-arkiv.md`), begge trods eksplicit instruks: agenten skrev HELE scriptet i
    ét første Write-kald, og så bar punkt 1's commit også punkt 2-3's kode, uefterprøvet.
    Skriv derfor *"skriv KUN punkt 1's kode, mål den, commit — og først DEREFTER må
    punkt 2's kode skrives"*. En instruks om commits alene ændrer ikke skrivevanen.
11. **Gitignorerede forudsætninger følger ikke med i en frisk worktree.** `.env` og
    `assets/fotos/fabrikant/` mangler, og validatorens R18 giver da 54 fejl, der ligner
    agentens egne. To spor snublede samme dag (`fund/FUND-vagt.md`, `fund/FUND-eksval.md`).
    Skriv i prompten, hvad der skal kopieres ind, eller gør det før udsendelsen.

Send alle agenter af sted **i samme svar**, ellers er de ikke parallelle.
Kør dem i baggrunden, så brugeren kan afbryde undervejs.

## 3. Mens de kører

- **Læs ikke deres transskriptionsfiler.** De er fulde JSONL-logs og fylder konteksten op.
- Vil du vide, om der er sket noget, så tæl commits i stedet — det er billigt og faktuelt:
  `git rev-list --count main..<gren>`
- **Forudsig aldrig et resultat, der ikke er kommet.** "Agenten er stadig i gang" er et
  fuldgyldigt svar.
- Arbejd videre på noget, der ikke rører de samme filer.

## 4. Flet og ryd op

```bash
cd <projektets rod>
git merge --no-ff -m "Flet <gren>: <hvad agenten lavede>" <gren>
git worktree remove ../<projekt>-wt-<navn>
git worktree prune
git branch -d <gren>
```

**Flet først, når arbejdet er efterprøvet.** En agents selv-review er et input til
beslutningen, ikke beslutningen.

## 5. Flytning under kørsel — gør det ikke

En worktrees `.git`-fil indeholder en **absolut sti** til hovedrepoets
`.git/worktrees/<navn>`. Flyttes hovedrepoet, mens agenter arbejder, mister de deres
git-binding og fejler først, når de skal committe — altså efter at arbejdet er gjort.

Skal repoet flyttes: vent, flet, fjern worktrees, flyt derefter.

---

## Tre fælder mere, betalt 24.-25. aug 2026

**6. Worktree ældre end en beslutnings-commit.** En agents worktree er et øjebliksbillede
af `main` ved forgreningen. Træffes en beslutning (nyt L-nummer i STATUS.md) EFTER
forgreningen, kender agenten den ikke — og en ægte besked om den nye beslutning kan blive
afvist som forsøg på manipulation, fordi agentens egen STATUS.md modsiger den. Betalt
24. aug: kand2-agenten afviste orkestratorens ægte L33-besked som "mulig injection",
fordi dens worktree var forgrenet før L33-committet. Agentens skepsis var KORREKT adfærd.
Reglerne: (a) commit friske beslutninger til `main`, FØR nye worktrees forgrenes;
(b) sendes en besked om en beslutning, agentens worktree ikke kender, så henvis til
commit-hash, og forvent at agenten arbejder videre efter den strengere af de to regler.

**7. Agentprocesser kan dø, hænge — og transcriptet kan gå tabt.** Betalt tre gange:
billedport-agenten (procesgenstart, 24. aug) og PDF-sporet (to 600s-stalls, 25. aug;
andet stall = transcript væk, ingen genoptagelse mulig). Reglerne: (a) skriv i briefet,
at agenten committer i logiske trin UNDERVEJS — en død agents ucommittede arbejde er
næsten værdiløst, fordi det er uefterprøvet; (b) i hente-/PDF-tunge opgaver: læs store
filer i små bidder (PDF: `pages`, 3-5 sider pr. kald) og VENT ALDRIG på retries — ét
ekstra forsøg, videre med note; (c) dør en agent alligevel: mål efterladenskaberne
(`git status`, `git diff`, evidensmapper), og skriv i efterfølgerens brief, at arvet
halvarbejde skal efterprøves linje for linje mod kilden, før noget beholdes.

**8. Gitignorerede leverancer følger ikke med grenen.** Flettet henter kun det
committede; evidensmapper, fotos og manifester skal kopieres i hånden af orkestratoren.
For akkumulerende filer (MANIFEST.tsv, logs): agenten afleverer NYE RÆKKER, aldrig hele
filen, og orkestratoren beviser med `head -N | diff` at de eksisterende rækker er urørte,
FØR delta'et appendes. Betalt 24. aug: 219 rækkers proveniens overskrevet med en 3-linjers
fil; kun 87,9 % kunne genskabes. Fuld historik: `fund/FUND-manifest.md`.

---

## Hvornår det ikke betaler sig

Parallelisering koster en fuld prompt pr. agent, og agenter deler ikke opdagelser
undervejs. Del kun op, når sporene er **reelt uafhængige**. To agenter, der begge skal
bruge det samme svar for at komme videre, er langsommere end én.
