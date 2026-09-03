# BRIEF — `spor/ramme`: katalogets rammer beskærer op til 49 % af et produktfoto

**Model: sonnet.** Facittet er målbart: 0 beskårne fotos bagefter.
**Worktree:** `C:/Praktik/websites/udstilling-wt-ramme`, gren `spor/ramme`, fra `5162195`.

## Første handling

**Kald `spor`-skillen.** Den bærer grundmålingen, skrive-grænsen, kontrollinjen,
filejerskabet, selv-efterprøvningen, rapportformen og miljøfælderne. Lykkes kaldet ikke fra
din worktree, så læs `.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at du
gjorde det**.

**Sporet er undtaget designfrysen L70**, fordi det retter et brud på en hård regel, som
allerede er i drift. Men rettelsen rører en flade, en fladeplan også foreslår ændringer i —
se ejerskabet.

## Bruddet

**L78, besluttet af JPK 2. sep 2026, ordret:** *"et produktfoto beskæres ALDRIG.
`object-fit:contain` og `aspect-ratio:4/3` overalt."* Ingen forbehold.

**Målt af orkestratoren 3. sep med en isoleret browser** på `dist/da/index.html` ved 1440 px,
serveren først verificeret mod disken:

```
billeder i .net .billedled                    85
object-fit fordeling                          {"contain": 85}
IKKE contain                                   0
img-kassen uden for den klippende ramme       32
  49,1 % lodret   Lingmao Cyvet
  44,6 % lodret   AlienGo
  27,7 % lodret   BabyAlpha
  27,6 % lodret   Keybotic Keyper
```

`spor/zoom` målte **44** med sin egen metode; orkestratoren målte **32** med tærsklen 0,5 px.
**Forskellen er tærskel, ikke mekanisme** — 49,1 % er identisk hos begge. **Mål selv, og
skriv dit eget tal med din tærskel.** Ingen af de to tal er facit.

## Mekanismen — og den er projektets egen, tre gange betalte lærdom

**`object-fit:contain` gør sit arbejde perfekt på alle 85.** Billedet indpasses korrekt. Det
er **RAMMEN**, der klipper:

```
generator.css:1439  .net .billedled{background:var(--bund);display:grid;place-items:center;
                      overflow:hidden;border-bottom:1px solid var(--linje);border-radius:0}
generator.css:1443  .net .billedled img{width:100%;height:100%;padding:var(--r3)}
system.css:1168     .billedled img{width:100%;height:100%;object-fit:contain;object-position:center}
```

**TO FORKLARINGER ER ALLEREDE UDELUKKET — begge var orkestratorens egne, begge modbevist
med en måling. Brug ikke tid på dem igen:**

| Udelukket forklaring | Hvorfor den er falsk |
|---|---|
| *Polstringen på `<img>` skubber kassen ud* | `system.css:277` sætter `box-sizing:border-box` på `*`. Polstring ligger **inde** i kassen og skubber intet ud |
| *Rammen har ingen defineret højde* | `system.css:1165` sætter `.billedled{aspect-ratio:4/3;overflow:hidden;display:grid;place-items:center}`. Højden **er** defineret, og `.net` arver den |

**Og L78 er allerede implementeret her.** Kommentaren ved `system.css:1157-1163` er reglens
eget hjemsted: *"Ét sideforhold (4:3) og én fit (contain) for hele sitet."* Den bar tidligere
`16:10 + cover`, og skiftet blev målt — *"med cover mistede 40 af 65 fotos over 10 %,
gennemsnit 18,3 %, værst 59 %."* **Det er FØR-tallet for en rettelse, der allerede er lavet.**
Beskæringen, du er sendt efter, er altså en **anden** end den, L78 lukkede.

**DEN STÆRKESTE TILBAGEVÆRENDE HYPOTESE, og den er målt til at være plausibel, ikke bevist:**
billedet er pakket i `<picture>` — **85 af dem** i katalogets markup. `height:100%` på
`<img>` regner mod sin forælder, altså `<picture>`, ikke mod `.billedled`. Får `<picture>`
ingen højde, er `height:100%` udefineret, billedet beholder sin egen højde, og rammens
`overflow:hidden` klipper resten.

**Beviset, der gør den stærk:** to andre steder i projektet har haft præcis dette problem og
løst det med den samme ene regel — `generator.css:335`
(`.billedled--stor:not(.billedled--maal) picture{display:block;width:100%;height:100%}`) og
`generator.css:459` (`.saml-fotofelt picture{...}`). **Målt: `.net .billedled` har ingen
`picture`-regel — 0 forekomster i blokken 1439-1445.**

**Det er stadig en hypotese.** Orkestratoren har læst CSS'en og målt symptomet, ikke bevist
årsagen. **Efterprøv den i browseren først** — mål `<picture>`s faktiske højde mod
`.billedled`s. Holder den ikke, så skriv det og find den rigtige; det er et lige så godt
resultat.

**`generator.css:326-334` bærer allerede en kommentar, der advarer mod præcis dette** — at
lægge polstring på `<img>` frem for på den ydre flade — og som selv skriver: *"IKKE visuelt
efterprøvet med en browser i denne session."* **Læs den, før du retter.** Den forklarer,
hvorfor `.billedled--stor` lægger sin polstring udenpå.

**Tredje gang samme lærdom rammer projektet:** måleværktøjet selv målte engang beskæring mod
`<img>`-elementets kasse og fik **0**, hvor filmålingen gav **16**. **Mål mod `.billedled`,
ikke mod `<img>`.**

## Opgaven

**0 beskårne fotos ved 1440 px og ved 390 px**, uden at kortets højde eller gitterets rytme
ændres mere end nødvendigt. Kortene står i et gitter med **1 px** mellemrum — `spor/zoom`
målte, at 3-5 px overløb dækker naboen, så en løsning, der vokser kortet, er farlig.

**Mål mindst to veje, og skriv tallene for begge:**

- **A. Giv `<picture>` en højde**, som `.billedled--stor` og `.saml-fotofelt` allerede gør:
  `display:block;width:100%;height:100%`. **Én regel, samme form som de to eksisterende**, så
  systemet får tre steder med samme løsning frem for to plus en undtagelse. Pris: mål om
  billederne bliver mindre, og om kortets højde ændrer sig.
- **B. Flyt polstringen ud af billedet**, som `.billedled--stor` gør (`generator.css:334`).
  Pris: den ydre flade bliver mindre; mål om billedet så bliver for småt.

**Er A rigtig, så overvej at skrive den ét sted frem for tre.** Tre næsten ens
`picture`-regler er selv en systemfejl — men **det er en systembeslutning**, så foreslå den,
byg den ikke uden at skrive den frem i rapporten.

**Vælg den med mindst systempåvirkning, byg den, og skriv hvorfor den anden blev fravalgt.**

**Rør ikke `object-fit:contain`.** Den er ikke problemet, og den er L78's egen ordlyd.

## Ejerskab — og én advarsel om et samtidigt spor

**Du ejer:** `assets/generator.css` · `fund/BRIEF-ramme.md` · `fund/FUND-ramme.md` ·
`tests/dele/74-rammebeskaering.mjs` (**dit nummer er 74** — 72 er brugt, 73 er den anden
sessions; **vælg aldrig selv et nummer**).

**Du rører ikke:** `assets/system.css` (`.billedled img` på :1168 er systemets grundregel —
**rør den ikke**, og har du brug for det, så stop og rapportér) · `db/**` ·
`data/robots/**` · `media/_kilder/**` · `PLAN.md` · `DATAFLOW.md` · `tools/**` ·
`.claude/**` · `fund/PLAN-*.md` · `tests/dele/` ud over din egen 74.

**`fund/PLAN-katalog.md` foreslår selv ændringer i katalogets kort.** Læs den, så din
rettelse ikke modsiger den — men **du implementerer ikke planen**, kun bruddet.

## Acceptkriterier — kørt mod main af mig 3. sep, med "giver i dag X"

1. **Beskæring målt mod `.billedled`, ikke mod `<img>`:** ved 1440 px giver det i dag **32**
   af 85 med min tærskel på 0,5 px. Skal være **0**. Skriv din egen tærskel og dit eget
   før-tal.
2. **Samme måling ved 390 px** — i dag **ikke målt**. Mål før og efter.
3. `grep -c 'object-fit:contain' assets/system.css` → **giver i dag 1**, skal stadig være 1.
4. `"/c/Program Files/nodejs/node.exe" tools/build.mjs` → **samme sidetal som din
   grundmåling**.
5. `"/c/Program Files/nodejs/node.exe" tests/koer.mjs` → **1665 bestået / 0 fejlet** plus
   dine egne. **Forudsigelse** — mål og skriv det faktiske.
6. **Kortets højde og gitterets rytme:** mål kortets højde og sidens samlede højde før og
   efter. Ændrer de sig, skal rapporten sige med hvor meget og hvorfor det er acceptabelt.
7. `git diff --name-only main...spor/ramme` → kun dine ejede filer.

**Grundmåling, mine tal:** validate **77/0/1** · build **216 sider, 1111/0** · tests
**1665/0**. Afviger dine, så stop og rapportér — det er miljøet, ikke dit arbejde.

## Miljø

- **node:** `/c/Program Files/nodejs/node.exe`. Bar `node` giver **exit 127**, som ligner
  libuv-fælden fra CLAUDE.md, men er bash' `command not found`. **Læs fejlteksten.**
- **Din serverport er 8145.** Aldrig 8080. **Verificér serveren mod disken, før ét tal
  bruges** — vælg en streng, der kun findes i din udgave. **Luk serveren, når du er færdig,
  og skriv i rapporten, at du gjorde det.**
- **Serveren må ikke køre, når du bygger** — den låser `dist/`, EPERM.
- **DEN STYRBARE MCP-BROWSER ER FÆLLES PÅ TVÆRS AF SAMTIDIGE SPOR — også den aktuelle fane.**
  Målt 3. sep af to spor uafhængigt: et spor blev flyttet til en fremmed port, til en anden
  side og til sidst til **reddit.com**; bredden sprang 1440 → 1536 → 2048. **Egen port
  beskytter ikke.** Brug en isoleret Playwright fra `C:/Praktik/websites/maalevaerktoej`,
  eller skriv en URL- og bredde-vagt som **første linje i hver måling** og forkast tallet,
  hvis den fejler. `spor/prodplan` kører samtidig med dig.
- **Ingen `process.exit()` efter et netværkskald** — sæt `process.exitCode`. Libuv-assertion,
  exit 127.
- `.env` og `assets/fotos/fabrikant/` (**610 filer**) er kopieret ind af mig. Mangler de,
  fejler `validate.mjs` med 54 fejl, som **ikke** er dine.
- **Et grep på en klasse tæller kommentarer og bindestreger med.** Det har kostet **syv**
  forkerte tal på to dage — senest orkestratorens egen kontrol af `spor/zoom`. Mål
  selektorer, og kør altid en positiv kontrol.
- UTF-8 uden BOM · `git commit -F <fil>` ved backticks · `sed -i` fejler tavst, brug Edit.
- **Commit undervejs.**

## Rapporten — `fund/FUND-ramme.md`, højst 60 linjer

Valgt/fravalgt mekanisme med tal for **begge** · konfidens pr. punkt (høj kræver genkørbar
kommando **plus** én linje om, hvad tallet ville have været, hvis arbejdet var forkert) ·
usikkerheder · målinger som tal. **Uden for de 60, obligatorisk:** "Nye fælder og
opdagelser" og "Punkter i briefet, jeg ikke nåede".

**Briefets fakta er påstande, og mine har været forkerte ofte i dag.** Afviger din måling
fra min, så rapportér afvigelsen — det er en del af leverancen, ikke ulydighed. **Elleve af
orkestratorens fakta er blevet rettet af spor på to dage, og hver eneste rettelse var
rigtig.** Min årsagshypotese ovenfor er det mest sandsynlige sted, den tolvte findes.
