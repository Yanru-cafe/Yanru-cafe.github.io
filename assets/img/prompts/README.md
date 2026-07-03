# 燕如 · 提示词模块库

> 高质量人像 / 场景合成 prompt 模板 · 模块化拆分 · 自由拼接

## 设计

把"做一张高质量图"拆成 **4 个独立模块**，按需替换：

| 模块 | 文件 | 解决什么 |
|------|------|----------|
| **base**（人像基底） | `modules/01-portrait-base.md` | 脸 / 皮肤 / 身材 / 摄影技术 — 通用不变核心 |
| **outfits**（服装） | `modules/02-outfits.md` | 黑底深 V / 围裙棉布 / …… 多种选择 |
| **hair**（发型） | `modules/03-hair-styles.md` | 高马尾 / 低髻 / 长直发 / 卷发 …… |
| **environments**（场景） | `modules/04-environments.md` | 赛事观众 / 厨房晨光 / 雨夜窗边 …… |

每张成品图都是一个 **composition**：在 `compositions/` 目录下，注明它由哪几个模块的哪几条拼接而成。

## 用法（最简）

1. **照搬 base**：把 `01-portrait-base.md` 整段作为主体永远不变
2. **挑 outfit**：从 `02-outfits.md` 选一段（每段前有 `OUTFIT-A1` 这样的代号）
3. **挑 hair**：从 `03-hair-styles.md` 选一段
4. **挑 environment**：从 `04-environments.md` 选一段
5. **拼接**：base → outfit → hair → environment，合并成一段 prompt
6. **API 限制**：合并后总长 < 1500 字符（MiniMax image-01）

成品 prompt 长度控制技巧：删冗词、`—` 替代长从句、用动词短句串场景。

## 当前已拼装示例

- `compositions/2026-07-03-stadium-spectator.md` — 蓝橙赛事 / 黑底深 V / 高马尾
- `compositions/2026-07-03-morning-kitchen.md` — 早晨厨房 / 米白围裙 / 低髻

## 风格守则（base 模块内）

- 永远要求 `not posing, not looking at the lens`（防止 AI 摆拍）
- 永远要求 `telephoto compression`（防止画面太广）
- 永远要求 `no airbrushed, no plastic skin`（防止 AI 脸）
- 永远要求 `negative: AI look, CGI, deformed hands, garbled text`（兜底负面）

## 命名

- modules：`NN-<类型>.md`，顺序即拼接顺序
- compositions：`YYYY-MM-DD-<主题>.md`，主题名短横线分隔
- 文件名里的代号（如 `OUTFIT-A1`）保持稳定，引用时一字不差

---

*起始 2026-07-03 · 由燕如 🐾 维护*