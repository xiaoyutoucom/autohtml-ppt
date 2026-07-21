---
name: tech-training-deck
description: >-
  可复用的技术培训翻页 HTML（单文件）规范与实现能力：离线 vendor、20 套主题、
  一页一粒子风格、按页相关 AI 飘荡标签、术语/案例悬停、表格逐行点亮、文本框/图片悬浮放大、
  演示模式底栏热区、导出 PPT、Demo 视频与现场命令、缩略图轨/网格总览/画笔批注、
  config.json 默认粒子/主题/演讲人/BGM、通用版式（Contrast/Steps/Hero/Cards 等）。
  用于培训演示、PPT 替代、Harness/Agent 主题分享，或用户要求「好看一点的培训页 / 导出PPT / 粒子特效」。
  可移植 Skill：Cursor / Claude Code / Codex / Copilot / Windsurf / Aider 等主流 AI 编码工具均可直接遵循本目录改 docs/deck/。
---

# Tech Training Deck（autohtml-ppt）

**工程根目录**：`E:\wence\autohtml-ppt`（与 Harness 自动化仓、`autoppt`/bolt-slides 隔离）

**权威实现**：`docs/harness_training.html`  
**配套**：`docs/assets/vendor/`、`docs/assets/themes.css`、`docs/assets/_gen_themes.py`  
**细节参考**：[reference.md](reference.md) · 版式：[layouts.md](layouts.md) · 词表：[glossary.md](glossary.md) · 资料：[sources.md](sources.md)  
**React/Bolt 幻灯**：见 `E:\wence\autoppt\bolt-slides`（可借鉴交互/版式语义，勿与本 HTML 混改引擎）。

改培训页或新建同类页时，**先读本 skill + 对照权威 HTML**，勿另起一套视觉/交互。

### 多工具可用（非 Cursor 独占）

本目录是**普通 Markdown 规范**，不绑定 Cursor 专有 API。任一下列方式即可：

| 工具 | 做法 |
|------|------|
| Cursor | 工程 Skill / 个人 Skill 桥接 |
| Claude Code | 在仓库中要求遵循本 `SKILL.md` |
| Codex / ChatGPT 编程 | 打开仓库并指向本目录 |
| Copilot · Windsurf · Continue · Aider · Cline | `@` 或打开本目录后改 `docs/deck/` |

改完执行 `python tools/build_deck.py`，打开 `docs/harness_training.html` 验证。

---

## 强制规则

1. **内网可演示**：依赖只走 `docs/assets/vendor/` 相对路径，禁止裸 CDN。
2. **术语悬停**：英文缩写/行话进 [glossary.md](glossary.md)，正文可悬停解释。
3. **成功案例**：摘要 + 悬停/聚焦详情；投影场次要能口述（勿只靠 hover）。
4. **演示模式默认关**；`F` 切换；底栏默认藏，**鼠标移到底部热区**才展开。
5. **导出 PPT**：底栏「导出PPT」= 可视区域截图入页；高保真用 CLI（见下）。
6. **单文件 HTML**（CSS/JS 可内联；vendor/字体/配图/视频可外置）。
7. **AI 飘荡标签与本页相关**：`#aiChips` 文案必须对应当前页主题，禁止整章共用一套词（如封面「Tool Use」出现在 Skill 页）。
8. **不要自动 git commit**；备注中文、小步提交。

---

## 目录约定

```
E:\wence\autohtml-ppt\
  docs/
    harness_training.html              # 构建产物（演示用，离线打开）
    deck/                              # ★ 权威源码（模块化）
      config.json                      # 默认：粒子 / 样式 / 演讲人
      styles/base.css                  # 公共样式模板
      js/deck.js                       # 公共脚本
      partials/                        # 壳（head / 底栏 / 氛围层）
      slides/XX-标题.html|.css         # 每页独立内容 + 单页样式
      manifest.json                    # 页序
      README.md
    HARNESS_GUIDE.md                   # 内容来源之一
    web自动化演示.mp4                  # Demo（有则挂 src）
    客户端演示.mp4                     # 可选；缺则 data-src +「加载视频」
    assets/
      themes.css / _gen_themes.py / *.png
      vendor/                          # tsparticles · vanta · pptxgen …
    skills/tech-training-deck/
      SKILL.md · reference.md · layouts.md · glossary.md · sources.md
  tools/
    build_deck.py                      # python tools/build_deck.py
    export_training_ppt.py
```

**改页流程**：改 `docs/deck/slides/…` → `python tools/build_deck.py` → 打开 `docs/harness_training.html`。  
单页样式写在同名 `.css`，选择器用 `.slide[data-title="…"]`。勿只改生成物。

---

## 已具备能力（改页时保持）

| 能力 | 要点 |
|------|------|
| 四章叙事 | 演示 → 认识 → 架构 → 实践 → Takeaway；封面 `cover-foot` + 独立 TOC |
| 导航 | ←→/空格/PageUpDown、Home/End、页码回车、`#sN`、底栏首页/尾页 |
| 主题 | `T` / 底栏样式；`localStorage`；`html[data-theme="1..20"]` |
| 演示模式 | `html.present-mode`；放大字号；`#presentHotzone` + `.footer.is-peek` |
| 全屏 | 底栏按钮 / F11；与演示模式分离 |
| 粒子 | **一页一风格**，`SLIDE_PARTICLE_MAP[data-title]` 唯一；`data-particles` 可覆盖；底栏「粒子」/`P` **按页选择效果或关闭**（覆盖记 localStorage，默认跟 MAP） |
| 内容尺度 | `:root --deck-scale`（默认 `1.2`）+ 根字号，对齐约 120% 浏览器缩放观感；**禁止**用 `zoom`/`transform` 整页硬放大 |
| 封面 | 密联网 `cover_mesh` + Vanta.NET（离封面销毁）+ 鼠标光斑 |
| AI 氛围 | `#aiAmbient`：侧轨 / **按页相关** chips / nodes / token stream；`SLIDE_AI_CHIPS[data-title]` 或 `data-ai-chips`；reduced-motion 关 |
| 入场 | anime.js 按页编排 + Animate.css；流程节点 / 表格行 / 代码行 `.is-lit` 依次点亮 |
| 表格逐行点亮 | Stage / 实践框架等自动扫 `table.fw-table`；或 `data-row-pulse="1"` 显式开启（见 [reference.md](reference.md)） |
| 悬浮放大 | 文本框（`.card` / `.panel` / `.formula`…）与图片框（`.story-fig` / `.media-fig` / `.hero-fig`）`:hover` 放大；导出 PPT 时强制 `transform:none` |
| 术语 / 案例 | `#term-tip`；`.case-card` 悬停详情（投影场次勿只靠 hover） |
| Demo | `slide-demo` 视频；空格播控；翻页暂停；客户端缺文件勿写死 `src` |
| 现场命令 | `slide-cmd` + 一键复制（命令指向自动化仓 pytest_cli 时需在对应仓库执行） |
| 导出 PPT | 浏览器：优先当前标签页截屏（含粒子，无进度浮层）；取消则 DOM 兜底；CLI 见下 |
| 缩略图轨 | `S` / 底栏「目录」；标题卡列表跳转 |
| 网格总览 | `G` / 底栏「总览」 |
| 画笔批注 | `A` / 底栏「画笔」；笔/荧光笔/橡皮；按页记忆；导出时隐藏 |
| 默认配置 | `docs/deck/config.json` 由 `deck/config.js` 运行时加载（HTTP 下改 json 刷新即可，不必 rebuild）；底栏 `P`/`T`/`M`；localStorage 可覆盖 |
| 通用版式 | BigNumber / Contrast / Steps / Split / Comparison / Hero / Media-top / Icon-row / Quote / Cards / Overlay（见 [layouts.md](layouts.md)） |
| 滚动条 | 全站细霓虹条（WebKit + `scrollbar-color`） |

快捷键、粒子、入场点亮、悬浮放大、导出 → [reference.md](reference.md)。  
版式 HTML 配方与写作规则 → [layouts.md](layouts.md)。

---

## 视觉默认（样式 1 · 科幻暗色）

| Token | 用途 |
|-------|------|
| `--paper` `#060a10` | 深空底 |
| `--neon` / `--teal` | 强调、连线、术语 |
| `--signal` | 警示 / 痛点 |
| Syne + IBM Plex Mono + 系统中文 | 标题 / 代码 / 正文 |

**避免**：紫靛渐变堆、emoji 墙、奶油衬线报纸风、一页粘整份 GUIDE。  
**现场建议**：固定主题、少按 `T`；正文页特效可弱于封面（已按页分流）。

---

## 幻灯片类型

| class / 模式 | 用途 |
|--------------|------|
| `slide-cover` | 英雄区 + 章节预览卡 + 演讲人 |
| TOC（`data-title="目录"`） | 章节卡 `toc-board` |
| `section-slide` | 大号描边章节号 |
| `slide-story` | 左图右文 / `.reverse` |
| `slide-demo` / `slide-cmd` | 视频 / 可复制命令 |
| Pain / `.case-card` | 痛点、成功案例悬停 |
| `slide-takeaway` | 行动项 + `.ref-panel` 参考资料 |
| 表格页 | `table.fw-table` + `.cite-path` |
| 通用版式 | Contrast / Comparison / Steps / BigNumber / Split / Hero…（见 [layouts.md](layouts.md)） |
| 工序表 | `table.fw-table`；需要扫行动画时加 `data-row-pulse="1"`（Stage 已开） |

新页必须设唯一 `data-title`，并在 `SLIDE_PARTICLE_MAP` **登记不重复**的粒子风格，同时在 `SLIDE_AI_CHIPS`（或 `data-ai-chips`）登记 **约 10 个与本页内容相关** 的飘荡标签（`AI_CHIP_COUNT`）。  
优先套通用版式，避免密字墙；无侧视觉时内容居中或满宽结构化块。  
文本框用 `.card` / `.panel` / `.tile` 等，大图用 `.story-fig` / `.media-fig` / `.hero-fig`（自带悬浮放大）。

---

## 术语与案例（必做）

- 词表：[glossary.md](glossary.md)；新缩写先补表再写正文。
- 手动：`<span class="term" data-term="RAG" data-tip="...">RAG</span>`
- 自动：JS 扫 `.slide` 文本节点包裹（跳过 `code/pre/case-detail`）
- 点击 `.term` **不翻页**；`#term-tip` 跟随鼠标/焦点。
- 案例卡：摘要 ≤2 行；详情 3～5 条；注明来源。

---

## 导出 PPT

**浏览器（离线）**  
底栏「导出PPT」→ `html2canvas` 截可视区 → `PptxGenJS` 一页一图下载。

**CLI（高保真视口）**

```powershell
cd E:\wence\autohtml-ppt
pip install -r requirements.txt
playwright install chromium
python -m tools.export_training_ppt
```

页面需暴露 `window.deckGoTo` / `window.deckSlideCount`。

---

## 工作流（新建或大改）

1. 按 [sources.md](sources.md) 准备本地主源 + 网页清单（或 `docs/sources.md` 投料表），再提炼大纲（约 12～28 页；约 33 页可接受）。
2. 复制 `harness_training.html` 骨架，改章节与 `data-title`。
3. 为每页登记**唯一** `SLIDE_PARTICLE_MAP` 风格（见 [reference.md](reference.md)）。
4. 为每页登记 `SLIDE_AI_CHIPS`（或写 `data-ai-chips`）：标签取自本页关键词，翻页自测是否串页。
5. 本地行级引用用 `.cite-path`；网页精选进 Takeaway `.ref-panel`；补 glossary → 术语/案例自测。
6. `file://` 断网验 vendor / 字体 / 图标 / 导出库。
7. 演示模式：底栏隐藏 + 底部上滑；F11 查裁切。
8. Demo 视频：有文件再挂 `src`；缺文件用 `data-src` + 加载按钮，避免 404。

---

## 本仓实践章（内容仍可引用自动化仓）

实践章里的路径（`harness/`、`cases/SPECCONFIG/` 等）指向 **web-ui-playwright-mcp** 真实代码，改内容时到那边核对行号。

1. 叙事用 **五件套**：Progress / Runner / Skill / Rules / Lint。
2. 关键概念 ≥1 个**真实示例**。
3. 标注 **路径 + 起始行号**，禁止虚构。
