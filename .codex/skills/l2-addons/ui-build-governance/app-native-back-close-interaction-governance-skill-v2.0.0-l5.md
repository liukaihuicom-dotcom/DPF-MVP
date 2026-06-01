---
name: app-native-back-close-interaction-governance
description: 当任务涉及 App 返回、关闭、Back、Close、Cancel、Done、Android Back、iOS 手势、Header Back、Header Close、router.back、navigation.goBack、BackHandler、UnsavedGuard、WebView 返回、Deep Link fallback、Push 入口返回、成功页返回、NavigationContract、OverlayContract、统一返回管线、返回/关闭交互审计、资金/KYC/支付流程退出治理时使用。本 Skill 用于让 Codex 以 L5 生产级标准设计、审计、重构和交付长期可维护的 App Back / Close Interaction Governance。
layer: L2
category: "UI Build Governance Add-on"
parent: "UI Build Production Skill v3.0.0-L5"
depends_on:
  - "NavigationContract"
  - "OverlayContract"
  - "AppHeader contract"
  - "Back pipeline"
  - "UnsavedGuard"
  - "ProcessingGuard"
  - "platform behavior"
  - "page contract"
standalone: false
hierarchy: "L1 Core UI Build Production > UI Build Production Skill > App Native Back / Close Interaction Governance Add-on"
---

# App Native Back / Close Interaction Governance Skill v2.0.0 L5

> **Skill 类型**：Production-grade App Navigation / Overlay Interaction Governance Skill  
> **使用对象**：Codex / AI Agent / Product Designer / UX Designer / UI Designer / Frontend Engineer  
> **适用项目**：React Native / Expo / Flutter / Native iOS / Native Android / Mobile H5 App Shell  
> **核心目标**：把 App 端返回 / 关闭从“页面各自处理”治理为“统一契约、统一组件、统一返回管线、统一测试、统一发布门禁”。

---

## 0. L5 判定标准

本 Skill 只有在以下 6 个条件全部满足时，才算完成 L5 生产级治理：

| L5 条件 | 必须达成的结果 |
|---|---|
| 语义统一 | Back / Close / Cancel / Done 在全站没有混用 |
| 工程契约 | 每个页面、弹层、流程都声明 Navigation / Overlay Contract |
| 统一管线 | Android Back、iOS 手势、Header 按钮、Sheet dismiss 走统一 handler |
| 自动审计 | 可以扫描出错误返回、错误关闭、固定跳首页、未保存无确认等问题 |
| 自动测试 | 至少具备核心单测 / 组件测试 / 关键 E2E 回归用例 |
| 发布门禁 | P0 未修复禁止交付，P1 必须有修复计划，P2 进入优化 backlog |

**不满足以上条件的，只能算交互规范，不算 L5 生产级 Skill。**

---

## 1. 官方平台基线

Codex 执行时必须尊重以下平台原则，不允许为了视觉一致性破坏原生心智。

| 平台 / 体系 | 基线原则 | 对本 Skill 的约束 |
|---|---|---|
| Apple Human Interface Guidelines | 标准 Back 用于导航层级；标准 Close 用于关闭模态视图 | iOS 普通页面用 Back，Modal / Sheet / Preview 用 Close / Cancel / Done |
| Android Developers Predictive Back | Android Back 需要让系统提前知道返回目标，避免随意拦截 | Android Back 必须走统一返回管线，不允许页面散写 BackHandler |
| Material Design 3 Bottom Sheets | Modal Bottom Sheet 是阻断型临时面板，必须可交互或可 dismiss | Bottom Sheet 不使用页面 Back，根层使用 dismiss / close |
| Material Design 3 Dialogs | Dialog 用于要求用户处理信息、确认或选择 | Dialog 不使用页面返回箭头，必须通过 action / dismiss 关闭 |

参考来源：

- Apple Human Interface Guidelines — Toolbars / Navigation bar / Standard Back and Close buttons
- Apple Human Interface Guidelines — Tab bars
- Android Developers — Predictive back gesture
- Android Developers — Handle back gestures and predictive back animations
- Material Design 3 — Bottom sheets
- Material Design 3 — Dialogs

---

## 2. Skill 适用范围

### 2.1 必须治理对象

| 对象 | 示例 | 是否必须治理 |
|---|---|---:|
| Root Tab 页面 | Home / Workspace / Market / Wallet / Profile | 是 |
| Stack 页面 | 交易账号详情、订单详情、用户详情 | 是 |
| 多步骤流程 | KYC、开户、Partner 申请、银行卡添加 | 是 |
| Critical Flow | 存款、取款、转账、视频认证、支付处理中 | 是 |
| Bottom Sheet | 账号选择、通道选择、筛选器、操作菜单 | 是 |
| Dialog / Alert | 离开确认、删除确认、风险提示 | 是 |
| Full-screen Modal | 搜索、预览、筛选、独立任务 | 是 |
| Preview | 图片、视频、PDF、协议、凭证 | 是 |
| WebView | 支付页、协议页、外部活动页 | 是 |
| Nested Navigator | Tab 内 Stack、Modal 内 Stack | 是 |
| Deep Link / Push Entry | 通知打开订单详情、链接打开 KYC | 是 |

### 2.2 不在本 Skill 范围内

| 不覆盖内容 | 说明 |
|---|---|
| 颜色 / 字号 / 圆角 | 由设计系统 Skill 负责 |
| 业务字段定义 | 由产品需求文档或业务 Skill 负责 |
| 具体路由库强绑定 | 本 Skill 给出跨框架契约，Codex 应按项目实际适配 |
| 桌面 Web 浏览器返回 | 本 Skill 只治理 App / Mobile App Shell 场景 |

---

## 3. 不可破坏的核心语义

### 3.1 Back

Back 是页面导航层级行为。

| 属性 | 标准 |
|---|---|
| 用户理解 | 回到刚才来的页面 / 上一级页面 |
| 控件 | chevron-left / arrow-left |
| 位置 | 页面 Header 左侧 |
| 行为 | pop stack / go back / step back |
| 必须保留 | 来源页滚动位置、筛选条件、Tab 状态、输入草稿 |
| 禁止 | 固定跳首页、关闭弹层、清空来源页状态 |

适用：

| 场景 | 示例 |
|---|---|
| 列表 → 详情 | 交易账号列表 → 交易账号详情 |
| 详情 → 子详情 | 交易账号详情 → 资金记录详情 |
| 流程内上一步 | KYC Step 3 → KYC Step 2 |
| WebView 无内部历史 | WebView 返回 App 来源页 |

### 3.2 Close

Close 是关闭临时容器或退出独立任务的行为。

| 属性 | 标准 |
|---|---|
| 用户理解 | 关掉当前弹层 / 退出临时任务 |
| 控件 | X / Close / Cancel / Done |
| 位置 | Modal / Sheet / Preview / Dialog 约定位置 |
| 行为 | dismiss overlay / close modal / cancel task |
| 必须保留 | 触发弹层的来源页面和原位置 |
| 禁止 | 当成页面返回、跳转首页、破坏页面栈 |

适用：

| 场景 | 示例 |
|---|---|
| Bottom Sheet | 切换交易账号、选择入金通道 |
| Dialog | 删除确认、风险提示、离开确认 |
| Full-screen Modal | 搜索、筛选、图片预览 |
| 临时任务 | 上传证件预览、协议阅读 |

### 3.3 Cancel

Cancel 是放弃当前临时操作。

| 状态 | 行为 |
|---|---|
| 无输入 / 无选择 | 直接关闭 |
| 已输入 / 已上传 / 已选择 | 必须走 UnsavedGuard |
| 已提交 / 处理中 | 不允许静默取消，必须显示状态后果 |

### 3.4 Done / Save

Done / Save 表示完成任务并提交结果。

| 控件 | 行为 |
|---|---|
| Done | 完成当前选择或临时任务后关闭 |
| Save | 保存数据后返回或关闭 |
| Apply | 应用筛选 / 排序后关闭 |
| Submit | 提交流程，不一定立即关闭 |

---

## 4. Screen / Surface 分类法

### 4.1 ScreenType

| ScreenType | 定义 | 左侧控件 | Android Back | iOS 手势 |
|---|---|---|---|---|
| `root-tab` | 底部导航一级页面 | none | system / app exit policy | none |
| `stack-page` | 普通页面栈页面 | back | pop-stack | edge-swipe-back |
| `step-flow` | 多步骤流程页面 | back / close by level | previous-step / confirm-leave | conditional |
| `critical-flow` | 高风险业务流程 | back + guard / close + guard | confirm-leave | guarded |
| `fullscreen-modal` | 全屏临时任务 | close / cancel | dismiss-modal | swipe-down only if safe |
| `preview` | 图片 / 视频 / 文件预览 | close | dismiss-preview | swipe-down if safe |
| `webview` | 内嵌网页容器 | back / close by entry | webview-go-back first | edge-swipe if native stack |
| `auth-reset` | 登录 / 登出 / 权限重置 | none / close | reset-stack | disabled |
| `success-terminal` | 成功终态页 | close / done / view-result | controlled-exit | disabled / controlled |

### 4.2 OverlayType

| OverlayType | 定义 | 控件 | Dismiss 规则 |
|---|---|---|---|
| `dialog` | 中央确认 / 警示弹框 | Action buttons | action / safe dismiss |
| `alert` | 系统级提示 | Confirm / Cancel | action only |
| `bottom-sheet` | 底部临时面板 | X / Cancel / drag | dismiss / collapse |
| `action-sheet` | 操作菜单 | Cancel | select then dismiss |
| `popover` | 轻量浮层 | tap outside | dismiss first |
| `dropdown` | 下拉选择 | tap item / outside | dismiss first |
| `toast` | 非阻断反馈 | none | auto dismiss |
| `loading-blocker` | 阻断加载 | none / cancel only if safe | no silent dismiss |

---

## 5. Navigation Contract

每个页面必须声明 `NavigationContract`，不允许页面自己随意决定返回 / 关闭。

### 5.1 TypeScript 契约参考

```ts
export type ScreenType =
  | 'root-tab'
  | 'stack-page'
  | 'step-flow'
  | 'critical-flow'
  | 'fullscreen-modal'
  | 'preview'
  | 'webview'
  | 'auth-reset'
  | 'success-terminal';

export type LeftAction =
  | 'none'
  | 'back'
  | 'close'
  | 'cancel';

export type BackBehavior =
  | 'system-default'
  | 'pop-stack'
  | 'previous-step'
  | 'dismiss-overlay'
  | 'dismiss-modal'
  | 'dismiss-preview'
  | 'webview-go-back-first'
  | 'confirm-leave'
  | 'reset-stack'
  | 'controlled-exit';

export type GesturePolicy =
  | 'enabled'
  | 'disabled'
  | 'guarded'
  | 'platform-default';

export type SourceFallback =
  | 'previous-route'
  | 'route-param-return-to'
  | 'root-tab'
  | 'safe-list-page'
  | 'dashboard'
  | 'blocked';

export type Criticality = 'low' | 'medium' | 'high' | 'critical';

export interface NavigationContract {
  routeName: string;
  screenType: ScreenType;
  leftAction: LeftAction;
  backBehavior: BackBehavior;
  androidBackBehavior: BackBehavior;
  iosGesturePolicy: GesturePolicy;
  sourceFallback: SourceFallback;
  preserveSourceState: boolean;
  requiresUnsavedGuard: boolean;
  criticality: Criticality;
  owner: 'product' | 'design' | 'engineering' | 'compliance';
}
```

### 5.2 示例

#### Root Tab

```ts
export const workspaceNavigationContract: NavigationContract = {
  routeName: 'WorkspaceTab',
  screenType: 'root-tab',
  leftAction: 'none',
  backBehavior: 'system-default',
  androidBackBehavior: 'system-default',
  iosGesturePolicy: 'disabled',
  sourceFallback: 'blocked',
  preserveSourceState: true,
  requiresUnsavedGuard: false,
  criticality: 'low',
  owner: 'product',
};
```

#### 普通详情页

```ts
export const tradingAccountDetailContract: NavigationContract = {
  routeName: 'TradingAccountDetail',
  screenType: 'stack-page',
  leftAction: 'back',
  backBehavior: 'pop-stack',
  androidBackBehavior: 'pop-stack',
  iosGesturePolicy: 'enabled',
  sourceFallback: 'safe-list-page',
  preserveSourceState: true,
  requiresUnsavedGuard: false,
  criticality: 'medium',
  owner: 'product',
};
```

#### 高风险流程页

```ts
export const depositAmountContract: NavigationContract = {
  routeName: 'DepositAmount',
  screenType: 'critical-flow',
  leftAction: 'back',
  backBehavior: 'confirm-leave',
  androidBackBehavior: 'confirm-leave',
  iosGesturePolicy: 'guarded',
  sourceFallback: 'safe-list-page',
  preserveSourceState: true,
  requiresUnsavedGuard: true,
  criticality: 'critical',
  owner: 'compliance',
};
```

---

## 6. Overlay Contract

所有弹层必须声明 `OverlayContract`。

### 6.1 TypeScript 契约参考

```ts
export type OverlayType =
  | 'dialog'
  | 'alert'
  | 'bottom-sheet'
  | 'action-sheet'
  | 'popover'
  | 'dropdown'
  | 'fullscreen-modal'
  | 'preview'
  | 'loading-blocker';

export type DismissTrigger =
  | 'x-button'
  | 'cancel-button'
  | 'done-button'
  | 'apply-button'
  | 'back-handler'
  | 'scrim-tap'
  | 'swipe-down'
  | 'drag-to-collapse'
  | 'select-item'
  | 'programmatic';

export type DismissPolicy =
  | 'safe-dismiss'
  | 'confirm-before-dismiss'
  | 'action-required'
  | 'non-dismissible'
  | 'collapse-first-then-dismiss';

export interface OverlayContract {
  overlayName: string;
  overlayType: OverlayType;
  dismissPolicy: DismissPolicy;
  allowedDismissTriggers: DismissTrigger[];
  blocksBackgroundInteraction: boolean;
  restoreFocusOrSource: boolean;
  requiresUnsavedGuard: boolean;
  criticality: Criticality;
}
```

### 6.2 示例：交易账号选择 Bottom Sheet

```ts
export const switchTradingAccountSheetContract: OverlayContract = {
  overlayName: 'SwitchTradingAccountSheet',
  overlayType: 'bottom-sheet',
  dismissPolicy: 'safe-dismiss',
  allowedDismissTriggers: ['x-button', 'scrim-tap', 'swipe-down', 'back-handler', 'select-item'],
  blocksBackgroundInteraction: true,
  restoreFocusOrSource: true,
  requiresUnsavedGuard: false,
  criticality: 'low',
};
```

### 6.3 示例：KYC 上传中阻断层

```ts
export const kycUploadingBlockerContract: OverlayContract = {
  overlayName: 'KycUploadingBlocker',
  overlayType: 'loading-blocker',
  dismissPolicy: 'non-dismissible',
  allowedDismissTriggers: ['programmatic'],
  blocksBackgroundInteraction: true,
  restoreFocusOrSource: true,
  requiresUnsavedGuard: false,
  criticality: 'critical',
};
```

---

## 7. 统一返回管线

所有返回 / 关闭必须经过统一管线，不允许页面散写。

### 7.1 返回处理顺序

当用户触发以下任一行为：

- 点击 Header Back
- 点击 Header Close
- Android 系统 Back / 手势 Back
- iOS 左边缘返回
- Modal / Sheet 下滑关闭
- 点击蒙层

必须按此顺序处理：

| 优先级 | 状态 | 行为 |
|---:|---|---|
| 1 | 键盘打开 | 先收起键盘，不离开页面 |
| 2 | Dropdown / Popover 打开 | 先关闭轻量浮层 |
| 3 | Dialog / Alert 打开 | 按 OverlayContract 处理 dismiss / confirm |
| 4 | Bottom Sheet 打开 | 先 collapse 或 dismiss Sheet |
| 5 | Full-screen Modal 打开 | 先处理 Modal 内部栈，再 dismiss Modal |
| 6 | WebView 有内部历史 | WebView goBack |
| 7 | 当前表单 dirty | UnsavedGuard 确认 |
| 8 | 当前流程处于 critical / processing | 显示状态后果或禁止离开 |
| 9 | 当前页面栈有上一页 | pop stack |
| 10 | Deep Link / Push 入口无上一页 | fallback 到安全页面 |
| 11 | Root Tab | 按平台系统默认，不显示 App 内返回 |

### 7.2 返回管线伪代码

```ts
export async function handleGlobalBack(context: BackContext): Promise<BackResult> {
  if (context.keyboard.isOpen) return closeKeyboard();
  if (context.overlay.hasDropdownOrPopover) return dismissTopLightOverlay();
  if (context.overlay.hasDialog) return handleOverlayDismiss(context.overlay.topDialog);
  if (context.overlay.hasBottomSheet) return handleBottomSheetBack(context.overlay.topSheet);
  if (context.modal.hasFullscreenModal) return handleFullscreenModalBack(context.modal.top);
  if (context.webview?.canGoBack) return context.webview.goBack();
  if (context.form?.isDirty) return confirmUnsavedLeave(context.form);
  if (context.flow?.isCriticalProcessing) return blockOrExplainProcessingExit(context.flow);
  if (context.navigation.canPop) return context.navigation.pop();
  if (context.entrySource.isDeepLinkOrPush) return navigateToFallback(context.route.contract);
  return systemDefaultBack();
}
```

---

## 8. 组件契约

### 8.1 AppHeader

`AppHeader` 不能由页面手写按钮。必须根据 `NavigationContract.leftAction` 自动渲染。

| leftAction | 渲染 | 行为 |
|---|---|---|
| `none` | 不渲染左侧控件 | Root Tab / 不可返回页面 |
| `back` | BackIcon | 调用 `handleGlobalBack()` |
| `close` | CloseIcon | 调用 `handleClose()` 或 `handleGlobalBack()` |
| `cancel` | CancelText | 调用 `handleCancel()`，必要时 UnsavedGuard |

参考实现：

```tsx
export function AppHeader({ contract, title, rightSlot }: AppHeaderProps) {
  const left = resolveHeaderLeftAction(contract);

  return (
    <HeaderContainer>
      {left.type === 'none' ? null : (
        <HeaderAction
          icon={left.icon}
          label={left.accessibilityLabel}
          onPress={() => handleGlobalBack({ contract })}
        />
      )}
      <HeaderTitle>{title}</HeaderTitle>
      {rightSlot}
    </HeaderContainer>
  );
}
```

### 8.2 禁止页面私自写 Header 左侧控件

禁止：

```tsx
<TouchableOpacity onPress={() => router.push('/home')}>
  <ChevronLeft />
</TouchableOpacity>
```

必须改为：

```tsx
<AppHeader contract={screenContract} title="Deposit" />
```

---

## 9. UnsavedGuard 状态机

### 9.1 表单状态

| 状态 | 定义 | 返回 / 关闭行为 |
|---|---|---|
| `clean` | 没有编辑内容 | 直接返回 / 关闭 |
| `dirty` | 有输入、选择、上传、编辑 | 弹确认 |
| `saving` | 正在保存草稿 | 禁止重复返回，显示保存中 |
| `saved-draft` | 草稿已保存 | 可返回，显示轻提示 |
| `uploading` | 文件上传中 | 禁止静默离开，提示上传中 |
| `submitted` | 已提交等待审核 | 返回到状态页，不回表单 |
| `processing` | 支付 / 入金 / 认证处理中 | 不允许静默退出，进入状态说明 |
| `success` | 已成功 | 进入成功终态页，禁止返回到可重复提交页 |
| `failed` | 失败可重试 | 可返回修改或重新提交 |

### 9.2 确认弹框文案

| 元素 | 标准文案 |
|---|---|
| 标题 | 离开此页面？ |
| 描述 | 当前填写内容可能不会保存。 |
| 主按钮 | 继续编辑 |
| 次按钮 | 离开 |

高风险流程必须说明具体后果：

| 场景 | 描述示例 |
|---|---|
| KYC | 离开后，已填写的信息可能需要重新补充。 |
| 存款 | 离开后，当前金额和通道选择可能不会保存。 |
| 上传证件 | 离开后，正在上传的文件可能失败。 |
| 支付处理中 | 当前交易正在处理中，请勿重复提交或关闭页面。 |

### 9.3 UnsavedGuard 接入标准

```ts
export interface UnsavedGuardState {
  status:
    | 'clean'
    | 'dirty'
    | 'saving'
    | 'saved-draft'
    | 'uploading'
    | 'submitted'
    | 'processing'
    | 'success'
    | 'failed';
  message?: string;
  allowSilentLeave: boolean;
  confirmTitle?: string;
  confirmDescription?: string;
}
```

---

## 10. 平台专项规则

### 10.1 iOS

| 场景 | 规则 |
|---|---|
| 普通页面栈 | 支持左边缘右滑返回 |
| Root Tab | 不显示返回，不支持返回到其他 Tab 的假逻辑 |
| Full-screen Modal | 左侧 Close / Cancel，右侧 Done / Save |
| Bottom Sheet | 可下滑关闭，但高风险流程必须 guarded |
| Dirty Form | 手势返回也必须触发 UnsavedGuard |
| Preview | 可以 X / 下滑关闭，关闭回来源位置 |

### 10.2 Android

| 场景 | 规则 |
|---|---|
| 系统 Back | 必须优先关闭最上层 UI |
| Predictive Back | 不允许页面散写无法预测目标的返回逻辑 |
| Bottom Sheet | Back 优先关闭 Sheet，不直接 pop 页面 |
| Dialog | Back 等同 Cancel，但危险操作需确认 |
| WebView | 有内部历史时先 `goBack()` |
| Root Tab | 不显示 Up；系统 Back 可遵循平台/产品退出策略 |

---

## 11. 复杂边界场景

### 11.1 Nested Navigator

| 场景 | 规则 |
|---|---|
| Tab 内 Stack | 先 pop 当前 Tab 内 Stack |
| Modal 内 Stack | 先返回 Modal 内部上一层，再关闭 Modal |
| Sheet 内二级内容 | 先返回 Sheet 内部上一层，再关闭 Sheet |
| 多 Tab 独立历史 | 不允许用 Back 在 Tab 间乱跳，除非产品明确设计 |

### 11.2 Deep Link

用户从外部链接直接进入详情页时，可能没有上一页。

| 页面 | fallback |
|---|---|
| 订单详情 | 订单列表 |
| 交易账号详情 | 交易账号列表 / Wallet |
| KYC 状态页 | KYC Center / Profile |
| 活动页 | Activity List / Home |
| Partner 申请状态 | Partner Center / Workspace |

规则：

```ts
if (!navigation.canGoBack() && entrySource === 'deep-link') {
  navigate(contract.sourceFallback);
}
```

### 11.3 Push Notification

| 通知入口 | 返回规则 |
|---|---|
| 订单通知打开订单详情 | 返回订单列表 |
| KYC 审核结果通知 | 返回 KYC Center |
| 入金状态通知 | 返回资金记录列表 |
| IM 消息通知 | 返回聊天列表 |

禁止：通知进入详情后返回空白页、首页、登录页。

### 11.4 Auth Reset

| 场景 | 规则 |
|---|---|
| 登录成功 | reset 到主 App，不允许 Back 回登录页 |
| 登出成功 | reset 到登录页，不允许 Back 回已登录页面 |
| Token 失效 | reset 到登录页，并保留安全提示 |
| KYC 中断后重新登录 | 进入流程状态页，不直接回旧表单 |

### 11.5 Success Terminal Page

| 场景 | Back 规则 |
|---|---|
| 存款提交成功 | 不返回金额输入页，进入记录详情 / Wallet |
| 取款提交成功 | 不返回提交表单，进入申请状态页 |
| KYC 提交成功 | 不返回编辑表单，进入审核状态页 |
| 转账成功 | 不返回重复提交页，进入交易记录 |

---

## 12. 业务场景治理矩阵

| 业务场景 | ScreenType / OverlayType | 左侧控件 | Back / Close 行为 | Guard |
|---|---|---|---|---|
| Workspace Tab | root-tab | none | system default | 无 |
| 交易账号详情 | stack-page | back | pop stack | 无 |
| 切换交易账号 | bottom-sheet | close / none | dismiss sheet | 无 |
| 存款金额页 | critical-flow | back | dirty 时确认 | 有 |
| 存款通道 Sheet | bottom-sheet | close | dismiss / apply | 视选择状态 |
| 支付 WebView | webview | back | webview history first | 有 |
| 入金处理中页 | success-terminal / critical-flow | close / done | controlled exit | 有 |
| 取款表单 | critical-flow | back | dirty 时确认 | 有 |
| 转账表单 | critical-flow | back | dirty 时确认 | 有 |
| KYC Step 1 | step-flow | back / close by entry | previous / confirm exit | 有 |
| KYC Step 2+ | step-flow | back | previous step | 有 |
| KYC 上传中 | loading-blocker | none | non-dismissible | 强制 |
| 视频认证 | critical-flow | close guarded | confirm leave | 强制 |
| Partner 申请 | step-flow | back | previous / confirm exit | 有 |
| 筛选器 | fullscreen-modal / sheet | close / cancel | dismiss / apply | 低 |
| 搜索页 | fullscreen-modal | close | dismiss | 无 |
| 图片预览 | preview | close | dismiss | 无 |
| 协议阅读 | fullscreen-modal / webview | close | dismiss / webview back | 低 |
| Dialog 删除确认 | dialog | none | action required | 强制 |

---

## 13. 静态扫描规则

Codex 必须先扫描全站，再修改。

### 13.1 必扫关键词

React Native / Expo / React 项目：

```bash
rg "router\.back\(|navigation\.goBack\(|navigation\.pop\(|router\.push\(|router\.replace\(|BackHandler|hardwareBackPress|onRequestClose|set[A-Za-z0-9_]*Visible\(false\)|set[A-Za-z0-9_]*Open\(false\)|dismiss\(|close\(|canGoBack|webview\.goBack" .
```

Flutter 项目：

```bash
rg "Navigator\.pop|Navigator\.push|WillPopScope|PopScope|BackButton|CloseButton|showModalBottomSheet|showDialog|canPop|maybePop" .
```

Native Android：

```bash
rg "OnBackPressedDispatcher|OnBackPressedCallback|PredictiveBackHandler|BackHandler|finish\(|dismiss\(|show\(|DialogFragment|BottomSheetDialog" .
```

Native iOS：

```bash
rg "navigationController\.popViewController|dismiss\(|present\(|modalPresentationStyle|isModalInPresentation|interactivePopGestureRecognizer|UIBarButtonItem" .
```

### 13.2 P0 禁止模式

| 禁止代码 / 行为 | 原因 | 修复方式 |
|---|---|---|
| `router.push('/home')` 作为返回 | 固定跳首页，破坏来源路径 | 使用 `handleGlobalBack()` |
| Root Tab 渲染 BackIcon | 一级页面不应有返回 | leftAction = none |
| Bottom Sheet 使用 BackIcon | 弹层不是页面层级 | 使用 Close / Cancel / drag |
| Dialog 内使用返回箭头 | Dialog 不是页面 | 使用 action buttons |
| Dirty 表单直接返回 | 数据损失 | 接入 UnsavedGuard |
| Android Back 直接退出 App | 未关闭顶层 UI | 接入 Back Pipeline |
| WebView 不处理 canGoBack | 网页内部历史丢失 | webview-go-back-first |
| 成功页返回表单 | 可能重复提交 | controlled-exit |
| 登录后可返回登录页 | 栈未 reset | auth-reset |
| 支付 / 认证处理中可静默关闭 | 高风险 | non-dismissible / guarded |

### 13.3 P1 问题

| 问题 | 修复 |
|---|---|
| 弹层没有明确关闭入口 | 增加 Close / Cancel / gesture policy |
| Header 左侧控件由页面手写 | 接入 AppHeader Contract |
| Sheet 内容超过半屏但无拖拽状态 | 增加 snap points / close rule |
| Close 文案与 Cancel 混用 | 按任务是否放弃区分 |
| Deep Link 无 fallback | 增加 sourceFallback |

### 13.4 P2 问题

| 问题 | 修复 |
|---|---|
| 无 accessibilityLabel | 补充 Back / Close / Cancel 标签 |
| 返回动画不一致 | 对齐平台默认动画 |
| 关闭后焦点未恢复 | restoreFocusOrSource |
| 文案不够明确 | 按文案规则优化 |

---

## 14. Codex 执行流程

### 阶段 1：生成 Inventory，不允许直接改代码

Codex 必须先输出以下清单：

```txt
/reports/back-close-inventory.md
```

清单格式：

| 文件 | 路由 / 组件 | 类型 | 当前控件 | 应用控件 | 当前行为 | 应用行为 | 风险 | 等级 |
|---|---|---|---|---|---|---|---|---|
| app/wallet/deposit.tsx | DepositAmount | critical-flow | Back | Back + Guard | goBack | confirm-leave | 数据丢失 | P0 |

必须覆盖：

- 所有路由页面
- 所有 Header
- 所有 Modal
- 所有 Bottom Sheet
- 所有 Dialog
- 所有 WebView
- 所有 KYC / Deposit / Withdrawal / Transfer / Partner Flow
- 所有 BackHandler / onRequestClose / router.back / navigation.goBack 使用点

### 阶段 2：建立统一能力层

Codex 必须优先检查或创建以下能力层：

```txt
src/navigation/contracts/
  navigationContract.ts
  overlayContract.ts
  routeContracts.ts

src/navigation/handlers/
  handleGlobalBack.ts
  handleOverlayDismiss.ts
  handleWebViewBack.ts
  handleCriticalFlowExit.ts

src/navigation/guards/
  UnsavedGuard.ts
  ProcessingGuard.ts
  AuthResetGuard.ts

src/components/navigation/
  AppHeader.tsx
  BackAction.tsx
  CloseAction.tsx

src/components/overlays/
  AppBottomSheet.tsx
  AppDialog.tsx
  AppFullscreenModal.tsx
```

如果项目已有类似目录，必须复用现有结构，不允许重复造一套平行体系。

### 阶段 3：逐类修复

修复顺序：

| 顺序 | 修复对象 | 原因 |
|---:|---|---|
| 1 | P0 高风险流程 | 防止资金 / KYC / 支付损失 |
| 2 | Android Back Pipeline | 系统级行为影响全站 |
| 3 | Root Tab / Header | 最容易被用户感知 |
| 4 | Bottom Sheet / Dialog | 高频交互 |
| 5 | WebView / Deep Link / Push | 边界场景 |
| 6 | Accessibility / 文案 | 体验完善 |

### 阶段 4：输出修复报告

```txt
/reports/back-close-remediation-report.md
```

报告必须包含：

| 内容 | 要求 |
|---|---|
| 修改文件列表 | 文件路径 + 修改摘要 |
| P0 修复结果 | 每项必须说明修复方式 |
| P1 / P2 剩余项 | 未修复原因和后续计划 |
| 新增契约 | route / overlay contract 列表 |
| 测试结果 | 单测 / 组件测试 / E2E 结果 |
| 回归风险 | 影响页面和需要人工验证的点 |

---

## 15. 自动测试要求

### 15.1 Unit Test

必须测试：

| 测试对象 | 用例 |
|---|---|
| `resolveHeaderLeftAction` | root-tab 不返回控件 |
| `resolveHeaderLeftAction` | stack-page 返回 Back |
| `resolveHeaderLeftAction` | fullscreen-modal 返回 Close |
| `handleGlobalBack` | keyboard open 时先关闭键盘 |
| `handleGlobalBack` | sheet open 时先关闭 sheet |
| `handleGlobalBack` | dirty form 时触发确认 |
| `handleGlobalBack` | WebView canGoBack 时先网页返回 |
| `handleGlobalBack` | deep link 无历史时 fallback |

示例：

```ts
it('does not render left action for root tabs', () => {
  expect(resolveHeaderLeftAction({ screenType: 'root-tab', leftAction: 'none' })).toEqual({ type: 'none' });
});

it('dismisses bottom sheet before popping navigation stack', async () => {
  const result = await handleGlobalBack(mockContext({ hasBottomSheet: true, canPop: true }));
  expect(result.action).toBe('dismiss-overlay');
});
```

### 15.2 Component Test

| 组件 | 测试 |
|---|---|
| AppHeader | 根据 contract 渲染正确左侧控件 |
| AppBottomSheet | Android Back 关闭 Sheet |
| AppDialog | 不渲染 BackIcon |
| AppFullscreenModal | Close / Done 正确展示 |
| WebViewScreen | canGoBack 优先处理 |
| UnsavedGuard | dirty 状态弹出确认 |

### 15.3 E2E Test

至少覆盖：

| 用例 | 预期 |
|---|---|
| Root Tab 页面 | 无返回按钮 |
| 列表进入详情后返回 | 回到来源列表并保留滚动位置 |
| 打开账号选择 Sheet 后 Android Back | 关闭 Sheet，不离开页面 |
| 存款页输入金额后返回 | 弹出离开确认 |
| KYC 上传中返回 | 不允许静默退出 |
| 支付 WebView 有历史时返回 | 先回网页上一页 |
| Deep Link 打开订单详情后返回 | 进入订单列表 fallback |
| 登录成功后返回 | 不能回登录页 |
| 提交成功页返回 | 不能回可重复提交表单 |

---

## 16. 发布门禁

| 等级 | 定义 | 发布策略 |
|---|---|---|
| P0 | 会造成数据损失、资金误操作、认证中断、导航死路、重复提交 | 禁止发布 |
| P1 | 明显破坏原生心智或高频路径体验 | 必须修复或产品负责人签字豁免 |
| P2 | 可访问性、动画、文案、轻微一致性问题 | 可进入 backlog，但要记录 |

P0 示例：

- 存款输入金额后返回无确认
- KYC 上传中可以直接关闭
- Android Back 在 Sheet 打开时直接退出页面
- 支付 WebView Back 直接关闭支付页
- 成功页返回到可重复提交表单
- Root Tab 出现返回按钮
- Dialog / Bottom Sheet 用页面 Back 图标

---

## 17. 文案标准

### 17.1 控件文案

| 行为 | 中文 | 英文 | 印尼语参考 |
|---|---|---|---|
| 返回 | 返回 | Back | Kembali |
| 关闭 | 关闭 | Close | Tutup |
| 取消 | 取消 | Cancel | Batalkan |
| 完成 | 完成 | Done | Selesai |
| 保存 | 保存 | Save | Simpan |
| 应用 | 应用 | Apply | Terapkan |
| 离开 | 离开 | Leave | Tinggalkan |
| 继续编辑 | 继续编辑 | Continue editing | Lanjutkan mengedit |

### 17.2 禁止文案

| 禁止 | 原因 | 替代 |
|---|---|---|
| 确定 / 取消 | 无法表达后果 | 继续编辑 / 离开 |
| 返回弹框 | 语义错误 | 关闭弹框 |
| 关闭页面 | 语义模糊 | 返回上一页 / 关闭弹层 |
| 是否确认？ | 没有损失说明 | 当前填写内容可能不会保存 |

---

## 18. 可访问性标准

| 控件 | accessibilityLabel / aria-label |
|---|---|
| Back Icon | 返回上一页 / Back |
| Close Icon | 关闭 / Close |
| Cancel Text | 取消 / Cancel |
| Done Text | 完成 / Done |
| Sheet Drag Handle | 拖动面板 / Drag sheet |
| Dialog Confirm | 明确动作，例如“离开此页面” |

规则：

- 图标按钮必须有可访问性标签。
- Close 和 Back 不能使用同一个 label。
- Dialog 的危险操作不能只读作“确定”。
- 关闭后应恢复焦点或回到触发元素。

---

## 19. 给 Codex 的总执行 Prompt

```md
你现在需要基于本 Skill 对当前 App 项目进行生产级 L5 返回 / 关闭交互治理。不要只修单个页面，也不要只做视觉替换，而是建立可长期维护的 Navigation / Overlay Governance。

执行要求：

1. 先扫描全站，不允许直接改代码。
   - 扫描所有页面路由、Header、BackIcon、CloseIcon、Modal、Dialog、Bottom Sheet、WebView、BackHandler、router.back、navigation.goBack、router.push、router.replace、setVisible(false)、onRequestClose 等。
   - 输出 `/reports/back-close-inventory.md`。

2. 按本 Skill 建立或复用统一能力层：
   - NavigationContract
   - OverlayContract
   - handleGlobalBack
   - handleOverlayDismiss
   - UnsavedGuard
   - ProcessingGuard
   - AppHeader
   - AppBottomSheet
   - AppDialog
   - AppFullscreenModal

3. 所有页面必须声明 NavigationContract。
   - root-tab 不允许显示返回。
   - stack-page 使用 Back。
   - fullscreen-modal / preview / bottom-sheet 使用 Close / Cancel / Done。
   - critical-flow 必须接入 UnsavedGuard 或 ProcessingGuard。

4. 所有弹层必须声明 OverlayContract。
   - Bottom Sheet 不允许使用页面 BackIcon。
   - Dialog 不允许使用返回箭头。
   - 高风险弹层不允许静默 dismiss。

5. Android Back 必须走统一返回管线。
   顺序为：键盘 → popover/dropdown → dialog → bottom sheet → fullscreen modal → webview history → dirty form → critical processing → navigation pop → deep link fallback → system default。

6. iOS 手势必须按风险控制。
   - 普通页面允许边缘返回。
   - dirty / uploading / processing / critical flow 必须 guarded。
   - Sheet / Modal 是否允许下滑关闭必须由 OverlayContract 决定。

7. 禁止以下行为：
   - 用 router.push('/home') 模拟返回。
   - Root Tab 出现 BackIcon。
   - Dialog / Bottom Sheet 使用 BackIcon。
   - 表单 dirty 后直接离开。
   - 支付 / KYC / 上传 / 认证处理中静默关闭。
   - 登录后还能 Back 回登录页。
   - 成功页还能 Back 回可重复提交表单。

8. 修复后必须补充测试。
   - Unit Test：resolveHeaderLeftAction、handleGlobalBack、UnsavedGuard。
   - Component Test：AppHeader、AppBottomSheet、AppDialog、WebViewScreen。
   - E2E Test：Root Tab 无返回、Sheet Back 关闭、Dirty Form 返回确认、WebView 优先内部返回、Deep Link fallback。

9. 输出 `/reports/back-close-remediation-report.md`。
   报告必须包含：修复文件、P0/P1/P2 清单、契约清单、测试结果、未修复风险、人工验收点。

10. 发布门禁：
   - P0 未修复禁止交付。
   - P1 必须修复或说明豁免原因。
   - P2 可以进入 backlog，但必须记录。
```

---

## 20. 验收清单

### 20.1 产品 / 设计验收

| 检查项 | 是否通过 |
|---|---|
| 一级 Tab 没有返回按钮 |  |
| 二级页面返回到真实来源页面 |  |
| 弹框 / Sheet / Preview 使用 Close / Cancel / Done |  |
| Back 和 Close 没有混用 |  |
| Dirty 表单离开有确认 |  |
| 高风险流程说明后果 |  |
| 成功页不会返回可重复提交页面 |  |
| Deep Link / Push 有 fallback |  |
| 文案明确，不使用模糊“确定 / 取消” |  |
| iOS / Android 行为符合原生心智 |  |

### 20.2 工程验收

| 检查项 | 是否通过 |
|---|---|
| 每个页面有 NavigationContract |  |
| 每个弹层有 OverlayContract |  |
| AppHeader 不由页面散写左侧控件 |  |
| Android Back 走统一 handler |  |
| WebView canGoBack 优先处理 |  |
| UnsavedGuard 已接入表单 |  |
| ProcessingGuard 已接入高风险处理中状态 |  |
| 无固定跳首页模拟返回 |  |
| 有静态扫描报告 |  |
| 有测试覆盖 |  |
| P0 全部修复 |  |

---

## 21. 反例库

### 21.1 错误：Bottom Sheet 使用返回箭头

错误：

```tsx
<BottomSheetHeader leftIcon="chevron-left" onPress={navigation.goBack} />
```

正确：

```tsx
<AppBottomSheet contract={switchAccountSheetContract} title="Switch account" />
```

### 21.2 错误：返回固定跳首页

错误：

```ts
onBackPress={() => router.push('/home')}
```

正确：

```ts
onBackPress={() => handleGlobalBack({ contract })}
```

### 21.3 错误：Dirty 表单直接关闭

错误：

```ts
onClose={() => setVisible(false)}
```

正确：

```ts
onClose={() => handleOverlayDismiss({ contract, unsavedState })}
```

### 21.4 错误：WebView 不处理内部历史

错误：

```ts
onBackPress={() => navigation.goBack()}
```

正确：

```ts
if (webviewRef.current?.canGoBack) {
  webviewRef.current.goBack();
} else {
  handleGlobalBack({ contract });
}
```

---

## 22. 版本治理

| 版本 | 内容 |
|---|---|
| v1.0.0 | Back / Close 基础规范 |
| v2.0.0 L5 | 增加工程契约、扫描、测试、发布门禁、复杂边界场景 |

后续变更规则：

- 新增页面类型，必须更新 `ScreenType`。
- 新增弹层类型，必须更新 `OverlayType`。
- 新增高风险流程，必须更新业务场景治理矩阵。
- 任何绕过 `handleGlobalBack` 的实现都必须在 Code Review 中阻断。
- 每次发布前必须重新生成 inventory 和 remediation report。

---

## 23. 最终 L5 完成定义

当项目满足以下状态时，才算完成本 Skill：

```txt
1. 全站页面和弹层完成 inventory。
2. 所有页面声明 NavigationContract。
3. 所有弹层声明 OverlayContract。
4. Header / Modal / Sheet / Dialog 接入统一组件。
5. Android Back 接入统一返回管线。
6. iOS 手势按风险策略处理。
7. 表单 / KYC / 存款 / 取款 / 转账 / 支付全部接入 Guard。
8. Deep Link / Push / Auth Reset / Success Terminal 有 fallback 或 controlled exit。
9. P0 问题为 0。
10. 自动测试通过。
11. 输出 inventory report 和 remediation report。
```

**一句话标准：用户在页面层级里 Back，在临时任务里 Close；所有退出行为必须经过统一契约和统一管线，有损失风险必须确认，有系统风险必须阻断，有边界入口必须 fallback。**
