---
name: icon-asset-library-governance
description: 当任务涉及本地创建的图标资源、本地图标库、icon registry、SVG 质量、金融图标语义、图标命名、图标组件映射、Token 绑定、Icon QA、禁止第三方图标库调用时使用。所有生产图标必须来自项目本地资产，不允许直接调用 Phosphor、Remix、Lucide、Iconify、react-icons 或其他第三方图标包。
layer: L2
category: "Design System Governance Add-on"
parent: "Design System Engineering Skill v3.0.0-L5"
depends_on:
  - "icon registry"
  - "local icon assets"
  - "token rules"
  - "license/source metadata"
standalone: false
hierarchy: "L1 Core Design System Engineering > Design System Engineering Skill > Local Icon Asset Library Governance Add-on"
---

# Local Icon Asset Library Governance Skill v1.1.0-L5 中文版

## Classification And Hierarchy

| Field | Value |
|---|---|
| Layer | L2 |
| Category | Design System Governance Add-on |
| Parent | Design System Engineering Skill v3.0.0-L5 |
| Standalone | No |
| Hierarchy | L1 Core Design System Engineering > Design System Engineering Skill > Local Icon Asset Library Governance Add-on |

Depends on:

- icon registry
- local icon assets
- token rules
- license/source metadata

> 文件路径：`.codex/skills/l2-addons/design-system-governance/local-icon-asset-library-governance-skill-v1.1.0-l5.md`
> 版本：`v1.1.0-L5`
> 等级：`L5 Add-on / Production Local Financial Icon Asset Library Governance Skill`
> 父级 Skill：`Design System Engineering Skill v3.0.0-L5`
> 可被调用：`Design System Engineering Skill v3.0.0-L5`、`UI Build Production Skill v3.0.0-L5`、`UI Reference Adaptation Add-on Skill v1.0.0-L5`
> 目标：基于项目本地创建的图标资源，搭建生产级金融 icon 资产系统。所有图标必须来自本地 SVG / 本地图标组件 / 本地 icon registry，不允许页面直接调用第三方图标库。

---

## 0. 核心定位

本 Skill 是 `Design System Engineering Skill` 的本地图标资产治理 Add-on。

它不再使用 Phosphor / Remix / Lucide 作为运行时来源，也不允许页面或组件直接 import 第三方图标库。

它负责建立一套本地化、可维护、可被 AI 稳定调用的生产级图标资产系统：

```text
Local Icon Assets
→ Financial Icon Taxonomy
→ Icon Registry
→ Local SVG / Component Mapping
→ Token Binding
→ State Mapping
→ Icon QA Gate
→ Release Governance
```

它不负责：

```text
- 不从第三方图标库运行时 import 图标
- 不让 Codex 随机生成图标
- 不直接抓取未知来源 SVG
- 不在页面内临时手写 SVG
- 不允许页面绕过 Icon 组件调用本地图标
- 不允许未注册图标进入生产 UI
- 不允许 emoji / PNG / 位图图标作为源资产
```

---

## 1. 本地图标资源策略

### 1.1 唯一允许来源

| Source Type | 是否允许 | 说明 |
|---|---:|---|
| `local_svg` | 是 | 项目本地 `src/assets/icons/**/*.svg` |
| `local_component` | 是 | 项目本地封装后的 Icon 组件 |
| `custom_owned` | 是 | 项目团队自绘、自有版权图标 |
| `generated_owned` | 条件允许 | AI 辅助生成但已人工审核、归档、注册 |
| `legacy_local` | 条件允许 | 历史本地图标，需补齐 registry 和 QA |
| `third_party_runtime` | 否 | 禁止直接调用第三方图标包 |
| `unknown_svg` | 否 | 来源不明，不允许进入生产 |
| `competitor_icon` | 否 | 竞品图标或高度相似图标禁止使用 |
| `inline_svg_in_page` | 否 | 页面内临时 SVG 禁止使用 |

### 1.2 禁止调用的第三方来源

生产 UI 中禁止出现以下运行时依赖或直接 import：

```text
@phosphor-icons/react
phosphor-react
remixicon
lucide-react
@lucide/react
react-icons
@iconify/react
iconify
fontawesome
material-icons
heroicons
任意 CDN icon script
任意远程 SVG URL
```

> 如果历史图标最初参考过第三方图标，必须已经转为项目本地资产，并在 registry 中标记 `ownership_status`、`review_status`、`modified`、`source_note`。生产代码不得再直接依赖第三方包。

### 1.3 本地目录标准

```text
src/
├── assets/
│   └── icons/
│       ├── navigation/
│       ├── system/
│       ├── account/
│       ├── wallet/
│       ├── banking/
│       ├── trading/
│       ├── copy-trading/
│       ├── ib-partner/
│       ├── kyc-compliance/
│       ├── status/
│       ├── security/
│       └── deprecated/
│
├── icons/
│   ├── registry/
│   │   ├── icon-registry.schema.json
│   │   ├── icon-registry.json
│   │   ├── icon-replacement.map.md
│   │   └── icon-audit.report.md
│   ├── mappings/
│   │   ├── react-icon-map.ts
│   │   ├── vue-icon-map.ts
│   │   └── figma-icon-map.md
│   ├── components/
│   │   ├── Icon.tsx
│   │   └── Icon.vue
│   └── README.md
```

---

## 2. 本地图标调用原则

### 2.1 唯一调用方式

页面只能通过统一 Icon 组件调用：

```tsx
<Icon
  name="icon.wallet.deposit"
  size="md"
  color="primary"
  state="default"
  ariaLabel="Deposit"
/>
```

禁止页面中直接写：

```tsx
import { Search } from "lucide-react"
import { Wallet } from "@phosphor-icons/react"
import "remixicon/fonts/remixicon.css"
<svg>...</svg>
<img src="/icons/deposit.svg" />
```

### 2.2 调用流程

```text
业务含义
→ icon_key
→ icon-registry.json
→ local_path / component_name
→ Icon component
→ token color / token size
→ render
```

### 2.3 本地 Icon Component 约束

统一 Icon 组件必须支持：

| Prop | 说明 |
|---|---|
| `name` | icon registry 中的 `icon_key` |
| `size` | xs / sm / md / lg / xl，映射 `size.icon.*` |
| `color` | primary / secondary / disabled / active / success / warning / danger / info |
| `state` | default / active / disabled / success / warning / danger / inverse |
| `ariaLabel` | 图标按钮或有语义图标必须提供 |
| `decorative` | 装饰图标设为 true，并使用 `aria-hidden` |

---

## 3. 金融图标分类体系

| Category | 作用 |
|---|---|
| navigation | 底部导航 / 侧边栏 / 顶部导航 |
| system | 返回、关闭、搜索、筛选、更多、设置、上传、下载 |
| account | 用户、资料、认证、安全 |
| trading_account | 交易账号、MT4/MT5、杠杆、账户类型 |
| wallet | 钱包、余额、入金、出金、转账 |
| banking | 银行、银行卡、银行账户、币种 |
| trading | 图表、持仓、订单、信号、市场、点差、保证金、杠杆 |
| copy_trading | 跟单、策略、导师、跟随者、表现 |
| ib_partner | Partner、邀请、返佣、佣金、层级、网络 |
| kyc_compliance | KYC、文件、地址证明、协议、风险披露、视频验证 |
| review | 待处理、审核中、已通过、已拒绝 |
| status | 成功、警告、错误、锁定、受限 |
| notification | 通知、消息、提醒、公告 |
| security | 锁、安全盾、密码、设备、验证 |
| data | 报表、分析、仪表盘、导出 |

---

## 4. 图标命名规则

### 4.1 语义 Key 格式

```text
icon.{category}.{meaning}.{variant?}.{state?}
```

示例：

```text
icon.wallet.deposit
icon.wallet.withdrawal
icon.trading.margin
icon.trading.leverage
icon.kyc.identity
icon.kyc.poa
icon.ib.rebate
icon.system.search
icon.status.success
icon.navigation.wallet.active
```

### 4.2 命名要求

| 规则 | 要求 |
|---|---|
| 语义优先 | 按产品含义命名，不按 SVG 文件名命名 |
| 本地路径独立 | SVG 文件路径写入 registry，不直接暴露给页面 |
| 禁止视觉命名 | 避免 `nice-wallet`、`blue-icon`、`thin-icon` |
| 禁止临时命名 | 避免 `icon1`、`new-deposit`、`test-icon` |
| 命名稳定 | UI 使用后不得无迁移直接改名 |
| 状态明确 | active / disabled / danger 状态必须声明 |
| 分类必需 | 每个图标必须属于 taxonomy category |

---

## 5. Icon Registry Schema

### 5.1 `icon-registry.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Local Financial Icon Registry Schema",
  "type": "object",
  "required": ["icons"],
  "properties": {
    "icons": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "icon_key",
          "category",
          "meaning",
          "source_type",
          "local_path",
          "component_name",
          "style",
          "sizes",
          "states",
          "token_binding",
          "usage",
          "ownership",
          "status"
        ],
        "properties": {
          "icon_key": {
            "type": "string",
            "pattern": "^icon\\.[a-z0-9_]+(\\.[a-z0-9_]+)+$"
          },
          "category": {"type": "string"},
          "meaning": {"type": "string"},
          "source_type": {
            "enum": ["local_svg", "local_component", "custom_owned", "generated_owned", "legacy_local"]
          },
          "local_path": {"type": "string"},
          "component_name": {"type": "string"},
          "style": {
            "type": "object",
            "required": ["default", "active"],
            "properties": {
              "default": {"type": "string"},
              "active": {"type": "string"},
              "disabled": {"type": "string"}
            }
          },
          "sizes": {"type": "array", "items": {"enum": [16, 20, 24, 32, 40]}},
          "states": {
            "type": "array",
            "items": {
              "enum": ["default", "active", "disabled", "success", "warning", "danger", "inverse"]
            }
          },
          "token_binding": {
            "type": "object",
            "required": ["color", "size"],
            "properties": {
              "color": {"type": "string"},
              "size": {"type": "string"}
            }
          },
          "usage": {"type": "array", "items": {"type": "string"}},
          "platforms": {"type": "array", "items": {"enum": ["app", "h5", "web", "admin"]}},
          "ownership": {
            "type": "object",
            "required": ["owner", "ownership_status", "review_status"],
            "properties": {
              "owner": {"type": "string"},
              "ownership_status": {
                "enum": ["project_owned", "licensed_localized", "needs_review"]
              },
              "source_note": {"type": "string"},
              "modified": {"type": "boolean"},
              "review_status": {
                "enum": ["draft", "reviewed", "approved", "needs_review", "blocked"]
              }
            }
          },
          "status": {"enum": ["draft", "approved", "deprecated", "blocked"]},
          "replacement": {"type": "string"},
          "version": {"type": "string"}
        }
      }
    }
  }
}
```

### 5.2 Registry 条目示例

```json
{
  "icon_key": "icon.wallet.deposit",
  "category": "wallet",
  "meaning": "Deposit funds into wallet or trading account",
  "source_type": "local_svg",
  "local_path": "src/assets/icons/wallet/deposit.svg",
  "component_name": "WalletDepositIcon",
  "style": {
    "default": "line",
    "active": "fill",
    "disabled": "line"
  },
  "sizes": [20, 24, 32],
  "states": ["default", "active", "disabled"],
  "token_binding": {
    "color": "color.icon.primary",
    "size": "size.icon.md"
  },
  "usage": ["deposit entry", "wallet operation", "transaction action"],
  "platforms": ["app", "h5", "web"],
  "ownership": {
    "owner": "design-system",
    "ownership_status": "project_owned",
    "source_note": "Created and maintained as local project icon asset.",
    "modified": false,
    "review_status": "approved"
  },
  "status": "approved",
  "version": "v1.1.0"
}
```

---

## 6. 图标视觉标准

| 项目 | 标准 |
|---|---|
| 基础画布 | 24 × 24 |
| 扩展尺寸 | 16 / 20 / 24 / 32 / 40 |
| 默认风格 | line |
| 激活风格 | fill 或 weight-up |
| 线宽 | 本地图标系统统一，建议 1.5px 或项目统一值 |
| 圆角风格 | 与项目视觉语言一致，默认圆润、克制 |
| 视觉对齐 | 在 24px 画布中视觉居中 |
| 颜色 | 必须绑定 `color.icon.*` token |
| 文件格式 | SVG |
| Runtime 格式 | 本地 Icon component / SVG sprite |
| 位图导出 | 仅用于营销或特殊平台素材，不作为源资产 |

### 6.1 禁止的视觉结果

```text
- 图标一粗一细
- 同一导航中混用 line / fill / duotone
- 同一页面内图标圆角风格明显不同
- 图标视觉重心不齐
- 24px 图标强行拉伸成 28px
- 图标颜色硬编码
- 选中态只靠颜色且无 fill / weight / label 辅助
- 用业务不准确的图标凑数
- 用装饰插画代替功能图标
```

---

## 7. Icon Token Binding

### 7.1 推荐语义层

图标可以底层映射文字颜色，但必须保留 `color.icon.*` 语义层。

```text
color.icon.primary   → color.text.primary
color.icon.secondary → color.text.secondary
color.icon.tertiary  → color.text.tertiary
color.icon.disabled  → color.text.disabled

color.icon.active
color.icon.success
color.icon.warning
color.icon.danger
color.icon.info
color.icon.inverse
```

### 7.2 尺寸 Token

| Token | 值 | 用途 |
|---|---:|---|
| `size.icon.xs` | 16px | 文本内联、紧凑后台 |
| `size.icon.sm` | 20px | 列表项、小按钮 |
| `size.icon.md` | 24px | 默认 App / Web 图标 |
| `size.icon.lg` | 32px | 功能卡片、空状态 |
| `size.icon.xl` | 40px | 少量插画型图标 |

---

## 8. 本地图标选择算法

Codex 必须按以下顺序执行：

```text
1. 读取图标请求的业务含义。
2. 匹配金融图标分类体系。
3. 搜索 icon-registry.json。
4. 如果已有 approved 图标，直接通过 Icon component 调用。
5. 如果没有 approved 图标，搜索本地 assets/icons 目录。
6. 如果本地存在但未注册，先补 registry，再执行 QA。
7. 如果本地不存在，创建 Local Icon Request。
8. 不允许自动安装或调用第三方图标库。
9. 不允许页面内临时手写 SVG。
10. 执行 semantic / visual / technical / token / accessibility QA。
11. QA 通过后加入 icon-registry.json。
12. 输出 code mapping 和 usage report。
```

### 8.1 Request → Local Asset Decision

| 请求类型 | 处理 |
|---|---|
| 已在 registry 中存在 | 直接调用 |
| 本地 SVG 存在但未注册 | 补注册 + QA |
| 本地没有合适图标 | 创建 Local Icon Request |
| 只是系统操作图标 | 仍从本地 system 目录调用 |
| 只是状态图标 | 仍从本地 status 目录调用 |
| 参考图里有相似图标 | 只分析语义，不复制图标 |
| Codex 想安装第三方图标库 | 阻断 |

---

## 9. Local Icon Request

只有当本地图标库无法准确表达业务含义时，才允许创建本地图标申请。

```md
# Local Icon Request

- Icon Key:
- Category:
- Business Meaning:
- Why Existing Local Icon Fails:
- Required Style:
- Default State:
- Active State:
- Size:
- Token Binding:
- Platforms:
- Similar Existing Local Icons:
- Design Notes:
- Owner:
- Status:
```

### 9.1 本地新增图标规则

```text
- 必须遵守 24x24 基础画布。
- 必须匹配项目统一线宽和圆角。
- 必须有 line 版本。
- 如果用于导航选中态，必须有 active / fill 或 weight-up 版本。
- 不得模仿竞品图标。
- 不得复制第三方图标。
- 必须通过 semantic、visual、technical、token、accessibility QA。
- 必须加入 icon-registry.json 后才能用于 UI。
```

---

## 10. Code Mapping

### 10.1 Icon Component Contract

```tsx
<Icon
  name="icon.wallet.deposit"
  size="md"
  color="primary"
  state="default"
  ariaLabel="Deposit"
/>
```

### 10.2 React Mapping 示例

```tsx
export const localIconMap = {
  "icon.wallet.deposit": {
    component: WalletDepositIcon,
    localPath: "src/assets/icons/wallet/deposit.svg",
    defaultStyle: "line",
    activeStyle: "fill"
  },
  "icon.system.search": {
    component: SystemSearchIcon,
    localPath: "src/assets/icons/system/search.svg",
    defaultStyle: "line"
  }
}
```

### 10.3 Vue Mapping 示例

```ts
export const localIconMap = {
  "icon.wallet.deposit": {
    component: "WalletDepositIcon",
    localPath: "src/assets/icons/wallet/deposit.svg",
    defaultStyle: "line",
    activeStyle: "fill"
  },
  "icon.system.search": {
    component: "SystemSearchIcon",
    localPath: "src/assets/icons/system/search.svg",
    defaultStyle: "line"
  }
}
```

### 10.4 禁止 import 示例

```tsx
// Forbidden
import { Search } from "lucide-react"
import { Wallet } from "@phosphor-icons/react"
import "remixicon/fonts/remixicon.css"
import { FaUser } from "react-icons/fa"
```

---

## 11. Accessibility Mapping

| 场景 | 要求 |
|---|---|
| 装饰性图标 | `aria-hidden="true"` |
| 图标按钮 | 必须有 `aria-label` |
| 状态图标 | 附近必须有文字说明 |
| 风险图标 | 不得作为唯一风险提示 |
| 导航图标 | 尽量搭配可见 label |
| 金融状态图标 | 必须有文字状态，例如 Success / Pending / Restricted |

---

## 12. Icon QA Gate

### 12.1 QA 维度

| Gate | 检查项 | Block 条件 |
|---|---|---|
| Local Source Gate | 是否来自本地 assets 或本地组件 | 外部图标包或远程 URL |
| Registry Gate | 是否注册后使用 | 未注册图标 |
| Semantic Gate | 是否匹配业务含义 | 业务隐喻错误 |
| Style Gate | 线宽、圆角、视觉密度是否一致 | 明显风格不统一 |
| Size Gate | 16 / 20 / 24 / 32 是否清晰 | 小尺寸不可读 |
| Alignment Gate | 视觉重心和 viewBox 是否正确 | 被裁切或偏心 |
| Token Gate | 颜色和尺寸是否使用 token | 硬编码颜色 / 尺寸 |
| State Gate | 是否定义 default / active / disabled | 导航缺状态 |
| Accessibility Gate | 图标按钮是否有 label | 动作图标无 label |
| Ownership Gate | 是否为项目本地可用资产 | 所有权不明 |

### 12.2 Severity Matrix

| Severity | 定义 | 是否阻断 |
|---|---|---:|
| Blocker | 第三方运行时 import、未知来源、未注册、竞品派生、风险 / 安全图标错误 | 是 |
| Critical | 语义错误、破坏核心任务、图标按钮不可访问 | 是 |
| Major | 风格不统一、缺 active 状态、20/24px 可读性差 | 条件阻断 |
| Minor | 轻微视觉不平衡、命名可优化 | 否 |
| Info | 可选优化 | 否 |

### 12.3 QA Scorecard

| 维度 | 分值 |
|---|---:|
| Semantic Accuracy | 20 |
| Visual Consistency | 20 |
| Technical Quality | 15 |
| Token Binding | 15 |
| State Coverage | 10 |
| Accessibility | 10 |
| Local Ownership / Source Compliance | 10 |

| 分数 | Decision |
|---|---|
| 90-100 | icon_ready |
| 80-89 | conditional_ready |
| 70-79 | major_fix_required |
| <70 | blocked |

---

## 13. Icon Release Decision

| Decision | 条件 |
|---|---|
| `icon_ready` | 0 Blocker，0 Critical，score ≥ 90 |
| `conditional_ready` | 0 Blocker，0 Critical，score 80-89，Major 有 owner |
| `major_fix_required` | Major 问题影响一致性或可读性 |
| `blocked` | 任意 Blocker / Critical 或 score < 70 |

---

## 14. 第三方依赖清理规则

Codex 在执行图标治理时必须检查并清理：

| 检查位置 | 禁止内容 |
|---|---|
| `package.json` | `lucide-react`、`@phosphor-icons/react`、`react-icons`、`@iconify/react`、`remixicon` 等图标运行时依赖 |
| 页面组件 | 直接 import 第三方图标 |
| CSS | import 第三方 icon font |
| HTML | CDN icon script |
| JSX / TSX | inline svg |
| assets | 未注册 SVG |
| registry | `source_library: phosphor/remix/lucide` 作为运行时来源 |

如果发现第三方依赖仍被使用，必须输出：

```md
# Third-party Icon Dependency Cleanup Report

| Dependency | Usage Location | Replacement Local Icon | Status |
|---|---|---|---|
```

---

## 15. 治理与版本管理

### 15.1 Versioning

| 变更 | 版本类型 |
|---|---|
| 新增本地图标 | Minor |
| 重命名 icon key | Major |
| 修改 local_path | Major |
| 修改视觉风格 | Major |
| 修复对齐 | Patch |
| 废弃图标 | Minor with migration |
| 删除图标 | Major after deprecation cycle |

### 15.2 废弃模板

```md
# Deprecated Icon

- Icon Key:
- Reason:
- Replacement:
- Impacted Pages:
- Impacted Components:
- Migration:
- Removal Version:
- Owner:
```

---

## 16. AI 执行命令

### 16.1 初始化本地图标资产系统

```txt
使用 Local Icon Asset Library Governance Skill v1.1.0-L5 初始化生产级本地图标资产系统。

要求：
1. 禁止调用第三方图标库。
2. 扫描项目本地 icons / assets/icons 目录。
3. 创建 financial icon taxonomy。
4. 创建 icon-registry.schema.json。
5. 创建 icon-registry.json。
6. 为所有本地图标补齐 icon_key、category、meaning、local_path、component_name、states、token_binding、usage、ownership。
7. 建立 React / Vue local icon mapping。
8. 建立 Icon component 调用规范。
9. 检查并清理第三方 icon runtime 依赖。
10. 输出 Icon QA Report 和 Release Decision。
```

### 16.2 审核并替换第三方图标调用

```txt
使用 Local Icon Asset Library Governance Skill v1.1.0-L5 审核当前项目图标调用。

检查：
- package.json 是否存在第三方图标依赖
- 页面是否直接 import 第三方图标
- 页面是否存在 inline svg
- 页面是否直接 img 引用 SVG
- 是否存在未注册本地图标
- 是否所有图标都通过 Icon component 调用
- 是否所有图标都进入 icon-registry.json

输出：
1. Third-party Icon Dependency Cleanup Report
2. Unregistered Local Icon Report
3. icon-registry.json 修复建议
4. local-icon-map.ts 修复建议
5. Icon QA Score
6. Release Decision
```

### 16.3 为 UI 选择本地图标

```txt
使用 Local Icon Asset Library Governance Skill v1.1.0-L5 选择图标。

输入：
- Business meaning:
- Page:
- Platform:
- Component:
- State:
- Existing icon registry:

规则：
1. 只搜索 icon-registry.json 和本地 assets/icons。
2. 不允许搜索或调用第三方图标库。
3. 如果有 approved 本地图标，直接使用。
4. 如果本地 SVG 存在但未注册，先补 registry。
5. 如果本地没有准确图标，创建 Local Icon Request。
6. 输出 icon_key、local_path、component_name、style、token_binding、accessibility label 和 QA decision。
```

---

## 17. Forbidden Rules

```text
- 禁止调用 Phosphor / Remix / Lucide / Iconify / react-icons 等第三方图标包。
- 禁止安装新的第三方图标依赖。
- 禁止页面内直接 import 第三方图标。
- 禁止页面内临时手写 SVG。
- 禁止直接 img 引用未注册 SVG。
- 禁止使用未知来源 SVG。
- 禁止复制竞品图标。
- 禁止使用未注册图标进入生产 UI。
- 禁止硬编码图标颜色或尺寸。
- 禁止使用 emoji 作为产品图标。
- 禁止使用 PNG 作为源图标。
- 禁止只用图标表达风险。
- 禁止无迁移直接重命名 icon key。
```

---

## 18. L5 完成标准

| 标准 | 必须满足 |
|---|---:|
| 只允许本地图标资源 | 是 |
| 禁止第三方运行时调用 | 是 |
| 有本地图标目录规范 | 是 |
| 有金融分类体系 | 是 |
| 有 Icon Registry Schema | 是 |
| 有 icon-registry.json | 是 |
| 有本地图标命名规则 | 是 |
| 有 Token Binding | 是 |
| 有 Local Icon Component Contract | 是 |
| 有 React / Vue local mapping | 是 |
| 有无障碍规则 | 是 |
| 有第三方依赖清理报告 | 是 |
| 有 QA Gate | 是 |
| 有 Release Decision | 是 |
| 有版本 / 废弃治理 | 是 |

---

## 19. 最终定义

```text
Local Icon Asset Library Governance Skill v1.1.0-L5
= Local Icon Assets Only
+ Financial Icon Taxonomy
+ Icon Registry
+ Local SVG / Component Mapping
+ Token Binding
+ State Mapping
+ Accessibility
+ Third-party Dependency Cleanup
+ Icon QA Gate
+ Release Decision
```

它的价值不是引入更多图标库。
它的价值是让所有图标都来自项目本地资产，并且 **语义准确、风格统一、可注册、可审计、可维护、可交付开发**。
