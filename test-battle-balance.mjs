import {initialState,newBattle,stageDesign,possibleMoves,resolveTurn} from './dist/battle-engine.mjs';
const trials=40,stages=[101,105,110,111,120,125,130,140,150];
for(const stage of stages){let wins=0,turns=0;for(let t=0;t<trials;t++){
 const s=initialState();s.stage=stage;s.levels[6]=stage>=106?Math.min(5,1+Math.floor((stage-106)/10)):0;s.levels[7]=stage>=116?Math.min(5,1+Math.floor((stage-116)/10)):0;s.levels[8]=stage>=126?Math.min(5,1+Math.floor((stage-126)/10)):0;
 const tier=stage<106?0:stage<120?1:stage<140?2:3;s.gear={staff:tier,robe:tier,ring:tier};s.scrolls=stage>=110?['storm']:[];if(stage>=126)s.scrolls.push('ice','magma');s.battle=newBattle(s);const enemy=stageDesign(stage).enemy;
 for(let step=0;step<150&&s.battle.phase==='playing';step++){let moves=possibleMoves(s.battle.board,stageDesign(stage).size);moves.sort((a,b)=>score(b)-score(a));resolveTurn(s,moves[0].a,moves[0].b);}
 function score(m){return (m.color===s.battle.streak.color?100:0)+(enemy.weak.includes(m.color)?30:0)+(m.color===0&&s.battle.heroHP<60?24:0)+m.size*3+Math.random()*8;}
 if(s.battle.phase==='won'){wins++;turns+=s.battle.turn;}
 }console.log(`${stage}: ${wins}/${trials} wins, ${wins?Math.round(turns/wins):'-'} turns on wins`);}
