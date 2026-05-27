---
name: ui-reference-adaptation
description: >
  Use only as a UI Build Production add-on when tasks mention Mobbin, screenshots, competitor UI, reference pages,
  visual style adaptation, app/web references, Dribbble, Behance, or Figma Community examples.
  Inputs include reference images or links, target business context, Page Contract, Design System, tokens, components, patterns, and prohibited-copy constraints.
  Outputs UI Build Reference Input, Visual DNA, similarity-risk analysis, token/component/pattern mapping, and business adaptation notes for UI Build.
  Do not use as a fourth core skill, to copy brand assets or pixel layouts, to replace Page Contracts, or to generate final UI directly.
---

# UI Reference Adaptation Add-on Skill v1.0.0-L5

> File: `.codex/skills/ui-build-production/addons/reference-adaptation/SKILL.md`
> Version: `v1.0.0-L5`
> Level: `L5 Add-on / Production Reference Adaptation Skill`
> Parent Skill: `UI Build Production Skill v3.0.0-L5`
> Depends on:
> - `AI Product Production Delivery Skill v3.0.0-L5`
> - `Design System Engineering Skill v3.0.0-L5`
> - `UI Build Production Skill v3.0.0-L5`
>
> Purpose: 将 Mobbin / App Screenshot / Web Reference / Dribbble / Behance / Figma Community / 竞品截图等参考案例，转化为符合项目 Page Contract、Design System、Token、Component Manifest、Pattern Registry 和业务规则的生产级 UI 参考输入。
>
> Core Flow:
> `Reference Input → Visual DNA → Similarity Risk → Token Mapping → Component Mapping → Pattern Mapping → Business Adaptation → UI Build Input`

---

## 0. Skill 定位

本 Skill 不是第 4 个核心生产链路 Skill，而是 `UI Build Production Skill` 的参考案例转化 Add-on。

它只负责：

```text
参考案例分析
→ 提炼可借鉴的 Layout / Visual / Component / Interaction DNA
→ 排除不可复制的品牌资产和独有表达
→ 映射到项目 Token / Component / Pattern
→ 输出给 UI Build 使用的结构化输入
```

它不负责：

```text
- 不定义业务规则
- 不生成 Product Kernel
- 不替代 Page Contract
- 不治理完整 Design System
- 不直接发布最终页面
- 不绕过 Component Manifest 造新组件
```

---

## 1. L5 Add-on 标准

| L5 Add-on 能力 | 必须满足 |
|---|---|
| Input Contract | 参考来源、平台、业务目标、禁止复制项必须结构化 |
| Visual DNA Schema | Layout、Color、Typography、Surface、Motion、Interaction 必须结构化 |
| Similarity Risk Control | 必须输出可借鉴项、不可复制项、相似度风险 |
| Token Mapping | 参考视觉必须映射到项目 Token，禁止硬编码 |
| Component Mapping | 参考组件必须映射到项目 Component Manifest |
| Pattern Mapping | 参考布局必须映射到 Pattern Registry |
| Business Adaptation | 参考业务必须转化为项目业务语义 |
| QA Blocking | 有 Blocker / Critical / Major / Minor 判断 |
| UI Build Ready | 输出必须能被 UI Build Skill 消费 |
| No Blind Copy | 禁止复制品牌、Logo、图标、文案、专属插图、像素级布局 |

---

## 2. 标准目录

```text
.codex/skills/ui-build-production/addons/reference-adaptation/
├── SKILL.md
├── schemas/
│   ├── reference-input.schema.json
│   ├── visual-dna.schema.json
│   ├── token-mapping.schema.json
│   ├── component-mapping.schema.json
│   ├── pattern-mapping.schema.json
│   ├── business-adaptation.schema.json
│   └── reference-output.schema.json
├── templates/
│   ├── reference-analysis.report.md
│   ├── similarity-risk.checklist.md
│   ├── token-mapping.report.md
│   ├── component-mapping.report.md
│   ├── pattern-mapping.report.md
│   ├── business-adaptation.matrix.md
│   ├── ui-build-reference-input.md
│   └── reference-qa.report.md
├── rules/
│   ├── source-type.rules.md
│   ├── style-transfer-boundary.md
│   ├── financial-ui-adaptation.rules.md
│   ├── multi-platform-adaptation.rules.md
│   └── forbidden-copy.rules.md
├── qa/
│   ├── qa-severity.matrix.md
│   ├── similarity-risk.gate.md
│   ├── design-system-binding.gate.md
│   └── ui-build-readiness.gate.md
└── examples/
    ├── mobbin-wallet-to-broker-wallet.md
    ├── banking-card-to-trading-account-card.md
    └── app-form-to-kyc-form.md
```

---

## 3. 输入标准

### 3.1 Reference Input

| 字段 | 说明 | 必须 |
|---|---|---:|
| `reference_id` | 参考案例唯一 ID | 是 |
| `source_type` | mobbin / screenshot / app_store / web / dribbble / behance / figma_community / competitor | 是 |
| `source_description` | 参考案例说明 | 是 |
| `platform` | app / h5 / web / admin | 是 |
| `target_page` | 要转化到的目标页面 | 是 |
| `target_business` | 项目业务场景 | 是 |
| `page_contract` | 对应 Page Contract 路径或摘要 | 是 |
| `design_system` | 项目 Design System 路径或摘要 | 是 |
| `allowed_inspiration` | 允许借鉴内容 | 是 |
| `forbidden_copy` | 禁止复制内容 | 是 |
| `risk_level` | low / medium / high | 是 |
| `notes` | 补充说明 | 否 |

### 3.2 `reference-input.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Reference Input Schema",
  "type": "object",
  "required": [
    "reference_id",
    "source_type",
    "source_description",
    "platform",
    "target_page",
    "target_business",
    "page_contract",
    "design_system",
    "allowed_inspiration",
    "forbidden_copy",
    "risk_level"
  ],
  "properties": {
    "reference_id": {
      "type": "string",
      "pattern": "^[a-z0-9_\\-]+$"
    },
    "source_type": {
      "enum": [
        "mobbin",
        "screenshot",
        "app_store",
        "web",
        "dribbble",
        "behance",
        "figma_community",
        "competitor",
        "internal_legacy"
      ]
    },
    "source_description": {
      "type": "string"
    },
    "platform": {
      "enum": ["app", "h5", "web", "admin"]
    },
    "target_page": {
      "type": "string"
    },
    "target_business": {
      "type": "string"
    },
    "page_contract": {
      "type": "string"
    },
    "design_system": {
      "type": "string"
    },
    "allowed_inspiration": {
      "type": "array",
      "items": {
        "enum": [
          "layout_rhythm",
          "information_hierarchy",
          "interaction_pattern",
          "component_composition",
          "spacing_strategy",
          "data_visualization_pattern",
          "surface_treatment",
          "content_grouping",
          "state_feedback_pattern"
        ]
      }
    },
    "forbidden_copy": {
      "type": "array",
      "items": {
        "enum": [
          "logo",
          "brand_color",
          "brand_gradient",
          "proprietary_icon",
          "proprietary_illustration",
          "exact_copy",
          "original_copywriting",
          "unique_visual_motif",
          "pixel_level_layout",
          "trade_dress"
        ]
      },
      "minItems": 1
    },
    "risk_level": {
      "enum": ["low", "medium", "high"]
    },
    "notes": {
      "type": "string"
    }
  }
}
```

---

## 4. Reference Source Rules

不同参考来源需要不同处理方式。

| 来源 | 可借鉴 | 高风险点 | 处理规则 |
|---|---|---|---|
| Mobbin | 信息架构、交互节奏、平台模式 | App 原品牌识别度 | 只提炼结构，不复刻视觉 |
| Dribbble | 情绪、质感、局部视觉 | Demo 感、不可开发、过度装饰 | 只借鉴氛围，不直接落地 |
| Behance | 品牌叙事、视觉系统 | 品牌资产、强风格化 | 必须回到项目 DS |
| App Store Screenshot | 商业表达、首屏卖点 | 宣传图非真实产品 UI | 只借鉴表达层级 |
| Web Dashboard | 数据布局、导航、筛选 | SaaS 结构不适配金融业务 | 先转业务再转 UI |
| Competitor Screenshot | 行业模式、字段组织 | 抄袭、同质化、品牌侵权 | 必须做 Similarity Risk |
| Internal Legacy | 历史业务、字段、交互 | 旧问题延续 | 只继承有效规则 |

---

## 5. Visual DNA 分析

Visual DNA 必须结构化输出，不能只写“高级、简洁、金融感”。

### 5.1 Visual DNA 维度

| 维度 | 分析内容 |
|---|---|
| Layout DNA | 页面骨架、区域顺序、首屏焦点、模块节奏 |
| Information DNA | 信息优先级、主次层级、数据密度 |
| Color DNA | 背景、表面、主色、状态色、弱化色 |
| Typography DNA | 标题、金额、正文、标签、说明文字 |
| Spacing DNA | 页面边距、卡片间距、列表行高、操作区留白 |
| Surface DNA | 卡片、描边、阴影、玻璃感、层级 |
| Component DNA | Button、Input、Card、List、Tab、Dialog、Sheet |
| Interaction DNA | 主路径、反馈方式、二次确认、状态切换 |
| Motion DNA | 过渡、加载、微交互、动效克制程度 |
| Platform DNA | iOS / Android / Web / Admin 的平台习惯 |

### 5.2 `visual-dna.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Visual DNA Schema",
  "type": "object",
  "required": [
    "layout",
    "information",
    "color",
    "typography",
    "spacing",
    "surface",
    "components",
    "interaction",
    "platform",
    "adaptation_summary"
  ],
  "properties": {
    "layout": {
      "type": "object",
      "required": ["structure", "primary_focus", "section_order", "rhythm"],
      "properties": {
        "structure": {"type": "string"},
        "primary_focus": {"type": "string"},
        "section_order": {"type": "array", "items": {"type": "string"}},
        "rhythm": {"type": "string"}
      }
    },
    "information": {
      "type": "object",
      "required": ["priority", "density", "data_emphasis"],
      "properties": {
        "priority": {"type": "array", "items": {"type": "string"}},
        "density": {"enum": ["compact", "standard", "spacious"]},
        "data_emphasis": {"type": "string"}
      }
    },
    "color": {
      "type": "object",
      "required": ["background_strategy", "surface_strategy", "status_strategy"],
      "properties": {
        "background_strategy": {"type": "string"},
        "surface_strategy": {"type": "string"},
        "status_strategy": {"type": "string"},
        "do_not_copy": {"type": "array", "items": {"type": "string"}}
      }
    },
    "typography": {
      "type": "object",
      "required": ["hierarchy", "number_treatment", "label_treatment"],
      "properties": {
        "hierarchy": {"type": "string"},
        "number_treatment": {"type": "string"},
        "label_treatment": {"type": "string"}
      }
    },
    "spacing": {
      "type": "object",
      "required": ["page_margin", "section_gap", "card_padding"],
      "properties": {
        "page_margin": {"type": "string"},
        "section_gap": {"type": "string"},
        "card_padding": {"type": "string"}
      }
    },
    "surface": {
      "type": "object",
      "required": ["card_style", "elevation", "border_usage"],
      "properties": {
        "card_style": {"type": "string"},
        "elevation": {"type": "string"},
        "border_usage": {"type": "string"}
      }
    },
    "components": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["reference_component", "purpose", "adaptation_rule"],
        "properties": {
          "reference_component": {"type": "string"},
          "purpose": {"type": "string"},
          "adaptation_rule": {"type": "string"}
        }
      }
    },
    "interaction": {
      "type": "object",
      "required": ["primary_flow", "feedback_pattern", "error_pattern"],
      "properties": {
        "primary_flow": {"type": "string"},
        "feedback_pattern": {"type": "string"},
        "error_pattern": {"type": "string"}
      }
    },
    "platform": {
      "type": "object",
      "required": ["platform_rule", "adaptation_note"],
      "properties": {
        "platform_rule": {"type": "string"},
        "adaptation_note": {"type": "string"}
      }
    },
    "adaptation_summary": {
      "type": "string"
    }
  }
}
```

---

## 6. Similarity Risk Gate

参考案例转化必须先过相似度风险检查。

### 6.1 不可复制清单

```text
- Logo
- 品牌色
- 专属渐变
- 专属插图
- 原始图标
- 原始文案
- 独有视觉符号
- 像素级布局
- 独特营销构图
- 明显的 trade dress
```

### 6.2 可借鉴清单

```text
- 信息层级
- 页面节奏
- 交互模式
- 表单组织方式
- 状态反馈方式
- 数据可读性策略
- 模块分组方式
- 平台习惯
- 金融产品可信度表达
```

### 6.3 QA Severity

| Severity | 定义 | 是否阻断 |
|---|---|---:|
| Blocker | 复制品牌资产、Logo、原图标、原文案、像素级复刻 | 是 |
| Critical | 视觉相似度过高，用户明显能识别来源 | 是 |
| Major | 借鉴过多，项目 DS 特征不足 | 条件阻断 |
| Minor | 个别布局相似，但已完成 Token / Component 改写 | 否 |
| Info | 仅作为灵感参考 | 否 |

### 6.4 Similarity Risk Checklist

| 检查项 | 结果 | 严重级别 | 修复方式 |
|---|---|---|---|
| 是否复制 Logo | Pass / Fail | Blocker | 删除并替换项目品牌 |
| 是否复制品牌主色 | Pass / Fail | Blocker | 映射项目 brand token |
| 是否复制原始图标 | Pass / Fail | Blocker | 替换项目 icon registry |
| 是否复制原文案 | Pass / Fail | Blocker | 重写项目业务文案 |
| 是否像素级复刻布局 | Pass / Fail | Critical | 调整节奏、间距、模块比例 |
| 是否有项目 DS 特征 | Pass / Fail | Major | 增强 token / component 绑定 |
| 是否符合业务语义 | Pass / Fail | Major | 回到 Page Contract |

---

## 7. Token Mapping

参考案例的视觉特征必须映射到项目 Token，禁止输出固定数值。

### 7.1 映射规则

| Reference 视觉 | 项目 Token 映射 |
|---|---|
| 背景层级 | `color.bg.page` / `color.bg.surface` |
| 卡片表面 | `color.surface.primary` / `color.surface.elevated` |
| 主操作色 | `color.action.primary.bg` |
| 弱化文字 | `color.text.secondary` / `color.text.tertiary` |
| 状态色 | `color.status.success` / `color.status.warning` / `color.status.danger` |
| 卡片圆角 | `radius.card.md` / `radius.card.lg` |
| 按钮圆角 | `radius.control.md` / `radius.control.pill` |
| 页面边距 | `space.layout.page` |
| 区块间距 | `space.layout.section` |
| 组件间距 | `space.component.gap` |
| 阴影 | `shadow.card.md` / `shadow.popover.md` |
| 动效 | `motion.duration.fast` / `motion.easing.standard` |

### 7.2 `token-mapping.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Token Mapping Schema",
  "type": "object",
  "required": ["mappings", "unmapped_items", "hardcoded_risk"],
  "properties": {
    "mappings": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["reference_trait", "project_token", "usage", "confidence"],
        "properties": {
          "reference_trait": {"type": "string"},
          "project_token": {"type": "string"},
          "usage": {"type": "string"},
          "confidence": {"enum": ["high", "medium", "low"]}
        }
      }
    },
    "unmapped_items": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["item", "reason", "recommendation"],
        "properties": {
          "item": {"type": "string"},
          "reason": {"type": "string"},
          "recommendation": {"type": "string"}
        }
      }
    },
    "hardcoded_risk": {
      "enum": ["none", "low", "medium", "high"]
    }
  }
}
```

### 7.3 Token Mapping 输出模板

```md
# Token Mapping Report

| Reference Trait | Project Token | Usage | Confidence | Notes |
|---|---|---|---|---|
| Large rounded card | `radius.card.lg` | Account summary card | High | 使用项目卡片圆角，不复制参考圆角数值 |
| Soft surface background | `color.bg.surface` | Form area | High | 映射项目表面色 |
| Primary CTA color | `color.action.primary.bg` | Submit button | High | 禁止使用参考品牌色 |

## Unmapped Items

| Item | Reason | Recommendation |
|---|---|---|
| Glass highlight effect | DS 无对应 shadow/token | 回写 Design System Gap，不在页面硬写 |
```

---

## 8. Component Mapping

参考组件必须映射到项目组件，不允许页面内重新造组件。

### 8.1 映射策略

| Reference Component | 项目映射方式 |
|---|---|
| Primary Button | `Button` |
| Card Summary | `Card` / `BalanceSummaryCard` / `TradingAccountCard` |
| Wallet Method Row | `MethodCard` / `DepositMethodCard` |
| Bank Selector | `BankSelector` |
| Status Pill | `Badge` / `StatusTag` |
| Bottom CTA | `FixedActionBar` / `Button fullWidth` |
| Warning Box | `RiskWarningBanner` |
| Step Flow | `Stepper` / `ProcessTimeline` |
| Dialog Confirm | `Dialog` / `BottomSheet` |
| Transaction Record | `TransactionTimeline` / `ListItem` |

### 8.2 `component-mapping.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Component Mapping Schema",
  "type": "object",
  "required": ["mappings", "component_gaps", "forbidden_new_components"],
  "properties": {
    "mappings": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "reference_component",
          "project_component",
          "variant",
          "props",
          "state",
          "event",
          "confidence"
        ],
        "properties": {
          "reference_component": {"type": "string"},
          "project_component": {"type": "string"},
          "variant": {"type": "string"},
          "props": {"type": "array", "items": {"type": "string"}},
          "state": {"type": "array", "items": {"type": "string"}},
          "event": {"type": "array", "items": {"type": "string"}},
          "confidence": {"enum": ["high", "medium", "low"]}
        }
      }
    },
    "component_gaps": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["gap", "reason", "ds_request"],
        "properties": {
          "gap": {"type": "string"},
          "reason": {"type": "string"},
          "ds_request": {"type": "string"}
        }
      }
    },
    "forbidden_new_components": {
      "type": "boolean"
    }
  }
}
```

### 8.3 Component Gap 规则

```text
- 组件不存在：不得在页面内随意新建，必须写入 design-system-gap.log。
- 组件存在但缺变体：不得硬改样式，必须请求 DS 增加 variant。
- 业务组件缺失：可先用组合组件表达，但必须标记为 temporary composition。
- 参考组件过于装饰化：不映射，转为项目专业金融表达。
```

---

## 9. Pattern Mapping

参考布局必须映射到项目 Pattern Registry。

### 9.1 常见映射

| Reference Layout | Project Pattern |
|---|---|
| App onboarding form | `AppFormPage` |
| Wallet operation page | `AppFinancialOperationPage` |
| Agreement reading flow | `AppProcessPage` |
| Dashboard summary | `DashboardPage` |
| Record list | `ListPage` |
| Account detail | `DetailPage` |
| Admin review table | `AdminReviewPage` |
| Settings form | `SettingsPage` |
| Error / Empty | `EmptyErrorPage` |

### 9.2 `pattern-mapping.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Pattern Mapping Schema",
  "type": "object",
  "required": ["selected_pattern", "reference_layout", "project_sections", "forbidden_layout_copy"],
  "properties": {
    "selected_pattern": {
      "type": "string"
    },
    "reference_layout": {
      "type": "string"
    },
    "project_sections": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["section", "purpose", "source_inspiration"],
        "properties": {
          "section": {"type": "string"},
          "purpose": {"type": "string"},
          "source_inspiration": {"type": "string"}
        }
      }
    },
    "forbidden_layout_copy": {
      "type": "boolean"
    },
    "notes": {
      "type": "string"
    }
  }
}
```

---

## 10. Business Adaptation

参考案例必须转换业务语义，不能只换皮。

### 10.1 转化规则

| Reference Business | Project Business |
|---|---|
| Crypto Wallet | Broker Wallet / Trading Wallet / IB Wallet |
| Banking Card | Bank Account / Withdrawal Account |
| Investment Portfolio | Trading Account Summary / Copy Trading Portfolio |
| Payment Method | Deposit Method / Withdrawal Method |
| Identity Verification | KYC / POA / Video Verification |
| Rewards / Points | IB Commission / Rebate / Invite Link |
| Subscription Plan | Account Type / Trading Group |
| Activity Feed | Transaction Timeline / Audit Log |

### 10.2 `business-adaptation.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Business Adaptation Schema",
  "type": "object",
  "required": [
    "reference_business",
    "target_business",
    "page_contract_alignment",
    "field_mapping",
    "state_mapping",
    "risk_mapping"
  ],
  "properties": {
    "reference_business": {"type": "string"},
    "target_business": {"type": "string"},
    "page_contract_alignment": {"type": "string"},
    "field_mapping": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["reference_field", "target_field", "rule"],
        "properties": {
          "reference_field": {"type": "string"},
          "target_field": {"type": "string"},
          "rule": {"type": "string"}
        }
      }
    },
    "state_mapping": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["reference_state", "target_state", "feedback"],
        "properties": {
          "reference_state": {"type": "string"},
          "target_state": {"type": "string"},
          "feedback": {"type": "string"}
        }
      }
    },
    "risk_mapping": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["risk", "project_rule"],
        "properties": {
          "risk": {"type": "string"},
          "project_rule": {"type": "string"}
        }
      }
    }
  }
}
```

---

## 11. Financial UI Adaptation Rules

金融 / Broker 产品参考转化时必须遵守以下规则。

| 维度 | 规则 |
|---|---|
| 金额展示 | 金额、币种、小数、正负、状态必须清晰 |
| 风险提示 | 风险、失败、限制、审核中不能弱化 |
| 操作确认 | 资金、银行卡、证件、协议、审核必须有明确反馈 |
| 数据可信 | 使用真实字段结构，不用虚假 marketing 数据 |
| 状态完整 | default / loading / error / empty / success / pending / restricted |
| 安全感 | 卡片、列表、表单要稳定、可读、少装饰 |
| 误操作控制 | 危险操作、敏感切换必须二次确认 |
| 合规文案 | 不夸大收益，不弱化风险，不误导用户 |

---

## 12. Multi-platform Adaptation

| 平台 | 参考转化重点 |
|---|---|
| App | 单手操作、底部 CTA、安全区、Bottom Sheet、44px 触控 |
| H5 | App-like 体验、浏览器兼容、扫码/Deep Link、轻量分享 |
| Web | 响应式、Sidebar / Topbar、筛选、详情 Drawer |
| Admin | 表格密度、权限、审核流、批量操作、审计日志 |

---

## 13. Reference Output Contract

最终输出必须给 UI Build 使用，而不是直接作为最终页面。

### 13.1 `reference-output.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Reference Output Schema",
  "type": "object",
  "required": [
    "reference_analysis",
    "similarity_risk",
    "visual_dna",
    "token_mapping",
    "component_mapping",
    "pattern_mapping",
    "business_adaptation",
    "ui_build_input",
    "qa_result"
  ],
  "properties": {
    "reference_analysis": {"type": "string"},
    "similarity_risk": {"type": "string"},
    "visual_dna": {"type": "object"},
    "token_mapping": {"type": "object"},
    "component_mapping": {"type": "object"},
    "pattern_mapping": {"type": "object"},
    "business_adaptation": {"type": "object"},
    "ui_build_input": {"type": "string"},
    "qa_result": {
      "type": "object",
      "required": ["decision", "blockers", "critical", "major"],
      "properties": {
        "decision": {"enum": ["ready_for_ui_build", "conditional_ready", "blocked"]},
        "blockers": {"type": "integer"},
        "critical": {"type": "integer"},
        "major": {"type": "integer"}
      }
    }
  }
}
```

### 13.2 `ui-build-reference-input.md`

```md
# UI Build Reference Input

## Reference Summary
- Reference ID:
- Source Type:
- Target Page:
- Target Business:
- Platform:

## Allowed Inspiration
- Layout:
- Information Hierarchy:
- Interaction:
- Component Composition:

## Forbidden Copy
- Logo:
- Brand Color:
- Original Icon:
- Original Copy:
- Unique Visual Motif:

## Visual DNA
- Layout DNA:
- Information DNA:
- Color DNA:
- Typography DNA:
- Spacing DNA:
- Surface DNA:
- Interaction DNA:

## Mapping
- Token Mapping:
- Component Mapping:
- Pattern Mapping:
- Business Adaptation:

## Risk
- Similarity Risk:
- Copyright / Brand Risk:
- DS Gap:
- Business Gap:

## UI Build Instruction
Use this reference only as transformed design input.
Do not copy original brand, layout, icons, text, or visual motifs.
Build the page from Page Contract + Design System + Component Manifest + Pattern Registry.
```

---

## 14. QA Gates

### 14.1 Gate 清单

| Gate | 检查项 | Block 条件 |
|---|---|---|
| Input Gate | Reference Input 是否完整 | 缺 page_contract / design_system |
| Similarity Gate | 是否复制品牌资产或像素级复刻 | 出现 Logo / 品牌色 / 原文案 / 原图标 |
| Token Gate | 是否全部映射项目 Token | 存在硬编码样式 |
| Component Gate | 是否映射 Component Manifest | 页面内新造组件 |
| Pattern Gate | 是否映射 Pattern Registry | 自造页面结构 |
| Business Gate | 是否符合 Page Contract | 脱离业务规则 |
| Financial Gate | 是否符合金融可信度 | 风险弱化、误导收益 |
| UI Build Gate | 是否可被 UI Build 消费 | 缺输出契约或映射报告 |

### 14.2 Release Decision

| Decision | 条件 |
|---|---|
| `ready_for_ui_build` | 0 Blocker，0 Critical，Major 有修复计划 |
| `conditional_ready` | 0 Blocker，0 Critical，少量 Major 不影响主流程 |
| `blocked` | 存在任意 Blocker 或 Critical |

---

## 15. Forbidden Rules

```text
- 禁止直接复制参考案例 UI。
- 禁止照搬品牌颜色、Logo、图标、文案、专属插图。
- 禁止像素级模仿。
- 禁止绕过 Page Contract 生成页面。
- 禁止绕过 Design System 创建随机 Token。
- 禁止绕过 Component Manifest 临时造组件。
- 禁止绕过 Pattern Registry 自造页面结构。
- 禁止为了视觉好看修改业务规则。
- 禁止弱化金融风险、资金风险、KYC 风险、审核风险。
- 禁止生成不可开发、不可复用、Demo 风格页面。
- 禁止把 Dribbble 风格直接用于金融生产页。
```

---

## 16. Production Workflow

```text
1. Receive Reference Input
2. Validate Reference Input Schema
3. Analyze Reference Source Type
4. Extract Visual DNA
5. Run Similarity Risk Gate
6. Map Reference Traits to Project Tokens
7. Map Reference Components to Component Manifest
8. Map Reference Layout to Pattern Registry
9. Adapt Reference Business to Page Contract
10. Generate UI Build Reference Input
11. Run QA Gates
12. Output Ready / Conditional Ready / Blocked
```

---

## 17. AI 执行命令

### 17.1 分析参考案例

```txt
使用 UI Reference Adaptation Add-on Skill v1.0.0-L5 分析参考案例。

输入：
- Reference Source:
- Reference Screenshot / Notes:
- Target Page:
- Target Business:
- Platform:
- Page Contract:
- Design System:
- Component Manifest:
- Pattern Registry:

要求：
1. 先判断可借鉴和不可复制内容。
2. 输出 Visual DNA，不直接生成最终页面。
3. 映射到项目 Token、Component、Pattern。
4. 完成 Business Adaptation。
5. 输出 Similarity Risk Checklist。
6. 输出 UI Build Reference Input。
7. 若存在品牌复制、像素级复刻、脱离 DS，必须 Block。
```

### 17.2 转换 Mobbin 页面到项目 UI

```txt
使用 UI Reference Adaptation Add-on Skill v1.0.0-L5 将 Mobbin 页面转换为项目 UI Build 输入。

限制：
- 不复制 Mobbin 页面品牌、Logo、图标、文案。
- 不使用原始颜色和像素级布局。
- 必须映射项目 Design System。
- 必须符合 Page Contract。
- 必须输出 Token Mapping、Component Mapping、Pattern Mapping。
- 输出给 UI Build Skill 使用，不直接作为最终页面交付。
```

### 17.3 执行相似度风险 QA

```txt
使用 UI Reference Adaptation Add-on Skill v1.0.0-L5 对当前参考转化结果执行 QA。

检查：
- 是否复制品牌资产
- 是否复制原始图标
- 是否复制原始文案
- 是否像素级复刻
- 是否脱离项目 Token
- 是否绕过组件系统
- 是否符合金融产品可信度
- 是否可被 UI Build 消费

输出：
- Blocker / Critical / Major / Minor
- 修复建议
- Decision: ready_for_ui_build / conditional_ready / blocked
```

---

## 18. L5 完成标准

| 标准 | 必须满足 |
|---|---:|
| Reference Input 有 Schema | 是 |
| Visual DNA 有结构化输出 | 是 |
| Similarity Risk 有阻断机制 | 是 |
| Token Mapping 指向项目 Token | 是 |
| Component Mapping 指向 Component Manifest | 是 |
| Pattern Mapping 指向 Pattern Registry | 是 |
| Business Adaptation 指向 Page Contract | 是 |
| 金融产品质量规则完整 | 是 |
| 多端转化规则完整 | 是 |
| QA Gate 可判断是否可进入 UI Build | 是 |
| 输出是 UI Build 输入，不是直接最终页面 | 是 |

---

## 19. 最终定义

```text
UI Reference Adaptation Add-on Skill v1.0.0-L5
= Reference Input Schema
+ Visual DNA Schema
+ Similarity Risk Gate
+ Token Mapping
+ Component Mapping
+ Pattern Mapping
+ Business Adaptation
+ Financial UI Adaptation
+ Multi-platform Rules
+ UI Build Reference Input
+ QA Decision
```

它的价值不是让 AI “抄一个好看的页面”，而是让 AI **从优秀参考中提炼可复用的设计 DNA，并安全地转换成项目自己的生产级 UI 输入**。
