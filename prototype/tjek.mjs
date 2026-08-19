// Efterproever prototypens paastande. Koeres med:
//   "/c/Program Files/nodejs/node.exe" prototype/tjek.mjs
//
// Del 1: kodning, tagbalance, ingen BOM, ingen oedelagt UTF-8.
// Del 2: at filtrene UDEN JavaScript faktisk rammer raekker, at tallene paa
//        filterknapperne er sande, og at tomtilstandens tre paastande holder.
//
// Grunden til at del 2 findes: en CSS-regel man kan LAESE, beviser ikke at den
// RAMMER noget. Foerste udgave af de her filtre pegede paa id'er der fandtes,
// men reglerne paa forsiderne rammede nul raekker. Det blev fanget her.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Koer altid mod scriptets egen mappe, saa den kan kaldes fra hvor som helst.
process.chdir(path.dirname(fileURLToPath(import.meta.url)));
const filer=['forside-a.html','forside-b.html','katalog.html','detaljeside.html'];
const tom=new Set(['area','base','br','col','embed','hr','img','input','link','meta','source','track','wbr']);
let fejl=0;
for(const f of filer){
  const buf=fs.readFileSync(f);
  const bom=buf[0]===0xEF&&buf[1]===0xBB&&buf[2]===0xBF;
  const s=buf.toString('utf8');
  // fjern style/script/kommentarer foer tagbalance
  const rens=s.replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<!--[\s\S]*?-->/g,'');
  const stak=[]; const problemer=[];
  const re=/<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*?)(\/?)>/g; let m;
  while((m=re.exec(rens))){
    const luk=m[1]==='/', tag=m[2].toLowerCase(), selvluk=m[4]==='/';
    if(tom.has(tag)||selvluk) continue;
    if(!luk) stak.push(tag);
    else{
      if(stak.length===0){problemer.push(`lukker </${tag}> uden aabning`);}
      else if(stak[stak.length-1]!==tag){problemer.push(`</${tag}> lukker men <${stak[stak.length-1]}> var aaben`);stak.pop();}
      else stak.pop();
    }
  }
  if(stak.length) problemer.push(`uafsluttede: ${stak.join(', ')}`);
  const kb=(buf.length/1024).toFixed(1);
  console.log(`${f.padEnd(20)} ${kb.padStart(6)} KB  BOM=${bom?'JA (FEJL)':'nej'}  tagbalance=${problemer.length?'FEJL':'ok'}`);
  problemer.slice(0,6).forEach(p=>console.log('    -',p));
  if(bom||problemer.length) fejl++;
  // ikke-ASCII kontrol: skal kun vaere gyldig UTF-8 (allerede sikret) -- tjek for U+FFFD
  const daarlig=(s.match(/\uFFFD/g)||[]).length;
  if(daarlig) {console.log(`    - ${daarlig} erstatningstegn U+FFFD (oedelagt encoding)`); fejl++;}
}
console.log(fejl? `\n${fejl} fil(er) med problemer.` : '\nAlle 4 filer: UTF-8 uden BOM, tagbalance ok.');


console.log(String.fromCharCode(10) + "=".repeat(60) + String.fromCharCode(10) + "DEL 2 -- DATA OG FILTRE" + String.fromCharCode(10) + "=".repeat(60));

{

const s=fs.readFileSync('katalog.html','utf8');
const css=s.match(/<style[\s\S]*?<\/style>/i)[0];
const html=s.replace(/<style[\s\S]*?<\/style>/i,'');

// robust attributparsing -- ingen regex-escapes at tage fejl af
function attrs(tagIndre){
  const ud={};
  for(const m of tagIndre.matchAll(/([a-zA-Z0-9-]+)(?:="([^"]*)")?/g)){
    if(m[1]) ud[m[1]] = m[2]===undefined ? true : m[2];
  }
  return ud;
}
const tbodies=[...html.matchAll(/<tbody([^>]*)>/g)].map(m=>attrs(m[1])).filter(t=>t['class']!=='tomrad');
const navne=[...html.matchAll(/class="model"><a href="detaljeside\.html">([^<]+)</g)].map(m=>m[1]);
console.log(`Poster: ${tbodies.length} tbody, ${navne.length} navne`);
console.log('Parset foerste post:', JSON.stringify(tbodies[1]));

const regler={
 'f-ip67':      t=>!!t['data-ip67'],
 'f-last20':    t=>!!t['data-last20'],
 'f-frost':     t=>!!t['data-frost'],
 'f-ce':        t=>!!t['data-ce'],
 'f-pris':      t=>!!t['data-pris'],
 'f-land-kina': t=>t['data-land']==='kina',
 'f-land-eu':   t=>t['data-land']==='eu',
 'f-land-usa':  t=>t['data-land']==='usa',
};
const paastand={};
for(const m of html.matchAll(/<input[^>]*\bid="(f-[a-z0-9-]+)"[^>]*>[^<]*<span class="n">(\d+)<\/span>/g)) paastand[m[1]]=+m[2];

console.log('\n== Filtertael: knappens paastand mod hvad reglen faktisk lader staa ==');
let fejl=0;
for(const [id,f] of Object.entries(regler)){
  const traef=tbodies.map((t,i)=>f(t)?navne[i]:null).filter(Boolean);
  const p=paastand[id];
  const ok=p===traef.length; if(!ok)fejl++;
  console.log(`  #${id.padEnd(13)} regel ${String(traef.length).padStart(2)}  knap ${String(p).padStart(2)}  ${ok?'ok  ':'UENIGE'}  [${traef.join(', ')}]`);
}
const alle=paastand['f-land-alle'];
console.log(`  #f-land-alle  regel ${tbodies.length}  knap ${alle}  ${alle===tbodies.length?'ok':'UENIGE'}`);

console.log('\n== Tomkortets tre paastande ==');
const k=(...ids)=>tbodies.filter(t=>ids.every(i=>regler[i](t))).length;
const p1=k('f-ip67','f-ce','f-pris'), p2=k('f-ip67','f-ce'), p3=k('f-ip67','f-pris');
console.log(`  IP67+CE+pris        -> ${p1}  (kortet siger: ingen)        ${p1===0?'ok':'FEJL'}`);
console.log(`  uden pris (IP67+CE) -> ${p2}  (kortet siger: 1 traeffer)   ${p2===1?'ok':'FEJL'}`);
console.log(`  uden CE (IP67+pris) -> ${p3}  (kortet siger: 0 traeffere)  ${p3===0?'ok':'FEJL'}`);
if(p1!==0)fejl++; if(p2!==1)fejl++; if(p3!==0)fejl++;

// ---- alle kombinationer der giver nul: kan brugeren havne i en tom tabel? ----
const bool=['f-ip67','f-last20','f-frost','f-ce','f-pris'];
const lande=[null,'f-land-kina','f-land-eu','f-land-usa'];
const nul=[];
for(let bits=0;bits<32;bits++){
  const valgt=bool.filter((_,i)=>bits&(1<<i));
  for(const L of lande){
    const sat=L?[...valgt,L]:valgt;
    if(!sat.length) continue;
    if(tbodies.filter(t=>sat.every(i=>regler[i](t))).length===0) nul.push(sat);
  }
}
// minimale nul-kombinationer: fjern én -> giver traeffere
const minimale=nul.filter(sat=>sat.every((_,j)=>{
  const mindre=sat.filter((_,x)=>x!==j);
  return mindre.length===0 || tbodies.filter(t=>mindre.every(i=>regler[i](t))).length>0;
}));
console.log(`\n== Nulresultater ==`);
console.log(`  ${nul.length} af 124 mulige filterkombinationer giver 0 poster.`);
console.log(`  ${minimale.length} af dem er minimale (fjerner man ét filter, kommer der noget frem):`);
minimale.forEach(sat=>console.log('    ',sat.join(' + ')));
// (skrev tidligere _minimale.json til brug for en engangs-patch; ikke laengere noedvendigt)
console.log(`\nFEJL I ALT: ${fejl}`);

}
