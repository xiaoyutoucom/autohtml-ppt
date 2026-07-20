# 通用版式与演示 chrome（可复用）

配合 [SKILL.md](SKILL.md)。权威源码：`docs/deck/`；演示产物：`docs/harness_training.html`。  
思路借鉴 `E:\wence\autoppt\bolt-slides`（Contrast / Comparison / Steps / BigNumber / Split、缩略图轨、网格、画笔），但保持 **单文件 HTML + 离线 vendor**，勿混改 React 引擎。

**微交互（公共 CSS/JS，写作时套 class 即可）**

- 文本框 / 图片框：用 `.card`·`.panel`·`.tile` 与 `figure.story-fig` / `.media-fig` / `.hero-fig` → 自带悬浮放大（见 [reference.md](reference.md)「悬浮放大」）。
- 大表逐行点亮：`table.fw-table` + 需要时 `data-row-pulse="1"`（Stage / 实践框架已自动开）。

---

## 演示 chrome（快捷键）

| 键 / 底栏 | 行为 |
|-----------|------|
| `S` / 「目录」 | 左侧缩略图轨（标题列表，点击跳转） |
| `G` / 「总览」 | 全屏网格总览 |
| `A` / 「画笔」 | 画笔批注（笔 / 荧光笔 / 橡皮 · 色板 · 撤销 · 清空） |
| `Esc` | 关闭轨 / 总览 / 画笔 |
| 导出 PPT | 自动隐藏轨 / 总览 / 画笔层 |

**实现要点**

- 缩略图：克隆对应 `.slide` 到 `.slide-thumb-frame`，按视口 `transform: scale` 成 16:9 预览（打开 S/G 时分批填充）；视频用占位块；`data-index` 跳转 `goTo(i)`。
- 画笔坐标用视口归一化 `0..1` 存 `annStore[slideIndex]`，翻页重绘；导出时忽略 `.annotate-layer`。
- 画笔开启时禁用「点左右区翻页」与空格翻页，避免误触。

---

## 版式 class（写作优先套这些）

| class | 用途 | 何时用 |
|-------|------|--------|
| `.layout-bignumber` | 巨大数字 + 说明 + foot | 开场定调、关键 KPI |
| `.layout-contrast` | Before / After 双栏（× / ✓） | 痛点 → 方案 |
| `.layout-steps` | 水平步骤（`--n` 列数） | 流程 3～5 步 |
| `.layout-split` | 左文右媒体（`.flip` 对调） | 一边结论一边结构图 |
| `.layout-comparison` | 对照表（`.hl` 高亮列，`.yes`/`.no`） | 我们 vs 旧法 |
| `.layout-hero` | 中心大图 + chips + take | 隐喻图、嵌套关系图 |
| `.layout-media-top` | 上图下文网格 | 示意宽图 + 要点条 |
| `.layout-icon-row` | 图标/能力卡片行（`--n`） | 工具清单、技巧点 |
| `.layout-quote` | 金句 / 公式居中 + 定义条 | Agent = 模型 + Harness |
| `.layout-cards` | 卡片网格（`--n`） | 痛点、护栏条目 |
| `.layout-overlay` | 全幅图 + 底部叠字 | 总览大图 |

**禁止**：连续多页都用 `.story` 左右图文（易审美疲劳）。同章内轮换上表版式。

**落地示例（权威：`docs/deck/slides/`）**

| data-title | 版式 |
|------------|------|
| 三大痛点 | Cards ×3 |
| Harness 是什么 / 层层包含 | 左右图文（story reverse，图大宜侧置） |
| 提示词工程 / 模块二 | Icon-row |
| 上下文工程 | Media-top |
| Harness 工程 / 模块三 / Runner | Steps |
| 公式 | Quote |
| 公式总览 | Overlay |
| 模块一 | Contrast |
| 模块四 | Comparison |
| 模块五 | Cards ×4 |
| 实践框架 | BigNumber + Split + 表格 |
| Progress | Split |
| Skill Rules Lint / 闭环 | Steps（+ Contrast） |

---

## HTML 配方（复制后改文案）

### BigNumber

```html
<div class="layout-bignumber">
  <div class="figure">5</div>
  <div class="caption">Progress · Runner · Skill · Rules · Lint</div>
  <div class="foot">本仓五件套</div>
</div>
```

### Contrast

```html
<div class="layout-contrast">
  <div class="panel">
    <div class="lbl">Before</div>
    <h3>旧做法</h3>
    <ul>
      <li>痛点一</li>
      <li>痛点二</li>
    </ul>
  </div>
  <div class="panel lit">
    <div class="lbl">With Harness</div>
    <h3>新做法</h3>
    <ul>
      <li>收益一</li>
      <li>收益二</li>
    </ul>
  </div>
</div>
```

### Steps

```html
<div class="layout-steps" style="--n:3">
  <div class="step"><div class="n">01</div><h3>标题</h3><p>一句说明</p></div>
  <div class="step"><div class="n">02</div><h3>标题</h3><p>一句说明</p></div>
  <div class="step"><div class="n">03</div><h3>标题</h3><p>一句说明</p></div>
</div>
```

### Split

```html
<div class="layout-split"><!-- 加 class="flip" 可对调 -->
  <div class="split-body">
    <div class="kicker">Kicker</div>
    <h2>标题</h2>
    <p class="lead">补充一句</p>
  </div>
  <div class="split-media">右侧卡片 / 图 / 代码</div>
</div>
```

### Comparison

```html
<div class="layout-comparison">
  <table>
    <thead>
      <tr><th></th><th class="hl">Harness</th><th>纯提示词</th></tr>
    </thead>
    <tbody>
      <tr><td>可复跑</td><td class="hl yes">✓</td><td class="no">×</td></tr>
    </tbody>
  </table>
</div>
```

---

## 写作规则（防「密字墙」）

1. 无侧视觉时：标题 + 一块结构化版式（Contrast / Steps / Comparison），居中或满宽，勿孤零零左贴边。
2. 有侧视觉时：用 Split，文案侧 ≤1 个 kicker + 1 标题 + 1 短 lead。
3. 一页只强调 **一个** BigNumber；数字用主题 `--ink`（亮黄），说明用白字。
4. 新页仍须：唯一 `data-title` + `SLIDE_PARTICLE_MAP` 不重复风格 + `SLIDE_AI_CHIPS` 与本页相关。
5. **不要**单独做「版式示意」页；有对照/步骤/定调内容时直接套 class。

---

## 与 bolt-slides 的边界

| 可借鉴 | 不要搬 |
|--------|--------|
| 版式语义、S/G/A 交互模型、演讲节奏 | React 引擎、`src/deck/*`、framer-motion、CDN 字体依赖 |
| 缩放 DOM 缩略预览（打开时分批填充） | 全量 html2canvas 预生成（慢） |

改版式样式时只动 `docs/deck/styles/base.css`（及对应 `slides/*.css`），再 `python tools/build_deck.py`，并同步本文件配方。
