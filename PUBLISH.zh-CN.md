# 发布到 GitHub + 码云：你还要做什么

目标：**源码公开（AGPL）+ 商业公司闭源使用收费（Commercial）**。

---

## 已在本仓库准备好的

- [x] 中英 README + GIF/截图  
- [x] `COMMERCIAL.md` 商业授权联系页  
- [x] `LICENSE`（AGPL-3.0 + 商业双许可前言）  
- [x] `CLA.md` / `CONTRIBUTING.md`（双许可收 PR 用）  
- [x] `THIRD_PARTY_NOTICES.md`  
- [x] 溯源指纹 `docs/deck/provenance.json`  
- [x] 多工具 `AGENTS.md`  

---

## 你还需要亲自完成的（按顺序）

### 1. 内容与素材过一遍（最重要）

| 检查项 | 说明 |
|--------|------|
| 演示视频 / BGM / 配图 | 作者确认可再分发（无版权争议）；培训配图为「小人」线稿（`docs/assets/*.png`） |
| 内部路径 / 客户名 / 未公开案例 | 删掉或打码；或拆「公开模板仓」+「私有内容仓」 |
| `config.json` 演讲人等 | 可改成通用默认值再发 |
| 大文件 | 视频很大时用 Git LFS，或 README 写「自行放置」 |

> 建议：公开仓保留**引擎 + Skill + 少量示例页**；完整 Harness 内训内容可留私有 fork。

### 2. 法务确认（若代码涉及公司职务作品）

- 确认你有权以个人名 **xiaoyutoucom** 开源，或改成公司版权主体  
- 双许可卖商用授权时，版权归属要写清楚（个人或公司）

### 3. 在 GitHub / 码云建空仓库

- GitHub：`https://github.com/xiaoyutoucom/autohtml-ppt`（不要勾选自动加 README，避免冲突）  
- Gitee：`https://gitee.com/xiaoyutou_647/autohtml-ppt`  
- 两边都选 **开源 / AGPL-3.0**（或自定义「见 LICENSE」）  
- 仓库简介可写：`Dual license: AGPL-3.0 OR Commercial — see COMMERCIAL.md`

### 4. 本地首次提交并推送

在项目根目录执行（PowerShell）：

```powershell
cd E:\wence\autohtml-ppt

git init
git add .
git status   # 确认没有 .env、客户视频、巨大 pptx

git commit -m "chore: initial public release of Tech Training Deck"

git branch -M main
git remote add origin https://github.com/xiaoyutoucom/autohtml-ppt.git
git remote add gitee https://gitee.com/xiaoyutou_647/autohtml-ppt.git

git push -u origin main
git push -u gitee main
```

之后改代码可：

```powershell
git push origin main
git push gitee main
```

### 5. 仓库设置（两边都做）

| 设置 | 建议 |
|------|------|
| Topics / 标签 | `html`, `slides`, `ppt`, `training`, `offline`, `agpl` |
| 网站 | README 顶部 badge 已指向仓库 |
| Issues | 开启 |
| 许可证字段 | AGPL-3.0（备注见 COMMERCIAL.md） |
| 码云「开源许可证」 | 选 AGPL 或其它并在说明里写双许可 |

### 6. 商业收费怎么落地（协议之外）

协议只保证「闭源用 AGPL 不方便」；钱要靠你卖许可：

1. 把 [COMMERCIAL.md](./COMMERCIAL.md) 里的邮箱保持有效  
2. 准备一页简单报价（可先按：年费 / 项目买断 / 白标加价）  
3. 有人询价后用合同约定：闭源使用权、是否去水印（指纹）、支持范围  
4. （可选）以后做「商业版去掉归属 / 加 license key」  
5. 接受外部 PR 前，确认对方签了 [CLA.md](./CLA.md)

### 7. 发布后自检

- [ ] 用无痕窗口打开 GitHub / Gitee README，GIF 能显示  
- [ ] Clone 新目录 → `start docs/harness_training.html` 能离线翻页  
- [ ] LICENSE / COMMERCIAL / CLA 链接可点  
- [ ] 搜指纹 `TTD-2026-XIAOYUTOUCOM` 能定位到你的页  

---

## 协议一句话

| 谁 | 怎么用 |
|----|--------|
| 个人 / 愿意开源衍生作品 | 免费，遵守 **AGPL-3.0** |
| 公司要闭源集成 / SaaS / 白标 | 写信买 **Commercial**（[COMMERCIAL.md](./COMMERCIAL.md)） |

不要只挂 MIT——无法靠协议要求公司付费。

---

## 需要我代做时可以说

- 「帮我 `git init` 并做首次 commit」（推送仍需你登录 GitHub/码云）  
- 「帮我拆一版不含内训内容的公开模板目录」  
- 「帮我写一版简单的商业授权合同草稿」（非正式法律意见）
