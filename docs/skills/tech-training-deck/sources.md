# 参考资料怎么提供（本地 + 网页）

写培训 HTML 时，资料分两类：**本地**（本仓 / 兄弟仓文件）与 **网页**（外链文章）。  
本项目已有三套落点，**不要混成一种写法**。

| 资料类型 | 给 Agent / 作者用 | 进幻灯片怎么用 |
|----------|-------------------|----------------|
| 本地正文来源 | `docs/*.md`、代码仓路径 | 提炼进 slide；关键句旁加 `.cite-path` |
| 本地术语 | [glossary.md](glossary.md) | `.term` 悬停 |
| 网页精选 | 下文「资料清单」表 | Takeaway 页 `.ref-panel` 外链 |

权威示例：`docs/harness_training.html`（实践章 `.cite-path` + 末页 `.ref-panel`）。

---

## 推荐目录约定

```
docs/
  HARNESS_GUIDE.md              # （或）本课主内容源：本地叙事、命令、阶段说明
  sources.md                    # （可选）本课资料总表：本地路径 + 网页 URL
  assets/                       # 配图、截图（本地二进制）
  skills/tech-training-deck/
    glossary.md                 # 术语表（本地）
    sources.md                  # ← 本文：写法规范
```

**原则**

1. **网页链接只进清单 + 末页精选**，不要在每一页堆满 URL。  
2. **本地路径写相对路径 + 行号**，禁止只写「见某某系统」却无文件。  
3. **内网 / 私有仓路径**可写在 `sources.md` 给作者用；若要开源，公开页改成通用示例或删掉。  
4. 断网演示：`file://` 能打开本地图/视频；外链只需「有网时点开」，勿依赖 CDN 正文。

---

## 一、本地资料怎么提供

### 1. 内容源 Markdown（首选）

给写页 / Agent 的主输入，建议一份「课纲源」：

```markdown
# 课纲源 · XXX 培训

## 叙事目标
一句话。

## 章节大纲
1. …
2. …

## 必引本地文件
| 用途 | 路径 | 备注 |
|------|------|------|
| 进度约定 | `harness/core/paths.py` | STAGE_ORDER 约 L8 |
| 操作指南 | `docs/HARNESS_GUIDE.md` | S3 advance 约 L21 |
```

本仓已有：`docs/HARNESS_GUIDE.md`。新课可复制改名，例如 `docs/COURSE_SOURCE.md`。

### 2. 幻灯片内引用（观众看得见）

用 **短路径 + 行号**，class 为 `cite-path`：

```html
<span class="cite-path">harness/runner.py · L519</span>
<span class="cite-path">docs/HARNESS_GUIDE.md · L21</span>
```

规则：

- 路径相对**被讲解的那个代码仓**根（或本仓 `docs/`），不要写 `E:\...`。  
- 行号用 `· L12` 或 `· L12–L25`；改代码后要核对。  
- 一页 ≤ 若干条，服务口述，不是贴完整文件。

### 3. 徽章式本地入口（封面 / Takeaway）

适合「课后自己去翻」的目录级入口：

```html
<span class="badge">docs/HARNESS_GUIDE.md</span>
<span class="badge">harness/README.md</span>
```

### 4. 术语（本地词表）

缩写进 [glossary.md](glossary.md)，正文用悬停，勿用网页当术语定义主来源。

### 5. 配图 / 视频（本地二进制）

| 类型 | 放哪 | HTML |
|------|------|------|
| 示意图 | `docs/assets/*.png` | `<img src="assets/xxx.png">` |
| Demo 视频 | `docs/*.mp4` | 有文件再写 `src`；缺则用 `data-src` |

---

## 二、网页资料怎么提供

### 1. 先做「资料清单」表（给作者 / Agent）

建议放在课纲源或单独的 `docs/sources.md`（内容清单，不是本文规范）：

```markdown
## 网页参考

| 标签 | 标题 | URL | 用在哪一页 | 讲什么 |
|------|------|-----|------------|--------|
| OpenAI | Harness engineering | https://openai.com/index/harness-engineering/ | 为什么火了 / Takeaway | Codex 百万行案例 |
| Anthropic | Long-running harnesses | https://… | 为什么火了 | 角色分工与验收 |
```

填表时约定：

- **URL 必须可公开访问**（或注明「内网仅作者」）。  
- **用在哪一页**写 `data-title`，方便对页。  
- 摘要 1 行即可；细节进案例卡悬停，不进标题。

### 2. 进幻灯：只精选进 Takeaway 的 `.ref-panel`

```html
<aside class="ref-panel" aria-label="参考资料">
  <h3>参考资料（精选）</h3>
  <p class="ref-note">培训案例出处 · 点开外链深入阅读</p>
  <ul class="ref-list">
    <li>
      <a href="https://example.com/article" target="_blank" rel="noopener noreferrer">
        <span class="ref-org">机构名</span>
        <span class="ref-title">文章标题</span>
        <span class="ref-url">example.com/article</span>
      </a>
    </li>
  </ul>
</aside>
```

规则：

- 全课 **5～10 条** 精选即可，宁缺毋滥。  
- 必须：`target="_blank"` + `rel="noopener noreferrer"`。  
- `ref-url` 写可读域名路径（可无协议），`href` 写完整 `https://`。  
- 案例页（如「为什么火了」）用 `.case-card` + `.src` 写出处，**完整链接仍汇总到末页**。

### 3. 案例卡里的出处（网页摘要）

```html
<div class="src">openai.com/index/harness-engineering</div>
```

口述场次不依赖 hover；投影时要能讲清出处。

---

## 三、给 Agent 写页时的「投料」模板

新建一课前，把下面整段贴给 Agent（或存成 `docs/sources.md`）：

```markdown
# 本课资料投料

## 本地内容源
- 主源：docs/HARNESS_GUIDE.md（或 COURSE_SOURCE.md）
- 代码仓根：（相对路径约定，如 harness/ 、cases/…）
- 术语：docs/skills/tech-training-deck/glossary.md（按需增补）

## 本地必引（路径 · 行号）
| 概念 | 路径 | 行号 |
|------|------|------|
| … | … | L… |

## 网页精选（进 Takeaway ref-panel）
| org | title | url |
|-----|-------|-----|
| … | … | https://… |

## 网页 → 案例页映射
| data-title | 用哪几条网页 | 口述要点 |
|------------|--------------|----------|
| 为什么火了 | OpenAI, Cursor… | … |

## 不要放进公开页
- 内网地址、未脱敏客户名、绝对盘符路径
```

Agent 工作顺序建议：

1. 读本地主源 → 出大纲与 `data-title`  
2. 实践/代码页写 `.cite-path`  
3. 案例页写摘要 + `.src`  
4. 末页组装 `.ref-panel`  
5. 新缩写补 glossary  

---

## 四、对照：本仓现状

| 落点 | 文件 / 位置 |
|------|-------------|
| 本地主源 | `docs/HARNESS_GUIDE.md` |
| 本地行级引用 | 实践章表格 / Steps 上的 `.cite-path` |
| 网页精选 | `思考与行动` 页 `.ref-panel` |
| 网页案例 | `为什么火了` 页 `.case-card` + `.src` |
| 术语 | `docs/skills/tech-training-deck/glossary.md` |

---

## 五、检查清单

- [ ] 本地：主源 MD 存在，幻灯路径可打开 / 行号大致正确  
- [ ] 网页：清单 URL 可访问；末页精选与案例页出处一致  
- [ ] 无绝对盘符、无未授权内链进公开演示  
- [ ] `file://` 断网：本地图视频正常；外链失败不影响翻页  
- [ ] 导出 PPT：外链不必可点，但 `ref-url` 文字仍应可读  

---

## 与其它文档的关系

| 文档 | 职责 |
|------|------|
| [SKILL.md](SKILL.md) | 总规范与工作流 |
| [reference.md](reference.md) | 粒子、快捷键、主题、导出 |
| [glossary.md](glossary.md) | 术语定义 |
| **本文** | 本地 / 网页参考资料如何组织与落进 HTML |
