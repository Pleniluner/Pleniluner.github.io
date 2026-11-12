import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import test from 'node:test';

const languages=['zh-CN','zh-TW','en','ja','ko','ru','fr','de','it','pt','es','ar'];
const folder='src/components/station/i18n/profile';
const json=async path=>JSON.parse(await readFile(path,'utf8'));
const en=await json(`${folder}/en.json`);

test('twelve profiles preserve the complete content, translations and reference links',async()=>{
 assert.equal(Object.keys(en).length,192);
 for(let index=190;index<=196;index++)assert.ok(!(`p${index}` in en),`removed mobile devices p${index}`);
 for(const lang of languages){
  const data=await json(`${folder}/${lang}.json`);
  assert.deepEqual(Object.keys(data).sort(),Object.keys(en).sort(),lang);
  for(const [key,value] of Object.entries(data)){
   assert.ok(typeof value==='string'&&value.trim(),`${lang}: ${key}`);
   assert.equal(value.split('**').length%2,1,`${lang}: ${key} formatting`);
   assert.deepEqual(value.match(/https:\/\/[^)\s]+/g),en[key].match(/https:\/\/[^)\s]+/g),`${lang}: ${key} links`);
   if(lang!=='en' && en[key].length>160)assert.notEqual(value,en[key],`${lang}: ${key} untranslated paragraph`);
  }
  assert.equal(data.p200,'Adveni priusquam proficiscaris.');
  const facts={p004:['BG7LBJ'],p024:['TArch','MCP'],p026:['macOS Sequoia 15','2025','G614PR'],p027:['UV-K5'],p028:['ASUS','Aura Sync'],p166:['2025','G614PR'],p167:['8940HX'],p168:['5070 Ti'],p169:['48','DDR5'],p170:['3','NVMe'],p175:['26H2','64'],p177:['macOS Sequoia 15'],p178:['WSL 2'],p179:['13.5','trixie'],p180:['WSL 2'],p182:['WSL 2'],p183:['24.04.4 LTS','Noble Numbat']};
  for(const [key,terms] of Object.entries(facts))for(const term of terms)assert.ok(data[key].includes(term),`${lang}: ${key} missing ${term}`);
 }
});

test('profile structure references every source paragraph and keeps the six plans together',async()=>{
 const structure=await json('src/components/station/content/profile-structure.json');
 const keys=[...JSON.stringify(structure).matchAll(/p\d{3}/g)].map(m=>m[0]);
 assert.deepEqual([...new Set(keys)].sort(),Object.keys(en).sort());
 const plans=structure.sections.workbench.blocks.find(block=>block.type==='list');
 assert.deepEqual(plans.items,['p023','p024','p025','p026','p027','p028']);
});
