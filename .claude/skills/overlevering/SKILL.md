---
name: overlevering
description: Sig til JPK, at nu er et godt tidspunkt at starte en ny session, og giv ham de få linjer, den nye session skal have. Kald den når sessionsvagten siger til, eller når JPK spørger om han skal starte forfra. Hold det kort — han bad udtrykkeligt om, at det ikke bliver overkompliceret.
user-invokable: true
---

# Overlevering

**JPK's egne ord 3. sep 2026:** *"Det eneste jeg ønsker, det er at orkestratoren
selv notificerer mig i samtalen, hvornår det er et godt tidspunkt for at starte
en ny session. Det skal ikke overkompliceres."*

Så: én kort besked i samtalen. Ikke en fil, ikke et ritual.

## Sig det sådan her

```
Godt tidspunkt at starte forfra nu — konteksten er <n> tokens.

Giv den nye session denne linje:
"Læs STATUS.md Å<n> og Å<m>. Main er <hash>. <Det næste skridt, én sætning>."

<Én linje om noget uafklaret, som ikke står i nogen fil — eller ingenting.>
```

Mål tallene, gæt dem ikke: `git log -1 --format='%h'` og de to STATUS-numre,
arbejdet faktisk rører.

## Når tilbuddet ignoreres

**Tilføjet 4. sep 2026, målt: sessionsvagten fyrede fra 306k, tilbuddet blev
givet fire gange, og konteksten nåede 396k — den voksede 90k, mens jeg tilbød
at skifte.** Reglen fandtes, blev fulgt, og virkede ikke.

Skillen sagde indtil nu kun *"én kort besked i samtalen"*. Den sagde ikke, hvad
orkestratoren gør, når beskeden **ikke besvares**. Nu gør den:

- **Første og andet tilbud:** som beskrevet nedenfor. Én kort besked.
- **Fra tredje tilbud:** skriv overleveringslinjen i **STATUS.md** frem for kun
  i samtalen, og commit den. En linje i en samtale overlever ikke, at sessionen
  lukkes brat; en linje i en fil gør.
- **Gentag ikke tilbuddet mere end tre gange.** Fortsæt arbejdet. JPK har set
  det, og en fjerde påmindelse koster mere kontekst, end den sparer.

**Det, der skal med i STATUS-linjen, er dét, der ellers går tabt:** beslutninger
truffet i en popup, aftaler med en anden session, og hvilke spor der er sat op
men ikke startet. Målt samme dag: fire beslutninger — §0.1's ni kort, Galileos
120 ubelagte tal, de fem manglende MANIFEST'er og rækkefølgen mod fase 3 — blev
truffet i en popup og fandtes **kun i samtalen**, da sessionen blev stoppet.

## Den eneste regel, der betyder noget

**Peg, kopiér ikke.** Det, der står i en fil, får en sti. En lang indsættelse er
den samme tokenskat, skiftet skulle fjerne.

Står der noget vigtigt, som ikke findes i nogen fil, så skriv det i STATUS
**før** JPK lukker sessionen — ikke i overleveringen.

## Sig også, når skiftet IKKE betaler sig

Skift, når **opgaven** skifter. Bliv, når den fortsætter og konteksten er lille.

Én undtagelse er værd at nævne af sig selv: **er der gået over en time, er
prompt-cachen væk**, og en stor session koster da hele sin kontekst forfra ved
næste besked. Der er en ny session billigere, uanset hvor godt det passer at
fortsætte.
