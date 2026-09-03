---
name: spor
description: Arbejdsreglerne for et spor i quadruped-projektet — grundmåling, skrive-grænse, kontrollinje, filejerskab, selv-efterprøvning og rapportform. Kald den som din FØRSTE handling, hver gang du er sendt af sted som subagent med et brief, uanset om opgaven er data, kode, tekst, design eller en måling. Briefet siger hvad du skal lave; denne skill siger hvordan arbejdet udføres, så det kan efterprøves bagefter. Orkestratoren peger på den i stedet for at skrive reglerne af i hånden.
user-invokable: true
---

# Spor — sådan udføres arbejdet, uanset hvad opgaven er

Du er sendt af sted med et brief. **Briefet er opgaven; denne fil er metoden.**
De to hører sammen: et brief, der også skulle bære metoden, blev 200 linjer langt
og fik reglerne kopieret ind i hånden — og tre håndskrevne kopier af samme regel
divergerer ved den fjerde.

**Målt 3. sep 2026:** 20 af 21 briefs i `fund/` bar de samme otte regelblokke.
Denne skill findes, så den 21. ikke skal skrive dem igen.

**Miljøfælderne står i [references/miljoefaelder.md](references/miljoefaelder.md)
— læs den, før du kører din første kommando.** Hver af dem har kostet mindst én
runde, og de er billige at undgå og dyre at opdage.

---

## Regel 0 — skill-vurdering, og den skal skrives

Skriv **hvilken skill du valgte, og hvilke du gik forbi med begrundelse.**
*"Ingen skill passer her"* er et gyldigt svar — men det skal stå, ellers kan
næste læser ikke se forskel på et fravalg og en forglemmelse.

Projektets egne ligger i `.claude/skills/` og følger med din worktree.
Bruger- og plugin-skills gør ikke, og kaldet fra en worktree svinger: **lykkes
det ikke, så læs `SKILL.md` fra disk og skriv i rapporten, at du gjorde det.**
Et stille fallback ligner ellers en skill, der kørte.

**Rører din opgave noget visuelt — en flade, CSS, en farve, en skriftgrad, en
komponent, en datatilstand — så kald `design`, også når briefet ikke beder om
det.** Den er kortet til `DESIGN.md`, projektets designsystem, og den siger
hvilke af filens 32 afsnit din opgave faktisk skal bruge, så du læser 40 linjer
i stedet for 834. Den bærer også designfrysen, palettelåsen, MODE-navngivningen
og de fire datatilstande — fire regler, der gælder, uanset hvad briefet siger.
**Et brief, der har glemt at pege på den, fritager dig ikke;** det er præcis
derfor reglen står her og ikke kun i `brief`.

**Citerer du en skill eller en regel, så slå den op på disken.** Skills
registreres ved sessionsstart, så det, du har i konteksten, kan være en ældre
udgave end filen — og i modsætning til `Unknown skill`, som larmer, læser et
forældet snapshot som gældende. Målt 3. sep 2026 mellem to sessioner.

## 1. Grundmålingen er din første kommando

Kør briefets grundmåling, **før du ændrer noget**, og skriv tallet i rapporten.

Uden den kan du ikke svare på det eneste spørgsmål, der virkelig betyder noget,
når noget er rødt: *var det mig, der ødelagde det?* Målt 25. aug 2026: to spor
mødte begge 54 valideringsfejl fra manglende gitignorerede billeder. Det ene
havde grundmålingen og kunne bevise, at fejlene var der i forvejen. Det andet
brugte en runde på at finde ud af det.

**Afviger din grundmåling fra briefets tal, så er det et fund — meld det og
arbejd videre.** Se punkt 5.

## 2. Skriv en kontrol, før du læser et tal

**Skriv, hvad tallet skal være, hvis alt er som forventet — FØR du læser det.**

```
echo -n "advarsler i alt (forventer 890): "; <din kommando>
```

Grunden til, at det ikke kan undværes: **et forkert mønster giver typisk et
fuldstændig plausibelt tal.** 0, eller 99, eller 504. Der er intet at undre sig
over, så ingen fejljagt går i gang — kontrollen er det eneste, der gør fejlen
synlig i samme øjeblik. Målt 1.–3. sep 2026: ti forkerte forudsigelser fanget på
to sessioner, uden at én af dem nåede en konklusion.

Det gælder også et citat. **Et citat er et tal:** slået op med linjenummer er
høj konfidens, husket er lav og skal mærkes.

## 3. Skriv i trin — det er en skrive-grænse, ikke en commit-grænse

Briefets punkter skal committes hver for sig, og rækkefølgen er ikke pynt:
**skriv KUN punkt 1's kode, mål den, commit — og først derefter må punkt 2's
kode skrives.**

Formuleringen er valgt med vilje. Målt på to agenter i træk 25. aug 2026, begge
trods eksplicit instruks om ét commit pr. punkt: agenten skrev hele scriptet i
ét første Write-kald, og så bar punkt 1's commit også punkt 3's uefterprøvede
kode. **En instruks om commits alene ændrer ikke skrivevanen.**

Den anden grund er død-sikring: spor dør. Tre er døde i dette projekt på tre
dage — session-limit, stall, tabt transskript. **Et spor, der dør med commits,
kan måles og genoptages; et spor, der dør uden, er næsten værdiløst**, fordi
ingen ved, hvad der var efterprøvet.

## 4. Ejerskabet er en grænse, ikke en anbefaling

Rør kun de filer og de rækker, briefet giver dig. Andre spor kører samtidig i
deres egne worktrees, og to spor i samme fil er en flettekonflikt, der først
viser sig, når begge er færdige.

Skriver du i en delt ressource — databasen, en akkumulerende fil — så gælder to
ting: **aflever nye rækker, aldrig hele filen**, og **bevis bagefter, at du ikke
rørte andres.** Målt 24. aug 2026: 219 rækkers proveniens blev overskrevet med
en 3-linjers fil, og kun 87,9 % kunne genskabes.

**Rør aldrig hovedrepoet** (`c:\Praktik\websites\udstilling`) fra en worktree —
to sessioner arbejder i det. `c:\Praktik\websites\salg` og `c:\Praktik\website`
er andre projekter og er helt uden for din verden.

## 5. Briefets fakta er påstande — at måle dem er en del af din leverance

Alle tal i briefet er orkestratorens målinger, ikke sandheder. **Afviger noget,
du måler, så rapportér afvigelsen. Det er leverance, ikke ulydighed.**

Det er sessionens billigste kvalitetskontrol, og den virker: fire agenter rettede
orkestratorens fakta på én dag 2. sep 2026 — et forkert antal felter, en forkert
antagelse om en kildes sprog, en forkert struktur i et script, en forkert
påstand om hvor råkilderne lå. Alle fire på eget initiativ, alle fire korrekte.
Orkestratoren kontrolleres ellers af ingen.

**Rettelsen mod briefets tal er forkert.** Mål, og skriv det faktiske.

## 6. Selv-efterprøvning med tælling

*"Ser rigtigt ud"* er ikke en efterprøvning. Åbn kilden igen, gå felt for felt,
og skriv **hvor mange du efterprøvede, og hvor mange fejl du fandt.**
Nul fundne fejl uden en tælling er ikke en efterprøvning.

Et automatisk 0-tal fra en detektor er **nødvendigt, ikke tilstrækkeligt** —
det beviser, at mønsteret ikke fandt noget, ikke at der intet er. Målt 2. sep
2026: dansk-detektorens ordliste indeholdt `under`, `over`, `men` og `dog`, som
alle fire også er engelske ord. **Valider dit måleapparat mod et kendt svar,
før dets tal bruges i en konklusion.**

Er dit spor et kode- eller datasporespor, så kør de kørsler, briefet nævner, og
skriv tallene. Rører du kode, som andre spor bygger på, så kør bygget også.

## 7. Luk det, du startede

**Din server skal være død, før du rapporterer**, og skriv i rapporten, at du
lukkede den. Målt 1. sep 2026: fem forældreløse `python -m http.server` fra døde
spor kørte samtidig. To holdt worktree-mapper låst, så de ikke kunne slettes;
to andre optog porte, nye spor havde fået tildelt, så to porte havde to
processer hver, og hvilken der svarede, var ikke til at vide.

Samme grund til at bruge **din egen port** og aldrig 8080: den er delt mellem
alle samtidige spor. Og **verificér serveren mod disken, før du bruger ét tal**
— vælg en streng, der kun findes i din udgave, og sammenlign filen med svaret.
En server er et måleapparat.

## 8. Rapporten — `fund/FUND-<dit-spor>.md`, højst 60 linjer

Fire ting, og ikke mere:

1. **Valgt løsning, og fravalgt alternativ** — én linje hver.
2. **Konfidens pr. punkt.** Skalaen er bundet til bevistype, ikke til
   fornemmelse: **høj** = målt med en kommando, orkestratoren kan genkøre den og
   få samme tal, **plus én linje om, hvad tallet ville have været, hvis arbejdet
   var forkert** · **middel** = efterprøvet indirekte, ikke i den form brugeren
   møder · **lav** = ikke efterprøvet. **Høj uden en genkørbar kommando
   nedskrives automatisk til lav** — ellers ender alt på høj.
   Den kontrafaktiske linje er ikke pynt: 25. aug 2026 gav `validate.mjs` 54
   reproducerbare fejl, der målte agentens *miljø* og ikke dens arbejde.
3. **Usikkerheder, du mødte undervejs** — det, du ikke kunne afgøre.
4. **Målingerne som tal**, ikke som prosa. *"validate 77/0"*, ikke *"alt kører"*.

Loftet findes, fordi seks rapporter samme dag lå på 226 linjer i snit, længste
337 — og den slags bliver skimmet i stedet for læst. Den fulde udredning hører i
commit-beskederne, ved siden af den diff, den handler om. Tabeller, der er selve
leverancen, må ligge under de 60 linjer.

**To sektioner ligger UDEN FOR loftet og er obligatoriske:**

- **"Nye fælder og opdagelser."** Loftet må ikke koste det, rapporten er værd:
  under et hårdt loft dropper en agent det overraskende og beholder tjeklisten,
  for tjeklisten er det, den blev bedt om. **Er der intet, skal der stå, at der
  intet er.**
- **"Punkter i briefet, jeg ikke nåede."** Én linje pr. punkt, tom hvis ingen.
  Ærlighed skal være strukturel, ikke noget der gemmer sig i prosaen.

En rapport, der kun indeholder det, der lykkedes, kan ikke bruges til at
beslutte noget.
