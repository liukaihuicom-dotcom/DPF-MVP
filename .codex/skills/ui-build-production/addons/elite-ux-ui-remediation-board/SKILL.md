---
name: elite-ux-ui-remediation-board
description: 当任务涉及全球顶尖级 UX/UI 审核、App UI 质量低、页面像 demo、金融 App 视觉可信感不足、用户心理学、真实使用场景、UI 修改依据、可直接执行的整改方案、Design Token / Component / Pattern 级修复、Redline Report、Fix Card、100 分 L5 门禁时使用。本 Skill 不只是审核，而是把问题转化为不可模糊、可直接执行、可回归验证的 UI/UX 修复任务。
---

# Elite UX/UI Remediation Board Skill v4.0.0-L5 中文版

> 文件路径：`.codex/skills/ui-build-production/addons/elite-ux-ui-remediation-board/SKILL.md`
> 版本：`v4.0.0-L5 / UI Remediation Execution Gate`
> 等级：`Elite Global UX/UI Remediation Board / 100-Point L5 Product Experience Gate`
> 替代：`Senior UX/UI Design Review Agent Team v1.0.0`、`Global Product Design Review Board v2.0.0`、`Elite Product Experience Review Board v3.0.0`
> 目标：不仅审核 App / Web / H5 / Admin 产品设计是否达到 L5，而且必须明确 **UI 修改依据、修复层级、执行路径、资产文件、验收标准、回归方法**。所有 UI 问题必须转成可直接执行的修复任务；任何模糊建议无效。
> L5 标准：**100/100 且 0 Blocker / 0 Critical / 0 Major，才允许 `l5_ready`。**

---

## 0. 为什么 v3 仍然不够

v3 有用户心理、场景、100 分门禁，但仍然缺少真正能提升 UI 的执行层：

| 缺口 | 为什么不够 |
|---|---|
| UI 修复依据不够明确 | Codex 知道哪里扣分，但不知道按什么标准具体改 UI |
| 缺少 UI Remediation Playbook | 没有把问题映射到 token / component / pattern / page 层 |
| 缺少高效优化顺序 | 容易逐页修补，而不是系统层一次修复 |
| 缺少视觉工程执行法 | 没有明确 Typography、Spacing、Surface、CTA、Form、Data、Dialog 怎么改 |
| 缺少可执行任务卡 | Redline 还不够工程化，不能直接变成 Codex 任务 |
| 缺少验收断言 | 修完后没有足够明确的“怎样才算修对” |
| 缺少批量治理策略 | 无法快速提高全站 UI，而是慢慢单页改 |

v4 的核心变化：

```text
Review Board
→ Evidence
→ User Psychology
→ Scenario Simulation
→ Root Cause Layer
→ UI Remediation Recipe
→ Executable Fix Card
→ Asset-level Patch
→ Regression Test
→ 100-Point Gate
```

---

## 1. 本 Skill 的硬定位

本 Skill 不是“评审清单”。
本 Skill 是 **顶尖 UX/UI 修复委员会**。

它必须做到：

```text
发现问题
判断根因
确定修改依据
决定修复层级
给出精确修改方案
指定文件 / 资产 / Pattern
输出验收标准
执行回归验证
裁决是否 100 分
```

它禁止输出：

```text
建议提升高级感
优化视觉层级
适当增加留白
按钮更突出
文案更专业
可以参考金融产品
整体更统一
```

它必须输出：

```text
把哪个区域改成什么结构
使用哪个 token
替换成哪个组件
抽成哪个 Pattern
调整哪个信息层级
使用哪个 copy key
使用哪个 icon key
修改哪个文件
如何验收
```

---

## 2. 顶尖团队真实工作方式

全球顶尖团队不会只说“好不好看”。他们会问：

```text
用户在什么心理状态下进入这个页面？
用户真正要完成什么任务？
页面是否让用户少想一步？
风险是否被正确看到？
视觉焦点是否服务任务？
操作是否降低焦虑？
失败后是否能恢复？
页面是否能被系统资产长期维护？
开发是否能无二次设计直接实现？
```

所以，本 Skill 审核不是以“页面”为中心，而是以：

```text
用户心理
+ 任务场景
+ 决策压力
+ 金融风险
+ 信息层级
+ 视觉执行
+ 公共资源
+ 工程交付
```

为中心。

---

## 3. Review Board 角色

| 角色 | 负责问题 | 否决权 |
|---|---|---:|
| Chief Product Experience Officer | 最终 L5 裁决 | 是 |
| Behavioral UX Psychologist | 用户心理、焦虑、信任、认知负荷 | 是 |
| Principal UX Architect | 任务路径、状态机、错误恢复 | 是 |
| UI Craft Director | 视觉构图、排版、密度、层级、表面 | 是 |
| Financial Trust Director | 资金、KYC、风险、账户安全感 | 是 |
| Design System Governor | token / component / pattern / public resource | 是 |
| Remediation Lead | 将问题转成可执行修复卡 | 是 |
| Content & Localization Director | 英文、印尼语、CTA、错误、风险文案 | 条件否决 |
| Icon & Asset Director | 本地图标、插图、资产一致性 | 条件否决 |
| Engineering Handoff Lead | 文件、依赖、API、状态、QA、交付 | 是 |

---

## 4. 必须输入证据

缺少证据，不允许审核通过。

| 证据 | 用途 |
|---|---|
| 页面截图 / Visual Snapshot | 判断真实视觉结果 |
| 页面代码 | 判断是否 hardcode、复制、未引用公共资源 |
| Page Contract | 判断页面目标和业务规则 |
| Product Design Intent | 判断产品气质 |
| Visual DNA | 判断视觉语言 |
| Golden Page / Golden Pattern | 判断质量基准 |
| tokens / component-manifest / pattern-registry | 判断系统一致性 |
| public-asset-registry / asset-dependency-graph | 判断公共资源引用 |
| icon-registry | 判断图标来源 |
| copy-table / i18n keys | 判断文案治理 |
| State Matrix | 判断状态完整性 |
| Interaction Map | 判断任务路径 |
| Handoff package | 判断能否交付开发 |

缺失任何关键证据：

```text
Final Decision = blocked
Reason = missing_evidence
```

---

## 5. UI 修改依据体系

每一个 UI 修改必须至少命中一种依据。

| 修改依据 | 说明 | 示例 |
|---|---|---|
| User Psychology | 用户心理压力、焦虑、信任、认知负荷 | 出金页必须强化到账、失败恢复和审核状态 |
| Scenario Task | 用户实际任务路径 | 入金页主视觉必须服务金额输入 |
| Information Hierarchy | 信息优先级 | 金额 > 状态 > 说明 > 次操作 |
| Financial Trust | 金融可信感 | 风险提示不能被浅灰小字隐藏 |
| Visual Craft | 构图、排版、留白、密度、表面 | 卡片不能过度堆叠和廉价阴影 |
| Design System | token / component / pattern | 页面不能自造 button/card |
| Public Resource | 公共资产复用和同步 | 重复弹框必须抽为 Dialog Pattern |
| Accessibility | 可读性、对比度、触控 | 金融状态不能只靠颜色表达 |
| Localization | 英文/印尼语长度、术语 | 文案变长不得破版 |
| Engineering Handoff | 可实现、可测试、可维护 | 修改必须能落到文件和组件 |

没有修改依据的 UI 建议无效。

---

## 6. 用户心理模型

### 6.1 必须模拟的心理状态

| 心理状态 | 页面场景 | 设计要求 |
|---|---|---|
| 不确定 | 注册、开户、KYC | 解释为什么、下一步是什么、资料是否安全 |
| 资金焦虑 | 入金、出金、转账 | 金额、费用、到账、失败路径必须清楚 |
| 风险敏感 | 杠杆、协议、风险披露 | 风险必须可见、可理解、可确认 |
| 时间压力 | 快速入金、查看账户 | 主任务路径必须短，干扰信息少 |
| 错误挫败 | 驳回、失败、网络错误 | 原因 + 恢复路径 + 可操作入口 |
| 信任建立 | 钱包、账户、KYC 状态 | 专业、稳定、可追踪、可验证 |
| 经营压力 | Partner、返佣、下级 | 数据层级清晰，下一步动作明确 |
| 多语言理解压力 | 英文 / 印尼语用户 | 文案自然，长文本不破版 |
| 安全敏感 | PIN、OTP、设备、身份验证 | 强安全感，但不制造恐慌 |

### 6.2 页面必须回答的心理问题

每个核心页面必须回答：

```text
我现在在哪里？
我接下来应该做什么？
为什么我要做这一步？
这是否安全？
失败了怎么办？
这会影响我的钱吗？
我什么时候能看到结果？
我能否撤销或恢复？
```

回答不清楚，不能满分。

---

## 7. 高效 UI 优化执行策略

### 7.1 不允许逐页盲改

发现问题后先判断根因层级：

| 问题 | 修复层级 |
|---|---|
| 多页面颜色 / 间距不统一 | Token |
| 多页面按钮 / 卡片不统一 | Component |
| 多页面布局重复 | Pattern |
| 多页面弹框重复 | Dialog Pattern |
| 图标质量低 | Icon Registry / Local Icon Skill |
| 文案不专业 | Copy / i18n |
| 状态缺失 | State Pattern / UX Gate |
| 单页特殊问题 | Page-level |

规则：

```text
如果同类问题影响 2 个以上页面，禁止单页修补，必须回到系统资产层修复。
```

### 7.2 优化优先级

| 优先级 | 处理对象 |
|---|---|
| P0 | 阻断任务、金融风险、公共资源断裂、状态缺失 |
| P1 | 主页面视觉层级、金额输入、KYC、出入金、钱包首页 |
| P2 | 重复组件、弹框、列表、表单 |
| P3 | 局部间距、细节文案、微图标调整 |

### 7.3 快速提升 UI 的正确路径

```text
1. 先选 1-3 个 Golden Page
2. 将 Golden Page 抽成 Pattern
3. 从 token / component / pattern 层修复重复问题
4. 再迁移普通页面引用公共资源
5. 最后做页面级微调
```

禁止：

```text
一个页面一个页面调颜色、圆角、阴影、卡片。
```

---

## 8. UI Remediation Recipes

### 8.1 金额输入区修复

适用：Deposit、Withdrawal、Transfer、Wallet。

| 问题 | 直接修复 |
|---|---|
| 金额不突出 | 抽成 `FinancialAmountInputPattern` |
| 币种不清楚 | 金额右侧固定 Currency Selector / Badge |
| 余额不清楚 | 输入区下方显示 Available / Frozen / Processing |
| 风险说明太弱 | 输入区下方保留 Risk Helper，不隐藏 |
| CTA 混乱 | 主 CTA 固定一个，其他操作降级 |

验收：

```text
金额区必须是页面主视觉焦点。
用户不滚动即可知道：输入金额、币种、余额、下一步。
```

---

### 8.2 金融卡片修复

适用：Wallet Card、Trading Account Card、KYC Status Card。

| 问题 | 直接修复 |
|---|---|
| 卡片堆叠混乱 | 抽成 `FinancialSummaryCard` |
| 信息权重乱 | 主数据 1 个，辅助数据最多 3 个 |
| 阴影廉价 | 使用 surface token，不使用随机 shadow |
| 状态不清楚 | 状态 badge + 文案，不能只靠颜色 |
| 操作太多 | 卡片最多 1 个主操作 + 2 个次操作 |

验收：

```text
用户 3 秒内知道卡片表达什么、状态是什么、可做什么。
```

---

### 8.3 表单修复

适用：KYC、Add Bank、Profile、Security。

| 问题 | 直接修复 |
|---|---|
| 字段过多 | 分组：Identity / Contact / Document / Security |
| 错误远离字段 | 错误必须贴近字段 |
| Placeholder 当说明 | 改为 label + helper text |
| 必填不清楚 | 必填标识 + 提交前校验 |
| 规则不清楚 | helper text 显示格式/限制/原因 |

验收：

```text
用户不用猜字段含义，不提交也能知道规则。
```

---

### 8.4 弹框修复

适用：Confirm、Risk Warning、KYC Required、Exit Agreement。

| 问题 | 直接修复 |
|---|---|
| 标题泛 | 标题必须说明后果 |
| 风险弱 | 风险正文必须在主按钮之前 |
| 按钮不清楚 | 主按钮描述结果，次按钮描述取消 |
| 危险操作无确认 | 增加二次确认或清晰后果 |
| 弹框样式乱 | 抽成 `RiskDecisionDialogPattern` |

验收：

```text
用户关闭或确认前必须知道后果。
```

---

### 8.5 列表修复

适用：Transaction List、Account List、Sub-IB List、Audit Log。

| 问题 | 直接修复 |
|---|---|
| 列表项信息散 | 主信息左上，状态右上，金额右侧 |
| 状态难扫 | 状态 badge 统一 |
| 时间/币种不清楚 | 统一 metadata row |
| 空状态无动作 | Empty State 必须有原因 + 下一步 |
| 筛选难用 | 高密度列表必须有 Filter Pattern |

验收：

```text
用户能快速扫出状态、金额、时间、下一步。
```

---

### 8.6 导航修复

| 问题 | 直接修复 |
|---|---|
| 当前页不明显 | active icon + label + token |
| 图标风格不一 | 全部从 icon-registry 调用 |
| 入口太多 | 合并低频入口到 More / Profile |
| Partner/Trader 混乱 | 角色入口分区明确 |
| 页面标题重复 | App bar 与页面主标题职责分离 |

验收：

```text
用户知道当前位置、角色入口、下一步去哪里。
```

---

## 9. 100 分评分体系

| 维度 | 分值 |
|---|---:|
| User Psychology Fit | 10 |
| Scenario Task Success | 10 |
| UX Architecture | 10 |
| Interaction Precision | 8 |
| Visual UI Craft | 12 |
| Financial Trust | 10 |
| Design System Compliance | 10 |
| Public Resource Compliance | 8 |
| Content & Localization | 8 |
| Icon & Illustration Quality | 5 |
| Accessibility Baseline | 4 |
| Engineering Handoff | 5 |
| 总分 | 100 |

### 裁决

| 分数 | 决策 |
|---|---|
| 100 | `l5_ready` |
| 95-99 | `not_l5_fix_required` |
| 90-94 | `production_but_not_l5` |
| 80-89 | `major_fix_required` |
| <80 | `blocked` |

---

## 10. Redline Item 标准

每一个扣分点必须输出：

```md
# Redline Item

- ID:
- Page:
- Scenario:
- User Psychology:
- Evidence:
- Problem:
- Root Cause Layer: token / component / pattern / page / icon / copy / ux / handoff
- Why It Blocks 100:
- Severity:
- Owner Skill:
- Exact Fix:
- Files / Assets To Change:
- Acceptance Criteria:
- Re-test Method:
```

禁止输出没有 `Exact Fix` 的问题。

---

## 11. 可执行 Fix Card

每个 Redline 必须转成 Fix Card。

```md
# Fix Card

- Fix ID:
- Priority:
- Owner Skill:
- Target Layer:
- Target Files:
- Action:
- Token Changes:
- Component Changes:
- Pattern Changes:
- Page Changes:
- Icon Changes:
- Copy Changes:
- Acceptance Criteria:
- Regression Scope:
```

---

## 12. Fix Order

```md
# Fix Order

| Priority | Fix ID | Target Layer | Owner Skill | Exact Action | Files | Acceptance Criteria |
|---|---|---|---|---|---|---|
```

执行规则：

```text
P0 必须先修
系统层问题先于页面层问题
公共资源问题先于单页视觉问题
修复后必须重新 Review
```

---

## 13. Cross Challenge

通过前必须回答：

| Challenge | 失败结果 |
|---|---|
| 去掉颜色后，层级是否仍清楚？ | not_l5 |
| 用户第一次进入是否知道下一步？ | not_l5 |
| 用户在资金焦虑下是否敢继续？ | not_l5 |
| API 失败后是否可恢复？ | blocked |
| 印尼语变长是否不破版？ | not_l5 |
| 风险是否没有被弱化？ | blocked |
| 公共资源更新后页面是否同步？ | not_l5 |
| 开发是否能直接执行 Fix Card？ | not_l5 |

---

## 14. 回归复审

```md
# Regression Review

| Fix ID | Fixed | New Issue Introduced | Re-score Dimension | Score | Decision |
|---|---:|---:|---|---:|---|
```

修复引入新问题，不能通过。

---

## 15. 最终报告

```md
# Elite UX/UI Remediation Board Report

## 1. Final Verdict
- Score:
- Decision:
- Can Handoff to Development:
- Why Not 100:

## 2. Evidence Reviewed

## 3. User Scenario Simulation

## 4. Score Breakdown

## 5. Redline Report

## 6. Fix Cards

## 7. Fix Order

## 8. Cross Challenge Result

## 9. Regression Review

## 10. Final 100-Point Gate
```

---

## 16. 和其他 Skill 的关系

| 问题类型 | 修复 Skill |
|---|---|
| 业务规则 | Product Skill |
| UI 页面 | UI Build Skill |
| token / component / pattern | Design System Skill |
| 公共资源 | Design Public Resource Package Governance Skill |
| 图标 | Local Icon Asset Library Governance Skill |
| 文案 / i18n | Financial Copy & Localization Skill |
| 交互 / 错误恢复 | UX Interaction Quality Gate |
| 交付 | Product Design Quality Review Gate |

本 Skill 负责裁决和下达修复命令，不替代修复 Skill。

---

## 17. Codex 执行命令

### 17.1 审核当前 App

```txt
使用 Elite UX/UI Remediation Board Skill v4.0.0-L5 审核当前 App 产品设计。

要求：
1. 不要先改页面。
2. 收集证据链。
3. 模拟真实用户心理和使用场景。
4. 按 100 分门禁评分。
5. 每个扣分点必须输出 Redline Item。
6. 每个 Redline 必须转成 Fix Card。
7. 每个 Fix Card 必须包含 Target Layer、Target Files、Exact Action、Acceptance Criteria。
8. 输出 Fix Order。
9. 不允许模糊建议。
10. 不到 100 分不得输出 l5_ready。
```

### 17.2 执行修复

```txt
根据 Elite UX/UI Remediation Board 的 Fix Order 执行修复。

要求：
1. 按 P0 → P1 → P2 → P3 顺序。
2. 先修系统层，再修页面层。
3. 不允许绕过公共资源包。
4. 不允许 hardcode 样式。
5. 不允许未注册图标和未注册文案。
6. 修复后重新运行 Review Board。
7. 必须达到 100/100 才允许 l5_ready。
```

---

## 18. AGENTS.md 路由建议

```md
## Elite UX/UI Remediation Board Rule

When the task involves top-tier UX/UI review, UI quality repair, user psychology, real usage scenarios, financial app trust, exact UI fixes, L5 readiness, or design handoff gate, Codex must use:

`.codex/skills/ui-build-production/addons/elite-ux-ui-remediation-board/SKILL.md`

Required outputs:
1. Evidence Reviewed
2. User Scenario Simulation
3. Score Breakdown
4. Redline Report
5. Fix Cards
6. Fix Order
7. Cross Challenge Result
8. Regression Review
9. Final Verdict

Hard rules:
- Only 100/100 can be l5_ready.
- Every issue must have Exact Fix.
- Every Exact Fix must name files/assets to change.
- No vague suggestions.
- System-level fixes before page-level fixes.
- Public resource compliance is mandatory.
```

---

## 19. L5 完成标准

| 标准 | 必须满足 |
|---|---:|
| 用户心理模型 | 是 |
| 真实任务场景 | 是 |
| UI 修改依据 | 是 |
| UI Remediation Recipes | 是 |
| Root Cause Layer | 是 |
| Redline Item | 是 |
| Fix Card | 是 |
| Fix Order | 是 |
| Acceptance Criteria | 是 |
| Cross Challenge | 是 |
| Regression Review | 是 |
| 100 分门禁 | 是 |
| 可被 Codex 直接执行 | 是 |

---

## 20. 最终定义

```text
Elite UX/UI Remediation Board Skill v4.0.0-L5
= User Psychology
+ Scenario Simulation
+ UI Modification Basis
+ Root Cause Layer
+ UI Remediation Recipes
+ Redline Report
+ Fix Cards
+ Fix Order
+ Acceptance Criteria
+ Cross Challenge
+ Regression Review
+ 100-Point L5 Gate
```

它不是一份“审核建议 Skill”。
它是一份 **顶尖 UX/UI 问题诊断与修复执行 Skill**。
目标是让 Codex 不仅知道“不达标”，还必须知道 **为什么不达标、怎么改、改哪里、改到什么标准才算完成**。
