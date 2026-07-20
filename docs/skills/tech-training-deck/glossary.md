# 培训页术语词表（悬停解释）

生成/修改 `docs/*_training.html` 时：下列词出现在正文中，应能悬停显示解释。  
实现：`.term` + `#term-tip`，或 JS 按本表自动包裹。

| 术语 | 解释 |
|------|------|
| RAG | 检索增强生成（Retrieval-Augmented Generation）：先从知识库/文档检索相关片段，再交给模型作答，降低瞎编概率。 |
| CoT | 思维链（Chain of Thought）：要求模型一步步写出推理过程，再给出结论，提升复杂题正确率。 |
| Few-shot | 少样本示例：在提示里给 1～若干条「输入→输出」范例，让模型模仿格式与风格。 |
| MCP | Model Context Protocol：把终端、浏览器、数据库等能力以标准工具协议暴露给 Agent，统一调用方式。 |
| Lint | 静态检查门禁：用脚本自动校验产物格式/规范；不通过则阻断推进（本仓 lints/*.py）。 |
| Harness | 马具/驾驭层：围绕模型的工作环境 + 工作流程（规则、工具、编排、反馈、护栏），让 Agent 持续靠谱交付。 |
| Harness Engineering | 驾驭工程：把围绕模型的环境与流程系统化设计，而不是只调提示词。 |
| Skill | 可复用的 Agent 操作手册（SKILL.md）：告诉 AI 何时用、怎么做、边界是什么；仍需门禁强制才可靠。 |
| AGENTS.md | 项目级 Agent 说明书：技术栈、规范、禁止事项；宜做「目录」，细节放到 docs/ 按需加载。 |
| Delegate | 委派：由 Runner 把某一阶段任务交给 Cursor/Agent 生成产物，再经 Lint 验收。 |
| Progress | 进度落盘（如 progress.yaml）：记录各阶段状态与门禁结果，支持复跑与审计。 |
| Runner | 调度器：按阶段检查前置条件、触发 Delegate/执行器、跑门禁并写回 Progress。 |
| Stage | 工序阶段：把大任务切成 S0–S9 等小块，靠产物文件衔接，设计时在 STAGE_ORDER 中定义。 |
| Rules | 机读约束（YAML）：定义「什么算错」，专供 Lint 脚本读取与判定。 |
| Guides | 引导文档：教人/Agent「怎么写对」，对应本仓 Skill；不直接当机器门禁。 |
| Sensors | 传感器/质检层：Rules + Lint，把规范变成可自动判定的 pass/fail。 |
| Gate | 门禁状态：嵌在 progress 里；Lint 结果写 gate.status（pass/fail/expired）。 |
| Status | 阶段状态：如 done / pending / expired，表示该 Stage 是否完成。 |
| Next | Runner 的 --next：根据 progress 指出当前应处理的下一阶段。 |
| Advance | Runner 的 --advance：按门禁链推进当前阶段（可 Delegate → Lint → 写回）。 |
| CI | 持续集成：流水线里调用 Runner/Lint，把门禁嵌入自动化构建。 |
| gate | 门禁结果：通常含 pass/fail；PASS 才允许 advance 到下一阶段。 |
| Fragment | 可复用业务步骤片段：在 runnable 里引用，执行时由 run_case 展开。 |
| Preset | 预设参数包：把常用入参打包，口令里用「别名@preset」快速引用。 |
| Agent | 智能体：= 模型 + Harness。模型负责思考生成，Harness 负责环境、工具与流程约束。 |
| Prompt | 提示词：单次对话里给模型的指令与约束，是最内层技巧。 |
| Context | 上下文：在对的时机喂给模型的信息集合（规则、检索、记忆、压缩摘要等）。 |
| 幻读 | 模型声称已读某文件/文档，或编造不存在的 API、路径、结论——实际未读或读错。 |
| 幻觉 | Hallucination：模型一本正经地生成不实内容（假引用、假接口、假结果）。 |
| PRD | 产品需求文档：把目标拆成可勾选条目，供 Agent 循环执行直到清零（如 Ralph 模式）。 |
| GAIA | 面向 Agent 的基准评测集，常用来对比「同模型不同 Harness」的效果差异。 |
| Plan Mode | 先写计划再改代码的工作模式：降低一次改炸、范围失控的风险。 |
| worktree | Git 工作树：同一仓库的多份检出目录，便于 Agent 隔离改动、互不踩脚。 |
| offline | 离线推进：跳过在线委派（如 HARNESS_OFFLINE_ADVANCE=1），用本地/已有产物继续流水线。 |

## 增补约定

- 新缩写首次出现 → **先写入本表**，再写进 HTML/GLOSSARY 对象  
- 解释用中文，1～2 句，面向培训听众而非论文定义  
- 避免在 `code` / `pre` / 案例详情层重复自动包裹  
