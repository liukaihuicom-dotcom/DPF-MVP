---
name: ux-interaction-quality-gate
description: 当任务涉及 UX review、任务路径、交互质量、错误恢复、平台交互规范、无障碍、金融 UX 风险、App/H5/Web/Admin 页面可用性验收、Release Decision 时使用。本 Skill 是 UI Build Production Skill 的 UX 交互质量门禁 Add-on。
---

# UX Interaction Quality Gate Skill v1.0.0-L5 中文版

> 文件路径：`.codex/skills/ui-build-production/addons/ux-interaction-quality-gate/SKILL.md`  
> 版本：`v1.0.0-L5`  
> 等级：`L5 Add-on / Production UX Interaction Quality Gate Skill`  
> 父级 Skill：`UI Build Production Skill v3.0.0-L5`  
> 可被调用：`AI Product Production Delivery Skill v3.0.0-L5`、`UI Build Production Skill v3.0.0-L5`  
> 目标：对 App / H5 / Web / Admin 页面进行生产级 UX 交互质量验收，确保任务路径清晰、交互反馈完整、错误可恢复、平台习惯正确、无障碍基础达标、金融产品体验可信，并通过 UX Gate 判断是否允许进入 UI Build / Development / Release。

---

## 0. 核心定位

本 Skill 是 **UX 质量门禁层**，不是第 5 个平级核心 Skill。

它负责回答：

```text
用户能不能完成核心任务？
用户是否知道当前状态？
用户是否知道下一步做什么？
用户出错后是否能恢复？
高风险操作是否被预防？
交互是否符合平台习惯？
是否符合基础无障碍要求？
金融 / Broker / Wallet / KYC 场景是否足够可信、清晰、安全？
```

它不负责：

```text
- 不重新定义业务规则
- 不替代 Product Kernel
- 不替代 Page Contract
- 不替代 Design System
- 不直接生成最终页面
- 不负责视觉风格创作
- 不负责参考案例转化
```

---

## 1. L5 UX Gate 原则

| 原则 | 要求 |
|---|---|
| Task First | 先确认用户任务路径，再评估页面表现 |
| Clarity First | 页面必须让用户知道当前状态、下一步、风险和结果 |
| Feedback Always | 用户触发关键操作后必须有明确反馈 |
| Error Recoverable | 错误必须可理解、可定位、可恢复 |
| Prevention Before Correction | 资金、KYC、协议、证件、银行卡等高风险场景优先预防错误 |
| Platform Native | App / H5 / Web / Admin 必须符合各自平台交互习惯 |
| Accessible Baseline | 必须满足基础可访问性：对比度、焦点、标签、键盘、触控目标 |
| Financial Trust | 金融产品必须清晰、克制、可信、可追踪，不弱化风险 |
| Measurable UX | UX 质量必须可评分、可阻断、可修复 |
| No Demo UX | 禁止只有视觉壳子，没有真实任务、状态、反馈和恢复路径 |

---

## 2. 标准目录

```text
.codex/skills/ui-build-production/addons/ux-interaction-quality-gate/
├── SKILL.md
├── schemas/
│   ├── ux-task-flow.schema.json
│   ├── interaction-model.schema.json
│   ├── feedback-recovery.schema.json
│   ├── error-prevention.schema.json
│   ├── accessibility-baseline.schema.json
│   └── ux-output.schema.json
│
├── templates/
│   ├── ux-task-flow.report.md
│   ├── interaction-review.report.md
│   ├── feedback-recovery.report.md
│   ├── cognitive-load.checklist.md
│   ├── accessibility-checklist.md
│   ├── platform-interaction.report.md
│   ├── financial-ux-risk.report.md
│   ├── ux-quality-scorecard.md
│   └── ux-release-decision.md
│
├── rules/
│   ├── platform-interaction.rules.md
│   ├── financial-ux-risk.rules.md
│   ├── error-prevention.rules.md
│   ├── feedback-recovery.rules.md
│   ├── accessibility-baseline.rules.md
│   ├── navigation-back-close.rules.md
│   └── form-ux.rules.md
│
├── qa/
│   ├── ux-severity.matrix.md
│   ├── ux-gate.rules.md
│   ├── ux-release-decision.rules.md
│   └── scenario-coverage.rules.md
│
└── examples/
    ├── app-bank-account-add-ux-review.md
    ├── agreement-reading-flow-ux-review.md
    ├── deposit-withdrawal-ux-review.md
    └── admin-kyc-review-ux-review.md
```

---

## 3. 国际 UX 标准映射

本 Skill 不把“符合国际标准”写成口号，而是转成可检查规则。

| 标准 / 来源 | 转换为项目内规则 |
|---|---|
| Apple Human Interface Guidelines | App 端导航、反馈、触控、安全区、平台一致性、Motion 克制 |
| Material Design Guidelines | Android / Web 的组件行为、状态反馈、触控目标、可访问性 |
| WCAG 2.2 | 对比度、键盘可达、焦点可见、输入帮助、错误识别、目标大小、可读性 |
| Nielsen Norman Group 10 Usability Heuristics | 系统状态可见、匹配真实世界、用户控制、错误预防、识别优先于记忆、帮助用户恢复 |
| 金融产品 UX | 金额可读、风险透明、误操作预防、审核可追踪、敏感信息可控 |

---

## 4. 输入标准

### 4.1 必需输入

| 输入 | 说明 | 缺失处理 |
|---|---|---|
| `page_contract` | 页面目标、角色、状态、字段、交互、风险规则 | Blocker |
| `platform` | app / h5 / web / admin | Blocker |
| `user_role` | 用户、IB、Partner、运营、客服、合规、管理员 | Blocker |
| `primary_task` | 当前页面的核心任务 | Blocker |
| `business_rules` | 业务规则、限制、异常 | Blocker |
| `states` | default / loading / error / empty / success / restricted 等状态 | Critical |
| `interactions` | 点击、输入、返回、取消、确认、提交、失败恢复 | Critical |
| `risk_rules` | 资金、KYC、银行卡、协议、审核等风险规则 | 条件 Blocker |
| `ui_output` | 当前页面 HTML / React / Vue / Prototype | 条件必须 |
| `design_system` | Token、组件、Pattern、平台规则 | Major |

### 4.2 缺失信息处理规则

```text
- 缺 Page Contract：Blocker，不能执行 UX 验收。
- 缺核心任务：Blocker，不能判断 UX 是否成功。
- 缺状态矩阵：Critical，不能标记生产级。
- 涉及金融 / KYC / 资金时缺风险规则：Blocker。
- 缺设计系统：可执行初步 UX 评估，但不能标记 UI Ready。
```

---

## 5. UX Task Flow Schema

用户任务路径必须结构化，不能只描述页面。

### 5.1 `ux-task-flow.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "UX Task Flow Schema",
  "type": "object",
  "required": [
    "task_id",
    "page_id",
    "platform",
    "role",
    "primary_goal",
    "entry_points",
    "steps",
    "success_criteria",
    "failure_paths",
    "recovery_paths",
    "risk_points"
  ],
  "properties": {
    "task_id": {"type": "string", "pattern": "^[a-z0-9_\\-]+$"},
    "page_id": {"type": "string"},
    "platform": {"enum": ["app", "h5", "web", "admin"]},
    "role": {"type": "array", "items": {"type": "string"}},
    "primary_goal": {"type": "string"},
    "entry_points": {"type": "array", "items": {"type": "string"}},
    "steps": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["step_id", "user_action", "system_response", "feedback", "next_step"],
        "properties": {
          "step_id": {"type": "string"},
          "user_action": {"type": "string"},
          "system_response": {"type": "string"},
          "feedback": {"type": "string"},
          "next_step": {"type": "string"},
          "required": {"type": "boolean"}
        }
      }
    },
    "success_criteria": {"type": "array", "items": {"type": "string"}},
    "failure_paths": {"type": "array", "items": {"type": "string"}},
    "recovery_paths": {"type": "array", "items": {"type": "string"}},
    "risk_points": {"type": "array", "items": {"type": "string"}}
  }
}
```

### 5.2 Task Flow 验收规则

| 检查项 | 通过标准 | 严重级别 |
|---|---|---|
| 核心任务明确 | 用户一眼知道页面要完成什么 | Blocker |
| 入口明确 | 用户知道如何进入此任务 | Major |
| 步骤合理 | 不存在无意义步骤、重复输入、绕路操作 | Major |
| 主操作稳定 | 主按钮位置、含义、状态一致 | Critical |
| 成功标准明确 | 任务完成后用户知道结果 | Critical |
| 失败路径完整 | 失败后知道原因和下一步 | Critical |
| 恢复路径完整 | 用户能重试、返回、修改、取消或联系客服 | Critical |
| 风险点清楚 | 高风险操作有确认、说明、审计 | Blocker |

---

## 6. Interaction Model Schema

### 6.1 `interaction-model.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Interaction Model Schema",
  "type": "object",
  "required": [
    "page_id",
    "interactions",
    "navigation",
    "feedback",
    "error_handling",
    "accessibility"
  ],
  "properties": {
    "page_id": {"type": "string"},
    "interactions": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "event",
          "trigger",
          "condition",
          "system_response",
          "user_feedback",
          "failure_recovery",
          "state_change"
        ],
        "properties": {
          "event": {"type": "string"},
          "trigger": {"type": "string"},
          "condition": {"type": "string"},
          "system_response": {"type": "string"},
          "user_feedback": {"type": "string"},
          "failure_recovery": {"type": "string"},
          "state_change": {"type": "string"},
          "risk_level": {"enum": ["none", "low", "medium", "high", "critical"]}
        }
      }
    },
    "navigation": {
      "type": "object",
      "required": ["back", "close", "cancel", "exit_confirm"],
      "properties": {
        "back": {"type": "string"},
        "close": {"type": "string"},
        "cancel": {"type": "string"},
        "exit_confirm": {"type": "string"}
      }
    },
    "feedback": {"type": "array", "items": {"type": "string"}},
    "error_handling": {"type": "array", "items": {"type": "string"}},
    "accessibility": {"type": "array", "items": {"type": "string"}}
  }
}
```

### 6.2 交互验收规则

| 交互类型 | 必须满足 |
|---|---|
| 点击 | 有触发、反馈、结果、失败路径 |
| 输入 | 有格式约束、实时或提交校验、错误提示 |
| 选择 | 当前选择可见，切换结果清楚 |
| 返回 | 返回到合理上一级，不丢失必要状态 |
| 关闭 | 高风险流程关闭前必须确认 |
| 取消 | 取消后保留还是清空必须明确 |
| 提交 | 防重复提交，loading，成功 / 失败反馈 |
| 重试 | 网络、接口、审核失败要有恢复路径 |
| 危险操作 | 必须二次确认，并说明后果 |
| 异步操作 | 显示 pending / reviewing，不无限 loading |

---

## 7. 平台交互规则

### 7.1 App

| 维度 | 要求 |
|---|---|
| 触控目标 | 关键点击区域建议不低于 44pt / 48dp 级别 |
| 主操作 | 高频主操作优先底部固定，避免键盘遮挡 |
| 返回 | 左上返回用于步骤回退；关闭用于退出流程，二者不能混乱 |
| Bottom Sheet | 适合选择器、轻量确认、短表单 |
| Dialog | 适合高风险确认、协议退出、资金确认 |
| 安全区 | 底部 CTA、Tabbar、键盘场景必须避开安全区 |
| 手势 | 不依赖隐藏手势完成关键任务 |
| 状态反馈 | Toast / Inline Error / Result Page 按严重级别使用 |

### 7.2 H5

| 维度 | 要求 |
|---|---|
| 浏览器环境 | 考虑地址栏、分享、扫码、Deep Link |
| 表单 | 键盘类型、输入格式、自动填充、错误提示 |
| 返回 | 浏览器返回和页面返回不能造成状态丢失 |
| 加载 | 网络不稳定时要有重试和明确状态 |
| 兼容 | 不依赖无法广泛支持的交互 |

### 7.3 Web

| 维度 | 要求 |
|---|---|
| 导航 | Sidebar / Topbar / Breadcrumb 关系清楚 |
| 键盘 | 表单、弹窗、菜单、表格基础键盘可用 |
| 筛选 | 筛选条件、结果数量、重置、空状态清楚 |
| 表格 | 排序、筛选、分页、批量操作、空 / 错误状态 |
| 详情 | Drawer / Detail Page 的返回、关闭、保存规则明确 |
| 响应式 | 断点、容器、密度、布局变化明确 |

### 7.4 Admin

| 维度 | 要求 |
|---|---|
| 密度 | 信息密度可以高，但不能牺牲可读性 |
| 权限 | 页面、按钮、字段、数据范围必须明确 |
| 审核 | 批准 / 拒绝 / 退回必须有原因、确认、审计 |
| 批量操作 | 必须显示影响数量、后果和撤销 / 恢复策略 |
| 审计 | 关键操作必须有日志字段 |
| 错误处理 | 系统错误和业务错误要区分 |

---

## 8. 信息架构与认知负担

### 8.1 信息层级

| 层级 | 内容 | 要求 |
|---|---|---|
| L1 | 页面核心任务 | 首屏明确，视觉和文案都聚焦 |
| L2 | 关键字段 / 状态 / 金额 | 高可读，强对比，单位清楚 |
| L3 | 辅助说明 / 风险提示 | 不弱化，不抢主任务 |
| L4 | 次级链接 / 说明 | 可发现，但不干扰主流程 |

### 8.2 Cognitive Load Checklist

| 检查项 | 通过标准 |
|---|---|
| 页面是否只有一个主任务 | 是 |
| 用户是否知道下一步 | 是 |
| 是否减少重复输入 | 是 |
| 复杂规则是否被分步解释 | 是 |
| 术语是否符合用户语言 | 是 |
| 金额 / 风险 / 状态是否足够清楚 | 是 |
| 是否避免同时出现太多主操作 | 是 |
| 错误是否靠近问题位置 | 是 |
| 是否存在不必要弹窗 | 否 |
| 是否存在看起来可点但不可点的元素 | 否 |

---

## 9. Feedback & Recovery Rules

### 9.1 反馈类型

| 反馈类型 | 使用场景 | 要求 |
|---|---|---|
| Inline Error | 字段错误 | 靠近字段，说明原因和修改方式 |
| Toast | 短暂成功 / 弱错误 | 不遮挡关键操作，不承载复杂信息 |
| Banner | 页面级风险 / 限制 | 可见、可解释、有下一步 |
| Dialog | 高风险确认 | 标题 + 后果 + 主次按钮 |
| Bottom Sheet | App 轻量选择 / 确认 | 可关闭，有明确操作 |
| Result Page | 流程完成 / 阻断 | 显示结果、原因、下一步 |
| Skeleton | 加载 | 保持布局稳定，不无限 loading |
| Empty State | 无数据 | 说明为什么空、用户可以做什么 |

### 9.2 错误恢复标准

| 错误类型 | 必须提供 |
|---|---|
| 字段错误 | 错误原因 + 修改方式 |
| 接口失败 | 重试 / 稍后再试 / 联系客服 |
| 权限不足 | 解释无权限，不暴露敏感信息 |
| 风控限制 | 限制原因 + 解除路径 |
| 审核中 | 当前状态 + 后续路径 |
| 审核失败 | 失败原因 + 重新提交方式 |
| 资金失败 | 失败原因 + 金额 / 账户 / 手续费状态 |
| 网络失败 | 重试和状态保留 |
| 文件上传失败 | 文件限制、重新上传、保留已成功文件 |

---

## 10. Error Prevention Rules

| 场景 | 预防规则 |
|---|---|
| 提交资金操作 | 显示金额、币种、账户、手续费、到账说明 |
| 切换银行 / 证件 / 账户 | 若会清空已填内容，必须二次确认 |
| 协议阅读退出 | 若退出导致流程未完成，必须确认 |
| 删除 / 撤销 / 拒绝 | 必须说明后果，避免误操作 |
| 表单提交 | 提交前校验，提交中防重复 |
| 高风险字段 | 输入格式限制、脱敏、确认 |
| 审核操作 | 批准 / 拒绝必须有权限和审计 |
| 余额不足 | 提交前阻断，不等接口失败 |
| KYC 未完成 | 入口前置提示，不让用户走到最后才失败 |
| 选择币种 | 与账户、银行卡、地区规则一致 |

---

## 11. 金融 / Broker UX 风险规则

| 场景 | UX 要求 | 阻断级别 |
|---|---|---|
| 入金 | 金额、币种、账户、手续费、到账状态清楚 | Blocker |
| 出金 | 余额、银行卡、手续费、审核状态、失败原因清楚 | Blocker |
| 转账 | 来源、目标、金额、币种、确认和结果可追踪 | Blocker |
| KYC | 当前审核状态、失败原因、补充材料路径清楚 | Critical |
| 协议签署 | 阅读进度、同意条件、退出后果清楚 | Critical |
| 视频验证 | 触发原因、设备要求、失败后路径清楚 | Critical |
| 交易账号 | 余额、净值、杠杆、风险状态高可读 | Critical |
| IB / Partner | 返佣、层级、邀请、钱包和权限边界清楚 | Critical |
| 后台审核 | 操作权限、拒绝原因、审计日志清楚 | Blocker |
| 风险提示 | 不得弱化，不得只用颜色表达 | Major |

---

## 12. Accessibility Baseline

### 12.1 基础要求

| 维度 | 要求 |
|---|---|
| 对比度 | 正文文本与背景应满足基础可读对比；重要状态不能只靠颜色 |
| 焦点 | Web / Admin 关键控件必须可见 focus |
| 键盘 | 表单、按钮、弹窗、菜单基础键盘可用 |
| 表单标签 | 输入框必须有 label 或可访问名称 |
| 错误关联 | 错误提示与字段有明确关联 |
| 弹窗 | Dialog 需要 focus trap、可关闭、返回焦点 |
| 触控目标 | 移动端关键操作区域足够大 |
| 文案 | 不只用图标表达含义 |
| 动效 | 动效不影响任务完成，不用于隐藏关键信息 |
| 读屏基础 | 图标按钮、状态、结果必须有语义说明 |

### 12.2 Accessibility Checklist

| 检查项 | 结果 | 严重级别 |
|---|---|---|
| 主操作按钮是否可聚焦 | Pass / Fail | Major |
| 表单是否有 label | Pass / Fail | Critical |
| 错误提示是否靠近字段 | Pass / Fail | Major |
| 错误是否只靠颜色表达 | Pass / Fail | Major |
| Dialog 是否可关闭并恢复焦点 | Pass / Fail | Major |
| 点击区域是否过小 | Pass / Fail | Major |
| 金融状态是否有文字说明 | Pass / Fail | Critical |
| 关键信息是否可读 | Pass / Fail | Critical |

---

## 13. UX Quality Scorecard

UX 质量必须可量化。满分 100 分，低于 80 分不得标记为生产级 UX。

| 维度 | 分值 | 评分标准 |
|---|---:|---|
| Task Success | 15 | 核心任务是否清楚、完整、可完成 |
| Clarity | 10 | 页面目标、状态、下一步是否清楚 |
| Efficiency | 10 | 是否减少不必要步骤和重复输入 |
| Feedback | 10 | 操作后是否有及时、准确反馈 |
| Error Prevention | 10 | 是否提前防止高风险误操作 |
| Recovery | 10 | 错误后是否可理解、可恢复 |
| Consistency | 8 | 同类交互是否一致 |
| Platform Fit | 8 | 是否符合 App / H5 / Web / Admin 平台习惯 |
| Accessibility | 9 | 是否满足基础可访问性 |
| Financial Trust | 10 | 是否符合金融产品可信、严谨、安全体验 |

### 13.1 评分门槛

| 分数 | 判断 |
|---|---|
| 90 - 100 | Production UX Ready |
| 80 - 89 | Conditional Ready，允许进入下一阶段但需记录优化项 |
| 70 - 79 | Major Fix Required |
| 60 - 69 | Critical Fix Required |
| < 60 | Blocked |

---

## 14. UX Severity Matrix

| Severity | 定义 | 是否阻断 | 示例 |
|---|---|---:|---|
| Blocker | 核心任务无法完成，或资金 / 合规 / 安全风险不可控 | 是 | 出金无失败路径；KYC 状态缺失；协议退出无后果说明 |
| Critical | 核心交互可用性严重不足 | 是 | 错误不可恢复；返回 / 关闭逻辑混乱；审核中无限 loading |
| Major | 明显影响体验或维护性 | 条件阻断 | 字段错误不靠近字段；点击区域过小；反馈不一致 |
| Minor | 不影响主流程的小问题 | 否 | 个别文案不够精准，间距影响轻微 |
| Info | 建议优化 | 否 | 可后续增加效率入口 |

---

## 15. UX Gate Rules

### 15.1 Gate 清单

| Gate | 检查内容 | Block 条件 |
|---|---|---|
| Task Flow Gate | 核心任务、入口、步骤、成功标准 | 任务无法完成 |
| Interaction Gate | 点击、输入、返回、取消、提交、恢复 | 关键操作无反馈 |
| Feedback Gate | Toast、Dialog、Inline Error、Banner、Result | 错误无恢复路径 |
| Platform Gate | App / H5 / Web / Admin 规范 | 平台交互明显错误 |
| Accessibility Gate | label、focus、keyboard、contrast、target | 表单无 label 或状态只靠颜色 |
| Financial UX Gate | 资金、KYC、银行卡、协议、审核 | 风险弱化或缺确认 |
| Cognitive Load Gate | 信息层级、步骤、术语、主操作 | 主任务不清楚 |
| Release Gate | 分数、严重级别、风险、Owner | 存在 Blocker / Critical |

### 15.2 Release Decision

| Decision | 条件 | 是否允许进入下一阶段 |
|---|---|---:|
| `ux_ready` | 0 Blocker，0 Critical，UX Score ≥ 90 | 是 |
| `conditional_ready` | 0 Blocker，0 Critical，UX Score 80-89，Major 有 Owner | 条件允许 |
| `major_fix_required` | UX Score 70-79，或 Major 影响主流程 | 否 |
| `blocked` | 存在任意 Blocker / Critical，或 UX Score < 70 | 否 |

---

## 16. UX Output Contract

### 16.1 `ux-output.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "UX Output Schema",
  "type": "object",
  "required": [
    "task_flow_report",
    "interaction_review",
    "feedback_recovery",
    "platform_review",
    "accessibility_review",
    "financial_ux_risk",
    "ux_score",
    "severity_summary",
    "release_decision"
  ],
  "properties": {
    "task_flow_report": {"type": "string"},
    "interaction_review": {"type": "string"},
    "feedback_recovery": {"type": "string"},
    "platform_review": {"type": "string"},
    "accessibility_review": {"type": "string"},
    "financial_ux_risk": {"type": "string"},
    "ux_score": {"type": "number", "minimum": 0, "maximum": 100},
    "severity_summary": {
      "type": "object",
      "required": ["blocker", "critical", "major", "minor"],
      "properties": {
        "blocker": {"type": "integer"},
        "critical": {"type": "integer"},
        "major": {"type": "integer"},
        "minor": {"type": "integer"}
      }
    },
    "release_decision": {
      "enum": ["ux_ready", "conditional_ready", "major_fix_required", "blocked"]
    }
  }
}
```

### 16.2 UX Release Report 模板

```md
# UX Release Decision

## Summary
- Page ID:
- Platform:
- Primary Task:
- UX Score:
- Decision: ux_ready / conditional_ready / major_fix_required / blocked

## Severity Summary
- Blocker:
- Critical:
- Major:
- Minor:

## Task Flow Result
- Entry:
- Steps:
- Success Criteria:
- Failure Paths:
- Recovery Paths:

## Interaction Result
- Main Action:
- Back / Close / Cancel:
- Submit:
- Feedback:
- Error Recovery:

## Accessibility Result
- Label:
- Focus:
- Keyboard:
- Touch Target:
- Contrast:
- State Text:

## Financial UX Result
- Risk:
- Confirmation:
- Amount / Currency:
- Audit:
- Compliance Copy:

## Required Fixes
| Issue | Severity | Fix | Owner | Status |
|---|---|---|---|---|
```

---

## 17. 与现有 Skill 的协作

### 17.1 Product Skill 调用 UX Gate

| 阶段 | UX Gate 作用 |
|---|---|
| Page Contract 生成后 | 检查任务路径是否合理 |
| Business Rules 完成后 | 检查错误预防和风险反馈 |
| State Machine 完成后 | 检查失败 / 恢复 / 审核状态 |
| Release Decision 前 | 检查 UX 是否允许进入 UI Build |

### 17.2 UI Build Skill 调用 UX Gate

| 阶段 | UX Gate 作用 |
|---|---|
| 页面实现前 | 检查 Page Contract 是否具备 UX 交付条件 |
| 页面实现中 | 检查交互反馈、状态和平台习惯 |
| 页面实现后 | 输出 UX Scorecard 和 Release Decision |
| 交付开发前 | 检查 UX Blocker / Critical 是否清零 |

### 17.3 Design System Skill 协作

Design System Skill 提供：

```text
- Component Manifest
- Pattern Registry
- Platform Rules
- Accessibility Tokens
- Feedback Components
- Form Components
- Dialog / Toast / Sheet / Banner 规范
```

UX Gate 不允许页面绕过这些资产。

---

## 18. Production Workflow

```text
1. Receive Page Contract / UI Output / Business Rules
2. Identify Primary Task
3. Build UX Task Flow
4. Review Interaction Model
5. Review Feedback & Recovery
6. Review Error Prevention
7. Review Platform Rules
8. Review Accessibility Baseline
9. Review Financial UX Risk
10. Score UX Quality
11. Assign Severity
12. Output UX Release Decision
```

---

## 19. AI 执行命令

### 19.1 执行 UX 交互验收

```txt
使用 UX Interaction Quality Gate Skill v1.0.0-L5 对当前页面执行生产级 UX 验收。

输入：
- Page Contract:
- Platform:
- User Role:
- Primary Task:
- Business Rules:
- States:
- Interactions:
- Risk Rules:
- UI Output:
- Design System:

检查：
1. Task Flow
2. Interaction Model
3. Feedback & Recovery
4. Error Prevention
5. Platform Interaction
6. Accessibility Baseline
7. Financial UX Risk
8. Cognitive Load
9. UX Scorecard
10. Release Decision

输出：
- UX Task Flow Report
- Interaction Review Report
- Feedback Recovery Report
- Accessibility Checklist
- Financial UX Risk Report
- UX Quality Score
- Blocker / Critical / Major / Minor
- Decision: ux_ready / conditional_ready / major_fix_required / blocked
```

### 19.2 优化页面 UX

```txt
使用 UX Interaction Quality Gate Skill v1.0.0-L5 优化当前页面 UX。

目标：
从“视觉好看”提升到“任务清晰、交互可用、错误可恢复、金融可信、可交付开发”。

要求：
1. 不改变业务规则。
2. 不绕过 Page Contract。
3. 不新增随机组件。
4. 优先修复 Blocker 和 Critical。
5. 输出修改前问题、修改后结果和 UX Score。
```

### 19.3 检查金融操作 UX

```txt
使用 UX Interaction Quality Gate Skill v1.0.0-L5 检查金融操作 UX。

场景：
- 入金 / 出金 / 转账 / 银行卡 / KYC / 协议 / 审核 / IB 返佣

重点检查：
1. 金额、币种、账户是否清楚。
2. 风险和限制是否清楚。
3. 高风险操作是否二次确认。
4. 失败后是否可恢复。
5. 审核状态是否可追踪。
6. 敏感字段是否脱敏。
7. 是否有误导性文案。
```

---

## 20. Forbidden Rules

```text
- 禁止只检查视觉，不检查任务路径。
- 禁止核心任务不清楚就进入 UI Build。
- 禁止关键操作没有反馈。
- 禁止错误无恢复路径。
- 禁止资金、KYC、银行卡、协议、审核场景缺少风险说明。
- 禁止状态只靠颜色表达。
- 禁止表单错误远离字段。
- 禁止无限 loading 代替审核中 / 处理中状态。
- 禁止返回、关闭、取消逻辑混乱。
- 禁止为了减少页面步骤而隐藏必要风险说明。
- 禁止为了视觉简洁弱化合规和资金风险。
- 禁止存在 Blocker / Critical 仍标记 UX Ready。
```

---

## 21. L5 完成标准

| 标准 | 必须满足 |
|---|---:|
| UX Task Flow 有 Schema | 是 |
| Interaction Model 有 Schema | 是 |
| Feedback & Recovery 有规则 | 是 |
| Error Prevention 有规则 | 是 |
| Platform Interaction 有规则 | 是 |
| Accessibility Baseline 有检查项 | 是 |
| Financial UX Risk 有专项规则 | 是 |
| Cognitive Load 有检查项 | 是 |
| UX Quality Scorecard 可评分 | 是 |
| UX Severity 可阻断 | 是 |
| UX Release Decision 明确 | 是 |
| 可被 Product Skill 和 UI Build Skill 调用 | 是 |

---

## 22. 最终定义

```text
UX Interaction Quality Gate Skill v1.0.0-L5
= Task Flow Review
+ Interaction Model Review
+ Feedback & Recovery
+ Error Prevention
+ Platform Interaction Rules
+ Accessibility Baseline
+ Financial UX Risk Rules
+ Cognitive Load Checklist
+ UX Quality Scorecard
+ UX Severity Gate
+ UX Release Decision
```

它的价值不是让页面“看起来更高级”，而是确保页面 **真的可用、可理解、可恢复、可信、符合平台习惯，并能进入生产级交付**。
