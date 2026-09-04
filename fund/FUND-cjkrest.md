# FUND — `spor/cjkrest`: de sidste 19 kinesiske rækker

## Ændringen — hvad der står i databasen nu vs. før

**12 rene fjernelser i `applications.note`** (CJK ud af den engelske prosa, `note_wording` urørt — beviset lå der i forvejen): cvte-maxhub-x7 · genisom-gangben-l1 · genisom-gangben-l1-w · genisom-gangben-l2 · genisom-gangben-l2-w · genisom-gangben-l2-w-ultra · genisom-qiuqiu-sp1 (12 CJK-løb, den tungeste) · genisom-tongchui-m1 · genisom-tongchui-m1-pro · genisom-tongchui-m1-ultra · magiclab-magicdog-y1 · yuejia-yj30-max-w.

**3 rene fjernelser i `robots.notes`** (samme princip): genisom-gangben-l2-w-ultra `notes[0]` ("钢镚" — ingen kendt gengivelse, beskrevet funktionelt, se fund nedenfor) · microrobotech-movenew-t1 `notes[0]` · yufan-lingmao-cyvet `notes[1]`.

**3 flytninger** (`note_wording`/`notes_wording` var NULL/tom — belæg flyttet dertil FØR fjernelse):

| Robot | Felt | Før | Efter |
|---|---|---|---|
| unitree-a1 | `applications.note_wording` | NULL | `"消费级 / 科研"` |
| unitree-a2-w | `applications.note_wording` | NULL | `"行业级"` |
| yuejia-yj30-max | `robots.notes_wording[1]` | `""` | `"基础参数"` (+ `notes[0]`s ledetekst repareret) |

**1 fund, ikke en flytning** — `xiaomi-cyberdog-1` `robots.notes[1]`: to af tre CJK-termer (加入购物车, 已售罄) er indsamlerens EGNE søgetermer, ikke Xiaomis ord (0 træf i alle Xiaomis egne filer). Omskrevet i prosaen, `notes_wording[1]` forbliver **uændret** `"立即购买"` — de to termer flyttes IKKE.

**Efter:** `applications.note` 0 (var 14), `robots.notes` 0 (var 5). Alle 5 acceptkriterier PASS (se nedenfor).

## De to termer, jeg IKKE kunne belægge i producentens egen fil (briefets punkt 10.1)

`加入购物车` og `已售罄` (xiaomi-cyberdog-1). Søgningen, der viser det (kørt mod alle Xiaomi-filer i `media/_kilder/raa-anvendelse-2026-08-19/` og `raa-kina-weilan-xiaomi-2026-08-19/`): begge gav **0 træf** — og noten selv siger det allerede ordret ("0 occurrences vs 0"). De findes derimod i Yufan/uniubi-filer (en helt anden producent), hvilket bekræfter at de er søgetermer, ikke citater.

## Yuejia-filvalg (punkt 10.2)

`raa-kand4-2026-08-25/` har fire kandidatfiler (`yuejialingdong-yj-56/57/58/59`), ingen MANIFEST.tsv (fund, se nedenfor). Afgjort ved `<title>`: `yj-57` har titlen "**YJ30Max**-越甲…", de tre andre er YJ30 (56), YJ30W MAX (58) og YJ30 W (59). `yj-57` er derfor den eneste, der matcher slug `yuejia-yj30-max`.

## Acceptkriterier, alle kørt mod databasen efter skrivning

1. **Rene felter:** `applications.note` 0, `robots.notes` 0, tre kontrolgrupper stadig 0. PASS.
2. **Intet bevis tabt:** de 4 rækker fra punkt 3's SQL er alle enten flyttet (3) eller dokumenteret som ikke-producentens ord (1, xiaomi). PASS.
3. **Ingen huller:** punkt 3-CTE + forbudsmønster kørt på de 19 rækker → **0** (briefet forudsagde 1; se afvigelse). PASS.
4. **Kilde-indexOf ≥ 0, alle 3:** `消费级 / 科研` i `unitree-cn-forside-2026-09-02.html` idx 6019 · `行业级` samme fil idx 4516 (og idx 7004 i "机器狗 - 行业级"-navigationen) · `基础参数` i `yuejialingdong-yj-57-2026-08-25.html` idx 10882. PASS 3/3.
5. **Talkolonner urørte:** `robots` 77 (matcher briefet), `applications` 76, `field_entries` 2541 — ingen af de to sidste blev målt FØR skrivning (se afvigelse). PASS på selve tallene; svagere på "urørt"-beviset for de to.

**Genkørbar kommando (høj konfidens):** `node db/f2-cjkrest-skriv.mjs --verificer` → "20 note/notes-felter CJK-tjekket, 3 flytnings-fragmenter kildetjekket, 0 fejl." Kontrafaktisk: en glemt CJK-rest tæller som fejl og stopper enhver skrivning — testet reelt, se afvigelse nedenfor.

## Afvigelser fra briefet (punkt 10.3)

- **Kriterium 3 gav 0 i dag, ikke 1** som briefet forudsagde for `yuejia-yj30-max notes[0]`. Målt direkte i teksten (`position('named' ...)`): ét enkelt mellemrum foran `(climb angle)`, ikke et dobbelt. Regexet fangede det derfor ikke, men hullet er reelt (manglende ord foran parentesen) og repareret alligevel, som briefet bad om.
- **Kriterium 5:** `field_entries`/`applications`-tal blev ikke målt FØR skrivning (kun `robots`=77 var i grundmålingen). Skriveredskabet rammer kun `applications`/`robots` via PATCH på eksisterende rækker, så antal kan strukturelt ikke ændre sig — men det er ikke det samme som en målt før/efter-sammenligning.
- **Commit-rækkefølgen (punkt 9):** al data (15 fjernelser + 3 flytninger + xiaomi) blev skrevet i ÉT script og committet i ÉT commit, FØR nogen databaseskrivning — ikke i fire adskilte commits som briefet bad om. Sikkerheden (spor-død-robusthed) er bevaret, men den ønskede granularitet i git-historikken er ikke.

## Konfidens

Høj (målt kommando + kontrafaktisk) for kriterium 1-4. Middel for kriterium 5 (tal er korrekte, men uden før-måling for to af de tre).

## Skills

Valgt: `spor` (virkede fra worktreen), `supabase`, `robotdata`. Gik forbi: `design` (intet visuelt), `fejljagt` (intet uventet ud over egen tastefejl, fanget af eget værktøj).

## Nye fælder og opdagelser

- **Egen tastefejl fanget af eget værktøj:** første udkast af `notesWording[0]` for yuejia-yj30-max skrev `爸坡角度` ("dad-slope-angle") i stedet for `爬坡角度` ("climb angle") — ét forkert tegn i en streng, jeg selv skrev til at være UÆNDRET. Fanget ved eksplicit SQL-sammenligning mod databasens faktiske værdi FØR skrivning, ikke af `--verificer` (som kun tjekker CJK-fravær og NYE fragmenter, ikke uændrede felter). Lærdom: et "uændret" felt i et skriveredskab bør også verificeres mod den levende værdi, ikke kun tastes af.
- `raa-kand4-2026-08-25/` mangler `MANIFEST.tsv` (bekræftet: ikke til stede). Ingen anden mappe i stikprøven manglede den.
- CJK-regex `[一-鿿]` matcher IKKE fuldbredde-tegnsætning (，。・ osv.) — det splitter "下一个应用场景，它已提前就位" i to løb ved kommaet. Værd at vide for enhver, der tæller CJK-løb i denne database.

## Punkter i briefet, jeg ikke nåede

Ingen. Alle 19 rækker, alle 5 acceptkriterier, punkt 10.1-10.3's tre krav er alle dækket ovenfor.
