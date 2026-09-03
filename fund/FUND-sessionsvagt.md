# FUND — spor/vagt (sessionsvagt.mjs)

**FILNAVN AFVIGER FRA BRIEFET:** `fund/FUND-vagt.md` findes allerede — committet i
`main` (`5807c54`) fra et TIDLIGERE, uafhængigt, allerede flettet `spor/vagt`
(databasevagt i `db/migrer.mjs`, L35). CLAUDE.md: "Genbrug aldrig et dokumentnavn."
Se "Nye fælder" for detaljen — grennavnet er genbrugt, ikke kun filnavnet.

## Skills

**Valgt:** `spor`, kaldt fra worktreen (lykkedes). Ingen fejl fundet i den; eneste
mangel: ingen note om at `tests/koer.mjs` kan tage >120 s.
**Fravalgt:** `fejljagt` (intet uventet), `robotdata`/`supabase` (briefet udelukker
dem eksplicit).

## Valgt løsning / fravalgt

1. **Hook:** ét script, delt i rene funktioner (`traekUsage`, `traekTimestamp`,
   `beslut`) uden I/O og en tynd proces-indpakning. Fravalgt: at parse hver linje
   som JSON for at finde timestampet — brugte i stedet en regex over halen, fordi
   den tåler en afskåret første linje uden ekstra kode.
2. **Registrering:** ny, sideordnet `UserPromptSubmit`-gruppe i arrayet, ikke en ny
   entry i det eksisterende hooks-array — rører derved slet ikke PROJEKTREGEL-objektet.
3. **Sti til node:** `C:/Program Files/nodejs/node.exe` (forward-slash), fravalgt
   `/c/Program Files/...` — se usikkerhed nedenfor.

## Konfidens

- **Punkt 1 (hook+selvtest): høj.** `node .claude/hooks/sessionsvagt.mjs --selvtest`
  → 4 linjer, tal 0/1/1/0, exit 0. Genkørbar. Kontrafaktisk: en forkert `>`/`>=`-grænse
  ville have givet fx 1/1/1/0 eller 0/0/1/0 — testet eksplicit i 73.2c/73.3d.
  Desuden efterprøvet mod det ÆGTE 65 MB-transskript (ikke kun selvtest): gav korrekt
  additionalContext med kontekst 344.708 > 300.000, exit 0.
- **Punkt 2 (settings.json): høj.** Acceptkommandoen gav 0→1 for "sessionsvagt",
  1→1 for "PROJEKTREGEL". Kontrafaktisk: forkert objekt redigeret ville have givet 0.
- **Punkt 3 (test 73): høj.** `node tests/koer.mjs` → 1679 bestået, 0 fejlet
  (1658 + 21 nye). Kontrafaktisk: en fejl i `beslut()` havde fejlet mindst ét af 73.1–73.6.
- **Hookens virkning i en RIGTIG session: lav** — kan ikke starte en ny session fra
  et subagent-spor for at se den fyre live. Se usikkerhed.

## Usikkerheder

- **Hvilken shell kører hook-kommandoen (bash eller cmd.exe)?** Kunne ikke afgøres
  fra en worktree. Valgte `C:/...`-stien, som virker i begge; `/c/...` ville fejle
  under cmd.exe. Bør efterprøves i en frisk session.
- Formatet (`message.usage.{input_tokens,...}`, top-niveau `timestamp`) er kun
  bekræftet mod ÉN session (den der udløste sporet) — koden lytter også efter et
  top-niveau `usage`-felt som fallback, men det er utestet mod en ægte forekomst.

## Målinger

```
node tools/build.mjs        216 sider, 0 fejl
node tools/validate.mjs     77/0/1 advarsel     (matcher briefets grundmåling)
node tests/koer.mjs (før)   1658 bestået, 0 fejlet (matcher briefets grundmåling)
node tests/koer.mjs (efter) 1679 bestået, 0 fejlet
selvtest                    0 / 1 / 1 / 0, exit 0
ægte 65 MB-transskript      344.708 tokens, korrekt additionalContext, exit 0
```

---

## Nye fælder og opdagelser

- **`fund/FUND-vagt.md` var allerede optaget** af en tidligere, uafhængig, allerede
  flettet `spor/vagt` (databasevagt i `db/migrer.mjs`, L35). Branch-navnet
  `spor/vagt` er altså genbrugt på tværs af to helt urelaterede opgaver — samme
  mønster som dokumentnavne-reglen advarer mod, blot ét niveau højere (grennavn,
  ikke filnavn). Værd at overveje om orkestratoren bør tjekke `git log --all --
  oneline -- fund/FUND-<navn>.md` FØR et brief sendes, ikke kun filejerskabet.
- **Ægte end-to-end-prøve var mulig og afslørende:** min egen sessions transskript
  ligger på disk (`C:/Users/thyge/.claude/projects/c--Praktik-websites-udstilling/
  e5b0e47f-....jsonl`, session-ID matcher briefets). Kørte hooken mod DEN — ikke
  kun syntetiske fixtures — og fik et rigtigt, korrekt tal. Konteksten var vokset
  fra 335.635 til 344.708 mellem to læsninger et par minutter fra hinanden, hvilket
  i sig selv beviser skattemekanikken briefet beskriver.
- `usage` ligger under `message.usage`, ikke på øverste niveau — bekræftet direkte
  i den ægte fil, ikke antaget.
- `node tests/koer.mjs` tog >120 s både før og efter mit punkt 3 (kørt i baggrunden
  begge gange) — ikke min kode der er årsagen (samme ved grundmålingen), men værd
  at vide for næste spor, der ikke forventer det.

## Punkter i briefet, jeg ikke nåede

Ingen af de tre kodepunkter — alle er fuldført, målt og committet hver for sig.
Rapportens FILNAVN afviger fra briefet, begrundet ovenfor.
