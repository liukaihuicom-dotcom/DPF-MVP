# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

# Codex Skill Routing Rules

This project uses a production-grade AI product design engineering skill system.

Codex must not read every skill by default. Codex must select the right skill based on the task type.

Before starting any task, Codex must classify the task and output:

1. Task Type
2. Required Skills
3. Skill Execution Order
4. Skills Not Needed
5. Missing Inputs
6. Expected Outputs

# Codex Plan And Automation Language Rule

Codex 在对话中提供计划、计划任务模式说明、执行计划、状态说明、面向用户的解释、自动化、提醒、监控、定时执行任务时，必须统一使用中文描述，不要使用英文或其他语言，除非用户明确要求使用其他语言。

Codex 创建、更新或提议任何自动化、周期任务、提醒、监控、计划任务时，任务名称、任务描述、Prompt 摘要、状态说明和面向用户的解释默认必须使用中文。除非用户明确要求英文，否则不要输出英文描述。

## 0. Quick Local Expo Demo Startup Skill

Use:

`.codex/skills/quick-local-expo-demo-startup/SKILL.md`

Priority:

- This Skill has first routing priority for quick Expo / Metro startup, local app demo startup, and mobile phone demo requests.
- Use this Skill when the user asks to start the app, start Expo, start a local service, run the app, or experience the demo on a phone.
- The goal is quick Expo service reuse or startup, not complex startup governance.
- When this Skill is triggered, read it before modifying startup scripts, checking ports, or running local dev servers.
- If the request involves Expo code changes beyond local startup governance, also follow the Expo v54 documentation rule before writing code.

Trigger when the task involves:

- 启动 app
- 启动 App
- 启动 Expo
- 启动 expo
- 启动 Metro
- 启动本地 demo
- 启动本地演示
- 启动本地服务
- 跑一下 app
- 跑一下 Expo
- 手机体验 demo
- 手机体验 Demo
- 手机扫码体验
- 手机上看 demo
- 打开 app demo
- 打开本地 app
- 本地运行 app
- 本地启动服务
- 电脑终端启动 expo
- 终端启动 Expo
- 快速启动服务
- 快速预览 App
- start app
- start expo
- expo start
- start metro
- run app
- run expo
- local demo
- mobile demo
- phone preview
- scan QR
- start local service

Required outputs:

- Project root and Expo dependency check
- Port `8081` check before startup
- Existing service decision: reuse Expo / Metro if already running, otherwise stop if occupied by a non-Expo service
- Startup script audit and required package.json updates
- Default command: `npm run dev:app`
- Default mode: LAN for phone demo support
- Local Metro address: `http://localhost:8081`
- Phone demo instructions: same Wi-Fi and scan terminal Expo QR Code with Expo Go or the project Dev Build
- Current mode, port, tunnel status, blockers, and next-stage decision

Hard rules:

- Check whether Expo / Metro is already running on `8081` before starting.
- Reuse an existing Expo / Metro service instead of starting a duplicate.
- If no Expo / Metro service is running, use `npm run dev:app`.
- `npm run dev:app` must default to LAN mode.
- Do not allow automatic port drift from `8081`.
- Do not default to tunnel.
- Do not silently kill port-owning processes.
- Do not treat LAN IP or tunnel URLs as stable fixed links.

## 1. Product Engineering Skill

Use:

`.codex/skills/ai-product-production-delivery/SKILL.md`

Trigger when the task involves:

- Product requirements
- Business requirements
- Product scope
- User roles
- Permission matrix
- State machine
- Page Contract
- API Contract
- Error codes
- Risk / compliance rules
- Traceability
- Test case mapping
- Release decision
- Production product delivery package

Required outputs:

- Product Kernel
- Module Contract
- Business Rule Matrix
- RBAC Policy
- State Machine
- Page Contract
- API Draft
- Error Code Mapping
- Traceability Matrix
- Test Case Mapping
- QA Gate
- Release Decision

Hard rules:

- Do not generate UI before Page Contract is clear.
- Do not assume business rules silently.
- Missing business rules must be recorded as assumptions or blockers.
- Do not bypass Product Skill when the task involves business logic, permissions, state, risk, API, or compliance.

## 2. Design System Engineering Skill

Use:

`.codex/skills/design-system-engineering/SKILL.md`

Trigger when the task involves:

- Design tokens
- Variables
- Component Manifest
- Business components
- Icon registry
- Pattern registry
- Theme / brand / density / platform modes
- CSS variables
- Tailwind mapping
- React / Vue mapping
- Design System QA
- Production design system governance

Required outputs:

- tokens.json
- component-manifest.json
- business-component-manifest.json
- icon-registry.json
- pattern-registry.json
- ai-readable-index.json
- code mapping
- QA Gate

Hard rules:

- Do not create random visual styles.
- Do not create one-off page components.
- Do not hardcode color, spacing, radius, shadow, typography, or icon style.
- All UI must bind to tokens and registered components.
- If icons are involved, also use Icon Asset Library Governance Skill.

## 3. UI Build Production Skill

Use:

`.codex/skills/ui-build-production/SKILL.md`

Trigger when the task involves:

- Building App / H5 / Web / Admin pages
- HTML / React / Vue UI output
- State matrix
- Interaction flow
- Responsive behavior
- Visual QA
- Dev handoff
- Page implementation

UI Build must consume:

- Page Contract
- tokens.json
- component-manifest.json
- pattern-registry.json
- platform rules
- UX Gate result when available
- Copy package when user-facing copy is involved
- Icon registry when icons are involved

Required outputs:

- Page implementation
- State Matrix
- Interaction Map
- Token Usage Report
- Component Usage Report
- Visual QA Report
- Dev Handoff
- Release Decision

Hard rules:

- Do not build static demo pages.
- Do not bypass Page Contract.
- Do not bypass Design System.
- Do not generate random one-off styles.
- Do not mark production-ready without QA.

## 4. Design Public Resource Package Governance Add-on

Use:

`.codex/skills/design-system-engineering/addons/design-public-resource-package-governance/SKILL.md`

Trigger when the task involves:

- 变量系统
- 组件库
- 业务组件
- 通用模块
- 页面模板
- 弹框
- 流程
- 状态
- 图标
- 插图
- 文案
- 多语言
- Pattern 复用
- 共享资产同步
- 版本迁移
- 影响范围分析
- 开发交付资源治理

Required outputs:

- Public Resource QA Report
- Page Readiness Matrix
- Change Impact Report
- Migration Plan, when needed
- Release Decision

Hard rules:

- 页面必须引用公共资源，不允许复制公共资产实现。
- 新建页面前必须检查 `public-asset-registry`、`pattern-registry`、`component-manifest`、`icon-registry`、`asset-dependency-graph`。
- 同类模块出现 2 次以上，必须抽取为公共资源。
- 修改公共资源前必须输出 Change Impact Report。
- 破坏性变更必须输出 Migration Plan。
- 废弃资产必须有 Replacement。
- 图标必须遵循 Local Icon Asset Library Governance Skill。
- 最后必须输出 Public Resource QA Report、Page Readiness Matrix 和 Release Decision。

## 5. Reference Adaptation Add-on

Use:

`.codex/skills/ui-build-production/addons/reference-adaptation/SKILL.md`

Trigger when the task includes:

- Mobbin reference
- App screenshot
- Web screenshot
- Competitor UI
- Dribbble
- Behance
- Figma Community reference
- "参考这个页面风格"
- "借鉴这个页面"
- "复刻这个 UI 风格"
- "按照这个截图优化 UI"

Required outputs:

- Visual DNA
- Similarity Risk Checklist
- Token Mapping
- Component Mapping
- Pattern Mapping
- Business Adaptation
- UI Build Reference Input

Hard rules:

- Do not copy the reference UI directly.
- Do not copy logo, brand color, original icon, original copywriting, proprietary illustration, pixel-level layout, or trade dress.
- The add-on output is only UI Build Reference Input.
- Final UI must still be generated through Product Skill + Design System Skill + UI Build Skill.
- If reference contains icons, use Icon Governance Skill.
- If reference contains copy, use Financial Copy & Localization Skill.

## 6. UX Interaction Quality Gate Add-on

Use:

`.codex/skills/ui-build-production/addons/ux-interaction-quality-gate/SKILL.md`

Trigger when the task involves:

- UX review
- Task flow
- Interaction quality
- Error recovery
- Feedback quality
- Platform behavior
- Accessibility baseline
- Financial UX risk
- Cognitive load
- Release readiness
- "是否符合国际 UX 标准"
- "检查交互是否合理"
- "优化用户体验"

Required outputs:

- UX Task Flow Report
- Interaction Review Report
- Feedback Recovery Report
- Accessibility Checklist
- Financial UX Risk Report
- UX Quality Score
- Severity: Blocker / Critical / Major / Minor
- Decision: ux_ready / conditional_ready / major_fix_required / blocked

Hard rules:

- Any Blocker or Critical UX issue prevents production delivery.
- Do not mark UX ready if the user cannot complete the core task.
- Do not mark UX ready if error recovery is missing.
- Do not weaken financial risk information for visual simplicity.
- UX Gate must run before production handoff for high-risk financial flows.

## 6A. Elite UX/UI Remediation Board Add-on

Use:

`.codex/skills/ui-build-production/addons/elite-ux-ui-remediation-board/SKILL.md`

This Skill is mandatory when the task involves:

- 顶尖 UX/UI 审核
- UI 质量修复
- 用户心理
- 真实使用场景
- 金融 App 信任感
- 明确 UI 修改依据
- L5 设计质量判断
- 交付前设计门禁
- 页面像 demo
- 金融产品视觉可信感不足
- Redline Report
- Fix Card
- 100 分 L5 门禁

Required outputs:

- Evidence Chain
- Real User Psychology Simulation
- Real Usage Scenario Simulation
- 100-Point L5 Gate Score
- Redline Items for every deduction
- Fix Cards for every Redline Item
- Fix Order
- Final decision: `l5_ready` only at 100/100 and 0 Blocker / 0 Critical / 0 Major

Hard rules:

- Do not modify pages before this Skill collects and outputs the evidence chain.
- Do not start with visual beautification.
- Simulate real user psychology and real usage scenarios before scoring.
- Score using the 100-point L5 gate.
- Every deduction must output a Redline Item.
- Every Redline Item must be converted into a Fix Card.
- Every Fix Card must include Target Layer, Target Files, Exact Action, and Acceptance Criteria.
- Output Fix Order before implementation.
- Do not output vague suggestions.
- System-layer issues must be handled before page-layer issues.
- Do not output `l5_ready` unless the score is 100/100 and there are 0 Blocker / 0 Critical / 0 Major issues.

## 6B. App Modal & Overlay System Governance Add-on

Use:

`.codex/skills/ui-build-production/addons/app-modal-overlay-system-governance/SKILL.md`

This Skill is mandatory when the task involves:

- Toast
- Snackbar
- Dialog
- Action Sheet
- Picker Sheet
- Bottom Sheet
- Modal Page
- Full-screen Modal
- Modal Stack
- Modal Queue
- 全局弹框
- 半弹框
- 弹框路由
- 资金弹框
- KYC 弹框
- 安全弹框
- 合规弹框
- App 弹框设计
- 弹框系统审计
- Overlay / Modal System

Required outputs:

- Overlay Type Decision
- Overlay / Modal Component Source Check
- Redline Items for every issue
- Fix Cards for every Redline Item
- Page Overlay Matrix
- Overlay System L5 Report
- 100-Point Overlay L5 Gate Score
- Final decision: `l5_overlay_ready` only at 100/100 and 0 Blocker / 0 Critical / 0 Major

Hard rules:

- Do not let pages write private overlay or modal implementations.
- All overlays and modals must come from public overlay / modal components.
- Complex flows must use Modal Page / Full-screen Modal / Modal Stack.
- Global blocking overlays must enter Modal Queue.
- All overlay and modal styles must use design tokens.
- Must verify Android back, dirty state, keyboard, safe area, and accessibility.
- Funding / KYC / security / compliance scenarios must not use Toast or ordinary Bottom Sheet to carry risk.
- Every issue must output a Redline Item and Fix Card.
- Each Fix Card must include Target Layer, Target Files, Exact Action, and Acceptance Criteria.
- Final output must include Page Overlay Matrix and Overlay System L5 Report.
- Do not output `l5_overlay_ready` unless the score is 100/100 and there are 0 Blocker / 0 Critical / 0 Major issues.

## 6C. Page Visual Rhythm & Spacing Governance Add-on

Use:

`.codex/skills/ui-build-production/addons/page-visual-rhythm-spacing-governance/SKILL.md`

This Skill is mandatory when the task involves:

- 页面整体风格
- 间距治理
- 布局节奏
- 页面一致性
- UI 质量
- 页面像 demo
- 视觉密度
- 卡片层级
- 排版层级
- Surface 系统
- 跨页面视觉治理
- visual rhythm
- spacing governance
- layout density
- surface hierarchy

Required outputs:

- Page Visual Rhythm Matrix
- Redline Items for every visual rhythm / spacing issue
- Fix Cards for every Redline Item
- Fix Order
- 100-Point Visual Rhythm L5 Gate Score
- Final decision: `visual_rhythm_l5_ready` only at 100/100 and 0 Blocker / 0 Critical / 0 Major

Hard rules:

- Do not randomly adjust px values.
- All spacing, radius, shadow, color, and typography must use design tokens.
- Fix system layers first in this order: token → component → pattern → public resource → page.
- If the same visual issue appears on 2 or more pages, fix it at the shared resource layer.
- Output Page Visual Rhythm Matrix.
- Every issue must output a Redline Item.
- Every Redline Item must be converted into a Fix Card.
- Each Fix Card must include Target Layer, Target Files, Exact Action, and Acceptance Criteria.
- Output Fix Order before implementation.
- Do not output `visual_rhythm_l5_ready` unless the score is 100/100 and there are 0 Blocker / 0 Critical / 0 Major issues.

## 7. Financial Copy & Localization Add-on

Use:

`.codex/skills/ui-build-production/addons/financial-copy-localization/SKILL.md`

Trigger when the task involves:

- UX copy
- English copy
- Indonesian localization
- Bahasa Indonesia
- Financial terminology
- Forex / CFD / derivatives / broker terminology
- CTA wording
- Error copy
- Toast copy
- Dialog copy
- Empty state copy
- Success / failed state copy
- Risk disclosure
- Agreement copy
- KYC copy
- Deposit / withdrawal copy
- i18n keys
- Compliance-sensitive copy

Required outputs:

- UX Copy Table
- English Copy
- Indonesian Copy
- i18n Keys
- Terminology Mapping
- Risk Copy Review
- CTA Safety Review
- Copy QA Score
- Release Decision

Hard rules:

- Do not promise profits.
- Do not use "risk-free", "guaranteed profit", "easy money", "safe investment", or similar claims.
- Do not weaken risk disclosures.
- Do not translate financial terms inconsistently.
- Do not directly copy competitor wording.
- Do not hardcode user-facing copy without i18n keys.
- High-risk copy must be marked for native or compliance review when needed.

## 8. Icon Asset Library Governance Add-on

Use:

`.codex/skills/design-system-engineering/addons/icon-asset-library-governance/SKILL.md`

Trigger when the task involves:

- Icon library
- Financial icons
- App / Web / Admin icons
- Navigation icons
- System operation icons
- Phosphor Icons
- Remix Icon
- Lucide
- icon-registry.json
- Icon naming
- SVG quality
- Icon QA
- "图标质量低"
- "搭建金融图标库"

Source strategy:

1. Phosphor Icons as primary library
2. Remix Icon as financial / business supplement
3. Lucide as linear system-operation supplement
4. Custom icon only when approved libraries cannot express the business meaning

Required outputs:

- Icon taxonomy
- icon-registry.schema.json
- icon-registry.json
- Icon naming rules
- Source and license metadata
- Token binding
- React / Vue mapping
- Figma mapping
- Icon QA Report
- Release Decision

Hard rules:

- Do not let Codex randomly draw icons.
- Do not use unknown-source SVG.
- Do not copy competitor icons.
- Do not use unregistered icons in production UI.
- Do not hardcode icon color or size.
- Do not mix Phosphor, Remix, and Lucide without registry approval.
- All icons must pass semantic, visual, technical, token, accessibility, and license QA.

## UI Quality Governance Mode

Trigger this mode when the user says:

- UI 质量不高
- 页面不好看
- 优化 UI
- 提升视觉质量
- 高质量 UI
- 生产级 UI
- 页面像 demo
- 金融产品不够专业
- 设计风格不统一
- 视觉质感差
- 顶尖 UX/UI 审核
- UI 质量修复
- 用户心理
- 真实使用场景
- 金融 App 信任感
- 明确 UI 修改依据
- L5 设计质量判断
- 交付前设计门禁
- Toast
- Snackbar
- Dialog
- Action Sheet
- Picker Sheet
- Bottom Sheet
- Modal Page
- Full-screen Modal
- Modal Stack
- Modal Queue
- 全局弹框
- 半弹框
- 弹框路由
- 资金弹框
- KYC 弹框
- 安全弹框
- 合规弹框
- App 弹框设计
- 弹框系统审计
- 页面整体风格
- 间距治理
- 布局节奏
- 页面一致性
- 视觉密度
- 卡片层级
- 排版层级
- Surface 系统
- 跨页面视觉治理

Codex must not directly beautify the page.

Codex must run UI quality governance in this order:

1. Use Product Skill to confirm Page Contract and avoid changing business flow.
2. Use Design System Skill to confirm tokens, components, patterns, and layout rules.
3. Use Design Public Resource Package Governance Add-on to confirm reusable public assets and prevent page-level copies.
4. Use App Modal & Overlay System Governance Add-on when Toast, Snackbar, Dialog, Sheet, Modal Page, Full-screen Modal, Modal Stack, Modal Queue, global overlays, funding/KYC/security/compliance overlays, app modal design, or overlay system audit is involved.
5. Use Page Visual Rhythm & Spacing Governance Add-on when page-wide style, spacing, layout rhythm, consistency, visual density, card hierarchy, typography hierarchy, surface system, or cross-page visual governance is involved.
6. Use Elite UX/UI Remediation Board Add-on when the task involves top-tier UX/UI audit, UI remediation, user psychology, real scenarios, financial trust, explicit UI rationale, L5 design judgment, or pre-delivery design gate.
7. Use Reference Adaptation Add-on if screenshots, Mobbin, or competitor references are provided.
8. Use Icon Governance Add-on if icons are involved.
9. Use Financial Copy & Localization Add-on if user-facing copy is involved.
10. Use UI Build Skill to refactor the page only after evidence, Redline Items, Fix Cards, Fix Order, any required Overlay Matrix, and any required Page Visual Rhythm Matrix are available.
11. Use UX Interaction Quality Gate to audit task flow, feedback, error recovery, accessibility, and financial UX risk.
12. Capture or generate a preview screenshot / visual snapshot for review.
13. Score the page using UI Quality Scorecard.
14. If score < 85 or any Blocker / Critical exists, fix and re-run QA.

Required outputs:

- UI Audit Report
- Evidence Chain
- Real User Psychology Simulation
- Real Usage Scenario Simulation
- Redline Items
- Fix Cards with Target Layer, Target Files, Exact Action, and Acceptance Criteria
- Fix Order
- 100-Point L5 Gate Score
- Overlay Type Decision
- Page Overlay Matrix
- Overlay System L5 Report
- 100-Point Overlay L5 Gate Score
- Page Visual Rhythm Matrix
- 100-Point Visual Rhythm L5 Gate Score
- Page Refactor Plan
- Updated Page Implementation
- Preview Screenshot or Visual Snapshot
- State Matrix
- Token Usage Report
- Component Usage Report
- Public Resource QA Report
- Page Readiness Matrix
- Pattern Usage Report
- Icon Usage Report
- Copy Table / i18n keys
- Interaction Map
- UX QA Report
- Visual QA Score
- Dev Handoff
- Release Decision

UI Quality Scorecard:

- Information hierarchy: 12
- Visual consistency: 10
- Token binding: 10
- Component reuse: 10
- Pattern usage: 8
- Icon quality: 8
- Copy quality: 8
- Interaction feedback: 10
- UX task success: 10
- Financial trust: 8
- Dev handoff clarity: 6

Decision rules:

- Score >= 90: Production UI Ready
- Score 85-89: Conditional Ready
- Score 75-84: Major Fix Required
- Score 60-74: Critical Fix Required
- Score < 60: Blocked

Hard rules:

- Do not change business flow unless Product Skill confirms it.
- Do not modify pages before evidence, Redline Items, Fix Cards, and Fix Order are produced when Elite UX/UI Remediation Board is triggered.
- Do not let pages write private overlay or modal implementations when App Modal & Overlay System Governance is triggered.
- Do not use Toast or ordinary Bottom Sheet to carry funding, KYC, security, or compliance risk.
- Do not randomly adjust px values when Page Visual Rhythm & Spacing Governance is triggered.
- Fix visual rhythm issues by system layer first: token → component → pattern → public resource → page.
- If the same visual issue appears on 2 or more pages, fix it at the shared resource layer.
- Do not bypass Page Contract.
- Do not create random visual styles.
- Do not copy public asset implementations into pages.
- Do not skip public-asset, pattern, component, icon, and dependency-graph checks for new pages.
- Do not hardcode color, spacing, radius, typography, shadows, icons, or copy.
- Do not use unregistered icons.
- Do not use user-facing copy without i18n keys.
- Do not directly copy reference UI.
- Do not mark production-ready if UI Quality Score is below 85.
- Do not deliver if there are Blocker or Critical issues.
- Do not output `l5_ready` unless the Elite UX/UI Remediation Board score is 100/100 and there are 0 Blocker / 0 Critical / 0 Major issues.
- Do not output `l5_overlay_ready` unless the Overlay System L5 score is 100/100 and there are 0 Blocker / 0 Critical / 0 Major issues.
- Do not output `visual_rhythm_l5_ready` unless the Visual Rhythm L5 score is 100/100 and there are 0 Blocker / 0 Critical / 0 Major issues.

# Execution Order

## Local dev startup work

1. Use Quick Local Expo Demo Startup Skill first for app / Expo / phone demo startup requests.
2. Check project root, Expo dependency, and port `8081`.
3. If Expo / Metro is already running on `8081`, reuse the current service and do not start another one.
4. If no service is running on `8081`, run `npm run dev:app`.
5. Ensure `npm run dev:app` defaults to LAN mode for phone demo support.
6. Do not use tunnel unless the user explicitly asks for remote or cross-network access.
7. Output `http://localhost:8081`, phone same-Wi-Fi QR scan instructions, mode, tunnel status, blockers, and next-stage decision.

## Full product delivery

1. Product Skill
2. Design System Skill
3. Design Public Resource Package Governance Add-on, if variables, components, patterns, shared assets, migrations, or resource impact are involved
4. Financial Copy Add-on, if user-facing copy is involved
5. Icon Governance Add-on, if icons are involved
6. Reference Adaptation Add-on, if reference material is provided
7. App Modal & Overlay System Governance Add-on, if Toast, Snackbar, Dialog, Action Sheet, Picker Sheet, Bottom Sheet, Modal Page, Full-screen Modal, Modal Stack, Modal Queue, global overlays, funding/KYC/security/compliance overlays, app modal design, or overlay system audit is involved
8. Page Visual Rhythm & Spacing Governance Add-on, if page-wide style, spacing governance, layout rhythm, page consistency, visual density, card hierarchy, typography hierarchy, surface system, or cross-page visual governance is involved
9. Elite UX/UI Remediation Board Add-on, if top-tier UX/UI audit, UI quality remediation, user psychology, real usage scenarios, financial trust, explicit UI rationale, L5 design quality judgment, or pre-delivery design gate is involved
10. UI Build Skill
11. UX Interaction Quality Gate
12. Final QA / Release Decision

## Page-only work

1. Confirm or generate Page Contract
2. Confirm Design System inputs
3. Use Design Public Resource Package Governance Add-on to check public-asset-registry, pattern-registry, component-manifest, icon-registry, and asset-dependency-graph before building or changing a page
4. Use Reference Add-on if screenshots or Mobbin references exist
5. Use Financial Copy Add-on if user-facing copy is involved
6. Use Icon Governance Add-on if icons are involved
7. Use App Modal & Overlay System Governance Add-on before page edits if Toast, Snackbar, Dialog, Action Sheet, Picker Sheet, Bottom Sheet, Modal Page, Full-screen Modal, Modal Stack, Modal Queue, global overlays, funding/KYC/security/compliance overlays, app modal design, or overlay system audit is involved
8. Use Page Visual Rhythm & Spacing Governance Add-on before page edits if page-wide style, spacing governance, layout rhythm, page consistency, visual density, card hierarchy, typography hierarchy, surface system, or cross-page visual governance is involved
9. Use Elite UX/UI Remediation Board Add-on before page edits if the task involves top-tier UX/UI audit, UI quality remediation, user psychology, real usage scenarios, financial trust, explicit UI rationale, L5 design quality judgment, or pre-delivery design gate
10. Use UI Build Skill
11. Use UX Gate before delivery

## Design system work

1. Use Design System Skill
2. Use Design Public Resource Package Governance Add-on if variables, components, business components, patterns, shared assets, migrations, or impact analysis are involved
3. Use Icon Governance Add-on if icons are involved
4. Output QA Gate and migration notes

## Copy / localization work

1. Use Financial Copy & Localization Add-on
2. If copy affects UX task flow, use UX Gate
3. If copy affects business or risk rule, use Product Skill

## Icon work

1. Use Design System Skill
2. Use Icon Governance Add-on
3. Update icon-registry.json
4. Output Icon QA Report

# Completion Standard

Codex must report:

- Which skill was used
- Why it was used
- What inputs were consumed
- What outputs were generated
- What QA Gate was checked
- Whether the result can enter the next stage
- Any blockers, assumptions, unresolved risks, or required human review

# Non-routing Rules

- Do not place Add-on Skills as peer Core Skills.
- Do not use Add-on Skills to replace Product Kernel, Page Contract, Design System, or UI Build output.
- Do not silently invent missing product, compliance, legal, risk, localization, or design-system inputs.
- Codex 在对话中提供计划、计划任务模式说明、执行计划、状态说明、面向用户的解释、自动化、提醒、监控、定时执行任务时，必须统一使用中文描述，不要使用英文或其他语言，除非用户明确要求使用其他语言。
- Codex 创建、更新或提议任何自动化、周期任务、提醒、监控、计划任务时，任务名称、任务描述、Prompt 摘要、状态说明和面向用户的解释默认必须使用中文。除非用户明确要求英文，否则不要输出英文描述。
- For Expo code changes, read the exact versioned docs at `https://docs.expo.dev/versions/v54.0.0/` before writing code.
