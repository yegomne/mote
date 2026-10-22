export const SIZE=8, COLORS=6, STAGE_COUNT=100;
export const TOTEMS=[
 {name:'비취의 수확',color:'비취',icon:'gem',unlock:4,accent:'#6ee2ae',desc:'수정을 모으고 새 수정을 생성'},
 {name:'불의 심판',color:'루비',icon:'sun',unlock:1,accent:'#ff8a89',desc:'불덩이와 폭발로 주변 보석 파괴'},
 {name:'천둥의 분노',color:'사파이어',icon:'bolt',unlock:1,accent:'#80d7f1',desc:'번개가 여러 줄의 보석을 관통'},
 {name:'황금의 축복',color:'황금',icon:'sun',unlock:10,accent:'#efcf7e',desc:'보너스 점수와 피버 에너지'},
 {name:'달의 선물',color:'자수정',icon:'moon',unlock:7,accent:'#c8a5ff',desc:'보석에 폭탄과 번개를 부여'},
 {name:'시간의 숨결',color:'호박',icon:'freeze',unlock:2,accent:'#ffb781',desc:'남은 시간을 늘리고 시간을 정지'}
];
export function advanceTotem(previous,color){const count=previous.color===color?previous.count+1:1;return {color,count,trigger:count>=2};}
export function upgradeCost(level){return level>=5?null:level*2;}
export function stageReward(previous,stars){return Math.max(0,Math.min(3,stars)-Math.max(0,previous));}
export function chapterIndex(stage){return Math.min(4,Math.floor((stage-1)/20));}
export const colorNames=['비취','루비','사파이어','황금','자수정','호박'];
export const chapters=[['태양의 문','THE GATE OF THE SUN'],['비취의 정원','THE JADE GARDEN'],['번개의 제단','THE THUNDER ALTAR'],['달의 성소','THE LUNAR SANCTUM'],['황금의 심장','THE GOLDEN HEART']];
let serial=0;
export function gem(color=Math.floor(Math.random()*COLORS)){return {id:++serial,color,special:null,crystal:Math.random()<.10};}
export function findMatches(board){const groups=[];for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;){const color=board[r*SIZE+c]?.color;let n=1;while(c+n<SIZE&&board[r*SIZE+c+n]?.color===color&&color!==undefined)n++;if(n>=3)groups.push({cells:Array.from({length:n},(_,i)=>r*SIZE+c+i),axis:'row',color});c+=n;}for(let c=0;c<SIZE;c++)for(let r=0;r<SIZE;){const color=board[r*SIZE+c]?.color;let n=1;while(r+n<SIZE&&board[(r+n)*SIZE+c]?.color===color&&color!==undefined)n++;if(n>=3)groups.push({cells:Array.from({length:n},(_,i)=>(r+i)*SIZE+c),axis:'col',color});r+=n;}return groups;}
export function adjacent(a,b){return Math.abs(Math.floor(a/SIZE)-Math.floor(b/SIZE))+Math.abs(a%SIZE-b%SIZE)===1;}
export function findMove(board){for(let a=0;a<64;a++)for(const b of [a+1,a+8]){if(b>=64||!adjacent(a,b))continue;[board[a],board[b]]=[board[b],board[a]];const ok=findMatches(board).length>0;[board[a],board[b]]=[board[b],board[a]];if(ok)return[a,b];}return null;}
export function makeBoard(){let board;do{board=[];for(let i=0;i<64;i++){let g;do{g=gem();}while((i%8>=2&&board[i-1].color===g.color&&board[i-2].color===g.color)||(i>=16&&board[i-8].color===g.color&&board[i-16].color===g.color));board.push(g);}}while(!findMove(board));return board;}
export function affected(board,initial){const set=new Set(initial),queue=[...set];const effects=[];for(let k=0;k<queue.length;k++){const i=queue[k],g=board[i];if(!g?.special)continue;const r=Math.floor(i/8),c=i%8;effects.push({index:i,type:g.special,color:g.color});const extra=[];if(g.special==='row'||g.special==='cross')for(let x=0;x<8;x++)extra.push(r*8+x);if(g.special==='col'||g.special==='cross')for(let y=0;y<8;y++)extra.push(y*8+c);if(g.special==='bomb')for(let y=Math.max(0,r-1);y<=Math.min(7,r+1);y++)for(let x=Math.max(0,c-1);x<=Math.min(7,c+1);x++)extra.push(y*8+x);if(g.special==='nova')board.forEach((v,n)=>{if(v?.color===g.color)extra.push(n);});for(const n of extra)if(!set.has(n)){set.add(n);queue.push(n);}}return {cells:[...set],effects};}
export function specialCreations(groups,preferred=[]){const creations=new Map;const count=new Map;groups.forEach(g=>g.cells.forEach(i=>count.set(i,(count.get(i)||0)+1)));for(const [i,n]of count)if(n>1)creations.set(i,'bomb');for(const g of groups){if(g.cells.some(i=>creations.has(i)))continue;if(g.cells.length>=4){const i=preferred.find(i=>g.cells.includes(i))??g.cells[Math.floor(g.cells.length/2)];creations.set(i,g.cells.length>=5?'nova':g.axis);}}return creations;}
export function collapse(board){for(let c=0;c<8;c++){let dest=7;for(let r=7;r>=0;r--)if(board[r*8+c]){board[dest*8+c]=board[r*8+c];if(dest!==r)board[r*8+c]=null;dest--;}let born=0;while(dest>=0){const g=gem();g.x=c;g.y=-1-born++;board[dest*8+c]=g;dest--;}}return board;}
export function powerCells(type,i,board){const r=Math.floor(i/8),c=i%8;if(type==='lightning')return Array.from({length:64},(_,n)=>n).filter(n=>Math.floor(n/8)===r||n%8===c);if(type==='solar')return Array.from({length:64},(_,n)=>n).filter(n=>Math.hypot(Math.floor(n/8)-r,n%8-c)<=2.65);if(type==='lunar')return board.flatMap((g,n)=>g.color===board[i].color?[n]:[]);return [];}
export function objectives(level){const chapter=chapterIndex(level);return {target:2200+(level-1)*420+chapter*1500,crystals:4+Math.floor((level-1)/8),time:90+chapter*10};}
