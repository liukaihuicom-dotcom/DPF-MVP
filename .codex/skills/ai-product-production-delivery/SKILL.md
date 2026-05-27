---
name: ai-product-production-delivery
description: >
  Use for product requirements, product modules, business rules, roles and permissions, workflows, state machines,
  page contracts, API contracts, risk controls, traceability, QA mapping, release decisions, and delivery packages.
  Inputs include business goals, user roles, flows, constraints, compliance needs, existing docs, and platform scope.
  Outputs Product Kernel, business rules, page/API/risk contracts, traceability matrix, QA gate, assumptions, and handoff assets.
  Do not use to directly create visual UI, invent design tokens/components, bypass missing inputs, or replace legal/compliance approval.
---

# AI Product Production Delivery Skill v3.0.0-L5

> File: `.codex/skills/ai-product-production-delivery/SKILL.md`
> Version: `v3.0.0-L5`
> Level: `L5 Complete / Production Product Engineering Delivery Skill`
> Purpose: 将业务需求转化为 AI 可执行、机器可校验、跨团队可消费、可追踪、可测试、可交付开发的生产级产品工程资产。
> Target: Codex / Claude / Cursor / 产品设计工程师 / 前端 / 后端 / QA / 合规 / 项目负责人。
> Scope: App / H5 / Web / Admin / Broker / KYC / Wallet / Trading / CRM / SaaS。

---

## 0. 核心定位

本 Skill 是产品工程链路的 **总控层 / Product Orchestration Layer**。

它不负责画 UI，也不负责定义组件视觉，而是负责把业务需求转化为结构化、可执行、可验证的产品工程资产，并驱动：

```text
AI Product Production Delivery Skill
  ↓ 输出 Product Kernel / Business Rules / Page Contract / API Draft / Risk Rules / QA Contract
Design System Engineering Skill
  ↓ 输出 Tokens / Component Manifest / Business Components / Pattern Registry
UI Build Production Skill
  ↓ 输出 Page Implementation / State Matrix / Interaction / Visual QA / Dev Handoff
QA / Test / Release
  ↓ 输出 Release Decision / Test Result / Change Impact / Migration
```

| 项目 | 定义 |
|---|---|
| 核心任务 | 业务建模、角色权限、状态机、页面契约、API 契约、风险规则、测试映射、交付验收 |
| 核心产物 | `Product Kernel` + `Business Rules` + `Page Contracts` + `API Contracts` + `Risk Rules` + `Traceability Matrix` + `QA Gate` |
| 执行原则 | 先业务建模，再页面生产；先契约，再实现；先校验，再交付 |
| 禁止结果 | Demo 页面、无规则页面、无状态页面、无开发说明页面、无版本记录页面、无 QA 决策页面 |
| 交付目标 | AI 可执行、开发可消费、QA 可验收、合规可追踪、版本可维护 |

---

## 1. L5 Complete 标准

L5 不等于“文档很完整”，而是必须满足以下交付条件。

| L5 能力 | 必须满足 |
|---|---|
| Contract Driven | 所有页面、接口、状态、权限、风险规则必须由契约驱动 |
| Machine Verifiable | 核心资产必须有 Schema、Required、Enum、Validation Rule |
| Traceable | 业务目标 → 业务规则 → 页面契约 → API → UI → 测试用例必须可追踪 |
| QA Blocking | 通过 Blocker / Critical / Major / Minor 控制是否允许进入下一阶段 |
| Test Ready | 每条核心业务规则和状态机必须映射到测试用例 |
| Handoff Ready | 前端、后端、QA、合规能根据交付包继续执行 |
| Change Safe | 任意规则、接口、权限、页面变更必须输出影响范围 |
| Assumption Controlled | 所有假设必须记录 Owner、风险级别、确认状态、过期时间 |
| Release Decidable | 交付包必须输出 Allow / Conditional Allow / Block 的发布决策 |
| No Silent Guessing | 缺失信息不得静默脑补，必须写入 assumption log 或 unresolved issues |

---

## 2. 标准交付目录

```text
product-engineering-package/
├── 00_product_kernel/
│   ├── product.kernel.json
│   ├── product.kernel.schema.json
│   ├── domain.model.md
│   ├── entity.model.md
│   ├── product-scope.md
│   ├── source-of-truth.map.json
│   └── business-assumption.log.md
│
├── 01_modules_and_navigation/
│   ├── module-contract.schema.json
│   ├── modules/*.module-contract.json
│   ├── module.map.md
│   ├── navigation.map.json
│   ├── route.map.json
│   └── page.inventory.md
│
├── 02_roles_permissions/
│   ├── rbac.policy.schema.json
│   ├── rbac.policy.json
│   ├── permission.matrix.md
│   ├── user-role.matrix.md
│   ├── data-scope.matrix.md
│   └── tenant-region.rules.md
│
├── 03_business_rules/
│   ├── business-rule.schema.json
│   ├── business-rule.matrix.json
│   ├── state-machine.schema.yaml
│   ├── state-machine.yaml
│   ├── exception-paths.md
│   ├── audit-log.schema.json
│   └── audit-log.requirements.md
│
├── 04_page_contracts/
│   ├── page-contract.schema.json
│   ├── pages/*.page-contract.json
│   ├── field-spec.template.md
│   └── page-contract.index.md
│
├── 05_api_contracts/
│   ├── openapi.draft.yaml
│   ├── api-contract.rules.md
│   ├── schema/*.schema.json
│   ├── error-code.taxonomy.json
│   ├── error-codes.json
│   └── mocks/*.mock.json
│
├── 06_ui_delivery_inputs/
│   ├── design-system-binding.md
│   ├── component-usage.map.json
│   ├── pattern-binding.map.json
│   ├── visual-reference.notes.md
│   └── ui-build-input.index.json
│
├── 07_development_handoff/
│   ├── handoff-contract.md
│   ├── runtime-mapping.md
│   ├── data-dependency.map.md
│   ├── event-tracking.schema.md
│   ├── frontend-notes.md
│   ├── backend-notes.md
│   └── qa-notes.md
│
├── 08_quality_gates/
│   ├── qa-severity.matrix.md
│   ├── product-qa.gate.md
│   ├── api-qa.gate.md
│   ├── permission-qa.gate.md
│   ├── risk-qa.gate.md
│   ├── handoff-qa.gate.md
│   └── release-decision.rules.md
│
├── 09_traceability_and_tests/
│   ├── traceability.matrix.md
│   ├── test-case.mapping.md
│   ├── acceptance-criteria.md
│   ├── regression-scope.md
│   └── scenario-coverage.report.md
│
├── 10_release_management/
│   ├── changelog.md
│   ├── change-impact.report.md
│   ├── deprecated.md
│   ├── migration-guide.md
│   └── release-decision.report.md
│
└── 11_validation_scripts/
    ├── package.json
    ├── scripts/check-product-kernel.js
    ├── scripts/check-module-contract.js
    ├── scripts/check-business-rules.js
    ├── scripts/check-rbac-policy.js
    ├── scripts/check-state-machine.js
    ├── scripts/check-page-contract.js
    ├── scripts/check-api-contract.js
    ├── scripts/check-traceability.js
    └── scripts/qa-all.js
```

---

## 3. 输入规则

### 3.1 必须输入

| 输入 | 说明 | 缺失处理 |
|---|---|---|
| Product Goal | 产品目标、用户价值、业务目标 | Blocker |
| Platform | App / H5 / Web / Admin | Blocker |
| User Roles | 用户、IB、Broker、运营、客服、合规、管理员 | Blocker |
| Module Scope | 本次要搭建的模块和优先级 | Blocker |
| Business Rules | 准入条件、流程规则、异常规则 | Blocker |
| Region / Compliance | 地区、语言、币种、KYC、协议、监管要求 | 条件 Blocker |
| Delivery Mode | HTML / React / Vue / App Mapping / Admin Handoff | Blocker |
| Existing Assets | 设计系统、旧页面、接口文档、参考截图 | 可记录 Assumption |
| API / Data Source | 接口或 Mock 来源 | 可先 Draft，但必须标记风险 |

### 3.2 缺失信息处理

```text
缺失信息不得静默脑补。
必须进入：
- business-assumption.log.md
- unresolved-issues.md
- release-decision.report.md
```

---

## 4. Product Kernel Schema

`product.kernel.json` 是产品工程根资产。所有模块、页面、权限、状态、接口、测试必须能回溯到它。

### 4.1 `product.kernel.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Product Kernel Schema",
  "type": "object",
  "required": [
    "product_id",
    "product_name",
    "version",
    "platforms",
    "domains",
    "roles",
    "regions",
    "release_scope",
    "risk_level",
    "source_of_truth",
    "owners"
  ],
  "properties": {
    "product_id": {
      "type": "string",
      "pattern": "^[a-z0-9_\\-]+$"
    },
    "product_name": {
      "type": "string"
    },
    "version": {
      "type": "string",
      "pattern": "^v?\\d+\\.\\d+\\.\\d+(-[a-zA-Z0-9\\.]+)?$"
    },
    "platforms": {
      "type": "array",
      "items": {
        "enum": ["app", "h5", "web", "admin"]
      },
      "minItems": 1
    },
    "domains": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1
    },
    "roles": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1
    },
    "regions": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "release_scope": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "risk_level": {
      "enum": ["low", "medium", "high", "financial-regulated", "compliance-critical"]
    },
    "source_of_truth": {
      "type": "object",
      "required": ["business_rules", "permissions", "page_contracts", "api_contracts"],
      "properties": {
        "business_rules": {"type": "string"},
        "permissions": {"type": "string"},
        "page_contracts": {"type": "string"},
        "api_contracts": {"type": "string"}
      }
    },
    "owners": {
      "type": "object",
      "required": ["product", "design", "frontend", "backend", "qa"],
      "properties": {
        "product": {"type": "string"},
        "design": {"type": "string"},
        "frontend": {"type": "string"},
        "backend": {"type": "string"},
        "qa": {"type": "string"},
        "compliance": {"type": "string"}
      }
    }
  }
}
```

### 4.2 Product Kernel 示例

```json
{
  "product_id": "broker_app",
  "product_name": "Broker Trading App",
  "version": "v3.0.0",
  "platforms": ["app", "web", "admin"],
  "domains": ["account", "kyc", "wallet", "trading", "ib"],
  "roles": ["user", "ib", "operator", "compliance", "admin"],
  "regions": ["global", "id-ID"],
  "release_scope": ["account-opening", "bank-account", "deposit", "withdrawal"],
  "risk_level": "financial-regulated",
  "source_of_truth": {
    "business_rules": "03_business_rules/business-rule.matrix.json",
    "permissions": "02_roles_permissions/rbac.policy.json",
    "page_contracts": "04_page_contracts/pages/",
    "api_contracts": "05_api_contracts/openapi.draft.yaml"
  },
  "owners": {
    "product": "product-owner",
    "design": "design-owner",
    "frontend": "frontend-owner",
    "backend": "backend-owner",
    "qa": "qa-owner",
    "compliance": "compliance-owner"
  }
}
```

---

## 5. Module Contract Schema

### 5.1 `module-contract.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Module Contract Schema",
  "type": "object",
  "required": [
    "module_id",
    "module_name",
    "business_goal",
    "primary_roles",
    "related_entities",
    "entry_points",
    "exit_points",
    "core_rules",
    "related_pages",
    "related_apis",
    "risk_notes",
    "status"
  ],
  "properties": {
    "module_id": {"type": "string", "pattern": "^[a-z0-9_\\-]+$"},
    "module_name": {"type": "string"},
    "business_goal": {"type": "string"},
    "primary_roles": {"type": "array", "items": {"type": "string"}},
    "related_entities": {"type": "array", "items": {"type": "string"}},
    "entry_points": {"type": "array", "items": {"type": "string"}},
    "exit_points": {"type": "array", "items": {"type": "string"}},
    "core_rules": {"type": "array", "items": {"type": "string"}},
    "related_pages": {"type": "array", "items": {"type": "string"}},
    "related_apis": {"type": "array", "items": {"type": "string"}},
    "risk_notes": {"type": "array", "items": {"type": "string"}},
    "status": {"enum": ["draft", "ready_for_contract", "ready_for_ui_build", "blocked", "released"]}
  }
}
```

### 5.2 模块拆解规则

| 规则 | 要求 |
|---|---|
| 模块必须有唯一 ID | 不允许 `account2`、`new page` 这类临时命名 |
| 模块必须有边界 | 明确本模块做什么、不做什么 |
| 模块必须有入口和出口 | 便于导航、路由和任务流设计 |
| 模块必须有关联实体 | 例如 User、Wallet、BankAccount、KYCProfile |
| 模块必须有关联页面 | 每个页面必须回到模块 |
| 模块必须有关联 API | 没有 API 时必须说明是纯前端、静态配置或暂未定义 |
| 模块必须有风险说明 | 资金、KYC、合规、权限、敏感字段必须标记 |

---

## 6. Business Rule Schema

业务规则必须机器可读，不允许只保留自然语言表格。

### 6.1 `business-rule.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Business Rule Schema",
  "type": "object",
  "required": [
    "rule_id",
    "module",
    "scenario",
    "condition",
    "system_behavior",
    "user_feedback",
    "data_dependency",
    "risk_audit",
    "severity",
    "test_required"
  ],
  "properties": {
    "rule_id": {"type": "string", "pattern": "^BR-[0-9]{3,}$"},
    "module": {"type": "string"},
    "scenario": {"type": "string"},
    "condition": {"type": "string"},
    "system_behavior": {"type": "string"},
    "user_feedback": {"type": "string"},
    "data_dependency": {
      "type": "array",
      "items": {"type": "string"}
    },
    "risk_audit": {
      "type": "object",
      "required": ["risk_level", "audit_required"],
      "properties": {
        "risk_level": {"enum": ["none", "low", "medium", "high", "critical"]},
        "audit_required": {"type": "boolean"},
        "audit_fields": {"type": "array", "items": {"type": "string"}}
      }
    },
    "severity": {"enum": ["blocker", "critical", "major", "minor"]},
    "test_required": {"type": "boolean"},
    "owner": {"type": "string"},
    "status": {"enum": ["draft", "confirmed", "deprecated"]}
  }
}
```

### 6.2 业务规则示例

```json
{
  "rule_id": "BR-002",
  "module": "bank_account",
  "scenario": "用户切换银行类型时已填写银行卡号",
  "condition": "bank_code_changed && card_number_not_empty",
  "system_behavior": "显示二次确认弹窗；用户确认后清空 card_number 和 branch 信息；保留 holder_name",
  "user_feedback": "Changing the bank will clear the card number you entered.",
  "data_dependency": ["bank_code", "card_number", "holder_name"],
  "risk_audit": {
    "risk_level": "medium",
    "audit_required": false,
    "audit_fields": []
  },
  "severity": "major",
  "test_required": true,
  "owner": "product-owner",
  "status": "confirmed"
}
```

### 6.3 业务规则硬性要求

```text
- 每条核心规则必须有 Rule ID。
- 每条规则必须说明触发条件、系统行为、用户反馈。
- 涉及资金、KYC、银行卡、证件、协议、权限的规则必须有风险等级。
- 每条 Blocker / Critical 规则必须有测试用例。
- 废弃规则不得直接删除，必须进入 deprecated.md。
```

---

## 7. RBAC / Permission Schema

### 7.1 `rbac.policy.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "RBAC Policy Schema",
  "type": "object",
  "required": ["roles", "permissions", "policies"],
  "properties": {
    "roles": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["role_id", "role_name", "data_scope"],
        "properties": {
          "role_id": {"type": "string"},
          "role_name": {"type": "string"},
          "data_scope": {
            "enum": ["self", "team", "tenant", "region", "global", "custom"]
          }
        }
      }
    },
    "permissions": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["permission_id", "resource", "action"],
        "properties": {
          "permission_id": {"type": "string"},
          "resource": {"type": "string"},
          "action": {"enum": ["view", "create", "edit", "delete", "approve", "reject", "export", "operate"]}
        }
      }
    },
    "policies": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["role_id", "permission_id", "effect"],
        "properties": {
          "role_id": {"type": "string"},
          "permission_id": {"type": "string"},
          "effect": {"enum": ["allow", "deny", "conditional"]},
          "conditions": {"type": "array", "items": {"type": "string"}}
        }
      }
    }
  }
}
```

### 7.2 权限交付要求

| 项 | 要求 |
|---|---|
| 页面权限 | 谁能访问页面 |
| 模块权限 | 谁能看到模块入口 |
| 字段权限 | 哪些字段需要隐藏、脱敏、只读 |
| 按钮权限 | 哪些操作按钮可见、可点、禁用 |
| 数据范围 | self / team / tenant / region / global |
| 服务端校验 | 前端权限只控制展示，服务端必须二次校验 |
| 审计 | 审核、资金、KYC、权限变更必须记录操作日志 |

---

## 8. State Machine Schema

### 8.1 `state-machine.schema.yaml`

```yaml
schema: state-machine.schema.yaml
required:
  - entity
  - states
  - transitions
state:
  required:
    - id
    - label
    - type
  type_enum:
    - initial
    - normal
    - processing
    - success
    - failed
    - restricted
    - terminal
transition:
  required:
    - from
    - event
    - to
  optional:
    - guard
    - action
    - api
    - user_feedback
    - audit
```

### 8.2 状态机示例

```yaml
entity: bank_account
version: v3.0.0
states:
  - id: draft
    label: Draft
    type: initial
  - id: validating
    label: Validating
    type: processing
  - id: submitting
    label: Submitting
    type: processing
  - id: active
    label: Active
    type: success
  - id: failed
    label: Failed
    type: failed
  - id: restricted
    label: Restricted
    type: restricted
transitions:
  - from: draft
    event: submit
    to: submitting
    guard: kyc_approved && form_valid
    action: call_create_bank_account
    api: POST /bank-accounts
    user_feedback: show_loading_button
    audit: false
  - from: submitting
    event: api_success
    to: active
    action: show_success_toast
    audit: true
  - from: submitting
    event: api_error
    to: failed
    action: show_inline_error
    audit: true
```

### 8.3 状态机验收规则

| 检查项 | 阻断级别 |
|---|---|
| 无 initial state | Blocker |
| 无 terminal / success / failed 路径 | Critical |
| 有状态但无触发事件 | Critical |
| 有事件但无系统行为 | Major |
| 有错误状态但无用户恢复路径 | Critical |
| 涉及资金但无审计标记 | Blocker |
| 涉及审核但无 pending / reviewing 状态 | Major |

---

## 9. Page Contract Schema

UI Build Skill 只能消费 Page Contract，不得擅自修改业务规则。

### 9.1 `page-contract.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Page Contract Schema",
  "type": "object",
  "required": [
    "page_id",
    "module",
    "platform",
    "route",
    "roles",
    "goal",
    "preconditions",
    "pattern",
    "sections",
    "components",
    "states",
    "fields",
    "interactions",
    "api",
    "risk_rules",
    "handoff_required"
  ],
  "properties": {
    "page_id": {"type": "string", "pattern": "^[a-z0-9_\\-]+$"},
    "module": {"type": "string"},
    "platform": {"enum": ["app", "h5", "web", "admin"]},
    "route": {"type": "string"},
    "roles": {"type": "array", "items": {"type": "string"}},
    "goal": {"type": "string"},
    "preconditions": {"type": "array", "items": {"type": "string"}},
    "pattern": {"type": "string"},
    "sections": {"type": "array", "items": {"type": "string"}},
    "components": {"type": "array", "items": {"type": "string"}},
    "states": {
      "type": "array",
      "items": {
        "enum": [
          "default",
          "loading",
          "empty",
          "inputting",
          "validating",
          "submitting",
          "success",
          "failed",
          "error",
          "disabled",
          "permission_denied",
          "restricted",
          "reviewing",
          "pending"
        ]
      }
    },
    "fields": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "type", "required"],
        "properties": {
          "name": {"type": "string"},
          "type": {"enum": ["string", "number", "boolean", "date", "currency", "file", "enum", "object", "array"]},
          "required": {"type": "boolean"},
          "source": {"type": "string"},
          "sensitive": {"type": "boolean"},
          "validation": {"type": "array", "items": {"type": "string"}},
          "masking": {"type": "string"}
        }
      }
    },
    "interactions": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["event", "condition", "result", "feedback"],
        "properties": {
          "event": {"type": "string"},
          "condition": {"type": "string"},
          "result": {"type": "string"},
          "feedback": {"type": "string"},
          "api": {"type": "string"},
          "failure_recovery": {"type": "string"}
        }
      }
    },
    "api": {"type": "array", "items": {"type": "string"}},
    "risk_rules": {"type": "array", "items": {"type": "string"}},
    "analytics": {"type": "array", "items": {"type": "string"}},
    "handoff_required": {"type": "boolean"}
  }
}
```

### 9.2 Page Contract 示例

```json
{
  "page_id": "app_bank_account_add",
  "module": "bank_account",
  "platform": "app",
  "route": "/bank-account/add",
  "roles": ["verified_user"],
  "goal": "用户添加本人名下银行卡，用于后续入金和出金",
  "preconditions": ["logged_in", "kyc_approved"],
  "pattern": "app-form-page",
  "sections": ["header", "guidance", "form", "risk_notice", "fixed_action"],
  "components": ["AppHeader", "FormItem", "BankSelector", "TextInput", "Dialog", "Toast"],
  "states": ["default", "inputting", "validating", "submitting", "success", "failed", "permission_denied", "restricted"],
  "fields": [
    {
      "name": "bank_code",
      "type": "string",
      "required": true,
      "source": "GET /banks",
      "sensitive": false
    },
    {
      "name": "card_number",
      "type": "string",
      "required": true,
      "sensitive": true,
      "validation": ["numeric_only", "bank_card_length"],
      "masking": "last_4_digits"
    },
    {
      "name": "holder_name",
      "type": "string",
      "required": true,
      "source": "kyc_profile.name",
      "sensitive": true
    }
  ],
  "interactions": [
    {
      "event": "change_bank",
      "condition": "card_number_not_empty",
      "result": "show_clear_confirm_dialog",
      "feedback": "Changing the bank will clear the card number.",
      "failure_recovery": "cancel_dialog_keep_current_input"
    },
    {
      "event": "submit",
      "condition": "form_valid",
      "result": "call_create_bank_account",
      "feedback": "button_loading_and_toast_result",
      "api": "POST /bank-accounts",
      "failure_recovery": "show_field_or_page_error"
    }
  ],
  "api": ["GET /banks", "POST /bank-accounts"],
  "risk_rules": ["mask_card_number", "audit_submit", "no_sensitive_local_storage"],
  "analytics": ["bank_account_add_view", "bank_account_add_submit"],
  "handoff_required": true
}
```

---

## 10. API Contract Rules

### 10.1 OpenAPI 最小要求

| 项 | 必须 |
|---|---:|
| path | 是 |
| method | 是 |
| auth | 是 |
| request body | 条件必须 |
| response body | 是 |
| error response | 是 |
| status code | 是 |
| schema ref | 是 |
| mock data | 是 |
| UI error mapping | 是 |

### 10.2 `error-code.taxonomy.json`

```json
{
  "code": "KYC_NOT_APPROVED",
  "http_status": 403,
  "severity": "blocking",
  "domain": "kyc",
  "message_key": "common.error.kyc_not_approved",
  "ui_target": "page_banner",
  "user_action": "go_to_kyc",
  "recoverable": true,
  "audit_required": false
}
```

### 10.3 错误码严重级别

| Severity | 含义 | UI 处理 |
|---|---|---|
| blocking | 阻断当前流程 | 页面 Banner / Result Page / CTA |
| field | 字段级错误 | 字段下方 Inline Error |
| retryable | 可重试错误 | Toast + Retry |
| silent | 不打断用户 | 记录日志或弱提示 |
| audit | 需要审计 | 后台记录 + 可见反馈 |

---

## 11. Risk / Compliance / Security Rules

### 11.1 高风险场景

| 场景 | 必须定义 |
|---|---|
| KYC / 开户 | 准入条件、审核状态、失败原因、补充材料、协议签署 |
| 银行卡 / 资金 | 本人账户、币种限制、余额限制、二次确认、敏感字段脱敏 |
| 入金 / 出金 / 转账 | 金额校验、手续费、到账说明、状态追踪、防重复提交 |
| 后台审核 | 审核权限、拒绝原因、内部备注、审计日志 |
| 地区合规 | 国家规则、语言、币种、协议、身份材料、视频验证 |

### 11.2 安全硬规则

```text
- 不在 localStorage / sessionStorage 存储银行卡、证件、KYC 文件、Token 等敏感信息。
- 前端权限只控制展示，服务端必须二次校验。
- 资金类操作必须防重复提交，并建议使用 request_id / nonce。
- 上传文件必须定义类型、大小、失败、重试、预览权限。
- 关键后台操作必须记录 operator、time、action、target、result。
- 所有敏感字段必须声明 sensitive、masking、storage、transmission 规则。
```

### 11.3 `audit-log.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Audit Log Schema",
  "type": "object",
  "required": ["audit_id", "operator_id", "operator_role", "action", "target_type", "target_id", "result", "timestamp"],
  "properties": {
    "audit_id": {"type": "string"},
    "operator_id": {"type": "string"},
    "operator_role": {"type": "string"},
    "action": {"type": "string"},
    "target_type": {"type": "string"},
    "target_id": {"type": "string"},
    "before": {"type": "object"},
    "after": {"type": "object"},
    "result": {"enum": ["success", "failed", "blocked"]},
    "reason": {"type": "string"},
    "timestamp": {"type": "string", "format": "date-time"}
  }
}
```

---

## 12. Assumption Governance

缺失信息不是问题，未管理的假设才是问题。

### 12.1 `business-assumption.log.md` 模板

| 字段 | 说明 |
|---|---|
| Assumption ID | `ASM-001` |
| Area | business / api / compliance / design / technical |
| Assumption | 假设内容 |
| Reason | 为什么需要做这个假设 |
| Risk Level | low / medium / high / critical |
| Owner | 需要谁确认 |
| Confirm By | 需要确认的日期或版本 |
| Status | open / confirmed / rejected / expired |
| Impact if Wrong | 假设错误的影响 |
| Related Pages | 受影响页面 |
| Related Rules | 受影响规则 |

### 12.2 假设处理规则

| 情况 | 处理 |
|---|---|
| 影响资金 / 合规 / 身份 | Blocker，不能进入生产交付 |
| 影响 UI 文案但不影响规则 | 可进入 UI Build，但需标记 |
| 影响 API 字段 | Conditional Allow，需 Mock 标记 |
| 假设过期未确认 | 自动升级为 Critical |
| 假设被否定 | 必须触发 Change Impact |

---

## 13. Traceability Matrix

每个生产级交付必须有追踪矩阵。

### 13.1 `traceability.matrix.md`

| Product Goal | Business Rule | Module | Page Contract | API | UI Component | Test Case | QA Status |
|---|---|---|---|---|---|---|---|
| 添加本人银行卡 | BR-002 | bank_account | app_bank_account_add | POST /bank-accounts | BankSelector / Dialog | TC-BANK-002 | Pass |
| 出金余额校验 | BR-011 | withdrawal | app_withdrawal_create | POST /withdrawals | AmountInput / RiskBanner | TC-WD-011 | Pending |

### 13.2 追踪规则

```text
- 每个 Page Contract 必须关联至少一个 Business Rule。
- 每个 Critical / Blocker Business Rule 必须关联至少一个 Test Case。
- 每个 API 必须关联使用它的页面。
- 每个风险规则必须关联测试用例或合规确认项。
- 任何孤立页面、孤立接口、孤立规则都不得进入 Release。
```

---

## 14. Test Case Mapping

### 14.1 `test-case.mapping.md`

| Test ID | Related Rule | Related Page | Preconditions | Steps | Expected Result | Severity | Status |
|---|---|---|---|---|---|---|---|
| TC-BANK-002 | BR-002 | app_bank_account_add | 已选择银行并填写卡号 | 切换银行 | 弹出确认框；确认后清空卡号；取消后保留输入 | Major | Ready |
| TC-WD-011 | BR-011 | app_withdrawal_create | 余额不足 | 输入超过余额的金额 | 禁止提交并显示错误提示 | Critical | Ready |

### 14.2 测试映射要求

| 场景 | 测试要求 |
|---|---|
| Blocker 规则 | 必须有测试用例 |
| Critical 规则 | 必须有测试用例 |
| 状态机主路径 | 必须覆盖 |
| 错误码 | 必须映射 UI 目标和测试用例 |
| 权限限制 | 必须覆盖可见、不可见、禁用、无权限 |
| 风控限制 | 必须覆盖限制原因和解除路径 |

---

## 15. QA Severity Matrix

### 15.1 严重级别

| Severity | 定义 | 是否阻断 | 示例 |
|---|---|---:|---|
| Blocker | 影响业务正确性、资金安全、合规、安全或核心交付链路 | 是 | 没有 Page Contract；资金规则缺失；权限绕过 |
| Critical | 影响核心流程完成或主要状态缺失 | 是 | 出金失败无恢复路径；KYC 审核状态缺失 |
| Major | 影响体验、开发理解或维护性，但可通过明确风险进入下一阶段 | 条件阻断 | 缺少部分边缘状态；Mock 不完整 |
| Minor | 不影响主流程的小问题 | 否 | 文案优化、命名轻微不一致 |
| Info | 说明性问题 | 否 | 后续可优化项 |

### 15.2 Gate 判断

| Gate | Blocker 示例 | Critical 示例 | Major 示例 |
|---|---|---|---|
| Product Gate | 没有产品目标 / 模块边界 | 角色不完整 | 模块说明不够清晰 |
| Permission Gate | 无权限模型 | 按钮权限不清 | 字段级权限未完全说明 |
| State Gate | 无状态机 | 无失败 / 受限状态 | 边缘状态不足 |
| API Gate | 无接口草案 | 错误码缺失 | Mock 数据不足 |
| Risk Gate | 资金 / KYC 风险未定义 | 敏感字段无脱敏规则 | 审计字段不完整 |
| UI Contract Gate | 无 Page Contract | 字段 / 交互不完整 | 文案 key 未补齐 |
| Handoff Gate | 无开发交付说明 | 前后端依赖不清 | 命名待统一 |
| Traceability Gate | 规则和页面无法追踪 | 测试用例缺失 | 部分映射待补 |

---

## 16. Release Decision Rules

### 16.1 发布决策

| 结果 | 条件 | 是否允许进入下一阶段 |
|---|---|---:|
| Allow | 0 Blocker，0 Critical，Major 有 Owner 和修复计划 | 是 |
| Conditional Allow | 0 Blocker，0 Critical，Major 不影响核心路径 | 条件允许 |
| Block | 存在任意 Blocker 或 Critical | 否 |
| Rework Required | 结构不完整、契约缺失、无法验证 | 否 |

### 16.2 阶段准入规则

| 阶段 | 准入条件 |
|---|---|
| 进入 Design System | Product Kernel、Module Contract、Business Rules 已完成 |
| 进入 UI Build | Page Contract、Design System Binding、State Matrix 已完成 |
| 进入 Development | API Draft、Handoff Contract、Traceability、QA Gate 已完成 |
| 进入 Release | Test Mapping、Risk Gate、Change Impact、Release Decision 已通过 |

### 16.3 `release-decision.report.md`

```md
# Release Decision Report

- Package Version:
- Review Date:
- Decision: Allow / Conditional Allow / Block / Rework Required
- Blocker Count:
- Critical Count:
- Major Count:
- Minor Count:
- Accepted Risks:
- Unresolved Assumptions:
- Required Fixes:
- Owner:
- Next Review:
```

---

## 17. Handoff Contract

### 17.1 `handoff-contract.md`

| 交付对象 | 必须包含 |
|---|---|
| 前端 | Page Contract、组件映射、字段、状态、事件、错误反馈、埋点 |
| 后端 | API Draft、Schema、错误码、权限、审计、安全规则 |
| QA | 测试用例、状态矩阵、错误码、权限矩阵、风险规则 |
| 合规 | 地区规则、协议、KYC、资金限制、审计记录 |
| 设计 | 设计系统绑定、页面模式、组件缺口、视觉参考规则 |
| 项目管理 | 版本、范围、风险、未决问题、发布决策 |

### 17.2 开发交付字段

```md
# Development Handoff

## Page
- Page ID:
- Route:
- Module:
- Platform:
- Roles:
- Preconditions:

## Data
- Fields:
- API:
- Mock:
- Error Codes:

## Interaction
- Event:
- Condition:
- Result:
- Feedback:
- Failure Recovery:

## Risk
- Sensitive Fields:
- Masking:
- Audit:
- Permission:
- Compliance Notes:

## QA
- Related Test Cases:
- Required States:
- Release Decision:
```

---

## 18. i18n / A11y / Performance Baseline

| 维度 | L5 基线 |
|---|---|
| i18n | 用户可见文案必须使用 key；金额、币种、日期、姓名顺序支持地区格式 |
| A11y | 表单 label 绑定、错误提示关联、按钮可聚焦、弹窗 focus trap、键盘基础可用 |
| Performance | 首屏 loading / skeleton，大列表分页或虚拟滚动，表单防重复提交，接口超时反馈 |
| Responsive | App / H5 / Web / Admin 必须有平台差异说明 |
| Copy | 风险、协议、资金、合规文案必须严谨，不得误导 |
| Security | 敏感字段必须声明存储、传输、展示、脱敏规则 |

---

## 19. Agent 编排规则

建议在 `AGENTS.md` 中声明以下 Agent。

| Agent | 职责 | 输入 | 输出 |
|---|---|---|---|
| Product Agent | 业务建模、模块拆解、规则矩阵 | 用户需求 / 旧文档 / 截图 | Product Kernel / Module Contract |
| Contract Agent | 页面契约、字段契约、状态机 | Product Kernel / Business Rules | Page Contract / State Machine |
| API Agent | 接口草案、Schema、错误码、Mock | Page Contract | API Contract |
| Permission Agent | 角色、权限、数据范围 | Roles / Modules | RBAC / Permission Matrix |
| Risk Agent | KYC、资金、安全、合规规则 | Business Rules | Risk Checklist / Audit Rules |
| Traceability Agent | 关联规则、页面、接口、测试 | 全部契约 | Traceability Matrix |
| QA Agent | 校验资产完整性 | 全部交付物 | QA Report / Release Decision |

执行顺序：

```text
Product Agent
→ Permission Agent
→ Contract Agent
→ API Agent
→ Risk Agent
→ Design System Binding
→ Traceability Agent
→ UI Build
→ QA Agent
→ Change Impact
→ Release Decision
```

---

## 20. Validation Scripts

### 20.1 `package.json`

```json
{
  "scripts": {
    "qa:product": "node scripts/check-product-kernel.js",
    "qa:module": "node scripts/check-module-contract.js",
    "qa:rules": "node scripts/check-business-rules.js",
    "qa:rbac": "node scripts/check-rbac-policy.js",
    "qa:state": "node scripts/check-state-machine.js",
    "qa:contract": "node scripts/check-page-contract.js",
    "qa:api": "node scripts/check-api-contract.js",
    "qa:trace": "node scripts/check-traceability.js",
    "qa:all": "node scripts/qa-all.js"
  }
}
```

### 20.2 QA 脚本最低检查

| 脚本 | 必须检查 |
|---|---|
| `check-product-kernel.js` | required 字段、version、platform、source_of_truth、owners |
| `check-module-contract.js` | module_id、entry/exit、related pages/api、risk notes |
| `check-business-rules.js` | rule_id、condition、behavior、feedback、severity、test_required |
| `check-rbac-policy.js` | roles、permissions、policies、deny / allow 冲突 |
| `check-state-machine.js` | initial、terminal、transition、guard、failed path |
| `check-page-contract.js` | required 字段、states、fields、interactions、risk rules |
| `check-api-contract.js` | path、method、request、response、error mapping、mock |
| `check-traceability.js` | rule → page → api → test 是否断链 |
| `qa-all.js` | 输出 Release Decision |

---

## 21. Change Impact

### 21.1 变更类型

| 类型 | 示例 | 是否必须影响分析 |
|---|---|---:|
| Business Rule Change | 修改开户条件、出金限制 | 是 |
| Permission Change | 新增角色、隐藏按钮 | 是 |
| API Change | 字段改名、错误码新增 | 是 |
| Page Change | 页面结构、交互、状态调整 | 是 |
| Design System Change | Token、组件、Pattern 变化 | 是 |
| Copy Change | 风险、协议、资金文案 | 条件必须 |
| Region Rule Change | 国家、语言、币种、KYC 规则 | 是 |

### 21.2 `change-impact.report.md`

```md
# Change Impact Report

- Change ID:
- Version:
- Date:
- Change Type:
- Reason:
- Source:
- Impacted Domains:
- Impacted Modules:
- Impacted Business Rules:
- Impacted Pages:
- Impacted APIs:
- Impacted Roles:
- Impacted Components:
- Impacted Test Cases:
- Migration Required:
- Risk Level:
- QA Required:
- Release Decision:
- Owner:
```

---

## 22. Forbidden Rules

```text
- 禁止跳过 Product Kernel 直接生成页面。
- 禁止无业务规则、无状态机、无权限模型就进入 UI Build。
- 禁止 Page Contract 字段缺失却标记 ready。
- 禁止把假设当事实写入业务规则。
- 禁止资金、KYC、银行卡、证件、协议、审核场景缺少风险规则。
- 禁止前端权限替代服务端权限。
- 禁止错误码没有 UI 映射。
- 禁止核心规则没有测试用例。
- 禁止存在 Blocker / Critical 仍允许交付。
- 禁止变更不记录影响范围。
- 禁止删除旧规则、旧页面、旧接口而没有迁移说明。
```

---

## 23. AI 执行命令

### 23.1 初始化生产级产品工程

```txt
使用 AI Product Production Delivery Skill v3.0.0-L5 初始化产品工程交付包。

输入：
- Product Goal:
- Platform:
- User Roles:
- Module Scope:
- Business Rules:
- Region / Compliance:
- Delivery Mode:
- Existing Assets:
- API / Data Source:

要求：
1. 先输出 Product Kernel，不直接生成页面。
2. 建立 Module Contract、RBAC、Business Rule、State Machine。
3. 建立 Page Contract Schema 与首批页面契约。
4. 建立 API Contract Draft、Error Codes、Mock Data。
5. 建立 Risk、Audit、i18n、A11y、Performance 基线。
6. 建立 Traceability Matrix 与 Test Case Mapping。
7. 建立 QA Severity、Release Decision、Change Impact。
8. 输出是否允许进入 Design System / UI Build / Development。
9. 不输出 Demo 页面。
```

### 23.2 生成页面契约

```txt
使用 AI Product Production Delivery Skill v3.0.0-L5 为以下页面生成 Page Contract。

Module:
Page:
Platform:
Role:
Business Goal:
Preconditions:
Business Rules:
Exception Scenarios:
API Dependencies:
Risk Notes:

输出：
1. page-contract.json
2. state-machine.yaml
3. field-spec.md
4. api-contract.draft.md
5. error-code.mapping.json
6. risk-checklist.md
7. test-case.mapping.md
8. handoff-notes.md
9. traceability.matrix.md
```

### 23.3 执行生产级验收

```txt
使用 AI Product Production Delivery Skill v3.0.0-L5 执行生产级验收。

检查：
- Product Kernel
- Module Contract
- Business Rules
- RBAC / Permission
- State Machine
- Page Contract
- API Contract
- Error Codes
- Risk / Audit
- Traceability
- Test Case Mapping
- Handoff
- Change Impact
- Release Decision

输出：
1. 问题清单
2. Severity：Blocker / Critical / Major / Minor / Info
3. 修复建议
4. Owner
5. 是否允许进入 UI Build
6. 是否允许交付开发
7. 是否允许 Release
```

---

## 24. L5 完成标准

| 标准 | 必须满足 |
|---|---:|
| Product Kernel 有 Schema 并通过校验 | 是 |
| Module Contract 有 Schema 并通过校验 | 是 |
| Business Rule 有机器可读结构 | 是 |
| RBAC / Permission 可被前后端消费 | 是 |
| State Machine 有事件、guard、action、失败路径 | 是 |
| Page Contract 可被 UI Build 稳定消费 | 是 |
| API / Schema / Mock / Error Code 可交付开发讨论 | 是 |
| KYC / 资金 / 敏感数据 / 审计规则覆盖 | 是 |
| Assumption 有 Owner、风险、状态、确认期限 | 是 |
| Traceability Matrix 完整 | 是 |
| Test Case Mapping 覆盖核心规则 | 是 |
| QA Severity 可阻断交付 | 是 |
| Release Decision 明确 | 是 |
| Change Impact 可追踪 | 是 |
| Handoff Contract 可被开发 / QA / 合规消费 | 是 |

---

## 25. 最终定义

```text
AI Product Production Delivery Skill v3.0.0-L5
= Product Kernel Schema
+ Module Contract Schema
+ Business Rule Schema
+ RBAC Policy
+ State Machine
+ Page Contract
+ API Contract
+ Error Code Taxonomy
+ Risk / Audit Rules
+ Assumption Governance
+ Traceability Matrix
+ Test Case Mapping
+ Handoff Contract
+ QA Severity Gate
+ Release Decision
+ Change Impact
```

它不是写 PRD 的 Skill，也不是让 AI 直接画页面的 Skill。

它是 **AI 产品工程总控 Skill**：
负责把业务需求转成可执行、可校验、可追踪、可测试、可交付的生产级产品工程资产。只有通过契约、校验、追踪、测试和发布决策的产物，才允许进入 Design System、UI Build 与开发交付阶段。
