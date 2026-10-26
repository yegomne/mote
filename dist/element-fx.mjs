import {ImpactFX as ParticleFX} from './impact-fx.mjs';
const TAU=Math.PI*2;
export const POWER_THEMES=['harvest','fire','thunder','sun','moon','time','water','earth','wind'];

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
    const c=this.getCols();
    if(kind==='gift'){
      this.gifts.push({from,to,color,strength,age:-delay,duration:.62});
    } else {
      // High-End Motion Graphics: Hypersonic Orbital Kinetic Strike / Rain streak
      const tx=(to%c)+.5;
      const ty=Math.floor(to/c)+.5;
      const isWater=kind==='water';
      const sx=isWater?tx:tx-1.8;
      const sy=isWater?ty-4.2:ty-4.5;
      this.fireLances.push({
        sx, sy, tx, ty,
        strength: strength*(isWater?0.9:1.2),
        color: color||(isWater?'#38bdf8':'#ff4500'),
        age: -delay,
        duration: isWater?0.16:0.22,
        done: false
      });
    }
  }

  lightning(a,b,color='#a5e9ff',strength=1){
    if(this.reduced())return;
    const c=this.getCols();
    const points=[];
    for(let n=0;n<=20;n++){
      const t=n/20;
      points.push([
        a%c+.5+(b%c-a%c)*t+(n&&n<20?(Math.random()-.5)*.48:0),
        Math.floor(a/c)+.5+(Math.floor(b/c)-Math.floor(a/c))*t+(n&&n<20?(Math.random()-.5)*.48:0)
      ]);
    }
    this.bolts.push({points,color,strength,age:0,duration:.85,life:.95});
    for(let i=0;i<12&&this.sparks.length<220;i++){
      const angle=Math.random()*TAU,v=2+Math.random()*4;
      this.sparks.push({x:b%c+.5,y:Math.floor(b/c)+.5,vx:Math.cos(angle)*v,vy:Math.sin(angle)*v,age:0,duration:.35+Math.random()*.4,color:'#c8f4ff'});
    }
    this.elementHit?.(strength,'thunder');
  }

  storm(index,strength=1){
    if(this.reduced())return;
    const c=this.getCols();
    this.elements.push({kind:'storm',x:c/2,y:0,strength,age:0,duration:1.5});
    this.lightning(index%c,index,'#c7f1ff',strength*1.2);
  }

  shockRange(index,radius,color){
    const c=this.getCols();
    if(!this.reduced())this.elements.push({kind:'shock',x:index%c+.5,y:Math.floor(index/c)+.5,radius,color,strength:1,age:0,duration:.8});
  }

  siphon(from,to,color='#76e5a8',strength=1){
    if(!this.reduced())this.streams.push({from,to,color,strength,age:0,duration:.85});
  }

  field(x,y,color,strength=1,kind='solar'){
    if(this.reduced())return;
    this.elements.push({x,y,color,strength,kind,age:0,duration:kind==='clock'?1.75:(kind==='earth'||kind==='water'||kind==='wind'?1.55:1.45)});
    if(kind==='solar')this.elementHit?.(strength,'sun');
    if(kind==='earth')this.elementHit?.(strength,'earth');
    if(kind==='water')this.elementHit?.(strength,'water');
    if(kind==='wind')this.elementHit?.(strength,'wind');
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
      if(f.kind==='water'){
        ctx.globalCompositeOperation='lighter';
        const spread=(.8+t*3.4)*r;
        
        // --- LAYER 1: Hydro-Kinetic Core Pulse & Anamorphic Stream (t < 0.26) ---
        if(t<0.26){
          const ft=t/0.26;
          const flashAlpha=1-ft;
          const beamW=(1.2+Math.sin(ft*Math.PI)*3.2)*r;
          const beamH=Math.max(1,(1-ft)*3.8*f.strength);
          ctx.fillStyle='#ffffff';
          ctx.globalAlpha=flashAlpha*0.95;
          ctx.fillRect(-beamW,-beamH*0.5,beamW*2,beamH);
          ctx.fillStyle='#00e5ff';
          ctx.globalAlpha=flashAlpha*0.6;
          ctx.fillRect(-beamW*1.2,-beamH*1.4,beamW*2.4,beamH*2.8);
          const coreR=(0.5*(1-ft))*r;
          ctx.fillStyle='#e0ffff';
          ctx.globalAlpha=flashAlpha;
          ctx.beginPath();
          ctx.arc(0,0,Math.max(0.1,coreR),0,TAU);
          ctx.fill();
        }

        // --- LAYER 2: Turbulent Dual Tidal Surge Waves (Sinusoidal rolling breakers) ---
        for(let wave=0;wave<2;wave++){
          const wDir=wave===0?1:-1;
          const wPhase=t*14+wave*Math.PI;
          const crestY=Math.sin(wPhase)*0.45*r;
          const waveW=3.8*u;
          
          ctx.fillStyle=wave===0?'#0099cc44':'#00d4ff33';
          ctx.globalAlpha=fade*0.75;
          ctx.beginPath();
          ctx.moveTo(-waveW,crestY);
          ctx.bezierCurveTo(-waveW*0.5,crestY-0.9*r*wDir,0,crestY+0.9*r*wDir,waveW*0.5,crestY-0.4*r*wDir);
          ctx.lineTo(waveW,crestY+0.3*r);
          ctx.bezierCurveTo(waveW*0.4,crestY+1.4*r*wDir,-waveW*0.4,crestY-1.2*r*wDir,-waveW,crestY+0.8*r);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle=wave===0?'#ffffff':'#a5f3fc';
          ctx.lineWidth=Math.max(1,u*0.08*fade);
          ctx.globalAlpha=fade*0.9;
          ctx.beginPath();
          ctx.moveTo(-waveW,crestY);
          ctx.bezierCurveTo(-waveW*0.5,crestY-0.9*r*wDir,0,crestY+0.9*r*wDir,waveW*0.5,crestY-0.4*r*wDir);
          ctx.lineTo(waveW,crestY+0.3*r);
          ctx.stroke();
        }

        // --- LAYER 3: Concentric Hydro Refraction Caustics Rings ---
        for(let cRing=0;cRing<3;cRing++){
          const ringRad=spread*(0.35+cRing*0.28);
          const rAlpha=fade*Math.max(0,1-cRing*0.25);
          ctx.strokeStyle=cRing===0?'#ffffff':cRing===1?'#67e8f9':'#0284c7';
          ctx.lineWidth=Math.max(1,(0.09-cRing*0.02)*u*fade);
          ctx.globalAlpha=rAlpha*0.85;
          ctx.beginPath();
          ctx.ellipse(0,0,Math.max(0.1,ringRad),Math.max(0.1,ringRad*0.48),0,0,TAU);
          ctx.stroke();

          const arcCount=6;
          const segAng=TAU/arcCount;
          ctx.strokeStyle='#ffffff';
          ctx.lineWidth=Math.max(1,0.04*u*fade);
          ctx.beginPath();
          for(let k=0;k<arcCount;k++){
            const a0=k*segAng+t*1.5+cRing*0.4;
            ctx.arc(0,0,Math.max(0.1,ringRad*1.08),a0,a0+segAng*0.45);
            ctx.moveTo(Math.cos(a0+segAng)*ringRad*1.08,Math.sin(a0+segAng)*ringRad*1.08);
          }
          ctx.stroke();
        }

        // --- LAYER 4: Swirling Whirlpool Vortex Arms & Kinetic Water Droplet Beads ---
        const spiralCount=3;
        ctx.lineWidth=Math.max(1,0.06*u*fade);
        ctx.strokeStyle='#38bdf8';
        ctx.globalAlpha=fade*0.8;
        for(let arm=0;arm<spiralCount;arm++){
          const baseAng=arm*(TAU/spiralCount)+t*8.5;
          ctx.beginPath();
          for(let pt=0;pt<=12;pt++){
            const frac=pt/12;
            const a=baseAng+frac*2.4;
            const d=frac*spread*0.85;
            const px=Math.cos(a)*d, py=Math.sin(a)*d*0.55;
            pt===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
          }
          ctx.stroke();
        }

        const dropCount=20;
        for(let d=0;d<dropCount;d++){
          const dAngle=d*(TAU/dropCount)+t*1.2+Math.sin(d)*0.3;
          const dDist=spread*(0.4+((d%5)*0.14));
          const px=Math.cos(dAngle)*dDist;
          const py=Math.sin(dAngle)*dDist*0.52;
          const drSize=(0.06+(d%3)*0.025)*u*fade;
          ctx.fillStyle=d%3===0?'#ffffff':d%2===0?'#67e8f9':'#0ea5e9';
          ctx.globalAlpha=fade*(0.65+Math.sin(t*10+d)*0.35);
          ctx.beginPath();
          ctx.ellipse(px,py,Math.max(0.1,drSize*1.4),Math.max(0.1,drSize*0.7),dAngle,0,TAU);
          ctx.fill();
        }
      }
      if(f.kind==='earth'){
        ctx.globalCompositeOperation='lighter';
        const spread=(.7+t*3.2)*r;

        // --- LAYER 1: Epicenter Seismic Shock Flash & Core Diamond (t < 0.24) ---
        if(t<0.24){
          const ft=t/0.24;
          const flashAlpha=1-ft;
          const octR=(1.0+Math.sin(ft*Math.PI)*2.2)*r;
          ctx.fillStyle='#ffffff';
          ctx.globalAlpha=flashAlpha*0.9;
          ctx.beginPath();
          for(let i=0;i<8;i++){
            const ang=i*(TAU/8);
            const x=Math.cos(ang)*octR, y=Math.sin(ang)*octR*0.6;
            i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
          }
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle='#f59e0b';
          ctx.lineWidth=Math.max(1,u*0.12*flashAlpha);
          ctx.stroke();
        }

        // --- LAYER 2: Tectonic Fault Chasms / Deep Fissure Network ---
        const chasmFade=fade;
        for(let crack=0;crack<CRACK_ANGLES.length;crack++){
          const baseAng=CRACK_ANGLES[crack];
          const crackLen=(0.3+Math.min(1,t*2.8)*1.1)*spread;
          const midDist=crackLen*0.52;
          const zigAng=baseAng+((crack%2===0)?0.38:-0.38);
          const x1=Math.cos(baseAng)*midDist;
          const y1=Math.sin(baseAng)*midDist*0.65;
          const x2=x1+Math.cos(zigAng)*(crackLen*0.48);
          const y2=y1+Math.sin(zigAng)*(crackLen*0.48)*0.65;

          ctx.lineWidth=Math.max(1,(0.12+crack%2*0.04)*u*chasmFade);
          ctx.strokeStyle=crack%2?'#d97706':'#ea580c';
          ctx.globalAlpha=chasmFade*0.8;
          ctx.beginPath();
          ctx.moveTo(0,0);
          ctx.lineTo(x1,y1);
          ctx.lineTo(x2,y2);
          ctx.stroke();

          ctx.lineWidth=Math.max(0.8,0.03*u*chasmFade);
          ctx.strokeStyle='#fffbeb';
          ctx.globalAlpha=chasmFade*0.95;
          ctx.beginPath();
          ctx.moveTo(0,0);
          ctx.lineTo(x1,y1);
          ctx.lineTo(x2,y2);
          ctx.stroke();
        }

        // --- LAYER 3: Erupting 3D Polygonal Granite Monolith Slabs ---
        const monolithCount=8;
        const monoEase=1-Math.pow(1-Math.min(1,t*3.0),3);
        for(let m=0;m<monolithCount;m++){
          const mAng=m*(TAU/monolithCount)+0.22;
          const mDist=spread*(0.25+m%3*0.22)*monoEase;
          const mx=Math.cos(mAng)*mDist;
          const my=Math.sin(mAng)*mDist*0.6;
          const mScale=(0.28+m%3*0.12)*r*fade;
          const mRot=mAng+t*(m%2?1.2:-1.2);

          ctx.save();
          ctx.translate(mx,my);
          ctx.rotate(mRot);

          ctx.fillStyle=m%2?'#fde68a':'#fbbf24';
          ctx.globalAlpha=fade*0.95;
          ctx.beginPath();
          ctx.moveTo(-mScale*0.5,-mScale*0.7);
          ctx.lineTo(mScale*0.6,-mScale*0.5);
          ctx.lineTo(mScale*0.3,mScale*0.5);
          ctx.lineTo(-mScale*0.7,mScale*0.3);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle='#92400e';
          ctx.globalAlpha=fade*0.75;
          ctx.beginPath();
          ctx.moveTo(mScale*0.3,mScale*0.5);
          ctx.lineTo(mScale*0.6,-mScale*0.5);
          ctx.lineTo(mScale*0.75,mScale*0.1);
          ctx.lineTo(mScale*0.45,mScale*0.8);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle='#ffffff';
          ctx.lineWidth=Math.max(0.8,1.2*fade);
          ctx.globalAlpha=fade;
          ctx.stroke();

          ctx.restore();
        }

        // --- LAYER 4: Heavy Seismic Compression Rings & Granite Shrapnel ---
        for(let rIdx=0;rIdx<2;rIdx++){
          const ringR=spread*(0.5+rIdx*0.35);
          ctx.strokeStyle=rIdx===0?'#f59e0b':'#d97706';
          ctx.lineWidth=Math.max(1,(0.08-rIdx*0.03)*u*fade);
          ctx.globalAlpha=fade*0.75;
          ctx.beginPath();
          ctx.ellipse(0,0,Math.max(0.1,ringR),Math.max(0.1,ringR*0.55),0,0,TAU);
          ctx.stroke();
        }

        for(let s=0;s<16;s++){
          const sAng=s*(TAU/16)+t*0.8;
          const sDist=spread*(0.55+(s%4)*0.12);
          const sx=Math.cos(sAng)*sDist;
          const sy=Math.sin(sAng)*sDist*0.6-Math.sin(t*Math.PI)*(0.3*r);
          const sz=(0.05+(s%3)*0.02)*u*fade;
          ctx.fillStyle=s%3===0?'#ffffff':s%2?'#f59e0b':'#b45309';
          ctx.globalAlpha=fade*0.85;
          ctx.beginPath();
          ctx.rect(sx-sz*0.5,sy-sz*0.5,Math.max(0.1,sz),Math.max(0.1,sz));
          ctx.fill();
        }
      }
      if(f.kind==='wind'){
        ctx.globalCompositeOperation='lighter';
        ctx.lineCap='round';
        const spread=(.8+t*3.4)*r;

        // --- LAYER 1: Eye of the Hurricane Vacuum Implosion & Core Flash (t < 0.22) ---
        if(t<0.22){
          const ft=t/0.22;
          const flashAlpha=1-ft;
          ctx.strokeStyle='#a7f3d0';
          ctx.lineWidth=Math.max(1,u*0.06*flashAlpha);
          ctx.globalAlpha=flashAlpha*0.85;
          for(let k=0;k<6;k++){
            const inAng=k*(TAU/6)+ft*4;
            const inDist=(2.4-ft*1.6)*r;
            ctx.beginPath();
            ctx.arc(0,0,Math.max(0.1,inDist),inAng,inAng+0.6);
            ctx.stroke();
          }
          const eyeR=(0.45*(1-ft))*r;
          ctx.fillStyle='#ffffff';
          ctx.globalAlpha=flashAlpha;
          ctx.beginPath();
          ctx.arc(0,0,Math.max(0.1,eyeR),0,TAU);
          ctx.fill();
        }

        // --- LAYER 2: Diagonal Supersonic Razor Vacuum Scythes (X-Cross Slices) ---
        for(let diag=0;diag<4;diag++){
          const dAng=diag*(Math.PI/2)+Math.PI/4;
          const bladeProg=Math.min(1,t*2.8);
          const bladeReach=bladeProg*3.8*u;
          const perpX=-Math.sin(dAng)*0.24*u;
          const perpY=Math.cos(dAng)*0.24*u;
          const bx=Math.cos(dAng)*bladeReach;
          const by=Math.sin(dAng)*bladeReach;

          ctx.strokeStyle='#059669';
          ctx.lineWidth=Math.max(1,u*0.14*fade);
          ctx.globalAlpha=fade*0.6;
          ctx.beginPath();
          ctx.moveTo(-bx*0.2,-by*0.2);
          ctx.quadraticCurveTo(bx*0.5+perpX*1.2,by*0.5+perpY*1.2,bx,by);
          ctx.stroke();

          ctx.strokeStyle='#ffffff';
          ctx.lineWidth=Math.max(1,u*0.05*fade);
          ctx.globalAlpha=fade*0.95;
          ctx.beginPath();
          ctx.moveTo(-bx*0.1,-by*0.1);
          ctx.quadraticCurveTo(bx*0.5+perpX*0.6,by*0.5+perpY*0.6,bx,by);
          ctx.stroke();

          ctx.strokeStyle='#34d399';
          ctx.lineWidth=Math.max(0.8,1.2*fade);
          ctx.globalAlpha=fade*0.75;
          ctx.beginPath();
          ctx.moveTo(-bx*0.1-perpX,-by*0.1-perpY);
          ctx.quadraticCurveTo(bx*0.4-perpX,by*0.4-perpY,bx-perpX*0.5,by-perpY*0.5);
          ctx.stroke();
        }

        // --- LAYER 3: Fibonacci Whirlwind Cyclone Vortex Arms ---
        const armCount=5;
        const spinAng=t*14;
        for(let arm=0;arm<armCount;arm++){
          const baseAng=arm*(TAU/armCount)+spinAng;
          ctx.strokeStyle=arm%2?'#10b981':'#6ee7b7';
          ctx.lineWidth=Math.max(1,(0.12-arm*0.015)*u*fade);
          ctx.globalAlpha=fade*0.75;
          ctx.beginPath();
          for(let pt=0;pt<=14;pt++){
            const frac=pt/14;
            const a=baseAng+frac*2.6;
            const d=(0.2+frac*2.8)*r;
            const px=Math.cos(a)*d, py=Math.sin(a)*d*0.75;
            pt===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
          }
          ctx.stroke();
        }

        // --- LAYER 4: Aerodynamic Needle Shards & Gale Streamers ---
        const shardCount=22;
        for(let s=0;s<shardCount;s++){
          const sAngle=s*(TAU/shardCount)+t*4.5;
          const sDist=spread*(0.35+((s%4)*0.18));
          const sx=Math.cos(sAngle)*sDist;
          const sy=Math.sin(sAngle)*sDist*0.72;
          const tanX=-Math.sin(sAngle)*0.18*u*fade;
          const tanY=Math.cos(sAngle)*0.18*u*fade*0.72;
          ctx.strokeStyle=s%3===0?'#ffffff':s%2?'#a7f3d0':'#34d399';
          ctx.lineWidth=Math.max(0.8,(s%2?2.0:1.2)*fade);
          ctx.globalAlpha=fade*0.85;
          ctx.beginPath();
          ctx.moveTo(sx-tanX,sy-tanY);
          ctx.lineTo(sx+tanX,sy+tanY);
          ctx.stroke();
        }
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
