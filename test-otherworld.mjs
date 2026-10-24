import assert from 'node:assert/strict';
import {FIRST_STAGE,LAST_STAGE,RUNES,ACTS,SCROLLS,GEAR,stageDesign,initialState,newBattle,makeBoard,matches,possibleMoves,resolveTurn,spellPower,streakAfter,affinity,buyGear,buyScroll,trainRune,trainCost,advanceStage,maxHP,activateRemainingSpecials} from './dist/battle-engine.mjs';
import {makeBoard as originalBoard,affected as originalAffected} from './dist/engine.mjs';

assert.equal(RUNES.length,9);
assert.equal(ACTS.length,10);
assert.equal(SCROLLS.length,8);
assert.equal(FIRST_STAGE,101);
assert.equal(LAST_STAGE,200);
const seeded=()=>{let n=1;return ()=>(n=(Math.imul(1664525,n)+1013904223)>>>0)/4294967296;};
assert.deepEqual(makeBoard(8,6,seeded()).map(({color,crystal,special})=>({color,crystal,special})),originalBoard(6,seeded()).map(({color,crystal,special})=>({color,crystal,special})));
const finaleBoard=makeBoard(8,6,seeded());finaleBoard[9].special='row';finaleBoard[13].special='bomb';
const expectedFinale=originalAffected(finaleBoard,[9]);
const finale=activateRemainingSpecials(finaleBoard,6,seeded());
assert.ok(finale.activations.length>=1);
assert.deepEqual(finale.activations[0].cells,expectedFinale.cells);
assert.ok(finale.cleared>=expectedFinale.cells.length);
assert.equal(finaleBoard.some(g=>g.special),false);
for(let stage=101;stage<=200;stage++){
  const d=stageDesign(stage),s=initialState();s.stage=stage;s.battle=newBattle(s);
  assert.equal(s.battle.board.length,d.size*d.size);
  assert.equal(matches(s.battle.board,d.size).length,0);
  assert.ok(possibleMoves(s.battle.board,d.size).length>0);
  assert.equal(d.size,8);
  assert.ok(d.enemy.weak.length&&d.enemy.resist.length);
  assert.ok(d.story.length>20);
}
assert.equal(stageDesign(150).waves,1);
assert.equal(stageDesign(160).waves,2);
assert.equal(stageDesign(200).waves,3);
assert.equal(streakAfter({color:-1,count:0},1).casts,false);
assert.equal(streakAfter({color:1,count:1},1).casts,true);
assert.equal(streakAfter({color:1,count:2},1).count,3);
assert.equal(streakAfter({color:1,count:3},2).count,1);
let s=initialState();s.stage=110;s.battle=newBattle(s);const d=stageDesign(s.stage),startHP=s.battle.enemyHP;
function fireMove(){for(let n=0;n<500;n++){const m=possibleMoves(s.battle.board,d.size,1)[0];if(m)return m;s.battle.board=makeBoard(d.size,d.colors);}throw Error('불 보석 이동을 찾지 못함');}
let m=fireMove(),r=resolveTurn(s,m.a,m.b);assert.ok(r.valid);assert.equal(s.battle.enemyHP,startHP);assert.equal(r.events.some(e=>e.kind==='spell'),false);
m=fireMove();r=resolveTurn(s,m.a,m.b);assert.ok(r.events.some(e=>e.kind==='spell'&&e.color===1&&e.multiplier===1));
m=fireMove();r=resolveTurn(s,m.a,m.b);assert.ok(r.events.some(e=>e.kind==='spell'&&e.color===1&&e.multiplier===1.5));
assert.ok(affinity(stageDesign(101).enemy,1)>1);
assert.ok(affinity(stageDesign(101).enemy,6)<1);
assert.ok(spellPower(s,s.battle,1).damage>spellPower(s,s.battle,6).damage);

s=initialState();s.stage=105;s.battle=newBattle(s);s.battle.streak={color:1,count:1};s.battle.enemyHP=1;m=possibleMoves(s.battle.board,8,1)[0];while(!m){s.battle.board=makeBoard(8,6);m=possibleMoves(s.battle.board,8,1)[0];}r=resolveTurn(s,m.a,m.b);assert.equal(s.battle.phase,'won');assert.equal(s.levels[6],1);assert.ok(r.events.some(e=>e.kind==='victory'&&e.unlock===6));assert.ok(s.coins>=stageDesign(105).reward);assert.equal(advanceStage(s),true);assert.equal(s.stage,106);assert.equal(stageDesign(106).colors,7);

s=initialState();s.coins=1000;assert.ok(buyGear(s,'staff'));assert.equal(s.gear.staff,1);assert.ok(buyScroll(s,'storm'));assert.ok(s.scrolls.includes('storm'));s.levels[6]=1;assert.ok(trainRune(s,6));assert.equal(s.levels[6],2);assert.ok(s.coins<1000);
s.stage=141;s.battle=newBattle(s);s.battle.previousSpell=6;s.battle.streak={color:2,count:1};m=possibleMoves(s.battle.board,8,2)[0];while(!m){s.battle.board=makeBoard(8,9);m=possibleMoves(s.battle.board,8,2)[0];}r=resolveTurn(s,m.a,m.b);assert.ok(r.events.some(e=>e.kind==='combo'&&e.id==='storm'));assert.ok(r.events.some(e=>e.kind==='spell'&&e.damage>0));
assert.equal(maxHP(s),140+GEAR.robe[s.gear.robe].hp);
s=initialState();s.coins=10000;s.stage=150;s.gear.staff=3;assert.equal(buyGear(s,'staff'),false);assert.equal(buyScroll(s,'inferno'),false);assert.equal(trainCost(s,1),null);s.stage=151;assert.equal(buyGear(s,'staff'),true);assert.equal(buyScroll(s,'inferno'),true);assert.ok(trainRune(s,1));assert.equal(s.levels[1],6);
s=initialState();s.stage=200;s.battle=newBattle(s);assert.equal(s.battle.wave,1);for(let wave=2;wave<=3;wave++){s.battle.enemyHP=1;s.battle.streak={color:1,count:1};let move=possibleMoves(s.battle.board,8,1)[0];while(!move){s.battle.board=makeBoard(8,9);move=possibleMoves(s.battle.board,8,1)[0];}const result=resolveTurn(s,move.a,move.b);assert.ok(result.events.some(e=>e.kind==='wave'&&e.wave===wave));assert.equal(s.battle.phase,'playing');assert.equal(s.battle.wave,wave);}s.battle.enemyHP=1;s.battle.streak={color:1,count:1};let finalMove=possibleMoves(s.battle.board,8,1)[0];while(!finalMove){s.battle.board=makeBoard(8,9);finalMove=possibleMoves(s.battle.board,8,1)[0];}const last=resolveTurn(s,finalMove.a,finalMove.b);assert.ok(last.events.some(e=>e.kind==='victory'));assert.equal(s.battle.phase,'won');assert.equal(s.won,true);
console.log('PASS: 100 stages, 10 acts, original 8×8 board, 9 totems, 3-wave finale, specials and combat.');
