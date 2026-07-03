# Composition — Stadium Spectator（2026-07-03）

> 蓝橙赛事 / 黑底深 V / 高马尾 / 远景飞驰
> 原始 prompt 的最终落地版

## 模块拼装

| 模块 | 代号 | 来自 |
|------|------|------|
| base | `BASE-CORE` | `modules/01-portrait-base.md` |
| outfit | `OUTFIT-A` Black Halter | `modules/02-outfits.md` |
| hair | `HAIR-A` High Ponytail | `modules/03-hair-styles.md` |
| environment | `ENV-A` Stadium Spectator | `modules/04-environments.md` |

## 拼装后完整 prompt

```
Strikingly beautiful face in three-quarter profile — refined East Asian features, high defined cheekbones, sharp jawline, large bright eyes, full soft lips slightly parted. Natural skin with realistic texture — soft visible pores, faint peach fuzz on her cheek catching light, translucent matte complexion, not airbrushed. Naturally feminine figure — naturally full shapely bust, slim defined waist, gentle curve of her back visible from this angle. She wears a sleek fitted deep-V halter-neck top in all-black matte stretch fabric, the halter straps revealing her bare back and shoulders, paired with high-waisted wide-leg black trousers. Tinted sunglasses pushed up on her head, small gold ear studs. Long black hair in a loose high ponytail swept to one side. Genuinely caught in the moment — both hands gripping a railing as she leans toward the action, weight shifted forward, completely absorbed, unaware of the camera behind her. Not posing, not looking at the lens. Strong 85mm portrait telephoto compression — soft blurred foreground under her hands. Behind her, a distant out-of-focus background with bold fictional blue and orange colors, something fast moving streaking past — she is watching it. Bright afternoon sunlight, sharp clean exposure. Clean photographic capture — crisp color grading, sharp on the eyes, no artifacts.
```

字符：~1320 ✓ < 1500

## 生成记录

- 时间：2026-07-03 07:27
- 模型：MiniMax image-01
- 比例：9:16
- 结果：人物到位、远景氛围缺失（AI 把"赛事紧张感"理解成静谧蓝橙渐变）
- 改进：本图后被替换为 ENV-B 私域场景（见 `morning-kitchen.md`）