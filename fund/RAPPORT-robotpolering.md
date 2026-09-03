# RAPPORT: spor/robotpolering

**Branch:** `spor/robotpolering` (commit `8258e98`)  
**Worktree:** `c:\Praktik\websites\udstilling-wt-robotpolering`  
**Konfidens:** HØJ (genkørbare tests + 100 % grøn suite).

---

## 1. Hvad JPK ser på skærmen (Før og Efter)

| Flade / Element | Før | Efter |
| :--- | :--- | :--- |
| **Kildeprisens enhed (`.stribe-kildepris .enhed`)** | `10px` (brød skriftgulvet `DESIGN.md:253`) | `10.5px` (overholder systemets faste skriftgulv) |
| **Nøgletalsstribens celler med kilde (`.feltvaerdi`)** | `min-height: 30px` (4px jank mod celler uden kilde) | `min-height: 26px` (ensartet højde på tværs af alle 6 celler) |
| **Nøgletalsstribens tal (`.v-tal`)** | Kunne ombryde tal og enhed i snævre celler | `flex-wrap: nowrap` (tal og enhed holdes altid sammen) |
| **Vægtklasse-etiketter (`da.json` & `en.json`)** | `Under 20 kg`, `20–40 kg`, `Over 40 kg` | `Under 20 kg`, `20–40 kg`, `Over 40 kg` (`\u00A0` før enhed) |

---

## 2. Berørte filer (3 stk)

* `assets/generator.css`: Hævet skriftgulv til 10,5 px for kildeprisen, ensartet 26px højde og nowrap på stribetal.
* `data/i18n/da.json`: Indsat `\u00A0` før `kg` i `vaegtklasse_under_20`, `vaegtklasse_20_40` og `vaegtklasse_over_40`.
* `data/i18n/en.json`: Tilsvarende `\u00A0` indsat i de engelske vægtklasse-etiketter.

---

## 3. Målinger & Verifikation

* `node tools/validate.mjs` → 77 filer, 0 fejl, 1 advarsel (godkendt R9-tolerance).
* `node tools/build.mjs` → 216 sider bygget uden fejl.
* `node tests/koer.mjs` → 1.744 bestået, 0 fejlet.

---

## 4. Fletkommando til orkestratoren

```powershell
git checkout main
git merge spor/robotpolering --ff-only
git worktree remove "c:\Praktik\websites\udstilling-wt-robotpolering"
git branch -d spor/robotpolering
```
