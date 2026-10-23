export const SIZE=8, COLORS=6, STAGE_COUNT=100;
export const TOTEMS=[
  {name:'비취의 수확',shortName:'비취',color:'비취',icon:'gem',priority:5,priorityTag:'💎 5순위 · 수정 수확',unlockCost:0,unlock:1,accent:'#6ee2ae',desc:'수정을 즉시 회수하고 새 수정을 생성'},
  {name:'불의 심판',shortName:'불',color:'루비',icon:'sun',priority:1,priorityTag:'🥇 1순위 추천 · 화력 종결',unlockCost:2,unlock:2,accent:'#ff8a89',desc:'광역 불덩이 융단폭격으로 보석과 봉인 분쇄'},
  {name:'천둥의 분노',shortName:'번개',color:'사파이어',icon:'bolt',priority:4,priorityTag:'⚡ 4순위 · 사방 번개',unlockCost:4,unlock:3,accent:'#80d7f1',desc:'움직인 보석 주변 사방으로 번개 레이저 감전'},
  {name:'황금의 축복',shortName:'황금',color:'황금',icon:'sun',priority:6,priorityTag:'👑 6순위 · 점수 폭발',unlockCost:6,unlock:5,accent:'#efcf7e',desc:'대량 보너스 점수 및 피버 3배 에너지 급속 충전'},
  {name:'달의 선물',shortName:'달',color:'자수정',icon:'moon',priority:3,priorityTag:'🥉 3순위 추천 · 특수 생성',unlockCost:8,unlock:7,accent:'#c8a5ff',desc:'보석판에 폭탄, 번개 레이저, 노바 직접 부여'},
  {name:'시간의 숨결',shortName:'시간',color:'호박',icon:'freeze',priority:2,priorityTag:'🥈 2순위 추천 · 시간 구원',unlockCost:10,unlock:10,accent:'#ffb781',desc:'제한 시간 대폭 연장 및 시간 정지 결계'}
];
export function totemLevelSpecs(index, level){
  if(level===0) return {cur:'잠김 (사용 불가)', next:`★${TOTEMS[index].unlockCost}개로 해금 시 즉시 기본 발동`};
  const specs=[
    // 0: 비취
    [
      {cur:'수정 2개 회수 · 2개 생성', next:'수정 3개 회수 · 3개 생성 & 3연속 1.5배 해금'},
      {cur:'수정 3개 회수 · 3개 생성 (3연속 시 5개)', next:'수정 4개 회수 · 4개 생성 (3연속 시 6개)'},
      {cur:'수정 4개 회수 · 4개 생성', next:'수정 5개 회수 · 5개 생성 (3연속 시 8개)'},
      {cur:'수정 5개 회수 · 5개 생성', next:'수정 6개 회수 · 6개 생성 (최고 위력)'},
      {cur:'수정 6개 회수 · 6개 생성 (3연속 시 9개 대수확)', next:'최고 레벨 (MAX)'}
    ],
    // 1: 불
    [
      {cur:'불덩이 1발 (반경 1칸 파괴)', next:'불덩이 2발로 증가 & 3연속 1.5배 각성 해금!'},
      {cur:'불덩이 2발 (3연속 시 3발)', next:'불덩이 3발 폭격 (3연속 시 5발 대폭발)'},
      {cur:'불덩이 3발 폭격', next:'폭발 반경 2칸(5×5) 대폭 확대! 초토화'},
      {cur:'불덩이 4발 (폭발 반경 2칸)', next:'불덩이 5발 전방위 융단폭격 (사원 일소)'},
      {cur:'불덩이 5발 (반경 2칸 · 3연속 시 8발)', next:'최고 레벨 (MAX)'}
    ],
    // 2: 번개
    [
      {cur:'주변 사방 5개 감전 (반경 1.5칸)', next:'감전 7개로 증가 & 3연속 1.5배 해금'},
      {cur:'감전 7개 (3연속 시 11개 레이저)', next:'감전 9개 · 반경 2.3칸 전방위 관통'},
      {cur:'감전 9개 (반경 2.3칸)', next:'감전 11개 · 전방위 벼락 폭풍'},
      {cur:'감전 11개 (반경 2.7칸)', next:'감전 13개 번개망 (3연속 시 20개 감전)'},
      {cur:'감전 13개 전 화면 뇌우 (3연속 시 20개)', next:'최고 레벨 (MAX)'}
    ],
    // 3: 황금
    [
      {cur:'보너스 +300점 · 피버 +20%', next:'보너스 +600점 · 피버 +25% & 3연속 1.5배 해금'},
      {cur:'보너스 +600점 · 피버 +25%', next:'보너스 +900점 · 피버 +30% & 지속 +1.5초'},
      {cur:'보너스 +900점 · 피버 +30%', next:'보너스 +1,200점 · 피버 +35% & 지속 +2초'},
      {cur:'보너스 +1,200점 · 피버 +35%', next:'보너스 +1,500점 · 피버 +40% (점수 폭증)'},
      {cur:'보너스 +1,500점 · 피버 +40% (3연속 시 2,250점)', next:'최고 레벨 (MAX)'}
    ],
    // 4: 달
    [
      {cur:'무작위 특수 보석 1개 (폭탄)', next:'특수 보석 2개 (폭탄+번개) & 3연속 1.5배'},
      {cur:'특수 보석 2개 (폭탄+번개)', next:'특수 보석 3개 (십자 레이저 관통석 포함)'},
      {cur:'특수 보석 3개', next:'특수 보석 4개 (폭탄2+레이저2 쏟아짐)'},
      {cur:'특수 보석 4개', next:'궁극기 [노바 대폭발석] 확정 생성 해금!'},
      {cur:'특수 보석 5개 (전 화면 노바 확정 생성)', next:'최고 레벨 (MAX)'}
    ],
    // 5: 시간
    [
      {cur:'시간 +5초 연장', next:'시간 +7초 & 3연속 1.5배 (+11초) 해금!'},
      {cur:'시간 +7초 (3연속 시 +11초)', next:'시간 +9초 & 시간 정지 3초 결계 해금!'},
      {cur:'시간 +9초 · 시간 정지 3초', next:'시간 +11초 · 시간 정지 4초 (안정적 공략)'},
      {cur:'시간 +11초 · 시간 정지 4초', next:'시간 +13초 · 시간 정지 5초 (무한 플레이급)'},
      {cur:'시간 +13초 · 시간 정지 5초 (3연속 시 +20초)', next:'최고 레벨 (MAX)'}
    ]
  ];
  return specs[index]?.[level-1] || {cur:'최대 강화 완료', next:'MAX'};
}
export function advanceTotem(previous,color){const count=previous.color===color?previous.count+1:1;return {color,count,trigger:count>=2};}
export function totemPower(color,level,streak){const multiplier=level>=2&&streak>=3?1.5:1;return {multiplier,harvest:Math.ceil((level+1)*multiplier),gifts:Math.ceil(level*multiplier),bonus:300*level*multiplier,energy:(15+5*level)*multiplier,seconds:(3+2*level)*multiplier,stasis:level>=3?level*multiplier:0};}
export function fireTargets(level,previous=[],random=Math.random){const chosen=[],count=Math.max(1,Math.min(5,Math.floor(level)));for(let k=0;k<count;k++){let pool=Array.from({length:64},(_,i)=>i).filter(i=>!chosen.includes(i)&&!previous.includes(i));const spread=pool.filter(i=>chosen.every(j=>Math.hypot(i%8-j%8,Math.floor(i/8)-Math.floor(j/8))>=3));if(spread.length)pool=spread;chosen.push(pool[Math.min(pool.length-1,Math.floor(Math.max(0,random())*pool.length))]);}return chosen;}
function sample(pool,count,random){const rest=[...pool],picked=[];while(rest.length&&picked.length<count)picked.push(rest.splice(Math.min(rest.length-1,Math.floor(Math.max(0,random())*rest.length)),1)[0]);return picked;}
export function thunderTargets(level,streak,anchor,random=Math.random){const l=Math.max(1,Math.min(5,level)),multiplier=totemPower(2,l,streak).multiplier,radius=1.5+(l-1)*.4+(multiplier>1?.6:0),x=anchor%8,y=Math.floor(anchor/8),count=Math.ceil((5+(l-1)*2)*multiplier),cells=[anchor],pool=Array.from({length:64},(_,i)=>i).filter(i=>i!==anchor&&Math.hypot(i%8-x,Math.floor(i/8)-y)<=radius),sectors=Array(4).fill(0),sector=i=>Math.floor((Math.atan2(Math.floor(i/8)-y,i%8-x)+Math.PI/4+Math.PI*2)%(Math.PI*2)/(Math.PI/2));while(pool.length&&cells.length<count){const available=[...new Set(pool.map(sector))],least=Math.min(...available.map(q=>sectors[q])),options=pool.filter(i=>sectors[sector(i)]===least),hit=sample(options,1,random)[0];cells.push(hit);sectors[sector(hit)]++;pool.splice(pool.indexOf(hit),1);}return {anchor,radius,cells};}
export function harvestTargets(board,level,streak,random=Math.random){const p=totemPower(0,level,streak),collect=sample(board.flatMap((g,i)=>g?.crystal?[i]:[]),p.harvest,random),create=sample(board.flatMap((g,i)=>g&&!g.crystal?[i]:[]),p.harvest,random);return {collect,create};}
export function lunarTargets(board,level,streak,random=Math.random){const p=totemPower(4,level,streak);return sample(board.flatMap((g,i)=>g&&!g.special?[i]:[]),p.gifts,random).map((index,k)=>({index,special:level>=5&&k===0?'nova':level>=3&&k%3===2?'col':k%2?'row':'bomb'}));}
export function amplifyCells(initial,multiplier,center){const cells=[...new Set(initial)],target=Math.min(64,Math.ceil(cells.length*multiplier));if(cells.length>=target)return cells;const distance=(a,b)=>Math.hypot(a%8-b%8,Math.floor(a/8)-Math.floor(b/8));const rest=Array.from({length:64},(_,i)=>i).filter(i=>!cells.includes(i));rest.sort((a,b)=>Math.min(...cells.map(i=>distance(a,i)))-Math.min(...cells.map(i=>distance(b,i)))||distance(a,center)-distance(b,center)||a-b);return cells.concat(rest.slice(0,target-cells.length));}
export function upgradeCost(level, totemIndex=0){if(level===0)return TOTEMS[totemIndex]?.unlockCost||2;return level>=5?null:level*2;}

export function stageReward(previous,stars){return Math.max(0,Math.min(3,stars)-Math.max(0,previous));}
export function chapterIndex(stage){return Math.min(4,Math.floor((stage-1)/20));}
export const colorNames=['비취','루비','사파이어','황금','자수정','호박'];
export const chapters=[['태양의 문','THE GATE OF THE SUN'],['비취의 정원','THE JADE GARDEN'],['번개의 제단','THE THUNDER ALTAR'],['달의 성소','THE LUNAR SANCTUM'],['황금의 심장','THE GOLDEN HEART']];
let serial=0;
export function gem(color=Math.floor(Math.random()*COLORS)){return {id:++serial,color,special:null,crystal:Math.random()<.10};}
export function findMatches(board){const groups=[];for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;){const color=board[r*SIZE+c]?.color;let n=1;while(c+n<SIZE&&board[r*SIZE+c+n]?.color===color&&color!==undefined)n++;if(n>=3)groups.push({cells:Array.from({length:n},(_,i)=>r*SIZE+c+i),axis:'row',color});c+=n;}for(let c=0;c<SIZE;c++)for(let r=0;r<SIZE;){const color=board[r*SIZE+c]?.color;let n=1;while(r+n<SIZE&&board[(r+n)*SIZE+c]?.color===color&&color!==undefined)n++;if(n>=3)groups.push({cells:Array.from({length:n},(_,i)=>(r+i)*SIZE+c),axis:'col',color});r+=n;}return groups;}
export function adjacent(a,b){return Math.abs(Math.floor(a/SIZE)-Math.floor(b/SIZE))+Math.abs(a%SIZE-b%SIZE)===1;}
export function damageSeals(state,cells){const hits=new Set(cells);for(const i of cells)for(const j of [i-8,i+8,i-1,i+1])if(j>=0&&j<64&&adjacent(i,j))hits.add(j);let broken=0;const damaged=[];for(const i of hits)if(state[i]>0){state[i]--;if(!state[i])broken++;damaged.push(i);}return {broken,damaged};}
export function findMove(board,preferredColor=-1,strict=false){let fallback=null;for(let a=0;a<64;a++)for(const b of [a+1,a+8]){if(b>=64||!adjacent(a,b))continue;[board[a],board[b]]=[board[b],board[a]];const groups=findMatches(board),primary=groups.find(g=>g.cells.includes(b))??groups.find(g=>g.cells.includes(a))??groups[0];[board[a],board[b]]=[board[b],board[a]];if(primary){fallback??=[a,b];if(preferredColor<0||primary.color===preferredColor)return[a,b];}}return strict&&preferredColor>=0?null:fallback;}
export function makeBoard(){let board;do{board=[];for(let i=0;i<64;i++){let g;do{g=gem();}while((i%8>=2&&board[i-1].color===g.color&&board[i-2].color===g.color)||(i>=16&&board[i-8].color===g.color&&board[i-16].color===g.color));board.push(g);}}while(!findMove(board));return board;}
export function makeStageBoard(level){if(![1,2].includes(level))return makeBoard();for(let attempt=0;attempt<250;attempt++){const b=makeBoard();if(level===2||level===9){for(const row of [0,4,7]){for(const col of [0,1,3])b[row*8+col].color=1;b[row*8+2].color=2;b[row*8+4].color=0;}}if(level===7){for(const i of [0,1,3,10])b[i].color=4;b[2].color=2;b[4].color=0;}if(findMatches(b).length)continue;const move=findMove(b,level===7?4:level===2||level===9?1:-1);if(!move)continue;[b[move[0]],b[move[1]]]=[b[move[1]],b[move[0]]];const groups=findMatches(b);groups[0].cells.slice(0,2).forEach(i=>b[i].crystal=true);[b[move[0]],b[move[1]]]=[b[move[1]],b[move[0]]];return b;}return makeBoard();}
export function affected(board,initial){const set=new Set(initial),queue=[...set];const effects=[];for(let k=0;k<queue.length;k++){const i=queue[k],g=board[i];if(!g?.special)continue;const r=Math.floor(i/8),c=i%8;effects.push({index:i,type:g.special,color:g.color});const extra=[];if(g.special==='row'||g.special==='cross')for(let x=0;x<8;x++)extra.push(r*8+x);if(g.special==='col'||g.special==='cross')for(let y=0;y<8;y++)extra.push(y*8+c);if(g.special==='bomb')for(let y=Math.max(0,r-1);y<=Math.min(7,r+1);y++)for(let x=Math.max(0,c-1);x<=Math.min(7,c+1);x++)extra.push(y*8+x);if(g.special==='nova')board.forEach((v,n)=>{if(v?.color===g.color)extra.push(n);});for(const n of extra)if(!set.has(n)){set.add(n);queue.push(n);}}return {cells:[...set],effects};}
export function specialCreations(groups,preferred=[]){const creations=new Map;const count=new Map;groups.forEach(g=>g.cells.forEach(i=>count.set(i,(count.get(i)||0)+1)));for(const [i,n]of count)if(n>1)creations.set(i,'bomb');for(const g of groups){if(g.cells.some(i=>creations.has(i)))continue;if(g.cells.length>=4){const i=preferred.find(i=>g.cells.includes(i))??g.cells[Math.floor(g.cells.length/2)];creations.set(i,g.cells.length>=5?'nova':g.axis);}}return creations;}
export function collapse(board){for(let c=0;c<8;c++){let dest=7;for(let r=7;r>=0;r--)if(board[r*8+c]){board[dest*8+c]=board[r*8+c];if(dest!==r)board[r*8+c]=null;dest--;}let born=0;while(dest>=0){const g=gem();g.x=c;g.y=-1-born++;board[dest*8+c]=g;dest--;}}return board;}
export function powerCells(type,i,board){const r=Math.floor(i/8),c=i%8;if(type==='lightning')return Array.from({length:64},(_,n)=>n).filter(n=>Math.floor(n/8)===r||n%8===c);if(type==='solar')return Array.from({length:64},(_,n)=>n).filter(n=>Math.hypot(Math.floor(n/8)-r,n%8-c)<=2.65);if(type==='lunar')return board.flatMap((g,n)=>g.color===board[i].color?[n]:[]);return [];}
const STAGE_TYPES=['awakening','totem','colors','seals','bonus','cascade','special','ritual','overdrive','guardian'];
const STAGE_NAMES={awakening:'새벽의 보석',totem:'수호자의 응답',colors:'색상의 제례',seals:'잠든 봉인',bonus:'고요한 보물방',cascade:'연쇄의 계단',special:'별의 공방',ritual:'잃어버린 의식',overdrive:'세 번째 각성',guardian:'사원의 수호자'};
const STAGE_TIPS={awakening:'4·5매치와 토템을 이어 제한 시간 안에 목표를 달성하세요.',totem:'같은 색을 이어가세요. 토템 Lv.2부터 3연속 위력 1.5배!',colors:'목표 색과 특수 보석을 함께 만드는 교환을 찾으세요.',seals:'흩어진 봉인을 공략하세요. 위·옆 매치와 토템이 한 겹씩 깹니다.',bonus:'60초 보물방! 특수 보석과 토템으로 보물을 빠르게 모으세요.',cascade:'제한 시간 안에 도전하세요. 보드 아래쪽에서 연쇄를 설계하세요.',special:'4개·5개·T자 매치로 특수 보석을 직접 만드세요.',ritual:'목표 색을 모으면서 봉인까지 깨는 수를 찾으세요.',overdrive:'토템을 여러 번 발동하세요. Lv.2의 3연속 1.5배가 공략을 돕습니다.',guardian:'제한 시간 안에 봉인, 수정, 토템 목표를 모두 달성하세요.'};
function sealsFor(level,count,hp){const chosen=[],available=Array.from({length:64},(_,i)=>i),distance=(a,b)=>Math.abs(a%8-b%8)+Math.abs(Math.floor(a/8)-Math.floor(b/8));for(let k=0;k<count;k++){available.sort((a,b)=>{const rank=i=>chosen.length?Math.min(...chosen.map(j=>distance(i,j))):0;return rank(b)-rank(a)||((a*19+level*7)%67)-((b*19+level*7)%67);});chosen.push(available.shift());}return chosen.map(index=>({index,hp}));}
export function stageDesign(level){const chapter=chapterIndex(level),local=(level-1)%20+1,beat=(level-1)%10,type=STAGE_TYPES[beat],second=local>10?1:0;
 const stage={level,chapter,type,name:STAGE_NAMES[type],tip:STAGE_TIPS[type],target:4500+chapter*6000+(local-1)*650,crystals:5+chapter*2+Math.floor((local-1)/5),time:85-chapter*3-second*5,focusColor:null,colorTarget:0,seals:[],comboTarget:0,specialTarget:0,totemTarget:0,overdriveTarget:0};
 const hp=chapter>=3?3:chapter>=1||local>10?2:1;
 if(type==='awakening'&&level>1){stage.specialTarget=2+chapter;stage.seals=sealsFor(level,4+chapter*2,hp);}
 if(type==='totem')stage.totemTarget=2+chapter+second;
 if(type==='colors'){stage.focusColor=(chapter+Math.floor((level-1)/10))%6;stage.colorTarget=18+chapter*6+second*3;}
 if(type==='seals')stage.seals=sealsFor(level,10+chapter*3+second*2,hp);
 if(type==='bonus'){stage.time=60;stage.target=Math.round(stage.target*.72);stage.crystals=Math.max(4,stage.crystals-1);stage.seals=sealsFor(level,6+chapter*2,hp);}
 if(type==='cascade'){stage.comboTarget=3+(chapter>=3?1:0);stage.time=95-chapter*5;stage.specialTarget=2+chapter;}
 if(type==='special')stage.specialTarget=3+chapter+second;
 if(type==='ritual'){stage.focusColor=(chapter+1)%6;stage.colorTarget=16+chapter*5;stage.seals=sealsFor(level,10+chapter*3,hp);}
 if(type==='overdrive'){stage.name='토템의 시험';stage.totemTarget=3+chapter+second;stage.specialTarget=2+chapter;stage.time=105-chapter*5;}
 if(type==='guardian'){stage.target+=3500;stage.time=120-chapter*5;stage.seals=sealsFor(level,14+chapter*3+second*2,hp);stage.totemTarget=3+chapter;stage.name=['비취의 수문장','정글의 쌍둥이 수호자','폭풍의 거인','달그림자 사제','황금 태양의 심장'][chapter];}
 if(level===1){stage.name='첫 번째 빛';stage.tip='90초 안에 1,800점과 수정 3개를 모으세요. 4개를 맞추면 특수 보석!';stage.target=1800;stage.crystals=3;stage.time=90;}
 if(level===2){stage.name='두 번의 부름';stage.tip='같은 빨강이나 파랑을 두 번 이어 맞추세요. 토템 2회가 목표입니다.';stage.target=3200;stage.crystals=4;stage.time=90;}
 if(level===3){stage.name='비취를 찾아서';stage.tip='비취 18개와 수정 5개를 모으세요. 목표 색을 만드는 교환이 중요합니다.';stage.target=4500;}
 if(level===4){stage.name='비취 정령의 문';stage.tip='비취 토템 해금! 흩어진 봉인 10개를 제한 시간 안에 공략하세요.';}
 if(level===7)stage.name='달의 선물';
 if(level===9)stage.tip='토템 3회와 특수 보석 2개! 토템 Lv.2부터 3연속 위력 1.5배가 해금됩니다.';
 if(level===10)stage.tip='황금 토템 해금! 120초 안에 봉인 14개와 토템 3회를 달성하세요.';
 stage.target=Math.round(stage.target*(1+(level>=6?.15:0)+chapter*.09)/50)*50;
 stage.timeCap=stage.time+25;
 return stage;
}
export function extendTime(stage,time,p){return Math.min(stage.timeCap,time+p.seconds);}
export function stageGoals(stage,metrics){const goals=[{id:'score',label:'점수',value:metrics.score,target:stage.target},{id:'crystals',label:'수정',value:metrics.crystals,target:stage.crystals}];if(stage.colorTarget)goals.push({id:'color',label:colorNames[stage.focusColor],value:metrics.colorCollected?.[stage.focusColor]||0,target:stage.colorTarget,color:stage.focusColor});if(stage.seals.length)goals.push({id:'seals',label:'봉인',value:metrics.sealsBroken||0,target:stage.seals.length});if(stage.comboTarget)goals.push({id:'combo',label:'최대 연쇄',value:metrics.bestCascade||0,target:stage.comboTarget});if(stage.specialTarget)goals.push({id:'special',label:'특수 보석 생성',value:metrics.specialsMade||0,target:stage.specialTarget});if(stage.totemTarget)goals.push({id:'totem',label:'토템 발동',value:metrics.totemCasts||0,target:stage.totemTarget});if(stage.overdriveTarget)goals.push({id:'overdrive',label:'1.5배 각성',value:metrics.overdrives||0,target:stage.overdriveTarget});return goals.map(g=>({...g,done:g.value>=g.target}));}
export function objectives(level){return stageDesign(level);}

export function stageScenario(level){
  const ci=chapterIndex(level);
  const local=(level-1)%20+1;
  const chapterTitle=chapters[ci][0];
  const chapterSub=chapters[ci][1];
  const scenarios=[
    [
      '태양 사원의 거대한 석문 앞에 도착했습니다. 먼지 쌓인 석판에 새겨진 고대 보석들이 당신의 손길에 은은한 빛을 뿜어냅니다.',
      '닫힌 석문 틈새로 붉고 푸른 기운이 새어나옵니다. 같은 색의 보석을 연속으로 맞추어 고대 수호 토템의 영혼을 깨우세요.',
      '사원 회랑의 바닥에 비취빛 넝쿨 문양이 드러납니다. 녹색 비취 보석을 모아 대지의 맥박을 이어가세요.',
      '첫 번째 관문인 비취 토템의 봉인이 풀렸습니다! 석판 주위에 얽힌 견고한 봉인석들을 깨뜨려 전진하세요.',
      '사원의 숨겨진 보물방이 모습을 드러냈습니다! 시간이 흐르기 전에 쏟아지는 보석과 수정을 최대한 거두세요.',
      '계단 아래로 이어지는 통로에서 보석들이 공명합니다. 아래쪽에서 연속 매치를 설계하여 깊은 연쇄를 유도하세요.',
      '벽화에 보석을 조합하는 비전이 새겨져 있습니다. 4개 이상의 보석을 정렬하여 강력한 힘을 품은 특수 보석을 빚어내세요.',
      '고대 사제들이 거행하던 색상의 제례터입니다. 지정된 색상의 보석을 바치고 바닥의 결계를 정화하세요.',
      '수호 토템들이 더 강한 공명을 요구합니다. 3연속 같은 색 매치로 1.5배 각성의 위력을 증명하세요.',
      '제1장 최후의 관문! 거대한 [비취의 수문장]이 길을 막아섭니다. 모든 토템과 봉인을 격파하고 사원의 중심 문을 여세요!'
    ],
    [
      '안개 자욱한 지하 정글 성소에 당도했습니다. 이슬 머금은 비취 수정들이 신비로운 울림으로 탐험가를 맞이합니다.',
      '거대한 고대 석목 뿌리가 보석판을 감싸고 있습니다. 자연의 에너지를 불어넣어 길을 여세요.',
      '에메랄드빛 폭포 뒤로 숨겨진 제단이 보입니다. 목표 색상의 보석을 모아 물길을 돌리세요.',
      '잠들어 있던 덩굴 룬들이 깨어났습니다. 더욱 단단해진 이중 봉인을 특수 보석과 토템으로 분쇄하세요.',
      '정원의 비밀 수장고가 열렸습니다! 짧은 시간 동안 제한 없이 보물과 수정을 획득하세요.',
      '지하 동굴의 기류가 보석의 낙하를 재촉합니다. 위에서 쏟아지는 연쇄의 리듬을 타세요.',
      '식물 정령들이 보석에 축복을 내립니다. 강력한 노바와 폭탄 보석을 합성하여 길을 트세요.',
      '고대 비취 여신의 제단에서 신비한 의식이 시작됩니다. 흩어진 봉인을 깨고 정원의 축복을 받으세요.',
      '생명의 고동이 붉은 화염과 푸른 번개 토템을 증폭시킵니다. 연속 각성으로 시련을 돌파하세요.',
      '제2장 최후의 관문! 정글의 쌍둥이 수호자가 포효합니다. 맹렬한 연쇄와 토템으로 수호자를 굴복시키세요!'
    ],
    [
      '절벽 꼭대기에 자리한 천둥의 제단에 올라섰습니다. 하늘을 가르는 벼락이 보석판에 전율을 일으킵니다.',
      '푸른 사파이어 번개의 토템이 공명합니다. 벼락의 궤적을 따라 보석들을 관통하세요.',
      '먹구름 사이로 황금빛 햇살이 번뜩입니다. 사파이어와 황금 보석을 집중적으로 수집하세요.',
      '전격 결계로 단단히 잠긴 벼락의 룬을 부수세요. 강력한 레이저 관통석이 필수적입니다.',
      '폭풍우의 눈 한가운데 위치한 보물방입니다! 벼락이 치는 틈을 타 신속하게 수정들을 수확하세요.',
      '연속된 벼락이 보석들을 일제히 내리칩니다. 3연쇄 이상의 강력한 폭풍 콤보를 달성하세요.',
      '공기 중에 전기가 가득합니다. 4·5개 정렬로 빚어낸 번개 보석으로 전방위를 일소하세요.',
      '폭풍의 제례가 거행됩니다. 지정된 색상 보석과 삼중 봉인을 동시에 정화하세요.',
      '번개와 불의 토템이 융합하며 1.5배 초각성을 발휘합니다. 사원의 벽을 부수고 나아가세요.',
      '제3장 최후의 관문! 하늘의 지배자 [폭풍의 거인]이 벼락을 내리꽂습니다. 최강의 번개로 거인을 제압하세요!'
    ],
    [
      '달빛만이 스며드는 신비로운 보랏빛 회랑에 들어섰습니다. 시공간의 흐름이 천천히 왜곡되기 시작합니다.',
      '보라색 자수정 토템이 차원의 문을 열어젖힙니다. 보석들이 미지의 힘으로 변이합니다.',
      '달의 호수 수면에 비친 별빛을 모으세요. 지정된 색상의 보석이 길을 밝혀줍니다.',
      '차원의 그림자가 드리운 단단한 삼중 봉인석입니다. 토템의 파동으로 어둠을 걷어내세요.',
      '달의 신비가 깃든 시공간 정지 보물방입니다! 귀중한 수정을 모으세요.',
      '중력이 일렁이며 보석들이 신비롭게 낙하합니다. 연속 연쇄로 왜곡된 차원을 안정시키세요.',
      '보랏빛 차원의 틈새에서 노바와 폭탄이 탄생합니다. 강력한 특수돌을 쏟아내세요.',
      '달의 여사제들이 남긴 고대 주술의 결계입니다. 색상의 조화로 결계를 해제하세요.',
      '토템들이 차원의 한계를 넘어 1.5배 각성합니다. 마법의 파동으로 전장을 장악하세요.',
      '제4장 최후의 관문! 차원의 지배자 [달그림자 사제]가 환영의 장벽을 펼칩니다. 진실의 빛으로 결계를 깨뜨리세요!'
    ],
    [
      '마침내 전설로만 전해지던 몬테주마의 황금 심장부에 진입했습니다! 사방이 순금으로 찬란히 빛납니다.',
      '황금 토템의 강력한 축복이 피버 게이지를 순식간에 채웁니다. 태양의 각성을 일으키세요.',
      '태양신의 제단에 바칠 황금과 보석들을 가득 모으세요. 사원의 핵심 장치가 작동합니다.',
      '황금으로 주조된 불멸의 수호 봉인석들입니다. 모든 토템의 총력을 모아 타격하세요.',
      '황금 제국의 전설적인 황실 보물창고가 열렸습니다! 끝없이 쏟아지는 수정을 담으세요.',
      '사원 전체가 황금빛으로 진동하며 거대한 연쇄 반응을 일으킵니다. 멈추지 않는 콤보를 완성하세요.',
      '고대 장인들의 궁극의 비전! 보석판 위에 연달아 특수 보석을 창조하여 폭발시키세요.',
      '최후의 의식이 거행됩니다. 6대 토템의 힘과 지정 보석을 완벽히 조화시키세요.',
      '모든 토템이 영구 각성 상태에 돌입합니다! 1.5배 초능력의 향연으로 마지막 길을 여세요.',
      '운명의 최종장! [황금 태양의 심장 몬테주마]의 진정한 각성! 100번째 관문을 돌파하고 고대 제국의 영원한 전설이 되십시오!'
    ]
  ];
  const stepIdx=Math.min(9,Math.floor((local-1)/2));
  const story=scenarios[ci]?.[stepIdx]||`${chapterTitle}의 제${local}관문입니다. 고대 사원의 시련을 통과하여 다음 방으로 전진하세요.`;
  return {chapterIndex:ci,chapterTitle,chapterSub,localStage:local,title:`제${ci+1}장 ${chapterTitle} · 관문 ${local}`,story,isBoss:local===20,isBonus:(local%10===5)};
}
