# Modal Inventory

Source of truth: `src/navigation/modalRegistry.ts`.

| Modal ID | Routeable | Route path | Risk | Purpose |
|---|---|---|---|---|
| `order.ticket.route` | yes | `/order/[id]` | high | Transparent order ticket route for trading flow recovery and direct entry. |
| `discover.layout.route` | yes | `/discover-layout` | low | Route-backed Discover layout editor; demotion review required. |
| `auth.countryPicker` | no | N/A | low | Country picker for phone-based auth and reset flows. |
| `auth.contactConfirm` | no | N/A | medium | Confirm visible email or phone before OTP route. |
| `auth.leaveVerifiedStep` | no | N/A | medium | Confirm leaving a verified registration step. |
| `auth.errorSheet` | no | N/A | medium | Recover from invalid auth/reset form submission. |
| `auth.errorDialog` | no | N/A | high | Recover from local PIN mismatch or unlock failure. |
| `global.bottomSheet` | no | N/A | medium | Shared BottomSheet host and presets for all mobile bottom-sheet interactions. |
| `global.toastFeedback` | no | N/A | low | Feedback-only toast. |
| `global.webSelectMenu` | no | N/A | low | Web-only select option menu. |
| `quick.actionSheet` | no | N/A | medium | Quick actions content rendered through shared BottomSheet actionMenu preset. |
| `tradingAccount.switchSheet` | no | N/A | medium | Select an eligible trading account. |
| `funding.paymentMethodSheet` | no | N/A | high | Select deposit or withdrawal method. |
| `funding.submitFeedbackToast` | no | N/A | high | Show funding submit reference. |
| `security.deviceDetailSheet` | no | N/A | medium | Inspect remembered device detail. |
| `security.revokeConfirmSheet` | no | N/A | high | Confirm session revocation. |
| `security.reportConfirmSheet` | no | N/A | high | Confirm suspicious activity report. |
| `portfolio.accountMenuSheet` | no | N/A | medium | Open account child routes from portfolio. |
| `portfolio.positionDetailSheet` | no | N/A | high | Inspect position before action. |
| `portfolio.pendingOrderDetailSheet` | no | N/A | high | Inspect pending order before action. |
| `portfolio.closePositionConfirm` | no | N/A | high | Confirm local position close through shared `ConfirmActionSheet`. |
| `portfolio.pendingOrderFeedbackToast` | no | N/A | medium | Feedback after local pending order mutation. |
| `account.moreActionSheet` | no | N/A | medium | Account detail more actions. |
| `account.metricDescriptionSheet` | no | N/A | low | Informational metric explanation. |
| `account.balanceTransactionDetailSheet` | no | N/A | medium | Balance transaction detail. |
