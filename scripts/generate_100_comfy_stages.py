import os
import sys
import json
import time
import urllib.request
import urllib.error
from PIL import Image
import io

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

SERVER_URL = 'http://192.168.0.200:8188'
OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'dist', 'assets', 'stages')
os.makedirs(OUT_DIR, exist_ok=True)

TEMPLATE_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'comfyui_template.json')
with open(TEMPLATE_PATH, 'r', encoding='utf-8') as f:
    GRAPH_TEMPLATE = json.load(f)

# 100 Unique Cinematic Prompts for the 100 Stage Scenarios
STAGE_DESCRIPTIONS = {
    # --- Chapter 1: The Gate of the Sun (태양 사원의 입구, Stages 1-20) ---
    1: "grand stone gateway entrance of the ancient Aztec Sun Temple, huge circular sun dial glyph glowing with warm morning sunlight, deep jungle vines, dust motes",
    2: "closed monolithic stone door with bright red ruby and glowing blue sapphire energy radiating from deep carved crevices, ancient Mayan architecture",
    3: "stone corridor floor revealing glowing emerald jade vine glyphs, green mystical nature energy, jungle foliage, atmospheric haze",
    4: "sanctuary courtyard with ancient stone totems breaking free from heavy dark obsidian seal chains, floating jade particles, warm sunlight",
    5: "mysterious hidden golden treasure room filled with sparkling gems, crystals, gold coins, and warm celestial glow, secret temple vault",
    6: "descending ancient stone staircases with cascading gemstone waterfalls, glowing colorful crystals lining the walls, subterranean cavern",
    7: "ancient stone workshop with mystical alchemy carving table, hovering glowing elemental bombs and crystalline prisms, dramatic lighting",
    8: "sacred ritual chamber with glowing circular elemental altars, colored flame braziers, mystic incantation glyphs carved in granite",
    9: "chamber of trials where massive carved stone totems resonate with intense aura, fiery sparks and electrical currents in temple hall",
    10: "midway sanctuary terrace guarded by a towering Jade Guardian golem awakening, glowing green gem eyes, misty jungle vista outside",
    11: "high open-air balcony overlooking vast tropical rainforest, sapphire wind currents swirling around ancient stone pillars, clear sky",
    12: "giant solar mirror apparatus made of polished gold and crystal, redirecting blinding beams of light across the temple courtyard",
    13: "underground subterranean hall with mystical trail of luminous yellow amber symbols etched into the flagstones, deep shadows",
    14: "heavily fortified double stone gateway bound by thick glowing runic seals, explosive sparks indicating a magical breakthrough",
    15: "sacred celestial treasury chamber overflowing with pure solar crystals, glowing chalices, and golden statues, radiant sunbeams",
    16: "deep underground canal with rushing turquoise waters reflecting vibrant falling gemstones, ancient stone aqueducts, bioluminescence",
    17: "chamber of nova crafting, intense purple and violet nova starburst crystal hovering above an ornate stone pedestal, energy ripples",
    18: "sacred fire altar with blazing crimson ruby flames consuming dark shadow barriers, intense heat haze, embers floating in air",
    19: "grand gatekeeper antechamber adorned with colossal carved guardian statues, tension building before the boss gate, epic atmosphere",
    20: "epic boss arena of the colossal Jade Gatekeeper Golem, massive stone fists infused with emerald magic, crumbling stone pillars, dramatic scale",

    # --- Chapter 2: The Jade Garden (비취 정원, Stages 21-40) ---
    21: "entrance to underground jade rainforest, emerald moss hanging from ancient ceilings, crystal clear river reflecting glowing green flora",
    22: "moss-covered Mayan stone temple with glowing green jade veins running through stone walls, pulsing with ancient earth heartbeat",
    23: "subterranean jungle canopy, gigantic ancient trees with roots wrapping around ruined stone towers, emerald fireflies floating",
    24: "ancient stone bridge over a misty chasm overgrown with bioluminescent vines, glowing green runes on bridge pillars",
    25: "hidden emerald oasis treasure sanctum, subterranean waterfall cascading into crystal turquoise pool filled with floating jade gems",
    26: "sacred botanical greenhouse inside ancient ruins, giant carnivorous glowing flowers, mystical jade pollen floating in rays of light",
    27: "hall of winding roots, massive tree trunks parting to reveal hidden stone corridors, soft green bioluminescence lighting the path",
    28: "ancient stone fountain carved like a roaring serpent, pure emerald water overflowing, surrounded by glowing jade crystals",
    29: "deep cavern filled with giant glowing emerald stalagmites and crystals, stone path carved into rock face, ethereal green atmosphere",
    30: "sunken temple courtyard overtaken by nature, ancient stone thrones wrapped in glowing orchid vines, shafts of green sunlight",
    31: "ruined temple archway surrounded by flying tropical butterflies with iridescent glowing wings, tranquil mystic jungle atmosphere",
    32: "ancient botanical laboratory, glass and stone alembics distilling glowing emerald plant essence, hanging vine lanterns",
    33: "mystical grove inside temple ruins, sacred emerald tree with glowing fruits and leaves, soft green aura illuminating ruins",
    34: "stone pathway flanked by giant stone serpent statues wrapped in glowing green ivy, ancient Mayan stepped pyramid in background",
    35: "secluded jade treasury cave, shimmering emerald geode walls, piles of cut jade ornaments and glowing green crystals",
    36: "underground mangrove labyrinth, glowing root arches reflecting in still mirrored water, ancient stone shrines on water islands",
    37: "temple garden overgrown with giant bioluminescent ferns, spores glowing like floating stars, mysterious mist",
    38: "ancient spiral stone staircase wrapping around a colossal jade column, ascending into misty subterranean sunlight",
    39: "antechamber to the beast lair, ancient claw marks on stone pillars, glowing green eyes peering from jungle shadows",
    40: "grand botanical arena where the Twin Jade Jaguar Guardians roar, radiant emerald energy surging, ancient jungle amphitheater",

    # --- Chapter 3: The Thunder Altar (천둥 제단, Stages 41-60) ---
    41: "wind-swept mountain staircase ascending into stormy dark clouds, sapphire lightning crackling on horizon, ancient cliffside path",
    42: "high altitude temple plateau, towering lightning rod obelisks with blue electrical arcs snapping between them, stormy sky",
    43: "craggy cliffside temple gate surrounded by raging storm winds, sapphire blue crystals embedded in rock face glowing with electricity",
    44: "ancient stone suspension bridge over endless abyss, lashed by blue lightning strikes and tempest winds, dramatic storm clouds",
    45: "eye of the tempest treasure sanctum, peaceful atmospheric dome atop mountain, surrounded by swirling blue lightning walls and sapphire gems",
    46: "thunder forge on mountain ledge, giant anvil struck by recurring blue lightning bolts, sparks showering across stone floor",
    47: "ruined watchtower above the cloud sea, storm clouds roiling below, electric blue aurora dancing across dark sky",
    48: "ancient stone amphitheater with lightning-charged crystal pillars, ground crackling with blue plasma arcs, stormy atmosphere",
    49: "cliffside gallery with carved stone gargoyles and eagle statues, sapphire lightning illuminating wet granite surfaces",
    50: "lightning capacitor chamber inside hollow mountain peak, giant floating sapphire spheres storing crackling electrical power",
    51: "precarious mountain path along razor-thin ridge, howling storm winds, blue electrical currents running along carved stone railings",
    52: "altar of the storm bird, colossal stone condor statue with wings spread, electric blue lightning arcing from its beak",
    53: "ancient battery temple, copper and stone conduits channeling lightning energy into glowing blue sapphire runes",
    54: "storm shattered temple terrace, fractured stone slabs floating on electrostatic repulsion, raging tempest sky",
    55: "storm cloud treasury vault, floating stone platforms inside quiet eye of hurricane, surrounded by glittering sapphire relics",
    56: "high cliff waterfall blown backwards by intense updrafts, water droplets glowing with electric blue sparks, dramatic lighting",
    57: "temple courtyard with massive circular stone dial, lightning strikes striking central needle, energy dispersing into perimeter",
    58: "narrow gorge between two towering cliffs connected by lightning bridges of pure blue plasma, vertigo view",
    59: "approach to the storm peak, thunderous dark clouds swirling into a massive vortex, blue lightning illuminating stone stairs",
    60: "apex summit of the Thunder Mountain, the colossal Storm Titan commanding torrential lightning strikes, shattered rock arena",

    # --- Chapter 4: The Lunar Sanctum (달빛 성소, Stages 61-80) ---
    61: "ethereal temple courtyard bathed in silver moonlight and deep purple nebula glow, floating stone islands, starry cosmic sky",
    62: "lunar mirror lake reflecting giant glowing crescent moon and purple constellations, ancient floating stone pavilions",
    63: "corridor of zero gravity, floating purple amethyst crystal shards and broken stone pillars suspended in purple astral mist",
    64: "amethyst crystal cavern, glowing purple crystals projecting starlight patterns onto ancient carved obsidian walls",
    65: "pocket dimension treasure vault, stopped time hourglasses floating in mid-air surrounded by shimmering purple gemstones and starry void",
    66: "celestial observatory dome, gigantic brass and amethyst astrolabe rotating, projecting glowing purple stellar charts into space",
    67: "bridge of solid starlight spanning between two floating temple ruins, deep indigo and violet cosmic nebulae in background",
    68: "moon totem sanctuary, carved stone totems crowned with glowing purple crescents, psychic ripples distorting air",
    69: "amethyst lotus pond inside ancient courtyard, glowing purple water lilies floating on still nocturnal waters",
    70: "floating stone labyrinth in the astral realm, glowing purple rune pathways guiding through cosmic darkness",
    71: "hall of lunar echoes, ancient obsidian mirrors reflecting otherworldly purple silhouettes, mysterious starry atmosphere",
    72: "high temple balcony overlooking celestial eclipse, dark moon crowned in shimmering purple corona, starry cosmos",
    73: "sacred crystal library, towering bookshelves made of dark stone with glowing purple scrolls and hovering crystal tomes",
    74: "sanctum of astral weavers, glowing purple magical threads connecting floating star crystals in geometric constellations",
    75: "celestial moon vault, floating altar holding pure lunar tear crystals, serene purple glow, glittering diamond dust",
    76: "ancient planetarium chamber with miniature glowing planets orbiting in purple holographic rings, deep shadows",
    77: "translucent stone staircase ascending towards a giant glowing purple moon portal, cosmic dust swirling around",
    78: "shrine of the moon shadow, purple ethereal flames burning in stone basins without smoke, casting shimmering violet light",
    79: "antechamber to the astral throne, reality bending into geometric purple fractals, cosmic silence, dramatic tension",
    80: "transcendent astral throne room, the Moon Shadow High Priest weaving swirling purple illusion barriers, cosmic nebulae background",

    # --- Chapter 5: The Golden Heart (황금 심장부, Stages 81-100) ---
    81: "grand entrance to the Imperial Golden City Montezuma, towering walls of polished solid gold gleaming in blazing sunlight",
    82: "golden palace promenade lined with solid gold obelisks and crimson ruby banners, blinding golden reflections",
    83: "avenue of golden serpents, colossal golden feathered serpent statues flanking wide stone causeway, glittering golden dust",
    84: "sacred reservoir of liquid gold, reflective golden pools with floating lotus ornaments made of diamonds and rubies",
    85: "mythical emperor imperial treasury room, mountain of pure gold artifacts, giant sparkling diamonds and ruby crowns",
    86: "hall of golden masks, walls adorned with thousands of intricately carved golden funerary masks with glowing gemstone eyes",
    87: "imperial solar forge, rivers of molten gold flowing through stone channels, golden statues being cast in divine sunbeams",
    88: "grand golden stepped pyramid bathed in midday zenith sunlight, golden steps ascending into blinding celestial light",
    89: "golden terrace overlooking the sprawling mythical Aztec golden metropolis, golden spires stretching to horizon under golden sky",
    90: "sanctuary of the six unified totems, six colossal golden totems arranged in a circle, glowing with harmonic rainbow elemental light",
    91: "imperial throne hall of solid gold, massive golden sun disc hanging above ornate throne inlaid with rubies and sapphires",
    92: "vault of the sun king, solid gold vault doors carved with intricate Mayan calendar glyphs glowing with white-hot solar heat",
    93: "celestial corridor of gold, golden pillars carved like kneeling priests holding glowing golden crystal orbs",
    94: "chamber of solar resonance, golden bells and chimes vibrating with warm divine hum, golden dust motes swirling in light beams",
    95: "inner imperial treasury vault, sacred golden chest overflowing with legendary relics, diamonds, rubies, and pure solar gems",
    96: "golden bridge of the sun gods spanning across molten gold abyss, golden eagle statues perched along railings",
    97: "temple of solar apotheosis, columns of pure golden light piercing through ceiling dome onto golden mosaic floor",
    98: "antechamber to the Golden Heart, massive golden gears and celestial mechanisms turning, radiating intense golden warmth",
    99: "sacred inner sanctum before the heart, blinding golden aura illuminating colossal guardian statues kneeling in reverence",
    100: "grand climax, legendary Golden Heart of Montezuma awakening in a blinding vortex of pure solar divinity, godlike golden radiance, swirling golden energy, eternal Aztec legend, masterpiece"
}

def queue_prompt(prompt_text, level):
    graph = json.loads(json.dumps(GRAPH_TEMPLATE))
    seed = 1000 + level * 23
    graph["3"]["inputs"]["seed"] = seed
    graph["6"]["inputs"]["text"] = f"Masterpiece cinematic digital concept art, ancient Aztec Mayan fantasy adventure, {prompt_text}, dramatic volumetric lighting, ultra detailed textures, rich atmosphere, 8k wallpaper"
    graph["60"]["inputs"]["filename_prefix"] = f"SolarRelic/stage_{level}"

    payload = json.dumps({"prompt": graph}).encode('utf-8')
    req = urllib.request.Request(f"{SERVER_URL}/prompt", data=payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=30) as res:
        data = json.loads(res.read().decode('utf-8'))
        return data.get('prompt_id')

def wait_for_image(prompt_id, timeout=120):
    start = time.time()
    while time.time() - start < timeout:
        time.sleep(1.0)
        req = urllib.request.Request(f"{SERVER_URL}/history/{prompt_id}")
        try:
            with urllib.request.urlopen(req, timeout=10) as res:
                history = json.loads(res.read().decode('utf-8'))
                if prompt_id in history:
                    outputs = history[prompt_id].get('outputs', {})
                    if "60" in outputs and "images" in outputs["60"]:
                        img_info = outputs["60"]["images"][0]
                        return img_info["filename"], img_info.get("subfolder", ""), img_info.get("type", "output")
        except Exception:
            pass
    return None

def download_and_convert(filename, subfolder, img_type, level):
    params = f"filename={urllib.parse.quote(filename)}&subfolder={urllib.parse.quote(subfolder)}&type={urllib.parse.quote(img_type)}"
    url = f"{SERVER_URL}/view?{params}"
    
    with urllib.request.urlopen(url, timeout=30) as res:
        img_bytes = res.read()
    
    # Save optimized JPG
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    out_path = os.path.join(OUT_DIR, f"stage_{level}.jpg")
    img.save(out_path, format="JPEG", quality=88, optimize=True)
    return out_path, len(img_bytes), os.path.getsize(out_path)

def generate_stage(level):
    out_path = os.path.join(OUT_DIR, f"stage_{level}.jpg")
    if os.path.exists(out_path) and os.path.getsize(out_path) > 30000:
        print(f"[{level}/100] [SKIP] Stage {level} already exists ({os.path.getsize(out_path)//1024} KB)", flush=True)
        return True

    prompt_text = STAGE_DESCRIPTIONS.get(level, f"ancient Aztec temple chamber {level}, glowing relics, mystical lighting")
    print(f"[{level}/100] [QUEUE] Stage {level}: {prompt_text[:60]}...", flush=True)
    t0 = time.time()
    
    pid = queue_prompt(prompt_text, level)
    if not pid:
        print(f"[{level}/100] [ERROR] Failed to queue prompt for Stage {level}", flush=True)
        return False
        
    result = wait_for_image(pid)
    if not result:
        print(f"[{level}/100] [ERROR] Timeout waiting for image for Stage {level}", flush=True)
        return False
        
    fn, sub, t = result
    saved_file, raw_sz, jpg_sz = download_and_convert(fn, sub, t, level)
    duration = time.time() - t0
    print(f"[{level}/100] [DONE] Stage {level} generated in {duration:.1f}s -> {jpg_sz//1024} KB", flush=True)
    return True

if __name__ == '__main__':
    target = None
    if len(sys.argv) > 1:
        target = int(sys.argv[1])
    
    if target:
        generate_stage(target)
    else:
        print(f"Starting batch generation for stages 1 to 100 on ComfyUI ({SERVER_URL})...", flush=True)
        start_all = time.time()
        success_count = 0
        for lvl in range(1, 101):
            success = False
            for retry in range(3):
                try:
                    if generate_stage(lvl):
                        success = True
                        success_count += 1
                        break
                except Exception as e:
                    print(f"[{lvl}/100] [RETRY {retry+1}] Stage {lvl} error: {e}", flush=True)
                    time.sleep(2.0)
            if not success:
                print(f"[{lvl}/100] [FATAL] Failed Stage {lvl} after 3 retries!", flush=True)
        total_time = time.time() - start_all
        print(f"\n=======================================================", flush=True)
        print(f"🎉 All {success_count}/100 stages generated in {total_time/60:.1f} minutes!", flush=True)
        print(f"Assets located in: {OUT_DIR}", flush=True)
        print(f"=======================================================", flush=True)
