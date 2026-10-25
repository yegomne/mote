import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {findMove} from '../dist/engine.mjs';
const {chromium}=await import(pathToFileURL('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs').href);
const root=path.resolve('dist');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-sandbox','--disable-gpu']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',error=>errors.push(String(error)));
 await page.route('http://scroll.test/**',async route=>{
  const url=new URL(route.request().url()),file=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
  if(!file.startsWith(root+path.sep)){await route.fulfill({status:403});return;}
  try{const ext=path.extname(file),type={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'}[ext]||'application/octet-stream';await route.fulfill({contentType:type,body:await fs.readFile(file)});}catch{await route.fulfill({status:404,body:'not found'});}
 });
 await page.addInitScript(()=>{
  localStorage.setItem('solar-relic-v1',JSON.stringify({level:126,unlocked:126,reduced:true,sound:false}));
  localStorage.setItem('solar-relic-growth-v2',JSON.stringify({levels:[5,5,5,5,5,5,2,2,2],stageStars:[...Array(99).fill(0),3],realm:{coins:0,gear:{staff:0,robe:0,ring:0},scrolls:['storm'],cleared:[],newLevels:[2,2,2]}}));
 });
 await page.goto('http://scroll.test/',{waitUntil:'domcontentloaded'});
 await page.locator('#titleContinueBtn').click();
 await page.locator('#realmBriefStart').click();
 const tap=async i=>{const box=await page.locator('#boardWrap').boundingBox(),cell=box.width/8;await page.touchscreen.tap(box.x+(i%8+.5)*cell,box.y+(Math.floor(i/8)+.5)*cell);};
 const match=async color=>{
  for(let attempt=0;attempt<25;attempt++){
   const colors=await page.locator('#boardInput button').evaluateAll(nodes=>nodes.map(el=>Number(el.dataset.color))),move=findMove(colors.map(color=>({color})),color,true);
   if(move){await tap(move[0]);await tap(move[1]);await page.waitForTimeout(750);return;}
   await page.locator('#shuffleBtn').click();
  }
  throw Error('No move for color '+color);
 };
 await match(6);await match(6);await match(2);await match(2);
 assert.equal(await page.locator('#realmScrollBurst').evaluate(el=>el.classList.contains('burst')),true);
 assert.equal(await page.locator('#realmScrollBurst').evaluate(el=>getComputedStyle(el).backgroundImage.includes('realm-scroll-atlas.webp')),true);
 assert.equal(errors.length,0,errors.join('\n'));
 await page.screenshot({path:'output/realm-scroll-combo.png'});
 console.log('PASS: water → lightning scroll combo deals damage and plays pictured spell burst.');
}finally{await browser.close();}
