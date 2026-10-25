# 추가 전투 이미지

두 이미지 모두 Codex 내장 image_gen으로 만들고 WebP로 압축했다. 원본 사원 토템/몬스터 아틀라스를 스타일 참고로 사용했다.

| 파일 | 용도 |
|---|---|
| `dist/assets/realm-totems.webp` | 물·대지·바람 토템, 가로 3칸 |
| `dist/assets/slime-poses.webp` | 왼쪽을 향하는 슬라임 대기·공격·방어·그로기, 가로 4칸 |

## 토템 프롬프트

> Use case: stylized-concept. Asset type: a NEW three-icon sprite atlas for the fantasy mobile game Solar Relic, matching the supplied existing six-totem atlas as the exact visual style reference. Produce one horizontal row of exactly three equally sized, fully separate frontal carved stone guardian-mask icons, evenly centered in three square cells. Left: WATER totem, a turquoise river turtle guardian with flowing water crests and an aqua gemstone. Middle: EARTH totem, a horned mountain bison guardian of dark basalt and ochre stone with amber gemstone and restrained moss. Right: WIND totem, a pale silver fox guardian with swept feather-like wind crests and mint gemstone. Match the reference's rich sculpted 3D stone, crisp gold inlay, luminous gemstone eyes, strong silhouette, ornament density, polished high-end fantasy game asset finish. Each icon must remain readable at 32 pixels. All three have consistent scale, lighting, and camera, front facing and symmetrically framed. Transparent background and generous transparent gaps between icons. No text, no letters, no labels, no border, no UI, no extra faces, no fourth icon. Do not reproduce or alter the original six icons; create only these three new guardians.

## 슬라임 프롬프트

> Use case: stylized-concept. Asset type: a 4-frame transparent sprite atlas for a premium fantasy mobile puzzle battle game. Use the supplied monster atlas ONLY as quality, material and turquoise-slime character reference. Create exactly FOUR equal square cells in one horizontal row, each showing the SAME small turquoise translucent blue slime creature in full-body three-quarter SIDE PROFILE unmistakably facing LEFT, toward a wizard placed on the left side of the game screen. Frame 1 idle: leaning and looking LEFT with alert eyes. Frame 2 attack: lunging LEFT with gel splash and droplets projected LEFT. Frame 3 guard: facing LEFT behind a compact crystalline water shield. Frame 4 groggy: drooped body, dazed eyes, wobbling but still oriented LEFT. Preserve recognizable bright aqua luminous gel and friendly but hostile battle expression, glossy refractive highlights, crisp silhouette, game-ready painterly 3D concept art comparable to the reference. Consistent scale, identical camera, centered and separated in each cell, no environment, genuinely transparent background, no checkerboard pattern, no captions or labels, no extra creatures, no fifth frame.

## 이세계 장비와 스크롤

내장 image_gen으로 생성한 그림을 WebP로 압축했다. 투명 종이인형 장비 24장은 `scripts/generate-gear-overlays.mjs`에서 SVG로 만들었다.

| 파일 | 용도 |
|---|---|
| `dist/assets/realm-gear-atlas.webp` | 6부위 × 4등급 상점 장비 그림 |
| `dist/assets/realm-scroll-atlas.webp` | 8종 연계 스크롤과 전투 발동 그림 |
| `dist/assets/gear/*.svg` | 장착한 장비를 마법사 위에 겹치는 투명 그림 |

### 장비 그림 프롬프트

> Use case: stylized-concept. Asset type: premium mobile fantasy game inventory sprite atlas, 6 columns by 4 rows, each cell one distinct equippable gear icon. Exact layout: columns are staffs, robes, rings, amulets, boots, grimoires; rows progress from forest/bronze tier to sapphire, volcanic gold, and celestial eclipse tier. Every item centered within its equal square cell, consistent size and camera, generous padding, clean separation, no overlap, no text, no numbers, no UI borders. Ornate painterly 3D game item art matching a high quality fantasy match-3 RPG: carved metal, embroidered fabric, faceted gems, dramatic rim lighting, rich material detail, legible at 56 px. Dark uniform deep teal background in every cell. Wide atlas aspect ratio 3:2. Important: exactly 6 columns and 4 rows, no humans, no monsters, no labels.

### 연계 스크롤 그림 프롬프트

> Use case: stylized-concept. Asset type: spell scroll illustration atlas for a premium fantasy mobile RPG match-3 game. Exactly 4 columns by 2 rows, 8 equal rectangular cells, each with one ornate unfurled scroll and a dominant glowing elemental painting bursting above its parchment; no lettering, no words, no numbers. Cell order left-to-right: 1 water braided with lightning, 2 wind freezing water into blue crystal ice, 3 earth and fire fused as lava, 4 jade vines and golden sunlight healing; second row: 5 moon and time eclipse, 6 fire fed by wind as a phoenix inferno, 7 earth and water as emerald marsh roots, 8 clockwork time and lightning as violet storm. Consistent illustration scale and illumination. Rich painterly 3D game art, intricate illuminated manuscript trim, gem inlay, excellent 64 px readability. Uniform dark deep teal background, crisp separation between cells, each scroll centered with padding. Wide 2:1 atlas, no humans, no interface elements.
