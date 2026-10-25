import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs').href);

const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-sandbox','--disable-gpu']});
const root=path.resolve('dist');
try{
 const page=await browser.newPage({viewport:{width:1110,height:420},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',error=>errors.push(String(error)));
 await page.route('http://fx.test/**',async route=>{
  const url=new URL(route.request().url());
  if(url.pathname==='/'){await route.fulfill({contentType:'text/html',body:`<meta charset="utf-8"><style>body{margin:0;background:#08191e;color:#dceee9;font:18px sans-serif;display:flex;gap:10px;padding:10px}section{text-align:center}canvas{display:block;width:350px;height:350px;border:1px solid #bca364}</style><section>물<canvas width="350" height="350"></canvas></section><section>대지<canvas width="350" height="350"></canvas></section><section>바람<canvas width="350" height="350"></canvas></section><script type="module">import {ImpactFX} from '/element-fx.mjs';const kinds=['water','earth','wind'],colors=['#61dded','#c7a574','#a5eacb'];for(const [i,canvas] of [...document.querySelectorAll('canvas')].entries()){const ctx=canvas.getContext('2d'),fx=new ImpactFX(ctx,()=>43.75,()=>false);fx.field(4,4,colors[i],1.5,kinds[i]);for(let frame=0;frame<22;frame++){ctx.fillStyle='#071d24';ctx.fillRect(0,0,350,350);ctx.strokeStyle='#335459';for(let line=1;line<8;line++){ctx.beginPath();ctx.moveTo(line*43.75,0);ctx.lineTo(line*43.75,350);ctx.moveTo(0,line*43.75);ctx.lineTo(350,line*43.75);ctx.stroke();}fx.draw(frame*16,.016);}}window.ready=true;</script>`});return;}
  const file=path.resolve(root,'.'+url.pathname);if(!file.startsWith(root+path.sep)){await route.fulfill({status:403});return;}
  try{await route.fulfill({contentType:'text/javascript',body:await fs.readFile(file)});}catch{await route.fulfill({status:404,body:'Not found'});}
 });
 await page.goto('http://fx.test/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.ready===true);
 if(errors.length)throw Error(errors.join('\n'));
 await page.screenshot({path:'output/new-totem-fx.png'});
 console.log('PASS: water, earth, and wind effects rendered in Chrome.');
}finally{await browser.close();}
