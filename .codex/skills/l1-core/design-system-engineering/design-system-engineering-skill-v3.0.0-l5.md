---
name: design-system-engineering
description: >
  Use for design tokens, variables, component manifests, business components, icon registries, pattern registries,
  themes, platform modes, code mappings, design-system QA, release governance, and design-system change control.
  Inputs include Product Kernel, Page Contracts, brand/platform constraints, existing tokens, component assets, icon sources, and engineering targets.
  Outputs token schemas, component/business-component manifests, icon and pattern registries, code mappings, QA rules, migration notes, and governance records.
  Do not use to redefine business workflows, generate final pages directly, ignore Page Contracts, or create ungoverned one-off styles/components.
layer: L1
category: "Core Design System Engineering"
parent: "None"
depends_on:
  - "Product Kernel or Page Contract when UI-bound"
  - "brand/platform constraints"
  - "existing tokens/components/icons"
standalone: true
hierarchy: "L1 Core Design System Engineering > Design System Engineering Skill"
---

# Design System Engineering Skill v3.0.0 — L5 Complete

## Classification And Hierarchy

| Field | Value |
|---|---|
| Layer | L1 |
| Category | Core Design System Engineering |
| Parent | None |
| Standalone | Yes |
| Hierarchy | L1 Core Design System Engineering > Design System Engineering Skill |

Depends on:

- Product Kernel or Page Contract when UI-bound
- brand/platform constraints
- existing tokens/components/icons

> File: `.codex/skills/l1-core/design-system-engineering/design-system-engineering-skill-v3.0.0-l5.md`
> Version: `v3.0.0-L5`
> Level: `L5 Complete / Production Design System Engineering Skill`
> Purpose: 建立 AI 可读取、代码可消费、组件可治理、多项目可切换、可自动校验、可长期维护的生产级设计系统。
> Target: Codex / Claude / Cursor / Figma / 设计师 / 前端开发 / QA / 产品负责人。
> Status: 可直接作为生产级设计系统工程 Skill 使用。
> Scope: Variables / Components / Business Components / Icons / Patterns / Platform Modes / Code Mapping / QA Gates / Release Governance。

---

## 0. L5 Complete 定义

本 Skill 不再只是设计规范文档，而是 **设计系统工程执行协议**。

它必须同时满足：

| L5 能力 | 必须达到的结果 |
|---|---|
| AI 可执行 | Codex / Claude / Cursor 能根据本 Skill 初始化、扩展、检查设计系统 |
| 机器可读 | Token、组件、图标、Pattern 必须有 JSON Manifest / Schema |
| 代码可消费 | 能输出 CSS Variables / Tailwind / React / Vue 映射 |
| 设计可治理 | 支持 Figma Variables、组件资产、图标库、Pattern Registry |
| 多项目可切换 | 支持 theme / brand / density / platform / radius / typography mode |
| 可自动校验 | 有明确 QA Pass / Fail 规则，不只是 checklist |
| 可持续迭代 | 有版本、废弃、迁移、影响范围、兼容策略 |
| 可交付开发 | 前端能根据 manifest 和 mapping 落地组件与页面 |
| 可约束 AI | AI 不允许自由发挥视觉风格，必须基于 token、组件、pattern 输出 |

---

## 1. 与产品生产链路的关系

| Skill | 负责范围 | 不负责范围 |
|---|---|---|
| AI Product Production Delivery Skill | 业务需求、角色权限、流程、页面清单、交付验收 | 不定义视觉 token 和组件 API |
| UI Build Design Skill | 页面搭建、高质量 UI、交互状态、HTML/原型输出 | 不随意创建底层 token 和组件 |
| Design System Engineering Skill | Token、组件、图标、Pattern、Mode、Code Mapping、QA Gate | 不重新定义业务流程，不直接替代页面设计 |

执行顺序：

```text
业务需求 / 产品流程
  ↓
AI Product Production Delivery Skill
  ↓
Design System Engineering Skill
  ↓
UI Build Design Skill
  ↓
页面 / HTML / 原型 / 前端交付
  ↓
QA Gate / Release Governance
```

---

## 2. 标准输出目录

```text
design-system-engineering/
├── 00_principles/
│   ├── design-principles.md
│   ├── ai-usage-rules.md
│   ├── accessibility-principles.md
│   └── l5-acceptance-standard.md
│
├── 01_tokens/
│   ├── tokens.json
│   ├── token.schema.json
│   ├── token-mode.matrix.json
│   ├── token-alias.map.json
│   ├── token-export.map.json
│   ├── token-qa.rules.json
│   └── token-changelog.md
│
├── 02_components/
│   ├── component-manifest.json
│   ├── component.schema.json
│   ├── component-token-binding.map.json
│   ├── component-usage-rules.md
│   ├── component-gap.log.md
│   ├── component-qa.rules.json
│   └── component-changelog.md
│
├── 03_business_components/
│   ├── business-component-manifest.json
│   ├── business-component.schema.json
│   ├── financial-components.md
│   ├── compliance-components.md
│   ├── review-components.md
│   └── business-component-qa.rules.json
│
├── 04_icons/
│   ├── icon-registry.json
│   ├── icon.schema.json
│   ├── icon-naming.md
│   ├── icon-usage-rules.md
│   ├── icon-core-list.md
│   ├── icon-qa.rules.json
│   └── icon-changelog.md
│
├── 05_patterns/
│   ├── pattern-registry.json
│   ├── pattern.schema.json
│   ├── app-patterns.md
│   ├── h5-patterns.md
│   ├── web-patterns.md
│   ├── admin-patterns.md
│   ├── pattern-qa.rules.json
│   └── pattern-changelog.md
│
├── 06_platform_modes/
│   ├── app-rules.md
│   ├── h5-rules.md
│   ├── web-rules.md
│   ├── admin-rules.md
│   ├── mode-matrix.json
│   └── platform-qa.rules.json
│
├── 07_ai_runtime/
│   ├── ai-readable-index.json
│   ├── codex-instructions.md
│   ├── claude-instructions.md
│   ├── cursor-instructions.md
│   ├── ui-build-binding.md
│   └── ai-qa.rules.json
│
├── 08_code_mapping/
│   ├── css-variable.mapping.css
│   ├── tailwind.mapping.js
│   ├── react.mapping.md
│   ├── vue.mapping.md
│   ├── figma-variable.mapping.md
│   └── code-mapping-qa.rules.json
│
├── 09_quality_gates/
│   ├── qa-gate.matrix.md
│   ├── token-qa.checklist.md
│   ├── component-qa.checklist.md
│   ├── business-component-qa.checklist.md
│   ├── icon-qa.checklist.md
│   ├── pattern-qa.checklist.md
│   ├── platform-qa.checklist.md
│   ├── ai-runtime-qa.checklist.md
│   ├── code-mapping-qa.checklist.md
│   └── visual-regression.checklist.md
│
├── 10_release_management/
│   ├── changelog.md
│   ├── deprecated.md
│   ├── migration-guide.md
│   ├── impact-report.md
│   └── release-checklist.md
│
└── scripts/
    ├── check-tokens.js
    ├── check-component-manifest.js
    ├── check-business-components.js
    ├── check-icons.js
    ├── check-pattern-registry.js
    ├── check-platform-modes.js
    ├── check-ai-runtime.js
    ├── check-code-mapping.js
    └── check-design-system.js
```

---

## 3. L5 质量门槛

### 3.1 必须满足

| 项目 | L5 要求 |
|---|---|
| Token | 必须有 L1 / L2 / L3 分层、Mode、Alias、Export Name、Deprecated、Fallback |
| Component | 必须有 Props、Variants、States、Events、Slots、Token Binding、A11y、Forbidden |
| Business Component | 必须有业务场景、字段、状态矩阵、权限、平台、数据映射、错误处理 |
| Icon | 必须有分类、名称、尺寸、风格、状态、语义色、SVG/Figma/Code 对应 |
| Pattern | 必须有页面结构、适用场景、推荐组件、必需状态、禁止结构 |
| Platform | 必须区分 App / H5 / Web / Admin，不允许一套规则硬套多端 |
| AI Runtime | 必须有读取顺序、调用限制、缺口处理、输出格式 |
| Code Mapping | 必须有 CSS Variables / Tailwind / React / Vue / Figma 映射 |
| QA | 必须定义 Pass / Warning / Fail / Blocker |
| Release | 必须记录 changelog、impact、migration、deprecated |

### 3.2 不达标直接 Fail

```text
- 页面或组件直接写死颜色、间距、圆角、字号。
- 页面直接使用 L1 Base Token。
- 组件缺少 disabled / loading / focus / error 状态。
- 业务组件没有字段、状态、权限、错误处理。
- Icon 没有统一尺寸、线宽、命名和语义色。
- Pattern 没有必需状态和禁用结构。
- 新增或修改没有 changelog。
- 废弃资产没有 replacement 和 migration guide。
- AI 输出页面时没有先读取 ai-readable-index.json。
```

---

# Part A — Token System L5

## 4. Token 分层

| 层级 | 名称 | 作用 | 页面是否可直接使用 | 代码是否导出 |
|---|---|---|---:|---:|
| L1 | Base Token | 原始值，如色阶、数字、字体族 | 否 | 是 |
| L2 | Semantic Token | 语义用途，如文本、背景、边框、状态 | 是 | 是 |
| L3 | Component Token | 组件内部样式，如 button、input、card | 组件内使用 | 是 |
| L4 | Pattern Token | 特殊页面模式，如 financial operation amount stage | 仅 Pattern 内使用 | 可选 |

规则：

```text
1. 页面不得直接使用 L1 Base Token。
2. 页面优先使用 L2 Semantic Token。
3. 组件内部必须使用 L3 Component Token。
4. L4 Pattern Token 只允许在复杂业务 Pattern 中使用，不作为默认层级。
5. 所有 Token 必须支持 export name，保证代码可消费。
```

---

## 5. Token Schema

### 5.1 `token.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "DesignToken",
  "type": "object",
  "required": ["id", "name", "type", "level", "value", "mode", "export"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Stable unique token id. Example: color.text.primary"
    },
    "name": {
      "type": "string",
      "description": "Human-readable token name."
    },
    "type": {
      "enum": ["color", "dimension", "fontFamily", "fontWeight", "fontSize", "lineHeight", "letterSpacing", "shadow", "duration", "easing", "zIndex", "breakpoint", "number"]
    },
    "level": {
      "enum": ["base", "semantic", "component", "pattern"]
    },
    "category": {
      "type": "string",
      "description": "color / typography / spacing / radius / size / border / shadow / motion / z-index / breakpoint"
    },
    "value": {
      "type": ["string", "number", "object"],
      "description": "Raw value or alias reference. Example: {color.neutral.950}"
    },
    "mode": {
      "type": "object",
      "required": ["theme", "brand", "density", "platform"],
      "properties": {
        "theme": { "type": "array", "items": { "type": "string" } },
        "brand": { "type": "array", "items": { "type": "string" } },
        "density": { "type": "array", "items": { "type": "string" } },
        "platform": { "type": "array", "items": { "type": "string" } }
      }
    },
    "export": {
      "type": "object",
      "required": ["css", "tailwind", "figma"],
      "properties": {
        "css": { "type": "string" },
        "tailwind": { "type": "string" },
        "figma": { "type": "string" },
        "js": { "type": "string" }
      }
    },
    "fallback": {
      "type": ["string", "number", "object"]
    },
    "description": {
      "type": "string"
    },
    "source": {
      "type": "string",
      "description": "base source or design decision origin."
    },
    "deprecated": {
      "type": "boolean",
      "default": false
    },
    "replacement": {
      "type": "string"
    },
    "owner": {
      "type": "string"
    },
    "version": {
      "type": "string"
    }
  }
}
```

---

## 6. Token 命名规则

### 6.1 命名格式

```text
{category}.{role}.{property}.{state?}.{scale?}
```

示例：

```text
color.text.primary
color.text.secondary
color.bg.page
color.bg.surface
color.border.default
color.icon.primary
space.component.md
radius.control.md
size.control.height.md
shadow.card.md
motion.duration.fast
z.modal
```

### 6.2 禁止命名

```text
blue1
big-card
nice-button
new-color
test-space
primary2
copy1
```

### 6.3 允许命名

```text
color.brand.primary
color.action.primary.bg
color.action.primary.text
button.bg.primary.default
button.bg.primary.pressed
input.border.error
card.bg.elevated
```

---

## 7. Token Mode Matrix

`token-mode.matrix.json`

```json
{
  "theme": ["light", "dark"],
  "brand": ["default", "brand-a", "brand-b"],
  "density": ["compact", "standard", "comfortable"],
  "platform": ["app", "h5", "web", "admin"],
  "radius": ["sharp", "soft", "pill"],
  "typography": ["app-type", "web-type", "admin-type"]
}
```

Mode 使用规则：

| 差异类型 | 应使用的 Mode | 禁止做法 |
|---|---|---|
| 品牌色不同 | brand | 复制一套组件库 |
| 明暗主题不同 | theme | 在页面写死 dark 样式 |
| 密度不同 | density | 每个组件单独改 padding |
| App / Web 尺寸不同 | platform | 用同一套高度硬套全部端 |
| 圆角风格不同 | radius 或 brand | 每个组件局部覆盖 radius |
| 字体节奏不同 | typography 或 platform | 页面临时调字号 |

---

## 8. Token 示例

`tokens.json`

```json
{
  "color.neutral.950": {
    "id": "color.neutral.950",
    "name": "Neutral 950",
    "type": "color",
    "level": "base",
    "category": "color",
    "value": "#101828",
    "mode": {
      "theme": ["light", "dark"],
      "brand": ["default"],
      "density": ["compact", "standard", "comfortable"],
      "platform": ["app", "h5", "web", "admin"]
    },
    "export": {
      "css": "--color-neutral-950",
      "tailwind": "neutral.950",
      "figma": "color/neutral/950",
      "js": "color.neutral.950"
    },
    "description": "Base neutral text color.",
    "deprecated": false,
    "version": "v3.0.0"
  },
  "color.text.primary": {
    "id": "color.text.primary",
    "name": "Text Primary",
    "type": "color",
    "level": "semantic",
    "category": "color",
    "value": "{color.neutral.950}",
    "fallback": "#101828",
    "mode": {
      "theme": ["light", "dark"],
      "brand": ["default", "brand-a", "brand-b"],
      "density": ["compact", "standard", "comfortable"],
      "platform": ["app", "h5", "web", "admin"]
    },
    "export": {
      "css": "--color-text-primary",
      "tailwind": "text.primary",
      "figma": "color/text/primary",
      "js": "color.text.primary"
    },
    "description": "Primary content text.",
    "deprecated": false,
    "version": "v3.0.0"
  },
  "button.bg.primary.default": {
    "id": "button.bg.primary.default",
    "name": "Button Primary Background Default",
    "type": "color",
    "level": "component",
    "category": "color",
    "value": "{color.action.primary.bg}",
    "fallback": "#1677FF",
    "mode": {
      "theme": ["light", "dark"],
      "brand": ["default", "brand-a", "brand-b"],
      "density": ["compact", "standard", "comfortable"],
      "platform": ["app", "h5", "web", "admin"]
    },
    "export": {
      "css": "--button-bg-primary-default",
      "tailwind": "button.primary.bg.DEFAULT",
      "figma": "button/bg/primary/default",
      "js": "button.bg.primary.default"
    },
    "description": "Default primary button background.",
    "deprecated": false,
    "version": "v3.0.0"
  }
}
```

---

## 9. Token QA Rules

`token-qa.rules.json`

```json
{
  "rules": [
    {
      "id": "TOKEN_001",
      "name": "No hardcoded values in components or pages",
      "severity": "blocker",
      "fail_when": ["hex_color_found", "px_value_without_token", "rgba_shadow_without_token"],
      "message": "All visual values must reference tokens."
    },
    {
      "id": "TOKEN_002",
      "name": "No direct L1 base token usage in pages",
      "severity": "blocker",
      "fail_when": ["page_uses_base_token"],
      "message": "Pages must use semantic or pattern tokens."
    },
    {
      "id": "TOKEN_003",
      "name": "All tokens require export mapping",
      "severity": "fail",
      "required_fields": ["export.css", "export.tailwind", "export.figma"]
    },
    {
      "id": "TOKEN_004",
      "name": "Deprecated token requires replacement",
      "severity": "fail",
      "condition": "deprecated=true",
      "required_fields": ["replacement"]
    },
    {
      "id": "TOKEN_005",
      "name": "Token mode coverage required",
      "severity": "fail",
      "required_fields": ["mode.theme", "mode.brand", "mode.density", "mode.platform"]
    }
  ]
}
```

Pass / Fail：

| 结果 | 条件 |
|---|---|
| Pass | 所有 required 字段完整，无硬编码，无断链 |
| Warning | 描述缺失、owner 缺失、轻微命名不清 |
| Fail | 缺少 export、mode、fallback、replacement |
| Blocker | 页面硬编码、页面直接使用 L1 Base Token、Token 引用断链 |

---

# Part B — Component System L5

## 10. Component Schema

`component.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "ComponentManifestItem",
  "type": "object",
  "required": ["name", "category", "platforms", "variants", "sizes", "states", "props", "events", "slots", "token_binding", "a11y", "qa"],
  "properties": {
    "name": { "type": "string" },
    "category": {
      "enum": ["action", "input", "selection", "feedback", "overlay", "navigation", "data-display", "form", "state", "layout", "business", "pattern"]
    },
    "description": { "type": "string" },
    "platforms": {
      "type": "array",
      "items": { "enum": ["app", "h5", "web", "admin"] }
    },
    "variants": {
      "type": "array",
      "items": { "type": "string" }
    },
    "sizes": {
      "type": "array",
      "items": { "type": "string" }
    },
    "states": {
      "type": "array",
      "items": { "type": "string" }
    },
    "props": {
      "type": "object"
    },
    "events": {
      "type": "array",
      "items": { "type": "string" }
    },
    "slots": {
      "type": "array",
      "items": { "type": "string" }
    },
    "token_binding": {
      "type": "array",
      "items": { "type": "string" }
    },
    "a11y": {
      "type": "array",
      "items": { "type": "string" }
    },
    "do": {
      "type": "array",
      "items": { "type": "string" }
    },
    "dont": {
      "type": "array",
      "items": { "type": "string" }
    },
    "forbidden": {
      "type": "array",
      "items": { "type": "string" }
    },
    "qa": {
      "type": "object",
      "required": ["required_states", "required_tokens", "required_a11y"]
    },
    "code_mapping": {
      "type": "object",
      "properties": {
        "react": { "type": "string" },
        "vue": { "type": "string" },
        "html": { "type": "string" },
        "figma": { "type": "string" }
      }
    },
    "deprecated": { "type": "boolean" },
    "replacement": { "type": "string" },
    "version": { "type": "string" }
  }
}
```

---

## 11. Core Component Manifest

`component-manifest.json`

```json
{
  "Button": {
    "name": "Button",
    "category": "action",
    "description": "Primary action component for form submission, process continuation and key operations.",
    "platforms": ["app", "h5", "web", "admin"],
    "variants": ["primary", "secondary", "ghost", "danger", "text"],
    "sizes": ["sm", "md", "lg"],
    "states": ["default", "hover", "active", "focus", "disabled", "loading"],
    "props": {
      "label": { "type": "string", "required": true },
      "variant": { "type": "enum", "values": ["primary", "secondary", "ghost", "danger", "text"], "default": "primary" },
      "size": { "type": "enum", "values": ["sm", "md", "lg"], "default": "md" },
      "disabled": { "type": "boolean", "default": false },
      "loading": { "type": "boolean", "default": false },
      "fullWidth": { "type": "boolean", "default": false },
      "iconLeft": { "type": "IconName", "required": false },
      "iconRight": { "type": "IconName", "required": false }
    },
    "events": ["onClick"],
    "slots": ["iconLeft", "label", "iconRight", "loadingIndicator"],
    "token_binding": [
      "button.bg.primary.default",
      "button.bg.primary.pressed",
      "button.bg.primary.disabled",
      "button.text.primary",
      "button.height.md",
      "button.radius",
      "button.padding.x.md",
      "button.gap.md",
      "focus.ring.default"
    ],
    "a11y": ["focus-visible", "aria-disabled", "aria-busy-when-loading", "keyboard-enter-space"],
    "do": [
      "Use one primary button per main action area.",
      "Use loading state after submission.",
      "Use disabled state only when action is truly unavailable."
    ],
    "dont": [
      "Do not use color override at page level.",
      "Do not create temporary button radius.",
      "Do not use text button for critical submit actions."
    ],
    "forbidden": ["page-level-color-override", "temporary-radius", "hardcoded-height", "unregistered-icon"],
    "qa": {
      "required_states": ["default", "focus", "disabled", "loading"],
      "required_tokens": ["button.bg.primary.default", "button.height.md", "button.radius"],
      "required_a11y": ["focus-visible", "aria-busy-when-loading"]
    },
    "code_mapping": {
      "react": "<Button variant=\"primary\" size=\"md\" loading={false}>Continue</Button>",
      "vue": "<DsButton variant=\"primary\" size=\"md\">Continue</DsButton>",
      "html": "<button class=\"ds-button ds-button--primary ds-button--md\">Continue</button>",
      "figma": "Components/Core/Button"
    },
    "deprecated": false,
    "version": "v3.0.0"
  },
  "TextInput": {
    "name": "TextInput",
    "category": "input",
    "description": "Single-line text input for form data entry.",
    "platforms": ["app", "h5", "web", "admin"],
    "variants": ["default", "filled", "outlined"],
    "sizes": ["sm", "md", "lg"],
    "states": ["default", "focus", "disabled", "readonly", "error", "success"],
    "props": {
      "label": { "type": "string", "required": false },
      "value": { "type": "string", "required": false },
      "placeholder": { "type": "string", "required": false },
      "disabled": { "type": "boolean", "default": false },
      "readonly": { "type": "boolean", "default": false },
      "error": { "type": "string", "required": false },
      "helperText": { "type": "string", "required": false },
      "prefixIcon": { "type": "IconName", "required": false },
      "suffixIcon": { "type": "IconName", "required": false }
    },
    "events": ["onChange", "onFocus", "onBlur", "onClear"],
    "slots": ["label", "prefixIcon", "input", "suffixIcon", "helperText", "errorText"],
    "token_binding": [
      "input.bg.default",
      "input.border.default",
      "input.border.focus",
      "input.border.error",
      "input.text.default",
      "input.placeholder",
      "input.height.md",
      "input.radius",
      "input.padding.x.md"
    ],
    "a11y": ["label-associated", "aria-invalid", "aria-describedby", "keyboard-input"],
    "do": [
      "Display error message close to the input.",
      "Use placeholder as hint, not as replacement for label."
    ],
    "dont": [
      "Do not hide error state.",
      "Do not use different heights outside token system."
    ],
    "forbidden": ["placeholder-as-label", "hardcoded-border", "missing-error-message"],
    "qa": {
      "required_states": ["default", "focus", "disabled", "error"],
      "required_tokens": ["input.border.default", "input.border.error", "input.height.md"],
      "required_a11y": ["label-associated", "aria-invalid"]
    },
    "code_mapping": {
      "react": "<TextInput label=\"Bank account number\" value={value} error={error} />",
      "vue": "<DsTextInput label=\"Bank account number\" v-model=\"value\" :error=\"error\" />",
      "html": "<label class=\"ds-field\"><span>Bank account number</span><input class=\"ds-input\" /></label>",
      "figma": "Components/Core/TextInput"
    },
    "deprecated": false,
    "version": "v3.0.0"
  },
  "Dialog": {
    "name": "Dialog",
    "category": "overlay",
    "description": "Modal dialog for confirmation, warning, decision and task interruption.",
    "platforms": ["app", "h5", "web", "admin"],
    "variants": ["default", "warning", "danger", "success", "fullscreen"],
    "sizes": ["sm", "md", "lg", "fullscreen"],
    "states": ["default", "loading", "error"],
    "props": {
      "title": { "type": "string", "required": true },
      "description": { "type": "string", "required": false },
      "open": { "type": "boolean", "required": true },
      "primaryAction": { "type": "Action", "required": false },
      "secondaryAction": { "type": "Action", "required": false },
      "closeOnOverlayClick": { "type": "boolean", "default": false }
    },
    "events": ["onOpenChange", "onConfirm", "onCancel"],
    "slots": ["header", "body", "footer"],
    "token_binding": [
      "dialog.bg",
      "dialog.radius",
      "dialog.shadow",
      "dialog.padding",
      "dialog.title.text",
      "dialog.description.text"
    ],
    "a11y": ["role-dialog", "aria-modal", "focus-trap", "esc-close-when-allowed"],
    "do": [
      "Use clear title and consequence-focused description.",
      "Use only one primary action."
    ],
    "dont": [
      "Do not show destructive action without confirmation.",
      "Do not allow background interaction while dialog is open."
    ],
    "forbidden": ["no-focus-trap", "unclear-action", "multiple-primary-actions"],
    "qa": {
      "required_states": ["default"],
      "required_tokens": ["dialog.bg", "dialog.radius", "dialog.shadow"],
      "required_a11y": ["role-dialog", "focus-trap"]
    },
    "code_mapping": {
      "react": "<Dialog open={open} title=\"Exit account opening?\" />",
      "vue": "<DsDialog v-model:open=\"open\" title=\"Exit account opening?\" />",
      "html": "<div role=\"dialog\" aria-modal=\"true\" class=\"ds-dialog\">...</div>",
      "figma": "Components/Core/Dialog"
    },
    "deprecated": false,
    "version": "v3.0.0"
  }
}
```

---

## 12. Component QA Rules

`component-qa.rules.json`

```json
{
  "rules": [
    {
      "id": "COMP_001",
      "name": "Component requires manifest fields",
      "severity": "blocker",
      "required_fields": ["name", "category", "platforms", "variants", "states", "props", "token_binding", "a11y", "qa"]
    },
    {
      "id": "COMP_002",
      "name": "Component must include required states",
      "severity": "fail",
      "minimum_states": ["default", "disabled", "focus"]
    },
    {
      "id": "COMP_003",
      "name": "Interactive components require events",
      "severity": "fail",
      "condition": "category in ['action','input','selection','overlay','navigation']",
      "required_fields": ["events"]
    },
    {
      "id": "COMP_004",
      "name": "No component-level hardcoded visual values",
      "severity": "blocker",
      "fail_when": ["hex_color_found", "px_value_without_token", "unregistered_icon"]
    },
    {
      "id": "COMP_005",
      "name": "Deprecated component requires replacement",
      "severity": "fail",
      "condition": "deprecated=true",
      "required_fields": ["replacement"]
    }
  ]
}
```

Pass / Fail：

| 结果 | 条件 |
|---|---|
| Pass | Manifest 完整、状态完整、Token Binding 完整、A11y 完整 |
| Warning | 文档描述不足、Do / Don't 不够详细 |
| Fail | 缺少 props、events、states、a11y、code mapping |
| Blocker | 硬编码样式、无 token binding、组件只有 default 状态 |

---

# Part C — Business Component System L5

## 13. Business Component Schema

`business-component.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "BusinessComponentManifestItem",
  "type": "object",
  "required": ["name", "business_domain", "scenario", "platforms", "data_fields", "states", "actions", "permissions", "components_used", "token_binding", "api_mapping", "qa"],
  "properties": {
    "name": { "type": "string" },
    "business_domain": {
      "enum": ["trading", "account", "wallet", "deposit", "withdraw", "kyc", "compliance", "ib", "copy-trading", "notification", "risk"]
    },
    "scenario": { "type": "string" },
    "platforms": {
      "type": "array",
      "items": { "enum": ["app", "h5", "web", "admin"] }
    },
    "data_fields": { "type": "object" },
    "states": { "type": "array", "items": { "type": "string" } },
    "actions": { "type": "array", "items": { "type": "string" } },
    "permissions": { "type": "array", "items": { "type": "string" } },
    "components_used": { "type": "array", "items": { "type": "string" } },
    "token_binding": { "type": "array", "items": { "type": "string" } },
    "api_mapping": { "type": "object" },
    "error_handling": { "type": "array", "items": { "type": "string" } },
    "privacy": { "type": "array", "items": { "type": "string" } },
    "qa": { "type": "object" },
    "version": { "type": "string" }
  }
}
```

---

## 14. Business Component Manifest 示例

`business-component-manifest.json`

```json
{
  "TradingAccountCard": {
    "name": "TradingAccountCard",
    "business_domain": "trading",
    "scenario": "Display trading account summary, account status, balance and quick operations.",
    "platforms": ["app", "h5", "web"],
    "data_fields": {
      "accountId": { "type": "string", "required": true, "mask": "last4" },
      "accountType": { "type": "string", "required": true },
      "currency": { "type": "string", "required": true },
      "balance": { "type": "number", "required": true },
      "equity": { "type": "number", "required": false },
      "marginLevel": { "type": "number", "required": false },
      "status": { "type": "enum", "values": ["active", "pending", "restricted", "disabled"], "required": true }
    },
    "states": ["active", "pending", "restricted", "disabled", "loading", "error"],
    "actions": ["deposit", "withdraw", "transfer", "viewDetail"],
    "permissions": ["user.own_account.view", "user.own_account.operate"],
    "components_used": ["Card", "Button", "Tag", "Statistic", "Icon"],
    "token_binding": ["card.bg.default", "card.radius.lg", "color.text.primary", "color.status.warning"],
    "api_mapping": {
      "source": "GET /api/trading-accounts/:id",
      "props": ["accountId", "accountType", "currency", "balance", "equity", "marginLevel", "status"]
    },
    "error_handling": [
      "If status is restricted, disable deposit and withdraw action.",
      "If account data fails to load, show Error state with retry."
    ],
    "privacy": ["Mask accountId except last 4 digits when shown in list context."],
    "qa": {
      "required_states": ["active", "pending", "restricted", "disabled", "loading", "error"],
      "required_actions": ["deposit", "withdraw", "viewDetail"],
      "required_permissions": ["user.own_account.view"]
    },
    "version": "v3.0.0"
  },
  "AgreementReader": {
    "name": "AgreementReader",
    "business_domain": "compliance",
    "scenario": "Read, scroll, confirm and sign multiple agreements or risk disclosures during account opening.",
    "platforms": ["app", "h5", "web"],
    "data_fields": {
      "agreementId": { "type": "string", "required": true },
      "agreementTitle": { "type": "string", "required": true },
      "agreementIndex": { "type": "number", "required": true },
      "totalAgreements": { "type": "number", "required": true },
      "readProgress": { "type": "number", "required": true },
      "accepted": { "type": "boolean", "required": true },
      "signedAt": { "type": "datetime", "required": false }
    },
    "states": ["not_started", "reading", "bottom_reached", "accepted", "returned_accepted", "cancel_confirm", "completed"],
    "actions": ["scroll", "accept", "continue", "back", "exit"],
    "permissions": ["user.account_opening.self"],
    "components_used": ["Dialog", "Button", "Stepper", "Checkbox", "Progress"],
    "token_binding": ["dialog.bg", "button.bg.primary.default", "color.status.success", "color.text.secondary"],
    "api_mapping": {
      "source": "GET /api/agreements",
      "submit": "POST /api/account-opening/agreements/accept",
      "props": ["agreementId", "agreementTitle", "agreementIndex", "totalAgreements", "readProgress", "accepted", "signedAt"]
    },
    "error_handling": [
      "Before bottom reached, primary action is disabled.",
      "After an agreement has been accepted, returning to it must keep the primary action enabled.",
      "Only the first agreement step can show close action. Non-first step uses back action."
    ],
    "privacy": ["Do not expose internal legal template id to user."],
    "qa": {
      "required_states": ["reading", "bottom_reached", "accepted", "returned_accepted", "cancel_confirm"],
      "required_actions": ["scroll", "accept", "continue", "back", "exit"],
      "required_permissions": ["user.account_opening.self"]
    },
    "version": "v3.0.0"
  },
  "KYCStatusBlock": {
    "name": "KYCStatusBlock",
    "business_domain": "kyc",
    "scenario": "Display KYC progress, review status, failure reason and resubmission action.",
    "platforms": ["app", "h5", "web", "admin"],
    "data_fields": {
      "kycStatus": { "type": "enum", "values": ["not_submitted", "submitted", "reviewing", "approved", "rejected", "expired"], "required": true },
      "reviewReason": { "type": "string", "required": false },
      "updatedAt": { "type": "datetime", "required": false },
      "requiredDocuments": { "type": "array", "required": false }
    },
    "states": ["not_submitted", "reviewing", "approved", "rejected", "expired", "loading", "error"],
    "actions": ["submit", "resubmit", "viewReason", "contactSupport"],
    "permissions": ["user.kyc.view", "user.kyc.submit", "admin.kyc.review"],
    "components_used": ["Card", "Tag", "Button", "Alert", "Timeline"],
    "token_binding": ["color.status.success", "color.status.warning", "color.status.danger", "card.bg.default"],
    "api_mapping": {
      "source": "GET /api/kyc/status",
      "props": ["kycStatus", "reviewReason", "updatedAt", "requiredDocuments"]
    },
    "error_handling": [
      "Rejected state must show reason if available.",
      "Expired state must show resubmit action.",
      "Approved state must not show submit action."
    ],
    "privacy": ["Do not show full identity number in status block."],
    "qa": {
      "required_states": ["not_submitted", "reviewing", "approved", "rejected", "expired"],
      "required_actions": ["submit", "resubmit"],
      "required_permissions": ["user.kyc.view"]
    },
    "version": "v3.0.0"
  }
}
```

---

## 15. Broker / Financial Business Components 最小清单

| 类别 | 组件 |
|---|---|
| Account | TradingAccountCard、AccountStatusTag、AccountLeverageBlock、AccountCurrencyBadge |
| Balance | BalanceSummaryCard、EquityBlock、MarginGauge、FloatingPLBlock |
| Deposit | DepositMethodCard、DepositInstructionBlock、DepositStatusTimeline、DepositReceiptUpload |
| Withdraw | WithdrawMethodCard、WithdrawLimitNotice、WithdrawStatusTimeline、WithdrawConfirmDialog |
| Bank | BankAccountCard、BankCurrencyTag、BankVerificationBlock、BankSwitchConfirmDialog |
| KYC | KYCStatusBlock、POAUploadBlock、IdentityDocumentBlock、SelfieExampleBlock |
| Compliance | AgreementReader、RiskWarningBanner、VideoVerificationPrompt、ComplianceReviewPanel |
| IB | IBCommissionTable、InviteLinkCard、SubIBCard、RebateWalletCard |
| CopyTrading | StrategyCard、CopyTraderCard、RiskLevelTag、CopySettingsPanel |
| System | PermissionDeniedBlock、AuditLogTimeline、ReviewDecisionPanel |

---

# Part D — Icon System L5

## 16. Icon Schema

`icon.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "IconRegistryItem",
  "type": "object",
  "required": ["name", "category", "styles", "sizes", "stroke", "radius", "color_token", "usage", "code_name"],
  "properties": {
    "name": { "type": "string" },
    "category": {
      "enum": ["navigation", "account", "finance", "trading", "compliance", "ib", "copy-trading", "status", "system", "data", "security"]
    },
    "styles": {
      "type": "array",
      "items": { "enum": ["line", "fill"] }
    },
    "sizes": {
      "type": "array",
      "items": { "type": "number" }
    },
    "stroke": { "type": "number" },
    "radius": { "type": "number" },
    "color_token": { "type": "string" },
    "states": {
      "type": "array",
      "items": { "enum": ["default", "active", "disabled", "success", "warning", "danger", "inverse"] }
    },
    "usage": {
      "type": "array",
      "items": { "type": "string" }
    },
    "code_name": { "type": "string" },
    "figma_name": { "type": "string" },
    "deprecated": { "type": "boolean" },
    "replacement": { "type": "string" },
    "version": { "type": "string" }
  }
}
```

---

## 17. Icon Core List

> 默认风格：Line。选中 / Active 状态：Fill。
> 默认尺寸：24px。辅助尺寸：16 / 20 / 32。
> 默认线宽：1.5px。圆角：3px。
> 颜色必须读取 `color.icon.*`。

| 分类 | 图标 |
|---|---|
| Navigation | home、market、trade、copy、wallet、profile、menu、apps、dashboard、setting |
| Account | user、account、account-add、account-switch、identity、profile-card、verification、security、password、device |
| Finance | wallet、deposit、withdraw、transfer、bank-card、bank、currency、exchange、balance、cash |
| Trading | chart、candlestick、position、order、history、leverage、margin、profit-loss、signal、spread |
| Compliance | document、agreement、risk、shield-check、video-verify、selfie、upload-doc、review、reject-doc、approved-doc |
| KYC | id-card、passport、address-proof、tax-card、camera、face-scan、liveness、document-check、document-error、resubmit |
| IB | partner、invite-link、commission、rebate、hierarchy、sub-ib、network、level、reward、referral |
| CopyTrading | strategy、copy-trader、follow、unfollow、risk-level、performance、ranking、subscription、allocation、stop-copy |
| Status | success、warning、error、pending、processing、locked、restricted、disabled、info、question |
| System | search、filter、close、back、next、more、edit、delete、refresh、download |
| Data | calendar、clock、timeline、table、list、sort、trend-up、trend-down、pie-chart、bar-chart |
| Security | lock、unlock、shield、two-factor、fingerprint、privacy、key、safe、alert-shield、device-lock |

---

## 18. Icon Registry 示例

`icon-registry.json`

```json
{
  "wallet": {
    "name": "wallet",
    "category": "finance",
    "styles": ["line", "fill"],
    "sizes": [16, 20, 24, 32],
    "stroke": 1.5,
    "radius": 3,
    "color_token": "color.icon.primary",
    "states": ["default", "active", "disabled", "inverse"],
    "usage": ["wallet-entry", "balance-summary", "transaction-list"],
    "code_name": "IconWallet",
    "figma_name": "Icons/Finance/Wallet",
    "deprecated": false,
    "version": "v3.0.0"
  },
  "video-verify": {
    "name": "video-verify",
    "category": "compliance",
    "styles": ["line", "fill"],
    "sizes": [20, 24, 32],
    "stroke": 1.5,
    "radius": 3,
    "color_token": "color.icon.primary",
    "states": ["default", "active", "disabled", "warning", "danger"],
    "usage": ["video-verification-prompt", "compliance-review", "account-opening"],
    "code_name": "IconVideoVerify",
    "figma_name": "Icons/Compliance/VideoVerify",
    "deprecated": false,
    "version": "v3.0.0"
  }
}
```

---

## 19. Icon QA Rules

`icon-qa.rules.json`

```json
{
  "rules": [
    {
      "id": "ICON_001",
      "name": "Icon must exist in registry",
      "severity": "blocker",
      "fail_when": ["unregistered_icon_used"]
    },
    {
      "id": "ICON_002",
      "name": "Icon must use semantic color token",
      "severity": "fail",
      "required_fields": ["color_token"]
    },
    {
      "id": "ICON_003",
      "name": "Icon style must support line or fill",
      "severity": "fail",
      "required_fields": ["styles"]
    },
    {
      "id": "ICON_004",
      "name": "Icon must follow size system",
      "severity": "fail",
      "allowed_sizes": [16, 20, 24, 32]
    },
    {
      "id": "ICON_005",
      "name": "Deprecated icon requires replacement",
      "severity": "fail",
      "condition": "deprecated=true",
      "required_fields": ["replacement"]
    }
  ]
}
```

---

# Part E — Pattern System L5

## 20. Pattern Schema

`pattern.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "PatternRegistryItem",
  "type": "object",
  "required": ["name", "platform", "scenario", "sections", "recommended_components", "required_states", "forbidden", "qa"],
  "properties": {
    "name": { "type": "string" },
    "platform": {
      "type": "array",
      "items": { "enum": ["app", "h5", "web", "admin"] }
    },
    "scenario": { "type": "string" },
    "sections": {
      "type": "array",
      "items": { "type": "string" }
    },
    "recommended_components": {
      "type": "array",
      "items": { "type": "string" }
    },
    "required_states": {
      "type": "array",
      "items": { "type": "string" }
    },
    "layout_rules": {
      "type": "array",
      "items": { "type": "string" }
    },
    "interaction_rules": {
      "type": "array",
      "items": { "type": "string" }
    },
    "forbidden": {
      "type": "array",
      "items": { "type": "string" }
    },
    "qa": { "type": "object" },
    "version": { "type": "string" }
  }
}
```

---

## 21. Pattern Registry 示例

`pattern-registry.json`

```json
{
  "AppFinancialOperationPage": {
    "name": "AppFinancialOperationPage",
    "platform": ["app"],
    "scenario": "Deposit, withdraw, transfer, exchange and other money operation pages.",
    "sections": [
      "safe_area_header",
      "amount_stage",
      "account_or_method_selector",
      "risk_notice",
      "fee_and_limit_summary",
      "fixed_bottom_action",
      "confirm_dialog",
      "result_state"
    ],
    "recommended_components": [
      "AmountInput",
      "BalanceSummaryCard",
      "DepositMethodCard",
      "WithdrawMethodCard",
      "RiskWarningBanner",
      "Button",
      "Dialog",
      "TransactionTimeline"
    ],
    "required_states": ["default", "inputting", "method_selected", "submitting", "success", "failed", "restricted"],
    "layout_rules": [
      "Amount stage must occupy the strongest visual hierarchy.",
      "Primary action is fixed at bottom on app.",
      "Risk notice must appear before final submission."
    ],
    "interaction_rules": [
      "Disable primary action when amount is invalid.",
      "Show confirmation dialog before final submit.",
      "Show async processing state after submission when result is not immediate."
    ],
    "forbidden": ["table-layout", "hidden-risk-copy", "small-amount-stage", "floating-uncontrolled-submit"],
    "qa": {
      "required_components": ["AmountInput", "Button", "Dialog"],
      "required_states": ["submitting", "success", "failed"],
      "required_platform_rules": ["app-safe-area", "bottom-fixed-action"]
    },
    "version": "v3.0.0"
  },
  "AppAgreementProcessPage": {
    "name": "AppAgreementProcessPage",
    "platform": ["app", "h5"],
    "scenario": "Account opening agreement reading, acceptance and risk disclosure signing.",
    "sections": [
      "progress_header",
      "agreement_title",
      "scrollable_content",
      "acceptance_block",
      "fixed_bottom_action",
      "exit_confirm_dialog"
    ],
    "recommended_components": [
      "AgreementReader",
      "Dialog",
      "Button",
      "Checkbox",
      "Progress",
      "RiskWarningBanner"
    ],
    "required_states": ["not_scrolled_to_bottom", "bottom_reached", "accepted", "returned_accepted", "exit_confirm", "completed"],
    "layout_rules": [
      "Primary action is disabled before user reaches bottom for the first time.",
      "Accepted agreement remains actionable when user returns to the step.",
      "Non-first agreement step uses back action, not close action."
    ],
    "interaction_rules": [
      "Close action only exists on first agreement step.",
      "Exit must show confirmation dialog.",
      "Canceling acceptance disables continue action."
    ],
    "forbidden": ["default-checked-before-reading", "close-button-on-non-first-step", "skip-risk-disclosure"],
    "qa": {
      "required_components": ["AgreementReader", "Dialog", "Button"],
      "required_states": ["not_scrolled_to_bottom", "bottom_reached", "returned_accepted"],
      "required_platform_rules": ["app-safe-area", "bottom-fixed-action"]
    },
    "version": "v3.0.0"
  },
  "AdminReviewPage": {
    "name": "AdminReviewPage",
    "platform": ["admin"],
    "scenario": "KYC, video verification, deposit, withdrawal and compliance review.",
    "sections": [
      "filter_bar",
      "review_queue_table",
      "detail_drawer",
      "document_preview",
      "decision_panel",
      "audit_log"
    ],
    "recommended_components": [
      "Table",
      "Drawer",
      "ComplianceReviewPanel",
      "KYCStatusBlock",
      "Button",
      "Tag",
      "AuditLogTimeline"
    ],
    "required_states": ["queue_loading", "selected", "approved", "rejected", "need_more_info", "permission_denied"],
    "layout_rules": [
      "Admin uses compact density by default.",
      "Decision panel must remain visible while reviewing.",
      "Audit log must be attached to each review decision."
    ],
    "interaction_rules": [
      "Reject action requires reason.",
      "Approve action requires confirmation for high-risk cases.",
      "Permission controls must hide unavailable actions."
    ],
    "forbidden": ["app-bottom-sheet", "missing-audit-log", "review-without-reason"],
    "qa": {
      "required_components": ["Table", "Drawer", "ComplianceReviewPanel"],
      "required_states": ["approved", "rejected", "permission_denied"],
      "required_platform_rules": ["admin-compact-density"]
    },
    "version": "v3.0.0"
  }
}
```

---

## 22. Pattern QA Rules

`pattern-qa.rules.json`

```json
{
  "rules": [
    {
      "id": "PATTERN_001",
      "name": "Pattern must define sections",
      "severity": "blocker",
      "required_fields": ["sections"]
    },
    {
      "id": "PATTERN_002",
      "name": "Pattern must define required states",
      "severity": "fail",
      "required_fields": ["required_states"]
    },
    {
      "id": "PATTERN_003",
      "name": "Pattern must use registered components",
      "severity": "blocker",
      "fail_when": ["unregistered_component_used"]
    },
    {
      "id": "PATTERN_004",
      "name": "Pattern must define forbidden structures",
      "severity": "warning",
      "required_fields": ["forbidden"]
    },
    {
      "id": "PATTERN_005",
      "name": "Financial operation requires risk notice",
      "severity": "blocker",
      "condition": "name contains FinancialOperation",
      "required_components": ["RiskWarningBanner"]
    }
  ]
}
```

---

# Part F — Platform Modes L5

## 23. Platform Rules

| 平台 | 核心规则 | 默认密度 | 关键限制 |
|---|---|---|---|
| App | 触控优先、底部固定操作、安全区、键盘遮挡处理 | comfortable | 不使用复杂表格作为主结构 |
| H5 | 接近 App，但要处理浏览器、分享、Deep Link、扫码引导 | standard | 不依赖原生能力 |
| Web | 响应式、信息密度适中、详情页/列表页清晰 | standard | 不使用 App 式底部堆叠作为主操作 |
| Admin | 表格、批量操作、审核面板、审计日志、权限控制 | compact | 不使用营销式大留白影响效率 |

### 23.1 App Rules

```text
- 最小触控面积：44px。
- 底部主操作必须考虑 safe area。
- 输入金额页面使用 amount_stage 作为最高视觉层级。
- 复杂选择使用 BottomSheet。
- 全局确认使用 Dialog。
- 键盘弹出时，主按钮不得被遮挡。
```

### 23.2 Admin Rules

```text
- 默认 compact density。
- 表格列必须支持排序、筛选、状态标签。
- 审核动作必须有权限控制和审计日志。
- 高风险操作必须二次确认。
- 拒绝类操作必须填写原因。
```

---

# Part G — AI Runtime L5

## 24. AI Readable Index

`ai-readable-index.json`

```json
{
  "version": "v3.0.0-L5",
  "skill": "Design System Engineering Skill",
  "entry": ".codex/skills/l1-core/design-system-engineering/design-system-engineering-skill-v3.0.0-l5.md",
  "tokens": {
    "source": "01_tokens/tokens.json",
    "schema": "01_tokens/token.schema.json",
    "mode_matrix": "01_tokens/token-mode.matrix.json",
    "qa_rules": "01_tokens/token-qa.rules.json"
  },
  "components": {
    "source": "02_components/component-manifest.json",
    "schema": "02_components/component.schema.json",
    "qa_rules": "02_components/component-qa.rules.json"
  },
  "business_components": {
    "source": "03_business_components/business-component-manifest.json",
    "schema": "03_business_components/business-component.schema.json",
    "qa_rules": "03_business_components/business-component-qa.rules.json"
  },
  "icons": {
    "source": "04_icons/icon-registry.json",
    "schema": "04_icons/icon.schema.json",
    "qa_rules": "04_icons/icon-qa.rules.json"
  },
  "patterns": {
    "source": "05_patterns/pattern-registry.json",
    "schema": "05_patterns/pattern.schema.json",
    "qa_rules": "05_patterns/pattern-qa.rules.json"
  },
  "platform": {
    "source": "06_platform_modes/mode-matrix.json",
    "rules": ["06_platform_modes/app-rules.md", "06_platform_modes/h5-rules.md", "06_platform_modes/web-rules.md", "06_platform_modes/admin-rules.md"]
  },
  "code_mapping": {
    "css": "08_code_mapping/css-variable.mapping.css",
    "tailwind": "08_code_mapping/tailwind.mapping.js",
    "react": "08_code_mapping/react.mapping.md",
    "vue": "08_code_mapping/vue.mapping.md",
    "figma": "08_code_mapping/figma-variable.mapping.md"
  },
  "qa": {
    "matrix": "09_quality_gates/qa-gate.matrix.md",
    "release": "10_release_management/release-checklist.md"
  }
}
```

---

## 25. AI 执行顺序

```text
1. Read ai-readable-index.json
2. Read token.schema.json and tokens.json
3. Read component.schema.json and component-manifest.json
4. Read business-component.schema.json and business-component-manifest.json
5. Read icon.schema.json and icon-registry.json
6. Read pattern.schema.json and pattern-registry.json
7. Read platform mode rules
8. Select allowed tokens / components / icons / patterns
9. Generate or update design system output
10. Run QA Gate
11. Output pass / warning / fail / blocker
12. If fail or blocker, stop UI Build usage until fixed
```

---

## 26. AI 缺口处理规则

| 场景 | AI 应该怎么做 | 禁止行为 |
|---|---|---|
| 缺少 Token | 记录 token gap，提出新增 token，不直接写死值 | 临时写 hex / px |
| 缺少组件 | 先查是否可组合；不能组合再新增组件 manifest | 页面内散写组件 |
| 缺少图标 | 记录 icon gap，补 registry，再生成或引入图标 | 随机用相似图标 |
| 缺少 Pattern | 使用最接近 Pattern，并记录 pattern gap | 自由发挥页面结构 |
| 业务规则不明确 | 使用业务组件状态矩阵兜底，并标记风险 | 编造业务流程 |
| 平台差异不明确 | 默认读取 platform mode | App / Web 混用规则 |

---

# Part H — Code Mapping L5

## 27. CSS Variables Mapping

`css-variable.mapping.css`

```css
:root {
  --color-neutral-950: #101828;
  --color-text-primary: var(--color-neutral-950);
  --color-text-secondary: #667085;
  --color-bg-page: #f7f8fa;
  --color-bg-surface: #ffffff;
  --color-border-default: #eaecf0;
  --color-icon-primary: #344054;
  --color-status-success: #12b76a;
  --color-status-warning: #f79009;
  --color-status-danger: #f04438;

  --space-component-xs: 4px;
  --space-component-sm: 8px;
  --space-component-md: 16px;
  --space-component-lg: 24px;

  --radius-control-sm: 6px;
  --radius-control-md: 8px;
  --radius-card-lg: 20px;
  --radius-dialog-lg: 24px;

  --size-control-height-sm: 32px;
  --size-control-height-md: 44px;
  --size-control-height-lg: 52px;
  --size-icon-md: 24px;

  --shadow-card-md: 0 8px 24px rgba(16, 24, 40, 0.08);
  --shadow-dialog-lg: 0 24px 64px rgba(16, 24, 40, 0.20);

  --button-bg-primary-default: #1677ff;
  --button-bg-primary-pressed: #0958d9;
  --button-bg-primary-disabled: #d0d5dd;
  --button-text-primary: #ffffff;
  --button-height-md: var(--size-control-height-md);
  --button-radius: var(--radius-control-md);
  --button-padding-x-md: var(--space-component-md);
}
```

---

## 28. Tailwind Mapping

`tailwind.mapping.js`

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)"
        },
        bg: {
          page: "var(--color-bg-page)",
          surface: "var(--color-bg-surface)"
        },
        border: {
          DEFAULT: "var(--color-border-default)"
        },
        status: {
          success: "var(--color-status-success)",
          warning: "var(--color-status-warning)",
          danger: "var(--color-status-danger)"
        },
        button: {
          primary: {
            DEFAULT: "var(--button-bg-primary-default)",
            pressed: "var(--button-bg-primary-pressed)",
            disabled: "var(--button-bg-primary-disabled)"
          }
        }
      },
      spacing: {
        "component-xs": "var(--space-component-xs)",
        "component-sm": "var(--space-component-sm)",
        "component-md": "var(--space-component-md)",
        "component-lg": "var(--space-component-lg)"
      },
      borderRadius: {
        "control-sm": "var(--radius-control-sm)",
        "control-md": "var(--radius-control-md)",
        "card-lg": "var(--radius-card-lg)",
        "dialog-lg": "var(--radius-dialog-lg)"
      },
      boxShadow: {
        "card-md": "var(--shadow-card-md)",
        "dialog-lg": "var(--shadow-dialog-lg)"
      },
      height: {
        "control-sm": "var(--size-control-height-sm)",
        "control-md": "var(--size-control-height-md)",
        "control-lg": "var(--size-control-height-lg)"
      }
    }
  }
};
```

---

## 29. React Mapping

`react.mapping.md`

```md
# React Component Mapping

## Button

Design System Manifest:
- Component: Button
- Variants: primary / secondary / ghost / danger / text
- Sizes: sm / md / lg
- States: default / hover / active / focus / disabled / loading

React API:

```tsx
type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "text";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  iconLeft?: IconName;
  iconRight?: IconName;
  onClick?: () => void;
};
```

Mapping Rules:
- `variant` maps to `button.bg.*` and `button.text.*`.
- `size` maps to `button.height.*` and `button.padding.*`.
- `loading=true` sets `aria-busy=true`.
- `disabled=true` sets `aria-disabled=true`.
- No page-level style override allowed.
```

---

## 30. Vue Mapping

`vue.mapping.md`

```md
# Vue Component Mapping

## DsButton

```ts
type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "text";
type ButtonSize = "sm" | "md" | "lg";

defineProps<{
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  iconLeft?: string;
  iconRight?: string;
}>();

defineEmits<{
  click: [];
}>();
```

Rules:
- Props must match component-manifest.json.
- Style must reference CSS variables from tokens.
- No component-local hardcoded color / radius / height.
```

---

# Part I — QA Gate L5

## 31. QA Gate Matrix

| Gate | Pass | Warning | Fail | Blocker |
|---|---|---|---|---|
| Token Gate | Schema 完整、无断链、无硬编码 | 描述缺失 | export / mode 缺失 | 页面硬编码 / 直接用 L1 |
| Component Gate | Manifest 完整、状态完整、绑定完整 | Do/Don't 不完整 | 缺 props / a11y / code mapping | 无 token binding / 只有 default |
| Business Gate | 字段、状态、权限、API 完整 | 说明不足 | 缺状态矩阵 / 权限 | 编造业务 / 无错误处理 |
| Icon Gate | Registry 完整、命名规范 | usage 不完整 | 尺寸/状态缺失 | 未注册图标被使用 |
| Pattern Gate | 结构、状态、组件、禁用规则完整 | layout rules 不够 | 缺 required states | 未注册组件 / 缺风险提示 |
| Platform Gate | 多端差异明确 | 局部规则模糊 | 触控/密度缺失 | App/Web 规则混用导致不可用 |
| AI Runtime Gate | 索引完整、顺序明确 | 文档描述不足 | 缺读取顺序 | AI 未读取索引直接输出 |
| Code Mapping Gate | CSS/Tailwind/React/Vue 完整 | 示例不足 | 某端映射缺失 | 代码无法消费 |
| Release Gate | changelog/impact/migration 完整 | 影响范围不够细 | 缺 migration | 破坏性变更无记录 |

---

## 32. QA 输出格式

```json
{
  "result": "fail",
  "level": "L5",
  "summary": "Design system is blocked by token and component issues.",
  "gates": [
    {
      "gate": "Token Gate",
      "status": "blocker",
      "issues": [
        {
          "id": "TOKEN_001",
          "message": "Hardcoded color #1677ff found in Button.",
          "fix": "Replace with button.bg.primary.default."
        }
      ]
    },
    {
      "gate": "Component Gate",
      "status": "fail",
      "issues": [
        {
          "id": "COMP_002",
          "message": "TextInput missing disabled state.",
          "fix": "Add disabled state and token binding."
        }
      ]
    }
  ],
  "allow_ui_build": false
}
```

---

## 33. Package Scripts

`package.json`

```json
{
  "scripts": {
    "qa:tokens": "node scripts/check-tokens.js",
    "qa:components": "node scripts/check-component-manifest.js",
    "qa:business": "node scripts/check-business-components.js",
    "qa:icons": "node scripts/check-icons.js",
    "qa:patterns": "node scripts/check-pattern-registry.js",
    "qa:platform": "node scripts/check-platform-modes.js",
    "qa:ai": "node scripts/check-ai-runtime.js",
    "qa:code": "node scripts/check-code-mapping.js",
    "qa:ds": "node scripts/check-design-system.js"
  }
}
```

---

## 34. QA Script 逻辑

### 34.1 `scripts/check-design-system.js`

```js
const gates = [
  "tokens",
  "components",
  "businessComponents",
  "icons",
  "patterns",
  "platformModes",
  "aiRuntime",
  "codeMapping",
  "release"
];

function runGate(name) {
  // Implementation should load corresponding *.rules.json and validate source files.
  return {
    gate: name,
    status: "pass",
    issues: []
  };
}

const results = gates.map(runGate);
const hasBlocker = results.some((item) => item.status === "blocker");
const hasFail = results.some((item) => item.status === "fail");

const output = {
  result: hasBlocker ? "blocker" : hasFail ? "fail" : "pass",
  allow_ui_build: !hasBlocker && !hasFail,
  gates: results
};

console.log(JSON.stringify(output, null, 2));

if (hasBlocker || hasFail) {
  process.exit(1);
}
```

### 34.2 必须检查的模式

```text
- JSON Schema required fields
- Token alias reference existence
- Token export name existence
- Component token_binding references existing tokens
- Component states include required states
- Business component permissions exist
- Icon used by component exists in icon-registry
- Pattern recommended components exist in component manifest
- Platform rules exist for declared platform
- AI runtime index points to existing files
- Code mapping contains required outputs
- Deprecated item has replacement
```

---

# Part J — Release Governance L5

## 35. Versioning

| 类型 | 规则 | 示例 |
|---|---|---|
| Major | 破坏性变更，需要迁移 | v4.0.0 |
| Minor | 新增 token / component / pattern，不破坏旧资产 | v3.1.0 |
| Patch | 修复问题、补充说明、兼容增强 | v3.0.1 |
| L5 Patch | 不改业务范围，只补齐执行与 QA 能力 | v3.0.0-L5 |

---

## 36. Deprecated 标准

`deprecated.md`

```md
# Deprecated Items

| Type | Item | Reason | Replacement | Migration | Removal Version | Impacted Pages |
|---|---|---|---|---|---|---|
| Token | color.primary | Naming not semantic | color.action.primary.bg | Replace usage in Button and links | v4.0.0 | Login, Account Opening |
```

规则：

```text
1. 禁止直接删除旧 Token / Component / Icon / Pattern。
2. 废弃必须提供 replacement。
3. 破坏性迁移必须提供 migration-guide。
4. 至少保留一个版本周期。
5. 删除前必须确认无引用。
```

---

## 37. Impact Report

`impact-report.md`

```md
# Impact Report

## Change
新增 AgreementReader business component。

## Reason
开户协议阅读流程需要标准化，避免每个页面重复实现。

## Impacted Areas
- App account opening
- H5 account opening
- Compliance review
- UI Build Skill page generation

## Migration
- Existing agreement modal should migrate to AgreementReader.
- Existing page-level scroll detection should move into AgreementReader state machine.

## Risk
Medium. Agreement acceptance logic affects compliance flow.

## QA Required
- Business Component Gate
- Pattern Gate
- Platform Gate
- Visual Regression
```

---

# Part K — AI Execution Commands L5

## 38. 初始化设计系统工程

```txt
使用 Design System Engineering Skill v3.0.0-L5 初始化生产级设计系统。

必须执行：
1. 建立完整目录：
   00_principles / 01_tokens / 02_components / 03_business_components / 04_icons /
   05_patterns / 06_platform_modes / 07_ai_runtime / 08_code_mapping /
   09_quality_gates / 10_release_management / scripts

2. 输出机器可读文件：
   tokens.json
   token.schema.json
   component-manifest.json
   component.schema.json
   business-component-manifest.json
   business-component.schema.json
   icon-registry.json
   icon.schema.json
   pattern-registry.json
   pattern.schema.json
   ai-readable-index.json

3. 输出代码映射：
   css-variable.mapping.css
   tailwind.mapping.js
   react.mapping.md
   vue.mapping.md
   figma-variable.mapping.md

4. 输出 QA：
   token-qa.rules.json
   component-qa.rules.json
   business-component-qa.rules.json
   icon-qa.rules.json
   pattern-qa.rules.json
   qa-gate.matrix.md

5. 输出治理：
   changelog.md
   deprecated.md
   migration-guide.md
   impact-report.md

禁止：
- 只有设计说明，没有 schema。
- 只有视觉规范，没有 manifest。
- 只有 checklist，没有 pass/fail。
- 组件或页面写死颜色、字号、圆角、阴影。
```

---

## 39. 扩展 Token

```txt
使用 Design System Engineering Skill v3.0.0-L5 扩展 Token。

输入：
- Token 用途：
- 所属层级：base / semantic / component / pattern
- 适用平台：app / h5 / web / admin
- 适用 mode：theme / brand / density / platform
- 输出目标：Figma / CSS / Tailwind / React / Vue

必须执行：
1. 检查是否已有 token 可复用。
2. 如果已有，返回现有 token。
3. 如果没有，新增 token 到 tokens.json。
4. 补 export.css / export.tailwind / export.figma / export.js。
5. 检查 alias 是否断链。
6. 更新 token-changelog.md。
7. 执行 Token Gate。
```

---

## 40. 扩展组件

```txt
使用 Design System Engineering Skill v3.0.0-L5 扩展组件。

输入：
- 组件名称：
- 组件用途：
- 所属分类：
- 适用平台：
- 变体：
- 尺寸：
- 状态：
- Props：
- Events：
- Slots：
- Token Binding：
- A11y：
- Code Mapping：

必须执行：
1. 先检查 component-manifest.json 是否已有组件可复用。
2. 如果可组合，不新增组件。
3. 如果必须新增，写入 component-manifest.json。
4. 校验 token_binding 是否全部存在。
5. 校验状态是否完整。
6. 补 React / Vue / HTML / Figma 映射。
7. 更新 component-changelog.md。
8. 执行 Component Gate。
```

---

## 41. 扩展业务组件

```txt
使用 Design System Engineering Skill v3.0.0-L5 扩展业务组件。

输入：
- 业务域：
- 业务场景：
- 数据字段：
- 状态矩阵：
- 操作动作：
- 权限：
- 平台：
- API 映射：
- 错误处理：
- 隐私 / 脱敏规则：

必须执行：
1. 检查是否可由已有业务组件支持。
2. 如果不能支持，新增 business-component-manifest.json。
3. 明确字段、状态、权限、错误处理。
4. 绑定 Core Components 和 Tokens。
5. 更新 business-component changelog。
6. 执行 Business Component Gate。
```

---

## 42. 扩展图标

```txt
使用 Design System Engineering Skill v3.0.0-L5 扩展图标。

输入：
- 图标名称：
- 业务分类：
- 使用场景：
- 风格：line / fill
- 尺寸：
- 状态：
- 颜色 token：

必须执行：
1. 检查 icon-registry.json 是否已有同义图标。
2. 如果已有，复用现有图标。
3. 如果没有，新增 icon-registry.json。
4. 命名必须符合 icon-naming.md。
5. 默认 line，active 使用 fill。
6. 颜色必须读取 color.icon.*。
7. 更新 icon-changelog.md。
8. 执行 Icon Gate。
```

---

## 43. 执行 L5 QA

```txt
使用 Design System Engineering Skill v3.0.0-L5 执行设计系统 QA。

检查范围：
- Token Gate
- Component Gate
- Business Component Gate
- Icon Gate
- Pattern Gate
- Platform Gate
- AI Runtime Gate
- Code Mapping Gate
- Release Gate

输出格式：
1. 总结：Pass / Warning / Fail / Blocker
2. 是否允许 UI Build 使用：true / false
3. 问题清单
4. 严重级别
5. 修复建议
6. 影响范围
7. 是否需要版本升级
```

---

# Part L — L5 Acceptance Standard

## 44. L5 完成标准

| 模块 | L5 完成条件 | 是否必需 |
|---|---|---:|
| Token Schema | 字段完整，可校验，可导出 | 是 |
| Token Registry | L1/L2/L3 完整，支持 mode | 是 |
| Component Schema | Props / States / Events / Slots / Token Binding / A11y 完整 | 是 |
| Component Manifest | Core components 有最小可用清单 | 是 |
| Business Component Manifest | 金融/Broker 核心业务组件可复用 | 是 |
| Icon Schema | 命名、尺寸、风格、状态、颜色规则完整 | 是 |
| Icon Registry | 至少覆盖核心业务图标清单 | 是 |
| Pattern Schema | 页面结构、推荐组件、状态、禁用规则完整 | 是 |
| Pattern Registry | 覆盖 App / H5 / Web / Admin 主流程 | 是 |
| Platform Mode | 多端规则明确 | 是 |
| AI Runtime Index | 入口清晰，读取顺序明确 | 是 |
| Code Mapping | CSS / Tailwind / React / Vue / Figma 可消费 | 是 |
| QA Rules | 有 Pass / Warning / Fail / Blocker | 是 |
| Scripts | 有 QA 执行入口和失败退出逻辑 | 是 |
| Release Governance | Changelog / Deprecated / Migration / Impact 完整 | 是 |

---

## 45. L5 最终定义

```text
Design System Engineering Skill v3.0.0-L5
= Token Schema + Token Registry + Token QA
+ Component Schema + Component Manifest + Component QA
+ Business Component Schema + Business Component Manifest + Business QA
+ Icon Schema + Icon Registry + Icon QA
+ Pattern Schema + Pattern Registry + Pattern QA
+ Platform Mode Rules
+ AI Runtime Index
+ Code Mapping
+ QA Gate Matrix
+ Release Governance
```

本 Skill 的最终目标不是“让设计系统看起来完整”，而是：

```text
让 AI 能稳定读取，
让设计师能稳定维护，
让前端能稳定消费，
让 QA 能稳定检查，
让团队能长期迭代。
```

---

## 46. Final Forbidden Rules

```text
- 禁止无 schema 的 manifest。
- 禁止无 manifest 的组件说明。
- 禁止无 registry 的图标使用。
- 禁止无 pattern 的页面自由搭建。
- 禁止无 mode 的多项目复制。
- 禁止无 code mapping 的 token。
- 禁止无 pass/fail 的 checklist。
- 禁止无 changelog 的修改。
- 禁止无 replacement 的 deprecated。
- 禁止 AI 跳过 ai-readable-index.json 直接生成页面。
```

---

## 47. Final Output Contract

当 Codex / Claude / Cursor 使用本 Skill 时，最终输出必须包含：

```text
1. Created / Updated Files
2. Token Changes
3. Component Changes
4. Business Component Changes
5. Icon Changes
6. Pattern Changes
7. Code Mapping Changes
8. QA Gate Result
9. Release Impact
10. Remaining Gaps
```

输出示例：

```json
{
  "created_files": [
    "01_tokens/tokens.json",
    "02_components/component-manifest.json",
    "07_ai_runtime/ai-readable-index.json"
  ],
  "qa_result": "pass",
  "allow_ui_build": true,
  "remaining_gaps": []
}
```

---

# End

`Design System Engineering Skill v3.0.0-L5` 是完整 L5 生产级设计系统工程 Skill。
它可以作为变量系统、组件库、图标库、Pattern、AI Runtime、Code Mapping、QA Gate 和版本治理的统一执行标准。
