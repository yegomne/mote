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
 await page.route('http://counter.test/**',async route=>{
  const url=new URL(route.request().url()),file=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
  if(!file.startsWith(root+path.sep)){await route.fulfill({status:403});return;}
  try{const ext=path.extname(file),type={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'}[ext]||'application/octet-stream';await route.fulfill({contentType:type,body:await fs.readFile(file)});}catch{await route.fulfill({status:404,body:'not found'});}
 });
 await page.clock.install();
 await page.addInitScript(()=>{
  localStorage.setItem('solar-relic-v1',JSON.stringify({level:101,unlocked:101,reduced:true,sound:false}));
  localStorage.setItem('solar-relic-growth-v2',JSON.stringify({levels:[5,5,5,5,5,5,0,0,0],stageStars:[...Array(99).fill(0),3],realm:{coins:0,gear:{staff:0,robe:0,ring:0},scrolls:[],cleared:[],newLevels:[0,0,0]}}));
 });
 await page.goto('http://counter.test/',{waitUntil:'domcontentloaded'});
 await page.locator('#titleContinueBtn').click();
 await page.locator('#realmBriefStart').click();
 const heroHP=async()=>Number((await page.locator('#realmHeroHP').textContent()).split(' / ')[0]);
 const startHP=await heroHP();
 assert.equal(await page.locator('#timer').textContent(),'∞');
 await page.clock.runFor(12500);
 assert.equal(await heroHP(),startHP,'no attack before the timed interval');
 await page.clock.runFor(2100);
 assert.ok(await heroHP()<startHP,'monster attacks while the player is idle');
 const hitHP=await heroHP();
 await page.locator('#pauseBtn').click();
 await page.clock.runFor(30000);
 assert.equal(await heroHP(),hitHP,'paused battle stops the counterattack clock');
 assert.equal(errors.length,0,errors.join('\n'));
 await page.close();
 console.log('PASS: no battle deadline; idle monster counterattack uses active time and freezes on pause.');
}finally{await browser.close();}
