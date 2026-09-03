# `f2blindpunkt-raalaesning/` — beviset bag de 358, der IKKE var danske

Rålæsningen fra `spor/f2-blindpunkt` (3. sep 2026). Lå indtil nu som
`fund/.tmp-blindpunkt/` i sporets worktree — **utracket**, altså i præcis den
tilstand, hvor en enkelt `git worktree remove` sletter den uden et spor i git.
Det er MANIFEST-tabet fra 24. aug i sin reneste form, og materialet er derfor
flyttet hertil og committet.

## Hvorfor gemme det, når fundene allerede står i TSV'en?

`fund/f2blindpunkt-fundne-celler.tsv` bærer sporets **34 fund** — de 33 danske
celler plus det ene tvivlstilfælde. Den svarer på *"hvad fandt sporet?"*.

Denne mappe svarer på det spørgsmål, ingen stiller før det bliver dyrt:
***"læste sporet faktisk alle 392 celler, eller kun dem det fandt noget i?"***

De 16 producent-TSV'er er hele søgerummet, celle for celle. **De 358 celler,
sporet bedømte som engelske eller sprogneutrale, findes kun her.** Negativ
evidens har ingen anden hjemmel — og uden den kan blindpunktets tal, 33 af 392
= 8,4 %, ikke efterprøves af nogen anden end den agent, der målte det.

At genskabe mappen koster et helt spor. Den fylder 229 KB.

## Hvad ligger her

| Fil(er) | Hvad |
|---|---|
| 16 `<Producent>.tsv` | Søgerummet pr. producent — alle læste celler, ikke kun fundene |
| `find-kandidater.mjs` | Søgeapparatet, der afgrænsede de 392. **Det er metoden, ikke bare data** |
| `kandidater.json` · `.tsv` · `-log.txt` | Kandidatlisten i tre former, som sporet arbejdede sig gennem |
| `baseline-hashes.txt` · `efter-hashes.txt` | Talaftryk før og efter. Beviset for, at ingen talkolonne blev rørt |
| `tal-baseline*.txt` · `tal-efter-pr-producent.txt` | Samme, opdelt pr. producent |
| `opdateringer.json` | De skrivninger, sporet faktisk sendte |
| `unitree.tsv` | Unitree alene — 173 af de 392 celler, sporets største enkeltbid |
| `commit-msg.txt` | Sporets egen commit-besked, som den blev skrevet |

## Vigtigt om afgrænsningen

Søgerummet er **korte celler uden æøå** (under 60 tegn) i fire kolonner:
`value_text`, `caveat`, `caveat_wording` og `applications.note` — hos 16
producenter. Grænsen på 60 tegn var orkestratorens valg, ikke en målt størrelse.

**8,4 % er derfor en rate for ÉT søgerum, ikke for databasen.** `spor/f2-feje`
læste 251 korte celler hos sine fem producenter med samme metode og fandt
**0** skjult dansk. To spor, samme metode, vidt forskelligt resultat. Se Å160
og Å164 i [STATUS.md](../../STATUS.md).
