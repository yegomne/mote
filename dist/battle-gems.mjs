// Keeps the original temple's faceted canvas gems in the otherworld battle board.
const PALETTE=[
 ['#b7ffce','#18d99f','#087564','#043b3b'],['#ffb0ad','#fb526a','#ac184f','#580d36'],
 ['#bef8ff','#44bdf7','#1367b5','#113367'],['#fff0ba','#f3cb4e','#ae6b0d','#60400b'],
 ['#edcaff','#b36cfa','#7333b1','#3f1b6a'],['#ffddb8','#fc9953','#c04b19','#682612'],
 ['#c5fbff','#39c6dc','#087fa5','#073f6b'],['#f4e1b2','#b99760','#79613f','#393825'],
 ['#e8fff1','#95e5c7','#43a993','#1a6c70']
];
const SHAPES=[
 [[0,-.44],[.31,-.25],[.36,.23],[0,.43],[-.36,.23],[-.31,-.25]],
 [[0,-.46],[.39,0],[0,.46],[-.39,0]],
 [[-.27,-.36],[.27,-.36],[.4,-.13],[.36,.28],[0,.43],[-.36,.28],[-.4,-.13]],
 [[-.29,-.34],[.29,-.34],[.43,0],[0,.43],[-.43,0]],
 [[0,-.45],[.39,-.17],[.25,.35],[-.25,.35],[-.39,-.17]],
 [[-.24,-.39],[.24,-.39],[.4,-.13],[.35,.28],[.17,.4],[-.17,.4],[-.35,.28],[-.4,-.13]],
 [[-.31,-.31],[.31,-.31],[.42,.12],[0,.45],[-.42,.12]],
 [[0,-.46],[.35,-.31],[.43,.2],[0,.46],[-.43,.2],[-.35,-.31]],
 [[-.32,-.38],[.32,-.38],[.44,0],[.27,.38],[-.27,.38],[-.44,0]]
];
function polygon(ctx,points){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();}
function drawGem(ctx,g,x,y,cell,now,index){const color=g.color,p=PALETTE[color],points=SHAPES[color];ctx.save();ctx.translate(x,y);ctx.scale(cell,cell);ctx.fillStyle='#0008';ctx.translate(0,.04);polygon(ctx,points);ctx.fill();ctx.translate(0,-.04);
 const fill=ctx.createLinearGradient(-.3,-.4,.2,.4);fill.addColorStop(0,p[0]);fill.addColorStop(.23,p[1]);fill.addColorStop(.75,p[2]);fill.addColorStop(1,p[3]);ctx.fillStyle=fill;polygon(ctx,points);ctx.fill();
 const inner=points.map(([a,b])=>[a*.62,b*.62]);for(let j=0;j<points.length;j++){const k=(j+1)%points.length;ctx.beginPath();ctx.moveTo(...points[j]);ctx.lineTo(...points[k]);ctx.lineTo(...inner[k]);ctx.lineTo(...inner[j]);ctx.closePath();ctx.fillStyle=j<2?'#ffffff58':j<4?'#0000002e':'#ffffff18';ctx.fill();ctx.beginPath();ctx.moveTo(...inner[j]);ctx.lineTo(...inner[k]);ctx.lineTo(-.055,-.075);ctx.closePath();ctx.fillStyle=j%3===0?'#ffffff20':j%3===1?'#00000018':'#ffffff07';ctx.fill();}
 polygon(ctx,points);ctx.strokeStyle=p[0]+'a8';ctx.lineWidth=.014;ctx.stroke();polygon(ctx,inner);ctx.strokeStyle='#ffffff25';ctx.lineWidth=.01;ctx.stroke();ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]+.015);ctx.lineTo(points[1][0],points[1][1]+.015);ctx.strokeStyle='#ffffffcc';ctx.lineWidth=.018;ctx.stroke();
 ctx.globalAlpha=.52;ctx.strokeStyle='#eafff5';ctx.lineWidth=.016;ctx.beginPath();if(color===0){ctx.moveTo(0,-.13);ctx.lineTo(.11,0);ctx.lineTo(0,.13);ctx.lineTo(-.11,0);ctx.closePath();}else if(color===1){ctx.moveTo(-.08,.08);ctx.lineTo(0,-.12);ctx.lineTo(.08,.08);ctx.lineTo(-.08,.08);}else if(color===2){ctx.arc(0,0,.1,0,Math.PI*2);ctx.moveTo(0,-.16);ctx.lineTo(0,.16);ctx.moveTo(-.16,0);ctx.lineTo(.16,0);}else if(color===3){ctx.arc(0,0,.08,0,Math.PI*2);for(let a=0;a<8;a++){ctx.moveTo(Math.cos(a*Math.PI/4)*.12,Math.sin(a*Math.PI/4)*.12);ctx.lineTo(Math.cos(a*Math.PI/4)*.17,Math.sin(a*Math.PI/4)*.17);}}else if(color===4){ctx.moveTo(-.07,-.12);ctx.quadraticCurveTo(.13,0,-.07,.12);ctx.quadraticCurveTo(.03,0,-.07,-.12);}else if(color===5){ctx.moveTo(-.13,.06);ctx.lineTo(0,-.14);ctx.lineTo(.13,.06);ctx.moveTo(-.09,.01);ctx.lineTo(0,.15);ctx.lineTo(.09,.01);}else if(color===6){ctx.moveTo(-.13,0);ctx.quadraticCurveTo(0,.12,.13,0);ctx.quadraticCurveTo(0,-.12,-.13,0);}else if(color===7){ctx.moveTo(-.15,.1);ctx.lineTo(0,-.15);ctx.lineTo(.15,.1);ctx.moveTo(-.1,.1);ctx.lineTo(.1,.1);}else{ctx.moveTo(-.15,.1);ctx.quadraticCurveTo(.14,-.16,.12,.06);ctx.moveTo(-.1,-.08);ctx.quadraticCurveTo(.14,-.08,.08,.15);}ctx.stroke();ctx.globalAlpha=1;
 ctx.fillStyle=`rgba(255,255,255,${.28+.26*Math.sin(now/900+index*1.7)})`;ctx.beginPath();ctx.ellipse(-.15,-.23,.065,.018,-.7,0,Math.PI*2);ctx.fill();
 if(g.special){const pulse=.5+.5*Math.sin(now/170+index);ctx.beginPath();ctx.arc(0,0,.36+.03*pulse,0,Math.PI*2);ctx.strokeStyle=g.special==='bomb'?'#ffad75':g.special==='nova'?'#f3c7ff':'#b4f4ff';ctx.lineWidth=.035+.015*pulse;ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=.2;ctx.stroke();ctx.shadowBlur=0;ctx.strokeStyle='#fff9d2';ctx.lineWidth=.035;ctx.beginPath();if(g.special==='row'||g.special==='cross'){ctx.moveTo(-.27,0);ctx.lineTo(.27,0);}if(g.special==='col'||g.special==='cross'){ctx.moveTo(0,-.27);ctx.lineTo(0,.27);}if(g.special==='bomb'){ctx.arc(0,0,.14,0,Math.PI*2);ctx.moveTo(-.1,-.1);ctx.lineTo(.1,.1);}if(g.special==='nova'){for(let k=0;k<10;k++){const a=k*Math.PI/5-Math.PI/2,r=k%2?.09:.23;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();}ctx.stroke();}
 ctx.restore();}
export function drawBattleBoard(canvas,board,size,selected,now){if(!canvas||!board)return;const width=canvas.clientWidth,dpr=Math.min(devicePixelRatio||1,2),pixels=Math.round(width*dpr);if(!width)return;if(canvas.width!==pixels||canvas.height!==pixels){canvas.width=pixels;canvas.height=pixels;}const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);const cell=width/size;ctx.clearRect(0,0,width,width);const bg=ctx.createLinearGradient(0,0,width,width);bg.addColorStop(0,'#0c292e');bg.addColorStop(1,'#05191f');ctx.fillStyle=bg;ctx.fillRect(0,0,width,width);
 for(let i=0;i<size*size;i++){const x=i%size*cell,y=Math.floor(i/size)*cell;ctx.fillStyle=(Math.floor(i/size)+i%size)%2?'#183c3e44':'#03161c60';ctx.fillRect(x+1,y+1,cell-2,cell-2);ctx.strokeStyle='#a2bfa519';ctx.lineWidth=.7;ctx.strokeRect(x+.5,y+.5,cell-1,cell-1);const g=board[i];if(g)drawGem(ctx,g,x+cell/2,y+cell/2,cell,now,i);if(i===selected){ctx.strokeStyle='#ffdf91';ctx.lineWidth=2.5;ctx.strokeRect(x+3,y+3,cell-6,cell-6);}}
}
