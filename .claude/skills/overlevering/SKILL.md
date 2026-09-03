---
name: overlevering
description: Skriv en overlevering, så JPK kan lukke den nuværende session og starte en frisk uden at miste tråden. Kald den når sessionsvagten siger til, når JPK spørger om han skal starte forfra, når han siger "ny session", "overlevering", "hvor er vi", eller før du komprimerer tredje gang på samme opgave. Producerer en kort tekst, JPK kan indsætte som første besked i den nye session — den PEGER på filer frem for at kopiere dem, fordi en lang indsættelse er den samme tokenskat, den skulle fjerne.
user-invokable: true
---

# Overlevering — luk sessionen uden at miste tråden

En ny session koster **cirka 18.000 tokens** at starte i dette projekt. En stor
session koster derimod sin fulde kontekst i cache-læsning på **hvert** kald, og
58 kald pr. besked er målt her. Efter en times pause er cachen væk, og hele
konteksten betales forfra som en cache-skrivning.

Overleveringen er det, der gør den nye session billig. Den er ikke et referat.

---

## Reglen, alt andet følger af: PEG, kopiér ikke

**En overlevering, der kopierer tilstanden ind, er en komprimering med et andet
navn** — og den betales i den nye session på hvert kald resten af dagen.

Det, der allerede står i en fil, skrives ikke igen. Det får en sti og en linje
om, hvorfor den nye session skal derhen. Det, der IKKE står i en fil, er det
eneste, der skal skrives ud — og hvis det er vigtigt, hører det egentlig hjemme
i STATUS.md, ikke i en overlevering.

**Derfor er den første handling ikke at skrive, men at spørge: mangler noget at
blive skrevet ned?** Er der en beslutning, en måling eller en tilstand, der kun
findes i denne samtale, så skriv den som en STATUS-række **først** og peg
derefter på den. Så overlever den også, hvis JPK ikke bruger overleveringen.

## Mål tilstanden, før du skriver den

Skøn må ikke ind i en overlevering — den næste session kan ikke skelne dit gæt
fra en måling, fordi den ikke var her.

```
git log -1 --format='%h %s'                  # hvor main staar
git rev-list --left-right --count main...origin/main   # pushet eller ej
git status --short                           # ucommitteret
git worktree list                            # hvad koerer, og hvad er efterladt
grep -oE '\*\*Å1[0-9][0-9]\*\*' STATUS.md | tr -d '*Å' | sort -n | tail -2
```

Kører der spor, så mål deres commits (`git -C <worktree> log --oneline -3`) —
**og brug `C:/`-stier, ikke `/c/`**, ellers fejler git tavst, hvis du har sendt
fejlen i `/dev/null`.

Er der en anden session i gang, så spørg den, hvad den ejer. To sessioner deler
arbejdstræ og ref-lager, og den nye session skal kende grænsen fra første
besked.

## Formen — kort, og den skal kunne indsættes som den er

Skriv den i terminalen, så JPK kan kopiere den. Højst omkring 20 linjer.

```
NY SESSION — quadruped-kataloget, <dato og klokkeslæt>

Læs først: STATUS.md Å<n> og Å<m>. De bærer tilstanden.
<én linje om hvorfor netop de to>

Main: <hash>, <i takt med origin / n foran>. Arbejdstræ: <rent / hvad der ligger>.
Worktrees: <antal>, heraf <hvilke der kører og hvilke der er pauset>.
Næste ledige STATUS-nummer: <n>. Næste ledige testnummer: <n>.

I gang lige nu: <spor, med gren og hvad de venter på — eller "ingenting">.
Anden session: <hvad den ejer, eller "ingen">.

Det næste skridt: <én sætning, konkret nok til at handle på>.

Uafklaret, som ikke står i nogen fil: <højst tre punkter, eller "ingenting">.
```

**Feltet "uafklaret" er det vigtigste og det, der oftest springes over.** Det er
per definition det, den nye session ikke kan læse sig til. Er det tomt, så skriv
*"ingenting"* — så ved den næste, at tomheden er målt og ikke glemt.

## Hvad der ALDRIG skal med

- **Referat af, hvad der er sket.** Git-historikken og STATUS bærer det bedre,
  og den nye session behøver det kun, hvis den skal handle på det.
- **Kodeuddrag.** Giv `fil:linje`. Den nye session læser hurtigere, end du kan
  kopiere.
- **Tal uden en kommando.** Et tal, den nye session ikke kan genskabe, er en
  påstand, den arver blindt. Det er samme krav som konfidensskalaens *høj*.
- **Ros, undskyldninger og status på dig selv.** Den nye session er ikke dig.

## Sig også, om skiftet overhovedet betaler sig

**Overleveringen er ikke altid svaret, og du skal sige det, når den ikke er.**

Skift session, når **opgaven** skifter — så er den båret kontekst dødvægt, der
beskattes på hvert resterende kald. Bliv, når opgaven fortsætter og konteksten
stadig er lille: der er komprimering billigere end at udlede tilstanden forfra.

Den grænse, der er værd at kende, fordi ingen ser den: **er der gået over en
time siden sidste besked, er cachen væk.** Så koster det at genoptage en stor
session mere end at starte en ny, uanset hvor godt det passer at fortsætte.
Målt 3. sep 2026: en session på 311.000 tokens ville koste omkring 390.000
token-ækvivalenter for at sige godmorgen. En ny koster 18.000.

## Efter overleveringen

Skriv i STATUS.md, hvis noget i overleveringen ikke allerede stod der — og
**gør det, før JPK lukker sessionen**, ikke efter. En overlevering, der kun
findes i en terminal, JPK har lukket, er ingenting.

Sessionsvagten (`.claude/hooks/sessionsvagt.mjs`) er den, der normalt udløser
den her. **Den virker kun i sessioner startet efter at den blev flettet** —
registrering sker ved sessionsstart, ligesom for skills.
