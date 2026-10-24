import {ImpactFX as ParticleFX} from './impact-fx.mjs';
const TAU=Math.PI*2;
export const POWER_THEMES=['harvest','fire','thunder','sun','moon','time'];

// Deterministic constants for Motion Graphics to guarantee zero runtime allocation & cool mobile thermals
const CRACK_ANGLES=[0.24, 1.48, 2.76, 4.08, 5.38];
const SHARDS=[
  [-0.32, 2.9, 0.44], [0.32, 3.2, 0.48],
  [-0.65, 2.3, 0.38], [0.62, 2.5, 0.40],
  [-0.14, 3.7, 0.58], [0.14, 3.9, 0.62],
  [-0.48, 2.0, 0.34], [0.46, 2.1, 0.36]
];

export class ImpactFX extends ParticleFX {
  constructor(...args){
    super(...args);
    const hit=this.hit;
    this.elementHit=hit;
    this.hit=strength=>hit?.(strength,'fire');
    this.fireLances=[];
    this.fireImpacts=[];
  }

  reset(){
    super.reset();
    this.elements=[];
    this.streams=[];
    this.gifts=[];
    this.sparks=[];
    this.fireLances=[];
    this.fireImpacts=[];
  }

  addFireImpact(x,y,strength=1){
    if(this.reduced())return;
    this.fireImpacts.push({
      x, y,
      strength: strength*1.15,
      age: 0,
      duration: 0.50,
      seed: Math.random()*TAU
    });
  }

  blast(x,y,color,strength=1){
    if(this.reduced())return;
    this.addFireImpact(x,y,strength);
    this.elementHit?.(strength,'fire');
  }

  meteor(from,to,color,strength=1,delay=0,kind='fire'){
    if(this.reduced())return;
    if(kind==='gift'){
      this.gifts.push({from,to,color,strength,age:-delay,duration:.62});
    } else {
      // High-End Motion Graphics: Hypersonic Orbital Kinetic Strike
      const tx=(to%8)+.5;
      const ty=Math.floor(to/8)+.5;
      const sx=tx-1.8;
      const sy=ty-4.5;
      this.fireLances.push({
        sx, sy, tx, ty,
        strength: strength*1.2,
        color: color||'#ff4500',
        age: -delay,
        duration: 0.22,
        done: false
      });
    }
  }

  lightning(a,b,color='#a5e9ff',strength=1){
    if(this.reduced())return;
    const points=[];
    for(let n=0;n<=20;n++){
      const t=n/20;
      points.push([
        a%8+.5+(b%8-a%8)*t+(n&&n<20?(Math.random()-.5)*.48:0),
        Math.floor(a/8)+.5+(Math.floor(b/8)-Math.floor(a/8))*t+(n&&n<20?(Math.random()-.5)*.48:0)
      ]);
    }
    this.bolts.push({points,color,strength,age:0,duration:.85,life:.95});
    for(let i=0;i<12&&this.sparks.length<220;i++){
      const angle=Math.random()*TAU,v=2+Math.random()*4;
      this.sparks.push({x:b%8+.5,y:Math.floor(b/8)+.5,vx:Math.cos(angle)*v,vy:Math.sin(angle)*v,age:0,duration:.35+Math.random()*.4,color:'#c8f4ff'});
    }
    this.elementHit?.(strength,'thunder');
  }

  storm(index,strength=1){
    if(this.reduced())return;
    this.elements.push({kind:'storm',x:4,y:0,strength,age:0,duration:1.5});
    this.lightning(index%8,index,'#c7f1ff',strength*1.2);
  }

  shockRange(index,radius,color){
    if(!this.reduced())this.elements.push({kind:'shock',x:index%8+.5,y:Math.floor(index/8)+.5,radius,color,strength:1,age:0,duration:.8});
  }

  siphon(from,to,color='#76e5a8',strength=1){
    if(!this.reduced())this.streams.push({from,to,color,strength,age:0,duration:.85});
  }

  field(x,y,color,strength=1,kind='solar'){
    if(this.reduced())return;
    this.elements.push({x,y,color,strength,kind,age:0,duration:kind==='clock'?1.75:1.45});
    if(kind==='solar')this.elementHit?.(strength,'sun');
  }

  draw(now,dt){
    if(this.reduced()){this.reset();return;}
    const ctx=this.ctx,u=this.unit();

    for(const f of this.elements.filter(f=>f.kind==='storm')){
      ctx.save();
      ctx.globalAlpha=Math.max(0,1-f.age/f.duration)*.6;
      ctx.fillStyle='#0a1b36';
      for(let n=0;n<7;n++){
        ctx.beginPath();
        ctx.ellipse((n*1.4-.2)*u,.15*u,1.4*u,.65*u,0,0,TAU);
        ctx.fill();
      }
      ctx.restore();
    }

    super.draw(now,dt);
    ctx.save();

    // =========================================================================
    // 🚀 CINEMATIC MOTION GRAPHICS: HYPERSONIC ORBITAL KINETIC LANCE
    // Zero shadowBlur, pure hardware-accelerated vector streak lines
    // =========================================================================
    for(const l of this.fireLances){
      l.age+=dt;
      if(l.age<0)continue;
      const rawT=Math.min(1,l.age/l.duration);
      const t=rawT*rawT; // Kinetic terminal acceleration
      const curX=l.sx+(l.tx-l.sx)*t;
      const curY=l.sy+(l.ty-l.sy)*t;
      const tailLen=(0.35+rawT*1.8)*l.strength;
      const dx=l.tx-l.sx, dy=l.ty-l.sy;
      const dist=Math.hypot(dx,dy)||1;
      const nx=dx/dist, ny=dy/dist;
      const tailX=curX-nx*tailLen;
      const tailY=curY-ny*tailLen;

      ctx.save();
      ctx.globalCompositeOperation='lighter';

      // 1. Plasma trail ribbon (additive stroke)
      ctx.lineWidth=5.0*l.strength;
      ctx.strokeStyle='#ff3700';
      ctx.globalAlpha=0.55;
      ctx.beginPath();
      ctx.moveTo(tailX*u,tailY*u);
      ctx.lineTo(curX*u,curY*u);
      ctx.stroke();

      // 2. Incandescent white-hot core streak
      ctx.lineWidth=2.0*l.strength;
      ctx.strokeStyle='#fff8db';
      ctx.globalAlpha=0.95;
      ctx.beginPath();
      ctx.moveTo((tailX+(curX-tailX)*0.45)*u,(tailY+(curY-tailY)*0.45)*u);
      ctx.lineTo(curX*u,curY*u);
      ctx.stroke();

      // 3. Supersonic flanking speed lines
      const px=-ny*0.11*u, py=nx*0.11*u;
      ctx.lineWidth=1.0;
      ctx.strokeStyle='#ffaa00';
      ctx.globalAlpha=0.45*(1-rawT*0.3);
      ctx.beginPath();
      ctx.moveTo((tailX+(curX-tailX)*0.25)*u+px,(tailY+(curY-tailY)*0.25)*u+py);
      ctx.lineTo(curX*u+px,curY*u+py);
      ctx.moveTo((tailX+(curX-tailX)*0.25)*u-px,(tailY+(curY-tailY)*0.25)*u-py);
      ctx.lineTo(curX*u-px,curY*u-py);
      ctx.stroke();

      // 4. Spearhead kinetic tip
      ctx.fillStyle='#ffffff';
      ctx.globalAlpha=1.0;
      ctx.beginPath();
      ctx.arc(curX*u,curY*u,2.4*l.strength,0,TAU);
      ctx.fill();

      ctx.restore();

      if(rawT>=1){
        this.addFireImpact(l.tx,l.ty,l.strength);
        this.elementHit?.(l.strength,'fire');
        l.done=true;
      }
    }
    this.fireLances=this.fireLances.filter(l=>!l.done);

    // =========================================================================
    // 🔥 HIGH-END MOTION GRAPHICS FIRE IMPACT (Zero Thermal Buildup, 60fps)
    // 4 Layers: Anamorphic Flare -> Kinetic Dual Shockwave -> Tectonic Cracks -> Plasma Needles
    // =========================================================================
    for(const imp of this.fireImpacts){
      imp.age+=dt;
      const t=imp.age/imp.duration;
      if(t>=1)continue;

      ctx.save();
      ctx.translate(imp.x*u,imp.y*u);
      ctx.globalCompositeOperation='lighter';

      const s=imp.strength;

      // --- LAYER 1: Anamorphic Lens Flare Diamond & Core Flash (t <= 0.22) ---
      if(t<0.22){
        const ft=t/0.22;
        const flashAlpha=1-ft;
        const beamW=(0.8+Math.sin(ft*Math.PI)*2.8)*s*u;
        const beamH=Math.max(1,(1-ft)*3.2*s);
        // Horizontal laser beam
        ctx.fillStyle='#ffffff';
        ctx.globalAlpha=flashAlpha;
        ctx.fillRect(-beamW,-beamH/2,beamW*2,beamH);
        // Corona
        ctx.fillStyle='#ff5900';
        ctx.globalAlpha=flashAlpha*0.5;
        ctx.fillRect(-beamW*1.2,-beamH*1.2,beamW*2.4,beamH*2.4);
        // Central aperture
        const coreR=(0.42*(1-ft))*s*u;
        ctx.fillStyle='#ffffff';
        ctx.globalAlpha=flashAlpha*0.9;
        ctx.beginPath();
        ctx.arc(0,0,coreR,0,TAU);
        ctx.fill();
      }

      // --- LAYER 2: Dual Motion Graphic Kinetic Shockwaves ---
      // Inner Mach Shockwave (Cubic expansion)
      const eMach=1-Math.pow(1-Math.min(1,t/0.45),3);
      const machR=(0.2+eMach*2.3)*s*u;
      const machFade=Math.max(0,1-t/0.45);
      if(machFade>0){
        ctx.lineWidth=Math.max(1,(1-eMach)*3.5*s);
        ctx.strokeStyle=t<0.14?'#ffffff':t<0.28?'#ffbf33':'#e52b00';
        ctx.globalAlpha=machFade*0.9;
        ctx.beginPath();
        ctx.arc(0,0,machR,0,TAU);
        ctx.stroke();
      }

      // Outer Segmented Kinetic Compression Ring (Tactical motion graphic arc dashes)
      const eComp=1-Math.pow(1-Math.min(1,t/0.50),2);
      const compR=(0.32+eComp*3.0)*s*u;
      const compFade=Math.max(0,1-t/0.50);
      if(compFade>0){
        ctx.lineWidth=1.8*s;
        ctx.strokeStyle='#ff4400';
        ctx.globalAlpha=compFade*0.75;
        const segments=6;
        const segAngle=TAU/segments;
        const arcLen=segAngle*0.62;
        ctx.beginPath();
        for(let k=0;k<segments;k++){
          const a0=k*segAngle+imp.seed+t*0.35;
          ctx.arc(0,0,compR,a0,a0+arcLen);
          ctx.moveTo(Math.cos(a0+segAngle)*compR,Math.sin(a0+segAngle)*compR);
        }
        ctx.stroke();
      }

      // --- LAYER 3: Tectonic Ground Fissure Fracture Lines (Geometric molten fault cracks) ---
      const fissFade=Math.max(0,1-t/0.46);
      if(fissFade>0){
        const crackLen=(0.35+(1-Math.pow(1-Math.min(1,t/0.18),2))*1.0)*s*u;
        for(let i=0;i<CRACK_ANGLES.length;i++){
          const ang=CRACK_ANGLES[i]+imp.seed;
          const midDist=crackLen*0.55;
          const zigAng=ang+((i%2===0)?0.34:-0.34);
          const x1=Math.cos(ang)*midDist;
          const y1=Math.sin(ang)*midDist;
          const x2=x1+Math.cos(zigAng)*(crackLen*0.5);
          const y2=y1+Math.sin(zigAng)*(crackLen*0.5);

          // Glowing under-vein
          ctx.lineWidth=2.6*s*fissFade;
          ctx.strokeStyle='#ff2a00';
          ctx.globalAlpha=fissFade*0.72;
          ctx.beginPath();
          ctx.moveTo(0,0);
          ctx.lineTo(x1,y1);
          ctx.lineTo(x2,y2);
          ctx.stroke();

          // Molten core
          ctx.lineWidth=1.0;
          ctx.strokeStyle='#fff6bf';
          ctx.globalAlpha=fissFade*0.95;
          ctx.beginPath();
          ctx.moveTo(0,0);
          ctx.lineTo(x1,y1);
          ctx.lineTo(x2,y2);
          ctx.stroke();
        }
      }

      // --- LAYER 4: Upward Kinetic Plasma Shards (Rebound needles shooting skyward) ---
      const needleFade=Math.max(0,1-t/0.44);
      if(needleFade>0&&t>0.03){
        const needleT=(t-0.03)/0.41;
        for(let i=0;i<SHARDS.length;i++){
          const [sx,spd,lLen]=SHARDS[i];
          const px=sx*s*u*(0.8+needleT*0.3);
          const py=-needleT*spd*s*u;
          const h=lLen*s*u*(1-needleT*0.38);

          ctx.lineWidth=(i%2===0?2.0:1.3)*s;
          ctx.strokeStyle=i%3===0?'#ffffff':(i%2===0?'#ffe066':'#ff5500');
          ctx.globalAlpha=needleFade*0.85;
          ctx.beginPath();
          ctx.moveTo(px,py);
          ctx.lineTo(px,py-h);
          ctx.stroke();
        }
      }

      ctx.restore();
    }
    this.fireImpacts=this.fireImpacts.filter(imp=>imp.age<imp.duration).slice(-12);

    // Sparks (Thunder)
    for(const p of this.sparks){
      p.age+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
      ctx.save();
      ctx.globalCompositeOperation='lighter';
      ctx.globalAlpha=Math.max(0,1-p.age/p.duration);
      ctx.strokeStyle=p.color;
      ctx.lineWidth=1.5;
      ctx.beginPath();
      ctx.moveTo(p.x*u,p.y*u);
      ctx.lineTo((p.x-p.vx*.045)*u,(p.y-p.vy*.045)*u);
      ctx.lineTo((p.x-p.vx*.09+.04)*u,(p.y-p.vy*.09)*u);
      ctx.stroke();
      ctx.restore();
    }
    this.sparks=this.sparks.filter(p=>p.age<p.duration);

    // Harvesting: curved vines with emerald crystals flowing to collector
    for(const s of this.streams){
      s.age+=dt;
      const t=Math.min(1,s.age/s.duration),ax=s.from%8+.5,ay=Math.floor(s.from/8)+.5,bx=s.to%8+.5,by=Math.floor(s.to/8)+.5,cx=(ax+bx)/2+Math.sin(ax)*1.2,cy=(ay+by)/2-1;
      ctx.save();
      ctx.globalCompositeOperation='lighter';
      ctx.globalAlpha=Math.sin(t*Math.PI);
      ctx.strokeStyle='#49cf81';
      ctx.lineWidth=.05*u;
      ctx.beginPath();
      ctx.moveTo(ax*u,ay*u);
      ctx.quadraticCurveTo(cx*u,cy*u,bx*u,by*u);
      ctx.stroke();
      for(let n=0;n<4;n++){
        const v=Math.max(0,t-n*.1),x=((1-v)**2*ax+2*(1-v)*v*cx+v*v*bx)*u,y=((1-v)**2*ay+2*(1-v)*v*cy+v*v*by)*u;
        ctx.fillStyle=n?'#67eaa6':'#dbffe3';
        ctx.beginPath();
        ctx.moveTo(x,y-.14*u);
        ctx.lineTo(x+.08*u,y);
        ctx.lineTo(x,y+.14*u);
        ctx.lineTo(x-.08*u,y);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }
    this.streams=this.streams.filter(s=>s.age<s.duration).slice(-24);

    // Lunar gifts
    for(const g of this.gifts){
      g.age+=dt;
      if(g.age<0)continue;
      const t=Math.min(1,g.age/g.duration),x=(g.from%8+.5+(g.to%8-g.from%8)*t)*u,y=(Math.floor(g.from/8)+.5+(Math.floor(g.to/8)-Math.floor(g.from/8))*t-Math.sin(t*Math.PI)*.8)*u;
      ctx.save();
      ctx.globalCompositeOperation='lighter';
      ctx.strokeStyle='#eddcff';
      ctx.fillStyle='#c29aff';
      ctx.lineWidth=2;
      ctx.beginPath();
      ctx.moveTo(x-.18*u,y);
      ctx.lineTo(x+.18*u,y);
      ctx.moveTo(x,y-.18*u);
      ctx.lineTo(x,y+.18*u);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x,y,.055*u,0,TAU);
      ctx.fill();
      if(t>.8){
        ctx.globalAlpha=(1-t)*5;
        ctx.beginPath();
        ctx.arc(x,y,(t-.8)*3*u,0,TAU);
        ctx.stroke();
      }
      ctx.restore();
    }
    this.gifts=this.gifts.filter(g=>g.age<g.duration).slice(-20);

    for(const f of this.elements){
      f.age+=dt;
      if(f.kind==='storm')continue;
      const t=f.age/f.duration,fade=Math.max(0,1-t),r=u*f.strength;
      ctx.save();
      ctx.translate(f.x*u,f.y*u);
      ctx.globalAlpha=fade;

      if(f.kind==='shock'){
        ctx.globalCompositeOperation='lighter';
        ctx.strokeStyle=f.color;
        ctx.lineWidth=u*.035;
        ctx.beginPath();
        ctx.arc(0,0,f.radius*u*(.8+.2*Math.min(1,t*4)),0,TAU);
        ctx.stroke();
      }
      if(f.kind==='jade'){
        ctx.globalCompositeOperation='lighter';
        for(let n=0;n<10;n++){
          ctx.save();
          ctx.rotate(n*TAU/10+t*.7);
          ctx.translate((.25+t*2.3)*r,0);
          ctx.fillStyle=n%2?'#8cffa5aa':'#36bd7799';
          ctx.beginPath();
          ctx.moveTo(0,-.35*r);
          ctx.quadraticCurveTo(.45*r,0,0,.35*r);
          ctx.quadraticCurveTo(-.08*r,0,0,-.35*r);
          ctx.fill();
          ctx.restore();
        }
      }
      if(f.kind==='solar'){
        ctx.globalCompositeOperation='lighter';
        const rad=(.3+Math.sqrt(t)*3)*r;
        ctx.rotate(t*.3);
        for(let n=0;n<16;n++){
          const a=n*TAU/16;
          ctx.fillStyle=n%2?'#ffbf4b70':'#fff1bb90';
          ctx.beginPath();
          ctx.moveTo(Math.cos(a-.08)*rad*.3,Math.sin(a-.08)*rad*.3);
          ctx.lineTo(Math.cos(a)*rad,Math.sin(a)*rad);
          ctx.lineTo(Math.cos(a+.08)*rad*.3,Math.sin(a+.08)*rad*.3);
          ctx.closePath();
          ctx.fill();
        }
        const g=ctx.createRadialGradient(0,0,0,0,0,rad*.58);
        g.addColorStop(0,'#fffef0');
        g.addColorStop(.3,'#ffe6a9');
        g.addColorStop(.6,'#f6bb4b9c');
        g.addColorStop(1,'#df9d3200');
        ctx.fillStyle=g;
        ctx.beginPath();
        ctx.arc(0,0,rad*.58,0,TAU);
        ctx.fill();
        ctx.strokeStyle='#ffe1a2';
        ctx.lineWidth=.03*u;
        ctx.beginPath();
        ctx.arc(0,0,rad*.64,0,TAU);
        ctx.stroke();
      }
      if(f.kind==='lunar'){
        ctx.globalCompositeOperation='lighter';
        const rad=(.7+t*.5)*r;
        ctx.rotate(-t*.8);
        ctx.fillStyle='#e9d5ff';
        ctx.beginPath();
        ctx.moveTo(0,-rad);
        ctx.bezierCurveTo(rad*1.15,-rad*.7,rad*1.15,rad*.7,0,rad);
        ctx.bezierCurveTo(rad*.45,rad*.5,rad*.45,-rad*.5,0,-rad);
        ctx.fill();
        ctx.strokeStyle='#b488ff95';
        ctx.lineWidth=.03*u;
        for(let arm=0;arm<3;arm++){
          ctx.beginPath();
          for(let n=0;n<42;n++){
            const a=n*.13+arm*TAU/3-t*2,d=(.1+n*.055)*r;
            n?ctx.lineTo(Math.cos(a)*d,Math.sin(a)*d):ctx.moveTo(Math.cos(a)*d,Math.sin(a)*d);
          }
          ctx.stroke();
        }
        for(let n=0;n<14;n++){
          const a=n*2.4-t,rad=(.7+n%5*.4)*r;
          ctx.fillStyle='#f4e4ff';
          ctx.fillRect(Math.cos(a)*rad,Math.sin(a)*rad,2,2);
        }
      }
      if(f.kind==='clock'){
        const rad=(1.7+Math.sin(t*Math.PI)*.2)*r;
        ctx.strokeStyle='#b1eff5';
        ctx.lineWidth=.03*u;
        ctx.beginPath();
        ctx.arc(0,0,rad,0,TAU);
        ctx.stroke();
        ctx.strokeStyle='#ffd18c';
        ctx.beginPath();
        ctx.arc(0,0,rad*1.13,0,TAU);
        ctx.stroke();
        for(let n=0;n<60;n++){
          const a=n*TAU/60;
          ctx.lineWidth=n%5?.012*u:.04*u;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a)*rad*.94,Math.sin(a)*rad*.94);
          ctx.lineTo(Math.cos(a)*rad*(n%5?.98:.81),Math.sin(a)*rad*(n%5?.98:.81));
          ctx.stroke();
        }
        for(const [speed,len,width]of [[-1.5,.73,.055],[-.25,.43,.09]]){
          const a=-Math.PI/2+t*TAU*speed;
          ctx.strokeStyle='#edfcff';
          ctx.lineWidth=width*u;
          ctx.lineCap='round';
          ctx.beginPath();
          ctx.moveTo(0,0);
          ctx.lineTo(Math.cos(a)*rad*len,Math.sin(a)*rad*len);
          ctx.stroke();
        }
        ctx.fillStyle='#fff1c7';
        ctx.beginPath();
        ctx.arc(0,0,.085*u,0,TAU);
        ctx.fill();
      }
      ctx.restore();
    }
    this.elements=this.elements.filter(f=>f.age<f.duration).slice(-14);
    ctx.restore();
  }
}
