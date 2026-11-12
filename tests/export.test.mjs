import assert from 'node:assert/strict';
import {readFile, readdir, stat} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import test from 'node:test';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const root=resolve('out'),base=process.env.PAGES_BASE_PATH??'';
const routes={'':'zh-CN','chinese':'zh-CN','zh-tw':'zh-TW',en:'en',ja:'ja',ko:'ko',ru:'ru',fr:'fr',de:'de',it:'it',pt:'pt',es:'es',ar:'ar'};
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#x27;',"'").replaceAll('&#39;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>');
async function checkResource(value,page){
 if(/^(https?:|mailto:|tel:|data:|blob:|#)/.test(value))return;
 const url=new URL(decode(value),`https://example.test${base}/${page?`${page}/`:''}`);
 assert.ok(url.pathname.startsWith(`${base}/`),`Outside deployment prefix: ${url.pathname}`);
 const path=join(root,decodeURIComponent(url.pathname.slice(base.length)));
 if((await stat(path)).isDirectory())await stat(join(path,'index.html'));
}
test('twelve languages export translated HTML, metadata, menus and valid resources',async()=>{
 for(const [route,locale] of Object.entries(routes)){
  const html=await readFile(join(root,route,'index.html'),'utf8');
  const messages=JSON.parse(await readFile(`src/components/station/i18n/messages/${locale}.json`,'utf8'));
  const profile=JSON.parse(await readFile(`src/components/station/i18n/profile/${locale}.json`,'utf8'));
  const rendered=decode(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''));
  const text=rendered.replace(/<[^>]*>/g,'');
  assert.match(html,new RegExp(`<html[^>]*lang="${locale}"`));
  assert.match(html,new RegExp(`<html[^>]*dir="${locale==='ar'?'rtl':'ltr'}"`));
  for(const key of ['s058','s061','s074','s075'])assert.ok(text.includes(messages[key]),`${locale}: ${key} must be rendered without JavaScript`);
  for(const [key,value] of Object.entries(profile)){
   if(['p198','p199'].includes(key))continue; // The footer now contains contact links without the removed heading or introduction.
   const plain=value.replaceAll('**','').replace(/\[([^\]]+)\]\(https:\/\/[^)]+\)/g,'$1');
   assert.ok(text.includes(plain),`${locale}: ${key} must be rendered without JavaScript`);
  }
  assert.match(html,/mailto:Pleniluner@outlook\.com/);
  assert.match(rendered,/<title>[^<]*Pleniluner/);
  assert.equal([...html.matchAll(/rel="alternate"/g)].length,13,route);
  assert.doesNotMatch(rendered,/清竹|Qingzhu|Qingyue|>s\d{3}</);
  for(const [,url] of html.matchAll(/(?:src|href)="([^"#]+)"/g))await checkResource(url,route);
  for(const [,srcset] of html.matchAll(/srcset="([^"]+)"/gi)){
   for(const candidate of decode(srcset).split(','))await checkResource(candidate.trim().split(/\s+/)[0],route);
  }
 }
});

test('artwork delivery preserves complete frames, alpha and exported image sources',async()=>{
 const artwork=JSON.parse(await readFile('src/components/station/content/artwork.json','utf8'));
 for(const [original,image] of Object.entries(artwork)){
  const bytes=await readFile(join(root,original));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),image.sha256,`${original}: source changed; run npm run media:prepare`);
  const source=await sharp(bytes).metadata();
  for(const variant of image.variants){
   const metadata=await sharp(join(root,variant.src)).metadata();
   assert.equal(metadata.format,'webp');
   assert.equal(metadata.width,variant.width);
   assert.ok(Math.abs(metadata.height-source.height*metadata.width/source.width)<=1,`${variant.src}: complete frame ratio`);
   if(source.hasAlpha)assert.ok(metadata.hasAlpha,`${variant.src}: transparency preserved`);
  }
  if(source.hasAlpha){
   const full=image.variants.find(variant=>variant.width===source.width);
   assert.ok(full,`${original}: original-resolution variant`);
   assert.deepEqual(await sharp(join(root,full.src)).extractChannel('alpha').raw().toBuffer(),await sharp(bytes).extractChannel('alpha').raw().toBuffer(),`${original}: full-resolution transparency mask`);
  }
 }
});
test('local fonts, audio and domain metadata are present',async()=>{
 for(const file of await readdir(root,{recursive:true})){
  if(!file.endsWith('.css'))continue;
  for(const [,value] of (await readFile(join(root,file),'utf8')).matchAll(/url\(["']?([^"')]+)["']?\)/g)){
   if(value.startsWith('data:'))continue;
   const url=new URL(value,`https://example.test${base}/${file.replaceAll('\\','/')}`);
   assert.ok(url.pathname.startsWith(`${base}/`));await stat(join(root,url.pathname.slice(base.length)));
  }
 }
 for(const name of ['name-story-01','name-story-02','anniversary-zh','anniversary-en','anniversary-ja','anniversary-ko'])assert.ok((await stat(join(root,`audio/${name}.mp3`))).size>150000);
 assert.equal((await readFile(join(root,'CNAME'),'utf8')).trim(),'pleniluner.com');
});
