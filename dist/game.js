import {Soundscape} from './soundscape.mjs?v=7';
import {ImpactFX} from './element-fx.mjs?v=10';
import {REALM_FIRST,REALM_LAST,REALM_ACTS,REALM_FOES,REALM_SCROLLS,REALM_GEAR,REALM_GEAR_SLOTS,realmGearOwned,realmGearRank,realmGearEnhanceCost,realmGearStats,realmBuyGear,realmEquipGear,realmEnhanceGear,realmStage,realmBackdrop,realmGateStars,realmAvailableColors,realmMaxHP,freshRealmSave,freshRealmBattle,realmEncounterHP,realmCast,realmResonanceThreshold,realmResonance,realmCounter,realmNextWave,realmReward,realmBuy} from './realm.mjs?v=6';
import {SIZE,STAGE_COUNT,thunderTargets,harvestTargets,lunarTargets,fireTargets,extendTime,totemPower,amplifyCells,stageDesign,stageGoals,makeStageBoard,makeRealmBoard,damageSeals,TOTEMS,totemLevelSpecs,advanceTotem,upgradeCost,stageReward,chapterIndex,colorNames,chapters,findMatches,adjacent,findMove,makeBoard,affected,specialCreations,collapse,objectives,stageScenario,canUpgradeTotem,upgradePrerequisite,stageStarCriteria,evaluateStageStars,FORTUNE_CARDS} from './engine.mjs?v=23';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],wait=ms=>new Promise(r=>setTimeout(r,ms));
const canvas=$('#board'),ctx=canvas.getContext('2d'),wrap=$('#boardWrap'),frame=$('#boardFrame');
const PALETTE=[['#b7ffce','#18d99f','#087564','#043b3b'],['#ffb0ad','#fb526a','#ac184f','#580d36'],['#bef8ff','#44bdf7','#1367b5','#113367'],['#fff0ba','#f3cb4e','#ae6b0d','#60400b'],['#edcaff','#b36cfa','#7333b1','#3f1b6a'],['#ffddb8','#fc9953','#c04b19','#682612'],['#d9ffff','#44d5ee','#128ab3','#074268'],['#fff1c6','#cda767','#806044','#38342c'],['#e4fff1','#95eacb','#48ab96','#156c77']];
const shapes=[[[0,-.44],[.31,-.25],[.36,.23],[0,.43],[-.36,.23],[-.31,-.25]],[[0,-.46],[.39,0],[0,.46],[-.39,0]],[[-.27,-.36],[.27,-.36],[.4,-.13],[.36,.28],[0,.43],[-.36,.28],[-.4,-.13]],[[-.29,-.34],[.29,-.34],[.43,0],[0,.43],[-.43,0]],[[0,-.45],[.39,-.17],[.25,.35],[-.25,.35],[-.39,-.17]],[[-.24,-.39],[.24,-.39],[.4,-.13],[.35,.28],[.17,.4],[-.17,.4],[-.35,.28],[-.4,-.13]],[[-.31,-.31],[.31,-.31],[.42,.12],[0,.45],[-.42,.12]],[[0,-.46],[.35,-.31],[.43,.2],[0,.46],[-.43,.2],[-.35,-.31]],[[-.32,-.38],[.32,-.38],[.44,0],[.27,.38],[-.27,.38],[-.44,0]]];
function readSave(){try{const s=JSON.parse(localStorage.getItem('solar-relic-v1')||'{}');return {level:Math.max(1,Math.min(STAGE_COUNT,+s.level||1)),unlocked:Math.max(1,Math.min(STAGE_COUNT,+s.unlocked||1)),best:Math.max(0,+s.best||0),reduced:!!s.reduced,sound:!!s.sound};}catch{return {level:1,unlocked:1,best:0,reduced:false,sound:false};}}
const saved=readSave(),director=new Soundscape();
document.addEventListener('pointerdown',()=>director.unlock(),{passive:true});document.addEventListener('keydown',()=>director.unlock(),{passive:true});
document.addEventListener('touchmove',e=>{if(document.body.classList.contains('playing')&&!$('#modal')?.open){e.preventDefault();}},{passive:false});
let growth;try{growth=JSON.parse(localStorage.getItem('solar-relic-growth-v2')||'{}');}catch{growth={};}
growth??={};
let realmSave={...freshRealmSave(),...growth.realm,gear:{...freshRealmSave().gear,...growth.realm?.gear},newLevels:[...freshRealmSave().newLevels.map((v,i)=>growth.realm?.newLevels?.[i]??v)]};
for(const [i,gate] of [105,115,125].entries())if(saved.level>gate||realmSave.cleared?.includes(gate))realmSave.newLevels[i]=Math.max(1,realmSave.newLevels[i]);
let totemLevels=Array.from({length:9},(_,i)=>i<6?growth.levels?.[i]!==undefined?Math.max(0,Math.min(5,Math.floor(+growth.levels[i]||0))):i===0?1:0:realmSave.newLevels[i-6]),magicStars=Math.max(0,Math.floor(+growth.stars||0)),stageStars=Array.from({length:STAGE_COUNT},(_,i)=>Math.max(0,Math.min(3,Math.floor(+growth.stageStars?.[i]||0)))),totemChain={color:-1,count:0},totemFlash=-1,totemFlashUntil=0,totalTotemCasts=0;
let pendingTotemCasts=[],cascadeChain=Promise.resolve(),activeRealmTurn=null;
let fortuneBuffs=Object.assign({timePenaltyStages:0,timeBonusStages:0,hardSeals:false,extraSpecials:false,feverBonusStages:0},growth.fortuneBuffs||{});
function saveGrowth(){try{localStorage.setItem('solar-relic-growth-v2',JSON.stringify({levels:totemLevels,stars:magicStars,stageStars,fortuneBuffs,realm:realmSave}));}catch{}}
function applyDivineBlessing(silent=false){
  const wasMax=totemLevels.slice(0,6).every(l=>l===5);
  totemLevels.splice(0,6,5,5,5,5,5,5);
  saveGrowth();
  if(typeof renderTotems==='function')renderTotems();
  if(typeof updateTotemUI==='function')updateTotemUI();
  if(!wasMax&&!silent){
    flash('#ffe894');chord(12);
    toast('☀️ [신의 축복] 100관문 정복 완료! 모든 토템이 Lv.5 MAX로 각성했습니다!');
  }
}
function totemUnlocked(i){return totemLevels[i]>=1;}
function totemEffectText(i,l=totemLevels[i]){if(l===0)return i<6?`마법별 ★${TOTEMS[i].unlockCost}개로 성소에서 기술 해금`:`${TOTEMS[i].unlockStage}단계 승리 후 해금`;return [ `회수 ${l+1}개 · 생성 ${l+1}개`, `불덩이 ${l}발 · 폭발 반경 ${l>=4?2:1}`, `주변 사방 ${5+(l-1)*2}개 감전 · 반경 ${(1.5+(l-1)*.4).toFixed(1)}`, `보너스 ${300*l}점 · 피버 +${15+5*l}%`, `무작위 특수 보석 ${l}개${l>=5?' · 노바 포함':''}`, `시간 +${3+l*2}초 · 정지 ${l>=3?l:0}초`,`물결 ${3+l}칸 · 치유`,`대지 충격 · 보호막`,`대각선 칼바람 · 반격 지연` ][i];}
function renderTotems(){const list=$('.power-list');list.innerHTML=TOTEMS.slice(0,level>100?9:6).map((t,i)=>{const l=totemLevels[i],unlocked=totemUnlocked(i),art=i<6?'totem-art':'realm-totem-art',position=i<6?`${(i%3)*50}% ${Math.floor(i/3)*100}%`:`${(i-6)*50}% 50%`;return `<button class="power totem ${unlocked?'':'locked'}" style="--accent:${t.accent}" data-totem="${i}" aria-label="${t.name} 토템 정보와 강화"><span class="power-icon ${art}" style="background-position:${position}">${unlocked?'':'🔒'}</span><span class="power-info"><b>${t.shortName||t.name}<small class="totem-level">${unlocked?'Lv.'+l:'🔒'}</small></b><span class="power-meter"><i></i></span></span><span class="power-state">${unlocked?'대기':'잠김'}</span></button>`;}).join('');$$('[data-totem]').forEach(b=>b.onclick=()=>+b.dataset.totem>=6?openRealmShop():openUpgrades(+b.dataset.totem));}
let level=saved.level,unlocked=Math.max(saved.unlocked,level),best=saved.best,mode='adventure',board=saved.level>100?makeRealmBoard(realmAvailableColors(realmSave)):makeStageBoard(saved.level),score=0,crystals=0,time=50,frenzy=0,frenzyUntil=0,frozen=0,selected=-1,activePower=null,running=false,started=false,busy=false,swapping=false,queuedSwap=null,activeCascades=0,ended=false,paused=false,shuffleLeft=2,combo=1,hint=[],hintUntil=0,lastAction=performance.now(),finishAfterBusy=false;
const is100Completed=stageStars[99]>=1||level>100;
if(is100Completed){applyDivineBlessing(true);}
let pausedAt=0,lastFireTargets=[],finishing=false,goalsMetAnnounced=false,realmCounterElapsed=0;
const REALM_COUNTER_TICK=7;
function pauseClock(){if(!pausedAt)pausedAt=performance.now();paused=true;running=false;}
function resumeClock(){if(pausedAt){const gap=performance.now()-pausedAt;if(frenzyUntil)frenzyUntil+=gap;lastAction+=gap;pausedAt=0;}paused=false;if(started&&!ended)running=true;lastTick=performance.now();}
let particles=[],gemShards=[],currentCastColor=-1,rings=[],beams=[],floats=[],ghosts=[],lastTick=performance.now(),boardSize=450,cell=boardSize/8,toastTimer,messageTimer,sound=director.settings.enabled,reduced=saved.reduced||matchMedia('(prefers-reduced-motion: reduce)').matches;
let lastHeavyShake=0,cameraAnimation;
let stage=stageDesign(level),realmBattle=level>100?freshRealmBattle(stage,realmSave):null,sealState=Array(64).fill(0),metrics={colorCollected:Array(9).fill(0),sealsBroken:0,bestCascade:0,specialsMade:0,totemCasts:0,overdrives:0},impactUntil=0,heavyCast=false,cinematicTimer,activeFeverBonus=false;
function makeCurrentBoard(){return level>100?makeRealmBoard(stage.colors):makeBoard(stage.colors||6);}
const fx=new ImpactFX(ctx,()=>cell,()=>reduced,(strength,element)=>{heavyShake(strength);if(element==='fire'||element==='thunder'||element==='earth')director.impact(strength,element==='thunder'?2:element==='earth'?0:1);});
function initStage(){
  finishing=false;lastFireTargets=[];goalsMetAnnounced=false;
  for(const key of ['finale','finaleBonus','castColor','castMultiplier','fireTargets','shockAnchor','shockRadius','shockTargets'])delete frame.dataset[key];
  stage=stageDesign(level);
  if(level>100)stage.colors=realmAvailableColors(realmSave);
  realmBattle=level>100?freshRealmBattle(stage,realmSave):null;
  if(level>100){$('#realmMage').dataset.pose='idle';$('#realmMonster').dataset.pose='idle';realmPack.dataset.pose='idle';realmPack.classList.remove('spawn');}
  document.body.classList.toggle('realm',level>100);
  let stageTime=stage.time;
  if(fortuneBuffs.timeBonusStages>0){stageTime=Math.min(54,stageTime+8);fortuneBuffs.timeBonusStages--;}
  if(fortuneBuffs.timePenaltyStages>0){stageTime=Math.max(25,stageTime-8);fortuneBuffs.timePenaltyStages--;}
  activeFeverBonus=fortuneBuffs.feverBonusStages>0;
  if(fortuneBuffs.feverBonusStages>0)fortuneBuffs.feverBonusStages--;
  stage.time=stageTime;
  sealState=Array(64).fill(0);
  const sealHpAdd=fortuneBuffs.hardSeals?1:0;
  if(fortuneBuffs.hardSeals)fortuneBuffs.hardSeals=false;
  stage.seals.forEach(s=>sealState[s.index]=s.hp+sealHpAdd);
  metrics={colorCollected:Array(9).fill(0),sealsBroken:0,bestCascade:0,specialsMade:0,totemCasts:0,overdrives:0};
  impactUntil=0;heavyCast=false;fx.reset();$('#powerCinematic').classList.remove('show');document.body.classList.remove('overdrive');clearTimeout(cinematicTimer);
  if(fortuneBuffs.extraSpecials){
    fortuneBuffs.extraSpecials=false;
    setTimeout(()=>{
      if(board&&board.length===64){
        const randCells=[18,27,45],spTypes=['bomb','row','nova'];
        randCells.forEach((c,idx)=>{if(board[c])board[c].special=spTypes[idx];});
        syncPositions(true);
        toast('🌟 황금빛 서광! 특수 보석 3개가 배치되었습니다!');
      }
    },200);
  }
}
function currentGoals(){return stageGoals(stage,{...metrics,score,crystals,enemyHP:realmBattle?.enemyHP});}
function budgetEmpty(){return level<=100&&mode!=='zen'&&time<=0;}
document.body.classList.toggle('reduced-motion',reduced);
function persist(){try{localStorage.setItem('solar-relic-v1',JSON.stringify({level,unlocked,best,reduced,sound}));saveGrowth();}catch{}}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2400);}
function announce(title,sub='',duration=1200){const el=level>100?$('#realmCombatNotice'):$('#boardMessage');$('#boardMessage').classList.remove('show');el.replaceChildren(document.createTextNode(title));if(sub){const small=document.createElement('small');small.textContent=sub;el.append(small);}el.classList.add('show');clearTimeout(messageTimer);messageTimer=setTimeout(()=>el.classList.remove('show'),duration);}
function tone(freq=440,dur=.12,type='sine',vol=.07){director.ui(freq,dur,type,vol);}
function chord(kind=0){director.chord(kind);}
function vibrate(n=20){if(!reduced&&navigator.vibrate)navigator.vibrate(n);}
function flash(color='#ffd58b'){if(reduced)return;const el=$('#screenFlash');el.style.background=color;el.animate([{opacity:.16},{opacity:0}],{duration:420});}
function shake(){if(reduced)return;frame.classList.remove('shake');void frame.offsetWidth;frame.classList.add('shake');}
function update(){document.body.classList.toggle('playing',started&&!ended);frame.setAttribute('aria-busy',String(busy));const obj=objectives(level);$('#mobileStage').textContent=`STAGE ${String(level).padStart(2,'0')} · ${chapters[chapterIndex(level)][0]}`;$('#mobileGoal').textContent=`목표 ${obj.target.toLocaleString()}점 · 수정 ${crystals}/${obj.crystals}`;$('#score').textContent=score.toLocaleString();$('#bestScore').textContent=best.toLocaleString();$('#targetScore').textContent=obj.target.toLocaleString();$('#crystalCount').textContent=`${crystals} / ${obj.crystals}`;$('#goalProgress').style.width=`${Math.min(100,score/obj.target*100)}%`;$('#levelLabel').textContent=`STAGE ${String(level).padStart(2,'0')}`;const ci=chapterIndex(level);$('#chapterNumber').textContent=String(ci+1).padStart(2,'0');$('#chapterName').textContent=chapters[ci][0];$('#chapterSub').textContent=chapters[ci][1];$('#chapterPath').innerHTML=Array.from({length:5},(_,i)=>`<span class="${i===ci?'current':i<ci?'done':''}"></span>`).join('');$('#timer').textContent=mode==='zen'?'∞':`${Math.floor(Math.ceil(Math.max(0,time))/60)}:${String(Math.ceil(Math.max(0,time))%60).padStart(2,'0')}`;$('.timer-wrap').classList.toggle('frozen',frozen>0);$('.timer-wrap').classList.toggle('urgent',time<=15&&mode!=='zen'&&running&&!paused&&frozen<=0);$('#timerLabel').textContent=frozen>0?`시간 정지 ${Math.ceil(frozen)}초`:mode==='zen'?'휴식 모드':'남은 시간';const isFrenzy=performance.now()<frenzyUntil;document.body.classList.toggle('is-frenzy',isFrenzy);$('#frenzyFill').style.width=`${isFrenzy?Math.max(0,(frenzyUntil-performance.now())/100):frenzy}%`;$('#multiplier').textContent=isFrenzy?'×3':'×1';$('#frenzyLabel').textContent=isFrenzy?'태양의 각성 · FEVER':'태양의 각성';$('#frenzyText').textContent=isFrenzy?'모든 점수 3배! 계속 연결하세요':`${Math.round(frenzy)}% · 연속 매치로 피버 충전`;$('#shuffleCount').textContent=shuffleLeft;$('#startBtn').innerHTML=(ended?'다시 도전':!started?'탐험 시작':paused?'탐험 계속':'탐험 중 · 잠시 쉬기')+' <svg><use href="#arrow"/></svg>';$$('[data-mode]').forEach(e=>{e.classList.toggle('active',e.dataset.mode===mode);e.disabled=started&&!ended;});updateTotemUI();updateStageUI();director.mood(stage.chapter,running&&!paused,performance.now()<frenzyUntil);$('#soundBtn').setAttribute('aria-label',sound?'소리 끄기':'소리 켜기');$('#soundBtn').title=sound?'소리 끄기':'소리 켜기';$('.mute-dot').style.display=sound?'none':'block';}
function accessBoard(){const input=$('#boardInput');if(!input.children.length)for(let i=0;i<64;i++){const b=document.createElement('button');b.dataset.cell=i;b.tabIndex=i===0?0:-1;input.append(b);}board.forEach((g,i)=>{const b=input.children[i];b.setAttribute('aria-label',`${Math.floor(i/8)+1}행 ${i%8+1}열 ${colorNames[g.color]}${g.special?' 특수 보석':''}${g.crystal?' 별빛 수정':''}${sealState[i]?' 봉인 '+sealState[i]+'겹':''}`);b.dataset.color=g.color;b.dataset.seal=sealState[i];});}
function syncPositions(reset=false){board.forEach((g,i)=>{if(reset||g.x===undefined){g.x=i%8;g.y=Math.floor(i/8);}g.tx=i%8;g.ty=Math.floor(i/8);});accessBoard();}
function start(){if(ended){reset();}if(started){if(paused){resumeClock();$('#modal').close();update();}else pause();return;}started=true;running=true;lastTick=performance.now();lastAction=lastTick;tone(523,.2);announce(stage.name,stage.tip,1700);update();}
function reset(){initStage();pausedAt=0;realmCounterElapsed=0;frame.classList.remove('frozen-board');board=level>100?makeCurrentBoard():makeStageBoard(level);score=0;crystals=0;time=objectives(level).time??50;frenzy=0;frenzyUntil=0;frozen=0;selected=-1;activePower=null;running=false;started=false;ended=false;paused=false;busy=false;swapping=false;queuedSwap=null;finishAfterBusy=false;shuffleLeft=level>100?Infinity:2;totemChain={color:-1,count:0};totalTotemCasts=0;goalsMetAnnounced=false;combo=1;particles=[];gemShards=[];currentCastColor=-1;ghosts=[];rings=[];beams=[];floats=[];hint=[];syncPositions(true);renderTotems();$('#modal').close();update();persist();}
function ensureStarted(){if(finishing)return false;if(!started)start();return running&&!paused&&!ended;}
function pause(){if(!started||ended){toast('보석을 연결하면 탐험이 시작됩니다.');return;}if(busy){toast('연쇄가 끝나면 잠시 쉴 수 있어요.');return;}pauseClock();showModal(`<div class="modal-kicker">TAKE A BREATH</div><h2>사원이 기다리고 있어요</h2><p style="text-align:center">잠시 쉬어도 괜찮아요.<br>돌아오면 바로 이어갈 수 있어요.</p><div class="settings-row"><span>화면 효과 줄이기</span><button id="motionToggle">${reduced?'켜짐':'꺼짐'}</button></div><button id="resumeBtn" class="primary-button">탐험 계속하기 →</button><button id="restartBtn" class="text-button">이 스테이지 처음부터 <span>↻</span></button>`);$('#resumeBtn').onclick=resume;$('#motionToggle').onclick=e=>{reduced=!reduced;document.body.classList.toggle('reduced-motion',reduced);e.target.textContent=reduced?'켜짐':'꺼짐';persist();};$('#restartBtn').onclick=()=>{reset();start();};update();}
function resume(){if(started&&!ended){resumeClock();}$('#modal').close();update();}
function showModal(html){$('#modalContent').innerHTML=html;if(!$('#modal').open)$('#modal').showModal();}
function help(){if(busy){toast('연쇄가 끝난 뒤 도움말을 열 수 있어요.');return;}const was=running;if(was&&!busy){pauseClock();}showModal(`<div class="modal-kicker">THE ART OF MATCHING</div><h2>아주 간단한 탐험 방법</h2><div class="help-row"><span>01</span><div><b>보석 3개를 나란히</b><small>옆 보석으로 스와이프하거나 두 보석을 차례로 터치하세요.<br>키보드: 방향키 이동 · Enter 선택</small></div></div><div class="help-row"><span>02</span><div><b>길게 연결하면 더 강하게</b><small>4개 → 한 줄 번개 / 5개 → 같은 색 제거<br>T·L자 → 폭탄 / 같은 색 두 번부터 → 자동 토템</small></div></div><div class="help-row"><span>03</span><div><b>같은 색 두 번째부터 자동 발동</b><small>예: 빨강 → 빨강 = 불 토템! 토템 Lv.2로 강화하면 세 번째부터 1.5배 위력이 해금됩니다. Lv.1은 계속 기본 위력입니다. 다른 색을 맞추면 연속 횟수가 초기화됩니다. 자동 낙하 연쇄는 연속 색을 바꾸지 않습니다.</small></div></div><div class="help-row"><span>04</span><div><b>점수와 별빛 수정을 모으세요</b><small>반짝이는 작은 별이 수정입니다. 목표 점수와 수정 수를 모두 채우면 다음 스테이지! 클리어 마법별로 토템을 Lv.5까지 강화하세요. 전체 100개 스테이지.</small></div></div><div class="settings-row"><span>화면 효과 줄이기</span><button id="motionToggle">${reduced?'켜짐':'꺼짐'}</button></div><button id="helpClose" class="primary-button">알겠어요 · 탐험으로 →</button>`);$('#helpClose').onclick=resume;$('#motionToggle').onclick=e=>{reduced=!reduced;document.body.classList.toggle('reduced-motion',reduced);e.target.textContent=reduced?'켜짐':'꺼짐';persist();};}
async function trySwap(a,b){
  if(!ensureStarted())return;
  if(swapping){
    queuedSwap=[a,b];
    return;
  }
  swapping=true;
  try{
    if(activeCascades>0||busy){
      await cascadeChain;
    }
    if(!adjacent(a,b)||!board[a]||!board[b])return;
    selected=-1;hint=[];lastAction=performance.now();
    [board[a],board[b]]=[board[b],board[a]];
    syncPositions();tone(280,.06);
    await wait(reduced?20:110);
    const groups=findMatches(board);
    if(!groups.length){
      if(board[a]&&board[b]){
        [board[a],board[b]]=[board[b],board[a]];
        syncPositions();
      }
      await wait(reduced?15:90);
      tone(150,.08,'triangle');
      if(!findMove(board)){
        board=makeCurrentBoard();syncPositions(true);
        announce('새로운 흐름','가능한 매치가 없어 자동으로 섞었어요');
      }
      if(budgetEmpty()&&activeCascades===0){
        const standardWin=currentGoals().every(g=>g.done);
        const stars=evaluateStageStars(stage,{...metrics,score,crystals},0);
        finish(standardWin||stars>=1);
      }
      return;
    }
    combo++;
    const sameColorMatch=groups.find(g=>(g.cells.includes(b)||g.cells.includes(a))&&g.color===totemChain.color)??groups.find(g=>g.color===totemChain.color);
    const primary=sameColorMatch??groups.find(g=>g.cells.includes(b))??groups.find(g=>g.cells.includes(a))??groups[0];
    totemChain=advanceTotem(totemChain,primary.color);
    if(totemUnlocked(primary.color)&&totemChain.trigger){
      pendingTotemCasts.push({
        color:primary.color,
        anchor:b,
        streak:totemChain.count
      });
    }
    updateTotemUI();
    queueCascade(groups,[b,a]);
  }catch(err){
    console.error('trySwap error:',err);
  }finally{
    swapping=false;
    if(queuedSwap&&!ended&&running&&!paused){
      const [nA,nB]=queuedSwap;
      queuedSwap=null;
      trySwap(nA,nB);
    }
  }
}
function queueCascade(groups,preferred=[]){
  activeCascades++;busy=true;frame.setAttribute('aria-busy','true');
  const turn=level>100?{scoreStart:score,specials:[]}:null;
  cascadeChain=cascadeChain.then(async ()=>{
    try{
      activeRealmTurn=turn;
      await resolve(groups,preferred);
      while(pendingTotemCasts.length>0&&!ended){
        const nextCast=pendingTotemCasts.shift();
        if(totemUnlocked(nextCast.color)){
          await castTotem(nextCast.color,nextCast.anchor??27);
        }
      }
      if(turn&&realmBattle?.phase==='playing'){
        const hit=realmResonance(stage,realmBattle,realmSave,score-turn.scoreStart,turn.specials);
        if(hit){combatResonance(hit);await wait(reduced?90:480);}
      }
    }catch(err){
      console.error('cascade error:',err);
    }finally{
      activeRealmTurn=null;
      activeCascades=Math.max(0,activeCascades-1);
      if(activeCascades===0){
        // Realm counterattacks are driven by elapsed active play time in tick().
        busy=false;frame.setAttribute('aria-busy','false');checkEnd();update();
      }
    }
  });
}
async function resolve(groups,preferred=[]){
  for(let depth=0;groups.length&&depth<24;depth++){
    if(depth>0&&totemChain.color>=0&&level<=100){
      const matchingColorGroup=groups.find(g=>g.color===totemChain.color);
      if(matchingColorGroup){
        totemChain=advanceTotem(totemChain,matchingColorGroup.color);
        if(totemUnlocked(matchingColorGroup.color)&&totemChain.trigger){
          pendingTotemCasts.push({
            color:matchingColorGroup.color,
            anchor:matchingColorGroup.cells[0],
            streak:totemChain.count
          });
        }
        updateTotemUI();
      }
    }
    const creation=specialCreations(groups,preferred);
    metrics.specialsMade+=creation.size;metrics.bestCascade=Math.max(metrics.bestCascade,combo);
    const cells=[...new Set(groups.flatMap(g=>g.cells))].filter(i=>board[i]);
    if(cells.length){
      await clearCells(cells,creation,combo);
      await settle(false);
    }
    groups=findMatches(board);
    preferred=[];combo++;
  }
  if(!activeCascades&&findMatches(board).length===0&&!findMove(board)){
    board=makeCurrentBoard();syncPositions(true);toast('사원의 기운이 보석을 새롭게 배치했어요.');
  }
}
async function settle(recurse=true){collapse(board,stage.colors||6);syncPositions();await wait(reduced?20:185);if(recurse){const groups=findMatches(board);if(groups.length){combo++;await resolve(groups);}}}
async function clearCells(indices,creations=new Map(),chain=1){
  const result=affected(board,indices);
  if(activeRealmTurn&&result.effects.length)activeRealmTurn.specials.push(...result.effects.map(effect=>effect.type));
  const seals=damageSeals(sealState,result.cells);
  metrics.sealsBroken+=seals.broken;
  const hasSpecials=result.effects.length>0;
  for(const i of seals.damaged){burst(i,3,heavyCast?28:16);ring(i%8+.5,Math.floor(i/8)+.5,'#e8c779',.85);}
  for(const {index,type,color}of result.effects){
    const r=Math.floor(index/8),c=index%8;
    if(type==='row'||type==='cross'){
      beam(r*8,r*8+7,'#7de0ff');
      flash('#7de0ff');
      director.laserDetonate();
      burst(index,2,48);
      heavyShake(1.6);
    }
    if(type==='col'||type==='cross'){
      beam(c,56+c,'#7de0ff');
      flash('#7de0ff');
      director.laserDetonate();
      burst(index,2,48);
      heavyShake(1.6);
    }
    if(type==='bomb'){
      ring(c+.5,r+.5,'#ff4400',4.2);
      flash('#ff5522');
      director.bombDetonate();
      burst(index,1,64);
      heavyShake(2.2);
    }
    if(type==='nova'){
      ring(c+.5,r+.5,'#e066ff',6.5);
      flash('#ff99ff');
      director.novaDetonate();
      burst(index,4,84);
      heavyShake(2.8);
    }
  }
  let gained=0,collected=0;
  for(const i of result.cells){
    const g=board[i];
    if(!g)continue;
    metrics.colorCollected[g.color]++;
    gained+=50*Math.min(chain,4)*(performance.now()<frenzyUntil?3:1);
    if(g.crystal)collected++;
    burst(i,g.color,heavyCast?26:chain>2?16:10);
    if(!creations.has(i)){ghosts.push({g:{...g},life:1,fireBurst:currentCastColor===1,waterBurst:currentCastColor===6,earthBurst:currentCastColor===7,windBurst:currentCastColor===8});board[i]=null;}
  }
  for(const [i,special]of creations){
    if(board[i]){
      board[i].special=special;
      board[i].crystal=false;
      ring(i%8+.5,Math.floor(i/8)+.5,'#ffd54f',2.2);
      burst(i,3,24);
      flash('#ffe894');
      director.specialCreate(special);
    }
  }
  score+=gained;
  crystals+=collected;
  if(collected)tone(1100,.22,'sine',.06);
  frenzy=Math.min(100,frenzy+result.cells.length*.85);
  if(frenzy>=100&&performance.now()>=frenzyUntil){
    const feverDur=7000+(activeFeverBonus?3000:0);
    frenzy=0;frenzyUntil=performance.now()+feverDur;
    announce('SOLAR AWAKENING',activeFeverBonus?'불타는 각성 · 점수 3배 (+3초)':'태양의 각성 · 모든 점수 3배',1500);
    chord(7);flash();shake();
  }
  if(gained){
    const middle=result.cells[Math.floor(result.cells.length/2)]??27;
    floats.push({x:middle%8+.5,y:Math.floor(middle/8)+.5,text:`+${gained.toLocaleString()}`,life:1.2,color:chain>1?'#ffe2a1':'#d2f3dd'});
  }
  if(chain>1){
    $('#boardHint').textContent=`${chain}연쇄 · 보석이 깨어납니다!`;
    if(chain>=3)announce(`${chain} COMBO`,chain>=5?'경이로운 연쇄!':'빛나는 연결',650);
  }
  director.match(chain,totemChain.color>=0?totemChain.color:0);
  vibrate(chain>=3?35:12);
  if(chain>=3)shake();
  best=Math.max(best,score);
  update();
  await wait(reduced?25:hasSpecials?420:175);
}
const realmPack=document.createElement('div');realmPack.id='realmPack';realmPack.className='realm-pack';realmPack.hidden=true;realmPack.setAttribute('aria-hidden','true');$('.realm-scene').append(realmPack);
const realmCombatNotice=document.createElement('div');realmCombatNotice.id='realmCombatNotice';realmCombatNotice.className='realm-combat-notice';realmCombatNotice.setAttribute('role','status');$('#realmArena').append(realmCombatNotice);
const realmScrollBurst=document.createElement('div');realmScrollBurst.id='realmScrollBurst';realmScrollBurst.className='realm-scroll-burst';realmScrollBurst.setAttribute('aria-hidden','true');$('.realm-scene').append(realmScrollBurst);
function realmDollLayers(){return REALM_GEAR_SLOTS.map(slot=>`<img class="realm-gear-layer gear-${slot}" data-gear-layer="${slot}" alt="" aria-hidden="true" hidden>`).join('');}
$('#realmMage').innerHTML=realmDollLayers();
function updateRealmDoll(){for(const el of $$('[data-gear-layer]')){const slot=el.dataset.gearLayer,tier=realmSave.gear?.[slot]||0;el.hidden=tier===0;if(tier){const src=`assets/gear/${slot}-${tier}.svg`;if(el.getAttribute('src')!==src)el.src=src;el.dataset.tier=tier;el.dataset.rank=realmGearRank(realmSave,slot,tier);}}}
const realmPoseTimer={mage:0,monster:0};
function realmPose(who,pose,duration=0){if(level<=100)return;const el=$(who==='mage'?'#realmMage':'#realmMonster');if(!el)return;el.dataset.pose=pose;if(who==='monster')realmPack.dataset.pose=pose;if(duration){clearTimeout(realmPoseTimer[who]);realmPoseTimer[who]=setTimeout(()=>{if(level>100&&realmBattle?.phase==='playing'){el.dataset.pose='idle';if(who==='monster')realmPack.dataset.pose='idle';}},duration);}}
function updateRealmUI(){
 const arena=$('#realmArena');arena.hidden=level<=100;if(level<=100)return;
 updateRealmDoll();
 const d=stage,b=realmBattle,foe=REALM_FOES[b.enemyId],sprite=foe.sprite,pack=d.enemyId===0&&d.waves>1,remaining=d.waves-b.wave+1,encounter=realmEncounterHP(d,b);
 document.body.style.setProperty('--realm-art',`url('${realmBackdrop(d,b.enemyId)}')`);
 $('#realmMonster').hidden=pack;realmPack.hidden=!pack;
 if(pack&&realmPack.dataset.count!==String(remaining)){realmPack.innerHTML=Array.from({length:remaining},()=>'<span></span>').join('');realmPack.dataset.count=String(remaining);}
 $('#realmMonster').style.backgroundPosition=`${sprite%4*100/3}% ${Math.floor(sprite/4)*50}%`;$('#realmMonster').setAttribute('aria-label',foe.name);
 $('#realmEnemyName').textContent=pack?`${foe.name} ×${remaining}`:d.waves>1?`${foe.name} · ${b.wave}/${d.waves}`:foe.name;
 $('#realmEnemyHP').textContent=`${encounter.current} / ${encounter.max}`;$('#realmHeroHP').textContent=`${b.heroHP} / ${b.heroMax}${b.shield?' · 방어 '+b.shield:''}`;
 $('#realmEnemyFill').style.width=`${Math.max(0,encounter.current/encounter.max*100)}%`;$('#realmHeroFill').style.width=`${Math.max(0,b.heroHP/b.heroMax*100)}%`;
 $('#realmAffinity').textContent=`약점 ${foe.weak.map(i=>TOTEMS[i].shortName).join('·')} / 저항 ${foe.resist.map(i=>TOTEMS[i].shortName).join('·')}`;updateRealmCounterLabel();
 $('#mobileGoal').textContent=`적 체력 ${encounter.current}/${encounter.max} · ◈ ${realmSave.coins}`;$('#targetScore').textContent=encounter.max;$('#crystalCount').textContent=`적 체력 ${encounter.current} / ${encounter.max}`;$('#goalProgress').style.width=`${Math.max(0,(1-encounter.current/encounter.max)*100)}%`;
 const newGems=['물','대지','바람'].slice(0,d.colors-6).join('·');
 $('#timer').textContent='∞';$('#timerLabel').textContent='이동 제한 없음';$('#shuffleCount').textContent='∞';$('#goalChips').innerHTML=`<span class="goal-chip" style="--chip-color:${newGems?'#91e4e8':'#dec486'}">${d.colors}색 · ${newGems?'새 보석 '+newGems:'특수돌+'+realmResonanceThreshold(d).toLocaleString()+'점 공명'}</span><span class="goal-chip">◈ ${realmSave.coins} 코인</span>`;
}
function showRealmDamage(text,color='#ffe4a0'){const el=$('#realmDamage');el.textContent=text;el.style.color=color;el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop');}
function combatCast(color,anchor){if(level<=100||!realmBattle||realmBattle.phase!=='playing')return;const result=realmCast(stage,realmBattle,realmSave,color,totemLevels[color],totemChain.count);if(!result)return;realmPose('mage','cast',900);realmPose('monster',result.affinity<1?'guard':'hurt',750);const orb=$('#realmSpell');orb.dataset.element=['jade','fire','thunder','solar','moon','time','water','earth','wind'][color];orb.style.setProperty('--spell',TOTEMS[color].accent);orb.classList.remove('fly');void orb.offsetWidth;orb.classList.add('fly');showRealmDamage(`${result.combo?result.combo+' · ':''}−${result.damage}`,TOTEMS[color].accent);if(result.combo){realmScrollBurst.style.backgroundPosition=`${result.comboArt%4*100/3}% ${Math.floor(result.comboArt/4)*100}%`;realmScrollBurst.classList.remove('burst');void realmScrollBurst.offsetWidth;realmScrollBurst.classList.add('burst');toast(`${result.combo} 연계 마법! ${result.damage} 피해`);director.resonance(2);}else if(result.affinity>1)toast(`약점 적중! ${result.damage} 피해`);director.impact(result.boost>1?1.5:1,color===2?2:color===1?1:0);updateRealmUI();}
function combatResonance(hit){realmPose('mage','cast',850);realmPose('monster','hurt',850);const orb=$('#realmSpell');orb.dataset.element='resonance';orb.style.setProperty('--spell','#fff2ad');orb.classList.remove('fly');void orb.offsetWidth;orb.classList.add('fly');showRealmDamage(`공명 −${hit.damage}`,'#fff2ad');announce('특수돌 공명!',`${hit.score.toLocaleString()}점 · 특수돌 ${hit.specials}개 폭발 → 추가 공격`,1000);director.resonance(hit.power);vibrate([30,30,65]);updateRealmUI();}
function updateRealmCounterLabel(){if(level<=100||!realmBattle)return;const seconds=Math.max(1,Math.ceil((stage.cadence-realmBattle.charge+realmBattle.delay)*REALM_COUNTER_TICK-realmCounterElapsed));$('#realmCharge').textContent=realmBattle.delay?`그로기 · 반격 약 ${seconds}초`:`반격까지 약 ${seconds}초`;}
function combatCounterEvent(event){if(!event)return;if(event.delayed){realmPose('monster','groggy',750);toast('몬스터 그로기 · 반격 지연');}else if(event.damage||event.blocked){realmPose('monster','attack',650);realmPose('mage',event.damage?'hurt':'guard',750);showRealmDamage(event.damage?`마법사 −${event.damage}`:'방어!',event.damage?'#ff8b78':'#a2ebd9');director.impact(1,1);vibrate(event.damage?45:20);}if(event.defeat)realmPose('mage','groggy');updateRealmUI();if(event.burn||event.defeat)checkEnd();}
function showCombatWave(){realmCounterElapsed=0;if(stage.enemyId===0){realmPack.classList.remove('spawn');void realmPack.offsetWidth;realmPack.classList.add('spawn');realmPose('monster','idle');announce('슬라임 한 마리 격파!',`${stage.waves-realmBattle.wave+1}마리 남았습니다.`,1000);}else{realmPose('monster','groggy',700);announce(`${realmBattle.wave}/${stage.waves} 연전`,'새로운 적이 나타났습니다. 생명력 일부 회복!',1200);}}
function checkEnd(){
  if(ended||finishing)return;
  if(level>100){if(realmBattle?.heroHP<=0){finish(false);return;}if(realmBattle?.enemyHP<=0){if(realmNextWave(stage,realmBattle)){showCombatWave();update();return;}finish(true);return;}if(!findMove(board)){board=makeCurrentBoard();syncPositions(true);}persist();return;}
  const obj=objectives(level);
  const allGoalsDone=currentGoals().every(g=>g.done);
  if(allGoalsDone&&!goalsMetAnnounced){
    goalsMetAnnounced=true;
    announce('목표 달성! ★★★ 도전','남은 시간 동안 최고 점수를 노리세요!',1500);
    tone(880,.15);
  }
  if(mode==='zen'&&allGoalsDone){finish(true);return;}
  if(budgetEmpty()){
    const standardWin=allGoalsDone;
    const stars=evaluateStageStars(stage,{...metrics,score,crystals},0);
    finish(standardWin||stars>=1);
    return;
  }
  if(!findMove(board)){board=makeCurrentBoard();syncPositions(true);announce('새로운 흐름','가능한 매치가 없어 자동으로 섞었어요');}
  persist();
}
async function finish(requestedWin){
  if(ended||finishing)return;
  finishing=true;running=false;busy=true;selected=-1;hint=[];frozen=0;frame.classList.remove('frozen-board');update();
  frame.dataset.finale='running';const beforeBonus=score;
  const willWin=level>100?!!requestedWin:requestedWin||currentGoals().every(g=>g.done);
  try{
    if(willWin){
      const hasSpecials=board.some(g=>g?.special);
      if(hasSpecials){
        announce('피날레 특수보석 대연쇄!','남은 특수 보석 자동 발동 · 보너스 점수',2000);
        await wait(reduced?40:480);
        while(board.some(g=>g?.special)){
          const index=board.findIndex(g=>g?.special);
          ring(index%8+.5,Math.floor(index/8)+.5,'#fff9d2',2.0);
          await wait(reduced?20:120);
          await clearCells([index],new Map(),1);
          await wait(reduced?25:200);
          collapse(board,stage.colors||6);syncPositions();
          await wait(reduced?25:220);
          let extraGroups=findMatches(board);
          while(extraGroups.length){
            combo++;
            await resolve(extraGroups);
            extraGroups=findMatches(board);
          }
          await wait(reduced?20:150);
        }
        if(score>beforeBonus){
          announce('정산 완료!',`종료 보너스 +${(score-beforeBonus).toLocaleString()}점`,1300);
          await wait(reduced?30:450);
        }
      }
    }
  }finally{
    frame.dataset.finale='complete';frame.dataset.finaleBonus=score-beforeBonus;busy=false;finishing=false;
    completeStage(willWin);
  }
}
function starMarks(count){return '★'.repeat(count)+'☆'.repeat(3-count);}
function completeRealmStage(win){
  if(ended)return;
  ended=true;running=false;paused=false;activePower=null;
  const d=realmStage(level),b=realmBattle,required=realmGateStars(d);let reward=null,stars=0,canAdvance=false;
  if(win){
    reward=realmReward(d,b,realmSave);
    for(let i=6;i<9;i++)totemLevels[i]=realmSave.newLevels[i-6];
    stars=b.heroHP/b.heroMax>=.7?3:b.heroHP/b.heroMax>=.35?2:1;
    stageStars[level-1]=Math.max(stageStars[level-1],stars);
    canAdvance=stageStars[level-1]>=required||unlocked>level;
    if(canAdvance)unlocked=Math.max(unlocked,Math.min(REALM_LAST,level+1));
    best=Math.max(best,score);director.victory(true);chord(12);flash('#fff2b4');
  }else director.victory(false);
  persist();renderTotems();update();
  const next=level<REALM_LAST?realmStage(level+1):null;
  const gateText=win&&next?`<div class="realm-gate-result ${canAdvance?'open':'closed'}"><b>다음 상대 · ${next.enemy.name}</b><span>해금 조건 ${required}★ · 최고 성취 ${stageStars[level-1]}★</span><strong>${canAdvance?'길이 열렸습니다':'별이 부족합니다 · 이 전투를 다시 도전하세요'}</strong></div>`:'';
  const nextLabel=win?level===REALM_LAST?'여정의 지도 보기':canAdvance?'다음 전투 →':'별 더 모아 재도전 →':'이 전투 재도전 →';
  showModal(`<div class="modal-kicker">${win?'THE NINE REALMS · VICTORY':'THE NINE REALMS · RETRY'}</div><h2>${win?level===200?'아홉 토템의 수호자':d.name+' 격파':'마법사는 다시 일어납니다'}</h2><div class="result-stars">${win?starMarks(stars):'✦'}</div><p class="stars-caption">${win?`이번 전투 ${stars}★ · 최고 ${stageStars[level-1]}★ · 생명력 70% 이상 3★ / 35% 이상 2★`:'장비와 연계 스크롤을 준비하고 다시 도전하세요.'}</p>${gateText}<div class="result-stats"><div><b>${score.toLocaleString()}</b><span>보석 점수</span></div><div><b>${win?'◈ '+reward.coins:'◈ '+realmSave.coins}</b><span>${win?'이번 전투 보상':'보유 코인'}</span></div></div>${reward?.unlock>=6?`<p class="stars-caption">✦ ${TOTEMS[reward.unlock].name} 토템 해금 · ${colorNames[reward.unlock]} 보석은 다음 전투부터 등장!</p>`:''}<button id="realmNext" class="primary-button">${nextLabel}</button><button id="realmResultShop" class="text-button">장비 · 연계 마법 상점 ↗</button>`);
  $('#realmNext').onclick=()=>{if(win&&level===REALM_LAST){openRealmMap();return;}if(win&&canAdvance)level++;reset();showScenarioBriefing(level);};
  $('#realmResultShop').onclick=()=>openRealmShop();
}
function completeStage(win){
  if(level>100){completeRealmStage(win);return;}
  if(ended)return;
  director.victory(win);
  ended=true;running=false;paused=false;activePower=null;frenzyUntil=0;
  best=Math.max(best,score);
  const stageMetrics={...metrics,score,crystals};
  const earnedStars=win?Math.max(1,evaluateStageStars(stage,stageMetrics,time)):0;
  const newStars=win?stageReward(stageStars[level-1],earnedStars):0;
  if(win){
    stageStars[level-1]=Math.max(stageStars[level-1],earnedStars);
    magicStars+=newStars;
    unlocked=Math.max(unlocked,Math.min(STAGE_COUNT,level+1));
    chord(12);flash();
    for(let i=0;i<8;i++)burst(Math.floor(Math.random()*64),3,25);
    if(level===100){
      applyDivineBlessing(false);
    }
  }
  persist();update();
  const stars=earnedStars,endingBonus=Number(frame.dataset.finaleBonus)||0;
  const sc=stageScenario(level);
  const criteria=stageStarCriteria(stage);
  showModal(`
    <div class="modal-kicker">${win?'TEMPLE AWAKENED':'A NEW DAWN AWAITS'}</div>
    <h2>${win?(level===100?'태양의 유산을 찾았습니다':`${sc.title} 돌파!`):'다시 깨어날 시간'}</h2>
    <div class="result-stars">${win?'★'.repeat(stars)+'☆'.repeat(3-stars):'✦'}</div>
    <div class="result-stats">
      <div><b>${score.toLocaleString()}</b><span>최종 점수 · 종료 보너스 포함</span></div>
      <div><b>${crystals}</b><span>별빛 수정</span></div>
    </div>
    ${endingBonus?`<p class="stars-caption">종료 보너스 +${endingBonus.toLocaleString()}점 합산 완료</p>`:''}
    
    ${win&&level===100?`
      <div class="divine-blessing-box" style="background:linear-gradient(135deg,#2e1e05,#4a3206);border:2px solid #ffd54f;border-radius:12px;padding:12px 14px;margin:12px 0;text-align:center;box-shadow:0 0 25px rgba(255,213,79,0.5);">
        <div style="font-size:11px;color:#ffe57f;letter-spacing:1.5px;font-weight:bold;">☀️ DIVINE BLESSING · 신의 축복 강림 ☀️</div>
        <h3 style="color:#ffffff;font-size:16px;margin:5px 0 6px;text-shadow:0 0 10px #ffea79;">6대 수호 토템 궁극 레벨 (Lv.5 MAX) 완전 해금!</h3>
        <p style="font-size:11px;color:#fcebc2;line-height:1.6;margin:0;">
          100개의 모든 시련을 이겨낸 위대한 탐험가여!<br>
          태양신의 은총으로 <b>6대 원소 토템(비취·불·번개·황금·달·시간)</b>의<br>
          모든 숨겨진 봉인이 풀리고 <b>최고 레벨(Lv.5 MAX)</b>로 각성했습니다!
        </p>
        <div style="display:flex;justify-content:center;gap:6px;margin-top:9px;font-size:11px;font-weight:bold;color:#ffe082;flex-wrap:wrap;">
          <span>💎 비취 Lv.5</span> · <span>🔥 불 Lv.5</span> · <span>⚡ 번개 Lv.5</span> · <span>👑 황금 Lv.5</span> · <span>🌙 달 Lv.5</span> · <span>⏳ 시간 Lv.5</span>
        </div>
      </div>
    `:''}
    
    <div class="result-star-breakdown" style="background:#051b20;border:1px solid #d4b56833;border-radius:10px;padding:8px 12px;margin:10px 0;text-align:left;font-size:10px;">
      <b style="color:#f0dcab;display:block;margin-bottom:4px;">★ 별 달성 내역:</b>
      <div style="color:${stars>=1?'#72e3be':'#839b97'};margin:2px 0;">${stars>=1?'✓ ':'· '}★1: ${criteria.star1.desc}</div>
      <div style="color:${stars>=2?'#72e3be':'#839b97'};margin:2px 0;">${stars>=2?'✓ ':'· '}★2: ${criteria.star2.desc}</div>
      <div style="color:${stars>=3?'#ffd54f':'#839b97'};margin:2px 0;">${stars>=3?'✓ ':'· '}★3: ${criteria.star3.desc}</div>
    </div>

    <p class="stars-caption">
      ${win?(level===100?'100개의 관문을 모두 돌파했습니다! 몬테주마의 전설이 완성되었습니다.':`마법별 +${newStars}개 (보유 ★${magicStars})<br>사원의 다음 문이 열렸습니다. 다음 관문으로 나아가세요!`):currentGoals().map(g=>(g.done?'✓ ':'· ')+g.label+' '+Math.min(g.value,g.target)+'/'+g.target).join('<br>')+'<br>휴식 모드에서 제한 없이 공략할 수도 있어요.'}
    </p>
    <button id="nextBtn" class="primary-button">${win&&level===100?'🎁 보물상자를 여세요':win&&level<100?(level%5===0?'고대 운명의 카드 시험으로 →':'다음 관문으로 →'):'다시 도전하기 →'}</button>
    ${win?'<button id="resultUpgrade" class="text-button">토템 강화 <span>↗</span></button>':''}
    ${!win?'<button id="zenResult" class="text-button">시간 없는 휴식으로 <span>∞</span></button>':''}
  `);
  $('#nextBtn').onclick=()=>{
    if(win&&level===100){openWorldChest();return;}
    if(win&&level<STAGE_COUNT){
      if(level%5===0){
        openFortuneCardModal(level,()=>{
          level++;
          reset();
          showScenarioBriefing(level);
        });
      }else{
        level++;
        reset();
        showScenarioBriefing(level);
      }
    }else{
      reset();
      start();
    }
  };
  if($('#resultUpgrade'))$('#resultUpgrade').onclick=()=>openUpgrades();
  if($('#zenResult'))$('#zenResult').onclick=()=>{mode='zen';reset();start();};
}
function select(i){
  if(paused||ended||$('#modal').open)return;
  if(i<0||i>=64||!board[i])return;
  if(selected===i){selected=-1;return;}
  if(selected>=0&&adjacent(selected,i)){
    const prev=selected;
    selected=-1;
    trySwap(prev,i);
    return;
  }
  selected=i;
  lastAction=performance.now();
  tone(400+board[i].color*40,.05);
}
let pointer=null;
wrap.addEventListener('pointerdown',e=>{
  if(e.button!==0||paused||ended||$('#modal').open)return;
  const rect=wrap.getBoundingClientRect();
  const col=Math.max(0,Math.min(7,Math.floor((e.clientX-rect.left)/(rect.width/8))));
  const row=Math.max(0,Math.min(7,Math.floor((e.clientY-rect.top)/(rect.height/8))));
  const i=row*8+col;
  pointer={id:e.pointerId,startX:e.clientX,startY:e.clientY,i,width:rect.width,swapped:false};
  try{wrap.setPointerCapture(e.pointerId);}catch{}
  select(i);
});
wrap.addEventListener('pointermove',e=>{
  if(!pointer||pointer.id!==e.pointerId||pointer.swapped)return;
  const dx=e.clientX-pointer.startX,dy=e.clientY-pointer.startY;
  const threshold=Math.max(12,pointer.width/8*.24);
  if(Math.hypot(dx,dy)>=threshold){
    pointer.swapped=true;
    const from=pointer.i;
    let targetCol=from%8,targetRow=Math.floor(from/8);
    if(Math.abs(dx)>Math.abs(dy)){
      targetCol+=dx>0?1:-1;
    }else{
      targetRow+=dy>0?1:-1;
    }
    if(targetCol>=0&&targetCol<8&&targetRow>=0&&targetRow<8){
      const to=targetRow*8+targetCol;
      if(adjacent(from,to)){
        selected=-1;
        trySwap(from,to);
      }
    }
  }
});
wrap.addEventListener('pointerup',e=>{
  if(!pointer||pointer.id!==e.pointerId)return;
  try{wrap.releasePointerCapture(e.pointerId);}catch{}
  pointer=null;
});
wrap.addEventListener('pointercancel',e=>{
  if(pointer&&pointer.id===e.pointerId){
    try{wrap.releasePointerCapture(e.pointerId);}catch{}
    pointer=null;
  }
});
$('#boardInput').addEventListener('keydown',e=>{const i=+e.target.dataset.cell;if(!Number.isFinite(i))return;const delta={ArrowRight:1,ArrowLeft:-1,ArrowUp:-8,ArrowDown:8}[e.key];if(delta){e.preventDefault();const j=i+delta;if(j>=0&&j<64&&adjacent(i,j)){e.target.tabIndex=-1;const b=$('#boardInput').children[j];b.tabIndex=0;b.focus();}}if(e.key==='Enter'||e.key===' '){e.preventDefault();select(i);}});
document.addEventListener('keydown',e=>{if($('#modal').open)return;if(e.key==='Escape'){if(started&&!ended)pause();}});
$('#startBtn').onclick=start;$('#pauseBtn').onclick=()=>paused?resume():pause();$('#helpBtn').onclick=()=>level>100?realmHelp():help();$('#soundBtn').onclick=()=>{sound=!sound;director.configure('enabled',sound);tone(660,.15);persist();update();};$('#closeModal').onclick=resume;$('#modal').addEventListener('cancel',e=>{e.preventDefault();resume();});
$$('[data-mode]').forEach(b=>b.onclick=()=>{if(started&&!ended)return;mode=b.dataset.mode;reset();toast(mode==='zen'?'시간 제한 없이, 편안하게 즐기세요.':'90초 동안 고대 사원을 깨우세요.');});
$('#hintBtn').onclick=()=>{if(busy||paused||ended)return;hint=findMove(board,totemChain.color)||[];hintUntil=performance.now()+3500;if(hint.length)toast('빛나는 두 보석을 서로 바꿔보세요.');};
$('#shuffleBtn').onclick=()=>{if(busy||paused||ended)return;if(!shuffleLeft){toast('섞기를 모두 사용했어요. 다음 스테이지에 충전됩니다.');return;}if(level<=100)shuffleLeft--;board=makeCurrentBoard();selected=-1;hint=[];syncPositions(true);ring(4,4,'#bde5b9',4);tone(450,.18);toast('보석에 새로운 기운이 깃들었어요.');update();};
$('#mapBtn').onclick=()=>openMap();
$('#mobileMap').onclick=()=>$('#mapBtn').click();
$('#realmBattleMap').onclick=()=>openRealmMap();
document.addEventListener('visibilitychange',()=>{director.visibility(document.hidden);if(document.hidden&&running){pauseClock();}else if(!document.hidden&&paused&&!$('#modal').open){pause();}update();});
// Canvas rendering stays independent of puzzle logic so cascades never block input accounting.
function resize(){const dpr=Math.min(devicePixelRatio||1,2);boardSize=wrap.clientWidth;cell=boardSize/8;canvas.width=Math.round(boardSize*dpr);canvas.height=Math.round(boardSize*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}
new ResizeObserver(resize).observe(wrap);resize();
function polygon(points,scale=1){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x*scale,y*scale):ctx.moveTo(x*scale,y*scale));ctx.closePath();}
function drawRealmGem(g,x,y,scale=1,alpha=1,now=0){
  ctx.save();ctx.translate(x,y);ctx.scale(cell*scale,cell*scale);ctx.globalAlpha=alpha;
  const color=g.color,glimmer=.55+.22*Math.sin(now/1100+g.id);
  ctx.shadowColor=color===6?'#1ecfff':color===7?'#d3ad67':'#9bf2d3';ctx.shadowBlur=cell*.11;ctx.shadowOffsetY=cell*.035;
  if(color===6){
    const drop=()=>{ctx.beginPath();ctx.moveTo(0,-.47);ctx.bezierCurveTo(.13,-.26,.37,-.12,.37,.17);ctx.bezierCurveTo(.37,.37,.21,.46,0,.46);ctx.bezierCurveTo(-.23,.46,-.39,.32,-.37,.12);ctx.bezierCurveTo(-.34,-.13,-.11,-.30,0,-.47);ctx.closePath();};
    drop();const base=ctx.createLinearGradient(-.23,-.42,.28,.43);base.addColorStop(0,'#d5ffff');base.addColorStop(.2,'#77eaff');base.addColorStop(.55,'#168fca');base.addColorStop(1,'#073b72');ctx.fillStyle=base;ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
    drop();ctx.strokeStyle='#c3fbff';ctx.lineWidth=.025;ctx.stroke();
    ctx.beginPath();ctx.moveTo(-.05,-.32);ctx.bezierCurveTo(-.28,-.05,-.29,.25,-.12,.31);ctx.strokeStyle=`rgba(238,255,255,${glimmer})`;ctx.lineWidth=.055;ctx.lineCap='round';ctx.stroke();
    ctx.beginPath();ctx.ellipse(.115,.12,.115,.145,-.25,0,Math.PI*2);ctx.fillStyle='#91edff3b';ctx.fill();ctx.strokeStyle='#d9ffff70';ctx.lineWidth=.012;ctx.stroke();
    ctx.beginPath();ctx.arc(.13,-.17,.035,0,Math.PI*2);ctx.fillStyle='#e5ffff';ctx.fill();
  }else if(color===7){
    const rock=[[-.42,-.09],[-.29,-.32],[-.07,-.44],[.26,-.34],[.43,-.1],[.33,.31],[.08,.44],[-.26,.34],[-.43,.09]];
    polygon(rock);const base=ctx.createLinearGradient(-.35,-.35,.36,.42);base.addColorStop(0,'#f6dfaa');base.addColorStop(.24,'#aa9169');base.addColorStop(.62,'#69726b');base.addColorStop(1,'#303d41');ctx.fillStyle=base;ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
    polygon(rock);ctx.strokeStyle='#f4d9a3';ctx.lineWidth=.024;ctx.stroke();
    const facets=[{pts:[[-.42,-.09],[-.07,-.44],[.07,-.06],[-.18,.09]],fill:'#f6e5ba7a'},{pts:[[-.07,-.44],[.26,-.34],[.43,-.1],[.07,-.06]],fill:'#d7ba8280'},{pts:[[.07,-.06],[.43,-.1],[.33,.31],[.08,.44]],fill:'#293f4870'},{pts:[[-.43,.09],[-.18,.09],[.08,.44],[-.26,.34]],fill:'#4e514b88'}];
    for(const facet of facets){polygon(facet.pts);ctx.fillStyle=facet.fill;ctx.fill();}
    ctx.beginPath();ctx.moveTo(-.29,-.32);ctx.lineTo(-.18,.09);ctx.lineTo(.08,.44);ctx.moveTo(.07,-.06);ctx.lineTo(.26,-.34);ctx.moveTo(.07,-.06);ctx.lineTo(.33,.31);ctx.strokeStyle='#f9e9c788';ctx.lineWidth=.012;ctx.stroke();
    ctx.beginPath();ctx.moveTo(-.24,.25);ctx.lineTo(-.06,.10);ctx.lineTo(.08,.19);ctx.lineTo(.24,-.04);ctx.strokeStyle='#fff1c9b8';ctx.lineWidth=.025;ctx.lineCap='round';ctx.stroke();
    ctx.beginPath();ctx.arc(-.18,-.18,.022,0,Math.PI*2);ctx.arc(.18,.27,.017,0,Math.PI*2);ctx.fillStyle='#fff5cf';ctx.fill();
  }else{
    const leaf=()=>{ctx.beginPath();ctx.moveTo(-.4,.38);ctx.bezierCurveTo(-.37,-.08,-.02,-.47,.41,-.45);ctx.bezierCurveTo(.43,-.02,.1,.32,-.4,.38);ctx.closePath();};
    leaf();const base=ctx.createLinearGradient(-.32,.36,.36,-.43);base.addColorStop(0,'#246c65');base.addColorStop(.3,'#51b88c');base.addColorStop(.69,'#a4efb4');base.addColorStop(1,'#f1ffe2');ctx.fillStyle=base;ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
    leaf();ctx.strokeStyle='#d9ffe0';ctx.lineWidth=.023;ctx.stroke();
    ctx.beginPath();ctx.moveTo(-.37,.35);ctx.quadraticCurveTo(-.02,-.03,.36,-.4);ctx.strokeStyle='#ecffe8';ctx.lineWidth=.035;ctx.lineCap='round';ctx.stroke();
    ctx.strokeStyle='#d7ffe39c';ctx.lineWidth=.014;for(const [a,b,c,d] of [[-.23,.2,-.28,-.03],[-.1,.08,-.06,-.19],[.07,-.1,.19,-.29],[.03,-.06,.25,.04],[-.16,.14,.03,.25]]){ctx.beginPath();ctx.moveTo(a,b);ctx.quadraticCurveTo((a+c)*.5,(b+d)*.5,c,d);ctx.stroke();}
    ctx.beginPath();ctx.arc(-.35,-.07,.20,-1.7,.22);ctx.moveTo(.23+Math.cos(1.4)*.17,.21+Math.sin(1.4)*.17);ctx.arc(.23,.21,.17,1.4,3.1);ctx.strokeStyle=`rgba(192,255,228,${glimmer*.65})`;ctx.lineWidth=.025;ctx.stroke();
  }
  ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  if(g.crystal){ctx.save();ctx.translate(.24,.22);ctx.fillStyle='#fff8d7';ctx.beginPath();for(let n=0;n<8;n++){const a=n*Math.PI/4-Math.PI/2,r=n%2?.035:.10;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.fill();ctx.restore();}
  if(g.special){
    const pulse=.5+.5*Math.sin(now/160+g.id);ctx.strokeStyle=g.special==='bomb'?'#ff9966':g.special==='nova'?'#f3bbff':'#e3fff2';ctx.lineWidth=.035+.012*pulse;ctx.beginPath();ctx.arc(0,0,.38+.025*pulse,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle='#fff9d2';ctx.lineWidth=.035;ctx.beginPath();
    if(g.special==='row'||g.special==='cross'){ctx.moveTo(-.34,0);ctx.lineTo(.34,0);ctx.moveTo(-.25,-.05);ctx.lineTo(-.34,0);ctx.lineTo(-.25,.05);ctx.moveTo(.25,-.05);ctx.lineTo(.34,0);ctx.lineTo(.25,.05);}
    if(g.special==='col'||g.special==='cross'){ctx.moveTo(0,-.34);ctx.lineTo(0,.34);}
    if(g.special==='bomb'){ctx.arc(0,0,.18,0,Math.PI*2);ctx.moveTo(-.12,-.12);ctx.lineTo(.12,.12);ctx.moveTo(.12,-.12);ctx.lineTo(-.12,.12);}
    if(g.special==='nova'){for(let a=0;a<10;a++){const r=a%2?.11:.25;ctx.lineTo(Math.cos(a*Math.PI/5-Math.PI/2)*r,Math.sin(a*Math.PI/5-Math.PI/2)*r);}ctx.closePath();}
    ctx.stroke();
  }
  ctx.restore();
}
function drawGem(g,x,y,scale=1,alpha=1,now=0){if(g.color>=6)return drawRealmGem(g,x,y,scale,alpha,now);const p=PALETTE[g.color],points=shapes[g.color];ctx.save();ctx.translate(x,y);ctx.scale(cell*scale,cell*scale);ctx.globalAlpha=alpha;ctx.fillStyle='rgba(0,0,0,0.3)';ctx.translate(0,.038);polygon(points);ctx.fill();ctx.translate(0,-.038);const base=ctx.createLinearGradient(-.3,-.4,.2,.4);base.addColorStop(0,p[0]);base.addColorStop(.23,p[1]);base.addColorStop(.75,p[2]);base.addColorStop(1,p[3]);ctx.fillStyle=base;ctx.fill();
const inner=points.map(([a,b])=>[a*.62,b*.62]);for(let j=0;j<points.length;j++){const k=(j+1)%points.length;ctx.beginPath();ctx.moveTo(...points[j]);ctx.lineTo(...points[k]);ctx.lineTo(...inner[k]);ctx.lineTo(...inner[j]);ctx.closePath();ctx.fillStyle=j<2?'#ffffff58':j<4?'#0000002e':'#ffffff18';ctx.fill();ctx.beginPath();ctx.moveTo(...inner[j]);ctx.lineTo(...inner[k]);ctx.lineTo(-.055,-.075);ctx.closePath();ctx.fillStyle=j%3===0?'#ffffff20':j%3===1?'#00000018':'#ffffff07';ctx.fill();}
polygon(points);ctx.strokeStyle=p[0]+'a8';ctx.lineWidth=.014;ctx.stroke();polygon(inner);ctx.strokeStyle='#ffffff25';ctx.lineWidth=.01;ctx.stroke();ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]+.015);ctx.lineTo(points[1][0],points[1][1]+.015);ctx.strokeStyle='#ffffffcc';ctx.lineWidth=.018;ctx.stroke();
ctx.globalAlpha=alpha*.48;ctx.strokeStyle='#eafff5';ctx.lineWidth=.016;ctx.beginPath();if(g.color===0){ctx.moveTo(0,-.13);ctx.lineTo(.11,0);ctx.lineTo(0,.13);ctx.lineTo(-.11,0);ctx.closePath();ctx.moveTo(0,-.07);ctx.lineTo(0,.07);}if(g.color===1){ctx.moveTo(-.08,.08);ctx.lineTo(0,-.12);ctx.lineTo(.08,.08);ctx.lineTo(-.08,.08);}if(g.color===2){ctx.arc(0,0,.1,0,Math.PI*2);ctx.moveTo(0,-.16);ctx.lineTo(0,.16);ctx.moveTo(-.16,0);ctx.lineTo(.16,0);}if(g.color===3){ctx.arc(0,0,.08,0,Math.PI*2);for(let a=0;a<8;a++){ctx.moveTo(Math.cos(a*Math.PI/4)*.12,Math.sin(a*Math.PI/4)*.12);ctx.lineTo(Math.cos(a*Math.PI/4)*.17,Math.sin(a*Math.PI/4)*.17);}}if(g.color===4){ctx.moveTo(-.07,-.12);ctx.quadraticCurveTo(.13,0,-.07,.12);ctx.quadraticCurveTo(.03,0,-.07,-.12);}if(g.color===5){ctx.moveTo(-.13,.06);ctx.lineTo(0,-.14);ctx.lineTo(.13,.06);ctx.moveTo(-.09,.01);ctx.lineTo(0,.15);ctx.lineTo(.09,.01);}ctx.stroke();ctx.globalAlpha=alpha;
const glint=.3+.45*Math.sin(now/1000+g.id*2);ctx.fillStyle=`rgba(255,255,255,${glint})`;ctx.beginPath();ctx.ellipse(-.15,-.23,.065,.018,-.7,0,Math.PI*2);ctx.fill();
if(g.crystal){ctx.save();ctx.translate(.22,.21);ctx.fillStyle='#f4ffdf';ctx.beginPath();for(let n=0;n<8;n++){const a=n*Math.PI/4-Math.PI/2,rad=n%2?.035:.10;ctx.lineTo(Math.cos(a)*rad,Math.sin(a)*rad);}ctx.closePath();ctx.fill();ctx.restore();}
if(g.special){
  const pulse=.5+.5*Math.sin(now/160+g.id);
  ctx.save();
  ctx.strokeStyle=g.special==='bomb'?'#ff9966':g.special==='nova'?'#f3bbff':'#aae8ff';
  ctx.lineWidth=.035+.012*pulse;
  ctx.beginPath();
  ctx.arc(0,0,.36+.04*pulse,0,Math.PI*2);
  ctx.stroke();
  ctx.restore();
  ctx.strokeStyle='#fff9d2';ctx.fillStyle='#fff9d2';ctx.lineWidth=.035;ctx.beginPath();
  if(g.special==='row'||g.special==='cross'){ctx.moveTo(-.34,0);ctx.lineTo(.34,0);ctx.moveTo(-.25,-.05);ctx.lineTo(-.34,0);ctx.lineTo(-.25,.05);ctx.moveTo(.25,-.05);ctx.lineTo(.34,0);ctx.lineTo(.25,.05);}
  if(g.special==='col'||g.special==='cross'){ctx.moveTo(0,-.34);ctx.lineTo(0,.34);}
  if(g.special==='bomb'){ctx.arc(0,0,.18,0,Math.PI*2);ctx.moveTo(-.12,-.12);ctx.lineTo(.12,.12);ctx.moveTo(.12,-.12);ctx.lineTo(-.12,.12);}
  if(g.special==='nova'){for(let a=0;a<10;a++){const r=a%2?.11:.25;ctx.lineTo(Math.cos(a*Math.PI/5-Math.PI/2)*r,Math.sin(a*Math.PI/5-Math.PI/2)*r);}ctx.closePath();}
  ctx.stroke();
}ctx.restore();}
function burst(i,color,count=10){const isMob=typeof window!=='undefined'&&(matchMedia('(max-width:768px)').matches||('ontouchstart' in window));if(reduced||isMob)count=Math.min(count,4);const x=i%8+.5,y=Math.floor(i/8)+.5;const maxParts=isMob?120:450;for(let k=0;k<count&&particles.length<maxParts;k++){const a=Math.random()*Math.PI*2,v=.6+Math.random()*2.4;particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1,life:.4+Math.random()*.4,max:1,size:.025+Math.random()*.04,color:PALETTE[color][k%2],rot:Math.random()*6});}}
function shatterGem(i,color,centerIndex=-1,kind=''){
  const isMob=typeof window!=='undefined'&&(matchMedia('(max-width:768px)').matches||('ontouchstart' in window));
  const gx=(i%8)+.5,gy=Math.floor(i/8)+.5;
  const cx=centerIndex>=0?(centerIndex%8)+.5:gx;
  const cy=centerIndex>=0?Math.floor(centerIndex/8)+.5:gy;
  let dx=gx-cx,dy=gy-cy;
  const dist=Math.hypot(dx,dy);
  if(dist<0.01){dx=(Math.random()-.5)*.5;dy=-1;}else{dx/=dist;dy/=dist;}
  const shardCount=isMob?5:8;
  let pal=PALETTE[color]||PALETTE[1];
  let edgeCol=null;
  const isWater=kind==='water'||currentCastColor===6;
  const isEarth=kind==='earth'||currentCastColor===7;
  const isWind=kind==='wind'||currentCastColor===8;
  if(isWater){
    pal=['#e0f7fa','#00e5ff','#0288d1'];
    edgeCol='#ffffff';
  }else if(isEarth){
    pal=['#fff8e1','#f59e0b','#78350f'];
    edgeCol='#fde68a';
  }else if(isWind){
    pal=['#ecfdf5','#10b981','#065f46'];
    edgeCol='#a7f3d0';
  }
  for(let k=0;k<shardCount&&gemShards.length<180;k++){
    const spread=(Math.random()-.5)*1.4;
    const speed=2.2+Math.random()*4.2;
    const angle=Math.atan2(dy,dx)+spread;
    gemShards.push({
      x:gx,y:gy,
      vx:Math.cos(angle)*speed,
      vy:Math.sin(angle)*speed-(1.2+Math.random()*2.0),
      rot:Math.random()*Math.PI*2,
      vrot:(Math.random()-.5)*14,
      size:0.07+Math.random()*0.09,
      life:0.6+Math.random()*0.35,
      color:pal[k%3],
      edgeColor:edgeCol||(k%2===0?'#ffffff':'#ffe57f'),
      isEmber:false
    });
  }
  for(let k=0;k<3&&gemShards.length<180;k++){
    const ang=Math.random()*Math.PI*2,spd=1.5+Math.random()*3.0;
    const col=isWater?(k===0?'#ffffff':'#38bdf8'):isEarth?(k===0?'#fde68a':'#d97706'):isWind?(k===0?'#ffffff':'#34d399'):(k===0?'#ffffff':k===1?'#ffea00':'#ff3d00');
    gemShards.push({
      x:gx,y:gy,
      vx:Math.cos(ang)*spd,
      vy:Math.sin(ang)*spd-1.5,
      rot:0,vrot:0,size:0.035,
      life:0.45+Math.random()*0.3,
      color:col,
      isEmber:true
    });
  }
}
function ring(x,y,color,max=2){rings.push({x,y,color,max,r:.1,life:1.2,maxLife:1.2});}
function beam(a,b,color){
  const points=[],x1=a%8+.5,y1=Math.floor(a/8)+.5,x2=b%8+.5,y2=Math.floor(b/8)+.5;
  for(let n=0;n<=16;n++){
    const t=n/16;
    points.push([x1+(x2-x1)*t+(n&&n<16?(Math.random()-.5)*.35:0),y1+(y2-y1)*t+(n&&n<16?(Math.random()-.5)*.35:0)]);
  }
  beams.push({points,color,life:1.2,maxLife:1.2});
}
function draw(now,dt){ctx.clearRect(0,0,boardSize,boardSize);const bg=ctx.createLinearGradient(0,0,boardSize,boardSize);bg.addColorStop(0,'#0c292e');bg.addColorStop(1,'#05191f');ctx.fillStyle=bg;ctx.fillRect(0,0,boardSize,boardSize);for(let i=0;i<64;i++){const x=i%8*cell,y=Math.floor(i/8)*cell;ctx.fillStyle=(Math.floor(i/8)+i%8)%2?'#183c3e44':'#03161c60';ctx.fillRect(x+1,y+1,cell-2,cell-2);ctx.strokeStyle='#a2bfa512';ctx.lineWidth=.5;ctx.strokeRect(x+.5,y+.5,cell-1,cell-1);if(sealState[i]>0){ctx.fillStyle=sealState[i]>1?'#80612b8a':'#b690353e';ctx.fillRect(x+2,y+2,cell-4,cell-4);ctx.strokeStyle='#e6c46ca8';ctx.lineWidth=sealState[i]>1?2:1;ctx.strokeRect(x+4,y+4,cell-8,cell-8);for(let n=0;n<sealState[i];n++){ctx.fillStyle='#f8d17b';ctx.fillRect(x+cell/2+(n-(sealState[i]-1)/2)*7-2,y+cell-6,4,3);}}}
const hintOn=hintUntil>now||(now-lastAction>18000&&started&&!busy&&!activePower);if(hintOn&&!hint.length)hint=findMove(board,totemChain.color)||[];for(const i of (selected>=0?[selected]:hintOn?hint:[])){const x=i%8*cell,y=Math.floor(i/8)*cell;ctx.save();ctx.strokeStyle=selected===i?'#ffdf91':`rgba(208,243,193,${.45+.35*Math.sin(now/200)})`;ctx.lineWidth=2.5;ctx.beginPath();ctx.roundRect(x+3,y+3,cell-6,cell-6,8);ctx.stroke();ctx.restore();}
board.forEach((g,i)=>{if(!g)return;const speed=Math.min(1,dt*19);g.x+=(g.tx-g.x)*speed;g.y+=(g.ty-g.y)*speed;const hovered=selected===i;drawGem(g,(g.x+.5)*cell,(g.y+.5)*cell,hovered?1.07:1,1,now);});
for(const g of ghosts){
  if(g.fireBurst){
    g.life-=dt*3.2;
    const t=1-Math.max(0,g.life);
    ctx.save();
    ctx.translate((g.g.x+.5)*cell,(g.g.y+.5)*cell);
    ctx.globalCompositeOperation='lighter';
    const scale=1+t*.45;
    ctx.scale(scale,scale);
    ctx.globalAlpha=Math.max(0,g.life);
    drawGem(g.g,0,0,1,Math.max(0,g.life),now);
    ctx.strokeStyle='#ffffff';
    ctx.lineWidth=2.0;
    ctx.beginPath();
    ctx.moveTo(-cell*.25,-cell*.2);
    ctx.lineTo(0,cell*.08);
    ctx.lineTo(cell*.25,-cell*.22);
    ctx.moveTo(0,cell*.08);
    ctx.lineTo(cell*.12,cell*.28);
    ctx.stroke();
    ctx.fillStyle=t<.35?'#ffffff':'#ff4900';
    ctx.beginPath();
    ctx.arc(0,0,cell*.38*t,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
  }else if(g.waterBurst){
    g.life-=dt*3.4;
    const t=1-Math.max(0,g.life);
    ctx.save();
    ctx.translate((g.g.x+.5)*cell,(g.g.y+.5)*cell);
    ctx.globalCompositeOperation='lighter';
    const scale=1+t*.4;
    ctx.scale(scale,scale);
    ctx.globalAlpha=Math.max(0,g.life);
    drawGem(g.g,0,0,1,Math.max(0,g.life),now);
    ctx.strokeStyle='#00e5ff';
    ctx.lineWidth=2.5*(1-t);
    ctx.beginPath();
    ctx.arc(0,0,cell*(.2+t*.5),0,Math.PI*2);
    ctx.stroke();
    ctx.fillStyle='#ffffff';
    ctx.beginPath();
    for(let d=0;d<4;d++){
      const ang=d*Math.PI/2+t*3.2;
      ctx.arc(Math.cos(ang)*cell*.36*t,Math.sin(ang)*cell*.36*t,Math.max(0.1,cell*.035*(1-t)),0,Math.PI*2);
    }
    ctx.fill();
    ctx.restore();
  }else if(g.earthBurst){
    g.life-=dt*3.4;
    const t=1-Math.max(0,g.life);
    ctx.save();
    ctx.translate((g.g.x+.5)*cell,(g.g.y+.5)*cell);
    ctx.globalCompositeOperation='lighter';
    const scale=1+t*.35;
    ctx.scale(scale,scale);
    ctx.globalAlpha=Math.max(0,g.life);
    drawGem(g.g,0,0,1,Math.max(0,g.life),now);
    ctx.strokeStyle='#ffd54f';
    ctx.lineWidth=2.2*(1-t);
    ctx.beginPath();
    ctx.moveTo(-cell*.3,0);ctx.lineTo(-cell*.05,cell*.15);ctx.lineTo(cell*.1,-cell*.2);ctx.lineTo(cell*.32,cell*.05);
    ctx.stroke();
    ctx.fillStyle='#d97706';
    ctx.fillRect(-cell*.2*t,-cell*.2*t,Math.max(0.1,cell*.1*(1-t)),Math.max(0.1,cell*.1*(1-t)));
    ctx.fillRect(cell*.15*t,cell*.15*t,Math.max(0.1,cell*.1*(1-t)),Math.max(0.1,cell*.1*(1-t)));
    ctx.restore();
  }else if(g.windBurst){
    g.life-=dt*3.8;
    const t=1-Math.max(0,g.life);
    ctx.save();
    ctx.translate((g.g.x+.5)*cell,(g.g.y+.5)*cell);
    ctx.globalCompositeOperation='lighter';
    const scale=1+t*.45;
    ctx.scale(scale,scale);
    ctx.globalAlpha=Math.max(0,g.life);
    drawGem(g.g,0,0,1,Math.max(0,g.life),now);
    ctx.strokeStyle='#10b981';
    ctx.lineWidth=2.5*(1-t);
    ctx.beginPath();
    ctx.moveTo(-cell*.4,-cell*.4);ctx.lineTo(cell*.4,cell*.4);
    ctx.moveTo(cell*.35,-cell*.35);ctx.lineTo(-cell*.35,cell*.35);
    ctx.stroke();
    ctx.strokeStyle='#ffffff';
    ctx.lineWidth=1.2;
    ctx.stroke();
    ctx.restore();
  }else{
    g.life-=dt*4.5;
    drawGem(g.g,(g.g.x+.5)*cell,(g.g.y+.5)*cell,1+(1-g.life)*.45,Math.max(0,g.life),now);
  }
}
ghosts=ghosts.filter(g=>g.life>0);
ctx.save();ctx.globalCompositeOperation='lighter';
for(const ring of rings){
  ring.r+=(ring.max-ring.r)*dt*4.2;
  ring.life-=dt*0.95;
  ctx.strokeStyle=ring.color;
  ctx.globalAlpha=Math.max(0,ring.life)*.8;
  ctx.lineWidth=3*ring.life;
  ctx.beginPath();ctx.arc(ring.x*cell,ring.y*cell,ring.r*cell,0,Math.PI*2);ctx.stroke();
  if(ring.r>.55){
    ctx.lineWidth=1.5*ring.life;
    ctx.beginPath();ctx.arc(ring.x*cell,ring.y*cell,ring.r*cell*.6,0,Math.PI*2);ctx.stroke();
  }
}
rings=rings.filter(r=>r.life>0);
for(const b of beams){
  b.life-=dt*1.05;
  const progress=Math.max(0,b.life/(b.maxLife||1));
  ctx.globalAlpha=Math.max(0,b.life);
  ctx.strokeStyle=b.color;
  ctx.lineWidth=8*progress;
  ctx.beginPath();
  b.points.forEach(([x,y],i)=>i?ctx.lineTo(x*cell,y*cell):ctx.moveTo(x*cell,y*cell));
  ctx.stroke();
  ctx.strokeStyle='#ffffff';
  ctx.lineWidth=2.5*progress;
  ctx.stroke();
}
beams=beams.filter(b=>b.life>0);
for(const s of gemShards){
  s.life-=dt*1.5;
  s.x+=s.vx*dt;
  s.y+=s.vy*dt;
  s.vy+=6.5*dt;
  s.rot+=s.vrot*dt;
  const a=Math.max(0,s.life);
  ctx.save();
  ctx.translate(s.x*cell,s.y*cell);
  ctx.rotate(s.rot);
  ctx.globalAlpha=a;
  if(s.isEmber){
    ctx.fillStyle=s.color;
    ctx.beginPath();
    ctx.arc(0,0,s.size*cell,0,Math.PI*2);
    ctx.fill();
  }else{
    const sz=s.size*cell;
    ctx.fillStyle=s.color;
    ctx.strokeStyle=s.edgeColor;
    ctx.lineWidth=1.1;
    ctx.beginPath();
    ctx.moveTo(-sz*0.6,0);
    ctx.lineTo(sz*0.25,-sz*0.75);
    ctx.lineTo(sz*0.75,sz*0.25);
    ctx.lineTo(-sz*0.15,sz*0.65);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}
gemShards=gemShards.filter(s=>s.life>0);
for(const p of particles){p.life-=dt*.85;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=3.0*dt;p.rot+=dt*5;ctx.save();ctx.translate(p.x*cell,p.y*cell);ctx.rotate(p.rot);ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=p.color;ctx.fillRect(-p.size*cell/2,-p.size*cell/2,p.size*cell,p.size*cell);ctx.restore();}particles=particles.filter(p=>p.life>0);ctx.restore();for(const f of floats){f.life-=dt;f.y-=dt*.65;ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,f.life*2));ctx.textAlign='center';ctx.font=`600 ${cell*.34}px Georgia`;ctx.fillStyle=f.color;ctx.shadowColor='#02161b';ctx.shadowBlur=5;ctx.fillText(f.text,f.x*cell,f.y*cell);ctx.restore();}floats=floats.filter(f=>f.life>0);
fx.draw(now,dt);if(paused){ctx.fillStyle='#031c2477';ctx.fillRect(0,0,boardSize,boardSize);}}
const isMobileDevice=typeof window!=='undefined'&&(matchMedia('(max-width:768px)').matches||('ontouchstart' in window)||navigator.maxTouchPoints>0);
const atm=$('#atmosphere'),ac=atm.getContext('2d');let aw=0,ah=0,ambient=Array.from({length:isMobileDevice?12:22},()=>({x:Math.random(),y:Math.random(),s:.4+Math.random()*1.6,speed:.01+Math.random()*.02,phase:Math.random()*6}));
function atmosphere(now,dt){
  if(aw!==innerWidth||ah!==innerHeight){
    aw=innerWidth;ah=innerHeight;
    const scale=isMobileDevice?0.5:1;
    atm.width=Math.max(1,Math.round(aw*scale));
    atm.height=Math.max(1,Math.round(ah*scale));
  }
  ac.clearRect(0,0,atm.width,atm.height);
  if(reduced)return;
  const sx=atm.width/aw,sy=atm.height/ah;
  for(const p of ambient){
    p.y-=dt*p.speed;
    if(p.y<0){p.y=1;p.x=Math.random();}
    const a=.15+.35*(.5+.5*Math.sin(now/1400+p.phase));
    ac.fillStyle=`rgba(234,198,112,${a})`;
    ac.beginPath();
    ac.arc((p.x*aw+Math.sin(now/3000+p.phase)*15)*sx,p.y*ah*sy,p.s*(isMobileDevice?1.4:1),0,Math.PI*2);
    ac.fill();
  }
}
let uiTick=0,lastRenderTime=0;
function tick(now){
  requestAnimationFrame(tick);
  if(now-lastRenderTime<16.2)return;
  const elapsed=Math.min((now-(lastTick||now))/1000,.15);
  lastTick=now;lastRenderTime=now;const dt=elapsed||.016;
  if(running&&!paused&&!ended){
    if(frozen>0){frozen=Math.max(0,frozen-elapsed);if(!frozen)frame.classList.remove('frozen-board');}
    else if(level<=100&&mode!=='zen'&&now>=impactUntil){time=Math.max(0,time-elapsed);}
    if(level>100&&!busy&&!swapping&&realmBattle?.phase==='playing'){
      realmCounterElapsed+=elapsed;
      if(realmCounterElapsed>=REALM_COUNTER_TICK){realmCounterElapsed-=REALM_COUNTER_TICK;combatCounterEvent(realmCounter(stage,realmBattle,realmSave));}
    }
    if(now>frenzyUntil&&frenzy>0&&now-lastAction>2500)frenzy=Math.max(0,frenzy-elapsed*1.8);
    if((busy||swapping)&&now-lastAction>2200&&activeCascades===0&&!finishing){busy=false;swapping=false;frame.setAttribute('aria-busy','false');checkEnd();}
    if(budgetEmpty()){
      const standardWin=currentGoals().every(g=>g.done);
      const stars=evaluateStageStars(stage,{...metrics,score,crystals},0);
      if(busy)finishAfterBusy=true;
      else finish(standardWin||stars>=1);
    }
  }
  const titleActive=!$('#titleScreen')?.classList.contains('hide');
  if(!document.hidden){
    if(!titleActive){
      draw(now,dt);
    }
    atmosphere(now,dt);
  }
  uiTick+=dt;
  if(uiTick>.2){
    if(running&&!paused&&!ended){
      $('#timer').textContent=level>100||mode==='zen'?'∞':`${Math.floor(Math.ceil(Math.max(0,time))/60)}:${String(Math.ceil(Math.max(0,time))%60).padStart(2,'0')}`;
      if(level>100)updateRealmCounterLabel();
      const isFrenzy=performance.now()<frenzyUntil;
      document.body.classList.toggle('is-frenzy',isFrenzy);
      $('#frenzyFill').style.width=`${isFrenzy?Math.max(0,(frenzyUntil-performance.now())/100):frenzy}%`;
    }
    uiTick=0;
  }
}
initStage();renderTotems();syncPositions(true);time=objectives(level).time??50;update();requestAnimationFrame(tick);

function updateTotemUI(){const col=totemChain.color,count=totemChain.count;$$('[data-totem]').forEach(el=>{const i=+el.dataset.totem,available=totemUnlocked(i),armed=available&&col===i&&count>=1,casting=totemFlash===i&&performance.now()<totemFlashUntil;el.classList.toggle('locked',!available);el.classList.toggle('armed',armed);el.classList.toggle('casting',casting);el.querySelector('.totem-level').textContent=available?'Lv.'+totemLevels[i]:'🔒';el.querySelector('.power-meter i').style.width=available?(col===i?(count>=2?'100%':'50%'):'0%'):'0%';el.querySelector('.power-state').textContent=!available?'🔒잠김':casting?'발동!':armed?(totemPower(i,totemLevels[i],count).multiplier>1?'×1.5':count>=2?'발동':'1/2'):'대기';});$('#powerInstruction').textContent=col>=0?colorNames[col]+' '+count+'연속 · '+(totemUnlocked(col)?(totemLevels[col]<2?'기본 위력 · Lv.2 강화 시 3연속 1.5배 해금':count>=3?'1.5배 각성 중! 같은 색을 이어가세요':count===2?'다음 같은 색은 1.5배 각성':'같은 색을 한 번 더 맞추세요'):TOTEMS[col].unlock+'단계에서 토템 해금'):'같은 색 2번째 매치부터 자동 발동';$('#boardHint').textContent=col>=0?colorNames[col]+' '+count+'연속 · 같은 색이면 토템 발동':'같은 색을 두 번 연속 맞춰보세요';$('#starWallet').textContent='★ '+magicStars;}
async function castTotem(color,index){
  const l=totemLevels[color],t=TOTEMS[color],p=totemPower(color,l,totemChain.count),boost=p.multiplier>1;
  totemFlash=color;totemFlashUntil=performance.now()+1800;totalTotemCasts++;metrics.totemCasts++;if(boost)metrics.overdrives++;
  frame.dataset.castMultiplier=p.multiplier;frame.dataset.castColor=color;
  impactUntil=performance.now()+(reduced?0:900);heavyCast=true;
  showCinematic(color,l,p.multiplier);announce(t.name+' · Lv.'+l,(boost?'위력 ×1.5 · ':'')+t.color+' '+totemChain.count+'연속',1450);director.power(color,p.multiplier);vibrate(boost?[55,35,100,30,75]:[40,35,80]);
  if(level>100)combatCast(color,index);
  let cells=[];const r=Math.floor(index/8),c=index%8;
  if(color===1){
    const baseCount=Math.max(2,Math.min(4,Math.floor(1.5+l*0.55)));
    const totalMeteors=boost?Math.min(5,baseCount+1):baseCount;
    const centers=fireTargets(l,lastFireTargets);
    while(centers.length<totalMeteors){
      const pool=Array.from({length:64},(_,i)=>i).filter(i=>!centers.includes(i));
      centers.push(pool[Math.floor(Math.random()*pool.length)]);
    }
    lastFireTargets=centers;
    frame.dataset.fireTargets=centers.join(',');
    const maxCellsByLevel=[0,8,12,16,20,24][l]||10;
    const maxAllowed=Math.min(26,Math.round(maxCellsByLevel*(boost?1.3:1)));

    const allDetonated=new Set();
    currentCastColor=1;
    for(const [k,center] of centers.slice(0,totalMeteors).entries()){
      const rr=Math.floor(center/8), cc=center%8;
      const cluster=[];
      for(let y=Math.max(0,rr-1);y<=Math.min(7,rr+1);y++)
        for(let x=Math.max(0,cc-1);x<=Math.min(7,cc+1);x++){
          const idx=y*8+x;
          if(!allDetonated.has(idx)&&allDetonated.size<maxAllowed){
            allDetonated.add(idx);
            cluster.push(idx);
          }
        }

      // 1. Launch hypersonic kinetic lance
      fx.meteor(k%2?7:0,center,t.accent,1.25*(boost?1.3:1),0);

      // 2. Wait for lance descent to impact the ground (~220ms)
      await wait(reduced?30:220);

      // 3. Ground impact recoil, sound & fiery blast ring
      heavyShake(1.9);
      director.bombDetonate();
      ring(cc+.5,rr+.5,'#ff4400',3.5);
      flash('#ff4411');

      // 4. Detonate gems into multi-faceted crystal shards & embers!
      const validCluster=cluster.filter(i=>board[i]);
      if(validCluster.length){
        for(const idx of validCluster){
          if(board[idx]){
            shatterGem(idx, board[idx].color, center);
          }
        }
        await clearCells(validCluster,new Map(),1);
      }
      update();
      await wait(reduced?20:90);
    }
    currentCastColor=-1;
    await settle();
    heavyCast=false;best=Math.max(best,score);update();
    return;
  }
  if(color===2){const shock=thunderTargets(l,totemChain.count,index);cells=shock.cells;frame.dataset.shockAnchor=index;frame.dataset.shockRadius=shock.radius;frame.dataset.shockTargets=cells.join(',');fx.storm(index,p.multiplier);fx.shockRange(index,shock.radius,t.accent);for(const hit of cells)if(hit!==index)fx.lightning(index,hit,t.accent,p.multiplier*.85);}
  if(color===0){const harvest=harvestTargets(board,l,totemChain.count);cells=harvest.collect;for(const i of cells)fx.siphon(i,index,t.accent,p.multiplier);harvest.create.forEach(i=>{board[i].crystal=true;ring(i%8+.5,Math.floor(i/8)+.5,t.accent,1.1);});fx.field(c+.5,r+.5,t.accent,p.multiplier,'jade');}
  if(color===3){const bonus=p.bonus*(performance.now()<frenzyUntil?3:1);score+=bonus;frenzy=Math.min(100,frenzy+p.energy);if(frenzy>=100){frenzy=0;frenzyUntil=performance.now()+(6000+l*500+(activeFeverBonus?3000:0));announce('SOLAR AWAKENING','황금 토템 · 점수 3배',1400);}floats.push({x:4,y:3,text:'+'+bonus,life:1.4,color:'#ffda82'});fx.field(c+.5,r+.5,t.accent,p.multiplier,'solar');}
  if(color===4){const gifts=lunarTargets(board,l,totemChain.count);metrics.specialsMade+=gifts.length;gifts.forEach(({index:i,special},k)=>{board[i].special=special;fx.meteor(index,i,t.accent,.75,k*.06,'gift');});fx.field(c+.5,r+.5,t.accent,p.multiplier,'lunar');}
  if(color===5){let text=level>100?'적의 반격 지연':'시간의 축복';if(level<=100&&mode!=='zen'){const next=extendTime(stage,time,p),gained=next-time;time=next;text='+'+gained.toFixed(1).replace('.0','')+'초';}if(p.stasis&&level<=100){frozen=Math.max(frozen,p.stasis);frame.classList.add('frozen-board');}floats.push({x:4,y:3,text,life:1.4,color:'#ffd7a1'});fx.field(4,4,t.accent,p.multiplier,'clock');}
  if(color===6){
    const reach=l>=4?3:2;
    currentCastColor=6;
    fx.field(c+.5,r+.5,t.accent,p.multiplier,'water');
    ring(c+.5,r+.5,t.accent,3.5);
    director.power(6,p.multiplier);
    heavyShake(1.3);
    flash('#38bdf8');
    const stages=[];
    const centerBatch=[r*8+c];
    if(boost){
      for(const y of [r-1,r+1])if(y>=0&&y<8)centerBatch.push(y*8+c);
    }
    stages.push(centerBatch);
    for(let step=1;step<=reach;step++){
      const stepBatch=[];
      for(const dx of [-step,step]){
        const x=c+dx;
        if(x>=0&&x<8)stepBatch.push(r*8+x);
      }
      if(stepBatch.length)stages.push(stepBatch);
    }
    for(const batch of stages){
      const valid=batch.filter(i=>board[i]);
      if(valid.length){
        for(const idx of valid){
          shatterGem(idx,board[idx].color,index,'water');
          const bx=idx%8+.5,by=Math.floor(idx/8)+.5;
          ring(bx,by,'#38bdf8',1.8);
          beam(index,idx,'#00e5ff');
        }
        await clearCells(valid,new Map(),1);
        update();
        await wait(reduced?15:55);
      }
    }
    currentCastColor=-1;
    await settle();
    heavyCast=false;best=Math.max(best,score);update();
    return;
  }
  if(color===7){
    currentCastColor=7;
    fx.field(c+.5,r+.5,t.accent,p.multiplier,'earth');
    director.bombDetonate();
    heavyShake(2.0);
    flash('#d97706');
    const maxReach=1+(l>=4?1:0);
    const tiers=new Map();
    for(let y=Math.max(0,r-maxReach);y<=Math.min(7,r+maxReach);y++){
      for(let x=Math.max(0,c-maxReach);x<=Math.min(7,c+maxReach);x++){
        const dist=Math.abs(y-r)+Math.abs(x-c);
        if(dist<=maxReach){
          const list=tiers.get(dist)||[];
          list.push(y*8+x);
          tiers.set(dist,list);
        }
      }
    }
    if(boost){
      const allTierCells=[...tiers.values()].flat();
      const amplified=amplifyCells(allTierCells,1.5,index);
      const extra=amplified.filter(i=>!allTierCells.includes(i));
      if(extra.length)tiers.set(maxReach+1,extra);
    }
    const sortedDists=[...tiers.keys()].sort((a,b)=>a-b);
    for(const dist of sortedDists){
      const batch=tiers.get(dist)||[];
      const valid=batch.filter(i=>board[i]);
      if(valid.length){
        for(const idx of valid){
          shatterGem(idx,board[idx].color,index,'earth');
          const bx=idx%8+.5,by=Math.floor(idx/8)+.5;
          ring(bx,by,'#f59e0b',2.2);
        }
        await clearCells(valid,new Map(),1);
        update();
        await wait(reduced?20:70);
      }
    }
    currentCastColor=-1;
    await settle();
    heavyCast=false;best=Math.max(best,score);update();
    return;
  }
  if(color===8){
    currentCastColor=8;
    fx.field(c+.5,r+.5,t.accent,p.multiplier,'wind');
    director.power(8,p.multiplier);
    heavyShake(1.4);
    flash('#10b981');
    const reach=l>=4?3:2;
    const steps=new Map();
    steps.set(0,[index]);
    for(let k=1;k<=reach;k++){
      const kBatch=[];
      for(const dx of [-k,k]){
        for(const dy of [-k,k]){
          const x=c+dx, y=r+dy;
          if(x>=0&&x<8&&y>=0&&y<8){
            const idx=y*8+x;
            if(!kBatch.includes(idx))kBatch.push(idx);
          }
        }
      }
      if(kBatch.length)steps.set(k,kBatch);
    }
    if(boost){
      const allDiag=[...steps.values()].flat();
      const amplified=amplifyCells(allDiag,1.5,index);
      const extra=amplified.filter(i=>!allDiag.includes(i));
      if(extra.length)steps.set(reach+1,extra);
    }
    const sortedSteps=[...steps.keys()].sort((a,b)=>a-b);
    for(const step of sortedSteps){
      const batch=steps.get(step)||[];
      const valid=batch.filter(i=>board[i]);
      if(valid.length){
        for(const idx of valid){
          shatterGem(idx,board[idx].color,index,'wind');
          const bx=idx%8+.5,by=Math.floor(idx/8)+.5;
          ring(bx,by,'#6ee7b7',1.9);
          beam(index,idx,'#34d399');
        }
        await clearCells(valid,new Map(),1);
        update();
        await wait(reduced?15:55);
      }
    }
    currentCastColor=-1;
    await settle();
    heavyCast=false;best=Math.max(best,score);update();
    return;
  }
  if(cells.length){
    update();
    await wait(reduced?20:300);
    const valid=[...new Set(cells)].filter(i=>board[i]);
    if(valid.length){await clearCells(valid,new Map(),1);await settle();}
  }else{
    update();
    accessBoard();
    await wait(reduced?15:90);
  }
  heavyCast=false;best=Math.max(best,score);update();
}

function openUpgrades(focus=-1){
  if(level>100){openRealmShop();return;}
  if(busy){toast('연쇄가 끝난 뒤 기술 성소를 열 수 있어요.');return;}
  if(running)pauseClock();
  const nextTarget=TOTEMS.slice(0,6).map((t,i)=>({t,i,l:totemLevels[i]})).find(x=>x.l===0);
  const nextNeed=nextTarget?Math.max(0,nextTarget.t.unlockCost-magicStars):0;
  
  showModal(`
    <div class="modal-kicker">ANCIENT TECH RESEARCH SANCTUARY</div>
    <h2>사원의 기술 성소 · 토템 강화 & 각성</h2>
    <div class="wallet-title">★ ${magicStars} <small>보유 마법별 · 관문을 3성으로 클리어해 획득</small></div>
    ${totemLevels.slice(0,6).every(l=>l>=5)?`
      <div style="text-align:center;margin:-2px 0 12px;">
        <span style="font-size:11px;color:#ffe57f;background:linear-gradient(135deg,#362406,#4a3206);border:1.5px solid #ffd54f;padding:7px 16px;border-radius:20px;display:inline-block;box-shadow:0 0 15px rgba(255,213,79,0.35);">
          ☀️ <b>[신의 축복]</b> 100관문 정복 완료 · 6대 수호 토템 모두 <b>궁극 레벨 (Lv.5 MAX)</b> 달성!
        </span>
      </div>
    `:(nextTarget?`<div style="text-align:center;margin:-2px 0 12px;"><span style="font-size:11px;color:#f0dcab;background:#103438cc;border:1px solid #d4b56844;padding:6px 14px;border-radius:20px;display:inline-block;">🎯 다음 미해금 기술: <b>[${nextTarget.t.name}]</b> 해금까지 <b>★ ${nextNeed}개</b> 필요</span></div>`:'')}
    <div class="upgrade-list">
      ${TOTEMS.slice(0,6).map((t,i)=>{
        const l=totemLevels[i],isLocked=l===0,status=canUpgradeTotem(i,l,level,totemLevels,magicStars),prereq=upgradePrerequisite(i,l+1),spec=totemLevelSpecs(i,l);
        let btnText='',btnDisabled=false,btnStyle='';
        if(status.isMax){
          btnText='최고 레벨 달성 (MAX)';btnDisabled=true;
        }else if(status.lockedByCondition){
          btnText='🔒 조건 미충족 (자격 조건 확인)';btnDisabled=true;
        }else if(status.lockedByCost){
          btnText=`★${status.cost} 마법별 부족 (현재 ★${magicStars})`;btnDisabled=true;
        }else if(status.ok){
          btnText=isLocked?`★${status.cost} 즉시 해금하기!`:`★${status.cost} 레벨업 강화하기!`;
          btnStyle='background:linear-gradient(120deg,#f3d289,#d69e46);color:#0a1c20;font-weight:700;box-shadow:0 0 15px #f3d28988;border:1px solid #ffe699;';
        }
        return `
          <div class="upgrade-row ${focus===i?'focused':''} ${isLocked?'locked-row':''}" style="--accent:${t.accent}">
            <div class="upgrade-card-header">
              <span class="upgrade-symbol totem-art" style="background-position:${(i%3)*50}% ${Math.floor(i/3)*100}%">
                ${isLocked?'<i class="lock-icon" style="display:grid;place-items:center;height:100%;font-size:18px;">🔒</i>':''}
              </span>
              <div class="upgrade-card-title-group">
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                  <span class="upgrade-priority-tag" style="background:#092d2b;border:1px solid #6ee2ae44;color:#a3eed1;font-size:9.5px;padding:2px 7px;border-radius:6px;">${t.roleTag||'토템'}</span>
                  <b style="font-size:13px;margin:0;color:#fff;">${t.name}</b>
                  <span style="color:${isLocked?'#88a096':t.accent};font-size:11px;font-weight:bold;">${isLocked?'🔒 잠김':'Lv.'+l}</span>
                </div>
                <span class="level-pips">${Array.from({length:5},(_,n)=>`<i class="${n<l?'filled':''}"></i>`).join('')}</span>
              </div>
            </div>

            <div class="upgrade-spec-box">
              ${isLocked
                ? `<span class="cur-val" style="color:#e57373;"><b>현재 상태:</b> 잠김 (기술 미보유 · 발동 불가)</span><span class="next-val"><b>해금 시:</b> ${spec.next} (${t.desc})</span>`
                : l>=5
                ? `<span class="cur-val" style="color:#81c784;"><b>현재 [Lv.5 MAX]:</b> ${spec.cur}</span><span class="next-val" style="color:#ffd54f;">✨ 최고 레벨 궁극의 경지 달성 완료!</span>`
                : `<span class="cur-val"><b>현재 [Lv.${l}]:</b> ${spec.cur}</span><span class="next-val"><b>강화 시 [Lv.${l+1}]:</b> ${spec.next}</span>`
              }
              ${prereq&&!status.isMax?`<div class="upgrade-prereq-badge" style="font-size:10px;color:${status.lockedByCondition?'#ffb3ba':'#a4d4b9'};background:${status.lockedByCondition?'#40151a66':'#12362866'};padding:5px 8px;border-radius:4px;border:1px solid ${status.lockedByCondition?'#ff888844':'#52c79f44'};margin-top:4px;"><b>자격 조건:</b> ${prereq.desc}</div>`:''}
            </div>

            <button data-upgrade="${i}" class="upgrade-action-btn ${isLocked?'unlock-btn':''}" ${btnDisabled?'disabled':''} style="${btnStyle}">
              ${btnText}
            </button>
          </div>
        `;
      }).join('')}
    </div>
    <p class="upgrade-help" style="font-size:10px;line-height:1.6;color:#a8d1be;margin-top:10px;">
      💡 <b>균형 육성 법칙:</b> 특정 토템만 몰아서 육성할 수 없으며, 모든 토템을 골고루 강화해야 상위 단계로 각성합니다.<br>
      관문을 3성으로 클리어해 마법별을 획득하고 사원의 6대 원소를 조화롭게 연구하세요!
    </p>
    <button id="upgradeClose" class="primary-button">${ended?'다음 스테이지 준비 →':'탐험으로 돌아가기 →'}</button>
  `);
  
  $$('[data-upgrade]').forEach(b=>b.onclick=()=>{
    const i=+b.dataset.upgrade,l=totemLevels[i];
    const status=canUpgradeTotem(i,l,level,totemLevels,magicStars);
    if(!status.ok)return;
    magicStars-=status.cost;
    const wasLocked=(totemLevels[i]===0);
    totemLevels[i]++;
    persist();
    if(wasLocked){
      chord(12);flash('#ffe894');
      toast(`🎉 고대 기술 [${TOTEMS[i].name}] 해금 성공!`);
    }else{
      chord(5);
      toast(`✨ [${TOTEMS[i].name}] Lv.${totemLevels[i]} 강화 완료!`);
    }
    renderTotems();update();openUpgrades(i);
  });
  
  $('#upgradeClose').onclick=()=>{
    if(ended){
      if(level<STAGE_COUNT&&stageStars[level-1])level++;
      reset();
    }else resume();
  };
}
function openMap(chapter=chapterIndex(level)){
  if(level>100){openRealmMap();return;}
  if(busy){toast('연쇄가 끝난 뒤 지도를 열 수 있어요.');return;}
  if(running)pauseClock();
  const totalStars=stageStars.reduce((a,b)=>a+b,0);
  const rows=['left','center','right','right','center','left','left','center','right','center','left','center','right','right','center','left','left','center','right','center'];
  showModal(`
    <div class="map-dialog">
      <div class="map-header">
        <div class="map-kicker">100 EXPEDITIONS · 5 SACRED TEMPLES</div>
        <h2 class="map-title">${chapters[chapter][0]}</h2>
        <div class="map-stats-summary">
          <span>해금 관문 <b>${unlocked} / 100</b></span>
          <span>총 획득 별 <b>★ ${totalStars}</b></span>
          <span>보유 마법별 <b>★ ${magicStars}</b></span>
          ${(unlocked>=100||stageStars[99]>=1)?`<span style="color:#ffe082;background:#382708;padding:2px 8px;border-radius:10px;border:1px solid #ffd54f;">☀️ 신의 축복 활성</span>`:''}
        </div>
        <div class="map-tabs">
          ${chapters.slice(0,5).map((c,i)=>`<button data-chapter="${i}" class="${i===chapter?'active':''}">${String(i*20+1).padStart(2,'0')}–${((i+1)*20)}</button>`).join('')}
        </div>
      </div>
      <div class="map-path-container">
        <div class="map-winding-path">
          ${Array.from({length:20},(_,n)=>{
            const stageNum=chapter*20+n+1;
            const stars=stageStars[stageNum-1];
            const design=stageDesign(stageNum);
            const isBoss=design.type==='guardian';
            const isDone=stageNum<unlocked||(stageNum===unlocked&&stars>0);
            const isCurrent=stageNum===level;
            const isLocked=stageNum>unlocked;
            const posClass=rows[n];
            return `
              <div class="map-node-row ${posClass}">
                <button class="map-node ${isBoss?'boss-node ':''}${isDone?'done ':''}${isCurrent?'current ':''}${isLocked?'locked ':''}"
                        data-level="${stageNum}" ${isLocked?'disabled':''}
                        title="${design.name} · ${stars?stars+'별 달성':isLocked?'잠김':'도전 가능'}">
                  <span class="map-node-num">${isLocked?'🔒':String(stageNum).padStart(2,'0')}</span>
                  <span class="map-node-stars">${stars?'★'.repeat(stars):isDone?'✓':'도전'}</span>
                  <span class="map-node-label">${isCurrent?'★ 현재 위치':design.name}</span>
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      <div style="margin-top:16px;display:flex;justify-content:space-between;align-items:center;">
        <button id="mapUpgrade" class="text-button">토템 강화 <span>↗</span></button>
        <button id="mapClose" class="primary-button" style="width:auto;padding:12px 24px;">지도 닫기 →</button>
      </div>
    </div>
  `);
  $('#mapClose').onclick=resume;
  $('#mapUpgrade').onclick=()=>openUpgrades();
  $$('[data-chapter]').forEach(b=>b.onclick=()=>openMap(+b.dataset.chapter));
  $$('[data-level]').forEach(b=>b.onclick=()=>{
    const selectedLevel=+b.dataset.level;
    $('#modal').close();
    showScenarioBriefing(selectedLevel);
  });
}
$('#upgradeBtn').onclick=()=>openUpgrades();

function updateStageUI(){
  const goals=currentGoals();
  $('#stageName').textContent=stage.name;$('#stageTip').textContent=stage.tip;
  $('.score-motif').textContent=stage.type==='guardian'?'♜':stage.type==='bonus'?'◇':'✦';$('.score-motif').title=stage.name;
  const chips=goals.slice(2);$('#goalChips').innerHTML=chips.length?chips.map(g=>`<span data-goal="${g.id}" class="goal-chip ${g.done?'done':''}" ${g.color!==undefined?`style="--chip-color:${TOTEMS[g.color].accent}"`:''}>${g.done?'✓ ':''}${g.label} <b>${Math.min(g.value,g.target)}/${g.target}</b></span>`).join(''):`<span class="stage-caption">${stage.name} <small>점수와 수정을 모으세요</small></span>`;
  $('#boardFrame').classList.toggle('guardian-board',stage.type==='guardian');
  if(mode==='zen'){$('#timer').textContent='∞';$('#timerLabel').textContent='휴식 모드';}
  if(totemChain.count>=3&&totemLevels[totemChain.color]>=2&&totemUnlocked(totemChain.color))$('#boardHint').textContent=colorNames[totemChain.color]+' '+totemChain.count+'연속 · 위력 ×1.5';
  updateRealmUI();
}
function heavyShake(strength=1){if(reduced||performance.now()-lastHeavyShake<80)return;lastHeavyShake=performance.now();cameraAnimation?.cancel();const a=Math.min(14,5+strength*4);cameraAnimation=frame.animate([{transform:'translate(0,0) scale(1)'},{transform:`translate(${-a}px,${a*.4}px) scale(1.025)`},{transform:`translate(${a*.8}px,${-a*.5}px) scale(1.018)`},{transform:`translate(${-a*.5}px,${a*.2}px) scale(1.01)`},{transform:'translate(0,0) scale(1)'}],{duration:560,easing:'cubic-bezier(.15,.7,.25,1)'});}
function impactSound(strength=1){director.impact(strength,totemChain.color>=0?totemChain.color:1);}
function showCinematic(color,l,multiplier){clearTimeout(cinematicTimer);document.body.classList.toggle('overdrive',multiplier>1);cinematicTimer=setTimeout(()=>{document.body.classList.remove('overdrive');},reduced?600:1100);}

function showSoundSettings(){if(busy){toast('연쇄가 끝난 뒤 소리를 조절할 수 있어요.');return;}if(running)pauseClock();const s=director.settings;showModal(`<div class="modal-kicker">TEMPLE SOUNDSCAPES</div><h2>사운드 설정</h2><p class="audio-description">보석 공명 · 묵직한 토템 · 사원의 리듬</p><div class="settings-row"><span>사운드</span><button id="audioEnabled">${s.enabled?'켜짐':'꺼짐'}</button></div>${[['master','전체 음량'],['effects','효과음'],['music','배경음악']].map(([key,label])=>`<label class="audio-control" for="audio-${key}"><span>${label}</span><b id="audioValue-${key}">${Math.round(s[key]*100)}%</b><input id="audio-${key}" data-audio="${key}" type="range" min="0" max="100" value="${Math.round(s[key]*100)}"></label>`).join('')}<label class="audio-preview-label" for="audioPreviewTotem">들어볼 토템</label><select id="audioPreviewTotem" class="audio-preview-select">${TOTEMS.map((t,i)=>`<option value="${i}" ${i===1?'selected':''}>${t.name}</option>`).join('')}</select><button id="audioPreview" class="audio-preview">▶ 토템 사운드 들어보기</button><button id="audioClose" class="primary-button">탐험으로 돌아가기 →</button>`);$('#audioEnabled').onclick=e=>{sound=!director.settings.enabled;director.configure('enabled',sound);e.target.textContent=sound?'켜짐':'꺼짐';persist();update();};$$('[data-audio]').forEach(input=>input.oninput=e=>{const key=e.target.dataset.audio,value=+e.target.value;director.configure(key,value/100);$('#audioValue-'+key).textContent=value+'%';});$('#audioPreview').onclick=async()=>{if(!director.settings.enabled){sound=true;director.configure('enabled',true);$('#audioEnabled').textContent='켜짐';update();}await director.unlock();director.power(Number($('#audioPreviewTotem').value),1.5);};$('#audioClose').onclick=resume;}
$('#soundSettingsBtn').onclick=showSoundSettings;

function updateTitleUI(){
  const ci=chapterIndex(level);
  const totalStars=stageStars.reduce((a,b)=>a+b,0);
  $('#titleStageName').textContent=`STAGE ${String(level).padStart(2,'0')} · ${chapters[ci][0]}`;
  $('#titleStars').textContent=`★ ${totalStars}개 (보유 ★${magicStars})`;
  $('#titleContinueBtn').querySelector('span').textContent=`이어하기 (STAGE ${level})`;
  $('#titleNewGameBtn').hidden=level>100;
  $('#titleChestBtn').hidden=level>100||stageStars[99]<1;
}

function showTitleScreen(){
  if(running)pauseClock();
  updateTitleUI();
  $('#titleScreen').classList.remove('hide');
}

function hideTitleScreen(){
  $('#titleScreen').classList.add('hide');
}

function showScenarioBriefing(lvl=level){
  if(lvl>100){showRealmBriefing(lvl);return;}
  const sc=stageScenario(lvl);
  const st=stageDesign(lvl);
  const goals=stageGoals(st,{score:0,crystals:0,colorCollected:Array(6).fill(0),sealsBroken:0,bestCascade:0,specialsMade:0,totemCasts:0,overdrives:0});
  const criteria=stageStarCriteria(st);
  const chImg=sc.image||`assets/chapters/ch${sc.chapterIndex+1}.jpg`;

  const activeBuffs=[];
  if(fortuneBuffs.timeBonusStages>0)activeBuffs.push(`⏳ 크로노스의 가호 (제한시간 +20초 · ${fortuneBuffs.timeBonusStages}관문 잔여)`);
  if(fortuneBuffs.timePenaltyStages>0)activeBuffs.push(`⚠️ 모래시계 균열 (제한시간 -10초 · ${fortuneBuffs.timePenaltyStages}관문 잔여)`);
  if(fortuneBuffs.feverBonusStages>0)activeBuffs.push(`🔥 불타는 피버 (피버 지속시간 +3초 연장 · ${fortuneBuffs.feverBonusStages}관문 잔여)`);
  if(fortuneBuffs.hardSeals)activeBuffs.push(`🛡️ 굳어버린 봉인 (이번 관문 모든 봉인 내구도 +1)`);
  if(fortuneBuffs.extraSpecials)activeBuffs.push(`🌟 황금빛 서광 (시작 시 특수 보석 3개 자동 배치)`);

  showModal(`
    <div class="scenario-brief">
      <div class="scenario-art-frame">
        <img src="${chImg}" alt="${sc.title}" class="scenario-art-img" onerror="this.onerror=null;this.src='assets/chapters/ch${sc.chapterIndex+1}.jpg';">
        <div class="scenario-art-badge">STAGE ${String(lvl).padStart(2,'0')} · ${sc.chapterTitle}</div>
        <div class="scenario-art-overlay"></div>
      </div>
      <div class="scenario-kicker" style="margin-top:10px;">${sc.chapterSub} · 제${lvl}관문 탐험 브리핑</div>
      <h2 class="scenario-title">${sc.title}</h2>
      
      <div class="scenario-story">"${sc.story}"</div>

      ${activeBuffs.length?`
        <div class="scenario-fortune-banner" style="background:#09262b;border:1px solid #72d4b888;padding:7px 12px;border-radius:8px;margin:8px 0;font-size:10px;color:#a8e7d2;text-align:left;">
          <b style="color:#ffe49e;">🔮 활성화된 고대의 운명:</b><br>
          ${activeBuffs.map(b=>`<span>· ${b}</span><br>`).join('')}
        </div>
      `:''}

      <div class="scenario-goals">
        <b style="font-size:11px;color:#d5c095;margin-bottom:6px;display:block;">🎯 관문 돌파 필수 목표</b>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          ${goals.map(g=>`
            <div class="scenario-goal-row" style="background:#072126;padding:6px 8px;border-radius:6px;border:1px solid #d4b56822;">
              <span style="font-size:10.5px;color:#a0b9b3;">· ${g.label}</span>
              <strong style="font-size:11px;color:#ffd97d;">${g.target.toLocaleString()}${g.id==='score'?'점':g.id==='crystals'?'개':g.id==='color'?'개':g.id==='seals'?'겹':g.id==='combo'?'연쇄':'회'}</strong>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="scenario-stars-panel" style="background:#051a1e;border:1px solid #d4b56844;border-radius:8px;padding:8px 12px;margin:10px 0;text-align:left;">
        <b style="font-size:11px;color:#ffd54f;display:flex;align-items:center;gap:6px;margin-bottom:4px;">
          <span>★ 별 3개 달성 조건</span>
          <span style="font-size:9px;color:#85e3c0;font-weight:normal;">(마법별 획득 가이드)</span>
        </b>
        <div style="font-size:9.5px;color:#b2d1c5;line-height:1.7;">
          <div><b style="color:#72e3be;">★ 1성:</b> ${criteria.star1.desc}</div>
          <div><b style="color:#72e3be;">★★ 2성:</b> ${criteria.star2.desc}</div>
          <div><b style="color:#ffd54f;">★★★ 3성:</b> ${criteria.star3.desc}</div>
        </div>
      </div>

      <button id="scenarioStartBtn" class="primary-button" style="font-size:13px;padding:12px;">
        관문 탐험 시작 (Ready →)
      </button>
    </div>
  `);
  $('#scenarioStartBtn').onclick=()=>{
    $('#modal').close();
    level=lvl;
    reset();
    start();
  };
}

function openFortuneCardModal(clearedStage, onFinished){
  if(running)pauseClock();
  
  const misfortunes=FORTUNE_CARDS.filter(c=>c.type==='misfortune').sort(()=>Math.random()-.5);
  const fortunes=FORTUNE_CARDS.filter(c=>c.type==='fortune').sort(()=>Math.random()-.5);
  const rest=[...misfortunes.slice(1),...fortunes.slice(1)].sort(()=>Math.random()-.5);
  const pickedThree=[misfortunes[0],fortunes[0],rest[0]].sort(()=>Math.random()-.5);
  
  showModal(`
    <div class="fortune-modal-wrap">
      <div class="modal-kicker">THE ORACLE OF MONTEZUMA · 5관문 돌파 시험</div>
      <h2 style="font-size:17px;color:#ffe49e;margin:4px 0 6px;">고대 사원의 운명 카드 (Fortune Cards)</h2>
      <p style="font-size:11px;color:#a8d1be;margin-bottom:14px;line-height:1.6;">
        제<b>${clearedStage}</b>관문을 돌파한 탐험가여, 고대 신들의 시험이 시작됩니다.<br>
        뒤집힌 3장의 카드 중 <b>하나의 운명</b>을 선택하십시오. (행운과 악운이 공존합니다)
      </p>

      <div class="fortune-cards-container">
        ${pickedThree.map((card,idx)=>`
          <div class="fortune-card-slot" data-card-idx="${idx}">
            <div class="fortune-card-inner">
              <div class="fortune-card-face fortune-card-back">
                <img src="assets/cards/back.jpg" alt="고대 타로 카드 뒷면" class="fortune-card-img">
                <div class="fortune-card-touch-prompt">터치하여 뒤집기</div>
              </div>
              <div class="fortune-card-face fortune-card-front ${card.type}">
                <img src="${card.image}" alt="${card.title}" class="fortune-card-img">
                <div class="fortune-card-front-overlay">
                  <span class="fortune-type-badge ${card.type}">${card.type==='fortune'?'🍀 행운의 축복':'💀 악운의 시련'}</span>
                  <div class="fortune-card-title">${card.title}</div>
                  <div class="fortune-card-summary">${card.summary}</div>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <div id="fortuneResultBox" class="fortune-result-box hide">
        <div id="fortuneResultType" class="fortune-result-type"></div>
        <div id="fortuneResultTitle" class="fortune-result-title"></div>
        <div id="fortuneResultDesc" class="fortune-result-desc"></div>
        <div id="fortuneResultImpact" class="fortune-result-impact"></div>
        <button id="fortuneConfirmBtn" class="primary-button" style="margin-top:14px;">
          운명을 받아들이고 다음으로 →
        </button>
      </div>
    </div>
  `);

  let chosen=false;
  $$('.fortune-card-slot').forEach(slot=>{
    slot.onclick=()=>{
      if(chosen)return;
      chosen=true;
      const idx=+slot.dataset.cardIdx;
      const card=pickedThree[idx];
      
      slot.classList.add('flipped');
      $$('.fortune-card-slot').forEach(s=>{
        if(s!==slot)s.classList.add('faded');
      });

      if(card.type==='fortune'){
        chord(12);
        flash('#ffe28a');
        director.impact(2,2);
        for(let k=0;k<12;k++)burst(Math.floor(Math.random()*64),3,20);
      }else{
        chord(2);
        flash('#ff5555');
        director.impact(3,1);
        heavyShake(2.0);
      }

      const impactText=card.apply({totemLevels,magicStars,fortuneBuffs});
      persist();
      renderTotems();
      update();

      setTimeout(()=>{
        const box=$('#fortuneResultBox');
        $('#fortuneResultType').textContent=card.type==='fortune'?'☀️ 고대 태양신의 축복':'⚡ 피할 수 없는 고대의 시련';
        $('#fortuneResultType').className='fortune-result-type '+card.type;
        $('#fortuneResultTitle').textContent=card.title;
        $('#fortuneResultDesc').textContent=card.desc;
        $('#fortuneResultImpact').innerHTML=`<b>적용된 결과:</b> ${impactText}`;
        box.classList.remove('hide');
        box.classList.add('show-animated');
      },700);

      $('#fortuneConfirmBtn').onclick=()=>{
        $('#modal').close();
        if(onFinished)onFinished();
      };
    };
  });
}

$('#titleContinueBtn').onclick=()=>{
  hideTitleScreen();
  showScenarioBriefing(level);
};

$('#titleNewGameBtn').onclick=()=>{
  if(level>1||magicStars>0){
    showModal(`
      <div class="modal-kicker">NEW EXPEDITION</div>
      <h2>처음부터 새로 시작하시겠습니까?</h2>
      <p style="text-align:center;line-height:1.8;">현재까지의 탐험 기록(STAGE ${level}, 마법별 ★${magicStars})이 초기화되고<br>1단계 태양의 문부터 새로운 모험을 시작합니다.</p>
      <button id="confirmResetBtn" class="primary-button" style="background:linear-gradient(120deg,#e57373,#c62828);color:#fff;border-color:#ff8a80;margin-top:16px;">네, 새로 시작합니다</button>
      <button id="cancelResetBtn" class="text-button" style="text-align:center;justify-content:center;margin-top:10px;">취소하고 이어하기</button>
    `);
    $('#confirmResetBtn').onclick=()=>{
      localStorage.removeItem('solar-relic-v1');
      localStorage.removeItem('solar-relic-growth-v2');
      level=1;unlocked=1;best=0;magicStars=0;stageStars=Array(STAGE_COUNT).fill(0);totemLevels=Array(6).fill(1);
      persist();
      $('#modal').close();
      hideTitleScreen();
      showScenarioBriefing(1);
    };
    $('#cancelResetBtn').onclick=()=>$('#modal').close();
  }else{
    hideTitleScreen();
    showScenarioBriefing(1);
  }
};

$('#titleSoundBtn').onclick=showSoundSettings;
$('#titleHelpBtn').onclick=()=>level>100?realmHelp():help();
$('#titleMapBtn').onclick=()=>openMap();
$('#titleUpgradeBtn').onclick=()=>openUpgrades();
function realmHelp(){if(busy){toast('연쇄가 끝난 뒤 도움말을 열 수 있어요.');return;}if(running)pauseClock();showModal(`<div class="modal-kicker">THE NINE REALMS · GUIDE</div><h2>보석으로 싸우는 법</h2><div class="help-row"><span>01</span><div><b>원래 하던 방식으로 보석을 맞추세요</b><small>옆 보석과 교환해 3개 이상 연결합니다. 보석판과 특수돌은 사원에서 쓰던 그대로입니다.</small></div></div><div class="help-row"><span>02</span><div><b>연속 색상 마법</b><small>같은 색 두 번째 직접 매치부터 공격합니다. 토템 Lv.2 이상이면 3연속부터 위력 1.5배입니다.</small></div></div><div class="help-row"><span>03</span><div><b>특수돌 공명 공격</b><small>한 턴에서 특수돌이 실제로 터지고 기준 점수를 넘으면 추가 공격이 한 번 발동합니다. 토템을 연속으로 쓰지 않아도 가능합니다.</small></div></div><div class="help-row"><span>04</span><div><b>약점과 별 관문</b><small>약점 마법은 강하게 들어갑니다. 생명력 70% 이상으로 승리하면 3★, 35% 이상이면 2★. 몬스터가 바뀌는 길에는 2~3★가 필요합니다.</small></div></div><div class="help-row"><span>05</span><div><b>시간에 따른 반격</b><small>전투에 시간제한과 이동 횟수 제한은 없습니다. 몬스터는 시간이 지나면 반격하며, 보석 연쇄와 일시정지 중에는 반격 시간이 멈춥니다.</small></div></div><div class="help-row"><span>06</span><div><b>장비와 연계 마법</b><small>승리 코인으로 그림 장비 6부위를 구입·장착·강화하고 8종 연계 스크롤을 배웁니다.</small></div></div><button id="helpClose" class="primary-button">전투로 돌아가기 →</button>`);$('#helpClose').onclick=resume;}
function showRealmBriefing(lvl=level){
 const d=realmStage(lvl),foe=d.enemy,required=realmGateStars(d),next=lvl<REALM_LAST?realmStage(lvl+1):null,best=stageStars[lvl-1];
 d.colors=realmAvailableColors(realmSave);
 showModal(`<div class="scenario-brief"><div class="scenario-art-frame"><img src="${realmBackdrop(d)}" alt="${d.name}" class="scenario-art-img"><div class="scenario-art-badge">STAGE ${lvl} · ${REALM_ACTS[d.act].name}</div><div class="scenario-art-overlay"></div></div><div class="scenario-kicker">THE NINE REALMS · ${d.act+1}막</div><h2 class="scenario-title">${d.name}</h2><div class="scenario-story">${d.story}</div><div class="realm-brief-achievement"><b>이 전투 최고 ${starMarks(best)}</b><span>${next?`다음 상대 ${next.enemy.name} 해금 · ${required}★ 필요`:'최종 결전'}</span><small>남은 생명력 70%↑ 3★ · 35%↑ 2★ · 그 아래 1★</small></div><div class="scenario-goals"><b>전투 전략</b><p>약점 ${foe.weak.map(i=>TOTEMS[i].shortName).join(' · ')}. 같은 색 2번째부터 마법 공격. 한 턴에 특수돌 폭발 + ${realmResonanceThreshold(d).toLocaleString()}점이면 공명 추가 공격. 이동·시간 제한 없음 · 몬스터는 약 ${d.cadence*7}초마다 반격.</p></div><button id="realmBriefStart" class="primary-button">${best?'다시 도전 →':'전투 시작 →'}</button><button id="realmBriefShop" class="text-button">장비와 스크롤 확인 ↗</button></div>`);
 $('#realmBriefStart').onclick=()=>{$('#modal').close();level=lvl;reset();start();};
 $('#realmBriefShop').onclick=()=>openRealmShop();
}
function openRealmMap(act=Math.floor((level-101)/10)){
 if(level<=100)return;
 if(busy){toast('보석 연쇄가 끝난 뒤 지도를 열 수 있어요.');return;}
 if(running)pauseClock();
 act=Math.max(0,Math.min(9,act));
 const from=101+act*10,chapter=REALM_ACTS[act],earned=Array.from({length:10},(_,i)=>stageStars[from+i-1]).reduce((a,b)=>a+b,0),cleared=Array.from({length:10},(_,i)=>stageStars[from+i-1]).filter(Boolean).length;
 const actStrip=REALM_ACTS.map((a,i)=>`<button data-realm-act="${i}" class="${i===act?'active':''}" style="--act-art:url('${realmBackdrop(realmStage(101+i*10))}')"><small>${String(i+1).padStart(2,'0')}</small><b>${a.name}</b></button>`).join('');
 const route=Array.from({length:10},(_,i)=>{
   const n=from+i,d=realmStage(n),stars=stageStars[n-1],locked=n>unlocked,gate=realmGateStars(d),sprite=d.enemy.sprite;
   const status=locked?'길이 잠겼습니다':stars?stars>=gate||unlocked>n?'다음 길 열림':'별을 더 모아 재도전':'도전 가능';
   return `<button class="realm-route-node ${locked?'locked':stars?'done':'open'} ${n===level?'current':''} ${d.boss?'boss':''}" data-realm-level="${n}" ${locked?'disabled':''} style="--route-art:url('${realmBackdrop(d)}');--foe-x:${sprite%4*100/3}%;--foe-y:${Math.floor(sprite/4)*50}%"><span class="realm-route-number">${n}</span><span class="realm-route-foe" aria-hidden="true"></span><span class="realm-route-copy"><b>${d.enemy.name}${d.enemyId===0?` ×${d.waves}`:''}</b><small>${d.boss?'지역 결전':d.gate?'토템 문지기':chapter.goal}</small><em>${status}</em></span><span class="realm-route-achievement"><strong>${starMarks(stars)}</strong><small>${gate?`다음 길 ${gate}★`:'최종 결전'}</small></span></button>`;
 }).join('');
 showModal(`<div class="realm-map"><div class="realm-map-hero" style="--map-art:url('${realmBackdrop(realmStage(from))}')"><span>THE NINE REALMS · ${act+1}/10 ACT</span><h2>${chapter.name}</h2><p>${chapter.goal} · ${chapter.story}</p><div class="realm-map-progress"><i style="width:${cleared*10}%"></i></div><small>${cleared}/10 전투 완료 · 획득한 별 ${earned}/30</small></div><nav class="realm-act-strip" aria-label="지역 선택">${actStrip}</nav><p class="realm-map-guide">빛나는 길을 따라 이동하세요. 몬스터가 바뀌는 길은 이전 전투의 별이 필요합니다.</p><div class="realm-route">${route}</div><button id="realmMapClose" class="primary-button">지도를 닫고 돌아가기</button></div>`);
 $$('[data-realm-act]').forEach(el=>el.onclick=()=>openRealmMap(+el.dataset.realmAct));
 $$('[data-realm-level]').forEach(el=>el.onclick=()=>{hideTitleScreen();level=+el.dataset.realmLevel;reset();showRealmBriefing(level);});
 $('#realmMapClose').onclick=()=>{$('#modal').close();if(started&&!ended)resumeClock();};
}
const realmGearNames={staff:'지팡이',robe:'로브',ring:'반지',amulet:'부적',boots:'장화',grimoire:'마도서'};
function realmGearArt(slot,tier){const col=REALM_GEAR_SLOTS.indexOf(slot),row=tier-1;return `<span class="realm-item-art" style="background-position:${col*20}% ${row*100/3}%" role="img" aria-label="${REALM_GEAR[slot][tier].name} 그림"></span>`;}
function realmGearDescription(item,rank=0){const mult=1+rank*.08;return [['power','공격'],['hp','체력'],['armor','방어'],['focus','집중'],['ward','보호막'],['arcana','마력']].filter(([key])=>item[key]).map(([key,label])=>`${label} +${key==='focus'?Math.round(item[key]*mult*100)+'%':Math.ceil(item[key]*mult)}`).join(' · ');}
function realmDollPreview(){const stats=realmGearStats(realmSave);return `<div class="realm-equipment-preview"><div class="realm-doll"><div class="realm-mage" data-pose="idle" role="img" aria-label="현재 장비를 착용한 마법사">${realmDollLayers()}</div></div><div><b>현재 장착</b><small>공격 +${stats.power} · 마력 +${stats.arcana}<br>체력 +${stats.hp} · 방어 +${stats.armor}<br>집중 +${Math.round(stats.focus*100)}% · 시작 보호막 +${stats.ward}</small></div></div>`;}
function syncRealmGearBattle(before){if(!realmBattle)return;const after=realmGearStats(realmSave),oldMax=realmBattle.heroMax;realmBattle.heroMax=170+after.hp;realmBattle.heroHP=Math.max(0,Math.min(realmBattle.heroMax,realmBattle.heroHP+realmBattle.heroMax-oldMax));realmBattle.shield=Math.max(0,Math.min(150,realmBattle.shield+after.ward-before.ward));}
function openRealmShop(tab='gear',gearSlot='staff'){
 if(level<=100)return;if(running)pauseClock();
 const tabs=`<div class="map-tabs"><button data-shop-tab="gear" class="${tab==='gear'?'active':''}">장비</button><button data-shop-tab="scroll" class="${tab==='scroll'?'active':''}">연계 스크롤</button><button data-shop-tab="totem" class="${tab==='totem'?'active':''}">새 토템 강화</button></div>`;
 let items='';
 if(tab==='gear'){
  const slotTabs=REALM_GEAR_SLOTS.map(slot=>`<button data-gear-slot="${slot}" class="${gearSlot===slot?'active':''}">${realmGearArt(slot,1)}<span>${realmGearNames[slot]}</span></button>`).join('');
  const cards=REALM_GEAR[gearSlot].slice(1).map((item,i)=>{const tier=i+1,owned=realmGearOwned(realmSave,gearSlot,tier),equipped=realmSave.gear[gearSlot]===tier,rank=realmGearRank(realmSave,gearSlot,tier),cost=realmGearEnhanceCost(gearSlot,tier,rank);return `<article class="realm-gear-card ${equipped?'equipped':''}">${realmGearArt(gearSlot,tier)}<div class="realm-item-copy"><b>${item.name} <em>+${rank}</em></b><small>${realmGearDescription(item,rank)}</small><span>${equipped?'✦ 착용 중':owned?'보유 · 장착 가능':'◈ '+item.price.toLocaleString()+' · 구매 가능'}</span></div><div class="realm-item-actions">${!owned?`<button data-gear-buy="${gearSlot}:${tier}" ${realmSave.coins<item.price?'disabled':''}>구매 ◈${item.price.toLocaleString()}</button>`:`<button data-gear-equip="${gearSlot}:${tier}" ${equipped?'disabled':''}>${equipped?'장착 중':'장착'}</button><button data-gear-enhance="${gearSlot}:${tier}" ${rank>=5||realmSave.coins<cost?'disabled':''}>${rank>=5?'최대 강화':`강화 ◈${cost.toLocaleString()}`}</button>`}</div></article>`;}).join('');
  items=`${realmDollPreview()}<nav class="realm-gear-slots" aria-label="장비 부위">${slotTabs}</nav><div class="realm-gear-list">${cards}</div>`;
 }else if(tab==='scroll'){
  items=`<div class="realm-scroll-list">${REALM_SCROLLS.map(s=>`<article class="realm-scroll-card"><span class="realm-scroll-art" style="background-position:${s.art%4*100/3}% ${Math.floor(s.art/4)*100}%" role="img" aria-label="${s.name} 마법 그림"></span><div><b>${s.name}</b><small>${s.desc}</small><em>피해 ×${s.mult} ${s.delay?'· 반격 지연 '+s.delay:''}${s.heal?' · 회복 '+s.heal:''}</em></div><button data-realm-buy="scroll:${s.id}" ${realmSave.scrolls.includes(s.id)||realmSave.coins<s.price?'disabled':''}>${realmSave.scrolls.includes(s.id)?'보유':'◈ '+s.price.toLocaleString()}</button></article>`).join('')}</div>`;
 }else{
  items=TOTEMS.slice(6).map((t,j)=>{const i=j+6,l=totemLevels[i],price=65+l*85;return `<div class="upgrade-row" style="--accent:${t.accent}"><span class="upgrade-symbol realm-totem-art" style="background-position:${j*50}% 50%" aria-hidden="true"></span><div><b>${t.name} · Lv.${l}</b><small>${l?'3연속부터 Lv.2 이상 위력 ×1.5':'문지기 승리 후 해금'}</small></div><button data-realm-buy="totem:${i}" ${!l||l>=5||realmSave.coins<price?'disabled':''}>${!l?'잠김':l>=5?'MAX':`◈ ${price}`}</button></div>`;}).join('');
 }
 const canNext=stageStars[level-1]>=realmGateStars(realmStage(level))||unlocked>level;
 const closeLabel=ended?realmBattle?.phase==='won'?level===REALM_LAST?'여정 지도 보기 →':canNext?'다음 전투로 →':'별 더 모아 재도전 →':'재도전 →':started?'전투로 돌아가기 →':'전투 준비로 돌아가기 →';
 showModal(`<div class="modal-kicker">TRAVELER'S MARKET · ◈ ${realmSave.coins.toLocaleString()}</div><h2>이세계 상점</h2><p class="stars-caption">장비를 구입하고 장착·강화하세요. 장착한 모습이 전투에 반영됩니다.</p>${tabs}${items}<button id="realmShopClose" class="primary-button">${closeLabel}</button>`);
 updateRealmDoll();
 $$('[data-shop-tab]').forEach(el=>el.onclick=()=>openRealmShop(el.dataset.shopTab,gearSlot));
 $$('[data-gear-slot]').forEach(el=>el.onclick=()=>openRealmShop('gear',el.dataset.gearSlot));
 const gearAction=(selector,action)=>$$(selector).forEach(el=>el.onclick=()=>{const [slot,tierText]=el.dataset[action].split(':'),tier=Number(tierText),before=realmGearStats(realmSave);const ok=action==='gearBuy'?realmBuyGear(realmSave,slot,tier):action==='gearEquip'?realmEquipGear(realmSave,slot,tier):realmEnhanceGear(realmSave,slot,tier);if(ok){syncRealmGearBattle(before);director.ui(660,.25);persist();update();openRealmShop('gear',slot);}});
 gearAction('[data-gear-buy]','gearBuy');gearAction('[data-gear-equip]','gearEquip');gearAction('[data-gear-enhance]','gearEnhance');
 $$('[data-realm-buy]').forEach(el=>el.onclick=()=>{const [kind,id]=el.dataset.realmBuy.split(':');if(realmBuy(realmSave,kind,id)){if(kind==='totem')for(let i=6;i<9;i++)totemLevels[i]=realmSave.newLevels[i-6];director.ui(660,.2);persist();renderTotems();update();openRealmShop(tab,gearSlot);}});
 $('#realmShopClose').onclick=()=>{if(ended){if(realmBattle?.phase==='won'&&level===REALM_LAST){openRealmMap();return;}if(realmBattle?.phase==='won'&&canNext)level++;reset();showRealmBriefing(level);}else if(!started)showRealmBriefing(level);else{$('#modal').close();resumeClock();}};
}
function openWorldChest(){
  if(stageStars[99]<1){toast('100단계를 먼저 클리어해야 합니다.');return;}
  showModal(`<div class="modal-kicker">THE NINE REALMS</div><h2>태양의 보물상자</h2><p style="text-align:center;line-height:1.8;">상자 안에서 이세계의 문이 열립니다.<br><b>입장하면 이곳의 1~100단계로 돌아올 수 없습니다.</b><br>6대 토템의 힘을 가지고 101단계 전투를 시작합니다.</p><button id="enterWorld" class="primary-button">상자를 열고 이세계로 간다 →</button><button id="stayTemple" class="text-button" style="justify-content:center">아직 사원에 머무르기</button>`);
  $('#enterWorld').onclick=()=>{level=101;unlocked=Math.max(unlocked,101);hideTitleScreen();reset();persist();showScenarioBriefing(101);};
  $('#stayTemple').onclick=()=>$('#modal').close();
}
$('#titleChestBtn').hidden=level>100||stageStars[99]<1;
$('#titleChestBtn').onclick=openWorldChest;
$('#homeBtn').onclick=showTitleScreen;
$('#brandLink').onclick=e=>{e.preventDefault();showTitleScreen();};

updateTitleUI();
