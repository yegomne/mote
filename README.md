# 태양의 유산 · SOLAR RELIC

모바일 웹에서 즐기는 독자적인 고대 사원 매치3 게임.

2026-10-23 업데이트: 3연속부터 1.5배 토템, 묵직한 투사체·폭발·파편·굵은 번개, 배경음악과 새로운 오디오 엔진, 목표 유형 10종으로 100개 스테이지 개편. [전체 레벨 설계](LEVEL_DESIGN.md)

| 기능 | 구현 |
|---|---|
| 자동 초능력 | 같은 색의 직접 매치 2번째부터 매번 토템 자동 발동. 3번째부터 위력 1.5배(매번 고정, 누적 곱셈 아님). 다른 색은 초기화. 자동 낙하 연쇄는 색상 연속에 포함하지 않음 |
| 토템 성장 | 색상별 6종, Lv.1~5, 클리어 마법별로 강화 |
| 진행 | 100개 스테이지, 사원 5곳 × 20단계, 목표 증가, 순차 해금 |
| 보상 | 각 단계 최고 별점 개선분만 지급. 중복 보상 방지 |
| 특수 보석 | 4매치 번개, 5매치 노바, T/L자 폭탄, 연쇄 반응 |
| 연출 | 보석 굴절 면, 입자, 번개, 충격파, 피버 3배, 소리, 진동, 효과 줄이기 |
| 저장 | 같은 브라우저의 진행·토템 레벨·마법별·최고 기록 자동 저장 |
| 모바일 | 스와이프 / 두 번 터치, 플레이 중 간결한 화면 |

토템 해금: 불·번개 1단계, 시간 2단계, 수확 4단계, 선물 7단계, 황금 10단계.
강화 비용: 2 / 4 / 6 / 8 마법별. 최대 Lv.5.
시간 없는 휴식 모드에서도 진행 가능. 업그레이드 기록은 기기·브라우저별 저장이며 계정 간 동기화는 없다.

## 실행 및 검증

`node preview.mjs` → http://127.0.0.1:5173

`node test-engine.mjs` : 590건 검사, 3,000회 모의 교환, 연쇄·낙하·특수 보석·토템 연속 규칙·별 보상·100단계 목표 검사.

실제 브라우저에서 루비 1회 → 2회 자동 불 토템 → 3회 재발동 → 다른 색 초기화, 단계 클리어, 마법별 지급, Lv.2 강화, 새로고침 후 성장 저장을 확인했다. 390×844 화면 레이아웃 확인. 실물 휴대폰의 진동과 성능은 별도 확인 필요.

## 조사 참고

- [몬테주마 3 공식 Steam 소개](https://store.steampowered.com/app/320690/The_Treasures_of_Montezuma_3/)
- [몬테주마 3 공식 App Store 소개](https://apps.apple.com/us/app/the-treasures-of-montezuma-3/id475298522): 토템, 마법별 업그레이드, 다수 스테이지
- [게임 규칙 참고](https://www.mobygames.com/game/54743/the-treasures-of-montezuma-3/): 같은 색 두 번 연속, 별로 능력 강화
- [몬테주마 5 공식 소개](https://store.steampowered.com/app/443370/The_Treasures_of_Montezuma_5/)

원작 자산을 사용하지 않고 독자적인 배경, 보석, 토템, 명칭과 밸런스로 제작했다. 최신 상용작보다 그래픽이 우수하다는 객관적 비교 검증은 하지 않았다.

## 생성 이미지와 프롬프트

기본 내장 image_gen 도구로 제작. 외부 API 키 사용 없음.

- 배경: `D:/51. 몬테주마/solar-relic/dist/assets/temple.png`
- 토템 아틀라스: `D:/51. 몬테주마/solar-relic/dist/assets/totems.png`

배경 프롬프트: “Widescreen premium mobile puzzle game environment, cinematic 3D ancient Mesoamerican sun temple at blue hour, huge carved golden sun disk above stepped pyramid, turquoise waterfalls, teal mist, jungle silhouettes, basalt jaguar statues with gold inlays, golden embers, realistic materials, volumetric light, quiet dark lower center for game UI, no text or interface.”

토템 프롬프트: “Six premium 3D Mesoamerican carved stone mask bust icons, regular 3×2 sprite atlas. Top row jade jaguar, ruby fire demon, sapphire thunder eagle. Bottom row golden solar king, amethyst moon priest, amber time serpent. Front-facing basalt masks, luminous gemstone eyes, gold trim, magical auras, consistent camera and size, no text, transparent background requested.”

배포 설정과 Site ID는 `.openai/hosting.json`에 저장한다.

## 사운드 v3

외부 음원 없이 Web Audio로 만든 독자적인 사원 음악, 박자에 맞춘 저음 타악기·패드·멜로디, 보석 파열음, 초능력별 음색, 3연속 각성 사운드, 스테레오 이동, 컨볼루션 잔향을 사용한다.

전체·효과음·음악 음량 별도 저장. 기본 86% / 92% / 32%. 첫 터치나 키 입력으로 재생을 시작하며 브라우저 자동 재생 정책을 따른다. 마스터 컴프레서와 리미터로 겹치는 소리를 조절한다. 효과 줄이기 설정과 음소거를 보존한다.

`node test-audio.mjs`: 여섯 토템, 각성, 음악 스케줄링, 음소거·음량 그래프를 검증했다. 모의 그래프에서 478개 음성 이벤트 실행. 실제 브라우저에서 미리듣기·게임 재생 시 오류 없음. 상업 출시 품질을 인증한 것은 아니며 기기별 청감·지연·장시간 밸런스 평가는 필요하다.

효과 수량처럼 정수만 가능한 항목은 1.5배 계산 후 올림한다. 보석 파괴 범위는 원래 유효 타일 수의 1.5배로 확장하되 전체 보드 64칸을 넘지 않는다.
