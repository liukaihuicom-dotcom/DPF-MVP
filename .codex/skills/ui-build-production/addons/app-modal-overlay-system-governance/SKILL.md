---
name: app-modal-overlay-system-governance
description: 当任务涉及 App Toast、Snackbar、Alert Dialog、Action Sheet、Picker Sheet、Filter Sheet、Bottom Sheet、Form Sheet、Detail Sheet、Modal Page、Full-screen Modal、Modal Stack、Modal Queue、全局弹框、半弹框、弹框路由、弹框状态机、弹框组件库、弹框审计、资金/KYC/安全/合规弹框、移动端 Overlay Design System 时使用。本 Skill 用于让 Codex 以 L5 生产级标准设计、审计、重构和交付长期可维护的 App Overlay / Modal System。
---

# App Modal & Overlay System Governance Skill v2.0.0-L5 中文版

> 文件路径：`.codex/skills/ui-build-production/addons/app-modal-overlay-system-governance/SKILL.md`
> 版本：`v2.0.0-L5 Production Locked`
> 等级：`L5 Add-on / Production App Modal & Overlay System Governance Skill`
> 适用范围：App / H5 / WebView / 小程序 / 移动端金融产品
> 父级 Skill：`UI Build Production Skill v3.0.0-L5`
> 关联 Skill：Design System、Design Public Resource Package、Elite UX/UI Remediation Board、UX Interaction Quality Gate、Local Icon、Financial Copy & Localization。

---

## 0. v2.0.0 升级目标

本 Skill 基于原 `App 弹框系统 L5 Skill` 升级。原版本已经覆盖弹框类型、Modal Stack、Modal Queue、Token、z-index、动效、Dirty State、Android 返回键、Safe Area、键盘适配、可访问性、金融/Broker 场景和审计流程。

v2.0.0 补齐 L5 生产级缺口：

| 升级项 | 目的 |
|---|---|
| Overlay Registry | 所有弹框资产必须登记、可追踪、可复用 |
| Overlay Type Decision Engine | Codex 必须按场景选择正确弹框类型 |
| Component Contract | 每类弹框必须有 props、state、events、tokens、a11y 契约 |
| Modal State Machine | 规范 open / close / back / submit / dirty / loading / error |
| Modal Queue Algorithm | 明确全局弹框优先级、去重、延迟、阻断规则 |
| Route Contract | Modal Page / Full-screen Modal 必须路由化、可回退、可保留状态 |
| User Psychology Rules | 从打断成本、任务压力、资金焦虑、信任建立判断弹框 |
| Financial Risk Gate | 资金、KYC、安全、合规弹框必须走高风险规则 |
| Redline + Fix Card | 审计问题必须转成可执行整改任务 |
| Page Overlay Matrix | 全站页面必须输出弹框使用矩阵 |
| Automated QA Scripts | 检查自定义弹框、随机 z-index、inline style、非法嵌套 |
| 100-Point Gate | 只有 100 分且 0 Blocker / Critical / Major 才允许 L5 |

---

## 1. 核心定位

本 Skill 不是“弹框视觉规范”。本 Skill 是 **App Overlay / Modal 基础设施治理 Skill**。

它负责：

```text
弹框类型选择
+ 弹框组件契约
+ 弹框路由
+ Modal Stack
+ Modal Queue
+ Dirty State
+ Android Back
+ Keyboard Safe
+ Safe Area
+ Accessibility
+ Design Token
+ Finance Risk
+ Full-site Audit
+ Redline Fix
+ Release Gate
```

它禁止：

```text
页面私自写弹框
页面复制弹框组件
页面自定义 z-index
页面自定义遮罩、圆角、阴影、动画
Bottom Sheet 叠 Bottom Sheet
Alert 叠 Alert
用 Toast 承载高风险信息
用 Bottom Sheet 承载复杂金融流程
```

---

## 2. 用户心理与弹框使用原则

弹框的本质是“打断”。L5 弹框系统必须先判断用户心理，而不是先选组件。

| 用户心理 | 场景 | 弹框设计要求 |
|---|---|---|
| 轻反馈期待 | 保存、复制、刷新 | Toast / Snackbar，不阻断 |
| 快速选择 | 账户、币种、语言、日期 | Picker Sheet，短路径 |
| 局部任务 | 筛选、短表单、简短详情 | Bottom Sheet / Form Sheet / Detail Sheet |
| 决策风险 | 删除、退出、取消、危险操作 | Alert Dialog |
| 资金焦虑 | 入金、出金、转账、手续费 | Modal Page + 明确信息 |
| 合规压力 | KYC、协议、视频认证 | Full-screen Modal / Modal Stack |
| 错误挫败 | 失败、驳回、网络异常 | 说明原因 + 恢复路径 |
| 安全敏感 | PIN、OTP、设备、登录失效 | 阻断清晰，不营销打断 |
| 多步骤认知负荷 | 添加银行卡、Partner 申请 | Modal Page / Full-screen Modal |

核心原则：

```text
低风险用轻弹框
中风险用 Sheet
高风险用 Dialog / Modal Page
复杂流程必须路由化
全局阻断必须队列化
```

---

## 3. Overlay Type Decision Engine

Codex 在实现任何弹框前，必须先回答以下 12 个问题：

| 问题 | 决策影响 |
|---|---|
| 这是反馈、选择、确认、输入、详情，还是流程？ | 决定基础类型 |
| 是否阻断用户当前任务？ | 决定 Toast / Sheet / Dialog / Modal |
| 是否涉及资金、交易、KYC、安全、合规？ | 决定风险等级 |
| 是否需要下一层页面？ | 决定 Modal Stack |
| 是否需要返回上一层？ | 决定路由化 |
| 是否有未保存输入？ | 决定 Dirty State |
| 是否超过 3 个字段？ | 决定是否升级 Modal Page |
| 内容是否超过一屏？ | 决定是否页面化 |
| 是否需要搜索 / 筛选 / 多选？ | 决定 Picker / Filter 行为 |
| 是否可能与其他全局弹框冲突？ | 决定 Modal Queue |
| 是否需要 Android back / keyboard / safe area？ | 决定平台适配 |
| 是否已有公共组件可复用？ | 决定禁止自建 |

### 3.1 类型选择表

| 场景 | 正确类型 | 禁止类型 |
|---|---|---|
| 复制成功 / 保存成功 | Toast | Alert Dialog |
| 删除后撤销 | Snackbar | Alert Dialog |
| 删除银行卡确认 | Alert Dialog | Toast |
| 选择币种 / 账户 | Picker Sheet | Alert Dialog |
| 交易记录筛选 | Filter Sheet | Alert Dialog |
| 修改昵称 | Form Sheet | Full-screen Modal |
| 添加银行卡 | Modal Page | Form Sheet |
| 提现确认 | Modal Page + Alert Dialog | Toast / Bottom Sheet |
| KYC 上传证件 | Full-screen Modal / Modal Stack | Bottom Sheet |
| 阅读协议 | Modal Page | Detail Sheet |
| 风险披露确认 | Alert Dialog / Risk Modal Page | Toast |
| Partner 申请 | Modal Page / Modal Stack | Bottom Sheet |
| 系统权限 | System Permission Dialog | 自定义弹框 |

---

## 4. 标准弹框类型

项目只允许以下标准类型：

| Type | 中文 | 使用强度 | 是否路由化 | 是否可叠加 |
|---|---|---:|---:|---:|
| Toast | 轻提示 | 轻 | 否 | 队列 |
| Snackbar | 底部轻操作提示 | 轻 | 否 | 不建议 |
| Alert Dialog | 确认 / 风险 / 危险操作 | 强 | 否 | 只允许作为二级确认 |
| Action Sheet | 操作菜单 | 中 | 否 | 不允许 Sheet 叠 Sheet |
| Picker Sheet | 选择器 | 中 | 否 | 不允许 Sheet 叠 Sheet |
| Filter Sheet | 筛选器 | 中 | 否 | 不允许 Sheet 叠 Sheet |
| Form Sheet | 1-3 字段短表单 | 中 | 否 | 只允许 Alert |
| Detail Sheet | 短详情 / 摘要 | 中 | 否 | 只允许 Alert / Toast |
| Bottom Sheet | 短任务 / 局部详情 | 中 | 谨慎 | 只允许 Alert / Toast |
| Modal Page | 页面级模态 | 强 | 是 | 通过 Modal Stack |
| Full-screen Modal | 强流程 | 强 | 是 | 通过 Modal Stack |
| Popover / Tooltip | 局部解释 | 轻 | 否 | 不建议 |
| System Permission Dialog | 系统权限 | 强 | 系统控制 | 系统控制 |

如需求不适配以上类型，必须先提出设计系统扩展，不允许临时新建类型。

---

## 5. Overlay Registry

所有弹框必须登记到 Overlay Registry。

路径建议：

```text
src/design-public-assets/overlays/
├── registry/
│   ├── overlay-registry.json
│   ├── overlay-registry.schema.json
│   ├── overlay-dependency-graph.json
│   └── overlay-change-log.md
├── components/
│   ├── Toast
│   ├── Snackbar
│   ├── AlertDialog
│   ├── ActionSheet
│   ├── PickerSheet
│   ├── FilterSheet
│   ├── FormSheet
│   ├── DetailSheet
│   ├── BottomSheet
│   ├── ModalPage
│   ├── ModalStack
│   └── ModalQueueProvider
└── patterns/
    ├── RiskDecisionDialog
    ├── DirtyStateExitDialog
    ├── FinancialConfirmModal
    ├── KYCModalFlow
    └── BankAccountModalFlow
```

### 5.1 overlay-registry.schema.json

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Overlay Registry Schema",
  "type": "object",
  "required": ["overlays"],
  "properties": {
    "overlays": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["overlay_id", "type", "risk_level", "source_path", "usage_scope", "owner", "tokens", "states", "events", "a11y", "platform", "queue_policy", "status"],
        "properties": {
          "overlay_id": { "type": "string" },
          "type": { "enum": ["toast", "snackbar", "alert_dialog", "action_sheet", "picker_sheet", "filter_sheet", "form_sheet", "detail_sheet", "bottom_sheet", "modal_page", "full_screen_modal", "popover", "system_permission"] },
          "risk_level": { "enum": ["low", "medium", "high", "critical"] },
          "source_path": { "type": "string" },
          "usage_scope": { "type": "array", "items": { "type": "string" } },
          "owner": { "type": "string" },
          "tokens": { "type": "array", "items": { "type": "string" } },
          "states": { "type": "array", "items": { "type": "string" } },
          "events": { "type": "array", "items": { "type": "string" } },
          "a11y": { "type": "object" },
          "platform": { "type": "array", "items": { "enum": ["ios", "android", "h5", "webview", "miniapp"] } },
          "queue_policy": { "enum": ["none", "queued", "priority_queued", "blocking"] },
          "status": { "enum": ["draft", "approved", "deprecated", "blocked"] }
        }
      }
    }
  }
}
```

---

## 6. Component Contract

每个公共弹框组件必须具备以下契约。

### 6.1 通用 Props

```ts
type OverlayBaseProps = {
  open: boolean;
  title?: string;
  description?: string;
  riskLevel?: "low" | "medium" | "high" | "critical";
  dismissible?: boolean;
  closeOnBackdrop?: boolean;
  dirty?: boolean;
  loading?: boolean;
  disabled?: boolean;
  payload?: unknown;
  onOpen?: () => void;
  onClose?: () => void;
  onCancel?: () => void;
  onBack?: () => void;
  onSubmit?: (payload?: unknown) => void;
  onResult?: (result: unknown) => void;
  onError?: (error: unknown) => void;
};
```

### 6.2 必须支持的状态

```text
open
closed
entering
exiting
dirty
loading
disabled
submitting
success
error
blocked
```

### 6.3 必须支持的事件

```text
open
close
back
cancel
submit
confirm
dismiss
escape
androidBack
backdropPress
keyboardOpen
keyboardClose
```

---

## 7. Modal State Machine

所有 Modal Page / Full-screen Modal / Modal Stack 必须遵循状态机。

```text
idle
→ opening
→ active
→ dirty
→ confirming_exit
→ submitting
→ success
→ closing
→ closed
→ error
```

规则：

1. `dirty` 状态下禁止直接 close。
2. `submitting` 状态禁止重复提交。
3. `error` 状态必须有恢复动作。
4. `success` 后必须定义关闭 / 结果页 / 返回路径。
5. Android Back 必须映射为 `back` 或 `confirming_exit`。
6. Close 与 Back 必须分离。

---

## 8. Modal Stack

### 8.1 Stack API

```ts
type ModalStackApi = {
  push(route: ModalRoute): void;
  pop(): void;
  replace(route: ModalRoute): void;
  closeAll(): void;
  canGoBack(): boolean;
  stackDepth: number;
  currentRoute: ModalRoute;
};
```

### 8.2 Stack 规则

| 规则 | 要求 |
|---|---|
| 最大层级 | 推荐 3 层，超过必须重构信息架构 |
| Back | 返回上一层 Modal Page |
| Close | 关闭整个 Stack |
| Save | 保存当前层并返回上一层 |
| Submit | 完成整个流程 |
| Dirty | 返回/关闭必须二次确认 |
| State | 返回上一层必须保留输入 |
| Android Back | 与 stack pop 行为一致 |
| Header | depth > 1 必须有返回按钮 |
| Title | 每一层必须有唯一标题 |

---

## 9. Modal Queue

### 9.1 Queue API

```ts
type ModalQueueApi = {
  enqueue(item: QueueItem): void;
  dequeue(): QueueItem | null;
  dismiss(id: string): void;
  snooze(id: string, duration: number): void;
  dedupe(key: string): boolean;
  isCriticalFlowActive(): boolean;
};
```

### 9.2 Priority

| Priority | 类型 | 示例 |
|---|---|---|
| P0 | System / Security | 登录失效、强制更新、账号冻结 |
| P1 | Compliance | KYC、视频认证、协议签署 |
| P2 | Funds / Trading | 提现失败、保证金风险、风险确认 |
| P3 | Current Task | 绑定银行卡、完善资料、添加账户 |
| P4 | Product Guide | 新功能引导、任务提醒 |
| P5 | Marketing | 活动、优惠券 |

### 9.3 Queue 规则

1. 同时只显示一个阻断弹框。
2. P0 可打断所有低优先级。
3. P4 / P5 不得打断登录、KYC、提现、交易、安全流程。
4. 重复弹框必须 dedupe。
5. 关闭后必须记录 dismissal state。
6. 营销弹框必须等关键流程结束。
7. 队列展示必须等待页面转场稳定。

---

## 10. Design Token Contract

弹框系统必须使用 token。禁止 hardcode。

```text
color.overlay.mask
color.surface.modal
color.surface.sheet
color.surface.toast
color.text.primary
color.text.secondary
color.text.tertiary
color.border.subtle
color.status.success
color.status.warning
color.status.danger
color.action.primary
color.action.secondary

spacing.modal.padding
spacing.sheet.padding
spacing.dialog.padding
spacing.action.gap
spacing.safeArea.bottom

radius.dialog
radius.sheet
radius.toast
radius.modalCard

shadow.dialog
shadow.sheet
shadow.toast

zIndex.toast
zIndex.snackbar
zIndex.sheet
zIndex.modal
zIndex.dialog
zIndex.system

motion.duration.fast
motion.duration.normal
motion.easing.standard
motion.easing.exit
```

---

## 11. 类型细则

### 11.1 Toast

| 规则 | 要求 |
|---|---|
| 作用 | 轻反馈 |
| 是否阻断 | 否 |
| 高风险信息 | 禁止 |
| 文案长度 | 短文本 |
| 多个 Toast | 队列 |
| 不可替代 | 字段错误、风险确认、资金失败详情 |

### 11.2 Snackbar

| 规则 | 要求 |
|---|---|
| 作用 | 轻操作反馈，可撤销 |
| 操作按钮 | 最多 1 个 |
| 阻断 | 否 |
| 高风险 | 禁止 |
| 同屏数量 | 最多 1 个 |

### 11.3 Alert Dialog

| 规则 | 要求 |
|---|---|
| 作用 | 确认、风险、危险操作 |
| 按钮 | 最多 2 个，极特殊 3 个 |
| 文案 | 标题说明动作，描述说明后果 |
| 遮罩关闭 | 高风险禁止 |
| 表单 | 禁止 |
| 下一层 | 禁止 |
| 叠加 | 禁止 Alert 叠 Alert |

按钮文案必须具体：删除银行卡、放弃编辑、继续提现、我已了解风险、取消申请、退出登录。

禁止：OK、Yes、Confirm、Submit 作为高风险确认按钮。

### 11.4 Bottom Sheet / Form Sheet

| 条件 | 处理 |
|---|---|
| 1-3 个字段 | Form Sheet |
| 超过 3 个字段 | Modal Page |
| 需要上传 | Modal Page |
| 涉及 KYC / 合规 | Full-screen Modal |
| 涉及资金强确认 | Modal Page + Alert |
| 高度超过 90% | Modal Page |
| 需要下一层 | Modal Stack |

### 11.5 Modal Page / Full-screen Modal

必须用于：KYC、视频认证、添加银行卡、提现确认、风险披露、协议阅读、创建交易账户、Partner 申请、安全设置、找回密码。

---

## 12. 平台规则

### iOS

1. 适配 Safe Area。
2. 下滑关闭只允许低风险场景。
3. Dirty / 高风险流程必须拦截下滑。
4. Sheet 行为必须符合 iOS 心智。

### Android

1. 必须处理系统返回键。
2. 返回键优先关闭最上层 Overlay 或 pop Modal Stack。
3. Dirty 状态必须二次确认。
4. 不允许只依赖 iOS 手势。

### H5 / 小程序 / WebView

1. 必须提供可见返回和关闭控件。
2. 验证键盘 resize。
3. 底部按钮不能被 Safe Area / 键盘遮挡。
4. 避免滚动锁死。

---

## 13. 金融 / Broker 场景规则

| 场景 | 必须类型 | 禁止 |
|---|---|---|
| KYC / POA / 视频认证 | Full-screen Modal / Modal Stack | Bottom Sheet |
| 提现确认 | Modal Page + Alert Dialog | Toast / 普通 Sheet |
| 入金详情 | Modal Page / Detail Sheet | Alert 承载长信息 |
| 银行卡绑定 | Modal Page | Form Sheet |
| 交易风险确认 | Alert Dialog / Risk Modal Page | Toast |
| 协议阅读 | Modal Page | Detail Sheet |
| Partner 申请 | Modal Page / Modal Stack | Bottom Sheet |
| 删除邀请链接 | Action Sheet + Alert Dialog | 直接删除 |

---

## 14. 审计工作流

### Step 1：全量盘点

扫描：Dialog、Modal、Sheet、BottomSheet、ActionSheet、Picker、Toast、Snackbar、Popover、Overlay、Portal、z-index、position fixed、backdrop、mask、dismiss、close。

输出：

```md
# Overlay Inventory

| File | Current Overlay | Current Usage | Correct Type | Risk Level | Issue | Action |
|---|---|---|---|---|---|---|
```

### Step 2：类型校正

每个弹框必须进入标准类型。

### Step 3：违规检测

检查：页面私有弹框、hardcode style、随机 z-index、非法嵌套、Sheet 叠 Sheet、Alert 叠 Alert、缺 dirty state、缺 Android back、缺 keyboard safe、缺 safe area、缺 accessibility、缺 Modal Queue、重复弹框实现。

### Step 4：重构

执行：页面私有弹框 → 公共 Overlay 组件；复杂 Sheet → Modal Page / Modal Stack；重复弹框 → Overlay Pattern；风险 Toast → Alert / Risk Modal；随机样式 → Tokens；局部队列 → Modal Queue。

### Step 5：回归

执行：type check、lint、unit tests、build、manual smoke review、overlay matrix review。

---

## 15. Redline Item

每个问题必须输出 Redline：

```md
# Overlay Redline Item

- ID:
- Page:
- Scenario:
- Current Overlay:
- Correct Overlay:
- Evidence:
- Problem:
- Risk Level:
- Why It Blocks L5:
- Root Cause Layer: token / component / pattern / queue / stack / page
- Exact Fix:
- Files / Assets To Change:
- Acceptance Criteria:
- Re-test Method:
```

---

## 16. Fix Card

每个 Redline 必须转成 Fix Card。

```md
# Overlay Fix Card

- Fix ID:
- Priority:
- Target Layer:
- Owner Skill:
- Files:
- Action:
- Token Changes:
- Component Changes:
- Pattern Changes:
- Stack / Queue Changes:
- Accessibility Changes:
- Acceptance Criteria:
- Regression Scope:
```

---

## 17. Page Overlay Matrix

每个页面必须输出：

```md
# Page Overlay Matrix

| Page | Overlay Used | Correct Type | Public Component | Tokens | Stack | Queue | Dirty | Android Back | Keyboard | A11y | Decision |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
```

任何 `No / Partial / Unknown` 都不得 L5。

---

## 18. 100 分 Gate

| 维度 | 分值 |
|---|---:|
| Type Selection Accuracy | 12 |
| Public Component Compliance | 12 |
| Token Compliance | 10 |
| Modal Stack Correctness | 10 |
| Modal Queue Correctness | 10 |
| Dirty State Protection | 8 |
| Platform Behavior | 8 |
| Keyboard / Safe Area | 6 |
| Accessibility | 8 |
| Financial Risk Handling | 10 |
| Registry / Dependency Traceability | 6 |
| 总分 | 100 |

### 裁决

| 分数 | 结果 |
|---|---|
| 100 | `l5_overlay_ready` |
| 95-99 | `not_l5_fix_required` |
| 90-94 | `production_but_not_l5` |
| 80-89 | `major_fix_required` |
| <80 | `blocked` |

出现以下任一情况，直接 blocked：高风险资金 / KYC / 合规场景使用 Toast / 普通 Sheet、页面私有弹框、非法嵌套、无 Android back、无 dirty state、无 Modal Queue、未使用 tokens、未使用公共组件、缺 overlay-registry、缺 Page Overlay Matrix。

---

## 19. Automated QA Scripts

Codex 应建议或补齐：

```json
{
  "scripts": {
    "qa:overlays": "node scripts/qa-overlays.js",
    "qa:overlay-registry": "node scripts/qa-overlay-registry.js",
    "qa:modal-stack": "node scripts/qa-modal-stack.js",
    "qa:modal-queue": "node scripts/qa-modal-queue.js",
    "qa:no-custom-overlay": "node scripts/qa-no-custom-overlay.js",
    "qa:no-zindex-hardcode": "node scripts/qa-no-zindex-hardcode.js"
  }
}
```

---

## 20. 输出报告

```md
# Overlay System L5 Report

## 1. Scope
- Files reviewed:
- Overlays found:

## 2. Overlay Inventory

## 3. Page Overlay Matrix

## 4. Redline Items

## 5. Fix Cards

## 6. Changes Required / Made

## 7. Token Compliance

## 8. Stack / Queue Compliance

## 9. Platform Compliance
- iOS:
- Android:
- H5 / WebView:

## 10. Accessibility Compliance

## 11. Financial Risk Compliance

## 12. Verification
- Commands run:
- Results:

## 13. Final Score
- Score:
- Decision:
- Why not 100:
```

---

## 21. Codex 执行命令

### 21.1 审计当前弹框系统

```txt
使用 App Modal & Overlay System Governance Skill v2.0.0-L5 审计当前 App 弹框系统。

要求：
1. 不要先改页面。
2. 全量扫描 Toast、Snackbar、Dialog、Sheet、Modal、Overlay、Portal、z-index。
3. 输出 Overlay Inventory。
4. 输出 Page Overlay Matrix。
5. 判断每个弹框类型是否正确。
6. 检查公共组件、tokens、Modal Stack、Modal Queue、Dirty State、Android Back、Keyboard、Safe Area、A11y。
7. 每个问题输出 Redline Item。
8. 每个 Redline 转成 Fix Card。
9. 输出 100 分 Gate 评分。
10. 不到 100 不允许 l5_overlay_ready。
```

### 21.2 执行治理

```txt
根据 App Modal & Overlay System Governance Skill 的 Fix Cards 执行弹框系统治理。

要求：
1. 先修 P0 / Blocker。
2. 页面私有弹框必须替换为公共组件。
3. 复杂流程必须升级为 Modal Page / Modal Stack。
4. 全局阻断必须进入 Modal Queue。
5. 所有样式必须使用 tokens。
6. 禁止 Sheet 叠 Sheet、Alert 叠 Alert。
7. 补齐 Dirty State、Android Back、Keyboard、Safe Area、A11y。
8. 修复后重新运行 overlay audit。
9. 必须达到 100/100 才允许 l5_overlay_ready。
```

---

## 22. AGENTS.md 路由建议

```md
## App Modal & Overlay System Governance Rule

When the task involves toast, snackbar, dialog, action sheet, picker sheet, bottom sheet, modal page, full-screen modal, modal stack, modal queue, global modal, overlay audit, modal UX, app overlay system, financial risk modal, KYC modal, withdrawal confirmation, or app popup design, Codex must use:

`.codex/skills/ui-build-production/addons/app-modal-overlay-system-governance/SKILL.md`

Hard rules:
- No page-specific custom overlays.
- All overlays must come from shared design-system overlay components.
- Complex flows must use Modal Page / Full-screen Modal / Modal Stack.
- Global blocking overlays must use Modal Queue.
- Styles must use design tokens.
- Android back, dirty state, keyboard, safe area, and accessibility must be verified.
- Finance / KYC / security / compliance overlays must not use Toast or ordinary Bottom Sheet.
- Score must be 100/100 to mark l5_overlay_ready.
```

---

## 23. L5 完成标准

| 标准 | 必须满足 |
|---|---:|
| 有 Overlay Registry | 是 |
| 有 Overlay Type Decision Engine | 是 |
| 有 Component Contract | 是 |
| 有 Modal State Machine | 是 |
| 有 Modal Stack API | 是 |
| 有 Modal Queue API | 是 |
| 有 Token Contract | 是 |
| 有平台规则 | 是 |
| 有金融场景规则 | 是 |
| 有 Redline Item | 是 |
| 有 Fix Card | 是 |
| 有 Page Overlay Matrix | 是 |
| 有 100 分 Gate | 是 |
| 有 QA Scripts 建议 | 是 |
| 可被 Codex 直接执行 | 是 |

---

## 24. 最终定义

```text
App Modal & Overlay System Governance Skill v2.0.0-L5
= Overlay Type Decision Engine
+ Overlay Registry
+ Component Contract
+ Modal State Machine
+ Modal Stack
+ Modal Queue
+ Design Tokens
+ Dirty State
+ Android Back
+ Keyboard Safe
+ Safe Area
+ Accessibility
+ Financial Risk Handling
+ Redline Items
+ Fix Cards
+ Page Overlay Matrix
+ 100-Point L5 Gate
```

它的目标不是做一个“弹框样式规范”。它的目标是让 App 弹框系统成为可维护、可复用、可审计、可扩展、可交付开发的生产级基础设施。
