export const FIRST_STAGE=101,LAST_STAGE=150;
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
  {name:'태초의 용 아즈라엘',sprite:11,weak:[6,4],resist:[1,7],attack:'종말의 화염'}
];
export const ACTS=[
 {title:'낯선 숲',subtitle:'태양의 문 너머',goal:'세계의 첫 숨결을 찾아',intro:'보물상자를 열자 사원의 천장은 별하늘로 바뀌었다. 태양의 힘을 지닌 마법사는 낯선 숲에 떨어진다.',enemy:[0,1,0,5,4,1,2,5,4,5],boss:'호수의 수호자',reward:'물의 토템'},
 {title:'살아 있는 산맥',subtitle:'돌의 기억',goal:'대지의 심장을 찾아',intro:'물의 토템은 산속에서 들려오는 낮은 박동을 가리킨다. 바위 밑에 묻힌 오래된 마법을 깨워야 한다.',enemy:[2,3,1,2,3,3,5,7,3,3],boss:'산의 심장',reward:'대지의 토템'},
 {title:'바람의 계단',subtitle:'하늘을 잇는 균열',goal:'마지막 토템을 찾아',intro:'대지의 심장에서 하늘로 올라가는 계단이 열린다. 폭풍 한가운데 마지막 원소의 목소리가 있다.',enemy:[4,6,5,4,6,6,7,4,6,6],boss:'폭풍의 파수꾼',reward:'바람의 토템'},
 {title:'겨울의 왕좌',subtitle:'아홉 힘의 시험',goal:'용의 봉인을 풀어',intro:'아홉 토템이 울리자 얼어붙은 왕좌가 깨어난다. 적들은 마법을 배우고, 마법사는 상성을 익혀야 한다.',enemy:[8,7,9,8,9,8,6,9,8,9],boss:'거울의 대마법사',reward:'용의 좌표'},
 {title:'용의 성채',subtitle:'끝의 시작',goal:'아즈라엘을 막아',intro:'성채는 아홉 원소의 균형으로 떠 있다. 태초의 용은 세계를 지키기 위해 모든 마법을 삼키려 한다.',enemy:[10,9,7,10,8,10,9,10,10,11],boss:'태초의 용 아즈라엘',reward:'이세계의 수호자'}
];
const particle=(word,withFinal,withoutFinal)=>{const c=word.charCodeAt(word.length-1);return c>=0xac00&&c<=0xd7a3&&(c-0xac00)%28!==0?withFinal:withoutFinal;};
const BEATS=['흔적','첫 조우','깊은 길','흩어진 기억','문지기','잔향','되살아난 수호','협곡','마지막 표식','결전'];
export const SCROLLS=[
 {id:'storm',name:'폭풍 전도',pair:[6,2],price:120,icon:'⚡',desc:'물 → 번개: 젖은 적에 강타, 반격 1회 지연',color:'#80dfff'},
 {id:'ice',name:'빙결 회랑',pair:[8,6],price:150,icon:'❄',desc:'바람 → 물: 얼음 피해, 반격 2회 지연',color:'#b7f0ff'},
 {id:'magma',name:'용암 결속',pair:[7,1],price:170,icon:'✦',desc:'대지 → 불: 용암 폭발, 지속 화상',color:'#ff9561'},
 {id:'eclipse',name:'영원의 월식',pair:[4,5],price:190,icon:'☽',desc:'달 → 시간: 시간 균열, 추가 피해와 반격 지연',color:'#d7adff'},
 {id:'bloom',name:'생명의 광휘',pair:[0,3],price:140,icon:'✿',desc:'비취 → 황금: 치유와 방어막 강화',color:'#a8efb4'}
];
export const GEAR={
 staff:[{name:'나무 지팡이',price:0,attack:0},{name:'수정 지팡이',price:70,attack:10},{name:'별무늬 지팡이',price:210,attack:22},{name:'용언 지팡이',price:490,attack:38}],
 robe:[{name:'여행 망토',price:0,hp:0,armor:0},{name:'수호 로브',price:80,hp:25,armor:3},{name:'달빛 로브',price:230,hp:55,armor:6},{name:'용린 로브',price:520,hp:90,armor:10}],
 ring:[{name:'낡은 반지',price:0,focus:0},{name:'공명 반지',price:90,focus:.08},{name:'별의 반지',price:250,focus:.17},{name:'태초의 반지',price:550,focus:.27}]
};
export function stageDesign(stage){if(!Number.isInteger(stage)||stage<FIRST_STAGE||stage>LAST_STAGE)throw new RangeError('전투 단계는 101~150');const act=Math.floor((stage-FIRST_STAGE)/10),step=(stage-FIRST_STAGE)%10,chapter=ACTS[act],enemyId=chapter.enemy[step],enemy=ENEMIES[enemyId],boss=step===9,guardian=step===4,size=act===0?6:act<=2?7:8;
 const health=Math.round((86+act*42+step*15)*(boss?(stage===LAST_STAGE?1.9:1.6):guardian?1.32:1));
 return {stage,act,step,size,colors:6+(stage>=106)+(stage>=116)+(stage>=126),enemyId,enemy,name:boss?chapter.boss:guardian?`${enemy.name} · 문지기`:`${enemy.name} · ${BEATS[step]}`,title:chapter.title,subtitle:chapter.subtitle,goal:chapter.goal,boss,guardian,hp:health,attack:Math.round(8+act*4+step*.8+(boss?5:0)),cadence:boss?3:step>=6?2:3,reward:Math.round(48+act*18+step*9+(boss?85:guardian?35:0)),story:step===0?chapter.intro:boss?`“${chapter.boss}”가 길을 막는다. 이 결전 뒤에 다음 지역으로 가는 문이 열린다.`:guardian?`${chapter.goal}. ${enemy.name}${particle(enemy.name,'이','가')} 문을 지키며 원소의 힘을 시험한다.`:`${chapter.title}의 ${BEATS[step]}에서 ${enemy.name}${particle(enemy.name,'과','와')} 마주친다. 약한 마법을 골라 길을 연다.`};}
export function maxHP(state){return 140+GEAR.robe[state.gear.robe].hp;}
export function initialState(legacyLevels=[5,5,5,5,5,5]){return {version:1,stage:FIRST_STAGE,coins:0,gear:{staff:0,robe:0,ring:0},scrolls:[],levels:[...Array.from({length:6},(_,i)=>Math.max(1,Math.min(5,Number(legacyLevels[i])||5))),0,0,0],cleared:[],battle:null,won:false};}
export function canUseRune(state,index){return index>=0&&index<9&&state.levels[index]>0;}
export function unlockReward(state,stage){if(stage===105)state.levels[6]=Math.max(1,state.levels[6]);if(stage===115)state.levels[7]=Math.max(1,state.levels[7]);if(stage===125)state.levels[8]=Math.max(1,state.levels[8]);}
export function equipmentPrice(state,slot){const next=state.gear[slot]+1;return GEAR[slot]?.[next]?.price??null;}
export function buyGear(state,slot){const price=equipmentPrice(state,slot);if(price===null||state.coins<price)return false;state.coins-=price;state.gear[slot]++;if(slot==='robe'&&state.battle)state.battle.heroHP=Math.min(maxHP(state),state.battle.heroHP+GEAR.robe[state.gear.robe].hp-GEAR.robe[state.gear.robe-1].hp);return true;}
export function buyScroll(state,id){const s=SCROLLS.find(s=>s.id===id);if(!s||state.scrolls.includes(id)||state.coins<s.price)return false;state.coins-=s.price;state.scrolls.push(id);return true;}
export function trainRune(state,index){if(index<6||index>8||!canUseRune(state,index)||state.levels[index]>=5)return false;const cost=55+state.levels[index]*65;if(state.coins<cost)return false;state.coins-=cost;state.levels[index]++;return true;}
export function matches(board,size){const out=[];for(let r=0;r<size;r++)for(let c=0;c<size;){const v=board[r*size+c],color=v?.color;let n=1;while(c+n<size&&board[r*size+c+n]?.color===color)n++;if(color!==undefined&&n>=3)out.push({cells:Array.from({length:n},(_,i)=>r*size+c+i),color,length:n});c+=n;}for(let c=0;c<size;c++)for(let r=0;r<size;){const v=board[r*size+c],color=v?.color;let n=1;while(r+n<size&&board[(r+n)*size+c]?.color===color)n++;if(color!==undefined&&n>=3)out.push({cells:Array.from({length:n},(_,i)=>(r+i)*size+c),color,length:n});r+=n;}return out;}
export function adjacent(a,b,size){return a>=0&&b>=0&&a<size*size&&b<size*size&&Math.abs(Math.floor(a/size)-Math.floor(b/size))+Math.abs(a%size-b%size)===1;}
export function possibleMoves(board,size,color=-1){const moves=[];for(let a=0;a<board.length;a++)for(const b of[a+1,a+size]){if(!adjacent(a,b,size))continue;[board[a],board[b]]=[board[b],board[a]];const m=matches(board,size),primary=m.find(g=>g.cells.includes(b))??m.find(g=>g.cells.includes(a))??m[0];[board[a],board[b]]=[board[b],board[a]];if(primary&&(color<0||primary.color===color))moves.push({a,b,color:primary.color,size:primary.length});}return moves;}
export function makeBoard(size,colors,random=Math.random){let board;for(let attempt=0;attempt<500;attempt++){board=[];for(let i=0;i<size*size;i++){let color;do{color=Math.floor(random()*colors);}while((i%size>=2&&board[i-1].color===color&&board[i-2].color===color)||(i>=size*2&&board[i-size].color===color&&board[i-size*2].color===color));board.push({color});}if(possibleMoves(board,size).length)return board;}throw new Error('보석판을 만들 수 없습니다');}
export function refill(board,size,colors,random=Math.random){for(let c=0;c<size;c++){let dest=size-1;for(let r=size-1;r>=0;r--){const i=r*size+c;if(board[i]){board[dest*size+c]=board[i];if(dest!==r)board[i]=null;dest--;}}while(dest>=0)board[dest--*size+c]={color:Math.floor(random()*colors)};}return board;}
export function swapAndResolve(board,size,colors,a,b,random=Math.random){if(!adjacent(a,b,size))return {valid:false};[board[a],board[b]]=[board[b],board[a]];const first=matches(board,size),primary=first.find(g=>g.cells.includes(b))??first.find(g=>g.cells.includes(a))??first[0];if(!primary){[board[a],board[b]]=[board[b],board[a]];return {valid:false};}let removed=0,cascades=0,charged=0;for(let groups=first;groups.length&&cascades<30;groups=matches(board,size)){const cells=[...new Set(groups.flatMap(g=>g.cells))];removed+=cells.length;charged+=groups.filter(g=>g.length>=4).length;for(const i of cells)board[i]=null;refill(board,size,colors,random);cascades++;}if(!possibleMoves(board,size).length){const fresh=makeBoard(size,colors,random);board.splice(0,board.length,...fresh);}return {valid:true,color:primary.color,removed,cascades,charged};}
export function streakAfter(previous,color){const count=previous.color===color?previous.count+1:1;return {color,count,casts:count>=2};}
export function affinity(monster,color){return monster.weak.includes(color)?1.45:monster.resist.includes(color)?.55:1;}
export function spellPower(state,battle,color,removed=3){const level=state.levels[color],multiplier=level>=2&&battle.streak.count>=3?1.5:1,gear=GEAR.staff[state.gear.staff].attack,focus=GEAR.ring[state.gear.ring].focus,base=14+level*6+gear+Math.min(12,Math.max(0,removed-3)*2),factor=affinity(ENEMIES[battle.enemyId],color)*(1+focus)*(battle.vulnerable?1.25:1);return {damage:Math.max(1,Math.round(base*multiplier*factor)),multiplier,affinity:affinity(ENEMIES[battle.enemyId],color)};}
export function comboFor(state,previous,current){return SCROLLS.find(s=>state.scrolls.includes(s.id)&&s.pair[0]===previous&&s.pair[1]===current)||null;}
export function newBattle(state,random=Math.random){const design=stageDesign(state.stage);return {enemyId:design.enemyId,enemyHP:design.hp,heroHP:maxHP(state),shield:0,board:makeBoard(design.size,design.colors,random),streak:{color:-1,count:0},previousSpell:-1,turn:0,enemyCharge:0,delay:0,burn:0,vulnerable:0,wet:0,phase:'playing',lastEvent:''};}
export function resolveTurn(state,a,b,random=Math.random){const d=stageDesign(state.stage),battle=state.battle;if(!battle||battle.phase!=='playing')return {valid:false};const match=swapAndResolve(battle.board,d.size,d.colors,a,b,random);if(!match.valid)return {valid:false};battle.streak=streakAfter(battle.streak,match.color);battle.turn++;const events=[{kind:'match',color:match.color,removed:match.removed,cascades:match.cascades}];if(battle.streak.casts&&canUseRune(state,match.color)){const color=match.color,p=spellPower(state,battle,color,match.removed);let damage=p.damage,heal=0,shield=0,delay=0;const combo=comboFor(state,battle.previousSpell,color);if(combo){damage=Math.round(damage*(combo.id==='storm'?2.25:combo.id==='ice'?1.75:combo.id==='magma'?2:combo.id==='eclipse'?1.65:.75));if(combo.id==='storm')delay=1;if(combo.id==='ice')delay=2;if(combo.id==='magma')battle.burn=3;if(combo.id==='eclipse')delay=2;if(combo.id==='bloom'){heal=26;shield=15;}events.push({kind:'combo',id:combo.id,name:combo.name});battle.previousSpell=-1;}else battle.previousSpell=color;
 if(color===0){heal+=Math.round(9+p.multiplier*state.levels[0]*2);shield+=5;}
 if(color===1)battle.burn=Math.max(battle.burn,2);
 if(color===2&&battle.wet>0)damage=Math.round(damage*1.2);
 if(color===3)shield+=12+state.levels[3]*2;
 if(color===4)battle.vulnerable=4;
 if(color===5)delay+=1;
 if(color===6)battle.wet=4;
 if(color===7)shield+=9+state.levels[7]*2;
 if(color===8)delay+=battle.wet>0?1:0;
 battle.heroHP=Math.min(maxHP(state),battle.heroHP+heal);battle.shield=Math.min(80,battle.shield+shield);battle.delay+=delay;battle.enemyHP=Math.max(0,battle.enemyHP-damage);events.push({kind:'spell',color,damage,heal,shield,delay,multiplier:p.multiplier,affinity:p.affinity});
 }else events.push({kind:'charge',color:match.color,count:battle.streak.count});
 if(battle.enemyHP<=0){battle.phase='won';const reward=d.reward;state.coins+=reward;state.cleared.push(state.stage);unlockReward(state,state.stage);state.won=state.stage===LAST_STAGE;events.push({kind:'victory',reward,unlock:d.guardian&&d.act<3?d.act+6:null});return {valid:true,events,battle};}
 if(battle.burn>0){const burn=Math.round(7+state.levels[1]*1.5);battle.enemyHP=Math.max(0,battle.enemyHP-burn);battle.burn--;events.push({kind:'burn',damage:burn});if(battle.enemyHP<=0){battle.phase='won';state.coins+=d.reward;state.cleared.push(state.stage);unlockReward(state,state.stage);state.won=state.stage===LAST_STAGE;events.push({kind:'victory',reward:d.reward,unlock:d.guardian&&d.act<3?d.act+6:null});return {valid:true,events,battle};}}
 if(battle.delay>0){battle.delay--;events.push({kind:'delayed'});}else{battle.enemyCharge++;if(battle.enemyCharge>=d.cadence){battle.enemyCharge=0;const armor=GEAR.robe[state.gear.robe].armor,hit=Math.max(1,d.attack-armor),blocked=Math.min(hit,battle.shield);battle.shield-=blocked;battle.heroHP=Math.max(0,battle.heroHP-(hit-blocked));events.push({kind:'counter',damage:hit-blocked,blocked,attack:d.enemy.attack});if(battle.heroHP<=0){battle.phase='lost';events.push({kind:'defeat'});}}}
 battle.wet=Math.max(0,battle.wet-1);battle.vulnerable=Math.max(0,battle.vulnerable-1);return {valid:true,events,battle};}
export function advanceStage(state){if(state.battle?.phase!=='won')return false;if(state.stage>=LAST_STAGE)return false;state.stage++;state.battle=newBattle(state);return true;}
