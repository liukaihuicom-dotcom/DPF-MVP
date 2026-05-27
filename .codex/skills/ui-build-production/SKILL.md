---
name: ui-build-production
description: >
  Use for building shippable App, H5, Web, Admin, React, Vue, HTML, or prototype UI from Page Contracts,
  design-system tokens, component manifests, pattern registries, state matrices, interaction rules, responsive rules, visual QA, accessibility QA, and developer handoff.
  Inputs include page-contract.json, tokens, component/business-component manifests, icon registry, pattern registry, mock data, reference-adaptation output, and platform constraints.
  Outputs runnable UI code, state matrix, interaction/event mapping, component and token usage reports, visual/responsive/a11y QA, and handoff notes.
  Do not use to skip product contracts, invent random styles, create page-local components/icons outside governance, or deliver static screenshot-only UI.
---

# UI Build Production Skill v3.0.0-L5

> File: `.codex/skills/ui-build-production/SKILL.md`
> Version: `v3.0.0-L5`
> Level: `L5 Complete / Production UI Build Delivery Skill`
> Status: `Executable / Verifiable / Handoff-ready / Design-System-bound`
> Purpose: 基于 `Page Contract`、`Design System`、`Component Manifest`、`Pattern Registry`、`State Matrix` 与 `QA Gate`，生成高质量、可运行、可验收、可持续维护、可交付开发的生产级 UI 页面。
> Target: Codex / Claude / Cursor / AI Coding Agent / 产品设计工程师 / 前端开发 / QA / PM。

---

## 0. 核心定位

本 Skill 是产品工程链路中的 **页面生产层**。它不根据一句“做高级一点”自由发挥，而是消费 Product Skill 输出的 `Page Contract`，严格调用 Design System Skill 输出的 `tokens.json`、`component-manifest.json`、`business-component-manifest.json`、`icon-registry.json`、`pattern-registry.json`，并输出可运行、可检查、可交付、可迭代的 UI 页面。

| 项目 | 定义 |
|---|---|
| 核心任务 | 页面构图、组件组装、Token 绑定、状态演示、交互反馈、视觉 QA、开发交付 |
| 输入来源 | `page-contract.json`、`tokens.json`、`component-manifest.json`、`business-component-manifest.json`、`icon-registry.json`、`pattern-registry.json`、`mock-data.json`、参考截图 |
| 输出结果 | 可运行页面代码、状态矩阵、场景切换、事件映射、组件使用报告、Token 使用报告、视觉 QA、响应式 QA、A11y QA、开发交付说明 |
| 禁止结果 | 静态截图式页面、Demo 感页面、无状态页面、随机样式页面、临时组件页面、无法交付开发的页面 |
| 适用页面 | App / H5 / Web / Admin / 金融交易 / KYC / 钱包 / 审核 / CRM / Broker SaaS |

---

## 1. L5 页面生产原则

| 原则 | L5 要求 |
|---|---|
| Contract First | 必须先读取、校验并消费 `Page Contract`，不得直接生成页面 |
| Component First | 优先使用已登记组件，禁止页面内重复造 Button / Card / Input / Dialog |
| Token Bound | 颜色、字体、间距、圆角、阴影、动效必须来自 Token，禁止硬编码 |
| Pattern Driven | 页面先匹配 Pattern，不允许每次重发明布局 |
| State Complete | default / loading / empty / error / disabled / inputting / validating / submitting / success / failed / permission_denied / restricted / reviewing 必须按场景覆盖 |
| Real Interaction | 关键路径必须可点击、可切换、可反馈、可恢复，不做假交互 |
| Visual Quality | 页面必须有主视觉焦点、信息层级、金融专业感、低噪音、可读性 |
| Responsive Ready | App / H5 / Web / Admin 必须符合平台规则和断点策略 |
| Handoff Ready | 输出开发能理解的结构、字段、状态、事件、组件、Token、风险说明 |
| QA Blocker | 出现 Blocker / Critical 级问题不得交付 |
| Machine Verifiable | 输入、输出、QA、事件、Token、组件使用必须有 Schema 或模板约束 |
| Governed | 页面版本、变更、未解决问题、组件缺口、风险项必须记录 |

---

## 2. 标准目录结构

```text
ui-build-production/
├── 00_skill/
│   ├── SKILL.md
│   ├── ai-execution-rules.md
│   └── forbidden-rules.md
│
├── 01_input_contracts/
│   ├── page-contract.schema.json
│   ├── mock-data.schema.json
│   ├── visual-reference.notes.template.md
│   └── input-validation.report.md
│
├── 02_design_system_binding/
│   ├── design-system.binding.md
│   ├── component-resolution.rules.md
│   ├── token-resolution.rules.md
│   ├── pattern-resolution.rules.md
│   └── ds-gap-feedback.rules.md
│
├── 03_runtime_modes/
│   ├── html-delivery.acceptance.md
│   ├── react-runtime.acceptance.md
│   ├── vue-runtime.acceptance.md
│   ├── app-mapping.acceptance.md
│   └── existing-project.acceptance.md
│
├── 04_output_contracts/
│   ├── ui-output.schema.json
│   ├── handoff.schema.md
│   ├── component-usage.report.template.md
│   ├── token-usage.report.template.md
│   ├── pattern-match.report.template.md
│   └── unresolved-issues.template.md
│
├── 05_state_interaction/
│   ├── scenario-matrix.schema.md
│   ├── scenario-panel.rules.md
│   ├── event-map.schema.md
│   ├── feedback-map.schema.md
│   ├── error-recovery.rules.md
│   └── microcopy.rules.md
│
├── 06_visual_quality/
│   ├── visual-scorecard.md
│   ├── finance-ui-quality.rules.md
│   ├── reference-analysis.rules.md
│   └── demo-smell.detector.md
│
├── 07_platform_rules/
│   ├── responsive-rules.md
│   ├── app-rules.md
│   ├── h5-rules.md
│   ├── web-rules.md
│   ├── admin-rules.md
│   └── accessibility-minimum.md
│
├── 08_quality_gates/
│   ├── qa-severity.matrix.md
│   ├── visual-qa.report.template.md
│   ├── interaction-qa.report.template.md
│   ├── responsive-qa.report.template.md
│   ├── accessibility-qa.report.template.md
│   ├── dev-handoff-qa.report.template.md
│   └── release-decision.rules.md
│
├── 09_validation_scripts/
│   ├── check-page-contract.js
│   ├── check-token-usage.js
│   ├── check-component-usage.js
│   ├── check-state-matrix.js
│   ├── check-event-map.js
│   ├── check-output-completeness.js
│   └── package.scripts.json
│
└── 10_release/
    ├── page-version.md
    ├── change-log.md
    ├── impact-report.md
    ├── release-checklist.md
    └── migration-notes.md
```

---

## 3. 输入优先级与缺失处理

| 优先级 | 输入 | 用途 | 缺失处理 |
|---:|---|---|---|
| P0 | `page-contract.json` | 页面目标、角色、状态、字段、交互、风险 | Blocker，不允许直接生产正式页面 |
| P0 | `component-manifest.json` | 可用组件、变体、Props、States、限制 | Blocker，必须降级为 Draft 并记录 DS 缺口 |
| P0 | `tokens.json` | 视觉变量与平台 Mode | Blocker，禁止随机硬编码样式 |
| P0 | `pattern-registry.json` | 页面模板与布局结构 | Critical，允许生成但必须记录 pattern gap |
| P0 | `business-component-manifest.json` | 金融 / KYC / 钱包 / 审核等业务组件 | Critical，缺失时不得临时散写业务组件 |
| P1 | `icon-registry.json` | 图标语义、尺寸、状态 | Major，允许使用文字或占位，但必须记录 |
| P1 | `mock-data.json` | 状态演示和数据填充 | Major，允许生成 mock，但必须标记 synthetic |
| P1 | `visual-reference.notes.md` / 参考截图 | 提炼视觉方向，不复制品牌 | Optional，无参考图时使用 DS 默认视觉规则 |
| P2 | 旧页面 / 竞品页面 | 辅助判断信息层级和交互路径 | Optional，只能作为参考 |

### 3.1 输入缺失规则

```text
- 缺 Page Contract：禁止标记为 Production Delivery，只能输出 Contract Request。
- 缺 Tokens：禁止输出生产级页面，必须请求 Design System Token。
- 缺 Component Manifest：禁止重复造基础组件，只能输出组件缺口。
- 缺 Pattern Registry：允许使用默认布局，但必须标记 pattern-gap。
- 缺 Mock Data：允许使用合成数据，但必须在页面和报告中标记 mock-source: synthetic。
- 缺业务规则：不得脑补，必须在 unresolved-issues.md 中列出。
```

---

## 4. Page Contract Schema

页面生产必须由 `page-contract.json` 驱动。AI 必须先校验 Contract，校验通过后再开始页面实现。

### 4.1 `page-contract.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "PageContract",
  "type": "object",
  "required": [
    "page_id",
    "version",
    "platform",
    "runtime_mode",
    "goal",
    "role",
    "pattern",
    "sections",
    "states",
    "interactions",
    "risk_rules"
  ],
  "properties": {
    "page_id": {
      "type": "string",
      "pattern": "^[a-z0-9]+(-[a-z0-9]+)*$"
    },
    "page_name": {
      "type": "string"
    },
    "version": {
      "type": "string",
      "pattern": "^v\\d+\\.\\d+\\.\\d+$"
    },
    "platform": {
      "type": "string",
      "enum": ["app", "h5", "web", "admin"]
    },
    "runtime_mode": {
      "type": "string",
      "enum": ["html", "react", "vue", "app_mapping", "existing_project"]
    },
    "goal": {
      "type": "object",
      "required": ["primary_task", "success_criteria"],
      "properties": {
        "primary_task": {"type": "string"},
        "secondary_tasks": {"type": "array", "items": {"type": "string"}},
        "success_criteria": {"type": "array", "items": {"type": "string"}}
      }
    },
    "role": {
      "type": "object",
      "required": ["user_type", "permissions"],
      "properties": {
        "user_type": {"type": "string"},
        "permissions": {"type": "array", "items": {"type": "string"}},
        "restricted_actions": {"type": "array", "items": {"type": "string"}}
      }
    },
    "pattern": {
      "type": "string"
    },
    "sections": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["id", "priority", "purpose", "components"],
        "properties": {
          "id": {"type": "string"},
          "priority": {"type": "string", "enum": ["p0", "p1", "p2", "p3"]},
          "purpose": {"type": "string"},
          "components": {"type": "array", "items": {"type": "string"}},
          "visibility_rules": {"type": "array", "items": {"type": "string"}}
        }
      }
    },
    "fields": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "type", "label", "required"],
        "properties": {
          "name": {"type": "string"},
          "type": {"type": "string"},
          "label": {"type": "string"},
          "required": {"type": "boolean"},
          "validation": {"type": "array", "items": {"type": "string"}},
          "error_messages": {"type": "object"},
          "masking": {"type": "string"}
        }
      }
    },
    "states": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "string",
        "enum": [
          "default",
          "loading",
          "empty",
          "error",
          "disabled",
          "inputting",
          "validating",
          "submitting",
          "success",
          "failed",
          "permission_denied",
          "restricted",
          "reviewing",
          "pending"
        ]
      }
    },
    "interactions": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["event", "trigger", "feedback", "failure_recovery"],
        "properties": {
          "event": {"type": "string"},
          "trigger": {"type": "string"},
          "target": {"type": "string"},
          "feedback": {"type": "string"},
          "failure_recovery": {"type": "string"},
          "analytics_event": {"type": "string"}
        }
      }
    },
    "api": {
      "type": "object",
      "properties": {
        "mock_data_path": {"type": "string"},
        "endpoints": {"type": "array", "items": {"type": "string"}},
        "error_codes": {"type": "array", "items": {"type": "string"}}
      }
    },
    "risk_rules": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "severity", "message", "display_rule"],
        "properties": {
          "id": {"type": "string"},
          "severity": {"type": "string", "enum": ["info", "warning", "danger", "compliance"]},
          "message": {"type": "string"},
          "display_rule": {"type": "string"}
        }
      }
    }
  }
}
```

### 4.2 Page Contract 消费动作

| Contract 字段 | UI Build 动作 | 失败等级 |
|---|---|---:|
| `page_id` | 建立页面文件、状态文件、报告索引 | Major |
| `platform` | 加载平台规则和响应式断点 | Critical |
| `runtime_mode` | 选择 HTML / React / Vue / App Mapping 输出模式 | Critical |
| `goal.primary_task` | 确定首屏主视觉焦点和主操作 | Critical |
| `role.permissions` | 控制按钮、字段、入口显隐 | Critical |
| `pattern` | 匹配 Pattern Registry | Major |
| `sections` | 生成页面结构和信息层级 | Critical |
| `fields` | 生成表单、校验、错误提示 | Major |
| `states` | 生成场景矩阵和 Scenario Panel | Critical |
| `interactions` | 生成事件映射和反馈恢复 | Critical |
| `risk_rules` | 生成风险提示、二次确认、限制说明 | Blocker |

---

## 5. Mock Data Schema

生产级 UI 必须支持状态演示。Mock Data 不得只填正常数据，必须覆盖异常、空态、失败、权限、限制、审核中。

```json
{
  "page_id": "deposit-method-selection",
  "data_source": "synthetic | api_contract | product_contract",
  "scenarios": {
    "default": {},
    "loading": {},
    "empty": {},
    "error": {
      "code": "NETWORK_ERROR",
      "message": "Network unavailable. Please try again."
    },
    "restricted": {
      "reason": "KYC_REQUIRED",
      "action": "complete_verification"
    },
    "permission_denied": {
      "reason": "ROLE_NOT_ALLOWED"
    }
  }
}
```

| 规则 | 要求 |
|---|---|
| 数据真实性 | 可使用合成数据，但必须标记 `data_source` |
| 金额字段 | 必须包含 currency、precision、formatting rule |
| 敏感字段 | 必须定义 masking 规则，例如银行卡尾号、证件号 |
| 错误码 | 必须映射用户可理解文案和恢复动作 |
| 审核状态 | 必须避免无限 loading，展示下一步路径 |

---

## 6. Design System Binding

UI Build 必须消费 Design System，而不是绕过 Design System 自由生成。

### 6.1 读取顺序

```text
1. Read page-contract.json
2. Validate page-contract.schema.json
3. Read design-system ai-readable-index.json
4. Read tokens.json
5. Read component-manifest.json
6. Read business-component-manifest.json
7. Read icon-registry.json
8. Read pattern-registry.json
9. Match platform mode / density mode / brand mode
10. Build page
11. Run QA Gate
12. Output handoff package
```

### 6.2 组件解析规则

| 场景 | L5 处理 |
|---|---|
| 组件存在且变体满足 | 直接使用 Manifest 中的组件、变体、Props |
| 组件存在但状态缺失 | 使用最近可用状态，同时记录 `component-gap`，严重级别 Major |
| 组件存在但 Token 不满足 | 禁止页面内硬改，输出 DS token gap |
| 业务组件缺失 | 不允许散写复杂业务 UI，必须生成 `business-component-gap` |
| 临时 UI 必须存在 | 只允许 `local-composition`，必须声明不可复用原因和迁移计划 |

### 6.3 Token 解析规则

| 场景 | L5 处理 |
|---|---|
| 样式有 Semantic Token | 使用 Semantic Token |
| 组件内部样式 | 使用 Component Token |
| 页面临时装饰 | 优先使用现有 surface / border / shadow token |
| Token 缺失 | 不硬编码，写入 `token-gap` |
| 参考图颜色 | 只提取风格方向，不直接复制色值 |

### 6.4 Pattern 解析规则

| 场景 | L5 处理 |
|---|---|
| Contract 指定 Pattern | 优先使用指定 Pattern |
| Pattern 不完全匹配 | 使用最接近 Pattern，并记录差异 |
| Pattern 缺失 | 生成 `pattern-gap.report.md`，不得标记为完整 L5 |
| 金融操作页 | 必须包含金额、账户、风险、确认、状态反馈 |
| 审核页 | 必须包含审核对象、证据、历史、操作、审计日志 |

---

## 7. 页面搭建算法

AI 必须按顺序执行，禁止跳步。

| 步骤 | 动作 | 输出 | Fail 处理 |
|---:|---|---|---|
| 1 | 读取并校验 `Page Contract` | `input-validation.report.md` | Blocker 停止 |
| 2 | 判断平台和 Runtime Mode | `runtime-selection.report.md` | Critical 修复 |
| 3 | 匹配 Pattern | `pattern-match.report.md` | Major 记录缺口 |
| 4 | 选择组件 | `component-usage.report.md` | Critical 禁止散写 |
| 5 | 绑定 Token | `token-usage.report.md` | Blocker 禁止硬编码 |
| 6 | 规划视觉层级 | `visual-scorecard.md` | Major 修复 |
| 7 | 实现页面 | `pages/{platform}/...` | Critical 修复 |
| 8 | 补全状态 | `scenario.matrix.md` | Critical 修复 |
| 9 | 绑定真实交互 | `event-map.md` / `feedback-map.md` | Critical 修复 |
| 10 | 响应式与平台适配 | `responsive-qa.report.md` | Major / Critical |
| 11 | 执行 QA Gate | QA Reports | Blocker / Critical 不交付 |
| 12 | 输出 Handoff | `dev-handoff-notes.md` | Major 修复 |
| 13 | 释放版本 | `release-checklist.md` | 未通过不得 release |

---

## 8. Runtime Mode 验收标准

不得在同一交付中混用多个 Runtime Mode，除非明确说明主模式和映射模式。

| Mode | 输出 | 必须满足 | 禁止 |
|---|---|---|---|
| HTML Delivery Mode | `index.html`、`style.css`、`states.html` | 可打开、可交互、可切换状态、Token 化 CSS 变量 | 图片式假页面、无状态 |
| React Runtime Mode | TSX、Props、State、Route、API Client Mapping | 组件拆分、Props 类型、状态管理、错误边界 | 把全部 UI 写在一个大组件里 |
| Vue Runtime Mode | SFC、Props、Emits、Composable、Route | Props / Emits / Slots 清楚，状态可复用 | 内联随机样式 |
| App Mapping Mode | 页面结构、组件语义、状态、交互说明 | 能映射原生 App / Flutter / RN | 只给 HTML 不说明原生映射 |
| Existing Project Mode | 遵循已有目录、组件、样式、接口封装 | 不破坏项目架构 | 绕过现有组件库重新造轮子 |

### 8.1 HTML Delivery Mode 最小文件

```text
pages/app/page-name/
├── index.html
├── styles.css
├── states.js
├── interactions.js
└── README.md
```

| 文件 | 必须内容 |
|---|---|
| `index.html` | 语义结构、组件容器、无障碍基础属性 |
| `styles.css` | 只允许 CSS Variables / Token 映射，不允许随机色值 |
| `states.js` | 场景切换、loading、error、disabled、success 等 |
| `interactions.js` | 点击、弹窗、Toast、Sheet、表单校验 |
| `README.md` | 页面目标、运行方式、交互说明、已知限制 |

### 8.2 React Runtime Mode 最小文件

```text
pages/web/page-name/
├── PageName.tsx
├── PageName.types.ts
├── PageName.mock.ts
├── PageName.events.ts
├── PageName.qa.md
└── README.md
```

| 文件 | 必须内容 |
|---|---|
| `PageName.tsx` | 组合组件，不直接写复杂样式 |
| `PageName.types.ts` | Props、API DTO、状态类型 |
| `PageName.mock.ts` | 全状态 mock 数据 |
| `PageName.events.ts` | 事件名、触发条件、失败恢复 |
| `PageName.qa.md` | QA Gate 结果 |
| `README.md` | 开发交付说明 |

---

## 9. 输出契约：`ui-output.schema.json`

UI Build 输出必须能被检查，不能只交一个页面文件。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "UIBuildOutput",
  "type": "object",
  "required": [
    "page_id",
    "runtime_mode",
    "files",
    "reports",
    "qa_result",
    "release_decision"
  ],
  "properties": {
    "page_id": {"type": "string"},
    "runtime_mode": {
      "type": "string",
      "enum": ["html", "react", "vue", "app_mapping", "existing_project"]
    },
    "files": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["path", "type", "purpose"],
        "properties": {
          "path": {"type": "string"},
          "type": {"type": "string"},
          "purpose": {"type": "string"}
        }
      }
    },
    "reports": {
      "type": "object",
      "required": [
        "component_usage",
        "token_usage",
        "pattern_match",
        "scenario_matrix",
        "event_map",
        "visual_qa",
        "interaction_qa",
        "responsive_qa",
        "dev_handoff"
      ]
    },
    "qa_result": {
      "type": "object",
      "required": ["blocker", "critical", "major", "minor", "score"],
      "properties": {
        "blocker": {"type": "integer"},
        "critical": {"type": "integer"},
        "major": {"type": "integer"},
        "minor": {"type": "integer"},
        "score": {"type": "number"}
      }
    },
    "release_decision": {
      "type": "string",
      "enum": ["pass", "conditional_pass", "fail"]
    }
  }
}
```

---

## 10. Component Usage Report 模板

文件：`component-usage.report.md`

```md
# Component Usage Report

## Page
- Page ID:
- Platform:
- Runtime Mode:
- Pattern:

## Component Mapping
| UI Area | Component | Source | Variant | Size | State | Props | Events | Token Binding | Status |
|---|---|---|---|---|---|---|---|---|---|

## Local Composition
| Area | Reason | Reusable? | Migration Plan | Severity |
|---|---|---:|---|---|

## Component Gaps
| Gap ID | Missing Component / Variant / State | Impact | Suggested DS Update | Severity |
|---|---|---|---|---|

## Rules
- All Button / Input / Card / Dialog / Sheet must come from Manifest.
- Local composition cannot replace Core Component.
- Business UI must be promoted to Business Component if reused more than once.
```

### 10.1 判定规则

| 问题 | 严重级别 |
|---|---:|
| 页面重新写基础 Button / Input / Dialog | Critical |
| 页面临时覆盖组件颜色 / 圆角 / 高度 | Critical |
| 业务组件散落页面内且可复用 | Major |
| 组件变体缺失但未记录 gap | Major |
| Props / Event 未说明 | Major |

---

## 11. Token Usage Report 模板

文件：`token-usage.report.md`

```md
# Token Usage Report

## Token Sources
- Tokens File:
- Mode: theme / brand / density / platform / radius / typography
- CSS Variables Mapping:

## Token Usage Summary
| Category | Used Tokens | Missing Tokens | Hardcoded Count | Status |
|---|---:|---:|---:|---|
| Color |  |  |  |  |
| Typography |  |  |  |  |
| Spacing |  |  |  |  |
| Radius |  |  |  |  |
| Shadow |  |  |  |  |
| Motion |  |  |  |  |

## Hardcoded Scan
| File | Line | Hardcoded Value | Should Use Token | Severity |
|---|---:|---|---|---|

## Token Gaps
| Gap ID | Needed Token | Use Case | Suggested Name | Severity |
|---|---|---|---|---|
```

### 11.1 硬编码规则

| 类型 | 禁止示例 | 正确示例 | 严重级别 |
|---|---|---|---:|
| Color | `#1677ff` | `var(--color-action-primary-bg)` | Blocker |
| Spacing | `padding: 16px` | `var(--space-component-md)` | Major |
| Radius | `border-radius: 12px` | `var(--radius-card-md)` | Major |
| Shadow | `box-shadow: 0 4px 16px rgba(...)` | `var(--shadow-card-md)` | Major |
| Font | `font-size: 17px` | `var(--font-size-body-md)` | Major |

允许例外：

```text
- 仅在 Design System mapping 文件中允许出现原始值。
- 仅在 reset / normalize / browser compatibility 中允许必要低层样式。
- 例外必须写入 token-usage.report.md。
```

---

## 12. Pattern Match Report 模板

文件：`pattern-match.report.md`

```md
# Pattern Match Report

## Selected Pattern
- Pattern Name:
- Platform:
- Match Score: /100
- Reason:

## Contract Sections → Pattern Sections
| Contract Section | Pattern Section | Match | Adjustment | Severity |
|---|---|---:|---|---|

## Required Pattern States
| State | Implemented | Notes |
|---|---:|---|

## Pattern Gaps
| Gap | Impact | Suggested Pattern Update | Severity |
|---|---|---|---|
```

| Match Score | 处理 |
|---:|---|
| 90-100 | 可直接使用 |
| 75-89 | 可使用，但需记录调整 |
| 60-74 | Conditional，必须记录 pattern gap |
| < 60 | 不允许声明 Pattern Match Pass |

---

## 13. 状态矩阵与 Scenario Panel

生产级页面必须有状态演示，不允许只有 normal。

### 13.1 必需状态

| 状态 | 必须性 | UI 要求 | 缺失等级 |
|---|---:|---|---:|
| default | 必须 | 数据完整，主操作明确 | Blocker |
| loading | 必须 | Skeleton / Loading，保持布局稳定 | Critical |
| empty | 数据页必须 | 说明原因和下一步操作 | Major |
| error | 必须 | 说明错误、提供重试或解决路径 | Critical |
| disabled | 表单/操作必须 | 说明为什么不可用 | Major |
| inputting | 表单必须 | 字段变化、实时校验、按钮状态 | Major |
| validating | 表单必须 | 字段错误靠近字段展示 | Major |
| submitting | 表单必须 | 防重复提交，按钮 loading | Critical |
| success | 必须 | Toast / Result / 跳转说明 | Major |
| failed | 必须 | 错误码映射、可恢复动作 | Critical |
| permission_denied | 权限页必须 | 解释无权限，不暴露敏感信息 | Critical |
| restricted | 风控页必须 | 说明限制原因和解除路径 | Critical |
| reviewing / pending | 审核场景必须 | 异步状态，不无限 loading | Critical |

### 13.2 `scenario.matrix.md`

```md
# Scenario Matrix

| Scenario | Trigger | Data Source | UI Changes | Primary Action | Recovery Path | Implemented | Severity |
|---|---|---|---|---|---|---:|---|
| Default | Initial load success | mock.default |  |  |  | Yes | - |
| Loading | API pending | mock.loading |  | Disabled |  | Yes | Critical |
| API Failed | API error | mock.error |  | Retry | Retry API | Yes | Critical |
```

### 13.3 Scenario Panel 规则

HTML 原型或演示页必须在右下角加入场景切换面板，除非是生产运行代码。

```text
Scenario Panel:
- Default
- Loading
- Empty
- Field Error
- Submitting
- Success
- API Failed
- Permission Denied
- Restricted
- Reviewing
```

| 规则 | 要求 |
|---|---|
| 位置 | 右下角固定，不遮挡主操作 |
| 默认收起 | 页面初始不干扰演示 |
| 状态切换 | 必须真实改变 UI，不只改文字 |
| 表单状态 | 必须改变按钮 disabled / loading / error |
| 不进入生产 | React / Vue 生产模式不得保留调试面板 |

---

## 14. Event Map Schema

交互必须可执行、可反馈、可恢复。

文件：`event-map.md`

```md
# Event Map

| Event ID | Trigger | Source Component | Target | Condition | Loading | Success Feedback | Error Feedback | Recovery | Analytics | Severity |
|---|---|---|---|---|---|---|---|---|---|---|
| submit_deposit | Tap primary button | Button | API submitDeposit | form valid | button loading | result page | inline error + toast | retry / edit form | deposit_submit_click | Critical |
```

### 14.1 事件命名

```text
{domain}_{action}_{object}
```

示例：

```text
kyc_upload_document
bank_switch_selected_bank
agreement_continue_next_document
deposit_submit_request
withdraw_confirm_submit
```

### 14.2 事件级验收规则

| 事件类型 | 必须包含 |
|---|---|
| 表单提交 | loading、防重复提交、字段错误、API 错误、成功反馈 |
| 危险操作 | 二次确认、后果说明、取消路径 |
| 资金操作 | 金额、币种、账户、手续费、到账说明、风险提示 |
| 敏感字段变更 | 清空规则、确认弹窗、恢复路径 |
| 跳转 | 目标页面、失败兜底、返回路径 |
| 异步审核 | 提交成功、审核中、后续路径、通知方式 |

---

## 15. Feedback Map Schema

文件：`feedback-map.md`

```md
# Feedback Map

| Feedback ID | Trigger Event | Type | Placement | Message | Duration | Blocking | Recovery Action | Severity |
|---|---|---|---|---|---:|---:|---|---|
| deposit_success_toast | deposit_submit_request | Toast | top | Deposit request submitted. | 3000ms | No | View transaction | Major |
| exit_agreement_dialog | close_agreement | Dialog | center | Exit account opening? | - | Yes | Continue Reading / Exit | Critical |
```

| Feedback 类型 | 使用规则 |
|---|---|
| Toast | 轻量反馈，不承载复杂风险 |
| Inline Error | 字段错误靠近字段 |
| Alert / Banner | 页面级风险、限制、审核中 |
| Dialog | 中断型确认、危险操作、退出流程 |
| Bottom Sheet | App 选择器、轻量确认、操作列表 |
| Result Page | 成功 / 失败 / 审核中等流程终点 |

---

## 16. Microcopy 与风险文案规则

金融 / Broker 产品文案必须严谨，不允许为了好看弱化风险。

| 场景 | 文案要求 |
|---|---|
| 资金操作 | 明确金额、币种、手续费、账户、预计处理时间 |
| 审核中 | 不使用无限等待，说明后续路径 |
| 风控限制 | 说明限制原因、解除条件、下一步 |
| 协议签署 | 明确“阅读并接受后才能继续” |
| 退出流程 | 说明退出后果，保留继续路径 |
| 错误反馈 | 用户可理解，并提供恢复动作 |

禁止：

```text
- “Something went wrong” 但不说明下一步。
- “Please wait” 无限等待。
- 风险提示用极小灰字隐藏。
- 危险操作只用颜色表达，不提供文字说明。
- 改变产品业务规则来迁就页面好看。
```

---

## 17. 参考截图分析规则

当用户提供参考截图时，必须先提炼 UI DNA，不允许复制品牌、Logo、文案、专属插图。

```md
# Visual Reference Analysis

## 可借鉴
- Layout DNA:
- Color DNA:
- Typography DNA:
- Spacing DNA:
- Surface DNA:
- Component DNA:
- Interaction DNA:

## 不可复制
- Brand assets:
- Logo:
- Original copy:
- Proprietary illustration:
- Unique layout signature:

## 转换后的 UI 规则
- Token mapping:
- Component mapping:
- Pattern mapping:
- Interaction mapping:
```

| 维度 | 分析内容 |
|---|---|
| Layout DNA | 页面结构、模块节奏、首屏焦点、内容分组 |
| Color DNA | 背景、卡片、主色、状态色、边框、弱化层 |
| Typography DNA | 标题、主数字、正文、标签、辅助说明 |
| Spacing DNA | 页面边距、模块间距、卡片 padding、列表行高 |
| Surface DNA | 圆角、阴影、描边、玻璃感、层级关系 |
| Component DNA | Button、Input、Card、List、Tabs、Modal、Sheet |
| Interaction DNA | 主操作路径、反馈方式、二次确认方式 |
| Do Not Copy | 品牌资产、原文案、专属图形、独有布局 |

---

## 18. Visual Scorecard

L5 不是“看起来不错”，必须有可评估标准。

文件：`visual-scorecard.md`

| 评分项 | 权重 | Pass 标准 | Fail 表现 |
|---|---:|---|---|
| 主视觉焦点 | 15 | 首屏主任务明确，用户 3 秒内知道下一步 | 多个焦点抢占、主按钮不明显 |
| 信息层级 | 15 | Level 1 / 2 / 3 / 4 清楚 | 金额、状态、风险、操作混在一起 |
| 金融专业感 | 15 | 稳定、可信、低噪音、数字清晰 | 花哨、廉价、AI demo 感 |
| 组件一致性 | 10 | 全部使用 Manifest 组件 | 同类组件样式不一致 |
| Token 一致性 | 10 | 无随机色值和随机间距 | 大量硬编码 |
| 状态完整性 | 10 | 关键状态完整可切换 | 只有默认状态 |
| 交互真实度 | 10 | 关键路径可点击可反馈 | 假按钮、无恢复路径 |
| 移动端可用性 | 5 | 触控、阅读、安全区合理 | 按钮太小、键盘遮挡 |
| 响应式质量 | 5 | 断点布局稳定 | 宽度变化后破版 |
| Handoff 清晰度 | 5 | 开发能理解字段、事件、状态 | 只有视觉页面 |

### 18.1 分数门槛

| 分数 | 结论 |
|---:|---|
| 90-100 | L5 Pass，可交付 |
| 80-89 | Conditional Pass，允许交付但必须记录 minor / major |
| 70-79 | Fail，不允许标记 L5 |
| < 70 | Block，不允许交付 |

硬性规则：

```text
- 任意 Blocker = 0，直接 Fail。
- Critical >= 1，禁止交付。
- Major >= 5，禁止交付。
- Visual Score < 80，禁止标记生产级。
```

---

## 19. Demo Smell Detector

文件：`demo-smell.detector.md`

| Demo 感问题 | 表现 | 严重级别 | 修复方式 |
|---|---|---:|---|
| 随机渐变背景 | 与金融场景无关 | Major | 使用 surface / background token |
| 过度阴影 | 卡片漂浮、层级混乱 | Major | 使用 elevation token |
| 无真实数据结构 | 全是 lorem ipsum / mock 文案 | Critical | 使用 mock-data schema |
| 只有一个正常态 | 没有 loading / error / restricted | Critical | 补 Scenario Matrix |
| 假按钮 | 点击无反馈 | Critical | 补 Event Map |
| 表单无校验 | 错误无法演示 | Critical | 补 validation state |
| 风险信息隐藏 | 小灰字弱化合规风险 | Blocker | 使用 RiskWarning / Dialog |
| 每页组件不一致 | Button / Input 样式不同 | Critical | 回到 Component Manifest |
| 硬编码色值 | 随机 #hex | Blocker | 回到 Token |

---

## 20. 响应式与平台规则

### 20.1 断点规则

| 平台 | Breakpoint | 宽度范围 | 布局策略 |
|---|---:|---:|---|
| App Small | 320 | 320-374 | 单列、压缩辅助信息 |
| App Standard | 375 | 375-427 | 默认 App 设计基准 |
| App Large | 428 | 428-767 | 单列增强留白 |
| Tablet | 768 | 768-1023 | 双栏或增强卡片 |
| Web | 1024 | 1024-1439 | Sidebar / Content / Drawer |
| Wide Web | 1440 | 1440+ | 最大内容宽度约束，避免无限拉伸 |
| Admin | 1280 | 1280+ | 表格、筛选、批量操作、密集布局 |

### 20.2 App 规则

| 项 | 要求 |
|---|---|
| 触控 | 主要可点击区域不低于 44px |
| 底部操作 | 主按钮可固定底部，考虑安全区 |
| 键盘 | 输入场景避免键盘遮挡主操作 |
| 选择器 | 优先 Bottom Sheet |
| 信息层级 | 首屏突出主任务，避免过多卡片堆叠 |

### 20.3 H5 规则

| 项 | 要求 |
|---|---|
| 浏览器环境 | 考虑地址栏、安全区、分享、Deep Link |
| 扫码 / App 引导 | Web 到 App 必须提供 QR 或 Deep Link fallback |
| 表单 | 与 App 一致，但考虑浏览器自动填充 |

### 20.4 Web 规则

| 项 | 要求 |
|---|---|
| 布局 | 响应式 Sidebar / Topbar / Content |
| 表格 | 筛选、排序、分页、空态、错误态 |
| 详情 | 可用 Drawer / Detail Page |
| 键盘 | 基础可聚焦和可操作 |

### 20.5 Admin 规则

| 项 | 要求 |
|---|---|
| 密度 | 默认 compact / standard，不使用 App 大留白 |
| 审核流 | 操作、证据、历史、审计日志必须清楚 |
| 权限 | 按钮和字段必须根据角色显隐 |
| 批量操作 | 必须有选择、确认、失败回滚或部分成功反馈 |

---

## 21. Accessibility Minimum

L5 不是完整 WCAG 审计，但必须满足基础可用性。

| 类型 | 最低要求 |
|---|---|
| Button | 有可理解文本或 aria-label |
| Input | 有 label / helper / error 关联 |
| Dialog | 有标题、焦点管理、关闭方式 |
| Toast | 不承载必须确认的风险信息 |
| Color | 不能只靠颜色表达状态 |
| Focus | 键盘可见焦点 |
| Table | 表头明确，空态和加载态可理解 |
| Error | 错误靠近相关字段，提供恢复动作 |

### 21.1 A11y QA 模板

```md
# Accessibility QA Report

| Check | Result | Issue | Severity | Fix |
|---|---|---|---|---|
| Button labels | Pass / Fail |  |  |  |
| Form labels | Pass / Fail |  |  |  |
| Focus visible | Pass / Fail |  |  |  |
| Dialog semantics | Pass / Fail |  |  |  |
| Color-only state | Pass / Fail |  |  |  |
```

---

## 22. QA Severity Matrix

文件：`qa-severity.matrix.md`

| 等级 | 定义 | 是否允许交付 | 示例 |
|---|---|---:|---|
| Blocker | 违反业务、合规、安全、Token 硬规则，或页面无法运行 | 否 | 硬编码主色、风险提示缺失、资金操作缺确认 |
| Critical | 关键路径不可用、状态缺失、组件体系破坏 | 否 | 提交按钮无反馈、error 态缺失、重复造核心组件 |
| Major | 影响体验、维护、交付，但不阻断主流程 | 条件允许 | 某个边界状态缺失、Pattern match 较低 |
| Minor | 轻微瑕疵，不影响交付 | 允许 | 文案微调、局部间距小问题 |
| Info | 记录建议 | 允许 | 后续优化建议 |

### 22.1 Release Decision

| 条件 | 结论 |
|---|---|
| Blocker > 0 | Fail |
| Critical > 0 | Fail |
| Major >= 5 | Fail |
| Visual Score < 80 | Fail |
| 1-4 个 Major 且无 Blocker / Critical | Conditional Pass |
| 只有 Minor / Info | Pass |

---

## 23. QA Gate

| Gate | 检查项 | Blocker 条件 |
|---|---|---|
| Contract Gate | Page Contract 是否完整、是否通过 schema | 缺 Page Contract 或 P0 字段 |
| Visual Gate | 主视觉焦点、信息层级、金融专业感、低噪音 | Visual Score < 70 或风险信息被弱化 |
| Token Gate | 是否存在硬编码颜色、间距、圆角、阴影 | 生产页面出现硬编码关键样式 |
| Component Gate | 是否复用组件、是否临时造组件 | 重写 Core Component |
| Pattern Gate | 是否匹配 Pattern、是否记录缺口 | Pattern 缺失但未记录 |
| State Gate | 状态是否完整、场景是否可切换 | 缺 error / loading / submitting 等关键状态 |
| Interaction Gate | 触发、反馈、异常是否真实 | 关键按钮无反馈或无恢复路径 |
| Responsive Gate | 平台和断点是否稳定 | 主要断点破版或主操作不可用 |
| A11y Gate | 表单 label、focus、aria、键盘基础可用 | 关键表单不可理解或不可操作 |
| Dev Gate | 文件结构、组件映射、字段说明是否完整 | 无 handoff 说明 |
| Release Gate | QA 结果是否允许 release | Blocker / Critical 未清零 |

---

## 24. QA Report 模板

### 24.1 Visual QA Report

```md
# Visual QA Report

| Check | Weight | Result | Score | Issue | Severity | Fix |
|---|---:|---|---:|---|---|---|
| Primary visual focus | 15 | Pass / Fail |  |  |  |  |
| Information hierarchy | 15 | Pass / Fail |  |  |  |  |
| Financial professionalism | 15 | Pass / Fail |  |  |  |  |
| Component consistency | 10 | Pass / Fail |  |  |  |  |
| Token consistency | 10 | Pass / Fail |  |  |  |  |
| State completeness | 10 | Pass / Fail |  |  |  |  |
| Interaction realism | 10 | Pass / Fail |  |  |  |  |
| Mobile usability | 5 | Pass / Fail |  |  |  |  |
| Responsive quality | 5 | Pass / Fail |  |  |  |  |
| Handoff clarity | 5 | Pass / Fail |  |  |  |  |

Final Score:
Release Decision:
```

### 24.2 Interaction QA Report

```md
# Interaction QA Report

| Event ID | Trigger Works | Loading | Success Feedback | Error Feedback | Recovery | Duplicate Submit Prevented | Severity |
|---|---:|---:|---:|---:|---:|---:|---|
```

### 24.3 Responsive QA Report

```md
# Responsive QA Report

| Breakpoint | Layout Stable | Primary Action Visible | Text Readable | No Overflow | Issue | Severity |
|---|---:|---:|---:|---:|---|---|
| 320 |  |  |  |  |  |  |
| 375 |  |  |  |  |  |  |
| 428 |  |  |  |  |  |  |
| 768 |  |  |  |  |  |  |
| 1024 |  |  |  |  |  |  |
| 1440 |  |  |  |  |  |  |
```

### 24.4 Dev Handoff QA Report

```md
# Dev Handoff QA Report

| Check | Result | Issue | Severity | Fix |
|---|---|---|---|---|
| Page purpose clear | Pass / Fail |  |  |  |
| Component mapping complete | Pass / Fail |  |  |  |
| Token mapping complete | Pass / Fail |  |  |  |
| Event map complete | Pass / Fail |  |  |  |
| State matrix complete | Pass / Fail |  |  |  |
| API / mock notes clear | Pass / Fail |  |  |  |
| Risk rules clear | Pass / Fail |  |  |  |
| Known issues recorded | Pass / Fail |  |  |  |
```

---

## 25. Handoff Schema

文件：`dev-handoff-notes.md`

```md
# Dev Handoff Notes

## Page Summary
- Page ID:
- Page Name:
- Platform:
- Runtime Mode:
- Version:
- Primary Task:
- Release Decision:

## Source Inputs
| Input | Path | Version | Status |
|---|---|---|---|
| Page Contract |  |  |  |
| Tokens |  |  |  |
| Component Manifest |  |  |  |
| Pattern Registry |  |  |  |
| Mock Data |  |  |  |

## Component Mapping
| Area | Component | Variant | Props | Events | Notes |
|---|---|---|---|---|---|

## Token Mapping
| UI Element | Token | Purpose |
|---|---|---|

## States
| State | File / Scenario | Notes |
|---|---|---|

## Events
| Event ID | Trigger | Target | Success | Failure | Recovery |
|---|---|---|---|---|---|

## API / Data Notes
| Data Field | Type | Required | Display Rule | Masking |
|---|---|---:|---|---|

## Risk / Compliance Notes
| Rule | UI Display | Required User Action |
|---|---|---|

## QA Summary
| Gate | Result | Blocker | Critical | Major | Minor |
|---|---|---:|---:|---:|---:|

## Known Issues
| Issue | Severity | Owner | Required Before Release |
|---|---|---|---:|
```

---

## 26. 自动化校验建议

自动化脚本不是必须一次性全部实现，但 L5 Skill 必须定义脚本入口、失败条件和检查范围。

### 26.1 `package.scripts.json`

```json
{
  "scripts": {
    "qa:contract": "node scripts/check-page-contract.js",
    "qa:tokens": "node scripts/check-token-usage.js",
    "qa:components": "node scripts/check-component-usage.js",
    "qa:states": "node scripts/check-state-matrix.js",
    "qa:events": "node scripts/check-event-map.js",
    "qa:output": "node scripts/check-output-completeness.js",
    "qa:ui": "npm run qa:contract && npm run qa:tokens && npm run qa:components && npm run qa:states && npm run qa:events && npm run qa:output"
  }
}
```

### 26.2 `check-page-contract.js` 检查范围

```text
- page-contract.json exists
- required fields exist
- platform enum valid
- runtime_mode enum valid
- states include default
- risk_rules exist for financial / compliance pages
- interactions include feedback and failure_recovery
```

### 26.3 `check-token-usage.js` 检查范围

```text
- scan CSS / TSX / Vue files
- detect hex colors
- detect raw rgba shadows
- detect repeated px values outside token mapping
- detect inline style overrides
- output token-usage.report.md
- fail if Blocker found
```

### 26.4 `check-component-usage.js` 检查范围

```text
- compare used components with component-manifest.json
- detect local Button / Input / Dialog / Card implementations
- detect missing props documentation
- detect unregistered business components
- output component-usage.report.md
```

### 26.5 `check-state-matrix.js` 检查范围

```text
- required states exist in scenario.matrix.md
- scenario panel includes required states for HTML Delivery Mode
- submitting state disables duplicate submit
- error state includes recovery path
- restricted state includes reason and next step
```

### 26.6 `check-event-map.js` 检查范围

```text
- every primary action has event id
- every event has trigger / feedback / failure_recovery
- dangerous operation has confirm dialog
- fund operation shows amount / currency / account / fee if applicable
```

### 26.7 `check-output-completeness.js` 检查范围

```text
- required files exist by runtime mode
- QA reports exist
- dev-handoff-notes.md exists
- unresolved-issues.md exists
- release decision exists
```

---

## 27. Forbidden Rules

```text
- 禁止不读取 Page Contract 直接生成页面。
- 禁止 Page Contract 缺 P0 字段仍标记为 Production Delivery。
- 禁止复制参考图品牌、Logo、文案、插图。
- 禁止硬编码随机颜色、字号、间距、圆角、阴影。
- 禁止每页重新写一套 Button / Card / Input / Dialog。
- 禁止只实现默认状态。
- 禁止关键按钮不可点击、无反馈、无失败恢复。
- 禁止把金融风险信息弱化到用户看不见。
- 禁止只靠颜色表达风险，必须有文字或图标辅助。
- 禁止为了好看修改业务规则。
- 禁止输出不可运行的静态截图式页面。
- 禁止没有 handoff 说明就标记交付完成。
- 禁止有 Blocker / Critical 仍然 release。
- 禁止把 Scenario Panel 带入正式生产运行代码。
- 禁止使用未经注册的业务组件替代 Design System 组件。
```

---

## 28. AI 执行命令

### 28.1 搭建 L5 生产级页面

```txt
使用 UI Build Production Skill v3.0.0-L5 搭建页面。

输入：
- Page Contract:
- Platform:
- Runtime Mode:
- Design System Path:
- Tokens:
- Component Manifest:
- Business Component Manifest:
- Icon Registry:
- Pattern Registry:
- Mock Data:
- Reference Screenshots:

执行要求：
1. 先读取并校验 page-contract.json，不通过不得直接写页面。
2. 读取 Design System AI Runtime Index，解析 tokens、components、business components、icons、patterns。
3. 匹配平台规则、Mode、Pattern，输出 pattern-match.report.md。
4. 选择组件并生成 component-usage.report.md。
5. 绑定 Token 并生成 token-usage.report.md，禁止硬编码。
6. 搭建页面并覆盖 Page Contract 要求的全部状态。
7. 关键交互必须可点击、可反馈、可恢复，输出 event-map.md 和 feedback-map.md。
8. 输出 Scenario Matrix 和 Scenario Panel。
9. 执行 Visual / Token / Component / State / Interaction / Responsive / A11y / Dev QA。
10. 输出 dev-handoff-notes.md、unresolved-issues.md、release-checklist.md。
11. 出现 Blocker / Critical 不允许标记交付完成。
```

### 28.2 优化已有页面到 L5

```txt
使用 UI Build Production Skill v3.0.0-L5 优化当前页面。
目标：从 Demo / L1 / L2 页面提升到 L5 生产级 UI。

必须检查：
- Page Contract 是否完整
- Design System Token 是否绑定
- Component Manifest 是否复用
- Pattern 是否匹配
- 状态矩阵是否完整
- 关键交互是否真实
- 是否存在 Demo 感
- 是否符合平台规则
- 是否有 Handoff

输出：
1. 问题清单，按 Blocker / Critical / Major / Minor 分类。
2. 修复方案。
3. 修复后的页面代码。
4. QA Report。
5. Release Decision。
```

### 28.3 执行 L5 UI QA

```txt
使用 UI Build Production Skill v3.0.0-L5 对当前页面执行 QA。

检查：
- Contract Gate
- Visual Gate
- Token Gate
- Component Gate
- Pattern Gate
- State Gate
- Interaction Gate
- Responsive Gate
- A11y Gate
- Dev Handoff Gate
- Release Gate

输出表格：
- Gate
- Result
- Severity
- Issue
- Fix
- Owner
- Release Decision

规则：
- Blocker > 0：Fail
- Critical > 0：Fail
- Major >= 5：Fail
- Visual Score < 80：Fail
- 只有 Minor / Info：Pass
```

---

## 29. 生产级完成标准

| 标准 | 必须满足 |
|---|---:|
| 页面由 Page Contract 驱动 | 是 |
| Page Contract 有 Schema 并通过校验 | 是 |
| 使用 Design System Token | 是 |
| 组件来自 Component Manifest | 是 |
| 业务组件来自 Business Component Manifest | 是 |
| 页面结构来自 Pattern Registry | 是 |
| 图标来自 Icon Registry | 是 |
| 状态矩阵完整并可演示 | 是 |
| Scenario Panel 可切换关键状态 | 是，HTML Delivery Mode 必须 |
| 关键交互可点击、可反馈、可恢复 | 是 |
| Event Map / Feedback Map 完整 | 是 |
| Visual Score >= 80 | 是 |
| App / H5 / Web / Admin 平台规则正确 | 是 |
| 响应式断点稳定 | 是 |
| A11y 最低要求通过 | 是 |
| QA Report 完整 | 是 |
| Handoff 可被开发理解 | 是 |
| Blocker = 0 | 是 |
| Critical = 0 | 是 |
| Release Decision 可追踪 | 是 |

---

## 30. 最终定义

```text
UI Build Production Skill v3.0.0-L5
= Page Contract Schema
+ Design System Binding
+ Component First Build
+ Token Bound Styling
+ Pattern Based Layout
+ Scenario State Matrix
+ Real Interaction Event Map
+ Visual Scorecard
+ Responsive Platform Rules
+ A11y Minimum
+ QA Severity Gate
+ Dev Handoff Contract
+ Release Decision Rules
```

它不是“AI 画页面”的 Skill，而是 **可执行、可验证、可审计、可交付开发、可长期维护的 L5 生产级 UI 页面组装 Skill**。
