# Tech Training Deck · 参考明细

配合 [SKILL.md](SKILL.md)。改粒子 / 快捷键 / 导出时改 **`docs/deck/`**（`js/deck.js` / `styles/base.css`），再 `python tools/build_deck.py`。演示对照生成物 `docs/harness_training.html`。  
单页样式：`docs/deck/slides/XX-标题.css`（见 [../deck/README.md](../../deck/README.md)）。

---

## 快捷键与底栏

| 操作 | 行为 |
|------|------|
| ← → / PageUp PageDown / 空格 | 翻页（Demo 页空格=视频播控） |
| Home / End | 首页 / 尾页 |
| 页码框 + Enter | 跳转 |
| `F` | 演示模式开关 |
| `T` | 主题选择器 |
| `P` / 底栏「粒子」 | 打开粒子选择：本页默认 / 关闭 / 任选风格（覆盖记 localStorage；默认跟 `SLIDE_PARTICLE_MAP`） |
| `M` / 底栏「音乐」 | 开关背景音乐（默认关；路径见 `config.json`） |
| `S` / 底栏「目录」 | 左侧缩略图轨 |
| `G` / 底栏「总览」 | 全屏网格总览 |
| `A` / 底栏「画笔」 | 画笔批注（Esc 关闭） |
| `Esc` | 关闭轨 / 总览 / 画笔 |
| 底栏「导出PPT」 | 可视区截图合成 PPTX；导出时隐藏轨/总览/画笔（导出会暂停 BGM） |
| 底栏全屏按钮 | `requestFullscreen`（与演示模式分离） |
| 点击幻灯左右区 | 左≈上一页、右≈下一页（画笔/轨/总览开启时禁用） |

**演示模式**：`html.present-mode`  
- 幻灯留白用 `--footer-h: 0`；底栏自身用 `--footer-bar-h`（展开时 `height:auto`，勿把栏高设成 0）  
- `#presentHotzone` 唤出；展开后热区 `pointer-events:none`，避免挡按钮  
- `.footer.is-peek` + `html.footer-peek`；进度条 `bottom: var(--footer-peek-h)`  
- 勿用「整页 `:hover` 显示底栏」

---

## 粒子：一页一风格

### 原则

1. `PARTICLE_FLAVORS` 定义风格；字段含 shape / 方向 / 连线 / 密度 / colorMode / hover / twinkle。
2. `SLIDE_PARTICLE_MAP`：`data-title` → 风格名，**值不可重复**。
3. 覆盖：`<section ... data-particles="mod5_spark">`。
4. `prefers-reduced-motion: reduce` 时不加载粒子 / AI 氛围；Vanta 亦销毁。
5. 换主题会 `refreshParticles(true)`；**须等 `PARTICLE_FLAVORS` 初始化后再调**（`initTheme` 早于粒子表时要跳过）。

### 差异维度（拉开观感）

- 形状：`circle` / `star` / `triangle`
- 运动：`none` / `top` / `bottom` / `left` / `right`；`straight` vs `random`
- 连线：有无、距离、透明度
- 体量：细尘 ↔ 大气泡
- `colorMode`：`all` / `neon` / `teal` / `signal` / `duo`
- hover：`grab` / `attract` / `bubble` / `repulse`

### 当前映射（权威表在 HTML，改页请同步）

| data-title | flavor |
|------------|--------|
| 封面 | cover_mesh |
| 目录 | toc_constellation |
| 01 演示 | sec_demo_rise |
| 自动化演示 | demo_web_rain |
| 客户端演示 | demo_client_slash |
| 现场跑全量 | cmd_pulse |
| 02 认识 | sec_know_drift |
| 三大痛点 | pain_chaos |
| 更隐蔽的坑 | pit_scatter |
| Harness 是什么 | harness_web |
| 为什么火了 | cases_bubbles |
| 提示词工程 | prompt_stars |
| 上下文工程 | context_mesh |
| Harness 工程 | harness_eng_grid |
| 层层包含 | nest_layers |
| 公式 | formula_lift |
| 公式总览 | formula_ring |
| 03 架构 | sec_arch_beam |
| 模块一～五 | mod1_tri / mod2_stars / mod3_matrix / mod4_foam / mod5_spark |
| 本质收束 | essence_soft |
| 04 实践 | sec_practice_up |
| 实践框架 | practice_lattice |
| Stage | stage_codefall |
| Progress / Progress 实战 | progress_orbit / progress_live |
| Runner | runner_burst |
| Skill Rules Lint | srl_glyphs |
| 闭环 | loop_flow |
| 思考与行动 | takeaway_snow |

新页：新增 flavor（配置与已有明显不同）→ 写入 MAP；勿复用已占用名。

### 其它氛围层

- `#tsparticles`：全屏粒子容器  
- `#coverCursorGlow`：鼠标光斑（封面更大）  
- `#vanta-cover`：仅封面 WebGL 网  
- `#aiAmbient`：`.ai-rail` / `#aiChips` / `#aiNodes` / `.ai-stream`

---

## AI 飘荡标签：一页一主题

背景浮动 chip（`#aiChips`）是氛围装饰，**必须与当前页内容相关**，禁止整章/全局共用一套词库。

### 原则

1. 权威表：`SLIDE_AI_CHIPS`（JS），键 = 页的 `data-title`，值 = **约 10 个**短标签（中英均可，≤16 字）；数量由 `AI_CHIP_COUNT` 控制。
2. 单页覆盖：`<section data-title="…" data-ai-chips="A|B|C|…">`（`|` 分隔，优先于表，最多 `AI_CHIP_COUNT` 个）。
3. 未登记时：从本页 `h1/h2`、`.tag`、`.kicker`、`code`、`strong.strong` 抽取；仍不够再补通用词。
4. **禁止**：粗分类池（整章「story / practice」共用同一组 chip）导致串页（例：Skill 页出现无关的「Tool Use」）。
5. `refreshAiAmbient()` 在每次 `render`/翻页时调用；`prefers-reduced-motion` 时不渲染。
6. 改页 / 新建页：改 `data-title` 或正文关键词后，**同步改 `SLIDE_AI_CHIPS`**（与粒子 MAP 同一检查清单）；槽位约 12 个，避免叠在同一角。

### 选词建议

| 页类型 | 标签从哪来 |
|--------|------------|
| 封面 / 目录 | 章节名、产品名、核心公式词 |
| 痛点 / 案例 | 本页坑名或案例名（幻读、LangChain…） |
| 模块页 | 该模块专有词（MCP、Plan Mode、架构 Linter…） |
| 实践 / 五件套 | 组件名与本页动作（`--advance`、gate、pass/fail…） |

### 自测

翻若干页：chip 文案应随页变；拿掉本页正文后不应还能「猜对」是别的章。

---

## 主题

- `docs/assets/themes.css`：`html[data-theme="1"]` … `"20"`；切换时同步 `data-theme-mode="light|dark"`
- 生成器：`python docs/assets/_gen_themes.py`（改 `_gen_themes.py` 色板后重跑）
- 记忆键：`localStorage`（正式分享前确认不是彩排残留主题）
- **浅底可读**：正文/版式/飘荡标签/底栏用 `var(--ink)` / `var(--ink-soft)` / `var(--panel)` / `var(--line)`，禁止内容区与底栏硬编码 `#fff` 深底；底栏随 `data-theme` 变色

---

## 溯源标识 `docs/deck/provenance.json`

公开可核验标记（`fingerprint`、meta、`data-deck-*`、`window.__TECH_TRAINING_DECK__`、可选底栏归属）。  
由 `deck/js/provenance.js` 注入；**非隐蔽上报**。删标记本身挡不住，约束靠协议与商用授权。开源前改 `copyright` / `homepage` / `contact`。

---

## 默认配置 `docs/deck/config.json`

支持 `//` / `/* */` 注释。运行时由 `deck/config.js` 加载为 `window.DECK_CONFIG`（优先读 `config.json`）。

**改 theme / particles / bgm（不必 python）**：用本地 HTTP 打开 `docs/`（Live Server / `npx serve docs`）→ 改 `config.json` → 普通刷新。  
`file://` 下请改 `config.js` 的 `FALLBACK`，或改用 HTTP。改页内容仍须 `python tools/build_deck.py`。

| 字段 | 含义 |
|------|------|
| `particles` | 默认是否开粒子 |
| `theme` | 默认样式 `1`～`20` |
| `speaker` | 封面演讲人（`#coverSpeaker`） |
| `bgm` | 默认是否开 BGM（**建议 `false`**，防自动播放打扰） |
| `bgmSrc` | 音频路径，相对 `docs/` |
| `bgmVolume` | 可选，`0`～`1`，默认约 `0.35` |

浏览器 T/P/M 的选择记入 localStorage；**config 对应字段相对上次注入值有变化时，以新 config 为准**。封面演讲时间：`#coverTalkTime`（进封面刷新，约 30s 一轮）。

---

## 入场点亮（表格 / 流程 / 代码）

权威：`docs/deck/js/deck.js` → `animateHighlightSequence`；样式：`.is-lit` + `@keyframes rowFlash`（`styles/base.css`）。

### 何时触发

进页且未 `prefers-reduced-motion`、且已加载 anime.js 时，对本页依次点亮：

1. `.flow .node`（流程节点）
2. `table.fw-table tbody tr`（表格行）
3. `pre.line-lit .code-line`（代码行，≤16 行）

### 表格行如何开启

满足任一即可扫 `table.fw-table`：

| 条件 | 说明 |
|------|------|
| `data-title="Stage"` | Stage 工序表（S0–S9）自动开 |
| `data-title` 含「实践框架」或标题匹配五件套 / S0 / 工序 | 实践框架表自动开 |
| `data-row-pulse="1"` | **任意页显式开启**（推荐新表页用这个） |

行多（≥8）时 hold≈300ms，否则≈450ms；整表扫完后短暂收掉高亮。  
新工序/对照表：用 `table.fw-table` + 需要动画时写 `data-row-pulse="1"`，勿另写一套 JS。

---

## 悬浮放大（文本框 / 图片）

权威：`docs/deck/styles/base.css`（「悬浮放大」块）。

| 目标 | 选择器 | 行为 |
|------|--------|------|
| 文本框 | `.card` / `.case-card` / `.pain-card` / `.panel` / `.story-take` / `.formula` / `.cmd-hero` / `.ref-panel` / `.tile` / `.toc-card` / `.cover-foot-card` / `.hvr-grow` | `:hover` ≈ `scale(1.04～1.045)` + 边光 |
| 图片框 | `.story-fig` / `.media-fig` / `.hero-fig` | `:hover` ≈ `scale(1.06)` |
| 叠字大图 | `.layout-overlay:hover img` | 图内容 ≈ `scale(1.06)` |

**写作约定**：正文块用上表 class，大图包在 `figure.story-fig` / `.media-fig` / `.hero-fig` 里，即可自动获得放大；勿对整页或底栏做 `scale`。  
`html.exporting-ppt` 会强制内容 `transform: none`，避免截屏变形。  
`prefers-reduced-motion: reduce` 时 transition 关闭。  
投影口述场次仍勿只靠 hover 传达关键信息（案例详情同理）。

---

## 导出 PPT

### 浏览器

- 库：`html2canvas.min.js`、`jszip.min.js`、`pptxgen.min.js`（**顺序**：JSZip → PptxGenJS；勿再用会误导出的 `pptxgen.bundle.js`）
- `resolvePptxCtor()` 用 `new Ctor()` 探测 `addSlide` / `writeFile`
- 浏览器导出优先 **`getDisplayMedia` 当前标签页截屏**（Chrome/Edge 选「这个标签页」），可含粒子/Vanta；取消授权则降级 `html2canvas` DOM 截图（关特效保正文）
- 导出中不显示「正在导出」浮层（避免进截屏）；进度仅改 `document.title`；视频忽略
- CLI 高保真：`python -m tools.export_training_ppt`
- API：`window.deckGoTo(i)`、`window.deckSlideCount()`
- React/Bolt 幻灯技能：[`../bolt-slides/SKILL.md`](../bolt-slides/SKILL.md)

### CLI

```bash
python -m tools.export_training_ppt
python -m tools.export_training_ppt --width 1920 --height 1080 --settle-ms 450
```

- 依赖：`playwright`、`python-pptx`；`playwright install chromium`
- `full_page=False` 视口截图 → 每页一张图铺满 16:9

---

## Demo 视频

| 文件 | 行为 |
|------|------|
| `docs/web自动化演示.mp4` | `src` 直挂 |
| `docs/客户端演示.mp4` | 可缺省；用 `data-src` +「加载视频」，避免启动 404 |

Demo 页：空格播/暂停；`render` 离页 `pause`；导出/翻页勿抢视频焦点键。

---

## 现场分享建议（非代码强制）

1. Demo 段预留 8～12 分钟；缺客户端视频则跳过或改讲命令页。  
2. 「为什么火了」投影上难悬停 → 口述或拆页。  
3. Stage 大表只讲 S1/S8/Progress↔Runner，其余指向 GUIDE。  
4. 正式场固定主题；需要稳可口头约定少开特效页连翻。  
5. Takeaway：行动项与外链可分讲，避免一页念链接。

---

## 滚动条

全站：

```css
scrollbar-width: thin;
scrollbar-color: neon-mix track-mix;
/* + ::-webkit-scrollbar* 细霓虹 thumb */
```

`.ref-panel` 等 `overflow: auto` 区域自动生效。
