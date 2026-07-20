# 一步步：MIT 开源 + 赞助 / 付费服务 —— 怎么上架

你的目标：

| 优先级 | 做法 |
|--------|------|
| 攒 star | **MIT**，个人公司都能放心用 |
| 收赞助 | [SPONSORS.md](./SPONSORS.md)（GitHub Sponsors / 爱发电 / 微信） |
| 收服务费 | [SERVICES.md](./SERVICES.md)（定制主题、代做课件、白标） |

仓库简介可写：

```text
Offline HTML training slides · MIT · AI-agent friendly · Sponsors welcome
```

---

## 第 0 步：你要自己准备的材料（赞助相关）

| # | 内容 | 怎么弄 | 填到哪里 |
|---|------|--------|----------|
| 1 | **GitHub Sponsors** | GitHub → Settings → Sponsors → 开通（可能要等审核） | `SPONSORS.md` 里的 sponsors 链接（默认已是 `xiaoyutoucom`） |
| 2 | **爱发电主页链接** | 在 afdian.com 注册并创建创作者主页，复制网址 | `SPONSORS.md` 表格「爱发电」一行 |
| 3 | **微信收款码 PNG** | 微信 → 收付款 → 二维码收款 → 保存图片 | 存为 `docs/assets/sponsors/wechat-qr.png` |
| 4 | （可选）档位金额 | 按你心理价改 Coffee / Backpack 等 | `SPONSORS.md` 档位表 |
| 5 | （可选）对公 / 发票说明 | 若公司要走对公，写一句「邮件沟通」即可 | 已写在 `SPONSORS.md` / `SERVICES.md` |

邮箱 `xiaoyutoucom@gmail.com` 已写进文档，一般不用再改。

**没有 1～3 也能先 push 开源**；赞助区会显示「待填写」，你补上后再改一版 README 即可。

---

## 第 1 步：GitHub 建空仓库

1. https://github.com/new  
2. Owner：`xiaoyutoucom`，名：`autohtml-ppt`  
3. **Public**  
4. **不要**勾选 README / .gitignore / license  
5. Create  

About 建议：

```text
Offline HTML training deck. MIT. Sponsors & paid customization welcome.
```

Topics：`html` `slides` `ppt` `training` `offline` `mit`

License 选择：**MIT License**（与仓库 `LICENSE` 一致）。

---

## 第 2 步：码云建空仓库

1. https://gitee.com/projects/new  
2. 名：`autohtml-ppt`，公开  
3. **不要**用 Readme 初始化  
4. 开源许可证选 **MIT**  
5. 创建  

---

## 第 3–4 步：推送

```powershell
cd E:\wence\autohtml-ppt
git branch -M main

git remote remove origin 2>$null
git remote add origin https://github.com/xiaoyutoucom/autohtml-ppt.git
git push -u origin main

git remote remove gitee 2>$null
git remote add gitee https://gitee.com/xiaoyutou_647/autohtml-ppt.git
git push -u gitee main
```

---

## 第 5 步：补齐赞助链接后

1. 编辑 `SPONSORS.md`，换成真实爱发电 URL  
2. 放入 `docs/assets/sponsors/wechat-qr.png`  
3. 确认 GitHub Sponsors 页面可打开  
4. `git add` → `commit` → `push` 两边  

---

## 第 6 步：发布后自检

- [ ] GitHub License 显示 MIT  
- [ ] README 有 Sponsors / 赞助入口  
- [ ] 没有「公司必须付费才能用」的表述  
- [ ] Clone 后能打开 `docs/harness_training.html`  

---

## 常见问题

**Q：MIT 了还能收费吗？**  
A：能。收的是**赞助**和**人工服务**（定制/代做/白标），不是「许可证费」。别人免费商用合法。

**Q：溯源指纹还要吗？**  
A：建议保留，便于品牌曝光；MIT 下别人可以去掉，白标可当付费服务卖。

**Q：推送太大失败？**  
A：仓库含视频约数十 MB，可重试或以后再上 Git LFS。
