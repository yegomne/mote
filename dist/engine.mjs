import {realmStage,realmBackdrop,REALM_ACTS} from './realm.mjs?v=6';
export const SIZE=8, COLORS=6, STAGE_COUNT=200;
export const TOTEMS=[
  {name:'비취의 수확',shortName:'비취',color:'비취',icon:'gem',roleTag:'💎 수정 수확',unlockCost:3,unlockStage:1,unlock:1,accent:'#6ee2ae',desc:'수정을 즉시 회수하고 새 수정을 생성'},
  {name:'불의 심판',shortName:'불',color:'루비',icon:'sun',roleTag:'🔥 집중 폭격',unlockCost:4,unlockStage:5,unlock:2,accent:'#ff8a89',desc:'화염 운석 집중 폭격으로 십자 반경의 보석과 봉인 분쇄'},
  {name:'천둥의 분노',shortName:'번개',color:'사파이어',icon:'bolt',roleTag:'⚡ 사방 번개',unlockCost:5,unlockStage:10,unlock:3,accent:'#80d7f1',desc:'움직인 보석 주변 사방으로 번개 레이저 감전'},
  {name:'황금의 축복',shortName:'황금',color:'황금',icon:'sun',roleTag:'👑 점수 증폭',unlockCost:6,unlockStage:15,unlock:5,accent:'#efcf7e',desc:'대량 보너스 점수 및 피버 3배 에너지 급속 충전'},
  {name:'달의 선물',shortName:'달',color:'자수정',icon:'moon',roleTag:'🌙 특수 생성',unlockCost:7,unlockStage:20,unlock:7,accent:'#c8a5ff',desc:'보석판에 폭탄, 번개 레이저, 노바 직접 부여'},
  {name:'시간의 숨결',shortName:'시간',color:'호박',icon:'freeze',roleTag:'⏳ 시간 연장',unlockCost:8,unlockStage:25,unlock:10,accent:'#ffb781',desc:'제한 시간 소폭 연장 및 시간 정지 결계'},
  {name:'물의 흐름',shortName:'물',color:'물방울',icon:'gem',roleTag:'💧 폭우와 치유',unlockCost:0,unlockStage:105,unlock:106,accent:'#61dded',desc:'전체 보석판에 폭우를 쏟아부어 무작위 보석들을 대량으로 씻어내고 치유'},
  {name:'대지의 맥박',shortName:'대지',color:'돌',icon:'gem',roleTag:'◆ 바위 충격',unlockCost:0,unlockStage:115,unlock:116,accent:'#c7a574',desc:'주변 대지를 깨우고 보호막을 쌓음'},
  {name:'바람의 노래',shortName:'바람',color:'나뭇잎',icon:'gem',roleTag:'➶ 바람 칼날',unlockCost:0,unlockStage:125,unlock:126,accent:'#a5eacb',desc:'대각선 보석을 관통하고 반격을 늦춤'}
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
    // 1: 불 (2~4발 집중 폭격 & 타격감 강화)
    [
      {cur:'불덩이 2발 (반경 1칸 파괴)', next:'불덩이 2발 & 3연속 1.5배 각성(3발) 해금!'},
      {cur:'불덩이 2발 (3연속 시 3발)', next:'불덩이 3발 폭격 (반경 1칸)'},
      {cur:'불덩이 3발 폭격 (반경 1칸)', next:'불덩이 3발 (3연속 시 4발)'},
      {cur:'불덩이 3발 (3연속 시 4발)', next:'불덩이 4발로 증가!'},
      {cur:'불덩이 4발 폭격 (3연속 시 5발)', next:'최고 레벨 (MAX)'}
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
    // 5: 시간 (스릴감을 위한 연장 시간 너프)
    [
      {cur:'시간 +2.0초 연장', next:'시간 +2.5초 & 3연속 1.5배 (+3.8초) 해금!'},
      {cur:'시간 +2.5초 (3연속 시 +3.8초)', next:'시간 +3.0초 & 시간 정지 0.7초 결계 해금!'},
      {cur:'시간 +3.0초 · 시간 정지 0.7초', next:'시간 +3.5초 · 시간 정지 1.4초 (안정적 공략)'},
      {cur:'시간 +3.5초 · 시간 정지 1.4초', next:'시간 +4.0초 · 시간 정지 2.1초'},
      {cur:'시간 +4.0초 · 시간 정지 2.1초 (3연속 시 +6초)', next:'최고 레벨 (MAX)'}
    ]
  ];
  return specs[index]?.[level-1] || {cur:'최대 강화 완료', next:'MAX'};
}
export function advanceTotem(previous,color){const count=previous.color===color?previous.count+1:1;return {color,count,trigger:count>=2};}
export function totemPower(color,level,streak){const multiplier=level>=2&&streak>=3?1.5:1;const seconds=(1.5+level*0.5)*multiplier;const stasis=level>=3?(level-2)*0.7*multiplier:0;return {multiplier,harvest:Math.ceil((level+1)*multiplier),gifts:Math.ceil(level*multiplier),bonus:300*level*multiplier,energy:(15+5*level)*multiplier,seconds,stasis};}
export function fireTargets(level,previous=[],random=Math.random,total=64,cols=8){const chosen=[],count=Math.max(2,Math.min(4,Math.floor(1.5+level*0.55)));for(let k=0;k<count;k++){let pool=Array.from({length:total},(_,i)=>i).filter(i=>!chosen.includes(i)&&!previous.includes(i));const spread=pool.filter(i=>chosen.every(j=>Math.hypot(i%cols-j%cols,Math.floor(i/cols)-Math.floor(j/cols))>=3));if(spread.length)pool=spread;chosen.push(pool[Math.min(pool.length-1,Math.floor(Math.max(0,random())*pool.length))]);}return chosen;}
function sample(pool,count,random){const rest=[...pool],picked=[];while(rest.length&&picked.length<count)picked.push(rest.splice(Math.min(rest.length-1,Math.floor(Math.max(0,random())*rest.length)),1)[0]);return picked;}
export function thunderTargets(level,streak,anchor,random=Math.random,total=64,cols=8){const l=Math.max(1,Math.min(5,level)),multiplier=totemPower(2,l,streak).multiplier,radius=1.5+(l-1)*.4+(multiplier>1?.6:0),x=anchor%cols,y=Math.floor(anchor/cols),count=Math.ceil((5+(l-1)*2)*multiplier),cells=[anchor],pool=Array.from({length:total},(_,i)=>i).filter(i=>i!==anchor&&Math.hypot(i%cols-x,Math.floor(i/cols)-y)<=radius),sectors=Array(4).fill(0),sector=i=>Math.floor((Math.atan2(Math.floor(i/cols)-y,i%cols-x)+Math.PI/4+Math.PI*2)%(Math.PI*2)/(Math.PI/2));while(pool.length&&cells.length<count){const available=[...new Set(pool.map(sector))],least=Math.min(...available.map(q=>sectors[q])),options=pool.filter(i=>sectors[sector(i)]===least),hit=sample(options,1,random)[0];cells.push(hit);sectors[sector(hit)]++;pool.splice(pool.indexOf(hit),1);}return {anchor,radius,cells};}
export function harvestTargets(board,level,streak,random=Math.random){const p=totemPower(0,level,streak),collect=sample(board.flatMap((g,i)=>g?.crystal?[i]:[]),p.harvest,random),create=sample(board.flatMap((g,i)=>g&&!g.crystal?[i]:[]),p.harvest,random);return {collect,create};}
export function lunarTargets(board,level,streak,random=Math.random){const p=totemPower(4,level,streak);return sample(board.flatMap((g,i)=>g&&!g.special?[i]:[]),p.gifts,random).map((index,k)=>({index,special:level>=5&&k===0?'nova':level>=3&&k%3===2?'col':k%2?'row':'bomb'}));}
export function amplifyCells(initial,multiplier,center,total=64,cols=8){const cells=[...new Set(initial)],target=Math.min(total,Math.ceil(cells.length*multiplier));if(cells.length>=target)return cells;const distance=(a,b)=>Math.hypot(a%cols-b%cols,Math.floor(a/cols)-Math.floor(b/cols));const rest=Array.from({length:total},(_,i)=>i).filter(i=>!cells.includes(i));rest.sort((a,b)=>Math.min(...cells.map(i=>distance(a,i)))-Math.min(...cells.map(i=>distance(b,i)))||distance(a,center)-distance(b,center)||a-b);return cells.concat(rest.slice(0,target-cells.length));}
export function upgradePrerequisite(index, nextLevel){
  if(nextLevel <= 0 || nextLevel > 5) return null;
  const t = TOTEMS[index] || TOTEMS[0];
  if(nextLevel === 1){
    return {
      stage: t.unlockStage,
      desc: `${t.unlockStage}관문 돌파 필요`,
      cost: t.unlockCost,
      check: (stage) => stage >= t.unlockStage
    };
  }
  if(nextLevel === 2){
    return {
      stage: 10,
      desc: `10관문 돌파 & 타 토템 1개 이상 해금`,
      cost: 5,
      check: (stage, levels) => stage >= 10 && levels.filter((lvl, idx) => idx !== index && lvl >= 1).length >= 1
    };
  }
  if(nextLevel === 3){
    return {
      stage: 25,
      desc: `25관문 돌파 & 타 토템 2개 이상 Lv.2`,
      cost: 10,
      check: (stage, levels) => stage >= 25 && levels.filter((lvl, idx) => idx !== index && lvl >= 2).length >= 2
    };
  }
  if(nextLevel === 4){
    return {
      stage: 45,
      desc: `45관문 돌파 & 타 토템 3개 이상 Lv.2 (1개 Lv.3 이상)`,
      cost: 16,
      check: (stage, levels) => {
        const others = levels.filter((lvl, idx) => idx !== index);
        return stage >= 45 && others.filter(l => l >= 2).length >= 3 && others.some(l => l >= 3);
      }
    };
  }
  if(nextLevel === 5){
    return {
      stage: 70,
      desc: `70관문 돌파 & 타 토템 5개 모두 Lv.3 이상 (마스터)`,
      cost: 25,
      check: (stage, levels) => stage >= 70 && levels.filter((lvl, idx) => idx !== index && lvl >= 3).length >= 5
    };
  }
  return null;
}

export function canUpgradeTotem(index, currentLevel, stage, totemLevels, magicStars){
  if(currentLevel >= 5) return { ok: false, reason: '최고 레벨 (MAX)', cost: 0, isMax: true };
  const nextLvl = currentLevel + 1;
  const prereq = upgradePrerequisite(index, nextLvl);
  if(!prereq) return { ok: false, reason: '강화 불가', cost: 0 };
  const cost = prereq.cost;
  const passedReq = prereq.check(stage, totemLevels);
  if(!passedReq) return { ok: false, reason: prereq.desc, cost, lockedByCondition: true };
  if(magicStars < cost) return { ok: false, reason: `★${cost} 필요 (부족)`, cost, lockedByCost: true };
  return { ok: true, reason: '강화 가능', cost };
}

export function upgradeCost(level, totemIndex=0){
  if(level >= 5) return null;
  const prereq = upgradePrerequisite(totemIndex, level + 1);
  return prereq ? prereq.cost : (level === 0 ? (TOTEMS[totemIndex]?.unlockCost || 3) : 5);
}

export function stageStarCriteria(stage){
  const targetScore = stage.target;
  const star2Score = Math.round(targetScore * 1.3 / 50) * 50;
  const star3Score = Math.round(targetScore * 1.6 / 50) * 50;
  const altStar3Score = Math.round(targetScore * 1.85 / 50) * 50;
  const hasSeals = stage.seals && stage.seals.length > 0;
  return {
    star1: {
      stars: 1,
      title: '★ 1성: 기본 돌파',
      desc: `목표 점수 ${targetScore.toLocaleString()}점 & 수정 ${stage.crystals}개 (or 점수 +25% 초과 달성)`
    },
    star2: {
      stars: 2,
      title: '★★ 2성: 숙련 제패',
      score: star2Score,
      desc: `점수 ${star2Score.toLocaleString()}점 (+30%) & (수정 달성 or 3연쇄 콤보 or 특수 보석 2개)`
    },
    star3: {
      stars: 3,
      title: '★★★ 3성: 완벽한 정복',
      score: star3Score,
      desc: hasSeals
        ? `점수 ${star3Score.toLocaleString()}점 & 봉인 파괴 (수정 부족 시 ${altStar3Score.toLocaleString()}점 슈퍼 스코어로 3성!)`
        : `점수 ${star3Score.toLocaleString()}점 & 3연쇄/특수보석 (수정 부족 시 ${altStar3Score.toLocaleString()}점 슈퍼 스코어로 3성!)`
    }
  };
}

export function evaluateStageStars(stage, metrics, remainingTime=0){
  const m = { ...metrics };
  const targetScore = stage.target;
  const currentScore = m.score || 0;
  const currentCrystals = m.crystals || 0;
  const star2Score = Math.round(targetScore * 1.3 / 50) * 50;
  const star3Score = Math.round(targetScore * 1.6 / 50) * 50;
  const altStar3Score = Math.round(targetScore * 1.85 / 50) * 50;
  const hasSeals = stage.seals && stage.seals.length > 0;
  const sealCleared = hasSeals ? ((m.sealsBroken || 0) >= stage.seals.length) : true;

  // Basic pass: Either score >= target & crystals >= target, OR score >= 125% target!
  const hasMinScore = currentScore >= targetScore;
  const hasCrystals = currentCrystals >= stage.crystals;
  const altPass = currentScore >= Math.round(targetScore * 1.25);
  
  if (!((hasMinScore && hasCrystals && sealCleared) || (altPass && sealCleared))) {
    return 0; // Failed
  }

  let stars = 1;
  // 2-Star: Score >= 130% AND (has crystals OR 3+ combo OR specials >= 2 OR 5s+ remaining)
  if (currentScore >= star2Score && (hasCrystals || (m.bestCascade || 0) >= 3 || (m.specialsMade || 0) >= 2 || remainingTime >= 5)) {
    stars = 2;
  }

  // 3-Star:
  // Route A (Standard): Score >= 160% + Crystals 100% + (specials >= 2 or combo >= 3 or totem >= 2 or remainingTime >= 5)
  // Route B (Alternate - crystals short): Score >= 185% + (specials >= 3 or combo >= 4 or totem >= 2)
  const routeA = (currentScore >= star3Score && hasCrystals && ((m.specialsMade || 0) >= 2 || (m.bestCascade || 0) >= 3 || (m.totemCasts || 0) >= 2 || remainingTime >= 5));
  const routeB = (currentScore >= altStar3Score && ((m.specialsMade || 0) >= 3 || (m.bestCascade || 0) >= 4 || (m.totemCasts || 0) >= 2));

  if (stars >= 2 && (routeA || routeB)) {
    stars = 3;
  }

  return stars;
}

export const FORTUNE_CARDS = [
  {
    id: 'fire_down',
    type: 'misfortune',
    title: '🔥 불의 토템 분노',
    summary: '불의 토템 -1단계 하향',
    desc: '고대 화염이 격노하며 힘을 거두어갔습니다. 불의 토템이 1레벨 하향됩니다.',
    image: 'assets/cards/fire_wrath.jpg',
    apply(state){
      if(state.totemLevels[1] > 0){
        state.totemLevels[1]--;
        return '불의 토템 레벨이 1단계 하향되었습니다. (현재 Lv.' + state.totemLevels[1] + ')';
      }
      return '불의 토템이 아직 잠겨있어 화를 피했습니다!';
    }
  },
  {
    id: 'time_penalty',
    type: 'misfortune',
    title: '⏳ 모래시계의 균열',
    summary: '다음 3관문 제한시간 -10초',
    desc: '시간의 흐름이 불안정해졌습니다. 다음 3개 관문에서 제한 시간이 10초 감소합니다.',
    image: 'assets/cards/broken_time.jpg',
    apply(state){
      state.fortuneBuffs = state.fortuneBuffs || {};
      state.fortuneBuffs.timePenaltyStages = 3;
      return '다음 3개 관문 동안 제한 시간이 10초 줄어듭니다!';
    }
  },
  {
    id: 'star_lost',
    type: 'misfortune',
    title: '💎 사라진 마법별',
    summary: '소지 마법별 1개 소실',
    desc: '사원의 결계가 탐험가의 마법별 1개를 흡수해 버렸습니다.',
    image: 'assets/cards/cursed_seal.jpg',
    apply(state){
      if(state.magicStars > 0){
        state.magicStars--;
        return '마법별 ★ 1개를 잃었습니다. (남은 마법별: ' + state.magicStars + '개)';
      }
      return '보유한 마법별이 없어 손실을 면했습니다!';
    }
  },
  {
    id: 'seal_hard',
    type: 'misfortune',
    title: '🛡️ 굳어버린 봉인석',
    summary: '다음 관문 봉인 내구도 강화',
    desc: '고대 암석이 강철처럼 굳어졌습니다. 다음 관문 봉인들의 내구도가 +1 강화됩니다.',
    image: 'assets/cards/cursed_seal.jpg',
    apply(state){
      state.fortuneBuffs = state.fortuneBuffs || {};
      state.fortuneBuffs.hardSeals = true;
      return '다음 관문의 모든 봉인이 더 단단해집니다!';
    }
  },
  {
    id: 'star_bless',
    type: 'fortune',
    title: '☀️ 태양신의 축복',
    summary: '마법별 ★ 3개 즉시 획득',
    desc: '사원 천장에서 황금빛 서광이 비추며 신비로운 마법별이 쏟아집니다!',
    image: 'assets/cards/sun_blessing.jpg',
    apply(state){
      state.magicStars = (state.magicStars || 0) + 3;
      return '마법별 ★ 3개를 획득했습니다! (현재 마법별: ' + state.magicStars + '개)';
    }
  },
  {
    id: 'free_upgrade',
    type: 'fortune',
    title: '⚡ 원소의 은총',
    summary: '가장 낮은 토템 무료 1회 강화',
    desc: '신비로운 고대 비약이 흘러들어 가장 낮은 레벨의 토템 하나를 즉시 1단계 강화합니다!',
    image: 'assets/cards/element_awakening.jpg',
    apply(state){
      let minIdx = -1, minLvl = 999;
      for(let i=0; i<6; i++){
        if(state.totemLevels[i] < minLvl && state.totemLevels[i] < 5){
          minLvl = state.totemLevels[i];
          minIdx = i;
        }
      }
      if(minIdx >= 0){
        state.totemLevels[minIdx]++;
        return `[${TOTEMS[minIdx].name}]이(가) 무료로 Lv.${state.totemLevels[minIdx]}로 강화되었습니다!`;
      }
      state.magicStars = (state.magicStars || 0) + 2;
      return '모든 토템이 최고 레벨입니다! 대신 마법별 ★ 2개를 획득했습니다.';
    }
  },
  {
    id: 'time_bonus',
    type: 'fortune',
    title: '⏳ 크로노스의 가호',
    summary: '다음 3관문 제한시간 +20초',
    desc: '시간의 모래가 느리게 떨어집니다. 다음 3개 관문의 제한 시간이 20초 연장됩니다.',
    image: 'assets/cards/time_blessing.jpg',
    apply(state){
      state.fortuneBuffs = state.fortuneBuffs || {};
      state.fortuneBuffs.timeBonusStages = 3;
      return '다음 3개 관문 동안 제한 시간이 +20초 늘어납니다!';
    }
  },
  {
    id: 'gold_start',
    type: 'fortune',
    title: '🌟 황금빛 서광',
    summary: '다음 관문 시작 시 특수보석 3개',
    desc: '보석의 정령들이 춤춥니다. 다음 관문 시작 시 강력한 특수 보석 3개가 즉시 생성됩니다!',
    image: 'assets/cards/element_awakening.jpg',
    apply(state){
      state.fortuneBuffs = state.fortuneBuffs || {};
      state.fortuneBuffs.extraSpecials = true;
      return '다음 관문 시작 시 특수 보석 3개가 보석판에 배치됩니다!';
    }
  },
  {
    id: 'fever_surge',
    type: 'fortune',
    title: '🔥 불타는 피버',
    summary: '다음 2관문 피버 지속 시간 +3초',
    desc: '사원의 열기가 고조됩니다. 다음 2개 관문 동안 피버 모드 지속 시간이 3초 연장됩니다!',
    image: 'assets/cards/sun_blessing.jpg',
    apply(state){
      state.fortuneBuffs = state.fortuneBuffs || {};
      state.fortuneBuffs.feverBonusStages = 2;
      return '다음 2개 관문 동안 피버 지속 시간이 +3초 늘어납니다!';
    }
  }
];

export function stageReward(previous,stars){return Math.max(0,Math.min(3,stars)-Math.max(0,previous));}
export function chapterIndex(stage){return stage<=100?Math.min(4,Math.floor((stage-1)/20)):5+Math.min(9,Math.floor((stage-101)/10));}
export const colorNames=['비취','루비','사파이어','황금','자수정','호박','물방울','돌','나뭇잎'];
export const chapters=[['태양의 문','THE GATE OF THE SUN'],['비취의 정원','THE JADE GARDEN'],['번개의 제단','THE THUNDER ALTAR'],['달의 성소','THE LUNAR SANCTUM'],['황금의 심장','THE GOLDEN HEART'],...REALM_ACTS.map(a=>[a.name,a.sub])];
let serial=0;
export function gem(color,colors=COLORS,random=Math.random){return {id:++serial,color:color??Math.floor(random()*colors),special:null,crystal:random()<.10};}
export function boardCols(board){return (board&&board.length===90)?9:8;}
export function boardRows(board){return (board&&board.length===90)?10:8;}
export function findMatches(board,cols=boardCols(board),rows=boardRows(board)){const groups=[];for(let r=0;r<rows;r++)for(let c=0;c<cols;){const color=board[r*cols+c]?.color;let n=1;while(c+n<cols&&board[r*cols+c+n]?.color===color&&color!==undefined)n++;if(n>=3)groups.push({cells:Array.from({length:n},(_,i)=>r*cols+c+i),axis:'row',color});c+=n;}for(let c=0;c<cols;c++)for(let r=0;r<rows;){const color=board[r*cols+c]?.color;let n=1;while(r+n<rows&&board[(r+n)*cols+c]?.color===color&&color!==undefined)n++;if(n>=3)groups.push({cells:Array.from({length:n},(_,i)=>(r+i)*cols+c),axis:'col',color});r+=n;}return groups;}
export function adjacent(a,b,cols=8){let c=typeof cols==='object'&&cols!==null?boardCols(cols):(typeof cols==='number'?cols:8);if(c===8&&(a>=64||b>=64||Math.abs(a-b)===9))c=9;return Math.abs(Math.floor(a/c)-Math.floor(b/c))+Math.abs(a%c-b%c)===1;}
export function damageSeals(state,cells,cols=boardCols(state)){const total=state.length||64,hits=new Set(cells);for(const i of cells)for(const j of [i-cols,i+cols,i-1,i+1])if(j>=0&&j<total&&adjacent(i,j,cols))hits.add(j);let broken=0;const damaged=[];for(const i of hits)if(state[i]>0){state[i]--;if(!state[i])broken++;damaged.push(i);}return {broken,damaged};}
export function findMove(board,preferredColor=-1,strict=false,cols=boardCols(board),rows=boardRows(board)){const total=cols*rows;let fallback=null;for(let a=0;a<total;a++)for(const b of [a+1,a+cols]){if(b>=total||!adjacent(a,b,cols))continue;[board[a],board[b]]=[board[b],board[a]];const groups=findMatches(board,cols,rows),primary=groups.find(g=>g.cells.includes(b))??groups.find(g=>g.cells.includes(a))??groups[0];[board[a],board[b]]=[board[b],board[a]];if(primary){fallback??=[a,b];if(preferredColor<0||primary.color===preferredColor)return[a,b];}}return strict&&preferredColor>=0?null:fallback;}
export function makeBoard(colors=COLORS,random=Math.random,cols=8,rows=8){const total=cols*rows;let board;do{board=[];for(let i=0;i<total;i++){let g;do{g=gem(undefined,colors,random);}while((i%cols>=2&&board[i-1].color===g.color&&board[i-2].color===g.color)||(i>=cols*2&&board[i-cols].color===g.color&&board[i-cols*2].color===g.color));board.push(g);}}while(!findMove(board,-1,false,cols,rows));return board;}
export function makeRealmBoard(colors=COLORS,random=Math.random,cols=9,rows=10){let board;for(let attempt=0;attempt<200;attempt++){board=makeBoard(colors,random,cols,rows);if(Array.from({length:Math.max(0,colors-6)},(_,i)=>i+6).every(color=>board.filter(g=>g.color===color).length>=5))return board;}return board;}
export function makeStageBoard(level){if(level>100)return makeRealmBoard(realmStage(level).colors,Math.random,9,10);if(![1,2].includes(level))return makeBoard();for(let attempt=0;attempt<250;attempt++){const b=makeBoard();if(level===2||level===9){for(const row of [0,4,7]){for(const col of [0,1,3])b[row*8+col].color=1;b[row*8+2].color=2;b[row*8+4].color=0;}}if(level===7){for(const i of [0,1,3,10])b[i].color=4;b[2].color=2;b[4].color=0;}if(findMatches(b).length)continue;const move=findMove(b,level===7?4:level===2||level===9?1:-1);if(!move)continue;[b[move[0]],b[move[1]]]=[b[move[1]],b[move[0]]];const groups=findMatches(b);groups[0].cells.slice(0,2).forEach(i=>b[i].crystal=true);[b[move[0]],b[move[1]]]=[b[move[1]],b[move[0]]];return b;}return makeBoard();}
export function shuffleExistingBoard(board,cols=boardCols(board),rows=boardRows(board)){
  const total=cols*rows;
  if(!board||board.length!==total)return board;
  const normals=[];
  board.forEach((g,i)=>{if(!g?.special&&!g?.crystal)normals.push(i);});
  if(normals.length>=6){
    for(let attempt=0;attempt<350;attempt++){
      const candidate=[...board],shuffled=normals.map(i=>candidate[i]);
      for(let i=shuffled.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];
      }
      normals.forEach((pos,idx)=>{candidate[pos]=shuffled[idx];});
      if(findMatches(candidate,cols,rows).length===0&&findMove(candidate,-1,false,cols,rows)){
        for(let i=0;i<total;i++)board[i]=candidate[i];
        return board;
      }
    }
  }
  for(let attempt=0;attempt<500;attempt++){
    const candidate=[...board];
    for(let i=total-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [candidate[i],candidate[j]]=[candidate[j],candidate[i]];
    }
    if(findMatches(candidate,cols,rows).length===0&&findMove(candidate,-1,false,cols,rows)){
      for(let i=0;i<total;i++)board[i]=candidate[i];
      return board;
    }
  }
  const candidate=[...board];
  for(let i=total-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [candidate[i],candidate[j]]=[candidate[j],candidate[i]];
  }
  for(let i=0;i<total;i++)board[i]=candidate[i];
  return board;
}
export function affected(board,initial,cols=boardCols(board),rows=boardRows(board)){const set=new Set(initial),queue=[...set];const effects=[];for(let k=0;k<queue.length;k++){const i=queue[k],g=board[i];if(!g?.special)continue;const r=Math.floor(i/cols),c=i%cols;effects.push({index:i,type:g.special,color:g.color});const extra=[];if(g.special==='row'||g.special==='cross')for(let x=0;x<cols;x++)extra.push(r*cols+x);if(g.special==='col'||g.special==='cross')for(let y=0;y<rows;y++)extra.push(y*cols+c);if(g.special==='bomb')for(let y=Math.max(0,r-1);y<=Math.min(rows-1,r+1);y++)for(let x=Math.max(0,c-1);x<=Math.min(cols-1,c+1);x++)extra.push(y*cols+x);if(g.special==='nova')board.forEach((v,n)=>{if(v?.color===g.color)extra.push(n);});for(const n of extra)if(!set.has(n)){set.add(n);queue.push(n);}}return {cells:[...set],effects};}
export function specialCreations(groups,preferred=[]){const creations=new Map;const count=new Map;groups.forEach(g=>g.cells.forEach(i=>count.set(i,(count.get(i)||0)+1)));for(const [i,n]of count)if(n>1)creations.set(i,'bomb');for(const g of groups){if(g.cells.some(i=>creations.has(i)))continue;if(g.cells.length>=4){const i=preferred.find(i=>g.cells.includes(i))??g.cells[Math.floor(g.cells.length/2)];creations.set(i,g.cells.length>=5?'nova':g.axis);}}return creations;}
export function collapse(board,colors=COLORS,random=Math.random,cols=boardCols(board),rows=boardRows(board)){for(let c=0;c<cols;c++){let dest=rows-1;for(let r=rows-1;r>=0;r--)if(board[r*cols+c]){board[dest*cols+c]=board[r*cols+c];if(dest!==r)board[r*cols+c]=null;dest--;}let born=0;while(dest>=0){const g=gem(undefined,colors,random);g.x=c;g.y=-1-born++;board[dest*cols+c]=g;dest--;}}return board;}
export function powerCells(type,i,board,cols=boardCols(board),rows=boardRows(board)){const total=cols*rows,r=Math.floor(i/cols),c=i%cols;if(type==='lightning')return Array.from({length:total},(_,n)=>n).filter(n=>Math.floor(n/cols)===r||n%cols===c);if(type==='solar')return Array.from({length:total},(_,n)=>n).filter(n=>Math.hypot(Math.floor(n/cols)-r,n%cols-c)<=2.65);if(type==='lunar')return board.flatMap((g,n)=>g.color===board[i].color?[n]:[]);return [];}
const STAGE_TYPES=['awakening','totem','colors','seals','bonus','cascade','special','ritual','overdrive','guardian'];
const STAGE_NAMES={awakening:'새벽의 보석',totem:'수호자의 응답',colors:'색상의 제례',seals:'잠든 봉인',bonus:'고요한 보물방',cascade:'연쇄의 계단',special:'별의 공방',ritual:'잃어버린 의식',overdrive:'세 번째 각성',guardian:'사원의 수호자'};
const STAGE_TIPS={awakening:'4·5매치와 토템을 이어 제한 시간 안에 목표를 달성하세요.',totem:'같은 색을 이어가세요. 토템 Lv.2부터 3연속 위력 1.5배!',colors:'목표 색과 특수 보석을 함께 만드는 교환을 찾으세요.',seals:'흩어진 봉인을 공략하세요. 위·옆 매치와 토템이 한 겹씩 깹니다.',bonus:'60초 보물방! 특수 보석과 토템으로 보물을 빠르게 모으세요.',cascade:'제한 시간 안에 도전하세요. 보드 아래쪽에서 연쇄를 설계하세요.',special:'4개·5개·T자 매치로 특수 보석을 직접 만드세요.',ritual:'목표 색을 모으면서 봉인까지 깨는 수를 찾으세요.',overdrive:'토템을 여러 번 발동하세요. Lv.2의 3연속 1.5배가 공략을 돕습니다.',guardian:'제한 시간 안에 봉인, 수정, 토템 목표를 모두 달성하세요.'};
function sealsFor(level,count,hp){const chosen=[],available=Array.from({length:64},(_,i)=>i),distance=(a,b)=>Math.abs(a%8-b%8)+Math.abs(Math.floor(a/8)-Math.floor(b/8));for(let k=0;k<count;k++){available.sort((a,b)=>{const rank=i=>chosen.length?Math.min(...chosen.map(j=>distance(i,j))):0;return rank(b)-rank(a)||((a*19+level*7)%67)-((b*19+level*7)%67);});chosen.push(available.shift());}return chosen.map(index=>({index,hp}));}
export function stageDesign(level){if(level>100)return realmStage(level);const chapter=chapterIndex(level),local=(level-1)%20+1,beat=(level-1)%10,type=STAGE_TYPES[beat],second=local>10?1:0;
  let rawTarget = 3200 + chapter * 7500 + (local - 1) * 400;
  if(beat === 9) rawTarget = Math.round(rawTarget * 1.20);
  else if(beat === 4) rawTarget = Math.round(rawTarget * 0.85);

  const crystals = 3 + chapter + Math.floor(local / 10);
  let time = 50 - chapter * 2;
  if(beat === 4) time = 35;
  else if(beat === 9) time = 55;

  const stage = {
    level,
    chapter,
    type,
    name: STAGE_NAMES[type],
    tip: STAGE_TIPS[type],
    target: Math.round(rawTarget / 50) * 50,
    crystals,
    time,
    focusColor: null,
    colorTarget: 0,
    seals: [],
    comboTarget: 0,
    specialTarget: 0,
    totemTarget: 0,
    overdriveTarget: 0
  };

  const hp = chapter >= 3 ? 3 : chapter >= 1 || local > 10 ? 2 : 1;
  if(type === 'awakening' && level > 1){ stage.specialTarget = 2; stage.seals = sealsFor(level, 4 + chapter * 2, hp); }
  if(type === 'totem') stage.totemTarget = 2 + Math.floor(chapter / 2) + second;
  if(type === 'colors'){ stage.focusColor = (chapter + Math.floor((level - 1) / 10)) % 6; stage.colorTarget = 12 + chapter * 4 + second * 2; }
  if(type === 'seals') stage.seals = sealsFor(level, 6 + chapter * 2 + second, hp);
  if(type === 'bonus'){ stage.time = 35; stage.target = Math.round(stage.target * 0.85 / 50) * 50; stage.crystals = Math.max(3, stage.crystals - 1); stage.seals = sealsFor(level, 4 + chapter * 2, hp); }
  if(type === 'cascade'){ stage.comboTarget = 3; stage.time = 48 - chapter * 2; stage.specialTarget = 2; }
  if(type === 'special') stage.specialTarget = 2 + Math.floor(chapter / 2) + second;
  if(type === 'ritual'){ stage.focusColor = (chapter + 1) % 6; stage.colorTarget = 10 + chapter * 3; stage.seals = sealsFor(level, 8 + chapter * 2, hp); }
  if(type === 'overdrive'){ stage.name = '토템의 시험'; stage.totemTarget = 2 + Math.floor(chapter / 2); stage.specialTarget = 2; stage.time = 50 - chapter * 2; }
  if(type === 'guardian'){ stage.target = Math.round(stage.target * 1.20 / 50) * 50; stage.time = 55; stage.seals = sealsFor(level, 8 + chapter * 2 + second, hp); stage.totemTarget = 2 + Math.floor(chapter / 2); stage.name = ['비취의 수문장','정글의 쌍둥이 수호자','폭풍의 거인','달그림자 사제','황금 태양의 심장'][chapter]; }

  if(level === 1){ stage.name = '첫 번째 빛'; stage.tip = '50초 동안 3,200점과 수정 3개를 모으세요! 목표 달성 후에도 끝까지 최고 점수에 도전하세요.'; stage.target = 3200; stage.crystals = 3; stage.time = 50; }
  if(level === 2){ stage.name = '두 번의 부름'; stage.tip = '50초 동안 같은 색 보석을 2연속 맞춰 토템을 발동하세요! 3,600점 돌파가 목표입니다.'; stage.target = 3600; stage.crystals = 3; stage.time = 50; }
  if(level === 3){ stage.name = '비취를 찾아서'; stage.tip = '50초 동안 비취 12개와 수정 3개를 모으세요. 목표 달성 후 3성 고득점을 노려보세요!'; stage.target = 4000; stage.crystals = 3; stage.time = 50; }
  if(level === 4){ stage.name = '비취 정령의 문'; stage.tip = '50초 동안 사원의 봉인을 깨고 3성에 도전하세요.'; stage.target = 4400; stage.crystals = 3; stage.time = 50; }
  if(level === 7) stage.name = '달의 선물';
  if(level === 9) stage.tip = '50초 동안 토템과 콤보 연계! 3연속 1.5배 각성으로 고득점을 달성하세요.';
  if(level === 10) stage.tip = '55초 보스전! 봉인과 토템을 집중 공략하고 제1장 수문장으로 전진하세요.';

  stage.timeCap = Math.min(54, stage.time + 5);
  return stage;
}
export function extendTime(stage,time,p){return Math.min(stage.timeCap,time+p.seconds);}
export function stageGoals(stage,metrics){if(stage.type==='realm')return [{id:'enemy',label:'몬스터 격파',value:Math.max(0,stage.hp-(metrics.enemyHP??stage.hp)),target:stage.hp,done:(metrics.enemyHP??stage.hp)<=0}];const goals=[{id:'score',label:'점수',value:metrics.score,target:stage.target},{id:'crystals',label:'수정',value:metrics.crystals,target:stage.crystals}];if(stage.colorTarget)goals.push({id:'color',label:colorNames[stage.focusColor],value:metrics.colorCollected?.[stage.focusColor]||0,target:stage.colorTarget,color:stage.focusColor});if(stage.seals.length)goals.push({id:'seals',label:'봉인',value:metrics.sealsBroken||0,target:stage.seals.length});if(stage.comboTarget)goals.push({id:'combo',label:'최대 연쇄',value:metrics.bestCascade||0,target:stage.comboTarget});if(stage.specialTarget)goals.push({id:'special',label:'특수 보석 생성',value:metrics.specialsMade||0,target:stage.specialTarget});if(stage.totemTarget)goals.push({id:'totem',label:'토템 발동',value:metrics.totemCasts||0,target:stage.totemTarget});if(stage.overdriveTarget)goals.push({id:'overdrive',label:'1.5배 각성',value:metrics.overdrives||0,target:stage.overdriveTarget});return goals.map(g=>({...g,done:g.value>=g.target}));}
export function objectives(level){return stageDesign(level);}

export const STAGE_SCENARIOS_100 = [
  '태양 사원의 거대한 석문 앞에 도착했습니다. 먼지 쌓인 석판에 새겨진 고대 보석들이 당신의 손길에 은은한 첫 번째 빛을 뿜어냅니다.',
  '닫힌 석문 틈새로 붉고 푸른 기운이 새어나옵니다. 같은 색의 보석을 연속으로 맞추어 고대 수호 토템의 영혼을 깨우세요.',
  '사원 회랑 바닥에 비취빛 넝쿨 문양이 드러납니다. 녹색 비취 보석을 모아 대지의 맥박을 이어가세요.',
  '첫 번째 관문인 비취 토템의 봉인이 풀렸습니다! 석판 주위에 얽힌 견고한 봉인석들을 깨뜨려 전진하세요.',
  '사원의 숨겨진 보물방이 모습을 드러냈습니다! 시간이 흐르기 전에 쏟아지는 보석과 수정을 최대한 거두세요.',
  '계단 아래로 이어지는 통로에서 보석들이 공명합니다. 아래쪽에서 연속 매치를 설계하여 깊은 연쇄를 유도하세요.',
  '벽화에 보석을 조합하는 비전이 새겨져 있습니다. 4개 이상의 보석을 정렬하여 강력한 힘을 품은 특수 보석을 빚어내세요.',
  '고대 사제들이 거행하던 색상의 제례터입니다. 지정된 색상의 보석을 바치고 바닥의 결계를 정화하세요.',
  '수호 토템들이 더 강한 공명을 요구합니다. 3연속 같은 색 매치로 1.5배 각성의 위력을 증명하세요.',
  '회랑의 중간을 지키는 비취 수호 석상이 눈을 떴습니다! 강력한 연쇄로 수호 석상을 제압하고 나아가세요.',
  '사원의 외벽 테라스에 도달했습니다. 시원한 정글 바람 사이로 푸른 사파이어 보석들이 반짝입니다.',
  '햇살을 굴절시키는 태양 거울 장치입니다. 연속된 매치로 거울의 각도를 맞추어 문을 여세요.',
  '고대 탐험가들이 남긴 표식이 바닥에 새겨져 있습니다. 목표 색상의 보석을 찾아 길을 밝히세요.',
  '더욱 단단해진 이중 봉인이 계단을 막고 있습니다. 특수 폭탄석을 제조하여 단숨에 돌파하세요.',
  '태양신의 두 번째 비밀 수장고가 열렸습니다! 짧은 시간 동안 제한 없이 보물과 수정을 거두세요.',
  '지하 수로로 이어지는 틈새에서 보석들이 빠르게 낙하합니다. 쏟아지는 연쇄의 리듬을 타세요.',
  '사제들의 비전이 깃든 노바 문양이 빛납니다. 5개 연결로 궁극의 전방위 정화석을 창조하세요.',
  '신성한 화염이 피어오르는 제례터입니다. 불의 토템을 깨워 굳게 닫힌 차단막을 태우세요.',
  '수문장의 방 문턱에 도착했습니다. 모든 토템 기술과 집중력을 모아 최후의 도전을 준비하세요.',
  '제1장 최후의 관문! [비취의 수문장]이 길을 막아섭니다. 모든 토템과 봉인을 격파하고 사원의 중심 문을 여세요!',
  '안개 자욱한 지하 정글 성소의 1번째 방입니다. 에메랄드빛 폭포와 덩굴 결계를 뚫고 전진하세요.',
  '고대 비취 여신의 맥박이 보석판을 감쌉니다. 2번째 시련의 봉인을 특수 보석과 토템으로 분쇄하세요.',
  '안개 자욱한 지하 정글 성소의 3번째 방입니다. 에메랄드빛 폭포와 덩굴 결계를 뚫고 전진하세요.',
  '고대 비취 여신의 맥박이 보석판을 감쌉니다. 4번째 시련의 봉인을 특수 보석과 토템으로 분쇄하세요.',
  '비취 정원의 숨겨진 보물방(관문 25)이 열렸습니다! 60초 동안 쏟아지는 에메랄드 수정을 가득 담으세요.',
  '고대 비취 여신의 맥박이 보석판을 감쌉니다. 6번째 시련의 봉인을 특수 보석과 토템으로 분쇄하세요.',
  '안개 자욱한 지하 정글 성소의 7번째 방입니다. 에메랄드빛 폭포와 덩굴 결계를 뚫고 전진하세요.',
  '고대 비취 여신의 맥박이 보석판을 감쌉니다. 8번째 시련의 봉인을 특수 보석과 토템으로 분쇄하세요.',
  '안개 자욱한 지하 정글 성소의 9번째 방입니다. 에메랄드빛 폭포와 덩굴 결계를 뚫고 전진하세요.',
  '고대 비취 여신의 맥박이 보석판을 감쌉니다. 10번째 시련의 봉인을 특수 보석과 토템으로 분쇄하세요.',
  '안개 자욱한 지하 정글 성소의 11번째 방입니다. 에메랄드빛 폭포와 덩굴 결계를 뚫고 전진하세요.',
  '고대 비취 여신의 맥박이 보석판을 감쌉니다. 12번째 시련의 봉인을 특수 보석과 토템으로 분쇄하세요.',
  '안개 자욱한 지하 정글 성소의 13번째 방입니다. 에메랄드빛 폭포와 덩굴 결계를 뚫고 전진하세요.',
  '고대 비취 여신의 맥박이 보석판을 감쌉니다. 14번째 시련의 봉인을 특수 보석과 토템으로 분쇄하세요.',
  '비취 정원의 숨겨진 보물방(관문 35)이 열렸습니다! 60초 동안 쏟아지는 에메랄드 수정을 가득 담으세요.',
  '고대 비취 여신의 맥박이 보석판을 감쌉니다. 16번째 시련의 봉인을 특수 보석과 토템으로 분쇄하세요.',
  '안개 자욱한 지하 정글 성소의 17번째 방입니다. 에메랄드빛 폭포와 덩굴 결계를 뚫고 전진하세요.',
  '고대 비취 여신의 맥박이 보석판을 감쌉니다. 18번째 시련의 봉인을 특수 보석과 토템으로 분쇄하세요.',
  '안개 자욱한 지하 정글 성소의 19번째 방입니다. 에메랄드빛 폭포와 덩굴 결계를 뚫고 전진하세요.',
  '제2장 최후의 관문! 정글의 쌍둥이 수호자가 포효합니다. 맹렬한 연쇄와 토템으로 수호자를 굴복시키세요!',
  '절벽 꼭대기에 자리한 천둥 제단의 1번째 시련입니다. 번개의 궤적을 따라 보석들을 관통하세요.',
  '먹구름 사이로 푸른 벼락이 전율을 일으킵니다. 2번째 전격 결계를 삼중 봉인과 함께 정화하세요.',
  '절벽 꼭대기에 자리한 천둥 제단의 3번째 시련입니다. 번개의 궤적을 따라 보석들을 관통하세요.',
  '먹구름 사이로 푸른 벼락이 전율을 일으킵니다. 4번째 전격 결계를 삼중 봉인과 함께 정화하세요.',
  '폭풍우의 눈 한가운데 위치한 보물방(관문 45)입니다! 벼락이 치는 틈을 타 신속하게 수정들을 수확하세요.',
  '먹구름 사이로 푸른 벼락이 전율을 일으킵니다. 6번째 전격 결계를 삼중 봉인과 함께 정화하세요.',
  '절벽 꼭대기에 자리한 천둥 제단의 7번째 시련입니다. 번개의 궤적을 따라 보석들을 관통하세요.',
  '먹구름 사이로 푸른 벼락이 전율을 일으킵니다. 8번째 전격 결계를 삼중 봉인과 함께 정화하세요.',
  '절벽 꼭대기에 자리한 천둥 제단의 9번째 시련입니다. 번개의 궤적을 따라 보석들을 관통하세요.',
  '먹구름 사이로 푸른 벼락이 전율을 일으킵니다. 10번째 전격 결계를 삼중 봉인과 함께 정화하세요.',
  '절벽 꼭대기에 자리한 천둥 제단의 11번째 시련입니다. 번개의 궤적을 따라 보석들을 관통하세요.',
  '먹구름 사이로 푸른 벼락이 전율을 일으킵니다. 12번째 전격 결계를 삼중 봉인과 함께 정화하세요.',
  '절벽 꼭대기에 자리한 천둥 제단의 13번째 시련입니다. 번개의 궤적을 따라 보석들을 관통하세요.',
  '먹구름 사이로 푸른 벼락이 전율을 일으킵니다. 14번째 전격 결계를 삼중 봉인과 함께 정화하세요.',
  '폭풍우의 눈 한가운데 위치한 보물방(관문 55)입니다! 벼락이 치는 틈을 타 신속하게 수정들을 수확하세요.',
  '먹구름 사이로 푸른 벼락이 전율을 일으킵니다. 16번째 전격 결계를 삼중 봉인과 함께 정화하세요.',
  '절벽 꼭대기에 자리한 천둥 제단의 17번째 시련입니다. 번개의 궤적을 따라 보석들을 관통하세요.',
  '먹구름 사이로 푸른 벼락이 전율을 일으킵니다. 18번째 전격 결계를 삼중 봉인과 함께 정화하세요.',
  '절벽 꼭대기에 자리한 천둥 제단의 19번째 시련입니다. 번개의 궤적을 따라 보석들을 관통하세요.',
  '제3장 최후의 관문! 하늘의 지배자 [폭풍의 거인]이 벼락을 내리꽂습니다. 최강의 번개로 거인을 제압하세요!',
  '달빛만이 스며드는 신비로운 보랏빛 회랑 1번째 방입니다. 왜곡된 차원의 흐름을 정돈하세요.',
  '달의 호수 수면에 비친 별빛이 요동칩니다. 2번째 차원의 룬 봉인을 토템의 파동으로 걷어내세요.',
  '달빛만이 스며드는 신비로운 보랏빛 회랑 3번째 방입니다. 왜곡된 차원의 흐름을 정돈하세요.',
  '달의 호수 수면에 비친 별빛이 요동칩니다. 4번째 차원의 룬 봉인을 토템의 파동으로 걷어내세요.',
  '달의 신비가 깃든 시공간 정지 보물방(관문 65)입니다! 귀중한 보랏빛 수정을 한가득 모으세요.',
  '달의 호수 수면에 비친 별빛이 요동칩니다. 6번째 차원의 룬 봉인을 토템의 파동으로 걷어내세요.',
  '달빛만이 스며드는 신비로운 보랏빛 회랑 7번째 방입니다. 왜곡된 차원의 흐름을 정돈하세요.',
  '달의 호수 수면에 비친 별빛이 요동칩니다. 8번째 차원의 룬 봉인을 토템의 파동으로 걷어내세요.',
  '달빛만이 스며드는 신비로운 보랏빛 회랑 9번째 방입니다. 왜곡된 차원의 흐름을 정돈하세요.',
  '달의 호수 수면에 비친 별빛이 요동칩니다. 10번째 차원의 룬 봉인을 토템의 파동으로 걷어내세요.',
  '달빛만이 스며드는 신비로운 보랏빛 회랑 11번째 방입니다. 왜곡된 차원의 흐름을 정돈하세요.',
  '달의 호수 수면에 비친 별빛이 요동칩니다. 12번째 차원의 룬 봉인을 토템의 파동으로 걷어내세요.',
  '달빛만이 스며드는 신비로운 보랏빛 회랑 13번째 방입니다. 왜곡된 차원의 흐름을 정돈하세요.',
  '달의 호수 수면에 비친 별빛이 요동칩니다. 14번째 차원의 룬 봉인을 토템의 파동으로 걷어내세요.',
  '달의 신비가 깃든 시공간 정지 보물방(관문 75)입니다! 귀중한 보랏빛 수정을 한가득 모으세요.',
  '달의 호수 수면에 비친 별빛이 요동칩니다. 16번째 차원의 룬 봉인을 토템의 파동으로 걷어내세요.',
  '달빛만이 스며드는 신비로운 보랏빛 회랑 17번째 방입니다. 왜곡된 차원의 흐름을 정돈하세요.',
  '달의 호수 수면에 비친 별빛이 요동칩니다. 18번째 차원의 룬 봉인을 토템의 파동으로 걷어내세요.',
  '달빛만이 스며드는 신비로운 보랏빛 회랑 19번째 방입니다. 왜곡된 차원의 흐름을 정돈하세요.',
  '제4장 최후의 관문! 차원의 지배자 [달그림자 사제]가 환영의 장벽을 펼칩니다. 진실의 빛으로 결계를 깨뜨리세요!',
  '마침내 몬테주마의 황금 심장부 1번째 방에 진입했습니다. 태양의 각성을 일으켜 황금 제례를 완수하세요.',
  '황금으로 주조된 불멸의 수호 봉인석들입니다. 2번째 방의 모든 봉인을 6대 토템의 힘으로 격파하세요.',
  '마침내 몬테주마의 황금 심장부 3번째 방에 진입했습니다. 태양의 각성을 일으켜 황금 제례를 완수하세요.',
  '황금으로 주조된 불멸의 수호 봉인석들입니다. 4번째 방의 모든 봉인을 6대 토템의 힘으로 격파하세요.',
  '황금 제국의 전설적인 황실 보물창고(관문 85)가 열렸습니다! 끝없이 쏟아지는 수정을 담으세요.',
  '황금으로 주조된 불멸의 수호 봉인석들입니다. 6번째 방의 모든 봉인을 6대 토템의 힘으로 격파하세요.',
  '마침내 몬테주마의 황금 심장부 7번째 방에 진입했습니다. 태양의 각성을 일으켜 황금 제례를 완수하세요.',
  '황금으로 주조된 불멸의 수호 봉인석들입니다. 8번째 방의 모든 봉인을 6대 토템의 힘으로 격파하세요.',
  '마침내 몬테주마의 황금 심장부 9번째 방에 진입했습니다. 태양의 각성을 일으켜 황금 제례를 완수하세요.',
  '황금으로 주조된 불멸의 수호 봉인석들입니다. 10번째 방의 모든 봉인을 6대 토템의 힘으로 격파하세요.',
  '마침내 몬테주마의 황금 심장부 11번째 방에 진입했습니다. 태양의 각성을 일으켜 황금 제례를 완수하세요.',
  '황금으로 주조된 불멸의 수호 봉인석들입니다. 12번째 방의 모든 봉인을 6대 토템의 힘으로 격파하세요.',
  '마침내 몬테주마의 황금 심장부 13번째 방에 진입했습니다. 태양의 각성을 일으켜 황금 제례를 완수하세요.',
  '황금으로 주조된 불멸의 수호 봉인석들입니다. 14번째 방의 모든 봉인을 6대 토템의 힘으로 격파하세요.',
  '황금 제국의 전설적인 황실 보물창고(관문 95)가 열렸습니다! 끝없이 쏟아지는 수정을 담으세요.',
  '황금으로 주조된 불멸의 수호 봉인석들입니다. 16번째 방의 모든 봉인을 6대 토템의 힘으로 격파하세요.',
  '마침내 몬테주마의 황금 심장부 17번째 방에 진입했습니다. 태양의 각성을 일으켜 황금 제례를 완수하세요.',
  '황금으로 주조된 불멸의 수호 봉인석들입니다. 18번째 방의 모든 봉인을 6대 토템의 힘으로 격파하세요.',
  '마침내 몬테주마의 황금 심장부 19번째 방에 진입했습니다. 태양의 각성을 일으켜 황금 제례를 완수하세요.',
  '운명의 최종장! [황금 태양의 심장 몬테주마]의 진정한 각성! 100번째 관문을 돌파하고 고대 제국의 영원한 전설이 되십시오!',
];

export function stageScenario(level){
  if(level>100){const d=realmStage(level),image=realmBackdrop(d);return {chapterIndex:d.chapter,chapterTitle:chapters[d.chapter][0],chapterSub:chapters[d.chapter][1],localStage:d.step+1,title:`제${d.chapter+1}장 ${chapters[d.chapter][0]} · 제${d.step+1}전투`,story:d.story,image};}
  const ci = chapterIndex(level);
  const local = (level - 1) % 20 + 1;
  const chapterTitle = chapters[ci][0];
  const chapterSub = chapters[ci][1];
  const story = STAGE_SCENARIOS_100[level - 1] || `${chapterTitle}의 제${local}관문입니다. 고대 사원의 시련을 통과하여 다음 방으로 전진하세요.`;
  const image = `assets/stages/stage_${level}.jpg`;
  return {
    chapterIndex: ci,
    chapterTitle,
    chapterSub,
    localStage: local,
    title: `제${ci + 1}장 ${chapterTitle} · 제${local}관문`,
    story,
    image,
    isBoss: local === 20,
    isBonus: (local % 10 === 5)
  };
}
