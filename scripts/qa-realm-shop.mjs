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
 await page.route('http://shop.test/**',async route=>{
  const url=new URL(route.request().url()),file=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
  if(!file.startsWith(root+path.sep)){await route.fulfill({status:403});return;}
  try{const ext=path.extname(file),type={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.wav':'audio/wav'}[ext]||'application/octet-stream';await route.fulfill({contentType:type,body:await fs.readFile(file)});}catch{await route.fulfill({status:404,body:'not found'});}
 });
 await page.addInitScript(()=>{
  localStorage.setItem('solar-relic-v1',JSON.stringify({level:101,unlocked:101,reduced:true,sound:false}));
  localStorage.setItem('solar-relic-growth-v2',JSON.stringify({levels:[5,5,5,5,5,5,0,0,0],stageStars:[...Array(99).fill(0),3],realm:{coins:10000,gear:{staff:0,robe:0,ring:0},scrolls:[],cleared:[],newLevels:[0,0,0]}}));
 });
 await page.goto('http://shop.test/',{waitUntil:'domcontentloaded'});
 await page.locator('#titleContinueBtn').click();
 await page.locator('#realmBriefShop').click();
 assert.equal(await page.locator('.realm-gear-card').count(),4);
 assert.equal(await page.locator('.realm-gear-slots button').count(),6);
 await page.locator('[data-gear-buy="staff:1"]').click();
 await page.locator('[data-gear-equip="staff:1"]').click();
 await page.locator('[data-gear-enhance="staff:1"]').click();
 assert.match(await page.locator('.realm-gear-card.equipped').textContent(),/\+1/);
 assert.equal(await page.locator('.realm-doll .gear-staff').isVisible(),true);
 await page.locator('[data-gear-slot="robe"]').click();
 await page.locator('[data-gear-buy="robe:2"]').click();
 await page.locator('[data-gear-equip="robe:2"]').click();
 assert.equal(await page.locator('.realm-doll .gear-robe').isVisible(),true);
 for(const slot of ['ring','amulet','boots','grimoire']){
  await page.locator(`[data-gear-slot="${slot}"]`).click();
  await page.locator(`[data-gear-buy="${slot}:1"]`).click();
  await page.locator(`[data-gear-equip="${slot}:1"]`).click();
 }
 for(const slot of ['staff','robe','ring','amulet','boots','grimoire'])assert.equal(await page.locator(`.realm-doll .gear-${slot}`).isVisible(),true);
 await page.screenshot({path:'output/realm-shop.png'});
 await page.locator('[data-shop-tab="scroll"]').click();
 assert.equal(await page.locator('.realm-scroll-card').count(),8);
 await page.locator('[data-realm-buy="scroll:storm"]').click();
 assert.match(await page.locator('.realm-scroll-card').first().textContent(),/보유/);
 await page.screenshot({path:'output/realm-scrolls.png'});
 await page.locator('#realmShopClose').click();
 await page.locator('#realmBriefStart').click();
 for(const slot of ['staff','robe','ring','amulet','boots','grimoire'])assert.equal(await page.locator(`#realmMage .gear-${slot}`).isVisible(),true);
 assert.match(await page.locator('#realmHeroHP').textContent(),/235 \/ 235/);
 assert.equal(errors.length,0,errors.join('\n'));
 await page.screenshot({path:'output/realm-equipped.png'});
 console.log('PASS: six gear slots, buy/equip/enhance, eight pictured scrolls, saved paper-doll battle layers.');
}finally{await browser.close();}
