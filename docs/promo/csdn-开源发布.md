# 【开源】用 HTML 做技术培训 PPT：离线可演示、AI 能改页、一键导出 PPTX

> **CSDN 已发：** https://blog.csdn.net/qq_30287489/article/details/163073308  
> **编辑入口：** https://editor.csdn.net/md/?articleId=163073308  
> 下面是建议替换进编辑器的**定稿正文**（从「导语」复制到文末，勿带本提示框）。

---

做技术内训、Agent / Harness 分享时，最烦三件事：

1. **PowerPoint 默认丑**，动效和现场感不够  
2. **内网断网**，依赖 CDN 的 HTML 幻灯片直接挂  
3. **AI 改不动**：四五千行单文件 HTML，Agent 一改就乱  

我把这套方案开源了：**Tech Training Deck（autohtml-ppt）**——面向技术培训的可翻页单文件 HTML 幻灯片，**MIT** 协议，个人与公司均可免费使用（含商用）。

| 平台 | 地址 |
|------|------|
| **码云 Gitee（国内推荐）** | https://gitee.com/xiaoyutou_647/autohtml-ppt |
| **GitHub** | https://github.com/xiaoyutoucom/autohtml-ppt |

![主预览 GIF](https://gitee.com/xiaoyutou_647/autohtml-ppt/raw/main/docs/assets/screenshots/preview.gif)

*封面 → 目录 → 图文 → Contrast 对比 → Stage 逐行点亮*

---

## 一、它解决什么问题？

| 传统 PPT / 普通 HTML 幻灯 | Tech Training Deck |
|---------------------------|-------------------|
| 默认丑、难统一品牌 | 20 套深/浅主题，科幻 HUD 风格 |
| 现场感弱 | 一页一粒子、AI 飘荡标签、表格逐行点亮 |
| 内网 CDN 挂掉 | 依赖全部本地 vendored，支持 `file://` |
| AI 难改巨型单文件 | 模块化 `docs/deck/` + 可移植 Agent Skill |
| 结束后还要交 PPT | 浏览器导出 / Playwright CLI → PPTX |

仓库自带完整 **Harness Engineering 培训演示（30+ 页）**，克隆后打开就能看效果，再换成你自己的课程。

---

## 二、核心亮点

### 1. 离线优先，内网能讲

核心依赖放在 `docs/assets/vendor/`，不依赖裸 CDN。培训教室断外网也能翻页、播视频、导出。

### 2. AI 友好：Cursor / Claude Code / Codex 都能改

写作规范是普通 Markdown Skill，**不绑死某一家 IDE**：

- Cursor  
- Claude Code  
- OpenAI Codex / Copilot / Windsurf / Aider / Cline  

让 Agent 先读：

`docs/skills/tech-training-deck/SKILL.md`

再改 `docs/deck/slides/`，最后执行：

```bash
python tools/build_deck.py
```

### 3. 演示现场工具齐全

| 快捷键 | 作用 |
|--------|------|
| ← → / 空格 | 翻页 |
| `T` | 20 套主题切换 |
| `P` | 按页选择粒子效果（可关闭） |
| `M` | 背景音乐 |
| `S` / `G` / `A` | 缩略图目录 / 网格总览 / 画笔批注 |
| `F` | 演示模式（底栏热区唤出控件） |

![20 套主题面板](https://gitee.com/xiaoyutou_647/autohtml-ppt/raw/main/docs/assets/screenshots/24-theme-picker.png)

### 4. 版式轮换，不像流水账

内置多套版式：Cards、Contrast、Steps、Quote、Overlay、Media-top、Story、BigNumber、Split、Comparison…  
避免整场都是「左字右图」。

![Contrast 前后对比版式](https://gitee.com/xiaoyutou_647/autohtml-ppt/raw/main/docs/assets/screenshots/05-layout-contrast.png)

### 5. Stage 表逐行点亮——讲工序很爽

工序表可按行高亮，适合 S0–S9 这类流程讲解。

![Stage 工序表逐行点亮](https://gitee.com/xiaoyutou_647/autohtml-ppt/raw/main/docs/assets/screenshots/11-stage-table.png)

---

## 三、30 秒上手

国内优先用码云：

```powershell
git clone https://gitee.com/xiaoyutou_647/autohtml-ppt.git
cd autohtml-ppt
start docs\harness_training.html
```

更推荐用本地 HTTP（方便热读配置）：

```powershell
npx --yes serve docs
```

### 改一页

1. 编辑 `docs/deck/slides/某页.html`  
2. 需要时登记 `manifest.json`，粒子可写在 `docs/deck/config.json` → `slideParticles`  
3. 执行 `python tools/build_deck.py`  
4. 刷新演示页  

### 导出 PPTX

```powershell
pip install -r requirements.txt
playwright install chromium
python -m tools.export_training_ppt
```

---

## 四、适合谁？

- 做 **技术内训 / 公开分享** 的工程师  
- 讲 **Agent、Harness、自动化测试** 的同学  
- 想用 **AI 持续维护课件**，而不是每次手搓 PPT 的人  
- 需要 **内网离线演示 + 会后交 PPTX** 的团队  

---

## 五、协议与赞助

- **MIT**：个人与公司均可免费使用（含商用）  
- 自愿赞助：微信 / USDT-TRC20（见仓库 `SPONSORS.md`）  
- 付费定制主题、代做课件、白标：邮件 **xiaoyutoucom@gmail.com**  

如果这个项目帮到你，欢迎点个 **Star**，也欢迎提 Issue / PR。

---

## 六、链接汇总

- 本文：https://blog.csdn.net/qq_30287489/article/details/163073308  
- Gitee：https://gitee.com/xiaoyutou_647/autohtml-ppt  
- GitHub：https://github.com/xiaoyutoucom/autohtml-ppt  
- 演示入口：仓库内 `docs/harness_training.html`  
- Agent Skill：`docs/skills/tech-training-deck/SKILL.md`  

---

我是 **xiaoyutoucom**。觉得有用请 Star，评论区欢迎交流你的培训场景——下期可以聊：怎么用 Agent Skill 一晚改完整套培训页。
