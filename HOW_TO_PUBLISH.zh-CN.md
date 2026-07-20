# 一步步：个人免费 · 公司/商用收费 —— 怎么开源上架

你的目标（已按此写好 `LICENSE`）：

| 用户 | 费用 |
|------|------|
| 个人，非商业 | 免费 |
| 公司 / 组织，或任何商用 | 付费授权 |

> 说明：这叫「源码公开 + 双许可」，**不是** MIT 那种「谁都能免费商用」。仓库简介可写 *Source available · Personal free · Commercial license required*。

本地代码已提交过；下面按顺序做即可。

---

## 第 0 步：心里对齐（1 分钟）

- 免费对象 = **自然人个人**非商业用途  
- 收费对象 = **公司/组织**使用，以及一切**商用**（卖课、SaaS、嵌入产品、白标、对外交付）  
- 询价邮箱：`xiaoyutoucom@gmail.com`（`COMMERCIAL.md`）

---

## 第 1 步：在 GitHub 建空仓库

1. 打开 https://github.com/new  
2. Owner 选你的账号 `xiaoyutoucom`  
3. Repository name：`autohtml-ppt`  
4. **Public**  
5. **不要**勾选 Add README / Add .gitignore / Choose license（本地已有，勾了易冲突）  
6. Create repository  

仓库地址应为：`https://github.com/xiaoyutoucom/autohtml-ppt`

About（可稍后填）：

```text
Source-available HTML training deck. Personal use free; company & commercial use require a paid license.
```

Topics 建议：`html` `slides` `ppt` `training` `offline` `dual-license`

---

## 第 2 步：在码云 Gitee 建空仓库

1. 打开 https://gitee.com/projects/new  
2. 归属：`xiaoyutou_647`  
3. 仓库名：`autohtml-ppt`  
4. **公开**  
5. **不要**勾选「使用 Readme 文件初始化」等  
6. 开源许可证：选「其他」或备注见仓库 `LICENSE`（个人免费 / 商用收费）  
7. 创建  

仓库地址应为：`https://gitee.com/xiaoyutou_647/autohtml-ppt`

---

## 第 3 步：本地推送到 GitHub

在 PowerShell：

```powershell
cd E:\wence\autohtml-ppt

# 若还没有把分支改成 main：
git branch -M main

# 添加 GitHub 远程（若已添加过会报错，可忽略或先 git remote -v 查看）
git remote remove origin 2>$null
git remote add origin https://github.com/xiaoyutoucom/autohtml-ppt.git

git push -u origin main
```

浏览器登录 GitHub 账号，按提示授权即可。  
推送成功后打开：https://github.com/xiaoyutoucom/autohtml-ppt  

---

## 第 4 步：本地推送到码云

```powershell
cd E:\wence\autohtml-ppt

git remote remove gitee 2>$null
git remote add gitee https://gitee.com/xiaoyutou_647/autohtml-ppt.git

git push -u gitee main
```

登录码云账号完成推送。  
打开：https://gitee.com/xiaoyutou_647/autohtml-ppt  

以后改完代码：

```powershell
git add .
git commit -m "你的说明"
git push origin main
git push gitee main
```

---

## 第 5 步：仓库页面设置（两边都做）

| 设置 | 建议 |
|------|------|
| 简介 / Description | Personal free · Company/commercial paid · see LICENSE |
| 网站 | 可填 GitHub 或个人主页 |
| Issues | 开启 |
| LICENSE 展示 | 指向根目录 `LICENSE`（不要选 MIT） |
| README | 确认 GIF/截图能显示 |

码云若强制选 OSI 许可证：选「其他」，说明见 `LICENSE`。

---

## 第 6 步：商业收费怎么落地（协议之外）

协议只写清「谁要付钱」；钱要靠你成交：

1. 保持 `xiaoyutoucom@gmail.com` 可收信  
2. 先定一档简单报价（可改），例如：  
   - 公司内部培训授权：¥X / 年  
   - 嵌入产品 / SaaS：¥Y 买断或年费  
   - 白标（去指纹）：再加价  
3. 有人邮件询价 → 确认用途 → 发报价 → 签简单授权合同（电子签即可）→ 收款 → 发授权确认函（写明公司名、范围、期限）  
4. 接受外部 PR 前，要求对方签 `CLA.md`（否则你不好继续卖商用授权）

> 合同模板若需要，可另找律师审一下；本仓库不提供正式法律意见。

---

## 第 7 步：发布后自检

- [ ] GitHub / 码云 README 打开正常，GIF 能出  
- [ ] `LICENSE` 写明：个人免费；公司/商用收费  
- [ ] `COMMERCIAL.md` 邮箱正确  
- [ ] Clone 新目录能打开 `docs/harness_training.html`  
- [ ] 视频、音乐能播  

---

## 常见问题

**Q：这算「开源」吗？**  
A：源码公开、可学习可贡献；但**不是** MIT 那种完全免费商用。对外可说「源码公开 / Source available，个人免费，商用需授权」。

**Q：为什么不用 AGPL？**  
A：AGPL 下公司只要愿意开源衍生作品，仍可能免费用，和你「公司都要收费」的目标不一致，所以已改成个人非商业免费 + 商业授权。

**Q：个人用公司电脑算个人还是公司？**  
A：若用途属于公司工作/培训，按**公司使用**处理，需商业授权。

**Q：推送太大失败？**  
A：仓库含视频约数十 MB。可重试；仍失败再考虑 Git LFS 或减小视频。

---

## 你现在立刻要做的三件事

1. GitHub 建空仓 `autohtml-ppt`  
2. 码云建空仓 `autohtml-ppt`  
3. 运行上面第 3、4 步的 `git push`  

做完把两个仓库链接发给我，我可以帮你看 README / LICENSE 展示是否正常。
