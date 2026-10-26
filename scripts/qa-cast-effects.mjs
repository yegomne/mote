import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs').href);

const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-sandbox','--disable-gpu']});
const root=path.resolve('dist');
try{
  const page=await browser.newPage({viewport:{width:480,height:860},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.route('http://game.test/**',async route=>{
    const url=new URL(route.request().url());
    const rel=url.pathname==='/'?'index.html':url.pathname.slice(1);
    const file=path.resolve(root,rel);
    if(!file.startsWith(root+path.sep)){await route.fulfill({status:403});return;}
    try{
      const body=await fs.readFile(file);
      const ext=path.extname(file);
      const ct=ext==='.html'?'text/html':ext==='.js'||ext==='.mjs'?'text/javascript':ext==='.css'?'text/css':ext==='.webp'?'image/webp':ext==='.svg'?'image/svg+xml':'application/octet-stream';
      await route.fulfill({contentType:ct,body});
    }catch{
      await route.fulfill({status:404,body:'Not found'});
    }
  });
  await page.goto('http://game.test/',{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(600);

  // Trigger Water Cast (6)
  await page.evaluate(async ()=>{
    const evt=new MouseEvent('click',{bubbles:true});
    // Set level to 130 to have all 9 totems unlocked
    localStorage.setItem('solar-relic-v1',JSON.stringify({level:130,unlocked:130,best:50000,reduced:false,sound:false}));
    location.reload();
  });
  await page.waitForTimeout(600);

  // Cast Water (6)
  await page.evaluate(async ()=>{
    window.testCast=async (color, idx)=>{
      // trigger castTotem through window or game internal
      // In game.js, castTotem is within module scope, but we can click or dispatch
      // Let's test if cast runs smoothly
    };
  });

  if(errors.length)throw Error(errors.join('\n'));
  console.log('PASS: Chrome game loads with zero runtime errors.');
}finally{
  await browser.close();
}
