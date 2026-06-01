# Site Modal Map

Source of truth: `src/navigation/modalRegistry.ts`.

## Modal Inventory

| Modal id | Modal component | Trigger page | Trigger action | Routeable | Close behavior | Confirm behavior | Risk level |
|---|---|---|---|---|---|---|---|
| `order.ticket.route` | `OrderTicketScreen` | `/instrument/[id]`, `/markets`, `/quick`, `/discover`, `/trade` | Tap buy/sell quote, challenge ticket, or quick trade | Yes: `/order/[id]` | Full-screen Modal Page Close to previous route or `/trade` fallback; dirty state uses queued Alert Dialog | Validate order, confirm through `global.modalQueue` when needed, submit local trade, show toast result, stay on order ticket | high |
| `discover.layout.route` | `DiscoverLayoutScreen` | `/discover` | Open layout settings | Yes: `/discover-layout` | Close / Cancel to previous route or `/discover` fallback; dirty draft uses queued Alert Dialog | Save local layout draft and close | low |
| `auth.countryPicker` | `CountryPickerModal` | `/auth`, `/auth/register`, `/auth/register-phone`, `/auth/forgot-password` | Tap country code selector | No | Shared backdrop tap, pan-down, or dismiss without changing country | Select country and close | low |
| `auth.contactConfirm` | `AuthContactConfirmDialog` | `/auth/register`, `/auth/register-phone` | Continue after valid contact entry | No | Non-sheet exception: cancel and keep current form | Confirm contact and navigate to code route | medium |
| `auth.leaveVerifiedStep` | `AuthLeaveVerifiedStepDialog` | `/auth/register-phone`, `/auth/register-password` | Back from verified step | No | Cancel and stay on current step | Navigate to prior registration step | medium |
| `auth.errorSheet` | `AuthErrorSheet` | `/auth`, `/auth/register`, `/auth/register-phone`, `/auth/register-password`, `/auth/forgot-password` | Submit invalid form | No | Dismiss with Got it or sheet close | Acknowledge validation error | medium |
| `auth.errorDialog` | `AuthErrorDialog` | `/auth/pin-setup` | Wrong PIN or PIN mismatch | No | Non-sheet exception: dismiss dialog | Reset current PIN input | high |
| `global.bottomSheet` | `GlobalBottomSheetHost` | Multiple protected pages | Open registered sheet preset | No | Shared backdrop tap, pan-down, or nested back | Run page-supplied sheet action | medium |
| `global.toastFeedback` | `ToastProvider` | Multiple pages | Show success, warning, blocked, or demo feedback | No | Auto-dismiss | Feedback only | low |
| `global.modalQueue` | `OverlayQueueProvider + GlobalDialog` | High-risk and dirty-state pages | Queue blocking alerts, high-risk results, dirty-state exits | No | Dismiss current queued alert before next alert | Run queued action and advance by priority | high |
| `global.modalStack` | `ModalStackProvider` | `/instrument/[id]` | Open full-screen chart or future full-screen modal content | No | Root full-screen modal uses Close; nested entries use Back before root Close | Content-specific action stays in the stack entry | medium |
| `global.webSelectMenu` | `TextField web select Modal` | `/markets`, `/quick` | Open web select menu | No | Non-sheet exception: click outside or request close | Select option and close | low |
| `quick.actionSheet` | `GlobalBottomSheetHost + actionMenu preset + QuickActionSheetContent` | `/quick` | Open quick action menu | No | Shared backdrop tap, pan-down, or action completion | Run selected action and maybe navigate | medium |
| `tradingAccount.switchSheet` | `TradingAccountContextSwitcher` in `BottomSheet` card/canvas mode | `/markets`, `/trade`, `/portfolio`, funding forms | Tap account selector | No | Dismiss without changing selection | Select eligible account and close | medium |
| `funding.paymentMethodSheet` | `PaymentMethodSheet` | `/funding/deposit`, `/funding/withdrawal` | Tap payment or payout method field | No | Dismiss without changing method | Select available method and close | high |
| `funding.submitFeedbackAlert` | `OverlayQueueProvider + GlobalDialog` | funding forms | Submit funding form | No | Acknowledge queued alert after navigation to transaction detail | Show submitted reference, status context, and route to transaction detail | high |
| `partner.upgradeFeedbackAlert` | `OverlayQueueProvider + GlobalDialog` | `/quick`, `/client/[id]` | Submit partner application, view pending status, or approve upgrade | No | Acknowledge queued partner role-change alert | Show submitted, pending, or approved status through Modal Queue | high |
| `security.deviceDetailSheet` | `DeviceDetailSheet` | `/settings/security-log` | Tap device card | No | Dismiss or nested back | No direct confirm; exposes security actions | medium |
| `security.revokeConfirmSheet` | `ConfirmActionSheet` | `/settings/security-log` | Tap revoke session | No | Cancel to device detail | Revoke local session or show queued blocked/success alert | high |
| `security.reportConfirmSheet` | `ConfirmActionSheet` | `/settings/security-log` | Tap report suspicious event | No | Cancel to device detail | Report local event or show queued blocked/warning alert | high |
| `portfolio.accountMenuSheet` | `AccountMenuSheet` | `/trade`, `/portfolio` | Tap account menu | No | Dismiss account menu | Navigate to account child page | medium |
| `portfolio.positionDetailSheet` | `PositionDetailSheet` | `/trade`, `/portfolio` | Tap open position row | No | Dismiss detail | Open close confirmation or demo modify feedback | high |
| `portfolio.pendingOrderDetailSheet` | `PendingOrderDetailSheet` | `/trade`, `/portfolio` | Tap pending order row | No | Dismiss detail | Modify or delete local pending order | high |
| `portfolio.closePositionConfirm` | `ConfirmActionSheet` | `/trade`, `/portfolio` | Tap close position | No | Cancel leaves position open | Close local position and show queued trading mutation alert | high |
| `portfolio.orderMutationAlert` | `OverlayQueueProvider + GlobalDialog` | `/trade`, `/portfolio` | Close position, modify pending order, delete pending order, or blocked mutation | No | Acknowledge queued trading mutation alert | Show trading mutation result through Modal Queue | high |
| `portfolio.pendingOrderFeedbackToast` | `ToastProvider` | `/trade`, `/portfolio` | Modify or delete pending order | No | Auto-dismiss | Feedback after local mutation | medium |
| `account.moreActionSheet` | `AccountMoreSheet` | `/account-details/[id]` | Tap more action | No | Dismiss action menu | Run demo action and show toast | medium |
| `account.metricDescriptionSheet` | `MetricDescriptionSheet` | `/accounts`, `/account`, `/account-basic/[id]` | Tap explainable metric label | No | Dismiss sheet | Informational only | low |
| `account.balanceTransactionDetailSheet` | `TransactionDetailSheet` | `/account-balance/[id]` | Tap balance transaction row | No | Tap OK or dismiss | Acknowledge details | medium |

## Non-Routeable Rule

Every `routeable: false` modal above must remain without a `routePath`. These modals are local feedback, selection, confirmation, or detail layers and do not satisfy the routeable modal criteria in `docs/07-routing.md`.

## Close / Confirm Governance

- Routeable modal entries must declare machine-readable `modalCloseBehavior: "backOrFallback"` plus `closeFallback`.
- Non-routeable sheets and dialogs use `dismiss` when closing does not change data, `cancel` when abandoning a pending decision, and `autoDismiss` for toast feedback.
- High-risk confirmations such as close position, revoke session, and report suspicious activity must keep the current page state unchanged when cancelled.
- Mobile bottom sheets must use `GlobalBottomSheetHost` and shared presets; modal entries may name their content component, but cannot register a page-owned sheet shell.
- Auth confirmation dialogs, PIN error dialogs, and the TextField web select menu are non-sheet exceptions in this registry.
