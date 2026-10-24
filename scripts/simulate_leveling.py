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
    
    # Calibrated Target Curve for Arcade Fun:
    # Level 1: ~4,500 pts
    # Level 10: ~12,000 pts
    # Level 20: ~22,000 pts
    # Level 50: ~50,000 pts
    # Level 100: ~100,000 pts
    base_target = 4500 + chapter * 12000 + (local - 1) * 650
    if beat == 9: # Boss Stage (10, 20, 30...)
        base_target = int(base_target * 1.20)
    elif beat == 4: # Bonus Room (5, 15, 25...)
        base_target = int(base_target * 0.85)

    base_crystals = 4 + chapter + (local // 8)
    time_limit = 90 - chapter * 2
    if beat == 4:
        time_limit = 60
    elif beat == 9:
        time_limit = 105

    # 3-Star Criteria
    star2_score = int(base_target * 1.3)
    star3_score = int(base_target * 1.6)

    # Alternate 3-Star (if crystals short)
    alt_star3_score = int(base_target * 1.9) # High score path

    # Simulate 50 Player Runs per Stage
    runs = []
    for _ in range(50):
        # Player speed: 0.5 to 0.8 moves per second
        sim_time = time_limit
        score = 0
        crystals = 0
        moves = 0
        totem_casts = 0
        seals_broken = 0
        best_combo = 1
        
        while sim_time > 0 and score < star3_score * 1.4:
            move_cost = random.uniform(1.2, 2.2)
            sim_time -= move_cost
            moves += 1
            
            # Match simulation: 3-gem, 4-gem, cascade
            combo = 1
            r = random.random()
            if r < 0.60:
                match_cells = 3
            elif r < 0.85:
                match_cells = 4
                combo = 2
            else:
                match_cells = 5
                combo = random.randint(2, 5)
            
            best_combo = max(best_combo, combo)
            match_score = match_cells * 50 * combo
            
            # Crystal drop rate: ~10%
            if random.random() < 0.12 * match_cells:
                crystals += 1
                
            # Totem cast simulation (approx 1 cast per 4-5 moves)
            totem_power_mult = 1.0 + chapter * 0.35 # Upgraded totems in later chapters
            if moves % random.randint(3, 5) == 0:
                totem_casts += 1
                totem_type = random.randint(0, 5)
                if totem_type == 1: # Fire - restored massive blast
                    fire_cells = min(30, int(random.randint(12, 28) * totem_power_mult))
                    match_score += fire_cells * 70
                    crystals += random.randint(1, 3)
                elif totem_type == 2: # Thunder
                    match_score += int(14 * 65 * totem_power_mult)
                elif totem_type == 3: # Gold
                    match_score += int(random.randint(1500, 4500) * totem_power_mult)
                elif totem_type == 0: # Jade
                    crystals += random.randint(2, 5)
                elif totem_type == 5: # Time
                    sim_time += random.randint(6, 12)
            
            score += match_score
            
            # Check if player hit stop condition (finished with 3 stars)
            if score >= star3_score and crystals >= base_crystals and sim_time >= 15:
                break
                
        # Evaluate stars:
        # Standard: score >= target & crystals >= base_crystals
        passed_standard = (score >= base_target and crystals >= base_crystals)
        # Alternate pass: crystals short, but score >= 130% target or high time
        passed_alternate = (score >= int(base_target * 1.25) and sim_time >= 10)
        passed = passed_standard or passed_alternate
        
        stars = 0
        if passed:
            stars = 1
            if score >= star2_score and (sim_time >= 15 or crystals >= base_crystals):
                stars = 2
            # 3 Stars: Either standard 3-star or Alternate 3-star (High Score + Time)
            if score >= star3_score and crystals >= base_crystals and sim_time >= 15:
                stars = 3
            elif score >= alt_star3_score and sim_time >= 15: # Alternate route!
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
