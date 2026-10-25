import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const {chromium}=await import(pathToFileURL('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs').href);
const root=path.resolve('dist');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-sandbox','--disable-gpu']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',error=>errors.push(String(error)));
 await page.route('http://map.test/**',async route=>{
  const url=new URL(route.request().url()),file=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
  if(!file.startsWith(root+path.sep)){await route.fulfill({status:403});return;}
  try{const ext=path.extname(file),type={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.wav':'audio/wav'}[ext]||'application/octet-stream';await route.fulfill({contentType:type,body:await fs.readFile(file)});}catch{await route.fulfill({status:404,body:'not found'});}
 });
 await page.addInitScript(()=>{
  localStorage.setItem('solar-relic-v1',JSON.stringify({level:102,unlocked:102,best:0,reduced:true,sound:false}));
  localStorage.setItem('solar-relic-growth-v2',JSON.stringify({levels:[5,5,5,5,5,5,0,0,0],stars:0,stageStars:[...Array(100).fill(0),1]}));
 });
 await page.goto('http://map.test/',{waitUntil:'domcontentloaded'});
 await page.locator('#titleMapBtn').click();
 assert.equal(await page.locator('.realm-route-node').count(),10);
 assert.equal(await page.locator('[data-realm-level="103"]').isDisabled(),true);
 assert.match(await page.locator('[data-realm-level="102"]').textContent(),/다음 길 2★/);
 assert.match(await page.locator('.realm-map-hero').textContent(),/낯선 숲/);
 assert.equal(errors.length,0,errors.join('\n'));
 await page.screenshot({path:'output/realm-map.png'});
 await page.locator('[data-realm-act="1"]').click();
 assert.match(await page.locator('.realm-map-hero').textContent(),/살아 있는 산맥/);
 await page.locator('[data-realm-act="0"]').click();
 await page.locator('[data-realm-level="102"]').click();
 assert.match(await page.locator('#modalContent').textContent(),/다음 상대 가시 숲늑대 해금 · 2★ 필요/);
 await page.locator('#realmBriefStart').click();
 await page.locator('#realmBattleMap').click();
 assert.equal(await page.locator('#modal').evaluate(el=>el.open),true);
 assert.match(await page.locator('.realm-map-hero').textContent(),/낯선 숲/);
 await page.locator('#realmMapClose').click();
 assert.equal(await page.locator('#modal').evaluate(el=>el.open),false);
 console.log('PASS: illustrated route map, monster-specific scenes, visible stars and locked monster gate.');
}finally{await browser.close();}
