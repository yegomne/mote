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
  {name:'화산 와이번',weak:[6,7],resist:[1],move:'용암 폭격',sprite:10},
  {name:'태초의 용 아즈라엘',weak:[6,4],resist:[1,7],move:'일식의 숨결',sprite:11}
];
export const REALM_SCROLLS=[
  {id:'storm',name:'폭풍 전도',pair:[6,2],price:120,mult:2.2,delay:1,desc:'물 → 번개 · 젖은 적에게 큰 피해'},
  {id:'ice',name:'빙결 회랑',pair:[8,6],price:150,mult:1.8,delay:2,desc:'바람 → 물 · 빙결 피해와 반격 지연'},
  {id:'magma',name:'용암 결속',pair:[7,1],price:180,mult:2.1,burn:2,desc:'대지 → 불 · 용암 폭발과 화상'},
  {id:'bloom',name:'생명의 광휘',pair:[0,3],price:140,mult:1.3,heal:25,desc:'비취 → 황금 · 회복과 빛의 방어'},
  {id:'eclipse',name:'영원의 월식',pair:[4,5],price:210,mult:1.9,delay:1,desc:'달 → 시간 · 월식 피해와 반격 지연'}
];
export const REALM_GEAR={
  staff:[{name:'사원의 지팡이',price:0,power:0},{name:'수정 지팡이',price:80,power:10},{name:'별무늬 지팡이',price:260,power:22},{name:'용언 지팡이',price:600,power:38},{name:'일식 지팡이',price:1300,power:58}],
  robe:[{name:'여행 망토',price:0,hp:0,armor:0},{name:'수호 로브',price:90,hp:30,armor:3},{name:'달빛 로브',price:300,hp:65,armor:7},{name:'용린 로브',price:700,hp:105,armor:12},{name:'일식 로브',price:1500,hp:150,armor:18}],
  ring:[{name:'낡은 반지',price:0,focus:0},{name:'공명 반지',price:110,focus:.08},{name:'별의 반지',price:330,focus:.18},{name:'태초의 반지',price:750,focus:.30},{name:'일식 반지',price:1550,focus:.45}]
};
export function realmStage(level){if(!Number.isInteger(level)||level<REALM_FIRST||level>REALM_LAST)throw new RangeError('이세계 단계는 101~200');const act=Math.floor((level-101)/10),step=(level-101)%10,chapter=REALM_ACTS[act],enemyId=chapter.foes[step],enemy=REALM_FOES[enemyId],boss=step===9,gate=step===4;
 const slime=enemyId===0,waves=slime?3+(step>=3)+(step>=7):level===200?3:boss&&level>=160?2:1;
 const hp=slime?Math.round(145+step*7):Math.round((172+act*73+step*23)*(boss?1.55:gate?1.2:1)*1.45);
 return {level,chapter:5+act,act,step,type:'realm',name:boss?`${chapter.name}의 결전`:gate?`${enemy.name} · 문지기`:slime?`${enemy.name} 무리 · ${waves}마리`:`${enemy.name} · ${['첫 조우','흔적','깊은 길','기척','수호','잔향','추적','협곡','문턱'][step]}`,tip:`${chapter.goal}. ${slime?`슬라임 ${waves}마리 · `:''}약점: ${enemy.weak.map(i=>['비취','불','번개','황금','달','시간','물','대지','바람'][i]).join('·')} · 같은 색 2번째 매치부터 마법 발동`,story:step===0?chapter.story:boss?`${chapter.name}의 끝에서 ${enemy.name}가 길을 막는다. ${chapter.goal} 아홉 토템의 힘을 이어야 한다.`:slime?`${chapter.name}에 ${enemy.name} ${waves}마리가 모여 길을 막는다. 한 마리씩 쓰러뜨리며 약점을 찾아라.`:`${chapter.name}에서 ${enemy.name}와 마주쳤다. ${chapter.goal} 적의 약점을 찾아 보석을 이어라.`,enemyId,enemy,hp,attack:slime?18+step:Math.round(12+act*4.7+step*.9+(boss?7:0)),cadence:slime||boss||step>=6?2:3,reward:Math.round(54+act*20+step*9+(boss?100:gate?40:0)+(slime?waves*10:0)),waves,boss,gate,colors:6+(level>=106)+(level>=116)+(level>=126),target:1,crystals:0,time:0,timeCap:0,seals:[],focusColor:null,colorTarget:0,comboTarget:0,specialTarget:0,totemTarget:0,overdriveTarget:0};
}
export function realmMaxHP(save){return 170+REALM_GEAR.robe[save.gear.robe].hp;}
export function freshRealmSave(){return {coins:0,gear:{staff:0,robe:0,ring:0},scrolls:[],cleared:[],newLevels:[0,0,0]};}
export function freshRealmBattle(stage,save){const max=realmMaxHP(save),enemyMax=stage.enemyId===0?stage.hp:stage.waves>1?Math.round(stage.hp*.65):stage.hp;return {enemyId:stage.enemyId,enemyHP:enemyMax,enemyMax,heroHP:max,heroMax:max,shield:0,charge:0,delay:0,wet:0,vulnerable:0,burn:0,previousSpell:-1,wave:1,turn:0,phase:'playing'};}
export function realmEncounterHP(stage,battle){if(stage.enemyId!==0)return {current:battle.enemyHP,max:battle.enemyMax};return {current:battle.enemyHP+(stage.waves-battle.wave)*stage.hp,max:stage.waves*stage.hp};}
export function realmAffinity(enemy,color){return enemy.weak.includes(color)?1.45:enemy.resist.includes(color)?.55:1;}
export function realmCast(stage,battle,save,color,level,streak){if(battle.phase!=='playing'||level<1||streak<2)return null;const enemy=REALM_FOES[battle.enemyId],affinity=realmAffinity(enemy,color),boost=level>=2&&streak>=3?1.5:1,staff=REALM_GEAR.staff[save.gear.staff].power,focus=REALM_GEAR.ring[save.gear.ring].focus;
 let damage=Math.round((17+level*7+staff)*(1+focus)*affinity*boost*(battle.vulnerable?1.2:1)),heal=0,shield=0,delay=0,combo=null;
 if(color===2&&battle.wet>0)damage=Math.round(damage*1.3);
 if(color===0){heal=11+level*3;shield=5;}
 if(color===1)battle.burn=Math.max(2,battle.burn);
 if(color===3)shield=14+level*3;
 if(color===4)battle.vulnerable=3;
 if(color===5)delay=1;
 if(color===6){battle.wet=3;heal=8+level*2;}
 if(color===7)shield=13+level*4;
 if(color===8)delay=battle.wet>0?1:0;
 const scroll=REALM_SCROLLS.find(s=>save.scrolls.includes(s.id)&&s.pair[0]===battle.previousSpell&&s.pair[1]===color);
 if(scroll){damage=Math.round(damage*scroll.mult);delay+=scroll.delay||0;heal+=scroll.heal||0;if(scroll.burn)battle.burn=Math.max(battle.burn,scroll.burn);combo=scroll.name;battle.previousSpell=-1;}else battle.previousSpell=color;
 battle.enemyHP=Math.max(0,battle.enemyHP-damage);battle.heroHP=Math.min(battle.heroMax,battle.heroHP+heal);battle.shield=Math.min(150,battle.shield+shield);battle.delay+=delay;
 return {damage,heal,shield,delay,combo,affinity,boost,enemyHP:battle.enemyHP};
}
export function realmCounter(stage,battle,save){if(battle.phase!=='playing'||battle.enemyHP<=0)return null;battle.turn++;if(battle.burn>0){battle.enemyHP=Math.max(0,battle.enemyHP-(8+Math.floor(stage.act/2)));battle.burn--;}if(battle.enemyHP<=0)return {burn:true,damage:0};
 if(battle.delay>0){battle.delay--;return {delayed:true,damage:0};}battle.charge++;if(battle.charge<stage.cadence)return null;battle.charge=0;const armor=REALM_GEAR.robe[save.gear.robe].armor,raw=Math.max(1,stage.attack-armor),blocked=Math.min(raw,battle.shield),damage=raw-blocked;battle.shield-=blocked;battle.heroHP=Math.max(0,battle.heroHP-damage);if(!battle.heroHP)battle.phase='lost';battle.wet=Math.max(0,battle.wet-1);battle.vulnerable=Math.max(0,battle.vulnerable-1);return {damage,blocked,attack:REALM_FOES[battle.enemyId].move,defeat:battle.phase==='lost'};
}
export function realmNextWave(stage,battle){if(battle.enemyHP>0||battle.wave>=stage.waves)return false;battle.wave++;if(stage.enemyId===0){battle.enemyId=0;battle.enemyMax=stage.hp;}else{battle.enemyId=battle.wave===stage.waves?stage.enemyId:REALM_ACTS[stage.act].foes[7];battle.enemyMax=Math.round(stage.hp*(battle.wave===stage.waves?1:.8));battle.heroHP=Math.min(battle.heroMax,battle.heroHP+Math.round(battle.heroMax*.12));battle.shield=Math.min(150,battle.shield+16);}battle.enemyHP=battle.enemyMax;battle.charge=0;battle.delay=0;battle.burn=0;return true;}
export function realmReward(stage,battle,save){const bonus=Math.round(Math.max(0,battle.heroHP)/battle.heroMax*stage.reward*.35);const coins=stage.reward+bonus;save.coins+=coins;if(!save.cleared.includes(stage.level))save.cleared.push(stage.level);const unlock=stage.level===105?6:stage.level===115?7:stage.level===125?8:-1;if(unlock>=6)save.newLevels[unlock-6]=Math.max(1,save.newLevels[unlock-6]);battle.phase='won';return {coins,unlock};}
export function realmBuy(save,kind,id){if(kind==='scroll'){const item=REALM_SCROLLS.find(s=>s.id===id);if(!item||save.scrolls.includes(id)||save.coins<item.price)return false;save.coins-=item.price;save.scrolls.push(id);return true;}if(kind==='gear'){const next=REALM_GEAR[id]?.[save.gear[id]+1];if(!next||save.coins<next.price)return false;save.coins-=next.price;save.gear[id]++;return true;}if(kind==='totem'){const i=Number(id)-6,l=save.newLevels[i];if(i<0||i>2||!l||l>=5)return false;const price=65+l*85;if(save.coins<price)return false;save.coins-=price;save.newLevels[i]++;return true;}return false;}
