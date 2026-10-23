import math
import struct
import random
import os

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "dist", "assets", "sounds")
os.makedirs(OUTPUT_DIR, exist_ok=True)
SAMPLE_RATE = 44100

def write_wav(filename, samples_l, samples_r=None):
    if samples_r is None:
        samples_r = samples_l
    filepath = os.path.join(OUTPUT_DIR, filename)
    num_samples = len(samples_l)
    with open(filepath, "wb") as f:
        # RIFF header
        f.write(b"RIFF")
        data_size = num_samples * 2 * 2
        f.write(struct.pack("<I", 36 + data_size))
        f.write(b"WAVE")
        # fmt subchunk
        f.write(b"fmt ")
        f.write(struct.pack("<I", 16))
        f.write(struct.pack("<H", 1)) # PCM
        f.write(struct.pack("<H", 2)) # Stereo
        f.write(struct.pack("<I", SAMPLE_RATE))
        f.write(struct.pack("<I", SAMPLE_RATE * 4)) # Byte rate
        f.write(struct.pack("<H", 4)) # Block align
        f.write(struct.pack("<H", 16)) # Bits per sample
        # data subchunk
        f.write(b"data")
        f.write(struct.pack("<I", data_size))
        for l, r in zip(samples_l, samples_r):
            # Soft clamp
            l = max(-0.98, min(0.98, l))
            r = max(-0.98, min(0.98, r))
            il = int(l * 32767)
            ir = int(r * 32767)
            f.write(struct.pack("<hh", il, ir))
    print(f"Generated {filename} ({num_samples / SAMPLE_RATE:.2f}s)")

# 1. match.wav: 맑고 영롱하며 묵직한 크리스털 보석 파열음 (Crystal Gem Shatter & Thud)
def generate_match():
    duration = 0.55
    num_samples = int(SAMPLE_RATE * duration)
    samples_l = [0.0] * num_samples
    samples_r = [0.0] * num_samples
    
    # Fundamental frequencies for crystal bell: 659.25Hz (E5), 1318.5Hz (E6), 1975.5Hz (B6), 2637Hz (E7)
    frequencies = [(95.0, 0.45, 0.003, 14.0),     # Sub-bass crack thud
                   (659.25, 0.35, 0.002, 6.0),    # Core crystal chime
                   (1318.5, 0.25, 0.003, 7.5),    # Octave overtone
                   (1975.5, 0.18, 0.004, 9.0),    # Fifth overtone
                   (2637.0, 0.12, 0.005, 12.0)]   # High sparkle
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        val_l = 0.0
        val_r = 0.0
        for idx, (freq, amp, attack, decay) in enumerate(frequencies):
            # Attack-Decay envelope
            env = (t / attack) if t < attack else math.exp(-(t - attack) * decay)
            # Slight detune for shimmer
            phase_l = 2 * math.pi * freq * t
            phase_r = 2 * math.pi * (freq * 1.002) * t
            val_l += math.sin(phase_l) * amp * env
            val_r += math.sin(phase_r) * amp * env
        
        # Add glass crack noise burst in first 35ms
        if t < 0.045:
            noise = (random.random() * 2 - 1) * math.exp(-t * 90) * 0.22
            val_l += noise
            val_r += noise * 0.9
            
        samples_l[i] = val_l
        samples_r[i] = val_r
        
    write_wav("match.wav", samples_l, samples_r)

# 2. combo.wav: 상승하는 마법 연쇄 챠임 (Cascade Pentatonic Chime)
def generate_combo():
    duration = 0.75
    num_samples = int(SAMPLE_RATE * duration)
    samples_l = [0.0] * num_samples
    samples_r = [0.0] * num_samples
    
    notes = [523.25, 659.25, 783.99, 1046.50, 1318.51] # C, E, G, C, E
    delays = [0.0, 0.06, 0.12, 0.18, 0.24]
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        val_l = 0.0
        val_r = 0.0
        
        # Deep resonant body
        if t > 0.02:
            val_l += math.sin(2 * math.pi * 75 * t) * 0.3 * math.exp(-t * 4.5)
            val_r += math.sin(2 * math.pi * 75 * t) * 0.3 * math.exp(-t * 4.5)
            
        for n_idx, (freq, d) in enumerate(zip(notes, delays)):
            if t >= d:
                dt = t - d
                env = math.exp(-dt * 7.0)
                pan = (n_idx - 2) * 0.25 # Pan across stereo field
                s = math.sin(2 * math.pi * freq * dt) * 0.24 * env
                s += math.sin(2 * math.pi * freq * 2.01 * dt) * 0.1 * env
                val_l += s * (0.5 - pan * 0.5)
                val_r += s * (0.5 + pan * 0.5)
                
        samples_l[i] = val_l
        samples_r[i] = val_r
        
    write_wav("combo.wav", samples_l, samples_r)

# 3. bomb.wav: 대구경 시네마틱 서브우퍼 폭발음 (Deep Sub-bass Cinematic Bomb Detonation)
def generate_bomb():
    duration = 1.6
    num_samples = int(SAMPLE_RATE * duration)
    samples_l = [0.0] * num_samples
    samples_r = [0.0] * num_samples
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        # Deep pitch drop: 95Hz down to 22Hz for massive cinematic weight
        freq = 22.0 + 73.0 * math.exp(-t * 5.0)
        phase = 2 * math.pi * (22.0 * t + 73.0 * (1 - math.exp(-t * 5.0)) / 5.0)
        
        # Sub-bass core with saturation
        sub = math.sin(phase) * 0.85 * math.exp(-t * 1.8)
        # Heavy saturation / warmth
        sub = math.tanh(sub * 2.2) * 0.75
        
        # Low-frequency chest rumble (30Hz - 60Hz)
        rumble_freq = 38.0 + 15.0 * math.sin(t * 18.0)
        chest = math.sin(2 * math.pi * rumble_freq * t) * 0.45 * math.exp(-t * 2.2)
        
        # Debris & fire crackle noise
        noise = (random.random() * 2 - 1)
        noise_env = math.exp(-t * 2.5) if t > 0.015 else (t / 0.015)
        debris = noise * 0.35 * noise_env
        
        # Initial heavy shockwave slam (thud)
        thud = math.sin(2 * math.pi * 55 * t) * 0.6 * math.exp(-t * 25.0) if t < 0.15 else 0.0
        
        samples_l[i] = sub + chest + debris + thud
        samples_r[i] = sub + chest * 0.98 + debris * 1.05 + thud
        
    write_wav("bomb.wav", samples_l, samples_r)

# 4. laser.wav: 고출력 대구경 플라즈마 레이저 관통음 (Heavy Plasma Beam Arc Laser)
def generate_laser():
    duration = 1.1
    num_samples = int(SAMPLE_RATE * duration)
    samples_l = [0.0] * num_samples
    samples_r = [0.0] * num_samples
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        # Heavy laser sweep: 450Hz down to 65Hz (heavy body, not thin screech)
        freq = 65.0 + 385.0 * math.exp(-t * 7.0)
        phase = 2 * math.pi * (65.0 * t + 385.0 * (1 - math.exp(-t * 7.0)) / 7.0)
        
        # Rich sawtooth & square plasma harmonics
        saw = (math.sin(phase) + 0.5 * math.sin(phase * 2) + 0.3 * math.sin(phase * 3) + 0.2 * math.sin(phase * 4)) * 0.45 * math.exp(-t * 3.8)
        # Sub-bass punch underneath laser
        sub = math.sin(2 * math.pi * 55 * t) * 0.55 * math.exp(-t * 4.5)
        # High-voltage arc sizzle
        sizzle = (random.random() * 2 - 1) * 0.28 * math.exp(-t * 6.5)
        
        val = math.tanh((saw + sub + sizzle) * 1.6) * 0.8
        samples_l[i] = val
        samples_r[i] = val * (0.95 + 0.05 * math.sin(t * 30.0))
        
    write_wav("laser.wav", samples_l, samples_r)

# 5. nova.wav: 코스믹 전 화면 메가톤급 대폭발 (Cosmic Megaton Nova Shockwave)
def generate_nova():
    duration = 2.0
    num_samples = int(SAMPLE_RATE * duration)
    samples_l = [0.0] * num_samples
    samples_r = [0.0] * num_samples
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        # Deep earth-shaking shockwave (18Hz - 45Hz)
        sub_boom = math.sin(2 * math.pi * (18.0 + 40.0 * math.exp(-t * 2.0)) * t) * 0.85 * math.exp(-t * 1.4)
        sub_boom = math.tanh(sub_boom * 2.0) * 0.8
        
        # Multi-tonal resonant gong impact: 110Hz, 164Hz, 220Hz
        gong = (math.sin(2 * math.pi * 110 * t) * 0.3 +
                math.sin(2 * math.pi * 164.81 * t) * 0.25 +
                math.sin(2 * math.pi * 220 * t) * 0.2) * math.exp(-t * 2.2)
        
        # Massive atmospheric whoosh
        noise = (random.random() * 2 - 1) * 0.3 * math.exp(-t * 1.8)
        
        val_l = sub_boom + gong + noise
        val_r = sub_boom + gong * 0.96 + noise * 1.04
        samples_l[i] = val_l
        samples_r[i] = val_r
        
    write_wav("nova.wav", samples_l, samples_r)

# 6. totem.wav: 고대 수호 토템 각성 공명음 (Ancient Totem Awakening Gong)
def generate_totem():
    duration = 1.2
    num_samples = int(SAMPLE_RATE * duration)
    samples_l = [0.0] * num_samples
    samples_r = [0.0] * num_samples
    
    # Tibetan singing bowl / Ancient Mesoamerican bronze gong harmonics
    harmonics = [(146.83, 0.45, 2.5),  # D3 fundamental
                 (293.66, 0.30, 3.2),  # D4
                 (440.00, 0.22, 4.0),  # A4
                 (587.33, 0.18, 4.8),  # D5
                 (73.416, 0.35, 1.8)]  # Deep sub D2
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        val_l = 0.0
        val_r = 0.0
        for freq, amp, decay in harmonics:
            env = math.exp(-t * decay)
            val_l += math.sin(2 * math.pi * freq * t) * amp * env
            val_r += math.sin(2 * math.pi * (freq * 1.003) * t) * amp * env
            
        # Initial mallet strike snap
        if t < 0.02:
            snap = math.sin(2 * math.pi * 880 * t) * 0.3 * (1 - t / 0.02)
            val_l += snap
            val_r += snap
            
        samples_l[i] = val_l
        samples_r[i] = val_r
        
    write_wav("totem.wav", samples_l, samples_r)

# 7. win.wav: 관문 돌파 태양의 팡파레 (Victory Fanfare Chime)
def generate_win():
    duration = 1.4
    num_samples = int(SAMPLE_RATE * duration)
    samples_l = [0.0] * num_samples
    samples_r = [0.0] * num_samples
    
    fanfare = [(523.25, 0.0, 0.2),   # C5
               (659.25, 0.12, 0.2),  # E5
               (783.99, 0.24, 0.2),  # G5
               (1046.50, 0.38, 0.8)] # C6 sustain
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        val_l = 0.0
        val_r = 0.0
        
        # Sub boom at end
        if t >= 0.38:
            val_l += math.sin(2 * math.pi * 65 * (t - 0.38)) * 0.35 * math.exp(-(t - 0.38) * 3.0)
            val_r += math.sin(2 * math.pi * 65 * (t - 0.38)) * 0.35 * math.exp(-(t - 0.38) * 3.0)
            
        for freq, start, len_s in fanfare:
            if t >= start:
                dt = t - start
                env = math.exp(-dt * (2.2 if len_s > 0.5 else 5.0))
                s = math.sin(2 * math.pi * freq * dt) * 0.3 * env
                s += math.sin(2 * math.pi * freq * 2 * dt) * 0.12 * env
                val_l += s
                val_r += s
                
        samples_l[i] = val_l
        samples_r[i] = val_r
        
    write_wav("win.wav", samples_l, samples_r)

if __name__ == "__main__":
    generate_match()
    generate_combo()
    generate_bomb()
    generate_laser()
    generate_nova()
    generate_totem()
    generate_win()
    print("All professional audio assets created successfully in dist/assets/sounds/")
