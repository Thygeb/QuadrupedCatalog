/**
 * tests/dele/_faelles.mjs — delt infrastruktur for tests/koer.mjs's dele.
 *
 * Alt her er INFRASTRUKTUR, ikke selve testreglerne: sti-opløsning, de tre
 * skema/yaml/alder-moduler (importeret ÉN gang her og delt af alle dele - to
 * læsninger af samme fil er præcis den fejl, build.mjs's egen kommentar
 * advarer om ved L186), og de få hjælpefunktioner mere end én del har brug
 * for (taelFilerRekursivt, lasRobotter, operatorRegex, koerValidator).
 *
 * En del-fil, der ikke har brug for noget herfra, importerer den bare ikke -
 * se tests/LAESMIG.md for kontrakten en ny del skal følge.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export const rod = path.resolve(
  path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'),
  '..', '..',
);
export const node = process.execPath;

export const skema = await import(`file://${path.join(rod, 'tools', 'skema.mjs').replace(/\\/g, '/')}`);
export const yaml = await import(`file://${path.join(rod, 'tools', 'yaml.mjs').replace(/\\/g, '/')}`);
export const alder = await import(`file://${path.join(rod, 'tools', 'alder.mjs').replace(/\\/g, '/')}`);

/** Taeller filer rekursivt under `dir`. Delt af de steder, der har brug for et
 *  filtal uden at gentage gaa()-moenstret hver gang. */
export function taelFilerRekursivt(dir, filtrer = () => true) {
  let n = 0;
  if (!fs.existsSync(dir)) return n;
  (function gaa(m) {
    for (const p of fs.readdirSync(m, { withFileTypes: true })) {
      const sti = path.join(m, p.name);
      if (p.isDirectory()) { gaa(sti); continue; }
      if (filtrer(p.name)) n++;
    }
  })(dir);
  return n;
}

/** Laeser og normaliserer alle robot-YAML'er i en mappe - samme parse+normaliser-
 *  kaede som build.mjs selv koerer (L186-189), samlet ét sted i stedet for skrevet
 *  ud for hver fixture, der skal laeses. */
export function lasRobotter(mappe) {
  return fs.readdirSync(mappe).filter((f) => /\.ya?ml$/.test(f))
    .map((f) => skema.normaliserRobot(yaml.parseYaml(fs.readFileSync(path.join(mappe, f), 'utf8'), f)));
}

/** Bygger regex'en for "operator + skaermlaesertekst + tal [+ enhed]", som gaar
 *  igen for hvert operator-tilfaelde (">", "ca.", "≤" ...). Ét sted at rette,
 *  hvis side.mjs's tal()-markup nogensinde flytter sig igen. */
export function operatorRegex(op, tal, enhed) {
  return new RegExp(`<span class="op" aria-hidden="true">${op}</span><span class="kunskaerm">[^<]*</span>`
    + `<b class="num">${tal}</b>` + (enhed ? `<span class="enhed">${enhed}</span>` : ''));
}

/** Koerer tools/validate.mjs mod `args` og giver {kode, ud}. */
export function koerValidator(args) {
  const r = spawnSync(node, [path.join(rod, 'tools', 'validate.mjs'), ...args],
    { cwd: rod, encoding: 'utf8' });
  return { kode: r.status, ud: (r.stdout || '') + (r.stderr || '') };
}
