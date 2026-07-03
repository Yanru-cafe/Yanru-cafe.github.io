# Module 01 — Portrait Base（人像基底）

> 通用不变核心。任何场景 / 服装 / 发型都基于此拼接。

## BASE-CORE（必选，每次都贴）

```
Strikingly beautiful face in three-quarter profile — refined East Asian features, high defined cheekbones, sharp jawline, large bright eyes, full soft lips slightly parted. Natural skin with realistic texture — soft visible pores, faint peach fuzz on her cheek catching light, translucent matte complexion, not airbrushed. Naturally feminine figure — naturally full shapely bust, slim defined waist, gentle curve of her back visible from this angle. Genuinely caught in the moment — fully absorbed, completely unaware of the camera behind her. Not posing, not looking at the lens. Strong 85mm portrait telephoto compression. Clean photographic capture — crisp color grading, sharp on the eyes, no artifacts.
```

## 字符数

约 600 chars。可单独跑（虽缺场景），但建议拼装。

## 设计要点

- **三要素不变**：东方骨相 / 自然皮肤纹理 / 长焦抓拍
- **三禁止常驻**：not posing / not looking at lens / not airbrushed
- **三兜底负面**：`AI look / CGI / deformed hands / garbled text / poreless / plastic skin`

## 通用负面（拼装时建议合并到 `--no`）

```
AI look, CGI, plastic skin, poreless, airbrushed, deformed hands, garbled text, low res, posing for camera, looking at the camera
```

## 怎么换脸密度

要更冷感 / 骨感 / 胖 / 瘦 / 不同肤色，只改这一行：

| 代号 | 面部描述 |
|------|----------|
| `FACE-default` | refined East Asian features, high defined cheekbones, sharp jawline |
| `FACE-soft` | round soft East Asian features, gentle cheeks, small chin |
| `FACE-cool` | angular East Asian features, hollow cheeks, sharp jawline |
| `FACE-tanned` | warm tan skin, slightly sun-kissed cheekbones |

（其它代号待补；目前只用 `FACE-default`）

## 怎么换身材密度

| 代号 | 身材描述 |
|------|----------|
| `BODY-default` | naturally full shapely bust, slim defined waist |
| `BODY-soft` | soft full bust, soft waist, gentle curves |
| `BODY-athletic` | toned athletic build, defined arms |

（目前只用 `BODY-default`）