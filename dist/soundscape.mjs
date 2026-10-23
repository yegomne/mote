const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,Number(n)||0));
export const DEFAULT_AUDIO={enabled:true,master:.86,effects:.92,music:.32};
export function sanitizeAudio(s={}){return {enabled:s.enabled!==false,master:clamp(s.master??DEFAULT_AUDIO.master),effects:clamp(s.effects??DEFAULT_AUDIO.effects),music:clamp(s.music??DEFAULT_AUDIO.music)};}
export function musicStep(step,chapter=0){const roots=[73.416,65.406,82.407,55,73.416],root=roots[chapter%5],progress=[1,4/3,Math.pow(2,8/12),1.5],bass=root*progress[Math.floor(step/16)%4];return {bass,pad:step%16===0,kick:[0,6,8,14].includes(step%16),rim:[4,12].includes(step%16),shaker:step%2===1,note:step%4===2?bass*4*[1,1.2,1.5,1.8][Math.floor(step/4)%4]:null};}
export class Soundscape {
  constructor(){let saved;try{saved=JSON.parse(localStorage.getItem('solar-relic-audio-v3')||'null');}catch{}this.settings=sanitizeAudio(saved||{});this.ctx=null;this.active=0;this.chapter=0;this.playing=false;this.fever=false;this.hidden=false;this.step=0;this.lastImpact=-Infinity;this.lastThunder=-Infinity;}
  persist(){try{localStorage.setItem('solar-relic-audio-v3',JSON.stringify(this.settings));}catch{}}
  setup(){if(this.ctx)return true;const AC=globalThis.AudioContext||globalThis.webkitAudioContext;if(!AC)return false;try{const c=this.ctx=new AC();this.master=c.createGain();this.fx=c.createGain();this.music=c.createGain();this.musicDuck=c.createGain();this.compressor=c.createDynamicsCompressor();this.compressor.threshold.value=-17;this.compressor.knee.value=15;this.compressor.ratio.value=5;this.compressor.attack.value=.005;this.compressor.release.value=.22;const limiter=c.createDynamicsCompressor();limiter.threshold.value=-2;limiter.knee.value=0;limiter.ratio.value=20;limiter.attack.value=.001;limiter.release.value=.09;this.fx.connect(this.master);this.music.connect(this.musicDuck).connect(this.master);this.master.connect(this.compressor).connect(limiter).connect(c.destination);this.reverb=c.createConvolver();const length=Math.floor(c.sampleRate*1.8),buffer=c.createBuffer(2,length,c.sampleRate);for(let ch=0;ch<2;ch++){const a=buffer.getChannelData(ch);for(let i=0;i<length;i++)a[i]=(Math.random()*2-1)*(1-i/length)**3.6*.6;}this.reverb.buffer=buffer;const wet=c.createGain();wet.gain.value=.22;this.reverb.connect(wet).connect(this.master);this.noise=c.createBuffer(1,c.sampleRate*4,c.sampleRate);const data=this.noise.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;this.apply();this.nextBeat=c.currentTime+.08;this.scheduler=setInterval(()=>this.schedule(),100);return true;}catch{return false;}}
  async unlock(){if(!this.settings.enabled)return;if(!this.setup())return;try{if(this.ctx.state==='suspended')await this.ctx.resume();}catch{}}
  apply(){if(!this.ctx)return;const t=this.ctx.currentTime;this.master.gain.setTargetAtTime(this.settings.enabled&&!this.hidden?this.settings.master*.78:0,t,.045);this.fx.gain.setTargetAtTime(this.settings.effects,t,.03);this.music.gain.setTargetAtTime(this.settings.music*(this.playing?.65:.34),t,.25);}
  configure(key,value){if(key==='enabled')this.settings.enabled=!!value;else if(key in DEFAULT_AUDIO)this.settings[key]=clamp(value);this.persist();this.apply();if(this.settings.enabled)this.unlock();}
  mood(chapter,playing,fever=false){if(this.chapter!==chapter){this.chapter=chapter;this.step=0;}if(this.playing!==playing){this.playing=playing;this.apply();}this.fever=fever;}
  visibility(hidden){this.hidden=hidden;this.apply();if(!hidden){this.nextBeat=(this.ctx?.currentTime||0)+.08;this.unlock();}}
  ready(){return this.settings.enabled&&!this.hidden&&this.ctx?.state==='running'&&this.active<90;}
  track(node){this.active++;node.onended=()=>this.active=Math.max(0,this.active-1);}
  voice(freq,duration=.2,volume=.1,type='sine',when,pan=0,bus='fx',endFreq=freq,attack=.004,wet=.18){if(!this.ready()||volume<=0)return;const c=this.ctx,t=when??c.currentTime,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(Math.max(15,freq),t);o.frequency.exponentialRampToValueAtTime(Math.max(15,endFreq),t+duration);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),t+attack);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);const out=c.createStereoPanner?c.createStereoPanner():c.createGain();if(out.pan)out.pan.value=clamp((pan+1)/2)*2-1;g.connect(out).connect(bus==='music'?this.music:this.fx);if(wet){const send=c.createGain();send.gain.value=wet;g.connect(send).connect(this.reverb);}this.track(o);o.start(t);o.stop(t+duration+.02);}
  hiss(duration,volume,frequency,kind='lowpass',when,pan=0,bus='fx'){if(!this.ready())return;const c=this.ctx,t=when??c.currentTime,source=c.createBufferSource(),filter=c.createBiquadFilter(),g=c.createGain();source.buffer=this.noise;filter.type=kind;filter.frequency.value=frequency;filter.Q.value=.7;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),t+.003);g.gain.exponentialRampToValueAtTime(.0001,t+duration);const out=c.createStereoPanner?c.createStereoPanner():c.createGain();if(out.pan)out.pan.value=pan;source.connect(filter).connect(g).connect(out).connect(bus==='music'?this.music:this.fx);this.track(source);source.start(t,Math.random()*.45);source.stop(t+duration+.01);}
  ui(freq=440,duration=.1,type='sine',volume=.07){if(!this.ready())return;this.voice(freq,duration,volume*1.35,type,undefined,0,'fx',freq*.8,.003,.12);}
  match(chain,color){if(!this.ready())return;const c=this.ctx,t=c.currentTime,notes=[587.33,659.25,783.99,880,1046.5,1174.66],f=notes[color%6]*Math.pow(1.06,Math.min(chain-1,6)),pan=(Math.random()-.5)*.45;this.voice(145,.13,.24,'sine',t,pan,'fx',55,.002,0);this.hiss(.075,.14,3200,'highpass',t,pan);this.voice(f,.27,.19,'triangle',t,pan);this.voice(f*2.01,.16,.055,'sine',t+.008,-pan);if(chain>1)this.voice(f*1.5,.31,.09,'sine',t+.055,pan);}
  impact(strength=1,color=1){if(color===2){this.thunder(strength);return;}if(!this.ready()||this.ctx.currentTime-this.lastImpact<.09)return;const t=this.ctx.currentTime;this.lastImpact=t;const weight=Math.min(1.6,strength);this.voice(135,.68,.55*weight,'sine',t,0,'fx',30,.003,.18);this.voice(62,.85,.22*weight,'triangle',t+.018,0,'fx',31,.009,.35);this.hiss(.46,.44*weight,color===2?2400:1050,'lowpass',t);this.hiss(.09,.28*weight,3800,'highpass',t);if(color===2){this.voice(210,.28,.17,'sawtooth',t,0,'fx',70,.002,.25);for(let n=0;n<4;n++)this.hiss(.055,.15,3000,'bandpass',t+n*.045,(n%2?1:-1)*.45);}this.musicDuck.gain.cancelScheduledValues(t);this.musicDuck.gain.setTargetAtTime(.42,t,.015);this.musicDuck.gain.setTargetAtTime(1,t+.4,.24);}
  thunder(strength=1){if(!this.ready()||this.ctx.currentTime-this.lastThunder<.4)return;const t=this.ctx.currentTime,s=Math.min(1.8,strength);this.lastThunder=t;
    // Immediate violent lightning arc snap, followed by deep shockwave impact and rolling thunder
    this.hiss(.06,.65*s,5800,'highpass',t,-.2);
    this.voice(920,.09,.45*s,'sawtooth',t,-.15,'fx',140,.001,.2);
    this.hiss(.38,.6*s,1900,'lowpass',t+.015,.15);
    this.voice(135,.85,.6*s,'sine',t+.015,0,'fx',32,.002,.38);
    this.hiss(1.3,.45*s,680,'lowpass',t+.14,-.4);
    this.hiss(2.5,.38*s,240,'lowpass',t+.32,.4);
    this.hiss(1.8,.22*s,440,'bandpass',t+.7,-.2);
    this.voice(52,1.8,.28*s,'triangle',t+.12,0,'fx',26,.03,.5);
    this.musicDuck.gain.cancelScheduledValues(t);this.musicDuck.gain.setTargetAtTime(.15,t,.01);this.musicDuck.gain.setTargetAtTime(1,t+1.1,.35);
  }
  power(color,multiplier=1){if(!this.ready())return;const t=this.ctx.currentTime,root=[196,146.83,164.81,220,174.61,196][color];
    this.musicDuck.gain.cancelScheduledValues(t);this.musicDuck.gain.setTargetAtTime(.15,t,.01);this.musicDuck.gain.setTargetAtTime(1,t+(multiplier>1?1.1:.75),.3);
    if(color===1){
      this.impact(multiplier*1.2,1);
      this.voice(150,.75,.62*multiplier,'sine',t,0,'fx',30,.002,.35);
      this.voice(240,.32,.4*multiplier,'sawtooth',t+.01,0,'fx',45,.001,.25);
      this.hiss(.88,.5*multiplier,720,'lowpass',t+.03);
      for(let i=0;i<7;i++){this.hiss(.038+i*.003,.16*multiplier,2200+i*320,'highpass',t+.05+i*.055,(i%2?1:-1)*.45);}
      this.voice(95,.45,.25*multiplier,'triangle',t+.02,0,'fx',38,.003,.3);
    }
    if(color===2)this.thunder(multiplier);
    if(color===0){
      const intervals=[0,7,12,15,19,24];
      for(let i=0;i<6;i++){
        const f=root*Math.pow(2,intervals[i]/12);
        this.voice(f,.75,.36*multiplier,'triangle',t+i*.048,(i%2?1:-1)*.4,'fx',f*1.01,.002,.35);
        this.voice(f*2,.5,.15*multiplier,'sine',t+i*.048+.005,-(i%2?1:-1)*.4,'fx',f*2,.003,.45);
      }
      this.voice(220,1.1,.38*multiplier,'triangle',t,0,'fx',440,.01,.45);
      this.hiss(.6,.22*multiplier,2800,'bandpass',t+.08,0);
      this.hiss(.25,.18*multiplier,5200,'highpass',t+.02,.2);
    }
    if(color===3){
      this.voice(130,.9,.65*multiplier,'sine',t,0,'fx',32,.002,.4);
      [1,1.25,1.5,2,2.5,3].forEach((r,i)=>{
        this.voice(root*r,1.4,.24*multiplier,'triangle',t+i*.02,(i-2.5)*.25,'fx',root*r,.01,.45);
        this.voice(root*r*2.005,.8,.12*multiplier,'sine',t+i*.02,0,'fx',root*r*2,.005,.4);
      });
      this.hiss(.55,.42*multiplier,1800,'bandpass',t,0);
      this.hiss(.15,.32*multiplier,4200,'highpass',t,-.2);
      this.voice(880,.7,.28*multiplier,'sine',t+.03,.2,'fx',440,.002,.5);
    }
    if(color===4){
      const desc=[24,19,15,12,7,0];
      for(let i=0;i<6;i++){
        const f=root*Math.pow(2,desc[i]/12);
        this.voice(f,.95,.32*multiplier,'sine',t+i*.055,(i%2?1:-1)*.55,'fx',f*.98,.004,.45);
        this.voice(f*1.5,.6,.14*multiplier,'triangle',t+i*.055,-(i%2?1:-1)*.3,'fx',f*1.48,.003,.4);
      }
      this.voice(105,1.2,.55*multiplier,'triangle',t,0,'fx',30,.005,.5);
      this.voice(root*2,.85,.35*multiplier,'sine',t,0,'fx',root*.6,.01,.6);
      this.hiss(.95,.35*multiplier,1100,'bandpass',t);
      this.hiss(.3,.25*multiplier,2800,'highpass',t+.05);
    }
    if(color===5){
      this.voice(587.33,1.3,.38*multiplier,'sine',t,-.25,'fx',146.83,.01,.6);
      this.voice(146.83,1.5,.52*multiplier,'triangle',t,.25,'fx',36.7,.005,.5);
      this.hiss(1.2,.32*multiplier,820,'lowpass',t);
      for(let i=0;i<6;i++){
        const tf=i%2?1174.66:880;
        this.voice(tf,.035,.22*multiplier,'square',t+i*.12,(i%2?1:-1)*.35,'fx',tf*.9,.001,.15);
        this.hiss(.025,.15*multiplier,3200,'bandpass',t+i*.12);
      }
    }
    if(multiplier>1){
      const tones=color===2?[0,7]:[0,7,12,19];
      tones.forEach((n,i)=>{
        const f=root*2*Math.pow(2,n/12);
        this.voice(f,.85,.28,'sawtooth',t+.09+i*.05,(i-1.5)*.3,'fx',f*1.02,.003,.5);
        this.voice(f*1.5,.6,.16,'sine',t+.1+i*.05,-(i-1.5)*.3,'fx',f*1.5,.002,.45);
      });
      if(color!==0){
        this.voice(90,1.2,.55,'sine',t+.05,0,'fx',25,.002,.4);
      }else{
        this.voice(246.94,1.0,.45,'triangle',t+.05,0,'fx',493.88,.005,.4);
      }
      this.hiss(.65,.38,2200,'bandpass',t+.08);
    }
  }

  chord(kind=0){if(!this.ready())return;const t=this.ctx.currentTime;[0,3,7,12].forEach((n,i)=>this.voice(220*Math.pow(2,(n+kind)/12),.58,.11,'triangle',t+i*.052,(i-1.5)*.2));}
  victory(win=true){if(!this.ready())return;const t=this.ctx.currentTime,notes=win?[0,7,12,15,19,24]:[7,3,0,-5];notes.forEach((n,i)=>this.voice(293.66*Math.pow(2,n/12),.85,.2,'triangle',t+i*.115,(i%2?1:-1)*.25));this.voice(win?73.416:55,1.4,.2,'sine',t,0,'fx',win?73.416:41,.02,.4);}
  schedule(){if(!this.ready())return;const c=this.ctx;if(this.nextBeat<c.currentTime-.2)this.nextBeat=c.currentTime+.03;let guard=0;while(this.nextBeat<c.currentTime+.22&&guard++<4){const t=this.nextBeat,p=musicStep(this.step,this.chapter);if(this.settings.music>0){if(p.pad){[1,1.2,1.5].forEach((r,i)=>{this.voice(p.bass*2*r,5.2,.055,'sine',t,(i-1)*.5,'music',p.bass*2*r,.8,.25);});this.voice(p.bass,2.8,.11,'sine',t,0,'music',p.bass,.02,.1);}if(p.kick){this.voice(120,.2,.31,'sine',t,0,'music',43,.002,0);this.hiss(.08,.035,850,'lowpass',t,0,'music');}if(p.rim){this.voice(470,.075,.075,'triangle',t,.25,'music',290,.001,.08);this.hiss(.07,.05,1700,'bandpass',t,-.25,'music');}if(p.shaker)this.hiss(.045,.035,6500,'highpass',t,this.step%4===1?-.6:.6,'music');if(p.note)this.voice(p.note,.9,.055,'sine',t,(this.step%8<4?-.45:.45),'music',p.note,.01,.4);if(this.fever&&this.step%2===0)this.voice(p.bass*4,.18,.055,'triangle',t,-.3,'music',p.bass*4,.004,.1);}this.step++;this.nextBeat+=this.fever?.285:.34;}}
}
