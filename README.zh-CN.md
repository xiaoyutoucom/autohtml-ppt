# Tech Training Deck · autohtml-ppt

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-xiaoyutoucom-181717?logo=github)](https://github.com/xiaoyutoucom/autohtml-ppt)
[![Gitee](https://img.shields.io/badge/Gitee-码云-xiaoyutou__647-C71D23?logo=gitee)](https://gitee.com/xiaoyutou_647/autohtml-ppt)
[![Offline](https://img.shields.io/badge/离线-file%3A%2F%2F%20可用-success)](#快速开始)
[![Sponsors](https://img.shields.io/badge/赞助-欢迎-ea4aaa)](./SPONSORS.md)

[English](./README.md) | **简体中文**

> 面向技术培训的**可翻页单文件 HTML 幻灯片**——比 PowerPoint 更适合「内训 / Agent·Harness 分享 / AI 持续改页」，离线可演示，一键导出 PPTX。  
> **不只 Cursor**：Claude Code、Codex 等主流 AI 编码工具都能直接按同一套 Skill 改页。

**作者：** [xiaoyutoucom](https://github.com/xiaoyutoucom) · © 2026 xiaoyutoucom · 邮箱：[xiaoyutoucom@gmail.com](mailto:xiaoyutoucom@gmail.com)

**赞助 / 付费定制：** [SPONSORS.md](./SPONSORS.md) · [SERVICES.md](./SERVICES.md)（主题、代做课件、白标）

<p align="center">
  <img src="docs/assets/screenshots/preview.gif" alt="Tech Training Deck 动态预览" width="900" />
  <br />
  <em>主预览 — 封面 → 目录 → 图文 → Contrast 版式 → Stage 逐行点亮</em>
</p>

### Cursor · Claude Code · Codex · 其它主流都能用

写作规范是普通 Markdown，目录：[`docs/skills/tech-training-deck/`](docs/skills/tech-training-deck/SKILL.md)。  
让 Agent 先读该目录（或 `@` / 粘贴 `SKILL.md`）即可——**不依赖 Cursor 专有运行时**。

| 工具 | 怎么用本项目 |
|------|-------------|
| **Cursor** | 工程内 Skill 或个人 Skill 桥接 → 读 `SKILL.md` |
| **Claude Code (CC)** | 在仓库里跑 `claude`，要求遵循 `docs/skills/tech-training-deck/SKILL.md` |
| **OpenAI Codex / ChatGPT 编程** | 打开仓库，指令：按 `docs/skills/tech-training-deck/` 改 `docs/deck/` |
| **GitHub Copilot / Windsurf / Continue / Aider / Cline** | 同上：加载 Skill 文档 + 编辑模块化源码 |
| **任意 LLM 对话** | 附上 `SKILL.md`、`layouts.md` 和要改的那一页 |

幻灯源码就是 HTML/CSS/JS + Python 构建，**会改文件的 Agent 都能出片**。

---

## 为什么做这个？

常见「HTML 版 PPT」要么太素（Markdown 静态页），要么太重（整站 React + CDN）。  
**Tech Training Deck** 针对 **技术内训、Harness/Agent 主题分享、可复用培训模板** 做了折中：

| 传统 PPT 的痛点 | 这里怎么解决 |
|----------------|-------------|
| 默认丑、难统一品牌 | 20 套深/浅主题，科幻 HUD 视觉 |
| 缺少动效与现场感 | 一页一粒子、AI 飘荡标签、表格逐行点亮 |
| 内网断网 CDN 挂掉 | 依赖全部放进 `docs/assets/vendor/` |
| AI 难改四五千行单文件 | 模块化 `docs/deck/` + 可移植 Skill（Cursor / CC / Codex …） |
| 结束后还要交 PPT 文件 | 浏览器导出或 Playwright CLI → PPTX |

仓库自带完整 **Harness Engineering 培训演示（33 页）**，打开即可体验，再替换成你自己的课程内容。

---

## 截图与 GIF — 亮点全览

### 动态演示

| | |
|--|--|
| <img src="docs/assets/screenshots/preview-flip.gif" width="440" alt="翻页" /><br />**翻页巡礼** — 封面→目录→卡片→图文→媒体→公式→总览→对比→Stage→现场命令 | <img src="docs/assets/screenshots/preview-layouts.gif" width="440" alt="版式" /><br />**版式合集** — Cards / Contrast / Steps / Quote / Overlay / Media-top / Story / 表格 |
| <img src="docs/assets/screenshots/preview-stage.gif" width="440" alt="逐行点亮" /><br />**Stage 逐行点亮** — S0–S9 演讲扫表 | <img src="docs/assets/screenshots/preview-themes.gif" width="440" alt="主题" /><br />**20 套主题** — 深色+浅色在样式面板中轮换（`T`） |
| <img src="docs/assets/screenshots/preview-chrome.gif" width="440" alt="演示工具" /><br />**演示工具条** — 缩略图轨(`S`)→总览(`G`)→画笔(`A`)→演示模式(`F`) | <img src="docs/assets/screenshots/preview.gif" width="440" alt="主预览" /><br />**主循环** — 核心叙事一镜到底 |

### 1）封面 / 目录 / 叙事

<p align="center"><img src="docs/assets/screenshots/01-cover.png" width="900" alt="封面" /><br /><em>封面 — 品牌英雄区、粒子/Vanta、章节预览卡、演讲人+演讲时间、右上角溯源标识</em></p>
<p align="center"><img src="docs/assets/screenshots/02-toc.png" width="900" alt="目录" /><br /><em>独立目录页 — 可点击章节卡</em></p>
<p align="center"><img src="docs/assets/screenshots/16-section-break.png" width="900" alt="章节" /><br /><em>章节分隔 — 大号描边章节号</em></p>
<p align="center"><img src="docs/assets/screenshots/03-story-figure.png" width="900" alt="图文" /><br /><em>Story 版式 — 大图 + 要点（已换成无版权小人配图）</em></p>

### 2）版式系统（避免连页左右图文疲劳）

| | |
|--|--|
| <img src="docs/assets/screenshots/04-layout-cards.png" width="440" alt="Cards" /><br />Cards 卡片 | <img src="docs/assets/screenshots/05-layout-contrast.png" width="440" alt="Contrast" /><br />Contrast 前后对比 |
| <img src="docs/assets/screenshots/06-layout-steps.png" width="440" alt="Steps" /><br />Steps 步骤 | <img src="docs/assets/screenshots/07-layout-quote.png" width="440" alt="Quote" /><br />Quote 金句/公式居中 |
| <img src="docs/assets/screenshots/08-layout-overlay.png" width="440" alt="Overlay" /><br />Overlay 全幅叠字 | <img src="docs/assets/screenshots/09-layout-media-top.png" width="440" alt="Media-top" /><br />Media-top 上图下文 |
| <img src="docs/assets/screenshots/10-layout-nested.png" width="440" alt="Nested" /><br />层层包含 / story reverse | <img src="docs/assets/screenshots/12-practice-framework.png" width="440" alt="实践" /><br />实践框架 |

引擎还支持：**BigNumber · Split · Comparison · Icon-row · Hero**（见 `layouts.md`）。

### 3）教学互动

<p align="center"><img src="docs/assets/screenshots/11-stage-table.png" width="900" alt="Stage" /><br /><em>Stage 工序表 — `table.fw-table` + 逐行 `.is-lit`（可用 `data-row-pulse`）</em></p>
<p align="center"><img src="docs/assets/screenshots/15-case-cards.png" width="900" alt="案例" /><br /><em>成功案例卡 — 摘要 + 悬停/聚焦详情</em></p>
<p align="center"><img src="docs/assets/screenshots/13-demo-video.png" width="900" alt="视频" /><br /><em>Demo 视频页 — 空格播控、离页暂停</em></p>
<p align="center"><img src="docs/assets/screenshots/14-live-cmd.png" width="900" alt="命令" /><br /><em>现场命令页 — 一键复制</em></p>

### 4）演示工具条

| | |
|--|--|
| <img src="docs/assets/screenshots/20-chrome-rail.png" width="440" alt="轨" /><br />缩略图轨（`S`） | <img src="docs/assets/screenshots/21-chrome-grid.png" width="440" alt="总览" /><br />网格总览（`G`） |
| <img src="docs/assets/screenshots/22-chrome-annotate.png" width="440" alt="画笔" /><br />画笔/荧光笔/橡皮（`A`） | <img src="docs/assets/screenshots/23-present-mode.png" width="440" alt="演示" /><br />演示模式（`F`）+ 底栏热区 |
| <img src="docs/assets/screenshots/24-theme-picker.png" width="440" alt="样式" /><br />样式面板（`T`）— 20 套可记忆 | |

**产品内还有（见图/快捷键）：** 粒子开关（`P`）、背景乐（`M`）、导出 PPT、全屏、术语悬停、按页 AI 飘荡标签、卡片/图片悬浮放大、溯源指纹、离线 vendor、模块化 `docs/deck/`、多工具 Skill、双许可。

### 5）多主题画廊（深色 + 浅色）

| 深色 | 浅色 |
|------|------|
| <img src="docs/assets/screenshots/30-theme-01-deep-space.png" width="420" alt="1" /><br />#1 深空青光 | <img src="docs/assets/screenshots/36-theme-05-polar-ice.png" width="420" alt="5" /><br />#5 极地冰原 |
| <img src="docs/assets/screenshots/31-theme-03-obsidian-amber.png" width="420" alt="3" /><br />#3 曜石琥珀 | <img src="docs/assets/screenshots/37-theme-08-blueprint.png" width="420" alt="8" /><br />#8 蓝图草稿 |
| <img src="docs/assets/screenshots/32-theme-07-coral-reef.png" width="420" alt="7" /><br />#7 珊瑚暗礁 | <img src="docs/assets/screenshots/38-theme-14-porcelain.png" width="420" alt="14" /><br />#14 瓷白墨线 |
| <img src="docs/assets/screenshots/33-theme-11-terminal-green.png" width="420" alt="11" /><br />#11 终端酸绿 | <img src="docs/assets/screenshots/39-theme-20-studio-bw.png" width="420" alt="20" /><br />#20 摄影棚黑白 |
| <img src="docs/assets/screenshots/34-theme-12-deep-ocean.png" width="420" alt="12" /><br />#12 深海蓝渊 | |
| <img src="docs/assets/screenshots/35-theme-17-graphite.png" width="420" alt="17" /><br />#17 石墨信号 | |

全部 **20** 套见 `docs/assets/themes.css`（`T` 切换；`localStorage` 记忆；`config.json` 设默认）。

重截命令：

```powershell
python tools/capture_readme_shots.py   # 静态 PNG（功能+主题）
python tools/capture_readme_gifs.py    # 动态 GIF
```

---

## 关键能力（完整清单）

| 类别 | 亮点 |
|------|------|
| **导航** | ←→ / 空格 / PgUp·PgDn、Home/End、页码跳转、`#sN`、点击左右区、首页/尾页 |
| **演示** | `F` 放大字号；底栏隐藏；底部热区唤出；全屏独立 |
| **工具条** | `S` 缩略图轨 · `G` 网格总览 · `A` 画笔（按页记忆） |
| **主题** | 20 套深/浅 · 选择器 · config 默认 · localStorage |
| **粒子** | 一页一风格 · `P` 开关 · 封面 Vanta + 光斑 |
| **AI 氛围** | 按页飘荡标签 / 侧轨 / nodes / token stream |
| **动效** | anime.js + Animate.css · 流程/表格/代码 `.is-lit` |
| **逐行点亮** | Stage / 实践框架自动 · 或 `data-row-pulse="1"` |
| **悬浮放大** | 卡片/panel/公式/图框 |
| **版式** | Cards · Contrast · Steps · Quote · Overlay · Media-top · Story · BigNumber · Split · Comparison · Icon-row · Hero |
| **Demo / 命令** | 视频页 · 可复制现场命令 |
| **术语 / 案例** | 悬停解释 · 案例卡展开详情 |
| **导出** | 浏览器 PPT（优先标签页截屏）· Playwright CLI |
| **配置** | `config.json` 运行时加载 · 演讲人/BGM/粒子/主题 |
| **溯源** | 公开指纹徽章 · `TTD-2026-XIAOYUTOUCOM` |
| **离线** | `docs/assets/vendor/` · 支持 `file://` |
| **写作** | 模块化 `docs/deck/` · `build_deck.py` · Cursor/CC/Codex 等可移植 Skill |
| **协议** | MIT · 欢迎赞助与付费定制（`SPONSORS.md` / `SERVICES.md`） |

### 写作与 AI 协作
- 权威源码：**`docs/deck/`**  
- 每页独立 html/css；`python tools/build_deck.py` 构建  
- **可移植 Agent Skill**（Cursor · Claude Code · Codex · Copilot · Windsurf …）：[`docs/skills/tech-training-deck/`](docs/skills/tech-training-deck/SKILL.md)  
- 运行时配置：[`docs/deck/config.json`](docs/deck/config.json)（HTTP 打开时可改 JSON 直接刷新）  
- 溯源标识：[`docs/deck/provenance.json`](docs/deck/provenance.json)

### 离线优先
- 支持 `file://` 与任意静态服务器  
- 核心演示不依赖裸 CDN  

---

## 快速开始

### 1）打开演示

```powershell
start docs\harness_training.html
```

更推荐用 Live Server / `npx serve docs` 打开 `docs/`（便于热读 `config.json`）。

### 2）快捷键

| 键 | 作用 |
|----|------|
| ← → / 空格 | 翻页 |
| `T` | 主题 |
| `P` | 粒子 |
| `M` | 背景音乐 |
| `F` | 演示模式 |
| `S` / `G` / `A` | 目录轨 / 总览 / 画笔 |

### 3）改一页

编辑 `docs/deck/slides/…` → 登记 `manifest.json` 与粒子/标签表 →：

```powershell
python tools/build_deck.py
```

### 4）导出 PPTX

```powershell
pip install -r requirements.txt
playwright install chromium
python -m tools.export_training_ppt
```

---

## 相对其它方案的优势

| | PPT / Keynote | Reveal / Slidev | **本项目** |
|--|---------------|-----------------|-----------|
| 内网离线 | ✅ | 常依赖 CDN | ✅ 本地 vendor |
| 培训向动效 | 手搓 | 看主题 | ✅ 粒子+点亮+氛围层 |
| 导出 PPTX | 原生 | 弱 | ✅ 浏览器 + CLI |
| AI 改页 | 差 | 一般 | ✅ 模块化 + 多工具 Skill |
| 画笔/总览/演示热区 | 插件 | 插件 | ✅ 内置 |
| MIT + 多工具 AI Skill | — | 看项目 | ✅ 可移植 Skill |

---

## 赞助

自愿支持即可，**不是使用前提**。渠道与档位见 **[SPONSORS.md](./SPONSORS.md)**（GitHub Sponsors / 爱发电 / 微信）。

需要定制主题、代做整套培训课件、白标去掉指纹 → **[SERVICES.md](./SERVICES.md)**，邮件询价。

---

## 协议

采用 **[MIT License](./LICENSE)**。个人与公司均可免费使用（含商用）。

再分发时请保留版权声明。公开溯源徽章（`TTD-2026-XIAOYUTOUCOM`，见 `docs/deck/provenance.json`）便于归属与发现；若交付客户需要去掉，可走付费白标服务。

**镜像：** [GitHub](https://github.com/xiaoyutoucom/autohtml-ppt) · [码云 Gitee](https://gitee.com/xiaoyutou_647/autohtml-ppt)

---

## 支持

- Issue：GitHub / Gitee  
- 邮箱：[xiaoyutoucom@gmail.com](mailto:xiaoyutoucom@gmail.com)  
- 赞助：[SPONSORS.md](./SPONSORS.md) · 付费服务：[SERVICES.md](./SERVICES.md)

---

© 2026 xiaoyutoucom · Fingerprint `TTD-2026-XIAOYUTOUCOM`
