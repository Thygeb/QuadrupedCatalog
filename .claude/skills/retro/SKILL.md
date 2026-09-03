---
name: retro
description: Evaluér en arbejdsdag i dette projekt — hvad i workflowet der virkede, hvad der skal rettes, hvad der mangler, og om de brugte skills passede. Kaldes ved dagens slutning, efter en stor runde, eller før en komprimering. Producerer fund/RETRO-<dato>.md med målte tal, ikke indtryk.
---

# Retro — dagens workflow, målt

En retro, der siger *"det gik godt"*, er ikke en retro. Hver konklusion her skal
bære et tal eller en linjehenvisning, og de dyreste fund er dem, hvor reglen
**fandtes** og alligevel ikke blev fulgt.

**Rolle:** orkestratorens eget arbejde. Aldrig et spors — en analyse er ikke
rugbrød (CLAUDE.md: *"reviews og analyser er ALDRIG Sonnets"*).

---

## 1. Mål dagen, før du mener noget

Kør, og skriv tallene øverst i rapporten:

```
git log --since="<dato> 00:00" --oneline | wc -l          # commits
git log --since="<dato> 00:00" --merges --oneline          # flet, med beskeder
git log --since="<dato> 00:00" --format=%s | grep -c '^AA' # STATUS-poster
ls fund/FUND-*.md -t | head -20                            # sporrapporter i dag
git worktree list                                          # hvad står åbent
```

Fra sporrapporternes `<usage>`-blokke, hvis de er i konteksten: **tokens pr.
spor**. Målt 2. sep 2026: 226k–492k pr. spor, ~35k pr. robot i fase 2. Uden det
tal kan næste dags fan-out ikke budgetteres.

Fra STATUS.md: **hvor mange gange fangede kontrollinjen en forkert
forudsigelse?** Grep efter *"forventer"* i dagens commits og tæl afvigelserne.
2. sep: **syv** på to sessioner. Det tal er reglens kvittering.

## 2. Reglerne, der fyrede — og dem, der blev brudt

To lister, og den anden er den vigtige:

**Fyrede (behold):** hvilke regler i CLAUDE.md/skills fangede noget i dag?
Citér reglen og fundet. Eksempel 2. sep: *"skriv tallet før du læser det"* →
`git show` talte commit-beskeden med, `example.com` gav en falsk afkræftelse,
Å137 lignede taget.

**Brudt trods at den fandtes (ret):** hvilke regler stod skrevet, og blev
alligevel ikke fulgt? For hver: **hvor** stod den, **hvem** brød den (også
orkestratoren), og **hvad det kostede**. Eksempel 2. sep: `parallelt` punkt 11
listede `.env` og fotos — ikke `media/_kilder/` — og to spor brugte en runde.
Reglen var ufuldstændig, ikke ukendt.

**En regel, der blev brudt af orkestratoren, tæller dobbelt.** Den, der skriver
reglerne, kontrolleres ellers af ingen.

## 3. Skills — passede de?

Tabel, én række pr. skill, der blev **kaldt eller gået forbi** i dag:

| Skill | Kaldt (n) | Fangede noget? | Manglede noget? | Dom |
|---|---|---|---|---|

Dommen er ét af fire: **behold** · **udvid** (skriv hvad) · **skær** (skriv
hvad) · **fjern**. *"Passende"* uden en af de fire er ikke en dom.

Tjek også de skills, der **ikke** blev kaldt, men burde: `ls .claude/skills/`
og pluginlisten (CLAUDE.md's `node -e`-kommando). En skill, der findes og aldrig
kaldes, er enten overflødig eller overset — find ud af hvilken.

## 4. Det, der skal tilføjes

Kun ting med et konkret **hvor** og **hvad**: en fil, en linje i en skill, et
script. *"Vi bør være bedre til …"* er ikke en tilføjelse.

Spørg for hver: **ville den have sparet en runde i dag?** Kan du ikke pege på
runden, så skriv den ikke.

## 5. Selv-review

- Hvilke af dagens fejl var **dine egne**? Skriv dem først.
- Hvad målte du **ikke**, fordi det var dyrt eller ubehageligt?
- Er der en konklusion ovenfor, du har skrevet **uden et tal**? Slet den, eller mål.

## Leverance

`fund/RETRO-<ÅÅÅÅ-MM-DD>.md`, højst 80 linjer plus tabellen. Fire overskrifter:
**Målt** · **Behold** · **Ret** · **Tilføj**. Derefter skills-tabellen og
selv-reviewet.

Peg på den fra STATUS.md med én linje. Rettelser til skills og CLAUDE.md laves
**i samme tur** — en retro, der kun beskriver, er en journal.

## Beslægtet — `session-report`, læst 3. sep 2026

Pluginnet er et **tokenrapport**-værktøj: det læser `~/.claude/projects`-
transskripter og bygger en HTML-side over forbrug pr. projekt, subagent og
skill. Det er **ikke** en workflow-retro, og de to overlapper ikke.

**Brug dets analysator til pkt. 1's tokental** i stedet for at læse
`<usage>`-blokke i hånden:

```
"/c/Program Files/nodejs/node.exe" <plugin-dir>/skills/session-report/analyze-sessions.mjs --json --since 24h
```

hvor `<plugin-dir>` er den nyeste mappe under
`C:/Users/thyge/.claude/plugins/cache/claude-plugins-official/session-report/`.
Læs `by_subagent_type` og `top_prompts`. Skriv **ikke** til `/tmp` (node og
Git Bash er uenige om, hvor den ligger) — brug scratchpad eller `fund/`.
