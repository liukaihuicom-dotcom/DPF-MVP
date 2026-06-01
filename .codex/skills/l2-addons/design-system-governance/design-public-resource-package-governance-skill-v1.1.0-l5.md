---
name: design-public-resource-package-governance
description: 当任务涉及设计公共资源包、变量系统、组件库、业务组件、通用模块、页面模板、弹框、流程、状态、图标、插图、文案、多语言、Pattern 复用、共享资产同步、版本迁移、影响范围分析、开发交付资源治理时使用。用于确保 Codex 搭建的产品设计包长期可维护、可引用、可同步、可迭代、可交付开发。必须优先读取公共资源 registry，不允许页面复制公共资产或散落自建。
layer: L2
category: "Design System Governance Add-on"
parent: "Design System Engineering Skill v3.0.0-L5"
depends_on:
  - "public asset registry"
  - "component manifest"
  - "pattern registry"
  - "icon registry"
  - "asset dependency graph"
standalone: false
hierarchy: "L1 Core Design System Engineering > Design System Engineering Skill > Design Public Resource Package Governance Add-on"
---

# Design Public Resource Package Governance Skill v1.1.0-L5 中文版

## Classification And Hierarchy

| Field | Value |
|---|---|
| Layer | L2 |
| Category | Design System Governance Add-on |
| Parent | Design System Engineering Skill v3.0.0-L5 |
| Standalone | No |
| Hierarchy | L1 Core Design System Engineering > Design System Engineering Skill > Design Public Resource Package Governance Add-on |

Depends on:

- public asset registry
- component manifest
- pattern registry
- icon registry
- asset dependency graph

> 文件路径：`.codex/skills/l2-addons/design-system-governance/design-public-resource-package-governance-skill-v1.1.0-l5.md`  
> 版本：`v1.1.0-L5 Production Locked`  
> 等级：`L5 Add-on / Production Design Public Resource Package Governance Skill`  
> 父级 Skill：`Design System Engineering Skill v3.0.0-L5`  
> 可调用 Skill：  
> - `AI Product Production Delivery Skill v3.0.0-L5`
> - `Design System Engineering Skill v3.0.0-L5`
> - `UI Build Production Skill v3.0.0-L5`
> - `Local Icon Asset Library Governance Skill v1.1.0-L5`
> - `Financial UX Copy & Localization Governance Skill v1.0.0-L5`
> - `UX Interaction Quality Gate Skill v1.0.0-L5`
> - `Product Design Quality Review Gate Skill v1.0.0-L5`
>
> 目标：将变量系统、组件库、业务组件、通用模块、页面模板、弹框、流程、状态、图标、插图、文案、多语言、Pattern、QA 和交付模板，统一沉淀为长期可维护、可引用、可同步、可迭代的设计公共资源包。

---

## 0. v1.1.0 升级说明

本版本基于 v1.0.0 补齐生产 L5 缺口：

| 升级项 | 说明 |
|---|---|
| Asset Dependency Graph Schema | 明确页面、Pattern、组件、Token、Icon、Copy 的依赖关系 |
| Deprecated / Replacement Policy | 明确旧资产废弃、替代、删除周期 |
| Page Readiness Matrix | 用页面矩阵审核公共资源引用情况 |
| Automated QA Scripts | 增加 hardcode、dependency graph、registry、icon、copy 检查建议 |
| Local Icon Boundary | 明确图标治理必须调用本地图标 Skill，禁止回退第三方图标库 |
| AGENTS.md Route Rule | 明确 Codex 如何调用本 Skill |
| Production Lock Rules | 明确哪些情况必须 blocked |
| Migration Gate | props、结构、交互变更必须迁移计划 |

---

## 1. 核心定位

本 Skill 不是普通组件库规范，也不是单页 UI 生成规范。  
它负责管理整个产品设计包中的公共资产，让 Codex 在后续搭建页面、重构页面、修改 UI、交付开发时，优先复用已有公共资源，而不是重复生成、复制模板、页面内散落自建。

核心目标：

```text
公共资源独立管理
→ 页面按引用调用
→ 同类模块统一抽取
→ 更新可同步
→ 影响可追踪
→ 变更可迁移
→ QA 可阻断
→ 交付可执行
```

---

## 2. 设计公共资源包范围

| 层级 | 公共资源类型 | 示例 | 是否必须 |
|---|---|---|---:|
| 1 | Foundation Tokens | color、font、space、radius、shadow、motion、z-index | 是 |
| 2 | Base Components | Button、Input、Select、Tabs、Badge、Toast、Dialog | 是 |
| 3 | Business Components | WalletCard、TradingAccountCard、KYCStatusCard、PartnerCard | 是 |
| 4 | Page Patterns | Wallet Home、Deposit Page、Withdrawal Page、KYC Flow | 是 |
| 5 | Dialog Patterns | Risk Warning、Confirm Withdrawal、KYC Required、Exit Agreement | 是 |
| 6 | Flow Patterns | 开户、KYC、入金、出金、添加银行卡、视频验证 | 是 |
| 7 | State Patterns | Loading、Empty、Error、Success、Restricted、Under Review | 是 |
| 8 | Data / List Patterns | Transaction List、Account List、Sub-IB List、Audit Log | 是 |
| 9 | Icon Assets | 本地图标库、icon-registry、Icon component | 是 |
| 10 | Copy / i18n Assets | 英文、印尼语、风险文案、CTA、错误文案、i18n key | 是 |
| 11 | Illustration Assets | 空状态、引导、成功、Partner 插图 | 建议 |
| 12 | QA / Handoff Assets | QA checklist、release decision、handoff template、change impact | 是 |

---

## 3. 核心原则

| 原则 | 要求 |
|---|---|
| 引用优先 | 页面必须 import / 调用公共资源，不能复制模板 |
| 单一来源 | token、component、icon、copy、pattern 都必须有唯一源 |
| 2 次抽取 | 同类组件 / 弹框 / 页面结构出现 2 次以上必须抽成公共资源 |
| 更新可同步 | 公共资源改动后，引用页面应同步更新 |
| 影响可追踪 | 改公共资源前必须知道影响哪些页面 |
| 破坏性变更要迁移 | 改 props、改结构、删资源必须有 migration plan |
| 禁止页面散落资产 | 页面不能 hardcode 样式、图标、文案、组件结构 |
| QA 阻断 | 不符合公共资源治理规则，不允许标记生产级 |

---

## 4. 推荐目录结构

```text
src/
├── design-public-assets/
│   ├── tokens/
│   │   ├── tokens.json
│   │   └── token-aliases.json
│   ├── components/
│   │   ├── base/
│   │   ├── feedback/
│   │   ├── form/
│   │   └── navigation/
│   ├── business-components/
│   │   ├── wallet/
│   │   ├── trading-account/
│   │   ├── kyc/
│   │   ├── partner/
│   │   └── admin/
│   ├── patterns/
│   │   ├── pages/
│   │   ├── dialogs/
│   │   ├── flows/
│   │   ├── states/
│   │   ├── lists/
│   │   └── admin/
│   ├── icons/
│   │   ├── registry/
│   │   └── components/
│   ├── illustrations/
│   │   ├── registry/
│   │   ├── empty-state/
│   │   ├── onboarding/
│   │   └── success/
│   ├── copy/
│   │   ├── i18n/
│   │   ├── copy-table.json
│   │   └── terminology.json
│   └── registry/
│       ├── public-asset-registry.json
│       ├── public-asset-registry.schema.json
│       ├── component-manifest.json
│       ├── pattern-registry.json
│       ├── icon-registry.json
│       ├── illustration-registry.json
│       ├── asset-dependency-graph.json
│       ├── asset-dependency-graph.schema.json
│       ├── asset-change-log.md
│       └── deprecated-assets.md
└── pages/
    ├── app/
    ├── web/
    └── admin/
```

---

## 5. 必须治理的核心文件

| 文件 | 作用 | 是否必须 |
|---|---|---:|
| `public-asset-registry.json` | 全部公共资源登记表 | 是 |
| `public-asset-registry.schema.json` | 公共资源登记结构 | 是 |
| `component-manifest.json` | 基础组件和业务组件清单 | 是 |
| `pattern-registry.json` | 页面、弹框、流程、状态模式清单 | 是 |
| `icon-registry.json` | 本地图标资产清单 | 是 |
| `copy-table.json` | 英文 / 印尼语文案资产 | 是 |
| `illustration-registry.json` | 插图资产清单 | 建议 |
| `asset-dependency-graph.json` | 页面与公共资产依赖关系 | 是 |
| `asset-dependency-graph.schema.json` | 依赖图结构 | 是 |
| `asset-change-log.md` | 公共资产变更记录 | 是 |
| `deprecated-assets.md` | 废弃资源记录 | 是 |
| `change-impact-report.md` | 变更影响报告模板 | 是 |
| `migration-plan.md` | 破坏性变更迁移计划 | 是 |
| `qa-checklist.md` | 公共资源 QA | 是 |

---

## 6. Public Asset Registry Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Design Public Resource Package Registry Schema",
  "type": "object",
  "required": ["assets"],
  "properties": {
    "assets": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "asset_id",
          "asset_type",
          "name",
          "version",
          "source_path",
          "usage_scope",
          "status",
          "owner",
          "dependencies",
          "dependents",
          "sync_policy",
          "qa_status"
        ],
        "properties": {
          "asset_id": { "type": "string" },
          "asset_type": {
            "enum": [
              "token",
              "base_component",
              "business_component",
              "page_pattern",
              "dialog_pattern",
              "flow_pattern",
              "state_pattern",
              "list_pattern",
              "admin_pattern",
              "icon_asset",
              "copy_asset",
              "illustration_asset",
              "qa_asset",
              "handoff_asset"
            ]
          },
          "name": { "type": "string" },
          "version": { "type": "string" },
          "source_path": { "type": "string" },
          "doc_path": { "type": "string" },
          "usage_scope": { "type": "array", "items": { "type": "string" } },
          "platforms": { "type": "array", "items": { "enum": ["app", "h5", "web", "admin"] } },
          "status": { "enum": ["draft", "approved", "deprecated", "blocked"] },
          "owner": { "type": "string" },
          "dependencies": { "type": "array", "items": { "type": "string" } },
          "dependents": { "type": "array", "items": { "type": "string" } },
          "sync_policy": { "enum": ["auto_sync", "controlled_sync", "manual_migration", "do_not_sync"] },
          "qa_status": { "enum": ["not_checked", "passed", "conditional", "failed"] },
          "last_updated": { "type": "string" }
        }
      }
    }
  }
}
```

---

## 7. Asset Dependency Graph Schema

Codex 必须维护依赖图，明确：

```text
哪个页面引用了哪个 Pattern
哪个 Pattern 引用了哪些组件
哪些组件用了哪些 token
哪些图标被哪些页面使用
哪些文案 key 被哪些组件使用
改一个公共资源会影响哪些页面
```

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Asset Dependency Graph Schema",
  "type": "object",
  "required": ["nodes", "edges"],
  "properties": {
    "nodes": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "type", "path", "status"],
        "properties": {
          "id": { "type": "string" },
          "type": {
            "enum": [
              "page",
              "pattern",
              "component",
              "business_component",
              "token",
              "icon",
              "copy",
              "illustration",
              "state",
              "flow",
              "qa_asset",
              "handoff_asset"
            ]
          },
          "path": { "type": "string" },
          "status": { "enum": ["active", "deprecated", "blocked"] },
          "version": { "type": "string" }
        }
      }
    },
    "edges": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["from", "to", "relation"],
        "properties": {
          "from": { "type": "string" },
          "to": { "type": "string" },
          "relation": {
            "enum": ["imports", "uses", "depends_on", "renders", "maps_to", "overrides"]
          }
        }
      }
    }
  }
}
```

---

## 8. 引用型架构规则

### 8.1 正确方式

```tsx
import { DepositPagePattern } from "@/design-public-assets/patterns/pages/deposit-page";
import { Icon } from "@/design-public-assets/icons/components/Icon";

export default function DepositPage() {
  return (
    <DepositPagePattern
      account={account}
      methods={methods}
      amount={amount}
      state={state}
      onSubmit={handleSubmit}
    />
  );
}
```

### 8.2 禁止方式

```tsx
// Forbidden
// 页面内复制一整套 Deposit Page DOM、样式、图标、状态和文案
<div className="custom-deposit-page">
  <svg>...</svg>
  <button style={{ color: "#2EB5C4" }}>Submit</button>
</div>
```

---

## 9. 同步治理规则

| 修改对象 | 使用页面是否同步 | 同步策略 | 说明 |
|---|---:|---|---|
| tokens | 会 | auto_sync | 颜色、间距、圆角、字体等自动同步 |
| base component | 会 | auto_sync | Button、Input、Card 等同步 |
| business component | 会 | controlled_sync | 钱包卡片、账户卡片、KYC 卡片同步 |
| icon registry | 会 | controlled_sync | 替换 icon key 对应资产后同步 |
| copy / i18n | 会 | auto_sync | 文案 key 不变时同步 |
| page pattern 样式 | 会 | controlled_sync | 引用 Pattern 的页面同步 |
| page pattern 结构 | 谨慎 | manual_migration | 需要 impact report |
| props 破坏性变更 | 不应自动同步 | manual_migration | 必须 migration plan |
| 页面内复制代码 | 不会 | do_not_sync | 因为不是引用 |

---

## 10. 抽取规则

| 触发条件 | 抽取目标 |
|---|---|
| 同一 UI 模块出现 2 次以上 | Business Component |
| 同一页面结构出现 2 次以上 | Page Pattern |
| 同一弹框结构出现 2 次以上 | Dialog Pattern |
| 同一状态结构出现 2 次以上 | State Pattern |
| 同一表单流程出现 2 次以上 | Flow Pattern |
| 同一表格 / 列表结构出现 2 次以上 | List / Table Pattern |
| 同一修复问题出现 2 次以上 | 上升到公共资源层修复 |

抽取前必须输出：

```md
# Reusable Public Asset Extraction Report

| Candidate | Appears In | Similarity | Recommended Asset Type | Reason | Decision |
|---|---|---:|---|---|---|
```

抽取后必须输出：

```md
# Reusable Public Asset Extraction Result

- New Asset ID:
- Asset Type:
- Source Path:
- Doc Path:
- Replaced Page-level Implementations:
- Props Schema:
- State Matrix:
- Dependencies:
- Dependents:
- Sync Policy:
- QA Result:
```

---

## 11. Change Impact Report

更新任何公共资源前，Codex 必须输出：

```md
# Design Public Resource Change Impact Report

- Asset ID:
- Asset Type:
- Change Type: patch / minor / major / deprecated
- Sync Policy: auto_sync / controlled_sync / manual_migration
- Affected Pages:
- Affected Patterns:
- Affected Components:
- Affected Tokens:
- Affected Icons:
- Affected Copy Keys:
- Affected Illustrations:
- Risk Level:
- Required QA:
- Migration Required: Yes / No
- Release Decision:
```

---

## 12. Migration Plan

破坏性变更必须输出：

```md
# Migration Plan

- Change Summary:
- Breaking Change:
- Old API / Props:
- New API / Props:
- Affected Assets:
- Affected Pages:
- Migration Steps:
- Compatibility Strategy:
- Rollback Plan:
- QA Scope:
- Owner:
- Deadline:
```

---

## 13. Deprecated / Replacement Policy

公共资产不能直接删除，必须先废弃，再替代，再迁移，最后删除。

### 13.1 废弃流程

```text
1. Mark as deprecated
2. Provide replacement asset
3. Add migration plan
4. Update affected pages
5. Run regression QA
6. Remove only in major version
```

### 13.2 Deprecated Asset 记录模板

```md
# Deprecated Asset Record

- Deprecated Asset ID:
- Asset Type:
- Deprecated Version:
- Reason:
- Replacement Asset ID:
- Affected Pages:
- Migration Plan:
- Removal Version:
- Owner:
- Status:
```

---

## 14. Override 管理

| Override 类型 | 是否允许 | 规则 |
|---|---:|---|
| Data override | 是 | 通过 props 输入 |
| Copy override | 是 | 通过 i18n key 或 copy slot |
| Icon override | 条件允许 | 必须来自 icon-registry |
| CTA override | 条件允许 | 不得改变风险和主流程 |
| Layout override | 谨慎 | 只能通过 slot 或 variant |
| Color override | 不建议 | 必须走 token |
| Hardcoded style override | 禁止 | 破坏同步 |
| Direct DOM override | 禁止 | 破坏 Pattern |

---

## 15. 版本治理

| 变更 | Version | 是否需要迁移 |
|---|---|---:|
| 修复 bug / 对齐 / 文案修正 | Patch | 否 |
| 新增变体 / 新增 slot / 新增状态 | Minor | 否 |
| 修改结构 / 删除 props / 改交互路径 | Major | 是 |
| 废弃 Pattern / Component | Minor with deprecation | 是 |
| 删除 Pattern / Component | Major | 是 |

---

## 16. Page Readiness Matrix

每个页面交付前必须进入矩阵：

```md
# Page Readiness Matrix

| Page | Uses Tokens | Uses Components | Uses Pattern | Uses Icon Registry | Uses Copy/i18n | Has State Matrix | Hardcode Issues | Public Resource Decision |
|---|---:|---:|---:|---:|---:|---:|---|---|
| Deposit Page | Yes | Yes | Yes | Yes | Yes | Yes | None | ready |
```

阻断条件：

```text
- 未使用 tokens
- 页面复制公共 Pattern
- 页面内写 inline SVG
- 页面内写未注册文案
- 组件 / Pattern 未进入 registry
- 缺 State Matrix
- 缺依赖图记录
```

---

## 17. Local Icon Boundary

图标治理必须调用：

```text
Local Icon Asset Library Governance Skill v1.1.0-L5
```

禁止回退旧第三方图标策略：

```text
- 不允许 Phosphor / Remix / Lucide 作为运行时依赖
- 不允许页面 import 第三方图标包
- 不允许 inline SVG
- 不允许未注册本地图标进入页面
```

公共资源包只登记图标资产，不负责单独审核图标视觉质量。图标视觉质量、语义、状态、可访问性必须交给 Local Icon Skill。

---

## 18. Automated QA Scripts 建议

Codex 应建议项目增加以下脚本：

```json
{
  "scripts": {
    "qa:public-assets": "node scripts/qa-public-assets.js",
    "qa:dependency-graph": "node scripts/qa-dependency-graph.js",
    "qa:hardcode": "node scripts/qa-no-hardcode-styles.js",
    "qa:icons": "node scripts/qa-local-icons.js",
    "qa:i18n": "node scripts/qa-i18n-keys.js",
    "qa:patterns": "node scripts/qa-pattern-registry.js"
  }
}
```

### 脚本检查目标

| Script | 检查 |
|---|---|
| `qa:public-assets` | 公共资产是否登记 |
| `qa:dependency-graph` | 依赖关系是否完整 |
| `qa:hardcode` | 是否存在硬编码 color、spacing、radius、shadow、font |
| `qa:icons` | 是否存在第三方 icon import、inline SVG、未注册图标 |
| `qa:i18n` | 用户可见文案是否缺 i18n key |
| `qa:patterns` | 页面是否复制 Pattern 或未注册 Pattern |

---

## 19. QA Gate

| Gate | 检查项 | Block 条件 |
|---|---|---|
| Public Asset Gate | 是否进入 public-asset-registry | 未登记公共资产 |
| Reuse Gate | 是否复用了现有资产 | 重复造同类模块 |
| Reference Gate | 页面是否引用资产 | 页面复制模板代码 |
| Token Gate | 是否绑定 token | 硬编码颜色/间距/圆角/字体 |
| Component Gate | 是否使用 component manifest | 自造一次性组件 |
| Pattern Gate | 是否登记 pattern registry | 未注册 Pattern |
| Icon Gate | 是否使用 Local Icon Skill / icon-registry | 未注册图标、第三方 icon |
| Copy Gate | 是否使用 i18n / copy table | 页面临时文案 |
| Dependency Gate | 是否记录依赖关系 | 改动无法追踪影响 |
| Sync Gate | 是否定义同步策略 | 更新后无法判断影响范围 |
| Migration Gate | 破坏性变更是否有迁移计划 | 无迁移计划 |
| Deprecation Gate | 废弃资产是否有 replacement | 无替代资源 |
| Handoff Gate | 是否可交付开发 | 缺 handoff |

### 19.1 Severity Matrix

| Severity | 定义 | 是否阻断 |
|---|---|---:|
| Blocker | 页面复制公共资产、破坏同步、缺关键依赖、缺 Page Contract、第三方 icon 运行时依赖 | 是 |
| Critical | 破坏性变更无 migration plan、Pattern 未注册、组件重复造、无 replacement 删除旧资产 | 是 |
| Major | 部分 hardcode、依赖不完整、QA 不完整 | 条件阻断 |
| Minor | 文档不完整、命名可优化 | 否 |
| Info | 建议项 | 否 |

### 19.2 Scorecard

| 维度 | 分值 |
|---|---:|
| Public asset completeness | 15 |
| Reuse correctness | 15 |
| Reference architecture | 15 |
| Registry completeness | 15 |
| Dependency traceability | 10 |
| Token / component / icon / copy binding | 10 |
| Version / migration governance | 10 |
| Handoff readiness | 10 |

| 分数 | Decision |
|---|---|
| 95-100 | l5_public_resource_ready |
| 90-94 | public_resource_ready |
| 80-89 | conditional_ready |
| 70-79 | major_fix_required |
| <70 | blocked |

---

## 20. Release Decision

| Decision | 条件 |
|---|---|
| `l5_public_resource_ready` | 0 Blocker，0 Critical，score ≥ 95 |
| `public_resource_ready` | 0 Blocker，0 Critical，score 90-94 |
| `conditional_ready` | 0 Blocker，0 Critical，score 80-89，Major 有 owner |
| `major_fix_required` | Major 问题影响同步、复用或交付 |
| `blocked` | 任意 Blocker / Critical 或 score < 70 |

---

## 21. Codex 执行协议

### 21.1 新建页面前

```text
1. 读取 Product Design Intent。
2. 读取 Visual DNA。
3. 搜索 public-asset-registry.json。
4. 搜索 pattern-registry.json。
5. 搜索 component-manifest.json。
6. 搜索 icon-registry.json。
7. 搜索 copy-table / i18n keys。
8. 判断是否已有可复用 Pattern。
9. 如果有，必须引用。
10. 如果没有，并且未来可能复用，必须创建 reusable pattern。
11. 禁止从 0 复制已有结构。
```

### 21.2 修改页面时

```text
1. 先判断问题属于 page / token / component / pattern / icon / copy / UX。
2. 如果是公共资源问题，回到公共资源层修改。
3. 输出影响范围。
4. 更新 asset-dependency-graph。
5. 运行受影响页面回归检查。
```

### 21.3 更新公共资源时

```text
1. 判断 change type。
2. 输出 impact report。
3. 判断 sync policy。
4. 如果是 controlled_sync，运行视觉和交互回归。
5. 如果是 manual_migration，输出 migration plan。
6. 更新 registry version。
7. 更新 change log。
```

---

## 22. AI 执行命令

### 22.1 初始化设计公共资源包

```txt
使用 Design Public Resource Package Governance Skill v1.1.0-L5 初始化设计公共资源包。

目标：
将变量系统、组件库、业务组件、通用模块、页面模板、弹框、流程、状态、图标、插图、文案、多语言、Pattern、QA 和交付模板整理为可引用、可复用、可同步的生产级设计公共资源。

要求：
1. 创建 src/design-public-assets 目录。
2. 创建 public-asset-registry.json 和 schema。
3. 创建 component-manifest.json。
4. 创建 pattern-registry.json。
5. 创建 icon-registry.json。
6. 创建 copy-table.json。
7. 创建 illustration-registry.json。
8. 创建 asset-dependency-graph.json 和 schema。
9. 创建 deprecated-assets.md。
10. 抽取重复出现的组件、页面、弹框、状态和流程。
11. 页面必须通过引用公共资产使用，不允许复制模板。
12. 增加 QA scripts 建议。
13. 输出 Public Resource QA Report 和 Release Decision。
```

### 22.2 更新公共资源并同步页面

```txt
使用 Design Public Resource Package Governance Skill v1.1.0-L5 更新公共资源，并同步所有引用页面。

输入：
- Asset ID:
- Change:
- Change Type:
- Expected Scope:

执行：
1. 读取 asset-dependency-graph。
2. 输出 Change Impact Report。
3. 判断 sync_policy。
4. 如果是 auto_sync，更新资产并运行回归检查。
5. 如果是 controlled_sync，更新资产并截图 / 视觉 / UX 回归。
6. 如果是 manual_migration，先输出 migration plan，不得直接改。
7. 更新版本号和 changelog。
8. 输出 Release Decision。
```

### 22.3 审核公共资源包是否达到 L5

```txt
使用 Design Public Resource Package Governance Skill v1.1.0-L5 审核当前公共资源包是否达到 L5。

检查：
1. public-asset-registry 是否完整
2. component-manifest 是否完整
3. pattern-registry 是否完整
4. icon-registry 是否为本地图标体系
5. copy/i18n 是否完整
6. asset-dependency-graph 是否完整
7. 是否存在页面复制公共资产
8. 是否存在 hardcode style
9. 是否存在未注册 icon / copy / pattern
10. 是否存在破坏性变更无 migration
11. 是否存在 deprecated asset 无 replacement
12. 是否有 QA scripts
13. 是否可交付开发

输出：
- Public Resource QA Report
- Page Readiness Matrix
- Missing Items
- Blocker / Critical / Major / Minor
- Fix Plan
- Release Decision
```

---

## 23. 禁止规则

```text
- 禁止公共资源散落在页面中。
- 禁止复制型页面模板作为生产级方案。
- 禁止页面内复制公共 Pattern 的大段结构。
- 禁止绕过 public-asset-registry。
- 禁止新建页面前不查 pattern-registry。
- 禁止同类模块出现 2 次以上仍不抽取。
- 禁止 hardcode color、spacing、radius、shadow、typography。
- 禁止页面内直接使用未注册 icon。
- 禁止页面内写未进入 i18n 的用户可见文案。
- 禁止破坏性变更无 impact report。
- 禁止 major 变更无 migration plan。
- 禁止废弃资产无 replacement。
- 禁止无法追踪影响范围的公共资源更新。
- 禁止旧第三方图标策略覆盖 Local Icon Governance。
```

---

## 24. AGENTS.md 路由建议

```md
## Design Public Resource Package Governance Rule

When building or updating variables, components, business components, pages, dialogs, flows, states, icons, illustrations, copy, i18n, reusable modules, or design system assets, Codex must first check:

- `src/design-public-assets/registry/public-asset-registry.json`
- `src/design-public-assets/registry/pattern-registry.json`
- `src/design-public-assets/registry/component-manifest.json`
- `src/design-public-assets/registry/icon-registry.json`
- `src/design-public-assets/registry/asset-dependency-graph.json`
- `docs/product-patterns/`

Codex must not recreate an existing reusable asset from scratch.

If a matching public resource exists, Codex must reuse it by reference.

If the same component, layout, dialog, flow, state, or large module appears in two or more places, Codex must extract it into a reusable public asset.

When modifying public resources, Codex must output:

1. Change Impact Report
2. Affected Pages
3. Affected Components
4. Affected Patterns
5. Sync Policy
6. Regression Check Plan
7. Migration Plan when needed
8. Release Decision

Hard rules:
- Pages must reference public resources.
- Pages must not copy public asset implementation.
- Icons must follow Local Icon Asset Library Governance Skill.
- Breaking changes require Migration Plan.
- Deprecated assets require replacement.
```

---

## 25. L5 完成标准

| 标准 | 必须满足 |
|---|---:|
| 有 public asset registry | 是 |
| 有 component manifest | 是 |
| 有 pattern registry | 是 |
| 有 icon registry | 是 |
| 有 copy / i18n registry | 是 |
| 有 illustration registry | 建议 |
| 有 asset dependency graph 和 schema | 是 |
| 有 change impact report | 是 |
| 有 migration plan | 是 |
| 有 deprecated / replacement policy | 是 |
| 有 sync policy | 是 |
| 有 override policy | 是 |
| 有 Page Readiness Matrix | 是 |
| 有 QA gate | 是 |
| 有 QA scripts 建议 | 是 |
| 有 release decision | 是 |
| 可被 Codex 理解和执行 | 是 |

---

## 26. 最终定义

```text
Design Public Resource Package Governance Skill v1.1.0-L5
= Foundation Tokens
+ Base Components
+ Business Components
+ Page Patterns
+ Dialog Patterns
+ Flow Patterns
+ State Patterns
+ Icon Assets
+ Illustration Assets
+ Copy / i18n Assets
+ QA / Handoff Assets
+ Public Asset Registry
+ Asset Dependency Graph
+ Deprecated / Replacement Policy
+ Sync Policy
+ Change Impact Report
+ Migration Plan
+ Page Readiness Matrix
+ Automated QA Scripts
+ Release Decision
```

它的价值不是做更多页面。  
它的价值是让 Codex 后续搭建产品设计包时，能够先复用公共资源、再扩展公共资源、持续同步更新、追踪影响范围、长期维护、生产级交付开发。
