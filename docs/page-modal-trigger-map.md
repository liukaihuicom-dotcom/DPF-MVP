# Page And Modal Trigger Map

Source of truth: `src/navigation/routeRegistry.ts` and `src/navigation/modalRegistry.ts`.

## Trigger Relationships

| Page route | Trigger action | Modal id | Result / routeability |
|---|---|---|---|
| `/instrument/[id]` | Tap buy or sell footer quote | `order.ticket.route` | Routeable transparent modal at `/order/[id]` |
| `/quick` | Open quick trade action | `order.ticket.route` | Routeable transparent modal at `/order/[id]` |
| `/discover` | Open challenge ticket or trade entry | `order.ticket.route` | Routeable transparent modal at `/order/[id]` |
| `/discover` | Open layout settings | `discover.layout.route` | Routeable transparent modal at `/discover-layout`; review demotion need |
| `/auth/register-phone` | Tap country code selector | `auth.countryPicker` | Non-routeable picker sheet |
| `/auth/forgot-password` | Tap country code selector in phone reset mode | `auth.countryPicker` | Non-routeable picker sheet |
| `/auth/register` | Continue with a valid email | `auth.contactConfirm` | Non-routeable confirmation dialog; confirm opens `/auth/register-email-code` |
| `/auth/register-phone` | Continue with a valid phone | `auth.contactConfirm` | Non-routeable confirmation dialog; confirm opens `/auth/register-phone-code` |
| `/auth/register-phone` | Press back after email verification | `auth.leaveVerifiedStep` | Non-routeable leave confirmation |
| `/auth/register-password` | Press back after phone verification | `auth.leaveVerifiedStep` | Non-routeable leave confirmation |
| `/auth/register-phone`, `/auth/register-password` | Android/system back after verified step | `global.modalQueue` | Queued dirty-state Alert Dialog; confirm dispatches the original navigation action |
| `/auth`, `/auth/register`, `/auth/register-phone`, `/auth/register-password`, `/auth/forgot-password` | Submit invalid form | `auth.errorSheet` | Non-routeable error recovery sheet |
| `/auth/pin-setup` | Enter wrong unlock PIN or mismatched PIN | `auth.errorDialog` | Non-routeable blocking error dialog |
| `/markets` | Tap trading account selector | `tradingAccount.switchSheet` | Non-routeable selection sheet |
| `/trade`, `/portfolio` | Tap trading account selector | `tradingAccount.switchSheet` | Non-routeable selection sheet |
| `/funding/deposit`, `/funding/withdrawal`, `/funding/transfer` | Tap source or target account field | `tradingAccount.switchSheet` | Non-routeable selection sheet with disabled account reasons |
| `/funding/deposit`, `/funding/withdrawal` | Tap payment or payout method field | `funding.paymentMethodSheet` | Non-routeable method selection sheet |
| `/funding/deposit`, `/funding/withdrawal`, `/funding/transfer` | Submit funding form | `funding.submitFeedbackAlert` | Non-routeable queued Alert Dialog; handler navigates to `/funding/transactions/[id]` |
| `/funding/deposit`, `/funding/withdrawal`, `/funding/transfer` | Android/system back with entered amount or transfer target | `global.modalQueue` | Queued dirty-state Alert Dialog; confirm dispatches the original navigation action |
| `/quick` | Submit partner application or review pending partner status | `partner.upgradeFeedbackAlert` | Non-routeable queued Alert Dialog for role / permission state feedback |
| `/client/[id]` | Approve partner upgrade request | `partner.upgradeFeedbackAlert` | Non-routeable queued Alert Dialog for partner approval result |
| `/settings/security-log` | Tap device card | `security.deviceDetailSheet` | Non-routeable detail sheet |
| `/settings/security-log` | Tap revoke session | `security.revokeConfirmSheet` | Non-routeable high-risk confirmation sheet |
| `/settings/security-log` | Tap report suspicious event | `security.reportConfirmSheet` | Non-routeable high-risk confirmation sheet |
| `/settings/security-log` | Revoke/report result or blocked action | `global.modalQueue` | Non-routeable queued Alert Dialog for high-risk security feedback |
| `/trade`, `/portfolio` | Tap account menu | `portfolio.accountMenuSheet` | Non-routeable action sheet; may navigate to account child pages |
| `/trade`, `/portfolio` | Tap open position | `portfolio.positionDetailSheet` | Non-routeable position detail sheet |
| `/trade`, `/portfolio` | Tap pending order | `portfolio.pendingOrderDetailSheet` | Non-routeable pending order detail sheet |
| `/trade`, `/portfolio` | Tap close position | `portfolio.closePositionConfirm` | Non-routeable confirmation; never create a separate close route |
| `/trade`, `/portfolio` | Close position, modify pending order, delete pending order, or blocked mutation | `portfolio.orderMutationAlert` | Non-routeable queued Alert Dialog for high-risk trading mutation feedback |
| `/trade`, `/portfolio` | Modify or delete pending order | `portfolio.pendingOrderFeedbackToast` | Non-routeable toast feedback |
| `/account-details/[id]` | Tap more action | `account.moreActionSheet` | Non-routeable account action sheet |
| `/accounts`, `/account`, `/account-basic/[id]` | Tap metric description | `account.metricDescriptionSheet` | Non-routeable informational sheet |
| `/account-balance/[id]` | Tap balance transaction row | `account.balanceTransactionDetailSheet` | Non-routeable transaction detail sheet |
| `/quick` | Open quick actions menu | `quick.actionSheet` | Non-routeable shared BottomSheet action-menu preset with `QuickActionSheetContent` |
| Multiple pages | Show placeholder, blocked, success, or warning feedback | `global.toastFeedback` | Non-routeable toast feedback |
| `/order/[id]` | Submit, submit blocked, or dirty exit | `global.modalQueue` | Non-routeable queued Alert Dialog for high-risk trading feedback |
| `/instrument/[id]` | Open trading terminal chart full screen | `global.modalStack` | Non-routeable full-screen Modal Stack entry |
| Web select fields | Open select menu | `global.webSelectMenu` | Non-routeable web-only select menu |

## Trigger Classes

- Routeable flows: trading order ticket and current Discover layout editor.
- Non-routeable business sheets: quick actions, account selector, payment method selector, security detail, account menu, transaction detail.
- Non-routeable feedback and confirmations: auth errors, leave confirmation, close/delete confirmation, toast, tips, and demo-only feedback.
- Close/back behavior for routeable pages and modals is governed by `docs/page-navigation-policy.md`; routeable modals must provide a deterministic close fallback.
- Bottom-sheet class triggers must resolve to the shared `GlobalBottomSheetHost` or a shared preset content component, not a page-owned sheet shell. Auth confirmation dialogs, PIN error dialogs, and web select menus remain registered non-sheet exceptions.
