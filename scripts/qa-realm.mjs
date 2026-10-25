import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {findMove} from '../dist/engine.mjs';
const playwrightPath='C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const {chromium}=await import(pathToFileURL(playwrightPath).href);
const root=path.resolve('dist');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-sandbox','--disable-gpu']});
try{
 const width=Number(process.argv[2]||390),height=Number(process.argv[3]||844);
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 await page.route('http://realm.test/**',async route=>{
  const url=new URL(route.request().url()),relative=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);
  const file=path.resolve(root,'.'+relative);
  if(!file.startsWith(root+path.sep)){await route.fulfill({status:403});return;}
  try{const body=await fs.readFile(file),ext=path.extname(file),type={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.wav':'audio/wav','.webmanifest':'application/manifest+json'}[ext]||'application/octet-stream';await route.fulfill({status:200,contentType:type,body});}catch{await route.fulfill({status:404,body:'Not found'});}
 });
 const testStage=Number(process.argv[5]||101);
 await page.addInitScript(({testStage})=>{
  const newLevels=[testStage>=106?2:0,testStage>=116?2:0,testStage>=126?2:0];
  localStorage.setItem('solar-relic-v1',JSON.stringify({level:testStage,unlocked:testStage,best:0,reduced:true,sound:false}));
  localStorage.setItem('solar-relic-growth-v2',JSON.stringify({levels:[5,5,5,5,5,5,...newLevels],stars:0,stageStars:[...Array(99).fill(0),3],realm:{coins:0,gear:{staff:0,robe:0,ring:0},scrolls:[],cleared:[],newLevels}}));
 },{testStage});
 await page.goto('http://realm.test/',{waitUntil:'domcontentloaded'});
 await page.locator('#titleContinueBtn').click();
 await page.locator('#realmBriefStart').click();
 await page.waitForTimeout(250);
 const stage=await page.locator('#realmEnemyName').textContent(),arena=await page.locator('#realmArena').boundingBox(),board=await page.locator('#boardFrame').boundingBox(),shuffle=await page.locator('#shuffleBtn').boundingBox(),totems=await page.locator('[data-totem]').count();
 assert.equal(totems,9);
 assert.ok(arena&&board,'arena and original board visible');
 assert.ok(board.y+board.height<=height,`board clipped at ${board.y+board.height} > ${height}`);
 assert.ok(shuffle.y+shuffle.height<=height,`shuffle control clipped at ${shuffle.y+shuffle.height} > ${height}`);
 if(process.argv[4]!=='0'){
  const findFire=async()=>{for(let tries=0;tries<16;tries++){const colors=await page.locator('#boardInput button').evaluateAll(list=>list.map(el=>Number(el.dataset.color))),move=findMove(colors.map(color=>({color})),1,true);if(move)return move;await page.locator('#shuffleBtn').click();}throw Error('No fire move after shuffles');};
  const tap=async i=>{const rect=await page.locator('#boardWrap').boundingBox(),cell=rect.width/8;await page.touchscreen.tap(rect.x+(i%8+.5)*cell,rect.y+(Math.floor(i/8)+.5)*cell);};
  let move=await findFire();await tap(move[0]);await tap(move[1]);await page.waitForTimeout(750);
  const hpAfterFirst=Number((await page.locator('#realmEnemyHP').textContent()).split('/')[0]);
  move=await findFire();await tap(move[0]);await tap(move[1]);await page.waitForTimeout(1200);
  const hpAfterSecond=Number((await page.locator('#realmEnemyHP').textContent()).split('/')[0]);
  assert.ok(hpAfterSecond<hpAfterFirst,`second fire match must hit enemy: ${hpAfterFirst} => ${hpAfterSecond}`);
  if(process.argv[6]==='clear'){
   for(let turn=0;turn<10&&!await page.locator('#realmNext').isVisible();turn++){
    move=await findFire();await tap(move[0]);await tap(move[1]);await page.waitForTimeout(1100);
   }
   assert.equal(await page.locator('#realmNext').isVisible(),true,'the first battle should be winnable through real board taps');
   assert.match(await page.locator('#modalContent').textContent(),/VICTORY/);
   await page.locator('#realmNext').click();
   assert.match(await page.locator('#modalContent').textContent(),/STAGE 102/);
  }
 }
 assert.equal(errors.length,0,errors.join('\n'));
 await page.screenshot({path:'output/realm-mobile.png'});
 console.log(JSON.stringify({stage,arenaBottom:Math.round(arena.y+arena.height),boardBottom:Math.round(board.y+board.height),shuffleBottom:Math.round(shuffle.y+shuffle.height),height,totems,errors}));
 await context.close();
}finally{await browser.close();}
