# Project Skill Index

本项目使用生产级 AI 产品设计工程 Skill 系统。Codex 必须按任务类型选择 Skill，不允许默认读取全部 Skill。

## Directory Contract

```text
.codex/skills/
├── l0-utility-startup/
│   └── quick-local-expo-demo-startup-skill-v1.3.0.md
├── l1-core/
│   ├── product-engineering/
│   │   └── ai-product-production-delivery-skill-v3.0.0-l5.md
│   ├── design-system-engineering/
│   │   └── design-system-engineering-skill-v3.0.0-l5.md
│   └── ui-build-production/
│       └── ui-build-production-skill-v3.0.0-l5.md
├── l2-addons/
│   ├── design-system-governance/
│   │   ├── design-public-resource-package-governance-skill-v1.1.0-l5.md
│   │   └── local-icon-asset-library-governance-skill-v1.1.0-l5.md
│   ├── ui-build-governance/
│   │   ├── app-modal-overlay-system-governance-skill-v2.0.0-l5.md
│   │   ├── financial-ux-copy-localization-governance-skill-v1.0.0-l5.md
│   │   ├── page-visual-rhythm-spacing-governance-skill-v1.0.0-l5.md
│   │   └── ui-reference-adaptation-add-on-skill-v1.0.0-l5.md
│   ├── ui-quality-gates/
│   │   ├── elite-ux-ui-remediation-board-skill-v4.0.0-l5.md
│   │   └── ux-interaction-quality-gate-skill-v1.0.0-l5.md
│   └── localization/
│       └── indonesian-ui-localization-broker-l5-skill.md
└── l3-supporting-references/
    ├── financial-copy/
    │   └── financial-ux-copy-localization-en-capitalization-rules.md
    └── localization/
        └── indonesian-ui-localization-broker-l5-skill-zh-v2.0.0.md
```

Rules:

- Every Skill document must live under `.codex/skills/` with an explicit layer/category path.
- Keep file names complete and versioned.
- Do not place Add-ons beside Core Skills.
- Do not place L3 supporting references in L0/L1/L2 Skill folders.
- `AGENTS.md` routing paths must stay synchronized with this directory contract.

## Classification Model

The project uses four Skill layers:

| Layer | Category | Role | Rule |
|---|---|---|---|
| L0 | Utility Startup | Quick local environment operations that do not change product scope or UI | Can run independently when the request is only local startup or preview |
| L1 | Core Skills | Product, Design System, and UI Build foundations | Add-ons cannot replace Core Skills |
| L2 | Governance Add-ons | Specialized gates attached to a Core Skill | Must run after its parent Core Skill is selected and before implementation or release |
| L3 | Supporting References | Rule/reference documents consumed by a parent Skill | Must not be invoked as standalone Skills |

## Skill Hierarchy

```text
L0 Utility Startup
└── Quick Local Expo Demo Startup Skill

L1 Core Product Engineering
└── AI Product Production Delivery Skill

L1 Core Design System Engineering
├── Design System Engineering Skill
├── Design Public Resource Package Governance Add-on
└── Local Icon Asset Library Governance Add-on

L1 Core UI Build Production
├── UI Build Production Skill
├── UI Reference Adaptation Add-on
├── Financial UX Copy & Localization Governance Add-on
│   ├── English UI Copy Capitalization Rules
│   └── Indonesian UI Localization Broker L5 Skill
│       └── Indonesian UI Localization Broker L5 Reference
├── App Modal & Overlay System Governance Add-on
├── Page Visual Rhythm & Spacing Governance Add-on
├── Elite UX/UI Remediation Board Add-on
└── UX Interaction Quality Gate Add-on
```

## Classification Matrix

| Skill / Document | Layer | Category | Parent | Depends On | Standalone |
|---|---|---|---|---|---|
| Quick Local Expo Demo Startup Skill | L0 | Utility Startup | None | Expo project context | Yes |
| AI Product Production Delivery Skill | L1 | Core Product Engineering | None | Business inputs, roles, risks, scope | Yes |
| Design System Engineering Skill | L1 | Core Design System Engineering | None | Product Kernel or Page Contract when UI-bound | Yes |
| UI Build Production Skill | L1 | Core UI Build Production | None | Page Contract, Design System, patterns, states | Yes |
| Design Public Resource Package Governance Add-on | L2 | Design System Governance Add-on | Design System Engineering Skill | Public asset registries, component/pattern/icon registries | No |
| Local Icon Asset Library Governance Add-on | L2 | Design System Governance Add-on | Design System Engineering Skill | Icon registry, local icon assets, token rules | No |
| UI Reference Adaptation Add-on | L2 | UI Build Governance Add-on | UI Build Production Skill | Page Contract, Design System, reference input | No |
| Financial UX Copy & Localization Governance Add-on | L2 | UI Build Governance Add-on | UI Build Production Skill | Product risk rules, i18n keys, terminology | No |
| Indonesian UI Localization Broker L5 Skill | L2 | Localization Add-on | Financial UX Copy & Localization Governance Add-on | Indonesian localization reference | No |
| App Modal & Overlay System Governance Add-on | L2 | UI Build Governance Add-on | UI Build Production Skill | Overlay registry, modal policy, platform behavior | No |
| Page Visual Rhythm & Spacing Governance Add-on | L2 | UI Build Governance Add-on | UI Build Production Skill | Tokens, component patterns, surface hierarchy | No |
| Elite UX/UI Remediation Board Add-on | L2 | UI Quality Gate Add-on | UI Build Production Skill | Evidence chain, real usage scenarios, fix cards | No |
| UX Interaction Quality Gate Add-on | L2 | UI Quality Gate Add-on | UI Build Production Skill | Task flow, state matrix, error recovery | No |
| English UI Copy Capitalization Rules | L3 | Supporting Rule Document | Financial UX Copy & Localization Governance Add-on | English UI copy task | No |
| Indonesian UI Localization Broker L5 Reference | L3 | Supporting Reference Document | Indonesian UI Localization Broker L5 Skill | Indonesian UI copy task | No |

## Version Record

| Version | Date | Change |
|---|---|---|
| v1.4.0 | 2026-06-01 | Reintroduced mandatory path hierarchy under `.codex/skills/` using L0/L1/L2/L3 layer and category directories while keeping complete versioned file names. |
| v1.3.0 | 2026-06-01 | Added explicit Skill layers, categories, parent-child hierarchy, dependency rules, and standalone-use rules. |
| v1.2.0 | 2026-06-01 | Removed `.codex/skills/` and flattened all Skill documents into fully named Markdown files under `.codex/`. |
| v1.1.0 | 2026-06-01 | Flattened the previous nested Add-on directory structure and synchronized AGENTS routing paths. |

## Pre-task Routing Output

Before starting any task, Codex must output:

1. Task Type
2. Required Skills
3. Skill Execution Order
4. Skills Not Needed
5. Missing Inputs
6. Expected Outputs

## Quick Local Startup Skill

| Skill | Path | Trigger | Required Outputs | Hard Rules |
|---|---|---|---|---|
| Quick Local Expo Demo Startup Skill | `.codex/skills/l0-utility-startup/quick-local-expo-demo-startup-skill-v1.3.0.md` | Quick Expo/Metro startup, local app demo startup, mobile phone demo, QR scan preview, `start expo`, `run app`, `local demo`, `phone preview` | Project root and Expo dependency check, port `8081` check, existing service decision, startup script audit, default command `npm run dev:app`, LAN mode, local Metro address, phone demo instructions, blockers and next-stage decision | Check port `8081` before startup. Reuse existing Expo/Metro service. Use `npm run dev:app` when no Expo/Metro service is running. Default to LAN. Do not allow automatic port drift, default to tunnel, silently kill port owners, or treat LAN/tunnel URLs as stable fixed links. |

## Core Skills

| Skill | Path | Trigger | Required Outputs | Hard Rules |
|---|---|---|---|---|
| Product Engineering Skill | `.codex/skills/l1-core/product-engineering/ai-product-production-delivery-skill-v3.0.0-l5.md` | Product requirements, business requirements, product scope, user roles, permission matrix, state machine, Page Contract, API Contract, error codes, risk/compliance rules, traceability, test case mapping, release decision, production product delivery package | Product Kernel, Module Contract, Business Rule Matrix, RBAC Policy, State Machine, Page Contract, API Draft, Error Code Mapping, Traceability Matrix, Test Case Mapping, QA Gate, Release Decision | Do not generate UI before Page Contract is clear. Do not assume business rules silently. Missing rules must be assumptions or blockers. Do not bypass Product Skill for business logic, permissions, state, risk, API, or compliance. |
| Design System Engineering Skill | `.codex/skills/l1-core/design-system-engineering/design-system-engineering-skill-v3.0.0-l5.md` | Design tokens, variables, Component Manifest, business components, icon registry, pattern registry, theme/brand/density/platform modes, CSS variables, Tailwind mapping, React/Vue mapping, Design System QA, production design-system governance | tokens.json, component-manifest.json, business-component-manifest.json, icon-registry.json, pattern-registry.json, ai-readable-index.json, code mapping, QA Gate | Do not create random visual styles or one-off page components. Do not hardcode color, spacing, radius, shadow, typography, or icon style. All UI must bind to tokens and registered components. If icons are involved, also use Icon Governance. |
| UI Build Production Skill | `.codex/skills/l1-core/ui-build-production/ui-build-production-skill-v3.0.0-l5.md` | Building App/H5/Web/Admin pages, HTML/React/Vue UI output, state matrix, interaction flow, responsive behavior, visual QA, dev handoff, page implementation | Page implementation, State Matrix, Interaction Map, Token Usage Report, Component Usage Report, Visual QA Report, Dev Handoff, Release Decision | UI Build must consume Page Contract, tokens.json, component-manifest.json, pattern-registry.json, platform rules, UX Gate when available, copy package when copy is involved, and icon registry when icons are involved. Do not build static demo pages, bypass Page Contract/Design System, generate random styles, or mark production-ready without QA. |

## Add-on Skills

| Add-on | Parent | Path | Trigger | Required Outputs | Hard Rules |
|---|---|---|---|---|---|
| Reference Adaptation Add-on | UI Build Production | `.codex/skills/l2-addons/ui-build-governance/ui-reference-adaptation-add-on-skill-v1.0.0-l5.md` | Mobbin reference, app/web screenshot, competitor UI, Dribbble, Behance, Figma Community reference, "参考这个页面风格", "借鉴这个页面", "复刻这个 UI 风格", "按照这个截图优化 UI" | Visual DNA, Similarity Risk Checklist, Token Mapping, Component Mapping, Pattern Mapping, Business Adaptation, UI Build Reference Input | Do not copy reference UI directly. Do not copy logo, brand color, original icon, original copywriting, proprietary illustration, pixel-level layout, or trade dress. Output is only UI Build Reference Input. Final UI still goes through Product + Design System + UI Build. If reference contains icons, use Icon Governance. If reference contains copy, use Financial Copy. |
| UX Interaction Quality Gate Add-on | UI Build Production | `.codex/skills/l2-addons/ui-quality-gates/ux-interaction-quality-gate-skill-v1.0.0-l5.md` | UX review, task flow, interaction quality, error recovery, feedback quality, platform behavior, accessibility baseline, financial UX risk, cognitive load, release readiness, "是否符合国际 UX 标准", "检查交互是否合理", "优化用户体验" | UX Task Flow Report, Interaction Review Report, Feedback Recovery Report, Accessibility Checklist, Financial UX Risk Report, UX Quality Score, Severity: Blocker/Critical/Major/Minor, Decision: ux_ready/conditional_ready/major_fix_required/blocked | Any Blocker or Critical UX issue prevents production delivery. Do not mark UX ready if users cannot complete the core task or error recovery is missing. Do not weaken financial risk information for visual simplicity. UX Gate must run before production handoff for high-risk financial flows. |
| Financial Copy & Localization Add-on | UI Build Production | `.codex/skills/l2-addons/ui-build-governance/financial-ux-copy-localization-governance-skill-v1.0.0-l5.md` | UX copy, English copy, Indonesian localization, Bahasa Indonesia, financial terminology, Forex/CFD/derivatives/broker terminology, CTA wording, error/toast/dialog/empty/success/failed state copy, risk disclosure, agreement copy, KYC copy, deposit/withdrawal copy, i18n keys, compliance-sensitive copy | UX Copy Table, English Copy, Indonesian Copy, i18n Keys, Terminology Mapping, Risk Copy Review, CTA Safety Review, Copy QA Score, Release Decision | Do not promise profits or use "risk-free", "guaranteed profit", "easy money", "safe investment", or similar claims. Do not weaken risk disclosures, translate financial terms inconsistently, copy competitor wording, or hardcode user-facing copy without i18n keys. Mark high-risk copy for native/compliance review when needed. |
| Icon Asset Library Governance Add-on | Design System Engineering | `.codex/skills/l2-addons/design-system-governance/local-icon-asset-library-governance-skill-v1.1.0-l5.md` | Icon library, financial icons, App/Web/Admin icons, navigation icons, system operation icons, Phosphor Icons, Remix Icon, Lucide, icon-registry.json, icon naming, SVG quality, Icon QA, "图标质量低", "搭建金融图标库" | Icon taxonomy, icon-registry.schema.json, icon-registry.json, Icon naming rules, source/license metadata, token binding, React/Vue mapping, Figma mapping, Icon QA Report, Release Decision | Use Phosphor as primary library, Remix as financial/business supplement, Lucide as linear system-operation supplement, and custom icons only when approved libraries cannot express the business meaning. Do not randomly draw icons, use unknown-source SVG, copy competitor icons, use unregistered production icons, hardcode icon color/size, or mix libraries without registry approval. |

## Execution Order

### Full Product Delivery

1. Product Skill
2. Design System Skill
3. Financial Copy Add-on, if user-facing copy is involved
4. Icon Governance Add-on, if icons are involved
5. Reference Adaptation Add-on, if reference material is provided
6. UI Build Skill
7. UX Interaction Quality Gate
8. Final QA / Release Decision

### Page-only Work

1. Confirm or generate Page Contract
2. Confirm Design System inputs
3. Use Reference Add-on if screenshots or Mobbin references exist
4. Use Financial Copy Add-on if user-facing copy is involved
5. Use Icon Governance Add-on if icons are involved
6. Use UI Build Skill
7. Use UX Gate before delivery

### Design System Work

1. Use Design System Skill
2. Use Icon Governance Add-on if icons are involved
3. Output QA Gate and migration notes

### Copy / Localization Work

1. Use Financial Copy & Localization Add-on
2. If copy affects UX task flow, use UX Gate
3. If copy affects business or risk rule, use Product Skill

### Icon Work

1. Use Design System Skill
2. Use Icon Governance Add-on
3. Update icon-registry.json
4. Output Icon QA Report

## Completion Standard

Codex must report:

- Which skill was used
- Why it was used
- What inputs were consumed
- What outputs were generated
- What QA Gate was checked
- Whether the result can enter the next stage
- Any blockers, assumptions, unresolved risks, or required human review

## Trigger Examples

| Request | Route |
|---|---|
| "梳理 KYC 模块、权限、页面契约和测试映射" | Product Skill |
| "建立 broker 设计 token、组件 manifest 和 pattern registry" | Design System Skill |
| "治理金融 icon registry，指定 Phosphor/Remix/Lucide 映射" | Design System Skill -> Icon Governance Add-on |
| "根据 page contract 做一个可运行 React 页面" | UI Build Skill |
| "参考 Mobbin 这个交易页面风格，但不要抄" | Reference Add-on -> Product/Design System inputs check -> UI Build Skill |
| "检查这个 H5 提现流程的交互、错误恢复和是否能发布" | UI Build Skill -> UX Gate Add-on |
| "把入金/出金页面文案做英文和印尼语本地化，含 i18n key" | Financial Copy Add-on; add UI Build/UX Gate if the copy is consumed by page delivery |
| "从业务需求到页面再到 QA 交付整包" | Product Skill -> Design System Skill -> conditional Add-ons -> UI Build Skill -> UX Gate |

## Overlap And Risk Notes

- UX Gate and UI Build both touch interaction quality; UI Build implements states and interactions, UX Gate validates task completion, recovery, accessibility, and release readiness.
- Financial Copy and Product Risk Rules both touch risk disclosure; Product Skill defines risk rules, Financial Copy governs wording, localization, terminology, and copy QA.
- Icon Governance and Design System both touch icon registry; Design System owns system governance, Icon Governance owns icon taxonomy, source strategy, license, semantic mapping, and Icon QA.
- Reference Adaptation and UI Build both touch visual style; Reference Adaptation only extracts safe Visual DNA and mappings, while UI Build produces the final UI.
- Over-engineering risk comes from loading the full chain for tiny tasks, treating Add-ons as Core Skills, or forcing full delivery packages for small copy/icon changes. Control this by using the smallest valid route and escalating only when the task touches business risk, production release, cross-module contracts, or high-risk financial UX.

## Non-routing Rules

- Do not place Add-on Skills as peer Core Skills.
- Do not use Add-on Skills to replace Product Kernel, Page Contract, Design System, or UI Build output.
- Do not silently invent missing product, compliance, legal, risk, localization, or design-system inputs.
- When Codex creates, updates, or proposes any automation / recurring task / scheduled task, the task name, description, prompt summary, status note, and user-facing explanation must be written in Chinese by default. Do not output English descriptions unless the user explicitly asks for English.
- For Expo code changes, read the exact versioned docs at `https://docs.expo.dev/versions/v54.0.0/` before writing code.
