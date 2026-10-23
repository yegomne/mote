import sys
import json
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

# Generate 100 distinct rich storyline paragraphs
scenarios_100 = []

chapters_info = [
    ("제1장 태양의 문", "THE GATE OF THE SUN", "태양 사원의 거대한 외곽 관문"),
    ("제2장 비취의 정원", "THE JADE GARDEN", "생명의 고동이 맥동하는 지하 밀림 성소"),
    ("제3장 번개의 제단", "THE THUNDER ALTAR", "절벽 위 폭풍과 벼락이 요동치는 천둥 신전"),
    ("제4장 달의 성소", "THE LUNAR SANCTUM", "시공간이 일렁이는 보랏빛 차원 회랑"),
    ("제5장 황금의 심장", "THE GOLDEN HEART", "전설적인 몬테주마의 황금 심장부")
]

stage_names = [
    '새벽의 보석', '수호자의 응답', '색상의 제례', '잠든 봉인', '고요한 보물방',
    '연쇄의 계단', '별의 공방', '잃어버린 의식', '토템의 시험', '사원의 수호자'
]

story_templates = [
    # Ch 1 (1-20)
    "태양 사원의 거대한 석문 앞에 도착했습니다. 먼지 쌓인 석판에 새겨진 고대 보석들이 당신의 손길에 은은한 첫 번째 빛을 뿜어냅니다.",
    "닫힌 석문 틈새로 붉고 푸른 기운이 새어나옵니다. 같은 색의 보석을 연속으로 맞추어 고대 수호 토템의 영혼을 깨우세요.",
    "사원 회랑 바닥에 비취빛 넝쿨 문양이 드러납니다. 녹색 비취 보석을 모아 대지의 맥박을 이어가세요.",
    "첫 번째 관문인 비취 토템의 봉인이 풀렸습니다! 석판 주위에 얽힌 견고한 봉인석들을 깨뜨려 전진하세요.",
    "사원의 숨겨진 보물방이 모습을 드러냈습니다! 시간이 흐르기 전에 쏟아지는 보석과 수정을 최대한 거두세요.",
    "계단 아래로 이어지는 통로에서 보석들이 공명합니다. 아래쪽에서 연속 매치를 설계하여 깊은 연쇄를 유도하세요.",
    "벽화에 보석을 조합하는 비전이 새겨져 있습니다. 4개 이상의 보석을 정렬하여 강력한 힘을 품은 특수 보석을 빚어내세요.",
    "고대 사제들이 거행하던 색상의 제례터입니다. 지정된 색상의 보석을 바치고 바닥의 결계를 정화하세요.",
    "수호 토템들이 더 강한 공명을 요구합니다. 3연속 같은 색 매치로 1.5배 각성의 위력을 증명하세요.",
    "회랑의 중간을 지키는 비취 수호 석상이 눈을 떴습니다! 강력한 연쇄로 수호 석상을 제압하고 나아가세요.",
    "사원의 외벽 테라스에 도달했습니다. 시원한 정글 바람 사이로 푸른 사파이어 보석들이 반짝입니다.",
    "햇살을 굴절시키는 태양 거울 장치입니다. 연속된 매치로 거울의 각도를 맞추어 문을 여세요.",
    "고대 탐험가들이 남긴 표식이 바닥에 새겨져 있습니다. 목표 색상의 보석을 찾아 길을 밝히세요.",
    "더욱 단단해진 이중 봉인이 계단을 막고 있습니다. 특수 폭탄석을 제조하여 단숨에 돌파하세요.",
    "태양신의 두 번째 비밀 수장고가 열렸습니다! 짧은 시간 동안 제한 없이 보물과 수정을 거두세요.",
    "지하 수로로 이어지는 틈새에서 보석들이 빠르게 낙하합니다. 쏟아지는 연쇄의 리듬을 타세요.",
    "사제들의 비전이 깃든 노바 문양이 빛납니다. 5개 연결로 궁극의 전방위 정화석을 창조하세요.",
    "신성한 화염이 피어오르는 제례터입니다. 불의 토템을 깨워 굳게 닫힌 차단막을 태우세요.",
    "수문장의 방 문턱에 도착했습니다. 모든 토템 기술과 집중력을 모아 최후의 도전을 준비하세요.",
    "제1장 최후의 관문! [비취의 수문장]이 길을 막아섭니다. 모든 토템과 봉인을 격파하고 사원의 중심 문을 여세요!"
]

# Ch 2 templates (21-40)
for k in range(21, 41):
    local = k - 20
    if local == 20:
        txt = "제2장 최후의 관문! 정글의 쌍둥이 수호자가 포효합니다. 맹렬한 연쇄와 토템으로 수호자를 굴복시키세요!"
    elif local == 5 or local == 15:
        txt = f"비취 정원의 숨겨진 보물방(관문 {k})이 열렸습니다! 60초 동안 쏟아지는 에메랄드 수정을 가득 담으세요."
    elif local % 2 == 1:
        txt = f"안개 자욱한 지하 정글 성소의 {local}번째 방입니다. 에메랄드빛 폭포와 덩굴 결계를 뚫고 전진하세요."
    else:
        txt = f"고대 비취 여신의 맥박이 보석판을 감쌉니다. {local}번째 시련의 봉인을 특수 보석과 토템으로 분쇄하세요."
    story_templates.append(txt)

# Ch 3 templates (41-60)
for k in range(41, 61):
    local = k - 40
    if local == 20:
        txt = "제3장 최후의 관문! 하늘의 지배자 [폭풍의 거인]이 벼락을 내리꽂습니다. 최강의 번개로 거인을 제압하세요!"
    elif local == 5 or local == 15:
        txt = f"폭풍우의 눈 한가운데 위치한 보물방(관문 {k})입니다! 벼락이 치는 틈을 타 신속하게 수정들을 수확하세요."
    elif local % 2 == 1:
        txt = f"절벽 꼭대기에 자리한 천둥 제단의 {local}번째 시련입니다. 번개의 궤적을 따라 보석들을 관통하세요."
    else:
        txt = f"먹구름 사이로 푸른 벼락이 전율을 일으킵니다. {local}번째 전격 결계를 삼중 봉인과 함께 정화하세요."
    story_templates.append(txt)

# Ch 4 templates (61-80)
for k in range(61, 81):
    local = k - 60
    if local == 20:
        txt = "제4장 최후의 관문! 차원의 지배자 [달그림자 사제]가 환영의 장벽을 펼칩니다. 진실의 빛으로 결계를 깨뜨리세요!"
    elif local == 5 or local == 15:
        txt = f"달의 신비가 깃든 시공간 정지 보물방(관문 {k})입니다! 귀중한 보랏빛 수정을 한가득 모으세요."
    elif local % 2 == 1:
        txt = f"달빛만이 스며드는 신비로운 보랏빛 회랑 {local}번째 방입니다. 왜곡된 차원의 흐름을 정돈하세요."
    else:
        txt = f"달의 호수 수면에 비친 별빛이 요동칩니다. {local}번째 차원의 룬 봉인을 토템의 파동으로 걷어내세요."
    story_templates.append(txt)

# Ch 5 templates (81-100)
for k in range(81, 101):
    local = k - 80
    if local == 20:
        txt = "운명의 최종장! [황금 태양의 심장 몬테주마]의 진정한 각성! 100번째 관문을 돌파하고 고대 제국의 영원한 전설이 되십시오!"
    elif local == 5 or local == 15:
        txt = f"황금 제국의 전설적인 황실 보물창고(관문 {k})가 열렸습니다! 끝없이 쏟아지는 수정을 담으세요."
    elif local % 2 == 1:
        txt = f"마침내 몬테주마의 황금 심장부 {local}번째 방에 진입했습니다. 태양의 각성을 일으켜 황금 제례를 완수하세요."
    else:
        txt = f"황금으로 주조된 불멸의 수호 봉인석들입니다. {local}번째 방의 모든 봉인을 6대 토템의 힘으로 격파하세요."
    story_templates.append(txt)

# Format for engine.mjs
scenarios_js = "export const STAGE_SCENARIOS_100 = [\n"
for i, story in enumerate(story_templates):
    clean = story.replace("'", "\\'")
    scenarios_js += f"  '{clean}',\n"
scenarios_js += "];\n"

# Update engine.mjs
engine_path = 'dist/engine.mjs'
with open(engine_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace stageScenario function with 100-stage lookup
pattern = re.compile(r'export function stageScenario\(level\)\{.*?return \{chapterIndex:ci,chapterTitle,chapterSub,localStage:local,title:`제\$\{ci\+1\}장 \$\{chapterTitle\} · 관문 \$\{local\}`,story,isBoss:local===20,isBonus:\(local%10===5\)\};\s*\}', re.DOTALL)

replacement = f"""{scenarios_js}
export function stageScenario(level){{
  const ci = chapterIndex(level);
  const local = (level - 1) % 20 + 1;
  const chapterTitle = chapters[ci][0];
  const chapterSub = chapters[ci][1];
  const story = STAGE_SCENARIOS_100[level - 1] || `${{chapterTitle}}의 제${{local}}관문입니다. 고대 사원의 시련을 통과하여 다음 방으로 전진하세요.`;
  const image = `assets/stages/stage_${{level}}.jpg`;
  return {{
    chapterIndex: ci,
    chapterTitle,
    chapterSub,
    localStage: local,
    title: `제${{ci + 1}}장 ${{chapterTitle}} · 제${{local}}관문`,
    story,
    image,
    isBoss: local === 20,
    isBonus: (local % 10 === 5)
  }};
}}"""

new_content = pattern.sub(replacement, content)
with open(engine_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Successfully injected 100 unique stage scenarios and image mappings into {engine_path}!")
