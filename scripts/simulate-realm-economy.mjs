import fs from 'node:fs';
import {REALM_GEAR,REALM_GEAR_SLOTS,REALM_SCROLLS,realmStage,realmGearEnhanceCost,realmGearRank,freshRealmSave,realmBuyGear,realmEquipGear,realmEnhanceGear,realmBuy} from '../dist/realm.mjs';

const oldGearCost=7570,oldScrollCost=800;
const gearCost=Object.values(REALM_GEAR).flat().reduce((sum,item)=>sum+item.price,0);
const scrollCost=REALM_SCROLLS.reduce((sum,item)=>sum+item.price,0);
const enhanceCost=REALM_GEAR_SLOTS.reduce((sum,slot)=>sum+REALM_GEAR[slot].slice(1).reduce((a,_,i)=>a+Array.from({length:5},(_,rank)=>realmGearEnhanceCost(slot,i+1,rank)).reduce((x,y)=>x+y,0),0),0);
const scrollUnlock={storm:105,ice:125,magma:115,bloom:101,eclipse:121,inferno:125,marsh:115,chronostorm:131};
const priority=['staff','robe','grimoire','ring','amulet','boots'];
function simulate(replayEvery=0){
 const save=freshRealmSave(),rows=[];let earned=0;
 for(let level=101;level<=200;level++){
  const stage=realmStage(level),reward=stage.reward+Math.round(stage.reward*.7*.35),replays=replayEvery&&level%replayEvery===0?1:0;
  earned+=reward*(1+replays);save.coins+=reward*(1+replays);
  const desired=level>=181?4:level>=151?3:level>=121?2:1;
  let savingForCore=false;
  for(const slot of priority.slice(0,3))if(save.gear[slot]<desired){if(realmBuyGear(save,slot,desired))realmEquipGear(save,slot,desired);else{savingForCore=true;break;}}
  if(!savingForCore){
   for(const scroll of REALM_SCROLLS)if(level>=scrollUnlock[scroll.id]&&!save.scrolls.includes(scroll.id))realmBuy(save,'scroll',scroll.id);
   for(const slot of priority.slice(3))if(save.gear[slot]<desired&&realmBuyGear(save,slot,desired))realmEquipGear(save,slot,desired);
   const rankTarget=level>=191?3:level>=161?2:level>=111?1:0;
   for(const slot of priority){const tier=save.gear[slot];if(tier>0)while(realmGearRank(save,slot,tier)<rankTarget&&realmEnhanceGear(save,slot,tier)){}}
  }
  if(level%10===0)rows.push({end:level,earned,spent:earned-save.coins,left:save.coins,gear:priority.map(slot=>save.gear[slot]).join('/'),scrolls:save.scrolls.length});
 }
 return {save,rows,earned,spent:earned-save.coins,left:save.coins};
}
const normal=simulate(),replay=simulate(10);
const lines=[
 '# 이세계 코인 경제 시뮬레이션','',
 '가정: 101~200단계에서 각 단계 1회 승리, 승리 시 생명력 70% 유지. 추가 별 보상이나 보석 점수는 코인에 합산하지 않는다. 재도전 열은 10단계마다 1회 추가 승리를 가정한다. 실제 유저의 승률·클리어 속도는 검증 대상이다.','',
 '| 지표 | 이전 | 조정 후 |','|---|---:|---:|',
 `| 장비 전체 구매 비용 | ◈ ${oldGearCost.toLocaleString()} | ◈ ${gearCost.toLocaleString()} |`,
 `| 스크롤 전체 구매 비용 | ◈ ${oldScrollCost.toLocaleString()} | ◈ ${scrollCost.toLocaleString()} |`,
 `| 장비 강화 전체 비용 | 없음 | ◈ ${enhanceCost.toLocaleString()} |`,
 `| 100단계 예상 총 수입 | ◈ ${normal.earned.toLocaleString()} | ◈ ${normal.earned.toLocaleString()} |`,
 `| 모든 소비 경로를 살 때 남는 코인 | ◈ ${(normal.earned-oldGearCost-oldScrollCost).toLocaleString()} | ◈ ${(normal.earned-gearCost-scrollCost-enhanceCost).toLocaleString()} |`,
 '',
 '## 실제 구매 경로 모의 실행','',
 '기본 전략: 새 토템이 열리면 스크롤을 구입하고, 지역 진행에 따라 6부위 장비를 우선순위대로 갱신한다. 여유 코인으로 장착 장비를 강화한다. 장비 등급 표기는 지팡이/로브/마도서/반지/부적/장화 순서다.','',
 '| 단계 | 누적 수입 | 누적 지출 | 남은 코인 | 장비 등급 | 스크롤 |','|---:|---:|---:|---:|---|---:|',
 ...normal.rows.map(r=>`| ${r.end} | ${r.earned.toLocaleString()} | ${r.spent.toLocaleString()} | ${r.left.toLocaleString()} | ${r.gear} | ${r.scrolls}/8 |`),
 '',
 `종료 시 1회 승리 경로는 ◈ ${normal.left.toLocaleString()}가 남고, 10단계마다 한 번 더 승리하면 ◈ ${replay.left.toLocaleString()}가 남는다. 구입하지 못한 장비와 강화 단계는 계속 코인 소비 목표가 된다.`,''
];
fs.writeFileSync('ECONOMY_SIMULATION.md',lines.join('\n'));
console.log(JSON.stringify({income:normal.earned,oldSpend:oldGearCost+oldScrollCost,oldLeft:normal.earned-oldGearCost-oldScrollCost,newFullDemand:gearCost+scrollCost+enhanceCost,plannedSpend:normal.spent,plannedLeft:normal.left,replayLeft:replay.left,ownedScrolls:normal.save.scrolls.length,gear:normal.save.gear},null,2));
