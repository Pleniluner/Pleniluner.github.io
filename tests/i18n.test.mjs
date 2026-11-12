import {readFile, readdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import test from 'node:test';
const folder='src/components/station/i18n/messages';
const languages=['zh-CN','zh-TW','en','ja','ko','ru','fr','de','it','pt','es','ar'];
test('all twelve dictionaries contain the complete text and no old identity',async()=>{
 const original=JSON.parse(await readFile(`${folder}/zh-CN.json`,'utf8'));
 assert.equal(Object.keys(original).length,141);
 for(const lang of languages){
  const raw=await readFile(`${folder}/${lang}.json`,'utf8');
  const messages=JSON.parse(raw);
  assert.deepEqual(Object.keys(messages).sort(),Object.keys(original).sort(),lang);
  assert.ok(Object.values(messages).every(value=>typeof value==='string'&&value.trim().length>0),lang);
  assert.doesNotMatch(raw,/清竹|Qingzhu|Qingyue|TODO|PLACEHOLDER/);
  if(!lang.startsWith('zh')){
   for(const key of ['s002','s010','s019','s023','s041','s044','s070','s072','s091','s092'])assert.notEqual(messages[key],original[key],`${lang}: ${key}`);
  }
 }
});
test('all translated message references exist',async()=>{
 const messages=JSON.parse(await readFile(`${folder}/zh-CN.json`,'utf8'));
 for(const file of await readdir('src/components/station')){
  if(!file.endsWith('.tsx'))continue;
  const source=await readFile(`src/components/station/${file}`,'utf8');
  for(const [,key] of source.matchAll(/"(s\d{3})"/g))assert.ok(key in messages,`${file}: ${key}`);
 }
});
