// The second journey supplies enemies and rewards to the original temple board.
// Matching, falling gems, specials, totems and their effects remain in game.js.
export const REALM_FIRST=101,REALM_LAST=200;
export const REALM_ACTS=[
  {name:'낯선 숲',sub:'THE VERDANT CROSSING',goal:'물의 토템을 찾아',story:'보물상자의 빛이 마법사를 낯선 숲으로 데려왔다. 사원에서 얻은 여섯 토템이 이 세계에서도 응답한다.',foes:[0,0,1,0,1,0,1,0,1,2]},
  {name:'살아 있는 산맥',sub:'THE LIVING MOUNTAIN',goal:'대지의 심장을 찾아',story:'물의 흐름이 산맥 깊은 곳으로 이어진다. 잠든 바위의 수호자가 대지의 토템을 지키고 있다.',foes:[1,2,3,2,3,1,3,2,3,4]},
  {name:'바람의 계단',sub:'THE STAIR OF WINDS',goal:'바람의 토템을 찾아',story:'대지의 심장이 하늘로 오르는 계단을 열었다. 마지막 토템은 폭풍 속에서 길을 기다린다.',foes:[4,4,5,4,5,4,5,4,5,6]},
  {name:'겨울의 왕좌',sub:'THE FROZEN THRONE',goal:'아홉 힘을 시험해',story:'아홉 토템이 울리자 얼어붙은 왕좌가 깨어난다. 적들은 각기 다른 마법을 견디고 두려워한다.',foes:[6,7,8,7,8,7,8,7,8,9]},
  {name:'용의 성채',sub:'THE DRAGON CITADEL',goal:'태초의 용을 막아',story:'성채는 아홉 원소의 균형 위에 떠 있다. 태초의 용은 세계를 지키려다 그 힘에 삼켜졌다.',foes:[9,8,10,9,10,9,10,9,10,11]},
  {name:'황혼의 여울',sub:'THE DUSK RIVER',goal:'일식의 파편을 모아',story:'용이 쓰러진 뒤 검은 강이 드러났다. 아즈라엘은 진짜 재앙이 일식 너머에 있다고 경고한다.',foes:[7,9,10,7,9,10,7,9,10,11]},
  {name:'별의 사막',sub:'THE STAR DESERT',goal:'묻힌 별의 길을 밝혀',story:'황혼의 파편은 별이 묻힌 사막으로 향한다. 사라진 별자리를 되살려야 다음 문이 열린다.',foes:[8,9,6,8,9,6,8,9,6,11]},
  {name:'심해의 성전',sub:'THE SUNKEN SANCTUM',goal:'심연의 방패를 넘어',story:'별빛은 물속의 오래된 성전으로 가라앉는다. 물과 번개의 연계가 깊은 문을 깨운다.',foes:[3,2,7,3,2,7,3,2,7,11]},
  {name:'시간의 균열',sub:'THE FRACTURED HOUR',goal:'멈춘 시간을 잇고',story:'어제가 내일보다 늦게 오는 균열이다. 시간을 훔치는 적을 따라 최후의 문으로 간다.',foes:[8,9,10,8,9,10,8,9,10,11]},
  {name:'일식의 성채',sub:'THE ECLIPSE CITADEL',goal:'일식의 용을 멈춰',story:'흩어진 파편이 하나가 되었다. 아즈라엘을 얽어맨 일식을 풀려면 아홉 토템을 함께 울려야 한다.',foes:[9,10,11,9,10,11,9,10,11,11]}
];
export const REALM_FOES=[
  {name:'푸른 슬라임',weak:[1,2],resist:[6],move:'점액 폭발',sprite:0},
  {name:'가시 숲늑대',weak:[1,8],resist:[7],move:'가시 돌진',sprite:1},
  {name:'수정 딱정벌레',weak:[7,1],resist:[2],move:'수정 갑각',sprite:2},
  {name:'이끼 골렘',weak:[6,8],resist:[7],move:'낙석 주먹',sprite:3},
  {name:'바람 정령',weak:[7,4],resist:[8],move:'회오리',sprite:4},
  {name:'고블린 주술사',weak:[2,4],resist:[0],move:'저주 화살',sprite:5},
  {name:'폭풍 그리핀',weak:[7,6],resist:[8,2],move:'벼락 급강하',sprite:6},
  {name:'망령 기사',weak:[1,3],resist:[4],move:'어둠의 검',sprite:7},
  {name:'서리 뱀',weak:[1,3],resist:[6],move:'서리 숨결',sprite:8},
  {name:'타락한 마법사',weak:[4,5],resist:[1],move:'차원의 저주',sprite:9},
  {name:'화산 와이번',weak:[6,7],resist:[1],absorb:[1],move:'용암 폭격',sprite:10},
  {name:'태초의 용 아즈라엘',weak:[6,4],resist:[1,7],absorb:[1],move:'일식의 숨결',sprite:11}
];
const REALM_FOE_SCENES=[[21,26],[23,34],[35,43],[38,20],[55,59],[30,32],[52,60],[71,73],[56],[64,79],[18,87],[18,100]];
export function realmBackdrop(stage,enemyId=stage.enemyId){const scenes=REALM_FOE_SCENES[enemyId]||[21],scene=scenes[stage.act%scenes.length];return `assets/stages/stage_${scene}.jpg`;}
export function realmGateStars(stage){if(stage.level>=REALM_LAST)return 0;const next=realmStage(stage.level+1);return next.enemyId===stage.enemyId?1:next.boss||next.act!==stage.act?3:2;}
export const REALM_SCROLLS=[
  {id:'storm',name:'폭풍 전도',pair:[6,2],price:480,mult:2.2,delay:1,art:0,desc:'물 → 번개 · 젖은 적에게 큰 피해'},
  {id:'ice',name:'빙결 회랑',pair:[8,6],price:900,mult:1.8,delay:2,art:1,desc:'바람 → 물 · 빙결 피해와 반격 지연'},
  {id:'magma',name:'용암 결속',pair:[7,1],price:720,mult:2.1,burn:2,art:2,desc:'대지 → 불 · 용암 폭발과 화상'},
  {id:'bloom',name:'생명의 광휘',pair:[0,3],price:560,mult:1.3,heal:25,art:3,desc:'비취 → 황금 · 회복과 빛의 방어'},
  {id:'eclipse',name:'영원의 월식',pair:[4,5],price:1400,mult:1.9,delay:1,art:4,desc:'달 → 시간 · 월식 피해와 반격 지연'},
  {id:'inferno',name:'불새의 숨결',pair:[1,8],price:1050,mult:2.15,burn:3,art:5,desc:'불 → 바람 · 불새 폭풍과 강한 화상'},
  {id:'marsh',name:'깊은 늪의 맹세',pair:[7,6],price:850,mult:1.65,delay:2,heal:12,art:6,desc:'대지 → 물 · 속박과 생명 회복'},
  {id:'chronostorm',name:'찰나의 뇌광',pair:[5,2],price:1650,mult:2.35,delay:2,art:7,desc:'시간 → 번개 · 연속 낙뢰와 반격 지연'},
  {id:'supernova',name:'초신성 폭발',pair:[1,3],price:950,mult:2.3,burn:2,art:0,desc:'불 → 황금 · 성스러운 태양열 폭발과 화상'},
  {id:'frostfire',name:'동결 화염',pair:[6,1],price:1100,mult:2.25,burn:2,delay:1,art:2,desc:'물 → 불 · 급격한 열 충격과 혼돈 피해'},
  {id:'sandstorm',name:'모래폭풍',pair:[7,8],price:780,mult:1.95,delay:2,art:5,desc:'대지 → 바람 · 적의 시야를 가리는 모래 폭풍'},
  {id:'aurora',name:'오로라 장막',pair:[2,4],price:1250,mult:2.0,heal:20,art:4,desc:'번개 → 달 · 신비로운 오로라 빛과 생명 회복'},
  {id:'overload',name:'시간 과부하',pair:[2,5],price:1350,mult:2.4,delay:2,art:7,desc:'번개 → 시간 · 전자기장 과부하로 시간 왜곡'},
  {id:'verdant_tide',name:'신록의 해일',pair:[0,6],price:680,mult:1.7,heal:30,art:3,desc:'비취 → 물 · 거대한 신록의 파도와 대량 치유'},
  {id:'meteor',name:'황금 유성우',pair:[7,3],price:1450,mult:2.5,burn:2,art:2,desc:'대지 → 황금 · 하늘에서 떨어지는 불타는 황금 운석'},
  {id:'voidstrike',name:'암흑 참격',pair:[4,1],price:1200,mult:2.15,burn:3,art:1,desc:'달 → 불 · 암흑과 지옥불이 결합된 저주 일격'},
  {id:'cyclone',name:'질풍의 뇌우',pair:[8,2],price:1150,mult:2.3,delay:1,art:0,desc:'바람 → 번개 · 회오리에 감싸인 연쇄 벼락'},
  {id:'timewarp',name:'시공 봉인',pair:[5,4],price:1550,mult:2.2,delay:3,art:4,desc:'시간 → 달 · 시공간을 정지시키는 월식 결계'}
];
export const REALM_GEAR={
  staff:[{name:'사원의 지팡이',price:0,power:0},{name:'숲의 지팡이',price:250,power:10},{name:'서리 수정봉',price:600,power:22},{name:'화산의 권장',price:1350,power:38},{name:'일식 성좌봉',price:2700,power:58}],
  robe:[{name:'여행 망토',price:0,hp:0,armor:0},{name:'숲의 로브',price:260,hp:30,armor:3},{name:'서리 수호복',price:640,hp:65,armor:7},{name:'화산 전투복',price:1450,hp:105,armor:12},{name:'일식 성의',price:2900,hp:150,armor:18}],
  ring:[{name:'낡은 반지',price:0,focus:0},{name:'숲의 반지',price:200,focus:.08},{name:'서리 반지',price:550,focus:.18},{name:'화산 반지',price:1250,focus:.30},{name:'일식 반지',price:2600,focus:.45}],
  amulet:[{name:'빈 목걸이',price:0,ward:0,hp:0},{name:'숲의 부적',price:220,ward:12,hp:0},{name:'서리 부적',price:580,ward:24,hp:8},{name:'화산 부적',price:1320,ward:42,hp:16},{name:'일식 부적',price:2750,ward:68,hp:28}],
  boots:[{name:'여행 장화',price:0,armor:0},{name:'숲의 장화',price:180,armor:1},{name:'서리 장화',price:520,armor:3},{name:'화산 장화',price:1180,armor:5},{name:'일식 장화',price:2450,armor:8}],
  grimoire:[{name:'빈 마도서',price:0,arcana:0},{name:'숲의 마도서',price:240,arcana:7},{name:'서리 마도서',price:620,arcana:15},{name:'화산 마도서',price:1380,arcana:25},{name:'일식 마도서',price:2800,arcana:38}]
};
export const REALM_GEAR_SLOTS=Object.keys(REALM_GEAR);
export function realmGearOwned(save,slot,tier){if(!REALM_GEAR[slot]?.[tier])return false;if(tier===0)return true;return Array.isArray(save.ownedGear?.[slot])?save.ownedGear[slot].includes(tier):tier<=(save.gear?.[slot]||0);}
export function realmGearRank(save,slot,tier){return Math.max(0,Math.min(5,Math.floor(save.enhance?.[`${slot}:${tier}`]||0)));}
export function realmGearEnhanceCost(slot,tier,rank){const item=REALM_GEAR[slot]?.[tier];return !item||tier===0||rank>=5?Infinity:Math.round(item.price*(.35+.18*rank)/10)*10;}
export function realmGearStats(save){const stats={power:0,hp:0,armor:0,focus:0,ward:0,arcana:0};for(const slot of REALM_GEAR_SLOTS){const tier=Math.max(0,Math.min(4,Math.floor(save.gear?.[slot]||0))),item=REALM_GEAR[slot][tier],mult=1+realmGearRank(save,slot,tier)*.08;for(const key of Object.keys(stats))stats[key]+=key==='focus'?(item[key]||0)*mult:Math.ceil((item[key]||0)*mult);}return stats;}
export function realmBuyGear(save,slot,tier){const item=REALM_GEAR[slot]?.[tier];if(!item||tier===0||realmGearOwned(save,slot,tier)||save.coins<item.price)return false;save.coins-=item.price;save.ownedGear??={};save.ownedGear[slot]??=Array.from({length:save.gear?.[slot]||0},(_,i)=>i+1);save.ownedGear[slot].push(tier);return true;}
export function realmEquipGear(save,slot,tier){if(!realmGearOwned(save,slot,tier))return false;save.gear??={};save.gear[slot]=tier;return true;}
export function realmEnhanceGear(save,slot,tier){if(!realmGearOwned(save,slot,tier))return false;const rank=realmGearRank(save,slot,tier),cost=realmGearEnhanceCost(slot,tier,rank);if(save.coins<cost)return false;save.coins-=cost;save.enhance??={};save.enhance[`${slot}:${tier}`]=rank+1;return true;}
export function realmStage(level){if(!Number.isInteger(level)||level<REALM_FIRST||level>REALM_LAST)throw new RangeError('이세계 단계는 101~200');const act=Math.floor((level-101)/10),step=(level-101)%10,chapter=REALM_ACTS[act],enemyId=chapter.foes[step],enemy=REALM_FOES[enemyId],boss=step===9,gate=step===4;
 const slime=enemyId===0,waves=slime?3+(step>=3)+(step>=7):level===200?3:boss&&level>=160?2:1;
 const hp=slime?Math.round((180+step*10)*1.35):Math.round((210+act*85+step*28)*(boss?1.65:gate?1.25:1)*1.55);
 return {level,chapter:5+act,act,step,type:'realm',name:boss?`${chapter.name}의 결전`:gate?`${enemy.name} · 문지기`:slime?`${enemy.name} 무리 · ${waves}마리`:`${enemy.name} · ${['첫 조우','흔적','깊은 길','기척','수호','잔향','추적','협곡','문턱'][step]}`,tip:`${chapter.goal}. ${slime?`슬라임 ${waves}마리 · `:''}약점: ${enemy.weak.map(i=>['비취','불','번개','황금','달','시간','물','대지','바람'][i]).join('·')} · 같은 색 2번째 매치부터 마법 발동`,story:step===0?chapter.story:boss?`${chapter.name}의 끝에서 ${enemy.name}가 길을 막는다. ${chapter.goal} 아홉 토템의 힘을 이어야 한다.`:slime?`${chapter.name}에 ${enemy.name} ${waves}마리가 모여 길을 막는다. 한 마리씩 쓰러뜨리며 약점을 찾아라.`:`${chapter.name}에서 ${enemy.name}와 마주쳤다. ${chapter.goal} 적의 약점을 찾아 보석을 이어라.`,enemyId,enemy,hp,attack:slime?20+step*1.2:Math.round(14+act*5.2+step*1.1+(boss?8:0)),cadence:boss?1:(slime||step>=5?2:2),reward:Math.round(54+act*20+step*9+(boss?100:gate?40:0)+(slime?waves*10:0)),waves,boss,gate,colors:6+(level>=106)+(level>=116)+(level>=126),target:1,crystals:0,time:0,timeCap:0,seals:[],focusColor:null,colorTarget:0,comboTarget:0,specialTarget:0,totemTarget:0,overdriveTarget:0};
}
export function realmMaxHP(save){return 170+realmGearStats(save).hp;}
export function freshRealmSave(){return {coins:0,gear:{staff:0,robe:0,ring:0,amulet:0,boots:0,grimoire:0},ownedGear:{},enhance:{},scrolls:[],cleared:[],newLevels:[0,0,0]};}
export function realmAvailableColors(save){let colors=6;for(const level of save.newLevels||[]){if(level<1)break;colors++;if(colors===9)break;}return colors;}
export function freshRealmBattle(stage,save){const max=realmMaxHP(save),enemyMax=stage.enemyId===0?stage.hp:stage.waves>1?Math.round(stage.hp*.65):stage.hp;return {enemyId:stage.enemyId,enemyHP:enemyMax,enemyMax,heroHP:max,heroMax:max,shield:realmGearStats(save).ward,charge:0,delay:0,wet:0,vulnerable:0,burn:0,previousSpell:-1,wave:1,turn:0,phase:'playing'};}
export function realmEncounterHP(stage,battle){if(stage.enemyId!==0)return {current:battle.enemyHP,max:battle.enemyMax};return {current:battle.enemyHP+(stage.waves-battle.wave)*stage.hp,max:stage.waves*stage.hp};}
export function realmAffinity(enemy,color){return enemy.weak.includes(color)?1.45:enemy.resist.includes(color)?.55:1;}
export function realmCast(stage,battle,save,color,level,streak){if(battle.phase!=='playing'||level<1||streak<2)return null;const enemy=REALM_FOES[battle.enemyId],affinity=realmAffinity(enemy,color),boost=level>=2&&streak>=3?1.5:1,{power,arcana,focus}=realmGearStats(save);
 let damage=Math.round((17+level*7+power+arcana)*(1+focus)*affinity*boost*(battle.vulnerable?1.2:1)),heal=0,shield=0,delay=0,combo=null,absorbed=0;
 if(enemy.absorb?.includes(color)){
   damage=0;
   absorbed=Math.min(battle.enemyMax-battle.enemyHP,Math.max(10,Math.round(battle.enemyMax*0.05+level*2)));
   battle.enemyHP+=absorbed;
   battle.burn=0;
 }else{
   if(color===2&&battle.wet>0)damage=Math.round(damage*1.3);
   if(color===1)battle.burn=Math.max(2,battle.burn);
 }
 if(color===0){heal=11+level*3;shield=5;}
 if(color===3)shield=14+level*3;
 if(color===4)battle.vulnerable=3;
 if(color===5)delay=1;
 if(color===6){battle.wet=3;heal=8+level*2;}
 if(color===7)shield=13+level*4;
 if(color===8)delay=battle.wet>0?1:0;
 const scroll=REALM_SCROLLS.find(s=>save.scrolls.includes(s.id)&&s.pair[0]===battle.previousSpell&&s.pair[1]===color);
 if(scroll){damage=Math.round(damage*scroll.mult);delay+=scroll.delay||0;heal+=scroll.heal||0;if(scroll.burn&&!enemy.absorb?.includes(1))battle.burn=Math.max(battle.burn,scroll.burn);combo=scroll.name;battle.previousSpell=-1;}else battle.previousSpell=color;
 if(!enemy.absorb?.includes(color))battle.enemyHP=Math.max(0,battle.enemyHP-damage);battle.heroHP=Math.min(battle.heroMax,battle.heroHP+heal);battle.shield=Math.min(150,battle.shield+shield);battle.delay+=delay;
 return {damage,absorbed,heal,shield,delay,combo,comboArt:scroll?.art??-1,affinity:enemy.absorb?.includes(color)?0:affinity,boost,enemyHP:battle.enemyHP};
}
export function realmResonanceThreshold(stage){return 1000+Math.floor(stage.act/2)*150;}
export function realmResonance(stage,battle,save,turnScore,specials){
 if(battle.phase!=='playing'||battle.enemyHP<=0||!specials?.length||turnScore<realmResonanceThreshold(stage))return null;
 const power=specials.reduce((sum,type)=>sum+({row:1,col:1,cross:2,bomb:2,nova:3}[type]||1),0);
 const gear=realmGearStats(save);
 const damage=Math.min(160+stage.act*10,Math.round((18+stage.act*8+power*12+Math.min(50,(turnScore-realmResonanceThreshold(stage))/70)+(gear.power+gear.arcana)*.35)*(1+gear.focus*.5)));
 battle.enemyHP=Math.max(0,battle.enemyHP-damage);
 return {damage,score:turnScore,specials:specials.length,power,threshold:realmResonanceThreshold(stage),enemyHP:battle.enemyHP};
}
export function realmCounter(stage,battle,save){if(battle.phase!=='playing'||battle.enemyHP<=0)return null;battle.turn++;if(battle.burn>0){battle.enemyHP=Math.max(0,battle.enemyHP-(8+Math.floor(stage.act/2)));battle.burn--;}if(battle.enemyHP<=0)return {burn:true,damage:0};
 if(battle.delay>0){battle.delay--;return {delayed:true,damage:0};}battle.charge++;if(battle.charge<stage.cadence)return null;battle.charge=0;const armor=realmGearStats(save).armor,raw=Math.max(1,stage.attack-armor),blocked=Math.min(raw,battle.shield),damage=raw-blocked;battle.shield-=blocked;battle.heroHP=Math.max(0,battle.heroHP-damage);if(!battle.heroHP)battle.phase='lost';battle.wet=Math.max(0,battle.wet-1);battle.vulnerable=Math.max(0,battle.vulnerable-1);return {damage,blocked,attack:REALM_FOES[battle.enemyId].move,defeat:battle.phase==='lost'};
}
export function realmNextWave(stage,battle){if(battle.enemyHP>0||battle.wave>=stage.waves)return false;battle.wave++;if(stage.enemyId===0){battle.enemyId=0;battle.enemyMax=stage.hp;}else{battle.enemyId=battle.wave===stage.waves?stage.enemyId:REALM_ACTS[stage.act].foes[7];battle.enemyMax=Math.round(stage.hp*(battle.wave===stage.waves?1:.8));battle.heroHP=Math.min(battle.heroMax,battle.heroHP+Math.round(battle.heroMax*.12));battle.shield=Math.min(150,battle.shield+16);}battle.enemyHP=battle.enemyMax;battle.charge=0;battle.delay=0;battle.burn=0;return true;}
export function realmReward(stage,battle,save){const bonus=Math.round(Math.max(0,battle.heroHP)/battle.heroMax*stage.reward*.35);const coins=stage.reward+bonus;save.coins+=coins;if(!save.cleared.includes(stage.level))save.cleared.push(stage.level);const gateUnlock=stage.level===105?6:stage.level===115?7:stage.level===125?8:-1,unlock=gateUnlock>=6&&save.newLevels[gateUnlock-6]<1?gateUnlock:-1;if(unlock>=6)save.newLevels[unlock-6]=1;battle.phase='won';return {coins,unlock};}
export function realmBuy(save,kind,id){if(kind==='scroll'){const item=REALM_SCROLLS.find(s=>s.id===id);if(!item||save.scrolls.includes(id)||save.coins<item.price)return false;save.coins-=item.price;save.scrolls.push(id);return true;}if(kind==='gear'){const tier=(save.gear?.[id]||0)+1;if(!realmBuyGear(save,id,tier))return false;realmEquipGear(save,id,tier);return true;}if(kind==='totem'){const i=Number(id)-6,l=save.newLevels[i];if(i<0||i>2||!l||l>=5)return false;const price=65+l*85;if(save.coins<price)return false;save.coins-=price;save.newLevels[i]++;return true;}return false;}
