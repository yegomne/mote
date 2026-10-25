import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const {chromium}=await import(pathToFileURL('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs').href);
const root=path.resolve('dist');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-sandbox','--disable-gpu']});
try{
 for(const test of [
  {level:105,newLevels:[1,0,0],cleared:[105],colors:7,names:['물']},
  {level:115,newLevels:[1,1,0],cleared:[105,115],colors:8,names:['물','대지']},
  {level:125,newLevels:[1,1,1],cleared:[105,115,125],colors:9,names:['물','대지','바람']},
  {level:106,newLevels:[0,0,0],cleared:[],colors:7,names:['물']}
 ]){
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',error=>errors.push(String(error)));
  await page.route('http://gems.test/**',async route=>{
   const url=new URL(route.request().url()),file=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
   if(!file.startsWith(root+path.sep)){await route.fulfill({status:403});return;}
   try{const ext=path.extname(file),type={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'}[ext]||'application/octet-stream';await route.fulfill({contentType:type,body:await fs.readFile(file)});}catch{await route.fulfill({status:404,body:'not found'});}
  });
  await page.addInitScript(({level,newLevels,cleared})=>{
   localStorage.setItem('solar-relic-v1',JSON.stringify({level,unlocked:level,reduced:true,sound:false}));
   localStorage.setItem('solar-relic-growth-v2',JSON.stringify({levels:[5,5,5,5,5,5,...newLevels],stageStars:[...Array(99).fill(0),3],realm:{coins:0,gear:{staff:0,robe:0,ring:0},scrolls:[],cleared,newLevels}}));
  },test);
  await page.goto('http://gems.test/',{waitUntil:'domcontentloaded'});
  await page.locator('#titleContinueBtn').click();
  await page.locator('#realmBriefStart').click();
  const colors=await page.locator('#boardInput button').evaluateAll(nodes=>nodes.map(node=>Number(node.dataset.color)));
  assert.equal(new Set(colors).size,test.colors);
  for(let color=6;color<test.colors;color++)assert.ok(colors.filter(value=>value===color).length>=5,`stage ${test.level} missing new color ${color}`);
  for(const [color,shape] of [[6,'물방울'],[7,'돌'],[8,'나뭇잎']])if(color<test.colors){
   const label=await page.locator(`#boardInput button[data-color="${color}"]`).first().getAttribute('aria-label');
   assert.match(label,new RegExp(shape),`stage ${test.level} needs a clear accessible gem name`);
  }
  for(const name of test.names)assert.match(await page.locator('#goalChips').textContent(),new RegExp(name));
  assert.equal(await page.locator('#boardMessage').evaluate(el=>el.classList.contains('show')),false);
  assert.equal(await page.locator('#realmCombatNotice').evaluate(el=>el.classList.contains('show')),true);
  const [notice,boardRect]=await Promise.all([page.locator('#realmCombatNotice').boundingBox(),page.locator('#boardWrap').boundingBox()]);
  assert.ok(notice.y+notice.height<boardRect.y,`stage ${test.level} combat notice overlaps the board`);
  assert.equal(await page.locator('#timer').textContent(),'∞');
  await page.locator('#shuffleBtn').click();
  const reshuffled=await page.locator('#boardInput button').evaluateAll(nodes=>nodes.map(node=>Number(node.dataset.color)));
  for(let color=6;color<test.colors;color++)assert.ok(reshuffled.filter(value=>value===color).length>=5,`stage ${test.level} reshuffle lost color ${color}`);
  assert.equal(errors.length,0,errors.join('\n'));
  if(test.level===125){await page.waitForTimeout(1700);await page.screenshot({path:'output/realm-gems.png'});}
  await page.close();
 }
 console.log('PASS: newly unlocked gems appear at least five times, old saves recover unlocks, notices stay outside the board, no stage timer.');
}finally{await browser.close();}
