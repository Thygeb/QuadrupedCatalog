# Projekt: Oversigt over firbenede robotter (quadrupeds)

Selvstændigt projekt. **Ikke** en del af KeyResearch-konceptsiden i `c:\Praktik\website`
(påtænkt omdøbt til `salg`). De to deler tone, målescripts og fontstrategi — intet andet.
De har hver sit git-repo, hver sin CLAUDE.md og hver sin beslutningshistorik.

**Denne fil er reglerne. [PRODUCT.md](PRODUCT.md) er produktsandheden. [PLAN.md](PLAN.md) er
byggeplanen.** Status: planlægning. Der er ikke skrevet kode endnu, og der skrives ikke kode,
før CEO'en siger til.

---

## Første handling ved enhver ny opgave: vurdér skills

**Hver gang der kommer en instruks — også en lille — starter du med at vurdere, hvilken skill
der er relevant, og skriver det.** Ikke som formalitet: en skill der findes og ikke bruges, er
værre end ingen skill, fordi den næste antager at den blev brugt.

Skriv altid to ting: **hvilken du valgte, og hvilke du gik forbi med begrundelse.** Passer
ingen, så skriv det — "ingen skill passer her" er også et svar, og det er et bedre svar end
tavshed.

Faldgruben er ikke uvidenhed. Det er at bruge **den skill man husker** frem for den der passer.
Kør `ls C:/Users/thyge/.claude/skills/` og se den fulde liste i systemets skill-oversigt, før
du vælger.

Relevante for det her projekt:

| Skill | Hvornår |
|---|---|
| `impeccable` (`shape`, `new-work`, `harden`, `adapt`) | Al design- og IA-planlægning. Kører nu |
| `new-project` | Når vi scaffolder: git, .gitignore, /run. Ikke før vi koder |
| `ui-ux-critique` | Kritikrunder på en bygget side. AI-prosa-scanneren hører til her |
| `critique` | Designeffektivitet, når der er noget at vurdere |
| `dataviz` | Sammenligningsgrafik, specifikationstæthed, filtervisualisering |
| `code-review` / `simplify` | På generatoren, når den findes |

## Sprog

Siden er **dansk og engelsk ved lancering**, bygget til flere. Skriv til CEO'en på dansk.

Arkitekturregel, der ikke må brydes: **sprogneutrale tal ét sted, oversat tekst i én fil pr.
sprog, URL pr. sprog, `hreflang` imellem dem.** `data-en`-attributløsningen fra `salg`-projektet
må ikke genbruges her — den er en kontakt med to stillinger og kan ikke få en tredje.

## Hårde begrænsninger

Arvet fra KeyResearch, og de gælder her med fuld kraft:

1. **Ingen forhandleraftale med nogen fabrikant.** Siden må aldrig kunne læses som salgskanal.
   Ingen købsknap, ingen affiliate-links, ingen prisforespørgselsformular i en katalogpost.
2. **Opfind aldrig tal, cases, certificeringer eller kapaciteter.** Håndhæves mekanisk:
   bygget skal fejle, hvis et talfelt mangler enhed eller kilde.
3. **Fabrikanternes marketingbilleder må ikke genudgives.** Hverken juridisk eller fordi det
   er det stærkeste mulige signal om et forhandlerforhold, der ikke findes.
4. **Ingen AI-genererede billeder af robotter eller mennesker.**
5. **"Ikke oplyst", "nej" og "0" er tre forskellige tilstande** og skal se forskellige ud.
   Det er der, katalogsider lyver.
6. **Ingen redaktionel 1-5-score uden offentliggjort metode med acceptkriterier.** Se
   afvist-listen i `salg`-projektets STATUS.md: "en konklusion skrevet om til tal".

## Dokumentregler

- **Genbrug aldrig et dokumentnavn. Nummerér videre.**
- Nye fund føres ind i STATUS.md, når den findes. Kritikdokumenter er arkiv.

## Arbejde med filen

- `node` ligger i `/c/Program Files/nodejs/node.exe` — Git Bash har den **ikke** på PATH.
- **PowerShell 5.1:** dobbelte anførselstegn ødelægger argumentoverførsel til native kommandoer.
  Skriv commit-beskeder til en fil og brug `git commit -F <fil>`.
- Skriv filer med UTF-8 **uden** BOM. `Set-Content -Encoding utf8` ødelægger tankestreger.
