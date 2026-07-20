# 模块化培训 Deck 源码

演示仍打开 **`docs/harness_training.html`**（由本目录构建生成，离线单文件）。

## 目录

```
docs/deck/
  config.json           # 默认：粒子 / 样式编号 / 演讲人
  styles/base.css       # 公共样式（模板）
  js/deck.js            # 公共脚本（导航 / 粒子 / 导出…）
  partials/             # 壳：head、底栏、氛围层
  slides/               # 每一页一个 .html + 可选 .css
  manifest.json         # 页序与文件名
```

## 溯源标识 `provenance.json`

用于开源后识别衍生使用（**公开标记，不是隐蔽追踪**）：

| 落点 | 作用 |
|------|------|
| `fingerprint` / `projectId` | 全网可搜的稳定指纹 |
| `html[data-deck-fingerprint]` + meta | 页面源码可核验 |
| `window.__TECH_TRAINING_DECK__` | 控制台 / 脚本可查 |
| 底栏归属（`requireAttribution`） | 协议可要求保留；导出 PPT 时隐藏 |

开源前请把 `copyright` / `homepage` / `contact` 改成你的主体。  
**无法阻止**对方删标记；真正约束靠协议 + 商用授权 + 必要时取证，不要做未披露的联网上报。

## 默认配置 `config.json`

```json
{
  "particles": true,
  "theme": 1,
  "speaker": "y",
  "bgm": false,
  "bgmSrc": "dylanf - 卡农 (经典钢琴版).mp3"
}
```

| 字段 | 含义 |
|------|------|
| `particles` | `true` 默认开粒子；`false` 默认关 |
| `theme` | 默认样式编号 `1`～`20` |
| `speaker` | 封面「演讲人」文案（默认 `y`） |
| `bgm` | `true` 默认开背景音乐；**默认 `false`** |
| `bgmSrc` | 音频路径，相对 `docs/`（也可写 `docs/xxx.mp3`） |
| `bgmVolume` | 可选，`0`～`1`，默认 `0.35` |

底栏「音乐」/`M` 可开关。文件请放到 `docs/dylanf - 卡农 (经典钢琴版).mp3`。浏览器可能拦截自动播放，开音乐后点一下页面即可开始。

页面通过 `<script src="deck/config.js">` **运行时读取** `config.json`（无需为改主题/粒子/音乐而 rebuild）。

| 打开方式 | 改配置怎么生效 |
|----------|----------------|
| **本地 HTTP**（推荐：VS Code Live Server，或 `npx serve docs`） | 只改 `config.json` → 普通刷新 |
| `file://` 双击 HTML | 浏览器常读不到 json → 改 `config.js` 里的 `FALLBACK`，或改用 HTTP |

改幻灯片内容/公共 CSS/JS 仍须：

```powershell
python tools/build_deck.py
```

`build` 会顺带把 `config.json` 同步进 `config.js` 的 FALLBACK。  
浏览器 T/P/M 记入 localStorage；**config 字段相对上次有变化时以新 config 为准**。

## 版式（避免连页左右图文）

优先用 `layout-hero` / `media-top` / `icon-row` / `quote` / `cards` / `steps` / `contrast` / `comparison`（见 `docs/skills/tech-training-deck/layouts.md`），**不要**连续多页 `.story` 左文右图。

## 改某一页

1. 改内容：`slides/XX-标题.html`
2. 改**仅该页**样式：`slides/XX-标题.css`（选择器用 `.slide[data-title="标题"]`）
3. 重新构建：

```powershell
cd E:\wence\autohtml-ppt
python -m tools.build_deck
# 或
python tools/build_deck.py
```

## 改公共样式 / 交互

| 改什么 | 文件 |
|--------|------|
| 全局排版、底栏、版式 class | `styles/base.css` |
| 主题色板 | `docs/assets/themes.css`（或 `_gen_themes.py`） |
| 翻页 / 粒子 / 导出 / 快捷键 | `js/deck.js` |
| 底栏 HTML、氛围层壳 | `partials/body-*.html` |

## 新增一页

1. 复制相邻 `slides/NN-*.html` / `.css`，改 `data-title`（全课唯一）。
2. 在 `manifest.json` 的 `slides` 数组插入一项（`index` / `title` / `slug` / `html` / `css`）。
3. 在 `js/deck.js` 的 `SLIDE_PARTICLE_MAP`、`SLIDE_AI_CHIPS` 登记该 `data-title`。
4. `python tools/build_deck.py`

## 注意

- **权威源码**：`docs/deck/`；勿只改生成物 `harness_training.html`（下次构建会覆盖）。
- 资源路径相对 `docs/`：`assets/`、`deck/`。
- 单页 CSS 必须用 `[data-title="…"]` 限定，避免污染其它页。
