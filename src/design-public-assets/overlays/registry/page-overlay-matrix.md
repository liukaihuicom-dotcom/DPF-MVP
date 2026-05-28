# Page Overlay Matrix

Source of truth: `src/navigation/routeRegistry.ts`, `src/navigation/modalRegistry.ts`, and `src/design-public-assets/overlays/registry/overlay-registry.json`.

| Page route | Overlay usage after stage 2 | Risk | Dirty state | Android back | Queue / stack |
|---|---|---:|---|---|---|
| `/trade` | `portfolio.positionDetailSheet`, `portfolio.pendingOrderDetailSheet`, `portfolio.closePositionConfirm`, `portfolio.orderMutationAlert`, `tradingAccount.switchSheet`, `global.modalQueue` | high | not applicable | sheet back plus queued alerts | BottomSheet Stack + Modal Queue |
| `/portfolio` | `portfolio.positionDetailSheet`, `portfolio.pendingOrderDetailSheet`, `portfolio.closePositionConfirm`, `portfolio.orderMutationAlert`, `tradingAccount.switchSheet`, `global.modalQueue` | high | not applicable | sheet back plus queued alerts | BottomSheet Stack + Modal Queue |
| `/order/[id]` | `order.ticket.route`, `trading.orderSubmitAlert`, `global.modalQueue` | high | guarded | queued dirty confirm | Modal Queue |
| `/funding/deposit` | `tradingAccount.switchSheet`, `funding.paymentMethodSheet`, `funding.submitFeedbackAlert`, `global.modalQueue` | high | guarded when amount entered | queued dirty confirm | Modal Queue |
| `/funding/withdrawal` | `tradingAccount.switchSheet`, `funding.paymentMethodSheet`, `funding.submitFeedbackAlert`, `global.modalQueue` | high | guarded when amount entered | queued dirty confirm | Modal Queue |
| `/funding/transfer` | `tradingAccount.switchSheet`, `funding.submitFeedbackAlert`, `global.modalQueue` | high | guarded when amount or target entered | queued dirty confirm | Modal Queue |
| `/settings/security-log` | `security.deviceDetailSheet`, `security.revokeConfirmSheet`, `security.reportConfirmSheet`, `security.resultAlert`, `global.modalQueue` | high | not applicable | sheet back plus queued alerts | BottomSheet Stack + Modal Queue |
| `/quick` | `order.ticket.route`, `partner.upgradeFeedbackAlert`, `quick.actionSheet`, `global.modalQueue`, `global.toastFeedback` | high | not applicable | queued partner role-change alerts | BottomSheet + Modal Queue |
| `/client/[id]` | `partner.upgradeFeedbackAlert`, `global.modalQueue`, `global.toastFeedback` | high | not applicable | queued partner approval alert | Modal Queue |
| `/auth/register-phone` | `auth.contactConfirm`, `auth.errorSheet`, `auth.leaveVerifiedStep`, `global.modalQueue` | medium | guarded after verified phone step | queued dirty confirm | Modal Queue |
| `/auth/register-password` | `auth.errorSheet`, `auth.leaveVerifiedStep`, `global.modalQueue` | medium | guarded after verified email step | queued dirty confirm | Modal Queue |
| `/instrument/[id]` | `order.ticket.route`, `global.modalStack`, `global.toastFeedback` | medium | not applicable | Modal Stack close | Modal Stack |

## Stage 2 Decisions

- Funding submit feedback was changed from `Toast` to queued `Alert Dialog`.
- Trading blocked/submitted feedback was changed from `Toast` to queued `Alert Dialog`; submission now requires a high-risk confirmation dialog.
- Portfolio close-position and pending-order mutation feedback was changed from `Toast` to queued `Alert Dialog`.
- Security revoke/report results were changed from `Toast` to queued `Alert Dialog`.
- Partner application, pending status, and approval feedback were changed from `Toast` to queued `Alert Dialog` because they change role / permission state.
- Full-screen chart modal was moved from a private React Native `Modal` call to the public `ModalStackProvider`.
- Overlay z-index values now bind to `zIndex` tokens instead of page-local constants.
