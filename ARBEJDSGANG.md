# Evaluering af arbejdsgange og skills

Skrevet 19. august 2026, efter den første arbejdsdag på projektet. Bestilt af JPK med
fokus på **autonomi** og **parallelt agentarbejde**.

Skill-vurdering for denne opgave: `update-config` (hooks og permissions — det eneste sted
noget kan ske automatisk uden at nogen husker det) og `fewer-permission-prompts`
(allowlist). Gik forbi: `new-project` (git, .gitignore og CLAUDE.md findes allerede),
`impeccable` (visuel retning, ikke påbegyndt endnu).

---

## Målingen

Ikke et skøn. Otte værktøjskald i dagens session gik tabt på ting, der kunne have været
vidst på forhånd:

| # | Hvad fejlede | Hvorfor | Kald tabt |
|---|---|---|---|
| 1 | `node` | Ikke på PATH i Git Bash. Ligger i `/c/Program Files/nodejs/node.exe` | 1 |
| 2 | `python` | Samme. Ligger i `/c/Users/thyge/AppData/Local/Programs/Python/Python314/` | 1 |
| 3 | `jq` | Findes slet ikke på maskinen — men optræder i alle hook-eksempler | 1 |
| 4 | Bash-heredoc | Knækkede på et langt markdown-dokument. Write-værktøjet klarede det uden videre | 1 |
| 5 | Edit-værktøjet ×2 | Afviste med *"File has not been read yet"* — `head` i Bash tæller **ikke** som en læsning, kun Read-værktøjet gør | 2 |
| 6 | `sed -i` | Ramte ikke sit mønster og gjorde **intet**, tavst og med exit 0 | 1 |
| 7 | `/tmp` | node og Git Bash er ikke enige om, hvor `/tmp` ligger | 1 |

**Otte kald.** Ingen af dem ødelagde noget; alle af dem kostede en runde. Nummer 6 er den
farligste, fordi den var **tavs** — en sed, der ikke matcher, ser ud som en sed, der
virkede.

## Det største fund er ikke i tabellen

**Jeg skrev de samme ti hårde regler i hånden ind i tre agentprompter.** Cirka 2.400 ord
duplikeret instruktion — om kilder, operatorer, nyttelastsplit, trinhøjdesplit,
lastbetingelser, selv-test og selv-review.

Det er ikke spild af tegn. Det er en **risiko**: tre håndskrevne kopier af den samme regel
divergerer ved fjerde kopi, og så indsamler agent fire efter en regel, ingen har besluttet
at ændre. Det er præcis den fejl, en skill findes for at forhindre.

---

## Hvad der er lavet

### Projektskills — `.claude/skills/`

| Skill | Hvad den bærer | Hvorfor |
|---|---|---|
| **`robotdata`** | 29-feltsskemaet, de ti hårde regler, feltets YAML-form, tæthedsreferencerne, det obligatoriske selv-tjek med tælling | Erstatter de 2.400 duplikerede ord. En agent får nu reglerne fra ét sted, som kan rettes ét sted |
| **`parallelt`** | Worktree-opsætning fra det rigtige repo, prompt-tjeklisten på ni punkter, flette- og oprydningsvejen, og de to fælder | Gør JPK's regel eksekverbar i stedet for hukommelsesafhængig |

Begge bærer de fælder, der kostede tid i dag: `isolation: "worktree"` forgrener fra
sessionens arbejdsmappe, og en worktrees `.git`-fil indeholder en absolut sti, så
hovedrepoet ikke må flyttes under kørsel.

### `.claude/settings.json`

**Hook — `UserPromptSubmit`.** Injicerer projektreglen i konteksten ved hver eneste
prompt: skill-vurdering først, skriv valgt og fravalgt, kør parallelt hvor det kan deles,
selv-test med tælling. **Rørtestet: 495 tegn gyldig JSON.**

Det er den eneste af de fire regler, der kan gøres *automatisk*. Resten afhænger af, at
nogen læser CLAUDE.md — hooken afhænger ikke af noget.

**Permissions — allow.** `node`, `npx --yes`, `mkdir`, `touch`, `cp`, `mv`, `cat`,
`printf`, `jq`, `git init`, `git worktree`, `git switch`, `git checkout`, `git merge`,
`python -m http.server`. De globale indstillinger dækkede allerede `git status/diff/log/
add/commit/branch`, `grep`, `sed`, `find` med flere; det her er hullerne, dagen afslørede.

**Permissions — deny.** Salgssiden er gjort **strukturelt** urørlig:

```
Edit(//c/Praktik/website/**)          Write(//c/Praktik/website/**)
Edit(//c/Praktik/websites/salg/**)    Write(//c/Praktik/websites/salg/**)
```

Begge stier, fordi flytningen ikke er sket endnu. JPK har sagt tre gange, at salgssiden
ikke må røres. En regel, der er gentaget tre gange, hører ikke hjemme i et dokument — den
hører hjemme et sted, hvor den ikke kan overtrædes. `Bash(rm -rf:*)` er også nægtet.

**`additionalDirectories`.** De tre worktrees, så agenterne ikke standser på
tilladelsesspørgsmål midt i arbejdet.

---

## Autonomi: hvad der faktisk blev flyttet

| Før | Nu |
|---|---|
| Reglen om skill-vurdering stod i to CLAUDE.md-filer og virkede kun, hvis nogen læste dem | Hook injicerer den ved hver prompt |
| Ti dataregler skrevet i hånden pr. agent | Én skill, ét sted at rette |
| "Rør ikke salgssiden" var en henstilling | Deny-regel — værktøjet nægter |
| `node`, `mv`, `cp`, `git worktree` gav tilladelsesspørgsmål | Tilladt på forhånd |
| Worktree-fælderne lå i min hukommelse | Skrevet ned i `parallelt` |

Det, der **ikke** kan automatiseres endnu: valideringen af, at et talfelt har enhed og
kilde. Den hører til i en `PostToolUse`-hook på `data/robots/*.yaml`, men `tools/validate.mjs`
findes ikke, fordi der ikke er skrevet kode. **Det er det første, der skal hooktes, den dag
generatoren bygges** — og den vigtigste, for det er den, der gør "opfind aldrig tal" til
noget maskinen håndhæver frem for noget vi lover.

---

## Ærligt: to ting virker ikke endnu

1. **Hooken fyrer sandsynligvis ikke i denne session.** Claude Code overvåger kun
   mapper, der havde en settings-fil, da sessionen startede. `c:\Praktik\guide\.claude\`
   fandtes ikke da. Filen er korrekt og rørtestet — men den skal genindlæses via `/hooks`
   eller en genstart, før den virker. Det kan jeg ikke gøre selv.
2. **De to nye skills kan ikke kaldes i denne session.** Skills registreres ved
   sessionsstart. Indtil næste session giver `/robotdata` og `/parallelt`
   *Unknown skill* — de skal læses fra disk i stedet, og det skal **skrives i rapporten**,
   så et stille fallback ikke forveksles med at skillen kørte.

Begge er engangsomkostninger ved at oprette dem midt i en session. Ingen af dem kræver
handling ud over en genstart.

## Uafklaret

- **Skal `fewer-permission-prompts` køres på rigtige transskriptioner?** Min allowlist er
  bygget på én dags observationer. Skillen kan scanne historikken og finde de mønstre,
  jeg ikke stødte på i dag.
- **Skal `salg`-projektet have samme behandling?** Det har kun `Bash(node tools/:*)` og
  ingen hooks. Men det projekt er i vedligehold, ikke i produktion, så gevinsten er mindre.
- **En `SubagentStop`-hook**, der minder om at efterprøve agentens selv-review, før noget
  flettes. Overvejet og valgt fra indtil videre: den ville fyre ved hver agent, også de
  gange hvor resultatet er én linje, og en påmindelse, der altid kommer, holder op med at
  blive læst.
