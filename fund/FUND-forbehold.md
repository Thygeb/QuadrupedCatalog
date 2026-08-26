# FUND-forbehold.md — det målte grundlag for D14

26. aug 2026. Skrevet af orkestratoren, ikke af et spor: STATUS.md D14 siger
*"fordelingen måles, før noget ændres — grænsen sættes på et målt grundlag,
ikke et skøn, jf. hård begrænsning 6's krav om en offentliggjort metode."*
Det her er den måling. **Der er ikke ændret en eneste fil i data, kode eller
skabeloner.**

Alle tal er kørt mod `dist/robots.json` fra bygget på `main` (commit `a8c3ec4`,
213 sider). Hver kommando står ved sit tal og kan genkøres.

---

## 1. Udgangstallet holder — 562 af 813, og det er 69,1 %

```
node -e "
const j=require('./dist/robots.json');
let n=0,f=0;
for(const r of j.robotter) for(const p of Object.values(r.alle_felter||{}))
  if(p&&typeof p==='object'&&p.tilstand==='tal'){n++; if(p.forbehold)f++;}
console.log(n,f,(100*f/n).toFixed(1)+'%');"
```
→ `813 562 69.1%`

**520 af de 562 tekster er unikke.** Median 100 tegn, korteste 11
(`"IP66级防水防尘".`), længste 759. Det er altså ikke én gentaget standardfrase,
der oppuster tallet — det er 520 individuelt skrevne forbehold.

Fordelt på felt, de ti tungeste:

| Felt | Forbehold |
|---|---|
| driftstid | 65 |
| nyttelast_gaaende | 61 |
| hastighed | 57 |
| egenvaegt | 56 |
| hoejde | 44 |
| haeldning | 41 |
| trappetrin_kontinuerlig | 38 |
| forhindring_enkelt | 29 |
| laengde | 28 |
| nyttelast_staaende | 25 |

D14's diagnose bekræftes: et mærke på to tredjedele af alle tal skelner
ingenting. Men fordelingen viser også, **hvor** stjernen bliver tekstur —
`driftstid` har 65 forbehold på 77 robotter.

---

## 2. Hovedfundet: en nøgleordsklassifikation kan ikke bære beslutningen

D14 vil dele forbeholdene i **gyldighed** (modstridende kilder, faktor 10-fejl,
prøvemaskine-tal → synligt mærke) og **uddybning** ("inkl. batteri" → `title`
uden mærke). Jeg byggede en mønsterklassifikation på fire signalgrupper —
modstrid, slutning, ikke-målt, enhedsfare — og kørte den over alle 562.

**Resultat: 99 gyldighed (17,6 %) mod 463 uddybning.**

Så håndgraderede jeg en **deterministisk stikprøve på 40** (hver 14. post, så
den kan genkøres og give samme 40). **11 af 40 var forkert klassificeret —
en fejlrate på 27,5 %:** 9 falske negativer, 2 falske positiver.

**Det er derfor konklusionen her ikke er et tal, men en advarsel:** sendes et
spor ud med "brug disse regexer", producerer det en klassifikation, der er
forkert på hver fjerde post — og forkert *systematisk*, ikke tilfældigt.

### De to falske positiver — samme sætning, to domme

`galileo-e1-w hastighed` og `galileo-s1-w hastighed` blev mærket
gyldighedstruende på ordet *"grænsehastigheden ikke brugt som hovedværdi"*.
Men den sætning siger jo, at vi valgte det **forsigtige** tal. Den gør tallet
mere pålideligt, ikke mindre.

Værre: `genisom-gangben-l2-w-ultra hastighed` siger nøjagtig det samme —
*"En separat 极限速度 på 5 m/s er også oplyst - ikke brugt som hovedværdi"* — og
blev mærket **uddybning**, fordi ordet stod på kinesisk. Samme indhold, modsat
dom. Det er klassifikationens egen inkonsistens, ikke datas.

### De ni falske negativer falder i seks familier

Familierne er det brugbare her — de er de mønstre, en klassifikation skal
kunne, og som ingen af mine regexer fangede:

| Familie | Eksempel | Hvorfor det truer gyldigheden |
|---|---|---|
| **Øvre ende af et interval vist alene** | `unitree-as2-w forhindring_enkelt`: *"Max Climb Height er et interval 0,4~0,8 m. Sidens nøgletalskort præsenterer den øvre ende alene som 80 cm"* | Læseren ser bedstefaldet som om det var tallet |
| **Producenten siger selv, tallet ikke nås** | `unitree-b2 hastighed`: *"realized in special configurations, in practice there is a speed limit"* | Kilden dementerer sit eget tal |
| **Ikke sammenligneligt med naboerne** | `unitree-go2 driftstid`: *"Uden lastbetingelse. Tallet kan derfor ikke stå i samme kolonne som B2's og A2's"* | På en sammenligningsside er det hele pointen |
| **Gælder serien, ikke modellen** | `pudu-d5 hastighed`: *"Fra generel markedsføringstekst, gældende for D5-serien bredt"* | Tallet er ikke denne maskines |
| **Udledt af en sammenlagt eller umærket kolonne** | `yuejia-yj30 haeldning`: *"Fra den sammenlagte kolonne 爬坡角度/DOF"* | Feltets identitet er en tolkning |
| **Gående/stående-tildelingen er vores** | `magiclab-magicdog-edu nyttelast_gaaende`: *"Der skelnes ikke mellem gående og stående last"* | Klassifikationen fangede 2 af 3 med samme indhold |

**Anbefaling til D14's brief:** send ikke regexerne. Send **familierne** som
kriterium og lad sporet læse hver af de 562 og mærke den. 562 poster er
læsbare — det er en dags arbejde, ikke en uges — og det er den eneste måde,
grænsen kan holde til hård begrænsning 6's krav om en metode med
acceptkriterier. Klassifikationens 99 kan bruges som **startbunke**, ikke som
facit, og de seks familier ovenfor er de tilfælde, den beviseligt taber.

---

## 3. Et andet fund undervejs: hver femte forbehold er skrevet til en udvikler

Det her stod ikke i briefet og er ikke D14. Det er værre.

```
node -e "
const j=require('./dist/robots.json');
const I=/skal normaliseres|i indlaesningen|\.yaml|\.mjs|regel \d|se topnoten|topnote|skemaet har|ved_last|_gaaende|_staaende|validator/i;
let n=0,t=0;
for(const r of j.robotter) for(const p of Object.values(r.alle_felter||{}))
  if(p&&typeof p==='object'&&p.tilstand==='tal'&&p.forbehold){t++; if(I.test(p.forbehold))n++;}
console.log(n,'af',t);"
```
→ `114 af 562` — **20,3 %** af talfelternes forbehold.

**Første udgave af den kommando manglede `p.tilstand==='tal'` og gav `155 af 890`.**
Det står her, fordi det er dagens anden forekomst af ARBEJDSGANG-2's O2 — et
acceptkriterium, der ikke blev kørt i den form, det blev skrevet. Det blev
fanget, fordi jeg kørte kommandoen af dokumentet bagefter, ikke fordi jeg
huskede filteret.

**Og de 890 er faktisk det sandere omfang:** interne henvisninger er lige så
uegnede i et tekstfelts forbehold som i et talfelts. **155 af 890 forbehold i
alt (17,4 %) bærer udviklervendt sprog.** Tallene nedenfor er opgjort på de
562, fordi D14's ramme er talfelterne.

Fordelt på, hvad der gør dem interne. Grupperne overlapper — én post kan træffe
flere — og alle otte tal er kørt med samme regex som ovenfor, hver enkelt
isoleret:

| Mønster | Antal | Hvad læseren møder |
|---|---|---|
| `skemaet har [intet felt til…]` | **48** | En oplysning om **vores** datamodel, ikke om producentens tal |
| `se topnoten` / `topnote` | **31** | En henvisning til noget, der ikke hedder "topnote" nogen steder på siden |
| `regel N` | **15** | Regelnumre fra et dokument, der ikke er offentligt |
| filnavne på `.yaml` / `.mjs` | **12** | `se galileo-c1.yaml` — en fil, læseren aldrig får at se |
| feltnavnet `ved_last` | **11** | Et internt nøglenavn |
| `_gaaende` / `_staaende` | **8** | Interne feltnøgler |
| `validator` | **4** | Vores værktøj |
| **direkte instruks** | **2** | `weilan-alphadog-c500` og `-c501`, `temp_maks`: *"Skal normaliseres i indlæsningen, ellers matcher intervalparseren ikke"* |

De to sidste er en **opgavebeskrivelse til en udvikler, trykt på en offentlig
katalogside**. Det er præcis KRITIK-2 fund 1 — *"interne revisionsnoter på
offentlige kort"* — som `spor/prosa` lukkede 25. aug. Runden fangede
kortfodnoterne; den fangede ikke de 114 i `advarsel`-feltet.

**Å15 fastslog reglen allerede:** *"`advarsel` bærer kun producentvendte
forbehold; hvorfor-vi-rettede-det hører i `KILDEKORT-*.md` eller
`fund/FUND-*.md`."* Reglen findes. Målingen viser, at den ikke er håndhævet
på 114 poster — og der er intet, der håndhæver den mekanisk.

**Det billigste værn, og det bør med i samme spor som D14:** en validatorregel,
der afviser et `advarsel`-felt indeholdende `.yaml`, `.mjs`, et internt feltnavn
(`ved_last`, `_gaaende`, `_staaende`), ordet `validator` eller en direkte
instruks. Den kan ikke skride, som en skreven regel kan.

**Målt, hvad den ville koste i dag:**
```
node -e "
const j=require('./dist/robots.json');
const V=/\.yaml|\.mjs|ved_last|_gaaende|_staaende|validator|skal normaliseres|i indlaesningen/i;
let tal=0,alle=0;
for(const r of j.robotter) for(const p of Object.values(r.alle_felter||{}))
  if(p&&typeof p==='object'&&p.forbehold&&V.test(p.forbehold)){alle++; if(p.tilstand==='tal')tal++;}
console.log(tal,alle);"
```
→ `37 48` — **37 talfelter og 48 forbehold i alt skal skrives om**, før reglen
kan slås til. Det er arbejdet, ikke en biting: en validatorregel, der slås til
med 48 røde, bliver slået fra igen.

**Bemærk, at `skemaet har` (48) og `se topnoten` (31) IKKE er med i vagten.**
De er interne, men de er ikke maskinelt skelnelige fra en legitim sætning, og en
vagt, der rammer dem, ville afvise korrekt prosa. De hører i læserunden sammen
med D14's egen klassifikation.

---

---

## 3b. Og det værste sted er ikke `advarsel` — det er `Noter`

Fundet ovenfor fik mig til at efterprøve, om `se topnoten` overhovedet kan
følges af en læser. Det kan den næsten: `noter:` renderes på robotsiden under
overskriften **"Noter"** — ordet *"topnote"* står ingen steder på siden, så
henvisningen er gættelig, ikke tydelig.

Men målingen viste noget andet. **Første linje på Addverb Trakr 20's offentlige
side er:**

> *"STOPPROEVE (firbenet): BESTAAET, samme grundlag som Trakr 5 - samme
> produktside, samme quadruped-sprogbrug, samme afsnit før fane-vælgeren."*

Det er vores egen indsamlingsprotokol, trykt til en besøgende.

```
node -e "
const fs=require('fs'),path=require('path');
const I=/STOPPROEVE|BESTAAET|arvet_fra|\.yaml|\.mjs|validator|regel \d|kildekort|scope|skemaet|ved_last|_gaaende|_staaende/i;
const rod='dist/da/robotter';
let sider=0,medNoter=0,noter=0,interne=0; const ramte=new Set();
for(const d of fs.readdirSync(rod)){
  const f=path.join(rod,d,'index.html'); if(!fs.existsSync(f)) continue; sider++;
  const h=fs.readFileSync(f,'utf8'); const i=h.indexOf('<ul class=\"noter\">'); if(i<0) continue;
  medNoter++;
  for(const li of h.slice(i,h.indexOf('</ul>',i)).split('<li>').slice(1)){
    noter++; if(I.test(li.replace(/<[^>]*>/g,''))){interne++; ramte.add(d);}
  }
}
console.log(sider,medNoter,noter,interne,ramte.size);"
```
→ `77 74 325 100 37`

**100 af 325 offentlige noter (30,8 %) på 37 af 77 robotsider bærer intern
revisionstekst.**

**Hvorfor det ikke blev fanget før.** KRITIK-2 fund 1 hed *"interne
revisionsnoter på offentlige kort"*, og `spor/prosa` lukkede den 25. aug —
på **kortene**. Ingen så efter på robotsiden, fordi fundet var formuleret om
kortet. Det er præcis den fælde, projektets egen regel advarer mod: *"`fil:linje`
beviser at kode findes; det beviser ikke at nogen kalder den"* — her i sin
omvendte form, hvor en lukket sag beviseligt kun blev lukket ét af de to
steder, den fandtes.

**Og det er Å15's dilemma, der vender tilbage.** Å15 forkastede `noter:` som
destination for revisionshistorik med den begrundelse, at *"feltet vises på
robotsiden"* — men konstaterede ikke, at der allerede **lå** 100 sådanne noter
i det. Reglen blev skrevet; oprydningen blev ikke lavet.

**Rækkefølgen, det skal gøres i, og den er ikke til forhandling:** en note må
aldrig slettes fra en datafil, før det er efterprøvet, at `KILDEKORT-*.md` eller
`fund/FUND-*.md` bærer den (Å15's egen regel). STOPPROEVE-noterne er beviset
for, at en maskine overhovedet hører til i kataloget — de skal **flyttes**, ikke
fjernes.

---

## 4. Hvad jeg ikke målte

- **Hvor mange af de 114 interne forbehold der også er gyldighedstruende.** De
  to spørgsmål er uafhængige, og jeg har kun krydset dem på stikprøven.
- **Fejlraten på de resterende 522.** 27,5 % er målt på 40 og gælder de 40.
  Stikprøven er deterministisk og kan udvides; den er ikke tilfældig i
  statistisk forstand, og tallet skal derfor læses som en størrelsesorden.

## 5. Filer

Arbejdsdata ligger uden for repoet i sessionens skrabeblok
(`forbehold.json`, `forbehold-klassificeret.json`) — de er et mellemresultat,
ikke en leverance, og kan genskabes med kommandoerne ovenfor.
