import fs from 'node:fs';
import {REALM_ACTS,REALM_SCROLLS,REALM_GEAR,realmStage} from '../dist/realm.mjs';
const names=['비취','불','번개','황금','달','시간','물','대지','바람'];
const lines=[
 '# 태양의 유산 · 101~200단계 설계','',
 '> 1~100단계의 게임을 그대로 연장한다. 실제 수치는 `dist/realm.mjs`가 기준이다.','',
 '## 플레이 흐름','',
 '100단계 완료 → 보물상자와 되돌아갈 수 없다는 경고 → 같은 화면의 101단계. 원작의 8×8 캔버스 보석판, 낙하 연쇄, 특수돌, 6토템, 소리, 효과를 계속 사용한다. 위쪽에 마법사와 몬스터를 놓고 아래쪽 보석 매치로 싸운다. 이동 횟수와 전투 시간 제한은 없다.','',
 '| 구간 | 지역 | 이야기 목표 | 보석 색 | 결전 |',
 '|---|---|---|---:|---|',
 ...REALM_ACTS.map((a,i)=>{const from=101+i*10,to=from+9,d=realmStage(to);return `| ${from}–${to} | ${a.name} | ${a.goal} | ${realmStage(from).colors}–${d.colors} | ${d.enemy.name} · ${d.waves}연전 |`;}),
 '','## 전투 규칙','',
 '- 첫 직접 매치는 색의 힘을 충전한다. 같은 색의 두 번째 직접 매치부터 원작의 토템이 발동하고 마법이 몬스터를 공격한다. Lv.2 이상에서 세 번째 연속 매치부터 1.5배가 된다.',
 '- 특수돌과 자동 낙하 연쇄는 원작대로 작동한다. 직접 매치 횟수로만 전투 마법을 충전한다.',
 '- 몬스터는 2~3번의 유효 매치 뒤 반격한다. 약점 피해는 1.45배, 저항 피해는 0.55배다. 회복·보호막·그로기·화상·젖음으로 대응한다.',
 '- 105/115/125단계 문지기를 이기면 물/대지/바람 토템이 열린다. 승리 코인으로 지팡이·로브·반지·새 토템 강화·연계 스크롤을 산다.',
 '- 전투가 끝나면 보석판에 남은 특수돌이 원작 피날레 방식으로 자연 발동하여 점수에 합산된다.',
 '','## 연계 스크롤','',
 '| 연계 | 효과 | 가격 |','|---|---|---:|',
 ...REALM_SCROLLS.map(s=>`| ${names[s.pair[0]]} → ${names[s.pair[1]]} | ${s.desc} | ◈ ${s.price} |`),
 '','## 101~200단계','',
 '| 단계 | 지역 | 상대 | 약점 / 저항 | 색 | HP | 반격 | 보상 |',
 '|---:|---|---|---|---:|---:|---|---:|',
 ...Array.from({length:100},(_,i)=>{const d=realmStage(i+101);return `| ${d.level} | ${REALM_ACTS[d.act].name} | ${d.enemy.name}${d.boss?' · 보스':d.gate?' · 문지기':''} | ${d.enemy.weak.map(x=>names[x]).join('·')} / ${d.enemy.resist.map(x=>names[x]).join('·')} | ${d.colors} | ${d.hp} | ${d.cadence}매치 · ${d.attack} | ◈ ${d.reward} |`;}),
 '','## 휴대폰 표시','',
 '전투 장면과 원작 보석판과 섞기 버튼이 세로 화면 안에 들어오게 한다. 8×8 캔버스는 1~100단계의 보석 렌더러를 재사용한다. 전투 캐릭터는 대기·공격·방어·그로기 자세를 표시한다.',''
];
fs.writeFileSync('REALM_DESIGN.md',lines.join('\n'));
console.log('Wrote REALM_DESIGN.md');
