# Site Page Map

Source of truth: `src/navigation/routeRegistry.ts`.

This document is the review map for all current Expo Router page files. Layout and HTML infrastructure files are not product pages: `app/_layout.tsx`, `app/(tabs)/_layout.tsx`, and `app/+html.tsx`.

## Runtime Page Inventory

| Route path | Page component | Module | Permission | Navigation level | Primary actions | Related modals | Empty / loading / error states |
|---|---|---|---|---|---|---|---|
| `/` | `IndexRoute` | Launch | `guest` | root | Redirect to brand splash | None | Redirecting, error |
| `/brand-splash` | `BrandSplashScreen` | Launch | `guest` | root | Show brand intro, continue to launch | None | Default, redirecting, error |
| `/launch` | `LaunchScreen` | Launch | `guest` | root | Start login, start registration | `global.toastFeedback` | Default, loading, error |
| `/markets` | `MarketsScreen` | Markets | `signedIn.trader` | primary tab | Search instruments, switch trading account, open instrument detail | `tradingAccount.switchSheet`, `global.toastFeedback`, `global.webSelectMenu` | Loading, empty, error, permission denied, restricted |
| `/trade` | `PortfolioScreen` | Trading | `signedIn.trader` | primary tab | Review positions, close position, modify or delete order | `portfolio.accountMenuSheet`, `portfolio.closePositionConfirm`, `portfolio.pendingOrderDetailSheet`, `portfolio.pendingOrderFeedbackToast`, `portfolio.positionDetailSheet`, `tradingAccount.switchSheet`, `global.toastFeedback` | Loading, empty, error, permission denied, restricted |
| `/accounts` | `AccountScreen` | Accounts | `signedIn.trader` | primary tab | Inspect trading accounts, open account detail, review funding shortcuts | `account.metricDescriptionSheet`, `global.bottomSheet`, `global.toastFeedback` | Loading, empty, error, permission denied, restricted |
| `/discover` | `DupoinDiscoverScreen` | Discover | `guest` | primary tab | Browse discovery modules, open function entry, open layout settings | `discover.layout.route`, `global.toastFeedback` | Loading, empty, error |
| `/quick` | `DiscoverModuleScreen` | Discover | `signedIn.any` | primary tab | Show selected module, open order ticket, open partner tools, open PIN security setup from Me | `order.ticket.route`, `global.toastFeedback` | Loading, empty, error, permission denied, restricted |
| `/portfolio` | `PortfolioScreen` | Trading | `signedIn.trader` | hidden tab | Compatibility entry for trade workspace | `portfolio.accountMenuSheet`, `portfolio.closePositionConfirm`, `portfolio.pendingOrderDetailSheet`, `portfolio.pendingOrderFeedbackToast`, `portfolio.positionDetailSheet`, `tradingAccount.switchSheet`, `global.toastFeedback` | Loading, empty, error, permission denied, restricted |
| `/account` | `AccountScreen` | Accounts | `signedIn.trader` | hidden tab | Compatibility entry for account workspace | `account.metricDescriptionSheet`, `global.bottomSheet`, `global.toastFeedback` | Loading, empty, error, permission denied, restricted |
| `/partner-tools` | `PartnerToolsScreen` | Partner | `signedIn.partner` | hidden tab | Open partner module, review growth tools, open client workspace | `global.toastFeedback` | Loading, empty, error, permission denied, restricted |
| `/instrument/[id]` | `InstrumentDetailScreen` | Markets | `signedIn.trader` | detail | Review quote detail, switch detail tab, open buy or sell ticket | `order.ticket.route`, `global.toastFeedback` | Loading, error, not found, restricted |
| `/order/[id]` | `OrderTicketScreen` | Trading | `signedIn.trader` | modal route | Select side, edit lots, toggle risk controls, submit order | `order.ticket.route`, `global.toastFeedback` | Inputting, validating, submitting, success, failed, error, not found, restricted |
| `/client/[id]` | `ClientProfileScreen` | Partner | `signedIn.partner` | detail | Review client profile, approve upgrade request demo | `global.toastFeedback` | Loading, error, not found, permission denied, restricted, reviewing |
| `/partner/client-orders` | `PartnerClientsScreen` | Partner | `signedIn.partner` | detail | Review partner client order summary, open client profile, review upgrade request status | `global.toastFeedback` | Loading, empty, error, permission denied, restricted |
| `/partner/commission` | `CommissionScreen` | Partner | `signedIn.partner` | detail | Review pending rebates, settled rebates, and monthly commission details | None | Loading, empty, error, permission denied, restricted |
| `/discover-entry/[id]` | `DiscoverEntryScreen` | Discover | `guest` | detail | Review discovery entry details, return to Discover | `global.toastFeedback` | Loading, empty, error, not found |
| `/discover-layout` | `DiscoverLayoutScreen` | Discover | `signedIn.any` | modal route | Reorder modules, change display mode, save layout | `discover.layout.route` | Inputting, submitting, success, failed, error |
| `/account-details/[id]` | `AccountDetailsScreen` | Accounts | `signedIn.trader` | detail | Review metrics, open menu, open funding and account child pages | `account.moreActionSheet`, `global.toastFeedback` | Loading, empty, error, permission denied, restricted |
| `/account-basic/[id]` | `AccountBasicScreen` | Accounts | `signedIn.trader` | detail | Review basic profile, open metric description | `account.metricDescriptionSheet` | Loading, empty, error, permission denied, restricted |
| `/account-balance/[id]` | `AccountBalanceScreen` | Accounts | `signedIn.trader` | detail | Review balance trend, filter transactions, open transaction detail | `account.balanceTransactionDetailSheet` | Loading, empty, error, permission denied, restricted |
| `/account-orders/[id]` | `AccountOrdersScreen` | Accounts | `signedIn.trader` | detail | Review account order records | None | Loading, empty, error, permission denied, restricted |
| `/funding` | `FundingHomeScreen` | Funding | `signedIn.trader` | detail | Open deposit, withdrawal, transfer, transaction history | `global.toastFeedback` | Loading, empty, error, permission denied, restricted, reviewing |
| `/funding/deposit` | `DepositScreen` | Funding | `signedIn.trader` | detail | Select account, enter amount, select payment method, submit deposit | `tradingAccount.switchSheet`, `funding.paymentMethodSheet`, `funding.submitFeedbackToast`, `global.toastFeedback` | Inputting, validating, submitting, success, failed, error |
| `/funding/withdrawal` | `WithdrawalScreen` | Funding | `signedIn.trader` | detail | Select payout method, enter amount, select account, submit withdrawal | `tradingAccount.switchSheet`, `funding.paymentMethodSheet`, `funding.submitFeedbackToast`, `global.toastFeedback` | Inputting, validating, submitting, reviewing, success, failed, error, restricted |
| `/funding/transfer` | `TransferScreen` | Funding | `signedIn.trader` | detail | Select source account, enter amount, select target account, submit transfer | `tradingAccount.switchSheet`, `funding.submitFeedbackToast`, `global.toastFeedback` | Inputting, validating, submitting, success, failed, error, restricted |
| `/funding/transactions` | `FundingTransactionsScreen` | Funding | `signedIn.trader` | detail | Filter funding transactions, open detail | None | Loading, empty, error, permission denied, restricted |
| `/funding/transactions/[id]` | `FundingTransactionDetailScreen` | Funding | `signedIn.trader` | detail | Review status, timeline, support context | `global.toastFeedback` | Loading, error, not found, reviewing, restricted |
| `/settings` | `SettingsScreen` | Settings | `signedIn.any` | detail | Review profile module, open PIN security setup, open profile settings | `global.toastFeedback` | Loading, empty, error, permission denied, restricted |
| `/settings/security-log` | `SecurityLoginLogScreen` | Settings | `signedIn.any` | detail | Open device detail, revoke session, report suspicious event | `security.deviceDetailSheet`, `security.revokeConfirmSheet`, `security.reportConfirmSheet`, `global.toastFeedback` | Loading, empty, error, submitting, success, failed, restricted |
| `/appearance` | `AppearanceScreen` | Settings | `signedIn.any` | detail | Select system, light, or dark theme | None | Inputting, success, error |
| `/auth/onboarding` | `OnboardingScreen` | Auth | `guest` | root | Choose trader or partner onboarding, start registration, open login | `global.toastFeedback` | Loading, empty, error |
| `/auth` | `LoginScreen` | Auth | `guest` | root | Enter account, enter password, submit login, open forgot password | `auth.errorSheet`, `global.toastFeedback` | Inputting, validating, submitting, success, failed, error |
| `/auth/register` | `RegisterPhoneScreen` | Auth | `guest` | root | Select country, enter phone, confirm contact, continue to phone code | `auth.countryPicker`, `auth.contactConfirm`, `auth.errorSheet`, `global.toastFeedback` | Inputting, validating, submitting, success, failed, error |
| `/auth/register-email-code` | `RegisterEmailCodeScreen` | Auth | `guest` | root | Enter OTP, resend code, change email, open recovery help | `global.toastFeedback` | Inputting, validating, success, failed, expired, timeout, error |
| `/auth/register-phone` | `RegisterEmailScreen` | Auth | `guest` | root | Enter email after phone verification, confirm contact, continue to email code | `auth.contactConfirm`, `auth.errorSheet`, `auth.leaveVerifiedStep`, `global.toastFeedback` | Inputting, validating, submitting, success, failed, error |
| `/auth/register-phone-code` | `RegisterPhoneCodeScreen` | Auth | `guest` | root | Enter OTP, resend code, change phone, open recovery help | `global.toastFeedback` | Inputting, validating, success, failed, expired, timeout, error |
| `/auth/register-password` | `RegisterPasswordScreen` | Auth | `guest` | root | Enter password, confirm password, continue to optional PIN setup, leave verified step | `auth.errorSheet`, `auth.leaveVerifiedStep`, `global.toastFeedback` | Inputting, validating, submitting, success, failed, error |
| `/auth/forgot-password` | `ForgotPasswordScreen` | Auth | `guest` | root | Choose reset channel, verify code, set new password | `auth.countryPicker`, `auth.errorSheet`, `global.toastFeedback` | Inputting, validating, submitting, success, failed, expired, timeout, error |
| `/auth/pin-setup` | `PinSetupScreen` | Auth | `guest / signedIn.optional` | root | Create optional local PIN after registration, confirm PIN, unlock only after explicit local lock, skip setup, open from Me settings menu | `auth.errorDialog` | Inputting, validating, success, failed, restricted, bypassed |
| `/auth/verify` | `VerifyDeprecatedScreen` | Auth | `guest` | root | Redirect legacy verification entry to login | None | Redirecting, error |
| `/(not-found)` | `NotFoundScreen` | Navigation | `guest` | system | Explain missing route, return to app | None | Not found |

## Governance Notes

- All new page files under `app/**/*.tsx` must be represented in `routeRegistry`, except layout and HTML infrastructure.
- Every route entry must declare `topNavBehavior`; `back` routes must declare `backTarget`, and `close` routes must declare `closeTarget`.
- Page-level close/back behavior is governed in `docs/page-navigation-policy.md`.
- `relatedModals` must reference existing `modalRegistry` ids.
- Ordinary confirmation dialogs, error sheets, success feedback, toast, tips, and delete confirmations must stay in `modalRegistry` and must not become independent routes.
- Production RBAC is not yet connected; route entries with role-sensitive behavior use `permissionGap` until server-side entitlement and data-scope checks exist.
