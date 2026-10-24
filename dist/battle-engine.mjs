import {findMatches as templeMatches,findMove as templeFindMove,makeBoard as templeMakeBoard,affected as templeAffected,specialCreations as templeSpecialCreations,collapse as templeCollapse,fireTargets,thunderTargets,harvestTargets,lunarTargets} from './engine.mjs';
export const FIRST_STAGE=101,LAST_STAGE=200;
export const RUNES=[
  {name:'비취',spell:'생명의 덩굴',icon:'✦',color:'#64df9f',unlock:101,kind:'life'},
  {name:'불',spell:'화염 심판',icon:'◆',color:'#ff6f50',unlock:101,kind:'fire'},
  {name:'번개',spell:'천둥 창',icon:'ϟ',color:'#76bfff',unlock:101,kind:'lightning'},
  {name:'황금',spell:'태양의 가호',icon:'✹',color:'#ffd46e',unlock:101,kind:'sun'},
  {name:'달',spell:'월식 저주',icon:'☾',color:'#cf9eff',unlock:101,kind:'moon'},
  {name:'시간',spell:'시계의 결계',icon:'⌛',color:'#ffb778',unlock:101,kind:'time'},
  {name:'물',spell:'깊은 물결',icon:'◉',color:'#55dffa',unlock:106,kind:'water'},
  {name:'대지',spell:'대지의 주먹',icon:'⬟',color:'#c2a374',unlock:116,kind:'earth'},
  {name:'바람',spell:'하늘의 칼날',icon:'➶',color:'#b5f3d7',unlock:126,kind:'wind'}
];
export const ENEMIES=[
  {name:'푸른 슬라임',sprite:0,weak:[1,2],resist:[6],attack:'점액 튀기기'},
  {name:'가시 숲늑대',sprite:1,weak:[1,8],resist:[7],attack:'가시 돌진'},
  {name:'수정 딱정벌레',sprite:2,weak:[7,1],resist:[2],attack:'수정 갑각'},
  {name:'이끼 골렘',sprite:3,weak:[6,8],resist:[7],attack:'낙석 주먹'},
  {name:'바람 정령',sprite:4,weak:[7,4],resist:[8],attack:'돌풍'},
  {name:'고블린 주술사',sprite:5,weak:[2,4],resist:[0],attack:'저주 화살'},
  {name:'폭풍 그리핀',sprite:6,weak:[7,6],resist:[8,2],attack:'낙뢰 급강하'},
  {name:'망령 기사',sprite:7,weak:[1,3],resist:[4],attack:'어둠의 검'},
  {name:'서리 뱀',sprite:8,weak:[1,3],resist:[6],attack:'서리 숨결'},
  {name:'타락한 대마법사',sprite:9,weak:[4,5],resist:[1],attack:'차원의 저주'},
  {name:'화산 와이번',sprite:10,weak:[6,7],resist:[1],attack:'용암 폭격'},
  {name:'태초의 용 아즈라엘',sprite:11,weak:[6,4],resist:[1,7],attack:'종말의 화염'},
  {name:'황혼 키메라',sprite:12,weak:[3,8],resist:[4],attack:'황혼의 발톱'},
  {name:'호박 사막전갈',sprite:13,weak:[6,8],resist:[7],attack:'독침 폭풍'},
  {name:'별무늬 미라',sprite:14,weak:[1,3],resist:[4],attack:'성흔의 저주'},
  {name:'용골 거인',sprite:15,weak:[7,2],resist:[1],attack:'용골 강타'},
  {name:'심해의 문어',sprite:16,weak:[2,8],resist:[6],attack:'심연 촉수'},
  {name:'산호 마녀',sprite:17,weak:[2,1],resist:[6],attack:'산호의 속삭임'},
  {name:'심연 거북',sprite:18,weak:[7,2],resist:[6],attack:'수정 등껍질'},
  {name:'시간 사냥꾼',sprite:19,weak:[4,7],resist:[5],attack:'멈춘 시곗바늘'},
  {name:'모래시계 정령',sprite:20,weak:[6,4],resist:[5],attack:'되감기 폭풍'},
  {name:'균열 기사',sprite:21,weak:[3,8],resist:[4],attack:'차원 절단'},
  {name:'공허 불사조',sprite:22,weak:[6,7],resist:[1,4],attack:'공허의 날개'},
  {name:'일식 드래곤',sprite:23,weak:[6,4],resist:[1,3],attack:'일식의 숨결'}
];
export const ACTS=[
 {title:'낯선 숲',subtitle:'태양의 문 너머',goal:'세계의 첫 숨결을 찾아',intro:'보물상자를 열자 사원의 천장은 별하늘로 바뀌었다. 태양의 힘을 지닌 마법사는 낯선 숲에 떨어진다.',enemy:[0,1,0,5,4,1,2,5,4,5],boss:'호수의 수호자',reward:'물의 토템'},
 {title:'살아 있는 산맥',subtitle:'돌의 기억',goal:'대지의 심장을 찾아',intro:'물의 토템은 산속에서 들려오는 낮은 박동을 가리킨다. 바위 밑에 묻힌 오래된 마법을 깨워야 한다.',enemy:[2,3,1,2,3,3,5,7,3,3],boss:'산의 심장',reward:'대지의 토템'},
 {title:'바람의 계단',subtitle:'하늘을 잇는 균열',goal:'마지막 토템을 찾아',intro:'대지의 심장에서 하늘로 올라가는 계단이 열린다. 폭풍 한가운데 마지막 원소의 목소리가 있다.',enemy:[4,6,5,4,6,6,7,4,6,6],boss:'폭풍의 파수꾼',reward:'바람의 토템'},
 {title:'겨울의 왕좌',subtitle:'아홉 힘의 시험',goal:'용의 봉인을 풀어',intro:'아홉 토템이 울리자 얼어붙은 왕좌가 깨어난다. 적들은 마법을 배우고, 마법사는 상성을 익혀야 한다.',enemy:[8,7,9,8,9,8,6,9,8,9],boss:'거울의 대마법사',reward:'용의 좌표'},
 {title:'용의 성채',subtitle:'끝의 시작',goal:'아즈라엘을 막아',intro:'성채는 아홉 원소의 균형으로 떠 있다. 태초의 용은 세계를 지키기 위해 모든 마법을 삼키려 한다.',enemy:[10,9,7,10,8,10,9,10,10,11],boss:'태초의 용 아즈라엘',reward:'일식의 문'},
 {title:'황혼의 여울',subtitle:'용의 잔향',goal:'일식의 첫 파편을 회수해',intro:'아즈라엘이 쓰러지자 성채 뒤편에 검은 강이 나타난다. 마법사는 용의 경고를 따라 황혼의 괴물들 사이로 들어간다.',enemy:[12,13,12,14,15,13,14,12,12,15],boss:'용골 파수꾼',reward:'황혼의 파편'},
 {title:'별의 사막',subtitle:'모래 속 별자리',goal:'잠든 별의 길을 밝혀',intro:'황혼의 파편은 별이 묻힌 사막을 가리킨다. 사라진 별자리를 되살려야 일식의 다음 문이 열린다.',enemy:[13,14,12,13,14,15,12,14,13,12],boss:'유성 키메라',reward:'별의 파편'},
 {title:'심해의 성전',subtitle:'가라앉은 왕국',goal:'심연의 방패를 넘어',intro:'별빛은 바다 밑 폐허로 가라앉는다. 오래된 성전은 물과 번개를 함께 다루는 마법사만 통과시킨다.',enemy:[16,17,18,16,18,17,16,18,17,18],boss:'심연의 등껍질',reward:'심해의 파편'},
 {title:'시간의 균열',subtitle:'멈춰 버린 아침',goal:'흩어진 시간을 잇고',intro:'성전의 문은 어제가 내일보다 늦게 오는 균열로 이어진다. 시간을 훔치는 추격자를 따라 최후의 문을 찾는다.',enemy:[19,20,21,19,20,21,19,20,19,21],boss:'균열의 기사',reward:'시간의 파편'},
 {title:'일식의 성채',subtitle:'태초의 진형',goal:'일식의 용을 멈춰',intro:'네 파편이 하나가 되자 진짜 용의 성채가 모습을 드러낸다. 아즈라엘은 세계를 삼키려는 일식에 묶여 있었다.',enemy:[22,21,20,22,23,21,22,22,21,23],boss:'아즈라엘 · 일식의 진형',reward:'아홉 토템의 수호자'}
];
const particle=(word,withFinal,withoutFinal)=>{const c=word.charCodeAt(word.length-1);return c>=0xac00&&c<=0xd7a3&&(c-0xac00)%28!==0?withFinal:withoutFinal;};
const BEATS=['흔적','첫 조우','깊은 길','흩어진 기억','문지기','잔향','되살아난 수호','협곡','마지막 표식','결전'];
export const SCROLLS=[
 {id:'storm',name:'폭풍 전도',pair:[6,2],price:120,icon:'⚡',desc:'물 → 번개: 젖은 적에 강타, 반격 1회 지연',color:'#80dfff'},
 {id:'ice',name:'빙결 회랑',pair:[8,6],price:150,icon:'❄',desc:'바람 → 물: 얼음 피해, 반격 2회 지연',color:'#b7f0ff'},
 {id:'magma',name:'용암 결속',pair:[7,1],price:170,icon:'✦',desc:'대지 → 불: 용암 폭발, 지속 화상',color:'#ff9561'},
 {id:'eclipse',name:'영원의 월식',pair:[4,5],price:190,icon:'☽',desc:'달 → 시간: 시간 균열, 추가 피해와 반격 지연',color:'#d7adff'},
 {id:'bloom',name:'생명의 광휘',pair:[0,3],price:140,icon:'✿',desc:'비취 → 황금: 치유와 방어막 강화',color:'#a8efb4'},
 {id:'inferno',name:'화염 회오리',pair:[1,8],price:360,unlock:151,icon:'🔥',desc:'불 → 바람: 화염 폭풍과 긴 화상',color:'#ff9b69'},
 {id:'reef',name:'산호 성벽',pair:[7,6],price:420,unlock:171,icon:'❖',desc:'대지 → 물: 물의 치유와 강한 방어막',color:'#87ebdd'},
 {id:'overload',name:'시공 과부하',pair:[2,5],price:500,unlock:181,icon:'ϟ',desc:'번개 → 시간: 큰 피해와 반격 2회 지연',color:'#bdcaff'}
];
export const GEAR={
 staff:[{name:'나무 지팡이',price:0,attack:0},{name:'수정 지팡이',price:70,attack:10},{name:'별무늬 지팡이',price:210,attack:22},{name:'용언 지팡이',price:490,attack:38},{name:'황혼 지팡이',price:850,attack:55,unlock:151},{name:'성좌 지팡이',price:1400,attack:72,unlock:171},{name:'일식 지팡이',price:2200,attack:90,unlock:191}],
 robe:[{name:'여행 망토',price:0,hp:0,armor:0},{name:'수호 로브',price:80,hp:25,armor:3},{name:'달빛 로브',price:230,hp:55,armor:6},{name:'용린 로브',price:520,hp:90,armor:10},{name:'황혼 로브',price:900,hp:120,armor:13,unlock:151},{name:'성좌 로브',price:1500,hp:155,armor:16,unlock:171},{name:'일식 로브',price:2300,hp:200,armor:20,unlock:191}],
 ring:[{name:'낡은 반지',price:0,focus:0},{name:'공명 반지',price:90,focus:.08},{name:'별의 반지',price:250,focus:.17},{name:'태초의 반지',price:550,focus:.27},{name:'황혼 반지',price:800,focus:.32,unlock:151},{name:'성좌 반지',price:1300,focus:.40,unlock:171},{name:'일식 반지',price:2100,focus:.50,unlock:191}]
};
export function stageDesign(stage){if(!Number.isInteger(stage)||stage<FIRST_STAGE||stage>LAST_STAGE)throw new RangeError('전투 단계는 101~200');const act=Math.floor((stage-FIRST_STAGE)/10),step=(stage-FIRST_STAGE)%10,chapter=ACTS[act],enemyId=chapter.enemy[step],enemy=ENEMIES[enemyId],boss=step===9,guardian=step===4,size=8;
 const health=Math.round((86+act*42+step*15)*(boss?(stage===150||stage===200?1.9:1.6):guardian?1.32:1));
 const waves=boss&&stage>=160?(stage===200?3:2):1;
 return {stage,act,step,size,colors:6+(stage>=106)+(stage>=116)+(stage>=126),enemyId,enemy,name:boss?chapter.boss:guardian?`${enemy.name} · 문지기`:`${enemy.name} · ${BEATS[step]}`,title:chapter.title,subtitle:chapter.subtitle,goal:chapter.goal,boss,guardian,waves,hp:health,attack:Math.round(8+act*4+step*.8+(boss?5:0)),cadence:boss?3:step>=6?2:3,reward:Math.round(48+act*18+step*9+(boss?85:guardian?35:0)+(act>=5?act*8:0)),story:step===0?chapter.intro:boss?`“${chapter.boss}”가 길을 막는다. ${stage===150?'용을 쓰러뜨리면 일식의 문이 열린다.':stage===200?'아홉 토템으로 일식을 끝내야 한다.':'결전은 여러 차례 이어진다.'}`:guardian?`${chapter.goal}. ${enemy.name}${particle(enemy.name,'이','가')} 문을 지키며 원소의 힘을 시험한다.`:`${chapter.title}의 ${BEATS[step]}에서 ${enemy.name}${particle(enemy.name,'과','와')} 마주친다. 약한 마법을 골라 길을 연다.`};}
export function maxHP(state){return 140+GEAR.robe[state.gear.robe].hp;}
export function initialState(legacyLevels=[5,5,5,5,5,5]){return {version:1,stage:FIRST_STAGE,coins:0,gear:{staff:0,robe:0,ring:0},scrolls:[],levels:[...Array.from({length:6},(_,i)=>Math.max(1,Math.min(5,Number(legacyLevels[i])||5))),0,0,0],cleared:[],battle:null,won:false};}
export function canUseRune(state,index){return index>=0&&index<9&&state.levels[index]>0;}
export function unlockReward(state,stage){if(stage===105)state.levels[6]=Math.max(1,state.levels[6]);if(stage===115)state.levels[7]=Math.max(1,state.levels[7]);if(stage===125)state.levels[8]=Math.max(1,state.levels[8]);}
export function equipmentPrice(state,slot){const next=state.gear[slot]+1;return GEAR[slot]?.[next]?.price??null;}
export function buyGear(state,slot){const price=equipmentPrice(state,slot),next=GEAR[slot]?.[state.gear[slot]+1];if(price===null||state.coins<price||state.stage<(next.unlock??101))return false;state.coins-=price;state.gear[slot]++;if(slot==='robe'&&state.battle)state.battle.heroHP=Math.min(maxHP(state),state.battle.heroHP+GEAR.robe[state.gear.robe].hp-GEAR.robe[state.gear.robe-1].hp);return true;}
export function buyScroll(state,id){const s=SCROLLS.find(s=>s.id===id);if(!s||state.stage<(s.unlock??101)||state.scrolls.includes(id)||state.coins<s.price)return false;state.coins-=s.price;state.scrolls.push(id);return true;}
export function trainCost(state,index){const level=state.levels[index],cap=state.stage>=151?8:5;if(index<0||index>8||!level||level>=cap||index<6&&state.stage<151)return null;return 55+level*65;}
export function trainRune(state,index){const cost=trainCost(state,index);if(cost===null||state.coins<cost)return false;state.coins-=cost;state.levels[index]++;return true;}
export function matches(board,size){if(size!==8)throw new RangeError('원작 보석판은 8×8입니다');return templeMatches(board).map(g=>({...g,length:g.cells.length}));}
export function adjacent(a,b,size){return a>=0&&b>=0&&a<size*size&&b<size*size&&Math.abs(Math.floor(a/size)-Math.floor(b/size))+Math.abs(a%size-b%size)===1;}
export function possibleMoves(board,size,color=-1){const moves=[];for(let a=0;a<board.length;a++)for(const b of[a+1,a+size]){if(!adjacent(a,b,size))continue;[board[a],board[b]]=[board[b],board[a]];const m=matches(board,size),primary=m.find(g=>g.cells.includes(b))??m.find(g=>g.cells.includes(a))??m[0];[board[a],board[b]]=[board[b],board[a]];if(primary&&(color<0||primary.color===color))moves.push({a,b,color:primary.color,size:primary.length});}return moves;}
export function makeBoard(size,colors,random=Math.random){if(size!==8)throw new RangeError('원작 보석판은 8×8입니다');return templeMakeBoard(colors,random);}
export function refill(board,size,colors,random=Math.random){if(size!==8)throw new RangeError('원작 보석판은 8×8입니다');return templeCollapse(board,colors,random);}
export function swapAndResolve(board,size,colors,a,b,random=Math.random){if(size!==8||!adjacent(a,b,size))return {valid:false};[board[a],board[b]]=[board[b],board[a]];const first=templeMatches(board),primary=first.find(g=>g.cells.includes(b))??first.find(g=>g.cells.includes(a))??first[0];if(!primary){[board[a],board[b]]=[board[b],board[a]];return {valid:false};}
 let removed=0,cascades=0,specialsCreated=0,specialsTriggered=0,crystals=0;const waves=[];
 for(let groups=first;groups.length&&cascades<24;groups=templeMatches(board)){
  const creations=templeSpecialCreations(groups,cascades===0?[b,a]:[]),initial=[...new Set(groups.flatMap(g=>g.cells))],result=templeAffected(board,initial),cleared=result.cells.filter(i=>board[i]&&!creations.has(i));
  crystals+=cleared.filter(i=>board[i].crystal).length;removed+=cleared.length;specialsCreated+=creations.size;specialsTriggered+=result.effects.length;
  waves.push({cells:[...result.cells],effects:result.effects.map(e=>({...e})),created:[...creations].map(([index,type])=>({index,type})),colors:cleared.map(i=>board[i].color)});
  for(const i of cleared)board[i]=null;
  for(const [i,type] of creations)if(board[i]){board[i].special=type;board[i].crystal=false;}
  templeCollapse(board,colors,random);cascades++;
 }
 if(!templeFindMove(board)){const fresh=templeMakeBoard(colors,random);board.splice(0,board.length,...fresh);}
 return {valid:true,color:primary.color,removed,cascades,charged:specialsCreated,specialsCreated,specialsTriggered,crystals,waves};}
function settlePowerBoard(board,colors,targets,random){let removed=0,crystals=0,specials=0;const waves=[];let groups=null;
 for(let depth=0;depth<12;depth++){const initial=depth===0?targets:[...new Set(groups.flatMap(g=>g.cells))];if(!initial.length)break;const creations=depth===0?new Map():templeSpecialCreations(groups),result=templeAffected(board,initial),cleared=result.cells.filter(i=>board[i]&&!creations.has(i));crystals+=cleared.filter(i=>board[i].crystal).length;removed+=cleared.length;specials+=result.effects.length;
  waves.push({cells:[...result.cells],effects:result.effects.map(e=>({...e})),created:[...creations].map(([index,type])=>({index,type}))});
  for(const i of cleared)board[i]=null;for(const [i,type] of creations)if(board[i]){board[i].special=type;board[i].crystal=false;}templeCollapse(board,colors,random);groups=templeMatches(board);if(!groups.length)break;
 }
 if(!templeFindMove(board))board.splice(0,board.length,...templeMakeBoard(colors,random));return {removed,crystals,specials,waves};
}
export function totemBoardEffect(state,battle,color,anchor,random=Math.random){const level=Math.max(1,Math.min(5,state.levels[color])),boost=state.levels[color]>=2&&battle.streak.count>=3,board=battle.board,design=stageDesign(state.stage);let targets=[],centers=[],created=[];
 if(color===0){const harvest=harvestTargets(board,level,battle.streak.count,random);targets=harvest.collect;created=harvest.create.map(index=>({index,type:'crystal'}));}
 if(color===1){centers=fireTargets(level,battle.lastFireTargets??[],random);if(boost){const pool=Array.from({length:64},(_,i)=>i).filter(i=>!centers.includes(i));centers.push(pool[Math.floor(random()*pool.length)]);}battle.lastFireTargets=centers;const max=Math.min(26,Math.round(([0,8,12,16,20,24][level])*(boost?1.3:1)));for(const center of centers){const row=Math.floor(center/8),col=center%8;for(let y=Math.max(0,row-1);y<=Math.min(7,row+1);y++)for(let x=Math.max(0,col-1);x<=Math.min(7,col+1);x++){const i=y*8+x;if(targets.length<max&&!targets.includes(i))targets.push(i);}}}
 if(color===2){const shock=thunderTargets(level,battle.streak.count,anchor,random);targets=shock.cells;centers=[anchor];}
 if(color===4){created=lunarTargets(board,level,battle.streak.count,random).map(g=>({index:g.index,type:g.special}));for(const gift of created)if(board[gift.index])board[gift.index].special=gift.type;}
 if(color===6){const row=Math.floor(anchor/8),col=anchor%8,reach=level>=4?3:2;for(let x=Math.max(0,col-reach);x<=Math.min(7,col+reach);x++)targets.push(row*8+x);if(boost)for(const y of [row-1,row+1])if(y>=0&&y<8)targets.push(y*8+col);}
 if(color===7){const row=Math.floor(anchor/8),col=anchor%8;for(let y=Math.max(0,row-1);y<=Math.min(7,row+1);y++)for(let x=Math.max(0,col-1);x<=Math.min(7,col+1);x++)if(Math.abs(y-row)+Math.abs(x-col)<=1+(level>=4?1:0))targets.push(y*8+x);}
 if(color===8){const row=Math.floor(anchor/8),col=anchor%8,reach=level>=4?3:2;for(let k=-reach;k<=reach;k++)for(const x of [col+k,col-k]){const y=row+k;if(y>=0&&y<8&&x>=0&&x<8)targets.push(y*8+x);}}
 const result=targets.length?settlePowerBoard(board,design.colors,[...new Set(targets)],random):{removed:0,crystals:0,specials:0,waves:[]};
 if(color===0)for(const gift of created)if(board[gift.index])board[gift.index].crystal=true;
 battle.score=(battle.score??0)+result.removed*35+result.crystals*75+created.length*45;
 return {...result,color,anchor,centers,created,targets:[...new Set(targets)]};
}
export function streakAfter(previous,color){const count=previous.color===color?previous.count+1:1;return {color,count,casts:count>=2};}
export function affinity(monster,color){return monster.weak.includes(color)?1.45:monster.resist.includes(color)?.55:1;}
export function spellPower(state,battle,color,removed=3){const level=state.levels[color],multiplier=level>=2&&battle.streak.count>=3?1.5:1,gear=GEAR.staff[state.gear.staff].attack,focus=GEAR.ring[state.gear.ring].focus,base=14+level*6+gear+Math.min(12,Math.max(0,removed-3)*2),factor=affinity(ENEMIES[battle.enemyId],color)*(1+focus)*(battle.vulnerable?1.25:1);return {damage:Math.max(1,Math.round(base*multiplier*factor)),multiplier,affinity:affinity(ENEMIES[battle.enemyId],color)};}
export function comboFor(state,previous,current){return SCROLLS.find(s=>state.scrolls.includes(s.id)&&s.pair[0]===previous&&s.pair[1]===current)||null;}
export function newBattle(state,random=Math.random){const design=stageDesign(state.stage),first=design.waves>1?Math.round(design.hp*.6):design.hp,enemyId=design.waves>1?ACTS[design.act].enemy.find(id=>id!==design.enemyId):design.enemyId;return {enemyId,enemyHP:first,enemyMax:first,wave:1,heroHP:maxHP(state),shield:0,board:makeBoard(design.size,design.colors,random),streak:{color:-1,count:0},previousSpell:-1,turn:0,score:0,enemyCharge:0,delay:0,burn:0,vulnerable:0,wet:0,phase:'playing',lastEvent:''};}
export function activateRemainingSpecials(board,colors,random=Math.random){const activations=[];let cleared=0,triggered=0;for(let pass=0;pass<64;pass++){const index=board.findIndex(g=>g?.special);if(index<0)break;const type=board[index].special,result=templeAffected(board,[index]);for(const i of result.cells)board[i]=null;templeCollapse(board,colors,random);activations.push({index,type,cells:result.cells,effects:result.effects});cleared+=result.cells.length;triggered+=result.effects.length;}return {activations,cleared,triggered};}
function finishEnemy(state,design,events){const battle=state.battle;if((battle.wave??1)<design.waves){battle.wave=(battle.wave??1)+1;const index=battle.wave,enemyId=index===design.waves?design.enemyId:state.stage===200?21:ACTS[design.act].enemy[7];battle.enemyId=enemyId;battle.enemyMax=Math.round(design.hp*(index===design.waves?1:.78));battle.enemyHP=battle.enemyMax;battle.heroHP=Math.min(maxHP(state),battle.heroHP+Math.round(maxHP(state)*.12));battle.shield=Math.min(100,battle.shield+18);battle.enemyCharge=0;battle.burn=0;battle.delay=0;battle.vulnerable=0;events.push({kind:'wave',wave:index,waves:design.waves,enemyId,heal:Math.round(maxHP(state)*.12)});return;}
 const {activations,cleared,triggered}=activateRemainingSpecials(battle.board,design.colors);
 const remaining=activations.length,bonus=cleared*50+triggered*100,bonusCoins=Math.round(bonus/40);battle.score=(battle.score??0)+bonus;battle.finalBonusCoins=bonusCoins;events.push({kind:'finale',remaining,bonus,bonusCoins,activations});battle.phase='won';state.coins+=design.reward+bonusCoins;if(!state.cleared.includes(state.stage))state.cleared.push(state.stage);unlockReward(state,state.stage);state.won=state.stage===LAST_STAGE;events.push({kind:'victory',reward:design.reward,bonusCoins,unlock:design.guardian&&design.act<3?design.act+6:null});}
export function resolveTurn(state,a,b,random=Math.random){const d=stageDesign(state.stage),battle=state.battle;if(!battle||battle.phase!=='playing')return {valid:false};const match=swapAndResolve(battle.board,d.size,d.colors,a,b,random);if(!match.valid)return {valid:false};battle.streak=streakAfter(battle.streak,match.color);battle.turn++;battle.score=(battle.score??0)+match.removed*50+Math.max(0,match.cascades-1)*100+match.specialsTriggered*100;const events=[{kind:'match',color:match.color,removed:match.removed,cascades:match.cascades,waves:match.waves,anchor:b}];if(match.specialsCreated||match.specialsTriggered){const damage=match.specialsTriggered*24;battle.enemyHP=Math.max(0,battle.enemyHP-damage);events.push({kind:'special',created:match.specialsCreated,triggered:match.specialsTriggered,damage});}if(battle.streak.casts&&canUseRune(state,match.color)){const color=match.color,p=spellPower(state,battle,color,match.removed);let damage=p.damage,heal=0,shield=0,delay=0;const combo=comboFor(state,battle.previousSpell,color);if(combo){const factor={storm:2.25,ice:1.75,magma:2,eclipse:1.65,bloom:.75,inferno:2.35,reef:1.2,overload:2.6}[combo.id]??1;damage=Math.round(damage*factor);if(combo.id==='storm')delay=1;if(combo.id==='ice'||combo.id==='eclipse'||combo.id==='overload')delay=2;if(combo.id==='magma')battle.burn=3;if(combo.id==='inferno')battle.burn=5;if(combo.id==='bloom'){heal=26;shield=15;}if(combo.id==='reef'){heal=35;shield=30;}events.push({kind:'combo',id:combo.id,name:combo.name});battle.previousSpell=-1;}else battle.previousSpell=color;
 if(color===0){heal+=Math.round(9+p.multiplier*state.levels[0]*2);shield+=5;}
 if(color===1)battle.burn=Math.max(battle.burn,2);
 if(color===2&&battle.wet>0)damage=Math.round(damage*1.2);
 if(color===3)shield+=12+state.levels[3]*2;
 if(color===4)battle.vulnerable=4;
 if(color===5)delay+=1;
 if(color===6)battle.wet=4;
 if(color===7)shield+=9+state.levels[7]*2;
 if(color===8)delay+=battle.wet>0?1:0;
 const boardEffect=totemBoardEffect(state,battle,color,b,random);damage+=Math.round(boardEffect.removed*(color===1?2.5:1.7));if(boardEffect.targets.length||boardEffect.created.length)events.push({kind:'boardPower',...boardEffect});
 battle.heroHP=Math.min(maxHP(state),battle.heroHP+heal);battle.shield=Math.min(100,battle.shield+shield);battle.delay+=delay;battle.enemyHP=Math.max(0,battle.enemyHP-damage);events.push({kind:'spell',color,damage,heal,shield,delay,multiplier:p.multiplier,affinity:p.affinity});
 }else events.push({kind:'charge',color:match.color,count:battle.streak.count});
 if(battle.enemyHP<=0){finishEnemy(state,d,events);return {valid:true,events,battle};}
 if(battle.burn>0){const burn=Math.round(7+state.levels[1]*1.5);battle.enemyHP=Math.max(0,battle.enemyHP-burn);battle.burn--;events.push({kind:'burn',damage:burn});if(battle.enemyHP<=0){finishEnemy(state,d,events);return {valid:true,events,battle};}}
 if(battle.delay>0){battle.delay--;events.push({kind:'delayed'});}else{battle.enemyCharge++;if(battle.enemyCharge>=d.cadence){battle.enemyCharge=0;const armor=GEAR.robe[state.gear.robe].armor,hit=Math.max(1,d.attack-armor),blocked=Math.min(hit,battle.shield);battle.shield-=blocked;battle.heroHP=Math.max(0,battle.heroHP-(hit-blocked));events.push({kind:'counter',damage:hit-blocked,blocked,attack:d.enemy.attack});if(battle.heroHP<=0){battle.phase='lost';events.push({kind:'defeat'});}}}
 battle.wet=Math.max(0,battle.wet-1);battle.vulnerable=Math.max(0,battle.vulnerable-1);return {valid:true,events,battle};}
export function advanceStage(state){if(state.battle?.phase!=='won')return false;if(state.stage>=LAST_STAGE)return false;state.stage++;state.battle=newBattle(state);return true;}
