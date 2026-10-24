import sys
import math
import random

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Stage Types & Chapters
CHAPTERS = [
    "태양의 문 (The Gate of the Sun)",
    "비취 정원 (The Jade Garden)",
    "천둥 제단 (The Thunder Altar)",
    "달빛 성소 (The Lunar Sanctum)",
    "황금 심장부 (The Golden Heart)"
]

def simulate_stage(level):
    chapter = min(4, (level - 1) // 20)
    local = (level - 1) % 20 + 1
    beat = (level - 1) % 10
    
    # 50-second blitz target curve (< 1 minute):
    base_target = 3000 + chapter * 6500 + (local - 1) * 350
    if beat == 9: # Boss Stage (55s)
        base_target = int(base_target * 1.20)
    elif beat == 4: # Bonus Room (35s)
        base_target = int(base_target * 0.85)

    base_crystals = 3 + chapter + (local // 10)
    time_limit = 50 - chapter * 2
    if beat == 4:
        time_limit = 35
    elif beat == 9:
        time_limit = 55

    # 3-Star Criteria
    star2_score = int(base_target * 1.3)
    star3_score = int(base_target * 1.6)
    alt_star3_score = int(base_target * 1.85) # High score path if crystals short

    # Simulate 50 Player Runs per Stage - Player plays the FULL round (does not end in middle!)
    runs = []
    for _ in range(50):
        sim_time = time_limit
        score = 0
        crystals = 0
        moves = 0
        totem_casts = 0
        seals_broken = 0
        best_combo = 1
        
        while sim_time > 0:
            move_cost = random.uniform(1.2, 1.8)
            sim_time -= move_cost
            moves += 1
            
            # Match simulation: 3-gem, 4-gem, cascade
            combo = 1
            r = random.random()
            if r < 0.65:
                match_cells = 3
            elif r < 0.88:
                match_cells = 4
                combo = 2
            else:
                match_cells = 5
                combo = random.randint(2, 4)
            
            best_combo = max(best_combo, combo)
            match_score = match_cells * 50 * combo
            
            # Crystal drop rate: ~10%
            if random.random() < 0.12 * match_cells:
                crystals += 1
                
            # Totem cast simulation (approx 1 cast per 4-5 moves)
            totem_power_mult = 1.0 + chapter * 0.25
            if moves % random.randint(3, 5) == 0:
                totem_casts += 1
                totem_type = random.randint(0, 5)
                if totem_type == 1: # Fire - Toned down controlled precision blast (1~3 meteors, max 16 cells)
                    fire_cells = min(16, int(random.randint(6, 14) * totem_power_mult))
                    match_score += fire_cells * 60
                    if random.random() < 0.3:
                        crystals += 1
                elif totem_type == 2: # Thunder
                    match_score += int(10 * 55 * totem_power_mult)
                elif totem_type == 3: # Gold
                    match_score += int(random.randint(1200, 3000) * totem_power_mult)
                elif totem_type == 0: # Jade
                    crystals += random.randint(1, 3)
                elif totem_type == 5: # Time
                    sim_time = min(58, sim_time + random.randint(3, 7))
                elif totem_type == 4: # Lunar
                    match_score += 600
            
            score += match_score
                
        # Evaluate stars at the end of the round:
        # Standard: score >= target & crystals >= base_crystals
        passed_standard = (score >= base_target and crystals >= base_crystals)
        # Alternate pass: crystals short, but score >= 125% target
        passed_alternate = (score >= int(base_target * 1.25))
        passed = passed_standard or passed_alternate
        
        stars = 0
        if passed:
            stars = 1
            if score >= star2_score and (crystals >= base_crystals or best_combo >= 3):
                stars = 2
            # 3 Stars: Either standard 3-star or Alternate 3-star (High Score without enough crystals)
            if score >= star3_score and crystals >= base_crystals and (best_combo >= 3 or totem_casts >= 2):
                stars = 3
            elif score >= alt_star3_score and (best_combo >= 3 or totem_casts >= 2): # Alternate route!
                stars = 3
                
        runs.append({
            'score': score,
            'crystals': crystals,
            'remaining_time': max(0, sim_time),
            'moves': moves,
            'stars': stars,
            'passed': passed
        })
        
    avg_score = sum(r['score'] for r in runs) / len(runs)
    avg_crystals = sum(r['crystals'] for r in runs) / len(runs)
    avg_time = sum(r['remaining_time'] for r in runs) / len(runs)
    avg_moves = sum(r['moves'] for r in runs) / len(runs)
    pass_rate = sum(1 for r in runs if r['passed']) / len(runs) * 100
    star3_rate = sum(1 for r in runs if r['stars'] == 3) / len(runs) * 100
    
    return {
        'level': level,
        'chapter': chapter,
        'target': base_target,
        'crystals': base_crystals,
        'time_limit': time_limit,
        'star2_score': star2_score,
        'star3_score': star3_score,
        'alt_star3_score': alt_star3_score,
        'avg_score': avg_score,
        'avg_moves': avg_moves,
        'avg_crystals': avg_crystals,
        'avg_remaining_time': avg_time,
        'pass_rate': pass_rate,
        'star3_rate': star3_rate
    }

if __name__ == '__main__':
    print("================================================================================")
    print("🎮 SOLAR RELIC: 100-STAGE ARCADE LEVELING SIMULATION")
    print("================================================================================")
    sample_levels = [1, 2, 5, 10, 20, 25, 40, 50, 60, 80, 100]
    for lvl in sample_levels:
        res = simulate_stage(lvl)
        print(f"STAGE {lvl:3d} [{CHAPTERS[res['chapter']][:12]}]: Target {res['target']:6d} pts | Crystals {res['crystals']} | Time {res['time_limit']}s")
        print(f"    Avg Moves: {res['avg_moves']:.1f} | Avg Score: {res['avg_score']:7.0f} | Left Time: {res['avg_remaining_time']:.1f}s")
        print(f"    Pass Rate: {res['pass_rate']:5.1f}% | 3-Star Rate: {res['star3_rate']:5.1f}%")
        print("--------------------------------------------------------------------------------")
    print("\nSimulation analysis complete!")
