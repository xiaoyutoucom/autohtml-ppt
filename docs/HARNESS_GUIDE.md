# Web UI Harness 使用指南

## 设计

- **每产品线一份** `cases/<PRODUCT>/progress.yaml`
- **S7 Playwright Plan**：S6 后生成 `playwright_plan.json`，再 S8 实机执行
- **S8 共用** `tools/run_case.py`
- **Cursor 委派**：**S1–S8 已接入**；S9 后续逐步接入
- **全局 offline 开关**：`HARNESS_OFFLINE_ADVANCE=1`（无 per-stage 参数）

## Cursor 委派（S1 / S2）

| 变量 | 说明 |
|------|------|
| `CURSOR_API_KEY` | Cursor API 密钥（委派时必填） |
| `HARNESS_OFFLINE_ADVANCE=1` | 全局跳过 Cursor 委派 |
| `HARNESS_CURSOR_S1_MODEL` | 可选，默认 `composer-2` |
| `HARNESS_CURSOR_S2_MODEL` | 可选，默认同 S1 |
| `HARNESS_S2_DELEGATE_SELFTEST=1` | S2 自测：只构建 prompt，不调 Agent |

### S3 `--advance`

每次处理 **一个 ordinal**（`executed_trace` 下一格）：

1. `[SKIP]`/`[MANUAL]` → 自动 `skipped`
2. `[AUTO]` 且 action_map 已 resolve → 自动 `passed`
3. `[TODO-ACTION]`（或未 resolve 的 AUTO）→ **online** Cursor 写 `projects/<product>/actions/*.py` → `lint_action` → `passed`
4. 全部 ordinal satisfied 后再次 `--advance` → `s3_actions: done`

环境变量：`HARNESS_CURSOR_S3_MODEL`、`HARNESS_S3_FOCUS_ORDINAL`（runner 注入）、`HARNESS_S3_DELEGATE_SELFTEST=1`

| 变量 | 说明 |
|------|------|
| `HARNESS_CURSOR_S3_MODEL` | 可选 |
| `HARNESS_S3_STRICT_ORDER` | 默认 true（逐步推进） |

### S4 `--advance`

**前置**：`s3_actions` 须 `done`。

1. **online** → Cursor 按 `harness/skills/s4_action_map.md` 确认 `projects/<product>/action_maps/*.yaml`（删 `_draft`），并将 S3 已 passed 的 cleaned 步骤 `[TODO-ACTION]` → `[AUTO]`
2. Agent 跑 `lint s4_action_map` 通过后写 `reports/s4_delegate/<PRODUCT>/<case_id>.json`
3. Runner 消费 handoff → 再跑 lint → `s4_action_map: done`

环境变量：`HARNESS_CURSOR_S4_MODEL`、`HARNESS_S4_EXECUTED_TRACE_JSON`（runner 注入）、`HARNESS_S4_DELEGATE_SELFTEST=1`

**S4 不改 `actions/*.py`**，只确认映射与 cleaned 标记。

### S5 `--advance`

**前置**：S1–S4 须 `done`（S4 gate 指纹有效）。

1. **online** → Cursor 按 `harness/skills/s5_runnable.md` 生成 `cases/<PRODUCT>/runnable/<case_id>.yaml`
2. `lint s5_runnable` → `s5_runnable: done`

**steps 格式**：支持字符串口令（`"别名@preset"`）或对象 `{fragment: id, params: {...}}` / `{action: "...", params: {...}}`；fragment 须在 `cases/<PRODUCT>/fragments/registry.yaml` 注册。执行时由 `tools/run_case.py` 展开 fragment。

#### External Action（外部小工具，如 CT-MR.exe）

部分步骤不是浏览器操作（模拟外部 CT/MR 设备 DICOM 发图），通过 **无 `page` 形参** 的 action 函数 + `subprocess` 调外部 exe。

| 类型 | 函数签名 | runner 行为 |
|------|----------|-------------|
| Web | `def f(page: Page, **kwargs)` | 传 `page`，Playwright 驱动 |
| External | `def f(**kwargs)` | 不传 `page`，调外部工具 |

**CT-MR.exe CLI**（源码：`virtual_hospital_mock/CTMR/run.py`）：

```powershell
CT-MR.exe --cli batch_export `
  --patients_series_dir <患者数据根目录> `
  --patients_list <子目录名;分隔，空=全发> `
  --remote_node_aetitle <AC本地节点AE> `
  --remote_node_ip <AC主机IP> `
  --remote_node_port 104 `
  --local_ip <本机IP> `
  --local_port 0 `
  --export_type 1
```

- `CT-MR.db` 须与 `CT-MR.exe` 同目录
- exe 路径：`harness_settings.local.yaml` → `external_tools.ctmr_exe`，或 preset 字段 `ctmr_exe`
- 示例 action：`projects/accucontour/actions/receive.py`，口令 `外部设备传送CTMR图像@case_39268_receive`
- 失败策略：external 步骤 `returncode != 0` → 整 case 失败停住
- cleaned 标签：S3 保持 `[TODO-ACTION]`，S4 验证通过后改 `[AUTO]`（与 web action 相同）

**lint 前置**：要求 `s4_action_map: done` 且 `gate.maps_resolve_max_mtime` 未过期（老 case 缺指纹时 `--lint s5_runnable` 或 `--advance` 会自动补写并落盘）。

环境变量：`HARNESS_CURSOR_S5_MODEL`、`HARNESS_S5_DELEGATE_SELFTEST=1`

### S6 `--advance`

**前置**：`s5_runnable` 须 `done`，且 runnable 文件存在。

1. **online** → Cursor 按 `harness/skills/s6_validate.md` 运行 `lint_scenario_validate`，最多 **3 轮**修正 runnable / `action_maps` / fragment registry（每轮 `--note` 留痕）
2. `lint s6_validate` → `s6_validate: done`（runner 自动写审计 note）

**不启动浏览器**；与 S5 lint 共用规则，侧重 validate 循环与 map/fragment 微调。

环境变量：`HARNESS_CURSOR_S6_MODEL`、`HARNESS_S6_DELEGATE_SELFTEST=1`

### S7 `--advance`

**前置**：`s6_validate` 须 `done`。

1. **online** → Cursor 按 `harness/skills/s7_playwright_plan.md` 运行 `harness.playwright.plan`，生成 `reports/runs/<PRODUCT>/run_<case_id>_pw/playwright_plan.json`，并更新 progress 中 `s7_playwright_plan.run_id` / `file` 与 `s8_playwright_exec.run_id`
2. `lint s7_playwright_plan` → `s7_playwright_plan: done`

**不启动浏览器**；plan = 展开 runnable + 逐步 resolve 的可执行清单（供 S8 与审计使用）。`lint s7_playwright_plan` 会 **re-resolve** 每步口令并与 plan 比对（含 merged_params / preset），防止 map 变更后 plan 过期。

手工（offline）：

```bash
python -m harness.playwright.plan --product MIRA --case-id case_10001 --run-id run_case_10001_pw
python -m harness.runner --lint s7_playwright_plan --case case_10001 --product MIRA
python -m harness.runner --advance --case case_10001 --product MIRA
```

环境变量：`HARNESS_CURSOR_S7_MODEL`、`HARNESS_S7_DELEGATE_SELFTEST=1`

### S8 `--advance`

**前置**：`s7_playwright_plan` 须 `done`，且 `playwright_plan.json` 存在。

1. **默认**（`HARNESS_S8_MODE=deterministic`）→ `python -m harness.playwright.exec` 按 plan **启动浏览器**执行，写入 `step_checkpoint.json` / `summary.json`
2. **`HARNESS_S8_MODE=cursor`** → Cursor 按 `harness/skills/s8_playwright_exec.md` 执行上述命令
3. `lint s8_playwright_exec` → `s8_playwright_exec: done`

**offline**（`HARNESS_OFFLINE_ADVANCE=1`）：须先手工跑 exec，再 `--advance`。

```bash
python -m harness.playwright.exec --product ACCUCONTOUR --case-id case_39206 --run-id run_case_39206_pw
python -m harness.runner --lint s8_playwright_exec --case case_39206 --product ACCUCONTOUR
python -m harness.runner --advance --case case_39206 --product ACCUCONTOUR
```

环境变量：`HARNESS_S8_MODE`、`HARNESS_CURSOR_S8_MODEL`、`HARNESS_S8_DELEGATE_SELFTEST=1`

### S3 运维门禁（P1/P2 + 建议补）

- **abnormal note 阻塞**：progress 中存在未结案的 `inspect_pending`/`blocker` note（同 action_file）时，S3 lint 直接 FAIL；Playwright 同 ordinal 重试除外。结案：`--note --stage s3_actions --type fix --msg "已处理；action_file=..."`
- **Playwright 失败自动 note**：单步 Playwright 校验 FAIL 时（`HARNESS_S3_PLAYWRIGHT_VALIDATE_STRICT=1`，默认开启）自动写入 blocker note，无需手工 `--note`
- **storage_state 加速**（默认开启）：S3 Playwright 成功后保存 `reports/s3_playwright/<case_id>/session.json`；下一格 advance 加载登录态并**跳过 prefix 重放**（`HARNESS_S3_PLAYWRIGHT_SAVE_STORAGE_STATE=0` 可关）
- **fingerprint Δ lint**：Codegen advance 只对本轮变更的 `projects/<product>/actions/*.py`（Δ ∪ 显式 `--file`）做 lint，避免全量扫描
- **delegate handoff**：Agent lint PASS 后写 `reports/s3_delegate/<case_id>.json`（`executed_trace`）；runner consume 后合并进 progress 并删除回传文件

**门禁指纹（P0）**：S4 lint PASS 时写入 `gate.maps_resolve_max_mtime`（action_map 分片 max mtime）。之后若改映射再进 S5，harness 会提示指纹过期并自动重跑 S4 lint。**老 case 缺指纹**：`--advance` 前自动补写当前指纹（不触发 lint）。

**前置 gate 链**：每次 `--advance`（除 s0）会检查更早阶段的 `status=done` 且 `gate.status=pass`。

**advance 日志（P3）**：主目录 `reports/advance/<PRODUCT>/<case_id>/`（`latest.log` + 带时间戳会话 log）；若 progress 已有 S7/S8 `run_id`，会镜像到 `reports/runs/<PRODUCT>/<run_id>/logs/`（`advance_<ts>.log`）。S8 执行细节写入 `logs/s8_playwright_exec.log`。设 `HARNESS_ADVANCE_LOG=0` 关闭 advance 主日志；`HARNESS_ADVANCE_LOG_MIRROR=0` 关闭 run 镜像。

**S8 失败结案（P0）**：lint 未 PASS 但已有 `step_checkpoint.json`（含 steps）时，advance 仍写 **`s8_playwright_exec.status=done` + `gate.fail`**，并记录 `result` / `last_failed_ordinal`；**再次 `--advance`** 进入 S9。

**S9 报告回填（P1）**：默认 `HARNESS_S9_MODE=deterministic` → `apply_s8_checkpoint_to_report` 更新 `summary.json` + `report.html`；S7 plan 后会 seed `summary.json` 骨架。手工：

```bash
python -m tools.reporting.apply_s8_checkpoint --product ACCUCONTOUR --run-id run_case_39206_pw
python -m harness.runner --advance --case case_39206 --product ACCUCONTOUR
```

S9 lint 检查 `report.html` 与 summary/checkpoint 一致性；`stages.s9_report.result` 由 `infer_s9_report_result` 盖章。

批量统计：`python -m harness.runner --report --product <PRODUCT>`（`--blockers-only` 仅 blocker）。

**批量 S8 执行**（`tools/batch_s8` 或 `tools/batch_s8_pw`，二者等价）：

```bash
# 与 autotest 命令名对齐（本仓库须加 --product）
python -m tools.batch_s8 --product ACCUCONTOUR --discover-from-progress --report

# 从 progress 自动发现 S7 done 用例，写 manifest 并开跑
python -m tools.batch_s8_pw --product ACCUCONTOUR --discover-from-progress --report

# 仅跑 s8 尚未 done 的用例
python -m tools.batch_s8_pw --product ACCUCONTOUR --discover-from-progress --s8-pending-only --report

# 使用 manifest 或命令行列队
python -m tools.batch_s8_pw --product ACCUCONTOUR --manifest cases/ACCUCONTOUR/batch_s8_manifest.yaml --report
python -m tools.batch_s8_pw --product ACCUCONTOUR --case case_39206:run_case_39206_pw --report

# 全量重跑 / 无头
python -m tools.batch_s8_pw --product ACCUCONTOUR --manifest cases/ACCUCONTOUR/batch_s8_manifest.yaml --reset --headless --report
```

汇总产物：`reports/batches/<PRODUCT>/<batch_id>/batch.log`、`batch_summary.json`、`batch_index.html`。

S8 结束后默认 auto-apply report（`HARNESS_S8_AUTO_APPLY_REPORT=0` 可关）；batch 仍会显式调用 `apply_s8_checkpoint` 保证报告一致。

**P3 运维**：`python tools/serve_report.py` HTTP 分享报告；S8 重跑前 `python -m tools.reporting.s8_run_reset` 或 `exec --reset`；`HARNESS_S9_MODE=cursor` 启用 Cursor S9 委派。

**集成自测**：`python harness/testing/selftest_advance_work.py`

## Git 与源码 Impact

对标 autotest：**不自动 git commit**；Git 用于源码 diff 影响分析与提交规范。

### 本机路径覆盖

复制 `harness/config/harness_settings.local.yaml.example` → `harness_settings.local.yaml`（已在 `.gitignore`），覆盖各产品线 `source_root`。

### 源码影响扫描

```bash
# 扫描 ACCUCONTOUR 对应源码仓（accucontour_web_demo）
python -m tools.impact.scan --product ACCUCONTOUR --write-index

# pull 前预警（本地 HEAD vs origin）
python -m tools.impact.scan --product MIRA --compare pending_remote --fetch

# 查看基准与建议重跑（不执行扫描）
python -m harness.runner --impact-hint --product ACCUCONTOUR
```

产物：`reports/impact/<scan_id>/impact_report.html`、`validation_commands.txt`；基准 `reports/impact/baseline.yaml`（可纳入 Git）。

指定 `--product` 时，**仅匹配该产品线** `projects/<product>/actions/*.py`（避免其他产品线 token 误撞）。

**用例反查（referenced_cases）**：从 `cases/<PRODUCT>/runnable/*.yaml` 的 `steps` 解析 `别名@preset`，经 `action_map`（含 `includes` 分片）映射到 `projects/<product>/actions/*.py`，报告中列出受影响的 case。

#### action 文档头声明

每个 action `.py` 文件头用注释声明它测试的源码组件：

```python
"""AccuContour：新增本地节点。

source_component_path: src/components/dataTransferSetting/index.vue
source_related_paths: src/components/common/AddNodeDialog.vue, src/shared/aeTable.vue
action_id: accucontour.node.node.add_local_node
"""
```

| 字段 | 含义 |
|------|------|
| `source_component_path` | 主组件路径（必填） |
| `source_related_paths` | 额外关联组件（逗号或 YAML 列表，可选） |
| `action_id` | 动作唯一 ID |

**关联源集自动展开**：即使不写 `source_related_paths`，扫描时也会自动合并：
1. 作者声明的 `source_related_paths`
2. 主组件**同目录**兄弟 `*.vue` / `*.ts`
3. 解析主组件 vue 内的 `import ... from '...vue'`（一层）

因此 action 实际涉及多个组件时，只要主组件能 import 到它们，无需手动声明也能命中。

#### 三层判定逻辑

```text
L1 直接命中（高置信 → fix_yaml）
  diff 任一文件 ∈ 关联源集（主源 + 声明 + 同目录兄弟 + import 展开）
  → rerun_scope=flow，复跑该 action 全部引用 case

L2 同组件 token 细化（L1 命中后 → 定位要素）
  只从 L1 命中文件抽 token，与 action selector/文案做词边界匹配
  → rerun_scope=element，仅复跑用到命中字段 preset 的 case
  命中 token 仍出现在 selector 中 → aligns_yaml（先复跑验证）

L3 跨文件长文案安全网（L1 未命中 → 兜底）
  diff 出现 ≥6 字符业务专有串（如"新增本地节点"）且全等命中 action 可见文案
  → aligns_yaml，建议复跑
  其余跨文件短词（set/title/list 等）→ 默认 ignore，不进报告
```

**噪音过滤**：token 提取时跳过 `public/`、`dist/`、`*.min.js` 等打包产物；单行 > 500 字符的压缩代码跳过；长度 < 5 或 ASCII 短词（`set`/`name`/`title`/`list`/`head` 等）、JS 关键字全部过滤。匹配改为**词边界**（`set` 不再命中 `.setting_wrap`），杜绝字母级误撞。

**富索引（action_dependency_index）**：从 Playwright `.py`（selector/role/fallback）与 `action_map` preset 参数提取 `ui_fingerprints`，并记录 `ui_fingerprint_locations`（来源 preset/selector）、`aliases`、`last_verified`（progress 中 S8 状态）。构建命令：

```bash
python -m tools.impact.build_action_dependency_index
# 或扫描时一并写入
python -m tools.impact.scan --product ACCUCONTOUR --write-index
```

产物：`reports/impact/index/action_dependency_index.json`（富索引）与 `action_index.json`（扁平兼容）。

**处置建议（advice）**：

| advice_action | 含义 | 触发条件 |
|---------------|------|----------|
| `fix_yaml` | 建议改 Action | L1：关联组件文件有源码变更 |
| `aligns_yaml` | 不用改 Action，仅复跑验证 | L2：token 仍被 selector 覆盖；或 L3：跨文件长文案命中 |
| `ignore` | 可先忽略 | 命中多为通用 UI 文案/短词，疑似误撞 |
| `review` | 建议人工核对 | token 与 selector 关系不明确 |

**建议复跑最小集（P1）**：扫描时按 `action_elements`（函数级 DOM/label/field 要素）反推——`rerun_scope=flow` 复跑全部引用 case；`rerun_scope=element` 仅复跑使用该要素 preset 字段的 case。报告卡片展示「受影响要素」与 `rerun_scope`。

### progress 损坏恢复

`progress.yaml` UTF-8 解码失败时，runner 会提示：

```bash
git fetch origin && git checkout origin/<branch> -- cases/<PRODUCT>/progress.yaml
```

### S1 `--advance`

`Cursor 写 cleaned` → `lint_cleaned` → 更新 progress。

Web 清洗基线：**首步固定 `[AUTO] \`登录@admin\``**。

### S2 `--advance`

1. 读 cleaned：若无 `[场景片段]` / `见场景片段` → **自动 skip**（写 `gate(pass, cmd=skip_s2_fragments)` + note）
2. 若有 fragment 引用 + online → Cursor 写 `cases/<PRODUCT>/fragments/*.yaml`、更新 registry、展开 cleaned
3. `lint s2_fragments` → 写 gate；若有未 resolve 的 fragment 步骤，自动 note `未落地口令=...`

手工跳过（与 auto-skip 留痕一致）：

```bash
python -m harness.runner --skip-s2 --case case_XXXXX --product MIRA \
  --msg "S2 跳过：本用例无 fragment 需求"
```

## 常用命令

```bash
python -m harness.ingest.parse_zentao --product MIRA \
  --source cases/MIRA/zentao-scene-cases-all-branch229.md \
  --output cases/MIRA/progress.yaml
python -m harness.ingest.migrate_progress --product MIRA
python -m harness.runner --status --product MIRA
python -m harness.runner --next --case case_10001 --product MIRA
python -m harness.runner --lint s1_cleaned --case case_10001 --product MIRA
python -m harness.runner --advance --case case_10001 --product MIRA
python -m harness.runner --report --product MIRA
python -m harness.runner --report --product MIRA --blockers-only
python -m tools.batch_s8 --product MIRA --discover-from-progress --report
python -m tools.impact.scan --product MIRA --write-index
python -m harness.runner --impact-hint --product MIRA
python -m harness.runner --lint s2_fragments --case case_10001 --product MIRA
python -m harness.runner --skip-s2 --case case_10001 --product MIRA
python -m harness.playwright.exec --product MIRA --case-id case_10001
pytest
```

## 阶段产物

| 阶段 | 产物 |
|------|------|
| S1 | `cases/<PRODUCT>/cleaned/*.md` |
| S2 | `cases/<PRODUCT>/fragments/*.yaml` + `registry.yaml` |
| S3 | `projects/<product>/actions/*.py` |
| S4 | `projects/<product>/action_maps/*.yaml` |
| S5 | `cases/<PRODUCT>/runnable/*.yaml` |
| S8 | `reports/runs/<run_id>/step_checkpoint.json` |
| S9 | `reports/runs/<run_id>/report.html` + 更新后的 `summary.json` |

## S2 留痕（progress.yaml）

| 场景 | gate.cmd | notes |
|------|----------|-------|
| 无 fragment，auto-skip / `--skip-s2` | `skip_s2_fragments` | `fix` 类型说明跳过原因 |
| lint PASS，步骤尚未登记 action_map | `python -m harness.runner --lint s2_fragments ...` | `lint_warn:`、`未落地口令=...`（不阻塞） |

## 后续计划

- S8–S9 Cursor 委派（沿用同一 `HARNESS_OFFLINE_ADVANCE` 开关）
- S3 Playwright `storage_state` 加速（Phase 2，默认关闭）
