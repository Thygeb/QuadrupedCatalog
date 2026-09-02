# FUND — spor/saml3: sammenligningsfladen, JPK's to instrukser

**Skill:** `impeccable audit` (kaldt fra worktreen, **virkede**) — begge ændringer er tilgængelighedssager forklædt
som oprydning. **Gik forbi:** `impeccable layout`, `impeccable critique`/`ui-ux-critique` (L70: jeg udfører, jeg dømmer
ikke fladen), `fejljagt` (fulgt, ikke kaldt), `robotdata`/`supabase`/`parallelt` (ikke relevante).

## Valgt og fravalgt

**Punkt 1:** markørerne fjernet fra `svarHTML()` **og** de tre CSS-regler i samme commit.
Fravalgt: kun markup'en (havde givet død CSS nr. 67, Å102).

**Punkt 2 — handlingen:** hver kolonne fik en knap, der **fjerner netop sin egen robot**. Den er ikke tre kopier af L73's
kataloglink, fordi den ikke fører nogen steder hen: tre knapper, tre forskellige virkninger. L73 står urørt — man kan
kun *tilføje* fra kataloget, og kataloghenvisningen står **én** gang, kun når en plads er ledig. **Fravalgt:** *skift
robot i kolonnen* (kræver en vælger på siden — det, spor/saml2 fjernede); *tre kataloglinks* (afvist på forhånd);
*en fjerde, tom kolonne* (et `<th>` uden kolonne er den fejl, hjørnecellen er et `<td>` for at undgå; 33 tomme celler
ville presse de valgte sammen for ingenting).

**Siden skriver nu til localStorage** — det vender spor/saml2's *"ren visning, ikke betjening"*. Katalogets bundbjælke
læser samme nøgle, så en fjernelse, der kun ændrede visningen, gav to uenige flader. Målt efter klikket: "2 valgt".

## Konfidens

| Punkt | Niveau | Bevis | Hvis arbejdet var forkert |
|---|---|---|---|
| Bokse væk, tælling bliver | Høj | `grep -c 'saml-svar__m' assets/sammenligning.js` → 0; `svar_taeller` → 1 | Bokse: 99 i output. Tælling: 38.15a gav 0 af 33 |
| Ingen død CSS | Høj | `tests/koer.mjs` → 57.1 grøn med 19 (var 20) | Efterladt regel → 20 mod 19, 57.1 fælder |
| Knap pr. kolonne + klik virker | Høj | 66.4 slugs = kolonnernes; browser: `[As2, As2-W, Hypertron]` → `[As2, Hypertron]`, lager skrevet | Tre ens links → 1 unik slug; uden `gemUdvalg` faldt robotten tilbage ind (66.14) |
| Berøringsmål og kontrast | Høj | Browser: `::after` 48,3 × 44; invitation 127 × 44, 14,69:1; fjern-knap 5,94:1 | Uden `::after` 48 × 26; kontrasten målt **1,16:1** før rettelsen |
| Fokus efter fjernelse | Høj (som **fund**) | Browser: `activeElement` går til `BODY` | — |

## Usikkerheder

1. **Fokus går tabt, og intet annonceres.** Målt: `BODY` efter klik; `[data-saml-status]` (`aria-live="polite"`) er tom
   og `hidden`. **Ikke rettet — L70:** hvor fokus skal hen er en systembeslutning om alle sidens omtegninger, ikke min knap.
2. **`.nulstil` er en mørk-flade-knap, og det står ingen steder** — enhver genbrug på lys bund
   falder i samme hul, indtil L77's knapprimitiv findes.
3. **Ét sprog set med øjne:** skærmbillederne er `da`; `en` er kun målt (66.x kører begge).

## Målinger

```
grundmaaling (a405066):  validate 77/0/1 · build 216/1111/0 · tests 1478/1
efter punkt 1:                                                tests 1480/1
efter punkt 2:           validate 77/0/1 · build 216/1111/0 · tests 1517/1
```
Den ene røde er hele vejen `63(c)` (CRLF i `db/migrering-engelsk.sql`) — rød før mit spor; **der er aldrig 2 røde.**
S1 **0** · S2 **1** · S3 **0** · S4 **0** · S5 **0** · S6 **1** · S7 `\.videre` **0** — alle syv rammer målet.
**Assertions vendt: 12** (38: 14/15/21/22/25 · 55: 8/9/10/11/13/15), **nye: 21** (57: 20 → 19; 66: 15 assertions, 5 modbeviser).

**S8 (browser, egen port 8232, verificeret mod disken: 4 = 4, senere 1 = 1):** boksene er væk (0 `saml-svar` i DOM'en,
33 `.kunskaerm`-tællinger tilbage) · en FJERN-knap under hver af de tre robotter, navne "Fjern As2 fra sammenligningen" ·
klik på As2-W fjerner **netop den** kolonne, skriver lageret, og invitationen dukker op, 1 stk. **Serveren er lukket**
(`curl` exit 7), `tests/.tmp-koersel` ryddet (2,6 GB).

**Afvigelser fra briefet:** S7-mønsteret er for bredt — rå `grep -c 'videre'` giver **2**, begge det almindelige ord i
*"ingen vej videre"*; `grep -c '\.videre'` giver **0**, kriteriets hensigt. De syv "giver i dag"-tal var alle korrekte.
`sammenligning.mjs`s kommentar løj: reglen stod på `generator.css:178`, ikke `345`, og forsiden brugte den ikke længere.

---

## Nye fælder og opdagelser

**1. En kodekommentar tæller med i sit eget acceptkriterium — det ramte mig fire gange.**
Briefet advarede om det for HTML-kommentarer; det gælder lige så hårdt for JS og CSS, og det er
værre der, fordi en god kommentar *skal* citere det, den forklarer. S4, S5 og S7 gik røde på et
intakt arbejde, fordi mine forklaringer nævnte `.afslutning-knap` og `.videre` ordret.
**To forskellige løsninger, og valget mellem dem er pointen:** for *testene* strippede jeg
kommentarer før målingen (55.13/55.15b) — den rigtige vej, når man ejer måleapparatet. For
*acceptkriterierne*, som er sporets kontrakt og ikke kan ændres, flyttede jeg de ordrette navne
til commit-beskeden og skrev i filen **hvorfor** navnet ikke står der. Ellers sætter næste læser
det tilbage.

**2. Et modbevis kan måle sin egen mutation i stedet for reglen.** 66.12 muterede
`<button … class="specimen__fjern nulstil"` væk og krævede, at knapantallet faldt til 0. Det
gjorde det ikke — målingen læser `data-saml-fjern`, som mutationen lod stå. Rød test, korrekt
arbejde. **Reglen: mutationen skal ramme præcis den streng, målingen læser** — ikke noget, der
"hører til" samme element.

**3. `.nulstil` er en MØRK-flade-knap, og det er ikke skrevet nogen steder.** Dens
`color:var(--paafod)` er `#E8EBED` — en *lys* forgrund, fordi katalogets nulstil-knap står på en
mørk flade. Jeg satte den på sidens lyse bund og målte **1,16:1**: knappen var praktisk talt
usynlig, og *ingen test fangede det* — de læser kildetekst, ikke pixels. Det er L70's egen lærdom
ordret (*"Et kontrasttal uden en læseretning er ikke et tal"*), nu på et andet token end
`--accent`. **Og rettelsen virkede ikke i første forsøg:** `.saml-invit__link` (0,1,0) er præcis
lige så specifik som `.nulstil`, der står ~700 linjer senere og vinder — anden måling gav stadig
1,16. Først `.saml-invit .saml-invit__link` (0,2,0) gav **14,69:1**. **To lærdomme: skriv aldrig
et "eftermålt"-tal i en kommentar, før du har målt det** (jeg nåede at skrive 14,9 som en
udledning; den var forkert i praksis, fordi reglen slet ikke trådte i kraft) — og **en låneform
skal måles på den flade, den lånes til.**

**4. `dist/` fandtes ikke i en frisk worktree**, så mit første kontrolgrep efter
`.afslutning-knap` i `dist/` gav **0** — et fuldstændig plausibelt tal, der betød "ingen build",
ikke "ubrugt klasse". Kontrollinjen (*forventer 216 eller færre*) gjorde forskellen synlig.

**5. Playwright-MCP'ens skrive-rødder peger på HOVEDREPOET** (`c:\Praktik\websites\udstilling`),
ikke på worktreen. `browser_take_screenshot` til scratchpad blev afvist, og default-stien ville
have skrevet i det repo, sporet ikke må røre. Løsning: eget lille Playwright-script i scratchpad
mod måleværktøjets `node_modules` — det kan også sætte `localStorage` **før** siden loader,
hvilket `flade-skud.mjs` ikke kan, og som er eneste måde at fotografere 2-robot-tilstanden.

**6. `powershell` er ikke på PATH i Git Bash** (kun `/c/Windows/System32/WindowsPowerShell/v1.0/`),
og `netstat` findes ikke. Uden dem kan man ikke finde PID'en bag sin egen port og lukke den.

**7. Katalogsiden har 86 `.kort__saml`-knapper til 77 robotter** — 9 robotter står to steder
("seneste"-strimlen), så 2 valgte robotter viser **4** knapper i trykket tilstand. Korrekt
adfærd, ikke en fejl, og ikke min fil — noteret, så næste måler ikke jagter det.

## Punkter i briefet, jeg ikke nåede

- Ingen. Begge punkter, alle ni acceptkriterier, begge commits, den nye test 66 og de tre vendte
  testfiler er leveret og målt.
- **Bevidst ikke gjort, jf. designfrysen:** fokusstyring og live-annoncering efter en fjernelse
  (usikkerhed 1). Fundet er skrevet frem, ikke rettet.
