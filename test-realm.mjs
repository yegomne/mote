import assert from 'node:assert/strict';
import {STAGE_COUNT,TOTEMS,stageDesign,stageScenario,makeStageBoard,findMatches,findMove,collapse} from './dist/engine.mjs';
import {REALM_ACTS,REALM_SCROLLS,REALM_GEAR,realmStage,realmMaxHP,freshRealmSave,freshRealmBattle,realmAffinity,realmCast,realmCounter,realmNextWave,realmReward,realmBuy} from './dist/realm.mjs';

assert.equal(STAGE_COUNT,200);
assert.equal(REALM_ACTS.length,10);
assert.equal(TOTEMS.length,9);
assert.equal(stageDesign(100).chapter,4);
for(let n=101;n<=200;n++){
  const d=stageDesign(n),b=makeStageBoard(n),sc=stageScenario(n);
  assert.equal(d.type,'realm');
  assert.equal(d.level,n);
  assert.equal(b.length,64);
  assert.equal(findMatches(b).length,0);
  assert.ok(findMove(b));
  assert.ok(b.every(g=>g.color>=0&&g.color<d.colors));
  assert.equal(d.colors,6+(n>=106)+(n>=116)+(n>=126));
  assert.equal(d.chapter,5+Math.floor((n-101)/10));
  assert.ok(d.hp>0&&d.attack>0&&d.reward>0);
  assert.ok(sc.story.length>25&&sc.image.includes('assets/stages/'));
}
for(const n of [101,106,116,126,150,200]){
  const d=realmStage(n),b=makeStageBoard(n);b[0]=null;collapse(b,d.colors);assert.ok(b.every(Boolean));assert.ok(b.every(g=>g.color<d.colors));
}
let save=freshRealmSave(),stage=realmStage(101),battle=freshRealmBattle(stage,save);
assert.equal(realmMaxHP(save),170);
assert.equal(realmCast(stage,battle,save,1,5,1),null,'첫 직접 매치는 충전만 한다');
const weak=realmCast(stage,battle,save,1,5,2);
assert.ok(weak.damage>0);
assert.equal(weak.boost,1);
const boosted=realmCast(stage,battle,save,1,5,3);
assert.equal(boosted.boost,1.5);
assert.ok(boosted.damage>weak.damage);
assert.ok(realmAffinity(stage.enemy,1)>1);
assert.ok(realmAffinity(stage.enemy,6)<1);
stage=realmStage(105);battle=freshRealmBattle(stage,save);const reward=realmReward(stage,battle,save);assert.ok(reward.coins>=stage.reward);assert.equal(save.newLevels[0],1);
stage=realmStage(115);battle=freshRealmBattle(stage,save);realmReward(stage,battle,save);assert.equal(save.newLevels[1],1);
stage=realmStage(125);battle=freshRealmBattle(stage,save);realmReward(stage,battle,save);assert.equal(save.newLevels[2],1);
save.coins=10000;assert.ok(realmBuy(save,'gear','staff'));assert.equal(save.gear.staff,1);assert.ok(realmBuy(save,'scroll','storm'));assert.ok(realmBuy(save,'totem','6'));assert.equal(save.newLevels[0],2);
battle=freshRealmBattle(realmStage(130),save);battle.previousSpell=6;const combo=realmCast(realmStage(130),battle,save,2,5,2);assert.equal(combo.combo,REALM_SCROLLS[0].name);
stage=realmStage(200);battle=freshRealmBattle(stage,save);assert.equal(stage.waves,3);battle.enemyHP=0;assert.ok(realmNextWave(stage,battle));assert.equal(battle.wave,2);battle.enemyHP=0;assert.ok(realmNextWave(stage,battle));assert.equal(battle.wave,3);battle.enemyHP=0;assert.equal(realmNextWave(stage,battle),false);
battle=freshRealmBattle(realmStage(101),save);stage=realmStage(101);let counter=null;for(let i=0;i<stage.cadence;i++)counter=realmCounter(stage,battle,save);assert.ok(counter.damage>=0);
assert.equal(REALM_GEAR.staff.length,5);
console.log('PASS: original board extends to 200, nine colors/totems, combat, counter, gear, scrolls and three-wave dragon.');
